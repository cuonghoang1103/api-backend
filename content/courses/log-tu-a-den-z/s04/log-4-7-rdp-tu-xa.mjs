/**
 * 4.7 — Truy cập từ xa (soạn 24/11/2026, agent lgz). Output thật: OUT['s04/rdp'].
 * Số tất định: rdp-21-25 (EC2AMAZ-3NFFVNI, 22/11/2024): 21×5, 22×5, 23×4, 24×6, 25×2, 40×8 (Reason 0×2, 5×2, 12×4), 41×5, 42×5; Administrator phiên 2 22:36:23 từ 219.100.37.234 → 24 22:37:06 → 25 22:37:46 → 23 22:38:40; phiên 3; samurai phiên 4/5;
 * hijack FS01 21:01:05.352 cmd /k tscon 2 /dest:rdp-tcp#8 (FS01$, S-1-16-16384) → 4779 admmig RDP-Tcp#8 JUMP01 10.23.23.9 → 4778 admmarsid cùng phiên; 1149: 11 máy trong 2,4 s, admmig từ 10.23.123.11; 4825 svc6test1 × 2.
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '4.7 — Remote access: RDP 4778/4779, TerminalServices 21/24/25 and 1149, SMB and WinRM traces|||4.7 — Truy cập từ xa: RDP 4778/4779, TerminalServices 21/24/25 và 1149, dấu vết SMB và WinRM',
  slug: 'log-4-7-rdp-tu-xa',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Ghép một phiên Remote Desktop qua nhiều log: 1149 (xác thực mạng), 4624 type 10, LocalSessionManager 21/22/24/25/23/40 kèm mã lý do ngắt, Security 4778/4779 (nối lại/ngắt), 4825 bị từ chối RDP. Mẫu thật: máy EC2 bị vào từ một IP công cộng bằng hai tài khoản, chiếm phiên RDP bằng tscon không cần mật khẩu, và một tài khoản RDP vào 11 máy trong 2,4 giây. Dấu vết SMB/WinRM và bảng tra JPCERT.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.7</span>
<h2>Following one Remote Desktop session across four logs</h2>
<p class="lead">Remote Desktop leaves traces in several places, each answering a different question: did the network authentication succeed (1149)? did a logon happen and with which account (4624 type 10)? when did the session start, disconnect, reconnect, end (21/24/25/23)? did someone take over somebody else's session (4778/4779)? This lesson assembles one complete story from real logs, then shows two attacks that only make sense when you read the logs together.</p>

<h3>The everyday picture: a hotel room key</h3>
<p>The front desk checks your ID (1149 — authentication), gives you a key card and logs check-in (21, 4624 type 10). You leave the room without checking out (24 — disconnected); you come back and open the same room (25 — reconnected); you check out (23 — logoff). A stranger who convinces housekeeping to open <em>your</em> room while you are out is a session hijack (4778 with another name on the same room).</p>

${kv([
  ['1149 (RemoteConnectionManager)', 'Network-level authentication succeeded: user, domain, source IP. Not yet a session.'],
  ['4624 type 10 / 4625 type 10', 'Remote interactive logon succeeded / failed (Security).'],
  ['21 / 22 (LocalSessionManager)', 'Session logon succeeded / shell started (with session ID and source address).'],
  ['24 / 25', 'Session disconnected / reconnected.'],
  ['23', 'Session logoff.'],
  ['40', 'Session disconnected, with a reason code.'],
  ['4778 / 4779 (Security)', 'Session reconnected / disconnected — with account, session name, client name and address.'],
  ['4825 (Security)', 'User denied Remote Desktop access (not in Remote Desktop Users).'],
])}

<h3>Step 1 — a full RDP story on a cloud server</h3>
${lenh('s04/rdp', 0)}
${lenh('s04/rdp', 1)}
<p>Yamato Security's sample from a real EC2 instance (November 2024). Read session 2: 22:36:23 <strong>21</strong> logon for Administrator from 219.100.37.234, 22 shell started; 22:37:06 <strong>24</strong> disconnected; 22:37:46 <strong>25</strong> reconnected from the same address; 22:38:40 <strong>23</strong> logoff. Then session 3 (Administrator again), then sessions 4 and 5 as a second account <code>samurai</code> — from the same public IP. One external address using two accounts in 15 minutes: either one admin with two accounts, or someone who knows two passwords. Your next step is Security 4624 type 10 for the same minutes (Logon IDs, Lesson 4.1) and the cloud provider's network logs.</p>
${lenh('s04/rdp', 2)}
<p>Event 40 carries a disconnect reason; Microsoft's <em>ExtendedDisconnectReasonCode</em> list gives the meaning: 0 = no information, 5 = the connection was replaced by another connection (someone reconnected from elsewhere), 12 = the user logged off. Event IDs you see often but rarely need (32, 34, 54…) are internal session-manager steps.</p>
<div class="pitfall co-tieu-de"><p><strong>1149 is not "logged on".</strong> It means the credentials passed the network-level check. The session can still fail. Always confirm with 21 (LocalSessionManager) or 4624 type 10. Conversely, an RDP connection tunnelled through SSH or a port-forward shows a local address (127.0.0.1/::1) in all of these logs — the real source is in the tunnel's own log.</p></div>

<h3>Step 2 — hijacking a session without a password</h3>
${lenh('s04/rdp', 3)}
${lenh('s04/rdp', 4)}
<p>On server FS01 (EVTX-to-MITRE-Attack): a command runs as the <strong>computer account FS01$ (SYSTEM)</strong> with integrity <code>S-1-16-16384</code> (System): <code>tscon 2 /dest:rdp-tcp#8</code>. Within half a second Security writes <strong>4779</strong> — admmig's connection RDP-Tcp#8 from JUMP01 is disconnected — and <strong>4778</strong> — the same RDP-Tcp#8 now belongs to <strong>admmarsid</strong>. Someone with SYSTEM rights attached another user's session (admmarsid's, session 2) to their own RDP window, without knowing admmarsid's password. This is ATT&amp;CK T1563.002 (RDP Hijacking): MITRE notes that with System permissions, <code>tscon.exe</code> hijacks a session "without the need for credentials or prompts to the user". Detection = 4688 tscon running as SYSTEM + 4778 with an account different from the one that connected.</p>

<h3>Step 3 — one account, eleven servers, 2.4 seconds</h3>
${lenh('s04/rdp', 5)}
<p>1149 from eleven different servers (domain controller, SQL, Exchange, PKI, WSUS, ADFS…) for admmig from the same IP, all within 2.4 seconds. A human cannot open eleven RDP windows that fast — this is a script testing a stolen credential against everything (ATT&amp;CK T1078 Valid Accounts, T1021.001 RDP). You only see it if the 1149 logs of all servers are collected centrally (Chapter 15); on each server alone it is one harmless line.</p>
${lenh('s04/rdp', 6)}
<p>4825: <code>svc6test1</code> had valid credentials but is not allowed to use Remote Desktop on this machine. A <em>service account</em> trying interactive RDP is itself suspicious — service accounts should never log on interactively.</p>

<h3>SMB and WinRM traces (other remote doors)</h3>
<ul>
<li><strong>SMB</strong> (file shares, PsExec, many tools): Security 4624 <strong>type 3</strong> on the target, often with 4672 (admin); 5140/5145 for share access if "Detailed File Share" auditing is on; 7045 for PsExec-style service installs (Lesson 4.5).</li>
<li><strong>WinRM / PowerShell Remoting</strong> (<code>Enter-PSSession</code>, <code>Invoke-Command</code>): 4624 type 3 on the target, the log <code>Microsoft-Windows-WinRM/Operational</code> (connections), and the remote code in PowerShell 4104 on the <em>target</em> under the process <code>wsmprovhost.exe</code>.</li>
<li>For a complete map of which tool leaves what on source and destination, JPCERT/CC's research "Detecting Lateral Movement through Tracking Event Logs" tested dozens of tools one by one — keep it as your reference.</li>
</ul>

<h3>On your own Windows PC</h3>
<pre><code class="language-powershell"># Who connected by RDP recently (needs RDP enabled on the machine)
Get-WinEvent -LogName 'Microsoft-Windows-TerminalServices-RemoteConnectionManager/Operational' -MaxEvents 50 -ErrorAction SilentlyContinue |
  Where-Object Id -eq 1149 | ForEach-Object { $x = [xml]$_.ToXml(); [pscustomobject]@{ Time = $_.TimeCreated
    User = $x.Event.UserData.EventXML.Param1; Ip = $x.Event.UserData.EventXML.Param3 } }
Get-WinEvent -LogName 'Microsoft-Windows-TerminalServices-LocalSessionManager/Operational' -MaxEvents 50 -ErrorAction SilentlyContinue |
  Where-Object Id -in 21,23,24,25 | Format-Table TimeCreated, Id, Message -Wrap
qwinsta     # sessions on this machine right now</code></pre>

<h3>🛡️ Attacker's corner: RDP is the front door of ransomware</h3>
<p>Exposed RDP is one of the most abused entry points of ransomware groups; once inside, attackers use RDP again to move between servers (T1021.001) and, with SYSTEM, take over admins' sessions (T1563.002). Defence that the logs can verify: RDP not reachable from the Internet (VPN/gateway) — so 1149/21 from public IPs should be <em>zero</em>; Network Level Authentication on; MFA for remote access; Remote Desktop Users limited to people who need it — so 4825 for service accounts is an alarm; and central collection so that "one account, many servers, seconds apart" is visible.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"Which logs show RDP and what does each add?" — 1149 (auth + IP), 4624/4625 type 10 (logon + Logon ID), 21/24/25/23 (session lifecycle), 4778/4779 (reconnect/disconnect with client name/IP).</li>
<li>"What is RDP session hijacking and how do you detect it?" — tscon as SYSTEM attaching another user's session; 4688 tscon + 4778 with a different account.</li>
<li>"Where does the source IP of RDP appear if the user came through a VPN?" — the VPN's address pool; correlate with the VPN log (Lesson 11.6) for the real user.</li>
<li>"How do you see lateral movement across many servers?" — centralise 1149/4624 type 10/3 and look for one account/IP hitting many hosts in a short time.</li>
</ul>

<h3>At work</h3>
<p>In outsourcing, the team often reaches customer servers through a <strong>jump host</strong> (bastion) by RDP. When the customer's security team asks "who from your company used the jump host on 12/11", the answer comes from exactly these events on the jump host and the targets: 1149/21 with your colleagues' accounts and the VPN IPs, matched with your team's work log. Use personal accounts, never a shared one — otherwise nobody can answer that question.</p>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok"><ol>
<li>In <code>rdp-21-25.evtx</code>, how long did the samurai session 4 last from 21 to 24, and was it ever reconnected?</li>
<li>In the hijack sample, which two fields of 4778/4779 prove that the same connection changed owner?</li>
<li>Write a one-line rule (in words) that would catch Step 3 in a SIEM.</li>
</ol>
<p><strong>Pass:</strong> (1) 22:47:31 → 22:48:01 = 30 s, then 25 reconnect at 22:48:31, logoff 23 at 22:48:45; (2) SessionName RDP-Tcp#8 and ClientName/ClientAddress JUMP01/10.23.23.9 stay the same while AccountName changes admmig → admmarsid; (3) e.g. "one account with 1149 (or 4624 type 10) on ≥ 5 different hosts within 1 minute".</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['1149', 'RDP network authentication succeeded (user, IP).'],
  ['21 / 24 / 25 / 23', 'Session logon / disconnect / reconnect / logoff.'],
  ['4778 / 4779', 'Session reconnected / disconnected (Security), with client name and address.'],
  ['4825', 'Denied Remote Desktop.'],
  ['tscon', 'Tool that attaches a session to a connection; as SYSTEM, no password needed.'],
  ['Jump host', 'Bastion server through which admins reach internal servers.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>One RDP session = 1149 + 4624 type 10 + 21/22 … 24/25 … 23 — read them together.</li>
<li>1149 alone is authentication, not a session; tunnels hide the real IP.</li>
<li>Owner change on the same RDP-Tcp# with tscon as SYSTEM = hijack.</li>
<li>Lateral movement is visible only when many machines' logs are in one place.</li>
</ul>
${nguon('🗾', 'JPCERT/CC — Detecting Lateral Movement through Tracking Event Logs', 'Which tool leaves which event, tested tool by tool', 'https://www.jpcert.or.jp/english/pub/sr/ir_research.html')}
${nguon('📘', 'Microsoft Learn — ExtendedDisconnectReasonCode', 'Meaning of the reason in event 40', 'https://learn.microsoft.com/en-us/windows/win32/termserv/extendeddisconnectreasoncode')}
${nguon('📘', 'Microsoft Learn — 4778(S): A session was reconnected to a Window Station', 'Fields of 4778/4779', 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4778')}
${nguon('🛡️', 'MITRE ATT&CK T1563.002 — RDP Hijacking', 'tscon as SYSTEM, no credentials needed', 'https://attack.mitre.org/techniques/T1563/002/')}
${nguon('🛡️', 'MITRE ATT&CK T1021.001 — Remote Desktop Protocol', 'and T1078 Valid Accounts', 'https://attack.mitre.org/techniques/T1021/001/')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-11-6-vpn', title: 'Lesson 11.6 — VPN logs', sub: 'Turn a VPN pool address into a person', cta: 'Open' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-15-4-windows-ve-trung-tam', title: 'Lesson 15.4 — Bringing Windows logs to the centre', sub: 'So that "one account, many servers" becomes visible', cta: 'Open' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.7</span>
<h2>Lần theo một phiên Remote Desktop qua bốn cuốn log</h2>
<p class="lead">Remote Desktop để lại dấu ở nhiều nơi, mỗi nơi trả lời một câu hỏi khác: xác thực tầng mạng có qua không (1149)? có đăng nhập không và bằng tài khoản nào (4624 type 10)? phiên bắt đầu, ngắt, nối lại, kết thúc lúc nào (21/24/25/23)? có ai chiếm phiên của người khác không (4778/4779)? Bài này ghép một câu chuyện hoàn chỉnh từ log thật, rồi chỉ ra hai kiểu tấn công chỉ hiểu được khi đọc các log cùng nhau.</p>

<h3>Liên tưởng đời thường: thẻ phòng khách sạn</h3>
<p>Lễ tân kiểm giấy tờ (1149 — xác thực), đưa thẻ phòng và ghi nhận phòng (21, 4624 type 10). Bạn rời phòng mà không trả phòng (24 — ngắt kết nối); bạn quay lại mở đúng phòng đó (25 — nối lại); bạn trả phòng (23 — đăng xuất). Một người lạ thuyết phục được nhân viên buồng phòng mở phòng <em>của bạn</em> khi bạn vắng mặt là chiếm phiên (4778 với một cái tên khác trên cùng một phòng).</p>

${kv([
  ['1149 (RemoteConnectionManager)', 'Xác thực tầng mạng thành công: người dùng, domain, IP nguồn. Chưa phải là phiên.'],
  ['4624 type 10 / 4625 type 10', 'Đăng nhập tương tác từ xa thành công / thất bại (Security).'],
  ['21 / 22 (LocalSessionManager)', 'Đăng nhập phiên thành công / shell đã chạy (kèm số phiên và địa chỉ nguồn).'],
  ['24 / 25', 'Phiên bị ngắt / được nối lại.'],
  ['23', 'Phiên đăng xuất.'],
  ['40', 'Phiên bị ngắt, kèm mã lý do.'],
  ['4778 / 4779 (Security)', 'Phiên được nối lại / bị ngắt — kèm tài khoản, tên phiên, tên và địa chỉ máy khách.'],
  ['4825 (Security)', 'Người dùng bị từ chối Remote Desktop (không thuộc Remote Desktop Users).'],
])}

<h3>Bước 1 — trọn một câu chuyện RDP trên máy chủ cloud</h3>
${lenh('s04/rdp', 0)}
${lenh('s04/rdp', 1)}
<p>Mẫu của Yamato Security từ một máy EC2 thật (tháng 11/2024). Đọc phiên 2: 22:36:23 <strong>21</strong> Administrator đăng nhập từ 219.100.37.234, 22 shell chạy; 22:37:06 <strong>24</strong> ngắt; 22:37:46 <strong>25</strong> nối lại từ cùng địa chỉ; 22:38:40 <strong>23</strong> đăng xuất. Rồi phiên 3 (lại Administrator), rồi phiên 4 và 5 bằng tài khoản thứ hai <code>samurai</code> — từ cùng một IP công cộng. Một địa chỉ bên ngoài dùng hai tài khoản trong 15 phút: hoặc là một quản trị viên có hai tài khoản, hoặc là ai đó biết hai mật khẩu. Bước tiếp theo của bạn là Security 4624 type 10 trong cùng những phút đó (Logon ID, Bài 4.1) và log mạng của nhà cung cấp cloud.</p>
${lenh('s04/rdp', 2)}
<p>Sự kiện 40 mang mã lý do ngắt; danh sách <em>ExtendedDisconnectReasonCode</em> của Microsoft cho biết nghĩa: 0 = không có thông tin, 5 = kết nối bị một kết nối khác thay thế (có người nối lại từ nơi khác), 12 = người dùng đã đăng xuất. Các Event ID bạn hay thấy nhưng hiếm khi cần (32, 34, 54…) là các bước nội bộ của bộ quản lý phiên.</p>
<div class="pitfall co-tieu-de"><p><strong>1149 không phải là "đã đăng nhập".</strong> Nó nghĩa là thông tin đăng nhập đã qua bước kiểm ở tầng mạng. Phiên vẫn có thể hỏng. Luôn xác nhận bằng 21 (LocalSessionManager) hoặc 4624 type 10. Ngược lại, một kết nối RDP đi qua đường hầm SSH hoặc chuyển tiếp cổng hiện địa chỉ cục bộ (127.0.0.1/::1) ở tất cả các log này — nguồn thật nằm trong log của chính đường hầm.</p></div>

<h3>Bước 2 — chiếm một phiên mà không cần mật khẩu</h3>
${lenh('s04/rdp', 3)}
${lenh('s04/rdp', 4)}
<p>Trên máy chủ FS01 (EVTX-to-MITRE-Attack): một câu lệnh chạy dưới <strong>tài khoản máy FS01$ (SYSTEM)</strong> với mức toàn vẹn <code>S-1-16-16384</code> (System): <code>tscon 2 /dest:rdp-tcp#8</code>. Trong nửa giây, Security ghi <strong>4779</strong> — kết nối RDP-Tcp#8 của admmig từ JUMP01 bị ngắt — và <strong>4778</strong> — cùng RDP-Tcp#8 đó giờ thuộc về <strong>admmarsid</strong>. Ai đó có quyền SYSTEM đã gắn phiên của người khác (phiên 2 của admmarsid) vào cửa sổ RDP của chính mình, mà không cần biết mật khẩu của admmarsid. Đây là ATT&amp;CK T1563.002 (RDP Hijacking): MITRE ghi rằng với quyền System, <code>tscon.exe</code> chiếm được phiên "không cần thông tin đăng nhập hay hỏi người dùng". Phát hiện = 4688 tscon chạy dưới SYSTEM + 4778 với tài khoản khác tài khoản đã kết nối.</p>

<h3>Bước 3 — một tài khoản, mười một máy chủ, 2,4 giây</h3>
${lenh('s04/rdp', 5)}
<p>1149 từ mười một máy chủ khác nhau (domain controller, SQL, Exchange, PKI, WSUS, ADFS…) cho admmig từ cùng một IP, tất cả trong 2,4 giây. Không con người nào mở mười một cửa sổ RDP nhanh như vậy — đây là một script thử thông tin đăng nhập đánh cắp được trên mọi máy (ATT&amp;CK T1078 Valid Accounts, T1021.001 RDP). Bạn chỉ thấy được nếu log 1149 của mọi máy chủ được gom về một chỗ (Chương 15); trên từng máy riêng lẻ, nó chỉ là một dòng vô hại.</p>
${lenh('s04/rdp', 6)}
<p>4825: <code>svc6test1</code> có thông tin đăng nhập đúng nhưng không được phép dùng Remote Desktop trên máy này. Bản thân việc một <em>tài khoản dịch vụ</em> thử RDP tương tác đã đáng ngờ — tài khoản dịch vụ không bao giờ nên đăng nhập tương tác.</p>

<h3>Dấu vết SMB và WinRM (các cửa từ xa khác)</h3>
<ul>
<li><strong>SMB</strong> (thư mục chia sẻ, PsExec, nhiều công cụ): Security 4624 <strong>type 3</strong> trên máy đích, thường kèm 4672 (quản trị); 5140/5145 khi truy cập thư mục chia sẻ nếu bật kiểm toán "Detailed File Share"; 7045 cho kiểu cài dịch vụ của PsExec (Bài 4.5).</li>
<li><strong>WinRM / PowerShell Remoting</strong> (<code>Enter-PSSession</code>, <code>Invoke-Command</code>): 4624 type 3 trên máy đích, log <code>Microsoft-Windows-WinRM/Operational</code> (kết nối), và mã chạy từ xa nằm trong PowerShell 4104 trên <em>máy đích</em> dưới tiến trình <code>wsmprovhost.exe</code>.</li>
<li>Để có bản đồ đầy đủ công cụ nào để lại gì ở máy nguồn và máy đích, nghiên cứu "Detecting Lateral Movement through Tracking Event Logs" của JPCERT/CC đã thử từng công cụ một — giữ nó làm tài liệu tra cứu.</li>
</ul>

<h3>Trên máy Windows của bạn</h3>
<pre><code class="language-powershell"># Ai đã kết nối RDP gần đây (máy phải đang bật RDP)
Get-WinEvent -LogName 'Microsoft-Windows-TerminalServices-RemoteConnectionManager/Operational' -MaxEvents 50 -ErrorAction SilentlyContinue |
  Where-Object Id -eq 1149 | ForEach-Object { $x = [xml]$_.ToXml(); [pscustomobject]@{ Luc = $_.TimeCreated
    User = $x.Event.UserData.EventXML.Param1; Ip = $x.Event.UserData.EventXML.Param3 } }
Get-WinEvent -LogName 'Microsoft-Windows-TerminalServices-LocalSessionManager/Operational' -MaxEvents 50 -ErrorAction SilentlyContinue |
  Where-Object Id -in 21,23,24,25 | Format-Table TimeCreated, Id, Message -Wrap
qwinsta     # các phiên đang có trên máy lúc này</code></pre>

<h3>🛡️ Góc hacker: RDP là cửa chính của mã độc tống tiền</h3>
<p>RDP phơi ra Internet là một trong những lối vào bị các nhóm mã độc tống tiền lạm dụng nhiều nhất; vào được rồi, chúng lại dùng RDP để đi giữa các máy chủ (T1021.001) và, khi có SYSTEM, chiếm phiên của quản trị viên (T1563.002). Những biện pháp phòng thủ mà log kiểm chứng được: RDP không với tới từ Internet (VPN/cổng trung gian) — nên 1149/21 từ IP công cộng phải bằng <em>không</em>; bật Network Level Authentication; MFA cho truy cập từ xa; Remote Desktop Users chỉ gồm người cần — nên 4825 của tài khoản dịch vụ là chuông báo; và gom log tập trung để "một tài khoản, nhiều máy chủ, cách nhau vài giây" hiện ra.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"Log nào cho thấy RDP và mỗi log thêm được gì?" — 1149 (xác thực + IP), 4624/4625 type 10 (đăng nhập + Logon ID), 21/24/25/23 (vòng đời phiên), 4778/4779 (nối lại/ngắt kèm tên máy khách/IP).</li>
<li>"Chiếm phiên RDP là gì và phát hiện thế nào?" — tscon dưới SYSTEM gắn phiên của người khác; 4688 tscon + 4778 với tài khoản khác.</li>
<li>"Nếu người dùng vào qua VPN thì IP nguồn của RDP là gì?" — địa chỉ trong dải của VPN; đối chiếu log VPN (Bài 11.6) để ra người thật.</li>
<li>"Thấy di chuyển ngang trên nhiều máy chủ thế nào?" — gom 1149/4624 type 10/3 về một chỗ và tìm một tài khoản/IP chạm nhiều máy trong thời gian ngắn.</li>
</ul>

<h3>Đi làm thật</h3>
<p>Trong outsourcing, đội thường vào máy chủ của khách qua một <strong>jump host</strong> (máy trung chuyển, bastion) bằng RDP. Khi đội bảo mật của khách hỏi "ngày 12/11 những ai bên công ty anh đã dùng jump host", câu trả lời đến từ đúng những sự kiện này trên jump host và các máy đích: 1149/21 với tài khoản của đồng nghiệp bạn và IP của VPN, ghép với nhật ký công việc của đội. Dùng tài khoản cá nhân, đừng bao giờ dùng tài khoản chung — nếu không, chẳng ai trả lời được câu hỏi đó.</p>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
<li>Trong <code>rdp-21-25.evtx</code>, phiên 4 của samurai kéo dài bao lâu từ 21 tới 24, và có được nối lại không?</li>
<li>Trong mẫu chiếm phiên, hai trường nào của 4778/4779 chứng minh cùng một kết nối đã đổi chủ?</li>
<li>Viết một luật một dòng (bằng lời) bắt được Bước 3 trong SIEM.</li>
</ol>
<p><strong>Đạt khi:</strong> (1) 22:47:31 → 22:48:01 = 30 giây, rồi 25 nối lại lúc 22:48:31, đăng xuất 23 lúc 22:48:45; (2) SessionName RDP-Tcp#8 và ClientName/ClientAddress JUMP01/10.23.23.9 giữ nguyên trong khi AccountName đổi từ admmig sang admmarsid; (3) ví dụ "một tài khoản có 1149 (hoặc 4624 type 10) trên ≥ 5 máy khác nhau trong 1 phút".</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['1149', 'Xác thực mạng RDP thành công (người dùng, IP).'],
  ['21 / 24 / 25 / 23', 'Đăng nhập phiên / ngắt / nối lại / đăng xuất.'],
  ['4778 / 4779', 'Phiên được nối lại / bị ngắt (Security), kèm tên và địa chỉ máy khách.'],
  ['4825', 'Bị từ chối Remote Desktop.'],
  ['tscon', 'Công cụ gắn một phiên vào một kết nối; dưới SYSTEM thì không cần mật khẩu.'],
  ['Jump host', 'Máy chủ trung chuyển để quản trị viên vào các máy chủ nội bộ.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một phiên RDP = 1149 + 4624 type 10 + 21/22 … 24/25 … 23 — đọc cùng nhau.</li>
<li>Riêng 1149 là xác thực, chưa phải phiên; đường hầm giấu IP thật.</li>
<li>Đổi chủ trên cùng RDP-Tcp# với tscon dưới SYSTEM = chiếm phiên.</li>
<li>Di chuyển ngang chỉ hiện ra khi log của nhiều máy nằm ở một chỗ.</li>
</ul>
${nguon('🗾', 'JPCERT/CC — Detecting Lateral Movement through Tracking Event Logs', 'Công cụ nào để lại sự kiện nào, thử từng công cụ', 'https://www.jpcert.or.jp/english/pub/sr/ir_research.html')}
${nguon('📘', 'Microsoft Learn — ExtendedDisconnectReasonCode', 'Nghĩa của mã lý do ở sự kiện 40', 'https://learn.microsoft.com/en-us/windows/win32/termserv/extendeddisconnectreasoncode')}
${nguon('📘', 'Microsoft Learn — 4778(S): A session was reconnected to a Window Station', 'Các trường của 4778/4779', 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4778')}
${nguon('🛡️', 'MITRE ATT&CK T1563.002 — RDP Hijacking', 'tscon dưới SYSTEM, không cần mật khẩu', 'https://attack.mitre.org/techniques/T1563/002/')}
${nguon('🛡️', 'MITRE ATT&CK T1021.001 — Remote Desktop Protocol', 'và T1078 Valid Accounts', 'https://attack.mitre.org/techniques/T1021/001/')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-11-6-vpn', title: 'Bài 11.6 — Log VPN', sub: 'Đổi một địa chỉ trong dải VPN thành một con người', cta: 'Mở bài' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-15-4-windows-ve-trung-tam', title: 'Bài 15.4 — Đưa log Windows về trung tâm', sub: 'Để "một tài khoản, nhiều máy chủ" hiện ra', cta: 'Mở bài' })}
</div>
`,
};
