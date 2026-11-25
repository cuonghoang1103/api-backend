/**
 * 11.1 — Log router và Wi-Fi ở nhà (soạn 24/11/2026, agent lgz).
 * Output thật: OUT['s11/router'] — router OpenWrt 25.12.6 THẬT (x86-64, KVM) trên một LAN ảo 192.168.56.0/24 (./_demo/s11/cong-cu/may.bash):
 * logread, dnsmasq-dhcp, /tmp/dhcp.leases, hostapd (Wi-Fi mô phỏng bằng mac80211_hwsim — hostapd/wpa_supplicant thật), LuCI + dropbear,
 * miniupnpd, gửi syslog UDP về lab7 (rsyslog imudp), khởi động lại làm mất log trong RAM. Giờ/PID/cổng đổi mỗi lần chạy; lời chỉ dùng số tất định.
 * Nguồn sự cố: FBI PSA 25/5/2018 về VPNFilter (ic3.gov, GET 200 ngày 24/11/2026); Mirai — Antonakakis et al., USENIX Security 2017.
 */
import { lenh, ma, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: 'Your home router and Wi-Fi logs: system log, DHCP leases, wireless associations, admin logins, remote syslog|||Log router và Wi‑Fi ở nhà: system log, DHCP lease, kết nối không dây, đăng nhập trang quản trị, gửi syslog ra ngoài',
  slug: 'log-11-1-router-wifi',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Router là máy chủ đầu tiên trong nhà bạn và cũng là máy ghi log bị bỏ quên nhất. Chạy thật trên router OpenWrt 25.12.6: đọc logread, bảng DHCP lease để biết thiết bị nào trong nhà, log hostapd khi điện thoại vào Wi‑Fi và khi gõ sai mật khẩu Wi‑Fi, dòng đăng nhập trang quản trị sai từ máy lạ, UPnP tự mở cổng; rồi gửi log về máy Linux bằng syslog vì log của router nằm trong RAM — khởi động lại là mất, và có chứng minh bằng output thật.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.1</span>
<h2>The router is a server — and the most forgotten log in your house</h2>
<p class="lead">Every device in your home talks to the Internet through one box. That box hands out addresses, answers DNS, decides what gets through, and lets people log in to change all of that. It keeps a log of every one of those events — usually in RAM, usually never read, usually lost at the next power cut. This lesson reads a real router's log end to end and then moves it to a place where it survives.</p>

<h3>The everyday picture: the guard at the gate of a dormitory</h3>
<p>A dormitory guard writes in a notebook: who came in, which room key they got, who tried to enter with the wrong card, who asked the guard to open the back door. If the notebook is a whiteboard erased every night, nobody can answer "who was here on Tuesday?". A home router is that guard with a whiteboard. Our job: learn to read the whiteboard, then photocopy it every minute to a real notebook (a Linux machine).</p>

<h3>The lab network of this chapter</h3>
<p>To get real output without touching anyone's real network, this chapter runs a whole home LAN as virtual machines on one PC (KVM): a real <strong>OpenWrt 25.12.6</strong> router (the same firmware many home routers run), your Ubuntu VM <code>lab7</code> (192.168.56.10, from Chapters 7–8), a stranger's machine <code>keodo</code> (192.168.56.66), a device to investigate <code>android-7f3a</code> (192.168.56.142) and a Windows laptop <code>LAPTOP-AN</code> (192.168.56.177, Windows Server 2025 evaluation). Wi‑Fi is simulated by the Linux module <code>mac80211_hwsim</code>: two virtual radios in the router, one acting as the access point "Nha-An", the other as a phone — the Wi‑Fi software (hostapd, wpa_supplicant) is the real thing. Every manufacturer's web interface looks different (TP-Link, ASUS, Viettel/VNPT/FPT modems…), but almost all of them are Linux with the same daemons underneath, so the lines you learn here are the lines you will find under "System Log" in their menus.</p>
${ma('bash', 's11/cong-cu/may.bash')}

<h3>Step 1 — logread: the whole router in one ring buffer</h3>
${lenh('s11/router', 0)}
${lenh('s11/router', 1)}
<p>OpenWrt keeps the log in a ring buffer in RAM (<code>logd</code>, default 64 KiB; <code>logread</code> prints it). The first lines are the kernel booting: a router that rebooted 30 seconds ago has a 30‑second memory. Each line: time, <em>facility.level</em> (<code>kern.notice</code>, <code>daemon.info</code>, <code>authpriv.warn</code> — the same syslog vocabulary as Lesson 1.3/8.2), program and PID, message. <code>logread -e &lt;pattern&gt;</code> filters, <code>logread -f</code> follows like <code>tail -f</code>.</p>

<h3>Step 2 — who is in my house: DHCP</h3>
${lenh('s11/router', 2)}
<p>DHCP is four messages: DISCOVER ("anyone give me an address?"), OFFER, REQUEST, ACK. The ACK line is the receipt: IP, MAC address, and the <strong>hostname the device announced</strong>. Here a device calling itself <code>android-7f3a</code> got 192.168.56.142. The lease table is the router's current guest list:</p>
${lenh('s11/router', 3)}
${lenh('s11/router', 4)}
<p>Columns of <code>/tmp/dhcp.leases</code> (dnsmasq): expiry time as a Unix timestamp, MAC, IP, hostname, client-id. The lease is 12 h, so the expiry 23:54 means "got or renewed it at 11:54". Two things a log reader must remember: the hostname is chosen by the device (anyone can call themselves <code>LAPTOP-AN</code>), and modern phones use a <strong>random MAC per Wi‑Fi network</strong> (iOS 14+, Android 10+ "private address") — the same phone has a different MAC at home and at school, and can change it after "forget network". MAC is a clue, not an identity. Devices with a static IP (like lab7) never appear in DHCP at all — the ARP table shows everyone who actually talked recently:</p>
${lenh('s11/router', 5)}

<h3>Step 3 — Wi‑Fi: who joined, who failed</h3>
${lenh('s11/router', 6)}
${lenh('s11/router', 7)}
<p><code>hostapd</code> is the access point software. The happy path: <em>authenticated → associated → AP-STA-CONNECTED → WPA: pairwise key handshake completed (RSN) → EAPOL-4WAY-HS-COMPLETED</em>. The last two mean the device proved it knows the Wi‑Fi password (the WPA2 four-way handshake). Note the MAC <code>a6:3c:91:…</code>: the second hex digit is 6 (binary …10), i.e. a "locally administered" address — the signature of a randomised phone MAC. Now the same phone with a wrong password:</p>
${lenh('s11/router', 8)}
<p><code>AP-STA-POSSIBLE-PSK-MISMATCH</code> repeated, then <em>deauthenticated</em>: the device associated but failed the handshake — wrong password. One or two in a row is a family member who typed badly; dozens from many MACs over a night is someone guessing your Wi‑Fi password (WPA2-PSK cracking usually happens offline from a captured handshake, so you may not even see it — another reason to use a long passphrase and WPA3 when available).</p>

<h3>Step 4 — logins to the admin page</h3>
<p>From the stranger's machine, three password guesses on the web interface and one on SSH:</p>
${lenh('s11/router', 9)}
${lenh('s11/router', 10)}
${lenh('s11/router', 11)}
<p><code>luci: failed login on / for root from 192.168.56.66</code> (the web UI, LuCI) and <code>dropbear … Bad password attempt for 'root' from 192.168.56.66:…</code> (the SSH server). Both are <code>authpriv.warn</code> — filter on that level and you have the router's "auth.log". The <code>Pubkey auth succeeded … from 192.168.56.10</code> lines are <em>us</em>: every command in this lesson logs in from lab7 with an SSH key. Knowing your own footprint is half of reading a log: write down "192.168.56.10 = me" before you start an investigation. Many consumer routers log far less (often only "login success" without the source), which is exactly why you check what yours records <em>before</em> you need it.</p>

<h3>Step 5 — UPnP: a device opening holes in your firewall</h3>
<p>UPnP IGD lets any device on the LAN ask the router "please forward port X from the Internet to me" — no password. Games and cameras love it; so does malware.</p>
${lenh('s11/router', 12)}
${lenh('s11/router', 13)}
${lenh('s11/router', 14)}
${lenh('s11/router', 15)}
<p>Port 2323 was opened to android-7f3a for a week (<code>leaseduration=604800</code>) and now exists as a real NAT rule (<code>dnat ip to 192.168.56.142:2323</code>). Port 22 was refused with code 606 because OpenWrt's default permission rules allow only ports ≥ 1024 — but look at the log: the request line for port 22 looks exactly like the accepted one. <strong>The log records the request, not the decision</strong>; the lease file and the NAT table are the truth. Two lab notes: (1) many ISP modems enable UPnP with no such rules; (2) in this lab the router's WAN has a private address (10.0.2.15, like the carrier-grade NAT many Vietnamese home connections sit behind), so miniupnpd first refused with "private/reserved address … is not suitable for external IP" — it took <code>ext_allow_private_ipv4=yes</code> to proceed. On a CGNAT line, a UPnP mapping is useless to outsiders anyway; on a line with a public IP, it is a real open door.</p>

<h3>Step 6 — send the log somewhere that survives</h3>
<p>On the Linux machine (lab7), rsyslog listens on UDP 514 and writes one file per device (Lesson 8.2 explained rsyslog; here we only add a receiver):</p>
${lenh('s11/router', 16)}
${lenh('s11/router', 17)}
${lenh('s11/router', 18)}
${lenh('s11/router', 19)}
<p>On OpenWrt it is two options, <code>log_ip</code> and <code>log_proto</code> (LuCI: System → System → Logging → External system log server). Most consumer routers have the same field, often called "Remote Log" or "Syslog Server". Lab7 now receives every line, stamped with the router's hostname. Now the proof of why this matters:</p>
${lenh('s11/router', 20)}
${lenh('s11/router', 21)}
${lenh('s11/router', 22)}
<p>Before the reboot the router had 885 lines; after it, 642 new ones — and our test message is gone from the router (0) but still on lab7 (1). The copy on lab7 even shows the boundary: <code>procd: - shutdown -</code>, a gap of 18 seconds, then <code>Logread connected</code> again. Also notice what the copy does <strong>not</strong> contain: the kernel boot messages. The forwarder starts late in boot, so the first seconds after power-on exist only in RAM. Limits of what we just built: UDP syslog can lose packets and travels in clear text on your LAN (TCP or TLS fixes that — Lesson 8.2), and anyone on the LAN can send fake lines to port 514, which is why the ufw rule in Lesson 11.4 allows 514/udp only from 192.168.56.1.</p>

<h3>🛡️ Attacker's corner: routers are servers nobody patches</h3>
<p>In May 2018 the FBI asked every owner of a home or small-office router to <strong>reboot it</strong>: the VPNFilter malware had compromised "hundreds of thousands" of routers and NAS devices worldwide, could collect traffic passing through and could make the router inoperable; the advice included disabling remote management, strong passwords and updating firmware (FBI PSA, 25 May 2018). Two years earlier the Mirai botnet had enslaved cameras and routers simply by trying factory passwords over telnet — ports 23 and 2323 — and used them for some of the largest DDoS attacks ever recorded (Antonakakis et al., USENIX Security 2017). What the router log shows in those stories: logins to the admin interface or telnet from addresses you do not know, configuration changes you did not make, new UPnP mappings, DNS settings changed (so the whole family is sent to the attacker's DNS server). Defence: change the admin password, disable admin from WAN and telnet, turn UPnP off unless you need it, update or replace end-of-life routers, and ship the log out (Step 6) so that a reboot does not erase the evidence.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"How do you find out which devices are on a network you manage?" — DHCP leases (router or DHCP server), ARP/neighbour table for static ones, switch MAC tables; remember random MACs and self-chosen hostnames.</li>
<li>"Why send router/firewall logs to a central server?" — RAM log lost at reboot, small buffer, attacker with admin can clear it; central copy is searchable and correlatable.</li>
<li>"UDP or TCP for syslog?" — UDP is lossy and spoofable; TCP is reliable; TLS adds confidentiality and authentication.</li>
<li>"What is UPnP and why do security teams disable it?" — unauthenticated port forwarding requested by any LAN device.</li>
</ul>

<h3>Real-world situations</h3>
<ul>
<li><strong>"The Wi‑Fi at home is slow at night."</strong> Before blaming the ISP, read the lease table and the hostapd log: an unknown device, or a neighbour who has your password, shows up there.</li>
<li><strong>At an outsourcing company</strong> the office network belongs to IT, not you — but when a customer VPN or a test device "cannot connect", IT will ask for the device's MAC, IP and the exact time. Bring them; that is what they will search in the DHCP and Wi‑Fi controller logs.</li>
<li><strong>Your dorm or rented room router</strong>: you are not the owner. Reading its admin page without permission is not okay (Lesson 0.2); on your own router at home, it is your duty.</li>
</ul>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok"><ol>
<li>Log in to your own home router. Find the system log page and the DHCP client list. Write down every device; identify each one (for phones, compare the MAC shown in the phone's Wi‑Fi details).</li>
<li>Find whether it supports a remote syslog server. If yes, point it to your Linux VM (UDP 514, the rsyslog file above) and confirm a line arrives after you log out and back in to the admin page.</li>
<li>Look for UPnP in its settings. Is it on? Is there a list of current mappings?</li>
<li>In the lab output above, how long ago did the phone with MAC a6:3c:91:7e:22:5b connect when <code>iw … station dump</code> was run, and what does the second hex digit of its MAC tell you?</li>
</ol>
<p><strong>Pass:</strong> (1) a table device ↔ MAC ↔ IP ↔ who owns it, with no unknown row (or the unknown row investigated); (2) a line from your router visible in <code>/var/log/remote/</code>, or a note that your model has no syslog option (then the Lab 11 sample log is your fallback); (3) UPnP state written down and switched off if nobody needs it; (4) 38 seconds; "6" = …0110 in binary, the "locally administered" bit is set, so it is a randomised (private) MAC, not the phone's factory MAC.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['logread / logd', 'OpenWrt ring-buffer log in RAM and the command that prints it.'],
  ['DHCP DISCOVER/OFFER/REQUEST/ACK', 'The four steps of getting an IP; ACK carries IP, MAC, hostname.'],
  ['Lease table', 'Current IP assignments: expiry, MAC, IP, hostname, client-id.'],
  ['hostapd', 'Access-point daemon; AP-STA-CONNECTED, EAPOL-4WAY-HS-COMPLETED, AP-STA-POSSIBLE-PSK-MISMATCH.'],
  ['Random (private) MAC', 'Per-network MAC used by phones; locally administered bit set.'],
  ['UPnP IGD', 'Unauthenticated LAN request to open an inbound port on the router.'],
  ['Remote syslog', 'Forwarding log lines to another machine (UDP/TCP 514, TLS 6514).'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Router log = DHCP, Wi‑Fi, DNS, firewall, admin logins, UPnP — all in one small RAM buffer.</li>
<li>Leases tell who got which IP; hostnames and MACs are claims, not proof.</li>
<li>hostapd shows joins and wrong Wi‑Fi passwords; LuCI/dropbear show admin login failures.</li>
<li>UPnP logs the request; check the lease file and NAT table for what was actually opened.</li>
<li>Reboot = log gone. Forward to a Linux box before you need it.</li>
</ul>
${nguon('📘', 'OpenWrt — Logging (log.essentials)', 'logd, logread, log_ip/log_proto/log_port', 'https://openwrt.org/docs/guide-user/base-system/log.essentials')}
${nguon('📘', 'dnsmasq manual', 'DHCP lease file, --log-dhcp, --log-queries', 'https://thekelleys.org.uk/dnsmasq/docs/dnsmasq-man.html')}
${nguon('🛡️', 'FBI PSA 25 May 2018 — VPNFilter', 'Reboot routers, disable remote management, update firmware', 'https://www.ic3.gov/PSA/2018/PSA180525')}
${nguon('🛡️', 'Understanding the Mirai Botnet (USENIX Security 2017)', 'Default credentials over telnet 23/2323', 'https://www.usenix.org/conference/usenixsecurity17/technical-sessions/presentation/antonakakis')}
${lienKet({ khoa: 'network-security', bai: 'netsec-11-2-router', title: 'Network Security 11.2 — The router is a server', sub: 'Hardening: firmware, admin access, UPnP (configuration lives there)', cta: 'Open' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.1</span>
<h2>Router là một máy chủ — và là cuốn log bị bỏ quên nhất trong nhà</h2>
<p class="lead">Mọi thiết bị trong nhà bạn nói chuyện với Internet qua đúng một cái hộp. Cái hộp đó phát địa chỉ IP, trả lời DNS, quyết định cái gì được đi qua, và cho người ta đăng nhập để đổi tất cả những thứ đó. Nó ghi log mọi việc ấy — thường là trong RAM, thường chẳng ai đọc, và thường mất ở lần cúp điện kế tiếp. Bài này đọc log của một router thật từ đầu đến cuối, rồi chuyển nó tới một nơi sống sót được.</p>

<h3>Liên tưởng đời thường: chú bảo vệ ở cổng ký túc xá</h3>
<p>Chú bảo vệ ký túc xá ghi sổ: ai vào, nhận chìa khoá phòng nào, ai quẹt thẻ sai, ai nhờ mở cửa sau. Nếu "sổ" là cái bảng trắng xoá mỗi tối thì chẳng ai trả lời được "thứ Ba ai đã ở đây?". Router nhà bạn chính là chú bảo vệ dùng bảng trắng. Việc của ta: học đọc cái bảng, rồi cứ mỗi phút chụp lại sang một cuốn sổ thật (một máy Linux).</p>

<h3>Mạng lab của chương này</h3>
<p>Để có output thật mà không đụng vào mạng thật của ai, cả chương chạy nguyên một mạng LAN gia đình bằng máy ảo trên một PC (KVM): một router <strong>OpenWrt 25.12.6</strong> thật (đúng loại firmware nhiều router gia đình đang chạy), máy ảo Ubuntu <code>lab7</code> của bạn (192.168.56.10, từ Chương 7–8), máy của "người lạ" <code>keodo</code> (192.168.56.66), thiết bị cần điều tra <code>android-7f3a</code> (192.168.56.142) và một laptop Windows <code>LAPTOP-AN</code> (192.168.56.177, Windows Server 2025 bản đánh giá). Wi‑Fi được mô phỏng bằng module Linux <code>mac80211_hwsim</code>: hai "card" sóng ảo trong router, một cái làm điểm phát "Nha-An", cái kia đóng vai điện thoại — còn phần mềm Wi‑Fi (hostapd, wpa_supplicant) là đồ thật. Giao diện web mỗi hãng mỗi khác (TP-Link, ASUS, modem Viettel/VNPT/FPT…), nhưng gần như tất cả bên dưới đều là Linux với cùng các dịch vụ, nên những dòng bạn học ở đây chính là những dòng bạn sẽ thấy trong mục "System Log" của chúng.</p>
${ma('bash', 's11/cong-cu/may.bash')}

<h3>Bước 1 — logread: cả router trong một bộ đệm vòng</h3>
${lenh('s11/router', 0)}
${lenh('s11/router', 1)}
<p>OpenWrt giữ log trong một bộ đệm vòng trên RAM (<code>logd</code>, mặc định 64 KiB; <code>logread</code> in nó ra). Những dòng đầu là nhân đang khởi động: router vừa khởi động lại 30 giây trước thì có trí nhớ 30 giây. Mỗi dòng gồm: thời điểm, <em>facility.level</em> (<code>kern.notice</code>, <code>daemon.info</code>, <code>authpriv.warn</code> — đúng bộ từ vựng syslog của Bài 1.3/8.2), tên chương trình và PID, thông điệp. <code>logread -e &lt;mẫu&gt;</code> để lọc, <code>logread -f</code> để theo dõi liên tục như <code>tail -f</code>.</p>

<h3>Bước 2 — nhà mình có những ai: DHCP</h3>
${lenh('s11/router', 2)}
<p>DHCP gồm bốn bước: DISCOVER ("ai cho tôi một địa chỉ?"), OFFER, REQUEST, ACK. Dòng ACK là tờ biên nhận: IP, địa chỉ MAC, và <strong>tên máy do chính thiết bị khai</strong>. Ở đây một thiết bị tự xưng <code>android-7f3a</code> nhận 192.168.56.142. Bảng lease là danh sách khách hiện tại của router:</p>
${lenh('s11/router', 3)}
${lenh('s11/router', 4)}
<p>Các cột của <code>/tmp/dhcp.leases</code> (dnsmasq): thời điểm hết hạn dạng Unix timestamp, MAC, IP, tên máy, client-id. Lease dài 12 giờ, nên hết hạn lúc 23:54 nghĩa là "nhận hoặc gia hạn lúc 11:54". Hai điều người đọc log phải nhớ: tên máy do thiết bị tự chọn (ai cũng có thể tự gọi mình là <code>LAPTOP-AN</code>), và điện thoại đời mới dùng <strong>MAC ngẫu nhiên cho từng mạng Wi‑Fi</strong> (iOS 14+, Android 10+ "địa chỉ riêng tư") — cùng một điện thoại có MAC khác nhau ở nhà và ở trường, và có thể đổi sau khi "quên mạng". MAC là manh mối, không phải danh tính. Thiết bị đặt IP tĩnh (như lab7) không bao giờ hiện trong DHCP — bảng ARP mới cho thấy mọi máy vừa thực sự nói chuyện:</p>
${lenh('s11/router', 5)}

<h3>Bước 3 — Wi‑Fi: ai vào được, ai vào hỏng</h3>
${lenh('s11/router', 6)}
${lenh('s11/router', 7)}
<p><code>hostapd</code> là phần mềm điểm phát. Đường suôn sẻ: <em>authenticated → associated → AP-STA-CONNECTED → WPA: pairwise key handshake completed (RSN) → EAPOL-4WAY-HS-COMPLETED</em>. Hai dòng cuối nghĩa là thiết bị đã chứng minh nó biết mật khẩu Wi‑Fi (bắt tay bốn bước của WPA2). Để ý MAC <code>a6:3c:91:…</code>: chữ số hex thứ hai là 6 (nhị phân …10), tức địa chỉ "quản trị cục bộ" — dấu hiệu của MAC ngẫu nhiên trên điện thoại. Giờ cũng chiếc điện thoại đó nhưng gõ sai mật khẩu:</p>
${lenh('s11/router', 8)}
<p><code>AP-STA-POSSIBLE-PSK-MISMATCH</code> lặp lại, rồi <em>deauthenticated</em>: thiết bị đã kết nối vô tuyến nhưng trượt bước bắt tay — sai mật khẩu. Một hai lần liền là người nhà gõ nhầm; hàng chục lần từ nhiều MAC trong một đêm là có người đang đoán mật khẩu Wi‑Fi của bạn (dò mật khẩu WPA2-PSK thường làm ngoại tuyến từ một lần bắt tay bắt được, nên có khi bạn còn chẳng thấy — thêm một lý do để dùng cụm mật khẩu dài và WPA3 nếu có).</p>

<h3>Bước 4 — đăng nhập trang quản trị</h3>
<p>Từ máy người lạ, ba lần đoán mật khẩu trên giao diện web và một lần trên SSH:</p>
${lenh('s11/router', 9)}
${lenh('s11/router', 10)}
${lenh('s11/router', 11)}
<p><code>luci: failed login on / for root from 192.168.56.66</code> (giao diện web LuCI) và <code>dropbear … Bad password attempt for 'root' from 192.168.56.66:…</code> (máy chủ SSH). Cả hai đều ở mức <code>authpriv.warn</code> — lọc theo mức đó là bạn có "auth.log" của router. Các dòng <code>Pubkey auth succeeded … from 192.168.56.10</code> là <em>chính ta</em>: mỗi lệnh trong bài đều đăng nhập từ lab7 bằng khoá SSH. Biết dấu chân của chính mình là một nửa của việc đọc log: ghi sẵn "192.168.56.10 = mình" trước khi bắt đầu điều tra. Nhiều router gia đình ghi ít hơn hẳn (thường chỉ "đăng nhập thành công" mà không có IP nguồn) — chính vì vậy phải kiểm xem router của mình ghi gì <em>trước</em> khi cần đến.</p>

<h3>Bước 5 — UPnP: một thiết bị tự khoét lỗ trên tường lửa</h3>
<p>UPnP IGD cho phép bất kỳ thiết bị nào trong LAN xin router "chuyển giúp cổng X từ Internet về tôi" — không cần mật khẩu. Game và camera rất thích; mã độc cũng vậy.</p>
${lenh('s11/router', 12)}
${lenh('s11/router', 13)}
${lenh('s11/router', 14)}
${lenh('s11/router', 15)}
<p>Cổng 2323 đã được mở về android-7f3a trong một tuần (<code>leaseduration=604800</code>) và giờ là một luật NAT thật (<code>dnat ip to 192.168.56.142:2323</code>). Cổng 22 bị từ chối với mã 606 vì luật quyền mặc định của OpenWrt chỉ cho cổng ≥ 1024 — nhưng nhìn log mà xem: dòng yêu cầu cho cổng 22 trông y hệt dòng được chấp nhận. <strong>Log ghi lại yêu cầu, không ghi quyết định</strong>; tệp lease và bảng NAT mới là sự thật. Hai ghi chú về lab: (1) nhiều modem nhà mạng bật UPnP mà không có luật như vậy; (2) trong lab, WAN của router mang địa chỉ riêng (10.0.2.15, giống CGNAT mà nhiều đường truyền gia đình ở Việt Nam đang nằm sau), nên ban đầu miniupnpd từ chối với "private/reserved address … is not suitable for external IP" — phải thêm <code>ext_allow_private_ipv4=yes</code> mới chạy tiếp. Trên đường CGNAT, ánh xạ UPnP vốn vô dụng với người bên ngoài; trên đường có IP công khai, nó là một cánh cửa mở thật.</p>

<h3>Bước 6 — gửi log tới nơi sống sót được</h3>
<p>Trên máy Linux (lab7), rsyslog nghe UDP 514 và ghi mỗi thiết bị một tệp (Bài 8.2 đã giảng rsyslog; ở đây chỉ thêm phần nhận):</p>
${lenh('s11/router', 16)}
${lenh('s11/router', 17)}
${lenh('s11/router', 18)}
${lenh('s11/router', 19)}
<p>Trên OpenWrt chỉ là hai tuỳ chọn <code>log_ip</code> và <code>log_proto</code> (LuCI: System → System → Logging → External system log server). Hầu hết router gia đình có ô tương tự, thường tên "Remote Log" hoặc "Syslog Server". Giờ lab7 nhận mọi dòng, kèm tên máy của router. Và đây là bằng chứng vì sao việc này quan trọng:</p>
${lenh('s11/router', 20)}
${lenh('s11/router', 21)}
${lenh('s11/router', 22)}
<p>Trước khi khởi động lại, router có 885 dòng; sau đó là 642 dòng mới — dòng thử của ta đã biến mất khỏi router (0) nhưng vẫn còn trên lab7 (1). Bản sao trên lab7 còn cho thấy cả ranh giới: <code>procd: - shutdown -</code>, khoảng trống 18 giây, rồi lại <code>Logread connected</code>. Để ý cả cái bản sao <strong>không</strong> có: các dòng nhân lúc khởi động. Bộ chuyển tiếp chạy muộn trong quá trình khởi động, nên mấy giây đầu sau khi bật nguồn chỉ tồn tại trong RAM. Giới hạn của thứ ta vừa dựng: syslog UDP có thể rơi gói và đi rõ chữ trong LAN (TCP hoặc TLS khắc phục — Bài 8.2), và bất kỳ ai trong LAN cũng gửi được dòng giả vào cổng 514, vì thế luật ufw ở Bài 11.4 chỉ cho 514/udp từ 192.168.56.1.</p>

<h3>🛡️ Góc hacker: router là máy chủ không ai vá</h3>
<p>Tháng 5/2018, FBI kêu gọi mọi người dùng router gia đình và văn phòng nhỏ <strong>khởi động lại router</strong>: mã độc VPNFilter đã chiếm "hàng trăm nghìn" router và thiết bị NAS khắp thế giới, có thể thu thập dữ liệu đi qua và có thể làm router "chết hẳn"; lời khuyên kèm theo là tắt quản trị từ xa, đặt mật khẩu mạnh và cập nhật firmware (FBI PSA, 25/5/2018). Hai năm trước đó, botnet Mirai đã biến camera và router thành lính chỉ bằng cách thử mật khẩu mặc định của nhà sản xuất qua telnet — cổng 23 và 2323 — rồi dùng chúng cho vài vụ DDoS lớn nhất từng ghi nhận (Antonakakis và cộng sự, USENIX Security 2017). Log router cho thấy gì trong những chuyện đó: đăng nhập trang quản trị hoặc telnet từ địa chỉ lạ, thay đổi cấu hình bạn không làm, ánh xạ UPnP mới, thiết lập DNS bị đổi (để cả nhà bị đưa tới máy chủ DNS của kẻ tấn công). Phòng: đổi mật khẩu quản trị, tắt quản trị từ WAN và telnet, tắt UPnP nếu không cần, cập nhật hoặc thay router hết hỗ trợ, và gửi log ra ngoài (Bước 6) để một lần khởi động lại không xoá sạch bằng chứng.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"Làm sao biết những thiết bị nào đang ở trong mạng bạn quản lý?" — lease DHCP (router hoặc máy chủ DHCP), bảng ARP/neighbour cho máy IP tĩnh, bảng MAC của switch; nhớ MAC ngẫu nhiên và tên máy tự khai.</li>
<li>"Vì sao phải gửi log router/tường lửa về máy chủ trung tâm?" — log trong RAM mất khi khởi động lại, bộ đệm nhỏ, kẻ có quyền quản trị xoá được; bản trung tâm tìm được và đối chiếu được.</li>
<li>"Syslog nên dùng UDP hay TCP?" — UDP dễ mất và dễ bị giả; TCP tin cậy; TLS thêm bí mật và xác thực.</li>
<li>"UPnP là gì và vì sao đội bảo mật hay tắt nó?" — chuyển cổng không cần xác thực, thiết bị nào trong LAN xin cũng được.</li>
</ul>

<h3>Tình huống đi làm thật</h3>
<ul>
<li><strong>"Wi‑Fi nhà buổi tối chậm."</strong> Trước khi đổ cho nhà mạng, đọc bảng lease và log hostapd: một thiết bị lạ, hay hàng xóm biết mật khẩu nhà bạn, sẽ hiện ở đó.</li>
<li><strong>Ở công ty outsourcing</strong> mạng văn phòng thuộc bộ phận IT, không thuộc bạn — nhưng khi VPN của khách hàng hay một máy test "không kết nối được", IT sẽ hỏi MAC, IP và thời điểm chính xác. Mang sẵn ba thứ đó; đó là cái họ sẽ tìm trong log DHCP và bộ điều khiển Wi‑Fi.</li>
<li><strong>Router ở ký túc xá hay phòng trọ</strong>: bạn không phải chủ. Tự ý đọc trang quản trị không được phép (Bài 0.2); router nhà mình thì đó là trách nhiệm của bạn.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Đăng nhập router nhà bạn. Tìm trang system log và danh sách thiết bị DHCP. Ghi lại mọi thiết bị và xác định từng cái (với điện thoại, so với MAC hiện trong phần chi tiết Wi‑Fi của máy).</li>
<li>Xem router có hỗ trợ máy chủ syslog từ xa không. Nếu có, trỏ về máy ảo Linux của bạn (UDP 514, tệp rsyslog ở trên) và xác nhận có dòng mới tới sau khi bạn đăng xuất rồi đăng nhập lại trang quản trị.</li>
<li>Tìm UPnP trong cài đặt. Đang bật hay tắt? Có danh sách ánh xạ hiện tại không?</li>
<li>Trong output lab ở trên: lúc chạy <code>iw … station dump</code>, chiếc điện thoại MAC a6:3c:91:7e:22:5b đã kết nối được bao lâu, và chữ số hex thứ hai của MAC nói gì?</li>
</ol>
<p><strong>Đạt khi:</strong> (1) có bảng thiết bị ↔ MAC ↔ IP ↔ của ai, không còn dòng nào "không rõ" (hoặc dòng lạ đã được điều tra); (2) thấy một dòng của router trong <code>/var/log/remote/</code>, hoặc ghi chú rằng mẫu router của bạn không có syslog (khi đó dùng log mẫu của Lab 11); (3) đã ghi trạng thái UPnP và tắt nếu không ai cần; (4) 38 giây; "6" = …0110 nhị phân, bit "quản trị cục bộ" được bật, nên đây là MAC ngẫu nhiên (riêng tư), không phải MAC gốc của máy.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['logread / logd', 'Log bộ đệm vòng trong RAM của OpenWrt và lệnh in nó ra.'],
  ['DHCP DISCOVER/OFFER/REQUEST/ACK', 'Bốn bước xin IP; ACK mang IP, MAC, tên máy.'],
  ['Bảng lease', 'Danh sách cấp IP hiện tại: hết hạn, MAC, IP, tên máy, client-id.'],
  ['hostapd', 'Dịch vụ điểm phát Wi‑Fi; AP-STA-CONNECTED, EAPOL-4WAY-HS-COMPLETED, AP-STA-POSSIBLE-PSK-MISMATCH.'],
  ['MAC ngẫu nhiên (riêng tư)', 'MAC riêng cho từng mạng mà điện thoại dùng; bit quản trị cục bộ được bật.'],
  ['UPnP IGD', 'Yêu cầu không xác thực từ LAN để router mở một cổng vào.'],
  ['Syslog từ xa', 'Chuyển dòng log sang máy khác (UDP/TCP 514, TLS 6514).'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Log router = DHCP, Wi‑Fi, DNS, tường lửa, đăng nhập quản trị, UPnP — tất cả trong một bộ đệm RAM nhỏ.</li>
<li>Lease cho biết ai nhận IP nào; tên máy và MAC là lời khai, không phải bằng chứng.</li>
<li>hostapd cho thấy ai vào Wi‑Fi và ai gõ sai mật khẩu; LuCI/dropbear cho thấy đăng nhập quản trị hỏng.</li>
<li>UPnP ghi yêu cầu; xem tệp lease và bảng NAT để biết thực sự đã mở gì.</li>
<li>Khởi động lại = mất log. Gửi về máy Linux trước khi cần đến.</li>
</ul>
${nguon('📘', 'OpenWrt — Logging (log.essentials)', 'logd, logread, log_ip/log_proto/log_port', 'https://openwrt.org/docs/guide-user/base-system/log.essentials')}
${nguon('📘', 'dnsmasq manual', 'Tệp lease DHCP, --log-dhcp, --log-queries', 'https://thekelleys.org.uk/dnsmasq/docs/dnsmasq-man.html')}
${nguon('🛡️', 'FBI PSA 25/5/2018 — VPNFilter', 'Khởi động lại router, tắt quản trị từ xa, cập nhật firmware', 'https://www.ic3.gov/PSA/2018/PSA180525')}
${nguon('🛡️', 'Understanding the Mirai Botnet (USENIX Security 2017)', 'Mật khẩu mặc định qua telnet 23/2323', 'https://www.usenix.org/conference/usenixsecurity17/technical-sessions/presentation/antonakakis')}
${lienKet({ khoa: 'network-security', bai: 'netsec-11-2-router', title: 'Network Security 11.2 — Router là một máy chủ', sub: 'Gia cố: firmware, trang quản trị, UPnP (phần cấu hình nằm ở đó)', cta: 'Mở bài' })}
</div>
`,
};
