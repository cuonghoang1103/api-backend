/** NWC204 · 9.1 — Basic router configuration: initial settings, SSH, interfaces, default gateway (Chương 9, buổi 26–27). */
import { doiDau, KHOA, tinh, q, ord, bang1, tn, cs, js, mt, bi, S } from './_nw.mjs';

const E1 = cs({
  ten: 'Router 1 — Initial settings that bite later', kho: 'EASY', phut: 8,
  en: 'Lesson 9.1: modes, passwords, and the commands whose absence you only discover after a power cut or an audit.',
  vi: 'Bài 9.1: chế độ, mật khẩu, và những lệnh mà thiếu chúng thì chỉ phát hiện ra sau một lần mất điện hoặc một lần kiểm toán.',
  cau: [
    q('c1', ['"ip address 192.168.1.1 255.255.255.0" is rejected at R1(config)#. Why?', '"ip address 192.168.1.1 255.255.255.0" bị từ chối ở R1(config)#. Vì sao?'], ['Wrong mode: it belongs under interface g0/0', 'The mask is missing its fourth octet', 'Routers accept addresses only in CIDR form', 'The address is already used by the switch'], ['The command is correct; the prompt is not. Reading the prompt before re-reading the syntax finds this in one second.', 'Câu lệnh đúng; dấu nhắc thì không. Đọc dấu nhắc trước khi đọc lại cú pháp là tìm ra trong một giây.']),
    q('c2', ['Both "enable password cisco" and "enable secret class" are configured. What do you type at the Password: prompt after enable?', 'Có cả "enable password cisco" lẫn "enable secret class". Sau enable, ở lời hỏi Password: bạn gõ gì?'], ['class — enable secret takes precedence and the other line is ignored', 'cisco — the older command wins', 'Either one works', 'Neither: the conflict disables privileged EXEC'], ['When both exist, enable secret wins. Remove the decoy with no enable password: it misleads every reader and is a finding in any audit.', 'Khi có cả hai, enable secret thắng. Gỡ dòng mồi nhử bằng no enable password: nó đánh lừa mọi người đọc và là một phát hiện trong mọi lần kiểm toán.']),
    q('c3', ['You must test a risky change on a remote router and could lock yourself out. Which single command turns a permanent lockout into a short outage?', 'Bạn phải thử một thay đổi rủi ro trên router ở xa và có thể tự khoá mình ngoài. Lệnh nào biến một lần khoá vĩnh viễn thành một sự cố ngắn?'], ['reload in 10 — then reload cancel once you are sure you still have access', 'copy running-config startup-config before the change', 'service password-encryption', 'exec-timeout 10'], ['reload in 10 schedules a reboot to the last saved configuration. If you lock yourself out, the router comes back by itself in ten minutes; if not, reload cancel. Do not save until the change is proven.', 'reload in 10 hẹn khởi động lại về cấu hình đã lưu gần nhất. Lỡ khoá mình ngoài thì mười phút sau router tự quay lại; không sao thì reload cancel. Đừng lưu cho tới khi thay đổi đã được chứng minh.']),
    q('c4', ['show ip ssh reports "SSH Disabled". Which prerequisite do you check FIRST?', 'show ip ssh báo "SSH Disabled". Điều kiện nào kiểm TRƯỚC TIÊN?'], ['Whether an RSA key exists (show crypto key mypubkey rsa)', 'Whether the banner motd is set', 'Whether service password-encryption is on', 'Whether the console line has logging synchronous'], ['SSH turns on when a key exists, so a missing key is the usual reason. And the key itself can only be generated after a non-default hostname and an ip domain-name exist — it is named after the full domain name.', 'SSH bật khi có khoá, nên thiếu khoá là lý do thường gặp nhất. Mà khoá chỉ sinh được sau khi đã có hostname khác mặc định và ip domain-name — khoá được đặt tên theo tên miền đầy đủ.']),
    q('c5', ['transport input ssh is set on the vty lines, but they still say plain "login". What happens when you SSH in?', 'Các dòng vty đã có transport input ssh nhưng vẫn ghi "login" trơn. Khi SSH vào thì sao?'], ['It fails: SSH needs login local and a username', 'It works: SSH reuses the vty line password', 'The router silently falls back to Telnet', 'SSH uses the console password instead'], ['SSH authenticates a user. login local makes the vty lines use the username database; plain login uses only the line password.', 'SSH xác thực một người dùng. login local khiến dòng vty dùng cơ sở dữ liệu tên người dùng; login trơn chỉ dùng mật khẩu của dòng.']),
  ],
  goiY: ['When a correct command is refused, read the prompt.', 'Never save a risky change before it is proven.'],
  loi: ['Leaving enable password next to enable secret.', 'Testing an access restriction over the only session you have.'],
  tn: [tn('enable secret', 'mật khẩu đặc quyền (băm)'), tn('login local', 'xác thực bằng tài khoản cục bộ')], kn: ['initial router configuration'],
});

