/**
 * Deploy lên VPS — Chương 15 (MỚI, 29/09/2026): Dự án cuối khoá — đưa một ứng dụng thật lên từ đầu tới cuối.
 * 15.0 slide (deck dv-15, 32 slide) · 15.1 Ngày 1: máy mới → tên miền → HTTPS · 15.2 Ngày 2: đường ống phát hành,
 * ba lần phát hành có một lần cố tình hỏng · 15.3 Ngày 3: lùi bản, mở rộng/thu hẹp, sao lưu + phục hồi bấm giờ, canh
 * từ ngoài · 15.4 Ra mắt và tuần đầu: runbook + tám sự cố kinh điển dựng lại thật · 15.5 bài thi cuối khoá 20 câu.
 * Nối tiếp (không lặp) dự án khoá Linux Ch16 (bootstrap, systemd, logrotate — trỏ sang đó).
 * MỌI lệnh và output MỚI chạy thật 29/09/2026 trong phòng thí nghiệm của chương: dv15-vps (ubuntu:24.04 lúc giao chỉ
 * có sshd + khoá root; --privileged, --memory 1536m, Docker 29.1.3 lồng bên trong, nginx 1.24.0, certbot 2.9.0, ufw),
 * dv15-vps2 (máy khác: khách đo request, nơi phục hồi, máy canh), registry:2 dv15-reg, CA thử Pebble dv15-pebble
 * (KHÔNG gọi Let's Encrypt thật), webhook giả dv15-hook. App: Node 22 + pg 8.16.3 + PostgreSQL 16.15, ảnh dựng trên
 * Mac M1 từ git archive. Không đụng VPS production.
 * File này SINH từ nguồn thô bằng generator (thoát ký tự tự động). LUẬT vẫn như mọi chương: backtick → &#96;;
 * ${ → \${; < > & trong code → &lt; &gt; &amp;; gạch chéo ngược viết đôi.
 */

import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fdeploy-vps%2Flearn&reflabel=Deploy%20VPS';

export default {
  title: "Chapter 15 — Capstone: ship a real app end to end|||Chương 15 — Dự án cuối khoá: đưa một ứng dụng thật lên từ đầu tới cuối",
  description: "Một đồ án nhóm \"Đặt lịch phòng khám\" đi từ một VPS chỉ có sshd tới HTTPS, qua một đường ống phát hành chạy thật bảy lần (có lần cố tình hỏng), lùi bản khi lược đồ đã đổi, sao lưu và phục hồi bấm giờ sang máy khác, canh từ bên ngoài — rồi tám sự cố kinh điển dựng lại thật và bài thi cuối khoá.",
  lessons: [
    /* ─────────────────────────── 15.0 ─────────────────────────── */
    {
      title: "15.0 — Chapter 15 slides: the capstone project in pictures|||15.0 — Slide Chương 15: dự án cuối khoá bằng hình",
      slug: "deploy-15-0-slides",
      type: "DOCUMENT",
      isFreePreview: true,
      description: "Bộ 32 slide của Chương 15: năm máy của dự án, script Ngày 1 phải chạy năm lần mới đúng, đường ống phát hành bốn chặng, xanh/lam sau nginx, 21 request lỗi thành 0, lùi bản và cửa một chiều của lược đồ, sao lưu kéo về, phục hồi 100,8 s, canh từ ngoài, runbook và tám sự cố dựng lại.",
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Slides</span>
<h2>The capstone project in 32 slides</h2>
<p class="lead">Fourteen chapters taught one piece of deploying at a time. This one puts a whole application on a server and keeps it there for a "week": a team project called "Clinic booking", from a VPS that only has sshd to HTTPS, through seven real releases, a rollback after the schema changed, a timed restore on another machine, a watcher outside the server — and then eight classic incidents rebuilt on purpose. Skim the slides first to see the shape of the project, then work through the lessons with a terminal open.</p>
<p>Slide 3 shows the five machines of the lab. Slides 4–8 belong to Lesson 15.1 (a Day 1 script and the five runs it took to get it right, <code>set -e</code> ignoring failures inside an <code>&amp;&amp;</code> chain, nginx's asynchronous reload, acceptance checks from another machine), 9–15 to 15.2 (the four stages of a release, <code>deploy.sh</code>, <code>phat-hanh.sh</code>, blue/green behind nginx, seven releases measured by a client on another machine, 21 failed requests turned into zero, a lock and a pipe that killed a release), 16–21 to 15.3 (rollback and the bug that rolled forward, expand and contract on real data, backups, a key that can do exactly one thing, a timed restore, a watcher that only speaks when the state changes) and 22–27 to 15.4 (a one-page runbook and the eight incidents). Then the common mistakes, a two-page cheat sheet, a 90-minute practice session and the whole course mapped onto this one project. Every terminal is real output recorded on 29/09/2026 in the chapter's lab: Ubuntu 24.04 containers that the Mac reaches over SSH, a local registry, and Pebble — Let's Encrypt's test ACME server — instead of the real CA.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Slide</span>
<h2>Dự án cuối khoá trong 32 slide</h2>
<p class="lead">Mười bốn chương trước dạy từng mảnh của việc deploy. Chương này đưa trọn một ứng dụng lên máy chủ và giữ nó ở đó suốt "một tuần": đồ án nhóm "Đặt lịch phòng khám", từ một VPS chỉ có sshd tới HTTPS, qua bảy lần phát hành thật, một lần lùi bản khi lược đồ đã đổi, một cú phục hồi bấm giờ sang máy khác, một người canh đứng ngoài máy chủ — rồi tám sự cố kinh điển được dựng lại có chủ đích. Lướt bộ slide trước để thấy hình dạng của dự án, rồi đi qua từng bài với một terminal đang mở.</p>
<p>Slide 3 là năm cái máy của phòng thí nghiệm. Slide 4–8 thuộc Bài 15.1 (script Ngày 1 và năm lần chạy mới đúng, <code>set -e</code> bỏ qua lỗi nằm giữa chuỗi <code>&amp;&amp;</code>, nginx nạp lại bất đồng bộ, nghiệm thu từ một máy khác), 9–15 thuộc 15.2 (bốn chặng của một lần phát hành, <code>deploy.sh</code>, <code>phat-hanh.sh</code>, xanh/lam sau nginx, bảy lần phát hành đo bằng một khách hàng ở máy khác, 21 request lỗi thành 0, một cái khoá và một cái ống đã giết một lần phát hành), 16–21 thuộc 15.3 (lùi bản và con bọ lùi mà lại đi tới, mở rộng và thu hẹp trên dữ liệu thật, sao lưu, một khoá chỉ làm được đúng một việc, phục hồi bấm giờ, người canh chỉ lên tiếng khi trạng thái đổi) và 22–27 thuộc 15.4 (runbook một trang và tám sự cố). Sau đó là những sai lầm hay gặp, bảng tra nhanh hai trang, một buổi thực hành 90 phút và cả khoá được xếp lên đúng dự án này. Mọi terminal là output THẬT ghi ngày 29/09/2026 trong phòng thí nghiệm của chương: các container Ubuntu 24.04 mà máy Mac SSH vào như máy chủ thuê, một registry cục bộ, và Pebble — máy chủ ACME thử nghiệm của chính Let's Encrypt — đóng vai CA thật.</p>
</div>
${gallery('dv-15', [[1, 'Bìa'], [2, 'Bản đồ chương'], [3, 'Toàn cảnh: năm máy, một ứng dụng'], [4, 'Ngày 1: sáu bước, 52 giây'], [5, 'Script Ngày 1 chạy năm lần mới đúng'], [6, 'set -e bỏ qua lỗi giữa chuỗi lệnh'], [7, 'nginx reload bất đồng bộ'], [8, 'Nghiệm thu Ngày 1 từ máy khác'], [9, 'Bốn chặng của một lần phát hành'], [10, 'deploy.sh'], [11, 'phat-hanh.sh'], [12, 'Xanh/lam sau nginx'], [13, 'Mỗi lần hỏng dạy script một điều'], [14, 'Bắt lỗi trước khi khách thấy: 21 → 0'], [15, 'flock và SIGPIPE'], [16, 'Lùi bản và con bọ lùi hai lần'], [17, 'Mở rộng thì lùi được, thu hẹp thì đóng cửa'], [18, 'Sao lưu'], [19, 'Kéo về bằng khoá một việc'], [20, 'Phục hồi bấm giờ'], [21, 'Canh từ máy ngoài'], [22, 'Runbook một trang'], [23, 'Tám sự cố, một bảng'], [24, 'Sự cố 1–2'], [25, 'Sự cố 3–4'], [26, 'Sự cố 5–6'], [27, 'Sự cố 7–8'], [28, 'Sai lầm hay gặp'], [29, 'Bảng tra nhanh (1/2)'], [30, 'Bảng tra nhanh (2/2)'], [31, 'Thực hành chương 15'], [32, 'Cả khoá trong một dự án']])}
`,
    },
    /* ─────────────────────────── 15.1 ─────────────────────────── */
    {
      title: "15.1 — Day 1: from a bare server to a “coming soon” page over HTTPS|||15.1 — Ngày 1: từ một máy trần tới trang “sắp ra mắt” qua HTTPS",
      slug: "deploy-15-1-may-ten-mien-https",
      type: "LESSON",
      isFreePreview: true,
      description: "Một VPS chỉ có sshd được dựng bằng một script chạy lại được: gói, người deploy chỉ được một lệnh sudo, SSH chỉ khoá, Docker xoay log, ufw ba cổng, nginx và chứng chỉ ACME — và năm lần chạy thật mới đúng, mỗi lần một lỗi chỉ lộ ra trên máy mới.",
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.1</span>
<h2>Day 1: from a bare server to a "coming soon" page over HTTPS</h2>
<p class="lead">Your SWP391 team has three days before the defence, a clinic-booking app that runs on everyone's laptop, and a brand-new Ubuntu 24.04 VPS whose only contents are sshd and the provider's copy of your public key. Day 1 ends when a teammate on another network opens <code>https://phongkham.test/</code> and sees a "coming soon" page with a valid certificate — and when the path that got you there is a script you can run again tomorrow on a second machine. This lesson writes that script, runs it on a machine with nothing on it, and shows the five runs it took before it was right. None of the five failures was visible by reading the script.</p>

<h3>The project that runs through the chapter</h3>
${slide('dv-15', 3, 'Toàn cảnh dự án: năm máy, một ứng dụng')}
<p>The application is deliberately small so the chapter can be about shipping it rather than writing it: a 35-line Node 22 API using the <code>pg</code> driver, one table <code>lich_hen</code> (appointments), a static page, and a <code>migrate.js</code> that applies SQL files in order. What is not small is everything around it. Five machines take part, all of them containers on one Mac so that nothing real is ever at risk:</p>
<table>
<tr><th>Machine</th><th>Plays the part of</th><th>What runs there</th></tr>
<tr><td>the Mac</td><td>the build machine (the "home machine" of <code>deploy-nha.sh</code>)</td><td><code>git archive</code>, <code>docker build</code>, image checks, <code>docker push</code></td></tr>
<tr><td><code>dv15-reg</code></td><td>the registry (GHCR in the real project)</td><td><code>registry:2</code>; the Mac pushes to <code>localhost:19155</code></td></tr>
<tr><td><code>dv15-vps</code></td><td>the VPS, name <code>phongkham.test</code></td><td>nginx, two app containers (blue/green), Postgres, ufw, backups</td></tr>
<tr><td><code>dv15-vps2</code></td><td>"somewhere else on the Internet"</td><td>a client that measures every release, the restore target, the outside watcher</td></tr>
<tr><td><code>dv15-pebble</code>, <code>dv15-hook</code></td><td>Let's Encrypt; a Discord/Telegram webhook</td><td>Pebble (the test ACME server); a Node process that prints every POST</td></tr>
</table>
<p>All scripts live in the repository under <code>ops/</code>, next to the app:</p>
<pre><code>phongkham/
├── app/server.js  migrate.js  package.json  public/index.html
├── app/migrations/001_lich_hen.sql  002_…  003_…
├── Dockerfile
└── ops/
    ├── ngay1.sh         <span class="tok-comment"># 15.1 — bare VPS → HTTPS "coming soon"</span>
    ├── chuan-bi-app.sh  <span class="tok-comment"># 15.2 — network, database, secret, nginx upstream (once)</span>
    ├── deploy.sh        <span class="tok-comment"># 15.2 — runs on the build machine</span>
    ├── kiem-anh.sh      <span class="tok-comment"># 15.2 — refuse to push an image that cannot run</span>
    ├── phat-hanh.sh     <span class="tok-comment"># 15.2 — runs on the VPS: lock, migrate, blue/green, smoke</span>
    ├── sao-luu.sh  phuc-hoi.sh  canh.sh   <span class="tok-comment"># 15.3</span></code></pre>
<p><strong>What this chapter does not repeat.</strong> The Linux &amp; Bash course, Chapter 16, already built a server by hand and by script: system users with <code>nologin</code>, a directory tree where every directory has one owner, an idempotent <code>bootstrap.sh</code>, SSH hardened and verified with <code>sshd -T</code>, systemd units and timers, logrotate. Go there for those. This chapter adds what that project did not have: containers pulled from a registry, a database migration in the middle of a release, blue/green behind nginx, HTTPS from an ACME server, and backups restored on another machine.</p>
<table>
<tr><th>Linux &amp; Bash, Chapter 16</th><th>This chapter</th></tr>
<tr><td>app runs as a systemd service from a release directory</td><td>app runs as a container pulled by tag; the VPS never builds</td></tr>
<tr><td>SQLite file, no migrations</td><td>PostgreSQL with expand/contract migrations and a lock timeout</td></tr>
<tr><td>HTTP on port 80</td><td>HTTPS from ACME, port 80 only for the challenge and a redirect</td></tr>
<tr><td>restart the service to deploy</td><td>new colour next to the old one, nginx switches, old one drains</td></tr>
<tr><td>backups kept on the same machine</td><td>backups pulled to another machine and restored against a stopwatch</td></tr>
</table>

<h3>Day 1 in six steps</h3>
${slide('dv-15', 4, 'Ngày 1: sáu bước, 52 giây trên một máy mới tinh')}
<p>The VPS arrives the way most providers hand one over: root can log in with the key you uploaded, and nothing else is installed. <code>ngay1.sh</code> ("day 1") turns it into a machine ready for its first release. It runs as root once, over SSH, and running it again must change nothing. This is the final version, after the five runs described below:</p>
<pre><code class="language-bash">#!/usr/bin/env bash
<span class="tok-comment"># ngay1.sh — VPS Ubuntu 24.04 moi tinh -&gt; san sang nhan ban phat hanh dau tien.</span>
<span class="tok-comment"># Chay bang root MOT lan (chay lai van an toan). Dung may + SSH + ufw chi tiet: khoa Linux Bai 16.1.</span>
set -Eeuo pipefail
export DEBIAN_FRONTEND=noninteractive   <span class="tok-comment"># khong co dong nay: tzdata HOI mui gio va treo mai (do that lan 1)</span>
trap 'echo "ngay1: HONG o dong $LINENO: $BASH_COMMAND" &gt;&amp;2' ERR
TEN=\${TEN:-phongkham.test}
ok() { printf '  ✓ %s\\n' "$*"; }
lam() { printf '  + %s\\n' "$*"; }

echo "[1/6] goi phan mem"
need=(sudo docker.io docker-compose-v2 nginx certbot ufw curl jq)
thieu=(); for g in "\${need[@]}"; do dpkg -s "$g" &gt;/dev/null 2&gt;&amp;1 || thieu+=("$g"); done
if ((\${#thieu[@]})); then lam "cai \${thieu[*]}"; apt-get update -qq; apt-get install -y -qq --no-install-recommends "\${thieu[@]}" &gt;/dev/null
else ok "du goi"; fi

echo "[2/6] nguoi dung deploy: chi SSH bang khoa, chi duoc chay MOT lenh bang sudo"
id deploy &gt;/dev/null 2&gt;&amp;1 || { useradd -m -s /bin/bash deploy; lam "tao deploy"; }
install -d -o deploy -g deploy -m 700 /home/deploy/.ssh
cmp -s /root/.ssh/authorized_keys /home/deploy/.ssh/authorized_keys || {
  install -o deploy -g deploy -m 600 /root/.ssh/authorized_keys /home/deploy/.ssh/authorized_keys; lam "chep khoa"; }
echo 'deploy ALL=(root) NOPASSWD: /opt/phongkham/bin/phat-hanh.sh' &gt; /tmp/sudoers.pk
visudo -cqf /tmp/sudoers.pk            <span class="tok-comment"># sai cu phap sudoers = mat sudo -&gt; kiem TRUOC khi cai</span>
cmp -s /tmp/sudoers.pk /etc/sudoers.d/phongkham &amp;&amp; ok "sudoers mot dong" || { install -m 440 /tmp/sudoers.pk /etc/sudoers.d/phongkham; lam "sudoers mot dong"; }
printf 'PasswordAuthentication no\\nKbdInteractiveAuthentication no\\nPermitRootLogin prohibit-password\\n' &gt; /etc/ssh/sshd_config.d/01-chi-khoa.conf
sshd -t
<span class="tok-comment"># sshd -T chi doc TEP; sshd dang chay van giu cau hinh cu toi khi duoc nap lai (do that: lan 2 quen buoc nay)</span>
if [ -d /run/systemd/system ]; then systemctl reload ssh; else kill -HUP "$(cat /run/sshd.pid)"; fi
ok "sshd: $(sshd -T | grep -E '^passwordauthentication') (da nap lai)"

echo "[3/6] Docker: xoay log, registry noi bo"
install -d /etc/docker
cat &gt; /tmp/daemon.json &lt;&lt;J
{ "log-driver": "json-file", "log-opts": { "max-size": "10m", "max-file": "3" },
  "insecure-registries": ["dv15-reg:5000"] }
J
cmp -s /tmp/daemon.json /etc/docker/daemon.json &amp;&amp; ok "daemon.json" || { install -m 644 /tmp/daemon.json /etc/docker/daemon.json; lam "daemon.json moi"; pkill dockerd || true; }
if [ -d /run/systemd/system ]; then systemctl enable --now docker &gt;/dev/null
else pgrep -x dockerd &gt;/dev/null || { dockerd &gt;/var/log/dockerd.log 2&gt;&amp;1 &amp; }; fi   <span class="tok-comment"># container thi nghiem khong co systemd</span>
for i in $(seq 1 20); do docker info &gt;/dev/null 2&gt;&amp;1 &amp;&amp; break; sleep 1; done
ok "docker $(docker version -f '{{.Server.Version}}')"

echo "[4/6] tuong lua: chi 22, 80, 443"
ufw default deny incoming &gt;/dev/null; ufw default allow outgoing &gt;/dev/null
ufw allow 22,80,443/tcp &gt;/dev/null
ufw --force enable &gt;/dev/null &amp;&amp; ok "$(ufw status | head -1)"

echo "[5/6] nginx: cong 80 chi con ACME + chuyen sang https"
install -d /var/www/acme /var/www/sap-ra-mat /opt/phongkham/bin /etc/phongkham /var/log/phongkham /var/backups/phongkham
cat &gt; /var/www/sap-ra-mat/index.html &lt;&lt;H
&lt;!doctype html&gt;&lt;meta charset="utf-8"&gt;&lt;title&gt;Phong kham&lt;/title&gt;&lt;h1&gt;Dat lich phong kham — sap ra mat&lt;/h1&gt;
H
if [ ! -e /etc/letsencrypt/live/$TEN/fullchain.pem ]; then   <span class="tok-comment"># chay lai tren may dang song: KHONG ha ve ban chi-co-80</span>
cat &gt; /etc/nginx/sites-available/phongkham &lt;&lt;N
server {
    listen 80;
    server_name $TEN www.$TEN;
    location /.well-known/acme-challenge/ { root /var/www/acme; }
    location / { return 301 https://\\$host\\$request_uri; }
}
N
fi
ln -sf ../sites-available/phongkham /etc/nginx/sites-enabled/phongkham; rm -f /etc/nginx/sites-enabled/default
nginx -t -q; if pgrep -x nginx &gt;/dev/null; then nginx -s reload; else nginx; fi; ok "nginx :80"

echo "[6/6] chung chi (ACME, webroot) + trang 'sap ra mat' qua HTTPS"
if [ ! -e /etc/letsencrypt/live/$TEN/fullchain.pem ]; then
  certbot certonly -n --agree-tos -m nhom@$TEN --webroot -w /var/www/acme -d $TEN -d www.$TEN \\
    --server "\${ACME:-https://acme-v02.api.letsencrypt.org/directory}" --deploy-hook 'nginx -s reload' &gt;/dev/null
  lam "xin chung chi $TEN"
else ok "chung chi da co"; fi
cat &gt; /etc/nginx/sites-available/phongkham &lt;&lt;N
server {
    listen 80;
    server_name $TEN www.$TEN;
    location /.well-known/acme-challenge/ { root /var/www/acme; }
    location / { return 301 https://\\$host\\$request_uri; }
}
server {
    listen 443 ssl http2;             <span class="tok-comment"># nginx 1.24 cua Ubuntu 24.04: chua co chi thi 'http2 on;' (1.25.1+)</span>
    server_name $TEN www.$TEN;
    ssl_certificate     /etc/letsencrypt/live/$TEN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$TEN/privkey.pem;
    root /var/www/sap-ra-mat;
}
N
nginx -t -q
nginx -s reload; ok "nginx :443"
<span class="tok-comment"># reload chi GUI tin hieu roi tra ve ngay; worker moi mo cong 443 SAU do vai tram ms -&gt; hoi lai toi 5 s</span>
for i in $(seq 1 10); do
  ma=$(curl -s -o /dev/null -w '%{http_code}' --resolve $TEN:443:127.0.0.1 --cacert "\${CA:-/etc/ssl/certs/ca-certificates.crt}" https://$TEN/) &amp;&amp; break
  sleep 0.5
done
echo "  = https://$TEN/ -&gt; $ma (lan hoi thu $i)"; [ "$ma" = 200 ]</code></pre>
<p>The comments and messages are written without Vietnamese diacritics on purpose: the script's output is read in SSH sessions from teammates' Windows machines and CI logs, and plain ASCII survives every terminal and code page. The six steps, and why each is shaped the way it is:</p>
<ol>
<li><strong>Packages.</strong> Ask <code>dpkg -s</code> which packages are missing and install only those, so a second run prints "du goi" (all present) and touches nothing. <code>--no-install-recommends</code> keeps the small VPS small.</li>
<li><strong>The <code>deploy</code> user.</strong> It logs in with the same key as root and may run exactly one command as root: <code>/opt/phongkham/bin/phat-hanh.sh</code>. It is deliberately <em>not</em> in the <code>docker</code> group: that group can start a container that mounts <code>/</code> of the host, so membership is equivalent to root. The sudoers file is checked with <code>visudo -cqf</code> before it is installed, because a syntax error in <code>/etc/sudoers.d/</code> disables sudo for everyone.</li>
<li><strong>Docker.</strong> <code>daemon.json</code> sets log rotation for every container (10 MB × 3 files — 15.4 measures what happens without it) and, in the lab only, trusts the local registry over plain HTTP. A real registry such as GHCR uses HTTPS and needs no such line.</li>
<li><strong>Firewall.</strong> Deny incoming, allow 22, 80 and 443. The SSH rule goes in before <code>ufw enable</code>. Remember Chapter 12.3: ports published by Docker bypass these rules, which is why the database will never be published at all.</li>
<li><strong>nginx on port 80.</strong> Only two things: the ACME challenge directory, and a 301 to HTTPS for everything else.</li>
<li><strong>Certificate and HTTPS.</strong> <code>certbot certonly --webroot</code> writes the challenge file where nginx serves it; <code>--deploy-hook 'nginx -s reload'</code> is saved in the renewal configuration so every future renewal reloads nginx (Chapter 12.2 measured what happens without it). In the lab <code>ACME</code> points at Pebble; on a real VPS the line falls back to Let's Encrypt.</li>
</ol>
<table>
<tr><th>Flag</th><th>Meaning here</th></tr>
<tr><td><code>apt-get -qq</code></td><td>quiet: only errors reach the terminal</td></tr>
<tr><td><code>--no-install-recommends</code></td><td>install dependencies, skip "recommended" extras</td></tr>
<tr><td><code>useradd -m -s /bin/bash</code></td><td>create the home directory; give a login shell (SSH needs one)</td></tr>
<tr><td><code>install -d -o -g -m</code></td><td>create a directory with owner, group and mode in one step</td></tr>
<tr><td><code>visudo -cqf FILE</code></td><td>check (<code>-c</code>) a file (<code>-f</code>) quietly (<code>-q</code>); non-zero exit on a syntax error</td></tr>
<tr><td><code>sshd -t</code> / <code>sshd -T</code></td><td>test the configuration files / print the effective settings <em>read from the files</em></td></tr>
<tr><td><code>certbot certonly -n --agree-tos -m</code></td><td>obtain only (do not edit nginx), non-interactive, accept terms, contact e-mail</td></tr>
<tr><td><code>--webroot -w DIR -d NAME</code></td><td>HTTP-01 by writing a file under DIR; one <code>-d</code> per name</td></tr>
<tr><td><code>--server URL</code></td><td>which ACME directory; omitted = Let's Encrypt production</td></tr>
<tr><td><code>--deploy-hook CMD</code></td><td>run CMD after every successful issuance or renewal</td></tr>
<tr><td><code>curl --resolve NAME:443:IP</code></td><td>connect to IP but send NAME in SNI and Host — test a name before DNS points at the machine</td></tr>
</table>
<p>On the second, completely fresh machine the whole of Day 1 took 52 seconds:</p>
<div class="out">[1/6] goi phan mem
  + cai sudo docker.io docker-compose-v2 nginx certbot ufw curl jq
debconf: delaying package configuration, since apt-utils is not installed
[2/6] nguoi dung deploy: chi SSH bang khoa, chi duoc chay MOT lenh bang sudo
  + tao deploy
  + chep khoa
  + sudoers mot dong
  ✓ sshd: passwordauthentication no (da nap lai)
[3/6] Docker: xoay log, registry noi bo
  + daemon.json moi
  ✓ docker 29.1.3
[4/6] tuong lua: chi 22, 80, 443
  ✓ Status: active
[5/6] nginx: cong 80 chi con ACME + chuyen sang https
  ✓ nginx :80
[6/6] chung chi (ACME, webroot) + trang 'sap ra mat' qua HTTPS
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Hook 'deploy-hook' ran with error output:
 2026/09/29 09:31:32 [notice] 1791#1791: signal process started
  + xin chung chi phongkham.test
2026/09/29 09:31:32 [notice] 1804#1804: signal process started
  ✓ nginx :443
  = https://phongkham.test/ -&gt; 200 (lan hoi thu 2)

real	0m52.586s</div>
<p>Read two lines carefully. <code>Hook 'deploy-hook' ran with error output</code> is not an error: nginx writes its <code>[notice] signal process started</code> to stderr, and certbot reports anything on stderr that way. And <code>(lan hoi thu 2)</code> — "second try" — is the reason for the last loop in the script, explained below.</p>

<h3>Run for real: five runs before it was right</h3>
${slide('dv-15', 5, 'Script Ngày 1 phải chạy năm lần mới đúng')}
<p>The first machine got the script in its early form. Every failure below is reproducible, and none of them shows up when you read the code:</p>
<p><strong>Run 1 — 6 minutes 11 seconds of silence.</strong> The output stopped after one line:</p>
<div class="out">[1/6] goi phan mem
  + cai docker.io docker-compose-v2 nginx certbot ufw curl jq
debconf: delaying package configuration, since apt-utils is not installed</div>
<p>On the VPS, <code>ps</code> showed the <code>tzdata</code> package's configuration script waiting at a prompt that never reached the SSH session: "Geographic area:". An SSH command with no terminal has no one to answer, so it waits forever. Killing it produced the trap's message and the elapsed time:</p>
<div class="out">E: Sub-process /usr/bin/dpkg returned an error code (1)
ngay1: HONG o dong 13: apt-get install -y -qq --no-install-recommends "\${thieu[@]}" &gt; /dev/null

real	6m11.531s</div>
<p>The fix is one line, <code>export DEBIAN_FRONTEND=noninteractive</code>: debconf then takes every default instead of asking. Every script that runs <code>apt-get</code> over SSH or in CI needs it.</p>
<p><strong>Run 2 — two failures, and the script kept going.</strong> The minimal image had no <code>sudo</code> package, and nginx rejected a directive:</p>
<div class="out">  + chep khoa
/root/ops/ngay1.sh: line 23: visudo: command not found
  ✓ sshd: passwordauthentication no
…
2026/09/29 09:25:10 [emerg] 1761#1761: unknown directive "http2" in /etc/nginx/sites-enabled/phongkham:9
nginx: configuration file /etc/nginx/nginx.conf test failed
  = https://phongkham.test/ -&gt; 000
ngay1: HONG o dong 83: curl -s -o /dev/null -w '  = https://%{url.host}/ -&gt; %{http_code}\\n' --resolve $TEN:443:127.0.0.1 -k https://$TEN/</div>
<p>Two lessons in one run, each on its own slide below: why <code>set -e</code> did not stop at <code>visudo</code>, and why <code>http2 on;</code> is unknown.</p>
<p><strong>Run 3 — the page was fine, the check said 000.</strong></p>
<div class="out">  ✓ nginx :443
  = https://phongkham.test/ -&gt; 000</div>
<p>A few seconds later the same <code>curl</code> typed by hand returned 200. The check had run before nginx's new workers were listening on 443.</p>
<p><strong>Run 4 — every line ✓, 200, 2.4 seconds.</strong> Running it again on a machine that is already correct is the proof of idempotency: nothing is reinstalled, nothing restarted except one reload.</p>
<p><strong>Run 5 — from outside, the password was still offered.</strong> An SSH attempt with public keys disabled:</p>
<div class="out">deploy@127.0.0.1: Permission denied (publickey,password).</div>
<p><code>(publickey,password)</code> means the server still offers password login, although <code>sshd -T</code> inside the script had printed <code>passwordauthentication no</code>. <code>sshd -T</code> parses the configuration <em>files</em>; the sshd that is already running keeps the configuration it loaded at start until it is told to reload. After adding the reload (HUP to the pid in <code>/run/sshd.pid</code>, or <code>systemctl reload ssh</code> on a real VPS) the same attempt says <code>Permission denied (publickey).</code> This is the same family as the project's real SSH hardening story (CLAUDE.md, 18/09/2026), where a drop-in named <code>70-…</code> lost to cloud-init's <code>50-…</code>: "written" and "exit code 0" never meant "in effect". The acceptance test is always from outside.</p>

<h3>Why <code>set -e</code> did not stop at <code>visudo</code></h3>
${slide('dv-15', 6, 'set -e không bắt lỗi nằm giữa một chuỗi lệnh nối')}
<p>The early version checked and installed the sudoers file in one line:</p>
<pre><code class="language-bash">visudo -cqf /tmp/sudoers.pk &amp;&amp; install -m 440 /tmp/sudoers.pk /etc/sudoers.d/phongkham &amp;&amp; ok "sudoers mot dong"</code></pre>
<p>The Bash manual lists the cases where <code>set -e</code> does <em>not</em> exit. One of them: the failing command is "part of any command executed in a <code>&amp;&amp;</code> or <code>||</code> list except the command following the final <code>&amp;&amp;</code> or <code>||</code>". <code>visudo</code> failed with "command not found" (127), the list stopped, nothing was installed, and the script moved on to SSH — leaving a <code>deploy</code> user with no sudo line at all. The same thing happened to <code>nginx -t -q &amp;&amp; nginx -s reload &amp;&amp; ok</code>: the configuration was invalid, and the script continued until <code>curl</code>, a command standing on its own, failed and fired <code>trap … ERR</code>.</p>
<p>The rule that follows is mechanical: <strong>a check that must pass stands on its own line</strong>. <code>&amp;&amp;</code> means "do B if A happened to succeed", not "A must succeed". The final script runs <code>visudo -cqf</code> alone, then uses <code>cmp -s … &amp;&amp; ok || install</code> only for the "is it already there?" decision, where either outcome is acceptable.</p>

<h3>nginx: a directive that did not exist yet, and a reload that returns early</h3>
${slide('dv-15', 7, 'reload trả về trước khi cấu hình mới chạy')}
<p><strong><code>http2 on;</code></strong> is how the nginx documentation shows HTTP/2 today, and the documentation says why it failed: "This directive appeared in version 1.25.1." Ubuntu 24.04 ships nginx 1.24.0, where HTTP/2 is a parameter of <code>listen</code>: <code>listen 443 ssl http2;</code>. Copy configuration from the documentation of the version you run, not the latest page — and let <code>nginx -t</code> run before every reload, which is exactly what caught it.</p>
<p><strong>The 000.</strong> <code>nginx -s reload</code> sends SIGHUP to the master process and exits immediately. According to nginx's "Controlling nginx" page, the master then checks the configuration, opens the new listening sockets, starts <em>new</em> worker processes and only then asks the old ones to finish gracefully. Port 443 did not exist in the previous configuration, so for a few hundred milliseconds after the command returned, nothing was listening there. The script now asks up to ten times, half a second apart, and prints which attempt succeeded — on the second machine it was attempt 2, so the race is real and not a one-off. Remember this for Lesson 15.2: every "right after the reload" check — smoke tests, reading the version — must retry with a limit.</p>
<p>One more fix came from reading the fourth run's output rather than a failure: the early script rewrote the site as "port 80 only" in step 5 on <em>every</em> run, then added port 443 back in step 6. On a live server that is two reloads with a moment in between where HTTPS is not configured. 300 requests fired during a rerun all returned 200, so the window was not measurable here — but a script that briefly downgrades production has no reason to exist. Step 5 now writes the port-80-only site only when no certificate exists yet.</p>

<h3>Acceptance from another machine</h3>
${slide('dv-15', 8, 'Nghiệm thu Ngày 1 từ một máy khác')}
<p>Day 1 is not done when the script prints 200 on the VPS; it is done when another machine confirms four things. From <code>dv15-vps2</code>:</p>
<div class="out">$ curl -sI http://phongkham.test/ | head -3
HTTP/1.1 301 Moved Permanently
Server: nginx/1.24.0 (Ubuntu)
Date: Tue, 29 Sep 2026 09:27:02 GMT
$ curl -s --cacert pebble-root.pem https://phongkham.test/
&lt;!doctype html&gt;&lt;meta charset="utf-8"&gt;&lt;title&gt;Phong kham&lt;/title&gt;&lt;h1&gt;Dat lich phong kham — sap ra mat&lt;/h1&gt;
$ echo | openssl s_client -connect phongkham.test:443 -servername phongkham.test -CAfile pebble-root.pem 2&gt;/dev/null \\
    | openssl x509 -noout -subject -issuer -enddate -ext subjectAltName
subject=
issuer=CN = Pebble Intermediate CA 126f52
notAfter=Oct  5 09:25:08 2026 GMT
X509v3 Subject Alternative Name: critical
    DNS:phongkham.test, DNS:www.phongkham.test
$ nmap -Pn -p- phongkham.test
…
Not shown: 65532 filtered tcp ports (no-response)
PORT    STATE SERVICE
22/tcp  open  ssh
80/tcp  open  http
443/tcp open  https
…
Nmap done: 1 IP address (1 host up) scanned in 106.83 seconds</div>
<ul>
<li><strong>HTTP → HTTPS:</strong> 301 on port 80.</li>
<li><strong>A certificate for the right names:</strong> both names in the SAN. The empty <code>subject=</code> is normal for modern ACME certificates: the names live in the SAN extension, which is marked critical. Pebble issued this one for six days; a Let's Encrypt certificate is 90 days by default today, and Chapter 12.2 lists the planned shorter lifetimes.</li>
<li><strong>Exactly three ports:</strong> everything else <code>filtered</code> — ufw drops the probes, which is also why a full scan takes 107 seconds instead of one.</li>
<li><strong>SSH by key only</strong>, and the <code>deploy</code> user's single sudo line:</li>
</ul>
<div class="out">$ ssh -i khoa -o PreferredAuthentications=password -o PubkeyAuthentication=no -p 19152 deploy@127.0.0.1 true
deploy@127.0.0.1: Permission denied (publickey).
$ ssh deploy@… 'sudo -l | tail -2'
User deploy may run the following commands on phongkham-vps:
    (root) NOPASSWD: /opt/phongkham/bin/phat-hanh.sh</div>

<h3>Try it step by step</h3>
<p>The lab is five containers on one Docker network. The VPS needs <code>--privileged</code> (it runs its own Docker, iptables and ufw) and a volume for <code>/var/lib/docker</code>: without it the inner Docker puts overlay filesystems on top of the container's overlay filesystem and fails with <code>failed to mount … fstype: overlay … err: invalid argument</code> — measured on the first attempt of the next lesson.</p>
<pre><code class="language-bash"><span class="tok-comment"># on the Mac: a key in a scratch directory — never your real ~/.ssh</span>
ssh-keygen -t ed25519 -N '' -C dv15-hoc -f khoa
<span class="tok-comment"># image dv15-img: ubuntu:24.04 + openssh-server + khoa.pub in /root/.ssh/authorized_keys, CMD starts sshd</span>
docker build -t dv15-img img/
docker network create --label dvhoc=15 --subnet 172.22.15.0/24 dv15-net
docker volume create --label dvhoc=15 dv15-vps-docker
docker run -d --name dv15-vps --hostname phongkham-vps --label dvhoc=15 --privileged --memory 1536m \\
  --network dv15-net --ip 172.22.15.10 --network-alias phongkham.test --network-alias www.phongkham.test \\
  -v dv15-vps-docker:/var/lib/docker -p 127.0.0.1:19152:22 dv15-img
docker run -d --name dv15-pebble --label dvhoc=15 --network dv15-net --network-alias pebble \\
  -v $PWD/pebble-config.json:/test/config/pebble-config.json:ro \\
  ghcr.io/letsencrypt/pebble:latest -config /test/config/pebble-config.json
<span class="tok-comment"># copy the script and run it as root; REQUESTS_CA_BUNDLE lets certbot trust Pebble's API (Chapter 12.2)</span>
ssh -i khoa -o UserKnownHostsFile=./known_hosts -p 19152 root@127.0.0.1 'cat &gt; /root/ngay1.sh' &lt; ops/ngay1.sh
ssh -i khoa -o UserKnownHostsFile=./known_hosts -p 19152 root@127.0.0.1 \\
  'REQUESTS_CA_BUNDLE=/usr/local/share/pebble-minica.pem ACME=https://pebble:14000/dir CA=/usr/local/share/pebble-root.pem bash /root/ngay1.sh'</code></pre>
<p>Run it twice. The second run must be all ✓ — if it is not, the script is not idempotent yet, and you have found your first bug.</p>

<h3>On Windows/WSL and macOS</h3>
<ul>
<li><strong>CRLF.</strong> If a teammate saves <code>ngay1.sh</code> on Windows with CRLF line endings, the VPS fails on the first line with <code>/usr/bin/env: 'bash\\r': No such file or directory</code> (Linux &amp; Bash 16.4, incident 7). Add <code>*.sh text eol=lf</code> to <code>.gitattributes</code> so Git converts it no matter who commits.</li>
<li><strong>SSH keys on Windows.</strong> OpenSSH on Windows refuses a private key readable by other users ("UNPROTECTED PRIVATE KEY FILE"); fix the file's ACL, or run everything from inside WSL where <code>chmod 600</code> works.</li>
<li><strong>macOS.</strong> The Mac only drives SSH here, and nothing in <code>ngay1.sh</code> runs on it. But the scripts of the next lessons use <code>flock</code> and GNU <code>date -d</code>, neither of which exists on macOS — which is one more reason those scripts run on the VPS, not on the build machine.</li>
</ul>

<h3>When a Day-1 script is the right tool — and when it is not</h3>
<ul>
<li><strong>Use it</strong> for one to three servers you own: it is readable, lives in the repository, and a second machine is one command away (this lesson did exactly that).</li>
<li><strong>Use cloud-init</strong> when the provider supports it: the same steps run at first boot, before you ever log in.</li>
<li><strong>Move to Ansible or Terraform</strong> when you have many machines or several people changing them; idempotency and drift reports then come built in.</li>
<li><strong>Skip it</strong> on a PaaS (Chapter 14.3): there is no machine to prepare.</li>
</ul>

<div class="pitfall co-tieu-de"><strong>Trap — accepting Day 1 from inside the server.</strong> Every check inside <code>ngay1.sh</code> passed on run 5, including <code>passwordauthentication no</code>; only a login attempt from outside showed that password login was still on. The same applies to the certificate (read it on the wire with <code>openssl s_client</code>), the firewall (scan from another machine) and HTTPS (fetch it by name). A check run on the server tests the server's view of itself.</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Build <code>dv15-img</code> (Ubuntu 24.04, openssh-server, your scratch key for root) and start a bare VPS as above, plus Pebble.</li>
<li>Remove <code>export DEBIAN_FRONTEND=noninteractive</code> from your copy of <code>ngay1.sh</code> and run it. When it hangs, find the waiting process from a second SSH session with <code>ps -ef | grep -E 'apt|dpkg|debconf'</code>. Put the line back, recreate the VPS, run again.</li>
<li>Run the script a second time and check that every line is ✓.</li>
<li>From another container on the same network: <code>curl -sI http://phongkham.test/</code>, <code>curl --cacert … https://phongkham.test/</code>, <code>nmap -Pn -p- phongkham.test</code>, and an SSH attempt with <code>-o PubkeyAuthentication=no</code>.</li>
</ol>
<p><strong>Done when:</strong> the second run prints only ✓ and <code>-&gt; 200</code>; from the other machine you get a 301, the "coming soon" page over HTTPS, exactly three open ports, and <code>Permission denied (publickey).</code> with no <code>password</code> in the list.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">bare VPS</span><span class="v">A server as the provider delivers it: an OS, sshd, and your key for root — nothing else.</span></div>
  <div class="kv"><span class="k">idempotent</span><span class="v">Running it twice leaves the machine exactly as running it once; the second run is a check.</span></div>
  <div class="kv"><span class="k">debconf / <code>DEBIAN_FRONTEND</code></span><span class="v">Debian's package-question system; <code>noninteractive</code> makes it take defaults instead of waiting for an answer.</span></div>
  <div class="kv"><span class="k">sudoers drop-in</span><span class="v">A file in <code>/etc/sudoers.d/</code>; checked with <code>visudo -cqf</code> before installing, since a bad one disables sudo.</span></div>
  <div class="kv"><span class="k">effective configuration</span><span class="v">What a running daemon actually uses — not necessarily what is in its files until it reloads.</span></div>
  <div class="kv"><span class="k">SIGHUP reload</span><span class="v">nginx and sshd re-read configuration on HUP; the command that sends it returns before the new configuration is serving.</span></div>
  <div class="kv"><span class="k">acceptance test</span><span class="v">The checks that decide "done", run from where users stand — another machine, by name, over HTTPS.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Day 1 is a script in the repository, run as root once over SSH, and the second run must change nothing.</li>
<li>Five real runs found five bugs no reading would find: a hidden <code>tzdata</code> prompt, a missing <code>sudo</code>, an nginx directive from a newer version, a reload race, and sshd not reloaded.</li>
<li><code>set -e</code> ignores failures inside <code>&amp;&amp;</code> chains: a check that must pass stands on its own line.</li>
<li>The <code>deploy</code> user gets one sudo command and no <code>docker</code> group — that group is root.</li>
<li>Docker log rotation, a three-port firewall and HTTPS from ACME are part of Day 1, not "later".</li>
<li>Accept Day 1 from another machine: a 301, a certificate for the right names, three ports, and keys only.</li>
</ul>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Bash Reference Manual — The Set Builtin</span><span class="lc-sub">gnu.org/software/bash/manual/html_node/The-Set-Builtin.html — the exact list of places where <code>set -e</code> does not exit.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nginx — Controlling nginx</span><span class="lc-sub">nginx.org/en/docs/control.html — what HUP does, and why the new workers start after the command returns.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nginx — ngx_http_v2_module</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_v2_module.html — "This directive appeared in version 1.25.1."</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">sshd(8)</span><span class="lc-sub">man7.org/linux/man-pages/man8/sshd.8.html — <code>-t</code>, <code>-T</code>, and reloading on SIGHUP.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Certbot User Guide</span><span class="lc-sub">eff-certbot.readthedocs.io/en/stable/using.html — <code>certonly</code>, <code>--webroot</code>, hooks, renewal.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">Pebble</span><span class="lc-sub">github.com/letsencrypt/pebble — the test ACME server used instead of Let's Encrypt.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — Chapter 16: the capstone server</span><span class="lc-sub">/courses/linux-bash/learn${REF} — system users, an idempotent bootstrap, systemd units and timers, logrotate.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.1</span>
<h2>Ngày 1: từ một máy trần tới trang "sắp ra mắt" qua HTTPS</h2>
<p class="lead">Nhóm SWP391 của bạn còn ba ngày trước buổi bảo vệ, có một app đặt lịch phòng khám chạy ngon trên laptop của cả nhóm, và một VPS Ubuntu 24.04 mới tinh mà bên trong chỉ có sshd cùng khoá công khai bạn đã tải lên trang nhà cung cấp. Ngày 1 kết thúc khi một bạn ngồi ở mạng khác mở <code>https://phongkham.test/</code> và thấy trang "sắp ra mắt" với chứng chỉ hợp lệ — và khi con đường dẫn tới đó là một script mà mai bạn chạy lại được trên máy thứ hai. Bài này viết script đó, chạy nó trên một cái máy không có gì, và kể năm lần chạy mới đúng. Không lỗi nào trong năm lỗi đó thấy được bằng cách đọc script.</p>

<h3>Dự án xuyên suốt chương</h3>
${slide('dv-15', 3, 'Toàn cảnh dự án: năm máy, một ứng dụng')}
<p>Ứng dụng cố ý nhỏ để cả chương nói về việc ĐƯA nó lên chứ không phải việc VIẾT nó: một API Node 22 dài 35 dòng dùng thư viện <code>pg</code>, một bảng <code>lich_hen</code> (lịch hẹn), một trang tĩnh, và một <code>migrate.js</code> áp các tệp SQL theo thứ tự. Thứ không nhỏ là mọi thứ quanh nó. Năm cái máy tham gia, tất cả là container trên một máy Mac, để không có gì thật bị đặt vào rủi ro:</p>
<table>
<tr><th>Máy</th><th>Đóng vai</th><th>Chạy gì ở đó</th></tr>
<tr><td>máy Mac</td><td>máy build (chính là "máy nhà" của <code>deploy-nha.sh</code>)</td><td><code>git archive</code>, <code>docker build</code>, kiểm ảnh, <code>docker push</code></td></tr>
<tr><td><code>dv15-reg</code></td><td>registry (GHCR trong dự án thật)</td><td><code>registry:2</code>; Mac đẩy vào <code>localhost:19155</code></td></tr>
<tr><td><code>dv15-vps</code></td><td>VPS, tên <code>phongkham.test</code></td><td>nginx, hai container app (xanh/lam), Postgres, ufw, bản sao lưu</td></tr>
<tr><td><code>dv15-vps2</code></td><td>"một chỗ khác trên Internet"</td><td>một khách hàng đo mọi lần phát hành, nơi phục hồi, người canh từ ngoài</td></tr>
<tr><td><code>dv15-pebble</code>, <code>dv15-hook</code></td><td>Let's Encrypt; một webhook Discord/Telegram</td><td>Pebble (máy chủ ACME thử); một tiến trình Node in ra mọi POST</td></tr>
</table>
<p>Mọi script nằm trong kho mã, thư mục <code>ops/</code>, ngay cạnh app:</p>
<pre><code>phongkham/
├── app/server.js  migrate.js  package.json  public/index.html
├── app/migrations/001_lich_hen.sql  002_…  003_…
├── Dockerfile
└── ops/
    ├── ngay1.sh         <span class="tok-comment"># 15.1 — VPS trần → HTTPS "sắp ra mắt"</span>
    ├── chuan-bi-app.sh  <span class="tok-comment"># 15.2 — mạng, CSDL, bí mật, upstream nginx (một lần)</span>
    ├── deploy.sh        <span class="tok-comment"># 15.2 — chạy trên máy build</span>
    ├── kiem-anh.sh      <span class="tok-comment"># 15.2 — từ chối đẩy một ảnh không chạy nổi</span>
    ├── phat-hanh.sh     <span class="tok-comment"># 15.2 — chạy trên VPS: khoá, migration, xanh/lam, smoke</span>
    ├── sao-luu.sh  phuc-hoi.sh  canh.sh   <span class="tok-comment"># 15.3</span></code></pre>
<p><strong>Chương này không dạy lại gì.</strong> Khoá Linux &amp; Bash, Chương 16, đã dựng một máy chủ bằng tay và bằng script: người dùng hệ thống với <code>nologin</code>, một cây thư mục mà thư mục nào cũng có đúng một chủ, <code>bootstrap.sh</code> chạy lại không hỏng, SSH siết lại và nghiệm thu bằng <code>sshd -T</code>, unit và timer systemd, logrotate. Những thứ đó xem ở bên ấy. Chương này thêm những gì dự án kia chưa có: container kéo từ registry, một migration CSDL nằm giữa lần phát hành, xanh/lam sau nginx, HTTPS từ máy chủ ACME, và bản sao lưu được phục hồi trên một máy khác.</p>
<table>
<tr><th>Linux &amp; Bash, Chương 16</th><th>Chương này</th></tr>
<tr><td>app chạy như dịch vụ systemd từ một thư mục bản phát hành</td><td>app chạy như container kéo về theo tag; VPS không bao giờ build</td></tr>
<tr><td>tệp SQLite, không có migration</td><td>PostgreSQL với migration mở rộng/thu hẹp và trần thời gian chờ khoá</td></tr>
<tr><td>HTTP ở cổng 80</td><td>HTTPS từ ACME, cổng 80 chỉ còn cho thử thách ACME và chuyển hướng</td></tr>
<tr><td>deploy = khởi động lại dịch vụ</td><td>màu mới đứng cạnh màu cũ, nginx chuyển sang, màu cũ xả rồi tắt</td></tr>
<tr><td>bản sao lưu nằm cùng máy</td><td>bản sao lưu được kéo sang máy khác và phục hồi có bấm giờ</td></tr>
</table>

<h3>Ngày 1 trong sáu bước</h3>
${slide('dv-15', 4, 'Ngày 1: sáu bước, 52 giây trên một máy mới tinh')}
<p>VPS được giao đúng như phần lớn nhà cung cấp giao: root đăng nhập được bằng khoá bạn đã tải lên, ngoài ra chưa cài gì. <code>ngay1.sh</code> biến nó thành một máy sẵn sàng nhận lần phát hành đầu tiên. Nó chạy bằng root, một lần, qua SSH, và chạy lại thì không được đổi gì. Đây là bản cuối, sau năm lần chạy kể ở phần dưới:</p>
<pre><code class="language-bash">#!/usr/bin/env bash
<span class="tok-comment"># ngay1.sh — VPS Ubuntu 24.04 moi tinh -&gt; san sang nhan ban phat hanh dau tien.</span>
<span class="tok-comment"># Chay bang root MOT lan (chay lai van an toan). Dung may + SSH + ufw chi tiet: khoa Linux Bai 16.1.</span>
set -Eeuo pipefail
export DEBIAN_FRONTEND=noninteractive   <span class="tok-comment"># khong co dong nay: tzdata HOI mui gio va treo mai (do that lan 1)</span>
trap 'echo "ngay1: HONG o dong $LINENO: $BASH_COMMAND" &gt;&amp;2' ERR
TEN=\${TEN:-phongkham.test}
ok() { printf '  ✓ %s\\n' "$*"; }
lam() { printf '  + %s\\n' "$*"; }

echo "[1/6] goi phan mem"
need=(sudo docker.io docker-compose-v2 nginx certbot ufw curl jq)
thieu=(); for g in "\${need[@]}"; do dpkg -s "$g" &gt;/dev/null 2&gt;&amp;1 || thieu+=("$g"); done
if ((\${#thieu[@]})); then lam "cai \${thieu[*]}"; apt-get update -qq; apt-get install -y -qq --no-install-recommends "\${thieu[@]}" &gt;/dev/null
else ok "du goi"; fi

echo "[2/6] nguoi dung deploy: chi SSH bang khoa, chi duoc chay MOT lenh bang sudo"
id deploy &gt;/dev/null 2&gt;&amp;1 || { useradd -m -s /bin/bash deploy; lam "tao deploy"; }
install -d -o deploy -g deploy -m 700 /home/deploy/.ssh
cmp -s /root/.ssh/authorized_keys /home/deploy/.ssh/authorized_keys || {
  install -o deploy -g deploy -m 600 /root/.ssh/authorized_keys /home/deploy/.ssh/authorized_keys; lam "chep khoa"; }
echo 'deploy ALL=(root) NOPASSWD: /opt/phongkham/bin/phat-hanh.sh' &gt; /tmp/sudoers.pk
visudo -cqf /tmp/sudoers.pk            <span class="tok-comment"># sai cu phap sudoers = mat sudo -&gt; kiem TRUOC khi cai</span>
cmp -s /tmp/sudoers.pk /etc/sudoers.d/phongkham &amp;&amp; ok "sudoers mot dong" || { install -m 440 /tmp/sudoers.pk /etc/sudoers.d/phongkham; lam "sudoers mot dong"; }
printf 'PasswordAuthentication no\\nKbdInteractiveAuthentication no\\nPermitRootLogin prohibit-password\\n' &gt; /etc/ssh/sshd_config.d/01-chi-khoa.conf
sshd -t
<span class="tok-comment"># sshd -T chi doc TEP; sshd dang chay van giu cau hinh cu toi khi duoc nap lai (do that: lan 2 quen buoc nay)</span>
if [ -d /run/systemd/system ]; then systemctl reload ssh; else kill -HUP "$(cat /run/sshd.pid)"; fi
ok "sshd: $(sshd -T | grep -E '^passwordauthentication') (da nap lai)"

echo "[3/6] Docker: xoay log, registry noi bo"
install -d /etc/docker
cat &gt; /tmp/daemon.json &lt;&lt;J
{ "log-driver": "json-file", "log-opts": { "max-size": "10m", "max-file": "3" },
  "insecure-registries": ["dv15-reg:5000"] }
J
cmp -s /tmp/daemon.json /etc/docker/daemon.json &amp;&amp; ok "daemon.json" || { install -m 644 /tmp/daemon.json /etc/docker/daemon.json; lam "daemon.json moi"; pkill dockerd || true; }
if [ -d /run/systemd/system ]; then systemctl enable --now docker &gt;/dev/null
else pgrep -x dockerd &gt;/dev/null || { dockerd &gt;/var/log/dockerd.log 2&gt;&amp;1 &amp; }; fi   <span class="tok-comment"># container thi nghiem khong co systemd</span>
for i in $(seq 1 20); do docker info &gt;/dev/null 2&gt;&amp;1 &amp;&amp; break; sleep 1; done
ok "docker $(docker version -f '{{.Server.Version}}')"

echo "[4/6] tuong lua: chi 22, 80, 443"
ufw default deny incoming &gt;/dev/null; ufw default allow outgoing &gt;/dev/null
ufw allow 22,80,443/tcp &gt;/dev/null
ufw --force enable &gt;/dev/null &amp;&amp; ok "$(ufw status | head -1)"

echo "[5/6] nginx: cong 80 chi con ACME + chuyen sang https"
install -d /var/www/acme /var/www/sap-ra-mat /opt/phongkham/bin /etc/phongkham /var/log/phongkham /var/backups/phongkham
cat &gt; /var/www/sap-ra-mat/index.html &lt;&lt;H
&lt;!doctype html&gt;&lt;meta charset="utf-8"&gt;&lt;title&gt;Phong kham&lt;/title&gt;&lt;h1&gt;Dat lich phong kham — sap ra mat&lt;/h1&gt;
H
if [ ! -e /etc/letsencrypt/live/$TEN/fullchain.pem ]; then   <span class="tok-comment"># chay lai tren may dang song: KHONG ha ve ban chi-co-80</span>
cat &gt; /etc/nginx/sites-available/phongkham &lt;&lt;N
server {
    listen 80;
    server_name $TEN www.$TEN;
    location /.well-known/acme-challenge/ { root /var/www/acme; }
    location / { return 301 https://\\$host\\$request_uri; }
}
N
fi
ln -sf ../sites-available/phongkham /etc/nginx/sites-enabled/phongkham; rm -f /etc/nginx/sites-enabled/default
nginx -t -q; if pgrep -x nginx &gt;/dev/null; then nginx -s reload; else nginx; fi; ok "nginx :80"

echo "[6/6] chung chi (ACME, webroot) + trang 'sap ra mat' qua HTTPS"
if [ ! -e /etc/letsencrypt/live/$TEN/fullchain.pem ]; then
  certbot certonly -n --agree-tos -m nhom@$TEN --webroot -w /var/www/acme -d $TEN -d www.$TEN \\
    --server "\${ACME:-https://acme-v02.api.letsencrypt.org/directory}" --deploy-hook 'nginx -s reload' &gt;/dev/null
  lam "xin chung chi $TEN"
else ok "chung chi da co"; fi
cat &gt; /etc/nginx/sites-available/phongkham &lt;&lt;N
server {
    listen 80;
    server_name $TEN www.$TEN;
    location /.well-known/acme-challenge/ { root /var/www/acme; }
    location / { return 301 https://\\$host\\$request_uri; }
}
server {
    listen 443 ssl http2;             <span class="tok-comment"># nginx 1.24 cua Ubuntu 24.04: chua co chi thi 'http2 on;' (1.25.1+)</span>
    server_name $TEN www.$TEN;
    ssl_certificate     /etc/letsencrypt/live/$TEN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$TEN/privkey.pem;
    root /var/www/sap-ra-mat;
}
N
nginx -t -q
nginx -s reload; ok "nginx :443"
<span class="tok-comment"># reload chi GUI tin hieu roi tra ve ngay; worker moi mo cong 443 SAU do vai tram ms -&gt; hoi lai toi 5 s</span>
for i in $(seq 1 10); do
  ma=$(curl -s -o /dev/null -w '%{http_code}' --resolve $TEN:443:127.0.0.1 --cacert "\${CA:-/etc/ssl/certs/ca-certificates.crt}" https://$TEN/) &amp;&amp; break
  sleep 0.5
done
echo "  = https://$TEN/ -&gt; $ma (lan hoi thu $i)"; [ "$ma" = 200 ]</code></pre>
<p>Chú thích và thông báo cố ý viết không dấu: output của script được đọc qua phiên SSH từ máy Windows của bạn cùng nhóm và trong log CI, và chữ ASCII trơn sống sót qua mọi terminal, mọi bảng mã. Sáu bước, và vì sao mỗi bước có hình dạng đó:</p>
<ol>
<li><strong>Gói phần mềm.</strong> Hỏi <code>dpkg -s</code> xem gói nào còn thiếu và chỉ cài gói đó, để lần chạy thứ hai in "du goi" (đủ gói) và không đụng vào gì. <code>--no-install-recommends</code> giữ cho VPS nhỏ luôn nhỏ.</li>
<li><strong>Người dùng <code>deploy</code>.</strong> Đăng nhập bằng đúng khoá của root, và được chạy đúng MỘT lệnh bằng quyền root: <code>/opt/phongkham/bin/phat-hanh.sh</code>. Nó cố ý KHÔNG nằm trong nhóm <code>docker</code>: nhóm đó khởi động được một container gắn cả <code>/</code> của máy chủ vào, nên là thành viên nhóm <code>docker</code> cũng như là root. Tệp sudoers được kiểm bằng <code>visudo -cqf</code> trước khi cài, vì một lỗi cú pháp trong <code>/etc/sudoers.d/</code> làm sudo chết với tất cả mọi người.</li>
<li><strong>Docker.</strong> <code>daemon.json</code> đặt xoay vòng log cho mọi container (10 MB × 3 tệp — Bài 15.4 đo chuyện gì xảy ra khi thiếu nó) và, CHỈ trong phòng thí nghiệm, tin registry cục bộ qua HTTP thường. Một registry thật như GHCR đi HTTPS, không cần dòng đó.</li>
<li><strong>Tường lửa.</strong> Chặn mọi thứ đi vào, mở 22, 80 và 443. Luật cho SSH phải có TRƯỚC <code>ufw enable</code>. Nhớ Chương 12.3: cổng mà Docker publish đi vòng qua các luật này, nên CSDL sẽ không bao giờ được publish.</li>
<li><strong>nginx ở cổng 80.</strong> Chỉ hai việc: thư mục thử thách ACME, và 301 sang HTTPS cho mọi thứ còn lại.</li>
<li><strong>Chứng chỉ và HTTPS.</strong> <code>certbot certonly --webroot</code> ghi tệp thử thách đúng chỗ nginx phục vụ; <code>--deploy-hook 'nginx -s reload'</code> được lưu vào cấu hình gia hạn, nên mọi lần gia hạn về sau đều nạp lại nginx (Chương 12.2 đã đo cảnh thiếu nó). Trong phòng thí nghiệm <code>ACME</code> trỏ vào Pebble; trên VPS thật dòng đó tự rơi về Let's Encrypt.</li>
</ol>
<table>
<tr><th>Cờ</th><th>Nghĩa ở đây</th></tr>
<tr><td><code>apt-get -qq</code></td><td>im lặng: chỉ lỗi mới hiện ra terminal</td></tr>
<tr><td><code>--no-install-recommends</code></td><td>cài phụ thuộc, bỏ các gói "nên có" đi kèm</td></tr>
<tr><td><code>useradd -m -s /bin/bash</code></td><td>tạo thư mục nhà; cho một shell đăng nhập (SSH cần nó)</td></tr>
<tr><td><code>install -d -o -g -m</code></td><td>tạo thư mục kèm chủ, nhóm và quyền trong một bước</td></tr>
<tr><td><code>visudo -cqf TỆP</code></td><td>kiểm (<code>-c</code>) một tệp (<code>-f</code>) trong im lặng (<code>-q</code>); sai cú pháp thì mã thoát khác 0</td></tr>
<tr><td><code>sshd -t</code> / <code>sshd -T</code></td><td>kiểm các tệp cấu hình / in giá trị hiệu lực <em>đọc từ tệp</em></td></tr>
<tr><td><code>certbot certonly -n --agree-tos -m</code></td><td>chỉ xin (không sửa nginx), không hỏi, chấp nhận điều khoản, email liên hệ</td></tr>
<tr><td><code>--webroot -w DIR -d TÊN</code></td><td>HTTP-01 bằng cách ghi tệp vào DIR; mỗi tên một <code>-d</code></td></tr>
<tr><td><code>--server URL</code></td><td>thư mục ACME nào; bỏ trống = Let's Encrypt thật</td></tr>
<tr><td><code>--deploy-hook LỆNH</code></td><td>chạy LỆNH sau mỗi lần cấp hoặc gia hạn thành công</td></tr>
<tr><td><code>curl --resolve TÊN:443:IP</code></td><td>nối vào IP nhưng gửi TÊN trong SNI và Host — thử một tên trước khi DNS trỏ vào máy</td></tr>
</table>
<p>Trên máy thứ hai, mới tinh hoàn toàn, cả Ngày 1 mất 52 giây:</p>
<div class="out">[1/6] goi phan mem
  + cai sudo docker.io docker-compose-v2 nginx certbot ufw curl jq
debconf: delaying package configuration, since apt-utils is not installed
[2/6] nguoi dung deploy: chi SSH bang khoa, chi duoc chay MOT lenh bang sudo
  + tao deploy
  + chep khoa
  + sudoers mot dong
  ✓ sshd: passwordauthentication no (da nap lai)
[3/6] Docker: xoay log, registry noi bo
  + daemon.json moi
  ✓ docker 29.1.3
[4/6] tuong lua: chi 22, 80, 443
  ✓ Status: active
[5/6] nginx: cong 80 chi con ACME + chuyen sang https
  ✓ nginx :80
[6/6] chung chi (ACME, webroot) + trang 'sap ra mat' qua HTTPS
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Hook 'deploy-hook' ran with error output:
 2026/09/29 09:31:32 [notice] 1791#1791: signal process started
  + xin chung chi phongkham.test
2026/09/29 09:31:32 [notice] 1804#1804: signal process started
  ✓ nginx :443
  = https://phongkham.test/ -&gt; 200 (lan hoi thu 2)

real	0m52.586s</div>
<p>Đọc kỹ hai dòng. <code>Hook 'deploy-hook' ran with error output</code> không phải lỗi: nginx ghi dòng <code>[notice] signal process started</code> ra stderr, và certbot báo mọi thứ nằm trên stderr theo cách đó. Còn <code>(lan hoi thu 2)</code> — "lần hỏi thứ 2" — chính là lý do có vòng lặp cuối script, giải thích ở dưới.</p>

<h3>Chạy thật: năm lần mới đúng</h3>
${slide('dv-15', 5, 'Script Ngày 1 phải chạy năm lần mới đúng')}
<p>Máy thứ nhất nhận script ở dạng ban đầu. Mọi cú hỏng dưới đây đều dựng lại được, và không cái nào lộ ra khi đọc mã:</p>
<p><strong>Lần 1 — 6 phút 11 giây im lặng.</strong> Output dừng sau một dòng:</p>
<div class="out">[1/6] goi phan mem
  + cai docker.io docker-compose-v2 nginx certbot ufw curl jq
debconf: delaying package configuration, since apt-utils is not installed</div>
<p>Trên VPS, <code>ps</code> cho thấy script cấu hình của gói <code>tzdata</code> đang chờ ở một câu hỏi không bao giờ tới được phiên SSH: "Geographic area:" (khu vực địa lý). Một lệnh SSH không có terminal thì không có ai trả lời, nên nó chờ mãi. Giết nó thì bẫy in ra thông báo và thời gian đã trôi:</p>
<div class="out">E: Sub-process /usr/bin/dpkg returned an error code (1)
ngay1: HONG o dong 13: apt-get install -y -qq --no-install-recommends "\${thieu[@]}" &gt; /dev/null

real	6m11.531s</div>
<p>Sửa bằng một dòng, <code>export DEBIAN_FRONTEND=noninteractive</code>: debconf (hệ thống hỏi-đáp của gói Debian) khi đó lấy mọi giá trị mặc định thay vì hỏi. Script nào chạy <code>apt-get</code> qua SSH hay trong CI cũng cần nó.</p>
<p><strong>Lần 2 — hai cú hỏng, và script vẫn chạy tiếp.</strong> Ảnh tối giản không có gói <code>sudo</code>, và nginx từ chối một chỉ thị:</p>
<div class="out">  + chep khoa
/root/ops/ngay1.sh: line 23: visudo: command not found
  ✓ sshd: passwordauthentication no
…
2026/09/29 09:25:10 [emerg] 1761#1761: unknown directive "http2" in /etc/nginx/sites-enabled/phongkham:9
nginx: configuration file /etc/nginx/nginx.conf test failed
  = https://phongkham.test/ -&gt; 000
ngay1: HONG o dong 83: curl -s -o /dev/null -w '  = https://%{url.host}/ -&gt; %{http_code}\\n' --resolve $TEN:443:127.0.0.1 -k https://$TEN/</div>
<p>Hai bài học trong một lần chạy, mỗi bài một slide ở dưới: vì sao <code>set -e</code> không dừng ở <code>visudo</code>, và vì sao <code>http2 on;</code> là chỉ thị lạ.</p>
<p><strong>Lần 3 — trang vẫn tốt, phép kiểm báo 000.</strong></p>
<div class="out">  ✓ nginx :443
  = https://phongkham.test/ -&gt; 000</div>
<p>Vài giây sau, gõ tay đúng lệnh <code>curl</code> đó thì được 200. Phép kiểm đã chạy trước khi các worker mới của nginx kịp nghe ở cổng 443.</p>
<p><strong>Lần 4 — mọi dòng ✓, 200, 2,4 giây.</strong> Chạy lại trên một máy đã đúng chính là bằng chứng của tính chạy-lại-được: không cài lại gì, không khởi động lại gì ngoài một lần nạp lại.</p>
<p><strong>Lần 5 — từ bên ngoài, máy vẫn mời nhập mật khẩu.</strong> Một lần thử SSH đã tắt khoá công khai:</p>
<div class="out">deploy@127.0.0.1: Permission denied (publickey,password).</div>
<p><code>(publickey,password)</code> nghĩa là máy chủ vẫn mời đăng nhập bằng mật khẩu, dù <code>sshd -T</code> trong script đã in <code>passwordauthentication no</code>. <code>sshd -T</code> phân tích các TỆP cấu hình; còn sshd đang chạy thì giữ cấu hình nó nạp lúc khởi động cho tới khi được bảo nạp lại. Thêm bước nạp lại (gửi HUP tới pid trong <code>/run/sshd.pid</code>, hoặc <code>systemctl reload ssh</code> trên VPS thật) thì cùng lần thử đó báo <code>Permission denied (publickey).</code> Đây cùng họ với chuyện siết SSH thật của dự án (CLAUDE.md, 18/09/2026), khi một drop-in tên <code>70-…</code> thua tệp <code>50-…</code> của cloud-init: "đã ghi" và "mã thoát 0" chưa bao giờ có nghĩa là "đã có hiệu lực". Nghiệm thu luôn luôn làm từ bên ngoài.</p>

<h3>Vì sao <code>set -e</code> không dừng ở <code>visudo</code></h3>
${slide('dv-15', 6, 'set -e không bắt lỗi nằm giữa một chuỗi lệnh nối')}
<p>Bản đầu kiểm và cài tệp sudoers trên cùng một dòng:</p>
<pre><code class="language-bash">visudo -cqf /tmp/sudoers.pk &amp;&amp; install -m 440 /tmp/sudoers.pk /etc/sudoers.d/phongkham &amp;&amp; ok "sudoers mot dong"</code></pre>
<p>Tài liệu Bash liệt kê những chỗ <code>set -e</code> KHÔNG thoát. Một trong số đó: lệnh hỏng là "một phần của bất kỳ lệnh nào chạy trong danh sách <code>&amp;&amp;</code> hoặc <code>||</code>, trừ lệnh đứng sau <code>&amp;&amp;</code> hoặc <code>||</code> cuối cùng". <code>visudo</code> hỏng với "command not found" (mã 127), cả chuỗi dừng, không cài gì cả, và script đi tiếp sang SSH — để lại một người dùng <code>deploy</code> không có dòng sudo nào. Chuyện y hệt xảy ra với <code>nginx -t -q &amp;&amp; nginx -s reload &amp;&amp; ok</code>: cấu hình sai, script vẫn chạy tiếp tới <code>curl</code> — một lệnh đứng riêng — hỏng và kích hoạt <code>trap … ERR</code>.</p>
<p>Luật rút ra rất máy móc: <strong>phép kiểm bắt buộc phải qua thì đứng riêng một dòng</strong>. <code>&amp;&amp;</code> nghĩa là "làm B nếu A tình cờ thành công", không phải "A bắt buộc thành công". Bản cuối chạy <code>visudo -cqf</code> đứng riêng, rồi chỉ dùng <code>cmp -s … &amp;&amp; ok || install</code> cho câu hỏi "đã có sẵn chưa?", nơi kết quả nào cũng chấp nhận được.</p>

<h3>nginx: một chỉ thị chưa ra đời, và một lần nạp lại trả về quá sớm</h3>
${slide('dv-15', 7, 'reload trả về trước khi cấu hình mới chạy')}
<p><strong><code>http2 on;</code></strong> là cách tài liệu nginx hiện nay bật HTTP/2, và chính tài liệu nói vì sao nó hỏng: "This directive appeared in version 1.25.1" (chỉ thị này xuất hiện từ bản 1.25.1). Ubuntu 24.04 đi kèm nginx 1.24.0, nơi HTTP/2 là một tham số của <code>listen</code>: <code>listen 443 ssl http2;</code>. Chép cấu hình từ tài liệu của đúng phiên bản bạn chạy, không phải trang mới nhất — và để <code>nginx -t</code> chạy trước mọi lần nạp lại, vì chính nó đã bắt được lỗi này.</p>
<p><strong>Con số 000.</strong> <code>nginx -s reload</code> gửi SIGHUP cho tiến trình master rồi thoát ngay. Theo trang "Controlling nginx", master sau đó kiểm cấu hình, mở các socket nghe mới, khởi động worker MỚI, rồi mới bảo worker cũ tắt dần. Cấu hình trước không có cổng 443, nên trong vài trăm mili-giây sau khi lệnh trả về, chưa có ai nghe ở đó. Script giờ hỏi tối đa mười lần, cách nhau nửa giây, và in ra lần nào thành công — trên máy thứ hai là lần 2, nên cuộc đua này có thật, không phải trùng hợp. Nhớ điều này cho Bài 15.2: mọi phép kiểm "ngay sau reload" — smoke-test, đọc phiên bản — phải hỏi lại, và có giới hạn.</p>
<p>Còn một chỗ sửa đến từ việc đọc output lần 4 chứ không phải từ một cú hỏng: bản đầu viết lại site thành "chỉ cổng 80" ở bước 5 trong MỌI lần chạy, rồi bước 6 mới thêm lại cổng 443. Trên máy đang phục vụ, đó là hai lần nạp lại với một khoảnh khắc ở giữa mà HTTPS chưa được cấu hình. 300 request bắn ra trong một lần chạy lại đều trả 200, nên ở đây không đo được khe hở đó — nhưng một script khiến production tụt cấp trong chốc lát thì không có lý do gì để tồn tại. Bước 5 giờ chỉ viết site "chỉ cổng 80" khi chưa có chứng chỉ.</p>

<h3>Nghiệm thu từ một máy khác</h3>
${slide('dv-15', 8, 'Nghiệm thu Ngày 1 từ một máy khác')}
<p>Ngày 1 chưa xong khi script in 200 trên VPS; nó xong khi một máy khác xác nhận bốn điều. Từ <code>dv15-vps2</code>:</p>
<div class="out">$ curl -sI http://phongkham.test/ | head -3
HTTP/1.1 301 Moved Permanently
Server: nginx/1.24.0 (Ubuntu)
Date: Tue, 29 Sep 2026 09:27:02 GMT
$ curl -s --cacert pebble-root.pem https://phongkham.test/
&lt;!doctype html&gt;&lt;meta charset="utf-8"&gt;&lt;title&gt;Phong kham&lt;/title&gt;&lt;h1&gt;Dat lich phong kham — sap ra mat&lt;/h1&gt;
$ echo | openssl s_client -connect phongkham.test:443 -servername phongkham.test -CAfile pebble-root.pem 2&gt;/dev/null \\
    | openssl x509 -noout -subject -issuer -enddate -ext subjectAltName
subject=
issuer=CN = Pebble Intermediate CA 126f52
notAfter=Oct  5 09:25:08 2026 GMT
X509v3 Subject Alternative Name: critical
    DNS:phongkham.test, DNS:www.phongkham.test
$ nmap -Pn -p- phongkham.test
…
Not shown: 65532 filtered tcp ports (no-response)
PORT    STATE SERVICE
22/tcp  open  ssh
80/tcp  open  http
443/tcp open  https
…
Nmap done: 1 IP address (1 host up) scanned in 106.83 seconds</div>
<ul>
<li><strong>HTTP → HTTPS:</strong> 301 ở cổng 80.</li>
<li><strong>Chứng chỉ đúng tên:</strong> cả hai tên nằm trong SAN. Dòng <code>subject=</code> trống là bình thường với chứng chỉ ACME hiện đại: tên nằm trong phần mở rộng SAN, được đánh dấu critical (bắt buộc hiểu). Pebble cấp chứng chỉ này sáu ngày; chứng chỉ Let's Encrypt hiện mặc định 90 ngày, và Chương 12.2 có lịch rút ngắn đã công bố.</li>
<li><strong>Đúng ba cổng:</strong> mọi cổng khác <code>filtered</code> — ufw lặng lẽ bỏ gói thăm dò, cũng là lý do quét toàn bộ mất 107 giây thay vì một giây.</li>
<li><strong>SSH chỉ bằng khoá</strong>, và đúng một dòng sudo của người dùng <code>deploy</code>:</li>
</ul>
<div class="out">$ ssh -i khoa -o PreferredAuthentications=password -o PubkeyAuthentication=no -p 19152 deploy@127.0.0.1 true
deploy@127.0.0.1: Permission denied (publickey).
$ ssh deploy@… 'sudo -l | tail -2'
User deploy may run the following commands on phongkham-vps:
    (root) NOPASSWD: /opt/phongkham/bin/phat-hanh.sh</div>

<h3>Chạy thử từng bước</h3>
<p>Phòng thí nghiệm là năm container trên một mạng Docker. VPS cần <code>--privileged</code> (nó chạy Docker, iptables và ufw của riêng nó) và một volume cho <code>/var/lib/docker</code>: thiếu volume, Docker bên trong đặt hệ thống tệp overlay chồng lên overlay của chính container và hỏng với <code>failed to mount … fstype: overlay … err: invalid argument</code> — đo được ở lần thử đầu của bài sau.</p>
<pre><code class="language-bash"><span class="tok-comment"># trên Mac: khoá trong thư mục nháp — không bao giờ đụng ~/.ssh thật</span>
ssh-keygen -t ed25519 -N '' -C dv15-hoc -f khoa
<span class="tok-comment"># ảnh dv15-img: ubuntu:24.04 + openssh-server + khoa.pub vào /root/.ssh/authorized_keys, CMD chạy sshd</span>
docker build -t dv15-img img/
docker network create --label dvhoc=15 --subnet 172.22.15.0/24 dv15-net
docker volume create --label dvhoc=15 dv15-vps-docker
docker run -d --name dv15-vps --hostname phongkham-vps --label dvhoc=15 --privileged --memory 1536m \\
  --network dv15-net --ip 172.22.15.10 --network-alias phongkham.test --network-alias www.phongkham.test \\
  -v dv15-vps-docker:/var/lib/docker -p 127.0.0.1:19152:22 dv15-img
docker run -d --name dv15-pebble --label dvhoc=15 --network dv15-net --network-alias pebble \\
  -v $PWD/pebble-config.json:/test/config/pebble-config.json:ro \\
  ghcr.io/letsencrypt/pebble:latest -config /test/config/pebble-config.json
<span class="tok-comment"># chép script lên rồi chạy bằng root; REQUESTS_CA_BUNDLE cho certbot tin API của Pebble (Chương 12.2)</span>
ssh -i khoa -o UserKnownHostsFile=./known_hosts -p 19152 root@127.0.0.1 'cat &gt; /root/ngay1.sh' &lt; ops/ngay1.sh
ssh -i khoa -o UserKnownHostsFile=./known_hosts -p 19152 root@127.0.0.1 \\
  'REQUESTS_CA_BUNDLE=/usr/local/share/pebble-minica.pem ACME=https://pebble:14000/dir CA=/usr/local/share/pebble-root.pem bash /root/ngay1.sh'</code></pre>
<p>Chạy hai lần. Lần hai phải toàn ✓ — nếu không, script chưa chạy-lại-được, và bạn vừa tìm ra con bọ đầu tiên của mình.</p>

<h3>Trên Windows/WSL và macOS khác gì</h3>
<ul>
<li><strong>CRLF.</strong> Nếu một bạn lưu <code>ngay1.sh</code> trên Windows với kiểu xuống dòng CRLF, VPS hỏng ngay dòng đầu với <code>/usr/bin/env: 'bash\\r': No such file or directory</code> (khoá Linux &amp; Bash 16.4, sự cố 7). Thêm <code>*.sh text eol=lf</code> vào <code>.gitattributes</code> để Git tự đổi, bất kể ai commit.</li>
<li><strong>Khoá SSH trên Windows.</strong> OpenSSH trên Windows từ chối một khoá riêng mà người dùng khác đọc được ("UNPROTECTED PRIVATE KEY FILE"); sửa ACL của tệp, hoặc làm mọi thứ trong WSL, nơi <code>chmod 600</code> có tác dụng.</li>
<li><strong>macOS.</strong> Ở đây Mac chỉ điều khiển SSH, không dòng nào của <code>ngay1.sh</code> chạy trên nó. Nhưng script của các bài sau dùng <code>flock</code> và <code>date -d</code> của GNU, hai thứ macOS không có — thêm một lý do để những script đó chạy trên VPS chứ không trên máy build.</li>
</ul>

<h3>Khi nào dùng script Ngày 1 — và khi nào không</h3>
<ul>
<li><strong>Dùng</strong> cho một tới ba máy chủ của mình: đọc được, nằm trong kho mã, và máy thứ hai chỉ cách một lệnh (bài này đã làm đúng vậy).</li>
<li><strong>Dùng cloud-init</strong> khi nhà cung cấp hỗ trợ: cùng các bước ấy chạy ngay lần khởi động đầu, trước cả khi bạn đăng nhập.</li>
<li><strong>Chuyển sang Ansible hoặc Terraform</strong> khi có nhiều máy hoặc nhiều người cùng sửa máy; tính chạy-lại-được và báo cáo lệch trạng thái khi đó có sẵn.</li>
<li><strong>Bỏ hẳn</strong> khi dùng PaaS (Chương 14.3): không có cái máy nào để chuẩn bị.</li>
</ul>

<div class="pitfall co-tieu-de"><strong>Bẫy — nghiệm thu Ngày 1 từ bên trong máy chủ.</strong> Mọi phép kiểm bên trong <code>ngay1.sh</code> đều qua ở lần 5, kể cả <code>passwordauthentication no</code>; chỉ một lần đăng nhập thử từ bên ngoài mới cho thấy đăng nhập bằng mật khẩu vẫn còn bật. Chứng chỉ cũng vậy (đọc trên dây bằng <code>openssl s_client</code>), tường lửa cũng vậy (quét từ máy khác), HTTPS cũng vậy (lấy trang bằng tên). Phép kiểm chạy trên máy chủ chỉ kiểm được cách máy chủ nhìn chính nó.</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Dựng <code>dv15-img</code> (Ubuntu 24.04, openssh-server, khoá nháp của bạn cho root) và chạy một VPS trần như trên, cùng Pebble.</li>
<li>Xoá dòng <code>export DEBIAN_FRONTEND=noninteractive</code> trong bản sao <code>ngay1.sh</code> của bạn rồi chạy. Khi nó treo, mở phiên SSH thứ hai và tìm tiến trình đang chờ bằng <code>ps -ef | grep -E 'apt|dpkg|debconf'</code>. Trả dòng đó về, dựng lại VPS, chạy lại.</li>
<li>Chạy script lần thứ hai và kiểm rằng dòng nào cũng ✓.</li>
<li>Từ một container khác cùng mạng: <code>curl -sI http://phongkham.test/</code>, <code>curl --cacert … https://phongkham.test/</code>, <code>nmap -Pn -p- phongkham.test</code>, và một lần thử SSH với <code>-o PubkeyAuthentication=no</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> lần chạy thứ hai chỉ in ✓ và <code>-&gt; 200</code>; từ máy kia bạn nhận 301, trang "sắp ra mắt" qua HTTPS, đúng ba cổng mở, và <code>Permission denied (publickey).</code> không có chữ <code>password</code> trong danh sách.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">bare VPS (VPS trần)</span><span class="v">Máy chủ đúng như nhà cung cấp giao: hệ điều hành, sshd, khoá của bạn cho root — ngoài ra không có gì.</span></div>
  <div class="kv"><span class="k">idempotent (chạy lại được)</span><span class="v">Chạy hai lần để lại cái máy y như chạy một lần; lần chạy thứ hai là một phép kiểm.</span></div>
  <div class="kv"><span class="k">debconf / <code>DEBIAN_FRONTEND</code></span><span class="v">Hệ thống hỏi-đáp của gói Debian; <code>noninteractive</code> bắt nó lấy mặc định thay vì chờ câu trả lời.</span></div>
  <div class="kv"><span class="k">sudoers drop-in (tệp sudoers bổ sung)</span><span class="v">Một tệp trong <code>/etc/sudoers.d/</code>; kiểm bằng <code>visudo -cqf</code> trước khi cài, vì tệp sai làm sudo chết.</span></div>
  <div class="kv"><span class="k">effective configuration (cấu hình hiệu lực)</span><span class="v">Cái một dịch vụ đang chạy THẬT SỰ dùng — chưa chắc trùng với tệp cho tới khi nó nạp lại.</span></div>
  <div class="kv"><span class="k">SIGHUP reload (nạp lại bằng HUP)</span><span class="v">nginx và sshd đọc lại cấu hình khi nhận HUP; lệnh gửi tín hiệu trả về trước khi cấu hình mới bắt đầu phục vụ.</span></div>
  <div class="kv"><span class="k">acceptance test (phép nghiệm thu)</span><span class="v">Các phép kiểm quyết định "xong", chạy từ chỗ người dùng đứng — máy khác, bằng tên, qua HTTPS.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Ngày 1 là một script nằm trong kho mã, chạy bằng root một lần qua SSH, và lần chạy thứ hai không được đổi gì.</li>
<li>Năm lần chạy thật tìm ra năm con bọ mà đọc không thể thấy: câu hỏi ẩn của <code>tzdata</code>, thiếu <code>sudo</code>, chỉ thị nginx của bản mới hơn, cuộc đua sau reload, và sshd chưa nạp lại.</li>
<li><code>set -e</code> bỏ qua lỗi nằm giữa chuỗi <code>&amp;&amp;</code>: phép kiểm bắt buộc phải qua thì đứng riêng một dòng.</li>
<li>Người dùng <code>deploy</code> được một lệnh sudo và không có nhóm <code>docker</code> — nhóm đó chính là root.</li>
<li>Xoay log Docker, tường lửa ba cổng và HTTPS từ ACME thuộc về Ngày 1, không phải "để sau".</li>
<li>Nghiệm thu Ngày 1 từ một máy khác: một 301, chứng chỉ đúng tên, ba cổng, và chỉ bằng khoá.</li>
</ul>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Bash Reference Manual — The Set Builtin</span><span class="lc-sub">gnu.org/software/bash/manual/html_node/The-Set-Builtin.html — danh sách chính xác những chỗ <code>set -e</code> không thoát.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nginx — Controlling nginx</span><span class="lc-sub">nginx.org/en/docs/control.html — HUP làm gì, và vì sao worker mới khởi động sau khi lệnh đã trả về.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nginx — ngx_http_v2_module</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_v2_module.html — "This directive appeared in version 1.25.1."</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">sshd(8)</span><span class="lc-sub">man7.org/linux/man-pages/man8/sshd.8.html — <code>-t</code>, <code>-T</code>, và nạp lại khi nhận SIGHUP.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Hướng dẫn dùng Certbot</span><span class="lc-sub">eff-certbot.readthedocs.io/en/stable/using.html — <code>certonly</code>, <code>--webroot</code>, hook, gia hạn.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">Pebble</span><span class="lc-sub">github.com/letsencrypt/pebble — máy chủ ACME thử dùng thay cho Let's Encrypt.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — Chương 16: máy chủ dự án cuối khoá</span><span class="lc-sub">/courses/linux-bash/learn${REF} — người dùng hệ thống, bootstrap chạy lại được, unit và timer systemd, logrotate.</span></span></div>
</div>
`,
    },
    /* ─────────────────────────── 15.2 ─────────────────────────── */
    {
      title: "15.2 — Day 2: a release pipeline, run for real — including the release that breaks|||15.2 — Ngày 2: đường ống phát hành, chạy thật — kể cả lần phát hành hỏng",
      slug: "deploy-15-2-duong-ong-phat-hanh",
      type: "LESSON",
      isFreePreview: true,
      description: "Dựng ảnh từ git archive, kiểm ảnh trước khi đẩy, registry, rồi một script trên VPS có khoá, migration một lần, xanh/lam sau nginx, thử đường đọc trước khi tráo và smoke qua HTTPS; bảy lần phát hành đo bằng một khách hàng ở máy khác, và mỗi lần hỏng dạy script một điều.",
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.2</span>
<h2>Day 2: a release pipeline, run for real — including the release that breaks</h2>
<p class="lead">Day 1 left a server that serves a "coming soon" page. Day 2 builds the path every future version will take: one command on the build machine that produces an image from committed code only, refuses to push an image that cannot run, and asks the VPS to pull it, migrate the database once, start the new version next to the old one, check it, switch nginx, and retire the old one. Then it runs that path seven times while a client on another machine hammers the site — and three of those releases fail. Each failure is kept here, with the number of users it hurt, because each one changed the script.</p>

<h3>Why the VPS builds nothing</h3>
${slide('dv-15', 9, 'Bốn chặng của một lần phát hành — VPS không build gì cả')}
<p>Chapter 8 measured a small VPS killing <code>next build</code> with exit code 137, and Chapter 13.2 told the real story of 18/08: 7.6 GB of build cache filled the disk that Postgres lives on. Lesson 15.4 rebuilds that incident. The conclusion is already in the project's <code>deploy-nha.sh</code>: build on a strong machine, push to a registry, and let the VPS only pull and swap. The pipeline has four stages:</p>
<ol>
<li><strong>Build</strong> on the build machine, from <code>git archive HEAD</code> — only what is committed.</li>
<li><strong>Check the image</strong> before it leaves the machine: right platform, every library loads, the app starts.</li>
<li><strong>Push</strong> to the registry under a tag that is the commit hash.</li>
<li><strong>Release on the VPS</strong> through the one sudo command the <code>deploy</code> user has.</li>
</ol>
<p>Before the first release, a one-time preparation on the VPS (<code>chuan-bi-app.sh</code>, as root) creates a Docker network <code>phongkham</code>, generates the database password into <code>/etc/phongkham/phongkham.env</code> (mode 600, never printed), starts Postgres <strong>without publishing any port</strong> (Chapter 12.3), installs <code>phat-hanh.sh</code>, and writes the nginx site with an upstream. Its first run failed in a way worth knowing when you rebuild this lab:</p>
<div class="out">docker: Error response from daemon: failed to mount /tmp/containerd-mount1620318027: mount source: "overlay", target: "/tmp/containerd-mount1620318027", fstype: overlay, flags: 0, data: "workdir=/var/lib/docker/containerd/daemon/io.containerd.snapshotter.v1.overlayfs/snapshots/12/work,…", err: invalid argument</div>
<p>Docker inside a container cannot stack its overlay filesystems on the container's own overlay root. Giving the lab VPS a Docker volume for <code>/var/lib/docker</code> fixed it (the "Try it" section of 15.1 already includes it). A real VPS has an ordinary disk and never sees this. The second run:</p>
<div class="out">  pk-db: postgres (PostgreSQL) 16.15
-rw------- 1 root root 137 Sep 29 09:31 /etc/phongkham/phongkham.env
POSTGRES_PASSWORD
DATABASE_URL

real	0m38.098s</div>
<p>Only the <em>names</em> of the variables are printed (<code>cut -d= -f1</code>) — a secret never goes to a terminal, a log or a slide.</p>

<h3>The app, and the two things it does for deployment</h3>
<p>The API is ordinary, but two small parts exist only so it can be deployed safely:</p>
<pre><code class="language-javascript">const BAN = process.env.BAN || 'dev';                 <span class="tok-comment">// ghi vao anh luc dung (ARG BAN)</span>
…
if (req.url === '/api/health') { await db.query('select 1'); return json(res, 200, { ok: true, ban: BAN }); }
if (req.url === '/api/version') return json(res, 200, { ban: BAN });
…
<span class="tok-comment">// Tat tu te (Ch3.2): ngung nhan ket noi moi, tra not request dang do, dong pool.</span>
process.on('SIGTERM', () =&gt; { console.log('SIGTERM: dang xa'); sv.close(() =&gt; db.end(() =&gt; process.exit(0))); setTimeout(() =&gt; process.exit(0), 15000).unref(); });</code></pre>
<ul>
<li><strong><code>/api/version</code></strong> answers with the commit the image was built from (<code>BAN</code>, "version", baked in with <code>ARG BAN</code> in the Dockerfile). Chapter 1.4's rule — the server must say which release it is — is what lets the release script prove that the front door serves the new version and not a stale one.</li>
<li><strong>SIGTERM</strong> closes the listener, lets requests in flight finish and closes the pool (Chapter 3.2). <code>docker stop -t 20</code> sends SIGTERM and waits up to 20 s before SIGKILL.</li>
</ul>
<p>Migrations are SQL files applied by <code>migrate.js</code>, which runs as a one-off container before the new API starts:</p>
<pre><code class="language-javascript">await c.query('select pg_advisory_lock(15)');                     <span class="tok-comment">// hai migrator cung luc -&gt; nguoi sau cho</span>
await c.query('create table if not exists schema_migrations (ten text primary key, luc timestamptz default now())');
…
for (const f of tep) {
  if (da.has(f)) continue;
  await c.query('begin');
  try {
    await c.query(&#96;set local lock_timeout = '\${process.env.LOCK_TIMEOUT || '5s'}'&#96;);
    await c.query(fs.readFileSync(__dirname + '/migrations/' + f, 'utf8'));
    await c.query('insert into schema_migrations (ten) values ($1)', [f]);
    await c.query('commit');
  } catch (e) { await c.query('rollback'); console.error(&#96;migration \${f} HONG: \${e.message}&#96;); process.exit(1); }
}</code></pre>
<p>Three details from Chapter 5, each in one line: an advisory lock so two migrators never run at once; one transaction per file, so a failed file leaves nothing half-applied; and <code>lock_timeout</code>, so a migration that cannot get its table lock gives up after 5 s instead of queueing every read behind it — Lesson 15.4 measures both behaviours.</p>
<pre><code class="language-dockerfile">FROM node:22-bookworm-slim
WORKDIR /app
COPY app/package.json ./
RUN npm install --omit=dev --no-audit --no-fund
COPY app/ ./
ARG BAN=dev
ENV BAN=$BAN NODE_ENV=production
USER node
EXPOSE 3000
CMD ["node", "server.js"]</code></pre>

<h3><code>deploy.sh</code>: only committed code can ship</h3>
${slide('dv-15', 10, 'deploy.sh: chỉ bản đã commit mới được lên')}
<pre><code class="language-bash">#!/usr/bin/env bash
<span class="tok-comment"># deploy.sh — chay tren MAY BUILD (laptop/may nha): dung anh -&gt; kiem -&gt; day registry -&gt; VPS keo + trao.</span>
<span class="tok-comment"># Giong duong cua deploy-nha.sh: VPS khong build gi ca.</span>
set -Eeuo pipefail
trap 'echo "deploy: HONG o dong $LINENO: $BASH_COMMAND" &gt;&amp;2' ERR
cd "$(git rev-parse --show-toplevel)"
REG=\${REG:-localhost:19155}            <span class="tok-comment"># registry nhin tu may build</span>
VPS_SSH=\${VPS_SSH:?dat VPS_SSH, vd "ssh -p 19152 deploy@127.0.0.1"}
[ -z "$(git status --porcelain)" ] || { echo "cay lam viec con thay doi chua commit -&gt; tu choi (chi ban DA COMMIT moi duoc len)"; exit 2; }
TAG=$(git rev-parse --short=7 HEAD)
t0=$SECONDS
echo "① dung $TAG tu git archive (chi noi dung da commit)"
git archive HEAD | docker build -q --platform linux/arm64 --build-arg BAN="$TAG" -t "$REG/phongkham:$TAG" - &gt;/dev/null
echo "② kiem anh truoc khi day"
ops/kiem-anh.sh "$REG/phongkham:$TAG"
echo "③ day $REG/phongkham:$TAG"
docker push -q "$REG/phongkham:$TAG" &gt;/dev/null
echo "④ VPS keo + trao"
$VPS_SSH "sudo /opt/phongkham/bin/phat-hanh.sh $TAG"
echo "xong $TAG sau $((SECONDS - t0)) s"</code></pre>
<table>
<tr><th>Piece</th><th>Why</th></tr>
<tr><td><code>git status --porcelain</code> must be empty</td><td>A modified or untracked file would not be in the image anyway (see next line) — refusing is more honest than shipping something other than what you see. <code>deploy-nha.sh</code> asks <code>[y/N]</code> at the same spot.</td></tr>
<tr><td><code>git archive HEAD | docker build … -</code></td><td>The build context is a tar of the commit, read from stdin (<code>-</code>). A half-saved file from another editor session cannot slip in — the project's <code>deploy.sh</code> once did exactly that with rsync.</td></tr>
<tr><td><code>TAG=$(git rev-parse --short=7 HEAD)</code></td><td>The tag <em>is</em> the commit (Chapter 1.4). Never <code>latest</code>: a tag that moves cannot be rolled back to.</td></tr>
<tr><td><code>--platform linux/arm64</code></td><td>The lab VPS is arm64 like the Mac. A real VPS is usually amd64 — then this says <code>linux/amd64</code> and an M1 builds through emulation (slow) or a builder of the right architecture.</td></tr>
<tr><td><code>--build-arg BAN="$TAG"</code></td><td>The version string the running app will report.</td></tr>
<tr><td><code>$VPS_SSH "sudo …/phat-hanh.sh $TAG"</code></td><td>The only thing the build machine may ask of the VPS. No shell, no docker group — one script, one argument.</td></tr>
</table>

<h3><code>kiem-anh.sh</code>: refuse to push an image that cannot run</h3>
<pre><code class="language-bash">#!/usr/bin/env bash
<span class="tok-comment"># kiem-anh.sh ANH [nen=linux/arm64] — tu choi DAY mot anh khong chay noi (chay TRUOC docker push)</span>
set -Eeuo pipefail
ANH=\${1:?can ten anh}; NEN=\${2:-linux/arm64}
co=$(docker image inspect -f '{{.Os}}/{{.Architecture}}' "$ANH")
[ "$co" = "$NEN" ] || { echo "HONG: anh la $co, VPS can $NEN"; exit 1; }
<span class="tok-comment"># 1) moi thu vien trong package.json nap duoc TRONG anh (bat anh thieu node_modules, sai libc)</span>
docker run --rm "$ANH" node -e '
  for (const d of Object.keys(require("./package.json").dependencies || {})) require(d);
  console.log("  thu vien nap duoc:", Object.keys(require("./package.json").dependencies).join(" "))'
<span class="tok-comment"># 2) app khoi dong toi luc lang nghe (DB gia: chi can khong chet truoc khi listen)</span>
<span class="tok-comment"># --init: tren anh Alpine, "timeout" cua busybox exec node thanh PID 1 — PID 1 lo SIGTERM -&gt; treo mai (do that)</span>
out=$(docker run --rm --init -e DATABASE_URL=postgres://x:x@127.0.0.1:1/x "$ANH" timeout 3 node server.js 2&gt;&amp;1 || true)
case "$out" in *"nghe :3000"*) echo "  khoi dong duoc: \${out%%$'\\n'*}" ;;
  *) echo "HONG: app khong khoi dong:"; echo "$out" | head -3; exit 1 ;; esac
echo "  OK $ANH ($co)"</code></pre>
<p>Three checks, each aimed at a failure that a green build does not catch: an image for the wrong CPU; a library that cannot load inside the image (the Alpine/glibc incident of 18/08 that took the API down for seven minutes — rebuilt in 15.4); and an app that dies before it listens. The second check needs a database URL that points nowhere: the app must reach <code>listen</code>, and connecting to the database is not part of starting.</p>
<p>The <code>--init</code> on that line was found by running the check on an Alpine image in 15.4: it hung for more than three minutes. On Alpine, <code>timeout</code> is BusyBox's, which <code>exec</code>s the command so that <code>node</code> becomes PID 1 of the container — and PID 1 ignores SIGTERM unless it installed a handler, so the timeout never kills it. <code>docker run --init</code> puts a small init process at PID 1 that forwards signals. On Debian images (coreutils <code>timeout</code>) the problem does not appear, which is exactly why it went unnoticed until the check met a different base image.</p>

<h3><code>phat-hanh.sh</code>: the release on the VPS</h3>
${slide('dv-15', 11, 'phat-hanh.sh: khoá, migration, màu mới')}
<p>This is the final version, after the fixes this lesson and the next one describe. Read it once top to bottom, then section by section below:</p>
<pre><code class="language-bash">#!/usr/bin/env bash
<span class="tok-comment"># phat-hanh.sh TAG | lui — chay TREN VPS bang sudo (dong sudoers duy nhat cua deploy).</span>
<span class="tok-comment"># keo anh -&gt; migration MOT lan -&gt; mau moi len canh mau cu -&gt; cho health -&gt; tro nginx -&gt; smoke qua HTTPS -&gt; dung mau cu.</span>
set -Eeuo pipefail
KHO=dv15-reg:5000/phongkham; TEN=phongkham.test
ENV=/etc/phongkham/phongkham.env; SO=/var/log/phongkham/phat-hanh.log; MAU=/etc/phongkham/mau-dang-chay
UP=/etc/nginx/phongkham-upstream.conf
ghi() { echo "$(date +%FT%T) $*" | tee -a "$SO"; }
trap 'ghi "\${TAG:-?} HONG dong $LINENO: $BASH_COMMAND"' ERR   <span class="tok-comment"># moi lan chet giua chung deu de lai dau vet trong so</span>

exec 9&gt;/run/phongkham-phat-hanh.lock
flock -n 9 || { echo "TU CHOI: mot lan phat hanh khac dang chay (khoa /run/phongkham-phat-hanh.lock)"; exit 3; }

TAG=\${1:?cach dung: phat-hanh.sh TAG | lui}
if [ "$TAG" = lui ]; then
  <span class="tok-comment"># thu tu phat hanh = lan OK DAU TIEN cua moi tag; lui = tag dung TRUOC tag dang chay trong thu tu do.</span>
  <span class="tok-comment"># (ban dau lay "OK gan nhat khac ban dang chay": lui hai lan thi nhay TOI ban moi — do that 29/09)</span>
  dang=$(awk '$3=="OK"{t=$2} END{print t}' "$SO")
  TAG=$(awk '$3=="OK" &amp;&amp; !thay[$2]++ {print $2}' "$SO" | grep -B1 -x "$dang" | head -n -1 | tail -1)
  [ -n "$TAG" ] || { echo "khong co ban nao truoc $dang de lui"; exit 2; }
  echo "lui: $dang -&gt; $TAG"; KHONG_MIGRATE=1
fi
[[ $TAG =~ ^[0-9a-f]{7}$ ]] || { echo "tag la: $TAG"; exit 2; }
cu=$(cat "$MAU" 2&gt;/dev/null || echo "")
if [ "$cu" = xanh ]; then moi=lam; cong=3002; else moi=xanh; cong=3001; fi
cong_cu=$([ "$moi" = xanh ] &amp;&amp; echo 3002 || echo 3001)

ghi "$TAG bat-dau mau=$moi"
docker pull -q "$KHO:$TAG" &gt;/dev/null
if [ -z "\${KHONG_MIGRATE:-}" ]; then
  docker run --rm --network phongkham --env-file "$ENV" "$KHO:$TAG" node migrate.js
fi
docker rm -f "pk-$moi" &gt;/dev/null 2&gt;&amp;1 || true
docker run -d --name "pk-$moi" --network phongkham --env-file "$ENV" -p "127.0.0.1:$cong:3000" \\
  --restart unless-stopped --memory 256m "$KHO:$TAG" &gt;/dev/null

for i in $(seq 1 20); do
  curl -fsS -o /dev/null "http://127.0.0.1:$cong/api/health" 2&gt;/dev/null &amp;&amp; break
  if [ "$i" = 20 ] || [ "$(docker inspect -f '{{.State.Status}}' "pk-$moi")" = exited ] || \\
     [ "$(docker inspect -f '{{.RestartCount}}' "pk-$moi")" -gt 1 ]; then
    echo "--- log pk-$moi:"; docker logs --tail 5 "pk-$moi" 2&gt;&amp;1
    docker rm -f "pk-$moi" &gt;/dev/null; ghi "$TAG HONG health (ban cu van phuc vu: \${cu:-khong co})"; exit 4
  fi
  sleep 1
done
echo "  health xanh sau \${i} s"
<span class="tok-comment"># thu DUONG DOC THAT tren mau moi TRUOC khi cho no nhan khach (health "select 1" khong biet cot nao thieu)</span>
if ! curl -fsS -o /dev/null "http://127.0.0.1:$cong/api/lich-hen"; then
  echo "--- mau moi tra loi o /api/lich-hen:"; curl -s "http://127.0.0.1:$cong/api/lich-hen"; echo
  docker rm -f "pk-$moi" &gt;/dev/null; ghi "$TAG HONG thu-truoc (chua khach nao thay)"; exit 4
fi

cat &gt; "$UP" &lt;&lt;&lt; "server 127.0.0.1:$cong;"       <span class="tok-comment"># ghi DE TAI CHO (giu inode), khong mv</span>
nginx -t -q &amp;&amp; nginx -s reload

smoke() { curl -fsS --resolve "$TEN:443:127.0.0.1" "https://$TEN$1"; }
<span class="tok-comment"># reload chi GUI tin hieu: vai tram ms sau worker cu van tra ban cu -&gt; CHO cua truoc noi dung ban, toi da 10 s</span>
cho_ban() { for i in $(seq 1 20); do [ "$(smoke /api/version 2&gt;/dev/null | jq -r .ban)" = "$1" ] &amp;&amp; return 0; sleep 0.5; done; return 1; }
if ! cho_ban "$TAG" || ! smoke /api/lich-hen &gt;/dev/null; then
  echo "SMOKE HONG qua cua truoc (HTTPS): ban=$(smoke /api/version | jq -r .ban), can $TAG"
  if [ -n "$cu" ]; then
    cat &gt; "$UP" &lt;&lt;&lt; "server 127.0.0.1:$cong_cu;"; nginx -s reload
    cho_ban "$(awk '$3=="OK"{t=$2} END{print t}' "$SO")" || echo "CANH BAO: cua truoc chua ve ban cu"
  fi
  docker rm -f "pk-$moi" &gt;/dev/null; ghi "$TAG HONG smoke"; exit 5
fi
echo "  cua truoc (HTTPS) tra ban $TAG"
echo "$moi" &gt; "$MAU"
if [ -n "$cu" ]; then sleep 2; docker stop -t 20 "pk-$cu" &gt;/dev/null; docker rm "pk-$cu" &gt;/dev/null; fi
ghi "$TAG OK mau=$moi"</code></pre>
<table>
<tr><th>Section</th><th>What it guarantees</th></tr>
<tr><td><code>exec 9&gt;…lock; flock -n 9</code></td><td>One release at a time. <code>-n</code>: if the lock is taken, exit 3 at once instead of waiting. The lock belongs to file descriptor 9 of this process, so if the script dies the kernel releases it — no stale lock file to delete by hand (Chapter 7.3).</td></tr>
<tr><td><code>[[ $TAG =~ ^[0-9a-f]{7}$ ]]</code></td><td>The argument comes from another machine through sudo: accept only the exact shape of a short commit hash.</td></tr>
<tr><td><code>node migrate.js</code> in a one-off container</td><td>Migrations run once, before any new API process exists, with the image's own code (Chapter 5.5).</td></tr>
<tr><td><code>-p "127.0.0.1:$cong:3000"</code></td><td>The app is reachable only from the VPS itself; nginx is the only door (Chapter 12.3).</td></tr>
<tr><td>health loop with <code>RestartCount</code></td><td>Stop waiting as soon as the container has exited or restarted twice — a crash loop is not "still starting".</td></tr>
<tr><td>try <code>/api/lich-hen</code> on the new colour</td><td>A read path that touches real tables, before any user is sent there. Added after release 5 below.</td></tr>
<tr><td><code>cat &gt; "$UP" &lt;&lt;&lt; …</code></td><td>Rewrite the upstream file <em>in place</em>, keeping its inode — the lesson of 25/08 (Chapter 13.1, and incident 6 in 15.4).</td></tr>
<tr><td><code>cho_ban</code> then <code>smoke /api/lich-hen</code></td><td>Through the front door, by name, over HTTPS, as a user: the right version answers and a real read works. Added after release 3 below.</td></tr>
<tr><td><code>docker stop -t 20</code> after 2 s</td><td>The old colour gets SIGTERM only after nginx no longer sends it new requests, and 20 s to finish the ones it has.</td></tr>
<tr><td><code>ghi</code> + <code>trap … ERR</code></td><td>Every run leaves <code>bat-dau</code> and then <code>OK</code> or <code>HONG</code> in the release log — the log that <code>lui</code> reads.</td></tr>
</table>

<h3>Blue/green behind nginx: switching is one line</h3>
${slide('dv-15', 12, 'Xanh/lam sau nginx: tráo bằng một dòng upstream')}
<p>The site nginx serves on 443 does not name a port; it includes a one-line file:</p>
<pre><code class="language-nginx">upstream phongkham_api {
    include /etc/nginx/phongkham-upstream.conf;   <span class="tok-comment"># MOT dong "server 127.0.0.1:300x;" — phat-hanh.sh ghi de tai cho</span>
    keepalive 8;
}
server {
    listen 443 ssl http2;
    server_name phongkham.test www.phongkham.test;
    ssl_certificate     /etc/letsencrypt/live/phongkham.test/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/phongkham.test/privkey.pem;
    location / {
        proxy_pass http://phongkham_api;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_next_upstream error timeout http_502;
    }
}</code></pre>
<p>Blue (<code>pk-xanh</code>, port 3001) and green (<code>pk-lam</code>, port 3002) take turns. A release starts the colour that is not running, proves it answers, rewrites the one line, reloads nginx, waits until the front door reports the new version, and only then stops the old colour. At no moment are both absent. <code>keepalive 8</code> with <code>proxy_http_version 1.1</code> and an empty <code>Connection</code> header keeps connections to the app open between requests; Chapter 3 showed why a reload is still safe with them (old workers finish their connections, new workers open new ones).</p>

<h3>Seven releases, measured from another machine</h3>
${slide('dv-15', 13, 'Mỗi lần hỏng dạy script một điều')}
<p>During every release a client on <code>dv15-vps2</code> ran this for 25 seconds — one new connection per request, like a browser opening the page:</p>
<pre><code class="language-bash">#!/bin/bash
<span class="tok-comment"># dem.sh GIAY [duong] — goi https://phongkham.test&lt;duong&gt; lien tuc tu may khac, dem ma tra ve</span>
end=$((SECONDS+$1)); : &gt; /tmp/ma.txt
while [ $SECONDS -lt $end ]; do
  curl -s -o /dev/null -w '%{http_code}\\n' --max-time 3 https://phongkham.test\${2:-/api/lich-hen} &gt;&gt; /tmp/ma.txt
done
echo "$(wc -l &lt; /tmp/ma.txt) request trong $1 s:"; sort /tmp/ma.txt | uniq -c</code></pre>
<p><strong>Release 1 (<code>10e26b6</code>) — the smoke test did not trust the certificate.</strong> Migration 001 ran, the new container was healthy after 2 s, nginx switched, and then:</p>
<div class="out">curl: (60) SSL certificate problem: unable to get local issuer certificate
…
SMOKE HONG: cua truoc tra ban=? (can 10e26b6)
2026-09-29T09:32:45 10e26b6 HONG smoke</div>
<p>The smoke test goes through the front door exactly like a user — by name, over HTTPS, with the system's list of trusted CAs. The lab's CA (Pebble) was not in that list on the VPS; a real Let's Encrypt certificate would be. Installing the lab root into the VPS's trust store (<code>update-ca-certificates</code>) fixed it. Two things to notice: there was no previous version, so the site answered <code>502</code> until the next run — acceptable before launch, never after; and <strong>migration 001 stayed applied</strong> although the release failed. The next run printed <code>khong co migration moi</code> ("no new migrations"). A migration is not part of the release's rollback: this is why every migration in this chapter must be safe for the version that is still running (Chapter 5.1).</p>
<div class="out">2026-09-29T09:33:14 10e26b6 bat-dau mau=xanh
khong co migration moi
  health xanh sau 2 s
2026/09/29 09:33:16 [notice] 3619#3619: signal process started
2026-09-29T09:33:16 10e26b6 OK mau=xanh
xong 10e26b6 sau 9 s</div>
<p><strong>Release 2 (<code>b19213a</code>) — a correct release rejected, and four 502s.</strong> This one adds an expand migration (next lesson) and was correct. The script rejected it anyway:</p>
<div class="out">migration 002_ho_ten_mo_rong.sql xong (4 ms)
1 migration moi
  health xanh sau 2 s
2026/09/29 09:33:48 [notice] 3897#3897: signal process started
SMOKE HONG: cua truoc tra ban=10e26b6 (can b19213a)
2026/09/29 09:33:48 [notice] 3913#3913: signal process started
2026-09-29T09:33:48 b19213a HONG smoke
$ dem.sh 25        # tren dv15-vps2, cung luc
906 request trong 25 s:
    902 200
      4 502</div>
<p>The smoke test asked for the version in the same second as the reload and was answered by an old worker: <code>ban=10e26b6</code>. Exactly the race of Day 1 — <code>nginx -s reload</code> returns before the new workers serve. Worse, the rollback path produced the four 502s: the script pointed nginx back at the old colour and removed the new container immediately, while workers that still had the new upstream were sending requests to it. The fix is <code>cho_ban</code> ("wait for version"): ask the front door up to 20 times, half a second apart, until it reports the expected tag — both after switching forward and after switching back. Rerun as <code>2139d95</code>:</p>
<div class="out">2026-09-29T09:34:33 2139d95 bat-dau mau=lam
khong co migration moi
  health xanh sau 2 s
2026/09/29 09:34:34 [notice] 4247#4247: signal process started
  cua truoc (HTTPS) tra ban 2139d95
2026-09-29T09:34:37 2139d95 OK mau=lam
xong 2139d95 sau 12 s
$ dem.sh 25        # tren dv15-vps2, cung luc
917 request trong 25 s:
    917 200</div>

<h3>The broken release: 21 errors, then zero</h3>
${slide('dv-15', 14, 'Bắt lỗi trước khi khách thấy: 21 request lỗi thành 0')}
<p><strong>Release 3 (<code>4f67bce</code>) — broken on purpose.</strong> The code now lists <code>so_dien_thoai</code> (phone number), and the commit "forgot" its migration — the most common real reason a deploy breaks a page. The health check only runs <code>select 1</code>, so it passed:</p>
<div class="out">2026-09-29T09:35:11 4f67bce bat-dau mau=xanh
khong co migration moi
  health xanh sau 2 s
2026/09/29 09:35:13 [notice] 4590#4590: signal process started
curl: (22) The requested URL returned error: 500
SMOKE HONG: cua truoc tra ban=4f67bce (can 4f67bce)
2026/09/29 09:35:14 [notice] 4639#4639: signal process started
2026-09-29T09:35:15 4f67bce HONG smoke
$ dem.sh 25        # tren dv15-vps2, cung luc
895 request trong 25 s:
    874 200
     21 500</div>
<p>The smoke test did its job — the release was rolled back automatically — but only after nginx had sent users to the broken version. For about a second and a half, 21 real requests got a 500. (The message also shows why the wording was changed: "front door returned version 4f67bce, expected 4f67bce" does not say that the <em>read</em> failed.) The fix moves the real read path to <em>before</em> the switch: call <code>/api/lich-hen</code> on the new colour's port directly. The same broken code, rebuilt as <code>bb00bfd</code>:</p>
<div class="out">2026-09-29T09:35:52 bb00bfd bat-dau mau=xanh
khong co migration moi
  health xanh sau 2 s
curl: (22) The requested URL returned error: 500
--- mau moi tra loi o /api/lich-hen:
{"loi":"column \\"so_dien_thoai\\" does not exist"}
2026-09-29T09:35:54 bb00bfd HONG thu-truoc (chua khach nao thay)
$ dem.sh 25        # tren dv15-vps2, cung luc
957 request trong 25 s:
    957 200</div>
<p>Zero errors, and the error message names the missing column. Adding <code>003_so_dien_thoai.sql</code> made the next release, <code>ef8f9c5</code>, pass in 14 s with 897 of 897 requests answered 200. The health check is still useful — it catches a process that is up but cannot reach the database — but it answers "alive", not "correct". Only a real read answers "correct".</p>
<table>
<tr><th>Tag</th><th>Result</th><th>Users (25 s on vps2)</th><th>The script learned</th></tr>
<tr><td><code>10e26b6</code></td><td>HONG smoke (CA not trusted)</td><td>502 — no older version yet</td><td>smoke goes through the real name and HTTPS</td></tr>
<tr><td><code>10e26b6</code></td><td>OK, 9 s</td><td>—</td><td>a migration stays applied after a failed release</td></tr>
<tr><td><code>b19213a</code></td><td>HONG smoke (asked too early)</td><td>902 × 200, 4 × 502</td><td><code>cho_ban</code>: retry with a limit after every reload</td></tr>
<tr><td><code>2139d95</code></td><td>OK, 12 s</td><td>917 × 200</td><td></td></tr>
<tr><td><code>4f67bce</code></td><td>HONG smoke (missing column)</td><td>874 × 200, 21 × 500</td><td>try the read path before switching</td></tr>
<tr><td><code>bb00bfd</code></td><td>HONG before switching</td><td>957 × 200</td><td></td></tr>
<tr><td><code>ef8f9c5</code></td><td>OK, 14 s</td><td>897 × 200</td><td></td></tr>
</table>

<h3>A lock against overlapping releases — and a pipe that killed one</h3>
${slide('dv-15', 15, 'flock chặn deploy chồng — và dấu ống vào head giết một lần deploy')}
<p>Two teammates deploying at the same minute was one of the project's real incidents (two sessions racing for the same ref). With the lock, the second one is refused immediately and says why:</p>
<div class="out">$ sudo /opt/phongkham/bin/phat-hanh.sh ef8f9c5 &gt; /tmp/a.txt 2&gt;&amp;1 &amp;
$ sudo /opt/phongkham/bin/phat-hanh.sh 2139d95; echo "exit=$?"
TU CHOI: mot lan phat hanh khac dang chay (khoa /run/phongkham-phat-hanh.lock)
exit=3</div>
<p>Exit code 3 is distinct from a failed release (4, 5) so a caller can tell "try again later" from "something is broken". Lesson 15.4 removes the lock and shows what two overlapping releases do to the log and to users.</p>
<p>A different way to kill a release came from an innocent habit. To see only the first lines of a rollback, the command was piped into <code>head</code>:</p>
<div class="out">$ ssh … 'sudo /opt/phongkham/bin/phat-hanh.sh lui 2&gt;&amp;1 | head -2'
lui: 2139d95 -&gt; ef8f9c5
2026-09-29T09:37:40 ef8f9c5 bat-dau mau=lam
$ sed -n '/09:37:2/,$p' /var/log/phongkham/phat-hanh.log
2026-09-29T09:37:21 2139d95 bat-dau mau=xanh
2026-09-29T09:37:25 2139d95 OK mau=xanh
2026-09-29T09:37:40 ef8f9c5 bat-dau mau=lam
2026-09-29T09:37:53 10e26b6 bat-dau mau=lam
2026-09-29T09:37:57 10e26b6 OK mau=lam</div>
<p>The 09:37:40 run has <code>bat-dau</code> and then neither <code>OK</code> nor <code>HONG</code> (the lines at 09:37:53 are the next, separate release): the script died in the middle. <code>head -2</code> read two lines and exited; the script's next write went into a pipe with no reader, and the kernel sent it SIGPIPE, whose default action is to terminate. It had already started a container and not yet switched nginx — the next release cleaned up, but a release killed between "switch nginx" and "record the colour" would leave the log and the machine disagreeing. Never pipe a command that changes a system into <code>head</code>, <code>less</code> or anything that may stop reading. Redirect to a file and read the file.</p>

<h3>Try it step by step</h3>
<pre><code class="language-bash"><span class="tok-comment"># on the Mac (build machine)</span>
docker run -d --name dv15-reg --label dvhoc=15 --network dv15-net -p 127.0.0.1:19155:5000 registry:2
<span class="tok-comment"># VPS, as root, once: network, DB (no -p), secret, phat-hanh.sh, nginx upstream</span>
ssh … root@… 'bash /root/ops/chuan-bi-app.sh'
<span class="tok-comment"># lab only: let the VPS trust the lab CA, like a real VPS trusts Let's Encrypt</span>
ssh … root@… 'cp /usr/local/share/pebble-root.pem /usr/local/share/ca-certificates/pebble-root-lab.crt &amp;&amp; update-ca-certificates'
<span class="tok-comment"># every release, from the repository on the Mac</span>
git commit -am "…"
VPS_SSH="ssh -i khoa -o UserKnownHostsFile=./known_hosts -p 19152 deploy@127.0.0.1" ops/deploy.sh
<span class="tok-comment"># on vps2, in parallel with a release</span>
dem.sh 25</code></pre>

<h3>On Windows/WSL and macOS</h3>
<ul>
<li><strong>macOS has no <code>flock</code></strong> and its <code>date</code> has no <code>-d</code>. That is fine here because every script that needs them runs on the VPS; if you ever must lock on the Mac, <code>mkdir /tmp/x.lock</code> (atomic) is the portable substitute.</li>
<li><strong>Apple Silicon building for an amd64 VPS:</strong> <code>--platform linux/amd64</code> works through emulation and is many times slower; a CI runner or a home machine of the right architecture is the usual answer (Chapter 13.2).</li>
<li><strong>Windows:</strong> run <code>deploy.sh</code> from WSL; Git Bash lacks some tools and Docker Desktop's contexts differ. Make sure <code>ops/*.sh</code> keep LF endings (<code>.gitattributes</code>, see 15.1) — <code>git archive</code> ships what is in the repository.</li>
</ul>

<h3>When this pipeline fits — and when to move on</h3>
<ul>
<li><strong>Fits</strong> one VPS and a team of a few people who deploy by hand, a few times a day — the shape of this project and of cuongthai.com's <code>deploy-nha.sh</code>.</li>
<li><strong>Move stage 1–3 into CI</strong> (Chapter 13.3) when more people push: the build machine becomes a runner, the SSH key becomes a secret, and the same <code>phat-hanh.sh</code> stays on the VPS.</li>
<li><strong>Move to rolling releases across machines</strong> (Chapter 14.2) when one VPS is not enough; blue/green on one machine does not survive the machine.</li>
<li><strong>Not for</strong> a PaaS, where "release" is a platform feature.</li>
</ul>

<div class="pitfall co-tieu-de"><strong>Trap — trusting the health check to approve a release.</strong> In release 3 the health check was green in 2 s while the page users actually load returned 500. A health endpoint answers "the process is up and can reach its database". It cannot know which columns the new code expects. Approve a release with a request that exercises what users do — a real read, through the real front door — and do it before users are sent there.</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Prepare the VPS with <code>chuan-bi-app.sh</code> and make one release of the app with <code>deploy.sh</code>. Confirm <code>curl https://phongkham.test/api/version</code> from vps2 shows the commit.</li>
<li>Start <code>dem.sh 25</code> on vps2, change the list query to select a column that does not exist, commit, and deploy.</li>
<li>Read the output: which stage stopped it, what did the new colour say, and what did <code>dem.sh</code> count?</li>
<li>Add the missing migration, commit, deploy again under load.</li>
</ol>
<p><strong>Done when:</strong> the broken release ends with <code>HONG thu-truoc (chua khach nao thay)</code> and <code>dem.sh</code> counts only 200s; the fixed release ends with <code>OK</code> and the front door reports its tag.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">release pipeline</span><span class="v">The fixed sequence every version goes through: build, check, push, release.</span></div>
  <div class="kv"><span class="k">image tag = commit</span><span class="v">Naming the image by the commit it was built from, so every version is identifiable and can be rolled back to.</span></div>
  <div class="kv"><span class="k">blue/green</span><span class="v">Two copies of the app; the new one starts next to the old, the proxy switches, the old one drains.</span></div>
  <div class="kv"><span class="k">upstream</span><span class="v">The group of back-end servers nginx forwards to; here, one line that names the live colour.</span></div>
  <div class="kv"><span class="k">smoke test</span><span class="v">A few requests after a release that prove the most important paths work, through the front door.</span></div>
  <div class="kv"><span class="k">pre-switch check</span><span class="v">The same kind of request sent to the new copy directly, before users are sent there.</span></div>
  <div class="kv"><span class="k"><code>flock</code></span><span class="v">A lock on a file descriptor: one holder at a time, released by the kernel when the process ends.</span></div>
  <div class="kv"><span class="k">SIGPIPE</span><span class="v">The signal a process gets when it writes to a pipe nobody reads; by default it terminates the process.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>The VPS never builds: images are built from <code>git archive HEAD</code>, checked, pushed under the commit hash, then pulled.</li>
<li><code>kiem-anh.sh</code> refuses an image for the wrong platform, with a library that cannot load, or an app that cannot start.</li>
<li><code>phat-hanh.sh</code> locks, migrates once, starts the new colour next to the old, checks health and a real read, switches nginx with one line, and waits for the front door to report the new version.</li>
<li>A failed release does not undo its migration: every migration must be safe for the version still running.</li>
<li>Measured under load: an early smoke test made 4 × 502; a post-switch check let 21 × 500 through; a pre-switch check made it zero.</li>
<li>One release at a time (<code>flock -n</code>, exit 3), and never pipe a release into <code>head</code>.</li>
</ul>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">flock(1)</span><span class="lc-sub">man7.org/linux/man-pages/man1/flock.1.html — <code>-n</code>, file descriptors, and why the lock dies with the process.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">pipe(7)</span><span class="lc-sub">man7.org/linux/man-pages/man7/pipe.7.html — writing to a pipe with no reader, and SIGPIPE.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">docker container run</span><span class="lc-sub">docs.docker.com/reference/cli/docker/container/run/ — <code>--init</code>, <code>--restart</code>, <code>--memory</code>, publishing on an address.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — Client connection defaults</span><span class="lc-sub">postgresql.org/docs/16/runtime-config-client.html — <code>lock_timeout</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">timeout(1)</span><span class="lc-sub">man7.org/linux/man-pages/man1/timeout.1.html — the coreutils version; BusyBox's behaves differently as PID 1.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker course — images, registries, Compose</span><span class="lc-sub">/courses/docker/learn${REF} — Dockerfiles, tags and pushing, the basis of stages 1–3.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.2</span>
<h2>Ngày 2: đường ống phát hành, chạy thật — kể cả lần phát hành hỏng</h2>
<p class="lead">Ngày 1 để lại một máy chủ phục vụ trang "sắp ra mắt". Ngày 2 xây con đường mà mọi phiên bản về sau sẽ đi: một lệnh trên máy build dựng ảnh chỉ từ mã đã commit, từ chối đẩy một ảnh không chạy nổi, rồi nhờ VPS kéo ảnh về, chạy migration CSDL đúng một lần, khởi động bản mới cạnh bản cũ, kiểm nó, chuyển nginx sang, và cho bản cũ nghỉ. Sau đó con đường ấy được chạy bảy lần trong lúc một khách hàng ở máy khác gọi trang liên tục — và ba trong số đó hỏng. Mỗi cú hỏng được giữ lại ở đây, kèm số người dùng nó làm đau, vì cú nào cũng làm script thay đổi.</p>

<h3>Vì sao VPS không build gì cả</h3>
${slide('dv-15', 9, 'Bốn chặng của một lần phát hành — VPS không build gì cả')}
<p>Chương 8 đã đo một VPS nhỏ giết <code>next build</code> với mã thoát 137, và Chương 13.2 kể chuyện thật ngày 18/08: 7,6 GB cache build làm đầy cái đĩa mà Postgres đang sống trên đó. Bài 15.4 dựng lại sự cố ấy. Kết luận đã nằm sẵn trong <code>deploy-nha.sh</code> của dự án: build trên máy mạnh, đẩy lên registry, VPS chỉ kéo về và tráo. Đường ống có bốn chặng:</p>
<ol>
<li><strong>Dựng</strong> trên máy build, từ <code>git archive HEAD</code> — chỉ những gì đã commit.</li>
<li><strong>Kiểm ảnh</strong> trước khi nó rời máy: đúng nền CPU, mọi thư viện nạp được, app khởi động được.</li>
<li><strong>Đẩy</strong> lên registry với tag chính là mã băm của commit.</li>
<li><strong>Phát hành trên VPS</strong> qua đúng một lệnh sudo mà người dùng <code>deploy</code> có.</li>
</ol>
<p>Trước lần phát hành đầu tiên có một bước chuẩn bị chạy một lần trên VPS (<code>chuan-bi-app.sh</code>, bằng root): tạo mạng Docker <code>phongkham</code>, sinh mật khẩu CSDL vào <code>/etc/phongkham/phongkham.env</code> (quyền 600, không bao giờ in ra), khởi động Postgres <strong>không publish cổng nào</strong> (Chương 12.3), cài <code>phat-hanh.sh</code>, và viết site nginx có upstream. Lần chạy đầu của nó hỏng theo một kiểu đáng biết khi bạn tự dựng lại phòng thí nghiệm này:</p>
<div class="out">docker: Error response from daemon: failed to mount /tmp/containerd-mount1620318027: mount source: "overlay", target: "/tmp/containerd-mount1620318027", fstype: overlay, flags: 0, data: "workdir=/var/lib/docker/containerd/daemon/io.containerd.snapshotter.v1.overlayfs/snapshots/12/work,…", err: invalid argument</div>
<p>Docker chạy bên trong một container không chồng được hệ thống tệp overlay của nó lên gốc overlay của chính container. Cho VPS thí nghiệm một volume Docker ở <code>/var/lib/docker</code> là hết (phần "Chạy thử" của 15.1 đã có sẵn dòng đó). VPS thật có đĩa bình thường, không bao giờ gặp chuyện này. Lần chạy thứ hai:</p>
<div class="out">  pk-db: postgres (PostgreSQL) 16.15
-rw------- 1 root root 137 Sep 29 09:31 /etc/phongkham/phongkham.env
POSTGRES_PASSWORD
DATABASE_URL

real	0m38.098s</div>
<p>Chỉ <em>tên</em> biến được in ra (<code>cut -d= -f1</code>) — một bí mật không bao giờ đi ra terminal, log hay slide.</p>

<h3>Ứng dụng, và hai thứ nó làm riêng cho việc deploy</h3>
<p>API rất bình thường, nhưng có hai mẩu nhỏ tồn tại chỉ để nó deploy được an toàn:</p>
<pre><code class="language-javascript">const BAN = process.env.BAN || 'dev';                 <span class="tok-comment">// ghi vao anh luc dung (ARG BAN)</span>
…
if (req.url === '/api/health') { await db.query('select 1'); return json(res, 200, { ok: true, ban: BAN }); }
if (req.url === '/api/version') return json(res, 200, { ban: BAN });
…
<span class="tok-comment">// Tat tu te (Ch3.2): ngung nhan ket noi moi, tra not request dang do, dong pool.</span>
process.on('SIGTERM', () =&gt; { console.log('SIGTERM: dang xa'); sv.close(() =&gt; db.end(() =&gt; process.exit(0))); setTimeout(() =&gt; process.exit(0), 15000).unref(); });</code></pre>
<ul>
<li><strong><code>/api/version</code></strong> trả lời commit mà ảnh được dựng từ đó (<code>BAN</code> — "bản", nạp vào lúc dựng bằng <code>ARG BAN</code> trong Dockerfile). Luật của Chương 1.4 — máy chủ phải tự khai nó là bản nào — là thứ cho phép script phát hành CHỨNG MINH cửa trước đang phục vụ bản mới chứ không phải bản cũ.</li>
<li><strong>SIGTERM</strong> đóng socket nghe, để các request đang dở chạy xong rồi đóng pool kết nối (Chương 3.2). <code>docker stop -t 20</code> gửi SIGTERM và chờ tối đa 20 s trước khi SIGKILL.</li>
</ul>
<p>Migration là các tệp SQL, áp bằng <code>migrate.js</code> chạy như một container dùng-một-lần, TRƯỚC khi API mới khởi động:</p>
<pre><code class="language-javascript">await c.query('select pg_advisory_lock(15)');                     <span class="tok-comment">// hai migrator cung luc -&gt; nguoi sau cho</span>
await c.query('create table if not exists schema_migrations (ten text primary key, luc timestamptz default now())');
…
for (const f of tep) {
  if (da.has(f)) continue;
  await c.query('begin');
  try {
    await c.query(&#96;set local lock_timeout = '\${process.env.LOCK_TIMEOUT || '5s'}'&#96;);
    await c.query(fs.readFileSync(__dirname + '/migrations/' + f, 'utf8'));
    await c.query('insert into schema_migrations (ten) values ($1)', [f]);
    await c.query('commit');
  } catch (e) { await c.query('rollback'); console.error(&#96;migration \${f} HONG: \${e.message}&#96;); process.exit(1); }
}</code></pre>
<p>Ba chi tiết của Chương 5, mỗi cái một dòng: khoá tư vấn (advisory lock) để hai migrator không bao giờ chạy cùng lúc; mỗi tệp một giao dịch, nên tệp hỏng không để lại gì nửa vời; và <code>lock_timeout</code>, để một migration không lấy được khoá bảng thì bỏ cuộc sau 5 s thay vì bắt mọi lệnh đọc xếp hàng sau nó — Bài 15.4 đo cả hai hành vi.</p>
<pre><code class="language-dockerfile">FROM node:22-bookworm-slim
WORKDIR /app
COPY app/package.json ./
RUN npm install --omit=dev --no-audit --no-fund
COPY app/ ./
ARG BAN=dev
ENV BAN=$BAN NODE_ENV=production
USER node
EXPOSE 3000
CMD ["node", "server.js"]</code></pre>

<h3><code>deploy.sh</code>: chỉ mã đã commit mới được lên</h3>
${slide('dv-15', 10, 'deploy.sh: chỉ bản đã commit mới được lên')}
<pre><code class="language-bash">#!/usr/bin/env bash
<span class="tok-comment"># deploy.sh — chay tren MAY BUILD (laptop/may nha): dung anh -&gt; kiem -&gt; day registry -&gt; VPS keo + trao.</span>
<span class="tok-comment"># Giong duong cua deploy-nha.sh: VPS khong build gi ca.</span>
set -Eeuo pipefail
trap 'echo "deploy: HONG o dong $LINENO: $BASH_COMMAND" &gt;&amp;2' ERR
cd "$(git rev-parse --show-toplevel)"
REG=\${REG:-localhost:19155}            <span class="tok-comment"># registry nhin tu may build</span>
VPS_SSH=\${VPS_SSH:?dat VPS_SSH, vd "ssh -p 19152 deploy@127.0.0.1"}
[ -z "$(git status --porcelain)" ] || { echo "cay lam viec con thay doi chua commit -&gt; tu choi (chi ban DA COMMIT moi duoc len)"; exit 2; }
TAG=$(git rev-parse --short=7 HEAD)
t0=$SECONDS
echo "① dung $TAG tu git archive (chi noi dung da commit)"
git archive HEAD | docker build -q --platform linux/arm64 --build-arg BAN="$TAG" -t "$REG/phongkham:$TAG" - &gt;/dev/null
echo "② kiem anh truoc khi day"
ops/kiem-anh.sh "$REG/phongkham:$TAG"
echo "③ day $REG/phongkham:$TAG"
docker push -q "$REG/phongkham:$TAG" &gt;/dev/null
echo "④ VPS keo + trao"
$VPS_SSH "sudo /opt/phongkham/bin/phat-hanh.sh $TAG"
echo "xong $TAG sau $((SECONDS - t0)) s"</code></pre>
<table>
<tr><th>Mẩu</th><th>Vì sao</th></tr>
<tr><td><code>git status --porcelain</code> phải rỗng</td><td>Tệp đã sửa hay chưa theo dõi đằng nào cũng không vào ảnh (xem dòng dưới) — từ chối thì trung thực hơn là ship một thứ khác với cái bạn đang nhìn. <code>deploy-nha.sh</code> hỏi <code>[y/N]</code> đúng ở chỗ này.</td></tr>
<tr><td><code>git archive HEAD | docker build … -</code></td><td>Ngữ cảnh build là một tệp tar của commit, đọc từ stdin (<code>-</code>). Một tệp đang lưu dở của phiên soạn thảo khác không thể lọt vào — <code>deploy.sh</code> cũ của dự án từng chộp trúng đúng thứ đó qua rsync.</td></tr>
<tr><td><code>TAG=$(git rev-parse --short=7 HEAD)</code></td><td>Tag CHÍNH LÀ commit (Chương 1.4). Không bao giờ <code>latest</code>: một tag cứ di chuyển thì không lùi về được.</td></tr>
<tr><td><code>--platform linux/arm64</code></td><td>VPS thí nghiệm là arm64 như Mac. VPS thật thường là amd64 — khi đó ghi <code>linux/amd64</code>, và máy M1 build qua giả lập (chậm) hoặc qua một máy build đúng kiến trúc.</td></tr>
<tr><td><code>--build-arg BAN="$TAG"</code></td><td>Chuỗi phiên bản mà app đang chạy sẽ khai ra.</td></tr>
<tr><td><code>$VPS_SSH "sudo …/phat-hanh.sh $TAG"</code></td><td>Thứ DUY NHẤT máy build được nhờ VPS làm. Không shell, không nhóm docker — một script, một tham số.</td></tr>
</table>

<h3><code>kiem-anh.sh</code>: từ chối đẩy một ảnh không chạy nổi</h3>
<pre><code class="language-bash">#!/usr/bin/env bash
<span class="tok-comment"># kiem-anh.sh ANH [nen=linux/arm64] — tu choi DAY mot anh khong chay noi (chay TRUOC docker push)</span>
set -Eeuo pipefail
ANH=\${1:?can ten anh}; NEN=\${2:-linux/arm64}
co=$(docker image inspect -f '{{.Os}}/{{.Architecture}}' "$ANH")
[ "$co" = "$NEN" ] || { echo "HONG: anh la $co, VPS can $NEN"; exit 1; }
<span class="tok-comment"># 1) moi thu vien trong package.json nap duoc TRONG anh (bat anh thieu node_modules, sai libc)</span>
docker run --rm "$ANH" node -e '
  for (const d of Object.keys(require("./package.json").dependencies || {})) require(d);
  console.log("  thu vien nap duoc:", Object.keys(require("./package.json").dependencies).join(" "))'
<span class="tok-comment"># 2) app khoi dong toi luc lang nghe (DB gia: chi can khong chet truoc khi listen)</span>
<span class="tok-comment"># --init: tren anh Alpine, "timeout" cua busybox exec node thanh PID 1 — PID 1 lo SIGTERM -&gt; treo mai (do that)</span>
out=$(docker run --rm --init -e DATABASE_URL=postgres://x:x@127.0.0.1:1/x "$ANH" timeout 3 node server.js 2&gt;&amp;1 || true)
case "$out" in *"nghe :3000"*) echo "  khoi dong duoc: \${out%%$'\\n'*}" ;;
  *) echo "HONG: app khong khoi dong:"; echo "$out" | head -3; exit 1 ;; esac
echo "  OK $ANH ($co)"</code></pre>
<p>Ba phép kiểm, mỗi phép nhắm vào một kiểu hỏng mà "build xanh" không bắt được: ảnh dựng cho sai CPU; một thư viện không nạp được bên trong ảnh (sự cố Alpine/glibc ngày 18/08 làm API chết bảy phút — dựng lại ở 15.4); và app chết trước khi kịp lắng nghe. Phép kiểm thứ hai cần một URL CSDL trỏ vào hư không: app phải tới được <code>listen</code>, còn nối vào CSDL thì không thuộc về việc khởi động.</p>
<p>Chữ <code>--init</code> trên dòng đó được tìm ra khi chạy phép kiểm với một ảnh Alpine ở 15.4: nó treo hơn ba phút. Trên Alpine, <code>timeout</code> là của BusyBox, bản này <code>exec</code> lệnh để <code>node</code> thành PID 1 của container — và PID 1 bỏ qua SIGTERM trừ khi nó tự cài bộ xử lý, nên hết giờ mà không giết được. <code>docker run --init</code> đặt một tiến trình init nhỏ ở PID 1 để chuyển tiếp tín hiệu. Với ảnh Debian (<code>timeout</code> của coreutils) chuyện này không xảy ra — cũng chính vì vậy mà nó nằm im cho tới khi phép kiểm gặp một ảnh nền khác.</p>

<h3><code>phat-hanh.sh</code>: lần phát hành trên VPS</h3>
${slide('dv-15', 11, 'phat-hanh.sh: khoá, migration, màu mới')}
<p>Đây là bản cuối, sau những chỗ sửa mà bài này và bài sau kể lại. Đọc một lượt từ trên xuống, rồi đọc từng phần ở bảng dưới:</p>
<pre><code class="language-bash">#!/usr/bin/env bash
<span class="tok-comment"># phat-hanh.sh TAG | lui — chay TREN VPS bang sudo (dong sudoers duy nhat cua deploy).</span>
<span class="tok-comment"># keo anh -&gt; migration MOT lan -&gt; mau moi len canh mau cu -&gt; cho health -&gt; tro nginx -&gt; smoke qua HTTPS -&gt; dung mau cu.</span>
set -Eeuo pipefail
KHO=dv15-reg:5000/phongkham; TEN=phongkham.test
ENV=/etc/phongkham/phongkham.env; SO=/var/log/phongkham/phat-hanh.log; MAU=/etc/phongkham/mau-dang-chay
UP=/etc/nginx/phongkham-upstream.conf
ghi() { echo "$(date +%FT%T) $*" | tee -a "$SO"; }
trap 'ghi "\${TAG:-?} HONG dong $LINENO: $BASH_COMMAND"' ERR   <span class="tok-comment"># moi lan chet giua chung deu de lai dau vet trong so</span>

exec 9&gt;/run/phongkham-phat-hanh.lock
flock -n 9 || { echo "TU CHOI: mot lan phat hanh khac dang chay (khoa /run/phongkham-phat-hanh.lock)"; exit 3; }

TAG=\${1:?cach dung: phat-hanh.sh TAG | lui}
if [ "$TAG" = lui ]; then
  <span class="tok-comment"># thu tu phat hanh = lan OK DAU TIEN cua moi tag; lui = tag dung TRUOC tag dang chay trong thu tu do.</span>
  <span class="tok-comment"># (ban dau lay "OK gan nhat khac ban dang chay": lui hai lan thi nhay TOI ban moi — do that 29/09)</span>
  dang=$(awk '$3=="OK"{t=$2} END{print t}' "$SO")
  TAG=$(awk '$3=="OK" &amp;&amp; !thay[$2]++ {print $2}' "$SO" | grep -B1 -x "$dang" | head -n -1 | tail -1)
  [ -n "$TAG" ] || { echo "khong co ban nao truoc $dang de lui"; exit 2; }
  echo "lui: $dang -&gt; $TAG"; KHONG_MIGRATE=1
fi
[[ $TAG =~ ^[0-9a-f]{7}$ ]] || { echo "tag la: $TAG"; exit 2; }
cu=$(cat "$MAU" 2&gt;/dev/null || echo "")
if [ "$cu" = xanh ]; then moi=lam; cong=3002; else moi=xanh; cong=3001; fi
cong_cu=$([ "$moi" = xanh ] &amp;&amp; echo 3002 || echo 3001)

ghi "$TAG bat-dau mau=$moi"
docker pull -q "$KHO:$TAG" &gt;/dev/null
if [ -z "\${KHONG_MIGRATE:-}" ]; then
  docker run --rm --network phongkham --env-file "$ENV" "$KHO:$TAG" node migrate.js
fi
docker rm -f "pk-$moi" &gt;/dev/null 2&gt;&amp;1 || true
docker run -d --name "pk-$moi" --network phongkham --env-file "$ENV" -p "127.0.0.1:$cong:3000" \\
  --restart unless-stopped --memory 256m "$KHO:$TAG" &gt;/dev/null

for i in $(seq 1 20); do
  curl -fsS -o /dev/null "http://127.0.0.1:$cong/api/health" 2&gt;/dev/null &amp;&amp; break
  if [ "$i" = 20 ] || [ "$(docker inspect -f '{{.State.Status}}' "pk-$moi")" = exited ] || \\
     [ "$(docker inspect -f '{{.RestartCount}}' "pk-$moi")" -gt 1 ]; then
    echo "--- log pk-$moi:"; docker logs --tail 5 "pk-$moi" 2&gt;&amp;1
    docker rm -f "pk-$moi" &gt;/dev/null; ghi "$TAG HONG health (ban cu van phuc vu: \${cu:-khong co})"; exit 4
  fi
  sleep 1
done
echo "  health xanh sau \${i} s"
<span class="tok-comment"># thu DUONG DOC THAT tren mau moi TRUOC khi cho no nhan khach (health "select 1" khong biet cot nao thieu)</span>
if ! curl -fsS -o /dev/null "http://127.0.0.1:$cong/api/lich-hen"; then
  echo "--- mau moi tra loi o /api/lich-hen:"; curl -s "http://127.0.0.1:$cong/api/lich-hen"; echo
  docker rm -f "pk-$moi" &gt;/dev/null; ghi "$TAG HONG thu-truoc (chua khach nao thay)"; exit 4
fi

cat &gt; "$UP" &lt;&lt;&lt; "server 127.0.0.1:$cong;"       <span class="tok-comment"># ghi DE TAI CHO (giu inode), khong mv</span>
nginx -t -q &amp;&amp; nginx -s reload

smoke() { curl -fsS --resolve "$TEN:443:127.0.0.1" "https://$TEN$1"; }
<span class="tok-comment"># reload chi GUI tin hieu: vai tram ms sau worker cu van tra ban cu -&gt; CHO cua truoc noi dung ban, toi da 10 s</span>
cho_ban() { for i in $(seq 1 20); do [ "$(smoke /api/version 2&gt;/dev/null | jq -r .ban)" = "$1" ] &amp;&amp; return 0; sleep 0.5; done; return 1; }
if ! cho_ban "$TAG" || ! smoke /api/lich-hen &gt;/dev/null; then
  echo "SMOKE HONG qua cua truoc (HTTPS): ban=$(smoke /api/version | jq -r .ban), can $TAG"
  if [ -n "$cu" ]; then
    cat &gt; "$UP" &lt;&lt;&lt; "server 127.0.0.1:$cong_cu;"; nginx -s reload
    cho_ban "$(awk '$3=="OK"{t=$2} END{print t}' "$SO")" || echo "CANH BAO: cua truoc chua ve ban cu"
  fi
  docker rm -f "pk-$moi" &gt;/dev/null; ghi "$TAG HONG smoke"; exit 5
fi
echo "  cua truoc (HTTPS) tra ban $TAG"
echo "$moi" &gt; "$MAU"
if [ -n "$cu" ]; then sleep 2; docker stop -t 20 "pk-$cu" &gt;/dev/null; docker rm "pk-$cu" &gt;/dev/null; fi
ghi "$TAG OK mau=$moi"</code></pre>
<table>
<tr><th>Phần</th><th>Bảo đảm điều gì</th></tr>
<tr><td><code>exec 9&gt;…lock; flock -n 9</code></td><td>Mỗi lúc chỉ một lần phát hành. <code>-n</code>: khoá đang bị giữ thì thoát ngay với mã 3 thay vì chờ. Khoá thuộc về bộ mô tả tệp (fd) số 9 của tiến trình này, nên script chết thì nhân hệ điều hành tự nhả — không có tệp khoá "mồ côi" phải xoá tay (Chương 7.3).</td></tr>
<tr><td><code>[[ $TAG =~ ^[0-9a-f]{7}$ ]]</code></td><td>Tham số đến từ một máy khác qua sudo: chỉ nhận đúng hình dạng của một mã băm commit ngắn.</td></tr>
<tr><td><code>node migrate.js</code> trong container dùng-một-lần</td><td>Migration chạy một lần, trước khi có bất kỳ tiến trình API mới nào, bằng chính mã trong ảnh (Chương 5.5).</td></tr>
<tr><td><code>-p "127.0.0.1:$cong:3000"</code></td><td>App chỉ với tới được từ chính VPS; nginx là cánh cửa duy nhất (Chương 12.3).</td></tr>
<tr><td>vòng health có <code>RestartCount</code></td><td>Thôi chờ ngay khi container đã thoát hoặc khởi động lại hai lần — vòng lặp sập-dậy không phải là "đang khởi động".</td></tr>
<tr><td>thử <code>/api/lich-hen</code> trên màu mới</td><td>Một đường đọc chạm vào bảng thật, TRƯỚC khi có người dùng nào bị gửi sang. Thêm vào sau lần phát hành 5 ở dưới.</td></tr>
<tr><td><code>cat &gt; "$UP" &lt;&lt;&lt; …</code></td><td>Ghi đè tệp upstream TẠI CHỖ, giữ nguyên inode — bài học ngày 25/08 (Chương 13.1, và sự cố 6 ở 15.4).</td></tr>
<tr><td><code>cho_ban</code> rồi <code>smoke /api/lich-hen</code></td><td>Qua cửa trước, bằng tên, qua HTTPS, như một người dùng: đúng bản trả lời và một lần đọc thật chạy được. Thêm vào sau lần phát hành 3 ở dưới.</td></tr>
<tr><td><code>docker stop -t 20</code> sau 2 s</td><td>Màu cũ chỉ nhận SIGTERM sau khi nginx thôi gửi request mới cho nó, và có 20 s để làm xong những request đang có.</td></tr>
<tr><td><code>ghi</code> + <code>trap … ERR</code></td><td>Lần chạy nào cũng để lại <code>bat-dau</code> rồi <code>OK</code> hoặc <code>HONG</code> trong sổ phát hành — cuốn sổ mà <code>lui</code> đọc.</td></tr>
</table>

<h3>Xanh/lam sau nginx: tráo bằng một dòng</h3>
${slide('dv-15', 12, 'Xanh/lam sau nginx: tráo bằng một dòng upstream')}
<p>Site mà nginx phục vụ ở cổng 443 không ghi tên cổng nào; nó <code>include</code> một tệp một dòng:</p>
<pre><code class="language-nginx">upstream phongkham_api {
    include /etc/nginx/phongkham-upstream.conf;   <span class="tok-comment"># MOT dong "server 127.0.0.1:300x;" — phat-hanh.sh ghi de tai cho</span>
    keepalive 8;
}
server {
    listen 443 ssl http2;
    server_name phongkham.test www.phongkham.test;
    ssl_certificate     /etc/letsencrypt/live/phongkham.test/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/phongkham.test/privkey.pem;
    location / {
        proxy_pass http://phongkham_api;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_next_upstream error timeout http_502;
    }
}</code></pre>
<p>Xanh (<code>pk-xanh</code>, cổng 3001) và lam (<code>pk-lam</code>, cổng 3002) thay phiên nhau. Một lần phát hành khởi động màu đang KHÔNG chạy, chứng minh nó trả lời được, ghi lại đúng một dòng, nạp lại nginx, chờ tới khi cửa trước khai đúng bản mới, rồi mới dừng màu cũ. Không có khoảnh khắc nào cả hai cùng vắng mặt. <code>keepalive 8</code> cùng <code>proxy_http_version 1.1</code> và header <code>Connection</code> rỗng giữ kết nối tới app mở giữa các request; Chương 3 đã chỉ ra vì sao nạp lại vẫn an toàn với chúng (worker cũ làm xong kết nối của mình, worker mới mở kết nối mới).</p>

<h3>Bảy lần phát hành, đo từ một máy khác</h3>
${slide('dv-15', 13, 'Mỗi lần hỏng dạy script một điều')}
<p>Trong mỗi lần phát hành, một khách hàng trên <code>dv15-vps2</code> chạy đoạn này suốt 25 giây — mỗi request một kết nối mới, như một trình duyệt vừa mở trang:</p>
<pre><code class="language-bash">#!/bin/bash
<span class="tok-comment"># dem.sh GIAY [duong] — goi https://phongkham.test&lt;duong&gt; lien tuc tu may khac, dem ma tra ve</span>
end=$((SECONDS+$1)); : &gt; /tmp/ma.txt
while [ $SECONDS -lt $end ]; do
  curl -s -o /dev/null -w '%{http_code}\\n' --max-time 3 https://phongkham.test\${2:-/api/lich-hen} &gt;&gt; /tmp/ma.txt
done
echo "$(wc -l &lt; /tmp/ma.txt) request trong $1 s:"; sort /tmp/ma.txt | uniq -c</code></pre>
<p><strong>Lần 1 (<code>10e26b6</code>) — smoke-test không tin chứng chỉ.</strong> Migration 001 chạy, container mới khoẻ sau 2 s, nginx chuyển sang, rồi:</p>
<div class="out">curl: (60) SSL certificate problem: unable to get local issuer certificate
…
SMOKE HONG: cua truoc tra ban=? (can 10e26b6)
2026-09-29T09:32:45 10e26b6 HONG smoke</div>
<p>Smoke-test đi qua cửa trước y như người dùng — bằng tên, qua HTTPS, với danh sách CA được tin của hệ thống. CA của phòng thí nghiệm (Pebble) không có trong danh sách đó trên VPS; chứng chỉ Let's Encrypt thật thì có. Cài gốc của lab vào kho tin cậy của VPS (<code>update-ca-certificates</code>) là xong. Hai điều cần để ý: chưa có bản cũ nào, nên trang trả <code>502</code> cho tới lần chạy sau — chấp nhận được trước ngày ra mắt, không bao giờ được sau đó; và <strong>migration 001 vẫn nằm lại</strong> dù lần phát hành hỏng. Lần chạy sau in <code>khong co migration moi</code> ("không có migration mới"). Migration không nằm trong phần lùi của lần phát hành: vì vậy mọi migration trong chương này phải an toàn với cả bản ĐANG chạy (Chương 5.1).</p>
<div class="out">2026-09-29T09:33:14 10e26b6 bat-dau mau=xanh
khong co migration moi
  health xanh sau 2 s
2026/09/29 09:33:16 [notice] 3619#3619: signal process started
2026-09-29T09:33:16 10e26b6 OK mau=xanh
xong 10e26b6 sau 9 s</div>
<p><strong>Lần 2 (<code>b19213a</code>) — một bản đúng bị từ chối, và bốn lần 502.</strong> Bản này thêm một migration mở rộng (bài sau) và hoàn toàn đúng. Script vẫn từ chối:</p>
<div class="out">migration 002_ho_ten_mo_rong.sql xong (4 ms)
1 migration moi
  health xanh sau 2 s
2026/09/29 09:33:48 [notice] 3897#3897: signal process started
SMOKE HONG: cua truoc tra ban=10e26b6 (can b19213a)
2026/09/29 09:33:48 [notice] 3913#3913: signal process started
2026-09-29T09:33:48 b19213a HONG smoke
$ dem.sh 25        # tren dv15-vps2, cung luc
906 request trong 25 s:
    902 200
      4 502</div>
<p>Smoke-test hỏi phiên bản ngay trong cùng giây với lần nạp lại, và được một worker CŨ trả lời: <code>ban=10e26b6</code>. Đúng cuộc đua của Ngày 1 — <code>nginx -s reload</code> trả về trước khi worker mới phục vụ. Tệ hơn, chính đường lùi gây ra bốn lần 502: script trỏ nginx về màu cũ rồi xoá container mới NGAY, trong lúc các worker còn giữ upstream mới vẫn đang gửi request vào nó. Cách sửa là <code>cho_ban</code> ("chờ bản"): hỏi cửa trước tối đa 20 lần, cách nhau nửa giây, tới khi nó khai đúng tag mong đợi — cả sau khi chuyển tới lẫn sau khi chuyển về. Chạy lại thành <code>2139d95</code>:</p>
<div class="out">2026-09-29T09:34:33 2139d95 bat-dau mau=lam
khong co migration moi
  health xanh sau 2 s
2026/09/29 09:34:34 [notice] 4247#4247: signal process started
  cua truoc (HTTPS) tra ban 2139d95
2026-09-29T09:34:37 2139d95 OK mau=lam
xong 2139d95 sau 12 s
$ dem.sh 25        # tren dv15-vps2, cung luc
917 request trong 25 s:
    917 200</div>

<h3>Lần phát hành hỏng: 21 lỗi, rồi bằng không</h3>
${slide('dv-15', 14, 'Bắt lỗi trước khi khách thấy: 21 request lỗi thành 0')}
<p><strong>Lần 3 (<code>4f67bce</code>) — cố tình hỏng.</strong> Mã giờ liệt kê thêm <code>so_dien_thoai</code>, và commit "quên" migration của nó — lý do thật phổ biến nhất khiến một lần deploy làm hỏng trang. Health chỉ chạy <code>select 1</code>, nên nó qua:</p>
<div class="out">2026-09-29T09:35:11 4f67bce bat-dau mau=xanh
khong co migration moi
  health xanh sau 2 s
2026/09/29 09:35:13 [notice] 4590#4590: signal process started
curl: (22) The requested URL returned error: 500
SMOKE HONG: cua truoc tra ban=4f67bce (can 4f67bce)
2026/09/29 09:35:14 [notice] 4639#4639: signal process started
2026-09-29T09:35:15 4f67bce HONG smoke
$ dem.sh 25        # tren dv15-vps2, cung luc
895 request trong 25 s:
    874 200
     21 500</div>
<p>Smoke-test làm đúng việc của nó — lần phát hành được tự lùi — nhưng chỉ SAU khi nginx đã gửi người dùng sang bản hỏng. Trong khoảng một giây rưỡi, 21 request thật nhận 500. (Thông báo cũng cho thấy vì sao câu chữ phải đổi: "cửa trước trả bản 4f67bce, cần 4f67bce" chẳng nói gì về việc lần <em>đọc</em> đã hỏng.) Cách sửa dời đường đọc thật lên TRƯỚC lúc tráo: gọi thẳng <code>/api/lich-hen</code> vào cổng của màu mới. Cùng đoạn mã hỏng đó, dựng lại thành <code>bb00bfd</code>:</p>
<div class="out">2026-09-29T09:35:52 bb00bfd bat-dau mau=xanh
khong co migration moi
  health xanh sau 2 s
curl: (22) The requested URL returned error: 500
--- mau moi tra loi o /api/lich-hen:
{"loi":"column \\"so_dien_thoai\\" does not exist"}
2026-09-29T09:35:54 bb00bfd HONG thu-truoc (chua khach nao thay)
$ dem.sh 25        # tren dv15-vps2, cung luc
957 request trong 25 s:
    957 200</div>
<p>Không lỗi nào, và thông báo gọi đúng tên cột bị thiếu. Thêm <code>003_so_dien_thoai.sql</code> thì lần sau, <code>ef8f9c5</code>, qua trong 14 s với 897 trên 897 request trả 200. Health vẫn có ích — nó bắt được một tiến trình đang chạy mà không nối nổi vào CSDL — nhưng nó trả lời câu "còn sống", không trả lời câu "đúng". Chỉ một lần đọc thật mới trả lời được câu "đúng".</p>
<table>
<tr><th>Tag</th><th>Kết quả</th><th>Người dùng (25 s trên vps2)</th><th>Script học được</th></tr>
<tr><td><code>10e26b6</code></td><td>HONG smoke (chưa tin CA)</td><td>502 — chưa có bản cũ</td><td>smoke đi qua tên thật và HTTPS</td></tr>
<tr><td><code>10e26b6</code></td><td>OK, 9 s</td><td>—</td><td>migration vẫn nằm lại sau lần phát hành hỏng</td></tr>
<tr><td><code>b19213a</code></td><td>HONG smoke (hỏi quá sớm)</td><td>902 × 200, 4 × 502</td><td><code>cho_ban</code>: hỏi lại có giới hạn sau mỗi lần nạp lại</td></tr>
<tr><td><code>2139d95</code></td><td>OK, 12 s</td><td>917 × 200</td><td></td></tr>
<tr><td><code>4f67bce</code></td><td>HONG smoke (thiếu cột)</td><td>874 × 200, 21 × 500</td><td>thử đường đọc TRƯỚC khi tráo</td></tr>
<tr><td><code>bb00bfd</code></td><td>HONG trước khi tráo</td><td>957 × 200</td><td></td></tr>
<tr><td><code>ef8f9c5</code></td><td>OK, 14 s</td><td>897 × 200</td><td></td></tr>
</table>

<h3>Một cái khoá chống phát hành chồng — và một cái ống đã giết một lần phát hành</h3>
${slide('dv-15', 15, 'flock chặn deploy chồng — và dấu ống vào head giết một lần deploy')}
<p>Hai bạn cùng deploy trong một phút là một sự cố thật của dự án (hai phiên tranh nhau cùng một ref). Có khoá, người thứ hai bị từ chối ngay và được nói rõ lý do:</p>
<div class="out">$ sudo /opt/phongkham/bin/phat-hanh.sh ef8f9c5 &gt; /tmp/a.txt 2&gt;&amp;1 &amp;
$ sudo /opt/phongkham/bin/phat-hanh.sh 2139d95; echo "exit=$?"
TU CHOI: mot lan phat hanh khac dang chay (khoa /run/phongkham-phat-hanh.lock)
exit=3</div>
<p>Mã thoát 3 khác với phát hành hỏng (4, 5) để bên gọi phân biệt được "thử lại sau" với "có thứ đang hỏng". Bài 15.4 gỡ cái khoá ra và cho thấy hai lần phát hành chồng nhau làm gì với cuốn sổ và với người dùng.</p>
<p>Một cách khác giết một lần phát hành đến từ một thói quen vô hại. Để chỉ xem mấy dòng đầu của một lần lùi bản, lệnh được đưa qua ống vào <code>head</code>:</p>
<div class="out">$ ssh … 'sudo /opt/phongkham/bin/phat-hanh.sh lui 2&gt;&amp;1 | head -2'
lui: 2139d95 -&gt; ef8f9c5
2026-09-29T09:37:40 ef8f9c5 bat-dau mau=lam
$ sed -n '/09:37:2/,$p' /var/log/phongkham/phat-hanh.log
2026-09-29T09:37:21 2139d95 bat-dau mau=xanh
2026-09-29T09:37:25 2139d95 OK mau=xanh
2026-09-29T09:37:40 ef8f9c5 bat-dau mau=lam
2026-09-29T09:37:53 10e26b6 bat-dau mau=lam
2026-09-29T09:37:57 10e26b6 OK mau=lam</div>
<p>Lần chạy lúc 09:37:40 có <code>bat-dau</code> rồi không có <code>OK</code> cũng không có <code>HONG</code> (các dòng 09:37:53 là lần phát hành kế tiếp, riêng biệt): script chết giữa chừng. <code>head -2</code> đọc đủ hai dòng rồi thoát; lần ghi kế tiếp của script rơi vào một cái ống không còn ai đọc, nhân hệ điều hành gửi nó SIGPIPE (tín hiệu ống vỡ), mà hành vi mặc định là kết thúc tiến trình. Lúc đó nó đã khởi động một container và chưa kịp chuyển nginx — lần phát hành sau dọn được, nhưng một lần phát hành bị giết giữa "chuyển nginx" và "ghi màu" sẽ để cuốn sổ và cái máy nói hai điều khác nhau. Đừng bao giờ đưa một lệnh làm thay đổi hệ thống qua ống vào <code>head</code>, <code>less</code> hay bất cứ thứ gì có thể thôi đọc giữa chừng. Chuyển hướng vào tệp rồi đọc tệp.</p>

<h3>Chạy thử từng bước</h3>
<pre><code class="language-bash"><span class="tok-comment"># trên Mac (máy build)</span>
docker run -d --name dv15-reg --label dvhoc=15 --network dv15-net -p 127.0.0.1:19155:5000 registry:2
<span class="tok-comment"># VPS, bằng root, một lần: mạng, CSDL (không -p), bí mật, phat-hanh.sh, upstream nginx</span>
ssh … root@… 'bash /root/ops/chuan-bi-app.sh'
<span class="tok-comment"># chỉ trong lab: cho VPS tin CA của lab, như VPS thật tin Let's Encrypt</span>
ssh … root@… 'cp /usr/local/share/pebble-root.pem /usr/local/share/ca-certificates/pebble-root-lab.crt &amp;&amp; update-ca-certificates'
<span class="tok-comment"># mỗi lần phát hành, từ kho mã trên Mac</span>
git commit -am "…"
VPS_SSH="ssh -i khoa -o UserKnownHostsFile=./known_hosts -p 19152 deploy@127.0.0.1" ops/deploy.sh
<span class="tok-comment"># trên vps2, song song với lần phát hành</span>
dem.sh 25</code></pre>

<h3>Trên Windows/WSL và macOS khác gì</h3>
<ul>
<li><strong>macOS không có <code>flock</code></strong>, và <code>date</code> của nó không có <code>-d</code>. Ở đây không sao, vì mọi script cần chúng đều chạy trên VPS; nếu có lúc buộc phải khoá trên Mac, <code>mkdir /tmp/x.lock</code> (nguyên tử) là cách thay thế chạy được mọi nơi.</li>
<li><strong>Apple Silicon build cho VPS amd64:</strong> <code>--platform linux/amd64</code> chạy qua giả lập và chậm hơn nhiều lần; một runner CI hoặc một máy nhà đúng kiến trúc là lời giải thường gặp (Chương 13.2).</li>
<li><strong>Windows:</strong> chạy <code>deploy.sh</code> trong WSL; Git Bash thiếu vài công cụ và ngữ cảnh của Docker Desktop khác đi. Giữ <code>ops/*.sh</code> ở kiểu xuống dòng LF (<code>.gitattributes</code>, xem 15.1) — <code>git archive</code> gửi đúng thứ nằm trong kho.</li>
</ul>

<h3>Khi nào đường ống này hợp — và khi nào đi tiếp</h3>
<ul>
<li><strong>Hợp</strong> với một VPS và một nhóm vài người deploy bằng tay, vài lần mỗi ngày — đúng hình dạng của dự án này và của <code>deploy-nha.sh</code> trên cuongthai.com.</li>
<li><strong>Dời chặng 1–3 vào CI</strong> (Chương 13.3) khi nhiều người cùng push: máy build thành runner, khoá SSH thành secret, còn <code>phat-hanh.sh</code> vẫn nằm nguyên trên VPS.</li>
<li><strong>Chuyển sang phát hành lần lượt qua nhiều máy</strong> (Chương 14.2) khi một VPS không đủ; xanh/lam trên một máy không sống sót nổi khi chính cái máy chết.</li>
<li><strong>Không dùng</strong> trên PaaS, nơi "phát hành" là một tính năng của nền tảng.</li>
</ul>

<div class="pitfall co-tieu-de"><strong>Bẫy — để health check duyệt một lần phát hành.</strong> Ở lần 3, health xanh sau 2 s trong khi chính trang người dùng mở trả 500. Một endpoint health trả lời câu "tiến trình đang chạy và nối được CSDL". Nó không thể biết mã mới trông đợi những cột nào. Hãy duyệt một lần phát hành bằng một request làm đúng việc người dùng làm — một lần đọc thật, qua cửa trước thật — và làm điều đó TRƯỚC khi người dùng bị gửi sang.</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Chuẩn bị VPS bằng <code>chuan-bi-app.sh</code> và làm một lần phát hành app bằng <code>deploy.sh</code>. Từ vps2, xác nhận <code>curl https://phongkham.test/api/version</code> trả đúng commit.</li>
<li>Bật <code>dem.sh 25</code> trên vps2, sửa câu truy vấn danh sách để chọn một cột không tồn tại, commit, rồi deploy.</li>
<li>Đọc output: chặng nào chặn nó lại, màu mới trả lời gì, và <code>dem.sh</code> đếm được gì?</li>
<li>Thêm migration còn thiếu, commit, deploy lại trong lúc vẫn có tải.</li>
</ol>
<p><strong>Đạt khi:</strong> lần phát hành hỏng kết thúc bằng <code>HONG thu-truoc (chua khach nao thay)</code> và <code>dem.sh</code> chỉ đếm toàn 200; lần đã sửa kết thúc bằng <code>OK</code> và cửa trước khai đúng tag của nó.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">release pipeline (đường ống phát hành)</span><span class="v">Chuỗi cố định mà phiên bản nào cũng đi qua: dựng, kiểm, đẩy, phát hành.</span></div>
  <div class="kv"><span class="k">image tag = commit (tag ảnh là commit)</span><span class="v">Đặt tên ảnh theo commit dựng ra nó, để phiên bản nào cũng nhận ra được và lùi về được.</span></div>
  <div class="kv"><span class="k">blue/green (xanh/lam)</span><span class="v">Hai bản sao của app; bản mới khởi động cạnh bản cũ, proxy chuyển sang, bản cũ xả rồi tắt.</span></div>
  <div class="kv"><span class="k">upstream (nhóm máy phía sau)</span><span class="v">Nhóm máy chủ phía sau mà nginx chuyển request tới; ở đây là một dòng ghi tên màu đang sống.</span></div>
  <div class="kv"><span class="k">smoke test (phép thử khói)</span><span class="v">Vài request sau một lần phát hành, chứng minh các đường quan trọng nhất còn chạy, đi qua cửa trước.</span></div>
  <div class="kv"><span class="k">pre-switch check (thử trước khi tráo)</span><span class="v">Cùng loại request đó gửi thẳng vào bản mới, TRƯỚC khi người dùng bị gửi sang.</span></div>
  <div class="kv"><span class="k"><code>flock</code> (khoá tệp)</span><span class="v">Khoá trên một bộ mô tả tệp: mỗi lúc một người giữ, nhân hệ điều hành tự nhả khi tiến trình kết thúc.</span></div>
  <div class="kv"><span class="k">SIGPIPE (tín hiệu ống vỡ)</span><span class="v">Tín hiệu tiến trình nhận khi ghi vào một ống không ai đọc; mặc định nó kết thúc tiến trình.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>VPS không bao giờ build: ảnh dựng từ <code>git archive HEAD</code>, được kiểm, đẩy lên với tên là mã băm commit, rồi mới được kéo về.</li>
<li><code>kiem-anh.sh</code> từ chối ảnh sai nền CPU, ảnh có thư viện không nạp được, và app không khởi động nổi.</li>
<li><code>phat-hanh.sh</code> khoá, chạy migration một lần, khởi động màu mới cạnh màu cũ, kiểm health và một lần đọc thật, tráo nginx bằng một dòng, rồi chờ cửa trước khai đúng bản mới.</li>
<li>Lần phát hành hỏng không gỡ migration của nó: migration nào cũng phải an toàn với bản đang chạy.</li>
<li>Đo dưới tải: smoke hỏi quá sớm gây 4 × 502; kiểm sau khi tráo để lọt 21 × 500; kiểm trước khi tráo đưa về 0.</li>
<li>Mỗi lúc một lần phát hành (<code>flock -n</code>, mã 3), và không bao giờ đưa một lần phát hành qua ống vào <code>head</code>.</li>
</ul>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">flock(1)</span><span class="lc-sub">man7.org/linux/man-pages/man1/flock.1.html — <code>-n</code>, bộ mô tả tệp, và vì sao khoá chết theo tiến trình.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">pipe(7)</span><span class="lc-sub">man7.org/linux/man-pages/man7/pipe.7.html — ghi vào một ống không có người đọc, và SIGPIPE.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">docker container run</span><span class="lc-sub">docs.docker.com/reference/cli/docker/container/run/ — <code>--init</code>, <code>--restart</code>, <code>--memory</code>, publish lên một địa chỉ.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — Mặc định cho kết nối client</span><span class="lc-sub">postgresql.org/docs/16/runtime-config-client.html — <code>lock_timeout</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">timeout(1)</span><span class="lc-sub">man7.org/linux/man-pages/man1/timeout.1.html — bản của coreutils; bản BusyBox hành xử khác khi là PID 1.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Khoá Docker — ảnh, registry, Compose</span><span class="lc-sub">/courses/docker/learn${REF} — Dockerfile, tag và đẩy ảnh, nền của chặng 1–3.</span></span></div>
</div>
`,
    },
    /* ─────────────────────────── 15.3 ─────────────────────────── */
    {
      title: "15.3 — Day 3: rolling back, backups you have restored, and a watcher outside the server|||15.3 — Ngày 3: lùi bản, bản sao lưu đã từng phục hồi, và một người canh ở ngoài máy",
      slug: "deploy-15-3-lui-ban-sao-luu",
      type: "LESSON",
      isFreePreview: true,
      description: "Lùi bản trong 3,7 giây và con bọ lùi hai lần đi tới; mở rộng thì lùi được, thu hẹp thì đóng cửa (đo 47 request lỗi); sao lưu kiểm ngay, kéo về bằng một khoá chỉ làm một việc, phục hồi bấm giờ sang máy khác (100,8 s rồi 3,4 s); canh từ ngoài chỉ báo khi đổi trạng thái.",
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.3</span>
<h2>Day 3: rolling back, backups you have restored, and a watcher outside the server</h2>
<p class="lead">By the end of Day 2 the team can ship. Day 3 is about the three things that decide whether the night before the defence is survivable: going back to the previous version in seconds, having a copy of the data that has actually been restored somewhere else, and hearing about an outage from a machine that is not the one that is down. Each of the three was rehearsed on the lab, and each rehearsal found something that would have failed on the real night.</p>

<h3>Rolling back: 3.7 seconds</h3>
${slide('dv-15', 16, 'Lùi bản: 3,7 giây — và con bọ lùi hai lần đi tới')}
<p>A rollback in this project is not a different mechanism: it is a release of an older tag, with the migration step skipped (the older code must run on the current schema — that is what expand-only migrations guarantee). <code>phat-hanh.sh lui</code> ("back") finds the tag from the release log. Measured while <code>dem.sh</code> ran on vps2:</p>
<div class="out">$ time sudo /opt/phongkham/bin/phat-hanh.sh lui
lui: ef8f9c5 -&gt; 2139d95
2026-09-29T09:37:21 2139d95 bat-dau mau=xanh
  health xanh sau 2 s
2026/09/29 09:37:23 [notice] 5944#5944: signal process started
  cua truoc (HTTPS) tra ban 2139d95
2026-09-29T09:37:25 2139d95 OK mau=xanh

real	0m3.709s
$ dem.sh 20        # tren dv15-vps2, cung luc
782 request trong 20 s:
    782 200</div>
<p>3.7 seconds, zero failed requests: the image of the previous version is still on the VPS, so there is nothing to pull, nothing to build and nothing to migrate. Compare that with "revert the commit, rebuild, redeploy" — minutes, while users wait. Chapter 6 made the same point with release directories; here the release directories are image tags.</p>
<p><strong>The bug: rolling back twice went forward.</strong> The first version of <code>lui</code> picked "the most recent OK release that is not the current one". Running it a second time, to go back one more step:</p>
<div class="out">$ sudo /opt/phongkham/bin/phat-hanh.sh lui
lui: 2139d95 -&gt; ef8f9c5</div>
<p>From the log's point of view, after rolling back to <code>2139d95</code> the "most recent OK that is not current" is <code>ef8f9c5</code> — the version you just left. Two presses of "back" is a toggle between the last two versions. At 2 a.m., with a broken <code>ef8f9c5</code>, the second press would have put the bug back in production. The fix defines order properly: the release order is the <em>first</em> OK of each tag; "back" means the tag just before the current one in that order:</p>
<pre><code class="language-bash">dang=$(awk '$3=="OK"{t=$2} END{print t}' "$SO")                    <span class="tok-comment"># tag dang chay = OK cuoi cung</span>
TAG=$(awk '$3=="OK" &amp;&amp; !thay[$2]++ {print $2}' "$SO" \\              <span class="tok-comment"># moi tag MOT lan, theo lan OK dau tien</span>
      | grep -B1 -x "$dang" | head -n -1 | tail -1)                  <span class="tok-comment"># dong dung TRUOC tag dang chay</span></code></pre>
<p><code>!thay[$2]++</code> is the awk idiom for "first time this value is seen"; <code>grep -B1 -x</code> prints the matching line and one line before it; <code>head -n -1</code> (GNU) drops the match itself. Three presses in a row after the fix:</p>
<div class="out">lui: 2139d95 -&gt; 10e26b6
2026-09-29T09:37:57 10e26b6 OK mau=lam
khong co ban nao truoc 10e26b6 de lui
khong co ban nao truoc 10e26b6 de lui</div>
<p>And the version that ended up running was <code>10e26b6</code> — the very first release, whose code knows nothing of <code>ho_ten</code> or <code>so_dien_thoai</code> — on a schema that has both. It worked, because every migration so far only <em>added</em>. That is the next section.</p>

<h3>Expand, contract, and the door that only opens one way</h3>
${slide('dv-15', 17, 'Mở rộng thì lùi được, thu hẹp thì đóng cửa')}
<p>The team wants to rename <code>ten_benh_nhan</code> (patient name) to <code>ho_ten</code> (full name). Chapter 5.2 taught the only safe way — expand, migrate the code, then contract — and this project did it for real:</p>
<pre><code class="language-sql">-- 002_ho_ten_mo_rong.sql — MO RONG (Ch5.2): them cot moi, KHONG xoa cot cu -&gt; ban cu van chay duoc tren luoc do nay
alter table lich_hen add column ho_ten text;
update lich_hen set ho_ten = ten_benh_nhan where ho_ten is null;</code></pre>
<p>The code of release <code>b</code> writes <em>both</em> columns and reads <code>coalesce(ho_ten, ten_benh_nhan)</code>. So both directions work:</p>
<ul>
<li><strong>Old code on the new schema</strong> (the rollback above): it reads and writes <code>ten_benh_nhan</code>, which still exists. A row it inserts has <code>ho_ten</code> empty:</li>
</ul>
<div class="out">$ docker exec pk-db psql -U postgres -c "select id, ten_benh_nhan, ho_ten from lich_hen order by id desc limit 2"
 id | ten_benh_nhan |   ho_ten
----+---------------+-------------
  4 | Tran Thi Mai  |
  3 | Benh nhan 3   | Benh nhan 3
(2 rows)</div>
<ul>
<li><strong>New code again</strong>, after releasing forward: the <code>coalesce</code> fills the gap, and the row written by the old version shows its name.</li>
</ul>
<div class="out">$ curl -s https://phongkham.test/api/lich-hen | jq -c ".[0]"
{"id":"4","ho_ten":"Tran Thi Mai","so_dien_thoai":null,"bac_si":"BS Hung","gio_hen":"2026-10-05T02:00:00.000Z"}</div>
<p>Then the contract step was done <strong>wrong on purpose</strong>: in the same release as the code that stops using the old column. To make it realistic, 300 000 appointments were inserted first (42 MB of data) and a backup was taken:</p>
<pre><code class="language-sql">-- 004_bo_ten_benh_nhan.sql — THU HEP, lam SAI THU TU co chu dich
update lich_hen set ho_ten = ten_benh_nhan where ho_ten is null;
alter table lich_hen alter column ho_ten set not null;
alter table lich_hen drop column ten_benh_nhan;</code></pre>
<div class="out">migration 004_bo_ten_benh_nhan.sql xong (67 ms)
1 migration moi
  health xanh sau 2 s
2026/09/29 09:46:42 [notice] 8577#8577: signal process started
  cua truoc (HTTPS) tra ban 07630fa
2026-09-29T09:46:45 07630fa OK mau=lam
xong 07630fa sau 12 s
$ dem.sh 25        # tren dv15-vps2, cung luc
908 request trong 25 s:
    861 200
     47 500</div>
<p>The release log says <code>OK</code>, and 47 users got a 500. The migration runs <em>before</em> the new colour starts; for the three seconds between the migration and the switch, the old colour — whose query mentions <code>ten_benh_nhan</code> — was still serving, on a table where that column no longer existed. Every one of its reads failed. None of the script's checks can see this: they test the <em>new</em> colour. Then the rollback:</p>
<div class="out">$ sudo /opt/phongkham/bin/phat-hanh.sh lui; echo "exit=$?"
lui: 07630fa -&gt; 95b548d
2026-09-29T09:47:03 95b548d bat-dau mau=xanh
  health xanh sau 2 s
curl: (22) The requested URL returned error: 500
--- mau moi tra loi o /api/lich-hen:
{"loi":"column \\"ten_benh_nhan\\" does not exist"}
2026-09-29T09:47:04 95b548d HONG thu-truoc (chua khach nao thay)
exit=4</div>
<p>The pre-switch check saved the rollback from making things worse — but there is no version left to go back to. Every older version needs the dropped column. Dropping a column is a one-way door (Chapter 6.4); the only ways back are to fix forward, or to restore the database from the backup and lose everything written since. The correct sequence, spread over three releases:</p>
<table>
<tr><th>Release</th><th>Schema</th><th>Code</th><th>Can roll back to the previous?</th></tr>
<tr><td>b — expand</td><td>add <code>ho_ten</code>, copy data</td><td>writes both, reads <code>coalesce</code></td><td>yes — old column still there</td></tr>
<tr><td>c — switch</td><td>(nothing)</td><td>reads and writes only <code>ho_ten</code></td><td>yes — b still works on this schema</td></tr>
<tr><td>d — contract, <em>days later</em></td><td>drop <code>ten_benh_nhan</code></td><td>unchanged from c</td><td>to c yes; to b or older no — decide consciously, with a fresh restored backup</td></tr>
</table>
<p>In that order, the code that is running when the column disappears (c) no longer reads it, so the 47 errors do not happen, and the one-way door is closed deliberately, not as a side effect of a feature release.</p>

<h3>Backups: checked immediately, seven kept, readable by no one else</h3>
${slide('dv-15', 18, 'Sao lưu: kiểm ngay, giữ 7 bản, không ai khác đọc được')}
<pre><code class="language-bash">#!/usr/bin/env bash
<span class="tok-comment"># sao-luu.sh — chay bang root (cron 02:15 moi dem). Ban chup nhat quan (pg_dump -Fc), KIEM ngay, giu 7 ban.</span>
set -Eeuo pipefail
trap 'echo "$(date +%FT%T) sao-luu HONG dong $LINENO: $BASH_COMMAND" &gt;&gt; /var/log/phongkham/sao-luu.log' ERR
umask 027                       <span class="tok-comment"># lan chay dau: ban sao luu 644 — ai tren may cung doc duoc CSDL (do that)</span>
D=/var/backups/phongkham; T=$(date +%Y%m%d-%H%M%S); F="$D/pk-$T.dump"
t0=$(date +%s%N)
docker exec pk-db pg_dump -U postgres -Fc postgres &gt; "$F.tmp"
<span class="tok-comment"># kiem: doc duoc muc luc + co bang lich_hen; hong thi KHONG doi ten -&gt; khong bao gio thanh "moi-nhat"</span>
docker exec -i pk-db pg_restore -l &lt; "$F.tmp" | grep -q 'TABLE DATA public lich_hen'
chgrp saoluu "$F.tmp"; mv "$F.tmp" "$F"; sha256sum "$F" | cut -d' ' -f1 &gt; "$F.sha256"
ln -sfn "$(basename "$F")" "$D/moi-nhat.dump"
ls -1t "$D"/pk-*.dump | tail -n +8 | while read -r cu; do rm -f "$cu" "$cu.sha256"; done   <span class="tok-comment"># giu 7</span>
echo "$(date +%FT%T) OK $(basename "$F") $(du -h "$F" | cut -f1) $(( ($(date +%s%N)-t0)/1000000 )) ms" &gt;&gt; /var/log/phongkham/sao-luu.log</code></pre>
<table>
<tr><th>Piece</th><th>Why (chapter)</th></tr>
<tr><td><code>pg_dump -Fc</code></td><td>A consistent snapshot in the custom format: compressed, restorable table by table (10.1).</td></tr>
<tr><td>write to <code>.tmp</code>, check, then <code>mv</code></td><td>A dump that failed half-way never gets a real name, so it can never become "latest" (10.3).</td></tr>
<tr><td><code>pg_restore -l | grep -q 'TABLE DATA …'</code></td><td>The file's table of contents is readable and contains the main table's data — a cheap check every night; the real proof is the restore below (10.4).</td></tr>
<tr><td><code>moi-nhat.dump</code> symlink</td><td>The puller on the other machine always asks for the same name.</td></tr>
<tr><td><code>ls -1t | tail -n +8</code></td><td>Everything after the 7 newest is deleted. Run nine times in a row: exactly 7 <code>pk-*.dump</code> files remained.</td></tr>
<tr><td><code>umask 027</code> + group <code>saoluu</code></td><td>Found on the first run, below.</td></tr>
</table>
<p>With 300 000 appointments (a 42 MB database), one backup is a 3.4 MB file made in 0.4–0.6 s. The first run showed a problem that no check in the script looks for:</p>
<div class="out">2026-09-29T09:38:47 OK pk-20260929-093846.dump 3.4M 433 ms
-rw-r--r-- 1 root root 3505255 Sep 29 09:38 pk-20260929-093846.dump</div>
<p><code>-rw-r--r--</code>: every user on the machine can read the whole database — including the app's future vulnerabilities, a teammate's account, anything. The default umask 022 made it that way. With <code>umask 027</code> new files are <code>640</code> and directories <code>750</code>, and the group <code>saoluu</code> ("backup") is the only one allowed in:</p>
<div class="out">$ ls -la /var/backups/phongkham/
drwxr-x--- 2 root saoluu    4096 Sep 29 09:42 .
lrwxrwxrwx 1 root root        23 Sep 29 09:42 moi-nhat.dump -&gt; pk-20260929-094238.dump
-rw-r----- 1 root saoluu 3505255 Sep 29 09:42 pk-20260929-094238.dump
-rw-r----- 1 root root        65 Sep 29 09:42 pk-20260929-094238.dump.sha256
$ sudo -u deploy cat /var/backups/phongkham/moi-nhat.dump
cat: /var/backups/phongkham/moi-nhat.dump: Permission denied</div>
<p>Scheduling is the Linux &amp; Bash course's job (Lesson 16.3: a systemd timer at 02:15 Vietnam time on a machine that runs in UTC). The lab VPS has no systemd, so here the script was run by hand and in a loop.</p>

<h3>Pull, don't push: a key that can do exactly one thing</h3>
${slide('dv-15', 19, 'Kéo chứ đừng đẩy: một khoá chỉ làm được một việc')}
<p>A backup on the same machine dies with the machine, and a backup the VPS <em>pushes</em> elsewhere means the VPS holds credentials to delete it (Chapter 10.7). So the other machine pulls. On vps2, root generates a key; on the VPS, a user <code>keo</code> ("pull"), member of <code>saoluu</code>, gets it with two options:</p>
<pre><code>restrict,command="cat /var/backups/phongkham/moi-nhat.dump" ssh-ed25519 AAAAC3Nz… keo-sao-luu@vps2</code></pre>
<p>Tested from vps2, trying to do more than allowed:</p>
<div class="out">$ ssh -T -i keo keo@phongkham.test "cat /etc/passwd" | head -c 5 | od -c | head -1
0000000   P   G   D   M   P
$ ssh -i keo -N -L 15432:pk-db:5432 keo@phongkham.test
channel 2: open failed: administratively prohibited: open failed</div>
<p>The request for <code>/etc/passwd</code> was ignored: the first five bytes are <code>PGDMP</code>, the signature of a <code>pg_dump</code> custom-format file. With <code>command="…"</code>, sshd runs that command no matter what the client asks for. The tunnel to the database was refused, because <code>restrict</code> disables port forwarding, agent and X11 forwarding, PTY allocation and <code>~/.ssh/rc</code> (sshd(8)). If vps2 is ever compromised, this key reads the latest backup — which vps2 has anyway — and nothing more.</p>
<table>
<tr><th>Option in <code>authorized_keys</code></th><th>Effect</th></tr>
<tr><td><code>command="…"</code></td><td>the only command this key can run; the client's command is available as <code>$SSH_ORIGINAL_COMMAND</code> but ignored here</td></tr>
<tr><td><code>restrict</code></td><td>turns off every forwarding and the PTY; future restrictions are included automatically</td></tr>
<tr><td><code>from="1.2.3.4"</code></td><td>(not used in the lab) accept this key only from that address — add it on a real VPS</td></tr>
</table>

<h3>A timed restore on another machine</h3>
${slide('dv-15', 20, 'Phục hồi bấm giờ: 100,8 giây — 95 giây là kéo ảnh')}
<p>Chapter 10's rule: the only proof a backup works is a restore, and the only useful number is how long it takes. <code>phuc-hoi.sh</code> on vps2 pulls the latest dump, starts an empty Postgres, restores, starts the API at the version that matches the data, and times each stage until the API returns real data:</p>
<pre><code class="language-bash">#!/usr/bin/env bash
<span class="tok-comment"># phuc-hoi.sh TAG — tren MAY KHAC (vps2): keo ban sao luu moi nhat, dung CSDL moi, chay dung ban app, tra loi duoc.</span>
set -Eeuo pipefail
TAG=\${1:?tag ban app}; KHO=dv15-reg:5000/phongkham
t0=$(date +%s%N); moc() { printf '  %-34s %6d ms\\n' "$1" $(( ($(date +%s%N)-t0)/1000000 )); }
install -d -m 700 /srv/phuc-hoi &amp;&amp; cd /srv/phuc-hoi
ssh -T -i /root/.ssh/keo -o StrictHostKeyChecking=accept-new keo@phongkham.test &gt; pk.dump
moc "① keo ban sao luu ($(du -h pk.dump | cut -f1))"
docker network create ph &gt;/dev/null 2&gt;&amp;1 || true
MK=$(openssl rand -hex 16)
docker run -d --name ph-db --network ph -e POSTGRES_PASSWORD="$MK" postgres:16-alpine &gt;/dev/null
<span class="tok-comment"># -h 127.0.0.1: luc khoi tao, anh postgres chay mot may chu TAM chi nghe unix socket roi tat no di.</span>
<span class="tok-comment"># pg_isready khong -h tra loi "san sang" cho may TAM do -&gt; pg_restore bi cat giua chung (do that lan 3).</span>
until docker exec ph-db pg_isready -q -h 127.0.0.1 2&gt;/dev/null; do sleep 0.3; done
moc "② CSDL trong san sang"
docker exec -i ph-db pg_restore -U postgres -d postgres --no-owner --exit-on-error &lt; pk.dump
moc "③ pg_restore xong"
docker run -d --name ph-api --network ph -p 127.0.0.1:3000:3000 \\
  -e DATABASE_URL="postgres://postgres:$MK@ph-db:5432/postgres" "$KHO:$TAG" &gt;/dev/null
until curl -fsS -o /dev/null localhost:3000/api/health 2&gt;/dev/null; do sleep 0.3; done
moc "④ API ban $TAG len, health xanh"
n=$(docker exec ph-db psql -U postgres -Atc 'select count(*) from lich_hen')
curl -fsS localhost:3000/api/lich-hen | jq -c '.[0] | {id, ho_ten}'
moc "⑤ tra du lieu that: $n lich hen"</code></pre>
<p><strong>Run 1, on a machine that had never pulled anything:</strong></p>
<div class="out">  ① keo ban sao luu (3.4M)            224 ms
Unable to find image 'postgres:16-alpine' locally
…
  ② CSDL trong san sang             95364 ms
  ③ pg_restore xong                 96260 ms
Unable to find image 'dv15-reg:5000/phongkham:95b548d' locally
…
  ④ API ban 95b548d len, health xanh 100673 ms
{"id":"300000","ho_ten":"Benh nhan 300000"}
  ⑤ tra du lieu that: 300000 lich hen 100790 ms</div>
<p>100.8 seconds, of which restoring 300 000 rows took <strong>0.9 s</strong> and downloading the Postgres image from Docker Hub took about 95 s. The expensive part of a restore is rarely the data; it is whatever the standby machine does not have yet. Pre-pull the images there, and keep a copy of the ones that come from public registries.</p>
<p><strong>Run 3 lied.</strong> Run 2 (images now present) took 4.8 s. Run 3:</p>
<div class="out">  ① keo ban sao luu (3.4M)            226 ms
  ② CSDL trong san sang              3299 ms
pg_restore: error: could not execute query: FATAL:  terminating connection due to administrator command
server closed the connection unexpectedly
	This probably means the server terminated abnormally
	before or while processing the request.
Command was: CREATE TABLE public.lich_hen (</div>
<p>The postgres image's documentation explains it: on first start the entrypoint runs a <em>temporary</em> server that "listens only on the Unix socket" to run initialisation, then shuts it down and starts the real one. <code>pg_isready</code> without <code>-h</code> connects over the Unix socket and happily reports the temporary server as ready; the restore started, and the temporary server was stopped under it. Run 2 was lucky. <code>pg_isready -h 127.0.0.1</code> asks over TCP, which only the real server listens on. Three more runs after the fix, all complete:</p>
<div class="out">  ① keo ban sao luu (3.4M)            202 ms
  ② CSDL trong san sang              1898 ms
  ③ pg_restore xong                  2827 ms
  ④ API ban 95b548d len, health xanh   3350 ms
{"id":"300000","ho_ten":"Benh nhan 300000"}
  ⑤ tra du lieu that: 300000 lich hen   3423 ms</div>
<p>(The other two: 4.6 s and 3.9 s.) Note also which tag was restored: <code>95b548d</code>, the version that matches the schema <em>in the dump</em>. A restore is data plus the code that understands it — record the running tag next to every backup.</p>

<h3>A watcher outside the server, which only speaks when the state changes</h3>
${slide('dv-15', 21, 'Canh từ máy ngoài, chỉ báo khi đổi trạng thái')}
<pre><code class="language-bash">#!/usr/bin/env bash
<span class="tok-comment"># canh.sh — chay tren MAY KHAC (khong phai VPS): hoi cua truoc nhu nguoi dung, chi bao khi TRANG THAI DOI.</span>
<span class="tok-comment"># Hai lan hong lien tiep moi tinh la SAP (mot goi tin rot khong dang danh thuc ai luc 3 gio sang).</span>
set -uo pipefail
URL=\${URL:-https://phongkham.test/api/health}; HOOK=\${HOOK:?dat HOOK}; F=\${F:-/var/lib/canh/trang-thai}
mkdir -p "$(dirname "$F")"; read -r cu dem 2&gt;/dev/null &lt; "$F" || { cu=LEN; dem=0; }
ma=$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 "$URL"); ngay=$(( $(date +%s) ))
het=$(echo | openssl s_client -connect phongkham.test:443 -servername phongkham.test 2&gt;/dev/null | openssl x509 -noout -enddate | cut -d= -f2)
con=$(( ($(date -d "$het" +%s) - ngay) / 86400 ))
if [ "$ma" = 200 ]; then dem=0; moi=LEN; else dem=$((dem+1)); [ "$dem" -ge 2 ] &amp;&amp; moi=SAP || moi=$cu; fi
[ "$con" -lt 3 ] &amp;&amp; [ "$moi" = LEN ] &amp;&amp; moi=CHUNG-CHI-SAP-HET
if [ "$moi" != "$cu" ]; then
  curl -s -X POST -H 'content-type: application/json' "$HOOK" \\
    -d "{\\"text\\":\\"phongkham: $cu -&gt; $moi (ma $ma, chung chi con $con ngay)\\"}" &gt;/dev/null
fi
echo "$moi $dem" &gt; "$F"; echo "$(date +%T) ma=$ma dem=$dem $cu-&gt;$moi cert=\${con}d"</code></pre>
<p>Four decisions from Chapter 9, each one line: check <strong>from outside</strong>, by name and over HTTPS, exactly as a user does (Chapter 9.5); read the certificate's expiry <strong>on the wire</strong>, not from the file; count <strong>two failures in a row</strong> before calling it down, because one lost packet at 3 a.m. should not wake anyone; and send a message only when the <strong>state changes</strong>, not on every failed check. The state (<code>LEN</code> "up", <code>SAP</code> "down", <code>CHUNG-CHI-SAP-HET</code> "certificate expiring") lives in a small file between runs. On a real machine it runs every minute from cron or a systemd timer; for the measurement it was called every 2 seconds while the API was stopped on the VPS:</p>
<div class="out">09:47:24 ma=200 dem=0 LEN-&gt;LEN cert=5d
09:47:26 ma=200 dem=0 LEN-&gt;LEN cert=5d
09:47:28 da dung pk-lam
09:47:28 ma=502 dem=1 LEN-&gt;LEN cert=5d
09:47:30 ma=502 dem=2 LEN-&gt;SAP cert=5d
09:47:33 ma=502 dem=3 SAP-&gt;SAP cert=5d
09:47:35 da bat lai pk-lam
09:47:37 ma=200 dem=0 SAP-&gt;LEN cert=5d
09:47:39 ma=200 dem=0 LEN-&gt;LEN cert=5d
$ docker logs dv15-hook
09:47:30 POST /canh {"text":"phongkham: LEN -&gt; SAP (ma 502, chung chi con 5 ngay)"}
09:47:37 POST /canh {"text":"phongkham: SAP -&gt; LEN (ma 200, chung chi con 5 ngay)"}</div>
<p>Five failed checks, two messages: "down" and "up again". A watcher that sends one message per failed check is muted within a week. (<code>cert=5d</code>: Pebble's certificates in this lab last six days.) The first run also printed an error the watcher should not print:</p>
<div class="out">/usr/local/bin/canh.sh: line 6: /var/lib/canh/trang-thai: No such file or directory</div>
<p>The state file does not exist on the first run, and the redirection was written <code>read … &lt; "$F" 2&gt;/dev/null</code>. Redirections are processed left to right: the shell tried to open <code>$F</code> before stderr had been sent to <code>/dev/null</code>. Writing <code>2&gt;/dev/null &lt; "$F"</code> fixes it — order matters.</p>

<h3>Try it step by step</h3>
<pre><code class="language-bash"><span class="tok-comment"># 1. rollback, twice, while vps2 counts</span>
dem.sh 20 &amp;   <span class="tok-comment"># on vps2</span>
sudo /opt/phongkham/bin/phat-hanh.sh lui; sudo /opt/phongkham/bin/phat-hanh.sh lui
<span class="tok-comment"># 2. backup + permissions</span>
sudo /opt/phongkham/bin/sao-luu.sh; ls -la /var/backups/phongkham/
<span class="tok-comment"># 3. on vps2: key, then give its .pub to user keo on the VPS with restrict,command="…"</span>
ssh-keygen -t ed25519 -N '' -C keo-sao-luu@vps2 -f /root/.ssh/keo
<span class="tok-comment"># 4. timed restore, twice</span>
phuc-hoi.sh &lt;tag&gt;; docker rm -f ph-db ph-api; phuc-hoi.sh &lt;tag&gt;
<span class="tok-comment"># 5. watcher: stop the API on the VPS, call canh.sh a few times, start it again</span>
HOOK=http://dv15-hook:8080/canh canh.sh</code></pre>

<h3>On Windows/WSL and macOS</h3>
<ul>
<li><strong><code>date -d</code></strong> in <code>canh.sh</code> is GNU; macOS <code>date</code> needs <code>-j -f</code> with a format. Run the watcher on a Linux machine (vps2 here; a Raspberry Pi or a small second VPS in real life), not on a laptop that sleeps.</li>
<li><strong><code>head -n -1</code></strong> in <code>lui</code> is GNU too; BSD <code>head</code> rejects negative counts. Another reason these scripts run on the VPS.</li>
<li><strong>Restoring on Windows:</strong> <code>docker exec -i … &lt; pk.dump</code> works in WSL; in PowerShell, <code>&lt;</code> redirection is not supported, and piping binary data through PowerShell 5 can corrupt it. Use WSL or <code>docker cp</code> the file in first.</li>
</ul>

<h3>When to use each of these — and when not</h3>
<ul>
<li><strong>Rollback by tag</strong>: always, as long as migrations are expand-only. Once a contract migration has run, rollback is closed until you decide to restore.</li>
<li><strong>Nightly <code>pg_dump</code></strong>: fine for a database of this size and a tolerance of "lose up to one day". When losing a day is unacceptable, you need continuous archiving (WAL) or a managed database with point-in-time recovery.</li>
<li><strong>A shell watcher</strong>: enough for one project and a team chat. For many services, use a hosted uptime monitor or Uptime Kuma — but still from outside the server.</li>
</ul>

<div class="pitfall co-tieu-de"><strong>Trap — a release log that says OK while users get 500.</strong> The contract release ended <code>07630fa OK</code> and 47 requests failed. Every check in the script tested the new colour; the damage was done to the old one, by the migration, before the switch. Your release checks cannot see what a migration does to the code that is still running — only the migration's design (expand first, contract later) can prevent it. Measure from outside while you release, at least for any release with a migration.</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Release an expand migration (add a column, copy data, code writes both). Roll back with <code>lui</code> while <code>dem.sh</code> runs; insert a row with the old version; release forward again and read the row.</li>
<li>Run <code>lui</code> twice more and check that it goes further back, not forward.</li>
<li>Take a backup, then pull and restore it on vps2 with <code>phuc-hoi.sh</code>, twice. Write down each stage's time.</li>
<li>Stop the API on the VPS and run <code>canh.sh</code> every few seconds until you have seen exactly two webhook messages.</li>
</ol>
<p><strong>Done when:</strong> the rollback shows zero failed requests; the old version's row appears with its name after going forward; two restores return the same row count and you can say which stage costs the most; the webhook received one "down" and one "up".</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">rollback</span><span class="v">Releasing the previous version again; here a release of an older tag without migrations.</span></div>
  <div class="kv"><span class="k">expand / contract</span><span class="v">Add the new structure first, remove the old one only after no running code uses it.</span></div>
  <div class="kv"><span class="k">one-way door</span><span class="v">A change that cannot be undone by releasing older code — dropping a column is one.</span></div>
  <div class="kv"><span class="k">forced command</span><span class="v"><code>command="…"</code> in <code>authorized_keys</code>: the key can run only that command.</span></div>
  <div class="kv"><span class="k">pull backup</span><span class="v">The backup machine fetches from the server, so the server holds no credentials to delete the copies.</span></div>
  <div class="kv"><span class="k">RTO (recovery time)</span><span class="v">How long from "we need the backup" until users get real data — measured, not estimated.</span></div>
  <div class="kv"><span class="k">state-change alert</span><span class="v">An alert sent only when up/down changes, not on every failed check.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Rolling back to a tag already on the VPS took 3.7 s with zero failed requests; the log must define release order, or "back" twice goes forward.</li>
<li>Expand-only migrations let old code run on the new schema; a row written by the rolled-back version was read correctly after going forward.</li>
<li>A contract in the same release as the code change cost 47 × 500 while the log said OK, and closed the rollback path.</li>
<li>Backups are checked before they get a name, kept seven deep, and readable only by one group (<code>umask 027</code>).</li>
<li>The other machine pulls with a key that can only <code>cat</code> the latest dump; restores took 100.8 s cold and 3.4–4.6 s warm — the images, not the data, are the slow part.</li>
<li>The outside watcher checks by name over HTTPS, waits for two failures, and speaks only when the state changes.</li>
</ul>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — pg_dump</span><span class="lc-sub">postgresql.org/docs/16/app-pgdump.html — the custom format and consistency.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — pg_restore</span><span class="lc-sub">postgresql.org/docs/16/app-pgrestore.html — <code>-l</code>, <code>--no-owner</code>, <code>--exit-on-error</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker Official Image — postgres</span><span class="lc-sub">github.com/docker-library/docs/blob/master/postgres/README.md — the temporary server that "listens only on the Unix socket".</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">sshd(8) — AUTHORIZED_KEYS FILE FORMAT</span><span class="lc-sub">man7.org/linux/man-pages/man8/sshd.8.html — <code>command=</code>, <code>restrict</code>, <code>from=</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google SRE Workbook — Being On-Call</span><span class="lc-sub">sre.google/workbook/on-call/ — alerts that people can act on, and alert fatigue.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — Lesson 16.3: backups, timers, monitoring</span><span class="lc-sub">/courses/linux-bash/learn${REF} — the systemd timer at 02:15 Vietnam time that schedules <code>sao-luu.sh</code>.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.3</span>
<h2>Ngày 3: lùi bản, bản sao lưu đã từng phục hồi, và một người canh ở ngoài máy</h2>
<p class="lead">Hết Ngày 2, nhóm đã ship được. Ngày 3 lo ba thứ quyết định việc đêm trước buổi bảo vệ có sống sót nổi hay không: quay về bản trước trong vài giây, có một bản dữ liệu ĐÃ TỪNG được phục hồi ở chỗ khác, và biết tin sập từ một cái máy không phải cái đang sập. Cả ba đều được tập dượt trên phòng thí nghiệm, và lần tập nào cũng tìm ra một thứ lẽ ra sẽ hỏng đúng vào đêm thật.</p>

<h3>Lùi bản: 3,7 giây</h3>
${slide('dv-15', 16, 'Lùi bản: 3,7 giây — và con bọ lùi hai lần đi tới')}
<p>Lùi bản trong dự án này không phải một cơ chế riêng: nó là một lần phát hành tag cũ hơn, bỏ qua bước migration (mã cũ phải chạy được trên lược đồ hiện tại — đó chính là điều migration chỉ-mở-rộng bảo đảm). <code>phat-hanh.sh lui</code> tự tìm tag trong sổ phát hành. Đo trong lúc <code>dem.sh</code> chạy trên vps2:</p>
<div class="out">$ time sudo /opt/phongkham/bin/phat-hanh.sh lui
lui: ef8f9c5 -&gt; 2139d95
2026-09-29T09:37:21 2139d95 bat-dau mau=xanh
  health xanh sau 2 s
2026/09/29 09:37:23 [notice] 5944#5944: signal process started
  cua truoc (HTTPS) tra ban 2139d95
2026-09-29T09:37:25 2139d95 OK mau=xanh

real	0m3.709s
$ dem.sh 20        # tren dv15-vps2, cung luc
782 request trong 20 s:
    782 200</div>
<p>3,7 giây, không request nào hỏng: ảnh của bản trước vẫn còn trên VPS, nên không phải kéo, không phải build, không phải migration. So với "revert commit, build lại, deploy lại" — vài phút, trong lúc người dùng chờ. Chương 6 đã nói đúng điều này với thư mục bản phát hành; ở đây thư mục bản phát hành là các tag ảnh.</p>
<p><strong>Con bọ: lùi hai lần thì lại đi tới.</strong> Bản đầu của <code>lui</code> chọn "lần OK gần nhất mà không phải bản đang chạy". Chạy nó lần thứ hai, để lùi thêm một bậc:</p>
<div class="out">$ sudo /opt/phongkham/bin/phat-hanh.sh lui
lui: 2139d95 -&gt; ef8f9c5</div>
<p>Theo cuốn sổ, sau khi lùi về <code>2139d95</code> thì "OK gần nhất không phải bản đang chạy" là <code>ef8f9c5</code> — đúng bản bạn vừa rời khỏi. Bấm "lùi" hai lần thành ra bật qua bật lại giữa hai bản cuối. Lúc 2 giờ sáng, với một <code>ef8f9c5</code> đang hỏng, lần bấm thứ hai sẽ đưa con bọ trở lại production. Cách sửa định nghĩa thứ tự cho đúng: thứ tự phát hành là lần OK ĐẦU TIÊN của mỗi tag; "lùi" nghĩa là tag đứng ngay trước tag đang chạy trong thứ tự đó:</p>
<pre><code class="language-bash">dang=$(awk '$3=="OK"{t=$2} END{print t}' "$SO")                    <span class="tok-comment"># tag dang chay = OK cuoi cung</span>
TAG=$(awk '$3=="OK" &amp;&amp; !thay[$2]++ {print $2}' "$SO" \\              <span class="tok-comment"># moi tag MOT lan, theo lan OK dau tien</span>
      | grep -B1 -x "$dang" | head -n -1 | tail -1)                  <span class="tok-comment"># dong dung TRUOC tag dang chay</span></code></pre>
<p><code>!thay[$2]++</code> là thành ngữ awk cho "lần đầu gặp giá trị này"; <code>grep -B1 -x</code> in dòng khớp và một dòng trước nó; <code>head -n -1</code> (bản GNU) bỏ chính dòng khớp. Ba lần bấm liên tiếp sau khi sửa:</p>
<div class="out">lui: 2139d95 -&gt; 10e26b6
2026-09-29T09:37:57 10e26b6 OK mau=lam
khong co ban nao truoc 10e26b6 de lui
khong co ban nao truoc 10e26b6 de lui</div>
<p>Và bản đang chạy cuối cùng là <code>10e26b6</code> — lần phát hành đầu tiên, mã của nó không hề biết tới <code>ho_ten</code> hay <code>so_dien_thoai</code> — trên một lược đồ có cả hai cột. Nó chạy được, vì mọi migration tới lúc đó đều chỉ THÊM. Đó là phần tiếp theo.</p>

<h3>Mở rộng, thu hẹp, và cánh cửa chỉ mở một chiều</h3>
${slide('dv-15', 17, 'Mở rộng thì lùi được, thu hẹp thì đóng cửa')}
<p>Nhóm muốn đổi tên <code>ten_benh_nhan</code> (tên bệnh nhân) thành <code>ho_ten</code>. Chương 5.2 đã dạy cách an toàn duy nhất — mở rộng, chuyển mã, rồi thu hẹp — và dự án này làm thật:</p>
<pre><code class="language-sql">-- 002_ho_ten_mo_rong.sql — MO RONG (Ch5.2): them cot moi, KHONG xoa cot cu -&gt; ban cu van chay duoc tren luoc do nay
alter table lich_hen add column ho_ten text;
update lich_hen set ho_ten = ten_benh_nhan where ho_ten is null;</code></pre>
<p>Mã của bản <code>b</code> ghi CẢ HAI cột và đọc <code>coalesce(ho_ten, ten_benh_nhan)</code>. Nhờ vậy cả hai chiều đều chạy:</p>
<ul>
<li><strong>Mã cũ trên lược đồ mới</strong> (lần lùi ở trên): nó đọc và ghi <code>ten_benh_nhan</code>, cột vẫn còn đó. Dòng nó chèn vào có <code>ho_ten</code> trống:</li>
</ul>
<div class="out">$ docker exec pk-db psql -U postgres -c "select id, ten_benh_nhan, ho_ten from lich_hen order by id desc limit 2"
 id | ten_benh_nhan |   ho_ten
----+---------------+-------------
  4 | Tran Thi Mai  |
  3 | Benh nhan 3   | Benh nhan 3
(2 rows)</div>
<ul>
<li><strong>Mã mới trở lại</strong>, sau khi phát hành tới: <code>coalesce</code> lấp chỗ trống, và dòng do bản cũ ghi vẫn hiện đúng tên.</li>
</ul>
<div class="out">$ curl -s https://phongkham.test/api/lich-hen | jq -c ".[0]"
{"id":"4","ho_ten":"Tran Thi Mai","so_dien_thoai":null,"bac_si":"BS Hung","gio_hen":"2026-10-05T02:00:00.000Z"}</div>
<p>Rồi bước thu hẹp được làm <strong>SAI có chủ đích</strong>: trong cùng lần phát hành với đoạn mã thôi dùng cột cũ. Để cho giống thật, trước đó đã chèn 300 000 lịch hẹn (42 MB dữ liệu) và lấy một bản sao lưu:</p>
<pre><code class="language-sql">-- 004_bo_ten_benh_nhan.sql — THU HEP, lam SAI THU TU co chu dich
update lich_hen set ho_ten = ten_benh_nhan where ho_ten is null;
alter table lich_hen alter column ho_ten set not null;
alter table lich_hen drop column ten_benh_nhan;</code></pre>
<div class="out">migration 004_bo_ten_benh_nhan.sql xong (67 ms)
1 migration moi
  health xanh sau 2 s
2026/09/29 09:46:42 [notice] 8577#8577: signal process started
  cua truoc (HTTPS) tra ban 07630fa
2026-09-29T09:46:45 07630fa OK mau=lam
xong 07630fa sau 12 s
$ dem.sh 25        # tren dv15-vps2, cung luc
908 request trong 25 s:
    861 200
     47 500</div>
<p>Sổ phát hành ghi <code>OK</code>, và 47 người dùng nhận 500. Migration chạy TRƯỚC khi màu mới khởi động; trong ba giây giữa migration và lúc tráo, màu cũ — có câu truy vấn nhắc tới <code>ten_benh_nhan</code> — vẫn đang phục vụ, trên một cái bảng mà cột đó đã không còn. Mọi lần đọc của nó đều hỏng. Không phép kiểm nào của script thấy được chuyện này: chúng kiểm màu MỚI. Rồi tới lần lùi:</p>
<div class="out">$ sudo /opt/phongkham/bin/phat-hanh.sh lui; echo "exit=$?"
lui: 07630fa -&gt; 95b548d
2026-09-29T09:47:03 95b548d bat-dau mau=xanh
  health xanh sau 2 s
curl: (22) The requested URL returned error: 500
--- mau moi tra loi o /api/lich-hen:
{"loi":"column \\"ten_benh_nhan\\" does not exist"}
2026-09-29T09:47:04 95b548d HONG thu-truoc (chua khach nao thay)
exit=4</div>
<p>Phép thử-trước-khi-tráo đã cứu lần lùi khỏi làm mọi thứ tệ hơn — nhưng không còn bản nào để lùi về. Mọi bản cũ hơn đều cần cột đã bị xoá. Xoá cột là một cánh cửa một chiều (Chương 6.4); đường về chỉ còn là sửa tới, hoặc phục hồi CSDL từ bản sao lưu và mất mọi thứ ghi từ lúc đó. Thứ tự đúng, trải qua ba lần phát hành:</p>
<table>
<tr><th>Lần phát hành</th><th>Lược đồ</th><th>Mã</th><th>Lùi về bản trước được không?</th></tr>
<tr><td>b — mở rộng</td><td>thêm <code>ho_ten</code>, chép dữ liệu</td><td>ghi cả hai, đọc <code>coalesce</code></td><td>được — cột cũ vẫn còn</td></tr>
<tr><td>c — chuyển</td><td>(không đổi)</td><td>chỉ đọc và ghi <code>ho_ten</code></td><td>được — b vẫn chạy trên lược đồ này</td></tr>
<tr><td>d — thu hẹp, <em>vài ngày sau</em></td><td>xoá <code>ten_benh_nhan</code></td><td>giữ nguyên như c</td><td>về c thì được; về b hay cũ hơn thì không — quyết định có ý thức, với một bản sao lưu vừa phục hồi thử</td></tr>
</table>
<p>Theo thứ tự đó, đoạn mã đang chạy lúc cột biến mất (c) đã thôi đọc nó, nên 47 lỗi kia không xảy ra, và cánh cửa một chiều được đóng có chủ ý, chứ không phải như tác dụng phụ của một lần phát hành tính năng.</p>

<h3>Sao lưu: kiểm ngay, giữ bảy bản, không ai khác đọc được</h3>
${slide('dv-15', 18, 'Sao lưu: kiểm ngay, giữ 7 bản, không ai khác đọc được')}
<pre><code class="language-bash">#!/usr/bin/env bash
<span class="tok-comment"># sao-luu.sh — chay bang root (cron 02:15 moi dem). Ban chup nhat quan (pg_dump -Fc), KIEM ngay, giu 7 ban.</span>
set -Eeuo pipefail
trap 'echo "$(date +%FT%T) sao-luu HONG dong $LINENO: $BASH_COMMAND" &gt;&gt; /var/log/phongkham/sao-luu.log' ERR
umask 027                       <span class="tok-comment"># lan chay dau: ban sao luu 644 — ai tren may cung doc duoc CSDL (do that)</span>
D=/var/backups/phongkham; T=$(date +%Y%m%d-%H%M%S); F="$D/pk-$T.dump"
t0=$(date +%s%N)
docker exec pk-db pg_dump -U postgres -Fc postgres &gt; "$F.tmp"
<span class="tok-comment"># kiem: doc duoc muc luc + co bang lich_hen; hong thi KHONG doi ten -&gt; khong bao gio thanh "moi-nhat"</span>
docker exec -i pk-db pg_restore -l &lt; "$F.tmp" | grep -q 'TABLE DATA public lich_hen'
chgrp saoluu "$F.tmp"; mv "$F.tmp" "$F"; sha256sum "$F" | cut -d' ' -f1 &gt; "$F.sha256"
ln -sfn "$(basename "$F")" "$D/moi-nhat.dump"
ls -1t "$D"/pk-*.dump | tail -n +8 | while read -r cu; do rm -f "$cu" "$cu.sha256"; done   <span class="tok-comment"># giu 7</span>
echo "$(date +%FT%T) OK $(basename "$F") $(du -h "$F" | cut -f1) $(( ($(date +%s%N)-t0)/1000000 )) ms" &gt;&gt; /var/log/phongkham/sao-luu.log</code></pre>
<table>
<tr><th>Mẩu</th><th>Vì sao (chương)</th></tr>
<tr><td><code>pg_dump -Fc</code></td><td>Bản chụp nhất quán ở định dạng custom: nén, phục hồi được từng bảng (10.1).</td></tr>
<tr><td>ghi vào <code>.tmp</code>, kiểm, rồi mới <code>mv</code></td><td>Bản dump hỏng giữa chừng không bao giờ có tên thật, nên không bao giờ thành "mới nhất" (10.3).</td></tr>
<tr><td><code>pg_restore -l | grep -q 'TABLE DATA …'</code></td><td>Đọc được mục lục của tệp và có dữ liệu của bảng chính — phép kiểm rẻ mỗi đêm; bằng chứng thật là cú phục hồi ở dưới (10.4).</td></tr>
<tr><td>symlink <code>moi-nhat.dump</code></td><td>Máy kéo ở bên kia luôn xin cùng một tên.</td></tr>
<tr><td><code>ls -1t | tail -n +8</code></td><td>Mọi thứ sau 7 bản mới nhất bị xoá. Chạy chín lần liên tiếp: còn đúng 7 tệp <code>pk-*.dump</code>.</td></tr>
<tr><td><code>umask 027</code> + nhóm <code>saoluu</code></td><td>Tìm ra ở lần chạy đầu, ngay dưới.</td></tr>
</table>
<p>Với 300 000 lịch hẹn (CSDL 42 MB), một bản sao lưu là tệp 3,4 MB, làm trong 0,4–0,6 s. Lần chạy đầu cho thấy một vấn đề mà không phép kiểm nào trong script tìm:</p>
<div class="out">2026-09-29T09:38:47 OK pk-20260929-093846.dump 3.4M 433 ms
-rw-r--r-- 1 root root 3505255 Sep 29 09:38 pk-20260929-093846.dump</div>
<p><code>-rw-r--r--</code>: mọi người dùng trên máy đều đọc được toàn bộ CSDL — kể cả kẻ đi qua lỗ hổng tương lai của app, tài khoản của một bạn cùng nhóm, bất kỳ ai. umask mặc định 022 làm nó thành vậy. Với <code>umask 027</code> tệp mới là <code>640</code>, thư mục là <code>750</code>, và nhóm <code>saoluu</code> là nhóm duy nhất được vào:</p>
<div class="out">$ ls -la /var/backups/phongkham/
drwxr-x--- 2 root saoluu    4096 Sep 29 09:42 .
lrwxrwxrwx 1 root root        23 Sep 29 09:42 moi-nhat.dump -&gt; pk-20260929-094238.dump
-rw-r----- 1 root saoluu 3505255 Sep 29 09:42 pk-20260929-094238.dump
-rw-r----- 1 root root        65 Sep 29 09:42 pk-20260929-094238.dump.sha256
$ sudo -u deploy cat /var/backups/phongkham/moi-nhat.dump
cat: /var/backups/phongkham/moi-nhat.dump: Permission denied</div>
<p>Hẹn giờ là việc của khoá Linux &amp; Bash (Bài 16.3: timer systemd lúc 02:15 giờ Việt Nam trên một máy chạy giờ UTC). VPS thí nghiệm không có systemd, nên ở đây script được chạy tay và chạy trong vòng lặp.</p>

<h3>Kéo chứ đừng đẩy: một khoá chỉ làm được đúng một việc</h3>
${slide('dv-15', 19, 'Kéo chứ đừng đẩy: một khoá chỉ làm được một việc')}
<p>Bản sao lưu nằm cùng máy thì chết cùng máy, còn bản sao lưu do VPS ĐẨY đi nơi khác nghĩa là VPS giữ quyền xoá nó (Chương 10.7). Nên máy kia tự kéo về. Trên vps2, root tạo một khoá; trên VPS, người dùng <code>keo</code> (kéo), thành viên nhóm <code>saoluu</code>, nhận khoá đó kèm hai tuỳ chọn:</p>
<pre><code>restrict,command="cat /var/backups/phongkham/moi-nhat.dump" ssh-ed25519 AAAAC3Nz… keo-sao-luu@vps2</code></pre>
<p>Thử từ vps2, cố làm nhiều hơn mức được phép:</p>
<div class="out">$ ssh -T -i keo keo@phongkham.test "cat /etc/passwd" | head -c 5 | od -c | head -1
0000000   P   G   D   M   P
$ ssh -i keo -N -L 15432:pk-db:5432 keo@phongkham.test
channel 2: open failed: administratively prohibited: open failed</div>
<p>Lệnh xin <code>/etc/passwd</code> bị bỏ qua: năm byte đầu là <code>PGDMP</code>, chữ ký của một tệp <code>pg_dump</code> định dạng custom. Với <code>command="…"</code>, sshd chạy đúng lệnh đó bất kể client xin gì. Đường hầm vào CSDL bị từ chối, vì <code>restrict</code> tắt chuyển tiếp cổng, chuyển tiếp agent và X11, cấp PTY và <code>~/.ssh/rc</code> (sshd(8)). Nếu vps2 có ngày bị chiếm, khoá này đọc được bản sao lưu mới nhất — thứ vps2 vốn đã có — và không gì hơn.</p>
<table>
<tr><th>Tuỳ chọn trong <code>authorized_keys</code></th><th>Tác dụng</th></tr>
<tr><td><code>command="…"</code></td><td>lệnh duy nhất khoá này chạy được; lệnh client xin nằm trong <code>$SSH_ORIGINAL_COMMAND</code> nhưng ở đây bị bỏ qua</td></tr>
<tr><td><code>restrict</code></td><td>tắt mọi kiểu chuyển tiếp và PTY; các giới hạn thêm vào sau này cũng tự bao gồm</td></tr>
<tr><td><code>from="1.2.3.4"</code></td><td>(lab không dùng) chỉ nhận khoá này từ địa chỉ đó — trên VPS thật nên thêm</td></tr>
</table>

<h3>Phục hồi có bấm giờ trên một máy khác</h3>
${slide('dv-15', 20, 'Phục hồi bấm giờ: 100,8 giây — 95 giây là kéo ảnh')}
<p>Luật của Chương 10: bằng chứng duy nhất cho thấy bản sao lưu dùng được là một cú phục hồi, và con số duy nhất có ích là nó mất bao lâu. <code>phuc-hoi.sh</code> trên vps2 kéo bản dump mới nhất, dựng một Postgres trống, phục hồi, khởi động API đúng phiên bản khớp với dữ liệu, và bấm giờ từng chặng cho tới khi API trả dữ liệu thật:</p>
<pre><code class="language-bash">#!/usr/bin/env bash
<span class="tok-comment"># phuc-hoi.sh TAG — tren MAY KHAC (vps2): keo ban sao luu moi nhat, dung CSDL moi, chay dung ban app, tra loi duoc.</span>
set -Eeuo pipefail
TAG=\${1:?tag ban app}; KHO=dv15-reg:5000/phongkham
t0=$(date +%s%N); moc() { printf '  %-34s %6d ms\\n' "$1" $(( ($(date +%s%N)-t0)/1000000 )); }
install -d -m 700 /srv/phuc-hoi &amp;&amp; cd /srv/phuc-hoi
ssh -T -i /root/.ssh/keo -o StrictHostKeyChecking=accept-new keo@phongkham.test &gt; pk.dump
moc "① keo ban sao luu ($(du -h pk.dump | cut -f1))"
docker network create ph &gt;/dev/null 2&gt;&amp;1 || true
MK=$(openssl rand -hex 16)
docker run -d --name ph-db --network ph -e POSTGRES_PASSWORD="$MK" postgres:16-alpine &gt;/dev/null
<span class="tok-comment"># -h 127.0.0.1: luc khoi tao, anh postgres chay mot may chu TAM chi nghe unix socket roi tat no di.</span>
<span class="tok-comment"># pg_isready khong -h tra loi "san sang" cho may TAM do -&gt; pg_restore bi cat giua chung (do that lan 3).</span>
until docker exec ph-db pg_isready -q -h 127.0.0.1 2&gt;/dev/null; do sleep 0.3; done
moc "② CSDL trong san sang"
docker exec -i ph-db pg_restore -U postgres -d postgres --no-owner --exit-on-error &lt; pk.dump
moc "③ pg_restore xong"
docker run -d --name ph-api --network ph -p 127.0.0.1:3000:3000 \\
  -e DATABASE_URL="postgres://postgres:$MK@ph-db:5432/postgres" "$KHO:$TAG" &gt;/dev/null
until curl -fsS -o /dev/null localhost:3000/api/health 2&gt;/dev/null; do sleep 0.3; done
moc "④ API ban $TAG len, health xanh"
n=$(docker exec ph-db psql -U postgres -Atc 'select count(*) from lich_hen')
curl -fsS localhost:3000/api/lich-hen | jq -c '.[0] | {id, ho_ten}'
moc "⑤ tra du lieu that: $n lich hen"</code></pre>
<p><strong>Lần 1, trên một máy chưa từng kéo thứ gì:</strong></p>
<div class="out">  ① keo ban sao luu (3.4M)            224 ms
Unable to find image 'postgres:16-alpine' locally
…
  ② CSDL trong san sang             95364 ms
  ③ pg_restore xong                 96260 ms
Unable to find image 'dv15-reg:5000/phongkham:95b548d' locally
…
  ④ API ban 95b548d len, health xanh 100673 ms
{"id":"300000","ho_ten":"Benh nhan 300000"}
  ⑤ tra du lieu that: 300000 lich hen 100790 ms</div>
<p>100,8 giây, trong đó phục hồi 300 000 dòng chỉ mất <strong>0,9 s</strong>, còn tải ảnh Postgres từ Docker Hub mất khoảng 95 s. Phần đắt của một cú phục hồi hiếm khi là dữ liệu; nó là bất cứ thứ gì máy dự phòng CHƯA có sẵn. Kéo sẵn ảnh về máy đó, và giữ một bản của những ảnh đến từ registry công cộng.</p>
<p><strong>Lần 3 nói dối.</strong> Lần 2 (ảnh đã có) mất 4,8 s. Lần 3:</p>
<div class="out">  ① keo ban sao luu (3.4M)            226 ms
  ② CSDL trong san sang              3299 ms
pg_restore: error: could not execute query: FATAL:  terminating connection due to administrator command
server closed the connection unexpectedly
	This probably means the server terminated abnormally
	before or while processing the request.
Command was: CREATE TABLE public.lich_hen (</div>
<p>Tài liệu của ảnh postgres giải thích: lần khởi động đầu, entrypoint chạy một máy chủ TẠM "chỉ nghe trên Unix socket" để khởi tạo, rồi tắt nó và khởi động máy chủ thật. <code>pg_isready</code> không có <code>-h</code> nối qua Unix socket và vui vẻ báo máy chủ tạm là "sẵn sàng"; lệnh phục hồi bắt đầu, và máy chủ tạm bị tắt ngay dưới chân nó. Lần 2 chỉ là may. <code>pg_isready -h 127.0.0.1</code> hỏi qua TCP, cổng mà chỉ máy chủ thật mới nghe. Ba lần nữa sau khi sửa, lần nào cũng trọn vẹn:</p>
<div class="out">  ① keo ban sao luu (3.4M)            202 ms
  ② CSDL trong san sang              1898 ms
  ③ pg_restore xong                  2827 ms
  ④ API ban 95b548d len, health xanh   3350 ms
{"id":"300000","ho_ten":"Benh nhan 300000"}
  ⑤ tra du lieu that: 300000 lich hen   3423 ms</div>
<p>(Hai lần còn lại: 4,6 s và 3,9 s.) Để ý cả tag được phục hồi: <code>95b548d</code>, bản khớp với lược đồ NẰM TRONG bản dump. Một cú phục hồi là dữ liệu cộng với đoạn mã hiểu được dữ liệu đó — ghi lại tag đang chạy cạnh mọi bản sao lưu.</p>

<h3>Một người canh ngoài máy chủ, chỉ lên tiếng khi trạng thái đổi</h3>
${slide('dv-15', 21, 'Canh từ máy ngoài, chỉ báo khi đổi trạng thái')}
<pre><code class="language-bash">#!/usr/bin/env bash
<span class="tok-comment"># canh.sh — chay tren MAY KHAC (khong phai VPS): hoi cua truoc nhu nguoi dung, chi bao khi TRANG THAI DOI.</span>
<span class="tok-comment"># Hai lan hong lien tiep moi tinh la SAP (mot goi tin rot khong dang danh thuc ai luc 3 gio sang).</span>
set -uo pipefail
URL=\${URL:-https://phongkham.test/api/health}; HOOK=\${HOOK:?dat HOOK}; F=\${F:-/var/lib/canh/trang-thai}
mkdir -p "$(dirname "$F")"; read -r cu dem 2&gt;/dev/null &lt; "$F" || { cu=LEN; dem=0; }
ma=$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 "$URL"); ngay=$(( $(date +%s) ))
het=$(echo | openssl s_client -connect phongkham.test:443 -servername phongkham.test 2&gt;/dev/null | openssl x509 -noout -enddate | cut -d= -f2)
con=$(( ($(date -d "$het" +%s) - ngay) / 86400 ))
if [ "$ma" = 200 ]; then dem=0; moi=LEN; else dem=$((dem+1)); [ "$dem" -ge 2 ] &amp;&amp; moi=SAP || moi=$cu; fi
[ "$con" -lt 3 ] &amp;&amp; [ "$moi" = LEN ] &amp;&amp; moi=CHUNG-CHI-SAP-HET
if [ "$moi" != "$cu" ]; then
  curl -s -X POST -H 'content-type: application/json' "$HOOK" \\
    -d "{\\"text\\":\\"phongkham: $cu -&gt; $moi (ma $ma, chung chi con $con ngay)\\"}" &gt;/dev/null
fi
echo "$moi $dem" &gt; "$F"; echo "$(date +%T) ma=$ma dem=$dem $cu-&gt;$moi cert=\${con}d"</code></pre>
<p>Bốn quyết định của Chương 9, mỗi cái một dòng: kiểm <strong>từ bên ngoài</strong>, bằng tên và qua HTTPS, đúng như người dùng (Chương 9.5); đọc hạn chứng chỉ <strong>trên dây</strong>, không đọc từ tệp; đếm <strong>hai lần hỏng liên tiếp</strong> mới tính là sập, vì một gói tin rơi lúc 3 giờ sáng không đáng đánh thức ai; và chỉ gửi tin khi <strong>trạng thái đổi</strong>, không gửi mỗi lần kiểm hỏng. Trạng thái (<code>LEN</code> "lên", <code>SAP</code> "sập", <code>CHUNG-CHI-SAP-HET</code> "chứng chỉ sắp hết") nằm trong một tệp nhỏ giữa các lần chạy. Trên máy thật nó chạy mỗi phút bằng cron hoặc timer systemd; để đo, nó được gọi mỗi 2 giây trong lúc API trên VPS bị dừng:</p>
<div class="out">09:47:24 ma=200 dem=0 LEN-&gt;LEN cert=5d
09:47:26 ma=200 dem=0 LEN-&gt;LEN cert=5d
09:47:28 da dung pk-lam
09:47:28 ma=502 dem=1 LEN-&gt;LEN cert=5d
09:47:30 ma=502 dem=2 LEN-&gt;SAP cert=5d
09:47:33 ma=502 dem=3 SAP-&gt;SAP cert=5d
09:47:35 da bat lai pk-lam
09:47:37 ma=200 dem=0 SAP-&gt;LEN cert=5d
09:47:39 ma=200 dem=0 LEN-&gt;LEN cert=5d
$ docker logs dv15-hook
09:47:30 POST /canh {"text":"phongkham: LEN -&gt; SAP (ma 502, chung chi con 5 ngay)"}
09:47:37 POST /canh {"text":"phongkham: SAP -&gt; LEN (ma 200, chung chi con 5 ngay)"}</div>
<p>Năm lần kiểm hỏng, hai tin nhắn: "sập" và "lên lại". Một người canh gửi một tin cho mỗi lần kiểm hỏng thì chỉ một tuần là bị tắt tiếng. (<code>cert=5d</code>: chứng chỉ Pebble trong lab này sống sáu ngày.) Lần chạy đầu còn in ra một lỗi mà người canh không nên in:</p>
<div class="out">/usr/local/bin/canh.sh: line 6: /var/lib/canh/trang-thai: No such file or directory</div>
<p>Lần đầu thì tệp trạng thái chưa có, mà chuyển hướng lại viết <code>read … &lt; "$F" 2&gt;/dev/null</code>. Chuyển hướng được xử lý từ trái sang phải: shell cố mở <code>$F</code> trước khi stderr kịp được đưa vào <code>/dev/null</code>. Viết <code>2&gt;/dev/null &lt; "$F"</code> là xong — thứ tự quan trọng.</p>

<h3>Chạy thử từng bước</h3>
<pre><code class="language-bash"><span class="tok-comment"># 1. lùi bản, hai lần, trong lúc vps2 đếm</span>
dem.sh 20 &amp;   <span class="tok-comment"># trên vps2</span>
sudo /opt/phongkham/bin/phat-hanh.sh lui; sudo /opt/phongkham/bin/phat-hanh.sh lui
<span class="tok-comment"># 2. sao lưu + quyền</span>
sudo /opt/phongkham/bin/sao-luu.sh; ls -la /var/backups/phongkham/
<span class="tok-comment"># 3. trên vps2: tạo khoá, rồi đưa .pub cho người dùng keo trên VPS kèm restrict,command="…"</span>
ssh-keygen -t ed25519 -N '' -C keo-sao-luu@vps2 -f /root/.ssh/keo
<span class="tok-comment"># 4. phục hồi bấm giờ, hai lần</span>
phuc-hoi.sh &lt;tag&gt;; docker rm -f ph-db ph-api; phuc-hoi.sh &lt;tag&gt;
<span class="tok-comment"># 5. người canh: dừng API trên VPS, gọi canh.sh vài lần, bật lại</span>
HOOK=http://dv15-hook:8080/canh canh.sh</code></pre>

<h3>Trên Windows/WSL và macOS khác gì</h3>
<ul>
<li><strong><code>date -d</code></strong> trong <code>canh.sh</code> là của GNU; <code>date</code> của macOS cần <code>-j -f</code> kèm định dạng. Chạy người canh trên một máy Linux (ở đây là vps2; ngoài đời là một Raspberry Pi hay một VPS nhỏ thứ hai), đừng chạy trên laptop hay ngủ.</li>
<li><strong><code>head -n -1</code></strong> trong <code>lui</code> cũng là GNU; <code>head</code> của BSD từ chối số âm. Thêm một lý do để các script này chạy trên VPS.</li>
<li><strong>Phục hồi trên Windows:</strong> <code>docker exec -i … &lt; pk.dump</code> chạy được trong WSL; PowerShell không hỗ trợ chuyển hướng <code>&lt;</code>, và đưa dữ liệu nhị phân qua ống của PowerShell 5 có thể làm hỏng nó. Dùng WSL, hoặc <code>docker cp</code> tệp vào trước.</li>
</ul>

<h3>Khi nào dùng từng thứ — và khi nào không</h3>
<ul>
<li><strong>Lùi theo tag</strong>: luôn luôn, chừng nào migration còn là chỉ-mở-rộng. Khi một migration thu hẹp đã chạy, đường lùi đóng lại cho tới khi bạn quyết định phục hồi.</li>
<li><strong><code>pg_dump</code> mỗi đêm</strong>: ổn với CSDL cỡ này và mức chịu đựng "mất tối đa một ngày". Khi mất một ngày là không chấp nhận được, bạn cần lưu trữ liên tục (WAL) hoặc CSDL dịch vụ có phục hồi về thời điểm bất kỳ.</li>
<li><strong>Người canh bằng shell</strong>: đủ cho một dự án và một nhóm chat. Nhiều dịch vụ thì dùng dịch vụ canh uptime có sẵn hoặc Uptime Kuma — nhưng vẫn phải đứng ngoài máy chủ.</li>
</ul>

<div class="pitfall co-tieu-de"><strong>Bẫy — sổ phát hành ghi OK trong lúc người dùng nhận 500.</strong> Lần phát hành thu hẹp kết thúc bằng <code>07630fa OK</code> và 47 request hỏng. Mọi phép kiểm trong script đều kiểm màu mới; thiệt hại lại rơi vào màu cũ, do migration gây ra, trước lúc tráo. Phép kiểm phát hành không thể thấy migration làm gì với đoạn mã VẪN đang chạy — chỉ cách thiết kế migration (mở rộng trước, thu hẹp sau) mới ngăn được. Hãy đo từ bên ngoài trong lúc phát hành, ít nhất với mọi lần phát hành có migration.</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Phát hành một migration mở rộng (thêm cột, chép dữ liệu, mã ghi cả hai). Lùi bằng <code>lui</code> trong lúc <code>dem.sh</code> chạy; chèn một dòng bằng bản cũ; phát hành tới lại rồi đọc dòng đó.</li>
<li>Chạy <code>lui</code> thêm hai lần và kiểm rằng nó lùi xa hơn chứ không đi tới.</li>
<li>Lấy một bản sao lưu, rồi kéo và phục hồi nó trên vps2 bằng <code>phuc-hoi.sh</code>, hai lần. Ghi thời gian từng chặng.</li>
<li>Dừng API trên VPS và chạy <code>canh.sh</code> vài giây một lần cho tới khi thấy đúng hai tin webhook.</li>
</ol>
<p><strong>Đạt khi:</strong> lần lùi cho 0 request hỏng; dòng do bản cũ ghi hiện đúng tên sau khi đi tới; hai lần phục hồi trả cùng số dòng và bạn nói được chặng nào tốn nhất; webhook nhận một tin "sập" và một tin "lên".</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">rollback (lùi bản)</span><span class="v">Phát hành lại bản trước; ở đây là phát hành một tag cũ hơn, không chạy migration.</span></div>
  <div class="kv"><span class="k">expand / contract (mở rộng / thu hẹp)</span><span class="v">Thêm cấu trúc mới trước, chỉ gỡ cấu trúc cũ khi không còn đoạn mã đang chạy nào dùng nó.</span></div>
  <div class="kv"><span class="k">one-way door (cửa một chiều)</span><span class="v">Thay đổi không thể gỡ bằng cách phát hành mã cũ — xoá cột là một ví dụ.</span></div>
  <div class="kv"><span class="k">forced command (lệnh ép buộc)</span><span class="v"><code>command="…"</code> trong <code>authorized_keys</code>: khoá chỉ chạy được đúng lệnh đó.</span></div>
  <div class="kv"><span class="k">pull backup (sao lưu kiểu kéo)</span><span class="v">Máy sao lưu tự lấy từ máy chủ, nên máy chủ không giữ quyền nào để xoá các bản sao.</span></div>
  <div class="kv"><span class="k">RTO (thời gian phục hồi)</span><span class="v">Từ lúc "cần tới bản sao lưu" tới lúc người dùng nhận dữ liệu thật — đo được, không ước lượng.</span></div>
  <div class="kv"><span class="k">state-change alert (báo khi đổi trạng thái)</span><span class="v">Cảnh báo chỉ gửi khi lên/sập đổi, không gửi mỗi lần kiểm hỏng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Lùi về một tag đã có sẵn trên VPS mất 3,7 s với 0 request hỏng; sổ phát hành phải định nghĩa được thứ tự, không thì "lùi" hai lần lại đi tới.</li>
<li>Migration chỉ-mở-rộng cho mã cũ chạy trên lược đồ mới; một dòng do bản đã lùi ghi vẫn được đọc đúng sau khi đi tới.</li>
<li>Thu hẹp trong cùng lần phát hành với đổi mã tốn 47 × 500 trong khi sổ ghi OK, và đóng luôn đường lùi.</li>
<li>Bản sao lưu được kiểm trước khi có tên, giữ bảy bản, và chỉ một nhóm đọc được (<code>umask 027</code>).</li>
<li>Máy kia kéo về bằng một khoá chỉ <code>cat</code> được bản dump mới nhất; phục hồi mất 100,8 s khi máy trống và 3,4–4,6 s khi ảnh có sẵn — ảnh, chứ không phải dữ liệu, mới là phần chậm.</li>
<li>Người canh ngoài máy kiểm bằng tên qua HTTPS, chờ hai lần hỏng, và chỉ lên tiếng khi trạng thái đổi.</li>
</ul>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — pg_dump</span><span class="lc-sub">postgresql.org/docs/16/app-pgdump.html — định dạng custom và tính nhất quán.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — pg_restore</span><span class="lc-sub">postgresql.org/docs/16/app-pgrestore.html — <code>-l</code>, <code>--no-owner</code>, <code>--exit-on-error</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Ảnh chính thức Docker — postgres</span><span class="lc-sub">github.com/docker-library/docs/blob/master/postgres/README.md — máy chủ tạm "chỉ nghe trên Unix socket".</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">sshd(8) — định dạng tệp AUTHORIZED_KEYS</span><span class="lc-sub">man7.org/linux/man-pages/man8/sshd.8.html — <code>command=</code>, <code>restrict</code>, <code>from=</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google SRE Workbook — Being On-Call</span><span class="lc-sub">sre.google/workbook/on-call/ — cảnh báo người nhận làm được gì đó, và chứng mệt cảnh báo.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — Bài 16.3: sao lưu, timer, giám sát</span><span class="lc-sub">/courses/linux-bash/learn${REF} — timer systemd lúc 02:15 giờ Việt Nam để hẹn giờ <code>sao-luu.sh</code>.</span></span></div>
</div>
`,
    },
    /* ─────────────────────────── 15.4 ─────────────────────────── */
    {
      title: "15.4 — Launch and the first week: a one-page runbook and eight classic incidents, rebuilt|||15.4 — Ra mắt và tuần đầu: runbook một trang và tám sự cố kinh điển, dựng lại thật",
      slug: "deploy-15-4-ra-mat-tuan-dau",
      type: "LESSON",
      isFreePreview: true,
      description: "Runbook trước–trong–sau một lần deploy, rồi tám sự cố dựng lại thật trên VPS thí nghiệm: ảnh sai libc, đĩa đầy vì dựng trên máy chủ và log không xoay, cổng DB lộ, chứng chỉ hết hạn, deploy cũ vì --no-build, bind-mount theo inode, hai deploy chạy chồng, migration kẹt khoá — mỗi cái triệu chứng → chẩn đoán → cứu → phòng → chương.",
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.4</span>
<h2>Launch and the first week: a one-page runbook and eight classic incidents, rebuilt</h2>
<p class="lead">The site is live, the lecturer has the link, and the next seven days are when things break — not because the team is careless, but because a live server meets situations a lab never staged. This lesson gives you a one-page runbook for every deploy, then stages eight incidents on purpose, on the same lab: each one is a failure this course's real project, or projects like it, actually had. For each: the symptom you see, the first command that tells you what it is, how to recover tonight, how to prevent it, and the chapter that explains it.</p>

<h3>A one-page runbook</h3>
${slide('dv-15', 22, 'Runbook một trang: trước, trong, sau')}
<p>A runbook is not documentation of the system; it is the list you follow when you are tired. Keep it as <code>RUNBOOK.md</code> in the repository, one page, and use it on every deploy until it is boring.</p>
<table>
<tr><th>When</th><th>Check</th><th>Why (chapter)</th></tr>
<tr><td rowspan="5"><strong>Before</strong> (5 min)</td><td>working tree clean, on the right branch, CI green</td><td>only committed code ships (15.2, 1.2)</td></tr>
<tr><td><code>df -h /</code> above 20% free on the VPS</td><td>a full disk kills the database first (8.4, incident 2)</td></tr>
<tr><td>last backup under 24 h old, and <code>pg_restore -l</code> reads it</td><td>you may need it in ten minutes (10.4)</td></tr>
<tr><td>migrations in this release are expand-only — or you have decided otherwise, on purpose</td><td>contract closes the rollback door (15.3, 5.2)</td></tr>
<tr><td>you know the tag to roll back to; the team knows you are deploying; it is not 22:00 the night before the defence</td><td>rollback is only fast when prepared (6.1)</td></tr>
<tr><td><strong>During</strong></td><td>one command, <code>ops/deploy.sh</code>; read each stage ① → ④; never <code>| head</code>; never two people at once</td><td>the lock and SIGPIPE (15.2)</td></tr>
<tr><td><strong>If it fails</strong></td><td>stop and read the stage and the message; do not rerun blindly — the script already kept the old version serving</td><td>a failure is information (11.1)</td></tr>
<tr><td rowspan="3"><strong>After</strong> (10 min)</td><td>from another machine: <code>/api/version</code> is the new tag; a real read returns 200</td><td>check from where users stand (9.5)</td></tr>
<tr><td><code>docker ps</code>: no <code>Restarting</code>; five minutes of logs without a repeating error</td><td>crash loops hide behind "Up 3 seconds" (11.2)</td></tr>
<tr><td>the outside watcher is green; write one line in the team chat: tag, time, "OK"</td><td>the next person knows what is running</td></tr>
<tr><td><strong>Roll back when</strong></td><td>users see an error you cannot fix within 15 minutes: <code>phat-hanh.sh lui</code> (3.7 s). If a contract migration ran, rollback is blocked: fix forward, or restore (3.4 s + the data since the backup)</td><td>15.3</td></tr>
</table>

<h3>How to read an incident</h3>
${slide('dv-15', 23, 'Tám sự cố kinh điển, dựng lại thật — một bảng')}
<p>Every incident below follows the same five steps, the shape Chapter 11 taught for reading the signature of a failure:</p>
<ol>
<li><strong>Symptom</strong> — what a user or the watcher sees, word for word.</li>
<li><strong>First diagnostic command</strong> — the one that separates this incident from the others that look alike.</li>
<li><strong>Recover</strong> — what makes the site work again tonight.</li>
<li><strong>Prevent</strong> — what makes it not happen again: a check in a script, a setting, a habit.</li>
<li><strong>Chapter</strong> — where the mechanism is explained.</li>
</ol>
<table>
<tr><th>#</th><th>Symptom</th><th>First command</th><th>Chapter</th></tr>
<tr><td>1</td><td>API 502, container <code>Restarting (1)</code></td><td><code>docker logs --tail 20</code>; <code>ls /lib/ld-*</code> in the image</td><td>13.2 · 11</td></tr>
<tr><td>2</td><td><code>no space left on device</code>; the database stops writing</td><td><code>df -h</code>; <code>docker system df</code></td><td>8.4 · 13.2</td></tr>
<tr><td>3</td><td>database port <code>open</code> from the Internet although ufw is on</td><td><code>nmap</code> from another machine; <code>ss -tlnp</code></td><td>12.3</td></tr>
<tr><td>4</td><td><code>curl: (60) … certificate has expired</code></td><td><code>openssl x509 -checkend</code>; <code>certbot certificates</code></td><td>12.2</td></tr>
<tr><td>5</td><td>a new route 404s after a "successful" deploy</td><td><code>/api/version</code>; <code>docker inspect … Created</code></td><td>13.1 · 11.3</td></tr>
<tr><td>6</td><td>nginx.conf edited, <code>nginx -t</code> green, nothing changed</td><td><code>sha256sum</code> on the host vs inside the container</td><td>13.1</td></tr>
<tr><td>7</td><td>the release log says one version, the front door serves another, a few 502s</td><td>read the release log; <code>/api/version</code></td><td>7.3</td></tr>
<tr><td>8</td><td>every request hangs, then 000 / 504</td><td><code>pg_stat_activity</code> with <code>pg_blocking_pids()</code></td><td>5.3</td></tr>
</table>

<h3>Incident 1 — the image built on the wrong libc</h3>
${slide('dv-15', 24, 'Sự cố 1–2: ảnh sai libc · đĩa đầy')}
<p><strong>The real story (18/08):</strong> the image was built with the wrong Dockerfile; its Alpine (musl) base carried a Prisma engine compiled for glibc. Build green, push green, swap green — then the backend restarted forever and the API returned 502 for seven minutes. Rebuilt here with a smaller native library, <code>@node-rs/bcrypt</code>, installed on Debian and copied into Alpine "to make the image smaller":</p>
<pre><code class="language-dockerfile"><span class="tok-comment"># SAI co chu dich: cai thu vien tren Debian (glibc), chay tren Alpine (musl) cho anh nho</span>
FROM node:22-bookworm-slim AS dung
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund
FROM node:22-alpine
WORKDIR /app
COPY --from=dung /app/node_modules ./node_modules
COPY . .
CMD ["node", "server.js"]</code></pre>
<p><strong>Symptom</strong>, on the VPS with <code>--restart unless-stopped</code>:</p>
<div class="out">$ docker ps --filter name=thu-libc --format "{{.Names}}  {{.Status}}"
thu-libc  Restarting (1) 4 seconds ago
$ docker inspect -f "RestartCount={{.RestartCount}} ExitCode={{.State.ExitCode}}" thu-libc
RestartCount=7 ExitCode=1
$ docker logs thu-libc 2&gt;&amp;1 | grep -m2 -E "Cannot find module .@node|Error: Failed"
Error: Failed to load native binding
    Error: Cannot find module '@node-rs/bcrypt-linux-arm64-musl'
$ curl -s -o /dev/null -w "curl 127.0.0.1:3009 -&gt; %{http_code} (exit %{exitcode})\\n" 127.0.0.1:3009/
curl 127.0.0.1:3009 -&gt; 000 (exit 7)</div>
<p><strong>Diagnose:</strong> which libc does the image have, and which binary did npm install?</p>
<div class="out">$ docker run --rm localhost:19155/pk-libc:sai ls node_modules/@node-rs/
bcrypt
bcrypt-linux-arm64-gnu
$ docker run --rm --entrypoint sh localhost:19155/pk-libc:sai -c 'ls /lib/ld-*'
/lib/ld-musl-aarch64.so.1</div>
<p>npm picked the <code>-gnu</code> package because it ran on Debian; the image runs musl and looks for <code>-musl</code>. Built on the same base (<code>FROM node:22-alpine AS dung</code>), npm installs <code>bcrypt-linux-arm64-musl</code> and everything works.</p>
<p><strong>Prevent:</strong> <code>kiem-anh.sh</code> (15.2) loads every dependency inside the image before pushing. Against the broken image it stopped with the same error and exit 1 — nothing was pushed. Against the fixed image:</p>
<div class="out">  thu vien nap duoc: @node-rs/bcrypt
  khoi dong duoc: nghe :3000
  OK localhost:19155/pk-libc:dung (linux/arm64)</div>
<p>This is also where the check's own bug was found: on the Alpine image its <code>timeout 3 node server.js</code> hung for over three minutes (BusyBox's <code>timeout</code> makes <code>node</code> PID 1, which ignores SIGTERM). <code>--init</code> fixed it; afterwards the whole check took 4.3 s. <strong>Check the checker</strong> against the kind of input it has never seen.</p>
<p><strong>Recover tonight:</strong> the blue/green release script never switched to this image (its health check fails), so the old version kept serving. On a setup without that — <code>docker compose up -d</code> with a new tag — retag the previous image and recreate the container (CLAUDE.md: about 40 s instead of a 15-minute rebuild).</p>

<h3>Incident 2 — a full disk, from building on the server</h3>
<p><strong>The real story (18/08):</strong> Docker build cache grew to 7.6 GB on the VPS disk that also held Postgres; a deploy died with <code>no space left on device</code> in the middle of <code>next build</code>. Rebuilt on a VPS whose Docker lives on a 1.5 GB disk (a loop-mounted file on vps2), with Postgres receiving writes every half-second and a "build" that leaves 150 MB per run, like <code>.next</code> output and cache:</p>
<div class="out">09:58:17 lan 1: dung xong ·  1.1G  279M  80%
09:58:24 lan 2: HONG
no space left on device
failed to apply diff: write /var/lib/docker-nho/containerd/daemon/io.containerd.snapshotter.v1.overlayfs/snapshots/41/fs/app/.next-cache: no space lef
$ grep -v "^$" /root/ghi-db.log | grep -v -E "^[0-9:]+ db: $" | tail -4
09:58:23 db: ERROR:  could not extend file "base/5/16385": No space left on device
09:58:23 db: HINT:  Check free disk space.
09:58:24 db: ERROR:  could not extend file "base/5/16385": No space left on device
09:58:24 db: HINT:  Check free disk space.
$ df -h /var/lib/docker-nho
/dev/loop0      1.5G  1.4G     0 100% /var/lib/docker-nho</div>
<p>The second build did not only fail itself — for the same second, the database could not write. Users' appointments were lost, not delayed.</p>
<p><strong>Diagnose:</strong> <code>df -h</code> says full; <code>docker system df</code> says who:</p>
<div class="out">TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          4         2         1.236GB   759.7MB (61%)
Containers      2         1         157.3MB   157.3MB (99%)
Local Volumes   1         1         43.98MB   0B (0%)
Build Cache     0         0         0B        0B</div>
<p>Here the space was in an unused image and the failed build's leftover container (with the classic builder the half-built layer stays as a stopped container). <strong>Recover:</strong> remove exactly those — exited containers, the old image, dangling images — never a blanket <code>prune</code> on a server you do not fully know:</p>
<div class="out">$ docker ps -aq --filter status=exited | xargs -r docker rm
4d5853e54028
$ docker rmi pk:lan1
Deleted: sha256:ea777f479639e4d21a9c686809c400060f60b559b2778dcab3eb678052239e21
$ df -h /var/lib/docker-nho
/dev/loop0      1.5G  775M  575M  58% /var/lib/docker-nho
$ docker exec pk-db psql -U postgres -Atc "select count(*) from lich_hen"   # hai lan, cach 2 s
10200
10800</div>
<p>The database was writing again within seconds, without a restart.</p>
<p><strong>The other half: logs without rotation.</strong> A chatty container ran for 10 seconds on a daemon without <code>log-opts</code>, then the same on the project's VPS whose <code>daemon.json</code> (15.1) sets 10 MB × 3:</p>
<div class="out">289M …/9f5806a21041b3bdad27faa273defed4f302444aa15487ed1d3669a0f0ef0ae9-json.log
# cung app, tren VPS co max-size 10m, max-file 3:
8.2M …/b716b7b1456f54d0e784dec4f8ac02a7a65ddb8c5816d5bf4bca8f25499ecd17-json.log
9.6M …/b716b7b1456f54d0e784dec4f8ac02a7a65ddb8c5816d5bf4bca8f25499ecd17-json.log.1
9.6M …/b716b7b1456f54d0e784dec4f8ac02a7a65ddb8c5816d5bf4bca8f25499ecd17-json.log.2</div>
<p>289 MB in ten seconds without a cap; 27 MB, forever, with one. <strong>Prevent:</strong> never build on the server (15.2); set log rotation in <code>daemon.json</code> on Day 1 (it applies to containers created after the change); keep the database on a disk that images and logs cannot fill, and alert on the disk trend (Chapter 9.4), not at 100%.</p>

<h3>Incident 3 — the database port that ufw did not close</h3>
${slide('dv-15', 25, 'Sự cố 3–4: cổng DB lộ · chứng chỉ hết hạn')}
<p>"Just for tonight, so we can open the database in DBeaver": a teammate starts Postgres with <code>-p 5432:5432</code> on the VPS where ufw allows only 22/80/443. From vps2:</p>
<div class="out">$ nmap -Pn -p 22,80,443,5432,3001,3002 phongkham.test
22/tcp   open     ssh
80/tcp   open     http
443/tcp  open     https
3001/tcp filtered nessus
3002/tcp filtered exlm-agent
5432/tcp open     postgresql
$ docker run --rm -e PGPASSWORD=12345 postgres:16-alpine psql -h 172.22.15.10 -U postgres -Atc "select 'vao duoc: ' || version()" | cut -c1-60
vao duoc: PostgreSQL 16.15 on aarch64-unknown-linux-musl, co</div>
<p>Note the contrast in the same scan: 3001 and 3002, the app's ports, are published on <code>127.0.0.1</code> and show <code>filtered</code>; 5432, published on all addresses, is <code>open</code> and accepts a login. Chapter 12.3 explained why: Docker's DNAT sends the packet through FORWARD, where ufw's rules are never consulted. <strong>Recover:</strong> republish on loopback — <code>-p 127.0.0.1:5432:5432</code> — and the same scan says <code>5432/tcp filtered postgresql</code>. Then change the password, because you cannot know who logged in while it was open. <strong>Prevent:</strong> the database is never published (the project's <code>pk-db</code> has no <code>-p</code> at all); teammates who need DBeaver use an SSH tunnel; scan from outside after every infrastructure change.</p>

<h3>Incident 4 — the certificate expired, and nobody renewed it</h3>
<p>To watch a certificate expire without waiting 90 days, Pebble was restarted with a 240-second validity, and the lab VPS got a fresh certificate:</p>
<div class="out">notBefore=Sep 29 10:00:42 2026 GMT
notAfter=Sep 29 10:04:41 2026 GMT</div>
<p>The outside watcher (15.3) noticed first, at 10:00:51, four minutes before users would:</p>
<div class="out">10:00:51 ma=200 dem=0 LEN-&gt;CHUNG-CHI-SAP-HET cert=0d
10:00:51 POST /canh {"text":"phongkham: LEN -&gt; CHUNG-CHI-SAP-HET (ma 200, chung chi con 0 ngay)"}</div>
<p>Nobody acted. At 10:05:</p>
<div class="out">$ curl -sS https://phongkham.test/api/health
curl: (60) SSL certificate problem: certificate has expired
$ certbot certificates
  Certificate Name: phongkham.test
    Expiry Date: 2026-09-29 10:04:41+00:00 (INVALID: EXPIRED)
$ curl -s -o /dev/null -w "tu trong VPS qua 127.0.0.1:3001 -&gt; %{http_code}\\n" 127.0.0.1:3001/api/health
tu trong VPS qua 127.0.0.1:3001 -&gt; 200</div>
<p>From inside the server everything is fine — which is exactly why checks from inside cannot be trusted with this one. <strong>Diagnose</strong> why nothing renewed:</p>
<div class="out">$ grep -v "^#" /etc/cron.d/certbot | grep -v "^$"
SHELL=/bin/sh
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
0 */12 * * * root test -x /usr/bin/certbot -a \\! -d /run/systemd/system &amp;&amp; perl -e 'sleep int(rand(43200))' &amp;&amp; certbot -q renew --no-random-sleep-on-renew
$ pgrep -a cron || echo "(khong co tien trinh cron nao)"
(khong co tien trinh cron nao)</div>
<p>Ubuntu's certbot package installs two schedules: a systemd timer, and a cron line that deliberately does nothing when systemd is running (<code>\\! -d /run/systemd/system</code>). This lab machine has no systemd and no cron daemon, so <em>neither</em> ran. On a real VPS the equivalent failures are a disabled timer, a renewal that fails every time (port 80 closed, a redirect that swallows <code>/.well-known</code>), or a renewal that succeeds without reloading nginx (Chapter 12.2). <strong>Recover:</strong> renew by hand with the deploy hook — here the certificate came back in 2.7 s and the watcher reported <code>SAP -&gt; LEN (ma 200, chung chi con 89 ngay)</code>. <strong>Prevent:</strong> <code>systemctl list-timers certbot.timer</code> on Day 1; <code>certbot renew --dry-run</code> after any nginx change; and an outside check with <code>-checkend</code> that warns days ahead, not minutes.</p>
<p>(Lab note: Pebble keeps its accounts in memory, so after the restart certbot's saved account was unknown — <code>accountDoesNotExist</code> — and a new registration was needed. Let's Encrypt does not forget accounts; you will not see this in production.)</p>

<h3>Incident 5 — "deploy succeeded", the old image is still running</h3>
${slide('dv-15', 26, 'Sự cố 5–6: --no-build · bind-mount theo inode')}
<p><strong>The real story (02/07):</strong> a <code>--no-build</code> deploy rsynced new code but did not rebuild, so the container kept running the old image and a new route returned 404. Rebuilt with compose on the VPS: version 1 of a tiny app, then a new route <code>/api/bac-si</code> (doctors) added to the code:</p>
<div class="out">$ docker compose up -d --no-build
 Container su-co-5-api-1  Running
/api/version -&gt; 200
/api/bac-si -&gt; 404
anh dang chay tao luc 2026-09-29T10:05:38.306
app.js sua luc 2026-09-29 10:05:39.
$ docker compose up -d --build
 Container su-co-5-api-1  Started
/api/version -&gt; 200
/api/bac-si -&gt; 200</div>
<p><code>Running</code> — compose saw nothing to change, because with <code>--no-build</code> the image is whatever was built before. <strong>Diagnose</strong> by comparing times: the image was created at 10:05:38, the code changed at 10:05:39. A 404 on a route you just added means "old code", while a 401 or 200 means "the route exists" (the project's smoke test uses exactly this rule). <strong>Prevent:</strong> build elsewhere and deploy by tag (the tag cannot be stale — it names the commit), and smoke-test <code>/api/version</code> against the tag you just pushed.</p>

<h3>Incident 6 — the config file that nginx never saw</h3>
<p><strong>The real story (23–25/08):</strong> nginx.conf is a bind mount of a single file; replacing it with <code>mv</code> gave the host a new inode while the container kept the old one; <code>nginx -t</code> and reload succeeded — on the old configuration. Rebuilt with an nginx container and a header <code>X-Ban</code> ("version"):</p>
<div class="out">X-Ban: 1
$ sed -i 's/X-Ban "1"/X-Ban "2"/' nginx.conf  &amp;&amp;  nginx -t  &amp;&amp;  nginx -s reload
inode truoc: 148365
inode sau sed -i: 149463
nginx: configuration file /etc/nginx/nginx.conf test is successful
X-Ban: 1
tren may:        X-Ban "2"   sha=60d52c9bf864
trong container: X-Ban "1"   sha=df715bd85d8a</div>
<p><code>sed -i</code> writes a new file and renames it over the old one — a new inode, exactly like <code>mv</code>, <code>rsync</code> and vim's <code>:w</code>. <strong>Diagnose</strong> by comparing checksums on the host and <em>inside</em> the container; they differ. <strong>Recover:</strong> recreate the container once so it mounts the current inode. <strong>Prevent:</strong> from then on, change the file in place, which keeps the inode:</p>
<div class="out">$ cat /tmp/moi.conf &gt; nginx.conf    # inode giu nguyen
inode sau cat &gt;: 149463
nginx: configuration file /etc/nginx/nginx.conf test is successful
X-Ban: 3</div>
<p>…or mount the <em>directory</em>, not the file. <code>phat-hanh.sh</code> writes its upstream file with <code>cat &gt;</code> for this reason, even though its nginx runs on the host.</p>

<h3>Incident 7 — two releases at once</h3>
${slide('dv-15', 27, 'Sự cố 7–8: chạy chồng · migration kẹt khoá')}
<p>The lock was removed from a copy of <code>phat-hanh.sh</code>, and two releases were started one second apart, while vps2 counted:</p>
<div class="out">2026-09-29T09:51:58 85065be bat-dau mau=lam
2026-09-29T09:51:59 3c65eb7 bat-dau mau=lam
2026-09-29T09:52:02 85065be OK mau=lam
Error response from daemon: No such container: pk-xanh
2026-09-29T09:52:03 3c65eb7 HONG dong 67: docker stop -t 20 "pk-$cu" &gt; /dev/null
$ curl -s https://phongkham.test/api/version
{"ban":"3c65eb7"}
$ dem.sh 25        # tren dv15-vps2, cung luc
1000 request trong 25 s:
    988 200
     12 502</div>
<p>Both runs read <code>mau-dang-chay</code> before either wrote it, so both chose green. The second run's <code>docker rm -f pk-lam</code> deleted the container the first had just started — 12 users got a 502 — then started its own. The first run finished "OK" with a container that no longer existed; the second switched nginx successfully and then failed trying to stop a blue container the first had already removed. Result: <strong>the log says <code>85065be OK</code>, users are served <code>3c65eb7</code></strong>, a version whose release the log calls failed. The next <code>lui</code> would compute its target from a lie. <strong>Recover:</strong> release the intended tag again, with the lock (<code>85065be OK mau=xanh</code> at 09:52:38), and add a line to the log about what happened. <strong>Prevent:</strong> the <code>flock</code> of 15.2 — and one person, one deploy, announced in the chat.</p>

<h3>Incident 8 — a migration stuck behind a lock</h3>
<p>A teammate opens <code>psql</code> on the server, starts a transaction to "look at the data" — <code>begin; select count(*) from lich_hen;</code> — and goes to lunch. Their session holds an ACCESS SHARE lock on the table. The next release adds a column; <code>ALTER TABLE</code> needs ACCESS EXCLUSIVE, so it waits — and every normal <code>select</code> that arrives after it queues behind the ALTER (Chapter 5.3). Measured with the migration's <code>lock_timeout</code> set to 0 (wait forever):</p>
<table>
<tr><th>pid</th><th>blocked by</th><th>state</th><th>waiting on</th><th>waited</th><th>query</th></tr>
<tr><td>442</td><td>{}</td><td>idle in transaction</td><td>Client</td><td>00:00:11.169675</td><td><code>select count(*) from lich_hen;</code></td></tr>
<tr><td>446</td><td>{442}</td><td>active</td><td>Lock</td><td>00:00:07.791297</td><td>the ALTER TABLE</td></tr>
<tr><td>445</td><td>{446}</td><td>active</td><td>Lock</td><td>00:00:07.783704</td><td>the API's <code>select …</code></td></tr>
<tr><td>448</td><td>{446}</td><td>active</td><td>Lock</td><td>00:00:04.759105</td><td>the API's <code>select …</code></td></tr>
</table>
<p>(From <code>select pid, pg_blocking_pids(pid), state, wait_event_type, now()-query_start, left(query,38) from pg_stat_activity …</code>, taken 8 s into the wait.) The chain reads itself: 442 blocks 446, 446 blocks the API. Users' requests hung and gave up at the client's 3-second limit. <strong>Recover:</strong> end the forgotten session:</p>
<div class="out">$ select pg_terminate_backend(442);
t
migration 006_chi_nhanh.sql xong (14050 ms)
$ dem.sh 30        # tren dv15-vps2, cung luc
624 request trong 30 s:
      4 000
    620 200
  cham hon 1 s: 5 · lau nhat: 3.01 s</div>
<p><strong>Prevent:</strong> the <code>lock_timeout = '5s'</code> that <code>migrate.js</code> sets by default. The same situation with it:</p>
<div class="out">2026-09-29T09:50:30 85065be bat-dau mau=lam
migration 006_chi_nhanh.sql HONG: canceling statement due to lock timeout
deploy: HONG o dong 19: $VPS_SSH "sudo /opt/phongkham/bin/phat-hanh.sh $TAG"
$ dem.sh 20        # tren dv15-vps2, cung luc
575 request trong 20 s:
      1 000
    574 200
  cham hon 1 s: 2 · lau nhat: 3.01 s</div>
<p>The migration gave up after 5 s, the release stopped before starting any new container, and the old version kept serving; one request timed out during those five seconds instead of every request for as long as lunch lasts. Then find the blocker, end it, and release again. Two more lessons came out of this run: the release log had only <code>bat-dau</code> for it, because the script died at <code>node migrate.js</code> under <code>set -e</code> before writing anything — which is why <code>phat-hanh.sh</code> now has <code>trap … ERR</code> writing <code>HONG</code> with the line number. And the first attempt to stage this incident "succeeded" with no waiting at all: the forgotten session had been started through a pipe that closed, so it committed before the deploy began. Check that your reproduction reproduces.</p>

<h3>Write it down: a five-line postmortem</h3>
<p>After each incident, five lines in <code>INCIDENTS.md</code> — the same shape the course uses for the real project's history:</p>
<pre><code>2026-09-29 09:52 · Hai lan phat hanh chong nhau (su co 7)
Trieu chung: so ghi 85065be OK, cua truoc tra 3c65eb7; 12 × 502 trong 1 s
Nguyen nhan: phat-hanh.sh chay khong co flock; ca hai doc mau-dang-chay truoc khi ai ghi
Cuu: phat hanh lai 85065be co khoa (09:52:38), ghi chu vao so
Phong: flock -n + ma thoat 3; moi lan deploy bao trong nhom chat</code></pre>
<p>No blame, one line each, and the "prevent" line must be a change, not an intention.</p>

<h3>Try it step by step: staging an incident safely</h3>
<ul>
<li>Every incident here was staged on the lab VPS or on vps2, never on a machine anyone uses. The disk-full one used a 1.5 GB file mounted as a loop device and a separate Docker data root, so the real Docker disk was never at risk.</li>
<li>Change one thing at a time, and write down the command that will undo it before running the command that breaks it.</li>
<li>Measure from outside while you break it: <code>dem.sh</code> on another machine turned every incident into a number of failed requests.</li>
<li>Stage the failure, then stage the prevention and show the same situation no longer hurts (incidents 1, 2, 7 and 8 above).</li>
</ul>

<h3>On Windows/WSL and macOS</h3>
<ul>
<li><strong>Docker Desktop on a laptop hides some of these:</strong> port publishing goes through Docker Desktop's VM and a userland proxy, so incident 3 looks different there; reproduce it on a Linux VM or the lab VPS.</li>
<li><strong>Disk full on macOS/Windows</strong> hits the Docker Desktop virtual disk first — <code>docker system df</code> is still the first command, and the Docker Desktop settings show the disk image size.</li>
<li><strong>Bind mounts from Windows</strong> into containers go through a file-sharing layer; editors there also replace files, so incident 6 happens on laptops too.</li>
</ul>

<h3>When to use this playbook</h3>
<ul>
<li><strong>Use it</strong> for the first weeks of any small production service, and as a checklist when you inherit one.</li>
<li><strong>Grow out of it</strong> when you have several services: incident response then needs on-call rotation, dashboards and alert routing — the principles (diagnose from the signature, check from outside, write it down) stay the same.</li>
<li><strong>Do not</strong> stage incidents on a machine with real users. The whole point of the lab is that breaking it costs nothing.</li>
</ul>

<div class="pitfall co-tieu-de"><strong>Trap — trusting "OK" in any log.</strong> Four of the eight incidents said OK or green somewhere: the build (1), <code>docker compose up</code> (5), <code>nginx -t</code> (6), the release log (7). Each OK was true about the thing it measured — the build finished, the container was running, the file on disk was valid, one script finished — and false about what users got. The only OK that counts is measured where users stand.</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Pick two incidents from the eight, one "build/image" (1, 5, 6) and one "running system" (2, 3, 4, 7, 8).</li>
<li>Stage each on the lab with <code>dem.sh</code> running on another machine, and record the symptom exactly as printed.</li>
<li>Diagnose with the first command from the table, recover, then stage the prevention and show the situation no longer hurts.</li>
<li>Write a five-line postmortem for each.</li>
</ol>
<p><strong>Done when:</strong> for each of the two you have the symptom text, the diagnostic output, the number of failed requests before and after the prevention, and a five-line postmortem whose last line is a change you made.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">runbook</span><span class="v">A one-page procedure followed on every deploy, written for a tired person at night.</span></div>
  <div class="kv"><span class="k">incident</span><span class="v">Anything that makes users get errors or wrong results; handled as symptom → diagnose → recover → prevent.</span></div>
  <div class="kv"><span class="k">postmortem</span><span class="v">A short, blameless write-up after an incident: what, why, how recovered, what changes.</span></div>
  <div class="kv"><span class="k">libc (glibc / musl)</span><span class="v">The C library under every program; native modules built for one do not load on the other.</span></div>
  <div class="kv"><span class="k">bind mount (single file)</span><span class="v">A host file mounted into a container by inode; replacing the file on the host is invisible inside.</span></div>
  <div class="kv"><span class="k"><code>pg_blocking_pids()</code></span><span class="v">PostgreSQL function that lists which sessions block a given one — the chain behind a hang.</span></div>
  <div class="kv"><span class="k">idle in transaction</span><span class="v">A session that opened a transaction and is doing nothing — while still holding its locks.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Deploy from a one-page runbook: check disk, backup and migration type before; one command during; check from outside after.</li>
<li>Every incident is symptom → first command → recover → prevent → chapter, and ends in a five-line postmortem.</li>
<li>Images: check libc and dependencies inside the image before pushing (1); deploy by tag, not <code>--no-build</code> (5); edit bind-mounted files in place (6).</li>
<li>Running system: never build on the server, rotate logs (2); never publish the database (3); verify renewal and watch expiry from outside (4).</li>
<li>Releases: one at a time under a lock (7); migrations with <code>lock_timeout</code>, and find blockers with <code>pg_blocking_pids()</code> (8).</li>
<li>An OK in a log is true about what it measured; only a measurement from where users stand says the site works.</li>
</ul>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker — JSON File logging driver</span><span class="lc-sub">docs.docker.com/engine/logging/drivers/json-file/ — <code>max-size</code>, <code>max-file</code>, and when they apply.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker — docker system df</span><span class="lc-sub">docs.docker.com/reference/cli/docker/system/df/ — what uses the disk.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker — Bind mounts</span><span class="lc-sub">docs.docker.com/engine/storage/bind-mounts/ — mounting files and directories from the host.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — Explicit locking</span><span class="lc-sub">postgresql.org/docs/16/explicit-locking.html — which statements take which locks, and the queue behind ACCESS EXCLUSIVE.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — System information functions</span><span class="lc-sub">postgresql.org/docs/16/functions-info.html — <code>pg_blocking_pids()</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google SRE Book — Postmortem culture</span><span class="lc-sub">sre.google/sre-book/postmortem-culture/ — blameless write-ups that change something.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — Lesson 16.4: eight first-week incidents on the server</span><span class="lc-sub">/courses/linux-bash/learn${REF} — the operating-system side: disk, memory, ports, permissions, timers, CRLF.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.4</span>
<h2>Ra mắt và tuần đầu: runbook một trang và tám sự cố kinh điển, dựng lại thật</h2>
<p class="lead">Trang đã lên, thầy đã có link, và bảy ngày tới là lúc mọi thứ hỏng — không phải vì nhóm cẩu thả, mà vì một máy chủ đang phục vụ thật gặp những tình huống mà phòng thí nghiệm chưa từng dàn dựng. Bài này đưa bạn một runbook một trang cho mọi lần deploy, rồi dàn dựng có chủ đích tám sự cố trên cùng phòng thí nghiệm đó: sự cố nào cũng là thứ dự án thật của khoá này, hoặc những dự án giống nó, đã thực sự gặp. Với mỗi sự cố: triệu chứng bạn thấy, lệnh đầu tiên cho biết đó là gì, cách cứu ngay tối nay, cách phòng, và chương giải thích nó.</p>

<h3>Runbook một trang</h3>
${slide('dv-15', 22, 'Runbook một trang: trước, trong, sau')}
<p>Runbook (sổ tay vận hành) không phải tài liệu mô tả hệ thống; nó là danh sách bạn làm theo khi đang mệt. Giữ nó thành <code>RUNBOOK.md</code> trong kho mã, một trang, và dùng nó cho mọi lần deploy cho tới khi thấy chán.</p>
<table>
<tr><th>Khi nào</th><th>Kiểm gì</th><th>Vì sao (chương)</th></tr>
<tr><td rowspan="5"><strong>Trước</strong> (5 phút)</td><td>cây làm việc sạch, đúng nhánh, CI xanh</td><td>chỉ mã đã commit mới được lên (15.2, 1.2)</td></tr>
<tr><td><code>df -h /</code> trên VPS còn trống trên 20%</td><td>đĩa đầy giết CSDL đầu tiên (8.4, sự cố 2)</td></tr>
<tr><td>bản sao lưu gần nhất chưa quá 24 giờ, và <code>pg_restore -l</code> đọc được nó</td><td>có khi mười phút nữa bạn cần tới nó (10.4)</td></tr>
<tr><td>migration trong lần này chỉ là mở rộng — hoặc bạn đã quyết định khác, có chủ ý</td><td>thu hẹp đóng cửa đường lùi (15.3, 5.2)</td></tr>
<tr><td>biết tag để lùi về; nhóm biết bạn đang deploy; không phải 22:00 tối trước hôm bảo vệ</td><td>lùi chỉ nhanh khi đã chuẩn bị (6.1)</td></tr>
<tr><td><strong>Trong lúc</strong></td><td>một lệnh, <code>ops/deploy.sh</code>; đọc từng chặng ① → ④; không bao giờ <code>| head</code>; không bao giờ hai người cùng lúc</td><td>khoá và SIGPIPE (15.2)</td></tr>
<tr><td><strong>Nếu hỏng</strong></td><td>dừng lại, đọc chặng và thông báo; đừng chạy lại mù quáng — script đã giữ bản cũ tiếp tục phục vụ</td><td>một cú hỏng là thông tin (11.1)</td></tr>
<tr><td rowspan="3"><strong>Sau</strong> (10 phút)</td><td>từ một máy khác: <code>/api/version</code> là tag mới; một lần đọc thật trả 200</td><td>kiểm từ chỗ người dùng đứng (9.5)</td></tr>
<tr><td><code>docker ps</code>: không có <code>Restarting</code>; năm phút log không có lỗi lặp lại</td><td>vòng lặp sập-dậy nấp sau chữ "Up 3 seconds" (11.2)</td></tr>
<tr><td>người canh bên ngoài xanh; ghi một dòng vào nhóm chat: tag, giờ, "OK"</td><td>người sau biết đang chạy bản nào</td></tr>
<tr><td><strong>Lùi khi nào</strong></td><td>người dùng thấy lỗi mà 15 phút không sửa được: <code>phat-hanh.sh lui</code> (3,7 s). Nếu migration thu hẹp đã chạy thì đường lùi bị chặn: sửa tới, hoặc phục hồi (3,4 s + phần dữ liệu từ lúc sao lưu)</td><td>15.3</td></tr>
</table>

<h3>Đọc một sự cố thế nào</h3>
${slide('dv-15', 23, 'Tám sự cố kinh điển, dựng lại thật — một bảng')}
<p>Mọi sự cố dưới đây đi theo cùng năm bước, đúng khuôn Chương 11 dạy để đọc chữ ký của một cú hỏng:</p>
<ol>
<li><strong>Triệu chứng</strong> — người dùng hay người canh thấy gì, nguyên văn.</li>
<li><strong>Lệnh chẩn đoán đầu tiên</strong> — lệnh tách được sự cố này ra khỏi những sự cố trông giống nó.</li>
<li><strong>Cứu</strong> — thứ làm trang chạy lại ngay tối nay.</li>
<li><strong>Phòng</strong> — thứ làm nó không xảy ra nữa: một phép kiểm trong script, một thiết lập, một thói quen.</li>
<li><strong>Chương</strong> — nơi cơ chế được giải thích.</li>
</ol>
<table>
<tr><th>#</th><th>Triệu chứng</th><th>Lệnh đầu tiên</th><th>Chương</th></tr>
<tr><td>1</td><td>API 502, container <code>Restarting (1)</code></td><td><code>docker logs --tail 20</code>; <code>ls /lib/ld-*</code> trong ảnh</td><td>13.2 · 11</td></tr>
<tr><td>2</td><td><code>no space left on device</code>; CSDL thôi ghi</td><td><code>df -h</code>; <code>docker system df</code></td><td>8.4 · 13.2</td></tr>
<tr><td>3</td><td>cổng CSDL <code>open</code> từ Internet dù ufw đang bật</td><td><code>nmap</code> từ máy khác; <code>ss -tlnp</code></td><td>12.3</td></tr>
<tr><td>4</td><td><code>curl: (60) … certificate has expired</code></td><td><code>openssl x509 -checkend</code>; <code>certbot certificates</code></td><td>12.2</td></tr>
<tr><td>5</td><td>route mới trả 404 sau một lần deploy "thành công"</td><td><code>/api/version</code>; <code>docker inspect … Created</code></td><td>13.1 · 11.3</td></tr>
<tr><td>6</td><td>sửa nginx.conf, <code>nginx -t</code> xanh, không gì đổi</td><td><code>sha256sum</code> trên máy chủ so với bên trong container</td><td>13.1</td></tr>
<tr><td>7</td><td>sổ phát hành nói một bản, cửa trước phục vụ bản khác, vài lần 502</td><td>đọc sổ phát hành; <code>/api/version</code></td><td>7.3</td></tr>
<tr><td>8</td><td>mọi request treo, rồi 000 / 504</td><td><code>pg_stat_activity</code> cùng <code>pg_blocking_pids()</code></td><td>5.3</td></tr>
</table>

<h3>Sự cố 1 — ảnh dựng trên sai libc</h3>
${slide('dv-15', 24, 'Sự cố 1–2: ảnh sai libc · đĩa đầy')}
<p><strong>Chuyện thật (18/08):</strong> ảnh được dựng bằng nhầm Dockerfile; nền Alpine (musl) của nó mang một engine Prisma biên dịch cho glibc. Build xanh, đẩy xanh, tráo xanh — rồi backend khởi động lại vô tận và API trả 502 suốt bảy phút. Dựng lại ở đây bằng một thư viện native nhỏ hơn, <code>@node-rs/bcrypt</code>, cài trên Debian rồi chép sang Alpine "cho ảnh nhỏ":</p>
<pre><code class="language-dockerfile"><span class="tok-comment"># SAI co chu dich: cai thu vien tren Debian (glibc), chay tren Alpine (musl) cho anh nho</span>
FROM node:22-bookworm-slim AS dung
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund
FROM node:22-alpine
WORKDIR /app
COPY --from=dung /app/node_modules ./node_modules
COPY . .
CMD ["node", "server.js"]</code></pre>
<p><strong>Triệu chứng</strong>, trên VPS với <code>--restart unless-stopped</code>:</p>
<div class="out">$ docker ps --filter name=thu-libc --format "{{.Names}}  {{.Status}}"
thu-libc  Restarting (1) 4 seconds ago
$ docker inspect -f "RestartCount={{.RestartCount}} ExitCode={{.State.ExitCode}}" thu-libc
RestartCount=7 ExitCode=1
$ docker logs thu-libc 2&gt;&amp;1 | grep -m2 -E "Cannot find module .@node|Error: Failed"
Error: Failed to load native binding
    Error: Cannot find module '@node-rs/bcrypt-linux-arm64-musl'
$ curl -s -o /dev/null -w "curl 127.0.0.1:3009 -&gt; %{http_code} (exit %{exitcode})\\n" 127.0.0.1:3009/
curl 127.0.0.1:3009 -&gt; 000 (exit 7)</div>
<p><strong>Chẩn đoán:</strong> ảnh có libc nào, và npm đã cài bản nhị phân nào?</p>
<div class="out">$ docker run --rm localhost:19155/pk-libc:sai ls node_modules/@node-rs/
bcrypt
bcrypt-linux-arm64-gnu
$ docker run --rm --entrypoint sh localhost:19155/pk-libc:sai -c 'ls /lib/ld-*'
/lib/ld-musl-aarch64.so.1</div>
<p>npm chọn gói <code>-gnu</code> vì nó chạy trên Debian; ảnh chạy musl và đi tìm <code>-musl</code>. Dựng trên cùng một nền (<code>FROM node:22-alpine AS dung</code>) thì npm cài <code>bcrypt-linux-arm64-musl</code> và mọi thứ chạy.</p>
<p><strong>Phòng:</strong> <code>kiem-anh.sh</code> (15.2) nạp mọi thư viện phụ thuộc bên trong ảnh trước khi đẩy. Với ảnh hỏng, nó dừng với đúng lỗi đó và mã thoát 1 — không có gì được đẩy lên. Với ảnh đã sửa:</p>
<div class="out">  thu vien nap duoc: @node-rs/bcrypt
  khoi dong duoc: nghe :3000
  OK localhost:19155/pk-libc:dung (linux/arm64)</div>
<p>Cũng chính ở đây con bọ của bản thân bộ kiểm lộ ra: trên ảnh Alpine, lệnh <code>timeout 3 node server.js</code> của nó treo hơn ba phút (<code>timeout</code> của BusyBox biến <code>node</code> thành PID 1, mà PID 1 bỏ qua SIGTERM). <code>--init</code> sửa được; sau đó cả phép kiểm mất 4,3 s. <strong>Kiểm chính bộ kiểm</strong> với loại đầu vào nó chưa từng gặp.</p>
<p><strong>Cứu tối nay:</strong> script phát hành xanh/lam không bao giờ tráo sang ảnh này (health của nó hỏng), nên bản cũ vẫn phục vụ. Ở kiểu thiết lập không có lớp đó — <code>docker compose up -d</code> với tag mới — gắn lại tag cho ảnh cũ và tạo lại container (CLAUDE.md: khoảng 40 s thay vì 15 phút build lại).</p>

<h3>Sự cố 2 — đĩa đầy vì build ngay trên máy chủ</h3>
<p><strong>Chuyện thật (18/08):</strong> cache build của Docker phình tới 7,6 GB trên chính cái đĩa chứa Postgres của VPS; một lần deploy chết với <code>no space left on device</code> giữa lúc <code>next build</code>. Dựng lại trên một VPS có Docker nằm trên đĩa 1,5 GB (một tệp gắn làm thiết bị loop trên vps2), Postgres nhận ghi mỗi nửa giây, và một lần "build" để lại 150 MB mỗi lượt, như dữ liệu ra và cache của <code>.next</code>:</p>
<div class="out">09:58:17 lan 1: dung xong ·  1.1G  279M  80%
09:58:24 lan 2: HONG
no space left on device
failed to apply diff: write /var/lib/docker-nho/containerd/daemon/io.containerd.snapshotter.v1.overlayfs/snapshots/41/fs/app/.next-cache: no space lef
$ grep -v "^$" /root/ghi-db.log | grep -v -E "^[0-9:]+ db: $" | tail -4
09:58:23 db: ERROR:  could not extend file "base/5/16385": No space left on device
09:58:23 db: HINT:  Check free disk space.
09:58:24 db: ERROR:  could not extend file "base/5/16385": No space left on device
09:58:24 db: HINT:  Check free disk space.
$ df -h /var/lib/docker-nho
/dev/loop0      1.5G  1.4G     0 100% /var/lib/docker-nho</div>
<p>Lần build thứ hai không chỉ tự hỏng — ngay trong giây đó, CSDL không ghi được. Lịch hẹn của người dùng bị MẤT, không phải bị chậm.</p>
<p><strong>Chẩn đoán:</strong> <code>df -h</code> nói đầy; <code>docker system df</code> nói ai làm đầy:</p>
<div class="out">TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          4         2         1.236GB   759.7MB (61%)
Containers      2         1         157.3MB   157.3MB (99%)
Local Volumes   1         1         43.98MB   0B (0%)
Build Cache     0         0         0B        0B</div>
<p>Ở đây chỗ trống nằm trong một ảnh không dùng và container sót lại của lần build hỏng (với builder cũ, tầng build dở ở lại thành một container đã dừng). <strong>Cứu:</strong> xoá đúng những thứ đó — container đã thoát, ảnh cũ, ảnh treo — đừng bao giờ <code>prune</code> tràn lan trên một máy chủ bạn chưa nắm hết:</p>
<div class="out">$ docker ps -aq --filter status=exited | xargs -r docker rm
4d5853e54028
$ docker rmi pk:lan1
Deleted: sha256:ea777f479639e4d21a9c686809c400060f60b559b2778dcab3eb678052239e21
$ df -h /var/lib/docker-nho
/dev/loop0      1.5G  775M  575M  58% /var/lib/docker-nho
$ docker exec pk-db psql -U postgres -Atc "select count(*) from lich_hen"   # hai lan, cach 2 s
10200
10800</div>
<p>Vài giây sau CSDL đã ghi lại được, không cần khởi động lại.</p>
<p><strong>Nửa kia: log không xoay vòng.</strong> Một container nói nhiều chạy 10 giây trên một daemon không có <code>log-opts</code>, rồi y hệt trên VPS của dự án, nơi <code>daemon.json</code> (15.1) đặt 10 MB × 3:</p>
<div class="out">289M …/9f5806a21041b3bdad27faa273defed4f302444aa15487ed1d3669a0f0ef0ae9-json.log
# cung app, tren VPS co max-size 10m, max-file 3:
8.2M …/b716b7b1456f54d0e784dec4f8ac02a7a65ddb8c5816d5bf4bca8f25499ecd17-json.log
9.6M …/b716b7b1456f54d0e784dec4f8ac02a7a65ddb8c5816d5bf4bca8f25499ecd17-json.log.1
9.6M …/b716b7b1456f54d0e784dec4f8ac02a7a65ddb8c5816d5bf4bca8f25499ecd17-json.log.2</div>
<p>289 MB trong mười giây khi không có trần; 27 MB, mãi mãi, khi có. <strong>Phòng:</strong> không bao giờ build trên máy chủ (15.2); đặt xoay vòng log trong <code>daemon.json</code> ngay Ngày 1 (nó áp dụng cho container tạo SAU khi đổi); để CSDL trên một đĩa mà ảnh và log không làm đầy được, và cảnh báo theo xu hướng đĩa (Chương 9.4), không phải lúc đã 100%.</p>

<h3>Sự cố 3 — cổng CSDL mà ufw không đóng</h3>
${slide('dv-15', 25, 'Sự cố 3–4: cổng DB lộ · chứng chỉ hết hạn')}
<p>"Chỉ tối nay thôi, để mở CSDL bằng DBeaver": một bạn khởi động Postgres với <code>-p 5432:5432</code> trên VPS mà ufw chỉ cho 22/80/443. Từ vps2:</p>
<div class="out">$ nmap -Pn -p 22,80,443,5432,3001,3002 phongkham.test
22/tcp   open     ssh
80/tcp   open     http
443/tcp  open     https
3001/tcp filtered nessus
3002/tcp filtered exlm-agent
5432/tcp open     postgresql
$ docker run --rm -e PGPASSWORD=12345 postgres:16-alpine psql -h 172.22.15.10 -U postgres -Atc "select 'vao duoc: ' || version()" | cut -c1-60
vao duoc: PostgreSQL 16.15 on aarch64-unknown-linux-musl, co</div>
<p>Để ý sự tương phản ngay trong cùng một lần quét: 3001 và 3002, cổng của app, publish lên <code>127.0.0.1</code> và hiện <code>filtered</code>; 5432, publish lên mọi địa chỉ, là <code>open</code> và nhận đăng nhập. Chương 12.3 đã giải thích vì sao: DNAT của Docker đẩy gói tin qua FORWARD, nơi luật của ufw không bao giờ được hỏi tới. <strong>Cứu:</strong> publish lại lên loopback — <code>-p 127.0.0.1:5432:5432</code> — và cùng lần quét đó báo <code>5432/tcp filtered postgresql</code>. Rồi đổi mật khẩu, vì bạn không thể biết ai đã đăng nhập trong lúc cổng mở. <strong>Phòng:</strong> CSDL không bao giờ được publish (<code>pk-db</code> của dự án không có <code>-p</code> nào); bạn nào cần DBeaver thì dùng đường hầm SSH; quét từ ngoài sau mỗi lần đổi hạ tầng.</p>

<h3>Sự cố 4 — chứng chỉ hết hạn, và không ai gia hạn</h3>
<p>Để xem một chứng chỉ hết hạn mà không phải chờ 90 ngày, Pebble được khởi động lại với hạn 240 giây, và VPS thí nghiệm nhận một chứng chỉ mới:</p>
<div class="out">notBefore=Sep 29 10:00:42 2026 GMT
notAfter=Sep 29 10:04:41 2026 GMT</div>
<p>Người canh bên ngoài (15.3) thấy trước tiên, lúc 10:00:51, bốn phút trước khi người dùng thấy:</p>
<div class="out">10:00:51 ma=200 dem=0 LEN-&gt;CHUNG-CHI-SAP-HET cert=0d
10:00:51 POST /canh {"text":"phongkham: LEN -&gt; CHUNG-CHI-SAP-HET (ma 200, chung chi con 0 ngay)"}</div>
<p>Không ai làm gì. Lúc 10:05:</p>
<div class="out">$ curl -sS https://phongkham.test/api/health
curl: (60) SSL certificate problem: certificate has expired
$ certbot certificates
  Certificate Name: phongkham.test
    Expiry Date: 2026-09-29 10:04:41+00:00 (INVALID: EXPIRED)
$ curl -s -o /dev/null -w "tu trong VPS qua 127.0.0.1:3001 -&gt; %{http_code}\\n" 127.0.0.1:3001/api/health
tu trong VPS qua 127.0.0.1:3001 -&gt; 200</div>
<p>Từ bên trong máy chủ mọi thứ vẫn ổn — chính vì thế không thể giao việc này cho phép kiểm bên trong. <strong>Chẩn đoán</strong> vì sao không có gì gia hạn:</p>
<div class="out">$ grep -v "^#" /etc/cron.d/certbot | grep -v "^$"
SHELL=/bin/sh
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
0 */12 * * * root test -x /usr/bin/certbot -a \\! -d /run/systemd/system &amp;&amp; perl -e 'sleep int(rand(43200))' &amp;&amp; certbot -q renew --no-random-sleep-on-renew
$ pgrep -a cron || echo "(khong co tien trinh cron nao)"
(khong co tien trinh cron nao)</div>
<p>Gói certbot của Ubuntu cài hai lịch: một timer systemd, và một dòng cron cố ý không làm gì khi systemd đang chạy (<code>\\! -d /run/systemd/system</code>). Máy thí nghiệm này không có systemd lẫn trình nền cron, nên CẢ HAI đều không chạy. Trên VPS thật, những cú hỏng tương đương là timer bị tắt, lần gia hạn nào cũng hỏng (cổng 80 đóng, một lệnh chuyển hướng nuốt mất <code>/.well-known</code>), hoặc gia hạn thành công mà không nạp lại nginx (Chương 12.2). <strong>Cứu:</strong> gia hạn tay kèm deploy hook — ở đây chứng chỉ quay lại sau 2,7 s và người canh báo <code>SAP -&gt; LEN (ma 200, chung chi con 89 ngay)</code>. <strong>Phòng:</strong> <code>systemctl list-timers certbot.timer</code> ngay Ngày 1; <code>certbot renew --dry-run</code> sau mọi lần sửa nginx; và một phép kiểm từ ngoài với <code>-checkend</code> báo trước nhiều ngày, không phải vài phút.</p>
<p>(Ghi chú lab: Pebble giữ tài khoản trong bộ nhớ, nên sau khi khởi động lại, tài khoản certbot đã lưu trở thành xa lạ — <code>accountDoesNotExist</code> — và phải đăng ký lại. Let's Encrypt không quên tài khoản; bạn sẽ không gặp cảnh này trên production.)</p>

<h3>Sự cố 5 — "deploy thành công", ảnh cũ vẫn đang chạy</h3>
${slide('dv-15', 26, 'Sự cố 5–6: --no-build · bind-mount theo inode')}
<p><strong>Chuyện thật (02/07):</strong> một lần deploy <code>--no-build</code> rsync mã mới lên mà không build lại, nên container vẫn chạy ảnh cũ và một route mới trả 404. Dựng lại bằng compose trên VPS: bản 1 của một app tí hon, rồi thêm route mới <code>/api/bac-si</code> vào mã:</p>
<div class="out">$ docker compose up -d --no-build
 Container su-co-5-api-1  Running
/api/version -&gt; 200
/api/bac-si -&gt; 404
anh dang chay tao luc 2026-09-29T10:05:38.306
app.js sua luc 2026-09-29 10:05:39.
$ docker compose up -d --build
 Container su-co-5-api-1  Started
/api/version -&gt; 200
/api/bac-si -&gt; 200</div>
<p><code>Running</code> — compose không thấy gì cần đổi, vì với <code>--no-build</code> thì ảnh là cái đã build từ trước. <strong>Chẩn đoán</strong> bằng cách so thời điểm: ảnh tạo lúc 10:05:38, mã sửa lúc 10:05:39. Một 404 ở route vừa thêm nghĩa là "mã cũ", còn 401 hay 200 nghĩa là "route có tồn tại" (smoke-test của dự án dùng đúng luật này). <strong>Phòng:</strong> build ở chỗ khác và deploy theo tag (tag không thể cũ — nó chính là tên commit), và smoke-test <code>/api/version</code> so với đúng tag vừa đẩy.</p>

<h3>Sự cố 6 — tệp cấu hình mà nginx không bao giờ thấy</h3>
<p><strong>Chuyện thật (23–25/08):</strong> nginx.conf là bind-mount một tệp đơn; thay nó bằng <code>mv</code> cho máy chủ một inode mới trong khi container vẫn giữ inode cũ; <code>nginx -t</code> và reload đều thành công — trên cấu hình cũ. Dựng lại bằng một container nginx và header <code>X-Ban</code> ("bản"):</p>
<div class="out">X-Ban: 1
$ sed -i 's/X-Ban "1"/X-Ban "2"/' nginx.conf  &amp;&amp;  nginx -t  &amp;&amp;  nginx -s reload
inode truoc: 148365
inode sau sed -i: 149463
nginx: configuration file /etc/nginx/nginx.conf test is successful
X-Ban: 1
tren may:        X-Ban "2"   sha=60d52c9bf864
trong container: X-Ban "1"   sha=df715bd85d8a</div>
<p><code>sed -i</code> ghi một tệp mới rồi đổi tên đè lên tệp cũ — inode mới, y như <code>mv</code>, <code>rsync</code> và <code>:w</code> của vim. <strong>Chẩn đoán</strong> bằng cách so mã băm trên máy chủ và BÊN TRONG container; chúng khác nhau. <strong>Cứu:</strong> tạo lại container một lần để nó gắn đúng inode hiện tại. <strong>Phòng:</strong> từ đó về sau, sửa tệp TẠI CHỖ để giữ inode:</p>
<div class="out">$ cat /tmp/moi.conf &gt; nginx.conf    # inode giu nguyen
inode sau cat &gt;: 149463
nginx: configuration file /etc/nginx/nginx.conf test is successful
X-Ban: 3</div>
<p>…hoặc gắn cả THƯ MỤC, không gắn tệp. <code>phat-hanh.sh</code> ghi tệp upstream bằng <code>cat &gt;</code> vì chính lý do này, dù nginx của nó chạy thẳng trên máy chủ.</p>

<h3>Sự cố 7 — hai lần phát hành cùng lúc</h3>
${slide('dv-15', 27, 'Sự cố 7–8: chạy chồng · migration kẹt khoá')}
<p>Gỡ khoá khỏi một bản sao của <code>phat-hanh.sh</code>, rồi khởi động hai lần phát hành cách nhau một giây, trong lúc vps2 đếm:</p>
<div class="out">2026-09-29T09:51:58 85065be bat-dau mau=lam
2026-09-29T09:51:59 3c65eb7 bat-dau mau=lam
2026-09-29T09:52:02 85065be OK mau=lam
Error response from daemon: No such container: pk-xanh
2026-09-29T09:52:03 3c65eb7 HONG dong 67: docker stop -t 20 "pk-$cu" &gt; /dev/null
$ curl -s https://phongkham.test/api/version
{"ban":"3c65eb7"}
$ dem.sh 25        # tren dv15-vps2, cung luc
1000 request trong 25 s:
    988 200
     12 502</div>
<p>Cả hai lượt đều đọc <code>mau-dang-chay</code> trước khi lượt nào kịp ghi, nên cả hai cùng chọn lam. Lệnh <code>docker rm -f pk-lam</code> của lượt hai xoá mất container lượt một vừa dựng — 12 người dùng nhận 502 — rồi dựng container của nó. Lượt một kết thúc "OK" với một container đã không còn tồn tại; lượt hai chuyển nginx thành công rồi hỏng khi cố dừng một container xanh mà lượt một đã xoá. Kết quả: <strong>sổ ghi <code>85065be OK</code>, người dùng được phục vụ <code>3c65eb7</code></strong>, một bản mà chính sổ gọi là hỏng. Lần <code>lui</code> kế tiếp sẽ tính đích đến từ một lời nói dối. <strong>Cứu:</strong> phát hành lại đúng tag mong muốn, có khoá (<code>85065be OK mau=xanh</code> lúc 09:52:38), và ghi thêm một dòng vào sổ về chuyện đã xảy ra. <strong>Phòng:</strong> <code>flock</code> của 15.2 — và một người, một lần deploy, báo trước trong nhóm chat.</p>

<h3>Sự cố 8 — migration kẹt sau một cái khoá</h3>
<p>Một bạn mở <code>psql</code> trên máy chủ, bắt đầu một giao dịch để "xem dữ liệu" — <code>begin; select count(*) from lich_hen;</code> — rồi đi ăn trưa. Phiên đó giữ khoá ACCESS SHARE trên bảng. Lần phát hành kế tiếp thêm một cột; <code>ALTER TABLE</code> cần ACCESS EXCLUSIVE nên nó chờ — và mọi <code>select</code> bình thường tới sau nó phải xếp hàng sau lệnh ALTER (Chương 5.3). Đo với <code>lock_timeout</code> của migration đặt bằng 0 (chờ mãi):</p>
<table>
<tr><th>pid</th><th>bị chặn bởi</th><th>trạng thái</th><th>đang chờ</th><th>đã chờ</th><th>câu lệnh</th></tr>
<tr><td>442</td><td>{}</td><td>idle in transaction</td><td>Client</td><td>00:00:11.169675</td><td><code>select count(*) from lich_hen;</code></td></tr>
<tr><td>446</td><td>{442}</td><td>active</td><td>Lock</td><td>00:00:07.791297</td><td>lệnh ALTER TABLE</td></tr>
<tr><td>445</td><td>{446}</td><td>active</td><td>Lock</td><td>00:00:07.783704</td><td><code>select …</code> của API</td></tr>
<tr><td>448</td><td>{446}</td><td>active</td><td>Lock</td><td>00:00:04.759105</td><td><code>select …</code> của API</td></tr>
</table>
<p>(Từ <code>select pid, pg_blocking_pids(pid), state, wait_event_type, now()-query_start, left(query,38) from pg_stat_activity …</code>, chụp ở giây thứ 8 của lúc chờ.) Chuỗi tự đọc được: 442 chặn 446, 446 chặn API. Request của người dùng treo và bỏ cuộc ở trần 3 giây của client. <strong>Cứu:</strong> kết thúc phiên bị bỏ quên:</p>
<div class="out">$ select pg_terminate_backend(442);
t
migration 006_chi_nhanh.sql xong (14050 ms)
$ dem.sh 30        # tren dv15-vps2, cung luc
624 request trong 30 s:
      4 000
    620 200
  cham hon 1 s: 5 · lau nhat: 3.01 s</div>
<p><strong>Phòng:</strong> chính <code>lock_timeout = '5s'</code> mà <code>migrate.js</code> đặt mặc định. Cùng tình huống, có nó:</p>
<div class="out">2026-09-29T09:50:30 85065be bat-dau mau=lam
migration 006_chi_nhanh.sql HONG: canceling statement due to lock timeout
deploy: HONG o dong 19: $VPS_SSH "sudo /opt/phongkham/bin/phat-hanh.sh $TAG"
$ dem.sh 20        # tren dv15-vps2, cung luc
575 request trong 20 s:
      1 000
    574 200
  cham hon 1 s: 2 · lau nhat: 3.01 s</div>
<p>Migration bỏ cuộc sau 5 s, lần phát hành dừng trước khi dựng bất kỳ container mới nào, và bản cũ vẫn phục vụ; một request hết giờ trong năm giây đó thay vì mọi request suốt bữa trưa. Sau đó tìm kẻ chặn, kết thúc nó, rồi phát hành lại. Lần chạy này còn cho thêm hai bài học: sổ phát hành chỉ có <code>bat-dau</code> cho nó, vì script chết ở <code>node migrate.js</code> dưới <code>set -e</code> trước khi kịp ghi gì — nên giờ <code>phat-hanh.sh</code> có <code>trap … ERR</code> ghi <code>HONG</code> kèm số dòng. Và lần đầu cố dựng sự cố này đã "thành công" mà chẳng chờ gì cả: phiên bị bỏ quên được mở qua một cái ống đã đóng, nên nó commit xong trước khi lần deploy bắt đầu. Hãy kiểm rằng bản dựng lại của bạn thật sự dựng lại được.</p>

<h3>Ghi lại: một bản postmortem năm dòng</h3>
<p>Sau mỗi sự cố, năm dòng trong <code>INCIDENTS.md</code> — đúng khuôn mà khoá học dùng cho lịch sử của dự án thật:</p>
<pre><code>2026-09-29 09:52 · Hai lan phat hanh chong nhau (su co 7)
Trieu chung: so ghi 85065be OK, cua truoc tra 3c65eb7; 12 × 502 trong 1 s
Nguyen nhan: phat-hanh.sh chay khong co flock; ca hai doc mau-dang-chay truoc khi ai ghi
Cuu: phat hanh lai 85065be co khoa (09:52:38), ghi chu vao so
Phong: flock -n + ma thoat 3; moi lan deploy bao trong nhom chat</code></pre>
<p>Không đổ lỗi, mỗi ý một dòng, và dòng "phòng" phải là một thay đổi, không phải một ý định.</p>

<h3>Chạy thử từng bước: dựng lại một sự cố một cách an toàn</h3>
<ul>
<li>Mọi sự cố ở đây đều được dựng trên VPS thí nghiệm hoặc trên vps2, không bao giờ trên một máy có người đang dùng. Sự cố đĩa đầy dùng một tệp 1,5 GB gắn làm thiết bị loop và một thư mục dữ liệu Docker riêng, nên đĩa Docker thật không hề bị đe doạ.</li>
<li>Mỗi lần chỉ đổi một thứ, và ghi sẵn lệnh để gỡ TRƯỚC khi chạy lệnh làm hỏng.</li>
<li>Đo từ bên ngoài trong lúc làm hỏng: <code>dem.sh</code> trên một máy khác biến mỗi sự cố thành một con số request hỏng.</li>
<li>Dựng cú hỏng, rồi dựng cả biện pháp phòng và cho thấy cùng tình huống đó không còn gây đau (sự cố 1, 2, 7 và 8 ở trên).</li>
</ul>

<h3>Trên Windows/WSL và macOS khác gì</h3>
<ul>
<li><strong>Docker Desktop trên laptop che mất vài sự cố:</strong> publish cổng đi qua máy ảo của Docker Desktop và một proxy chạy ở không gian người dùng, nên sự cố 3 trông khác ở đó; hãy dựng lại trên một máy ảo Linux hoặc trên VPS thí nghiệm.</li>
<li><strong>Đĩa đầy trên macOS/Windows</strong> đụng tới ổ đĩa ảo của Docker Desktop trước — <code>docker system df</code> vẫn là lệnh đầu tiên, và phần cài đặt của Docker Desktop cho thấy kích thước ổ ảo.</li>
<li><strong>Bind-mount từ Windows</strong> vào container đi qua một lớp chia sẻ tệp; trình soạn thảo ở đó cũng thay tệp chứ không ghi đè, nên sự cố 6 xảy ra cả trên laptop.</li>
</ul>

<h3>Khi nào dùng sổ tay này</h3>
<ul>
<li><strong>Dùng</strong> cho những tuần đầu của mọi dịch vụ production nhỏ, và làm danh sách kiểm khi bạn tiếp quản một dịch vụ như vậy.</li>
<li><strong>Lớn dần ra khỏi nó</strong> khi có nhiều dịch vụ: xử lý sự cố lúc đó cần lịch trực, dashboard và định tuyến cảnh báo — nguyên tắc (chẩn đoán từ chữ ký, kiểm từ bên ngoài, ghi lại) vẫn như cũ.</li>
<li><strong>Không bao giờ</strong> dựng sự cố trên một máy có người dùng thật. Cả ý nghĩa của phòng thí nghiệm là làm hỏng nó chẳng tốn gì.</li>
</ul>

<div class="pitfall co-tieu-de"><strong>Bẫy — tin chữ "OK" trong bất kỳ log nào.</strong> Bốn trên tám sự cố có một chữ OK hay một màu xanh ở đâu đó: bản build (1), <code>docker compose up</code> (5), <code>nginx -t</code> (6), sổ phát hành (7). Chữ OK nào cũng đúng về đúng thứ nó đo — build đã xong, container đang chạy, tệp trên đĩa hợp lệ, một script đã chạy hết — và sai về thứ người dùng nhận được. Chữ OK duy nhất có giá trị là chữ OK đo từ chỗ người dùng đứng.</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Chọn hai trong tám sự cố, một thuộc loại "build/ảnh" (1, 5, 6) và một thuộc loại "hệ thống đang chạy" (2, 3, 4, 7, 8).</li>
<li>Dựng từng cái trên phòng thí nghiệm, với <code>dem.sh</code> chạy trên một máy khác, và ghi lại triệu chứng đúng nguyên văn.</li>
<li>Chẩn đoán bằng lệnh đầu tiên trong bảng, cứu, rồi dựng biện pháp phòng và cho thấy tình huống đó không còn gây đau.</li>
<li>Viết một bản postmortem năm dòng cho mỗi cái.</li>
</ol>
<p><strong>Đạt khi:</strong> với mỗi sự cố bạn có nguyên văn triệu chứng, output chẩn đoán, số request hỏng trước và sau biện pháp phòng, và một bản postmortem năm dòng mà dòng cuối là một thay đổi bạn đã làm.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">runbook (sổ tay vận hành)</span><span class="v">Quy trình một trang làm theo ở mọi lần deploy, viết cho một người đang mệt lúc nửa đêm.</span></div>
  <div class="kv"><span class="k">incident (sự cố)</span><span class="v">Bất cứ thứ gì khiến người dùng nhận lỗi hay kết quả sai; xử lý theo triệu chứng → chẩn đoán → cứu → phòng.</span></div>
  <div class="kv"><span class="k">postmortem (bản rút kinh nghiệm)</span><span class="v">Bản ghi ngắn, không đổ lỗi, sau một sự cố: chuyện gì, vì sao, cứu thế nào, đổi gì.</span></div>
  <div class="kv"><span class="k">libc (glibc / musl)</span><span class="v">Thư viện C nằm dưới mọi chương trình; module native dựng cho loại này không nạp được trên loại kia.</span></div>
  <div class="kv"><span class="k">bind mount một tệp (gắn tệp từ máy chủ)</span><span class="v">Tệp của máy chủ gắn vào container theo inode; thay tệp trên máy chủ thì bên trong không thấy.</span></div>
  <div class="kv"><span class="k"><code>pg_blocking_pids()</code></span><span class="v">Hàm PostgreSQL liệt kê những phiên đang chặn một phiên — chuỗi đứng sau một lần treo.</span></div>
  <div class="kv"><span class="k">idle in transaction (rảnh trong giao dịch)</span><span class="v">Phiên đã mở giao dịch và không làm gì — trong khi vẫn giữ các khoá của nó.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Deploy theo runbook một trang: trước thì kiểm đĩa, bản sao lưu và loại migration; trong lúc thì một lệnh; sau thì kiểm từ bên ngoài.</li>
<li>Sự cố nào cũng đi theo triệu chứng → lệnh đầu tiên → cứu → phòng → chương, và kết thúc bằng một bản postmortem năm dòng.</li>
<li>Về ảnh: kiểm libc và thư viện bên trong ảnh trước khi đẩy (1); deploy theo tag, không <code>--no-build</code> (5); sửa tệp bind-mount tại chỗ (6).</li>
<li>Về hệ thống đang chạy: không build trên máy chủ, xoay vòng log (2); không publish CSDL (3); nghiệm thu việc gia hạn và canh hạn chứng chỉ từ ngoài (4).</li>
<li>Về phát hành: mỗi lúc một lần, có khoá (7); migration có <code>lock_timeout</code>, tìm kẻ chặn bằng <code>pg_blocking_pids()</code> (8).</li>
<li>Chữ OK trong log đúng về thứ nó đo; chỉ một phép đo từ chỗ người dùng đứng mới nói trang còn chạy.</li>
</ul>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker — JSON File logging driver</span><span class="lc-sub">docs.docker.com/engine/logging/drivers/json-file/ — <code>max-size</code>, <code>max-file</code>, và khi nào chúng có hiệu lực.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker — docker system df</span><span class="lc-sub">docs.docker.com/reference/cli/docker/system/df/ — ai đang dùng đĩa.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker — Bind mounts</span><span class="lc-sub">docs.docker.com/engine/storage/bind-mounts/ — gắn tệp và thư mục từ máy chủ.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — Khoá tường minh</span><span class="lc-sub">postgresql.org/docs/16/explicit-locking.html — lệnh nào lấy khoá nào, và hàng đợi sau ACCESS EXCLUSIVE.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — Hàm thông tin hệ thống</span><span class="lc-sub">postgresql.org/docs/16/functions-info.html — <code>pg_blocking_pids()</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google SRE Book — Postmortem culture</span><span class="lc-sub">sre.google/sre-book/postmortem-culture/ — bản rút kinh nghiệm không đổ lỗi và phải đổi được điều gì đó.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — Bài 16.4: tám sự cố tuần đầu trên máy chủ</span><span class="lc-sub">/courses/linux-bash/learn${REF} — phía hệ điều hành: đĩa, bộ nhớ, cổng, quyền, timer, CRLF.</span></span></div>
</div>
`,
    },
    /* ─────────────────────────── 15.5 ─────────────────────────── */
    {
      title: "15.5 — Final exam of the course|||15.5 — Bài thi cuối khoá",
      slug: "deploy-15-5-kiem-tra-cuoi-khoa",
      type: "QUIZ",
      isFreePreview: true,
      description: "Bài thi cuối khoá 20 câu tình huống trải từ Mục 0 tới Chương 15 — phần lớn là \"bước nào hỏng?\" và \"lệnh nào kiểm?\" — kèm lời dặn và danh sách năng lực của cả khoá.",
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Final exam</span>
<h2>Final exam of the course</h2>
<p class="lead">Twenty questions across the whole course, from the four steps of Mục 0 to the capstone of this chapter. Most are situations — "which step broke?", "which command tells you?", "why did the green check lie?" — because that is what deploying asks of you at 2 a.m. Every number in the answers was measured on a lab server: in the chapter where it was taught, or in this chapter's capstone on 29/09/2026. You have 30 minutes.</p>
<h3>Before you start</h3>
<ul>
<li>Read the whole situation before the options. Most wrong answers are right for a <em>slightly different</em> situation: a 502 in 5 ms is not a 504 at 60 s, a certificate on disk is not the certificate on the wire.</li>
<li>When a question quotes output, trust the output over your memory of how a tool "usually" behaves — several questions turn on exactly that difference.</li>
<li>Do not open a terminal during the exam. Afterwards, rebuild every question you missed on the lab (a container VPS is enough) — that is when the knowledge sticks.</li>
<li>Each explanation says why the right answer is right <em>and</em> why the most tempting wrong one is wrong, with the lesson to revisit.</li>
</ul>
<h3>Self-check before you start</h3>
<ul>
<li>I can name the four steps of a deploy and say which one broke from a symptom, and I make every server report the commit it runs.</li>
<li>I ship only committed code as one artifact, swap it without dropping requests, and keep configuration and secrets outside it — knowing which values are fixed at build time.</li>
<li>I change a database schema with expand/contract, give migrations a lock timeout, and know when a rollback is no longer possible.</li>
<li>I write deploy scripts that stop on failure, refuse to run twice at once, and prove the result through the front door; I roll back in seconds.</li>
<li>I keep a small VPS alive: no builds on it, rotated logs, only three ports, HTTPS renewed and checked from outside, backups restored against a stopwatch on another machine.</li>
<li>I diagnose from the signature of a failure (status code, time, first command) and write a five-line postmortem that changes something.</li>
</ul>
${slide('dv-15', 32, 'Cả khoá trong một dự án')}
${slide('dv-15', 29, 'Bảng tra nhanh Chương 15 (1/2): dựng máy và phát hành')}
${slide('dv-15', 30, 'Bảng tra nhanh Chương 15 (2/2): sao lưu, canh và sự cố')}
<h3>What you can do after this course</h3>
<p>You can take a bare server and an application and put the application on the Internet under a name, over HTTPS, behind a firewall — and then change it every day without users noticing, go back when a change is wrong, get the data back when the machine dies, and hear about problems before your users tell you. That is the everyday work behind the words "backend", "DevOps" and "SRE", and behind every student project that has to survive its demo. The next steps on this site build directly on it: containers in depth (the Docker course), pipelines that call your release script (the GitHub Actions course), nginx in depth (the nginx course), and the operating system underneath all of it (the Linux &amp; Bash course).</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài thi cuối khoá</span>
<h2>Bài thi cuối khoá</h2>
<p class="lead">Hai mươi câu trải khắp cả khoá, từ bốn bước của Mục 0 tới dự án cuối khoá của chương này. Phần lớn là tình huống — "bước nào hỏng?", "lệnh nào cho bạn biết?", "vì sao phép kiểm xanh lại nói dối?" — vì đó chính là thứ việc deploy đòi ở bạn lúc 2 giờ sáng. Mọi con số trong đáp án đều đo trên máy chủ thí nghiệm: ở chương dạy nó, hoặc ở dự án cuối khoá của chương này ngày 29/09/2026. Bạn có 30 phút.</p>
<h3>Lời dặn trước khi làm</h3>
<ul>
<li>Đọc hết tình huống rồi mới đọc phương án. Phần lớn đáp án sai là đúng cho một tình huống <em>hơi khác</em>: 502 trong 5 ms không phải 504 sau 60 s, chứng chỉ trên đĩa không phải chứng chỉ trên dây.</li>
<li>Khi câu hỏi có trích output, hãy tin output hơn trí nhớ của bạn về cách công cụ "thường" chạy — vài câu xoay quanh đúng chỗ khác nhau đó.</li>
<li>Không mở terminal trong lúc thi. Làm xong, dựng lại mọi câu mình sai trên phòng thí nghiệm (một VPS bằng container là đủ) — đó là lúc kiến thức bám lại.</li>
<li>Mỗi lời giải thích nói vì sao đáp án đúng là đúng <em>và</em> vì sao phương án hấp dẫn nhất lại sai, kèm bài nên xem lại.</li>
</ul>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi gọi tên được bốn bước của một lần deploy và nói được bước nào hỏng từ một triệu chứng, và tôi bắt mọi máy chủ tự khai commit nó đang chạy.</li>
<li>Tôi chỉ ship mã đã commit thành một tạo tác, tráo nó mà không rơi request, và giữ cấu hình, bí mật ở ngoài nó — biết giá trị nào bị chốt lúc dựng.</li>
<li>Tôi đổi lược đồ CSDL bằng mở rộng/thu hẹp, đặt trần chờ khoá cho migration, và biết lúc nào đường lùi đã không còn.</li>
<li>Tôi viết script deploy dừng khi hỏng, từ chối chạy hai lần cùng lúc, và chứng minh kết quả qua cửa trước; tôi lùi bản trong vài giây.</li>
<li>Tôi giữ một VPS nhỏ sống khoẻ: không build trên nó, log xoay vòng, chỉ ba cổng, HTTPS được gia hạn và canh từ ngoài, bản sao lưu được phục hồi bấm giờ trên một máy khác.</li>
<li>Tôi chẩn đoán từ chữ ký của cú hỏng (mã trạng thái, thời gian, lệnh đầu tiên) và viết một bản postmortem năm dòng có đổi được điều gì đó.</li>
</ul>
${slide('dv-15', 32, 'Cả khoá trong một dự án')}
${slide('dv-15', 29, 'Bảng tra nhanh Chương 15 (1/2): dựng máy và phát hành')}
${slide('dv-15', 30, 'Bảng tra nhanh Chương 15 (2/2): sao lưu, canh và sự cố')}
<h3>Học xong khoá này bạn làm được gì</h3>
<p>Bạn nhận một máy chủ trần và một ứng dụng, rồi đưa ứng dụng ra Internet dưới một cái tên, qua HTTPS, sau một bức tường lửa — và sau đó đổi nó mỗi ngày mà người dùng không nhận ra, quay về khi một thay đổi sai, lấy lại dữ liệu khi cái máy chết, và nghe tin sự cố trước khi người dùng kịp báo. Đó là công việc hằng ngày đứng sau các chữ "backend", "DevOps" và "SRE", và đứng sau mọi đồ án sinh viên phải sống sót qua buổi demo. Các bước tiếp theo trên trang này xây thẳng lên nền đó: container chuyên sâu (khoá Docker), đường ống gọi script phát hành của bạn (khoá GitHub Actions), nginx chuyên sâu (khoá nginx), và hệ điều hành nằm dưới tất cả (khoá Linux &amp; Bash).</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 1800,
        questions: [
          {
            question: "Your team reports \"the deploy failed\". The new files are on the server and the process restarted, but the homepage still shows yesterday’s text. Using the four steps of every deploy, which step is the first to question?|||Nhóm báo \"deploy hỏng\". Tệp mới đã nằm trên máy chủ và tiến trình đã khởi động lại, nhưng trang chủ vẫn hiện chữ của hôm qua. Theo bốn bước của mọi lần deploy, bước nào cần nghi ngờ trước tiên?",
            options: [
              "Transport — some files probably did not reach the server intact; resend them all|||Vận chuyển — chắc có tệp chưa tới máy chủ trọn vẹn; gửi lại toàn bộ",
              "Swap — the running process may still be serving the old artifact; then prove it from outside|||Tráo — tiến trình đang chạy có thể vẫn phục vụ tạo tác cũ; rồi chứng minh từ bên ngoài",
              "Build — the artifact must have been built from the wrong branch; rebuild first|||Dựng — tạo tác hẳn đã dựng từ nhầm nhánh; dựng lại trước đã",
              "None — the browser cache explains it; nothing on the server needs checking|||Không bước nào — bộ đệm trình duyệt giải thích hết; không cần kiểm gì trên máy chủ",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: The four steps are build an artifact, transport it, swap it in, and prove it runs. Files present and a restart done put transport behind you; \"old text is served\" is a swap or proof question — which artifact is the process actually running, as reported by the server itself (Lesson 1.4) and checked through the front door. Blaming the browser skips the proof step, which is exactly the habit Mục 0 is written against.|||VI: Bốn bước là dựng tạo tác, vận chuyển, tráo vào, và chứng minh nó chạy. Tệp đã có và tiến trình đã khởi động lại nghĩa là bước vận chuyển đã qua; \"vẫn phục vụ chữ cũ\" là câu hỏi của bước tráo hoặc bước chứng minh — tiến trình THẬT SỰ đang chạy tạo tác nào, do chính máy chủ khai (Bài 1.4) và kiểm qua cửa trước. Đổ cho trình duyệt là bỏ qua bước chứng minh, đúng thói quen mà Mục 0 viết ra để chống lại.",
          },
          {
            question: "Two servers should run \"the same version\". Which check actually proves it?|||Hai máy chủ lẽ ra đang chạy \"cùng một phiên bản\". Phép kiểm nào thật sự chứng minh được điều đó?",
            options: [
              "Both have a release folder named after today’s date and the same file count|||Cả hai có thư mục bản phát hành đặt tên theo ngày hôm nay và cùng số tệp",
              "Both deploy logs say \"deploy OK\" at the same minute|||Log deploy của cả hai đều ghi \"deploy OK\" cùng một phút",
              "The same person deployed both from the same laptop, one right after the other|||Cùng một người deploy cả hai từ cùng một laptop, cái này ngay sau cái kia",
              "Each server reports the commit (or image digest) it is running, and the two match|||Mỗi máy tự khai commit (hoặc digest của ảnh) nó đang chạy, và hai giá trị trùng nhau",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: Chapter 1 makes the artifact a function of a commit and makes the server say which one it runs — in this chapter, /api/version returns the tag baked in at build time. A matching log line only proves a script finished; Chapter 1.4 even measured a prepared answer being confidently wrong, which is why the value must come from the running process.|||VI: Chương 1 biến tạo tác thành một hàm của commit và bắt máy chủ tự khai nó đang chạy commit nào — trong chương này, /api/version trả về tag được nạp lúc dựng. Hai dòng log trùng nhau chỉ chứng minh một script đã chạy xong; Chương 1.4 còn đo được một câu trả lời soạn sẵn sai một cách rất tự tin, nên giá trị phải đến từ chính tiến trình đang chạy.",
          },
          {
            question: "A teammate deploys with rsync while still editing a file; the laptop sleeps half-way through the transfer. What is the most likely state of the server, and which transport avoids both problems?|||Một bạn deploy bằng rsync trong lúc vẫn đang sửa một tệp; laptop ngủ giữa chừng lúc đang chuyển. Máy chủ nhiều khả năng ở trạng thái nào, và đường vận chuyển nào tránh được cả hai vấn đề?",
            options: [
              "A mix of old and new files; ship an image or git archive of a commit instead|||Trộn tệp cũ với tệp mới; thay bằng ảnh hoặc git archive của một commit",
              "Nothing changed, because rsync renames the whole tree only at the very end|||Không có gì đổi, vì rsync chỉ đổi tên cả cây vào đúng lúc cuối",
              "The old version, because rsync rolls back automatically when interrupted|||Bản cũ, vì rsync tự lùi lại khi bị cắt ngang",
              "The new version, because rsync resumes by itself when the laptop wakes up|||Bản mới, vì rsync tự chạy tiếp khi laptop thức dậy",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: Chapter 2.1 measured an interrupted rsync leaving 310 files from one release and 90 from the other: rsync renames each file as it finishes it, not the tree at the end, and it never rolls back. It also copies whatever is on disk, saved or not. git push, git archive and images carry only committed content, and an image is swapped as one unit — the reason Lesson 15.2 builds from git archive HEAD.|||VI: Chương 2.1 đã đo một lệnh rsync bị cắt ngang để lại 310 tệp của bản này và 90 tệp của bản kia: rsync đổi tên từng tệp khi xong tệp đó, không đổi cả cây vào lúc cuối, và nó không bao giờ tự lùi. Nó cũng chép bất cứ thứ gì đang nằm trên đĩa, đã lưu xong hay chưa. git push, git archive và ảnh chỉ mang nội dung đã commit, và ảnh được tráo nguyên một khối — lý do Bài 15.2 dựng từ git archive HEAD.",
          },
          {
            question: "Under constant load, which order of steps swaps a version without failed requests?|||Dưới tải liên tục, thứ tự nào tráo phiên bản mà không có request hỏng?",
            options: [
              "Stop the old process, start the new one, wait for health, point the proxy at it|||Dừng tiến trình cũ, khởi động bản mới, chờ health, trỏ proxy sang nó",
              "Point the proxy at the new port, then start the new process, then stop the old one|||Trỏ proxy sang cổng mới, rồi khởi động tiến trình mới, rồi dừng bản cũ",
              "Start the new one beside the old, wait until it answers, switch, drain the old|||Khởi động bản mới cạnh bản cũ, chờ nó trả lời, chuyển proxy, xả bản cũ",
              "Restart the process in place with SIGHUP; Node reloads its code without dropping connections|||Khởi động lại tại chỗ bằng SIGHUP; Node nạp lại mã mà không làm rơi kết nối",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: Chapter 3 measured the naive stop-then-start at 168 failed requests out of 514, and the same deploy with the four steps in this order at zero. Lesson 15.2 does exactly this with two containers behind nginx and measured 917 of 917 requests answered 200. Pointing the proxy first sends users to a port nobody listens on yet; Node does not reload code on SIGHUP.|||VI: Chương 3 đo cách ngây thơ dừng-rồi-khởi-động là 168 request hỏng trên 514, còn cùng lần deploy đó với bốn bước theo thứ tự này là 0. Bài 15.2 làm đúng như vậy với hai container sau nginx và đo được 917 trên 917 request trả 200. Trỏ proxy trước là gửi người dùng tới một cổng chưa ai nghe; Node không nạp lại mã khi nhận SIGHUP.",
          },
          {
            question: "You change NEXT_PUBLIC_API_URL in the VPS’s .env and restart the frontend container. The browser still calls the old URL. Why?|||Bạn đổi NEXT_PUBLIC_API_URL trong tệp .env trên VPS rồi khởi động lại container frontend. Trình duyệt vẫn gọi URL cũ. Vì sao?",
            options: [
              "Docker caches environment variables until the host reboots|||Docker đệm biến môi trường cho tới khi máy chủ khởi động lại",
              "The .env file needs a trailing newline or the last line is ignored by every loader|||Tệp .env cần dòng trống cuối, không thì mọi bộ nạp đều bỏ qua dòng cuối",
              "NEXT_PUBLIC_* is baked into the bundle at build time; it needs a rebuild|||NEXT_PUBLIC_* được nướng vào gói JS lúc DỰNG; phải dựng lại",
              "The browser keeps the old environment variables in localStorage|||Trình duyệt vẫn giữ biến môi trường cũ trong localStorage",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: Chapter 4.2: some configuration is read when the process starts, some is written into files during the build and never changes afterwards — they look identical in the source. NEXT_PUBLIC_* are the second kind, which is also why third-party keys must never be NEXT_PUBLIC_*. A restart re-reads runtime configuration only. (Chapter 4.3 did measure .env loaders disagreeing, but not about a trailing newline on every loader.)|||VI: Chương 4.2: có cấu hình được đọc lúc tiến trình khởi động, có cấu hình được viết thẳng vào tệp lúc dựng và sau đó không đổi được nữa — trong mã chúng trông y hệt nhau. NEXT_PUBLIC_* thuộc loại thứ hai, cũng là lý do khoá của bên thứ ba không bao giờ được là NEXT_PUBLIC_*. Khởi động lại chỉ đọc lại cấu hình lúc chạy. (Chương 4.3 có đo các bộ nạp .env bất đồng, nhưng không phải chuyện dòng trống cuối ở mọi bộ nạp.)",
          },
          {
            question: "You must rename column ten_benh_nhan to ho_ten on a live table, keeping rollback possible. Which plan?|||Bạn phải đổi tên cột ten_benh_nhan thành ho_ten trên một bảng đang phục vụ, mà vẫn giữ được đường lùi. Kế hoạch nào?",
            options: [
              "Add ho_ten and write both; then use only ho_ten; drop the old column later|||Thêm ho_ten, ghi cả hai; rồi chỉ dùng ho_ten; về sau mới xoá cột cũ",
              "One release: ALTER TABLE … RENAME COLUMN together with the code change, since a rename is instant|||Một lần: ALTER TABLE … RENAME COLUMN cùng lúc với đổi mã, vì đổi tên diễn ra tức thì",
              "One release: add ho_ten and drop ten_benh_nhan in the same migration, then deploy the new code|||Một lần: thêm ho_ten và xoá ten_benh_nhan trong cùng một migration, rồi deploy mã mới",
              "Stop the site for maintenance, rename, deploy; a rename needs no rollback|||Dừng trang để bảo trì, đổi tên, deploy; đổi tên không cần đường lùi",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: Expand, migrate the code, then contract (Chapter 5.2). Lesson 15.3 measured the alternative: dropping the column in the same release as the code change cost 47 × 500 while the release log said OK — the migration runs before the switch, so the old version still serving broke — and the rollback was then refused (\"column ten_benh_nhan does not exist\"). An instant RENAME has the same problem: the running code still uses the old name.|||VI: Mở rộng, chuyển mã, rồi thu hẹp (Chương 5.2). Bài 15.3 đã đo cách còn lại: xoá cột trong cùng lần phát hành với đổi mã tốn 47 × 500 trong khi sổ ghi OK — migration chạy trước lúc tráo, nên bản cũ đang phục vụ bị hỏng — và sau đó lần lùi bị từ chối (\"column ten_benh_nhan does not exist\"). RENAME tức thì cũng mắc đúng lỗi đó: đoạn mã đang chạy vẫn dùng tên cũ.",
          },
          {
            question: "After a rollback, the script prints ✓: the symlink moved, the process restarted, /health returns 200. What is still missing before you can say the rollback worked?|||Sau một lần lùi, script in ✓: symlink đã dời, tiến trình đã khởi động lại, /health trả 200. Còn thiếu gì trước khi bạn được nói lần lùi đã thành công?",
            options: [
              "Nothing; a 200 from /health after a restart is the definition of a working rollback|||Không thiếu gì; /health trả 200 sau khi khởi động lại chính là định nghĩa của một lần lùi thành công",
              "A second rollback, to be sure the first one was not served from a cache|||Lùi thêm lần nữa, cho chắc lần đầu không bị phục vụ từ bộ đệm",
              "Deleting the broken release from the server so it can never come back|||Xoá bản hỏng khỏi máy chủ để nó không bao giờ quay lại được",
              "Proof at the front door: the old version answers and a real request works|||Chứng minh ở cửa trước: đúng bản cũ trả lời và một request thật chạy được",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: Chapter 6.2 is \"the rollback that lies\": pointer moved, process restarted, health 200, every real request 500. Chapter 6.5 adds the case where the app says yes while users still get the version you rolled back from. Lesson 15.2 measured the same with a health check that only runs select 1: green in 2 s while the page returned 500. Deleting the bad release also deletes your evidence.|||VI: Chương 6.2 là \"cú lùi nói dối\": con trỏ đã dời, tiến trình đã khởi động lại, health 200, mọi request thật 500. Chương 6.5 thêm trường hợp ứng dụng nói có trong khi người dùng vẫn nhận đúng bản bạn vừa lùi đi. Bài 15.2 đo đúng điều đó với một health chỉ chạy select 1: xanh sau 2 s trong khi trang trả 500. Xoá bản hỏng cũng là xoá bằng chứng của bạn.",
          },
          {
            question: "A deploy script has set -Eeuo pipefail and the line: visudo -cqf new && install -m 440 new /etc/sudoers.d/app && echo ok. visudo is not installed. What happens?|||Một script deploy có set -Eeuo pipefail và dòng: visudo -cqf new && install -m 440 new /etc/sudoers.d/app && echo ok. Máy không có visudo. Chuyện gì xảy ra?",
            options: [
              "The script stops at that line with exit code 127, because set -e catches every failing command|||Script dừng ở dòng đó với mã 127, vì set -e bắt mọi lệnh hỏng",
              "The chain stops, nothing is installed, and the script continues to the next line as if nothing happened|||Chuỗi dừng, không cài gì cả, và script chạy tiếp sang dòng sau như không có gì xảy ra",
              "install runs anyway, because && only checks the exit code of the last command|||install vẫn chạy, vì && chỉ xét mã thoát của lệnh cuối",
              "Bash prints a warning and retries visudo from /usr/sbin before going on|||Bash in cảnh báo rồi thử lại visudo từ /usr/sbin trước khi đi tiếp",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: The Bash manual: set -e does not exit when the failing command is part of an && or || list, except the command after the final &&. Lesson 15.1 measured it — \"visudo: command not found\", then \"✓ sshd …\" on the next line — and the deploy user was left with no sudoers line. A check that must pass stands on its own line (Chapter 7.1 measured each flag).|||VI: Tài liệu Bash: set -e không thoát khi lệnh hỏng là một phần của danh sách && hoặc ||, trừ lệnh đứng sau && cuối cùng. Bài 15.1 đã đo — \"visudo: command not found\", rồi dòng sau là \"✓ sshd …\" — và người dùng deploy bị bỏ lại không có dòng sudoers nào. Phép kiểm bắt buộc phải qua thì đứng riêng một dòng (Chương 7.1 đo từng cờ).",
          },
          {
            question: "A container disappears during a deploy; docker inspect shows ExitCode 137 and the app wrote no error. What is the first thing to look at?|||Một container biến mất giữa lúc deploy; docker inspect báo ExitCode 137 và app không ghi lỗi nào. Nhìn gì trước tiên?",
            options: [
              "The kernel log (journalctl -k) for the OOM killer, and what used memory then|||Log của nhân (journalctl -k) tìm OOM killer, và thứ gì ăn bộ nhớ lúc đó",
              "The app’s own log file, since 137 is an application error code|||Tệp log của chính app, vì 137 là mã lỗi của ứng dụng",
              "The nginx error log, since 137 means the proxy closed the connection|||Log lỗi của nginx, vì 137 nghĩa là proxy đã đóng kết nối",
              "The registry, since 137 means the image digest did not match|||Registry, vì 137 nghĩa là digest của ảnh không khớp",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: 137 = 128 + 9: the process was killed with SIGKILL. The app cannot log it — it was removed, not asked to stop (Chapter 8.1) — and the kernel records who it killed and why. On a small VPS the usual cause is self-inflicted pressure such as next build on the serving machine (Chapter 8.5), which is why this project never builds on the VPS.|||VI: 137 = 128 + 9: tiến trình bị giết bằng SIGKILL. App không ghi log được — nó bị gỡ đi chứ không được yêu cầu dừng (Chương 8.1) — còn nhân hệ điều hành thì ghi lại nó đã giết ai và vì sao. Trên VPS nhỏ, nguyên nhân thường gặp là sức ép tự gây ra như chạy next build trên chính máy đang phục vụ (Chương 8.5), lý do dự án này không bao giờ build trên VPS.",
          },
          {
            question: "During a build on the VPS, the build fails with \"no space left on device\" and at the same second Postgres logs \"could not extend file\". The deploy has been aborted. What is the right recovery tonight?|||Trong lúc build trên VPS, bản build hỏng với \"no space left on device\" và cùng giây đó Postgres ghi \"could not extend file\". Lần deploy đã bị huỷ. Cứu thế nào là đúng ngay tối nay?",
            options: [
              "Restart Postgres first; its write errors disappear after a clean restart|||Khởi động lại Postgres trước; lỗi ghi hết sau một lần khởi động lại sạch",
              "Run docker system prune -a --volumes to free everything at once|||Chạy docker system prune -a --volumes để giải phóng mọi thứ trong một lần",
              "docker system df, remove exactly the leftovers, then check the DB writes again|||docker system df, xoá đúng phần thừa, rồi kiểm CSDL ghi lại được",
              "Delete the Postgres WAL directory, which is only a cache and grows fast|||Xoá thư mục WAL của Postgres, vốn chỉ là bộ đệm và phình rất nhanh",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: Lesson 15.4 rebuilt this: the database lost writes while the disk was full, and removing the failed build’s container and an unused image freed the disk (58%) and the database wrote again without a restart. A blanket prune with --volumes can delete the database’s own volume; deleting WAL corrupts the database. The prevention is not building on the server at all (Chapter 13.2).|||VI: Bài 15.4 đã dựng lại chuyện này: CSDL mất các lần ghi trong lúc đĩa đầy, và xoá container của lần build hỏng cùng một ảnh không dùng là giải phóng được đĩa (58%), CSDL ghi lại được mà không cần khởi động lại. prune tràn lan có --volumes có thể xoá luôn volume của CSDL; xoá WAL là làm hỏng CSDL. Cách phòng là đừng build trên máy chủ (Chương 13.2).",
          },
          {
            question: "Your uptime check runs on the VPS itself: curl http://127.0.0.1:3000/api/health every minute. It has been green all night, but users could not open the site after 03:00. Which change would have caught it?|||Phép canh uptime chạy ngay trên VPS: curl http://127.0.0.1:3000/api/health mỗi phút. Nó xanh suốt đêm, nhưng người dùng không vào được trang từ sau 03:00. Thay đổi nào lẽ ra đã bắt được?",
            options: [
              "Run the same check every 10 seconds instead of every minute|||Chạy đúng phép kiểm đó mỗi 10 giây thay vì mỗi phút",
              "Run it from another machine, by name and over HTTPS, reading a real page and the certificate on the wire|||Chạy nó từ một máy khác, bằng tên và qua HTTPS, đọc một trang thật và chứng chỉ trên dây",
              "Log every check’s output to a file on the VPS and read it daily|||Ghi output mọi lần kiểm vào một tệp trên VPS và đọc hằng ngày",
              "Add an alert when CPU or memory on the VPS goes above 90%|||Thêm báo động khi CPU hay bộ nhớ trên VPS vượt 90%",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: A loopback check skips DNS, the firewall, nginx and TLS — everything between the user and the app (Chapter 9.5). Lesson 15.4 showed exactly this: 127.0.0.1:3001 answered 200 while every user got \"certificate has expired\", and the outside watcher had warned four minutes earlier. Checking more often only confirms the wrong thing faster.|||VI: Phép kiểm qua loopback bỏ qua DNS, tường lửa, nginx và TLS — mọi thứ nằm giữa người dùng và app (Chương 9.5). Bài 15.4 cho thấy đúng như vậy: 127.0.0.1:3001 trả 200 trong khi mọi người dùng nhận \"certificate has expired\", còn người canh bên ngoài đã báo trước bốn phút. Kiểm dày hơn chỉ xác nhận sai nhanh hơn.",
          },
          {
            question: "Every night a backup job exits 0 and writes a 3.4 MB file. What is the only real proof that you can recover from it, and what number do you need?|||Mỗi đêm việc sao lưu thoát 0 và ghi ra một tệp 3,4 MB. Bằng chứng thật duy nhất rằng bạn phục hồi được từ nó là gì, và bạn cần con số nào?",
            options: [
              "The exit code 0, and the file size compared with yesterday’s file|||Mã thoát 0, và kích thước tệp so với tệp của hôm qua",
              "A checksum stored next to the file, and the time the dump took|||Một mã băm lưu cạnh tệp, và thời gian dump mất",
              "The file being present on two machines, and the number of copies kept|||Tệp có mặt trên hai máy, và số bản đang giữ",
              "A restore elsewhere until the app serves real data — and how long it took|||Phục hồi sang máy khác tới khi app trả dữ liệu thật — và nó mất bao lâu",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: Chapter 10.3 produced a backup that passed every cheap check and was missing 400 170 rows; Chapter 10.4 made the restore the proof. Lesson 15.3 timed it: 100.8 s on an empty machine (95 s pulling images), 3.4–4.6 s once images were present — and one run \"succeeded\" at being ready while pg_restore was cut off. A checksum only proves the file did not change, not that it was right.|||VI: Chương 10.3 làm ra một bản sao lưu qua mọi phép kiểm rẻ mà thiếu 400.170 dòng; Chương 10.4 lấy cú phục hồi làm bằng chứng. Bài 15.3 bấm giờ: 100,8 s trên máy trống (95 s là kéo ảnh), 3,4–4,6 s khi ảnh có sẵn — và một lần \"sẵn sàng\" giả trong khi pg_restore bị cắt giữa chừng. Mã băm chỉ chứng minh tệp không đổi, không chứng minh nó đúng.",
          },
          {
            question: "Right after a deploy, users get 502 Bad Gateway within 5 ms. A day later, a different problem: 504 Gateway Timeout after exactly 60 s. What does each signature point to?|||Ngay sau một lần deploy, người dùng nhận 502 Bad Gateway trong 5 ms. Một ngày sau, chuyện khác: 504 Gateway Timeout sau đúng 60 s. Mỗi chữ ký chỉ về đâu?",
            options: [
              "502: the database is slow to answer; 504: the app container has crashed|||502: CSDL trả lời chậm; 504: container của app đã sập",
              "Both mean the TLS certificate is wrong, one expired and one mismatched|||Cả hai đều do chứng chỉ TLS sai, một cái hết hạn, một cái sai tên",
              "502: DNS points at the wrong IP; 504: the firewall blocks port 443|||502: DNS trỏ sai IP; 504: tường lửa chặn cổng 443",
              "502: nothing upstream accepted the connection; 504: the app accepted but never answered|||502: phía sau không ai nhận kết nối; 504: app đã nhận mà không trả lời kịp",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: Chapter 11.2: the status code says which layer answered — here nginx in both cases — and the time says which layer failed. A 502 in milliseconds is a refused or reset upstream connection; a 504 at a round number is a timeout (60 s is nginx’s default proxy_read_timeout). Incident 8 of Lesson 15.4 is a 504-shaped problem: requests queued behind a migration waiting for a lock. DNS or firewall problems never produce an nginx status at all.|||VI: Chương 11.2: mã trạng thái cho biết tầng nào trả lời — ở đây cả hai lần đều là nginx — còn thời gian cho biết tầng nào hỏng. 502 trong vài mili-giây là kết nối phía sau bị từ chối hay bị cắt; 504 ở một con số tròn là hết giờ chờ (60 s là proxy_read_timeout mặc định của nginx). Sự cố 8 của Bài 15.4 có hình dạng 504: request xếp hàng sau một migration đang chờ khoá. Lỗi DNS hay tường lửa không bao giờ sinh ra mã trạng thái của nginx.",
          },
          {
            question: "ufw allows only 22, 80, 443. A teammate runs Postgres with -p 5432:5432 \"for DBeaver\". A scan from another machine shows 5432/tcp open and a login succeeds. Why, and what is the fix?|||ufw chỉ cho 22, 80, 443. Một bạn chạy Postgres với -p 5432:5432 \"để dùng DBeaver\". Quét từ máy khác thấy 5432/tcp open và đăng nhập được. Vì sao, và sửa thế nào?",
            options: [
              "Docker DNAT sends it via FORWARD, past ufw; publish on 127.0.0.1 or not at all|||DNAT của Docker đẩy gói qua FORWARD, vượt ufw; publish lên 127.0.0.1 hoặc thôi hẳn",
              "ufw was not reloaded after Docker started; ufw reload closes the port|||ufw chưa nạp lại sau khi Docker chạy; ufw reload là cổng đóng",
              "Postgres opens the port itself with UPnP; set listen_addresses = localhost|||Postgres tự mở cổng bằng UPnP; đặt listen_addresses = localhost",
              "nmap reports open for every Docker port by mistake; the login proves nothing|||nmap báo open nhầm cho mọi cổng Docker; lần đăng nhập không chứng minh gì",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: Chapter 12.3 explained the packet path and Lesson 15.4 rebuilt it: 3001/3002 published on 127.0.0.1 showed filtered, 5432 published on all addresses showed open and accepted a login; republishing on 127.0.0.1 turned it filtered. Reloading ufw changes nothing because its rules are never consulted for that packet. Inside the container Postgres must listen on all its interfaces for Docker networking — the fix belongs in the publish address.|||VI: Chương 12.3 giải thích đường đi của gói tin và Bài 15.4 dựng lại nó: 3001/3002 publish lên 127.0.0.1 hiện filtered, 5432 publish lên mọi địa chỉ hiện open và nhận đăng nhập; publish lại lên 127.0.0.1 thì thành filtered. Nạp lại ufw không đổi gì vì luật của nó không bao giờ được hỏi với gói tin đó. Bên trong container, Postgres phải nghe trên mọi giao diện của nó để mạng Docker chạy — chỗ sửa là địa chỉ publish.",
          },
          {
            question: "certbot renew prints \"Congratulations, all renewals succeeded\", and the file on disk has a new serial. openssl s_client from outside still shows the old serial. What is missing?|||certbot renew in \"Congratulations, all renewals succeeded\", và tệp trên đĩa có số seri mới. openssl s_client từ bên ngoài vẫn thấy số seri cũ. Thiếu gì?",
            options: [
              "Another renewal, because the first one only downloads the certificate|||Gia hạn thêm lần nữa, vì lần đầu chỉ tải chứng chỉ về",
              "A DNS change, because the certificate is tied to the old IP|||Đổi DNS, vì chứng chỉ gắn với IP cũ",
              "nginx still serves the old one from memory: reload it, via a deploy hook|||nginx vẫn phục vụ bản cũ trong bộ nhớ: nạp lại, bằng deploy hook",
              "Clearing the browser and OCSP cache on the machine running openssl|||Xoá bộ đệm trình duyệt và OCSP trên máy đang chạy openssl",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: nginx reads certificate files when it starts or reloads. Chapter 12.2 measured the old serial on the wire after a forced renewal until nginx was reloaded, then fixed it with a deploy hook; Lesson 15.1 passes --deploy-hook \"nginx -s reload\" on the very first request, so it is saved in the renewal configuration. A certificate is tied to names, not IPs, and openssl has no browser cache.|||VI: nginx đọc tệp chứng chỉ lúc khởi động hoặc nạp lại. Chương 12.2 đo được số seri cũ trên dây sau một lần ép gia hạn cho tới khi nginx được nạp lại, rồi sửa bằng deploy hook; Bài 15.1 truyền --deploy-hook \"nginx -s reload\" ngay từ lần xin đầu tiên, nên nó được lưu vào cấu hình gia hạn. Chứng chỉ gắn với tên, không gắn với IP, và openssl không có bộ đệm trình duyệt.",
          },
          {
            question: "The image builds, pushes and swaps green; then the API restarts forever and nginx answers 502. The log says it cannot load a native engine for \"linux-musl\". Which check, run before docker push, would have stopped this image?|||Ảnh build xanh, đẩy xanh, tráo xanh; rồi API khởi động lại vô tận và nginx trả 502. Log nói không nạp được engine native cho \"linux-musl\". Phép kiểm nào, chạy trước docker push, lẽ ra đã chặn ảnh này?",
            options: [
              "docker image ls, to confirm the new image is smaller than the old|||docker image ls, để xác nhận ảnh mới nhỏ hơn ảnh cũ",
              "Run the image and require() every dependency inside it, then start the app|||Chạy ảnh, require() mọi thư viện bên trong nó, rồi khởi động app",
              "docker push --verify, which tests images on the registry|||docker push --verify, lệnh kiểm ảnh trên registry",
              "npm audit --production on the build machine before building|||npm audit --production trên máy build trước khi dựng",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: This is the project’s 18/08 incident (seven minutes of 502): an Alpine/musl image carrying a glibc Prisma engine. Lesson 15.4 rebuilt it with @node-rs/bcrypt — node_modules contained bcrypt-linux-arm64-gnu while the image looked for -musl — and kiem-anh.sh refused it before pushing. A smaller image is what caused it, not a proof; there is no docker push --verify; npm audit checks vulnerabilities, not whether a binary loads.|||VI: Đây là sự cố 18/08 của dự án (502 bảy phút): ảnh Alpine/musl mang engine Prisma dựng cho glibc. Bài 15.4 dựng lại bằng @node-rs/bcrypt — node_modules có bcrypt-linux-arm64-gnu trong khi ảnh đi tìm bản -musl — và kiem-anh.sh từ chối nó trước khi đẩy. Ảnh nhỏ hơn chính là nguyên nhân, không phải bằng chứng; không có docker push --verify; npm audit kiểm lỗ hổng bảo mật, không kiểm bản nhị phân có nạp được không.",
          },
          {
            question: "nginx runs in a container with -v ./nginx.conf:/etc/nginx/nginx.conf. You edit the file with sed -i, then nginx -t says \"test is successful\" and you reload — but the response headers do not change. Why?|||nginx chạy trong container với -v ./nginx.conf:/etc/nginx/nginx.conf. Bạn sửa tệp bằng sed -i, rồi nginx -t báo \"test is successful\" và bạn reload — nhưng header trả về không đổi. Vì sao?",
            options: [
              "The single-file mount follows the inode sed -i replaced; the container sees the old file|||Mount một tệp bám theo inode mà sed -i đã thay; container vẫn thấy tệp cũ",
              "nginx -t only checks syntax; reload needs a full restart for headers|||nginx -t chỉ kiểm cú pháp; header cần khởi động lại hoàn toàn mới đổi",
              "add_header is ignored inside containers unless nginx runs as root|||add_header bị bỏ qua trong container trừ khi nginx chạy bằng root",
              "The browser caches response headers for a day after the first visit|||Trình duyệt đệm header phản hồi một ngày sau lần truy cập đầu",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: Lesson 15.4 measured it: inode 148365 before, 149463 after sed -i; the host file said X-Ban \"2\", the file inside the container still said \"1\", and nginx -t happily tested the old file. After recreating the container, cat > kept the inode and the change took effect (X-Ban: 3). This is the project’s 25/08 story, and why phat-hanh.sh writes its upstream with cat >. A reload is enough for headers.|||VI: Bài 15.4 đã đo: inode 148365 trước, 149463 sau sed -i; tệp trên máy ghi X-Ban \"2\", tệp bên trong container vẫn là \"1\", và nginx -t vui vẻ kiểm tệp cũ. Sau khi tạo lại container, cat > giữ nguyên inode và thay đổi có hiệu lực (X-Ban: 3). Đây là chuyện 25/08 của dự án, và là lý do phat-hanh.sh ghi upstream bằng cat >. Với header thì reload là đủ.",
          },
          {
            question: "You add a second server behind a load balancer. After each deploy, some users are logged out and some uploaded avatars return 404. What is the underlying problem?|||Bạn thêm máy chủ thứ hai sau một bộ cân bằng tải. Sau mỗi lần deploy, một số người dùng bị đăng xuất và một số ảnh đại diện vừa tải lên trả 404. Vấn đề gốc là gì?",
            options: [
              "The load balancer needs a longer health-check interval|||Bộ cân bằng tải cần khoảng kiểm sức khoẻ dài hơn",
              "The two servers run different versions of Node|||Hai máy chạy hai phiên bản Node khác nhau",
              "The TLS certificate was only copied to one of the two servers|||Chứng chỉ TLS mới chỉ được chép sang một trong hai máy",
              "State lives on each machine: sessions in memory, uploads on local disk|||Trạng thái nằm trên từng máy: phiên trong bộ nhớ, tệp tải lên trên đĩa",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: Chapter 14.2: with two machines, any request may land on either, and a deploy restarts them in turn — sessions held in one process’s memory vanish, and a file saved on server A does not exist on server B. State must leave the machine: sessions to Redis or the database, uploads to object storage (Chapter 12.4). A missing certificate would fail TLS for everyone on that server, not log individual users out.|||VI: Chương 14.2: với hai máy, request nào cũng có thể rơi vào máy nào, và một lần deploy khởi động lại lần lượt từng máy — phiên giữ trong bộ nhớ của một tiến trình biến mất, còn tệp lưu trên máy A không hề có trên máy B. Trạng thái phải rời khỏi máy: phiên sang Redis hoặc CSDL, tệp tải lên sang kho object (Chương 12.4). Thiếu chứng chỉ thì TLS hỏng với mọi người trên máy đó, chứ không làm đăng xuất từng người.",
          },
          {
            question: "A release script runs its smoke test (\"does the front door report the new tag?\") immediately after nginx -s reload. A correct release is rejected with \"front door returned the OLD tag\", and 4 requests get 502 during the automatic switch back. What is the fix?|||Một script phát hành chạy smoke-test (\"cửa trước có khai đúng tag mới không?\") ngay sau nginx -s reload. Một bản hoàn toàn đúng bị từ chối với \"cửa trước trả tag CŨ\", và 4 request nhận 502 trong lúc tự chuyển về. Sửa thế nào?",
            options: [
              "Replace reload with restart, so the change is instant|||Thay reload bằng restart để thay đổi có hiệu lực tức thì",
              "Retry with a limit until the expected tag answers, both ways, before removing anything|||Hỏi lại có giới hạn tới khi đúng tag trả lời, cả hai chiều, rồi mới xoá",
              "Remove the smoke test; the health check already proves the new version|||Bỏ smoke-test; health đã chứng minh được bản mới rồi",
              "Add a fixed sleep 30 before the smoke test to be safe|||Thêm sleep 30 cố định trước smoke-test cho an toàn",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: nginx -s reload only sends a signal; the master then starts new workers while old ones finish, so for a moment old workers answer (Lesson 15.1 measured \"000\" on the first try; 15.2 measured this exact rejection, b19213a, with 902 × 200 and 4 × 502). A limited retry is both fast and correct; a fixed sleep is slow and still a guess; restart drops connections; removing the smoke test let 21 × 500 through in release 4f67bce.|||VI: nginx -s reload chỉ gửi tín hiệu; master sau đó khởi động worker mới trong lúc worker cũ làm nốt, nên trong chốc lát worker cũ vẫn trả lời (Bài 15.1 đo được \"000\" ở lần hỏi đầu; 15.2 đo đúng lần từ chối này, b19213a, với 902 × 200 và 4 × 502). Hỏi lại có giới hạn vừa nhanh vừa đúng; sleep cố định thì chậm mà vẫn là đoán; restart làm rơi kết nối; bỏ smoke-test thì để lọt 21 × 500 như bản 4f67bce.",
          },
          {
            question: "A release hangs at \"ALTER TABLE lich_hen ADD COLUMN …\", and every API request hangs too. pg_stat_activity shows one session \"idle in transaction\" for 11 s. What is happening, and what keeps it from recurring?|||Một lần phát hành treo ở \"ALTER TABLE lich_hen ADD COLUMN …\", và mọi request của API cũng treo theo. pg_stat_activity cho thấy một phiên \"idle in transaction\" đã 11 s. Chuyện gì đang xảy ra, và điều gì giữ nó không lặp lại?",
            options: [
              "The table is too big for ALTER TABLE; split it into smaller tables|||Bảng quá lớn cho ALTER TABLE; tách nó thành các bảng nhỏ hơn",
              "The API has too few connections; raise the pool size|||API có quá ít kết nối; tăng kích thước pool",
              "A forgotten session blocks the ALTER, selects queue behind it; use lock_timeout|||Phiên bị quên chặn lệnh ALTER, select xếp hàng sau nó; dùng lock_timeout",
              "Postgres is out of disk space for the new column; free space and retry|||Postgres hết chỗ đĩa cho cột mới; giải phóng chỗ rồi thử lại",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: Lesson 15.4, incident 8: pid 442 idle in transaction blocked the ALTER (446), which blocked the API’s selects (445, 448); ending 442 let the migration finish after 14 s. With lock_timeout = 5s the same migration gave up (\"canceling statement due to lock timeout\"), the release stopped before starting a new container, and one request timed out instead of all of them (Chapter 5.3). Adding a nullable column is instant once the lock is granted — size is not the problem.|||VI: Bài 15.4, sự cố 8: pid 442 idle in transaction chặn lệnh ALTER (446), lệnh ALTER chặn các select của API (445, 448); kết thúc 442 thì migration xong sau 14 s. Với lock_timeout = 5s, cùng migration đó bỏ cuộc (\"canceling statement due to lock timeout\"), lần phát hành dừng trước khi dựng container mới, và chỉ một request hết giờ thay vì tất cả (Chương 5.3). Thêm một cột cho phép rỗng là tức thì khi đã có khoá — kích thước bảng không phải vấn đề.",
          },
        ],
      },
    },
  ],
};
