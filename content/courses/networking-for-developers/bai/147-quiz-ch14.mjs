/** Chương 14 · Quiz — 10 câu tình huống, đáp án rải đều (A×3 · B×2 · C×3 · D×2), dữ liệu từ output thật của lab "Wi-Fi trường trong một hộp". */
const q = (en, vi) => `${en}|||${vi}`;
const o = (pairs) => pairs.map(([en, vi]) => q(en, vi));
const ex = (en, vi) => `EN: ${en}|||VI: ${vi}`;

export default {
  title: 'Quiz — Chapter 14: Networking in real life|||Quiz — Chương 14: Mạng thực chiến',
  slug: 'netdev-14-8-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống: địa chỉ Wi-Fi riêng và đăng ký MAC, lọc DNS/SNI/cổng/UDP, TTL của điểm phát, ssh.socket và cửa phụ 993, giá trị đầu tiên thắng trong ~/.ssh/config, socks5 và rò DNS, WireGuard ở mạng bỏ UDP, rò DNS khi dùng VPN, CGNAT và mở cổng, điểm phát mở.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Quiz</span>
<h2>Quiz — Networking in real life</h2>
<p class="lead">Ten situations from the school Wi-Fi, the blocked network, SSH, VPNs, hotspots and the home router — each one measured in the chapter's lab.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can tell which checkpoint blocked me from the error alone.</li>
<li>I can reach my server when port 22 is blocked, and tunnel -L/-R/-D.</li>
<li>I know when a VPN leaks DNS or traffic.</li>
<li>I can tell whether I am behind CGNAT.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Quiz</span>
<h2>Quiz — Mạng thực chiến</h2>
<p class="lead">Mười tình huống từ Wi-Fi trường, mạng bị chặn, SSH, VPN, điểm phát và router nhà — tình huống nào cũng đã đo trên lab của chương.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi gọi được tên trạm đã chặn mình chỉ từ thông báo lỗi.</li>
<li>Tôi vào được máy chủ khi cổng 22 bị chặn, và dùng được đường hầm -L/-R/-D.</li>
<li>Tôi biết khi nào VPN rò DNS hoặc rò lưu lượng.</li>
<li>Tôi biết mình có đang ở sau CGNAT không.</li>
</ul>
</div>`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: q('You registered on SSID 1, but SSID 2 says "device not registered". macOS has "Private Wi-Fi address: Fixed". Why?', 'Bạn đã đăng ký ở SSID 1, nhưng SSID 2 báo "thiết bị chưa đăng ký". macOS đang để "Địa chỉ Wi-Fi riêng: Cố định". Vì sao?'),
        options: o([['Fixed means one private MAC PER NETWORK, so SSID 2 sees a MAC that was never registered', '"Cố định" là mỗi MẠNG một MAC riêng, nên SSID 2 thấy một MAC chưa từng đăng ký'], ['The password is wrong', 'Sai mật khẩu'], ['DHCP ran out of addresses', 'DHCP hết địa chỉ'], ['The school blocks macOS', 'Trường chặn macOS']]),
        correctIndex: 0, points: 1,
        explanation: ex('The controller registers the MAC of the frame that carried your login. With Fixed, macOS uses a different private MAC on each SSID, so the MAC on SSID 2 is unknown. Turn it Off (or log in again from SSID 2). The other options would give different errors.', 'Bộ điều khiển đăng ký MAC của frame chở lời đăng nhập. Với "Cố định", macOS dùng một MAC riêng khác cho mỗi SSID, nên MAC ở SSID 2 là lạ. Đặt về Tắt (hoặc đăng nhập lại từ SSID 2). Các lựa chọn kia cho lỗi khác.'),
      },
      {
        question: q('At school, https://social.test resets instantly, while news.test on the SAME IP opens. Which checkpoint?', 'Ở trường, https://social.test bị reset ngay, trong khi news.test CÙNG IP vẫn mở. Trạm nào?'),
        options: o([['DNS filter', 'Lọc DNS'], ['IP blacklist', 'Danh sách đen IP'], ['SNI filter — it reads the site name in the TLS ClientHello', 'Lọc SNI — nó đọc tên trang trong ClientHello của TLS'], ['UDP drop', 'Bỏ UDP']]),
        correctIndex: 2, points: 1,
        explanation: ex('Same IP rules out an IP block; the name resolved, so not DNS; HTTPS is TCP, so not UDP. An instant reset right after the ClientHello is an SNI rule matching the name in clear.', 'Cùng IP loại chặn IP; tên đã phân giải nên không phải DNS; HTTPS là TCP nên không phải UDP. Bị reset ngay sau ClientHello là luật SNI khớp cái tên ở dạng rõ.'),
      },
      {
        question: q('Your laptop works on school Wi-Fi; your phone behind the laptop\'s hotspot gets nothing. The controller sees one MAC. What gives the phone away?', 'Laptop dùng Wi-Fi trường được; điện thoại sau điểm phát của laptop thì không. Bộ điều khiển chỉ thấy một MAC. Thứ gì làm lộ điện thoại?'),
        options: o([['Its MAC', 'MAC của nó'], ['TTL 63 instead of 64 — the laptop routed it and lowered the TTL', 'TTL 63 thay vì 64 — laptop đã định tuyến và trừ TTL'], ['Its IP 192.168.137.50 reaches the school', 'IP 192.168.137.50 của nó tới tận trường'], ['DNS over HTTPS', 'DNS qua HTTPS']]),
        correctIndex: 1, points: 1,
        explanation: ex('After NAT the school sees the laptop\'s MAC and IP; what remains is the TTL lowered by one (and other clues like TCP timestamps). The private 192.168.137.x address never leaves the laptop while NAT is on.', 'Sau NAT trường thấy MAC và IP của laptop; thứ còn lại là TTL bị trừ một (và manh mối khác như timestamp TCP). Địa chỉ riêng 192.168.137.x không rời laptop khi NAT đang bật.'),
      },
      {
        question: q('On Ubuntu 24.04 you add "Port 993" to sshd_config and restart sshd; ss still shows only 22. Why?', 'Trên Ubuntu 24.04 bạn thêm "Port 993" vào sshd_config rồi khởi động lại sshd; ss vẫn chỉ thấy 22. Vì sao?'),
        options: o([['993 is reserved for email', '993 dành cho email'], ['The firewall blocks it', 'Tường lửa chặn'], ['sshd needs a reboot', 'sshd cần khởi động lại máy'], ['systemd\'s ssh.socket holds the port; Port only applies via the generator after daemon-reload + restarting the socket (and then REPLACES 22)', 'ssh.socket của systemd giữ cổng; Port chỉ áp qua generator sau daemon-reload + khởi động lại socket (và khi đó THAY cổng 22)']]),
        correctIndex: 3, points: 1,
        explanation: ex('Measured in the lab: with socket activation systemd listens, not sshd. The safe fix is a separate ssh993.service (sshd -D -p 993). A firewall would not change what ss lists; no reboot is needed; 993 is only a convention.', 'Đã đo trong lab: với socket activation, systemd nghe chứ không phải sshd. Cách an toàn là một ssh993.service riêng (sshd -D -p 993). Tường lửa không đổi thứ ss liệt kê; không cần khởi động lại máy; 993 chỉ là quy ước.'),
      },
      {
        question: q('~/.ssh/config: "Host vps … Port 22" then, BELOW it, "Match host vps exec … Port 993". At school ssh -G shows port 22. Fix?', '~/.ssh/config: "Host vps … Port 22" rồi, BÊN DƯỚI, "Match host vps exec … Port 993". Ở trường ssh -G ra cổng 22. Sửa thế nào?'),
        options: o([['Move the Match block ABOVE Host vps — ssh keeps the first value it meets', 'Chuyển khối Match lên TRÊN Host vps — ssh giữ giá trị đầu tiên nó gặp'], ['Use Port 993 twice', 'Ghi Port 993 hai lần'], ['Restart ssh-agent', 'Khởi động lại ssh-agent'], ['Delete known_hosts', 'Xoá known_hosts']]),
        correctIndex: 0, points: 1,
        explanation: ex('For each option ssh uses the first value obtained while reading top to bottom. Host vps set Port 22 first, so the later 993 is ignored. The agent and known_hosts have nothing to do with the port.', 'Với mỗi tuỳ chọn, ssh dùng giá trị lấy được đầu tiên khi đọc từ trên xuống. Host vps đặt Port 22 trước, nên 993 phía sau bị bỏ qua. Agent và known_hosts không liên quan tới cổng.'),
      },
      {
        question: q('Through ssh -D 1080, "curl --socks5 127.0.0.1:1080 http://phim.test/" fails at school but "--socks5-hostname" works. Why?', 'Qua ssh -D 1080, "curl --socks5 127.0.0.1:1080 http://phim.test/" hỏng ở trường còn "--socks5-hostname" chạy. Vì sao?'),
        options: o([['The proxy is down', 'Proxy đã tắt'], ['SOCKS cannot carry HTTP', 'SOCKS không chở được HTTP'], ['--socks5 resolves the name on the laptop through the school DNS (blocked); -hostname lets the VPS resolve it', '--socks5 phân giải tên trên laptop qua DNS trường (bị chặn); -hostname để VPS phân giải'], ['phim.test has no IP', 'phim.test không có IP']]),
        correctIndex: 2, points: 1,
        explanation: ex('With plain socks5 the client resolves — a DNS leak to the local resolver, which says NXDOMAIN (curl 8.18 even calls it "Could not resolve proxy"). socks5h sends the name to the proxy.', 'Với socks5 trơn, máy khách phân giải — rò DNS ra máy phân giải tại chỗ, vốn trả NXDOMAIN (curl 8.18 còn ghi là "Could not resolve proxy"). socks5h gửi cái tên sang proxy.'),
      },
      {
        question: q('Your WireGuard VPN works in the dorm. At school: no handshake, "0 B received". What is the most likely cause and the fix?', 'VPN WireGuard chạy ở ký túc xá. Ở trường: không bắt tay, "0 B received". Nguyên nhân khả năng cao và cách sửa?'),
        options: o([['Wrong keys — regenerate', 'Sai khoá — tạo lại'], ['MTU too big', 'MTU quá lớn'], ['DNS leak', 'Rò DNS'], ['The school drops UDP; use a VPN over TCP 443 (or a mesh with HTTPS relays)', 'Trường bỏ UDP; dùng VPN qua TCP 443 (hoặc mạng lưới có trạm chuyển tiếp HTTPS)']]),
        correctIndex: 3, points: 1,
        explanation: ex('The same keys work in the dorm, so they are fine; MTU problems still show a handshake; a DNS leak does not stop the tunnel. WireGuard only speaks UDP, and the school\'s "drop all UDP" counter rises.', 'Cùng khoá đó chạy ở ký túc xá nên khoá ổn; lỗi MTU vẫn có bắt tay; rò DNS không làm hầm chết. WireGuard chỉ nói UDP, và bộ đếm "bỏ mọi UDP" của trường tăng.'),
      },
      {
        question: q('Your OpenVPN tunnel is up, sites see the VPS, yet the school logs every name you visit. Why?', 'Đường hầm OpenVPN đã mở, các trang thấy VPS, vậy mà trường vẫn ghi mọi tên bạn vào. Vì sao?'),
        options: o([['OpenVPN does not encrypt names', 'OpenVPN không mã hoá tên'], ['DNS still goes to the school resolver on the local network — a more specific route than the tunnel', 'DNS vẫn tới máy phân giải của trường trên mạng tại chỗ — tuyến cụ thể hơn đường hầm'], ['SNI leaks through the tunnel', 'SNI lọt qua đường hầm'], ['The school decrypts TLS', 'Trường giải mã TLS']]),
        correctIndex: 1, points: 1,
        explanation: ex('Measured: resolv.conf still pointed at 10.20.2.1 on the Wi-Fi subnet, so 7 queries left outside the tunnel. Using the VPN\'s DNS fixed it. SNI is inside the tunnel; there was no TLS interception.', 'Đã đo: resolv.conf vẫn trỏ 10.20.2.1 thuộc mạng Wi-Fi, nên 7 câu hỏi đi ra ngoài hầm. Dùng DNS của VPN là vá được. SNI nằm trong hầm; không có chặn giải mã TLS.'),
      },
      {
        question: q('Your router\'s WAN is 100.64.0.2; "what is my IP" shows 198.18.0.40. You forward port 8080. From outside: refused / timeout. Why?', 'WAN của router là 100.64.0.2; "what is my IP" báo 198.18.0.40. Bạn mở cổng 8080. Từ ngoài: bị từ chối / hết giờ. Vì sao?'),
        options: o([['The forward rule is wrong', 'Luật mở cổng sai'], ['Port 8080 is reserved', 'Cổng 8080 bị cấm'], ['CGNAT: the ISP NATs you again and has no rule for 8080 — tunnel out instead', 'CGNAT: nhà mạng NAT bạn thêm lần nữa và không có luật cho 8080 — hãy đào hầm đi ra'], ['UPnP is off', 'UPnP đang tắt']]),
        correctIndex: 2, points: 1,
        explanation: ex('100.64.0.0/10 is carrier-grade NAT. In the lab the same forward worked from inside the ISP network, so the rule is right; the ISP\'s gate is missing. UPnP also fails under CGNAT.', '100.64.0.0/10 là NAT cấp nhà mạng. Trong lab, cùng luật đó chạy khi đứng trong mạng nhà mạng, nên luật đúng; thiếu cánh cổng của nhà mạng. UPnP cũng hỏng dưới CGNAT.'),
      },
      {
        question: q('A stranger joins your open laptop hotspot at school and downloads something illegal. Whose account does the school log?', 'Một người lạ vào điểm phát mở trên laptop của bạn ở trường và tải thứ phạm pháp. Trường ghi tài khoản của ai?'),
        options: o([['Yours — after NAT their traffic carries your laptop\'s IP and MAC', 'Của bạn — sau NAT lưu lượng của họ mang IP và MAC của laptop bạn'], ['Theirs', 'Của họ'], ['Nobody\'s', 'Không của ai'], ['The school cannot see it', 'Trường không thấy']]),
        correctIndex: 0, points: 1,
        explanation: ex('The controller binds accounts to MACs; everything behind your NAT leaves with your MAC. Lock the hotspot with WPA2/WPA3 and a long passphrase, and turn it off after use.', 'Bộ điều khiển gắn tài khoản với MAC; mọi thứ sau NAT của bạn đi ra bằng MAC của bạn. Khoá điểm phát bằng WPA2/WPA3 và mật khẩu dài, tắt khi xong việc.'),
      },
    ],
  },
};
