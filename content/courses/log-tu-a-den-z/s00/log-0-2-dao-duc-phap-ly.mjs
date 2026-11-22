/**
 * 0.2 — Đạo đức và pháp lý khi đọc log (soạn 22/11/2026).
 * Pháp lý: Điều 289 BLHS 2015 (sửa đổi 2017) — tên tội đã đối chiếu; KHÔNG trích mức phạt (người học tự đọc văn bản hiện hành).
 * Dữ liệu cá nhân: chỉ nêu nguyên tắc + liên kết khoá privacy-data-law (pdl-5-2-toi-thieu), không nhắc lại số điều luật ở đây.
 * Sự cố có nguồn: GAO-18-559 (Equifax — log dựng lại ~9.000 truy vấn) đã kể ở bài 0.8; ở đây chỉ nhắc nguyên tắc.
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '0.2 — Ethics and law: whose logs you may read, and what logs say about people|||0.2 — Đạo đức và pháp lý: được đọc log của ai, và log tiết lộ gì về con người',
  slug: 'log-0-2-dao-duc-phap-ly',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Chỉ đọc log của máy mình hoặc được giao bằng văn bản; đọc log hệ thống người khác khi chưa được phép có thể là tội xâm nhập trái phép (Điều 289 BLHS 2015, sửa đổi 2017); một dòng access log tiết lộ gì về một con người; quy tắc ở công ty: quyền tối thiểu, đọc có lý do, che dữ liệu trước khi chia sẻ, không chụp log gửi nhóm chat; góc hacker: log cũng là mục tiêu.',
  content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Ethics and law: whose logs you may read, and what logs say about people</h2>
<p class="lead">Logs feel technical, but most lines are really about <em>people</em>: who connected from where, at what time, which page they opened, which account failed to log in. The skills in this course let you see a lot. This short lesson sets the rules before you start: whose logs you may read, what a single line reveals about a person, how to share evidence without leaking it, and why attackers care about logs too.</p>

<h3>The everyday picture: the building manager and the CCTV</h3>
<p>The building manager may watch the camera of the building's own corridor to find out who broke the lift. He may not install a camera in your room, and he should not send a clip of you walking home to the residents' chat group. Log access works the same way: <strong>you need a reason, a right, and you show only what is needed</strong>.</p>

<h3>Rule 1 — read only logs you are allowed to read</h3>
<ul>
<li><strong>Your own devices and accounts</strong>: yes. That is most of this course.</li>
<li><strong>The course sample pack and your own virtual machines</strong>: yes.</li>
<li><strong>Your employer's or your university's systems</strong>: only what your role covers, ideally written down ("you are on-call for the web servers"). Being able to open a file is not the same as being allowed to.</li>
<li><strong>Someone else's computer, router or server without permission</strong>: no — even "just to look". Vietnamese criminal law has an offence of unauthorised intrusion into another person's computer network, telecommunications network or electronic device (Article 289 of the 2015 Penal Code, amended in 2017). Bypassing a password or a warning to get in is exactly what that article describes. Read the current text yourself before relying on any summary — including this one.</li>
</ul>
<div class="callout warn"><p><strong>"I found a log file open on the internet."</strong> Publicly reachable does not mean public. Do not download it, do not share it; report it to the owner (many companies list a security contact) and delete anything you already saved.</p></div>

<h3>Rule 2 — know what a log line says about a person</h3>
<p>Take one line from the sample pack (lesson 0.1). It is fake, but real lines look exactly like this:</p>
${lenh('s00/kiem-goi', 3)}
<p>From these two lines alone you can tell: an IP address (which an internet provider can map to a household), the exact second someone was active, which pages they read, which browser and operating system they use, and which page sent them. Multiply by a year and you can learn someone's daily rhythm — when they wake, when they study, what they read. That is why IP addresses, emails, user IDs and behaviour in logs are treated as <strong>personal data</strong> by data protection law, with rules on minimising, protecting and deleting them. The privacy course explains those rules; Chapter 16 here shows how to apply them to logs.</p>

<h3>Rule 3 — at work: least privilege, a reason, and masking before sharing</h3>
<ul>
<li><strong>Least privilege:</strong> ask for read access to the logs you need, not admin to everything.</li>
<li><strong>Read with a reason:</strong> "ticket #812, customer could not log in at 09:00" — not "let me see what my colleague did yesterday". Many systems log who read the logs.</li>
<li><strong>Mask before sharing.</strong> Need help from a teammate? Replace the last part of IPs, cut tokens and email addresses, then share the <em>few lines</em> that matter (Chapter 2 shows a one-line <code>sed</code> that does it).</li>
<li><strong>Do not screenshot logs into chat groups.</strong> Screenshots cannot be searched, cannot be deleted from every phone, and often contain more than you meant to show.</li>
<li><strong>Never paste production logs into a public AI chatbot or pastebin.</strong> They may contain session tokens, customer data or internal hostnames.</li>
</ul>

<h3>🕵️ Hacker's corner — logs are a target too</h3>
<p>Attackers know logs are the evidence. Three things they do, and how defenders answer (each comes back in later chapters):</p>
<table>
<thead><tr><th>What attackers do</th><th>Why</th><th>Defence</th></tr></thead>
<tbody>
<tr><td>Clear or edit logs (Windows event 1102 "audit log was cleared", deleting lines from <code>auth.log</code>)</td><td>Hide what they did</td><td>Send logs off the machine quickly to a central store they cannot reach (Chapter 15); alert on 1102 itself (Chapter 4)</td></tr>
<tr><td>Read logs for secrets</td><td>Developers sometimes log passwords, tokens, API keys</td><td>Never log secrets; restrict who can read logs (Chapter 16)</td></tr>
<tr><td>Inject fake lines (a newline inside a username, a crafted User-Agent)</td><td>Confuse investigators or the tools that parse logs</td><td>Escape input before logging; treat log content as untrusted data when you read it (Chapter 10)</td></tr>
</tbody></table>
<p>The flip side for you as an investigator: <strong>never run or click something just because it appears in a log</strong>. A log line can contain a malicious URL or a command; copy it as text into your notes, do not open it.</p>

<h3>🧪 Practice (10 min)</h3>
<div class="callout ok"><ol>
<li>In your notebook, write three systems whose logs you are allowed to read today (for example: "my laptop", "my WSL", "the course pack") and one you are <em>not</em> (for example: "the university Wi-Fi router").</li>
<li>Open <code>log-lab/web/access.log</code> and pick one line. List every piece of personal data in it.</li>
<li>Rewrite that line by hand as you would before sending it to a teammate: last part of the IP replaced by <code>x</code>, nothing else that identifies a person.</li>
</ol>
<p><strong>Done when:</strong> your notebook has the allowed/not-allowed list and one correctly masked line in which no complete IP address remains.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['authorisation', 'Permission — ideally written — to access a system or its data.'],
  ['personal data', 'Any information about an identifiable person: IP, email, user id, behaviour.'],
  ['least privilege', 'Having only the access your task needs, nothing more.'],
  ['masking', 'Hiding parts of data (192.0.2.x) so it can be shared safely.'],
  ['log tampering', 'Deleting or changing logs to hide activity.'],
  ['log injection', 'Inserting fake or malicious content into logs through user input.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Read only your own systems, your lab, or what your role explicitly covers; "able to open" is not "allowed to".</li>
<li>Getting into someone else's system without permission can be a crime (Article 289, 2015 Penal Code) — check the current text.</li>
<li>One access log line reveals an IP, a time, pages, a browser: logs are personal data.</li>
<li>At work: least privilege, a reason for every read, mask before sharing, no screenshots in chat, no production logs in public tools.</li>
<li>Attackers clear, mine and inject logs; defenders ship logs off-box, alert on clearing, and treat log content as untrusted.</li>
</ul>
${nguon('📘', 'OWASP Logging Cheat Sheet — data to exclude', 'What must never be written to logs, and how to protect them', 'https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html')}
${nguon('📗', 'OWASP Top 10 — A09 Security Logging and Monitoring Failures', 'Why missing or unread logs are a top-10 web risk', 'https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/')}
${lienKet({ khoa: 'privacy-data-law', bai: 'pdl-5-2-toi-thieu', title: 'Privacy &amp; data law 5.2 — data minimisation', sub: 'Collect and keep only what you need — applied to logs in Chapter 16', cta: 'Open lesson' })}
${lienKet({ khoa: 'web-security', bai: 'sec-9-1-log', title: 'Web security 9.1 — security logging', sub: 'Logging security events without leaking data', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Đạo đức và pháp lý: được đọc log của ai, và log tiết lộ gì về con người</h2>
<p class="lead">Log trông rất kỹ thuật, nhưng phần lớn các dòng thực ra nói về <em>con người</em>: ai kết nối từ đâu, lúc mấy giờ, mở trang nào, tài khoản nào đăng nhập hỏng. Kỹ năng trong khoá này cho bạn thấy rất nhiều. Bài ngắn này đặt luật chơi trước khi bắt đầu: được đọc log của ai, một dòng log nói gì về một người, chia sẻ bằng chứng thế nào cho khỏi lộ, và vì sao kẻ tấn công cũng quan tâm tới log.</p>

<h3>Liên tưởng đời thường: ban quản lý toà nhà và camera</h3>
<p>Ban quản lý được xem camera hành lang của toà nhà để tìm ai làm hỏng thang máy. Họ không được lắp camera trong phòng bạn, và không nên gửi đoạn phim bạn đi về nhà vào nhóm chat cư dân. Quyền đọc log cũng thế: <strong>phải có lý do, có quyền, và chỉ đưa ra đúng phần cần thiết</strong>.</p>

<h3>Luật 1 — chỉ đọc log mình được phép đọc</h3>
<ul>
<li><strong>Thiết bị và tài khoản của chính bạn</strong>: được. Đó là phần lớn khoá này.</li>
<li><strong>Gói log mẫu của khoá và máy ảo của bạn</strong>: được.</li>
<li><strong>Hệ thống của công ty hay của trường</strong>: chỉ phần vai trò của bạn bao gồm, tốt nhất là có ghi bằng văn bản ("bạn trực sự cố cho các web server"). Mở được một tệp không có nghĩa là được phép mở.</li>
<li><strong>Máy tính, router, server của người khác khi chưa được phép</strong>: không — kể cả "chỉ để xem". Luật hình sự Việt Nam có tội xâm nhập trái phép vào mạng máy tính, mạng viễn thông hoặc phương tiện điện tử của người khác (Điều 289 Bộ luật Hình sự 2015, sửa đổi bổ sung 2017). Vượt qua mật khẩu hay cảnh báo để vào chính là hành vi điều luật này mô tả. Hãy tự đọc văn bản hiện hành trước khi dựa vào bất kỳ bản tóm tắt nào — kể cả bản này.</li>
</ul>
<div class="callout warn"><p><strong>"Em thấy một tệp log mở công khai trên mạng."</strong> Truy cập được không có nghĩa là công khai. Đừng tải về, đừng chia sẻ; báo cho chủ sở hữu (nhiều công ty có địa chỉ liên hệ bảo mật) và xoá mọi thứ bạn lỡ lưu.</p></div>

<h3>Luật 2 — biết một dòng log nói gì về một con người</h3>
<p>Lấy hai dòng từ gói log mẫu (bài 0.1). Chúng là giả, nhưng dòng thật trông y như vậy:</p>
${lenh('s00/kiem-goi', 3)}
<p>Chỉ từ hai dòng này đã biết: một địa chỉ IP (nhà mạng có thể đối chiếu ra một hộ gia đình), đúng giây người đó đang hoạt động, họ đọc trang nào, dùng trình duyệt và hệ điều hành gì, trang nào dẫn họ tới. Nhân lên cả năm là biết được nhịp sống hằng ngày của một người — mấy giờ dậy, mấy giờ học, đọc gì. Vì thế địa chỉ IP, email, mã người dùng và hành vi trong log được luật bảo vệ dữ liệu coi là <strong>dữ liệu cá nhân</strong>, có quy định về thu thập tối thiểu, bảo vệ và xoá. Khoá quyền riêng tư giải thích các quy định đó; Chương 16 ở đây chỉ cách áp chúng vào log.</p>

<h3>Luật 3 — khi đi làm: quyền tối thiểu, có lý do, che trước khi chia sẻ</h3>
<ul>
<li><strong>Quyền tối thiểu (least privilege):</strong> xin quyền đọc đúng log mình cần, không xin quyền admin mọi thứ.</li>
<li><strong>Đọc có lý do:</strong> "ticket #812, khách không đăng nhập được lúc 09:00" — không phải "để xem hôm qua đồng nghiệp làm gì". Nhiều hệ thống ghi lại cả việc ai đã đọc log.</li>
<li><strong>Che trước khi chia sẻ (masking).</strong> Cần đồng đội giúp? Thay phần cuối của IP, cắt token và email, rồi gửi <em>vài dòng</em> quan trọng (Chương 2 có một lệnh <code>sed</code> một dòng làm việc này).</li>
<li><strong>Không chụp màn hình log gửi nhóm chat.</strong> Ảnh chụp không tìm kiếm được, không xoá được khỏi mọi điện thoại, và thường chứa nhiều hơn bạn định cho xem.</li>
<li><strong>Không bao giờ dán log production vào chatbot AI công cộng hay trang pastebin.</strong> Trong đó có thể có token phiên đăng nhập, dữ liệu khách hàng, tên máy nội bộ.</li>
</ul>

<h3>🕵️ Góc hacker — log cũng là mục tiêu</h3>
<p>Kẻ tấn công biết log là bằng chứng. Ba việc chúng làm, và cách bên phòng thủ đáp trả (mỗi việc sẽ quay lại ở các chương sau):</p>
<table>
<thead><tr><th>Kẻ tấn công làm gì</th><th>Để làm gì</th><th>Phòng thủ</th></tr></thead>
<tbody>
<tr><td>Xoá hoặc sửa log (sự kiện Windows 1102 "audit log was cleared", xoá dòng trong <code>auth.log</code>)</td><td>Che giấu việc đã làm</td><td>Đẩy log ra khỏi máy thật nhanh về kho trung tâm mà chúng không với tới (Chương 15); cảnh báo ngay trên chính sự kiện 1102 (Chương 4)</td></tr>
<tr><td>Đọc log để tìm bí mật</td><td>Lập trình viên đôi khi ghi cả mật khẩu, token, khoá API vào log</td><td>Không bao giờ ghi bí mật; giới hạn người được đọc log (Chương 16)</td></tr>
<tr><td>Chèn dòng giả (ký tự xuống dòng trong tên đăng nhập, User-Agent dựng sẵn)</td><td>Đánh lừa người điều tra hoặc công cụ phân tích log</td><td>Thoát ký tự đầu vào trước khi ghi; coi nội dung log là dữ liệu không đáng tin khi đọc (Chương 10)</td></tr>
</tbody></table>
<p>Mặt kia với bạn — người điều tra: <strong>đừng bao giờ chạy hay bấm vào thứ gì chỉ vì nó xuất hiện trong log</strong>. Một dòng log có thể chứa URL độc hại hoặc một câu lệnh; chép nó dạng chữ vào sổ, đừng mở.</p>

<h3>🧪 Thực hành (10 phút)</h3>
<div class="callout ok"><ol>
<li>Trong sổ, ghi ba hệ thống bạn được phép đọc log hôm nay (ví dụ: "laptop của mình", "WSL của mình", "gói log của khoá") và một hệ thống <em>không</em> được (ví dụ: "router Wi-Fi của trường").</li>
<li>Mở <code>log-lab/web/access.log</code> và chọn một dòng. Liệt kê mọi dữ liệu cá nhân có trong dòng đó.</li>
<li>Viết lại dòng đó bằng tay như khi sắp gửi cho đồng đội: phần cuối của IP thay bằng <code>x</code>, không còn gì khác nhận ra được một người.</li>
</ol>
<p><strong>Đạt khi:</strong> sổ có danh sách được/không được phép và một dòng đã che đúng, không còn địa chỉ IP đầy đủ nào.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['authorisation (sự cho phép)', 'Sự đồng ý — tốt nhất bằng văn bản — để truy cập một hệ thống hay dữ liệu của nó.'],
  ['personal data (dữ liệu cá nhân)', 'Mọi thông tin về một người nhận diện được: IP, email, mã người dùng, hành vi.'],
  ['least privilege (quyền tối thiểu)', 'Chỉ có đúng quyền mà công việc cần, không hơn.'],
  ['masking (che dữ liệu)', 'Giấu một phần dữ liệu (192.0.2.x) để chia sẻ an toàn.'],
  ['log tampering (sửa xoá log)', 'Xoá hoặc sửa log để che giấu hoạt động.'],
  ['log injection (chèn log)', 'Đưa nội dung giả hay độc hại vào log qua dữ liệu người dùng nhập.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Chỉ đọc hệ thống của mình, lab của mình, hoặc phần vai trò được giao rõ ràng; "mở được" không phải "được phép".</li>
<li>Vào hệ thống của người khác khi chưa được phép có thể là tội phạm (Điều 289 BLHS 2015) — kiểm văn bản hiện hành.</li>
<li>Một dòng access log lộ ra IP, giờ giấc, trang đã xem, trình duyệt: log là dữ liệu cá nhân.</li>
<li>Khi đi làm: quyền tối thiểu, lần đọc nào cũng có lý do, che trước khi chia sẻ, không chụp gửi nhóm chat, không dán log production vào công cụ công cộng.</li>
<li>Kẻ tấn công xoá, đào, chèn log; bên phòng thủ đẩy log ra khỏi máy, cảnh báo khi log bị xoá, và coi nội dung log là không đáng tin.</li>
</ul>
${nguon('📘', 'OWASP Logging Cheat Sheet — dữ liệu không được ghi', 'Thứ không bao giờ được ghi vào log, và cách bảo vệ log', 'https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html')}
${nguon('📗', 'OWASP Top 10 — A09 Security Logging and Monitoring Failures', 'Vì sao thiếu log hoặc log không ai đọc là rủi ro top 10 của web', 'https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/')}
${lienKet({ khoa: 'privacy-data-law', bai: 'pdl-5-2-toi-thieu', title: 'Quyền riêng tư &amp; luật dữ liệu 5.2 — tối thiểu hoá dữ liệu', sub: 'Chỉ thu và giữ thứ cần — áp vào log ở Chương 16' })}
${lienKet({ khoa: 'web-security', bai: 'sec-9-1-log', title: 'Bảo mật web 9.1 — log bảo mật', sub: 'Ghi sự kiện bảo mật mà không làm lộ dữ liệu' })}
</div>
`,
};
