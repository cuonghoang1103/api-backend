/**
 * Chương 14 · 14.4 — VPN: WireGuard, split/full tunnel, khi trường chặn UDP, rò DNS, kill switch (soạn 14/11/2026).
 * Output thật: lab/out/c144-* (lab "Wi-Fi trường trong một hộp" mở rộng — bash lab/code/dung-output-ch14b.sh, CHI=144).
 * Đo được khi soạn: WireGuard đi qua HAI lớp NAT (CGNAT) từ nhà mà không mở cổng nào; ở trường (bỏ mọi UDP) handshake không bao giờ xong
 * và full tunnel làm mất luôn Internet; OpenVPN-TCP nấp sau sslh 443 qua được; redirect-gateway KHÔNG đưa DNS vào hầm (DNS trường nằm cùng
 * mạng) ⇒ 7 câu hỏi DNS lọt; OpenVPN chết ⇒ gói đi thẳng bằng IP trường (không kill switch), wg-quick full tunnel thì giữ gói lại.
 * Tốc độ (netem 20 ms, 50 Mbit/s): thẳng 46,2 · WireGuard 45,4 · OpenVPN-TCP 43,6 Mbit/s; mất 2% gói ⇒ cả ba còn 3–5 Mbit/s, dao động mạnh
 * giữa các lần ⇒ bài KHÔNG kết luận "TCP trong TCP chậm hơn" từ số này. Tailscale/DERP KHÔNG chạy được trong lab offline ⇒ chỉ giải thích.
 */
import { run, card, kv, cmd } from '../_ui.mjs';
import { net } from '../_lab.mjs';
import G from '../giang/nfd-14-4.mjs';

