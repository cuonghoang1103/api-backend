/**
 * Chương 14 · Lab 14 — Tuần đầu ở ký túc xá và ở trường: chuẩn bị máy, chẩn đoán mạng bị chặn, vào VPS, VPN, khoe demo (soạn 14/11/2026).
 * Lời giải dùng output thật đã có: lab/out/c141-*, c142-* (dung-output-ch14.sh) và c143-*…c146-* (dung-output-ch14b.sh).
 */
import { run, card, code } from '../_ui.mjs';
import G from '../giang/nfd-lab-14.mjs';

const L = card;
const R = (f, p, n = 1, o = {}) => run(f, p, n, { drop: /^# /, ...o });
const bai = (slug) => `/courses/networking-for-developers/learn?lessonSlug=${slug}`;
const PHIEU = `# Lab 14 report — <your name>, <date>

## R1 Wi-Fi     — private address Off/Fixed for the school SSID; log in; MAC registered = MAC used on SSID 2
## R2 Blocked   — 6 symptoms (DNS, SNI, IP, port 22, UDP, hotspot TTL) → mechanism + the command/counter that proves it
## R3 SSH       — ~/.ssh/config: Match block FIRST → 993 at school, 22 at home (ssh -G proof) · keys only (sshd -T)
## R4 VPN       — WireGuard works at home, fails at school (why) · a tunnel over TCP 443 · DNS leak found and fixed
## R5 Home      — behind CGNAT? (WAN vs what-is-my-IP) · reserved IP · show the demo WITHOUT a port forward
## R6 Safety    — 3 things a stranger/roommate could have done, and the setting that stopped each`;

export default {
  title: 'Lab 14 — Week one in the dorm and at school: Wi-Fi, a blocked network, SSH, VPN and a demo without port forwarding|||Lab 14 — Tuần đầu ở ký túc xá và ở trường: Wi-Fi, mạng bị chặn, SSH, VPN và khoe demo không cần mở cổng',
  slug: 'netdev-14-7-lab-mang-thuc-chien',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab chương 14 theo một tuần thật: chuẩn bị laptop cho Wi-Fi trường (địa chỉ riêng, đăng ký MAC), chẩn đoán 6 kiểu bị chặn kèm bộ đếm chứng minh, SSH vào VPS qua cổng 993 với ~/.ssh/config tự chọn cổng, VPN chạy ở nhà mà chết ở trường và cách qua TCP 443 không rò DNS, kiểm CGNAT và đưa demo ở nhà ra cho thầy mà không mở cổng; rubric 10 điểm, gợi ý theo bậc, lời giải bằng output thật.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lab 14</span>
<h2>Lab 14 — Week one in the dorm and at school</h2>
<p class="lead">Monday you register your laptop on the school Wi-Fi. Tuesday half the Internet seems broken. Wednesday you must deploy from the library, where port 22 is blocked. Thursday your VPN works in the dorm and dies at school. Friday your teacher wants to see the project running on your home PC. This lab is that week, on the chapter's lab: every task has a real command and a real answer.</p>

<h3>What you get</h3>
<ul>
<li>The "school Wi-Fi in a box" (14.1–14.2): two SSIDs, a controller with registration, DNS/SNI/port/UDP/TTL rules — <code>bash lab/code/dung-output-ch14.sh</code> with <code>GIU_LAB=1</code>.</li>
<li>Its extension (14.3–14.6): <code>vps.example</code> with real systemd, a home behind CGNAT, a stranger's phone — <code>GIU_LAB=1 bash lab/code/dung-output-ch14b.sh</code> (<code>CHI=143…146</code> for one lesson).</li>
</ul>

<h3>Requirements</h3>
<ol>
<li><strong>R1 Wi-Fi.</strong> Set the private address so that the MAC you register is the MAC you use on the SSID with Internet; prove it with the controller's table.</li>
<li><strong>R2 Blocked.</strong> For six symptoms — a film site, a social site over HTTPS, a VPN IP, SSH on 22, a UDP game, a phone behind your hotspot — name the mechanism and show the command or counter that proves it.</li>
<li><strong>R3 SSH.</strong> A <code>~/.ssh/config</code> that uses 993 at school and 22 at home (prove with <code>ssh -G</code> on both), and a server that offers keys only (<code>sshd -T</code>).</li>
<li><strong>R4 VPN.</strong> WireGuard works from home; explain why it fails at school; get a tunnel over TCP 443; find a DNS leak and fix it.</li>
<li><strong>R5 Home.</strong> Prove whether the home router is behind CGNAT; reserve an IP for the home PC; show its page to the VPS <em>without</em> any port forward.</li>
<li><strong>R6 Safety.</strong> Three things a stranger or a roommate could do in this week's setup, and the setting that prevents each.</li>
</ol>

<h3>Report template</h3>
${code(PHIEU, 'markdown')}

<h3>Rubric — 10 points</h3>
<table>
<tr><th>Item</th><th>Pts</th><th>Full marks when</th></tr>
<tr><td>R1</td><td>1.5</td><td>registered MAC = MAC on SSID 2, shown in the controller's table; you can explain why "Fixed" broke it</td></tr>
<tr><td>R2</td><td>2</td><td>6/6 symptoms mapped to DNS/SNI/IP/port/UDP/TTL, each with its proof</td></tr>
<tr><td>R3</td><td>2</td><td><code>ssh -G</code> shows 993 at school and 22 at home; <code>passwordauthentication no</code></td></tr>
<tr><td>R4</td><td>2</td><td>WireGuard handshake at home, 0 B received at school explained, TCP 443 tunnel up, leak captured then gone</td></tr>
<tr><td>R5</td><td>1.5</td><td>WAN vs what-is-my-IP compared; reservation; page reachable from the VPS via an outgoing tunnel</td></tr>
<tr><td>R6</td><td>1</td><td>three concrete risks with the matching setting</td></tr>
</table>

<h3>Hints by level</h3>
<details><summary>Level 1 — where to look</summary>
<ul><li>R1 → 14.1 · R2 → the table in 14.2 · R3 → 14.3 §2–3 · R4 → 14.4 §1–5 · R5 → 14.6 §1–3 + 14.3 §5 · R6 → the attacker's corners.</li></ul>
</details>
<details><summary>Level 2 — the commands</summary>
<ul>
<li>R1: <code>cat /run/truong/dang-ky.tsv</code> on nft-gw; <code>ip -br link</code> on the laptop.</li>
<li>R2: <code>dig</code>, <code>curl -v https://…</code>, <code>nc -vz -w 3</code>, <code>nc -u</code>; on nft-gw <code>iptables -L CHAN -v -n</code> and <code>iptables -t mangle -L PREROUTING -v -n</code>.</li>
<li>R3: <code>ssh -G vps | grep ^port</code>; <code>sshd -T | grep passwordauth</code>.</li>
<li>R4: <code>wg show</code>; OpenVPN over 443; <code>tcpdump -i sv0 udp port 53</code> on nft-gw.</li>
<li>R5: <code>ip -4 -br addr show wan</code> vs <code>curl http://news.test/</code>; <code>dhcp-host=</code>; <code>ssh -R</code> + GatewayPorts.</li>
</ul>
</details>

<h3>Solution (real output)</h3>
<p><strong>R1</strong> — with the private address <em>Fixed</em>, SSID 2 sees another MAC and blocks you; turned Off, the same MAC is registered and allowed:</p>
${R('c141-gw-sau', 'cat', 1)}
<p><strong>R2</strong> — the counters on the controller, one per mechanism (DNS port 53, SNI, VPN IP, ports, UDP), plus the TTL rule:</p>
${R('c142-dem', 'iptables -L CHAN', 2)}
<p><strong>R3</strong> — the config picks 993 at school and 22 at home; the server offers keys only:</p>
${R('c143-config', 'ssh -G vps 2>/dev/null', 1, { lan: 2 })}
${R('c143-config-nha', 'ssh -G', 1)}
${R('c143-do-vps', 'sshd -T', 1)}
<p><strong>R4</strong> — at school WireGuard never completes a handshake; OpenVPN over 443 does; the school's DNS saw every name until resolv.conf was fixed:</p>
${R('c144-truong', 'wg show', 1)}
${R('c144-ovpn', 'grep', 1)}
${R('c144-ovpn-gw', 'tshark', 1)}
${R('c144-ovpn-dns', 'echo', 2)}
<p><strong>R5</strong> — WAN 100.64.0.2 ≠ 198.18.0.40 (CGNAT); a reservation gives .50; the port forward fails from the Internet, so publish through an outgoing tunnel instead:</p>
${R('c146-wan', 'python3', 2)}
${R('c146-dhcp2', 'busybox', 1)}
${R('c146-thu-vao', 'curl', 2)}
${R('c143-R-ban2', 'curl', 1)}
<p><strong>R6</strong> — examples: a stranger on your open hotspot leaves with your school account (14.5 → WPA2/WPA3 + passphrase); a SOCKS proxy on 0.0.0.0 lets the same Wi-Fi use your VPS (14.3 → bind 127.0.0.1); the router's default admin login (14.6 → change it); bots guessing SSH passwords (14.3 → keys only, drop-in <code>01-</code>).</p>
${R('c145-ke-gw', 'cat', 1)}
${R('c146-admin', 'for p', 1)}

<h3>Going further</h3>
<ul>
<li>Replace the SSH -R demo with a WireGuard peer for the home PC and reach it from school over the TCP 443 tunnel.</li>
<li>Turn on the DPI rule of 14.3 and keep R3 working (SSH wrapped in TLS through sslh).</li>
<li>Where a school or operator rule explicitly forbids tunnels or sharing, write in your report what you would do instead.</li>
</ul>
<p>Lessons: <a href="${bai('netdev-14-1-wifi-truong-mac')}">14.1</a> · <a href="${bai('netdev-14-2-mang-truong-chan')}">14.2</a> · <a href="${bai('netdev-14-3-ssh-cong-bi-chan')}">14.3</a> · <a href="${bai('netdev-14-4-vpn')}">14.4</a> · <a href="${bai('netdev-14-5-chia-se-mang-hotspot')}">14.5</a> · <a href="${bai('netdev-14-6-lan-nha-ky-tuc-xa')}">14.6</a>.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 14 · Lab 14</span>
<h2>Lab 14 — Tuần đầu ở ký túc xá và ở trường</h2>
<p class="lead">Thứ Hai bạn đăng ký laptop với Wi-Fi trường. Thứ Ba nửa cái Internet như hỏng. Thứ Tư phải deploy từ thư viện, nơi cổng 22 bị chặn. Thứ Năm VPN chạy ở ký túc xá mà chết ở trường. Thứ Sáu thầy muốn xem đồ án chạy trên máy ở nhà. Lab này là đúng tuần đó, trên lab của chương: việc nào cũng có lệnh thật và câu trả lời thật.</p>

<h3>Bạn được gì</h3>
<ul>
<li>"Wi-Fi trường trong một hộp" (14.1–14.2): hai SSID, bộ điều khiển có đăng ký, các luật DNS/SNI/cổng/UDP/TTL — <code>bash lab/code/dung-output-ch14.sh</code> kèm <code>GIU_LAB=1</code>.</li>
<li>Phần mở rộng (14.3–14.6): <code>vps.example</code> chạy systemd thật, một ngôi nhà sau CGNAT, điện thoại người lạ — <code>GIU_LAB=1 bash lab/code/dung-output-ch14b.sh</code> (<code>CHI=143…146</code> cho từng bài).</li>
</ul>

<h3>Yêu cầu</h3>
<ol>
<li><strong>R1 Wi-Fi.</strong> Đặt địa chỉ riêng sao cho MAC bạn đăng ký chính là MAC bạn dùng ở SSID có Internet; chứng minh bằng bảng của bộ điều khiển.</li>
<li><strong>R2 Bị chặn.</strong> Với sáu triệu chứng — trang phim, mạng xã hội qua HTTPS, IP của VPN, SSH ở 22, game UDP, điện thoại sau điểm phát của bạn — gọi tên cơ chế và đưa lệnh hoặc bộ đếm chứng minh.</li>
<li><strong>R3 SSH.</strong> Một <code>~/.ssh/config</code> dùng 993 ở trường và 22 ở nhà (chứng minh bằng <code>ssh -G</code> ở cả hai), và máy chủ chỉ nhận khoá (<code>sshd -T</code>).</li>
<li><strong>R4 VPN.</strong> WireGuard chạy từ nhà; giải thích vì sao nó hỏng ở trường; có một đường hầm qua TCP 443; tìm một chỗ rò DNS và vá.</li>
<li><strong>R5 Nhà.</strong> Chứng minh router nhà có ở sau CGNAT không; giữ chỗ IP cho máy nhà; đưa trang của nó tới VPS <em>không</em> cần mở cổng nào.</li>
<li><strong>R6 An toàn.</strong> Ba việc một người lạ hay bạn cùng phòng có thể làm trong cấu hình tuần này, và cài đặt chặn từng việc.</li>
</ol>

<h3>Mẫu báo cáo</h3>
${code(PHIEU, 'markdown')}

<h3>Thang điểm — 10 điểm</h3>
<table>
<tr><th>Mục</th><th>Điểm</th><th>Đủ điểm khi</th></tr>
<tr><td>R1</td><td>1,5</td><td>MAC đăng ký = MAC ở SSID 2, có bảng của bộ điều khiển; giải thích được vì sao "Cố định" làm hỏng</td></tr>
<tr><td>R2</td><td>2</td><td>6/6 triệu chứng gán đúng DNS/SNI/IP/cổng/UDP/TTL, mỗi cái kèm bằng chứng</td></tr>
<tr><td>R3</td><td>2</td><td><code>ssh -G</code> ra 993 ở trường và 22 ở nhà; <code>passwordauthentication no</code></td></tr>
<tr><td>R4</td><td>2</td><td>WireGuard bắt tay ở nhà, giải thích 0 B received ở trường, hầm TCP 443 chạy, chỗ rò bắt được rồi hết</td></tr>
<tr><td>R5</td><td>1,5</td><td>so WAN với what-is-my-IP; giữ chỗ; trang tới được từ VPS qua đường hầm đi ra</td></tr>
<tr><td>R6</td><td>1</td><td>ba rủi ro cụ thể kèm cài đặt tương ứng</td></tr>
</table>

<h3>Gợi ý theo bậc</h3>
<details><summary>Bậc 1 — xem ở đâu</summary>
<ul><li>R1 → 14.1 · R2 → bảng ở 14.2 · R3 → 14.3 mục 2–3 · R4 → 14.4 mục 1–5 · R5 → 14.6 mục 1–3 + 14.3 mục 5 · R6 → các góc kẻ xấu.</li></ul>
</details>
<details><summary>Bậc 2 — lệnh</summary>
<ul>
<li>R1: <code>cat /run/truong/dang-ky.tsv</code> trên nft-gw; <code>ip -br link</code> trên laptop.</li>
<li>R2: <code>dig</code>, <code>curl -v https://…</code>, <code>nc -vz -w 3</code>, <code>nc -u</code>; trên nft-gw <code>iptables -L CHAN -v -n</code> và <code>iptables -t mangle -L PREROUTING -v -n</code>.</li>
<li>R3: <code>ssh -G vps | grep ^port</code>; <code>sshd -T | grep passwordauth</code>.</li>
<li>R4: <code>wg show</code>; OpenVPN qua 443; <code>tcpdump -i sv0 udp port 53</code> trên nft-gw.</li>
<li>R5: <code>ip -4 -br addr show wan</code> so với <code>curl http://news.test/</code>; <code>dhcp-host=</code>; <code>ssh -R</code> + GatewayPorts.</li>
</ul>
</details>

<h3>Lời giải (output thật)</h3>
<p><strong>R1</strong> — với địa chỉ riêng <em>Cố định</em>, SSID 2 thấy một MAC khác và chặn bạn; đặt về Tắt thì đúng MAC đó được đăng ký và cho qua:</p>
${R('c141-gw-sau', 'cat', 1)}
<p><strong>R2</strong> — bộ đếm trên bộ điều khiển, mỗi cơ chế một dòng (DNS cổng 53, SNI, IP VPN, cổng, UDP), cộng luật TTL:</p>
${R('c142-dem', 'iptables -L CHAN', 2)}
<p><strong>R3</strong> — config chọn 993 ở trường và 22 ở nhà; máy chủ chỉ nhận khoá:</p>
${R('c143-config', 'ssh -G vps 2>/dev/null', 1, { lan: 2 })}
${R('c143-config-nha', 'ssh -G', 1)}
${R('c143-do-vps', 'sshd -T', 1)}
<p><strong>R4</strong> — ở trường WireGuard không bao giờ bắt tay xong; OpenVPN qua 443 thì được; DNS trường thấy mọi tên tới khi sửa resolv.conf:</p>
${R('c144-truong', 'wg show', 1)}
${R('c144-ovpn', 'grep', 1)}
${R('c144-ovpn-gw', 'tshark', 1)}
${R('c144-ovpn-dns', 'echo', 2)}
<p><strong>R5</strong> — WAN 100.64.0.2 ≠ 198.18.0.40 (CGNAT); giữ chỗ cho ra .50; mở cổng hỏng từ Internet, nên công bố qua một đường hầm đi ra:</p>
${R('c146-wan', 'python3', 2)}
${R('c146-dhcp2', 'busybox', 1)}
${R('c146-thu-vao', 'curl', 2)}
${R('c143-R-ban2', 'curl', 1)}
<p><strong>R6</strong> — ví dụ: người lạ trên điểm phát mở đi ra bằng tài khoản trường của bạn (14.5 → WPA2/WPA3 + mật khẩu dài); proxy SOCKS nghe 0.0.0.0 cho cả Wi-Fi dùng VPS của bạn (14.3 → chỉ nghe 127.0.0.1); đăng nhập quản trị mặc định của router (14.6 → đổi nó); bot đoán mật khẩu SSH (14.3 → chỉ dùng khoá, drop-in <code>01-</code>).</p>
${R('c145-ke-gw', 'cat', 1)}
${R('c146-admin', 'for p', 1)}

<h3>Đi xa hơn</h3>
<ul>
<li>Thay demo SSH -R bằng một peer WireGuard cho máy nhà và vào nó từ trường qua đường hầm TCP 443.</li>
<li>Bật luật DPI của 14.3 mà R3 vẫn chạy (SSH bọc trong TLS qua sslh).</li>
<li>Nơi nào trường hay nhà mạng cấm rõ đường hầm hoặc chia sẻ, ghi vào báo cáo bạn sẽ làm gì thay thế.</li>
</ul>
<p>Các bài: <a href="${bai('netdev-14-1-wifi-truong-mac')}">14.1</a> · <a href="${bai('netdev-14-2-mang-truong-chan')}">14.2</a> · <a href="${bai('netdev-14-3-ssh-cong-bi-chan')}">14.3</a> · <a href="${bai('netdev-14-4-vpn')}">14.4</a> · <a href="${bai('netdev-14-5-chia-se-mang-hotspot')}">14.5</a> · <a href="${bai('netdev-14-6-lan-nha-ky-tuc-xa')}">14.6</a>.</p>
</div>
`,
};
