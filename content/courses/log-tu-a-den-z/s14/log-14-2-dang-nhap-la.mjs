/**
 * 14.2 — Đăng nhập bất thường (soạn 24/11/2026, agent lgz). Output thật: OUT['s14/dang-nhap-la'] — vu14 (tao-vu.py) + EVTX công khai rdp-tunnel-4624 (PC02.example.corp, 13/2/2019).
 * Số tất định: đường nền 20 × publickey deploy từ 10.0.5.20 (giờ 08 ×10, 13 ×10) + 3 × an từ 10.0.5.31; MỚI duy nhất: password deploy 203.0.113.77 lúc 02:14:01 (giờ 02);
 * di chuyển bất khả: lan VN 18:02:44Z → US 18:20:45Z 13 327 km/18 phút = 44 384 km/h; hoa 07:12:40Z → 18:24:54Z 1189 km/h; hai lượt "về" 2667 / 1662 km/h;
 * reqId 0eaea4ce… = 1 dòng nginx; 198.51.100.165 vẫn 401 tới 01:34:46; RDP: LogonType 10 + 2 từ 127.0.0.1 (IEUser 15:19:51/15:26:53/15:29:40), sshd_server LogonType 5 lúc 15:15:08.
 */
import { lenh, ma, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '14.2 — Unusual logons: new country or IP, impossible travel, odd hours, new device, service accounts logging on interactively|||14.2 — Đăng nhập bất thường: quốc gia/IP mới, di chuyển bất khả, giờ lạ, thiết bị mới, tài khoản dịch vụ đăng nhập tương tác',
  slug: 'log-14-2-dang-nhap-la',
  type: 'LESSON',
  isFreePreview: true,
  description: '"Bất thường" chỉ có nghĩa khi bạn biết "bình thường" là gì. Bài này lập đường nền 14 ngày cho các lần đăng nhập SSH của web01 (ai, bằng cách nào, từ đâu, giờ nào) rồi để máy tự tìm "lần đầu tiên": một lần đăng nhập bằng MẬT KHẨU lúc 2 giờ sáng từ IP lạ cho tài khoản xưa nay chỉ dùng khoá. Tự viết công cụ "di chuyển bất khả" 30 dòng Python với bảng GeoIP thu nhỏ: khách lan đăng nhập ở Việt Nam rồi 18 phút sau ở Mỹ (44 384 km/h). Giới hạn của GeoIP (VPN, mạng di động, proxy dân dụng), và một ca Windows thật: Logon Type 10 từ 127.0.0.1 — RDP chui qua đường hầm SSH.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.2</span>
<h2>Normal first, then "the first time ever"</h2>
<p class="lead">A successful logon is not an alert — thousands happen every day. It becomes interesting only when it differs from what this account normally does: a new source, a new method, a new hour, a new country, a new device, or an account that should never log on interactively at all. So the job has two halves: build a <strong>baseline</strong>, then list everything that is <strong>new</strong> against it.</p>

<h3>The everyday picture</h3>
<p>The building guard does not stop everyone. He stops the cleaner who always comes at 7 am through the back door when she shows up at 2 am at the front door — and he can only do that because he has seen her 300 mornings in a row.</p>

<h3>Step 1 — baseline: who logs in, how, from where, when</h3>
${lenh('s14/dang-nhap-la', 0)}
${lenh('s14/dang-nhap-la', 1)}
<p>14 days: <code>deploy</code> always uses a <strong>key</strong>, always from the CI machine 10.0.5.20, at 08h and 13h; <code>an</code> (the admin) uses a key from 10.0.5.31. Now let awk remember every (method, user, IP) seen before 19/11 and print only what is new:</p>
${lenh('s14/dang-nhap-la', 2)}
<p>One line, four anomalies at once: <strong>password</strong> instead of key, an <strong>Internet IP</strong>, <strong>02h</strong>, and right after a spray (14.1). Each alone may be innocent (a developer on holiday, a key lost); together they are a compromise until proven otherwise.</p>
<div class="pitfall co-tieu-de"><p><strong>The baseline must not include the attack.</strong> Build it from a period you trust (here: before the day of the incident). A baseline built from "the last 30 days" after an attacker has lived in the system for 3 weeks learns the attacker as normal.</p></div>

<h3>Step 2 — impossible travel</h3>
<p>For web accounts, compare two consecutive successful logons of the same user: if the countries differ and the speed needed to travel between them is faster than a plane (~900 km/h), one of them is not the user. GeoIP turns an IP into a country; here a tiny table for the documentation IP ranges stands in for a real GeoIP database:</p>
${lenh('s14/dang-nhap-la', 3)}
${lenh('s14/dang-nhap-la', 4)}
${lenh('s14/dang-nhap-la', 5)}
<p>Customer lan logged in from Vietnam at 01:02 local time, and 18 minutes later "from the US" — 44 384 km/h. That second logon is the stuffing success of 14.1. Note the other lines: every hijack produces <strong>two</strong> alerts (going and "coming back" when the real user logs in again), and hoa's 1 189 km/h over 11 hours is close to a real flight — tune the speed and look at the context. Follow the request id to nginx to see what that IP did:</p>
${lenh('s14/dang-nhap-la', 6)}
<details><summary><strong>di-chuyen.py — 30 lines (read it)</strong></summary>
${ma('python', 's14/mau/di-chuyen.py')}
</details>

<h3>The limits of GeoIP</h3>
${kv([
  ['VPN / corporate proxy', 'An employee in Hanoi on the company VPN appears in Singapore. Whitelist known egress IPs.'],
  ['Mobile networks', 'Carrier-grade NAT puts a whole city behind a few IPs; location may be the carrier\'s gateway, hundreds of km away.'],
  ['Residential proxies', 'Attackers rent home IPs in the victim\'s own country — no country change at all (Midnight Blizzard, 14.1). Combine with other signals: new device, new ASN, failures before.'],
  ['Database age', 'IP blocks move between countries; keep the database updated (MaxMind GeoLite2 updates twice a week).'],
])}

<h3>Step 3 — Windows: RDP from 127.0.0.1</h3>
<p>A public sample (EVTX-ATTACK-SAMPLES, "RDP tunneling") shows a logon type you should never see on a normal workstation:</p>
${lenh('s14/dang-nhap-la', 7)}
${lenh('s14/dang-nhap-la', 8)}
<p><strong>Logon Type 10 (RemoteInteractive) from 127.0.0.1</strong> means an RDP session that came from the machine itself — someone forwarded the RDP port through a tunnel (here an SSH server running as the <code>sshd_server</code> service, started at 15:15:08). Firewalls saw only SSH. The baseline rule: on this machine, RDP sources are always LAN IPs; loopback is new.</p>

<h3>Service accounts logging on interactively</h3>
<p>Accounts like <code>svc-backup</code>, <code>www-data</code>, <code>postgres</code> exist for programs. On Windows they should produce Logon Type 5 (service) or 3 (network) — never 2 or 10; on Linux they should have <code>nologin</code> as shell and never appear in <code>Accepted …</code>. A rule "service account + interactive logon" has almost no false positives.</p>

<h3>🛡️ Attacker's corner</h3>
<p>Attackers know about impossible travel: they use proxies in the victim's city, log in during office hours, and reuse the stolen device's browser fingerprint when they can. That is why the strongest signals are the ones they cannot fake easily: <em>method</em> (password instead of key), <em>MFA</em> prompts the user did not trigger, and <em>what happens next</em> (14.3).</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"How would you detect a compromised account with no failed logins?" — baseline of source/method/hour/device; first-seen rules; impossible travel.</li>
<li>"What breaks impossible-travel detection?" — VPN, CGNAT, residential proxies, stale GeoIP.</li>
<li>"What does Logon Type 10 from 127.0.0.1 suggest?" — RDP through a tunnel (SSH/Chisel/ngrok…).</li>
</ul>

<h3>At work</h3>
<p>When a customer asks "is this login suspicious?", answer with a table: the user's last 20 logons (time UTC, IP, country, method, device), the new one highlighted, and what was done in that session. Opinions without the baseline are guesses.</p>

<h3>🧪 Practice (30 min)</h3>
<ol>
<li>Build the same "first seen" list for nginx: which IPs called <code>/admin</code> or <code>/api/login</code> on 19/11 for the first time?</li>
<li>Change the speed limit in di-chuyen.py to 500 km/h. Which new lines appear? Are they real?</li>
<li>Write a rule: a successful logon whose IP had ≥ 5 failures in the previous hour (any account).</li>
</ol>

<h3>🗂 Key terms</h3>
${kv([
  ['Baseline', 'What normal looks like for this account/machine, built from a trusted period.'],
  ['First-seen', 'A value (IP, method, device, country) never observed before for this entity.'],
  ['Impossible travel', 'Two logons too far apart for the time between them.'],
  ['GeoIP / ASN', 'Mapping an IP to a location / to the network that owns it.'],
  ['RDP tunneling', 'Carrying RDP inside another protocol; shows as Logon Type 10 from loopback.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Build the baseline before the incident; then list what is new.</li>
<li>Method + source + hour + device together beat any single signal.</li>
<li>Impossible travel is useful but easily fooled; never alone.</li>
</ul>
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-4-7-rdp-tu-xa', title: 'Lesson 4.7 — RDP in Windows logs', sub: '1149, 21–25, 4778/4779', cta: 'Open' })}
${lienKet({ khoa: 'blue-team-siem', bai: 'siem-6-2-dang-nhap-la', title: 'Blue Team course › 6.2 Unusual logons', sub: 'The same rules inside a SIEM', cta: 'Open' })}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.2</span>
<h2>Bình thường trước, rồi mới "lần đầu tiên"</h2>
<p class="lead">Một lần đăng nhập thành công không phải cảnh báo — mỗi ngày có hàng nghìn lần. Nó chỉ đáng chú ý khi KHÁC với thói quen của chính tài khoản đó: nguồn mới, cách đăng nhập mới, giờ mới, quốc gia mới, thiết bị mới, hoặc một tài khoản lẽ ra không bao giờ đăng nhập tương tác. Nên việc gồm hai nửa: dựng <strong>đường nền</strong> (baseline), rồi liệt kê mọi thứ <strong>mới</strong> so với nó.</p>

<h3>Liên tưởng đời thường</h3>
<p>Bảo vệ toà nhà không chặn tất cả mọi người. Anh ấy chặn cô lao công vốn luôn đến lúc 7 giờ sáng bằng cửa sau, khi cô xuất hiện lúc 2 giờ sáng ở cửa trước — và anh ấy làm được vậy chỉ vì đã thấy cô 300 buổi sáng liên tiếp.</p>

<h3>Bước 1 — đường nền: ai đăng nhập, bằng gì, từ đâu, lúc nào</h3>
${lenh('s14/dang-nhap-la', 0)}
${lenh('s14/dang-nhap-la', 1)}
<p>14 ngày: <code>deploy</code> luôn dùng <strong>khoá</strong>, luôn từ máy CI 10.0.5.20, vào khung 08 giờ và 13 giờ; <code>an</code> (quản trị) dùng khoá từ 10.0.5.31. Giờ để awk nhớ mọi bộ (cách, tài khoản, IP) đã thấy TRƯỚC ngày 19/11 và chỉ in cái mới:</p>
${lenh('s14/dang-nhap-la', 2)}
<p>Đọc lệnh: <code>split</code> cắt phần sau chữ "Accepted " thành từng từ — từ 1 là cách (password/publickey), từ 3 là tài khoản, từ 5 là IP. Dòng trước ngày 19 thì ghi vào mảng <code>nen</code> rồi bỏ qua (<code>next</code>); dòng từ ngày 19 mà bộ ba chưa có trong <code>nen</code> thì in.</p>
<p>Một dòng, bốn điều bất thường cùng lúc: <strong>mật khẩu</strong> thay vì khoá, <strong>IP Internet</strong>, <strong>2 giờ sáng</strong>, và ngay sau một đợt rải mật khẩu (14.1). Từng điều riêng lẻ có thể vô hại (lập trình viên đi nghỉ, mất khoá); cả bốn cùng lúc thì coi là bị chiếm cho tới khi chứng minh được điều ngược lại.</p>
<div class="pitfall co-tieu-de"><p><strong>Đường nền không được chứa chính cuộc tấn công.</strong> Dựng nó từ khoảng thời gian bạn tin được (ở đây: trước ngày xảy ra). Đường nền dựng từ "30 ngày gần nhất" khi kẻ tấn công đã ở trong hệ thống 3 tuần sẽ học kẻ tấn công như một điều bình thường.</p></div>

<h3>Bước 2 — di chuyển bất khả (impossible travel)</h3>
<p>Với tài khoản web, so hai lần đăng nhập thành công liên tiếp của cùng người: nếu khác quốc gia và tốc độ cần để đi giữa hai nơi nhanh hơn máy bay (~900 km/h) thì một trong hai không phải người đó. GeoIP đổi IP thành quốc gia; ở đây một bảng nhỏ cho các dải IP dành cho tài liệu thay cho cơ sở dữ liệu GeoIP thật:</p>
${lenh('s14/dang-nhap-la', 3)}
${lenh('s14/dang-nhap-la', 4)}
${lenh('s14/dang-nhap-la', 5)}
<p>Khách lan đăng nhập ở Việt Nam lúc 01:02 giờ VN, và 18 phút sau "ở Mỹ" — 44 384 km/h. Lần thứ hai chính là lần stuffing thành công ở Bài 14.1. Để ý các dòng còn lại: mỗi vụ chiếm tài khoản sinh <strong>hai</strong> cảnh báo (lượt "đi" và lượt "về" khi chủ thật đăng nhập lại), còn 1 189 km/h của hoa trong 11 giờ thì gần với một chuyến bay thật — phải chỉnh tốc độ và xem bối cảnh. Lần theo request id sang nginx để xem IP đó đã làm gì:</p>
${lenh('s14/dang-nhap-la', 6)}
<p>IP 198.51.100.165 vẫn tiếp tục thử tài khoản khác tới 01:34 — đúng là máy của đợt nhồi, không phải điện thoại của lan.</p>
<details><summary><strong>di-chuyen.py — 30 dòng (đọc kỹ)</strong></summary>
${ma('python', 's14/mau/di-chuyen.py')}
</details>

<h3>Giới hạn của GeoIP</h3>
${kv([
  ['VPN / proxy công ty', 'Nhân viên ở Hà Nội dùng VPN công ty sẽ hiện ở Singapore. Đưa các IP ra Internet của công ty vào danh sách cho phép.'],
  ['Mạng di động', 'CGNAT của nhà mạng đặt cả thành phố sau vài IP; vị trí có khi là cổng của nhà mạng cách hàng trăm km.'],
  ['Proxy dân dụng', 'Kẻ tấn công thuê IP gia đình ngay trong nước của nạn nhân — không đổi quốc gia gì cả (Midnight Blizzard, 14.1). Kết hợp tín hiệu khác: thiết bị mới, ASN mới, có lần hỏng trước đó.'],
  ['Cơ sở dữ liệu cũ', 'Dải IP đổi chủ giữa các nước; phải cập nhật (MaxMind GeoLite2 cập nhật hai lần mỗi tuần).'],
])}

<h3>Bước 3 — Windows: RDP từ 127.0.0.1</h3>
<p>Một mẫu công khai (EVTX-ATTACK-SAMPLES, "RDP tunneling") cho thấy một Logon Type không bao giờ nên gặp trên máy trạm bình thường:</p>
${lenh('s14/dang-nhap-la', 7)}
${lenh('s14/dang-nhap-la', 8)}
<p><strong>Logon Type 10 (RemoteInteractive) từ 127.0.0.1</strong> nghĩa là một phiên RDP đến từ chính máy đó — ai đó đã chuyển tiếp cổng RDP qua một đường hầm (ở đây là máy chủ SSH chạy dưới dịch vụ <code>sshd_server</code>, khởi động lúc 15:15:08). Tường lửa chỉ thấy SSH. Luật đường nền: trên máy này, nguồn RDP luôn là IP mạng nội bộ; loopback là điều mới.</p>

<h3>Tài khoản dịch vụ đăng nhập tương tác</h3>
<p>Các tài khoản như <code>svc-backup</code>, <code>www-data</code>, <code>postgres</code> tồn tại cho chương trình. Trên Windows chúng chỉ nên sinh Logon Type 5 (dịch vụ) hoặc 3 (mạng) — không bao giờ 2 hay 10; trên Linux chúng nên có shell là <code>nologin</code> và không bao giờ xuất hiện trong <code>Accepted …</code>. Luật "tài khoản dịch vụ + đăng nhập tương tác" gần như không báo nhầm.</p>

<h3>🛡️ Góc hacker</h3>
<p>Kẻ tấn công biết về impossible travel: họ dùng proxy ngay thành phố của nạn nhân, đăng nhập trong giờ hành chính, và dùng lại dấu vân tay trình duyệt của máy đã chiếm khi có thể. Vì vậy tín hiệu mạnh nhất là những thứ họ khó giả: <em>cách đăng nhập</em> (mật khẩu thay cho khoá), <em>lời nhắc MFA</em> mà người dùng không hề bấm, và <em>những gì xảy ra tiếp theo</em> (Bài 14.3).</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"Phát hiện tài khoản bị chiếm khi không có lần đăng nhập hỏng nào thế nào?" — đường nền nguồn/cách/giờ/thiết bị; luật "lần đầu thấy"; di chuyển bất khả.</li>
<li>"Cái gì làm hỏng phát hiện impossible travel?" — VPN, CGNAT, proxy dân dụng, GeoIP cũ.</li>
<li>"Logon Type 10 từ 127.0.0.1 gợi ý điều gì?" — RDP qua đường hầm (SSH/Chisel/ngrok…).</li>
</ul>

<h3>Đi làm thật (outsourcing / OJT)</h3>
<p>Khi khách hỏi "lần đăng nhập này có đáng ngờ không?", trả lời bằng một bảng: 20 lần đăng nhập gần nhất của người đó (giờ UTC, IP, quốc gia, cách, thiết bị), lần mới tô đậm, và phiên đó đã làm gì. Ý kiến mà không có đường nền chỉ là đoán.</p>

<h3>🧪 Thực hành (30 phút)</h3>
<ol>
<li>Dựng danh sách "lần đầu thấy" tương tự cho nginx: IP nào gọi <code>/api/login</code> lần đầu tiên vào ngày 19/11?</li>
<li>Đổi ngưỡng tốc độ trong di-chuyen.py còn 500 km/h. Dòng mới nào hiện ra? Có thật đáng ngờ không?</li>
<li>Viết luật: một lần đăng nhập thành công mà IP của nó có ≥ 5 lần hỏng trong một giờ trước đó (bất kỳ tài khoản nào).</li>
</ol>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Đường nền (baseline)', 'Thế nào là bình thường với tài khoản/máy này, dựng từ một khoảng thời gian tin được.'],
  ['Lần đầu thấy (first-seen)', 'Một giá trị (IP, cách, thiết bị, quốc gia) chưa từng gặp với đối tượng này.'],
  ['Di chuyển bất khả', 'Hai lần đăng nhập cách nhau quá xa so với thời gian giữa chúng.'],
  ['GeoIP / ASN', 'Đổi IP thành vị trí / thành mạng sở hữu nó.'],
  ['RDP tunneling', 'Chở RDP bên trong giao thức khác; hiện ra là Logon Type 10 từ loopback.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Dựng đường nền từ trước sự cố; rồi liệt kê cái mới.</li>
<li>Cách + nguồn + giờ + thiết bị cùng nhau mạnh hơn bất kỳ tín hiệu đơn lẻ nào.</li>
<li>Impossible travel hữu ích nhưng dễ bị lừa; không bao giờ dùng một mình.</li>
</ul>
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-4-7-rdp-tu-xa', title: 'Bài 4.7 — RDP trong log Windows', sub: '1149, 21–25, 4778/4779', cta: 'Mở bài' })}
${lienKet({ khoa: 'blue-team-siem', bai: 'siem-6-2-dang-nhap-la', title: 'Khoá Blue Team › 6.2 Đăng nhập bất thường', sub: 'Cùng các luật này nhưng trong SIEM', cta: 'Mở bài' })}
</div>
`,
};
