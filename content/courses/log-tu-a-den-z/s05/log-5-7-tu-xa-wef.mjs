/**
 * 5.7 — Đọc log máy khác: Get-WinEvent -ComputerName, Invoke-Command, Windows Event Forwarding (soạn 24/11/2026, agent lgz). Không có miền Windows ⇒ lệnh từ xa/WEF là khối mã.
 * Output thật: OUT['s05/tu-xa-wef'] — mau/Archive-ForwardedEvents-test.evtx (bản lưu kênh ForwardedEvents của một máy gom thật, saclink.csus.edu).
 * Số tất định: slad1 Security 584 (23:20:54→23:21:26 UTC), slad3 Security 66 (00:16:05→00:16:08), AA-PH-6L8JKH2 Application 2 + System 1 (00:01:08→00:04:33); 653/653 có Message;
 * RenderingInfo Culture en-US, Task Logon, Keyword Audit Failure; 4625: 71 psadmin←10.115.247.239, 56 CTX-WS16-FS-T3$←10.115.55.139, 2 psadmin←.238, 1 chadkramer←130.86.9.236 (đều slad1).
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '5.7 — Reading other machines: Get-WinEvent -ComputerName, Windows Event Forwarding basics|||5.7 — Đọc log máy khác: Get-WinEvent -ComputerName, nhập môn Windows Event Forwarding',
  slug: 'log-5-7-tu-xa-wef',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Từ một máy đọc log của nhiều máy: Event Viewer "Connect to Another Computer", Get-WinEvent -ComputerName (RPC) và Invoke-Command (WinRM) chạy song song trên 20 máy chủ, nhóm Event Log Readers thay cho quyền quản trị. Rồi Windows Event Forwarding — có sẵn trong Windows, không cần agent: máy gom, subscription, source-initiated qua GPO, định dạng RenderedText, kênh ForwardedEvents. Đọc bản lưu ForwardedEvents thật của một trường đại học: ba máy, ba kênh, mọi sự kiện mang sẵn câu Message.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.7</span>
<h2>One console, many machines</h2>
<p class="lead">An incident never stays on one computer. You need the same query on the web server, the database server and three workstations — and you need the logs to survive even if the attacker clears them locally (Lesson 5.4). Windows offers two built-in answers: <strong>pull</strong> (read remote logs on demand) and <strong>push</strong> (Windows Event Forwarding sends selected events to a collector continuously).</p>

<h3>The everyday picture: phoning each branch vs. the daily report</h3>
<p>Pull is calling every branch office and asking "read me today's visitor book" — fine for one question, slow for twenty branches, and useless if a branch's book has been torn up. Push is every branch faxing the important pages to head office as they are written: head office has a copy even if a branch burns down.</p>

${kv([
  ['Get-WinEvent -ComputerName', 'Pull over RPC (Remote Event Log Management firewall rules). One server at a time.'],
  ['Invoke-Command { Get-WinEvent … }', 'Pull over WinRM (5985/5986): the query runs ON each server, in parallel; only results travel.'],
  ['Event Log Readers', 'Built-in local group: may read event logs without being administrator.'],
  ['WEF', 'Windows Event Forwarding: sources push events to a collector over WinRM.'],
  ['WEC / collector', 'The machine receiving events, service "Windows Event Collector" (wecsvc), tool wecutil.'],
  ['Subscription', 'Which events (XPath, Lesson 5.3), from which machines, how often, in which format.'],
  ['ForwardedEvents', 'Default destination log on the collector.'],
])}

<h3>Step 1 — pull, the quick way (Windows, domain or same credentials)</h3>
<pre><code class="language-powershell"># One remote server over RPC (firewall group "Remote Event Log Management" must be allowed)
Get-WinEvent -ComputerName SRV-WEB01 -FilterHashtable @{ LogName = 'System'; Level = 1, 2; StartTime = (Get-Date).AddHours(-24) }

# Twenty servers in parallel over WinRM — the query runs on each server, only results come back
$may = Get-Content .\\servers.txt
Invoke-Command -ComputerName $may -ScriptBlock {
  Get-WinEvent -FilterHashtable @{ LogName = 'Security'; Id = 4625; StartTime = (Get-Date).AddHours(-24) } -ErrorAction SilentlyContinue |
    Select-Object TimeCreated, @{n='User'; e={ $_.Properties[5].Value }}, @{n='Ip'; e={ $_.Properties[19].Value }}
} | Group-Object PSComputerName, User, Ip | Sort-Object Count -Descending | Select-Object -First 20 Count, Name

# Least privilege: let a monitoring account read logs without making it admin
Add-LocalGroupMember -Group 'Event Log Readers' -Member 'CONTOSO\\svc-monitor'

# cmd: the same with wevtutil
wevtutil qe System /r:SRV-WEB01 /q:"*[System[Level=2]]" /c:5 /rd:true /f:text</code></pre>
<p><code>Invoke-Command</code> adds a <code>PSComputerName</code> property to every result — your "which server" column for free. It is the better choice beyond two or three machines: each server filters its own log, and they run at the same time.</p>

<h3>Step 2 — push: how WEF works</h3>
<ol>
<li><strong>Collector</strong>: run <code>wecutil qc</code> (starts the Windows Event Collector service), create a subscription (Event Viewer › Subscriptions, or <code>wecutil cs subscription.xml</code>).</li>
<li><strong>Sources</strong>: in a domain, a GPO "Configure target Subscription Manager" = <code>Server=http://wec.contoso.local:5985/wsman/SubscriptionManager/WEC,Refresh=60</code>, WinRM enabled. This is <em>source-initiated</em>: machines find the collector themselves — new servers join automatically.</li>
<li><strong>Permissions</strong>: the forwarding runs as Network Service, which must be allowed to read Security — Microsoft's guidance is to add it to <strong>Event Log Readers</strong> on the sources.</li>
<li><strong>Subscription content</strong>: an XPath QueryList (Lesson 5.3) — e.g. 4624/4625/4688/4719/1102/7045, Sysmon 1/3/10. Delivery: Normal, Minimize Bandwidth, Minimize Latency (or Custom via wecutil). Format: <em>Events</em> or <em>RenderedText</em> (adds the Message text).</li>
</ol>
<pre><code class="language-bat">:: On the collector
wecutil qc /q
wecutil es
wecutil gs "Bao-mat-co-ban"
wecutil gr "Bao-mat-co-ban"
:: ForwardedEvents is small by default — give it room
wevtutil sl ForwardedEvents /ms:4294967296

:: On a source: is WinRM up and does it see the subscription manager?
winrm quickconfig -q
gpresult /r | findstr /i "Subscription"</code></pre>
<p><code>wecutil gr</code> (get runtime status) lists each source with its last heartbeat — the first thing to check when "machine X sends nothing".</p>

<h3>Step 3 — what a collector's log looks like</h3>
<p>The sample is a real archived ForwardedEvents log from a university domain (saclink.csus.edu), published in EVTX-ATTACK-SAMPLES:</p>
${lenh('s05/tu-xa-wef', 0)}
${lenh('s05/tu-xa-wef', 1)}
<p>One file, three machines, three original channels. Each event keeps its <strong>original</strong> <code>LogName</code> (Security, System, Application) and <code>MachineName</code> — forwarding does not rewrite them; that is how you filter per server on the collector. The time windows are short slices (32 seconds of slad1, 3 seconds of slad3): the archive was taken from a busy collector whose ForwardedEvents log was overwriting old events — the same retention problem as Lesson 3.5, now for the whole fleet.</p>

<h3>Step 4 — RenderedText: the Message travels with the event</h3>
${lenh('s05/tu-xa-wef', 3)}
${lenh('s05/tu-xa-wef', 2)}
${lenh('s05/tu-xa-wef', 4)}
<p>All 653 events carry a <code>&lt;RenderingInfo&gt;</code> block: Message, and the display names of Level, Task (<em>Logon</em> for 12544 — the mapping Lesson 5.5 used), Opcode and Keywords. The subscription used <strong>RenderedText</strong>, so the text was rendered <em>on the source</em>, where the provider DLLs exist. That is why Get-WinEventMau, on Linux, finally shows a Message (Lesson 5.1, Step 4). The price: each event is several times bigger on the wire and on disk.</p>

<h3>Step 5 — answer a question across machines</h3>
${lenh('s05/tu-xa-wef', 5)}
<p>All failures come from one server, slad1, and the grouping by <code>MachineName</code> + IP + user is the cross-machine view you would otherwise assemble from 20 separate pulls. In Chapter 15 the same events go one step further — from the collector into ELK or Loki with an agent (Lesson 15.4).</p>

<h3>🛡️ Attacker's corner: evidence that has already left the building</h3>
<p>Every log-clearing story in this course (NotPetya, Olympic Destroyer, the 149-wevtutil loop of Lesson 5.4) ends the same way for a forwarded machine: the local log is empty, the collector still has everything up to the last delivery (seconds with Minimize Latency, up to 15 minutes with Normal batching). Attackers know it: after gaining admin rights they may stop WinRM or the forwarder, block the collector's port, or go after the collector itself. So monitor <em>silence</em> — a source whose last heartbeat is older than an hour (<code>wecutil gr</code>, or a "no events from host X" alert in your SIEM) is an incident until proven otherwise. Microsoft's WEF guide and Palantir's public WEF repository are the two references most blue teams start from.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"How do you check failed logons on 20 servers at once?" — <code>Invoke-Command -ComputerName …</code> with a FilterHashtable inside; group by PSComputerName.</li>
<li>"What is WEF and why use it if you have an agent?" — built-in push forwarding over WinRM, no software to install; good first step or a feed for the SIEM agent on the collector.</li>
<li>"Source-initiated vs collector-initiated?" — sources find the collector via GPO (scales, new machines auto-join) vs collector polls a fixed list.</li>
<li>"An admin cleared Security on a server. What do you still have?" — whatever WEF/agent already delivered, the 1102 (if forwarded), and the gap itself.</li>
</ul>

<h3>At work</h3>
<p>In outsourcing projects, you are often given an account in <strong>Event Log Readers</strong> (not admin) on the customer's servers, or read access to their collector/SIEM — know how to work within that: Invoke-Command and Get-WinEvent work with read rights; clearing or resizing logs does not (and should not). When you design a system for a Windows customer, list in the deployment document which events your application writes (Chapter 10) so they can add them to the WEF subscription.</p>

<h3>🧪 Practice (20 min)</h3>
<div class="callout ok"><ol>
<li>From the sample, count events per <code>MachineName</code> and <code>LogName</code> and state which machine sent Application events. Why might a collector show System/Application for workstations but only Security for servers?</li>
<li>Write a WEF subscription QueryList that forwards 4625, 4720, 4728, 4732, 1102 from Security and 7045 from System.</li>
<li>Explain in two sentences why <code>Invoke-Command</code> is faster than looping <code>Get-WinEvent -ComputerName</code> over 20 servers.</li>
</ol>
<p><strong>Pass:</strong> (1) slad1 584 / slad3 66 Security; AA-PH-6L8JKH2 2 Application + 1 System — subscriptions are per group of machines with different QueryLists; (2) two <code>&lt;Select&gt;</code> elements, Path="Security" with <code>EventID=4625 or …</code> and Path="System" with <code>EventID=7045</code>; (3) the filter runs on every server in parallel and only results cross the network, while the loop works one server after another.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Pull / push', 'Read remote logs on demand / forward events continuously.'],
  ['Invoke-Command', 'Run the query on many machines over WinRM, in parallel.'],
  ['WEF / WEC', 'Windows Event Forwarding / Collector.'],
  ['Source-initiated', 'Sources find the collector through GPO.'],
  ['RenderedText', 'Subscription format that carries the Message.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Pull with Invoke-Command for questions; push with WEF for evidence.</li>
<li>Event Log Readers instead of admin rights.</li>
<li>Forwarded events keep their original LogName and MachineName; RenderedText carries Message.</li>
<li>Size ForwardedEvents and monitor sources that go silent.</li>
</ul>
${nguon('📘', 'Microsoft Learn — Use Windows Event Forwarding to help with intrusion detection', 'Architecture, subscriptions, Event Log Readers, delivery options', 'https://learn.microsoft.com/en-us/windows/security/operating-system-security/device-management/use-windows-event-forwarding-to-assist-in-intrusion-detection')}
${nguon('📘', 'Microsoft Learn — wecutil', 'Collector commands: qc, cs, es, gs, gr', 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/wecutil')}
${nguon('🧰', 'Palantir — windows-event-forwarding', 'Public subscriptions and deployment notes', 'https://github.com/palantir/windows-event-forwarding')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-15-4-windows-ve-trung-tam', title: 'Lesson 15.4 — Windows events to the central store', sub: 'Winlogbeat, Grafana Alloy, NXLog with TLS', cta: 'Open' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-5-8-lab', title: 'Lab 5 — A PowerShell morning report', sub: 'Put the chapter together', cta: 'Next' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.7</span>
<h2>Một màn hình, nhiều máy</h2>
<p class="lead">Sự cố không bao giờ nằm yên trên một máy. Bạn cần cùng một truy vấn trên máy chủ web, máy chủ CSDL và ba máy trạm — và cần log còn sống kể cả khi kẻ tấn công xoá nó tại chỗ (Bài 5.4). Windows có sẵn hai câu trả lời: <strong>kéo</strong> (đọc log máy xa khi cần) và <strong>đẩy</strong> (Windows Event Forwarding liên tục gửi các sự kiện đã chọn về một máy gom).</p>

<h3>Liên tưởng đời thường: gọi điện từng chi nhánh so với báo cáo hằng ngày</h3>
<p>Kéo là gọi cho từng chi nhánh và bảo "đọc cho tôi sổ khách hôm nay" — ổn cho một câu hỏi, chậm với hai mươi chi nhánh, và vô dụng nếu sổ của một chi nhánh đã bị xé. Đẩy là mọi chi nhánh fax các trang quan trọng về trụ sở ngay khi viết xong: trụ sở vẫn có bản sao kể cả khi chi nhánh cháy.</p>

${kv([
  ['Get-WinEvent -ComputerName', 'Kéo qua RPC (luật tường lửa Remote Event Log Management). Mỗi lần một máy chủ.'],
  ['Invoke-Command { Get-WinEvent … }', 'Kéo qua WinRM (5985/5986): truy vấn chạy NGAY TRÊN từng máy chủ, song song; chỉ kết quả đi qua mạng.'],
  ['Event Log Readers', 'Nhóm cục bộ dựng sẵn: được đọc log sự kiện mà không cần là quản trị viên.'],
  ['WEF', 'Windows Event Forwarding: máy nguồn đẩy sự kiện tới máy gom qua WinRM.'],
  ['WEC / máy gom', 'Máy nhận sự kiện, dịch vụ "Windows Event Collector" (wecsvc), công cụ wecutil.'],
  ['Subscription', 'Sự kiện nào (XPath, Bài 5.3), từ máy nào, bao lâu một lần, định dạng gì.'],
  ['ForwardedEvents', 'Log đích mặc định trên máy gom.'],
])}

<h3>Bước 1 — kéo, cách nhanh (Windows, cùng miền hoặc cùng thông tin đăng nhập)</h3>
<pre><code class="language-powershell"># Một máy chủ xa qua RPC (nhóm luật tường lửa "Remote Event Log Management" phải được cho phép)
Get-WinEvent -ComputerName SRV-WEB01 -FilterHashtable @{ LogName = 'System'; Level = 1, 2; StartTime = (Get-Date).AddHours(-24) }

# Hai mươi máy chủ song song qua WinRM — truy vấn chạy trên từng máy, chỉ kết quả quay về
$may = Get-Content .\\servers.txt
Invoke-Command -ComputerName $may -ScriptBlock {
  Get-WinEvent -FilterHashtable @{ LogName = 'Security'; Id = 4625; StartTime = (Get-Date).AddHours(-24) } -ErrorAction SilentlyContinue |
    Select-Object TimeCreated, @{n='User'; e={ $_.Properties[5].Value }}, @{n='Ip'; e={ $_.Properties[19].Value }}
} | Group-Object PSComputerName, User, Ip | Sort-Object Count -Descending | Select-Object -First 20 Count, Name

# Quyền tối thiểu: cho tài khoản giám sát đọc log mà không cần làm quản trị viên
Add-LocalGroupMember -Group 'Event Log Readers' -Member 'CONTOSO\\svc-monitor'

# cmd: cùng việc đó với wevtutil
wevtutil qe System /r:SRV-WEB01 /q:"*[System[Level=2]]" /c:5 /rd:true /f:text</code></pre>
<p><code>Invoke-Command</code> gắn thêm thuộc tính <code>PSComputerName</code> vào mọi kết quả — cột "máy nào" có sẵn. Đó là lựa chọn tốt hơn khi quá hai ba máy: mỗi máy chủ tự lọc log của mình, và chúng chạy cùng lúc.</p>

<h3>Bước 2 — đẩy: WEF hoạt động thế nào</h3>
<ol>
<li><strong>Máy gom</strong>: chạy <code>wecutil qc</code> (khởi động dịch vụ Windows Event Collector), tạo subscription (Event Viewer › Subscriptions, hoặc <code>wecutil cs subscription.xml</code>).</li>
<li><strong>Máy nguồn</strong>: trong miền, một GPO "Configure target Subscription Manager" = <code>Server=http://wec.contoso.local:5985/wsman/SubscriptionManager/WEC,Refresh=60</code>, bật WinRM. Đây là kiểu <em>source-initiated</em>: các máy tự tìm máy gom — máy chủ mới tự động tham gia.</li>
<li><strong>Quyền</strong>: việc chuyển tiếp chạy dưới Network Service, tài khoản này phải được đọc Security — hướng dẫn của Microsoft là thêm nó vào <strong>Event Log Readers</strong> trên máy nguồn.</li>
<li><strong>Nội dung subscription</strong>: một QueryList XPath (Bài 5.3) — ví dụ 4624/4625/4688/4719/1102/7045, Sysmon 1/3/10. Cách giao: Normal, Minimize Bandwidth, Minimize Latency (hoặc Custom qua wecutil). Định dạng: <em>Events</em> hoặc <em>RenderedText</em> (thêm câu Message).</li>
</ol>
<pre><code class="language-bat">:: Trên máy gom
wecutil qc /q
wecutil es
wecutil gs "Bao-mat-co-ban"
wecutil gr "Bao-mat-co-ban"
:: ForwardedEvents mặc định nhỏ — cho nó thêm chỗ
wevtutil sl ForwardedEvents /ms:4294967296

:: Trên máy nguồn: WinRM chạy chưa, có thấy subscription manager không?
winrm quickconfig -q
gpresult /r | findstr /i "Subscription"</code></pre>
<p><code>wecutil gr</code> (get runtime status) liệt kê từng máy nguồn kèm nhịp tim gần nhất — thứ đầu tiên cần kiểm khi "máy X không gửi gì".</p>

<h3>Bước 3 — log của một máy gom trông thế nào</h3>
<p>Mẫu là một bản lưu ForwardedEvents thật từ miền của một trường đại học (saclink.csus.edu), công bố trong EVTX-ATTACK-SAMPLES:</p>
${lenh('s05/tu-xa-wef', 0)}
${lenh('s05/tu-xa-wef', 1)}
<p>Một tệp, ba máy, ba kênh gốc. Mỗi sự kiện giữ nguyên <code>LogName</code> <strong>gốc</strong> (Security, System, Application) và <code>MachineName</code> — chuyển tiếp không viết lại chúng; đó là cách lọc theo từng máy chủ trên máy gom. Các khung giờ là những lát cắt ngắn (32 giây của slad1, 3 giây của slad3): bản lưu được lấy từ một máy gom bận rộn có log ForwardedEvents đang ghi đè sự kiện cũ — cùng bài toán thời gian lưu giữ của Bài 3.5, giờ là cho cả đội máy.</p>

<h3>Bước 4 — RenderedText: câu Message đi theo sự kiện</h3>
${lenh('s05/tu-xa-wef', 3)}
${lenh('s05/tu-xa-wef', 2)}
${lenh('s05/tu-xa-wef', 4)}
<p>Cả 653 sự kiện đều mang khối <code>&lt;RenderingInfo&gt;</code>: Message, và tên hiển thị của Level, Task (<em>Logon</em> cho 12544 — bảng ánh xạ mà Bài 5.5 đã dùng), Opcode và Keywords. Subscription dùng <strong>RenderedText</strong>, nên câu chữ được ghép <em>ngay trên máy nguồn</em>, nơi có DLL của nhà cung cấp. Đó là lý do Get-WinEventMau, trên Linux, cuối cùng cũng hiện được Message (Bài 5.1, Bước 4). Cái giá: mỗi sự kiện to gấp mấy lần trên đường truyền và trên đĩa.</p>

<h3>Bước 5 — trả lời một câu hỏi xuyên nhiều máy</h3>
${lenh('s05/tu-xa-wef', 5)}
<p>Mọi lần thất bại đều đến từ một máy chủ, slad1, và việc gom theo <code>MachineName</code> + IP + người dùng chính là góc nhìn xuyên máy mà nếu không có máy gom bạn phải ghép từ 20 lần kéo riêng lẻ. Ở Chương 15, cùng các sự kiện này đi thêm một bước — từ máy gom vào ELK hoặc Loki bằng một agent (Bài 15.4).</p>

<h3>🛡️ Góc hacker: bằng chứng đã rời khỏi toà nhà</h3>
<p>Mọi câu chuyện xoá log trong khoá này (NotPetya, Olympic Destroyer, vòng 149 wevtutil ở Bài 5.4) đều kết thúc giống nhau với một máy có chuyển tiếp: log tại chỗ rỗng, máy gom vẫn còn mọi thứ tới lần giao cuối cùng (vài giây với Minimize Latency, tới 15 phút với kiểu gom lô Normal). Kẻ tấn công biết điều đó: sau khi có quyền quản trị, họ có thể dừng WinRM hoặc bộ chuyển tiếp, chặn cổng của máy gom, hoặc nhắm vào chính máy gom. Vì vậy hãy giám sát <em>sự im lặng</em> — một máy nguồn có nhịp tim cuối cũ hơn một giờ (<code>wecutil gr</code>, hoặc cảnh báo "không có sự kiện từ máy X" trên SIEM) là sự cố cho tới khi chứng minh được điều ngược lại. Hướng dẫn WEF của Microsoft và kho WEF công khai của Palantir là hai tài liệu mà phần lớn đội blue team bắt đầu từ đó.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"Kiểm đăng nhập hỏng trên 20 máy chủ cùng lúc thế nào?" — <code>Invoke-Command -ComputerName …</code> với FilterHashtable bên trong; gom theo PSComputerName.</li>
<li>"WEF là gì, đã có agent sao còn dùng?" — chuyển tiếp kiểu đẩy dựng sẵn qua WinRM, không phải cài phần mềm; bước đầu tốt, hoặc là nguồn cấp cho agent SIEM đặt trên máy gom.</li>
<li>"Source-initiated khác collector-initiated thế nào?" — máy nguồn tự tìm máy gom qua GPO (mở rộng tốt, máy mới tự tham gia) so với máy gom hỏi một danh sách cố định.</li>
<li>"Một quản trị viên đã xoá Security trên một máy chủ. Bạn còn gì?" — những gì WEF/agent đã giao, sự kiện 1102 (nếu được chuyển tiếp), và chính khoảng trống đó.</li>
</ul>

<h3>Đi làm thật</h3>
<p>Trong dự án outsourcing, bạn thường được cấp một tài khoản thuộc <strong>Event Log Readers</strong> (không phải quản trị) trên máy chủ của khách, hoặc quyền đọc máy gom/SIEM của họ — hãy biết làm việc trong giới hạn đó: Invoke-Command và Get-WinEvent chạy được với quyền đọc; xoá hay đổi cỡ log thì không (và không nên). Khi thiết kế hệ thống cho khách dùng Windows, liệt kê trong tài liệu triển khai những sự kiện mà ứng dụng của bạn ghi (Chương 10) để họ thêm vào subscription WEF.</p>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
<li>Từ mẫu, đếm sự kiện theo <code>MachineName</code> và <code>LogName</code>, và cho biết máy nào gửi sự kiện Application. Vì sao một máy gom có thể có System/Application của máy trạm nhưng chỉ có Security của máy chủ?</li>
<li>Viết một QueryList subscription WEF chuyển tiếp 4625, 4720, 4728, 4732, 1102 từ Security và 7045 từ System.</li>
<li>Giải thích trong hai câu vì sao <code>Invoke-Command</code> nhanh hơn vòng lặp <code>Get-WinEvent -ComputerName</code> qua 20 máy chủ.</li>
</ol>
<p><strong>Đạt:</strong> (1) slad1 584 / slad3 66 Security; AA-PH-6L8JKH2 2 Application + 1 System — subscription được đặt theo từng nhóm máy với QueryList khác nhau; (2) hai phần tử <code>&lt;Select&gt;</code>, Path="Security" với <code>EventID=4625 or …</code> và Path="System" với <code>EventID=7045</code>; (3) bộ lọc chạy trên mọi máy chủ song song và chỉ kết quả đi qua mạng, còn vòng lặp xử lý lần lượt từng máy.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Kéo / đẩy', 'Đọc log máy xa khi cần / chuyển tiếp sự kiện liên tục.'],
  ['Invoke-Command', 'Chạy truy vấn trên nhiều máy qua WinRM, song song.'],
  ['WEF / WEC', 'Windows Event Forwarding / Collector.'],
  ['Source-initiated', 'Máy nguồn tìm máy gom qua GPO.'],
  ['RenderedText', 'Định dạng subscription mang theo Message.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Kéo bằng Invoke-Command để trả lời câu hỏi; đẩy bằng WEF để giữ bằng chứng.</li>
<li>Event Log Readers thay cho quyền quản trị.</li>
<li>Sự kiện chuyển tiếp giữ LogName và MachineName gốc; RenderedText mang theo Message.</li>
<li>Nới cỡ ForwardedEvents và canh những máy nguồn im lặng.</li>
</ul>
${nguon('📘', 'Microsoft Learn — Use Windows Event Forwarding to help with intrusion detection', 'Kiến trúc, subscription, Event Log Readers, tuỳ chọn giao', 'https://learn.microsoft.com/en-us/windows/security/operating-system-security/device-management/use-windows-event-forwarding-to-assist-in-intrusion-detection')}
${nguon('📘', 'Microsoft Learn — wecutil', 'Lệnh máy gom: qc, cs, es, gs, gr', 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/wecutil')}
${nguon('🧰', 'Palantir — windows-event-forwarding', 'Subscription công khai và ghi chú triển khai', 'https://github.com/palantir/windows-event-forwarding')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-15-4-windows-ve-trung-tam', title: 'Bài 15.4 — Đưa sự kiện Windows về kho trung tâm', sub: 'Winlogbeat, Grafana Alloy, NXLog có TLS', cta: 'Mở bài' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-5-8-lab', title: 'Lab 5 — Báo cáo buổi sáng bằng PowerShell', sub: 'Ghép cả chương lại', cta: 'Bài tiếp' })}
</div>
`,
};
