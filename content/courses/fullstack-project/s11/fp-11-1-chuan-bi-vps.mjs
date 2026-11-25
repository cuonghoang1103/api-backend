/**
 * 11.1 — Chuẩn bị VPS (soạn 25/11/2026, agent trên Mac tiếp quản fsp).
 * VPS MÔ PHỎNG: container fsp-vps (ubuntu:24.04 + openssh-server, --privileged để chạy Docker lồng, RAM 2 GB) trên mạng Docker
 * riêng, tên miền giả chiase.test (alias mạng Docker); "laptop" (fsp-laptop) và "máy lạ trên Internet" (fsp-ke-la) là hai
 * container khác. Mọi lệnh và output dưới đây chạy THẬT trên máy nhà; Docker cài từ kho apt chính thức theo docs.docker.com.
 * KHÔNG đụng VPS thật nào; không IP/tên miền/bí mật thật.
 */
import { lienKet, spring, nguon } from '../_chung.mjs';

const KEYGEN = `$ ssh-keygen -t ed25519 -C ban-cua-toi@laptop -f ~/.ssh/id_ed25519 -N ""
Generating public/private ed25519 key pair.
Your identification has been saved in /home/node/.ssh/id_ed25519
Your public key has been saved in /home/node/.ssh/id_ed25519.pub
The key fingerprint is:
SHA256:pJADJZ/Oi9Ww6AO2FzTOFZSSvtH3ytmOry85O0mDzQk ban-cua-toi@laptop
The key's randomart image is:
+--[ED25519 256]--+
|  o.+o.          |
|   * +.          |
|  .oX.  .        |
|  +*oE +         |
|...+B O S        |
|.o.+.o * .       |
| .+.. o B        |
|  ..   X..       |
|       +X+       |
+----[SHA256]-----+
$ cat ~/.ssh/id_ed25519.pub
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKfui0GTSFaWHZBJ2HTYaGcAvCS0e0y6BGAmTgLjtGiM ban-cua-toi@laptop`;

const SSH = `$ ssh -o StrictHostKeyChecking=accept-new root@chiase.test "grep PRETTY /etc/os-release; whoami"
Warning: Permanently added 'chiase.test' (ED25519) to the list of known hosts.
PRETTY_NAME="Ubuntu 24.04.5 LTS"
root

$ ssh root@chiase.test "adduser --disabled-password --gecos \\"\\" deployer &gt;/dev/null &amp;&amp; echo deployer:chiase2026 | chpasswd &amp;&amp; install -d -m 700 -o deployer -g deployer /home/deployer/.ssh &amp;&amp; install -m 600 -o deployer -g deployer /root/.ssh/authorized_keys /home/deployer/.ssh/authorized_keys &amp;&amp; id deployer"
uid=1001(deployer) gid=1001(deployer) groups=1001(deployer),100(users)

$ sshpass -p chiase2026 ssh -o PubkeyAuthentication=no deployer@chiase.test whoami   # đăng nhập bằng MẬT KHẨU
deployer

$ sshpass -p mat-khau-tam-cua-nha-cung-cap ssh -o PubkeyAuthentication=no root@chiase.test whoami   # root bằng mật khẩu
Permission denied, please try again.

$ ssh root@chiase.test "ls /etc/ssh/sshd_config.d/; cat /etc/ssh/sshd_config.d/50-cloud-init.conf; sshd -T | grep -E \\"^(passwordauthentication|permitrootlogin) \\""
50-cloud-init.conf
PasswordAuthentication yes
permitrootlogin without-password
passwordauthentication yes

$ ssh root@chiase.test "printf \\"PasswordAuthentication no\\nKbdInteractiveAuthentication no\\nPermitRootLogin prohibit-password\\n\\" &gt; /etc/ssh/sshd_config.d/70-chiase.conf &amp;&amp; sshd -t &amp;&amp; kill -HUP \\$(cat /run/sshd.pid) &amp;&amp; sleep 1 &amp;&amp; echo reload-ok"
reload-ok

$ ssh root@chiase.test "sshd -T | grep -E \\"^(passwordauthentication|kbdinteractiveauthentication|permitrootlogin) \\""
permitrootlogin without-password
passwordauthentication yes
kbdinteractiveauthentication no

$ sshpass -p chiase2026 ssh -o PubkeyAuthentication=no deployer@chiase.test whoami   # vẫn vào?!
deployer

$ ssh root@chiase.test "mv /etc/ssh/sshd_config.d/70-chiase.conf /etc/ssh/sshd_config.d/01-chiase.conf &amp;&amp; sshd -t &amp;&amp; kill -HUP \\$(cat /run/sshd.pid) &amp;&amp; sleep 1 &amp;&amp; sshd -T | grep -E \\"^(passwordauthentication|kbdinteractiveauthentication|permitrootlogin) \\""
permitrootlogin without-password
passwordauthentication no
kbdinteractiveauthentication no

$ sshpass -p chiase2026 ssh -o PubkeyAuthentication=no deployer@chiase.test whoami
deployer@chiase.test: Permission denied (publickey).

$ ssh deployer@chiase.test whoami   # khoá vẫn vào
deployer`;

const DOCKER = `$ ssh root@chiase.test "apt-get update -qq &amp;&amp; apt-get install -y -qq ca-certificates curl &gt;/dev/null &amp;&amp; install -m 0755 -d /etc/apt/keyrings &amp;&amp; curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc &amp;&amp; chmod a+r /etc/apt/keyrings/docker.asc &amp;&amp; echo ok"
ok

$ ssh root@chiase.test cat /etc/apt/sources.list.d/docker.sources
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: noble
Components: stable
Architectures: amd64
Signed-By: /etc/apt/keyrings/docker.asc

$ ssh root@chiase.test "apt-get update -qq &amp;&amp; DEBIAN_FRONTEND=noninteractive apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin 2&gt;&amp;1 | tail -2"
Created symlink /etc/systemd/system/multi-user.target.wants/networkd-dispatcher.service → /usr/lib/systemd/system/networkd-dispatcher.service.

Processing triggers for libc-bin (2.39-0ubuntu8.9) ...

$ ssh root@chiase.test "(nohup dockerd &gt;/var/log/dockerd.log 2&gt;&amp;1 &amp;) ; sleep 4; docker version --format \\"Client {{.Client.Version}} · Server {{.Server.Version}}\\"; docker compose version"
Client 29.10.1 · Server 29.10.1
Docker Compose version v5.8.0`;

