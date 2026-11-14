/**
 * Chương 14 · 14.1 — Wi-Fi trường thực chiến: trang đăng nhập (captive portal), đăng ký thiết bị theo MAC, và "địa chỉ Wi-Fi riêng"
 * làm MAC đổi (soạn 14/11/2026 từ câu hỏi THẬT của chủ kênh: MacBook + laptop Windows, một tài khoản chỉ một MAC).
 * Output thật: lab/out/c141-mac, c141-oui (chạy trên CHÍNH máy Mac — code/ch14/chay-mac.sh, MAC thật bị che 3 byte cuối) ·
 * c141-dk, dora, sv, tat, win, mat, gw-sau, trung-…, arp-… ("Wi-Fi trường trong một hộp", moi-truong/truong.yml — bash code/dung-output-ch14.sh).
 * Lệnh Windows (ipconfig /all, getmac /v) KHÔNG chạy được trên máy soạn ⇒ ghi "theo tài liệu Microsoft", không bịa output.
 */
import { run, card, kv, cauNoi } from '../_ui.mjs';
import { net } from '../_lab.mjs';
import G from '../giang/nfd-14-1.mjs';

const L = card;
const NWC = { mon: 'NWC204', khoa: 'nwc204-computer-networking' };
const R = (f, p, n = 1, o = {}) => run(f, p, n, { drop: /^# /, ...o });
const bai = (slug) => `/courses/networking-for-developers/learn?lessonSlug=${slug}`;

export default {
  title: '14.1 — School Wi-Fi in practice: the login page, device registration by MAC, and the "private Wi-Fi address" that changes your MAC|||14.1 — Wi-Fi trường thực chiến: trang đăng nhập, đăng ký thiết bị theo MAC, và "địa chỉ Wi-Fi riêng" làm MAC đổi',
  slug: 'netdev-14-1-wifi-truong-mac',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Vì sao đăng ký Wi-Fi trường xong vẫn không vào được mạng: MAC và IP khác nhau thế nào, DHCP cấp IP (DORA), trang đăng nhập (captive portal) bật lên ra sao, hệ thống ghi "tài khoản ↔ MAC", và "Địa chỉ Wi-Fi riêng"/"Random hardware addresses" làm MAC lúc đăng ký khác MAC lúc dùng. Đo thật trên máy Mac và trên lab "Wi-Fi trường trong một hộp"; hai máy cùng MAC; góc kẻ xấu: chép MAC, Wi-Fi giả, ARP giả mạo.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.1</span>
<h2>School Wi-Fi in practice: the login page, device registration by MAC, and the "private Wi-Fi address" that changes your MAC</h2>
<div class="callout"><p><strong>🎯 Chapter 14 in one frame — networking where you actually live.</strong> Chapters 1–13 followed one request from your code to a server. This chapter is the network you fight with every day: school Wi-Fi that wants you to log in, a network that blocks sites, games or SSH, a phone sharing a laptop's connection, VPNs and tunnels, the router at home or in the dorm. After it you can (1) explain why your laptop "has Wi-Fi but no Internet" and fix it in minutes; (2) tell which kind of blocking you are hitting from the error alone; (3) keep working — git, SSH, Docker, deploy — on a restricted network; (4) spot the tricks people use against you on shared Wi-Fi. Every lesson is measured on a lab you run yourself: <strong>"school Wi-Fi in a box"</strong>.</p></div>
<p class="lead">A real story. A student owns a MacBook and a Windows laptop. To use the school network you first join an SSID that has <em>no</em> Internet, log in with your student account, then switch to the SSID that <em>has</em> Internet — and only the device you logged in with gets through. One account, one device: when the Mac works, the Windows laptop is blocked, and the other way round. Worse, after registering the Mac, it was blocked anyway, and the "MAC address" seemed to change every time. Hours went into changing settings by feel. This lesson finds the culprit, measures it, and gives the fix that works the first time.</p>

<h3>Two addresses, two jobs: MAC and IP</h3>
<p>People say "the IP of my Mac" when they mean the MAC address. They are different things with different jobs (lesson 1.4 introduced both):</p>
<div class="table-wrap"><table>
<tr><th></th><th>MAC address</th><th>IP address</th></tr>
<tr><td>Looks like</td><td><code>a4:83:e7:5c:21:0b</code> (6 bytes, hex)</td><td><code>10.20.2.114</code> (4 bytes, decimal)</td></tr>
<tr><td>Layer</td><td>2 — one link (one Wi-Fi network, one switch)</td><td>3 — across networks, end to end</td></tr>
<tr><td>Who sets it</td><td>the card's factory, or the OS (private/random address)</td><td>the network: DHCP server, or you by hand</td></tr>
<tr><td>Changes when</td><td>normally never — unless the OS randomises it</td><td>every time you join, move, or a lease expires — normal</td></tr>
<tr><td>Everyday picture</td><td>the <strong>chassis number of a motorbike</strong>: stamped on the bike, follows it everywhere</td><td>the <strong>address of the room you rent</strong>: changes when you move</td></tr>
<tr><td>What the school checks</td><td>"is this device registered?"</td><td>nothing — it changes too often to identify you</td></tr>
</table></div>
<p>So "my IP changed" is normal and harmless. "My MAC changed" is the thing that breaks a registration-by-MAC network.</p>

<h3>Look at your own Mac first</h3>
<p>Here is the MacBook used to write this lesson, on a home Wi-Fi (the last three bytes of every real MAC are masked):</p>
${R('c141-mac', 'ifconfig en0', 2)}
<p>Two different answers. <code>networksetup</code> prints the <strong>hardware</strong> address burned into the Wi-Fi chip (<code>f4:d4:88…</code>). <code>ifconfig</code> prints the address the card is <strong>actually using on this network</strong> right now (<code>26:df:5a…</code>). The network never sees the hardware address. Proof — the DHCP packet the Mac kept from the router shows which address the router saw (<code>chaddr</code> = client hardware address):</p>
${R('c141-mac', 'ipconfig getifaddr', 2)}
<p>The router knows this Mac as <code>26:df:5a…</code>. If this were a school network, <em>that</em> is the address that would be registered — and it is not the one written on the box.</p>
<div class="pitfall co-tieu-de"><p><strong>"Python says my MAC is 02:00:00:00:00:00."</strong> True on recent macOS: a program without the right privacy permission (here a Python script running <code>ifconfig</code>) gets a fake all-zero address with only the "local" bit set, while Terminal sees the real one. The lab scripts for this lesson therefore run through <code>bash</code>, not Python. If a tool shows <code>02:00:00:00:00:00</code>, do not register that.</p></div>

<h3>Reading a MAC: who made it, and is it random?</h3>
<p>The first three bytes are the <strong>OUI</strong> (Organizationally Unique Identifier) — a block IEEE sells to manufacturers. The registry is public; we downloaded it and looked up our addresses:</p>
${R('c141-oui', 'curl -sL', 4)}
<p><code>F4D488</code> is Apple and <code>5CA6E6</code> (the home router) is TP-Link. <code>26DF5A</code> is registered to <strong>nobody</strong> — because it was not made in a factory. Two bits of the first byte tell you this without any registry:</p>
<ul>
<li><strong>bit 0</strong> (lowest) — 1 = group/multicast address, 0 = one device.</li>
<li><strong>bit 1</strong> — 1 = <strong>locally administered</strong>: chosen by software (random/private MAC, Docker, VMs). 0 = universal, from the factory.</li>
</ul>
<p><code>0x26</code> = <code>0010 0110</code>: bit 1 is 1 ⇒ software-made. A quick rule you can do in your head: <strong>if the second hex character of the MAC is 2, 6, A or E, the address is a private/random one</strong> (those are exactly the values with bit 1 = 1 and bit 0 = 0). <code>f4</code> → second character 4 ⇒ factory address. <code>26</code> → 6 ⇒ private.</p>

<h3>How your laptop gets an IP: DHCP in four packets</h3>
<p>When you join a Wi-Fi network your laptop has no IP yet. It asks the network's <strong>DHCP</strong> server (Dynamic Host Configuration Protocol) — like arriving at a dorm and asking the front desk for a room. Four messages, nicknamed <strong>DORA</strong>:</p>
<ol><li><strong>Discover</strong> — "anyone giving out addresses?" (broadcast, from 0.0.0.0, carrying your MAC)</li>
<li><strong>Offer</strong> — "you can have 10.20.1.177"</li>
<li><strong>Request</strong> — "yes, I take 10.20.1.177"</li>
<li><strong>Ack</strong> — "it's yours for 7200 s, gateway and DNS are 10.20.1.1"</li></ol>
<p>We built a small school network in Docker to measure all of this: two SSIDs (TRUONG-DANGKY with no Internet, TRUONG-SV with Internet), a controller <code>gw</code> that does DHCP, DNS, the login page and the firewall, and laptops whose Wi-Fi card has one MAC <em>per SSID</em> — exactly what macOS does. The MacBook joins the registration SSID:</p>
${R('c141-dk', 'cat /run/mac-phan-cung', 2)}
${R('c141-dk', 'bash /lab/k/moi-truong/truong/vao-ssid.sh dk', 2)}
<p>On the controller we captured the four packets (sender MAC, destination, message) and the lease file. Notice who sends what: the laptop broadcasts to 255.255.255.255 because it has no address yet; the controller answers to the address it is offering:</p>
${R('c141-dora', 'tshark', 2)}
<p>The lease is stored <strong>against the MAC</strong> (<code>26:3a:91:c4:5e:10</code>, client ID <code>01:</code> + MAC). Your IP is borrowed; when the lease ends, or you rejoin later, you may get a different one. That is why nothing at the school identifies you by IP. Your home Mac above shows the same thing in real life: <code>lease_time 0x1c20</code> = 7200 s = 2 hours.</p>
${cauNoi('en', { ...NWC, bai: 'nwc204-14-2-web-email-dns-dhcp-chia-se-tep', so: '14.2', ten: 'Web, email, DNS, DHCP and file sharing protocols', giong: 'the DORA exchange and the lease (NWC204 also reads lease_time 0x1c20 = 7200 s)', khac: 'NWC204 presents DHCP as one application protocol among others', them: 'DORA captured on a school-style controller, the lease keyed by MAC, and why that makes MAC — not IP — the thing a campus network registers' })}

<h3>The login page: why it pops up by itself</h3>
<p>Right after joining, your OS asks a question: "do I really have Internet?" It fetches a tiny page over plain HTTP whose content it already knows. At home, measured on the Mac:</p>
${R('c141-mac', 'curl -s http://captive.apple.com', 3)}
<p>Apple expects <code>Success</code>; Windows' NCSI expects <code>Microsoft Connect Test</code> (Microsoft's documentation: the answer "didn't match the expected content" ⇒ captive portal). On a network with a login page, the controller <strong>intercepts</strong> that HTTP request and answers itself — usually a redirect. In our school lab:</p>
${R('c141-dk', 'curl -sI', 1)}
<p>Not <code>Success</code> ⇒ the OS knows it is "captive" and opens the little login window for you. Modern networks can also announce this up front: RFC 8910 adds DHCP option 114 with the URL of an API (RFC 8908) that answers in JSON:</p>
${R('c141-dk', 'curl -s http://10.20.1.1/api', 1)}
<p>Why only HTTP? Because HTTPS cannot be redirected silently. TLS proves the server owns the name (lesson 6.3). The controller does not have a certificate for <code>captive.apple.com</code>, so if it intercepts HTTPS, your browser sees the wrong certificate:</p>
${R('c141-dk', 'curl -sS --cacert', 1, { max: 2 })}
<p>That is the "Your connection is not private" page you sometimes get on hotel or school Wi-Fi when you open an HTTPS site before logging in. It is the system working, not an attack — but see the hacker corner below for when it is. Tip: to trigger the login page by hand, open any <strong>http://</strong> address (for example <code>http://captive.apple.com</code>).</p>
${net('wifi', 'register', 'en', 'Join the registration SSID, watch DORA, the probe being redirected, and the controller writing account ↔ MAC.', { tour: 'wifi-register' })}

<h3>What the controller writes when you log in</h3>
${R('c141-dk', 'curl -s -d', 1)}
${R('c141-dora', 'cat /run/truong/dang-ky.tsv', 2)}
<p>The system cannot see "your laptop". It sees the <strong>source MAC of the frame</strong> that carried your login, and writes <em>account ↔ MAC</em>. Then it opens the firewall for <strong>that MAC</strong> on the Internet SSID. Everything else — your name, password, IP — is gone after this moment. Like a dorm guard who writes down your bike's chassis number: tomorrow he lets that number in, not you.</p>

<h3>Reproducing the bug: the MAC on the second SSID is different</h3>
<p>With "Private Wi-Fi address: Fixed" (the macOS default on WPA2/WPA3 networks), the Mac uses <strong>one private address per network</strong>. The Internet SSID therefore sees another MAC:</p>
${R('c141-sv', 'bash /lab/k/moi-truong/truong/vao-ssid.sh sv', 4)}
<p>The laptop got an IP (DHCP does not care), but the controller blocks it: <code>9a:7f:02:b8:41:6d</code> was never registered — <code>26:3a:91:c4:5e:10</code> was. HTTP is sent to the "device not registered" page, HTTPS just times out. From the student's chair this looks like "Wi-Fi connected, no Internet", and nothing on screen says why.</p>
${net('wifi', 'private', 'en', 'Flip "Private Wi-Fi address" between Off, Fixed and Rotating on each laptop and see which MAC each SSID sees.', { tour: 'wifi-private' })}
<p>The two systems behave like this (from Apple's and Microsoft's documentation; we cannot run Windows on the Mac used here):</p>
<div class="table-wrap"><table>
<tr><th>Setting</th><th>MAC used</th><th>On a school network</th></tr>
<tr><td>macOS/iOS <strong>Off</strong> · Windows <strong>Off</strong></td><td>the hardware address</td><td>✅ register once, works on every SSID</td></tr>
<tr><td>macOS/iOS <strong>Fixed</strong> · Windows <strong>On</strong></td><td>one private address <em>per network</em>, stays the same for that network</td><td>❌ registration SSID and Internet SSID see different MACs</td></tr>
<tr><td>macOS/iOS <strong>Rotating</strong> · Windows <strong>Change daily</strong></td><td>a new private address every 2 weeks (Apple) / every day (Windows)</td><td>❌ works, then stops one day "for no reason"</td></tr>
</table></div>
<p>Apple also notes: when you <strong>forget</strong> a network (macOS 15 / iOS 18 and later) the device forgets that network's private address too, unless it has been less than 24 hours — so "forget and rejoin" can silently give you a new MAC and undo your registration.</p>

<h3>The fix that works the first time</h3>
<ol>
<li>Turn the private address <strong>Off for BOTH school SSIDs</strong> — the registration one and the Internet one. macOS: System Settings → Wi-Fi → Details… next to the network → Private Wi-Fi Address → Off. Windows 11: Settings → Network &amp; internet → Wi-Fi → Manage known networks → the network → Random hardware addresses → Off.</li>
<li>Check: <code>ifconfig en0 | grep ether</code> must now equal <code>networksetup -getmacaddress Wi-Fi</code> (Windows: <code>getmac /v</code> or <code>ipconfig /all</code>, "Physical Address").</li>
<li>Rejoin the registration SSID, log in <strong>once</strong>, then join the Internet SSID.</li>
</ol>
${R('c141-tat', 'for c in dk sv', 2)}
${R('c141-tat', 'curl -s -d', 4, { drop: /^# |^udhcpc/ })}
<p>Same MAC on both cards ⇒ the registration replaces the old private one and HTTP and HTTPS both work.</p>

<h3>One account, one device: why the other laptop gets kicked</h3>
<p>Now the Windows laptop logs in with the <strong>same</strong> account:</p>
${R('c141-win', 'curl -s -d', 1)}
${R('c141-mat', 'curl -sL', 1)}
${R('c141-gw-sau', 'cat /run/truong/dang-ky.tsv', 2)}
<p>The controller keeps one MAC per account and replaced the Mac's. That is the exact "Mac works ⇒ Windows blocked, and the other way round" from the story. It is a rule of the network, not a bug in your laptop. The honest fixes: ask the school IT office whether a second device can be registered (many campuses allow 2–3 devices per student), use a network that authenticates the person rather than the device (802.1X, below), or accept one laptop at a time.</p>

<h3>"Why not give both laptops the same MAC?" — what really happens</h3>
<p>Some people try it. Besides possibly breaking the school's rules, it does not work well, and we can measure why. A third machine copies the Windows laptop's MAC and joins — without logging in at all:</p>
${R('c141-trung-ke', 'ip link set sv down', 3, { drop: /^# |^udhcpc: broadcasting/ })}
<p>It gets the <strong>same IP</strong> (the DHCP lease is keyed by MAC) and walks through the login page — which already tells you how weak "registration by MAC" is as security. Now both download at the same time:</p>
${R('c141-trung-win', 'curl -sS -o /dev/null', 1)}
${R('c141-trung-tai-ke', 'curl -sS -o /dev/null', 1)}
<p>Both downloads die with <code>Connection reset by peer</code>. Why: the Wi-Fi access point/switch keeps a table "MAC → port" (lesson 1.4) and updates it from every frame it receives. Two cards with one MAC make it change its mind back and forth. We watched the switch of the lab do it:</p>
${R('c141-trung-fdb', 'timeout 5 bridge monitor fdb', 3)}
<p>Each flip sends the next packets to the wrong laptop. That laptop has no such TCP connection, so its kernel answers with a TCP RST — and kills the other one's download. Both IPs are the same too, so ARP cannot help. The result is two half-working laptops.</p>
<div class="pitfall co-tieu-de"><p><strong>"But ping says 0% loss."</strong> It did, during the same test:</p>${R('c141-trung-win', 'ping -q', 1)}<p>Each echo reply comes back within a fraction of a millisecond, right after the request taught the switch where to send it — so ping wins the race. Real traffic (a download, a video call, a git push) does not. Never conclude "the network is fine" from ping alone.</p></div>
${net('wifi', 'clone', 'en', 'Two laptops, one MAC: watch the switch table flip and the TCP resets.', { tour: 'wifi-clone' })}

<h3>🕵️ The attacker's corner: what bad people do on shared Wi-Fi</h3>
<p><strong>1 — Copy a MAC to ride someone's login.</strong> You just saw it: a registered MAC is all the controller checks. An attacker who sniffs MACs in the air (Wi-Fi frames carry them in clear) can borrow a logged-in classmate's session. Defence: networks that authenticate the person with keys (802.1X), not the MAC.</p>
<p><strong>2 — The evil twin and the fake login page.</strong> Anyone can create a hotspot named exactly like the school's SSID. Your laptop may join it; the fake "login page" asks for your student or email password. Signs: the page is on <code>http://</code> or on a domain that is not the school's; it asks for your <em>email</em> password; it appears on a network you joined "automatically" in a café. Defence: type your password only on the school's real domain over HTTPS, use 802.1X networks that check the server's certificate, turn off auto-join for open networks.</p>
<p><strong>3 — ARP spoofing: becoming the gateway.</strong> On the same Wi-Fi, a machine can tell yours "the gateway 10.20.2.1 is at <em>my</em> MAC". We did it in the lab: the attacker is an ordinary logged-in student; the victim is the Windows laptop.</p>
${R('c141-arp-truoc', 'ip neigh show dev sv', 1)}
${R('c141-arp-nan', 'ip neigh show dev sv', 3)}
<p>The victim still has Internet — the attacker forwards everything — but now the gateway and the attacker have the <strong>same MAC</strong> in its table. Here is what the attacker read:</p>
${R('c141-arp-doc', 'tshark -r /tmp/nghe.pcap -Y "http.request"', 2)}
<p>Over HTTP the form fields are in clear: <code>user=SE12345</code>, <code>pass=matkhau123</code>. Over HTTPS, only the site name from the TLS ClientHello (SNI, lesson 14.2) — the password stayed encrypted. Defences: HTTPS everywhere (and never click through a certificate warning), a VPN on untrusted Wi-Fi (lesson 14.4), and noticing two IPs with one MAC in <code>arp -a</code>. Networks defend with "client isolation" on the access point and Dynamic ARP Inspection on switches. ⚠️ Do this only on a lab of your own: on a real network it is an attack.</p>
${cauNoi('en', { ...NWC, bai: 'nwc204-15-1-moi-de-doa-va-cac-kieu-tan-cong', so: '15.1', ten: 'Threats and types of attack', giong: 'spoofing, man-in-the-middle, reconnaissance', khac: 'NWC204 classifies attacks and mitigations in general', them: 'a live ARP spoofing on a campus-style Wi-Fi: the victim keeps working while the attacker reads an HTTP password but only the site name over HTTPS' })}

<h3>The modern way: log in at the Wi-Fi layer (802.1X / WPA2-Enterprise)</h3>
<p>Many universities use <strong>WPA2/WPA3-Enterprise</strong> (eduroam is the best-known example): you type your account <em>when joining the SSID</em>, the access point passes it to a RADIUS server, and each device gets its own encryption keys. The network knows the <strong>person</strong>, not a MAC, so private addresses are no problem and copying a MAC gets you nothing. The one rule: when your device asks to trust the network's certificate, check it belongs to the school — accepting any certificate is how evil twins steal these passwords.</p>

<h3>"What if…" — five situations you will meet</h3>
<ul>
<li><strong>…it worked yesterday and not today?</strong> Rotating/Change daily is on, or you "forgot" the network. Compare <code>ifconfig en0 | grep ether</code> with what you registered.</li>
<li><strong>…your IP is 169.254.x.x?</strong> DHCP failed — the OS gave itself a link-local address (lesson 2.1). Problem is before the portal: signal, or the DHCP pool is full.</li>
<li><strong>…the login page never appears?</strong> Open <code>http://captive.apple.com</code> by hand (HTTP, not HTTPS). A VPN or a custom DNS that starts before login can also hide it.</li>
<li><strong>…a phone shares the laptop's connection?</strong> The network sees one MAC but other clues — lesson 14.2.</li>
<li><strong>…the school also blocks certain sites or games?</strong> That is a different mechanism (DNS, SNI, ports) — lesson 14.2.</li>
</ul>

<h3>Troubleshooting "no Internet on school Wi-Fi", layer by layer</h3>
<div class="table-wrap"><table>
<tr><th>#</th><th>Check</th><th>macOS</th><th>Windows (per Microsoft docs)</th><th>Healthy</th></tr>
<tr><td>1</td><td>Which MAC is the card using?</td><td><code>ifconfig en0 | grep ether</code></td><td><code>getmac /v</code> · <code>ipconfig /all</code></td><td>equals the one you registered</td></tr>
<tr><td>2</td><td>Private address off for this SSID?</td><td>second hex char ∉ {2,6,A,E}</td><td>Random hardware addresses = Off</td><td>factory MAC</td></tr>
<tr><td>3</td><td>Got an IP?</td><td><code>ipconfig getifaddr en0</code></td><td><code>ipconfig</code></td><td>not empty, not 169.254.x.x</td></tr>
<tr><td>4</td><td>Gateway reachable?</td><td><code>arp -a</code>, <code>ping</code> the router</td><td><code>arp -a</code></td><td>one MAC per IP</td></tr>
<tr><td>5</td><td>Captive portal?</td><td><code>curl -sI http://captive.apple.com</code></td><td>open http://www.msftconnecttest.com/connecttest.txt</td><td>200 + Success / Microsoft Connect Test</td></tr>
<tr><td>6</td><td>DNS and HTTPS?</td><td><code>dig</code>, <code>curl -I https://…</code></td><td><code>nslookup</code>, browser</td><td>answer + valid certificate</td></tr>
</table></div>

<h3>Where this lives in the computer</h3>
<ul>
<li>The <strong>hardware MAC</strong> is stored in the Wi-Fi chip; the OS driver can put a <strong>different</strong> one in the outgoing frames — that is all a private address is. The per-network private addresses are a small table in the OS settings.</li>
<li>The <strong>DHCP lease</strong> lives in RAM/disk of the controller (keyed by MAC) and of your laptop.</li>
<li>The <strong>"account ↔ MAC" list</strong> and the allow rules live in the controller's RAM; the <strong>switch table</strong> in the access point/switch.</li>
</ul>

<h3>🧪 Practice — on your own laptops (20 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> you want both your laptops ready for the school Wi-Fi before the semester starts, without the "registered but blocked" trap.</p>
<ol>
<li>On each laptop, write down the <strong>hardware</strong> MAC and the MAC <strong>in use</strong> (Mac: <code>networksetup -getmacaddress Wi-Fi</code> and <code>ifconfig en0 | grep ether</code>; Windows: <code>getmac /v</code>).</li>
<li>Apply the 2/6/A/E rule to each. Which are private?</li>
<li>Open the Wi-Fi details of the networks you use (home, school). Note the private-address setting of each.</li>
<li>Run the captive-portal probe at home (<code>curl -s http://captive.apple.com</code>). Predict what it would print before logging in at school.</li>
<li>In the lab (<code>bash lab/code/dung-output-ch14.sh</code> with <code>GIU_LAB=1</code>), make the Windows laptop log in with SE67890 instead: do both laptops now work?</li>
</ol>
<p><strong>Done when:</strong> you can say which MAC the school will see from each laptop, you have set the private address Off for both school SSIDs, and you can explain why two accounts work where one did not.</p>
<details><summary>Solution</summary><p>The school sees the MAC <em>in use</em>, not the hardware one. If they differ, the private address is on. With Off on both SSIDs, the in-use MAC equals the hardware MAC on every network, so one registration covers both SSIDs. The probe prints <code>Success</code> at home and a redirect (302) before logging in at school. With two different accounts the controller keeps two lines in its list, one MAC each, so both laptops are allowed — which is exactly what asking IT for a second device registration gives you.</p></details>
</div>

<details><summary>🧠 Self-check (5 questions)</summary>
<ol>
<li>Your MAC is <code>9a:7f:02:b8:41:6d</code>. Factory or private? — <em>Private: second character A.</em></li>
<li>You registered at 8:00, everything worked; at 10:00 you have "no Internet" and your IP is different. Is the new IP the cause? — <em>No; IPs change normally. Check whether the MAC changed (Rotating/Change daily, forgot network).</em></li>
<li>Why does the login page only pop up for HTTP probes? — <em>HTTPS cannot be intercepted without a certificate warning; the OS probes a known HTTP page and compares the content.</em></li>
<li>Two laptops share one MAC and both are online. Ping is fine but downloads break. Why? — <em>The switch table flips between the two ports; packets of one TCP connection reach the other laptop, which replies RST.</em></li>
<li>Why is a copied MAC useless on an 802.1X network? — <em>The network authenticates the person with per-device keys, not the MAC.</em></li>
</ol></details>

<h3>🗂 Key terms</h3>
${kv([
    ['MAC address (địa chỉ MAC)', '6-byte address of a network card, used on one link; what campus Wi-Fi registers.'],
    ['OUI', 'First 3 bytes of a factory MAC: the manufacturer, from the public IEEE registry.'],
    ['locally administered bit (bit tự quản)', 'Bit 1 of the first byte: 1 = MAC chosen by software (private/random).'],
    ['private Wi-Fi address / random hardware address (địa chỉ Wi-Fi riêng)', 'A software MAC per network (Fixed/On) or changing over time (Rotating/Change daily).'],
    ['DHCP / DORA / lease', 'How a device borrows an IP: Discover, Offer, Request, Ack; the loan is kept against the MAC.'],
    ['captive portal (trang đăng nhập bắt buộc)', 'A network that intercepts HTTP until you log in; detected by OS probes.'],
    ['802.1X / WPA2-Enterprise', 'Logging in at the Wi-Fi layer with a personal account; no MAC registration needed.'],
    ['ARP spoofing (ARP giả mạo)', 'Telling a victim that the gateway IP is at the attacker\'s MAC to sit in the middle.'],
  ])}

<h3>📌 Summary</h3>
<ul>
<li>IP = room address (changes, normal); MAC = chassis number (what the school registers).</li>
<li>The network sees the MAC <em>in use</em> (<code>ifconfig en0</code>), not the hardware one (<code>networksetup</code>); 2/6/A/E in the second character = private.</li>
<li>Private Wi-Fi address gives each SSID a different MAC ⇒ register on one SSID, blocked on the other. Turn it Off for both school SSIDs, register once.</li>
<li>One account = one MAC: the second laptop replaces the first. Ask IT for a second registration; two machines on one MAC break each other's TCP.</li>
<li>Registration by MAC is weak security: MAC copying, evil twins and ARP spoofing exist — HTTPS, VPN and 802.1X are the defences.</li>
</ul>
<p>Related lessons: <a href="${bai('netdev-1-3-ethernet-arp')}">1.4 Ethernet, MAC and ARP</a> · <a href="${bai('netdev-2-1-ipv4-cidr')}">2.1 IPv4 (169.254 = DHCP failed)</a> · <a href="${bai('netdev-6-3-chung-chi')}">6.3 Certificates</a> · <a href="${bai('netdev-14-2-mang-truong-chan')}">14.2 What the school network blocks</a>.</p>
${L('https://support.apple.com/en-us/102509', '📄', 'Apple — Use private Wi-Fi addresses on Apple devices', 'Off / Fixed / Rotating, defaults, forgetting a network.', 'Open')}
${L('https://support.microsoft.com/windows/060ad2e9-526e-4f1c-9f3d-fe6a842640ed', '📄', 'Microsoft — Connect to a Wi-Fi network in Windows', 'Random hardware addresses: all networks or one network.', 'Open')}
${L('https://pureinfotech.com/enable-random-hardware-addresses-windows-11/', '📄', 'Pureinfotech — Random hardware addresses on Windows 11', 'The per-network On / Change daily / Off choices, step by step.', 'Open')}
${L('https://learn.microsoft.com/en-us/windows-server/networking/ncsi/ncsi-overview', '📄', 'Microsoft Learn — NCSI overview', 'How Windows detects a captive portal ("Microsoft Connect Test").', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc8910', '📄', 'RFC 8910 — Captive-Portal Identification in DHCP and RA', 'DHCP option 114: the network announces its login API.', 'Open')}
${L('https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/getmac', '📄', 'Microsoft Learn — getmac', 'List MAC addresses of every network card on Windows.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.1</span>
<h2>Wi-Fi trường thực chiến: trang đăng nhập, đăng ký thiết bị theo MAC, và "địa chỉ Wi-Fi riêng" làm MAC đổi</h2>
<div class="callout"><p><strong>🎯 Chương 14 trong một khung — mạng ở chính nơi bạn sống.</strong> Chương 1–13 đi theo một request từ mã của bạn tới máy chủ. Chương này là mạng bạn vật lộn hằng ngày: Wi-Fi trường bắt đăng nhập, mạng chặn trang web, chặn game hay chặn SSH, điện thoại xài ké mạng của laptop, VPN và đường hầm, router ở nhà hay ở ký túc xá. Học xong bạn (1) giải thích được vì sao laptop "có Wi-Fi mà không có Internet" và sửa trong vài phút; (2) nhìn thông báo lỗi là biết mình đang bị chặn kiểu gì; (3) vẫn làm việc được — git, SSH, Docker, deploy — trong một mạng bị hạn chế; (4) nhận ra các mánh kẻ xấu dùng với bạn trên Wi-Fi dùng chung. Mọi bài đều đo trên một phòng lab bạn tự chạy: <strong>"Wi-Fi trường trong một hộp"</strong>.</p></div>
<p class="lead">Một chuyện có thật. Một bạn sinh viên có một MacBook và một laptop Windows. Muốn dùng mạng trường, trước hết phải vào một SSID (tên mạng Wi-Fi) <em>không có</em> Internet, đăng nhập tài khoản sinh viên, rồi chuyển sang SSID <em>có</em> Internet — và chỉ máy nào đã đăng nhập mới qua được. Một tài khoản, một thiết bị: Mac dùng được thì Windows bị chặn, và ngược lại. Tệ hơn, đăng ký xong cho Mac mà Mac vẫn bị chặn, và "địa chỉ MAC" có vẻ đổi liên tục. Mất hàng giờ chỉnh cài đặt theo cảm tính. Bài này tìm ra thủ phạm, đo nó, và đưa cách sửa đúng ngay lần đầu.</p>

<h3>Hai địa chỉ, hai nhiệm vụ: MAC và IP</h3>
<p>Nhiều người nói "IP của Mac" khi ý là địa chỉ MAC. Đó là hai thứ khác nhau, làm hai việc khác nhau (bài 1.4 đã giới thiệu cả hai):</p>
<div class="table-wrap"><table>
<tr><th></th><th>Địa chỉ MAC</th><th>Địa chỉ IP</th></tr>
<tr><td>Trông như</td><td><code>a4:83:e7:5c:21:0b</code> (6 byte, hex)</td><td><code>10.20.2.114</code> (4 byte, thập phân)</td></tr>
<tr><td>Tầng</td><td>2 — một đường truyền (một mạng Wi-Fi, một switch)</td><td>3 — xuyên qua các mạng, từ đầu tới cuối</td></tr>
<tr><td>Ai đặt</td><td>nhà máy làm card, hoặc hệ điều hành (địa chỉ riêng/ngẫu nhiên)</td><td>mạng: máy chủ DHCP, hoặc bạn gõ tay</td></tr>
<tr><td>Đổi khi nào</td><td>bình thường không bao giờ — trừ khi hệ điều hành cố ý đổi ngẫu nhiên</td><td>mỗi lần vào mạng, chuyển chỗ, hay hết hạn thuê — bình thường</td></tr>
<tr><td>Hình đời thường</td><td><strong>số khung xe máy</strong>: đóng trên xe, đi đâu theo đó</td><td><strong>địa chỉ phòng trọ</strong>: chuyển nhà là đổi</td></tr>
<tr><td>Trường kiểm cái gì</td><td>"thiết bị này đã đăng ký chưa?"</td><td>không — nó đổi quá thường để nhận ra bạn</td></tr>
</table></div>
<p>Vậy "IP của mình đổi" là chuyện bình thường, vô hại. "MAC của mình đổi" mới là thứ làm hỏng một mạng đăng ký theo MAC.</p>

<h3>Nhìn chính máy Mac của bạn trước</h3>
<p>Đây là chiếc MacBook dùng để soạn bài này, đang ở Wi-Fi nhà (3 byte cuối của mọi MAC thật đã được che):</p>
${R('c141-mac', 'ifconfig en0', 2)}
<p>Hai câu trả lời khác nhau. <code>networksetup</code> in địa chỉ <strong>phần cứng</strong> khắc trong chip Wi-Fi (<code>f4:d4:88…</code>). <code>ifconfig</code> in địa chỉ card <strong>đang thật sự dùng trên mạng này</strong> lúc này (<code>26:df:5a…</code>). Mạng không bao giờ thấy địa chỉ phần cứng. Bằng chứng — gói DHCP mà Mac giữ lại từ router cho biết router đã thấy địa chỉ nào (<code>chaddr</code> = client hardware address, địa chỉ phần cứng của máy khách theo cách DHCP gọi):</p>
${R('c141-mac', 'ipconfig getifaddr', 2)}
<p>Router biết chiếc Mac này là <code>26:df:5a…</code>. Nếu đây là mạng trường, <em>đó</em> mới là địa chỉ được đăng ký — chứ không phải địa chỉ in trên hộp máy.</p>
<div class="pitfall co-tieu-de"><p><strong>"Python bảo MAC của mình là 02:00:00:00:00:00."</strong> Đúng vậy trên macOS mới: một chương trình chưa có quyền riêng tư phù hợp (ở đây là script Python gọi <code>ifconfig</code>) nhận một địa chỉ giả toàn số 0, chỉ bật bit "tự quản", trong khi Terminal thấy địa chỉ thật. Vì thế các script lab của bài này chạy qua <code>bash</code>, không qua Python. Công cụ nào hiện <code>02:00:00:00:00:00</code> thì đừng đem địa chỉ đó đi đăng ký.</p></div>

<h3>Đọc một địa chỉ MAC: ai làm ra, và có phải ngẫu nhiên?</h3>
<p>Ba byte đầu là <strong>OUI</strong> (Organizationally Unique Identifier — mã định danh tổ chức) — khối số IEEE bán cho nhà sản xuất. Sổ đăng ký là công khai; ta tải về và tra các địa chỉ của mình:</p>
${R('c141-oui', 'curl -sL', 4)}
<p><code>F4D488</code> là Apple và <code>5CA6E6</code> (router nhà) là TP-Link. <code>26DF5A</code> <strong>không thuộc về ai</strong> — vì nó không được làm ra ở nhà máy nào. Hai bit của byte đầu cho bạn biết điều này mà không cần tra sổ:</p>
<ul>
<li><strong>bit 0</strong> (thấp nhất) — 1 = địa chỉ nhóm/multicast, 0 = một thiết bị.</li>
<li><strong>bit 1</strong> — 1 = <strong>tự quản (locally administered)</strong>: do phần mềm chọn (MAC riêng/ngẫu nhiên, Docker, máy ảo). 0 = toàn cục, từ nhà máy.</li>
</ul>
<p><code>0x26</code> = <code>0010 0110</code>: bit 1 bằng 1 ⇒ do phần mềm làm. Mẹo nhẩm trong đầu: <strong>ký tự hex thứ hai của MAC là 2, 6, A hoặc E thì đó là địa chỉ riêng/ngẫu nhiên</strong> (đúng là các giá trị có bit 1 = 1 và bit 0 = 0). <code>f4</code> → ký tự thứ hai là 4 ⇒ địa chỉ nhà máy. <code>26</code> → 6 ⇒ địa chỉ riêng.</p>

<h3>Laptop lấy IP thế nào: DHCP trong bốn gói</h3>
<p>Khi vừa vào một mạng Wi-Fi, laptop chưa có IP. Nó hỏi máy chủ <strong>DHCP</strong> của mạng (Dynamic Host Configuration Protocol — giao thức cấu hình máy động) — như mới tới ký túc xá thì hỏi lễ tân xin phòng. Bốn tin nhắn, gọi tắt là <strong>DORA</strong>:</p>
<ol><li><strong>Discover</strong> — "có ai đang phát địa chỉ không?" (gửi cho tất cả, từ 0.0.0.0, mang MAC của bạn)</li>
<li><strong>Offer</strong> — "bạn lấy 10.20.1.177 nhé"</li>
<li><strong>Request</strong> — "ừ, tôi lấy 10.20.1.177"</li>
<li><strong>Ack</strong> — "của bạn trong 7200 giây, cổng ra (gateway) và DNS là 10.20.1.1"</li></ol>
<p>Để đo tất cả những điều này, ta dựng một mạng trường nhỏ bằng Docker: hai SSID (TRUONG-DANGKY không có Internet, TRUONG-SV có Internet), một bộ điều khiển <code>gw</code> lo DHCP, DNS, trang đăng nhập và tường lửa, và các laptop mà card Wi-Fi mang một MAC <em>riêng cho mỗi SSID</em> — đúng như macOS làm. MacBook vào SSID đăng ký:</p>
${R('c141-dk', 'cat /run/mac-phan-cung', 2)}
${R('c141-dk', 'bash /lab/k/moi-truong/truong/vao-ssid.sh dk', 2)}
<p>Trên bộ điều khiển ta bắt được bốn gói (MAC người gửi, đích, loại tin) và tệp lease (hợp đồng cho thuê địa chỉ). Để ý ai gửi gì: laptop gửi cho 255.255.255.255 (tất cả) vì nó chưa có địa chỉ; bộ điều khiển trả lời tới đúng địa chỉ nó đang mời:</p>
${R('c141-dora', 'tshark', 2)}
<p>Lease được ghi <strong>theo MAC</strong> (<code>26:3a:91:c4:5e:10</code>, client ID là <code>01:</code> + MAC). IP của bạn chỉ là đi mượn; hết hạn, hoặc lần sau vào lại, có thể được số khác. Vì thế ở trường không có gì nhận ra bạn bằng IP. Chiếc Mac ở nhà phía trên cho thấy y như vậy ngoài đời: <code>lease_time 0x1c20</code> = 7200 giây = 2 giờ.</p>
${cauNoi('vi', { ...NWC, bai: 'nwc204-14-2-web-email-dns-dhcp-chia-se-tep', so: '14.2', ten: 'Web, email, DNS, DHCP và giao thức chia sẻ tệp', giong: 'cuộc trao đổi DORA và lease (NWC204 cũng đọc lease_time 0x1c20 = 7200 giây)', khac: 'NWC204 trình bày DHCP như một giao thức ứng dụng trong nhiều giao thức', them: 'DORA bắt trên một bộ điều khiển kiểu mạng trường, lease ghi theo MAC, và vì sao vì thế mà mạng trường đăng ký MAC chứ không phải IP' })}

<h3>Trang đăng nhập: vì sao nó tự bật lên</h3>
<p>Ngay sau khi vào mạng, hệ điều hành tự hỏi: "mình có Internet thật không?" Nó tải một trang nhỏ xíu qua HTTP thường, nội dung nó biết trước. Ở nhà, đo trên Mac:</p>
${R('c141-mac', 'curl -s http://captive.apple.com', 3)}
<p>Apple chờ chữ <code>Success</code>; NCSI của Windows chờ <code>Microsoft Connect Test</code> (tài liệu Microsoft: câu trả lời "không khớp nội dung mong đợi" ⇒ có trang đăng nhập). Ở mạng có trang đăng nhập, bộ điều khiển <strong>chặn giữa đường</strong> request HTTP đó và tự trả lời — thường là một lệnh chuyển hướng. Trong lab mạng trường:</p>
${R('c141-dk', 'curl -sI', 1)}
<p>Không phải <code>Success</code> ⇒ hệ điều hành biết mình đang "bị giữ" (captive) và tự mở cửa sổ đăng nhập nhỏ cho bạn. Mạng hiện đại còn báo trước điều này: RFC 8910 thêm tuỳ chọn DHCP số 114 chứa URL của một API (RFC 8908) trả lời bằng JSON:</p>
${R('c141-dk', 'curl -s http://10.20.1.1/api', 1)}
<p>Vì sao chỉ HTTP? Vì HTTPS không thể bị chuyển hướng lặng lẽ. TLS chứng minh máy chủ sở hữu cái tên (bài 6.3). Bộ điều khiển không có chứng chỉ cho <code>captive.apple.com</code>, nên nếu nó chặn HTTPS, trình duyệt của bạn thấy chứng chỉ sai tên:</p>
${R('c141-dk', 'curl -sS --cacert', 1, { max: 2 })}
<p>Đó chính là trang "Kết nối của bạn không riêng tư" thỉnh thoảng gặp ở Wi-Fi khách sạn hay trường khi mở một trang HTTPS trước lúc đăng nhập. Đó là hệ thống đang chạy đúng, không phải tấn công — nhưng xem góc kẻ xấu bên dưới để biết khi nào nó là tấn công. Mẹo: muốn gọi trang đăng nhập bằng tay, mở một địa chỉ <strong>http://</strong> bất kỳ (ví dụ <code>http://captive.apple.com</code>).</p>
${net('wifi', 'register', 'vi', 'Vào SSID đăng ký, xem DORA, xem câu hỏi dò bị chuyển hướng, và bộ điều khiển ghi tài khoản ↔ MAC.', { tour: 'wifi-register' })}

<h3>Bộ điều khiển ghi gì khi bạn đăng nhập</h3>
${R('c141-dk', 'curl -s -d', 1)}
${R('c141-dora', 'cat /run/truong/dang-ky.tsv', 2)}
<p>Hệ thống không nhìn thấy "laptop của bạn". Nó thấy <strong>MAC nguồn của frame</strong> chở lời đăng nhập, và ghi <em>tài khoản ↔ MAC</em>. Rồi nó mở tường lửa cho <strong>đúng MAC đó</strong> trên SSID có Internet. Mọi thứ khác — tên, mật khẩu, IP — không còn dùng tới sau lúc này. Như bác bảo vệ ký túc xá ghi số khung chiếc xe của bạn: hôm sau bác cho cái số khung đó vào, chứ không nhìn mặt bạn.</p>

<h3>Tái hiện lỗi: SSID thứ hai thấy một MAC khác</h3>
<p>Với "Địa chỉ Wi-Fi riêng: Cố định" (mặc định của macOS với mạng WPA2/WPA3), Mac dùng <strong>một địa chỉ riêng cho mỗi mạng</strong>. Vì thế SSID có Internet thấy một MAC khác:</p>
${R('c141-sv', 'bash /lab/k/moi-truong/truong/vao-ssid.sh sv', 4)}
<p>Laptop vẫn có IP (DHCP không quan tâm), nhưng bộ điều khiển chặn: <code>9a:7f:02:b8:41:6d</code> chưa từng đăng ký — <code>26:3a:91:c4:5e:10</code> mới là cái đã đăng ký. HTTP bị đưa tới trang "thiết bị chưa đăng ký", HTTPS thì treo tới hết giờ. Ngồi ở ghế sinh viên, nó trông như "Wi-Fi đã kết nối, không có Internet", và trên màn hình không có dòng nào nói lý do.</p>
${net('wifi', 'private', 'vi', 'Gạt "Địa chỉ Wi-Fi riêng" giữa Tắt, Cố định và Luân phiên trên từng laptop, xem mỗi SSID thấy MAC nào.', { tour: 'wifi-private' })}
<p>Hai hệ điều hành làm như sau (theo tài liệu của Apple và Microsoft; máy Mac dùng ở đây không chạy được Windows):</p>
<div class="table-wrap"><table>
<tr><th>Cài đặt</th><th>MAC được dùng</th><th>Ở mạng trường</th></tr>
<tr><td>macOS/iOS <strong>Tắt (Off)</strong> · Windows <strong>Off</strong></td><td>địa chỉ phần cứng</td><td>✅ đăng ký một lần, SSID nào cũng chạy</td></tr>
<tr><td>macOS/iOS <strong>Cố định (Fixed)</strong> · Windows <strong>On</strong></td><td>một địa chỉ riêng <em>cho mỗi mạng</em>, giữ nguyên với mạng đó</td><td>❌ SSID đăng ký và SSID Internet thấy hai MAC khác nhau</td></tr>
<tr><td>macOS/iOS <strong>Luân phiên (Rotating)</strong> · Windows <strong>Change daily</strong></td><td>địa chỉ riêng mới sau mỗi 2 tuần (Apple) / mỗi ngày (Windows)</td><td>❌ đang chạy thì một ngày nọ "tự nhiên" mất</td></tr>
</table></div>
<p>Apple còn ghi: khi bạn <strong>quên mạng</strong> (Forget this network — macOS 15 / iOS 18 trở lên), máy quên luôn địa chỉ riêng của mạng đó, trừ khi chưa quá 24 giờ — nên "quên mạng rồi vào lại" có thể lặng lẽ cho bạn một MAC mới và xoá công đăng ký.</p>

<h3>Cách sửa chạy ngay lần đầu</h3>
<ol>
<li>Tắt địa chỉ riêng cho <strong>CẢ HAI SSID của trường</strong> — SSID đăng ký và SSID Internet. macOS: Cài đặt hệ thống → Wi-Fi → Chi tiết… cạnh tên mạng → Địa chỉ Wi-Fi riêng → Tắt. Windows 11: Settings → Network &amp; internet → Wi-Fi → Manage known networks → chọn mạng → Random hardware addresses → Off.</li>
<li>Kiểm: <code>ifconfig en0 | grep ether</code> giờ phải bằng <code>networksetup -getmacaddress Wi-Fi</code> (Windows: <code>getmac /v</code> hoặc <code>ipconfig /all</code>, dòng "Physical Address").</li>
<li>Vào lại SSID đăng ký, đăng nhập <strong>một lần</strong>, rồi sang SSID Internet.</li>
</ol>
${R('c141-tat', 'for c in dk sv', 2)}
${R('c141-tat', 'curl -s -d', 4, { drop: /^# |^udhcpc/ })}
<p>Cùng một MAC trên cả hai card ⇒ lần đăng ký thay MAC riêng cũ, và cả HTTP lẫn HTTPS đều chạy.</p>

<h3>Một tài khoản, một thiết bị: vì sao laptop kia bị đá ra</h3>
<p>Giờ laptop Windows đăng nhập <strong>cùng</strong> tài khoản:</p>
${R('c141-win', 'curl -s -d', 1)}
${R('c141-mat', 'curl -sL', 1)}
${R('c141-gw-sau', 'cat /run/truong/dang-ky.tsv', 2)}
<p>Bộ điều khiển giữ một MAC cho mỗi tài khoản và đã thay MAC của Mac. Đó đúng là chuyện "Mac dùng được thì Windows bị chặn, và ngược lại" trong câu chuyện. Đó là luật của mạng, không phải lỗi laptop. Cách sửa đàng hoàng: hỏi phòng IT của trường xem có đăng ký thêm được thiết bị thứ hai không (nhiều trường cho mỗi sinh viên 2–3 thiết bị), dùng mạng xác thực theo người chứ không theo thiết bị (802.1X, bên dưới), hoặc chấp nhận dùng mỗi lúc một máy.</p>

<h3>"Sao không cho hai laptop chung một MAC?" — chuyện gì xảy ra thật</h3>
<p>Có người thử. Ngoài việc có thể vi phạm quy định của trường, nó chạy rất tệ, và ta đo được vì sao. Một máy thứ ba chép MAC của laptop Windows rồi vào mạng — không hề đăng nhập:</p>
${R('c141-trung-ke', 'ip link set sv down', 3, { drop: /^# |^udhcpc: broadcasting/ })}
<p>Nó nhận <strong>cùng IP</strong> (lease DHCP ghi theo MAC) và đi thẳng qua trang đăng nhập — điều này đã cho bạn thấy "đăng ký theo MAC" yếu thế nào nếu xem như một lớp bảo mật. Giờ cả hai cùng tải một lúc:</p>
${R('c141-trung-win', 'curl -sS -o /dev/null', 1)}
${R('c141-trung-tai-ke', 'curl -sS -o /dev/null', 1)}
<p>Cả hai lượt tải chết với <code>Connection reset by peer</code>. Vì sao: điểm phát Wi-Fi/switch giữ một bảng "MAC → cổng" (bài 1.4) và cập nhật từ mọi frame nó nhận. Hai card chung một MAC làm nó đổi ý qua lại. Ta nhìn tận mắt switch của lab làm việc đó:</p>
${R('c141-trung-fdb', 'timeout 5 bridge monitor fdb', 3)}
<p>Mỗi lần lật, các gói tiếp theo đi nhầm sang laptop kia. Laptop đó không có kết nối TCP nào như vậy, nên nhân của nó trả lời bằng một gói TCP RST (cắt kết nối) — và giết luôn lượt tải của máy còn lại. Hai IP cũng giống nhau nên ARP không cứu được. Kết quả là hai laptop chạy nửa vời.</p>
<div class="pitfall co-tieu-de"><p><strong>"Nhưng ping báo mất 0%."</strong> Đúng vậy, trong chính phép đo đó:</p>${R('c141-trung-win', 'ping -q', 1)}<p>Mỗi gói trả lời ping quay về trong chưa tới một mili giây, ngay sau khi gói hỏi vừa dạy switch phải gửi về đâu — nên ping luôn thắng cuộc đua. Lưu lượng thật (tải tệp, gọi video, git push) thì không. Đừng bao giờ kết luận "mạng ổn" chỉ vì ping.</p></div>
${net('wifi', 'clone', 'vi', 'Hai laptop, một MAC: xem bảng của switch lật qua lại và các gói TCP RST.', { tour: 'wifi-clone' })}

<h3>🕵️ Góc kẻ xấu: người ta làm gì trên Wi-Fi dùng chung</h3>
<p><strong>1 — Chép MAC để đi ké phiên đăng nhập của người khác.</strong> Bạn vừa thấy: bộ điều khiển chỉ kiểm mỗi MAC đã đăng ký. Kẻ xấu bắt được MAC trong không khí (frame Wi-Fi mang MAC ở dạng rõ) có thể mượn phiên của một bạn cùng lớp đã đăng nhập. Phòng: mạng xác thực con người bằng khoá (802.1X), không phải bằng MAC.</p>
<p><strong>2 — "Song sinh độc ác" (evil twin) và trang đăng nhập giả.</strong> Ai cũng tạo được một điểm phát Wi-Fi đặt tên giống hệt SSID của trường. Laptop có thể tự vào; "trang đăng nhập" giả xin mật khẩu sinh viên hoặc mật khẩu email của bạn. Dấu hiệu: trang ở <code>http://</code> hoặc ở một tên miền không phải của trường; nó xin mật khẩu <em>email</em>; nó hiện ra ở một mạng bạn "tự động" vào trong quán cà phê. Phòng: chỉ gõ mật khẩu trên đúng tên miền của trường qua HTTPS, dùng mạng 802.1X có kiểm chứng chỉ máy chủ, tắt tự kết nối với mạng mở.</p>
<p><strong>3 — ARP giả mạo (ARP spoofing): đóng vai cổng ra.</strong> Trong cùng Wi-Fi, một máy có thể nói với máy bạn "cổng ra 10.20.2.1 nằm ở MAC <em>của tôi</em>". Ta làm điều đó trong lab: kẻ tấn công là một sinh viên bình thường đã đăng nhập; nạn nhân là laptop Windows.</p>
${R('c141-arp-truoc', 'ip neigh show dev sv', 1)}
${R('c141-arp-nan', 'ip neigh show dev sv', 3)}
<p>Nạn nhân vẫn có Internet — kẻ tấn công chuyển tiếp hết — nhưng giờ cổng ra và kẻ tấn công có <strong>cùng một MAC</strong> trong bảng của nó. Đây là thứ kẻ tấn công đọc được:</p>
${R('c141-arp-doc', 'tshark -r /tmp/nghe.pcap -Y "http.request"', 2)}
<p>Qua HTTP, các ô của form hiện rõ: <code>user=SE12345</code>, <code>pass=matkhau123</code>. Qua HTTPS, chỉ có tên trang lấy từ ClientHello của TLS (SNI, bài 14.2) — mật khẩu vẫn được mã hoá. Cách phòng: HTTPS ở mọi nơi (và không bao giờ bấm bỏ qua cảnh báo chứng chỉ), VPN trên Wi-Fi không tin cậy (bài 14.4), và để ý trong <code>arp -a</code> có hai IP chung một MAC. Phía mạng phòng bằng "cách ly máy khách" (client isolation) trên điểm phát và Dynamic ARP Inspection trên switch. ⚠️ Chỉ làm việc này trong lab của chính bạn: làm trên mạng thật là tấn công.</p>
${cauNoi('vi', { ...NWC, bai: 'nwc204-15-1-moi-de-doa-va-cac-kieu-tan-cong', so: '15.1', ten: 'Mối đe doạ và các kiểu tấn công', giong: 'giả mạo, người đứng giữa, do thám', khac: 'NWC204 phân loại tấn công và cách giảm thiểu ở mức tổng quát', them: 'một vụ ARP giả mạo chạy thật trên Wi-Fi kiểu mạng trường: nạn nhân vẫn dùng mạng bình thường trong khi kẻ tấn công đọc được mật khẩu gửi qua HTTP, còn qua HTTPS thì chỉ thấy tên trang' })}

<h3>Cách hiện đại: đăng nhập ngay ở tầng Wi-Fi (802.1X / WPA2-Enterprise)</h3>
<p>Nhiều trường đại học dùng <strong>WPA2/WPA3-Enterprise</strong> (eduroam là ví dụ nổi tiếng nhất): bạn gõ tài khoản <em>ngay lúc vào SSID</em>, điểm phát chuyển nó tới một máy chủ RADIUS, và mỗi thiết bị nhận khoá mã hoá riêng. Mạng biết <strong>con người</strong> chứ không phải một MAC, nên địa chỉ riêng không gây chuyện gì, và chép MAC chẳng được gì. Một luật duy nhất: khi máy hỏi có tin chứng chỉ của mạng không, kiểm xem đó có đúng là của trường — chấp nhận bừa mọi chứng chỉ là cách evil twin lấy cắp loại mật khẩu này.</p>

<h3>"Nếu… thì sao" — năm tình huống bạn sẽ gặp</h3>
<ul>
<li><strong>…hôm qua chạy, hôm nay không?</strong> Đang bật Luân phiên/Change daily, hoặc bạn đã "quên mạng". So <code>ifconfig en0 | grep ether</code> với MAC đã đăng ký.</li>
<li><strong>…IP của bạn là 169.254.x.x?</strong> DHCP hỏng — hệ điều hành tự gán địa chỉ link-local (bài 2.1). Lỗi nằm trước cả trang đăng nhập: sóng yếu, hoặc kho địa chỉ DHCP đã hết.</li>
<li><strong>…trang đăng nhập không hiện ra?</strong> Mở tay <code>http://captive.apple.com</code> (HTTP, không phải HTTPS). Một VPN hay DNS tự đặt chạy từ trước khi đăng nhập cũng có thể che mất nó.</li>
<li><strong>…điện thoại dùng ké mạng của laptop?</strong> Mạng chỉ thấy một MAC nhưng có dấu vết khác — bài 14.2.</li>
<li><strong>…trường còn chặn một số trang hay game?</strong> Đó là cơ chế khác (DNS, SNI, cổng) — bài 14.2.</li>
</ul>

<h3>Chẩn đoán "Wi-Fi trường không vào được mạng", theo từng tầng</h3>
<div class="table-wrap"><table>
<tr><th>#</th><th>Kiểm</th><th>macOS</th><th>Windows (theo tài liệu Microsoft)</th><th>Lành khi</th></tr>
<tr><td>1</td><td>Card đang dùng MAC nào?</td><td><code>ifconfig en0 | grep ether</code></td><td><code>getmac /v</code> · <code>ipconfig /all</code></td><td>bằng MAC đã đăng ký</td></tr>
<tr><td>2</td><td>Đã tắt địa chỉ riêng cho SSID này?</td><td>ký tự thứ hai ∉ {2,6,A,E}</td><td>Random hardware addresses = Off</td><td>MAC nhà máy</td></tr>
<tr><td>3</td><td>Có IP chưa?</td><td><code>ipconfig getifaddr en0</code></td><td><code>ipconfig</code></td><td>không rỗng, không phải 169.254.x.x</td></tr>
<tr><td>4</td><td>Tới được cổng ra?</td><td><code>arp -a</code>, <code>ping</code> router</td><td><code>arp -a</code></td><td>mỗi IP một MAC</td></tr>
<tr><td>5</td><td>Có trang đăng nhập chặn?</td><td><code>curl -sI http://captive.apple.com</code></td><td>mở http://www.msftconnecttest.com/connecttest.txt</td><td>200 + Success / Microsoft Connect Test</td></tr>
<tr><td>6</td><td>DNS và HTTPS?</td><td><code>dig</code>, <code>curl -I https://…</code></td><td><code>nslookup</code>, trình duyệt</td><td>có câu trả lời + chứng chỉ hợp lệ</td></tr>
</table></div>

<h3>Nó nằm ở đâu trong máy tính</h3>
<ul>
<li><strong>MAC phần cứng</strong> lưu trong chip Wi-Fi; driver của hệ điều hành có thể đặt một MAC <strong>khác</strong> vào các frame gửi đi — địa chỉ riêng chỉ là vậy. Các địa chỉ riêng theo từng mạng là một bảng nhỏ trong cài đặt của hệ điều hành.</li>
<li><strong>Lease DHCP</strong> nằm trong RAM/đĩa của bộ điều khiển (ghi theo MAC) và của laptop.</li>
<li><strong>Danh sách "tài khoản ↔ MAC"</strong> và các luật cho qua nằm trong RAM của bộ điều khiển; <strong>bảng của switch</strong> nằm trong điểm phát/switch.</li>
</ul>

<h3>🧪 Thực hành — trên chính laptop của bạn (20 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> bạn muốn cả hai laptop sẵn sàng cho Wi-Fi trường trước khi vào học, không dính bẫy "đăng ký rồi vẫn bị chặn".</p>
<ol>
<li>Trên từng laptop, ghi MAC <strong>phần cứng</strong> và MAC <strong>đang dùng</strong> (Mac: <code>networksetup -getmacaddress Wi-Fi</code> và <code>ifconfig en0 | grep ether</code>; Windows: <code>getmac /v</code>).</li>
<li>Áp luật 2/6/A/E cho từng cái. Cái nào là địa chỉ riêng?</li>
<li>Mở chi tiết Wi-Fi của các mạng bạn hay dùng (nhà, trường). Ghi cài đặt địa chỉ riêng của từng mạng.</li>
<li>Chạy câu hỏi dò ở nhà (<code>curl -s http://captive.apple.com</code>). Đoán xem trước khi đăng nhập ở trường nó sẽ in gì.</li>
<li>Trong lab (<code>bash lab/code/dung-output-ch14.sh</code> với <code>GIU_LAB=1</code>), cho laptop Windows đăng nhập bằng SE67890: giờ hai laptop cùng chạy không?</li>
</ol>
<p><strong>Đạt khi:</strong> bạn nói được trường sẽ thấy MAC nào từ mỗi laptop, đã tắt địa chỉ riêng cho cả hai SSID của trường, và giải thích được vì sao hai tài khoản thì chạy còn một tài khoản thì không.</p>
<details><summary>Lời giải</summary><p>Trường thấy MAC <em>đang dùng</em>, không phải MAC phần cứng. Hai cái khác nhau nghĩa là địa chỉ riêng đang bật. Tắt cho cả hai SSID thì MAC đang dùng bằng MAC phần cứng ở mọi mạng, nên một lần đăng ký phủ cả hai SSID. Câu hỏi dò in <code>Success</code> ở nhà và một lệnh chuyển hướng (302) trước khi đăng nhập ở trường. Với hai tài khoản khác nhau, bộ điều khiển giữ hai dòng trong danh sách, mỗi dòng một MAC, nên cả hai laptop đều được qua — đúng thứ bạn có khi xin IT đăng ký thêm thiết bị thứ hai.</p></details>
</div>

<details><summary>🧠 Tự kiểm (5 câu)</summary>
<ol>
<li>MAC của bạn là <code>9a:7f:02:b8:41:6d</code>. Nhà máy hay địa chỉ riêng? — <em>Địa chỉ riêng: ký tự thứ hai là A.</em></li>
<li>8 giờ bạn đăng ký, mọi thứ chạy; 10 giờ bạn "không có Internet" và IP đã khác. IP mới có phải nguyên nhân? — <em>Không; IP đổi là bình thường. Kiểm xem MAC có đổi không (Luân phiên/Change daily, đã quên mạng).</em></li>
<li>Vì sao trang đăng nhập chỉ bật lên với câu hỏi dò qua HTTP? — <em>HTTPS không chặn giữa đường được mà không gây cảnh báo chứng chỉ; hệ điều hành dò một trang HTTP biết trước rồi so nội dung.</em></li>
<li>Hai laptop chung một MAC cùng online. Ping ổn mà tải tệp hỏng. Vì sao? — <em>Bảng của switch lật giữa hai cổng; gói của một kết nối TCP tới nhầm laptop kia, laptop đó trả RST.</em></li>
<li>Vì sao chép MAC vô dụng ở mạng 802.1X? — <em>Mạng xác thực con người, mỗi thiết bị có khoá riêng, không dựa vào MAC.</em></li>
</ol></details>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
    ['MAC address (địa chỉ MAC)', 'Địa chỉ 6 byte của card mạng, dùng trên một đường truyền; thứ Wi-Fi trường đăng ký.'],
    ['OUI', '3 byte đầu của MAC nhà máy: nhà sản xuất, tra trong sổ công khai của IEEE.'],
    ['locally administered bit (bit tự quản)', 'Bit 1 của byte đầu: 1 = MAC do phần mềm chọn (riêng/ngẫu nhiên).'],
    ['private Wi-Fi address / random hardware address (địa chỉ Wi-Fi riêng)', 'MAC do phần mềm đặt cho từng mạng (Cố định/On) hoặc đổi theo thời gian (Luân phiên/Change daily).'],
    ['DHCP / DORA / lease (hợp đồng thuê)', 'Cách thiết bị mượn IP: Discover, Offer, Request, Ack; khoản mượn ghi theo MAC.'],
    ['captive portal (trang đăng nhập bắt buộc)', 'Mạng chặn HTTP cho tới khi bạn đăng nhập; hệ điều hành phát hiện bằng câu hỏi dò.'],
    ['802.1X / WPA2-Enterprise', 'Đăng nhập ngay ở tầng Wi-Fi bằng tài khoản cá nhân; không cần đăng ký MAC.'],
    ['ARP spoofing (ARP giả mạo)', 'Nói với nạn nhân rằng IP cổng ra nằm ở MAC của kẻ tấn công để đứng giữa đường.'],
  ])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>IP = địa chỉ phòng trọ (đổi, bình thường); MAC = số khung xe (thứ trường đăng ký).</li>
<li>Mạng thấy MAC <em>đang dùng</em> (<code>ifconfig en0</code>), không phải MAC phần cứng (<code>networksetup</code>); ký tự thứ hai là 2/6/A/E = địa chỉ riêng.</li>
<li>Địa chỉ Wi-Fi riêng cho mỗi SSID một MAC khác ⇒ đăng ký ở SSID này, bị chặn ở SSID kia. Tắt cho cả hai SSID của trường, đăng ký một lần.</li>
<li>Một tài khoản = một MAC: laptop thứ hai thay laptop thứ nhất. Xin IT đăng ký thêm; hai máy chung một MAC thì phá TCP của nhau.</li>
<li>Đăng ký theo MAC là lớp bảo mật yếu: có chép MAC, evil twin, ARP giả mạo — HTTPS, VPN và 802.1X là cách phòng.</li>
</ul>
<p>Bài liên quan: <a href="${bai('netdev-1-3-ethernet-arp')}">1.4 Ethernet, MAC và ARP</a> · <a href="${bai('netdev-2-1-ipv4-cidr')}">2.1 IPv4 (169.254 = DHCP hỏng)</a> · <a href="${bai('netdev-6-3-chung-chi')}">6.3 Chứng chỉ</a> · <a href="${bai('netdev-14-2-mang-truong-chan')}">14.2 Mạng trường chặn những gì</a>.</p>
${L('https://support.apple.com/en-us/102509', '📄', 'Apple — Dùng địa chỉ Wi-Fi riêng trên thiết bị Apple', 'Tắt / Cố định / Luân phiên, mặc định, khi quên mạng.', 'Mở')}
${L('https://support.microsoft.com/windows/060ad2e9-526e-4f1c-9f3d-fe6a842640ed', '📄', 'Microsoft — Kết nối mạng Wi-Fi trong Windows', 'Random hardware addresses: cho mọi mạng hoặc một mạng.', 'Mở')}
${L('https://pureinfotech.com/enable-random-hardware-addresses-windows-11/', '📄', 'Pureinfotech — Random hardware addresses trên Windows 11', 'Ba lựa chọn On / Change daily / Off của từng mạng, từng bước.', 'Mở')}
${L('https://learn.microsoft.com/en-us/windows-server/networking/ncsi/ncsi-overview', '📄', 'Microsoft Learn — Tổng quan NCSI', 'Windows phát hiện trang đăng nhập ra sao ("Microsoft Connect Test").', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc8910', '📄', 'RFC 8910 — Nhận diện trang đăng nhập qua DHCP và RA', 'Tuỳ chọn DHCP 114: mạng tự báo API đăng nhập.', 'Mở')}
${L('https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/getmac', '📄', 'Microsoft Learn — getmac', 'Liệt kê MAC của mọi card mạng trên Windows.', 'Mở')}
</div>
`,
};
