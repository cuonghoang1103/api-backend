/**
 * 11.8 — Kiểm tra Chương 11 (soạn 24/11/2026, agent lgz). 10 câu; đáp số dựa trên output thật OUT['s11/*'].
 * Phân bố đáp án: A ×2 (4, 9) · B ×3 (1, 6, 10) · C ×3 (2, 5, 8) · D ×2 (3, 7).
 */
export default {
  title: '11.8 — Chapter 11 quiz|||11.8 — Kiểm tra Chương 11',
  slug: 'log-11-8-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu: log router mất khi khởi động lại, MAC ngẫu nhiên, AP-STA-POSSIBLE-PSK-MISMATCH, UPnP ghi yêu cầu chứ không ghi quyết định, cache che truy vấn DNS, ba mẫu DNS xấu, pfirewall.log không ghi mọi cổng bị quét, giới hạn tốc độ ghi log của ufw, RST so với im lặng trong bản bắt gói, IP ảo của OpenVPN.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Quiz</span>
<h2>Network logs</h2>
<p class="lead">Ten questions built on the real output of this chapter. For each one, ask: which device wrote this line, and what could it not see?</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can read a DHCP lease line and a hostapd join/failed-password sequence.</li>
<li>I can send a router's log to a Linux machine and explain why.</li>
<li>I can read dnsmasq query lines and spot DGA, tunnelling and beaconing.</li>
<li>I can enable and read pfirewall.log and 5156/5157 on Windows.</li>
<li>I can read every field of a [UFW BLOCK] line and explain log rate limits.</li>
<li>I can filter a pcap with tshark and match a request with an access-log line.</li>
<li>I can say who was on the VPN at a given time for WireGuard, OpenVPN and Windows.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Kiểm tra</span>
<h2>Log mạng</h2>
<p class="lead">Mười câu dựa trên output thật của chương. Với mỗi câu, tự hỏi: thiết bị nào đã ghi dòng này, và nó không thể thấy được gì?</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi đọc được một dòng lease DHCP và chuỗi dòng hostapd khi vào Wi‑Fi được/sai mật khẩu.</li>
<li>Tôi gửi được log của router về máy Linux và giải thích được vì sao.</li>
<li>Tôi đọc được dòng truy vấn của dnsmasq và nhận ra DGA, đường hầm, gọi về.</li>
<li>Tôi bật và đọc được pfirewall.log và 5156/5157 trên Windows.</li>
<li>Tôi đọc được mọi trường của một dòng [UFW BLOCK] và giải thích giới hạn tốc độ ghi log.</li>
<li>Tôi lọc được pcap bằng tshark và ghép một request với một dòng access log.</li>
<li>Tôi nói được ai đang ở trên VPN tại một thời điểm, với WireGuard, OpenVPN và Windows.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'Your OpenWrt router had 885 log lines. You reboot it. What happens to those lines?|||Router OpenWrt của bạn có 885 dòng log. Bạn khởi động lại nó. Những dòng đó ra sao?',
        options: [
          'They are kept in /var/log/messages on the router|||Được giữ trong /var/log/messages trên router',
          'They are lost: logd keeps the log in a RAM ring buffer; only a copy already sent by syslog to another machine survives|||Mất hết: logd giữ log trong bộ đệm vòng trên RAM; chỉ bản đã gửi qua syslog sang máy khác là còn',
          'They are compressed into logread.1.gz|||Được nén thành logread.1.gz',
          'They move to the WAN interface log|||Chuyển sang log của giao diện WAN',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 11.1: after the reboot the router had 642 new lines and the test message count was 0 on the router, 1 on lab7. Even the copy misses the kernel boot lines, because the forwarder starts late.|||VI: Bài 11.1: sau khi khởi động lại router có 642 dòng mới, dòng thử đếm được 0 trên router và 1 trên lab7. Bản sao cũng thiếu các dòng nhân lúc khởi động vì bộ chuyển tiếp chạy muộn.',
      },
      {
        question: 'hostapd logs: associated → AP-STA-POSSIBLE-PSK-MISMATCH (×4) → deauthenticated. What happened?|||hostapd ghi: associated → AP-STA-POSSIBLE-PSK-MISMATCH (×4) → deauthenticated. Chuyện gì đã xảy ra?',
        options: [
          'The device connected successfully and then left|||Thiết bị đã vào được rồi rời đi',
          'The signal was too weak|||Sóng quá yếu',
          'The device reached the access point but failed the WPA2 4-way handshake — wrong Wi‑Fi password|||Thiết bị tới được điểm phát nhưng trượt bắt tay bốn bước WPA2 — sai mật khẩu Wi‑Fi',
          'The router blocked the device by MAC filter|||Router chặn thiết bị bằng lọc MAC',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: A successful join ends with "WPA: pairwise key handshake completed" and EAPOL-4WAY-HS-COMPLETED (Lesson 11.1); PSK mismatch means the key derived from the password did not match.|||VI: Vào thành công thì kết thúc bằng "WPA: pairwise key handshake completed" và EAPOL-4WAY-HS-COMPLETED (Bài 11.1); PSK mismatch nghĩa là khoá suy ra từ mật khẩu không khớp.',
      },
      {
        question: 'miniupnpd logged "AddPortMapping: ext port 22 to 192.168.56.142:22". What do you conclude?|||miniupnpd ghi "AddPortMapping: ext port 22 to 192.168.56.142:22". Bạn kết luận gì?',
        options: [
          'Port 22 is now open from the Internet to that device|||Cổng 22 giờ đã mở từ Internet về thiết bị đó',
          'The device is an SSH server|||Thiết bị là một máy chủ SSH',
          'The router was hacked|||Router đã bị hack',
          'Only that the device requested it; check the lease file and NAT table — in the lab it was refused with code 606|||Chỉ biết là thiết bị đã xin; phải xem tệp lease và bảng NAT — trong lab nó bị từ chối với mã 606',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: The request line looked the same for 2323 (accepted) and 22 (refused by the perm rules allowing only ≥ 1024). The log records the request, not the decision.|||VI: Dòng yêu cầu giống hệt nhau cho 2323 (được nhận) và 22 (bị luật quyền chỉ cho ≥ 1024 từ chối). Log ghi yêu cầu, không ghi quyết định.',
      },
      {
        question: 'A phone ran "dig vnexpress.net" twice; the router\'s query log shows one query. Why?|||Một điện thoại chạy "dig vnexpress.net" hai lần; query log của router chỉ có một truy vấn. Vì sao?',
        options: [
          'The second answer came from the phone\'s own resolver cache (systemd-resolved), so the router never saw it|||Câu trả lời thứ hai đến từ cache của chính điện thoại (systemd-resolved), nên router không hề thấy',
          'The router drops duplicate queries without logging|||Router bỏ truy vấn trùng mà không ghi',
          'dig only sends a query every other time|||dig chỉ gửi truy vấn cách lần',
          'Log rate limiting in dnsmasq|||dnsmasq giới hạn tốc độ ghi log',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Every cache layer hides repeats from the layer above (Lesson 11.2): one line upstream can mean many visits.|||VI: Mỗi tầng cache che các lần lặp khỏi tầng trên (Bài 11.2): một dòng ở tầng trên có thể là nhiều lần ghé.',
      },
      {
        question: 'Which log pattern best indicates DNS tunnelling / exfiltration?|||Mẫu log nào cho thấy rõ nhất đường hầm DNS / rút dữ liệu qua DNS?',
        options: [
          'Many A queries for popular sites|||Nhiều truy vấn A tới các trang phổ biến',
          'One NXDOMAIN for a mistyped name|||Một NXDOMAIN vì gõ nhầm tên',
          'TXT queries to one domain with very long, random-looking labels (50 and 35 characters in the lab)|||Truy vấn TXT tới cùng một tên miền với nhãn rất dài, trông ngẫu nhiên (50 và 35 ký tự trong lab)',
          'The same name every 15 seconds|||Cùng một tên cứ mỗi 15 giây',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Long labels carry encoded data (decoded in the lab to an account, a password and a card number). The fixed interval (D) is beaconing; random names with NXDOMAIN bursts are DGA.|||VI: Nhãn dài mang dữ liệu đã mã hoá (trong lab giải ra một tài khoản, một mật khẩu và một số thẻ). Nhịp cố định (D) là gọi về; tên ngẫu nhiên kèm tràng NXDOMAIN là DGA.',
      },
      {
        question: 'nmap probed 25 ports on the Windows laptop. pfirewall.log shows 6 DROP lines on 3 ports (135, 139, 445). What is the right reading?|||nmap thăm 25 cổng trên laptop Windows. pfirewall.log có 6 dòng DROP trên 3 cổng (135, 139, 445). Cách hiểu đúng là gì?',
        options: [
          'Only 3 ports were scanned|||Chỉ có 3 cổng bị quét',
          'The log is a lower bound: in the lab only ports with a listening process produced DROP lines; use WFP events or a capture for completeness|||Log là cận dưới: trong lab chỉ cổng có tiến trình đang nghe mới sinh dòng DROP; muốn đủ thì dùng sự kiện WFP hoặc bắt gói',
          'The other 22 ports were allowed|||22 cổng còn lại đã được cho qua',
          'The log file was full|||Tệp log đã đầy',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 11.3, real output. Treat firewall logs as "at least", never "exactly".|||VI: Bài 11.3, output thật. Coi log tường lửa là "ít nhất", không bao giờ là "chính xác".',
      },
      {
        question: 'Right after a 25-port scan logged 10 [UFW BLOCK] lines, a 1000-port scan logs 0 lines. Why?|||Ngay sau lượt quét 25 cổng ghi 10 dòng [UFW BLOCK], lượt quét 1000 cổng ghi 0 dòng. Vì sao?',
        options: [
          'ufw allowed the second scan|||ufw đã cho qua lượt quét thứ hai',
          'rsyslog crashed|||rsyslog bị sập',
          'nmap used a different protocol|||nmap dùng giao thức khác',
          'ufw logging rules use "--limit 3/min --limit-burst 10": the bucket was empty; packets were still dropped, just not logged|||Quy tắc log của ufw có "--limit 3/min --limit-burst 10": cái xô đã cạn; gói vẫn bị chặn, chỉ không được ghi',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Lesson 11.4: absence of log lines is not absence of traffic — check rule counters (iptables -L -v, nft list ruleset).|||VI: Bài 11.4: không có dòng log không có nghĩa là không có lưu lượng — xem bộ đếm quy tắc (iptables -L -v, nft list ruleset).',
      },
      {
        question: 'An app log says only "cannot connect". The capture shows a SYN followed by [R.] from the server. What does that tell you?|||Log ứng dụng chỉ ghi "cannot connect". Bản bắt gói có một SYN rồi [R.] từ máy chủ. Điều đó cho biết gì?',
        options: [
          'A firewall silently dropped the packet|||Một tường lửa lặng lẽ bỏ gói',
          'The TLS certificate is invalid|||Chứng chỉ TLS không hợp lệ',
          'The host is reachable but nothing listens on that port (actively refused)|||Máy tới được nhưng không có gì nghe ở cổng đó (bị chủ động từ chối)',
          'DNS failed|||DNS hỏng',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: RST = refused (router port 8081 in Lesson 11.5). A dropping firewall sends nothing and the client times out.|||VI: RST = từ chối (cổng 8081 của router ở Bài 11.5). Tường lửa kiểu drop không gửi gì và máy khách chờ tới hết giờ.',
      },
      {
        question: 'The web app log shows a suspicious request from 10.8.0.6 at 12:29. How do you find the person?|||Log ứng dụng web có một request đáng ngờ từ 10.8.0.6 lúc 12:29. Tìm ra người đó thế nào?',
        options: [
          'Find the OpenVPN line "MULTI_sva: pool returned IPv4=10.8.0.6" (or the status file) around that time: it gives the certificate CN and the real IP|||Tìm dòng OpenVPN "MULTI_sva: pool returned IPv4=10.8.0.6" (hoặc tệp status) quanh thời điểm đó: nó cho CN của chứng chỉ và IP thật',
          'Reverse DNS on 10.8.0.6|||Tra DNS ngược 10.8.0.6',
          'Ask the router\'s DHCP leases|||Hỏi bảng lease DHCP của router',
          'It is impossible: VPN traffic is encrypted|||Không thể: lưu lượng VPN đã mã hoá',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lesson 11.6: the pool line maps virtual IP → CN android, real 192.168.56.142. Virtual IPs are reused, so the time matters.|||VI: Bài 11.6: dòng pool đổi IP ảo → CN android, IP thật 192.168.56.142. IP ảo được dùng lại, nên thời điểm rất quan trọng.',
      },
      {
        question: 'WireGuard shows "latest handshake: 41 seconds ago" for a peer, and the kernel logged nothing. What is true?|||WireGuard hiện "latest handshake: 41 seconds ago" cho một peer, và nhân không ghi gì. Điều nào đúng?',
        options: [
          'The peer is certainly connected now|||Peer chắc chắn đang kết nối',
          'WireGuard does not log connections by default; history needs dynamic debug or periodic sampling of wg show, and a peer with no handshake for ~3 minutes is effectively gone|||WireGuard mặc định không ghi kết nối; muốn có lịch sử phải bật dynamic debug hoặc lấy mẫu wg show định kỳ, và peer không bắt tay chừng 3 phút coi như đã đi',
          'The handshake failed 41 seconds ago|||Lần bắt tay thất bại 41 giây trước',
          'WireGuard logs to /var/log/wireguard.log|||WireGuard ghi vào /var/log/wireguard.log',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 11.6: only "module loaded" in the kernel log; with dynamic debug: "Receiving handshake initiation from peer…", "Invalid handshake initiation from 192.168.56.66".|||VI: Bài 11.6: log nhân chỉ có "module loaded"; bật dynamic debug mới có "Receiving handshake initiation from peer…", "Invalid handshake initiation from 192.168.56.66".',
      },
    ],
  },
};
