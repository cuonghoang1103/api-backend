/**
 * 4.1 — Đăng nhập (soạn 24/11/2026, agent lgz). Output thật: OUT['s04/dang-nhap'] — bộ EVTX mẫu công khai (xem 3.1 + tai-mau-ch4.ps1 ở 4.9), đọc bằng evtx-rec trong PowerShell 7.
 * Số tất định: 2-system-Security-dirty.evtx LogonType 5×2342, 2×219, 3×22, 0×14, 10×11, 7×7, 11×6; RDP từ 4 IP công cộng (118.93.18.141, 173.255.138.161/.141, 47.190.48.109, 162.210.195.168);
 * phiên 0x7ac7caf 18:16:23→20:00:58 (4647), 3 SID S-1-12-1 vào Administrators 19:59; cặp 10512/10513 linked; 4624/4634/4647 = 2621/182/15;
 * SMB 3561 × 4625 16:50:06→16:52:49 từ 192.168.198.149 (3558 × 0xc000006a, 2 × 0xc0000072, 1 × 0xc0000064 JcDfcZTc); Archive 71 psadmin 0xc0000064, 56 CTX-WS16-FS-T3$; hạn chế 2 × type 10 0xc000006e.
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '4.1 — Logon events 4624, 4625, 4634, 4647 and logon types 2, 3, 4, 5, 7, 10, 11|||4.1 — Sự kiện đăng nhập 4624, 4625, 4634, 4647 và các Logon Type 2, 3, 4, 5, 7, 10, 11',
  slug: 'log-4-1-dang-nhap',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Đọc 4624/4625/4634/4647 như đọc sổ ra vào: Logon Type nghĩa là gì, trường Subject và New Logon, IpAddress/WorkstationName, gói xác thực, Logon ID để lần theo một phiên, split token của quản trị viên, Status/SubStatus của 4625. Thực hành trên log thật: 11 lần RDP từ 4 IP công cộng vào một máy Windows 10, một phiên quản trị 1 giờ 44 phút, 3 561 lần đoán mật khẩu SMB trong 2 phút 43 giây.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Who came in, how, and from where</h2>
<p class="lead">Every time someone (or something) gets a session on Windows, the Security log writes <strong>4624</strong>; every failed attempt writes <strong>4625</strong>; when the session ends you may see <strong>4634</strong> and, if a person clicked "Sign out", <strong>4647</strong>. Four IDs answer the most common question at work — "who logged on to this machine?" — but only if you read three fields correctly: <em>Logon Type</em>, <em>where from</em>, and <em>Logon ID</em>.</p>

<h3>The everyday picture: the building's access-card log</h3>
<p>An office building records every badge swipe: success (4624), refused (4625), leaving the room (4634), pressing "I'm done" at the exit (4647). The log also says <em>which door</em> — front door, car park, staff lift. Logon Type is that door: the same person entering through the front desk (type 2) and through the server-room back door (type 10 from the Internet) means very different things.</p>

<h3>Logon Type — the door they used</h3>
${kv([
  ['2 Interactive', 'Keyboard at the machine (or the console of a VM).'],
  ['3 Network', 'Access over the network: shared folder (SMB), mapped drive, many remote admin tools. No desktop.'],
  ['4 Batch', 'A scheduled task running as a user.'],
  ['5 Service', 'A service starting under its account (SYSTEM, LOCAL SERVICE, a service account). The most frequent and usually boring.'],
  ['7 Unlock', 'Unlocking a locked screen.'],
  ['8 NetworkCleartext', 'Network logon where the password crossed the wire in clear (IIS Basic auth, some PowerShell).'],
  ['9 NewCredentials', '"runas /netonly" — local identity unchanged, other credentials used for network.'],
  ['10 RemoteInteractive', 'Remote Desktop (RDP) or Remote Assistance.'],
  ['11 CachedInteractive', 'Domain account logged on with cached credentials (laptop away from the office).'],
  ['0 System', 'Only the SYSTEM account at boot — not a person.'],
])}
${lenh('s04/dang-nhap', 0)}
<p>One real Windows 10 machine (public sample <code>2-system-Security-dirty.evtx</code>, 2018–2019): 2 342 service logons, 219 at the keyboard, 22 over the network — and <strong>11 Remote Desktop logons</strong>. Those 11 are where an investigator starts.</p>

<h3>Step 1 — the RDP logons: who and from where</h3>
${lenh('s04/dang-nhap', 1)}
<p>Every type-10 logon is the built-in <code>Administrator</code>, and the <code>IpAddress</code> values are public Internet addresses from four networks. <code>WorkstationName</code> is what the <em>client</em> claims to be called — note the first line says <code>WIN-LL0C19JS506</code>, which is this machine's own name before it was renamed: the client name is self-reported and can be anything. Trust the IP more than the name, and remember that behind NAT/VPN the IP is the gateway, not the person.</p>
<div class="pitfall co-tieu-de"><p><strong>IpAddress "-" or 127.0.0.1 does not mean "local person".</strong> Type 2 and 11 logons often show 127.0.0.1 because winlogon talks to the local security service. An RDP connection that arrives through an SSH tunnel or port-forward also shows a local address (Chapter 14 shows such a tunnel). Read the IP together with the Logon Type and the other logs (1149, 21 — Lesson 4.7).</p></div>

<h3>Step 2 — follow one session with the Logon ID</h3>
<p><code>TargetLogonId</code> in 4624 is the session's number until reboot. Every later event that this session causes carries the same value as <code>SubjectLogonId</code>; 4634/4647 carry it as <code>TargetLogonId</code>. Filtering on it turns a log of thousands of lines into one person's story.</p>
${lenh('s04/dang-nhap', 2)}
${lenh('s04/dang-nhap', 3)}
<p>Read it as a story: 18:16 the Administrator arrives by RDP from 47.190.48.109; at the same second 4672 ("special privileges assigned" — an admin, Lesson 4.2); 18:27 tools list the local groups of Administrator and Guest (4798); 19:59 three SIDs starting <code>S-1-12-1-</code> are added to <strong>Administrators</strong>, surrounded by key operations (5058/5059/5061); 20:00:58 the user clicks Sign out (4647). <em>S-1-12-1</em> is the prefix of Microsoft Entra ID (Azure AD) identities, and Microsoft documents that joining a device to Entra ID adds exactly three principals to local Administrators (the Global Administrator role, the Joined-Device Local Administrator role, and the user who joined). So this is most likely the owner joining the PC to Entra ID — a legitimate change that <em>looks</em> like persistence. Your job is not to guess: confirm with the Entra sign-in/audit log or ask the owner.</p>

<h3>Step 3 — two logons for one admin: the split token</h3>
${lenh('s04/dang-nhap', 4)}
<p>With UAC on, an administrator who logs on interactively gets <strong>two</strong> 4624 at the same millisecond: one with the full admin token (<code>ElevatedToken</code> = <code>%%1842</code>, "Yes") and one limited (<code>%%1843</code>, "No"); each points to the other in <code>TargetLinkedLogonId</code>. Counting logons, count one of them. <code>%%18xx</code> are message numbers that Event Viewer translates into words — in raw XML you see the number.</p>

<h3>Step 4 — logoff: 4634 and 4647 are not a pair</h3>
${lenh('s04/dang-nhap', 5)}
<p>2 621 logons, only 182 logoffs and 15 user sign-outs. 4647 = a person chose Sign out (interactive/RDP). 4634 = Windows destroyed a session — for network logons it comes seconds later, for services it may never come (they live until shutdown), and a power cut writes nothing. So "session duration = 4634 − 4624" works for people at a desktop, not as a general rule.</p>

<h3>Step 5 — failed logons (4625): Status and Sub Status tell why</h3>
${kv([
  ['0xC000006D + 0xC000006A', 'User exists, password wrong.'],
  ['0xC000006D + 0xC0000064', 'User name does not exist.'],
  ['0xC0000234', 'Account locked out (Lesson 4.2, 4740).'],
  ['0xC0000072', 'Account disabled by an administrator.'],
  ['0xC000006E', 'Name and password valid, but an account restriction blocked it (time-of-day, logon type…).'],
  ['0xC000015B', 'The user has not been granted this logon type on this machine.'],
])}
<p>A public sample from DeepBlueCLI (a lab machine attacked with an SMB password-guessing tool):</p>
${lenh('s04/dang-nhap', 6)}
${lenh('s04/dang-nhap', 7)}
${lenh('s04/dang-nhap', 8)}
${lenh('s04/dang-nhap', 9)}
<p>3 561 failures in 2 minutes 43 seconds (about 22 per second) from one IP, all type 3 (network) via NTLM: no human types that fast. The first attempt uses a random name (<code>JcDfcZTc</code>, "user does not exist") — tools do this to check whether the server says "yes" to anyone. Then 3 558 wrong passwords for <code>Administrator</code>. The client name changes on every attempt (<code>6hgtmVlrrFuWtO65</code>…): the tool fills it with random text, which is itself a fingerprint. This is ATT&amp;CK T1110.001 (password guessing).</p>

<h3>Not every 4625 storm is an attack</h3>
${lenh('s04/dang-nhap', 10)}
<p>A log forwarded from a company network: 71 failures for <code>psadmin</code> from server IRT-PA-IDM2 with "user does not exist", spread over time — the classic signature of a <strong>scheduled task or service configured with a deleted account</strong>. 56 failures where the "user" is a computer account (<code>CTX-WS16-FS-T3$</code>) with a wrong password — typical of a machine whose computer-account password is out of sync with the domain (for example after restoring an old snapshot). These are tickets for the operations team, not for the security team; the pattern (one source, regular rhythm, one account) is the tell.</p>
${lenh('s04/dang-nhap', 11)}
<p>Type 10 + <code>0xC000006E</code>: someone tried RDP with valid credentials but a restriction stopped it. Lesson 4.7 shows the matching 4825 ("denied Remote Desktop").</p>

<h3>On your own Windows PC</h3>
<pre><code class="language-powershell"># Run PowerShell as administrator. Last 20 successful logons that are NOT services (type 5) — Lesson 5.1 explains Get-WinEvent
Get-WinEvent -FilterHashtable @{ LogName = 'Security'; Id = 4624 } -MaxEvents 500 |
  ForEach-Object { $x = [xml]$_.ToXml(); $d = @{}; $x.Event.EventData.Data | ForEach-Object { $d[$_.Name] = $_.'#text' }
    [pscustomobject]@{ Time = $_.TimeCreated; Type = $d.LogonType; User = $d.TargetUserName; Ip = $d.IpAddress; Id = $d.TargetLogonId } } |
  Where-Object Type -ne '5' | Select-Object -First 20 | Format-Table -AutoSize

# Failed logons in the last 24 hours, grouped by account and Sub Status
Get-WinEvent -FilterHashtable @{ LogName = 'Security'; Id = 4625; StartTime = (Get-Date).AddDays(-1) } -ErrorAction SilentlyContinue |
  ForEach-Object { $x = [xml]$_.ToXml(); ($x.Event.EventData.Data | Where-Object Name -in 'TargetUserName','SubStatus').'#text' -join ' ' } |
  Group-Object | Sort-Object Count -Descending</code></pre>

<h3>🛡️ Attacker's corner: guessing passwords over SMB and RDP</h3>
<p>Anything that answers on the Internet with a Windows login — RDP (3389), SMB (445), Outlook Web Access — is guessed at all day by automated tools. What the defender sees is exactly the pattern above: many 4625 from one IP (guessing, T1110.001) or <em>one</em> 4625 per account across many accounts from many IPs (spraying, T1110.003, which stays under lockout thresholds). The dangerous moment is the <strong>first 4624 after a run of 4625 from the same IP</strong> — the guess worked. Defence: no RDP/SMB on the Internet (VPN or a gateway), MFA, an account lockout policy, and a renamed or disabled built-in Administrator.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"What is Logon Type 3 vs 10?" — network access (file share, remote tools) vs Remote Desktop.</li>
<li>"How do you know which session did something?" — <code>TargetLogonId</code> of 4624 = <code>SubjectLogonId</code> of later events.</li>
<li>"Why two 4624 for one admin logon?" — UAC split token: elevated and limited, linked by <code>TargetLinkedLogonId</code>.</li>
<li>"You see 500 × 4625 for one account from one server every 5 minutes. Attack?" — probably a service or task with an old password/deleted account: check Sub Status, the source server, the rhythm.</li>
</ul>

<h3>At work (outsourcing / OJT)</h3>
<p>A customer writes: "Someone logged on to our server at 2 a.m., was it your team?" Answer with data, not memory: export 4624 for that hour, drop type 5, list type 2/10/3 with account, IP, Logon ID; follow the Logon ID to see what the session did; send the XML of the key events with UTC times. If the account was a shared "admin" account, say so — that is a finding (no one can be held accountable for a shared account).</p>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok"><ol>
<li>In <code>2-system-Security-dirty.evtx</code>, which IP made the RDP session that lasted the longest, and how long (4624 → 4647)?</li>
<li>In the SMB sample, at what time did the guessing reach its highest per-minute rate, and how many attempts?</li>
<li>For each Sub Status in the Archive sample, write one sentence: attack or misconfiguration, and why.</li>
</ol>
<p><strong>Pass:</strong> (1) 47.190.48.109, session 0x7ac7caf, 18:16:23 → 20:00:58 = 1 h 44 min 35 s; (2) 16:51, 1 299 attempts; (3) psadmin 0xC0000064 from one server, regular → stale account in a task/service; computer account 0xC000006A → machine password out of sync; chadkramer once from SLAD1 → a person mistyped.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['4624 / 4625', 'Successful / failed logon (Security log).'],
  ['4634 / 4647', 'Session destroyed / user-initiated sign-out.'],
  ['Logon Type', 'How the logon happened: 2 keyboard, 3 network, 5 service, 10 RDP…'],
  ['TargetLogonId', 'Session id of the new logon — follow it in later events.'],
  ['Split token', 'Two linked logons (elevated + limited) for an admin under UAC.'],
  ['Status / Sub Status', 'NTSTATUS code explaining a failed logon.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Read Logon Type first, then account, then IP + workstation, then Logon ID.</li>
<li>Follow one session with its Logon ID; do not compute durations from 4634 blindly.</li>
<li>4625 Sub Status separates wrong password, unknown user, disabled, locked, restricted.</li>
<li>Rhythm and source tell attacks from misconfiguration; the first success after many failures is the alarm.</li>
</ul>
${nguon('📘', 'Microsoft Learn — 4624(S): An account was successfully logged on', 'All fields, logon types, monitoring recommendations', 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4624')}
${nguon('📘', 'Microsoft Learn — 4625(F): An account failed to log on', 'Status/Sub Status codes to watch', 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4625')}
${nguon('📘', '[MS-ERREF] NTSTATUS values', 'Official meaning of 0xC000006E and every other code', 'https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-erref/596a1078-e883-4972-9bbc-49e60bebca55')}
${nguon('📘', 'Microsoft Learn — How to manage local administrators on Entra joined devices', 'Why three S-1-12-1 SIDs appear in Administrators', 'https://learn.microsoft.com/en-us/entra/identity/devices/assign-local-admin')}
${nguon('🛡️', 'MITRE ATT&CK T1110.001 — Password Guessing', 'and T1110.003 Password Spraying', 'https://attack.mitre.org/techniques/T1110/001/')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-4-7-rdp-tu-xa', title: 'Lesson 4.7 — Remote access: RDP, 1149, 21/24/25', sub: 'Complete an RDP story across several logs', cta: 'Open' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-8-3-auth-log', title: 'Lesson 8.3 — auth.log and SSH brute force', sub: 'The same guessing pattern on Linux', cta: 'Open' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Ai đã vào, vào bằng cách nào, từ đâu</h2>
<p class="lead">Mỗi khi một người (hoặc một thứ gì đó) có được phiên làm việc trên Windows, log Security ghi <strong>4624</strong>; mỗi lần thử thất bại ghi <strong>4625</strong>; khi phiên kết thúc bạn có thể thấy <strong>4634</strong>, và nếu một người bấm "Sign out" thì có <strong>4647</strong>. Bốn mã này trả lời câu hỏi hay gặp nhất khi đi làm — "ai đã đăng nhập vào máy này?" — nhưng chỉ khi bạn đọc đúng ba trường: <em>Logon Type</em>, <em>vào từ đâu</em>, và <em>Logon ID</em>.</p>

<h3>Liên tưởng đời thường: sổ quẹt thẻ ra vào của toà nhà</h3>
<p>Toà văn phòng ghi lại mọi lần quẹt thẻ: thành công (4624), bị từ chối (4625), rời phòng (4634), tự bấm "tôi về" ở cổng (4647). Sổ còn ghi <em>cửa nào</em> — cửa chính, hầm xe, thang máy nhân viên. Logon Type chính là cái cửa đó: cùng một người đi vào bằng quầy lễ tân (type 2) và đi vào bằng cửa sau phòng máy chủ từ Internet (type 10) mang ý nghĩa rất khác nhau.</p>

<h3>Logon Type — cánh cửa họ đã dùng</h3>
${kv([
  ['2 Interactive', 'Bàn phím ngay tại máy (hoặc console của máy ảo).'],
  ['3 Network', 'Truy cập qua mạng: thư mục chia sẻ (SMB), ổ mạng, nhiều công cụ quản trị từ xa. Không có màn hình desktop.'],
  ['4 Batch', 'Tác vụ hẹn giờ chạy dưới tên một người dùng.'],
  ['5 Service', 'Dịch vụ khởi động dưới tài khoản của nó (SYSTEM, LOCAL SERVICE, tài khoản dịch vụ). Nhiều nhất và thường nhàm chán.'],
  ['7 Unlock', 'Mở khoá màn hình đang khoá.'],
  ['8 NetworkCleartext', 'Đăng nhập qua mạng mà mật khẩu đi trên dây ở dạng rõ (IIS Basic auth, vài kiểu PowerShell).'],
  ['9 NewCredentials', '"runas /netonly" — danh tính tại máy giữ nguyên, dùng thông tin đăng nhập khác khi ra mạng.'],
  ['10 RemoteInteractive', 'Remote Desktop (RDP) hoặc Remote Assistance.'],
  ['11 CachedInteractive', 'Tài khoản domain đăng nhập bằng thông tin đã lưu tạm (laptop mang ra khỏi công ty).'],
  ['0 System', 'Chỉ tài khoản SYSTEM lúc khởi động — không phải con người.'],
])}
${lenh('s04/dang-nhap', 0)}
<p>Một máy Windows 10 thật (mẫu công khai <code>2-system-Security-dirty.evtx</code>, 2018–2019): 2 342 lần dịch vụ đăng nhập, 219 lần tại bàn phím, 22 lần qua mạng — và <strong>11 lần đăng nhập Remote Desktop</strong>. Người điều tra bắt đầu từ 11 dòng đó.</p>

<h3>Bước 1 — các lần vào bằng RDP: ai và từ đâu</h3>
${lenh('s04/dang-nhap', 1)}
<p>Mọi lần type 10 đều là tài khoản <code>Administrator</code> có sẵn, và <code>IpAddress</code> là địa chỉ Internet công cộng thuộc bốn mạng khác nhau. <code>WorkstationName</code> là tên mà <em>máy khách</em> tự xưng — để ý dòng đầu ghi <code>WIN-LL0C19JS506</code>, chính là tên cũ của máy này trước khi đổi tên: tên máy khách do bên kia tự khai, có thể là bất cứ thứ gì. Tin IP hơn tin tên, và nhớ rằng sau NAT/VPN thì IP là của cổng mạng, không phải của con người.</p>
<div class="pitfall co-tieu-de"><p><strong>IpAddress "-" hoặc 127.0.0.1 không có nghĩa là "người ngồi tại máy".</strong> Đăng nhập type 2 và 11 thường hiện 127.0.0.1 vì winlogon nói chuyện với dịch vụ bảo mật cục bộ. Một kết nối RDP đi qua đường hầm SSH hoặc chuyển tiếp cổng cũng hiện địa chỉ cục bộ (Chương 14 có một đường hầm như vậy). Đọc IP cùng với Logon Type và các log khác (1149, 21 — Bài 4.7).</p></div>

<h3>Bước 2 — lần theo một phiên bằng Logon ID</h3>
<p><code>TargetLogonId</code> trong 4624 là số hiệu của phiên cho tới khi khởi động lại. Mọi sự kiện mà phiên đó gây ra sau này mang cùng giá trị ở trường <code>SubjectLogonId</code>; 4634/4647 mang nó ở <code>TargetLogonId</code>. Lọc theo nó biến một log hàng nghìn dòng thành câu chuyện của một người.</p>
${lenh('s04/dang-nhap', 2)}
${lenh('s04/dang-nhap', 3)}
<p>Đọc thành chuyện: 18:16 Administrator vào bằng RDP từ 47.190.48.109; cùng giây đó có 4672 ("gán đặc quyền đặc biệt" — một quản trị viên, Bài 4.2); 18:27 có công cụ liệt kê nhóm cục bộ của Administrator và Guest (4798); 19:59 ba SID bắt đầu bằng <code>S-1-12-1-</code> được thêm vào <strong>Administrators</strong>, xen giữa là các thao tác khoá mật mã (5058/5059/5061); 20:00:58 người dùng bấm Sign out (4647). <em>S-1-12-1</em> là tiền tố danh tính của Microsoft Entra ID (Azure AD), và Microsoft ghi rõ khi nối máy vào Entra ID, Windows thêm đúng ba chủ thể vào Administrators cục bộ (vai trò Global Administrator, vai trò Joined-Device Local Administrator, và người thực hiện việc nối máy). Vậy nhiều khả năng đây là chủ máy nối PC vào Entra ID — một thay đổi hợp lệ nhưng <em>trông giống</em> bám trụ. Việc của bạn không phải là đoán: xác nhận bằng log đăng nhập/kiểm toán của Entra hoặc hỏi chủ máy.</p>

<h3>Bước 3 — một quản trị viên, hai lần đăng nhập: split token</h3>
${lenh('s04/dang-nhap', 4)}
<p>Khi bật UAC, một quản trị viên đăng nhập tương tác nhận <strong>hai</strong> 4624 trong cùng một mili giây: một cái mang token quản trị đầy đủ (<code>ElevatedToken</code> = <code>%%1842</code>, "Yes") và một cái bị giới hạn (<code>%%1843</code>, "No"); mỗi cái trỏ sang cái kia qua <code>TargetLinkedLogonId</code>. Khi đếm số lần đăng nhập, chỉ đếm một. <code>%%18xx</code> là số hiệu thông điệp mà Event Viewer dịch ra chữ — trong XML thô bạn thấy con số.</p>

<h3>Bước 4 — đăng xuất: 4634 và 4647 không phải một cặp</h3>
${lenh('s04/dang-nhap', 5)}
<p>2 621 lần đăng nhập, chỉ 182 lần đóng phiên và 15 lần người dùng tự đăng xuất. 4647 = một người chọn Sign out (tương tác/RDP). 4634 = Windows huỷ một phiên — với đăng nhập mạng thì vài giây sau là có, với dịch vụ có thể không bao giờ có (chúng sống đến lúc tắt máy), còn mất điện thì không ghi gì cả. Vì vậy "thời lượng phiên = 4634 − 4624" chỉ đúng với người ngồi desktop, không phải luật chung.</p>

<h3>Bước 5 — đăng nhập thất bại (4625): Status và Sub Status cho biết vì sao</h3>
${kv([
  ['0xC000006D + 0xC000006A', 'Tài khoản có thật, sai mật khẩu.'],
  ['0xC000006D + 0xC0000064', 'Tên người dùng không tồn tại.'],
  ['0xC0000234', 'Tài khoản bị khoá (Bài 4.2, 4740).'],
  ['0xC0000072', 'Tài khoản bị quản trị viên vô hiệu hoá.'],
  ['0xC000006E', 'Tên và mật khẩu đúng nhưng bị một hạn chế của tài khoản chặn lại (giờ đăng nhập, kiểu đăng nhập…).'],
  ['0xC000015B', 'Người dùng không được cấp quyền đăng nhập kiểu này trên máy này.'],
])}
<p>Một mẫu công khai của DeepBlueCLI (máy lab bị tấn công bằng công cụ đoán mật khẩu SMB):</p>
${lenh('s04/dang-nhap', 6)}
${lenh('s04/dang-nhap', 7)}
${lenh('s04/dang-nhap', 8)}
${lenh('s04/dang-nhap', 9)}
<p>3 561 lần thất bại trong 2 phút 43 giây (khoảng 22 lần mỗi giây) từ một IP, tất cả type 3 (mạng) qua NTLM: không con người nào gõ nhanh như thế. Lần đầu dùng một tên ngẫu nhiên (<code>JcDfcZTc</code>, "người dùng không tồn tại") — công cụ hay làm vậy để xem máy chủ có nói "được" với bất kỳ ai không. Sau đó là 3 558 lần sai mật khẩu cho <code>Administrator</code>. Tên máy khách đổi ở mỗi lần thử (<code>6hgtmVlrrFuWtO65</code>…): công cụ điền chuỗi ngẫu nhiên vào đó, và chính điều này là một dấu vân tay. Đây là ATT&amp;CK T1110.001 (đoán mật khẩu).</p>

<h3>Không phải cơn mưa 4625 nào cũng là tấn công</h3>
${lenh('s04/dang-nhap', 10)}
<p>Một log chuyển tiếp từ mạng công ty: 71 lần thất bại cho <code>psadmin</code> từ máy chủ IRT-PA-IDM2 với "người dùng không tồn tại", rải đều theo thời gian — dấu hiệu kinh điển của một <strong>tác vụ hẹn giờ hoặc dịch vụ được cấu hình bằng một tài khoản đã bị xoá</strong>. 56 lần thất bại mà "người dùng" là tài khoản máy (<code>CTX-WS16-FS-T3$</code>) với mật khẩu sai — điển hình của một máy có mật khẩu tài khoản máy bị lệch với domain (ví dụ sau khi khôi phục snapshot cũ). Đó là phiếu việc cho đội vận hành, không phải cho đội bảo mật; hình dạng của nó (một nguồn, nhịp đều, một tài khoản) là manh mối.</p>
${lenh('s04/dang-nhap', 11)}
<p>Type 10 + <code>0xC000006E</code>: có người thử RDP với thông tin đăng nhập đúng nhưng bị một hạn chế chặn lại. Bài 4.7 có sự kiện 4825 đi kèm ("bị từ chối Remote Desktop").</p>

<h3>Trên máy Windows của bạn</h3>
<pre><code class="language-powershell"># Mở PowerShell bằng quyền quản trị. 20 lần đăng nhập thành công gần nhất KHÔNG phải dịch vụ (type 5) — Bài 5.1 giảng Get-WinEvent
Get-WinEvent -FilterHashtable @{ LogName = 'Security'; Id = 4624 } -MaxEvents 500 |
  ForEach-Object { $x = [xml]$_.ToXml(); $d = @{}; $x.Event.EventData.Data | ForEach-Object { $d[$_.Name] = $_.'#text' }
    [pscustomobject]@{ Luc = $_.TimeCreated; Type = $d.LogonType; User = $d.TargetUserName; Ip = $d.IpAddress; Id = $d.TargetLogonId } } |
  Where-Object Type -ne '5' | Select-Object -First 20 | Format-Table -AutoSize

# Đăng nhập thất bại trong 24 giờ qua, gom theo tài khoản và Sub Status
Get-WinEvent -FilterHashtable @{ LogName = 'Security'; Id = 4625; StartTime = (Get-Date).AddDays(-1) } -ErrorAction SilentlyContinue |
  ForEach-Object { $x = [xml]$_.ToXml(); ($x.Event.EventData.Data | Where-Object Name -in 'TargetUserName','SubStatus').'#text' -join ' ' } |
  Group-Object | Sort-Object Count -Descending</code></pre>

<h3>🛡️ Góc hacker: đoán mật khẩu qua SMB và RDP</h3>
<p>Bất cứ thứ gì trả lời trên Internet bằng màn hình đăng nhập Windows — RDP (3389), SMB (445), Outlook Web Access — đều bị công cụ tự động đoán mật khẩu suốt ngày. Người phòng thủ thấy đúng hình dạng ở trên: rất nhiều 4625 từ một IP (đoán mật khẩu, T1110.001), hoặc mỗi tài khoản chỉ <em>một</em> 4625 nhưng trên rất nhiều tài khoản, từ nhiều IP (rải mật khẩu — password spraying, T1110.003, để né ngưỡng khoá tài khoản). Khoảnh khắc nguy hiểm là <strong>4624 đầu tiên ngay sau một chuỗi 4625 từ cùng IP</strong> — đoán trúng rồi. Phòng thủ: không mở RDP/SMB ra Internet (dùng VPN hoặc cổng trung gian), MFA, chính sách khoá tài khoản, đổi tên hoặc tắt Administrator có sẵn.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"Logon Type 3 khác 10 thế nào?" — truy cập qua mạng (thư mục chia sẻ, công cụ từ xa) so với Remote Desktop.</li>
<li>"Làm sao biết phiên nào đã làm một việc?" — <code>TargetLogonId</code> của 4624 = <code>SubjectLogonId</code> của các sự kiện sau.</li>
<li>"Vì sao một lần admin đăng nhập lại có hai 4624?" — split token của UAC: một token nâng quyền và một token giới hạn, nối với nhau qua <code>TargetLinkedLogonId</code>.</li>
<li>"Bạn thấy 500 lần 4625 cho một tài khoản từ một máy chủ, đều đặn 5 phút một lần. Có phải tấn công không?" — nhiều khả năng là dịch vụ hoặc tác vụ dùng mật khẩu cũ/tài khoản đã xoá: xem Sub Status, máy nguồn, nhịp.</li>
</ul>

<h3>Đi làm thật (outsourcing / OJT)</h3>
<p>Khách hàng nhắn: "Có ai đăng nhập vào máy chủ của chúng tôi lúc 2 giờ sáng, có phải đội anh không?" Trả lời bằng dữ liệu, không bằng trí nhớ: xuất 4624 trong giờ đó, bỏ type 5, liệt kê type 2/10/3 kèm tài khoản, IP, Logon ID; lần theo Logon ID để xem phiên đó đã làm gì; gửi XML của các sự kiện chính kèm giờ UTC. Nếu tài khoản là tài khoản "admin" dùng chung, hãy nói rõ — đó là một phát hiện (không ai chịu trách nhiệm được cho một tài khoản dùng chung).</p>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Trong <code>2-system-Security-dirty.evtx</code>, IP nào tạo phiên RDP dài nhất, và dài bao lâu (4624 → 4647)?</li>
<li>Trong mẫu SMB, đợt đoán mật khẩu đạt tốc độ cao nhất ở phút nào, bao nhiêu lần thử?</li>
<li>Với từng Sub Status trong mẫu Archive, viết một câu: tấn công hay cấu hình sai, vì sao.</li>
</ol>
<p><strong>Đạt khi:</strong> (1) 47.190.48.109, phiên 0x7ac7caf, 18:16:23 → 20:00:58 = 1 giờ 44 phút 35 giây; (2) phút 16:51, 1 299 lần; (3) psadmin 0xC0000064 từ một máy chủ, đều đặn → tài khoản cũ trong tác vụ/dịch vụ; tài khoản máy 0xC000006A → mật khẩu máy bị lệch; chadkramer một lần từ SLAD1 → một người gõ nhầm.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['4624 / 4625', 'Đăng nhập thành công / thất bại (log Security).'],
  ['4634 / 4647', 'Phiên bị huỷ / người dùng tự đăng xuất.'],
  ['Logon Type', 'Kiểu đăng nhập: 2 bàn phím, 3 mạng, 5 dịch vụ, 10 RDP…'],
  ['TargetLogonId', 'Số hiệu phiên của lần đăng nhập mới — lần theo nó ở các sự kiện sau.'],
  ['Split token', 'Hai lần đăng nhập nối nhau (nâng quyền + giới hạn) của quản trị viên khi bật UAC.'],
  ['Status / Sub Status', 'Mã NTSTATUS giải thích vì sao đăng nhập thất bại.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đọc Logon Type trước, rồi tài khoản, rồi IP + tên máy, rồi Logon ID.</li>
<li>Lần theo một phiên bằng Logon ID; đừng tính thời lượng từ 4634 một cách máy móc.</li>
<li>Sub Status của 4625 phân biệt sai mật khẩu, không có người dùng, bị tắt, bị khoá, bị hạn chế.</li>
<li>Nhịp và nguồn phân biệt tấn công với cấu hình sai; lần thành công đầu tiên sau nhiều lần thất bại là chuông báo động.</li>
</ul>
${nguon('📘', 'Microsoft Learn — 4624(S): An account was successfully logged on', 'Mọi trường, các logon type, khuyến nghị theo dõi', 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4624')}
${nguon('📘', 'Microsoft Learn — 4625(F): An account failed to log on', 'Các mã Status/Sub Status cần theo dõi', 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4625')}
${nguon('📘', '[MS-ERREF] NTSTATUS values', 'Nghĩa chính thức của 0xC000006E và mọi mã khác', 'https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-erref/596a1078-e883-4972-9bbc-49e60bebca55')}
${nguon('📘', 'Microsoft Learn — Quản lý quản trị viên cục bộ trên máy nối Entra ID', 'Vì sao ba SID S-1-12-1 xuất hiện trong Administrators', 'https://learn.microsoft.com/en-us/entra/identity/devices/assign-local-admin')}
${nguon('🛡️', 'MITRE ATT&CK T1110.001 — Password Guessing', 'và T1110.003 Password Spraying', 'https://attack.mitre.org/techniques/T1110/001/')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-4-7-rdp-tu-xa', title: 'Bài 4.7 — Truy cập từ xa: RDP, 1149, 21/24/25', sub: 'Ghép trọn câu chuyện một phiên RDP qua nhiều log', cta: 'Mở bài' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-8-3-auth-log', title: 'Bài 8.3 — auth.log và dò mật khẩu SSH', sub: 'Cùng kiểu đoán mật khẩu nhưng trên Linux', cta: 'Mở bài' })}
</div>
`,
};