const E2 = tinh({
  tieuDe: 'Router 2 — Turn SSH on, in the order IOS accepts', doKho: 'MEDIUM', phut: 8,
  moTa: mt('Put these configuration steps in an order where every command is accepted the first time and nobody is locked out.', 'Xếp các bước cấu hình theo thứ tự mà lệnh nào cũng được chấp nhận ngay lần đầu và không ai bị khoá ngoài.'),
  loai: 'order',
  cauHoi: [ord('q1', ['Enabling SSH on a new router', 'Bật SSH trên một router mới'], ['hostname R1', 'ip domain-name lab.local', 'crypto key generate rsa modulus 2048', 'ip ssh version 2', 'username admin secret (a strong password)', 'line vty 0 4 → login local', 'transport input ssh (still under line vty)'], ['The key is named after R1.lab.local, so hostname and domain come first; version 2 needs an existing key; the user must exist BEFORE login local, otherwise the next login has no account to check against.', 'Khoá được đặt tên theo R1.lab.local nên hostname và domain phải có trước; version 2 cần khoá đã tồn tại; tài khoản phải có TRƯỚC login local, không thì lần đăng nhập sau chẳng có tài khoản nào để đối chiếu.'])],
  goiY: ['What is the key named after?', 'Create the account before you tell the lines to use accounts.'],
  loiHayGap: ['Generating the key before setting the domain name, then retyping a correct command.', 'Typing login local before any username exists and locking the next session out.'],
  thuatNgu: [tn('RSA key', 'khoá RSA'), tn('FQDN', 'tên miền đầy đủ')], khaiNiem: ['SSH configuration'],
});

const E3 = tinh({
  tieuDe: 'Router 3 — Symptom to cause to fix', doKho: 'MEDIUM', phut: 12,
  moTa: mt('Lesson 9.2: about five distinct ways to get an interface wrong, each with a recognisable symptom. Match each symptom to the layer and the fix.', 'Bài 9.2: khoảng năm cách cấu hình sai một interface, mỗi cách một triệu chứng nhận ra được. Ghép mỗi triệu chứng với tầng và cách sửa.'),
  loai: 'table',
  bang: [bang1('b1', ['Router interface symptoms', 'Triệu chứng interface của router'], [{ ma: 's', ten: 'Symptom' }, { ma: 'f', ten: 'Fix', luaChon: ['no shutdown', 'check cable, port, far device', 'clock rate on the DCE end / match encapsulation', 'put the address on the right interface', 'ip route 0.0.0.0 0.0.0.0 NEXT-HOP'] }], [
    { o: { s: 'G0/0/0 administratively down / down, everything else perfect' }, a: { f: 'no shutdown' } },
    { o: { s: 'G0/0/1 down / down' }, a: { f: 'check cable, port, far device' } },
    { o: { s: 'Serial0/1/0 up / down, survives every cable swap' }, a: { f: 'clock rate on the DCE end / match encapsulation' } },
    { o: { s: 'G0/0/0 up / up with an address in show ip interface brief, but no C route for it' }, a: { f: 'put the address on the right interface' } },
    { o: { s: '"ip default-gateway 10.0.0.1" typed on the router; traffic still goes nowhere' }, a: { f: 'ip route 0.0.0.0 0.0.0.0 NEXT-HOP' } },
  ], ['Work top to bottom: admin down is a decision, down/down is layer 1, up/down is layer 2, and up/up without a connected route means the address landed on another interface (show run interface settles it). ip default-gateway is for devices that do not route; a router needs a default route, and IOS accepts the wrong command silently.', 'Đi từ trên xuống: admin down là một quyết định, down/down là tầng 1, up/down là tầng 2, còn up/up mà không có tuyến connected nghĩa là địa chỉ rơi vào interface khác (show run interface xử xong). ip default-gateway dành cho thiết bị không định tuyến; router cần default route, và IOS chấp nhận lệnh sai đó mà không báo gì.'])],
  goiY: ['Read Status, then Protocol, then show ip route connected.', 'A router is not an end device — it does not use ip default-gateway.'],
  loiHayGap: ['Replacing the cable when Status already says up.', 'Setting clock rate on the DTE end.'],
  thuatNgu: [tn('DCE', 'đầu cấp xung nhịp'), tn('connected route', 'tuyến nối trực tiếp')], khaiNiem: ['interface troubleshooting'],
});