const UFW = `$ ssh root@chiase.test "cat /etc/docker/daemon.json; docker info --format \\"log driver: {{.LoggingDriver}}\\""
{
  "log-driver": "local",
  "log-opts": { "max-size": "20m", "max-file": "5" },
  "insecure-registries": ["registry.chiase.test:5000"]
}
log driver: local

$ ssh root@chiase.test "usermod -aG docker deployer &amp;&amp; id deployer"
uid=1001(deployer) gid=1001(deployer) groups=1001(deployer),100(users),995(docker)

$ ssh deployer@chiase.test "docker run --rm -v /:/host alpine:3.22 sh -c \\"head -c 22 /host/etc/shadow; echo ...; touch /host/root/deployer-da-o-day &amp;&amp; ls -l /host/root/deployer-da-o-day\\" 2&gt;&amp;1 | grep -v -i pull"
Unable to find image 'alpine:3.22' locally
… (3 dòng tiến độ kéo ảnh, lược bớt)
Digest: sha256:49340b346798875b5592e5d420241f2f9cfba5f47e62ebb1446a1b34734e898f
Status: Downloaded newer image for alpine:3.22
root:$y$j9T$mj7jY6PHOh...
-rw-r--r--    1 root     root             0 Nov 25 05:31 /host/root/deployer-da-o-day

$ ssh root@chiase.test "rm /root/deployer-da-o-day; DEBIAN_FRONTEND=noninteractive apt-get install -y -qq ufw &gt;/dev/null 2&gt;&amp;1; ufw default deny incoming &amp;&amp; ufw default allow outgoing &amp;&amp; ufw allow OpenSSH &amp;&amp; ufw allow 80,443/tcp &amp;&amp; ufw --force enable &amp;&amp; ufw status verbose"
Default incoming policy changed to 'deny'
(be sure to update your rules accordingly)
Default outgoing policy changed to 'allow'
(be sure to update your rules accordingly)
Rules updated
Rules updated (v6)
Rules updated
Rules updated (v6)
Firewall is active and enabled on system startup
Status: active
Logging: on (low)
Default: deny (incoming), allow (outgoing), deny (routed)
New profiles: skip

To                         Action      From
--                         ------      ----
22/tcp (OpenSSH)           ALLOW IN    Anywhere                  
80,443/tcp                 ALLOW IN    Anywhere                  
22/tcp (OpenSSH (v6))      ALLOW IN    Anywhere (v6)             
80,443/tcp (v6)            ALLOW IN    Anywhere (v6)             


$ ssh deployer@chiase.test "docker run -d --name pg-thu -e POSTGRES_PASSWORD=khong-ai-doan-duoc -p 5432:5432 postgres:18-alpine &gt;/dev/null &amp;&amp; sleep 6 &amp;&amp; docker ps --format \\"{{.Names}} {{.Ports}}\\""
Unable to find image 'postgres:18-alpine' locally
… (27 dòng tiến độ kéo ảnh, lược bớt)
Digest: sha256:0115267ab5a509022df9319c77be365cef335adb71556c75f60f5360ee247e71
Status: Downloaded newer image for postgres:18-alpine
pg-thu 0.0.0.0:5432-&gt;5432/tcp, [::]:5432-&gt;5432/tcp

$ # từ một máy KHÁC trên Internet (container ke-la):
ke-la$ pg_isready -h chiase.test -p 5432
chiase.test:5432 - accepting connections
ke-la$ nc -zv -w 3 chiase.test 8080
nc: connect to chiase.test (172.27.0.4) port 8080 (tcp) timed out: Operation now in progress`;

const UFW_SUA = `$ ssh root@chiase.test "iptables -t nat -S DOCKER | grep 5432; iptables -S DOCKER | grep 5432"
-A DOCKER ! -i docker0 -p tcp -m tcp --dport 5432 -j DNAT --to-destination 172.17.0.2:5432
-A DOCKER -d 172.17.0.2/32 ! -i docker0 -o docker0 -p tcp -m tcp --dport 5432 -j ACCEPT

$ ssh deployer@chiase.test "docker rm -f pg-thu &gt;/dev/null &amp;&amp; docker run -d --name pg-thu -e POSTGRES_PASSWORD=khong-ai-doan-duoc -p 127.0.0.1:5432:5432 postgres:18-alpine &gt;/dev/null &amp;&amp; sleep 5 &amp;&amp; docker ps --format \\"{{.Names}} {{.Ports}}\\" &amp;&amp; ss -tlnH | awk \\"{print \\\\\\$4}\\" | sort"
pg-thu 127.0.0.1:5432-&gt;5432/tcp
0.0.0.0:22
127.0.0.11:36083
127.0.0.1:5432
[::]:22

ke-la$ pg_isready -h chiase.test -p 5432 -t 5
chiase.test:5432 - no response
(mã thoát 2)
127.0.0.1:5432 - accepting connections`;

const VPS_DF = `# fsp-vps — mô phỏng MỘT VPS Ubuntu 24.04 mới thuê (bài 11.1). Chỉ có: openssh-server + khoá công khai của root
# (nhà cung cấp VPS thật cũng "tiêm" khoá bạn chọn lúc tạo máy) + tệp 50-cloud-init.conf như ảnh cloud của Ubuntu.
# Docker, nginx, certbot, ufw: CÀI TAY trong bài, như trên máy thật. Không systemd ⇒ khoi-dong.sh bật sshd (và dockerd khi đã cài).
FROM ubuntu:24.04
RUN apt-get update &amp;&amp; DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends openssh-server sudo ca-certificates curl iproute2 \\
 &amp;&amp; rm -rf /var/lib/apt/lists/* &amp;&amp; mkdir -p /run/sshd /root/.ssh &amp;&amp; chmod 700 /root/.ssh \\
 &amp;&amp; printf "PasswordAuthentication yes\\n" &gt; /etc/ssh/sshd_config.d/50-cloud-init.conf \\
 &amp;&amp; echo "root:mat-khau-tam-cua-nha-cung-cap" | chpasswd
COPY root.pub /root/.ssh/authorized_keys
COPY khoi-dong.sh /usr/local/sbin/khoi-dong.sh
RUN chmod 600 /root/.ssh/authorized_keys &amp;&amp; chmod 755 /usr/local/sbin/khoi-dong.sh
CMD ["/usr/local/sbin/khoi-dong.sh"]`;


const NGUON = [
  nguon('🐳', 'Docker Docs — Install Docker Engine on Ubuntu', 'docs.docker.com', 'https://docs.docker.com/engine/install/ubuntu/'),
  nguon('🧱', 'Docker Docs — Packet filtering and firewalls (cổng công bố đi vòng ufw)', 'docs.docker.com', 'https://docs.docker.com/engine/network/packet-filtering-firewalls/'),
  nguon('🔐', 'Docker Docs — Docker security: Docker daemon attack surface', 'docs.docker.com', 'https://docs.docker.com/engine/security/'),
  nguon('🕵️', 'Unit 42 — PGMiner: New Cryptocurrency Mining Botnet Delivered via PostgreSQL (10/12/2020)', 'unit42.paloaltonetworks.com', 'https://unit42.paloaltonetworks.com/pgminer-postgresql-cryptocurrency-mining-botnet/'),
  nguon('📕', 'sshd_config(5) — "the first obtained value will be used"', 'man.openbsd.org', 'https://man.openbsd.org/sshd_config'),
].join('\n');

