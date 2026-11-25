/**
 * 7.1 — journald lưu log thế nào (soạn 24/11/2026, agent lgz).
 * Output thật: máy ảo lab7 (Ubuntu 24.04 cloud minimal, systemd 255, nhân 6.8, KVM) — OUT['s07/luu'], OUT['s07/volatile-a'],
 * OUT['s07/volatile-b'], OUT['s07/mat-dien']. Lần khởi động -3 bị "rút điện" thật (dừng tiến trình qemu) lúc 04:10:21, khi đó
 * `journalctl -u shop-api | wc -l` = 70 dòng; sau khi bật lại chỉ còn 40 (đo bằng lệnh, ghi trong báo cáo phiên).
 * Nguồn: man journald.conf(5) (Storage=, SyncIntervalSec=), systemd.journal-fields(7) (trường tin cậy có dấu _), systemd.io JOURNAL_FILE_FORMAT,
 * Qualys "System Down" (01/2019, CVE-2018-16864/16865/16866).
 */
import { lenh, ma, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '7.1 — How journald stores logs: binary journal, /run vs /var/log/journal, persistence, fields|||7.1 — journald lưu log thế nào: journal nhị phân, /run vs /var/log/journal, lưu bền, các trường',
  slug: 'log-7-1-journald-luu',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Trên một máy ảo Ubuntu 24.04 thật: ai được đọc journal (nhóm systemd-journal/adm), journal nằm ở đâu (/run/log/journal hay /var/log/journal, thư mục machine-id), vì sao tệp là nhị phân và grep không dùng được, Storage=auto/persistent/volatile/none và thí nghiệm mất log sau khi khởi động lại, rút điện làm mất 30 giây log cuối (SyncIntervalSec), mỗi bản ghi là một tập trường: trường tin cậy có dấu _ do journald tự gắn, trường do app gửi, trường địa chỉ __; bốn đường để log vào journal; góc hacker: giả dòng "sshd Accepted password" và cách vạch mặt bằng _UID/_COMM; lỗ hổng System Down 2019 của chính journald.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>journald: where Linux keeps its logs today, and what one record really contains</h2>
<p class="lead">On almost every Linux server you will touch at work — Ubuntu, Debian, Fedora, RHEL, Rocky, Arch — the first place logs land is <strong>systemd-journald</strong>. It arrived with systemd at the end of 2011 and replaced "every program writes its own text file" with one indexed database of records. This chapter reads it in depth; this lesson answers three questions you must settle before typing any filter: <em>who may read it, where is it stored, and what exactly is one record</em>.</p>

<h3>The lab for this chapter</h3>
<p>Every output in Chapter 7 comes from a real virtual machine called <code>lab7</code>: Ubuntu 24.04 (cloud minimal image), systemd 255, kernel 6.8, 1 GB RAM, no swap. On it runs a small shop API written in Python, managed by systemd, plus a broken worker, a traffic generator and a nightly report timer. Build the same machine with Multipass (<code>multipass launch 24.04 --name lab7 --memory 1G</code>), VirtualBox/Hyper-V or UTM, copy the files below into the home directory and run <code>sudo bash cai.sh</code>. WSL2 works for most lessons if systemd is enabled, but its kernel and reboots behave differently — a VM is better for 7.5–7.6.</p>
<details><summary>The app: <code>/opt/shop/api.py</code></summary>
${ma('python', 's07/vm/api.py')}
</details>
<details><summary>The unit: <code>shop-api.service</code> (+ the installer <code>cai.sh</code>)</summary>
${ma('ini', 's07/vm/shop-api.service')}
${ma('bash', 's07/vm/cai.sh')}
</details>
<p>Before the readings below, the VM lived through three boots on purpose: one ended by pulling the plug, one by an experiment with volatile storage, one by a clean reboot. Lesson 7.2 uses that history.</p>

<h3>The everyday picture: a library card catalogue, not a diary</h3>
<p>A text log file is a diary: lines in order, to find something you read page by page. The journal is a library with a card catalogue: every record is filed with labels — which program, which process, which user, which service, which boot, how serious — and the librarian (<code>journalctl</code>) can pull "all cards of service X, errors only, since yesterday" instantly. You give up "open it with any text editor" and gain fast, exact questions.</p>

<h3>Step 1 — who may read the journal</h3>
${lenh('s07/luu', 0)}
<p>As a normal user you only see your own messages: 20.9 MB of what you are allowed to read. journalctl even tells you the fix — members of <code>adm</code> or <code>systemd-journal</code> see everything. On Ubuntu the first user created by the installer is usually already in <code>adm</code>; a user created by cloud-init or <code>useradd</code> is not.</p>
${lenh('s07/luu', 7)}
${lenh('s07/luu', 8)}
${lenh('s07/luu', 9)}
<p>Same command, now 48.4 MB. Group changes apply to <em>new</em> logins (log out and in, or open a new SSH session). Remember this at work: if <code>journalctl -u myapp</code> shows "-- No entries --" but the app is clearly running, check <code>id</code> before you conclude anything. Using <code>sudo</code> every time also works; on servers you share, ask for the group instead.</p>

<h3>Step 2 — where the files are</h3>
${lenh('s07/luu', 1)}
${lenh('s07/luu', 2)}
${lenh('s07/luu', 3)}
<ul>
<li><strong><code>/var/log/journal/&lt;machine-id&gt;/</code></strong> — persistent journal on disk. The folder name is the machine id (<code>/etc/machine-id</code>), so journals copied from many machines into one place never collide.</li>
<li><strong><code>/run/log/journal/&lt;machine-id&gt;/</code></strong> — volatile journal in RAM (<code>/run</code> is a tmpfs). Used during early boot, and always if persistence is off. Gone at every reboot.</li>
<li><strong><code>system.journal</code></strong> = the file being written now for system services; <strong><code>user-1000.journal</code></strong> = messages of user id 1000 (that is why a normal user sees "their" 20.9 MB).</li>
<li><strong><code>system@…journal</code></strong> = archived (rotated) files. journald rotates when a file reaches its size limit, when it restarts, and at each boot. The name carries the sequence id, first sequence number and first timestamp.</li>
<li><strong><code>…journal~</code></strong> with a tilde = a file that was not closed cleanly (crash, power cut). journald renamed it and started a new one. Still readable; step 4 shows when it happens.</li>
<li>Every file shows 8 388 608 bytes: journald grows files in 8 MiB steps; actual use is what <code>--disk-usage</code> reports.</li>
</ul>
${lenh('s07/luu', 4)}
${lenh('s07/luu', 5)}
<p>The first 8 bytes are the magic signature <code>LPKSHHRH</code>: this is a binary database, not text. <code>grep</code> finds "shop-api" only 3 times in a file holding hundreds of shop-api records, because journald stores each distinct field value <em>once</em> and points to it (and compresses large values). Never grep the journal files — use <code>journalctl</code>, which also reads every file (archived, current, /run and /var) and merges them by time.</p>

<h3>Step 3 — Storage=: why some machines "forget" everything after a reboot</h3>
${lenh('s07/luu', 6)}
<p>Nothing is set except Ubuntu's <code>ForwardToSyslog=yes</code>, so every option has its default. The important one is <strong><code>Storage=</code></strong>:</p>
<table>
<thead><tr><th>Value</th><th>Where records go</th><th>After reboot</th></tr></thead>
<tbody>
<tr><td><code>auto</code> (default in systemd 255)</td><td><code>/var/log/journal</code> <em>if that folder exists</em>, otherwise <code>/run/log/journal</code></td><td>Kept only if the folder exists</td></tr>
<tr><td><code>persistent</code></td><td><code>/var/log/journal</code> (created if missing); <code>/run</code> only during early boot</td><td>Kept</td></tr>
<tr><td><code>volatile</code></td><td><code>/run/log/journal</code> only</td><td>Lost</td></tr>
<tr><td><code>none</code></td><td>Nowhere (only forwarded to syslog/console if configured)</td><td>Nothing to lose</td></tr>
</tbody></table>
<p>So with <code>auto</code>, whether you have history depends on a folder. Ubuntu, Debian 12+ and Fedora ship it; some minimal images, older Debian and many containers do not. Let us prove what "volatile" means:</p>
${lenh('s07/volatile-a', 1)}
${lenh('s07/volatile-a', 2)}
${lenh('s07/volatile-a', 4)}
${lenh('s07/volatile-a', 5)}
${lenh('s07/volatile-a', 6)}
<p>The line is there. Now <code>sudo systemctl reboot</code>, log in again:</p>
${lenh('s07/volatile-b', 0)}
${lenh('s07/volatile-b', 1)}
<p>The line is gone, and so is everything the previous boot wrote after journald switched to RAM — including the whole shutdown sequence. Boot <code>-1</code> ends at 04:10:57 with <code>Journal stopped</code> (lesson 7.2 shows those last lines). Then we undo the experiment and move what is in RAM onto disk:</p>
${lenh('s07/volatile-b', 2)}
${lenh('s07/volatile-b', 3)}
${lenh('s07/volatile-b', 4)}
<p><code>--flush</code> asks journald to copy <code>/run</code> into <code>/var</code> now. At every normal boot the service <code>systemd-journal-flush.service</code> does exactly this once <code>/var</code> is mounted — that is how early-boot messages end up on disk.</p>
<div class="pitfall co-tieu-de"><p><strong>"I'll check the logs after the reboot."</strong> On a machine with volatile storage, the reboot <em>is</em> the deletion. Before rebooting a misbehaving server, run <code>journalctl --list-boots</code>: if it shows only boot 0, save what you need first (<code>journalctl -b -o export &gt; before-reboot.export</code>, or copy <code>/run/log/journal</code>), then fix persistence with <code>sudo mkdir -p /var/log/journal</code> or <code>Storage=persistent</code>.</p></div>

<h3>Step 4 — pulling the plug: the last seconds are in RAM</h3>
<p>The very first boot of lab7 was ended by killing the VM at 04:10:21 — the same as yanking the power cable. A moment before, the shop API had written 70 lines. After power came back:</p>
${lenh('s07/mat-dien', 0)}
${lenh('s07/mat-dien', 1)}
${lenh('s07/mat-dien', 2)}
<p>Only 40 of 70 lines survived; the boot ends at 04:09:53 with an ordinary request — no shutdown messages at all (a clean shutdown always ends with services stopping and <code>Journal stopped</code>). Why? journald writes records into the file through memory and forces them to disk (<code>fsync</code>) every <strong><code>SyncIntervalSec=</code></strong>, 5 minutes by default, and <em>immediately</em> only for messages of priority crit, alert or emerg. Then at the next boot it found the file not closed and renamed it to <code>.journal~</code>.</p>
<p>How to read this at work: a boot whose last lines are ordinary traffic, followed by "corrupted or uncleanly shut down", means <strong>the machine died, it did not shut down</strong>: power loss, a hypervisor kill, a kernel panic, a hard reset by the cloud provider. And the last few minutes before death may be missing from the journal — which is exactly when the interesting thing happened. That is one reason teams also ship logs off the machine as they are written (Chapter 15).</p>

<h3>Step 5 — one record = a set of fields</h3>
${lenh('s07/luu', 10)}
<p>The normal output (<code>Nov 24 04:14:00 lab7 shop-api[424]: GET /api/orders/1033 200</code>) is just a view; this is the record. Three kinds of fields:</p>
<table>
<thead><tr><th>Kind</th><th>Examples</th><th>Who sets it — can it lie?</th></tr></thead>
<tbody>
<tr><td><strong>Trusted fields</strong>, start with <code>_</code></td><td><code>_PID</code>, <code>_UID</code>, <code>_GID</code>, <code>_COMM</code>, <code>_EXE</code>, <code>_CMDLINE</code>, <code>_SYSTEMD_UNIT</code>, <code>_SYSTEMD_CGROUP</code>, <code>_BOOT_ID</code>, <code>_MACHINE_ID</code>, <code>_HOSTNAME</code>, <code>_TRANSPORT</code>, <code>_SYSTEMD_INVOCATION_ID</code></td><td>journald itself, from the kernel's view of the sending process. A program cannot set them.</td></tr>
<tr><td><strong>User fields</strong>, no underscore</td><td><code>MESSAGE</code>, <code>PRIORITY</code> (0–7, lesson 1.3), <code>SYSLOG_IDENTIFIER</code>, <code>SYSLOG_FACILITY</code>, <code>CODE_FILE</code>, any custom field</td><td>The program. It can write anything.</td></tr>
<tr><td><strong>Address fields</strong>, start with <code>__</code></td><td><code>__CURSOR</code>, <code>__REALTIME_TIMESTAMP</code> (µs since epoch), <code>__MONOTONIC_TIMESTAMP</code> (µs since boot), <code>__SEQNUM</code></td><td>journald, when storing. Used to point at one exact record.</td></tr>
</tbody></table>
<p>Read the record above with that table: process 424, user 999 (the <code>shop</code> system user), running <code>/usr/bin/python3 /opt/shop/api.py</code> in <code>shop-api.service</code>, arrived through the service's <code>stdout</code>, priority 6 = info. <code>_SYSTEMD_INVOCATION_ID</code> changes every time the service is (re)started — handy to tell "before the crash" from "after the restart". The full list is <code>man systemd.journal-fields</code>.</p>

<h3>Step 6 — four ways a message gets into the journal</h3>
<ol>
<li><strong>stdout/stderr of a systemd service</strong> (<code>_TRANSPORT=stdout</code>). The easiest: just print. A line may start with <code>&lt;3&gt;</code>, <code>&lt;4&gt;</code>, <code>&lt;6&gt;</code>… and journald turns it into <code>PRIORITY</code> — look at the <code>log()</code> function in <code>api.py</code>. Without the prefix every line is priority 6 (info), even "ERROR" — the trap of lesson 7.2.</li>
<li><strong>The syslog socket <code>/dev/log</code></strong> (<code>_TRANSPORT=syslog</code>): classic programs, <code>logger</code>, sshd, sudo.</li>
<li><strong>The native protocol</strong> (<code>_TRANSPORT=journal</code>): <code>sd_journal_send()</code> from C, libraries for Python/Go/Java, <code>logger --journald</code>. Only this way can a program attach its own fields.</li>
<li><strong>The kernel</strong> (<code>_TRANSPORT=kernel</code>, lesson 7.5) and audit (<code>_TRANSPORT=audit</code>, lesson 8.4).</li>
</ol>
${lenh('s07/luu', 14)}
${lenh('s07/luu', 15)}
<p>We sent our own fields <code>ORDER_ID</code> and <code>AMOUNT_VND</code> — and also tried to claim <code>_PID=1</code> and <code>_UID=0</code>. journald silently dropped those two: the record shows the real PID 2203 and UID 1000. Custom fields are now searchable exactly: <code>journalctl ORDER_ID=1042</code>. The quick tool for shell scripts is <code>systemd-cat</code>:</p>
${lenh('s07/luu', 16)}
${lenh('s07/luu', 17)}

<h3>Hacker's corner: anyone can write "sshd", nobody can fake _UID</h3>
${lenh('s07/luu', 11)}
${lenh('s07/luu', 12)}
<p>A normal user just wrote a perfect-looking "root logged in from 203.0.113.9" line under the name <code>sshd</code>. The default view cannot tell it from a real one. An attacker can use this to plant false leads, or to flood an alert rule. Look at the record:</p>
${lenh('s07/luu', 13)}
<p><code>_UID=1000</code>, <code>_COMM=logger</code>, <code>_EXE=/usr/bin/logger</code>: the real sshd runs as root from <code>/usr/sbin/sshd</code> inside <code>ssh.service</code>. When a security line matters, filter on trusted fields, not on the name: <code>journalctl _SYSTEMD_UNIT=ssh.service</code> or <code>_EXE=/usr/sbin/sshd</code>. (Note: <code>_COMM</code>/<code>_EXE</code> are read from <code>/proc</code> of the sender; for a process that exits instantly they are sometimes missing — <code>_UID</code> and <code>_PID</code> come from the socket and are always there.)</p>
<p>The log daemon itself is attack surface too. In January 2019 Qualys published <strong>"System Down"</strong>: CVE-2018-16864 and CVE-2018-16865 were memory corruptions in systemd-journald triggered by huge log messages or command lines, and CVE-2018-16866 an information leak. Combining the last two, Qualys obtained a local root shell (on average 10 minutes on i386, 70 on amd64); distributions built with GCC's <code>-fstack-clash-protection</code> (SUSE 15, Fedora 28–29) were not exploitable. A program that parses input from every process on the machine and runs as root must be patched like any network service.</p>

<h3>Real-life situations</h3>
<ul>
<li><strong>OJT, the VPS rebooted overnight:</strong> your lead asks "why did it restart?". Run <code>journalctl --list-boots</code> first. Only one boot? Storage is volatile, the evidence is gone — say so, then make it persistent so next time there is an answer. Several boots, and the previous one ends with normal traffic plus "uncleanly shut down" at the next start? It was killed, not rebooted: check the provider's console/maintenance mail.</li>
<li><strong>Docker:</strong> most containers have no journald at all; their stdout goes to the Docker logging driver (lesson 13.1). The host's journal only has the docker daemon's own messages — unless the driver is set to <code>journald</code>, then each container line is a record with <code>CONTAINER_NAME</code>.</li>
<li><strong>What if</strong> a teammate sends you "the journal" from a dead server as a zip of <code>/var/log/journal</code>? Unzip and read it with <code>journalctl -D &lt;folder&gt;</code> — lesson 7.3.</li>
</ul>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok"><ol>
<li>On your VM: <code>ls /var/log/journal</code>. Does it exist? What is <code>Storage=</code> (<code>systemd-analyze cat-config systemd/journald.conf</code>)? So: will this machine keep logs after a reboot?</li>
<li>As your normal user run <code>journalctl --disk-usage</code> and <code>id</code>. Then explain the number you see.</li>
<li>Print one record of the SSH service with <code>-o verbose</code> and name three trusted fields and two user fields.</li>
<li>Repeat the fake-sshd trick, then write ONE journalctl command that shows real sshd lines but not your fake one.</li>
<li>Send a record with a custom field <code>TICKET=OJT-17</code> using <code>logger --journald</code> and find it by that field.</li>
</ol>
<p><strong>Done when:</strong> 1 answers yes/no with the reason (folder + Storage value); 2 says "only my user journal" or "everything" and why; 4 uses a trusted field such as <code>_SYSTEMD_UNIT=ssh.service</code> or <code>_UID=0</code>; 5 returns exactly your record.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['systemd-journald', 'The log service of systemd: receives messages from services, syslog, kernel, native API; stores indexed records.'],
  ['/run/log/journal', 'Volatile journal in RAM; lost at reboot.'],
  ['/var/log/journal', 'Persistent journal on disk; one subfolder per machine id.'],
  ['Storage=', 'auto (persistent only if /var/log/journal exists), persistent, volatile, none.'],
  ['SyncIntervalSec=', 'How often records are forced to disk (5 min); crit and above are synced at once.'],
  ['trusted field', 'Field starting with _ set by journald from kernel facts (_PID, _UID, _SYSTEMD_UNIT…); cannot be forged.'],
  ['_TRANSPORT', 'How the record arrived: stdout, syslog, journal, kernel, audit, driver.'],
  ['.journal~', 'A journal file that was not closed cleanly (crash or power loss).'],
])}

