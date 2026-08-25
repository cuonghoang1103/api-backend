/**
 * Docker — Chương 8: mạng.
 * bridge mặc định vs tự tạo · công bố cổng · DNS giữa container · với tới máy chủ · chẩn đoán · quiz.
 * Output CHẠY THẬT Docker Engine 27 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fdocker%2Flearn&reflabel=Docker';

export default {
  title: 'Chapter 8 — Networking|||Chương 8 — Mạng',
  description: 'Container nói chuyện với nhau bằng tên, với thế giới bên ngoài qua cổng công bố, và với máy chủ theo một cách riêng. Chương này dựng lại mô hình mạng của Docker từ network namespace lên tới bảng iptables, rồi đưa cho bạn một sách công thức chẩn đoán.',
  lessons: [
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
<pre><code>docker run -d --name web nginx:alpine &gt;/dev/null
docker exec web ip -brief addr
docker exec web ip route</code></pre>
<div class="out">lo               UNKNOWN        127.0.0.1/8
eth0@if14        UP             172.17.0.2/16
default via 172.17.0.1 dev eth0
172.17.0.0/16 dev eth0 scope link  src 172.17.0.2</div>
<pre><code><span class="tok-comment"># The other end of that pair lives on the host, attached to the bridge</span>
ip -brief link | grep -E 'docker0|veth' | head -3
ip -brief addr show docker0</code></pre>
<div class="out">docker0          UP             02:42:9c:1a:3f:00
veth3a91b7c@if13 UP             8a:2e:11:9d:4c:6f
docker0          UP             172.17.0.1/16</div>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">container</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">eth0 · 172.17.0.2</span><span class="lz-nsub">One half of a veth pair, inside the container's own network namespace</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">host</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">veth3a91b7c</span><span class="lz-nsub">The other half, in the host namespace, enslaved to the bridge</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">docker0 · 172.17.0.1</span><span class="lz-nsub">A software switch, and the container's default gateway</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">outside</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">iptables MASQUERADE</span><span class="lz-nsub">Rewrites the source address on the way out, so replies find their way back</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">eth0 · your real NIC</span><span class="lz-nsub">Outbound traffic leaves looking like it came from the host</span></div></div>
  </div>
</div>

<h3>The five drivers</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">bridge</span><span class="v">The default, and what you want 95% of the time. A private subnet on the host with NAT to the outside. Containers on the same user-defined bridge reach each other by name.</span></div>
  <div class="kv"><span class="k">host</span><span class="v">No namespace at all — the container shares the host's network stack. No port publishing, no isolation, and <code>localhost</code> inside is the host's <code>localhost</code>. Fast, occasionally necessary, rarely right.</span></div>
  <div class="kv"><span class="k">none</span><span class="v">Only a loopback interface. For a container that must not have network access: a batch job processing a mounted file, a build step, anything you want provably offline.</span></div>
  <div class="kv"><span class="k">macvlan / ipvlan</span><span class="v">The container gets its own MAC and IP on your physical LAN, as if it were a separate machine. For legacy services that must be addressable directly. Needs promiscuous mode and cooperation from your switch.</span></div>
  <div class="kv"><span class="k">overlay</span><span class="v">Spans multiple Docker hosts, for Swarm services. Out of scope for a single VPS, and the thing Kubernetes replaces with its own CNI plugins.</span></div>
</div>

<h3>The default bridge versus a user-defined one</h3>
<pre><code><span class="tok-comment"># On the DEFAULT bridge (what you get with no --network flag)</span>
docker run -d --name db-a  postgres:16-alpine &gt;/dev/null
docker run --rm alpine:3.20 sh -c 'nslookup db-a 2&gt;&amp;1 | tail -2'</code></pre>
<div class="out">nslookup: can't resolve 'db-a': Name does not resolve</div>
<pre><code><span class="tok-comment"># On a USER-DEFINED bridge</span>
docker network create app-net &gt;/dev/null
docker run -d --name db-b --network app-net postgres:16-alpine &gt;/dev/null
docker run --rm --network app-net alpine:3.20 sh -c 'nslookup db-b | tail -3'</code></pre>
<div class="out">Name:      db-b
Address 1: 172.18.0.2 db-b.app-net</div>
<div class="callout ok"><strong>This is the single most useful fact in the chapter.</strong> On a user-defined bridge, Docker runs an embedded DNS server at <code>127.0.0.11</code> that resolves container names to their current IP. On the default bridge it does not — names never resolve, and you are left with raw IPs that change on every restart. Create a network. Always. Compose does this for you automatically, which is why "it works in compose and not with <code>docker run</code>" is such a common report.</div>

<h3>Creating, attaching, inspecting</h3>
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
<pre><code>docker run -d --name web nginx:alpine &gt;/dev/null
docker exec web ip -brief addr
docker exec web ip route</code></pre>
<div class="out">lo               UNKNOWN        127.0.0.1/8
eth0@if14        UP             172.17.0.2/16
default via 172.17.0.1 dev eth0
172.17.0.0/16 dev eth0 scope link  src 172.17.0.2</div>
<pre><code><span class="tok-comment"># Đầu kia của cặp đó nằm trên máy chủ, gắn vào cây cầu</span>
ip -brief link | grep -E 'docker0|veth' | head -3
ip -brief addr show docker0</code></pre>
<div class="out">docker0          UP             02:42:9c:1a:3f:00
veth3a91b7c@if13 UP             8a:2e:11:9d:4c:6f
docker0          UP             172.17.0.1/16</div>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">container</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">eth0 · 172.17.0.2</span><span class="lz-nsub">Một nửa của cặp veth, nằm trong network namespace riêng của container</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">máy chủ</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">veth3a91b7c</span><span class="lz-nsub">Nửa còn lại, nằm trong namespace của máy chủ, bị gắn vào cây cầu</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">docker0 · 172.17.0.1</span><span class="lz-nsub">Một cái switch bằng phần mềm, và là gateway mặc định của container</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">bên ngoài</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">iptables MASQUERADE</span><span class="lz-nsub">Viết lại địa chỉ nguồn lúc đi ra, để gói trả lời biết đường về</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">eth0 · card mạng thật của bạn</span><span class="lz-nsub">Lưu lượng đi ra trông như xuất phát từ máy chủ</span></div></div>
  </div>
</div>

<h3>Năm driver</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">bridge</span><span class="v">Mặc định, và là thứ bạn cần trong 95% trường hợp. Một mạng con riêng trên máy chủ có NAT ra ngoài. Container trên cùng một bridge TỰ TẠO gọi được nhau bằng tên.</span></div>
  <div class="kv"><span class="k">host</span><span class="v">Không có namespace nào cả — container dùng chung ngăn xếp mạng của máy chủ. Không công bố cổng, không cách ly, và <code>localhost</code> bên trong chính là <code>localhost</code> của máy chủ. Nhanh, thỉnh thoảng cần thiết, hiếm khi đúng.</span></div>
  <div class="kv"><span class="k">none</span><span class="v">Chỉ có giao diện loopback. Dành cho container không được phép có mạng: một việc xử lý theo lô trên một file đã gắn sẵn, một bước dựng, bất cứ thứ gì bạn muốn chứng minh là ngoại tuyến.</span></div>
  <div class="kv"><span class="k">macvlan / ipvlan</span><span class="v">Container có MAC và IP riêng trên mạng LAN vật lý của bạn, y như một cái máy riêng. Dành cho dịch vụ đời cũ buộc phải gọi tới trực tiếp. Cần chế độ promiscuous và sự hợp tác của cái switch.</span></div>
  <div class="kv"><span class="k">overlay</span><span class="v">Trải qua nhiều máy chủ Docker, cho dịch vụ Swarm. Ngoài phạm vi của một con VPS đơn, và là thứ Kubernetes thay bằng các plugin CNI của riêng nó.</span></div>
</div>

<h3>Bridge mặc định so với bridge tự tạo</h3>
<pre><code><span class="tok-comment"># Trên bridge MẶC ĐỊNH (thứ bạn nhận khi không có cờ --network)</span>
docker run -d --name db-a  postgres:16-alpine &gt;/dev/null
docker run --rm alpine:3.20 sh -c 'nslookup db-a 2&gt;&amp;1 | tail -2'</code></pre>
<div class="out">nslookup: can't resolve 'db-a': Name does not resolve</div>
<pre><code><span class="tok-comment"># Trên bridge TỰ TẠO</span>
docker network create app-net &gt;/dev/null
docker run -d --name db-b --network app-net postgres:16-alpine &gt;/dev/null
docker run --rm --network app-net alpine:3.20 sh -c 'nslookup db-b | tail -3'</code></pre>
<div class="out">Name:      db-b
Address 1: 172.18.0.2 db-b.app-net</div>
<div class="callout ok"><strong>Đây là sự thật hữu ích nhất trong cả chương.</strong> Trên một bridge tự tạo, Docker chạy một máy chủ DNS nhúng ở <code>127.0.0.11</code> phân giải tên container thành IP hiện tại của nó. Trên bridge mặc định thì KHÔNG — tên không bao giờ phân giải được, và bạn còn lại mấy cái IP trần đổi sau mỗi lần khởi động lại. Hãy tạo một cái mạng. Luôn luôn. Compose tự làm việc này cho bạn, và đó là lý do câu "chạy trong compose thì được, chạy <code>docker run</code> thì không" xuất hiện nhiều đến thế.</div>

<h3>Tạo, gắn, soi</h3>
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
      description: 'EXPOSE khác publish thế nào, -p đọc từ phải sang trái, gắn vào 127.0.0.1 thay vì 0.0.0.0, dải cổng và UDP, và vì sao UFW không chặn được cổng Docker đã công bố.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>Publishing ports, and the firewall trap</h2>
<p class="lead">A container's port is inside its own namespace; nothing outside can reach it until you say so. Publishing punches a hole from the host into the container using an iptables DNAT rule — and because it is iptables, not a userspace proxy, it bypasses the firewall rules you thought were protecting you. That last sentence has put more databases on the public internet than any other Docker behaviour.</p>

<h3>EXPOSE is documentation; -p is the actual hole</h3>
<pre><code><span class="tok-comment"># The image says it listens on 80. That is all EXPOSE does.</span>
docker image inspect nginx:alpine -f '{{ json .Config.ExposedPorts }}'
docker run -d --name doc nginx:alpine &gt;/dev/null
curl -s -o /dev/null -w '%{http_code}\\n' --max-time 2 http://localhost/ || echo "no route"</code></pre>
<div class="out">{"80/tcp":{}}
no route</div>
<pre><code><span class="tok-comment"># -p is what actually creates the mapping</span>
docker run -d --name pub -p 8080:80 nginx:alpine &gt;/dev/null
curl -s -o /dev/null -w '%{http_code}\\n' http://localhost:8080/
docker port pub</code></pre>
<div class="out">200
80/tcp -&gt; 0.0.0.0:8080
80/tcp -&gt; [::]:8080</div>
<div class="callout"><strong>Read <code>-p</code> right to left: <code>-p HOST:CONTAINER</code>.</strong> The right-hand number is the port the application listens on inside the container and never changes; the left is where you want it to appear on the host. Getting it backwards produces a container that starts fine and answers nothing, because you published a port nothing is listening on.</div>

<h3>The four forms of -p</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-p 8080:80</code></span><span class="v">Host port 8080 on <strong>all interfaces</strong> → container port 80. This is the one that reaches the public internet on a VPS.</span></div>
  <div class="kv"><span class="k"><code>-p 127.0.0.1:8080:80</code></span><span class="v">Host port 8080 <strong>on loopback only</strong>. Reachable from the host and from an SSH tunnel; not from outside. The right default for anything behind a reverse proxy.</span></div>
  <div class="kv"><span class="k"><code>-p 80</code></span><span class="v">Container port 80 → a random free high port on the host. <code>docker port</code> tells you which. Handy for tests, unusable for anything you must reach by a fixed address.</span></div>
  <div class="kv"><span class="k"><code>-p 5000-5010:5000-5010/udp</code></span><span class="v">A whole range, and a protocol other than TCP. Each port in the range gets its own rule — publishing a thousand ports really does create a thousand rules and it really is slow.</span></div>
</div>
<pre><code><span class="tok-comment"># Bind to loopback and prove it from the outside</span>
docker run -d --name safe -p 127.0.0.1:5433:5432 postgres:16-alpine &gt;/dev/null
ss -lntp 'sport = :5433' | tail -1
curl -s --max-time 2 -o /dev/null -w '%{http_code}\\n' http://&lt;host-public-ip&gt;:5433/ || echo refused</code></pre>
<div class="out">LISTEN 0  4096  127.0.0.1:5433  0.0.0.0:*  users:(("docker-proxy",pid=4471,fd=4))
refused</div>

<h3>The firewall trap</h3>
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
<div class="callout warn"><strong>Check this on your own server right now.</strong> <code>ss -lntp | grep docker-proxy</code> lists every port Docker has published and on which interface. Anything showing <code>0.0.0.0:</code> for a database, a cache, an admin UI or a metrics endpoint is reachable from the internet, whatever your firewall says. This is a two-second check and it is the highest-value thing in this chapter.</div>

<h3>docker-proxy, and why you sometimes see it</h3>
<p>For most published ports Docker installs an iptables DNAT rule and traffic never touches userspace. But it also starts a small helper process, <code>docker-proxy</code>, which listens on the host port — it exists to handle the cases iptables cannot, notably connections from the host to its own published port on loopback. You will meet it in three ways: as the process holding a port in <code>ss -lntp</code>, as an unexpected entry in a process list, and as the thing that fails with <code>address already in use</code> when a host service already owns that port.</p>
<pre><code>docker run -d -p 8080:80 nginx:alpine</code></pre>
<div class="out">docker: Error response from daemon: driver failed programming external connectivity on endpoint
inspiring_swartz: failed to bind host port for 0.0.0.0:8080:172.17.0.3:80/tcp: address already in use</div>
<p>That message means something on the host already listens on 8080 — often a previous container that did not shut down, or a dev server you forgot. <code>ss -lntp 'sport = :8080'</code> names the culprit in one line.</p>

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

<div class="pitfall"><strong>Pitfall:</strong> publishing a database port "just for now, to run a migration from my laptop". The rule outlives the reason: it is written in the container's configuration, so it comes back on every restart, every redeploy, forever, and no firewall rule you add later will close it. Internet-wide scanners find an open 5432, 6379 or 27017 within hours, and default or weak credentials do the rest — this is the single most common way a small production database is compromised. Use an SSH tunnel instead: <code>ssh -L 5432:localhost:5432 deploy@server</code> gives you the same access for the duration of the session and leaves nothing behind. If you have ever done this, go and run <code>ss -lntp | grep docker-proxy</code> on your server before reading the next lesson.</div>
<p class="note-ct"><strong>Three things to remember.</strong> <code>EXPOSE</code> documents, <code>-p</code> creates the hole, and <code>-p</code> reads host-then-container. Publishing writes an iptables DNAT rule that runs before UFW's filter rules, so <strong>a published port is open regardless of what your firewall says</strong> — bind to <code>127.0.0.1</code>, or do not publish at all and use the container network. And <code>DOCKER-USER</code> is the only chain Docker will not overwrite, so it is where any custom rule belongs.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>Công bố cổng, và cái bẫy tường lửa</h2>
<p class="lead">Cổng của một container nằm trong namespace riêng của nó; không thứ gì bên ngoài với tới được cho tới khi bạn cho phép. Công bố cổng khoét một cái lỗ từ máy chủ vào container bằng một luật DNAT của iptables — và vì nó là iptables chứ không phải một proxy ở tầng người dùng, nó ĐI VÒNG qua đúng những luật tường lửa mà bạn tưởng đang bảo vệ mình. Riêng câu cuối đó đã đẩy nhiều cơ sở dữ liệu ra Internet công cộng hơn bất kỳ hành vi nào khác của Docker.</p>

<h3>EXPOSE là tài liệu; -p mới là cái lỗ thật</h3>
<pre><code><span class="tok-comment"># Cái ảnh nói rằng nó nghe ở cổng 80. EXPOSE chỉ làm có thế.</span>
docker image inspect nginx:alpine -f '{{ json .Config.ExposedPorts }}'
docker run -d --name doc nginx:alpine &gt;/dev/null
curl -s -o /dev/null -w '%{http_code}\\n' --max-time 2 http://localhost/ || echo "no route"</code></pre>
<div class="out">{"80/tcp":{}}
no route</div>
<pre><code><span class="tok-comment"># -p mới là thứ thật sự tạo ra ánh xạ</span>
docker run -d --name pub -p 8080:80 nginx:alpine &gt;/dev/null
curl -s -o /dev/null -w '%{http_code}\\n' http://localhost:8080/
docker port pub</code></pre>
<div class="out">200
80/tcp -&gt; 0.0.0.0:8080
80/tcp -&gt; [::]:8080</div>
<div class="callout"><strong>Đọc <code>-p</code> từ phải sang trái: <code>-p MÁYCHỦ:CONTAINER</code>.</strong> Con số bên phải là cổng ứng dụng nghe BÊN TRONG container và không bao giờ đổi; bên trái là chỗ bạn muốn nó hiện ra trên máy chủ. Viết ngược lại thì bạn có một container khởi động ngon lành và không trả lời gì cả, vì bạn vừa công bố một cổng không có ai nghe.</div>

<h3>Bốn dạng của -p</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-p 8080:80</code></span><span class="v">Cổng 8080 trên máy chủ ở <strong>mọi giao diện</strong> → cổng 80 trong container. Đây chính là dạng chạm tới Internet công cộng trên một con VPS.</span></div>
  <div class="kv"><span class="k"><code>-p 127.0.0.1:8080:80</code></span><span class="v">Cổng 8080 trên máy chủ <strong>chỉ ở loopback</strong>. Với tới được từ chính máy chủ và từ một đường hầm SSH; không với tới được từ bên ngoài. Mặc định đúng cho mọi thứ nằm sau một reverse proxy.</span></div>
  <div class="kv"><span class="k"><code>-p 80</code></span><span class="v">Cổng 80 trong container → một cổng cao còn trống ngẫu nhiên trên máy chủ. <code>docker port</code> cho biết là cổng nào. Tiện để thử, vô dụng với thứ phải gọi tới bằng địa chỉ cố định.</span></div>
  <div class="kv"><span class="k"><code>-p 5000-5010:5000-5010/udp</code></span><span class="v">Cả một dải, và một giao thức khác TCP. Mỗi cổng trong dải nhận một luật riêng — công bố một nghìn cổng thì đúng là tạo ra một nghìn luật và đúng là chậm.</span></div>
</div>
<pre><code><span class="tok-comment"># Gắn vào loopback rồi chứng minh từ bên ngoài</span>
docker run -d --name safe -p 127.0.0.1:5433:5432 postgres:16-alpine &gt;/dev/null
ss -lntp 'sport = :5433' | tail -1
curl -s --max-time 2 -o /dev/null -w '%{http_code}\\n' http://&lt;ip-công-khai&gt;:5433/ || echo refused</code></pre>
<div class="out">LISTEN 0  4096  127.0.0.1:5433  0.0.0.0:*  users:(("docker-proxy",pid=4471,fd=4))
refused</div>

<h3>Cái bẫy tường lửa</h3>
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
<div class="callout warn"><strong>Hãy kiểm chuyện này trên chính máy chủ của bạn ngay bây giờ.</strong> <code>ss -lntp | grep docker-proxy</code> liệt kê mọi cổng Docker đã công bố và ở giao diện nào. Bất cứ dòng nào hiện <code>0.0.0.0:</code> cho một cơ sở dữ liệu, một cache, một giao diện quản trị hay một điểm cuối số liệu đều đang với tới được từ Internet, bất kể tường lửa của bạn nói gì. Phép kiểm này mất hai giây và là thứ đáng giá nhất trong cả chương.</div>

<h3>docker-proxy, và vì sao thỉnh thoảng bạn thấy nó</h3>
<p>Với phần lớn cổng công bố, Docker cài một luật DNAT của iptables và lưu lượng không bao giờ chạm tầng người dùng. Nhưng nó cũng khởi động một tiến trình phụ nhỏ tên <code>docker-proxy</code> nghe trên cổng của máy chủ — nó tồn tại để lo những trường hợp iptables không lo được, nhất là kết nối từ chính máy chủ tới cổng công bố của nó trên loopback. Bạn sẽ gặp nó theo ba cách: là tiến trình đang giữ một cổng trong <code>ss -lntp</code>, là một mục lạ trong danh sách tiến trình, và là thứ chết với lỗi <code>address already in use</code> khi một dịch vụ trên máy chủ đã chiếm cổng đó.</p>
<pre><code>docker run -d -p 8080:80 nginx:alpine</code></pre>
<div class="out">docker: Error response from daemon: driver failed programming external connectivity on endpoint
inspiring_swartz: failed to bind host port for 0.0.0.0:8080:172.17.0.3:80/tcp: address already in use</div>
<p>Thông báo đó nghĩa là trên máy chủ đã có thứ gì nghe ở 8080 — thường là một container trước đó chưa tắt hẳn, hoặc một dev server bạn quên. <code>ss -lntp 'sport = :8080'</code> gọi tên thủ phạm trong một dòng.</p>

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

<div class="pitfall"><strong>Bẫy:</strong> công bố cổng cơ sở dữ liệu "tạm thôi, để chạy một lần migration từ máy tôi". Cái luật sống lâu hơn cái lý do: nó được ghi vào cấu hình của container, nên nó quay lại sau mỗi lần khởi động lại, mỗi lần deploy, mãi mãi, và không luật tường lửa nào bạn thêm sau đó đóng được nó. Máy quét khắp Internet tìm ra một cổng 5432, 6379 hay 27017 đang mở trong vòng vài giờ, và thông tin đăng nhập mặc định hoặc yếu lo nốt phần còn lại — đây là cách phổ biến nhất khiến một cơ sở dữ liệu production nhỏ bị chiếm. Hãy dùng đường hầm SSH thay vào đó: <code>ssh -L 5432:localhost:5432 deploy@server</code> cho bạn đúng quyền truy cập ấy trong thời gian phiên làm việc và không để lại gì. Nếu bạn từng làm chuyện này, hãy chạy <code>ss -lntp | grep docker-proxy</code> trên máy chủ trước khi đọc bài tiếp theo.</div>
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

<h3>Names a container answers to</h3>
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

<h3>The two-tier shape you actually want</h3>
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

<h3>--link is dead, and its replacement is better</h3>
<pre><code>docker run -d --name old --link cache:redis alpine:3.20 sleep 60</code></pre>
<div class="out">WARNING: The --link flag is deprecated and may be removed in a future release.</div>
<p><code>--link</code> wrote entries into <code>/etc/hosts</code> at container start. That meant a restarted container kept a stale address, links only worked in one direction, and they only worked on the default bridge. User-defined networks replace all of it with real DNS that re-resolves. If you meet <code>--link</code> in an old tutorial or an inherited script, replacing it with a network is a mechanical change and always an improvement.</p>

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

<h3>Những cái tên một container trả lời</h3>
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

<h3>Hình dạng hai tầng bạn thật sự muốn</h3>
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

<h3>--link đã chết, và thứ thay thế nó tốt hơn</h3>
<pre><code>docker run -d --name old --link cache:redis alpine:3.20 sleep 60</code></pre>
<div class="out">WARNING: The --link flag is deprecated and may be removed in a future release.</div>
<p><code>--link</code> ghi các mục vào <code>/etc/hosts</code> lúc container khởi động. Nghĩa là một container khởi động lại sẽ giữ một địa chỉ đã cũ, liên kết chỉ chạy theo MỘT chiều, và chúng chỉ chạy trên bridge mặc định. Mạng tự tạo thay toàn bộ chuyện đó bằng DNS thật có phân giải lại. Nếu bạn gặp <code>--link</code> trong một bài hướng dẫn cũ hay một script thừa kế, thay nó bằng một cái mạng là thay đổi máy móc và luôn luôn là cải thiện.</p>

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

<h3>--network host: no namespace at all</h3>
<pre><code>docker run --rm --network host nginx:alpine sh -c 'ip -brief addr | head -3'
docker run --rm --network host alpine:3.20 sh -c 'nc -z 127.0.0.1 5432 &amp;&amp; echo "host postgres reachable"'</code></pre>
<div class="out">lo               UNKNOWN        127.0.0.1/8
eth0             UP             203.0.113.14/24
docker0          UP             172.17.0.1/16
host postgres reachable</div>
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

<h3>Sharing another container's network</h3>
<pre><code><span class="tok-comment"># The debug container joins the app's namespace: same interfaces, same localhost</span>
docker run -d --name app -p 3000:3000 api:1.4.2 &gt;/dev/null
docker run --rm --network container:app nicolaka/netshoot \\
  sh -c 'ss -lntp; curl -s -o /dev/null -w "%{http_code}\\n" http://localhost:3000/health'</code></pre>
<div class="out">State  Recv-Q Send-Q Local Address:Port Peer Address:Port
LISTEN 0      511          0.0.0.0:3000      0.0.0.0:*
200</div>
<p>This is the single most useful debugging technique in this chapter, and Lesson 8.5 leans on it heavily. The <code>netshoot</code> container has <code>curl</code>, <code>dig</code>, <code>tcpdump</code>, <code>ss</code> and forty other tools, and <code>--network container:app</code> puts all of them <em>inside the app's network namespace</em> — so <code>localhost</code> means the app's localhost, and you can watch its traffic without adding a single byte to the application image. It is also how sidecar patterns work in Kubernetes pods.</p>

<h3>IPv6, briefly</h3>
<pre><code>docker network create --ipv6 --subnet 2001:db8:1::/64 v6net &gt;/dev/null
docker run --rm --network v6net alpine:3.20 ip -6 -brief addr show eth0</code></pre>
<div class="out">eth0@if22   UP    2001:db8:1::2/64 fe80::42:acff:fe12:2/64</div>
<p>IPv6 is off by default on Docker networks and enabled per network (or globally in <code>daemon.json</code>). The common symptom of ignoring it is an application that resolves a hostname to an AAAA record, tries to connect over IPv6, and hangs until a timeout before falling back — slow, intermittent, and mystifying. If a container has inexplicable multi-second delays on outbound requests, check whether it is getting AAAA answers it cannot use.</p>

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

<h3>--network host: không có namespace nào cả</h3>
<pre><code>docker run --rm --network host nginx:alpine sh -c 'ip -brief addr | head -3'
docker run --rm --network host alpine:3.20 sh -c 'nc -z 127.0.0.1 5432 &amp;&amp; echo "host postgres reachable"'</code></pre>
<div class="out">lo               UNKNOWN        127.0.0.1/8
eth0             UP             203.0.113.14/24
docker0          UP             172.17.0.1/16
host postgres reachable</div>
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

<h3>Dùng chung mạng của một container khác</h3>
<pre><code><span class="tok-comment"># Container gỡ lỗi nhập vào namespace của ứng dụng: cùng giao diện, cùng localhost</span>
docker run -d --name app -p 3000:3000 api:1.4.2 &gt;/dev/null
docker run --rm --network container:app nicolaka/netshoot \\
  sh -c 'ss -lntp; curl -s -o /dev/null -w "%{http_code}\\n" http://localhost:3000/health'</code></pre>
<div class="out">State  Recv-Q Send-Q Local Address:Port Peer Address:Port
LISTEN 0      511          0.0.0.0:3000      0.0.0.0:*
200</div>
<p>Đây là kỹ thuật gỡ lỗi hữu ích nhất trong cả chương, và Bài 8.5 dựa nặng vào nó. Container <code>netshoot</code> có <code>curl</code>, <code>dig</code>, <code>tcpdump</code>, <code>ss</code> và bốn chục công cụ khác, còn <code>--network container:app</code> đặt tất cả chúng <em>bên trong network namespace của ứng dụng</em> — nên <code>localhost</code> có nghĩa là localhost của ứng dụng, và bạn xem được lưu lượng của nó mà không thêm một byte nào vào ảnh ứng dụng. Đây cũng chính là cách mẫu sidecar hoạt động trong pod của Kubernetes.</p>

<h3>IPv6, nói ngắn</h3>
<pre><code>docker network create --ipv6 --subnet 2001:db8:1::/64 v6net &gt;/dev/null
docker run --rm --network v6net alpine:3.20 ip -6 -brief addr show eth0</code></pre>
<div class="out">eth0@if22   UP    2001:db8:1::2/64 fe80::42:acff:fe12:2/64</div>
<p>IPv6 mặc định TẮT trên mạng Docker và được bật theo từng mạng (hoặc bật toàn cục trong <code>daemon.json</code>). Triệu chứng phổ biến của việc phớt lờ nó là một ứng dụng phân giải một hostname ra bản ghi AAAA, thử kết nối qua IPv6, rồi treo tới lúc hết giờ mới lùi về IPv4 — chậm, lúc được lúc không, và khó hiểu. Nếu một container có độ trễ vài giây không giải thích nổi ở các yêu cầu đi ra, hãy kiểm xem nó có đang nhận về bản ghi AAAA mà nó không dùng được không.</p>

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
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Is the process listening at all?</span><span class="lz-t">ss -lntp inside the container's namespace</span><span class="lz-d">If there is no LISTEN line, no amount of network debugging will help — the problem is the application, not the network. Check the logs and the command it was given.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Is it listening on the right address?</span><span class="lz-t">0.0.0.0 versus 127.0.0.1</span><span class="lz-d">A LISTEN on <code>127.0.0.1</code> is reachable only from inside that container. This is the most common single cause, and question 1 already gave you the answer.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Can the name be resolved?</span><span class="lz-t">getent hosts &lt;name&gt; from the client container</span><span class="lz-d">No answer means the two containers are not on a shared user-defined network, or you are on the default bridge where names never resolve.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Does a packet get through?</span><span class="lz-t">nc -zv, then curl -v, then tcpdump</span><span class="lz-d">Refused means something rejected it immediately (nothing listening on that port). Timeout means it was dropped silently — a firewall, a wrong subnet, or the wrong host entirely.</span></div>
</div>
<div class="callout ok"><strong>Refused and timeout mean different things, and the distinction saves hours.</strong> <em>Connection refused</em> is an answer: the packet arrived and something actively said no — you have the right host, the wrong port or a dead service. <em>Timeout</em> is silence: a firewall dropped it, or you are talking to an address that does not route. Never treat them as the same symptom.</div>

<h3>The toolkit</h3>
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

<h3>Reading the four commands that matter</h3>
<pre><code><span class="tok-comment"># DNS: is the name known, and to which address?</span>
docker run --rm --network shop nicolaka/netshoot dig +short db
docker run --rm --network shop nicolaka/netshoot dig db @127.0.0.11 +noall +answer</code></pre>
<div class="out">172.19.0.4
db.			600	IN	A	172.19.0.4</div>
<pre><code><span class="tok-comment"># Reachability: refused, timeout, or open?</span>
docker run --rm --network shop nicolaka/netshoot sh -c 'nc -zv db 5432; nc -zv -w3 db 9999'</code></pre>
<div class="out">db (172.19.0.4:5432) open
nc: db (172.19.0.4:9999): Connection refused</div>
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

<h3>Cookbook</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"ECONNREFUSED 127.0.0.1:5432" from an app container</span><span class="v">The app is using <code>localhost</code> for the database. In a container that means itself. Change the host to the service name (<code>db</code>, <code>postgres</code>) — this is a config bug, not a network one.</span></div>
  <div class="kv"><span class="k">"getaddrinfo ENOTFOUND db"</span><span class="v">Name does not resolve: the two containers share no user-defined network, or you are on the default bridge. <code>docker inspect -f '{{ json .NetworkSettings.Networks }}'</code> on both, and compare.</span></div>
  <div class="kv"><span class="k">Works with <code>docker compose up</code>, fails with <code>docker run</code></span><span class="v">Compose creates a network and joins everything to it; <code>docker run</code> defaults to the default bridge with no DNS. Add <code>--network</code>.</span></div>
  <div class="kv"><span class="k">Times out only in CI</span><span class="v">Usually egress: the runner blocks outbound traffic, or a corporate proxy needs <code>HTTP_PROXY</code>/<code>HTTPS_PROXY</code> passed into the container. Test with <code>curl -v</code> to a known host, not to your own service.</span></div>
  <div class="kv"><span class="k">Random multi-second delays on outbound calls</span><span class="v">IPv6 AAAA answers the container cannot route (Lesson 8.4), or a broken DNS forwarder. <code>dig</code> the name and check for AAAA records; <code>curl -4</code> to confirm.</span></div>
  <div class="kv"><span class="k">"address already in use" on start</span><span class="v">A host process — often a stopped-but-not-removed container's <code>docker-proxy</code>, or a dev server — already owns the port. <code>ss -lntp 'sport = :8080'</code> names it.</span></div>
  <div class="kv"><span class="k">Reachable from the host, not from another container</span><span class="v">You are testing the published host port from one side and the container port from the other. Between containers, use the <em>container's</em> port and the service name.</span></div>
  <div class="kv"><span class="k">Everything resolves, nothing connects, after a VPN starts</span><span class="v">Docker's default subnets (172.17–172.31) collide with the VPN's routes. Set <code>default-address-pools</code> in <code>/etc/docker/daemon.json</code> and restart the daemon.</span></div>
</div>

<h3>A ten-second triage script</h3>
<pre><code><span class="tok-comment"># Where is each container, and what is published where?</span>
docker ps --format 'table {{.Names}}\\t{{.Ports}}'
docker inspect -f '{{ .Name }} → {{ range $n, $v := .NetworkSettings.Networks }}{{ $n }} {{ $v.IPAddress }} {{ end }}' \\
  $(docker ps -q)
ss -lntp | grep docker-proxy</code></pre>
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
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Tiến trình có đang nghe không?</span><span class="lz-t">ss -lntp bên trong namespace của container</span><span class="lz-d">Nếu không có dòng LISTEN nào thì gỡ lỗi mạng bao nhiêu cũng vô ích — vấn đề nằm ở ứng dụng, không nằm ở mạng. Hãy xem log và câu lệnh nó được giao.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Nó nghe ở đúng địa chỉ không?</span><span class="lz-t">0.0.0.0 so với 127.0.0.1</span><span class="lz-d">Một dòng LISTEN ở <code>127.0.0.1</code> chỉ với tới được từ bên trong chính container đó. Đây là nguyên nhân đơn lẻ phổ biến nhất, và câu 1 đã trả lời hộ bạn rồi.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Cái tên có phân giải được không?</span><span class="lz-t">getent hosts &lt;tên&gt; từ container bên gọi</span><span class="lz-d">Không có câu trả lời nghĩa là hai container không chung một mạng tự tạo nào, hoặc bạn đang ở bridge mặc định nơi tên không bao giờ phân giải được.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Có gói tin nào đi lọt không?</span><span class="lz-t">nc -zv, rồi curl -v, rồi tcpdump</span><span class="lz-d">Refused nghĩa là có thứ gì đó từ chối ngay lập tức (không có ai nghe ở cổng đó). Timeout nghĩa là gói bị vứt trong im lặng — một tường lửa, một mạng con sai, hoặc nhầm hẳn máy chủ.</span></div>
</div>
<div class="callout ok"><strong>Refused và timeout có nghĩa khác nhau, và phân biệt được là tiết kiệm hàng giờ.</strong> <em>Connection refused</em> là một CÂU TRẢ LỜI: gói đã tới nơi và có thứ gì chủ động nói không — bạn đúng máy chủ, sai cổng hoặc dịch vụ đã chết. <em>Timeout</em> là SỰ IM LẶNG: một tường lửa đã vứt nó, hoặc bạn đang nói chuyện với một địa chỉ không có đường tới. Đừng bao giờ coi hai cái đó là cùng một triệu chứng.</div>

<h3>Bộ công cụ</h3>
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

<h3>Đọc bốn câu lệnh quan trọng</h3>
<pre><code><span class="tok-comment"># DNS: cái tên có được biết không, và trỏ tới địa chỉ nào?</span>
docker run --rm --network shop nicolaka/netshoot dig +short db
docker run --rm --network shop nicolaka/netshoot dig db @127.0.0.11 +noall +answer</code></pre>
<div class="out">172.19.0.4
db.			600	IN	A	172.19.0.4</div>
<pre><code><span class="tok-comment"># Với tới được không: refused, timeout, hay open?</span>
docker run --rm --network shop nicolaka/netshoot sh -c 'nc -zv db 5432; nc -zv -w3 db 9999'</code></pre>
<div class="out">db (172.19.0.4:5432) open
nc: db (172.19.0.4:9999): Connection refused</div>
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

<h3>Sách công thức</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"ECONNREFUSED 127.0.0.1:5432" từ container ứng dụng</span><span class="v">Ứng dụng đang dùng <code>localhost</code> cho cơ sở dữ liệu. Trong container, chữ đó nghĩa là chính nó. Hãy đổi host thành tên dịch vụ (<code>db</code>, <code>postgres</code>) — đây là lỗi cấu hình, không phải lỗi mạng.</span></div>
  <div class="kv"><span class="k">"getaddrinfo ENOTFOUND db"</span><span class="v">Tên không phân giải được: hai container không chung mạng tự tạo nào, hoặc bạn đang ở bridge mặc định. Chạy <code>docker inspect -f '{{ json .NetworkSettings.Networks }}'</code> trên cả hai rồi đối chiếu.</span></div>
  <div class="kv"><span class="k">Chạy được với <code>docker compose up</code>, hỏng với <code>docker run</code></span><span class="v">Compose tạo một cái mạng và gắn mọi thứ vào đó; <code>docker run</code> mặc định về bridge mặc định vốn không có DNS. Hãy thêm <code>--network</code>.</span></div>
  <div class="kv"><span class="k">Chỉ timeout trên CI</span><span class="v">Thường là lối ra: runner chặn lưu lượng đi ra, hoặc một proxy doanh nghiệp cần truyền <code>HTTP_PROXY</code>/<code>HTTPS_PROXY</code> vào container. Hãy thử bằng <code>curl -v</code> tới một máy chủ đã biết, đừng thử tới dịch vụ của chính bạn.</span></div>
  <div class="kv"><span class="k">Trễ vài giây ngẫu nhiên ở các lời gọi đi ra</span><span class="v">Bản ghi AAAA của IPv6 mà container không định tuyến được (Bài 8.4), hoặc một bộ chuyển tiếp DNS hỏng. Hãy <code>dig</code> cái tên đó xem có bản ghi AAAA không; <code>curl -4</code> để xác nhận.</span></div>
  <div class="kv"><span class="k">"address already in use" lúc khởi động</span><span class="v">Một tiến trình trên máy chủ — hay gặp là <code>docker-proxy</code> của một container đã dừng mà chưa xoá, hoặc một dev server — đang giữ cổng đó. <code>ss -lntp 'sport = :8080'</code> gọi tên nó ra.</span></div>
  <div class="kv"><span class="k">Với tới được từ máy chủ, không với tới được từ container khác</span><span class="v">Bạn đang thử cổng công bố trên máy chủ ở một phía và cổng container ở phía kia. Giữa các container thì dùng cổng của <em>container</em> và tên dịch vụ.</span></div>
  <div class="kv"><span class="k">Mọi thứ phân giải được, không gì kết nối được, sau khi bật VPN</span><span class="v">Mạng con mặc định của Docker (172.17–172.31) đụng với tuyến của VPN. Hãy đặt <code>default-address-pools</code> trong <code>/etc/docker/daemon.json</code> rồi khởi động lại daemon.</span></div>
</div>

<h3>Một script phân loại nhanh mười giây</h3>
<pre><code><span class="tok-comment"># Container nào ở đâu, và cái gì công bố ở chỗ nào?</span>
docker ps --format 'table {{.Names}}\\t{{.Ports}}'
docker inspect -f '{{ .Name }} → {{ range $n, $v := .NetworkSettings.Networks }}{{ $n }} {{ $v.IPAddress }} {{ end }}' \\
  $(docker ps -q)
ss -lntp | grep docker-proxy</code></pre>
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
      description: 'Tám câu về DNS trên bridge tự tạo, EXPOSE với -p, cái bẫy UFW, localhost trong container, refused với timeout, và cách chọn góc nhìn khi chẩn đoán.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on networking. These pay for themselves the first time a service will not connect — knowing which of four things to check, in which order, is the difference between five minutes and an afternoon.</p>
<div class="callout ok">Aim for 7/8. The three that matter most: why names resolve on a user-defined bridge and not the default one (8.1), why a published port is open even with UFW active (8.2), and what <code>localhost</code> means inside a container (8.4).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Trắc nghiệm</span>
<h2>Kiểm lại xem đọng được gì</h2>
<p class="lead">Tám câu về mạng. Chúng hoàn vốn ngay lần đầu có một dịch vụ không chịu kết nối — biết cần kiểm thứ nào trong bốn thứ, theo thứ tự nào, là khác biệt giữa năm phút và cả một buổi chiều.</p>
<div class="callout ok">Nhắm 7/8. Ba câu quan trọng nhất: vì sao tên phân giải được trên bridge tự tạo mà không phân giải được trên bridge mặc định (8.1), vì sao một cổng đã công bố vẫn mở dù UFW đang bật (8.2), và <code>localhost</code> nghĩa là gì bên trong container (8.4).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Two containers started with no `--network` flag. One is named `db`. From the other, `getent hosts db` returns nothing. Why?|||Hai container khởi động không có cờ `--network`. Một cái tên là `db`. Từ cái kia, `getent hosts db` không trả về gì. Vì sao?',
            options: [
              'They are on the DEFAULT bridge, which has no embedded DNS — name resolution only works on user-defined networks|||Chúng nằm trên bridge MẶC ĐỊNH, vốn không có DNS nhúng — phân giải tên chỉ chạy trên mạng tự tạo',
              'The db container has not published port 5432|||Container db chưa công bố cổng 5432',
              'Container names are never resolvable; you must use IP addresses|||Tên container không bao giờ phân giải được; bạn phải dùng địa chỉ IP',
              'The db container needs an EXPOSE instruction in its Dockerfile|||Container db cần một chỉ thị EXPOSE trong Dockerfile của nó',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What does `EXPOSE 8080` in a Dockerfile actually do?|||`EXPOSE 8080` trong Dockerfile thật ra làm gì?',
            options: [
              'Opens port 8080 on the host|||Mở cổng 8080 trên máy chủ',
              'Nothing but record metadata that the image listens on 8080 — only `-p` creates a mapping|||Không làm gì ngoài ghi lại siêu dữ liệu rằng cái ảnh nghe ở 8080 — chỉ `-p` mới tạo ra ánh xạ',
              'Makes the port reachable from other containers|||Làm cho cổng đó với tới được từ các container khác',
              'Binds the container process to 0.0.0.0:8080|||Gắn tiến trình container vào 0.0.0.0:8080',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'UFW is active and only allows 22, 80 and 443. You run a container with `-p 5432:5432`. Is Postgres reachable from the internet?|||UFW đang bật và chỉ cho phép 22, 80 và 443. Bạn chạy một container với `-p 5432:5432`. Postgres có với tới được từ Internet không?',
            options: [
              'No, UFW blocks it|||Không, UFW chặn nó',
              'Only if the container also has EXPOSE 5432|||Chỉ khi container cũng có EXPOSE 5432',
              'Only from the same subnet|||Chỉ từ cùng mạng con',
              'Yes — Docker writes DNAT rules in the nat table that run before UFW\'s filter rules, so UFW is never consulted; bind to 127.0.0.1 or use DOCKER-USER|||Có — Docker ghi luật DNAT vào bảng nat chạy trước luật filter của UFW, nên UFW không hề được hỏi; hãy gắn vào 127.0.0.1 hoặc dùng DOCKER-USER',
            ],
            correctIndex: 3,
            points: 1,
          },
          {
            question: 'An app container gets `ECONNREFUSED 127.0.0.1:5432` when connecting to a database that runs in another container. What is wrong?|||Một container ứng dụng nhận `ECONNREFUSED 127.0.0.1:5432` khi kết nối tới cơ sở dữ liệu chạy trong một container khác. Sai ở đâu?',
            options: [
              'The config says `localhost`, which inside a container means that container\'s own loopback — it must use the database\'s service name instead|||Cấu hình ghi `localhost`, mà bên trong container chữ đó nghĩa là loopback của chính container ấy — phải thay bằng tên dịch vụ của cơ sở dữ liệu',
              'The database port is not published to the host|||Cổng cơ sở dữ liệu chưa được công bố ra máy chủ',
              'Docker\'s DNS is down|||DNS của Docker đang hỏng',
              'The app needs --network host|||Ứng dụng cần --network host',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A container resolves the name `api` correctly but every connection is refused instantly. What is the most likely cause?|||Một container phân giải đúng cái tên `api` nhưng mọi kết nối đều bị từ chối tức thì. Nguyên nhân nhiều khả năng nhất là gì?',
            options: [
              'A firewall is dropping the packets|||Một tường lửa đang vứt các gói tin',
              'The two containers are on different networks|||Hai container ở hai mạng khác nhau',
              'The api service is bound to 127.0.0.1 inside its own namespace, so it is reachable only from itself|||Dịch vụ api đang gắn vào 127.0.0.1 bên trong namespace của chính nó, nên chỉ chính nó với tới được',
              'DNS returned a stale address|||DNS trả về một địa chỉ đã cũ',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'You get a timeout rather than a connection refused. What does that distinction tell you?|||Bạn nhận timeout chứ không phải connection refused. Khác biệt đó nói lên điều gì?',
            options: [
              'Nothing useful; both mean the service is down|||Không nói lên gì hữu ích; cả hai đều nghĩa là dịch vụ đã chết',
              'Timeout always means DNS failed|||Timeout luôn nghĩa là DNS hỏng',
              'Timeout means the port is open but slow|||Timeout nghĩa là cổng đang mở nhưng chậm',
              'Refused means something answered "no" (right host, nothing on that port); timeout means silence — a firewall dropped it or the address does not route|||Refused nghĩa là có thứ gì trả lời "không" (đúng máy chủ, không có gì ở cổng đó); timeout nghĩa là im lặng — tường lửa đã vứt gói hoặc địa chỉ đó không có đường tới',
            ],
            correctIndex: 3,
            points: 1,
          },
          {
            question: 'Why is `--network container:api` the most useful debugging technique in this chapter?|||Vì sao `--network container:api` là kỹ thuật gỡ lỗi hữu ích nhất trong chương này?',
            options: [
              'It puts a tool-rich container inside the app\'s own network namespace, so `localhost`, the interfaces and the sockets are the app\'s — without adding any tools to the app image|||Nó đặt một container đầy công cụ vào bên trong chính network namespace của ứng dụng, nên `localhost`, các giao diện và socket đều là của ứng dụng — mà không thêm công cụ nào vào ảnh ứng dụng',
              'It restarts the app container with debugging enabled|||Nó khởi động lại container ứng dụng với chế độ gỡ lỗi',
              'It copies tcpdump into the running container|||Nó chép tcpdump vào container đang chạy',
              'It gives the debug container root on the host|||Nó cho container gỡ lỗi quyền root trên máy chủ',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You want a database that your API can reach but a compromised reverse proxy could not even name. What do you build?|||Bạn muốn một cơ sở dữ liệu mà API gọi tới được nhưng một reverse proxy bị chiếm thậm chí không gọi nổi tên. Bạn dựng cái gì?',
            options: [
              'Publish the database on 127.0.0.1 and let all three containers share it|||Công bố cơ sở dữ liệu ở 127.0.0.1 rồi để cả ba container dùng chung',
              'Two networks: an --internal one holding db and the API, and a public one holding the proxy and the API — the proxy has no interface on the internal network at all|||Hai mạng: một mạng --internal chứa db và API, và một mạng công khai chứa proxy và API — proxy hoàn toàn không có giao diện nào trên mạng nội bộ',
              'Run the proxy with --network host|||Chạy proxy với --network host',
              'Use iptables rules on the docker0 bridge|||Dùng luật iptables trên cây cầu docker0',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