const THE = [
  lienKet({ khoa: 'deploy-vps', bai: 'deploy-0-2-may-nhan', title: 'Deploy VPS 0.2 — Cái máy nhận lần deploy', sub: 'Đọc trước nếu "VPS" còn mơ hồ: CPU, RAM, đĩa, ai giữ cái gì.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'deploy-vps', bai: 'deploy-12-3-cong-mo-ra-internet', title: 'Deploy VPS 12.3 — Chỉ mở đúng cổng: ss, ufw, và cách Docker đi vòng qua', sub: 'Đào sâu đúng cái bẫy bài này đo.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'deploy-vps', bai: 'deploy-8-3-swap', title: 'Deploy VPS 8.3 — Swap: mua được gì và trả giá gì', sub: 'VPS 1–2 GB RAM: bật swap trước khi kéo ảnh lớn.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'deploy-vps', bai: 'deploy-14-3-paas-vps-kubernetes', title: 'Deploy VPS 14.3 — VPS, PaaS, serverless hay Kubernetes', sub: 'Khi nào KHÔNG nên thuê VPS.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'docker', bai: 'dk-11-3-log', title: 'Docker 11.3 — Log, xoay log, và cái đĩa đầy', sub: 'Vì sao daemon.json phải có max-size ngay ngày đầu.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '11.1 — Preparing a VPS (or a free-tier cloud option)|||11.1 — Chuẩn bị VPS (hoặc phương án cloud miễn phí)',
  slug: 'fp-11-1-chuan-bi-vps',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Biến một VPS Ubuntu 24.04 mới thuê thành máy chủ chạy được ChiaSe: cỡ máy tối thiểu (đo trên chính stack), khoá SSH ed25519, người dùng deployer, tắt đăng nhập bằng mật khẩu — kèm cái bẫy thứ tự tệp 50-cloud-init.conf làm cấu hình "đã lưu" mà không có hiệu lực (sshd -T mới là sự thật); cài Docker từ kho apt chính thức, giới hạn log, vì sao nhóm docker ngang quyền root (đo bằng cách đọc /etc/shadow); ufw và cổng Docker đi VÒNG tường lửa — Postgres trả lời từ Internet dù ufw nói "deny". Chạy thật trên một VPS mô phỏng bằng container.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Deploy</span>
<h2>A fresh VPS is a stranger's computer with your name on it</h2>
<p class="lead">Ten chapters of ChiaSe ran on your laptop, where the only attacker was you. The moment a machine has a public IP, bots start knocking within minutes — they do not know your app exists, they scan the whole IPv4 space for open SSH, open databases and readable <code>.env</code> files. This lesson turns a freshly rented Ubuntu 24.04 VPS into a machine that answers on exactly three ports and accepts exactly one kind of login, and measures each step instead of trusting it.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">key</span><span class="lz-d">ed25519 on the laptop, .pub given to the provider</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">user</span><span class="lz-d">deployer with the key; root only for setup</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">sshd</span><span class="lz-d">01- drop-in, verified with sshd -T + a real attempt</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">docker</span><span class="lz-d">official apt repo, log limit, docker group = root</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">firewall</span><span class="lz-d">ufw 22/80/443 — and publish no database port</span></div>
</div>


<div class="callout info"><p><strong>About the VPS in this lesson.</strong> Nothing here touches a real server. The "VPS" is a container (<code>ubuntu:24.04</code> + OpenSSH, 2 GB RAM, privileged so it can run its own Docker) on a private Docker network where the name <code>chiase.test</code> resolves to it. "Your laptop" and "a stranger on the Internet" are two more containers. Every command below is exactly what you type on a real VPS; where the simulation differs (no systemd), the lesson says so.</p></div>

<h3>1. How big a machine? Measure, don't guess</h3>
<p>Lesson 11.2 deploys the whole stack and measures it: idle, PostgreSQL ≈ 39 MiB, MinIO ≈ 71 MiB, the API ≈ 83 MiB, Nginx ≈ 11 MiB — about 200 MiB for the containers, ~1 GiB for the whole simulated machine including Docker itself and page cache. Images on disk: 2.1 GB after a few releases. So:</p>
<table>
<tr><th></th><th>Minimum that works</th><th>Comfortable</th><th>Why</th></tr>
<tr><td>RAM</td><td>1 GB + 2 GB swap</td><td>2 GB</td><td>Pulling and unpacking images, <code>pg_dump</code> and a migration all happen during a deploy, on top of the running app.</td></tr>
<tr><td>CPU</td><td>1 vCPU</td><td>2 vCPU</td><td>argon2 (lesson 3.1) costs ~35 ms of CPU per login; sharp resizes images.</td></tr>
<tr><td>Disk</td><td>20 GB</td><td>40 GB</td><td>Old images, logs and backups grow every week. A full disk kills Postgres first.</td></tr>
<tr><td>OS</td><td colspan="2">Ubuntu 24.04 LTS (supported by Docker's apt repo; LTS = security updates until 2029)</td><td>Same as most tutorials and most employers.</td></tr>
</table>
<p><strong>Building on the VPS is what needs RAM</strong> — <code>next build</code>/<code>vite build</code>/<code>npm ci</code> on a 1 GB machine ends in exit code 137. Chapter 10 builds images in CI, so the VPS only pulls. That single decision is what lets a small VPS work.</p>
<p><strong>Free options.</strong> They change every year, so check the provider's current page rather than a blog: the free tiers of the big clouds (small always-free VMs with strict limits, credit card required), student credits (e.g. through the GitHub Student Developer Pack), and PaaS free tiers that sleep when idle. Everything in this chapter works on any Ubuntu machine you can SSH into; on a PaaS you skip 11.1 and half of 11.2 but lose control of Nginx, ports and backups — see the comparison linked at the end.</p>

<h3>2. An SSH key, not a password</h3>
<p>On <em>your laptop</em>. ed25519: short keys, fast, the default recommendation of OpenSSH. Give it a passphrase in real life (<code>-N ""</code> here only because the lesson is scripted):</p>
<div class="out">${KEYGEN}</div>
<p>When you create the VPS, paste the <code>.pub</code> line into the provider's "SSH keys" box: the provider writes it to <code>/root/.ssh/authorized_keys</code>. The private key never leaves your laptop. The simulated VPS was built the same way — here is all it contains before the lesson starts:</p>
<pre><code class="language-dockerfile">${VPS_DF}</code></pre>

<h3>3. First login, a deploy user, and the line that silently wins</h3>
<p>Below: first login (the host key gets pinned in <code>known_hosts</code> — from now on a different machine answering as <code>chiase.test</code> is an error, not a prompt), create <code>deployer</code>, copy the key, then try to turn passwords off. Read the output slowly; the interesting part is in the middle.</p>
<div class="out">${SSH}</div>
<p>What happened:</p>
<ol>
<li>Root with a password was refused even before we touched anything: Ubuntu's own default is <code>PermitRootLogin prohibit-password</code> (keys only for root). But <code>deployer</code> with a password got in — because the cloud image ships <code>/etc/ssh/sshd_config.d/50-cloud-init.conf</code> with <code>PasswordAuthentication yes</code>.</li>
<li>We wrote <code>70-chiase.conf</code> with <code>PasswordAuthentication no</code>. <code>sshd -t</code> passed, reload passed — and <code>sshd -T</code> still says <strong><code>passwordauthentication yes</code></strong>, and the password still works. In <code>sshd_config</code>, <em>the first value read wins</em>, and drop-in files are read in alphabetical order: <code>50-</code> is read before <code>70-</code>. Half our file took effect (<code>kbdinteractiveauthentication no</code> — nobody else set it), half did not. Half-working is the fingerprint of an ordering problem, not a syntax error.</li>
<li>Renamed to <code>01-chiase.conf</code>: now it is read first, <code>sshd -T</code> says <code>no</code>, and the server only offers <code>(publickey)</code>.</li>
</ol>
<div class="pitfall co-tieu-de"><p class="tieu-de">Pitfall: "saved", "test OK" and "reloaded" are three claims, none of them is "in effect"</p><p>Verify with the command that prints the <em>effective</em> value (<code>sshd -T</code>), and with a real login attempt from outside. The same mistake bit the operator of this very website in 2026 (the drop-in lost to <code>50-cloud-init.conf</code>, discovered only because the check used <code>sshd -T</code>). Keep a second SSH session open while changing SSH: if you lock yourself out, that session is the way back in.</p></div>
<p>At the end of setup, lesson 11.4 also sets <code>PermitRootLogin no</code>: day-to-day work happens as <code>deployer</code>; admin work uses the provider's web console or a sudo user. On a real Ubuntu VPS reload with <code>sudo systemctl reload ssh</code> (the simulation has no systemd, so it sends <code>HUP</code> to sshd directly).</p>

<h3>4. Docker from Docker's apt repository</h3>
<p>Not <code>apt install docker.io</code> (older, Ubuntu-maintained) and not the convenience script (the docs say it is not for production). Exactly the steps from the Docker docs:</p>
<pre><code class="language-bash">sudo apt update &amp;&amp; sudo apt install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
sudo tee /etc/apt/sources.list.d/docker.sources &lt;&lt;EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release &amp;&amp; echo "\${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin</code></pre>
<div class="out">${DOCKER}</div>
<p>On a real VPS the package starts Docker through systemd (<code>systemctl status docker</code>); the simulation starts <code>dockerd</code> by hand. Before running anything, give Docker a log limit — by default container logs grow without bound, and "the disk filled up with logs" is a classic first-month outage:</p>
<pre><code class="language-json">// /etc/docker/daemon.json — then restart Docker
{
  "log-driver": "local",
  "log-opts": { "max-size": "20m", "max-file": "5" }
}</code></pre>
<p>(The simulation's file also has <code>"insecure-registries": ["registry.chiase.test:5000"]</code> because its stand-in for GHCR has no TLS. A real VPS pulls from <code>ghcr.io</code> over HTTPS and needs no such line — never add it for a real registry.)</p>

<h3>5. The docker group is the root group</h3>
<p>The deploy user must run <code>docker</code>. The usual instruction is <code>usermod -aG docker deployer</code>. Understand what you just granted:</p>
<div class="out">${UFW.split('\n$ ssh root@chiase.test "rm /root')[0]}</div>
<p><code>deployer</code> has no sudo, yet read the first bytes of root's password hash and created a file in <code>/root</code>. Docker's own docs: "only trusted users should be allowed to control your Docker daemon". Consequences: the SSH key of <code>deployer</code> is as precious as root's (passphrase, never in a chat, never on a shared machine); a CI job that can SSH as <code>deployer</code> can own the server; and an app container must never get <code>/var/run/docker.sock</code> mounted. Rootless Docker exists if you need to separate these; for a one-person project, treat <code>deployer</code> as root and guard the key.</p>

<h3>6. ufw says deny. Postgres answers anyway</h3>
<p>Firewall: deny everything incoming, allow SSH, 80 and 443. Then do what every second tutorial does — <code>-p 5432:5432</code> "to connect from my laptop" — and ask from a <em>different</em> machine:</p>
<div class="out">$ ssh root@chiase.test "… ufw default deny incoming … ufw --force enable && ufw status verbose"
${UFW.split('ufw status verbose"')[1]}</div>
<p><code>ufw status</code> lists only 22, 80, 443 — and a stranger reaches PostgreSQL on 5432. Port 8080 (nothing published) times out, so ufw <em>is</em> working. Why:</p>
<div class="out">${UFW_SUA}</div>
<p>A published port is a DNAT rule in the <code>nat</code> table: the packet is rewritten to the container's address <em>before</em> it reaches the <code>INPUT</code> chain where ufw's rules live, then travels the <code>FORWARD</code> chain, where Docker's own <code>ACCEPT</code> sits. Docker's docs say it plainly: published ports "bypass your firewall rules". The fix is not a cleverer ufw rule; it is to not publish: bind to <code>127.0.0.1</code> (as above — the stranger now gets "no response"), or better, publish nothing and let containers talk over the compose network. In <code>compose.prod.yaml</code> (11.2) only the web container publishes, and only on <code>127.0.0.1:8080</code>.</p>

<h3>🕵️ Hacker's corner — the databases nobody meant to publish</h3>
<p>PGMiner (Palo Alto Networks Unit 42, 10 December 2020) is the version of this story written for exactly our stack: a botnet that scans port 5432 on private subnets and random public ranges, brute-forces the default user <code>postgres</code> with "a built-in list of popular passwords", then abuses the superuser feature <code>COPY … FROM PROGRAM</code> (PostgreSQL 9.3+) to run a shell script on the server — downloads a Monero miner, installs a crontab, kills competing miners and deletes its table to leave no trace. Every victim had one thing in common: 5432 reachable from the Internet. In most such post-mortems the owner <em>had</em> a firewall — and a <code>-p</code> they did not think about. Defence in this chapter: (1) never publish a database port, (2) <code>ss -tlnp</code> on the server plus a port probe from <em>outside</em> after every infrastructure change (Checkpoint 11 does it), (3) long generated passwords even for internal services, and the app connects as an ordinary user, not a superuser — so one mistake is not a takeover.</p>

<h3>7. Little things that save the first month</h3>
<ul>
<li><strong>Swap</strong> on a 1–2 GB VPS (<code>fallocate -l 2G /swapfile</code> …) — a deploy that pulls a new image while the old one runs can briefly double memory use. Linked lesson below.</li>
<li><strong>Automatic security updates</strong>: <code>unattended-upgrades</code> is installed on Ubuntu cloud images; check it is enabled.</li>
<li><strong>Time zone in UTC</strong> on servers; convert when displaying. Logs from three machines in three zones are unreadable.</li>
<li><strong>A note file</strong> in your repo (<code>docs/van-hanh.md</code>): IP, provider, who has keys, where backups go. You will forget in three months.</li>
</ul>

<h3>🧪 Lab 11.1 — harden a machine and prove it from outside</h3>
<div class="callout ok">
<p>On your own VPS (or the simulation: <code>ubuntu:24.04</code> container + OpenSSH):</p>
<ol>
<li>Create <code>deployer</code> with your key; turn off password logins. Show the <em>effective</em> value with <code>sshd -T</code> and a refused password login from your laptop.</li>
<li>Install Docker from Docker's repo, add the log limit, add <code>deployer</code> to the docker group.</li>
<li>Enable ufw (22, 80, 443). Run <code>docker run -d -p 6379:6379 redis:8-alpine</code> and prove from a <em>different</em> machine that it answers. Fix it two ways and prove each.</li>
</ol>
<p><strong>Done when:</strong> from outside, only 22/80/443 answer; <code>ssh -o PubkeyAuthentication=no deployer@your-vps</code> prints <code>Permission denied (publickey)</code>.</p>
</div>
<details><summary>Solution</summary>
<ol>
<li>Drop-in named <code>01-…conf</code> (sorts before <code>50-cloud-init.conf</code>): <code>PasswordAuthentication no</code>, <code>KbdInteractiveAuthentication no</code>, <code>PermitRootLogin prohibit-password</code> (later <code>no</code>). <code>sudo sshd -t &amp;&amp; sudo systemctl reload ssh</code>, then <code>sudo sshd -T | grep -E '^(passwordauth|permitroot)'</code>.</li>
<li>As in section 4; <code>docker info --format '{{.LoggingDriver}}'</code> prints <code>local</code>.</li>
<li>Outside: <code>redis-cli -h your-vps ping</code> ⇒ <code>PONG</code> despite ufw. Fix A: <code>-p 127.0.0.1:6379:6379</code>. Fix B: no <code>-p</code>, put the app on the same Docker network. (Fix C, for when you really need it: rules in the <code>DOCKER-USER</code> chain — the only chain Docker promises not to touch.)</li>
</ol>
</details>

${spring(true, 'Nothing here is Node-specific: the same VPS, user, SSH and firewall work for a Spring Boot jar in a container. Spring-specific is only the memory budget — a JVM wants 300–500 MB, so pick 2 GB and set -XX:MaxRAMPercentage.', [
  ['sb-17-1-dockerfile-spring', 'Spring Boot 17.1 — Dockerfile for a Spring Boot app'],
  ['sb-17-2-application-properties-docker', 'Spring Boot 17.2 — Configuration for containers'],
])}

<h3>On the job</h3>
<p>In outsourcing, the first day on a project often starts with "here is the server, here is a password". Ask for key access, and if you are the one setting it up, send the team a two-line handover: "password login is off, verified with sshd -T; only 22/80/443 are open, verified from outside". That sentence prevents the incident report.</p>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>"Why keys rather than passwords for SSH?"</strong> — Nothing guessable crosses the network, and bots brute-force passwords all day; keys can be revoked one by one.</li>
<li><strong>"You enabled ufw. Is the database safe?"</strong> — Not if its port is published: Docker's DNAT runs before ufw's INPUT rules. Bind to localhost or don't publish.</li>
<li><strong>"Who should be in the docker group?"</strong> — Only people you would give root: control of the daemon is root on the host.</li>
<li><strong>"How do you know a config change took effect?"</strong> — Ask the running program for its effective value (<code>sshd -T</code>, <code>nginx -T</code>, <code>docker info</code>) and test from outside.</li>
</ol>

<div class="kv-grid">
  <div class="kv"><span class="k">VPS</span><span class="v">Virtual machine you rent and administer yourself.</span></div>
  <div class="kv"><span class="k">ed25519</span><span class="v">Modern SSH key type: small, fast, recommended.</span></div>
  <div class="kv"><span class="k">drop-in</span><span class="v">Config fragment in a .d/ directory; order matters.</span></div>
  <div class="kv"><span class="k">sshd -T</span><span class="v">Prints the configuration sshd will actually use.</span></div>
  <div class="kv"><span class="k">DNAT</span><span class="v">Rewrites the destination of a packet; how -p works.</span></div>
  <div class="kv"><span class="k">DOCKER-USER</span><span class="v">iptables chain reserved for your rules about container traffic.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Size from measurements: the stack idles at ~200 MiB; build in CI so a small VPS only pulls.</li>
<li>Key login only — and verify with <code>sshd -T</code>, because the first value read wins.</li>
<li>Docker from its own repo, with a log limit from day one; the docker group equals root.</li>
<li>Published ports bypass ufw: publish nothing but the reverse proxy, and probe from outside.</li>
</ul>
${NGUON}
${THE}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Deploy</span>
<h2>VPS mới thuê là máy của người lạ, chỉ có tên bạn trên hoá đơn</h2>
<p class="lead">Mười chương ChiaSe chạy trên laptop, nơi kẻ tấn công duy nhất là chính bạn. Một máy có IP công khai thì vài phút sau đã có bot gõ cửa — chúng không biết ứng dụng của bạn tồn tại, chúng quét cả dải IPv4 tìm SSH mở, CSDL mở và tệp <code>.env</code> đọc được. Bài này biến một VPS Ubuntu 24.04 vừa thuê thành máy trả lời đúng ba cổng và nhận đúng một kiểu đăng nhập — và ĐO từng bước thay vì tin.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">khoá</span><span class="lz-d">ed25519 trên laptop, .pub đưa nhà cung cấp</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">người dùng</span><span class="lz-d">deployer có khoá; root chỉ để dựng máy</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">sshd</span><span class="lz-d">drop-in 01-, nghiệm thu bằng sshd -T + thử thật</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">docker</span><span class="lz-d">kho apt chính thức, trần log, nhóm docker = root</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">tường lửa</span><span class="lz-d">ufw 22/80/443 — và không công bố cổng CSDL nào</span></div>
</div>


<div class="callout info"><p><strong>Về cái VPS trong bài.</strong> Không có gì ở đây chạm vào máy chủ thật. "VPS" là một container (<code>ubuntu:24.04</code> + OpenSSH, RAM 2 GB, chạy đặc quyền để có Docker riêng bên trong) trên một mạng Docker riêng, nơi tên <code>chiase.test</code> trỏ về nó. "Laptop của bạn" và "một người lạ trên Internet" là hai container khác. Mọi lệnh dưới đây đúng là thứ bạn gõ trên VPS thật; chỗ nào mô phỏng khác (không có systemd), bài ghi rõ.</p></div>

<h3>1. Thuê máy cỡ nào? Đo, đừng đoán</h3>
<p>Bài 11.2 deploy cả stack rồi đo: lúc rảnh PostgreSQL ≈ 39 MiB, MinIO ≈ 71 MiB, API ≈ 83 MiB, Nginx ≈ 11 MiB — khoảng 200 MiB cho các container, ~1 GiB cho cả máy mô phỏng tính cả Docker và bộ đệm trang. Ảnh trên đĩa: 2,1 GB sau vài lần phát hành. Vậy:</p>
<table>
<tr><th></th><th>Tối thiểu chạy được</th><th>Thoải mái</th><th>Vì sao</th></tr>
<tr><td>RAM</td><td>1 GB + 2 GB swap</td><td>2 GB</td><td>Kéo và giải nén ảnh, <code>pg_dump</code>, migration đều diễn ra lúc deploy, chồng lên ứng dụng đang chạy.</td></tr>
<tr><td>CPU</td><td>1 vCPU</td><td>2 vCPU</td><td>argon2 (bài 3.1) tốn ~35 ms CPU mỗi lần đăng nhập; sharp thu nhỏ ảnh.</td></tr>
<tr><td>Đĩa</td><td>20 GB</td><td>40 GB</td><td>Ảnh cũ, log, bản sao lưu lớn lên mỗi tuần. Đĩa đầy thì Postgres chết trước.</td></tr>
<tr><td>Hệ điều hành</td><td colspan="2">Ubuntu 24.04 LTS (kho apt của Docker hỗ trợ; LTS = vá bảo mật tới 2029)</td><td>Giống đa số hướng dẫn và đa số công ty.</td></tr>
</table>
<p><strong>Thứ ngốn RAM là DỰNG trên VPS</strong> — <code>vite build</code>/<code>npm ci</code> trên máy 1 GB kết thúc bằng mã thoát 137. Chương 10 dựng ảnh trên CI nên VPS chỉ việc kéo. Chính quyết định đó làm VPS nhỏ chạy được.</p>
<p><strong>Phương án miễn phí.</strong> Đổi mỗi năm, nên xem trang chính thức của nhà cung cấp chứ đừng tin blog: gói miễn phí của các đám mây lớn (máy ảo nhỏ "luôn miễn phí", giới hạn chặt, cần thẻ), tín dụng cho sinh viên (ví dụ qua GitHub Student Developer Pack), và gói miễn phí của PaaS (ngủ khi không ai dùng). Mọi thứ trong chương chạy trên bất kỳ máy Ubuntu nào bạn SSH vào được; trên PaaS bạn bỏ qua 11.1 và nửa 11.2, đổi lại mất quyền với Nginx, cổng và sao lưu — xem bài so sánh ở cuối.</p>

<h3>2. Khoá SSH, không phải mật khẩu</h3>
<p>Trên <em>laptop của bạn</em>. ed25519: khoá ngắn, nhanh, là khuyến nghị mặc định của OpenSSH. Đời thật nhớ đặt passphrase (ở đây <code>-N ""</code> chỉ vì bài chạy bằng script):</p>
<div class="out">${KEYGEN}</div>
<p>Lúc tạo VPS, dán dòng <code>.pub</code> vào ô "SSH keys" của nhà cung cấp: họ ghi nó vào <code>/root/.ssh/authorized_keys</code>. Khoá bí mật không bao giờ rời laptop. VPS mô phỏng được dựng đúng như vậy — đây là toàn bộ thứ nó có trước khi bài bắt đầu:</p>
<pre><code class="language-dockerfile">${VPS_DF}</code></pre>

<h3>3. Đăng nhập lần đầu, người dùng deploy, và dòng cấu hình lặng lẽ thắng</h3>
<p>Dưới đây: đăng nhập lần đầu (khoá của máy chủ được ghim vào <code>known_hosts</code> — từ giờ một máy khác trả lời dưới tên <code>chiase.test</code> là LỖI, không phải câu hỏi), tạo <code>deployer</code>, chép khoá, rồi thử tắt mật khẩu. Đọc chậm; phần thú vị nằm ở giữa.</p>
<div class="out">${SSH}</div>
<p>Chuyện gì đã xảy ra:</p>
<ol>
<li>Root bằng mật khẩu bị từ chối ngay cả khi ta chưa đụng gì: mặc định của chính Ubuntu là <code>PermitRootLogin prohibit-password</code> (root chỉ vào bằng khoá). Nhưng <code>deployer</code> bằng mật khẩu thì VÀO ĐƯỢC — vì ảnh cloud có sẵn <code>/etc/ssh/sshd_config.d/50-cloud-init.conf</code> ghi <code>PasswordAuthentication yes</code>.</li>
<li>Ta ghi <code>70-chiase.conf</code> với <code>PasswordAuthentication no</code>. <code>sshd -t</code> qua, reload qua — mà <code>sshd -T</code> vẫn báo <strong><code>passwordauthentication yes</code></strong>, và mật khẩu vẫn vào. Trong <code>sshd_config</code>, <em>giá trị đọc được ĐẦU TIÊN thắng</em>, còn các tệp drop-in được đọc theo thứ tự chữ cái: <code>50-</code> đọc trước <code>70-</code>. Nửa tệp của ta có hiệu lực (<code>kbdinteractiveauthentication no</code> — không ai khác khai), nửa kia không. Nửa ăn nửa trượt là dấu vân tay của va chạm THỨ TỰ, không phải lỗi cú pháp.</li>
<li>Đổi tên thành <code>01-chiase.conf</code>: giờ nó được đọc đầu tiên, <code>sshd -T</code> báo <code>no</code>, và máy chủ chỉ còn mời <code>(publickey)</code>.</li>
</ol>
<div class="pitfall co-tieu-de"><p class="tieu-de">Bẫy: "đã lưu", "test OK" và "đã reload" là ba lời khẳng định, không cái nào là "đã có hiệu lực"</p><p>Nghiệm thu bằng lệnh in giá trị ĐANG HIỆU LỰC (<code>sshd -T</code>) và bằng một lần đăng nhập thật từ bên ngoài. Chính người vận hành trang web này đã dính đúng lỗi đó năm 2026 (drop-in thua <code>50-cloud-init.conf</code>, chỉ phát hiện vì bước kiểm dùng <code>sshd -T</code>). Khi sửa SSH luôn để mở sẵn một phiên SSH thứ hai: lỡ tự khoá mình ở ngoài thì phiên đó là đường quay vào.</p></div>
<p>Cuối giai đoạn dựng máy, bài 11.4 đặt thêm <code>PermitRootLogin no</code>: việc hằng ngày làm bằng <code>deployer</code>; việc quản trị dùng bảng điều khiển web của nhà cung cấp hoặc một người dùng có sudo. Trên Ubuntu thật reload bằng <code>sudo systemctl reload ssh</code> (bản mô phỏng không có systemd nên gửi thẳng <code>HUP</code> cho sshd).</p>

<h3>4. Docker từ kho apt của chính Docker</h3>
<p>Không phải <code>apt install docker.io</code> (cũ hơn, do Ubuntu bảo trì), cũng không phải script tiện lợi (tài liệu ghi rõ không dành cho production). Đúng các bước trong tài liệu Docker:</p>
<pre><code class="language-bash">sudo apt update &amp;&amp; sudo apt install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
sudo tee /etc/apt/sources.list.d/docker.sources &lt;&lt;EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release &amp;&amp; echo "\${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin</code></pre>
<div class="out">${DOCKER}</div>
<p>Trên VPS thật gói này tự bật Docker qua systemd (<code>systemctl status docker</code>); bản mô phỏng bật <code>dockerd</code> bằng tay. Trước khi chạy bất cứ thứ gì, đặt trần cho log — mặc định log container lớn vô hạn, và "đĩa đầy vì log" là sự cố kinh điển của tháng đầu:</p>
<pre><code class="language-json">// /etc/docker/daemon.json — rồi khởi động lại Docker
{
  "log-driver": "local",
  "log-opts": { "max-size": "20m", "max-file": "5" }
}</code></pre>
<p>(Tệp của bản mô phỏng có thêm <code>"insecure-registries": ["registry.chiase.test:5000"]</code> vì registry đóng vai GHCR không có TLS. VPS thật kéo từ <code>ghcr.io</code> qua HTTPS, không cần dòng đó — đừng bao giờ thêm nó cho một registry thật.)</p>

<h3>5. Nhóm docker chính là nhóm root</h3>
<p>Người dùng deploy phải chạy được <code>docker</code>. Hướng dẫn thường gặp: <code>usermod -aG docker deployer</code>. Hiểu mình vừa trao cái gì:</p>
<div class="out">${UFW.split('\n$ ssh root@chiase.test "rm /root')[0]}</div>
<p><code>deployer</code> không có sudo, vậy mà đọc được mấy byte đầu mã băm mật khẩu của root và tạo được tệp trong <code>/root</code>. Tài liệu của Docker: "only trusted users should be allowed to control your Docker daemon". Hệ quả: khoá SSH của <code>deployer</code> quý ngang khoá root (có passphrase, không dán vào chat, không để trên máy dùng chung); một job CI SSH được bằng <code>deployer</code> là chiếm được máy; và không bao giờ gắn <code>/var/run/docker.sock</code> vào container ứng dụng. Có Docker rootless nếu cần tách bạch; với dự án một người, coi <code>deployer</code> là root và giữ kỹ khoá.</p>

<h3>6. ufw nói deny. Postgres vẫn trả lời</h3>
<p>Tường lửa: chặn mọi thứ đi vào, mở SSH, 80 và 443. Rồi làm đúng việc mà cứ hai hướng dẫn thì một cái bảo làm — <code>-p 5432:5432</code> "để nối từ laptop" — và hỏi từ một máy <em>khác</em>:</p>
<div class="out">$ ssh root@chiase.test "… ufw default deny incoming … ufw --force enable && ufw status verbose"
${UFW.split('ufw status verbose"')[1]}</div>
<p><code>ufw status</code> chỉ liệt kê 22, 80, 443 — vậy mà người lạ chạm được PostgreSQL ở 5432. Cổng 8080 (không công bố gì) bị treo tới hết giờ, tức là ufw CÓ chạy. Vì sao:</p>
<div class="out">${UFW_SUA}</div>
<p>Cổng công bố là một luật DNAT trong bảng <code>nat</code>: gói tin bị đổi đích sang địa chỉ container <em>trước khi</em> tới chuỗi <code>INPUT</code> — nơi luật của ufw nằm — rồi đi qua chuỗi <code>FORWARD</code>, nơi có sẵn luật <code>ACCEPT</code> của Docker. Tài liệu Docker nói thẳng: cổng công bố "bypass your firewall rules". Cách sửa không phải một luật ufw khéo hơn, mà là đừng công bố: gắn vào <code>127.0.0.1</code> (như trên — người lạ giờ nhận "no response"), hoặc tốt hơn, không công bố gì và để các container nói chuyện qua mạng compose. Trong <code>compose.prod.yaml</code> (11.2) chỉ container web công bố cổng, và chỉ trên <code>127.0.0.1:8080</code>.</p>

<h3>🕵️ Góc hacker — những CSDL không ai định công bố</h3>
<p>PGMiner (Palo Alto Networks Unit 42, 10/12/2020) là phiên bản của câu chuyện này viết đúng cho stack của ta: một botnet quét cổng 5432 trên các mạng nội bộ và những dải IP công khai chọn ngẫu nhiên, dò mật khẩu của người dùng mặc định <code>postgres</code> bằng "một danh sách mật khẩu phổ biến có sẵn", rồi lạm dụng tính năng dành cho superuser <code>COPY … FROM PROGRAM</code> (PostgreSQL 9.3 trở lên) để chạy shell script ngay trên máy chủ — tải máy đào Monero, cài crontab, giết các máy đào đối thủ, xoá bảng của nó để không để lại dấu. Nạn nhân nào cũng có chung một điểm: cổng 5432 với tới được từ Internet. Trong phần lớn các bản tường trình kiểu này, chủ máy CÓ tường lửa — và một cái <code>-p</code> họ không để ý. Phòng thủ trong chương: (1) không bao giờ công bố cổng CSDL, (2) <code>ss -tlnp</code> trên máy chủ kèm một lần dò cổng từ BÊN NGOÀI sau mỗi lần đổi hạ tầng (Checkpoint 11 làm việc đó), (3) mật khẩu dài sinh ngẫu nhiên cả cho dịch vụ nội bộ, và ứng dụng nối bằng người dùng thường chứ không phải superuser — để một sơ suất chưa thành mất máy.</p>

<h3>7. Mấy thứ nhỏ cứu tháng đầu tiên</h3>
<ul>
<li><strong>Swap</strong> cho VPS 1–2 GB (<code>fallocate -l 2G /swapfile</code> …) — lần deploy kéo ảnh mới trong lúc ảnh cũ đang chạy có thể làm bộ nhớ tăng gấp đôi trong chốc lát. Bài liên kết ở dưới.</li>
<li><strong>Tự cập nhật bảo mật</strong>: <code>unattended-upgrades</code> có sẵn trên ảnh cloud của Ubuntu; kiểm xem nó đang bật.</li>
<li><strong>Múi giờ UTC</strong> trên máy chủ; đổi giờ lúc hiển thị. Log của ba máy ở ba múi giờ là không đọc nổi.</li>
<li><strong>Một tệp ghi chú</strong> trong repo (<code>docs/van-hanh.md</code>): IP, nhà cung cấp, ai giữ khoá, sao lưu nằm đâu. Ba tháng sau bạn sẽ quên.</li>
</ul>

<h3>🧪 Lab 11.1 — gia cố một máy và chứng minh từ bên ngoài</h3>
<div class="callout ok">
<p>Trên VPS của bạn (hoặc bản mô phỏng: container <code>ubuntu:24.04</code> + OpenSSH):</p>
<ol>
<li>Tạo <code>deployer</code> với khoá của bạn; tắt đăng nhập bằng mật khẩu. Cho thấy giá trị ĐANG HIỆU LỰC bằng <code>sshd -T</code> và một lần đăng nhập mật khẩu bị từ chối từ laptop.</li>
<li>Cài Docker từ kho của Docker, đặt trần log, thêm <code>deployer</code> vào nhóm docker.</li>
<li>Bật ufw (22, 80, 443). Chạy <code>docker run -d -p 6379:6379 redis:8-alpine</code> rồi chứng minh từ một máy <em>khác</em> rằng nó trả lời. Sửa theo hai cách và chứng minh từng cách.</li>
</ol>
<p><strong>Xong khi:</strong> từ bên ngoài chỉ 22/80/443 trả lời; <code>ssh -o PubkeyAuthentication=no deployer@vps-cua-ban</code> in <code>Permission denied (publickey)</code>.</p>
</div>
<details><summary>Lời giải</summary>
<ol>
<li>Drop-in tên <code>01-…conf</code> (xếp trước <code>50-cloud-init.conf</code>): <code>PasswordAuthentication no</code>, <code>KbdInteractiveAuthentication no</code>, <code>PermitRootLogin prohibit-password</code> (sau đó là <code>no</code>). <code>sudo sshd -t &amp;&amp; sudo systemctl reload ssh</code>, rồi <code>sudo sshd -T | grep -E '^(passwordauth|permitroot)'</code>.</li>
<li>Như mục 4; <code>docker info --format '{{.LoggingDriver}}'</code> in <code>local</code>.</li>
<li>Từ ngoài: <code>redis-cli -h vps-cua-ban ping</code> ⇒ <code>PONG</code> dù có ufw. Cách A: <code>-p 127.0.0.1:6379:6379</code>. Cách B: bỏ <code>-p</code>, cho ứng dụng vào cùng mạng Docker. (Cách C, khi thật sự cần: luật trong chuỗi <code>DOCKER-USER</code> — chuỗi duy nhất Docker hứa không đụng tới.)</li>
</ol>
</details>

${spring(false, 'Không có gì ở đây riêng cho Node: cùng VPS, người dùng, SSH, tường lửa đó chạy được tệp jar Spring Boot trong container. Khác biệt duy nhất là ngân sách bộ nhớ — JVM muốn 300–500 MB, nên chọn máy 2 GB và đặt -XX:MaxRAMPercentage.', [
  ['sb-17-1-dockerfile-spring', 'Spring Boot 17.1 — Dockerfile cho ứng dụng Spring Boot'],
  ['sb-17-2-application-properties-docker', 'Spring Boot 17.2 — Cấu hình cho môi trường container'],
])}

<h3>Tình huống đi làm thật</h3>
<p>Ở công ty outsourcing, ngày đầu vào dự án hay bắt đầu bằng "máy chủ đây, mật khẩu đây". Hãy xin quyền bằng khoá; còn nếu bạn là người dựng máy, gửi nhóm hai dòng bàn giao: "đã tắt đăng nhập mật khẩu, kiểm bằng sshd -T; chỉ 22/80/443 mở, kiểm từ bên ngoài". Câu đó chặn trước một bản báo cáo sự cố.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Sao SSH dùng khoá mà không dùng mật khẩu?"</strong> — Không có gì đoán được đi qua mạng, bot dò mật khẩu cả ngày; khoá thu hồi được từng cái một.</li>
<li><strong>"Bạn bật ufw rồi. CSDL an toàn chưa?"</strong> — Chưa, nếu cổng của nó được công bố: DNAT của Docker chạy trước luật INPUT của ufw. Gắn vào localhost hoặc đừng công bố.</li>
<li><strong>"Ai nên ở trong nhóm docker?"</strong> — Chỉ những người bạn dám đưa quyền root: điều khiển daemon là root trên máy.</li>
<li><strong>"Sao biết một thay đổi cấu hình đã có hiệu lực?"</strong> — Hỏi chính chương trình đang chạy giá trị hiệu lực (<code>sshd -T</code>, <code>nginx -T</code>, <code>docker info</code>) và thử từ bên ngoài.</li>
</ol>

<div class="kv-grid">
  <div class="kv"><span class="k">VPS</span><span class="v">Máy ảo bạn thuê và tự quản trị.</span></div>
  <div class="kv"><span class="k">ed25519</span><span class="v">Kiểu khoá SSH hiện đại: ngắn, nhanh, được khuyến nghị.</span></div>
  <div class="kv"><span class="k">drop-in</span><span class="v">Mảnh cấu hình trong thư mục .d/; thứ tự đọc quyết định ai thắng.</span></div>
  <div class="kv"><span class="k">sshd -T</span><span class="v">In cấu hình sshd THỰC SỰ dùng.</span></div>
  <div class="kv"><span class="k">DNAT</span><span class="v">Đổi đích của gói tin; cách -p hoạt động.</span></div>
  <div class="kv"><span class="k">DOCKER-USER</span><span class="v">Chuỗi iptables dành cho luật của bạn về lưu lượng container.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Chọn cỡ máy theo số đo: stack rảnh ~200 MiB; dựng trên CI để VPS nhỏ chỉ việc kéo.</li>
<li>Chỉ đăng nhập bằng khoá — và nghiệm thu bằng <code>sshd -T</code>, vì giá trị đọc đầu tiên thắng.</li>
<li>Docker từ kho của Docker, có trần log từ ngày đầu; nhóm docker ngang root.</li>
<li>Cổng công bố đi vòng ufw: chỉ công bố reverse proxy, và dò cổng từ bên ngoài.</li>
</ul>
${NGUON}
${THE}
</div>
`,
};
