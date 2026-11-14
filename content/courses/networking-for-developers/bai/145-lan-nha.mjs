/**
 * Chương 14 · 14.6 — Mạng nhà và ký túc xá: router, DHCP giữ chỗ, mở cổng, CGNAT, UPnP, Wi-Fi (soạn 14/11/2026).
 * Output thật: lab/out/c146-* (bash lab/code/dung-output-ch14b.sh, CHI=146). Dùng lại mô phỏng nat (inbound, cgnat) của Chương 2.
 * Đo được: WAN router 100.64.0.2 thuộc 100.64.0.0/10 trong khi Internet thấy 198.18.0.40 ⇒ CGNAT; DHCP cấp .148 rồi giữ chỗ theo MAC ⇒ .50;
 * mở cổng 8080 ở router: từ Internet bị TỪ CHỐI (IP nhà mạng) / HẾT GIỜ (IP WAN 100.64 không định tuyến được), nhưng từ BÊN TRONG mạng nhà mạng thì chạy;
 * nhà mạng DNAT thêm ở lớp CGNAT ⇒ chạy; UPnP: miniupnpd tự báo "Public IP address is required", upnpc thất bại 501 (dưới CGNAT). Trang quản trị
 * mật khẩu mặc định đoán ra sau 3 lần. KHÔNG đo: sóng Wi-Fi 2,4/5 GHz, kênh, mesh (container không có radio) ⇒ chỉ giải thích; UPnP mở cổng lén khi
 * router CÓ IP công cộng ⇒ chỉ giải thích (bản thử với ext_allow_private_ipv4 cần chuỗi tường lửa riêng của miniupnpd — không dựng).
 */
import { run, card, kv } from '../_ui.mjs';
import { net } from '../_lab.mjs';
import G from '../giang/nfd-14-6.mjs';

