/**
 * Linux & Bash — Phụ lục (Chương 17): Tám lệnh còn thiếu, bảng tra nhanh ~150 lệnh theo tình huống,
 * quy trình tự học lệnh mới trong 5 phút và kiểm tra 10 câu.
 *
 * Output CHẠY THẬT duy nhất được trích từ lenh-thieu-output.txt (container Ubuntu 24.04, set -x):
 *   whereis, lscpu, userdel, shred, envsubst, wget, nmap.
 * Lệnh yum (họ RHEL/CentOS/Rocky/Amazon Linux) và mọi lệnh minh hoạ mở rộng (kể cả column/comm ở 17.3)
 * KHÔNG có output thật trong tệp đầu vào ⇒ trình bày rõ là "lệnh để bạn tự chạy" (không kèm output giả).
 *
 * LUẬT: backtick → &#96;; ${ → \${; gạch chéo ngược viết đôi; < > & trong code/out → &lt; &gt; &amp;. KHÔNG <svg>.
 */

const REF = '?ref=%2Fcourses%2Flinux-bash%2Flearn&reflabel=Linux%20%26%20Bash';

export default {
  title: 'Appendix — Eight missing commands, situation cheat sheet & learning any command|||Phụ lục — Tám lệnh còn thiếu, bảng tra nhanh & tự học lệnh mới',
  description: 'Phụ lục hoàn thiện khoá Linux & Bash: tám lệnh đi làm còn thiếu (whereis, lscpu, userdel, shred, envsubst, wget, nmap, yum), bảng tra nhanh hơn 150 lệnh xếp theo 11 nhóm tình huống, quy trình tự học bất kỳ lệnh lạ nào trong 5 phút và 10 câu kiểm tra.',
  lessons: [
    /* ─────────────────────────── 17.1 ─────────────────────────── */
    {
      title: '17.1 — The eight missing workhorse commands|||17.1 — Tám lệnh còn thiếu khi đi làm',
      slug: 'lnx-17-1-tam-lenh-con-thieu',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Tám lệnh thực chiến còn thiếu so với danh sách 156 lệnh hay dùng khi đi làm: whereis, lscpu, userdel, shred, envsubst, wget, nmap và yum — đủ ngữ cảnh OJT/VPS, cú pháp, output thật, bẫy hay gặp và liên kết ngược lại bài đã học.',
      content: `
<div class="ml-en">
<span class="eyebrow">Appendix · Lesson 17.1</span>
<h2>The eight missing workhorse commands</h2>
<p class="lead">Across Section 0 through Chapter 16, this course already covers 148 of the 156 commands you hit most often in backend and DevOps work. Eight commands did not get their own spotlight: <code>whereis</code>, <code>lscpu</code>, <code>userdel</code>, <code>shred</code>, <code>envsubst</code>, <code>wget</code>, <code>nmap</code> and <code>yum</code>. Every terminal output below is real output recorded in an Ubuntu 24.04 container; anything not recorded there (including <code>yum</code>, which lives on Red Hat-family systems) is marked clearly as a command for you to run yourself, with no fabricated output.</p>

<h3>1. <code>whereis</code> — locate a command’s binary, source and manual pages</h3>
<p><strong>When you use it at work:</strong> you SSH into <code>labflow-vps</code> or a fresh OJT build server and want to know where the system installed a tool (<code>java</code>, <code>nginx</code>, <code>bash</code>) and whether its manual pages are present — without caring about shell aliases in your profile.</p>
<p><strong>Syntax and common flags:</strong></p>
<table>
<tr><th>Form</th><th>Meaning</th></tr>
<tr><td><code>whereis NAME...</code></td><td>Search standard system locations for binaries, source files and man pages.</td></tr>
<tr><td><code>whereis -b NAME</code></td><td>Show <strong>b</strong>inaries only (skip man pages and sources).</td></tr>
<tr><td><code>whereis -m NAME</code></td><td>Show <strong>m</strong>anual pages only.</td></tr>
<tr><td><code>whereis -s NAME</code></td><td>Show <strong>s</strong>ource files only.</td></tr>
<tr><td><code>whereis -l</code></td><td>Print the exact list of directories <code>whereis</code> searches.</td></tr>
</table>
<p><strong>Real output (Ubuntu 24.04 container):</strong></p>
<pre><code class="language-bash">whereis ls bash</code></pre>
<div class="out">ls: /usr/bin/ls
bash: /usr/bin/bash</div>
<p>Notice that the bare Ubuntu container has no manual pages installed yet, so only the binary paths appear; on a full server you will also see entries like <code>/usr/share/man/man1/ls.1.gz</code>.</p>
<div class="pitfall co-tieu-de"><strong><code>whereis</code> does not know your shell aliases, functions, builtins, or NVM/SDKMAN paths.</strong> Because it scans fixed system directories rather than asking your shell, <code>whereis node</code> may return nothing when Node.js lives under <code>~/.nvm/</code>, and <code>whereis cd</code> skips the shell builtin. To ask “what will actually run if I type X right now?”, use <code>type -a X</code> or <code>command -v X</code> (Chapter 8).</div>
<p><em>Connected chapters:</em> Chapter 1 (Linux directory layout) and Chapter 8 (<code>PATH</code>, <code>which</code>, <code>type</code>, <code>command -v</code>).</p>

<h3>2. <code>lscpu</code> — inspect CPU architecture, cores and threads</h3>
<p><strong>When you use it at work:</strong> before downloading a prebuilt JDK, Node.js tarball or Docker image onto <code>labflow-vps</code>, you need to know whether the box is <code>x86_64</code> or <code>aarch64</code> (ARM64). And before tuning PM2 cluster workers, Spring Boot Tomcat threads, or <code>xargs -P</code> parallelism, you need the core and thread count.</p>
<p><strong>Syntax and common flags:</strong> <code>lscpu</code> (full summary), <code>lscpu | head -12</code> (quick top facts), <code>lscpu -e</code> (one row per logical CPU), <code>lscpu -J</code> (JSON output for <code>jq</code>). When a script only needs one integer, <code>nproc</code> is shorter.</p>
<p><strong>Real output (Ubuntu 24.04 container):</strong></p>
<pre><code class="language-bash">lscpu | head -12</code></pre>
<div class="out">Architecture:                            x86_64
CPU op-mode(s):                          32-bit, 64-bit
Address sizes:                           39 bits physical, 48 bits virtual
Byte Order:                              Little Endian
CPU(s):                                  12
On-line CPU(s) list:                     0-11
Vendor ID:                               GenuineIntel
Model name:                              12th Gen Intel(R) Core(TM) i5-12400F
CPU family:                              6
Model:                                   151
Thread(s) per core:                      2
Core(s) per socket:                      6</div>
<p>Read the four lines that matter most: <code>Architecture: x86_64</code> tells you to download <code>linux-x64</code> / <code>amd64</code> builds; <code>Core(s) per socket: 6</code> × <code>Thread(s) per core: 2</code> explains why <code>CPU(s)</code> reports <code>12</code> logical CPUs (6 physical cores with Hyper-Threading).</p>
<div class="pitfall co-tieu-de"><strong>Inside a container, <code>lscpu</code> reports the HOST machine’s CPUs, not your container’s CPU limit.</strong> If your Node.js container is capped at <code>--cpus=1</code> on a 12-CPU host, spawning 12 workers based on <code>lscpu</code> causes heavy context switching and extra RAM burn. Check container cgroup quotas (Chapter 14) instead. Also, macOS does not ship <code>lscpu</code> — use <code>uname -m</code> and <code>sysctl -n hw.ncpu</code> (Chapter 15).</div>
<p><em>Connected chapters:</em> Chapter 12 (hardware and server diagnostics) and Chapter 14 (cgroups v2 CPU limits).</p>

<h3>3. <code>userdel</code> — remove a Linux user account cleanly</h3>
<p><strong>When you use it at work:</strong> an intern finishes their OJT rotation, or you created a temporary test account on <code>labflow-vps</code> and want to revoke access cleanly instead of leaving stale accounts behind.</p>
<p><strong>Syntax and common flags:</strong></p>
<table>
<tr><th>Form</th><th>Meaning</th></tr>
<tr><td><code>sudo userdel USER</code></td><td>Delete the user entry from <code>/etc/passwd</code>, <code>/etc/shadow</code> and <code>/etc/group</code>, but <strong>leave <code>/home/USER</code> on disk</strong>.</td></tr>
<tr><td><code>sudo userdel -r USER</code></td><td>Remove the account <strong>and</strong> delete its home directory and mail spool.</td></tr>
<tr><td><code>sudo userdel -f USER</code></td><td>Force removal even if the user is still logged in (risky — avoid in production).</td></tr>
</table>
<p><strong>Real output (Ubuntu 24.04 container):</strong></p>
<pre><code class="language-bash">useradd -m demo
id demo
userdel -r demo
id demo</code></pre>
<div class="out">uid=1001(demo) gid=1001(demo) groups=1001(demo)
userdel: demo mail spool (/var/mail/demo) not found
id: 'demo': no such user</div>
<p>The line <code>demo mail spool (/var/mail/demo) not found</code> is a harmless notice because the fresh account never received local mail; the last line confirms <code>demo</code> no longer exists.</p>
<div class="pitfall co-tieu-de"><strong>Two opposite traps: forgetting <code>-r</code>, and rushing into <code>-r</code>.</strong><br>
1) Without <code>-r</code>, <code>/home/demo</code> stays behind owned by numeric UID <code>1001</code>. If a new user later gets UID <code>1001</code>, they silently inherit the old user’s files.<br>
2) With <code>-r</code>, <code>/home/demo</code> is wiped immediately with no trash bin. On a real server, lock the account first (<code>sudo usermod -L -e 1 demo</code>), back up <code>/home/demo</code>, check running processes (<code>ps -u demo</code>) and cron jobs (<code>sudo crontab -l -u demo</code>), and only then run <code>userdel -r</code>. Files the user owned outside <code>/home</code> (for example in <code>/var/www</code> or <code>/tmp</code>) are NOT deleted by <code>-r</code> — find orphans with <code>sudo find / -nouser 2&gt;/dev/null</code>.</div>
<p><em>Connected chapters:</em> Chapter 4 (permissions, <code>useradd</code>, <code>usermod</code>, <code>passwd</code>, <code>id</code>, <code>/etc/passwd</code>).</p>

<h3>4. <code>shred</code> — overwrite a file before removing it</h3>
<p><strong>When you use it at work:</strong> you exported a temporary <code>.env</code> with database credentials, a TLS private key (<code>.pem</code>) or a customer SQL dump onto a scratch disk and want to overwrite its bytes before unlinking it — because plain <code>rm</code> (Chapter 2) only removes the directory entry and leaves data blocks intact until reused.</p>
<p><strong>Syntax and common flags:</strong></p>
<table>
<tr><th>Flag</th><th>Meaning</th></tr>
<tr><td><code>-n N</code></td><td>Overwrite <code>N</code> times with random data (default is 3).</td></tr>
<tr><td><code>-z</code></td><td>Add a final pass of zeros to hide that the file was shredded.</td></tr>
<tr><td><code>-u</code></td><td>Truncate, repeatedly rename to obscure the filename, and remove the file when done.</td></tr>
<tr><td><code>-v</code></td><td>Verbose progress for each pass.</td></tr>
</table>
<p><strong>Real output (Ubuntu 24.04 container):</strong></p>
<pre><code class="language-bash">echo bi-mat &gt; /tmp/khoa.txt
shred -u -v -n 2 /tmp/khoa.txt
ls /tmp/khoa.txt</code></pre>
<div class="out">shred: /tmp/khoa.txt: pass 1/2 (random)...
shred: /tmp/khoa.txt: pass 2/2 (random)...
shred: /tmp/khoa.txt: removing
shred: /tmp/khoa.txt: renamed to /tmp/00000000
shred: /tmp/00000000: renamed to /tmp/0000000
shred: /tmp/0000000: renamed to /tmp/000000
shred: /tmp/000000: renamed to /tmp/00000
shred: /tmp/00000: renamed to /tmp/0000
shred: /tmp/0000: renamed to /tmp/000
shred: /tmp/000: renamed to /tmp/00
shred: /tmp/00: renamed to /tmp/0
shred: /tmp/khoa.txt: removed
ls: cannot access '/tmp/khoa.txt': No such file or directory</div>
<p>Look at those <code>renamed to /tmp/00000000</code> … <code>/tmp/0</code> lines: <code>-u</code> shrinks the filename one character at a time so even the original name is harder to recover from directory metadata.</p>
<div class="callout danger"><strong>Critical limitation: <code>shred</code> does NOT guarantee erasure on SSDs, journaling or copy-on-write filesystems.</strong> <code>shred</code> assumes writes overwrite the exact same physical blocks in place. Modern <strong>SSDs / NVMe drives</strong> use wear-leveling that redirects writes to fresh flash blocks; <strong>copy-on-write filesystems</strong> (Btrfs, ZFS, Apple APFS), <strong>journaling modes</strong> that log file data (<code>ext4 data=journal</code>), <strong>cloud EBS/LVM snapshots</strong>, and <strong>RAID/NFS</strong> can all keep untouched copies of the original secret. In real production work, protect secrets with <strong>full-disk encryption</strong> (LUKS on Linux, FileVault on macOS) from day one, keep temporary secrets in RAM (<code>/dev/shm</code> or <code>tmpfs</code>), and rotate leaked credentials rather than trusting <code>shred</code> alone.</div>
<p><em>Connected chapters:</em> Chapter 2 (<code>rm</code> and inodes) and Chapter 10 / 14 (filesystems and LVM snapshots).</p>

<h3>5. <code>envsubst</code> — render config templates from environment variables</h3>
<p><strong>When you use it at work:</strong> almost every Node.js, Spring Boot or Docker project on <code>labflow-vps</code> needs slightly different <code>nginx.conf</code>, <code>docker-compose.yml</code> or Kubernetes YAML files for staging vs production. Instead of maintaining two copy-pasted files or installing Python Jinja2 just to swap two values, <code>envsubst</code> (from the <code>gettext-base</code> package) substitutes <code>\$VAR</code> and <code>\${VAR}</code> directly from the environment.</p>
<p><strong>Real output (Ubuntu 24.04 container):</strong></p>
<pre><code class="language-bash">export APP_PORT=8080 APP_NAME=labflow
printf 'server { listen \$APP_PORT; server_name \$APP_NAME.test; }\\n' &gt; tpl.conf
cat tpl.conf
envsubst &lt; tpl.conf</code></pre>
<div class="out">server { listen $APP_PORT; server_name $APP_NAME.test; }
server { listen 8080; server_name labflow.test; }</div>
<p><strong>Safer pattern to run yourself (no output shown):</strong> pass a single-quoted allowlist of the exact variables to replace.</p>
<pre><code class="language-bash"><span class="tok-comment"># Commands to run yourself — preserves Nginx variables like \$host and \$uri</span>
export APP_PORT=8080 APP_NAME=labflow
envsubst '\$APP_PORT \$APP_NAME' &lt; nginx.conf.tpl &gt; nginx.conf</code></pre>
<div class="pitfall co-tieu-de"><strong>Three classic <code>envsubst</code> traps:</strong><br>
1) <strong>Wiping Nginx variables:</strong> running bare <code>envsubst &lt; nginx.conf.tpl</code> replaces Nginx’s own <code>\$host</code>, <code>\$uri</code> and <code>\$remote_addr</code> with empty strings because they are not set in your shell! Always pass a single-quoted list like <code>'\$APP_PORT \$APP_NAME'</code>.<br>
2) <strong>Forgetting <code>export</code>:</strong> a plain shell variable (<code>APP_PORT=8080</code> without <code>export</code>) is invisible to the child process <code>envsubst</code>, so it expands to empty.<br>
3) <strong>Redirecting back onto the same file:</strong> <code>envsubst &lt; app.conf &gt; app.conf</code> truncates <code>app.conf</code> to 0 bytes before <code>envsubst</code> reads it (Chapter 3). Always write to a different output file, then <code>mv</code>.</div>
<p><em>Connected chapters:</em> Chapter 3 (redirection <code>&lt;</code> / <code>&gt;</code>), Chapter 8 (<code>export</code> and environment variables) and Chapter 16 (deploying Nginx and Docker).</p>

<h3>6. <code>wget</code> — download files, resume transfers and inspect headers</h3>
<p><strong>When you use it at work:</strong> pulling a large JDK/Node.js release tarball, database backup, or dataset onto <code>labflow-vps</code> over a flaky network (with resume support), checking whether a URL returns <code>200 OK</code> without saving a file, or mirroring a static folder.</p>
<p><strong>Real output (Ubuntu 24.04 container):</strong></p>
<pre><code class="language-bash">wget -q -O- --spider -S https://example.com 2&gt;&amp;1 | head -6</code></pre>
<div class="out">  HTTP/1.1 200 OK
  Date: Wed, 25 Nov 2026 11:08:20 GMT
  Content-Type: text/html; charset=utf-8
  Connection: keep-alive
  Server: cloudflare
  last-modified: Tue, 24 Nov 2026 17:35:01 GMT</div>
<p>Here <code>-q</code> silences progress bars, <code>-O-</code> avoids creating a file, <code>--spider</code> tells <code>wget</code> only to check the resource, and <code>-S</code> prints the server’s HTTP response headers (to stderr, hence <code>2&gt;&amp;1 | head -6</code>).</p>
<p><strong>Common flags (commands to run yourself — no output shown):</strong></p>
<pre><code class="language-bash"><span class="tok-comment"># Download and save under a specific filename (-O uppercase)</span>
wget -O jdk.tar.gz https://example.com/jdk.tar.gz
<span class="tok-comment"># Resume a broken download (-c) and cap bandwidth so the VPS stays responsive</span>
wget -c --limit-rate=5m --tries=5 https://example.com/big-backup.tar.zst</code></pre>
<p><strong><code>wget</code> vs <code>curl</code> — when to pick which:</strong></p>
<table>
<tr><th>Aspect</th><th><code>wget</code></th><th><code>curl</code> (Chapter 9)</th></tr>
<tr><td>Default output</td><td>Saves directly to a file on disk</td><td>Prints response body to stdout (needs <code>-O</code> / <code>-o</code> to save)</td></tr>
<tr><td>Best at</td><td>Large file downloads, auto-retry, resume (<code>-c</code>), recursive/mirror downloads (<code>-r -np</code>)</td><td>Calling REST APIs (<code>-X POST</code>, <code>-H</code>, <code>-d</code>, auth), debugging HTTP/TLS, scripting pipelines</td></tr>
<tr><td>Preinstalled?</td><td>Common on Linux servers; NOT preinstalled on macOS (<code>brew install wget</code>)</td><td>Preinstalled almost everywhere (Linux, macOS, Windows 10/11)</td></tr>
<tr><td>Rule of thumb</td><td>Pulling files/archives onto a server</td><td>Testing your Node.js / Spring REST endpoints</td></tr>
</table>
<div class="pitfall co-tieu-de"><strong>Do not mix up <code>-O</code> and <code>-o</code>.</strong> Uppercase <code>-O file</code> sets the downloaded output file; lowercase <code>-o file</code> redirects <code>wget</code>’s <em>log messages</em> into that file while saving the download under its original name. Also, always verify downloads with <code>sha256sum</code> (Chapter 10) and never pipe an unread script straight into <code>sudo bash</code>.</div>
<p><em>Connected chapters:</em> Chapter 9 (<code>curl</code> and HTTP) and Chapter 10 (<code>sha256sum</code> verification).</p>

<h3>7. <code>nmap</code> — check open ports and exposed services on your own hosts</h3>
<p><strong>When you use it at work:</strong> after configuring <code>ufw</code>/<code>nftables</code> or starting Docker Compose on <code>labflow-vps</code> (Nginx 80/443, Node.js 3000, Spring 8080, PostgreSQL 5432), you verify from the network side that internal database ports are NOT exposed to the public Internet — remember Docker can bypass <code>ufw</code> if you bind <code>0.0.0.0:5432</code> instead of <code>127.0.0.1:5432</code>!</p>
<p><strong>Real output (Ubuntu 24.04 container):</strong></p>
<pre><code class="language-bash">nmap -sT -p 22,80,443 --open 127.0.0.1 | tail -5</code></pre>
<div class="out">Starting Nmap 7.94SVN ( https://nmap.org ) at 2026-11-25 11:08 UTC
Nmap done: 1 IP address (1 host up) scanned in 0.02 seconds</div>
<p>Why are there only two lines and no port table? Because nothing is listening on ports 22, 80 or 443 inside a fresh container, and <code>--open</code> hides closed ports so only genuinely reachable ports stand out. <code>-sT</code> performs a standard TCP connect scan, which works without root privileges.</p>
<p><strong>Other useful patterns (commands to run yourself on your own machine/container — no output shown):</strong></p>
<pre><code class="language-bash"><span class="tok-comment"># Probe service banners/versions on your local app ports</span>
nmap -sV -p 80,443,3000,5432,8080 127.0.0.1
<span class="tok-comment"># Fast SYN scan across all 65,535 TCP ports (requires root) on your own host</span>
sudo nmap -sS -p- --open 127.0.0.1</code></pre>
<div class="callout danger"><strong>Legal and professional boundary: ONLY scan machines you own or have written permission to test.</strong> Running <code>nmap</code> against your university network, an OJT client’s server, or any third-party website without explicit authorization is treated as active reconnaissance, triggers intrusion detection systems (IDS), can get your IP or account banned, and may violate cybersecurity laws. Keep practice strictly on <code>127.0.0.1</code>, your own containers, or your personal <code>labflow-vps</code>.</div>
<div class="callout"><strong><code>ss</code> vs <code>nmap</code>:</strong> <code>ss -tulpn</code> (Chapter 9) asks the local kernel <em>inside</em> the server what processes are listening. <code>nmap</code> tests <em>from the network perspective</em> whether a packet actually gets through the firewall and Docker NAT rules. You need both during a server audit.</div>
<p><em>Connected chapters:</em> Chapter 9 (<code>ss</code>, <code>nc</code>, <code>ufw</code>, TCP/UDP ports) and Chapter 14 (<code>nftables</code>).</p>

<h3>8. <code>yum</code> — the Red Hat / CentOS package manager (predecessor of <code>dnf</code>)</h3>
<p><strong>When you use it at work:</strong> your personal VPS runs Ubuntu (<code>apt</code>), but during OJT at FPT Software or enterprise Java/Spring engagements (banking, Japan/US clients), production Linux servers very often run <strong>RHEL, CentOS 7, Rocky Linux, AlmaLinux, Oracle Linux or Amazon Linux</strong>. There is no <code>apt</code> there — you will use <code>yum</code> or <code>dnf</code>.</p>
<p><strong>How <code>yum</code> relates to <code>dnf</code>:</strong> <code>yum</code> (Yellowdog Updater, Modified) was the standard RPM package manager from RHEL/CentOS 5 through 7 and Amazon Linux 2. Starting with RHEL 8, Rocky/AlmaLinux 8+, Fedora and Amazon Linux 2023, <strong><code>dnf</code></strong> (Dandified YUM) replaced it with a faster dependency solver and lower memory usage. On those modern systems, typing <code>yum</code> still works because <code>/usr/bin/yum</code> is a symbolic link to <code>dnf</code>.</p>
<p>Because our container recording environment was Ubuntu 24.04, there is no <code>yum</code> output in this lesson. Below are the exact <strong>commands to run yourself</strong> inside a disposable Rocky Linux container (<code>docker run --rm -it rockylinux:9 bash</code>) or on an RHEL-family server:</p>
<pre><code class="language-bash"><span class="tok-comment"># Commands to run yourself inside rockylinux:9 or an RHEL/CentOS/Amazon Linux host</span>
yum search nginx
yum info nginx
sudo yum install -y nginx
sudo yum update -y
yum list installed | head -20
yum provides '*/envsubst'         <span class="tok-comment"># find which package owns a missing command</span>
yum history                       <span class="tok-comment"># view install/upgrade transactions (undo with: sudo yum history undo ID)</span>
sudo yum clean all</code></pre>
<p><strong>Quick translation from Ubuntu <code>apt</code> (Chapter 10) to <code>yum</code> / <code>dnf</code>:</strong></p>
<table>
<tr><th>Task</th><th>Ubuntu / Debian (<code>apt</code>)</th><th>RHEL / CentOS / Rocky / Amazon Linux (<code>yum</code> / <code>dnf</code>)</th></tr>
<tr><td>Search packages</td><td><code>apt search pkg</code></td><td><code>yum search pkg</code></td></tr>
<tr><td>Install package</td><td><code>sudo apt install -y pkg</code></td><td><code>sudo yum install -y pkg</code></td></tr>
<tr><td>Remove package</td><td><code>sudo apt remove pkg</code></td><td><code>sudo yum remove pkg</code></td></tr>
<tr><td>Upgrade everything</td><td><code>sudo apt update &amp;&amp; sudo apt upgrade</code></td><td><code>sudo yum update</code> (<code>dnf upgrade</code>)</td></tr>
<tr><td>Which package owns a command?</td><td><code>dpkg -S /usr/bin/envsubst</code></td><td><code>yum provides '*/envsubst'</code></td></tr>
<tr><td>Undo last install transaction</td><td>(manual remove)</td><td><code>sudo yum history undo ID</code></td></tr>
</table>
<div class="pitfall co-tieu-de"><strong>Package names differ from Ubuntu, and common tools live in EPEL.</strong> On RHEL-family hosts, Apache is <code>httpd</code> (not <code>apache2</code>), compiler headers end in <code>-devel</code> (<code>openssl-devel</code> instead of <code>libssl-dev</code>), and popular tools like <code>htop</code> or <code>ncdu</code> often require enabling the EPEL repository first (<code>sudo yum install -y epel-release</code>).</div>
<p><em>Connected chapters:</em> Chapter 10 (<code>apt</code>, <code>dpkg</code>, <code>dnf</code>, <code>rpm</code>).</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> you are preparing a fresh container before deploying a Spring Boot + Nginx demo to <code>labflow-vps</code>. Run everything safely inside a disposable Ubuntu container so you never touch your host machine.</p><ol>
<li>Launch a throwaway container: <code>docker run --rm -it ubuntu:24.04 bash</code>, then install the tools needed for the lab: <code>apt-get update &amp;&amp; apt-get install -y gettext-base wget nmap</code>.</li>
<li>Run <code>lscpu | head -12</code> and <code>whereis ls bash wget</code>. Note the architecture and logical CPU count.</li>
<li>Export <code>APP_PORT=8080</code> and <code>APP_NAME=labflow</code>, create <code>nginx.conf.tpl</code> containing both <code>\$APP_PORT</code> and Nginx’s <code>\$host</code>, then render it with <code>envsubst '\$APP_PORT \$APP_NAME' &lt; nginx.conf.tpl &gt; nginx.conf</code>. Verify <code>\$host</code> survived untouched.</li>
<li>Check headers with <code>wget -q -O- --spider -S https://example.com 2&gt;&amp;1 | head -6</code>, and scan loopback with <code>nmap -sT -p 22,80,443 --open 127.0.0.1</code>.</li>
<li>Create a temp user (<code>useradd -m intern1</code>), verify with <code>id intern1</code>, remove with <code>userdel -r intern1</code>, and verify removal. Create <code>/tmp/secret.key</code> and erase it with <code>shred -u -v -n 2 /tmp/secret.key</code>.</li>
<li>(Optional) Start <code>docker run --rm -it rockylinux:9 bash</code> and run <code>yum provides '*/envsubst'</code> and <code>yum --version</code> to see <code>yum</code> pointing to <code>dnf</code>.</li>
</ol>
<p><strong>Done when:</strong> <code>nginx.conf</code> contains <code>8080</code>, <code>labflow</code> AND literal <code>\$host</code>; <code>id intern1</code> prints <code>no such user</code>; <code>/tmp/secret.key</code> is gone; and you can explain in one sentence why <code>shred</code> alone is not enough on an SSD.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">whereis</span><span class="v">Locates binaries, source files and man pages in standard system directories (ignores aliases/builtins).</span></div>
  <div class="kv"><span class="k">Logical CPU vs physical core</span><span class="v">One physical core with 2 hardware threads appears as 2 logical CPUs in <code>lscpu</code>.</span></div>
  <div class="kv"><span class="k">Orphan file (<code>-nouser</code>)</span><span class="v">A file whose owner UID no longer exists in <code>/etc/passwd</code> after <code>userdel</code>.</span></div>
  <div class="kv"><span class="k">Wear-leveling / Copy-on-Write</span><span class="v">SSD and modern filesystem mechanisms that write new blocks instead of overwriting in place, limiting <code>shred</code>.</span></div>
  <div class="kv"><span class="k">envsubst allowlist</span><span class="v">Passing <code>'\$VAR1 \$VAR2'</code> in single quotes so <code>envsubst</code> leaves other <code>\$</code> placeholders intact.</span></div>
  <div class="kv"><span class="k">Spider mode (<code>wget --spider</code>)</span><span class="v">Checks if a URL exists and fetches headers without downloading the body to disk.</span></div>
  <div class="kv"><span class="k">TCP connect scan (<code>nmap -sT</code>)</span><span class="v">Port scan using standard OS <code>connect()</code> calls; works without root privileges.</span></div>
  <div class="kv"><span class="k">EPEL</span><span class="v">Extra Packages for Enterprise Linux — community repository adding tools like <code>htop</code> to RHEL/Rocky/CentOS.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Use <code>whereis</code> to find system binaries/man pages, but use <code>type -a</code> / <code>command -v</code> when aliases, builtins or NVM/SDKMAN are involved.</li>
<li>Read <code>lscpu</code> for architecture and core/thread counts, and remember containers see the host’s CPU count rather than cgroup quotas.</li>
<li>Always lock/backup/audit a production account before <code>userdel -r</code>, and check for orphan files outside <code>/home</code> with <code>find / -nouser</code>.</li>
<li><code>shred -u</code> overwrites and obscures filenames on traditional HDDs, but is NOT guaranteed on SSDs, CoW or journaling filesystems — use full-disk encryption.</li>
<li>Always pass a single-quoted variable list to <code>envsubst</code> on Nginx configs so <code>\$host</code> and <code>\$uri</code> are not wiped out.</li>
<li>Pick <code>wget</code> for file downloads/resumes and <code>curl</code> for REST APIs; run <code>nmap</code> ONLY on hosts you own or have permission to test; use <code>yum</code>/<code>dnf</code> on RHEL-family servers.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/man1/shred.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">man7.org — shred(1)</span><span class="lc-sub">Read the CAUTION section explaining exactly why journaling, CoW, RAID and SSDs defeat in-place overwriting.</span></span>
</a>
<a class="link-card" href="https://www.gnu.org/software/gettext/manual/html_node/envsubst-Invocation.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">GNU gettext — envsubst invocation</span><span class="lc-sub">Official reference for the <code>SHELL-FORMAT</code> variable allowlist argument.</span></span>
</a>
<a class="link-card" href="https://nmap.org/book/man.html" target="_blank" rel="noopener">
  <span class="lc-ico">🛡</span>
  <span class="lc-body"><span class="lc-title">Nmap Reference Guide</span><span class="lc-sub">Official documentation for scan types (<code>-sT</code>, <code>-sS</code>, <code>-sV</code>), port specification and legal usage notes.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice on Code Lab</span><span class="lc-sub">Reinforce permissions, networking and scripting habits on the Linux &amp; Bash track.</span></span>
</a>

<p class="note-ct"><strong>If you only memorize two safety rules from Lesson 17.1:</strong> single-quote the variable list in <code>envsubst '\$APP_PORT'</code> so you never break Nginx in production, and point <code>nmap</code> ONLY at your own hosts (<code>127.0.0.1</code> or <code>labflow-vps</code>).</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Phụ lục · Bài 17.1</span>
<h2>Tám lệnh còn thiếu khi đi làm</h2>
<p class="lead">Từ Mục 0 tới Chương 16, khoá học đã dạy 148 trên 156 lệnh hay dùng nhất khi đi làm backend và vận hành hệ thống. Còn đúng 8 lệnh chưa có chỗ đứng riêng: <code>whereis</code>, <code>lscpu</code>, <code>userdel</code>, <code>shred</code>, <code>envsubst</code>, <code>wget</code>, <code>nmap</code> và <code>yum</code>. Mọi khung kết quả dưới đây đều là output CHẠY THẬT trong container Ubuntu 24.04; lệnh nào không có output thật trong tệp đầu vào (kể cả <code>yum</code> vốn thuộc họ Red Hat) được ghi rõ là "lệnh để bạn tự chạy", tuyệt đối không bịa kết quả.</p>

<h3>1. <code>whereis</code> — tìm file nhị phân, mã nguồn và trang man của một lệnh</h3>
<p><strong>Dùng khi nào lúc đi làm:</strong> bạn vừa SSH vào <code>labflow-vps</code> hoặc máy build lúc OJT và muốn biết hệ thống cài <code>java</code>, <code>nginx</code> hay <code>bash</code> ở thư mục chuẩn nào, có sẵn trang <code>man</code> hay chưa — không bị nhiễu bởi alias (bí danh) trong profile cá nhân.</p>
<p><strong>Cú pháp và tuỳ chọn hay dùng:</strong></p>
<table>
<tr><th>Cú pháp</th><th>Ý nghĩa</th></tr>
<tr><td><code>whereis TÊN...</code></td><td>Tìm file nhị phân (binary), mã nguồn và trang <code>man</code> trong các thư mục hệ thống chuẩn.</td></tr>
<tr><td><code>whereis -b TÊN</code></td><td>Chỉ in đường dẫn file <strong>b</strong>inary (thực thi).</td></tr>
<tr><td><code>whereis -m TÊN</code></td><td>Chỉ in đường dẫn trang <strong>m</strong>an.</td></tr>
<tr><td><code>whereis -s TÊN</code></td><td>Chỉ in đường dẫn mã nguồn (<strong>s</strong>ource).</td></tr>
<tr><td><code>whereis -l</code></td><td>In đúng danh sách thư mục mà <code>whereis</code> sẽ quét.</td></tr>
</table>
<p><strong>Output thật (container Ubuntu 24.04):</strong></p>
<pre><code class="language-bash">whereis ls bash</code></pre>
<div class="out">ls: /usr/bin/ls
bash: /usr/bin/bash</div>
<p>Vì container Ubuntu tối giản chưa cài gói trang <code>man</code> nên kết quả chỉ có đường dẫn file chạy; trên VPS đầy đủ bạn sẽ thấy thêm cả mục kiểu <code>/usr/share/man/man1/ls.1.gz</code>.</p>
<div class="pitfall co-tieu-de"><strong><code>whereis</code> không biết alias, hàm shell, lệnh dựng sẵn (builtin), hay đường dẫn NVM/SDKMAN.</strong> Vì nó chỉ quét danh sách thư mục hệ thống cố định chứ không hỏi shell hiện tại, <code>whereis node</code> có thể trống trơn khi Node.js cài qua <code>~/.nvm/</code>, và <code>whereis cd</code> bỏ qua lệnh dựng sẵn của bash. Muốn biết "gõ X ngay lúc này thì cái gì sẽ chạy thật?", hãy dùng <code>type -a X</code> hoặc <code>command -v X</code> (Chương 8).</div>
<p><em>Liên kết bài đã học:</em> Chương 1 (cây thư mục Linux) và Chương 8 (<code>PATH</code>, <code>which</code>, <code>type</code>, <code>command -v</code>).</p>

<h3>2. <code>lscpu</code> — xem kiến trúc và số nhân/luồng CPU</h3>
<p><strong>Dùng khi nào lúc đi làm:</strong> trước khi tải bản build JDK (Spring), Node.js hay ảnh Docker lên <code>labflow-vps</code>, bạn cần chắc máy là <code>x86_64</code> hay <code>aarch64</code> (ARM64). Và trước khi chỉnh số worker PM2, thread pool Tomcat hay độ song song <code>xargs -P</code>, bạn cần biết máy có bao nhiêu nhân thật và bao nhiêu CPU logic.</p>
<p><strong>Cú pháp và tuỳ chọn hay dùng:</strong> <code>lscpu</code> (xem đủ), <code>lscpu | head -12</code> (lấy nhanh 12 dòng đầu quan trọng nhất), <code>lscpu -e</code> (bảng từng CPU logic), <code>lscpu -J</code> (xuất JSON đẩy sang <code>jq</code>). Khi script chỉ cần duy nhất một con số, dùng <code>nproc</code> cho gọn.</p>
<p><strong>Output thật (container Ubuntu 24.04):</strong></p>
<pre><code class="language-bash">lscpu | head -12</code></pre>
<div class="out">Architecture:                            x86_64
CPU op-mode(s):                          32-bit, 64-bit
Address sizes:                           39 bits physical, 48 bits virtual
Byte Order:                              Little Endian
CPU(s):                                  12
On-line CPU(s) list:                     0-11
Vendor ID:                               GenuineIntel
Model name:                              12th Gen Intel(R) Core(TM) i5-12400F
CPU family:                              6
Model:                                   151
Thread(s) per core:                      2
Core(s) per socket:                      6</div>
<p>Đọc nhanh bốn dòng quan trọng nhất: <code>Architecture: x86_64</code> cho biết phải tải gói <code>linux-x64</code> / <code>amd64</code>; <code>Core(s) per socket: 6</code> nhân <code>Thread(s) per core: 2</code> giải thích vì sao <code>CPU(s)</code> báo <code>12</code> CPU logic (6 nhân vật lý có siêu phân luồng).</p>
<div class="pitfall co-tieu-de"><strong>Trong Docker/Kubernetes, <code>lscpu</code> vẫn in số CPU của MÁY CHỦ HOST, không phải hạn mức của container.</strong> Nếu container Node.js của bạn bị giới hạn <code>--cpus=1</code> trên máy host 12 CPU mà bạn đọc <code>lscpu</code> rồi mở 12 worker PM2, dịch vụ sẽ nghẽn chuyển ngữ cảnh (context switch) và ăn RAM vô ích. Hãy đọc hạn mức cgroup (Chương 14) thay vì tin mỗi <code>lscpu</code>. Ngoài ra, macOS không có <code>lscpu</code> — dùng <code>uname -m</code> và <code>sysctl -n hw.ncpu</code> (Chương 15).</div>
<p><em>Liên kết bài đã học:</em> Chương 12 (chẩn đoán phần cứng &amp; máy chủ) và Chương 14 (giới hạn CPU bằng cgroups v2).</p>

<h3>3. <code>userdel</code> — xoá tài khoản người dùng Linux</h3>
<p><strong>Dùng khi nào lúc đi làm:</strong> một bạn thực tập xong kỳ OJT, hoặc bạn vừa tạo tài khoản thử nghiệm trên <code>labflow-vps</code> và cần thu hồi gọn gàng thay vì để lại tài khoản bỏ hoang.</p>
<p><strong>Cú pháp và tuỳ chọn hay dùng:</strong></p>
<table>
<tr><th>Cú pháp</th><th>Ý nghĩa</th></tr>
<tr><td><code>sudo userdel USER</code></td><td>Xoá tài khoản khỏi <code>/etc/passwd</code>, <code>/etc/shadow</code>, <code>/etc/group</code> nhưng <strong>giữ nguyên <code>/home/USER</code> trên đĩa</strong>.</td></tr>
<tr><td><code>sudo userdel -r USER</code></td><td>Xoá tài khoản <strong>kèm</strong> thư mục <code>/home/USER</code> và hộp thư <code>/var/mail/USER</code>.</td></tr>
<tr><td><code>sudo userdel -f USER</code></td><td>Ép xoá ngay cả khi người dùng đang đăng nhập (nguy hiểm — tránh dùng trên máy thật).</td></tr>
</table>
<p><strong>Output thật (container Ubuntu 24.04):</strong></p>
<pre><code class="language-bash">useradd -m demo
id demo
userdel -r demo
id demo</code></pre>
<div class="out">uid=1001(demo) gid=1001(demo) groups=1001(demo)
userdel: demo mail spool (/var/mail/demo) not found
id: 'demo': no such user</div>
<p>Dòng <code>demo mail spool (/var/mail/demo) not found</code> chỉ là thông báo bình thường vì tài khoản mới tạo chưa có hộp thư cục bộ; dòng cuối xác nhận <code>demo</code> đã bị xoá sạch.</p>
<div class="pitfall co-tieu-de"><strong>Hai cái bẫy trái ngược nhau: quên <code>-r</code> và vội dùng <code>-r</code>.</strong><br>
1) Quên <code>-r</code> sẽ để lại <code>/home/demo</code> mồ côi mang UID số <code>1001</code>. Sau này tạo tài khoản mới vô tình nhận đúng UID <code>1001</code>, người mới sẽ tự động sở hữu toàn bộ file cũ!<br>
2) Dùng <code>-r</code> ngay lập tức sẽ xoá vĩnh viễn <code>/home/demo</code> không có thùng rác. Trên máy chủ thật, hãy khoá tài khoản trước (<code>sudo usermod -L -e 1 demo</code>), sao lưu <code>/home/demo</code>, kiểm tra tiến trình đang chạy (<code>ps -u demo</code>) và cron (<code>sudo crontab -l -u demo</code>), rồi mới chạy <code>userdel -r</code>. File người đó sở hữu ngoài <code>/home</code> (vd <code>/var/www</code>, <code>/tmp</code>) KHÔNG bị <code>-r</code> xoá — tìm file mồ côi bằng <code>sudo find / -nouser 2&gt;/dev/null</code>.</div>
<p><em>Liên kết bài đã học:</em> Chương 4 (quyền &amp; người dùng: <code>useradd</code>, <code>usermod</code>, <code>passwd</code>, <code>id</code>, <code>/etc/passwd</code>).</p>

<h3>4. <code>shred</code> — ghi đè dữ liệu ngẫu nhiên trước khi xoá file nhạy cảm</h3>
<p><strong>Dùng khi nào lúc đi làm:</strong> bạn vừa xuất một file <code>.env</code> chứa mật khẩu CSDL, khoá riêng TLS (<code>.pem</code>) hay bản dump SQL khách hàng ra ổ đĩa tạm và muốn ghi đè dữ liệu trước khi xoá — vì lệnh <code>rm</code> bình thường (Chương 2) chỉ gỡ tên file khỏi thư mục, còn các byte dữ liệu cũ vẫn nằm trên đĩa cho tới khi bị ghi đè.</p>
<p><strong>Cú pháp và tuỳ chọn hay dùng:</strong></p>
<table>
<tr><th>Tuỳ chọn</th><th>Ý nghĩa</th></tr>
<tr><td><code>-n N</code></td><td>Ghi đè <code>N</code> lượt dữ liệu ngẫu nhiên (mặc định là 3).</td></tr>
<tr><td><code>-z</code></td><td>Ghi thêm một lượt toàn số 0 ở cuối để che dấu vết vừa chạy <code>shred</code>.</td></tr>
<tr><td><code>-u</code></td><td>Cắt ngắn, đổi tên nhiều lần để che tên file gốc rồi xoá hẳn.</td></tr>
<tr><td><code>-v</code></td><td>In tiến độ từng lượt ghi đè.</td></tr>
</table>
<p><strong>Output thật (container Ubuntu 24.04):</strong></p>
<pre><code class="language-bash">echo bi-mat &gt; /tmp/khoa.txt
shred -u -v -n 2 /tmp/khoa.txt
ls /tmp/khoa.txt</code></pre>
<div class="out">shred: /tmp/khoa.txt: pass 1/2 (random)...
shred: /tmp/khoa.txt: pass 2/2 (random)...
shred: /tmp/khoa.txt: removing
shred: /tmp/khoa.txt: renamed to /tmp/00000000
shred: /tmp/00000000: renamed to /tmp/0000000
shred: /tmp/0000000: renamed to /tmp/000000
shred: /tmp/000000: renamed to /tmp/00000
shred: /tmp/00000: renamed to /tmp/0000
shred: /tmp/0000: renamed to /tmp/000
shred: /tmp/000: renamed to /tmp/00
shred: /tmp/00: renamed to /tmp/0
shred: /tmp/khoa.txt: removed
ls: cannot access '/tmp/khoa.txt': No such file or directory</div>
<p>Để ý chuỗi <code>renamed to /tmp/00000000</code> … <code>/tmp/0</code>: cờ <code>-u</code> cố tình rút ngắn tên file từng ký tự một để ngay cả TÊN file cũ cũng khó khôi phục từ metadata thư mục.</p>
<div class="callout danger"><strong>Giới hạn sống còn: <code>shred</code> KHÔNG đảm bảo xoá sạch trên SSD, hệ thống file có journaling hoặc copy-on-write.</strong> <code>shred</code> giả định thao tác ghi sẽ đè lên đúng block vật lý cũ. Thực tế, <strong>SSD / NVMe</strong> có cơ chế wear-leveling (cân bằng hao mòn) tự chuyển lượt ghi sang block flash khác; hệ thống file <strong>copy-on-write (CoW)</strong> như Btrfs, ZFS, Apple APFS; chế độ <strong>journaling</strong> ghi dữ liệu (<code>ext4 data=journal</code>); <strong>snapshot</strong> (LVM, cloud EBS); và <strong>RAID/NFS</strong> đều có thể giữ nguyên bản sao dữ liệu cũ. Khi đi làm thật, hãy bật <strong>mã hoá toàn đĩa</strong> (LUKS trên Linux, FileVault trên macOS) ngay từ đầu, đặt bí mật tạm trên RAM (<code>/dev/shm</code> / <code>tmpfs</code>), và xoay (rotate) mật khẩu/key ngay khi nghi lộ thay vì chỉ tin vào <code>shred</code>.</div>
<p><em>Liên kết bài đã học:</em> Chương 2 (<code>rm</code> và inode) và Chương 10 / 14 (hệ thống file, ổ đĩa, LVM snapshot).</p>

<h3>5. <code>envsubst</code> — điền biến môi trường vào file mẫu cấu hình</h3>
<p><strong>Dùng khi nào lúc đi làm:</strong> dự án Node.js, Spring Boot hay Docker trên <code>labflow-vps</code> luôn có file cấu hình (<code>nginx.conf</code>, <code>docker-compose.yml</code>, manifest Kubernetes) chỉ khác nhau vài giá trị như cổng hay tên miền giữa staging và prod. Thay vì chép tay hai bản hoặc cài Python Jinja2, <code>envsubst</code> (trong gói <code>gettext-base</code>) thay thẳng <code>\$VAR</code> và <code>\${VAR}</code> từ biến môi trường.</p>
<p><strong>Output thật (container Ubuntu 24.04):</strong></p>
<pre><code class="language-bash">export APP_PORT=8080 APP_NAME=labflow
printf 'server { listen \$APP_PORT; server_name \$APP_NAME.test; }\\n' &gt; tpl.conf
cat tpl.conf
envsubst &lt; tpl.conf</code></pre>
<div class="out">server { listen $APP_PORT; server_name $APP_NAME.test; }
server { listen 8080; server_name labflow.test; }</div>
<p><strong>Cách viết an toàn (lệnh để bạn tự chạy — không kèm output):</strong> truyền danh sách biến cho phép nằm trong dấu nháy ĐƠN.</p>
<pre><code class="language-bash"><span class="tok-comment"># Lệnh để bạn tự chạy — giữ nguyên biến của Nginx như \$host và \$uri</span>
export APP_PORT=8080 APP_NAME=labflow
envsubst '\$APP_PORT \$APP_NAME' &lt; nginx.conf.tpl &gt; nginx.conf</code></pre>
<div class="pitfall co-tieu-de"><strong>Ba cái bẫy kinh điển của <code>envsubst</code>:</strong><br>
1) <strong>Xoá sạch biến của Nginx:</strong> chạy <code>envsubst &lt; nginx.conf.tpl</code> không kèm danh sách biến sẽ biến <code>\$host</code>, <code>\$uri</code>, <code>\$remote_addr</code> thành chuỗi rỗng vì shell không có các biến đó — Nginx vỡ cấu hình ngay! Luôn liệt kê rõ biến trong nháy đơn: <code>'\$APP_PORT \$APP_NAME'</code>.<br>
2) <strong>Quên <code>export</code>:</strong> biến shell thường (<code>APP_PORT=8080</code> không có <code>export</code>) không đi vào tiến trình con <code>envsubst</code> nên bị thay thành rỗng.<br>
3) <strong>Ghi đè chính file đầu vào:</strong> <code>envsubst &lt; app.conf &gt; app.conf</code> làm trống <code>app.conf</code> trước khi <code>envsubst</code> kịp đọc (Chương 3). Luôn xuất ra file khác rồi mới <code>mv</code>.</div>
<p><em>Liên kết bài đã học:</em> Chương 3 (chuyển hướng <code>&lt;</code> / <code>&gt;</code>), Chương 8 (biến môi trường &amp; <code>export</code>) và Chương 16 (deploy Nginx/Docker).</p>

<h3>6. <code>wget</code> — tải file, tải tiếp khi rớt mạng và kiểm tra URL</h3>
<p><strong>Dùng khi nào lúc đi làm:</strong> kéo gói cài lớn (JDK/Node tarball, bản sao lưu CSDL, tập dữ liệu) về <code>labflow-vps</code> trên mạng chập chờn có thể tải tiếp (<code>-c</code>), kiểm tra nhanh URL có trả về <code>200 OK</code> mà không lưu file (<code>--spider</code>), hoặc tải nguyên thư mục tài liệu tĩnh.</p>
<p><strong>Output thật (container Ubuntu 24.04):</strong></p>
<pre><code class="language-bash">wget -q -O- --spider -S https://example.com 2&gt;&amp;1 | head -6</code></pre>
<div class="out">  HTTP/1.1 200 OK
  Date: Wed, 25 Nov 2026 11:08:20 GMT
  Content-Type: text/html; charset=utf-8
  Connection: keep-alive
  Server: cloudflare
  last-modified: Tue, 24 Nov 2026 17:35:01 GMT</div>
<p>Ở đây <code>-q</code> tắt thanh tiến độ, <code>-O-</code> tránh tạo file trên đĩa, <code>--spider</code> bảo <code>wget</code> chỉ kiểm tra chứ không tải thân file, còn <code>-S</code> in header phản hồi HTTP (ra stderr nên cần <code>2&gt;&amp;1 | head -6</code>).</p>
<p><strong>Tuỳ chọn hay dùng (lệnh để bạn tự chạy — không kèm output):</strong></p>
<pre><code class="language-bash"><span class="tok-comment"># Tải và đặt tên file lưu (-O hoa)</span>
wget -O jdk.tar.gz https://example.com/jdk.tar.gz
<span class="tok-comment"># Tải tiếp phần dở (-c) và giới hạn tốc độ để không nghẽn VPS</span>
wget -c --limit-rate=5m --tries=5 https://example.com/big-backup.tar.zst</code></pre>
<p><strong><code>wget</code> khác <code>curl</code> ở đâu — khi nào dùng cái nào?</strong></p>
<table>
<tr><th>Tiêu chí</th><th><code>wget</code></th><th><code>curl</code> (Chương 9)</th></tr>
<tr><td>Mặc định</td><td>Tự lưu thành file trên đĩa</td><td>In nội dung ra stdout (phải thêm <code>-O</code> / <code>-o</code> mới lưu)</td></tr>
<tr><td>Thế mạnh</td><td>Tải file lớn, tự thử lại, tải tiếp (<code>-c</code>), tải đệ quy/mirror (<code>-r -np</code>)</td><td>Gọi REST API (<code>-X POST</code>, <code>-H</code>, <code>-d</code>, auth), debug HTTP/TLS, nối ống dẫn</td></tr>
<tr><td>Cài sẵn?</td><td>Thường có trên Linux server; KHÔNG cài sẵn trên macOS (<code>brew install wget</code>)</td><td>Gần như có sẵn mọi nơi (Linux, macOS, Windows 10/11)</td></tr>
<tr><td>Mẹo nhớ nhanh</td><td>Kéo file/tarball về máy chủ</td><td>Test API Node.js / Spring Boot</td></tr>
</table>
<div class="pitfall co-tieu-de"><strong>Đừng nhầm <code>-O</code> hoa với <code>-o</code> thường.</strong> <code>-O file</code> chọn tên file dữ liệu tải về; <code>-o file</code> chỉ chuyển <em>log chạy của wget</em> vào file đó còn file tải về vẫn mang tên gốc. Ngoài ra, tải file về luôn nhớ kiểm checksum bằng <code>sha256sum</code> (Chương 10) và đừng chạy kiểu <code>wget -qO- URL | sudo bash</code> khi chưa đọc nội dung script.</div>
<p><em>Liên kết bài đã học:</em> Chương 9 (<code>curl</code> và HTTP) và Chương 10 (<code>sha256sum</code> kiểm toàn vẹn).</p>

<h3>7. <code>nmap</code> — quét cổng và kiểm tra dịch vụ đang hở trên máy của mình</h3>
<p><strong>Dùng khi nào lúc đi làm:</strong> sau khi dựng <code>ufw</code>/<code>nftables</code> hoặc bật Docker Compose trên <code>labflow-vps</code> (Nginx 80/443, Node.js 3000, Spring 8080, PostgreSQL 5432), bạn tự kiểm tra từ góc nhìn mạng xem cổng CSDL 5432 hay Redis 6379 có lỡ bị hở ra Internet không — vì Docker có thể đi vòng qua <code>ufw</code> nếu bạn ánh xạ <code>0.0.0.0:5432</code> thay vì <code>127.0.0.1:5432</code>.</p>
<p><strong>Output thật (container Ubuntu 24.04):</strong></p>
<pre><code class="language-bash">nmap -sT -p 22,80,443 --open 127.0.0.1 | tail -5</code></pre>
<div class="out">Starting Nmap 7.94SVN ( https://nmap.org ) at 2026-11-25 11:08 UTC
Nmap done: 1 IP address (1 host up) scanned in 0.02 seconds</div>
<p>Vì sao chỉ in 2 dòng mà không có bảng cổng? Do container Ubuntu trần chưa chạy dịch vụ nào ở cổng 22, 80 hay 443, và cờ <code>--open</code> ẩn toàn bộ cổng đóng để chỉ hiện cổng thực sự đang mở. Cờ <code>-sT</code> dùng TCP connect chuẩn nên chạy được mà không cần quyền root.</p>
<p><strong>Các dạng khác (lệnh để bạn tự chạy trên máy/container của chính bạn — không kèm output):</strong></p>
<pre><code class="language-bash"><span class="tok-comment"># Dò tên/phiên bản dịch vụ trên các cổng ứng dụng cục bộ</span>
nmap -sV -p 80,443,3000,5432,8080 127.0.0.1
<span class="tok-comment"># Quét SYN nhanh toàn bộ 65.535 cổng TCP (cần root) trên máy của mình</span>
sudo nmap -sS -p- --open 127.0.0.1</code></pre>
<div class="callout danger"><strong>Giới hạn pháp lý và nghề nghiệp: CHỈ quét máy của chính bạn hoặc hệ thống có văn bản cho phép.</strong> Quét cổng mạng trường học, máy chủ dự án OJT hay bất kỳ trang web nào của người khác khi chưa được phép bị xem là hành vi dò quét xâm nhập (reconnaissance), có thể kích hoạt hệ thống phát hiện xâm nhập (IDS), bị khoá IP/tài khoản, vi phạm kỷ luật công ty và <strong>vi phạm pháp luật</strong>. Khi luyện tập, chỉ nhắm <code>127.0.0.1</code>, container của bạn hoặc VPS cá nhân <code>labflow-vps</code>.</div>
<div class="callout"><strong><code>ss</code> khác <code>nmap</code> thế nào?</strong> <code>ss -tulpn</code> (Chương 9) đứng <em>bên trong</em> server hỏi nhân Linux tiến trình nào đang nghe cổng gì. <code>nmap</code> đứng <em>từ phía mạng</em> kiểm tra xem gói tin có thật sự đi qua được tường lửa và luật NAT của Docker hay không. Nghiệm thu server cần cả hai.</div>
<p><em>Liên kết bài đã học:</em> Chương 9 (<code>ss</code>, <code>nc</code>, <code>ufw</code>, cổng TCP/UDP) và Chương 14 (<code>nftables</code>).</p>

<h3>8. <code>yum</code> — trình quản lý gói họ Red Hat / CentOS (tiền thân của <code>dnf</code>)</h3>
<p><strong>Dùng khi nào lúc đi làm:</strong> VPS cá nhân thường chạy Ubuntu (<code>apt</code>), nhưng khi đi OJT ở FPT Software hoặc làm dự án Java/Spring doanh nghiệp (ngân hàng, khách hàng Nhật/Mỹ), máy chủ thật rất hay chạy <strong>RHEL, CentOS 7, Rocky Linux, AlmaLinux, Oracle Linux hoặc Amazon Linux</strong>. Ở đó không có <code>apt</code> — bạn sẽ gặp <code>yum</code> hoặc <code>dnf</code>.</p>
<p><strong>Mối quan hệ giữa <code>yum</code> và <code>dnf</code>:</strong> <code>yum</code> (Yellowdog Updater, Modified) là trình quản lý gói RPM tiêu chuẩn từ RHEL/CentOS 5 đến 7 và Amazon Linux 2. Từ RHEL 8, Rocky/AlmaLinux 8+, Fedora và Amazon Linux 2023 trở đi, <strong><code>dnf</code></strong> (Dandified YUM) thay thế <code>yum</code> với bộ giải phụ thuộc nhanh hơn và nhẹ RAM hơn. Trên các máy đời mới đó, gõ <code>yum</code> vẫn chạy vì <code>/usr/bin/yum</code> thực chất là liên kết mềm (symlink) trỏ sang <code>dnf</code>.</p>
<p>Vì môi trường ghi output của phụ lục này là container Ubuntu 24.04 nên không có output thật của <code>yum</code>. Dưới đây là <strong>lệnh để bạn tự chạy</strong> trong container vứt đi (<code>docker run --rm -it rockylinux:9 bash</code>) hoặc khi SSH vào server họ RHEL:</p>
<pre><code class="language-bash"><span class="tok-comment"># Lệnh để bạn tự chạy trong container rockylinux:9 hoặc máy chủ họ RHEL/CentOS/Amazon Linux</span>
yum search nginx
yum info nginx
sudo yum install -y nginx
sudo yum update -y
yum list installed | head -20
yum provides '*/envsubst'         <span class="tok-comment"># tìm gói nào chứa lệnh đang thiếu</span>
yum history                       <span class="tok-comment"># xem lịch sử cài/gỡ (hoàn tác bằng: sudo yum history undo ID)</span>
sudo yum clean all</code></pre>
<p><strong>Bảng dịch nhanh từ <code>apt</code> (Chương 10) sang <code>yum</code> / <code>dnf</code>:</strong></p>
<table>
<tr><th>Việc cần làm</th><th>Ubuntu / Debian (<code>apt</code>)</th><th>RHEL / CentOS / Rocky / Amazon Linux (<code>yum</code> / <code>dnf</code>)</th></tr>
<tr><td>Tìm gói</td><td><code>apt search pkg</code></td><td><code>yum search pkg</code></td></tr>
<tr><td>Cài gói</td><td><code>sudo apt install -y pkg</code></td><td><code>sudo yum install -y pkg</code></td></tr>
<tr><td>Gỡ gói</td><td><code>sudo apt remove pkg</code></td><td><code>sudo yum remove pkg</code></td></tr>
<tr><td>Cập nhật hệ thống</td><td><code>sudo apt update &amp;&amp; sudo apt upgrade</code></td><td><code>sudo yum update</code> (<code>dnf upgrade</code>)</td></tr>
<tr><td>Tìm gói chứa một lệnh/file</td><td><code>dpkg -S /usr/bin/envsubst</code></td><td><code>yum provides '*/envsubst'</code></td></tr>
<tr><td>Hoàn tác lần cài vừa rồi</td><td>(gỡ thủ công)</td><td><code>sudo yum history undo ID</code></td></tr>
</table>
<div class="pitfall co-tieu-de"><strong>Tên gói khác Ubuntu và nhiều công cụ nằm trong kho EPEL.</strong> Trên họ RHEL, Apache tên là <code>httpd</code> (không phải <code>apache2</code>), gói header biên dịch có đuôi <code>-devel</code> (<code>openssl-devel</code> thay vì <code>libssl-dev</code>), còn <code>htop</code> hay <code>ncdu</code> thường phải bật thêm kho cộng đồng EPEL trước (<code>sudo yum install -y epel-release</code>).</div>
<p><em>Liên kết bài đã học:</em> Chương 10 (<code>apt</code>, <code>dpkg</code>, <code>dnf</code>, <code>rpm</code>).</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bạn đang kiểm tra một môi trường sạch trước khi deploy bản demo Spring Boot + Nginx lên <code>labflow-vps</code>. Làm mọi bước trong container vứt đi để máy thật hoàn toàn sạch.</p><ol>
<li>Mở container tạm: <code>docker run --rm -it ubuntu:24.04 bash</code>, rồi cài bộ công cụ cần thử: <code>apt-get update &amp;&amp; apt-get install -y gettext-base wget nmap</code>.</li>
<li>Chạy <code>lscpu | head -12</code> và <code>whereis ls bash wget</code>. Ghi lại kiến trúc CPU và số CPU logic.</li>
<li>Chạy <code>export APP_PORT=8080 APP_NAME=labflow</code>, tạo file <code>nginx.conf.tpl</code> có cả <code>\$APP_PORT</code> lẫn biến <code>\$host</code> của Nginx, rồi sinh file bằng <code>envsubst '\$APP_PORT \$APP_NAME' &lt; nginx.conf.tpl &gt; nginx.conf</code>. Kiểm tra <code>\$host</code> vẫn còn nguyên.</li>
<li>Xem header bằng <code>wget -q -O- --spider -S https://example.com 2&gt;&amp;1 | head -6</code>, và quét loopback bằng <code>nmap -sT -p 22,80,443 --open 127.0.0.1</code>.</li>
<li>Tạo user tạm (<code>useradd -m intern1</code>), kiểm bằng <code>id intern1</code>, xoá bằng <code>userdel -r intern1</code> rồi kiểm lại. Tạo <code>/tmp/secret.key</code> và huỷ bằng <code>shred -u -v -n 2 /tmp/secret.key</code>.</li>
<li>(Tuỳ chọn) Chạy <code>docker run --rm -it rockylinux:9 bash</code> rồi thử <code>yum provides '*/envsubst'</code> và <code>yum --version</code> để thấy <code>yum</code> trỏ sang <code>dnf</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>nginx.conf</code> có <code>8080</code>, <code>labflow</code> VÀ giữ nguyên chuỗi <code>\$host</code>; <code>id intern1</code> báo <code>no such user</code>; <code>/tmp/secret.key</code> biến mất; và bạn giải thích được trong một câu vì sao <code>shred</code> không đảm bảo xoá sạch trên SSD.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">whereis (tìm vị trí gói hệ thống)</span><span class="v">Tìm binary, mã nguồn và trang man trong thư mục chuẩn (bỏ qua alias và builtin).</span></div>
  <div class="kv"><span class="k">Logical CPU vs physical core (CPU logic vs nhân vật lý)</span><span class="v">Một nhân vật lý có 2 luồng phần cứng hiện thành 2 CPU logic trong <code>lscpu</code>.</span></div>
  <div class="kv"><span class="k">Orphan file (file mồ côi, <code>-nouser</code>)</span><span class="v">File mang UID không còn tài khoản tương ứng trong <code>/etc/passwd</code> sau khi <code>userdel</code>.</span></div>
  <div class="kv"><span class="k">Wear-leveling / Copy-on-Write (cân bằng hao mòn / ghi bản sao mới)</span><span class="v">Cơ chế của SSD và hệ thống file hiện đại ghi sang block mới thay vì đè tại chỗ, khiến <code>shred</code> không đảm bảo.</span></div>
  <div class="kv"><span class="k">envsubst allowlist (danh sách biến cho phép)</span><span class="v">Chuỗi nháy đơn <code>'\$VAR1 \$VAR2'</code> truyền cho <code>envsubst</code> để không làm hỏng biến <code>\$</code> khác.</span></div>
  <div class="kv"><span class="k">Spider mode (chế độ dò của wget)</span><span class="v">Cờ <code>--spider</code> kiểm tra URL và lấy header mà không tải thân file về đĩa.</span></div>
  <div class="kv"><span class="k">TCP connect scan (quét kết nối TCP, <code>-sT</code>)</span><span class="v">Kiểu quét cổng của <code>nmap</code> dùng kết nối TCP chuẩn, không cần quyền root.</span></div>
  <div class="kv"><span class="k">EPEL (kho gói mở rộng RHEL)</span><span class="v">Extra Packages for Enterprise Linux — kho cộng đồng bổ sung công cụ như <code>htop</code> cho RHEL/Rocky/CentOS.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Dùng <code>whereis</code> để tìm binary/man trong thư mục chuẩn, nhưng dùng <code>type -a</code> / <code>command -v</code> khi có alias, builtin hoặc NVM/SDKMAN.</li>
<li>Đọc <code>lscpu</code> để biết kiến trúc và nhân/luồng, và nhớ container vẫn thấy số CPU của máy host chứ không phải hạn mức cgroup.</li>
<li>Trước khi chạy <code>userdel -r</code> trên server thật: khoá tài khoản, sao lưu <code>/home</code>, kiểm tra tiến trình/cron, rồi tìm file mồ côi bằng <code>find / -nouser</code>.</li>
<li><code>shred -u</code> ghi đè và che tên file tốt trên HDD cũ, nhưng KHÔNG đảm bảo trên SSD, hệ thống file CoW hay journaling — hãy dùng mã hoá toàn đĩa.</li>
<li>Luôn truyền danh sách biến trong nháy đơn cho <code>envsubst</code> khi sinh file Nginx kẻo xoá nhầm <code>\$host</code> và <code>\$uri</code>.</li>
<li>Tải file lớn/tải tiếp chọn <code>wget</code>, gọi REST API chọn <code>curl</code>; chỉ chạy <code>nmap</code> lên máy của mình; và dùng <code>yum</code>/<code>dnf</code> trên server họ Red Hat.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/man1/shred.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">man7.org — shred(1)</span><span class="lc-sub">Đọc mục CAUTION giải thích chi tiết vì sao journaling, CoW, RAID và SSD khiến ghi đè tại chỗ không còn chắc chắn.</span></span>
</a>
<a class="link-card" href="https://www.gnu.org/software/gettext/manual/html_node/envsubst-Invocation.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">GNU gettext — Hướng dẫn envsubst</span><span class="lc-sub">Tài liệu chính thức về tham số <code>SHELL-FORMAT</code> để giới hạn biến được thay thế.</span></span>
</a>
<a class="link-card" href="https://nmap.org/book/man.html" target="_blank" rel="noopener">
  <span class="lc-ico">🛡</span>
  <span class="lc-body"><span class="lc-title">Nmap Reference Guide</span><span class="lc-sub">Tài liệu chính thức về các chế độ quét (<code>-sT</code>, <code>-sS</code>, <code>-sV</code>), chỉ định cổng và lưu ý pháp lý.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện trên Code Lab</span><span class="lc-sub">Củng cố phản xạ phân quyền, mạng và viết script trên track Linux &amp; Bash.</span></span>
</a>

<p class="note-ct"><strong>Nếu chỉ nhớ hai luật an toàn từ Bài 17.1:</strong> luôn đặt danh sách biến trong nháy đơn khi gọi <code>envsubst '\$APP_PORT'</code> để không làm sập Nginx, và CHỈ trỏ <code>nmap</code> vào máy của chính bạn (<code>127.0.0.1</code> hoặc <code>labflow-vps</code>).</p>
</div>
`,
    },

    /* ─────────────────────────── 17.2 ─────────────────────────── */
    {
      title: '17.2 — Situation-based cheat sheet (172 commands)|||17.2 — Bảng tra nhanh theo tình huống (172 lệnh)',
      slug: 'lnx-17-2-bang-tra-nhanh',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bảng tra cứu thực chiến gồm 172 mục lệnh Linux & Bash phổ biến nhất xếp theo 11 nhóm tình huống đi làm: "Tôi muốn…" → lệnh mẫu → học ở chương nào của khoá.',
      content: `
<div class="ml-en">
<span class="eyebrow">Appendix · Lesson 17.2</span>
<h2>Situation-based command cheat sheet (172 entries)</h2>
<p class="lead">At work you never think “what does flag <code>-z</code> of command X do?” — you think “I want to see what is eating disk space on <code>labflow-vps</code>” or “I want to know which process holds port 8080”. Bookmark this lesson as your desk reference: 172 everyday command entries grouped by 11 real situations, each mapped to a ready-to-adapt example and the chapter where the course explains it in depth.</p>
<div class="callout"><strong>Note:</strong> every example below is a syntax template for you to adapt and run on your own machine or throwaway container (no command output is shown here).</div>

<h3>1. Navigation &amp; finding files (18 commands)</h3>
<table>
<tr><th>I want to…</th><th>Example command</th><th>Chapter</th></tr>
<tr><td>See my current working directory</td><td><code>pwd</code></td><td>Ch. 1</td></tr>
<tr><td>Jump to a project folder (or previous folder)</td><td><code>cd /srv/labflow</code> · <code>cd -</code></td><td>Ch. 1</td></tr>
<tr><td>List files including hidden ones, sizes and dates</td><td><code>ls -laht</code></td><td>Ch. 1</td></tr>
<tr><td>View a folder hierarchy up to 2 levels deep</td><td><code>tree -L 2 -a</code></td><td>Ch. 1</td></tr>
<tr><td>Create nested folders without failing if they exist</td><td><code>mkdir -p /srv/labflow/logs</code></td><td>Ch. 2</td></tr>
<tr><td>Remove an empty directory safely</td><td><code>rmdir empty-dir</code></td><td>Ch. 2</td></tr>
<tr><td>Create an empty file or refresh its timestamp</td><td><code>touch .env.example</code></td><td>Ch. 2</td></tr>
<tr><td>Copy a directory preserving permissions and timestamps</td><td><code>cp -a src/ dst/</code></td><td>Ch. 2</td></tr>
<tr><td>Move or rename a file/directory</td><td><code>mv app.log app.log.1</code></td><td>Ch. 2</td></tr>
<tr><td>Delete files or a directory tree (no trash bin!)</td><td><code>rm -ri build/</code></td><td>Ch. 2</td></tr>
<tr><td>Create a symbolic link (e.g. Nginx sites-enabled)</td><td><code>ln -s /etc/nginx/sites-available/app /etc/nginx/sites-enabled/</code></td><td>Ch. 2</td></tr>
<tr><td>Find logs larger than 50 MB modified in the last 24h</td><td><code>find /var/log -name '*.log' -size +50M -mtime -1</code></td><td>Ch. 2</td></tr>
<tr><td>Find a filename instantly via the indexed database</td><td><code>locate nginx.conf</code></td><td>Ch. 2</td></tr>
<tr><td>Inspect exact size, permissions, inode and timestamps</td><td><code>stat deploy.sh</code></td><td>Ch. 1–2</td></tr>
<tr><td>Detect real file type and CRLF line endings</td><td><code>file deploy.sh</code></td><td>Ch. 1 · 15</td></tr>
<tr><td>Resolve symlinks to a canonical absolute path</td><td><code>realpath ./current/app.jar</code></td><td>Ch. 2</td></tr>
<tr><td>Print what a symbolic link points to (or resolve <code>-f</code>)</td><td><code>readlink -f /usr/bin/java</code></td><td>Ch. 2 · 7</td></tr>
<tr><td>Locate system binary, source and man pages of a command</td><td><code>whereis nginx bash</code></td><td>Ch. 17</td></tr>
</table>

<h3>2. Viewing &amp; transforming text (22 commands)</h3>
<table>
<tr><th>I want to…</th><th>Example command</th><th>Chapter</th></tr>
<tr><td>Print a small file (or show hidden tabs/CRLF with <code>-A</code>)</td><td><code>cat -A deploy.sh</code></td><td>Ch. 3 · 15</td></tr>
<tr><td>Print lines in reverse order (last line first)</td><td><code>tac app.log | head -20</code></td><td>Ch. 3</td></tr>
<tr><td>Page through a huge log file and search with <code>/</code></td><td><code>less +G /var/log/syslog</code></td><td>Ch. 1 · 3</td></tr>
<tr><td>Show the first 20 lines of a file or pipe</td><td><code>head -n 20 app.log</code></td><td>Ch. 3</td></tr>
<tr><td>Follow a live log as new lines arrive</td><td><code>tail -n 50 -f /var/log/app.log</code></td><td>Ch. 3</td></tr>
<tr><td>Number non-empty lines of a file</td><td><code>nl -ba config.yml</code></td><td>Ch. 3</td></tr>
<tr><td>Count lines, words or bytes</td><td><code>wc -l access.log</code></td><td>Ch. 3</td></tr>
<tr><td>Search text recursively with line numbers (ignore case)</td><td><code>grep -rn -i 'OutOfMemory' /var/log/</code></td><td>Ch. 3</td></tr>
<tr><td>Replace text in a stream or edit a file in place</td><td><code>sed -i.bak 's/http:/https:/g' app.conf</code></td><td>Ch. 3 · 15</td></tr>
<tr><td>Extract columns and compute sums from structured text</td><td><code>awk '{sum+=\$9} END{print sum}' access.log</code></td><td>Ch. 3</td></tr>
<tr><td>Slice specific fields by delimiter (e.g. CSV or <code>:</code>)</td><td><code>cut -d: -f1,7 /etc/passwd</code></td><td>Ch. 3</td></tr>
<tr><td>Sort lines numerically or by human sizes (<code>-h</code>)</td><td><code>sort -k2 -nr counts.txt</code></td><td>Ch. 3</td></tr>
<tr><td>Count duplicate adjacent lines (always after <code>sort</code>)</td><td><code>sort ips.txt | uniq -c | sort -nr</code></td><td>Ch. 3</td></tr>
<tr><td>Translate or delete characters (e.g. strip <code>\\r</code>)</td><td><code>tr -d '\\r' &lt; win.sh &gt; unix.sh</code></td><td>Ch. 3</td></tr>
<tr><td>Merge lines of two files side by side</td><td><code>paste hosts.txt ports.txt</code></td><td>Ch. 3</td></tr>
<tr><td>Compare two sorted lists (unique to A, B, or common)</td><td><code>comm -23 old.txt new.txt</code></td><td>Ch. 3 · 17</td></tr>
<tr><td>Align delimited text into clean terminal columns</td><td><code>column -t -s, services.csv</code></td><td>Ch. 3 · 17</td></tr>
<tr><td>See line-by-line differences between two configs</td><td><code>diff -u prod.conf staging.conf</code></td><td>Ch. 3</td></tr>
<tr><td>Apply a unified diff patch file</td><td><code>patch -p1 &lt; fix.patch</code></td><td>Ch. 3</td></tr>
<tr><td>See output on screen AND save it to a file at once</td><td><code>./deploy.sh 2&gt;&amp;1 | tee -a deploy.log</code></td><td>Ch. 3</td></tr>
<tr><td>Query, filter and pretty-print JSON from APIs</td><td><code>curl -s http://localhost:8080/health | jq '.status'</code></td><td>Ch. 3 · 9</td></tr>
<tr><td>Convert Windows CRLF line endings to Linux LF</td><td><code>dos2unix deploy.sh</code></td><td>Ch. 15</td></tr>
</table>

<h3>3. Permissions &amp; users (17 commands)</h3>
<table>
<tr><th>I want to…</th><th>Example command</th><th>Chapter</th></tr>
<tr><td>Make a script executable or lock down a private key</td><td><code>chmod +x deploy.sh</code> · <code>chmod 600 ~/.ssh/id_ed25519</code></td><td>Ch. 4</td></tr>
<tr><td>Change file owner and group recursively</td><td><code>sudo chown -R appuser:appgroup /srv/labflow</code></td><td>Ch. 4</td></tr>
<tr><td>Change only the group ownership of a directory</td><td><code>sudo chgrp -R devteam /srv/shared</code></td><td>Ch. 4</td></tr>
<tr><td>Check or set default permission mask for new files</td><td><code>umask 027</code></td><td>Ch. 4</td></tr>
<tr><td>Show my UID, GID and all group memberships</td><td><code>id</code> · <code>id deploy</code></td><td>Ch. 4</td></tr>
<tr><td>Print the effective current username</td><td><code>whoami</code></td><td>Ch. 4</td></tr>
<tr><td>See who is currently logged in and what they run</td><td><code>w</code></td><td>Ch. 4</td></tr>
<tr><td>List logged-in user sessions briefly</td><td><code>who</code></td><td>Ch. 4</td></tr>
<tr><td>List groups a user belongs to</td><td><code>groups deploy</code></td><td>Ch. 4</td></tr>
<tr><td>Switch to another user’s login shell</td><td><code>su - deploy</code></td><td>Ch. 4</td></tr>
<tr><td>Run a single command as root or another user</td><td><code>sudo -u postgres psql</code></td><td>Ch. 4</td></tr>
<tr><td>Edit <code>/etc/sudoers</code> with automatic syntax checking</td><td><code>sudo visudo</code></td><td>Ch. 4</td></tr>
<tr><td>Create a new user with home directory and bash shell</td><td><code>sudo useradd -m -s /bin/bash intern1</code></td><td>Ch. 4</td></tr>
<tr><td>Add a user to a supplementary group (keep existing!)</td><td><code>sudo usermod -aG docker deploy</code></td><td>Ch. 4</td></tr>
<tr><td>Delete a user account and its home directory</td><td><code>sudo userdel -r intern1</code></td><td>Ch. 17</td></tr>
<tr><td>Change a password or lock a password login</td><td><code>sudo passwd deploy</code> · <code>sudo passwd -l intern1</code></td><td>Ch. 4</td></tr>
<tr><td>Inspect or grant fine-grained ACL permissions</td><td><code>setfacl -m u:deploy:rw /var/log/app.log</code> · <code>getfacl /var/log/app.log</code></td><td>Ch. 4</td></tr>
</table>

<h3>4. Processes &amp; signals (16 commands)</h3>
<table>
<tr><th>I want to…</th><th>Example command</th><th>Chapter</th></tr>
<tr><td>List all running processes with PID, CPU, RAM and command</td><td><code>ps auxf</code></td><td>Ch. 5</td></tr>
<tr><td>Watch live CPU and memory usage in a built-in monitor</td><td><code>top</code></td><td>Ch. 5</td></tr>
<tr><td>Monitor processes interactively with tree &amp; filters</td><td><code>htop</code></td><td>Ch. 5</td></tr>
<tr><td>Find PIDs matching a process name or full command line</td><td><code>pgrep -af java</code></td><td>Ch. 5</td></tr>
<tr><td>Send a signal to processes matching a pattern</td><td><code>pkill -TERM -f 'node server.js'</code></td><td>Ch. 5</td></tr>
<tr><td>Gracefully stop a PID (or force kill with <code>-9</code> last)</td><td><code>kill -TERM 1234</code> · <code>kill -9 1234</code></td><td>Ch. 5</td></tr>
<tr><td>Kill all processes by exact process name</td><td><code>killall -HUP nginx</code></td><td>Ch. 5</td></tr>
<tr><td>List background jobs started in the current shell</td><td><code>jobs -l</code></td><td>Ch. 5</td></tr>
<tr><td>Resume a stopped job in the background / foreground</td><td><code>bg %1</code> · <code>fg %1</code></td><td>Ch. 5</td></tr>
<tr><td>Run a command immune to SSH hangup (SIGHUP)</td><td><code>nohup java -jar app.jar &gt; app.log 2&gt;&amp;1 &amp;</code></td><td>Ch. 5</td></tr>
<tr><td>Start a heavy job with lower CPU priority</td><td><code>nice -n 10 tar -cf backup.tar /srv/data</code></td><td>Ch. 5</td></tr>
<tr><td>Change priority of an already running PID</td><td><code>sudo renice +10 -p 1234</code></td><td>Ch. 5</td></tr>
<tr><td>Abort a command if it runs longer than 30 seconds</td><td><code>timeout 30s curl -sf http://localhost:8080/health</code></td><td>Ch. 5 · 15</td></tr>
<tr><td>Re-run a command every 2 seconds and highlight diffs</td><td><code>watch -n 2 -d 'ss -s'</code></td><td>Ch. 5</td></tr>
<tr><td>Display parent-child process tree</td><td><code>pstree -ap</code></td><td>Ch. 5</td></tr>
<tr><td>Check resource limits (e.g. max open file descriptors)</td><td><code>ulimit -n</code> · <code>ulimit -a</code></td><td>Ch. 5</td></tr>
</table>

<h3>5. Disk, storage &amp; packages (16 commands)</h3>
<table>
<tr><th>I want to…</th><th>Example command</th><th>Chapter</th></tr>
<tr><td>Check free disk space and free inodes per mount</td><td><code>df -h</code> · <code>df -i</code></td><td>Ch. 10</td></tr>
<tr><td>Measure size of each top-level folder in a directory</td><td><code>du -sh /var/* | sort -h</code></td><td>Ch. 10</td></tr>
<tr><td>Interactively drill down into what is filling the disk</td><td><code>ncdu /var</code></td><td>Ch. 10</td></tr>
<tr><td>List block devices, partitions and mount points</td><td><code>lsblk -f</code></td><td>Ch. 10</td></tr>
<tr><td>Show filesystem UUIDs for <code>/etc/fstab</code></td><td><code>sudo blkid</code></td><td>Ch. 10</td></tr>
<tr><td>Mount or cleanly unmount a disk partition</td><td><code>sudo mount /dev/sdb1 /mnt/data</code> · <code>sudo umount /mnt/data</code></td><td>Ch. 10</td></tr>
<tr><td>Inspect partition tables on disks</td><td><code>sudo fdisk -l</code></td><td>Ch. 10</td></tr>
<tr><td>Format a new partition as ext4</td><td><code>sudo mkfs.ext4 /dev/sdb1</code></td><td>Ch. 10</td></tr>
<tr><td>Check and repair an unmounted filesystem</td><td><code>sudo fsck -n /dev/sdb1</code></td><td>Ch. 10</td></tr>
<tr><td>Check or enable swap space</td><td><code>swapon --show</code></td><td>Ch. 10</td></tr>
<tr><td>Copy raw blocks or create a fixed-size test file</td><td><code>dd if=/dev/zero of=/tmp/test.img bs=1M count=64 status=progress</code></td><td>Ch. 10</td></tr>
<tr><td>Update index and install/remove packages on Ubuntu/Debian</td><td><code>sudo apt update &amp;&amp; sudo apt install -y jq</code></td><td>Ch. 10</td></tr>
<tr><td>Query installed <code>.deb</code> packages or find who owns a file</td><td><code>dpkg -S /usr/bin/envsubst</code></td><td>Ch. 10</td></tr>
<tr><td>Install/manage packages on modern RHEL/Rocky/Fedora</td><td><code>sudo dnf install -y nginx</code></td><td>Ch. 10 · 17</td></tr>
<tr><td>Manage packages on RHEL/CentOS 7 / Amazon Linux (<code>dnf</code> predecessor)</td><td><code>sudo yum install -y nginx</code> · <code>yum provides '*/envsubst'</code></td><td>Ch. 17</td></tr>
<tr><td>Inspect installed RPM packages or files inside one</td><td><code>rpm -qa | grep java</code> · <code>rpm -ql nginx</code></td><td>Ch. 10</td></tr>
</table>

<h3>6. Networking &amp; remote hosts (18 commands)</h3>
<table>
<tr><th>I want to…</th><th>Example command</th><th>Chapter</th></tr>
<tr><td>View IP addresses, interfaces and routing table</td><td><code>ip -br addr</code> · <code>ip route</code></td><td>Ch. 9</td></tr>
<tr><td>See which process is listening on which TCP/UDP port</td><td><code>sudo ss -tulpn</code></td><td>Ch. 9</td></tr>
<tr><td>Test basic ICMP reachability and round-trip latency</td><td><code>ping -c 4 example.com</code></td><td>Ch. 9</td></tr>
<tr><td>Trace network hops to a remote server</td><td><code>traceroute example.com</code></td><td>Ch. 9</td></tr>
<tr><td>Combine ping and traceroute continuously to spot packet loss</td><td><code>mtr -rwc 20 example.com</code></td><td>Ch. 9</td></tr>
<tr><td>Query DNS records in detail (A, AAAA, MX, TXT)</td><td><code>dig +short example.com A</code></td><td>Ch. 9</td></tr>
<tr><td>Quickly look up a domain name (works on Windows too)</td><td><code>nslookup example.com</code></td><td>Ch. 9</td></tr>
<tr><td>Do a concise DNS or reverse-DNS lookup</td><td><code>host example.com</code></td><td>Ch. 9</td></tr>
<tr><td>Call a REST API, send JSON and inspect HTTP headers</td><td><code>curl -fsS -H 'Content-Type: application/json' http://localhost:8080/health</code></td><td>Ch. 9</td></tr>
<tr><td>Download a file with resume or inspect headers via spider</td><td><code>wget -c https://example.com/app.tar.gz</code></td><td>Ch. 17</td></tr>
<tr><td>Connect securely to a remote Linux server</td><td><code>ssh deploy@labflow-vps</code></td><td>Ch. 9</td></tr>
<tr><td>Generate a modern Ed25519 SSH key pair</td><td><code>ssh-keygen -t ed25519 -C 'deploy@labflow'</code></td><td>Ch. 9</td></tr>
<tr><td>Install your public SSH key on a remote server</td><td><code>ssh-copy-id deploy@labflow-vps</code></td><td>Ch. 9</td></tr>
<tr><td>Copy a file or folder over SSH</td><td><code>scp app.jar deploy@labflow-vps:/srv/labflow/</code></td><td>Ch. 9</td></tr>
<tr><td>Open an interactive file transfer session over SSH</td><td><code>sftp deploy@labflow-vps</code></td><td>Ch. 9</td></tr>
<tr><td>Test if a specific TCP port accepts connections</td><td><code>nc -zv labflow-vps 443</code></td><td>Ch. 9</td></tr>
<tr><td>Capture live network packets on an interface/port</td><td><code>sudo tcpdump -ni any port 8080 -c 20</code></td><td>Ch. 9 · 12</td></tr>
<tr><td>Scan open ports on your OWN host to verify firewall rules</td><td><code>nmap -sT -p 22,80,443,5432 --open 127.0.0.1</code></td><td>Ch. 17</td></tr>
</table>

<h3>7. Services, scheduling &amp; logs (9 commands)</h3>
<table>
<tr><th>I want to…</th><th>Example command</th><th>Chapter</th></tr>
<tr><td>Start, restart, enable or inspect a systemd service</td><td><code>sudo systemctl restart labflow-api &amp;&amp; systemctl status labflow-api</code></td><td>Ch. 11</td></tr>
<tr><td>Follow systemd logs for one service since 1 hour ago</td><td><code>journalctl -u labflow-api --since '1 hour ago' -f</code></td><td>Ch. 11</td></tr>
<tr><td>Check boot time and slowest systemd units</td><td><code>systemd-analyze blame | head -10</code></td><td>Ch. 11</td></tr>
<tr><td>Edit or list recurring scheduled jobs</td><td><code>crontab -e</code> · <code>crontab -l</code></td><td>Ch. 11</td></tr>
<tr><td>Schedule a one-off command to run once later</td><td><code>echo '/srv/backup.sh' | at 02:00</code></td><td>Ch. 11</td></tr>
<tr><td>Test log rotation rules without actually rotating yet</td><td><code>sudo logrotate -d /etc/logrotate.d/nginx</code></td><td>Ch. 10</td></tr>
<tr><td>Send a message from a bash script to syslog/journald</td><td><code>logger -t deploy 'Release v1.4 completed'</code></td><td>Ch. 7 · 11</td></tr>
<tr><td>Read kernel ring buffer (OOM killer, disk/USB errors)</td><td><code>sudo dmesg -T | tail -30</code></td><td>Ch. 12</td></tr>
<tr><td>Manage LaunchAgents / services on macOS</td><td><code>launchctl print gui/\$(id -u)/com.labflow.backup</code></td><td>Ch. 15</td></tr>
</table>

<h3>8. Compression, archives &amp; backups (9 commands)</h3>
<table>
<tr><th>I want to…</th><th>Example command</th><th>Chapter</th></tr>
<tr><td>Bundle and compress/extract a folder with <code>tar</code></td><td><code>tar -czf backup.tar.gz /srv/labflow</code> · <code>tar -xf backup.tar.gz</code></td><td>Ch. 2</td></tr>
<tr><td>Compress or decompress a single file with gzip</td><td><code>gzip -k app.log</code> · <code>gunzip app.log.gz</code></td><td>Ch. 2</td></tr>
<tr><td>Compress/decompress with bzip2</td><td><code>bzip2 -dk dump.sql.bz2</code></td><td>Ch. 2</td></tr>
<tr><td>Get maximum compression ratio with xz</td><td><code>tar -cJf release.tar.xz dist/</code></td><td>Ch. 2</td></tr>
<tr><td>Compress/decompress very fast with modern zstd</td><td><code>tar --zstd -cf backup.tar.zst /srv/data</code></td><td>Ch. 2</td></tr>
<tr><td>Create a Windows-friendly <code>.zip</code> archive</td><td><code>zip -r build.zip dist/</code></td><td>Ch. 2</td></tr>
<tr><td>List or extract a <code>.zip</code> archive</td><td><code>unzip -l build.zip</code> · <code>unzip build.zip -d out/</code></td><td>Ch. 2</td></tr>
<tr><td>Sync only changed files locally or over SSH</td><td><code>rsync -avz --delete dist/ deploy@labflow-vps:/srv/www/</code></td><td>Ch. 9</td></tr>
<tr><td>Keep a terminal session alive across SSH disconnects</td><td><code>tmux new -s deploy</code> · <code>tmux attach -t deploy</code></td><td>Ch. 5</td></tr>
</table>

<h3>9. Security &amp; integrity (11 commands)</h3>
<table>
<tr><th>I want to…</th><th>Example command</th><th>Chapter</th></tr>
<tr><td>Verify a downloaded archive’s SHA-256 checksum</td><td><code>sha256sum -c SHA256SUMS</code></td><td>Ch. 10</td></tr>
<tr><td>Compute a quick MD5 digest (integrity only, not crypto!)</td><td><code>md5sum app.jar</code></td><td>Ch. 10</td></tr>
<tr><td>Encrypt a backup or verify a release signature with GPG</td><td><code>gpg --verify release.tar.gz.asc release.tar.gz</code></td><td>Ch. 10</td></tr>
<tr><td>Inspect a website’s TLS certificate expiry date</td><td><code>openssl s_client -connect example.com:443 &lt;/dev/null 2&gt;/dev/null | openssl x509 -noout -dates</code></td><td>Ch. 9 · 10</td></tr>
<tr><td>Overwrite and unlink a sensitive file (HDD caveat applies!)</td><td><code>shred -u -v -n 2 /tmp/secret.key</code></td><td>Ch. 17</td></tr>
<tr><td>Configure Ubuntu’s uncomplicated firewall</td><td><code>sudo ufw allow 443/tcp &amp;&amp; sudo ufw status verbose</code></td><td>Ch. 9</td></tr>
<tr><td>Inspect modern Linux nftables firewall ruleset</td><td><code>sudo nft list ruleset</code></td><td>Ch. 14</td></tr>
<tr><td>Inspect legacy iptables rules (including Docker NAT)</td><td><code>sudo iptables -L -n -v</code></td><td>Ch. 9 · 14</td></tr>
<tr><td>Make a critical config immutable even against root <code>rm</code></td><td><code>sudo chattr +i /etc/resolv.conf</code> · <code>lsattr /etc/resolv.conf</code></td><td>Ch. 4</td></tr>
<tr><td>Check SELinux enforcement mode on RHEL/Fedora</td><td><code>sestatus</code> · <code>getenforce</code></td><td>Ch. 14</td></tr>
<tr><td>Cache unlocked SSH private keys in memory for a session</td><td><code>eval "\$(ssh-agent -s)" &amp;&amp; ssh-add ~/.ssh/id_ed25519</code></td><td>Ch. 9</td></tr>
</table>

<h3>10. Performance &amp; diagnostics (15 commands)</h3>
<table>
<tr><th>I want to…</th><th>Example command</th><th>Chapter</th></tr>
<tr><td>Check how long the server has been up and load averages</td><td><code>uptime</code></td><td>Ch. 12</td></tr>
<tr><td>Check total, used and available RAM (don’t panic at buff/cache)</td><td><code>free -h</code></td><td>Ch. 12</td></tr>
<tr><td>Watch CPU, memory, swap and I/O bottlenecks every second</td><td><code>vmstat 1 5</code></td><td>Ch. 12</td></tr>
<tr><td>Check disk I/O utilization and await latency</td><td><code>iostat -xz 1 5</code></td><td>Ch. 12</td></tr>
<tr><td>Inspect per-CPU usage to spot a single-threaded hotspot</td><td><code>mpstat -P ALL 1 3</code></td><td>Ch. 12</td></tr>
<tr><td>Review historical CPU/RAM/network metrics from sysstat</td><td><code>sar -u 1 5</code></td><td>Ch. 12</td></tr>
<tr><td>See which process is hammering disk I/O right now</td><td><code>sudo iotop -o</code></td><td>Ch. 12</td></tr>
<tr><td>List open files or find which PID owns port 3000</td><td><code>sudo lsof -i :3000</code></td><td>Ch. 5 · 12</td></tr>
<tr><td>See which processes use a file or mount blocking <code>umount</code></td><td><code>fuser -mv /mnt/data</code></td><td>Ch. 5 · 10</td></tr>
<tr><td>Trace system calls of a mysterious failing binary</td><td><code>strace -f -e trace=file ./my-tool</code></td><td>Ch. 12</td></tr>
<tr><td>Profile CPU hotspots on Linux production binaries</td><td><code>sudo perf top</code></td><td>Ch. 14</td></tr>
<tr><td>Inspect CPU architecture, cores and threads</td><td><code>lscpu | head -12</code></td><td>Ch. 17</td></tr>
<tr><td>Print kernel name, version and hardware architecture</td><td><code>uname -a</code></td><td>Ch. 12 · 15</td></tr>
<tr><td>Read or tune live Linux kernel parameters</td><td><code>sysctl net.core.somaxconn</code></td><td>Ch. 12 · 14</td></tr>
<tr><td>Inspect PCI hardware or USB devices attached to the host</td><td><code>lspci</code> · <code>lsusb</code></td><td>Ch. 12</td></tr>
</table>

<h3>11. Scripting, environment &amp; utilities (21 commands)</h3>
<table>
<tr><th>I want to…</th><th>Example command</th><th>Chapter</th></tr>
<tr><td>Print formatted text reliably (prefer over <code>echo</code> in scripts)</td><td><code>printf '%s=%s\\n' PORT 8080</code></td><td>Ch. 6</td></tr>
<tr><td>Read user input or parse lines safely in a loop</td><td><code>IFS= read -r line</code></td><td>Ch. 6</td></tr>
<tr><td>List all exported environment variables or run with clean env</td><td><code>env</code> · <code>printenv PATH</code></td><td>Ch. 8</td></tr>
<tr><td>Export a variable to child processes / remove a variable</td><td><code>export NODE_ENV=production</code> · <code>unset DEBUG</code></td><td>Ch. 8</td></tr>
<tr><td>Substitute exported env vars into a config template</td><td><code>envsubst '\$APP_PORT \$APP_NAME' &lt; tpl.conf &gt; app.conf</code></td><td>Ch. 17</td></tr>
<tr><td>Create or inspect shell command shortcuts</td><td><code>alias ll='ls -lah'</code></td><td>Ch. 8</td></tr>
<tr><td>Check whether a name is an alias, builtin, function or file</td><td><code>type -a ls cd</code></td><td>Ch. 1 · 8 · 17</td></tr>
<tr><td>Check in a script whether a required tool is installed</td><td><code>command -v jq &gt;/dev/null || exit 1</code></td><td>Ch. 7 · 8</td></tr>
<tr><td>Run a command on every line from stdin (even in parallel <code>-P</code>)</td><td><code>find . -name '*.log' -print0 | xargs -0 -r rm</code></td><td>Ch. 3 · 13</td></tr>
<tr><td>Format timestamps for log filenames or backups</td><td><code>date -u +'%Y-%m-%dT%H:%M:%SZ'</code></td><td>Ch. 7 · 15</td></tr>
<tr><td>Pause a retry loop for N seconds</td><td><code>sleep 5</code></td><td>Ch. 7</td></tr>
<tr><td>Measure real, user and sys execution time of a command</td><td><code>time npm run build</code></td><td>Ch. 5</td></tr>
<tr><td>Do floating-point math inside bash scripts</td><td><code>echo 'scale=2; 75 / 120' | bc</code></td><td>Ch. 6</td></tr>
<tr><td>Generate a sequence of numbers</td><td><code>seq -w 1 10</code></td><td>Ch. 6</td></tr>
<tr><td>Create a secure temporary file or directory</td><td><code>tmp=\$(mktemp)</code></td><td>Ch. 7</td></tr>
<tr><td>Split a path into filename or parent directory</td><td><code>basename /srv/app/run.sh</code> · <code>dirname /srv/app/run.sh</code></td><td>Ch. 7</td></tr>
<tr><td>Prevent two cron runs of the same script from overlapping</td><td><code>flock -n /tmp/backup.lock /srv/backup.sh</code></td><td>Ch. 7 · 11</td></tr>
<tr><td>Lint a bash script for quoting and portability bugs</td><td><code>shellcheck deploy.sh</code></td><td>Ch. 7</td></tr>
<tr><td>Open the manual page (specify section 1, 5 or 8 when needed)</td><td><code>man 5 crontab</code></td><td>Ch. 1 · 17</td></tr>
<tr><td>Search manual page descriptions by keyword</td><td><code>apropos 'archive'</code></td><td>Ch. 1 · 17</td></tr>
<tr><td>Check/change system hostname or timezone</td><td><code>hostnamectl</code> · <code>timedatectl</code></td><td>Ch. 8 · 9</td></tr>
</table>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> it is your first week of OJT and your mentor drops five quick tasks in team chat. Using ONLY the tables above (no web search), pick the exact command for each task and test the safe ones in a scratch folder <code>~/thu-linux/tra17</code> or an <code>ubuntu:24.04</code> container:</p><ol>
<li>Find every <code>.log</code> file under <code>/var/log</code> larger than 10 MB modified within the last 2 days.</li>
<li>Check which process is holding TCP port <code>8080</code> and inspect its parent-child tree.</li>
<li>Create a compressed archive of <code>~/thu-linux/tra17</code> using <code>tar</code> + <code>gzip</code>, then verify its SHA-256 hash.</li>
<li>Compare two sorted text files <code>a.txt</code> and <code>b.txt</code> to print only lines present in <code>a.txt</code>.</li>
<li>Check available RAM (not counting reclaimable cache as “full”), disk free space, and disk free inodes in one line.</li>
</ol>
<p><strong>Done when:</strong> you wrote and ran all five commands from the situation tables without opening Google, and you can name the chapter to revisit if you forget a flag for any of them.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Situation-first lookup</span><span class="v">Indexing commands by the problem you need to solve (“I want to…”) instead of alphabetical order.</span></div>
  <div class="kv"><span class="k">Inode exhaustion (<code>df -i</code>)</span><span class="v">A disk can refuse new files even with free gigabytes when all inode slots are consumed by millions of tiny files.</span></div>
  <div class="kv"><span class="k">Idempotent flag (<code>-p</code>, <code>-f</code>, <code>-r</code>)</span><span class="v">Options like <code>mkdir -p</code> or <code>xargs -r</code> that let scripts re-run safely without failing on empty or existing state.</span></div>
  <div class="kv"><span class="k">Lock file (<code>flock</code>)</span><span class="v">Advisory file lock that stops overlapping cron runs from corrupting backups or deploys.</span></div>
  <div class="kv"><span class="k">Canonical path (<code>realpath</code>)</span><span class="v">The single absolute path after resolving all <code>..</code> segments and symbolic links.</span></div>
  <div class="kv"><span class="k">Non-destructive check</span><span class="v">Read-only flags like <code>logrotate -d</code>, <code>fsck -n</code> or <code>wget --spider</code> that preview before changing anything.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>You do not need to memorize 172 commands by heart — you need to recognize the 11 problem categories and know where to look.</li>
<li>Always reach for read-only inspection first (<code>df</code>, <code>ss</code>, <code>ps</code>, <code>journalctl</code>, <code>stat</code>) before running state-changing commands.</li>
<li>Every row maps back to a course chapter (Ch. 1–17) so you can jump straight to the full explanation and edge cases.</li>
<li>Combine small commands through pipes (<code>find</code> + <code>xargs</code>, <code>sort</code> + <code>uniq -c</code>, <code>curl</code> + <code>jq</code>) rather than hunting for one giant tool.</li>
<li>Keep this table bookmarked during OJT and on-call troubleshooting on <code>labflow-vps</code>.</li>
</ul>

<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice on Code Lab</span><span class="lc-sub">Turn passive cheat-sheet reading into muscle memory on the Linux &amp; Bash track.</span></span>
</a>

<p class="note-ct"><strong>Tip for OJT:</strong> press <code>Ctrl</code>+<code>F</code> on this page and type what you want to do (“port”, “inode”, “cron”, “checksum”) instead of searching by command name. After looking up a command three times in real work, your fingers remember it automatically.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Phụ lục · Bài 17.2</span>
<h2>Bảng tra nhanh theo tình huống (172 mục lệnh)</h2>
<p class="lead">Khi đi làm, đầu bạn không bao giờ nghĩ "cờ <code>-z</code> của lệnh X là gì?" — bạn nghĩ "Tôi muốn biết thư mục nào đang làm đầy đĩa <code>labflow-vps</code>" hay "Tôi muốn xem tiến trình nào đang giữ cổng 8080". Hãy đánh dấu bài này làm sổ tay để bàn: 172 mục lệnh hay dùng nhất được xếp theo 11 nhóm tình huống thật, kèm lệnh mẫu sẵn dùng và chương học chi tiết trong khoá.</p>
<div class="callout"><strong>Lưu ý:</strong> mọi lệnh trong bảng là mẫu cú pháp để bạn thay đường dẫn/tên máy rồi tự chạy trên máy của mình hoặc trong container vứt đi (bài tra cứu này không in kèm output).</div>

<h3>1. Đi lại &amp; tìm file (18 lệnh)</h3>
<table>
<tr><th>Tôi muốn…</th><th>Lệnh mẫu</th><th>Chương</th></tr>
<tr><td>Xem mình đang đứng ở thư mục nào</td><td><code>pwd</code></td><td>Ch. 1</td></tr>
<tr><td>Đi tới thư mục dự án (hoặc quay lại thư mục trước)</td><td><code>cd /srv/labflow</code> · <code>cd -</code></td><td>Ch. 1</td></tr>
<tr><td>Liệt kê đủ file ẩn, dung lượng dễ đọc và sắp theo thời gian</td><td><code>ls -laht</code></td><td>Ch. 1</td></tr>
<tr><td>Xem cây thư mục sâu tối đa 2 tầng</td><td><code>tree -L 2 -a</code></td><td>Ch. 1</td></tr>
<tr><td>Tạo nhiều tầng thư mục một lúc, có sẵn không báo lỗi</td><td><code>mkdir -p /srv/labflow/logs</code></td><td>Ch. 2</td></tr>
<tr><td>Xoá một thư mục rỗng an toàn</td><td><code>rmdir thu-muc-rong</code></td><td>Ch. 2</td></tr>
<tr><td>Tạo file rỗng hoặc cập nhật thời gian sửa file</td><td><code>touch .env.example</code></td><td>Ch. 2</td></tr>
<tr><td>Sao chép thư mục giữ nguyên quyền và dấu thời gian</td><td><code>cp -a src/ dst/</code></td><td>Ch. 2</td></tr>
<tr><td>Di chuyển hoặc đổi tên file/thư mục</td><td><code>mv app.log app.log.1</code></td><td>Ch. 2</td></tr>
<tr><td>Xoá file hoặc cây thư mục (không có thùng rác!)</td><td><code>rm -ri build/</code></td><td>Ch. 2</td></tr>
<tr><td>Tạo liên kết mềm (vd bật site Nginx)</td><td><code>ln -s /etc/nginx/sites-available/app /etc/nginx/sites-enabled/</code></td><td>Ch. 2</td></tr>
<tr><td>Tìm file <code>.log</code> lớn hơn 50 MB vừa sửa trong 24 giờ qua</td><td><code>find /var/log -name '*.log' -size +50M -mtime -1</code></td><td>Ch. 2</td></tr>
<tr><td>Tìm tên file cực nhanh qua chỉ mục có sẵn</td><td><code>locate nginx.conf</code></td><td>Ch. 2</td></tr>
<tr><td>Xem chi tiết kích thước, quyền, inode và mốc thời gian file</td><td><code>stat deploy.sh</code></td><td>Ch. 1–2</td></tr>
<tr><td>Kiểm tra định dạng thật của file và phát hiện lỗi xuống dòng CRLF</td><td><code>file deploy.sh</code></td><td>Ch. 1 · 15</td></tr>
<tr><td>Lấy đường dẫn tuyệt đối chuẩn sau khi giải hết symlink</td><td><code>realpath ./current/app.jar</code></td><td>Ch. 2</td></tr>
<tr><td>Xem symlink trỏ đi đâu (hoặc giải hết bằng <code>-f</code>)</td><td><code>readlink -f /usr/bin/java</code></td><td>Ch. 2 · 7</td></tr>
<tr><td>Tìm file nhị phân, mã nguồn và trang man của một lệnh hệ thống</td><td><code>whereis nginx bash</code></td><td>Ch. 17</td></tr>
</table>

<h3>2. Xem &amp; sửa văn bản (22 lệnh)</h3>
<table>
<tr><th>Tôi muốn…</th><th>Lệnh mẫu</th><th>Chương</th></tr>
<tr><td>In nhanh file nhỏ (hoặc soi ký tự ẩn Tab/CRLF bằng <code>-A</code>)</td><td><code>cat -A deploy.sh</code></td><td>Ch. 3 · 15</td></tr>
<tr><td>In ngược file từ dòng cuối lên đầu</td><td><code>tac app.log | head -20</code></td><td>Ch. 3</td></tr>
<tr><td>Đọc file log lớn từng trang và tìm bằng phím <code>/</code></td><td><code>less +G /var/log/syslog</code></td><td>Ch. 1 · 3</td></tr>
<tr><td>Xem 20 dòng đầu của file hoặc ống dẫn</td><td><code>head -n 20 app.log</code></td><td>Ch. 3</td></tr>
<tr><td>Bám theo file log đang ghi trực tiếp</td><td><code>tail -n 50 -f /var/log/app.log</code></td><td>Ch. 3</td></tr>
<tr><td>Đánh số thứ tự từng dòng của file</td><td><code>nl -ba config.yml</code></td><td>Ch. 3</td></tr>
<tr><td>Đếm số dòng, số từ hoặc số byte</td><td><code>wc -l access.log</code></td><td>Ch. 3</td></tr>
<tr><td>Tìm chuỗi trong cả thư mục kèm số dòng (không phân biệt hoa thường)</td><td><code>grep -rn -i 'OutOfMemory' /var/log/</code></td><td>Ch. 3</td></tr>
<tr><td>Thay thế chuỗi theo mẫu hoặc sửa trực tiếp file (chạy cả Linux &amp; Mac)</td><td><code>sed -i.bak 's/http:/https:/g' app.conf</code></td><td>Ch. 3 · 15</td></tr>
<tr><td>Cắt cột và tính tổng từ log có cấu trúc</td><td><code>awk '{sum+=\$9} END{print sum}' access.log</code></td><td>Ch. 3</td></tr>
<tr><td>Cắt đúng vài cột theo dấu phân cách (vd CSV hoặc <code>:</code>)</td><td><code>cut -d: -f1,7 /etc/passwd</code></td><td>Ch. 3</td></tr>
<tr><td>Sắp xếp theo số hoặc theo dung lượng (<code>-h</code>)</td><td><code>sort -k2 -nr counts.txt</code></td><td>Ch. 3</td></tr>
<tr><td>Đếm số lần lặp của từng dòng (luôn đứng sau <code>sort</code>)</td><td><code>sort ips.txt | uniq -c | sort -nr</code></td><td>Ch. 3</td></tr>
<tr><td>Đổi hoặc xoá ký tự hàng loạt (vd gỡ <code>\\r</code> Windows)</td><td><code>tr -d '\\r' &lt; win.sh &gt; unix.sh</code></td><td>Ch. 3</td></tr>
<tr><td>Ghép song song từng dòng của hai file cạnh nhau</td><td><code>paste hosts.txt ports.txt</code></td><td>Ch. 3</td></tr>
<tr><td>So hai danh sách đã sắp xếp (chỉ ở A, chỉ ở B, hay chung cả hai)</td><td><code>comm -23 old.txt new.txt</code></td><td>Ch. 3 · 17</td></tr>
<tr><td>Căn đều dữ liệu phân cách bằng dấu phẩy thành bảng gọn</td><td><code>column -t -s, services.csv</code></td><td>Ch. 3 · 17</td></tr>
<tr><td>So từng dòng khác nhau giữa hai file cấu hình</td><td><code>diff -u prod.conf staging.conf</code></td><td>Ch. 3</td></tr>
<tr><td>Áp một bản vá dạng unified diff vào mã nguồn/cấu hình</td><td><code>patch -p1 &lt; fix.patch</code></td><td>Ch. 3</td></tr>
<tr><td>Vừa xem kết quả trên màn hình vừa ghi vào file log</td><td><code>./deploy.sh 2&gt;&amp;1 | tee -a deploy.log</code></td><td>Ch. 3</td></tr>
<tr><td>Đọc, lọc và làm đẹp JSON trả về từ REST API</td><td><code>curl -s http://localhost:8080/health | jq '.status'</code></td><td>Ch. 3 · 9</td></tr>
<tr><td>Chuyển file có xuống dòng CRLF của Windows sang LF của Linux</td><td><code>dos2unix deploy.sh</code></td><td>Ch. 15</td></tr>
</table>

<h3>3. Quyền &amp; người dùng (17 lệnh)</h3>
<table>
<tr><th>Tôi muốn…</th><th>Lệnh mẫu</th><th>Chương</th></tr>
<tr><td>Cấp quyền chạy script hoặc khoá chặt khoá riêng SSH</td><td><code>chmod +x deploy.sh</code> · <code>chmod 600 ~/.ssh/id_ed25519</code></td><td>Ch. 4</td></tr>
<tr><td>Đổi chủ sở hữu và nhóm cho cả thư mục dự án</td><td><code>sudo chown -R appuser:appgroup /srv/labflow</code></td><td>Ch. 4</td></tr>
<tr><td>Chỉ đổi nhóm sở hữu của một thư mục dùng chung</td><td><code>sudo chgrp -R devteam /srv/shared</code></td><td>Ch. 4</td></tr>
<tr><td>Xem hoặc đặt mặt nạ quyền mặc định cho file mới tạo</td><td><code>umask 027</code></td><td>Ch. 4</td></tr>
<tr><td>Xem UID, GID và mọi nhóm của mình hoặc một tài khoản</td><td><code>id</code> · <code>id deploy</code></td><td>Ch. 4</td></tr>
<tr><td>In nhanh tên người dùng hiện tại</td><td><code>whoami</code></td><td>Ch. 4</td></tr>
<tr><td>Xem ai đang đăng nhập máy chủ và họ đang chạy lệnh gì</td><td><code>w</code></td><td>Ch. 4</td></tr>
<tr><td>Liệt kê nhanh các phiên đăng nhập hiện có</td><td><code>who</code></td><td>Ch. 4</td></tr>
<tr><td>Xem một tài khoản đang thuộc những nhóm nào</td><td><code>groups deploy</code></td><td>Ch. 4</td></tr>
<tr><td>Chuyển sang shell đăng nhập của tài khoản khác</td><td><code>su - deploy</code></td><td>Ch. 4</td></tr>
<tr><td>Chạy đúng một lệnh bằng quyền root hoặc user dịch vụ</td><td><code>sudo -u postgres psql</code></td><td>Ch. 4</td></tr>
<tr><td>Sửa file <code>/etc/sudoers</code> có kiểm cú pháp tự động</td><td><code>sudo visudo</code></td><td>Ch. 4</td></tr>
<tr><td>Tạo tài khoản mới kèm thư mục <code>/home</code> và shell bash</td><td><code>sudo useradd -m -s /bin/bash intern1</code></td><td>Ch. 4</td></tr>
<tr><td>Thêm tài khoản vào nhóm phụ (nhớ <code>-a</code> kẻo mất nhóm cũ!)</td><td><code>sudo usermod -aG docker deploy</code></td><td>Ch. 4</td></tr>
<tr><td>Xoá tài khoản người dùng kèm thư mục <code>/home</code></td><td><code>sudo userdel -r intern1</code></td><td>Ch. 17</td></tr>
<tr><td>Đổi mật khẩu hoặc khoá đăng nhập bằng mật khẩu</td><td><code>sudo passwd deploy</code> · <code>sudo passwd -l intern1</code></td><td>Ch. 4</td></tr>
<tr><td>Cấp hoặc xem quyền chi tiết ACL cho đúng một user cụ thể</td><td><code>setfacl -m u:deploy:rw /var/log/app.log</code> · <code>getfacl /var/log/app.log</code></td><td>Ch. 4</td></tr>
</table>

<h3>4. Tiến trình &amp; tín hiệu (16 lệnh)</h3>
<table>
<tr><th>Tôi muốn…</th><th>Lệnh mẫu</th><th>Chương</th></tr>
<tr><td>Liệt kê toàn bộ tiến trình kèm PID, CPU, RAM và cây cha-con</td><td><code>ps auxf</code></td><td>Ch. 5</td></tr>
<tr><td>Theo dõi CPU và RAM trực tiếp bằng công cụ cài sẵn</td><td><code>top</code></td><td>Ch. 5</td></tr>
<tr><td>Theo dõi tiến trình trực quan có lọc, sắp và diệt nhanh</td><td><code>htop</code></td><td>Ch. 5</td></tr>
<tr><td>Tìm PID theo tên tiến trình hoặc chuỗi dòng lệnh đầy đủ</td><td><code>pgrep -af java</code></td><td>Ch. 5</td></tr>
<tr><td>Gửi tín hiệu dừng cho tiến trình khớp mẫu tên</td><td><code>pkill -TERM -f 'node server.js'</code></td><td>Ch. 5</td></tr>
<tr><td>Dừng êm một PID (chỉ dùng <code>-9</code> khi <code>-TERM</code> không ăn)</td><td><code>kill -TERM 1234</code> · <code>kill -9 1234</code></td><td>Ch. 5</td></tr>
<tr><td>Gửi tín hiệu cho mọi tiến trình khớp chính xác tên</td><td><code>killall -HUP nginx</code></td><td>Ch. 5</td></tr>
<tr><td>Xem danh sách công việc đang chạy nền trong shell hiện tại</td><td><code>jobs -l</code></td><td>Ch. 5</td></tr>
<tr><td>Đẩy việc bị tạm dừng ra chạy nền hoặc kéo lên tiền cảnh</td><td><code>bg %1</code> · <code>fg %1</code></td><td>Ch. 5</td></tr>
<tr><td>Chạy lệnh không bị chết khi rớt phiên SSH (chặn SIGHUP)</td><td><code>nohup java -jar app.jar &gt; app.log 2&gt;&amp;1 &amp;</code></td><td>Ch. 5</td></tr>
<tr><td>Chạy việc nặng ở độ ưu tiên CPU thấp để không lag web</td><td><code>nice -n 10 tar -cf backup.tar /srv/data</code></td><td>Ch. 5</td></tr>
<tr><td>Đổi độ ưu tiên CPU của tiến trình đang chạy</td><td><code>sudo renice +10 -p 1234</code></td><td>Ch. 5</td></tr>
<tr><td>Tự ngắt một lệnh nếu chạy quá 30 giây</td><td><code>timeout 30s curl -sf http://localhost:8080/health</code></td><td>Ch. 5 · 15</td></tr>
<tr><td>Lặp lại một lệnh mỗi 2 giây và tô sáng chỗ thay đổi</td><td><code>watch -n 2 -d 'ss -s'</code></td><td>Ch. 5</td></tr>
<tr><td>Xem cây quan hệ cha–con của các tiến trình</td><td><code>pstree -ap</code></td><td>Ch. 5</td></tr>
<tr><td>Xem giới hạn tài nguyên shell (vd số file mở tối đa)</td><td><code>ulimit -n</code> · <code>ulimit -a</code></td><td>Ch. 5</td></tr>
</table>

<h3>5. Đĩa, dung lượng &amp; gói phần mềm (16 lệnh)</h3>
<table>
<tr><th>Tôi muốn…</th><th>Lệnh mẫu</th><th>Chương</th></tr>
<tr><td>Xem dung lượng trống và số inode trống của các phân vùng</td><td><code>df -h</code> · <code>df -i</code></td><td>Ch. 10</td></tr>
<tr><td>Đo dung lượng từng thư mục con rồi sắp tăng dần</td><td><code>du -sh /var/* | sort -h</code></td><td>Ch. 10</td></tr>
<tr><td>Duyệt tương tác xem thư mục nào đang ngốn sạch đĩa</td><td><code>ncdu /var</code></td><td>Ch. 10</td></tr>
<tr><td>Liệt kê ổ đĩa, phân vùng, định dạng và điểm gắn</td><td><code>lsblk -f</code></td><td>Ch. 10</td></tr>
<tr><td>Lấy UUID phân vùng để ghi vào <code>/etc/fstab</code></td><td><code>sudo blkid</code></td><td>Ch. 10</td></tr>
<tr><td>Gắn hoặc tháo sạch một phân vùng ổ đĩa</td><td><code>sudo mount /dev/sdb1 /mnt/data</code> · <code>sudo umount /mnt/data</code></td><td>Ch. 10</td></tr>
<tr><td>Xem bảng phân vùng các ổ đĩa</td><td><code>sudo fdisk -l</code></td><td>Ch. 10</td></tr>
<tr><td>Định dạng phân vùng mới sang ext4</td><td><code>sudo mkfs.ext4 /dev/sdb1</code></td><td>Ch. 10</td></tr>
<tr><td>Kiểm tra lỗi hệ thống file trên phân vùng đã tháo gắn</td><td><code>sudo fsck -n /dev/sdb1</code></td><td>Ch. 10</td></tr>
<tr><td>Xem phân vùng/file swap đang bật</td><td><code>swapon --show</code></td><td>Ch. 10</td></tr>
<tr><td>Chép dữ liệu theo khối hoặc tạo file thử dung lượng cố định</td><td><code>dd if=/dev/zero of=/tmp/test.img bs=1M count=64 status=progress</code></td><td>Ch. 10</td></tr>
<tr><td>Cập nhật chỉ mục và cài/gỡ gói trên Ubuntu/Debian</td><td><code>sudo apt update &amp;&amp; sudo apt install -y jq</code></td><td>Ch. 10</td></tr>
<tr><td>Tra cứu gói <code>.deb</code> nào chứa một lệnh/file cụ thể</td><td><code>dpkg -S /usr/bin/envsubst</code></td><td>Ch. 10</td></tr>
<tr><td>Cài và quản lý gói trên RHEL 8+/Rocky/Alma/Fedora</td><td><code>sudo dnf install -y nginx</code></td><td>Ch. 10 · 17</td></tr>
<tr><td>Quản lý gói trên RHEL/CentOS 7 / Amazon Linux (tiền thân <code>dnf</code>)</td><td><code>sudo yum install -y nginx</code> · <code>yum provides '*/envsubst'</code></td><td>Ch. 17</td></tr>
<tr><td>Liệt kê gói RPM đã cài hoặc file bên trong một gói RPM</td><td><code>rpm -qa | grep java</code> · <code>rpm -ql nginx</code></td><td>Ch. 10</td></tr>
</table>

<h3>6. Mạng &amp; máy từ xa (18 lệnh)</h3>
<table>
<tr><th>Tôi muốn…</th><th>Lệnh mẫu</th><th>Chương</th></tr>
<tr><td>Xem địa chỉ IP, card mạng và bảng định tuyến</td><td><code>ip -br addr</code> · <code>ip route</code></td><td>Ch. 9</td></tr>
<tr><td>Xem tiến trình nào đang lắng nghe cổng TCP/UDP nào</td><td><code>sudo ss -tulpn</code></td><td>Ch. 9</td></tr>
<tr><td>Kiểm tra kết nối ICMP cơ bản và độ trễ</td><td><code>ping -c 4 example.com</code></td><td>Ch. 9</td></tr>
<tr><td>Dò từng chặng mạng tới máy chủ đích</td><td><code>traceroute example.com</code></td><td>Ch. 9</td></tr>
<tr><td>Kết hợp ping + traceroute để tìm chặng rớt gói</td><td><code>mtr -rwc 20 example.com</code></td><td>Ch. 9</td></tr>
<tr><td>Tra bản ghi DNS chi tiết (A, AAAA, MX, TXT)</td><td><code>dig +short example.com A</code></td><td>Ch. 9</td></tr>
<tr><td>Tra cứu DNS nhanh (có sẵn trên cả Windows)</td><td><code>nslookup example.com</code></td><td>Ch. 9</td></tr>
<tr><td>Tra DNS ngắn gọn hoặc tra ngược IP sang tên miền</td><td><code>host example.com</code></td><td>Ch. 9</td></tr>
<tr><td>Gọi REST API, gửi JSON và kiểm tra HTTP status/header</td><td><code>curl -fsS -H 'Content-Type: application/json' http://localhost:8080/health</code></td><td>Ch. 9</td></tr>
<tr><td>Tải file có tải tiếp khi rớt mạng hoặc kiểm header bằng spider</td><td><code>wget -c https://example.com/app.tar.gz</code></td><td>Ch. 17</td></tr>
<tr><td>Đăng nhập từ xa an toàn vào máy chủ Linux</td><td><code>ssh deploy@labflow-vps</code></td><td>Ch. 9</td></tr>
<tr><td>Tạo cặp khoá SSH chuẩn Ed25519 hiện đại</td><td><code>ssh-keygen -t ed25519 -C 'deploy@labflow'</code></td><td>Ch. 9</td></tr>
<tr><td>Đẩy khoá công khai SSH lên máy chủ từ xa</td><td><code>ssh-copy-id deploy@labflow-vps</code></td><td>Ch. 9</td></tr>
<tr><td>Chép nhanh file hoặc thư mục qua SSH</td><td><code>scp app.jar deploy@labflow-vps:/srv/labflow/</code></td><td>Ch. 9</td></tr>
<tr><td>Mở phiên truyền file tương tác qua SSH</td><td><code>sftp deploy@labflow-vps</code></td><td>Ch. 9</td></tr>
<tr><td>Thử xem một cổng TCP từ xa có mở kết nối không</td><td><code>nc -zv labflow-vps 443</code></td><td>Ch. 9</td></tr>
<tr><td>Bắt gói tin mạng trực tiếp trên một cổng để gỡ lỗi</td><td><code>sudo tcpdump -ni any port 8080 -c 20</code></td><td>Ch. 9 · 12</td></tr>
<tr><td>Quét cổng trên MÁY CỦA MÌNH để kiểm tường lửa</td><td><code>nmap -sT -p 22,80,443,5432 --open 127.0.0.1</code></td><td>Ch. 17</td></tr>
</table>

<h3>7. Dịch vụ, lịch chạy &amp; log (9 lệnh)</h3>
<table>
<tr><th>Tôi muốn…</th><th>Lệnh mẫu</th><th>Chương</th></tr>
<tr><td>Khởi động lại, bật tự chạy hoặc xem trạng thái dịch vụ systemd</td><td><code>sudo systemctl restart labflow-api &amp;&amp; systemctl status labflow-api</code></td><td>Ch. 11</td></tr>
<tr><td>Theo dõi log systemd của một dịch vụ từ 1 giờ trước</td><td><code>journalctl -u labflow-api --since '1 hour ago' -f</code></td><td>Ch. 11</td></tr>
<tr><td>Xem máy khởi động mất bao lâu và dịch vụ nào chậm nhất</td><td><code>systemd-analyze blame | head -10</code></td><td>Ch. 11</td></tr>
<tr><td>Sửa hoặc xem danh sách việc hẹn giờ chạy định kỳ</td><td><code>crontab -e</code> · <code>crontab -l</code></td><td>Ch. 11</td></tr>
<tr><td>Hẹn chạy đúng MỘT lần một lệnh vào giờ định trước</td><td><code>echo '/srv/backup.sh' | at 02:00</code></td><td>Ch. 11</td></tr>
<tr><td>Chạy thử quy tắc xoay vòng log mà chưa sửa file thật</td><td><code>sudo logrotate -d /etc/logrotate.d/nginx</code></td><td>Ch. 10</td></tr>
<tr><td>Ghi một dòng log từ script bash vào syslog/journald</td><td><code>logger -t deploy 'Release v1.4 completed'</code></td><td>Ch. 7 · 11</td></tr>
<tr><td>Đọc log nhân Linux (OOM killer, lỗi ổ đĩa/USB)</td><td><code>sudo dmesg -T | tail -30</code></td><td>Ch. 12</td></tr>
<tr><td>Kiểm tra dịch vụ/LaunchAgent trên macOS</td><td><code>launchctl print gui/\$(id -u)/com.labflow.backup</code></td><td>Ch. 15</td></tr>
</table>

<h3>8. Nén &amp; sao lưu (9 lệnh)</h3>
<table>
<tr><th>Tôi muốn…</th><th>Lệnh mẫu</th><th>Chương</th></tr>
<tr><td>Đóng gói + nén hoặc giải nén cả thư mục bằng <code>tar</code></td><td><code>tar -czf backup.tar.gz /srv/labflow</code> · <code>tar -xf backup.tar.gz</code></td><td>Ch. 2</td></tr>
<tr><td>Nén hoặc giải nén một file bằng gzip</td><td><code>gzip -k app.log</code> · <code>gunzip app.log.gz</code></td><td>Ch. 2</td></tr>
<tr><td>Nén/giải nén bằng bzip2</td><td><code>bzip2 -dk dump.sql.bz2</code></td><td>Ch. 2</td></tr>
<tr><td>Nén tỷ lệ cao nhất bằng xz</td><td><code>tar -cJf release.tar.xz dist/</code></td><td>Ch. 2</td></tr>
<tr><td>Nén/giải nén rất nhanh bằng chuẩn zstd hiện đại</td><td><code>tar --zstd -cf backup.tar.zst /srv/data</code></td><td>Ch. 2</td></tr>
<tr><td>Tạo file <code>.zip</code> dễ mở trên Windows</td><td><code>zip -r build.zip dist/</code></td><td>Ch. 2</td></tr>
<tr><td>Xem danh sách hoặc giải nén file <code>.zip</code></td><td><code>unzip -l build.zip</code> · <code>unzip build.zip -d out/</code></td><td>Ch. 2</td></tr>
<tr><td>Đồng bộ chỉ các phần thay đổi cục bộ hoặc qua SSH</td><td><code>rsync -avz --delete dist/ deploy@labflow-vps:/srv/www/</code></td><td>Ch. 9</td></tr>
<tr><td>Giữ phiên làm việc sống sót khi đứt mạng SSH</td><td><code>tmux new -s deploy</code> · <code>tmux attach -t deploy</code></td><td>Ch. 5</td></tr>
</table>

<h3>9. Bảo mật &amp; kiểm toàn vẹn (11 lệnh)</h3>
<table>
<tr><th>Tôi muốn…</th><th>Lệnh mẫu</th><th>Chương</th></tr>
<tr><td>Kiểm tra mã băm SHA-256 của file vừa tải về</td><td><code>sha256sum -c SHA256SUMS</code></td><td>Ch. 10</td></tr>
<tr><td>Tính nhanh mã MD5 (chỉ kiểm lỗi truyền, không dùng cho bảo mật!)</td><td><code>md5sum app.jar</code></td><td>Ch. 10</td></tr>
<tr><td>Mã hoá bản sao lưu hoặc xác thực chữ ký phát hành bằng GPG</td><td><code>gpg --verify release.tar.gz.asc release.tar.gz</code></td><td>Ch. 10</td></tr>
<tr><td>Xem ngày hết hạn chứng chỉ TLS/HTTPS của một tên miền</td><td><code>openssl s_client -connect example.com:443 &lt;/dev/null 2&gt;/dev/null | openssl x509 -noout -dates</code></td><td>Ch. 9 · 10</td></tr>
<tr><td>Ghi đè rồi xoá file nhạy cảm (nhớ giới hạn trên SSD!)</td><td><code>shred -u -v -n 2 /tmp/secret.key</code></td><td>Ch. 17</td></tr>
<tr><td>Mở/đóng cổng và xem tường lửa đơn giản trên Ubuntu</td><td><code>sudo ufw allow 443/tcp &amp;&amp; sudo ufw status verbose</code></td><td>Ch. 9</td></tr>
<tr><td>Xem toàn bộ bộ luật tường lửa nftables hiện đại</td><td><code>sudo nft list ruleset</code></td><td>Ch. 14</td></tr>
<tr><td>Xem luật tường lửa iptables cũ (kể cả NAT của Docker)</td><td><code>sudo iptables -L -n -v</code></td><td>Ch. 9 · 14</td></tr>
<tr><td>Khoá bất biến một file cấu hình (cả root <code>rm</code> cũng chặn)</td><td><code>sudo chattr +i /etc/resolv.conf</code> · <code>lsattr /etc/resolv.conf</code></td><td>Ch. 4</td></tr>
<tr><td>Kiểm tra trạng thái SELinux trên RHEL/Fedora</td><td><code>sestatus</code> · <code>getenforce</code></td><td>Ch. 14</td></tr>
<tr><td>Lưu tạm khoá SSH đã mở trong RAM suốt phiên làm việc</td><td><code>eval "\$(ssh-agent -s)" &amp;&amp; ssh-add ~/.ssh/id_ed25519</code></td><td>Ch. 9</td></tr>
</table>

<h3>10. Hiệu năng &amp; chẩn đoán (15 lệnh)</h3>
<table>
<tr><th>Tôi muốn…</th><th>Lệnh mẫu</th><th>Chương</th></tr>
<tr><td>Xem máy chủ chạy được bao lâu và tải trung bình (load average)</td><td><code>uptime</code></td><td>Ch. 12</td></tr>
<tr><td>Xem RAM tổng, đã dùng và thực sự còn trống (<code>available</code>)</td><td><code>free -h</code></td><td>Ch. 12</td></tr>
<tr><td>Theo dõi CPU, RAM, swap và I/O mỗi giây</td><td><code>vmstat 1 5</code></td><td>Ch. 12</td></tr>
<tr><td>Xem mức bận và độ trễ đọc/ghi của từng ổ đĩa</td><td><code>iostat -xz 1 5</code></td><td>Ch. 12</td></tr>
<tr><td>Xem tải từng nhân CPU để phát hiện nghẽn đơn luồng</td><td><code>mpstat -P ALL 1 3</code></td><td>Ch. 12</td></tr>
<tr><td>Xem lịch sử chỉ số CPU/RAM/mạng từ sysstat</td><td><code>sar -u 1 5</code></td><td>Ch. 12</td></tr>
<tr><td>Tìm tiến trình nào đang đọc/ghi ổ đĩa mạnh nhất lúc này</td><td><code>sudo iotop -o</code></td><td>Ch. 12</td></tr>
<tr><td>Xem danh sách file đang mở hoặc tìm PID giữ cổng 3000</td><td><code>sudo lsof -i :3000</code></td><td>Ch. 5 · 12</td></tr>
<tr><td>Tìm tiến trình nào đang giữ thư mục khiến <code>umount</code> báo bận</td><td><code>fuser -mv /mnt/data</code></td><td>Ch. 5 · 10</td></tr>
<tr><td>Soi lời gọi hệ thống (syscall) của một chương trình lỗi khó hiểu</td><td><code>strace -f -e trace=file ./my-tool</code></td><td>Ch. 12</td></tr>
<tr><td>Đo điểm nóng CPU (profiler) trên máy chủ Linux</td><td><code>sudo perf top</code></td><td>Ch. 14</td></tr>
<tr><td>Xem kiến trúc, số nhân và số luồng CPU</td><td><code>lscpu | head -12</code></td><td>Ch. 17</td></tr>
<tr><td>Xem tên nhân, phiên bản kernel và kiến trúc phần cứng</td><td><code>uname -a</code></td><td>Ch. 12 · 15</td></tr>
<tr><td>Đọc hoặc chỉnh tham số nhân Linux trực tiếp</td><td><code>sysctl net.core.somaxconn</code></td><td>Ch. 12 · 14</td></tr>
<tr><td>Liệt kê thiết bị PCI hoặc USB gắn trên máy</td><td><code>lspci</code> · <code>lsusb</code></td><td>Ch. 12</td></tr>
</table>

<h3>11. Script, môi trường &amp; tiện ích (21 lệnh)</h3>
<table>
<tr><th>Tôi muốn…</th><th>Lệnh mẫu</th><th>Chương</th></tr>
<tr><td>In chữ có định dạng ổn định (ưu tiên hơn <code>echo</code> trong script)</td><td><code>printf '%s=%s\\n' PORT 8080</code></td><td>Ch. 6</td></tr>
<tr><td>Đọc dữ liệu đầu vào hoặc từng dòng an toàn trong vòng lặp</td><td><code>IFS= read -r line</code></td><td>Ch. 6</td></tr>
<tr><td>Xem toàn bộ biến môi trường hoặc in đúng một biến</td><td><code>env</code> · <code>printenv PATH</code></td><td>Ch. 8</td></tr>
<tr><td>Xuất biến cho tiến trình con hoặc xoá một biến</td><td><code>export NODE_ENV=production</code> · <code>unset DEBUG</code></td><td>Ch. 8</td></tr>
<tr><td>Thay biến môi trường vào file cấu hình mẫu</td><td><code>envsubst '\$APP_PORT \$APP_NAME' &lt; tpl.conf &gt; app.conf</code></td><td>Ch. 17</td></tr>
<tr><td>Tạo hoặc xem lệnh viết tắt (bí danh) trong shell</td><td><code>alias ll='ls -lah'</code></td><td>Ch. 8</td></tr>
<tr><td>Biết một tên lệnh là alias, builtin, hàm hay file trên đĩa</td><td><code>type -a ls cd</code></td><td>Ch. 1 · 8 · 17</td></tr>
<tr><td>Kiểm tra trong script xem công cụ cần thiết đã cài chưa</td><td><code>command -v jq &gt;/dev/null || exit 1</code></td><td>Ch. 7 · 8</td></tr>
<tr><td>Chạy một lệnh cho từng dòng đầu vào (hỗ trợ song song <code>-P</code>)</td><td><code>find . -name '*.log' -print0 | xargs -0 -r rm</code></td><td>Ch. 3 · 13</td></tr>
<tr><td>Tạo dấu thời gian đặt tên file log hoặc bản sao lưu</td><td><code>date -u +'%Y-%m-%dT%H:%M:%SZ'</code></td><td>Ch. 7 · 15</td></tr>
<tr><td>Tạm nghỉ N giây trong vòng lặp thử lại</td><td><code>sleep 5</code></td><td>Ch. 7</td></tr>
<tr><td>Đo thời gian thực, thời gian CPU user và kernel của một lệnh</td><td><code>time npm run build</code></td><td>Ch. 5</td></tr>
<tr><td>Tính toán số thập phân trong script bash</td><td><code>echo 'scale=2; 75 / 120' | bc</code></td><td>Ch. 6</td></tr>
<tr><td>Sinh dãy số liên tiếp (có đệm số 0 bằng <code>-w</code>)</td><td><code>seq -w 1 10</code></td><td>Ch. 6</td></tr>
<tr><td>Tạo file hoặc thư mục tạm an toàn tránh đụng tên</td><td><code>tmp=\$(mktemp)</code></td><td>Ch. 7</td></tr>
<tr><td>Tách tên file hoặc thư mục cha từ một đường dẫn</td><td><code>basename /srv/app/run.sh</code> · <code>dirname /srv/app/run.sh</code></td><td>Ch. 7</td></tr>
<tr><td>Chặn hai lần chạy cron trùng nhau gây hỏng bản sao lưu</td><td><code>flock -n /tmp/backup.lock /srv/backup.sh</code></td><td>Ch. 7 · 11</td></tr>
<tr><td>Soi lỗi dấu nháy và tương thích cho script bash trước khi deploy</td><td><code>shellcheck deploy.sh</code></td><td>Ch. 7</td></tr>
<tr><td>Mở sách hướng dẫn tích hợp (chỉ rõ mục 1, 5 hay 8 khi cần)</td><td><code>man 5 crontab</code></td><td>Ch. 1 · 17</td></tr>
<tr><td>Tìm tên lệnh theo từ khoá mô tả trong trang man</td><td><code>apropos 'archive'</code></td><td>Ch. 1 · 17</td></tr>
<tr><td>Xem/đổi tên máy chủ hoặc múi giờ hệ thống</td><td><code>hostnamectl</code> · <code>timedatectl</code></td><td>Ch. 8 · 9</td></tr>
</table>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> tuần đầu OJT, mentor nhắn năm việc nhanh trong nhóm chat. Chỉ dùng đúng các bảng ở trên (không Google), chọn lệnh cho từng việc và chạy thử các lệnh an toàn trong <code>~/thu-linux/tra17</code> hoặc container <code>ubuntu:24.04</code>:</p><ol>
<li>Tìm mọi file <code>.log</code> trong <code>/var/log</code> lớn hơn 10 MB và mới sửa trong 2 ngày qua.</li>
<li>Xem tiến trình nào đang giữ cổng TCP <code>8080</code> và soi cây cha–con của nó.</li>
<li>Nén thư mục <code>~/thu-linux/tra17</code> bằng <code>tar</code> + <code>gzip</code>, rồi tạo và kiểm tra mã băm SHA-256.</li>
<li>So hai file văn bản đã sắp xếp <code>a.txt</code> và <code>b.txt</code> để in đúng các dòng chỉ có trong <code>a.txt</code>.</li>
<li>Xem RAM thực sự còn trống, dung lượng đĩa trống và số inode trống trong một dòng lệnh.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn viết và chạy được đủ năm lệnh chỉ nhờ tra theo nhóm tình huống trên trang này, và biết chính xác cần quay lại chương nào nếu quên cờ của bất kỳ lệnh nào trong đó.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Situation-first lookup (tra theo tình huống)</span><span class="v">Sắp xếp lệnh theo việc cần làm ("Tôi muốn…") thay vì theo bảng chữ cái A–Z.</span></div>
  <div class="kv"><span class="k">Inode exhaustion (cạn inode, <code>df -i</code>)</span><span class="v">Ổ đĩa vẫn còn trống hàng GB nhưng không tạo thêm được file mới vì hàng triệu file nhỏ đã dùng hết inode.</span></div>
  <div class="kv"><span class="k">Idempotent flag (cờ chạy lặp an toàn)</span><span class="v">Các cờ như <code>mkdir -p</code> hay <code>xargs -r</code> giúp script chạy lại nhiều lần không báo lỗi vô lý.</span></div>
  <div class="kv"><span class="k">Lock file (file khoá, <code>flock</code>)</span><span class="v">Khoá tập tin ngăn hai lượt cron chạy chồng lên nhau làm hỏng bản sao lưu hoặc bản deploy.</span></div>
  <div class="kv"><span class="k">Canonical path (đường dẫn chuẩn, <code>realpath</code>)</span><span class="v">Đường dẫn tuyệt đối duy nhất sau khi giải hết <code>..</code> và mọi symlink.</span></div>
  <div class="kv"><span class="k">Non-destructive check (kiểm tra không phá huỷ)</span><span class="v">Các cờ chỉ đọc như <code>logrotate -d</code>, <code>fsck -n</code>, <code>wget --spider</code> để xem trước kết quả.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Không ai cần học thuộc lòng 172 lệnh — điều cần thuộc là 11 nhóm tình huống để tra ra đúng lệnh trong vài giây.</li>
<li>Luôn chạy lệnh chỉ đọc (<code>df</code>, <code>ss</code>, <code>ps</code>, <code>journalctl</code>, <code>stat</code>) để chẩn đoán trước khi đụng vào lệnh thay đổi trạng thái.</li>
<li>Mỗi dòng đều ghi rõ chương học gốc (Ch. 1–17) để bạn nhảy về đọc sâu khi gặp ca khó.</li>
<li>Ghép nhiều lệnh nhỏ bằng ống dẫn (<code>find</code> + <code>xargs</code>, <code>sort</code> + <code>uniq -c</code>, <code>curl</code> + <code>jq</code>) mạnh và linh hoạt hơn tìm một lệnh khổng lồ.</li>
<li>Đánh dấu trang này để dùng ngay trong kỳ OJT và mỗi lần trực sự cố trên <code>labflow-vps</code>.</li>
</ul>

<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện trên Code Lab</span><span class="lc-sub">Biến bảng tra cứu thành phản xạ tay thật trên track Linux &amp; Bash.</span></span>
</a>

<p class="note-ct"><strong>Mẹo dùng lúc đi OJT:</strong> bấm <code>Ctrl</code>+<code>F</code> ngay trên trang này rồi gõ việc bạn cần (“cổng”, “inode”, “cron”, “checksum”) thay vì cố nhớ tên lệnh. Tra đi tra lại ba lần trong công việc thật là tay bạn tự thuộc.</p>
</div>
`,
    },

    /* ─────────────────────────── 17.3 ─────────────────────────── */
    {
      title: '17.3 — Learn any new command in 5 minutes|||17.3 — Học một lệnh mới trong 5 phút',
      slug: 'lnx-17-3-hoc-lenh-moi-5-phut',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Quy trình 5 bước tự học bất kỳ lệnh Linux lạ nào trong 5 phút (type, --help, man và đọc SYNOPSIS, apropos, tldr/explainshell, thử trong container vứt đi), kèm bài tập thực hành tự học column và comm.',
      content: `
<div class="ml-en">
<span class="eyebrow">Appendix · Lesson 17.3</span>
<h2>Learn any new command in 5 minutes</h2>
<p class="lead">A typical Linux server carries over a thousand executables in <code>/usr/bin</code> and <code>/usr/sbin</code>. No senior engineer memorizes them all — what separates a self-sufficient developer during OJT from someone stuck copy-pasting stack-overflow snippets is a repeatable 5-minute workflow to decode any unfamiliar command safely.</p>

<h3>The 5-minute workflow at a glance</h3>
<div class="lz-flow">
  <div class="lz-step"><strong>1. Identify (30s)</strong> — <code>type -a CMD</code>: builtin, alias, function or binary?</div>
  <div class="lz-step"><strong>2. Quick summary (1m)</strong> — <code>CMD --help</code> (or <code>help CMD</code> for builtins).</div>
  <div class="lz-step"><strong>3. Spec &amp; SYNOPSIS (2m)</strong> — <code>man CMD</code> + search with <code>/</code>; use <code>apropos</code> when you only know the goal.</div>
  <div class="lz-step"><strong>4. Real examples (1m)</strong> — <code>tldr CMD</code> for common patterns, <code>explainshell.com</code> to dissect pasted one-liners.</div>
  <div class="lz-step"><strong>5. Safe sandbox (30s)</strong> — test flags in <code>docker run --rm -it ubuntu:24.04 bash</code> before touching <code>labflow-vps</code>.</div>
</div>
<div class="callout"><strong>Note:</strong> the commands in this lesson are workflows for you to run yourself in your terminal or in an Ubuntu container (no output is fabricated here).</div>

<h3>Step 1 (30s) — Ask what the command actually is: <code>type</code></h3>
<p>Before reading any manual, find out whether the name is a shell builtin, an alias, a function or an external binary:</p>
<pre><code class="language-bash"><span class="tok-comment"># Commands to run yourself</span>
type -a cd ls column comm</code></pre>
<p>If <code>type</code> says <em>shell builtin</em> (like <code>cd</code>, <code>read</code>, <code>export</code>, <code>ulimit</code>), running <code>man read</code> often shows the C system call (section 2) instead of bash’s builtin! For builtins, run <code>help read</code> instead.</p>

<h3>Step 2 (1m) — Read the built-in cheat sheet: <code>--help</code></h3>
<p>Most GNU tools print a concise list of flags in one or two screens when given <code>--help</code> (pipe to <code>less</code> if it scrolls past):</p>
<pre><code class="language-bash"><span class="tok-comment"># Commands to run yourself</span>
column --help | less
comm --help</code></pre>
<p>On macOS (BSD tools) or older utilities, <code>--help</code> may print “illegal option”; try <code>-h</code> or jump straight to <code>man</code>.</p>

<h3>Step 3 (2m) — Read <code>man</code> and decode <code>SYNOPSIS</code></h3>
<p>You do NOT read a man page from top to bottom like a novel. Jump straight to <strong>SYNOPSIS</strong> (the grammar line), then press <code>/</code> to search for the exact flag or keyword you care about (<code>n</code> next match, <code>N</code> previous match, <code>g</code> top, <code>G</code> bottom, <code>q</code> quit).</p>
<p><strong>How to read every symbol in a <code>SYNOPSIS</code> line:</strong></p>
<table>
<tr><th>Symbol in SYNOPSIS</th><th>Meaning</th><th>Example</th></tr>
<tr><td><code>[OPTION]</code></td><td>Square brackets = <strong>optional</strong> (you may omit it)</td><td><code>comm [OPTION]... FILE1 FILE2</code></td></tr>
<tr><td><code>...</code></td><td>Ellipsis = may be repeated multiple times</td><td><code>[FILE]...</code> accepts 0, 1 or many files</td></tr>
<tr><td><code>FILE1 FILE2</code> or <code>&lt;file&gt;</code></td><td>Uppercase / angle brackets = <strong>required</strong> placeholder you replace</td><td><code>FILE1</code> and <code>FILE2</code> are both mandatory for <code>comm</code></td></tr>
<tr><td><code>-a | -b</code></td><td>Vertical bar = mutually exclusive choices (pick one)</td><td><code>[-s | -t]</code></td></tr>
<tr><td><code>-c, --count</code></td><td>Short flag and equivalent long flag</td><td><code>-c</code> and <code>--count</code> do the same thing</td></tr>
<tr><td><code>--</code></td><td>End of options (everything after is treated as filenames)</td><td><code>rm -- -weird-file</code></td></tr>
</table>
<p><strong>Remember the three <code>man</code> sections that matter daily:</strong></p>
<ul>
<li><strong>Section 1</strong> — user commands (<code>man 1 crontab</code> shows the <code>crontab</code> command).</li>
<li><strong>Section 5</strong> — config file formats (<code>man 5 crontab</code> explains the 5 time fields; <code>man 5 sshd_config</code> explains every SSH server directive).</li>
<li><strong>Section 8</strong> — system administration commands (<code>man 8 userdel</code>, <code>man 8 mount</code>).</li>
</ul>
<p><strong>Don’t even know the command’s name? Use <code>apropos</code> (same as <code>man -k</code>):</strong></p>
<pre><code class="language-bash"><span class="tok-comment"># Commands to run yourself (on minimal Ubuntu containers, install man-db &amp; manpages first)</span>
apropos 'compare'
apropos -s 1,8 'user'</code></pre>
<div class="pitfall co-tieu-de"><strong>Minimal Docker images strip man pages to stay small.</strong> Inside a bare <code>ubuntu:24.04</code> container, <code>man</code> and <code>apropos</code> may not exist yet or say “nothing appropriate”. On a normal server or WSL2 they are installed; in a container you can install them or read the exact same pages online at <code>man7.org/linux/man-pages/</code>.</div>

<h3>Step 4 (1m) — Get pragmatic examples: <code>tldr</code> and <code>explainshell.com</code></h3>
<ul>
<li><strong><code>tldr</code> (tldr.sh / <code>tealdeer</code>):</strong> community-maintained pages showing the 6–8 most common real-world invocations of a command instead of 800 lines of theory. Run <code>tldr tar</code> or <code>tldr comm</code> when you want a working template in 5 seconds.</li>
<li><strong><code>explainshell.com</code>:</strong> when you inherit a cryptic 140-character pipeline from a teammate’s deploy script or Stack Overflow, paste the whole command there. It matches every flag and redirection directly against official man pages so you never run a command blindly.</li>
</ul>

<h3>Step 5 (30s) — Verify on tiny dummy data in a throwaway container</h3>
<p>Reading docs tells you what you <em>think</em> a flag does; running it on 4 lines of dummy data proves what it <em>actually</em> does. For anything risky (modifying files, users, permissions, firewall rules), spin up a disposable container:</p>
<pre><code class="language-bash"><span class="tok-comment"># Disposable sandbox — everything vanishes the moment you type exit</span>
docker run --rm -it ubuntu:24.04 bash</code></pre>
<p>Test with 3–5 fake lines first, check the exit code (<code>echo \$?</code>), and only then run against real project files on <code>labflow-vps</code>.</p>

<h3>🧪 Practice (15–20 min): Teach yourself <code>column</code> and <code>comm</code> in 5 minutes</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your Spring + Node.js OJT team exports a CSV list of microservices (<code>services.csv</code>) and two dependency snapshots (<code>deps-old.txt</code> and <code>deps-new.txt</code>). Use the 5-step workflow above to teach yourself <code>column</code> (pretty tables) and <code>comm</code> (comparing sorted files) from scratch.</p><ol>
<li><strong>Step 1–3 (Identify &amp; SYNOPSIS):</strong> inside <code>~/thu-linux/tu-hoc17</code> or an <code>ubuntu:24.04</code> container, run:
<pre><code class="language-bash"><span class="tok-comment"># Commands to run yourself</span>
mkdir -p ~/thu-linux/tu-hoc17 &amp;&amp; cd ~/thu-linux/tu-hoc17
type -a column comm
comm --help
column --help | head -25</code></pre>
Read <code>comm</code>’s SYNOPSIS (<code>comm [OPTION]... FILE1 FILE2</code>) and find what <code>-1</code>, <code>-2</code>, <code>-3</code> suppress.</li>
<li><strong>Exercise A — <code>column</code> on a CSV:</strong> create a 4-line CSV and format it as an aligned table (<code>-t</code> creates a table, <code>-s,</code> sets comma as delimiter):
<pre><code class="language-bash"><span class="tok-comment"># Commands to run yourself</span>
printf 'service,port,stack\\napi-gateway,8080,Spring\\nauth-svc,3001,Node\\npostgres,5432,DB\\n' &gt; services.csv
column -t -s, services.csv</code></pre>
<em>macOS note (Chapter 15):</em> macOS’s BSD <code>column</code> supports <code>-t -s,</code>, but lacks newer GNU/util-linux flags such as <code>--table-columns</code> or <code>-o</code>.</li>
<li><strong>Exercise B — <code>comm</code> and its classic sorting trap:</strong> create two unsorted lists, try <code>comm</code> directly (observe the warning/wrong result!), then feed sorted inputs via process substitution (Chapter 13) or sorted temp files:
<pre><code class="language-bash"><span class="tok-comment"># Commands to run yourself</span>
printf 'redis\\nnginx\\npostgres\\nnode\\n' &gt; old.txt
printf 'postgres\\nkafka\\nnode\\nnginx\\n' &gt; new.txt
sort old.txt &gt; old.sorted
sort new.txt &gt; new.sorted
comm old.sorted new.sorted          <span class="tok-comment"># 3 columns: only old | only new | both</span>
comm -23 old.sorted new.sorted      <span class="tok-comment"># removed services (only in old)</span>
comm -13 old.sorted new.sorted      <span class="tok-comment"># newly added services (only in new)</span>
comm -12 old.sorted new.sorted      <span class="tok-comment"># unchanged services (in both)</span></code></pre></li>
<li><strong>Bonus (Step 4):</strong> paste <code>comm -23 &lt;(sort old.txt) &lt;(sort new.txt)</code> into <code>explainshell.com</code> or run <code>tldr comm</code> to confirm your reading.</li>
</ol>
<p><strong>Done when:</strong> <code>column -t -s, services.csv</code> prints neatly aligned columns, <code>comm -23</code> prints only <code>redis</code>, <code>comm -13</code> prints only <code>kafka</code>, <code>comm -12</code> prints <code>nginx</code>, <code>node</code> and <code>postgres</code>, and you can explain why <code>comm</code> requires sorted input.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">SYNOPSIS</span><span class="v">The compact syntax line at the top of a <code>man</code> page showing optional <code>[...]</code> and required arguments.</span></div>
  <div class="kv"><span class="k">Man section (1 / 5 / 8)</span><span class="v">Category number in manual pages: 1 = user commands, 5 = config file formats, 8 = admin commands.</span></div>
  <div class="kv"><span class="k">apropos (<code>man -k</code>)</span><span class="v">Searches short descriptions of installed manual pages by keyword when you don’t know the command name.</span></div>
  <div class="kv"><span class="k">tldr</span><span class="v">Community cheat-sheet tool showing the handful of most practical examples for a command.</span></div>
  <div class="kv"><span class="k">explainshell</span><span class="v">Web tool that breaks down a full shell command line and links every flag to its man-page paragraph.</span></div>
  <div class="kv"><span class="k">column</span><span class="v">Formats delimited text (such as CSV or colon-separated output) into neatly aligned terminal columns.</span></div>
  <div class="kv"><span class="k">comm</span><span class="v">Compares two <em>sorted</em> files line by line into 3 columns: only in file 1, only in file 2, and common to both.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Follow the 5-minute loop for any unfamiliar command: <code>type</code> → <code>--help</code> → <code>man</code> (SYNOPSIS + <code>/</code> search) → <code>tldr</code>/<code>explainshell</code> → tiny test in a throwaway container.</li>
<li>Use <code>help CMD</code> for shell builtins (<code>cd</code>, <code>read</code>, <code>ulimit</code>) because <code>man</code> may open a C library page instead.</li>
<li>In SYNOPSIS: <code>[...]</code> is optional, <code>...</code> repeats, UPPERCASE is required, <code>|</code> means pick one, and <code>--</code> ends options.</li>
<li>Specify the manual section when a name exists in both commands and config files (<code>man 1 crontab</code> vs <code>man 5 crontab</code>).</li>
<li><code>column -t -s,</code> turns messy CSV into readable tables; <code>comm -23</code> / <code>-13</code> / <code>-12</code> diffs two <strong>sorted</strong> lists cleanly.</li>
<li>Never test an unfamiliar destructive flag directly on <code>labflow-vps</code> — test in <code>docker run --rm -it ubuntu:24.04 bash</code> first.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">man7.org — Linux man-pages online</span><span class="lc-sub">Full searchable manual pages across sections 1–8 whenever you are in a minimal container without <code>man</code>.</span></span>
</a>
<a class="link-card" href="https://tldr.sh/" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">tldr pages</span><span class="lc-sub">Short, example-driven help pages for thousands of Linux, macOS and Git commands.</span></span>
</a>
<a class="link-card" href="https://explainshell.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">explainshell.com</span><span class="lc-sub">Paste any unfamiliar one-liner to see every flag, pipe and redirection explained from its official man page.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice on Code Lab</span><span class="lc-sub">Apply your self-learning workflow to real Linux &amp; Bash challenges.</span></span>
</a>

<p class="note-ct"><strong>The real graduation milestone of this course:</strong> you are no longer limited to the 172 entries in our cheat sheet. Give yourself five minutes with <code>type</code>, <code>--help</code>, <code>man</code>, <code>tldr</code> and a throwaway container, and any Linux tool you meet at FPT Software or on a client VPS becomes yours.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Phụ lục · Bài 17.3</span>
<h2>Học một lệnh mới trong 5 phút</h2>
<p class="lead">Một máy chủ Linux bình thường có hơn một nghìn file thực thi trong <code>/usr/bin</code> và <code>/usr/sbin</code>. Không kỹ sư lâu năm nào học thuộc hết tất cả — điều phân biệt người tự đứng được khi đi OJT với người cứ gặp lệnh lạ là bế tắc là một quy trình 5 phút để tự giải mã và thử nghiệm bất kỳ lệnh mới nào một cách an toàn.</p>

<h3>Quy trình 5 phút nhìn qua một lượt</h3>
<div class="lz-flow">
  <div class="lz-step"><strong>1. Nhận diện (30 giây)</strong> — <code>type -a LỆNH</code>: là builtin, alias, hàm hay file thực thi?</div>
  <div class="lz-step"><strong>2. Xem tóm tắt (1 phút)</strong> — <code>LỆNH --help</code> (hoặc <code>help LỆNH</code> nếu là builtin).</div>
  <div class="lz-step"><strong>3. Đọc chuẩn &amp; SYNOPSIS (2 phút)</strong> — <code>man LỆNH</code> + tìm bằng <code>/</code>; quên tên lệnh thì hỏi <code>apropos</code>.</div>
  <div class="lz-step"><strong>4. Xem ví dụ thật (1 phút)</strong> — <code>tldr LỆNH</code> lấy mẫu dùng ngay, <code>explainshell.com</code> mổ xẻ lệnh dài.</div>
  <div class="lz-step"><strong>5. Thử trong hộp cát (30 giây)</strong> — chạy thử trong <code>docker run --rm -it ubuntu:24.04 bash</code> trước khi đụng <code>labflow-vps</code>.</div>
</div>
<div class="callout"><strong>Lưu ý:</strong> các lệnh trong bài này là hướng dẫn để bạn tự chạy trên terminal hoặc container Ubuntu của mình (không in output giả).</div>

<h3>Bước 1 (30 giây) — Hỏi xem lệnh đó thật ra là gì: <code>type</code></h3>
<p>Trước khi mở tài liệu, hãy kiểm xem cái tên đó là lệnh dựng sẵn của shell (builtin), bí danh (alias), hàm hay file thực thi ngoài đĩa:</p>
<pre><code class="language-bash"><span class="tok-comment"># Lệnh để bạn tự chạy</span>
type -a cd ls column comm</code></pre>
<p>Nếu <code>type</code> báo <em>shell builtin</em> (như <code>cd</code>, <code>read</code>, <code>export</code>, <code>ulimit</code>), gõ <code>man read</code> rất dễ ra trang hàm C (mục 2) thay vì lệnh bash! Với builtin, hãy chạy <code>help read</code>.</p>

<h3>Bước 2 (1 phút) — Đọc bảng tóm tắt tích hợp: <code>--help</code></h3>
<p>Phần lớn công cụ GNU in danh sách cờ gọn trong một hai màn hình khi thêm <code>--help</code> (dài quá thì đẩy qua <code>less</code>):</p>
<pre><code class="language-bash"><span class="tok-comment"># Lệnh để bạn tự chạy</span>
column --help | less
comm --help</code></pre>
<p>Trên macOS (công cụ BSD) hoặc tiện ích cũ, <code>--help</code> đôi khi báo lỗi "illegal option"; thử <code>-h</code> hoặc sang thẳng bước <code>man</code>.</p>

<h3>Bước 3 (2 phút) — Đọc <code>man</code> và giải mã <code>SYNOPSIS</code></h3>
<p>Đừng đọc trang <code>man</code> từ đầu tới cuối như tiểu thuyết. Nhìn thẳng vào mục <strong>SYNOPSIS</strong> (dòng ngữ pháp lệnh), rồi bấm phím <code>/</code> để tìm đúng cờ hoặc từ khoá bạn cần (<code>n</code> kết quả sau, <code>N</code> kết quả trước, <code>g</code> lên đầu, <code>G</code> xuống cuối, <code>q</code> thoát).</p>
<p><strong>Cách đọc từng ký hiệu trong dòng <code>SYNOPSIS</code>:</strong></p>
<table>
<tr><th>Ký hiệu trong SYNOPSIS</th><th>Ý nghĩa</th><th>Ví dụ</th></tr>
<tr><td><code>[OPTION]</code></td><td>Ngoặc vuông = <strong>tuỳ chọn</strong> (không bắt buộc)</td><td><code>comm [OPTION]... FILE1 FILE2</code></td></tr>
<tr><td><code>...</code></td><td>Ba chấm = có thể lặp lại nhiều lần</td><td><code>[FILE]...</code> nhận 0, 1 hoặc nhiều file</td></tr>
<tr><td><code>FILE1 FILE2</code> hoặc <code>&lt;file&gt;</code></td><td>Chữ HOA / ngoặc nhọn = tham số <strong>bắt buộc</strong> bạn phải điền</td><td><code>comm</code> bắt buộc truyền đủ <code>FILE1</code> và <code>FILE2</code></td></tr>
<tr><td><code>-a | -b</code></td><td>Dấu gạch đứng = chọn MỘT trong các phương án</td><td><code>[-s | -t]</code></td></tr>
<tr><td><code>-c, --count</code></td><td>Cờ ngắn và cờ dài tương đương nhau</td><td><code>-c</code> giống hệt <code>--count</code></td></tr>
<tr><td><code>--</code></td><td>Kết thúc danh sách cờ (mọi thứ phía sau là tên file)</td><td><code>rm -- -file-la</code></td></tr>
</table>
<p><strong>Nhớ đúng ba mục <code>man</code> hay dùng nhất khi đi làm:</strong></p>
<ul>
<li><strong>Mục 1</strong> — lệnh người dùng (<code>man 1 crontab</code> giải thích lệnh <code>crontab</code>).</li>
<li><strong>Mục 5</strong> — định dạng file cấu hình (<code>man 5 crontab</code> giải thích 5 cột thời gian; <code>man 5 sshd_config</code> giải thích từng dòng cấu hình SSH).</li>
<li><strong>Mục 8</strong> — lệnh quản trị hệ thống (<code>man 8 userdel</code>, <code>man 8 mount</code>).</li>
</ul>
<p><strong>Chỉ nhớ việc muốn làm mà quên tên lệnh? Dùng <code>apropos</code> (tương đương <code>man -k</code>):</strong></p>
<pre><code class="language-bash"><span class="tok-comment"># Lệnh để bạn tự chạy (trong container Ubuntu trần cần cài man-db và manpages trước)</span>
apropos 'compare'
apropos -s 1,8 'user'</code></pre>
<div class="pitfall co-tieu-de"><strong>Ảnh Docker tối giản thường cắt bỏ trang man cho nhẹ.</strong> Trong container <code>ubuntu:24.04</code> trần, <code>man</code> hoặc <code>apropos</code> có thể chưa cài sẵn hoặc báo "nothing appropriate". Trên VPS thường và WSL2 thì có sẵn; khi thiếu bạn có thể đọc đúng trang đó trên mạng tại <code>man7.org/linux/man-pages/</code>.</div>

<h3>Bước 4 (1 phút) — Lấy ví dụ thực dụng: <code>tldr</code> và <code>explainshell.com</code></h3>
<ul>
<li><strong><code>tldr</code> (tldr.sh / <code>tealdeer</code>):</strong> bộ trang tóm tắt do cộng đồng duy trì, chỉ hiện 6–8 cách gõ hay gặp nhất thay vì 800 dòng lý thuyết. Gõ <code>tldr tar</code> hay <code>tldr comm</code> là có mẫu chạy ngay trong 5 giây.</li>
<li><strong><code>explainshell.com</code>:</strong> khi nhận một dòng lệnh dài 140 ký tự từ script deploy cũ của đồng nghiệp hoặc trên Stack Overflow, dán nguyên dòng đó vào đây. Trang web tự nối từng cờ và dấu chuyển hướng tới đúng đoạn giải thích trong trang <code>man</code> để bạn không bao giờ chạy mù.</li>
</ul>

<h3>Bước 5 (30 giây) — Thử trên vài dòng dữ liệu giả trong container vứt đi</h3>
<p>Đọc tài liệu chỉ cho biết bạn <em>nghĩ</em> cờ đó làm gì; chạy thử trên 4 dòng dữ liệu giả mới chứng minh nó <em>thật sự</em> làm gì. Với bất kỳ lệnh nào có rủi ro (sửa file, tài khoản, phân quyền, tường lửa), mở ngay một container tạm:</p>
<pre><code class="language-bash"><span class="tok-comment"># Sân tập vứt đi — gõ exit là sạch dấu vết</span>
docker run --rm -it ubuntu:24.04 bash</code></pre>
<p>Thử trên 3–5 dòng mẫu trước, kiểm mã thoát (<code>echo \$?</code>), thấy khớp dự đoán rồi mới mang lên dự án thật trên <code>labflow-vps</code>.</p>

<h3>🧪 Thực hành (15–20 phút): Tự học <code>column</code> và <code>comm</code> trong 5 phút</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> nhóm dự án Spring + Node.js lúc OJT xuất ra một file CSV danh sách microservice (<code>services.csv</code>) và hai bản chụp danh sách dịch vụ (<code>old.txt</code>, <code>new.txt</code>). Hãy áp dụng đúng quy trình 5 bước ở trên để tự học <code>column</code> (căn bảng đẹp) và <code>comm</code> (so hai danh sách đã sắp xếp) từ con số 0.</p><ol>
<li><strong>Bước 1–3 (Nhận diện &amp; SYNOPSIS):</strong> trong <code>~/thu-linux/tu-hoc17</code> hoặc container <code>ubuntu:24.04</code>, chạy:
<pre><code class="language-bash"><span class="tok-comment"># Lệnh để bạn tự chạy</span>
mkdir -p ~/thu-linux/tu-hoc17 &amp;&amp; cd ~/thu-linux/tu-hoc17
type -a column comm
comm --help
column --help | head -25</code></pre>
Đọc dòng SYNOPSIS của <code>comm</code> (<code>comm [OPTION]... FILE1 FILE2</code>) và tìm xem ba cờ <code>-1</code>, <code>-2</code>, <code>-3</code> ẩn cột nào.</li>
<li><strong>Bài A — Dùng <code>column</code> trên file CSV:</strong> tạo file CSV 4 dòng rồi căn thành bảng gọn (<code>-t</code> dựng bảng, <code>-s,</code> chọn dấu phẩy làm ký tự tách cột):
<pre><code class="language-bash"><span class="tok-comment"># Lệnh để bạn tự chạy</span>
printf 'service,port,stack\\napi-gateway,8080,Spring\\nauth-svc,3001,Node\\npostgres,5432,DB\\n' &gt; services.csv
column -t -s, services.csv</code></pre>
<em>Ghi chú macOS (Chương 15):</em> bản <code>column</code> BSD trên Mac hiểu <code>-t -s,</code>, nhưng thiếu các cờ mới của util-linux trên Ubuntu như <code>--table-columns</code> hay <code>-o</code>.</li>
<li><strong>Bài B — Dùng <code>comm</code> và cái bẫy sắp xếp kinh điển:</strong> tạo hai danh sách chưa sắp xếp, thử chạy <code>comm</code> trực tiếp để thấy cảnh báo/kết quả lệch, rồi sắp xếp trước khi so:
<pre><code class="language-bash"><span class="tok-comment"># Lệnh để bạn tự chạy</span>
printf 'redis\\nnginx\\npostgres\\nnode\\n' &gt; old.txt
printf 'postgres\\nkafka\\nnode\\nnginx\\n' &gt; new.txt
sort old.txt &gt; old.sorted
sort new.txt &gt; new.sorted
comm old.sorted new.sorted          <span class="tok-comment"># 3 cột: chỉ ở old | chỉ ở new | có cả hai</span>
comm -23 old.sorted new.sorted      <span class="tok-comment"># dịch vụ bị gỡ (chỉ có ở old)</span>
comm -13 old.sorted new.sorted      <span class="tok-comment"># dịch vụ mới thêm (chỉ có ở new)</span>
comm -12 old.sorted new.sorted      <span class="tok-comment"># dịch vụ giữ nguyên (có ở cả hai)</span></code></pre></li>
<li><strong>Thưởng thêm (Bước 4):</strong> dán <code>comm -23 &lt;(sort old.txt) &lt;(sort new.txt)</code> vào <code>explainshell.com</code> hoặc gõ <code>tldr comm</code> để kiểm chứng lại cách bạn vừa hiểu.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>column -t -s, services.csv</code> in bảng thẳng hàng, <code>comm -23</code> chỉ in <code>redis</code>, <code>comm -13</code> chỉ in <code>kafka</code>, <code>comm -12</code> in <code>nginx</code>, <code>node</code> và <code>postgres</code>, và bạn giải thích được vì sao <code>comm</code> bắt buộc đầu vào phải được <code>sort</code> trước.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">SYNOPSIS (cú pháp tóm tắt)</span><span class="v">Dòng ngữ pháp ở đầu trang <code>man</code> cho biết tham số nào tuỳ chọn <code>[...]</code> và tham số nào bắt buộc.</span></div>
  <div class="kv"><span class="k">Man section (mục trang man: 1 / 5 / 8)</span><span class="v">Phân loại tài liệu man: 1 = lệnh người dùng, 5 = định dạng file cấu hình, 8 = lệnh quản trị.</span></div>
  <div class="kv"><span class="k">apropos (tìm lệnh theo mô tả, <code>man -k</code>)</span><span class="v">Tìm trong mô tả ngắn của trang man theo từ khoá khi bạn chưa nhớ tên lệnh.</span></div>
  <div class="kv"><span class="k">tldr (tóm tắt ví dụ nhanh)</span><span class="v">Công cụ cộng đồng chỉ liệt kê vài cách dùng thực tế nhất của một lệnh.</span></div>
  <div class="kv"><span class="k">explainshell (giải mã dòng lệnh)</span><span class="v">Trang web mổ xẻ một dòng lệnh dài và gắn từng cờ vào đúng đoạn giải thích trong trang man.</span></div>
  <div class="kv"><span class="k">column (căn cột bảng)</span><span class="v">Biến dữ liệu tách bằng dấu phẩy/khoảng trắng thành bảng thẳng hàng dễ đọc trên terminal.</span></div>
  <div class="kv"><span class="k">comm (so hai file đã sắp xếp)</span><span class="v">So sánh hai file <em>đã sort</em> theo từng dòng ra 3 cột: chỉ ở file 1, chỉ ở file 2 và chung cả hai.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Áp dụng vòng lặp 5 phút cho mọi lệnh lạ: <code>type</code> → <code>--help</code> → <code>man</code> (SYNOPSIS + tìm <code>/</code>) → <code>tldr</code>/<code>explainshell</code> → thử nhỏ trong container vứt đi.</li>
<li>Với lệnh dựng sẵn của shell (<code>cd</code>, <code>read</code>, <code>ulimit</code>), dùng <code>help LỆNH</code> thay vì <code>man</code> kẻo mở nhầm trang hàm C.</li>
<li>Đọc SYNOPSIS: <code>[...]</code> là tuỳ chọn, <code>...</code> lặp nhiều lần, CHỮ HOA là bắt buộc, <code>|</code> chọn một, và <code>--</code> kết thúc cờ.</li>
<li>Ghi rõ số mục khi lệnh và file cấu hình trùng tên (<code>man 1 crontab</code> khác <code>man 5 crontab</code>).</li>
<li><code>column -t -s,</code> làm đẹp CSV ngay trên terminal; <code>comm -23</code> / <code>-13</code> / <code>-12</code> so nhanh hai danh sách <strong>đã sort</strong>.</li>
<li>Không bao giờ thử cờ lạ có tính phá huỷ thẳng trên <code>labflow-vps</code> — luôn thử trong <code>docker run --rm -it ubuntu:24.04 bash</code> trước.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">man7.org — Trang man Linux trực tuyến</span><span class="lc-sub">Tra cứu đầy đủ trang man mục 1–8 ngay cả khi bạn đang ở trong container tối giản không cài <code>man</code>.</span></span>
</a>
<a class="link-card" href="https://tldr.sh/" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">tldr pages</span><span class="lc-sub">Tài liệu hướng dẫn siêu ngắn thiên về ví dụ cho hàng nghìn lệnh Linux, macOS và Git.</span></span>
</a>
<a class="link-card" href="https://explainshell.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">explainshell.com</span><span class="lc-sub">Dán bất kỳ dòng lệnh dài nào để thấy từng cờ, ống dẫn và chuyển hướng được bóc tách từ trang man gốc.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện trên Code Lab</span><span class="lc-sub">Đem quy trình tự học lệnh mới áp dụng ngay vào bài tập thực tế trên track Linux &amp; Bash.</span></span>
</a>

<p class="note-ct"><strong>Cột mốc tốt nghiệp thật sự của khoá học này:</strong> bạn không còn bị giới hạn trong 172 mục lệnh ở bảng tra nhanh. Chỉ cần 5 phút với <code>type</code>, <code>--help</code>, <code>man</code>, <code>tldr</code> và một container vứt đi, mọi công cụ Linux bạn gặp ở FPT Software hay trên bất kỳ VPS nào đều nằm trong tầm tay bạn.</p>
</div>
`,
    },

    /* ─────────────────────────── 17.4 ─────────────────────────── */
    {
      title: '17.4 — Appendix check|||17.4 — Kiểm tra Phụ lục',
      slug: 'lnx-17-4-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống kiểm tra kiến thức Phụ lục: bẫy envsubst với Nginx, giới hạn shred trên SSD/CoW, userdel -r và file mồ côi, đọc lscpu và hạn mức container, whereis vs type, wget -O vs -o, giới hạn pháp lý và kết quả của nmap, yum/dnf trên họ RHEL, đọc SYNOPSIS/mục man, và cái bẫy sort của comm.',
      content: `
<div class="ml-en">
<span class="eyebrow">Appendix · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten realistic OJT and VPS situations covering the eight missing commands, the situation cheat sheet and the 5-minute command-learning workflow. Every output-based question matches the real Ubuntu 24.04 container transcript recorded for Lesson 17.1.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I know why <code>envsubst</code> needs a single-quoted variable allowlist on Nginx templates, and why <code>export</code> matters.</li>
<li>I can explain why <code>shred -u</code> does not guarantee erasure on SSDs or copy-on-write filesystems, and what protects secrets instead.</li>
<li>I know the difference between <code>userdel</code> and <code>userdel -r</code>, plus the safe steps before deleting a production user.</li>
<li>I can read physical cores vs logical CPUs from <code>lscpu</code> and know the container cgroup caveat.</li>
<li>I know when to pick <code>wget</code> vs <code>curl</code>, when to use <code>yum</code>/<code>dnf</code> on RHEL-family servers, and the strict legal boundary of <code>nmap</code>.</li>
<li>I can decode a <code>man</code> <code>SYNOPSIS</code> line and use <code>column</code> and <code>comm</code> without hitting the unsorted-input trap.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Phụ lục · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống thực tế lúc đi OJT và vận hành VPS xoay quanh 8 lệnh còn thiếu, bảng tra nhanh và quy trình tự học lệnh mới trong 5 phút. Mọi câu hỏi về output đều bám đúng bản ghi chạy thật trong container Ubuntu 24.04 của Bài 17.1.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi biết vì sao <code>envsubst</code> cần danh sách biến trong nháy đơn khi sinh file Nginx, và vì sao phải <code>export</code>.</li>
<li>Tôi giải thích được vì sao <code>shred -u</code> không đảm bảo xoá sạch trên SSD hay hệ thống file copy-on-write, và giải pháp đúng là gì.</li>
<li>Tôi phân biệt được <code>userdel</code> và <code>userdel -r</code>, cùng các bước an toàn trước khi xoá tài khoản trên máy chủ thật.</li>
<li>Tôi đọc được nhân vật lý so với CPU logic từ <code>lscpu</code> và biết bẫy hạn mức cgroup trong container.</li>
<li>Tôi biết khi nào chọn <code>wget</code> hay <code>curl</code>, biết dùng <code>yum</code>/<code>dnf</code> trên server họ RHEL, và nhớ ranh giới pháp lý của <code>nmap</code>.</li>
<li>Tôi đọc được dòng <code>SYNOPSIS</code> trong <code>man</code> và dùng được <code>column</code>, <code>comm</code> mà không vấp lỗi file chưa sắp xếp.</li>
</ul>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'You render nginx.conf.tpl (containing $APP_PORT, $APP_NAME, $host and $uri) using envsubst. Which command replaces ONLY $APP_PORT and $APP_NAME without wiping Nginx’s $host and $uri?|||Bạn sinh file từ nginx.conf.tpl (chứa $APP_PORT, $APP_NAME, $host và $uri) bằng envsubst. Lệnh nào CHỈ thay $APP_PORT và $APP_NAME mà không xoá sạch $host và $uri của Nginx?',
            options: [
              'envsubst < nginx.conf.tpl > nginx.conf',
              'envsubst "$APP_PORT $APP_NAME" < nginx.conf.tpl > nginx.conf',
              'envsubst \'$APP_PORT $APP_NAME\' < nginx.conf.tpl > nginx.conf',
              'envsubst \'$APP_PORT $APP_NAME\' < nginx.conf.tpl > nginx.conf.tpl',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Single quotes pass the literal string \'$APP_PORT $APP_NAME\' to envsubst as an allowlist, leaving $host and $uri intact. Double quotes are the biggest trap: bash expands them to "8080 labflow" BEFORE envsubst runs, so envsubst sees no variable names and substitutes nothing! Bare envsubst wipes $host/$uri to empty, and redirecting > back to nginx.conf.tpl truncates the input file to 0 bytes first.|||VI: Dấu nháy đơn truyền nguyên chuỗi \'$APP_PORT $APP_NAME\' làm danh sách cho phép của envsubst, giữ nguyên $host và $uri. Dấu nháy kép là bẫy dễ dính nhất: bash mở rộng nó thành "8080 labflow" TRƯỚC khi envsubst chạy nên envsubst không thấy tên biến nào để thay! Chạy envsubst trần sẽ xoá sạch $host/$uri, còn ghi > đè lại nginx.conf.tpl sẽ làm trống file nguồn trước khi kịp đọc.',
          },
          {
            question: 'A teammate accidentally saved a production database password in /tmp/db.env on an NVMe SSD VPS using a modern filesystem, then ran shred -u /tmp/db.env and said “it is 100% unrecoverable”. What is the most accurate assessment?|||Một bạn cùng nhóm lỡ lưu mật khẩu CSDL production vào /tmp/db.env trên VPS dùng ổ SSD NVMe và hệ thống file hiện đại, rồi chạy shred -u /tmp/db.env và bảo “chắc chắn 100% không khôi phục được nữa”. Nhận định nào đúng nhất?',
            options: [
              'Not guaranteed — SSD wear-leveling, journaling/copy-on-write filesystems or snapshots can preserve old blocks; rotate the password and rely on full-disk encryption|||Không đảm bảo — cơ chế cân bằng hao mòn của SSD, journaling/copy-on-write hoặc snapshot vẫn có thể giữ block cũ; hãy đổi mật khẩu và dùng mã hoá toàn đĩa',
              'Guaranteed as long as you add -n 10 -z so it overwrites ten times plus zeros|||Đảm bảo 100% miễn là thêm -n 10 -z để ghi đè mười lượt kèm lượt số 0',
              'shred only removes the filename like rm; it never overwrites file content|||shred chỉ gỡ tên file như rm chứ không bao giờ ghi đè nội dung file',
              'It is guaranteed on Linux ext4, and only fails on macOS APFS|||Đảm bảo trên mọi ext4 của Linux, chỉ không ăn trên APFS của macOS',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: shred assumes writes overwrite the exact same physical blocks in place. SSD wear-leveling redirects writes to fresh flash cells, and copy-on-write filesystems, data-journaling modes, or EBS/LVM snapshots can keep untouched copies — even with -n 10 -z (the tempting distractor). Full-disk encryption (LUKS/FileVault) plus rotating leaked secrets is the real defense.|||VI: shred giả định lượt ghi đè trúng đúng block vật lý cũ. SSD có wear-leveling tự chuyển sang ô nhớ flash mới, còn hệ thống file copy-on-write, chế độ data-journal hay snapshot EBS/LVM đều có thể giữ nguyên bản cũ — dù có tăng lên -n 10 -z (phương án gây nhiễu hấp dẫn nhất). Bảo vệ thật là mã hoá toàn đĩa (LUKS/FileVault) và đổi ngay mật khẩu bị lộ.',
          },
          {
            question: 'On labflow-vps, an intern’s OJT has ended. You want to remove account demo cleanly without leaving orphan UID files in /home or losing anything important they owned. What is the safest workflow?|||Trên labflow-vps, một bạn thực tập vừa kết thúc kỳ OJT. Bạn muốn xoá sạch tài khoản demo mà không để lại file mồ côi trong /home cũng như không làm mất dữ liệu quan trọng. Quy trình nào an toàn nhất?',
            options: [
              'Run sudo userdel -f demo immediately so no sessions stay open|||Chạy ngay sudo userdel -f demo để không còn phiên nào mở',
              'Run sudo userdel demo without -r so /home/demo stays forever as a backup|||Chạy sudo userdel demo không có -r để giữ /home/demo mãi làm bản sao lưu',
              'Delete /home/demo manually with rm -rf first, then edit /etc/passwd by hand|||Xoá tay /home/demo bằng rm -rf trước rồi tự sửa /etc/passwd',
              'Lock the account (usermod -L), check running processes/cron, back up /home/demo, run sudo userdel -r demo, then audit stray files with find / -nouser|||Khoá tài khoản (usermod -L), kiểm tra tiến trình/cron, sao lưu /home/demo, chạy sudo userdel -r demo, rồi rà file mồ côi bằng find / -nouser',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Locking first stops new logins while letting you audit processes, cron jobs and back up /home/demo; userdel -r then removes the account, home directory and mail spool; find / -nouser catches files outside /home. Leaving /home/demo behind without -r is tempting as a “backup”, but a future user reusing that numeric UID would inherit those files. Never hand-edit /etc/passwd or casually use -f.|||VI: Khoá tài khoản trước giúp chặn đăng nhập mới trong lúc bạn kiểm tra tiến trình, cron và sao lưu /home/demo; sau đó userdel -r xoá sạch tài khoản, thư mục home và mail spool; find / -nouser tìm nốt file ngoài /home. Bỏ -r để “làm sao lưu” nghe có lý, nhưng tài khoản tạo sau trùng UID số đó sẽ tự dưng sở hữu toàn bộ file cũ. Đừng sửa tay /etc/passwd hay lạm dụng -f.',
          },
          {
            question: 'Inside a Docker container capped at --cpus=1, lscpu prints: Architecture: x86_64, CPU(s): 12, Thread(s) per core: 2, Core(s) per socket: 6. Which statement is true?|||Trong một container Docker bị giới hạn --cpus=1, lscpu in: Architecture: x86_64, CPU(s): 12, Thread(s) per core: 2, Core(s) per socket: 6. Phát biểu nào đúng?',
            options: [
              'The container has 12 physical cores available, so PM2 should spawn 12 Node.js workers|||Container có sẵn 12 nhân vật lý nên PM2 cần mở 12 worker Node.js',
              'The host has 6 physical cores (12 logical CPUs), and lscpu shows the HOST hardware — not the container’s 1-CPU cgroup cap|||Máy host có 6 nhân vật lý (12 CPU logic), và lscpu hiện phần cứng của máy HOST chứ không phải hạn mức cgroup 1 CPU của container',
              'The server is ARM64, so you must download the linux-arm64 JDK build|||Máy chủ là ARM64 nên phải tải bản JDK linux-arm64',
              'CPU(s): 12 means 12 sockets with 1 core each|||CPU(s): 12 nghĩa là có 12 socket, mỗi socket 1 nhân',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: 6 cores per socket × 2 threads per core = 12 logical CPUs (x86_64, not ARM64). Crucially, lscpu reads host CPU topology and ignores container cgroup quotas — spawning 12 workers inside a 1-CPU container wastes RAM and causes thrashing. Option A is the classic production mistake.|||VI: 6 nhân mỗi socket × 2 luồng mỗi nhân = 12 CPU logic (kiến trúc x86_64, không phải ARM64). Quan trọng hơn, lscpu đọc phần cứng máy host và không tính hạn mức cgroup của container — mở 12 worker trong container 1 CPU sẽ tốn RAM và gây nghẽn chuyển ngữ cảnh. Phương án A chính là lỗi đi làm kinh điển.',
          },
          {
            question: 'You installed Node.js via NVM in ~/.nvm/ and also defined alias ll="ls -lah". Why does whereis ll print nothing and whereis node miss your NVM binary?|||Bạn cài Node.js qua NVM trong ~/.nvm/ và đặt thêm alias ll="ls -lah". Vì sao whereis ll không in gì và whereis node bỏ sót bản Node của NVM?',
            options: [
              'whereis only searches fixed system directories for binaries, sources and man pages; it ignores shell aliases, builtins and custom user paths like ~/.nvm — use type -a instead|||whereis chỉ quét các thư mục hệ thống cố định để tìm binary, mã nguồn và trang man; nó bỏ qua alias, builtin và đường dẫn riêng như ~/.nvm — hãy dùng type -a',
              'whereis is deprecated and always returns empty output on Ubuntu 24.04|||whereis đã bị khai tử và luôn trả về rỗng trên Ubuntu 24.04',
              'whereis requires sudo to read files inside your own home directory|||whereis cần sudo mới đọc được file trong thư mục home của chính bạn',
              'NVM binaries are shell scripts, and whereis only detects compiled C programs|||Binary của NVM là shell script, còn whereis chỉ nhận diện chương trình C biên dịch',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: whereis scans a fixed list of standard system directories (visible via whereis -l) for binaries, sources and man pages — it does not query the shell’s alias table or your NVM PATH additions. On Ubuntu 24.04 it works fine for system commands (measured: whereis ls bash -> /usr/bin/ls, /usr/bin/bash). Use type -a or command -v to see what your shell will actually execute.|||VI: whereis chỉ quét danh sách thư mục hệ thống cố định (xem bằng whereis -l) để tìm binary, mã nguồn và trang man — nó không hỏi bảng alias của shell hay đường dẫn NVM bạn thêm vào PATH. Trên Ubuntu 24.04 nó vẫn chạy tốt cho lệnh hệ thống (đo thật: whereis ls bash -> /usr/bin/ls, /usr/bin/bash). Muốn biết shell sẽ chạy đúng cái gì, dùng type -a hoặc command -v.',
          },
          {
            question: 'You run wget -o app.tar.gz https://example.com/release.tar.gz expecting the downloaded archive to be saved as app.tar.gz. What actually happens?|||Bạn chạy wget -o app.tar.gz https://example.com/release.tar.gz với kỳ vọng file nén tải về sẽ lưu tên app.tar.gz. Chuyện gì thật sự xảy ra?',
            options: [
              'The archive is saved as app.tar.gz, same as -O|||File nén được lưu thành app.tar.gz, giống hệt cờ -O',
              'wget refuses to run because -o is not a valid flag|||wget từ chối chạy vì -o không phải cờ hợp lệ',
              'app.tar.gz receives wget’s text LOG output, while the archive itself is saved as release.tar.gz; you needed uppercase -O app.tar.gz|||app.tar.gz chứa LOG dạng chữ của wget, còn file nén thật lại lưu dưới tên release.tar.gz; đáng lẽ phải dùng -O hoa',
              'wget only checks headers without saving anything (spider mode)|||wget chỉ kiểm tra header mà không lưu gì (chế độ spider)',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: In wget, lowercase -o FILE writes wget’s log messages to FILE, whereas uppercase -O FILE sets the downloaded document filename (and -O- sends it to stdout). Mixing up -o and -O is one of the most common wget mistakes, often producing a “corrupt tar.gz” that is actually wget’s text log!|||VI: Trong wget, chữ -o thường ghi log hoạt động của wget ra file, còn -O hoa mới đặt tên cho file dữ liệu tải về (và -O- in ra stdout). Nhầm -o với -O là lỗi cực hay gặp của wget, dẫn tới giải nén “file .tar.gz bị hỏng” mà mở ra thấy toàn chữ log của wget!',
          },
          {
            question: 'Inside a fresh Ubuntu 24.04 container with no services started, you run: nmap -sT -p 22,80,443 --open 127.0.0.1 | tail -5. It prints only “Starting Nmap…” and “Nmap done: 1 IP address (1 host up) scanned in 0.02 seconds” — no port table. Why, and what rule governs nmap use?|||Trong một container Ubuntu 24.04 mới tinh chưa bật dịch vụ nào, bạn chạy: nmap -sT -p 22,80,443 --open 127.0.0.1 | tail -5. Nó chỉ in dòng “Starting Nmap…” và “Nmap done: 1 IP address (1 host up) scanned in 0.02 seconds” mà không có bảng cổng. Vì sao, và luật nào chi phối việc dùng nmap?',
            options: [
              'nmap failed because -sT requires root; you can freely scan any public site once you use sudo|||nmap lỗi vì -sT cần root; có sudo rồi thì quét trang công khai nào cũng được',
              'Ports 22, 80 and 443 are all closed so --open hides them; and you must ONLY scan hosts you own or have written permission to test|||Cả ba cổng 22, 80, 443 đều đang đóng nên --open ẩn đi; và CHỈ được quét máy của chính bạn hoặc hệ thống có văn bản cho phép',
              '127.0.0.1 is unreachable from inside a container, so 0 hosts were scanned|||Không thể chạm tới 127.0.0.1 trong container nên có 0 host được quét',
              'nmap never prints TCP ports unless you pass -sV|||nmap không bao giờ in cổng TCP nếu thiếu cờ -sV',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Measured in Ubuntu 24.04: -sT (TCP connect scan) works without root, 1 host was up, and because no SSH/HTTP daemon was listening, --open suppressed all closed ports. Legally and professionally, scanning machines you do not own without written authorization can violate company rules and cybersecurity laws. Option A gets both the technical fact (-sT needs no root; -sS does) and the legal boundary wrong.|||VI: Đo thật trên Ubuntu 24.04: -sT (TCP connect scan) chạy không cần root, máy đích vẫn sống (1 host up), nhưng vì chưa bật SSH/Nginx nên --open ẩn hết các cổng đóng. Về pháp lý và nghề nghiệp, quét máy không thuộc quyền sở hữu khi chưa có văn bản cho phép có thể vi phạm nội quy công ty và pháp luật. Phương án A sai cả kỹ thuật (-sT không cần root, -sS mới cần) lẫn ranh giới pháp lý.',
          },
          {
            question: 'During OJT you SSH into a Rocky Linux 9 server for a Spring Boot project. apt is not found, and envsubst is missing. Which command finds which RPM package provides envsubst?|||Khi đi OJT bạn SSH vào một server Rocky Linux 9 chạy Spring Boot. Không có lệnh apt, và đang thiếu lệnh envsubst. Lệnh nào tìm đúng gói RPM chứa envsubst?',
            options: [
              'dpkg -S envsubst',
              'apt-cache search envsubst',
              'whereis -b envsubst',
              'yum provides \'*/envsubst\' (or dnf provides \'*/envsubst\')',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Rocky Linux 9 belongs to the Red Hat family, where dnf replaced yum (and yum is kept as a symlink to dnf). yum/dnf provides searches repository metadata to tell you which package ships a given file path even before that package is installed. dpkg -S and apt-cache only exist on Debian/Ubuntu, and whereis only checks files already on disk.|||VI: Rocky Linux 9 thuộc họ Red Hat, nơi dnf thay thế yum (và yum vẫn chạy nhờ là symlink trỏ sang dnf). Lệnh yum/dnf provides tra thẳng kho gói để chỉ ra gói nào chứa file đó ngay cả khi chưa cài. dpkg -S và apt-cache chỉ có trên Debian/Ubuntu, còn whereis chỉ tìm file đã nằm sẵn trên đĩa.',
          },
          {
            question: 'You want to check the 5-column time format of a crontab file (not the flags of the crontab command), and you also see a man SYNOPSIS: tar [OPTION]... [FILE].... Which statement is right?|||Bạn muốn tra cứu định dạng 5 cột thời gian trong file crontab (không phải cờ của lệnh crontab), và bạn thấy dòng SYNOPSIS: tar [OPTION]... [FILE].... Phát biểu nào đúng?',
            options: [
              'Run man 5 crontab for the file format; in SYNOPSIS, [...] means optional and ... means the item can be repeated|||Chạy man 5 crontab để xem định dạng file; trong SYNOPSIS, [...] là tuỳ chọn và ... nghĩa là có thể lặp nhiều lần',
              'Run man 1 crontab for the file format; [...] means mandatory arguments|||Chạy man 1 crontab để xem định dạng file; [...] nghĩa là tham số bắt buộc',
              'Run man 8 crontab for the file format; ... means the rest of the flags are hidden|||Chạy man 8 crontab để xem định dạng file; ... nghĩa là các cờ còn lại bị ẩn đi',
              'Run help crontab because crontab is a bash builtin|||Chạy help crontab vì crontab là lệnh dựng sẵn của bash',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Manual section 1 documents user commands (man 1 crontab), section 5 documents config file formats (man 5 crontab — the 5 time fields), and section 8 documents admin commands. In SYNOPSIS notation, square brackets [...] denote optional elements and ... means zero or more repetitions. crontab is an external binary, not a bash builtin.|||VI: Mục 1 của man mô tả lệnh người dùng (man 1 crontab), mục 5 mô tả định dạng file cấu hình (man 5 crontab — 5 cột thời gian), còn mục 8 là lệnh quản trị. Trong ký hiệu SYNOPSIS, ngoặc vuông [...] chỉ thành phần tuỳ chọn và ... nghĩa là có thể lặp nhiều lần. crontab là file thực thi ngoài, không phải builtin của bash.',
          },
          {
            question: 'You want to find packages listed in old.txt that are NOT in new.txt using comm. Both files are currently unsorted. Which command gives the right answer?|||Bạn muốn tìm những gói có trong old.txt nhưng KHÔNG có trong new.txt bằng lệnh comm. Hiện cả hai file đều chưa được sắp xếp. Lệnh nào cho kết quả đúng?',
            options: [
              'comm -12 old.txt new.txt',
              'comm -23 old.txt new.txt',
              'comm -23 <(sort old.txt) <(sort new.txt)',
              'column -t -s, old.txt new.txt',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: comm compares two inputs in a single pass and REQUIRES both to be sorted first (otherwise it warns and misses matches). Columns are: 1 = only in file 1, 2 = only in file 2, 3 = in both — so -23 suppresses columns 2 and 3, leaving only lines unique to old.txt. Option B has the right flags (-23) but skips sorting; -12 prints lines common to both; column aligns tables rather than diffing lists.|||VI: comm so sánh hai đầu vào trong một lượt quét nên BẮT BUỘC cả hai phải được sort trước (không thì vừa báo lỗi vừa lệch kết quả). Ba cột lần lượt là: 1 = chỉ ở file 1, 2 = chỉ ở file 2, 3 = có ở cả hai — nên -23 ẩn cột 2 và 3, giữ đúng các dòng chỉ có trong old.txt. Phương án B đúng cờ (-23) nhưng quên sort; -12 in phần giao chung; còn column dùng để căn bảng chứ không so khác biệt.',
          },
        ],
      },
    },
  ],
};
