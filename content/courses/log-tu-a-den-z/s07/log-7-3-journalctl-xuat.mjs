/**
 * 7.3 — Định dạng xuất và trường của journalctl (soạn 24/11/2026, agent lgz).
 * Output thật: OUT['s07/xuat'] — máy ảo lab7 (Ubuntu 24.04, systemd 255, jq 1.7).
 * SỬA 25/11/2026 (phiên 28): -F bỏ qua -b/-u/-p — kiểm thật _demo/s07/bt-7-3b.out.txt (container lgz-c07) ⇒ sửa đoạn Bước 4, Đạt khi câu 2–3, thuật ngữ, tóm tắt (EN+VI). Cùng lúc khớp lại số với xuat.out.txt (04:18:38/41, 6,3 ms, 346.954301; ghi chú -n 2 chuyển sang with-unit).
 * Nguồn: man journalctl(1) (--output=, --output-fields=, -F, -D/--file, --utc), systemd.io JOURNAL_EXPORT_FORMATS (JSON: giá trị không phải UTF-8 thành mảng số).
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '7.3 — Output formats and fields: -o short-iso, verbose, json, cat; --output-fields, -F, --utc|||7.3 — Định dạng xuất và trường: -o short-iso, verbose, json, cat; --output-fields, -F, --utc',
  slug: 'log-7-3-journalctl-xuat',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Cùng một bản ghi, nhiều cách in: short (không có năm!), short-iso, --utc, short-precise, short-monotonic để so với dmesg, cat để nối jq, with-unit, verbose; JSON của journal (mọi giá trị là chuỗi, mốc giờ µs), --output-fields, -F để biết trường có những giá trị nào; đếm lỗi theo unit bằng jq và hai cái bẫy thật: bản ghi không có PRIORITY làm jq lỗi, MESSAGE không phải UTF-8 thành mảng số; mang journal của máy khác về đọc bằng -D/--file; góc bảo mật khi gửi log cho người ngoài.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.3</span>
<h2>Output formats and fields: the same record, printed the way your next step needs</h2>
<p class="lead">journalctl stores records and prints a <em>view</em> of them. Choosing the view is not cosmetic: the default view hides the year and the time zone, cuts sub-seconds, and mixes badly with jq. This lesson shows every format you will use, how to list the values a field can take, how to count with jq — with two real traps — and how to read a journal that was copied from another machine.</p>

<h3>The everyday picture: one bank account, many statements</h3>
<p>Your bank keeps one set of transactions. You can ask for a short SMS ("−350 000 đ, 04:18"), a full PDF statement with every column, or a CSV file for Excel. Same data, different purpose. <code>-o</code> picks the statement type.</p>

<h3>Step 1 — the "short" family</h3>
${lenh('s07/xuat', 0)}
${lenh('s07/xuat', 1)}
${lenh('s07/xuat', 2)}
${lenh('s07/xuat', 3)}
${lenh('s07/xuat', 4)}
<table>
<thead><tr><th>Format</th><th>Shows</th><th>Use it when</th></tr></thead>
<tbody>
<tr><td><code>short</code> (default)</td><td><code>Nov 24 04:18:38</code> — local time, <strong>no year, no zone</strong></td><td>Quick look on the machine itself</td></tr>
<tr><td><code>short-iso</code></td><td><code>2026-11-24T04:18:38+07:00</code></td><td>Anything you paste into a ticket, compare across machines, sort</td></tr>
<tr><td><code>--utc</code> (with any format)</td><td><code>2026-11-23T21:18:38+00:00</code> — same instant</td><td>Comparing with nginx/cloud/other zones (lesson 1.5)</td></tr>
<tr><td><code>short-precise</code>, <code>short-iso-precise</code></td><td>microseconds</td><td>Ordering events in the same second (two lines at 04:18:38 are 6.3 ms apart)</td></tr>
<tr><td><code>short-monotonic</code></td><td><code>[  346.954301]</code> seconds since boot</td><td>Matching with <code>dmesg</code> without <code>-T</code>; immune to clock changes</td></tr>
<tr><td><code>short-unix</code></td><td>epoch seconds with decimals</td><td>Feeding scripts</td></tr>
</tbody></table>
<p><code>-n 2</code> always means "the last two <em>now</em>": the <code>with-unit</code> output in step 2 shows <code>/api/orders/1075</code> at 04:18:41 instead of 1074 only because new requests arrived between the commands.</p>

<h3>Step 2 — message only, or unit name</h3>
${lenh('s07/xuat', 5)}
${lenh('s07/xuat', 6)}
<p><code>-o cat</code> prints just <code>MESSAGE</code>. That is the format to use when the application writes JSON lines to stdout: <code>journalctl -u app -o cat | jq …</code> (if some lines are not JSON, <code>jq -R 'fromjson?'</code> from lesson 2.4). <code>with-unit</code> shows the unit name instead of the tag, useful when several units run the same binary (<code>python3[…]</code> tells you nothing).</p>

<h3>Step 3 — verbose and JSON: every field</h3>
<p><code>-o verbose</code> (lesson 7.1) is for humans. For tools, use JSON — one record per line:</p>
${lenh('s07/xuat', 7)}
${lenh('s07/xuat', 8)}
${lenh('s07/xuat', 9)}
<ul>
<li><strong>Every value is a string</strong>, even numbers: <code>"PRIORITY":"6"</code>, <code>"_PID":"424"</code>. Compare with <code>tonumber</code>.</li>
<li><code>__REALTIME_TIMESTAMP</code> is <strong>microseconds</strong> since epoch: divide by 1 000 000 for <code>todate</code>. jq prints UTC (<code>21:18:41Z</code> = 04:18:41 at +07).</li>
<li><code>--output-fields=</code> trims the record, but the address fields (<code>__CURSOR</code>, timestamps, <code>_BOOT_ID</code>) always stay.</li>
<li><code>json-pretty</code> for reading one record, <code>json-sse</code> / <code>json-seq</code> for streaming to other programs, <code>export</code> for the binary-safe format that <code>systemd-journal-remote</code> imports.</li>
</ul>

<h3>Step 4 — -F: which values does a field have?</h3>
${lenh('s07/xuat', 10)}
${lenh('s07/xuat', 11)}
${lenh('s07/xuat', 12)}
<p><code>-F FIELD</code> lists every distinct value stored for that field — instant, because the journal indexes values. On a server you do not know: <code>-F _SYSTEMD_UNIT</code> = every service that ever logged; <code>-F PRIORITY</code> = which levels exist (here 2–7: something even logged at <em>crit</em>); <code>-F _COMM</code> = every program name that ever logged (spot something strange like <code>nc</code> or <code>xmrig</code>).</p>
<p>⚠️ <strong><code>-F</code> ignores every filter</strong> — <code>-b</code>, <code>-u</code>, <code>-p</code> — and lists values from the <em>whole</em> journal: the <code>-b</code> in the third command above changes nothing (sd_journal_query_unique(3): the unique-value query is “not influenced by matches”). Tested 25/11/2026 on systemd 255: <code>journalctl -p crit -F SYSLOG_IDENTIFIER</code> printed all 8 identifiers while <code>-p crit</code> held one record; a field match such as <code>_SYSTEMD_UNIT=ssh.service</code> next to <code>-F</code> is refused (<code>Extraneous arguments</code>). For the values inside one boot, unit or level, go through JSON: <code>journalctl -b -p crit -o json | jq -r '._COMM' | sort -u</code>.</p>

<h3>Step 5 — counting with jq, and two real traps</h3>
${lenh('s07/xuat', 13)}
<p>Trap 1: jq printed three errors <em>and</em> a result. Some records have no <code>PRIORITY</code> at all, <code>null | tonumber</code> fails, jq skips that input and goes on — the count is still right here, but on other queries a skipped record changes the answer. Who are they?</p>
${lenh('s07/xuat', 14)}
${lenh('s07/xuat', 15)}
<p>The three <code>logger --journald</code> records from lesson 7.1: the native protocol does not force a priority. Always give a default: <code>.PRIORITY // "6"</code>. Result: 20 errors from shop-api, 5 from the kernel (the floppy probe), 1 from systemd. Counting messages by shape works the same way:</p>
${lenh('s07/xuat', 16)}
${lenh('s07/xuat', 17)}
<p>Trap 2: messages that are not valid UTF-8.</p>
${lenh('s07/xuat', 18)}
${lenh('s07/xuat', 19)}
${lenh('s07/xuat', 20)}
${lenh('s07/xuat', 21)}
<p>A message containing bytes <code>0xff 0xfe</code> is printed as <code>[24B blob data]</code> in text views, and in JSON its <code>MESSAGE</code> becomes an <strong>array of numbers</strong> (one per byte) instead of a string. A jq filter like <code>.MESSAGE | test("scan")</code> then crashes or silently skips it — exactly the lines an attacker's scanner or a broken client produced. <code>implode</code> turns the array back into text for reading (bytes above 127 show as Latin-1 characters); <code>journalctl --all</code> prints blobs in text views too.</p>

<h3>Step 6 — reading a journal from another machine</h3>
${lenh('s07/xuat', 22)}
${lenh('s07/xuat', 23)}
${lenh('s07/xuat', 24)}
<p>Copy the <code>.journal</code> files (from a dead VM's disk, a backup, a colleague's zip) into a folder and point journalctl at it with <code>-D folder</code>, or at single files with <code>--file</code>. All filters work. Here we copied only the archived <code>system@…</code> files, so boot 0 stops at 04:13:02 (the rest is in the active <code>system.journal</code>) and the oldest boot — in the <code>.journal~</code> file — is missing. When you collect evidence, copy the whole folder, including <code>~</code> files, and record a hash (lesson 16.4).</p>

<h3>Security corner: a journal export is a copy of everything</h3>
<p>A full <code>journalctl -o export</code> or a zip of <code>/var/log/journal</code> contains every command run with sudo (<code>COMMAND=…</code>, with arguments, sometimes passwords typed on the command line), user names, IP addresses, and whatever applications printed — tokens included if a developer logged a request. That is why the files are readable only by root and the <code>systemd-journal</code>/<code>adm</code> groups. Before you send logs to a vendor or paste them in a public issue: export only what is needed (<code>-u app --since … --until …</code>), in text (<code>-o short-iso --utc</code>), then search it for <code>password</code>, <code>token</code>, <code>Authorization</code>, <code>Bearer</code>, <code>@</code> and internal host names. Lesson 9.3 tells the 2023 Okta case, where a support file containing session tokens was the way in.</p>

<h3>Real-life situations</h3>
<ul>
<li><strong>The customer's ops team asks for "the logs of last night":</strong> <code>journalctl -u app --since "2026-11-24 22:00" --until "2026-11-25 06:00" -o short-iso --utc --no-pager &gt; app-2026-11-24.txt</code>, check for secrets, then send. Never the whole journal.</li>
<li><strong>Your app logs JSON to stdout under systemd:</strong> <code>journalctl -u app -o cat | jq -R 'fromjson? | select(.level=="error")'</code>. The journal's PRIORITY is useless for it (lesson 7.2).</li>
<li><strong>Times don't line up between the app server and the database server:</strong> print both with <code>-o short-iso-precise --utc</code> before concluding anything.</li>
</ul>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok"><ol>
<li>Print the last 3 lines of <code>ssh.service</code> in four formats: short, short-iso, <code>--utc</code>, short-monotonic. Explain each timestamp.</li>
<li>With <code>-F</code>, list every unit that logged on your VM, and every priority in use. Which unit logged at priority 2 or lower?</li>
<li>With <code>-o json | jq</code>, count records per <code>_TRANSPORT</code> in the current boot (remember the <code>//</code> default).</li>
<li>Write one message with a non-UTF-8 byte, then find it with a jq filter that does not crash.</li>
<li>Copy your journal folder to <code>/tmp/copy</code>, run <code>journalctl -D /tmp/copy --list-boots</code> and compare with the live list.</li>
</ol>
<p><strong>Done when:</strong> 1 names local time, UTC and seconds-since-boot correctly; 2 reads <code>journalctl -p 0..2</code> (or <code>-p 0..2 -o json | jq</code>) — not <code>-p 0..2 -F _SYSTEMD_UNIT</code>, which ignores <code>-p</code> and lists every unit; 3 prints counts for at least <code>stdout</code>, <code>syslog</code>, <code>kernel</code>, <code>journal</code> (in a container: no <code>kernel</code> — it shares the host kernel — and commands run by <code>podman exec</code> produce no <code>stdout</code>); 4 handles <code>type == "array"</code>; 5 explains any difference.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['-o short-iso', 'Timestamp with date, time and zone offset; the format for tickets and comparisons.'],
  ['--utc', 'Print times in UTC, with any output format.'],
  ['-o cat', 'Only MESSAGE; use when the app itself logs JSON lines.'],
  ['-o json', 'One record per line, all fields, all values as strings; timestamps in µs.'],
  ['--output-fields=', 'Limit printed fields (address fields always remain).'],
  ['-F FIELD', 'List every distinct value of a field in the whole journal — ignores -b, -u, -p.'],
  ['blob data', 'A non-UTF-8 value: hidden in text views, an array of byte numbers in JSON.'],
  ['-D DIR / --file', 'Read journal files from another place (copied, from another machine).'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Default <code>short</code> has no year and no zone — use <code>short-iso</code> (and <code>--utc</code>) for anything you share.</li>
<li><code>short-monotonic</code> matches dmesg; <code>-precise</code> orders events within a second.</li>
<li><code>-o cat</code> for app JSON, <code>-o json</code> for tools; values are strings, time in µs.</li>
<li><code>-F</code> lists values of a field instantly — first command on an unknown server; it ignores filters, so per boot/unit/level use <code>-o json | jq</code>.</li>
<li>In jq, default missing <code>PRIORITY</code> and handle array <code>MESSAGE</code>.</li>
<li>Read copied journals with <code>-D</code>; export only what is needed and scrub secrets before sending.</li>
</ul>
${nguon('📘', 'journalctl(1) — output options', '-o, --output-fields, -F, -D, --file, --utc', 'https://man7.org/linux/man-pages/man1/journalctl.1.html')}
${nguon('📘', 'Journal Export Formats', 'JSON and export format, how binary values are encoded', 'https://systemd.io/JOURNAL_EXPORT_FORMATS/')}
${nguon('📘', 'sd_journal_query_unique(3)', 'Why -F ignores -b, -u, -p: unique-value queries are not influenced by matches', 'https://man7.org/linux/man-pages/man3/sd_journal_query_unique.3.html')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-2-4-jq', title: '2.4 — jq for JSON logs', sub: 'select, group_by, fromjson? — used here on the journal', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.3</span>
<h2>Định dạng xuất và trường: cùng một bản ghi, in theo kiểu bước tiếp theo của bạn cần</h2>
<p class="lead">journalctl lưu bản ghi và in ra một <em>cách nhìn</em> của chúng. Chọn cách nhìn không phải chuyện trang trí: cách mặc định giấu năm và múi giờ, cắt phần dưới giây, và đi với jq rất tệ. Bài này cho thấy mọi định dạng bạn sẽ dùng, cách liệt kê các giá trị một trường có, cách đếm bằng jq — kèm hai cái bẫy thật — và cách đọc một journal chép từ máy khác.</p>

<h3>Liên tưởng đời thường: một tài khoản ngân hàng, nhiều kiểu sao kê</h3>
<p>Ngân hàng giữ một bộ giao dịch. Bạn có thể xin tin nhắn ngắn ("−350 000 đ, 04:18"), sao kê PDF đầy đủ mọi cột, hoặc tệp CSV để mở Excel. Cùng dữ liệu, khác mục đích. <code>-o</code> chọn kiểu sao kê.</p>

<h3>Bước 1 — họ "short"</h3>
${lenh('s07/xuat', 0)}
${lenh('s07/xuat', 1)}
${lenh('s07/xuat', 2)}
${lenh('s07/xuat', 3)}
${lenh('s07/xuat', 4)}
<table>
<thead><tr><th>Định dạng</th><th>Hiện gì</th><th>Dùng khi</th></tr></thead>
<tbody>
<tr><td><code>short</code> (mặc định)</td><td><code>Nov 24 04:18:38</code> — giờ địa phương, <strong>không năm, không múi giờ</strong></td><td>Xem nhanh ngay trên máy đó</td></tr>
<tr><td><code>short-iso</code></td><td><code>2026-11-24T04:18:38+07:00</code></td><td>Mọi thứ dán vào ticket, so giữa các máy, sắp xếp</td></tr>
<tr><td><code>--utc</code> (đi với định dạng nào cũng được)</td><td><code>2026-11-23T21:18:38+00:00</code> — cùng một thời điểm</td><td>So với nginx/cloud/múi giờ khác (bài 1.5)</td></tr>
<tr><td><code>short-precise</code>, <code>short-iso-precise</code></td><td>tới micro giây</td><td>Xếp thứ tự sự kiện trong cùng một giây (hai dòng lúc 04:18:38 cách nhau 6,3 ms)</td></tr>
<tr><td><code>short-monotonic</code></td><td><code>[  346.954301]</code> giây kể từ lúc khởi động</td><td>Đối chiếu với <code>dmesg</code> không có <code>-T</code>; không bị ảnh hưởng khi chỉnh đồng hồ</td></tr>
<tr><td><code>short-unix</code></td><td>giây epoch có phần thập phân</td><td>Đưa vào script</td></tr>
</tbody></table>
<p><code>-n 2</code> luôn nghĩa là "hai dòng cuối <em>ngay lúc này</em>": output <code>with-unit</code> ở bước 2 ra <code>/api/orders/1075</code> lúc 04:18:41 thay cho 1074 chỉ vì có request mới tới giữa các lệnh.</p>

<h3>Bước 2 — chỉ thông điệp, hoặc tên unit</h3>
${lenh('s07/xuat', 5)}
${lenh('s07/xuat', 6)}
<p><code>-o cat</code> chỉ in <code>MESSAGE</code>. Đó là định dạng dùng khi ứng dụng tự ghi JSON lines ra stdout: <code>journalctl -u app -o cat | jq …</code> (nếu có dòng không phải JSON, dùng <code>jq -R 'fromjson?'</code> ở bài 2.4). <code>with-unit</code> hiện tên unit thay cho nhãn, có ích khi nhiều unit chạy cùng một chương trình (<code>python3[…]</code> chẳng nói được gì).</p>

<h3>Bước 3 — verbose và JSON: mọi trường</h3>
<p><code>-o verbose</code> (bài 7.1) dành cho người đọc. Cho công cụ thì dùng JSON — mỗi bản ghi một dòng:</p>
${lenh('s07/xuat', 7)}
${lenh('s07/xuat', 8)}
${lenh('s07/xuat', 9)}
<ul>
<li><strong>Mọi giá trị đều là chuỗi</strong>, kể cả số: <code>"PRIORITY":"6"</code>, <code>"_PID":"424"</code>. So sánh thì dùng <code>tonumber</code>.</li>
<li><code>__REALTIME_TIMESTAMP</code> là <strong>micro giây</strong> từ epoch: chia 1 000 000 rồi mới <code>todate</code>. jq in giờ UTC (<code>21:18:41Z</code> = 04:18:41 ở +07).</li>
<li><code>--output-fields=</code> rút gọn bản ghi, nhưng các trường địa chỉ (<code>__CURSOR</code>, mốc giờ, <code>_BOOT_ID</code>) luôn còn lại.</li>
<li><code>json-pretty</code> để đọc một bản ghi, <code>json-sse</code> / <code>json-seq</code> để truyền liên tục sang chương trình khác, <code>export</code> cho định dạng an toàn với dữ liệu nhị phân mà <code>systemd-journal-remote</code> nhập được.</li>
</ul>

<h3>Bước 4 — -F: một trường có những giá trị nào?</h3>
${lenh('s07/xuat', 10)}
${lenh('s07/xuat', 11)}
${lenh('s07/xuat', 12)}
<p><code>-F TRƯỜNG</code> liệt kê mọi giá trị khác nhau đã lưu của trường đó — tức thì, vì journal đánh chỉ mục theo giá trị. Trên một máy chủ lạ: <code>-F _SYSTEMD_UNIT</code> = mọi dịch vụ từng ghi log; <code>-F PRIORITY</code> = những mức đang có (ở đây 2–7: có thứ đã ghi tới mức <em>crit</em>); <code>-F _COMM</code> = mọi tên chương trình từng ghi log (phát hiện thứ lạ như <code>nc</code> hay <code>xmrig</code>).</p>
<p>⚠️ <strong><code>-F</code> bỏ qua MỌI bộ lọc</strong> — <code>-b</code>, <code>-u</code>, <code>-p</code> — và liệt kê giá trị của <em>cả</em> journal: chữ <code>-b</code> trong lệnh thứ ba ở trên không đổi gì (sd_journal_query_unique(3): truy vấn giá trị khác nhau “không chịu ảnh hưởng của match”). Đã thử 25/11/2026 trên systemd 255: <code>journalctl -p crit -F SYSLOG_IDENTIFIER</code> in đủ 8 nhãn trong khi <code>-p crit</code> chỉ có một bản ghi; viết match trường như <code>_SYSTEMD_UNIT=ssh.service</code> cạnh <code>-F</code> thì bị từ chối (<code>Extraneous arguments</code>). Cần giá trị trong một lần khởi động, một unit hay một mức thì đi qua JSON: <code>journalctl -b -p crit -o json | jq -r '._COMM' | sort -u</code>.</p>

<h3>Bước 5 — đếm bằng jq, và hai cái bẫy thật</h3>
${lenh('s07/xuat', 13)}
<p>Bẫy 1: jq in ra ba lỗi <em>và</em> một kết quả. Có bản ghi hoàn toàn không có <code>PRIORITY</code>, <code>null | tonumber</code> hỏng, jq bỏ qua bản ghi đó rồi chạy tiếp — ở đây số đếm vẫn đúng, nhưng với câu hỏi khác một bản ghi bị bỏ qua sẽ đổi đáp án. Đó là những bản ghi nào?</p>
${lenh('s07/xuat', 14)}
${lenh('s07/xuat', 15)}
<p>Ba bản ghi <code>logger --journald</code> ở bài 7.1: giao thức gốc không bắt buộc có mức. Luôn cho giá trị mặc định: <code>.PRIORITY // "6"</code>. Kết quả: 20 lỗi từ shop-api, 5 từ nhân (vụ dò ổ đĩa mềm), 1 từ systemd. Đếm thông điệp theo hình dạng cũng làm y như vậy:</p>
${lenh('s07/xuat', 16)}
${lenh('s07/xuat', 17)}
<p>Bẫy 2: thông điệp không phải UTF-8 hợp lệ.</p>
${lenh('s07/xuat', 18)}
${lenh('s07/xuat', 19)}
${lenh('s07/xuat', 20)}
${lenh('s07/xuat', 21)}
<p>Thông điệp chứa byte <code>0xff 0xfe</code> được in thành <code>[24B blob data]</code> ở các cách nhìn dạng chữ, còn trong JSON <code>MESSAGE</code> của nó thành <strong>một mảng số</strong> (mỗi byte một số) thay vì chuỗi. Một bộ lọc jq như <code>.MESSAGE | test("scan")</code> khi đó sẽ lỗi hoặc lặng lẽ bỏ qua — đúng những dòng mà máy quét của kẻ tấn công hay một client hỏng tạo ra. <code>implode</code> đổi mảng về lại chữ để đọc (byte trên 127 hiện thành ký tự Latin-1); <code>journalctl --all</code> cũng in cả blob trong cách nhìn dạng chữ.</p>

<h3>Bước 6 — đọc journal của máy khác</h3>
${lenh('s07/xuat', 22)}
${lenh('s07/xuat', 23)}
${lenh('s07/xuat', 24)}
<p>Chép các tệp <code>.journal</code> (từ đĩa của máy ảo đã chết, từ bản sao lưu, từ tệp zip của đồng nghiệp) vào một thư mục rồi chỉ journalctl tới đó bằng <code>-D thư-mục</code>, hoặc tới từng tệp bằng <code>--file</code>. Mọi bộ lọc vẫn chạy. Ở đây ta chỉ chép các tệp đã lưu trữ <code>system@…</code>, nên lần 0 dừng ở 04:13:02 (phần còn lại nằm trong <code>system.journal</code> đang ghi) và lần khởi động cũ nhất — nằm trong tệp <code>.journal~</code> — bị thiếu. Khi thu thập bằng chứng, chép cả thư mục, kể cả tệp có <code>~</code>, và ghi lại mã băm (bài 16.4).</p>

<h3>Góc bảo mật: tệp xuất journal là bản sao của mọi thứ</h3>
<p>Một tệp <code>journalctl -o export</code> đầy đủ hay một zip của <code>/var/log/journal</code> chứa mọi lệnh chạy bằng sudo (<code>COMMAND=…</code>, kèm đối số, đôi khi cả mật khẩu gõ trên dòng lệnh), tên người dùng, địa chỉ IP, và mọi thứ ứng dụng in ra — có cả token nếu lập trình viên lỡ log một request. Vì thế các tệp chỉ root và nhóm <code>systemd-journal</code>/<code>adm</code> đọc được. Trước khi gửi log cho nhà cung cấp hay dán vào một issue công khai: chỉ xuất phần cần (<code>-u app --since … --until …</code>), dạng chữ (<code>-o short-iso --utc</code>), rồi tìm trong đó <code>password</code>, <code>token</code>, <code>Authorization</code>, <code>Bearer</code>, <code>@</code> và tên máy nội bộ. Bài 9.3 kể vụ Okta năm 2023, khi một tệp gửi bộ phận hỗ trợ chứa token phiên chính là cửa vào.</p>

<h3>Tình huống đời thật</h3>
<ul>
<li><strong>Đội vận hành của khách xin "log đêm qua":</strong> <code>journalctl -u app --since "2026-11-24 22:00" --until "2026-11-25 06:00" -o short-iso --utc --no-pager &gt; app-2026-11-24.txt</code>, soát bí mật, rồi mới gửi. Không bao giờ gửi cả journal.</li>
<li><strong>App của bạn ghi JSON ra stdout dưới systemd:</strong> <code>journalctl -u app -o cat | jq -R 'fromjson? | select(.level=="error")'</code>. PRIORITY của journal vô dụng với nó (bài 7.2).</li>
<li><strong>Giờ trên máy app và máy CSDL không khớp nhau:</strong> in cả hai bằng <code>-o short-iso-precise --utc</code> trước khi kết luận gì.</li>
</ul>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
<li>In 3 dòng cuối của <code>ssh.service</code> ở bốn định dạng: short, short-iso, <code>--utc</code>, short-monotonic. Giải thích từng mốc giờ.</li>
<li>Dùng <code>-F</code>, liệt kê mọi unit đã ghi log trên máy ảo, và mọi mức đang dùng. Unit nào đã ghi ở mức 2 hoặc thấp hơn?</li>
<li>Dùng <code>-o json | jq</code>, đếm số bản ghi theo <code>_TRANSPORT</code> trong lần khởi động hiện tại (nhớ giá trị mặc định <code>//</code>).</li>
<li>Ghi một thông điệp có byte không phải UTF-8, rồi tìm nó bằng một bộ lọc jq không bị lỗi.</li>
<li>Chép thư mục journal sang <code>/tmp/copy</code>, chạy <code>journalctl -D /tmp/copy --list-boots</code> và so với danh sách trên máy.</li>
</ol>
<p><strong>Đạt khi:</strong> câu 1 gọi đúng giờ địa phương, UTC và giây-từ-lúc-khởi-động; câu 2 đọc <code>journalctl -p 0..2</code> (hoặc <code>-p 0..2 -o json | jq</code>) — không phải <code>-p 0..2 -F _SYSTEMD_UNIT</code>, vì lệnh đó bỏ qua <code>-p</code> và in mọi unit; câu 3 in được số đếm ít nhất cho <code>stdout</code>, <code>syslog</code>, <code>kernel</code>, <code>journal</code> (trong container: không có <code>kernel</code> — dùng chung nhân máy chủ — và lệnh chạy qua <code>podman exec</code> không sinh <code>stdout</code>); câu 4 xử lý <code>type == "array"</code>; câu 5 giải thích được mọi chỗ khác nhau.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['-o short-iso', 'Mốc giờ có ngày, giờ và độ lệch múi giờ; định dạng cho ticket và so sánh.'],
  ['--utc', 'In giờ theo UTC, đi với mọi định dạng.'],
  ['-o cat', 'Chỉ MESSAGE; dùng khi app tự ghi JSON lines.'],
  ['-o json', 'Mỗi bản ghi một dòng, mọi trường, mọi giá trị là chuỗi; mốc giờ tính bằng µs.'],
  ['--output-fields=', 'Giới hạn trường được in (trường địa chỉ luôn còn).'],
  ['-F TRƯỜNG', 'Liệt kê mọi giá trị khác nhau của một trường trong cả journal — bỏ qua -b, -u, -p.'],
  ['blob data', 'Giá trị không phải UTF-8: bị giấu ở dạng chữ, thành mảng số byte trong JSON.'],
  ['-D THƯ-MỤC / --file', 'Đọc tệp journal ở nơi khác (đã chép, từ máy khác).'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>short</code> mặc định không có năm, không có múi giờ — dùng <code>short-iso</code> (và <code>--utc</code>) cho mọi thứ đem chia sẻ.</li>
<li><code>short-monotonic</code> khớp với dmesg; <code>-precise</code> xếp thứ tự trong cùng một giây.</li>
<li><code>-o cat</code> cho JSON của app, <code>-o json</code> cho công cụ; giá trị là chuỗi, giờ tính bằng µs.</li>
<li><code>-F</code> liệt kê giá trị của trường ngay lập tức — lệnh đầu tiên trên một máy chủ lạ; nó bỏ qua bộ lọc, nên theo lần khởi động/unit/mức thì dùng <code>-o json | jq</code>.</li>
<li>Trong jq, đặt mặc định cho <code>PRIORITY</code> bị thiếu và xử lý <code>MESSAGE</code> dạng mảng.</li>
<li>Đọc journal đã chép bằng <code>-D</code>; chỉ xuất phần cần và soát bí mật trước khi gửi.</li>
</ul>
${nguon('📘', 'journalctl(1) — tuỳ chọn xuất', '-o, --output-fields, -F, -D, --file, --utc', 'https://man7.org/linux/man-pages/man1/journalctl.1.html')}
${nguon('📘', 'Journal Export Formats', 'Định dạng JSON và export, cách mã hoá giá trị nhị phân', 'https://systemd.io/JOURNAL_EXPORT_FORMATS/')}
${nguon('📘', 'sd_journal_query_unique(3)', 'Vì sao -F bỏ qua -b, -u, -p: truy vấn giá trị khác nhau không chịu ảnh hưởng của match', 'https://man7.org/linux/man-pages/man3/sd_journal_query_unique.3.html')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-2-4-jq', title: '2.4 — jq cho log JSON', sub: 'select, group_by, fromjson? — dùng ở đây trên journal' })}
</div>
`,
};
