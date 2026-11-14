/**
 * Chương 14 · 14.3 — SSH khi cổng 22 bị chặn (soạn 14/11/2026). Ca THẬT của kho: mạng trường chỉ mở TCP 80/443/587/993 ⇒ VPS nghe SSH ở
 * CẢ 22 và 993 (ssh993.service riêng, không sửa ssh.socket), ~/.ssh/config có khối "Match host … exec" tự chọn cổng theo mạng, máy nhà
 * nối về VPS bằng đường hầm ngược 2222. Kể KHÔNG lộ IP/tên máy/tường lửa thật — mọi tên trong bài là vps.example.
 * Output thật: lab/out/c143-* (lab "Wi-Fi trường trong một hộp" mở rộng: vps chạy systemd thật, mạng nhà sau CGNAT —
 * bash lab/code/dung-output-ch14b.sh). Bẫy đo được khi soạn: autossh KHÔNG dựng lại khi ssh bị giết bằng SIGTERM (coi là cố ý) ⇒ đo bằng
 * rớt mạng thật ở router nhà; curl 8.18 báo nhầm "Could not resolve proxy" khi --socks5 không phân giải được tên ĐÍCH.
 */
import { run, card, kv, cmd } from '../_ui.mjs';
import { net } from '../_lab.mjs';
import G from '../giang/nfd-14-3.mjs';