const E4 = js({
  ten: 'Router 4 — Write sshMissing(dev): what stops SSH from working', kho: 'HARD', phut: 20,
  en: `<p>Write <code>sshMissing(dev)</code> that lists, <b>in this order</b>, everything that still prevents a proper SSH setup on an IOS device described by:</p>
<pre>{ hostname, domain, rsaBits, sshVersion, users: [...], vtyLogin: 'local' | 'line' | null, vtyTransport: 'ssh' | 'all' | 'telnet' | null }</pre>
<ol>
<li><code>"hostname"</code> — hostname is empty, <code>"Router"</code> or <code>"Switch"</code> (the defaults).</li>
<li><code>"domain-name"</code> — no <code>ip domain-name</code>.</li>
<li><code>"rsa-key"</code> — no key (<code>rsaBits</code> is 0 or missing); otherwise <code>"rsa-key-weak"</code> if it is shorter than 2048 bits — 512 is still accepted by IOS and worthless.</li>
<li><code>"ssh-version-2"</code> — <code>sshVersion</code> is not 2.</li>
<li><code>"username"</code> — no local user.</li>
<li><code>"login-local"</code> — the vty lines do not use <code>login local</code>.</li>
<li><code>"transport-ssh"</code> — the vty lines do not say exactly <code>transport input ssh</code>.</li>
</ol>
<p>A fully correct device returns <code>[]</code>.</p>`,
  vi: `<p>Viết <code>sshMissing(dev)</code> liệt kê, <b>theo đúng thứ tự này</b>, mọi thứ còn ngăn một cấu hình SSH đúng chuẩn trên thiết bị IOS được mô tả bởi:</p>
<pre>{ hostname, domain, rsaBits, sshVersion, users: [...], vtyLogin: 'local' | 'line' | null, vtyTransport: 'ssh' | 'all' | 'telnet' | null }</pre>
<ol>
<li><code>"hostname"</code> — hostname rỗng, là <code>"Router"</code> hoặc <code>"Switch"</code> (giá trị mặc định).</li>
<li><code>"domain-name"</code> — chưa có <code>ip domain-name</code>.</li>
<li><code>"rsa-key"</code> — chưa có khoá (<code>rsaBits</code> bằng 0 hoặc vắng); nếu có mà ngắn hơn 2048 bit thì <code>"rsa-key-weak"</code> — 512 bit IOS vẫn nhận và vô giá trị.</li>
<li><code>"ssh-version-2"</code> — <code>sshVersion</code> khác 2.</li>
<li><code>"username"</code> — chưa có tài khoản cục bộ nào.</li>
<li><code>"login-local"</code> — dòng vty không dùng <code>login local</code>.</li>
<li><code>"transport-ssh"</code> — dòng vty không ghi đúng <code>transport input ssh</code>.</li>
</ol>
<p>Thiết bị cấu hình đúng hoàn toàn trả <code>[]</code>.</p>`,
  fn: 'sshMissing', params: 'dev', ref: S.sshMissing,
  cases: [
    [{ hostname: 'Router', domain: null, rsaBits: 0, sshVersion: 1, users: [], vtyLogin: 'line', vtyTransport: 'all' }],
    [{ hostname: 'R1', domain: 'lab.local', rsaBits: 2048, sshVersion: 2, users: ['admin'], vtyLogin: 'local', vtyTransport: 'ssh' }],
    [{ hostname: 'R1', domain: 'lab.local', rsaBits: 512, sshVersion: 2, users: ['admin'], vtyLogin: 'local', vtyTransport: 'all' }],
    [{ hostname: 'Switch', domain: 'corp.example', rsaBits: 4096, sshVersion: 2, users: ['netops'], vtyLogin: null, vtyTransport: 'ssh' }],
    [{ hostname: 'R2', domain: 'lab.local', rsaBits: 1024, sshVersion: 1, users: ['a', 'b'], vtyLogin: 'line', vtyTransport: 'telnet' }],
    [{ hostname: '', domain: '', sshVersion: 2, users: ['admin'], vtyLogin: 'local', vtyTransport: null }],
    [{ hostname: 'EDGE-R1', domain: 'branch.lab', rsaBits: 2048, sshVersion: 2, users: [], vtyLogin: 'local', vtyTransport: 'ssh' }],
  ],
  goiY: ['Seven independent checks; push in the fixed order.', 'rsa-key and rsa-key-weak are exclusive: one or the other, never both.'],
  loi: ['Treating "all" as fine because it includes ssh — it also accepts Telnet.', 'Reporting rsa-key-weak for a device with no key at all.'],
  gt: ['Each missing piece produces its own confusing error on a real device, which is why a checklist in a fixed order beats retyping commands. The order also follows the dependency chain: no name and no domain means no key, and no user means login local locks everybody out.', 'Mỗi mảnh còn thiếu gây ra một lỗi khó hiểu riêng trên thiết bị thật, nên một danh sách kiểm theo thứ tự cố định thắng việc gõ lại lệnh. Thứ tự đó cũng đi theo chuỗi phụ thuộc: không tên và không domain thì không có khoá, không có tài khoản thì login local khoá mọi người ở ngoài.'],
  kn: ['SSH prerequisites'],
});

