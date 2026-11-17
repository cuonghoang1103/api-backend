/**
 * Chương 14 · 14.6b — Vì sao mạng nhà chậm: Mb hay MB, cổng 100M/1G, chuẩn Wi-Fi, dây, và tìm cổ chai (soạn 17/11/2026).
 * Sinh ra từ câu hỏi thật của chủ kênh: chép 165 GB từ MacBook sang máy bàn qua LAN chỉ được ~2 MB/s. Mọi số liệu là đo THẬT
 * trong phòng chủ kênh hôm đó (ethtool/lspci trên máy bàn Fedora, system_profiler trên MacBook, đếm byte của card mạng, arp).
 * KHÔNG có output iperf3 (chưa đo) ⇒ chỉ đưa lệnh, không bịa số. Mục 9: đo LẠI sau khi thay Archer AX12 (17/11 chiều). Chưa có deck slide/giảng riêng (bài bổ sung ngoài kế hoạch chương).
 */
import { code, out, card, kv } from '../_ui.mjs';

const L = card;
const bai = (slug) => `/courses/networking-for-developers/learn?lessonSlug=${slug}`;
const NWC = '/courses/nwc204-computer-networking/learn?lessonSlug=nwc204-1-1-mang-la-gi-thanh-phan-to-po';

const SO_DO = `Wall socket (building network) ──cable──► 300k Wi-Fi router ──2 m cable──► Desktop (Fedora)
                                              │                (port: 100 Mb/s)
                                              └── Wi-Fi 2.4 GHz ──► MacBook
                                                  (802.11n, 20 MHz)`;
const SO_DO_VI = `Ổ mạng trên tường (mạng toà nhà) ──dây──► Router Wi-Fi 300k ──dây 2 m──► Máy bàn (Fedora)
                                                   │                (cổng: 100 Mb/s)
                                                   └── Wi-Fi 2,4 GHz ──► MacBook
                                                       (802.11n, 20 MHz)`;
const ETHTOOL = `$ lspci | grep -i ethernet
03:00.0 Ethernet controller: Realtek Semiconductor Co., Ltd. RTL8125 2.5GbE Controller (rev 05)
$ ethtool enp3s0
	Supported link modes:   10baseT/Half 10baseT/Full
	                        100baseT/Half 100baseT/Full
	Link partner advertised link modes:  10baseT/Half 10baseT/Full
	                                     100baseT/Half 100baseT/Full
	Speed: 100Mb/s
	Duplex: Full
	Auto-negotiation: on`;
const WIFI = `$ system_profiler SPAirPortDataType
          Supported PHY Modes: 802.11 a/b/g/n/ac/ax
              PHY Mode: 802.11n
              Channel: 9 (2GHz, 20MHz)
              Signal / Noise: -40 dBm / -89 dBm
$ arp -a | grep 192.168.1.1)
? (192.168.1.1) at 5c:a6:e6:cf:53:32 on en0 ifscope [ethernet]`;
const DEM = `$ cat /sys/class/net/enp3s0/statistics/rx_bytes   # đọc hai lần, cách nhau 5 giây
135783046587
135797640475          # chênh 14 593 888 byte / 5 s ≈ 2,9 MB/s`;
const DEM_EN = `$ cat /sys/class/net/enp3s0/statistics/rx_bytes   # read twice, 5 seconds apart
135783046587
135797640475          # difference 14,593,888 bytes / 5 s ≈ 2.9 MB/s`;
// Đo LẠI sau khi thay router 17/11/2026 (TP-Link Archer AX12, AX1500, cổng gigabit) — số thật, cùng phòng, cùng máy.
const SAU = `$ cat /sys/class/net/enp3s0/speed        # máy bàn, cổng dây
1000
$ system_profiler SPAirPortDataType      # MacBook
              PHY Mode: 802.11ax
              Channel: 149 (5GHz, 80MHz)`;
const DO_CUA_BAN = `# Linux: tốc độ cổng dây đã bắt tay
ethtool enp3s0 | grep -E 'Speed|Duplex'
# macOS: chuẩn Wi-Fi, băng tần, độ rộng kênh, tín hiệu
system_profiler SPAirPortDataType | grep -E 'PHY Mode|Channel|Signal'
# Windows (PowerShell): tốc độ từng card
Get-NetAdapter | Select-Object Name, LinkSpeed
# Thông lượng mạng thuần giữa hai máy (không dính ổ đĩa): máy A chạy server, máy B đo
iperf3 -s                 # trên máy bàn
iperf3 -c 192.168.1.102   # trên laptop: in ra Mbits/sec`;
const DO_CUA_BAN_EN = `# Linux: the speed the wired port negotiated
ethtool enp3s0 | grep -E 'Speed|Duplex'
# macOS: Wi-Fi standard, band, channel width, signal
system_profiler SPAirPortDataType | grep -E 'PHY Mode|Channel|Signal'
# Windows (PowerShell): speed of every adapter
Get-NetAdapter | Select-Object Name, LinkSpeed
# Raw network throughput between two machines (no disk involved): A serves, B measures
iperf3 -s                 # on the desktop
iperf3 -c 192.168.1.102   # on the laptop: prints Mbits/sec`;

