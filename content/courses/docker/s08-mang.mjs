/**
 * Docker — Chương 8: mạng.
 * bridge mặc định vs tự tạo · công bố cổng · DNS giữa container · với tới máy chủ · chẩn đoán · quiz.
 * Output CHẠY THẬT Docker Engine 27 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 *
 * Nâng cấp 09/2026: bài 8.0 slide (deck dk-08, 32 slide) + slide/🧪/🗂/📌 + phần đào sâu trong 8.1–8.5;
 * quiz 10 câu. Output MỚI chạy thật 23–24/09/2026 trên Docker Engine 29.6 (Fedora 44, amd64, firewalld)
 * và Docker Desktop 4.91 / Engine 29.8 (Mac M1). Hai máy cùng LAN: Mac đóng vai "máy khác" gõ vào máy Linux.
 * Luật tường lửa chỉ ĐỌC (container phụ --network host --privileged), không sửa gì.
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fdocker%2Flearn&reflabel=Docker';

export default {
  title: 'Chapter 8 — Networking|||Chương 8 — Mạng',
  description: 'Container nói chuyện với nhau bằng tên, với thế giới bên ngoài qua cổng công bố, và với máy chủ theo một cách riêng. Chương này dựng lại mô hình mạng của Docker từ network namespace lên tới bảng iptables, rồi đưa cho bạn một sách công thức chẩn đoán.',
  lessons: [
    /* ─────────────────────────── 8.0 ─────────────────────────── */
    {
      title: '8.0 — Chapter 8 slides: container networking in pictures|||8.0 — Slide Chương 8: mạng container bằng hình',
      slug: 'dk-8-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 32 slide của Chương 8: namespace và dây veth, bridge mặc định không có DNS, -p là luật DNAT đi vòng qua tường lửa (đo thật), sự cố Postgres lộ ra mạng, DNS nhúng 127.0.0.11, host.docker.internal trên Mac và Linux, và bốn câu hỏi chẩn đoán — xem trước khi học hoặc dùng để ôn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Slides</span>
<h2>The whole chapter in 32 slides</h2>
<p class="lead">Skim these before the lessons to get the shape of Docker networking, then come back after the quiz as a revision sheet. Slide 3 is the chapter in one picture: a host with two bridges, containers plugged in by veth cables, the embedded DNS answering by NAME, and a published port entering through NAT on the real NIC. Every later slide zooms into one part of that picture.</p>
<p>Slides 3–8 belong to Lesson 8.1, 9–15 to 8.2, 16–20 to 8.3, 21–24 to 8.4 and 25–29 to 8.5. The last three are the chapter's common mistakes, a cheat sheet, and a 45-minute practice session. Every terminal on the slides is real output, recorded in September 2026 on Docker Engine 29.6 (Linux, firewalld active) and Docker Desktop 4.91 (Mac M1) — with the Mac playing "another machine on the network" to knock on the Linux machine's published ports. Firewall rules were only READ, never changed. The slides are in Vietnamese; the diagrams read the same in any language.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Slide</span>
<h2>Cả chương trong 32 slide</h2>
<p class="lead">Lướt bộ này trước khi vào bài để nắm hình dạng của mạng Docker, rồi quay lại sau bài kiểm tra như một tờ ôn tập. Slide 3 là cả chương trong một hình: một máy chủ có hai cây cầu, các container cắm vào bằng dây veth, DNS nhúng trả lời theo TÊN, và một cổng công bố đi vào qua NAT ở card mạng thật. Mọi slide sau đó phóng to một phần của hình ấy.</p>
<p>Slide 3–8 thuộc Bài 8.1, 9–15 thuộc 8.2, 16–20 thuộc 8.3, 21–24 thuộc 8.4 và 25–29 thuộc 8.5. Ba slide cuối là những sai lầm hay gặp của chương, bảng tra nhanh và một buổi thực hành 45 phút. Mọi terminal trên slide là output THẬT, ghi tháng 9/2026 trên Docker Engine 29.6 (Linux, firewalld đang bật) và Docker Desktop 4.91 (Mac M1) — máy Mac đóng vai "một máy khác trong mạng" gõ vào các cổng đã công bố của máy Linux. Luật tường lửa chỉ được ĐỌC, không sửa gì. Con số trên máy bạn có thể khác, quy luật thì không.</p>
</div>
${gallery('dk-08', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Cả chương trong một hình'], [4, 'Một sợi dây veth, hai đầu'], [5, 'Năm driver'],
  [6, 'Bridge mặc định không trả lời tên'], [7, 'Một container, hai mạng, hai card'], [8, 'Khác mạng không thấy nhau; --internal không ra ngoài'],
  [9, 'EXPOSE là ghi chú, -p mới khoét lỗ'], [10, 'Giải phẫu cờ -p'], [11, 'Gói tới cổng -p đi đường FORWARD'],
  [12, 'Đọc luật DNAT thật và bộ đếm'], [13, 'Sự cố: Postgres mở cho cả mạng'], [14, 'Ba cách vá và phép rà 2 giây'], [15, 'docker-proxy và hai lỗi cổng bận'],
  [16, 'DNS nhúng 127.0.0.11'], [17, 'Một container, nhiều tên'], [18, 'Mạng hai tầng'], [19, 'Tên đúng mà vẫn refused'], [20, '--link đã chết'],
  [21, 'Bốn chữ localhost'], [22, 'host.docker.internal: Mac và Linux'], [23, '--network host'], [24, '--network container:app'],
  [25, 'Bốn câu hỏi chẩn đoán'], [26, 'Soi socket không cần sudo'], [27, 'Refused và timeout trên dây'], [28, 'dig → nc → curl → tcpdump'], [29, 'Kịch bản phân loại 10 giây'],
  [30, 'Sai lầm hay gặp'], [31, 'Bảng tra nhanh'], [32, 'Thực hành chương 8'],
])}
`,
    },
    /* ─────────────────────────── 8.1 ─────────────────────────── */
    {
      title: '8.1 — Networks, and why the default bridge is the wrong one|||8.1 — Mạng, và vì sao bridge mặc định là cái sai',
      slug: 'dk-8-1-mang-bridge',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Network namespace và docker0, năm driver mạng của Docker, khác biệt quyết định giữa bridge mặc định với bridge tự tạo (DNS), tạo và gắn mạng, và cách đọc docker network inspect.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>Networks, and why the default bridge is the wrong one</h2>
<p class="lead">Every container gets its own network namespace — its own interfaces, its own routing table, its own view of what "localhost" means (Lesson 1.1). Docker then wires those namespaces together with virtual ethernet pairs and a bridge. Understanding that one sentence explains almost every networking question people ask, including the one that starts "why can't my app reach the database".</p>

<h3>What a container's network actually looks like</h3>
${slide('dk-08', 3, 'Cả chương trong một hình: namespace, dây veth, cây cầu, NAT')}
${slide('dk-08', 4, 'Một sợi dây veth, hai đầu: eth0 ↔ veth trên máy chủ')}
<pre><code>docker run -d --name web nginx:alpine &gt;/dev/null
docker exec web ip -o -4 addr        <span class="tok-comment"># BusyBox's ip has no -brief</span>
docker exec web ip route</code></pre>
<div class="out">1: lo    inet 127.0.0.1/8 scope host lo\\       valid_lft forever preferred_lft forever
2: eth0    inet 172.17.0.4/16 brd 172.17.255.255 scope global eth0\\       valid_lft forever preferred_lft forever
default via 172.17.0.1 dev eth0
172.17.0.0/16 dev eth0 scope link  src 172.17.0.4</div>
<pre><code><span class="tok-comment"># The other end of that pair lives on the host, attached to the bridge</span>
docker exec web cat /sys/class/net/eth0/iflink     <span class="tok-comment"># the index of the peer</span>
ip -o link | grep '^615:' | cut -d' ' -f1-2
ip -brief addr show docker0</code></pre>
<div class="out">615
615: veth09f4385@if2:
docker0          UP             172.17.0.1/16 fe80::5493:c8ff:fe3f:fac4/64</div>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">container</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">eth0 · 172.17.0.4</span><span class="lz-nsub">One half of a veth pair, inside the container's own network namespace</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">host</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">veth09f4385</span><span class="lz-nsub">The other half, in the host namespace, enslaved to the bridge</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">docker0 · 172.17.0.1</span><span class="lz-nsub">A software switch, and the container's default gateway</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">outside</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">iptables MASQUERADE</span><span class="lz-nsub">Rewrites the source address on the way out, so replies find their way back</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">eth0 · your real NIC</span><span class="lz-nsub">Outbound traffic leaves looking like it came from the host</span></div></div>
  </div>
</div>

<h3>Run it step by step: follow the veth cable, no sudo needed</h3>
<p>The picture above sounds reasonable, but finding BOTH ends of the cable yourself is what makes it stick. The idea: every network interface in Linux has an index number (ifindex). A veth pair (virtual ethernet — two virtual NICs wired straight into each other like the two ends of one cable) knows the number of its other end, and the kernel exposes it in <code>/sys/class/net/eth0/iflink</code> inside the container. Read that number, find the interface carrying it on the host, and you have the other end.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Step 1 · see which NICs the container has</span><span class="lz-t">docker exec web ip -o -4 addr</span><span class="lz-d"><code>-o</code> prints each interface on ONE line, <code>-4</code> keeps IPv4 only. You see exactly two things: <code>lo</code> (loopback) and <code>eth0</code>.</span></div>
  <div class="lz-step"><span class="lz-k">Step 2 · ask eth0: what number is the other end?</span><span class="lz-t">docker exec web cat /sys/class/net/eth0/iflink</span><span class="lz-d">You get a number such as <code>615</code> — the ifindex of the cable's end outside the container.</span></div>
  <div class="lz-step"><span class="lz-k">Step 3 · find that interface on the host</span><span class="lz-t">ip -o link | grep '^615:'</span><span class="lz-d">You get <code>veth09f4385@if2</code>: a randomly named NIC starting with <code>veth</code>. The <code>@if2</code> means "my peer is interface 2" — the number of eth0 inside the container.</span></div>
  <div class="lz-step"><span class="lz-k">Step 4 · see which bridge it is plugged into</span><span class="lz-t">ip -brief link show master docker0</span><span class="lz-d">Lists every veth plugged into <code>docker0</code>. A user-defined network's bridge is named <code>br-</code> + the first 12 characters of the network ID.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># on the Linux machine (Mac: see the note below)</span>
docker network create app-net
docker run -d --name a --network app-net nginx:1.27-alpine
docker exec a cat /sys/class/net/eth0/iflink
ip -o link | awk -F': ' '\$1==646 {print \$1": "\$2}'
ip -br link show master br-\$(docker network inspect -f '{{.Id}}' app-net | cut -c1-12)
ip -br addr show br-\$(docker network inspect -f '{{.Id}}' app-net | cut -c1-12)
docker exec a ip route</code></pre>
<div class="out">646
646: vethb5fcc2a@if2
vethb5fcc2a@if2  UP             4e:45:8f:57:da:65 &lt;BROADCAST,MULTICAST,UP,LOWER_UP&gt;
vethbe8c5a9@if2  UP             3e:8c:f5:a6:6a:d7 &lt;BROADCAST,MULTICAST,UP,LOWER_UP&gt;
br-46b006276067  UP             172.24.0.1/16 fe80::4c55:30ff:fe25:801f/64
default via 172.24.0.1 dev eth0
172.24.0.0/16 dev eth0 scope link  src 172.24.0.2</div>
<p>Real output on the course's Linux machine (Fedora 44, Docker Engine 29.6). The bridge <code>br-46b006276067</code> has two veths because two containers (<code>a</code> and <code>b</code>) are on that network. The bridge owns <code>172.24.0.1</code>, and the container's <code>default via 172.24.0.1</code> says: every packet leaving the subnet goes to the bridge — the bridge IS the gateway.</p>
<table>
<tr><th>Piece</th><th>Meaning</th></tr>
<tr><td><code>ip -o -4 addr</code></td><td><code>ip</code> is Linux's network tool; <code>addr</code> lists addresses; <code>-o</code> (oneline) puts each interface on one line; <code>-4</code> is IPv4 only. In an alpine image this is BusyBox's <code>ip</code>, which does NOT understand <code>-brief</code> (try it and it prints its usage text).</td></tr>
<tr><td><code>/sys/class/net/eth0/iflink</code></td><td>A virtual file made by the kernel: the ifindex of eth0's peer. For a veth, that is the end living in the other namespace.</td></tr>
<tr><td><code>awk -F': ' '\$1==646'</code></td><td>Split each line on <code>: </code> and print only the line whose first column is 646. <code>grep '^646:'</code> works too.</td></tr>
<tr><td><code>ip -br link show master &lt;bridge&gt;</code></td><td>Only interfaces that are ports of that bridge — the veths of the containers on that network.</td></tr>
<tr><td><code>br-\$(docker network inspect -f '{{.Id}}' app-net | cut -c1-12)</code></td><td>A user-defined network's bridge is <code>br-</code> + the first 12 characters of the network ID. The sub-command fetches the ID and cuts it.</td></tr>
</table>
<div class="callout"><strong>What about a Mac?</strong> macOS has no <code>/sys</code> and no bridges: all of Docker's networking lives inside Docker Desktop's Linux VM. Steps 1–2 work unchanged. To see the "host side", run a container on the VM's own network: <code>docker run --rm --network host alpine ip -o -4 addr</code> — you will see the VM's <code>docker0</code> and <code>br-…</code> bridges, NOT your Mac's Wi-Fi card.</div>

<h3>The five drivers</h3>
${slide('dk-08', 5, 'Năm driver — 95% thời gian chỉ cần bridge tự tạo')}
<div class="kv-grid">
  <div class="kv"><span class="k">bridge</span><span class="v">The default, and what you want 95% of the time. A private subnet on the host with NAT to the outside. Containers on the same user-defined bridge reach each other by name.</span></div>
  <div class="kv"><span class="k">host</span><span class="v">No namespace at all — the container shares the host's network stack. No port publishing, no isolation, and <code>localhost</code> inside is the host's <code>localhost</code>. Fast, occasionally necessary, rarely right.</span></div>
  <div class="kv"><span class="k">none</span><span class="v">Only a loopback interface. For a container that must not have network access: a batch job processing a mounted file, a build step, anything you want provably offline.</span></div>
  <div class="kv"><span class="k">macvlan / ipvlan</span><span class="v">The container gets its own MAC and IP on your physical LAN, as if it were a separate machine. For legacy services that must be addressable directly. Needs promiscuous mode and cooperation from your switch.</span></div>
  <div class="kv"><span class="k">overlay</span><span class="v">Spans multiple Docker hosts, for Swarm services. Out of scope for a single VPS, and the thing Kubernetes replaces with its own CNI plugins.</span></div>
</div>

<h3>The default bridge versus a user-defined one</h3>
${slide('dk-08', 6, 'Bridge mặc định không trả lời tên — bridge tự tạo thì có')}
<pre><code><span class="tok-comment"># On the DEFAULT bridge (what you get with no --network flag)</span>
docker run -d --name db-a  postgres:16-alpine &gt;/dev/null
docker run --rm alpine:3.20 nslookup db-a</code></pre>
<div class="out">Server:		192.168.65.7
Address:	192.168.65.7:53

Non-authoritative answer:

** server can't find db-a: NXDOMAIN</div>
<pre><code><span class="tok-comment"># On a USER-DEFINED bridge</span>
docker network create app-net &gt;/dev/null
docker run -d --name db-b --network app-net postgres:16-alpine &gt;/dev/null
docker run --rm --network app-net alpine:3.20 nslookup db-b</code></pre>
<div class="out">Server:		127.0.0.11
Address:	127.0.0.11:53

Non-authoritative answer:

Non-authoritative answer:
Name:	db-b
Address: 172.23.0.2</div>
<div class="callout ok"><strong>This is the single most useful fact in the chapter.</strong> On a user-defined bridge, Docker runs an embedded DNS server at <code>127.0.0.11</code> that resolves container names to their current IP. On the default bridge it does not — names never resolve, and you are left with raw IPs that change on every restart. Create a network. Always. Compose does this for you automatically, which is why "it works in compose and not with <code>docker run</code>" is such a common report.</div>

<h3>Why the default bridge has no DNS: read /etc/resolv.conf</h3>
<p><code>/etc/resolv.conf</code> is the file every Linux program reads to learn "whom do I ask for names". Docker writes it for each container, and writes it DIFFERENTLY depending on the network. Compare the two and you see at once why one side resolves container names and the other does not:</p>
<pre><code class="language-bash"><span class="tok-comment"># container on the DEFAULT bridge</span>
docker run --rm alpine:3.20 cat /etc/resolv.conf
<span class="tok-comment"># container on a USER-DEFINED network</span>
docker run --rm --network app-net alpine:3.20 cat /etc/resolv.conf</code></pre>
<div class="out"># Generated by Docker Engine.
# This file can be edited; Docker Engine will not make further changes once it
# has been modified.

nameserver 192.168.65.7

# Based on host file: '/etc/resolv.conf' (legacy)
# Overrides: []
# Generated by Docker Engine.
# This file can be edited; Docker Engine will not make further changes once it
# has been modified.

nameserver 127.0.0.11
options ndots:0

# Based on host file: '/etc/resolv.conf' (internal resolver)
# ExtServers: [host(192.168.65.7)]
# Overrides: []
# Option ndots from: internal</div>
<p>Real output on the Mac (Docker Desktop 4.91). Line by line:</p>
<ul>
<li>The default bridge writes <code>nameserver 192.168.65.7</code> — the host's own DNS (on a Mac, the VM's), and labels the mode <code>(legacy)</code>. The host's DNS has never heard of a container called <code>db-a</code>, so the answer is NXDOMAIN (no such name).</li>
<li>The user-defined network writes <code>nameserver 127.0.0.11</code> and <code>(internal resolver)</code>. That address lives INSIDE the container's namespace; dockerd listens there, knows every container name on the network, and forwards anything it does not know to the host — which is exactly what <code>ExtServers: [host(192.168.65.7)]</code> records.</li>
<li><code>options ndots:0</code>: every name is tried literally first, with no search suffix appended. That is why <code>db</code> is asked as exactly <code>db</code>.</li>
</ul>
<div class="callout warn"><strong>Do not hand-edit this file to "fix" DNS.</strong> Its first lines say it: once modified, Docker stops updating it. The right knobs are <code>--dns</code> / <code>--dns-search</code> on the container, or the <code>dns:</code> key in compose.</div>

<h3>Creating, attaching, inspecting</h3>
${slide('dk-08', 7, 'Một container vào hai mạng = hai card mạng')}
<pre><code>docker network create --driver bridge --subnet 10.42.0.0/24 --gateway 10.42.0.1 edge
docker network ls
docker network connect edge web          <span class="tok-comment"># a running container can join another network</span>
docker network inspect edge -f '{{ range .Containers }}{{ .Name }} {{ .IPv4Address }}{{ end }}'</code></pre>
<div class="out">NETWORK ID     NAME      DRIVER    SCOPE
9a3f1c7e2b84   app-net   bridge    local
c1e8b3d94f27   bridge    bridge    local
7d2a5f9c1e63   edge      bridge    local
4b8e1a2f7c95   host      host      local
e6c3d7b1a482   none      null      local
web 10.42.0.2/24</div>
<div class="kv-grid">
  <div class="kv"><span class="k">A container can be on several networks</span><span class="v">Each gives it another interface and another set of names it can resolve. This is how you put a reverse proxy on both a public-facing network and a private backend one.</span></div>
  <div class="kv"><span class="k">Networks are isolation boundaries</span><span class="v">Two containers on different bridges cannot reach each other, at all, without a route. That is a real security control and it costs nothing.</span></div>
  <div class="kv"><span class="k"><code>--network-alias</code></span><span class="v">An extra DNS name on that network. Useful when several containers should answer to one name (round-robin), or when a name must match a hard-coded config.</span></div>
  <div class="kv"><span class="k"><code>--internal</code></span><span class="v">A bridge with no route to the outside. A database network that physically cannot reach the internet is a good default for a backend tier.</span></div>
  <div class="kv"><span class="k">Subnets are yours to pick</span><span class="v">Docker's defaults (172.17–172.31) collide with corporate VPNs surprisingly often. <code>--subnet</code> on the network, or <code>default-address-pools</code> in <code>/etc/docker/daemon.json</code>, avoids an afternoon of confusion.</span></div>
</div>

<h3>Flag table: docker network create, connect, disconnect</h3>
<table>
<tr><th>Command / flag</th><th>Does</th><th>Note</th></tr>
<tr><td><code>docker network create app-net</code></td><td>Creates a user-defined bridge; Docker picks the subnet</td><td>On the course machine: 172.23.0.0/16, 172.24.0.0/16… whichever is free next</td></tr>
<tr><td><code>--driver bridge</code> (<code>-d</code>)</td><td>Choose the driver</td><td>Bridge is already the default; spelling it out is clearer</td></tr>
<tr><td><code>--subnet 10.42.0.0/24</code></td><td>Pick the address range</td><td>/24 = 254 addresses, plenty for one project</td></tr>
<tr><td><code>--gateway 10.42.0.1</code></td><td>The bridge's IP</td><td>Must be inside the subnet</td></tr>
<tr><td><code>--internal</code></td><td>Bridge with no way out</td><td>Right for a database tier</td></tr>
<tr><td><code>--ipv6</code></td><td>Also assign IPv6 addresses</td><td>Docker 29: containers get BOTH IPv4 and IPv6 (Lesson 8.4)</td></tr>
<tr><td><code>--label k=v</code></td><td>Tag it</td><td>For filtering: <code>docker network ls --filter label=k=v</code></td></tr>
<tr><td><code>docker network connect app-net web</code></td><td>Plug another NIC into a RUNNING container</td><td>The container gains <code>eth1</code> without a restart</td></tr>
<tr><td><code>docker network disconnect app-net web</code></td><td>Unplug it</td><td>web's name disappears from that network's DNS</td></tr>
<tr><td><code>docker network rm app-net</code></td><td>Delete the network</td><td>Fails while containers are still attached</td></tr>
</table>
<p>One detail people skip in the output above: after <code>connect</code>, web's <code>ip route</code> still has ONE <code>default</code> line — via <code>eth0</code>. The second NIC only adds a route to its own subnet. So joining another network does not change the container's way to the internet; it only adds neighbours.</p>

<h3>Networks are real walls: prove it yourself</h3>
${slide('dk-08', 8, 'Khác mạng thì không thấy nhau; mạng --internal thì không ra ngoài')}
<p>"Two different networks cannot reach each other" is easy to skim past. Proving it takes three commands and shows you a symptom you will meet again in Lesson 8.5: a packet blocked between networks gets NO answer — you see a <em>timeout</em>, not a <em>refused</em>.</p>
<pre><code class="language-bash"><span class="tok-comment"># on the Mac: web is on the default bridge, IP 172.17.0.10</span>
docker run --rm alpine:3.20 wget -qO- -T 3 http://172.17.0.10/ | head -1
<span class="tok-comment"># same address, asked from the app-net network</span>
docker run --rm --network app-net alpine:3.20 wget -qO- -T 3 http://172.17.0.10/
<span class="tok-comment"># an --internal network: no way out</span>
docker network create --internal private
docker run --rm --network private alpine:3.20 wget -qO- -T 3 http://example.com/
docker run --rm --network private alpine:3.20 ip route</code></pre>
<div class="out">&lt;!DOCTYPE html&gt;
wget: download timed out
wget: bad address 'example.com'
172.24.0.0/16 dev eth0 scope link  src 172.24.0.2</div>
<table>
<tr><th>Result</th><th>Why</th></tr>
<tr><td>Same default bridge: the nginx page loads by IP</td><td>The default bridge still lets containers talk (<code>enable_icc: true</code> in <code>docker network inspect bridge</code>) — it just has no NAMES.</td></tr>
<tr><td>From another network: <code>download timed out</code></td><td>Docker installs rules that drop packets going from one bridge to another. Dropped silently, so wget waits the full 3 seconds (<code>-T 3</code>).</td></tr>
<tr><td><code>--internal</code>: <code>bad address</code></td><td>Nothing forwards DNS queries out of an internal network, so outside names do not even resolve — it never gets as far as connecting.</td></tr>
<tr><td><code>ip route</code> has one line</td><td>No <code>default via …</code>: the container has no gateway, so outbound packets have nowhere to go.</td></tr>
</table>
<div class="callout ok"><strong>When should you use the default bridge? Almost never.</strong> It exists so that a bare <code>docker run</code> "just works". Anything you intend to keep longer than an afternoon — a school project, a stack on a VPS — belongs on a user-defined network (compose makes one for you). The one reasonable use left: a container that runs one command, removes itself (<code>--rm</code>) and needs nobody's name.</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> a SWP391 teammate runs the API and Postgres with two separate <code>docker run</code> commands. The API reports <code>getaddrinfo ENOTFOUND thu-db</code>, while <code>docker ps</code> shows <code>thu-db</code> happily running. Reproduce the error, show the cause with evidence, then fix it WITHOUT recreating the database container.</p><ol>
<li>In <code>~/thu-docker</code>, start the database "the teammate's way": <code>docker run -d --name thu-db -e POSTGRES_PASSWORD=x -v thu-pgdata:/var/lib/postgresql/data postgres:16-alpine</code> (no <code>--network</code>).</li>
<li>Pretend to be the API asking for the name: <code>docker run --rm alpine:3.20 getent hosts thu-db; echo "exit \$?"</code> — note the exit code. Read <code>docker run --rm alpine:3.20 cat /etc/resolv.conf</code> and point at the <code>nameserver</code> line.</li>
<li>Create a network and plug the running database into it: <code>docker network create thu-net</code>, then <code>docker network connect thu-net thu-db</code>.</li>
<li>Ask again from the new network: <code>docker run --rm --network thu-net alpine:3.20 getent hosts thu-db</code>. Check <code>docker exec thu-db ip -o -4 addr</code>: how many NICs does the database have now?</li>
<li>Clean up: <code>docker rm -f thu-db; docker volume rm thu-pgdata; docker network rm thu-net</code>.</li></ol>
<pre><code class="language-bash">docker exec thu-db ip -o -4 addr | awk '{print \$2, \$4}'</code></pre>
<div class="out">lo 127.0.0.1/8
eth0 172.17.0.11/16
eth1 172.27.0.2/16</div>
<p><strong>Done when:</strong> step 2 prints <code>exit 2</code> (getent found nothing) and you can show the <code>nameserver</code> is NOT <code>127.0.0.11</code>; step 4 prints an IP for <code>thu-db</code>; and <code>thu-db</code> has exactly two NICs, <code>eth0</code> + <code>eth1</code> — even though it was never restarted.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Network namespace</span><span class="v">A container's own set of NICs, routing table and ports; inside it, "localhost" is its own.</span></div>
  <div class="kv"><span class="k">veth pair</span><span class="v">Two virtual NICs wired to each other like the ends of a cable: <code>eth0</code> in the container, <code>vethXXXX</code> on the host.</span></div>
  <div class="kv"><span class="k">Bridge</span><span class="v">A software switch on the host (<code>docker0</code>, <code>br-…</code>) that every veth of a network plugs into.</span></div>
  <div class="kv"><span class="k">Gateway</span><span class="v">Where the container sends every packet bound elsewhere; on a bridge network, the bridge's own IP (e.g. 172.17.0.1).</span></div>
  <div class="kv"><span class="k">Embedded DNS</span><span class="v">Docker's resolver at <code>127.0.0.11</code>, present only on user-defined networks, which knows the names of containers on that network.</span></div>
  <div class="kv"><span class="k">Subnet</span><span class="v">A network's address range, e.g. <code>172.24.0.0/16</code>; pick it with <code>--subnet</code> to avoid VPN clashes.</span></div>
  <div class="kv"><span class="k">NAT / MASQUERADE</span><span class="v">An iptables rule that rewrites an outgoing packet's source to the host's IP so the reply can find its way back.</span></div>
  <div class="kv"><span class="k">--internal network</span><span class="v">A network with no gateway out: containers on it can only talk to each other.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Every container has its own network namespace, joined to a bridge on the host by a veth pair; the bridge is its gateway.</li>
<li>The default bridge (<code>docker0</code>) has NO name-based DNS: <code>/etc/resolv.conf</code> points at the host's DNS, so container names come back NXDOMAIN.</li>
<li>A user-defined network gives <code>nameserver 127.0.0.11</code>: dockerd answers container names and forwards everything else.</li>
<li><code>docker network connect</code> plugs another NIC into a running container — no need to recreate it.</li>
<li>Two different networks do not talk (a timeout, not a refused); <code>--internal</code> also cuts the way to the internet.</li>
<li>Always create a network (or let compose do it) and call each other by NAME; never put container IPs in config.</li>
</ul>


<a class="link-card" href="https://docs.docker.com/engine/network/" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">Docker docs — Networking overview</span><span class="lc-sub">Every driver, the differences between the default and user-defined bridges in a table, and the DNS behaviour spelled out. The page to reread when something does not resolve.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/network/drivers/bridge/" target="_blank" rel="noopener">
  <span class="lc-ico">🌉</span>
  <span class="lc-body"><span class="lc-title">Bridge networks in depth</span><span class="lc-sub">How <code>docker0</code> and veth pairs are wired, the options for custom subnets and gateways, and the exact list of what user-defined bridges give you over the default.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: build a two-tier network</span><span class="lc-sub">Graded exercises: prove that name resolution fails on the default bridge and works on a user-defined one, put a proxy on two networks, and make a backend network that cannot reach the internet.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> using container IP addresses in configuration. They look stable — <code>172.17.0.2</code> today, <code>172.17.0.2</code> after a restart — right up until a container starts in a different order and the addresses shift by one. Then a config file points at the wrong service, and because both services accept TCP connections, the failure is a confusing protocol error rather than a connection refused. On a user-defined network the container name is a DNS entry that follows the container wherever it goes; use it. The only place raw IPs belong is a one-off <code>curl</code> during diagnosis, and even there <code>docker inspect -f '{{ .NetworkSettings.Networks.appnet.IPAddress }}'</code> is a better habit than reading one off a screen.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Each container has its own network namespace, joined to a bridge on the host by a veth pair — that model explains publishing, <code>localhost</code>, and isolation all at once. Containers on a <em>user-defined</em> bridge resolve each other by name via Docker's embedded DNS at <code>127.0.0.11</code>; on the default bridge they do not, which is why you always create a network. And a network is a real isolation boundary: an <code>--internal</code> backend network is free security.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Mạng, và vì sao bridge mặc định là cái sai</h2>
<p class="lead">Mỗi container có network namespace riêng — giao diện riêng, bảng định tuyến riêng, cách hiểu riêng về chữ "localhost" (Bài 1.1). Rồi Docker nối những namespace đó với nhau bằng các cặp ethernet ảo và một cây cầu. Hiểu đúng một câu đó là giải thích được gần như mọi câu hỏi về mạng người ta hay hỏi, kể cả câu bắt đầu bằng "vì sao ứng dụng của tôi không với tới cơ sở dữ liệu".</p>

<h3>Mạng của một container thật ra trông thế nào</h3>
${slide('dk-08', 3, 'Cả chương trong một hình: namespace, dây veth, cây cầu, NAT')}
${slide('dk-08', 4, 'Một sợi dây veth, hai đầu: eth0 ↔ veth trên máy chủ')}
<pre><code>docker run -d --name web nginx:alpine &gt;/dev/null
docker exec web ip -o -4 addr        <span class="tok-comment"># ip của BusyBox không có -brief</span>
docker exec web ip route</code></pre>
<div class="out">1: lo    inet 127.0.0.1/8 scope host lo\\       valid_lft forever preferred_lft forever
2: eth0    inet 172.17.0.4/16 brd 172.17.255.255 scope global eth0\\       valid_lft forever preferred_lft forever
default via 172.17.0.1 dev eth0
172.17.0.0/16 dev eth0 scope link  src 172.17.0.4</div>
<pre><code><span class="tok-comment"># Đầu kia của cặp đó nằm trên máy chủ, gắn vào cây cầu</span>
docker exec web cat /sys/class/net/eth0/iflink     <span class="tok-comment"># số của đầu dây bên kia</span>
ip -o link | grep '^615:' | cut -d' ' -f1-2
ip -brief addr show docker0</code></pre>
<div class="out">615
615: veth09f4385@if2:
docker0          UP             172.17.0.1/16 fe80::5493:c8ff:fe3f:fac4/64</div>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">container</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">eth0 · 172.17.0.4</span><span class="lz-nsub">Một nửa của cặp veth, nằm trong network namespace riêng của container</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">máy chủ</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">veth09f4385</span><span class="lz-nsub">Nửa còn lại, nằm trong namespace của máy chủ, bị gắn vào cây cầu</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">docker0 · 172.17.0.1</span><span class="lz-nsub">Một cái switch bằng phần mềm, và là gateway mặc định của container</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">bên ngoài</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">iptables MASQUERADE</span><span class="lz-nsub">Viết lại địa chỉ nguồn lúc đi ra, để gói trả lời biết đường về</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">eth0 · card mạng thật của bạn</span><span class="lz-nsub">Lưu lượng đi ra trông như xuất phát từ máy chủ</span></div></div>
  </div>
</div>

<h3>Chạy thử từng bước: lần theo sợi dây veth, không cần sudo</h3>
<p>Hình ở trên nghe hợp lý, nhưng tự tay tìm ra HAI đầu của sợi dây mới làm nó "vào đầu". Ý tưởng: mỗi giao diện mạng trong Linux có một số thứ tự (ifindex). Một cặp veth (virtual ethernet — cặp card mạng ảo nối thẳng vào nhau như hai đầu một sợi cáp) biết số của đầu bên kia, và nhân Linux ghi con số đó vào file <code>/sys/class/net/eth0/iflink</code> bên trong container. Đọc số đó, rồi tìm giao diện mang số đó trên máy chủ, là thấy đầu dây còn lại.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Bước 1 · xem container có những card mạng nào</span><span class="lz-t">docker exec web ip -o -4 addr</span><span class="lz-d"><code>-o</code> in mỗi giao diện trên MỘT dòng, <code>-4</code> chỉ lấy IPv4. Bạn thấy đúng hai thứ: <code>lo</code> (loopback — vòng lặp nội bộ) và <code>eth0</code>.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 2 · hỏi eth0: đầu bên kia mang số mấy?</span><span class="lz-t">docker exec web cat /sys/class/net/eth0/iflink</span><span class="lz-d">Ra một con số, ví dụ <code>615</code>. Đó là ifindex của đầu dây nằm ngoài container.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 3 · tìm giao diện số đó trên máy chủ</span><span class="lz-t">ip -o link | grep '^615:'</span><span class="lz-d">Ra <code>veth09f4385@if2</code>: một card tên ngẫu nhiên bắt đầu bằng <code>veth</code>. Phần <code>@if2</code> nghĩa là "đầu kia của tôi là giao diện số 2" — đúng số của eth0 trong container.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 4 · xem nó cắm vào cầu nào</span><span class="lz-t">ip -brief link show master docker0</span><span class="lz-d">Liệt kê mọi veth đang "cắm" vào cầu <code>docker0</code>. Mạng tự tạo thì cầu tên <code>br-</code> + 12 ký tự đầu của ID mạng.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># chạy trên máy Linux (Mac: xem ghi chú bên dưới)</span>
docker network create app-net
docker run -d --name a --network app-net nginx:1.27-alpine
docker exec a cat /sys/class/net/eth0/iflink
ip -o link | awk -F': ' '\$1==646 {print \$1": "\$2}'
ip -br link show master br-\$(docker network inspect -f '{{.Id}}' app-net | cut -c1-12)
ip -br addr show br-\$(docker network inspect -f '{{.Id}}' app-net | cut -c1-12)
docker exec a ip route</code></pre>
<div class="out">646
646: vethb5fcc2a@if2
vethb5fcc2a@if2  UP             4e:45:8f:57:da:65 &lt;BROADCAST,MULTICAST,UP,LOWER_UP&gt;
vethbe8c5a9@if2  UP             3e:8c:f5:a6:6a:d7 &lt;BROADCAST,MULTICAST,UP,LOWER_UP&gt;
br-46b006276067  UP             172.24.0.1/16 fe80::4c55:30ff:fe25:801f/64
default via 172.24.0.1 dev eth0
172.24.0.0/16 dev eth0 scope link  src 172.24.0.2</div>
<p>Output thật trên máy Linux của khoá (Fedora 44, Docker Engine 29.6). Cầu <code>br-46b006276067</code> có hai veth vì trên mạng đó đang có hai container (<code>a</code> và <code>b</code>). Cầu mang IP <code>172.24.0.1</code>, và dòng <code>default via 172.24.0.1</code> trong container nói rằng: mọi gói đi ra ngoài mạng con đều gửi cho cây cầu — cầu chính là gateway (cổng ra mặc định).</p>
<table>
<tr><th>Mẩu lệnh</th><th>Nghĩa là</th></tr>
<tr><td><code>ip -o -4 addr</code></td><td><code>ip</code> là công cụ mạng của Linux; <code>addr</code> liệt kê địa chỉ; <code>-o</code> (oneline) gói mỗi giao diện vào một dòng; <code>-4</code> chỉ IPv4. Trong ảnh alpine đây là <code>ip</code> của BusyBox — nó KHÔNG hiểu <code>-brief</code> (thử là in ra trang hướng dẫn sử dụng).</td></tr>
<tr><td><code>/sys/class/net/eth0/iflink</code></td><td>File ảo do nhân tạo ra: số ifindex của "đối tác" của eth0. Với veth, đó là đầu dây nằm ở namespace kia.</td></tr>
<tr><td><code>awk -F': ' '\$1==646'</code></td><td>Tách mỗi dòng theo dấu <code>: </code> và chỉ in dòng có cột 1 bằng 646. Viết <code>grep '^646:'</code> cũng được.</td></tr>
<tr><td><code>ip -br link show master &lt;cầu&gt;</code></td><td>Chỉ in những giao diện đang là "cổng" của cây cầu đó — tức các veth của từng container trên mạng.</td></tr>
<tr><td><code>br-\$(docker network inspect -f '{{.Id}}' app-net | cut -c1-12)</code></td><td>Tên cầu của một mạng tự tạo là <code>br-</code> + 12 ký tự đầu của ID mạng. Lệnh con lấy ID rồi cắt 12 ký tự.</td></tr>
</table>
<div class="callout"><strong>Trên Mac thì sao?</strong> Máy Mac không có <code>/sys</code> và không có cầu nào cả: toàn bộ mạng Docker nằm trong máy ảo Linux của Docker Desktop. Bước 1–2 chạy y nguyên. Muốn nhìn "phía máy chủ", hãy chạy một container dùng mạng của máy ảo: <code>docker run --rm --network host alpine ip -o -4 addr</code> — bạn sẽ thấy <code>docker0</code> và các cầu <code>br-…</code> của máy ảo, KHÔNG phải card Wi-Fi của Mac.</div>

<h3>Năm driver</h3>
${slide('dk-08', 5, 'Năm driver — 95% thời gian chỉ cần bridge tự tạo')}
<div class="kv-grid">
  <div class="kv"><span class="k">bridge</span><span class="v">Mặc định, và là thứ bạn cần trong 95% trường hợp. Một mạng con riêng trên máy chủ có NAT ra ngoài. Container trên cùng một bridge TỰ TẠO gọi được nhau bằng tên.</span></div>
  <div class="kv"><span class="k">host</span><span class="v">Không có namespace nào cả — container dùng chung ngăn xếp mạng của máy chủ. Không công bố cổng, không cách ly, và <code>localhost</code> bên trong chính là <code>localhost</code> của máy chủ. Nhanh, thỉnh thoảng cần thiết, hiếm khi đúng.</span></div>
  <div class="kv"><span class="k">none</span><span class="v">Chỉ có giao diện loopback. Dành cho container không được phép có mạng: một việc xử lý theo lô trên một file đã gắn sẵn, một bước dựng, bất cứ thứ gì bạn muốn chứng minh là ngoại tuyến.</span></div>
  <div class="kv"><span class="k">macvlan / ipvlan</span><span class="v">Container có MAC và IP riêng trên mạng LAN vật lý của bạn, y như một cái máy riêng. Dành cho dịch vụ đời cũ buộc phải gọi tới trực tiếp. Cần chế độ promiscuous và sự hợp tác của cái switch.</span></div>
  <div class="kv"><span class="k">overlay</span><span class="v">Trải qua nhiều máy chủ Docker, cho dịch vụ Swarm. Ngoài phạm vi của một con VPS đơn, và là thứ Kubernetes thay bằng các plugin CNI của riêng nó.</span></div>
</div>

<h3>Bridge mặc định so với bridge tự tạo</h3>
${slide('dk-08', 6, 'Bridge mặc định không trả lời tên — bridge tự tạo thì có')}
<pre><code><span class="tok-comment"># Trên bridge MẶC ĐỊNH (thứ bạn nhận khi không có cờ --network)</span>
docker run -d --name db-a  postgres:16-alpine &gt;/dev/null
docker run --rm alpine:3.20 nslookup db-a</code></pre>
<div class="out">Server:		192.168.65.7
Address:	192.168.65.7:53

Non-authoritative answer:

** server can't find db-a: NXDOMAIN</div>
<pre><code><span class="tok-comment"># Trên bridge TỰ TẠO</span>
docker network create app-net &gt;/dev/null
docker run -d --name db-b --network app-net postgres:16-alpine &gt;/dev/null
docker run --rm --network app-net alpine:3.20 nslookup db-b</code></pre>
<div class="out">Server:		127.0.0.11
Address:	127.0.0.11:53

Non-authoritative answer:

Non-authoritative answer:
Name:	db-b
Address: 172.23.0.2</div>
<div class="callout ok"><strong>Đây là sự thật hữu ích nhất trong cả chương.</strong> Trên một bridge tự tạo, Docker chạy một máy chủ DNS nhúng ở <code>127.0.0.11</code> phân giải tên container thành IP hiện tại của nó. Trên bridge mặc định thì KHÔNG — tên không bao giờ phân giải được, và bạn còn lại mấy cái IP trần đổi sau mỗi lần khởi động lại. Hãy tạo một cái mạng. Luôn luôn. Compose tự làm việc này cho bạn, và đó là lý do câu "chạy trong compose thì được, chạy <code>docker run</code> thì không" xuất hiện nhiều đến thế.</div>

<h3>Vì sao bridge mặc định không có DNS: đọc /etc/resolv.conf</h3>
<p><code>/etc/resolv.conf</code> là file mà mọi chương trình trong Linux đọc để biết "hỏi tên miền thì hỏi ai". Docker tự viết file này cho từng container, và nó viết KHÁC NHAU tuỳ mạng. So hai file là thấy ngay vì sao một bên phân giải được tên container còn bên kia thì không:</p>
<pre><code class="language-bash"><span class="tok-comment"># container trên bridge MẶC ĐỊNH</span>
docker run --rm alpine:3.20 cat /etc/resolv.conf
<span class="tok-comment"># container trên mạng TỰ TẠO</span>
docker run --rm --network app-net alpine:3.20 cat /etc/resolv.conf</code></pre>
<div class="out"># Generated by Docker Engine.
# This file can be edited; Docker Engine will not make further changes once it
# has been modified.

nameserver 192.168.65.7

# Based on host file: '/etc/resolv.conf' (legacy)
# Overrides: []
# Generated by Docker Engine.
# This file can be edited; Docker Engine will not make further changes once it
# has been modified.

nameserver 127.0.0.11
options ndots:0

# Based on host file: '/etc/resolv.conf' (internal resolver)
# ExtServers: [host(192.168.65.7)]
# Overrides: []
# Option ndots from: internal</div>
<p>Output thật trên máy Mac (Docker Desktop 4.91). Đọc từng dòng:</p>
<ul>
<li>Bridge mặc định ghi <code>nameserver 192.168.65.7</code> — chính là DNS của máy chủ (trên Mac là DNS của máy ảo), và ghi rõ chế độ <code>(legacy)</code> — kiểu cũ. DNS của máy chủ không hề biết container nào tên <code>db-a</code>, nên câu trả lời là NXDOMAIN (tên không tồn tại).</li>
<li>Mạng tự tạo ghi <code>nameserver 127.0.0.11</code> và <code>(internal resolver)</code> — bộ phân giải nội bộ. Địa chỉ đó nằm TRONG namespace của container; dockerd nghe ở đó, biết tên mọi container trên mạng, và tên nào không biết thì hỏi tiếp máy chủ ngoài — dòng <code>ExtServers: [host(192.168.65.7)]</code> ghi đúng điều đó.</li>
<li><code>options ndots:0</code>: tên nào cũng được hỏi "nguyên văn" trước, không tự ghép thêm đuôi tìm kiếm. Nhờ vậy <code>db</code> được hỏi đúng là <code>db</code>.</li>
</ul>
<div class="callout warn"><strong>Đừng sửa tay file này để "chữa" DNS.</strong> Dòng đầu nói rõ: sửa rồi thì Docker thôi cập nhật nó. Sửa đúng chỗ là cờ <code>--dns</code> / <code>--dns-search</code> khi chạy container, hoặc khoá <code>dns:</code> trong compose.</div>

<h3>Tạo, gắn, soi</h3>
${slide('dk-08', 7, 'Một container vào hai mạng = hai card mạng')}
<pre><code>docker network create --driver bridge --subnet 10.42.0.0/24 --gateway 10.42.0.1 edge
docker network ls
docker network connect edge web          <span class="tok-comment"># container đang chạy vẫn vào thêm mạng khác được</span>
docker network inspect edge -f '{{ range .Containers }}{{ .Name }} {{ .IPv4Address }}{{ end }}'</code></pre>
<div class="out">NETWORK ID     NAME      DRIVER    SCOPE
9a3f1c7e2b84   app-net   bridge    local
c1e8b3d94f27   bridge    bridge    local
7d2a5f9c1e63   edge      bridge    local
4b8e1a2f7c95   host      host      local
e6c3d7b1a482   none      null      local
web 10.42.0.2/24</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Một container nằm được trên nhiều mạng</span><span class="v">Mỗi mạng cho nó thêm một giao diện và thêm một tập tên nó phân giải được. Đây là cách bạn đặt một reverse proxy vừa lên mạng công khai vừa lên mạng backend riêng.</span></div>
  <div class="kv"><span class="k">Mạng là ranh giới cách ly</span><span class="v">Hai container ở hai bridge khác nhau thì hoàn toàn không với tới nhau được, nếu không có một tuyến đường. Đó là một biện pháp an toàn thật và nó không tốn gì.</span></div>
  <div class="kv"><span class="k"><code>--network-alias</code></span><span class="v">Một tên DNS phụ trên mạng đó. Hữu ích khi nhiều container cùng phải trả lời một cái tên (xoay vòng), hoặc khi một cái tên buộc phải khớp với cấu hình đã đóng cứng.</span></div>
  <div class="kv"><span class="k"><code>--internal</code></span><span class="v">Một bridge không có tuyến ra ngoài. Một mạng cơ sở dữ liệu về mặt vật lý không với tới Internet được là mặc định tốt cho tầng backend.</span></div>
  <div class="kv"><span class="k">Mạng con là của bạn, tự chọn</span><span class="v">Mặc định của Docker (172.17–172.31) đụng với VPN doanh nghiệp nhiều hơn bạn tưởng. Dùng <code>--subnet</code> khi tạo mạng, hoặc <code>default-address-pools</code> trong <code>/etc/docker/daemon.json</code>, là tránh được cả một buổi chiều rối trí.</span></div>
</div>

<h3>Bảng cờ: docker network create, connect, disconnect</h3>
<table>
<tr><th>Lệnh / cờ</th><th>Làm gì</th><th>Ghi chú</th></tr>
<tr><td><code>docker network create app-net</code></td><td>Tạo một bridge tự tạo, Docker tự chọn mạng con</td><td>Trên máy của khoá: 172.23.0.0/16, 172.24.0.0/16… theo thứ tự còn trống</td></tr>
<tr><td><code>--driver bridge</code> (<code>-d</code>)</td><td>Chọn driver</td><td>Mặc định đã là bridge, ghi ra cho rõ</td></tr>
<tr><td><code>--subnet 10.42.0.0/24</code></td><td>Tự chọn dải IP</td><td>/24 = 254 địa chỉ, dư cho một dự án</td></tr>
<tr><td><code>--gateway 10.42.0.1</code></td><td>IP của cây cầu</td><td>Phải nằm trong subnet</td></tr>
<tr><td><code>--internal</code></td><td>Cầu không có đường ra ngoài</td><td>Hợp cho tầng CSDL</td></tr>
<tr><td><code>--ipv6</code></td><td>Cấp thêm địa chỉ IPv6</td><td>Docker 29: container nhận CẢ IPv4 lẫn IPv6 (Bài 8.4)</td></tr>
<tr><td><code>--label k=v</code></td><td>Gắn nhãn</td><td>Để lọc: <code>docker network ls --filter label=k=v</code></td></tr>
<tr><td><code>docker network connect app-net web</code></td><td>Cắm thêm một card vào container ĐANG CHẠY</td><td>Container được thêm <code>eth1</code>, không phải khởi động lại</td></tr>
<tr><td><code>docker network disconnect app-net web</code></td><td>Rút card đó ra</td><td>Tên của web biến mất khỏi DNS mạng đó</td></tr>
<tr><td><code>docker network rm app-net</code></td><td>Xoá mạng</td><td>Báo lỗi nếu còn container đang gắn</td></tr>
</table>
<p>Một chi tiết hay bị bỏ qua trong output ở trên: sau khi <code>connect</code>, <code>ip route</code> của web vẫn chỉ có MỘT dòng <code>default</code> — qua <code>eth0</code>. Card thứ hai chỉ thêm một tuyến tới mạng con của nó. Nghĩa là: gắn thêm mạng không đổi đường ra Internet của container, chỉ mở thêm "hàng xóm".</p>

<h3>Mạng là bức tường thật: tự chứng minh</h3>
${slide('dk-08', 8, 'Khác mạng thì không thấy nhau; mạng --internal thì không ra ngoài')}
<p>Câu "hai mạng khác nhau thì không với tới nhau" rất dễ đọc lướt qua. Tự chứng minh nó chỉ mất ba lệnh, và cho bạn thấy một triệu chứng sẽ gặp lại ở Bài 8.5: gói bị chặn giữa hai mạng thì KHÔNG ai trả lời — bạn nhận <em>timeout</em>, không phải <em>refused</em>.</p>
<pre><code class="language-bash"><span class="tok-comment"># máy Mac: web nằm trên bridge mặc định, IP 172.17.0.10</span>
docker run --rm alpine:3.20 wget -qO- -T 3 http://172.17.0.10/ | head -1
<span class="tok-comment"># cùng địa chỉ đó, nhưng hỏi từ mạng app-net</span>
docker run --rm --network app-net alpine:3.20 wget -qO- -T 3 http://172.17.0.10/
<span class="tok-comment"># một mạng --internal: không có đường ra</span>
docker network create --internal private
docker run --rm --network private alpine:3.20 wget -qO- -T 3 http://example.com/
docker run --rm --network private alpine:3.20 ip route</code></pre>
<div class="out">&lt;!DOCTYPE html&gt;
wget: download timed out
wget: bad address 'example.com'
172.24.0.0/16 dev eth0 scope link  src 172.24.0.2</div>
<table>
<tr><th>Kết quả</th><th>Vì sao</th></tr>
<tr><td>Cùng bridge mặc định: tải được trang nginx bằng IP</td><td>Bridge mặc định vẫn cho các container nói chuyện với nhau (<code>enable_icc: true</code> trong <code>docker network inspect bridge</code>) — chỉ là không có TÊN.</td></tr>
<tr><td>Từ mạng khác: <code>download timed out</code></td><td>Docker cài luật chặn gói đi từ cầu này sang cầu kia. Gói bị vứt im lặng nên wget chờ hết 3 giây (<code>-T 3</code>).</td></tr>
<tr><td><code>--internal</code>: <code>bad address</code></td><td>Mạng nội bộ không có ai chuyển tiếp truy vấn DNS ra ngoài, nên tên ngoài không phân giải được, còn chưa tới bước kết nối.</td></tr>
<tr><td><code>ip route</code> chỉ còn một dòng</td><td>Không có dòng <code>default via …</code>: container không có gateway, gói ra ngoài không biết đi đâu.</td></tr>
</table>
<div class="callout ok"><strong>Khi nào dùng bridge mặc định? Gần như không bao giờ.</strong> Nó tồn tại để <code>docker run</code> trần "chạy được ngay". Mọi thứ bạn định giữ lại quá một buổi — đồ án, stack trên VPS — hãy cho vào một mạng tự tạo (compose làm hộ). Chỉ còn một chỗ dùng nó cho hợp: container chạy một lệnh rồi tự xoá (<code>--rm</code>) và không cần gọi ai bằng tên.</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bạn cùng nhóm SWP391 chạy API và Postgres bằng hai lệnh <code>docker run</code> rời nhau. API báo <code>getaddrinfo ENOTFOUND thu-db</code>, trong khi <code>docker ps</code> cho thấy <code>thu-db</code> đang chạy ngon. Bạn tái hiện lỗi, chỉ ra nguyên nhân bằng chứng cứ, rồi sửa mà KHÔNG phải tạo lại container CSDL.</p><ol>
<li>Trong <code>~/thu-docker</code>, chạy CSDL "kiểu bạn cùng nhóm": <code>docker run -d --name thu-db -e POSTGRES_PASSWORD=x -v thu-pgdata:/var/lib/postgresql/data postgres:16-alpine</code> (không có <code>--network</code>).</li>
<li>Giả làm API hỏi tên: <code>docker run --rm alpine:3.20 getent hosts thu-db; echo "exit \$?"</code> — ghi lại exit code. Đọc <code>docker run --rm alpine:3.20 cat /etc/resolv.conf</code> và chỉ ra dòng <code>nameserver</code>.</li>
<li>Tạo mạng và cắm CSDL đang chạy vào: <code>docker network create thu-net</code> rồi <code>docker network connect thu-net thu-db</code>.</li>
<li>Hỏi lại từ mạng mới: <code>docker run --rm --network thu-net alpine:3.20 getent hosts thu-db</code>. Xem <code>docker exec thu-db ip -o -4 addr</code>: CSDL giờ có mấy card?</li>
<li>Dọn: <code>docker rm -f thu-db; docker volume rm thu-pgdata; docker network rm thu-net</code>.</li></ol>
<pre><code class="language-bash">docker exec thu-db ip -o -4 addr | awk '{print \$2, \$4}'</code></pre>
<div class="out">lo 127.0.0.1/8
eth0 172.17.0.11/16
eth1 172.27.0.2/16</div>
<p><strong>Đạt khi:</strong> bước 2 in <code>exit 2</code> (getent không tìm thấy) và bạn chỉ ra được <code>nameserver</code> KHÔNG phải <code>127.0.0.11</code>; bước 4 in ra một IP cho <code>thu-db</code>; và <code>thu-db</code> có đúng hai card <code>eth0</code> + <code>eth1</code> — dù nó chưa từng khởi động lại.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Network namespace (không gian tên mạng)</span><span class="v">Bộ card mạng, bảng định tuyến và cổng riêng của một container; bên trong nó "localhost" là của riêng nó.</span></div>
  <div class="kv"><span class="k">veth pair (cặp ethernet ảo)</span><span class="v">Hai card ảo nối thẳng vào nhau như hai đầu cáp: một đầu là <code>eth0</code> trong container, đầu kia là <code>vethXXXX</code> trên máy chủ.</span></div>
  <div class="kv"><span class="k">Bridge (cầu nối)</span><span class="v">Một cái switch bằng phần mềm trên máy chủ (<code>docker0</code>, <code>br-…</code>) — mọi veth của một mạng cắm vào đó.</span></div>
  <div class="kv"><span class="k">Gateway (cổng ra mặc định)</span><span class="v">Địa chỉ mà container gửi mọi gói "đi xa" tới; với bridge, đó là IP của chính cây cầu (vd 172.17.0.1).</span></div>
  <div class="kv"><span class="k">Embedded DNS (DNS nhúng)</span><span class="v">Bộ phân giải của Docker ở <code>127.0.0.11</code>, chỉ có trên mạng tự tạo, biết tên các container trên mạng đó.</span></div>
  <div class="kv"><span class="k">Subnet (mạng con)</span><span class="v">Dải địa chỉ của một mạng, vd <code>172.24.0.0/16</code>; tự chọn bằng <code>--subnet</code> để tránh đụng VPN.</span></div>
  <div class="kv"><span class="k">NAT / MASQUERADE (dịch địa chỉ)</span><span class="v">Luật iptables đổi địa chỉ nguồn của gói đi ra thành IP máy chủ, để câu trả lời tìm được đường về.</span></div>
  <div class="kv"><span class="k">--internal network (mạng nội bộ)</span><span class="v">Mạng không có gateway ra ngoài: container trong đó chỉ nói chuyện được với nhau.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mỗi container có network namespace riêng, nối vào một cây cầu trên máy chủ bằng một cặp veth; cầu là gateway của nó.</li>
<li>Bridge mặc định (<code>docker0</code>) KHÔNG có DNS theo tên: <code>/etc/resolv.conf</code> trỏ ra DNS máy chủ, nên tên container ra NXDOMAIN.</li>
<li>Mạng tự tạo cho <code>nameserver 127.0.0.11</code>: dockerd trả lời tên container, tên lạ thì hỏi tiếp máy chủ.</li>
<li><code>docker network connect</code> cắm thêm card vào container đang chạy — không cần tạo lại container.</li>
<li>Hai mạng khác nhau không thông nhau (timeout, không phải refused); <code>--internal</code> cắt luôn đường ra Internet.</li>
<li>Luôn tạo mạng riêng (hoặc để compose tạo) và gọi nhau bằng TÊN, đừng ghi IP vào cấu hình.</li>
</ul>


<a class="link-card" href="https://docs.docker.com/engine/network/" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">Docker docs — Tổng quan mạng</span><span class="lc-sub">Đủ mọi driver, khác biệt giữa bridge mặc định với bridge tự tạo trình bày thành bảng, và hành vi DNS viết rõ ra. Trang cần đọc lại khi có thứ gì không phân giải được.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/network/drivers/bridge/" target="_blank" rel="noopener">
  <span class="lc-ico">🌉</span>
  <span class="lc-body"><span class="lc-title">Mạng bridge, đào sâu</span><span class="lc-sub"><code>docker0</code> và các cặp veth được nối ra sao, tuỳ chọn cho mạng con và gateway tuỳ chỉnh, và danh sách chính xác những gì bridge tự tạo cho bạn hơn bridge mặc định.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: dựng một mạng hai tầng</span><span class="lc-sub">Bài chấm điểm: chứng minh phân giải tên hỏng trên bridge mặc định và chạy được trên bridge tự tạo, đặt một proxy lên hai mạng, và làm một mạng backend không với tới Internet được.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> dùng địa chỉ IP của container trong cấu hình. Chúng trông có vẻ ổn định — hôm nay <code>172.17.0.2</code>, khởi động lại vẫn <code>172.17.0.2</code> — cho tới đúng lúc một container khởi động theo thứ tự khác và mọi địa chỉ dịch đi một nấc. Khi đó một file cấu hình trỏ vào nhầm dịch vụ, và vì cả hai dịch vụ đều nhận kết nối TCP, cái hỏng hiện ra thành một lỗi giao thức khó hiểu chứ không phải connection refused. Trên mạng tự tạo, tên container là một bản ghi DNS đi theo container tới bất cứ đâu; hãy dùng nó. Chỗ duy nhất IP trần còn hợp lệ là một lệnh <code>curl</code> dùng một lần lúc chẩn đoán, và ngay cả ở đó thì <code>docker inspect -f '{{ .NetworkSettings.Networks.appnet.IPAddress }}'</code> vẫn là thói quen tốt hơn đọc bằng mắt trên màn hình.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Mỗi container có network namespace riêng, nối vào một cây cầu trên máy chủ bằng một cặp veth — mô hình đó giải thích cùng lúc chuyện công bố cổng, chuyện <code>localhost</code>, và chuyện cách ly. Container trên bridge <em>tự tạo</em> phân giải được tên nhau nhờ DNS nhúng của Docker ở <code>127.0.0.11</code>; trên bridge mặc định thì không, và đó là lý do bạn luôn tạo một cái mạng. Và mạng là ranh giới cách ly thật: một mạng backend <code>--internal</code> là an toàn miễn phí.</p>
</div>
`,
    },
    /* ─────────────────────────── 8.2 ─────────────────────────── */
    {
      title: '8.2 — Publishing ports, and the firewall trap|||8.2 — Công bố cổng, và cái bẫy tường lửa',
      slug: 'dk-8-2-cong-bo-cong',
      type: 'LESSON',
      description: 'EXPOSE khác publish thế nào, -p đọc trái = máy chủ phải = container, gắn vào 127.0.0.1 thay vì 0.0.0.0, dải cổng và UDP, và vì sao UFW không chặn được cổng Docker đã công bố.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>Publishing ports, and the firewall trap</h2>
<p class="lead">A container's port is inside its own namespace; nothing outside can reach it until you say so. Publishing punches a hole from the host into the container using an iptables DNAT rule — and because it is iptables, not a userspace proxy, it bypasses the firewall rules you thought were protecting you. That last sentence has put more databases on the public internet than any other Docker behaviour.</p>

<h3>EXPOSE is documentation; -p is the actual hole</h3>
${slide('dk-08', 9, 'EXPOSE chỉ là ghi chú — -p mới khoét lỗ')}
<pre><code><span class="tok-comment"># The image says it listens on 80. That is all EXPOSE does.</span>
docker image inspect nginx:alpine -f '{{ json .Config.ExposedPorts }}'
docker run -d --name doc nginx:alpine &gt;/dev/null
curl -s -o /dev/null -w '%{http_code}\\n' --max-time 2 http://localhost/ || echo "no route"</code></pre>
<div class="out">{"80/tcp":{}}
000
no route</div>
<pre><code><span class="tok-comment"># -p is what actually creates the mapping</span>
docker run -d --name pub -p 8080:80 nginx:alpine &gt;/dev/null
curl -s -o /dev/null -w '%{http_code}\\n' http://localhost:8080/
docker port pub</code></pre>
<div class="out">200
80/tcp -&gt; 0.0.0.0:8080
80/tcp -&gt; [::]:8080</div>
<div class="callout"><strong>Read <code>-p</code> as <code>HOST:CONTAINER</code> — the left number is the host, the right number is the container.</strong> The right-hand number is the port the application listens on inside the container and never changes; the left is where you want it to appear on the host. Getting it backwards produces a container that starts fine and answers nothing, because you published a port nothing is listening on.</div>

<h3>The four forms of -p</h3>
${slide('dk-08', 10, '-p đọc trái = máy chủ, phải = container')}
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-p 8080:80</code></span><span class="v">Host port 8080 on <strong>all interfaces</strong> → container port 80. This is the one that reaches the public internet on a VPS.</span></div>
  <div class="kv"><span class="k"><code>-p 127.0.0.1:8080:80</code></span><span class="v">Host port 8080 <strong>on loopback only</strong>. Reachable from the host and from an SSH tunnel; not from outside. The right default for anything behind a reverse proxy.</span></div>
  <div class="kv"><span class="k"><code>-p 80</code></span><span class="v">Container port 80 → a random free high port on the host. <code>docker port</code> tells you which. Handy for tests, unusable for anything you must reach by a fixed address.</span></div>
  <div class="kv"><span class="k"><code>-p 5000-5010:5000-5010/udp</code></span><span class="v">A whole range, and a protocol other than TCP. Each port in the range gets its own rule — publishing a thousand ports really does create a thousand rules and it really is slow.</span></div>
</div>
<pre><code><span class="tok-comment"># Bind to loopback and prove it from the outside</span>
docker run -d --name safe -p 127.0.0.1:5433:5432 postgres:16-alpine &gt;/dev/null
sudo ss -lntp 'sport = :5433' | tail -1
curl -s --max-time 2 -o /dev/null -w '%{http_code}\\n' http://&lt;host-public-ip&gt;:5433/ || echo refused</code></pre>
<div class="out">LISTEN 0  4096  127.0.0.1:5433  0.0.0.0:*  users:(("docker-proxy",pid=4471,fd=4))
refused</div>

<h3>Run it step by step: one nginx, three ways to publish</h3>
<p>The four forms of <code>-p</code> blur together on paper. Run them side by side and knock from TWO sides — from the host itself and from the machine's LAN address — and you see exactly who each form lets in. Everything below ran on the course's Linux machine (LAN IP <code>192.168.1.102</code>):</p>
<pre><code class="language-bash">docker run -d --name pub  -p 18080:80           nginx:1.27-alpine
docker run -d --name lo   -p 127.0.0.1:18081:80 nginx:1.27-alpine
docker run -d --name rand -p 80                 nginx:1.27-alpine
docker port pub; docker port lo; docker port rand
IP=\$(hostname -I | awk '{print \$1}')          <span class="tok-comment"># the machine's LAN IP (Mac: ipconfig getifaddr en0)</span>
curl -s -o /dev/null -w '%{http_code}\\n' --max-time 3 http://\$IP:18080/
curl -s -o /dev/null -w '%{http_code}\\n' --max-time 3 http://\$IP:18081/
curl -s -o /dev/null -w '%{http_code}\\n' --max-time 3 http://127.0.0.1:18081/</code></pre>
<div class="out">80/tcp -&gt; 0.0.0.0:18080
80/tcp -&gt; [::]:18080
80/tcp -&gt; 127.0.0.1:18081
80/tcp -&gt; 0.0.0.0:32768
80/tcp -&gt; [::]:32768
200
000
200</div>
<table>
<tr><th>Piece</th><th>Meaning</th></tr>
<tr><td><code>-p 18080:80</code></td><td>Left is the port on the HOST, right is the port the app listens on INSIDE the container. No IP ⇒ Docker opens it on <code>0.0.0.0</code> (every IPv4 NIC) and <code>[::]</code> (every IPv6 NIC).</td></tr>
<tr><td><code>-p 127.0.0.1:18081:80</code></td><td>The first part is the host IP to bind. <code>127.0.0.1</code> = loopback only: via the LAN IP you get <code>000</code> (no connection), via <code>127.0.0.1</code> you get <code>200</code>.</td></tr>
<tr><td><code>-p 80</code></td><td>Container port only ⇒ Docker picks a free high port (here <code>32768</code>). Read it back with <code>docker port</code>.</td></tr>
<tr><td><code>/udp</code></td><td>TCP is the default; DNS, games and WebRTC need <code>/udp</code>.</td></tr>
<tr><td><code>-P</code> (capital)</td><td>Publishes EVERY port the image <code>EXPOSE</code>s to random host ports — the one place <code>EXPOSE</code> actually does something.</td></tr>
</table>
<p>What if you write it backwards? <code>-p 18084:8080</code> on nginx (which listens on 80, not 8080) gives a perfectly healthy "Up" container that answers nothing. From the host itself curl says <code>curl: (56) Recv failure: Connection reset by peer</code> — it reached <code>docker-proxy</code>, which then hung up because nothing inside listens on 8080; from another machine it says <code>Couldn't connect to server</code>. Two different messages for the same typo, so when a container "runs but does not answer", reread <code>docker port</code> first.</p>

<h3>The firewall trap</h3>
${slide('dk-08', 11, 'Gói tới cổng -p rẽ sang FORWARD — luật mở/đóng cổng ở INPUT không được hỏi')}
<pre><code><span class="tok-comment"># UFW says the port is closed…</span>
sudo ufw status | head -5</code></pre>
<div class="out">Status: active
To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
80,443/tcp                 ALLOW       Anywhere</div>
<pre><code><span class="tok-comment"># …and yet 5432 answers from another machine entirely</span>
docker run -d --name db -p 5432:5432 -e POSTGRES_PASSWORD=x postgres:16-alpine &gt;/dev/null
<span class="tok-comment"># from your laptop, not the server:</span>
nc -zv &lt;server-ip&gt; 5432</code></pre>
<div class="out">Connection to &lt;server-ip&gt; 5432 port [tcp/postgresql] succeeded!</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Why UFW loses</span><span class="lz-t">Docker writes DNAT rules in the nat table's PREROUTING chain</span><span class="lz-d">Those run <em>before</em> the filter table where UFW's rules live, and Docker's own FORWARD chain accepts the already-translated packet. UFW is not consulted at any point.</span></div>
  <div class="lz-step"><span class="lz-k">Fix 1 · publish to loopback</span><span class="lz-t">-p 127.0.0.1:5432:5432</span><span class="lz-d">The simplest and most reliable answer. Nothing outside can reach it because there is no rule that would send it there. Use an SSH tunnel when you need access from your laptop.</span></div>
  <div class="lz-step"><span class="lz-k">Fix 2 · do not publish at all</span><span class="lz-t">put the database on an internal network</span><span class="lz-d">Your API reaches it by container name over the bridge; the host does not need a port at all. This is what a compose stack should look like — see Chapter 10.</span></div>
  <div class="lz-step"><span class="lz-k">Fix 3 · ufw-docker, if you must publish</span><span class="lz-t">rules in DOCKER-USER, not in ufw's chains</span><span class="lz-d"><code>DOCKER-USER</code> is the one chain Docker guarantees it will not overwrite. The <code>ufw-docker</code> script automates writing rules there; do not hand-edit Docker's own chains, they are rewritten on restart.</span></div>
</div>
<pre><code><span class="tok-comment"># The one chain that is yours: DOCKER-USER, consulted before Docker's rules</span>
sudo iptables -I DOCKER-USER -p tcp --dport 5432 ! -s 10.0.0.0/8 -j DROP
sudo iptables -L DOCKER-USER -n --line-numbers | head -4</code></pre>
<div class="out">Chain DOCKER-USER (1 references)
num  target  prot opt source        destination
1    DROP    tcp  --  !10.0.0.0/8   0.0.0.0/0   tcp dpt:5432
2    RETURN  all  --  0.0.0.0/0     0.0.0.0/0</div>
<div class="callout warn"><strong>Check this on your own server right now.</strong> <code>sudo ss -lntp | grep docker-proxy</code> lists every port Docker has published and on which interface (without <code>sudo</code>, <code>ss</code> hides other users' process names and the grep finds nothing — <code>docker ps --format '{{.Names}}\\t{{.Ports}}'</code> works without it). Anything showing <code>0.0.0.0:</code> for a database, a cache, an admin UI or a metrics endpoint is reachable from the internet, whatever your firewall says. This is a two-second check and it is the highest-value thing in this chapter.</div>

<h3>Run it step by step: read the real DNAT rules — READ only, change nothing</h3>
${slide('dk-08', 12, 'Mỗi -p là một dòng DNAT, đếm được từng kết nối')}
<p>"Docker writes DNAT rules that run before the firewall" is easy to say and hard to believe until you see it. On Linux you can read those very rules. The course machine has no <code>sudo</code>, so we use Chapter 1's trick: a throwaway container that shares the host's network and has network-admin rights, install <code>iptables</code> inside it, and READ:</p>
<pre><code class="language-bash">docker run --rm --network host --privileged alpine sh -c '
  apk add -q iptables nftables
  iptables -t nat -S DOCKER | grep -E "1808[01]"<span class="tok-comment"># the rewrite-destination rules</span>
  iptables -t nat -S PREROUTING               <span class="tok-comment"># who jumps to DOCKER</span>
  iptables -t raw -S PREROUTING | grep -E "1808[01]"<span class="tok-comment"># the 127.0.0.1 guard</span>
  iptables -t nat -L DOCKER -nv | grep -E "pkts|dpt:1808[01]"'</code></pre>
<div class="out">-A DOCKER ! -i docker0 -p tcp -m tcp --dport 18080 -j DNAT --to-destination 172.17.0.5:80
-A DOCKER -d 127.0.0.1/32 ! -i docker0 -p tcp -m tcp --dport 18081 -j DNAT --to-destination 172.17.0.6:80
-P PREROUTING ACCEPT
-A PREROUTING -m addrtype --dst-type LOCAL -j DOCKER
-A PREROUTING -d 127.0.0.1/32 ! -i lo -p tcp -m tcp --dport 18081 -j DROP
 pkts bytes target     prot opt in     out     source               destination
    4   256 DNAT       tcp  --  !docker0 *       0.0.0.0/0            0.0.0.0/0            tcp dpt:18080 to:172.17.0.5:80
    0     0 DNAT       tcp  --  !docker0 *       0.0.0.0/0            127.0.0.1            tcp dpt:18081 to:172.17.0.6:80</div>
<p>Real output on the Linux machine (Docker 29.6, firewalld active; <code>docker info</code> reports <code>Firewall Backend: iptables+firewalld</code>). Before this read, I had run <code>curl http://192.168.1.102:18080/</code> once from the Mac on the same network (counter = 1), then three more times — the counter became <code>4</code>: every NEW connection from another machine goes through exactly that DNAT line. The <code>18081</code> line (bound to <code>127.0.0.1</code>) stays at <code>0</code> because it only matches packets addressed to <code>127.0.0.1</code>.</p>
<table>
<tr><th>Piece</th><th>Meaning</th></tr>
<tr><td><code>--network host</code></td><td>The helper SHARES the host's network namespace ⇒ it sees the host's own rule tables (Lesson 8.4).</td></tr>
<tr><td><code>--privileged</code></td><td>Grants network-admin capabilities (CAP_NET_ADMIN…) so netfilter can be read. Powerful: only for your own throwaway container.</td></tr>
<tr><td><code>apk add -q iptables nftables</code></td><td>Installs the tools into the helper — nothing is installed on the host.</td></tr>
<tr><td><code>-t nat</code> / <code>-t raw</code></td><td>Pick the table: <code>nat</code> rewrites addresses, <code>raw</code> runs earliest, before connection tracking.</td></tr>
<tr><td><code>-S DOCKER</code></td><td>Print the <code>DOCKER</code> chain as the commands that created it. <code>-L … -nv</code> prints a table with packet/byte counters.</td></tr>
<tr><td><code>--dst-type LOCAL</code></td><td>"A packet addressed to ANY IP of this machine" — which is why a <code>0.0.0.0</code> port is open on EVERY NIC.</td></tr>
</table>
<div class="callout danger"><strong>Only <code>-S</code> and <code>-L</code> (read).</strong> <code>-I</code>, <code>-A</code>, <code>-D</code>, <code>-F</code> CHANGE rules — on a real machine one wrong rule can cut every container off or lock you out of SSH. And never hand-edit the <code>DOCKER</code> chain: Docker rewrites it on every start. On a Mac these rules live inside Docker Desktop's VM.</div>
<p>And the machine's firewall? On Fedora it is firewalld; its chain for packets addressed TO the machine (<code>filter_INPUT</code>) starts like this — read with the same helper, <code>nft list chain inet firewalld filter_INPUT</code>:</p>
<div class="out">table inet firewalld {
	chain filter_INPUT {
		type filter hook input priority filter + 10; policy accept;
		ct state { established, related } accept
		ct status dnat accept
		iifname "lo" accept
		ct state invalid drop
		jump filter_INPUT_POLICIES
		reject with icmpx admin-prohibited
	}
}</div>
<p>The second line of the body is the whole story: <code>ct status dnat accept</code> — any packet whose destination HAS been rewritten (DNAT) is accepted before zones and ports are even looked at. <code>filter_FORWARD</code> carries the same line. And a packet for a published port has its destination rewritten in <code>PREROUTING</code> to the container's IP, so it takes the FORWARD path (through the machine), not INPUT. UFW's or firewalld's "only port 22 is open" lives in INPUT ⇒ it is never asked. The course machine's <code>FedoraWorkstation</code> zone already allows 1025–65535, so I could not stage "firewall closed, port still open" with a port in the course's range without CHANGING the firewall — which the course's safety rules forbid. The rules above are the evidence for the mechanism; the "another machine gets in" part is in the next section.</p>

<h3>A real incident: one ports line opens Postgres to the whole network</h3>
${slide('dk-08', 13, 'Sự cố thật: ports "5432:5432" = Postgres mở cho cả mạng')}
<p>A very common story in student projects: to run migrations from a laptop, the compose file on the VPS gains <code>ports: - "5432:5432"</code> for Postgres, with a password typed in a hurry at setup time. "Just for now" — but the line lives in the file, so every <code>compose up</code> opens it again. Internet scanners sweep port 5432 constantly; one weak password is enough to lose the data. We reproduce exactly that, scaled down to a home network: the Linux machine runs two Postgres containers — one published "just for now", one bound to <code>127.0.0.1</code> — and the Mac on the same Wi-Fi plays the stranger.</p>
<pre><code class="language-yaml"><span class="tok-comment"># compose.yaml on the Linux machine</span>
name: dk08-pg
services:
  db-mo:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: matkhau-yeu
    ports:
      - "18082:5432"              <span class="tok-comment"># every NIC ⇒ any machine can reach it</span>
  db-lo:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: matkhau-yeu
    ports:
      - "127.0.0.1:18083:5432"    <span class="tok-comment"># the host itself only</span></code></pre>
<pre><code class="language-bash"><span class="tok-comment"># typed on the MAC (192.168.1.101), aimed at the Linux machine (192.168.1.102)</span>
nc -zv -G 3 192.168.1.102 18082
docker run --rm -e PGPASSWORD=matkhau-yeu postgres:16-alpine \\
  psql -h 192.168.1.102 -p 18082 -U postgres -Atc 'select current_user, inet_server_addr(), version()'
nc -zv -G 3 192.168.1.102 18083</code></pre>
<div class="out">Connection to 192.168.1.102 port 18082 [tcp/*] succeeded!
postgres|172.23.0.2|PostgreSQL 16.15 on x86_64-pc-linux-musl, compiled by gcc (Alpine 15.2.0) 15.2.0, 64-bit
nc: connectx to 192.168.1.102 port 18083 (tcp) failed: Connection refused</div>
<p>ANOTHER machine just logged in as <code>postgres</code> — the superuser — knowing only an IP, a port and a weak password. Note that <code>inet_server_addr()</code> returns <code>172.23.0.2</code>: Postgres sees the connection arriving at its container IP, because DNAT had already rewritten the destination. The <code>127.0.0.1</code> version refuses immediately (<code>Connection refused</code>).</p>
${slide('dk-08', 14, 'Ba cách vá, xếp từ an toàn nhất — và một phép rà 2 giây')}
<p>Three fixes, safest first:</p>
<pre><code class="language-yaml">services:
  db:
    image: postgres:16-alpine
    <span class="tok-comment"># Fix 1 (best): NO ports key at all. The API on the same network calls db:5432.</span>
    <span class="tok-comment"># Fix 2: you need psql from a laptop ⇒ loopback only + an SSH tunnel when needed:</span>
    <span class="tok-comment">#   ports: ["127.0.0.1:5432:5432"]</span>
    <span class="tok-comment">#   laptop$ ssh -L 5432:localhost:5432 deploy@vps   (close the terminal, close the door)</span>
    <span class="tok-comment"># Fix 3: it truly must be public ⇒ filter sources in DOCKER-USER (ufw-docker automates it)</span></code></pre>
<p>A two-second audit on your own server, NO sudo needed: <code>docker ps --format '{{.Names}}\\t{{.Ports}}'</code>. Any line showing <code>0.0.0.0:</code> or <code>[::]:</code> in front of a database, Redis, an admin UI or a metrics port is open to every machine that can reach that NIC — whatever UFW or firewalld says.</p>

<h3>What about a Mac?</h3>
<p>Docker Desktop has no iptables on macOS; instead its <code>com.docker.backend</code> process opens the port on the Mac itself and forwards it into the VM. Same consequence: <code>-p 18087:80</code> is open to the whole Wi-Fi.</p>
<pre><code class="language-bash"><span class="tok-comment"># on the Mac</span>
docker run -d --name macpub -p 18087:80 nginx:1.27-alpine
docker run -d --name maclo  -p 127.0.0.1:18088:80 nginx:1.27-alpine
lsof -nP -iTCP:18087 -sTCP:LISTEN
<span class="tok-comment"># from the Linux machine on the same Wi-Fi, aimed at the Mac</span>
curl -s -o /dev/null -w "%{http_code}\\n" --max-time 3 http://192.168.1.101:18087/
curl -s -o /dev/null -w "%{http_code}\\n" --max-time 3 http://192.168.1.101:18088/</code></pre>
<div class="out">COMMAND     PID  USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
com.docke 15848 admin  191u  IPv6 0x1b401f6a5377baf9      0t0  TCP *:18087 (LISTEN)
200
000</div>
<p>So in a lab, on dorm Wi-Fi or in a café, a <code>-p 5432:5432</code> Postgres on your laptop is open to everyone on that network too. The safe default for a personal machine is also <code>127.0.0.1:</code>.</p>

<h3>docker-proxy, and why you sometimes see it</h3>
<p>For most published ports Docker installs an iptables DNAT rule and traffic never touches userspace. But it also starts a small helper process, <code>docker-proxy</code>, which listens on the host port — it exists to handle the cases iptables cannot, notably connections from the host to its own published port on loopback. You will meet it in three ways: as the process holding a port in <code>ss -lntp</code>, as an unexpected entry in a process list, and as the thing that fails with <code>address already in use</code> when a host service already owns that port.</p>
<pre><code>docker run -d -p 8080:80 nginx:alpine</code></pre>
<div class="out">docker: Error response from daemon: driver failed programming external connectivity on endpoint
inspiring_swartz: failed to bind host port for 0.0.0.0:8080:172.17.0.3:80/tcp: address already in use</div>
<p>That message means a process on the host already listens on 8080 — typically a dev server you forgot. (A container holding the port produces a different message, and a stopped container holds nothing — see below.) <code>ss -lntp 'sport = :8080'</code> names the culprit in one line.</p>

<h3>Two different "port busy" errors — and the Up-but-no-network trap</h3>
${slide('dk-08', 15, 'docker-proxy và hai lỗi “cổng bận” khác nhau')}
<p>The error above is Docker 27's wording. Docker 29 phrases it slightly differently, and more importantly there are TWO different messages depending on WHO holds the port. Real runs on the Linux machine:</p>
<pre><code class="language-bash"><span class="tok-comment"># ① another CONTAINER already holds 18080</span>
docker run -d --name trung -p 18080:80 nginx:1.27-alpine
<span class="tok-comment"># ② a HOST process (python) already holds 18087</span>
python3 -m http.server --bind 0.0.0.0 18087 &amp;
docker run -d --name dung -p 18087:80 nginx:1.27-alpine
ss -lntp 'sport = :18087'</code></pre>
<div class="out">docker: Error response from daemon: failed to set up container networking: driver failed programming external connectivity on endpoint trung (f68b656f…): Bind for 0.0.0.0:18080 failed: port is already allocated
docker: Error response from daemon: failed to set up container networking: driver failed programming external connectivity on endpoint dung (b94f48dc…): failed to bind host port 0.0.0.0:18087/tcp: address already in use
State  Recv-Q Send-Q Local Address:Port  Peer Address:PortProcess
LISTEN 0      5            0.0.0.0:18087      0.0.0.0:*    users:(("python3",pid=498970,fd=3))</div>
<table>
<tr><th>Message</th><th>Who holds the port</th><th>Find the culprit</th></tr>
<tr><td><code>port is already allocated</code></td><td>Another container (Docker knows without asking the kernel)</td><td><code>docker ps --filter publish=18080</code></td></tr>
<tr><td><code>address already in use</code></td><td>A process outside Docker: a dev server, a natively installed Postgres…</td><td><code>ss -lntp 'sport = :18087'</code> (add <code>sudo</code> if another user owns the process)</td></tr>
</table>
<p>One misconception in the paragraph above needs correcting: a STOPPED container does not hold its port. I checked: after <code>docker stop pub</code>, <code>ss</code> shows nothing on 18080 and a new container takes the port immediately. The "old container" only causes an error when you <code>docker start</code> it again while the port has a new owner.</p>
<div class="pitfall co-tieu-de"><strong>Pitfall: after a port error, starting again gives an "Up" container with no network.</strong> A container that failed on its port does not vanish: it stays in the <code>Created</code> state. I tried this on both Engine 29.6 (Linux) and 29.8 (Mac): free the port, <code>docker start</code> that same container, and it comes up <code>Up</code> — but <code>docker inspect -f '{{json .NetworkSettings.Networks}}'</code> prints <code>{}</code>, the PORTS column shows only <code>80/tcp</code> (the <code>-&gt;</code> part is gone), and inside there is only <code>lo</code>. <code>docker restart</code> does not fix it. The reliable fix: <code>docker rm -f</code> and create it again (with compose: <code>docker compose up -d --force-recreate</code>).</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> the group project's compose file has <code>ports: - "5432:5432"</code> for Postgres "to run migrations from a laptop". The supervisor asks you to close it to every other machine while the server itself can still connect. Prove both the before and after state with commands.</p><ol>
<li>In <code>~/thu-docker/thu-pg</code>, write <code>compose.yaml</code>: <code>name: thu-pg</code>, one service <code>db</code> using <code>postgres:16-alpine</code>, <code>POSTGRES_PASSWORD: x</code>, <code>ports: ["15432:5432"]</code>. Run <code>docker compose up -d</code>.</li>
<li>Audit: <code>docker ps --format '{{.Names}}\\t{{.Ports}}'</code> — copy the line for <code>thu-pg-db-1</code>.</li>
<li>Play "another machine" by knocking on your own LAN IP: Mac <code>nc -zv \$(ipconfig getifaddr en0) 15432</code>; Linux <code>nc -zv \$(hostname -I | awk '{print \$1}') 15432</code>.</li>
<li>Change it to <code>ports: ["127.0.0.1:15432:5432"]</code> and run <code>docker compose up -d</code> again (compose recreates the container). Repeat steps 2 and 3, then try <code>nc -zv 127.0.0.1 15432</code>.</li>
<li>Clean up: <code>docker compose down -v</code> (also removes Postgres's anonymous volume).</li></ol>
<p><strong>Done when:</strong> before the fix, step 2 shows <code>0.0.0.0:15432-&gt;5432/tcp</code> and step 3 says <code>succeeded</code>; after the fix, step 2 shows <code>127.0.0.1:15432-&gt;5432/tcp</code>, the LAN IP gives <code>Connection refused</code>, and <code>127.0.0.1</code> still <code>succeeded</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Publish</span><span class="v">Open a port on the host and forward it into a container's port — the job of <code>-p</code> / <code>ports:</code>.</span></div>
  <div class="kv"><span class="k">EXPOSE</span><span class="v">A note in the Dockerfile saying which port the app listens on; on its own it opens nothing.</span></div>
  <div class="kv"><span class="k">DNAT (destination NAT)</span><span class="v">A rule that rewrites a packet's destination from "host IP:18080" to "container IP:80" the moment it arrives.</span></div>
  <div class="kv"><span class="k">iptables / nftables</span><span class="v">Tools that manage netfilter — the part of the Linux kernel that decides where packets go, what gets rewritten and what gets dropped.</span></div>
  <div class="kv"><span class="k">Chain</span><span class="v">A list of rules run at one point: PREROUTING (just arrived), INPUT (addressed to this machine), FORWARD (passing through).</span></div>
  <div class="kv"><span class="k">DOCKER-USER</span><span class="v">The empty chain Docker reserves for you; it runs before Docker's rules in FORWARD and is never overwritten.</span></div>
  <div class="kv"><span class="k">docker-proxy</span><span class="v">A small process Docker runs per published port (two: IPv4 + IPv6) to hold the port and handle cases iptables cannot.</span></div>
  <div class="kv"><span class="k">SSH tunnel</span><span class="v"><code>ssh -L 5432:localhost:5432 vps</code>: borrow an SSH connection to reach a port that is open only on the VPS's loopback.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>EXPOSE</code> is only a note; <code>-p</code> makes the hole and reads <code>[IP:]HOST_PORT:CONTAINER_PORT</code>.</li>
<li>No IP ⇒ <code>0.0.0.0</code> and <code>[::]</code>: every machine that can reach the NIC gets in.</li>
<li>A packet for a published port is DNATed in PREROUTING and then takes FORWARD — UFW's/firewalld's port rules in INPUT are never asked.</li>
<li>Safe default: publish nothing for a database; if needed, <code>127.0.0.1:</code> + an SSH tunnel; if it must be public, filter in <code>DOCKER-USER</code>.</li>
<li>Audit with <code>docker ps --format '{{.Names}}\\t{{.Ports}}'</code>; <code>ss -lntp</code> only names <code>docker-proxy</code> under <code>sudo</code>.</li>
<li><code>port is already allocated</code> = another container holds it; <code>address already in use</code> = a host process does; after a port error, <code>rm -f</code> and recreate the container.</li>
</ul>


<a class="link-card" href="https://docs.docker.com/engine/network/packet-filtering-firewalls/" target="_blank" rel="noopener">
  <span class="lc-ico">🔥</span>
  <span class="lc-body"><span class="lc-title">Docker docs — Packet filtering and firewalls</span><span class="lc-sub">The official explanation of why Docker's rules bypass UFW and firewalld, what <code>DOCKER-USER</code> is for, and the exact chain order. Essential reading before exposing anything on a public server.</span></span>
</a>
<a class="link-card" href="https://github.com/chaifeng/ufw-docker" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">ufw-docker</span><span class="lc-sub">A small script that makes UFW and Docker cooperate by writing rules into <code>DOCKER-USER</code>. The README explains the problem better than most articles, and the fix survives daemon restarts.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: publish safely</span><span class="lc-sub">Graded exercises: predict what <code>-p 80:8080</code> does versus <code>-p 8080:80</code>, bind a database to loopback and prove it is unreachable externally, and audit a running host for ports published on <code>0.0.0.0</code>.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> publishing a database port "just for now, to run a migration from my laptop". The rule outlives the reason: it is written in the container's configuration, so it comes back on every restart, every redeploy, forever, and no firewall rule you add later will close it. Internet-wide scanners find an open 5432, 6379 or 27017 within hours, and default or weak credentials do the rest — this is the single most common way a small production database is compromised. Use an SSH tunnel instead: <code>ssh -L 5432:localhost:5432 deploy@server</code> gives you the same access for the duration of the session and leaves nothing behind. If you have ever done this, go and run <code>sudo ss -lntp | grep docker-proxy</code> on your server before reading the next lesson.</div>
<p class="note-ct"><strong>Three things to remember.</strong> <code>EXPOSE</code> documents, <code>-p</code> creates the hole, and <code>-p</code> reads host-then-container. Publishing writes an iptables DNAT rule that runs before UFW's filter rules, so <strong>a published port is open regardless of what your firewall says</strong> — bind to <code>127.0.0.1</code>, or do not publish at all and use the container network. And <code>DOCKER-USER</code> is the only chain Docker will not overwrite, so it is where any custom rule belongs.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>Công bố cổng, và cái bẫy tường lửa</h2>
<p class="lead">Cổng của một container nằm trong namespace riêng của nó; không thứ gì bên ngoài với tới được cho tới khi bạn cho phép. Công bố cổng khoét một cái lỗ từ máy chủ vào container bằng một luật DNAT của iptables — và vì nó là iptables chứ không phải một proxy ở tầng người dùng, nó ĐI VÒNG qua đúng những luật tường lửa mà bạn tưởng đang bảo vệ mình. Riêng câu cuối đó đã đẩy nhiều cơ sở dữ liệu ra Internet công cộng hơn bất kỳ hành vi nào khác của Docker.</p>

<h3>EXPOSE là tài liệu; -p mới là cái lỗ thật</h3>
${slide('dk-08', 9, 'EXPOSE chỉ là ghi chú — -p mới khoét lỗ')}
<pre><code><span class="tok-comment"># Cái ảnh nói rằng nó nghe ở cổng 80. EXPOSE chỉ làm có thế.</span>
docker image inspect nginx:alpine -f '{{ json .Config.ExposedPorts }}'
docker run -d --name doc nginx:alpine &gt;/dev/null
curl -s -o /dev/null -w '%{http_code}\\n' --max-time 2 http://localhost/ || echo "no route"</code></pre>
<div class="out">{"80/tcp":{}}
000
no route</div>
<pre><code><span class="tok-comment"># -p mới là thứ thật sự tạo ra ánh xạ</span>
docker run -d --name pub -p 8080:80 nginx:alpine &gt;/dev/null
curl -s -o /dev/null -w '%{http_code}\\n' http://localhost:8080/
docker port pub</code></pre>
<div class="out">200
80/tcp -&gt; 0.0.0.0:8080
80/tcp -&gt; [::]:8080</div>
<div class="callout"><strong>Đọc <code>-p</code> theo thứ tự <code>MÁYCHỦ:CONTAINER</code> — số bên trái là máy chủ, số bên phải là container.</strong> Con số bên phải là cổng ứng dụng nghe BÊN TRONG container và không bao giờ đổi; bên trái là chỗ bạn muốn nó hiện ra trên máy chủ. Viết ngược lại thì bạn có một container khởi động ngon lành và không trả lời gì cả, vì bạn vừa công bố một cổng không có ai nghe.</div>

<h3>Bốn dạng của -p</h3>
${slide('dk-08', 10, '-p đọc trái = máy chủ, phải = container')}
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-p 8080:80</code></span><span class="v">Cổng 8080 trên máy chủ ở <strong>mọi giao diện</strong> → cổng 80 trong container. Đây chính là dạng chạm tới Internet công cộng trên một con VPS.</span></div>
  <div class="kv"><span class="k"><code>-p 127.0.0.1:8080:80</code></span><span class="v">Cổng 8080 trên máy chủ <strong>chỉ ở loopback</strong>. Với tới được từ chính máy chủ và từ một đường hầm SSH; không với tới được từ bên ngoài. Mặc định đúng cho mọi thứ nằm sau một reverse proxy.</span></div>
  <div class="kv"><span class="k"><code>-p 80</code></span><span class="v">Cổng 80 trong container → một cổng cao còn trống ngẫu nhiên trên máy chủ. <code>docker port</code> cho biết là cổng nào. Tiện để thử, vô dụng với thứ phải gọi tới bằng địa chỉ cố định.</span></div>
  <div class="kv"><span class="k"><code>-p 5000-5010:5000-5010/udp</code></span><span class="v">Cả một dải, và một giao thức khác TCP. Mỗi cổng trong dải nhận một luật riêng — công bố một nghìn cổng thì đúng là tạo ra một nghìn luật và đúng là chậm.</span></div>
</div>
<pre><code><span class="tok-comment"># Gắn vào loopback rồi chứng minh từ bên ngoài</span>
docker run -d --name safe -p 127.0.0.1:5433:5432 postgres:16-alpine &gt;/dev/null
sudo ss -lntp 'sport = :5433' | tail -1
curl -s --max-time 2 -o /dev/null -w '%{http_code}\\n' http://&lt;ip-công-khai&gt;:5433/ || echo refused</code></pre>
<div class="out">LISTEN 0  4096  127.0.0.1:5433  0.0.0.0:*  users:(("docker-proxy",pid=4471,fd=4))
refused</div>

<h3>Chạy thử từng bước: cùng một nginx, ba cách công bố</h3>
<p>Đọc về bốn dạng <code>-p</code> thì dễ lẫn. Chạy chúng cạnh nhau rồi thử gõ vào từ HAI phía — từ chính máy chủ và từ địa chỉ LAN của máy — là thấy rõ mỗi dạng mở cửa cho ai. Mọi lệnh dưới đây chạy thật trên máy Linux của khoá (IP LAN <code>192.168.1.102</code>):</p>
<pre><code class="language-bash">docker run -d --name pub  -p 18080:80           nginx:1.27-alpine
docker run -d --name lo   -p 127.0.0.1:18081:80 nginx:1.27-alpine
docker run -d --name rand -p 80                 nginx:1.27-alpine
docker port pub; docker port lo; docker port rand
IP=\$(hostname -I | awk '{print \$1}')          <span class="tok-comment"># IP LAN của máy (Mac: ipconfig getifaddr en0)</span>
curl -s -o /dev/null -w '%{http_code}\\n' --max-time 3 http://\$IP:18080/
curl -s -o /dev/null -w '%{http_code}\\n' --max-time 3 http://\$IP:18081/
curl -s -o /dev/null -w '%{http_code}\\n' --max-time 3 http://127.0.0.1:18081/</code></pre>
<div class="out">80/tcp -&gt; 0.0.0.0:18080
80/tcp -&gt; [::]:18080
80/tcp -&gt; 127.0.0.1:18081
80/tcp -&gt; 0.0.0.0:32768
80/tcp -&gt; [::]:32768
200
000
200</div>
<table>
<tr><th>Mẩu</th><th>Nghĩa là</th></tr>
<tr><td><code>-p 18080:80</code></td><td>Trái là cổng trên MÁY CHỦ, phải là cổng ứng dụng nghe TRONG container. Không ghi IP ⇒ Docker mở trên <code>0.0.0.0</code> (mọi card IPv4) và <code>[::]</code> (mọi card IPv6).</td></tr>
<tr><td><code>-p 127.0.0.1:18081:80</code></td><td>Phần đầu là IP máy chủ để gắn vào. <code>127.0.0.1</code> = chỉ loopback: gõ qua IP LAN ra <code>000</code> (không kết nối được), gõ <code>127.0.0.1</code> thì <code>200</code>.</td></tr>
<tr><td><code>-p 80</code></td><td>Chỉ ghi cổng container ⇒ Docker chọn một cổng cao còn trống (ở đây <code>32768</code>). Đọc lại bằng <code>docker port</code>.</td></tr>
<tr><td><code>/udp</code></td><td>Mặc định là TCP; DNS, game, WebRTC cần ghi <code>/udp</code>.</td></tr>
<tr><td><code>-P</code> (chữ hoa)</td><td>Công bố MỌI cổng mà ảnh đã <code>EXPOSE</code> ra các cổng ngẫu nhiên — đây là chỗ duy nhất <code>EXPOSE</code> có tác dụng thật.</td></tr>
</table>
<p>Viết ngược thì sao? <code>-p 18084:8080</code> với nginx (nghe 80, không phải 8080) cho một container "Up" hoàn toàn khoẻ mạnh mà không trả lời gì. Từ chính máy chủ, curl báo <code>curl: (56) Recv failure: Connection reset by peer</code> — kết nối tới được <code>docker-proxy</code> rồi bị ngắt vì bên trong không ai nghe 8080; từ máy khác thì <code>Couldn't connect to server</code>. Hai thông báo khác nhau cho cùng một lỗi đánh máy, nên khi thấy container "chạy mà không trả lời", việc đầu tiên là đọc lại <code>docker port</code>.</p>

<h3>Cái bẫy tường lửa</h3>
${slide('dk-08', 11, 'Gói tới cổng -p rẽ sang FORWARD — luật mở/đóng cổng ở INPUT không được hỏi')}
<pre><code><span class="tok-comment"># UFW bảo cổng đó đóng…</span>
sudo ufw status | head -5</code></pre>
<div class="out">Status: active
To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
80,443/tcp                 ALLOW       Anywhere</div>
<pre><code><span class="tok-comment"># …vậy mà 5432 vẫn trả lời từ một cái máy hoàn toàn khác</span>
docker run -d --name db -p 5432:5432 -e POSTGRES_PASSWORD=x postgres:16-alpine &gt;/dev/null
<span class="tok-comment"># từ máy tính của bạn, không phải từ máy chủ:</span>
nc -zv &lt;ip-máy-chủ&gt; 5432</code></pre>
<div class="out">Connection to &lt;ip-máy-chủ&gt; 5432 port [tcp/postgresql] succeeded!</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Vì sao UFW thua</span><span class="lz-t">Docker ghi luật DNAT vào chuỗi PREROUTING của bảng nat</span><span class="lz-d">Những luật đó chạy <em>trước</em> bảng filter nơi luật của UFW nằm, rồi chuỗi FORWARD của chính Docker chấp nhận gói đã dịch địa chỉ. UFW không được hỏi ý kiến ở bất kỳ điểm nào.</span></div>
  <div class="lz-step"><span class="lz-k">Vá 1 · công bố vào loopback</span><span class="lz-t">-p 127.0.0.1:5432:5432</span><span class="lz-d">Câu trả lời đơn giản và đáng tin nhất. Bên ngoài không với tới được vì chẳng có luật nào gửi gói tới đó. Cần truy cập từ máy cá nhân thì dùng đường hầm SSH.</span></div>
  <div class="lz-step"><span class="lz-k">Vá 2 · đừng công bố gì cả</span><span class="lz-t">đặt cơ sở dữ liệu lên một mạng nội bộ</span><span class="lz-d">API của bạn gọi nó bằng tên container qua cây cầu; máy chủ không cần cổng nào hết. Một stack compose nên trông như vậy — xem Chương 10.</span></div>
  <div class="lz-step"><span class="lz-k">Vá 3 · ufw-docker, nếu buộc phải công bố</span><span class="lz-t">luật đặt trong DOCKER-USER, không đặt trong chuỗi của ufw</span><span class="lz-d"><code>DOCKER-USER</code> là chuỗi duy nhất Docker cam kết không ghi đè. Script <code>ufw-docker</code> tự động hoá việc ghi luật vào đó; đừng sửa tay các chuỗi của chính Docker, chúng bị viết lại mỗi lần khởi động lại.</span></div>
</div>
<pre><code><span class="tok-comment"># Chuỗi duy nhất là của bạn: DOCKER-USER, được hỏi trước luật của Docker</span>
sudo iptables -I DOCKER-USER -p tcp --dport 5432 ! -s 10.0.0.0/8 -j DROP
sudo iptables -L DOCKER-USER -n --line-numbers | head -4</code></pre>
<div class="out">Chain DOCKER-USER (1 references)
num  target  prot opt source        destination
1    DROP    tcp  --  !10.0.0.0/8   0.0.0.0/0   tcp dpt:5432
2    RETURN  all  --  0.0.0.0/0     0.0.0.0/0</div>
<div class="callout warn"><strong>Hãy kiểm chuyện này trên chính máy chủ của bạn ngay bây giờ.</strong> <code>sudo ss -lntp | grep docker-proxy</code> liệt kê mọi cổng Docker đã công bố và ở giao diện nào (thiếu <code>sudo</code> thì <code>ss</code> giấu tên tiến trình của người dùng khác và grep ra rỗng — <code>docker ps --format '{{.Names}}\\t{{.Ports}}'</code> thì chạy được không cần sudo). Bất cứ dòng nào hiện <code>0.0.0.0:</code> cho một cơ sở dữ liệu, một cache, một giao diện quản trị hay một điểm cuối số liệu đều đang với tới được từ Internet, bất kể tường lửa của bạn nói gì. Phép kiểm này mất hai giây và là thứ đáng giá nhất trong cả chương.</div>

<h3>Chạy thử từng bước: đọc luật DNAT thật — chỉ ĐỌC, không sửa gì</h3>
${slide('dk-08', 12, 'Mỗi -p là một dòng DNAT, đếm được từng kết nối')}
<p>"Docker ghi luật DNAT chạy trước tường lửa" là câu dễ nói mà khó tin nếu chưa nhìn tận mắt. Trên Linux bạn đọc được chính các luật đó. Máy của khoá không có <code>sudo</code>, nên ta dùng đúng mẹo của Chương 1: một container phụ dùng chung mạng của máy chủ và có quyền quản trị mạng, cài công cụ <code>iptables</code> vào đó rồi ĐỌC:</p>
<pre><code class="language-bash">docker run --rm --network host --privileged alpine sh -c '
  apk add -q iptables nftables
  iptables -t nat -S DOCKER | grep -E "1808[01]"<span class="tok-comment"># luật đổi đích</span>
  iptables -t nat -S PREROUTING               <span class="tok-comment"># ai gọi chuỗi DOCKER</span>
  iptables -t raw -S PREROUTING | grep -E "1808[01]"<span class="tok-comment"># luật bảo vệ 127.0.0.1</span>
  iptables -t nat -L DOCKER -nv | grep -E "pkts|dpt:1808[01]"'</code></pre>
<div class="out">-A DOCKER ! -i docker0 -p tcp -m tcp --dport 18080 -j DNAT --to-destination 172.17.0.5:80
-A DOCKER -d 127.0.0.1/32 ! -i docker0 -p tcp -m tcp --dport 18081 -j DNAT --to-destination 172.17.0.6:80
-P PREROUTING ACCEPT
-A PREROUTING -m addrtype --dst-type LOCAL -j DOCKER
-A PREROUTING -d 127.0.0.1/32 ! -i lo -p tcp -m tcp --dport 18081 -j DROP
 pkts bytes target     prot opt in     out     source               destination
    4   256 DNAT       tcp  --  !docker0 *       0.0.0.0/0            0.0.0.0/0            tcp dpt:18080 to:172.17.0.5:80
    0     0 DNAT       tcp  --  !docker0 *       0.0.0.0/0            127.0.0.1            tcp dpt:18081 to:172.17.0.6:80</div>
<p>Output thật trên máy Linux (Docker 29.6, firewalld đang bật; <code>docker info</code> ghi <code>Firewall Backend: iptables+firewalld</code>). Trước lần đọc này, từ máy Mac cùng mạng tôi đã gõ <code>curl http://192.168.1.102:18080/</code> một lần (bộ đếm = 1), rồi thêm ba lần nữa — bộ đếm thành <code>4</code>: mỗi kết nối MỚI từ máy khác đi qua đúng dòng DNAT đó. Dòng <code>18081</code> (gắn <code>127.0.0.1</code>) vẫn <code>0</code> vì nó chỉ khớp gói có đích <code>127.0.0.1</code>.</p>
<table>
<tr><th>Mẩu</th><th>Nghĩa là</th></tr>
<tr><td><code>--network host</code></td><td>Container phụ dùng CHUNG network namespace với máy chủ ⇒ nó thấy đúng bảng luật của máy chủ (Bài 8.4).</td></tr>
<tr><td><code>--privileged</code></td><td>Cho quyền quản trị mạng (CAP_NET_ADMIN…) để được đọc netfilter. Mạnh: chỉ dùng cho container dùng-xong-vứt của chính bạn.</td></tr>
<tr><td><code>apk add -q iptables nftables</code></td><td>Cài công cụ vào container phụ — máy chủ không bị cài thêm gì.</td></tr>
<tr><td><code>-t nat</code> / <code>-t raw</code></td><td>Chọn bảng: <code>nat</code> đổi địa chỉ, <code>raw</code> chạy sớm nhất, trước cả theo dõi kết nối.</td></tr>
<tr><td><code>-S DOCKER</code></td><td>In luật của chuỗi <code>DOCKER</code> dưới dạng lệnh đã tạo ra nó. <code>-L … -nv</code> in dạng bảng kèm bộ đếm gói/byte.</td></tr>
<tr><td><code>--dst-type LOCAL</code></td><td>"Gói gửi tới bất kỳ IP nào CỦA máy này" — đó là lý do cổng <code>0.0.0.0</code> mở trên MỌI card.</td></tr>
</table>
<div class="callout danger"><strong>Chỉ dùng <code>-S</code> và <code>-L</code> (đọc).</strong> <code>-I</code>, <code>-A</code>, <code>-D</code>, <code>-F</code> là SỬA luật — trên máy thật, một luật sai có thể cắt mạng của mọi container hoặc khoá luôn SSH của bạn. Và đừng sửa tay chuỗi <code>DOCKER</code>: Docker viết lại nó mỗi lần khởi động. Trên Mac, các luật này nằm trong máy ảo của Docker Desktop.</div>
<p>Còn tường lửa của máy thì sao? Trên Fedora là firewalld; chuỗi nhận gói gửi CHO máy (<code>filter_INPUT</code>) của nó bắt đầu thế này — đọc bằng cùng container phụ, lệnh <code>nft list chain inet firewalld filter_INPUT</code>:</p>
<div class="out">table inet firewalld {
	chain filter_INPUT {
		type filter hook input priority filter + 10; policy accept;
		ct state { established, related } accept
		ct status dnat accept
		iifname "lo" accept
		ct state invalid drop
		jump filter_INPUT_POLICIES
		reject with icmpx admin-prohibited
	}
}</div>
<p>Dòng thứ hai của thân chuỗi là cả câu chuyện: <code>ct status dnat accept</code> — gói nào ĐÃ bị đổi đích (DNAT) thì cho qua luôn, trước khi xét zone và cổng. Chuỗi <code>filter_FORWARD</code> cũng có đúng dòng đó. Còn gói tới cổng đã công bố thì bị đổi đích ở <code>PREROUTING</code> thành IP của container, nên nó rẽ sang đường FORWARD (đi xuyên máy), không đi INPUT. Luật "chỉ mở cổng 22" của UFW hay firewalld nằm ở INPUT ⇒ không bao giờ được hỏi. Máy của khoá mở sẵn dải 1025–65535 trong zone <code>FedoraWorkstation</code> nên tôi không dựng được cảnh "tường lửa đóng mà vẫn lọt" bằng cổng trong dải của khoá mà không SỬA tường lửa — và việc đó nằm ngoài luật an toàn của khoá. Các luật đọc được ở trên là bằng chứng cho cơ chế; phần "máy khác vào được" có ở mục kế tiếp.</p>

<h3>Sự cố thật: một dòng ports làm Postgres mở cho cả mạng</h3>
${slide('dk-08', 13, 'Sự cố thật: ports "5432:5432" = Postgres mở cho cả mạng')}
<p>Chuyện rất hay gặp ở dự án sinh viên: để chạy migration từ laptop cho tiện, file compose trên VPS có thêm <code>ports: - "5432:5432"</code> cho Postgres, mật khẩu là thứ gõ vội lúc dựng. "Tạm thôi" — nhưng dòng đó nằm trong file, nên mỗi lần <code>compose up</code> nó lại mở. Máy quét trên Internet quét cổng 5432 liên tục; một mật khẩu yếu là đủ để mất dữ liệu. Ta tái hiện đúng cảnh đó, thu nhỏ trong mạng nhà: máy Linux chạy hai Postgres — một cái công bố kiểu "tạm thôi", một cái gắn <code>127.0.0.1</code> — rồi máy Mac cùng Wi-Fi đóng vai kẻ lạ.</p>
<pre><code class="language-yaml"><span class="tok-comment"># compose.yaml trên máy Linux</span>
name: dk08-pg
services:
  db-mo:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: matkhau-yeu
    ports:
      - "18082:5432"              <span class="tok-comment"># mọi card ⇒ mọi máy tới được</span>
  db-lo:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: matkhau-yeu
    ports:
      - "127.0.0.1:18083:5432"    <span class="tok-comment"># chỉ chính máy chủ</span></code></pre>
<pre><code class="language-bash"><span class="tok-comment"># gõ từ máy MAC (192.168.1.101) vào máy Linux (192.168.1.102)</span>
nc -zv -G 3 192.168.1.102 18082
docker run --rm -e PGPASSWORD=matkhau-yeu postgres:16-alpine \\
  psql -h 192.168.1.102 -p 18082 -U postgres -Atc 'select current_user, inet_server_addr(), version()'
nc -zv -G 3 192.168.1.102 18083</code></pre>
<div class="out">Connection to 192.168.1.102 port 18082 [tcp/*] succeeded!
postgres|172.23.0.2|PostgreSQL 16.15 on x86_64-pc-linux-musl, compiled by gcc (Alpine 15.2.0) 15.2.0, 64-bit
nc: connectx to 192.168.1.102 port 18083 (tcp) failed: Connection refused</div>
<p>Một máy KHÁC vừa đăng nhập làm <code>postgres</code> — siêu người dùng — vào cơ sở dữ liệu, chỉ nhờ biết IP, cổng và một mật khẩu yếu. Để ý <code>inet_server_addr()</code> trả <code>172.23.0.2</code>: Postgres thấy kết nối tới IP container của nó, vì DNAT đã đổi đích từ trước. Còn bản <code>127.0.0.1</code> thì từ chối ngay (<code>Connection refused</code>).</p>
${slide('dk-08', 14, 'Ba cách vá, xếp từ an toàn nhất — và một phép rà 2 giây')}
<p>Ba cách vá, xếp từ an toàn nhất:</p>
<pre><code class="language-yaml">services:
  db:
    image: postgres:16-alpine
    <span class="tok-comment"># Cách 1 (tốt nhất): KHÔNG có khoá ports. API trong cùng mạng gọi db:5432.</span>
    <span class="tok-comment"># Cách 2: cần psql từ laptop ⇒ chỉ loopback + đường hầm SSH khi cần:</span>
    <span class="tok-comment">#   ports: ["127.0.0.1:5432:5432"]</span>
    <span class="tok-comment">#   laptop$ ssh -L 5432:localhost:5432 deploy@vps   (đóng terminal là đóng cửa)</span>
    <span class="tok-comment"># Cách 3: buộc phải mở ra ngoài ⇒ lọc nguồn trong chuỗi DOCKER-USER (ufw-docker làm hộ)</span></code></pre>
<p>Phép rà hai giây trên máy chủ của chính bạn, KHÔNG cần sudo: <code>docker ps --format '{{.Names}}\\t{{.Ports}}'</code>. Dòng nào có <code>0.0.0.0:</code> hoặc <code>[::]:</code> trước cổng của CSDL, Redis, trang quản trị hay số liệu là đang mở cho mọi máy tới được card mạng đó — bất kể UFW hay firewalld nói gì.</p>

<h3>Trên Mac thì sao?</h3>
<p>Docker Desktop không có iptables trên macOS; thay vào đó, tiến trình <code>com.docker.backend</code> của nó tự mở cổng trên Mac rồi chuyển vào máy ảo. Hậu quả giống hệt: <code>-p 18087:80</code> mở cho cả mạng Wi-Fi.</p>
<pre><code class="language-bash"><span class="tok-comment"># trên Mac</span>
docker run -d --name macpub -p 18087:80 nginx:1.27-alpine
docker run -d --name maclo  -p 127.0.0.1:18088:80 nginx:1.27-alpine
lsof -nP -iTCP:18087 -sTCP:LISTEN
<span class="tok-comment"># từ máy Linux cùng Wi-Fi, gõ vào Mac</span>
curl -s -o /dev/null -w "%{http_code}\\n" --max-time 3 http://192.168.1.101:18087/
curl -s -o /dev/null -w "%{http_code}\\n" --max-time 3 http://192.168.1.101:18088/</code></pre>
<div class="out">COMMAND     PID  USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
com.docke 15848 admin  191u  IPv6 0x1b401f6a5377baf9      0t0  TCP *:18087 (LISTEN)
200
000</div>
<p>Nghĩa là trong phòng lab, trên Wi-Fi ký túc xá hay quán cà phê, một Postgres <code>-p 5432:5432</code> trên laptop của bạn cũng mở cho bạn cùng mạng. Mặc định an toàn cho máy cá nhân cũng là <code>127.0.0.1:</code>.</p>

<h3>docker-proxy, và vì sao thỉnh thoảng bạn thấy nó</h3>
<p>Với phần lớn cổng công bố, Docker cài một luật DNAT của iptables và lưu lượng không bao giờ chạm tầng người dùng. Nhưng nó cũng khởi động một tiến trình phụ nhỏ tên <code>docker-proxy</code> nghe trên cổng của máy chủ — nó tồn tại để lo những trường hợp iptables không lo được, nhất là kết nối từ chính máy chủ tới cổng công bố của nó trên loopback. Bạn sẽ gặp nó theo ba cách: là tiến trình đang giữ một cổng trong <code>ss -lntp</code>, là một mục lạ trong danh sách tiến trình, và là thứ chết với lỗi <code>address already in use</code> khi một dịch vụ trên máy chủ đã chiếm cổng đó.</p>
<pre><code>docker run -d -p 8080:80 nginx:alpine</code></pre>
<div class="out">docker: Error response from daemon: driver failed programming external connectivity on endpoint
inspiring_swartz: failed to bind host port for 0.0.0.0:8080:172.17.0.3:80/tcp: address already in use</div>
<p>Thông báo đó nghĩa là trên máy chủ đã có một tiến trình nghe ở 8080 — thường là một dev server bạn quên. (Container giữ cổng thì ra thông báo KHÁC, còn container đã dừng thì không giữ gì — xem bên dưới.) <code>ss -lntp 'sport = :8080'</code> gọi tên thủ phạm trong một dòng.</p>

<h3>Hai lỗi "cổng bận" khác nhau — và cái bẫy container Up mà mất mạng</h3>
${slide('dk-08', 15, 'docker-proxy và hai lỗi “cổng bận” khác nhau')}
<p>Thông báo lỗi ở trên là của Docker 27. Docker 29 viết khác một chút, và quan trọng hơn: có HAI thông báo khác nhau tuỳ AI đang giữ cổng. Chạy thật trên máy Linux:</p>
<pre><code class="language-bash"><span class="tok-comment"># ① một CONTAINER khác đã giữ 18080</span>
docker run -d --name trung -p 18080:80 nginx:1.27-alpine
<span class="tok-comment"># ② một TIẾN TRÌNH của máy chủ (python) đã giữ 18087</span>
python3 -m http.server --bind 0.0.0.0 18087 &amp;
docker run -d --name dung -p 18087:80 nginx:1.27-alpine
ss -lntp 'sport = :18087'</code></pre>
<div class="out">docker: Error response from daemon: failed to set up container networking: driver failed programming external connectivity on endpoint trung (f68b656f…): Bind for 0.0.0.0:18080 failed: port is already allocated
docker: Error response from daemon: failed to set up container networking: driver failed programming external connectivity on endpoint dung (b94f48dc…): failed to bind host port 0.0.0.0:18087/tcp: address already in use
State  Recv-Q Send-Q Local Address:Port  Peer Address:PortProcess
LISTEN 0      5            0.0.0.0:18087      0.0.0.0:*    users:(("python3",pid=498970,fd=3))</div>
<table>
<tr><th>Thông báo</th><th>Ai giữ cổng</th><th>Tìm thủ phạm</th></tr>
<tr><td><code>port is already allocated</code></td><td>Một container khác (Docker tự biết, không cần hỏi nhân)</td><td><code>docker ps --filter publish=18080</code></td></tr>
<tr><td><code>address already in use</code></td><td>Một tiến trình ngoài Docker: dev server, Postgres cài thẳng…</td><td><code>ss -lntp 'sport = :18087'</code> (thêm <code>sudo</code> nếu tiến trình của người dùng khác)</td></tr>
</table>
<p>Cũng cần sửa một hiểu lầm ở đoạn trên: container ĐÃ DỪNG không giữ cổng. Tôi đã thử: <code>docker stop pub</code> xong thì <code>ss</code> không còn dòng nào ở 18080, và một container mới lấy được cổng đó ngay. Cái "container cũ" chỉ gây lỗi lúc bạn <code>docker start</code> nó lại trong khi cổng đã có chủ.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy: lỗi cổng xong, start lại thì container "Up" nhưng không có mạng.</strong> Container bị lỗi cổng không biến mất: nó nằm lại ở trạng thái <code>Created</code>. Tôi thử trên cả Engine 29.6 (Linux) lẫn 29.8 (Mac): dọn chỗ cho cổng rồi <code>docker start</code> chính container đó thì nó lên <code>Up</code> — nhưng <code>docker inspect -f '{{json .NetworkSettings.Networks}}'</code> in <code>{}</code>, cột PORTS chỉ còn <code>80/tcp</code> (mất phần <code>-&gt;</code>), và bên trong chỉ có <code>lo</code>. <code>docker restart</code> cũng không cứu. Cách chắc ăn: <code>docker rm -f</code> rồi tạo lại (với compose: <code>docker compose up -d --force-recreate</code>).</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> compose của đồ án nhóm có <code>ports: - "5432:5432"</code> cho Postgres "để chạy migration từ laptop". Thầy hướng dẫn yêu cầu: đóng nó lại với mọi máy khác, nhưng chính máy chủ vẫn phải kết nối được. Bạn chứng minh cả trạng thái trước lẫn sau bằng lệnh.</p><ol>
<li>Trong <code>~/thu-docker/thu-pg</code>, viết <code>compose.yaml</code>: <code>name: thu-pg</code>, một dịch vụ <code>db</code> dùng <code>postgres:16-alpine</code>, <code>POSTGRES_PASSWORD: x</code>, <code>ports: ["15432:5432"]</code>. Chạy <code>docker compose up -d</code>.</li>
<li>Rà cổng: <code>docker ps --format '{{.Names}}\\t{{.Ports}}'</code> — chép lại dòng của <code>thu-pg-db-1</code>.</li>
<li>Giả làm "máy khác" bằng cách gõ vào IP LAN của chính máy: Mac <code>nc -zv \$(ipconfig getifaddr en0) 15432</code>; Linux <code>nc -zv \$(hostname -I | awk '{print \$1}') 15432</code>.</li>
<li>Sửa thành <code>ports: ["127.0.0.1:15432:5432"]</code>, chạy lại <code>docker compose up -d</code> (compose tự tạo lại container). Lặp lại bước 2 và 3, rồi thử <code>nc -zv 127.0.0.1 15432</code>.</li>
<li>Dọn: <code>docker compose down -v</code> (xoá luôn volume vô danh của Postgres).</li></ol>
<p><strong>Đạt khi:</strong> trước khi sửa, bước 2 cho <code>0.0.0.0:15432-&gt;5432/tcp</code> và bước 3 <code>succeeded</code>; sau khi sửa, bước 2 cho <code>127.0.0.1:15432-&gt;5432/tcp</code>, gõ qua IP LAN ra <code>Connection refused</code> nhưng <code>127.0.0.1</code> vẫn <code>succeeded</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Publish (công bố cổng)</span><span class="v">Mở một cổng trên máy chủ và chuyển nó vào cổng của container — việc của <code>-p</code> / <code>ports:</code>.</span></div>
  <div class="kv"><span class="k">EXPOSE (khai báo cổng)</span><span class="v">Dòng ghi chú trong Dockerfile rằng ứng dụng nghe cổng nào; tự nó không mở gì.</span></div>
  <div class="kv"><span class="k">DNAT (đổi địa chỉ đích)</span><span class="v">Luật đổi đích của gói từ "IP máy chủ:18080" thành "IP container:80" ngay khi gói vừa tới.</span></div>
  <div class="kv"><span class="k">iptables / nftables (bộ lọc gói)</span><span class="v">Công cụ quản lý netfilter — phần của nhân Linux quyết định gói đi đâu, bị đổi gì, bị chặn hay không.</span></div>
  <div class="kv"><span class="k">Chain (chuỗi luật)</span><span class="v">Một danh sách luật chạy ở một điểm: PREROUTING (vừa tới), INPUT (gửi cho máy), FORWARD (đi xuyên máy).</span></div>
  <div class="kv"><span class="k">DOCKER-USER</span><span class="v">Chuỗi rỗng Docker để dành cho bạn, chạy trước luật của Docker trong FORWARD và không bị ghi đè.</span></div>
  <div class="kv"><span class="k">docker-proxy</span><span class="v">Tiến trình nhỏ Docker chạy cho mỗi cổng công bố (hai cái: IPv4 + IPv6) để giữ cổng và lo các ca iptables không lo được.</span></div>
  <div class="kv"><span class="k">SSH tunnel (đường hầm SSH)</span><span class="v"><code>ssh -L 5432:localhost:5432 vps</code>: mượn kết nối SSH để với tới một cổng chỉ mở ở loopback của VPS.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>EXPOSE</code> chỉ là ghi chú; <code>-p</code> mới tạo lỗ, đọc là <code>[IP:]CỔNG_MÁY_CHỦ:CỔNG_CONTAINER</code>.</li>
<li>Không ghi IP ⇒ <code>0.0.0.0</code> và <code>[::]</code>: mọi máy tới được card mạng đều vào được.</li>
<li>Gói tới cổng đã công bố bị DNAT ngay ở PREROUTING rồi đi FORWARD — luật cổng của UFW/firewalld ở INPUT không được hỏi.</li>
<li>Mặc định an toàn: CSDL không công bố gì; cần thì <code>127.0.0.1:</code> + đường hầm SSH; buộc mở thì lọc trong <code>DOCKER-USER</code>.</li>
<li>Rà bằng <code>docker ps --format '{{.Names}}\\t{{.Ports}}'</code>; <code>ss -lntp</code> chỉ hiện tên <code>docker-proxy</code> khi có <code>sudo</code>.</li>
<li><code>port is already allocated</code> = container khác giữ cổng; <code>address already in use</code> = tiến trình máy chủ giữ; lỗi cổng rồi thì <code>rm -f</code> và tạo lại container.</li>
</ul>


<a class="link-card" href="https://docs.docker.com/engine/network/packet-filtering-firewalls/" target="_blank" rel="noopener">
  <span class="lc-ico">🔥</span>
  <span class="lc-body"><span class="lc-title">Docker docs — Lọc gói và tường lửa</span><span class="lc-sub">Giải thích chính thức vì sao luật của Docker đi vòng qua UFW và firewalld, <code>DOCKER-USER</code> dùng làm gì, và thứ tự chuỗi chính xác. Bắt buộc đọc trước khi phơi bất cứ thứ gì ra máy chủ công khai.</span></span>
</a>
<a class="link-card" href="https://github.com/chaifeng/ufw-docker" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">ufw-docker</span><span class="lc-sub">Một script nhỏ khiến UFW và Docker hợp tác được bằng cách ghi luật vào <code>DOCKER-USER</code>. Phần README giải thích vấn đề rõ hơn phần lớn bài viết, và cách vá đó sống sót qua các lần khởi động lại daemon.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: công bố cổng an toàn</span><span class="lc-sub">Bài chấm điểm: đoán trước <code>-p 80:8080</code> làm gì so với <code>-p 8080:80</code>, gắn một cơ sở dữ liệu vào loopback rồi chứng minh bên ngoài không với tới được, và rà một máy chủ đang chạy tìm cổng công bố ở <code>0.0.0.0</code>.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> công bố cổng cơ sở dữ liệu "tạm thôi, để chạy một lần migration từ máy tôi". Cái luật sống lâu hơn cái lý do: nó được ghi vào cấu hình của container, nên nó quay lại sau mỗi lần khởi động lại, mỗi lần deploy, mãi mãi, và không luật tường lửa nào bạn thêm sau đó đóng được nó. Máy quét khắp Internet tìm ra một cổng 5432, 6379 hay 27017 đang mở trong vòng vài giờ, và thông tin đăng nhập mặc định hoặc yếu lo nốt phần còn lại — đây là cách phổ biến nhất khiến một cơ sở dữ liệu production nhỏ bị chiếm. Hãy dùng đường hầm SSH thay vào đó: <code>ssh -L 5432:localhost:5432 deploy@server</code> cho bạn đúng quyền truy cập ấy trong thời gian phiên làm việc và không để lại gì. Nếu bạn từng làm chuyện này, hãy chạy <code>sudo ss -lntp | grep docker-proxy</code> trên máy chủ trước khi đọc bài tiếp theo.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> <code>EXPOSE</code> là tài liệu, <code>-p</code> mới tạo ra cái lỗ, và <code>-p</code> đọc theo thứ tự máy-chủ rồi container. Công bố cổng ghi ra một luật DNAT của iptables chạy TRƯỚC luật filter của UFW, nên <strong>một cổng đã công bố là đang mở bất kể tường lửa của bạn nói gì</strong> — hãy gắn vào <code>127.0.0.1</code>, hoặc đừng công bố gì cả mà dùng mạng container. Và <code>DOCKER-USER</code> là chuỗi duy nhất Docker không ghi đè, nên mọi luật tuỳ chỉnh thuộc về chỗ đó.</p>
</div>
`,
    },
    /* ─────────────────────────── 8.3 ─────────────────────────── */
    {
      title: '8.3 — Containers talking to each other|||8.3 — Container nói chuyện với nhau',
      slug: 'dk-8-3-goi-nhau',
      type: 'LESSON',
      description: 'DNS nhúng ở 127.0.0.11, tên container và alias, nhiều mạng cho một container, kiến trúc hai tầng công khai/nội bộ, khi tên phân giải được mà kết nối vẫn hỏng, và vì sao --link đã chết.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.3</span>
<h2>Containers talking to each other</h2>
<p class="lead">Two containers on the same user-defined network reach each other by name, on the container's own port, with no publishing involved. That last part surprises people: your API talks to Postgres on 5432 even though nothing is published to the host, because they are on the same bridge and the port was never hidden from the network — only from the host.</p>

<h3>The embedded DNS server</h3>
${slide('dk-08', 16, 'DNS nhúng 127.0.0.11: hỏi TÊN, nhận IP HIỆN TẠI')}
<pre><code>docker network create shop &gt;/dev/null
docker run -d --name api  --network shop nginx:alpine &gt;/dev/null
docker run -d --name cache --network shop redis:7-alpine &gt;/dev/null
docker exec api cat /etc/resolv.conf
docker exec api sh -c 'getent hosts cache; nc -z cache 6379 &amp;&amp; echo "6379 open"'</code></pre>
<div class="out">nameserver 127.0.0.11
options ndots:0
172.19.0.3      cache
6379 open</div>
<p>Redis published nothing. From the host, <code>nc -z localhost 6379</code> fails. From <code>api</code>, on the same network, port 6379 is simply open — publishing is about the <em>host</em> boundary, not the container-to-container one. This is the correct shape for a backend service: reachable by the things that need it, invisible to everything else.</p>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">query</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">getent hosts cache</span><span class="lz-nsub">The app resolves a name, exactly as it would anywhere else</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">resolver</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">127.0.0.11 · embedded DNS</span><span class="lz-nsub">Docker's resolver, present only inside the namespace, per network</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">known name?</span><span class="lz-nsub">Container name, network alias, or compose service name on this network</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">answer</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">172.19.0.3</span><span class="lz-nsub">Current address — re-resolved after a restart, so it never goes stale</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">else → upstream</span><span class="lz-nsub">Unknown names are forwarded to the host's resolvers, so public DNS still works</span></div></div>
  </div>
</div>

<h3>Run it step by step: watch the embedded DNS at work</h3>
<p>"Docker runs a DNS server at 127.0.0.11" sounds like magic. In fact it is three perfectly ordinary things, each of which you can inspect: a line in <code>/etc/resolv.conf</code>, a small NAT rule INSIDE the container's namespace, and a socket opened by <code>dockerd</code> itself. All output below is real, from the Mac (container names in the lesson are shortened, without the <code>dk08-</code> prefix).</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Step 1 · who gets asked?</span><span class="lz-t">docker exec api grep nameserver /etc/resolv.conf</span><span class="lz-d"><code>nameserver 127.0.0.11</code> — every resolver library (glibc, musl, Node, Python) reads this file.</span></div>
  <div class="lz-step"><span class="lz-k">Step 2 · ask that DNS server directly</span><span class="lz-t">dig dk08-pg @127.0.0.11 +noall +answer</span><span class="lz-d">An A record with a 600-second TTL. <code>@</code> means "ask this server", <code>+noall +answer</code> means "print only the answer".</span></div>
  <div class="lz-step"><span class="lz-k">Step 3 · who is really listening?</span><span class="lz-t">nsenter … ss -lntp</span><span class="lz-d">A socket on <code>127.0.0.11:&lt;random port&gt;</code> owned by the <code>dockerd</code> process — there is no DNS container at all.</span></div>
  <div class="lz-step"><span class="lz-k">Step 4 · where does port 53 go?</span><span class="lz-t">iptables -t nat -S (in the container's namespace)</span><span class="lz-d">Two DNAT rules send <code>127.0.0.11:53</code> to dockerd's random ports — one for TCP, one for UDP.</span></div>
</div>
<pre><code class="language-bash">docker run --rm --network shop nicolaka/netshoot dig dk08-pg @127.0.0.11 +noall +answer
docker run --rm --network container:api --cap-add NET_ADMIN nicolaka/netshoot iptables -t nat -S
docker run --rm --network container:api nicolaka/netshoot ss -lnu</code></pre>
<div class="out">dk08-pg.		600	IN	A	172.26.0.4
-P PREROUTING ACCEPT
-P INPUT ACCEPT
-P OUTPUT ACCEPT
-P POSTROUTING ACCEPT
-N DOCKER_OUTPUT
-N DOCKER_POSTROUTING
-A OUTPUT -d 127.0.0.11/32 -j DOCKER_OUTPUT
-A POSTROUTING -d 127.0.0.11/32 -j DOCKER_POSTROUTING
-A DOCKER_OUTPUT -d 127.0.0.11/32 -p tcp -m tcp --dport 53 -j DNAT --to-destination 127.0.0.11:33757
-A DOCKER_OUTPUT -d 127.0.0.11/32 -p udp -m udp --dport 53 -j DNAT --to-destination 127.0.0.11:55869
-A DOCKER_POSTROUTING -s 127.0.0.11/32 -p tcp -m tcp --sport 33757 -j SNAT --to-source :53
-A DOCKER_POSTROUTING -s 127.0.0.11/32 -p udp -m udp --sport 55869 -j SNAT --to-source :53
State  Recv-Q Send-Q Local Address:Port  Peer Address:Port
UNCONN 0      0         127.0.0.11:55869      0.0.0.0:*</div>
<table>
<tr><th>Piece</th><th>Meaning</th></tr>
<tr><td><code>--network container:api</code></td><td>The netshoot container SHARES <code>api</code>'s network namespace — it sees exactly <code>api</code>'s NAT table and sockets (Lesson 8.4 explains this properly).</td></tr>
<tr><td><code>--cap-add NET_ADMIN</code></td><td>Adds exactly one capability: network admin, enough to read the NAT table. Far lighter than <code>--privileged</code>.</td></tr>
<tr><td><code>DOCKER_OUTPUT … --dport 53 -j DNAT</code></td><td>A query sent to <code>127.0.0.11:53</code> is redirected to <code>127.0.0.11:55869</code> (UDP) — where dockerd actually listens.</td></tr>
<tr><td><code>DOCKER_POSTROUTING … SNAT --to-source :53</code></td><td>The reply's source port is rewritten back to 53, so the asking program sees the "right" server answer.</td></tr>
<tr><td><code>ss -lnu</code></td><td>Lists listening UDP sockets: exactly one, <code>127.0.0.11:55869</code>.</td></tr>
</table>
<p>One more piece of evidence waits in Lesson 8.5: inspected with <code>nsenter … ss -lntp</code> and permission to see processes, the <code>127.0.0.11:45039</code> line shows <code>users:(("dockerd",pid=286,…))</code>. And because dockerd answers from its own records rather than from a fixed file, a restarted container keeps resolving — after <code>docker restart cache</code>, <code>getent hosts cache</code> still returns <code>172.26.0.3</code> (the IP was kept because the container was not removed; a NEW container may get a different IP, but the NAME stays).</p>
<div class="callout"><strong>Redis published nothing and api still reaches it — check that properly.</strong> <code>docker ps --filter name=cache --format '{{.Ports}}'</code> prints <code>6379/tcp</code>: no <code>-&gt;</code> means NO port on the host. The published form looks like <code>0.0.0.0:6379-&gt;6379/tcp</code>. On the course Mac, <code>nc -z localhost 6379</code> still "succeeded" — but that was a DIFFERENT Redis publishing 6379 for an old project. Always check with <code>docker ps</code>; never conclude from a port that happens to be open.</div>

<h3>Names a container answers to</h3>
${slide('dk-08', 17, 'Một container, nhiều tên: tên, alias, tên dịch vụ — và xoay vòng')}
<pre><code>docker run -d --name pg --network shop \\
  --network-alias db --network-alias primary.db \\
  -e POSTGRES_PASSWORD=x postgres:16-alpine &gt;/dev/null
docker exec api sh -c 'for n in pg db primary.db; do printf "%-12s " "$n"; getent hosts "$n" | awk "{print \\$1}"; done'</code></pre>
<div class="out">pg           172.19.0.4
db           172.19.0.4
primary.db   172.19.0.4</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Container name</span><span class="v">Always resolvable on every user-defined network the container is attached to. The simplest, and what compose uses under the hood.</span></div>
  <div class="kv"><span class="k">Network alias</span><span class="v">Extra names, scoped to one network. Useful when a config file hard-codes a hostname you cannot change, or when you want <code>db</code> to mean different containers in staging and production.</span></div>
  <div class="kv"><span class="k">Compose service name</span><span class="v">In a compose project the service name is the DNS name — <code>postgres</code>, not <code>myproject-postgres-1</code>. Both work; the short one is what you put in config.</span></div>
  <div class="kv"><span class="k">Several containers, one alias</span><span class="v">Docker returns all their addresses and the client picks one, giving crude round-robin. Real load balancing needs a proxy; this is enough for a worker pool.</span></div>
  <div class="kv"><span class="k">Unknown names go upstream</span><span class="v">Anything the embedded resolver does not know is forwarded to the host's DNS, so <code>api.github.com</code> resolves normally from inside a container.</span></div>
</div>

<h3>Round-robin with an alias, and compose service names</h3>
<p>When two containers carry the same alias, the embedded DNS returns BOTH addresses. Real run:</p>
<pre><code class="language-bash">docker run -d --name w1 --network shop --network-alias worker nginx:1.27-alpine
docker run -d --name w2 --network shop --network-alias worker nginx:1.27-alpine
docker run --rm --network shop nicolaka/netshoot dig +short worker</code></pre>
<div class="out">172.26.0.7
172.26.0.6</div>
<p>The caller usually takes the first address, and the order may rotate between queries — that is "crude round-robin". It does NOT know which container is busy or dead and never retries; for real load balancing, put a proxy (nginx, Traefik) in front.</p>
<p>Compose does exactly what <code>--network-alias</code> does: each service gets an alias equal to its SERVICE NAME on the <code>&lt;project&gt;_default</code> network. Real run with a two-service file, <code>api</code> and <code>cache</code>, project name <code>dk08-cmp</code>:</p>
<pre><code class="language-bash">docker network ls --filter name=dk08-cmp
docker compose exec api sh -c 'getent hosts cache; getent hosts dk08-cmp-cache-1'</code></pre>
<div class="out">NETWORK ID     NAME               DRIVER    SCOPE
714c4e6b86b2   dk08-cmp_default   bridge    local
172.27.0.2        cache  cache
172.27.0.2        dk08-cmp-cache-1  dk08-cmp-cache-1</div>
<p>Two names, one IP. In the app's <code>DATABASE_URL</code>/<code>REDIS_URL</code>, use the short name (<code>cache</code>, <code>db</code>): it does not change when you rename the project directory; the container name does.</p>

<h3>The two-tier shape you actually want</h3>
${slide('dk-08', 18, 'Mạng hai tầng: proxy bị chiếm cũng không gọi nổi tên CSDL')}
<pre><code>docker network create public &gt;/dev/null
docker network create --internal private &gt;/dev/null

docker run -d --name db     --network private postgres:16-alpine -c listen_addresses='*' &gt;/dev/null
docker run -d --name backend --network private api:1.4.2 &gt;/dev/null
docker network connect public backend                <span class="tok-comment"># backend sits on BOTH</span>
docker run -d --name proxy  --network public -p 80:80 -p 443:443 nginx:alpine &gt;/dev/null

<span class="tok-comment"># proxy → backend: yes. proxy → db: no route at all.</span>
docker exec proxy sh -c 'getent hosts backend &amp;&amp; echo backend-ok; getent hosts db || echo "db: not resolvable"'</code></pre>
<div class="out">172.20.0.2      backend
backend-ok
db: not resolvable</div>
<div class="callout ok"><strong>The proxy cannot even name the database.</strong> Not "is blocked from" — cannot resolve, cannot route, has no interface on that network. If the proxy is ever compromised, the database is not one <code>nc</code> away. This costs one extra <code>docker network create</code> and it is the single best structural decision in a small deployment; Chapter 10 builds the same shape in compose, where it is four lines.</div>

<h3>When the name resolves but the connection fails</h3>
${slide('dk-08', 19, 'Tên phân giải được mà vẫn refused: 4 nguyên nhân')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">The service binds to 127.0.0.1 inside its container</span><span class="lz-t">the most common cause by far</span><span class="lz-d">Loopback inside a namespace is reachable only from that namespace. The service must listen on <code>0.0.0.0</code> — for Postgres <code>listen_addresses='*'</code>, for a Node server <code>app.listen(3000, '0.0.0.0')</code>, for Next.js <code>-H 0.0.0.0</code>.</span></div>
  <div class="lz-step"><span class="lz-k">Different networks</span><span class="lz-t">docker inspect -f '{{ json .NetworkSettings.Networks }}'</span><span class="lz-d">Two containers can both exist, both be healthy, and simply share no network. The name will not resolve at all — that is the tell.</span></div>
  <div class="lz-step"><span class="lz-k">The service is not up yet</span><span class="lz-t">connection refused, immediately</span><span class="lz-d">A container being "started" is not the same as its process listening. This is what healthchecks and <code>depends_on: condition: service_healthy</code> solve (Chapter 9).</span></div>
  <div class="lz-step"><span class="lz-k">Wrong port</span><span class="lz-t">you used the published host port, not the container port</span><span class="lz-d">Between containers you use the <em>container's</em> port — 5432, not 5433. The published mapping is irrelevant on the internal network, and reusing it silently connects to nothing.</span></div>
</div>
<pre><code><span class="tok-comment"># Prove the loopback case, which every developer meets once</span>
docker run -d --name lb --network shop python:3.12-alpine \\
  python -c "import http.server as h; h.HTTPServer(('127.0.0.1',8000), h.SimpleHTTPRequestHandler).serve_forever()" &gt;/dev/null
docker exec api sh -c 'nc -z -w2 lb 8000 &amp;&amp; echo open || echo "refused — bound to loopback"'
docker exec lb sh -c 'nc -z -w2 127.0.0.1 8000 &amp;&amp; echo "open from inside"'</code></pre>
<div class="out">refused — bound to loopback
open from inside</div>

<h3>Run it step by step: catch two "name resolves but refused" causes red-handed</h3>
<p>The first two causes in the list above are the most common, and both can be proven with commands. <strong>First — listening on the wrong address.</strong> We deliberately run a web server that listens only on <code>127.0.0.1</code> and look at it from three sides:</p>
<pre><code class="language-bash">docker run -d --name lb --network shop python:3.12-alpine \\
  python -c "import http.server as h; h.HTTPServer(('127.0.0.1',8000), h.SimpleHTTPRequestHandler).serve_forever()"
docker exec api sh -c 'wget -qO- -T 3 http://lb:8000/ 2&gt;&amp;1 | head -1'
docker run --rm --network container:lb alpine:3.20 netstat -lnt</code></pre>
<div class="out">wget: can't connect to remote host (172.26.0.5): Connection refused
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        0      0 127.0.0.11:40967        0.0.0.0:*               LISTEN
tcp        0      0 127.0.0.1:8000          0.0.0.0:*               LISTEN</div>
<p>Read it in order: wget DID resolve <code>lb</code> to <code>172.26.0.5</code> (DNS is fine), and the connection was refused at once (something answered no). Looking from inside <code>lb</code>'s namespace with BusyBox's <code>netstat</code> (already in alpine, no need to pull netshoot), the <code>127.0.0.1:8000</code> line is the culprit: loopback only, while <code>api</code>'s packets arrive via <code>eth0</code>. The <code>127.0.0.11:40967</code> line is the embedded DNS from above. The fix: make the app listen on <code>0.0.0.0</code> — for this example, <code>python -m http.server 3000 --bind 0.0.0.0</code>; run for real, <code>nc -z -w2 api 3000</code> prints <code>open</code>.</p>
<p><strong>Second — the service is not up yet.</strong> Postgres is the classic: on its first run with an empty volume it initialises the database for a few seconds, and during that time listens ONLY on a Unix socket. I knocked right after <code>docker run</code> and got refused; three seconds later, <code>db-5432-open</code>. <code>docker logs</code> tells exactly that story:</p>
<pre><code class="language-bash">docker logs db 2&gt;&amp;1 | grep "listening on"</code></pre>
<div class="out">2026-09-23 18:41:03.478 UTC [42] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
2026-09-23 18:41:03.686 UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
2026-09-23 18:41:03.686 UTC [1] LOG:  listening on IPv6 address "::", port 5432
2026-09-23 18:41:03.689 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"</div>
<p>The first line (process 42) is the TEMPORARY server of the init phase — Unix socket only. The next three (process 1) are the real server, listening on <code>0.0.0.0</code>. So "the container is Up" does not mean "the port is open"; a healthcheck plus <code>depends_on: condition: service_healthy</code> in Chapter 9 is the right way to wait.</p>
<table>
<tr><th></th><th>CONTAINER port</th><th>PUBLISHED port</th></tr>
<tr><td>Example</td><td><code>5432</code> in <code>-p 5433:5432</code></td><td><code>5433</code> in <code>-p 5433:5432</code></td></tr>
<tr><td>Who uses it</td><td>Other containers on the same network: <code>db:5432</code></td><td>The host and outside machines: <code>localhost:5433</code></td></tr>
<tr><td>Always there?</td><td>Yes — if the app listens, it exists</td><td>Only if you <code>-p</code></td></tr>
<tr><td>Mix them up and</td><td>—</td><td>Calling <code>db:5433</code> from a container ⇒ refused (nothing inside listens on 5433)</td></tr>
</table>

<h3>--link is dead, and its replacement is better</h3>
${slide('dk-08', 20, '--link đã chết: Docker 29 cảnh báo, và từ chối trên mạng tự tạo')}
<pre><code><span class="tok-comment"># Docker 29: cache is on the user-defined network "shop" ⇒ refused outright</span>
docker run -d --name old --link cache:redis alpine:3.20 sleep 60</code></pre>
<div class="out">WARNING: Links on the default bridge network are deprecated and will be removed in a future release. Use a custom network instead.
4ba3953382627d110d3ef5cb60f0720398b04cb3dab5d106cdd123ba5ae41233
docker: Error response from daemon: container f744043b04b49e0dc39a76aee465f51b9098a293a2b019f9d6d8b3026dab501d not attached to default bridge network</div>
<pre><code><span class="tok-comment"># on the default bridge it still works, with a warning — web is on docker0</span>
docker run -d --name old2 --link web:web alpine:3.20 sleep 60
docker exec old2 grep web /etc/hosts</code></pre>
<div class="out">WARNING: Links on the default bridge network are deprecated and will be removed in a future release. Use a custom network instead.
ad0388c2da87…
172.17.0.10	web 66b55bdbace9 dk08-web</div>
<p>Real output on the Mac, Engine 29.8. The warning text changed, and the old example no longer even starts: Docker creates the container, then refuses to start it because <code>cache</code> lives on a user-defined network, where links do not exist. On the default bridge a link still works — it only writes one line into <code>/etc/hosts</code>.</p>
<p><code>--link</code> wrote entries into <code>/etc/hosts</code> at container start. That meant a restarted container kept a stale address, links only worked in one direction, and they only worked on the default bridge. User-defined networks replace all of it with real DNS that re-resolves. If you meet <code>--link</code> in an old tutorial or an inherited script, replacing it with a network is a mechanical change and always an improvement.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> the team's frontend container calls <code>http://api:3000</code> and gets <code>ECONNREFUSED</code>, although everyone swears "the name is right, it's on the same network". Prove each layer with a command, find the culprit, fix it, and give it the alias <code>api</code> that the frontend actually calls.</p><ol>
<li><code>docker network create thu-shop</code>, then run the "broken API": <code>docker run -d --name thu-api --network thu-shop python:3.12-alpine python -m http.server 3000 --bind 127.0.0.1</code>.</li>
<li>Play the frontend: <code>docker run --rm --network thu-shop alpine:3.20 sh -c 'getent hosts thu-api; nc -z -w2 thu-api 3000 &amp;&amp; echo open || echo refused'</code>. Which layer is fine, which is broken?</li>
<li>Look from inside the API: <code>docker run --rm --network container:thu-api alpine:3.20 netstat -lnt</code>. Copy the line with <code>:3000</code>.</li>
<li>Fix: <code>docker rm -f thu-api</code>, run it again with <code>--bind 0.0.0.0</code> and add <code>--network-alias api</code>. Repeat step 2 but call <code>api</code> instead of <code>thu-api</code>.</li>
<li>Clean up: <code>docker rm -f thu-api; docker network rm thu-shop</code>.</li></ol>
<pre><code class="language-bash">docker run --rm --network thu-shop alpine:3.20 sh -c 'getent hosts api; nc -z -w2 api 3000 &amp;&amp; echo open || echo refused'</code></pre>
<div class="out">172.26.0.10       api  api
open</div>
<p><strong>Done when:</strong> step 2 prints an IP and then <code>refused</code> (DNS fine, connection broken); step 3 shows <code>127.0.0.1:3000</code>; after the fix, calling the alias <code>api</code> prints <code>open</code> — and you can explain why <code>-p</code> was not needed at any step.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Embedded DNS</span><span class="v">The DNS server dockerd keeps at <code>127.0.0.11</code> inside every container on a user-defined network.</span></div>
  <div class="kv"><span class="k">Service discovery</span><span class="v">How services find each other by name instead of fixed IPs — done here by the embedded DNS.</span></div>
  <div class="kv"><span class="k">Network alias</span><span class="v">An extra DNS name for a container, valid on one network; compose sets one equal to the service name.</span></div>
  <div class="kv"><span class="k">Round-robin DNS</span><span class="v">One name returning several IPs so callers spread requests; crude, with no health checks.</span></div>
  <div class="kv"><span class="k">Listen address</span><span class="v">The IP an app opens its port on: <code>127.0.0.1</code> is that namespace only, <code>0.0.0.0</code> is every NIC.</span></div>
  <div class="kv"><span class="k">Connection refused</span><span class="v">The packet arrived but nothing listens on that port — the kernel answers with an RST at once.</span></div>
  <div class="kv"><span class="k">TTL (time to live)</span><span class="v">How many seconds a DNS answer may be cached; the embedded DNS returns 600.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>On a user-defined network, containers call each other by NAME on the CONTAINER port; no <code>-p</code> needed, none wanted.</li>
<li>Embedded DNS = a <code>nameserver 127.0.0.11</code> line + NAT rules inside the namespace + a dockerd socket; unknown names go upstream.</li>
<li>A container can have several names: its name, <code>--network-alias</code>, the compose service name; a shared alias ⇒ DNS returns every IP (crude round-robin).</li>
<li>A two-tier layout (public + <code>--internal</code>): the proxy cannot resolve the database, the database cannot reach the internet.</li>
<li>"Resolves but refused": the service listens on <code>127.0.0.1</code>, it is not up yet, or you used the published port by mistake.</li>
<li><code>--link</code> is obsolete: Docker 29 warns on the default bridge and refuses when the target is on a user-defined network.</li>
</ul>


<a class="link-card" href="https://docs.docker.com/engine/network/#dns-services" target="_blank" rel="noopener">
  <span class="lc-ico">🔎</span>
  <span class="lc-body"><span class="lc-title">Docker docs — DNS services</span><span class="lc-sub">How the embedded resolver at <code>127.0.0.11</code> works, what it forwards upstream, and how to override with <code>--dns</code> and <code>--dns-search</code> when you need a specific resolver.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/network/tutorials/standalone/" target="_blank" rel="noopener">
  <span class="lc-ico">🧭</span>
  <span class="lc-body"><span class="lc-title">Standalone networking tutorial</span><span class="lc-sub">A hands-on walkthrough of the default bridge versus user-defined bridges, with the exact commands to prove each behaviour on your own machine.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: wire up a two-tier stack</span><span class="lc-sub">Graded exercises: reach a database by name with nothing published, build a public/private split where the proxy cannot resolve the database, and diagnose a service that resolves but refuses connections.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> a service that works from your laptop and refuses every connection from another container, because it binds to <code>127.0.0.1</code>. It is genuinely confusing the first time: the container is running, the name resolves, the port is right, and the connection is refused instantly. The reason is that loopback inside a network namespace is that namespace's own loopback — reachable from the process itself and from nothing else, ever. Many frameworks default to <code>localhost</code> for safety, which is correct on a shared machine and exactly wrong in a container where the namespace is already the isolation. In a container, bind to <code>0.0.0.0</code> and let the network boundary do the protecting: do not publish the port, and put the service on an <code>--internal</code> network.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Containers on the same user-defined network reach each other by name on the <em>container's</em> port, with nothing published — publishing is only about the host boundary. A container can join several networks, which is how you build a public/private split where a compromised proxy cannot even resolve the database. And when a name resolves but the connection is refused, the service is almost always bound to <code>127.0.0.1</code> inside its own namespace.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.3</span>
<h2>Container nói chuyện với nhau</h2>
<p class="lead">Hai container trên cùng một mạng tự tạo gọi nhau bằng TÊN, ở đúng cổng của container, không cần công bố gì hết. Vế cuối đó làm nhiều người bất ngờ: API của bạn nói chuyện với Postgres ở 5432 dù chẳng có gì công bố ra máy chủ, vì chúng ở cùng cây cầu và cái cổng đó chưa từng bị giấu khỏi MẠNG — nó chỉ bị giấu khỏi MÁY CHỦ.</p>

<h3>Máy chủ DNS nhúng</h3>
${slide('dk-08', 16, 'DNS nhúng 127.0.0.11: hỏi TÊN, nhận IP HIỆN TẠI')}
<pre><code>docker network create shop &gt;/dev/null
docker run -d --name api  --network shop nginx:alpine &gt;/dev/null
docker run -d --name cache --network shop redis:7-alpine &gt;/dev/null
docker exec api cat /etc/resolv.conf
docker exec api sh -c 'getent hosts cache; nc -z cache 6379 &amp;&amp; echo "6379 open"'</code></pre>
<div class="out">nameserver 127.0.0.11
options ndots:0
172.19.0.3      cache
6379 open</div>
<p>Redis không công bố gì cả. Từ máy chủ, <code>nc -z localhost 6379</code> thất bại. Từ <code>api</code>, trên cùng mạng, cổng 6379 đơn giản là đang mở — công bố cổng là chuyện của ranh giới <em>máy chủ</em>, không phải ranh giới giữa các container. Đây là hình dạng đúng cho một dịch vụ backend: với tới được bởi những thứ cần nó, vô hình với mọi thứ khác.</p>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">truy vấn</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">getent hosts cache</span><span class="lz-nsub">Ứng dụng phân giải một cái tên, y như ở bất cứ đâu khác</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">bộ phân giải</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">127.0.0.11 · DNS nhúng</span><span class="lz-nsub">Bộ phân giải của Docker, chỉ tồn tại bên trong namespace, theo từng mạng</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">tên đã biết?</span><span class="lz-nsub">Tên container, network alias, hoặc tên dịch vụ compose trên mạng này</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">trả lời</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">172.19.0.3</span><span class="lz-nsub">Địa chỉ hiện tại — phân giải lại sau mỗi lần khởi động lại, nên không bao giờ cũ</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">không thì → lên trên</span><span class="lz-nsub">Tên lạ được chuyển tiếp lên bộ phân giải của máy chủ, nên DNS công cộng vẫn chạy</span></div></div>
  </div>
</div>

<h3>Chạy thử từng bước: nhìn DNS nhúng làm việc</h3>
<p>"Docker chạy một máy chủ DNS ở 127.0.0.11" nghe như phép màu. Thật ra nó là ba thứ rất bình thường mà bạn soi được từng cái: một dòng trong <code>/etc/resolv.conf</code>, một luật NAT nhỏ BÊN TRONG namespace của container, và một socket do chính <code>dockerd</code> mở. Mọi output dưới đây chạy thật trên máy Mac (tên container trong bài rút gọn, bỏ tiền tố <code>dk08-</code>).</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Bước 1 · ai được hỏi?</span><span class="lz-t">docker exec api grep nameserver /etc/resolv.conf</span><span class="lz-d"><code>nameserver 127.0.0.11</code> — mọi thư viện phân giải tên (glibc, musl, Node, Python) đọc file này.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 2 · hỏi thẳng máy chủ DNS đó</span><span class="lz-t">dig dk08-pg @127.0.0.11 +noall +answer</span><span class="lz-d">Trả bản ghi A kèm TTL 600 giây. <code>@</code> là "hỏi máy chủ này", <code>+noall +answer</code> là "chỉ in phần trả lời".</span></div>
  <div class="lz-step"><span class="lz-k">Bước 3 · ai thật sự nghe?</span><span class="lz-t">nsenter … ss -lntp</span><span class="lz-d">Một socket ở <code>127.0.0.11:&lt;cổng ngẫu nhiên&gt;</code> thuộc tiến trình <code>dockerd</code> — không có container DNS nào cả.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 4 · cổng 53 đi đâu?</span><span class="lz-t">iptables -t nat -S (trong namespace container)</span><span class="lz-d">Hai luật DNAT đổi <code>127.0.0.11:53</code> sang cổng ngẫu nhiên của dockerd — một cho TCP, một cho UDP.</span></div>
</div>
<pre><code class="language-bash">docker run --rm --network shop nicolaka/netshoot dig dk08-pg @127.0.0.11 +noall +answer
docker run --rm --network container:api --cap-add NET_ADMIN nicolaka/netshoot iptables -t nat -S
docker run --rm --network container:api nicolaka/netshoot ss -lnu</code></pre>
<div class="out">dk08-pg.		600	IN	A	172.26.0.4
-P PREROUTING ACCEPT
-P INPUT ACCEPT
-P OUTPUT ACCEPT
-P POSTROUTING ACCEPT
-N DOCKER_OUTPUT
-N DOCKER_POSTROUTING
-A OUTPUT -d 127.0.0.11/32 -j DOCKER_OUTPUT
-A POSTROUTING -d 127.0.0.11/32 -j DOCKER_POSTROUTING
-A DOCKER_OUTPUT -d 127.0.0.11/32 -p tcp -m tcp --dport 53 -j DNAT --to-destination 127.0.0.11:33757
-A DOCKER_OUTPUT -d 127.0.0.11/32 -p udp -m udp --dport 53 -j DNAT --to-destination 127.0.0.11:55869
-A DOCKER_POSTROUTING -s 127.0.0.11/32 -p tcp -m tcp --sport 33757 -j SNAT --to-source :53
-A DOCKER_POSTROUTING -s 127.0.0.11/32 -p udp -m udp --sport 55869 -j SNAT --to-source :53
State  Recv-Q Send-Q Local Address:Port  Peer Address:Port
UNCONN 0      0         127.0.0.11:55869      0.0.0.0:*</div>
<table>
<tr><th>Mẩu</th><th>Nghĩa là</th></tr>
<tr><td><code>--network container:api</code></td><td>Container netshoot dùng CHUNG network namespace với <code>api</code> — thấy đúng bảng NAT và socket của <code>api</code> (Bài 8.4 giải thích kỹ).</td></tr>
<tr><td><code>--cap-add NET_ADMIN</code></td><td>Thêm đúng một quyền: quản trị mạng, đủ để đọc bảng NAT. Nhẹ hơn nhiều so với <code>--privileged</code>.</td></tr>
<tr><td><code>DOCKER_OUTPUT … --dport 53 -j DNAT</code></td><td>Truy vấn gửi tới <code>127.0.0.11:53</code> bị đổi sang <code>127.0.0.11:55869</code> (UDP) — nơi dockerd thật sự nghe.</td></tr>
<tr><td><code>DOCKER_POSTROUTING … SNAT --to-source :53</code></td><td>Câu trả lời đi ra được đổi ngược cổng nguồn về 53, để chương trình hỏi thấy "đúng người" trả lời.</td></tr>
<tr><td><code>ss -lnu</code></td><td>Liệt kê socket UDP đang nghe: đúng một cái, <code>127.0.0.11:55869</code>.</td></tr>
</table>
<p>Còn một chứng cứ nữa ở Bài 8.5: soi bằng <code>nsenter … ss -lntp</code> với quyền xem tiến trình, dòng <code>127.0.0.11:45039</code> hiện rõ <code>users:(("dockerd",pid=286,…))</code>. Và vì dockerd trả lời từ sổ sách của nó chứ không từ file cố định, container khởi động lại vẫn phân giải đúng — <code>docker restart cache</code> xong, <code>getent hosts cache</code> vẫn trả <code>172.26.0.3</code> (IP đó được giữ vì container không bị xoá; tạo container MỚI thì IP có thể đổi, còn TÊN thì không).</p>
<div class="callout"><strong>Redis không công bố gì mà api vẫn gọi được — kiểm lại cho chắc.</strong> <code>docker ps --filter name=cache --format '{{.Ports}}'</code> in <code>6379/tcp</code>: không có dấu <code>-&gt;</code> nghĩa là KHÔNG có cổng nào trên máy chủ. Dạng <code>0.0.0.0:6379-&gt;6379/tcp</code> mới là đã công bố. Trên máy Mac của khoá, <code>nc -z localhost 6379</code> vẫn "succeeded" — nhưng đó là một Redis KHÁC đang công bố 6379 của dự án cũ. Luôn kiểm bằng <code>docker ps</code>, đừng kết luận từ một cổng tình cờ mở.</div>

<h3>Những cái tên một container trả lời</h3>
${slide('dk-08', 17, 'Một container, nhiều tên: tên, alias, tên dịch vụ — và xoay vòng')}
<pre><code>docker run -d --name pg --network shop \\
  --network-alias db --network-alias primary.db \\
  -e POSTGRES_PASSWORD=x postgres:16-alpine &gt;/dev/null
docker exec api sh -c 'for n in pg db primary.db; do printf "%-12s " "$n"; getent hosts "$n" | awk "{print \\$1}"; done'</code></pre>
<div class="out">pg           172.19.0.4
db           172.19.0.4
primary.db   172.19.0.4</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Tên container</span><span class="v">Luôn phân giải được trên mọi mạng tự tạo mà container đó đang gắn vào. Đơn giản nhất, và là thứ compose dùng phía dưới.</span></div>
  <div class="kv"><span class="k">Network alias</span><span class="v">Những cái tên phụ, giới hạn trong một mạng. Hữu ích khi một file cấu hình đóng cứng một hostname bạn không đổi được, hoặc khi bạn muốn <code>db</code> trỏ tới container khác nhau ở staging và production.</span></div>
  <div class="kv"><span class="k">Tên dịch vụ trong compose</span><span class="v">Trong một dự án compose, tên dịch vụ CHÍNH LÀ tên DNS — <code>postgres</code>, không phải <code>myproject-postgres-1</code>. Cả hai đều chạy; cái ngắn là cái bạn đưa vào cấu hình.</span></div>
  <div class="kv"><span class="k">Nhiều container, một alias</span><span class="v">Docker trả về tất cả địa chỉ của chúng và bên gọi chọn một cái, cho ra kiểu xoay vòng thô sơ. Cân bằng tải thật thì cần một proxy; chừng này đủ cho một đội worker.</span></div>
  <div class="kv"><span class="k">Tên lạ đi lên trên</span><span class="v">Bất cứ tên nào bộ phân giải nhúng không biết đều được chuyển tiếp lên DNS của máy chủ, nên <code>api.github.com</code> phân giải bình thường từ bên trong container.</span></div>
</div>

<h3>Xoay vòng bằng alias, và tên dịch vụ trong compose</h3>
<p>Hai container cùng mang một alias thì DNS nhúng trả về CẢ HAI địa chỉ. Chạy thật:</p>
<pre><code class="language-bash">docker run -d --name w1 --network shop --network-alias worker nginx:1.27-alpine
docker run -d --name w2 --network shop --network-alias worker nginx:1.27-alpine
docker run --rm --network shop nicolaka/netshoot dig +short worker</code></pre>
<div class="out">172.26.0.7
172.26.0.6</div>
<p>Bên gọi thường lấy địa chỉ đầu danh sách, và thứ tự có thể xoay giữa các lần hỏi — đó là "xoay vòng thô". Nó KHÔNG biết container nào đang bận hay đã chết, không thử lại; muốn cân bằng tải thật thì đặt một proxy (nginx, Traefik) phía trước.</p>
<p>Compose làm y hệt việc <code>--network-alias</code>: mỗi dịch vụ được một alias đúng bằng TÊN DỊCH VỤ trên mạng <code>&lt;dự-án&gt;_default</code>. Chạy thật với một file hai dịch vụ <code>api</code> và <code>cache</code>, dự án tên <code>dk08-cmp</code>:</p>
<pre><code class="language-bash">docker network ls --filter name=dk08-cmp
docker compose exec api sh -c 'getent hosts cache; getent hosts dk08-cmp-cache-1'</code></pre>
<div class="out">NETWORK ID     NAME               DRIVER    SCOPE
714c4e6b86b2   dk08-cmp_default   bridge    local
172.27.0.2        cache  cache
172.27.0.2        dk08-cmp-cache-1  dk08-cmp-cache-1</div>
<p>Hai tên, một IP. Trong <code>DATABASE_URL</code>/<code>REDIS_URL</code> của app, hãy dùng tên ngắn (<code>cache</code>, <code>db</code>): nó không đổi khi bạn đổi tên thư mục dự án, còn tên container thì có.</p>

<h3>Hình dạng hai tầng bạn thật sự muốn</h3>
${slide('dk-08', 18, 'Mạng hai tầng: proxy bị chiếm cũng không gọi nổi tên CSDL')}
<pre><code>docker network create public &gt;/dev/null
docker network create --internal private &gt;/dev/null

docker run -d --name db     --network private postgres:16-alpine -c listen_addresses='*' &gt;/dev/null
docker run -d --name backend --network private api:1.4.2 &gt;/dev/null
docker network connect public backend                <span class="tok-comment"># backend nằm trên CẢ HAI</span>
docker run -d --name proxy  --network public -p 80:80 -p 443:443 nginx:alpine &gt;/dev/null

<span class="tok-comment"># proxy → backend: được. proxy → db: không có đường nào cả.</span>
docker exec proxy sh -c 'getent hosts backend &amp;&amp; echo backend-ok; getent hosts db || echo "db: not resolvable"'</code></pre>
<div class="out">172.20.0.2      backend
backend-ok
db: not resolvable</div>
<div class="callout ok"><strong>Cái proxy thậm chí không gọi tên được cơ sở dữ liệu.</strong> Không phải "bị chặn" — mà là không phân giải được, không định tuyến được, không có giao diện nào trên mạng đó. Nếu proxy có bị chiếm, cơ sở dữ liệu cũng không nằm cách đó một lệnh <code>nc</code>. Chuyện này tốn thêm một lệnh <code>docker network create</code> và là quyết định cấu trúc tốt nhất trong một hệ triển khai nhỏ; Chương 10 dựng đúng hình dạng đó bằng compose, ở đó nó gọn trong bốn dòng.</div>

<h3>Khi tên phân giải được mà kết nối vẫn hỏng</h3>
${slide('dk-08', 19, 'Tên phân giải được mà vẫn refused: 4 nguyên nhân')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Dịch vụ gắn vào 127.0.0.1 bên trong container của nó</span><span class="lz-t">nguyên nhân phổ biến nhất, bỏ xa các nguyên nhân khác</span><span class="lz-d">Loopback bên trong một namespace chỉ với tới được từ chính namespace đó. Dịch vụ phải nghe ở <code>0.0.0.0</code> — Postgres thì <code>listen_addresses='*'</code>, máy chủ Node thì <code>app.listen(3000, '0.0.0.0')</code>, Next.js thì <code>-H 0.0.0.0</code>.</span></div>
  <div class="lz-step"><span class="lz-k">Khác mạng</span><span class="lz-t">docker inspect -f '{{ json .NetworkSettings.Networks }}'</span><span class="lz-d">Hai container có thể cùng tồn tại, cùng khoẻ mạnh, mà đơn giản là không chung mạng nào. Cái tên sẽ không phân giải được — đó chính là dấu hiệu.</span></div>
  <div class="lz-step"><span class="lz-k">Dịch vụ chưa lên</span><span class="lz-t">connection refused, ngay lập tức</span><span class="lz-d">Một container ở trạng thái "đã khởi động" không đồng nghĩa với việc tiến trình của nó đã nghe. Đây là thứ healthcheck và <code>depends_on: condition: service_healthy</code> giải quyết (Chương 9).</span></div>
  <div class="lz-step"><span class="lz-k">Sai cổng</span><span class="lz-t">bạn dùng cổng công bố trên máy chủ chứ không phải cổng của container</span><span class="lz-d">Giữa các container thì dùng cổng của <em>container</em> — 5432, không phải 5433. Ánh xạ công bố hoàn toàn không liên quan trên mạng nội bộ, và dùng lại nó là lặng lẽ kết nối tới hư không.</span></div>
</div>
<pre><code><span class="tok-comment"># Chứng minh trường hợp loopback, thứ mọi lập trình viên gặp một lần</span>
docker run -d --name lb --network shop python:3.12-alpine \\
  python -c "import http.server as h; h.HTTPServer(('127.0.0.1',8000), h.SimpleHTTPRequestHandler).serve_forever()" &gt;/dev/null
docker exec api sh -c 'nc -z -w2 lb 8000 &amp;&amp; echo open || echo "refused — bound to loopback"'
docker exec lb sh -c 'nc -z -w2 127.0.0.1 8000 &amp;&amp; echo "open from inside"'</code></pre>
<div class="out">refused — bound to loopback
open from inside</div>

<h3>Chạy thử từng bước: bắt quả tang hai nguyên nhân "tên đúng mà refused"</h3>
<p>Hai nguyên nhân đầu trong danh sách trên là hay gặp nhất, và cả hai đều chứng minh được bằng lệnh. <strong>Thứ nhất — nghe nhầm địa chỉ.</strong> Ta cố ý chạy một máy chủ web chỉ nghe <code>127.0.0.1</code> rồi xem từ ba phía:</p>
<pre><code class="language-bash">docker run -d --name lb --network shop python:3.12-alpine \\
  python -c "import http.server as h; h.HTTPServer(('127.0.0.1',8000), h.SimpleHTTPRequestHandler).serve_forever()"
docker exec api sh -c 'wget -qO- -T 3 http://lb:8000/ 2&gt;&amp;1 | head -1'
docker run --rm --network container:lb alpine:3.20 netstat -lnt</code></pre>
<div class="out">wget: can't connect to remote host (172.26.0.5): Connection refused
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        0      0 127.0.0.11:40967        0.0.0.0:*               LISTEN
tcp        0      0 127.0.0.1:8000          0.0.0.0:*               LISTEN</div>
<p>Đọc đúng thứ tự: wget ĐÃ phân giải được <code>lb</code> thành <code>172.26.0.5</code> (DNS không có lỗi gì), kết nối bị từ chối ngay (có "người" trả lời không). Nhìn từ bên trong namespace của <code>lb</code> bằng <code>netstat</code> của BusyBox (có sẵn trong alpine, không cần tải netshoot), dòng <code>127.0.0.1:8000</code> chính là thủ phạm: chỉ nghe loopback, trong khi gói của <code>api</code> tới qua <code>eth0</code>. Dòng <code>127.0.0.11:40967</code> là DNS nhúng vừa gặp ở trên. Sửa: cho ứng dụng nghe <code>0.0.0.0</code> — với ví dụ này là <code>python -m http.server 3000 --bind 0.0.0.0</code>, chạy thật thì <code>nc -z -w2 api 3000</code> in <code>open</code>.</p>
<p><strong>Thứ hai — dịch vụ chưa lên xong.</strong> Postgres là ví dụ kinh điển: lần đầu chạy với volume rỗng, nó khởi tạo CSDL trong vài giây, suốt lúc đó CHỈ nghe socket Unix. Tôi gõ vào nó ngay sau <code>docker run</code> và nhận refused; ba giây sau thử lại thì <code>db-5432-open</code>. <code>docker logs</code> kể lại đúng chuyện đó:</p>
<pre><code class="language-bash">docker logs db 2&gt;&amp;1 | grep "listening on"</code></pre>
<div class="out">2026-09-23 18:41:03.478 UTC [42] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
2026-09-23 18:41:03.686 UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
2026-09-23 18:41:03.686 UTC [1] LOG:  listening on IPv6 address "::", port 5432
2026-09-23 18:41:03.689 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"</div>
<p>Dòng đầu (tiến trình 42) là máy chủ TẠM của giai đoạn khởi tạo — chỉ socket Unix. Ba dòng sau (tiến trình 1) là máy chủ thật, nghe <code>0.0.0.0</code>. Vì vậy "container đang Up" không đồng nghĩa "cổng đã mở"; healthcheck + <code>depends_on: condition: service_healthy</code> ở Chương 9 là cách chờ cho đúng.</p>
<table>
<tr><th></th><th>Cổng CONTAINER</th><th>Cổng CÔNG BỐ</th></tr>
<tr><td>Ví dụ</td><td><code>5432</code> trong <code>-p 5433:5432</code></td><td><code>5433</code> trong <code>-p 5433:5432</code></td></tr>
<tr><td>Ai dùng</td><td>Container khác trên cùng mạng: <code>db:5432</code></td><td>Máy chủ và máy ngoài: <code>localhost:5433</code></td></tr>
<tr><td>Luôn tồn tại?</td><td>Có — ứng dụng nghe là có</td><td>Chỉ khi bạn <code>-p</code></td></tr>
<tr><td>Dùng nhầm thì</td><td>—</td><td>Gọi <code>db:5433</code> từ container ⇒ refused (bên trong không ai nghe 5433)</td></tr>
</table>

<h3>--link đã chết, và thứ thay thế nó tốt hơn</h3>
${slide('dk-08', 20, '--link đã chết: Docker 29 cảnh báo, và từ chối trên mạng tự tạo')}
<pre><code><span class="tok-comment"># Docker 29: cache nằm trên mạng tự tạo "shop" ⇒ bị từ chối thẳng</span>
docker run -d --name old --link cache:redis alpine:3.20 sleep 60</code></pre>
<div class="out">WARNING: Links on the default bridge network are deprecated and will be removed in a future release. Use a custom network instead.
4ba3953382627d110d3ef5cb60f0720398b04cb3dab5d106cdd123ba5ae41233
docker: Error response from daemon: container f744043b04b49e0dc39a76aee465f51b9098a293a2b019f9d6d8b3026dab501d not attached to default bridge network</div>
<pre><code><span class="tok-comment"># trên bridge mặc định thì vẫn chạy, kèm cảnh báo — web nằm trên docker0</span>
docker run -d --name old2 --link web:web alpine:3.20 sleep 60
docker exec old2 grep web /etc/hosts</code></pre>
<div class="out">WARNING: Links on the default bridge network are deprecated and will be removed in a future release. Use a custom network instead.
ad0388c2da87…
172.17.0.10	web 66b55bdbace9 dk08-web</div>
<p>Output thật trên máy Mac, Engine 29.8. Lời cảnh báo đã đổi, và ví dụ cũ giờ còn không khởi động nổi: Docker tạo container rồi từ chối chạy nó vì <code>cache</code> nằm trên mạng tự tạo — nơi "link" không tồn tại. Trên bridge mặc định thì link vẫn chạy, và nó chỉ làm đúng một việc: ghi một dòng vào <code>/etc/hosts</code>.</p>
<p><code>--link</code> ghi các mục vào <code>/etc/hosts</code> lúc container khởi động. Nghĩa là một container khởi động lại sẽ giữ một địa chỉ đã cũ, liên kết chỉ chạy theo MỘT chiều, và chúng chỉ chạy trên bridge mặc định. Mạng tự tạo thay toàn bộ chuyện đó bằng DNS thật có phân giải lại. Nếu bạn gặp <code>--link</code> trong một bài hướng dẫn cũ hay một script thừa kế, thay nó bằng một cái mạng là thay đổi máy móc và luôn luôn là cải thiện.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> container frontend của nhóm gọi <code>http://api:3000</code> và nhận <code>ECONNREFUSED</code>, dù ai cũng thề "tên đúng rồi, cùng mạng rồi". Bạn chứng minh từng tầng bằng lệnh, tìm ra thủ phạm, sửa, và đặt alias <code>api</code> cho đúng tên mà frontend đang gọi.</p><ol>
<li><code>docker network create thu-shop</code>, rồi chạy "API lỗi": <code>docker run -d --name thu-api --network thu-shop python:3.12-alpine python -m http.server 3000 --bind 127.0.0.1</code>.</li>
<li>Giả làm frontend: <code>docker run --rm --network thu-shop alpine:3.20 sh -c 'getent hosts thu-api; nc -z -w2 thu-api 3000 &amp;&amp; echo open || echo refused'</code>. Tầng nào ổn, tầng nào hỏng?</li>
<li>Nhìn từ bên trong API: <code>docker run --rm --network container:thu-api alpine:3.20 netstat -lnt</code>. Chép dòng có <code>:3000</code>.</li>
<li>Sửa: <code>docker rm -f thu-api</code>, chạy lại với <code>--bind 0.0.0.0</code> và thêm <code>--network-alias api</code>. Lặp lại bước 2 nhưng gọi <code>api</code> thay cho <code>thu-api</code>.</li>
<li>Dọn: <code>docker rm -f thu-api; docker network rm thu-shop</code>.</li></ol>
<pre><code class="language-bash">docker run --rm --network thu-shop alpine:3.20 sh -c 'getent hosts api; nc -z -w2 api 3000 &amp;&amp; echo open || echo refused'</code></pre>
<div class="out">172.26.0.10       api  api
open</div>
<p><strong>Đạt khi:</strong> bước 2 in ra một IP rồi <code>refused</code> (DNS ổn, kết nối hỏng); bước 3 cho thấy <code>127.0.0.1:3000</code>; sau khi sửa, gọi bằng alias <code>api</code> in <code>open</code> — và bạn giải thích được vì sao KHÔNG cần <code>-p</code> ở bất kỳ bước nào.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Embedded DNS (DNS nhúng)</span><span class="v">Máy chủ DNS do dockerd giữ ở <code>127.0.0.11</code> trong mỗi container trên mạng tự tạo.</span></div>
  <div class="kv"><span class="k">Service discovery (khám phá dịch vụ)</span><span class="v">Cách các dịch vụ tìm thấy nhau bằng tên thay vì IP cố định — ở đây do DNS nhúng làm.</span></div>
  <div class="kv"><span class="k">Network alias (tên phụ trên mạng)</span><span class="v">Tên DNS thêm cho container, chỉ có hiệu lực trên một mạng; compose tự đặt alias bằng tên dịch vụ.</span></div>
  <div class="kv"><span class="k">Round-robin DNS (xoay vòng DNS)</span><span class="v">Một tên trả nhiều IP để bên gọi rải yêu cầu; thô, không kiểm sức khoẻ.</span></div>
  <div class="kv"><span class="k">Listen address (địa chỉ lắng nghe)</span><span class="v">IP mà ứng dụng mở cổng: <code>127.0.0.1</code> chỉ trong namespace đó, <code>0.0.0.0</code> mọi card.</span></div>
  <div class="kv"><span class="k">Connection refused (bị từ chối)</span><span class="v">Gói tới nơi nhưng không ai nghe cổng đó — nhân trả gói RST ngay lập tức.</span></div>
  <div class="kv"><span class="k">TTL (thời gian sống)</span><span class="v">Số giây một câu trả lời DNS được phép nhớ; DNS nhúng trả 600.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Trên mạng tự tạo, container gọi nhau bằng TÊN ở cổng CONTAINER; không cần và không nên <code>-p</code>.</li>
<li>DNS nhúng = dòng <code>nameserver 127.0.0.11</code> + luật NAT trong namespace + socket của dockerd; tên lạ được hỏi tiếp máy chủ.</li>
<li>Một container có thể có nhiều tên: tên, <code>--network-alias</code>, tên dịch vụ compose; cùng alias ⇒ DNS trả mọi IP (xoay vòng thô).</li>
<li>Mạng hai tầng (public + <code>--internal</code>): proxy không phân giải nổi tên CSDL, CSDL không ra được Internet.</li>
<li>"Tên đúng mà refused": dịch vụ nghe <code>127.0.0.1</code>, dịch vụ chưa lên xong, hoặc dùng nhầm cổng công bố.</li>
<li><code>--link</code> đã lỗi thời: Docker 29 cảnh báo trên bridge mặc định và từ chối khi đích nằm trên mạng tự tạo.</li>
</ul>


<a class="link-card" href="https://docs.docker.com/engine/network/#dns-services" target="_blank" rel="noopener">
  <span class="lc-ico">🔎</span>
  <span class="lc-body"><span class="lc-title">Docker docs — Dịch vụ DNS</span><span class="lc-sub">Bộ phân giải nhúng ở <code>127.0.0.11</code> hoạt động ra sao, nó chuyển tiếp gì lên trên, và cách ghi đè bằng <code>--dns</code> với <code>--dns-search</code> khi bạn cần một bộ phân giải cụ thể.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/network/tutorials/standalone/" target="_blank" rel="noopener">
  <span class="lc-ico">🧭</span>
  <span class="lc-body"><span class="lc-title">Hướng dẫn mạng độc lập</span><span class="lc-sub">Một bài đi từng bước qua bridge mặc định so với bridge tự tạo, kèm đúng những lệnh để tự chứng minh từng hành vi trên máy bạn.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: nối một stack hai tầng</span><span class="lc-sub">Bài chấm điểm: gọi tới một cơ sở dữ liệu bằng tên mà không công bố gì, dựng một tách công khai/nội bộ trong đó proxy không phân giải nổi tên cơ sở dữ liệu, và chẩn đoán một dịch vụ phân giải được mà từ chối kết nối.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> một dịch vụ chạy được từ máy bạn mà từ chối mọi kết nối từ container khác, vì nó gắn vào <code>127.0.0.1</code>. Lần đầu gặp thì đúng là rối thật: container đang chạy, tên phân giải được, cổng đúng, mà kết nối bị từ chối tức thì. Lý do là loopback bên trong một network namespace chính là loopback riêng của namespace đó — với tới được từ chính tiến trình ấy và từ không gì khác, mãi mãi. Nhiều framework mặc định <code>localhost</code> cho an toàn, điều đó đúng trên một cái máy dùng chung và sai hoàn toàn trong container, nơi chính cái namespace đã là sự cách ly. Trong container, hãy gắn vào <code>0.0.0.0</code> rồi để ranh giới mạng lo phần bảo vệ: đừng công bố cổng, và đặt dịch vụ lên một mạng <code>--internal</code>.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Container trên cùng mạng tự tạo gọi nhau bằng tên ở cổng của <em>container</em>, không cần công bố gì — công bố chỉ là chuyện ranh giới máy chủ. Một container vào được nhiều mạng, và đó là cách bạn dựng tách công khai/nội bộ để một proxy bị chiếm cũng không phân giải nổi tên cơ sở dữ liệu. Và khi tên phân giải được mà kết nối bị từ chối, gần như luôn luôn là dịch vụ đang gắn vào <code>127.0.0.1</code> bên trong namespace của chính nó.</p>
</div>
`,
    },
    /* ─────────────────────────── 8.4 ─────────────────────────── */
    {
      title: '8.4 — localhost, the host, and --network host|||8.4 — localhost, máy chủ, và --network host',
      slug: 'dk-8-4-toi-may-chu',
      type: 'LESSON',
      description: 'Vì sao localhost trong container không phải localhost của bạn, host.docker.internal và host-gateway, khi nào dùng --network host, chế độ mạng chung với một container khác, và IPv6.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.4</span>
<h2>localhost, the host, and --network host</h2>
<p class="lead">"Connection refused to localhost" is the single most reported Docker problem, and it always has the same cause: <code>localhost</code> inside a container is that container's own loopback interface. It is not your machine, not the host, and not any other container. Once that clicks, the three ways of reaching outward — to the host, to another container's stack, or by dropping the namespace entirely — are straightforward.</p>

<h3>Four different things called localhost</h3>
${slide('dk-08', 21, 'Bốn chữ localhost, bốn nơi khác nhau')}
<div class="kv-grid">
  <div class="kv"><span class="k">In your terminal</span><span class="v">The host's loopback. Reaches anything the host itself is listening on, plus every port Docker has published.</span></div>
  <div class="kv"><span class="k">Inside container A</span><span class="v">Container A's loopback, and nothing else. A service in container B is not on it. Neither is anything on the host.</span></div>
  <div class="kv"><span class="k">In a browser on your laptop</span><span class="v">Your laptop's loopback. If the container runs on a remote VPS, this reaches nothing at all — a surprisingly common confusion when following a tutorial written for a local machine.</span></div>
  <div class="kv"><span class="k">Inside a <code>--network host</code> container</span><span class="v">The host's loopback, genuinely — because there is no separate namespace. This is the only case where the two meanings coincide.</span></div>
</div>
<pre><code><span class="tok-comment"># A database on the HOST, not in Docker</span>
sudo ss -lntp 'sport = :5432' | tail -1
docker run --rm postgres:16-alpine psql -h localhost -U postgres -c 'select 1' 2&gt;&amp;1 | tail -2</code></pre>
<div class="out">LISTEN 0 244 127.0.0.1:5432 0.0.0.0:* users:(("postgres",pid=1188,fd=6))
psql: error: connection to server at "localhost" (127.0.0.1), port 5432 failed:
Connection refused</div>

<h3>Reaching the host from a container</h3>
${slide('dk-08', 22, 'host.docker.internal: Mac có sẵn — Linux phải tự thêm')}
<pre><code><span class="tok-comment"># Portable across Linux, macOS and Windows since Docker 20.10</span>
docker run --rm --add-host=host.docker.internal:host-gateway alpine:3.20 \\
  sh -c 'getent hosts host.docker.internal'</code></pre>
<div class="out">172.17.0.1      host.docker.internal</div>
<pre><code><span class="tok-comment"># In compose, the same thing</span>
services:
  api:
    extra_hosts:
      - "host.docker.internal:host-gateway"</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">host.docker.internal + host-gateway</span><span class="lz-t">the portable answer</span><span class="lz-d">Docker Desktop provides the name automatically; on Linux you add it with <code>--add-host</code>. One name that works everywhere, so the same compose file runs on a Mac and on a Linux CI runner.</span></div>
  <div class="lz-step"><span class="lz-k">The bridge gateway address</span><span class="lz-t">172.17.0.1, or whatever the network's gateway is</span><span class="lz-d">Works on Linux with no extra flags, but the address changes per network and per host, so it belongs in an experiment, not in a config file.</span></div>
  <div class="lz-step"><span class="lz-k">The service must listen on 0.0.0.0</span><span class="lz-t">a host service bound to 127.0.0.1 is still unreachable</span><span class="lz-d">The container arrives via the bridge interface, not via loopback. Postgres on <code>127.0.0.1:5432</code> refuses it, exactly as it refuses any other machine.</span></div>
  <div class="lz-step"><span class="lz-k">Better: put the service in a container too</span><span class="lz-t">then it is just a name on a network</span><span class="lz-d">Reaching back into the host is a bridge between two worlds, and it is worth avoiding when the alternative is one more service in the compose file.</span></div>
</div>
<pre><code><span class="tok-comment"># Same database, now reachable — because it listens on all interfaces</span>
sudo ss -lntp 'sport = :5432' | tail -1
docker run --rm --add-host=host.docker.internal:host-gateway postgres:16-alpine \\
  psql -h host.docker.internal -U postgres -c 'select 1' 2&gt;/dev/null | head -3</code></pre>
<div class="out">LISTEN 0 244 0.0.0.0:5432 0.0.0.0:* users:(("postgres",pid=1188,fd=6))
 ?column?
----------
        1</div>

<div class="callout warn"><strong>The "must listen on 0.0.0.0" step above is true on LINUX only.</strong> On Docker Desktop (Mac), <code>host.docker.internal</code> reaches even a service that listens only on the Mac's <code>127.0.0.1</code> — measured right below. This is one of the most common "works on my machine, fails on the VPS" differences.</div>

<h3>Run it step by step on BOTH machines: call a host service from a container</h3>
<p>The test service is a tiny web server running directly on the machine (no Docker): <code>python3 -m http.server</code> serving an <code>index.html</code> with a greeting. The same sequence runs on the Mac and then on the Linux machine:</p>
<pre><code class="language-bash"><span class="tok-comment"># terminal 1 — service on the host, loopback ONLY</span>
echo "xin chao tu may Mac" &gt; index.html
python3 -m http.server --bind 127.0.0.1 18089

<span class="tok-comment"># terminal 2 — on the MAC</span>
docker run --rm alpine:3.20 getent hosts host.docker.internal
docker run --rm alpine:3.20 wget -qO- -T 3 http://localhost:18089/
docker run --rm alpine:3.20 wget -qO- -T 3 http://host.docker.internal:18089/
docker run --rm --add-host=host.docker.internal:host-gateway alpine:3.20 grep host.docker /etc/hosts</code></pre>
<div class="out">192.168.65.254    host.docker.internal  host.docker.internal
wget: can't connect to remote host: Connection refused
xin chao tu may Mac
192.168.65.254	host.docker.internal
fdc4:f303:9324::254	host.docker.internal</div>
<pre><code class="language-bash"><span class="tok-comment"># terminal 2 — on LINUX (the service still listens only on 127.0.0.1:18089)</span>
docker run --rm alpine getent hosts host.docker.internal; echo "exit \$?"
docker run --rm --add-host=host.docker.internal:host-gateway alpine getent hosts host.docker.internal
docker run --rm --add-host=host.docker.internal:host-gateway alpine wget -qO- -T 3 http://host.docker.internal:18089/
<span class="tok-comment"># switch the service to: python3 -m http.server --bind 0.0.0.0 18089, then rerun the line above</span></code></pre>
<div class="out">exit 2
172.17.0.1        host.docker.internal  host.docker.internal
wget: can't connect to remote host (172.17.0.1): Connection refused
xin chao tu may Linux</div>
<table>
<tr><th></th><th>Mac · Docker Desktop 4.91</th><th>Linux · Engine 29.6</th></tr>
<tr><td><code>host.docker.internal</code> built in?</td><td>+Yes: <code>192.168.65.254</code></td><td>-No (<code>getent</code> exit 2)</td></tr>
<tr><td>With <code>--add-host=…:host-gateway</code></td><td><code>192.168.65.254</code> + an IPv6 address</td><td><code>172.17.0.1</code> — the <code>docker0</code> bridge IP</td></tr>
<tr><td>Service listening on <code>127.0.0.1</code> only</td><td>+Reachable (Docker Desktop forwards to the Mac's loopback)</td><td>-Refused: packets arrive via <code>docker0</code>, not loopback</td></tr>
<tr><td>Service listening on <code>0.0.0.0</code></td><td>+Reachable</td><td>+Reachable</td></tr>
</table>
<table>
<tr><th>Piece</th><th>Meaning</th></tr>
<tr><td><code>--add-host=NAME:IP</code></td><td>Adds an <code>IP NAME</code> line to the container's <code>/etc/hosts</code>. Not DNS — just the hosts file.</td></tr>
<tr><td><code>host-gateway</code></td><td>A special value Docker replaces with "the host as seen from the container" — on Linux, the default bridge's IP.</td></tr>
<tr><td><code>extra_hosts:</code> (compose)</td><td>The same flag written in compose — one line that works on both Mac and Linux.</td></tr>
</table>
<p>The lesson for a group project: if you develop on a Mac using <code>host.docker.internal</code> to reach a natively installed service, then move to a Linux VPS, remember two things — add <code>extra_hosts</code>, and make that service listen on <code>0.0.0.0</code> (or <code>172.17.0.1</code>) behind a firewall. More robust still: put that service into the compose file. On Windows, Docker Desktop also provides <code>host.docker.internal</code> according to Docker's documentation; the course has not measured Windows, so run these three commands on your teammate's machine to know for sure.</p>

<h3>--network host: no namespace at all</h3>
${slide('dk-08', 23, '--network host: bỏ hẳn namespace — được gì, mất gì')}
<pre><code><span class="tok-comment"># real output on the Linux machine; BusyBox ip has no -brief</span>
docker run --rm --network host alpine sh -c 'ip -o -4 addr | awk "{print \\$2, \\$4}" | head -5'
<span class="tok-comment"># a host service listening on 127.0.0.1:18089 (python3 -m http.server)</span>
docker run --rm --network host alpine wget -qO- -T 3 http://127.0.0.1:18089/</code></pre>
<div class="out">lo 127.0.0.1/8
enp3s0 192.168.1.102/24
tailscale0 100.98.11.81/32
br-4759f6ff2323 172.28.0.1/24
docker0 172.17.0.1/16
xin chao tu may Linux</div>
<div class="kv-grid">
  <div class="kv"><span class="k">What you gain</span><span class="v">No NAT, no veth pair, no port publishing. Marginally lower latency, and the ability to bind low ports or use protocols that NAT breaks — mDNS, DHCP, some VPN and VoIP software.</span></div>
  <div class="kv"><span class="k">What you lose</span><span class="v">All network isolation. <code>-p</code> is ignored with a warning. Two containers cannot both bind 8080. And a compromised container is on your host's network with your host's interfaces.</span></div>
  <div class="kv"><span class="k">Not the same on Docker Desktop</span><span class="v">On macOS and Windows, "the host" is the Linux VM, not your laptop. Host networking there behaves differently and has only recently worked at all — do not build a workflow on it.</span></div>
  <div class="kv"><span class="k">When it is genuinely right</span><span class="v">A monitoring agent that must see the host's interfaces, a load balancer handling tens of thousands of connections where NAT is measurable, or software that needs broadcast/multicast. Otherwise: a published port.</span></div>
</div>
<pre><code><span class="tok-comment"># -p is silently ignored in host mode — note the warning</span>
docker run --rm --network host -p 8080:80 nginx:alpine nginx -t 2&gt;&amp;1 | head -2</code></pre>
<div class="out">WARNING: Published ports are discarded when using host network mode
nginx: configuration file /etc/nginx/nginx.conf test is successful</div>

<h3>Try it: localhost under --network host is not always 127.0.0.1</h3>
<p>In the command above I deliberately typed <code>127.0.0.1</code>, not <code>localhost</code>. Here is why, measured on the Linux machine with the service listening only on <code>127.0.0.1:18089</code>:</p>
<pre><code class="language-bash">docker run --rm --network host alpine wget -qO- -T 3 http://localhost:18089/
docker run --rm --network host alpine wget -qO- -T 3 http://127.0.0.1:18089/
docker run --rm --network host alpine getent hosts localhost</code></pre>
<div class="out">wget: can't connect to remote host: Connection refused
xin chao tu may Linux
::1               localhost  localhost</div>
<p>In an alpine image, <code>localhost</code> resolves to <code>::1</code> (IPv6 loopback) FIRST. The service listens only on IPv4 <code>127.0.0.1</code>, so the connection to <code>::1</code> is refused — which looks exactly like "--network host does not work". Node 17 and later often trips over the same thing, because it keeps the address order the operating system returns. When in doubt, type <code>127.0.0.1</code>.</p>
<p>Two more real observations: <code>docker run --rm --network host alpine hostname</code> prints <code>CuongThai</code> — the Linux machine's own name, because the container shares the machine's name too; and on the Mac, the same <code>wget http://127.0.0.1:18089/</code> with <code>--network host</code> gets <code>Connection refused</code>: "host" there is Docker Desktop's Linux VM, not the Mac.</p>
<table>
<tr><th>Use <code>--network host</code> when…</th><th>DON'T use it when…</th></tr>
<tr><td>A monitoring agent must see the machine's real NICs (node-exporter, network tools)</td><td>Only to "fix" a connection bug you have not diagnosed</td></tr>
<tr><td>Software needs broadcast/multicast (mDNS, DHCP, some game servers)</td><td>You run several copies on the same port (two containers cannot both hold 8080)</td></tr>
<tr><td>NAT is measurably the bottleneck (tens of thousands of connections per second)</td><td>On Docker Desktop, expecting it to behave like Linux</td></tr>
<tr><td>A helper container only READS the machine's network state (as in Lesson 8.2)</td><td>Running code you do not trust: it sits on the host's network</td></tr>
</table>

<h3>Sharing another container's network</h3>
${slide('dk-08', 24, '--network container:app — mượn đôi mắt của chính app')}
<pre><code><span class="tok-comment"># The debug container joins the app's namespace: same interfaces, same localhost</span>
docker run -d --name app -p 3000:3000 api:1.4.2 &gt;/dev/null
docker run --rm --network container:app nicolaka/netshoot \\
  sh -c 'ss -lntp; curl -s -o /dev/null -w "%{http_code}\\n" http://localhost:3000/health'</code></pre>
<div class="out">State  Recv-Q Send-Q Local Address:Port Peer Address:Port
LISTEN 0      511          0.0.0.0:3000      0.0.0.0:*
200</div>
<p>This is the single most useful debugging technique in this chapter, and Lesson 8.5 leans on it heavily. The <code>netshoot</code> container has <code>curl</code>, <code>dig</code>, <code>tcpdump</code>, <code>ss</code> and forty other tools, and <code>--network container:app</code> puts all of them <em>inside the app's network namespace</em> — so <code>localhost</code> means the app's localhost, and you can watch its traffic without adding a single byte to the application image. It is also how sidecar patterns work in Kubernetes pods.</p>

<p>Real run on the Mac, with the "app" being a Python web server listening on <code>0.0.0.0:3000</code>:</p>
<pre><code class="language-bash">docker run -d --name app --network shop -p 127.0.0.1:18081:3000 python:3.12-alpine python -m http.server 3000
docker run --rm --network container:app nicolaka/netshoot sh -c 'ss -lntp; curl -s -o /dev/null -w "%{http_code}\\n" http://localhost:3000/'
docker run --rm --network container:app nicolaka/netshoot hostname
docker exec app hostname</code></pre>
<div class="out">State  Recv-Q Send-Q Local Address:Port  Peer Address:PortProcess
LISTEN 0      4096      127.0.0.11:46591      0.0.0.0:*
LISTEN 0      5            0.0.0.0:3000       0.0.0.0:*
200
4d08dd240b48
4d08dd240b48</div>
<p>Three things to read: netshoot sees exactly the app's socket (<code>0.0.0.0:3000</code>) and the embedded DNS socket (<code>127.0.0.11:46591</code>); netshoot's <code>localhost:3000</code> IS the app (<code>200</code>); and both have the SAME hostname — Docker lets the "guest" container share the host name too. The <code>Process</code> column is empty because netshoot cannot see another container's processes (the PID namespace is still separate); for process names, use the <code>nsenter</code> approach in Lesson 8.5.</p>

<h3>IPv6, briefly</h3>
<pre><code>docker network create --ipv6 --subnet 2001:db8:1::/64 v6net &gt;/dev/null
docker run --rm --network v6net alpine:3.20 ip -6 -o addr show eth0
docker run --rm --network v6net alpine:3.20 ip -o addr show eth0 | awk '{print \$3, \$4}'</code></pre>
<div class="out">11: eth0    inet6 2001:db8:1::2/64 scope global flags 02 \\       valid_lft forever preferred_lft forever
11: eth0    inet6 fe80::b85c:adff:febc:f186/64 scope link tentative \\       valid_lft forever preferred_lft forever
inet 172.27.0.2/16
inet6 2001:db8:1::2/64
inet6 fe80::642f:daff:fee4:22b3/64</div>
<p>Real output on the Mac (Engine 29.8). Two corrections to the earlier version: BusyBox's <code>ip</code> does not understand <code>-brief</code>, so use <code>-o</code>; and Docker 29 gives the container BOTH IPv4 (<code>172.27.0.2</code>) and IPv6 on an <code>--ipv6</code> network — not IPv6 alone.</p>
<p>IPv6 is off by default on Docker networks and enabled per network (or globally in <code>daemon.json</code>). The common symptom of ignoring it is an application that resolves a hostname to an AAAA record, tries to connect over IPv6, and hangs until a timeout before falling back — slow, intermittent, and mystifying. If a container has inexplicable multi-second delays on outbound requests, check whether it is getting AAAA answers it cannot use.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> you run a dev server directly on your machine (no Docker), and a container — say the team's Playwright test suite — must call it. Inside the container, <code>localhost:8000</code> is refused. Find the right way to call it, and record the behaviour on your machine so the whole team (Mac, Windows, Linux) knows what differs.</p><ol>
<li>Terminal 1: <code>mkdir -p ~/thu-docker/www &amp;&amp; cd ~/thu-docker/www &amp;&amp; echo "chao nhom" &gt; index.html &amp;&amp; python3 -m http.server --bind 127.0.0.1 8000</code>.</li>
<li>Terminal 2: <code>docker run --rm alpine:3.20 wget -qO- -T 3 http://localhost:8000/</code>. Explain the refusal in one sentence.</li>
<li>Terminal 2: <code>docker run --rm --add-host=host.docker.internal:host-gateway alpine:3.20 wget -qO- -T 3 http://host.docker.internal:8000/</code>. Record the result.</li>
<li>If step 3 was refused (Linux): stop the service (<code>Ctrl+C</code>), restart it with <code>--bind 0.0.0.0</code>, repeat step 3.</li>
<li>Terminal 2: <code>docker run --rm --network host alpine:3.20 wget -qO- -T 3 http://127.0.0.1:8000/</code>. Record the result, then <code>Ctrl+C</code> the service.</li></ol>
<p><strong>Done when:</strong> you can fill a three-row table (localhost · host.docker.internal · --network host) for your machine that matches the Mac/Linux table above: a Mac gets <code>chao nhom</code> straight away at step 3 and refused at step 5; Linux needs step 4 before step 3 works, and step 5 works.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Loopback</span><span class="v"><code>127.0.0.1</code>/<code>::1</code>: addresses that lead back to the namespace you stand in — inside a container, the container itself.</span></div>
  <div class="kv"><span class="k">host.docker.internal</span><span class="v">A name pointing at the host as seen from a container: built into Docker Desktop, added with <code>--add-host</code> on Linux.</span></div>
  <div class="kv"><span class="k">host-gateway</span><span class="v">A special value for <code>--add-host</code>/<code>extra_hosts</code> that Docker replaces with the host's address (Linux: <code>172.17.0.1</code>).</span></div>
  <div class="kv"><span class="k">/etc/hosts</span><span class="v">A name → IP table consulted BEFORE DNS; <code>--add-host</code> writes into it.</span></div>
  <div class="kv"><span class="k">--network host</span><span class="v">No separate network namespace: the container uses the host's NICs, ports and localhost directly.</span></div>
  <div class="kv"><span class="k">--network container:X</span><span class="v">The new container joins X's network namespace: same IP, same localhost, same hostname.</span></div>
  <div class="kv"><span class="k">Sidecar</span><span class="v">A helper container running beside the app on its network — how Kubernetes pods attach logging, proxies and debugging.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>localhost</code> inside a container is that container — not the host, not another container.</li>
<li>To reach the host: <code>host.docker.internal</code>; built into Docker Desktop, on Linux add <code>--add-host=host.docker.internal:host-gateway</code> (compose: <code>extra_hosts</code>).</li>
<li>On Linux the host service must listen on <code>0.0.0.0</code> (or the bridge IP); on a Mac, Docker Desktop reaches even <code>127.0.0.1</code> — a difference that breaks deploys to a VPS.</li>
<li><code>--network host</code> drops the namespace: <code>-p</code> is discarded, isolation is gone; on a Mac "host" is the VM.</li>
<li>In alpine, <code>localhost</code> resolves to <code>::1</code> first — an IPv4-only service refuses; type <code>127.0.0.1</code> when in doubt.</li>
<li><code>--network container:app</code> lets a debugging tool see through the app's eyes without touching the app image.</li>
</ul>


<a class="link-card" href="https://docs.docker.com/engine/network/drivers/host/" target="_blank" rel="noopener">
  <span class="lc-ico">🖥️</span>
  <span class="lc-body"><span class="lc-title">Docker docs — Host networking</span><span class="lc-sub">What host mode does and does not do on each platform, including the Docker Desktop caveats, and the specific cases where it is the right choice.</span></span>
</a>
<a class="link-card" href="https://github.com/nicolaka/netshoot" target="_blank" rel="noopener">
  <span class="lc-ico">🥾</span>
  <span class="lc-body"><span class="lc-title">netshoot — the network debugging image</span><span class="lc-sub">The tool list alone is worth reading: <code>dig</code>, <code>tcpdump</code>, <code>iperf</code>, <code>ss</code>, <code>mtr</code>, <code>nmap</code>, <code>drill</code>. The README shows the <code>--network container:</code> pattern used above.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: reach outward correctly</span><span class="lc-sub">Graded exercises: connect from a container to a service on the host, explain why the same command fails when the host service binds to loopback, and use <code>--network container:</code> to inspect a running app's sockets.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> reaching for <code>--network host</code> to "fix" a connection problem. It does often make the immediate error go away, which is exactly what makes it dangerous: you have removed the isolation instead of finding the cause, and the real bug — a service bound to <code>127.0.0.1</code>, two containers on different networks, a port mapping written backwards — is still there, now hidden. It also does not scale: the second container that wants port 8080 cannot start, <code>-p</code> stops working, and on Docker Desktop the behaviour differs from Linux, so the workaround that fixed your laptop breaks CI. Spend the two minutes on <code>docker network inspect</code> and <code>ss -lntp</code> instead; the cause is almost always one of the four in Lesson 8.3.</div>
<p class="note-ct"><strong>Three things to remember.</strong> <code>localhost</code> inside a container is that container's own loopback — never the host, never another container. To reach a service on the host, add <code>--add-host=host.docker.internal:host-gateway</code> <em>and</em> make sure that service listens on <code>0.0.0.0</code>. And <code>--network container:&lt;name&gt;</code> puts a debugging container inside another's network namespace, which is the most useful diagnostic move you will learn in this chapter.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.4</span>
<h2>localhost, máy chủ, và --network host</h2>
<p class="lead">"Connection refused tới localhost" là vấn đề Docker được báo nhiều nhất, và nó luôn có cùng một nguyên nhân: <code>localhost</code> bên trong container là giao diện loopback của CHÍNH container đó. Nó không phải máy bạn, không phải máy chủ, và không phải container nào khác. Khi điều đó vỡ ra rồi thì ba cách với ra ngoài — tới máy chủ, tới ngăn xếp của một container khác, hoặc bỏ hẳn namespace đi — đều rõ ràng.</p>

<h3>Bốn thứ khác nhau cùng tên localhost</h3>
${slide('dk-08', 21, 'Bốn chữ localhost, bốn nơi khác nhau')}
<div class="kv-grid">
  <div class="kv"><span class="k">Trong terminal của bạn</span><span class="v">Loopback của máy chủ. Với tới được mọi thứ chính máy chủ đang nghe, cộng với mọi cổng Docker đã công bố.</span></div>
  <div class="kv"><span class="k">Bên trong container A</span><span class="v">Loopback của container A, và không gì khác. Một dịch vụ trong container B không nằm trên đó. Thứ gì trên máy chủ cũng vậy.</span></div>
  <div class="kv"><span class="k">Trong trình duyệt trên máy cá nhân</span><span class="v">Loopback của máy cá nhân bạn. Nếu container chạy trên một con VPS ở xa thì nó chẳng với tới gì cả — một nhầm lẫn hay gặp đến bất ngờ khi làm theo bài hướng dẫn viết cho máy cục bộ.</span></div>
  <div class="kv"><span class="k">Bên trong container <code>--network host</code></span><span class="v">Đúng là loopback của máy chủ thật — vì không có namespace riêng nào cả. Đây là trường hợp duy nhất hai nghĩa đó trùng nhau.</span></div>
</div>
<pre><code><span class="tok-comment"># Một cơ sở dữ liệu trên MÁY CHỦ, không nằm trong Docker</span>
sudo ss -lntp 'sport = :5432' | tail -1
docker run --rm postgres:16-alpine psql -h localhost -U postgres -c 'select 1' 2&gt;&amp;1 | tail -2</code></pre>
<div class="out">LISTEN 0 244 127.0.0.1:5432 0.0.0.0:* users:(("postgres",pid=1188,fd=6))
psql: error: connection to server at "localhost" (127.0.0.1), port 5432 failed:
Connection refused</div>

<h3>Với tới máy chủ từ trong container</h3>
${slide('dk-08', 22, 'host.docker.internal: Mac có sẵn — Linux phải tự thêm')}
<pre><code><span class="tok-comment"># Chạy được trên Linux, macOS và Windows kể từ Docker 20.10</span>
docker run --rm --add-host=host.docker.internal:host-gateway alpine:3.20 \\
  sh -c 'getent hosts host.docker.internal'</code></pre>
<div class="out">172.17.0.1      host.docker.internal</div>
<pre><code><span class="tok-comment"># Trong compose, cũng thứ đó</span>
services:
  api:
    extra_hosts:
      - "host.docker.internal:host-gateway"</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">host.docker.internal + host-gateway</span><span class="lz-t">câu trả lời chạy được ở mọi nơi</span><span class="lz-d">Docker Desktop cung cấp sẵn cái tên đó; trên Linux bạn thêm bằng <code>--add-host</code>. Một cái tên chạy ở mọi nơi, nên cùng một file compose chạy được trên máy Mac lẫn trên một runner CI Linux.</span></div>
  <div class="lz-step"><span class="lz-k">Địa chỉ gateway của cây cầu</span><span class="lz-t">172.17.0.1, hoặc gateway của mạng đó</span><span class="lz-d">Chạy trên Linux mà không cần cờ nào thêm, nhưng địa chỉ đổi theo từng mạng và từng máy chủ, nên nó thuộc về một lần thử nghiệm chứ không thuộc về file cấu hình.</span></div>
  <div class="lz-step"><span class="lz-k">Dịch vụ phải nghe ở 0.0.0.0</span><span class="lz-t">một dịch vụ trên máy chủ gắn vào 127.0.0.1 vẫn không với tới được</span><span class="lz-d">Container đi tới qua giao diện cây cầu chứ không qua loopback. Postgres ở <code>127.0.0.1:5432</code> từ chối nó, y hệt cách nó từ chối mọi cái máy khác.</span></div>
  <div class="lz-step"><span class="lz-k">Tốt hơn: đưa luôn dịch vụ đó vào container</span><span class="lz-t">thế là nó chỉ còn là một cái tên trên một mạng</span><span class="lz-d">Với ngược vào máy chủ là bắc cầu giữa hai thế giới, và nên tránh khi phương án thay thế chỉ là thêm một dịch vụ nữa vào file compose.</span></div>
</div>
<pre><code><span class="tok-comment"># Cùng cơ sở dữ liệu đó, giờ với tới được — vì nó nghe ở mọi giao diện</span>
sudo ss -lntp 'sport = :5432' | tail -1
docker run --rm --add-host=host.docker.internal:host-gateway postgres:16-alpine \\
  psql -h host.docker.internal -U postgres -c 'select 1' 2&gt;/dev/null | head -3</code></pre>
<div class="out">LISTEN 0 244 0.0.0.0:5432 0.0.0.0:* users:(("postgres",pid=1188,fd=6))
 ?column?
----------
        1</div>

<div class="callout warn"><strong>Dòng "Dịch vụ phải nghe ở 0.0.0.0" ở trên chỉ đúng trên LINUX.</strong> Trên Docker Desktop (Mac), <code>host.docker.internal</code> với tới được cả dịch vụ chỉ nghe <code>127.0.0.1</code> của máy Mac — đo thật ngay bên dưới. Đây là một trong những chỗ "máy tôi chạy, VPS thì không" hay gặp nhất.</div>

<h3>Chạy thử từng bước trên CẢ HAI máy: gọi một dịch vụ của máy chủ từ container</h3>
<p>Dịch vụ thử là một máy chủ web tí hon chạy thẳng trên máy (không Docker): <code>python3 -m http.server</code> phục vụ một file <code>index.html</code> chứa một câu chào. Cùng chuỗi lệnh chạy trên máy Mac rồi trên máy Linux:</p>
<pre><code class="language-bash"><span class="tok-comment"># terminal 1 — dịch vụ trên máy chủ, CHỈ nghe loopback</span>
echo "xin chao tu may Mac" &gt; index.html
python3 -m http.server --bind 127.0.0.1 18089

<span class="tok-comment"># terminal 2 — trên MAC</span>
docker run --rm alpine:3.20 getent hosts host.docker.internal
docker run --rm alpine:3.20 wget -qO- -T 3 http://localhost:18089/
docker run --rm alpine:3.20 wget -qO- -T 3 http://host.docker.internal:18089/
docker run --rm --add-host=host.docker.internal:host-gateway alpine:3.20 grep host.docker /etc/hosts</code></pre>
<div class="out">192.168.65.254    host.docker.internal  host.docker.internal
wget: can't connect to remote host: Connection refused
xin chao tu may Mac
192.168.65.254	host.docker.internal
fdc4:f303:9324::254	host.docker.internal</div>
<pre><code class="language-bash"><span class="tok-comment"># terminal 2 — trên LINUX (dịch vụ vẫn chỉ nghe 127.0.0.1:18089)</span>
docker run --rm alpine getent hosts host.docker.internal; echo "exit \$?"
docker run --rm --add-host=host.docker.internal:host-gateway alpine getent hosts host.docker.internal
docker run --rm --add-host=host.docker.internal:host-gateway alpine wget -qO- -T 3 http://host.docker.internal:18089/
<span class="tok-comment"># đổi dịch vụ sang: python3 -m http.server --bind 0.0.0.0 18089, rồi chạy lại dòng trên</span></code></pre>
<div class="out">exit 2
172.17.0.1        host.docker.internal  host.docker.internal
wget: can't connect to remote host (172.17.0.1): Connection refused
xin chao tu may Linux</div>
<table>
<tr><th></th><th>Mac · Docker Desktop 4.91</th><th>Linux · Engine 29.6</th></tr>
<tr><td><code>host.docker.internal</code> có sẵn?</td><td>+Có: <code>192.168.65.254</code></td><td>-Không (<code>getent</code> exit 2)</td></tr>
<tr><td>Với <code>--add-host=…:host-gateway</code></td><td><code>192.168.65.254</code> + một địa chỉ IPv6</td><td><code>172.17.0.1</code> — IP của cầu <code>docker0</code></td></tr>
<tr><td>Dịch vụ chỉ nghe <code>127.0.0.1</code></td><td>+Gọi được (Docker Desktop chuyển về loopback của Mac)</td><td>-Refused: gói tới qua <code>docker0</code>, không qua loopback</td></tr>
<tr><td>Dịch vụ nghe <code>0.0.0.0</code></td><td>+Gọi được</td><td>+Gọi được</td></tr>
</table>
<table>
<tr><th>Mẩu</th><th>Nghĩa là</th></tr>
<tr><td><code>--add-host=TÊN:IP</code></td><td>Thêm một dòng <code>IP TÊN</code> vào <code>/etc/hosts</code> của container. Không phải DNS — chỉ là file hosts.</td></tr>
<tr><td><code>host-gateway</code></td><td>Giá trị đặc biệt: Docker thay bằng địa chỉ "máy chủ nhìn từ container" — trên Linux là IP của cầu mặc định.</td></tr>
<tr><td><code>extra_hosts:</code> (compose)</td><td>Đúng cờ đó viết trong compose — một dòng chạy được trên cả Mac lẫn Linux.</td></tr>
</table>
<p>Bài học rút ra cho đồ án nhóm: nếu bạn phát triển trên Mac và dùng <code>host.docker.internal</code> để gọi một dịch vụ cài thẳng trên máy, rồi đưa lên VPS Linux, hãy nhớ hai việc — thêm <code>extra_hosts</code>, và cho dịch vụ đó nghe <code>0.0.0.0</code> (hoặc <code>172.17.0.1</code>) kèm tường lửa. Cách bền hơn cả: đưa luôn dịch vụ đó vào compose. Trên Windows, Docker Desktop cũng cung cấp sẵn <code>host.docker.internal</code> theo tài liệu của Docker; khoá chưa đo trên Windows, nên hãy tự chạy ba lệnh trên máy của bạn cùng nhóm để biết chắc.</p>

<h3>--network host: không có namespace nào cả</h3>
${slide('dk-08', 23, '--network host: bỏ hẳn namespace — được gì, mất gì')}
<pre><code><span class="tok-comment"># output thật trên máy Linux; ip của BusyBox không có -brief</span>
docker run --rm --network host alpine sh -c 'ip -o -4 addr | awk "{print \\$2, \\$4}" | head -5'
<span class="tok-comment"># một dịch vụ trên máy chủ nghe 127.0.0.1:18089 (python3 -m http.server)</span>
docker run --rm --network host alpine wget -qO- -T 3 http://127.0.0.1:18089/</code></pre>
<div class="out">lo 127.0.0.1/8
enp3s0 192.168.1.102/24
tailscale0 100.98.11.81/32
br-4759f6ff2323 172.28.0.1/24
docker0 172.17.0.1/16
xin chao tu may Linux</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Bạn được gì</span><span class="v">Không NAT, không cặp veth, không công bố cổng. Độ trễ thấp hơn một chút, và khả năng gắn vào cổng thấp hay dùng những giao thức mà NAT làm hỏng — mDNS, DHCP, vài phần mềm VPN và VoIP.</span></div>
  <div class="kv"><span class="k">Bạn mất gì</span><span class="v">Toàn bộ sự cách ly mạng. <code>-p</code> bị bỏ qua kèm một cảnh báo. Hai container không thể cùng gắn vào 8080. Và một container bị chiếm là đang nằm trên mạng của máy chủ bạn với các giao diện của máy chủ bạn.</span></div>
  <div class="kv"><span class="k">Không giống nhau trên Docker Desktop</span><span class="v">Trên macOS và Windows, "máy chủ" là cái máy ảo Linux, không phải máy cá nhân của bạn. Mạng host ở đó hành xử khác và mãi gần đây mới chạy được — đừng dựng quy trình làm việc trên nó.</span></div>
  <div class="kv"><span class="k">Khi nào nó thật sự đúng</span><span class="v">Một agent giám sát buộc phải nhìn thấy các giao diện của máy chủ, một bộ cân bằng tải xử lý hàng chục nghìn kết nối nơi NAT đo được, hoặc phần mềm cần broadcast/multicast. Còn lại: một cổng công bố.</span></div>
</div>
<pre><code><span class="tok-comment"># -p bị lặng lẽ bỏ qua ở chế độ host — để ý dòng cảnh báo</span>
docker run --rm --network host -p 8080:80 nginx:alpine nginx -t 2&gt;&amp;1 | head -2</code></pre>
<div class="out">WARNING: Published ports are discarded when using host network mode
nginx: configuration file /etc/nginx/nginx.conf test is successful</div>

<h3>Chạy thử: localhost trong --network host không phải lúc nào cũng là 127.0.0.1</h3>
<p>Trong lệnh ở trên tôi cố ý gõ <code>127.0.0.1</code> chứ không gõ <code>localhost</code>. Lý do, đo thật trên máy Linux với dịch vụ chỉ nghe <code>127.0.0.1:18089</code>:</p>
<pre><code class="language-bash">docker run --rm --network host alpine wget -qO- -T 3 http://localhost:18089/
docker run --rm --network host alpine wget -qO- -T 3 http://127.0.0.1:18089/
docker run --rm --network host alpine getent hosts localhost</code></pre>
<div class="out">wget: can't connect to remote host: Connection refused
xin chao tu may Linux
::1               localhost  localhost</div>
<p>Trong ảnh alpine, <code>localhost</code> phân giải ra <code>::1</code> (loopback IPv6) TRƯỚC. Dịch vụ chỉ nghe IPv4 <code>127.0.0.1</code> nên kết nối tới <code>::1</code> bị từ chối — trông y hệt "--network host không chạy". Node từ bản 17 cũng hay dính đúng chuyện này, vì nó giữ nguyên thứ tự địa chỉ mà hệ điều hành trả về. Khi nghi ngờ, gõ thẳng <code>127.0.0.1</code>.</p>
<p>Thêm hai quan sát thật: <code>docker run --rm --network host alpine hostname</code> in <code>CuongThai</code> — tên của chính máy Linux, vì container chung luôn tên máy; còn trên Mac, cùng lệnh <code>wget http://127.0.0.1:18089/</code> với <code>--network host</code> bị <code>Connection refused</code>: "host" ở đó là máy ảo Linux của Docker Desktop, không phải máy Mac.</p>
<table>
<tr><th>Dùng <code>--network host</code> khi…</th><th>ĐỪNG dùng khi…</th></tr>
<tr><td>Agent giám sát cần thấy card thật của máy (node-exporter, công cụ đo mạng)</td><td>Chỉ để "sửa" một lỗi kết nối chưa rõ nguyên nhân</td></tr>
<tr><td>Phần mềm cần broadcast/multicast (mDNS, DHCP, vài game server)</td><td>Chạy nhiều bản cùng cổng (hai container không cùng giữ 8080 được)</td></tr>
<tr><td>Đo được NAT là nút cổ chai (hàng chục nghìn kết nối/giây)</td><td>Trên Docker Desktop, mong nó giống Linux</td></tr>
<tr><td>Container phụ chỉ ĐỌC trạng thái mạng của máy (như Bài 8.2)</td><td>Chạy mã bạn không tin: nó ngồi chung mạng với máy chủ</td></tr>
</table>

<h3>Dùng chung mạng của một container khác</h3>
${slide('dk-08', 24, '--network container:app — mượn đôi mắt của chính app')}
<pre><code><span class="tok-comment"># Container gỡ lỗi nhập vào namespace của ứng dụng: cùng giao diện, cùng localhost</span>
docker run -d --name app -p 3000:3000 api:1.4.2 &gt;/dev/null
docker run --rm --network container:app nicolaka/netshoot \\
  sh -c 'ss -lntp; curl -s -o /dev/null -w "%{http_code}\\n" http://localhost:3000/health'</code></pre>
<div class="out">State  Recv-Q Send-Q Local Address:Port Peer Address:Port
LISTEN 0      511          0.0.0.0:3000      0.0.0.0:*
200</div>
<p>Đây là kỹ thuật gỡ lỗi hữu ích nhất trong cả chương, và Bài 8.5 dựa nặng vào nó. Container <code>netshoot</code> có <code>curl</code>, <code>dig</code>, <code>tcpdump</code>, <code>ss</code> và bốn chục công cụ khác, còn <code>--network container:app</code> đặt tất cả chúng <em>bên trong network namespace của ứng dụng</em> — nên <code>localhost</code> có nghĩa là localhost của ứng dụng, và bạn xem được lưu lượng của nó mà không thêm một byte nào vào ảnh ứng dụng. Đây cũng chính là cách mẫu sidecar hoạt động trong pod của Kubernetes.</p>

<p>Chạy thật trên máy Mac với một "app" là máy chủ web Python nghe <code>0.0.0.0:3000</code>:</p>
<pre><code class="language-bash">docker run -d --name app --network shop -p 127.0.0.1:18081:3000 python:3.12-alpine python -m http.server 3000
docker run --rm --network container:app nicolaka/netshoot sh -c 'ss -lntp; curl -s -o /dev/null -w "%{http_code}\\n" http://localhost:3000/'
docker run --rm --network container:app nicolaka/netshoot hostname
docker exec app hostname</code></pre>
<div class="out">State  Recv-Q Send-Q Local Address:Port  Peer Address:PortProcess
LISTEN 0      4096      127.0.0.11:46591      0.0.0.0:*
LISTEN 0      5            0.0.0.0:3000       0.0.0.0:*
200
4d08dd240b48
4d08dd240b48</div>
<p>Ba điều đọc được: netshoot thấy đúng socket của app (<code>0.0.0.0:3000</code>) và cả socket DNS nhúng (<code>127.0.0.11:46591</code>); <code>localhost:3000</code> của netshoot chính là app (<code>200</code>); và hai bên có CÙNG hostname — Docker cho container "ké" dùng chung luôn tên máy. Cột <code>Process</code> trống vì netshoot không thấy tiến trình của container khác (namespace PID vẫn riêng); cần tên tiến trình thì dùng cách <code>nsenter</code> ở Bài 8.5.</p>

<h3>IPv6, nói ngắn</h3>
<pre><code>docker network create --ipv6 --subnet 2001:db8:1::/64 v6net &gt;/dev/null
docker run --rm --network v6net alpine:3.20 ip -6 -o addr show eth0
docker run --rm --network v6net alpine:3.20 ip -o addr show eth0 | awk '{print \$3, \$4}'</code></pre>
<div class="out">11: eth0    inet6 2001:db8:1::2/64 scope global flags 02 \\       valid_lft forever preferred_lft forever
11: eth0    inet6 fe80::b85c:adff:febc:f186/64 scope link tentative \\       valid_lft forever preferred_lft forever
inet 172.27.0.2/16
inet6 2001:db8:1::2/64
inet6 fe80::642f:daff:fee4:22b3/64</div>
<p>Output thật trên máy Mac (Engine 29.8). Hai chỗ sửa so với bản trước: <code>ip</code> của BusyBox không hiểu <code>-brief</code> nên phải dùng <code>-o</code>; và Docker 29 cấp cho container CẢ IPv4 (<code>172.27.0.2</code>) lẫn IPv6 trên một mạng <code>--ipv6</code> — không phải chỉ IPv6.</p>
<p>IPv6 mặc định TẮT trên mạng Docker và được bật theo từng mạng (hoặc bật toàn cục trong <code>daemon.json</code>). Triệu chứng phổ biến của việc phớt lờ nó là một ứng dụng phân giải một hostname ra bản ghi AAAA, thử kết nối qua IPv6, rồi treo tới lúc hết giờ mới lùi về IPv4 — chậm, lúc được lúc không, và khó hiểu. Nếu một container có độ trễ vài giây không giải thích nổi ở các yêu cầu đi ra, hãy kiểm xem nó có đang nhận về bản ghi AAAA mà nó không dùng được không.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bạn chạy một dev server trên máy thật (không Docker), và một container — ví dụ bộ test Playwright của nhóm — cần gọi vào nó. Trong container, <code>localhost:8000</code> báo refused. Bạn tìm cách gọi đúng, và ghi lại hành vi trên máy mình để cả nhóm (Mac, Windows, Linux) biết điều gì khác nhau.</p><ol>
<li>Terminal 1: <code>mkdir -p ~/thu-docker/www &amp;&amp; cd ~/thu-docker/www &amp;&amp; echo "chao nhom" &gt; index.html &amp;&amp; python3 -m http.server --bind 127.0.0.1 8000</code>.</li>
<li>Terminal 2: <code>docker run --rm alpine:3.20 wget -qO- -T 3 http://localhost:8000/</code>. Giải thích vì sao refused bằng một câu.</li>
<li>Terminal 2: <code>docker run --rm --add-host=host.docker.internal:host-gateway alpine:3.20 wget -qO- -T 3 http://host.docker.internal:8000/</code>. Ghi kết quả.</li>
<li>Nếu bước 3 refused (Linux): dừng dịch vụ (<code>Ctrl+C</code>), chạy lại với <code>--bind 0.0.0.0</code>, lặp bước 3.</li>
<li>Terminal 2: <code>docker run --rm --network host alpine:3.20 wget -qO- -T 3 http://127.0.0.1:8000/</code>. Ghi kết quả, rồi <code>Ctrl+C</code> dừng dịch vụ.</li></ol>
<p><strong>Đạt khi:</strong> bạn điền được bảng 3 dòng (localhost · host.docker.internal · --network host) cho máy của mình, khớp với bảng Mac/Linux ở trên: Mac lấy được <code>chao nhom</code> ngay ở bước 3 và refused ở bước 5; Linux cần bước 4 rồi mới lấy được ở bước 3, và bước 5 lấy được.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Loopback (vòng lặp nội bộ)</span><span class="v"><code>127.0.0.1</code>/<code>::1</code>: địa chỉ chỉ dẫn về chính namespace đang đứng — trong container là chính container.</span></div>
  <div class="kv"><span class="k">host.docker.internal</span><span class="v">Tên trỏ về máy chủ nhìn từ container: có sẵn trên Docker Desktop, trên Linux phải thêm bằng <code>--add-host</code>.</span></div>
  <div class="kv"><span class="k">host-gateway</span><span class="v">Giá trị đặc biệt của <code>--add-host</code>/<code>extra_hosts</code> mà Docker thay bằng địa chỉ của máy chủ (Linux: <code>172.17.0.1</code>).</span></div>
  <div class="kv"><span class="k">/etc/hosts (file tên máy)</span><span class="v">Bảng tên → IP tra TRƯỚC DNS; <code>--add-host</code> ghi vào đây.</span></div>
  <div class="kv"><span class="k">--network host (mạng máy chủ)</span><span class="v">Không tạo namespace mạng riêng: container dùng thẳng card, cổng và localhost của máy chủ.</span></div>
  <div class="kv"><span class="k">--network container:X (dùng chung mạng)</span><span class="v">Container mới nhập vào namespace mạng của X: cùng IP, cùng localhost, cùng hostname.</span></div>
  <div class="kv"><span class="k">Sidecar (container đi kèm)</span><span class="v">Container phụ chạy cạnh app, chung mạng với nó — cách pod Kubernetes gắn log, proxy, gỡ lỗi.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>localhost</code> trong container là chính container đó — không phải máy chủ, không phải container khác.</li>
<li>Gọi máy chủ từ container: <code>host.docker.internal</code>; Docker Desktop có sẵn, Linux cần <code>--add-host=host.docker.internal:host-gateway</code> (compose: <code>extra_hosts</code>).</li>
<li>Trên Linux dịch vụ của máy chủ phải nghe <code>0.0.0.0</code> (hoặc IP cầu); trên Mac Docker Desktop chuyển được cả tới <code>127.0.0.1</code> — khác biệt hay làm vỡ khi lên VPS.</li>
<li><code>--network host</code> bỏ namespace: <code>-p</code> bị vứt, mất cách ly; trên Mac "host" là máy ảo.</li>
<li>Trong alpine, <code>localhost</code> ra <code>::1</code> trước — dịch vụ chỉ nghe IPv4 sẽ refused; gõ <code>127.0.0.1</code> khi nghi ngờ.</li>
<li><code>--network container:app</code> cho công cụ gỡ lỗi nhìn đúng bằng mắt của app mà không đụng tới ảnh app.</li>
</ul>


<a class="link-card" href="https://docs.docker.com/engine/network/drivers/host/" target="_blank" rel="noopener">
  <span class="lc-ico">🖥️</span>
  <span class="lc-body"><span class="lc-title">Docker docs — Mạng host</span><span class="lc-sub">Chế độ host làm gì và không làm gì trên từng nền tảng, gồm cả những lưu ý riêng của Docker Desktop, và các trường hợp cụ thể mà nó là lựa chọn đúng.</span></span>
</a>
<a class="link-card" href="https://github.com/nicolaka/netshoot" target="_blank" rel="noopener">
  <span class="lc-ico">🥾</span>
  <span class="lc-body"><span class="lc-title">netshoot — ảnh chuyên gỡ lỗi mạng</span><span class="lc-sub">Riêng danh sách công cụ đã đáng đọc: <code>dig</code>, <code>tcpdump</code>, <code>iperf</code>, <code>ss</code>, <code>mtr</code>, <code>nmap</code>, <code>drill</code>. Phần README trình bày đúng mẫu <code>--network container:</code> dùng ở trên.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: với ra ngoài cho đúng</span><span class="lc-sub">Bài chấm điểm: kết nối từ container tới một dịch vụ trên máy chủ, giải thích vì sao đúng lệnh đó thất bại khi dịch vụ máy chủ gắn vào loopback, và dùng <code>--network container:</code> để soi socket của một ứng dụng đang chạy.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> với tay lấy <code>--network host</code> để "chữa" một vấn đề kết nối. Nó thường làm cái lỗi trước mắt biến mất thật, và chính điều đó khiến nó nguy hiểm: bạn vừa gỡ bỏ sự cách ly thay vì tìm ra nguyên nhân, còn cái lỗi thật — một dịch vụ gắn vào <code>127.0.0.1</code>, hai container ở hai mạng khác nhau, một ánh xạ cổng viết ngược — vẫn còn đó, giờ thì bị che đi. Nó cũng không mở rộng được: container thứ hai muốn cổng 8080 sẽ không khởi động nổi, <code>-p</code> ngừng có tác dụng, và trên Docker Desktop hành vi khác Linux, nên cách chữa vá được máy bạn lại làm vỡ CI. Hãy bỏ ra hai phút cho <code>docker network inspect</code> và <code>ss -lntp</code>; nguyên nhân gần như luôn là một trong bốn cái ở Bài 8.3.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> <code>localhost</code> bên trong container là loopback của chính container đó — không bao giờ là máy chủ, không bao giờ là container khác. Muốn với tới một dịch vụ trên máy chủ thì thêm <code>--add-host=host.docker.internal:host-gateway</code> <em>và</em> bảo đảm dịch vụ đó nghe ở <code>0.0.0.0</code>. Và <code>--network container:&lt;tên&gt;</code> đặt một container gỡ lỗi vào bên trong network namespace của container khác, đó là nước cờ chẩn đoán hữu ích nhất bạn học được trong chương này.</p>
</div>
`,
    },
    /* ─────────────────────────── 8.5 ─────────────────────────── */
    {
      title: '8.5 — Diagnosing container networks|||8.5 — Chẩn đoán mạng container',
      slug: 'dk-8-5-chan-doan-mang',
      type: 'LESSON',
      description: 'Một cây quyết định bốn nhánh, netshoot và nsenter, đọc ss/dig/curl -v/tcpdump từ bên trong namespace của ứng dụng, và sáu triệu chứng thật kèm nguyên nhân đã xác minh.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.5</span>
<h2>Diagnosing container networks</h2>
<p class="lead">Network problems feel unbounded, but container network problems are not: there are four questions, asked in order, and each one eliminates a whole class of cause. This lesson is the method, the tools, and a cookbook of symptoms you will actually meet.</p>

<h3>The four questions, in order</h3>
${slide('dk-08', 25, 'Bốn câu hỏi, hỏi đúng thứ tự')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Is the process listening at all?</span><span class="lz-t">ss -lntp inside the container's namespace</span><span class="lz-d">If there is no LISTEN line, no amount of network debugging will help — the problem is the application, not the network. Check the logs and the command it was given.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Is it listening on the right address?</span><span class="lz-t">0.0.0.0 versus 127.0.0.1</span><span class="lz-d">A LISTEN on <code>127.0.0.1</code> is reachable only from inside that container. This is the most common single cause, and question 1 already gave you the answer.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Can the name be resolved?</span><span class="lz-t">getent hosts &lt;name&gt; from the client container</span><span class="lz-d">No answer means the two containers are not on a shared user-defined network, or you are on the default bridge where names never resolve.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Does a packet get through?</span><span class="lz-t">nc -zv, then curl -v, then tcpdump</span><span class="lz-d">Refused means something rejected it immediately (nothing listening on that port). Timeout means it was dropped silently — a firewall, a wrong subnet, or the wrong host entirely.</span></div>
</div>
<div class="callout ok"><strong>Refused and timeout mean different things, and the distinction saves hours.</strong> <em>Connection refused</em> is an answer: the packet arrived and something actively said no — you have the right host, the wrong port or a dead service. <em>Timeout</em> is silence: a firewall dropped it, or you are talking to an address that does not route. Never treat them as the same symptom.</div>

<h3>The toolkit</h3>
${slide('dk-08', 26, 'Soi socket của một ảnh không có công cụ — không cần sudo')}
<pre><code><span class="tok-comment"># Inside the app's own namespace — no tools needed in the app image</span>
docker run --rm -it --network container:api nicolaka/netshoot

<span class="tok-comment"># On the app's network, as a separate container (to test reachability BETWEEN containers)</span>
docker run --rm -it --network shop nicolaka/netshoot

<span class="tok-comment"># From the host, entering the namespace directly (no extra container at all)</span>
PID=$(docker inspect -f '{{ .State.Pid }}' api)
sudo nsenter -t "$PID" -n ss -lntp</code></pre>
<div class="out">State  Recv-Q Send-Q  Local Address:Port  Peer Address:Port  Process
LISTEN 0      511     127.0.0.1:3000      0.0.0.0:*          users:(("node",pid=8123,fd=20))</div>
<div class="callout warn"><strong>There is the bug, in one line.</strong> <code>127.0.0.1:3000</code>, not <code>0.0.0.0:3000</code>. The container is healthy, the network is fine, and nothing outside that namespace will ever connect. Question 1 and question 2 answered together, in the first command you ran.</div>

<h3>Run it step by step: nsenter when the machine gives you no sudo</h3>
<p>The <code>sudo nsenter</code> above needs root on the host. A lab machine, a shared server, or your own Mac (where "the host" is Docker Desktop's VM) will not give you that. The alternative: run <code>nsenter</code> inside a helper container that can see every host process. Real run on the Mac, with an app deliberately listening on <code>127.0.0.1</code>:</p>
<pre><code class="language-bash">docker run -d --name bug --network shop python:3.12-alpine python -m http.server 3000 --bind 127.0.0.1
PID=\$(docker inspect -f '{{.State.Pid}}' bug); echo \$PID
docker run --rm --pid=host --privileged nicolaka/netshoot nsenter -t \$PID -n ss -lntp</code></pre>
<div class="out">14462
State  Recv-Q Send-Q Local Address:Port  Peer Address:PortProcess
LISTEN 0      5          127.0.0.1:3000       0.0.0.0:*    users:(("python",pid=14462,fd=3))
LISTEN 0      4096      127.0.0.11:45039      0.0.0.0:*    users:(("dockerd",pid=286,fd=261))</div>
<table>
<tr><th>Piece</th><th>Meaning</th></tr>
<tr><td><code>docker inspect -f '{{.State.Pid}}' bug</code></td><td>The PID of the container's main process as seen from the host (on a Mac: from the VM).</td></tr>
<tr><td><code>--pid=host</code></td><td>The helper sees EVERY host process, so <code>/proc/14462</code> exists for it (Chapter 1's trick).</td></tr>
<tr><td><code>--privileged</code></td><td>Allows jumping into another process's namespaces. Throwaway containers only.</td></tr>
<tr><td><code>nsenter -t \$PID -n</code></td><td>"Enter the NETWORK namespace (<code>-n</code>) of that target process (<code>-t</code>)" and run the command that follows. <code>-m</code> is mount, <code>-p</code> is PID.</td></tr>
<tr><td><code>ss -lntp</code></td><td><code>-l</code> listening, <code>-n</code> numeric, <code>-t</code> TCP, <code>-p</code> with the owning process.</td></tr>
</table>
<p>Unlike <code>--network container:bug</code> (Lesson 8.4), this approach also fills the <code>Process</code> column: the first line is the culprit (<code>python</code> listening on <code>127.0.0.1:3000</code>), the second confirms the embedded DNS really is a <code>dockerd</code> socket. Questions 1 and 2 answered in one command.</p>

<h3>Reading the four commands that matter</h3>
${slide('dk-08', 28, 'dig → nc → curl -v → tcpdump: mỗi công cụ trả lời một tầng')}
<pre><code><span class="tok-comment"># DNS: is the name known, and to which address?</span>
docker run --rm --network shop nicolaka/netshoot dig +short db
docker run --rm --network shop nicolaka/netshoot dig db @127.0.0.11 +noall +answer</code></pre>
<div class="out">172.19.0.4
db.			600	IN	A	172.19.0.4</div>
<pre><code><span class="tok-comment"># Reachability: refused, timeout, or open?</span>
docker run --rm --network shop nicolaka/netshoot sh -c 'nc -zv db 5432; nc -zv -w3 db 9999'</code></pre>
<div class="out">Connection to db (172.26.0.4) 5432 port [tcp/postgresql] succeeded!
nc: connect to db (172.26.0.4) port 9999 (tcp) failed: Connection refused</div>
<pre><code><span class="tok-comment"># HTTP: what actually happened, including the TLS handshake and redirects</span>
docker run --rm --network shop nicolaka/netshoot \\
  curl -sS -o /dev/null -v --max-time 5 http://api:3000/health 2&gt;&amp;1 | grep -E '^[*&gt;&lt;]' | head -8</code></pre>
<div class="out">*   Trying 172.19.0.2:3000...
* Connected to api (172.19.0.2) port 3000
&gt; GET /health HTTP/1.1
&gt; Host: api:3000
&lt; HTTP/1.1 200 OK
&lt; content-type: application/json</div>
<pre><code><span class="tok-comment"># Packets: when you need to see that traffic really arrives</span>
docker run --rm --net container:api --cap-add NET_ADMIN nicolaka/netshoot \\
  timeout 8 tcpdump -ni any -c 5 'tcp port 5432'</code></pre>
<div class="out">tcpdump: data link type LINUX_SLL2
12:04:11.882301 eth0  Out IP 172.19.0.2.54118 &gt; 172.19.0.4.5432: Flags [S], seq 2118…
12:04:11.882604 eth0  In  IP 172.19.0.4.5432 &gt; 172.19.0.2.54118: Flags [S.], seq 3391…
12:04:11.882651 eth0  Out IP 172.19.0.2.54118 &gt; 172.19.0.4.5432: Flags [.], ack 1</div>
<p>A complete three-way handshake — SYN, SYN-ACK, ACK — proves the network is doing its job and moves the investigation into the application: authentication, TLS, a protocol mismatch, or a slow query. Seeing only outbound SYNs with no reply means the packets are being dropped, and you are looking at a firewall or a routing problem, not at your code.</p>

<h3>Refused and timeout on the wire: run it and time it</h3>
${slide('dk-08', 27, 'Refused và timeout nhìn trên dây')}
<p>The "refused is not timeout" table at the top of the lesson sticks much better once you can time it and see the packets. Two tests, from the same kind of container on the <code>shop</code> network (subnet <code>172.26.0.0/16</code>):</p>
<pre><code class="language-bash">docker run --rm --network shop alpine:3.20 sh -c 'time nc -z -w3 db 9999; echo exit=\$?'
docker run --rm --network shop alpine:3.20 sh -c 'time nc -z -w3 172.26.0.250 3000; echo exit=\$?'</code></pre>
<div class="out">exit=1
real	0m 0.00s
exit=1
real	0m 3.00s</div>
<p>Both exit 1, but one takes 0 seconds and the other exactly 3 — precisely the <code>-w3</code>. Capturing packets inside the caller's namespace with tcpdump shows why:</p>
<pre><code class="language-bash">docker run --rm --net container:api --cap-add NET_ADMIN nicolaka/netshoot \\
  timeout 12 tcpdump -ni eth0 -c 5 'tcp port 9999 or (host 172.26.0.250 and tcp port 5432)'
<span class="tok-comment"># (in another terminal, from api: nc -z -w2 db 9999; nc -z -w3 172.26.0.250 5432)</span></code></pre>
<div class="out">18:43:37.168285 IP 172.26.0.2.37821 &gt; 172.26.0.4.9999: Flags [S], seq 2676868341, win 64240, options [mss 1460,sackOK,TS …
18:43:37.168324 IP 172.26.0.4.9999 &gt; 172.26.0.2.37821: Flags [R.], seq 0, ack 2676868342, win 0, length 0</div>
<pre><code class="language-bash">docker run --rm --net container:api --cap-add NET_ADMIN nicolaka/netshoot \\
  timeout 10 tcpdump -ni eth0 -c 4 'host 172.26.0.250 or (arp and host 172.26.0.250)'</code></pre>
<div class="out">18:44:00.914990 ARP, Request who-has 172.26.0.250 tell 172.26.0.2, length 28
18:44:00.915031 ARP, Request who-has 172.26.0.250 tell 172.26.0.2, length 28
18:44:01.932100 ARP, Request who-has 172.26.0.250 tell 172.26.0.2, length 28
18:44:01.932259 ARP, Request who-has 172.26.0.250 tell 172.26.0.2, length 28</div>
<ul>
<li><strong>Refused:</strong> one <code>[S]</code> (SYN — "may I connect?") goes out, one <code>[R.]</code> (RST — "nobody on this port") comes back within 0.04 milliseconds. Something answered ⇒ right machine, wrong port or a dead service.</li>
<li><strong>Timeout:</strong> not even one SYN. The address is on the same subnet, so the kernel must first ask ARP (the protocol that asks "which NIC owns this IP?"); nobody claims it, so the question repeats until the time runs out. If the target were on a DIFFERENT subnet or dropped by a firewall, you would see SYNs going out repeatedly with nothing coming back.</li>
</ul>
<table>
<tr><th>Flag</th><th>Meaning</th></tr>
<tr><td><code>nc -z -v -w3</code></td><td><code>-z</code> only tries to connect, sends no data; <code>-v</code> prints the result; <code>-w3</code> waits at most 3 seconds.</td></tr>
<tr><td><code>dig +short</code> · <code>dig X @127.0.0.11</code> · <code>+noall +answer</code></td><td>Print only the IP · ask that exact DNS server · print only the answer section.</td></tr>
<tr><td><code>curl -sS -o /dev/null -v --max-time 5</code></td><td>Quiet but still show errors · discard the body · print every connect/send/receive step · give up after 5 seconds.</td></tr>
<tr><td><code>tcpdump -n -i eth0 -c 5 'filter'</code></td><td>No name lookups · listen on eth0 (<code>any</code> = all NICs) · stop after 5 packets · only packets matching the filter.</td></tr>
<tr><td><code>--cap-add NET_ADMIN</code></td><td>tcpdump needs network-admin rights to open an interface for capture.</td></tr>
</table>

<h3>Run it step by step: one broken case, four questions, start to finish</h3>
<p>Put the whole lesson together on the same <code>bug</code> container (a Python app listening on <code>127.0.0.1:3000</code>), then compare with <code>app</code> listening on <code>0.0.0.0:3000</code>. Every output line is real, on the Mac:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Questions 1 + 2 · listening? where?</span><span class="lz-t">nsenter -t \$PID -n ss -lntp</span><span class="lz-d"><code>127.0.0.1:3000 users:(("python",…))</code> ⇒ it IS listening, but on loopback only. Culprit found; the next two questions only confirm it.</span></div>
  <div class="lz-step"><span class="lz-k">Question 3 · does the name resolve?</span><span class="lz-t">nc -zv -w3 bug 3000</span><span class="lz-d">nc prints <code>bug (172.26.0.9)</code> ⇒ DNS is fine. Compare a name that does not exist: <code>nc: getaddrinfo for host "khongcoai" port 3000: Name does not resolve</code>.</span></div>
  <div class="lz-step"><span class="lz-k">Question 4 · does a packet get through?</span><span class="lz-t">Connection refused</span><span class="lz-d">An immediate answer ⇒ right machine, nobody listening on that port on eth0 — consistent with question 2.</span></div>
  <div class="lz-step"><span class="lz-k">Fix and recheck</span><span class="lz-t">--bind 0.0.0.0</span><span class="lz-d">The <code>app</code> container listens on <code>0.0.0.0:3000</code>: <code>Connection to dk08-app (172.26.0.8) 3000 port [tcp/*] succeeded!</code></span></div>
</div>
<pre><code class="language-bash">docker run --rm --network shop nicolaka/netshoot sh -c 'nc -zv -w3 bug 3000; nc -zv -w3 dk08-app 3000; nc -zv -w3 khongcoai 3000'</code></pre>
<div class="out">nc: connect to bug (172.26.0.9) port 3000 (tcp) failed: Connection refused
Connection to dk08-app (172.26.0.8) 3000 port [tcp/*] succeeded!
nc: getaddrinfo for host "khongcoai" port 3000: Name does not resolve</div>
<p>Three lines, three different diagnoses, and each line tells you which question it belongs to: <code>getaddrinfo … Name does not resolve</code> is question 3 (DNS), <code>Connection refused</code> is question 4 with an answer, <code>succeeded</code> means every network layer is fine. Practise reading errors this way and you will never again say a vague "the network is broken".</p>

<h3>Cookbook</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"ECONNREFUSED 127.0.0.1:5432" from an app container</span><span class="v">The app is using <code>localhost</code> for the database. In a container that means itself. Change the host to the service name (<code>db</code>, <code>postgres</code>) — this is a config bug, not a network one.</span></div>
  <div class="kv"><span class="k">"getaddrinfo ENOTFOUND db"</span><span class="v">Name does not resolve: the two containers share no user-defined network, or you are on the default bridge. <code>docker inspect -f '{{ json .NetworkSettings.Networks }}'</code> on both, and compare.</span></div>
  <div class="kv"><span class="k">Works with <code>docker compose up</code>, fails with <code>docker run</code></span><span class="v">Compose creates a network and joins everything to it; <code>docker run</code> defaults to the default bridge with no DNS. Add <code>--network</code>.</span></div>
  <div class="kv"><span class="k">Times out only in CI</span><span class="v">Usually egress: the runner blocks outbound traffic, or a corporate proxy needs <code>HTTP_PROXY</code>/<code>HTTPS_PROXY</code> passed into the container. Test with <code>curl -v</code> to a known host, not to your own service.</span></div>
  <div class="kv"><span class="k">Random multi-second delays on outbound calls</span><span class="v">IPv6 AAAA answers the container cannot route (Lesson 8.4), or a broken DNS forwarder. <code>dig</code> the name and check for AAAA records; <code>curl -4</code> to confirm.</span></div>
  <div class="kv"><span class="k">"address already in use" on start</span><span class="v">A host process — typically a dev server — already owns the port. (Another RUNNING container gives <code>port is already allocated</code> instead; a stopped container holds no port — Lesson 8.2.) <code>ss -lntp 'sport = :8080'</code> names it.</span></div>
  <div class="kv"><span class="k">Reachable from the host, not from another container</span><span class="v">You are testing the published host port from one side and the container port from the other. Between containers, use the <em>container's</em> port and the service name.</span></div>
  <div class="kv"><span class="k">Everything resolves, nothing connects, after a VPN starts</span><span class="v">Docker's default subnets (172.17–172.31) collide with the VPN's routes. Set <code>default-address-pools</code> in <code>/etc/docker/daemon.json</code> and restart the daemon.</span></div>
</div>

<h3>A ten-second triage script</h3>
${slide('dk-08', 29, 'Kịch bản phân loại 10 giây')}
<pre><code><span class="tok-comment"># Where is each container, and what is published where?</span>
docker ps --format 'table {{.Names}}\\t{{.Ports}}'
docker inspect -f '{{ .Name }} → {{ range $n, $v := .NetworkSettings.Networks }}{{ $n }} {{ $v.IPAddress }} {{ end }}' \\
  $(docker ps -q)
sudo ss -lntp | grep docker-proxy</code></pre>
<div class="out">NAMES     PORTS
proxy     0.0.0.0:80-&gt;80/tcp, 0.0.0.0:443-&gt;443/tcp
backend   3000/tcp
db        5432/tcp
/proxy → public 172.20.0.3
/backend → private 172.21.0.2 public 172.20.0.2
/db → private 172.21.0.3
LISTEN 0 4096 0.0.0.0:80   0.0.0.0:* users:(("docker-proxy",pid=2211,fd=4))
LISTEN 0 4096 0.0.0.0:443  0.0.0.0:* users:(("docker-proxy",pid=2233,fd=4))</div>
<p>Three commands, and the whole topology is on screen: which container is on which network with which address, which ports are published and on which interface. Most "the network is broken" reports are answered here — a container missing from a network, or a port published where it should not be — before you run a single diagnostic tool.</p>

<p>Real run on the Mac with the two-tier stack from Lesson 8.3 (filtered by name so other containers on the machine do not get mixed in):</p>
<pre><code class="language-bash">docker ps --filter name=dk08- --format 'table {{.Names}}\\t{{.Ports}}'
docker inspect -f '{{ .Name }} → {{ range \$n, \$v := .NetworkSettings.Networks }}{{ \$n }} {{ \$v.IPAddress }} {{ end }}' \\
  \$(docker ps -q --filter name=dk08-proxy --filter name=dk08-backend --filter name=dk08-db)</code></pre>
<div class="out">NAMES          PORTS
…
dk08-proxy     127.0.0.1:18080-&gt;80/tcp
dk08-backend   80/tcp
dk08-db        5432/tcp
…
/dk08-proxy → dk08-public 172.25.0.3
/dk08-backend → dk08-private 172.24.0.3 dk08-public 172.25.0.2
/dk08-db → dk08-private 172.24.0.2
/dk08-db-b → dk08-app-net 172.23.0.2
/dk08-db-a → bridge 172.17.0.9</div>
<p>Two things worth noticing. The <code>name=dk08-db</code> filter matches a SUBSTRING, so it also pulls in <code>dk08-db-a</code> and <code>dk08-db-b</code> — remember that when you clean up with filters. And the last line is a textbook "network is broken" case this command catches at once: <code>dk08-db-a</code> sits on the default <code>bridge</code>, so no container can reach it by name. As for the original script's third command, <code>ss -lntp | grep docker-proxy</code> must run with <code>sudo</code>: without it, <code>ss</code> does not print other users' process names, the grep comes back empty — measured on the course's Linux machine — and you conclude nothing is open.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> 15 minutes before the project demo, the team's site returns 502: nginx cannot reach the app. Nobody "changed anything since yesterday". You do not guess — you walk the four questions, write a one-line conclusion for each, and only then fix.</p><ol>
<li>Rebuild the broken case: <code>docker network create thu-demo</code>, then <code>docker run -d --name thu-app --network thu-demo python:3.12-alpine python -m http.server 3000 --bind 127.0.0.1</code>.</li>
<li>Questions 1 + 2: <code>docker run --rm --network container:thu-app alpine:3.20 netstat -lnt</code>. Is the app listening? On which address?</li>
<li>Question 3: <code>docker run --rm --network thu-demo alpine:3.20 getent hosts thu-app</code>.</li>
<li>Question 4: <code>docker run --rm --network thu-demo alpine:3.20 sh -c 'time nc -z -w3 thu-app 3000; echo exit=\$?'</code> — refused or timeout? Read the <code>real</code> column.</li>
<li>Fix: <code>docker rm -f thu-app</code>, run it again with <code>--bind 0.0.0.0</code>; repeat question 4 with <code>nc -z -w3 thu-app 3000 &amp;&amp; echo open</code>. Clean up: <code>docker rm -f thu-app; docker network rm thu-demo</code>.</li></ol>
<p><strong>Done when:</strong> you can write four conclusions — (1) listening, (2) only <code>127.0.0.1:3000</code> ⇒ the culprit, (3) the name gives an IP ⇒ DNS is fine, (4) <code>exit=1</code> with <code>real 0m 0.00s</code> ⇒ refused, not a timeout — and after the fix the last command prints <code>open</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Connection refused</span><span class="v">Something answered "no": an RST came back at once — right machine, wrong port or nothing listening.</span></div>
  <div class="kv"><span class="k">Timeout</span><span class="v">Nobody answered: the packet was dropped (firewall, other network) or the address does not exist.</span></div>
  <div class="kv"><span class="k">SYN / SYN-ACK / ACK (three-way handshake)</span><span class="v">The three packets that open a TCP connection; seeing all three means the network layer did its job.</span></div>
  <div class="kv"><span class="k">RST</span><span class="v">The "no such connection / nobody listening" packet — the source of the Connection refused message.</span></div>
  <div class="kv"><span class="k">ARP</span><span class="v">The "which NIC owns this IP?" question on the same subnet; if nobody claims it, not even a SYN goes out.</span></div>
  <div class="kv"><span class="k">netshoot</span><span class="v">An image with dig, nc, curl, ss, tcpdump… ready to run beside an app without changing the app's image.</span></div>
  <div class="kv"><span class="k">nsenter</span><span class="v">Runs a command inside another process's namespaces; <code>-n</code> is the network namespace.</span></div>
  <div class="kv"><span class="k">Vantage point</span><span class="v">Where you test from: it must match the failing side, not the host's shell.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Four questions in order: listening? → where? → does the name resolve? → does a packet get through? Each one removes a whole class of cause.</li>
<li>The first two are answered by ONE <code>ss -lntp</code> inside the app's namespace (<code>--network container:</code>, or <code>nsenter</code> via a helper when there is no sudo).</li>
<li>Refused = an answer (RST at once, 0 seconds); timeout = silence (exactly the wait time) — two different diagnoses.</li>
<li>Read each message at its layer: <code>Name does not resolve</code> is DNS, <code>Connection refused</code> is the port, <code>succeeded</code> means the network is fine.</li>
<li><code>docker ps --format</code> + <code>docker inspect … Networks</code> give the whole map in ten seconds; <code>ss -lntp | grep docker-proxy</code> needs <code>sudo</code>.</li>
<li>Always test from the failing side's vantage point: netshoot on the same network or in the same namespace.</li>
</ul>


<a class="link-card" href="https://github.com/nicolaka/netshoot" target="_blank" rel="noopener">
  <span class="lc-ico">🥾</span>
  <span class="lc-body"><span class="lc-title">netshoot</span><span class="lc-sub">The debugging image and its cookbook: entering another container's namespace, capturing traffic, and testing DNS. Keep the <code>--network container:</code> invocation in your notes.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man1/nsenter.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">🚪</span>
  <span class="lc-body"><span class="lc-title">nsenter(1)</span><span class="lc-sub">Enter any namespace of a running process from the host. <code>-n</code> for network, <code>-m</code> for mount, <code>-p</code> for PID. The escape hatch when an image has no shell at all.</span></span>
</a>
<a class="link-card" href="https://www.tcpdump.org/manpages/tcpdump.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">📡</span>
  <span class="lc-body"><span class="lc-title">tcpdump(1)</span><span class="lc-sub">Filter syntax worth twenty minutes: <code>host</code>, <code>port</code>, <code>tcp[tcpflags]</code>, and <code>-i any</code>. Reading a handshake is the fastest way to decide whether a problem is network or application.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: diagnose six broken stacks</span><span class="lc-sub">Graded exercises: six scenarios, each with one fault — a loopback bind, a missing network, a reversed port map, a firewall drop, a stale DNS assumption, and a service that never started. Find each with the four questions.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> debugging from the host when the problem is between containers. <code>curl localhost:8080</code> from your shell tests the published port and the host's view — a completely different path from one container reaching another over the bridge. It can succeed while container-to-container fails (the service binds correctly for the host but the client container is on the wrong network), and it can fail while everything is fine (nothing is published, because nothing needs to be). Test from the same vantage point as the failing client: <code>docker run --rm --network &lt;the client's network&gt; nicolaka/netshoot</code>, then run your check from there. Matching the vantage point is most of the skill.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Ask the four questions in order — listening, on what address, does the name resolve, does a packet get through — and each one removes a whole class of cause. <em>Refused</em> and <em>timeout</em> are different diagnoses: one means something answered no, the other means silence. And test from the same vantage point as the thing that is failing, using <code>--network container:&lt;name&gt;</code> or a netshoot container on the same network.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.5</span>
<h2>Chẩn đoán mạng container</h2>
<p class="lead">Vấn đề mạng nghe như vô biên, nhưng vấn đề mạng container thì không: chỉ có bốn câu hỏi, hỏi theo thứ tự, và mỗi câu loại bỏ được nguyên một nhóm nguyên nhân. Bài này là cái phương pháp đó, bộ công cụ, và một sách công thức các triệu chứng bạn sẽ gặp thật.</p>

<h3>Bốn câu hỏi, theo thứ tự</h3>
${slide('dk-08', 25, 'Bốn câu hỏi, hỏi đúng thứ tự')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Tiến trình có đang nghe không?</span><span class="lz-t">ss -lntp bên trong namespace của container</span><span class="lz-d">Nếu không có dòng LISTEN nào thì gỡ lỗi mạng bao nhiêu cũng vô ích — vấn đề nằm ở ứng dụng, không nằm ở mạng. Hãy xem log và câu lệnh nó được giao.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Nó nghe ở đúng địa chỉ không?</span><span class="lz-t">0.0.0.0 so với 127.0.0.1</span><span class="lz-d">Một dòng LISTEN ở <code>127.0.0.1</code> chỉ với tới được từ bên trong chính container đó. Đây là nguyên nhân đơn lẻ phổ biến nhất, và câu 1 đã trả lời hộ bạn rồi.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Cái tên có phân giải được không?</span><span class="lz-t">getent hosts &lt;tên&gt; từ container bên gọi</span><span class="lz-d">Không có câu trả lời nghĩa là hai container không chung một mạng tự tạo nào, hoặc bạn đang ở bridge mặc định nơi tên không bao giờ phân giải được.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Có gói tin nào đi lọt không?</span><span class="lz-t">nc -zv, rồi curl -v, rồi tcpdump</span><span class="lz-d">Refused nghĩa là có thứ gì đó từ chối ngay lập tức (không có ai nghe ở cổng đó). Timeout nghĩa là gói bị vứt trong im lặng — một tường lửa, một mạng con sai, hoặc nhầm hẳn máy chủ.</span></div>
</div>
<div class="callout ok"><strong>Refused và timeout có nghĩa khác nhau, và phân biệt được là tiết kiệm hàng giờ.</strong> <em>Connection refused</em> là một CÂU TRẢ LỜI: gói đã tới nơi và có thứ gì chủ động nói không — bạn đúng máy chủ, sai cổng hoặc dịch vụ đã chết. <em>Timeout</em> là SỰ IM LẶNG: một tường lửa đã vứt nó, hoặc bạn đang nói chuyện với một địa chỉ không có đường tới. Đừng bao giờ coi hai cái đó là cùng một triệu chứng.</div>

<h3>Bộ công cụ</h3>
${slide('dk-08', 26, 'Soi socket của một ảnh không có công cụ — không cần sudo')}
<pre><code><span class="tok-comment"># Bên trong namespace của chính ứng dụng — không cần công cụ nào trong ảnh ứng dụng</span>
docker run --rm -it --network container:api nicolaka/netshoot

<span class="tok-comment"># Trên mạng của ứng dụng, dưới dạng container riêng (để thử với tới GIỮA các container)</span>
docker run --rm -it --network shop nicolaka/netshoot

<span class="tok-comment"># Từ máy chủ, nhập thẳng vào namespace (không cần thêm container nào cả)</span>
PID=$(docker inspect -f '{{ .State.Pid }}' api)
sudo nsenter -t "$PID" -n ss -lntp</code></pre>
<div class="out">State  Recv-Q Send-Q  Local Address:Port  Peer Address:Port  Process
LISTEN 0      511     127.0.0.1:3000      0.0.0.0:*          users:(("node",pid=8123,fd=20))</div>
<div class="callout warn"><strong>Cái lỗi nằm ngay đó, trong một dòng.</strong> <code>127.0.0.1:3000</code>, không phải <code>0.0.0.0:3000</code>. Container khoẻ mạnh, mạng không sao, và không thứ gì bên ngoài namespace đó sẽ kết nối được. Câu 1 và câu 2 được trả lời cùng lúc, ngay ở lệnh đầu tiên bạn chạy.</div>

<h3>Chạy thử từng bước: nsenter khi máy không cho sudo</h3>
<p>Lệnh <code>sudo nsenter</code> ở trên cần quyền root trên máy chủ. Máy phòng lab, máy dùng chung, hay chính máy Mac (nơi "máy chủ" là máy ảo của Docker Desktop) thì không có. Cách thay: chạy <code>nsenter</code> bên trong một container phụ nhìn thấy mọi tiến trình của máy chủ. Chạy thật trên máy Mac với một app cố ý nghe nhầm <code>127.0.0.1</code>:</p>
<pre><code class="language-bash">docker run -d --name bug --network shop python:3.12-alpine python -m http.server 3000 --bind 127.0.0.1
PID=\$(docker inspect -f '{{.State.Pid}}' bug); echo \$PID
docker run --rm --pid=host --privileged nicolaka/netshoot nsenter -t \$PID -n ss -lntp</code></pre>
<div class="out">14462
State  Recv-Q Send-Q Local Address:Port  Peer Address:PortProcess
LISTEN 0      5          127.0.0.1:3000       0.0.0.0:*    users:(("python",pid=14462,fd=3))
LISTEN 0      4096      127.0.0.11:45039      0.0.0.0:*    users:(("dockerd",pid=286,fd=261))</div>
<table>
<tr><th>Mẩu</th><th>Nghĩa là</th></tr>
<tr><td><code>docker inspect -f '{{.State.Pid}}' bug</code></td><td>PID của tiến trình chính của container, nhìn từ máy chủ (trên Mac: từ máy ảo).</td></tr>
<tr><td><code>--pid=host</code></td><td>Container phụ thấy MỌI tiến trình của máy chủ, nên <code>/proc/14462</code> tồn tại với nó (mẹo của Chương 1).</td></tr>
<tr><td><code>--privileged</code></td><td>Cho phép nhảy vào namespace của tiến trình khác. Chỉ dùng cho container dùng-xong-vứt.</td></tr>
<tr><td><code>nsenter -t \$PID -n</code></td><td>"Vào namespace MẠNG (<code>-n</code>) của tiến trình <code>-t</code> đó" rồi chạy lệnh phía sau. <code>-m</code> là mount, <code>-p</code> là PID.</td></tr>
<tr><td><code>ss -lntp</code></td><td><code>-l</code> đang nghe, <code>-n</code> không đổi số thành tên, <code>-t</code> TCP, <code>-p</code> kèm tiến trình.</td></tr>
</table>
<p>Khác với cách <code>--network container:bug</code> (Bài 8.4), cách này thấy được cả cột <code>Process</code>: dòng thứ nhất là thủ phạm (<code>python</code> nghe <code>127.0.0.1:3000</code>), dòng thứ hai xác nhận DNS nhúng đúng là socket của <code>dockerd</code>. Câu hỏi 1 và 2 trả lời xong trong một lệnh.</p>

<h3>Đọc bốn câu lệnh quan trọng</h3>
${slide('dk-08', 28, 'dig → nc → curl -v → tcpdump: mỗi công cụ trả lời một tầng')}
<pre><code><span class="tok-comment"># DNS: cái tên có được biết không, và trỏ tới địa chỉ nào?</span>
docker run --rm --network shop nicolaka/netshoot dig +short db
docker run --rm --network shop nicolaka/netshoot dig db @127.0.0.11 +noall +answer</code></pre>
<div class="out">172.19.0.4
db.			600	IN	A	172.19.0.4</div>
<pre><code><span class="tok-comment"># Với tới được không: refused, timeout, hay open?</span>
docker run --rm --network shop nicolaka/netshoot sh -c 'nc -zv db 5432; nc -zv -w3 db 9999'</code></pre>
<div class="out">Connection to db (172.26.0.4) 5432 port [tcp/postgresql] succeeded!
nc: connect to db (172.26.0.4) port 9999 (tcp) failed: Connection refused</div>
<pre><code><span class="tok-comment"># HTTP: thật ra đã xảy ra chuyện gì, kể cả bắt tay TLS và chuyển hướng</span>
docker run --rm --network shop nicolaka/netshoot \\
  curl -sS -o /dev/null -v --max-time 5 http://api:3000/health 2&gt;&amp;1 | grep -E '^[*&gt;&lt;]' | head -8</code></pre>
<div class="out">*   Trying 172.19.0.2:3000...
* Connected to api (172.19.0.2) port 3000
&gt; GET /health HTTP/1.1
&gt; Host: api:3000
&lt; HTTP/1.1 200 OK
&lt; content-type: application/json</div>
<pre><code><span class="tok-comment"># Gói tin: khi bạn cần thấy tận mắt là lưu lượng có tới thật</span>
docker run --rm --net container:api --cap-add NET_ADMIN nicolaka/netshoot \\
  timeout 8 tcpdump -ni any -c 5 'tcp port 5432'</code></pre>
<div class="out">tcpdump: data link type LINUX_SLL2
12:04:11.882301 eth0  Out IP 172.19.0.2.54118 &gt; 172.19.0.4.5432: Flags [S], seq 2118…
12:04:11.882604 eth0  In  IP 172.19.0.4.5432 &gt; 172.19.0.2.54118: Flags [S.], seq 3391…
12:04:11.882651 eth0  Out IP 172.19.0.2.54118 &gt; 172.19.0.4.5432: Flags [.], ack 1</div>
<p>Một cú bắt tay ba bước trọn vẹn — SYN, SYN-ACK, ACK — chứng minh mạng đang làm đúng việc của nó và đẩy cuộc điều tra sang phía ứng dụng: xác thực, TLS, lệch giao thức, hay một truy vấn chậm. Nếu chỉ thấy các gói SYN đi ra mà không có hồi đáp thì gói đang bị vứt, và bạn đang nhìn vào một tường lửa hay một vấn đề định tuyến chứ không phải vào mã của mình.</p>

<h3>Refused và timeout nhìn trên dây: chạy thử và đo giờ</h3>
${slide('dk-08', 27, 'Refused và timeout nhìn trên dây')}
<p>Bảng "refused khác timeout" ở đầu bài sẽ dễ nhớ hơn nhiều khi bạn đo được thời gian và thấy tận mắt các gói tin. Hai phép thử, từ cùng một kiểu container trên mạng <code>shop</code> (mạng con <code>172.26.0.0/16</code>):</p>
<pre><code class="language-bash">docker run --rm --network shop alpine:3.20 sh -c 'time nc -z -w3 db 9999; echo exit=\$?'
docker run --rm --network shop alpine:3.20 sh -c 'time nc -z -w3 172.26.0.250 3000; echo exit=\$?'</code></pre>
<div class="out">exit=1
real	0m 0.00s
exit=1
real	0m 3.00s</div>
<p>Cùng exit 1, nhưng một cái mất 0 giây, một cái mất đúng 3 giây — đúng bằng <code>-w3</code>. Bắt gói bằng tcpdump ngay trong namespace của bên gọi cho biết vì sao:</p>
<pre><code class="language-bash">docker run --rm --net container:api --cap-add NET_ADMIN nicolaka/netshoot \\
  timeout 12 tcpdump -ni eth0 -c 5 'tcp port 9999 or (host 172.26.0.250 and tcp port 5432)'
<span class="tok-comment"># (ở terminal khác, từ api: nc -z -w2 db 9999; nc -z -w3 172.26.0.250 5432)</span></code></pre>
<div class="out">18:43:37.168285 IP 172.26.0.2.37821 &gt; 172.26.0.4.9999: Flags [S], seq 2676868341, win 64240, options [mss 1460,sackOK,TS …
18:43:37.168324 IP 172.26.0.4.9999 &gt; 172.26.0.2.37821: Flags [R.], seq 0, ack 2676868342, win 0, length 0</div>
<pre><code class="language-bash">docker run --rm --net container:api --cap-add NET_ADMIN nicolaka/netshoot \\
  timeout 10 tcpdump -ni eth0 -c 4 'host 172.26.0.250 or (arp and host 172.26.0.250)'</code></pre>
<div class="out">18:44:00.914990 ARP, Request who-has 172.26.0.250 tell 172.26.0.2, length 28
18:44:00.915031 ARP, Request who-has 172.26.0.250 tell 172.26.0.2, length 28
18:44:01.932100 ARP, Request who-has 172.26.0.250 tell 172.26.0.2, length 28
18:44:01.932259 ARP, Request who-has 172.26.0.250 tell 172.26.0.2, length 28</div>
<ul>
<li><strong>Refused:</strong> một gói <code>[S]</code> (SYN — "cho tôi kết nối") đi, một gói <code>[R.]</code> (RST — "không có ai ở cổng này") về ngay trong 0,04 mili giây. Có máy trả lời ⇒ đúng máy, sai cổng hoặc dịch vụ chết.</li>
<li><strong>Timeout:</strong> không có nổi một SYN. Địa chỉ nằm cùng mạng con nên trước hết phải hỏi ARP (giao thức hỏi "IP này là card mạng nào?"); không ai nhận nên câu hỏi lặp mãi tới lúc hết giờ. Nếu đích ở mạng con KHÁC hoặc bị tường lửa vứt, bạn sẽ thấy SYN đi ra lặp lại mà không có gì về.</li>
</ul>
<table>
<tr><th>Cờ</th><th>Nghĩa là</th></tr>
<tr><td><code>nc -z -v -w3</code></td><td><code>-z</code> chỉ thử kết nối, không gửi dữ liệu; <code>-v</code> in kết quả; <code>-w3</code> chờ tối đa 3 giây.</td></tr>
<tr><td><code>dig +short</code> · <code>dig X @127.0.0.11</code> · <code>+noall +answer</code></td><td>Chỉ in IP · hỏi đúng máy chủ DNS đó · chỉ in phần trả lời.</td></tr>
<tr><td><code>curl -sS -o /dev/null -v --max-time 5</code></td><td>Im lặng nhưng vẫn in lỗi · vứt thân trang · in từng bước kết nối/gửi/nhận · bỏ cuộc sau 5 giây.</td></tr>
<tr><td><code>tcpdump -n -i eth0 -c 5 'bộ lọc'</code></td><td>Không đổi IP thành tên · nghe card eth0 (<code>any</code> = mọi card) · bắt 5 gói rồi dừng · chỉ gói khớp bộ lọc.</td></tr>
<tr><td><code>--cap-add NET_ADMIN</code></td><td>tcpdump cần quyền quản trị mạng để mở card ở chế độ bắt gói.</td></tr>
</table>

<h3>Chạy thử từng bước: một ca hỏng, bốn câu hỏi, từ đầu tới cuối</h3>
<p>Ghép cả bài lại trên đúng container <code>bug</code> ở trên (app Python nghe <code>127.0.0.1:3000</code>), rồi so với <code>app</code> nghe <code>0.0.0.0:3000</code>. Mọi dòng output là thật, trên máy Mac:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Câu 1 + 2 · có nghe không, nghe ở đâu</span><span class="lz-t">nsenter -t \$PID -n ss -lntp</span><span class="lz-d"><code>127.0.0.1:3000 users:(("python",…))</code> ⇒ CÓ nghe, nhưng chỉ loopback. Đã tìm ra thủ phạm; ba câu sau chỉ để xác nhận.</span></div>
  <div class="lz-step"><span class="lz-k">Câu 3 · tên có phân giải?</span><span class="lz-t">nc -zv -w3 bug 3000</span><span class="lz-d">nc in <code>bug (172.26.0.9)</code> ⇒ DNS ổn. So với tên không tồn tại: <code>nc: getaddrinfo for host "khongcoai" port 3000: Name does not resolve</code>.</span></div>
  <div class="lz-step"><span class="lz-k">Câu 4 · gói có tới?</span><span class="lz-t">Connection refused</span><span class="lz-d">Có trả lời ngay ⇒ đúng máy, không ai nghe cổng đó trên eth0 — khớp với câu 2.</span></div>
  <div class="lz-step"><span class="lz-k">Sửa và kiểm lại</span><span class="lz-t">--bind 0.0.0.0</span><span class="lz-d">Container <code>app</code> nghe <code>0.0.0.0:3000</code>: <code>Connection to dk08-app (172.26.0.8) 3000 port [tcp/*] succeeded!</code></span></div>
</div>
<pre><code class="language-bash">docker run --rm --network shop nicolaka/netshoot sh -c 'nc -zv -w3 bug 3000; nc -zv -w3 dk08-app 3000; nc -zv -w3 khongcoai 3000'</code></pre>
<div class="out">nc: connect to bug (172.26.0.9) port 3000 (tcp) failed: Connection refused
Connection to dk08-app (172.26.0.8) 3000 port [tcp/*] succeeded!
nc: getaddrinfo for host "khongcoai" port 3000: Name does not resolve</div>
<p>Ba dòng, ba chẩn đoán khác nhau, và mỗi dòng tự nói nó thuộc câu hỏi nào: <code>getaddrinfo … Name does not resolve</code> là câu 3 (DNS), <code>Connection refused</code> là câu 4 có trả lời, <code>succeeded</code> là mọi tầng mạng đều ổn. Tập đọc thông báo lỗi theo cách này và bạn sẽ không bao giờ nói chung chung "mạng hỏng" nữa.</p>

<h3>Sách công thức</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"ECONNREFUSED 127.0.0.1:5432" từ container ứng dụng</span><span class="v">Ứng dụng đang dùng <code>localhost</code> cho cơ sở dữ liệu. Trong container, chữ đó nghĩa là chính nó. Hãy đổi host thành tên dịch vụ (<code>db</code>, <code>postgres</code>) — đây là lỗi cấu hình, không phải lỗi mạng.</span></div>
  <div class="kv"><span class="k">"getaddrinfo ENOTFOUND db"</span><span class="v">Tên không phân giải được: hai container không chung mạng tự tạo nào, hoặc bạn đang ở bridge mặc định. Chạy <code>docker inspect -f '{{ json .NetworkSettings.Networks }}'</code> trên cả hai rồi đối chiếu.</span></div>
  <div class="kv"><span class="k">Chạy được với <code>docker compose up</code>, hỏng với <code>docker run</code></span><span class="v">Compose tạo một cái mạng và gắn mọi thứ vào đó; <code>docker run</code> mặc định về bridge mặc định vốn không có DNS. Hãy thêm <code>--network</code>.</span></div>
  <div class="kv"><span class="k">Chỉ timeout trên CI</span><span class="v">Thường là lối ra: runner chặn lưu lượng đi ra, hoặc một proxy doanh nghiệp cần truyền <code>HTTP_PROXY</code>/<code>HTTPS_PROXY</code> vào container. Hãy thử bằng <code>curl -v</code> tới một máy chủ đã biết, đừng thử tới dịch vụ của chính bạn.</span></div>
  <div class="kv"><span class="k">Trễ vài giây ngẫu nhiên ở các lời gọi đi ra</span><span class="v">Bản ghi AAAA của IPv6 mà container không định tuyến được (Bài 8.4), hoặc một bộ chuyển tiếp DNS hỏng. Hãy <code>dig</code> cái tên đó xem có bản ghi AAAA không; <code>curl -4</code> để xác nhận.</span></div>
  <div class="kv"><span class="k">"address already in use" lúc khởi động</span><span class="v">Một tiến trình trên máy chủ — hay gặp là một dev server — đang giữ cổng đó. (Container KHÁC đang chạy thì báo <code>port is already allocated</code>; container đã dừng không giữ cổng nào — Bài 8.2.) <code>ss -lntp 'sport = :8080'</code> gọi tên nó ra.</span></div>
  <div class="kv"><span class="k">Với tới được từ máy chủ, không với tới được từ container khác</span><span class="v">Bạn đang thử cổng công bố trên máy chủ ở một phía và cổng container ở phía kia. Giữa các container thì dùng cổng của <em>container</em> và tên dịch vụ.</span></div>
  <div class="kv"><span class="k">Mọi thứ phân giải được, không gì kết nối được, sau khi bật VPN</span><span class="v">Mạng con mặc định của Docker (172.17–172.31) đụng với tuyến của VPN. Hãy đặt <code>default-address-pools</code> trong <code>/etc/docker/daemon.json</code> rồi khởi động lại daemon.</span></div>
</div>

<h3>Một script phân loại nhanh mười giây</h3>
${slide('dk-08', 29, 'Kịch bản phân loại 10 giây')}
<pre><code><span class="tok-comment"># Container nào ở đâu, và cái gì công bố ở chỗ nào?</span>
docker ps --format 'table {{.Names}}\\t{{.Ports}}'
docker inspect -f '{{ .Name }} → {{ range $n, $v := .NetworkSettings.Networks }}{{ $n }} {{ $v.IPAddress }} {{ end }}' \\
  $(docker ps -q)
sudo ss -lntp | grep docker-proxy</code></pre>
<div class="out">NAMES     PORTS
proxy     0.0.0.0:80-&gt;80/tcp, 0.0.0.0:443-&gt;443/tcp
backend   3000/tcp
db        5432/tcp
/proxy → public 172.20.0.3
/backend → private 172.21.0.2 public 172.20.0.2
/db → private 172.21.0.3
LISTEN 0 4096 0.0.0.0:80   0.0.0.0:* users:(("docker-proxy",pid=2211,fd=4))
LISTEN 0 4096 0.0.0.0:443  0.0.0.0:* users:(("docker-proxy",pid=2233,fd=4))</div>
<p>Ba câu lệnh, và toàn bộ cấu trúc hiện lên màn hình: container nào trên mạng nào với địa chỉ nào, cổng nào được công bố và ở giao diện nào. Phần lớn những báo cáo kiểu "mạng hỏng rồi" được trả lời ngay ở đây — một container thiếu khỏi một mạng, hoặc một cổng công bố ở chỗ lẽ ra không nên — trước khi bạn chạy một công cụ chẩn đoán nào.</p>

<p>Chạy thật trên máy Mac với stack hai tầng của Bài 8.3 (lọc theo tên để không lẫn container khác trên máy):</p>
<pre><code class="language-bash">docker ps --filter name=dk08- --format 'table {{.Names}}\\t{{.Ports}}'
docker inspect -f '{{ .Name }} → {{ range \$n, \$v := .NetworkSettings.Networks }}{{ \$n }} {{ \$v.IPAddress }} {{ end }}' \\
  \$(docker ps -q --filter name=dk08-proxy --filter name=dk08-backend --filter name=dk08-db)</code></pre>
<div class="out">NAMES          PORTS
…
dk08-proxy     127.0.0.1:18080-&gt;80/tcp
dk08-backend   80/tcp
dk08-db        5432/tcp
…
/dk08-proxy → dk08-public 172.25.0.3
/dk08-backend → dk08-private 172.24.0.3 dk08-public 172.25.0.2
/dk08-db → dk08-private 172.24.0.2
/dk08-db-b → dk08-app-net 172.23.0.2
/dk08-db-a → bridge 172.17.0.9</div>
<p>Hai điều đáng để ý. Bộ lọc <code>name=dk08-db</code> khớp CHUỖI CON, nên nó kéo theo cả <code>dk08-db-a</code> và <code>dk08-db-b</code> — nhớ điều này khi dọn dẹp bằng bộ lọc. Và dòng cuối là một ca "mạng hỏng" điển hình mà lệnh này bắt được ngay: <code>dk08-db-a</code> nằm trên <code>bridge</code> mặc định, nên không container nào gọi nó bằng tên được. Còn lệnh thứ ba của script gốc, <code>ss -lntp | grep docker-proxy</code>, phải chạy bằng <code>sudo</code>: không có sudo, <code>ss</code> không in tên tiến trình của người dùng khác, grep ra rỗng — đo thật trên máy Linux của khoá — và bạn tưởng không có cổng nào mở.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> 15 phút trước buổi demo đồ án, trang web của nhóm báo lỗi 502: nginx không gọi được app. Không ai sửa gì "từ hôm qua". Bạn không đoán mò — bạn đi đúng bốn câu hỏi, ghi mỗi câu một dòng kết luận, rồi mới sửa.</p><ol>
<li>Dựng lại ca hỏng: <code>docker network create thu-demo</code>, rồi <code>docker run -d --name thu-app --network thu-demo python:3.12-alpine python -m http.server 3000 --bind 127.0.0.1</code>.</li>
<li>Câu 1 + 2: <code>docker run --rm --network container:thu-app alpine:3.20 netstat -lnt</code>. App có nghe không? Nghe ở địa chỉ nào?</li>
<li>Câu 3: <code>docker run --rm --network thu-demo alpine:3.20 getent hosts thu-app</code>.</li>
<li>Câu 4: <code>docker run --rm --network thu-demo alpine:3.20 sh -c 'time nc -z -w3 thu-app 3000; echo exit=\$?'</code> — refused hay timeout? Đọc cột <code>real</code>.</li>
<li>Sửa: <code>docker rm -f thu-app</code>, chạy lại với <code>--bind 0.0.0.0</code>; lặp câu 4 với <code>nc -z -w3 thu-app 3000 &amp;&amp; echo open</code>. Dọn: <code>docker rm -f thu-app; docker network rm thu-demo</code>.</li></ol>
<p><strong>Đạt khi:</strong> bạn viết được bốn dòng kết luận — (1) có nghe, (2) chỉ <code>127.0.0.1:3000</code> ⇒ thủ phạm, (3) tên ra IP ⇒ DNS ổn, (4) <code>exit=1</code> với <code>real 0m 0.00s</code> ⇒ refused, không phải timeout — và sau khi sửa, lệnh cuối in <code>open</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Connection refused (bị từ chối)</span><span class="v">Có máy trả lời "không": gói RST về ngay — đúng máy, sai cổng hoặc dịch vụ không nghe.</span></div>
  <div class="kv"><span class="k">Timeout (hết giờ chờ)</span><span class="v">Không ai trả lời: gói bị vứt (tường lửa, khác mạng) hoặc địa chỉ không tồn tại.</span></div>
  <div class="kv"><span class="k">SYN / SYN-ACK / ACK (bắt tay ba bước)</span><span class="v">Ba gói mở một kết nối TCP; thấy đủ ba gói là tầng mạng đã làm xong việc.</span></div>
  <div class="kv"><span class="k">RST (gói ngắt)</span><span class="v">Gói báo "không có kết nối/không ai nghe" — nguồn gốc của thông báo Connection refused.</span></div>
  <div class="kv"><span class="k">ARP (hỏi địa chỉ phần cứng)</span><span class="v">Câu hỏi "IP này là card nào?" trong cùng mạng con; không ai nhận thì không có nổi một SYN.</span></div>
  <div class="kv"><span class="k">netshoot (ảnh gỡ lỗi mạng)</span><span class="v">Ảnh chứa sẵn dig, nc, curl, ss, tcpdump… để chạy cạnh app mà không sửa ảnh app.</span></div>
  <div class="kv"><span class="k">nsenter (nhập namespace)</span><span class="v">Chạy một lệnh bên trong namespace của một tiến trình khác; <code>-n</code> là namespace mạng.</span></div>
  <div class="kv"><span class="k">Vantage point (góc nhìn)</span><span class="v">Nơi bạn đứng để thử: phải trùng với bên đang hỏng, không phải shell của máy chủ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Bốn câu hỏi theo thứ tự: có nghe không → nghe ở đâu → tên có phân giải → gói có tới; mỗi câu loại cả một nhóm nguyên nhân.</li>
<li>Hai câu đầu trả lời bằng MỘT lệnh <code>ss -lntp</code> trong namespace của app (<code>--network container:</code>, hoặc <code>nsenter</code> qua container phụ khi không có sudo).</li>
<li>Refused = có trả lời (RST ngay, 0 giây); timeout = im lặng (hết đúng thời gian chờ) — hai chẩn đoán khác nhau.</li>
<li>Đọc thông báo đúng tầng: <code>Name does not resolve</code> là DNS, <code>Connection refused</code> là cổng, <code>succeeded</code> là mạng ổn.</li>
<li><code>docker ps --format</code> + <code>docker inspect … Networks</code> cho cả bản đồ trong mười giây; <code>ss -lntp | grep docker-proxy</code> cần <code>sudo</code>.</li>
<li>Luôn thử từ đúng góc nhìn của bên hỏng: netshoot trên cùng mạng hoặc trong cùng namespace.</li>
</ul>


<a class="link-card" href="https://github.com/nicolaka/netshoot" target="_blank" rel="noopener">
  <span class="lc-ico">🥾</span>
  <span class="lc-body"><span class="lc-title">netshoot</span><span class="lc-sub">Ảnh gỡ lỗi và sách công thức của nó: nhập vào namespace của container khác, bắt lưu lượng, và thử DNS. Hãy giữ lệnh <code>--network container:</code> trong sổ tay.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man1/nsenter.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">🚪</span>
  <span class="lc-body"><span class="lc-title">nsenter(1)</span><span class="lc-sub">Nhập vào bất kỳ namespace nào của một tiến trình đang chạy, từ máy chủ. <code>-n</code> cho mạng, <code>-m</code> cho mount, <code>-p</code> cho PID. Cửa thoát hiểm khi một cái ảnh hoàn toàn không có shell.</span></span>
</a>
<a class="link-card" href="https://www.tcpdump.org/manpages/tcpdump.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">📡</span>
  <span class="lc-body"><span class="lc-title">tcpdump(1)</span><span class="lc-sub">Cú pháp bộ lọc đáng bỏ hai mươi phút: <code>host</code>, <code>port</code>, <code>tcp[tcpflags]</code>, và <code>-i any</code>. Đọc được một cú bắt tay là cách nhanh nhất để quyết định vấn đề nằm ở mạng hay ở ứng dụng.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: chẩn đoán sáu stack hỏng</span><span class="lc-sub">Bài chấm điểm: sáu tình huống, mỗi cái một lỗi — gắn vào loopback, thiếu mạng, ánh xạ cổng viết ngược, tường lửa vứt gói, một giả định DNS đã cũ, và một dịch vụ chưa từng khởi động. Tìm ra từng cái bằng bốn câu hỏi.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> gỡ lỗi từ máy chủ trong khi vấn đề nằm GIỮA các container. Lệnh <code>curl localhost:8080</code> từ shell của bạn kiểm cổng công bố và góc nhìn của máy chủ — một đường hoàn toàn khác với đường một container với tới container khác qua cây cầu. Nó có thể thành công trong khi container-tới-container thất bại (dịch vụ gắn đúng cho máy chủ nhưng container bên gọi lại ở nhầm mạng), và nó có thể thất bại trong khi mọi thứ vẫn ổn (chẳng có gì được công bố, vì chẳng cần công bố). Hãy thử từ ĐÚNG góc nhìn của bên đang hỏng: <code>docker run --rm --network &lt;mạng của bên gọi&gt; nicolaka/netshoot</code>, rồi chạy phép kiểm của bạn từ đó. Khớp được góc nhìn đã là phần lớn kỹ năng.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Hỏi bốn câu theo thứ tự — có đang nghe không, nghe ở địa chỉ nào, tên có phân giải được không, gói tin có đi lọt không — và mỗi câu loại bỏ nguyên một nhóm nguyên nhân. <em>Refused</em> và <em>timeout</em> là hai chẩn đoán khác nhau: một cái nghĩa là có thứ gì trả lời không, cái kia nghĩa là im lặng. Và hãy thử từ đúng góc nhìn của thứ đang hỏng, bằng <code>--network container:&lt;tên&gt;</code> hoặc một container netshoot trên cùng mạng.</p>
</div>
`,
    },
    /* ─────────────────────────── 8.6 ─────────────────────────── */
    {
      title: '8.6 — Quiz: networking|||8.6 — Trắc nghiệm: mạng',
      slug: 'dk-8-6-quiz',
      type: 'QUIZ',
      description: 'Mười tình huống thật: ENOTFOUND vì bridge mặc định, network connect lúc đang chạy, Postgres lộ ra dù có UFW, -p viết ngược, hai lỗi cổng bận, dịch vụ nghe 127.0.0.1, mạng hai tầng, host.docker.internal trên Mac và Linux, refused khác timeout, và soi socket khi không có sudo.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations from real work — the kind that eat an afternoon when you do not have the model, and five minutes when you do. Read the explanation after submitting, especially for the questions you got right by guessing.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can show with <code>/etc/resolv.conf</code> why names resolve on a user-defined network and not on the default bridge, and fix it with <code>docker network create</code> / <code>connect</code>.</li>
<li>I can read <code>-p [IP:]HOST:CONTAINER</code>, audit published ports with <code>docker ps --format</code>, and explain why a published port bypasses UFW/firewalld.</li>
<li>I can tell <code>port is already allocated</code> from <code>address already in use</code>, and I know to recreate a container after a port error.</li>
<li>I can build a two-tier layout where the proxy cannot resolve the database and the database cannot reach the internet.</li>
<li>I know how <code>host.docker.internal</code> differs between Docker Desktop and Linux, and why a host service must listen on <code>0.0.0.0</code> on Linux.</li>
<li>I can run the four diagnostic questions, and tell refused from timeout by timing and by tcpdump.</li>
</ul>
${slide('dk-08', 31, 'Bảng tra nhanh Chương 8')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống từ việc thật — loại tình huống ngốn cả buổi chiều nếu chưa có mô hình, và năm phút khi đã có. Đọc phần giải thích sau khi nộp, nhất là những câu bạn đúng nhờ đoán.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi chỉ ra được bằng <code>/etc/resolv.conf</code> vì sao tên phân giải được trên mạng tự tạo mà không được trên bridge mặc định, và sửa bằng <code>docker network create</code> / <code>connect</code>.</li>
<li>Tôi đọc được <code>-p [IP:]MÁYCHỦ:CONTAINER</code>, rà cổng đã công bố bằng <code>docker ps --format</code>, và giải thích vì sao cổng đã công bố đi vòng qua UFW/firewalld.</li>
<li>Tôi phân biệt được <code>port is already allocated</code> với <code>address already in use</code>, và biết phải tạo lại container sau một lần lỗi cổng.</li>
<li>Tôi dựng được mạng hai tầng: proxy không phân giải nổi tên CSDL, CSDL không ra được Internet.</li>
<li>Tôi biết <code>host.docker.internal</code> khác nhau thế nào giữa Docker Desktop và Linux, và vì sao trên Linux dịch vụ máy chủ phải nghe <code>0.0.0.0</code>.</li>
<li>Tôi đi được bốn câu hỏi chẩn đoán, và phân biệt refused với timeout bằng thời gian và bằng tcpdump.</li>
</ul>
${slide('dk-08', 31, 'Bảng tra nhanh Chương 8')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'A SWP391 teammate starts the API and Postgres with two separate `docker run` commands (no `--network`). The API logs `getaddrinfo ENOTFOUND db`, yet the same pair works under `docker compose up`. What is the real cause?|||Bạn cùng nhóm SWP391 chạy API và Postgres bằng hai lệnh `docker run` rời (không có `--network`). API báo `getaddrinfo ENOTFOUND db`, nhưng cùng hai dịch vụ đó chạy bằng `docker compose up` thì được. Nguyên nhân thật là gì?',
            options: [
              'The db container has not published 5432 with -p, so its name is hidden from other containers|||Container db chưa công bố 5432 bằng -p, nên tên của nó bị giấu khỏi các container khác',
              'Both sit on the default bridge, whose resolv.conf points at the host DNS — only user-defined networks get the 127.0.0.11 resolver|||Cả hai nằm trên bridge mặc định, nơi resolv.conf trỏ ra DNS máy chủ — chỉ mạng tự tạo mới có bộ phân giải 127.0.0.11',
              'The Postgres image lacks an EXPOSE 5432 line, so Docker never registers its name in DNS|||Ảnh Postgres thiếu dòng EXPOSE 5432, nên Docker không bao giờ đăng ký tên của nó vào DNS',
              'Container names only resolve as fully qualified names such as db.local, which compose adds automatically|||Tên container chỉ phân giải ở dạng đầy đủ như db.local, thứ mà compose tự thêm vào',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: With no --network flag, containers land on the default bridge; Docker writes the host’s DNS server into their /etc/resolv.conf, and the host DNS has never heard of "db" (NXDOMAIN). Compose creates [project]_default, a user-defined network with the embedded resolver at 127.0.0.11. Publishing with -p is tempting but irrelevant: it only concerns the host boundary, never names between containers.|||VI: Không có cờ --network thì container rơi vào bridge mặc định; Docker ghi DNS của máy chủ vào /etc/resolv.conf của nó, mà DNS máy chủ không hề biết "db" (NXDOMAIN). Compose tạo mạng [dự-án]_default — một mạng tự tạo có bộ phân giải nhúng ở 127.0.0.11. Công bố bằng -p nghe hợp lý nhưng không liên quan: nó chỉ là chuyện ranh giới máy chủ, không bao giờ là chuyện tên giữa các container.',
          },
          {
            question: 'The database container `thu-db` is running on the default bridge and must not be restarted. You run `docker network create thu-net` and `docker network connect thu-net thu-db`. What does `thu-db` look like afterwards?|||Container CSDL `thu-db` đang chạy trên bridge mặc định và không được phép khởi động lại. Bạn chạy `docker network create thu-net` rồi `docker network connect thu-net thu-db`. Sau đó `thu-db` trông thế nào?',
            options: [
              'Docker restarts it briefly to move its only NIC from the default bridge onto thu-net|||Docker khởi động lại nó một chút để chuyển card mạng duy nhất từ bridge mặc định sang thu-net',
              'It leaves the default bridge and keeps just one interface, eth0, now numbered in thu-net|||Nó rời bridge mặc định và chỉ còn một giao diện eth0, giờ mang địa chỉ của thu-net',
              'The command fails: a running container cannot join a network, you must recreate it|||Lệnh báo lỗi: container đang chạy không vào mạng được, phải tạo lại nó',
              'It gains a second NIC, eth1, on thu-net without restarting, keeps eth0, and its default route stays on eth0|||Nó có thêm card thứ hai eth1 trên thu-net mà không khởi động lại, vẫn giữ eth0, và tuyến mặc định vẫn qua eth0',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: network connect plugs another veth into a running container: `ip -o -4 addr` shows lo, eth0 (172.17.x) and eth1 (the new network), and `ip route` still has a single default via eth0 — the new NIC only adds a route to its own subnet. Nothing restarts, and the name now resolves on thu-net. "It moves off the default bridge" sounds natural, but connect adds; only `docker network disconnect` removes.|||VI: network connect cắm thêm một veth vào container đang chạy: `ip -o -4 addr` cho thấy lo, eth0 (172.17.x) và eth1 (mạng mới), còn `ip route` vẫn chỉ một dòng default qua eth0 — card mới chỉ thêm tuyến tới mạng con của nó. Không có gì khởi động lại, và tên giờ phân giải được trên thu-net. "Nó rời bridge mặc định" nghe tự nhiên, nhưng connect là THÊM; chỉ `docker network disconnect` mới gỡ.',
          },
          {
            question: 'Your VPS runs UFW allowing only 22, 80 and 443. The compose file has `ports: - "5432:5432"` for Postgres "for migrations from a laptop". A stranger logs into the database. How did the packet get past UFW?|||VPS của bạn bật UFW chỉ cho 22, 80 và 443. File compose có `ports: - "5432:5432"` cho Postgres "để chạy migration từ laptop". Một người lạ đăng nhập được vào CSDL. Gói tin đã qua UFW bằng cách nào?',
            options: [
              'Docker DNATs it in PREROUTING to the container IP, so it takes FORWARD; UFW’s port rules live in INPUT and are never consulted|||Docker DNAT nó ở PREROUTING sang IP container, nên nó đi đường FORWARD; luật cổng của UFW nằm ở INPUT và không bao giờ được hỏi',
              'Docker silently disables UFW whenever a container publishes a port, and re-enables it on shutdown|||Docker lặng lẽ tắt UFW mỗi khi có container công bố cổng, và bật lại lúc tắt máy',
              'The Postgres image asks the router to open 5432 via UPnP, bypassing the server firewall entirely|||Ảnh Postgres nhờ router mở cổng 5432 qua UPnP, đi vòng hẳn tường lửa của máy chủ',
              'EXPOSE 5432 in the Postgres image has higher priority than UFW, so it overrides the deny rule|||EXPOSE 5432 trong ảnh Postgres có độ ưu tiên cao hơn UFW, nên nó đè luật chặn',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Reading the rules shows it: `-A PREROUTING -m addrtype --dst-type LOCAL -j DOCKER` then `-j DNAT --to-destination 172.x:5432`. After DNAT the destination is no longer the host, so the packet is forwarded; firewalld even has `ct status dnat accept` in both INPUT and FORWARD. Fix: publish nothing (API uses db:5432), or 127.0.0.1:5432:5432 plus an SSH tunnel, or filter in DOCKER-USER. EXPOSE is only metadata and opens nothing.|||VI: Đọc luật là thấy: `-A PREROUTING -m addrtype --dst-type LOCAL -j DOCKER` rồi `-j DNAT --to-destination 172.x:5432`. Sau DNAT đích không còn là máy chủ nên gói được chuyển tiếp (FORWARD); firewalld còn có sẵn `ct status dnat accept` ở cả INPUT lẫn FORWARD. Sửa: không công bố gì (API gọi db:5432), hoặc 127.0.0.1:5432:5432 kèm đường hầm SSH, hoặc lọc trong DOCKER-USER. EXPOSE chỉ là siêu dữ liệu, không mở gì cả.',
          },
          {
            question: 'You run `docker run -d --name web -p 18084:8080 nginx:1.27-alpine`. `docker ps` shows it Up, but `curl http://127.0.0.1:18084/` on the host prints `Recv failure: Connection reset by peer`. What is wrong?|||Bạn chạy `docker run -d --name web -p 18084:8080 nginx:1.27-alpine`. `docker ps` báo Up, nhưng `curl http://127.0.0.1:18084/` trên máy chủ in `Recv failure: Connection reset by peer`. Sai ở đâu?',
            options: [
              'The host firewall resets connections to high ports until you add an allow rule for 18084|||Tường lửa máy chủ reset mọi kết nối tới cổng cao cho tới khi thêm luật cho phép 18084',
              'nginx crashed on start; Up only means the container was created, not that its process runs|||nginx đã chết lúc khởi động; Up chỉ có nghĩa là container đã được tạo, không phải tiến trình đang chạy',
              'The mapping points at container port 8080, but nginx listens on 80 inside — the right-hand number must be the app’s port|||Ánh xạ trỏ vào cổng 8080 của container, nhưng nginx nghe 80 bên trong — số bên phải phải là cổng của ứng dụng',
              'docker-proxy is disabled on this host, so loopback connections to published ports always reset|||docker-proxy bị tắt trên máy này, nên kết nối loopback tới cổng công bố luôn bị reset',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: -p reads HOST:CONTAINER. The host side works — docker-proxy accepts the connection — then finds nothing listening on 8080 inside and the connection is reset; from another machine the same typo shows as "Couldn’t connect to server". Up really does mean PID 1 is alive (a crashed nginx would show Exited). The fix is -p 18084:80; `docker port web` is the first thing to reread.|||VI: -p đọc là MÁYCHỦ:CONTAINER. Phía máy chủ vẫn chạy — docker-proxy nhận kết nối — rồi thấy bên trong không ai nghe 8080 nên kết nối bị reset; từ máy khác cùng lỗi đánh máy đó hiện thành "Couldn’t connect to server". Up thật sự nghĩa là PID 1 còn sống (nginx chết thì báo Exited). Sửa: -p 18084:80; việc đầu tiên nên làm là đọc lại `docker port web`.',
          },
          {
            question: 'Starting a container fails with `Bind for 0.0.0.0:18080 failed: port is already allocated`. What does this particular wording tell you?|||Khởi động một container thì lỗi `Bind for 0.0.0.0:18080 failed: port is already allocated`. Cách viết cụ thể này nói lên điều gì?',
            options: [
              'A process outside Docker, such as a dev server, holds 18080; ss -lntp will name it|||Một tiến trình ngoài Docker, như một dev server, đang giữ 18080; ss -lntp sẽ gọi tên nó',
              'Another running container already publishes 18080; docker ps --filter publish=18080 finds it|||Một container KHÁC đang chạy đã công bố 18080; docker ps --filter publish=18080 tìm ra nó',
              'A stopped container from last week still reserves 18080 until you run docker rm on it|||Một container đã dừng từ tuần trước vẫn giữ chỗ 18080 cho tới khi bạn docker rm nó',
              'Ports above 1024 need root, so dockerd could not bind 18080 for an unprivileged user|||Cổng trên 1024 cần root, nên dockerd không gắn được 18080 cho người dùng thường',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Docker 29 has two messages. "port is already allocated" means Docker’s own bookkeeping says another container holds the port; "failed to bind host port … address already in use" means the kernel refused because a non-Docker process listens there. A stopped container releases its port (measured: after docker stop, ss shows nothing on it) — but a container that failed on its port stays Created, and starting it again later can give an Up container with no network, so rm -f and recreate.|||VI: Docker 29 có hai thông báo. "port is already allocated" nghĩa là sổ sách của chính Docker cho biết một container khác đang giữ cổng; "failed to bind host port … address already in use" nghĩa là nhân từ chối vì một tiến trình ngoài Docker đang nghe ở đó. Container đã dừng thì nhả cổng (đo thật: docker stop xong, ss không còn dòng nào) — nhưng container bị lỗi cổng nằm lại ở trạng thái Created, start lại sau đó có thể ra một container Up mà không có mạng, nên hãy rm -f rồi tạo lại.',
          },
          {
            question: 'From the frontend container, `getent hosts api` returns 172.26.0.9, yet every connection to `api:3000` is refused instantly. Inside api, `netstat -lnt` shows `127.0.0.1:3000 LISTEN`. What is the right fix?|||Từ container frontend, `getent hosts api` trả 172.26.0.9, vậy mà mọi kết nối tới `api:3000` đều bị từ chối tức thì. Bên trong api, `netstat -lnt` cho thấy `127.0.0.1:3000 LISTEN`. Sửa thế nào mới đúng?',
            options: [
              'Make the app listen on 0.0.0.0 (e.g. --bind 0.0.0.0 / -H 0.0.0.0); no port publishing is needed|||Cho ứng dụng nghe 0.0.0.0 (vd --bind 0.0.0.0 / -H 0.0.0.0); không cần công bố cổng nào',
              'Publish the port with -p 3000:3000 so other containers on the network can reach it|||Công bố cổng bằng -p 3000:3000 để các container khác trên mạng với tới được',
              'Add --network-alias api so the embedded DNS returns the loopback address instead|||Thêm --network-alias api để DNS nhúng trả về địa chỉ loopback thay vào đó',
              'Run the frontend with --network host so it shares a loopback with the API container|||Chạy frontend với --network host để nó dùng chung loopback với container API',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: DNS is fine (an IP came back) and refused-at-once means something answered no. The listener is on the api namespace’s own loopback, while the frontend’s packets arrive on eth0. -p is the tempting fix, but it only adds a host-side entry — containers already reach each other on the container port. --network host would put the frontend in the HOST’s namespace, not api’s, so it still could not see api’s loopback.|||VI: DNS ổn (có IP trả về), refused tức thì nghĩa là có thứ gì trả lời không. Ứng dụng đang nghe trên loopback riêng của namespace api, còn gói của frontend tới qua eth0. -p là cách sửa hấp dẫn, nhưng nó chỉ thêm lối vào phía máy chủ — các container vốn đã gọi nhau ở cổng container. --network host thì đưa frontend vào namespace của MÁY CHỦ chứ không phải của api, nên vẫn không thấy loopback của api.',
          },
          {
            question: 'You have a reverse proxy, a backend and Postgres. You want: the proxy reaches the backend; the backend reaches the database; a compromised proxy cannot even resolve the database; the database cannot reach the internet. Which layout does that?|||Bạn có reverse proxy, backend và Postgres. Yêu cầu: proxy gọi được backend; backend gọi được CSDL; proxy bị chiếm cũng không phân giải nổi tên CSDL; CSDL không ra được Internet. Cách bố trí nào đáp ứng?',
            options: [
              'All three on one user-defined network, with Postgres published only on 127.0.0.1:5432|||Cả ba trên một mạng tự tạo, Postgres chỉ công bố ở 127.0.0.1:5432',
              'Proxy and backend on one network, Postgres started with --network host for speed|||Proxy và backend chung một mạng, Postgres chạy --network host cho nhanh',
              'Proxy and Postgres on a public network, backend alone on an --internal network|||Proxy và Postgres trên mạng công khai, backend một mình trên mạng --internal',
              'Postgres and backend on an --internal network; backend also joined to a public network with the proxy|||Postgres và backend trên mạng --internal; backend gắn thêm vào một mạng công khai cùng proxy',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: A container only resolves names on networks it is attached to. The proxy has no interface on the internal network, so `getent hosts db` returns nothing ("db: not resolvable" in the real run), and --internal removes the default route, so the database gets "bad address" for example.com. The single-network option looks secure because of 127.0.0.1, but that only restricts the HOST side — the proxy could still reach db:5432 directly.|||VI: Container chỉ phân giải được tên trên những mạng nó đang gắn vào. Proxy không có giao diện nào trên mạng nội bộ nên `getent hosts db` rỗng ("db: not resolvable" khi chạy thật), còn --internal gỡ tuyến mặc định nên CSDL nhận "bad address" với example.com. Phương án một mạng trông an toàn nhờ 127.0.0.1, nhưng đó chỉ giới hạn phía MÁY CHỦ — proxy vẫn gọi thẳng db:5432 được.',
          },
          {
            question: 'On your Mac, a container reaches a dev server that listens on 127.0.0.1:8000 via `http://host.docker.internal:8000`. The same compose file on the Linux VPS fails. Which two changes make it work on Linux?|||Trên máy Mac, một container gọi được dev server đang nghe 127.0.0.1:8000 qua `http://host.docker.internal:8000`. Cùng file compose đó trên VPS Linux thì hỏng. Hai thay đổi nào làm nó chạy trên Linux?',
            options: [
              'Replace host.docker.internal with localhost, since on Linux containers share the host loopback|||Đổi host.docker.internal thành localhost, vì trên Linux container dùng chung loopback với máy chủ',
              'Enable IPv6 on the default bridge and let the service answer on ::1 instead of 127.0.0.1|||Bật IPv6 cho bridge mặc định và để dịch vụ trả lời ở ::1 thay cho 127.0.0.1',
              'Add extra_hosts "host.docker.internal:host-gateway", and make the service listen on 0.0.0.0 (or the bridge IP)|||Thêm extra_hosts "host.docker.internal:host-gateway", và cho dịch vụ nghe 0.0.0.0 (hoặc IP của cầu)',
              'Add --network host on the Mac as well, so both machines use identical networking|||Thêm --network host cả trên Mac, để hai máy dùng mạng y hệt nhau',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Measured: on Linux, `getent hosts host.docker.internal` exits 2 until you add the host-gateway entry (it becomes 172.17.0.1); then a service bound to 127.0.0.1 still refuses, because the packet arrives through docker0, not loopback — binding 0.0.0.0 fixes it. Docker Desktop hides both steps: the name is built in and it forwards to the Mac’s loopback. "Use localhost" is the classic trap: inside a container localhost is the container itself.|||VI: Đo thật: trên Linux, `getent hosts host.docker.internal` ra exit 2 cho tới khi thêm dòng host-gateway (thành 172.17.0.1); sau đó dịch vụ gắn 127.0.0.1 vẫn từ chối, vì gói tới qua docker0 chứ không qua loopback — nghe 0.0.0.0 là hết. Docker Desktop giấu cả hai bước: tên có sẵn và nó chuyển tới loopback của Mac. "Dùng localhost" là cái bẫy kinh điển: trong container, localhost là chính container.',
          },
          {
            question: 'From a container on network `shop` you run `time nc -z -w3 X 3000` against two targets. Both exit 1: one after `real 0m 0.00s`, the other after `real 0m 3.00s`. What do the two timings tell you?|||Từ một container trên mạng `shop`, bạn chạy `time nc -z -w3 X 3000` với hai đích. Cả hai exit 1: một cái sau `real 0m 0.00s`, cái kia sau `real 0m 3.00s`. Hai con số đó nói lên điều gì?',
            options: [
              '0.00 s is refused: an RST came back, so the host exists but nothing listens; 3.00 s is a timeout: silence, the packet was dropped or never delivered|||0,00 s là refused: có gói RST về, máy tồn tại nhưng không ai nghe; 3,00 s là timeout: im lặng, gói bị vứt hoặc không tới được',
              '0.00 s means DNS failed before connecting; 3.00 s means the server answered slowly but did answer|||0,00 s nghĩa là DNS hỏng trước khi kết nối; 3,00 s nghĩa là máy chủ trả lời chậm nhưng có trả lời',
              'Both mean a firewall blocked the port; the difference is only how busy the Docker host is|||Cả hai đều là tường lửa chặn cổng; khác biệt chỉ nằm ở chỗ máy chủ Docker bận tới đâu',
              '3.00 s means the service is starting up; retrying with a longer -w will eventually connect|||3,00 s nghĩa là dịch vụ đang khởi động; thử lại với -w dài hơn thì sớm muộn sẽ kết nối được',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: tcpdump in the caller’s namespace showed it: to a live container on a closed port, [S] out and [R.] back within 0.04 ms; to an unused address on the same subnet, only repeated "ARP, Request who-has" with no reply, until -w3 expired. A DNS failure is a different message altogether ("Name does not resolve"), and a slow service would eventually complete the handshake, not print 3.00 s with exit 1.|||VI: tcpdump trong namespace bên gọi cho thấy rõ: tới một container sống ở cổng đóng, [S] đi và [R.] về trong 0,04 ms; tới một địa chỉ chưa dùng cùng mạng con, chỉ có "ARP, Request who-has" lặp lại mà không ai đáp, cho tới khi hết -w3. DNS hỏng là một thông báo khác hẳn ("Name does not resolve"), còn dịch vụ chậm thì cuối cùng vẫn bắt tay xong, không in 3,00 s kèm exit 1.',
          },
          {
            question: 'An app container has no shell and no tools, and you have no sudo on the machine. You need to see which address it listens on AND the owning process name. What do you run?|||Container ứng dụng không có shell, không có công cụ gì, và bạn không có sudo trên máy. Bạn cần thấy nó nghe ở địa chỉ nào VÀ tên tiến trình đang giữ cổng. Chạy lệnh gì?',
            options: [
              'docker exec app ss -lntp — docker exec gives you the tools of the host inside the container|||docker exec app ss -lntp — docker exec mang công cụ của máy chủ vào trong container',
              'docker run --rm --pid=host --privileged nicolaka/netshoot nsenter -t PID_OF_APP -n ss -lntp|||docker run --rm --pid=host --privileged nicolaka/netshoot nsenter -t PID_CỦA_APP -n ss -lntp',
              'ss -lntp in your own shell on the host — every container socket appears in the host namespace|||ss -lntp ngay trong shell của máy chủ — mọi socket của container đều hiện trong namespace máy chủ',
              'docker logs app | grep LISTEN — Docker records every listening socket in the container log|||docker logs app | grep LISTEN — Docker ghi mọi socket đang nghe vào log của container',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: The helper sees every host process (--pid=host), is allowed to enter namespaces (--privileged), and nsenter -n runs ss inside the app’s network namespace — the real run printed `127.0.0.1:3000 users:(("python",…))` and even `127.0.0.11:45039 users:(("dockerd",…))`. `--network container:app` + netshoot also shows the sockets, but with an empty Process column. docker exec only runs binaries that exist in the image, and the host shell sees the host’s namespace, not the container’s.|||VI: Container phụ thấy mọi tiến trình máy chủ (--pid=host), được phép nhảy vào namespace (--privileged), và nsenter -n chạy ss bên trong namespace mạng của app — lần chạy thật in ra `127.0.0.1:3000 users:(("python",…))` và cả `127.0.0.11:45039 users:(("dockerd",…))`. `--network container:app` + netshoot cũng thấy socket, nhưng cột Process để trống. docker exec chỉ chạy được chương trình có sẵn trong ảnh, còn shell máy chủ thấy namespace của máy chủ chứ không phải của container.',
          },
        ],
      },
    },
  ],
};
