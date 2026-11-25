/**
 * 11.6 — Log VPN (soạn 24/11/2026, agent lgz).
 * Output thật: OUT['s11/vpn'] — WireGuard (wireguard-tools 1.0.20210914, nhân 6.8) lab7 ⇄ android-7f3a, keodo dùng khoá không được khai báo; dynamic debug
 * của module wireguard; OpenVPN 2.6.19 (openvpn-server@lab, PKI easy-rsa, chứng chỉ keodo đã thu hồi + crl-verify, status-version 2); Windows Server 2025
 * Add-VpnConnection SSTP + rasdial tới máy không có máy chủ SSTP ⇒ RasClient 20221/20222/20227, mã -2147014836 = 0x8007274C (WSAETIMEDOUT 10060).
 * dmesg gom dòng của hai lượt chạy (peer 3/4, keypair 4/6) — số peer tăng mỗi lần wg-quick up. Nguồn sự cố: Colonial Pipeline 5/2021 (lời khai CEO trước
 * Thượng viện Mỹ 8/6/2021: tài khoản VPN cũ, không MFA, mật khẩu bị lộ) — trang Wikipedia tổng hợp + tên phiên điều trần.
 */
import { lenh, ma, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: 'VPN logs: WireGuard handshakes, OpenVPN status and log, Windows RasClient events — who connected when|||Log VPN: handshake của WireGuard, status và log của OpenVPN, sự kiện RasClient của Windows — ai kết nối lúc nào',
  slug: 'log-11-6-vpn',
  type: 'LESSON',
  isFreePreview: true,
  description: 'VPN là cửa chính vào mạng công ty, nên "ai đã vào lúc nào" là câu hỏi đầu tiên của mọi cuộc điều tra. Chạy thật: WireGuard gần như im lặng — chỉ có wg show (latest handshake, transfer, endpoint) và dòng debug khi tự bật dynamic debug, thấy cả khoá lạ "Invalid handshake initiation"; OpenVPN ghi đủ (VERIFY OK, Peer Connection Initiated, IP ảo được cấp, chứng chỉ đã thu hồi bị từ chối) và có tệp status liệt kê ai đang kết nối; Windows ghi RasClient 20221/20222/20227 với mã lỗi cần giải. Góc hacker: Colonial Pipeline 2021 vào bằng một tài khoản VPN cũ không có MFA.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.6</span>
<h2>VPN logs: the front door of the company network</h2>
<p class="lead">For remote workers, outsourcing teams and attackers alike, the VPN is the way into the internal network. When something goes wrong, the first questions are always: which account connected, from which public IP, at what time, for how long, and which internal address did it get? Different VPNs answer those questions very differently — WireGuard almost not at all, OpenVPN in detail, Windows in the Application log. This lesson runs all three for real.</p>

<h3>The everyday picture: a staff entrance with a key card</h3>
<p>The building's staff entrance opens for any valid card. The card system logs "card #1234 entered at 07:58". A lost card that was never deactivated still opens the door, and the log faithfully records the thief as "employee #1234". VPN logs are the same: they prove which credential was used, not which human used it.</p>

<h3>Part 1 — WireGuard: designed to be quiet</h3>
${lenh('s11/vpn', 0)}
${lenh('s11/vpn', 1)}
${lenh('s11/vpn', 2)}
${lenh('s11/vpn', 3)}
${lenh('s11/vpn', 4)}
<p>WireGuard has no usernames: a <strong>peer</strong> is a public key. <code>wg show</code> is the only "log" by default: the peer's current <strong>endpoint</strong> (the public IP:port it last came from — it can roam), <strong>latest handshake</strong> (a new handshake happens at least every 2 minutes while traffic flows) and <strong>transfer</strong> counters. <code>wg show wg0 latest-handshakes</code> gives the epoch time; a value of 0 (shown as 1970 if you convert it) means "never". Note the private key was masked before printing the config — never paste it into a ticket or a chat.</p>
${lenh('s11/vpn', 5)}
<p>The kernel logged only that the module loaded. Nothing about who connected. For an investigation you turn on the module's <strong>dynamic debug</strong> (kernel debugfs, root only) for a while:</p>
${lenh('s11/vpn', 6)}
${lenh('s11/vpn', 7)}
${lenh('s11/vpn', 8)}
${lenh('s11/vpn', 9)}
<p>Now the kernel tells the story: <strong>"Invalid handshake initiation from 192.168.56.66"</strong> — someone with a key this server does not know (keodo) tried; WireGuard silently ignores it (the stranger's ping got 100% loss and no reply at all, so a scanner cannot even tell a WireGuard server is there). Then "Receiving handshake initiation from peer N (192.168.56.142:port)", "Sending handshake response", "Keypair created" — a legitimate peer connected. "peer 3/peer 4" are internal indices that grow each time the interface is recreated (this capture spans two runs of the lab). Turn debug off afterwards. Without debug, the practical way to keep a history is to sample <code>wg show … dump</code> every minute into a log (a cron/systemd timer, or the Prometheus WireGuard exporter) — or use a WireGuard-based product that adds logging (e.g. a management layer).</p>
${lenh('s11/vpn', 10)}
${lenh('s11/vpn', 11)}
<p>After the client disconnected, nothing announces it: the handshake simply gets older (41 seconds ago, then minutes, hours). "Disconnected" in WireGuard means "no handshake for more than about 3 minutes".</p>

<h3>Part 2 — OpenVPN: certificates, a status file and a proper log</h3>
${lenh('s11/vpn', 12)}
${lenh('s11/vpn', 13)}
${lenh('s11/vpn', 14)}
${lenh('s11/vpn', 15)}
<p>The server (verb 3, logging to the journal via the systemd unit) records each step for each client <code>IP:port</code>: <strong>VERIFY OK</strong> for the CA and the client certificate (CN=android), <strong>Peer Connection Initiated</strong> — the moment of connection, and <strong>MULTI_sva: pool returned IPv4=10.8.0.6</strong> — the internal address assigned. Keep that last line: internal logs (Chapter 10 web logs, file servers) will show 10.8.0.6, and only this line maps it back to "android, from 192.168.56.142". The revoked certificate (an employee who left) is refused: <strong>VERIFY ERROR … certificate revoked: CN=keodo</strong>, then TLS handshake failed. And the client side? keodo's own log shows only a timeout and SIGTERM: the reason lives on the server only.</p>
${lenh('s11/vpn', 16)}
<p>The <strong>status file</strong> (rewritten every 10 s here) is the "who is connected right now" table: common name, real address, virtual address, bytes in/out, connected since (also as epoch), cipher. It is not a history — it is overwritten. For history: the log lines above, or the <code>client-connect</code>/<code>client-disconnect</code> scripts that receive the same values and can write them to a database.</p>
${lenh('s11/vpn', 17)}
${lenh('s11/vpn', 18)}
<p>With <code>explicit-exit-notify</code> the client says goodbye and the server logs it ("exit message received by peer", "Delayed exit in 5 seconds"). Without it (or when the network drops), the server notices only after the keepalive timeout (60 s here) with "Inactivity timeout". So the "disconnected at" time in OpenVPN logs can be late by up to the keepalive timeout.</p>

<h3>Part 3 — the Windows built-in VPN client: RasClient</h3>
${lenh('s11/vpn', 19)}
${lenh('s11/vpn', 20)}
${lenh('s11/vpn', 21)}
<p>Every dial by the Windows VPN client (IKEv2, SSTP, L2TP, PPTP) writes events of source <strong>RasClient</strong> into the <em>Application</em> log, tied together by a <strong>CoId</strong> (connection id): <strong>20221</strong> dialling started (with profile name, user and strategy), <strong>20222</strong> trying to establish a link (server address, device "WAN Miniport (SSTP)"), then <strong>20227</strong> failed with an error code — or <strong>20225</strong> when the connection succeeds (and 20226 when it ends). Error codes come in two forms: the classic RAS numbers (691 bad credentials, 789/809 IPsec/NAT issues, 800 tunnel could not be built) and HRESULTs like <code>-2147014836</code>: as unsigned hex that is 0x8007274C, the Win32 error 0x274C = 10060, WSAETIMEDOUT — "the server did not answer", here because nothing runs SSTP on lab7 and ufw drops 443. <code>rasdial</code> printed the same text. Note "The user SYSTEM": the dial was started from our SSH session as a service; a normal user dial shows the domain\\user.</p>

<h3>🛡️ Attacker's corner: Colonial Pipeline (May 2021)</h3>
<p>The ransomware attack that shut down the largest fuel pipeline on the US East Coast began, according to the company's CEO testifying to the US Senate on 8 June 2021, with a <strong>legacy VPN account</strong> that was no longer in use, protected only by a password (no multi-factor authentication) — a password that had appeared in a leak. The VPN log recorded a valid login. What would have caught it: an inventory of VPN accounts vs active employees (the revocation you just saw), MFA, and alerts on logins from unusual source IPs/countries/times for accounts that have been silent (Chapter 14: unusual logins). In ATT&amp;CK: T1133 External Remote Services, T1078 Valid Accounts.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"How do you know who was connected to the VPN at 02:00 last night?" — VPN server log (connect/disconnect, assigned IP) or accounting (RADIUS); WireGuard needs sampling of handshakes.</li>
<li>"A suspicious request came from 10.8.0.6 in the app log. Who is that?" — map virtual IP → user via the VPN log at that time.</li>
<li>"WireGuard shows 'latest handshake: 5 minutes ago'. Is the client connected?" — probably not (handshakes renew within ~2 min when active).</li>
<li>"How do you remove VPN access of someone who left?" — revoke the certificate/key (CRL, remove peer), disable the account; verify the refusal in the log.</li>
</ul>

<h3>Real-world situations</h3>
<ul>
<li><strong>Outsourcing projects</strong> often require connecting to the customer's VPN (FortiClient, GlobalProtect, Cisco AnyConnect, OpenVPN). When it fails, collect the client log and the exact time before writing to the customer's IT; they will search their VPN gateway log for your username at that time.</li>
<li><strong>Your own lab VPN</strong> (WireGuard on a VPS to reach home): add a timer that writes <code>wg show wg0 dump</code> to a log every minute, so "was my phone connected last night?" has an answer.</li>
</ul>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok"><ol>
<li>From the status file above: who is connected, from where, since when, and how many bytes have they sent?</li>
<li>Write the <code>journalctl</code> + <code>grep</code> command that lists every refused certificate in the last 24 hours with its CN.</li>
<li>Convert the RasClient error <code>-2147014836</code> to hex in PowerShell and name the Win32 error.</li>
<li>Design a one-line log format for WireGuard sampling (one line per peer per minute) that answers "who was connected when".</li>
</ol>
<p><strong>Pass:</strong> (1) CN android, real address 192.168.56.142:39083, virtual 10.8.0.6, since 12:29:26, received by the server 3256 bytes (= sent by the client); (2) <code>journalctl -u openvpn-server@lab --since -24h | grep "VERIFY ERROR" | grep -o "CN=[^,]*"</code>; (3) <code>'{0:X}' -f (-2147014836 -band 0xFFFFFFFF)</code> → 8007274C → 0x274C = 10060 = WSAETIMEDOUT (connection timed out); (4) e.g. <code>time=… iface=wg0 peer=&lt;first 10 chars of key&gt; endpoint=IP:port latest_handshake=epoch rx=… tx=…</code> — compute "connected" as now − latest_handshake &lt; 180 s.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Peer / endpoint', 'WireGuard: a public key / its current public IP:port.'],
  ['Latest handshake', 'Last key exchange; renewed every ~2 minutes while active.'],
  ['Dynamic debug', 'Kernel switch to enable a module’s debug messages at runtime.'],
  ['Common Name (CN)', 'Name in the client certificate; the OpenVPN "username".'],
  ['CRL / revoked', 'Certificate revocation list; a revoked cert fails VERIFY.'],
  ['Status file', 'OpenVPN table of current clients, rewritten periodically.'],
  ['RasClient 20221/20222/20225/20226/20227', 'Windows VPN client: dial, link, connected, ended, failed.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>The key VPN log fields: identity, real IP, virtual IP, connect and disconnect time.</li>
<li>WireGuard: wg show + optional dynamic debug; sample it if you need history.</li>
<li>OpenVPN: VERIFY, Peer Connection Initiated, pool returned; status file for "now".</li>
<li>Windows: Application log, source RasClient, events tied by CoId; decode HRESULTs.</li>
<li>A valid VPN login can still be an attacker: inventory, MFA, unusual-login alerts.</li>
</ul>
${nguon('📘', 'WireGuard — Quick start', 'wg, wg-quick, peers, handshakes', 'https://www.wireguard.com/quickstart/')}
${nguon('📘', 'OpenVPN 2.6 reference manual', '--status, --verb, --crl-verify, --explicit-exit-notify, client-connect', 'https://openvpn.net/community-resources/reference-manual-for-openvpn-2-6/')}
${nguon('🛡️', 'Colonial Pipeline ransomware attack (summary with sources)', 'Legacy VPN account without MFA, password leaked (CEO testimony, 8 Jun 2021)', 'https://en.wikipedia.org/wiki/Colonial_Pipeline_ransomware_attack')}
${nguon('🛡️', 'MITRE ATT&CK T1133 — External Remote Services', 'VPN as initial access; see also T1078 Valid Accounts', 'https://attack.mitre.org/techniques/T1133/')}
${lienKet({ khoa: 'network-security', bai: 'netsec-5-2-wireguard', title: 'Network Security 5.2 — WireGuard in depth', sub: 'Keys, peers, AllowedIPs (setting it up lives there)', cta: 'Open' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.6</span>
<h2>Log VPN: cửa chính vào mạng công ty</h2>
<p class="lead">Với người làm từ xa, đội outsourcing lẫn kẻ tấn công, VPN là đường vào mạng nội bộ. Khi có chuyện, câu hỏi đầu tiên bao giờ cũng là: tài khoản nào đã kết nối, từ IP công khai nào, lúc mấy giờ, trong bao lâu, và được cấp địa chỉ nội bộ nào? Mỗi loại VPN trả lời rất khác nhau — WireGuard gần như không trả lời, OpenVPN trả lời chi tiết, Windows trả lời trong Application log. Bài này chạy thật cả ba.</p>

<h3>Liên tưởng đời thường: cửa nhân viên quẹt thẻ</h3>
<p>Cửa dành cho nhân viên mở với mọi thẻ hợp lệ. Hệ thống thẻ ghi "thẻ số 1234 vào lúc 07:58". Một chiếc thẻ bị mất mà chưa khoá vẫn mở được cửa, và log ghi rất trung thực tên kẻ trộm là "nhân viên số 1234". Log VPN cũng vậy: nó chứng minh thông tin xác thực nào đã được dùng, không chứng minh con người nào đã dùng.</p>

<h3>Phần 1 — WireGuard: được thiết kế để im lặng</h3>
${lenh('s11/vpn', 0)}
${lenh('s11/vpn', 1)}
${lenh('s11/vpn', 2)}
${lenh('s11/vpn', 3)}
${lenh('s11/vpn', 4)}
<p>WireGuard không có tên đăng nhập: một <strong>peer</strong> là một khoá công khai. <code>wg show</code> là "log" duy nhất có sẵn: <strong>endpoint</strong> hiện tại của peer (IP:cổng công khai nó đến lần gần nhất — có thể đổi khi di chuyển), <strong>latest handshake</strong> (khi còn lưu lượng thì ít nhất 2 phút có một lần bắt tay mới) và bộ đếm <strong>transfer</strong>. <code>wg show wg0 latest-handshakes</code> cho giá trị epoch; bằng 0 (đổi ra thành năm 1970) nghĩa là "chưa bao giờ". Để ý khoá bí mật đã được che trước khi in cấu hình — đừng bao giờ dán nó vào ticket hay khung chat.</p>
${lenh('s11/vpn', 5)}
<p>Nhân chỉ ghi rằng module đã được nạp. Chẳng có gì về việc ai kết nối. Khi điều tra, bạn bật <strong>dynamic debug</strong> của module (debugfs của nhân, chỉ root) trong một lúc:</p>
${lenh('s11/vpn', 6)}
${lenh('s11/vpn', 7)}
${lenh('s11/vpn', 8)}
${lenh('s11/vpn', 9)}
<p>Giờ nhân kể chuyện: <strong>"Invalid handshake initiation from 192.168.56.66"</strong> — ai đó cầm một khoá máy chủ không biết (keodo) đã thử; WireGuard lặng lẽ bỏ qua (ping của người lạ mất 100% và không nhận được gì, nên máy quét thậm chí không biết có máy chủ WireGuard ở đó). Rồi "Receiving handshake initiation from peer N (192.168.56.142:cổng)", "Sending handshake response", "Keypair created" — một peer hợp lệ đã kết nối. "peer 3/peer 4" là chỉ số nội bộ, tăng mỗi lần giao diện được tạo lại (đoạn này gom dòng của hai lượt chạy lab). Xong việc thì tắt debug. Không có debug, cách thực tế để giữ lịch sử là cứ mỗi phút lấy mẫu <code>wg show … dump</code> ghi vào log (cron/systemd timer, hoặc Prometheus WireGuard exporter) — hoặc dùng sản phẩm dựa trên WireGuard có thêm phần ghi log (một lớp quản lý chẳng hạn).</p>
${lenh('s11/vpn', 10)}
${lenh('s11/vpn', 11)}
<p>Sau khi máy khách ngắt, chẳng có gì thông báo: lần bắt tay cứ già đi (41 giây trước, rồi vài phút, vài giờ). "Đã ngắt" trong WireGuard nghĩa là "hơn chừng 3 phút không có bắt tay".</p>

<h3>Phần 2 — OpenVPN: chứng chỉ, tệp status và một cuốn log tử tế</h3>
${lenh('s11/vpn', 12)}
${lenh('s11/vpn', 13)}
${lenh('s11/vpn', 14)}
${lenh('s11/vpn', 15)}
<p>Máy chủ (verb 3, ghi vào journal qua unit systemd) ghi từng bước cho từng máy khách <code>IP:cổng</code>: <strong>VERIFY OK</strong> cho CA và chứng chỉ máy khách (CN=android), <strong>Peer Connection Initiated</strong> — thời điểm kết nối, và <strong>MULTI_sva: pool returned IPv4=10.8.0.6</strong> — địa chỉ nội bộ được cấp. Giữ kỹ dòng cuối: log nội bộ (log web Chương 10, máy chủ tệp) sẽ chỉ thấy 10.8.0.6, và chỉ dòng này mới đổi ngược nó thành "android, từ 192.168.56.142". Chứng chỉ đã thu hồi (một nhân viên đã nghỉ) bị từ chối: <strong>VERIFY ERROR … certificate revoked: CN=keodo</strong>, rồi TLS handshake failed. Còn phía máy khách? Log của chính keodo chỉ có hết giờ và SIGTERM: lý do chỉ nằm ở phía máy chủ.</p>
${lenh('s11/vpn', 16)}
<p><strong>Tệp status</strong> (ở đây ghi lại mỗi 10 giây) là bảng "ai đang kết nối ngay lúc này": common name, địa chỉ thật, địa chỉ ảo, byte vào/ra, kết nối từ lúc nào (cả dạng epoch), bộ mã. Nó không phải lịch sử — nó bị ghi đè. Muốn có lịch sử: dùng các dòng log ở trên, hoặc script <code>client-connect</code>/<code>client-disconnect</code> vốn nhận đúng những giá trị đó và có thể ghi vào cơ sở dữ liệu.</p>
${lenh('s11/vpn', 17)}
${lenh('s11/vpn', 18)}
<p>Có <code>explicit-exit-notify</code> thì máy khách chào tạm biệt và máy chủ ghi lại ("exit message received by peer", "Delayed exit in 5 seconds"). Không có nó (hoặc khi mạng rớt), máy chủ chỉ nhận ra sau thời gian keepalive (60 giây ở đây) với dòng "Inactivity timeout". Vì vậy thời điểm "ngắt kết nối" trong log OpenVPN có thể trễ tới đúng khoảng keepalive.</p>

<h3>Phần 3 — VPN có sẵn của Windows: RasClient</h3>
${lenh('s11/vpn', 19)}
${lenh('s11/vpn', 20)}
${lenh('s11/vpn', 21)}
<p>Mỗi lần trình VPN có sẵn của Windows quay số (IKEv2, SSTP, L2TP, PPTP) đều ghi sự kiện nguồn <strong>RasClient</strong> vào <em>Application</em> log, nối với nhau bằng <strong>CoId</strong> (mã kết nối): <strong>20221</strong> bắt đầu quay số (tên profile, người dùng, chiến lược), <strong>20222</strong> đang dựng liên kết (địa chỉ máy chủ, thiết bị "WAN Miniport (SSTP)"), rồi <strong>20227</strong> thất bại kèm mã lỗi — hoặc <strong>20225</strong> khi kết nối thành công (và 20226 khi kết thúc). Mã lỗi có hai dạng: số RAS cổ điển (691 sai thông tin đăng nhập, 789/809 lỗi IPsec/NAT, 800 không dựng được đường hầm) và HRESULT như <code>-2147014836</code>: đổi sang hex không dấu là 0x8007274C, lỗi Win32 0x274C = 10060, WSAETIMEDOUT — "máy chủ không trả lời", ở đây vì lab7 không chạy SSTP và ufw chặn 443. <code>rasdial</code> in đúng thông điệp đó. Để ý "The user SYSTEM": lần quay số được chạy từ phiên SSH của ta dưới dạng dịch vụ; người dùng bình thường quay số sẽ hiện domain\\user.</p>

<h3>🛡️ Góc hacker: Colonial Pipeline (tháng 5/2021)</h3>
<p>Vụ ransomware làm tê liệt đường ống nhiên liệu lớn nhất bờ Đông nước Mỹ, theo lời khai của CEO công ty trước Thượng viện Mỹ ngày 8/6/2021, bắt đầu từ một <strong>tài khoản VPN cũ</strong> không còn dùng, chỉ được bảo vệ bằng mật khẩu (không xác thực nhiều lớp) — một mật khẩu đã xuất hiện trong một vụ rò rỉ. Log VPN ghi nhận một lần đăng nhập hợp lệ. Thứ lẽ ra bắt được nó: đối chiếu danh sách tài khoản VPN với nhân viên đang làm (đúng việc thu hồi bạn vừa thấy), MFA, và cảnh báo khi một tài khoản im lặng lâu bỗng đăng nhập từ IP/quốc gia/giờ lạ (Chương 14: đăng nhập bất thường). Theo ATT&amp;CK: T1133 External Remote Services, T1078 Valid Accounts.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"Làm sao biết ai đang kết nối VPN lúc 02:00 đêm qua?" — log máy chủ VPN (kết nối/ngắt, IP được cấp) hoặc accounting (RADIUS); WireGuard thì phải lấy mẫu các lần bắt tay.</li>
<li>"Một request đáng ngờ đến từ 10.8.0.6 trong log ứng dụng. Đó là ai?" — đổi IP ảo → người dùng bằng log VPN tại thời điểm đó.</li>
<li>"WireGuard ghi 'latest handshake: 5 minutes ago'. Máy khách còn kết nối không?" — nhiều khả năng là không (đang hoạt động thì bắt tay mới trong khoảng 2 phút).</li>
<li>"Thu hồi quyền VPN của người đã nghỉ thế nào?" — thu hồi chứng chỉ/khoá (CRL, xoá peer), khoá tài khoản; kiểm việc bị từ chối trong log.</li>
</ul>

<h3>Tình huống đi làm thật</h3>
<ul>
<li><strong>Dự án outsourcing</strong> thường bắt kết nối VPN của khách (FortiClient, GlobalProtect, Cisco AnyConnect, OpenVPN). Khi hỏng, gom log của client và thời điểm chính xác trước khi viết cho IT của khách; họ sẽ tìm trong log cổng VPN theo tên đăng nhập của bạn tại đúng thời điểm đó.</li>
<li><strong>VPN lab của riêng bạn</strong> (WireGuard trên VPS để về nhà): thêm một timer mỗi phút ghi <code>wg show wg0 dump</code> vào log, để câu "đêm qua điện thoại mình có kết nối không?" có câu trả lời.</li>
</ul>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
<li>Từ tệp status ở trên: ai đang kết nối, từ đâu, từ lúc nào, và đã gửi bao nhiêu byte?</li>
<li>Viết lệnh <code>journalctl</code> + <code>grep</code> liệt kê mọi chứng chỉ bị từ chối trong 24 giờ qua kèm CN.</li>
<li>Đổi mã lỗi RasClient <code>-2147014836</code> sang hex bằng PowerShell và gọi tên lỗi Win32.</li>
<li>Thiết kế một định dạng log một dòng cho việc lấy mẫu WireGuard (mỗi peer mỗi phút một dòng) trả lời được "ai kết nối lúc nào".</li>
</ol>
<p><strong>Đạt khi:</strong> (1) CN android, địa chỉ thật 192.168.56.142:39083, địa chỉ ảo 10.8.0.6, từ 12:29:26, máy chủ đã nhận 3256 byte (= máy khách gửi); (2) <code>journalctl -u openvpn-server@lab --since -24h | grep "VERIFY ERROR" | grep -o "CN=[^,]*"</code>; (3) <code>'{0:X}' -f (-2147014836 -band 0xFFFFFFFF)</code> → 8007274C → 0x274C = 10060 = WSAETIMEDOUT (hết thời gian kết nối); (4) ví dụ <code>time=… iface=wg0 peer=&lt;10 ký tự đầu của khoá&gt; endpoint=IP:cổng latest_handshake=epoch rx=… tx=…</code> — coi là "đang kết nối" khi now − latest_handshake &lt; 180 giây.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['Peer / endpoint', 'WireGuard: một khoá công khai / IP:cổng công khai hiện tại của nó.'],
  ['Latest handshake', 'Lần trao khoá gần nhất; khi đang hoạt động thì làm mới chừng 2 phút một lần.'],
  ['Dynamic debug', 'Công tắc của nhân để bật thông điệp debug của một module khi đang chạy.'],
  ['Common Name (CN)', 'Tên trong chứng chỉ máy khách; "tên đăng nhập" của OpenVPN.'],
  ['CRL / bị thu hồi', 'Danh sách chứng chỉ bị thu hồi; chứng chỉ bị thu hồi sẽ trượt VERIFY.'],
  ['Tệp status', 'Bảng máy khách hiện tại của OpenVPN, được ghi lại định kỳ.'],
  ['RasClient 20221/20222/20225/20226/20227', 'Trình VPN của Windows: quay số, dựng liên kết, đã kết nối, kết thúc, thất bại.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Các trường then chốt của log VPN: danh tính, IP thật, IP ảo, giờ kết nối và giờ ngắt.</li>
<li>WireGuard: wg show + dynamic debug khi cần; muốn có lịch sử thì lấy mẫu.</li>
<li>OpenVPN: VERIFY, Peer Connection Initiated, pool returned; tệp status cho "ngay lúc này".</li>
<li>Windows: Application log, nguồn RasClient, nối sự kiện bằng CoId; giải mã HRESULT.</li>
<li>Đăng nhập VPN hợp lệ vẫn có thể là kẻ tấn công: kiểm kê, MFA, cảnh báo đăng nhập lạ.</li>
</ul>
${nguon('📘', 'WireGuard — Quick start', 'wg, wg-quick, peer, bắt tay', 'https://www.wireguard.com/quickstart/')}
${nguon('📘', 'OpenVPN 2.6 reference manual', '--status, --verb, --crl-verify, --explicit-exit-notify, client-connect', 'https://openvpn.net/community-resources/reference-manual-for-openvpn-2-6/')}
${nguon('🛡️', 'Colonial Pipeline ransomware attack (tổng hợp có nguồn)', 'Tài khoản VPN cũ không MFA, mật khẩu bị lộ (lời khai CEO, 8/6/2021)', 'https://en.wikipedia.org/wiki/Colonial_Pipeline_ransomware_attack')}
${nguon('🛡️', 'MITRE ATT&CK T1133 — External Remote Services', 'VPN làm đường vào ban đầu; xem thêm T1078 Valid Accounts', 'https://attack.mitre.org/techniques/T1133/')}
${lienKet({ khoa: 'network-security', bai: 'netsec-5-2-wireguard', title: 'Network Security 5.2 — WireGuard chuyên sâu', sub: 'Khoá, peer, AllowedIPs (phần dựng nằm ở đó)', cta: 'Mở bài' })}
</div>
`,
};