export default {
  title: '14.6b — Why the home network is slow: Mb or MB, 100M vs gigabit ports, Wi-Fi standards, and finding the bottleneck|||14.6b — Vì sao mạng nhà chậm: Mb hay MB, cổng 100M hay gigabit, chuẩn Wi-Fi và tìm cổ chai',
  slug: 'netdev-14-6b-toc-do-mang-nha',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Một ca thật: chép 165 GB từ MacBook sang máy bàn trong cùng phòng chỉ được ~2 MB/s. Đo từng đoạn: Mb/s khác MB/s (chia 8); chiếc router Wi-Fi 300k là router + switch + điểm phát Wi-Fi; ethtool cho thấy card 2,5 Gb/s chỉ bắt tay 100 Mb/s vì cổng router; MacBook hỗ trợ Wi-Fi 6 nhưng chạy 802.11n 2,4 GHz kênh 20 MHz; đếm byte của card; dây Cat5/5e/6; nhiều tệp nhỏ; quy tắc "đoạn chậm nhất quyết định"; cách chọn router (cổng gigabit, Wi-Fi 6, 2×2) và đo lại sau khi đổi; góc kẻ xấu: dùng ké Wi-Fi, router hết hạn cập nhật bị gom vào botnet.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.6b</span>
<h2>Why the home network is slow: Mb or MB, 100M vs gigabit ports, Wi-Fi standards, and finding the bottleneck</h2>
<p class="lead">A real case from November 2026: copying 165 GB from a MacBook to the desktop in the <em>same room</em> crawled at about <strong>2 MB/s</strong> — a full day. The Internet felt fine, both machines were "fast", the cable was new. This lesson measures every hop of that room, finds which one is the bottleneck, and turns it into a rule you can use on any network.</p>

<h3>The everyday picture</h3>
<ul>
<li>A network path is a <strong>chain of water pipes</strong>: the water arrives only as fast as the <em>narrowest</em> pipe lets it. A 2.5 Gb/s card behind a 100 Mb/s port is a fire hose screwed onto a straw.</li>
<li><strong>Mb vs MB</strong> is grains vs bags: a <em>bit</em> (b) is one grain, a <em>byte</em> (B) is a bag of 8 grains. Network speeds are sold in bits per second; file sizes and download bars are in bytes. Always divide by 8.</li>
<li>The cheap "Wi-Fi router" is really <strong>three boxes glued together</strong>: a router (your LAN ↔ the building's WAN), a small switch (the LAN ports at the back) and an access point (the Wi-Fi radio).</li>
</ul>

<h3>1 — Mb/s or MB/s?</h3>
${kv([
    ['100 Mb/s (Fast Ethernet, many cheap routers)', '≈ 94 Mb/s real ⇒ ≈ 11–12 MB/s'],
    ['1 Gb/s (Gigabit Ethernet)', '≈ 940 Mb/s real ⇒ ≈ 110–117 MB/s'],
    ['2.5 Gb/s (the desktop\'s card here)', '≈ 280–290 MB/s'],
    ['Internet plan "100 Mbps"', 'at most ≈ 12 MB/s download'],
  ])}
<p>The "real" column is lower than the label because every frame carries headers (Ethernet, IP, TCP — lessons 1.2 and 4.1) and gaps between frames. When a speed test says 94 Mb/s on a 100 Mb/s port, nothing is wrong: that <em>is</em> full speed.</p>

<h3>2 — The room, drawn as a network</h3>
${code(SO_DO, 'text')}
<p>The cable from the wall goes into the router's <strong>WAN</strong> port: that side is the building's network, and beyond it the Internet. Everything behind the router — the desktop on a cable, the MacBook on Wi-Fi — is your <strong>LAN</strong>, all in 192.168.1.x (the four scales LAN/MAN/WAN/Internet are in <a href="${NWC}">NWC204 · 1.1</a>). A copy from MacBook to desktop never leaves the room, so the Internet plan does not matter at all — only the LAN hops do.</p>

<h3>3 — Hop one: the cable port</h3>
${out(ETHTOOL)}
<p>The desktop's card is a <strong>2.5 GbE</strong> controller, yet it is running at <code>Speed: 100Mb/s</code>. Look at <em>Link partner advertised</em>: the other end — the router's LAN port — only offers 10 and 100 Mb/s. The two sides agree on the best speed <em>both</em> support (auto-negotiation), so the 2.5 Gb/s card drops to 100. That is the "10/100" printed on the box of most budget routers. A faulty or 2-pair cable produces the same picture, which is why you re-check with <code>ethtool</code> after changing anything.</p>

<h3>4 — Hop two: the radio</h3>
${out(WIFI)}
<p>Three facts in four lines. The MacBook <em>supports</em> 802.11ax (Wi-Fi 6) but is <em>running</em> 802.11n (Wi-Fi 4): a link is only as new as the older end. It sits on <strong>2.4 GHz with a 20 MHz channel</strong> — the slowest, most crowded combination (channels and bands: lesson 14.6 §5). And the signal is excellent (−40 dBm, noise −89), so moving closer would not help. The router's MAC begins with <code>5c:a6:e6</code>, a TP-Link prefix (the first half of a MAC names the manufacturer — lesson 14.1).</p>
${kv([
    ['Wi-Fi 4 — 802.11n (2009)', '2.4/5 GHz, "N300" = 300 Mb/s on the box, real 30–100 Mb/s'],
    ['Wi-Fi 5 — 802.11ac (2013)', '5 GHz, real 200–500 Mb/s'],
    ['Wi-Fi 6 — 802.11ax (2019)', '2.4 + 5 GHz, OFDMA, real 400–900 Mb/s at 5 GHz/80 MHz'],
    ['Wi-Fi 6E / 7', 'adds 6 GHz / wider channels — only if both ends support it'],
  ])}
<p>Wi-Fi is also <strong>shared and half-duplex</strong>: one radio channel, devices take turns to talk. The number on the box is the best case for one device standing next to the router; real throughput is often a third to a half of it.</p>

<h3>5 — Measure, don't guess: count the bytes</h3>
${out(DEM_EN)}
<p>The kernel counts every byte a card receives. Two reads five seconds apart give the true rate on the wire: ≈ 2.9 MB/s arriving at the desktop while the copy ran (the copy tool itself showed ≈ 2 MB/s of file data). Far below the 11 MB/s the 100 Mb/s port allows — so the cable port is <em>not</em> the narrowest pipe right now.</p>

<h3>6 — The rule: the slowest hop wins</h3>
${kv([
    ['MacBook ⇄ router (Wi-Fi 4, 2.4 GHz, 20 MHz)', '≈ 4–8 MB/s, shared with every other device ⇒ the bottleneck'],
    ['router ⇄ desktop (100 Mb/s port)', '≈ 11–12 MB/s ⇒ the next bottleneck after you fix Wi-Fi'],
    ['desktop card (2.5 GbE)', '≈ 280 MB/s ⇒ never the problem here'],
    ['thousands of small files', 'each file costs a round trip + metadata ⇒ a tar stream is faster than file-by-file'],
  ])}
<p>Fixing the cable alone would change nothing for this copy, because the radio is narrower. Fixing only the Wi-Fi would hit the 100 Mb/s port next. You find the order by measuring each hop, then fix the narrowest one first.</p>

<h3>7 — Cables in one table</h3>
${kv([
    ['Cat5', '100 Mb/s (old)'],
    ['Cat5e', '1 Gb/s up to 100 m — fine for almost every home'],
    ['Cat6', '1 Gb/s (10 Gb/s up to ~55 m)'],
    ['Cat6a', '10 Gb/s up to 100 m'],
  ])}
<p>The category is printed on the cable jacket. Very cheap cables sometimes carry only 2 of the 4 pairs — they work, but never above 100 Mb/s. After any swap, <code>ethtool</code> (or the adapter status on Windows/macOS) tells you the truth in one line.</p>

<h3>8 — Choosing a router that will not be the bottleneck</h3>
<ul>
<li>Ports labelled <strong>10/100/1000</strong> (Gigabit) for both WAN and LAN. "10/100" ports cap every wired device at ≈ 11 MB/s.</li>
<li><strong>Wi-Fi 6 (802.11ax), dual band</strong>, at least <strong>2×2</strong> antennas/streams; use the 5 GHz network for laptops near the router.</li>
<li>Still receiving <strong>firmware updates</strong> (check the vendor's support page) — see the attacker's corner.</li>
<li>After installing it, measure again: <code>ethtool</code> should say <code>1000Mb/s</code>, the Mac should show <code>802.11ax</code> on a 5 GHz channel.</li>
<li>A new router speeds up the <em>LAN</em>. Your <em>Internet</em> is still capped by the building's plan behind the wall socket.</li>
</ul>

<h3>9 — After the upgrade: measured again</h3>
<p>The same afternoon the old router was replaced by a TP-Link Archer AX12 (Wi-Fi 6 AX1500, gigabit ports, about 900k VND), with a Cat6 cable to the desktop. Same room, same machines, measured the same way:</p>
${out(SAU)}
${kv([
    ['Desktop cable port', '100 Mb/s ⇒ <strong>1000 Mb/s</strong>'],
    ['MacBook radio', 'Wi-Fi 4, 2.4 GHz, 20 MHz ⇒ <strong>Wi-Fi 6, 5 GHz, 80 MHz</strong>'],
    ['Copy MacBook → desktop (rsync, many small files)', '≈ 2 MB/s ⇒ <strong>51–56 MB/s</strong> (≈ 25×) — 200 episodes in ~4 minutes'],
    ['Internet on the MacBook (download from the CDN)', '≈ 0.4 MB/s while the copy shared the old radio ⇒ <strong>≈ 9 MB/s</strong>'],
  ])}
<p>Every hop moved — except one. The router's app immediately warned: <em>"the cable on the WAN port does not support gigabit"</em>. The cable from the wall negotiates only 100 Mb/s, so the Internet now stops at ≈ 11 MB/s — exactly what the desktop had been reaching all along. The router end of that cable has all 8 wires, so the limit is on the building's side (a 10/100 switch, a badly crimped far end, or a broken pair in the wall). That is the rule from section 6 again: fix the narrowest pipe and the next one becomes the bottleneck. For a rented room it is the right place to stop — 11 MB/s is plenty for 4K video and work, and the router moves with you.</p>
<p>Two more messages from the app are lessons from this chapter: <strong>"double NAT"</strong> (your router sits behind the building's router — the same effect as CGNAT in lesson 14.6, harmless unless you open ports) and <strong>"random MAC address detected"</strong> on the MacBook (the private Wi-Fi address from lesson 14.1 — set it to <em>Fixed</em> for your home network so per-device settings stick).</p>

<h3>🕵️ The attacker's corner</h3>
<ul>
<li><strong>The neighbour on your Wi-Fi.</strong> A weak password (or WPS left on — lesson 14.6) lets someone join your LAN: they eat airtime on that shared channel, and they can now reach your machines directly (shared folders, a dev server on 0.0.0.0, a NAS). <em>Defence:</em> WPA2/WPA3 with a long passphrase, WPS off, and look at the router's "connected devices" list — a phone you do not own is a red flag.</li>
<li><strong>The router nobody updates.</strong> In 2016 the <em>Mirai</em> botnet logged into hundreds of thousands of cameras and routers with default passwords and used them to flood the DNS provider Dyn, taking Twitter, Netflix and GitHub offline for hours in parts of the world. Cheap routers that stopped receiving firmware are still recruited the same way. <em>Defence:</em> change the admin password on day one, turn off remote administration, and retire routers whose vendor stopped shipping updates.</li>
</ul>

<h3>"What if…"</h3>
<ul>
<li><strong>…I add a gigabit switch?</strong> The desktop and anything wired to the switch talk at 1 Gb/s to each other — but the MacBook is still on the old radio, so this copy stays slow.</li>
<li><strong>…I plug the MacBook in with a USB-C Ethernet adapter?</strong> Then the path is cable–router port–cable: ≈ 11 MB/s on the 10/100 router, ≈ 110 MB/s once the router has gigabit ports.</li>
<li><strong>…the building only sells 50 Mbps?</strong> A new router will not make YouTube faster than ≈ 6 MB/s. It fixes copies <em>inside</em> the room, and Wi-Fi coverage.</li>
</ul>

<h3>Where this lives in the computer</h3>
<p>Auto-negotiation happens in the network card's PHY chip before the operating system sends a single packet; Linux exposes the result in <code>/sys/class/net/&lt;card&gt;/speed</code> and the byte counters in <code>/sys/class/net/&lt;card&gt;/statistics/</code>. The Wi-Fi rate is chosen per frame by the radio driver (rate adaptation) and changes with distance and interference.</p>

<h3>🧪 Practice (15 minutes)</h3>
${code(DO_CUA_BAN_EN)}
<ol>
<li>Draw your own room like section 2, writing the measured speed on every hop.</li>
<li>Circle the slowest hop. Predict the copy speed from it (÷ 8, minus ~10%).</li>
<li>Run <code>iperf3</code> between two machines and compare with your prediction. If a file copy is much slower than iperf3, the disk or small files are to blame, not the network.</li>
</ol>

<h3>🗂 Key terms</h3>
${kv([
    ['bit / byte (b / B)', '1 byte = 8 bits. Networks in Mb/s, files in MB.'],
    ['Fast Ethernet / Gigabit', '100 Mb/s / 1 Gb/s wired links.'],
    ['auto-negotiation', 'Both ends of a cable agree on the fastest speed both support.'],
    ['802.11n / ac / ax', 'Wi-Fi 4 / 5 / 6.'],
    ['2.4 / 5 GHz, channel width', 'Band and how wide a slice of it the link uses (20/40/80 MHz).'],
    ['throughput / bottleneck', 'What actually gets through / the narrowest hop that limits it.'],
  ])}

<h3>📌 Summary</h3>
<ul>
<li>Divide network speeds by 8 to compare with file sizes; ≈ 90% of the label is "full speed".</li>
<li>A home router = router + switch + Wi-Fi radio. Copies inside the room use only the LAN.</li>
<li>Measure every hop: <code>ethtool</code> for cables, the Wi-Fi status for the radio, byte counters or <code>iperf3</code> for throughput.</li>
<li>The slowest hop sets the speed. Here: Wi-Fi 4 at 2.4 GHz first, then the 10/100 router port.</li>
<li>Buy: gigabit ports, Wi-Fi 6 dual band, still updated — and re-measure after installing it.</li>
<li>Measured after the swap: copy 2 → 51–56 MB/s, MacBook Internet ≈ 0.4 → 9 MB/s; the new bottleneck is the 100 Mb/s wall cable.</li>
</ul>
<p>Related: <a href="${bai('netdev-14-6-lan-nha-ky-tuc-xa')}">14.6 Home and dorm network</a> · <a href="${bai('netdev-14-1-wifi-truong-mac')}">14.1 Wi-Fi and MAC</a> · <a href="${NWC}">NWC204 · 1.1 LAN, MAN, WAN</a></p>
${L('https://iperf.fr/', '🛠', 'iPerf3 — measure network throughput', 'The standard tool for raw TCP/UDP speed between two machines.', 'Open')}
${L('https://en.wikipedia.org/wiki/Mirai_(malware)', '📄', 'Mirai (malware)', 'How default passwords on routers and cameras built a botnet in 2016.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.6b</span>
<h2>Vì sao mạng nhà chậm: Mb hay MB, cổng 100M hay gigabit, chuẩn Wi-Fi và tìm cổ chai</h2>
<p class="lead">Một ca thật tháng 11/2026: chép 165 GB từ MacBook sang máy bàn <em>trong cùng một phòng</em> mà chỉ được khoảng <strong>2 MB/s</strong> — mất cả ngày. Internet vẫn thấy ổn, hai máy đều "mạnh", dây thì mới mua. Bài này đo từng đoạn đường trong căn phòng đó, tìm ra đoạn nào là cổ chai, rồi rút thành quy tắc dùng được cho mọi mạng.</p>

<h3>Hình dung đời thường</h3>
<ul>
<li>Đường đi trong mạng là một <strong>chuỗi ống nước</strong>: nước chảy tới nhanh chỉ bằng đoạn ống <em>hẹp nhất</em>. Card 2,5 Gb/s đứng sau cổng 100 Mb/s giống vòi cứu hoả vặn vào ống hút.</li>
<li><strong>Mb và MB</strong> là hạt và túi: <em>bit</em> (b) là một hạt, <em>byte</em> (B) là một túi 8 hạt. Tốc độ mạng bán theo bit mỗi giây; dung lượng tệp và thanh tải thì theo byte. Luôn chia cho 8.</li>
<li>Cục "router Wi-Fi" giá rẻ thật ra là <strong>ba thiết bị dán lại</strong>: router (nối LAN của bạn với WAN của toà nhà), một switch nhỏ (các cổng LAN phía sau) và điểm phát sóng (Wi-Fi).</li>
</ul>

<h3>1 — Mb/s hay MB/s?</h3>
${kv([
    ['100 Mb/s (Fast Ethernet, nhiều router rẻ)', 'thực tế ≈ 94 Mb/s ⇒ ≈ 11–12 MB/s'],
    ['1 Gb/s (Gigabit Ethernet)', 'thực tế ≈ 940 Mb/s ⇒ ≈ 110–117 MB/s'],
    ['2,5 Gb/s (card của máy bàn ở đây)', '≈ 280–290 MB/s'],
    ['Gói Internet "100 Mbps"', 'tải tối đa ≈ 12 MB/s'],
  ])}
<p>Cột "thực tế" thấp hơn nhãn vì mỗi khung tin mang theo phần đầu (Ethernet, IP, TCP — bài 1.2 và 4.1) và khoảng nghỉ giữa các khung. Đo được 94 Mb/s trên cổng 100 Mb/s là không có gì sai: đó <em>chính là</em> tốc độ tối đa.</p>

<h3>2 — Căn phòng, vẽ thành một mạng</h3>
${code(SO_DO_VI, 'text')}
<p>Dây từ tường cắm vào cổng <strong>WAN</strong> của router: phía đó là mạng của toà nhà, xa hơn là Internet. Mọi thứ phía sau router — máy bàn cắm dây, MacBook dùng Wi-Fi — là <strong>LAN</strong> của bạn, cùng dải 192.168.1.x (bốn phạm vi LAN/MAN/WAN/Internet có ở <a href="${NWC}">NWC204 · 1.1</a>). Chép từ MacBook sang máy bàn không bao giờ ra khỏi phòng, nên gói Internet hoàn toàn không liên quan — chỉ các đoạn trong LAN mới quyết định.</p>

<h3>3 — Đoạn một: cổng dây</h3>
${out(ETHTOOL)}
<p>Card của máy bàn là loại <strong>2,5 GbE</strong>, vậy mà đang chạy <code>Speed: 100Mb/s</code>. Nhìn dòng <em>Link partner advertised</em>: đầu bên kia — cổng LAN của router — chỉ chào 10 và 100 Mb/s. Hai đầu thống nhất tốc độ cao nhất mà <em>cả hai</em> cùng làm được (tự thương lượng, auto-negotiation), nên card 2,5 Gb/s phải hạ xuống 100. Đó chính là chữ "10/100" in trên vỏ hộp phần lớn router giá rẻ. Dây hỏng hoặc dây chỉ có 2 cặp lõi cũng ra đúng hình này, nên đổi gì xong cũng phải kiểm lại bằng <code>ethtool</code>.</p>

<h3>4 — Đoạn hai: sóng</h3>
${out(WIFI)}
<p>Bốn dòng, ba sự thật. MacBook <em>hỗ trợ</em> 802.11ax (Wi-Fi 6) nhưng đang <em>chạy</em> 802.11n (Wi-Fi 4): kết nối chỉ mới bằng đầu cũ hơn. Nó nằm ở <strong>2,4 GHz, kênh rộng 20 MHz</strong> — tổ hợp chậm và đông đúc nhất (băng tần và kênh: bài 14.6 mục 5). Và tín hiệu rất mạnh (−40 dBm, nhiễu −89), nên ngồi gần router hơn cũng không nhanh hơn. Địa chỉ MAC của router bắt đầu bằng <code>5c:a6:e6</code>, tiền tố của TP-Link (nửa đầu MAC cho biết hãng sản xuất — bài 14.1).</p>
${kv([
    ['Wi-Fi 4 — 802.11n (2009)', '2,4/5 GHz, "N300" = 300 Mb/s trên vỏ hộp, thực tế 30–100 Mb/s'],
    ['Wi-Fi 5 — 802.11ac (2013)', '5 GHz, thực tế 200–500 Mb/s'],
    ['Wi-Fi 6 — 802.11ax (2019)', '2,4 + 5 GHz, OFDMA, thực tế 400–900 Mb/s ở 5 GHz/80 MHz'],
    ['Wi-Fi 6E / 7', 'thêm băng 6 GHz / kênh rộng hơn — chỉ có tác dụng khi cả hai đầu cùng hỗ trợ'],
  ])}
<p>Wi-Fi còn là <strong>kênh dùng chung và bán song công</strong>: một kênh sóng, các thiết bị thay phiên nhau nói. Con số trên vỏ hộp là trường hợp đẹp nhất cho một thiết bị đứng ngay cạnh router; thông lượng thật thường chỉ bằng một phần ba đến một nửa.</p>

<h3>5 — Đo, đừng đoán: đếm byte</h3>
${out(DEM)}
<p>Nhân hệ điều hành đếm từng byte card mạng nhận được. Đọc hai lần cách nhau năm giây là ra tốc độ thật trên dây: ≈ 2,9 MB/s đổ vào máy bàn trong lúc chép (công cụ chép báo ≈ 2 MB/s dữ liệu tệp). Còn xa mức 11 MB/s mà cổng 100 Mb/s cho phép — vậy lúc này cổng dây <em>chưa</em> phải đoạn ống hẹp nhất.</p>

<h3>6 — Quy tắc: đoạn chậm nhất thắng</h3>
${kv([
    ['MacBook ⇄ router (Wi-Fi 4, 2,4 GHz, 20 MHz)', '≈ 4–8 MB/s, chia với mọi thiết bị khác ⇒ cổ chai'],
    ['router ⇄ máy bàn (cổng 100 Mb/s)', '≈ 11–12 MB/s ⇒ cổ chai kế tiếp sau khi sửa Wi-Fi'],
    ['card máy bàn (2,5 GbE)', '≈ 280 MB/s ⇒ không bao giờ là vấn đề ở đây'],
    ['hàng nghìn tệp nhỏ', 'mỗi tệp tốn một lượt hỏi–đáp + siêu dữ liệu ⇒ gói thành một luồng tar nhanh hơn chép từng tệp'],
  ])}
<p>Chỉ thay dây thì lượt chép này chẳng nhanh thêm chút nào, vì đoạn sóng còn hẹp hơn. Chỉ sửa Wi-Fi thì sẽ vấp tiếp cổng 100 Mb/s. Thứ tự sửa có được nhờ đo từng đoạn, rồi sửa đoạn hẹp nhất trước.</p>

<h3>7 — Dây mạng trong một bảng</h3>
${kv([
    ['Cat5', '100 Mb/s (cũ)'],
    ['Cat5e', '1 Gb/s tới 100 m — đủ cho hầu hết mọi nhà'],
    ['Cat6', '1 Gb/s (10 Gb/s tới khoảng 55 m)'],
    ['Cat6a', '10 Gb/s tới 100 m'],
  ])}
<p>Loại dây in trên vỏ dây. Dây quá rẻ đôi khi chỉ có 2 trong 4 cặp lõi — vẫn chạy, nhưng không bao giờ vượt 100 Mb/s. Đổi dây xong, <code>ethtool</code> (hay trạng thái card trên Windows/macOS) nói thật trong một dòng.</p>

<h3>8 — Chọn router để nó không thành cổ chai</h3>
<ul>
<li>Cổng ghi <strong>10/100/1000</strong> (Gigabit) cho cả WAN lẫn LAN. Cổng "10/100" chặn mọi máy cắm dây ở ≈ 11 MB/s.</li>
<li><strong>Wi-Fi 6 (802.11ax), hai băng tần</strong>, tối thiểu <strong>2×2</strong> ăng-ten/luồng; laptop gần router thì dùng mạng 5 GHz.</li>
<li>Còn được <strong>cập nhật firmware</strong> (xem trang hỗ trợ của hãng) — xem góc kẻ xấu.</li>
<li>Lắp xong thì đo lại: <code>ethtool</code> phải báo <code>1000Mb/s</code>, Mac phải hiện <code>802.11ax</code> trên một kênh 5 GHz.</li>
<li>Router mới làm nhanh <em>LAN</em>. <em>Internet</em> vẫn bị giới hạn bởi gói cước của toà nhà phía sau ổ mạng trên tường.</li>
</ul>

<h3>9 — Sau khi nâng cấp: đo lại</h3>
<p>Ngay chiều hôm đó router cũ được thay bằng TP-Link Archer AX12 (Wi-Fi 6 AX1500, cổng gigabit, khoảng 900 nghìn), dây sang máy bàn là Cat6. Cùng phòng, cùng máy, đo cùng cách:</p>
${out(SAU)}
${kv([
    ['Cổng dây máy bàn', '100 Mb/s ⇒ <strong>1000 Mb/s</strong>'],
    ['Sóng của MacBook', 'Wi-Fi 4, 2,4 GHz, 20 MHz ⇒ <strong>Wi-Fi 6, 5 GHz, 80 MHz</strong>'],
    ['Chép MacBook → máy bàn (rsync, nhiều tệp nhỏ)', '≈ 2 MB/s ⇒ <strong>51–56 MB/s</strong> (≈ 25 lần) — 200 tập trong khoảng 4 phút'],
    ['Internet trên MacBook (tải từ CDN)', '≈ 0,4 MB/s khi lượt chép chia chung sóng cũ ⇒ <strong>≈ 9 MB/s</strong>'],
  ])}
<p>Mọi đoạn đều nhanh lên — trừ một. Ứng dụng của router báo ngay: <em>"cáp Ethernet nối với cổng WAN không hỗ trợ tốc độ gigabit"</em>. Dây từ tường chỉ bắt tay 100 Mb/s, nên Internet giờ dừng ở ≈ 11 MB/s — đúng mức máy bàn vẫn chạm tới từ trước. Đầu dây phía router có đủ 8 lõi, nên giới hạn nằm ở phía toà nhà (switch 10/100, đầu bên kia bấm thiếu lõi, hoặc một cặp lõi trong tường đứt). Lại đúng quy tắc mục 6: sửa đoạn ống hẹp nhất thì đoạn kế tiếp thành cổ chai. Với phòng trọ, dừng ở đây là hợp lý — 11 MB/s dư cho video 4K và công việc, còn router thì mang theo được khi chuyển nhà.</p>
<p>Hai thông báo khác của ứng dụng cũng là bài học trong chương này: <strong>"NAT kép"</strong> (router của bạn đứng sau router toà nhà — cùng hiệu ứng với CGNAT ở bài 14.6, vô hại trừ khi bạn mở cổng) và <strong>"phát hiện địa chỉ MAC ngẫu nhiên"</strong> trên MacBook (địa chỉ Wi-Fi riêng tư ở bài 14.1 — đặt <em>Cố định</em> cho mạng nhà mình để cài đặt theo từng máy không bị mất).</p>

<h3>🕵️ Góc kẻ xấu</h3>
<ul>
<li><strong>Hàng xóm dùng ké Wi-Fi.</strong> Mật khẩu yếu (hoặc để WPS bật — bài 14.6) là có người vào được LAN của bạn: họ chiếm thời gian phát trên kênh dùng chung, và giờ họ chạm thẳng được tới máy của bạn (thư mục chia sẻ, máy chủ dev nghe ở 0.0.0.0, NAS). <em>Cách phòng:</em> WPA2/WPA3 với mật khẩu dài, tắt WPS, và xem danh sách "thiết bị đang kết nối" trong trang quản trị router — một điện thoại lạ là dấu hiệu đỏ.</li>
<li><strong>Router không ai cập nhật.</strong> Năm 2016 botnet <em>Mirai</em> đăng nhập vào hàng trăm nghìn camera và router bằng mật khẩu mặc định, rồi dùng chúng dội lưu lượng vào nhà cung cấp DNS Dyn, làm Twitter, Netflix, GitHub không vào được nhiều giờ ở nhiều nơi. Router rẻ đã hết được cập nhật firmware vẫn bị gom theo đúng cách đó. <em>Cách phòng:</em> đổi mật khẩu quản trị ngay ngày đầu, tắt quản trị từ xa, và thay router khi hãng ngừng ra bản cập nhật.</li>
</ul>

<h3>"Nếu… thì sao"</h3>
<ul>
<li><strong>…thêm một switch gigabit?</strong> Máy bàn và mọi máy cắm dây vào switch nói chuyện với nhau ở 1 Gb/s — nhưng MacBook vẫn dùng sóng cũ, nên lượt chép này vẫn chậm.</li>
<li><strong>…cắm dây cho MacBook bằng bộ chuyển USB-C ra Ethernet?</strong> Khi đó đường đi là dây – cổng router – dây: ≈ 11 MB/s với router 10/100, ≈ 110 MB/s khi router có cổng gigabit.</li>
<li><strong>…toà nhà chỉ bán gói 50 Mbps?</strong> Router mới không làm YouTube nhanh hơn ≈ 6 MB/s. Nó chỉ sửa việc chép <em>trong</em> phòng và độ phủ sóng.</li>
</ul>

<h3>Nó nằm ở đâu trong máy tính</h3>
<p>Việc tự thương lượng tốc độ diễn ra trong chip PHY của card mạng trước khi hệ điều hành gửi gói tin đầu tiên; Linux bày kết quả ra ở <code>/sys/class/net/&lt;card&gt;/speed</code> và bộ đếm byte ở <code>/sys/class/net/&lt;card&gt;/statistics/</code>. Tốc độ Wi-Fi do trình điều khiển sóng chọn cho từng khung (rate adaptation) và đổi theo khoảng cách, nhiễu.</p>

<h3>🧪 Thực hành (15 phút)</h3>
${code(DO_CUA_BAN)}
<ol>
<li>Vẽ căn phòng của bạn như mục 2, ghi tốc độ đo được lên từng đoạn.</li>
<li>Khoanh đoạn chậm nhất. Đoán tốc độ chép từ nó (÷ 8, trừ khoảng 10%).</li>
<li>Chạy <code>iperf3</code> giữa hai máy rồi so với dự đoán. Chép tệp chậm hơn iperf3 nhiều thì lỗi ở ổ đĩa hoặc ở tệp nhỏ, không phải ở mạng.</li>
</ol>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
    ['bit / byte (b / B)', '1 byte = 8 bit. Mạng tính bằng Mb/s, tệp tính bằng MB.'],
    ['Fast Ethernet / Gigabit', 'Kết nối dây 100 Mb/s / 1 Gb/s.'],
    ['auto-negotiation (tự thương lượng)', 'Hai đầu dây thống nhất tốc độ nhanh nhất mà cả hai cùng làm được.'],
    ['802.11n / ac / ax', 'Wi-Fi 4 / 5 / 6.'],
    ['2,4 / 5 GHz, độ rộng kênh', 'Băng tần và lát cắt rộng bao nhiêu của nó mà kết nối dùng (20/40/80 MHz).'],
    ['thông lượng / cổ chai', 'Lượng dữ liệu thật đi qua được / đoạn hẹp nhất giới hạn nó.'],
  ])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Chia tốc độ mạng cho 8 để so với dung lượng tệp; đạt ≈ 90% con số trên nhãn là "tối đa".</li>
<li>Router nhà = router + switch + điểm phát Wi-Fi. Chép trong phòng chỉ đi qua LAN.</li>
<li>Đo từng đoạn: <code>ethtool</code> cho dây, trạng thái Wi-Fi cho sóng, bộ đếm byte hoặc <code>iperf3</code> cho thông lượng.</li>
<li>Đoạn chậm nhất quyết định tốc độ. Ở đây: Wi-Fi 4 ở 2,4 GHz trước, rồi tới cổng router 10/100.</li>
<li>Mua: cổng gigabit, Wi-Fi 6 hai băng tần, còn được cập nhật — lắp xong thì đo lại.</li>
<li>Đo sau khi đổi: chép 2 → 51–56 MB/s, Internet trên MacBook ≈ 0,4 → 9 MB/s; cổ chai mới là dây tường 100 Mb/s.</li>
</ul>
<p>Bài liên quan: <a href="${bai('netdev-14-6-lan-nha-ky-tuc-xa')}">14.6 Mạng nhà và ký túc xá</a> · <a href="${bai('netdev-14-1-wifi-truong-mac')}">14.1 Wi-Fi và MAC</a> · <a href="${NWC}">NWC204 · 1.1 LAN, MAN, WAN</a></p>
${L('https://iperf.fr/', '🛠', 'iPerf3 — đo thông lượng mạng', 'Công cụ chuẩn đo tốc độ TCP/UDP thuần giữa hai máy.', 'Mở')}
${L('https://en.wikipedia.org/wiki/Mirai_(malware)', '📄', 'Mirai (mã độc)', 'Mật khẩu mặc định trên router và camera đã dựng nên một botnet năm 2016 như thế nào.', 'Mở')}
</div>
`,
};
