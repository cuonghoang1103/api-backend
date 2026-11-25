/**
 * 6.5 — Bảo mật trên macOS: sudo, xác thực, TCC, Gatekeeper/XProtect, mục khởi động, last (soạn 25/11/2026, agent Mac tiếp quản lgz).
 * Output thật: OUT['s06/bao-mat'] — MacBook macOS 27.2.1, không sudo, đã ẩn danh. Danh sách LaunchAgent thật của máy CỐ Ý chỉ đếm, không in tên.
 * Dòng sudo GIẢ tạo bằng logger (không chạy sudo). sfltool dumpbtm cần quyền quản trị ⇒ không chạy (chỉ nhắc).
 * Nguồn sự cố: Silver Sparrow (Red Canary, 18/02/2021 — bản lưu ở zscaler.com), XCSSET CVE-2021-30713 (Jamf, 24/05/2021),
 * Shlayer CVE-2021-30657 (Jamf, 26/04/2021); MITRE ATT&CK T1543.001, T1548.003, T1553.001, T1070.002; Apple Platform Security.
 */
import { lenh, ma, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '6.5 — Security on macOS: sudo, authentication, TCC privacy prompts, Gatekeeper/XProtect, login items, last|||6.5 — Bảo mật trên macOS: sudo, xác thực, quyền riêng tư TCC, Gatekeeper/XProtect, mục khởi động, last',
  slug: 'log-6-5-bao-mat-mac',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Đọc log bảo mật của một máy Mac thật, không cần sudo: last (đăng nhập, khởi động lại, chữ "crash"), sudo trong unified log (0 lần trong 7 ngày) và một dòng sudo GIẢ viết bằng logger bị lật mặt nhờ processImagePath; TCC — gom bốn dòng AUTHREQ của cùng msgID để biết ứng dụng nào xin quyền gì và bị từ chối (authValue); Gatekeeper (spctl, thuộc tính quarantine, syspolicyd), XProtect (phiên bản, install.log); launchd/LaunchAgent và Background Task Management — góc hacker: Silver Sparrow 2021 bám trụ bằng LaunchAgent, XCSSET 2021 vượt TCC, Shlayer 2021 vượt Gatekeeper, kẻ xấu xoá log (T1070.002) và cách phòng.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.5</span>
<h2>Security on macOS: who logged in, who became root, what asked for permission, what was allowed to run</h2>
<p class="lead">A Mac's security story is spread over several logs: login records, the unified log (sudo, TCC, Gatekeeper, Background Task Management), <code>install.log</code>, and the launchd configuration on disk. This lesson reads each one on a real MacBook <strong>without sudo</strong>, fakes a log line to show how to detect a fake, and ties each part to a real macOS attack.</p>

<h3>The everyday picture: an apartment building's security</h3>
<p>The guest book at the door (<code>last</code>), the master-key register (<code>sudo</code>), the residents' consent forms — "may the plumber enter my flat?" (TCC), the guard checking ID cards of anyone carrying in furniture (Gatekeeper), the list of banned people (XProtect), and the timer switches someone installed in the basement that turn things on every night (LaunchAgents). An intruder tries to slip past each — and the trick is knowing which book to check.</p>

<h3>Step 1 — logins and restarts: last</h3>
${lenh('s06/bao-mat', 0)}
${lenh('s06/bao-mat', 1)}
<ul>
<li><code>console</code> = someone logged in at the screen; <code>ttys00N</code> = a terminal session. <code>still logged in</code> = open now.</li>
<li><code>reboot time</code> lines exist for every boot; a <code>shutdown time</code> line appears only for some clean shutdowns. The Nov 17 restart has both; the Nov 24 one has <strong>no shutdown line</strong>, and the <code>root console</code> session before it ends with <strong>"crash"</strong>.</li>
<li>"crash" in <code>last</code> only means "no logout record was written before the next boot". It is a question, not an answer. Lab 6 shows that this "crash" was in fact a macOS update reboot — found by joining three other logs.</li>
</ul>
<p>Compared with Linux (lesson 8.1): same <code>last</code>, same wtmp idea; there is no <code>lastb</code> for failed logins on macOS — failed attempts are in the unified log.</p>

<h3>Step 2 — sudo, and a fake sudo line</h3>
${lenh('s06/bao-mat', 2)}
<p>The count is 1 because <code>wc -l</code> includes the header: <strong>nobody used sudo on this Mac in 7 days</strong>. On a Mac where it is used, each command appears as <code>process == "sudo"</code> with the sudoers format <code>user : TTY=… ; PWD=… ; USER=root ; COMMAND=…</code> — and failed passwords as <code>incorrect password attempts</code>. Now, an attacker who wants to frame someone, or bury the real line in noise, can write a line that <em>looks</em> exactly like that:</p>
${lenh('s06/bao-mat', 3)}
${lenh('s06/bao-mat', 4)}
${lenh('s06/bao-mat', 5)}
${lenh('s06/bao-mat', 6)}
<p>A search for <code>process == "sudo"</code> does <strong>not</strong> find it: the process is <code>logger</code>, the binary path is <code>/usr/bin/logger</code>, the UID is 501 (not root), the tag <code>-t sudo</code> was dropped and the facility <code>authpriv</code> ignored. On macOS the process fields come from the system, not from the writer — the same principle as journald's trusted <code>_COMM</code>/<code>_EXE</code> fields (lesson 7.1), and stronger than classic syslog where <code>-t</code> is trusted. A text search (<code>eventMessage CONTAINS</code>) <em>does</em> find the fake, so: <strong>always confirm with <code>processImagePath</code></strong>. (The last JSON object is the ndjson trailer from lesson 6.3.)</p>
<p>ATT&amp;CK <strong>T1548.003 — Sudo and Sudo Caching</strong>: abusing sudo's timestamp (no password for 5 minutes after the last use) or a weak sudoers rule. Defend: watch <code>process == "sudo"</code>, keep the default timeout or set <code>Defaults timestamp_timeout=0</code> on shared Macs, never <code>NOPASSWD: ALL</code>.</p>

<h3>Step 3 — TCC: which app asked for what</h3>
<p><strong>TCC</strong> (Transparency, Consent and Control) is the system that shows "‘X’ would like to access your Desktop folder / Camera / Screen Recording" and remembers the answer. Its daemon <code>tccd</code> logs every check in four lines sharing one <code>msgID</code>:</p>
${lenh('s06/bao-mat', 7)}
${lenh('s06/bao-mat', 8)}
${lenh('s06/bao-mat', 9)}
${lenh('s06/bao-mat', 10)}
${lenh('s06/bao-mat', 11)}
<ul>
<li><strong>AUTHREQ_CTX</strong> — which service: <code>kTCCServiceListenEvent</code> (Input Monitoring — reading the keyboard), <code>AddressBook</code> (Contacts), <code>Calendar</code>, <code>SystemPolicyAllFiles</code> (Full Disk Access), <code>…DownloadsFolder</code>. <code>preflight=yes</code> = the app only checked, no prompt shown.</li>
<li><strong>AUTHREQ_ATTRIBUTION</strong> — who: the <em>accessing</em> process (here <code>osascript</code>) and the <em>responsible</em> app (the terminal it runs in). TCC charges the request to the responsible app — the reason "allow Terminal Full Disk Access" gives every script in it that access.</li>
<li><strong>AUTHREQ_RESULT</strong> — the answer: <code>authValue</code> 0 = denied, 2 = allowed (1 = unknown; 3 = limited, e.g. some photos). Apple does not document these numbers; they match the <code>auth_value</code> column of the TCC database as described by security researchers.</li>
</ul>
<p>In one hour: 1,598 checks, 1,525 denied, almost all Input Monitoring — a script repeatedly checking whether it may read keystrokes and being told no. On this lab Mac it is an automation script started from the terminal (the attribution line shows osascript under iTerm2) — expected, but exactly the pattern to look for when a Mac has a suspected keylogger or spyware: <em>a process you do not recognise asking for ListenEvent, ScreenCapture, AllFiles or Camera</em>.</p>
<div class="callout warn"><p><strong>Real attack — XCSSET, 2021 (CVE-2021-30713).</strong> Jamf found the XCSSET malware placing its own AppleScript app <em>inside</em> an installed app that already had permissions (their example: inside Zoom's bundle), so TCC treated it as that app and let it take screenshots without asking. Apple fixed it in macOS 11.4 (May 2021). Lesson for reading TCC logs: check <code>binary_path</code> and <code>responsible_path</code>, not only the identifier — a strange binary inside a trusted bundle is the signal. Defence: keep macOS updated, grant Full Disk Access/Screen Recording to as few apps as possible, review System Settings › Privacy &amp; Security.</p></div>

<h3>Step 4 — Gatekeeper and quarantine: who may run</h3>
${lenh('s06/bao-mat', 12)}
${lenh('s06/bao-mat', 13)}
${lenh('s06/bao-mat', 14)}
${lenh('s06/bao-mat', 15)}
<p>Gatekeeper decides whether downloaded software may run. Our self-built <code>motep</code> (ad-hoc signed) is <strong>rejected</strong> by the policy, Calculator is accepted (<code>source=Apple System</code>). We still could run motep from Terminal because it was <em>not downloaded</em>: browsers and mail apps add the <code>com.apple.quarantine</code> attribute (<code>flags;hex-time;app;</code> — here we added it by hand to a copy, with "Safari"), and quarantined files are what Gatekeeper checks on first open. <code>com.apple.provenance</code> is a newer attribute that records which app created a file. The decision is logged by <code>syspolicyd</code>:</p>
${lenh('s06/bao-mat', 16)}
<div class="callout warn"><p><strong>Real attack — Shlayer, 2021 (CVE-2021-30657).</strong> Jamf observed Shlayer adware shipping a fake app whose "executable" was a shell script and which had <em>no Info.plist</em>. macOS 10.15–11.2 ran it without the quarantine, signature or notarisation checks. Fixed in macOS 11.3 (April 2021). ATT&amp;CK <strong>T1553.001 — Gatekeeper Bypass</strong> (also: removing the quarantine attribute with <code>xattr -d</code>, tricking users into right-click › Open). Defence: updates, never tell users "just run xattr -cr", and watch <code>syspolicyd</code> and process-creation telemetry (EDR).</p></div>

<h3>Step 5 — XProtect: the built-in signature scanner</h3>
${lenh('s06/bao-mat', 17)}
${lenh('s06/bao-mat', 18)}
<p>XProtect is Apple's malware signature list; it updates silently and separately from macOS. <code>install.log</code> keeps the history of those updates — the first thing to check when someone asks "was this Mac's protection up to date on the day of the incident?". Detections and remediations appear in the unified log under XProtect's processes and in the Endpoint Security telemetry an EDR collects.</p>

<h3>Step 6 — launchd, LaunchAgents and Background Task Management</h3>
${lenh('s06/bao-mat', 19)}
<p><code>launchd</code> (PID 1) starts everything. Per-user jobs live in the <code>gui/&lt;uid&gt;</code> domain (here 467 services); <code>launchctl print gui/$(id -u)/&lt;label&gt;</code> shows one job's program, last exit status and run count — read-only and very useful. Jobs are defined by plist files in <code>~/Library/LaunchAgents</code> (per user), <code>/Library/LaunchAgents</code> (all users), <code>/Library/LaunchDaemons</code> (as root):</p>
${lenh('s06/bao-mat', 20)}
<p>17 files on this Mac (names withheld — they are a list of installed software). Here is what a malicious one looks like — an example to read, never loaded:</p>
${ma('xml', 's06/vi-du-launchagent.plist')}
${lenh('s06/bao-mat', 21)}
<div class="callout warn"><p><strong>Real attack — Silver Sparrow, February 2021.</strong> Red Canary found malware on ~30,000 Macs (Malwarebytes data, 153 countries), one of the first with native Apple Silicon code. It persisted with a LaunchAgent (<code>~/Library/LaunchAgents/init_verx.plist</code>) with <code>RunAtLoad</code> and <code>StartInterval 3600</code> — every hour it downloaded a JSON file from cloud storage to see what to run next. ATT&amp;CK <strong>T1543.001 — Launch Agent</strong>.</p></div>
<p>Since macOS 13, <strong>Background Task Management</strong> tracks every login item and launch agent: the user gets a "Background Items Added" notification, and the event is logged:</p>
${lenh('s06/bao-mat', 22)}
<p>For a full listing, <code>sfltool dumpbtm</code> exists, but it needs an administrator (it waits for authentication — we did not run it). EDR tools receive the same as the Endpoint Security event <code>ES_EVENT_TYPE_NOTIFY_BTM_LAUNCH_ITEM_ADD</code>. Defend: review System Settings › General › Login Items &amp; Extensions, alert on new plists in the three folders, check <code>ProgramArguments</code> that run shells from user-writable folders.</p>

<h3>Step 7 — covering tracks, and the trace your own commands leave</h3>
${lenh('s06/bao-mat', 23)}
<p>Every <code>log</code> invocation is logged with its arguments (lesson 6.4). An intruder who runs <code>log show</code> to look around leaves these lines — useful evidence. A root intruder can go further: <code>sudo log erase --all</code>, deleting crash reports, editing <code>~/.zsh_history</code> — ATT&amp;CK <strong>T1070.002 — Clear Linux or Mac System Logs</strong>. Signs: a sudden gap in the unified log, <code>log stats</code> starting much later than expected, missing reports. The only real protection is a copy <em>off</em> the machine: an EDR/MDM that streams events, or logs shipped to a central system (Chapter 15).</p>

<h3>Real-life situations</h3>
<ul>
<li><strong>A colleague's Mac shows a strange "would like to control this computer" prompt.</strong> TCC logs for the last hour: which binary, which responsible app, what service, what answer.</li>
<li><strong>Security asks "did anything get persistence on this Mac this week?"</strong> New plists in the three LaunchAgents/Daemons folders by modification time, BTM <code>register</code> lines, <code>launchctl print</code> of each unknown label.</li>
<li><strong>A user "only ran the installer from the email".</strong> <code>xattr -l</code> on the file (quarantine: which app downloaded it), <code>syspolicyd</code> lines at that minute, <code>install.log</code>, XProtect version.</li>
</ul>

<h3>🧪 Practice (30 min, read-only)</h3>
<div class="callout ok"><ol>
<li>Run <code>last | head</code> and explain every "crash" you see — what other source would confirm what happened?</li>
<li>Write a fake sudo line with <code>logger</code>, then write the one predicate that finds only <em>real</em> sudo lines and the one that finds the fake.</li>
<li>Pick one <code>msgID</code> from TCC logs of the last hour and write in one sentence: who asked, for which service, and the answer.</li>
<li>Count the plist files in the three launchd folders and print the <code>ProgramArguments</code> of one of them with <code>plutil -p</code>.</li>
</ol>
<p><strong>Done when:</strong> 2 uses <code>process == "sudo"</code> vs <code>processImagePath == "/usr/bin/logger"</code>; 3 names service + responsible app + authValue; 4 does not load or change anything.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['last', 'Logins, reboots, shutdowns from the wtmp records; "crash" = no logout before next boot.'],
  ['TCC', 'Privacy permission system (camera, files, screen…); tccd logs AUTHREQ_* lines per msgID.'],
  ['Gatekeeper / quarantine', 'Policy for downloaded code; com.apple.quarantine marks downloads; spctl assesses.'],
  ['XProtect', 'Apple’s built-in malware signatures, updated separately (install.log).'],
  ['LaunchAgent / LaunchDaemon', 'launchd job plist — the classic macOS persistence (T1543.001).'],
  ['BTM', 'Background Task Management: tracks login items/agents since macOS 13.'],
  ['processImagePath', 'System-attested path of the writer — exposes fake log lines.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Security evidence is spread over <code>last</code>, the unified log, <code>install.log</code> and launchd plists.</li>
<li>Process fields are attested: a fake "sudo" line is <code>/usr/bin/logger</code>, UID 501.</li>
<li>TCC lines join by <code>msgID</code>: service, accessing + responsible app, authValue.</li>
<li>Real attacks map to what you read: Silver Sparrow (LaunchAgent), XCSSET (TCC), Shlayer (Gatekeeper).</li>
<li>Root can erase local logs — keep a copy off the machine.</li>
</ul>
${nguon('📘', 'Apple Platform Security — Gatekeeper and runtime protection', 'Quarantine, notarisation, first-launch checks', 'https://support.apple.com/guide/security/gatekeeper-and-runtime-protection-sec5599b66df/web')}
${nguon('📘', 'Apple Platform Security — Protecting against malware', 'XProtect, background updates, remediation', 'https://support.apple.com/guide/security/protecting-against-malware-sec469d47bd8/web')}
${nguon('🛡️', 'Red Canary — Clipping Silver Sparrow’s wings (2021)', 'LaunchAgent persistence, hourly check-in', 'https://www.zscaler.com/blogs/cybersecurity-best-practices/clipping-silver-sparrows-wings')}
${nguon('🛡️', 'Jamf — Zero-day TCC bypass in XCSSET malware (2021)', 'CVE-2021-30713, fixed in macOS 11.4', 'https://www.jamf.com/blog/zero-day-tcc-bypass-discovered-in-xcsset-malware/')}
${nguon('🛡️', 'Jamf — Shlayer abusing Gatekeeper bypass (2021)', 'CVE-2021-30657, fixed in macOS 11.3', 'https://www.jamf.com/blog/shlayer-malware-abusing-gatekeeper-bypass-on-macos/')}
${nguon('🎯', 'MITRE ATT&CK T1543.001 — Launch Agent', 'Also T1548.003, T1553.001, T1070.002', 'https://attack.mitre.org/techniques/T1543/001/')}
${nguon('📘', 'Apple Developer — ES_EVENT_TYPE_NOTIFY_BTM_LAUNCH_ITEM_ADD', 'Endpoint Security event for new launch items', 'https://developer.apple.com/documentation/endpointsecurity/es_event_type_t/es_event_type_notify_btm_launch_item_add')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-8-3-auth-log', title: 'Lesson 8.3 — auth.log / secure', sub: 'sudo and SSH logins on Linux', cta: 'Open lesson' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-14-4-xoa-dau-vet', title: 'Lesson 14.4 — Covering tracks', sub: 'Detecting cleared logs across systems', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.5</span>
<h2>Bảo mật trên macOS: ai đăng nhập, ai lên root, thứ gì xin quyền, thứ gì được phép chạy</h2>
<p class="lead">Câu chuyện bảo mật của một máy Mac nằm rải ở nhiều log: bản ghi đăng nhập, unified log (sudo, TCC, Gatekeeper, Background Task Management), <code>install.log</code>, và cấu hình launchd trên đĩa. Bài này đọc từng thứ trên một chiếc MacBook thật <strong>không dùng sudo</strong>, làm giả một dòng log để chỉ cách phát hiện hàng giả, và gắn từng phần với một vụ tấn công macOS có thật.</p>

<h3>Liên tưởng đời thường: an ninh của một chung cư</h3>
<p>Sổ khách ở cửa (<code>last</code>), sổ mượn chìa khoá tổng (<code>sudo</code>), giấy đồng ý của cư dân — "cho thợ sửa ống nước vào căn hộ tôi không?" (TCC), bảo vệ kiểm tra căn cước người mang đồ đạc vào (Gatekeeper), danh sách người bị cấm (XProtect), và mấy công tắc hẹn giờ ai đó lắp dưới tầng hầm, đêm nào cũng tự bật (LaunchAgent). Kẻ đột nhập tìm cách lách qua từng thứ — mẹo là biết phải mở cuốn sổ nào.</p>

<h3>Bước 1 — đăng nhập và khởi động lại: last</h3>
${lenh('s06/bao-mat', 0)}
${lenh('s06/bao-mat', 1)}
<ul>
<li><code>console</code> = ai đó đăng nhập ở màn hình; <code>ttys00N</code> = một phiên terminal. <code>still logged in</code> = đang mở.</li>
<li>Mỗi lần khởi động đều có dòng <code>reboot time</code>; dòng <code>shutdown time</code> chỉ xuất hiện với một số lần tắt máy sạch. Lần khởi động lại ngày 17/11 có cả hai; lần ngày 24/11 <strong>không có dòng shutdown</strong>, và phiên <code>root console</code> ngay trước đó kết thúc bằng <strong>"crash"</strong>.</li>
<li>"crash" trong <code>last</code> chỉ có nghĩa "không có bản ghi đăng xuất nào trước lần khởi động kế". Đó là một câu hỏi, chưa phải câu trả lời. Lab 6 cho thấy "crash" này thật ra là lần khởi động lại để cập nhật macOS — tìm ra nhờ ghép ba log khác.</li>
</ul>
<p>So với Linux (bài 8.1): cùng <code>last</code>, cùng ý tưởng wtmp; macOS không có <code>lastb</code> cho đăng nhập thất bại — các lần thử thất bại nằm trong unified log.</p>

<h3>Bước 2 — sudo, và một dòng sudo giả</h3>
${lenh('s06/bao-mat', 2)}
<p>Số 1 là vì <code>wc -l</code> đếm cả dòng tiêu đề: <strong>7 ngày qua không ai dùng sudo trên máy này</strong>. Trên máy có dùng, mỗi lệnh hiện ở <code>process == "sudo"</code> theo định dạng sudoers <code>user : TTY=… ; PWD=… ; USER=root ; COMMAND=…</code> — còn gõ sai mật khẩu thì là <code>incorrect password attempts</code>. Giờ, kẻ tấn công muốn đổ tội cho ai đó, hay vùi dòng thật trong nhiễu, có thể viết một dòng <em>trông</em> y hệt như thế:</p>
${lenh('s06/bao-mat', 3)}
${lenh('s06/bao-mat', 4)}
${lenh('s06/bao-mat', 5)}
${lenh('s06/bao-mat', 6)}
<p>Tìm <code>process == "sudo"</code> <strong>không</strong> ra nó: tiến trình là <code>logger</code>, đường dẫn tệp chạy là <code>/usr/bin/logger</code>, UID 501 (không phải root), nhãn <code>-t sudo</code> bị bỏ và facility <code>authpriv</code> bị phớt lờ. Trên macOS các trường tiến trình đến từ hệ thống, không phải từ người viết — cùng nguyên tắc với trường tin cậy <code>_COMM</code>/<code>_EXE</code> của journald (bài 7.1), và chặt hơn syslog cổ điển nơi <code>-t</code> được tin. Tìm theo chữ (<code>eventMessage CONTAINS</code>) thì <em>có</em> ra dòng giả, vậy: <strong>luôn xác nhận bằng <code>processImagePath</code></strong>. (Đối tượng JSON cuối là phần đuôi ndjson ở bài 6.3.)</p>
<p>ATT&amp;CK <strong>T1548.003 — Sudo and Sudo Caching</strong>: lợi dụng dấu thời gian của sudo (5 phút không hỏi mật khẩu sau lần dùng trước) hoặc một luật sudoers lỏng. Phòng: theo dõi <code>process == "sudo"</code>, giữ thời hạn mặc định hoặc đặt <code>Defaults timestamp_timeout=0</code> trên máy Mac dùng chung, không bao giờ <code>NOPASSWD: ALL</code>.</p>

<h3>Bước 3 — TCC: ứng dụng nào xin quyền gì</h3>
<p><strong>TCC</strong> (Transparency, Consent and Control) là hệ thống hiện hộp thoại "‘X’ muốn truy cập thư mục Desktop / Camera / Ghi màn hình" và nhớ câu trả lời. Daemon <code>tccd</code> của nó ghi mỗi lần kiểm thành bốn dòng chung một <code>msgID</code>:</p>
${lenh('s06/bao-mat', 7)}
${lenh('s06/bao-mat', 8)}
${lenh('s06/bao-mat', 9)}
${lenh('s06/bao-mat', 10)}
${lenh('s06/bao-mat', 11)}
<ul>
<li><strong>AUTHREQ_CTX</strong> — dịch vụ nào: <code>kTCCServiceListenEvent</code> (Input Monitoring — đọc bàn phím), <code>AddressBook</code> (Danh bạ), <code>Calendar</code>, <code>SystemPolicyAllFiles</code> (Full Disk Access), <code>…DownloadsFolder</code>. <code>preflight=yes</code> = ứng dụng chỉ kiểm thử, không hiện hộp thoại.</li>
<li><strong>AUTHREQ_ATTRIBUTION</strong> — ai: tiến trình <em>truy cập</em> (ở đây <code>osascript</code>) và ứng dụng <em>chịu trách nhiệm</em> (terminal mà nó chạy trong đó). TCC tính yêu cầu cho ứng dụng chịu trách nhiệm — lý do "cho Terminal Full Disk Access" là cho mọi script chạy trong nó quyền đó.</li>
<li><strong>AUTHREQ_RESULT</strong> — câu trả lời: <code>authValue</code> 0 = từ chối, 2 = cho phép (1 = chưa biết; 3 = giới hạn, ví dụ chỉ vài ảnh). Apple không công bố các con số này; chúng khớp với cột <code>auth_value</code> của CSDL TCC mà các nhà nghiên cứu bảo mật đã mô tả.</li>
</ul>
<p>Trong một giờ: 1.598 lần kiểm, 1.525 lần bị từ chối, gần hết là Input Monitoring — một script cứ kiểm xem có được đọc phím gõ không và bị bảo không. Trên máy Mac lab này đó là một script tự động chạy từ terminal (dòng attribution cho thấy osascript dưới iTerm2) — không có gì lạ, nhưng đúng là mẫu cần tìm khi nghi máy Mac bị cài keylogger hay phần mềm gián điệp: <em>một tiến trình lạ xin ListenEvent, ScreenCapture, AllFiles hay Camera</em>.</p>
<div class="callout warn"><p><strong>Tấn công thật — XCSSET, 2021 (CVE-2021-30713).</strong> Jamf phát hiện mã độc XCSSET đặt ứng dụng AppleScript của nó <em>vào bên trong</em> một ứng dụng đã cài sẵn và đã có quyền (ví dụ của họ: bên trong gói của Zoom), nên TCC coi nó là ứng dụng đó và để nó chụp màn hình mà không hỏi. Apple vá ở macOS 11.4 (tháng 5/2021). Bài học khi đọc log TCC: kiểm <code>binary_path</code> và <code>responsible_path</code>, không chỉ mã định danh — một tệp chạy lạ nằm trong gói đáng tin chính là dấu hiệu. Phòng: cập nhật macOS, cấp Full Disk Access/Ghi màn hình cho càng ít ứng dụng càng tốt, rà System Settings › Privacy &amp; Security.</p></div>

<h3>Bước 4 — Gatekeeper và quarantine: ai được chạy</h3>
${lenh('s06/bao-mat', 12)}
${lenh('s06/bao-mat', 13)}
${lenh('s06/bao-mat', 14)}
${lenh('s06/bao-mat', 15)}
<p>Gatekeeper quyết định phần mềm tải về có được chạy không. <code>motep</code> tự dịch của ta (ký ad-hoc) bị chính sách <strong>từ chối</strong>, Calculator được chấp nhận (<code>source=Apple System</code>). Ta vẫn chạy được motep từ Terminal vì nó <em>không phải đồ tải về</em>: trình duyệt và ứng dụng thư gắn thuộc tính <code>com.apple.quarantine</code> (<code>cờ;giờ-hex;ứng-dụng;</code> — ở đây ta tự gắn vào một bản sao, ghi "Safari"), và tệp bị cách ly là thứ Gatekeeper kiểm ở lần mở đầu. <code>com.apple.provenance</code> là thuộc tính mới hơn, ghi ứng dụng nào đã tạo ra tệp. Quyết định được <code>syspolicyd</code> ghi lại:</p>
${lenh('s06/bao-mat', 16)}
<div class="callout warn"><p><strong>Tấn công thật — Shlayer, 2021 (CVE-2021-30657).</strong> Jamf thấy adware Shlayer phát tán một ứng dụng giả mà "tệp chạy" là một script shell và <em>không có Info.plist</em>. macOS 10.15–11.2 chạy nó mà không qua kiểm cách ly, chữ ký hay notarize. Vá ở macOS 11.3 (tháng 4/2021). ATT&amp;CK <strong>T1553.001 — Gatekeeper Bypass</strong> (còn có: gỡ thuộc tính quarantine bằng <code>xattr -d</code>, lừa người dùng chuột phải › Open). Phòng: cập nhật, đừng bao giờ bảo người dùng "cứ chạy xattr -cr", và theo dõi <code>syspolicyd</code> cùng dữ liệu tạo tiến trình (EDR).</p></div>

<h3>Bước 5 — XProtect: bộ quét chữ ký dựng sẵn</h3>
${lenh('s06/bao-mat', 17)}
${lenh('s06/bao-mat', 18)}
<p>XProtect là danh sách chữ ký mã độc của Apple; nó cập nhật âm thầm và tách khỏi macOS. <code>install.log</code> giữ lịch sử các lần cập nhật đó — thứ đầu tiên cần kiểm khi ai đó hỏi "hôm xảy ra sự cố, lớp bảo vệ của máy Mac này có mới không?". Phát hiện và xử lý xuất hiện trong unified log dưới các tiến trình XProtect và trong dữ liệu Endpoint Security mà EDR thu.</p>

<h3>Bước 6 — launchd, LaunchAgent và Background Task Management</h3>
${lenh('s06/bao-mat', 19)}
<p><code>launchd</code> (PID 1) khởi động mọi thứ. Việc của từng người dùng nằm trong miền <code>gui/&lt;uid&gt;</code> (ở đây 467 dịch vụ); <code>launchctl print gui/$(id -u)/&lt;label&gt;</code> cho biết chương trình, mã thoát lần trước và số lần chạy của một việc — chỉ đọc và rất có ích. Các việc được khai bằng tệp plist trong <code>~/Library/LaunchAgents</code> (từng người dùng), <code>/Library/LaunchAgents</code> (mọi người dùng), <code>/Library/LaunchDaemons</code> (chạy bằng root):</p>
${lenh('s06/bao-mat', 20)}
<p>17 tệp trên máy này (không in tên — đó là danh sách phần mềm đã cài). Đây là dáng một tệp độc hại — ví dụ để đọc, không bao giờ nạp:</p>
${ma('xml', 's06/vi-du-launchagent.plist')}
${lenh('s06/bao-mat', 21)}
<div class="callout warn"><p><strong>Tấn công thật — Silver Sparrow, tháng 2/2021.</strong> Red Canary tìm thấy mã độc trên khoảng 30.000 máy Mac (số liệu Malwarebytes, 153 quốc gia), một trong những con đầu tiên có mã chạy thẳng trên Apple Silicon. Nó bám trụ bằng một LaunchAgent (<code>~/Library/LaunchAgents/init_verx.plist</code>) có <code>RunAtLoad</code> và <code>StartInterval 3600</code> — mỗi giờ tải một tệp JSON từ kho lưu trữ đám mây để xem chạy gì tiếp. ATT&amp;CK <strong>T1543.001 — Launch Agent</strong>.</p></div>
<p>Từ macOS 13, <strong>Background Task Management</strong> theo dõi mọi mục đăng nhập và launch agent: người dùng nhận thông báo "Background Items Added", và sự kiện được ghi lại:</p>
${lenh('s06/bao-mat', 22)}
<p>Muốn liệt kê đầy đủ có <code>sfltool dumpbtm</code>, nhưng nó cần quản trị viên (nó chờ xác thực — chúng tôi không chạy). Công cụ EDR nhận cùng thông tin đó qua sự kiện Endpoint Security <code>ES_EVENT_TYPE_NOTIFY_BTM_LAUNCH_ITEM_ADD</code>. Phòng: rà System Settings › General › Login Items &amp; Extensions, cảnh báo khi có plist mới trong ba thư mục, soi <code>ProgramArguments</code> chạy shell từ thư mục người dùng ghi được.</p>

<h3>Bước 7 — xoá dấu vết, và dấu vết chính lệnh của bạn để lại</h3>
${lenh('s06/bao-mat', 23)}
<p>Mọi lần gọi <code>log</code> đều được ghi kèm tham số (bài 6.4). Kẻ đột nhập chạy <code>log show</code> để dò xét sẽ để lại những dòng này — bằng chứng có ích. Kẻ đột nhập có root thì đi xa hơn: <code>sudo log erase --all</code>, xoá báo cáo crash, sửa <code>~/.zsh_history</code> — ATT&amp;CK <strong>T1070.002 — Clear Linux or Mac System Logs</strong>. Dấu hiệu: unified log bỗng có khoảng trống, <code>log stats</code> bắt đầu muộn hơn nhiều so với lẽ thường, báo cáo biến mất. Cách bảo vệ thật duy nhất là một bản sao <em>ngoài</em> máy: EDR/MDM truyền sự kiện đi, hoặc log gửi về hệ thống tập trung (Chương 15).</p>

<h3>Tình huống đi làm</h3>
<ul>
<li><strong>Máy Mac của đồng nghiệp hiện hộp thoại lạ "muốn điều khiển máy tính này".</strong> Log TCC một giờ qua: tệp chạy nào, ứng dụng chịu trách nhiệm nào, dịch vụ gì, trả lời ra sao.</li>
<li><strong>Đội bảo mật hỏi "tuần này có gì cài bám trụ lên máy Mac này không?"</strong> Plist mới trong ba thư mục LaunchAgents/Daemons theo giờ sửa, dòng BTM <code>register</code>, <code>launchctl print</code> từng label lạ.</li>
<li><strong>Người dùng "chỉ chạy bộ cài trong email".</strong> <code>xattr -l</code> trên tệp (quarantine: ứng dụng nào tải về), dòng <code>syspolicyd</code> đúng phút đó, <code>install.log</code>, phiên bản XProtect.</li>
</ul>

<h3>🧪 Thực hành (30 phút, chỉ đọc)</h3>
<div class="callout ok"><ol>
<li>Chạy <code>last | head</code> và giải thích từng chữ "crash" bạn thấy — nguồn nào khác sẽ xác nhận chuyện gì đã xảy ra?</li>
<li>Viết một dòng sudo giả bằng <code>logger</code>, rồi viết đúng một predicate chỉ ra dòng sudo <em>thật</em> và một predicate ra dòng giả.</li>
<li>Chọn một <code>msgID</code> trong log TCC giờ qua và viết một câu: ai xin, dịch vụ gì, trả lời ra sao.</li>
<li>Đếm tệp plist trong ba thư mục của launchd và in <code>ProgramArguments</code> của một tệp bằng <code>plutil -p</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> câu 2 dùng <code>process == "sudo"</code> so với <code>processImagePath == "/usr/bin/logger"</code>; câu 3 nêu dịch vụ + ứng dụng chịu trách nhiệm + authValue; câu 4 không nạp hay sửa gì.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['last', 'Đăng nhập, khởi động lại, tắt máy từ bản ghi wtmp; "crash" = không có đăng xuất trước lần khởi động kế.'],
  ['TCC', 'Hệ thống quyền riêng tư (camera, tệp, màn hình…); tccd ghi các dòng AUTHREQ_* theo msgID.'],
  ['Gatekeeper / quarantine', 'Chính sách cho mã tải về; com.apple.quarantine đánh dấu đồ tải về; spctl đánh giá.'],
  ['XProtect', 'Chữ ký mã độc dựng sẵn của Apple, cập nhật riêng (install.log).'],
  ['LaunchAgent / LaunchDaemon', 'Tệp plist khai việc cho launchd — cách bám trụ kinh điển trên macOS (T1543.001).'],
  ['BTM', 'Background Task Management: theo dõi mục đăng nhập/agent từ macOS 13.'],
  ['processImagePath', 'Đường dẫn người viết do hệ thống xác nhận — lật mặt dòng log giả.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Bằng chứng bảo mật nằm rải ở <code>last</code>, unified log, <code>install.log</code> và plist của launchd.</li>
<li>Trường tiến trình do hệ thống xác nhận: dòng "sudo" giả là <code>/usr/bin/logger</code>, UID 501.</li>
<li>Dòng TCC ghép theo <code>msgID</code>: dịch vụ, ứng dụng truy cập + chịu trách nhiệm, authValue.</li>
<li>Tấn công thật khớp với thứ bạn đọc: Silver Sparrow (LaunchAgent), XCSSET (TCC), Shlayer (Gatekeeper).</li>
<li>Root xoá được log trên máy — hãy giữ một bản sao ngoài máy.</li>
</ul>
${nguon('📘', 'Apple Platform Security — Gatekeeper and runtime protection', 'Quarantine, notarize, kiểm tra lần mở đầu', 'https://support.apple.com/guide/security/gatekeeper-and-runtime-protection-sec5599b66df/web')}
${nguon('📘', 'Apple Platform Security — Protecting against malware', 'XProtect, cập nhật nền, xử lý mã độc', 'https://support.apple.com/guide/security/protecting-against-malware-sec469d47bd8/web')}
${nguon('🛡️', 'Red Canary — Clipping Silver Sparrow’s wings (2021)', 'Bám trụ bằng LaunchAgent, báo về mỗi giờ', 'https://www.zscaler.com/blogs/cybersecurity-best-practices/clipping-silver-sparrows-wings')}
${nguon('🛡️', 'Jamf — Zero-day TCC bypass in XCSSET malware (2021)', 'CVE-2021-30713, vá ở macOS 11.4', 'https://www.jamf.com/blog/zero-day-tcc-bypass-discovered-in-xcsset-malware/')}
${nguon('🛡️', 'Jamf — Shlayer abusing Gatekeeper bypass (2021)', 'CVE-2021-30657, vá ở macOS 11.3', 'https://www.jamf.com/blog/shlayer-malware-abusing-gatekeeper-bypass-on-macos/')}
${nguon('🎯', 'MITRE ATT&CK T1543.001 — Launch Agent', 'Cùng T1548.003, T1553.001, T1070.002', 'https://attack.mitre.org/techniques/T1543/001/')}
${nguon('📘', 'Apple Developer — ES_EVENT_TYPE_NOTIFY_BTM_LAUNCH_ITEM_ADD', 'Sự kiện Endpoint Security khi có launch item mới', 'https://developer.apple.com/documentation/endpointsecurity/es_event_type_t/es_event_type_notify_btm_launch_item_add')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-8-3-auth-log', title: 'Bài 8.3 — auth.log / secure', sub: 'sudo và đăng nhập SSH trên Linux', cta: 'Mở bài' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-14-4-xoa-dau-vet', title: 'Bài 14.4 — Xoá dấu vết', sub: 'Phát hiện log bị xoá trên nhiều hệ thống', cta: 'Mở bài' })}
</div>
`,
};
