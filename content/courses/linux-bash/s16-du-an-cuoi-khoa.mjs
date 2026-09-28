/**
 * Linux & Bash — Chương 16 (MỚI, 29/09/2026): Dự án cuối khoá — dựng, tự động hoá và vận hành một máy chủ thật.
 * 16.0 slide (deck lx-16, 32 slide) · 16.1 ngày 1: user riêng, cây thư mục, SSH chỉ khoá, ufw, bootstrap.sh idempotent
 * · 16.2 deploy.sh (flock, trap, releases + symlink current, health check, tự quay lui) + unit systemd (User=,
 * Restart=, MemoryMax=, MemorySwapMax=0, EnvironmentFile=) · 16.3 timer sao lưu giữ 7 bản, logrotate + SIGHUP, giám
 * sát chỉ báo khi trạng thái đổi (webhook giả lập), journalctl, báo cáo sáng · 16.4 tám sự cố tuần đầu dựng lại thật
 * · 16.5 bài thi cuối khoá 20 câu (Mục 0 → Ch16).
 * MỌI lệnh và output chạy thật đêm 28→29/09/2026: container ubuntu:24.04 CÓ systemd 255 (ảnh tạm lx16-img:
 * openssh-server 9.6, nginx 1.24.0, python3 3.12.3, sqlite3, logrotate, cron 3.0pl1-184ubuntu2, ufw; --privileged
 * ngắn hạn, --memory 512m, hostname clinic-vps, đồng hồ UTC); Fedora 44 (linux-nha, chỉ đọc: SELinux); Mac M1
 * macOS 27 (bsdtar 3.5.3, /bin/bash 3.2.57, BSD head/mv/stat); strace ln trên ubuntu:24.04, debian:12, alpine.
 * Script của dự án (bootstrap/deploy/sao-luu/giam-sat/bao-cao-sang) qua ShellCheck sạch.
 * File này SINH từ nguồn thô bằng generator (thoát ký tự tự động). LUẬT vẫn như mọi chương: backtick → &#96;;
 * ${ → \${; < > & trong code → &lt; &gt; &amp;; gạch chéo ngược viết đôi.
 */

import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Flinux-bash%2Flearn&reflabel=Linux%20%26%20Bash';

export default {
  title: "Chapter 16 — Capstone: build, automate and run a real server|||Chương 16 — Dự án cuối khoá: dựng, tự động hoá và vận hành một máy chủ thật",
  description: "Dự án cuối khoá: dựng thật một máy chủ Ubuntu cho API \"Đặt lịch phòng khám\" — bootstrap chạy lại không hỏng, SSH chỉ khoá và tường lửa, deploy có thư mục bản phát hành + symlink + health check + tự quay lui, unit systemd có trần bộ nhớ, timer sao lưu, logrotate, giám sát chỉ báo khi trạng thái đổi, tám sự cố tuần đầu dựng lại thật, và bài thi cuối khoá 20 câu.",
  lessons: [
    /* ─────────────────────────── 16.0 ─────────────────────────── */
    {
      title: "16.0 — Chapter 16 slides: the capstone server in pictures|||16.0 — Slide Chương 16: máy chủ dự án cuối khoá bằng hình",
      slug: "lnx-16-0-slides",
      type: "DOCUMENT",
      isFreePreview: true,
      description: "Bộ 32 slide của Chương 16: toàn cảnh máy chủ, bootstrap.sh chạy ba lần, SSH chỉ khoá và ufw, deploy.sh với releases + current + health check + quay lui, bẫy StartLimitBurst, unit có MemoryMax, timer sao lưu theo giờ Việt Nam, logrotate và SIGHUP, giám sát chỉ báo khi đổi, tám sự cố tuần đầu, bảng tra nhanh và bản đồ 17 phần của khoá.",
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Slides</span>
<h2>The capstone in 32 slides</h2>
<p class="lead">This chapter is the whole course in one machine. A study group needs an Ubuntu server for a small "clinic appointment" API, and you set it up the way a careful engineer would: a dedicated user, a script that builds the server and can be run again without breaking anything, a deploy script that rolls itself back, timers that back up and watch the machine, and a first week of real incidents. Skim the slides first to see the whole picture, then come back after the final exam as a revision sheet. Every script is syntax-coloured like VS Code with a note on each line, and every terminal is real output from a real run — including the runs that failed.</p>
<p>Slide 3 is the map of the server. Slides 4–8 belong to Lesson 16.1 (who owns what, the idempotent <code>bootstrap.sh</code>, three runs of it, keys-only SSH checked with <code>sshd -T</code>, the firewall), 9–15 to 16.2 (the armour of <code>deploy.sh</code>, releases and the <code>current</code> symlink, the health check that decides, manual rollback and two deploys at once, the start-limit trap our first real run fell into, the unit file, reading <code>systemctl status</code>), 16–21 to 16.3 (backups that keep seven copies, a timer on Vietnam time on a UTC machine, logrotate and the file descriptor that points at an inode, monitoring that only speaks when the state changes, <code>journalctl</code> and the morning report) and 22–27 to 16.4 (eight incidents from the first week, each rebuilt for real). The last five are common mistakes, a two-page cheat sheet, a one-hour practice session and a map of the 17 parts of the course. Recorded on the night of 28→29/09/2026 in an Ubuntu 24.04 container running real systemd, on a Fedora 44 machine and on a Mac; the slides are in Vietnamese, the code reads the same in any language.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 16 · Slide</span>
<h2>Dự án cuối khoá trong 32 slide</h2>
<p class="lead">Chương này là cả khoá học gói trong một cái máy. Nhóm đồ án cần một máy chủ Ubuntu cho một API nhỏ "Đặt lịch phòng khám", và bạn dựng nó theo cách một kỹ sư cẩn thận sẽ dựng: một người dùng riêng cho app, một script dựng máy chạy lại bao nhiêu lần cũng không hỏng, một script deploy biết tự quay lui, các timer tự sao lưu và tự canh máy, rồi một tuần đầu với những sự cố thật. Lướt bộ slide trước để thấy cả bức tranh, rồi quay lại sau bài thi cuối khoá như một tờ ôn tập. Mọi script đều tô màu kiểu VS Code kèm ghi chú từng dòng, và mọi terminal là output THẬT của một lần chạy thật — kể cả những lần chạy hỏng.</p>
<p>Slide 3 là bản đồ của máy chủ. Slide 4–8 thuộc Bài 16.1 (thứ gì của ai, <code>bootstrap.sh</code> chạy lại không hỏng, ba lần chạy nó, SSH chỉ bằng khoá nghiệm thu bằng <code>sshd -T</code>, tường lửa), 9–15 thuộc 16.2 (bộ giáp của <code>deploy.sh</code>, thư mục bản phát hành và symlink <code>current</code>, health check quyết định, quay lui tay và hai người deploy cùng lúc, cái bẫy giới hạn khởi động mà lần chạy thật đầu tiên của chúng tôi rơi vào, file unit, đọc <code>systemctl status</code>), 16–21 thuộc 16.3 (sao lưu giữ đúng bảy bản, timer theo giờ Việt Nam trên máy chạy UTC, logrotate và cái file descriptor trỏ vào inode, giám sát chỉ lên tiếng khi trạng thái đổi, <code>journalctl</code> và báo cáo buổi sáng), 22–27 thuộc 16.4 (tám sự cố của tuần đầu, cái nào cũng dựng lại thật). Năm slide cuối là sai lầm hay gặp, bảng tra nhanh hai trang, một buổi thực hành một tiếng, và bản đồ 17 phần của cả khoá. Ghi đêm 28→29/09/2026 trong container Ubuntu 24.04 chạy systemd thật, trên một máy Fedora 44 và trên Mac — PID, số inode và giờ giấc trên máy bạn sẽ khác, còn cách mọi thứ vận hành thì không.</p>
</div>
${gallery('lx-16', [[1, 'Bìa Chương 16'], [2, 'Bản đồ chương: một tuần đầu của một máy chủ'], [3, 'Toàn cảnh máy chủ của dự án'], [4, 'App không chạy bằng root: mỗi thứ một chủ'], [5, 'bootstrap.sh: kiểm trước, làm sau — chạy lại không hỏng'], [6, 'Lần 1 hỏng giữa chừng, lần 2 đi tiếp, lần 3: 0 thay đổi'], [7, 'SSH chỉ bằng khoá — nghiệm thu bằng sshd -T'], [8, 'Tường lửa: chặn mặc định, chỉ mở 22 và 80'], [9, 'deploy.sh: bộ giáp set -Eeuo, trap, flock'], [10, 'Mỗi bản một thư mục; current chỉ là mũi tên'], [11, 'Health check quyết định: giữ bản mới hay quay lui'], [12, 'Liệt kê, quay lui tay, và hai người deploy cùng lúc'], [13, 'Lần chạy thật đầu tiên: StartLimitBurst khoá luôn cả quay lui'], [14, 'Unit của app: User=, Restart=, MemoryMax=, EnvironmentFile='], [15, 'systemctl status đọc được: cgroup, RAM và trần'], [16, 'Sao lưu: sqlite3 .backup, kiểm, giữ đúng 7 bản'], [17, 'Timer theo giờ Việt Nam trên một máy chạy UTC'], [18, 'Chạy 10 lần, còn đúng 7 — và luật 5 lần/10 giây'], [19, 'logrotate đổi TÊN file; app phải mở lại'], [20, 'Giám sát: chỉ báo khi TRẠNG THÁI đổi'], [21, 'journalctl -p err bỏ sót Traceback; báo cáo sáng'], [22, '8 sự cố tuần đầu: triệu chứng → lệnh đầu tiên'], [23, 'Đĩa đầy mà rm không trả chỗ: lsof -a +L1'], [24, 'Còn 93M trống mà không tạo nổi file: hết inode'], [25, 'OOM: MemoryMax chỉ là trần thật khi tắt swap'], [26, 'Cổng bị chiếm · file của root: hai kiểu “app chết”'], [27, 'Múi giờ · CRLF · config không ăn: ba lỗi “im lặng”'], [28, 'Sai lầm hay gặp ở Chương 16'], [29, 'Bảng tra nhanh Chương 16 (1/2): dựng máy và deploy'], [30, 'Bảng tra nhanh Chương 16 (2/2): tự động hoá và sự cố'], [31, 'Thực hành Chương 16: dựng lại cả máy'], [32, 'Cả khoá trong một máy chủ: 17 phần bạn đã đi qua']])}
`,
    },
    /* ─────────────────────────── 16.1 ─────────────────────────── */
    {
      title: "16.1 — Day 1: a fresh VPS set up by an idempotent bootstrap script|||16.1 — Ngày 1: dựng VPS mới bằng một script bootstrap chạy lại không hỏng",
      slug: "lnx-16-1-dung-may",
      type: "LESSON",
      isFreePreview: true,
      description: "Người dùng riêng cho app, cây thư mục mỗi thứ một chủ, SSH chỉ bằng khoá nghiệm thu bằng sshd -T, tường lửa mặc định chặn — tất cả trong bootstrap.sh chạy ba lần thật: lần một hỏng, lần hai đi tiếp, lần ba \"0 thay đổi\".",
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.1</span>
<h2>Day 1: a fresh VPS, set up by a script you can run twice</h2>
<p class="lead">Your study group has a new Ubuntu 24.04 VPS and a small API to put on it. The tempting way is to SSH in as root, type thirty commands from memory and hope you remember them next time. This lesson does it the way that survives: a dedicated user that runs the app and owns nothing else, a directory tree where every folder has exactly one owner, SSH that only accepts keys, a firewall that blocks everything except two ports — and all of it written down as <code>bootstrap.sh</code>, a script you can run a second, third or tenth time and get "0 changes".</p>

<h3>The project for the whole chapter</h3>
${slide('lx-16', 3, 'Toàn cảnh máy chủ của dự án')}
<p>The application is deliberately small, so the chapter is about the <em>server</em>, not the code: "datlich" (short for <em>đặt lịch</em>, booking), 63 lines of Python using only the standard library. It answers <code>GET /health</code>, lists appointments at <code>GET /api/lich</code>, stores new ones from <code>POST /api/lich</code> in an SQLite file, writes an access log, and reopens that log when it receives <code>SIGHUP</code> (Lesson 16.3 explains why). It listens on <code>127.0.0.1:8080</code> only; nginx on port 80 forwards to it. Everything in this chapter was run for real in an Ubuntu 24.04 container that boots real systemd 255 (<code>--privileged</code>, for a short time, hostname <code>clinic-vps</code>) — the same init system, the same <code>ufw</code>, the same <code>sshd</code> as on a real VPS.</p>
<pre><code class="language-text">datlich/                     <span class="tok-comment"># the Git repo of the group</span>
├── app/
│   ├── app.py               <span class="tok-comment"># the API (63 lines, Python stdlib)</span>
│   └── VERSION              <span class="tok-comment"># 1.0.0, 1.1.0 …</span>
├── ops/
│   ├── bootstrap.sh         <span class="tok-comment"># Lesson 16.1 — build the server</span>
│   ├── deploy.sh            <span class="tok-comment"># Lesson 16.2 — ship a release, roll back</span>
│   ├── sao-luu.sh           <span class="tok-comment"># Lesson 16.3 — backup, keep 7</span>
│   ├── giam-sat.sh          <span class="tok-comment"># Lesson 16.3 — monitoring</span>
│   └── bao-cao-sang.sh      <span class="tok-comment"># Lesson 16.3 — morning report</span>
└── he-thong/                <span class="tok-comment"># "system": files installed into /etc</span>
    ├── datlich.service      datlich-saoluu.{service,timer}
    ├── datlich-giamsat.{service,timer}   datlich-baocao.{service,timer}
    ├── logrotate-datlich    nginx-datlich.conf
    └── 01-datlich-ssh.conf  sudoers-datlich</code></pre>
<p>The rule behind that layout: <strong>everything the server needs lives in Git</strong>. The server itself holds only two kinds of thing that are not in the repo — data (the database, logs, backups) and secrets (the <code>.env</code> file). If the VPS dies tonight, a new one plus <code>bootstrap.sh</code> plus the last backup gets you back.</p>

<h3>Who owns what</h3>
${slide('lx-16', 4, 'App không chạy bằng root: mỗi thứ một chủ')}
<p>The single most important decision on day 1 is <em>not</em> to run the app as root. If the app has a bug that lets an attacker run commands — a template injection, a bad file upload, a dependency with a backdoor — the attacker gets exactly the power of the user the app runs as. As root, that is the whole machine. As a system user that cannot log in and can write to two directories, that is two directories. Three users do three jobs:</p>
<table>
<tr><th>User</th><th>What it is</th><th>What it may do</th></tr>
<tr><td><code>datlich</code></td><td>a <em>system</em> user (UID below 1000), shell <code>/usr/sbin/nologin</code>, no password</td><td>run the app; write the database and the logs; <strong>not</strong> change the code or read other people's files</td></tr>
<tr><td><code>deploy</code></td><td>a normal user that logs in over SSH with a key</td><td>exactly one privileged command: <code>sudo /opt/datlich/ops/deploy.sh</code> (a one-line sudoers file)</td></tr>
<tr><td><code>root</code></td><td>owner of the code and the configuration</td><td>everything — but cannot log in over SSH at all</td></tr>
</table>
<p>And every directory gets one owner and a mode that matches its job (Filesystem Hierarchy Standard, Lesson 1.3):</p>
<table>
<tr><th>Path</th><th>Owner:group</th><th>Mode</th><th>Why</th></tr>
<tr><td><code>/opt/datlich</code>, <code>releases/</code>, <code>ops/</code></td><td>root:root</td><td>755</td><td>code: everyone may read and run it, only root may change it</td></tr>
<tr><td><code>/etc/datlich</code></td><td>root:datlich</td><td>750</td><td>configuration: the app's group may read, others may not even list it</td></tr>
<tr><td><code>/etc/datlich/datlich.env</code></td><td>root:datlich</td><td>640</td><td>secrets: readable by the app, writable only by root</td></tr>
<tr><td><code>/var/lib/datlich</code></td><td>datlich:datlich</td><td>750</td><td>the database — the app writes here</td></tr>
<tr><td><code>/var/log/datlich</code></td><td>datlich:datlich</td><td>750</td><td>logs</td></tr>
<tr><td><code>/var/backups/datlich</code></td><td>datlich:datlich</td><td>750</td><td>backups (the backup timer runs as <code>datlich</code>)</td></tr>
</table>
<p>Measured after bootstrap — least privilege is not a theory, it is a <code>Permission denied</code> in the right place:</p>
<pre><code class="language-bash">sudo -u datlich touch /opt/datlich/current/x      <span class="tok-comment"># can the app change its own code?</span>
sudo -u deploy cat /etc/datlich/datlich.env       <span class="tok-comment"># can the deploy user read the secrets?</span>
sudo -u datlich cut -d= -f1 /etc/datlich/datlich.env
getent passwd datlich deploy
sudo -l -U deploy | tail -n 2</code></pre>
<div class="out">touch: cannot touch '/opt/datlich/current/x': Permission denied
cat: /etc/datlich/datlich.env: Permission denied
PORT
DB_PATH
ACCESS_LOG
SECRET_KEY
datlich:x:999:996::/var/lib/datlich:/usr/sbin/nologin
deploy:x:1001:1001::/home/deploy:/bin/bash
User deploy may run the following commands on clinic-vps:
    (root) NOPASSWD: /opt/datlich/ops/deploy.sh</div>
<p>The app reads its own settings; the deploy user, who is allowed to <em>ship</em> code, cannot read the secret key; nobody except root can change the code that is running. (We printed only the variable <em>names</em> with <code>cut -d= -f1</code> — never paste a real secret into a terminal log or a slide.)</p>

<h3>Idempotent: check first, act second</h3>
${slide('lx-16', 5, 'bootstrap.sh: kiểm trước, làm sau — chạy lại không hỏng')}
<p>A script is <strong>idempotent</strong> when running it twice leaves the machine in the same state as running it once. That property turns a setup script into something more useful: a <em>checker</em>. Run it on a server you have not touched for a month; if it prints "0 changes", the server is still exactly what the repo describes. If somebody hand-edited something, the script puts it back — and tells you it did. The recipe is simple and mechanical: every step first asks "is it already right?", and only acts if the answer is no. Two small helpers do most of the work:</p>
<ul>
<li><code>cai SRC DST MODE</code> ("install") — <code>cmp -s</code> compares the two files byte by byte; equal ⇒ print ✓ and return 1 ("nothing changed"); different or missing ⇒ <code>install -m</code> copies it with the right mode and returns 0. The return code lets the caller react only to real changes: <code>cai … &amp;&amp; NAP=1</code>, then one <code>systemctl daemon-reload</code> at the end, and only if a unit actually changed.</li>
<li><code>thu_muc PATH OWNER:GROUP MODE</code> ("directory") — asks <code>stat -c '%U:%G %a'</code> whether the directory already has exactly that owner and mode; if not, <code>install -d -o -g -m</code> creates it or fixes it in one command. (<code>\${2%:*}</code> and <code>\${2#*:}</code> split <code>root:datlich</code> into its two halves — parameter expansion from Lesson 6.3.)</li>
</ul>
<p>Here is the complete script as it ended up, after the three real runs described below:</p>
<pre><code class="language-bash">#!/usr/bin/env bash
<span class="tok-comment"># bootstrap.sh — dựng một VPS Ubuntu 24.04 mới cho app "datlich".</span>
<span class="tok-comment"># Cách dùng: sudo ./ops/bootstrap.sh &lt;file khoá công khai của người deploy&gt;</span>
<span class="tok-comment"># Chạy lại bao nhiêu lần cũng được: bước nào đã đúng thì chỉ in ✓.</span>
set -Eeuo pipefail
trap 'echo "bootstrap: hỏng ở dòng $LINENO: $BASH_COMMAND" &gt;&amp;2' ERR

(( EUID == 0 )) || { echo "cần chạy bằng root (sudo)" &gt;&amp;2; exit 2; }
KHOA=\${1:?cách dùng: bootstrap.sh &lt;file khoá công khai&gt;}
[[ -r $KHOA ]] || { echo "không đọc được $KHOA" &gt;&amp;2; exit 2; }
REPO=$(cd "$(dirname "$0")/.." &amp;&amp; pwd)
HT=$REPO/he-thong
DOI=0
ok()  { printf '  ✓ %s\\n' "$*"; }
lam() { printf '  → %s\\n' "$*"; DOI=$((DOI + 1)); }
<span class="tok-comment"># cai NGUỒN ĐÍCH QUYỀN — chỉ ghi khi nội dung KHÁC; trả 0 nếu vừa ghi</span>
cai() {
  if cmp -s "$1" "$2"; then ok "$2"; return 1; fi
  lam "cài $2"; install -m "$3" "$1" "$2"
}

echo "1/7 Gói phần mềm"
GOI=(nginx openssh-server python3 sqlite3 logrotate ufw curl)
THIEU=()
for g in "\${GOI[@]}"; do
  dpkg-query -W -f='\${Status}' "$g" 2&gt;/dev/null | grep -q 'ok installed' || THIEU+=("$g")
done
if (( \${#THIEU[@]} )); then
  lam "cài \${THIEU[*]}"; apt-get update -q; apt-get install -y -q "\${THIEU[@]}"
else ok "đủ \${#GOI[@]} gói"; fi

echo "2/7 Người dùng"
if id -u datlich &amp;&gt;/dev/null; then ok "user datlich"; else
  lam "tạo user hệ thống datlich (không đăng nhập được)"
  useradd --system --home-dir /var/lib/datlich --shell /usr/sbin/nologin datlich
fi
if id -u deploy &amp;&gt;/dev/null; then ok "user deploy"; else
  lam "tạo user deploy"; useradd --create-home --shell /bin/bash deploy
fi

echo "3/7 Thư mục và quyền"
thu_muc() {  <span class="tok-comment"># ĐƯỜNG_DẪN CHỦ:NHÓM QUYỀN</span>
  if [[ -d $1 &amp;&amp; $(stat -c '%U:%G %a' "$1") == "$2 $3" ]]; then ok "$1 ($2 $3)"; return; fi
  lam "thư mục $1 → $2 $3"
  install -d -o "\${2%:*}" -g "\${2#*:}" -m "$3" "$1"
}
thu_muc /opt/datlich          root:root       755
thu_muc /opt/datlich/releases root:root       755
thu_muc /opt/datlich/ops      root:root       755
thu_muc /etc/datlich          root:datlich    750
thu_muc /var/lib/datlich      datlich:datlich 750
thu_muc /var/log/datlich      datlich:datlich 750
thu_muc /var/backups/datlich  datlich:datlich 750

echo "4/7 File cấu hình"
ENV=/etc/datlich/datlich.env           <span class="tok-comment"># tạo MỘT lần — không bao giờ ghi đè bí mật</span>
if [[ -f $ENV ]]; then ok "$ENV (giữ nguyên)"; else
  lam "tạo $ENV"
  install -m 640 -o root -g datlich /dev/null "$ENV"
  printf 'PORT=8080\\nDB_PATH=/var/lib/datlich/datlich.db\\nACCESS_LOG=/var/log/datlich/access.log\\nSECRET_KEY=%s\\n' \\
    "$(head -c 24 /dev/urandom | base64)" &gt; "$ENV"
fi
for f in bootstrap.sh deploy.sh sao-luu.sh giam-sat.sh bao-cao-sang.sh; do
  cai "$REPO/ops/$f" "/opt/datlich/ops/$f" 755 || true
done
NAP=0
for u in datlich.service datlich-saoluu.{service,timer} datlich-giamsat.{service,timer} datlich-baocao.{service,timer}; do
  cai "$HT/$u" "/etc/systemd/system/$u" 644 &amp;&amp; NAP=1
done
(( NAP )) &amp;&amp; systemctl daemon-reload
cai "$HT/logrotate-datlich" /etc/logrotate.d/datlich 644 || true
if ! cmp -s "$HT/sudoers-datlich" /etc/sudoers.d/datlich; then
  visudo -cqf "$HT/sudoers-datlich"                  <span class="tok-comment"># sai cú pháp sudoers = mất sudo</span>
  cai "$HT/sudoers-datlich" /etc/sudoers.d/datlich 440 || true
else ok /etc/sudoers.d/datlich; fi
if cai "$HT/nginx-datlich.conf" /etc/nginx/sites-available/datlich 644; then
  ln -sfn ../sites-available/datlich /etc/nginx/sites-enabled/datlich
  nginx -t -q &amp;&amp; systemctl reload-or-restart nginx
fi
systemctl is-enabled -q nginx || { lam "bật nginx"; systemctl enable --now -q nginx 2&gt;/dev/null; }

echo "5/7 SSH chỉ bằng khoá"
install -d -m 755 /run/sshd       <span class="tok-comment"># 24.04: ssh.socket chỉ khởi động sshd khi có kết nối đầu tiên</span>
install -d -o deploy -g deploy -m 700 /home/deploy/.ssh
AK=/home/deploy/.ssh/authorized_keys
if grep -qxF "$(cat "$KHOA")" "$AK" 2&gt;/dev/null; then ok "khoá đã có trong $AK"; else
  lam "thêm khoá vào $AK"; cat "$KHOA" &gt;&gt; "$AK"
fi
chown deploy:deploy "$AK"; chmod 600 "$AK"
if cai "$HT/01-datlich-ssh.conf" /etc/ssh/sshd_config.d/01-datlich.conf 644; then
  sshd -t &amp;&amp; systemctl reload-or-restart ssh
fi
sshd -T | grep -E '^(passwordauthentication|permitrootlogin|allowusers) ' | sed 's/^/    sshd -T: /'
sshd -T | grep -x 'passwordauthentication no' &gt;/dev/null \\
  || { echo "sshd vẫn nhận mật khẩu — có file nào đọc TRƯỚC 01-datlich.conf?" &gt;&amp;2; exit 1; }

echo "6/7 Tường lửa"
if ufw status | grep -q '^Status: active'; then ok "ufw đang bật"; else
  lam "bật ufw: chặn mọi cổng vào, trừ SSH và HTTP"
  ufw default deny incoming &gt;/dev/null
  ufw default allow outgoing &gt;/dev/null
  ufw allow OpenSSH &gt;/dev/null
  ufw allow 'Nginx HTTP' &gt;/dev/null
  ufw --force enable &gt;/dev/null
fi

echo "7/7 Dịch vụ và hẹn giờ"
for t in datlich.service datlich-saoluu.timer datlich-giamsat.timer datlich-baocao.timer; do
  if systemctl is-enabled -q "$t"; then ok "$t"; continue; fi
  lam "bật $t"; systemctl enable -q "$t"
  if [[ $t == *.timer ]]; then systemctl start "$t"; fi
done

echo "Xong: $DOI thay đổi."</code></pre>
<p>114 lines, ShellCheck clean. Read it step by step and you will recognise almost every chapter of the course:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · packages</span><span class="lz-t">dpkg-query</span><span class="lz-d">Only the missing packages go to <code>apt-get install</code> (Lesson 10.2). An array collects them (Lesson 6.2).</span></div>
  <div class="lz-step"><span class="lz-k">2 · users</span><span class="lz-t">id -u || useradd</span><span class="lz-d"><code>--system</code> gives a UID below 1000 and no mail spool; <code>nologin</code> refuses interactive logins (Lesson 4.4).</span></div>
  <div class="lz-step"><span class="lz-k">3 · directories</span><span class="lz-t">install -d -o -g -m</span><span class="lz-d">Create or repair owner and mode in one atomic command, instead of <code>mkdir</code> + <code>chown</code> + <code>chmod</code> (Lesson 4.2).</span></div>
  <div class="lz-step"><span class="lz-k">4 · config</span><span class="lz-t">cmp -s + install -m</span><span class="lz-d">The <code>.env</code> is created once and never overwritten — somebody will have edited the secrets by hand. <code>visudo -cqf</code> checks a sudoers file before it is installed.</span></div>
  <div class="lz-step"><span class="lz-k">5 · SSH</span><span class="lz-t">sshd -t / sshd -T</span><span class="lz-d">Syntax check before reload; the <em>effective</em> value checked after (Lesson 11.3).</span></div>
  <div class="lz-step"><span class="lz-k">6 · firewall</span><span class="lz-t">ufw</span><span class="lz-d">SSH is allowed BEFORE the firewall is switched on (Lesson 9.5).</span></div>
  <div class="lz-step"><span class="lz-k">7 · units</span><span class="lz-t">systemctl enable</span><span class="lz-d">The app starts at boot; the three timers start now (Lessons 11.1–11.2, and 16.3).</span></div>
</div>
<div class="pitfall co-tieu-de"><strong>Appending is the enemy of idempotence.</strong> <code>echo "$KEY" &gt;&gt; authorized_keys</code> works perfectly on the first run and adds a duplicate line on every run after that. Every "add a line" in a bootstrap needs a question in front of it — here <code>grep -qxF "$(cat "$KHOA")" "$AK"</code>: <code>-x</code> means "the whole line", <code>-F</code> means "a fixed string, not a regex" (a public key is full of <code>+</code> and <code>/</code>), <code>-q</code> means "just tell me yes or no". The same goes for <code>useradd</code> (fails with "already exists" on the second run — so <code>id -u</code> first), for <code>ufw allow</code> (harmless: ufw says "Skipping adding existing rule") and for anything with <code>&gt;&gt;</code>.</div>

<h3>Run it three times</h3>
${slide('lx-16', 6, 'Lần 1 hỏng giữa chừng, lần 2 đi tiếp, lần 3: 0 thay đổi')}
<p>The first real run, on the freshly built server, failed half-way — and it was the most useful thing that happened all day. This was the version before line 83 existed:</p>
<div class="out">$ sudo ./ops/bootstrap.sh /root/.ssh/id_ed25519.pub; echo "mã=$?"
1/7 Gói phần mềm
  ✓ đủ 7 gói
2/7 Người dùng
  → tạo user hệ thống datlich (không đăng nhập được)
  → tạo user deploy
3/7 Thư mục và quyền
  → thư mục /opt/datlich → root:root 755
…
4/7 File cấu hình
  → tạo /etc/datlich/datlich.env
…
  → cài /etc/nginx/sites-available/datlich
  → bật nginx
5/7 SSH chỉ bằng khoá
  → thêm khoá vào /home/deploy/.ssh/authorized_keys
  → cài /etc/ssh/sshd_config.d/01-datlich.conf
Missing privilege separation directory: /run/sshd
Missing privilege separation directory: /run/sshd
bootstrap: hỏng ở dòng 92: sed 's/^/    sshd -T: /'
mã=1

real	0m0.510s</div>
<p>Two lessons in that output. First, the cause: on Ubuntu 24.04 the SSH port is held by <strong><code>ssh.socket</code></strong> (systemd socket activation, Lesson 11.3), and <code>sshd</code> itself is only started when the first connection arrives. The directory <code>/run/sshd</code> is created by <code>ssh.service</code> when it starts — so on a machine where nobody has connected yet, <code>sshd -t</code> and <code>sshd -T</code> refuse to run. On a real VPS you are usually connected over SSH when you run bootstrap, so the directory exists; in a fresh container it did not. The fix is one idempotent line: <code>install -d -m 755 /run/sshd</code>. Second, the reporting: the ERR trap named the line and the command (Lesson 7.3), and because of <code>pipefail</code> the pipeline <code>sshd -T | grep | sed</code> failed as a whole, so the error was blamed on <code>sed</code>, the last command — read ERR messages with that in mind.</p>
<p>Then the second run, with the fix, simply continued: every step already done printed ✓, and only the remaining work happened:</p>
<div class="out">3/7 Thư mục và quyền
  ✓ /opt/datlich (root:root 755)
  …
5/7 SSH chỉ bằng khoá
  ✓ khoá đã có trong /home/deploy/.ssh/authorized_keys
  ✓ /etc/ssh/sshd_config.d/01-datlich.conf
    sshd -T: permitrootlogin no
    sshd -T: passwordauthentication no
    sshd -T: allowusers deploy
6/7 Tường lửa
  → bật ufw: chặn mọi cổng vào, trừ SSH và HTTP
7/7 Hẹn giờ
  → bật datlich-saoluu.timer
  → bật datlich-giamsat.timer
  → bật datlich-baocao.timer
Xong: 5 thay đổi.</div>
<p>And the third run, the one that proves the script is idempotent:</p>
<div class="out">$ time sudo ./ops/bootstrap.sh /root/.ssh/id_ed25519.pub | tail -n 12
…
6/7 Tường lửa
  ✓ ufw đang bật
7/7 Dịch vụ và hẹn giờ
  ✓ datlich.service
  ✓ datlich-saoluu.timer
  ✓ datlich-giamsat.timer
  ✓ datlich-baocao.timer
Xong: 0 thay đổi.

real	0m0.124s</div>
<div class="pitfall co-tieu-de"><strong>"The file is right" is not "the change is live".</strong> Look closely at run 2: <code>01-datlich.conf</code> printed ✓ — the file had been written by run 1, which then crashed <em>before</em> reloading sshd. Run 2 saw an identical file and skipped the reload. Here it did no harm (socket activation starts a fresh sshd that reads the new file), but on a normal service the new setting would never have taken effect, and the script would have reported success. That is why the script does not stop at comparing files: after the SSH step it asks <code>sshd -T</code> for the <em>effective</em> value and exits with an error if password logins are still allowed. Idempotence must check the <em>effect</em> of a change, not just the file that describes it.</div>

<h3>SSH: keys only, verified by sshd -T</h3>
${slide('lx-16', 7, 'SSH chỉ bằng khoá — nghiệm thu bằng sshd -T')}
<p>The drop-in file is four lines:</p>
<pre><code class="language-text"><span class="tok-comment"># /etc/ssh/sshd_config.d/01-datlich.conf</span>
PasswordAuthentication no
KbdInteractiveAuthentication no
PermitRootLogin no
AllowUsers deploy</code></pre>
<p>The name starts with <code>01-</code> on purpose. <code>sshd_config</code> includes <code>sshd_config.d/*.conf</code> in alphabetical order, and for each keyword <strong>the first value read wins</strong>. Cloud VPS images ship a <code>50-cloud-init.conf</code> that says <code>PasswordAuthentication yes</code>; a file called <code>70-hardening.conf</code> would lose to it silently (Lesson 11.3 — and incident 8 in Lesson 16.4 rebuilds exactly that). Now test all three doors from another shell, with a real key, without a key, and as root:</p>
<pre><code class="language-bash">ssh deploy@127.0.0.1 "whoami; id"
ssh -o PubkeyAuthentication=no -o PreferredAuthentications=password,keyboard-interactive -o BatchMode=yes deploy@127.0.0.1 true
ssh -o BatchMode=yes root@127.0.0.1 true</code></pre>
<div class="out">deploy
uid=1001(deploy) gid=1001(deploy) groups=1001(deploy)
mã=0
deploy@127.0.0.1: Permission denied (publickey).
mã=255
root@127.0.0.1: Permission denied (publickey).
mã=255</div>
<p>Read the refusal carefully: <code>(publickey)</code> is the list of methods the server still offers. It no longer offers <code>password</code> at all — that is the proof, not the fact that one attempt failed. Keep a second SSH session open while you change SSH settings on a real server, so a mistake does not lock you out.</p>
<div class="pitfall co-tieu-de"><strong>pipefail + <code>grep -q</code> = exit code 141 even when the match is found.</strong> The first version of the verification line was <code>sshd -T | grep -qx 'passwordauthentication no'</code>. It failed every time, and the script printed "sshd vẫn nhận mật khẩu" while <code>sshd -T</code> clearly said <code>no</code>. Measured: <code>set -o pipefail; sshd -T | grep -qx "passwordauthentication no"; echo "mã=$? PIPESTATUS=\${PIPESTATUS[*]}"</code> printed <code>mã=141 PIPESTATUS=141 0</code>. <code>grep -q</code> exits as soon as it finds line 30 of 96; <code>sshd</code>, still writing, receives <code>SIGPIPE</code> and dies with 128 + 13 = 141; <code>pipefail</code> reports that as the pipeline's status. Fix: let grep read everything, <code>grep -x '…' &gt;/dev/null</code> (measured: <code>mã=0 PIPESTATUS=0 0</code>). <code>grep -q</code> is only safe when the upstream output is tiny — as with <code>dpkg-query</code> and <code>ufw status</code> in this script.</div>

<h3>Firewall: default deny, open exactly 22 and 80</h3>
${slide('lx-16', 8, 'Tường lửa: chặn mặc định, chỉ mở 22 và 80')}
<p><code>ufw</code> ("uncomplicated firewall") is Ubuntu's friendly front end to the kernel's netfilter (Lesson 9.5). Four decisions: deny everything that comes in, allow everything that goes out, allow SSH, allow HTTP. The order matters on a real server — allow <code>OpenSSH</code> <em>before</em> <code>ufw enable</code>, or the command that switches the firewall on is the last command you type on that machine.</p>
<div class="out">$ sudo ufw status verbose
Status: active
Logging: on (low)
Default: deny (incoming), allow (outgoing), deny (routed)
New profiles: skip

To                         Action      From
--                         ------      ----
22/tcp (OpenSSH)           ALLOW IN    Anywhere
80/tcp (Nginx HTTP)        ALLOW IN    Anywhere
22/tcp (OpenSSH (v6))      ALLOW IN    Anywhere (v6)
80/tcp (Nginx HTTP (v6))   ALLOW IN    Anywhere (v6)</div>
<p>Then test from <em>outside</em> — a second container on the same Docker network plays "another machine". The app listens on <code>127.0.0.1:8080</code>, nginx on <code>0.0.0.0:80</code>:</p>
<div class="out">$ curl -m 5 http://vps:8080/health
curl: (28) Connection timed out after 5002 milliseconds
$ curl -m 5 http://vps/health
{"status": "ok", "version": "1.1.0"}
# the same first command with ufw switched OFF for a moment:
$ curl -m 5 http://vps:8080/health
curl: (7) Failed to connect to 172.17.0.6 port 8080 after 0 ms: Couldn't connect to server</div>
<p>Two layers, two different symptoms — worth remembering for Chapter 12's diagnosis recipes. With ufw on, the packet is <em>dropped</em>: nobody answers, and curl waits until its timeout (exit 28). With ufw off, the packet reaches the machine, but nothing listens on the public address for port 8080, so the kernel answers with a reset at once (exit 7, "0 ms"). The app is protected twice: by the firewall and by binding to 127.0.0.1.</p>
<div class="callout warn"><p><strong>Docker and ufw.</strong> If the app ran in Docker with <code>-p 8080:8080</code>, the published port would bypass ufw: Docker adds its own NAT rules that send the packet to the container before ufw's input rules see it. Publish only on localhost (<code>-p 127.0.0.1:8080:8080</code>) and let nginx be the only public door — see the Docker course.</p></div>

<h3>Flag table: the commands of this lesson</h3>
<table>
<tr><th>Command and flag</th><th>Meaning</th><th>Example</th></tr>
<tr><td><code>useradd --system</code></td><td>system account: UID below 1000, no aging, no mail</td><td><code>useradd --system --home-dir /var/lib/app --shell /usr/sbin/nologin app</code></td></tr>
<tr><td><code>useradd --create-home</code> (<code>-m</code>)</td><td>create <code>/home/NAME</code> from <code>/etc/skel</code></td><td><code>useradd -m -s /bin/bash deploy</code></td></tr>
<tr><td><code>install -d -o U -g G -m M</code></td><td>create a directory (and parents) with owner and mode in one step; also repairs an existing one</td><td><code>install -d -o app -g app -m 750 /var/lib/app</code></td></tr>
<tr><td><code>install -m M SRC DST</code></td><td>copy a file and set its mode (and <code>-o</code>/<code>-g</code>) in one step</td><td><code>install -m 644 app.service /etc/systemd/system/</code></td></tr>
<tr><td><code>cmp -s A B</code></td><td>silent byte-by-byte compare: exit 0 equal, 1 different, 2 missing</td><td><code>cmp -s new old || install …</code></td></tr>
<tr><td><code>grep -qxF</code></td><td>quiet · whole line · fixed string</td><td><code>grep -qxF "$line" file || echo "$line" &gt;&gt; file</code></td></tr>
<tr><td><code>visudo -cqf FILE</code></td><td>check a sudoers file's syntax without installing it</td><td>before copying into <code>/etc/sudoers.d/</code></td></tr>
<tr><td><code>sshd -t</code> / <code>sshd -T</code></td><td>test syntax / print the <em>effective</em> configuration</td><td><code>sshd -T | grep ^passwordauthentication</code></td></tr>
<tr><td><code>ufw default deny incoming</code></td><td>policy for traffic nobody allowed</td><td>first, before any <code>allow</code></td></tr>
<tr><td><code>ufw allow NAME|PORT/tcp</code></td><td>open by application profile or port</td><td><code>ufw allow OpenSSH</code>, <code>ufw allow 443/tcp</code></td></tr>
<tr><td><code>ufw --force enable</code></td><td>switch on without the interactive question (scripts)</td><td>only after SSH is allowed</td></tr>
<tr><td><code>ufw status verbose</code> / <code>numbered</code></td><td>rules with policies / with numbers for <code>ufw delete N</code></td><td></td></tr>
</table>

<h3>Try it step by step: build the same server in a container</h3>
<p>You need Docker. The image adds systemd, SSH, nginx and the tools to plain Ubuntu 24.04; the container runs <code>/sbin/init</code> as PID 1 so that <code>systemctl</code> works exactly as on a VPS. <code>--privileged</code> is needed for systemd and ufw — use it only for a throw-away practice container like this one, and remove it afterwards.</p>
<pre><code class="language-bash"><span class="tok-comment"># Dockerfile (in an empty directory)</span>
FROM ubuntu:24.04
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update &amp;&amp; apt-get install -y --no-install-recommends systemd systemd-sysv dbus \\
      openssh-server nginx python3 curl logrotate cron ufw iproute2 procps lsof psmisc \\
      util-linux sudo jq sqlite3 dos2unix tzdata ca-certificates file shellcheck \\
 &amp;&amp; rm -rf /var/lib/apt/lists/* &amp;&amp; rm -f /etc/nginx/sites-enabled/default
STOPSIGNAL SIGRTMIN+3
CMD ["/sbin/init"]</code></pre>
<pre><code class="language-bash">docker build -t lx16-img .
docker run -d --name lx16-srv --privileged --memory 512m --hostname clinic-vps lx16-img
docker exec lx16-srv systemctl is-system-running          <span class="tok-comment"># → running</span>
docker cp datlich lx16-srv:/root/datlich                  <span class="tok-comment"># your copy of the repo</span>
docker exec -it lx16-srv bash
<span class="tok-comment"># inside:</span>
ssh-keygen -q -t ed25519 -N "" -C "ban@laptop" -f ~/.ssh/id_ed25519
cd /root/datlich &amp;&amp; sudo ./ops/bootstrap.sh ~/.ssh/id_ed25519.pub
sudo ./ops/bootstrap.sh ~/.ssh/id_ed25519.pub | tail -n 1    <span class="tok-comment"># → Xong: 0 thay đổi.</span>
ssh deploy@127.0.0.1 whoami                                   <span class="tok-comment"># → deploy</span>
ssh -o PubkeyAuthentication=no deploy@127.0.0.1               <span class="tok-comment"># → Permission denied (publickey)</span>
sudo ufw status verbose
<span class="tok-comment"># when you are done, on the host:</span>
docker rm -f lx16-srv &amp;&amp; docker rmi lx16-img</code></pre>

<h3>On macOS and WSL: what is different</h3>
<p><code>bootstrap.sh</code> is a script for the <em>server</em>. Your laptop only needs <code>ssh</code>, <code>ssh-keygen</code>, <code>scp</code> and <code>tar</code>, which work the same everywhere. Measured on the Mac (macOS 27), the server-side tools simply do not exist:</p>
<table>
<tr><th>Thing in this lesson</th><th>Ubuntu (the VPS)</th><th>Mac (measured)</th><th>WSL2</th></tr>
<tr><td><code>useradd</code>, <code>ufw</code>, <code>systemctl</code>, <code>ss</code>, <code>namei</code></td><td>present</td><td><code>command -v</code> finds none of them (macOS uses <code>dscl</code>/<code>sysadminctl</code>, <code>pf</code>, <code>launchd</code>)</td><td>present — WSL2 is a real Ubuntu</td></tr>
<tr><td><code>stat -c '%U:%G %a'</code></td><td>GNU syntax</td><td><code>stat: illegal option -- c</code> (BSD uses <code>stat -f '%Su:%Sg %Lp'</code>)</td><td>GNU</td></tr>
<tr><td><code>systemctl</code> inside WSL</td><td>—</td><td>—</td><td>only if <code>systemd=true</code> is set in <code>/etc/wsl.conf</code> (Lesson 15.3)</td></tr>
<tr><td><code>ssh-keygen -t ed25519</code></td><td>same</td><td>same (OpenSSH ships with macOS)</td><td>same (use the Linux side's <code>~/.ssh</code>)</td></tr>
</table>
<p>So: write and test <code>bootstrap.sh</code> in a Linux container or in WSL2, never "on the Mac to see if it works" — a script that passes on the Mac has only proved it can run on the Mac.</p>

<h3>When to use a bootstrap script — and when not</h3>
<ul>
<li><strong>One to three servers you look after yourself</strong> (a student project, a small side business): a bootstrap script in the repo is exactly right — readable, versioned, no extra tool to learn.</li>
<li><strong>More servers, or a team</strong>: the same ideas — idempotent steps, desired state, check before act — are what configuration-management tools like Ansible are built on. Moving to one later will feel familiar.</li>
<li><strong>Machines created by a cloud provider</strong>: cloud-init can run your bootstrap on first boot, so a new VPS arrives ready.</li>
<li><strong>Not</strong> for secrets: keep the <code>.env</code> out of Git; bootstrap only creates an empty template once. Lesson 8.3 covers where secrets live.</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> a teammate "just quickly" changed the server by hand. Your bootstrap must notice and repair it — in the practice container above.</p><ol>
<li>Run bootstrap until it prints <code>Xong: 0 thay đổi.</code></li>
<li>Break three things by hand: <code>chmod 777 /var/lib/datlich</code>, <code>chown root /var/log/datlich</code>, and add a comment line to <code>/etc/systemd/system/datlich.service</code>.</li>
<li>Run bootstrap again. It must list exactly those three repairs with <code>→</code>, and the unit change must trigger one <code>daemon-reload</code> (check with <code>systemctl show datlich -p NeedDaemonReload</code> → <code>no</code>).</li>
<li>Create <code>/etc/ssh/sshd_config.d/00-test.conf</code> containing <code>PasswordAuthentication yes</code>, run bootstrap, and read the error it prints. Delete the file and run again.</li>
</ol><p><strong>Done when:</strong> step 3 prints <code>Xong: 3 thay đổi.</code>, the next run prints <code>Xong: 0 thay đổi.</code>, and step 4 ends with exit code 1 and the message about a file read before <code>01-datlich.conf</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Idempotent</span><span class="v">Running it twice leaves the system exactly as running it once; the second run changes nothing.</span></div>
  <div class="kv"><span class="k">Bootstrap</span><span class="v">The script that turns a fresh machine into a configured server.</span></div>
  <div class="kv"><span class="k">System user</span><span class="v">An account for a service, not a person: low UID, no password, usually <code>nologin</code>.</span></div>
  <div class="kv"><span class="k">Least privilege</span><span class="v">Give each user or process only the rights its job needs, nothing more.</span></div>
  <div class="kv"><span class="k">Drop-in file</span><span class="v">A small file in a <code>*.d/</code> directory that adds to or overrides a main configuration file.</span></div>
  <div class="kv"><span class="k">Effective configuration</span><span class="v">What the program actually uses after reading all files — <code>sshd -T</code>, <code>systemctl show</code>, <code>nginx -T</code>.</span></div>
  <div class="kv"><span class="k">Default deny</span><span class="v">A firewall policy that blocks everything not explicitly allowed.</span></div>
  <div class="kv"><span class="k">Socket activation</span><span class="v">systemd holds the port and starts the service when the first connection arrives.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>The app runs as a system user with <code>nologin</code>; code belongs to root, data and logs to the app, secrets are 640 root:app.</li>
<li>Every bootstrap step asks "already right?" before acting: <code>id -u ||</code>, <code>cmp -s</code>, <code>stat -c</code>, <code>grep -qxF</code>; the last run of the day must say "0 changes".</li>
<li>Check the <em>effect</em>, not the file: <code>sshd -T</code> after changing SSH, <code>systemctl show</code> after changing a unit.</li>
<li>Name SSH drop-ins <code>01-…</code>: the first value read wins, and cloud images ship a <code>50-cloud-init.conf</code>.</li>
<li>Under <code>pipefail</code>, <code>big-output | grep -q</code> can return 141; use <code>grep … &gt;/dev/null</code>.</li>
<li>ufw: deny incoming by default, allow SSH before enabling; timeout means dropped, refused means nobody listens.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/man8/useradd.8.html" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">useradd(8)</span><span class="lc-sub">Every flag, including <code>--system</code>, <code>--home-dir</code>, <code>--shell</code> and how system UIDs are chosen.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man1/install.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">install(1)</span><span class="lc-sub">Copy and set owner and mode in one step; <code>-d</code> for directories.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man5/sshd_config.5.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">sshd_config(5)</span><span class="lc-sub">The official list of keywords, the "first obtained value" rule and <code>Include</code>.</span></span>
</a>
<a class="link-card" href="https://manpages.ubuntu.com/manpages/noble/man8/ufw.8.html" target="_blank" rel="noopener">
  <span class="lc-ico">🧱</span>
  <span class="lc-body"><span class="lc-title">ufw(8) on Ubuntu 24.04</span><span class="lc-sub">Policies, application profiles like <code>OpenSSH</code>, rule order and <code>status verbose</code>.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Code Lab — Linux &amp; Bash</span><span class="lc-sub">Graded exercises for the course; revisit the permissions and script tasks before the final exam.</span></span>
</a>
<p class="note-ct"><strong>The habit to take away:</strong> never change a server by hand without changing the script that describes it — and run that script again until it says "0 changes".</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.1</span>
<h2>Ngày 1: một VPS mới tinh, dựng bằng một script chạy hai lần vẫn đúng</h2>
<p class="lead">Nhóm bạn vừa có một VPS Ubuntu 24.04 và một API nhỏ cần đưa lên. Cách hấp dẫn nhất là SSH vào bằng root, gõ ba mươi lệnh theo trí nhớ, rồi cầu cho lần sau còn nhớ. Bài này làm theo cách sống sót được: một người dùng riêng để chạy app và không sở hữu gì khác, một cây thư mục mà thư mục nào cũng có đúng một chủ, SSH chỉ nhận khoá, tường lửa chặn tất cả trừ hai cổng — và tất cả được viết thành <code>bootstrap.sh</code>, một script bạn chạy lần hai, lần ba hay lần thứ mười đều nhận về "0 thay đổi".</p>

<h3>Dự án xuyên suốt chương</h3>
${slide('lx-16', 3, 'Toàn cảnh máy chủ của dự án')}
<p>App được giữ thật nhỏ để cả chương nói về <em>máy chủ</em> chứ không phải về mã: "datlich" (đặt lịch), 63 dòng Python chỉ dùng thư viện chuẩn. Nó trả lời <code>GET /health</code>, liệt kê lịch hẹn ở <code>GET /api/lich</code>, lưu lịch mới từ <code>POST /api/lich</code> vào một file SQLite, ghi access log (nhật ký truy cập), và mở lại file log đó khi nhận tín hiệu <code>SIGHUP</code> (Bài 16.3 giải thích vì sao). Nó chỉ nghe ở <code>127.0.0.1:8080</code>; nginx ở cổng 80 chuyển tiếp vào. Mọi thứ trong chương đã chạy thật trong một container Ubuntu 24.04 khởi động systemd 255 thật (<code>--privileged</code>, trong thời gian ngắn, hostname <code>clinic-vps</code>) — cùng hệ thống init, cùng <code>ufw</code>, cùng <code>sshd</code> như một VPS thật.</p>
<pre><code class="language-text">datlich/                     <span class="tok-comment"># kho Git của nhóm</span>
├── app/
│   ├── app.py               <span class="tok-comment"># API (63 dòng, thư viện chuẩn Python)</span>
│   └── VERSION              <span class="tok-comment"># 1.0.0, 1.1.0 …</span>
├── ops/
│   ├── bootstrap.sh         <span class="tok-comment"># Bài 16.1 — dựng máy</span>
│   ├── deploy.sh            <span class="tok-comment"># Bài 16.2 — đưa bản mới lên, quay lui</span>
│   ├── sao-luu.sh           <span class="tok-comment"># Bài 16.3 — sao lưu, giữ 7 bản</span>
│   ├── giam-sat.sh          <span class="tok-comment"># Bài 16.3 — giám sát</span>
│   └── bao-cao-sang.sh      <span class="tok-comment"># Bài 16.3 — báo cáo buổi sáng</span>
└── he-thong/                <span class="tok-comment"># file "hệ thống": được cài vào /etc</span>
    ├── datlich.service      datlich-saoluu.{service,timer}
    ├── datlich-giamsat.{service,timer}   datlich-baocao.{service,timer}
    ├── logrotate-datlich    nginx-datlich.conf
    └── 01-datlich-ssh.conf  sudoers-datlich</code></pre>
<p>Luật đứng sau cách xếp đó: <strong>mọi thứ máy chủ cần đều nằm trong Git</strong>. Trên máy chủ chỉ có hai loại thứ không nằm trong kho — dữ liệu (CSDL, log, bản sao lưu) và bí mật (file <code>.env</code>). Đêm nay VPS chết thì một VPS mới + <code>bootstrap.sh</code> + bản sao lưu gần nhất là bạn đứng dậy được.</p>

<h3>Thứ gì của ai</h3>
${slide('lx-16', 4, 'App không chạy bằng root: mỗi thứ một chủ')}
<p>Quyết định quan trọng nhất của ngày 1 là KHÔNG chạy app bằng root. Nếu app có một lỗi cho kẻ tấn công chạy lệnh — chèn mã vào template, tải lên một file độc, một thư viện phụ thuộc bị cài cửa hậu — thì kẻ đó có đúng quyền của người dùng mà app đang chạy dưới tên. Với root, đó là cả cái máy. Với một người dùng hệ thống không đăng nhập được và chỉ ghi được vào hai thư mục, đó là hai thư mục. Ba người dùng làm ba việc:</p>
<table>
<tr><th>Người dùng</th><th>Là gì</th><th>Được làm gì</th></tr>
<tr><td><code>datlich</code></td><td>người dùng <em>hệ thống</em> (system user — UID dưới 1000), shell <code>/usr/sbin/nologin</code>, không mật khẩu</td><td>chạy app; ghi CSDL và log; <strong>không</strong> sửa được mã, không đọc được file của người khác</td></tr>
<tr><td><code>deploy</code></td><td>người dùng thường, đăng nhập SSH bằng khoá</td><td>đúng MỘT lệnh có quyền cao: <code>sudo /opt/datlich/ops/deploy.sh</code> (file sudoers một dòng)</td></tr>
<tr><td><code>root</code></td><td>chủ của mã và cấu hình</td><td>mọi thứ — nhưng không đăng nhập SSH được</td></tr>
</table>
<p>Và mỗi thư mục có một chủ cùng một chế độ quyền khớp với việc của nó (chuẩn cây thư mục FHS, Bài 1.3):</p>
<table>
<tr><th>Đường dẫn</th><th>Chủ:nhóm</th><th>Quyền</th><th>Vì sao</th></tr>
<tr><td><code>/opt/datlich</code>, <code>releases/</code>, <code>ops/</code></td><td>root:root</td><td>755</td><td>mã: ai cũng đọc và chạy được, chỉ root sửa được</td></tr>
<tr><td><code>/etc/datlich</code></td><td>root:datlich</td><td>750</td><td>cấu hình: nhóm của app đọc được, người khác liệt kê cũng không được</td></tr>
<tr><td><code>/etc/datlich/datlich.env</code></td><td>root:datlich</td><td>640</td><td>bí mật: app đọc được, chỉ root ghi được</td></tr>
<tr><td><code>/var/lib/datlich</code></td><td>datlich:datlich</td><td>750</td><td>CSDL — app ghi vào đây</td></tr>
<tr><td><code>/var/log/datlich</code></td><td>datlich:datlich</td><td>750</td><td>log</td></tr>
<tr><td><code>/var/backups/datlich</code></td><td>datlich:datlich</td><td>750</td><td>bản sao lưu (timer sao lưu chạy dưới tên <code>datlich</code>)</td></tr>
</table>
<p>Đo thật sau khi bootstrap — quyền tối thiểu (least privilege) không phải lý thuyết, nó là một dòng <code>Permission denied</code> ở đúng chỗ:</p>
<pre><code class="language-bash">sudo -u datlich touch /opt/datlich/current/x      <span class="tok-comment"># app có sửa được mã của chính nó không?</span>
sudo -u deploy cat /etc/datlich/datlich.env       <span class="tok-comment"># người deploy có đọc được bí mật không?</span>
sudo -u datlich cut -d= -f1 /etc/datlich/datlich.env
getent passwd datlich deploy
sudo -l -U deploy | tail -n 2</code></pre>
<div class="out">touch: cannot touch '/opt/datlich/current/x': Permission denied
cat: /etc/datlich/datlich.env: Permission denied
PORT
DB_PATH
ACCESS_LOG
SECRET_KEY
datlich:x:999:996::/var/lib/datlich:/usr/sbin/nologin
deploy:x:1001:1001::/home/deploy:/bin/bash
User deploy may run the following commands on clinic-vps:
    (root) NOPASSWD: /opt/datlich/ops/deploy.sh</div>
<p>App đọc được cấu hình của nó; người deploy — người được phép <em>đưa</em> mã lên — không đọc được khoá bí mật; ngoài root không ai sửa được mã đang chạy. (Chúng tôi chỉ in <em>tên</em> biến bằng <code>cut -d= -f1</code> — đừng bao giờ dán một bí mật thật vào log terminal hay lên slide.)</p>

<h3>Idempotent: kiểm trước, làm sau</h3>
${slide('lx-16', 5, 'bootstrap.sh: kiểm trước, làm sau — chạy lại không hỏng')}
<p>Một script là <strong>idempotent</strong> (lũy đẳng — chạy lại cho cùng kết quả) khi chạy hai lần để lại máy đúng như chạy một lần. Tính chất đó biến một script cài đặt thành một thứ còn hữu ích hơn: một <em>bộ kiểm tra</em>. Chạy nó trên một máy chủ bạn không đụng tới cả tháng; nếu nó in "0 thay đổi", máy vẫn đúng y như kho mã mô tả. Nếu ai đó lỡ sửa tay, script đặt lại cho đúng — và nói ra là nó đã làm vậy. Công thức đơn giản và máy móc: bước nào cũng hỏi "đã đúng chưa?" trước, chỉ làm khi câu trả lời là chưa. Hai hàm nhỏ gánh phần lớn việc:</p>
<ul>
<li><code>cai NGUỒN ĐÍCH QUYỀN</code> — <code>cmp -s</code> so hai file từng byte; giống ⇒ in ✓ và trả 1 ("không đổi gì"); khác hoặc chưa có ⇒ <code>install -m</code> chép sang với đúng quyền và trả 0. Mã trả về cho phép bên gọi chỉ phản ứng khi có thay đổi THẬT: <code>cai … &amp;&amp; NAP=1</code>, rồi một lần <code>systemctl daemon-reload</code> ở cuối, và chỉ khi có unit thật sự đổi.</li>
<li><code>thu_muc ĐƯỜNG_DẪN CHỦ:NHÓM QUYỀN</code> — hỏi <code>stat -c '%U:%G %a'</code> xem thư mục đã có đúng chủ và quyền chưa; chưa thì <code>install -d -o -g -m</code> tạo mới hoặc sửa lại trong một lệnh. (<code>\${2%:*}</code> và <code>\${2#*:}</code> tách <code>root:datlich</code> làm hai nửa — khai triển tham số ở Bài 6.3.)</li>
</ul>
<p>Đây là script hoàn chỉnh như nó trở thành sau ba lần chạy thật kể ở dưới:</p>
<pre><code class="language-bash">#!/usr/bin/env bash
<span class="tok-comment"># bootstrap.sh — dựng một VPS Ubuntu 24.04 mới cho app "datlich".</span>
<span class="tok-comment"># Cách dùng: sudo ./ops/bootstrap.sh &lt;file khoá công khai của người deploy&gt;</span>
<span class="tok-comment"># Chạy lại bao nhiêu lần cũng được: bước nào đã đúng thì chỉ in ✓.</span>
set -Eeuo pipefail
trap 'echo "bootstrap: hỏng ở dòng $LINENO: $BASH_COMMAND" &gt;&amp;2' ERR

(( EUID == 0 )) || { echo "cần chạy bằng root (sudo)" &gt;&amp;2; exit 2; }
KHOA=\${1:?cách dùng: bootstrap.sh &lt;file khoá công khai&gt;}
[[ -r $KHOA ]] || { echo "không đọc được $KHOA" &gt;&amp;2; exit 2; }
REPO=$(cd "$(dirname "$0")/.." &amp;&amp; pwd)
HT=$REPO/he-thong
DOI=0
ok()  { printf '  ✓ %s\\n' "$*"; }
lam() { printf '  → %s\\n' "$*"; DOI=$((DOI + 1)); }
<span class="tok-comment"># cai NGUỒN ĐÍCH QUYỀN — chỉ ghi khi nội dung KHÁC; trả 0 nếu vừa ghi</span>
cai() {
  if cmp -s "$1" "$2"; then ok "$2"; return 1; fi
  lam "cài $2"; install -m "$3" "$1" "$2"
}

echo "1/7 Gói phần mềm"
GOI=(nginx openssh-server python3 sqlite3 logrotate ufw curl)
THIEU=()
for g in "\${GOI[@]}"; do
  dpkg-query -W -f='\${Status}' "$g" 2&gt;/dev/null | grep -q 'ok installed' || THIEU+=("$g")
done
if (( \${#THIEU[@]} )); then
  lam "cài \${THIEU[*]}"; apt-get update -q; apt-get install -y -q "\${THIEU[@]}"
else ok "đủ \${#GOI[@]} gói"; fi

echo "2/7 Người dùng"
if id -u datlich &amp;&gt;/dev/null; then ok "user datlich"; else
  lam "tạo user hệ thống datlich (không đăng nhập được)"
  useradd --system --home-dir /var/lib/datlich --shell /usr/sbin/nologin datlich
fi
if id -u deploy &amp;&gt;/dev/null; then ok "user deploy"; else
  lam "tạo user deploy"; useradd --create-home --shell /bin/bash deploy
fi

echo "3/7 Thư mục và quyền"
thu_muc() {  <span class="tok-comment"># ĐƯỜNG_DẪN CHỦ:NHÓM QUYỀN</span>
  if [[ -d $1 &amp;&amp; $(stat -c '%U:%G %a' "$1") == "$2 $3" ]]; then ok "$1 ($2 $3)"; return; fi
  lam "thư mục $1 → $2 $3"
  install -d -o "\${2%:*}" -g "\${2#*:}" -m "$3" "$1"
}
thu_muc /opt/datlich          root:root       755
thu_muc /opt/datlich/releases root:root       755
thu_muc /opt/datlich/ops      root:root       755
thu_muc /etc/datlich          root:datlich    750
thu_muc /var/lib/datlich      datlich:datlich 750
thu_muc /var/log/datlich      datlich:datlich 750
thu_muc /var/backups/datlich  datlich:datlich 750

echo "4/7 File cấu hình"
ENV=/etc/datlich/datlich.env           <span class="tok-comment"># tạo MỘT lần — không bao giờ ghi đè bí mật</span>
if [[ -f $ENV ]]; then ok "$ENV (giữ nguyên)"; else
  lam "tạo $ENV"
  install -m 640 -o root -g datlich /dev/null "$ENV"
  printf 'PORT=8080\\nDB_PATH=/var/lib/datlich/datlich.db\\nACCESS_LOG=/var/log/datlich/access.log\\nSECRET_KEY=%s\\n' \\
    "$(head -c 24 /dev/urandom | base64)" &gt; "$ENV"
fi
for f in bootstrap.sh deploy.sh sao-luu.sh giam-sat.sh bao-cao-sang.sh; do
  cai "$REPO/ops/$f" "/opt/datlich/ops/$f" 755 || true
done
NAP=0
for u in datlich.service datlich-saoluu.{service,timer} datlich-giamsat.{service,timer} datlich-baocao.{service,timer}; do
  cai "$HT/$u" "/etc/systemd/system/$u" 644 &amp;&amp; NAP=1
done
(( NAP )) &amp;&amp; systemctl daemon-reload
cai "$HT/logrotate-datlich" /etc/logrotate.d/datlich 644 || true
if ! cmp -s "$HT/sudoers-datlich" /etc/sudoers.d/datlich; then
  visudo -cqf "$HT/sudoers-datlich"                  <span class="tok-comment"># sai cú pháp sudoers = mất sudo</span>
  cai "$HT/sudoers-datlich" /etc/sudoers.d/datlich 440 || true
else ok /etc/sudoers.d/datlich; fi
if cai "$HT/nginx-datlich.conf" /etc/nginx/sites-available/datlich 644; then
  ln -sfn ../sites-available/datlich /etc/nginx/sites-enabled/datlich
  nginx -t -q &amp;&amp; systemctl reload-or-restart nginx
fi
systemctl is-enabled -q nginx || { lam "bật nginx"; systemctl enable --now -q nginx 2&gt;/dev/null; }

echo "5/7 SSH chỉ bằng khoá"
install -d -m 755 /run/sshd       <span class="tok-comment"># 24.04: ssh.socket chỉ khởi động sshd khi có kết nối đầu tiên</span>
install -d -o deploy -g deploy -m 700 /home/deploy/.ssh
AK=/home/deploy/.ssh/authorized_keys
if grep -qxF "$(cat "$KHOA")" "$AK" 2&gt;/dev/null; then ok "khoá đã có trong $AK"; else
  lam "thêm khoá vào $AK"; cat "$KHOA" &gt;&gt; "$AK"
fi
chown deploy:deploy "$AK"; chmod 600 "$AK"
if cai "$HT/01-datlich-ssh.conf" /etc/ssh/sshd_config.d/01-datlich.conf 644; then
  sshd -t &amp;&amp; systemctl reload-or-restart ssh
fi
sshd -T | grep -E '^(passwordauthentication|permitrootlogin|allowusers) ' | sed 's/^/    sshd -T: /'
sshd -T | grep -x 'passwordauthentication no' &gt;/dev/null \\
  || { echo "sshd vẫn nhận mật khẩu — có file nào đọc TRƯỚC 01-datlich.conf?" &gt;&amp;2; exit 1; }

echo "6/7 Tường lửa"
if ufw status | grep -q '^Status: active'; then ok "ufw đang bật"; else
  lam "bật ufw: chặn mọi cổng vào, trừ SSH và HTTP"
  ufw default deny incoming &gt;/dev/null
  ufw default allow outgoing &gt;/dev/null
  ufw allow OpenSSH &gt;/dev/null
  ufw allow 'Nginx HTTP' &gt;/dev/null
  ufw --force enable &gt;/dev/null
fi

echo "7/7 Dịch vụ và hẹn giờ"
for t in datlich.service datlich-saoluu.timer datlich-giamsat.timer datlich-baocao.timer; do
  if systemctl is-enabled -q "$t"; then ok "$t"; continue; fi
  lam "bật $t"; systemctl enable -q "$t"
  if [[ $t == *.timer ]]; then systemctl start "$t"; fi
done

echo "Xong: $DOI thay đổi."</code></pre>
<p>114 dòng, ShellCheck sạch. Đọc từng bước là bạn nhận ra gần như mọi chương của khoá:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · gói</span><span class="lz-t">dpkg-query</span><span class="lz-d">Chỉ gói còn thiếu mới được đưa cho <code>apt-get install</code> (Bài 10.2). Một mảng gom chúng lại (Bài 6.2).</span></div>
  <div class="lz-step"><span class="lz-k">2 · người dùng</span><span class="lz-t">id -u || useradd</span><span class="lz-d"><code>--system</code> cho UID dưới 1000 và không có hộp thư; <code>nologin</code> từ chối đăng nhập tương tác (Bài 4.4).</span></div>
  <div class="lz-step"><span class="lz-k">3 · thư mục</span><span class="lz-t">install -d -o -g -m</span><span class="lz-d">Tạo hoặc sửa chủ và quyền trong một lệnh, thay cho <code>mkdir</code> + <code>chown</code> + <code>chmod</code> (Bài 4.2).</span></div>
  <div class="lz-step"><span class="lz-k">4 · cấu hình</span><span class="lz-t">cmp -s + install -m</span><span class="lz-d">File <code>.env</code> tạo một lần rồi không bao giờ ghi đè — thế nào cũng có người đã sửa tay bí mật trong đó. <code>visudo -cqf</code> kiểm file sudoers trước khi cài.</span></div>
  <div class="lz-step"><span class="lz-k">5 · SSH</span><span class="lz-t">sshd -t / sshd -T</span><span class="lz-d">Kiểm cú pháp trước khi nạp lại; kiểm giá trị <em>đang hiệu lực</em> sau đó (Bài 11.3).</span></div>
  <div class="lz-step"><span class="lz-k">6 · tường lửa</span><span class="lz-t">ufw</span><span class="lz-d">Cho phép SSH TRƯỚC khi bật tường lửa (Bài 9.5).</span></div>
  <div class="lz-step"><span class="lz-k">7 · unit</span><span class="lz-t">systemctl enable</span><span class="lz-d">App tự chạy khi máy khởi động; ba timer chạy ngay (Bài 11.1–11.2, và 16.3).</span></div>
</div>
<div class="pitfall co-tieu-de"><strong>Nối thêm là kẻ thù của idempotent.</strong> <code>echo "$KEY" &gt;&gt; authorized_keys</code> chạy hoàn hảo lần đầu, rồi mỗi lần sau lại thêm một dòng trùng. Mọi chỗ "thêm một dòng" trong bootstrap đều cần một câu hỏi đứng trước — ở đây là <code>grep -qxF "$(cat "$KHOA")" "$AK"</code>: <code>-x</code> nghĩa là "khớp NGUYÊN dòng", <code>-F</code> là "chuỗi cố định, không phải regex" (khoá công khai đầy dấu <code>+</code> và <code>/</code>), <code>-q</code> là "chỉ cần trả lời có hay không". Tương tự với <code>useradd</code> (lần hai báo "already exists" — nên hỏi <code>id -u</code> trước), với <code>ufw allow</code> (vô hại: ufw tự nói "Skipping adding existing rule") và với mọi thứ có <code>&gt;&gt;</code>.</div>

<h3>Chạy nó ba lần</h3>
${slide('lx-16', 6, 'Lần 1 hỏng giữa chừng, lần 2 đi tiếp, lần 3: 0 thay đổi')}
<p>Lần chạy thật đầu tiên, trên cái máy vừa dựng, hỏng giữa chừng — và đó là điều hữu ích nhất trong cả ngày. Đây là bản khi dòng 83 chưa có:</p>
<div class="out">$ sudo ./ops/bootstrap.sh /root/.ssh/id_ed25519.pub; echo "mã=$?"
1/7 Gói phần mềm
  ✓ đủ 7 gói
2/7 Người dùng
  → tạo user hệ thống datlich (không đăng nhập được)
  → tạo user deploy
3/7 Thư mục và quyền
  → thư mục /opt/datlich → root:root 755
…
4/7 File cấu hình
  → tạo /etc/datlich/datlich.env
…
  → cài /etc/nginx/sites-available/datlich
  → bật nginx
5/7 SSH chỉ bằng khoá
  → thêm khoá vào /home/deploy/.ssh/authorized_keys
  → cài /etc/ssh/sshd_config.d/01-datlich.conf
Missing privilege separation directory: /run/sshd
Missing privilege separation directory: /run/sshd
bootstrap: hỏng ở dòng 92: sed 's/^/    sshd -T: /'
mã=1

real	0m0.510s</div>
<p>Output đó dạy hai điều. Một, nguyên nhân: trên Ubuntu 24.04, cổng SSH do <strong><code>ssh.socket</code></strong> giữ (socket activation — systemd giữ cổng hộ, Bài 11.3), còn bản thân <code>sshd</code> chỉ được khởi động khi kết nối đầu tiên tới. Thư mục <code>/run/sshd</code> do <code>ssh.service</code> tạo lúc nó khởi động — nên trên một máy chưa ai kết nối, <code>sshd -t</code> và <code>sshd -T</code> từ chối chạy. Trên VPS thật, lúc chạy bootstrap bạn thường đang SSH vào nên thư mục đã có; trong container mới tinh thì chưa. Cách sửa là một dòng idempotent: <code>install -d -m 755 /run/sshd</code>. Hai, cách báo lỗi: bẫy ERR nói đúng dòng và lệnh (Bài 7.3), và vì có <code>pipefail</code> nên cả ống <code>sshd -T | grep | sed</code> bị tính là hỏng, và lỗi đổ cho <code>sed</code> — lệnh cuối ống. Đọc thông báo ERR thì nhớ điều đó.</p>
<p>Lần chạy thứ hai, sau khi sửa, đi tiếp đơn giản như vậy: bước nào xong rồi chỉ in ✓, chỉ phần việc còn lại được làm:</p>
<div class="out">3/7 Thư mục và quyền
  ✓ /opt/datlich (root:root 755)
  …
5/7 SSH chỉ bằng khoá
  ✓ khoá đã có trong /home/deploy/.ssh/authorized_keys
  ✓ /etc/ssh/sshd_config.d/01-datlich.conf
    sshd -T: permitrootlogin no
    sshd -T: passwordauthentication no
    sshd -T: allowusers deploy
6/7 Tường lửa
  → bật ufw: chặn mọi cổng vào, trừ SSH và HTTP
7/7 Hẹn giờ
  → bật datlich-saoluu.timer
  → bật datlich-giamsat.timer
  → bật datlich-baocao.timer
Xong: 5 thay đổi.</div>
<p>Và lần thứ ba, lần chứng minh script là idempotent:</p>
<div class="out">$ time sudo ./ops/bootstrap.sh /root/.ssh/id_ed25519.pub | tail -n 12
…
6/7 Tường lửa
  ✓ ufw đang bật
7/7 Dịch vụ và hẹn giờ
  ✓ datlich.service
  ✓ datlich-saoluu.timer
  ✓ datlich-giamsat.timer
  ✓ datlich-baocao.timer
Xong: 0 thay đổi.

real	0m0.124s</div>
<div class="pitfall co-tieu-de"><strong>"File đã đúng" không có nghĩa là "thay đổi đã có hiệu lực".</strong> Nhìn kỹ lần chạy thứ hai: <code>01-datlich.conf</code> in ✓ — file đã được lần 1 ghi, rồi lần 1 chết TRƯỚC khi kịp nạp lại sshd. Lần 2 thấy file giống hệt nên bỏ qua bước nạp lại. Ở đây không hại gì (socket activation khởi động một sshd mới, đọc file mới), nhưng với một dịch vụ bình thường thì cấu hình mới sẽ không bao giờ có hiệu lực, còn script vẫn báo thành công. Vì thế script không dừng ở việc so file: sau bước SSH nó hỏi <code>sshd -T</code> giá trị <em>đang hiệu lực</em> và thoát với lỗi nếu vẫn còn cho đăng nhập bằng mật khẩu. Idempotent phải kiểm <em>tác dụng</em> của thay đổi, không chỉ kiểm cái file mô tả nó.</div>

<h3>SSH: chỉ bằng khoá, nghiệm thu bằng sshd -T</h3>
${slide('lx-16', 7, 'SSH chỉ bằng khoá — nghiệm thu bằng sshd -T')}
<p>File drop-in (file bổ sung) có bốn dòng:</p>
<pre><code class="language-text"><span class="tok-comment"># /etc/ssh/sshd_config.d/01-datlich.conf</span>
PasswordAuthentication no
KbdInteractiveAuthentication no
PermitRootLogin no
AllowUsers deploy</code></pre>
<p>Tên bắt đầu bằng <code>01-</code> là có chủ ý. <code>sshd_config</code> nạp <code>sshd_config.d/*.conf</code> theo thứ tự chữ cái, và với mỗi từ khoá thì <strong>giá trị đọc được ĐẦU TIÊN thắng</strong>. Ảnh VPS của nhà cung cấp cloud có sẵn <code>50-cloud-init.conf</code> nói <code>PasswordAuthentication yes</code>; một file tên <code>70-hardening.conf</code> sẽ thua nó mà không một tiếng động (Bài 11.3 — và sự cố 8 ở Bài 16.4 dựng lại đúng chuyện đó). Giờ thử cả ba cửa từ một shell khác: có khoá, không khoá, và bằng root:</p>
<pre><code class="language-bash">ssh deploy@127.0.0.1 "whoami; id"
ssh -o PubkeyAuthentication=no -o PreferredAuthentications=password,keyboard-interactive -o BatchMode=yes deploy@127.0.0.1 true
ssh -o BatchMode=yes root@127.0.0.1 true</code></pre>
<div class="out">deploy
uid=1001(deploy) gid=1001(deploy) groups=1001(deploy)
mã=0
deploy@127.0.0.1: Permission denied (publickey).
mã=255
root@127.0.0.1: Permission denied (publickey).
mã=255</div>
<p>Đọc kỹ lời từ chối: <code>(publickey)</code> là danh sách phương thức máy chủ CÒN đưa ra. Nó không còn đưa ra <code>password</code> nữa — đó mới là bằng chứng, chứ không phải chuyện một lần thử bị từ chối. Trên máy chủ thật, luôn giữ một phiên SSH thứ hai đang mở trong lúc sửa cấu hình SSH, để lỡ sai thì không tự khoá mình ở ngoài.</p>
<div class="pitfall co-tieu-de"><strong>pipefail + <code>grep -q</code> = mã 141 dù TÌM THẤY.</strong> Bản đầu của dòng nghiệm thu là <code>sshd -T | grep -qx 'passwordauthentication no'</code>. Nó hỏng mọi lần, và script in "sshd vẫn nhận mật khẩu" trong khi <code>sshd -T</code> nói rõ ràng là <code>no</code>. Đo thật: <code>set -o pipefail; sshd -T | grep -qx "passwordauthentication no"; echo "mã=$? PIPESTATUS=\${PIPESTATUS[*]}"</code> in <code>mã=141 PIPESTATUS=141 0</code>. <code>grep -q</code> thoát ngay khi thấy dòng 30 trên 96; <code>sshd</code> vẫn đang ghi thì nhận tín hiệu <code>SIGPIPE</code> (ống vỡ) và chết với mã 128 + 13 = 141; <code>pipefail</code> báo đó là trạng thái của cả ống. Sửa: để grep đọc hết, <code>grep -x '…' &gt;/dev/null</code> (đo: <code>mã=0 PIPESTATUS=0 0</code>). <code>grep -q</code> chỉ an toàn khi lệnh phía trước in rất ít — như <code>dpkg-query</code> và <code>ufw status</code> trong script này.</div>

<h3>Tường lửa: mặc định chặn, mở đúng 22 và 80</h3>
${slide('lx-16', 8, 'Tường lửa: chặn mặc định, chỉ mở 22 và 80')}
<p><code>ufw</code> ("uncomplicated firewall" — tường lửa không phức tạp) là lớp giao diện thân thiện của Ubuntu bọc ngoài netfilter trong nhân (Bài 9.5). Bốn quyết định: chặn mọi thứ đi vào, cho mọi thứ đi ra, cho SSH, cho HTTP. Trên máy chủ thật thứ tự rất quan trọng — cho phép <code>OpenSSH</code> TRƯỚC khi <code>ufw enable</code>, không thì lệnh bật tường lửa chính là lệnh cuối cùng bạn gõ được trên máy đó.</p>
<div class="out">$ sudo ufw status verbose
Status: active
Logging: on (low)
Default: deny (incoming), allow (outgoing), deny (routed)
New profiles: skip

To                         Action      From
--                         ------      ----
22/tcp (OpenSSH)           ALLOW IN    Anywhere
80/tcp (Nginx HTTP)        ALLOW IN    Anywhere
22/tcp (OpenSSH (v6))      ALLOW IN    Anywhere (v6)
80/tcp (Nginx HTTP (v6))   ALLOW IN    Anywhere (v6)</div>
<p>Rồi thử từ <em>bên ngoài</em> — một container thứ hai trong cùng mạng Docker đóng vai "một máy khác". App nghe ở <code>127.0.0.1:8080</code>, nginx ở <code>0.0.0.0:80</code>:</p>
<div class="out">$ curl -m 5 http://vps:8080/health
curl: (28) Connection timed out after 5002 milliseconds
$ curl -m 5 http://vps/health
{"status": "ok", "version": "1.1.0"}
# cùng lệnh đầu, lúc ufw TẮT một lát:
$ curl -m 5 http://vps:8080/health
curl: (7) Failed to connect to 172.17.0.6 port 8080 after 0 ms: Couldn't connect to server</div>
<p>Hai lớp chặn, hai triệu chứng khác nhau — đáng nhớ cho các công thức chẩn đoán của Chương 12. Khi ufw bật, gói tin bị <em>nuốt</em> (DROP): không ai trả lời, curl chờ tới hết giờ (mã 28). Khi ufw tắt, gói tin tới được máy, nhưng không có gì nghe cổng 8080 ở địa chỉ công khai, nên nhân trả lời bằng một gói reset ngay lập tức (mã 7, "0 ms"). App được bảo vệ hai lần: bởi tường lửa và bởi việc chỉ nghe ở 127.0.0.1.</p>
<div class="callout warn"><p><strong>Docker và ufw.</strong> Nếu app chạy trong Docker với <code>-p 8080:8080</code>, cổng được công bố sẽ ĐI VÒNG QUA ufw: Docker thêm luật NAT riêng, chuyển gói tin vào container trước khi các luật "đi vào" của ufw kịp nhìn thấy. Chỉ công bố trên localhost (<code>-p 127.0.0.1:8080:8080</code>) và để nginx là cửa công khai duy nhất — xem khoá Docker.</p></div>

<h3>Bảng cờ: các lệnh của bài này</h3>
<table>
<tr><th>Lệnh và cờ</th><th>Nghĩa</th><th>Ví dụ</th></tr>
<tr><td><code>useradd --system</code></td><td>tài khoản hệ thống: UID dưới 1000, không hết hạn, không hộp thư</td><td><code>useradd --system --home-dir /var/lib/app --shell /usr/sbin/nologin app</code></td></tr>
<tr><td><code>useradd --create-home</code> (<code>-m</code>)</td><td>tạo <code>/home/TÊN</code> từ <code>/etc/skel</code></td><td><code>useradd -m -s /bin/bash deploy</code></td></tr>
<tr><td><code>install -d -o U -g G -m M</code></td><td>tạo thư mục (cả thư mục cha) với chủ và quyền trong một bước; cũng sửa được thư mục đã có</td><td><code>install -d -o app -g app -m 750 /var/lib/app</code></td></tr>
<tr><td><code>install -m M NGUỒN ĐÍCH</code></td><td>chép file và đặt quyền (và <code>-o</code>/<code>-g</code>) trong một bước</td><td><code>install -m 644 app.service /etc/systemd/system/</code></td></tr>
<tr><td><code>cmp -s A B</code></td><td>so từng byte, im lặng: mã 0 giống, 1 khác, 2 thiếu file</td><td><code>cmp -s moi cu || install …</code></td></tr>
<tr><td><code>grep -qxF</code></td><td>im lặng · nguyên dòng · chuỗi cố định</td><td><code>grep -qxF "$dong" f || echo "$dong" &gt;&gt; f</code></td></tr>
<tr><td><code>visudo -cqf FILE</code></td><td>kiểm cú pháp file sudoers mà không cài nó</td><td>trước khi chép vào <code>/etc/sudoers.d/</code></td></tr>
<tr><td><code>sshd -t</code> / <code>sshd -T</code></td><td>kiểm cú pháp / in cấu hình <em>đang hiệu lực</em></td><td><code>sshd -T | grep ^passwordauthentication</code></td></tr>
<tr><td><code>ufw default deny incoming</code></td><td>chính sách cho gói tin không được ai cho phép</td><td>đặt đầu tiên, trước mọi <code>allow</code></td></tr>
<tr><td><code>ufw allow TÊN|CỔNG/tcp</code></td><td>mở theo hồ sơ ứng dụng hoặc theo cổng</td><td><code>ufw allow OpenSSH</code>, <code>ufw allow 443/tcp</code></td></tr>
<tr><td><code>ufw --force enable</code></td><td>bật mà không hỏi lại (dùng trong script)</td><td>chỉ sau khi đã cho SSH</td></tr>
<tr><td><code>ufw status verbose</code> / <code>numbered</code></td><td>luật kèm chính sách / kèm số để <code>ufw delete N</code></td><td></td></tr>
</table>

<h3>Chạy thử từng bước: dựng đúng máy chủ này trong container</h3>
<p>Bạn cần Docker. Ảnh này thêm systemd, SSH, nginx và các công cụ vào Ubuntu 24.04 trơn; container chạy <code>/sbin/init</code> làm PID 1 để <code>systemctl</code> chạy y như trên VPS. <code>--privileged</code> cần cho systemd và ufw — chỉ dùng cho container tập luyện vứt đi như thế này, và xoá nó khi xong.</p>
<pre><code class="language-bash"><span class="tok-comment"># Dockerfile (trong một thư mục trống)</span>
FROM ubuntu:24.04
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update &amp;&amp; apt-get install -y --no-install-recommends systemd systemd-sysv dbus \\
      openssh-server nginx python3 curl logrotate cron ufw iproute2 procps lsof psmisc \\
      util-linux sudo jq sqlite3 dos2unix tzdata ca-certificates file shellcheck \\
 &amp;&amp; rm -rf /var/lib/apt/lists/* &amp;&amp; rm -f /etc/nginx/sites-enabled/default
STOPSIGNAL SIGRTMIN+3
CMD ["/sbin/init"]</code></pre>
<pre><code class="language-bash">docker build -t lx16-img .
docker run -d --name lx16-srv --privileged --memory 512m --hostname clinic-vps lx16-img
docker exec lx16-srv systemctl is-system-running          <span class="tok-comment"># → running</span>
docker cp datlich lx16-srv:/root/datlich                  <span class="tok-comment"># bản sao kho của bạn</span>
docker exec -it lx16-srv bash
<span class="tok-comment"># bên trong:</span>
ssh-keygen -q -t ed25519 -N "" -C "ban@laptop" -f ~/.ssh/id_ed25519
cd /root/datlich &amp;&amp; sudo ./ops/bootstrap.sh ~/.ssh/id_ed25519.pub
sudo ./ops/bootstrap.sh ~/.ssh/id_ed25519.pub | tail -n 1    <span class="tok-comment"># → Xong: 0 thay đổi.</span>
ssh deploy@127.0.0.1 whoami                                   <span class="tok-comment"># → deploy</span>
ssh -o PubkeyAuthentication=no deploy@127.0.0.1               <span class="tok-comment"># → Permission denied (publickey)</span>
sudo ufw status verbose
<span class="tok-comment"># xong việc, trên máy chủ Docker:</span>
docker rm -f lx16-srv &amp;&amp; docker rmi lx16-img</code></pre>

<h3>Trên macOS và WSL khác gì</h3>
<p><code>bootstrap.sh</code> là script cho <em>máy chủ</em>. Laptop của bạn chỉ cần <code>ssh</code>, <code>ssh-keygen</code>, <code>scp</code> và <code>tar</code>, thứ chạy như nhau ở mọi nơi. Đo trên Mac (macOS 27), các công cụ phía máy chủ đơn giản là không có:</p>
<table>
<tr><th>Thứ trong bài</th><th>Ubuntu (VPS)</th><th>Mac (đo thật)</th><th>WSL2</th></tr>
<tr><td><code>useradd</code>, <code>ufw</code>, <code>systemctl</code>, <code>ss</code>, <code>namei</code></td><td>có</td><td><code>command -v</code> không thấy cái nào (macOS dùng <code>dscl</code>/<code>sysadminctl</code>, <code>pf</code>, <code>launchd</code>)</td><td>có — WSL2 là một Ubuntu thật</td></tr>
<tr><td><code>stat -c '%U:%G %a'</code></td><td>cú pháp GNU</td><td><code>stat: illegal option -- c</code> (BSD dùng <code>stat -f '%Su:%Sg %Lp'</code>)</td><td>GNU</td></tr>
<tr><td><code>systemctl</code> trong WSL</td><td>—</td><td>—</td><td>chỉ khi đặt <code>systemd=true</code> trong <code>/etc/wsl.conf</code> (Bài 15.3)</td></tr>
<tr><td><code>ssh-keygen -t ed25519</code></td><td>như nhau</td><td>như nhau (macOS có sẵn OpenSSH)</td><td>như nhau (dùng <code>~/.ssh</code> bên Linux)</td></tr>
</table>
<p>Nên: viết và thử <code>bootstrap.sh</code> trong container Linux hoặc trong WSL2, đừng bao giờ "chạy thử trên Mac xem được không" — một script chạy được trên Mac chỉ chứng minh được là nó chạy được trên Mac.</p>

<h3>Khi nào dùng script bootstrap — và khi nào không</h3>
<ul>
<li><strong>Một tới ba máy chủ tự bạn trông</strong> (đồ án sinh viên, một dự án nhỏ): một script bootstrap trong kho là vừa khít — dễ đọc, có lịch sử phiên bản, không phải học thêm công cụ nào.</li>
<li><strong>Nhiều máy hơn, hoặc cả một đội</strong>: đúng những ý tưởng này — bước idempotent, trạng thái mong muốn, kiểm trước làm sau — là nền móng của các công cụ quản lý cấu hình như Ansible. Chuyển sang đó sau này sẽ thấy quen.</li>
<li><strong>Máy do nhà cung cấp cloud tạo</strong>: cloud-init chạy được bootstrap của bạn ở lần khởi động đầu, nên VPS mới về là đã sẵn sàng.</li>
<li><strong>Không</strong> dùng cho bí mật: giữ <code>.env</code> ngoài Git; bootstrap chỉ tạo một khung rỗng một lần. Bài 8.3 nói bí mật nên nằm ở đâu.</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> một bạn cùng nhóm "sửa nhanh" máy chủ bằng tay. Bootstrap của bạn phải phát hiện và sửa lại — trong container tập luyện ở trên.</p><ol>
<li>Chạy bootstrap tới khi nó in <code>Xong: 0 thay đổi.</code></li>
<li>Làm hỏng ba thứ bằng tay: <code>chmod 777 /var/lib/datlich</code>, <code>chown root /var/log/datlich</code>, và thêm một dòng chú thích vào <code>/etc/systemd/system/datlich.service</code>.</li>
<li>Chạy lại bootstrap. Nó phải liệt kê đúng ba lần sửa bằng <code>→</code>, và thay đổi ở unit phải kéo theo một lần <code>daemon-reload</code> (kiểm bằng <code>systemctl show datlich -p NeedDaemonReload</code> → <code>no</code>).</li>
<li>Tạo <code>/etc/ssh/sshd_config.d/00-test.conf</code> chứa <code>PasswordAuthentication yes</code>, chạy bootstrap, đọc lỗi nó in ra. Xoá file đó rồi chạy lại.</li>
</ol><p><strong>Đạt khi:</strong> bước 3 in <code>Xong: 3 thay đổi.</code>, lần chạy kế tiếp in <code>Xong: 0 thay đổi.</code>, và bước 4 kết thúc với mã 1 cùng lời nhắn về một file được đọc trước <code>01-datlich.conf</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Idempotent (lũy đẳng)</span><span class="v">Chạy hai lần để lại hệ thống y như chạy một lần; lần thứ hai không đổi gì.</span></div>
  <div class="kv"><span class="k">Bootstrap (khởi dựng)</span><span class="v">Script biến một máy mới tinh thành một máy chủ đã cấu hình xong.</span></div>
  <div class="kv"><span class="k">System user (người dùng hệ thống)</span><span class="v">Tài khoản cho một dịch vụ chứ không cho người: UID thấp, không mật khẩu, thường là <code>nologin</code>.</span></div>
  <div class="kv"><span class="k">Least privilege (quyền tối thiểu)</span><span class="v">Mỗi người dùng hay tiến trình chỉ có đúng những quyền việc của nó cần, không hơn.</span></div>
  <div class="kv"><span class="k">Drop-in file (file bổ sung)</span><span class="v">File nhỏ trong thư mục <code>*.d/</code>, thêm vào hoặc ghi đè lên file cấu hình chính.</span></div>
  <div class="kv"><span class="k">Effective configuration (cấu hình đang hiệu lực)</span><span class="v">Thứ chương trình thật sự dùng sau khi đọc hết mọi file — <code>sshd -T</code>, <code>systemctl show</code>, <code>nginx -T</code>.</span></div>
  <div class="kv"><span class="k">Default deny (mặc định chặn)</span><span class="v">Chính sách tường lửa chặn mọi thứ không được cho phép rõ ràng.</span></div>
  <div class="kv"><span class="k">Socket activation (kích hoạt theo socket)</span><span class="v">systemd giữ cổng hộ và khởi động dịch vụ khi kết nối đầu tiên tới.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>App chạy bằng người dùng hệ thống có <code>nologin</code>; mã thuộc root, dữ liệu và log thuộc app, bí mật là 640 root:app.</li>
<li>Bước nào của bootstrap cũng hỏi "đã đúng chưa?" rồi mới làm: <code>id -u ||</code>, <code>cmp -s</code>, <code>stat -c</code>, <code>grep -qxF</code>; lần chạy cuối trong ngày phải nói "0 thay đổi".</li>
<li>Kiểm <em>tác dụng</em>, đừng kiểm file: <code>sshd -T</code> sau khi đổi SSH, <code>systemctl show</code> sau khi đổi unit.</li>
<li>Đặt tên drop-in SSH là <code>01-…</code>: giá trị đọc được đầu tiên thắng, và ảnh cloud có sẵn <code>50-cloud-init.conf</code>.</li>
<li>Dưới <code>pipefail</code>, <code>lệnh-in-nhiều | grep -q</code> có thể trả 141; dùng <code>grep … &gt;/dev/null</code>.</li>
<li>ufw: mặc định chặn đi vào, cho SSH trước khi bật; timeout là bị nuốt, refused là không ai nghe.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/man8/useradd.8.html" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">useradd(8)</span><span class="lc-sub">Mọi cờ, gồm <code>--system</code>, <code>--home-dir</code>, <code>--shell</code> và cách chọn UID hệ thống.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man1/install.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">install(1)</span><span class="lc-sub">Chép và đặt chủ, quyền trong một bước; <code>-d</code> cho thư mục.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man5/sshd_config.5.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">sshd_config(5)</span><span class="lc-sub">Danh sách từ khoá chính thức, luật "giá trị lấy được đầu tiên" và <code>Include</code>.</span></span>
</a>
<a class="link-card" href="https://manpages.ubuntu.com/manpages/noble/man8/ufw.8.html" target="_blank" rel="noopener">
  <span class="lc-ico">🧱</span>
  <span class="lc-body"><span class="lc-title">ufw(8) trên Ubuntu 24.04</span><span class="lc-sub">Chính sách, hồ sơ ứng dụng như <code>OpenSSH</code>, thứ tự luật và <code>status verbose</code>.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Code Lab — Linux &amp; Bash</span><span class="lc-sub">Bài tập có chấm điểm của khoá; ôn lại phần quyền và script trước bài thi cuối khoá.</span></span>
</a>
<p class="note-ct"><strong>Thói quen mang về:</strong> đừng bao giờ sửa máy chủ bằng tay mà không sửa cái script mô tả nó — rồi chạy lại script đó tới khi nó nói "0 thay đổi".</p>
</div>
`,
    },
    /* ─────────────────────────── 16.2 ─────────────────────────── */
    {
      title: "16.2 — A production deploy script, and the systemd unit that runs the app|||16.2 — Script deploy mức production, và unit systemd chạy app",
      slug: "lnx-16-2-deploy-script",
      type: "LESSON",
      isFreePreview: true,
      description: "deploy.sh với set -Eeuo pipefail, trap, flock, thư mục bản phát hành theo thời gian + symlink current đổi nguyên tử, health check tự quay lui, mã thoát có nghĩa; unit với User=, Restart=, MemoryMax=, EnvironmentFile= — và hai lỗi mà chỉ lần chạy thật mới lộ ra.",
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.2</span>
<h2>A production deploy script, and the unit that runs the app</h2>
<p class="lead">Deploying is the moment a working server is most likely to stop working. This lesson builds <code>deploy.sh</code>, the script the <code>deploy</code> user is allowed to run with sudo, around four promises: it refuses to start if another deploy is running; it never touches the running version until the new one has passed its checks; every version lives in its own directory so going back is a one-arrow change; and if the new version is not healthy within ten seconds, it goes back <em>by itself</em>. Then it builds the systemd unit that turns <code>app.py</code> into a service with a user, a memory ceiling and an automatic restart.</p>

<h3>Why a script, and why this shape</h3>
<p>The group's first "deploy" was <code>scp app.py vps:/opt/app/ &amp;&amp; ssh vps 'sudo systemctl restart app'</code>. It works — until the day the new <code>app.py</code> crashes on start. Then the old file is already overwritten, the service is dead, and the fix is typed in a panic. Every design choice below exists because of one of these failure modes: two people deploying at once (a lock), a half-copied upload (build the release in a temporary directory, move it into place in one step), a broken release (health check + automatic rollback), and "which version is actually running?" (one directory per release, one symlink called <code>current</code>).</p>

<h3>The armour: strict mode, traps, a lock, and exit codes with meaning</h3>
${slide('lx-16', 9, 'deploy.sh: bộ giáp set -Eeuo, trap, flock')}
<p>The complete script, 103 lines, ShellCheck clean:</p>
<pre><code class="language-bash">#!/usr/bin/env bash
<span class="tok-comment"># deploy.sh — đưa một bản app "datlich" lên máy chủ, tự quay lui nếu bản mới không khoẻ.</span>
<span class="tok-comment"># Cách dùng: sudo deploy.sh GÓI.tar.gz | THƯ_MỤC   triển khai bản mới</span>
<span class="tok-comment">#            sudo deploy.sh --rollback              quay về bản liền trước</span>
<span class="tok-comment">#            sudo deploy.sh --list                  liệt kê các bản, * = đang chạy</span>
set -Eeuo pipefail
shopt -s inherit_errexit

readonly APP=datlich GOC=/opt/datlich REL=/opt/datlich/releases
readonly LOG=/var/log/datlich/deploy.log GIU=5
readonly HEALTH=http://127.0.0.1:8080/health

log()  { printf '%(%F %T)T %-5s %s\\n' -1 "$1" "\${*:2}" | tee -a "$LOG" &gt;&amp;2; }
info() { log INFO "$@"; }
warn() { log WARN "$@"; }
die()  { log ERROR "$1"; exit "\${2:-1}"; }
usage() { sed -n '3,5s/^# \\{0,1\\}//p' "$0"; }

TAM=''
don_dep() { if [[ -n $TAM &amp;&amp; -d $TAM ]]; then rm -rf -- "$TAM"; fi; }
trap don_dep EXIT
trap 'log ERROR "lệnh hỏng ở dòng $LINENO: $BASH_COMMAND"' ERR

hien_tai()    { if [[ -L $GOC/current ]]; then readlink -f "$GOC/current"; fi; }
cac_ban()     { find "$REL" -mindepth 1 -maxdepth 1 -type d -name '20??????-??????' | sort; }
doi_symlink() { ln -sfn "$1" "$GOC/.current.moi"; mv -T "$GOC/.current.moi" "$GOC/current"; }
khoi_dong_lai() {                      <span class="tok-comment"># reset-failed: xoá bộ đếm StartLimitBurst của lần hỏng trước</span>
  systemctl reset-failed "$APP" 2&gt;/dev/null || true
  systemctl restart "$APP"
}
kiem_suc_khoe() {
  for _ in {1..10}; do
    [[ $(curl -fsS -m 2 "$HEALTH" 2&gt;/dev/null) == *'"status": "ok"'* ]] &amp;&amp; return 0
    sleep 1
  done
  return 1
}

trien_khai() {
  local nguon=$1 cu moi
  [[ -e $nguon ]] || die "không có: $nguon" 2
  cu=$(hien_tai)
  moi=$REL/$(date +%Y%m%d-%H%M%S)
  [[ ! -e $moi ]] || die "$moi đã tồn tại" 2
  TAM=$(mktemp -d "$REL/.tam.XXXXXX")
  if [[ -d $nguon ]]; then cp -a "$nguon/." "$TAM/"; else tar -xzf "$nguon" -C "$TAM"; fi
  [[ -f $TAM/app.py &amp;&amp; -f $TAM/VERSION ]] || die "gói thiếu app.py hoặc VERSION" 2
  python3 -c 'import ast, sys; ast.parse(open(sys.argv[1]).read())' "$TAM/app.py" \\
    || die "app.py sai cú pháp — không đụng vào bản đang chạy" 2
  chown -R root:root "$TAM"; chmod -R u=rwX,go=rX "$TAM"
  mv -T "$TAM" "$moi"; TAM=''
  local ten_cu=\${cu##*/}
  info "bản $(&lt;"$moi/VERSION") → \${moi##*/} (đang chạy: \${ten_cu:-chưa có})"
  doi_symlink "$moi"
  khoi_dong_lai
  if kiem_suc_khoe; then
    info "health OK — đang chạy $(&lt;"$moi/VERSION")"
  else
    warn "health check hỏng sau 10 lần thử — QUAY LUI"
    [[ -n $cu ]] || die "không có bản cũ để quay về" 4
    doi_symlink "$cu"; khoi_dong_lai
    kiem_suc_khoe || die "quay lui xong mà vẫn không khoẻ — gọi người!" 4
    mv -T "$moi" "$moi.hong"
    die "deploy thất bại, đã về \${cu##*/}. Xem: journalctl -u $APP -n 30" 1
  fi
  local xoa
  xoa=$(cac_ban | grep -vxF "$(hien_tai)" | head -n -$((GIU - 1)) || true)
  if [[ -n $xoa ]]; then
    info "dọn $(wc -l &lt;&lt;&lt;"$xoa") bản cũ (giữ $GIU)"
    xargs -r rm -rf -- &lt;&lt;&lt;"$xoa"
  fi
}

quay_lui() {
  local cu truoc
  cu=$(hien_tai)
  truoc=$(cac_ban | grep -B1 -xF "$cu" | head -n 1 || true)
  [[ -n $truoc &amp;&amp; $truoc != "$cu" ]] || die "không có bản nào trước \${cu##*/}" 2
  doi_symlink "$truoc"; khoi_dong_lai
  kiem_suc_khoe || die "bản \${truoc##*/} cũng không khoẻ" 4
  info "đã quay lui \${cu##*/} → \${truoc##*/} ($(&lt;"$truoc/VERSION"))"
}

liet_ke() {
  local b cu; cu=$(hien_tai)
  while IFS= read -r b; do
    printf '%s %s  %s\\n' "$([[ $b == "$cu" ]] &amp;&amp; echo '*' || echo ' ')" "\${b##*/}" "$(&lt;"$b/VERSION")"
  done &lt; &lt;(cac_ban)
}

(( EUID == 0 )) || { echo "cần chạy bằng sudo" &gt;&amp;2; exit 2; }
case \${1:-} in
  --list)     liet_ke; exit 0 ;;
  -h|--help)  usage; exit 0 ;;
  '')         usage &gt;&amp;2; exit 2 ;;
esac
exec {KHOA}&gt;"/run/lock/$APP-deploy.lock"
flock -n "$KHOA" || die "đang có một deploy khác chạy — thử lại sau" 3
case $1 in
  --rollback) quay_lui ;;
  -*)         die "cờ lạ: $1 (xem --help)" 2 ;;
  *)          trien_khai "$1" ;;
esac</code></pre>
<p>What each layer buys, and where you learned it:</p>
<ul>
<li><strong><code>set -Eeuo pipefail</code> + <code>inherit_errexit</code></strong> (Lessons 7.1, 13.4): any failing command stops the script, also inside functions and inside <code>$( )</code>; an unset variable is an error, not an empty string.</li>
<li><strong>Two traps</strong> (Lesson 7.3): <code>EXIT</code> deletes the half-built temporary release whatever happens; <code>ERR</code> names the line and the command.</li>
<li><strong>A log with levels</strong> (Lesson 13.4) to stderr <em>and</em> to <code>/var/log/datlich/deploy.log</code> — so a deploy started from CI leaves a history on the server.</li>
<li><strong><code>exec {KHOA}&gt;…; flock -n "$KHOA"</code></strong> (Lessons 7.3, 13.2): bash picks a free descriptor, <code>flock -n</code> takes the lock or gives up at once. The lock disappears when the process dies, even with <code>kill -9</code> — no stale lock file to clean up.</li>
<li><strong>Checks before touching anything</strong>: the package exists, it contains <code>app.py</code> and <code>VERSION</code>, and <code>app.py</code> parses (<code>ast.parse</code> reads the Python without running it).</li>
<li><strong>Exit codes with a meaning</strong>, so the caller — a person, cron or GitHub Actions — can react:</li>
</ul>
<table>
<tr><th>Code</th><th>Meaning</th><th>What the caller should do</th></tr>
<tr><td>0</td><td>the new release is healthy and running (or <code>--help</code>/<code>--list</code>)</td><td>nothing</td></tr>
<tr><td>1</td><td>health check failed, <strong>already rolled back</strong>; users are served by the old release</td><td>tell the team, read the journal</td></tr>
<tr><td>2</td><td>called wrongly, or the package is broken — nothing was touched</td><td>fix the call or the package</td></tr>
<tr><td>3</td><td>another deploy holds the lock</td><td>try again in a minute</td></tr>
<tr><td>4</td><td>the rollback failed too</td><td>wake somebody up</td></tr>
</table>
<div class="out">$ sudo deploy.sh --help; echo "mã=$?"
Cách dùng: sudo deploy.sh GÓI.tar.gz | THƯ_MỤC   triển khai bản mới
           sudo deploy.sh --rollback              quay về bản liền trước
           sudo deploy.sh --list                  liệt kê các bản, * = đang chạy
mã=0
$ sudo deploy.sh --xoa; echo "mã=$?"
2026-09-28 17:35:32 ERROR cờ lạ: --xoa (xem --help)
mã=2
$ sudo deploy.sh /khong/co.tgz; echo "mã=$?"
2026-09-28 17:35:32 ERROR không có: /khong/co.tgz
mã=2
$ deploy.sh --list; echo "mã=$?"          # without sudo
cần chạy bằng sudo
mã=2</div>

<h3>One directory per release; "current" is just an arrow</h3>
${slide('lx-16', 10, 'Mỗi bản một thư mục; current chỉ là mũi tên')}
<p>Every deploy creates <code>/opt/datlich/releases/YYYYmmdd-HHMMSS</code> — the name <em>is</em> the time, so sorting by name sorts by age. The unit file runs <code>/opt/datlich/current/app.py</code>, and <code>current</code> is a symbolic link (Lesson 2.4) to one of those directories. Deploying is "point the arrow at the new directory and restart"; rolling back is "point it at the old one and restart". Nothing is copied over the running code, so a failed upload can never leave a half-written <code>app.py</code> behind.</p>
<div class="out">$ ls -l /opt/datlich
lrwxrwxrwx 1 root root   37 Sep 28 17:05 current -&gt; /opt/datlich/releases/20260928-170509
drwxr-xr-x 2 root root 4096 Sep 28 17:03 ops
drwxr-xr-x 8 root root 4096 Sep 28 17:05 releases
$ ls /opt/datlich/releases
20260928-170424  20260928-170427.hong  20260928-170452  20260928-170504  20260928-170506  20260928-170509</div>
<p>Two moves in the script must be <strong>atomic</strong> — happen completely or not at all, with no in-between state another process could see. Both use <code>rename()</code>, which the kernel guarantees is atomic on one filesystem:</p>
<ol>
<li>The new release is unpacked into <code>releases/.tam.XXXXXX</code> — created by <code>mktemp -d</code> <em>inside</em> <code>releases/</code>, so on the same disk — and then <code>mv -T</code> renames it to its final name. A directory with a <code>2026…</code> name is therefore always complete.</li>
<li>The arrow is replaced by creating the new link next to the old one and renaming it over it: <code>ln -sfn NEW .current.moi; mv -T .current.moi current</code>. <code>-T</code> ("no target directory") makes <code>mv</code> replace the link <code>current</code> itself instead of moving the new link <em>into</em> the directory it points to.</li>
</ol>
<p>Is plain <code>ln -sfn NEW current</code> not atomic too? We traced it with <code>strace</code> on three systems:</p>
<div class="out"># Ubuntu 24.04 — GNU coreutils 9.4
symlinkat("r2", AT_FDCWD, "cur")        = -1 EEXIST (File exists)
symlinkat("r2", AT_FDCWD, "CuU8aHWH")   = 0
renameat(AT_FDCWD, "CuU8aHWH", AT_FDCWD, "cur") = 0
# Debian 12 — GNU coreutils 9.1: the same three calls
# Alpine — BusyBox v1.37.0
unlinkat(AT_FDCWD, "cur", 0)            = 0
symlinkat("r2", AT_FDCWD, "cur")        = 0</div>
<p>Modern GNU <code>ln</code> already builds a temporary link and renames it — atomic. BusyBox, the <code>ln</code> inside Alpine-based containers, deletes <code>current</code> first and creates it again: between those two calls there is no <code>current</code> at all, and a request arriving in that instant fails. Writing the rename yourself with <code>mv -T</code> is correct on every Linux, whichever <code>ln</code> it has. (On a Mac, <code>mv -T</code> does not exist — measured: <code>mv: illegal option -- T</code>; that is fine, because this script runs on the server.)</p>
<div class="callout info"><p><strong>systemd resolves the symlink when the service STARTS.</strong> <code>WorkingDirectory=/opt/datlich/current</code> and the path in <code>ExecStart=</code> are followed once, at start. Measured on the running app: <code>ls -l /proc/4422/cwd</code> → <code>/opt/datlich/releases/20260928-170509</code> — the real directory, not the link. Moving the arrow without a restart therefore changes nothing for the running process (Lesson 12.4 met exactly this: "I switched <code>current</code> twenty minutes ago and users still see the old behaviour"). That is why switching and restarting are one step in the script.</p></div>

<h3>The health check decides: keep the new release or roll back</h3>
${slide('lx-16', 11, 'Health check quyết định: giữ bản mới hay quay lui')}
<p>After the restart the script asks the app itself: up to ten times, one second apart, <code>curl -fsS -m 2 http://127.0.0.1:8080/health</code>, and it accepts only a body that contains <code>"status": "ok"</code>. Checking the <em>content</em> matters: in incident 4 of Lesson 16.4 a forgotten test server held the port and answered every request with an HTML error page — a check that only asked "did something answer?" would have called that healthy. Here is a real sequence: two good releases, then 1.2.0, whose code reads an environment variable <code>SMS_API_KEY</code> that nobody added to <code>/etc/datlich/datlich.env</code> — the most common way a release that works on a laptop dies on a server.</p>
<div class="out">$ ssh deploy@vps sudo deploy.sh datlich-1.0.0.tgz
2026-09-28 17:04:22 INFO  bản 1.0.0 → 20260928-170422 (đang chạy: chưa có)
2026-09-28 17:04:23 INFO  health OK — đang chạy 1.0.0
mã=0
$ ssh deploy@vps sudo deploy.sh datlich-1.1.0.tgz
2026-09-28 17:04:24 INFO  bản 1.1.0 → 20260928-170424 (đang chạy: 20260928-170422)
2026-09-28 17:04:25 INFO  health OK — đang chạy 1.1.0
mã=0
$ ssh deploy@vps sudo deploy.sh datlich-1.2.0.tgz
2026-09-28 17:04:27 INFO  bản 1.2.0 → 20260928-170427 (đang chạy: 20260928-170424)
2026-09-28 17:04:37 WARN  health check hỏng sau 10 lần thử — QUAY LUI
2026-09-28 17:04:38 ERROR deploy thất bại, đã về 20260928-170424. Xem: journalctl -u datlich -n 30
mã=1
$ curl -s localhost/health
{"status": "ok", "version": "1.1.0"}</div>
<p>Eleven seconds after 1.2.0 was switched on, users were back on 1.1.0, and the broken release was renamed <code>20260928-170427.hong</code> ("broken") so nobody rolls <em>forward</em> into it by mistake. The journal says exactly why it died (Lesson 16.3 shows how to find such lines):</p>
<div class="out">$ journalctl -u datlich -o short-iso -g KeyError
2026-09-28T17:04:27+00:00 clinic-vps python3[2304]: KeyError: 'SMS_API_KEY'
2026-09-28T17:04:29+00:00 clinic-vps python3[2317]: KeyError: 'SMS_API_KEY'
…</div>
<p>The fix for 1.2.0 is not in the code: add the variable to the <code>.env</code> file on the server (and to a checklist, Lesson 8.3), then deploy the same package again.</p>

<h3>Listing, manual rollback, bad packages and two deploys at once</h3>
${slide('lx-16', 12, 'Liệt kê, quay lui tay, và hai người deploy cùng lúc')}
<p>A package with a syntax error never gets near the running app — the <code>ast.parse</code> check fails while it is still in the temporary directory, and the EXIT trap deletes it:</p>
<div class="out">$ ssh deploy@vps sudo deploy.sh datlich-1.2.1.tgz
Traceback (most recent call last):
  File "&lt;string&gt;", line 1, in &lt;module&gt;
  File "/usr/lib/python3.12/ast.py", line 52, in parse
    return compile(source, filename, mode, flags,
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "&lt;unknown&gt;", line 64
    def hong(:
             ^
SyntaxError: invalid syntax
2026-09-28 17:04:39 ERROR app.py sai cú pháp — không đụng vào bản đang chạy
mã=2
$ ls -a /opt/datlich/releases
.  ..  20260928-170422  20260928-170424  20260928-170427.hong</div>
<p>No <code>.tam.*</code> directory was left behind. Two teammates deploying at the same moment — the second one is turned away by the lock and told to try again, with exit code 3:</p>
<div class="out">$ deploy.sh datlich-1.1.0.tgz &amp; deploy.sh datlich-1.1.0.tgz; wait
2026-09-28 17:04:52 INFO  bản 1.1.0 → 20260928-170452 (đang chạy: 20260928-170424)
2026-09-28 17:04:52 ERROR đang có một deploy khác chạy — thử lại sau
mã bản thứ hai=3
2026-09-28 17:04:53 INFO  health OK — đang chạy 1.1.0</div>
<p>Rolling back by hand goes to the release just before the current one (<code>grep -B1</code> prints the line before the match — Lesson 3.3); <code>--list</code> marks the running one with <code>*</code>:</p>
<div class="out">$ sudo deploy.sh --rollback
2026-09-28 17:04:55 INFO  đã quay lui 20260928-170452 → 20260928-170424 (1.1.0)
$ sudo deploy.sh --list
  20260928-170422  1.0.0
* 20260928-170424  1.1.0
  20260928-170452  1.1.0</div>
<p>And old releases are cleaned up automatically, keeping five (the running one is never deleted, even after a rollback, because it is filtered out with <code>grep -vxF "$(hien_tai)"</code> before <code>head -n -4</code> picks the ones to delete):</p>
<div class="out">2026-09-28 17:05:09 INFO  bản 1.1.0 → 20260928-170509 (đang chạy: 20260928-170506)
2026-09-28 17:05:10 INFO  dọn 1 bản cũ (giữ 5)
$ sudo deploy.sh --list
  20260928-170424  1.1.0
  20260928-170452  1.1.0
  20260928-170504  1.1.0
  20260928-170506  1.1.0
* 20260928-170509  1.1.0</div>

<h3>What went wrong on the first real run</h3>
${slide('lx-16', 13, 'Lần chạy thật đầu tiên: StartLimitBurst khoá luôn cả quay lui')}
<p>The script above is version three. The first version had two bugs that only a real run could show — both instructive.</p>
<p><strong>Bug 1 — the rollback itself was refused.</strong> Within one minute the first real test started the service four times through deploys — a first deploy, then 1.0.0, 1.1.0 and the broken 1.2.0. The health check failed, the script switched the arrow back — and then:</p>
<div class="out">2026-09-28 17:03:44 WARN  health check hỏng sau 10 lần thử — QUAY LUI
Job for datlich.service failed because the control process exited with error code.
See "systemctl status datlich.service" and "journalctl -xeu datlich.service" for details.
2026-09-28 17:03:44 ERROR lệnh hỏng ở dòng 57: systemctl restart "$APP"
mã=1
$ journalctl -u datlich -o short --since 17:03:36 --until 17:03:45 | cut -c17-
clinic-vps systemd[1]: datlich.service: Scheduled restart job, restart counter is at 1.
clinic-vps systemd[1]: Started datlich.service - Đặt lịch phòng khám (API).
…
clinic-vps systemd[1]: datlich.service: Scheduled restart job, restart counter is at 2.
clinic-vps systemd[1]: datlich.service: Start request repeated too quickly.
clinic-vps systemd[1]: datlich.service: Failed with result 'exit-code'.
clinic-vps systemd[1]: Failed to start datlich.service - Đặt lịch phòng khám (API).
clinic-vps systemd[1]: datlich.service: Start request repeated too quickly.
clinic-vps systemd[1]: datlich.service: Failed with result 'exit-code'.
clinic-vps systemd[1]: Failed to start datlich.service - Đặt lịch phòng khám (API).</div>
<p>The unit says <code>StartLimitBurst=5</code> within <code>StartLimitIntervalSec=60</code> (Lesson 11.1): more than five starts in a minute and systemd refuses to start the unit at all. Counting the starts in the journal: four started by deploys in the last minute, plus one automatic restart of the crashing 1.2.0 — five. The sixth, the <code>Restart=</code> of the crash loop, was refused, and so was the rollback's <code>systemctl restart</code>. The website stayed down although the old release on disk was perfectly fine. The fix is <code>khoi_dong_lai()</code>: <code>systemctl reset-failed datlich</code> before every restart the script makes, which clears the failed state and the start counter. With that, the same broken 1.2.0 rolled back in eleven seconds (the run shown earlier).</p>
<div class="pitfall co-tieu-de"><strong><code>readlink -f</code> answers even for a path that does not exist.</strong> The first <code>hien_tai()</code> was <code>readlink -f "$GOC/current" 2&gt;/dev/null || true</code>, and the very first deploy logged <code>(đang chạy: current)</code> — "currently running: current" — on a server where nothing had been deployed. Measured: <code>readlink -f /opt/datlich/khong-co; echo "mã=$?"</code> prints <code>/opt/datlich/khong-co</code> and <code>mã=0</code>: GNU <code>readlink -f</code> succeeds as long as every component except the last exists; only <code>readlink -f /khong/co/gi</code> fails with 1. A rollback would have tried to "go back" to a release called <code>current</code>. The fix asks the right question first: <code>[[ -L $GOC/current ]]</code> — "is there a symlink?" — and only then resolves it.</div>

<h3>The unit that runs the app</h3>
${slide('lx-16', 14, 'Unit của app: User=, Restart=, MemoryMax=, EnvironmentFile=')}
<pre><code class="language-ini">[Unit]
Description=Đặt lịch phòng khám (API)
After=network-online.target
Wants=network-online.target
StartLimitIntervalSec=60
StartLimitBurst=5

[Service]
Type=simple
User=datlich
Group=datlich
EnvironmentFile=/etc/datlich/datlich.env
WorkingDirectory=/opt/datlich/current
ExecStart=/usr/bin/python3 /opt/datlich/current/app.py
Restart=on-failure
RestartSec=2
MemoryMax=150M
MemorySwapMax=0
NoNewPrivileges=yes
ProtectSystem=strict
ProtectHome=yes
PrivateTmp=yes
ReadWritePaths=/var/lib/datlich /var/log/datlich

[Install]
WantedBy=multi-user.target</code></pre>
<table>
<tr><th>Directive</th><th>Meaning</th><th>Why here</th></tr>
<tr><td><code>After=</code> / <code>Wants=network-online.target</code></td><td>order after, and pull in, "the network is up"</td><td>the app should not start before it can listen</td></tr>
<tr><td><code>StartLimitIntervalSec=</code>, <code>StartLimitBurst=</code></td><td>at most N starts in T seconds, then refuse (belongs in <code>[Unit]</code>)</td><td>stops a crash loop from spinning forever; <code>reset-failed</code> clears it</td></tr>
<tr><td><code>Type=simple</code></td><td>the process started by <code>ExecStart</code> is the service</td><td>the app does not fork into the background</td></tr>
<tr><td><code>User=</code>, <code>Group=</code></td><td>run as this account</td><td>not root (Lesson 16.1)</td></tr>
<tr><td><code>EnvironmentFile=</code></td><td>read <code>KEY=value</code> lines into the environment</td><td>settings and secrets outside the code</td></tr>
<tr><td><code>WorkingDirectory=</code></td><td>the directory the process starts in</td><td>resolved at start: a new <code>current</code> needs a restart</td></tr>
<tr><td><code>ExecStart=</code></td><td>the command, with an absolute path</td><td>no <code>PATH</code> search, no shell</td></tr>
<tr><td><code>Restart=on-failure</code>, <code>RestartSec=2</code></td><td>restart after a crash, a signal or a timeout, 2 s later — not after a clean stop</td><td>a crash at 3 a.m. heals itself</td></tr>
<tr><td><code>MemoryMax=150M</code></td><td>hard memory ceiling of the unit's cgroup</td><td>one bad request cannot eat the server's RAM</td></tr>
<tr><td><code>MemorySwapMax=0</code></td><td>no swap for this unit</td><td>without it, the ceiling "leaks" into swap — incident 3, Lesson 16.4</td></tr>
<tr><td><code>NoNewPrivileges=yes</code></td><td>the process and its children can never gain privileges (no setuid)</td><td>cheap defence in depth</td></tr>
<tr><td><code>ProtectSystem=strict</code> + <code>ReadWritePaths=</code></td><td>the whole filesystem is read-only for the service, except the listed paths</td><td>the app can only write where it should</td></tr>
<tr><td><code>ProtectHome=yes</code>, <code>PrivateTmp=yes</code></td><td>hide <code>/home</code>; give the service its own <code>/tmp</code></td><td>no peeking at users' files, no shared <code>/tmp</code></td></tr>
<tr><td><code>WantedBy=multi-user.target</code></td><td>what <code>systemctl enable</code> hooks it into</td><td>starts at boot</td></tr>
</table>
<div class="pitfall co-tieu-de"><strong><code>EnvironmentFile=</code> is not a shell script.</strong> systemd reads each line as <code>KEY=value</code>. No <code>export</code>, no <code>$(command)</code>, no variable expansion from other lines; quotes are removed but not interpreted like bash. A <code>.env</code> written for <code>source .env</code> in bash can therefore mean something different to systemd (Lesson 8.3 measured the difference). Keep it to plain <code>KEY=value</code> lines, mode 640, owned by root with the app's group.</div>
<p>After changing a unit file, <code>systemctl daemon-reload</code> is mandatory — the bootstrap script does it automatically, but if you edit by hand and forget, <code>systemctl restart</code> runs the <em>old</em> configuration and prints one easy-to-miss line (incident 8 in Lesson 16.4 shows it). To see how much sandboxing the unit really has, ask systemd:</p>
<div class="out">$ systemd-analyze security datlich | tail -1
→ Overall exposure level for datlich.service: 8.3 EXPOSED :-(</div>
<p>8.3 out of 10 is still "exposed": the unit uses a handful of the protections systemd offers. Each line of the full <code>systemd-analyze security datlich</code> table names one more (<code>PrivateDevices=</code>, <code>ProtectKernelTunables=</code>, <code>RestrictAddressFamilies=</code>…). Add them one at a time, restarting and checking the health endpoint after each; Lessons 11.1 and 14.4 go further.</p>

<h3>Reading systemctl status</h3>
${slide('lx-16', 15, 'systemctl status đọc được: cgroup, RAM và trần')}
<div class="out">$ systemctl status datlich
● datlich.service - Đặt lịch phòng khám (API)
     Loaded: loaded (/etc/systemd/system/datlich.service; enabled; preset: enabled)
     Active: active (running) since Mon 2026-09-28 17:05:09 UTC; 19s ago
   Main PID: 2728 (python3)
      Tasks: 1 (limit: 9563)
     Memory: 9.8M (max: 150.0M available: 140.1M peak: 9.8M)
        CPU: 47ms
     CGroup: /system.slice/datlich.service
             └─2728 /usr/bin/python3 /opt/datlich/current/app.py

Sep 28 17:05:09 clinic-vps systemd[1]: Started datlich.service - Đặt lịch phòng khám (API).
Sep 28 17:05:09 clinic-vps python3[2728]: datlich 1.1.0 (bản mới) nghe cổng 8080, CSDL /var/lib/datlich/datlich.db
$ systemctl show datlich -p User -p Restart -p MemoryMax -p NRestarts -p WorkingDirectory
Restart=on-failure
NRestarts=0
MemoryMax=157286400
WorkingDirectory=/opt/datlich/current
User=datlich
$ ps -o user,pid,rss,cmd -C python3
USER         PID   RSS CMD
datlich     2728 20448 /usr/bin/python3 /opt/datlich/current/app.py</div>
<ul>
<li><strong>Loaded … enabled</strong> — the file systemd read, and whether it starts at boot.</li>
<li><strong>Active: active (running)</strong> since when; <code>failed</code> means it died and was not (or could no longer be) restarted.</li>
<li><strong>Memory: 9.8M (max: 150.0M …)</strong> — what the cgroup uses now, against <code>MemoryMax</code>. <code>systemctl show -p MemoryMax</code> prints the same ceiling in bytes: 150 × 1024 × 1024 = 157 286 400.</li>
<li><strong>CGroup:</strong> every process that belongs to the service — if the app ever starts helpers, they appear here and are stopped with it (Lesson 14.1).</li>
<li><strong>NRestarts</strong> counts automatic restarts; a number that keeps growing is a crash loop even when <code>Active</code> looks fine at the moment you look.</li>
<li><code>ps</code> shows RSS 20 MB while the cgroup says 9.8 MB: two different ways of counting (RSS counts shared library pages the cgroup does not charge to this service) — Lesson 5.2.</li>
</ul>

<h3>Try it step by step: from laptop to server</h3>
<p>In the practice container from Lesson 16.1, after bootstrap. On a real setup, the first four lines run on your laptop and the rest arrives over SSH.</p>
<pre><code class="language-bash">cd /root/datlich
tar -czf /tmp/datlich-1.0.0.tgz -C app .               <span class="tok-comment"># package the release</span>
scp -q /tmp/datlich-1.0.0.tgz deploy@127.0.0.1:         <span class="tok-comment"># upload to deploy's home</span>
ssh deploy@127.0.0.1 sudo /opt/datlich/ops/deploy.sh datlich-1.0.0.tgz
curl -s localhost/health                                 <span class="tok-comment"># {"status": "ok", "version": "1.0.0"}</span>
<span class="tok-comment"># a broken release: it needs a variable the server does not have</span>
rm -rf /tmp/b &amp;&amp; cp -a app /tmp/b &amp;&amp; echo 1.2.0 &gt; /tmp/b/VERSION
sed -i 's/^VERSION = /SMS_KEY = os.environ["SMS_API_KEY"]\\nVERSION = /' /tmp/b/app.py
tar -czf /tmp/datlich-1.2.0.tgz -C /tmp/b . &amp;&amp; scp -q /tmp/datlich-1.2.0.tgz deploy@127.0.0.1:
ssh deploy@127.0.0.1 sudo /opt/datlich/ops/deploy.sh datlich-1.2.0.tgz; echo "mã=$?"   <span class="tok-comment"># → rollback, mã=1</span>
ssh deploy@127.0.0.1 sudo /opt/datlich/ops/deploy.sh --list
journalctl -u datlich -g KeyError -n 2 -o cat
systemctl status datlich --no-pager -n 0</code></pre>

<h3>On macOS and WSL: what is different</h3>
<p><code>deploy.sh</code> runs on the server; from a Mac you only package and upload. Measured on the Mac:</p>
<table>
<tr><th>Thing</th><th>Mac (measured)</th><th>What to do</th></tr>
<tr><td><code>tar -czf datlich.tgz -C app .</code> then extract on Ubuntu</td><td>GNU tar on the server printed <code>tar: Ignoring unknown extended header keyword 'LIBARCHIVE.xattr.com.apple.provenance'</code> (4 lines): macOS bsdtar 3.5.3 stores extended attributes</td><td><code>tar --no-xattrs -czf …</code> — measured: clean extract. <code>COPYFILE_DISABLE=1</code>, the classic advice, did <strong>not</strong> remove these headers on macOS 27</td></tr>
<tr><td><code>head -n -1</code>, <code>mv -T</code>, <code>flock</code>, <code>stat -c</code></td><td><code>head: illegal line count -- -1</code>; <code>mv: illegal option -- T</code>; <code>flock</code> not installed; <code>stat: illegal option -- c</code></td><td>nothing — these lines run on Linux only. Do not "test" deploy.sh on the Mac</td></tr>
<tr><td><code>printf '%(%F %T)T'</code> in <code>/bin/bash</code> 3.2</td><td><code>printf: &#96;(': invalid format character</code></td><td>same: server-side only (bash 5)</td></tr>
<tr><td>WSL2</td><td>—</td><td>everything works as on Ubuntu; watch Git's <code>core.autocrlf</code> — a CRLF <code>deploy.sh</code> is incident 7 in Lesson 16.4</td></tr>
</table>

<h3>When to use this — and when to move on</h3>
<ul>
<li><strong>A bash deploy script like this</strong> is right for one server and one app you understand end to end — and it is the best way to learn what every deploy tool does underneath.</li>
<li><strong>Call it from CI</strong> (the GitHub Actions course): the pipeline builds and tests, then runs the same <code>ssh deploy@vps sudo deploy.sh …</code>. The exit codes above are what the pipeline reacts to.</li>
<li><strong>Containers</strong> (the Docker course): the release directory becomes an image tag, <code>current</code> becomes "which tag runs", and rollback becomes "run the previous tag". The ideas — immutable releases, one pointer, health check, automatic rollback — stay the same.</li>
<li><strong>Not</strong> for database migrations that cannot be undone: rolling back code does not roll back a schema. Make migrations backward-compatible, or deploy them as a separate, deliberate step.</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> tomorrow the group demos the app to the lecturer. You want proof that a bad release cannot take the demo down.</p><ol>
<li>Deploy 1.0.0 and 1.1.0 as above; check <code>--list</code> shows <code>*</code> on 1.1.0.</li>
<li>Make release 1.3.0 whose <code>/health</code> answers <code>{"status": "loi"}</code> (change the string in <code>app.py</code>); deploy it and time how long users are away from 1.1.0.</li>
<li>Run two deploys of 1.1.0 at the same time and record both exit codes.</li>
<li>Deploy 1.1.0 six more times, then count the directories in <code>releases/</code> (ignore <code>*.hong</code>).</li>
</ol><p><strong>Done when:</strong> step 2 ends with <code>mã=1</code>, <code>curl -s localhost/health</code> shows <code>1.1.0</code>, and a <code>*.hong</code> directory exists; step 3 shows one <code>0</code> and one <code>3</code>; step 4 shows exactly 5 release directories and the one marked <code>*</code> among them.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Release directory</span><span class="v">One immutable directory per deployed version, named by time.</span></div>
  <div class="kv"><span class="k">Atomic</span><span class="v">Happens completely or not at all; no in-between state is visible (<code>rename()</code>).</span></div>
  <div class="kv"><span class="k">Health check</span><span class="v">A request that proves the app really works, checked by content, not only by "something answered".</span></div>
  <div class="kv"><span class="k">Rollback</span><span class="v">Returning to the previous release; here: move the <code>current</code> arrow back and restart.</span></div>
  <div class="kv"><span class="k">Lock (<code>flock</code>)</span><span class="v">Guarantees one deploy at a time; released automatically when the process ends.</span></div>
  <div class="kv"><span class="k">Start limit</span><span class="v">systemd's brake on crash loops: after N starts in T seconds, further starts are refused.</span></div>
  <div class="kv"><span class="k">cgroup</span><span class="v">The kernel group that holds a service's processes and enforces limits like <code>MemoryMax</code>.</span></div>
  <div class="kv"><span class="k">Exit code contract</span><span class="v">A documented meaning for each exit code, so scripts and CI can react correctly.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>One directory per release, one symlink <code>current</code>; deploy and rollback are "move the arrow, restart".</li>
<li>Build in <code>mktemp -d</code> inside <code>releases/</code>, then <code>mv -T</code>; swap the arrow with <code>ln -sfn</code> + <code>mv -T</code> — atomic on every Linux, even with BusyBox.</li>
<li>Check the package before touching anything; check the health endpoint's <em>content</em> after the restart; roll back automatically and rename the bad release.</li>
<li><code>flock -n</code> on <code>exec {fd}</code> stops two deploys; exit codes 0/1/2/3/4 tell the caller what happened.</li>
<li><code>systemctl reset-failed</code> before restarting, or <code>StartLimitBurst</code> can refuse even the rollback.</li>
<li>The unit: <code>User=</code>, <code>EnvironmentFile=</code>, <code>Restart=on-failure</code>, <code>MemoryMax=</code> + <code>MemorySwapMax=0</code>, <code>ProtectSystem=strict</code>; <code>daemon-reload</code> after every edit.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/man5/systemd.service.5.html" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">systemd.service(5)</span><span class="lc-sub"><code>Type=</code>, <code>ExecStart=</code>, <code>Restart=</code> and every exit status systemd can report.</span></span>
</a>
<a class="link-card" href="https://www.freedesktop.org/software/systemd/man/latest/systemd.unit.html" target="_blank" rel="noopener">
  <span class="lc-ico">⚙️</span>
  <span class="lc-body"><span class="lc-title">systemd.unit — StartLimitBurst and friends</span><span class="lc-sub">The <code>[Unit]</code> section, ordering and the start rate limit that <code>reset-failed</code> clears.</span></span>
</a>
<a class="link-card" href="https://www.gnu.org/software/coreutils/manual/html_node/ln-invocation.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">GNU coreutils — ln invocation</span><span class="lc-sub"><code>-s</code>, <code>-f</code>, <code>-n</code> and what happens when the target is a symlink to a directory.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man1/flock.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">flock(1)</span><span class="lc-sub">Locks on a file descriptor, <code>-n</code>, <code>-w</code> and the exit codes.</span></span>
</a>
<a class="link-card" href="https://12factor.net/config" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">The Twelve-Factor App — Config</span><span class="lc-sub">Why settings and secrets live in the environment, not in the code — the idea behind <code>EnvironmentFile=</code>.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Code Lab — Linux &amp; Bash</span><span class="lc-sub">Graded exercises for the course; the script and systemd tasks are the warm-up for this lesson.</span></span>
</a>
<p class="note-ct"><strong>The habit to take away:</strong> never overwrite what is running — ship next to it, switch one arrow, and let a health check decide whether the arrow stays.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.2</span>
<h2>Script deploy mức production, và unit chạy app</h2>
<p class="lead">Deploy là lúc một máy chủ đang chạy ngon dễ ngừng chạy nhất. Bài này dựng <code>deploy.sh</code> — script người dùng <code>deploy</code> được phép chạy bằng sudo — quanh bốn lời hứa: không bắt đầu nếu đang có một lần deploy khác; không đụng vào bản đang chạy cho tới khi bản mới qua hết phép kiểm; mỗi phiên bản nằm trong thư mục riêng nên quay lại chỉ là đổi một mũi tên; và nếu bản mới không khoẻ trong mười giây thì nó <em>tự</em> quay lại. Rồi bài dựng unit systemd biến <code>app.py</code> thành một dịch vụ có người dùng riêng, có trần bộ nhớ và tự khởi động lại.</p>

<h3>Vì sao phải là script, và vì sao có hình dạng này</h3>
<p>"Deploy" đầu tiên của nhóm là <code>scp app.py vps:/opt/app/ &amp;&amp; ssh vps 'sudo systemctl restart app'</code>. Nó chạy — cho tới cái ngày <code>app.py</code> mới chết ngay lúc khởi động. Khi đó file cũ đã bị ghi đè, dịch vụ đã chết, và bản sửa được gõ trong hoảng loạn. Mỗi lựa chọn thiết kế dưới đây tồn tại vì một kiểu hỏng: hai người cùng deploy (một cái khoá), tải lên mới được một nửa (dựng bản phát hành trong thư mục tạm, chuyển vào chỗ bằng một bước), một bản hỏng (health check + tự quay lui), và câu hỏi "rốt cuộc đang chạy bản nào?" (mỗi bản một thư mục, một symlink tên <code>current</code>).</p>

<h3>Bộ giáp: chế độ nghiêm ngặt, bẫy, khoá, và mã thoát có nghĩa</h3>
${slide('lx-16', 9, 'deploy.sh: bộ giáp set -Eeuo, trap, flock')}
<p>Script hoàn chỉnh, 103 dòng, ShellCheck sạch:</p>
<pre><code class="language-bash">#!/usr/bin/env bash
<span class="tok-comment"># deploy.sh — đưa một bản app "datlich" lên máy chủ, tự quay lui nếu bản mới không khoẻ.</span>
<span class="tok-comment"># Cách dùng: sudo deploy.sh GÓI.tar.gz | THƯ_MỤC   triển khai bản mới</span>
<span class="tok-comment">#            sudo deploy.sh --rollback              quay về bản liền trước</span>
<span class="tok-comment">#            sudo deploy.sh --list                  liệt kê các bản, * = đang chạy</span>
set -Eeuo pipefail
shopt -s inherit_errexit

readonly APP=datlich GOC=/opt/datlich REL=/opt/datlich/releases
readonly LOG=/var/log/datlich/deploy.log GIU=5
readonly HEALTH=http://127.0.0.1:8080/health

log()  { printf '%(%F %T)T %-5s %s\\n' -1 "$1" "\${*:2}" | tee -a "$LOG" &gt;&amp;2; }
info() { log INFO "$@"; }
warn() { log WARN "$@"; }
die()  { log ERROR "$1"; exit "\${2:-1}"; }
usage() { sed -n '3,5s/^# \\{0,1\\}//p' "$0"; }

TAM=''
don_dep() { if [[ -n $TAM &amp;&amp; -d $TAM ]]; then rm -rf -- "$TAM"; fi; }
trap don_dep EXIT
trap 'log ERROR "lệnh hỏng ở dòng $LINENO: $BASH_COMMAND"' ERR

hien_tai()    { if [[ -L $GOC/current ]]; then readlink -f "$GOC/current"; fi; }
cac_ban()     { find "$REL" -mindepth 1 -maxdepth 1 -type d -name '20??????-??????' | sort; }
doi_symlink() { ln -sfn "$1" "$GOC/.current.moi"; mv -T "$GOC/.current.moi" "$GOC/current"; }
khoi_dong_lai() {                      <span class="tok-comment"># reset-failed: xoá bộ đếm StartLimitBurst của lần hỏng trước</span>
  systemctl reset-failed "$APP" 2&gt;/dev/null || true
  systemctl restart "$APP"
}
kiem_suc_khoe() {
  for _ in {1..10}; do
    [[ $(curl -fsS -m 2 "$HEALTH" 2&gt;/dev/null) == *'"status": "ok"'* ]] &amp;&amp; return 0
    sleep 1
  done
  return 1
}

trien_khai() {
  local nguon=$1 cu moi
  [[ -e $nguon ]] || die "không có: $nguon" 2
  cu=$(hien_tai)
  moi=$REL/$(date +%Y%m%d-%H%M%S)
  [[ ! -e $moi ]] || die "$moi đã tồn tại" 2
  TAM=$(mktemp -d "$REL/.tam.XXXXXX")
  if [[ -d $nguon ]]; then cp -a "$nguon/." "$TAM/"; else tar -xzf "$nguon" -C "$TAM"; fi
  [[ -f $TAM/app.py &amp;&amp; -f $TAM/VERSION ]] || die "gói thiếu app.py hoặc VERSION" 2
  python3 -c 'import ast, sys; ast.parse(open(sys.argv[1]).read())' "$TAM/app.py" \\
    || die "app.py sai cú pháp — không đụng vào bản đang chạy" 2
  chown -R root:root "$TAM"; chmod -R u=rwX,go=rX "$TAM"
  mv -T "$TAM" "$moi"; TAM=''
  local ten_cu=\${cu##*/}
  info "bản $(&lt;"$moi/VERSION") → \${moi##*/} (đang chạy: \${ten_cu:-chưa có})"
  doi_symlink "$moi"
  khoi_dong_lai
  if kiem_suc_khoe; then
    info "health OK — đang chạy $(&lt;"$moi/VERSION")"
  else
    warn "health check hỏng sau 10 lần thử — QUAY LUI"
    [[ -n $cu ]] || die "không có bản cũ để quay về" 4
    doi_symlink "$cu"; khoi_dong_lai
    kiem_suc_khoe || die "quay lui xong mà vẫn không khoẻ — gọi người!" 4
    mv -T "$moi" "$moi.hong"
    die "deploy thất bại, đã về \${cu##*/}. Xem: journalctl -u $APP -n 30" 1
  fi
  local xoa
  xoa=$(cac_ban | grep -vxF "$(hien_tai)" | head -n -$((GIU - 1)) || true)
  if [[ -n $xoa ]]; then
    info "dọn $(wc -l &lt;&lt;&lt;"$xoa") bản cũ (giữ $GIU)"
    xargs -r rm -rf -- &lt;&lt;&lt;"$xoa"
  fi
}

quay_lui() {
  local cu truoc
  cu=$(hien_tai)
  truoc=$(cac_ban | grep -B1 -xF "$cu" | head -n 1 || true)
  [[ -n $truoc &amp;&amp; $truoc != "$cu" ]] || die "không có bản nào trước \${cu##*/}" 2
  doi_symlink "$truoc"; khoi_dong_lai
  kiem_suc_khoe || die "bản \${truoc##*/} cũng không khoẻ" 4
  info "đã quay lui \${cu##*/} → \${truoc##*/} ($(&lt;"$truoc/VERSION"))"
}

liet_ke() {
  local b cu; cu=$(hien_tai)
  while IFS= read -r b; do
    printf '%s %s  %s\\n' "$([[ $b == "$cu" ]] &amp;&amp; echo '*' || echo ' ')" "\${b##*/}" "$(&lt;"$b/VERSION")"
  done &lt; &lt;(cac_ban)
}

(( EUID == 0 )) || { echo "cần chạy bằng sudo" &gt;&amp;2; exit 2; }
case \${1:-} in
  --list)     liet_ke; exit 0 ;;
  -h|--help)  usage; exit 0 ;;
  '')         usage &gt;&amp;2; exit 2 ;;
esac
exec {KHOA}&gt;"/run/lock/$APP-deploy.lock"
flock -n "$KHOA" || die "đang có một deploy khác chạy — thử lại sau" 3
case $1 in
  --rollback) quay_lui ;;
  -*)         die "cờ lạ: $1 (xem --help)" 2 ;;
  *)          trien_khai "$1" ;;
esac</code></pre>
<p>Mỗi lớp mua được gì, và bạn đã học nó ở đâu:</p>
<ul>
<li><strong><code>set -Eeuo pipefail</code> + <code>inherit_errexit</code></strong> (Bài 7.1, 13.4): lệnh nào hỏng cũng dừng script, kể cả trong hàm và trong <code>$( )</code>; biến chưa đặt là lỗi chứ không phải chuỗi rỗng.</li>
<li><strong>Hai cái bẫy</strong> (Bài 7.3): <code>EXIT</code> xoá bản phát hành dựng dở trong thư mục tạm dù chuyện gì xảy ra; <code>ERR</code> nói tên dòng và lệnh.</li>
<li><strong>Log có mức</strong> (Bài 13.4) ra stderr <em>và</em> vào <code>/var/log/datlich/deploy.log</code> — để một lần deploy từ CI cũng để lại lịch sử trên máy chủ.</li>
<li><strong><code>exec {KHOA}&gt;…; flock -n "$KHOA"</code></strong> (Bài 7.3, 13.2): bash tự chọn một số fd trống, <code>flock -n</code> lấy được khoá hoặc bỏ cuộc ngay. Khoá tự mất khi tiến trình chết, kể cả <code>kill -9</code> — không có file khoá cũ nào phải dọn.</li>
<li><strong>Kiểm trước khi đụng vào bất cứ gì</strong>: gói có tồn tại, có <code>app.py</code> và <code>VERSION</code>, và <code>app.py</code> đọc được (<code>ast.parse</code> phân tích mã Python mà không chạy nó).</li>
<li><strong>Mã thoát có nghĩa</strong>, để bên gọi — một người, cron hay GitHub Actions — phản ứng đúng:</li>
</ul>
<table>
<tr><th>Mã</th><th>Nghĩa</th><th>Bên gọi nên làm gì</th></tr>
<tr><td>0</td><td>bản mới khoẻ và đang chạy (hoặc <code>--help</code>/<code>--list</code>)</td><td>không gì cả</td></tr>
<tr><td>1</td><td>health check hỏng, <strong>ĐÃ quay lui</strong>; người dùng đang được bản cũ phục vụ</td><td>báo nhóm, đọc journal</td></tr>
<tr><td>2</td><td>gọi sai, hoặc gói hỏng — chưa đụng vào gì</td><td>sửa lời gọi hoặc sửa gói</td></tr>
<tr><td>3</td><td>có một deploy khác đang giữ khoá</td><td>thử lại sau một phút</td></tr>
<tr><td>4</td><td>quay lui cũng hỏng</td><td>đánh thức người trực</td></tr>
</table>
<div class="out">$ sudo deploy.sh --help; echo "mã=$?"
Cách dùng: sudo deploy.sh GÓI.tar.gz | THƯ_MỤC   triển khai bản mới
           sudo deploy.sh --rollback              quay về bản liền trước
           sudo deploy.sh --list                  liệt kê các bản, * = đang chạy
mã=0
$ sudo deploy.sh --xoa; echo "mã=$?"
2026-09-28 17:35:32 ERROR cờ lạ: --xoa (xem --help)
mã=2
$ sudo deploy.sh /khong/co.tgz; echo "mã=$?"
2026-09-28 17:35:32 ERROR không có: /khong/co.tgz
mã=2
$ deploy.sh --list; echo "mã=$?"          # không có sudo
cần chạy bằng sudo
mã=2</div>

<h3>Mỗi bản một thư mục; "current" chỉ là một mũi tên</h3>
${slide('lx-16', 10, 'Mỗi bản một thư mục; current chỉ là mũi tên')}
<p>Mỗi lần deploy tạo <code>/opt/datlich/releases/YYYYmmdd-HHMMSS</code> — tên <em>chính là</em> thời gian, nên sắp theo tên là sắp theo tuổi. File unit chạy <code>/opt/datlich/current/app.py</code>, và <code>current</code> là một liên kết mềm (symlink, Bài 2.4) trỏ vào một trong các thư mục đó. Deploy là "trỏ mũi tên sang thư mục mới rồi khởi động lại"; quay lui là "trỏ về thư mục cũ rồi khởi động lại". Không có gì bị chép đè lên mã đang chạy, nên một lần tải lên hỏng không bao giờ để lại một <code>app.py</code> ghi dở.</p>
<div class="out">$ ls -l /opt/datlich
lrwxrwxrwx 1 root root   37 Sep 28 17:05 current -&gt; /opt/datlich/releases/20260928-170509
drwxr-xr-x 2 root root 4096 Sep 28 17:03 ops
drwxr-xr-x 8 root root 4096 Sep 28 17:05 releases
$ ls /opt/datlich/releases
20260928-170424  20260928-170427.hong  20260928-170452  20260928-170504  20260928-170506  20260928-170509</div>
<p>Hai bước trong script phải là <strong>nguyên tử</strong> (atomic) — xảy ra trọn vẹn hoặc không xảy ra, không có trạng thái lưng chừng nào để tiến trình khác nhìn thấy. Cả hai đều dùng <code>rename()</code>, thứ nhân bảo đảm là nguyên tử trên cùng một hệ thống file:</p>
<ol>
<li>Bản mới được giải nén vào <code>releases/.tam.XXXXXX</code> — do <code>mktemp -d</code> tạo NGAY TRONG <code>releases/</code>, tức cùng ổ đĩa — rồi <code>mv -T</code> đổi sang tên thật. Vì thế một thư mục mang tên <code>2026…</code> luôn là thư mục đầy đủ.</li>
<li>Mũi tên được thay bằng cách tạo liên kết mới cạnh cái cũ rồi đổi tên đè lên: <code>ln -sfn MỚI .current.moi; mv -T .current.moi current</code>. <code>-T</code> ("không coi đích là thư mục") bắt <code>mv</code> thay chính cái link <code>current</code>, thay vì chuyển link mới VÀO thư mục mà <code>current</code> đang trỏ tới.</li>
</ol>
<p>Thế <code>ln -sfn MỚI current</code> trơn không nguyên tử sao? Chúng tôi soi nó bằng <code>strace</code> trên ba hệ thống:</p>
<div class="out"># Ubuntu 24.04 — GNU coreutils 9.4
symlinkat("r2", AT_FDCWD, "cur")        = -1 EEXIST (File exists)
symlinkat("r2", AT_FDCWD, "CuU8aHWH")   = 0
renameat(AT_FDCWD, "CuU8aHWH", AT_FDCWD, "cur") = 0
# Debian 12 — GNU coreutils 9.1: đúng ba lời gọi đó
# Alpine — BusyBox v1.37.0
unlinkat(AT_FDCWD, "cur", 0)            = 0
symlinkat("r2", AT_FDCWD, "cur")        = 0</div>
<p><code>ln</code> của GNU đời mới đã tự tạo một link tạm rồi đổi tên — nguyên tử. BusyBox, cái <code>ln</code> nằm trong các container dựng từ Alpine, xoá <code>current</code> trước rồi mới tạo lại: giữa hai lời gọi đó không hề có <code>current</code>, và một yêu cầu tới đúng khoảnh khắc ấy sẽ hỏng. Tự viết bước đổi tên bằng <code>mv -T</code> thì đúng trên mọi Linux, dù nó có <code>ln</code> nào. (Trên Mac không có <code>mv -T</code> — đo: <code>mv: illegal option -- T</code>; không sao, vì script này chạy trên máy chủ.)</p>
<div class="callout info"><p><strong>systemd đi theo symlink lúc dịch vụ KHỞI ĐỘNG.</strong> <code>WorkingDirectory=/opt/datlich/current</code> và đường dẫn trong <code>ExecStart=</code> được lần theo một lần, lúc start. Đo trên app đang chạy: <code>ls -l /proc/4422/cwd</code> → <code>/opt/datlich/releases/20260928-170509</code> — thư mục thật, không phải cái link. Nên đổi mũi tên mà không khởi động lại thì tiến trình đang chạy chẳng thấy gì khác (Bài 12.4 gặp đúng chuyện này: "đổi <code>current</code> từ hai mươi phút trước mà người dùng vẫn thấy hành vi cũ"). Vì thế trong script, đổi mũi tên và khởi động lại là một bước.</p></div>

<h3>Health check quyết định: giữ bản mới hay quay lui</h3>
${slide('lx-16', 11, 'Health check quyết định: giữ bản mới hay quay lui')}
<p>Sau khi khởi động lại, script hỏi chính app: tối đa mười lần, cách nhau một giây, <code>curl -fsS -m 2 http://127.0.0.1:8080/health</code>, và chỉ chấp nhận câu trả lời có chứa <code>"status": "ok"</code>. Kiểm <em>nội dung</em> là quan trọng: ở sự cố 4 của Bài 16.4, một server thử nghiệm bị bỏ quên giữ cổng và trả lời mọi yêu cầu bằng một trang lỗi HTML — một phép kiểm chỉ hỏi "có gì trả lời không?" sẽ coi thế là khoẻ. Đây là một chuỗi thật: hai bản tốt, rồi bản 1.2.0 có mã đọc biến môi trường <code>SMS_API_KEY</code> mà không ai thêm vào <code>/etc/datlich/datlich.env</code> — cách phổ biến nhất để một bản chạy ngon trên laptop chết trên máy chủ.</p>
<div class="out">$ ssh deploy@vps sudo deploy.sh datlich-1.0.0.tgz
2026-09-28 17:04:22 INFO  bản 1.0.0 → 20260928-170422 (đang chạy: chưa có)
2026-09-28 17:04:23 INFO  health OK — đang chạy 1.0.0
mã=0
$ ssh deploy@vps sudo deploy.sh datlich-1.1.0.tgz
2026-09-28 17:04:24 INFO  bản 1.1.0 → 20260928-170424 (đang chạy: 20260928-170422)
2026-09-28 17:04:25 INFO  health OK — đang chạy 1.1.0
mã=0
$ ssh deploy@vps sudo deploy.sh datlich-1.2.0.tgz
2026-09-28 17:04:27 INFO  bản 1.2.0 → 20260928-170427 (đang chạy: 20260928-170424)
2026-09-28 17:04:37 WARN  health check hỏng sau 10 lần thử — QUAY LUI
2026-09-28 17:04:38 ERROR deploy thất bại, đã về 20260928-170424. Xem: journalctl -u datlich -n 30
mã=1
$ curl -s localhost/health
{"status": "ok", "version": "1.1.0"}</div>
<p>Mười một giây sau khi 1.2.0 được bật, người dùng đã quay lại 1.1.0, còn bản hỏng bị đổi tên thành <code>20260928-170427.hong</code> để không ai lỡ tay "tiến" vào nó. Journal nói đúng vì sao nó chết (Bài 16.3 chỉ cách tìm những dòng như thế):</p>
<div class="out">$ journalctl -u datlich -o short-iso -g KeyError
2026-09-28T17:04:27+00:00 clinic-vps python3[2304]: KeyError: 'SMS_API_KEY'
2026-09-28T17:04:29+00:00 clinic-vps python3[2317]: KeyError: 'SMS_API_KEY'
…</div>
<p>Cách sửa 1.2.0 không nằm trong mã: thêm biến đó vào file <code>.env</code> trên máy chủ (và vào một danh sách kiểm, Bài 8.3), rồi deploy lại đúng gói đó.</p>

<h3>Liệt kê, quay lui tay, gói hỏng và hai người deploy cùng lúc</h3>
${slide('lx-16', 12, 'Liệt kê, quay lui tay, và hai người deploy cùng lúc')}
<p>Một gói sai cú pháp không bao giờ tới gần app đang chạy — phép kiểm <code>ast.parse</code> hỏng ngay khi gói còn trong thư mục tạm, và bẫy EXIT xoá thư mục đó:</p>
<div class="out">$ ssh deploy@vps sudo deploy.sh datlich-1.2.1.tgz
Traceback (most recent call last):
  File "&lt;string&gt;", line 1, in &lt;module&gt;
  File "/usr/lib/python3.12/ast.py", line 52, in parse
    return compile(source, filename, mode, flags,
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "&lt;unknown&gt;", line 64
    def hong(:
             ^
SyntaxError: invalid syntax
2026-09-28 17:04:39 ERROR app.py sai cú pháp — không đụng vào bản đang chạy
mã=2
$ ls -a /opt/datlich/releases
.  ..  20260928-170422  20260928-170424  20260928-170427.hong</div>
<p>Không còn thư mục <code>.tam.*</code> nào nằm lại. Hai bạn cùng deploy đúng một lúc — người thứ hai bị cái khoá mời về, kèm lời nhắn thử lại sau và mã thoát 3:</p>
<div class="out">$ deploy.sh datlich-1.1.0.tgz &amp; deploy.sh datlich-1.1.0.tgz; wait
2026-09-28 17:04:52 INFO  bản 1.1.0 → 20260928-170452 (đang chạy: 20260928-170424)
2026-09-28 17:04:52 ERROR đang có một deploy khác chạy — thử lại sau
mã bản thứ hai=3
2026-09-28 17:04:53 INFO  health OK — đang chạy 1.1.0</div>
<p>Quay lui tay đi về bản liền trước bản đang chạy (<code>grep -B1</code> in dòng đứng trước dòng khớp — Bài 3.3); <code>--list</code> đánh dấu bản đang chạy bằng <code>*</code>:</p>
<div class="out">$ sudo deploy.sh --rollback
2026-09-28 17:04:55 INFO  đã quay lui 20260928-170452 → 20260928-170424 (1.1.0)
$ sudo deploy.sh --list
  20260928-170422  1.0.0
* 20260928-170424  1.1.0
  20260928-170452  1.1.0</div>
<p>Và các bản cũ được dọn tự động, giữ năm bản (bản đang chạy không bao giờ bị xoá, kể cả sau khi quay lui, vì nó bị lọc ra bằng <code>grep -vxF "$(hien_tai)"</code> trước khi <code>head -n -4</code> chọn những bản cần xoá):</p>
<div class="out">2026-09-28 17:05:09 INFO  bản 1.1.0 → 20260928-170509 (đang chạy: 20260928-170506)
2026-09-28 17:05:10 INFO  dọn 1 bản cũ (giữ 5)
$ sudo deploy.sh --list
  20260928-170424  1.1.0
  20260928-170452  1.1.0
  20260928-170504  1.1.0
  20260928-170506  1.1.0
* 20260928-170509  1.1.0</div>

<h3>Lần chạy thật đầu tiên đã hỏng ở đâu</h3>
${slide('lx-16', 13, 'Lần chạy thật đầu tiên: StartLimitBurst khoá luôn cả quay lui')}
<p>Script ở trên là phiên bản thứ ba. Bản đầu có hai lỗi mà chỉ chạy thật mới lộ ra — cả hai đều đáng học.</p>
<p><strong>Lỗi 1 — chính lần quay lui bị từ chối.</strong> Trong vòng một phút, lần thử thật đầu tiên đã khởi động dịch vụ bốn lần qua các lần deploy — một lần deploy đầu tiên, rồi 1.0.0, 1.1.0 và bản hỏng 1.2.0. Health check hỏng, script trỏ mũi tên về — rồi:</p>
<div class="out">2026-09-28 17:03:44 WARN  health check hỏng sau 10 lần thử — QUAY LUI
Job for datlich.service failed because the control process exited with error code.
See "systemctl status datlich.service" and "journalctl -xeu datlich.service" for details.
2026-09-28 17:03:44 ERROR lệnh hỏng ở dòng 57: systemctl restart "$APP"
mã=1
$ journalctl -u datlich -o short --since 17:03:36 --until 17:03:45 | cut -c17-
clinic-vps systemd[1]: datlich.service: Scheduled restart job, restart counter is at 1.
clinic-vps systemd[1]: Started datlich.service - Đặt lịch phòng khám (API).
…
clinic-vps systemd[1]: datlich.service: Scheduled restart job, restart counter is at 2.
clinic-vps systemd[1]: datlich.service: Start request repeated too quickly.
clinic-vps systemd[1]: datlich.service: Failed with result 'exit-code'.
clinic-vps systemd[1]: Failed to start datlich.service - Đặt lịch phòng khám (API).
clinic-vps systemd[1]: datlich.service: Start request repeated too quickly.
clinic-vps systemd[1]: datlich.service: Failed with result 'exit-code'.
clinic-vps systemd[1]: Failed to start datlich.service - Đặt lịch phòng khám (API).</div>
<p>Unit ghi <code>StartLimitBurst=5</code> trong <code>StartLimitIntervalSec=60</code> (Bài 11.1): hơn năm lần start trong một phút là systemd từ chối khởi động unit luôn. Đếm các lần start trong journal: bốn lần do deploy trong phút vừa qua, cộng một lần tự khởi động lại của bản 1.2.0 đang chết — năm. Lần thứ sáu, lần <code>Restart=</code> của vòng lặp chết, bị từ chối, và lần <code>systemctl restart</code> của bước quay lui cũng vậy. Web chết dù bản cũ nằm trên đĩa hoàn toàn tốt. Cách sửa là hàm <code>khoi_dong_lai()</code>: <code>systemctl reset-failed datlich</code> trước mỗi lần script khởi động lại, để xoá trạng thái failed cùng bộ đếm. Với nó, cũng bản 1.2.0 hỏng đó quay lui xong trong mười một giây (lần chạy ở phần trên).</p>
<div class="pitfall co-tieu-de"><strong><code>readlink -f</code> vẫn trả lời cho một đường dẫn không tồn tại.</strong> <code>hien_tai()</code> đầu tiên là <code>readlink -f "$GOC/current" 2&gt;/dev/null || true</code>, và lần deploy đầu tiên ghi log <code>(đang chạy: current)</code> — trên một máy chủ chưa từng deploy gì. Đo thật: <code>readlink -f /opt/datlich/khong-co; echo "mã=$?"</code> in <code>/opt/datlich/khong-co</code> và <code>mã=0</code>: <code>readlink -f</code> của GNU thành công miễn là mọi thành phần trừ cái cuối tồn tại; chỉ <code>readlink -f /khong/co/gi</code> mới hỏng với mã 1. Một lần quay lui khi đó sẽ cố "về" một bản tên là <code>current</code>. Cách sửa hỏi đúng câu trước: <code>[[ -L $GOC/current ]]</code> — "có symlink không?" — rồi mới lần theo nó.</div>

<h3>Unit chạy app</h3>
${slide('lx-16', 14, 'Unit của app: User=, Restart=, MemoryMax=, EnvironmentFile=')}
<pre><code class="language-ini">[Unit]
Description=Đặt lịch phòng khám (API)
After=network-online.target
Wants=network-online.target
StartLimitIntervalSec=60
StartLimitBurst=5

[Service]
Type=simple
User=datlich
Group=datlich
EnvironmentFile=/etc/datlich/datlich.env
WorkingDirectory=/opt/datlich/current
ExecStart=/usr/bin/python3 /opt/datlich/current/app.py
Restart=on-failure
RestartSec=2
MemoryMax=150M
MemorySwapMax=0
NoNewPrivileges=yes
ProtectSystem=strict
ProtectHome=yes
PrivateTmp=yes
ReadWritePaths=/var/lib/datlich /var/log/datlich

[Install]
WantedBy=multi-user.target</code></pre>
<table>
<tr><th>Chỉ thị</th><th>Nghĩa</th><th>Vì sao ở đây</th></tr>
<tr><td><code>After=</code> / <code>Wants=network-online.target</code></td><td>xếp sau, và kéo theo, "mạng đã lên"</td><td>app không nên khởi động trước khi nghe được</td></tr>
<tr><td><code>StartLimitIntervalSec=</code>, <code>StartLimitBurst=</code></td><td>tối đa N lần start trong T giây, rồi từ chối (nằm ở <code>[Unit]</code>)</td><td>chặn vòng lặp chết quay mãi; <code>reset-failed</code> xoá bộ đếm</td></tr>
<tr><td><code>Type=simple</code></td><td>tiến trình do <code>ExecStart</code> khởi động chính là dịch vụ</td><td>app không tự chạy nền</td></tr>
<tr><td><code>User=</code>, <code>Group=</code></td><td>chạy dưới tài khoản này</td><td>không phải root (Bài 16.1)</td></tr>
<tr><td><code>EnvironmentFile=</code></td><td>đọc các dòng <code>KHOÁ=giá_trị</code> vào môi trường</td><td>cấu hình và bí mật nằm ngoài mã</td></tr>
<tr><td><code>WorkingDirectory=</code></td><td>thư mục tiến trình bắt đầu ở đó</td><td>lần theo lúc start: <code>current</code> mới cần khởi động lại</td></tr>
<tr><td><code>ExecStart=</code></td><td>lệnh chạy, đường dẫn tuyệt đối</td><td>không tìm theo <code>PATH</code>, không qua shell</td></tr>
<tr><td><code>Restart=on-failure</code>, <code>RestartSec=2</code></td><td>khởi động lại sau khi chết, bị tín hiệu hay quá giờ, sau 2 giây — không sau một lần dừng sạch</td><td>3 giờ sáng sập thì tự lành</td></tr>
<tr><td><code>MemoryMax=150M</code></td><td>trần bộ nhớ cứng của cgroup của unit</td><td>một yêu cầu tồi không ăn hết RAM của máy</td></tr>
<tr><td><code>MemorySwapMax=0</code></td><td>unit này không được dùng swap</td><td>thiếu nó, trần "rò" ra swap — sự cố 3, Bài 16.4</td></tr>
<tr><td><code>NoNewPrivileges=yes</code></td><td>tiến trình và con của nó không bao giờ tăng quyền được (không setuid)</td><td>thêm một lớp phòng thủ, gần như miễn phí</td></tr>
<tr><td><code>ProtectSystem=strict</code> + <code>ReadWritePaths=</code></td><td>cả hệ thống file chỉ đọc với dịch vụ, trừ các đường dẫn liệt kê</td><td>app chỉ ghi được đúng chỗ của nó</td></tr>
<tr><td><code>ProtectHome=yes</code>, <code>PrivateTmp=yes</code></td><td>giấu <code>/home</code>; cho dịch vụ một <code>/tmp</code> riêng</td><td>không nhòm file người dùng, không dùng chung <code>/tmp</code></td></tr>
<tr><td><code>WantedBy=multi-user.target</code></td><td>chỗ <code>systemctl enable</code> móc nó vào</td><td>tự chạy khi máy khởi động</td></tr>
</table>
<div class="pitfall co-tieu-de"><strong><code>EnvironmentFile=</code> không phải script shell.</strong> systemd đọc mỗi dòng như <code>KHOÁ=giá_trị</code>. Không <code>export</code>, không <code>$(lệnh)</code>, không khai triển biến từ dòng khác; dấu nháy bị bỏ đi nhưng không được hiểu như bash. Một <code>.env</code> viết để <code>source .env</code> trong bash vì thế có thể mang nghĩa khác với systemd (Bài 8.3 đã đo sự khác nhau). Giữ nó chỉ gồm các dòng <code>KHOÁ=giá_trị</code> trơn, quyền 640, chủ root và nhóm của app.</div>
<p>Sửa file unit xong thì <code>systemctl daemon-reload</code> là bắt buộc — script bootstrap tự làm việc này, nhưng nếu bạn sửa tay rồi quên, <code>systemctl restart</code> chạy cấu hình <em>cũ</em> và chỉ in một dòng dễ bỏ qua (sự cố 8 ở Bài 16.4 cho thấy nó). Muốn biết unit thật sự được rào chắn tới đâu, hỏi systemd:</p>
<div class="out">$ systemd-analyze security datlich | tail -1
→ Overall exposure level for datlich.service: 8.3 EXPOSED :-(</div>
<p>8,3 trên 10 vẫn là "lộ": unit mới dùng một nhúm trong các lớp bảo vệ systemd có. Mỗi dòng trong bảng đầy đủ của <code>systemd-analyze security datlich</code> gọi tên thêm một lớp (<code>PrivateDevices=</code>, <code>ProtectKernelTunables=</code>, <code>RestrictAddressFamilies=</code>…). Thêm từng cái một, sau mỗi lần thì khởi động lại và kiểm health; Bài 11.1 và 14.4 đi xa hơn.</p>

<h3>Đọc systemctl status</h3>
${slide('lx-16', 15, 'systemctl status đọc được: cgroup, RAM và trần')}
<div class="out">$ systemctl status datlich
● datlich.service - Đặt lịch phòng khám (API)
     Loaded: loaded (/etc/systemd/system/datlich.service; enabled; preset: enabled)
     Active: active (running) since Mon 2026-09-28 17:05:09 UTC; 19s ago
   Main PID: 2728 (python3)
      Tasks: 1 (limit: 9563)
     Memory: 9.8M (max: 150.0M available: 140.1M peak: 9.8M)
        CPU: 47ms
     CGroup: /system.slice/datlich.service
             └─2728 /usr/bin/python3 /opt/datlich/current/app.py

Sep 28 17:05:09 clinic-vps systemd[1]: Started datlich.service - Đặt lịch phòng khám (API).
Sep 28 17:05:09 clinic-vps python3[2728]: datlich 1.1.0 (bản mới) nghe cổng 8080, CSDL /var/lib/datlich/datlich.db
$ systemctl show datlich -p User -p Restart -p MemoryMax -p NRestarts -p WorkingDirectory
Restart=on-failure
NRestarts=0
MemoryMax=157286400
WorkingDirectory=/opt/datlich/current
User=datlich
$ ps -o user,pid,rss,cmd -C python3
USER         PID   RSS CMD
datlich     2728 20448 /usr/bin/python3 /opt/datlich/current/app.py</div>
<ul>
<li><strong>Loaded … enabled</strong> — file systemd đã đọc, và có tự chạy khi khởi động máy hay không.</li>
<li><strong>Active: active (running)</strong> từ lúc nào; <code>failed</code> nghĩa là nó đã chết và không được (hoặc không còn được phép) khởi động lại.</li>
<li><strong>Memory: 9.8M (max: 150.0M …)</strong> — cgroup đang dùng bao nhiêu, so với <code>MemoryMax</code>. <code>systemctl show -p MemoryMax</code> in cùng cái trần đó theo byte: 150 × 1024 × 1024 = 157 286 400.</li>
<li><strong>CGroup:</strong> mọi tiến trình thuộc dịch vụ — nếu app sinh tiến trình phụ, chúng hiện ở đây và bị dừng cùng nó (Bài 14.1).</li>
<li><strong>NRestarts</strong> đếm số lần tự khởi động lại; một con số cứ tăng mãi là vòng lặp chết, dù <code>Active</code> trông ổn đúng lúc bạn nhìn.</li>
<li><code>ps</code> cho RSS 20 MB trong khi cgroup nói 9,8 MB: hai cách đếm khác nhau (RSS tính cả các trang thư viện dùng chung mà cgroup không tính cho dịch vụ này) — Bài 5.2.</li>
</ul>

<h3>Chạy thử từng bước: từ laptop tới máy chủ</h3>
<p>Trong container tập luyện của Bài 16.1, sau khi đã bootstrap. Ở thiết lập thật, bốn dòng đầu chạy trên laptop, phần còn lại tới máy chủ qua SSH.</p>
<pre><code class="language-bash">cd /root/datlich
tar -czf /tmp/datlich-1.0.0.tgz -C app .               <span class="tok-comment"># đóng gói bản phát hành</span>
scp -q /tmp/datlich-1.0.0.tgz deploy@127.0.0.1:         <span class="tok-comment"># tải lên thư mục nhà của deploy</span>
ssh deploy@127.0.0.1 sudo /opt/datlich/ops/deploy.sh datlich-1.0.0.tgz
curl -s localhost/health                                 <span class="tok-comment"># {"status": "ok", "version": "1.0.0"}</span>
<span class="tok-comment"># một bản hỏng: nó cần một biến mà máy chủ không có</span>
rm -rf /tmp/b &amp;&amp; cp -a app /tmp/b &amp;&amp; echo 1.2.0 &gt; /tmp/b/VERSION
sed -i 's/^VERSION = /SMS_KEY = os.environ["SMS_API_KEY"]\\nVERSION = /' /tmp/b/app.py
tar -czf /tmp/datlich-1.2.0.tgz -C /tmp/b . &amp;&amp; scp -q /tmp/datlich-1.2.0.tgz deploy@127.0.0.1:
ssh deploy@127.0.0.1 sudo /opt/datlich/ops/deploy.sh datlich-1.2.0.tgz; echo "mã=$?"   <span class="tok-comment"># → quay lui, mã=1</span>
ssh deploy@127.0.0.1 sudo /opt/datlich/ops/deploy.sh --list
journalctl -u datlich -g KeyError -n 2 -o cat
systemctl status datlich --no-pager -n 0</code></pre>

<h3>Trên macOS và WSL khác gì</h3>
<p><code>deploy.sh</code> chạy trên máy chủ; từ Mac bạn chỉ đóng gói và tải lên. Đo trên Mac:</p>
<table>
<tr><th>Thứ</th><th>Mac (đo thật)</th><th>Làm gì</th></tr>
<tr><td><code>tar -czf datlich.tgz -C app .</code> rồi giải nén trên Ubuntu</td><td>GNU tar trên máy chủ in <code>tar: Ignoring unknown extended header keyword 'LIBARCHIVE.xattr.com.apple.provenance'</code> (4 dòng): bsdtar 3.5.3 của macOS ghi cả thuộc tính mở rộng</td><td><code>tar --no-xattrs -czf …</code> — đo: giải nén sạch. <code>COPYFILE_DISABLE=1</code>, lời khuyên kinh điển, <strong>không</strong> bỏ được các header này trên macOS 27</td></tr>
<tr><td><code>head -n -1</code>, <code>mv -T</code>, <code>flock</code>, <code>stat -c</code></td><td><code>head: illegal line count -- -1</code>; <code>mv: illegal option -- T</code>; không có <code>flock</code>; <code>stat: illegal option -- c</code></td><td>không cần làm gì — mấy dòng này chỉ chạy trên Linux. Đừng "thử" deploy.sh trên Mac</td></tr>
<tr><td><code>printf '%(%F %T)T'</code> trong <code>/bin/bash</code> 3.2</td><td><code>printf: &#96;(': invalid format character</code></td><td>như trên: chỉ chạy phía máy chủ (bash 5)</td></tr>
<tr><td>WSL2</td><td>—</td><td>mọi thứ chạy như Ubuntu; coi chừng <code>core.autocrlf</code> của Git — một <code>deploy.sh</code> dính CRLF là sự cố 7 của Bài 16.4</td></tr>
</table>

<h3>Khi nào dùng cách này — và khi nào nên đi tiếp</h3>
<ul>
<li><strong>Một script deploy bash như thế này</strong> vừa khít cho một máy chủ và một app bạn hiểu từ đầu tới cuối — và là cách tốt nhất để hiểu mọi công cụ deploy làm gì bên dưới.</li>
<li><strong>Gọi nó từ CI</strong> (khoá GitHub Actions): pipeline dựng và kiểm thử, rồi chạy đúng lệnh <code>ssh deploy@vps sudo deploy.sh …</code>. Các mã thoát ở trên là thứ pipeline dựa vào để phản ứng.</li>
<li><strong>Container</strong> (khoá Docker): thư mục bản phát hành thành một tag của image, <code>current</code> thành "tag nào đang chạy", quay lui thành "chạy tag trước đó". Ý tưởng — bản phát hành bất biến, một con trỏ, health check, tự quay lui — giữ nguyên.</li>
<li><strong>Không</strong> dùng cho migration CSDL không đảo ngược được: quay lui mã không quay lui được lược đồ. Viết migration tương thích ngược, hoặc deploy nó thành một bước riêng, có chủ ý.</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> mai nhóm demo app cho giảng viên. Bạn muốn có bằng chứng rằng một bản hỏng không thể làm sập buổi demo.</p><ol>
<li>Deploy 1.0.0 và 1.1.0 như trên; kiểm <code>--list</code> đánh <code>*</code> ở 1.1.0.</li>
<li>Làm bản 1.3.0 có <code>/health</code> trả <code>{"status": "loi"}</code> (đổi chuỗi trong <code>app.py</code>); deploy nó và đo người dùng bị xa bản 1.1.0 bao lâu.</li>
<li>Chạy hai lần deploy 1.1.0 cùng lúc và ghi lại cả hai mã thoát.</li>
<li>Deploy 1.1.0 thêm sáu lần, rồi đếm thư mục trong <code>releases/</code> (bỏ qua <code>*.hong</code>).</li>
</ol><p><strong>Đạt khi:</strong> bước 2 kết thúc với <code>mã=1</code>, <code>curl -s localhost/health</code> cho <code>1.1.0</code>, và có một thư mục <code>*.hong</code>; bước 3 cho một <code>0</code> và một <code>3</code>; bước 4 còn đúng 5 thư mục bản phát hành và bản mang dấu <code>*</code> nằm trong số đó.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Release directory (thư mục bản phát hành)</span><span class="v">Mỗi phiên bản đã deploy một thư mục bất biến, đặt tên theo thời gian.</span></div>
  <div class="kv"><span class="k">Atomic (nguyên tử)</span><span class="v">Xảy ra trọn vẹn hoặc không xảy ra; không có trạng thái lưng chừng nào lộ ra (<code>rename()</code>).</span></div>
  <div class="kv"><span class="k">Health check (kiểm tra sức khoẻ)</span><span class="v">Một yêu cầu chứng minh app thật sự chạy, kiểm theo nội dung chứ không chỉ "có gì đó trả lời".</span></div>
  <div class="kv"><span class="k">Rollback (quay lui)</span><span class="v">Trở về bản trước; ở đây: đưa mũi tên <code>current</code> về rồi khởi động lại.</span></div>
  <div class="kv"><span class="k">Lock (khoá, <code>flock</code>)</span><span class="v">Bảo đảm mỗi lúc chỉ một lần deploy; tự nhả khi tiến trình kết thúc.</span></div>
  <div class="kv"><span class="k">Start limit (giới hạn khởi động)</span><span class="v">Cái phanh của systemd cho vòng lặp chết: quá N lần start trong T giây thì từ chối tiếp.</span></div>
  <div class="kv"><span class="k">cgroup (nhóm điều khiển)</span><span class="v">Nhóm trong nhân chứa các tiến trình của một dịch vụ và áp các giới hạn như <code>MemoryMax</code>.</span></div>
  <div class="kv"><span class="k">Exit code contract (hợp đồng mã thoát)</span><span class="v">Mỗi mã thoát có một nghĩa được ghi rõ, để script và CI phản ứng đúng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mỗi bản một thư mục, một symlink <code>current</code>; deploy và quay lui đều là "dời mũi tên, khởi động lại".</li>
<li>Dựng trong <code>mktemp -d</code> nằm trong <code>releases/</code>, rồi <code>mv -T</code>; đổi mũi tên bằng <code>ln -sfn</code> + <code>mv -T</code> — nguyên tử trên mọi Linux, kể cả BusyBox.</li>
<li>Kiểm gói trước khi đụng vào gì; kiểm <em>nội dung</em> của health sau khi khởi động lại; tự quay lui và đổi tên bản hỏng.</li>
<li><code>flock -n</code> trên <code>exec {fd}</code> chặn hai lần deploy; mã 0/1/2/3/4 báo cho bên gọi chuyện gì đã xảy ra.</li>
<li><code>systemctl reset-failed</code> trước khi khởi động lại, không thì <code>StartLimitBurst</code> có thể từ chối cả lần quay lui.</li>
<li>Unit: <code>User=</code>, <code>EnvironmentFile=</code>, <code>Restart=on-failure</code>, <code>MemoryMax=</code> + <code>MemorySwapMax=0</code>, <code>ProtectSystem=strict</code>; <code>daemon-reload</code> sau mỗi lần sửa.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/man5/systemd.service.5.html" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">systemd.service(5)</span><span class="lc-sub"><code>Type=</code>, <code>ExecStart=</code>, <code>Restart=</code> và mọi trạng thái thoát systemd báo được.</span></span>
</a>
<a class="link-card" href="https://www.freedesktop.org/software/systemd/man/latest/systemd.unit.html" target="_blank" rel="noopener">
  <span class="lc-ico">⚙️</span>
  <span class="lc-body"><span class="lc-title">systemd.unit — StartLimitBurst và các chỉ thị liên quan</span><span class="lc-sub">Mục <code>[Unit]</code>, thứ tự khởi động và giới hạn tốc độ start mà <code>reset-failed</code> xoá được.</span></span>
</a>
<a class="link-card" href="https://www.gnu.org/software/coreutils/manual/html_node/ln-invocation.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">GNU coreutils — ln</span><span class="lc-sub"><code>-s</code>, <code>-f</code>, <code>-n</code> và chuyện gì xảy ra khi đích là symlink trỏ vào thư mục.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man1/flock.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">flock(1)</span><span class="lc-sub">Khoá trên file descriptor, <code>-n</code>, <code>-w</code> và các mã thoát.</span></span>
</a>
<a class="link-card" href="https://12factor.net/config" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">The Twelve-Factor App — Config</span><span class="lc-sub">Vì sao cấu hình và bí mật nằm trong môi trường chứ không trong mã — ý tưởng đứng sau <code>EnvironmentFile=</code>.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Code Lab — Linux &amp; Bash</span><span class="lc-sub">Bài tập có chấm điểm của khoá; phần script và systemd là bài khởi động cho bài này.</span></span>
</a>
<p class="note-ct"><strong>Thói quen mang về:</strong> đừng bao giờ ghi đè lên thứ đang chạy — đặt bản mới bên cạnh, dời một mũi tên, và để health check quyết định mũi tên có được ở lại không.</p>
</div>
`,
    },
    /* ─────────────────────────── 16.3 ─────────────────────────── */
    {
      title: "16.3 — Automation and monitoring: backups, log rotation, alerts and a morning report|||16.3 — Tự động hoá và giám sát: sao lưu, xoay vòng log, cảnh báo và báo cáo buổi sáng",
      slug: "lnx-16-3-tu-dong-hoa-giam-sat",
      type: "LESSON",
      isFreePreview: true,
      description: "Timer sao lưu nhất quán giữ đúng 7 bản chạy theo giờ Việt Nam trên máy UTC, logrotate với SIGHUP, giám sát đĩa/inode/RAM/dịch vụ chỉ báo khi trạng thái đổi qua webhook, journalctl lọc lỗi và báo cáo 07:30 — kèm những bất ngờ đo được.",
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.3</span>
<h2>Automation and monitoring: backups, log rotation, alerts and a morning report</h2>
<p class="lead">A server that only works while somebody watches it is a hobby. This lesson gives the clinic server four habits that run without you: a backup every night that is checked and keeps exactly seven copies, a log file that never grows without limit, a watchdog every five minutes that speaks only when something <em>changes</em>, and a report every morning at 07:30 Vietnam time — on a machine whose clock runs in UTC. Every piece is a small script plus a systemd timer, and every piece was run for real, including the parts that surprised us.</p>

<h3>Why automate before anything goes wrong</h3>
<p>Nobody runs a backup by hand every night for a year. Nobody reads a log file that is 4 GB. Nobody refreshes a status page at 3 a.m. The failures of Lesson 16.4 — a full disk, a dead service, a lost database — are all "known in advance" failures: a timer could have caught each one before a user did. What you automate here is not clever; what matters is that it runs every day, that it is <em>tested</em>, and that it does not cry wolf.</p>

<h3>Backups: a consistent copy, checked, seven kept</h3>
${slide('lx-16', 16, 'Sao lưu: sqlite3 .backup, kiểm, giữ đúng 7 bản')}
<pre><code class="language-bash">#!/usr/bin/env bash
<span class="tok-comment"># sao-luu.sh — chụp CSDL đang chạy, nén, kiểm, và chỉ giữ 7 bản mới nhất.</span>
set -Eeuo pipefail
readonly DB=/var/lib/datlich/datlich.db DICH=/var/backups/datlich GIU=7

ten=$DICH/datlich-$(date +%Y%m%d-%H%M%S).db.gz
tam=$(mktemp "$DICH/.dang-ghi.XXXXXX")
trap 'rm -f -- "$tam" "$tam.gz"' EXIT

sqlite3 "$DB" ".backup '$tam'"                  <span class="tok-comment"># chụp nhất quán dù app đang ghi (cp thì không)</span>
kq=$(sqlite3 "$tam" 'PRAGMA integrity_check;')
[[ $kq == ok ]] || { echo "bản chụp hỏng: $kq" &gt;&amp;2; exit 1; }
gzip -9 "$tam"                                  <span class="tok-comment"># → $tam.gz</span>
mv -T "$tam.gz" "$ten"                          <span class="tok-comment"># tên thật chỉ xuất hiện khi đã đủ</span>
echo "đã sao lưu \${ten##*/} ($(du -h "$ten" | cut -f1))"

<span class="tok-comment"># xoay vòng: tên chứa thời gian ⇒ sắp theo tên = theo thời gian</span>
mapfile -t cu &lt; &lt;(find "$DICH" -maxdepth 1 -name 'datlich-*.db.gz' | sort -r | tail -n +$((GIU + 1)))
if (( \${#cu[@]} )); then
  rm -f -- "\${cu[@]}"
  echo "xoá \${#cu[@]} bản cũ nhất, còn $GIU"
fi</code></pre>
<p>Four decisions worth copying into any backup job:</p>
<ol>
<li><strong>A consistent snapshot, not <code>cp</code>.</strong> Copying a database file while the app writes to it can capture half a transaction. SQLite's <code>.backup</code> command uses the online backup API and produces a consistent copy while the app keeps running; for PostgreSQL the equivalent is <code>pg_dump</code>, for MySQL <code>mysqldump --single-transaction</code>.</li>
<li><strong>Check before you keep.</strong> <code>PRAGMA integrity_check</code> must answer <code>ok</code>; otherwise the job fails loudly (exit 1, which systemd records and the watchdog below notices) instead of silently storing garbage.</li>
<li><strong>Never show a half-written file under its real name.</strong> The copy is made in a <code>mktemp</code> file in the same directory, compressed, then renamed with <code>mv -T</code> — atomic, as in Lesson 16.2. The <code>EXIT</code> trap removes the temporary file whatever happens.</li>
<li><strong>Keep a fixed number.</strong> The names contain the time, so sorting by name newest-first (<code>sort -r</code>) and skipping the first seven (<code>tail -n +8</code>) leaves exactly the ones to delete. <code>mapfile -t</code> puts them in an array (Lesson 13.1), so names are never split.</li>
</ol>
<p>The service that runs it has no <code>[Install]</code> section — it is started only by its timer — and runs as <code>datlich</code>, the only user that can read the database:</p>
<pre><code class="language-ini"><span class="tok-comment"># /etc/systemd/system/datlich-saoluu.service</span>
[Unit]
Description=Sao lưu CSDL đặt lịch

[Service]
Type=oneshot
User=datlich
Group=datlich
ExecStart=/opt/datlich/ops/sao-luu.sh</code></pre>
<p>A backup nobody has restored is only a hope. Test the newest one:</p>
<div class="out">$ zcat $(ls -1 /var/backups/datlich/*.gz | tail -1) &gt; /tmp/thu.db; sqlite3 /tmp/thu.db "select count(*) from lich"
2</div>
<div class="callout warn"><p><strong>Same machine = only half a backup.</strong> Copies in <code>/var/backups</code> protect you from human mistakes and app bugs (a bad migration, a deleted row). They do not survive the disk or the VPS dying. Push one copy a day to another machine or to object storage (<code>rsync</code>, Lesson 9.4) — and restore from there once a month.</p></div>

<h3>A timer on Vietnam time, on a machine that runs in UTC</h3>
${slide('lx-16', 17, 'Timer theo giờ Việt Nam trên một máy chạy UTC')}
<pre><code class="language-ini"><span class="tok-comment"># /etc/systemd/system/datlich-saoluu.timer</span>
[Unit]
Description=Sao lưu CSDL đặt lịch lúc 02:30 giờ Việt Nam

[Timer]
OnCalendar=*-*-* 02:30:00 Asia/Ho_Chi_Minh
Persistent=true
RandomizedDelaySec=5min

[Install]
WantedBy=timers.target</code></pre>
<p>Servers usually keep their clock in UTC (Lesson 11.3 explains why), while you think in Vietnam time, UTC+7. <code>cron</code> can only follow the machine's clock (incident 6 in Lesson 16.4 measures what goes wrong). A systemd timer can carry its own time zone at the end of <code>OnCalendar=</code> — an IANA name such as <code>Asia/Ho_Chi_Minh</code>, per the <code>systemd.time</code> manual; systemd 255 on Ubuntu 24.04 accepts it, as measured below. Do not trust your reading — ask systemd:</p>
<div class="out">$ date; TZ=Asia/Ho_Chi_Minh date
Mon Sep 28 17:06:19 UTC 2026
Tue Sep 29 00:06:19 +07 2026
$ systemd-analyze calendar "*-*-* 02:30:00 Asia/Ho_Chi_Minh"
Normalized form: *-*-* 02:30:00 Asia/Ho_Chi_Minh
    Next elapse: Mon 2026-09-28 19:30:00 UTC
       From now: 2h 23min left
$ systemd-analyze calendar --iterations=2 "*-*-* 07:30"
  Original form: *-*-* 07:30
Normalized form: *-*-* 07:30:00
    Next elapse: Tue 2026-09-29 07:30:00 UTC
       From now: 14h left
   Iteration #2: Wed 2026-09-30 07:30:00 UTC
       From now: 1 day 14h left</div>
<p>02:30 in Vietnam is 19:30 UTC the previous evening — exactly what the first output says. The second shows the trap: without a time zone, "07:30" means 07:30 <em>UTC</em>, which is 14:30 in Vietnam. And the list of all the project's timers:</p>
<div class="out">$ systemctl list-timers "datlich-*"
NEXT                            LEFT LAST                              PASSED UNIT                  ACTIVATES
Mon 2026-09-28 17:06:41 UTC      21s Mon 2026-09-28 17:01:41 UTC 4min 38s ago datlich-giamsat.timer datlich-giamsat.service
Mon 2026-09-28 19:31:05 UTC 2h 24min -                                      - datlich-saoluu.timer  datlich-saoluu.service
Tue 2026-09-29 00:30:00 UTC       7h -                                      - datlich-baocao.timer  datlich-baocao.service

3 timers listed.</div>
<p>The backup's NEXT is 19:31:05, not 19:30:00 — that is <code>RandomizedDelaySec=5min</code> at work: a random delay up to five minutes so a hundred servers built from the same script do not all hit the storage at 02:30:00 sharp. The morning report is due at 00:30 UTC = 07:30 in Vietnam. The watchdog uses a different kind of timer, relative instead of calendar:</p>
<table>
<tr><th>Directive</th><th>Meaning</th><th>Used for</th></tr>
<tr><td><code>OnCalendar=*-*-* 02:30:00 Asia/Ho_Chi_Minh</code></td><td>wall-clock time, optionally with a time zone</td><td>backup, morning report</td></tr>
<tr><td><code>Persistent=true</code></td><td>if the machine was off at that time, run once as soon as it is back</td><td>backup: never skip a night</td></tr>
<tr><td><code>RandomizedDelaySec=5min</code></td><td>add a random delay up to 5 min</td><td>spreading load</td></tr>
<tr><td><code>OnBootSec=2min</code></td><td>2 minutes after boot</td><td>watchdog, first run</td></tr>
<tr><td><code>OnUnitActiveSec=5min</code></td><td>5 minutes after the service last started</td><td>watchdog, every 5 min</td></tr>
</table>

<h3>Run it ten times, keep seven — and the 5-in-10-seconds rule</h3>
${slide('lx-16', 18, 'Chạy 10 lần, còn đúng 7 — và luật 5 lần/10 giây')}
<p>To test the rotation without waiting a week, start the service by hand several times. The first attempt was a loop with 1.1 seconds between starts, and half of it failed:</p>
<div class="out">$ for i in $(seq 8); do sleep 1.1; sudo systemctl start datlich-saoluu.service; done
Job for datlich-saoluu.service failed.
See "systemctl status datlich-saoluu.service" and "journalctl -xeu datlich-saoluu.service" for details.
… (4 times)
$ journalctl -u datlich-saoluu -o cat | grep -m1 "too quickly"
datlich-saoluu.service: Start request repeated too quickly.
$ systemctl show datlich-saoluu -p StartLimitBurst -p StartLimitIntervalUSec
StartLimitIntervalUSec=10s
StartLimitBurst=5</div>
<p>Even a <code>oneshot</code> service has a start limit, and the default is 5 starts in 10 seconds — the same brake that blocked the rollback in Lesson 16.2, here with systemd's default values. A timer firing once a night never gets near it; a test loop does. After <code>systemctl reset-failed datlich-saoluu</code> and 2.2 seconds between starts, all went through: ten successful backups in total, and the rotation kept exactly seven:</p>
<div class="out">$ journalctl -u datlich-saoluu -o cat | grep -E "xoá|sao lưu" | tail -4
đã sao lưu datlich-20260928-170608.db.gz (4.0K)
xoá 1 bản cũ nhất, còn 7
đã sao lưu datlich-20260928-170611.db.gz (4.0K)
xoá 1 bản cũ nhất, còn 7
$ ls -1 /var/backups/datlich
datlich-20260928-170544.db.gz
datlich-20260928-170545.db.gz
datlich-20260928-170602.db.gz
datlich-20260928-170604.db.gz
datlich-20260928-170606.db.gz
datlich-20260928-170608.db.gz
datlich-20260928-170611.db.gz</div>

<h3>logrotate renames the file — the app must reopen it</h3>
${slide('lx-16', 19, 'logrotate đổi TÊN file; app phải mở lại')}
<p>The app keeps <code>access.log</code> open and appends a line per request. Left alone, that file grows until the disk is full (incident 1). <code>logrotate</code>, run daily by <code>logrotate.timer</code>, renames it and starts a new one. Here is the trap, reproduced with a minimal config that has no <code>postrotate</code>:</p>
<div class="out"># /tmp/sai.conf: rotate 3 / missingok / create 0640 datlich datlich — no postrotate
$ sudo logrotate -f /tmp/sai.conf
$ (three more requests to the app)
$ ls -l /var/log/datlich/access.log*
-rw-r----- 1 datlich datlich    0 Sep 28 17:06 /var/log/datlich/access.log
-rw-r--r-- 1 datlich datlich 2868 Sep 28 17:06 /var/log/datlich/access.log.1
$ ls -l /proc/$(systemctl show -p MainPID --value datlich)/fd | grep access
… 3 -&gt; /var/log/datlich/access.log.1
$ tail -n 1 /var/log/datlich/access.log.1
2026-09-28T17:06:48+0000 127.0.0.1 "GET /health HTTP/1.0" 200 -</div>
<p>The new <code>access.log</code> stays empty and the new requests land in <code>access.log.1</code>. A file descriptor points at an <strong>inode</strong>, not at a name (Lesson 2.4): <code>mv</code> changed the name, the app's descriptor 3 still points at the same inode, now called <code>access.log.1</code>. Tomorrow's rotation compresses and deletes it — while the app is still writing into it. Two cures:</p>
<ul>
<li><strong>Tell the app to reopen</strong> (what we do): a <code>postrotate</code> script sends <code>SIGHUP</code>, and <code>app.py</code> has a handler that closes and reopens the log path. <code>systemctl kill -s HUP --kill-whom=main</code> sends it to the main process only.</li>
<li><strong><code>copytruncate</code></strong>: copy the content away, then truncate the original to zero; the app never notices. Simple, but lines written between the copy and the truncate are lost — acceptable for debug logs, not for anything you bill from (Lesson 10.3 measured it).</li>
</ul>
<pre><code class="language-text"><span class="tok-comment"># /etc/logrotate.d/datlich</span>
/var/log/datlich/access.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    create 0640 datlich datlich
    su datlich datlich
    postrotate
        systemctl kill -s HUP --kill-whom=main datlich.service
    endscript
}</code></pre>
<table>
<tr><th>Directive</th><th>Meaning</th></tr>
<tr><td><code>daily</code> · <code>rotate 14</code></td><td>rotate once a day, keep 14 old files (two weeks)</td></tr>
<tr><td><code>compress</code> · <code>delaycompress</code></td><td>gzip old files, but leave the newest old one (<code>.1</code>) uncompressed — it may still be written for a moment, and it is the one you read most</td></tr>
<tr><td><code>missingok</code> · <code>notifempty</code></td><td>no error if the log is missing; do not rotate an empty file</td></tr>
<tr><td><code>create 0640 datlich datlich</code></td><td>create the new empty file with this mode and owner</td></tr>
<tr><td><code>su datlich datlich</code></td><td>do the rotation as this user — required when the directory is not owned by root</td></tr>
<tr><td><code>postrotate … endscript</code></td><td>commands run after rotating (here: SIGHUP)</td></tr>
</table>
<div class="out">$ sudo logrotate -d /etc/logrotate.d/datlich 2&gt;&amp;1 | tail -n 6   # -d: dry run, only explains
considering log /var/log/datlich/access.log
Creating new state
  Now: 2026-09-28 17:07
  Last rotated at 2026-09-28 17:00
  log does not need rotating (log has already been rotated)
switching euid from 999 to 0 and egid from 996 to 0 (pid 3320)
$ sudo logrotate -f /etc/logrotate.d/datlich                      # -f: force now
$ journalctl -u datlich -n 1 -o cat
nhận SIGHUP: đã mở lại /var/log/datlich/access.log
$ wc -l /var/log/datlich/access.log                               # after 3 requests
3 /var/log/datlich/access.log
$ ls -l /var/log/datlich/access.log*                              # after a second forced rotation
-rw-r----- 1 datlich datlich  64 Sep 28 17:07 /var/log/datlich/access.log
-rw-r----- 1 datlich datlich 192 Sep 28 17:07 /var/log/datlich/access.log.1
-rw-r----- 1 datlich datlich  82 Sep 28 17:07 /var/log/datlich/access.log.2.gz
$ systemctl list-timers logrotate.timer
NEXT                        LEFT LAST PASSED UNIT            ACTIVATES
Tue 2026-09-29 00:00:00 UTC   6h -         - logrotate.timer logrotate.service</div>
<p>Now the new file receives the new lines, and <code>delaycompress</code> is visible: <code>.1</code> is plain, <code>.2.gz</code> is compressed.</p>

<h3>Monitoring that only speaks when the state changes</h3>
${slide('lx-16', 20, 'Giám sát: chỉ báo khi TRẠNG THÁI đổi')}
<pre><code class="language-bash">#!/usr/bin/env bash
<span class="tok-comment"># giam-sat.sh — kiểm đĩa, inode, RAM, dịch vụ, health, bản sao lưu; chỉ báo khi TRẠNG THÁI ĐỔI.</span>
set -Euo pipefail           <span class="tok-comment"># cố ý KHÔNG có -e: một phép kiểm hỏng không được bỏ qua các phép sau</span>
readonly NGUONG=85 RAM_MB=100
readonly TT=/var/lib/datlich/.giam-sat LOG=/var/log/datlich/canh-bao.log
<span class="tok-comment"># shellcheck source=/dev/null</span>
[[ -r /etc/datlich/giamsat.env ]] &amp;&amp; . /etc/datlich/giamsat.env      <span class="tok-comment"># WEBHOOK_URL=…</span>

bao() {
  local msg="[$HOSTNAME] $*"
  printf '%(%F %T)T %s\\n' -1 "$msg" &gt;&gt; "$LOG"
  logger -t datlich-giamsat -p user.warning -- "$msg"
  if [[ -n \${WEBHOOK_URL:-} ]]; then
    curl -fsS -m 5 -H 'Content-Type: application/json' \\
      -d "$(python3 -c 'import json, sys; print(json.dumps({"text": sys.argv[1]}))' "$msg")" \\
      "$WEBHOOK_URL" &gt;/dev/null \\
      || echo "không gửi được webhook" &gt;&amp;2
  fi
}

loi=()
declare -A da_xem=()
for p in / /var/lib/datlich /var/log/datlich; do
  read -r fs dung ino &lt; &lt;(df --output=target,pcent,ipcent "$p" | tail -n 1 | tr -d '%')
  [[ -n \${da_xem[$fs]:-} ]] &amp;&amp; continue; da_xem[$fs]=1
  (( dung &lt; NGUONG )) || loi+=("đĩa $fs đầy \${dung}%")
  [[ $ino == - ]] || (( ino &lt; NGUONG )) || loi+=("inode $fs đầy \${ino}%")
done
ram=$(awk '/^MemAvailable:/ {print int($2 / 1024)}' /proc/meminfo)
(( ram &gt;= RAM_MB )) || loi+=("RAM khả dụng chỉ còn \${ram} MB")
systemctl is-active -q datlich || loi+=("dịch vụ datlich: $(systemctl is-active datlich)")
curl -fsS -m 3 -o /dev/null http://127.0.0.1/health || loi+=("health qua nginx hỏng")
[[ -n $(find /var/backups/datlich -name 'datlich-*.db.gz' -mmin -1560 -print -quit) ]] \\
  || loi+=("không có bản sao lưu nào trong 26 giờ qua")

if (( \${#loi[@]} )); then hien=$(printf '%s; ' "\${loi[@]}"); hien=\${hien%; }; else hien=OK; fi
cu=$(cat "$TT" 2&gt;/dev/null || echo OK)
if [[ $hien != "$cu" ]]; then
  if [[ $hien == OK ]]; then bao "ĐÃ ỔN (trước đó: $cu)"; else bao "CẢNH BÁO: $hien"; fi
  printf '%s\\n' "$hien" &gt; "$TT"
fi
echo "giám sát: \${#loi[@]} vấn đề — $hien"</code></pre>
<p>What it checks, and the design choices that make it bearable:</p>
<ul>
<li><strong>Six checks</strong>: disk and inode usage of every filesystem the app uses (<code>df --output=</code> prints exactly the columns asked for; an associative array skips a filesystem already seen — Lesson 13.1), available RAM from <code>MemAvailable</code> (the number that matters, Lesson 5.2), the service state, the health endpoint <em>through nginx</em> (what a user sees), and the age of the newest backup (<code>-mmin -1560</code> = younger than 26 hours).</li>
<li><strong>No <code>-e</code></strong>, on purpose: in a monitor, a failing check is data, not a reason to stop. Every failure is collected into the array <code>loi</code>.</li>
<li><strong>State, not events.</strong> The result is compared with the previous run's (a small state file). Only a <em>change</em> is reported — "WARNING: …" when something breaks, "RECOVERED" when it heals. Run every five minutes, a naive monitor would send 288 identical messages a day, and after the second day nobody reads them.</li>
<li><strong>Three channels</strong>: a file (<code>canh-bao.log</code>), the journal (<code>logger</code>, so <code>journalctl -t datlich-giamsat</code> finds it) and a webhook — the URL of a chat channel (Slack, Discord, Telegram…) kept in <code>/etc/datlich/giamsat.env</code>. The JSON body is built by Python's <code>json.dumps</code>, which escapes quotes and newlines correctly; gluing JSON together with <code>"{\\"text\\":\\"$msg\\"}"</code> breaks the day a message contains a quote.</li>
</ul>
<p>To test without a real chat service, a 14-line fake webhook listens on <code>127.0.0.1:19169</code> and prints what it receives:</p>
<pre><code class="language-python">#!/usr/bin/env python3
"""Webhook GIẢ LẬP (thay cho Slack/Discord/Telegram): nhận POST JSON, in ra journal."""
import json
from http.server import BaseHTTPRequestHandler, HTTPServer

class H(BaseHTTPRequestHandler):
    def do_POST(self):
        body = json.loads(self.rfile.read(int(self.headers["Content-Length"])))
        print("WEBHOOK nhận:", body["text"], flush=True)
        self.send_response(204); self.end_headers()
    def log_message(self, *a): pass

HTTPServer(("127.0.0.1", 19169), H).serve_forever()</code></pre>
<div class="out">$ sudo systemd-run --unit=webhook-gia -q python3 /root/webhook-gia.py
$ echo "WEBHOOK_URL=http://127.0.0.1:19169/hook" | sudo tee /etc/datlich/giamsat.env
$ sudo /opt/datlich/ops/giam-sat.sh
giám sát: 0 vấn đề — OK
$ sudo systemctl stop datlich; sudo /opt/datlich/ops/giam-sat.sh
curl: (22) The requested URL returned error: 502
giám sát: 2 vấn đề — dịch vụ datlich: inactive; health qua nginx hỏng
$ sudo /opt/datlich/ops/giam-sat.sh
curl: (22) The requested URL returned error: 502
giám sát: 2 vấn đề — dịch vụ datlich: inactive; health qua nginx hỏng
$ sudo systemctl start datlich; sleep 1; sudo /opt/datlich/ops/giam-sat.sh
giám sát: 0 vấn đề — OK
$ cat /var/log/datlich/canh-bao.log
2026-09-28 17:41:28 [clinic-vps] CẢNH BÁO: dịch vụ datlich: inactive; health qua nginx hỏng
2026-09-28 17:41:29 [clinic-vps] ĐÃ ỔN (trước đó: dịch vụ datlich: inactive; health qua nginx hỏng)
$ journalctl -u webhook-gia -o cat | tail -n 2
WEBHOOK nhận: [clinic-vps] CẢNH BÁO: dịch vụ datlich: inactive; health qua nginx hỏng
WEBHOOK nhận: [clinic-vps] ĐÃ ỔN (trước đó: dịch vụ datlich: inactive; health qua nginx hỏng)
$ journalctl -t datlich-giamsat -o short-iso | tail -n 2
2026-09-28T17:41:28+00:00 clinic-vps datlich-giamsat[6896]: [clinic-vps] CẢNH BÁO: dịch vụ datlich: inactive; health qua nginx hỏng
2026-09-28T17:41:29+00:00 clinic-vps datlich-giamsat[6943]: [clinic-vps] ĐÃ ỔN (trước đó: dịch vụ datlich: inactive; health qua nginx hỏng)</div>
<p>Two runs saw the same broken state; exactly one warning was sent. One recovery message closed it. (The <code>curl: (22) … 502</code> lines are the health check's own error text on stderr: nginx answered 502 Bad Gateway because nothing listened behind it.)</p>
<div class="pitfall co-tieu-de"><strong>Who watches the watchdog?</strong> In incident 7 of Lesson 16.4, a teammate saved <code>giam-sat.sh</code> with Windows line endings — and the monitor itself died with exit 127 every five minutes. Nothing was reported, because the thing that reports was the thing that broke. Two defences: add <code>OnFailure=</code> to the monitor's service so systemd starts a tiny "alert that the monitor failed" unit when it fails; and have one check from <em>outside</em> the server (a free uptime service calling <code>http://your-domain/health</code>), because a monitor on the machine cannot report that the machine is off.</div>

<h3>Filtering the journal, and a report every morning</h3>
${slide('lx-16', 21, 'journalctl -p err bỏ sót Traceback; báo cáo sáng')}
<p>The obvious way to count errors is <code>journalctl -p err</code> — "priority error or worse". On this server it found only systemd's own complaints, and missed every crash of the app:</p>
<div class="out">$ journalctl -u datlich -p err --since "-30min"
Sep 28 17:03:39 clinic-vps systemd[1]: Failed to start datlich.service - Đặt lịch phòng khám (API).
Sep 28 17:03:44 clinic-vps systemd[1]: Failed to start datlich.service - Đặt lịch phòng khám (API).
$ journalctl -u datlich -g KeyError -o json -n 1 | jq "{PRIORITY, _PID, MESSAGE}"
{
  "PRIORITY": "6",
  "_PID": "2347",
  "MESSAGE": "KeyError: 'SMS_API_KEY'"
}
$ journalctl -u datlich --since "-30min" -o cat | grep -c Traceback
7</div>
<p>Everything a service writes to stdout <em>and</em> stderr reaches the journal at priority 6, <code>info</code> — systemd cannot know that a Python traceback is an error. Seven crashes, zero "errors". Either have the app log with a priority — a line starting with <code>&lt;3&gt;</code> is stored as priority 3 (measured: <code>print("&lt;3&gt;loi co muc")</code> under <code>systemd-run</code> gave <code>{"PRIORITY":"3","MESSAGE":"loi co muc"}</code>, a plain <code>print</code> gave <code>"6"</code>) — or search by content with <code>-g</code>. The morning report does the second:</p>
<pre><code class="language-bash">#!/usr/bin/env bash
<span class="tok-comment"># bao-cao-sang.sh — tóm tắt 24 giờ qua của máy chủ, chạy lúc 07:30 giờ Việt Nam.</span>
set -Euo pipefail
readonly L=/var/log/datlich
export TZ=Asia/Ho_Chi_Minh          <span class="tok-comment"># máy chạy UTC; báo cáo đọc theo giờ Việt Nam</span>
{
  echo "BÁO CÁO SÁNG $(date '+%F %H:%M') giờ VN — máy $(hostname)"
  echo "── tài nguyên"
  df -h --output=target,size,used,avail,pcent / | sed 's/^/  /'
  free -m | awk '/^Mem:/ {printf "  RAM: dùng %s MB, khả dụng %s MB\\n", $3, $7}'
  echo "── dịch vụ"
  printf '  datlich %s · bản %s · khởi động lại %s lần · RAM %s\\n' \\
    "$(systemctl is-active datlich)" "$(&lt; /opt/datlich/current/VERSION)" \\
    "$(systemctl show -p NRestarts --value datlich)" \\
    "$(systemctl show -p MemoryCurrent --value datlich | numfmt --to=iec)"
  printf '  24h: %s lần app văng Traceback · %s dòng systemd mức err\\n' \\
    "$(journalctl -u datlich --since '24 hours ago' -q --no-pager -g Traceback | wc -l)" \\
    "$(journalctl -u datlich --since '24 hours ago' -q --no-pager -p err | wc -l)"
  awk '{n++; if ($(NF-1) ~ /^5/) e++} END {printf "  yêu cầu HTTP: %d, lỗi 5xx: %d\\n", n, e}' "$L/access.log"
  echo "── sao lưu"
  find /var/backups/datlich -name 'datlich-*.db.gz' | sort | tail -n 1 | sed 's|.*/|  mới nhất: |'
  echo "  số bản: $(find /var/backups/datlich -name 'datlich-*.db.gz' | wc -l)"
  echo "── cảnh báo gần nhất"
  tail -n 3 "$L/canh-bao.log" 2&gt;/dev/null | sed 's/^/  /' || true
} | tee "$L/bao-cao-$(date +%F).txt"</code></pre>
<div class="out">$ sudo systemctl start datlich-baocao.service; journalctl -u datlich-baocao -o cat -n 17 | head -n 15
BÁO CÁO SÁNG 2026-09-29 00:08 giờ VN — máy clinic-vps
── tài nguyên
  Mounted on  Size  Used Avail Use%
  /           911G   24G  842G   3%
  RAM: dùng 2805 MB, khả dụng 5128 MB
── dịch vụ
  datlich active · bản 1.1.0 · khởi động lại 0 lần · RAM 12M
  24h: 7 lần app văng Traceback · 2 dòng systemd mức err
  yêu cầu HTTP: 5, lỗi 5xx: 0
── sao lưu
  mới nhất: datlich-20260928-170611.db.gz
  số bản: 7
── cảnh báo gần nhất
  2026-09-28 17:06:32 [clinic-vps] CẢNH BÁO: dịch vụ datlich: inactive; health qua nginx hỏng
  2026-09-28 17:06:33 [clinic-vps] ĐÃ ỔN (trước đó: dịch vụ datlich: inactive; health qua nginx hỏng)
$ ls /var/log/datlich | grep bao
bao-cao-2026-09-29.txt</div>
<p>(The 911G disk is the Docker host's disk seen through the container. The count of 7 Tracebacks includes the whole traceback runs of 1.2.0 from Lesson 16.2.) The first version of the script had <code>TZ=Asia/Ho_Chi_Minh</code> only inside the header's <code>date</code>, and the report written at 00:07 Vietnam time was saved as <code>bao-cao-2026-09-28.txt</code> — the file name used UTC, the header used Vietnam time. <code>export TZ=…</code> at the top makes every <code>date</code> in the script agree.</p>
<table>
<tr><th>journalctl flag</th><th>Meaning</th><th>Example</th></tr>
<tr><td><code>-u UNIT</code></td><td>only this unit</td><td><code>-u datlich</code></td></tr>
<tr><td><code>-t TAG</code></td><td>only this syslog identifier (what <code>logger -t</code> sets)</td><td><code>-t datlich-giamsat</code></td></tr>
<tr><td><code>-p LEVEL</code></td><td>this priority or worse (<code>err</code>=3, <code>warning</code>=4, <code>info</code>=6)</td><td><code>-p warning</code></td></tr>
<tr><td><code>-g REGEX</code> (<code>--grep</code>)</td><td>message matches a regex; add <code>--case-sensitive=no</code></td><td><code>-g 'Traceback|Errno'</code></td></tr>
<tr><td><code>--since</code> / <code>--until</code></td><td>time window: <code>"-30min"</code>, <code>"24 hours ago"</code>, <code>today</code>, <code>17:03:36</code></td><td><code>--since today</code></td></tr>
<tr><td><code>-n N</code> · <code>-f</code></td><td>last N lines · follow new lines</td><td><code>-n 30</code></td></tr>
<tr><td><code>-o cat|short-iso|json</code></td><td>message only · ISO time · every field (for <code>jq</code>)</td><td><code>-o json | jq .PRIORITY</code></td></tr>
<tr><td><code>-k</code> · <code>-b</code></td><td>kernel messages · this boot only</td><td><code>-k -g oom</code></td></tr>
<tr><td><code>-q</code> · <code>--no-pager</code></td><td>no informational lines · no <code>less</code> (for scripts)</td><td>in <code>$( )</code></td></tr>
</table>

<h3>Try it step by step</h3>
<pre><code class="language-bash"><span class="tok-comment"># in the practice container, after bootstrap and a deploy</span>
sudo systemctl start datlich-saoluu.service &amp;&amp; journalctl -u datlich-saoluu -n 3 -o cat
for i in $(seq 9); do sleep 2.2; sudo systemctl start datlich-saoluu.service; done
ls -1 /var/backups/datlich | wc -l                          <span class="tok-comment"># → 7</span>
systemctl list-timers "datlich-*"
systemd-analyze calendar "*-*-* 02:30:00 Asia/Ho_Chi_Minh"
for i in 1 2 3; do curl -s -o /dev/null localhost/health; done
sudo logrotate -f /etc/logrotate.d/datlich &amp;&amp; journalctl -u datlich -n 1 -o cat
sudo systemd-run --unit=webhook-gia -q python3 /root/webhook-gia.py
echo "WEBHOOK_URL=http://127.0.0.1:19169/hook" | sudo tee /etc/datlich/giamsat.env
sudo systemctl stop datlich; sudo /opt/datlich/ops/giam-sat.sh
sudo systemctl start datlich; sleep 1; sudo /opt/datlich/ops/giam-sat.sh
journalctl -u webhook-gia -o cat
sudo systemctl start datlich-baocao.service; journalctl -u datlich-baocao -o cat -n 15</code></pre>

<h3>On macOS and WSL: what is different</h3>
<table>
<tr><th>Thing</th><th>Linux</th><th>Mac (measured)</th><th>WSL2</th></tr>
<tr><td>Timers</td><td>systemd <code>.timer</code></td><td>no <code>systemctl</code>; the scheduler is <code>launchd</code> (<code>launchctl</code> present) with <code>StartCalendarInterval</code> in a plist — Lesson 15.2</td><td>systemd timers work once <code>systemd=true</code> is set in <code>/etc/wsl.conf</code>, and only while the WSL VM is running</td></tr>
<tr><td>Log rotation</td><td><code>logrotate</code></td><td><code>logrotate</code> not installed; macOS has <code>newsyslog</code> (<code>/usr/sbin/newsyslog</code>, rules in <code>/etc/newsyslog.d/</code>)</td><td><code>logrotate</code></td></tr>
<tr><td>Journal</td><td><code>journalctl</code></td><td>not present; the unified log is read with <code>/usr/bin/log show</code> — the full path, because in zsh <code>log</code> is a shell builtin (measured: <code>log: too many arguments</code>)</td><td><code>journalctl</code> with systemd</td></tr>
<tr><td><code>sqlite3</code></td><td>apt package</td><td>present at <code>/usr/bin/sqlite3</code> — you can test <code>.backup</code> locally</td><td>apt package</td></tr>
<tr><td><code>printf '%(%F %T)T'</code></td><td>bash 5</td><td><code>/bin/bash</code> 3.2: <code>printf: &#96;(': invalid format character</code></td><td>bash 5</td></tr>
</table>

<h3>When to use this — and when to use a real monitoring system</h3>
<ul>
<li><strong>A script + timer + webhook</strong> is right for one to a few servers: nothing extra to install, and you know exactly what it checks.</li>
<li><strong>Add an outside check</strong> in every case — an uptime service that calls your public health URL from the internet catches "the whole VPS is off", which nothing on the VPS can.</li>
<li><strong>Move to a monitoring stack</strong> (metrics collected over time, dashboards, alert rules — Prometheus and Grafana are common) when you have several machines, or need trends such as "the disk fills 2% a week". The rule from this lesson carries over: alert on symptoms users feel, and only on changes.</li>
<li><strong>Backups</strong>: whatever tool you use later, keep the three rules — consistent snapshot, verified, copy off the machine — and restore-test on a schedule.</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> the lecturer asks the group to prove that the server would survive a week alone.</p><ol>
<li>Change <code>GIU</code> in <code>sao-luu.sh</code> to 3, run bootstrap (it installs the new script), then start the backup service five times at least 2.1 seconds apart.</li>
<li>Restore the newest backup into <code>/tmp/thu.db</code> and count the rows of <code>lich</code>.</li>
<li>Force two log rotations with some requests in between, and show that the app writes into the newest <code>access.log</code>.</li>
<li>Fill <code>/var/log/datlich</code> above 85 % (in the practice container: mount a small <code>tmpfs</code> as in Lesson 16.4 and use <code>fallocate -l</code>), run <code>giam-sat.sh</code> three times, then delete the file and run it once more.</li>
</ol><p><strong>Done when:</strong> <code>ls /var/backups/datlich | wc -l</code> prints <code>3</code>; the row count matches <code>curl -s localhost/api/lich</code>; <code>ls -l /proc/$(systemctl show -p MainPID --value datlich)/fd</code> points at <code>access.log</code>, not <code>.1</code>; the webhook received exactly one warning and one recovery for step 4.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Consistent snapshot</span><span class="v">A copy of a database as it was at one instant, never half a transaction.</span></div>
  <div class="kv"><span class="k">Retention</span><span class="v">How many old copies (backups, logs) are kept before the oldest is deleted.</span></div>
  <div class="kv"><span class="k">Timer (<code>OnCalendar=</code>)</span><span class="v">A systemd unit that starts a service at wall-clock times, optionally in a given time zone.</span></div>
  <div class="kv"><span class="k">Log rotation</span><span class="v">Renaming, compressing and eventually deleting old logs so they never fill the disk.</span></div>
  <div class="kv"><span class="k">SIGHUP (reopen)</span><span class="v">By convention, the signal that tells a daemon to reopen its log files or reload its config.</span></div>
  <div class="kv"><span class="k">Webhook</span><span class="v">A URL you send an HTTP POST to; chat services turn it into a message.</span></div>
  <div class="kv"><span class="k">Alert fatigue</span><span class="v">When alerts repeat so often that people stop reading them — prevented by alerting on state changes.</span></div>
  <div class="kv"><span class="k">Priority (journal)</span><span class="v">The syslog level of a journal entry, 0 (emerg) to 7 (debug); plain stdout/stderr get 6 (info).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Backup = consistent snapshot (<code>sqlite3 .backup</code>, <code>pg_dump</code>) + integrity check + atomic rename + keep N (<code>sort -r | tail -n +N+1</code>); restore-test it.</li>
<li><code>OnCalendar=… Asia/Ho_Chi_Minh</code> lets a UTC server run jobs on Vietnam time; <code>systemd-analyze calendar</code> proves it.</li>
<li>Every service, even <code>oneshot</code>, has a start limit (default 5 starts / 10 s); test loops must space their starts or <code>reset-failed</code>.</li>
<li>logrotate renames; a process writes to the inode it opened — send SIGHUP in <code>postrotate</code>, or use <code>copytruncate</code> and accept lost lines.</li>
<li>Monitor without <code>-e</code>, compare with the previous state, and alert only on changes, through a file, the journal and a webhook.</li>
<li>App output lands in the journal at priority 6: search crashes with <code>journalctl -g</code>, not only <code>-p err</code>.</li>
</ul>

<a class="link-card" href="https://www.freedesktop.org/software/systemd/man/latest/systemd.timer.html" target="_blank" rel="noopener">
  <span class="lc-ico">⏰</span>
  <span class="lc-body"><span class="lc-title">systemd.timer</span><span class="lc-sub"><code>OnCalendar=</code>, <code>Persistent=</code>, <code>RandomizedDelaySec=</code>, <code>OnUnitActiveSec=</code>.</span></span>
</a>
<a class="link-card" href="https://www.freedesktop.org/software/systemd/man/latest/systemd.time.html" target="_blank" rel="noopener">
  <span class="lc-ico">🕑</span>
  <span class="lc-body"><span class="lc-title">systemd.time — calendar events</span><span class="lc-sub">The full calendar syntax, including a time zone at the end of the expression.</span></span>
</a>
<a class="link-card" href="https://www.sqlite.org/backup.html" target="_blank" rel="noopener">
  <span class="lc-ico">💾</span>
  <span class="lc-body"><span class="lc-title">SQLite Online Backup API</span><span class="lc-sub">Why a live database needs a proper backup, and what <code>.backup</code> does underneath.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man8/logrotate.8.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔄</span>
  <span class="lc-body"><span class="lc-title">logrotate(8)</span><span class="lc-sub">Every directive: <code>delaycompress</code>, <code>copytruncate</code>, <code>su</code>, <code>postrotate</code> and the <code>-d</code>/<code>-f</code> flags.</span></span>
</a>
<a class="link-card" href="https://sre.google/sre-book/monitoring-distributed-systems/" target="_blank" rel="noopener">
  <span class="lc-ico">📟</span>
  <span class="lc-body"><span class="lc-title">Google SRE Book — Monitoring Distributed Systems</span><span class="lc-sub">Symptoms versus causes, and why every page must be actionable — the ideas behind "only on change".</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Code Lab — Linux &amp; Bash</span><span class="lc-sub">Graded exercises for the course; the text-processing tasks train the <code>awk</code>/<code>sort</code> pieces of these scripts.</span></span>
</a>
<p class="note-ct"><strong>The habit to take away:</strong> for every job a timer runs, ask two questions — "how would I know it failed?" and "have I ever seen it fail on purpose?"</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.3</span>
<h2>Tự động hoá và giám sát: sao lưu, xoay vòng log, cảnh báo và báo cáo buổi sáng</h2>
<p class="lead">Một máy chủ chỉ chạy được khi có người ngồi canh là một thú chơi. Bài này cho máy chủ phòng khám bốn thói quen tự chạy không cần bạn: mỗi đêm một bản sao lưu được kiểm và giữ đúng bảy bản, một file log không bao giờ phình vô hạn, một con chó canh cửa năm phút một lần chỉ lên tiếng khi có gì <em>thay đổi</em>, và mỗi sáng một bản báo cáo lúc 07:30 giờ Việt Nam — trên một cái máy mà đồng hồ chạy giờ UTC. Mỗi mảnh là một script nhỏ cộng một timer của systemd, và mảnh nào cũng đã chạy thật, kể cả những chỗ làm chúng tôi bất ngờ.</p>

<h3>Vì sao tự động hoá trước khi có chuyện</h3>
<p>Chẳng ai tự tay chạy sao lưu mỗi đêm suốt một năm. Chẳng ai đọc một file log 4 GB. Chẳng ai ngồi bấm tải lại trang trạng thái lúc 3 giờ sáng. Các sự cố của Bài 16.4 — đĩa đầy, dịch vụ chết, mất CSDL — đều là sự cố "biết trước": một timer đã có thể bắt được từng cái trước khi người dùng phát hiện. Thứ bạn tự động hoá ở đây không có gì cao siêu; cái quan trọng là nó chạy mỗi ngày, nó được <em>kiểm thử</em>, và nó không kêu "sói tới" suốt ngày.</p>

<h3>Sao lưu: bản chụp nhất quán, có kiểm, giữ bảy bản</h3>
${slide('lx-16', 16, 'Sao lưu: sqlite3 .backup, kiểm, giữ đúng 7 bản')}
<pre><code class="language-bash">#!/usr/bin/env bash
<span class="tok-comment"># sao-luu.sh — chụp CSDL đang chạy, nén, kiểm, và chỉ giữ 7 bản mới nhất.</span>
set -Eeuo pipefail
readonly DB=/var/lib/datlich/datlich.db DICH=/var/backups/datlich GIU=7

ten=$DICH/datlich-$(date +%Y%m%d-%H%M%S).db.gz
tam=$(mktemp "$DICH/.dang-ghi.XXXXXX")
trap 'rm -f -- "$tam" "$tam.gz"' EXIT

sqlite3 "$DB" ".backup '$tam'"                  <span class="tok-comment"># chụp nhất quán dù app đang ghi (cp thì không)</span>
kq=$(sqlite3 "$tam" 'PRAGMA integrity_check;')
[[ $kq == ok ]] || { echo "bản chụp hỏng: $kq" &gt;&amp;2; exit 1; }
gzip -9 "$tam"                                  <span class="tok-comment"># → $tam.gz</span>
mv -T "$tam.gz" "$ten"                          <span class="tok-comment"># tên thật chỉ xuất hiện khi đã đủ</span>
echo "đã sao lưu \${ten##*/} ($(du -h "$ten" | cut -f1))"

<span class="tok-comment"># xoay vòng: tên chứa thời gian ⇒ sắp theo tên = theo thời gian</span>
mapfile -t cu &lt; &lt;(find "$DICH" -maxdepth 1 -name 'datlich-*.db.gz' | sort -r | tail -n +$((GIU + 1)))
if (( \${#cu[@]} )); then
  rm -f -- "\${cu[@]}"
  echo "xoá \${#cu[@]} bản cũ nhất, còn $GIU"
fi</code></pre>
<p>Bốn quyết định đáng chép vào mọi việc sao lưu:</p>
<ol>
<li><strong>Bản chụp nhất quán (consistent snapshot), không phải <code>cp</code>.</strong> Chép file CSDL trong lúc app đang ghi có thể chụp trúng nửa giao dịch. Lệnh <code>.backup</code> của SQLite dùng API sao lưu trực tuyến và cho ra bản nhất quán trong khi app vẫn chạy; với PostgreSQL thứ tương đương là <code>pg_dump</code>, với MySQL là <code>mysqldump --single-transaction</code>.</li>
<li><strong>Kiểm rồi mới giữ.</strong> <code>PRAGMA integrity_check</code> phải trả lời <code>ok</code>; không thì việc sao lưu hỏng ầm ĩ (mã 1, systemd ghi lại và con chó canh cửa bên dưới nhận ra) thay vì lặng lẽ cất một đống rác.</li>
<li><strong>Không bao giờ để file ghi dở mang tên thật.</strong> Bản chụp được làm trong một file <code>mktemp</code> nằm cùng thư mục, nén, rồi đổi tên bằng <code>mv -T</code> — nguyên tử, như ở Bài 16.2. Bẫy <code>EXIT</code> xoá file tạm dù chuyện gì xảy ra.</li>
<li><strong>Giữ một số lượng cố định.</strong> Tên có chứa thời gian, nên sắp theo tên từ mới tới cũ (<code>sort -r</code>) rồi bỏ qua bảy cái đầu (<code>tail -n +8</code>) là còn đúng những bản cần xoá. <code>mapfile -t</code> đưa chúng vào một mảng (Bài 13.1), nên tên không bao giờ bị tách vụn.</li>
</ol>
<p>Dịch vụ chạy nó không có mục <code>[Install]</code> — chỉ timer mới khởi động nó — và chạy dưới tên <code>datlich</code>, người dùng duy nhất đọc được CSDL:</p>
<pre><code class="language-ini"><span class="tok-comment"># /etc/systemd/system/datlich-saoluu.service</span>
[Unit]
Description=Sao lưu CSDL đặt lịch

[Service]
Type=oneshot
User=datlich
Group=datlich
ExecStart=/opt/datlich/ops/sao-luu.sh</code></pre>
<p>Một bản sao lưu chưa ai từng khôi phục thử chỉ là một niềm hi vọng. Thử bản mới nhất:</p>
<div class="out">$ zcat $(ls -1 /var/backups/datlich/*.gz | tail -1) &gt; /tmp/thu.db; sqlite3 /tmp/thu.db "select count(*) from lich"
2</div>
<div class="callout warn"><p><strong>Cùng một máy = mới được nửa bản sao lưu.</strong> Các bản trong <code>/var/backups</code> cứu bạn khỏi lỗi người và lỗi app (một migration sai, một dòng bị xoá). Chúng không sống sót được khi ổ đĩa hay cả VPS chết. Mỗi ngày đẩy một bản sang máy khác hoặc kho lưu trữ đối tượng (<code>rsync</code>, Bài 9.4) — và mỗi tháng khôi phục thử từ đó một lần.</p></div>

<h3>Timer theo giờ Việt Nam, trên một máy chạy giờ UTC</h3>
${slide('lx-16', 17, 'Timer theo giờ Việt Nam trên một máy chạy UTC')}
<pre><code class="language-ini"><span class="tok-comment"># /etc/systemd/system/datlich-saoluu.timer</span>
[Unit]
Description=Sao lưu CSDL đặt lịch lúc 02:30 giờ Việt Nam

[Timer]
OnCalendar=*-*-* 02:30:00 Asia/Ho_Chi_Minh
Persistent=true
RandomizedDelaySec=5min

[Install]
WantedBy=timers.target</code></pre>
<p>Máy chủ thường để đồng hồ theo UTC (Bài 11.3 giải thích vì sao), còn bạn nghĩ theo giờ Việt Nam, UTC+7. <code>cron</code> chỉ theo được đồng hồ của máy (sự cố 6 ở Bài 16.4 đo xem chuyện gì hỏng). Một timer của systemd thì mang được múi giờ riêng ở cuối <code>OnCalendar=</code> — một tên IANA như <code>Asia/Ho_Chi_Minh</code>, theo tài liệu <code>systemd.time</code>; systemd 255 của Ubuntu 24.04 nhận nó, đo ở dưới. Đừng tin cách mình đọc — hỏi systemd:</p>
<div class="out">$ date; TZ=Asia/Ho_Chi_Minh date
Mon Sep 28 17:06:19 UTC 2026
Tue Sep 29 00:06:19 +07 2026
$ systemd-analyze calendar "*-*-* 02:30:00 Asia/Ho_Chi_Minh"
Normalized form: *-*-* 02:30:00 Asia/Ho_Chi_Minh
    Next elapse: Mon 2026-09-28 19:30:00 UTC
       From now: 2h 23min left
$ systemd-analyze calendar --iterations=2 "*-*-* 07:30"
  Original form: *-*-* 07:30
Normalized form: *-*-* 07:30:00
    Next elapse: Tue 2026-09-29 07:30:00 UTC
       From now: 14h left
   Iteration #2: Wed 2026-09-30 07:30:00 UTC
       From now: 1 day 14h left</div>
<p>02:30 ở Việt Nam là 19:30 UTC tối hôm trước — đúng như output đầu nói. Output thứ hai cho thấy cái bẫy: không có múi giờ thì "07:30" nghĩa là 07:30 <em>UTC</em>, tức 14:30 ở Việt Nam. Còn đây là danh sách mọi timer của dự án:</p>
<div class="out">$ systemctl list-timers "datlich-*"
NEXT                            LEFT LAST                              PASSED UNIT                  ACTIVATES
Mon 2026-09-28 17:06:41 UTC      21s Mon 2026-09-28 17:01:41 UTC 4min 38s ago datlich-giamsat.timer datlich-giamsat.service
Mon 2026-09-28 19:31:05 UTC 2h 24min -                                      - datlich-saoluu.timer  datlich-saoluu.service
Tue 2026-09-29 00:30:00 UTC       7h -                                      - datlich-baocao.timer  datlich-baocao.service

3 timers listed.</div>
<p>NEXT của sao lưu là 19:31:05 chứ không phải 19:30:00 — đó là <code>RandomizedDelaySec=5min</code> đang làm việc: một khoảng trễ ngẫu nhiên tới năm phút, để một trăm máy chủ dựng từ cùng một script không đồng loạt dội vào kho lưu trữ đúng 02:30:00. Báo cáo sáng tới hạn lúc 00:30 UTC = 07:30 ở Việt Nam. Con chó canh cửa dùng một kiểu timer khác, tính tương đối thay vì theo lịch:</p>
<table>
<tr><th>Chỉ thị</th><th>Nghĩa</th><th>Dùng cho</th></tr>
<tr><td><code>OnCalendar=*-*-* 02:30:00 Asia/Ho_Chi_Minh</code></td><td>giờ đồng hồ, có thể kèm múi giờ</td><td>sao lưu, báo cáo sáng</td></tr>
<tr><td><code>Persistent=true</code></td><td>nếu lúc đó máy tắt, chạy bù một lần ngay khi máy lên lại</td><td>sao lưu: không bao giờ bỏ sót một đêm</td></tr>
<tr><td><code>RandomizedDelaySec=5min</code></td><td>cộng một khoảng trễ ngẫu nhiên tới 5 phút</td><td>rải tải</td></tr>
<tr><td><code>OnBootSec=2min</code></td><td>2 phút sau khi máy khởi động</td><td>chó canh cửa, lần đầu</td></tr>
<tr><td><code>OnUnitActiveSec=5min</code></td><td>5 phút sau lần gần nhất dịch vụ được khởi động</td><td>chó canh cửa, 5 phút một lần</td></tr>
</table>

<h3>Chạy mười lần, giữ bảy — và luật 5 lần trong 10 giây</h3>
${slide('lx-16', 18, 'Chạy 10 lần, còn đúng 7 — và luật 5 lần/10 giây')}
<p>Để thử việc xoay vòng mà không phải đợi một tuần, khởi động dịch vụ bằng tay vài lần. Lần thử đầu là một vòng lặp cách nhau 1,1 giây, và một nửa số lần hỏng:</p>
<div class="out">$ for i in $(seq 8); do sleep 1.1; sudo systemctl start datlich-saoluu.service; done
Job for datlich-saoluu.service failed.
See "systemctl status datlich-saoluu.service" and "journalctl -xeu datlich-saoluu.service" for details.
… (4 lần)
$ journalctl -u datlich-saoluu -o cat | grep -m1 "too quickly"
datlich-saoluu.service: Start request repeated too quickly.
$ systemctl show datlich-saoluu -p StartLimitBurst -p StartLimitIntervalUSec
StartLimitIntervalUSec=10s
StartLimitBurst=5</div>
<p>Kể cả dịch vụ <code>oneshot</code> cũng có giới hạn khởi động, và mặc định là 5 lần trong 10 giây — chính cái phanh đã chặn lần quay lui ở Bài 16.2, ở đây với giá trị mặc định của systemd. Một timer bắn mỗi đêm một lần không bao giờ chạm tới nó; một vòng lặp thử nghiệm thì có. Sau <code>systemctl reset-failed datlich-saoluu</code> và giãn các lần ra 2,2 giây, mọi lần đều qua: tổng cộng mười bản sao lưu thành công, và việc xoay vòng giữ đúng bảy:</p>
<div class="out">$ journalctl -u datlich-saoluu -o cat | grep -E "xoá|sao lưu" | tail -4
đã sao lưu datlich-20260928-170608.db.gz (4.0K)
xoá 1 bản cũ nhất, còn 7
đã sao lưu datlich-20260928-170611.db.gz (4.0K)
xoá 1 bản cũ nhất, còn 7
$ ls -1 /var/backups/datlich
datlich-20260928-170544.db.gz
datlich-20260928-170545.db.gz
datlich-20260928-170602.db.gz
datlich-20260928-170604.db.gz
datlich-20260928-170606.db.gz
datlich-20260928-170608.db.gz
datlich-20260928-170611.db.gz</div>

<h3>logrotate đổi TÊN file — app phải mở lại</h3>
${slide('lx-16', 19, 'logrotate đổi TÊN file; app phải mở lại')}
<p>App giữ <code>access.log</code> mở suốt và ghi nối một dòng cho mỗi yêu cầu. Cứ để vậy, file đó phình tới khi đầy đĩa (sự cố 1). <code>logrotate</code>, do <code>logrotate.timer</code> chạy mỗi ngày, đổi tên nó và bắt đầu một file mới. Đây là cái bẫy, dựng lại bằng một cấu hình tối giản KHÔNG có <code>postrotate</code>:</p>
<div class="out"># /tmp/sai.conf: rotate 3 / missingok / create 0640 datlich datlich — không có postrotate
$ sudo logrotate -f /tmp/sai.conf
$ (thêm ba yêu cầu vào app)
$ ls -l /var/log/datlich/access.log*
-rw-r----- 1 datlich datlich    0 Sep 28 17:06 /var/log/datlich/access.log
-rw-r--r-- 1 datlich datlich 2868 Sep 28 17:06 /var/log/datlich/access.log.1
$ ls -l /proc/$(systemctl show -p MainPID --value datlich)/fd | grep access
… 3 -&gt; /var/log/datlich/access.log.1
$ tail -n 1 /var/log/datlich/access.log.1
2026-09-28T17:06:48+0000 127.0.0.1 "GET /health HTTP/1.0" 200 -</div>
<p><code>access.log</code> mới nằm im rỗng còn các yêu cầu mới rơi vào <code>access.log.1</code>. Một file descriptor trỏ vào <strong>inode</strong>, không trỏ vào tên (Bài 2.4): <code>mv</code> đổi cái tên, còn descriptor số 3 của app vẫn trỏ vào đúng inode đó, giờ mang tên <code>access.log.1</code>. Lần xoay ngày mai sẽ nén rồi xoá nó — trong lúc app vẫn đang ghi vào. Có hai cách chữa:</p>
<ul>
<li><strong>Bảo app mở lại</strong> (cách chúng tôi dùng): đoạn <code>postrotate</code> gửi <code>SIGHUP</code>, và <code>app.py</code> có một hàm xử lý đóng rồi mở lại đường dẫn log. <code>systemctl kill -s HUP --kill-whom=main</code> chỉ gửi cho tiến trình chính.</li>
<li><strong><code>copytruncate</code></strong>: chép nội dung đi, rồi cắt file gốc về 0; app không hề biết. Đơn giản, nhưng những dòng ghi giữa lúc chép và lúc cắt sẽ mất — chấp nhận được cho log gỡ lỗi, không được cho thứ bạn tính tiền theo (Bài 10.3 đã đo).</li>
</ul>
<pre><code class="language-text"><span class="tok-comment"># /etc/logrotate.d/datlich</span>
/var/log/datlich/access.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    create 0640 datlich datlich
    su datlich datlich
    postrotate
        systemctl kill -s HUP --kill-whom=main datlich.service
    endscript
}</code></pre>
<table>
<tr><th>Chỉ thị</th><th>Nghĩa</th></tr>
<tr><td><code>daily</code> · <code>rotate 14</code></td><td>xoay mỗi ngày một lần, giữ 14 file cũ (hai tuần)</td></tr>
<tr><td><code>compress</code> · <code>delaycompress</code></td><td>nén gzip các file cũ, nhưng để file cũ mới nhất (<code>.1</code>) chưa nén — nó có thể vẫn bị ghi thêm một lát, và là file bạn đọc nhiều nhất</td></tr>
<tr><td><code>missingok</code> · <code>notifempty</code></td><td>không báo lỗi nếu thiếu file log; không xoay một file rỗng</td></tr>
<tr><td><code>create 0640 datlich datlich</code></td><td>tạo file rỗng mới với quyền và chủ này</td></tr>
<tr><td><code>su datlich datlich</code></td><td>xoay dưới danh nghĩa người dùng này — bắt buộc khi thư mục không thuộc root</td></tr>
<tr><td><code>postrotate … endscript</code></td><td>lệnh chạy sau khi xoay (ở đây: SIGHUP)</td></tr>
</table>
<div class="out">$ sudo logrotate -d /etc/logrotate.d/datlich 2&gt;&amp;1 | tail -n 6   # -d: chạy thử, chỉ giải thích
considering log /var/log/datlich/access.log
Creating new state
  Now: 2026-09-28 17:07
  Last rotated at 2026-09-28 17:00
  log does not need rotating (log has already been rotated)
switching euid from 999 to 0 and egid from 996 to 0 (pid 3320)
$ sudo logrotate -f /etc/logrotate.d/datlich                      # -f: ép xoay ngay
$ journalctl -u datlich -n 1 -o cat
nhận SIGHUP: đã mở lại /var/log/datlich/access.log
$ wc -l /var/log/datlich/access.log                               # sau 3 yêu cầu
3 /var/log/datlich/access.log
$ ls -l /var/log/datlich/access.log*                              # sau lần ép xoay thứ hai
-rw-r----- 1 datlich datlich  64 Sep 28 17:07 /var/log/datlich/access.log
-rw-r----- 1 datlich datlich 192 Sep 28 17:07 /var/log/datlich/access.log.1
-rw-r----- 1 datlich datlich  82 Sep 28 17:07 /var/log/datlich/access.log.2.gz
$ systemctl list-timers logrotate.timer
NEXT                        LEFT LAST PASSED UNIT            ACTIVATES
Tue 2026-09-29 00:00:00 UTC   6h -         - logrotate.timer logrotate.service</div>
<p>Giờ file mới nhận các dòng mới, và thấy rõ <code>delaycompress</code>: <code>.1</code> để trơn, <code>.2.gz</code> đã nén.</p>

<h3>Giám sát chỉ lên tiếng khi trạng thái đổi</h3>
${slide('lx-16', 20, 'Giám sát: chỉ báo khi TRẠNG THÁI đổi')}
<pre><code class="language-bash">#!/usr/bin/env bash
<span class="tok-comment"># giam-sat.sh — kiểm đĩa, inode, RAM, dịch vụ, health, bản sao lưu; chỉ báo khi TRẠNG THÁI ĐỔI.</span>
set -Euo pipefail           <span class="tok-comment"># cố ý KHÔNG có -e: một phép kiểm hỏng không được bỏ qua các phép sau</span>
readonly NGUONG=85 RAM_MB=100
readonly TT=/var/lib/datlich/.giam-sat LOG=/var/log/datlich/canh-bao.log
<span class="tok-comment"># shellcheck source=/dev/null</span>
[[ -r /etc/datlich/giamsat.env ]] &amp;&amp; . /etc/datlich/giamsat.env      <span class="tok-comment"># WEBHOOK_URL=…</span>

bao() {
  local msg="[$HOSTNAME] $*"
  printf '%(%F %T)T %s\\n' -1 "$msg" &gt;&gt; "$LOG"
  logger -t datlich-giamsat -p user.warning -- "$msg"
  if [[ -n \${WEBHOOK_URL:-} ]]; then
    curl -fsS -m 5 -H 'Content-Type: application/json' \\
      -d "$(python3 -c 'import json, sys; print(json.dumps({"text": sys.argv[1]}))' "$msg")" \\
      "$WEBHOOK_URL" &gt;/dev/null \\
      || echo "không gửi được webhook" &gt;&amp;2
  fi
}

loi=()
declare -A da_xem=()
for p in / /var/lib/datlich /var/log/datlich; do
  read -r fs dung ino &lt; &lt;(df --output=target,pcent,ipcent "$p" | tail -n 1 | tr -d '%')
  [[ -n \${da_xem[$fs]:-} ]] &amp;&amp; continue; da_xem[$fs]=1
  (( dung &lt; NGUONG )) || loi+=("đĩa $fs đầy \${dung}%")
  [[ $ino == - ]] || (( ino &lt; NGUONG )) || loi+=("inode $fs đầy \${ino}%")
done
ram=$(awk '/^MemAvailable:/ {print int($2 / 1024)}' /proc/meminfo)
(( ram &gt;= RAM_MB )) || loi+=("RAM khả dụng chỉ còn \${ram} MB")
systemctl is-active -q datlich || loi+=("dịch vụ datlich: $(systemctl is-active datlich)")
curl -fsS -m 3 -o /dev/null http://127.0.0.1/health || loi+=("health qua nginx hỏng")
[[ -n $(find /var/backups/datlich -name 'datlich-*.db.gz' -mmin -1560 -print -quit) ]] \\
  || loi+=("không có bản sao lưu nào trong 26 giờ qua")

if (( \${#loi[@]} )); then hien=$(printf '%s; ' "\${loi[@]}"); hien=\${hien%; }; else hien=OK; fi
cu=$(cat "$TT" 2&gt;/dev/null || echo OK)
if [[ $hien != "$cu" ]]; then
  if [[ $hien == OK ]]; then bao "ĐÃ ỔN (trước đó: $cu)"; else bao "CẢNH BÁO: $hien"; fi
  printf '%s\\n' "$hien" &gt; "$TT"
fi
echo "giám sát: \${#loi[@]} vấn đề — $hien"</code></pre>
<p>Nó kiểm gì, và những lựa chọn thiết kế khiến nó dễ sống chung:</p>
<ul>
<li><strong>Sáu phép kiểm</strong>: dung lượng và inode của mọi hệ thống file app dùng (<code>df --output=</code> in đúng các cột được hỏi; một mảng kết hợp bỏ qua hệ thống file đã xem — Bài 13.1), RAM khả dụng từ <code>MemAvailable</code> (con số đáng theo dõi, Bài 5.2), trạng thái dịch vụ, health <em>đi qua nginx</em> (thứ người dùng nhìn thấy), và tuổi của bản sao lưu mới nhất (<code>-mmin -1560</code> = trẻ hơn 26 giờ).</li>
<li><strong>Không có <code>-e</code></strong>, có chủ ý: trong một bộ giám sát, một phép kiểm hỏng là dữ liệu, không phải lý do để dừng. Mọi lỗi được gom vào mảng <code>loi</code>.</li>
<li><strong>Trạng thái, không phải sự kiện.</strong> Kết quả được so với kết quả lần trước (một file trạng thái nhỏ). Chỉ khi có <em>thay đổi</em> mới báo — "CẢNH BÁO: …" lúc có gì hỏng, "ĐÃ ỔN" lúc nó lành. Chạy năm phút một lần, một bộ giám sát ngây thơ sẽ gửi 288 tin giống hệt mỗi ngày, và từ ngày thứ hai không ai đọc nữa.</li>
<li><strong>Ba kênh</strong>: một file (<code>canh-bao.log</code>), journal (<code>logger</code>, nên <code>journalctl -t datlich-giamsat</code> tìm ra), và một webhook — URL của một kênh chat (Slack, Discord, Telegram…) cất trong <code>/etc/datlich/giamsat.env</code>. Thân JSON do <code>json.dumps</code> của Python dựng, thứ thoát dấu nháy và xuống dòng đúng cách; tự ghép JSON kiểu <code>"{\\"text\\":\\"$msg\\"}"</code> sẽ vỡ vào cái ngày lời nhắn chứa một dấu nháy.</li>
</ul>
<p>Để thử mà không cần dịch vụ chat thật, một webhook giả 14 dòng nghe ở <code>127.0.0.1:19169</code> và in ra những gì nó nhận:</p>
<pre><code class="language-python">#!/usr/bin/env python3
"""Webhook GIẢ LẬP (thay cho Slack/Discord/Telegram): nhận POST JSON, in ra journal."""
import json
from http.server import BaseHTTPRequestHandler, HTTPServer

class H(BaseHTTPRequestHandler):
    def do_POST(self):
        body = json.loads(self.rfile.read(int(self.headers["Content-Length"])))
        print("WEBHOOK nhận:", body["text"], flush=True)
        self.send_response(204); self.end_headers()
    def log_message(self, *a): pass

HTTPServer(("127.0.0.1", 19169), H).serve_forever()</code></pre>
<div class="out">$ sudo systemd-run --unit=webhook-gia -q python3 /root/webhook-gia.py
$ echo "WEBHOOK_URL=http://127.0.0.1:19169/hook" | sudo tee /etc/datlich/giamsat.env
$ sudo /opt/datlich/ops/giam-sat.sh
giám sát: 0 vấn đề — OK
$ sudo systemctl stop datlich; sudo /opt/datlich/ops/giam-sat.sh
curl: (22) The requested URL returned error: 502
giám sát: 2 vấn đề — dịch vụ datlich: inactive; health qua nginx hỏng
$ sudo /opt/datlich/ops/giam-sat.sh
curl: (22) The requested URL returned error: 502
giám sát: 2 vấn đề — dịch vụ datlich: inactive; health qua nginx hỏng
$ sudo systemctl start datlich; sleep 1; sudo /opt/datlich/ops/giam-sat.sh
giám sát: 0 vấn đề — OK
$ cat /var/log/datlich/canh-bao.log
2026-09-28 17:41:28 [clinic-vps] CẢNH BÁO: dịch vụ datlich: inactive; health qua nginx hỏng
2026-09-28 17:41:29 [clinic-vps] ĐÃ ỔN (trước đó: dịch vụ datlich: inactive; health qua nginx hỏng)
$ journalctl -u webhook-gia -o cat | tail -n 2
WEBHOOK nhận: [clinic-vps] CẢNH BÁO: dịch vụ datlich: inactive; health qua nginx hỏng
WEBHOOK nhận: [clinic-vps] ĐÃ ỔN (trước đó: dịch vụ datlich: inactive; health qua nginx hỏng)
$ journalctl -t datlich-giamsat -o short-iso | tail -n 2
2026-09-28T17:41:28+00:00 clinic-vps datlich-giamsat[6896]: [clinic-vps] CẢNH BÁO: dịch vụ datlich: inactive; health qua nginx hỏng
2026-09-28T17:41:29+00:00 clinic-vps datlich-giamsat[6943]: [clinic-vps] ĐÃ ỔN (trước đó: dịch vụ datlich: inactive; health qua nginx hỏng)</div>
<p>Hai lần chạy thấy cùng một trạng thái hỏng; đúng một cảnh báo được gửi đi. Một tin "đã ổn" khép lại nó. (Các dòng <code>curl: (22) … 502</code> là lời báo lỗi của chính phép kiểm health ra stderr: nginx trả 502 Bad Gateway vì đằng sau nó không có gì nghe.)</p>
<div class="pitfall co-tieu-de"><strong>Ai canh con chó canh cửa?</strong> Ở sự cố 7 của Bài 16.4, một bạn lưu <code>giam-sat.sh</code> với kiểu xuống dòng của Windows — và chính bộ giám sát chết với mã 127 mỗi năm phút. Không có gì được báo, vì cái thứ lo việc báo lại chính là thứ đã hỏng. Hai lớp phòng: thêm <code>OnFailure=</code> vào dịch vụ giám sát để systemd khởi động một unit nhỏ "báo rằng bộ giám sát đã hỏng" khi nó hỏng; và có một phép kiểm từ <em>bên ngoài</em> máy chủ (một dịch vụ uptime miễn phí gọi <code>http://tên-miền-của-bạn/health</code>), vì một bộ giám sát nằm trên máy không thể báo rằng cái máy đã tắt.</div>

<h3>Lọc journal, và một bản báo cáo mỗi sáng</h3>
${slide('lx-16', 21, 'journalctl -p err bỏ sót Traceback; báo cáo sáng')}
<p>Cách hiển nhiên để đếm lỗi là <code>journalctl -p err</code> — "mức lỗi hoặc nặng hơn". Trên máy chủ này nó chỉ tìm ra lời phàn nàn của chính systemd, và bỏ sót mọi lần app sập:</p>
<div class="out">$ journalctl -u datlich -p err --since "-30min"
Sep 28 17:03:39 clinic-vps systemd[1]: Failed to start datlich.service - Đặt lịch phòng khám (API).
Sep 28 17:03:44 clinic-vps systemd[1]: Failed to start datlich.service - Đặt lịch phòng khám (API).
$ journalctl -u datlich -g KeyError -o json -n 1 | jq "{PRIORITY, _PID, MESSAGE}"
{
  "PRIORITY": "6",
  "_PID": "2347",
  "MESSAGE": "KeyError: 'SMS_API_KEY'"
}
$ journalctl -u datlich --since "-30min" -o cat | grep -c Traceback
7</div>
<p>Mọi thứ một dịch vụ ghi ra stdout <em>và</em> stderr đều vào journal ở mức ưu tiên 6, <code>info</code> — systemd không thể biết một traceback của Python là lỗi. Bảy lần sập, không một "lỗi" nào. Hoặc cho app ghi log kèm mức — một dòng bắt đầu bằng <code>&lt;3&gt;</code> được cất ở mức 3 (đo: <code>print("&lt;3&gt;loi co muc")</code> chạy dưới <code>systemd-run</code> cho <code>{"PRIORITY":"3","MESSAGE":"loi co muc"}</code>, còn một <code>print</code> trơn cho <code>"6"</code>) — hoặc tìm theo nội dung bằng <code>-g</code>. Báo cáo buổi sáng làm cách thứ hai:</p>
<pre><code class="language-bash">#!/usr/bin/env bash
<span class="tok-comment"># bao-cao-sang.sh — tóm tắt 24 giờ qua của máy chủ, chạy lúc 07:30 giờ Việt Nam.</span>
set -Euo pipefail
readonly L=/var/log/datlich
export TZ=Asia/Ho_Chi_Minh          <span class="tok-comment"># máy chạy UTC; báo cáo đọc theo giờ Việt Nam</span>
{
  echo "BÁO CÁO SÁNG $(date '+%F %H:%M') giờ VN — máy $(hostname)"
  echo "── tài nguyên"
  df -h --output=target,size,used,avail,pcent / | sed 's/^/  /'
  free -m | awk '/^Mem:/ {printf "  RAM: dùng %s MB, khả dụng %s MB\\n", $3, $7}'
  echo "── dịch vụ"
  printf '  datlich %s · bản %s · khởi động lại %s lần · RAM %s\\n' \\
    "$(systemctl is-active datlich)" "$(&lt; /opt/datlich/current/VERSION)" \\
    "$(systemctl show -p NRestarts --value datlich)" \\
    "$(systemctl show -p MemoryCurrent --value datlich | numfmt --to=iec)"
  printf '  24h: %s lần app văng Traceback · %s dòng systemd mức err\\n' \\
    "$(journalctl -u datlich --since '24 hours ago' -q --no-pager -g Traceback | wc -l)" \\
    "$(journalctl -u datlich --since '24 hours ago' -q --no-pager -p err | wc -l)"
  awk '{n++; if ($(NF-1) ~ /^5/) e++} END {printf "  yêu cầu HTTP: %d, lỗi 5xx: %d\\n", n, e}' "$L/access.log"
  echo "── sao lưu"
  find /var/backups/datlich -name 'datlich-*.db.gz' | sort | tail -n 1 | sed 's|.*/|  mới nhất: |'
  echo "  số bản: $(find /var/backups/datlich -name 'datlich-*.db.gz' | wc -l)"
  echo "── cảnh báo gần nhất"
  tail -n 3 "$L/canh-bao.log" 2&gt;/dev/null | sed 's/^/  /' || true
} | tee "$L/bao-cao-$(date +%F).txt"</code></pre>
<div class="out">$ sudo systemctl start datlich-baocao.service; journalctl -u datlich-baocao -o cat -n 17 | head -n 15
BÁO CÁO SÁNG 2026-09-29 00:08 giờ VN — máy clinic-vps
── tài nguyên
  Mounted on  Size  Used Avail Use%
  /           911G   24G  842G   3%
  RAM: dùng 2805 MB, khả dụng 5128 MB
── dịch vụ
  datlich active · bản 1.1.0 · khởi động lại 0 lần · RAM 12M
  24h: 7 lần app văng Traceback · 2 dòng systemd mức err
  yêu cầu HTTP: 5, lỗi 5xx: 0
── sao lưu
  mới nhất: datlich-20260928-170611.db.gz
  số bản: 7
── cảnh báo gần nhất
  2026-09-28 17:06:32 [clinic-vps] CẢNH BÁO: dịch vụ datlich: inactive; health qua nginx hỏng
  2026-09-28 17:06:33 [clinic-vps] ĐÃ ỔN (trước đó: dịch vụ datlich: inactive; health qua nginx hỏng)
$ ls /var/log/datlich | grep bao
bao-cao-2026-09-29.txt</div>
<p>(Ổ 911G là đĩa của máy chủ Docker nhìn từ trong container. Con số 7 Traceback gồm các lần sập của bản 1.2.0 ở Bài 16.2.) Bản đầu của script chỉ đặt <code>TZ=Asia/Ho_Chi_Minh</code> cho lệnh <code>date</code> ở dòng tiêu đề, và bản báo cáo viết lúc 00:07 giờ Việt Nam bị lưu thành <code>bao-cao-2026-09-28.txt</code> — tên file theo UTC, tiêu đề theo giờ Việt Nam. <code>export TZ=…</code> ở đầu khiến mọi lệnh <code>date</code> trong script nói cùng một giờ.</p>
<table>
<tr><th>Cờ của journalctl</th><th>Nghĩa</th><th>Ví dụ</th></tr>
<tr><td><code>-u UNIT</code></td><td>chỉ unit này</td><td><code>-u datlich</code></td></tr>
<tr><td><code>-t TAG</code></td><td>chỉ tên định danh syslog này (thứ <code>logger -t</code> đặt)</td><td><code>-t datlich-giamsat</code></td></tr>
<tr><td><code>-p MỨC</code></td><td>mức này hoặc nặng hơn (<code>err</code>=3, <code>warning</code>=4, <code>info</code>=6)</td><td><code>-p warning</code></td></tr>
<tr><td><code>-g REGEX</code> (<code>--grep</code>)</td><td>nội dung khớp regex; thêm <code>--case-sensitive=no</code></td><td><code>-g 'Traceback|Errno'</code></td></tr>
<tr><td><code>--since</code> / <code>--until</code></td><td>khung giờ: <code>"-30min"</code>, <code>"24 hours ago"</code>, <code>today</code>, <code>17:03:36</code></td><td><code>--since today</code></td></tr>
<tr><td><code>-n N</code> · <code>-f</code></td><td>N dòng cuối · bám theo dòng mới</td><td><code>-n 30</code></td></tr>
<tr><td><code>-o cat|short-iso|json</code></td><td>chỉ lời nhắn · giờ ISO · mọi trường (cho <code>jq</code>)</td><td><code>-o json | jq .PRIORITY</code></td></tr>
<tr><td><code>-k</code> · <code>-b</code></td><td>thông điệp của nhân · chỉ lần khởi động này</td><td><code>-k -g oom</code></td></tr>
<tr><td><code>-q</code> · <code>--no-pager</code></td><td>bỏ dòng thông tin phụ · không mở <code>less</code> (dùng trong script)</td><td>trong <code>$( )</code></td></tr>
</table>

<h3>Chạy thử từng bước</h3>
<pre><code class="language-bash"><span class="tok-comment"># trong container tập luyện, sau khi đã bootstrap và deploy</span>
sudo systemctl start datlich-saoluu.service &amp;&amp; journalctl -u datlich-saoluu -n 3 -o cat
for i in $(seq 9); do sleep 2.2; sudo systemctl start datlich-saoluu.service; done
ls -1 /var/backups/datlich | wc -l                          <span class="tok-comment"># → 7</span>
systemctl list-timers "datlich-*"
systemd-analyze calendar "*-*-* 02:30:00 Asia/Ho_Chi_Minh"
for i in 1 2 3; do curl -s -o /dev/null localhost/health; done
sudo logrotate -f /etc/logrotate.d/datlich &amp;&amp; journalctl -u datlich -n 1 -o cat
sudo systemd-run --unit=webhook-gia -q python3 /root/webhook-gia.py
echo "WEBHOOK_URL=http://127.0.0.1:19169/hook" | sudo tee /etc/datlich/giamsat.env
sudo systemctl stop datlich; sudo /opt/datlich/ops/giam-sat.sh
sudo systemctl start datlich; sleep 1; sudo /opt/datlich/ops/giam-sat.sh
journalctl -u webhook-gia -o cat
sudo systemctl start datlich-baocao.service; journalctl -u datlich-baocao -o cat -n 15</code></pre>

<h3>Trên macOS và WSL khác gì</h3>
<table>
<tr><th>Thứ</th><th>Linux</th><th>Mac (đo thật)</th><th>WSL2</th></tr>
<tr><td>Hẹn giờ</td><td><code>.timer</code> của systemd</td><td>không có <code>systemctl</code>; bộ hẹn giờ là <code>launchd</code> (có <code>launchctl</code>) với <code>StartCalendarInterval</code> trong một file plist — Bài 15.2</td><td>timer của systemd chạy được khi đặt <code>systemd=true</code> trong <code>/etc/wsl.conf</code>, và chỉ trong lúc máy ảo WSL đang chạy</td></tr>
<tr><td>Xoay vòng log</td><td><code>logrotate</code></td><td>không có <code>logrotate</code>; macOS có <code>newsyslog</code> (<code>/usr/sbin/newsyslog</code>, luật trong <code>/etc/newsyslog.d/</code>)</td><td><code>logrotate</code></td></tr>
<tr><td>Journal</td><td><code>journalctl</code></td><td>không có; đọc unified log bằng <code>/usr/bin/log show</code> — phải đủ đường dẫn, vì trong zsh <code>log</code> là lệnh có sẵn của shell (đo: <code>log: too many arguments</code>)</td><td><code>journalctl</code> khi có systemd</td></tr>
<tr><td><code>sqlite3</code></td><td>gói apt</td><td>có sẵn ở <code>/usr/bin/sqlite3</code> — thử <code>.backup</code> ngay trên máy được</td><td>gói apt</td></tr>
<tr><td><code>printf '%(%F %T)T'</code></td><td>bash 5</td><td><code>/bin/bash</code> 3.2: <code>printf: &#96;(': invalid format character</code></td><td>bash 5</td></tr>
</table>

<h3>Khi nào dùng cách này — và khi nào cần một hệ thống giám sát thật</h3>
<ul>
<li><strong>Script + timer + webhook</strong> vừa khít cho một tới vài máy chủ: không cài thêm gì, và bạn biết chính xác nó kiểm cái gì.</li>
<li><strong>Luôn thêm một phép kiểm từ bên ngoài</strong> — một dịch vụ uptime gọi URL health công khai của bạn từ Internet bắt được chuyện "cả VPS tắt", thứ không gì nằm trên VPS bắt được.</li>
<li><strong>Chuyển sang một bộ giám sát đầy đủ</strong> (số liệu thu theo thời gian, bảng điều khiển, luật cảnh báo — Prometheus và Grafana là phổ biến) khi có nhiều máy, hoặc cần xu hướng kiểu "đĩa đầy thêm 2% mỗi tuần". Luật của bài này vẫn áp dụng: cảnh báo theo triệu chứng người dùng cảm thấy, và chỉ khi có thay đổi.</li>
<li><strong>Sao lưu</strong>: sau này dùng công cụ nào cũng giữ ba luật — bản chụp nhất quán, có kiểm, có bản nằm ngoài máy — và khôi phục thử theo lịch.</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> giảng viên đòi nhóm chứng minh máy chủ sống được một tuần mà không ai trông.</p><ol>
<li>Đổi <code>GIU</code> trong <code>sao-luu.sh</code> thành 3, chạy bootstrap (nó cài script mới), rồi khởi động dịch vụ sao lưu năm lần, cách nhau ít nhất 2,1 giây.</li>
<li>Khôi phục bản sao lưu mới nhất vào <code>/tmp/thu.db</code> và đếm số dòng của bảng <code>lich</code>.</li>
<li>Ép xoay log hai lần, giữa hai lần có vài yêu cầu, rồi chứng minh app đang ghi vào <code>access.log</code> mới nhất.</li>
<li>Làm <code>/var/log/datlich</code> đầy quá 85% (trong container tập luyện: gắn một <code>tmpfs</code> nhỏ như ở Bài 16.4 và dùng <code>fallocate -l</code>), chạy <code>giam-sat.sh</code> ba lần, rồi xoá file đó và chạy thêm một lần.</li>
</ol><p><strong>Đạt khi:</strong> <code>ls /var/backups/datlich | wc -l</code> in <code>3</code>; số dòng khớp với <code>curl -s localhost/api/lich</code>; <code>ls -l /proc/$(systemctl show -p MainPID --value datlich)/fd</code> trỏ vào <code>access.log</code> chứ không phải <code>.1</code>; webhook nhận đúng một cảnh báo và một tin "đã ổn" cho bước 4.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Consistent snapshot (bản chụp nhất quán)</span><span class="v">Bản sao CSDL đúng như nó ở một thời điểm, không bao giờ dính nửa giao dịch.</span></div>
  <div class="kv"><span class="k">Retention (mức giữ lại)</span><span class="v">Giữ bao nhiêu bản cũ (sao lưu, log) trước khi xoá bản cũ nhất.</span></div>
  <div class="kv"><span class="k">Timer (<code>OnCalendar=</code>)</span><span class="v">Unit của systemd khởi động một dịch vụ theo giờ đồng hồ, có thể theo một múi giờ chỉ định.</span></div>
  <div class="kv"><span class="k">Log rotation (xoay vòng log)</span><span class="v">Đổi tên, nén và dần xoá log cũ để chúng không bao giờ làm đầy đĩa.</span></div>
  <div class="kv"><span class="k">SIGHUP (mở lại)</span><span class="v">Theo quy ước, tín hiệu bảo một daemon mở lại file log hoặc nạp lại cấu hình.</span></div>
  <div class="kv"><span class="k">Webhook</span><span class="v">Một URL để gửi HTTP POST tới; các dịch vụ chat biến nó thành một tin nhắn.</span></div>
  <div class="kv"><span class="k">Alert fatigue (nhờn cảnh báo)</span><span class="v">Khi cảnh báo lặp lại tới mức người ta thôi đọc — phòng bằng cách chỉ báo khi trạng thái đổi.</span></div>
  <div class="kv"><span class="k">Priority (mức ưu tiên trong journal)</span><span class="v">Mức syslog của một dòng journal, từ 0 (emerg) tới 7 (debug); stdout/stderr trơn nhận mức 6 (info).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Sao lưu = bản chụp nhất quán (<code>sqlite3 .backup</code>, <code>pg_dump</code>) + kiểm toàn vẹn + đổi tên nguyên tử + giữ N bản (<code>sort -r | tail -n +N+1</code>); và khôi phục thử.</li>
<li><code>OnCalendar=… Asia/Ho_Chi_Minh</code> cho máy chạy UTC làm việc theo giờ Việt Nam; <code>systemd-analyze calendar</code> chứng minh điều đó.</li>
<li>Mọi dịch vụ, kể cả <code>oneshot</code>, đều có giới hạn khởi động (mặc định 5 lần / 10 giây); vòng lặp thử nghiệm phải giãn các lần start hoặc <code>reset-failed</code>.</li>
<li>logrotate đổi tên; tiến trình ghi vào inode nó đã mở — gửi SIGHUP trong <code>postrotate</code>, hoặc dùng <code>copytruncate</code> và chấp nhận mất vài dòng.</li>
<li>Giám sát không có <code>-e</code>, so với trạng thái lần trước, chỉ báo khi thay đổi, qua file, journal và webhook.</li>
<li>Output của app vào journal ở mức 6: tìm các lần sập bằng <code>journalctl -g</code>, đừng chỉ dựa vào <code>-p err</code>.</li>
</ul>

<a class="link-card" href="https://www.freedesktop.org/software/systemd/man/latest/systemd.timer.html" target="_blank" rel="noopener">
  <span class="lc-ico">⏰</span>
  <span class="lc-body"><span class="lc-title">systemd.timer</span><span class="lc-sub"><code>OnCalendar=</code>, <code>Persistent=</code>, <code>RandomizedDelaySec=</code>, <code>OnUnitActiveSec=</code>.</span></span>
</a>
<a class="link-card" href="https://www.freedesktop.org/software/systemd/man/latest/systemd.time.html" target="_blank" rel="noopener">
  <span class="lc-ico">🕑</span>
  <span class="lc-body"><span class="lc-title">systemd.time — sự kiện lịch</span><span class="lc-sub">Toàn bộ cú pháp lịch, kể cả múi giờ ở cuối biểu thức.</span></span>
</a>
<a class="link-card" href="https://www.sqlite.org/backup.html" target="_blank" rel="noopener">
  <span class="lc-ico">💾</span>
  <span class="lc-body"><span class="lc-title">SQLite Online Backup API</span><span class="lc-sub">Vì sao một CSDL đang chạy cần sao lưu đúng cách, và <code>.backup</code> làm gì bên dưới.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man8/logrotate.8.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔄</span>
  <span class="lc-body"><span class="lc-title">logrotate(8)</span><span class="lc-sub">Mọi chỉ thị: <code>delaycompress</code>, <code>copytruncate</code>, <code>su</code>, <code>postrotate</code> và các cờ <code>-d</code>/<code>-f</code>.</span></span>
</a>
<a class="link-card" href="https://sre.google/sre-book/monitoring-distributed-systems/" target="_blank" rel="noopener">
  <span class="lc-ico">📟</span>
  <span class="lc-body"><span class="lc-title">Google SRE Book — Monitoring Distributed Systems</span><span class="lc-sub">Triệu chứng hay nguyên nhân, và vì sao mỗi cảnh báo phải hành động được — ý tưởng đứng sau "chỉ báo khi đổi".</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Code Lab — Linux &amp; Bash</span><span class="lc-sub">Bài tập có chấm điểm của khoá; phần xử lý văn bản luyện đúng các mảnh <code>awk</code>/<code>sort</code> trong những script này.</span></span>
</a>
<p class="note-ct"><strong>Thói quen mang về:</strong> với mỗi việc một timer chạy, hỏi hai câu — "nếu nó hỏng thì tôi biết bằng cách nào?" và "tôi đã từng cố ý làm nó hỏng để xem chưa?"</p>
</div>
`,
    },
    /* ─────────────────────────── 16.4 ─────────────────────────── */
    {
      title: "16.4 — The first week in production: eight classic incidents, rebuilt for real|||16.4 — Tuần đầu trên production: tám sự cố kinh điển, dựng lại thật",
      slug: "lnx-16-4-su-co-tuan-dau",
      type: "LESSON",
      isFreePreview: true,
      description: "Đĩa đầy vì file đã xoá còn mở, cạn inode, OOM và cái trần rò ra swap, cổng bị chiếm, file CSDL của root và nhãn SELinux, cron lệch múi giờ, script CRLF, cấu hình không có hiệu lực — mỗi cái: triệu chứng, lệnh đầu tiên, cách cứu, cách phòng, chương liên quan.",
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.4</span>
<h2>The first week in production: eight classic incidents, rebuilt for real</h2>
<p class="lead">The server is up, deploys roll back by themselves, the timers run. Then real life starts. This lesson is the first week of the clinic server as it tends to go for every new team: eight incidents that happen to almost everybody, each rebuilt for real on the practice server — not described from memory. For each one: the <strong>symptom</strong> you actually see, the <strong>first command</strong> that turns a guess into a fact, the <strong>rescue</strong> for tonight, the <strong>prevention</strong> for next month, and the <strong>lesson</strong> of the course where the underlying idea lives. Read it once now; come back to it the first time your own server misbehaves.</p>

<h3>How to read an incident</h3>
${slide('lx-16', 22, '8 sự cố tuần đầu: triệu chứng → lệnh đầu tiên')}
<p>Chapter 12 gave you the method: look before you touch, one question at a time, write down what you did. The table is the one-page version for this server. Notice that the first command is almost never "restart it": a restart destroys the evidence (the process holding the deleted file, the kernel's OOM message, the process that holds the port) and often brings the problem straight back.</p>
<table>
<tr><th>#</th><th>Symptom</th><th>First command</th><th>Course</th></tr>
<tr><td>1</td><td>disk 100 %, deleting the big file frees nothing</td><td><code>lsof -a +L1 /var/log/datlich</code></td><td>10.1 · 12.3</td></tr>
<tr><td>2</td><td><code>No space left on device</code> although <code>df -h</code> shows free space</td><td><code>df -i</code> · <code>du --inodes</code></td><td>10.1 · 14.3</td></tr>
<tr><td>3</td><td>502 for a moment, then the app is back; <code>status=9/KILL</code></td><td><code>journalctl -u datlich</code> · <code>journalctl -k -g oom</code></td><td>5.2 · 11.1 · 14.1</td></tr>
<tr><td>4</td><td>the app will not start: <code>Errno 98</code></td><td><code>ss -ltnp 'sport = :8080'</code></td><td>9.1 · 12.2</td></tr>
<tr><td>5</td><td>reads work, writes give 502: <code>readonly database</code></td><td><code>namei -l</code> · <code>sudo -u datlich test -w</code></td><td>4.5 · 14.4</td></tr>
<tr><td>6</td><td>the 07:30 job runs at 14:30</td><td><code>timedatectl</code> · <code>systemd-analyze calendar</code></td><td>11.2</td></tr>
<tr><td>7</td><td><code>$'\\r': command not found</code> / <code>env: use -[v]S</code>, exit 127</td><td><code>file</code> · <code>cat -A</code></td><td>7.1 · 12.4 · 15.3</td></tr>
<tr><td>8</td><td>a config change "applied" but nothing changed</td><td><code>sshd -T</code> · <code>ls -i</code> · <code>systemctl show</code></td><td>2.4 · 11.3</td></tr>
</table>

<h3>Incident 1 — the disk is full, and rm gives nothing back</h3>
${slide('lx-16', 23, 'Đĩa đầy mà rm không trả chỗ: lsof -a +L1')}
<p><strong>Setup (rebuilt):</strong> <code>/var/log/datlich</code> was mounted as a 40 MB <code>tmpfs</code> so filling it is safe and fast, and a small "appointment reminder" worker was started with DEBUG logging left on — it writes 100 KB at a time into <code>nhac-lich-debug.log</code> and keeps the file open forever, like many real workers.</p>
<p><strong>Symptom:</strong> the monitor from Lesson 16.3 fires, the worker's own log says it cannot write.</p>
<div class="out">$ sudo /opt/datlich/ops/giam-sat.sh
giám sát: 1 vấn đề — đĩa /var/log/datlich đầy 100%
$ df -h /var/log/datlich
Filesystem      Size  Used Avail Use% Mounted on
tmpfs            40M   40M     0 100% /var/log/datlich
$ sudo du -xah /var/log/datlich | sort -h | tail -n 3
4.0K	/var/log/datlich/deploy.log
40M	/var/log/datlich
40M	/var/log/datlich/nhac-lich-debug.log
$ sudo rm /var/log/datlich/nhac-lich-debug.log; df -h /var/log/datlich
Filesystem      Size  Used Avail Use% Mounted on
tmpfs            40M   40M     0 100% /var/log/datlich
$ journalctl -u datlich-nhaclich -n 1 -o cat
ghi log hỏng: [Errno 28] No space left on device</div>
<p><code>rm</code> removed the <em>name</em>. The data belongs to the inode, and an inode is freed only when no name <em>and</em> no open file descriptor points at it (Lesson 2.4). The worker still has it open, so the 40 MB stay in use, invisible to <code>du</code> (which walks names) but counted by <code>df</code> (which asks the filesystem).</p>
<p><strong>First command:</strong> list open files whose link count is below 1 — deleted but still open:</p>
<div class="out">$ sudo lsof +L1 /var/log/datlich
COMMAND  PID    USER   FD   TYPE DEVICE SIZE/OFF NLINK NODE NAME
python3 3636 datlich    3w   REG   0,59      456     1    4 /var/log/datlich/access.log
python3 3647 datlich    3w   REG   0,59 41918464     0    8 /var/log/datlich/nhac-lich-debug.log (deleted)</div>
<p>Why does <code>access.log</code> appear — its NLINK is 1? Because lsof <strong>ORs</strong> its selection options by default: "files with fewer than 1 link" <em>or</em> "files on this filesystem". <code>-a</code> turns that into AND. We rebuilt the incident once more to show the precise command and the rescue:</p>
<div class="out">$ sudo lsof -a +L1 /var/log/datlich
COMMAND  PID    USER   FD   TYPE DEVICE SIZE/OFF NLINK NODE NAME
python3 3775 datlich    3w   REG   0,59 41918464     0    9 /var/log/datlich/nhac-lich-debug.log (deleted)
$ ls -l /proc/3775/fd/3
… /proc/3775/fd/3 -&gt; /var/log/datlich/nhac-lich-debug.log (deleted)
$ sudo truncate -s 0 /proc/3775/fd/3
$ df -h /var/log/datlich
Filesystem      Size  Used Avail Use% Mounted on
tmpfs            40M   24K   40M   1% /var/log/datlich
$ sudo systemctl stop datlich-nhaclich        # then turn DEBUG off before starting it again
$ sudo /opt/datlich/ops/giam-sat.sh
giám sát: 0 vấn đề — OK</div>
<ul>
<li><strong>Rescue:</strong> restart (or stop) the process that holds the file — or, if it must keep running, truncate the deleted file through <code>/proc/PID/fd/N</code>: the space comes back at once and the process keeps writing into an empty file.</li>
<li><strong>Prevention:</strong> every log file gets a logrotate rule (Lesson 16.3); debug logging is never left on in production; the monitor checks disk usage; long-lived logs go to the journal, which has its own size cap (<code>SystemMaxUse=</code>, Lesson 10.3). The group's real VPS once died exactly this way when a 7.6 GB build cache filled the disk under the database.</li>
<li><strong>Course:</strong> 10.1 (<code>df</code>/<code>du</code>/<code>lsof +L1</code>), 12.3 (the disk filled mid-incident), 2.4 (inodes).</li>
</ul>

<h3>Incident 2 — "No space left on device" with 93 MB free</h3>
${slide('lx-16', 24, 'Còn 93M trống mà không tạo nổi file: hết inode')}
<p><strong>Setup:</strong> a new feature writes one small PDF "appointment slip" per visit into <code>/var/cache/datlich/phieu/</code> and nobody deletes them. The cache was a <code>tmpfs</code> with room for 100 MB but only 2 000 inodes, so a year of visits could be simulated in a second.</p>
<div class="out">$ sudo -u datlich touch /var/cache/datlich/phieu/moi.pdf
touch: cannot touch '/var/cache/datlich/phieu/moi.pdf': No space left on device
$ df -h /var/cache/datlich
Filesystem      Size  Used Avail Use% Mounted on
tmpfs           100M  7.9M   93M   8% /var/cache/datlich
$ df -i /var/cache/datlich
Filesystem     Inodes IUsed IFree IUse% Mounted on
tmpfs            2000  2000     0  100% /var/cache/datlich
$ sudo du --inodes -xd1 /var/cache/datlich | sort -n | tail -n 2
1999	/var/cache/datlich/phieu
2000	/var/cache/datlich
$ sudo find /var/cache/datlich -xdev -type f | cut -d/ -f1-5 | sort | uniq -c | sort -rn | head -n 3
   1998 /var/cache/datlich/phieu</div>
<p>Every file needs one inode, however small it is; a filesystem has a fixed number of them (ext4 decides at <code>mkfs</code> time). "No space" means "no inode" here. <code>df -h</code> answers the wrong question; <code>df -i</code> the right one; <code>du --inodes</code> (GNU) or the <code>find | cut | uniq -c</code> pipeline (works everywhere) finds the directory with millions of tiny files — sessions, cache entries, mail queues are the usual suspects.</p>
<p><strong>Rescue:</strong> delete what is safe to delete (here: all cached slips — they can be regenerated). <strong>Prevention:</strong> let systemd clean the cache. A one-line rule in <code>/etc/tmpfiles.d/</code> is applied daily by <code>systemd-tmpfiles-clean.timer</code>, which is already running on every Ubuntu server:</p>
<div class="out">$ cat /etc/tmpfiles.d/datlich.conf
# loại  đường dẫn                 quyền chủ    nhóm    tuổi
d      /var/cache/datlich/phieu  0750  datlich datlich 7d
# quick test: the same rule with an age of 10 seconds, 11 seconds later
$ sudo systemd-tmpfiles --clean /tmp/thu-10s.conf; df -i /var/cache/datlich
Filesystem     Inodes IUsed IFree IUse% Mounted on
tmpfs            2000     2  1998    1% /var/cache/datlich
$ systemctl list-timers systemd-tmpfiles-clean.timer
NEXT                            LEFT LAST PASSED UNIT                         ACTIVATES
Mon 2026-09-28 17:11:36 UTC 1min 22s -         - systemd-tmpfiles-clean.timer systemd-tmpfiles-clean.service</div>
<p><code>d</code> = "create this directory if missing, and clean entries older than the age"; <code>7d</code> = seven days. <strong>Course:</strong> 10.1 (<code>df -i</code>), 14.3 (inodes and filesystems), and the monitor of 16.3, which checks <code>ipcent</code> next to <code>pcent</code> for exactly this reason.</p>

<h3>Incident 3 — out of memory: the ceiling that was not a ceiling</h3>
${slide('lx-16', 25, 'OOM: MemoryMax chỉ là trần thật khi tắt swap')}
<p><strong>Setup:</strong> an "export report" endpoint builds the whole file in memory before sending it (<code>/api/xuat?n=300</code> = 300 MB). The unit had <code>MemoryMax=150M</code>. The first surprise came before any crash:</p>
<div class="out">$ curl -s -w ' → HTTP %{http_code}\\n' "localhost/api/xuat?n=300"
{"bytes": 314572800} → HTTP 200
$ systemctl show datlich -p NRestarts -p MemoryPeak -p MemoryMax
NRestarts=0
MemoryPeak=157286400
MemoryMax=157286400
$ systemctl show datlich -p MemorySwapPeak -p MemorySwapCurrent
MemorySwapCurrent=13062144
MemorySwapPeak=175337472</div>
<p>A 300 MB string inside a 150 MB ceiling — and the request succeeded. The peak sat exactly at the limit, and 167 MB went to <strong>swap</strong>. <code>MemoryMax=</code> limits RAM; when the machine has swap, the kernel reclaims the cgroup's pages into swap instead of killing anything, and the app just becomes very slow. A real ceiling needs <code>MemorySwapMax=0</code> too. After adding it (<code>daemon-reload</code>, restart):</p>
<div class="out">$ curl -s -w ' → HTTP %{http_code}\\n' "localhost/api/xuat?n=300"
&lt;html&gt;
&lt;head&gt;&lt;title&gt;502 Bad Gateway&lt;/title&gt;&lt;/head&gt;
…
 → HTTP 502
$ journalctl -u datlich -n 7 -o short | cut -c17-
clinic-vps python3[3991]: datlich 1.1.0 (bản mới) nghe cổng 8080, CSDL /var/lib/datlich/datlich.db
clinic-vps systemd[1]: datlich.service: A process of this unit has been killed by the OOM killer.
clinic-vps systemd[1]: datlich.service: Main process exited, code=killed, status=9/KILL
clinic-vps systemd[1]: datlich.service: Failed with result 'oom-kill'.
clinic-vps systemd[1]: datlich.service: Scheduled restart job, restart counter is at 1.
clinic-vps systemd[1]: Started datlich.service - Đặt lịch phòng khám (API).
clinic-vps python3[3999]: datlich 1.1.0 (bản mới) nghe cổng 8080, CSDL /var/lib/datlich/datlich.db
$ journalctl -k --case-sensitive=no -g oom -n 3 -o cat | cut -c1-120
Memory cgroup out of memory: Killed process 10562 (python3) total-vm:408772kB, anon-rss:153096kB, file-rss:10504kB, shme
oom-kill:constraint=CONSTRAINT_MEMCG,nodemask=(null),cpuset=90cf60a5970836974396d6fbafa60df08f95bd0ed627ae19ab1acb83e7dc
[  pid  ]   uid  tgid total_vm      rss rss_anon rss_file rss_shmem pgtables_bytes swapents oom_score_adj name
$ curl -s localhost/health
{"status": "ok", "version": "1.1.0"}</div>
<p>How to read it: <code>status=9/KILL</code> and <code>Result 'oom-kill'</code> — the process got SIGKILL from the kernel's OOM killer (a process killed by signal 9 is what Docker reports as exit code 137 = 128 + 9, Lesson 12.2). <code>constraint=CONSTRAINT_MEMCG</code> says <em>why</em>: the limit of one memory cgroup was hit, not the whole machine — the other services were never in danger. The kernel shows PID 10562 while systemd showed 3991: the same process seen from the host's and the container's PID namespace (Lesson 14.1). Then <code>Restart=on-failure</code> brought the app back two seconds later; the user who asked for the export got a 502, everybody else barely noticed.</p>
<ul>
<li><strong>Rescue:</strong> nothing — the unit healed itself. Check <code>NRestarts</code> to see how often it happens.</li>
<li><strong>Prevention:</strong> fix the code (stream the export in chunks, or limit <code>n</code>); keep <code>MemoryMax=</code> + <code>MemorySwapMax=0</code> so one bad request cannot slow the whole server; consider <code>MemoryHigh=</code> slightly below the max, which throttles before it kills.</li>
<li><strong>Course:</strong> 5.2 (<code>free</code>, <code>available</code>), 11.1 (<code>Restart=</code>, limits), 12.3 (memory pressure), 14.1 (cgroups, OOM killer).</li>
</ul>

<h3>Incident 4 — "Address already in use": somebody else has the port</h3>
${slide('lx-16', 26, 'Cổng bị chiếm · file của root: hai kiểu “app chết”')}
<p><strong>Setup:</strong> a teammate "just quickly" tested something with <code>python3 -m http.server 8080</code> as root in a detached session and forgot it. Then the app was restarted.</p>
<div class="out">$ sudo systemctl start datlich; sleep 12; systemctl is-active datlich
failed
$ journalctl -u datlich -o cat --since -20s | grep -m1 -E "Errno|Error"
OSError: [Errno 98] Address already in use
$ journalctl -u datlich --since -20s -o cat | tail -n 3
datlich.service: Start request repeated too quickly.
datlich.service: Failed with result 'exit-code'.
Failed to start datlich.service - Đặt lịch phòng khám (API).
$ curl -s -o /dev/null -w "%{http_code}\\n" localhost/health
404</div>
<p>Two layers of symptom: the app crash-looped until the start limit stopped it (<code>Restart=</code> cannot fix a port that is taken), and nginx still got an answer on 8080 — from the wrong program, a 404 page. A health check that only asked "is port 8080 open?" would have said everything is fine; the deploy script's check for <code>"status": "ok"</code> would not.</p>
<p><strong>First command:</strong> who is listening?</p>
<div class="out">$ sudo ss -ltnp "sport = :8080"
State  Recv-Q Send-Q Local Address:Port Peer Address:PortProcess
LISTEN 0      5          127.0.0.1:8080      0.0.0.0:*    users:(("python3",pid=4020,fd=3))
$ sudo lsof -iTCP:8080 -sTCP:LISTEN
COMMAND  PID USER   FD   TYPE  DEVICE SIZE/OFF NODE NAME
python3 4020 root    3u  IPv4 3569305      0t0  TCP localhost:http-alt (LISTEN)
$ ps -o pid,user,etime,unit,cmd -p $(sudo lsof -t -iTCP:8080 -sTCP:LISTEN)
    PID USER         ELAPSED UNIT                            CMD
   4020 root           00:13 thu-nhanh.service               /usr/bin/python3 -m http.server 8080 --bind 127.0.0.1 --directory /tmp
$ sudo systemctl stop thu-nhanh     # or: sudo fuser -k 8080/tcp
$ sudo systemctl reset-failed datlich; sudo systemctl start datlich
$ curl -s localhost/health
{"status": "ok", "version": "1.1.0"}</div>
<p><code>ps -o unit</code> names the systemd unit a process belongs to — here it tells you whom to ask. Find and stop by <em>port</em>, not by name: <code>pkill -f "http.server"</code> guesses, <code>lsof -t -iTCP:8080 -sTCP:LISTEN</code> knows (the group once had <code>pkill -f "next start"</code> match nothing because the process had renamed itself <code>next-server</code>). <strong>Prevention:</strong> never test on production ports; give test servers ports from your own range; the monitor's health check through nginx catches it within five minutes. <strong>Course:</strong> 9.1 (<code>ss</code>), 12.2 (recipe 2, "address already in use"), 5.3 (signals).</p>

<h3>Incident 5 — reads work, writes fail: a file that belongs to root</h3>
<p><strong>Setup:</strong> somebody restored last night's backup "quickly": <code>zcat</code> into <code>/tmp</code>, then <code>sudo mv</code> over the live database.</p>
<div class="out">$ zcat /var/backups/datlich/datlich-20260928-170611.db.gz &gt; /tmp/khoi-phuc.db
$ sudo systemctl stop datlich; sudo mv /tmp/khoi-phuc.db /var/lib/datlich/datlich.db; sudo systemctl start datlich
$ curl -s localhost/api/lich | head -c 60
[{"id": 1, "ten": "Nguyễn Văn A", "gio": "2026-10-01 08:3
$ curl -s -w " → HTTP %{http_code}\\n" -XPOST localhost/api/lich -d '{"ten":"Phạm D","gio":"2026-10-03 14:00"}'
&lt;html&gt;
&lt;head&gt;&lt;title&gt;502 Bad Gateway&lt;/title&gt;&lt;/head&gt;
…
 → HTTP 502
$ journalctl -u datlich -n 2 -o cat
sqlite3.OperationalError: attempt to write a readonly database
----------------------------------------
$ ls -l /var/lib/datlich
total 8
-rw-r--r-- 1 root root 8192 Sep 28 17:11 datlich.db
$ namei -l /var/lib/datlich/datlich.db
f: /var/lib/datlich/datlich.db
drwxr-xr-x root    root    /
drwxr-xr-x root    root    var
drwxr-xr-x root    root    lib
drwxr-x--- datlich datlich datlich
-rw-r--r-- root    root    datlich.db
$ sudo -u datlich test -w /var/lib/datlich/datlich.db &amp;&amp; echo ghi-được || echo KHÔNG-ghi-được
KHÔNG-ghi-được
$ sudo chown datlich:datlich /var/lib/datlich/datlich.db; sudo chmod 640 /var/lib/datlich/datlich.db
$ curl -s -w " → HTTP %{http_code}\\n" -XPOST localhost/api/lich -d '{"ten":"Phạm D","gio":"2026-10-03 14:00"}'
{"id": 3, "ten": "Phạm D", "gio": "2026-10-03 14:00"} → HTTP 201</div>
<p><code>mv</code> keeps the owner of the file being moved, and a file created by root's shell belongs to root (with umask 022: mode 644). The app, running as <code>datlich</code>, can read a 644 file but not write it. <code>namei -l</code> shows every step of the path with its owner and mode — the first place to look for any "Permission denied" (Lesson 4.5). <code>sudo -u datlich test -w</code> asks the question <em>as the app</em>, which is the only way to be sure. Note the other lesson in that output: the new booking got <code>id 3</code> — the booking made after the backup was taken (Lê C) is gone. That is your RPO (recovery point objective): a nightly backup can lose up to a day of data.</p>
<p><strong>SELinux adds a second lock on Fedora/RHEL.</strong> There, even correct owner and mode can be denied because every file also carries a security <em>label</em>, and a file moved with <code>mv</code> keeps the label of where it was created. Read-only on the Fedora 44 machine (enforcing):</p>
<div class="out">$ getenforce
Enforcing
$ ls -Z trang.html              # a file created in the home directory
unconfined_u:object_r:user_home_t:s0 trang.html
$ matchpathcon /var/www/html/trang.html /opt/datlich/app.py /var/lib/datlich/datlich.db
/var/www/html/trang.html	system_u:object_r:httpd_sys_content_t:s0
/opt/datlich/app.py	system_u:object_r:usr_t:s0
/var/lib/datlich/datlich.db	system_u:object_r:var_lib_t:s0</div>
<p>A page created in <code>~</code> and <code>mv</code>'d into <code>/var/www/html</code> keeps <code>user_home_t</code>, while the web server may only read <code>httpd_sys_content_t</code> — "Permission denied" with a perfect 644. <code>restorecon -v FILE</code> resets the label to what <code>matchpathcon</code> expects; <code>ausearch -m avc</code> and <code>audit2why</code> explain a denial (Lesson 14.4). Ubuntu uses AppArmor instead and does not label files this way. <strong>Prevention:</strong> restore with <code>install -o datlich -g datlich -m 640 SRC DST</code> or run the restore as the app user; on SELinux systems use <code>cp</code> (which takes the label of the destination directory) or <code>restorecon</code> afterwards.</p>

<h3>Incident 6 — the 07:30 job runs at 14:30</h3>
${slide('lx-16', 27, 'Múi giờ · CRLF · config không ăn: ba lỗi “im lặng”')}
<p>A teammate added the morning report to cron the way every tutorial shows: <code>30 7 * * *</code>. The server's clock is UTC, so cron ran it at 07:30 UTC — 14:30 in Vietnam. Someone read online that <code>CRON_TZ=</code> fixes it. We tested both at once: two entries set two minutes ahead, one in UTC, one "in Vietnam time" under <code>CRON_TZ</code>:</p>
<div class="out">$ cat /etc/cron.d/thu-utc /etc/cron.d/thu-crontz
14 17 * * * root echo "dòng giờ UTC chạy lúc $(date +\\%T) UTC" &gt;&gt; /tmp/cron.log
CRON_TZ=Asia/Ho_Chi_Minh
14 00 * * * root echo "dòng CRON_TZ chạy lúc $(date +\\%T) UTC" &gt;&gt; /tmp/cron.log
$ date                                         # two minutes later
Mon Sep 28 17:14:29 UTC 2026
$ cat /tmp/cron.log
dòng giờ UTC chạy lúc 17:14:01 UTC
$ timedatectl | grep zone
                Time zone: Etc/UTC (UTC, +0000)
$ dpkg -s cron | grep Version
Version: 3.0pl1-184ubuntu2</div>
<p>Only the UTC line ran. 17:14 UTC <em>is</em> 00:14 in Vietnam, so a working <code>CRON_TZ</code> would have fired at the same minute — it did not. Ubuntu's default cron (the Debian "vixie" cron, 3.0pl1) treats <code>CRON_TZ</code> as an ordinary environment variable; it is a feature of <em>cronie</em>, the cron of Fedora/RHEL — some online man pages document it, which is exactly why people get misled (Lesson 11.2 measured the same). Two more notes: <code>%</code> is special in a crontab line and must be written <code>\\%</code>; and do not try <code>timedatectl set-timezone</code> inside a container to "check" — on the practice container it made the container's UTC clock jump back seven hours for a few seconds, because containers share the kernel's clock with the Docker host. On a real VPS it is safe.</p>
<p><strong>Rescue and prevention</strong>, best first: (1) use a systemd timer with the zone in the calendar expression, <code>OnCalendar=*-*-* 07:30:00 Asia/Ho_Chi_Minh</code>, and check it with <code>systemd-analyze calendar</code> (Lesson 16.3); (2) keep cron but write UTC times with a comment (<code>30 0 * * *  # 07:30 VN</code>); (3) change the server's time zone with <code>timedatectl set-timezone</code> and then <code>systemctl restart cron</code>, since cron reads the zone at start — accepting that logs will then mix two zones with other machines. <strong>Course:</strong> 11.2, and the UTC-versus-+07 story of containers in Lesson 10.3.</p>

<h3>Incident 7 — a script saved on Windows</h3>
<p>A teammate on Windows fixed a typo in <code>giam-sat.sh</code> and committed it with CRLF line endings. Bootstrap saw a different file and installed it (it compares bytes, as designed). The monitor then failed every five minutes — silently, because the monitor <em>is</em> the thing that reports failures:</p>
<div class="out">$ sudo ./ops/bootstrap.sh ~/.ssh/id_ed25519.pub | grep →
  → cài /opt/datlich/ops/giam-sat.sh
$ sudo systemctl start datlich-giamsat.service; echo "mã=$?"
Job for datlich-giamsat.service failed because the control process exited with error code.
See "systemctl status datlich-giamsat.service" and "journalctl -xeu datlich-giamsat.service" for details.
mã=1
$ journalctl -u datlich-giamsat -n 4 -o cat
/usr/bin/env: use -[v]S to pass options in shebang lines
datlich-giamsat.service: Main process exited, code=exited, status=127/n/a
datlich-giamsat.service: Failed with result 'exit-code'.
Failed to start datlich-giamsat.service - Giám sát máy chủ đặt lịch.
$ bash ops/giam-sat.sh 2&gt;&amp;1 | head -n 3
ops/giam-sat.sh: line 8: $'\\r': command not found
ops/giam-sat.sh: line 9: syntax error near unexpected token &#96;$'{\\r''
ops/giam-sat.sh: line 9: &#96;bao() {'</div>
<p>Two faces of the same bug. Started directly, the kernel reads the shebang <code>#!/usr/bin/env bash\\r</code> and runs <code>env</code> with the argument <code>bash\\r</code>; coreutils 9.4's <code>env</code> sees the odd character and prints a confusing hint about <code>-S</code> — not the "bash\\r: No such file or directory" that older articles show. Run through <code>bash</code>, every line ends in an invisible <code>\\r</code>. <strong>First command:</strong></p>
<div class="out">$ file ops/giam-sat.sh
ops/giam-sat.sh: Bourne-Again shell script, Unicode text, UTF-8 text executable, with CRLF line terminators
$ head -n 1 ops/giam-sat.sh | cat -A
#!/usr/bin/env bash^M$
$ grep -c $'\\r' ops/giam-sat.sh
41
$ LC_ALL=C.UTF-8 shellcheck ops/giam-sat.sh | head -n 4

In ops/giam-sat.sh line 1:
#!/usr/bin/env bash
                   ^-- SC1017 (error): Literal carriage return. Run script through tr -d '\\r' .
$ dos2unix ops/giam-sat.sh
dos2unix: converting file ops/giam-sat.sh to Unix format...
$ file ops/giam-sat.sh
ops/giam-sat.sh: Bourne-Again shell script, Unicode text, UTF-8 text executable</div>
<p><code>cat -A</code> shows <code>^M$</code>: a carriage return before every line end. <code>dos2unix</code> (or <code>sed -i 's/\\r$//'</code>) fixes the file — afterwards it was byte-identical to the original. <strong>Prevention</strong> belongs in the repo, not in people's memory: a <code>.gitattributes</code> line <code>*.sh text eol=lf</code> makes Git write LF on every machine (Lesson 15.3), and ShellCheck in CI fails on SC1017 before the file ever reaches the server. And give the monitor an <code>OnFailure=</code> alert (Lesson 16.3): the watchdog must not die quietly. <strong>Course:</strong> 7.1, 12.4, 15.3.</p>

<h3>Incident 8 — "I changed the config and nothing changed"</h3>
<p>Three variants of one lesson: <em>written</em> is not <em>in effect</em>.</p>
<p><strong>8a — SSH still accepts passwords.</strong> On a cloud VPS, cloud-init has already written <code>50-cloud-init.conf</code>. A teammate hardens SSH with a new file named <code>70-hardening.conf</code>; <code>sshd -t</code> is happy, the reload succeeds:</p>
<div class="out">$ ls /etc/ssh/sshd_config.d/
50-cloud-init.conf
70-hardening.conf
$ sudo sshd -t &amp;&amp; sudo systemctl reload ssh; echo mã=$?
mã=0
$ grep -h PasswordAuthentication /etc/ssh/sshd_config.d/*
PasswordAuthentication yes
PasswordAuthentication no
$ sudo sshd -T | grep ^passwordauthentication
passwordauthentication yes
$ grep -n Include /etc/ssh/sshd_config
12:Include /etc/ssh/sshd_config.d/*.conf
# with our 01-datlich.conf instead of 70-hardening.conf:
$ ls /etc/ssh/sshd_config.d/; sudo sshd -T | grep ^passwordauthentication
01-datlich.conf
50-cloud-init.conf
passwordauthentication no</div>
<p>The glob is read in alphabetical order and the <em>first</em> value wins, so <code>50-</code> beats <code>70-</code>. Only <code>sshd -T</code> tells the truth; <code>cat</code>ing the file you just wrote tells you what you wrote. (This happened to the group's real VPS; Lesson 11.3.)</p>
<p><strong>8b — a bind-mounted file keeps the old content.</strong> Docker mounts a single config file into a container with <code>-v host.conf:/etc/nginx/nginx.conf</code>; the same kernel mechanism is a bind mount, rebuilt here with <code>mount --bind</code>:</p>
<div class="out">$ sed -i s/512/4096/ /srv/repo/nginx.conf
$ cat /srv/repo/nginx.conf /srv/container-thay/nginx.conf
worker_connections 4096;
worker_connections 512;
$ ls -i /srv/repo/nginx.conf /srv/container-thay/nginx.conf
31522 /srv/container-thay/nginx.conf
31524 /srv/repo/nginx.conf
# the right way: overwrite IN PLACE, keep the inode
$ sed s/512/4096/ /srv/repo/nginx.conf &gt; /tmp/moi; cat /tmp/moi &gt; /srv/repo/nginx.conf
$ cat /srv/container-thay/nginx.conf; ls -i /srv/repo/nginx.conf /srv/container-thay/nginx.conf
worker_connections 4096;
31524 /srv/container-thay/nginx.conf
31524 /srv/repo/nginx.conf</div>
<p>A single-file bind mount pins an <strong>inode</strong>, not a path. <code>sed -i</code>, <code>mv</code>, many editors and <code>rsync</code> write a new file and rename it over the old one — a new inode that the mount never sees. <code>cat new &gt; file</code> writes into the existing inode. Check from <em>inside</em> (the container side), never from the side you edited. (The group lost two deploys to this with nginx; Lesson 2.4 explains inodes.)</p>
<p><strong>8c — edited the unit, forgot <code>daemon-reload</code>.</strong></p>
<div class="out">$ sudo sed -i "s/^MemoryMax=150M/MemoryMax=200M/" /etc/systemd/system/datlich.service
$ sudo systemctl restart datlich
Warning: The unit file, source configuration file or drop-ins of datlich.service changed on disk. Run 'systemctl daemon-reload' to reload units.
$ systemctl show -p MemoryMax datlich
MemoryMax=157286400</div>
<p>The restart ran the configuration systemd had in memory — still 150 MB — and printed one warning line that is easy to miss in a script's output. <code>systemctl show</code> is the <code>sshd -T</code> of systemd. <strong>Prevention for all three:</strong> after every configuration change, verify the <em>effective</em> value with the program's own tool — <code>sshd -T</code>, <code>nginx -T</code>, <code>systemctl show</code>, <code>docker exec … cat</code> — and let your scripts do that check, as bootstrap does.</p>

<h3>Writing it down: a five-line postmortem</h3>
<p>After each incident, even a small one, the group writes five lines into <code>SU-CO.md</code> in the repo — blameless, about the system, not the person:</p>
<pre><code class="language-text">## 2026-09-28 — app không lên sau khi restart (Errno 98)
Triệu chứng : 502 cho mọi yêu cầu ~6 phút; giam-sat báo "dịch vụ datlich: failed"
Nguyên nhân : một http.server thử nghiệm bị bỏ quên giữ cổng 8080
Cách cứu     : ss -ltnp → dừng thu-nhanh.service → reset-failed → start
Cách phòng   : không thử trên cổng production; health check kiểm nội dung</code></pre>
<p>Ten of those are the best documentation the server will ever have — and the fastest way to answer "has this happened before?"</p>

<h3>Try it step by step: rebuild any incident safely</h3>
<p>All of these run inside the practice container of Lesson 16.1. Never fill a real disk to practise; mount a small <code>tmpfs</code> instead.</p>
<pre><code class="language-bash"><span class="tok-comment"># 1 · disk full — a 40 MB tmpfs over the log directory (keep a copy of the logs first)</span>
sudo cp -a /var/log/datlich/. /root/log-cu/
sudo mount -t tmpfs -o size=40m,mode=750,uid=$(id -u datlich),gid=$(id -g datlich) tmpfs /var/log/datlich
sudo cp -a /root/log-cu/. /var/log/datlich/ &amp;&amp; sudo systemctl restart datlich
sudo systemd-run --unit=datlich-nhaclich -p User=datlich python3 /opt/datlich/nhac-lich.py
<span class="tok-comment"># 2 · inodes — a tmpfs with few inodes</span>
sudo install -d -o datlich -g datlich -m 750 /var/cache/datlich
sudo mount -t tmpfs -o size=100m,nr_inodes=2000,mode=750,uid=$(id -u datlich),gid=$(id -g datlich) tmpfs /var/cache/datlich
<span class="tok-comment"># 3 · OOM — add MemorySwapMax=0, daemon-reload, restart, then:</span>
curl -s "localhost/api/xuat?n=300"
<span class="tok-comment"># 4 · port taken</span>
sudo systemd-run --unit=thu-nhanh python3 -m http.server 8080 --bind 127.0.0.1 --directory /tmp
sudo systemctl restart datlich
<span class="tok-comment"># 7 · CRLF</span>
sed -i 's/$/\\r/' ops/giam-sat.sh &amp;&amp; sudo ./ops/bootstrap.sh ~/.ssh/id_ed25519.pub
<span class="tok-comment"># clean up: umount the tmpfs mounts, stop the transient units, restore the files</span></code></pre>
<p>(<code>nhac-lich.py</code> is eight lines: open the log file once, then write 100 lines of 1 KB in a loop, print the error and sleep 5 s when a write fails.)</p>

<h3>On macOS and WSL: what is different</h3>
<table>
<tr><th>First command</th><th>Linux</th><th>Mac (measured)</th><th>WSL2</th></tr>
<tr><td><code>df -i</code></td><td>inode columns only</td><td>works; BSD <code>df -i</code> shows <code>iused ifree %iused</code> next to the block columns (measured on APFS: <code>ifree</code> 4 206 703 240 — rarely the problem there)</td><td>as Linux</td></tr>
<tr><td><code>lsof -a +L1</code></td><td>yes</td><td><code>/usr/sbin/lsof</code> present, same flags</td><td>yes</td></tr>
<tr><td><code>ss -ltnp</code></td><td>yes</td><td>not present → <code>lsof -iTCP -sTCP:LISTEN -nP</code></td><td>yes</td></tr>
<tr><td><code>namei -l</code></td><td>yes (util-linux)</td><td>not present → <code>ls -ld</code> each component</td><td>yes</td></tr>
<tr><td><code>fuser -k 8080/tcp</code></td><td>psmisc</td><td><code>/usr/bin/fuser</code> exists, but <code>fuser 8080/tcp</code> prints <code>'8080/tcp' does not exist</code> — no port form</td><td>psmisc</td></tr>
<tr><td><code>journalctl</code>, <code>timedatectl</code></td><td>systemd</td><td>not present → <code>/usr/bin/log show --last 10m</code> (in zsh, a bare <code>log</code> is a shell builtin: <code>log: too many arguments</code>); time zone: <code>readlink /etc/localtime</code> → <code>/var/db/timezone/zoneinfo/Asia/Ho_Chi_Minh</code></td><td>with systemd enabled</td></tr>
<tr><td>CRLF</td><td>—</td><td><code>file</code> works the same (<code>ASCII text, with CRLF line terminators</code>); BSD <code>cat</code> has no <code>-A</code>, use <code>cat -e</code> → <code>a^M$</code></td><td>the usual source: files edited on the Windows side or checked out with <code>core.autocrlf=true</code></td></tr>
</table>

<h3>When to use this playbook</h3>
<ul>
<li><strong>Always start from the symptom table</strong>; the first command is cheap, read-only and turns a guess into a fact.</li>
<li><strong>Do not restart first</strong> unless users are down and you have already captured the evidence (<code>journalctl -u … &gt; /tmp/before.txt</code>, <code>lsof</code>, <code>ss</code>).</li>
<li><strong>Every incident ends with a prevention</strong> that lives in the repo: a line in bootstrap, a unit directive, a monitor check, a <code>.gitattributes</code>. Otherwise it comes back.</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> a "chaos hour" for the group — one person breaks the practice server, the other diagnoses without being told what was done.</p><ol>
<li>Person A picks two incidents from this lesson and rebuilds them with the commands above, without telling person B which.</li>
<li>Person B starts only from symptoms (<code>curl</code>, the monitor, <code>systemctl status</code>) and must name the first command from the table before running anything else.</li>
<li>B rescues the server and writes the five-line postmortem for each incident.</li>
<li>Swap roles once, with two different incidents.</li>
</ol><p><strong>Done when:</strong> for four incidents, the postmortem's "cause" line matches what A actually did, <code>curl -s localhost/health</code> shows <code>"status": "ok"</code>, <code>giam-sat.sh</code> prints <code>0 vấn đề</code>, and every tmpfs from the exercise is unmounted.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Deleted-but-open file</span><span class="v">A file whose name is gone but whose inode is kept alive by an open descriptor; <code>df</code> counts it, <code>du</code> does not.</span></div>
  <div class="kv"><span class="k">Inode exhaustion</span><span class="v">No inodes left: no new file can be created although bytes are free.</span></div>
  <div class="kv"><span class="k">OOM killer</span><span class="v">The kernel mechanism that kills a process when memory (of the machine or of a cgroup) runs out.</span></div>
  <div class="kv"><span class="k">EADDRINUSE (Errno 98)</span><span class="v">"Address already in use": another socket already listens on that address and port.</span></div>
  <div class="kv"><span class="k">SELinux label</span><span class="v">The security context attached to every file and process on Fedora/RHEL; access needs both the right mode and the right label.</span></div>
  <div class="kv"><span class="k">CRLF</span><span class="v">Windows line endings, <code>\\r\\n</code>; bash sees the <code>\\r</code> as part of each command.</span></div>
  <div class="kv"><span class="k">Bind mount</span><span class="v">Making a file or directory appear at a second path; a single-file bind mount follows the inode.</span></div>
  <div class="kv"><span class="k">Postmortem (blameless)</span><span class="v">A short written record of an incident — symptom, cause, rescue, prevention — about the system, not the person.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Disk full and <code>rm</code> did nothing: <code>lsof -a +L1</code> (the <code>-a</code> matters), then restart the holder or <code>truncate</code> via <code>/proc/PID/fd</code>.</li>
<li>"No space" with free bytes is inodes: <code>df -i</code>, <code>du --inodes</code>, and a <code>tmpfiles.d</code> rule to clean caches.</li>
<li><code>MemoryMax=</code> needs <code>MemorySwapMax=0</code> to be a real ceiling; read OOM kills in <code>journalctl -u</code> and <code>journalctl -k -g oom</code>.</li>
<li>Find the owner of a port with <code>ss -ltnp</code>/<code>lsof -t -iTCP:PORT</code>; check health by content, not by "port open".</li>
<li>Permission denied: <code>namei -l</code>, <code>sudo -u APP test -w</code>; <code>mv</code> keeps owner (and SELinux label) — restore with <code>install -o -g -m</code>.</li>
<li>Silent failures — wrong time zone, CRLF, config not in effect — are caught only by checking the effect: <code>systemd-analyze calendar</code>, <code>file</code>/<code>cat -A</code>, <code>sshd -T</code>/<code>systemctl show</code>/<code>ls -i</code>.</li>
</ul>

<a class="link-card" href="https://manpages.ubuntu.com/manpages/noble/man8/lsof.8.html" target="_blank" rel="noopener">
  <span class="lc-ico">📂</span>
  <span class="lc-body"><span class="lc-title">lsof(8)</span><span class="lc-sub"><code>+L1</code>, <code>-a</code> (AND instead of OR), <code>-i</code>, <code>-t</code> — the options behind incidents 1 and 4.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man5/tmpfiles.d.5.html" target="_blank" rel="noopener">
  <span class="lc-ico">🧹</span>
  <span class="lc-body"><span class="lc-title">tmpfiles.d(5)</span><span class="lc-sub">Line types, ages and how <code>systemd-tmpfiles --clean</code> decides what is old.</span></span>
</a>
<a class="link-card" href="https://www.freedesktop.org/software/systemd/man/latest/systemd.resource-control.html" target="_blank" rel="noopener">
  <span class="lc-ico">🧠</span>
  <span class="lc-body"><span class="lc-title">systemd.resource-control</span><span class="lc-sub"><code>MemoryMax=</code>, <code>MemoryHigh=</code>, <code>MemorySwapMax=</code> and how they map to cgroup v2.</span></span>
</a>
<a class="link-card" href="https://docs.kernel.org/admin-guide/cgroup-v2.html" target="_blank" rel="noopener">
  <span class="lc-ico">🐧</span>
  <span class="lc-body"><span class="lc-title">Kernel docs — Control Group v2</span><span class="lc-sub"><code>memory.max</code>, <code>memory.swap.max</code> and what happens when a cgroup hits its limit.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Code Lab — Linux &amp; Bash</span><span class="lc-sub">Graded exercises for the course; do the diagnosis tasks, then take the final exam.</span></span>
</a>
<p class="note-ct"><strong>The habit to take away:</strong> when something breaks, run the first command before you form an opinion — and when you fix it, add the prevention to the repo before you close the laptop.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.4</span>
<h2>Tuần đầu trên production: tám sự cố kinh điển, dựng lại thật</h2>
<p class="lead">Máy chủ đã lên, deploy tự quay lui, các timer đã chạy. Rồi đời thật bắt đầu. Bài này là tuần đầu của máy chủ phòng khám, như nó thường diễn ra với mọi nhóm mới: tám sự cố gần như ai cũng gặp, cái nào cũng được dựng lại THẬT trên máy chủ tập luyện — không kể theo trí nhớ. Với mỗi cái: <strong>triệu chứng</strong> bạn thực sự thấy, <strong>lệnh đầu tiên</strong> biến một phỏng đoán thành một sự thật, <strong>cách cứu</strong> cho đêm nay, <strong>cách phòng</strong> cho tháng sau, và <strong>bài</strong> của khoá nơi ý tưởng gốc nằm. Đọc một lượt bây giờ; quay lại đây lần đầu tiên máy chủ của chính bạn trở chứng.</p>

<h3>Đọc một sự cố thế nào</h3>
${slide('lx-16', 22, '8 sự cố tuần đầu: triệu chứng → lệnh đầu tiên')}
<p>Chương 12 đã cho bạn phương pháp: nhìn trước khi đụng, mỗi lần một câu hỏi, ghi lại mình đã làm gì. Bảng dưới là bản một trang cho máy chủ này. Để ý rằng lệnh đầu tiên gần như không bao giờ là "khởi động lại nó": khởi động lại xoá sạch bằng chứng (tiến trình đang giữ file đã xoá, thông điệp OOM của nhân, tiến trình đang giữ cổng) và thường đưa vấn đề quay lại ngay.</p>
<table>
<tr><th>#</th><th>Triệu chứng</th><th>Lệnh đầu tiên</th><th>Học ở</th></tr>
<tr><td>1</td><td>đĩa 100%, xoá file lớn mà không trả chỗ</td><td><code>lsof -a +L1 /var/log/datlich</code></td><td>10.1 · 12.3</td></tr>
<tr><td>2</td><td><code>No space left on device</code> dù <code>df -h</code> còn trống</td><td><code>df -i</code> · <code>du --inodes</code></td><td>10.1 · 14.3</td></tr>
<tr><td>3</td><td>502 một lúc rồi app tự về; <code>status=9/KILL</code></td><td><code>journalctl -u datlich</code> · <code>journalctl -k -g oom</code></td><td>5.2 · 11.1 · 14.1</td></tr>
<tr><td>4</td><td>app không chịu lên: <code>Errno 98</code></td><td><code>ss -ltnp 'sport = :8080'</code></td><td>9.1 · 12.2</td></tr>
<tr><td>5</td><td>đọc được, ghi thì 502: <code>readonly database</code></td><td><code>namei -l</code> · <code>sudo -u datlich test -w</code></td><td>4.5 · 14.4</td></tr>
<tr><td>6</td><td>việc 07:30 chạy lúc 14:30</td><td><code>timedatectl</code> · <code>systemd-analyze calendar</code></td><td>11.2</td></tr>
<tr><td>7</td><td><code>$'\\r': command not found</code> / <code>env: use -[v]S</code>, mã 127</td><td><code>file</code> · <code>cat -A</code></td><td>7.1 · 12.4 · 15.3</td></tr>
<tr><td>8</td><td>sửa cấu hình "xong rồi" mà chẳng có gì đổi</td><td><code>sshd -T</code> · <code>ls -i</code> · <code>systemctl show</code></td><td>2.4 · 11.3</td></tr>
</table>

<h3>Sự cố 1 — đĩa đầy, và rm không trả lại gì</h3>
${slide('lx-16', 23, 'Đĩa đầy mà rm không trả chỗ: lsof -a +L1')}
<p><strong>Dựng lại:</strong> <code>/var/log/datlich</code> được gắn thành một <code>tmpfs</code> 40 MB để làm đầy cho an toàn và nhanh, và một worker nhỏ "nhắc lịch hẹn" được chạy với log DEBUG quên tắt — nó ghi 100 KB mỗi lần vào <code>nhac-lich-debug.log</code> và giữ file mở suốt đời, như rất nhiều worker thật.</p>
<p><strong>Triệu chứng:</strong> bộ giám sát ở Bài 16.3 báo động, log của chính worker nói nó không ghi được.</p>
<div class="out">$ sudo /opt/datlich/ops/giam-sat.sh
giám sát: 1 vấn đề — đĩa /var/log/datlich đầy 100%
$ df -h /var/log/datlich
Filesystem      Size  Used Avail Use% Mounted on
tmpfs            40M   40M     0 100% /var/log/datlich
$ sudo du -xah /var/log/datlich | sort -h | tail -n 3
4.0K	/var/log/datlich/deploy.log
40M	/var/log/datlich
40M	/var/log/datlich/nhac-lich-debug.log
$ sudo rm /var/log/datlich/nhac-lich-debug.log; df -h /var/log/datlich
Filesystem      Size  Used Avail Use% Mounted on
tmpfs            40M   40M     0 100% /var/log/datlich
$ journalctl -u datlich-nhaclich -n 1 -o cat
ghi log hỏng: [Errno 28] No space left on device</div>
<p><code>rm</code> xoá cái <em>tên</em>. Dữ liệu thuộc về inode, và một inode chỉ được giải phóng khi không còn tên nào <em>và</em> không còn file descriptor nào đang mở trỏ vào nó (Bài 2.4). Worker vẫn đang mở nó, nên 40 MB vẫn bị chiếm, vô hình với <code>du</code> (thứ đi theo tên) nhưng được <code>df</code> đếm (thứ hỏi thẳng hệ thống file).</p>
<p><strong>Lệnh đầu tiên:</strong> liệt kê các file đang mở có số liên kết dưới 1 — đã xoá mà vẫn mở:</p>
<div class="out">$ sudo lsof +L1 /var/log/datlich
COMMAND  PID    USER   FD   TYPE DEVICE SIZE/OFF NLINK NODE NAME
python3 3636 datlich    3w   REG   0,59      456     1    4 /var/log/datlich/access.log
python3 3647 datlich    3w   REG   0,59 41918464     0    8 /var/log/datlich/nhac-lich-debug.log (deleted)</div>
<p>Sao <code>access.log</code> lại hiện ra — NLINK của nó là 1 cơ mà? Vì mặc định lsof <strong>HOẶC</strong> các điều kiện chọn: "file có ít hơn 1 liên kết" <em>hoặc</em> "file nằm trên hệ thống file này". <code>-a</code> biến nó thành VÀ. Chúng tôi dựng lại sự cố thêm một lần để cho thấy lệnh chính xác và cách cứu:</p>
<div class="out">$ sudo lsof -a +L1 /var/log/datlich
COMMAND  PID    USER   FD   TYPE DEVICE SIZE/OFF NLINK NODE NAME
python3 3775 datlich    3w   REG   0,59 41918464     0    9 /var/log/datlich/nhac-lich-debug.log (deleted)
$ ls -l /proc/3775/fd/3
… /proc/3775/fd/3 -&gt; /var/log/datlich/nhac-lich-debug.log (deleted)
$ sudo truncate -s 0 /proc/3775/fd/3
$ df -h /var/log/datlich
Filesystem      Size  Used Avail Use% Mounted on
tmpfs            40M   24K   40M   1% /var/log/datlich
$ sudo systemctl stop datlich-nhaclich        # rồi tắt DEBUG trước khi bật lại
$ sudo /opt/datlich/ops/giam-sat.sh
giám sát: 0 vấn đề — OK</div>
<ul>
<li><strong>Cứu:</strong> khởi động lại (hoặc dừng) tiến trình đang giữ file — hoặc, nếu nó buộc phải chạy tiếp, cắt cụt file đã xoá qua <code>/proc/PID/fd/N</code>: chỗ trống về ngay lập tức và tiến trình cứ ghi tiếp vào một file rỗng.</li>
<li><strong>Phòng:</strong> file log nào cũng có luật logrotate (Bài 16.3); không bao giờ để log DEBUG trên production; bộ giám sát kiểm dung lượng đĩa; log dài hạn đưa vào journal, thứ có trần dung lượng riêng (<code>SystemMaxUse=</code>, Bài 10.3). VPS thật của nhóm từng chết đúng kiểu này khi 7,6 GB cache build làm đầy cái đĩa chứa CSDL.</li>
<li><strong>Học ở:</strong> 10.1 (<code>df</code>/<code>du</code>/<code>lsof +L1</code>), 12.3 (đĩa đầy giữa lúc sự cố), 2.4 (inode).</li>
</ul>

<h3>Sự cố 2 — "No space left on device" khi còn trống 93 MB</h3>
${slide('lx-16', 24, 'Còn 93M trống mà không tạo nổi file: hết inode')}
<p><strong>Dựng lại:</strong> một tính năng mới ghi một file PDF nhỏ "phiếu hẹn" cho mỗi lượt khám vào <code>/var/cache/datlich/phieu/</code> và không ai xoá chúng. Thư mục cache là một <code>tmpfs</code> chứa được 100 MB nhưng chỉ có 2 000 inode, để giả lập một năm khám bệnh trong một giây.</p>
<div class="out">$ sudo -u datlich touch /var/cache/datlich/phieu/moi.pdf
touch: cannot touch '/var/cache/datlich/phieu/moi.pdf': No space left on device
$ df -h /var/cache/datlich
Filesystem      Size  Used Avail Use% Mounted on
tmpfs           100M  7.9M   93M   8% /var/cache/datlich
$ df -i /var/cache/datlich
Filesystem     Inodes IUsed IFree IUse% Mounted on
tmpfs            2000  2000     0  100% /var/cache/datlich
$ sudo du --inodes -xd1 /var/cache/datlich | sort -n | tail -n 2
1999	/var/cache/datlich/phieu
2000	/var/cache/datlich
$ sudo find /var/cache/datlich -xdev -type f | cut -d/ -f1-5 | sort | uniq -c | sort -rn | head -n 3
   1998 /var/cache/datlich/phieu</div>
<p>File nào cũng cần một inode, dù nhỏ tới đâu; một hệ thống file có số inode cố định (ext4 chốt nó lúc <code>mkfs</code>). Ở đây "hết chỗ" nghĩa là "hết inode". <code>df -h</code> trả lời sai câu hỏi; <code>df -i</code> trả lời đúng; <code>du --inodes</code> (GNU) hoặc ống <code>find | cut | uniq -c</code> (chạy được ở mọi nơi) tìm ra thư mục chứa hàng triệu file tí hon — phiên đăng nhập, mục cache, hàng đợi thư là những nghi phạm quen thuộc.</p>
<p><strong>Cứu:</strong> xoá những gì xoá được an toàn (ở đây: mọi phiếu trong cache — sinh lại được). <strong>Phòng:</strong> để systemd dọn cache. Một luật một dòng trong <code>/etc/tmpfiles.d/</code> được <code>systemd-tmpfiles-clean.timer</code> áp dụng mỗi ngày — timer này vốn đã chạy sẵn trên mọi máy Ubuntu:</p>
<div class="out">$ cat /etc/tmpfiles.d/datlich.conf
# loại  đường dẫn                 quyền chủ    nhóm    tuổi
d      /var/cache/datlich/phieu  0750  datlich datlich 7d
# thử nhanh: cùng luật với tuổi 10 giây, 11 giây sau
$ sudo systemd-tmpfiles --clean /tmp/thu-10s.conf; df -i /var/cache/datlich
Filesystem     Inodes IUsed IFree IUse% Mounted on
tmpfs            2000     2  1998    1% /var/cache/datlich
$ systemctl list-timers systemd-tmpfiles-clean.timer
NEXT                            LEFT LAST PASSED UNIT                         ACTIVATES
Mon 2026-09-28 17:11:36 UTC 1min 22s -         - systemd-tmpfiles-clean.timer systemd-tmpfiles-clean.service</div>
<p><code>d</code> = "tạo thư mục này nếu chưa có, và dọn các mục cũ hơn tuổi quy định"; <code>7d</code> = bảy ngày. <strong>Học ở:</strong> 10.1 (<code>df -i</code>), 14.3 (inode và hệ thống file), và bộ giám sát ở 16.3, thứ kiểm <code>ipcent</code> bên cạnh <code>pcent</code> chính vì lý do này.</p>

<h3>Sự cố 3 — hết bộ nhớ: cái trần không phải là trần</h3>
${slide('lx-16', 25, 'OOM: MemoryMax chỉ là trần thật khi tắt swap')}
<p><strong>Dựng lại:</strong> một endpoint "xuất báo cáo" dựng cả file trong RAM rồi mới gửi đi (<code>/api/xuat?n=300</code> = 300 MB). Unit đặt <code>MemoryMax=150M</code>. Điều bất ngờ đầu tiên tới trước cả khi có gì sập:</p>
<div class="out">$ curl -s -w ' → HTTP %{http_code}\\n' "localhost/api/xuat?n=300"
{"bytes": 314572800} → HTTP 200
$ systemctl show datlich -p NRestarts -p MemoryPeak -p MemoryMax
NRestarts=0
MemoryPeak=157286400
MemoryMax=157286400
$ systemctl show datlich -p MemorySwapPeak -p MemorySwapCurrent
MemorySwapCurrent=13062144
MemorySwapPeak=175337472</div>
<p>Một chuỗi 300 MB trong một cái trần 150 MB — và yêu cầu vẫn thành công. Đỉnh nằm đúng ở giới hạn, còn 167 MB đi ra <strong>swap</strong>. <code>MemoryMax=</code> giới hạn RAM; khi máy có swap, nhân dồn các trang của cgroup ra swap thay vì giết gì cả, và app chỉ trở nên rất chậm. Muốn một cái trần thật thì cần thêm <code>MemorySwapMax=0</code>. Sau khi thêm (<code>daemon-reload</code>, khởi động lại):</p>
<div class="out">$ curl -s -w ' → HTTP %{http_code}\\n' "localhost/api/xuat?n=300"
&lt;html&gt;
&lt;head&gt;&lt;title&gt;502 Bad Gateway&lt;/title&gt;&lt;/head&gt;
…
 → HTTP 502
$ journalctl -u datlich -n 7 -o short | cut -c17-
clinic-vps python3[3991]: datlich 1.1.0 (bản mới) nghe cổng 8080, CSDL /var/lib/datlich/datlich.db
clinic-vps systemd[1]: datlich.service: A process of this unit has been killed by the OOM killer.
clinic-vps systemd[1]: datlich.service: Main process exited, code=killed, status=9/KILL
clinic-vps systemd[1]: datlich.service: Failed with result 'oom-kill'.
clinic-vps systemd[1]: datlich.service: Scheduled restart job, restart counter is at 1.
clinic-vps systemd[1]: Started datlich.service - Đặt lịch phòng khám (API).
clinic-vps python3[3999]: datlich 1.1.0 (bản mới) nghe cổng 8080, CSDL /var/lib/datlich/datlich.db
$ journalctl -k --case-sensitive=no -g oom -n 3 -o cat | cut -c1-120
Memory cgroup out of memory: Killed process 10562 (python3) total-vm:408772kB, anon-rss:153096kB, file-rss:10504kB, shme
oom-kill:constraint=CONSTRAINT_MEMCG,nodemask=(null),cpuset=90cf60a5970836974396d6fbafa60df08f95bd0ed627ae19ab1acb83e7dc
[  pid  ]   uid  tgid total_vm      rss rss_anon rss_file rss_shmem pgtables_bytes swapents oom_score_adj name
$ curl -s localhost/health
{"status": "ok", "version": "1.1.0"}</div>
<p>Đọc thế nào: <code>status=9/KILL</code> và <code>Result 'oom-kill'</code> — tiến trình nhận SIGKILL từ OOM killer (bộ diệt khi hết bộ nhớ) của nhân (một tiến trình bị tín hiệu 9 giết là thứ Docker báo thành mã 137 = 128 + 9, Bài 12.2). <code>constraint=CONSTRAINT_MEMCG</code> nói <em>vì sao</em>: giới hạn của MỘT cgroup bộ nhớ bị chạm, không phải cả máy hết RAM — các dịch vụ khác chưa bao giờ gặp nguy. Nhân in PID 10562 còn systemd in 3991: cùng một tiến trình nhìn từ namespace PID của máy chủ và của container (Bài 14.1). Rồi <code>Restart=on-failure</code> đưa app về sau hai giây; người bấm xuất báo cáo nhận 502, mọi người khác gần như không nhận ra.</p>
<ul>
<li><strong>Cứu:</strong> không cần gì — unit tự lành. Xem <code>NRestarts</code> để biết chuyện này xảy ra thường xuyên tới đâu.</li>
<li><strong>Phòng:</strong> sửa mã (xuất theo từng khúc, hoặc giới hạn <code>n</code>); giữ <code>MemoryMax=</code> + <code>MemorySwapMax=0</code> để một yêu cầu tồi không làm chậm cả máy; cân nhắc <code>MemoryHigh=</code> thấp hơn trần một chút, thứ bóp chậm trước khi giết.</li>
<li><strong>Học ở:</strong> 5.2 (<code>free</code>, <code>available</code>), 11.1 (<code>Restart=</code>, giới hạn), 12.3 (sức ép bộ nhớ), 14.1 (cgroup, OOM killer).</li>
</ul>

<h3>Sự cố 4 — "Address already in use": ai đó đã chiếm cổng</h3>
${slide('lx-16', 26, 'Cổng bị chiếm · file của root: hai kiểu “app chết”')}
<p><strong>Dựng lại:</strong> một bạn cùng nhóm "thử nhanh" thứ gì đó bằng <code>python3 -m http.server 8080</code> dưới quyền root trong một phiên chạy ngầm rồi quên mất. Sau đó app được khởi động lại.</p>
<div class="out">$ sudo systemctl start datlich; sleep 12; systemctl is-active datlich
failed
$ journalctl -u datlich -o cat --since -20s | grep -m1 -E "Errno|Error"
OSError: [Errno 98] Address already in use
$ journalctl -u datlich --since -20s -o cat | tail -n 3
datlich.service: Start request repeated too quickly.
datlich.service: Failed with result 'exit-code'.
Failed to start datlich.service - Đặt lịch phòng khám (API).
$ curl -s -o /dev/null -w "%{http_code}\\n" localhost/health
404</div>
<p>Hai lớp triệu chứng: app chết lặp lại tới khi giới hạn khởi động chặn nó (<code>Restart=</code> không chữa được một cổng đã bị chiếm), và nginx vẫn nhận được câu trả lời ở 8080 — từ nhầm chương trình, một trang 404. Một health check chỉ hỏi "cổng 8080 có mở không?" sẽ bảo mọi thứ ổn; phép kiểm <code>"status": "ok"</code> của script deploy thì không.</p>
<p><strong>Lệnh đầu tiên:</strong> ai đang nghe?</p>
<div class="out">$ sudo ss -ltnp "sport = :8080"
State  Recv-Q Send-Q Local Address:Port Peer Address:PortProcess
LISTEN 0      5          127.0.0.1:8080      0.0.0.0:*    users:(("python3",pid=4020,fd=3))
$ sudo lsof -iTCP:8080 -sTCP:LISTEN
COMMAND  PID USER   FD   TYPE  DEVICE SIZE/OFF NODE NAME
python3 4020 root    3u  IPv4 3569305      0t0  TCP localhost:http-alt (LISTEN)
$ ps -o pid,user,etime,unit,cmd -p $(sudo lsof -t -iTCP:8080 -sTCP:LISTEN)
    PID USER         ELAPSED UNIT                            CMD
   4020 root           00:13 thu-nhanh.service               /usr/bin/python3 -m http.server 8080 --bind 127.0.0.1 --directory /tmp
$ sudo systemctl stop thu-nhanh     # hoặc: sudo fuser -k 8080/tcp
$ sudo systemctl reset-failed datlich; sudo systemctl start datlich
$ curl -s localhost/health
{"status": "ok", "version": "1.1.0"}</div>
<p><code>ps -o unit</code> cho biết tiến trình thuộc unit systemd nào — ở đây nó cho bạn biết nên hỏi ai. Tìm và dừng theo <em>cổng</em>, đừng theo tên: <code>pkill -f "http.server"</code> là đoán, <code>lsof -t -iTCP:8080 -sTCP:LISTEN</code> là biết (nhóm từng có <code>pkill -f "next start"</code> không khớp gì vì tiến trình đã tự đổi tên thành <code>next-server</code>). <strong>Phòng:</strong> không bao giờ thử trên cổng production; cho server thử nghiệm dải cổng riêng; phép kiểm health đi qua nginx của bộ giám sát bắt được nó trong năm phút. <strong>Học ở:</strong> 9.1 (<code>ss</code>), 12.2 (công thức 2, "address already in use"), 5.3 (tín hiệu).</p>

<h3>Sự cố 5 — đọc được, ghi thì hỏng: một file thuộc về root</h3>
<p><strong>Dựng lại:</strong> ai đó khôi phục bản sao lưu đêm qua "cho nhanh": <code>zcat</code> ra <code>/tmp</code>, rồi <code>sudo mv</code> đè lên CSDL đang dùng.</p>
<div class="out">$ zcat /var/backups/datlich/datlich-20260928-170611.db.gz &gt; /tmp/khoi-phuc.db
$ sudo systemctl stop datlich; sudo mv /tmp/khoi-phuc.db /var/lib/datlich/datlich.db; sudo systemctl start datlich
$ curl -s localhost/api/lich | head -c 60
[{"id": 1, "ten": "Nguyễn Văn A", "gio": "2026-10-01 08:3
$ curl -s -w " → HTTP %{http_code}\\n" -XPOST localhost/api/lich -d '{"ten":"Phạm D","gio":"2026-10-03 14:00"}'
&lt;html&gt;
&lt;head&gt;&lt;title&gt;502 Bad Gateway&lt;/title&gt;&lt;/head&gt;
…
 → HTTP 502
$ journalctl -u datlich -n 2 -o cat
sqlite3.OperationalError: attempt to write a readonly database
----------------------------------------
$ ls -l /var/lib/datlich
total 8
-rw-r--r-- 1 root root 8192 Sep 28 17:11 datlich.db
$ namei -l /var/lib/datlich/datlich.db
f: /var/lib/datlich/datlich.db
drwxr-xr-x root    root    /
drwxr-xr-x root    root    var
drwxr-xr-x root    root    lib
drwxr-x--- datlich datlich datlich
-rw-r--r-- root    root    datlich.db
$ sudo -u datlich test -w /var/lib/datlich/datlich.db &amp;&amp; echo ghi-được || echo KHÔNG-ghi-được
KHÔNG-ghi-được
$ sudo chown datlich:datlich /var/lib/datlich/datlich.db; sudo chmod 640 /var/lib/datlich/datlich.db
$ curl -s -w " → HTTP %{http_code}\\n" -XPOST localhost/api/lich -d '{"ten":"Phạm D","gio":"2026-10-03 14:00"}'
{"id": 3, "ten": "Phạm D", "gio": "2026-10-03 14:00"} → HTTP 201</div>
<p><code>mv</code> giữ nguyên chủ của file được chuyển, và file do shell của root tạo thì thuộc root (với umask 022: quyền 644). App chạy dưới tên <code>datlich</code> đọc được file 644 nhưng không ghi được. <code>namei -l</code> cho thấy từng bậc của đường dẫn kèm chủ và quyền — chỗ đầu tiên phải nhìn cho mọi "Permission denied" (Bài 4.5). <code>sudo -u datlich test -w</code> hỏi câu đó <em>dưới danh nghĩa app</em>, cách duy nhất để chắc. Để ý bài học thứ hai trong output đó: lịch hẹn mới nhận <code>id 3</code> — lịch hẹn tạo SAU lúc chụp bản sao lưu (Lê C) đã mất. Đó là RPO của bạn (recovery point objective — mức dữ liệu có thể mất): sao lưu mỗi đêm có thể mất tới một ngày dữ liệu.</p>
<p><strong>SELinux thêm một ổ khoá thứ hai trên Fedora/RHEL.</strong> Ở đó, kể cả đúng chủ và đúng quyền vẫn có thể bị từ chối, vì mỗi file còn mang một <em>nhãn</em> bảo mật, và một file chuyển bằng <code>mv</code> giữ nhãn của nơi nó được tạo. Chỉ đọc trên máy Fedora 44 (enforcing):</p>
<div class="out">$ getenforce
Enforcing
$ ls -Z trang.html              # một file tạo trong thư mục nhà
unconfined_u:object_r:user_home_t:s0 trang.html
$ matchpathcon /var/www/html/trang.html /opt/datlich/app.py /var/lib/datlich/datlich.db
/var/www/html/trang.html	system_u:object_r:httpd_sys_content_t:s0
/opt/datlich/app.py	system_u:object_r:usr_t:s0
/var/lib/datlich/datlich.db	system_u:object_r:var_lib_t:s0</div>
<p>Một trang tạo trong <code>~</code> rồi <code>mv</code> vào <code>/var/www/html</code> giữ nhãn <code>user_home_t</code>, trong khi máy chủ web chỉ được đọc <code>httpd_sys_content_t</code> — "Permission denied" với một quyền 644 hoàn hảo. <code>restorecon -v FILE</code> đặt lại nhãn cho đúng thứ <code>matchpathcon</code> mong đợi; <code>ausearch -m avc</code> và <code>audit2why</code> giải thích một lần bị từ chối (Bài 14.4). Ubuntu dùng AppArmor thay vào đó và không gắn nhãn file kiểu này. <strong>Phòng:</strong> khôi phục bằng <code>install -o datlich -g datlich -m 640 NGUỒN ĐÍCH</code> hoặc chạy việc khôi phục dưới tên người dùng của app; trên hệ SELinux thì dùng <code>cp</code> (nhận nhãn của thư mục đích) hoặc <code>restorecon</code> sau đó.</p>

<h3>Sự cố 6 — việc 07:30 chạy lúc 14:30</h3>
${slide('lx-16', 27, 'Múi giờ · CRLF · config không ăn: ba lỗi “im lặng”')}
<p>Một bạn thêm báo cáo sáng vào cron đúng như mọi bài hướng dẫn: <code>30 7 * * *</code>. Đồng hồ máy chủ là UTC, nên cron chạy nó lúc 07:30 UTC — 14:30 ở Việt Nam. Có người đọc trên mạng rằng <code>CRON_TZ=</code> sửa được. Chúng tôi thử cả hai cùng lúc: hai dòng đặt trước hai phút, một dòng theo UTC, một dòng "theo giờ Việt Nam" dưới <code>CRON_TZ</code>:</p>
<div class="out">$ cat /etc/cron.d/thu-utc /etc/cron.d/thu-crontz
14 17 * * * root echo "dòng giờ UTC chạy lúc $(date +\\%T) UTC" &gt;&gt; /tmp/cron.log
CRON_TZ=Asia/Ho_Chi_Minh
14 00 * * * root echo "dòng CRON_TZ chạy lúc $(date +\\%T) UTC" &gt;&gt; /tmp/cron.log
$ date                                         # hai phút sau
Mon Sep 28 17:14:29 UTC 2026
$ cat /tmp/cron.log
dòng giờ UTC chạy lúc 17:14:01 UTC
$ timedatectl | grep zone
                Time zone: Etc/UTC (UTC, +0000)
$ dpkg -s cron | grep Version
Version: 3.0pl1-184ubuntu2</div>
<p>Chỉ dòng UTC chạy. 17:14 UTC <em>chính là</em> 00:14 ở Việt Nam, nên nếu <code>CRON_TZ</code> hoạt động thì nó đã nổ cùng phút đó — nó không nổ. Cron mặc định của Ubuntu (cron "vixie" của Debian, 3.0pl1) coi <code>CRON_TZ</code> là một biến môi trường bình thường; đó là tính năng của <em>cronie</em>, cron của Fedora/RHEL — vài trang man trên mạng có mô tả nó, và đó chính là lý do người ta bị dẫn sai (Bài 11.2 đã đo y như vậy). Thêm hai lưu ý: <code>%</code> là ký tự đặc biệt trong một dòng crontab và phải viết <code>\\%</code>; và đừng thử <code>timedatectl set-timezone</code> trong container để "kiểm" — trên container tập luyện, lệnh đó làm đồng hồ UTC của container nhảy lùi bảy tiếng trong vài giây, vì container dùng chung đồng hồ của nhân với máy chủ Docker. Trên VPS thật thì an toàn.</p>
<p><strong>Cứu và phòng</strong>, tốt nhất trước: (1) dùng timer của systemd với múi giờ ngay trong biểu thức lịch, <code>OnCalendar=*-*-* 07:30:00 Asia/Ho_Chi_Minh</code>, và kiểm bằng <code>systemd-analyze calendar</code> (Bài 16.3); (2) giữ cron nhưng viết giờ UTC kèm chú thích (<code>30 0 * * *  # 07:30 VN</code>); (3) đổi múi giờ của máy chủ bằng <code>timedatectl set-timezone</code> rồi <code>systemctl restart cron</code>, vì cron đọc múi giờ lúc khởi động — chấp nhận rằng log khi đó lẫn hai múi giờ với các máy khác. <strong>Học ở:</strong> 11.2, và chuyện UTC với +07 của container ở Bài 10.3.</p>

<h3>Sự cố 7 — một script được lưu trên Windows</h3>
<p>Một bạn dùng Windows sửa một lỗi chính tả trong <code>giam-sat.sh</code> và commit nó với kiểu xuống dòng CRLF. Bootstrap thấy file khác nên cài nó (nó so từng byte, đúng như thiết kế). Từ đó bộ giám sát hỏng năm phút một lần — lặng lẽ, vì bộ giám sát <em>chính là</em> thứ lo việc báo hỏng:</p>
<div class="out">$ sudo ./ops/bootstrap.sh ~/.ssh/id_ed25519.pub | grep →
  → cài /opt/datlich/ops/giam-sat.sh
$ sudo systemctl start datlich-giamsat.service; echo "mã=$?"
Job for datlich-giamsat.service failed because the control process exited with error code.
See "systemctl status datlich-giamsat.service" and "journalctl -xeu datlich-giamsat.service" for details.
mã=1
$ journalctl -u datlich-giamsat -n 4 -o cat
/usr/bin/env: use -[v]S to pass options in shebang lines
datlich-giamsat.service: Main process exited, code=exited, status=127/n/a
datlich-giamsat.service: Failed with result 'exit-code'.
Failed to start datlich-giamsat.service - Giám sát máy chủ đặt lịch.
$ bash ops/giam-sat.sh 2&gt;&amp;1 | head -n 3
ops/giam-sat.sh: line 8: $'\\r': command not found
ops/giam-sat.sh: line 9: syntax error near unexpected token &#96;$'{\\r''
ops/giam-sat.sh: line 9: &#96;bao() {'</div>
<p>Hai bộ mặt của cùng một lỗi. Chạy trực tiếp, nhân đọc dòng shebang <code>#!/usr/bin/env bash\\r</code> và chạy <code>env</code> với đối số <code>bash\\r</code>; <code>env</code> của coreutils 9.4 thấy ký tự lạ và in một gợi ý khó hiểu về <code>-S</code> — không phải câu "bash\\r: No such file or directory" mà các bài viết cũ hay chụp. Chạy qua <code>bash</code>, dòng nào cũng kết thúc bằng một <code>\\r</code> vô hình. <strong>Lệnh đầu tiên:</strong></p>
<div class="out">$ file ops/giam-sat.sh
ops/giam-sat.sh: Bourne-Again shell script, Unicode text, UTF-8 text executable, with CRLF line terminators
$ head -n 1 ops/giam-sat.sh | cat -A
#!/usr/bin/env bash^M$
$ grep -c $'\\r' ops/giam-sat.sh
41
$ LC_ALL=C.UTF-8 shellcheck ops/giam-sat.sh | head -n 4

In ops/giam-sat.sh line 1:
#!/usr/bin/env bash
                   ^-- SC1017 (error): Literal carriage return. Run script through tr -d '\\r' .
$ dos2unix ops/giam-sat.sh
dos2unix: converting file ops/giam-sat.sh to Unix format...
$ file ops/giam-sat.sh
ops/giam-sat.sh: Bourne-Again shell script, Unicode text, UTF-8 text executable</div>
<p><code>cat -A</code> hiện <code>^M$</code>: một ký tự về đầu dòng (carriage return) trước mỗi lần xuống dòng. <code>dos2unix</code> (hoặc <code>sed -i 's/\\r$//'</code>) sửa file — sau đó nó giống hệt bản gốc từng byte. <strong>Phòng</strong> phải nằm trong kho mã, không nằm trong trí nhớ của ai: một dòng <code>.gitattributes</code> <code>*.sh text eol=lf</code> bắt Git ghi LF trên mọi máy (Bài 15.3), và ShellCheck trong CI báo hỏng SC1017 trước khi file kịp lên máy chủ. Và cho bộ giám sát một cảnh báo <code>OnFailure=</code> (Bài 16.3): con chó canh cửa không được phép chết lặng lẽ. <strong>Học ở:</strong> 7.1, 12.4, 15.3.</p>

<h3>Sự cố 8 — "Tôi sửa cấu hình rồi mà chẳng có gì đổi"</h3>
<p>Ba biến thể của một bài học: <em>đã ghi</em> không phải là <em>đã có hiệu lực</em>.</p>
<p><strong>8a — SSH vẫn nhận mật khẩu.</strong> Trên một VPS cloud, cloud-init đã ghi sẵn <code>50-cloud-init.conf</code>. Một bạn siết SSH bằng một file mới tên <code>70-hardening.conf</code>; <code>sshd -t</code> hài lòng, nạp lại thành công:</p>
<div class="out">$ ls /etc/ssh/sshd_config.d/
50-cloud-init.conf
70-hardening.conf
$ sudo sshd -t &amp;&amp; sudo systemctl reload ssh; echo mã=$?
mã=0
$ grep -h PasswordAuthentication /etc/ssh/sshd_config.d/*
PasswordAuthentication yes
PasswordAuthentication no
$ sudo sshd -T | grep ^passwordauthentication
passwordauthentication yes
$ grep -n Include /etc/ssh/sshd_config
12:Include /etc/ssh/sshd_config.d/*.conf
# với 01-datlich.conf của chúng ta thay cho 70-hardening.conf:
$ ls /etc/ssh/sshd_config.d/; sudo sshd -T | grep ^passwordauthentication
01-datlich.conf
50-cloud-init.conf
passwordauthentication no</div>
<p>Glob được đọc theo thứ tự chữ cái và giá trị <em>đầu tiên</em> thắng, nên <code>50-</code> thắng <code>70-</code>. Chỉ <code>sshd -T</code> nói thật; <code>cat</code> cái file vừa ghi chỉ cho bạn biết bạn đã ghi gì. (Chuyện này đã xảy ra với VPS thật của nhóm; Bài 11.3.)</p>
<p><strong>8b — một file bind-mount giữ nội dung cũ.</strong> Docker gắn một file cấu hình đơn vào container bằng <code>-v host.conf:/etc/nginx/nginx.conf</code>; cơ chế tương ứng của nhân là bind mount, dựng lại ở đây bằng <code>mount --bind</code>:</p>
<div class="out">$ sed -i s/512/4096/ /srv/repo/nginx.conf
$ cat /srv/repo/nginx.conf /srv/container-thay/nginx.conf
worker_connections 4096;
worker_connections 512;
$ ls -i /srv/repo/nginx.conf /srv/container-thay/nginx.conf
31522 /srv/container-thay/nginx.conf
31524 /srv/repo/nginx.conf
# cách đúng: ghi ĐÈ TẠI CHỖ, giữ inode
$ sed s/512/4096/ /srv/repo/nginx.conf &gt; /tmp/moi; cat /tmp/moi &gt; /srv/repo/nginx.conf
$ cat /srv/container-thay/nginx.conf; ls -i /srv/repo/nginx.conf /srv/container-thay/nginx.conf
worker_connections 4096;
31524 /srv/container-thay/nginx.conf
31524 /srv/repo/nginx.conf</div>
<p>Bind mount một file đơn ghim vào một <strong>inode</strong>, không vào một đường dẫn. <code>sed -i</code>, <code>mv</code>, nhiều trình soạn thảo và <code>rsync</code> đều ghi một file mới rồi đổi tên đè lên file cũ — một inode mới mà mount không bao giờ thấy. <code>cat mới &gt; file</code> ghi vào chính inode đang có. Kiểm từ <em>bên trong</em> (phía container), đừng bao giờ kiểm từ phía bạn vừa sửa. (Nhóm từng mất hai lần deploy vì chuyện này với nginx; Bài 2.4 giải thích inode.)</p>
<p><strong>8c — sửa unit, quên <code>daemon-reload</code>.</strong></p>
<div class="out">$ sudo sed -i "s/^MemoryMax=150M/MemoryMax=200M/" /etc/systemd/system/datlich.service
$ sudo systemctl restart datlich
Warning: The unit file, source configuration file or drop-ins of datlich.service changed on disk. Run 'systemctl daemon-reload' to reload units.
$ systemctl show -p MemoryMax datlich
MemoryMax=157286400</div>
<p>Lần khởi động lại chạy cấu hình systemd đang giữ trong bộ nhớ — vẫn 150 MB — và in một dòng cảnh báo rất dễ trôi mất trong output của một script. <code>systemctl show</code> là <code>sshd -T</code> của systemd. <strong>Phòng cho cả ba:</strong> sau mỗi thay đổi cấu hình, kiểm giá trị <em>đang hiệu lực</em> bằng công cụ của chính chương trình — <code>sshd -T</code>, <code>nginx -T</code>, <code>systemctl show</code>, <code>docker exec … cat</code> — và để script tự làm phép kiểm đó, như bootstrap đang làm.</p>

<h3>Ghi lại: một bản postmortem năm dòng</h3>
<p>Sau mỗi sự cố, dù nhỏ, nhóm viết năm dòng vào <code>SU-CO.md</code> trong kho — không đổ lỗi (blameless), nói về hệ thống chứ không nói về người:</p>
<pre><code class="language-text">## 2026-09-28 — app không lên sau khi restart (Errno 98)
Triệu chứng : 502 cho mọi yêu cầu ~6 phút; giam-sat báo "dịch vụ datlich: failed"
Nguyên nhân : một http.server thử nghiệm bị bỏ quên giữ cổng 8080
Cách cứu     : ss -ltnp → dừng thu-nhanh.service → reset-failed → start
Cách phòng   : không thử trên cổng production; health check kiểm nội dung</code></pre>
<p>Mười bản như thế là tài liệu tốt nhất máy chủ này từng có — và là cách nhanh nhất để trả lời "chuyện này đã từng xảy ra chưa?"</p>

<h3>Chạy thử từng bước: dựng lại bất kỳ sự cố nào một cách an toàn</h3>
<p>Tất cả chạy trong container tập luyện của Bài 16.1. Đừng bao giờ làm đầy một ổ đĩa thật để luyện; gắn một <code>tmpfs</code> nhỏ thay vào.</p>
<pre><code class="language-bash"><span class="tok-comment"># 1 · đĩa đầy — một tmpfs 40 MB đè lên thư mục log (chép lưu log trước)</span>
sudo cp -a /var/log/datlich/. /root/log-cu/
sudo mount -t tmpfs -o size=40m,mode=750,uid=$(id -u datlich),gid=$(id -g datlich) tmpfs /var/log/datlich
sudo cp -a /root/log-cu/. /var/log/datlich/ &amp;&amp; sudo systemctl restart datlich
sudo systemd-run --unit=datlich-nhaclich -p User=datlich python3 /opt/datlich/nhac-lich.py
<span class="tok-comment"># 2 · inode — một tmpfs có ít inode</span>
sudo install -d -o datlich -g datlich -m 750 /var/cache/datlich
sudo mount -t tmpfs -o size=100m,nr_inodes=2000,mode=750,uid=$(id -u datlich),gid=$(id -g datlich) tmpfs /var/cache/datlich
<span class="tok-comment"># 3 · OOM — thêm MemorySwapMax=0, daemon-reload, khởi động lại, rồi:</span>
curl -s "localhost/api/xuat?n=300"
<span class="tok-comment"># 4 · cổng bị chiếm</span>
sudo systemd-run --unit=thu-nhanh python3 -m http.server 8080 --bind 127.0.0.1 --directory /tmp
sudo systemctl restart datlich
<span class="tok-comment"># 7 · CRLF</span>
sed -i 's/$/\\r/' ops/giam-sat.sh &amp;&amp; sudo ./ops/bootstrap.sh ~/.ssh/id_ed25519.pub
<span class="tok-comment"># dọn: umount các tmpfs, dừng các unit tạm, trả lại các file</span></code></pre>
<p>(<code>nhac-lich.py</code> dài tám dòng: mở file log một lần, rồi trong một vòng lặp ghi 100 dòng mỗi dòng 1 KB, khi ghi hỏng thì in lỗi và ngủ 5 giây.)</p>

<h3>Trên macOS và WSL khác gì</h3>
<table>
<tr><th>Lệnh đầu tiên</th><th>Linux</th><th>Mac (đo thật)</th><th>WSL2</th></tr>
<tr><td><code>df -i</code></td><td>chỉ các cột inode</td><td>chạy được; <code>df -i</code> của BSD hiện <code>iused ifree %iused</code> cạnh các cột khối (đo trên APFS: <code>ifree</code> 4 206 703 240 — ở đó hiếm khi là vấn đề)</td><td>như Linux</td></tr>
<tr><td><code>lsof -a +L1</code></td><td>có</td><td>có <code>/usr/sbin/lsof</code>, cùng các cờ</td><td>có</td></tr>
<tr><td><code>ss -ltnp</code></td><td>có</td><td>không có → <code>lsof -iTCP -sTCP:LISTEN -nP</code></td><td>có</td></tr>
<tr><td><code>namei -l</code></td><td>có (util-linux)</td><td>không có → <code>ls -ld</code> từng bậc</td><td>có</td></tr>
<tr><td><code>fuser -k 8080/tcp</code></td><td>psmisc</td><td>có <code>/usr/bin/fuser</code>, nhưng <code>fuser 8080/tcp</code> in <code>'8080/tcp' does not exist</code> — không có dạng theo cổng</td><td>psmisc</td></tr>
<tr><td><code>journalctl</code>, <code>timedatectl</code></td><td>systemd</td><td>không có → <code>/usr/bin/log show --last 10m</code> (trong zsh, <code>log</code> trơn là lệnh có sẵn của shell: <code>log: too many arguments</code>); múi giờ: <code>readlink /etc/localtime</code> → <code>/var/db/timezone/zoneinfo/Asia/Ho_Chi_Minh</code></td><td>khi bật systemd</td></tr>
<tr><td>CRLF</td><td>—</td><td><code>file</code> như nhau (<code>ASCII text, with CRLF line terminators</code>); <code>cat</code> của BSD không có <code>-A</code>, dùng <code>cat -e</code> → <code>a^M$</code></td><td>nguồn quen thuộc: file sửa bên Windows hoặc checkout với <code>core.autocrlf=true</code></td></tr>
</table>

<h3>Khi nào dùng sổ tay này</h3>
<ul>
<li><strong>Luôn bắt đầu từ bảng triệu chứng</strong>; lệnh đầu tiên rẻ, chỉ đọc, và biến một phỏng đoán thành một sự thật.</li>
<li><strong>Đừng khởi động lại trước</strong> trừ khi người dùng đang mất dịch vụ và bạn đã chụp xong bằng chứng (<code>journalctl -u … &gt; /tmp/truoc.txt</code>, <code>lsof</code>, <code>ss</code>).</li>
<li><strong>Sự cố nào cũng kết thúc bằng một cách phòng</strong> nằm trong kho mã: một dòng trong bootstrap, một chỉ thị trong unit, một phép kiểm của bộ giám sát, một <code>.gitattributes</code>. Không thì nó quay lại.</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> một "giờ hỗn loạn" của nhóm — một người phá máy chủ tập luyện, người kia chẩn đoán mà không được biết đã bị làm gì.</p><ol>
<li>Người A chọn hai sự cố trong bài và dựng lại bằng các lệnh ở trên, không nói cho người B là cái nào.</li>
<li>Người B chỉ bắt đầu từ triệu chứng (<code>curl</code>, bộ giám sát, <code>systemctl status</code>) và phải gọi tên lệnh đầu tiên trong bảng trước khi chạy bất kỳ gì khác.</li>
<li>B cứu máy chủ và viết postmortem năm dòng cho từng sự cố.</li>
<li>Đổi vai một lần, với hai sự cố khác.</li>
</ol><p><strong>Đạt khi:</strong> với bốn sự cố, dòng "nguyên nhân" của postmortem khớp đúng thứ A đã làm, <code>curl -s localhost/health</code> cho <code>"status": "ok"</code>, <code>giam-sat.sh</code> in <code>0 vấn đề</code>, và mọi tmpfs của buổi tập đã được umount.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Deleted-but-open file (file đã xoá còn mở)</span><span class="v">File đã mất tên nhưng inode vẫn sống nhờ một descriptor đang mở; <code>df</code> đếm nó, <code>du</code> thì không.</span></div>
  <div class="kv"><span class="k">Inode exhaustion (cạn inode)</span><span class="v">Hết inode: không tạo được file mới dù còn trống byte.</span></div>
  <div class="kv"><span class="k">OOM killer (bộ diệt khi hết bộ nhớ)</span><span class="v">Cơ chế của nhân giết một tiến trình khi bộ nhớ (của cả máy hoặc của một cgroup) cạn.</span></div>
  <div class="kv"><span class="k">EADDRINUSE (Errno 98)</span><span class="v">"Address already in use": đã có một socket khác nghe ở địa chỉ và cổng đó.</span></div>
  <div class="kv"><span class="k">SELinux label (nhãn SELinux)</span><span class="v">Ngữ cảnh bảo mật gắn vào mọi file và tiến trình trên Fedora/RHEL; muốn truy cập cần cả đúng quyền lẫn đúng nhãn.</span></div>
  <div class="kv"><span class="k">CRLF</span><span class="v">Kiểu xuống dòng của Windows, <code>\\r\\n</code>; bash coi <code>\\r</code> là một phần của mỗi lệnh.</span></div>
  <div class="kv"><span class="k">Bind mount (gắn buộc)</span><span class="v">Cho một file hay thư mục hiện ra ở một đường dẫn thứ hai; bind mount một file đơn đi theo inode.</span></div>
  <div class="kv"><span class="k">Postmortem (bản mổ xẻ sự cố, không đổ lỗi)</span><span class="v">Bản ghi ngắn về một sự cố — triệu chứng, nguyên nhân, cách cứu, cách phòng — nói về hệ thống, không về người.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đĩa đầy mà <code>rm</code> không ăn thua: <code>lsof -a +L1</code> (cái <code>-a</code> là quan trọng), rồi khởi động lại tiến trình đang giữ hoặc <code>truncate</code> qua <code>/proc/PID/fd</code>.</li>
<li>"Hết chỗ" khi còn byte trống là hết inode: <code>df -i</code>, <code>du --inodes</code>, và một luật <code>tmpfiles.d</code> để dọn cache.</li>
<li><code>MemoryMax=</code> cần <code>MemorySwapMax=0</code> mới là trần thật; đọc chuyện bị OOM giết trong <code>journalctl -u</code> và <code>journalctl -k -g oom</code>.</li>
<li>Tìm chủ của một cổng bằng <code>ss -ltnp</code>/<code>lsof -t -iTCP:CỔNG</code>; kiểm health theo nội dung, đừng theo "cổng có mở".</li>
<li>Permission denied: <code>namei -l</code>, <code>sudo -u APP test -w</code>; <code>mv</code> giữ chủ (và nhãn SELinux) — khôi phục bằng <code>install -o -g -m</code>.</li>
<li>Những lỗi im lặng — sai múi giờ, CRLF, cấu hình chưa ăn — chỉ bắt được bằng cách kiểm tác dụng: <code>systemd-analyze calendar</code>, <code>file</code>/<code>cat -A</code>, <code>sshd -T</code>/<code>systemctl show</code>/<code>ls -i</code>.</li>
</ul>

<a class="link-card" href="https://manpages.ubuntu.com/manpages/noble/man8/lsof.8.html" target="_blank" rel="noopener">
  <span class="lc-ico">📂</span>
  <span class="lc-body"><span class="lc-title">lsof(8)</span><span class="lc-sub"><code>+L1</code>, <code>-a</code> (VÀ thay cho HOẶC), <code>-i</code>, <code>-t</code> — các tuỳ chọn đứng sau sự cố 1 và 4.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man5/tmpfiles.d.5.html" target="_blank" rel="noopener">
  <span class="lc-ico">🧹</span>
  <span class="lc-body"><span class="lc-title">tmpfiles.d(5)</span><span class="lc-sub">Các loại dòng, tuổi, và cách <code>systemd-tmpfiles --clean</code> quyết định cái gì là cũ.</span></span>
</a>
<a class="link-card" href="https://www.freedesktop.org/software/systemd/man/latest/systemd.resource-control.html" target="_blank" rel="noopener">
  <span class="lc-ico">🧠</span>
  <span class="lc-body"><span class="lc-title">systemd.resource-control</span><span class="lc-sub"><code>MemoryMax=</code>, <code>MemoryHigh=</code>, <code>MemorySwapMax=</code> và cách chúng ánh xạ vào cgroup v2.</span></span>
</a>
<a class="link-card" href="https://docs.kernel.org/admin-guide/cgroup-v2.html" target="_blank" rel="noopener">
  <span class="lc-ico">🐧</span>
  <span class="lc-body"><span class="lc-title">Tài liệu nhân — Control Group v2</span><span class="lc-sub"><code>memory.max</code>, <code>memory.swap.max</code> và chuyện gì xảy ra khi một cgroup chạm giới hạn.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Code Lab — Linux &amp; Bash</span><span class="lc-sub">Bài tập có chấm điểm của khoá; làm phần chẩn đoán, rồi vào bài thi cuối khoá.</span></span>
</a>
<p class="note-ct"><strong>Thói quen mang về:</strong> khi có gì hỏng, chạy lệnh đầu tiên trước khi kịp có ý kiến — và khi đã sửa xong, thêm cách phòng vào kho mã trước khi gập laptop.</p>
</div>
`,
    },
    /* ─────────────────────────── 16.5 ─────────────────────────── */
    {
      title: "16.5 — Final exam of the course|||16.5 — Bài thi cuối khoá",
      slug: "lnx-16-5-kiem-tra-cuoi-khoa",
      type: "QUIZ",
      isFreePreview: true,
      description: "Bài thi cuối khoá 20 câu trải đều Mục 0 tới Chương 16, phần lớn là \"lệnh này in ra gì\" đã chạy thật, kèm lời dặn và danh sách năng lực của cả khoá.",
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Final exam</span>
<h2>The final exam of the course</h2>
<p class="lead">Twenty questions, one or two from every part of the course — from the first lesson's "which shell am I in?" to the capstone server of this chapter. Most are "what does this print?" or "which fix works?", because reading a command and predicting its result is the skill everything else rests on. Every expected output was run for real on 28–29/09/2026: in an Ubuntu 24.04 container running systemd 255, on a Mac with macOS 27, or on a Fedora 44 machine, as the question says. You have 30 minutes.</p>
<h3>Before you start</h3>
<ul>
<li>Read the whole command before the options. Most wrong answers are right for a slightly <em>different</em> command — a missing <code>-a</code>, an <code>-r</code>, a <code>+</code> in <code>-mtime +7</code>.</li>
<li>When a question shows output, trust the output over your memory of how a tool "usually" behaves: several questions are about the difference.</li>
<li>No terminal during the exam. Afterwards, run every question you got wrong in a throw-away <code>ubuntu:24.04</code> container — that is where it will stick.</li>
<li>Each explanation says why the right answer is right <em>and</em> why the most tempting wrong one is wrong, with the lesson to revisit.</li>
</ul>
<h3>Self-check before you start</h3>
<ul>
<li>I can move around the filesystem, read <code>ls -l</code> and <code>stat</code>, and explain a symlink, a hard link and an inode.</li>
<li>I can build a pipeline with <code>grep</code>, <code>sort</code>, <code>uniq</code>, <code>awk</code> and <code>sed</code>, and redirect stdout and stderr exactly where I want.</li>
<li>I can diagnose "Permission denied" with <code>namei -l</code> and <code>sudo -u</code>, and set owners and modes with <code>install</code>, <code>chown</code>, <code>chmod</code>.</li>
<li>I can write a bash script with strict mode, quoting, traps, a lock, arrays and parameter expansion — and I know which parts break on the Mac's bash 3.2.</li>
<li>I can run an app as a systemd service with a user, a memory ceiling and restarts; schedule jobs with timers in the right time zone; rotate logs; and read the journal.</li>
<li>I can set up a VPS with keys-only SSH and a firewall, deploy with rollback, and work through a full disk, an OOM kill, a taken port or a CRLF script from the first command.</li>
</ul>
${slide('lx-16', 32, 'Cả khoá trong một máy chủ: 17 phần bạn đã đi qua')}
${slide('lx-16', 29, 'Bảng tra nhanh Chương 16 (1/2): dựng máy và deploy')}
${slide('lx-16', 30, 'Bảng tra nhanh Chương 16 (2/2): tự động hoá và sự cố')}
<h3>What you can do after this course</h3>
<p>You can take a fresh Linux server and make it yours, and you can read what a server is telling you when it misbehaves. That is the everyday job behind "backend", "DevOps" and "SRE", and behind every student project that has to stay online through a demo. The next steps on this site build directly on it: containers (the Docker course), pipelines that call your deploy script (GitHub Actions), a reverse proxy in depth (nginx), and a full VPS deployment (Deploy VPS).</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài thi cuối khoá</span>
<h2>Bài thi cuối khoá</h2>
<p class="lead">Hai mươi câu, mỗi phần của khoá một hai câu — từ câu hỏi "tôi đang đứng trong shell nào?" của bài đầu tiên tới máy chủ dự án của chương này. Phần lớn là "lệnh này in ra gì?" hoặc "cách sửa nào chạy được?", vì đọc một lệnh và đoán trước kết quả của nó là kỹ năng mà mọi thứ khác dựa vào. Mọi output trong đáp án đã chạy thật ngày 28–29/09/2026: trong container Ubuntu 24.04 chạy systemd 255, trên Mac với macOS 27, hoặc trên một máy Fedora 44, đúng như câu hỏi ghi. Bạn có 30 phút.</p>
<h3>Lời dặn trước khi làm</h3>
<ul>
<li>Đọc hết cả lệnh rồi mới đọc phương án. Phần lớn đáp án sai là đúng cho một lệnh <em>hơi khác</em> — thiếu một <code>-a</code>, một <code>-r</code>, một dấu <code>+</code> trong <code>-mtime +7</code>.</li>
<li>Khi câu hỏi cho sẵn output, tin output hơn trí nhớ của bạn về cách công cụ "thường" chạy: vài câu hỏi xoay quanh đúng chỗ khác nhau đó.</li>
<li>Không mở terminal trong lúc thi. Làm xong, chạy lại mọi câu mình sai trong một container <code>ubuntu:24.04</code> vứt đi — đó là lúc kiến thức bám lại.</li>
<li>Mỗi lời giải thích nói vì sao đáp án đúng là đúng <em>và</em> vì sao phương án hấp dẫn nhất lại sai, kèm bài nên xem lại.</li>
</ul>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi đi lại được trong hệ thống file, đọc được <code>ls -l</code> và <code>stat</code>, và giải thích được symlink, hard link và inode.</li>
<li>Tôi dựng được ống dẫn với <code>grep</code>, <code>sort</code>, <code>uniq</code>, <code>awk</code> và <code>sed</code>, và chuyển hướng stdout, stderr đúng chỗ mình muốn.</li>
<li>Tôi chẩn đoán được "Permission denied" bằng <code>namei -l</code> và <code>sudo -u</code>, và đặt chủ, quyền bằng <code>install</code>, <code>chown</code>, <code>chmod</code>.</li>
<li>Tôi viết được script bash có chế độ nghiêm ngặt, dấu nháy đúng, bẫy, khoá, mảng và khai triển tham số — và biết phần nào vỡ trên bash 3.2 của Mac.</li>
<li>Tôi chạy được một app thành dịch vụ systemd có người dùng riêng, trần bộ nhớ và tự khởi động lại; hẹn giờ việc bằng timer đúng múi giờ; xoay vòng log; và đọc được journal.</li>
<li>Tôi dựng được một VPS có SSH chỉ bằng khoá và tường lửa, deploy có quay lui, và xử lý được đĩa đầy, bị OOM giết, cổng bị chiếm hay script CRLF bắt đầu từ lệnh đầu tiên.</li>
</ul>
${slide('lx-16', 32, 'Cả khoá trong một máy chủ: 17 phần bạn đã đi qua')}
${slide('lx-16', 29, 'Bảng tra nhanh Chương 16 (1/2): dựng máy và deploy')}
${slide('lx-16', 30, 'Bảng tra nhanh Chương 16 (2/2): tự động hoá và sự cố')}
<h3>Học xong khoá này bạn làm được gì</h3>
<p>Bạn nhận một máy chủ Linux mới tinh và biến nó thành của mình, và bạn đọc được máy chủ đang nói gì khi nó trở chứng. Đó là công việc hằng ngày đứng sau các chữ "backend", "DevOps" và "SRE", và đứng sau mọi đồ án sinh viên phải sống sót qua buổi demo. Các bước tiếp theo trên trang này xây thẳng lên nền đó: container (khoá Docker), pipeline gọi script deploy của bạn (khoá GitHub Actions), reverse proxy chuyên sâu (khoá nginx), và triển khai trọn một VPS (khoá Deploy VPS).</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 1800,
        questions: [
          {
            question: "On your Mac the Terminal opens zsh. You type /bin/bash, and in the new shell run: echo $SHELL; ps -p $$ -o comm= — what are the two lines?|||Trên Mac, Terminal mở zsh. Bạn gõ /bin/bash, rồi trong shell mới chạy: echo $SHELL; ps -p $$ -o comm= — hai dòng in ra là gì?",
            options: [
              "/bin/bash · /bin/bash",
              "/bin/zsh · /bin/bash",
              "/bin/bash · /bin/zsh",
              "/bin/zsh · /bin/zsh",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: $SHELL is your LOGIN shell as recorded for your account, inherited through the environment — starting another shell does not change it. $$ is the PID of the shell you are in now, so ps shows the program actually running. Measured on macOS 27: /bin/zsh then /bin/bash. \"/bin/bash · /bin/bash\" is the tempting answer if you think $SHELL means \"the current shell\"; use ps -p $$ (or $BASH_VERSION) for that.|||VI: $SHELL là shell ĐĂNG NHẬP ghi trong tài khoản của bạn, được kế thừa qua biến môi trường — mở một shell khác không đổi được nó. $$ là PID của shell bạn đang đứng, nên ps cho thấy chương trình thật sự đang chạy. Đo trên macOS 27: /bin/zsh rồi /bin/bash. \"/bin/bash · /bin/bash\" là đáp án hấp dẫn nếu nghĩ $SHELL là \"shell hiện tại\"; muốn biết điều đó hãy dùng ps -p $$ (hoặc $BASH_VERSION).",
          },
          {
            question: "/opt/datlich/current is a symlink to releases/20260928-170509. You run: cd /opt/datlich/current && pwd && pwd -P — what are the two lines (shown as line 1 · line 2)?|||/opt/datlich/current là symlink trỏ tới releases/20260928-170509. Bạn chạy: cd /opt/datlich/current && pwd && pwd -P — hai dòng in ra là gì (viết dạng dòng 1 · dòng 2)?",
            options: [
              "/opt/datlich/current · /opt/datlich/releases/20260928-170509",
              "/opt/datlich/releases/20260928-170509 · /opt/datlich/releases/20260928-170509",
              "/opt/datlich/current · /opt/datlich/current",
              "/opt/datlich/releases/20260928-170509 · /opt/datlich/current",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: bash remembers the path you used (\"logical\" path), so plain pwd shows /opt/datlich/current; pwd -P resolves every symlink and shows the physical directory. Measured on the capstone server. The second option is what /proc/PID/cwd shows for a process — useful when you want to know which release a running service really uses.|||VI: bash nhớ đường dẫn bạn đã đi qua (đường dẫn \"logic\"), nên pwd trơn in /opt/datlich/current; pwd -P lần theo mọi symlink và in thư mục vật lý. Đo trên máy chủ dự án. Phương án thứ hai là thứ /proc/PID/cwd cho thấy với một tiến trình — hữu ích khi muốn biết một dịch vụ đang chạy thật sự dùng bản phát hành nào.",
          },
          {
            question: "A backup folder has files last modified 6d1h, 7d1h, 7d23h, 8d1h and 9d1h ago. Which ones does find . -name \"*.gz\" -mtime +7 -delete remove?|||Một thư mục sao lưu có các file sửa lần cuối cách đây 6 ngày 1 giờ, 7 ngày 1 giờ, 7 ngày 23 giờ, 8 ngày 1 giờ và 9 ngày 1 giờ. find . -name \"*.gz\" -mtime +7 -delete xoá những file nào?",
            options: [
              "The four older than 7 days: 7d1h, 7d23h, 8d1h, 9d1h|||Bốn file cũ hơn 7 ngày: 7 ngày 1 giờ, 7 ngày 23 giờ, 8 ngày 1 giờ, 9 ngày 1 giờ",
              "7d23h, 8d1h and 9d1h|||7 ngày 23 giờ, 8 ngày 1 giờ và 9 ngày 1 giờ",
              "Only 8d1h and 9d1h|||Chỉ 8 ngày 1 giờ và 9 ngày 1 giờ",
              "Only 9d1h|||Chỉ 9 ngày 1 giờ",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: -mtime counts WHOLE 24-hour periods and drops the fraction: 7d23h is \"7\", and +7 means \"more than 7\", i.e. at least 8. Measured: only b8.gz and b9.gz matched. That is why \"keep a week\" jobs often keep 8 days in practice. If you need exact minutes, use -mmin (the monitor in 16.3 uses -mmin -1560).|||VI: -mtime đếm số khoảng 24 giờ TRỌN VẸN và bỏ phần lẻ: 7 ngày 23 giờ là \"7\", còn +7 nghĩa là \"hơn 7\", tức ít nhất 8. Đo thật: chỉ b8.gz và b9.gz khớp. Vì thế việc \"giữ một tuần\" trên thực tế thường giữ 8 ngày. Cần chính xác tới phút thì dùng -mmin (bộ giám sát ở 16.3 dùng -mmin -1560).",
          },
          {
            question: "The last field of six access-log lines is 200, 502, 200, 404, 502, 200. What does awk '{print $NF}' f | sort | uniq -c | sort -rn | head -n 1 print?|||Trường cuối của sáu dòng access log lần lượt là 200, 502, 200, 404, 502, 200. awk '{print $NF}' f | sort | uniq -c | sort -rn | head -n 1 in ra gì?",
            options: [
              "200",
              "3",
              "2 502",
              "      3 200",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: uniq -c only merges ADJACENT equal lines — that is why sort comes first — and prefixes each with its count, right-aligned in a 7-character field. sort -rn puts the biggest count first. Measured: \"      3 200\" (cat -A shows the leading spaces). \"2 502\" would be the answer if sort -rn were missing a step or sorted ascending.|||VI: uniq -c chỉ gộp các dòng giống nhau NẰM KỀ nhau — nên phải sort trước — và thêm số đếm ở đầu, căn phải trong một ô 7 ký tự. sort -rn đưa số lớn nhất lên đầu. Đo thật: \"      3 200\" (cat -A cho thấy các dấu cách đầu dòng). \"2 502\" sẽ là đáp án nếu thiếu bước sort -rn hoặc sắp tăng dần.",
          },
          {
            question: "/etc/datlich is drwxr-x--- root:datlich and datlich.env inside it is -rw-r----- root:datlich. User deploy is not in group datlich. What does sudo -u deploy cat /etc/datlich/datlich.env print?|||/etc/datlich là drwxr-x--- root:datlich, bên trong có datlich.env -rw-r----- root:datlich. Người dùng deploy không thuộc nhóm datlich. sudo -u deploy cat /etc/datlich/datlich.env in ra gì?",
            options: [
              "cat: /etc/datlich/datlich.env: Permission denied",
              "The contents of the file, because it is group-readable|||Nội dung file, vì nó cho nhóm đọc",
              "cat: /etc/datlich/datlich.env: No such file or directory",
              "The contents, because sudo -u runs with root privileges|||Nội dung file, vì sudo -u chạy với quyền root",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: deploy falls into \"others\" for both the directory and the file; the directory gives others nothing (---), so deploy cannot even traverse it. Measured on the capstone server: Permission denied. \"Group-readable\" helps only members of group datlich (the app). sudo -u deploy runs AS deploy — it drops privileges, it does not keep root's.|||VI: deploy rơi vào nhóm \"người khác\" với cả thư mục lẫn file; thư mục không cho người khác quyền gì (---), nên deploy còn không đi xuyên qua được. Đo trên máy chủ dự án: Permission denied. \"Cho nhóm đọc\" chỉ giúp thành viên nhóm datlich (tức app). sudo -u deploy chạy DƯỚI TÊN deploy — nó hạ quyền, không giữ quyền root.",
          },
          {
            question: "A health script runs: timeout 2 sleep 5; echo $? — what number is printed?|||Một script kiểm tra chạy: timeout 2 sleep 5; echo $? — số nào được in ra?",
            options: [
              "0",
              "2",
              "124",
              "143",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: When the time limit is reached, timeout sends SIGTERM and then exits with the special status 124, so scripts can tell \"timed out\" from \"the command failed\". Measured on Ubuntu 24.04: 124. 143 (128 + 15) is what you would see from a process killed by SIGTERM without timeout translating it; with timeout -s KILL the status was 137. Remember macOS has no timeout command by default.|||VI: Khi hết giờ, timeout gửi SIGTERM rồi thoát với mã đặc biệt 124, để script phân biệt được \"quá giờ\" với \"lệnh hỏng\". Đo trên Ubuntu 24.04: 124. 143 (128 + 15) là thứ bạn thấy ở một tiến trình bị SIGTERM giết mà không có timeout chuyển mã; với timeout -s KILL mã là 137. Nhớ rằng macOS mặc định không có lệnh timeout.",
          },
          {
            question: "f=/opt/datlich/releases/20260928-170424; echo \"${f##*/} ${f%/*}\" — what is printed?|||f=/opt/datlich/releases/20260928-170424; echo \"${f##*/} ${f%/*}\" — in ra gì?",
            options: [
              "/opt/datlich/releases 20260928-170424",
              "20260928-170424 /opt/datlich/releases",
              "20260928-170424 /opt",
              "opt/datlich/releases/20260928-170424 /opt/datlich/releases",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: ${f##*/} removes the LONGEST prefix matching \"*/\" — everything up to the last slash — leaving the basename; ${f%/*} removes the SHORTEST suffix matching \"/*\", leaving the directory. Measured: 20260928-170424 /opt/datlich/releases. deploy.sh uses exactly these instead of basename/dirname (no fork). Neither expansion can produce \"/opt\": that would need removing everything after the FIRST slash, i.e. ${f#/} followed by ${x%%/*}.|||VI: ${f##*/} xoá tiền tố DÀI NHẤT khớp \"*/\" — mọi thứ tới dấu gạch chéo cuối — còn lại tên file; ${f%/*} xoá hậu tố NGẮN NHẤT khớp \"/*\", còn lại thư mục. Đo thật: 20260928-170424 /opt/datlich/releases. deploy.sh dùng đúng hai dạng này thay cho basename/dirname (không fork). Không dạng nào ở đây cho ra \"/opt\": muốn vậy phải xoá mọi thứ sau dấu gạch chéo ĐẦU TIÊN, tức kiểu ${x%%/*} chứ không phải ${f%/*}.",
          },
          {
            question: "set -o pipefail; seq 100000 | grep -q 1; echo $? — on Ubuntu, what is printed?|||set -o pipefail; seq 100000 | grep -q 1; echo $? — trên Ubuntu in ra gì?",
            options: [
              "0, because grep found a match|||0, vì grep đã tìm thấy",
              "1",
              "2",
              "141",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: grep -q exits at the first match; seq is still writing hundreds of kilobytes, receives SIGPIPE and dies with 128 + 13 = 141; with pipefail the pipeline reports that failure. Measured: 141 (and 0 without pipefail, and 0 for seq 10 whose tiny output is written before grep exits). The same trap made bootstrap.sh claim \"sshd still accepts passwords\" in Lesson 16.1 — use grep … >/dev/null instead of -q after a big producer.|||VI: grep -q thoát ngay ở dòng khớp đầu tiên; seq vẫn đang ghi hàng trăm KB, nhận SIGPIPE và chết với 128 + 13 = 141; có pipefail thì cả ống báo lỗi đó. Đo thật: 141 (và 0 khi không có pipefail, cũng 0 với seq 10 vì output tí hon đã ghi xong trước khi grep thoát). Cũng cái bẫy này làm bootstrap.sh báo \"sshd vẫn nhận mật khẩu\" ở Bài 16.1 — sau một lệnh in nhiều, dùng grep … >/dev/null thay cho -q.",
          },
          {
            question: "The app works when you start it from your SSH session (you put export SMS_API_KEY=… in ~/.bashrc), but as datlich.service it crashes with KeyError: 'SMS_API_KEY'. What is the right fix?|||App chạy được khi bạn khởi động nó từ phiên SSH (bạn đã đặt export SMS_API_KEY=… trong ~/.bashrc), nhưng chạy dưới datlich.service thì sập với KeyError: 'SMS_API_KEY'. Cách sửa đúng là gì?",
            options: [
              "Move the export into /etc/profile|||Chuyển dòng export vào /etc/profile",
              "Change ExecStart= to bash -c \"source ~/.bashrc && python3 app.py\"|||Đổi ExecStart= thành bash -c \"source ~/.bashrc && python3 app.py\"",
              "Add SMS_API_KEY=… to /etc/datlich/datlich.env (the EnvironmentFile=) and restart the service|||Thêm SMS_API_KEY=… vào /etc/datlich/datlich.env (file EnvironmentFile=) rồi khởi động lại dịch vụ",
              "Run systemctl daemon-reload|||Chạy systemctl daemon-reload",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: systemd starts services with a clean environment and never runs your login or interactive shell files, so neither ~/.bashrc nor /etc/profile is read (Lessons 8.2, 11.1). The unit's EnvironmentFile= is read at every start, so adding the line and restarting is enough — no daemon-reload, which is only for changes to unit files. Sourcing .bashrc in ExecStart= \"works\" but ties a service to one person's dotfiles and to an interactive guard that may return early.|||VI: systemd khởi động dịch vụ với một môi trường sạch và không bao giờ chạy các file khởi động shell đăng nhập hay tương tác của bạn, nên cả ~/.bashrc lẫn /etc/profile đều không được đọc (Bài 8.2, 11.1). EnvironmentFile= của unit được đọc ở MỖI lần start, nên thêm dòng đó rồi khởi động lại là đủ — không cần daemon-reload, thứ chỉ dành cho thay đổi ở file unit. source .bashrc trong ExecStart= \"chạy được\" nhưng buộc một dịch vụ vào dotfile của một người, và vào cái chốt tương tác có thể return sớm.",
          },
          {
            question: "ufw: default deny incoming, allow 22 and 80. The app listens on 127.0.0.1:8080, nginx on 0.0.0.0:80. From another machine: curl -m 5 http://vps:8080/health — what happens?|||ufw: mặc định chặn chiều vào, cho 22 và 80. App nghe ở 127.0.0.1:8080, nginx ở 0.0.0.0:80. Từ một máy khác: curl -m 5 http://vps:8080/health — chuyện gì xảy ra?",
            options: [
              "curl: (28) Connection timed out after 5002 milliseconds",
              "curl: (7) Failed to connect … Couldn't connect to server",
              "curl: (52) Empty reply from server",
              "{\"status\": \"ok\", \"version\": \"1.1.0\"}",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: The firewall DROPS the packet silently, so curl waits until its -m 5 limit: exit 28. Measured from a second container. With ufw switched off, the same command failed at once with (7) \"Couldn't connect\" — the packet arrived but nothing listens on the public address for 8080, so the kernel answered with a reset. Timeout = dropped on the way; refused = arrived, nobody listening.|||VI: Tường lửa NUỐT (DROP) gói tin trong im lặng, nên curl chờ tới giới hạn -m 5: mã 28. Đo từ một container thứ hai. Tắt ufw đi, cùng lệnh đó hỏng ngay với (7) \"Couldn't connect\" — gói tin tới nơi nhưng không có gì nghe cổng 8080 ở địa chỉ công khai, nên nhân trả lời bằng reset. Timeout = bị chặn dọc đường; refused = tới nơi mà không ai nghe.",
          },
          {
            question: "The logrotate rule has daily, rotate 14, compress and delaycompress. You force two rotations (logrotate -f), with some requests in between. What does ls /var/log/datlich/access.log* show?|||Luật logrotate có daily, rotate 14, compress và delaycompress. Bạn ép xoay hai lần (logrotate -f), giữa hai lần có vài yêu cầu. ls /var/log/datlich/access.log* cho thấy gì?",
            options: [
              "access.log  access.log.1.gz  access.log.2.gz",
              "access.log.1  access.log.2",
              "access.log  access.log.1",
              "access.log  access.log.1  access.log.2.gz",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: delaycompress leaves the newest rotated file (.1) uncompressed for one cycle — it may still receive writes and it is the one you read most — and compresses it when it becomes .2. Measured: access.log, access.log.1, access.log.2.gz. Without delaycompress you would get .1.gz immediately (the first option).|||VI: delaycompress để file vừa xoay mới nhất (.1) chưa nén trong một vòng — nó có thể vẫn bị ghi thêm và là file bạn đọc nhiều nhất — rồi mới nén khi nó thành .2. Đo thật: access.log, access.log.1, access.log.2.gz. Không có delaycompress thì .1.gz xuất hiện ngay (phương án đầu).",
          },
          {
            question: "Several deploys in one minute plus a crash loop: now the rollback's systemctl restart datlich fails and the journal says \"Start request repeated too quickly\". Which command, run before the restart, lets it start?|||Vài lần deploy trong một phút cộng một vòng lặp chết: giờ lệnh systemctl restart datlich của bước quay lui hỏng và journal ghi \"Start request repeated too quickly\". Lệnh nào, chạy trước lần restart, cho nó khởi động được?",
            options: [
              "systemctl daemon-reload",
              "systemctl reset-failed datlich",
              "systemctl enable datlich",
              "kill -HUP 1",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: StartLimitBurst=5 within StartLimitIntervalSec= counts every start, manual or automatic; once exceeded, the unit is in a failed state and further starts are refused. reset-failed clears that state and the counter — deploy.sh now does it before every restart. daemon-reload only re-reads unit files: measured with a test unit (StartLimitBurst=3, crash loop), a start after daemon-reload was still refused with \"Start request repeated too quickly\", a start after reset-failed was accepted. The first version of deploy.sh lost its rollback exactly this way.|||VI: StartLimitBurst=5 trong StartLimitIntervalSec= đếm MỌI lần start, bằng tay hay tự động; vượt rồi thì unit ở trạng thái failed và các lần start sau bị từ chối. reset-failed xoá trạng thái đó cùng bộ đếm — deploy.sh giờ làm việc này trước mỗi lần khởi động lại. daemon-reload chỉ đọc lại file unit: đo bằng một unit thử (StartLimitBurst=3, vòng lặp chết), lần start sau daemon-reload vẫn bị từ chối với \"Start request repeated too quickly\", lần start sau reset-failed thì được nhận. Bản đầu của deploy.sh mất lần quay lui đúng theo cách này.",
          },
          {
            question: "The disk is full after deleting a big log. sudo lsof +L1 /var/log/datlich lists the deleted file, but also access.log with NLINK 1. Why, and what lists only deleted-but-open files?|||Đĩa vẫn đầy sau khi xoá một log lớn. sudo lsof +L1 /var/log/datlich liệt kê file đã xoá, nhưng cũng liệt kê access.log với NLINK 1. Vì sao, và lệnh nào chỉ liệt kê file đã xoá mà còn mở?",
            options: [
              "lsof ORs its selections by default; use lsof -a +L1 /var/log/datlich|||Mặc định lsof HOẶC các điều kiện; dùng lsof -a +L1 /var/log/datlich",
              "access.log is also deleted; restart the app|||access.log cũng đã bị xoá; khởi động lại app",
              "+L1 means \"link count ≤ 1\"; use +L0|||+L1 nghĩa là \"số liên kết ≤ 1\"; dùng +L0",
              "The path argument is ignored with +L; use -p PID|||Với +L thì đối số đường dẫn bị bỏ qua; dùng -p PID",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: lsof combines selection options with OR unless you pass -a: \"files with fewer than 1 link\" OR \"files on this filesystem\" — so every open file on /var/log/datlich appears. -a makes it AND. Measured in incident 1: with -a only nhac-lich-debug.log (deleted) remained. +L1 already means \"fewer than 1\", i.e. 0 links.|||VI: lsof kết hợp các điều kiện chọn bằng HOẶC trừ khi có -a: \"file có ít hơn 1 liên kết\" HOẶC \"file trên hệ thống file này\" — nên mọi file đang mở trên /var/log/datlich đều hiện ra. -a biến nó thành VÀ. Đo ở sự cố 1: có -a thì chỉ còn nhac-lich-debug.log (deleted). +L1 vốn đã nghĩa là \"ít hơn 1\", tức 0 liên kết.",
          },
          {
            question: "Backups are named by time, 01 … 10. What does printf '%s\\n' {01..10} | sort -r | tail -n +8 | paste -sd' ' print — the list the rotation deletes when keeping 7?|||Các bản sao lưu đặt tên theo thời gian, 01 … 10. printf '%s\\n' {01..10} | sort -r | tail -n +8 | paste -sd' ' in ra gì — danh sách mà việc xoay vòng xoá khi giữ 7 bản?",
            options: [
              "10 09 08",
              "08 09 10",
              "03 02 01",
              "01 02 03",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: sort -r puts the newest first (10 … 01); tail -n +8 prints from line 8 onward, i.e. skips the seven newest; what is left are the three oldest, still in reverse order. Measured: 03 02 01. \"10 09 08\" is the classic mistake of reading tail -n +8 as \"the last 8\" or forgetting the -r. The {01..10} brace expansion keeps the leading zeros, so text sorting equals time sorting.|||VI: sort -r đưa bản mới nhất lên đầu (10 … 01); tail -n +8 in từ dòng 8 trở đi, tức bỏ qua bảy bản mới nhất; còn lại ba bản cũ nhất, vẫn theo thứ tự ngược. Đo thật: 03 02 01. \"10 09 08\" là lỗi kinh điển khi đọc tail -n +8 thành \"8 dòng cuối\" hoặc quên -r. Khai triển {01..10} giữ số 0 đứng đầu, nên sắp theo chữ cũng là sắp theo thời gian.",
          },
          {
            question: "The unit has MemoryMax=150M. A request builds a 300 MB string, and it returns HTTP 200. systemctl show gives MemoryPeak=157286400 and MemorySwapPeak=175337472. Why was nothing killed?|||Unit có MemoryMax=150M. Một yêu cầu dựng một chuỗi 300 MB, và nó trả về HTTP 200. systemctl show cho MemoryPeak=157286400 và MemorySwapPeak=175337472. Vì sao không có gì bị giết?",
            options: [
              "MemoryMax only applies after a daemon-reload|||MemoryMax chỉ có hiệu lực sau daemon-reload",
              "Python frees memory before the limit is reached|||Python giải phóng bộ nhớ trước khi chạm giới hạn",
              "MemoryMax is a soft limit that only slows the process down|||MemoryMax là giới hạn mềm, chỉ làm tiến trình chậm lại",
              "The cgroup's pages were pushed to swap; MemorySwapMax=0 makes the ceiling real|||Các trang của cgroup bị đẩy ra swap; MemorySwapMax=0 mới biến cái trần thành thật",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: MemoryMax= limits RAM; when the machine has swap, the kernel reclaims the cgroup's memory into swap instead of invoking the OOM killer — the peak sits exactly at the limit and 167 MB went to swap. Measured in incident 3; after adding MemorySwapMax=0 the same request ended in \"killed by the OOM killer\", status=9/KILL, and Restart= brought the app back. The soft limit that throttles is MemoryHigh=, not MemoryMax=.|||VI: MemoryMax= giới hạn RAM; khi máy có swap, nhân dồn bộ nhớ của cgroup ra swap thay vì gọi OOM killer — đỉnh nằm đúng ở giới hạn và 167 MB đi ra swap. Đo ở sự cố 3; thêm MemorySwapMax=0 thì cùng yêu cầu đó kết thúc bằng \"killed by the OOM killer\", status=9/KILL, và Restart= đưa app về. Giới hạn mềm có bóp chậm là MemoryHigh=, không phải MemoryMax=.",
          },
          {
            question: "You package the app on a Mac (macOS 27) with tar -czf datlich.tgz -C app . and extracting it on Ubuntu prints \"tar: Ignoring unknown extended header keyword 'LIBARCHIVE.xattr.com.apple.provenance'\". Which change on the Mac side produced a clean archive when measured?|||Bạn đóng gói app trên Mac (macOS 27) bằng tar -czf datlich.tgz -C app . và giải nén trên Ubuntu thì in \"tar: Ignoring unknown extended header keyword 'LIBARCHIVE.xattr.com.apple.provenance'\". Thay đổi nào ở phía Mac cho ra một kho nén sạch khi đo thật?",
            options: [
              "COPYFILE_DISABLE=1 tar -czf datlich.tgz -C app .",
              "tar --no-xattrs -czf datlich.tgz -C app .",
              "tar -cJf datlich.txz -C app . (xz instead of gzip)|||tar -cJf datlich.txz -C app . (xz thay cho gzip)",
              "gzip -9 the archive a second time|||gzip -9 kho nén thêm một lần",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: macOS bsdtar stores extended attributes as pax headers that GNU tar does not know. --no-xattrs leaves them out: measured, a clean extract. COPYFILE_DISABLE=1 — the classic advice, which stops the old \"._\" AppleDouble files — did NOT remove these headers on macOS 27 (measured: the same four warnings). The compression format has nothing to do with the headers.|||VI: bsdtar của macOS ghi thuộc tính mở rộng thành header pax mà GNU tar không hiểu. --no-xattrs bỏ chúng đi: đo thật, giải nén sạch. COPYFILE_DISABLE=1 — lời khuyên kinh điển, thứ chặn các file \"._\" AppleDouble kiểu cũ — KHÔNG bỏ được các header này trên macOS 27 (đo: vẫn đủ bốn cảnh báo). Kiểu nén chẳng liên quan gì tới header.",
          },
          {
            question: "Run 1 of bootstrap wrote /etc/ssh/sshd_config.d/01-datlich.conf and crashed before reloading sshd. Run 2 compares the file with cmp, prints ✓ and finishes with exit 0. What actually guarantees that password logins are now off?|||Lần chạy 1 của bootstrap đã ghi /etc/ssh/sshd_config.d/01-datlich.conf rồi chết trước khi nạp lại sshd. Lần 2 so file bằng cmp, in ✓ và kết thúc với mã 0. Điều gì thật sự bảo đảm đăng nhập bằng mật khẩu đã tắt?",
            options: [
              "The ✓ from cmp, because the file on disk is correct|||Dấu ✓ của cmp, vì file trên đĩa đã đúng",
              "Running bootstrap a third time|||Chạy bootstrap lần thứ ba",
              "A check of the effective value — sshd -T must print \"passwordauthentication no\", or the script fails|||Một phép kiểm giá trị đang hiệu lực — sshd -T phải in \"passwordauthentication no\", không thì script hỏng",
              "cat /etc/ssh/sshd_config.d/01-datlich.conf|||cat /etc/ssh/sshd_config.d/01-datlich.conf",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: Idempotent steps compare files, but a file that is correct on disk is not proof that the running program uses it — here the reload was skipped because run 1 died after writing. Only the program's own report of its effective configuration proves it; bootstrap.sh ends step 5 with exactly that check. A third run would print ✓ again for the same reason, and cat shows what you wrote, not what sshd uses (a 50-cloud-init.conf could still win).|||VI: Các bước idempotent so file, nhưng một file đúng trên đĩa không chứng minh được chương trình đang chạy dùng nó — ở đây bước nạp lại bị bỏ qua vì lần 1 chết sau khi ghi. Chỉ báo cáo cấu hình đang hiệu lực của chính chương trình mới chứng minh được; bootstrap.sh kết thúc bước 5 bằng đúng phép kiểm đó. Lần chạy thứ ba sẽ lại in ✓ vì cùng lý do, còn cat chỉ cho thấy bạn đã ghi gì chứ không phải sshd đang dùng gì (một 50-cloud-init.conf vẫn có thể thắng).",
          },
          {
            question: "/opt/datlich exists but has no entry called khong-co. What does readlink -f /opt/datlich/khong-co; echo \"mã=$?\" print on Ubuntu?|||/opt/datlich tồn tại nhưng không có mục nào tên khong-co. readlink -f /opt/datlich/khong-co; echo \"mã=$?\" in gì trên Ubuntu?",
            options: [
              "/opt/datlich/khong-co · mã=0|||/opt/datlich/khong-co · mã=0",
              "mã=1 (nothing else)|||mã=1 (không in gì khác)",
              "readlink: /opt/datlich/khong-co: No such file or directory · mã=1|||readlink: /opt/datlich/khong-co: No such file or directory · mã=1",
              "an empty line · mã=0|||một dòng rỗng · mã=0",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: GNU readlink -f canonicalises a path in which every component except the LAST exists, and succeeds even if the last one does not. Measured: /opt/datlich/khong-co and mã=0; only readlink -f /khong/co/gi failed with 1. The first deploy.sh trusted it and logged \"đang chạy: current\" on a fresh server; the fix tests [[ -L $GOC/current ]] first. (readlink -e would require every component to exist.)|||VI: readlink -f của GNU chuẩn hoá một đường dẫn mà mọi thành phần trừ cái CUỐI đều tồn tại, và thành công kể cả khi cái cuối không có. Đo thật: /opt/datlich/khong-co và mã=0; chỉ readlink -f /khong/co/gi mới hỏng với mã 1. deploy.sh đầu tiên tin nó và ghi log \"đang chạy: current\" trên một máy chủ mới tinh; cách sửa kiểm [[ -L $GOC/current ]] trước. (readlink -e thì đòi mọi thành phần phải tồn tại.)",
          },
          {
            question: "The server clock is UTC and it is Mon 2026-09-28 17:06 UTC. What \"Next elapse\" does systemd-analyze calendar \"*-*-* 02:30:00 Asia/Ho_Chi_Minh\" report?|||Đồng hồ máy chủ là UTC và bây giờ là Mon 2026-09-28 17:06 UTC. systemd-analyze calendar \"*-*-* 02:30:00 Asia/Ho_Chi_Minh\" báo \"Next elapse\" là gì?",
            options: [
              "Tue 2026-09-29 02:30:00 UTC",
              "Tue 2026-09-29 09:30:00 UTC",
              "Mon 2026-09-28 02:30:00 UTC",
              "Mon 2026-09-28 19:30:00 UTC",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: 02:30 in Vietnam (UTC+7) is 19:30 UTC the evening before; at 17:06 UTC that is the next occurrence, 2 h 23 min away. Measured on the capstone server. 09:30 UTC is the mistake of adding 7 hours instead of subtracting; 02:30 UTC is what you get without the zone (and what cron would do). Always let systemd-analyze calendar translate — never do it in your head.|||VI: 02:30 ở Việt Nam (UTC+7) là 19:30 UTC tối hôm trước; lúc 17:06 UTC thì đó là lần kế tiếp, còn 2 giờ 23 phút. Đo trên máy chủ dự án. 09:30 UTC là lỗi cộng 7 tiếng thay vì trừ; 02:30 UTC là thứ bạn nhận được khi không có múi giờ (và là thứ cron sẽ làm). Luôn để systemd-analyze calendar dịch hộ — đừng bao giờ tính nhẩm.",
          },
          {
            question: "After a teammate's commit, datlich-giamsat.service fails every 5 minutes with \"/usr/bin/env: use -[v]S to pass options in shebang lines\" and status=127. What is the cause?|||Sau một commit của bạn cùng nhóm, datlich-giamsat.service hỏng mỗi 5 phút với \"/usr/bin/env: use -[v]S to pass options in shebang lines\" và status=127. Nguyên nhân là gì?",
            options: [
              "bash is not installed on the server|||Máy chủ chưa cài bash",
              "The script was saved with CRLF line endings, so the shebang asks env for \"bash\\r\"|||Script bị lưu với kiểu xuống dòng CRLF, nên dòng shebang bảo env chạy \"bash\\r\"",
              "The script lost its execute bit|||Script mất quyền thực thi",
              "systemd's PATH does not contain /usr/bin|||PATH của systemd không có /usr/bin",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: With CRLF the first line is \"#!/usr/bin/env bash\\r\"; env receives \"bash\\r\", and coreutils 9.4's env prints this -S hint instead of the older \"bash\\r: No such file or directory\" — exit 127, \"command not found\". Measured in incident 7: file says \"with CRLF line terminators\", cat -A shows ^M$, dos2unix fixed it. A missing execute bit gives status 203/EXEC and \"Permission denied\", not 127 from env.|||VI: Với CRLF, dòng đầu thành \"#!/usr/bin/env bash\\r\"; env nhận \"bash\\r\", và env của coreutils 9.4 in gợi ý về -S này thay cho câu cũ \"bash\\r: No such file or directory\" — mã 127, \"không tìm thấy lệnh\". Đo ở sự cố 7: file báo \"with CRLF line terminators\", cat -A hiện ^M$, dos2unix sửa được. Mất quyền thực thi thì ra status 203/EXEC kèm \"Permission denied\", không phải 127 từ env.",
          },
        ],
      },
    },
  ],
};