const E5 = cs({
  ten: 'Router 5 — The same job on Linux (★)', kho: 'HARD', phut: 10,
  en: 'The ★ sections of Lessons 9.1–9.2: the Linux equivalents, and the places where "it returned 0" does not mean "it took effect".',
  vi: 'Các phần ★ của bài 9.1–9.2: lệnh tương đương trên Linux, và những chỗ "lệnh trả về 0" không có nghĩa là "đã có hiệu lực".',
  cau: [
    q('c1', ['The Linux equivalent of "ip address 10.0.0.5 255.255.255.0" + "no shutdown" + a default gateway 10.0.0.1 is …', 'Lệnh Linux tương đương "ip address 10.0.0.5 255.255.255.0" + "no shutdown" + gateway mặc định 10.0.0.1 là …'], ['ip addr add 10.0.0.5/24 dev eth0; ip link set eth0 up; ip route add default via 10.0.0.1', 'ifconfig eth0 10.0.0.5; ip link enable eth0; route gateway 10.0.0.1', 'ip address set eth0 10.0.0.5/24 up; ip default-gateway 10.0.0.1', 'netplan apply 10.0.0.5/24 gw 10.0.0.1'], ['All three are temporary, like running-config. The permanent version goes in netplan or NetworkManager — Linux\'s copy run start.', 'Cả ba đều tạm thời, giống running-config. Bản vĩnh viễn nằm trong netplan hoặc NetworkManager — chính là copy run start của Linux.']),
    q('c2', ['ip -br link shows eth1 as UP but without LOWER_UP. What does that mean?', 'ip -br link cho thấy eth1 là UP nhưng không có LOWER_UP. Nghĩa là gì?'], ['Enabled, but no carrier: nothing is connected', 'The interface is fully up and passing traffic', 'The interface is up but has no IP address', 'The interface is administratively shut down'], ['LOWER_UP is the true equivalent of Cisco\'s Status column: the physical carrier is present. UP alone is just the administrative state.', 'LOWER_UP mới là thứ tương đương cột Status của Cisco: có tín hiệu vật lý. Chỉ UP là trạng thái do quản trị đặt.']),
    q('c3', ['You write PasswordAuthentication no into /etc/ssh/sshd_config.d/70-hardening.conf; sshd -t passes and reload returns 0, yet passwords still work. Why?', 'Bạn ghi PasswordAuthentication no vào /etc/ssh/sshd_config.d/70-hardening.conf; sshd -t qua, reload trả 0, mà mật khẩu vẫn dùng được. Vì sao?'], ['An earlier-sorting drop-in set it, and the first value wins', 'reload never re-reads the files in sshd_config.d', 'PasswordAuthentication applies only to the root user', 'The new setting only applies after a full reboot'], ['sshd_config uses the first value obtained, and the drop-in glob is read in alphabetical order. Name the file 01-…, and verify with sshd -T — what is in effect — not with cat of the file you just wrote.', 'sshd_config lấy giá trị đọc được ĐẦU TIÊN, và các tệp drop-in được đọc theo thứ tự chữ cái. Đặt tên tệp 01-…, rồi nghiệm thu bằng sshd -T — thứ đang có hiệu lực — chứ không bằng cat tệp vừa ghi.']),
    q('c4', ['cat /proc/sys/net/ipv4/ip_forward prints 1 on a laptop you never configured as a router. Most common reason?', 'cat /proc/sys/net/ipv4/ip_forward in ra 1 trên một laptop bạn chưa từng cấu hình làm router. Lý do hay gặp nhất?'], ['Docker turned it on to route traffic for its containers', 'The kernel enables forwarding whenever Wi-Fi is on', 'It means the laptop has two IP addresses', 'It is the default on every Linux distribution'], ['ip_forward = 1 makes the machine forward packets between interfaces — a router. Docker enables it so containers can reach the outside, which is worth knowing when you wonder why a laptop routes.', 'ip_forward = 1 khiến máy chuyển gói giữa các interface — tức là một router. Docker bật nó để container ra được bên ngoài, điều đáng biết khi bạn thắc mắc vì sao laptop lại định tuyến.']),
    q('c5', ['"I configured it and tested it, it definitely works." What one question do you ask?', '"Tôi cấu hình rồi, thử rồi, chắc chắn chạy." Bạn hỏi đúng một câu gì?'], ['Did you save it — will it survive a reboot?', 'Which IOS version is it?', 'Did you use the AI assistant?', 'How long did the ping take?'], ['Testing proves the running configuration and says nothing about the startup configuration. The gap is discovered at the worst moment: a power cut or an unattended restart at 3 a.m.', 'Thử chỉ chứng minh cấu hình đang chạy, không nói gì về cấu hình khởi động. Khoảng hở đó lộ ra vào lúc tệ nhất: mất điện, hoặc một lần khởi động lại không người trông lúc 3 giờ sáng.']),
  ],
  goiY: ['Temporary versus permanent is the same split on IOS and Linux.', 'Verify what is in effect, not what you wrote.'],
  loi: ['Calling a Linux change done after ip addr add.', 'Checking a config file instead of the running daemon\'s effective settings.'],
  tn: [tn('carrier', 'tín hiệu sóng mang'), tn('drop-in file', 'tệp cấu hình bổ sung')], kn: ['Linux networking'],
});

export default doiDau({ slug: 'nwc204-9-1-router-initial-config', ten: '9.1 Basic router configuration: SSH, interfaces, default gateway', khoa: KHOA, baiHoc: 'nwc204-9-1-cau-hinh-khoi-dau-router', de: [E1, E2, E3, E4, E5] });
