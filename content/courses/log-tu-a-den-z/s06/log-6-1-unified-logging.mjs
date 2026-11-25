/**
 * 6.1 — Unified logging của Apple (soạn 25/11/2026, agent Mac tiếp quản lgz).
 * Output thật: OUT['s06/luu'], OUT['s06/thong-ke'], OUT['s06/muc'], OUT['s06/ung-dung'] — MacBook thật chạy macOS 27.2.1 (26B131),
 * chạy bằng _demo/s06/chay-s06.zsh, đã ẩn danh bằng _demo/s06/app/an-danh.pl (tên máy ⇒ macbook-lab, home ⇒ /Users/sv, UUID/IP giả).
 * Nguồn: Apple Developer "Logging" + "OSLogPrivacy"; man log(1); /etc/zshrc của macOS (dòng "disable log").
 */
import { lenh, ma, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '6.1 — Apple unified logging: subsystem, category, levels, and why messages show <private>|||6.1 — Unified logging của Apple: subsystem, category, các mức, và vì sao thông điệp hiện <private>',
  slug: 'log-6-1-unified-logging',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Hệ thống log hợp nhất của macOS từ 10.12 (2016) thay ASL/syslog: log nhị phân trong /var/db/diagnostics + chuỗi định dạng trong /var/db/uuidtext, đo thật 2,2 GB + 1,0 GB cho 12 ngày; cái bẫy "log" là lệnh dựng sẵn của zsh trong script; năm mức default/info/debug/error/fault và thử thật mức nào được giữ (debug biến mất kể cả khi đang stream); subsystem/category; vì sao thông điệp hiện <private> và cái bẫy hằng số viết sẵn trong mã lộ nguyên văn; ghi log từ app Swift (Logger) và từ shell (logger); so với journald và Event Viewer.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Apple unified logging: one store for the whole Mac</h2>
<p class="lead">On Windows you met Event Viewer's channels; on Linux you will meet journald. macOS has its own system, called <strong>unified logging</strong>: the kernel, every Apple daemon and every app that uses Apple's logging API write into one binary store. This lesson opens that store on a real MacBook (macOS 27.2.1), shows what is kept and what is thrown away, and explains the strangest thing new readers see: <code>&lt;private&gt;</code> in the middle of a message.</p>

<h3>The everyday picture: a building's camera recorder</h3>
<p>A building has hundreds of cameras. The recorder keeps the important ones (entrance, cash desk) on disk for weeks, keeps the corridor cameras only for a day, and shows the car park only on the live screen — nobody records it unless the guard presses "record" while watching. And faces of passers-by are blurred unless the police ask. Unified logging works the same way: some levels are written to disk, some only stay in memory, one is visible only while you watch live, and personal data is blurred by default.</p>

<h3>A little history: from syslog to unified logging</h3>
<ul>
<li><strong>Before 2016:</strong> macOS used <strong>syslogd</strong> and <strong>ASL</strong> (Apple System Log). Text went to <code>/var/log/system.log</code>; you read it with <code>tail</code>, <code>grep</code>, or Console.</li>
<li><strong>2016, macOS 10.12 Sierra (and iOS 10):</strong> Apple introduced unified logging (<code>os_log</code>). Goals: much cheaper logging (the format string is stored once, only arguments are written per message), one place for kernel and user space, structured fields (subsystem, category, process, thread, activity), and privacy by default.</li>
<li><strong>Today:</strong> <code>/var/log/system.log</code> still exists but is almost empty — lesson 6.2 shows it holds a few dozen lines a day. If a tutorial tells you to <code>grep /var/log/system.log</code> for an app crash, it is from before 2016.</li>
</ul>

<h3>Step 1 — the trap before the first command: <code>log</code> in zsh</h3>
${lenh('s06/luu', 0)}
${lenh('s06/luu', 1)}
<p>The command-line tool is <code>/usr/bin/log</code>. But zsh — the default shell since macOS 10.15 — has its own <strong>builtin</strong> called <code>log</code> (it lists logged-in users). In a non-interactive zsh, which is what a <code>#!/bin/zsh</code> script or <code>zsh -c</code> is, the builtin wins and <code>log show</code> fails with "too many arguments". In Terminal you never notice, because Apple's <code>/etc/zshrc</code> turns the builtin off for interactive shells:</p>
${lenh('s06/luu', 2)}
${lenh('s06/luu', 3)}
<div class="callout warn"><p><strong>Rule:</strong> in scripts, cron jobs, CI runners and LaunchAgents always write <code>/usr/bin/log</code> (or start the script with <code>disable log</code>). This is the first bug every Mac admin script hits. Every command in this chapter was run as in Terminal, with the builtin disabled.</p></div>

<h3>Step 2 — where the logs live, and how big they are</h3>
${lenh('s06/luu', 4)}
${lenh('s06/luu', 5)}
${lenh('s06/luu', 6)}
<ul>
<li><code>/var/db/diagnostics/Persist/*.tracev3</code> — the main store, binary chunks (here 51 files). Default, error and fault messages land here.</li>
<li><code>/var/db/diagnostics/Special</code>, <code>Signpost</code>, <code>HighVolume</code> — messages with shorter lives and performance markers (signposts).</li>
<li><code>/var/db/uuidtext</code> — the <strong>format strings</strong> of every binary, keyed by the binary's UUID. A message on disk is "format string #N of binary X + these arguments"; the text is rebuilt when you read. That is why you cannot just <code>cat</code> a tracev3 file, and why a <code>.logarchive</code> copies both folders.</li>
<li>You can read the folders because your account is in the <code>admin</code> group, but changing the logging configuration needs root:</li>
</ul>
${lenh('s06/luu', 7)}
<p>How long does the Mac keep logs? There is no fixed number of days: logd keeps a size budget and each message has a time-to-live. <code>log stats</code> (no sudo, but it reads the whole store — ours took over two minutes) shows the real picture:</p>
${lenh('s06/thong-ke', 0)}
<p>On this MacBook: 2.3 GB on disk (9.1 GB uncompressed), covering <strong>12 days</strong> (13 → 25 Nov), about 58 million events. Note the <code>ttl</code> row: millions of messages were tagged to live only 1, 3, 7 or 14 days. Practical consequence: <strong>if something happened on a Mac two weeks ago, the unified log probably no longer has it</strong> — collect logs early (lesson 6.3), and remember the other sources that live longer: <code>pmset -g log</code>, <code>/var/log/install.log</code>, crash reports, <code>last</code>.</p>

<h3>Step 3 — the five levels, and which ones are kept</h3>
<p>We wrote one message at each level with <code>log emit</code> (a built-in test tool), then read them back.</p>
${lenh('s06/muc', 0)}
${lenh('s06/muc', 1)}
${lenh('s06/muc', 2)}
${lenh('s06/muc', 3)}
<p>Without flags, <code>log show</code> shows default, error and fault (<code>Df</code>, <code>E</code>, <code>F</code>). <code>--info</code> adds the info line (<code>I</code>). The debug message is <strong>missing even with <code>--debug</code></strong>: it was never stored. Debug messages exist only while someone is watching live with <code>log stream --level debug</code>:</p>
${lenh('s06/muc', 4)}
${lenh('s06/muc', 5)}
<p>The stream showed the debug line (<code>Db</code>); a second later <code>log show --debug</code> cannot find it. That is the "car park camera": visible live, never recorded (unless an admin changes the level for that subsystem with <code>sudo log config</code> or a configuration profile — not something to do on a work machine without a ticket).</p>
<div class="table-wrap"><table>
<thead><tr><th>Level</th><th>Column</th><th>Kept?</th><th>Use it for</th><th>≈ syslog / journald</th></tr></thead>
<tbody>
<tr><td>fault</td><td>F</td><td>Disk, plus extra context about the process</td><td>Bugs in the system or a broken invariant</td><td>crit (2)</td></tr>
<tr><td>error</td><td>E</td><td>Disk</td><td>Something failed in this operation</td><td>err (3)</td></tr>
<tr><td>default</td><td>Df</td><td>Disk</td><td>Things worth knowing later — the level <code>logger</code> and <code>os_log()</code> use</td><td>notice (5)</td></tr>
<tr><td>info</td><td>I</td><td>Memory; seen with <code>--info</code> while still buffered</td><td>Helpful detail, not essential</td><td>info (6)</td></tr>
<tr><td>debug</td><td>Db</td><td>Not stored by default; only in <code>log stream --level debug</code></td><td>Developer detail</td><td>debug (7)</td></tr>
</tbody></table></div>
<p>The other letters you will see in the column: <code>A</code> activity (a group of related work), <code>Ts</code> time-sync events (the clock was adjusted), <code>S</code> signposts. Lesson 1.3 explained levels in general; Apple's twist is that the level decides <em>storage</em>, not only importance.</p>

<h3>Step 4 — subsystem and category</h3>
<p>Every compact line reads: <code>time · type · process[PID:TID] · [subsystem:category] · message</code>. The <strong>subsystem</strong> is a reverse-DNS name of the component (<code>com.apple.TCC</code>, <code>com.example.shopmac</code>); the <strong>category</strong> is a part inside it (<code>network</code>, <code>db</code>). Messages from libraries show the library in round brackets instead, for example <code>(libswiftCore.dylib)</code>. Subsystem + category are the main filters in Console and in predicates (lesson 6.4) — the same role as <code>_SYSTEMD_UNIT</code> plus <code>SYSLOG_IDENTIFIER</code> on Linux, or Provider + Event ID on Windows.</p>

<h3>Step 5 — why messages say <code>&lt;private&gt;</code></h3>
<p>Look again at step 3: the four messages written without <code>--public</code> show <code>&lt;private&gt;</code>. Unified logging treats <strong>dynamic strings and objects as private by default</strong>: they are replaced before reaching anyone who reads the log. Numbers and booleans are public. A developer must opt in per value. This protects users (paths, email addresses, names, URLs), but it is also why a colleague's screenshot "the error says &lt;private&gt; failed" is useless — you need the developer to log the right fields publicly, or to reproduce it on a machine where you control the app.</p>

<h3>Step 6 — logs from your own app (Swift) and from the shell</h3>
<p>A small Swift tool that logs with Apple's <code>Logger</code> (macOS 11+):</p>
${ma('swift', 's06/app/shopmac.swift')}
${lenh('s06/ung-dung', 0)}
${lenh('s06/ung-dung', 1)}
<p>Read it line by line:</p>
<ul>
<li><code>email=&lt;private&gt;</code> — a value known only at run time, private by default. The order number marked <code>.public</code> is visible.</li>
<li><code>Liên hệ hỗ trợ: hotro@example.com</code> — <strong>a trap we found by testing</strong>: a string literal stored in a constant came out in clear even without <code>.public</code>, while the same kind of value read at run time was hidden. Marked <code>.private</code> explicitly (next line) it is hidden. Do not rely on the default: mark sensitive values <code>.private</code> yourself, and do not log secrets at all (lesson 16.3).</li>
<li><code>&lt;mask.hash: '…'&gt;</code> — <code>.private(mask: .hash)</code> replaces the value with a hash: you can see that two lines carry the same token without seeing the token.</li>
<li>The <code>debug</code> line ("Gọi GET /api/orders…") is missing, exactly as in step 3.</li>
</ul>
<p>Not writing Swift? A Node.js or Java process started from Terminal writes to stdout/stderr, which <strong>does not go into the unified log</strong> — it goes to the terminal, or to the files named in a LaunchAgent's <code>StandardOutPath</code>/<code>StandardErrorPath</code>. From a shell script, use <code>logger</code>:</p>
${lenh('s06/ung-dung', 2)}
${lenh('s06/ung-dung', 3)}
<p>Notice what is missing: the tag <code>-t backup-dem</code>. On macOS the process name is always the real binary (<code>logger</code>), not what the caller claims. Lesson 6.5 uses that to unmask a fake <code>sudo</code> line.</p>

<h3>Compared with journald and Event Viewer</h3>
<div class="table-wrap"><table>
<thead><tr><th></th><th>macOS unified log</th><th>Linux journald (Ch7)</th><th>Windows Event Log (Ch3–5)</th></tr></thead>
<tbody>
<tr><td>Storage</td><td>Binary tracev3 + uuidtext format strings</td><td>Binary journal files</td><td>Binary .evtx per channel</td></tr>
<tr><td>Main fields</td><td>process, subsystem, category, type, PID/TID</td><td>_SYSTEMD_UNIT, _PID, PRIORITY, SYSLOG_IDENTIFIER</td><td>Provider, Event ID, Level, Channel</td></tr>
<tr><td>Read with</td><td><code>log show/stream</code>, Console</td><td><code>journalctl</code></td><td>Event Viewer, <code>Get-WinEvent</code></td></tr>
<tr><td>Query language</td><td>NSPredicate (6.4)</td><td>FIELD=value, -p, -g</td><td>FilterHashtable, XPath</td></tr>
<tr><td>Retention</td><td>Size budget + per-message TTL; debug never stored</td><td>Size/time limits in journald.conf</td><td>Max size per channel, overwrite/archive</td></tr>
<tr><td>Privacy</td><td>Dynamic values redacted by default</td><td>No redaction</td><td>No redaction</td></tr>
</tbody></table></div>

<h3>Real-life situations</h3>
<ul>
<li><strong>"My app logs nothing in Console."</strong> Usually the app logs at debug or info and you are looking at stored logs. Use <code>log stream --level debug --predicate 'subsystem == "…"'</code> while reproducing, or log at default/error for things you need afterwards.</li>
<li><strong>A teammate's Mac crashed "last month".</strong> Twelve days of history on our machine — the unified log may already be gone. Ask for crash reports and <code>pmset -g log</code> instead, and next time collect immediately.</li>
<li><strong>Your deploy script on a Mac CI runner fails with "too many arguments".</strong> It is the zsh builtin — use <code>/usr/bin/log</code>.</li>
</ul>

<h3>🧪 Practice (20 min, your own Mac)</h3>
<div class="callout ok"><ol>
<li>Run <code>zsh -f -c 'type log'</code> and <code>type log</code> in Terminal. Explain the difference in one sentence.</li>
<li>Emit five messages at five levels with your own subsystem (<code>com.example.&lt;yourname&gt;</code>). Which ones does <code>log show --last 5m --info --debug</code> return?</li>
<li>Repeat with a <code>log stream --level debug</code> running in a second window. What changes, and what stays the same in <code>log show</code> afterwards?</li>
<li>Emit one message with and one without <code>--public</code>. Which shows <code>&lt;private&gt;</code>?</li>
</ol>
<p><strong>Done when:</strong> 2 returns 4 lines (no debug); 3 shows the debug line only in the stream; 4 shows <code>&lt;private&gt;</code> only for the message without <code>--public</code>.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['unified logging', 'Apple’s logging system since macOS 10.12 / iOS 10 (2016); one binary store for kernel and apps.'],
  ['tracev3', 'Binary chunk files in /var/db/diagnostics; uuidtext holds the format strings.'],
  ['subsystem / category', 'Reverse-DNS component name and the part inside it; the main filters.'],
  ['default · info · debug · error · fault', 'The five levels; debug is not stored, info stays in memory, the rest go to disk.'],
  ['<private>', 'A dynamic value redacted by default; the developer opts in with .public.'],
  ['/usr/bin/log vs zsh builtin', 'Scripts must call /usr/bin/log; only interactive zsh disables the builtin.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>macOS keeps one binary log store; read it with <code>/usr/bin/log</code> or Console, not with <code>cat</code>.</li>
<li>The level decides storage: debug only live, info in memory, default/error/fault on disk.</li>
<li>History is limited by size and TTL — 12 days on our machine.</li>
<li><code>&lt;private&gt;</code> is by design; mark values explicitly, never rely on defaults for secrets.</li>
<li>Process names are attested by the system — the basis of lesson 6.5.</li>
</ul>
${nguon('📘', 'Apple Developer — Logging', 'Unified logging, Logger, levels and what is persisted', 'https://developer.apple.com/documentation/os/logging')}
${nguon('📘', 'Apple Developer — OSLogPrivacy', 'public, private, private(mask: .hash)', 'https://developer.apple.com/documentation/os/oslogprivacy')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-1-3-muc-log', title: 'Lesson 1.3 — Log levels', sub: 'Levels in general, syslog severity numbers', cta: 'Open lesson' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-7-1-journald-luu', title: 'Lesson 7.1 — How journald stores logs', sub: 'The Linux counterpart, with trusted fields', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Unified logging của Apple: một kho log cho cả máy Mac</h2>
<p class="lead">Trên Windows bạn đã gặp các kênh của Event Viewer; trên Linux bạn sẽ gặp journald. macOS có hệ thống riêng, gọi là <strong>unified logging</strong> (log hợp nhất): nhân, mọi daemon của Apple và mọi ứng dụng dùng API log của Apple cùng ghi vào một kho nhị phân. Bài này mở kho đó trên một chiếc MacBook thật (macOS 27.2.1), chỉ ra thứ gì được giữ, thứ gì bị vứt, và giải thích điều lạ nhất người mới hay gặp: chữ <code>&lt;private&gt;</code> nằm giữa thông điệp.</p>

<h3>Liên tưởng đời thường: đầu ghi camera của toà nhà</h3>
<p>Toà nhà có hàng trăm camera. Đầu ghi giữ camera quan trọng (cửa chính, quầy thu ngân) trên ổ cứng nhiều tuần, giữ camera hành lang một ngày, còn bãi xe chỉ hiện trên màn hình trực tiếp — không ai ghi lại trừ khi bảo vệ bấm "ghi" lúc đang xem. Và mặt người qua đường bị làm mờ, trừ khi công an yêu cầu. Unified logging y như vậy: có mức được ghi xuống đĩa, có mức chỉ ở trong RAM, có mức chỉ thấy khi đang xem trực tiếp, và dữ liệu cá nhân bị làm mờ mặc định.</p>

<h3>Một chút lịch sử: từ syslog tới unified logging</h3>
<ul>
<li><strong>Trước 2016:</strong> macOS dùng <strong>syslogd</strong> và <strong>ASL</strong> (Apple System Log). Chữ đổ vào <code>/var/log/system.log</code>; đọc bằng <code>tail</code>, <code>grep</code> hoặc Console.</li>
<li><strong>2016, macOS 10.12 Sierra (và iOS 10):</strong> Apple ra mắt unified logging (<code>os_log</code>). Mục tiêu: ghi log rẻ hơn nhiều (chuỗi định dạng lưu một lần, mỗi thông điệp chỉ ghi tham số), một chỗ cho cả nhân lẫn không gian người dùng, trường có cấu trúc (subsystem, category, tiến trình, luồng, activity), và riêng tư mặc định.</li>
<li><strong>Hôm nay:</strong> <code>/var/log/system.log</code> vẫn còn nhưng gần như trống — bài 6.2 cho thấy mỗi ngày nó chỉ có vài chục dòng. Hướng dẫn nào bảo bạn <code>grep /var/log/system.log</code> để tìm lỗi ứng dụng văng thì đó là hướng dẫn từ trước 2016.</li>
</ul>

<h3>Bước 1 — cái bẫy trước cả lệnh đầu tiên: <code>log</code> trong zsh</h3>
${lenh('s06/luu', 0)}
${lenh('s06/luu', 1)}
<p>Công cụ dòng lệnh là <code>/usr/bin/log</code>. Nhưng zsh — shell mặc định từ macOS 10.15 — có một <strong>lệnh dựng sẵn</strong> (builtin) cũng tên <code>log</code> (liệt kê người đang đăng nhập). Trong zsh không tương tác — chính là script <code>#!/bin/zsh</code> hay <code>zsh -c</code> — lệnh dựng sẵn thắng và <code>log show</code> báo "too many arguments". Trong Terminal bạn không bao giờ thấy, vì <code>/etc/zshrc</code> của Apple tắt lệnh dựng sẵn đó cho shell tương tác:</p>
${lenh('s06/luu', 2)}
${lenh('s06/luu', 3)}
<div class="callout warn"><p><strong>Luật:</strong> trong script, việc cron, máy chạy CI và LaunchAgent luôn viết <code>/usr/bin/log</code> (hoặc mở đầu script bằng <code>disable log</code>). Đây là lỗi đầu tiên mọi script quản trị Mac vấp phải. Mọi lệnh trong chương này chạy như trong Terminal, đã tắt lệnh dựng sẵn.</p></div>

<h3>Bước 2 — log nằm ở đâu, và to cỡ nào</h3>
${lenh('s06/luu', 4)}
${lenh('s06/luu', 5)}
${lenh('s06/luu', 6)}
<ul>
<li><code>/var/db/diagnostics/Persist/*.tracev3</code> — kho chính, các khúc nhị phân (ở đây 51 tệp). Thông điệp default, error và fault rơi vào đây.</li>
<li><code>/var/db/diagnostics/Special</code>, <code>Signpost</code>, <code>HighVolume</code> — thông điệp sống ngắn hơn và mốc đo hiệu năng (signpost).</li>
<li><code>/var/db/uuidtext</code> — <strong>chuỗi định dạng</strong> của mọi tệp chạy, đánh khoá theo UUID của tệp. Một thông điệp trên đĩa là "chuỗi định dạng số N của tệp X + các tham số này"; chữ được dựng lại lúc đọc. Vì thế không thể <code>cat</code> một tệp tracev3, và vì thế một <code>.logarchive</code> phải chép cả hai thư mục.</li>
<li>Bạn đọc được thư mục vì tài khoản thuộc nhóm <code>admin</code>, nhưng đổi cấu hình log thì cần root:</li>
</ul>
${lenh('s06/luu', 7)}
<p>Mac giữ log bao lâu? Không có con số ngày cố định: logd giữ một ngân sách dung lượng và mỗi thông điệp có hạn sống (TTL). <code>log stats</code> (không cần sudo, nhưng đọc cả kho — của chúng tôi mất hơn hai phút) cho bức tranh thật:</p>
${lenh('s06/thong-ke', 0)}
<p>Trên chiếc MacBook này: 2,3 GB trên đĩa (9,1 GB khi giải nén), phủ <strong>12 ngày</strong> (13 → 25/11), khoảng 58 triệu sự kiện. Để ý dòng <code>ttl</code>: hàng triệu thông điệp được gắn hạn sống chỉ 1, 3, 7 hay 14 ngày. Hệ quả thực tế: <strong>chuyện xảy ra trên một máy Mac từ hai tuần trước thì nhiều khả năng unified log không còn</strong> — thu log sớm (bài 6.3), và nhớ các nguồn sống lâu hơn: <code>pmset -g log</code>, <code>/var/log/install.log</code>, báo cáo crash, <code>last</code>.</p>

<h3>Bước 3 — năm mức, và mức nào được giữ</h3>
<p>Chúng tôi ghi một thông điệp ở mỗi mức bằng <code>log emit</code> (công cụ thử có sẵn), rồi đọc lại.</p>
${lenh('s06/muc', 0)}
${lenh('s06/muc', 1)}
${lenh('s06/muc', 2)}
${lenh('s06/muc', 3)}
<p>Không có cờ, <code>log show</code> chỉ cho default, error và fault (<code>Df</code>, <code>E</code>, <code>F</code>). <code>--info</code> thêm dòng info (<code>I</code>). Thông điệp debug <strong>vắng mặt kể cả khi có <code>--debug</code></strong>: nó chưa bao giờ được lưu. Debug chỉ tồn tại khi có người đang xem trực tiếp bằng <code>log stream --level debug</code>:</p>
${lenh('s06/muc', 4)}
${lenh('s06/muc', 5)}
<p>Luồng trực tiếp hiện dòng debug (<code>Db</code>); một giây sau <code>log show --debug</code> không tìm thấy nó. Đó chính là "camera bãi xe": xem trực tiếp được, không bao giờ được ghi (trừ khi quản trị viên đổi mức của subsystem đó bằng <code>sudo log config</code> hoặc hồ sơ cấu hình — không phải việc làm trên máy công ty khi không có ticket).</p>
<div class="table-wrap"><table>
<thead><tr><th>Mức</th><th>Cột</th><th>Có giữ?</th><th>Dùng cho</th><th>≈ syslog / journald</th></tr></thead>
<tbody>
<tr><td>fault</td><td>F</td><td>Đĩa, kèm thêm ngữ cảnh về tiến trình</td><td>Lỗi của hệ thống, một bất biến bị phá</td><td>crit (2)</td></tr>
<tr><td>error</td><td>E</td><td>Đĩa</td><td>Thao tác này thất bại</td><td>err (3)</td></tr>
<tr><td>default</td><td>Df</td><td>Đĩa</td><td>Điều đáng biết về sau — mức mà <code>logger</code> và <code>os_log()</code> dùng</td><td>notice (5)</td></tr>
<tr><td>info</td><td>I</td><td>RAM; thấy bằng <code>--info</code> khi còn trong bộ đệm</td><td>Chi tiết hữu ích, không thiết yếu</td><td>info (6)</td></tr>
<tr><td>debug</td><td>Db</td><td>Mặc định không lưu; chỉ trong <code>log stream --level debug</code></td><td>Chi tiết cho lập trình viên</td><td>debug (7)</td></tr>
</tbody></table></div>
<p>Các chữ khác sẽ gặp ở cột này: <code>A</code> activity (một nhóm việc liên quan), <code>Ts</code> sự kiện đồng bộ giờ (đồng hồ bị chỉnh), <code>S</code> signpost. Bài 1.3 đã giảng mức log nói chung; điểm riêng của Apple là mức quyết định <em>việc lưu</em>, không chỉ độ quan trọng.</p>

<h3>Bước 4 — subsystem và category</h3>
<p>Mỗi dòng compact đọc là: <code>giờ · loại · tiến-trình[PID:TID] · [subsystem:category] · thông điệp</code>. <strong>Subsystem</strong> là tên thành phần viết kiểu tên miền đảo (<code>com.apple.TCC</code>, <code>com.example.shopmac</code>); <strong>category</strong> là một phần bên trong nó (<code>network</code>, <code>db</code>). Thông điệp từ thư viện thì hiện tên thư viện trong ngoặc tròn, ví dụ <code>(libswiftCore.dylib)</code>. Subsystem + category là bộ lọc chính trong Console và trong predicate (bài 6.4) — cùng vai trò với <code>_SYSTEMD_UNIT</code> cộng <code>SYSLOG_IDENTIFIER</code> trên Linux, hay Provider + Event ID trên Windows.</p>

<h3>Bước 5 — vì sao thông điệp hiện <code>&lt;private&gt;</code></h3>
<p>Nhìn lại bước 3: bốn thông điệp ghi không có <code>--public</code> hiện <code>&lt;private&gt;</code>. Unified logging coi <strong>chuỗi động và đối tượng là riêng tư mặc định</strong>: chúng bị thay trước khi tới tay người đọc log. Số và giá trị đúng/sai thì công khai. Lập trình viên phải chủ động mở từng giá trị. Điều này bảo vệ người dùng (đường dẫn, email, tên, URL), nhưng cũng là lý do ảnh chụp của đồng nghiệp "lỗi ghi &lt;private&gt; failed" chẳng giúp được gì — bạn cần lập trình viên ghi đúng trường ở dạng công khai, hoặc tái hiện trên máy mà bạn kiểm soát ứng dụng.</p>

<h3>Bước 6 — log từ ứng dụng của chính bạn (Swift) và từ shell</h3>
<p>Một công cụ Swift nhỏ ghi log bằng <code>Logger</code> của Apple (macOS 11+):</p>
${ma('swift', 's06/app/shopmac.swift')}
${lenh('s06/ung-dung', 0)}
${lenh('s06/ung-dung', 1)}
<p>Đọc từng dòng:</p>
<ul>
<li><code>email=&lt;private&gt;</code> — giá trị chỉ biết lúc chạy, riêng tư mặc định. Mã đơn đánh dấu <code>.public</code> thì hiện ra.</li>
<li><code>Liên hệ hỗ trợ: hotro@example.com</code> — <strong>cái bẫy chúng tôi tìm ra khi chạy thử</strong>: một chuỗi viết sẵn trong mã, gán vào hằng số, hiện nguyên văn dù không có <code>.public</code>, trong khi giá trị cùng loại đọc lúc chạy thì bị che. Đánh dấu <code>.private</code> rõ ràng (dòng kế) thì bị che. Đừng dựa vào mặc định: tự đánh dấu <code>.private</code> cho giá trị nhạy cảm, và đừng bao giờ log bí mật (bài 16.3).</li>
<li><code>&lt;mask.hash: '…'&gt;</code> — <code>.private(mask: .hash)</code> thay giá trị bằng mã băm: thấy được hai dòng cùng mang một token mà không thấy token.</li>
<li>Dòng <code>debug</code> ("Gọi GET /api/orders…") biến mất, đúng như bước 3.</li>
</ul>
<p>Không viết Swift? Một tiến trình Node.js hay Java chạy từ Terminal ghi ra stdout/stderr, thứ đó <strong>không vào unified log</strong> — nó ra terminal, hoặc vào tệp ghi trong <code>StandardOutPath</code>/<code>StandardErrorPath</code> của LaunchAgent. Từ script shell, dùng <code>logger</code>:</p>
${lenh('s06/ung-dung', 2)}
${lenh('s06/ung-dung', 3)}
<p>Để ý thứ bị thiếu: nhãn <code>-t backup-dem</code>. Trên macOS tên tiến trình luôn là tệp chạy thật (<code>logger</code>), không phải điều người gọi tự khai. Bài 6.5 dùng điều này để lật mặt một dòng <code>sudo</code> giả.</p>

<h3>So với journald và Event Viewer</h3>
<div class="table-wrap"><table>
<thead><tr><th></th><th>Unified log của macOS</th><th>journald của Linux (Ch7)</th><th>Event Log của Windows (Ch3–5)</th></tr></thead>
<tbody>
<tr><td>Lưu trữ</td><td>tracev3 nhị phân + chuỗi định dạng uuidtext</td><td>Tệp journal nhị phân</td><td>.evtx nhị phân theo kênh</td></tr>
<tr><td>Trường chính</td><td>process, subsystem, category, type, PID/TID</td><td>_SYSTEMD_UNIT, _PID, PRIORITY, SYSLOG_IDENTIFIER</td><td>Provider, Event ID, Level, Channel</td></tr>
<tr><td>Đọc bằng</td><td><code>log show/stream</code>, Console</td><td><code>journalctl</code></td><td>Event Viewer, <code>Get-WinEvent</code></td></tr>
<tr><td>Ngôn ngữ truy vấn</td><td>NSPredicate (6.4)</td><td>TRƯỜNG=giá-trị, -p, -g</td><td>FilterHashtable, XPath</td></tr>
<tr><td>Giữ bao lâu</td><td>Ngân sách dung lượng + TTL từng thông điệp; debug không bao giờ lưu</td><td>Giới hạn dung lượng/thời gian trong journald.conf</td><td>Dung lượng tối đa mỗi kênh, ghi đè/lưu trữ</td></tr>
<tr><td>Riêng tư</td><td>Giá trị động bị che mặc định</td><td>Không che</td><td>Không che</td></tr>
</tbody></table></div>

<h3>Tình huống đi làm</h3>
<ul>
<li><strong>"Ứng dụng của em không ghi gì trong Console."</strong> Thường là ứng dụng log ở mức debug hoặc info mà bạn lại đang xem log đã lưu. Dùng <code>log stream --level debug --predicate 'subsystem == "…"'</code> trong lúc tái hiện, hoặc ghi ở mức default/error cho những gì cần xem về sau.</li>
<li><strong>Máy Mac của đồng nghiệp văng "tháng trước".</strong> Máy chúng tôi chỉ có 12 ngày lịch sử — unified log có thể đã mất. Hãy xin báo cáo crash và <code>pmset -g log</code>, và lần sau thu log ngay.</li>
<li><strong>Script deploy trên máy CI chạy macOS báo "too many arguments".</strong> Đó là lệnh dựng sẵn của zsh — dùng <code>/usr/bin/log</code>.</li>
</ul>

<h3>🧪 Thực hành (20 phút, trên Mac của bạn)</h3>
<div class="callout ok"><ol>
<li>Chạy <code>zsh -f -c 'type log'</code> và <code>type log</code> trong Terminal. Giải thích khác biệt bằng một câu.</li>
<li>Phát năm thông điệp ở năm mức với subsystem riêng (<code>com.example.&lt;tên-bạn&gt;</code>). <code>log show --last 5m --info --debug</code> trả về những dòng nào?</li>
<li>Làm lại khi có <code>log stream --level debug</code> chạy ở cửa sổ thứ hai. Cái gì thay đổi, và cái gì vẫn y nguyên trong <code>log show</code> sau đó?</li>
<li>Phát một thông điệp có và một không có <code>--public</code>. Cái nào hiện <code>&lt;private&gt;</code>?</li>
</ol>
<p><strong>Đạt khi:</strong> câu 2 ra 4 dòng (không có debug); câu 3 chỉ thấy dòng debug trong luồng trực tiếp; câu 4 chỉ thông điệp không có <code>--public</code> hiện <code>&lt;private&gt;</code>.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['unified logging', 'Hệ thống log của Apple từ macOS 10.12 / iOS 10 (2016); một kho nhị phân cho cả nhân và ứng dụng.'],
  ['tracev3', 'Các khúc nhị phân trong /var/db/diagnostics; uuidtext giữ chuỗi định dạng.'],
  ['subsystem / category', 'Tên thành phần kiểu tên miền đảo và phần bên trong nó; bộ lọc chính.'],
  ['default · info · debug · error · fault', 'Năm mức; debug không lưu, info ở RAM, còn lại xuống đĩa.'],
  ['<private>', 'Giá trị động bị che mặc định; lập trình viên mở bằng .public.'],
  ['/usr/bin/log và lệnh dựng sẵn của zsh', 'Script phải gọi /usr/bin/log; chỉ zsh tương tác mới tắt lệnh dựng sẵn.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>macOS giữ một kho log nhị phân; đọc bằng <code>/usr/bin/log</code> hoặc Console, không bằng <code>cat</code>.</li>
<li>Mức quyết định việc lưu: debug chỉ xem trực tiếp, info ở RAM, default/error/fault xuống đĩa.</li>
<li>Lịch sử bị giới hạn bởi dung lượng và TTL — 12 ngày trên máy chúng tôi.</li>
<li><code>&lt;private&gt;</code> là cố ý; đánh dấu rõ từng giá trị, đừng dựa vào mặc định với bí mật.</li>
<li>Tên tiến trình do hệ thống xác nhận — nền tảng của bài 6.5.</li>
</ul>
${nguon('📘', 'Apple Developer — Logging', 'Unified logging, Logger, các mức và thứ được lưu', 'https://developer.apple.com/documentation/os/logging')}
${nguon('📘', 'Apple Developer — OSLogPrivacy', 'public, private, private(mask: .hash)', 'https://developer.apple.com/documentation/os/oslogprivacy')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-1-3-muc-log', title: 'Bài 1.3 — Mức log', sub: 'Mức log nói chung, số severity của syslog', cta: 'Mở bài' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-7-1-journald-luu', title: 'Bài 7.1 — journald lưu log thế nào', sub: 'Phiên bản Linux, với các trường tin cậy', cta: 'Mở bài' })}
</div>
`,
};