const L = card;
const R = (f, p, n = 1, o = {}) => run(f, p, n, { drop: /^# /, ...o });
const bai = (slug) => `/courses/networking-for-developers/learn?lessonSlug=${slug}`;
const MAC_CFG = cmd(
  '# ~/.ssh/config on the Mac / trên máy Mac',
  'Match host vps,vps.example exec "ipconfig getifaddr en0 | grep -q \'^10\\.\'"',
  '  Port 993',
  'Host vps',
  '  HostName vps.example',
  '  User sv',
  '  Port 22',
);
const KEEP = cmd(
  '# client (~/.ssh/config) — notice a dead link in ~30 s / máy khách: phát hiện đường chết sau ~30 giây',
  'ServerAliveInterval 10',
  'ServerAliveCountMax 3',
  '# server (/etc/ssh/sshd_config.d/…) — drop a dead session so its forwarded port is freed / máy chủ: bỏ phiên chết để nhả cổng',
  'ClientAliveInterval 15',
  'ClientAliveCountMax 2',
);

export default {
  title: '14.3 — SSH when port 22 is blocked: a side door, a config that picks the port, tunnels -L/-R/-D|||14.3 — SSH khi cổng 22 bị chặn: cửa phụ, config tự chọn cổng, đường hầm -L/-R/-D',
  slug: 'netdev-14-3-ssh-cong-bi-chan',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Ca thật của chính máy chủ khoá học: mạng trường chỉ mở TCP 80/443/587/993 nên SSH cổng 22 treo. Mở cửa phụ 993 trên VPS Ubuntu (và cái bẫy ssh.socket khoá mình ngoài cửa), ~/.ssh/config tự chọn cổng theo mạng, đường hầm -L kéo CSDL về, -R khoe bản demo, -D làm proxy SOCKS (và rò DNS), máy nhà sau CGNAT với đường hầm ngược + ProxyJump + autossh sau một lần rớt mạng thật, nếu trường soi gói (DPI) thì bọc SSH trong TLS, và góc kẻ xấu: bot dò mật khẩu, SOCKS mở toang, thứ tự drop-in.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.3</span>
<h2>SSH when port 22 is blocked: a side door, a config that picks the port, tunnels -L/-R/-D</h2>
<p class="lead">A real case from the server that runs this course: at school, <code>ssh</code> to the VPS just hangs. The school Wi-Fi opens only TCP 80, 443, 587 and 993 (lesson 14.2) — and SSH lives on 22. The server is fine; the road to its front door is closed. This lesson opens a side door safely, makes the laptop pick the right door by itself, and then uses SSH as what it really is: an encrypted tunnel that can carry a database, a demo or a whole browser through the one door that is open.</p>

<h3>The everyday picture</h3>
<ul>
<li><strong>Port 22 blocked</strong> = the main gate of the building is locked at night. The building is not closed; you use the side door that the guard keeps open for deliveries (993 is the mail door: schools must keep it open for email).</li>
<li><strong>SSH key</strong> = the guard keeps a photo of your face (the public key); you keep your face (the private key). Nobody can "guess" a face, while a password can be guessed.</li>
<li><strong>Tunnel</strong> = a private pipe through that side door: whatever you put in at one end comes out at the other, and the guard only sees the pipe.</li>
</ul>

<h3>1 — Same server, two doors</h3>
<p>The lab reuses the "school Wi-Fi in a box" from 14.1–14.2, with all the school rules still on, plus a rented server <code>vps.example</code> that runs <strong>real systemd</strong>, like an Ubuntu VPS. First the key pair, made on the laptop:</p>
${R('c143-khoa', 'ssh-keygen', 3)}
<p>The private key stays on the laptop, readable only by you (<code>-rw-------</code>). The public key (<code>.pub</code>) is pasted into the provider's panel when you create the VPS, which writes it into <code>~/.ssh/authorized_keys</code> on the server. Now, from the school Wi-Fi:</p>
${R('c143-cong', 'ssh -o ConnectTimeout', 3)}
<p>Port 22 hangs and times out — the school's DROP from 14.2. Port 993 of <em>the same VPS</em> answers at once. Read the <code>-v</code> lines in order: TCP connects to 993, the server greets with its software version, proves who it is with its <strong>host key</strong>, and we log in with the key — no password ever crossed the network. The first time, ssh stores that host key ("Permanently added"); next time, a different key means someone is in the middle (see the attacker's corner).</p>

<h3>2 — Opening the side door on Ubuntu (and the trap that locks you out)</h3>
<p>Every old tutorial says: add <code>Port 993</code> to <code>/etc/ssh/sshd_config</code> and restart sshd. On a modern Ubuntu that does not do what you think, because <strong>systemd</strong>, not sshd, holds the port (<em>socket activation</em>: <code>ssh.socket</code> listens, and starts sshd when someone connects):</p>
${R('c143-bay', 'systemctl is-enabled', 7)}
<p>Trap 1: after the edit and the restart, the port list still shows only 22 — and look who holds it: <code>systemd</code>. Trap 2 is worse. A small systemd <em>generator</em> does read <code>Port</code> and rewrites the socket — but only after <code>daemon-reload</code> plus a restart of <code>ssh.socket</code>, and a lone <code>Port 993</code> <strong>replaces</strong> 22 instead of adding to it:</p>
${R('c143-bay', 'cat /run', 3)}
<p>On a real VPS you are typically connected through 22 while doing this. One restart later, 22 is gone; if 993 is blocked from where <em>you</em> are (or a firewall forgets it), you are locked out. To keep both you would write <code>Port 22</code> and <code>Port 993</code> — and still restart the socket on a live server. The safer way <strong>adds</strong> a second listener and touches nothing that already works:</p>
${R('c143-dichvu', 'cat >', 3)}
<p>Port 22 still belongs to <code>ssh.socket</code>; 993 belongs to a separate sshd started by <code>ssh993.service</code> (<code>-p 993</code> overrides every <code>Port</code> line). <code>ExecStartPre=sshd -t</code> refuses to start on a broken config. If anything goes wrong with the new service, the old door is untouched. On the real server this was applied from a GitHub Actions runner (because the network in front of the developer blocked 22), which started the service, checked five conditions — 993 answers, 22 still answers, the home tunnel still lives… — and removed the service by itself if any check failed.</p>
<div class="pitfall co-tieu-de"><p><strong>Measured, not assumed.</strong> Both traps above are the lab's real output on Ubuntu with <code>ssh.socket</code> enabled (the default since Ubuntu 22.10; the server in our case runs 24.04). Check first with <code>systemctl is-enabled ssh.socket</code>, and always verify with <code>ss -tlnp</code> what is really listening — "the command returned 0" is not "it works".</p></div>

<h3>3 — A ~/.ssh/config that picks the door by itself</h3>
<p>Typing <code>-p 993</code> at school and nothing at home gets old fast. OpenSSH can decide: a <code>Match … exec</code> block runs a small command and applies its settings only if the command succeeds. First attempt:</p>
${R('c143-config', 'cat > ~/.ssh/config', 2, { lan: 1 })}
<p>Port 22 — even at school. The rule: <strong>for each option, ssh keeps the first value it meets</strong> while reading the file top to bottom. <code>Host vps</code> already said <code>Port 22</code>, so the later 993 is ignored. Move the <code>Match</code> block to the top:</p>
${R('c143-config', 'cat > ~/.ssh/config', 3, { lan: 2 })}
<p>At school (an address in 10.20.2.x) ⇒ 993; the last line proves the connection really came in on 993 (<code>$SSH_CONNECTION</code> ends with the server's port). The same laptop at home, same file:</p>
${R('c143-config-nha', 'ip -4', 3)}
<p>On a Mac the test is usually the Wi-Fi address of <code>en0</code>; this is the shape of the real config (with a placeholder name):</p>
${MAC_CFG}
<p><code>ssh -G name</code> prints the final configuration without connecting — use it every time you edit the file. The same "first value wins" rule exists on the server side (sshd's drop-in files) — we meet it again in the attacker's corner.</p>
${net('tunnel', 'port', 'en', 'School vs home: watch ssh read the config top to bottom, pick 22 or 993, and see where each packet dies.', { tour: 'tunnel-port' })}

<h3>4 — Tunnels: SSH carries other connections</h3>
<p>One SSH connection can carry many other TCP connections inside it. Three flags, three directions:</p>
<div class="table-wrap"><table>
<tr><th>Flag</th><th>Direction</th><th>Everyday use</th></tr>
<tr><td><code>-L 16379:127.0.0.1:6379</code></td><td>pull a port of the server to your laptop</td><td>open the VPS database, Grafana, an admin page that listens only on 127.0.0.1</td></tr>
<tr><td><code>-R 8080:localhost:3000</code></td><td>push a port of your laptop out to the server</td><td>show the demo running on your laptop to a friend or a teacher</td></tr>
<tr><td><code>-D 1080</code></td><td>a SOCKS proxy on your laptop that exits at the server</td><td>a browser or any app "goes out" from the VPS</td></tr>
</table></div>

<h4>-L: bring the server's database home</h4>
${R('c143-L-vps', 'ss', 2)}
<p>Redis on the VPS listens only on <code>127.0.0.1</code> — the right way: a database should never answer the Internet. From the laptop:</p>
${R('c143-L', 'nc', 5)}
<p>Direct: timeout. Through <code>-L</code>: the laptop opens 127.0.0.1:16379, and whatever connects there is carried inside SSH and comes out <em>on the VPS</em> towards 127.0.0.1:6379 — so for Redis, the client is local. <code>-f -N</code> = go to the background, run no command. The same line works for Postgres (5432), MySQL (3306), or a dashboard on 3000.</p>

<h4>-R: show the demo running on your laptop</h4>
${R('c143-R', 'mkdir', 3)}
${R('c143-R-ban1', 'curl', 1)}
<p>The friend at home is refused. On the VPS:</p>
${R('c143-R-vps', 'ss', 3)}
<p>By default a remote forward opens only <code>127.0.0.1</code> on the server — a safe default. <code>GatewayPorts clientspecified</code> lets the client ask for another address:</p>
${R('c143-R2', 'pkill', 3)}
${R('c143-R-ban2', 'curl', 1)}
<p>Your laptop, sitting behind the school's NAT where nobody can call it, now serves a page to the whole Internet through the VPS. That is exactly why it deserves the attacker's corner below. Services like ngrok or Cloudflare Tunnel are this idea, managed.</p>

<h4>-D: a SOCKS proxy through the VPS</h4>
${R('c143-D', 'ssh -f', 5)}
<p>Four lines, four lessons:</p>
<ul>
<li><code>social.test</code> direct: reset — the SNI filter of 14.2. Through SOCKS: OK, and the site sees the <strong>VPS</strong> as the visitor (<code>198.18.0.30</code>). The school saw only an encrypted flow to the VPS; the name never appeared on its wire.</li>
<li><code>--socks5</code> versus <code>--socks5-hostname</code>: with plain <code>--socks5</code> curl resolves the name <em>on the laptop</em> — through the school DNS, which answers NXDOMAIN for <code>phim.test</code>. That is a <strong>DNS leak</strong>: the content goes through the tunnel, the names do not. (curl 8.18 even mislabels the error as "Could not resolve proxy" — the proxy is fine, the target name is not.) <code>--socks5-hostname</code> (also written <code>socks5h://</code>) sends the name to the VPS to resolve. In Firefox the switch is "Proxy DNS when using SOCKS v5".</li>
</ul>
<p>What the school firewall saw:</p>
${R('c143-D-gw', 'iptables', 2)}
<p>The SNI rule caught exactly one packet — the direct try. Everything else is connections to the VPS on 993. Note what SOCKS through SSH cannot do: UDP. Games and calls (lesson 14.2) still die; for those you need a VPN (lesson 14.4).</p>
${net('tunnel', 'socks', 'en', 'Follow one request through -L, -R and -D: which machine opens the connection, and what the school sees.', { tour: 'tunnel-socks' })}

<h3>5 — The machine at home, behind CGNAT</h3>
<p>Many students keep a Linux box at home (for builds, a database, a GPU). From school you want to reach it. But:</p>
${R('c143-cgnat', 'ip', 2)}
${R('c143-vao-nha', 'nc', 2)}
<p>The home router's WAN address is <code>100.64.0.2</code> — in <code>100.64.0.0/10</code>, the range reserved for carrier-grade NAT (RFC 6598) — while the Internet sees the ISP's <code>198.18.0.40</code>. Two NATs stand between the Internet and your machine, and you control neither the second one nor its ports (lesson 14.6 measures this in detail). Nobody can call in. The trick: <strong>connections going out always work</strong>, so the home machine calls the VPS and leaves a door open there:</p>
${R('c143-ham-nha', 'AUTOSSH', 2)}
${R('c143-ham-vps', 'cut', 2)}
<p>The home key on the VPS is tied down with <code>restrict,port-forwarding,permitlisten="localhost:2222"</code>: no shell, no other forwards — if the home machine is ever stolen, its key opens one loopback port and nothing else. From school, one entry in the config:</p>
${R('c143-jump', 'cat >>', 3)}
<p><code>ProxyJump vps</code> = first SSH to the VPS (on 993, picked by the Match block), then from there to <code>localhost:2222</code>, which is the tunnel home. Two logins, both by key, and the home machine never opened a port.</p>

<h4>A real outage: what keeps the tunnel alive</h4>
<p>We cut the home Internet for 45 seconds at the router and watched:</p>
${R('c143-autossh', 'date', 6)}
${R('c143-autossh-vps', 'J()', 5)}
<p>The story in the timestamps: the cut started about two seconds after the first line; <code>ssh</code> noticed about 38 seconds later — <code>ServerAliveInterval 10</code> × <code>ServerAliveCountMax 3</code>, plus the last probe — and exited; <code>autossh</code> restarted it at once. But when the network came back, the VPS still had the <strong>old</strong> session holding port 2222 ("Address already in use"), so each new tunnel failed, until the VPS finally received a reset for the old connection and let it go. Total: a 45-second outage cost the tunnel about 80 seconds. Settings worth copying:</p>
${KEEP}
<div class="pitfall co-tieu-de"><p><strong>The test that lied first.</strong> Our first "outage" was <code>pkill ssh</code> — and autossh simply stopped. autossh treats an ssh killed by SIGTERM/SIGINT/SIGKILL as "the user wanted this" and exits; it restarts only when ssh dies on its own (exit 255). To force a restart use <code>kill -USR1</code> on autossh; to test reality, cut the network as we did. On a server, run autossh (or plain ssh with <code>Restart=always</code>) as a systemd service.</p></div>

<h3>6 — "What if" the school inspects packets (DPI)?</h3>
<p>Ports are only labels. A firewall that looks inside packets can recognise the protocol itself — every SSH connection starts with the text <code>SSH-2.0-</code> in clear:</p>
${R('c143-dpi-gw', 'iptables', 1)}
${R('c143-dpi', 'ssh vps true', 3)}
<p>SSH dies on 993 and on 443 alike, while HTTPS to the same 443 keeps working. On the VPS, <strong>sslh</strong> listens on 443 and sorts incoming connections: plain SSH → sshd, TLS → the web server — and TLS whose name (SNI) is <code>ssh.vps.example</code> → a small TLS endpoint that unwraps it into sshd. On the laptop, <code>openssl s_client</code> wraps SSH in TLS:</p>
${R('c143-dpi', 'cat >>', 2, { drop: /^(depth|verify)/ })}
${R('c143-dpi-doc', 'iptables', 1)}
<p>To the firewall it is now one more HTTPS connection (its counter stopped at the two plain-SSH attempts). Limits: a network that installs its own certificate on your laptop to inspect TLS can read this too (lesson 6.4); a network that blocks your VPS's IP blocks everything. Where a rule explicitly forbids tunnels, follow the rule.</p>

<h3>🕵️ The attacker's corner</h3>
<ul>
<li><strong>Bots try passwords on every SSH port on the Internet</strong>, all day — on 22 and on 993 alike (a different port reduces noise, not risk). The defence is to offer no password at all:</li>
</ul>
${R('c143-do', 'for u', 1)}
${R('c143-do-vps', 'sshd -T', 3)}
<p>"Permission denied (publickey)" — the server lists only <code>publickey</code>, so there is nothing to guess. Note the source address in the log: <code>198.18.0.1</code>, the school's NAT. Every student at school has that address — a fail2ban that bans it after a few failures locks out your whole class (and you). Now the trap that hit the real server:</p>
${R('c143-do-vps', 'mv', 4)}
<p>Same content, different file name. Ubuntu cloud images ship <code>50-cloud-init.conf</code> with <code>PasswordAuthentication yes</code>, and for sshd too <strong>the first value read wins</strong>, with drop-ins read in alphabetical order — so a <code>70-</code> file saying "no" is silently ignored. Name your file <code>01-</code>, and verify with <code>sshd -T</code> (the effective values), never by reading the file you just wrote.</p>
<ul>
<li><strong>An open SOCKS proxy.</strong> <code>-D 0.0.0.0:1081</code> instead of <code>-D 1080</code>, and anyone on the same Wi-Fi uses your tunnel:</li>
</ul>
${R('c143-D-mo', 'ss', 1)}
${R('c143-D-ke', 'curl', 2)}
<p>The stranger's traffic leaves from <em>your</em> VPS, under your name and your provider account. Keep forwards on 127.0.0.1 (the default) unless you mean otherwise.</p>
<ul>
<li><strong>-R opens a hole into wherever your laptop is.</strong> <code>-R 0.0.0.0:8080:10.20.2.50:80</code> would publish a machine of the school's internal network to the Internet. That is the kind of thing that ends with a network administrator at your desk — and it is how attackers keep a foothold inside networks. Close tunnels you no longer need; publish only your own dev server, and only while you demo.</li>
<li><strong>Host key changed?</strong> "WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED" means stop. On a hostile Wi-Fi (14.1's evil twin) it can be someone in the middle. Compare the fingerprint with the provider's console before you accept it.</li>
<li><strong>Your private key is the house key.</strong> Put a passphrase on it (<code>ssh-keygen -p</code>), never copy it to a lab or a shared machine, and avoid <code>ForwardAgent</code> to servers you do not trust — their root can use your agent while you are logged in.</li>
</ul>

<h3>When every door is shut: the lifeline</h3>
<p>If neither 22 nor 993 is reachable from where you sit, someone else's network can still reach your server: a CI runner. A GitHub Actions workflow that holds the deploy key in a secret runs on GitHub's network, not yours. Keep two manual workflows ready — one read-only (which ports listen, is the tunnel up, is the firewall what you think) and one that applies a change, checks it, and undoes it by itself if the check fails. Never delete the secrets they use.</p>

<h3>"What if…"</h3>
<ul>
<li><strong>…the school opens 443 but not 993?</strong> Put sshd (or sslh) on 443 — the lab's VPS answers SSH on 443 too.</li>
<li><strong>…even 443 only works through the school's web proxy?</strong> SSH can go through an HTTP proxy with <code>ProxyCommand nc -X connect -x proxy:3128 %h %p</code>, if the proxy allows CONNECT to your server.</li>
<li><strong>…the tunnel works but is slow?</strong> TCP inside TCP: on a lossy Wi-Fi both layers retransmit. For long-lived, heavy use a VPN on UDP is better — when UDP is allowed (14.4).</li>
<li><strong>…git push hangs at school?</strong> GitHub also answers SSH on port 443 at <code>ssh.github.com</code>: <code>Host github.com → HostName ssh.github.com, Port 443</code>. Or use HTTPS remotes.</li>
</ul>

<h3>Where this lives in the computer</h3>
<ul>
<li>On the server, the listening socket of port 22 belongs to PID 1 (<code>systemd</code>) until a connection arrives; <code>ssh993</code> is an ordinary sshd process holding its own socket.</li>
<li>Forwarded ports are ordinary listening sockets owned by the <code>ssh</code> process (laptop, for -L/-D) or by <code>sshd-session</code> (server, for -R) — <code>ss -tlnp</code> shows who.</li>
<li>Keys: <code>~/.ssh/id_ed25519</code> (private, 600) and <code>.pub</code>; the server's list is <code>~/.ssh/authorized_keys</code>; the known servers are <code>~/.ssh/known_hosts</code>.</li>
</ul>

<h3>🧪 Practice (30 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> week one at school, the Wi-Fi opens only 80/443/587/993, and you must deploy tonight from the library. Use the lab (<code>GIU_LAB=1 bash lab/code/dung-output-ch14b.sh</code>), from <code>nft-win</code> and <code>nft-vps</code>.</p>
<ol>
<li>On <code>nft-vps</code>, check who holds port 22 and whether <code>ssh993</code> runs. Explain in one sentence why you must not "just add Port 993".</li>
<li>On <code>nft-win</code>, write a <code>~/.ssh/config</code> with a <code>Match</code> block that picks 993 at school and 22 elsewhere. Prove it with <code>ssh -G</code> on <code>nft-win</code> and <code>nft-lap</code>.</li>
<li>Open the VPS's Redis on your laptop with <code>-L</code>, read <code>diem:SE12345</code>.</li>
<li>Open a SOCKS proxy and fetch <code>http://phim.test/</code> without a DNS leak.</li>
<li>Reach <code>may-nha</code> from school with one command.</li>
</ol>
<p><strong>Done when:</strong> each step has a command and its real output, and <code>sshd -T</code> on the VPS shows <code>passwordauthentication no</code>.</p>
<details><summary>Solution</summary><p>1: <code>systemctl is-enabled ssh.socket</code> → enabled; <code>ss -4tlnp</code> shows systemd on :22 and sshd on :993 — editing Port and restarting the socket would REPLACE 22. 2: the Match block of section 3, placed first; <code>ssh -G vps | grep ^port</code> → 993 at school, 22 at home. 3: <code>ssh -f -N -L 16379:127.0.0.1:6379 vps; redis-cli -p 16379 get diem:SE12345</code>. 4: <code>ssh -f -N -D 1080 vps; curl --socks5-hostname 127.0.0.1:1080 http://phim.test/</code> (not <code>--socks5</code>). 5: the <code>Host nha</code> entry with <code>ProxyJump vps</code>, then <code>ssh nha</code>.</p></details>
</div>

<details><summary>🧠 Self-check (5 questions)</summary>
<ol>
<li>You added <code>Port 993</code> and restarted sshd on Ubuntu 24.04; <code>ss</code> still shows only 22. Why? — <em>ssh.socket (systemd) holds the port; sshd's Port matters only through the generator after daemon-reload + socket restart.</em></li>
<li>Why did <code>Port 993</code> in a Match block at the end of the file not apply? — <em>ssh keeps the first value it meets; Host vps had already set Port 22.</em></li>
<li>Which flag shows a demo on your laptop to someone on the Internet? — <em>-R (plus GatewayPorts on the server for a non-loopback bind).</em></li>
<li>What is the difference between <code>--socks5</code> and <code>--socks5-hostname</code>? — <em>Who resolves the name: the laptop (leaks to local DNS) or the proxy.</em></li>
<li>Why can't a VPS connect to your home machine behind CGNAT, and how does the home machine get reached anyway? — <em>Two NATs, no port you can forward; the home machine opens an outgoing reverse tunnel (-R) to the VPS.</em></li>
</ol></details>

<h3>🗂 Key terms</h3>
${kv([
    ['socket activation (kích hoạt qua socket)', 'systemd holds the listening port and starts the service on the first connection (ssh.socket on Ubuntu).'],
    ['Match … exec', 'An ~/.ssh/config block applied only if a command succeeds — e.g. "am I on the school network?".'],
    ['local forward -L', 'A port on your machine carried through SSH to an address seen from the server.'],
    ['remote forward -R', 'A port on the server carried back to an address seen from your machine.'],
    ['dynamic forward -D (SOCKS)', 'A SOCKS proxy on your machine; each connection exits at the server.'],
    ['ProxyJump (-J)', 'SSH through an intermediate host to a host behind it.'],
    ['CGNAT', 'Carrier-grade NAT: the ISP NATs your router again (100.64.0.0/10) — no inbound connections.'],
    ['DPI (soi gói)', 'Deep packet inspection: a firewall that recognises protocols by content, not by port.'],
  ])}

<h3>📌 Summary</h3>
<ul>
<li>Port 22 blocked ≠ server down: add a second listener on an allowed port, as a separate service — editing <code>Port</code> on a socket-activated Ubuntu can lock you out.</li>
<li><code>Match host … exec</code> picks the port per network; put it first, because the first value wins — check with <code>ssh -G</code>.</li>
<li>-L pulls a server port home, -R pushes a laptop port out, -D is a SOCKS proxy; use socks5h to avoid a DNS leak, bind to 127.0.0.1.</li>
<li>Behind CGNAT nobody calls in: tunnel out from home (autossh + keepalives both sides), jump in via the VPS.</li>
<li>Keys only, drop-in <code>01-</code>, verify with <code>sshd -T</code>; DPI reads protocols, so wrap SSH in TLS if it must look like HTTPS.</li>
</ul>
<p>Related lessons: <a href="${bai('netdev-14-2-mang-truong-chan')}">14.2 What the school network blocks</a> · <a href="${bai('netdev-2-3-nat')}">2.3 NAT</a> · <a href="${bai('netdev-10-3-reverse-forward')}">10.3 Reverse and forward proxies, tunnels</a> · <a href="${bai('netdev-6-4-loi-tls')}">6.4 TLS errors</a> · <a href="${bai('netdev-4-5-keepalive-pool')}">4.5 Keep-alive</a> · <a href="/courses/linux-bash/learn?lessonSlug=lnx-9-3-ssh">Linux & Bash — SSH</a> · <a href="/courses/network-security">Network Security (SSH hardening, WireGuard)</a>.</p>
${L('https://man.openbsd.org/ssh_config', '📄', 'ssh_config(5) — OpenSSH client configuration', 'Match, ProxyJump, ServerAliveInterval; "the first obtained value will be used".', 'Open')}
${L('https://man.openbsd.org/sshd_config', '📄', 'sshd_config(5) — OpenSSH server configuration', 'GatewayPorts, PasswordAuthentication, ClientAliveInterval.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc6598', '📄', 'RFC 6598 — Shared Address Space (100.64.0.0/10)', 'The range ISPs use for carrier-grade NAT.', 'Open')}
${L('https://github.com/yrutschle/sslh', '💻', 'sslh — protocol demultiplexer', 'SSH and HTTPS (and OpenVPN) on the same port.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.3</span>
<h2>SSH khi cổng 22 bị chặn: cửa phụ, config tự chọn cổng, đường hầm -L/-R/-D</h2>
<p class="lead">Một ca thật của chính máy chủ chạy khoá học này: ở trường, <code>ssh</code> vào VPS cứ treo. Wi-Fi trường chỉ mở TCP 80, 443, 587 và 993 (bài 14.2) — còn SSH ở cổng 22. Máy chủ vẫn khoẻ; con đường tới cửa chính của nó bị đóng. Bài này mở một cửa phụ một cách an toàn, cho laptop tự chọn đúng cửa, rồi dùng SSH đúng với bản chất của nó: một đường hầm mã hoá chở được cả CSDL, bản demo hay nguyên trình duyệt đi qua đúng cánh cửa còn mở.</p>

<h3>Hình dung đời thường</h3>
<ul>
<li><strong>Cổng 22 bị chặn</strong> = cổng chính toà nhà khoá ban đêm. Toà nhà không đóng cửa; bạn đi cửa phụ mà bảo vệ luôn để mở cho người giao hàng (993 là cửa thư từ: trường buộc phải mở cho email).</li>
<li><strong>Khoá SSH</strong> = bác bảo vệ giữ ảnh khuôn mặt bạn (khoá công khai); bạn giữ khuôn mặt (khoá riêng). Không ai "đoán" được khuôn mặt, còn mật khẩu thì đoán được.</li>
<li><strong>Đường hầm</strong> = một ống riêng xuyên qua cửa phụ đó: thứ gì bỏ vào đầu này sẽ ra ở đầu kia, bảo vệ chỉ thấy cái ống.</li>
</ul>

<h3>1 — Cùng một máy chủ, hai cánh cửa</h3>
<p>Lab dùng lại "Wi-Fi trường trong một hộp" của 14.1–14.2, mọi luật chặn của trường vẫn bật, thêm một máy chủ thuê <code>vps.example</code> chạy <strong>systemd thật</strong> như một VPS Ubuntu. Trước hết là cặp khoá, tạo trên laptop:</p>
${R('c143-khoa', 'ssh-keygen', 3)}
<p>Khoá riêng nằm lại trên laptop, chỉ mình bạn đọc được (<code>-rw-------</code>). Khoá công khai (<code>.pub</code>) được dán vào bảng điều khiển của nhà cung cấp khi tạo VPS, nó ghi vào <code>~/.ssh/authorized_keys</code> trên máy chủ. Giờ, từ Wi-Fi trường:</p>
${R('c143-cong', 'ssh -o ConnectTimeout', 3)}
<p>Cổng 22 treo rồi hết giờ — luật DROP của trường ở bài 14.2. Cổng 993 của <em>chính VPS đó</em> trả lời ngay. Đọc các dòng <code>-v</code> theo thứ tự: TCP nối tới 993, máy chủ chào kèm phiên bản phần mềm, chứng minh nó là ai bằng <strong>khoá máy chủ</strong> (host key), rồi ta đăng nhập bằng khoá — không mật khẩu nào đi trên mạng. Lần đầu, ssh lưu khoá máy chủ đó ("Permanently added"); lần sau mà khoá khác đi nghĩa là có kẻ đứng giữa (xem góc kẻ xấu).</p>

<h3>2 — Mở cửa phụ trên Ubuntu (và cái bẫy tự khoá mình ngoài cửa)</h3>
<p>Mọi hướng dẫn cũ đều nói: thêm <code>Port 993</code> vào <code>/etc/ssh/sshd_config</code> rồi khởi động lại sshd. Trên Ubuntu đời mới việc đó không làm điều bạn nghĩ, vì <strong>systemd</strong>, chứ không phải sshd, đang giữ cổng (<em>socket activation</em> — kích hoạt qua socket: <code>ssh.socket</code> nghe cổng, có người nối tới mới bật sshd):</p>
${R('c143-bay', 'systemctl is-enabled', 7)}
<p>Bẫy 1: sửa rồi khởi động lại mà danh sách cổng vẫn chỉ có 22 — và nhìn xem ai giữ nó: <code>systemd</code>. Bẫy 2 còn tệ hơn. Một <em>generator</em> nhỏ của systemd đúng là có đọc <code>Port</code> để viết lại socket — nhưng chỉ sau <code>daemon-reload</code> cộng khởi động lại <code>ssh.socket</code>, và một dòng <code>Port 993</code> đứng một mình sẽ <strong>THAY</strong> cổng 22 chứ không thêm vào:</p>
${R('c143-bay', 'cat /run', 3)}
<p>Trên VPS thật, lúc làm việc này bạn thường đang nối bằng cổng 22. Khởi động lại một cái là mất 22; nếu từ chỗ <em>bạn</em> đứng 993 bị chặn (hay tường lửa quên mở nó), bạn bị khoá ngoài cửa. Muốn giữ cả hai thì phải ghi cả <code>Port 22</code> lẫn <code>Port 993</code> — và vẫn phải khởi động lại socket trên máy đang chạy. Cách an toàn hơn là <strong>THÊM</strong> một bộ nghe thứ hai, không đụng thứ gì đang chạy:</p>
${R('c143-dichvu', 'cat >', 3)}
<p>Cổng 22 vẫn thuộc <code>ssh.socket</code>; 993 thuộc một sshd riêng do <code>ssh993.service</code> bật (<code>-p 993</code> đè mọi dòng <code>Port</code>). <code>ExecStartPre=sshd -t</code> từ chối khởi động nếu cấu hình hỏng. Dịch vụ mới có trục trặc gì thì cửa cũ vẫn nguyên. Trên máy chủ thật, việc này được làm từ một runner GitHub Actions (vì mạng chỗ người làm đang chặn 22): nó bật dịch vụ, kiểm năm điều kiện — 993 trả lời, 22 vẫn trả lời, đường hầm về nhà vẫn sống… — và tự gỡ dịch vụ nếu có điều nào hỏng.</p>
<div class="pitfall co-tieu-de"><p><strong>Đo, không đoán.</strong> Cả hai bẫy trên là output thật của lab trên Ubuntu có bật <code>ssh.socket</code> (mặc định từ Ubuntu 22.10; máy chủ trong ca thật chạy 24.04). Kiểm trước bằng <code>systemctl is-enabled ssh.socket</code>, và luôn nghiệm thu bằng <code>ss -tlnp</code> xem thật sự cái gì đang nghe — "lệnh trả về 0" không phải là "chạy được".</p></div>

<h3>3 — ~/.ssh/config tự chọn cửa</h3>
<p>Ở trường gõ <code>-p 993</code>, ở nhà thì không — vài hôm là chán. OpenSSH tự quyết được: khối <code>Match … exec</code> chạy một lệnh nhỏ và chỉ áp cấu hình của nó khi lệnh thành công. Lần thử đầu:</p>
${R('c143-config', 'cat > ~/.ssh/config', 2, { lan: 1 })}
<p>Cổng 22 — ngay cả khi ở trường. Luật: <strong>với mỗi tuỳ chọn, ssh giữ giá trị ĐẦU TIÊN nó gặp</strong> khi đọc tệp từ trên xuống. <code>Host vps</code> đã nói <code>Port 22</code> rồi, nên 993 phía sau bị bỏ qua. Chuyển khối <code>Match</code> lên đầu:</p>
${R('c143-config', 'cat > ~/.ssh/config', 3, { lan: 2 })}
<p>Ở trường (địa chỉ 10.20.2.x) ⇒ 993; dòng cuối chứng minh kết nối thật sự đi vào cổng 993 (<code>$SSH_CONNECTION</code> kết thúc bằng cổng của máy chủ). Cùng laptop đó ở nhà, cùng tệp:</p>
${R('c143-config-nha', 'ip -4', 3)}
<p>Trên máy Mac, phép thử thường là địa chỉ Wi-Fi của <code>en0</code>; đây là hình dạng của cấu hình thật (tên đã thay bằng tên ví dụ):</p>
${MAC_CFG}
<p><code>ssh -G tên</code> in cấu hình cuối cùng mà không nối — dùng nó mỗi lần sửa tệp. Luật "giá trị đầu tiên thắng" cũng có ở phía máy chủ (các tệp drop-in của sshd) — ta gặp lại nó ở góc kẻ xấu.</p>
${net('tunnel', 'port', 'vi', 'Ở trường và ở nhà: xem ssh đọc config từ trên xuống, chọn 22 hay 993, và gói chết ở đâu.', { tour: 'tunnel-port' })}

<h3>4 — Đường hầm: SSH chở các kết nối khác</h3>
<p>Một kết nối SSH chở được nhiều kết nối TCP khác bên trong. Ba cờ, ba chiều:</p>
<div class="table-wrap"><table>
<tr><th>Cờ</th><th>Chiều</th><th>Dùng hằng ngày</th></tr>
<tr><td><code>-L 16379:127.0.0.1:6379</code></td><td>kéo một cổng của máy chủ về laptop</td><td>mở CSDL trên VPS, Grafana, trang quản trị chỉ nghe 127.0.0.1</td></tr>
<tr><td><code>-R 8080:localhost:3000</code></td><td>đẩy một cổng của laptop ra máy chủ</td><td>khoe bản demo đang chạy trên laptop cho bạn hay cho thầy xem</td></tr>
<tr><td><code>-D 1080</code></td><td>proxy SOCKS trên laptop, đi ra ở máy chủ</td><td>trình duyệt hay ứng dụng bất kỳ "đi ra" từ VPS</td></tr>
</table></div>

<h4>-L: kéo CSDL của máy chủ về nhà</h4>
${R('c143-L-vps', 'ss', 2)}
<p>Redis trên VPS chỉ nghe <code>127.0.0.1</code> — đúng cách: CSDL không bao giờ nên trả lời cả Internet. Từ laptop:</p>
${R('c143-L', 'nc', 5)}
<p>Gọi thẳng: hết giờ. Qua <code>-L</code>: laptop mở 127.0.0.1:16379, thứ gì nối vào đó được chở trong SSH và đi ra <em>trên VPS</em> tới 127.0.0.1:6379 — nên với Redis, máy khách là người trong nhà. <code>-f -N</code> = chạy nền, không chạy lệnh nào. Cùng một dòng dùng được cho Postgres (5432), MySQL (3306) hay một bảng điều khiển ở 3000.</p>

<h4>-R: khoe bản demo đang chạy trên laptop</h4>
${R('c143-R', 'mkdir', 3)}
${R('c143-R-ban1', 'curl', 1)}
<p>Bạn ở nhà bị từ chối. Trên VPS:</p>
${R('c143-R-vps', 'ss', 3)}
<p>Mặc định, đường hầm ngược chỉ mở <code>127.0.0.1</code> trên máy chủ — một mặc định an toàn. <code>GatewayPorts clientspecified</code> cho phép máy khách xin địa chỉ khác:</p>
${R('c143-R2', 'pkill', 3)}
${R('c143-R-ban2', 'curl', 1)}
<p>Laptop của bạn, ngồi sau NAT của trường nơi không ai gọi vào được, giờ phục vụ một trang cho cả Internet qua VPS. Chính vì thế nó đáng có mặt ở góc kẻ xấu bên dưới. Các dịch vụ như ngrok hay Cloudflare Tunnel là ý tưởng này, được làm sẵn.</p>

<h4>-D: proxy SOCKS đi qua VPS</h4>
${R('c143-D', 'ssh -f', 5)}
<p>Bốn dòng, bốn bài học:</p>
<ul>
<li><code>social.test</code> gọi thẳng: bị reset — bộ lọc SNI của 14.2. Qua SOCKS: được, và trang thấy người ghé là <strong>VPS</strong> (<code>198.18.0.30</code>). Trường chỉ thấy một luồng mã hoá tới VPS; cái tên không hề xuất hiện trên dây của trường.</li>
<li><code>--socks5</code> và <code>--socks5-hostname</code>: với <code>--socks5</code> trơn, curl phân giải tên <em>trên laptop</em> — qua DNS của trường, vốn trả NXDOMAIN cho <code>phim.test</code>. Đó là <strong>rò DNS</strong>: nội dung đi trong hầm, còn cái tên thì không. (curl 8.18 còn ghi nhầm lỗi thành "Could not resolve proxy" — proxy vẫn ổn, tên đích mới hỏng.) <code>--socks5-hostname</code> (còn viết là <code>socks5h://</code>) gửi cái tên sang VPS phân giải. Trên Firefox, công tắc là "Proxy DNS when using SOCKS v5".</li>
</ul>
<p>Tường lửa của trường đã thấy gì:</p>
${R('c143-D-gw', 'iptables', 2)}
<p>Luật SNI bắt đúng một gói — lần gọi thẳng. Mọi thứ còn lại là kết nối tới VPS ở cổng 993. Lưu ý thứ SOCKS qua SSH không làm được: UDP. Game và gọi thoại (bài 14.2) vẫn chết; với chúng bạn cần VPN (bài 14.4).</p>
${net('tunnel', 'socks', 'vi', 'Theo một request đi qua -L, -R và -D: máy nào mở kết nối, và trường thấy gì.', { tour: 'tunnel-socks' })}

<h3>5 — Máy ở nhà, sau CGNAT</h3>
<p>Nhiều bạn để một máy Linux ở nhà (để build, chạy CSDL, có GPU). Ở trường bạn muốn vào nó. Nhưng:</p>
${R('c143-cgnat', 'ip', 2)}
${R('c143-vao-nha', 'nc', 2)}
<p>Địa chỉ WAN của router nhà là <code>100.64.0.2</code> — thuộc <code>100.64.0.0/10</code>, dải dành cho NAT cấp nhà mạng (CGNAT, RFC 6598) — trong khi Internet thấy <code>198.18.0.40</code> của nhà mạng. Hai lớp NAT đứng giữa Internet và máy bạn, mà lớp thứ hai cùng các cổng của nó bạn không điều khiển được (bài 14.6 đo kỹ chỗ này). Không ai gọi vào được. Mánh: <strong>kết nối đi RA thì luôn được</strong>, nên máy nhà gọi tới VPS và để sẵn một cánh cửa ở đó:</p>
${R('c143-ham-nha', 'AUTOSSH', 2)}
${R('c143-ham-vps', 'cut', 2)}
<p>Khoá của máy nhà trên VPS bị trói bằng <code>restrict,port-forwarding,permitlisten="localhost:2222"</code>: không shell, không mở cổng nào khác — lỡ máy nhà bị trộm thì khoá của nó chỉ mở được một cổng nội bộ và không gì hơn. Ở trường, thêm một mục vào config:</p>
${R('c143-jump', 'cat >>', 3)}
<p><code>ProxyJump vps</code> = SSH tới VPS trước (cổng 993, do khối Match chọn), rồi từ đó tới <code>localhost:2222</code>, chính là đường hầm về nhà. Hai lần đăng nhập, đều bằng khoá, và máy nhà chưa hề mở cổng nào.</p>

<h4>Một lần rớt mạng thật: thứ gì giữ đường hầm sống</h4>
<p>Ta cắt Internet ở nhà 45 giây ngay tại router và quan sát:</p>
${R('c143-autossh', 'date', 6)}
${R('c143-autossh-vps', 'J()', 5)}
<p>Câu chuyện nằm trong các mốc giờ: vụ cắt bắt đầu khoảng hai giây sau dòng đầu; <code>ssh</code> nhận ra sau khoảng 38 giây — <code>ServerAliveInterval 10</code> × <code>ServerAliveCountMax 3</code>, cộng lần dò cuối — rồi thoát; <code>autossh</code> bật lại nó ngay. Nhưng khi mạng có lại, VPS vẫn còn phiên <strong>CŨ</strong> giữ cổng 2222 ("Address already in use"), nên mỗi đường hầm mới đều hỏng, tới khi VPS rốt cuộc nhận được một gói reset của kết nối cũ và nhả nó ra. Tổng cộng: 45 giây mất mạng khiến đường hầm mất khoảng 80 giây. Cấu hình nên chép:</p>
${KEEP}
<div class="pitfall co-tieu-de"><p><strong>Phép thử nói dối lần đầu.</strong> "Sự cố" đầu tiên của ta là <code>pkill ssh</code> — và autossh dừng luôn. autossh coi ssh bị giết bằng SIGTERM/SIGINT/SIGKILL là "người dùng muốn thế" và thoát theo; nó chỉ bật lại khi ssh tự chết (mã thoát 255). Muốn ép bật lại thì <code>kill -USR1</code> vào autossh; muốn thử như thật thì cắt mạng như ta đã làm. Trên máy chủ, chạy autossh (hoặc ssh trơn với <code>Restart=always</code>) thành một dịch vụ systemd.</p></div>

<h3>6 — "Nếu" trường soi gói (DPI) thì sao?</h3>
<p>Cổng chỉ là cái nhãn. Tường lửa nhìn vào bên trong gói nhận ra được chính giao thức — kết nối SSH nào cũng mở đầu bằng chữ <code>SSH-2.0-</code> ở dạng rõ:</p>
${R('c143-dpi-gw', 'iptables', 1)}
${R('c143-dpi', 'ssh vps true', 3)}
<p>SSH chết ở 993 lẫn 443, trong khi HTTPS tới đúng cổng 443 đó vẫn chạy. Trên VPS, <strong>sslh</strong> nghe cổng 443 và phân loại kết nối tới: SSH trơn → sshd, TLS → máy chủ web — còn TLS mang tên (SNI) <code>ssh.vps.example</code> → một điểm cuối TLS nhỏ bóc lớp vỏ rồi đưa vào sshd. Trên laptop, <code>openssl s_client</code> bọc SSH trong TLS:</p>
${R('c143-dpi', 'cat >>', 2, { drop: /^(depth|verify)/ })}
${R('c143-dpi-doc', 'iptables', 1)}
<p>Với tường lửa, giờ nó chỉ là thêm một kết nối HTTPS (bộ đếm dừng ở hai lần SSH trơn). Giới hạn: mạng nào cài chứng chỉ riêng lên laptop để soi TLS thì vẫn đọc được (bài 6.4); mạng chặn IP của VPS thì chặn tất. Nơi nào có quy định cấm rõ đường hầm thì theo quy định.</p>

<h3>🕵️ Góc kẻ xấu</h3>
<ul>
<li><strong>Bot thử mật khẩu ở mọi cổng SSH trên Internet</strong>, suốt ngày — ở 22 hay 993 cũng vậy (đổi cổng giảm tiếng ồn, không giảm rủi ro). Cách phòng là không cho đăng nhập bằng mật khẩu nào cả:</li>
</ul>
${R('c143-do', 'for u', 1)}
${R('c143-do-vps', 'sshd -T', 3)}
<p>"Permission denied (publickey)" — máy chủ chỉ liệt kê <code>publickey</code>, nên chẳng có gì để đoán. Để ý địa chỉ nguồn trong nhật ký: <code>198.18.0.1</code>, NAT của trường. Sinh viên nào ở trường cũng mang địa chỉ đó — một fail2ban cấm nó sau vài lần sai sẽ khoá ngoài cả lớp bạn (và chính bạn). Giờ đến cái bẫy đã dính trên máy chủ thật:</p>
${R('c143-do-vps', 'mv', 4)}
<p>Cùng nội dung, khác tên tệp. Ảnh cloud của Ubuntu có sẵn <code>50-cloud-init.conf</code> với <code>PasswordAuthentication yes</code>, và với sshd cũng vậy <strong>giá trị đọc được ĐẦU TIÊN thắng</strong>, các drop-in đọc theo thứ tự chữ cái — nên một tệp <code>70-</code> nói "no" bị lặng lẽ bỏ qua. Đặt tên tệp <code>01-</code>, và nghiệm thu bằng <code>sshd -T</code> (giá trị đang hiệu lực), không bao giờ bằng cách đọc lại tệp vừa ghi.</p>
<ul>
<li><strong>Proxy SOCKS mở toang.</strong> <code>-D 0.0.0.0:1081</code> thay vì <code>-D 1080</code>, và ai cùng Wi-Fi cũng dùng được đường hầm của bạn:</li>
</ul>
${R('c143-D-mo', 'ss', 1)}
${R('c143-D-ke', 'curl', 2)}
<p>Lưu lượng của người lạ đi ra từ VPS <em>của bạn</em>, mang tên bạn và tài khoản nhà cung cấp của bạn. Giữ các cổng chuyển tiếp ở 127.0.0.1 (mặc định) trừ khi bạn cố ý.</p>
<ul>
<li><strong>-R mở một lỗ vào nơi laptop đang ngồi.</strong> <code>-R 0.0.0.0:8080:10.20.2.50:80</code> sẽ công bố một máy trong mạng nội bộ của trường ra Internet. Đó là kiểu việc kết thúc bằng việc quản trị mạng tới tận bàn bạn — và là cách kẻ tấn công giữ chân trong mạng người khác. Đóng đường hầm khi không cần; chỉ công bố máy chủ dev của chính bạn, và chỉ trong lúc demo.</li>
<li><strong>Khoá máy chủ đổi?</strong> "WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED" nghĩa là dừng lại. Trên Wi-Fi không tin được (evil twin ở 14.1) đó có thể là kẻ đứng giữa. So dấu vân tay với bảng điều khiển của nhà cung cấp trước khi chấp nhận.</li>
<li><strong>Khoá riêng là chìa khoá nhà.</strong> Đặt mật khẩu cho nó (<code>ssh-keygen -p</code>), đừng bao giờ chép nó lên máy phòng lab hay máy dùng chung, và tránh <code>ForwardAgent</code> tới máy chủ bạn không tin — root ở đó dùng được agent của bạn trong lúc bạn đang đăng nhập.</li>
</ul>

<h3>Khi mọi cửa đều đóng: phao cứu sinh</h3>
<p>Nếu từ chỗ bạn ngồi cả 22 lẫn 993 đều không tới được, mạng của người khác vẫn có thể tới máy chủ: một runner CI. Workflow GitHub Actions giữ khoá deploy trong secret chạy trên mạng của GitHub, không phải mạng của bạn. Chuẩn bị sẵn hai workflow bấm tay — một cái chỉ đọc (cổng nào đang nghe, đường hầm còn sống không, tường lửa có đúng như mình nghĩ) và một cái áp thay đổi, kiểm nó, rồi tự hoàn tác nếu kiểm hỏng. Đừng bao giờ xoá các secret mà chúng dùng.</p>

<h3>"Nếu… thì sao"</h3>
<ul>
<li><strong>…trường mở 443 nhưng không mở 993?</strong> Cho sshd (hoặc sslh) nghe 443 — VPS của lab cũng trả lời SSH ở 443.</li>
<li><strong>…đến 443 cũng chỉ đi được qua proxy web của trường?</strong> SSH đi qua proxy HTTP được bằng <code>ProxyCommand nc -X connect -x proxy:3128 %h %p</code>, nếu proxy cho CONNECT tới máy chủ của bạn.</li>
<li><strong>…đường hầm chạy mà chậm?</strong> TCP lồng trong TCP: trên Wi-Fi hay mất gói, cả hai lớp cùng gửi lại. Dùng lâu và nặng thì VPN chạy UDP tốt hơn — khi UDP được phép (14.4).</li>
<li><strong>…git push treo ở trường?</strong> GitHub cũng trả lời SSH ở cổng 443 tại <code>ssh.github.com</code>: <code>Host github.com → HostName ssh.github.com, Port 443</code>. Hoặc dùng remote HTTPS.</li>
</ul>

<h3>Nó nằm ở đâu trong máy tính</h3>
<ul>
<li>Trên máy chủ, socket đang nghe của cổng 22 thuộc PID 1 (<code>systemd</code>) cho tới khi có kết nối; <code>ssh993</code> là một tiến trình sshd bình thường giữ socket riêng của nó.</li>
<li>Các cổng chuyển tiếp là socket nghe bình thường thuộc tiến trình <code>ssh</code> (trên laptop, với -L/-D) hoặc <code>sshd-session</code> (trên máy chủ, với -R) — <code>ss -tlnp</code> cho biết ai giữ.</li>
<li>Khoá: <code>~/.ssh/id_ed25519</code> (riêng, 600) và <code>.pub</code>; danh sách của máy chủ là <code>~/.ssh/authorized_keys</code>; các máy chủ đã biết nằm ở <code>~/.ssh/known_hosts</code>.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> tuần đầu ở trường, Wi-Fi chỉ mở 80/443/587/993, và tối nay bạn phải deploy từ thư viện. Dùng lab (<code>GIU_LAB=1 bash lab/code/dung-output-ch14b.sh</code>), từ <code>nft-win</code> và <code>nft-vps</code>.</p>
<ol>
<li>Trên <code>nft-vps</code>, kiểm ai đang giữ cổng 22 và <code>ssh993</code> có chạy không. Giải thích trong một câu vì sao không được "cứ thêm Port 993".</li>
<li>Trên <code>nft-win</code>, viết <code>~/.ssh/config</code> có khối <code>Match</code> chọn 993 khi ở trường và 22 ở nơi khác. Chứng minh bằng <code>ssh -G</code> trên <code>nft-win</code> và <code>nft-lap</code>.</li>
<li>Mở Redis của VPS trên laptop bằng <code>-L</code>, đọc <code>diem:SE12345</code>.</li>
<li>Mở proxy SOCKS và tải <code>http://phim.test/</code> mà không rò DNS.</li>
<li>Vào <code>may-nha</code> từ trường bằng một lệnh.</li>
</ol>
<p><strong>Đạt khi:</strong> mỗi bước có lệnh và output thật, và <code>sshd -T</code> trên VPS báo <code>passwordauthentication no</code>.</p>
<details><summary>Lời giải</summary><p>1: <code>systemctl is-enabled ssh.socket</code> → enabled; <code>ss -4tlnp</code> thấy systemd ở :22 và sshd ở :993 — sửa Port rồi khởi động lại socket sẽ THAY cổng 22. 2: khối Match của mục 3, đặt lên đầu; <code>ssh -G vps | grep ^port</code> → 993 ở trường, 22 ở nhà. 3: <code>ssh -f -N -L 16379:127.0.0.1:6379 vps; redis-cli -p 16379 get diem:SE12345</code>. 4: <code>ssh -f -N -D 1080 vps; curl --socks5-hostname 127.0.0.1:1080 http://phim.test/</code> (không dùng <code>--socks5</code>). 5: mục <code>Host nha</code> có <code>ProxyJump vps</code>, rồi <code>ssh nha</code>.</p></details>
</div>

<details><summary>🧠 Tự kiểm (5 câu)</summary>
<ol>
<li>Bạn thêm <code>Port 993</code> rồi khởi động lại sshd trên Ubuntu 24.04; <code>ss</code> vẫn chỉ thấy 22. Vì sao? — <em>ssh.socket (systemd) giữ cổng; Port của sshd chỉ có tác dụng qua generator sau daemon-reload + khởi động lại socket.</em></li>
<li>Vì sao <code>Port 993</code> trong khối Match ở cuối tệp không có tác dụng? — <em>ssh giữ giá trị đầu tiên nó gặp; Host vps đã đặt Port 22 trước đó.</em></li>
<li>Cờ nào cho người trên Internet xem bản demo trên laptop của bạn? — <em>-R (cộng GatewayPorts trên máy chủ nếu muốn nghe ngoài 127.0.0.1).</em></li>
<li><code>--socks5</code> và <code>--socks5-hostname</code> khác nhau ở đâu? — <em>Ai phân giải tên: laptop (rò ra DNS tại chỗ) hay proxy.</em></li>
<li>Vì sao VPS không nối được vào máy nhà sau CGNAT, và máy nhà vẫn được vào bằng cách nào? — <em>Hai lớp NAT, không có cổng nào để mở; máy nhà mở một đường hầm ngược (-R) đi RA tới VPS.</em></li>
</ol></details>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
    ['socket activation (kích hoạt qua socket)', 'systemd giữ cổng đang nghe và bật dịch vụ khi có kết nối đầu tiên (ssh.socket trên Ubuntu).'],
    ['Match … exec', 'Khối trong ~/.ssh/config chỉ áp khi một lệnh thành công — vd "mình có đang ở mạng trường không?".'],
    ['local forward -L', 'Một cổng trên máy bạn, chở qua SSH tới một địa chỉ nhìn từ máy chủ.'],
    ['remote forward -R', 'Một cổng trên máy chủ, chở ngược về một địa chỉ nhìn từ máy bạn.'],
    ['dynamic forward -D (SOCKS)', 'Proxy SOCKS trên máy bạn; mỗi kết nối đi ra ở máy chủ.'],
    ['ProxyJump (-J)', 'SSH qua một máy trung gian tới máy đứng sau nó.'],
    ['CGNAT', 'NAT cấp nhà mạng: nhà mạng NAT router của bạn thêm lần nữa (100.64.0.0/10) — không ai gọi vào được.'],
    ['DPI (soi gói)', 'Deep packet inspection: tường lửa nhận ra giao thức qua nội dung, không qua cổng.'],
  ])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Cổng 22 bị chặn ≠ máy chủ chết: thêm một bộ nghe thứ hai ở cổng được mở, thành một dịch vụ riêng — sửa <code>Port</code> trên Ubuntu dùng socket activation có thể khoá bạn ngoài cửa.</li>
<li><code>Match host … exec</code> chọn cổng theo mạng; đặt nó lên đầu vì giá trị đầu tiên thắng — kiểm bằng <code>ssh -G</code>.</li>
<li>-L kéo cổng máy chủ về, -R đẩy cổng laptop ra, -D là proxy SOCKS; dùng socks5h để khỏi rò DNS, chỉ nghe 127.0.0.1.</li>
<li>Sau CGNAT không ai gọi vào được: từ nhà đào hầm đi ra (autossh + keepalive cả hai phía), vào bằng cách nhảy qua VPS.</li>
<li>Chỉ dùng khoá, drop-in <code>01-</code>, nghiệm thu bằng <code>sshd -T</code>; DPI đọc giao thức, nên muốn trông như HTTPS thì bọc SSH trong TLS.</li>
</ul>
<p>Bài liên quan: <a href="${bai('netdev-14-2-mang-truong-chan')}">14.2 Mạng trường chặn gì</a> · <a href="${bai('netdev-2-3-nat')}">2.3 NAT</a> · <a href="${bai('netdev-10-3-reverse-forward')}">10.3 Reverse/forward proxy, đường hầm</a> · <a href="${bai('netdev-6-4-loi-tls')}">6.4 Lỗi TLS</a> · <a href="${bai('netdev-4-5-keepalive-pool')}">4.5 Keep-alive</a> · <a href="/courses/linux-bash/learn?lessonSlug=lnx-9-3-ssh">Linux & Bash — SSH</a> · <a href="/courses/network-security">Bảo mật mạng (gia cố SSH, WireGuard)</a>.</p>
${L('https://man.openbsd.org/ssh_config', '📄', 'ssh_config(5) — cấu hình máy khách OpenSSH', 'Match, ProxyJump, ServerAliveInterval; "giá trị lấy được đầu tiên sẽ được dùng".', 'Mở')}
${L('https://man.openbsd.org/sshd_config', '📄', 'sshd_config(5) — cấu hình máy chủ OpenSSH', 'GatewayPorts, PasswordAuthentication, ClientAliveInterval.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc6598', '📄', 'RFC 6598 — Không gian địa chỉ dùng chung (100.64.0.0/10)', 'Dải nhà mạng dùng cho CGNAT.', 'Mở')}
${L('https://github.com/yrutschle/sslh', '💻', 'sslh — bộ tách giao thức', 'SSH và HTTPS (và OpenVPN) chung một cổng.', 'Mở')}
</div>
`,
};
