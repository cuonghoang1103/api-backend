/**
 * 6.3 — Lệnh log: show, stream, collect, --last/--start/--end, --style, --info/--debug, .logarchive (soạn 25/11/2026, agent Mac tiếp quản lgz).
 * Output thật: OUT['s06/show'] (+ s06/muc, s06/lab6, s06/predicate) — MacBook macOS 27.2.1, đã ẩn danh. Quan sát thật: --end bị bỏ qua
 * khi khoảng thời gian vắt qua một lần khởi động lại (đo 25/11 trên khoảng 19:09–19:16:30 ngày 24/11, cả compact lẫn ndjson).
 * Nguồn: man log(1), `log help show`, `log help predicates`.
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '6.3 — The log command: show, stream, collect, --last, --start, --style, --info/--debug, .logarchive|||6.3 — Lệnh log: show, stream, collect, --last, --start, --style, --info/--debug, .logarchive',
  slug: 'log-6-3-log-show-stream',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bốn động từ của lệnh log trên máy thật: show (lịch sử, --last/--start/--end, --info/--debug — 39 nghìn so với 61 nghìn dòng mỗi phút), stream (tái hiện lỗi), collect (.logarchive 243 MB cho 2 phút, mở lại bằng --archive) và năm kiểu xuất default/compact/syslog/json/ndjson nối jq (đuôi {"count","finished"}), --timezone UTC, --source ra tệp:dòng, thông điệp nhiều dòng làm hỏng grep/awk, cái bẫy --end bị bỏ qua khi vắt qua lần khởi động lại; sysdiagnose khi báo lỗi cho Apple.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.3</span>
<h2>The log command: show, stream, collect</h2>
<p class="lead">Console is for looking; <code>/usr/bin/log</code> is for working. Four verbs cover almost everything: <strong>show</strong> reads history, <strong>stream</strong> watches live, <strong>collect</strong> packs logs into a file you can send, and <strong>stats</strong> (lesson 6.1) measures the store. This lesson uses the messages our test apps wrote in 6.1–6.2.</p>

<h3>The everyday picture: a bank statement, a live notification, an exported PDF</h3>
<p>Your banking app has three ways to see money: scroll the <em>statement</em> for past months (show), watch <em>notifications</em> arrive as you pay (stream), and <em>export a PDF</em> for the accountant (collect). Same data, three jobs.</p>

<h3>Step 1 — how much is there? Always filter</h3>
${lenh('s06/show', 0)}
<p><strong>39,784 lines in one minute</strong> of default messages, 61,552 with info and debug, on a Mac that was mostly idle. Never run <code>log show</code> without <code>--last</code>/<code>--start</code> <em>and</em> a predicate, or you will wait minutes and drown. A predicate (lesson 6.4) is applied inside <code>log</code>, which is far faster than piping everything to <code>grep</code>.</p>

<h3>Step 2 — choosing the time window</h3>
<ul>
<li><code>--last 10m</code>, <code>--last 2h</code>, <code>--last 3d</code>, <code>--last boot</code> (since the current boot).</li>
<li><code>--start '2026-11-24 19:09:00'</code> and <code>--end '…'</code> — formats <code>'Y-M-D H:m:s'</code>, <code>'Y-M-D'</code>, <code>'@unixtime'</code>.</li>
<li><code>--today</code>, <code>--yesterday</code>, <code>--last24</code>.</li>
<li><code>--timezone UTC</code> (or <code>-Z</code>) prints times in another zone — essential before comparing with a server in UTC (lesson 1.5):</li>
</ul>
${lenh('s06/show', 3)}
<div class="pitfall co-tieu-de"><p><strong>"I gave it --end, so it stops there."</strong> Not always. On this Mac (macOS 27.2.1) a window that <em>spans a reboot</em> ignored <code>--end</code> completely: <code>--start 19:09 --end 19:16:30</code> on the day of a restart kept printing until the present — millions of lines (the Lab shows the counts). Inside one boot <code>--end</code> worked. Habit that protects you: keep windows small, add <code>| head</code> while exploring, and re-check the time range in <code>jq</code>/<code>awk</code> when the window crosses a reboot.</p></div>

<h3>Step 3 — output styles</h3>
${lenh('s06/show', 1)}
${lenh('s06/show', 2)}
<ul>
<li><strong>default</strong> — columns: thread, type in words (<code>Error</code>, <code>Fault</code>), activity ID, PID, <strong>TTL</strong> (days the message lives; the fault got 14). Microsecond timestamps with offset.</li>
<li><strong>compact</strong> — what we used in 6.1: short type codes, best for reading.</li>
<li><strong>syslog</strong> — looks like a classic syslog line (<code>host process[pid]:</code>). Useful when a tool or a colleague expects syslog. Note the host is printed as <code>localhost</code>.</li>
<li><strong>json</strong> — one big JSON array; <strong>ndjson</strong> — one JSON object per line, ready for <code>jq</code>. Prefer ndjson: it streams and does not need the whole output in memory.</li>
</ul>
${lenh('s06/show', 5)}
<p>Two details of ndjson that will bite your scripts: every record has <code>formatString</code> (here <code>Token = %{private,mask.hash}s</code> — the template before arguments, great for grouping identical messages), and the output <strong>ends with a summary object</strong> <code>{"count":7,"finished":1}</code> that has no message. Filter it out with <code>select(.eventMessage)</code>:</p>
${lenh('s06/show', 6)}
${lenh('s06/show', 7)}

<h3>Step 4 — more flags you will actually use</h3>
${lenh('s06/show', 4)}
<p><code>--source</code> adds <code>&lt;binary&#96;function (file:line)&gt;</code> for binaries built with debug information — the exact line that called the logger. <code>--process</code> (<code>-p</code>) is the short form for one process:</p>
${lenh('s06/show', 8)}
<p>(The <code>A</code> line is an activity that the system creates for every process; ignore it.) Others: <code>--info</code>/<code>--debug</code> (6.1), <code>--predicate</code> (6.4), <code>--color none</code> when piping, <code>--no-pager</code>.</p>

<h3>Step 5 — multi-line messages break line tools</h3>
${lenh('s06/show', 9)}
<p>In one minute, <strong>4,383 lines did not start with a date</strong>: they are continuation lines of messages that contain newlines (dictionaries, stack traces). <code>grep</code>, <code>awk '{print $4}'</code> and <code>uniq -c</code> silently miscount them. For counting and grouping, use <code>--style ndjson</code> + <code>jq</code>: one record = one line, newlines escaped inside the string.</p>

<h3>Step 6 — log stream while you reproduce</h3>
<p>Seen in 6.1: <code>log stream --level debug --predicate 'subsystem == "…"'</code>. The work pattern: window 1 runs the stream with a tight predicate, window 2 reproduces the bug. Add <code>--style compact</code>, and <code>--level info</code> or <code>--level debug</code> to see what is never stored. Stop with Ctrl-C. The same predicate later works in <code>log show</code> for what was stored.</p>

<h3>Step 7 — log collect: an archive to send</h3>
${lenh('s06/show', 10)}
${lenh('s06/show', 11)}
<p><code>log collect --last 2m --output x.logarchive</code> worked <strong>without sudo</strong> on this macOS release (older releases required root — if you get "must be run as root", use <code>sudo</code>). The archive is a folder (<code>.logarchive</code>) and was <strong>243 MB for two minutes</strong>, because it carries the format-string database (<code>uuidtext</code>) needed to read it anywhere. Read it on any Mac with <code>log show --archive</code> — the same flags and predicates work. Notice the archive held two faults: one from 6.1 and one from the run just before collecting — <code>--last 2m</code> is "about", not a precise cut.</p>
<div class="callout warn"><p><strong>An archive is the whole Mac's log for that window</strong> — every app, every subsystem. It can contain file names, network names, app usage. Treat it like a personal document: send it only to who needs it, through the company's channel, and delete it after. Never attach it to a public bug report.</p></div>

<h3>sysdiagnose: when Apple or IT asks for "everything"</h3>
<p><code>sudo sysdiagnose</code> (or the key combination Shift-Control-Option-Command-Period) builds a large archive: a logarchive, crash reports, network and power state, process lists. It takes minutes and hundreds of MB, and it is what Apple Feedback and enterprise IT ask for. Same privacy rule, more strongly.</p>

<h3>Real-life situations</h3>
<ul>
<li><strong>"The VPN client disconnected around 14:00."</strong> <code>log show --start '… 13:55' --end '… 14:05' --predicate 'process == "&lt;client&gt;"' --style compact</code>; if empty, widen to <code>subsystem BEGINSWITH "com.vendor"</code>.</li>
<li><strong>A user is remote, you cannot sit at their Mac.</strong> Ask them to run one <code>log collect --last 30m</code> right after the problem, then work on the archive on your machine.</li>
<li><strong>You need a chart of errors per hour.</strong> ndjson → <code>jq -r 'select(.messageType=="Error") | .timestamp[0:13]'</code> → <code>uniq -c</code>.</li>
</ul>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok"><ol>
<li>Count lines per minute for the last 5 minutes on your Mac, with and without <code>--info --debug</code>. Use ndjson so continuation lines do not count.</li>
<li>Run <code>log stream</code> for your own subsystem, emit three messages from another window, stop the stream, then find the same messages with <code>log show</code>.</li>
<li>Collect the last 3 minutes to an archive, check its size, and read your messages back from it with <code>--archive</code>. Delete the archive.</li>
<li>Print your app's messages as TSV: time (ms), type, category, message.</li>
</ol>
<p><strong>Done when:</strong> 1 uses <code>select(.eventMessage)</code>; 2 shows default messages in both but debug only in the stream; 3 finds your lines with the same predicate; 4 has four tab-separated columns.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['log show', 'Read stored history: --last, --start/--end, --info/--debug, --predicate, --style.'],
  ['log stream', 'Live view, also of levels never stored (--level debug).'],
  ['log collect', 'Pack logs into a .logarchive folder; read with log show --archive.'],
  ['ndjson', 'One JSON object per line; ends with {"count","finished"}.'],
  ['TTL', 'Days a stored message lives; shown in the default style.'],
  ['sysdiagnose', 'Large diagnostic bundle (logs + reports + system state) for Apple/IT.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Always give a time window and a predicate — tens of thousands of lines per minute.</li>
<li>compact to read, ndjson + jq to count, <code>--timezone UTC</code> to compare.</li>
<li>Re-check time ranges that cross a reboot.</li>
<li><code>log collect</code> makes a portable archive — big and personal.</li>
</ul>
${nguon('📘', 'Apple Developer — Logging', 'Then run "man log" and "log help show" on your Mac', 'https://developer.apple.com/documentation/os/logging')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-2-4-jq', title: 'Lesson 2.4 — jq', sub: 'select, @tsv, grouping — used here on ndjson', cta: 'Open lesson' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-7-3-journalctl-xuat', title: 'Lesson 7.3 — journalctl output formats', sub: 'The Linux twin of --style', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.3</span>
<h2>Lệnh log: show, stream, collect</h2>
<p class="lead">Console để nhìn; <code>/usr/bin/log</code> để làm việc. Bốn động từ phủ gần như mọi thứ: <strong>show</strong> đọc lịch sử, <strong>stream</strong> xem trực tiếp, <strong>collect</strong> đóng gói log thành tệp gửi được, và <strong>stats</strong> (bài 6.1) đo kho. Bài này dùng các thông điệp mà ứng dụng thử đã ghi ở bài 6.1–6.2.</p>

<h3>Liên tưởng đời thường: sao kê, thông báo trực tiếp, bản PDF xuất ra</h3>
<p>Ứng dụng ngân hàng có ba cách xem tiền: cuộn <em>sao kê</em> các tháng trước (show), nhìn <em>thông báo</em> hiện lên khi đang thanh toán (stream), và <em>xuất PDF</em> cho kế toán (collect). Cùng dữ liệu, ba việc.</p>

<h3>Bước 1 — có bao nhiêu? Luôn luôn lọc</h3>
${lenh('s06/show', 0)}
<p><strong>39.784 dòng trong một phút</strong> chỉ tính thông điệp default, 61.552 dòng khi có info và debug, trên một máy Mac gần như ngồi không. Đừng bao giờ chạy <code>log show</code> mà thiếu <code>--last</code>/<code>--start</code> <em>và</em> một predicate, không thì bạn sẽ chờ vài phút rồi chìm nghỉm. Predicate (bài 6.4) được áp bên trong <code>log</code>, nhanh hơn rất nhiều so với đổ hết sang <code>grep</code>.</p>

<h3>Bước 2 — chọn khung thời gian</h3>
<ul>
<li><code>--last 10m</code>, <code>--last 2h</code>, <code>--last 3d</code>, <code>--last boot</code> (từ lần khởi động hiện tại).</li>
<li><code>--start '2026-11-24 19:09:00'</code> và <code>--end '…'</code> — dạng <code>'Y-M-D H:m:s'</code>, <code>'Y-M-D'</code>, <code>'@unixtime'</code>.</li>
<li><code>--today</code>, <code>--yesterday</code>, <code>--last24</code>.</li>
<li><code>--timezone UTC</code> (hoặc <code>-Z</code>) in giờ theo múi khác — bắt buộc trước khi so với máy chủ chạy UTC (bài 1.5):</li>
</ul>
${lenh('s06/show', 3)}
<div class="pitfall co-tieu-de"><p><strong>"Đã cho --end thì nó dừng ở đó."</strong> Không phải lúc nào cũng vậy. Trên máy Mac này (macOS 27.2.1), một khoảng thời gian <em>vắt qua một lần khởi động lại</em> đã bỏ qua <code>--end</code> hoàn toàn: <code>--start 19:09 --end 19:16:30</code> vào hôm có lần khởi động lại cứ in tới tận hiện tại — hàng triệu dòng (Lab có số đếm). Trong cùng một lần khởi động thì <code>--end</code> chạy đúng. Thói quen bảo vệ bạn: giữ khoảng nhỏ, thêm <code>| head</code> khi đang dò, và kiểm lại khoảng thời gian bằng <code>jq</code>/<code>awk</code> khi khoảng đó vắt qua lần khởi động lại.</p></div>

<h3>Bước 3 — các kiểu xuất</h3>
${lenh('s06/show', 1)}
${lenh('s06/show', 2)}
<ul>
<li><strong>default</strong> — các cột: luồng, loại bằng chữ (<code>Error</code>, <code>Fault</code>), mã activity, PID, <strong>TTL</strong> (số ngày thông điệp được sống; dòng fault được 14). Giờ tới micro giây kèm độ lệch múi giờ.</li>
<li><strong>compact</strong> — kiểu ta dùng ở bài 6.1: mã loại ngắn, dễ đọc nhất.</li>
<li><strong>syslog</strong> — trông như dòng syslog cổ điển (<code>máy tiến-trình[pid]:</code>). Có ích khi một công cụ hay đồng nghiệp chờ định dạng syslog. Để ý tên máy in ra là <code>localhost</code>.</li>
<li><strong>json</strong> — một mảng JSON lớn; <strong>ndjson</strong> — mỗi dòng một đối tượng JSON, sẵn cho <code>jq</code>. Ưu tiên ndjson: nó chảy dần, không cần giữ cả output trong bộ nhớ.</li>
</ul>
${lenh('s06/show', 5)}
<p>Hai chi tiết của ndjson sẽ làm vấp script của bạn: mỗi bản ghi có <code>formatString</code> (ở đây <code>Token = %{private,mask.hash}s</code> — khuôn trước khi điền tham số, rất tiện để gom các thông điệp giống nhau), và output <strong>kết thúc bằng một đối tượng tổng kết</strong> <code>{"count":7,"finished":1}</code> không có thông điệp. Loại nó bằng <code>select(.eventMessage)</code>:</p>
${lenh('s06/show', 6)}
${lenh('s06/show', 7)}

<h3>Bước 4 — thêm vài cờ thật sự sẽ dùng</h3>
${lenh('s06/show', 4)}
<p><code>--source</code> thêm <code>&lt;tệp-chạy&#96;hàm (tệp:dòng)&gt;</code> cho tệp chạy dịch kèm thông tin gỡ lỗi — đúng dòng đã gọi hàm log. <code>--process</code> (<code>-p</code>) là dạng ngắn cho một tiến trình:</p>
${lenh('s06/show', 8)}
<p>(Dòng <code>A</code> là activity hệ thống tạo cho mọi tiến trình; bỏ qua.) Các cờ khác: <code>--info</code>/<code>--debug</code> (6.1), <code>--predicate</code> (6.4), <code>--color none</code> khi nối ống, <code>--no-pager</code>.</p>

<h3>Bước 5 — thông điệp nhiều dòng làm hỏng công cụ theo dòng</h3>
${lenh('s06/show', 9)}
<p>Trong một phút, <strong>4.383 dòng không bắt đầu bằng ngày tháng</strong>: đó là dòng nối tiếp của những thông điệp chứa ký tự xuống dòng (từ điển, stack trace). <code>grep</code>, <code>awk '{print $4}'</code> và <code>uniq -c</code> âm thầm đếm sai. Để đếm và gom nhóm, dùng <code>--style ndjson</code> + <code>jq</code>: một bản ghi = một dòng, ký tự xuống dòng đã được thoát bên trong chuỗi.</p>

<h3>Bước 6 — log stream trong lúc tái hiện lỗi</h3>
<p>Đã thấy ở 6.1: <code>log stream --level debug --predicate 'subsystem == "…"'</code>. Cách làm việc: cửa sổ 1 chạy luồng trực tiếp với predicate chặt, cửa sổ 2 tái hiện lỗi. Thêm <code>--style compact</code>, và <code>--level info</code> hoặc <code>--level debug</code> để thấy thứ không bao giờ được lưu. Dừng bằng Ctrl-C. Cùng predicate đó dùng lại được trong <code>log show</code> cho phần đã lưu.</p>

<h3>Bước 7 — log collect: một bản lưu để gửi</h3>
${lenh('s06/show', 10)}
${lenh('s06/show', 11)}
<p><code>log collect --last 2m --output x.logarchive</code> chạy được <strong>không cần sudo</strong> trên bản macOS này (bản cũ hơn đòi root — nếu gặp "must be run as root" thì dùng <code>sudo</code>). Bản lưu là một thư mục (<code>.logarchive</code>) và nặng <strong>243 MB cho hai phút</strong>, vì nó mang theo kho chuỗi định dạng (<code>uuidtext</code>) cần để đọc ở bất kỳ đâu. Đọc trên Mac nào cũng được bằng <code>log show --archive</code> — cờ và predicate y như cũ. Để ý bản lưu có hai dòng fault: một từ 6.1 và một từ lần chạy ngay trước khi thu — <code>--last 2m</code> là "khoảng chừng", không phải nhát cắt chính xác.</p>
<div class="callout warn"><p><strong>Một bản lưu là log của cả máy Mac trong khoảng đó</strong> — mọi ứng dụng, mọi subsystem. Nó có thể chứa tên tệp, tên mạng, thói quen dùng ứng dụng. Đối xử như giấy tờ cá nhân: chỉ gửi cho người cần, qua kênh của công ty, và xoá sau khi xong. Đừng bao giờ đính kèm nó vào báo lỗi công khai.</p></div>

<h3>sysdiagnose: khi Apple hay IT xin "tất cả"</h3>
<p><code>sudo sysdiagnose</code> (hoặc tổ hợp phím Shift-Control-Option-Command-Dấu chấm) dựng một gói lớn: một logarchive, báo cáo crash, trạng thái mạng và nguồn điện, danh sách tiến trình. Mất vài phút và hàng trăm MB, và đó là thứ Apple Feedback cùng IT doanh nghiệp yêu cầu. Cùng luật riêng tư, còn chặt hơn.</p>

<h3>Tình huống đi làm</h3>
<ul>
<li><strong>"VPN tự ngắt khoảng 14:00."</strong> <code>log show --start '… 13:55' --end '… 14:05' --predicate 'process == "&lt;client&gt;"' --style compact</code>; nếu rỗng, nới ra <code>subsystem BEGINSWITH "com.vendor"</code>.</li>
<li><strong>Người dùng ở xa, bạn không ngồi được trước máy họ.</strong> Nhờ họ chạy một lệnh <code>log collect --last 30m</code> ngay sau khi lỗi xảy ra, rồi bạn làm việc trên bản lưu ở máy mình.</li>
<li><strong>Cần biểu đồ lỗi theo giờ.</strong> ndjson → <code>jq -r 'select(.messageType=="Error") | .timestamp[0:13]'</code> → <code>uniq -c</code>.</li>
</ul>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
<li>Đếm số dòng mỗi phút trong 5 phút qua trên Mac của bạn, có và không có <code>--info --debug</code>. Dùng ndjson để dòng nối tiếp không bị đếm.</li>
<li>Chạy <code>log stream</code> cho subsystem của bạn, phát ba thông điệp từ cửa sổ khác, dừng luồng, rồi tìm lại chúng bằng <code>log show</code>.</li>
<li>Thu 3 phút gần nhất vào một bản lưu, xem dung lượng, và đọc lại thông điệp của bạn từ đó bằng <code>--archive</code>. Xoá bản lưu.</li>
<li>In thông điệp của ứng dụng bạn dạng TSV: giờ (ms), loại, category, thông điệp.</li>
</ol>
<p><strong>Đạt khi:</strong> câu 1 có <code>select(.eventMessage)</code>; câu 2 thấy thông điệp default ở cả hai nhưng debug chỉ trong luồng trực tiếp; câu 3 tìm thấy dòng của bạn bằng đúng predicate cũ; câu 4 có bốn cột ngăn bằng tab.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['log show', 'Đọc lịch sử đã lưu: --last, --start/--end, --info/--debug, --predicate, --style.'],
  ['log stream', 'Xem trực tiếp, kể cả các mức không bao giờ lưu (--level debug).'],
  ['log collect', 'Đóng gói log thành thư mục .logarchive; đọc bằng log show --archive.'],
  ['ndjson', 'Mỗi dòng một đối tượng JSON; kết thúc bằng {"count","finished"}.'],
  ['TTL', 'Số ngày một thông điệp đã lưu được sống; hiện ở kiểu default.'],
  ['sysdiagnose', 'Gói chẩn đoán lớn (log + báo cáo + trạng thái hệ thống) cho Apple/IT.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Luôn cho khung thời gian và predicate — hàng chục nghìn dòng mỗi phút.</li>
<li>compact để đọc, ndjson + jq để đếm, <code>--timezone UTC</code> để so.</li>
<li>Kiểm lại khoảng thời gian vắt qua lần khởi động lại.</li>
<li><code>log collect</code> tạo bản lưu mang đi được — nặng và mang tính cá nhân.</li>
</ul>
${nguon('📘', 'Apple Developer — Logging', 'Rồi chạy "man log" và "log help show" trên Mac của bạn', 'https://developer.apple.com/documentation/os/logging')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-2-4-jq', title: 'Bài 2.4 — jq', sub: 'select, @tsv, gom nhóm — dùng ở đây trên ndjson', cta: 'Mở bài' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-7-3-journalctl-xuat', title: 'Bài 7.3 — Định dạng xuất của journalctl', sub: 'Người anh em Linux của --style', cta: 'Mở bài' })}
</div>
`,
};