const L = card;
const R = (f, p, n = 1, o = {}) => run(f, p, n, { drop: /^# /, ...o });
const bai = (slug) => `/courses/networking-for-developers/learn?lessonSlug=${slug}`;

export default {
  title: '14.6 — The network at home and in the dorm: router, DHCP reservations, port forwarding and CGNAT|||14.6 — Mạng ở nhà và ký túc xá: router, giữ chỗ DHCP, mở cổng và CGNAT',
  slug: 'netdev-14-6-lan-nha-ky-tuc-xa',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Chiếc router Wi-Fi ở nhà/ký túc xá làm năm việc (DHCP, DNS, NAT, tường lửa, Wi-Fi). Đo trên lab: giữ chỗ DHCP theo MAC, mở cổng (DNAT) cho máy nhà rồi thử từ Internet — thất bại vì CGNAT (WAN 100.64.0.2 ≠ IP Internet thấy), chạy được khi đứng trong mạng nhà mạng hoặc khi nhà mạng mở thêm ở lớp của họ; UPnP từ chối dưới CGNAT; kèm 2,4 và 5 GHz, kênh nhiễu, vị trí router, mesh; góc kẻ xấu: mật khẩu quản trị mặc định, WPS, UPnP mở cổng lén, IoT rẻ tiền ⇒ mạng khách.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.6</span>
<h2>The network at home and in the dorm: router, DHCP reservations, port forwarding and CGNAT</h2>
<p class="lead">"I opened port 8080 on the router exactly like the tutorial and my friend still can't reach my server." This lesson takes apart the box that runs your home or dorm network, does what tutorials say — and measures why it fails for most students in Vietnam: <strong>CGNAT</strong>. Then the radio part, and the attacker who loves default settings.</p>

<h3>The everyday picture</h3>
<ul>
<li>The home router is the <strong>building manager</strong>: hands out room numbers (DHCP), keeps the phone book (DNS), signs every outgoing letter with the building's address (NAT), decides which visitors may come in (firewall), and runs the Wi-Fi.</li>
<li><strong>Port forwarding</strong> is telling the manager "letters for door 8080 go to room 10".</li>
<li><strong>CGNAT</strong> is your building sitting inside a bigger compound with one gate — and the compound's guard has never heard of your door 8080.</li>
</ul>

<h3>1 — Which address does the Internet see?</h3>
${R('c146-wan', 'ip', 3)}
<p>The router's WAN (Internet-side) address is <code>100.64.0.2</code>, inside <code>100.64.0.0/10</code> — the range reserved for carrier-grade NAT (RFC 6598). A "what is my IP" page sees something else: <code>198.18.0.40</code>, the ISP's shared address. When those two differ, there is a second NAT you do not control. Check it on your own router's status page and compare with any "what is my IP" site — if the WAN starts with 100.64–100.127, or is a private 10.x / 172.16–31.x / 192.168.x, you are behind CGNAT (dorm networks are often a private range behind the school's NAT — the same effect).</p>

<h3>2 — DHCP: room numbers, and reserving one</h3>
${R('c146-dhcp', 'busybox', 2)}
<p>The laptop got <code>192.168.1.148</code> for 12 hours (DORA, lesson 14.1). Fine for browsing — but a port forward, a printer or a NAS needs an address that never changes. The router can <strong>reserve</strong> one for a MAC:</p>
${R('c146-giucho', 'echo', 3)}
${R('c146-dhcp2', 'busybox', 1)}
<p>Same laptop, now always <code>192.168.1.50</code>. Remember 14.1: if the laptop uses a <em>private Wi-Fi address</em> that rotates, the reservation follows a MAC that no longer exists — turn it to Fixed/Off for your home network.</p>

<h3>3 — Port forwarding, and why it fails behind CGNAT</h3>
<p>A machine at home serves a page (a NAS, a camera, your project):</p>
${R('c146-nas', 'curl', 1)}
${R('c146-mo-cong', 'iptables', 2)}
<p>That is all "port forwarding" is: a DNAT rule — WAN port 8080 → 192.168.1.10:80 (lesson 2.3). From the Internet (the VPS):</p>
${R('c146-thu-vao', 'curl', 2)}
<p>Two different failures. To the ISP's public address: <em>refused</em> — the ISP's NAT has no rule for 8080, so nothing listens there. To the router's WAN address: <em>timeout</em> — 100.64.0.2 is not routable on the Internet at all. Is our forward broken? Test it from inside the ISP's network:</p>
${R('c146-isp-thu', 'curl', 1)}
<p>It works — the router did its part. The missing piece is the ISP's own NAT. Some ISPs will add it (or give you a public/static IP) if you call and ask; with that extra rule:</p>
${R('c146-isp-mo', 'iptables', 1)}
${R('c146-thu-vao2', 'curl', 1)}
<p>If they won't: don't open ports at all. Use a tunnel that goes <strong>out</strong> — SSH -R to a VPS (lesson 14.3), WireGuard/Tailscale (14.4), or Cloudflare Tunnel / ngrok — exactly the trick that works behind any number of NATs.</p>
${net('nat', 'inbound', 'en', 'Port forwarding is a DNAT rule: follow a packet from the Internet to the machine inside.', { tour: 'nat-inbound' })}
${net('nat', 'cgnat', 'en', 'Two layers of NAT: why a forward on your own router is not enough.')}

<h3>4 — UPnP: devices that open ports by themselves</h3>
${R('c146-upnp', 'miniupnpd', 2)}
${R('c146-upnp-nha', 'upnpc', 1)}
<p>UPnP lets a game console or camera ask the router "please forward port 9090 to me" — no admin page, no human. Under CGNAT it simply fails (the router itself warns that it needs a public IP). On a router <em>with</em> a public IP it works — and that is the danger in the attacker's corner below. We did not build that case in the lab; it is explained, not measured.</p>

<h3>5 — The radio: 2.4 GHz, 5 GHz, channels and where the router sits</h3>
<div class="table-wrap"><table>
<tr><th></th><th>2.4 GHz</th><th>5 GHz (and 6 GHz on Wi-Fi 6E/7)</th></tr>
<tr><td>Range, walls</td><td>longer, passes walls better</td><td>shorter, blocked more by walls</td></tr>
<tr><td>Speed</td><td>lower; crowded</td><td>higher; many more channels</td></tr>
<tr><td>Channels</td><td>only <strong>1, 6, 11</strong> do not overlap (20 MHz wide, 5 MHz apart)</td><td>dozens of non-overlapping channels</td></tr>
<tr><td>Who else is there</td><td>every neighbour, Bluetooth, microwaves</td><td>fewer neighbours</td></tr>
</table></div>
<ul>
<li><strong>Dorm floor, 30 routers on 2.4 GHz</strong>: pick 1, 6 or 11, whichever is least used (a Wi-Fi analyser app shows them); never "channel 3" — it overlaps both 1 and 6.</li>
<li><strong>Placement</strong>: high, central, in the open — not on the floor, not in a cabinet, not behind a fridge or a fish tank.</li>
<li><strong>Mesh</strong> (several nodes, one network name) for big houses: wired back-haul is best; a wireless hop halves throughput. A <strong>repeater</strong> that creates "MyWiFi_EXT" is the cheap, slower version.</li>
</ul>
<p>Radio cannot be measured in containers — this section is explained, not measured.</p>

<h3>🕵️ The attacker's corner</h3>
${R('c146-admin', 'U=', 4)}
<p>Anyone on the same network — a roommate, a guest, malware on a family phone — tries the admin page with the default login and is in on the third try: Wi-Fi password, port forwards, the DNS every device uses (point it at a phishing DNS, lesson 14.2), firmware.</p>
<ul>
<li><strong>Change the admin password</strong> (not the Wi-Fi one — the admin one), turn off remote administration from the WAN.</li>
<li><strong>Turn off WPS</strong>: its 8-digit PIN can be brute-forced in hours on many routers.</li>
<li><strong>UPnP</strong>: malware inside your network can ask the router to open a port to itself, silently — and cheap cameras do it by default. Turn UPnP off unless you need it; check the list of mappings.</li>
<li><strong>Update firmware</strong>; replace routers that no longer get updates — old routers are a favourite botnet target.</li>
<li><strong>Cheap IoT</strong> (cameras, plugs, TV boxes) on a <strong>guest network</strong> or separate VLAN: if one is hacked, it cannot reach your laptop.</li>
<li><strong>Every forwarded port is a public door</strong>: bots scan the whole IPv4 Internet in minutes. Forward only what you mean, to something patched and password-protected — or use a tunnel instead.</li>
</ul>

<h3>"What if…"</h3>
<ul>
<li><strong>…the dorm gives each room only a cable to the school network?</strong> Your router's WAN is then a private address behind the school's NAT: no inbound connections, same as CGNAT — and the school rules of 14.2 still apply.</li>
<li><strong>…IPv6?</strong> Many Vietnamese ISPs give IPv6 too; IPv6 has no NAT, so a device can be reachable directly if the router's IPv6 firewall allows it (lesson 2.4) — a way around CGNAT, and a reason to check that firewall.</li>
<li><strong>…two routers at home (ISP modem + your Wi-Fi router)?</strong> Double NAT inside the house: forward on both, or set the ISP box to bridge mode.</li>
</ul>

<h3>Where this lives in the computer</h3>
<ul>
<li>A home router is a small Linux computer: dnsmasq (DHCP/DNS), netfilter (NAT, firewall), a web admin, hostapd (Wi-Fi).</li>
<li>The DHCP lease file and the reservation list are files in its flash/RAM; the forward is a DNAT rule; the conntrack table is in its RAM (lesson 14.5).</li>
</ul>

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> you want your home PC to serve your project to a teacher. Lab: <code>CHI=146 GIU_LAB=1 bash lab/code/dung-output-ch14b.sh</code>.</p>
<ol>
<li>On <code>nft-rnha</code>, prove whether you are behind CGNAT (two addresses, one command each).</li>
<li>Reserve 192.168.1.60 for <code>nft-nha</code>'s MAC and check the lease.</li>
<li>Forward WAN 8081 to the home PC and test from <code>nft-vps</code> and from <code>nft-isp</code>; explain each result.</li>
<li>Give the teacher a working link without any port forward (hint: 14.3).</li>
</ol>
<p><strong>Done when:</strong> each step has a command and its real output, and step 4 works from <code>nft-vps</code>.</p>
<details><summary>Solution</summary><p>1: <code>ip -4 -br addr show wan</code> → 100.64.0.2 (in 100.64.0.0/10) vs <code>curl http://news.test/</code> → 198.18.0.40. 2: <code>dhcp-host=3c:7c:3f:1a:2b:10,192.168.1.60</code> in /run/nha/d/, restart dnsmasq, renew on nft-nha. 3: from the VPS: refused / timeout (ISP NAT); from the ISP network: works. 4: on nft-nha <code>ssh -R 0.0.0.0:8080:localhost:80 tunnel@vps.example</code> with GatewayPorts (or the existing 2222 tunnel + ProxyJump for SSH).</p></details>
</div>

<details><summary>🧠 Self-check (4 questions)</summary>
<ol>
<li>Your router's WAN is 100.72.15.3 and "what is my IP" says 113.x.x.x. What does it mean? — <em>CGNAT: a second NAT at the ISP; inbound port forwards cannot work.</em></li>
<li>Why reserve a DHCP address before forwarding a port? — <em>The forward points to an IP; without a reservation the device may get another one.</em></li>
<li>On a crowded 2.4 GHz floor, which channels should you choose from? — <em>1, 6 or 11.</em></li>
<li>Name two router settings to change on day one. — <em>Admin password; WPS off; UPnP off; remote admin off; firmware update.</em></li>
</ol></details>

<h3>🗂 Key terms</h3>
${kv([
    ['DHCP reservation (giữ chỗ DHCP)', 'The router always gives the same IP to a given MAC.'],
    ['port forwarding (mở cổng)', 'A DNAT rule: WAN port → an inside IP:port.'],
    ['CGNAT', 'The ISP NATs your router again (100.64.0.0/10); inbound connections cannot reach you.'],
    ['UPnP IGD', 'Lets devices ask the router to open ports, without a human.'],
    ['WPS', 'Push-button / PIN Wi-Fi setup; the PIN is brute-forceable.'],
    ['2.4 / 5 GHz', 'Wi-Fi bands: range vs speed; on 2.4 GHz only channels 1, 6, 11 do not overlap.'],
    ['guest network / VLAN', 'A separate network so untrusted devices cannot reach yours.'],
  ])}

<h3>📌 Summary</h3>
<ul>
<li>The home router is a small Linux box: DHCP, DNS, NAT, firewall, Wi-Fi.</li>
<li>Compare the WAN address with "what is my IP": different (100.64.x, private) ⇒ CGNAT ⇒ port forwards cannot work.</li>
<li>Reserve the IP, then forward; behind CGNAT, tunnel out instead (SSH -R, WireGuard/Tailscale, Cloudflare Tunnel).</li>
<li>Day one: change the admin password, turn off WPS/UPnP/remote admin, update, put IoT on a guest network.</li>
</ul>
<p>Related lessons: <a href="${bai('netdev-2-3-nat')}">2.3 NAT</a> · <a href="${bai('netdev-2-4-ipv6')}">2.4 IPv6</a> · <a href="${bai('netdev-14-1-wifi-truong-mac')}">14.1 DHCP and MAC</a> · <a href="${bai('netdev-14-3-ssh-cong-bi-chan')}">14.3 SSH tunnels</a> · <a href="${bai('netdev-14-4-vpn')}">14.4 VPNs</a> · <a href="${bai('netdev-14-5-chia-se-mang-hotspot')}">14.5 Hotspots and conntrack</a> · <a href="/courses/network-security">Network Security (segmentation, IoT)</a>.</p>
${L('https://www.rfc-editor.org/rfc/rfc6598', '📄', 'RFC 6598 — Shared Address Space (100.64.0.0/10)', 'The range ISPs use for CGNAT.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc6887', '📄', 'RFC 6887 — Port Control Protocol (PCP)', 'The successor of UPnP/NAT-PMP port mapping.', 'Open')}
${L('https://www.cisa.gov/news-events/news/securing-home-routers', '📄', 'CISA — Securing home routers', 'Default passwords, WPS, firmware, remote admin.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.6</span>
<h2>Mạng ở nhà và ký túc xá: router, giữ chỗ DHCP, mở cổng và CGNAT</h2>
<p class="lead">"Mình mở cổng 8080 trên router y như hướng dẫn mà bạn mình vẫn không vào được máy chủ." Bài này mổ chiếc hộp đang chạy mạng ở nhà hay ký túc xá của bạn, làm đúng như các hướng dẫn nói — và đo xem vì sao nó hỏng với phần lớn sinh viên ở Việt Nam: <strong>CGNAT</strong>. Rồi tới phần sóng, và kẻ xấu rất thích các cài đặt mặc định.</p>

<h3>Hình dung đời thường</h3>
<ul>
<li>Router nhà là <strong>ông quản lý toà nhà</strong>: phát số phòng (DHCP), giữ danh bạ (DNS), ký tên toà nhà lên mọi lá thư gửi đi (NAT), quyết định khách nào được vào (tường lửa), và lo Wi-Fi.</li>
<li><strong>Mở cổng</strong> là dặn ông quản lý: "thư gửi cửa 8080 thì đưa lên phòng 10".</li>
<li><strong>CGNAT</strong> là toà nhà của bạn nằm trong một khu lớn hơn chỉ có một cổng — và bảo vệ của khu chưa từng nghe tới cửa 8080 của bạn.</li>
</ul>

<h3>1 — Internet thấy địa chỉ nào?</h3>
${R('c146-wan', 'ip', 3)}
<p>Địa chỉ WAN (phía Internet) của router là <code>100.64.0.2</code>, thuộc <code>100.64.0.0/10</code> — dải dành cho NAT cấp nhà mạng (RFC 6598). Một trang "what is my IP" thấy địa chỉ khác: <code>198.18.0.40</code>, địa chỉ dùng chung của nhà mạng. Hai địa chỉ đó khác nhau là có một lớp NAT thứ hai bạn không điều khiển được. Kiểm trên trang trạng thái của router nhà bạn rồi so với bất kỳ trang "what is my IP" nào — nếu WAN bắt đầu bằng 100.64–100.127, hoặc là dải riêng 10.x / 172.16–31.x / 192.168.x, là bạn đang sau CGNAT (mạng ký túc xá thường là dải riêng sau NAT của trường — hiệu ứng y hệt).</p>

<h3>2 — DHCP: số phòng, và giữ chỗ một số</h3>
${R('c146-dhcp', 'busybox', 2)}
<p>Laptop nhận <code>192.168.1.148</code> trong 12 giờ (DORA, bài 14.1). Lướt web thì ổn — nhưng mở cổng, máy in hay NAS cần một địa chỉ không bao giờ đổi. Router có thể <strong>giữ chỗ</strong> một địa chỉ cho một MAC:</p>
${R('c146-giucho', 'echo', 3)}
${R('c146-dhcp2', 'busybox', 1)}
<p>Cùng laptop, giờ luôn là <code>192.168.1.50</code>. Nhớ bài 14.1: nếu laptop dùng <em>địa chỉ Wi-Fi riêng</em> kiểu luân phiên, chỗ giữ sẽ đi theo một MAC không còn tồn tại — với mạng nhà, đặt nó về Cố định/Tắt.</p>

<h3>3 — Mở cổng, và vì sao hỏng sau CGNAT</h3>
<p>Một máy ở nhà phục vụ một trang (NAS, camera, đồ án):</p>
${R('c146-nas', 'curl', 1)}
${R('c146-mo-cong', 'iptables', 2)}
<p>"Mở cổng" chỉ có vậy: một luật DNAT — cổng WAN 8080 → 192.168.1.10:80 (bài 2.3). Từ Internet (VPS):</p>
${R('c146-thu-vao', 'curl', 2)}
<p>Hai kiểu hỏng khác nhau. Tới địa chỉ công cộng của nhà mạng: <em>bị từ chối</em> — NAT của nhà mạng không có luật nào cho 8080, nên chẳng có gì nghe ở đó. Tới địa chỉ WAN của router: <em>hết giờ</em> — 100.64.0.2 hoàn toàn không định tuyến được trên Internet. Luật mở cổng của ta hỏng à? Thử từ bên trong mạng nhà mạng:</p>
${R('c146-isp-thu', 'curl', 1)}
<p>Chạy — router đã làm xong phần của nó. Mảnh còn thiếu là NAT của chính nhà mạng. Có nhà mạng sẽ mở thêm (hoặc cấp IP công cộng/tĩnh) nếu bạn gọi tổng đài xin; khi có thêm luật đó:</p>
${R('c146-isp-mo', 'iptables', 1)}
${R('c146-thu-vao2', 'curl', 1)}
<p>Nếu họ không mở: đừng mở cổng nữa. Dùng đường hầm đi <strong>ra</strong> — SSH -R tới VPS (bài 14.3), WireGuard/Tailscale (14.4), hoặc Cloudflare Tunnel / ngrok — đúng mánh chạy được sau bao nhiêu lớp NAT cũng được.</p>
${net('nat', 'inbound', 'vi', 'Mở cổng là một luật DNAT: theo một gói từ Internet đi vào tới máy bên trong.', { tour: 'nat-inbound' })}
${net('nat', 'cgnat', 'vi', 'Hai lớp NAT: vì sao mở cổng trên router nhà mình là chưa đủ.')}

<h3>4 — UPnP: thiết bị tự mở cổng</h3>
${R('c146-upnp', 'miniupnpd', 2)}
${R('c146-upnp-nha', 'upnpc', 1)}
<p>UPnP cho máy chơi game hay camera hỏi router "mở giúp cổng 9090 về tôi" — không trang quản trị, không cần người. Dưới CGNAT nó đơn giản là hỏng (chính router cảnh báo nó cần IP công cộng). Trên router <em>có</em> IP công cộng thì nó chạy — và đó là mối nguy ở góc kẻ xấu bên dưới. Lab không dựng trường hợp đó; phần này giải thích, chưa đo.</p>

<h3>5 — Sóng: 2,4 GHz, 5 GHz, kênh và chỗ đặt router</h3>
<div class="table-wrap"><table>
<tr><th></th><th>2,4 GHz</th><th>5 GHz (và 6 GHz với Wi-Fi 6E/7)</th></tr>
<tr><td>Tầm xa, xuyên tường</td><td>xa hơn, xuyên tường tốt hơn</td><td>gần hơn, bị tường chặn nhiều hơn</td></tr>
<tr><td>Tốc độ</td><td>thấp hơn; đông đúc</td><td>cao hơn; nhiều kênh hơn hẳn</td></tr>
<tr><td>Kênh</td><td>chỉ <strong>1, 6, 11</strong> không chồng nhau (rộng 20 MHz, cách nhau 5 MHz)</td><td>hàng chục kênh không chồng</td></tr>
<tr><td>Còn ai ở đó</td><td>mọi nhà hàng xóm, Bluetooth, lò vi sóng</td><td>ít hàng xóm hơn</td></tr>
</table></div>
<ul>
<li><strong>Tầng ký túc xá, 30 router ở 2,4 GHz</strong>: chọn 1, 6 hoặc 11, cái nào ít người dùng nhất (ứng dụng phân tích Wi-Fi cho xem); đừng bao giờ "kênh 3" — nó chồng lên cả 1 lẫn 6.</li>
<li><strong>Chỗ đặt</strong>: cao, ở giữa, thoáng — không đặt dưới sàn, trong tủ, sau tủ lạnh hay bể cá.</li>
<li><strong>Mesh</strong> (nhiều nút, một tên mạng) cho nhà rộng: nối các nút bằng dây là tốt nhất; một chặng không dây làm giảm nửa tốc độ. <strong>Bộ kích sóng</strong> tạo ra "MyWiFi_EXT" là bản rẻ và chậm hơn.</li>
</ul>
<p>Không đo được sóng trong container — phần này giải thích, chưa đo.</p>

<h3>🕵️ Góc kẻ xấu</h3>
${R('c146-admin', 'U=', 4)}
<p>Ai cùng mạng — bạn cùng phòng, khách, mã độc trên điện thoại người nhà — thử trang quản trị với thông tin đăng nhập mặc định và vào được ở lần thứ ba: mật khẩu Wi-Fi, các cổng đã mở, DNS mà mọi thiết bị dùng (trỏ nó về một DNS lừa đảo, bài 14.2), firmware.</p>
<ul>
<li><strong>Đổi mật khẩu quản trị</strong> (không phải mật khẩu Wi-Fi — mật khẩu quản trị), tắt quản trị từ xa qua WAN.</li>
<li><strong>Tắt WPS</strong>: mã PIN 8 chữ số của nó dò ra được trong vài giờ trên nhiều router.</li>
<li><strong>UPnP</strong>: mã độc bên trong mạng có thể xin router mở một cổng về chính nó, lặng lẽ — và camera rẻ tiền làm thế theo mặc định. Không cần thì tắt UPnP; xem danh sách các ánh xạ.</li>
<li><strong>Cập nhật firmware</strong>; thay router không còn được cập nhật — router cũ là mục tiêu ưa thích của botnet.</li>
<li><strong>IoT rẻ tiền</strong> (camera, ổ cắm, TV box) để ở <strong>mạng khách</strong> hoặc VLAN riêng: một cái bị hack cũng không chạm được laptop của bạn.</li>
<li><strong>Mỗi cổng mở là một cánh cửa công khai</strong>: bot quét cả Internet IPv4 trong vài phút. Chỉ mở thứ bạn cố ý, tới thứ đã vá và có mật khẩu — hoặc dùng đường hầm thay thế.</li>
</ul>

<h3>"Nếu… thì sao"</h3>
<ul>
<li><strong>…ký túc xá chỉ cho mỗi phòng một sợi cáp vào mạng trường?</strong> WAN của router bạn khi đó là địa chỉ riêng sau NAT của trường: không ai gọi vào được, y như CGNAT — và các luật trường ở 14.2 vẫn áp dụng.</li>
<li><strong>…IPv6?</strong> Nhiều nhà mạng ở Việt Nam cấp cả IPv6; IPv6 không có NAT, nên một thiết bị có thể được gọi tới trực tiếp nếu tường lửa IPv6 của router cho phép (bài 2.4) — một lối đi vòng CGNAT, và một lý do để kiểm tường lửa đó.</li>
<li><strong>…hai router trong nhà (modem nhà mạng + router Wi-Fi của bạn)?</strong> NAT kép ngay trong nhà: mở cổng ở cả hai, hoặc chuyển modem nhà mạng sang chế độ bridge.</li>
</ul>

<h3>Nó nằm ở đâu trong máy tính</h3>
<ul>
<li>Router nhà là một máy Linux nhỏ: dnsmasq (DHCP/DNS), netfilter (NAT, tường lửa), một trang quản trị web, hostapd (Wi-Fi).</li>
<li>Tệp lease DHCP và danh sách giữ chỗ là tệp trong flash/RAM của nó; mở cổng là một luật DNAT; bảng conntrack nằm trong RAM của nó (bài 14.5).</li>
</ul>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> bạn muốn máy ở nhà phục vụ đồ án cho thầy xem. Lab: <code>CHI=146 GIU_LAB=1 bash lab/code/dung-output-ch14b.sh</code>.</p>
<ol>
<li>Trên <code>nft-rnha</code>, chứng minh bạn có ở sau CGNAT không (hai địa chỉ, mỗi cái một lệnh).</li>
<li>Giữ chỗ 192.168.1.60 cho MAC của <code>nft-nha</code> và kiểm lease.</li>
<li>Mở cổng WAN 8081 tới máy nhà và thử từ <code>nft-vps</code> và từ <code>nft-isp</code>; giải thích từng kết quả.</li>
<li>Đưa thầy một đường link chạy được mà không cần mở cổng nào (gợi ý: 14.3).</li>
</ol>
<p><strong>Đạt khi:</strong> mỗi bước có lệnh và output thật, và bước 4 chạy được từ <code>nft-vps</code>.</p>
<details><summary>Lời giải</summary><p>1: <code>ip -4 -br addr show wan</code> → 100.64.0.2 (thuộc 100.64.0.0/10) so với <code>curl http://news.test/</code> → 198.18.0.40. 2: <code>dhcp-host=3c:7c:3f:1a:2b:10,192.168.1.60</code> trong /run/nha/d/, khởi động lại dnsmasq, xin lại trên nft-nha. 3: từ VPS: từ chối / hết giờ (NAT nhà mạng); từ mạng nhà mạng: chạy. 4: trên nft-nha <code>ssh -R 0.0.0.0:8080:localhost:80 tunnel@vps.example</code> kèm GatewayPorts (hoặc đường hầm 2222 có sẵn + ProxyJump cho SSH).</p></details>
</div>

<details><summary>🧠 Tự kiểm (4 câu)</summary>
<ol>
<li>WAN của router là 100.72.15.3 còn "what is my IP" báo 113.x.x.x. Nghĩa là gì? — <em>CGNAT: một lớp NAT thứ hai ở nhà mạng; mở cổng vào không thể chạy.</em></li>
<li>Vì sao phải giữ chỗ DHCP trước khi mở cổng? — <em>Luật mở cổng trỏ tới một IP; không giữ chỗ thì thiết bị có thể nhận IP khác.</em></li>
<li>Tầng ký túc xá đông đúc ở 2,4 GHz, nên chọn trong những kênh nào? — <em>1, 6 hoặc 11.</em></li>
<li>Kể hai cài đặt router phải đổi ngay ngày đầu. — <em>Mật khẩu quản trị; tắt WPS; tắt UPnP; tắt quản trị từ xa; cập nhật firmware.</em></li>
</ol></details>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
    ['DHCP reservation (giữ chỗ DHCP)', 'Router luôn cấp cùng một IP cho một MAC.'],
    ['port forwarding (mở cổng)', 'Một luật DNAT: cổng WAN → IP:cổng bên trong.'],
    ['CGNAT', 'Nhà mạng NAT router của bạn thêm lần nữa (100.64.0.0/10); kết nối từ ngoài không tới được bạn.'],
    ['UPnP IGD', 'Cho thiết bị tự xin router mở cổng, không cần người.'],
    ['WPS', 'Cài Wi-Fi bằng nút bấm / mã PIN; mã PIN dò ra được.'],
    ['2,4 / 5 GHz', 'Hai băng tần Wi-Fi: tầm xa và tốc độ; ở 2,4 GHz chỉ kênh 1, 6, 11 không chồng nhau.'],
    ['mạng khách / VLAN', 'Một mạng riêng để thiết bị không tin được không chạm tới máy của bạn.'],
  ])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Router nhà là một máy Linux nhỏ: DHCP, DNS, NAT, tường lửa, Wi-Fi.</li>
<li>So địa chỉ WAN với "what is my IP": khác nhau (100.64.x, dải riêng) ⇒ CGNAT ⇒ mở cổng không thể chạy.</li>
<li>Giữ chỗ IP rồi mới mở cổng; sau CGNAT thì đào hầm đi ra (SSH -R, WireGuard/Tailscale, Cloudflare Tunnel).</li>
<li>Ngày đầu: đổi mật khẩu quản trị, tắt WPS/UPnP/quản trị từ xa, cập nhật, để IoT ở mạng khách.</li>
</ul>
<p>Bài liên quan: <a href="${bai('netdev-2-3-nat')}">2.3 NAT</a> · <a href="${bai('netdev-2-4-ipv6')}">2.4 IPv6</a> · <a href="${bai('netdev-14-1-wifi-truong-mac')}">14.1 DHCP và MAC</a> · <a href="${bai('netdev-14-3-ssh-cong-bi-chan')}">14.3 Đường hầm SSH</a> · <a href="${bai('netdev-14-4-vpn')}">14.4 VPN</a> · <a href="${bai('netdev-14-5-chia-se-mang-hotspot')}">14.5 Điểm phát và conntrack</a> · <a href="/courses/network-security">Bảo mật mạng (phân vùng, IoT)</a>.</p>
${L('https://www.rfc-editor.org/rfc/rfc6598', '📄', 'RFC 6598 — Không gian địa chỉ dùng chung (100.64.0.0/10)', 'Dải nhà mạng dùng cho CGNAT.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc6887', '📄', 'RFC 6887 — Port Control Protocol (PCP)', 'Kế nhiệm của UPnP/NAT-PMP cho việc mở cổng.', 'Mở')}
${L('https://www.cisa.gov/news-events/news/securing-home-routers', '📄', 'CISA — Bảo vệ router gia đình', 'Mật khẩu mặc định, WPS, firmware, quản trị từ xa.', 'Mở')}
</div>
`,
};
