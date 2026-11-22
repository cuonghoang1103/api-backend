/**
 * 0.1 — Dựng lab an toàn (soạn 22/11/2026).
 * Mã: CODE['tao-goi-log.py'] (bộ sinh gói log mẫu, tất định); output: OUT['s00/kiem-goi'] chạy thật trong Ubuntu 24.04 (container).
 * Nguồn đã kiểm: Microsoft Learn "Use systemd to manage Linux services with WSL" (systemd mặc định với Ubuntu cài bằng wsl --install;
 * [boot] systemd=true; wsl.exe --shutdown); RFC 5737 (dải IP dành cho tài liệu).
 */
import { ma, ra, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '0.1 — Setting up a safe lab: your Windows PC, a Linux VM or WSL2, Docker, and the course log pack|||0.1 — Dựng lab an toàn: máy Windows của bạn, máy ảo Linux hoặc WSL2, Docker và gói log mẫu của khoá',
  slug: 'log-0-1-moi-truong-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Ba nơi luyện tập: máy Windows/Mac thật (chỉ đọc, tạo điểm khôi phục trước khi đổi cấu hình), Linux qua WSL2 có systemd hoặc máy ảo có snapshot, Docker cho các chương sau; và gói log mẫu của khoá sinh bằng một script Python tất định (cùng script ⇒ cùng từng byte, IP thuộc dải tài liệu RFC 5737) — kèm output chạy thật và tiêu chí Đạt khi.',
  content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>Setting up a safe lab: three places to practise, and a log pack that is the same on every machine</h2>
<p class="lead">Reading logs is mostly harmless — but the labs in later chapters <em>create</em> events on purpose: wrong passwords, a new user, a crashed service, a changed audit policy. You want that to happen somewhere you can undo. In this lesson you set up three places — your own computer (read-only), a Linux environment, and later Docker — and generate the course's sample log pack, about 5,000 lines of realistic logs that contain a password-guessing attack, a database outage and a vulnerability scan.</p>

<h3>The everyday picture: a driving school car</h3>
<p>Learner drivers do not start on the motorway in their parents' car. They use a car with a second brake pedal on a closed course. Your lab is that car: a place where mistakes are expected and reversible. Your real laptop is the motorway — you <em>look</em> at it, you do not experiment on it.</p>

<h3>Place 1 — your own Windows or Mac (read-only)</h3>
<ul>
<li>Use it to <strong>read</strong>: Event Viewer, Reliability Monitor, PowerShell <code>Get-WinEvent</code> (Chapters 3–5), Console and <code>log show</code> on macOS (Chapter 6). Reading the Security log needs an administrator PowerShell ("Run as administrator").</li>
<li>Before any lesson that <strong>changes</strong> something (audit policy in 5.5, installing Sysmon in 5.6), create a restore point: Start → "Create a restore point" → <em>Create…</em>. It takes a minute and saves an evening.</li>
<li>Never clear a log on your real machine "to try it". Chapter 4 does that in a virtual machine.</li>
</ul>

<h3>Place 2 — Linux: WSL2 or a virtual machine</h3>
<table>
<thead><tr><th></th><th>WSL2 (Windows)</th><th>Virtual machine (VirtualBox, Hyper-V, UTM on Mac, Multipass)</th></tr></thead>
<tbody>
<tr><td>Setup time</td><td>Minutes: <code>wsl --install</code> in an admin PowerShell installs Ubuntu</td><td>20–40 minutes: download Ubuntu 24.04 LTS, install</td></tr>
<tr><td>journald / <code>journalctl</code></td><td>Yes — systemd is the default for Ubuntu installed by <code>wsl --install</code>; other distributions need <code>[boot]</code> <code>systemd=true</code> in <code>/etc/wsl.conf</code>, then <code>wsl.exe --shutdown</code></td><td>Yes, exactly like a server</td></tr>
<tr><td>Real <code>auth.log</code>, sshd, firewall, kernel OOM</td><td>Limited: no real boot, no real SSH attacks from outside, shares the Windows network</td><td>Yes — behaves like a VPS</td></tr>
<tr><td>Undo button</td><td><code>wsl --export</code> / <code>--import</code></td><td><strong>Snapshots</strong> — take one before every lab</td></tr>
<tr><td>Good for</td><td>Chapters 1, 2, 7 (basics), 10, 12</td><td>Chapters 7, 8, 11, 14 (attacks inside a host-only network)</td></tr>
</tbody></table>
<p>Start with WSL2 (or a terminal on macOS/Linux) — it is enough for the next two chapters. Create the virtual machine when you reach Chapter 7. Check whether systemd runs with <code>systemctl status</code>: the first line should say <code>State: running</code>.</p>
<div class="callout warn"><p><strong>Mac with Apple Silicon (M1/M2/M3…)</strong>: use UTM or Multipass with the <em>arm64</em> Ubuntu image. Everything in this course works the same; only Windows-only chapters need a Windows machine or a Windows virtual machine.</p></div>

<h3>Place 3 — Docker (from Chapter 10)</h3>
<p>Chapters 10, 12, 13 and 15 run nginx, a Node app, PostgreSQL and a log stack with Docker Compose. Install Docker Desktop (Windows/Mac) or Docker Engine (Linux) when you get there; nothing in Sections 0–2 needs it. Give every container you create a prefix such as <code>log10-</code>, so you can always clean up exactly what you made and nothing else.</p>

<h3>The course log pack: generate it, do not download it</h3>
<p>Every lesson in Chapters 1–2 runs on the same set of files. Instead of a zip you have to trust, you generate them with a short Python script. It uses no real randomness — its own tiny number generator — so <strong>the same script produces the same bytes on every computer</strong>, and the numbers in the lessons match yours exactly. Every IP address comes from the ranges reserved for documentation (RFC 5737: <code>192.0.2.x</code>, <code>198.51.100.x</code>, <code>203.0.113.x</code>) or private <code>10.x</code> addresses: no real person is in these logs.</p>
<p>Save the script as <code>tao-goi-log.py</code> in your home folder (copy the block below into a text editor):</p>
${ma('python', 'tao-goi-log.py')}
<p>Run it, then look around. This is the real output (run in Ubuntu 24.04; the home folder there was <code>/root</code> — yours will be <code>/home/your-name</code>):</p>
${ra('s00/kiem-goi')}
<table>
<thead><tr><th>Folder</th><th>What is inside</th><th>Used in</th></tr></thead>
<tbody>
<tr><td><code>web/</code></td><td>One day (20/11/2026) of nginx access log in the standard "combined" format, plus the previous day compressed by log rotation</td><td>2.1–2.3, Lab 2</td></tr>
<tr><td><code>app/</code></td><td>A Node.js app's JSON log (one JSON object per line, pino style) and a deliberately broken copy</td><td>1.3, 2.4, 2.5</td></tr>
<tr><td><code>linux/</code></td><td>An <code>auth.log</code> with SSH password guessing and one legitimate key login</td><td>2.2</td></tr>
<tr><td><code>incident/</code></td><td>One outage seen from five sources: Windows, PostgreSQL, the app, nginx, journald</td><td>1.2, 1.5, Lab 1</td></tr>
<tr><td><code>windows/</code></td><td>An IIS web log (W3C format) and a Windows Firewall log</td><td>2.5</td></tr>
</tbody></table>

<h3>Windows users: one pack, two shells</h3>
<p>Run the script inside WSL (<code>python3 tao-goi-log.py</code>). From Windows PowerShell you can then reach the same files through the path <code>\\\\wsl.localhost\\Ubuntu\\home\\your-name\\log-lab</code>, so Chapter 2's PowerShell lessons read exactly the same bytes. If you prefer, install Python for Windows and run <code>py tao-goi-log.py</code> directly — the output is identical.</p>
<div class="pitfall co-tieu-de"><p><strong>Do not "fix" the files in an editor.</strong> Opening <code>access.log</code> in Notepad and saving it can change line endings to CRLF, and then <code>grep</code> results and byte counts no longer match the lessons. If you think you damaged the pack, delete the folder and run the script again — that is the point of generating it.</p></div>

<h3>🧪 Practice (20 min)</h3>
<div class="callout ok"><ol>
<li>Install or open your Linux environment (WSL2, a VM, or the macOS terminal) and run <code>systemctl status | head -n 3</code> (skip on macOS).</li>
<li>Save <code>tao-goi-log.py</code>, run <code>python3 tao-goi-log.py</code>, then <code>cd log-lab</code> and <code>wc -l web/access.log app/app.jsonl linux/auth.log</code>.</li>
<li>On your real machine, open one log read-only: Event Viewer → Windows Logs → System on Windows, or Console on macOS.</li>
<li>Write in your notebook: which three places you will use, and the line counts from step 2.</li>
</ol>
<p><strong>Done when:</strong> you have opened logs in all three places (your real OS, your Linux environment, the generated pack) and your line counts are exactly the ones shown above.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['WSL2', 'Windows Subsystem for Linux: a real Linux kernel running inside Windows.'],
  ['virtual machine (VM)', 'A whole computer emulated in software, with its own disk and network.'],
  ['snapshot', 'A saved state of a VM you can roll back to in seconds.'],
  ['restore point', 'A Windows snapshot of system settings, made before risky changes.'],
  ['deterministic', 'Always producing the same output from the same input.'],
  ['RFC 5737', 'The standard that reserves IP ranges for documentation and examples.'],
  ['log rotation', 'Renaming and compressing old log files so they do not grow forever (Chapter 8).'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Read on your real machine; experiment only where you can undo (VM snapshots, restore points).</li>
<li>WSL2 with systemd is enough for Chapters 1–2 and basic journald; a VM is needed for real SSH, firewall and OOM labs.</li>
<li>Docker comes later (Chapter 10); prefix every container so you can clean up precisely.</li>
<li>The log pack is generated by a deterministic script: same bytes everywhere, only documentation IP ranges.</li>
<li>If the pack looks wrong, regenerate it instead of editing it.</li>
</ul>
${nguon('📘', 'Microsoft Learn — Use systemd with WSL', 'systemd default for Ubuntu via wsl --install; wsl.conf [boot] systemd=true', 'https://learn.microsoft.com/en-us/windows/wsl/systemd')}
${nguon('📘', 'RFC 5737 — IPv4 address blocks reserved for documentation', 'Why 192.0.2.x, 198.51.100.x and 203.0.113.x are safe in examples', 'https://www.rfc-editor.org/rfc/rfc5737')}
${lienKet({ khoa: 'operating-systems-for-developers', bai: 'os-14-3-wsl', title: 'OS for Developers 14.3 — WSL', sub: 'How WSL2 works underneath, file paths between Windows and Linux', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Dựng lab an toàn: ba nơi để luyện, và một gói log giống hệt nhau trên mọi máy</h2>
<p class="lead">Đọc log phần lớn là vô hại — nhưng lab ở các chương sau <em>cố ý tạo ra</em> sự kiện: nhập sai mật khẩu, tạo người dùng mới, làm sập dịch vụ, đổi audit policy (chính sách kiểm toán). Bạn muốn những việc đó xảy ra ở nơi hoàn tác được. Bài này dựng ba nơi — máy thật của bạn (chỉ đọc), một môi trường Linux, và sau này Docker — rồi sinh gói log mẫu của khoá: khoảng 5.000 dòng log như thật, chứa một vụ dò mật khẩu, một lần sập cơ sở dữ liệu và một đợt quét lỗ hổng.</p>

<h3>Liên tưởng đời thường: xe tập lái</h3>
<p>Người học lái không ra đường cao tốc bằng xe của bố mẹ. Họ tập trên xe có thêm một bàn đạp phanh, trong sân kín. Lab của bạn là chiếc xe đó: nơi sai là chuyện bình thường và sửa lại được. Laptop thật là đường cao tốc — bạn <em>nhìn</em>, không thử nghiệm trên nó.</p>

<h3>Nơi 1 — máy Windows hoặc Mac của bạn (chỉ đọc)</h3>
<ul>
<li>Dùng để <strong>đọc</strong>: Event Viewer, Reliability Monitor, PowerShell <code>Get-WinEvent</code> (Chương 3–5), Console và <code>log show</code> trên macOS (Chương 6). Đọc nhật ký Security cần PowerShell quyền quản trị ("Run as administrator").</li>
<li>Trước mọi bài có <strong>thay đổi</strong> (đổi audit policy ở 5.5, cài Sysmon ở 5.6), tạo điểm khôi phục: Start → "Create a restore point" → <em>Create…</em>. Mất một phút, cứu cả một buổi tối.</li>
<li>Đừng bao giờ xoá log trên máy thật "cho biết". Chương 4 làm việc đó trong máy ảo.</li>
</ul>

<h3>Nơi 2 — Linux: WSL2 hoặc máy ảo</h3>
<table>
<thead><tr><th></th><th>WSL2 (trên Windows)</th><th>Máy ảo (VirtualBox, Hyper-V, UTM trên Mac, Multipass)</th></tr></thead>
<tbody>
<tr><td>Thời gian dựng</td><td>Vài phút: <code>wsl --install</code> trong PowerShell quyền quản trị sẽ cài Ubuntu</td><td>20–40 phút: tải Ubuntu 24.04 LTS, cài đặt</td></tr>
<tr><td>journald / <code>journalctl</code></td><td>Có — systemd là mặc định với Ubuntu cài bằng <code>wsl --install</code>; bản phân phối khác thì thêm <code>[boot]</code> <code>systemd=true</code> vào <code>/etc/wsl.conf</code> rồi chạy <code>wsl.exe --shutdown</code></td><td>Có, y như một server</td></tr>
<tr><td><code>auth.log</code> thật, sshd, tường lửa, OOM của nhân</td><td>Hạn chế: không có quá trình khởi động thật, không bị dò SSH thật từ ngoài, dùng chung mạng với Windows</td><td>Có — chạy như một VPS</td></tr>
<tr><td>Nút hoàn tác</td><td><code>wsl --export</code> / <code>--import</code></td><td><strong>Snapshot (ảnh chụp trạng thái)</strong> — chụp một cái trước mỗi lab</td></tr>
<tr><td>Hợp với</td><td>Chương 1, 2, 7 (cơ bản), 10, 12</td><td>Chương 7, 8, 11, 14 (tấn công trong mạng host-only nội bộ)</td></tr>
</tbody></table>
<p>Bắt đầu bằng WSL2 (hoặc terminal trên macOS/Linux) — đủ cho hai chương tới. Tới Chương 7 hãy dựng máy ảo. Kiểm systemd có chạy không bằng <code>systemctl status</code>: dòng đầu phải có <code>State: running</code>.</p>
<div class="callout warn"><p><strong>Mac chip Apple (M1/M2/M3…)</strong>: dùng UTM hoặc Multipass với bản Ubuntu <em>arm64</em>. Mọi thứ trong khoá chạy y như nhau; chỉ các chương riêng Windows mới cần máy Windows hoặc máy ảo Windows.</p></div>

<h3>Nơi 3 — Docker (từ Chương 10)</h3>
<p>Chương 10, 12, 13 và 15 chạy nginx, một app Node, PostgreSQL và bộ gom log bằng Docker Compose. Tới đó hãy cài Docker Desktop (Windows/Mac) hoặc Docker Engine (Linux); Mục 0–Chương 2 chưa cần. Đặt cho mọi container bạn tạo một tiền tố như <code>log10-</code>, để lúc dọn bạn xoá đúng thứ mình tạo và không đụng gì khác.</p>

<h3>Gói log mẫu của khoá: tự sinh, không tải về</h3>
<p>Mọi bài ở Chương 1–2 chạy trên cùng một bộ tệp. Thay vì một tệp zip bạn phải tin, bạn tự sinh chúng bằng một script Python ngắn. Nó không dùng ngẫu nhiên thật — mà dùng bộ sinh số nhỏ tự viết — nên <strong>cùng một script cho ra cùng từng byte trên mọi máy</strong>, và con số trong bài khớp chính xác với máy bạn. Mọi địa chỉ IP đều thuộc dải dành riêng cho tài liệu (RFC 5737: <code>192.0.2.x</code>, <code>198.51.100.x</code>, <code>203.0.113.x</code>) hoặc dải nội bộ <code>10.x</code>: không có người thật nào trong các log này.</p>
<p>Lưu script dưới tên <code>tao-goi-log.py</code> trong thư mục nhà (chép khối dưới vào một trình soạn thảo):</p>
${ma('python', 'tao-goi-log.py')}
<p>Chạy nó rồi xem quanh một vòng. Đây là output thật (chạy trên Ubuntu 24.04; thư mục nhà ở đó là <code>/root</code> — của bạn sẽ là <code>/home/ten-ban</code>):</p>
${ra('s00/kiem-goi')}
<table>
<thead><tr><th>Thư mục</th><th>Bên trong có gì</th><th>Dùng ở</th></tr></thead>
<tbody>
<tr><td><code>web/</code></td><td>Một ngày (20/11/2026) access log của nginx theo định dạng chuẩn "combined", kèm ngày hôm trước đã bị nén khi xoay vòng log</td><td>2.1–2.3, Lab 2</td></tr>
<tr><td><code>app/</code></td><td>Log JSON của một app Node.js (mỗi dòng một đối tượng JSON, kiểu pino) và một bản cố tình hỏng</td><td>1.3, 2.4, 2.5</td></tr>
<tr><td><code>linux/</code></td><td>Một <code>auth.log</code> có dò mật khẩu SSH và một lần đăng nhập hợp lệ bằng khoá</td><td>2.2</td></tr>
<tr><td><code>incident/</code></td><td>Một lần sập dịch vụ nhìn từ năm nguồn: Windows, PostgreSQL, app, nginx, journald</td><td>1.2, 1.5, Lab 1</td></tr>
<tr><td><code>windows/</code></td><td>Log web IIS (định dạng W3C) và log của Windows Firewall</td><td>2.5</td></tr>
</tbody></table>

<h3>Người dùng Windows: một gói, hai shell</h3>
<p>Chạy script trong WSL (<code>python3 tao-goi-log.py</code>). Từ PowerShell của Windows bạn vẫn với tới đúng các tệp đó qua đường dẫn <code>\\\\wsl.localhost\\Ubuntu\\home\\ten-ban\\log-lab</code>, nên các bài PowerShell ở Chương 2 đọc đúng từng byte giống bash. Nếu thích, cài Python cho Windows rồi chạy thẳng <code>py tao-goi-log.py</code> — kết quả giống hệt.</p>
<div class="pitfall co-tieu-de"><p><strong>Đừng "sửa" tệp bằng trình soạn thảo.</strong> Mở <code>access.log</code> bằng Notepad rồi lưu có thể đổi ký tự xuống dòng sang CRLF, và khi đó kết quả <code>grep</code>, số byte không còn khớp với bài. Nghi mình làm hỏng gói thì xoá thư mục rồi chạy lại script — đó chính là lý do ta tự sinh nó.</p></div>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
<li>Cài hoặc mở môi trường Linux (WSL2, máy ảo, hay terminal của macOS) và chạy <code>systemctl status | head -n 3</code> (bỏ qua trên macOS).</li>
<li>Lưu <code>tao-goi-log.py</code>, chạy <code>python3 tao-goi-log.py</code>, rồi <code>cd log-lab</code> và <code>wc -l web/access.log app/app.jsonl linux/auth.log</code>.</li>
<li>Trên máy thật, mở một log ở chế độ chỉ đọc: Event Viewer → Windows Logs → System trên Windows, hoặc Console trên macOS.</li>
<li>Ghi vào sổ: ba nơi bạn sẽ dùng, và số dòng ở bước 2.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đã mở được log ở cả ba nơi (hệ điều hành thật, môi trường Linux, gói log vừa sinh) và số dòng của bạn đúng y như output ở trên.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['WSL2', 'Windows Subsystem for Linux: một nhân Linux thật chạy bên trong Windows.'],
  ['virtual machine (máy ảo)', 'Cả một máy tính giả lập bằng phần mềm, có đĩa và mạng riêng.'],
  ['snapshot (ảnh chụp trạng thái)', 'Trạng thái đã lưu của máy ảo, quay lại được trong vài giây.'],
  ['restore point (điểm khôi phục)', 'Bản lưu cấu hình hệ thống của Windows, tạo trước khi thay đổi rủi ro.'],
  ['deterministic (tất định)', 'Cùng đầu vào thì luôn cho cùng đầu ra.'],
  ['RFC 5737', 'Chuẩn dành riêng các dải IP cho tài liệu và ví dụ.'],
  ['log rotation (xoay vòng log)', 'Đổi tên và nén tệp log cũ để chúng không phình mãi (Chương 8).'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đọc trên máy thật; chỉ thử nghiệm ở nơi hoàn tác được (snapshot máy ảo, điểm khôi phục).</li>
<li>WSL2 có systemd là đủ cho Chương 1–2 và journald cơ bản; lab SSH, tường lửa, OOM thật cần máy ảo.</li>
<li>Docker dùng từ Chương 10; đặt tiền tố cho mọi container để dọn chính xác.</li>
<li>Gói log mẫu sinh bằng script tất định: mọi máy cùng từng byte, chỉ dùng dải IP tài liệu.</li>
<li>Gói trông sai thì sinh lại, đừng sửa tay.</li>
</ul>
${nguon('📘', 'Microsoft Learn — Dùng systemd trong WSL', 'systemd mặc định với Ubuntu cài bằng wsl --install; wsl.conf [boot] systemd=true', 'https://learn.microsoft.com/en-us/windows/wsl/systemd')}
${nguon('📘', 'RFC 5737 — các dải IPv4 dành cho tài liệu', 'Vì sao 192.0.2.x, 198.51.100.x, 203.0.113.x an toàn khi làm ví dụ', 'https://www.rfc-editor.org/rfc/rfc5737')}
${lienKet({ khoa: 'operating-systems-for-developers', bai: 'os-14-3-wsl', title: 'OS for Developers 14.3 — WSL', sub: 'WSL2 chạy bên dưới thế nào, đường dẫn tệp giữa Windows và Linux' })}
</div>
`,
};
