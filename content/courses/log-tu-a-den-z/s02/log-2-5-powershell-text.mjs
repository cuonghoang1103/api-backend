/**
 * 2.5 — PowerShell cho log văn bản (soạn 22/11/2026).
 * Output: OUT['s02/ps-text.ps'] — PowerShell 7.7 (Linux arm64, container) trên cùng gói log mẫu; cú pháp và kết quả giống
 * PowerShell 7 trên Windows (Windows PowerShell 5.1 có sẵn cũng chạy được các lệnh này, trừ khác biệt nhỏ về định dạng hiển thị).
 * Nguồn: Microsoft Learn (Select-String, Group-Object, Measure-Object, ConvertFrom-Json, Import-Csv/ConvertFrom-Csv,
 * IIS W3C logging — giờ UTC; Windows Firewall log — "#Time Format: Local").
 * Không trùng: lnx-15-4-powershell-cho-nguoi-biet-bash (nền PowerShell).
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '2.5 — PowerShell for text logs: Select-String, Import-Csv, ConvertFrom-Json, Group-Object, Measure-Object|||2.5 — PowerShell cho log văn bản: Select-String, Import-Csv, ConvertFrom-Json, Group-Object, Measure-Object',
  slug: 'log-2-5-powershell-text',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Windows không có grep: Select-String với -Pattern, -Context, Matches; tư duy đối tượng thay vì chuỗi — Group-Object | Sort-Object Count thay cho sort | uniq -c; Import-Csv cho bản xuất Event Viewer, ConvertFrom-Json cho log JSON, Measure-Object cho trung bình/lớn nhất; đọc log IIS định dạng W3C (giờ UTC) và pfirewall.log (giờ địa phương) bằng dòng #Fields làm tiêu đề — chạy thật bằng PowerShell 7.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.5</span>
<h2>PowerShell for text logs: the same questions, answered with objects</h2>
<p class="lead">On a Windows server you may have no <code>grep</code>, no <code>awk</code> and no permission to install them — but you always have PowerShell. Its idea is different from bash: commands pass <em>objects</em> with named properties, not lines of text. Once you see that, the count-sort-cut recipe from lesson 2.3 becomes one readable pipeline. All outputs below were produced by PowerShell 7 on the same sample pack.</p>

<h3>The everyday picture: a spreadsheet instead of a notepad</h3>
<p>In bash you cut text into columns every time. In PowerShell each line can become a row of a spreadsheet with named columns, and then you "group by column", "sort by Count", "average of column" — like Excel's filter and pivot, but typed.</p>

<h3>Step 1 — Select-String is grep</h3>
${lenh('s02/ps-text.ps', 0)}
<p><code>Select-String</code> returns one <em>MatchInfo</em> object per matching line; <code>.Count</code> counts them (bash: <code>grep -c</code>). Patterns are regular expressions (.NET flavour, very close to <code>grep -E</code>) and case-insensitive by default — add <code>-CaseSensitive</code> when it matters. <code>-SimpleMatch</code> is the equivalent of <code>grep -F</code>.</p>
${lenh('s02/ps-text.ps', 1)}
<p><code>-Context 1,1</code> = one line before and after (bash: <code>-B 1 -A 1</code>). The object keeps them separately in <code>.Context.PreContext</code> and <code>.Context.PostContext</code>; the matching line is <code>.Line</code>.</p>

<h3>Step 2 — Group-Object is sort | uniq -c</h3>
${lenh('s02/ps-text.ps', 2)}
<p>Read it as a sentence: find the first non-space run on each line (<code>'^\\S+'</code>, the IP); take the matched value; <strong>group</strong> identical values (<code>-NoElement</code> keeps only the count, saving memory); <strong>sort</strong> by the <code>Count</code> property, descending; take the first 3. Same answer as <code>awk | sort | uniq -c | sort -nr | head</code> — and no separate "sort before uniq" trap, because grouping does not need neighbours.</p>

<h3>Step 3 — reading the end of a file</h3>
${lenh('s02/ps-text.ps', 3)}
<p><code>-Tail</code> reads from the end without loading the whole file (lesson 2.1). Add <code>-Wait</code> to keep following.</p>

<h3>Step 4 — CSV, JSON: let PowerShell parse the format</h3>
${lenh('s02/ps-text.ps', 4)}
<p><code>Import-Csv</code> turns each row into an object with the header names as properties — the Windows event export from Lesson 1.2 becomes a table you can filter (<code>Where-Object Id -eq 41</code>). Remember the time column is still local time as text (lesson 1.5).</p>
${lenh('s02/ps-text.ps', 5)}
${lenh('s02/ps-text.ps', 6)}
<p><code>ConvertFrom-Json</code> parses each JSON line into an object, so <code>Where-Object level -ge 50</code> filters by field (bash: <code>jq 'select(.level &gt;= 50)'</code>). <code>Measure-Object</code> computes count, average, maximum, sum — the same 81.59 ms average jq gave. Unlike <code>jq -R 'fromjson?'</code>, one bad line makes <code>ConvertFrom-Json</code> throw an error; wrap it in <code>try { … } catch { }</code> per line for messy logs.</p>

<h3>Step 5 — W3C logs: IIS and the Windows Firewall</h3>
<p>IIS (Microsoft's web server) and the Windows Firewall write <strong>W3C extended</strong> logs: comment lines starting with <code>#</code>, one of which, <code>#Fields:</code>, names the space-separated columns. The trick: use that line as the header.</p>
${lenh('s02/ps-text.ps', 7)}
<p>Step by step: find the <code>#Fields:</code> line and split it into names (<code>$f</code>); take the data lines (not starting with <code>#</code>); <code>ConvertFrom-Csv -Delimiter ' ' -Header $f</code> makes objects with properties like <code>sc-status</code> and <code>time-taken</code> (quote names that contain a hyphen); filter status ≥ 500. The failing page is <code>/portal/report.aspx</code>, and it took 4–11 seconds (<code>time-taken</code> is in milliseconds) before failing — slow, then broken.</p>
${lenh('s02/ps-text.ps', 8)}
<p>The firewall log answers "who knocked on which port?": 50 dropped connection attempts from <code>203.0.113.70</code> to port 3389 — Remote Desktop. Grouping by two properties (<code>'src-ip', 'dst-port'</code>) gives the pair in one step. Chapter 11 turns this into a detection.</p>
<div class="pitfall co-tieu-de"><p><strong>Two W3C logs, two clocks.</strong> IIS writes W3C times in <strong>UTC</strong> by default, while <code>pfirewall.log</code> says <code>#Time Format: Local</code> in its own header. Same format family, different zones — read the header before comparing times (lesson 1.5).</p></div>

<h3>Bash ↔ PowerShell cheat sheet</h3>
<table>
<thead><tr><th>bash</th><th>PowerShell</th></tr></thead>
<tbody>
<tr><td><code>grep -c 'x' f</code></td><td><code>(Select-String -Path f -Pattern 'x').Count</code></td></tr>
<tr><td><code>grep -v 'x' f</code></td><td><code>Select-String -Path f -Pattern 'x' -NotMatch</code></td></tr>
<tr><td><code>grep -F 'a.b' f</code></td><td><code>Select-String -Path f -Pattern 'a.b' -SimpleMatch</code></td></tr>
<tr><td><code>… | sort | uniq -c | sort -nr | head -n 5</code></td><td><code>… | Group-Object -NoElement | Sort-Object Count -Descending | Select-Object -First 5</code></td></tr>
<tr><td><code>tail -n 50 -F f</code></td><td><code>Get-Content f -Tail 50 -Wait</code></td></tr>
<tr><td><code>jq 'select(.level &gt;= 50)'</code></td><td><code>Get-Content f | ConvertFrom-Json | Where-Object level -ge 50</code></td></tr>
<tr><td><code>awk '{s+=$10} END {print s}'</code></td><td><code>… | Measure-Object -Sum</code></td></tr>
<tr><td><code>wc -l f</code></td><td><code>(Get-Content f).Count</code> or <code>Get-Content f | Measure-Object -Line</code></td></tr>
</tbody></table>

<h3>🧪 Practice (20 min) — on Windows, or PowerShell 7 on Mac/Linux</h3>
<div class="callout ok"><ol>
<li>Open PowerShell in the <code>log-lab</code> folder (on Windows via <code>\\\\wsl.localhost\\…</code> or a Windows copy of the pack). Count the 401 responses in <code>web/access.log</code> with <code>Select-String</code>.</li>
<li>Find the top 3 User-Agents with the fewest requests (split each line on <code>'"'</code> and take element 5, as in Lab 2).</li>
<li>In the IIS log, compute the average <code>time-taken</code> for <code>/portal/report.aspx</code> with <code>Measure-Object -Average</code>, separately for status 200 and 500.</li>
<li>From <code>pfirewall.log</code>, show the first and last time of the dropped attempts to port 3389.</li>
</ol>
<p><strong>Done when:</strong> you got 420, the three rare User-Agents match lesson 2.3 (the JNDI probe, Nikto, python-requests), the 500s are far slower than the 200s, and you can name the first and last DROP times.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['object pipeline', 'PowerShell passes objects with properties between commands, not plain text.'],
  ['MatchInfo', 'The object Select-String returns: Line, LineNumber, Matches, Context.'],
  ['Group-Object', 'Groups objects with equal values; Count tells how many.'],
  ['W3C extended log', 'Space-separated log with a #Fields: header (IIS, Windows Firewall).'],
  ['time-taken', 'IIS field: milliseconds the server spent on a request.'],
  ['-SimpleMatch', 'Select-String without regex, like grep -F.'],
])}

<h3>📌 Summary</h3>
<ul>
<li><code>Select-String</code> = grep (case-insensitive by default; <code>-Context</code>, <code>-NotMatch</code>, <code>-SimpleMatch</code>).</li>
<li><code>Group-Object | Sort-Object Count -Descending</code> = <code>sort | uniq -c | sort -nr</code>.</li>
<li><code>Import-Csv</code>, <code>ConvertFrom-Json</code>, <code>ConvertFrom-Csv -Header</code> turn logs into objects; <code>Measure-Object</code> does statistics.</li>
<li>W3C logs: use the <code>#Fields:</code> line as the header; IIS times are UTC, firewall times local.</li>
<li>Same questions, same answers as bash — choose by where you are, not by habit.</li>
</ul>
${nguon('📘', 'Microsoft Learn — Select-String', 'Pattern, Context, NotMatch, SimpleMatch, MatchInfo', 'https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/select-string')}
${nguon('📘', 'Microsoft Learn — Group-Object', 'Grouping by one or more properties, -NoElement', 'https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/group-object')}
${nguon('📘', 'Microsoft Learn — IIS log file formats (W3C)', 'Fields such as sc-status and time-taken; W3C times in UTC', 'https://learn.microsoft.com/en-us/previous-versions/iis/6.0-sdk/ms525807(v=vs.90)')}
${lienKet({ khoa: 'linux-bash', bai: 'lnx-15-4-powershell-cho-nguoi-biet-bash', title: 'Linux &amp; Bash 15.4 — PowerShell for bash users', sub: 'PowerShell fundamentals: objects, pipeline, providers', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.5</span>
<h2>PowerShell cho log văn bản: cùng những câu hỏi, trả lời bằng đối tượng</h2>
<p class="lead">Trên một server Windows có thể chẳng có <code>grep</code>, chẳng có <code>awk</code> và không có quyền cài — nhưng lúc nào cũng có PowerShell. Ý tưởng của nó khác bash: các lệnh truyền cho nhau <em>đối tượng</em> có thuộc tính mang tên, không phải dòng chữ. Nhìn ra điều đó rồi thì công thức đếm-xếp-cắt ở bài 2.3 thành một đường ống dễ đọc. Mọi output dưới đây do PowerShell 7 chạy trên cùng gói log mẫu.</p>

<h3>Liên tưởng đời thường: bảng tính thay cho sổ tay</h3>
<p>Ở bash, lần nào bạn cũng phải tự cắt chữ thành cột. Ở PowerShell, mỗi dòng có thể thành một hàng của bảng tính với các cột có tên, rồi bạn "gom theo cột", "xếp theo Count", "trung bình của cột" — giống bộ lọc và pivot của Excel, nhưng gõ bằng lệnh.</p>

<h3>Bước 1 — Select-String chính là grep</h3>
${lenh('s02/ps-text.ps', 0)}
<p><code>Select-String</code> trả về một đối tượng <em>MatchInfo</em> cho mỗi dòng khớp; <code>.Count</code> đếm chúng (bash: <code>grep -c</code>). Mẫu là biểu thức chính quy (kiểu .NET, rất gần <code>grep -E</code>) và mặc định không phân biệt hoa thường — thêm <code>-CaseSensitive</code> khi cần. <code>-SimpleMatch</code> tương đương <code>grep -F</code>.</p>
${lenh('s02/ps-text.ps', 1)}
<p><code>-Context 1,1</code> = một dòng trước và một dòng sau (bash: <code>-B 1 -A 1</code>). Đối tượng giữ chúng riêng trong <code>.Context.PreContext</code> và <code>.Context.PostContext</code>; dòng khớp là <code>.Line</code>.</p>

<h3>Bước 2 — Group-Object chính là sort | uniq -c</h3>
${lenh('s02/ps-text.ps', 2)}
<p>Đọc như một câu: tìm cụm không có dấu cách đầu tiên của mỗi dòng (<code>'^\\S+'</code>, tức IP); lấy giá trị khớp; <strong>gom nhóm</strong> các giá trị giống nhau (<code>-NoElement</code> chỉ giữ số đếm, đỡ tốn bộ nhớ); <strong>xếp</strong> theo thuộc tính <code>Count</code>, giảm dần; lấy 3 cái đầu. Cùng đáp án với <code>awk | sort | uniq -c | sort -nr | head</code> — và không có bẫy "phải sort trước uniq", vì gom nhóm không cần các dòng nằm cạnh nhau.</p>

<h3>Bước 3 — đọc phần cuối tệp</h3>
${lenh('s02/ps-text.ps', 3)}
<p><code>-Tail</code> đọc từ cuối mà không nạp cả tệp (bài 2.1). Thêm <code>-Wait</code> để bám tiếp.</p>

<h3>Bước 4 — CSV, JSON: để PowerShell tự hiểu định dạng</h3>
${lenh('s02/ps-text.ps', 4)}
<p><code>Import-Csv</code> biến mỗi hàng thành một đối tượng với tên cột làm thuộc tính — bản xuất sự kiện Windows ở bài 1.2 thành một bảng lọc được (<code>Where-Object Id -eq 41</code>). Nhớ rằng cột thời điểm vẫn là giờ địa phương dạng chữ (bài 1.5).</p>
${lenh('s02/ps-text.ps', 5)}
${lenh('s02/ps-text.ps', 6)}
<p><code>ConvertFrom-Json</code> phân tích mỗi dòng JSON thành đối tượng, nên <code>Where-Object level -ge 50</code> lọc theo trường (bash: <code>jq 'select(.level &gt;= 50)'</code>). <code>Measure-Object</code> tính số lượng, trung bình, lớn nhất, tổng — ra đúng 81,59 ms trung bình như jq. Khác với <code>jq -R 'fromjson?'</code>, chỉ một dòng hỏng là <code>ConvertFrom-Json</code> báo lỗi; với log lộn xộn, bọc từng dòng trong <code>try { … } catch { }</code>.</p>

<h3>Bước 5 — log W3C: IIS và Windows Firewall</h3>
<p>IIS (web server của Microsoft) và Windows Firewall ghi log <strong>W3C mở rộng</strong>: các dòng chú thích bắt đầu bằng <code>#</code>, trong đó dòng <code>#Fields:</code> đặt tên cho các cột ngăn bằng dấu cách. Mẹo: dùng chính dòng đó làm tiêu đề.</p>
${lenh('s02/ps-text.ps', 7)}
<p>Từng bước: tìm dòng <code>#Fields:</code> và tách thành các tên (<code>$f</code>); lấy các dòng dữ liệu (không bắt đầu bằng <code>#</code>); <code>ConvertFrom-Csv -Delimiter ' ' -Header $f</code> dựng đối tượng với thuộc tính như <code>sc-status</code>, <code>time-taken</code> (tên có gạch nối thì đặt trong nháy); lọc mã ≥ 500. Trang hỏng là <code>/portal/report.aspx</code>, và nó mất 4–11 giây (<code>time-taken</code> tính bằng mili giây) rồi mới lỗi — chậm, rồi hỏng.</p>
${lenh('s02/ps-text.ps', 8)}
<p>Log tường lửa trả lời "ai gõ cửa cổng nào?": 50 lần kết nối bị chặn từ <code>203.0.113.70</code> tới cổng 3389 — Remote Desktop. Gom theo hai thuộc tính (<code>'src-ip', 'dst-port'</code>) cho ra cặp đó trong một bước. Chương 11 biến nó thành một luật phát hiện.</p>
<div class="pitfall co-tieu-de"><p><strong>Hai log W3C, hai đồng hồ.</strong> IIS mặc định ghi giờ W3C theo <strong>UTC</strong>, còn <code>pfirewall.log</code> tự ghi trong tiêu đề <code>#Time Format: Local</code>. Cùng một họ định dạng, khác múi giờ — đọc tiêu đề trước khi so giờ (bài 1.5).</p></div>

<h3>Bảng đối chiếu bash ↔ PowerShell</h3>
<table>
<thead><tr><th>bash</th><th>PowerShell</th></tr></thead>
<tbody>
<tr><td><code>grep -c 'x' f</code></td><td><code>(Select-String -Path f -Pattern 'x').Count</code></td></tr>
<tr><td><code>grep -v 'x' f</code></td><td><code>Select-String -Path f -Pattern 'x' -NotMatch</code></td></tr>
<tr><td><code>grep -F 'a.b' f</code></td><td><code>Select-String -Path f -Pattern 'a.b' -SimpleMatch</code></td></tr>
<tr><td><code>… | sort | uniq -c | sort -nr | head -n 5</code></td><td><code>… | Group-Object -NoElement | Sort-Object Count -Descending | Select-Object -First 5</code></td></tr>
<tr><td><code>tail -n 50 -F f</code></td><td><code>Get-Content f -Tail 50 -Wait</code></td></tr>
<tr><td><code>jq 'select(.level &gt;= 50)'</code></td><td><code>Get-Content f | ConvertFrom-Json | Where-Object level -ge 50</code></td></tr>
<tr><td><code>awk '{s+=$10} END {print s}'</code></td><td><code>… | Measure-Object -Sum</code></td></tr>
<tr><td><code>wc -l f</code></td><td><code>(Get-Content f).Count</code> hoặc <code>Get-Content f | Measure-Object -Line</code></td></tr>
</tbody></table>

<h3>🧪 Thực hành (20 phút) — trên Windows, hoặc PowerShell 7 trên Mac/Linux</h3>
<div class="callout ok"><ol>
<li>Mở PowerShell trong thư mục <code>log-lab</code> (trên Windows qua <code>\\\\wsl.localhost\\…</code> hoặc một bản sao của gói trên Windows). Đếm phản hồi 401 trong <code>web/access.log</code> bằng <code>Select-String</code>.</li>
<li>Tìm 3 User-Agent có ít request nhất (tách mỗi dòng theo <code>'"'</code> và lấy phần tử thứ 5, như ở Lab 2).</li>
<li>Trong log IIS, tính <code>time-taken</code> trung bình của <code>/portal/report.aspx</code> bằng <code>Measure-Object -Average</code>, riêng cho mã 200 và mã 500.</li>
<li>Từ <code>pfirewall.log</code>, cho biết thời điểm đầu và cuối của các lần bị chặn tới cổng 3389.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn ra 420, ba User-Agent hiếm khớp với bài 2.3 (chuỗi dò JNDI, Nikto, python-requests), các mã 500 chậm hơn hẳn mã 200, và bạn nói được giờ DROP đầu và cuối.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['object pipeline (đường ống đối tượng)', 'PowerShell truyền đối tượng có thuộc tính giữa các lệnh, không phải chữ thường.'],
  ['MatchInfo', 'Đối tượng Select-String trả về: Line, LineNumber, Matches, Context.'],
  ['Group-Object', 'Gom các đối tượng có giá trị bằng nhau; Count cho biết bao nhiêu.'],
  ['W3C extended log', 'Log ngăn bằng dấu cách có tiêu đề #Fields: (IIS, Windows Firewall).'],
  ['time-taken', 'Trường của IIS: số mili giây server xử lý một request.'],
  ['-SimpleMatch', 'Select-String không dùng regex, như grep -F.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>Select-String</code> = grep (mặc định không phân biệt hoa thường; <code>-Context</code>, <code>-NotMatch</code>, <code>-SimpleMatch</code>).</li>
<li><code>Group-Object | Sort-Object Count -Descending</code> = <code>sort | uniq -c | sort -nr</code>.</li>
<li><code>Import-Csv</code>, <code>ConvertFrom-Json</code>, <code>ConvertFrom-Csv -Header</code> biến log thành đối tượng; <code>Measure-Object</code> làm thống kê.</li>
<li>Log W3C: lấy dòng <code>#Fields:</code> làm tiêu đề; giờ IIS là UTC, giờ tường lửa là địa phương.</li>
<li>Cùng câu hỏi, cùng đáp án như bash — chọn theo nơi bạn đang đứng, không theo thói quen.</li>
</ul>
${nguon('📘', 'Microsoft Learn — Select-String', 'Pattern, Context, NotMatch, SimpleMatch, MatchInfo', 'https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/select-string')}
${nguon('📘', 'Microsoft Learn — Group-Object', 'Gom theo một hay nhiều thuộc tính, -NoElement', 'https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/group-object')}
${nguon('📘', 'Microsoft Learn — định dạng log IIS (W3C)', 'Các trường như sc-status, time-taken; giờ W3C theo UTC', 'https://learn.microsoft.com/en-us/previous-versions/iis/6.0-sdk/ms525807(v=vs.90)')}
${lienKet({ khoa: 'linux-bash', bai: 'lnx-15-4-powershell-cho-nguoi-biet-bash', title: 'Linux &amp; Bash 15.4 — PowerShell cho người biết bash', sub: 'Nền tảng PowerShell: đối tượng, đường ống, provider' })}
</div>
`,
};
