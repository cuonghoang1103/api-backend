/**
 * 7.2 — Bộ lọc journalctl (soạn 24/11/2026, agent lgz).
 * Output thật: OUT['s07/loc'] — máy ảo lab7 (Ubuntu 24.04, systemd 255) sau ba lần khởi động cố ý (rút điện, thử volatile, khởi động lại sạch).
 * Nguồn: man journalctl(1) (MATCHES: cùng trường = OR, khác trường = AND, "+" = OR giữa nhóm; -g dùng PCRE2, "smart case"),
 * systemd.journal-fields(7) (UNIT= do PID 1 gắn cho thông điệp về một unit).
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '7.2 — journalctl filters: -u, -b, --list-boots, --since/--until, -p, -t, -k, _PID=, -g, -f, -n, -r|||7.2 — Bộ lọc journalctl: -u, -b, --list-boots, --since/--until, -p, -t, -k, _PID=, -g, -f, -n, -r',
  slug: 'log-7-2-journalctl-loc',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lọc journal như thủ thư rút phiếu: theo lần khởi động (--list-boots, -b -1: tắt sạch hay chết đột ngột), theo dịch vụ (-u khác _SYSTEMD_UNIT= ở chỗ nào), theo mức (-p err, dải warning..warning) và cái bẫy traceback Python bị ghi là info, theo thời gian (--since/--until), theo tên (-t), theo trường (_PID=, PRIORITY=), luật AND/OR/"+" khi ghép nhiều trường, tìm chữ bằng -g (regex, tự phân biệt hoa thường), -f/-n/-r/-x, và thứ tự thao tác khi điều tra một dịch vụ chết — tất cả trên dịch vụ hỏng thật "Start request repeated too quickly".',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>journalctl filters: asking the journal exact questions</h2>
<p class="lead">Lesson 7.1 showed that every record is a set of fields. Every journalctl filter is just a question about those fields: which boot, which unit, which priority, which time, which process, which words. This lesson goes through the filters you will type every week, on the real history of the lab7 VM, and ends with the order to use them when a service dies.</p>

<h3>The everyday picture: the reception desk's visitor book</h3>
<p>A building's visitor book has columns: date, name, company, floor, time in, time out. "Who visited floor 7 on Tuesday afternoon?" is three column filters combined. Nobody reads the whole book. journalctl filters are those column filters; the flags below are shortcuts for the columns you use most.</p>

<h3>Step 1 — boots: -b and --list-boots</h3>
${lenh('s07/loc', 0)}
<p>Four boots: <code>0</code> is now, <code>-1</code> the one before, and so on (positive numbers count from the oldest). The two ways a boot can end tell you different stories:</p>
${lenh('s07/loc', 1)}
${lenh('s07/loc', 2)}
<p>Boot <code>-1</code> ended <strong>cleanly</strong>: <code>reboot.target</code>, <code>Shutting down</code>, <code>Journal stopped</code> — someone or something asked for a reboot. Boot <code>-3</code> ends in the middle of ordinary traffic: the machine <strong>died</strong> (that was our power cut in 7.1). When someone asks "why did the server restart?", <code>journalctl -b -1 -n 30</code> is the first answer: a clean shutdown sequence means "look for who ran reboot" (<code>journalctl -b -1 -g reboot</code>, <code>-t sudo</code>, unattended upgrades); no sequence means "power, hypervisor, kernel panic, OOM of the whole machine" — check the provider and lesson 7.5.</p>

<h3>Step 2 — a broken service: -u, and what systemctl status hides</h3>
${lenh('s07/loc', 3)}
<p><code>systemctl status</code> shows the state and the last 10 lines. Here: <code>failed (Result: exit-code)</code>, exit status 1, and <strong>Start request repeated too quickly</strong>: systemd restarted it 5 times within 10 seconds (the default <code>StartLimitBurst=5</code> per <code>StartLimitIntervalSec=10s</code>) and then gave up. The <em>reason</em> it died is not in those 10 lines. Ask for the unit's full story in this boot:</p>
${lenh('s07/loc', 4)}
<p>Now it is obvious: <code>FileNotFoundError … '/etc/shop/worker.json'</code>. Notice two kinds of lines under one <code>-u</code>: lines from the program itself (<code>python3[427]</code>) and lines from systemd <em>about</em> the unit (<code>systemd[1]</code>). That matters in step 4.</p>

<h3>Step 3 — priority: -p, and the trap of the Python traceback</h3>
${lenh('s07/loc', 5)}
<p>Only systemd's line survives <code>-p err</code>. The traceback — the actual error — disappeared. Why?</p>
${lenh('s07/loc', 15)}
<p>The traceback arrived through stdout/stderr without a <code>&lt;3&gt;</code> prefix, so journald stored it as <strong>PRIORITY 6 (info)</strong>. journald has no idea that "FileNotFoundError" is bad. The same happens with Java stack traces, Node crash dumps and JSON logs whose <code>"level":"error"</code> lives inside the text. Rule: <code>-p err</code> is reliable for systemd, the kernel and well-behaved daemons; for application output, filter by unit and read, or grep the text (step 6). The deploy course shows the same trap with JSON logs.</p>
${lenh('s07/loc', 6)}
${lenh('s07/loc', 7)}
<p><code>-p err</code> means "err and more severe" (0–3). A range <code>warning..warning</code> means exactly that level. Look at the first five errors of this boot: <code>I/O error, dev fd0</code> from the kernel. This VM has a virtual floppy controller with no disk inserted — the kernel probes it and complains. Harmless noise, present on many VMs. Part of reading logs is learning which red lines are normal on <em>your</em> systems; write them down in the team wiki.</p>

<h3>Step 4 — fields: _SYSTEMD_UNIT=, UNIT=, PRIORITY=, and how filters combine</h3>
${lenh('s07/loc', 10)}
${lenh('s07/loc', 11)}
<p>Matching a field: <code>FIELD=value</code>, exact. The combining rules (from <code>man journalctl</code>):</p>
<ul>
<li><strong>Different fields = AND.</strong> <code>_SYSTEMD_UNIT=shop-api.service PRIORITY=3</code> → api lines that are errors.</li>
<li><strong>Same field twice = OR.</strong> <code>_SYSTEMD_UNIT=shop-api.service _SYSTEMD_UNIT=shop-worker.service</code> → lines of either unit. With <code>-p err</code> we get only api lines — because the worker's error line was written by systemd (PID 1), not by the worker.</li>
<li><strong><code>+</code> = OR between whole groups.</strong> <code>A + B C</code> means A, or (B and C):</li>
</ul>
${lenh('s07/loc', 12)}
${lenh('s07/loc', 13)}
${lenh('s07/loc', 14)}
<p>Here is the difference between <code>-u</code> and <code>_SYSTEMD_UNIT=</code>. The "Failed to start" line has <code>_SYSTEMD_UNIT=init.scope</code> (it comes from PID 1) and <code>UNIT=shop-worker.service</code> (the unit it is <em>about</em>). <code>_SYSTEMD_UNIT=shop-worker.service</code> gives only the program's own lines; <strong><code>-u shop-worker</code> gives both</strong> — it also matches <code>UNIT=</code>, coredumps of the unit and more. Use <code>-u</code> for investigation; use the raw trusted field when you must prove "this process wrote this" (lesson 7.1, the fake sshd).</p>
${lenh('s07/loc', 23)}
<p><code>_PID=1</code> = everything systemd itself said. Other fields you will use: <code>_UID=0</code> (written by root), <code>_COMM=sshd</code>, <code>_EXE=/usr/sbin/sshd</code>, <code>_HOSTNAME=</code> when journals of several machines are merged, <code>_BOOT_ID=</code>, <code>SYSLOG_IDENTIFIER=</code> (that is what <code>-t</code> matches).</p>

<h3>Step 5 — time and names: --since/--until, -t</h3>
${lenh('s07/loc', 8)}
${lenh('s07/loc', 9)}
<p><code>--since</code>/<code>--until</code> accept <code>"2026-11-24 04:10:00"</code>, <code>"04:10"</code> (today), <code>yesterday</code>, <code>today</code>, <code>"10 min ago"</code>, <code>-1h</code>. Times are in the machine's time zone unless you add <code>UTC</code> — when you compare with nginx or a cloud console, decide on one zone first (lesson 1.5). <code>-t sudo</code> filters by <code>SYSLOG_IDENTIFIER</code>: the program's name tag, which works for things that are not units (sudo, cron jobs, scripts using <code>logger</code>). Remember 7.1: the tag is a claim, not a fact.</p>

<h3>Step 6 — words: -g</h3>
${lenh('s07/loc', 16)}
${lenh('s07/loc', 17)}
${lenh('s07/loc', 18)}
${lenh('s07/loc', 19)}
<p><code>-g</code> (<code>--grep</code>) matches <code>MESSAGE</code> with a PCRE2 regular expression. "Smart case": an all-lowercase pattern ignores case, a pattern with any capital letter is case-sensitive — so <code>DATABASE TIMEOUT</code> finds 0. Force it with <code>--case-sensitive=false</code>. <code>-g</code> runs inside journalctl after field filters, so <code>-u shop-api -g …</code> is fast. Two quirks seen on systemd 255: with <code>-g</code> and <code>-n</code> the three results above came out newest-first; and searches spanning several boots print empty <code>-- Boot … --</code> separators. Add <code>-b</code> or pipe to <code>grep</code> when you need plain lines.</p>

<h3>Step 7 — watching and paging: -f, -n, -r, -e, -x</h3>
${lenh('s07/loc', 20)}
${lenh('s07/loc', 21)}
<ul>
<li><code>-f</code> follows like <code>tail -f</code> (shows the last 10 first). Use it while you reproduce a bug in another terminal.</li>
<li><code>-n 50</code> last 50 records; <code>-r</code> newest first; <code>-e</code> jump to the end inside the pager.</li>
<li><code>--no-pager</code> when you pipe or paste into a ticket. Long lines are cut in the pager; press → or use <code>--no-pager</code>.</li>
<li><code>-x</code> adds explanations from the message catalogue:</li>
</ul>
${lenh('s07/loc', 22)}
<p><code>journalctl -xeu &lt;unit&gt;</code> is what systemd itself tells you to run after a failed start. The catalogue text is generic; the lines <em>above</em> it are what matters.</p>

<h3>The order of work when a service dies</h3>
<ol>
<li><code>systemctl status X</code> — state, result (<code>exit-code</code>, <code>signal</code>, <code>oom-kill</code>, <code>timeout</code>, <code>start-limit-hit</code>), exit status, when.</li>
<li><code>journalctl -u X -b -n 100</code> (or <code>--since</code> the time) — the program's last words before dying.</li>
<li><code>journalctl -b -p warning --since "&lt;5 min before&gt;"</code> — what else was unhappy at the same time (disk, network, other services).</li>
<li><code>journalctl -k -b --since …</code> — kernel: OOM, segfault, I/O error (lesson 7.5).</li>
<li><code>journalctl --list-boots</code> and <code>-b -1 -n 30</code> — did the machine itself restart?</li>
<li>Write it down: time, unit, result, the one line that proves the cause, the fix.</li>
</ol>

<h3>Real-life situations</h3>
<ul>
<li><strong>OJT deploy:</strong> after you deploy, the service is "activating (auto-restart)" in a loop. <code>journalctl -u app -f</code> in one window, <code>systemctl restart app</code> in another: you see the exception live. The usual causes: missing env variable or config file, wrong path, port in use, permission on a file.</li>
<li><strong>"It works when I run it by hand":</strong> by hand you are your user in your home folder with your environment; the service runs as another user, with <code>WorkingDirectory=/</code>, no <code>.bashrc</code>. The error in <code>journalctl -u</code> is usually a relative path or a missing variable.</li>
<li><strong>The customer says "it failed around 3 a.m."</strong> → <code>journalctl --since "03:00" --until "03:30" -p warning</code> on each server, then narrow by unit.</li>
</ul>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok"><ol>
<li>Make a unit that fails like <code>shop-worker</code>. Use <code>systemctl status</code> and <code>journalctl -u</code> to find the cause line, then fix it and run <code>systemctl reset-failed</code>.</li>
<li>Find every line written by root (<code>_UID=0</code>) in the last 10 minutes that is not from systemd itself.</li>
<li>Show the lines of either <code>ssh.service</code> or the <code>sudo</code> tag, in one command.</li>
<li>Reboot your VM. Prove from the journal whether the previous boot ended cleanly. ⚠️ Use a real VM, not a container: a container shares the host kernel's boot ID, and podman mounts a tmpfs on <code>/var/log/journal</code> — after a "reboot" <code>--list-boots</code> still shows a single boot and the previous one is gone (tested 24/11/2026, Ubuntu 24.04 + systemd 255 under podman).</li>
<li>Count, per hour today, how many lines matched <code>timeout</code> (hint: <code>-o short-iso</code> and <code>cut</code>).</li>
</ol>
<p><strong>Done when:</strong> 1 names the exact line and the result <code>start-limit-hit</code> or <code>exit-code</code>; 2 uses <code>_UID=0</code> with <code>--since</code> and excludes <code>_PID=1</code> by reading or with a second filter; 3 is <code>journalctl _SYSTEMD_UNIT=ssh.service + SYSLOG_IDENTIFIER=sudo</code> — note that <code>-u ssh -t sudo</code> ANDs the two and returns "-- No entries --" on systemd 255; 4 quotes the last lines of <code>-b -1</code>.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['-b [N]', 'Records of one boot: 0 current, -1 previous; --list-boots lists them.'],
  ['-u UNIT', 'Lines of a unit and lines about it (matches _SYSTEMD_UNIT, UNIT, coredumps…).'],
  ['-p LEVEL', 'Priority filter: "err" = 0–3; a..b = range; app stdout without prefix is always info.'],
  ['FIELD=value', 'Exact field match; different fields AND, same field OR, "+" ORs whole groups.'],
  ['-g PATTERN', 'Regex on MESSAGE (PCRE2), smart case.'],
  ['-t ID', 'Match SYSLOG_IDENTIFIER (the program’s self-chosen tag).'],
  ['start-limit-hit', 'systemd stopped restarting a unit that failed too often (default 5 in 10 s).'],
])}

<h3>📌 Summary</h3>
<ul>
<li>"Why did it restart?" starts with <code>--list-boots</code> and the last lines of <code>-b -1</code>: clean shutdown vs sudden death.</li>
<li><code>systemctl status</code> tells you <em>that</em> it failed; <code>journalctl -u X -b</code> tells you <em>why</em>.</li>
<li><code>-p err</code> misses application errors printed without a priority prefix — tracebacks are "info".</li>
<li><code>-u</code> is wider than <code>_SYSTEMD_UNIT=</code>; fields AND, same field OR, <code>+</code> ORs groups.</li>
<li><code>-g</code> is regex with smart case; <code>-f</code> while reproducing; <code>--no-pager</code> when pasting.</li>
</ul>
${nguon('📘', 'journalctl(1)', 'Every option, the matching rules and time formats', 'https://man7.org/linux/man-pages/man1/journalctl.1.html')}
${nguon('📘', 'systemd.unit(5) — StartLimitIntervalSec=', 'Why a unit stops restarting', 'https://man7.org/linux/man-pages/man5/systemd.unit.5.html')}
${lienKet({ khoa: 'deploy-vps', bai: 'deploy-9-3-log', title: 'Deploy VPS 9.3 — Reading app logs on a VPS', sub: 'The same -p trap with JSON logs, jq fromjson?', cta: 'Open lesson' })}
${lienKet({ khoa: 'linux-bash', bai: 'lnx-10-3-log-journalctl', title: 'Linux & Bash 10.3 — Logs and journalctl', sub: 'Beginner version of these filters', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>Bộ lọc journalctl: hỏi journal những câu thật chính xác</h2>
<p class="lead">Bài 7.1 cho thấy mỗi bản ghi là một tập trường. Mọi bộ lọc của journalctl chỉ là một câu hỏi về các trường đó: lần khởi động nào, unit nào, mức nào, lúc nào, tiến trình nào, chữ gì. Bài này đi qua những bộ lọc bạn sẽ gõ hằng tuần, trên lịch sử thật của máy ảo lab7, và kết thúc bằng thứ tự dùng chúng khi một dịch vụ chết.</p>

<h3>Liên tưởng đời thường: sổ khách ở quầy lễ tân</h3>
<p>Sổ khách của một toà nhà có các cột: ngày, họ tên, công ty, tầng, giờ vào, giờ ra. "Ai lên tầng 7 chiều thứ Ba?" là ba bộ lọc cột ghép lại. Không ai đọc cả cuốn sổ. Bộ lọc journalctl chính là các bộ lọc cột đó; các cờ dưới đây là lối tắt cho những cột hay dùng nhất.</p>

<h3>Bước 1 — lần khởi động: -b và --list-boots</h3>
${lenh('s07/loc', 0)}
<p>Bốn lần khởi động: <code>0</code> là bây giờ, <code>-1</code> là lần trước, cứ thế lùi (số dương đếm từ lần cũ nhất). Hai cách một lần khởi động kết thúc kể hai câu chuyện khác nhau:</p>
${lenh('s07/loc', 1)}
${lenh('s07/loc', 2)}
<p>Lần <code>-1</code> kết thúc <strong>sạch</strong>: <code>reboot.target</code>, <code>Shutting down</code>, <code>Journal stopped</code> — có người hoặc có thứ gì đó yêu cầu khởi động lại. Lần <code>-3</code> dừng giữa lưu lượng bình thường: máy <strong>chết</strong> (đó là lần rút điện ở 7.1). Khi ai đó hỏi "sao máy chủ khởi động lại?", <code>journalctl -b -1 -n 30</code> là câu trả lời đầu tiên: có chuỗi tắt máy sạch nghĩa là "tìm xem ai chạy reboot" (<code>journalctl -b -1 -g reboot</code>, <code>-t sudo</code>, cập nhật tự động); không có chuỗi đó nghĩa là "điện, hypervisor, kernel panic, OOM cả máy" — xem phía nhà cung cấp và bài 7.5.</p>

<h3>Bước 2 — một dịch vụ hỏng: -u, và thứ systemctl status giấu đi</h3>
${lenh('s07/loc', 3)}
<p><code>systemctl status</code> cho trạng thái và 10 dòng cuối. Ở đây: <code>failed (Result: exit-code)</code>, mã thoát 1, và <strong>Start request repeated too quickly</strong>: systemd đã khởi động lại nó 5 lần trong 10 giây (mặc định <code>StartLimitBurst=5</code> mỗi <code>StartLimitIntervalSec=10s</code>) rồi bỏ cuộc. <em>Lý do</em> nó chết không nằm trong 10 dòng đó. Hãy xin toàn bộ câu chuyện của unit trong lần khởi động này:</p>
${lenh('s07/loc', 4)}
<p>Giờ thì rõ: <code>FileNotFoundError … '/etc/shop/worker.json'</code>. Để ý hai loại dòng dưới cùng một <code>-u</code>: dòng do chính chương trình viết (<code>python3[427]</code>) và dòng systemd viết <em>về</em> unit (<code>systemd[1]</code>). Điều này quan trọng ở bước 4.</p>

<h3>Bước 3 — mức: -p, và cái bẫy traceback của Python</h3>
${lenh('s07/loc', 5)}
<p>Qua <code>-p err</code> chỉ còn dòng của systemd. Traceback — chính cái lỗi — biến mất. Vì sao?</p>
${lenh('s07/loc', 15)}
<p>Traceback đi vào qua stdout/stderr mà không có tiền tố <code>&lt;3&gt;</code>, nên journald lưu nó với <strong>PRIORITY 6 (info)</strong>. journald không biết "FileNotFoundError" là chuyện xấu. Y như vậy với stack trace Java, bản tin sập của Node và log JSON có <code>"level":"error"</code> nằm bên trong chữ. Luật: <code>-p err</code> đáng tin với systemd, nhân và các daemon tử tế; với output của ứng dụng, hãy lọc theo unit rồi đọc, hoặc tìm chữ (bước 6). Khoá deploy chỉ ra đúng cái bẫy này với log JSON.</p>
${lenh('s07/loc', 6)}
${lenh('s07/loc', 7)}
<p><code>-p err</code> nghĩa là "err và nghiêm trọng hơn" (0–3). Dải <code>warning..warning</code> nghĩa là đúng một mức đó. Nhìn năm lỗi đầu tiên của lần khởi động này: <code>I/O error, dev fd0</code> từ nhân. Máy ảo này có bộ điều khiển đĩa mềm ảo mà không có đĩa — nhân dò nó rồi kêu. Nhiễu vô hại, có trên nhiều máy ảo. Một phần của việc đọc log là học xem dòng đỏ nào là bình thường trên hệ thống <em>của bạn</em>; ghi chúng vào wiki của nhóm.</p>

<h3>Bước 4 — trường: _SYSTEMD_UNIT=, UNIT=, PRIORITY=, và cách ghép bộ lọc</h3>
${lenh('s07/loc', 10)}
${lenh('s07/loc', 11)}
<p>Khớp một trường: <code>TRƯỜNG=giá-trị</code>, khớp chính xác. Luật ghép (theo <code>man journalctl</code>):</p>
<ul>
<li><strong>Khác trường = VÀ.</strong> <code>_SYSTEMD_UNIT=shop-api.service PRIORITY=3</code> → dòng của api mà là lỗi.</li>
<li><strong>Cùng trường hai lần = HOẶC.</strong> <code>_SYSTEMD_UNIT=shop-api.service _SYSTEMD_UNIT=shop-worker.service</code> → dòng của unit này hoặc unit kia. Thêm <code>-p err</code> thì chỉ còn dòng của api — vì dòng lỗi của worker do systemd (PID 1) viết, không phải do worker.</li>
<li><strong><code>+</code> = HOẶC giữa cả nhóm.</strong> <code>A + B C</code> nghĩa là A, hoặc (B và C):</li>
</ul>
${lenh('s07/loc', 12)}
${lenh('s07/loc', 13)}
${lenh('s07/loc', 14)}
<p>Đây là chỗ khác nhau giữa <code>-u</code> và <code>_SYSTEMD_UNIT=</code>. Dòng "Failed to start" có <code>_SYSTEMD_UNIT=init.scope</code> (nó đến từ PID 1) và <code>UNIT=shop-worker.service</code> (unit mà nó nói <em>về</em>). <code>_SYSTEMD_UNIT=shop-worker.service</code> chỉ cho dòng của chính chương trình; <strong><code>-u shop-worker</code> cho cả hai</strong> — nó còn khớp <code>UNIT=</code>, coredump của unit và hơn nữa. Điều tra thì dùng <code>-u</code>; khi phải chứng minh "chính tiến trình này đã viết dòng này" thì dùng trường tin cậy gốc (bài 7.1, vụ sshd giả).</p>
${lenh('s07/loc', 23)}
<p><code>_PID=1</code> = mọi thứ chính systemd đã nói. Các trường khác bạn sẽ dùng: <code>_UID=0</code> (do root viết), <code>_COMM=sshd</code>, <code>_EXE=/usr/sbin/sshd</code>, <code>_HOSTNAME=</code> khi trộn journal của nhiều máy, <code>_BOOT_ID=</code>, <code>SYSLOG_IDENTIFIER=</code> (thứ mà <code>-t</code> khớp).</p>

<h3>Bước 5 — thời gian và tên: --since/--until, -t</h3>
${lenh('s07/loc', 8)}
${lenh('s07/loc', 9)}
<p><code>--since</code>/<code>--until</code> nhận <code>"2026-11-24 04:10:00"</code>, <code>"04:10"</code> (hôm nay), <code>yesterday</code>, <code>today</code>, <code>"10 min ago"</code>, <code>-1h</code>. Giờ tính theo múi giờ của máy trừ khi thêm <code>UTC</code> — khi so với nginx hay console cloud, chốt một múi giờ trước (bài 1.5). <code>-t sudo</code> lọc theo <code>SYSLOG_IDENTIFIER</code>: nhãn tên do chương trình tự đặt, dùng được cho thứ không phải unit (sudo, việc cron, script dùng <code>logger</code>). Nhớ 7.1: nhãn là lời tự khai, không phải sự thật.</p>

<h3>Bước 6 — chữ: -g</h3>
${lenh('s07/loc', 16)}
${lenh('s07/loc', 17)}
${lenh('s07/loc', 18)}
${lenh('s07/loc', 19)}
<p><code>-g</code> (<code>--grep</code>) khớp <code>MESSAGE</code> bằng biểu thức chính quy PCRE2. "Smart case": mẫu toàn chữ thường thì bỏ qua hoa thường, mẫu có bất kỳ chữ hoa nào thì phân biệt — nên <code>DATABASE TIMEOUT</code> ra 0. Ép bằng <code>--case-sensitive=false</code>. <code>-g</code> chạy bên trong journalctl sau các bộ lọc trường, nên <code>-u shop-api -g …</code> rất nhanh. Hai điểm lạ thấy trên systemd 255: có <code>-g</code> và <code>-n</code> thì ba kết quả trên ra theo thứ tự mới nhất trước; và tìm qua nhiều lần khởi động thì in các dòng ngăn <code>-- Boot … --</code> rỗng. Thêm <code>-b</code> hoặc nối sang <code>grep</code> khi cần dòng trơn.</p>

<h3>Bước 7 — theo dõi và lật trang: -f, -n, -r, -e, -x</h3>
${lenh('s07/loc', 20)}
${lenh('s07/loc', 21)}
<ul>
<li><code>-f</code> bám theo như <code>tail -f</code> (hiện 10 dòng cuối trước). Dùng khi tái hiện lỗi ở terminal khác.</li>
<li><code>-n 50</code> 50 bản ghi cuối; <code>-r</code> mới nhất trước; <code>-e</code> nhảy tới cuối trong trình xem trang.</li>
<li><code>--no-pager</code> khi nối ống hoặc dán vào ticket. Dòng dài bị cắt trong trình xem trang; bấm → hoặc dùng <code>--no-pager</code>.</li>
<li><code>-x</code> thêm lời giải thích từ danh mục thông điệp:</li>
</ul>
${lenh('s07/loc', 22)}
<p><code>journalctl -xeu &lt;unit&gt;</code> là lệnh chính systemd bảo bạn chạy sau một lần khởi động thất bại. Chữ của danh mục rất chung chung; các dòng <em>phía trên</em> nó mới là thứ quan trọng.</p>

<h3>Thứ tự thao tác khi một dịch vụ chết</h3>
<ol>
<li><code>systemctl status X</code> — trạng thái, kết quả (<code>exit-code</code>, <code>signal</code>, <code>oom-kill</code>, <code>timeout</code>, <code>start-limit-hit</code>), mã thoát, lúc nào.</li>
<li><code>journalctl -u X -b -n 100</code> (hoặc <code>--since</code> mốc giờ) — lời cuối của chương trình trước khi chết.</li>
<li><code>journalctl -b -p warning --since "&lt;5 phút trước đó&gt;"</code> — cùng lúc còn gì khác không ổn (đĩa, mạng, dịch vụ khác).</li>
<li><code>journalctl -k -b --since …</code> — nhân: OOM, segfault, lỗi I/O (bài 7.5).</li>
<li><code>journalctl --list-boots</code> và <code>-b -1 -n 30</code> — chính cái máy có khởi động lại không?</li>
<li>Ghi lại: giờ, unit, kết quả, một dòng chứng minh nguyên nhân, cách sửa.</li>
</ol>

<h3>Tình huống đời thật</h3>
<ul>
<li><strong>Deploy lúc OJT:</strong> deploy xong, dịch vụ cứ "activating (auto-restart)" lặp vòng. <code>journalctl -u app -f</code> ở một cửa sổ, <code>systemctl restart app</code> ở cửa sổ khác: bạn thấy exception ngay khi nó xảy ra. Nguyên nhân hay gặp: thiếu biến môi trường hoặc tệp cấu hình, sai đường dẫn, cổng đã bị chiếm, quyền trên một tệp.</li>
<li><strong>"Chạy tay thì được":</strong> chạy tay thì bạn là người dùng của bạn, trong thư mục nhà, với môi trường của bạn; dịch vụ chạy bằng người dùng khác, <code>WorkingDirectory=/</code>, không có <code>.bashrc</code>. Lỗi trong <code>journalctl -u</code> thường là đường dẫn tương đối hoặc thiếu biến.</li>
<li><strong>Khách nói "khoảng 3 giờ sáng bị lỗi"</strong> → <code>journalctl --since "03:00" --until "03:30" -p warning</code> trên từng máy chủ, rồi thu hẹp theo unit.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Tạo một unit hỏng giống <code>shop-worker</code>. Dùng <code>systemctl status</code> và <code>journalctl -u</code> tìm dòng nguyên nhân, rồi sửa và chạy <code>systemctl reset-failed</code>.</li>
<li>Tìm mọi dòng do root viết (<code>_UID=0</code>) trong 10 phút qua mà không phải của chính systemd.</li>
<li>Hiện dòng của <code>ssh.service</code> hoặc của nhãn <code>sudo</code>, trong một lệnh.</li>
<li>Khởi động lại máy ảo. Chứng minh từ journal xem lần trước kết thúc có sạch không. ⚠️ Dùng máy ảo thật, không dùng container: container dùng chung boot ID của nhân máy chủ, và podman gắn tmpfs vào <code>/var/log/journal</code> — "khởi động lại" xong <code>--list-boots</code> vẫn chỉ có một lần, lần trước biến mất (đã thử 24/11/2026, Ubuntu 24.04 + systemd 255 trong podman).</li>
<li>Đếm, theo từng giờ hôm nay, có bao nhiêu dòng khớp <code>timeout</code> (gợi ý: <code>-o short-iso</code> và <code>cut</code>).</li>
</ol>
<p><strong>Đạt khi:</strong> câu 1 chỉ đúng dòng và kết quả <code>start-limit-hit</code> hoặc <code>exit-code</code>; câu 2 dùng <code>_UID=0</code> với <code>--since</code> và loại <code>_PID=1</code> bằng cách đọc hoặc bằng bộ lọc thứ hai; câu 3 là <code>journalctl _SYSTEMD_UNIT=ssh.service + SYSLOG_IDENTIFIER=sudo</code> — để ý <code>-u ssh -t sudo</code> ghép hai điều kiện bằng VÀ nên trả "-- No entries --" trên systemd 255; câu 4 trích các dòng cuối của <code>-b -1</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['-b [N]', 'Bản ghi của một lần khởi động: 0 hiện tại, -1 lần trước; --list-boots liệt kê.'],
  ['-u UNIT', 'Dòng của một unit và dòng nói về nó (khớp _SYSTEMD_UNIT, UNIT, coredump…).'],
  ['-p MỨC', 'Lọc theo mức: "err" = 0–3; a..b = dải; stdout của app không có tiền tố luôn là info.'],
  ['TRƯỜNG=giá-trị', 'Khớp chính xác; khác trường VÀ, cùng trường HOẶC, "+" HOẶC cả nhóm.'],
  ['-g MẪU', 'Regex trên MESSAGE (PCRE2), tự phân biệt hoa thường theo mẫu.'],
  ['-t ID', 'Khớp SYSLOG_IDENTIFIER (nhãn do chương trình tự đặt).'],
  ['start-limit-hit', 'systemd thôi khởi động lại một unit hỏng quá nhiều lần (mặc định 5 lần trong 10 giây).'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>"Sao nó khởi động lại?" bắt đầu bằng <code>--list-boots</code> và các dòng cuối của <code>-b -1</code>: tắt sạch hay chết đột ngột.</li>
<li><code>systemctl status</code> cho biết <em>là</em> nó hỏng; <code>journalctl -u X -b</code> cho biết <em>vì sao</em>.</li>
<li><code>-p err</code> bỏ sót lỗi ứng dụng in ra không có tiền tố mức — traceback là "info".</li>
<li><code>-u</code> rộng hơn <code>_SYSTEMD_UNIT=</code>; khác trường VÀ, cùng trường HOẶC, <code>+</code> HOẶC cả nhóm.</li>
<li><code>-g</code> là regex, tự phân biệt hoa thường; <code>-f</code> khi tái hiện; <code>--no-pager</code> khi dán đi.</li>
</ul>
${nguon('📘', 'journalctl(1)', 'Mọi tuỳ chọn, luật ghép bộ lọc và định dạng thời gian', 'https://man7.org/linux/man-pages/man1/journalctl.1.html')}
${nguon('📘', 'systemd.unit(5) — StartLimitIntervalSec=', 'Vì sao một unit thôi được khởi động lại', 'https://man7.org/linux/man-pages/man5/systemd.unit.5.html')}
${lienKet({ khoa: 'deploy-vps', bai: 'deploy-9-3-log', title: 'Deploy VPS 9.3 — Đọc log ứng dụng trên VPS', sub: 'Cùng cái bẫy -p với log JSON, jq fromjson?' })}
${lienKet({ khoa: 'linux-bash', bai: 'lnx-10-3-log-journalctl', title: 'Linux & Bash 10.3 — Log và journalctl', sub: 'Bản nhập môn của các bộ lọc này' })}
</div>
`,
};