const L = card;
const R = (f, p, n = 1, o = {}) => run(f, p, n, { drop: /^# /, ...o });
const bai = (slug) => `/courses/networking-for-developers/learn?lessonSlug=${slug}`;
const MAC_DNS = cmd(
  '# WireGuard client config — let the tunnel bring its own DNS / cấu hình khách: DNS đi theo hầm',
  '[Interface]',
  'Address = 10.66.0.2/24',
  'PrivateKey = …',
  'DNS = 198.18.0.53        # wg-quick (needs resolvconf on Linux) and every WireGuard app apply this',
);

export default {
  title: '14.4 — VPNs for developers: WireGuard, split vs full tunnel, and what to do when UDP is blocked|||14.4 — VPN cho lập trình viên: WireGuard, split và full tunnel, và làm gì khi UDP bị chặn',
  slug: 'netdev-14-4-vpn',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Dựng WireGuard thật từ máy chủ tới laptop (đi qua cả hai lớp NAT của nhà mạng), so split tunnel và full tunnel bằng ip route, traceroute và "trang web thấy ai", mang laptop tới trường thì UDP bị bỏ nên WireGuard chết — chuyển sang OpenVPN qua TCP 443 nấp sau sslh, bắt 7 câu hỏi DNS lọt ra ngoài hầm rồi vá, kill switch có và không, đo trễ và tốc độ bằng netem, VPN trên điện thoại bằng mã QR, Tailscale/DERP, và góc kẻ xấu: người giữ máy chủ VPN đọc được mật khẩu gửi qua HTTP.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.4</span>
<h2>VPNs for developers: WireGuard, split vs full tunnel, and what to do when UDP is blocked</h2>
<p class="lead">Lesson 14.3 tunnelled single TCP connections through SSH. A VPN goes one layer down: it gives your laptop a second network card whose cable runs, encrypted, to a server you trust. Everything the routing table sends into that card — a database connection, a game's UDP, DNS — comes out at the other end. This lesson builds one for real, moves the laptop from home to school and watches it break, fixes it, and measures what it costs.</p>

<h3>The everyday picture</h3>
<ul>
<li><strong>A VPN</strong> is a private pipe laid inside the shared water main: the city still carries the water, but nobody along the way can see or add anything to yours. The other end of the pipe is your server.</li>
<li><strong>Split tunnel</strong> = only the water for the garden goes through your private pipe; <strong>full tunnel</strong> = all the water does.</li>
<li><strong>The VPN provider</strong> is the person at the other end of the pipe: the school no longer sees your traffic — they do.</li>
</ul>

<h3>1 — WireGuard from home, through two NATs</h3>
<p>WireGuard is small (a few thousand lines in the Linux kernel), uses one UDP port, and identifies peers by public keys — the same idea as SSH keys. On the laptop at home:</p>
${R('c144-khoa', 'umask', 4)}
<p>The server (the VPS of lesson 14.3) gets its own key pair and a network card <code>wg0</code> listening on UDP 51820. The config line that matters most is <code>AllowedIPs</code> on each <code>[Peer]</code>: it is both "which addresses may come from this peer" and "which addresses I route to this peer" — WireGuard calls it <em>cryptokey routing</em>.</p>
${R('c144-vps', 'cat >', 3)}
<p>Note the heredoc writes <code>$(cat server.key)</code>: the private key never appears on screen. <code>wg-quick</code> prints every command it runs — read them: create the interface, load keys, add the address, set MTU 1420 (the WireGuard header costs 60–80 bytes, lesson 1.2), add NAT so clients leave with the VPS's IP. On the laptop, a <strong>split tunnel</strong>: only 10.66.0.0/24 goes in.</p>
${R('c144-nha', 'cat >', 4)}
<p>Handshake done, ping works — and remember where this laptop sits: behind the home router <em>and</em> behind the ISP's CGNAT (lesson 14.3). Nobody can connect in, but the laptop connects out over UDP, the NATs create the mapping, and <code>PersistentKeepalive = 25</code> keeps sending a tiny packet so the mapping does not expire.</p>

<h3>2 — Split tunnel or full tunnel: who does the website see?</h3>
${R('c144-tach', 'ip route get 10.66', 4)}
<p>Split: the VPN network goes into <code>wg0</code>; everything else leaves through the home router and the Internet sees the ISP (<code>198.18.0.40</code>); traceroute shows the home router and the CGNAT hop. Now switch to <code>AllowedIPs = 0.0.0.0/0</code>:</p>
${R('c144-tach', 'wg-quick down', 5)}
<p>Every packet now goes into the tunnel: the site sees the VPS (<code>198.18.0.30</code>) and traceroute's first hop is the VPS's tunnel address. How does wg-quick avoid sending the tunnel's own UDP packets into the tunnel (a loop)? The lines it printed: it marks WireGuard's packets with <code>fwmark 51820</code>, sends <em>unmarked</em> traffic to a separate routing table whose default route is <code>wg0</code>, and lets marked packets use the normal table. (The <code>sysctl … Read-only file system</code> line is an artefact of our container — the lab sets that value beforehand and it is already 1; on a real Linux machine the line does not appear.)</p>
<div class="table-wrap"><table>
<tr><th></th><th>Split tunnel</th><th>Full tunnel</th></tr>
<tr><td>Typical use</td><td>reach a company/home network, a dev database</td><td>a hostile Wi-Fi, a blocked network</td></tr>
<tr><td>What sites see</td><td>your normal IP</td><td>the VPN server's IP</td></tr>
<tr><td>Cost</td><td>none for normal browsing</td><td>everything takes the detour via the server</td></tr>
<tr><td>Risk</td><td>local network still sees normal traffic</td><td>the VPN operator sees everything</td></tr>
</table></div>
${net('vpn', 'route', 'en', 'Switch split / full tunnel and the DNS setting: follow a packet and a DNS question, see which IP the site sees and what leaks.', { tour: 'vpn-route' })}

<h3>3 — The same laptop at school: UDP is dropped</h3>
${R('c144-truong', 'wg-quick up', 4)}
${R('c144-truong-gw', 'iptables', 1)}
<p>No "latest handshake" line, <code>0 B received</code>, and — because this is the full-tunnel config — the whole Internet is gone: the routing table sends everything into a tunnel that never came up. That is lesson 14.2's rule "drop all UDP" at work; its counter shows the handshake attempts. WireGuard has no TCP mode by design.</p>

<h3>4 — Plan B: a VPN over TCP 443, hidden behind sslh</h3>
<p>OpenVPN can run over TCP, and the VPS already has sslh on port 443 (lesson 14.3) — it recognises OpenVPN's first packet and hands it to <code>127.0.0.1:1194</code>. Instead of a certificate authority we pin each side's certificate fingerprint (OpenVPN 2.6+ <code>peer-fingerprint</code>):</p>
${R('c144-ovpn-khoa', 'openssl x509', 1)}
${R('c144-ovpn-vps', 'ss', 1)}
${R('c144-ovpn', 'grep', 5)}
<p>Through the school's port 443: the tunnel is up (<code>tun0</code> 10.67.0.2), the server pushed <code>redirect-gateway def1</code> (the two routes 0.0.0.0/1 and 128.0.0.0/1 beat the default route without deleting it), the site sees the VPS, and <code>social.test</code> — SNI-blocked in 14.2 — opens. The school's view:</p>
${R('c144-ovpn-gw', 'conntrack', 1)}
<p>One TCP connection to 443. But look at the end of the client output again:</p>
${R('c144-ovpn', 'cat /etc/resolv.conf', 2)}

<h3>5 — The DNS leak</h3>
<p><code>phim.test</code> still does not resolve, because the laptop still asks the <strong>school's</strong> DNS (10.20.2.1). The tunnel took the default route, but 10.20.2.1 is on the laptop's own Wi-Fi network — a more specific, directly connected route — so DNS never enters the tunnel. The server did push <code>dhcp-option DNS 198.18.0.53</code>, but on Linux a plain <code>openvpn</code> only applies that with an up-script. What the school captured:</p>
${R('c144-ovpn-gw', 'tshark', 1)}
<p>Every name the laptop visited — and the VPN server's own name — went to the school in clear (two queries each: A and AAAA). Fix: use the DNS the VPN gives you, which travels inside the tunnel:</p>
${R('c144-ovpn-dns', 'echo', 2)}
<p>WireGuard apps (Windows, macOS, Android, iOS) apply the <code>DNS =</code> line for you; on Linux, <code>wg-quick</code> needs <code>resolvconf</code>:</p>
${MAC_DNS}

<h3>6 — Kill switch: what happens when the VPN dies?</h3>
${R('c144-kill-win', 'pkill', 3)}
<p>OpenVPN died; it removed its routes; the very next request went straight out of the school Wi-Fi with the school's IP (<code>198.18.0.1</code>) — no warning. If the reason you used a VPN was a hostile network, you just leaked. With wg-quick's full tunnel the design is different: we blocked UDP 51820 at the home router, and…</p>
${R('c144-kill-lap', 'ip route', 2)}
<p>…the routing table still points into <code>wg0</code>: nothing leaves outside the tunnel, the request just fails. That is a <strong>kill switch</strong>: "if the tunnel is down, nothing goes out". Commercial apps call it a setting; on Linux it is the routing rule plus, ideally, a firewall rule that only lets the VPN's own packets out.</p>
${net('vpn', 'kill', 'en', 'Drop the tunnel with and without a kill switch, and see which packets escape.', { tour: 'vpn-kill' })}

<h3>7 — What does it cost? Measured</h3>
<p>Containers on one laptop are too fast to measure anything, so the home router imitates a real line with <code>tc netem</code>:</p>
${R('c144-netem', 'tc qdisc add', 2)}
${R('c144-do-nha', 'ping -c 10 -q 198', 2)}
${R('c144-do-nha', 'ping -c 10 -q 10.66', 2)}
${R('c144-do-nha', 'ping -c 10 -q 10.67', 2)}
<p>On a clean line the tunnels cost almost nothing: the same ~24 ms round trip (the extra hop to the VPS is local here) and 46.2 → 45.4 Mbit/s for WireGuard, 43.6 for OpenVPN-TCP — the headers and encryption. Now 2% packet loss, like weak Wi-Fi or 4G:</p>
${R('c144-netem2', 'tc qdisc change', 1)}
${R('c144-do-nha-mat', 'iperf3 -c 198', 1)}
${R('c144-do-nha-mat', 'iperf3 -c 10.66', 1)}
${R('c144-do-nha-mat', 'iperf3 -c 10.67', 1)}
<p>All three collapse to a few Mbit/s: TCP reads loss as congestion and slows down (lesson 4.3). Between runs these numbers jump around a lot, so we do <strong>not</strong> conclude from them which VPN is faster under loss. The textbook warning stays true in theory — TCP inside TCP (OpenVPN-TCP) can make both layers retransmit and stall — so use UDP when the network allows it, and TCP 443 when it does not.</p>

<h3>8 — Tailscale and friends: a mesh that finds its way</h3>
<p>Running your own server is one model. <strong>Tailscale</strong> (and Headscale, ZeroTier, NetBird) builds a <em>mesh</em> of WireGuard tunnels between your devices: a coordination server only distributes public keys and addresses; devices then try to talk <strong>directly</strong>, punching through NAT with the trick of lesson 9.4 (both sides send UDP at the same time so each NAT opens a mapping). When a network blocks UDP, Tailscale falls back to <strong>DERP</strong> relays over HTTPS on port 443 — slower, still encrypted end to end (the relay forwards WireGuard packets it cannot read). We could not run this in an offline lab; the simulation below shows the decision steps (labelled computed). For a student it is often the easiest way to reach a home machine from school without opening any port.</p>
${net('vpn', 'school', 'en', 'At school: WireGuard over UDP, OpenVPN over TCP 443, and a mesh with a DERP fallback — which one gets through.', { tour: 'vpn-school' })}

<h3>9 — A VPN on your phone</h3>
${R('c144-dt', 'qrencode', 1)}
<p>Add a peer on the server, write a full-tunnel config with <code>DNS =</code>, turn it into a QR code, scan it in the WireGuard app. Use it on café Wi-Fi or hotel Wi-Fi. (This QR holds a lab key — a real one is a password: never post it.) On iOS/Android also look for "On-Demand" / "Always-on VPN" + "Block connections without VPN": that is the phone's kill switch.</p>

<h3>🕵️ The attacker's corner</h3>
<ul>
<li><strong>The VPN operator sees everything the school used to see — and more.</strong> On the VPS we captured <code>wg0</code> while the laptop logged in to an HTTP site and then an HTTPS site:</li>
</ul>
${R('c144-thay', 'tshark', 2)}
<p>The HTTP password arrives in clear at the VPN server; for HTTPS the operator still sees the site name (SNI) and timing. A VPN moves trust, it does not remove it. Run your own (as here), or pick one whose business model you understand.</p>
<ul>
<li><strong>"Free VPN" apps</strong> have been caught selling browsing data, injecting ads, or shipping malware with root-level network access. A free VPN is paid for by something.</li>
<li><strong>A VPN is not anonymity.</strong> Logged-in accounts, cookies and browser fingerprints identify you through any tunnel.</li>
<li><strong>Your WireGuard private key is a password.</strong> Anyone with it can impersonate your laptop to your server. Different key per device; remove the peer when a device is lost (<code>wg set wg0 peer … remove</code>).</li>
<li><strong>Fake "VPN required" pages</strong> on public Wi-Fi asking you to install a profile or certificate: that profile can route or decrypt your traffic.</li>
</ul>

<h3>"What if…"</h3>
<ul>
<li><strong>…the school blocks the VPN server's IP?</strong> (lesson 14.2's <code>vpn.test</code>.) Nothing that connects to that IP works, on any port. A different server, a mesh with relays, or 4G.</li>
<li><strong>…the school inspects TLS or recognises OpenVPN's handshake?</strong> sslh fooled our simple port rule, but DPI can fingerprint OpenVPN; heavier disguises exist (TLS-wrapped tunnels like 14.3's). Where a rule explicitly forbids VPNs, follow the rule.</li>
<li><strong>…the VPN and the local network use the same range</strong> (both 10.0.0.0/24)? Routes collide and one side becomes unreachable — choose an unusual subnet for your VPN (10.66.0.0/24 here).</li>
<li><strong>…a company VPN and your own VPN at once?</strong> Two full tunnels fight over the default route; usually only one works.</li>
</ul>

<h3>Where this lives in the computer</h3>
<ul>
<li>WireGuard is a kernel network interface (<code>wg0</code>); encryption happens in the kernel, the keys live in kernel memory after <code>wg setconf</code>.</li>
<li>OpenVPN is a user-space process reading and writing a <code>tun</code> device — every packet crosses kernel ↔ process twice, one reason it is slower (unless DCO, its kernel module, is used).</li>
<li>Routes and policy rules (<code>ip rule</code>, table 51820) are kernel tables; <code>/etc/resolv.conf</code> decides which DNS the laptop asks — the VPN does not change it unless something writes that file.</li>
</ul>

<h3>🧪 Practice (30 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> you want your laptop to reach your VPS's private services from home, and to browse safely from the library. Lab: <code>CHI=144 GIU_LAB=1 bash lab/code/dung-output-ch14b.sh</code>.</p>
<ol>
<li>On <code>nft-lap</code>, bring up WireGuard as a split tunnel; prove with <code>ip route get</code> which traffic goes into <code>wg0</code>.</li>
<li>Switch to full tunnel; show with <code>curl http://news.test/</code> that the site now sees the VPS.</li>
<li>On <code>nft-win</code> (school), show why WireGuard fails (one counter on <code>nft-gw</code>).</li>
<li>Connect with OpenVPN over 443, find the DNS leak with a capture on <code>nft-gw</code>, fix it, and capture again.</li>
<li>Kill OpenVPN and check whether anything left without the tunnel.</li>
</ol>
<p><strong>Done when:</strong> each step has its command and real output, and the second capture on <code>nft-gw</code> shows no DNS question from the laptop.</p>
<details><summary>Solution</summary><p>1: AllowedIPs 10.66.0.0/24 ⇒ <code>ip route get 10.66.0.1</code> → dev wg0, <code>ip route get 198.18.0.10</code> → via 192.168.1.1. 2: AllowedIPs 0.0.0.0/0 ⇒ "ban den tu 198.18.0.30". 3: no handshake, 0 B received; <code>iptables -L CHAN -v -n</code> — the "udp DROP" counter rises. 4: <code>tcpdump -i sv0 udp port 53</code> on nft-gw shows the names; <code>echo nameserver 198.18.0.53 &gt; /etc/resolv.conf</code>; capture again: nothing. 5: <code>curl http://198.18.0.10/</code> → "ban den tu 198.18.0.1" = leaked; a kill switch would have blocked it.</p></details>
</div>

<details><summary>🧠 Self-check (5 questions)</summary>
<ol>
<li>What does <code>AllowedIPs = 0.0.0.0/0</code> mean on a WireGuard client? — <em>Route everything into the tunnel (full tunnel), and accept any source address from that peer.</em></li>
<li>Why does WireGuard fail on a network that drops UDP, and what is plan B? — <em>It only speaks UDP; a VPN over TCP 443 (OpenVPN behind sslh) or a mesh with HTTPS relays.</em></li>
<li>The tunnel is up but the school still sees your DNS questions. Why? — <em>The resolver is on the local network (more specific route) and resolv.conf was not changed.</em></li>
<li>What is a kill switch? — <em>When the tunnel is down, nothing leaves outside it.</em></li>
<li>Who can read an HTTP password sent through a VPN? — <em>The VPN server's operator (after decryption) and anyone after it.</em></li>
</ol></details>

<h3>🗂 Key terms</h3>
${kv([
    ['VPN', 'An encrypted virtual network card whose other end is a server you choose.'],
    ['WireGuard', 'A small kernel VPN over UDP; peers identified by public keys.'],
    ['AllowedIPs (cryptokey routing)', 'Per peer: which addresses are routed to it and accepted from it.'],
    ['split / full tunnel', 'Only some networks vs all traffic through the VPN.'],
    ['DNS leak (rò DNS)', 'DNS questions leaving outside the tunnel to the local resolver.'],
    ['kill switch', 'Block all traffic when the VPN is down.'],
    ['redirect-gateway def1', 'OpenVPN adds 0.0.0.0/1 + 128.0.0.0/1 via the tunnel — more specific than the default route.'],
    ['DERP', 'Tailscale\'s relays over HTTPS 443 when a direct UDP path is impossible.'],
  ])}

<h3>📌 Summary</h3>
<ul>
<li>A VPN is a second network card: whatever the routing table sends into it comes out at your server — split tunnel for some networks, full tunnel for all.</li>
<li>WireGuard: keys like SSH, one UDP port, works from behind CGNAT; it dies where UDP is dropped.</li>
<li>Plan B on blocked Wi-Fi: a VPN over TCP 443 (OpenVPN behind sslh here), or a mesh with HTTPS relays.</li>
<li>Check DNS: the tunnel does not move your resolver unless something changes resolv.conf.</li>
<li>Without a kill switch a dead VPN leaks silently; the VPN operator sees what the school used to see.</li>
</ul>
<p>Related lessons: <a href="${bai('netdev-14-3-ssh-cong-bi-chan')}">14.3 SSH when port 22 is blocked</a> · <a href="${bai('netdev-14-2-mang-truong-chan')}">14.2 What the school network blocks</a> · <a href="${bai('netdev-5-1-udp')}">5.1 UDP</a> · <a href="${bai('netdev-9-4-webrtc')}">9.4 WebRTC (NAT traversal)</a> · <a href="${bai('netdev-2-3-nat')}">2.3 NAT</a> · <a href="${bai('netdev-4-3-tac-nghen')}">4.3 Congestion control</a> · <a href="/courses/network-security">Network Security (WireGuard, Tailscale)</a>.</p>
${L('https://www.wireguard.com/papers/wireguard.pdf', '📄', 'WireGuard: Next Generation Kernel Network Tunnel (whitepaper)', 'Cryptokey routing, the handshake, why UDP only.', 'Open')}
${L('https://www.wireguard.com/netns/', '📄', 'WireGuard — Routing & Network Namespace Integration', 'How wg-quick routes 0.0.0.0/0 without a loop (fwmark, table 51820).', 'Open')}
${L('https://tailscale.com/blog/how-nat-traversal-works', '📄', 'Tailscale — How NAT traversal works', 'Hole punching, and DERP relays when it fails.', 'Open')}
${L('https://openvpn.net/community-resources/reference-manual-for-openvpn-2-6/', '📄', 'OpenVPN 2.6 reference manual', 'redirect-gateway, peer-fingerprint, proto tcp.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.4</span>
<h2>VPN cho lập trình viên: WireGuard, split và full tunnel, và làm gì khi UDP bị chặn</h2>
<p class="lead">Bài 14.3 đưa từng kết nối TCP đi qua đường hầm SSH. VPN đi xuống một tầng: nó cho laptop một card mạng thứ hai mà dây cáp của nó chạy, đã mã hoá, tới một máy chủ bạn tin. Thứ gì bảng định tuyến gửi vào card đó — kết nối CSDL, UDP của game, DNS — đều đi ra ở đầu kia. Bài này dựng một cái thật, mang laptop từ nhà tới trường và xem nó hỏng, sửa nó, và đo xem nó tốn gì.</p>

<h3>Hình dung đời thường</h3>
<ul>
<li><strong>VPN</strong> là một ống nước riêng đặt bên trong đường ống chung của thành phố: thành phố vẫn chở nước, nhưng không ai dọc đường nhìn được hay pha thêm gì vào nước của bạn. Đầu kia của ống là máy chủ của bạn.</li>
<li><strong>Split tunnel</strong> = chỉ nước tưới vườn đi qua ống riêng; <strong>full tunnel</strong> = mọi nước đều đi qua.</li>
<li><strong>Nhà cung cấp VPN</strong> là người đứng ở đầu kia ống: trường không còn thấy lưu lượng của bạn — nhưng họ thì thấy.</li>
</ul>

<h3>1 — WireGuard từ nhà, xuyên qua hai lớp NAT</h3>
<p>WireGuard nhỏ (vài nghìn dòng trong nhân Linux), dùng một cổng UDP, và nhận diện máy bằng khoá công khai — cùng ý tưởng với khoá SSH. Trên laptop ở nhà:</p>
${R('c144-khoa', 'umask', 4)}
<p>Máy chủ (chính VPS của bài 14.3) có cặp khoá riêng và một card mạng <code>wg0</code> nghe UDP 51820. Dòng cấu hình quan trọng nhất là <code>AllowedIPs</code> trong mỗi <code>[Peer]</code>: nó vừa là "địa chỉ nào được phép đến từ máy này" vừa là "địa chỉ nào tôi định tuyến tới máy này" — WireGuard gọi là <em>cryptokey routing</em> (định tuyến theo khoá).</p>
${R('c144-vps', 'cat >', 3)}
<p>Để ý heredoc ghi <code>$(cat server.key)</code>: khoá riêng không bao giờ hiện ra màn hình. <code>wg-quick</code> in ra từng lệnh nó chạy — hãy đọc: tạo card, nạp khoá, gắn địa chỉ, đặt MTU 1420 (header WireGuard tốn 60–80 byte, bài 1.2), thêm NAT để khách đi ra bằng IP của VPS. Trên laptop, một <strong>split tunnel</strong>: chỉ 10.66.0.0/24 đi vào hầm.</p>
${R('c144-nha', 'cat >', 4)}
<p>Bắt tay xong, ping được — và nhớ laptop này đang ngồi ở đâu: sau router nhà <em>và</em> sau CGNAT của nhà mạng (bài 14.3). Không ai nối vào được, nhưng laptop nối ra bằng UDP, các NAT tạo ánh xạ, và <code>PersistentKeepalive = 25</code> cứ gửi một gói tí hon để ánh xạ không hết hạn.</p>

<h3>2 — Split tunnel hay full tunnel: trang web thấy ai?</h3>
${R('c144-tach', 'ip route get 10.66', 4)}
<p>Split: mạng VPN đi vào <code>wg0</code>; mọi thứ khác đi qua router nhà và Internet thấy nhà mạng (<code>198.18.0.40</code>); traceroute đi qua router nhà rồi chặng CGNAT. Giờ đổi sang <code>AllowedIPs = 0.0.0.0/0</code>:</p>
${R('c144-tach', 'wg-quick down', 5)}
<p>Mọi gói giờ vào hầm: trang thấy VPS (<code>198.18.0.30</code>) và chặng đầu của traceroute là địa chỉ trong hầm của VPS. wg-quick làm sao để chính các gói UDP của hầm không bị đưa vào hầm (thành vòng lặp)? Các dòng nó in ra: nó đánh dấu gói của WireGuard bằng <code>fwmark 51820</code>, đẩy lưu lượng <em>không</em> đánh dấu sang một bảng định tuyến riêng có tuyến mặc định là <code>wg0</code>, còn gói đã đánh dấu dùng bảng bình thường. (Dòng <code>sysctl … Read-only file system</code> là do container của ta — lab đặt sẵn giá trị đó và nó đã bằng 1; trên máy Linux thật không có dòng này.)</p>
<div class="table-wrap"><table>
<tr><th></th><th>Split tunnel</th><th>Full tunnel</th></tr>
<tr><td>Dùng khi</td><td>vào mạng công ty/nhà, CSDL dev</td><td>Wi-Fi không tin được, mạng bị chặn</td></tr>
<tr><td>Trang web thấy</td><td>IP bình thường của bạn</td><td>IP của máy chủ VPN</td></tr>
<tr><td>Cái giá</td><td>không ảnh hưởng lướt web thường</td><td>mọi thứ đi đường vòng qua máy chủ</td></tr>
<tr><td>Rủi ro</td><td>mạng tại chỗ vẫn thấy lưu lượng thường</td><td>người vận hành VPN thấy tất cả</td></tr>
</table></div>
${net('vpn', 'route', 'vi', 'Gạt split / full tunnel và cài đặt DNS: theo một gói và một câu hỏi DNS, xem trang thấy IP nào và cái gì bị lộ.', { tour: 'vpn-route' })}

<h3>3 — Cùng laptop đó ở trường: UDP bị bỏ</h3>
${R('c144-truong', 'wg-quick up', 4)}
${R('c144-truong-gw', 'iptables', 1)}
<p>Không có dòng "latest handshake", <code>0 B received</code>, và — vì đây là cấu hình full tunnel — mất luôn cả Internet: bảng định tuyến gửi mọi thứ vào một đường hầm chưa từng mở. Đó là luật "bỏ mọi UDP" của bài 14.2 đang làm việc; bộ đếm của nó chính là các lần thử bắt tay. WireGuard cố ý không có chế độ TCP.</p>

<h3>4 — Kế hoạch B: VPN qua TCP 443, nấp sau sslh</h3>
<p>OpenVPN chạy được trên TCP, và VPS đã có sslh ở cổng 443 (bài 14.3) — nó nhận ra gói đầu tiên của OpenVPN và trao cho <code>127.0.0.1:1194</code>. Thay vì một tổ chức cấp chứng chỉ, ta ghim dấu vân tay chứng chỉ của mỗi bên (OpenVPN 2.6+ <code>peer-fingerprint</code>):</p>
${R('c144-ovpn-khoa', 'openssl x509', 1)}
${R('c144-ovpn-vps', 'ss', 1)}
${R('c144-ovpn', 'grep', 5)}
<p>Qua cổng 443 của trường: hầm đã mở (<code>tun0</code> 10.67.0.2), máy chủ đẩy <code>redirect-gateway def1</code> (hai tuyến 0.0.0.0/1 và 128.0.0.0/1 thắng tuyến mặc định mà không cần xoá nó), trang thấy VPS, và <code>social.test</code> — bị chặn SNI ở 14.2 — mở được. Trường nhìn thấy:</p>
${R('c144-ovpn-gw', 'conntrack', 1)}
<p>Một kết nối TCP tới 443. Nhưng nhìn lại cuối output của máy khách:</p>
${R('c144-ovpn', 'cat /etc/resolv.conf', 2)}

<h3>5 — Rò DNS</h3>
<p><code>phim.test</code> vẫn không phân giải được, vì laptop vẫn hỏi DNS <strong>của trường</strong> (10.20.2.1). Đường hầm lấy tuyến mặc định, nhưng 10.20.2.1 nằm ngay trên mạng Wi-Fi của laptop — một tuyến cụ thể hơn, nối thẳng — nên DNS không bao giờ vào hầm. Máy chủ có đẩy <code>dhcp-option DNS 198.18.0.53</code>, nhưng trên Linux, <code>openvpn</code> trơn chỉ áp nó khi có script. Thứ trường đã bắt được:</p>
${R('c144-ovpn-gw', 'tshark', 1)}
<p>Mọi tên laptop đã vào — và cả tên máy chủ VPN — đều tới tay trường ở dạng rõ (mỗi tên hai câu: A và AAAA). Vá: dùng DNS mà VPN cấp, đi trong hầm:</p>
${R('c144-ovpn-dns', 'echo', 2)}
<p>Ứng dụng WireGuard (Windows, macOS, Android, iOS) tự áp dòng <code>DNS =</code>; trên Linux, <code>wg-quick</code> cần <code>resolvconf</code>:</p>
${MAC_DNS}

<h3>6 — Kill switch: VPN chết thì sao?</h3>
${R('c144-kill-win', 'pkill', 3)}
<p>OpenVPN chết; nó gỡ các tuyến của mình; request ngay sau đó đi thẳng ra Wi-Fi trường bằng IP của trường (<code>198.18.0.1</code>) — không một lời cảnh báo. Nếu lý do bạn dùng VPN là mạng không tin được, bạn vừa bị lộ. Với full tunnel của wg-quick thì thiết kế khác hẳn: ta chặn UDP 51820 ở router nhà, và…</p>
${R('c144-kill-lap', 'ip route', 2)}
<p>…bảng định tuyến vẫn trỏ vào <code>wg0</code>: không gì đi ra ngoài hầm, request chỉ đơn giản là hỏng. Đó là <strong>kill switch</strong>: "hầm sập thì không gì được ra". Ứng dụng thương mại gọi nó là một tuỳ chọn; trên Linux nó là luật định tuyến cộng, lý tưởng nhất, một luật tường lửa chỉ cho gói của chính VPN đi ra.</p>
${net('vpn', 'kill', 'vi', 'Làm sập hầm khi có và không có kill switch, xem gói nào thoát ra ngoài.', { tour: 'vpn-kill' })}

<h3>7 — Nó tốn gì? Đo thật</h3>
<p>Các container trên một laptop chạy quá nhanh để đo được gì, nên router nhà giả lập một đường mạng thật bằng <code>tc netem</code>:</p>
${R('c144-netem', 'tc qdisc add', 2)}
${R('c144-do-nha', 'ping -c 10 -q 198', 2)}
${R('c144-do-nha', 'ping -c 10 -q 10.66', 2)}
${R('c144-do-nha', 'ping -c 10 -q 10.67', 2)}
<p>Trên đường sạch, đường hầm gần như không tốn gì: cùng khoảng 24 ms khứ hồi (chặng vòng qua VPS ở đây là nội bộ) và 46,2 → 45,4 Mbit/s với WireGuard, 43,6 với OpenVPN-TCP — phần header và mã hoá. Giờ mất 2% gói, như Wi-Fi yếu hay 4G:</p>
${R('c144-netem2', 'tc qdisc change', 1)}
${R('c144-do-nha-mat', 'iperf3 -c 198', 1)}
${R('c144-do-nha-mat', 'iperf3 -c 10.66', 1)}
${R('c144-do-nha-mat', 'iperf3 -c 10.67', 1)}
<p>Cả ba sụp còn vài Mbit/s: TCP coi mất gói là tắc nghẽn và tự hãm (bài 4.3). Giữa các lần đo, các số này nhảy rất mạnh, nên ta <strong>KHÔNG</strong> kết luận từ đây VPN nào nhanh hơn khi mất gói. Lời cảnh báo trong sách vẫn đúng về lý thuyết — TCP lồng trong TCP (OpenVPN-TCP) có thể khiến cả hai lớp cùng gửi lại và nghẽn — nên mạng cho UDP thì dùng UDP, không cho thì mới dùng TCP 443.</p>

<h3>8 — Tailscale và các bạn: mạng lưới tự tìm đường</h3>
<p>Tự chạy máy chủ là một mô hình. <strong>Tailscale</strong> (và Headscale, ZeroTier, NetBird) dựng một <em>mạng lưới</em> (mesh) các đường hầm WireGuard giữa các thiết bị của bạn: máy chủ điều phối chỉ phát khoá công khai và địa chỉ; sau đó các thiết bị thử nói chuyện <strong>trực tiếp</strong>, đục xuyên NAT bằng mánh của bài 9.4 (hai bên cùng gửi UDP một lúc để mỗi NAT mở một ánh xạ). Khi mạng chặn UDP, Tailscale lùi về các trạm chuyển tiếp <strong>DERP</strong> qua HTTPS ở cổng 443 — chậm hơn, vẫn mã hoá đầu-cuối (trạm chỉ chuyển gói WireGuard nó không đọc được). Ta không chạy được thứ này trong lab offline; mô phỏng bên dưới cho thấy các bước quyết định (ghi nhãn tính ra). Với sinh viên, đây thường là cách dễ nhất để vào máy ở nhà từ trường mà không mở cổng nào.</p>
${net('vpn', 'school', 'vi', 'Ở trường: WireGuard qua UDP, OpenVPN qua TCP 443, và mạng lưới có DERP dự phòng — cái nào đi qua được.', { tour: 'vpn-school' })}

<h3>9 — VPN trên điện thoại</h3>
${R('c144-dt', 'qrencode', 1)}
<p>Thêm một peer trên máy chủ, viết cấu hình full tunnel có <code>DNS =</code>, biến nó thành mã QR, quét bằng ứng dụng WireGuard. Dùng khi ngồi Wi-Fi quán cà phê hay khách sạn. (Mã QR này chứa khoá của lab — mã thật là một mật khẩu: đừng bao giờ đăng nó lên.) Trên iOS/Android hãy tìm thêm "On-Demand" / "VPN luôn bật" + "Chặn kết nối khi không có VPN": đó là kill switch của điện thoại.</p>

<h3>🕵️ Góc kẻ xấu</h3>
<ul>
<li><strong>Người vận hành VPN thấy mọi thứ trường từng thấy — và hơn thế.</strong> Trên VPS ta bắt gói ở <code>wg0</code> trong lúc laptop đăng nhập một trang HTTP rồi một trang HTTPS:</li>
</ul>
${R('c144-thay', 'tshark', 2)}
<p>Mật khẩu qua HTTP tới máy chủ VPN ở dạng rõ; với HTTPS, người vận hành vẫn thấy tên trang (SNI) và thời gian. VPN chuyển chỗ đặt niềm tin, không xoá được nó. Tự chạy (như ở đây), hoặc chọn bên mà bạn hiểu họ kiếm tiền bằng gì.</p>
<ul>
<li><strong>Ứng dụng "VPN miễn phí"</strong> từng bị bắt quả tang bán lịch sử duyệt web, chèn quảng cáo, hoặc kèm mã độc với quyền mạng cao nhất. VPN miễn phí luôn được trả bằng một thứ gì đó.</li>
<li><strong>VPN không làm bạn ẩn danh.</strong> Tài khoản đang đăng nhập, cookie và dấu vân tay trình duyệt nhận ra bạn qua bất kỳ đường hầm nào.</li>
<li><strong>Khoá riêng WireGuard là một mật khẩu.</strong> Ai có nó là giả được laptop của bạn trước máy chủ. Mỗi thiết bị một khoá; mất máy thì gỡ peer (<code>wg set wg0 peer … remove</code>).</li>
<li><strong>Trang giả "bắt buộc dùng VPN"</strong> trên Wi-Fi công cộng đòi cài một profile hay chứng chỉ: profile đó có thể định tuyến hoặc giải mã lưu lượng của bạn.</li>
</ul>

<h3>"Nếu… thì sao"</h3>
<ul>
<li><strong>…trường chặn IP máy chủ VPN?</strong> (<code>vpn.test</code> của bài 14.2.) Mọi thứ nối tới IP đó đều chết, ở cổng nào cũng vậy. Đổi máy chủ, dùng mạng lưới có trạm chuyển tiếp, hoặc 4G.</li>
<li><strong>…trường soi TLS hoặc nhận ra cái bắt tay của OpenVPN?</strong> sslh qua mặt được luật theo cổng đơn giản của ta, nhưng DPI nhận diện được OpenVPN; có những lớp ngụy trang nặng hơn (đường hầm bọc TLS như 14.3). Nơi nào có quy định cấm rõ VPN thì theo quy định.</li>
<li><strong>…VPN và mạng tại chỗ dùng cùng một dải</strong> (cùng 10.0.0.0/24)? Tuyến đụng nhau và một bên không tới được — chọn một dải lạ cho VPN của bạn (ở đây 10.66.0.0/24).</li>
<li><strong>…bật VPN công ty và VPN của mình cùng lúc?</strong> Hai full tunnel giành nhau tuyến mặc định; thường chỉ một cái chạy.</li>
</ul>

<h3>Nó nằm ở đâu trong máy tính</h3>
<ul>
<li>WireGuard là một card mạng của nhân (<code>wg0</code>); mã hoá diễn ra trong nhân, khoá nằm trong bộ nhớ nhân sau <code>wg setconf</code>.</li>
<li>OpenVPN là một tiến trình ở user-space đọc ghi một thiết bị <code>tun</code> — mỗi gói vượt ranh giới nhân ↔ tiến trình hai lần, một lý do nó chậm hơn (trừ khi dùng DCO, module nhân của nó).</li>
<li>Tuyến và luật định tuyến (<code>ip rule</code>, bảng 51820) là bảng của nhân; <code>/etc/resolv.conf</code> quyết định laptop hỏi DNS nào — VPN không đổi nó trừ khi có thứ gì ghi vào tệp đó.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> bạn muốn laptop vào được các dịch vụ riêng trên VPS khi ở nhà, và lướt web an toàn khi ngồi thư viện. Lab: <code>CHI=144 GIU_LAB=1 bash lab/code/dung-output-ch14b.sh</code>.</p>
<ol>
<li>Trên <code>nft-lap</code>, bật WireGuard kiểu split tunnel; chứng minh bằng <code>ip route get</code> lưu lượng nào vào <code>wg0</code>.</li>
<li>Đổi sang full tunnel; chỉ ra bằng <code>curl http://news.test/</code> rằng giờ trang thấy VPS.</li>
<li>Trên <code>nft-win</code> (ở trường), chỉ ra vì sao WireGuard hỏng (một bộ đếm trên <code>nft-gw</code>).</li>
<li>Nối OpenVPN qua 443, tìm chỗ rò DNS bằng một lần bắt gói trên <code>nft-gw</code>, vá nó, rồi bắt lại.</li>
<li>Giết OpenVPN và kiểm xem có gì đi ra ngoài hầm không.</li>
</ol>
<p><strong>Đạt khi:</strong> mỗi bước có lệnh và output thật, và lần bắt gói thứ hai trên <code>nft-gw</code> không còn câu hỏi DNS nào từ laptop.</p>
<details><summary>Lời giải</summary><p>1: AllowedIPs 10.66.0.0/24 ⇒ <code>ip route get 10.66.0.1</code> → dev wg0, <code>ip route get 198.18.0.10</code> → via 192.168.1.1. 2: AllowedIPs 0.0.0.0/0 ⇒ "ban den tu 198.18.0.30". 3: không bắt tay, 0 B received; <code>iptables -L CHAN -v -n</code> — bộ đếm "udp DROP" tăng. 4: <code>tcpdump -i sv0 udp port 53</code> trên nft-gw thấy các tên; <code>echo nameserver 198.18.0.53 &gt; /etc/resolv.conf</code>; bắt lại: không còn gì. 5: <code>curl http://198.18.0.10/</code> → "ban den tu 198.18.0.1" = đã lộ; kill switch sẽ chặn nó.</p></details>
</div>

<details><summary>🧠 Tự kiểm (5 câu)</summary>
<ol>
<li><code>AllowedIPs = 0.0.0.0/0</code> trên máy khách WireGuard nghĩa là gì? — <em>Đưa mọi thứ vào hầm (full tunnel), và nhận mọi địa chỉ nguồn từ peer đó.</em></li>
<li>Vì sao WireGuard hỏng ở mạng bỏ UDP, và kế hoạch B là gì? — <em>Nó chỉ nói UDP; VPN qua TCP 443 (OpenVPN sau sslh) hoặc mạng lưới có trạm chuyển tiếp HTTPS.</em></li>
<li>Hầm đã mở mà trường vẫn thấy câu hỏi DNS của bạn. Vì sao? — <em>Máy phân giải nằm trên mạng tại chỗ (tuyến cụ thể hơn) và resolv.conf chưa được đổi.</em></li>
<li>Kill switch là gì? — <em>Hầm sập thì không gì được đi ra ngoài hầm.</em></li>
<li>Ai đọc được mật khẩu HTTP gửi qua VPN? — <em>Người vận hành máy chủ VPN (sau khi giải mã) và mọi chặng sau đó.</em></li>
</ol></details>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
    ['VPN', 'Một card mạng ảo được mã hoá, đầu kia là máy chủ bạn chọn.'],
    ['WireGuard', 'VPN nhỏ nằm trong nhân, chạy UDP; nhận diện máy bằng khoá công khai.'],
    ['AllowedIPs (cryptokey routing)', 'Theo từng peer: địa chỉ nào định tuyến tới nó và nhận từ nó.'],
    ['split / full tunnel', 'Chỉ một số mạng, hay mọi lưu lượng đi qua VPN.'],
    ['DNS leak (rò DNS)', 'Câu hỏi DNS đi ra ngoài hầm, tới máy phân giải tại chỗ.'],
    ['kill switch', 'Chặn mọi lưu lượng khi VPN sập.'],
    ['redirect-gateway def1', 'OpenVPN thêm 0.0.0.0/1 + 128.0.0.0/1 qua hầm — cụ thể hơn tuyến mặc định.'],
    ['DERP', 'Trạm chuyển tiếp của Tailscale qua HTTPS 443 khi không có đường UDP trực tiếp.'],
  ])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>VPN là card mạng thứ hai: thứ gì bảng định tuyến gửi vào nó sẽ đi ra ở máy chủ của bạn — split tunnel cho vài mạng, full tunnel cho tất cả.</li>
<li>WireGuard: khoá như SSH, một cổng UDP, chạy được từ sau CGNAT; chết ở nơi UDP bị bỏ.</li>
<li>Kế hoạch B trên Wi-Fi bị chặn: VPN qua TCP 443 (ở đây OpenVPN sau sslh), hoặc mạng lưới có trạm chuyển tiếp HTTPS.</li>
<li>Kiểm DNS: đường hầm không tự đổi máy phân giải trừ khi có thứ gì đổi resolv.conf.</li>
<li>Không có kill switch thì VPN sập là lộ trong im lặng; người vận hành VPN thấy những gì trường từng thấy.</li>
</ul>
<p>Bài liên quan: <a href="${bai('netdev-14-3-ssh-cong-bi-chan')}">14.3 SSH khi cổng 22 bị chặn</a> · <a href="${bai('netdev-14-2-mang-truong-chan')}">14.2 Mạng trường chặn gì</a> · <a href="${bai('netdev-5-1-udp')}">5.1 UDP</a> · <a href="${bai('netdev-9-4-webrtc')}">9.4 WebRTC (xuyên NAT)</a> · <a href="${bai('netdev-2-3-nat')}">2.3 NAT</a> · <a href="${bai('netdev-4-3-tac-nghen')}">4.3 Kiểm soát tắc nghẽn</a> · <a href="/courses/network-security">Bảo mật mạng (WireGuard, Tailscale)</a>.</p>
${L('https://www.wireguard.com/papers/wireguard.pdf', '📄', 'WireGuard: Next Generation Kernel Network Tunnel (whitepaper)', 'Cryptokey routing, cái bắt tay, vì sao chỉ UDP.', 'Mở')}
${L('https://www.wireguard.com/netns/', '📄', 'WireGuard — Định tuyến và network namespace', 'wg-quick định tuyến 0.0.0.0/0 mà không thành vòng lặp (fwmark, bảng 51820).', 'Mở')}
${L('https://tailscale.com/blog/how-nat-traversal-works', '📄', 'Tailscale — Xuyên NAT hoạt động thế nào', 'Đục lỗ NAT, và trạm DERP khi thất bại.', 'Mở')}
${L('https://openvpn.net/community-resources/reference-manual-for-openvpn-2-6/', '📄', 'Sách tham chiếu OpenVPN 2.6', 'redirect-gateway, peer-fingerprint, proto tcp.', 'Mở')}
</div>
`,
};