<h3>📌 Summary</h3>
<ul>
<li>"No entries" as a normal user usually means "not in systemd-journal/adm", not "no logs".</li>
<li>Journal = binary indexed records in <code>/var/log/journal</code> (disk) or <code>/run/log/journal</code> (RAM); read it with journalctl, never grep the files.</li>
<li><code>Storage=auto</code> keeps history only if <code>/var/log/journal</code> exists; volatile storage makes every reboot erase the evidence.</li>
<li>A power cut loses up to ~5 minutes of non-critical records and leaves a <code>.journal~</code> file.</li>
<li>Fields with <code>_</code> are facts from the kernel; fields without are claims of the program. Investigate with the facts.</li>
</ul>
${nguon('📘', 'journald.conf(5)', 'Storage=, SyncIntervalSec=, size and rate limits', 'https://man7.org/linux/man-pages/man5/journald.conf.5.html')}
${nguon('📘', 'systemd.journal-fields(7)', 'Every trusted, user and address field', 'https://man7.org/linux/man-pages/man7/systemd.journal-fields.7.html')}
${nguon('📘', 'Journal File Format', 'Why the file is binary, objects and deduplication', 'https://systemd.io/JOURNAL_FILE_FORMAT/')}
${nguon('🛡', 'Qualys — System Down (01/2019)', 'CVE-2018-16864/16865/16866 in systemd-journald', 'https://www.qualys.com/2019/01/09/system-down/system-down.txt')}
${lienKet({ khoa: 'linux-bash', bai: 'lnx-10-3-log-journalctl', title: 'Linux & Bash 10.3 — Logs and journalctl', sub: 'The beginner version, if journalctl is new to you', cta: 'Open lesson' })}
${lienKet({ khoa: 'operating-systems-for-developers', bai: 'os-2-6-nhat-ky', title: 'OS for Developers 2.6 — The system diary', sub: 'journalctl and dmesg as an OS observation tool', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>journald: Linux ngày nay cất log ở đâu, và một bản ghi thật sự chứa gì</h2>
<p class="lead">Gần như mọi máy chủ Linux bạn sẽ đụng khi đi làm — Ubuntu, Debian, Fedora, RHEL, Rocky, Arch — log đi vào <strong>systemd-journald</strong> đầu tiên. Nó ra đời cùng systemd cuối năm 2011 và thay kiểu "mỗi chương trình tự ghi một tệp chữ" bằng một cơ sở dữ liệu bản ghi có chỉ mục. Chương này đọc journald thật sâu; bài này trả lời ba câu phải rõ trước khi gõ bất kỳ bộ lọc nào: <em>ai được đọc, lưu ở đâu, và một bản ghi chính xác là gì</em>.</p>

<h3>Lab của chương</h3>
<p>Mọi output trong Chương 7 lấy từ một máy ảo thật tên <code>lab7</code>: Ubuntu 24.04 (ảnh cloud minimal), systemd 255, nhân 6.8, RAM 1 GB, không swap. Trên đó chạy một API bán hàng nhỏ viết bằng Python do systemd quản lý, kèm một worker hỏng, một bộ tạo lưu lượng và một timer báo cáo đêm. Dựng máy giống hệt bằng Multipass (<code>multipass launch 24.04 --name lab7 --memory 1G</code>), VirtualBox/Hyper-V hoặc UTM, chép các tệp dưới đây vào thư mục nhà rồi chạy <code>sudo bash cai.sh</code>. WSL2 dùng được cho phần lớn bài nếu bật systemd, nhưng nhân và việc khởi động lại của nó khác — với 7.5–7.6 nên dùng máy ảo.</p>
<details><summary>App: <code>/opt/shop/api.py</code></summary>
${ma('python', 's07/vm/api.py')}
</details>
<details><summary>Unit: <code>shop-api.service</code> (+ trình cài <code>cai.sh</code>)</summary>
${ma('ini', 's07/vm/shop-api.service')}
${ma('bash', 's07/vm/cai.sh')}
</details>
<p>Trước khi đọc các phần dưới, máy ảo đã cố ý trải qua ba lần khởi động: một lần kết thúc bằng rút điện, một lần bằng thí nghiệm lưu trong RAM, một lần khởi động lại sạch. Bài 7.2 dùng lịch sử đó.</p>

<h3>Liên tưởng đời thường: tủ phiếu thư viện, không phải cuốn nhật ký</h3>
<p>Tệp log chữ là cuốn nhật ký: các dòng nối nhau, muốn tìm gì phải lật từng trang. Journal là thư viện có tủ phiếu: mỗi bản ghi được xếp kèm nhãn — chương trình nào, tiến trình nào, người dùng nào, dịch vụ nào, lần khởi động nào, nghiêm trọng mức nào — và thủ thư (<code>journalctl</code>) rút ngay được "mọi phiếu của dịch vụ X, chỉ lỗi, từ hôm qua". Bạn mất cái "mở bằng trình soạn thảo nào cũng được", đổi lại hỏi được nhanh và chính xác.</p>

<h3>Bước 1 — ai được đọc journal</h3>
${lenh('s07/luu', 0)}
<p>Là người dùng thường, bạn chỉ thấy thông điệp của chính mình: 20,9 MB phần bạn được phép đọc. journalctl còn chỉ luôn cách sửa — thành viên nhóm <code>adm</code> hoặc <code>systemd-journal</code> thấy tất cả. Trên Ubuntu, người dùng đầu tiên do bộ cài tạo thường đã ở trong <code>adm</code>; người dùng tạo bằng cloud-init hay <code>useradd</code> thì không.</p>
${lenh('s07/luu', 7)}
${lenh('s07/luu', 8)}
${lenh('s07/luu', 9)}
<p>Cùng lệnh, giờ là 48,4 MB. Đổi nhóm chỉ có hiệu lực với phiên đăng nhập <em>mới</em> (đăng xuất rồi vào lại, hoặc mở phiên SSH mới). Nhớ điều này khi đi làm: nếu <code>journalctl -u myapp</code> báo "-- No entries --" trong khi app rõ ràng đang chạy, hãy gõ <code>id</code> trước khi kết luận gì. Lần nào cũng dùng <code>sudo</code> cũng được; trên máy chủ dùng chung, hãy xin vào nhóm thay vì vậy.</p>

<h3>Bước 2 — tệp nằm ở đâu</h3>
${lenh('s07/luu', 1)}
${lenh('s07/luu', 2)}
${lenh('s07/luu', 3)}
<ul>
<li><strong><code>/var/log/journal/&lt;machine-id&gt;/</code></strong> — journal bền trên đĩa. Tên thư mục là machine id (<code>/etc/machine-id</code>), nên journal chép từ nhiều máy về một chỗ không bao giờ đè nhau.</li>
<li><strong><code>/run/log/journal/&lt;machine-id&gt;/</code></strong> — journal tạm trong RAM (<code>/run</code> là tmpfs). Dùng lúc mới khởi động, và luôn luôn nếu tắt lưu bền. Mất sau mỗi lần khởi động lại.</li>
<li><strong><code>system.journal</code></strong> = tệp đang ghi cho dịch vụ hệ thống; <strong><code>user-1000.journal</code></strong> = thông điệp của người dùng id 1000 (vì thế người dùng thường thấy "phần của mình" 20,9 MB).</li>
<li><strong><code>system@…journal</code></strong> = tệp đã lưu trữ (đã xoay). journald xoay tệp khi chạm giới hạn cỡ, khi khởi động lại journald và ở mỗi lần khởi động máy. Tên tệp mang seqnum id, số thứ tự đầu tiên và mốc giờ đầu tiên.</li>
<li><strong><code>…journal~</code></strong> có dấu ngã ở cuối = tệp không được đóng sạch (sập, mất điện). journald đổi tên nó và mở tệp mới. Vẫn đọc được; bước 4 cho thấy khi nào chuyện này xảy ra.</li>
<li>Tệp nào cũng hiện 8 388 608 byte: journald nới tệp theo từng nấc 8 MiB; dung lượng thật là con số <code>--disk-usage</code> báo.</li>
</ul>
${lenh('s07/luu', 4)}
${lenh('s07/luu', 5)}
<p>8 byte đầu là chữ ký <code>LPKSHHRH</code>: đây là cơ sở dữ liệu nhị phân, không phải chữ. <code>grep</code> chỉ thấy "shop-api" 3 lần trong một tệp chứa hàng trăm bản ghi của shop-api, vì journald lưu mỗi giá trị trường khác nhau <em>một lần</em> rồi trỏ tới nó (và nén giá trị lớn). Đừng bao giờ grep tệp journal — dùng <code>journalctl</code>, nó còn đọc mọi tệp (đã lưu trữ, đang ghi, /run lẫn /var) và trộn theo thời gian.</p>

<h3>Bước 3 — Storage=: vì sao có máy "quên" sạch sau khi khởi động lại</h3>
${lenh('s07/luu', 6)}
<p>Không đặt gì ngoài <code>ForwardToSyslog=yes</code> của Ubuntu, nên mọi tuỳ chọn ở giá trị mặc định. Tuỳ chọn quan trọng là <strong><code>Storage=</code></strong>:</p>
<table>
<thead><tr><th>Giá trị</th><th>Bản ghi đi đâu</th><th>Sau khi khởi động lại</th></tr></thead>
<tbody>
<tr><td><code>auto</code> (mặc định ở systemd 255)</td><td><code>/var/log/journal</code> <em>nếu thư mục đó tồn tại</em>, không thì <code>/run/log/journal</code></td><td>Còn, chỉ khi có thư mục</td></tr>
<tr><td><code>persistent</code></td><td><code>/var/log/journal</code> (tự tạo nếu thiếu); <code>/run</code> chỉ lúc mới khởi động</td><td>Còn</td></tr>
<tr><td><code>volatile</code></td><td>Chỉ <code>/run/log/journal</code></td><td>Mất</td></tr>
<tr><td><code>none</code></td><td>Không đâu cả (chỉ chuyển sang syslog/console nếu có cấu hình)</td><td>Không có gì để mất</td></tr>
</tbody></table>
<p>Vậy với <code>auto</code>, có lịch sử hay không phụ thuộc một thư mục. Ubuntu, Debian 12 trở lên và Fedora có sẵn; một số ảnh tối giản, Debian cũ và đa số container thì không. Hãy chứng minh "volatile" nghĩa là gì:</p>
${lenh('s07/volatile-a', 1)}
${lenh('s07/volatile-a', 2)}
${lenh('s07/volatile-a', 4)}
${lenh('s07/volatile-a', 5)}
${lenh('s07/volatile-a', 6)}
<p>Dòng đã có. Giờ <code>sudo systemctl reboot</code>, đăng nhập lại:</p>
${lenh('s07/volatile-b', 0)}
${lenh('s07/volatile-b', 1)}
<p>Dòng đã mất, và mất cả mọi thứ lần khởi động trước ghi sau khi journald chuyển sang RAM — gồm toàn bộ quá trình tắt máy. Lần <code>-1</code> kết thúc lúc 04:10:57 bằng <code>Journal stopped</code> (bài 7.2 xem mấy dòng cuối đó). Rồi ta bỏ thí nghiệm và đưa phần trong RAM xuống đĩa:</p>
${lenh('s07/volatile-b', 2)}
${lenh('s07/volatile-b', 3)}
${lenh('s07/volatile-b', 4)}
<p><code>--flush</code> bảo journald chép <code>/run</code> sang <code>/var</code> ngay. Ở mỗi lần khởi động bình thường, dịch vụ <code>systemd-journal-flush.service</code> làm đúng việc này khi <code>/var</code> đã gắn — nhờ vậy thông điệp lúc mới khởi động cũng nằm trên đĩa.</p>
<div class="pitfall co-tieu-de"><p><strong>"Khởi động lại xong mình xem log sau."</strong> Trên máy lưu volatile, chính lần khởi động lại <em>là</em> lần xoá. Trước khi khởi động lại một máy chủ đang trục trặc, chạy <code>journalctl --list-boots</code>: nếu chỉ có lần 0, hãy lưu thứ cần trước (<code>journalctl -b -o export &gt; truoc-khi-reboot.export</code>, hoặc chép <code>/run/log/journal</code>), rồi sửa lưu bền bằng <code>sudo mkdir -p /var/log/journal</code> hoặc <code>Storage=persistent</code>.</p></div>

<h3>Bước 4 — rút điện: mấy giây cuối nằm trong RAM</h3>
<p>Lần khởi động đầu tiên của lab7 kết thúc bằng việc giết máy ảo lúc 04:10:21 — y như giật dây điện. Ngay trước đó, API đã ghi 70 dòng. Sau khi có điện lại:</p>
${lenh('s07/mat-dien', 0)}
${lenh('s07/mat-dien', 1)}
${lenh('s07/mat-dien', 2)}
<p>Chỉ còn 40 trên 70 dòng; lần khởi động kết thúc lúc 04:09:53 bằng một request bình thường — không có thông điệp tắt máy nào (tắt máy sạch luôn kết thúc bằng các dịch vụ dừng và <code>Journal stopped</code>). Vì sao? journald ghi bản ghi vào tệp qua bộ nhớ và ép xuống đĩa (<code>fsync</code>) mỗi <strong><code>SyncIntervalSec=</code></strong>, mặc định 5 phút; chỉ thông điệp mức crit, alert, emerg mới được ép <em>ngay</em>. Lần khởi động sau, nó thấy tệp chưa được đóng nên đổi tên thành <code>.journal~</code>.</p>
<p>Cách đọc khi đi làm: một lần khởi động mà các dòng cuối là lưu lượng bình thường, tiếp theo là "corrupted or uncleanly shut down" ở lần sau, nghĩa là <strong>máy đã chết, không phải tắt</strong>: mất điện, hypervisor giết, kernel panic, nhà cung cấp cloud reset cứng. Và vài phút cuối trước khi chết có thể không có trong journal — đúng lúc chuyện đáng xem xảy ra. Đó là một lý do các đội gửi log ra khỏi máy ngay khi ghi (Chương 15).</p>

<h3>Bước 5 — một bản ghi = một tập trường</h3>
${lenh('s07/luu', 10)}
<p>Output thường (<code>Nov 24 04:14:00 lab7 shop-api[424]: GET /api/orders/1033 200</code>) chỉ là một cách hiển thị; đây mới là bản ghi. Có ba loại trường:</p>
<table>
<thead><tr><th>Loại</th><th>Ví dụ</th><th>Ai đặt — có nói dối được không?</th></tr></thead>
<tbody>
<tr><td><strong>Trường tin cậy</strong>, bắt đầu bằng <code>_</code></td><td><code>_PID</code>, <code>_UID</code>, <code>_GID</code>, <code>_COMM</code>, <code>_EXE</code>, <code>_CMDLINE</code>, <code>_SYSTEMD_UNIT</code>, <code>_SYSTEMD_CGROUP</code>, <code>_BOOT_ID</code>, <code>_MACHINE_ID</code>, <code>_HOSTNAME</code>, <code>_TRANSPORT</code>, <code>_SYSTEMD_INVOCATION_ID</code></td><td>Chính journald, theo thông tin nhân biết về tiến trình gửi. Chương trình không tự đặt được.</td></tr>
<tr><td><strong>Trường người dùng</strong>, không có gạch dưới</td><td><code>MESSAGE</code>, <code>PRIORITY</code> (0–7, bài 1.3), <code>SYSLOG_IDENTIFIER</code>, <code>SYSLOG_FACILITY</code>, <code>CODE_FILE</code>, mọi trường tự đặt</td><td>Chương trình. Muốn ghi gì cũng được.</td></tr>
<tr><td><strong>Trường địa chỉ</strong>, bắt đầu bằng <code>__</code></td><td><code>__CURSOR</code>, <code>__REALTIME_TIMESTAMP</code> (µs từ epoch), <code>__MONOTONIC_TIMESTAMP</code> (µs từ lúc khởi động), <code>__SEQNUM</code></td><td>journald, khi lưu. Dùng để trỏ đúng một bản ghi.</td></tr>
</tbody></table>
<p>Đọc bản ghi trên theo bảng: tiến trình 424, người dùng 999 (user hệ thống <code>shop</code>), chạy <code>/usr/bin/python3 /opt/shop/api.py</code> trong <code>shop-api.service</code>, đi vào qua <code>stdout</code> của dịch vụ, priority 6 = info. <code>_SYSTEMD_INVOCATION_ID</code> đổi mỗi lần dịch vụ được (khởi động) lại — tiện để tách "trước khi sập" với "sau khi tự bật lại". Danh sách đầy đủ: <code>man systemd.journal-fields</code>.</p>

<h3>Bước 6 — bốn đường để một thông điệp vào journal</h3>
<ol>
<li><strong>stdout/stderr của dịch vụ systemd</strong> (<code>_TRANSPORT=stdout</code>). Dễ nhất: cứ in ra. Dòng có thể mở đầu bằng <code>&lt;3&gt;</code>, <code>&lt;4&gt;</code>, <code>&lt;6&gt;</code>… và journald đổi nó thành <code>PRIORITY</code> — xem hàm <code>log()</code> trong <code>api.py</code>. Không có tiền tố thì mọi dòng đều priority 6 (info), kể cả chữ "ERROR" — cái bẫy ở bài 7.2.</li>
<li><strong>Socket syslog <code>/dev/log</code></strong> (<code>_TRANSPORT=syslog</code>): chương trình kiểu cũ, <code>logger</code>, sshd, sudo.</li>
<li><strong>Giao thức gốc</strong> (<code>_TRANSPORT=journal</code>): <code>sd_journal_send()</code> trong C, thư viện cho Python/Go/Java, <code>logger --journald</code>. Chỉ đường này cho chương trình gắn trường riêng.</li>
<li><strong>Nhân</strong> (<code>_TRANSPORT=kernel</code>, bài 7.5) và audit (<code>_TRANSPORT=audit</code>, bài 8.4).</li>
</ol>
${lenh('s07/luu', 14)}
${lenh('s07/luu', 15)}
<p>Ta gửi trường riêng <code>ORDER_ID</code> và <code>AMOUNT_VND</code> — và thử nhận vơ <code>_PID=1</code>, <code>_UID=0</code>. journald lặng lẽ bỏ hai trường đó: bản ghi mang PID thật 2203 và UID 1000. Trường riêng giờ tìm chính xác được: <code>journalctl ORDER_ID=1042</code>. Công cụ nhanh cho script shell là <code>systemd-cat</code>:</p>
${lenh('s07/luu', 16)}
${lenh('s07/luu', 17)}

<h3>Góc hacker: ai cũng viết được "sshd", không ai giả được _UID</h3>
${lenh('s07/luu', 11)}
${lenh('s07/luu', 12)}
<p>Một người dùng thường vừa viết một dòng "root đăng nhập từ 203.0.113.9" trông y hệt thật dưới cái tên <code>sshd</code>. Cách hiển thị mặc định không phân biệt được với dòng thật. Kẻ tấn công có thể dùng chiêu này để rải dấu vết giả, hoặc làm ngập một luật cảnh báo. Xem bản ghi:</p>
${lenh('s07/luu', 13)}
<p><code>_UID=1000</code>, <code>_COMM=logger</code>, <code>_EXE=/usr/bin/logger</code>: sshd thật chạy bằng root từ <code>/usr/sbin/sshd</code> trong <code>ssh.service</code>. Khi một dòng bảo mật quan trọng, hãy lọc theo trường tin cậy chứ không theo cái tên: <code>journalctl _SYSTEMD_UNIT=ssh.service</code> hoặc <code>_EXE=/usr/sbin/sshd</code>. (Lưu ý: <code>_COMM</code>/<code>_EXE</code> được đọc từ <code>/proc</code> của tiến trình gửi; tiến trình thoát ngay lập tức thì đôi khi thiếu hai trường này — còn <code>_UID</code> và <code>_PID</code> lấy từ socket nên luôn có.)</p>
<p>Chính dịch vụ log cũng là bề mặt tấn công. Tháng 01/2019 Qualys công bố <strong>"System Down"</strong>: CVE-2018-16864 và CVE-2018-16865 là lỗi hỏng bộ nhớ trong systemd-journald, kích hoạt bằng thông điệp log hoặc dòng lệnh cực dài, còn CVE-2018-16866 làm lộ thông tin. Ghép hai lỗi sau, Qualys lấy được shell root cục bộ (trung bình 10 phút trên i386, 70 phút trên amd64); bản phân phối biên dịch với <code>-fstack-clash-protection</code> của GCC (SUSE 15, Fedora 28–29) thì không khai thác được. Một chương trình phân tích đầu vào từ mọi tiến trình trên máy và chạy bằng root thì phải được vá như mọi dịch vụ mạng.</p>

<h3>Tình huống đời thật</h3>
<ul>
<li><strong>OJT, VPS tự khởi động lại trong đêm:</strong> trưởng nhóm hỏi "sao nó restart?". Chạy <code>journalctl --list-boots</code> trước. Chỉ có một lần? Lưu trữ là volatile, bằng chứng đã mất — nói thẳng như vậy, rồi bật lưu bền để lần sau có câu trả lời. Có nhiều lần, và lần trước kết thúc bằng lưu lượng bình thường còn lần sau mở đầu bằng "uncleanly shut down"? Máy bị giết, không phải khởi động lại: xem console/thư báo bảo trì của nhà cung cấp.</li>
<li><strong>Docker:</strong> đa số container không có journald; stdout của chúng đi vào logging driver của Docker (bài 13.1). Journal của máy chủ chỉ có thông điệp của chính docker daemon — trừ khi driver đặt là <code>journald</code>, khi đó mỗi dòng của container là một bản ghi có <code>CONTAINER_NAME</code>.</li>
<li><strong>Nếu</strong> đồng nghiệp gửi bạn "journal" của một máy chủ đã chết dưới dạng zip thư mục <code>/var/log/journal</code>? Giải nén và đọc bằng <code>journalctl -D &lt;thư mục&gt;</code> — bài 7.3.</li>
</ul>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
<li>Trên máy ảo của bạn: <code>ls /var/log/journal</code>. Có tồn tại không? <code>Storage=</code> đang là gì (<code>systemd-analyze cat-config systemd/journald.conf</code>)? Vậy máy này có giữ log sau khi khởi động lại không?</li>
<li>Bằng người dùng thường, chạy <code>journalctl --disk-usage</code> và <code>id</code>. Giải thích con số bạn thấy.</li>
<li>In một bản ghi của dịch vụ SSH với <code>-o verbose</code>, kể tên ba trường tin cậy và hai trường người dùng.</li>
<li>Làm lại trò giả sshd, rồi viết MỘT lệnh journalctl hiện dòng sshd thật mà không hiện dòng giả của bạn.</li>
<li>Gửi một bản ghi có trường riêng <code>TICKET=OJT-17</code> bằng <code>logger --journald</code> và tìm nó theo trường đó.</li>
</ol>
<p><strong>Đạt khi:</strong> câu 1 trả lời có/không kèm lý do (thư mục + giá trị Storage); câu 2 nói "chỉ journal của tôi" hoặc "tất cả" và vì sao; câu 4 dùng trường tin cậy như <code>_SYSTEMD_UNIT=ssh.service</code> hoặc <code>_UID=0</code>; câu 5 trả về đúng bản ghi của bạn.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['systemd-journald', 'Dịch vụ log của systemd: nhận thông điệp từ dịch vụ, syslog, nhân, API gốc; lưu thành bản ghi có chỉ mục.'],
  ['/run/log/journal', 'Journal tạm trong RAM; mất khi khởi động lại.'],
  ['/var/log/journal', 'Journal bền trên đĩa; mỗi máy một thư mục con theo machine id.'],
  ['Storage=', 'auto (chỉ bền nếu có /var/log/journal), persistent, volatile, none.'],
  ['SyncIntervalSec=', 'Bao lâu ép bản ghi xuống đĩa một lần (5 phút); mức crit trở lên được ép ngay.'],
  ['trường tin cậy', 'Trường bắt đầu bằng _ do journald đặt từ thông tin của nhân (_PID, _UID, _SYSTEMD_UNIT…); không giả được.'],
  ['_TRANSPORT', 'Bản ghi vào bằng đường nào: stdout, syslog, journal, kernel, audit, driver.'],
  ['.journal~', 'Tệp journal không được đóng sạch (sập hoặc mất điện).'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Người dùng thường thấy "No entries" thường nghĩa là "chưa ở nhóm systemd-journal/adm", không phải "không có log".</li>
<li>Journal = bản ghi nhị phân có chỉ mục ở <code>/var/log/journal</code> (đĩa) hoặc <code>/run/log/journal</code> (RAM); đọc bằng journalctl, đừng grep tệp.</li>
<li><code>Storage=auto</code> chỉ giữ lịch sử nếu có <code>/var/log/journal</code>; lưu volatile thì mỗi lần khởi động lại là một lần xoá bằng chứng.</li>
<li>Mất điện làm mất tới ~5 phút bản ghi không khẩn cấp và để lại tệp <code>.journal~</code>.</li>
<li>Trường có <code>_</code> là sự thật từ nhân; trường không có là lời tự khai của chương trình. Điều tra bằng sự thật.</li>
</ul>
${nguon('📘', 'journald.conf(5)', 'Storage=, SyncIntervalSec=, giới hạn dung lượng và tốc độ', 'https://man7.org/linux/man-pages/man5/journald.conf.5.html')}
${nguon('📘', 'systemd.journal-fields(7)', 'Mọi trường tin cậy, người dùng và địa chỉ', 'https://man7.org/linux/man-pages/man7/systemd.journal-fields.7.html')}
${nguon('📘', 'Journal File Format', 'Vì sao tệp là nhị phân, đối tượng và khử trùng lặp', 'https://systemd.io/JOURNAL_FILE_FORMAT/')}
${nguon('🛡', 'Qualys — System Down (01/2019)', 'CVE-2018-16864/16865/16866 trong systemd-journald', 'https://www.qualys.com/2019/01/09/system-down/system-down.txt')}
${lienKet({ khoa: 'linux-bash', bai: 'lnx-10-3-log-journalctl', title: 'Linux & Bash 10.3 — Log và journalctl', sub: 'Bản nhập môn, nếu journalctl còn mới với bạn' })}
${lienKet({ khoa: 'operating-systems-for-developers', bai: 'os-2-6-nhat-ky', title: 'Hệ điều hành cho lập trình viên 2.6 — Nhật ký hệ thống', sub: 'journalctl và dmesg như công cụ quan sát hệ điều hành' })}
</div>
`,
};
