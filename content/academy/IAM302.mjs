/**
 * IAM302 — Malware Analysis and Reverse Engineering (Phân tích mã độc & Dịch
 * ngược). Ngành An toàn thông tin FPTU, kỳ 5. Khung 8 chương theo tài liệu
 * chuẩn giáo dục: Sikorski & Honig "Practical Malware Analysis", SANS FOR610,
 * "The Art of Memory Forensics"; công cụ học tập Ghidra/IDA. Nhấn PHƯƠNG PHÁP
 * phân tích trong LAB CÁCH LY + PHÒNG THỦ/nhận diện; KHÔNG viết mã độc thực thi.
 * Song ngữ VI+EN, quiz mỗi chương. Lộ trình 4 bước.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick lồng/${; & → &amp; trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('iam302-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Practical Malware Analysis, Art of Memory Forensics), SANS FOR610, công cụ học tập (Ghidra/IDA), lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">IAM302 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to study <strong>malware analysis &amp; reverse engineering</strong> the safe, professional way — always inside an <strong>isolated lab</strong>, focused on <strong>method and defense</strong>, never on writing runnable malware. The official FPTU slides &amp; syllabus live on <strong>FLM</strong>; below are respected, legal learning resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for IAM302 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://nostarch.com/malware" target="_blank" rel="noopener"><em>Practical Malware Analysis</em> — Sikorski &amp; Honig</a> — the classic method-first textbook.</li>
<li><a href="https://www.memoryanalysis.net/amf" target="_blank" rel="noopener"><em>The Art of Memory Forensics</em> — Ligh, Case, Levy &amp; Walters</a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.sans.org/cyber-security-courses/reverse-engineering-malware-malware-analysis-tools-techniques/" target="_blank" rel="noopener">SANS FOR610 — Reverse-Engineering Malware</a> (course outline &amp; free posters)</li>
<li><a href="https://ghidra-sre.org/" target="_blank" rel="noopener">Ghidra — free open-source reverse-engineering suite (NSA)</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@OALabs" target="_blank" rel="noopener">OALabs</a> — practical reverse engineering, walk-throughs in a lab</li>
<li><a href="https://www.youtube.com/@MalwareAnalysisForHedgehogs" target="_blank" rel="noopener">Malware Analysis For Hedgehogs</a> — beginner-friendly analysis method</li>
</ul>
<h3>🛠️ Tools (learning, in an isolated VM)</h3>
<ul>
<li><a href="https://ghidra-sre.org/" target="_blank" rel="noopener">Ghidra</a> — disassembler &amp; decompiler</li>
<li><a href="https://virustotal.com/" target="_blank" rel="noopener">VirusTotal</a> — hash lookup &amp; multi-engine verdicts (metadata only)</li>
<li><a href="https://github.com/VirusTotal/yara" target="_blank" rel="noopener">YARA</a> — pattern rules for detection &amp; hunting</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — what malware is, analysis goals, and how to build a safe, isolated lab you never let touch a real network.</li>
<li><strong>Triage</strong> — basic static (hashes, strings, PE headers) then basic dynamic (sandbox behaviour) to summarise a sample fast.</li>
<li><strong>Go deeper</strong> — x86 assembly, Ghidra/IDA, control flow, API calls, unpacking and configuration recovery at the method level.</li>
<li><strong>Defend</strong> — turn findings into IOCs, YARA rules, threat intel and a clear report; act within law and ethics.</li>
</ol></div>`,
    `<span class="eyebrow">IAM302 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>phân tích mã độc &amp; dịch ngược</strong> theo cách an toàn, chuyên nghiệp — luôn trong <strong>lab cách ly</strong>, nhấn <strong>phương pháp và phòng thủ</strong>, KHÔNG viết mã độc chạy được. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn học uy tín, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của IAM302 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://nostarch.com/malware" target="_blank" rel="noopener"><em>Practical Malware Analysis</em> — Sikorski &amp; Honig</a> — sách kinh điển, dạy theo phương pháp.</li>
<li><a href="https://www.memoryanalysis.net/amf" target="_blank" rel="noopener"><em>The Art of Memory Forensics</em> — Ligh, Case, Levy &amp; Walters</a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.sans.org/cyber-security-courses/reverse-engineering-malware-malware-analysis-tools-techniques/" target="_blank" rel="noopener">SANS FOR610 — Reverse-Engineering Malware</a> (đề cương &amp; poster miễn phí)</li>
<li><a href="https://ghidra-sre.org/" target="_blank" rel="noopener">Ghidra — bộ dịch ngược mã nguồn mở miễn phí (NSA)</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@OALabs" target="_blank" rel="noopener">OALabs</a> — dịch ngược thực hành, mổ mẫu trong lab</li>
<li><a href="https://www.youtube.com/@MalwareAnalysisForHedgehogs" target="_blank" rel="noopener">Malware Analysis For Hedgehogs</a> — phương pháp phân tích dễ vào cho người mới</li>
</ul>
<h3>🛠️ Công cụ (học tập, trong máy ảo cách ly)</h3>
<ul>
<li><a href="https://ghidra-sre.org/" target="_blank" rel="noopener">Ghidra</a> — disassembler &amp; decompiler</li>
<li><a href="https://virustotal.com/" target="_blank" rel="noopener">VirusTotal</a> — tra hash &amp; kết luận đa engine (chỉ metadata)</li>
<li><a href="https://github.com/VirusTotal/yara" target="_blank" rel="noopener">YARA</a> — luật mẫu để phát hiện &amp; săn mã độc</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — mã độc là gì, mục tiêu phân tích, và cách dựng lab cách ly an toàn không bao giờ cho chạm mạng thật.</li>
<li><strong>Sàng lọc</strong> — tĩnh cơ bản (hash, strings, PE header) rồi động cơ bản (hành vi trong sandbox) để tóm tắt mẫu thật nhanh.</li>
<li><strong>Đào sâu</strong> — assembly x86, Ghidra/IDA, luồng điều khiển, lời gọi API, gỡ nén và phục hồi cấu hình ở mức phương pháp.</li>
<li><strong>Phòng thủ</strong> — biến kết quả thành IOC, luật YARA, threat intel và một báo cáo rõ ràng; làm đúng luật và đạo đức.</li>
</ol></div>`,
  ]]);

const intro = doc('iam302-0-1-overview', 'Course overview & lab safety|||Tổng quan môn học & an toàn lab',
  'Mục tiêu môn: phân tích mã độc để PHÒNG THỦ, không tạo ra nó. Chỉ mổ mẫu trong LAB CÁCH LY (máy ảo, không mạng, snapshot). Đạo đức & pháp lý. Lộ trình 4 bước.',
  [[
    `<span class="eyebrow">IAM302 · Lesson 0.1 · Overview</span>
<h2>Malware analysis &amp; reverse engineering</h2>
<p class="lead">This course teaches you to <strong>understand hostile software so you can defend against it</strong> — identify what a sample does, extract indicators, and write detections. The goal is <strong>analysis and defense</strong>, never creating or spreading malware.</p>
<h3>Why analysts do this</h3>
<ul>
<li><strong>Detect &amp; respond</strong> — decide if an alert is a real threat and what it touched.</li>
<li><strong>Extract indicators</strong> — hashes, domains, registry keys that let a whole fleet be scanned.</li>
<li><strong>Attribute &amp; report</strong> — describe capability and family for defenders and leadership.</li>
</ul>
<h3>The golden rule: an isolated lab</h3>
<p>You only ever open a real sample inside a <strong>dedicated, isolated environment</strong>: a virtual machine with <strong>no network path to real systems</strong>, on a host that holds nothing you care about, restored from a clean <strong>snapshot</strong> after every run. Treat every file as live and dangerous.</p>
<pre><code>Safe lab checklist:
  - Isolated VM (host-only or fully offline network)
  - Clean snapshot before, revert after every run
  - Never a corporate or personal machine
  - Handle samples inside a password-protected archive
</code></pre>
<div class="callout"><span class="badge">Ethics &amp; law</span> Only analyse samples you are authorised to handle, keep them contained, and follow your organisation and local law. This course covers <strong>defensive method only</strong> — it does not show how to build working malware.</div>`,
    `<span class="eyebrow">IAM302 · Bài 0.1 · Tổng quan</span>
<h2>Phân tích mã độc &amp; dịch ngược</h2>
<p class="lead">Môn này dạy bạn <strong>hiểu phần mềm độc hại để phòng thủ trước nó</strong> — nhận ra một mẫu làm gì, rút dấu hiệu, và viết luật phát hiện. Mục tiêu là <strong>phân tích và phòng thủ</strong>, không bao giờ tạo ra hay phát tán mã độc.</p>
<h3>Vì sao chuyên gia làm việc này</h3>
<ul>
<li><strong>Phát hiện &amp; ứng phó</strong> — quyết định một cảnh báo có phải mối đe doạ thật và nó đã đụng tới gì.</li>
<li><strong>Rút dấu hiệu</strong> — hash, tên miền, khoá registry để quét cả hệ thống.</li>
<li><strong>Quy kết &amp; báo cáo</strong> — mô tả năng lực và họ mã độc cho đội phòng thủ và cấp quản lý.</li>
</ul>
<h3>Nguyên tắc vàng: lab cách ly</h3>
<p>Bạn chỉ mở một mẫu thật bên trong <strong>môi trường cách ly riêng</strong>: máy ảo <strong>không có đường mạng tới hệ thống thật</strong>, trên một host không chứa gì quan trọng, và <strong>khôi phục snapshot sạch</strong> sau mỗi lần chạy. Coi mọi tệp là còn sống và nguy hiểm.</p>
<pre><code>Danh sách an toàn cho lab:
  - Máy ảo cách ly (mạng host-only hoặc tắt hẳn mạng)
  - Snapshot sạch trước, revert sau mỗi lần chạy
  - Không dùng máy công ty hay máy cá nhân
  - Giữ mẫu trong tệp nén có mật khẩu
</code></pre>
<div class="callout"><span class="badge">Đạo đức &amp; pháp lý</span> Chỉ phân tích mẫu bạn được phép xử lý, giữ chúng trong vùng cách ly, và tuân thủ tổ chức lẫn luật địa phương. Môn này chỉ dạy <strong>phương pháp phòng thủ</strong> — không hướng dẫn tạo mã độc chạy được.</div>`,
  ]]);

const c1 = doc('iam302-1-1-malware-and-analysis', '1.1 — Malware & the analysis process|||1.1 — Mã độc & quy trình phân tích',
  'Các loại malware (virus, worm, trojan, ransomware, rootkit, botnet), mục tiêu phân tích, và cách dựng sandbox/lab cách ly an toàn.',
  [[
    `<span class="eyebrow">IAM302 · Chapter 1 · Lesson 1.1</span>
<h2>Malware &amp; the analysis process</h2>
<h3>Types of malware</h3>
<ul>
<li><strong>Virus / worm</strong> — self-replicating code; a worm spreads across a network on its own.</li>
<li><strong>Trojan</strong> — hides inside something that looks useful to get run.</li>
<li><strong>Ransomware</strong> — encrypts files and demands payment.</li>
<li><strong>Rootkit</strong> — hides its own presence deep in the system.</li>
<li><strong>Botnet / backdoor</strong> — gives a remote operator control (C2).</li>
</ul>
<h3>What an analysis produces</h3>
<p>Analysis answers three questions: <strong>what does it do</strong> (capability), <strong>how do we spot it</strong> (indicators), and <strong>how do we stop it</strong> (defense). It is not about running the sample for fun — it is about producing detections and a report.</p>
<h3>The isolated lab</h3>
<pre><code>Lab layers:
  Physical/virtual: dedicated analysis VM, revertible snapshot
  Network:          host-only or offline; fake services (INetSim) if needed
  Handling:         samples zipped + password, never double-clicked casually
</code></pre>
<div class="callout"><span class="badge">Defense mindset</span> Every fact you learn — a filename, a mutex, a domain — is a future <strong>detection</strong>. You analyse to protect a fleet, not to admire the attacker.</div>`,
    `<span class="eyebrow">IAM302 · Chương 1 · Bài 1.1</span>
<h2>Mã độc &amp; quy trình phân tích</h2>
<h3>Các loại mã độc</h3>
<ul>
<li><strong>Virus / worm</strong> — mã tự nhân bản; worm tự lan qua mạng.</li>
<li><strong>Trojan</strong> — núp trong thứ trông hữu ích để được chạy.</li>
<li><strong>Ransomware</strong> — mã hoá tệp và đòi tiền chuộc.</li>
<li><strong>Rootkit</strong> — giấu chính sự hiện diện của nó sâu trong hệ thống.</li>
<li><strong>Botnet / backdoor</strong> — trao quyền điều khiển từ xa cho kẻ vận hành (C2).</li>
</ul>
<h3>Phân tích cho ra thứ gì</h3>
<p>Phân tích trả lời ba câu hỏi: <strong>nó làm gì</strong> (năng lực), <strong>làm sao nhận ra</strong> (dấu hiệu), và <strong>làm sao chặn</strong> (phòng thủ). Không phải để chạy mẫu cho vui — mà để tạo ra luật phát hiện và một báo cáo.</p>
<h3>Lab cách ly</h3>
<pre><code>Các lớp của lab:
  Vật lý/ảo: máy ảo phân tích riêng, snapshot khôi phục được
  Mạng:      host-only hoặc tắt mạng; dịch vụ giả (INetSim) khi cần
  Xử lý mẫu: nén + mật khẩu, không double-click tuỳ tiện
</code></pre>
<div class="callout"><span class="badge">Tư duy phòng thủ</span> Mỗi sự thật bạn học được — một tên tệp, một mutex, một tên miền — là một <strong>luật phát hiện</strong> tương lai. Bạn phân tích để bảo vệ hệ thống, không phải để ngưỡng mộ kẻ tấn công.</div>`,
  ]]);

const c1q = quiz('iam302-quiz-1', 'Quiz 1 — Malware & process|||Quiz 1 — Mã độc & quy trình', [
  { id: 'q1', question: 'Loại mã độc nào mã hoá tệp rồi đòi tiền chuộc?|||Loại mã độc nào mã hoá tệp rồi đòi tiền chuộc?', options: ['Rootkit', 'Ransomware', 'Worm|||Worm', 'Trojan'], correctIndex: 1, explanation: 'Ransomware mã hoá dữ liệu và đòi tiền để khôi phục.' },
  { id: 'q2', question: 'Điều kiện quan trọng nhất khi chạy một mẫu thật là?|||Điều kiện quan trọng nhất khi chạy một mẫu thật là?', options: ['Máy nhanh nhất|||Máy nhanh nhất', 'Máy ảo cách ly, không mạng thật, có snapshot|||Máy ảo cách ly, không mạng thật, có snapshot', 'Kết nối Internet đầy đủ|||Kết nối Internet đầy đủ', 'Chạy trên máy cá nhân|||Chạy trên máy cá nhân'], correctIndex: 1, explanation: 'Luôn mổ mẫu trong lab cách ly, không cho chạm hệ thống thật.' },
  { id: 'q3', question: 'Mục tiêu chính của phân tích mã độc là?|||Mục tiêu chính của phân tích mã độc là?', options: ['Tạo mã độc mạnh hơn|||Tạo mã độc mạnh hơn', 'Hiểu năng lực, rút dấu hiệu và phòng thủ|||Hiểu năng lực, rút dấu hiệu và phòng thủ', 'Phát tán mẫu|||Phát tán mẫu', 'Đua điểm VirusTotal|||Đua điểm VirusTotal'], correctIndex: 1, explanation: 'Phân tích phục vụ phát hiện và phòng thủ, không phải tấn công.' },
]);

const c2 = doc('iam302-2-1-basic-static', '2.1 — Basic static analysis|||2.1 — Phân tích tĩnh cơ bản',
  'Phân tích không chạy mẫu: hash (nhận diện), strings, bảng import và PE header, dấu hiệu packer — khái niệm và ý nghĩa phòng thủ.',
  [[
    `<span class="eyebrow">IAM302 · Chapter 2 · Lesson 2.1</span>
<h2>Basic static analysis</h2>
<p class="lead"><strong>Static</strong> means examining a file <em>without running it</em> — the safest first look.</p>
<h3>Fingerprint &amp; strings</h3>
<ul>
<li><strong>Hashes (MD5/SHA-256)</strong> — a unique fingerprint; look it up (e.g. VirusTotal) to see if it is already known.</li>
<li><strong>Strings</strong> — readable text inside the file: URLs, filenames, error messages. A quick clue to intent.</li>
</ul>
<h3>PE headers &amp; imports</h3>
<p>Windows executables use the <strong>PE (Portable Executable)</strong> format. The header lists <strong>imported APIs</strong> — e.g. lots of networking or crypto functions hint at C2 or ransomware behaviour. Compile timestamps and section names add context.</p>
<h3>Packers</h3>
<pre><code>Signs a file is packed (compressed/obfuscated):
  - Very few readable strings and few imports
  - High entropy (looks random)
  - Odd section names (UPX0, .packed)
</code></pre>
<div class="callout"><span class="badge">Defense value</span> Static triage costs seconds and never runs the sample: a hash lookup alone often identifies a known family and the detections that already exist for it.</div>`,
    `<span class="eyebrow">IAM302 · Chương 2 · Bài 2.1</span>
<h2>Phân tích tĩnh cơ bản</h2>
<p class="lead"><strong>Tĩnh</strong> nghĩa là xem xét tệp <em>mà không chạy nó</em> — bước nhìn đầu tiên an toàn nhất.</p>
<h3>Vân tay &amp; chuỗi ký tự</h3>
<ul>
<li><strong>Hash (MD5/SHA-256)</strong> — vân tay duy nhất; tra cứu (vd VirusTotal) xem mẫu đã được biết chưa.</li>
<li><strong>Strings</strong> — văn bản đọc được trong tệp: URL, tên tệp, thông báo lỗi. Manh mối nhanh về ý đồ.</li>
</ul>
<h3>PE header &amp; bảng import</h3>
<p>Tệp thực thi Windows dùng định dạng <strong>PE (Portable Executable)</strong>. Header liệt kê <strong>API được import</strong> — vd nhiều hàm mạng hay mã hoá gợi ý hành vi C2 hoặc ransomware. Thời điểm biên dịch và tên section bổ sung ngữ cảnh.</p>
<h3>Packer</h3>
<pre><code>Dấu hiệu tệp bị đóng gói (nén/làm rối):
  - Rất ít chuỗi đọc được và ít import
  - Entropy cao (trông ngẫu nhiên)
  - Tên section lạ (UPX0, .packed)
</code></pre>
<div class="callout"><span class="badge">Giá trị phòng thủ</span> Sàng lọc tĩnh tốn vài giây và không chạy mẫu: chỉ một lần tra hash thường đủ nhận ra họ mã độc quen và các luật phát hiện đã có sẵn.</div>`,
  ]]);

const c2q = quiz('iam302-quiz-2', 'Quiz 2 — Basic static|||Quiz 2 — Tĩnh cơ bản', [
  { id: 'q1', question: 'Hash SHA-256 của một tệp dùng để?|||Hash SHA-256 của một tệp dùng để?', options: ['Chạy tệp|||Chạy tệp', 'Nhận diện duy nhất và tra cứu mẫu đã biết|||Nhận diện duy nhất và tra cứu mẫu đã biết', 'Giải nén tệp|||Giải nén tệp', 'Sửa PE header|||Sửa PE header'], correctIndex: 1, explanation: 'Hash là vân tay để tra cứu và đối chiếu mẫu đã biết.' },
  { id: 'q2', question: 'Một tệp rất ít strings, ít import, entropy cao thường cho thấy?|||Một tệp rất ít strings, ít import, entropy cao thường cho thấy?', options: ['Tệp sạch|||Tệp sạch', 'Tệp đã bị packer nén/làm rối|||Tệp đã bị packer nén/làm rối', 'Tệp văn bản|||Tệp văn bản', 'Tệp ảnh|||Tệp ảnh'], correctIndex: 1, explanation: 'Ít import + entropy cao là dấu hiệu điển hình của packer.' },
  { id: 'q3', question: 'Bảng import trong PE header cho analyst biết?|||Bảng import trong PE header cho analyst biết?', options: ['Màu icon|||Màu icon', 'Các API mà chương trình có thể gọi (mạng, mã hoá...)|||Các API mà chương trình có thể gọi (mạng, mã hoá...)', 'Giá bán mã độc|||Giá bán mã độc', 'Tên tác giả thật|||Tên tác giả thật'], correctIndex: 1, explanation: 'Import gợi ý năng lực: hàm mạng, mã hoá, thao tác tệp/registry.' },
]);

const c3 = doc('iam302-3-1-basic-dynamic', '3.1 — Basic dynamic analysis|||3.1 — Phân tích động cơ bản',
  'Chạy mẫu trong sandbox cách ly rồi quan sát hành vi: tiến trình, tệp, registry, và lưu lượng mạng — với dịch vụ mạng giả để mẫu không chạm ra ngoài.',
  [[
    `<span class="eyebrow">IAM302 · Chapter 3 · Lesson 3.1</span>
<h2>Basic dynamic analysis</h2>
<p class="lead"><strong>Dynamic</strong> analysis runs the sample <em>inside a controlled sandbox</em> and watches what it does. It reveals behaviour that packing hides from static tools.</p>
<h3>What to monitor</h3>
<ul>
<li><strong>Process &amp; file activity</strong> — new processes, files dropped, itself copied into system folders.</li>
<li><strong>Registry</strong> — persistence keys (auto-run on boot) are a classic tell.</li>
<li><strong>Network</strong> — the domains/IPs it tries to reach (its C2), captured but never allowed out to the real internet.</li>
</ul>
<h3>Fake the world</h3>
<pre><code>Controlled run:
  - Snapshot the clean VM
  - Start monitors + a fake network (INetSim) that answers requests
  - Detonate the sample, watch for a fixed time
  - Collect logs, then REVERT the snapshot
</code></pre>
<div class="callout"><span class="badge">Automated sandboxes</span> Tools like Cuckoo/CAPE automate this run and produce a behaviour report. Treat their output as a first pass — confirm the important findings yourself.</div>`,
    `<span class="eyebrow">IAM302 · Chương 3 · Bài 3.1</span>
<h2>Phân tích động cơ bản</h2>
<p class="lead">Phân tích <strong>động</strong> chạy mẫu <em>trong một sandbox có kiểm soát</em> và quan sát nó làm gì. Nó lộ ra hành vi mà packer che khỏi công cụ tĩnh.</p>
<h3>Cần giám sát gì</h3>
<ul>
<li><strong>Tiến trình &amp; tệp</strong> — tiến trình mới, tệp được thả ra, mẫu tự chép vào thư mục hệ thống.</li>
<li><strong>Registry</strong> — khoá duy trì (tự chạy khi khởi động) là dấu hiệu kinh điển.</li>
<li><strong>Mạng</strong> — tên miền/IP mẫu cố kết nối (C2 của nó), bắt lại nhưng không cho ra Internet thật.</li>
</ul>
<h3>Giả lập thế giới bên ngoài</h3>
<pre><code>Lần chạy có kiểm soát:
  - Chụp snapshot máy ảo sạch
  - Bật giám sát + mạng giả (INetSim) để trả lời yêu cầu
  - Kích hoạt mẫu, quan sát trong khoảng thời gian cố định
  - Thu log, rồi REVERT snapshot
</code></pre>
<div class="callout"><span class="badge">Sandbox tự động</span> Công cụ như Cuckoo/CAPE tự động hoá lần chạy và xuất báo cáo hành vi. Coi kết quả đó là lượt sàng đầu — tự kiểm lại các phát hiện quan trọng.</div>`,
  ]]);

const c3q = quiz('iam302-quiz-3', 'Quiz 3 — Basic dynamic|||Quiz 3 — Động cơ bản', [
  { id: 'q1', question: 'Vì sao dùng mạng giả (INetSim) khi phân tích động?|||Vì sao dùng mạng giả (INetSim) khi phân tích động?', options: ['Để tăng tốc mẫu|||Để tăng tốc mẫu', 'Để thấy mẫu cố kết nối gì mà không cho ra Internet thật|||Để thấy mẫu cố kết nối gì mà không cho ra Internet thật', 'Để tải thêm mã độc|||Để tải thêm mã độc', 'Để gửi mẫu cho C2|||Để gửi mẫu cho C2'], correctIndex: 1, explanation: 'Mạng giả bắt được ý đồ C2 mà vẫn giữ mẫu trong vùng cách ly.' },
  { id: 'q2', question: 'Khoá registry auto-run thường là dấu hiệu của?|||Khoá registry auto-run thường là dấu hiệu của?', options: ['Tính năng duy trì (persistence)|||Tính năng duy trì (persistence)', 'Nén tệp|||Nén tệp', 'Ký số hợp lệ|||Ký số hợp lệ', 'Tối ưu hiệu năng|||Tối ưu hiệu năng'], correctIndex: 0, explanation: 'Khoá auto-run giúp mã độc tự chạy lại sau khởi động — persistence.' },
  { id: 'q3', question: 'Bước bắt buộc SAU mỗi lần kích hoạt mẫu là?|||Bước bắt buộc SAU mỗi lần kích hoạt mẫu là?', options: ['Cài mẫu lên máy thật|||Cài mẫu lên máy thật', 'Revert về snapshot sạch|||Revert về snapshot sạch', 'Tắt giám sát|||Tắt giám sát', 'Kết nối mạng công ty|||Kết nối mạng công ty'], correctIndex: 1, explanation: 'Luôn revert snapshot để máy ảo trở lại trạng thái sạch, cách ly.' },
]);

const c4 = doc('iam302-4-1-intro-reversing', '4.1 — Intro to reverse engineering|||4.1 — Nhập môn dịch ngược',
  'Dịch ngược là gì; nền tảng assembly x86 (thanh ghi, lệnh cơ bản, ngăn xếp); disassembler vs decompiler; làm quen Ghidra/IDA ở mức đọc hiểu.',
  [[
    `<span class="eyebrow">IAM302 · Chapter 4 · Lesson 4.1</span>
<h2>Intro to reverse engineering</h2>
<p class="lead"><strong>Reverse engineering</strong> recovers the logic of a program from its compiled form when there is no source code — the deepest form of static analysis.</p>
<h3>A little x86 assembly</h3>
<ul>
<li><strong>Registers</strong> — small fast storage (EAX, EBX, ESP...). ESP points to the top of the stack.</li>
<li><strong>Common instructions</strong> — MOV (copy), CMP (compare), JMP/Jcc (jump), CALL/RET (functions).</li>
<li><strong>The stack</strong> — holds local variables, arguments and return addresses.</li>
</ul>
<h3>Disassembler vs decompiler</h3>
<pre><code>Machine bytes  ->  Disassembler  ->  assembly (MOV, CALL, JMP...)
Assembly       ->  Decompiler    ->  C-like pseudocode (easier to read)
</code></pre>
<p><strong>Ghidra</strong> (free) and <strong>IDA</strong> do both: they show assembly, a decompiled view, and a graph of the control flow. You read — you do not execute — the code here.</p>
<div class="callout"><span class="badge">Read, do not run</span> Reverse engineering in a disassembler is fully static: opening a sample in Ghidra never runs it, so it is a safe way to understand logic that dynamic analysis only hinted at.</div>`,
    `<span class="eyebrow">IAM302 · Chương 4 · Bài 4.1</span>
<h2>Nhập môn dịch ngược</h2>
<p class="lead"><strong>Dịch ngược</strong> khôi phục logic của chương trình từ dạng đã biên dịch khi không có mã nguồn — hình thức phân tích tĩnh sâu nhất.</p>
<h3>Một chút assembly x86</h3>
<ul>
<li><strong>Thanh ghi</strong> — ô nhớ nhỏ, nhanh (EAX, EBX, ESP...). ESP trỏ đỉnh ngăn xếp.</li>
<li><strong>Lệnh thường gặp</strong> — MOV (chép), CMP (so sánh), JMP/Jcc (nhảy), CALL/RET (hàm).</li>
<li><strong>Ngăn xếp (stack)</strong> — giữ biến cục bộ, tham số và địa chỉ trả về.</li>
</ul>
<h3>Disassembler vs decompiler</h3>
<pre><code>Byte máy      ->  Disassembler  ->  assembly (MOV, CALL, JMP...)
Assembly      ->  Decompiler    ->  mã giả kiểu C (dễ đọc hơn)
</code></pre>
<p><strong>Ghidra</strong> (miễn phí) và <strong>IDA</strong> làm cả hai: hiện assembly, khung decompile, và đồ thị luồng điều khiển. Ở đây bạn ĐỌC — không chạy — mã.</p>
<div class="callout"><span class="badge">Đọc, không chạy</span> Dịch ngược trong disassembler là hoàn toàn tĩnh: mở mẫu trong Ghidra không chạy nó, nên đây là cách an toàn để hiểu logic mà phân tích động mới chỉ gợi ý.</div>`,
  ]]);

const c4q = quiz('iam302-quiz-4', 'Quiz 4 — Reversing basics|||Quiz 4 — Dịch ngược cơ bản', [
  { id: 'q1', question: 'Điểm khác nhau giữa disassembler và decompiler?|||Điểm khác nhau giữa disassembler và decompiler?', options: ['Giống hệt nhau|||Giống hệt nhau', 'Disassembler ra assembly, decompiler ra mã giả kiểu C|||Disassembler ra assembly, decompiler ra mã giả kiểu C', 'Cả hai đều chạy mẫu|||Cả hai đều chạy mẫu', 'Decompiler nén tệp|||Decompiler nén tệp'], correctIndex: 1, explanation: 'Disassembler cho assembly; decompiler dựng lại mã giả gần C.' },
  { id: 'q2', question: 'Mở một mẫu trong Ghidra để đọc code sẽ?|||Mở một mẫu trong Ghidra để đọc code sẽ?', options: ['Chạy mã độc|||Chạy mã độc', 'Không chạy mẫu — phân tích hoàn toàn tĩnh|||Không chạy mẫu — phân tích hoàn toàn tĩnh', 'Kết nối tới C2|||Kết nối tới C2', 'Mã hoá ổ đĩa|||Mã hoá ổ đĩa'], correctIndex: 1, explanation: 'Disassembly là tĩnh: mở trong Ghidra không thực thi mẫu.' },
  { id: 'q3', question: 'Lệnh x86 nào dùng để gọi một hàm con?|||Lệnh x86 nào dùng để gọi một hàm con?', options: ['MOV', 'CALL', 'CMP', 'NOP'], correctIndex: 1, explanation: 'CALL chuyển điều khiển tới hàm; RET quay lại địa chỉ trả về.' },
]);

const c5 = doc('iam302-5-1-advanced-static', '5.1 — Advanced static analysis|||5.1 — Phân tích tĩnh nâng cao',
  'Đọc luồng điều khiển và lời gọi API để suy ra hành vi; nhận biết obfuscation và kỹ thuật anti-analysis (chống VM, chống debug) — ở mức khái niệm phòng thủ.',
  [[
    `<span class="eyebrow">IAM302 · Chapter 5 · Lesson 5.1</span>
<h2>Advanced static analysis</h2>
<h3>Control flow &amp; API calls</h3>
<p>Following the <strong>control-flow graph</strong> in Ghidra shows the branches a program can take. Naming the <strong>API calls</strong> along a path lets you narrate behaviour without running it — e.g. <em>read a file → CryptEncrypt → delete the original</em> is a ransomware pattern.</p>
<h3>Obfuscation</h3>
<ul>
<li><strong>String encryption</strong> — readable text is hidden and only decoded at runtime.</li>
<li><strong>Control-flow flattening / junk code</strong> — the graph is deliberately tangled to slow a reader.</li>
<li><strong>API hashing</strong> — functions are resolved by a hash instead of a name to hide imports.</li>
</ul>
<h3>Anti-analysis (concepts)</h3>
<pre><code>Common evasion checks (recognise, do not build):
  - Is a debugger attached?  (IsDebuggerPresent-style checks)
  - Are we inside a VM/sandbox?  (odd hardware, few files, quick timing)
  - Stall for a long time to outlast an automated sandbox
</code></pre>
<div class="callout"><span class="badge">Why it matters for defense</span> Recognising these tricks tells you why a sandbox saw nothing and where to look manually — and each check is itself an <strong>indicator</strong> you can detect on.</div>`,
    `<span class="eyebrow">IAM302 · Chương 5 · Bài 5.1</span>
<h2>Phân tích tĩnh nâng cao</h2>
<h3>Luồng điều khiển &amp; lời gọi API</h3>
<p>Đi theo <strong>đồ thị luồng điều khiển</strong> trong Ghidra cho thấy các nhánh chương trình có thể rẽ. Gọi tên các <strong>API</strong> dọc một đường đi giúp bạn kể lại hành vi mà không cần chạy — vd <em>đọc tệp → CryptEncrypt → xoá bản gốc</em> là mẫu hành vi ransomware.</p>
<h3>Làm rối (obfuscation)</h3>
<ul>
<li><strong>Mã hoá chuỗi</strong> — văn bản đọc được bị giấu, chỉ giải mã lúc chạy.</li>
<li><strong>Làm phẳng luồng / chèn mã rác</strong> — đồ thị bị rối cố ý để làm chậm người đọc.</li>
<li><strong>Băm API</strong> — hàm được tra bằng hash thay vì tên để giấu import.</li>
</ul>
<h3>Chống phân tích (khái niệm)</h3>
<pre><code>Các phép kiểm né tránh thường gặp (nhận biết, KHÔNG tạo ra):
  - Có debugger đang gắn không?  (kiểu IsDebuggerPresent)
  - Có đang trong VM/sandbox không?  (phần cứng lạ, ít tệp, đo thời gian)
  - Nằm im thật lâu để sống lâu hơn sandbox tự động
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng với phòng thủ</span> Nhận ra các mẹo này cho biết vì sao sandbox không thấy gì và cần soi tay ở đâu — và mỗi phép kiểm chính là một <strong>dấu hiệu</strong> có thể phát hiện.</div>`,
  ]]);

const c5q = quiz('iam302-quiz-5', 'Quiz 5 — Advanced static|||Quiz 5 — Tĩnh nâng cao', [
  { id: 'q1', question: 'Chuỗi ký tự bị mã hoá chỉ giải mã lúc chạy là ví dụ của?|||Chuỗi ký tự bị mã hoá chỉ giải mã lúc chạy là ví dụ của?', options: ['Obfuscation (làm rối)|||Obfuscation (làm rối)', 'Chỉnh lưu|||Chỉnh lưu', 'Persistence|||Persistence', 'Ký số|||Ký số'], correctIndex: 0, explanation: 'Mã hoá chuỗi là một dạng obfuscation để giấu ý đồ khỏi phân tích tĩnh.' },
  { id: 'q2', question: 'Chuỗi API "đọc tệp → CryptEncrypt → xoá bản gốc" gợi ý họ mã độc nào?|||Chuỗi API "đọc tệp → CryptEncrypt → xoá bản gốc" gợi ý họ mã độc nào?', options: ['Ransomware', 'Adware', 'Keylogger', 'Rootkit'], correctIndex: 0, explanation: 'Mẫu mã hoá tệp rồi xoá bản gốc là hành vi điển hình của ransomware.' },
  { id: 'q3', question: 'Phép kiểm "có đang chạy trong VM không" là kỹ thuật?|||Phép kiểm "có đang chạy trong VM không" là kỹ thuật?', options: ['Anti-analysis / né sandbox|||Anti-analysis / né sandbox', 'Tối ưu tốc độ|||Tối ưu tốc độ', 'Nén dữ liệu|||Nén dữ liệu', 'Phân giải DNS|||Phân giải DNS'], correctIndex: 0, explanation: 'Kiểm tra VM/sandbox là anti-analysis để tránh bị mổ tự động.' },
]);

const c6 = doc('iam302-6-1-advanced-dynamic', '6.1 — Advanced dynamic analysis|||6.1 — Phân tích động nâng cao',
  'Dùng debugger để đi từng bước và đặt breakpoint; ý tưởng unpacking (bắt mẫu tự giải nén trong bộ nhớ) và phục hồi cấu hình C2 — ở mức phương pháp, không payload.',
  [[
    `<span class="eyebrow">IAM302 · Chapter 6 · Lesson 6.1</span>
<h2>Advanced dynamic analysis</h2>
<h3>Debugging</h3>
<p>A <strong>debugger</strong> (e.g. x64dbg) runs a sample one step at a time in the lab VM. You set a <strong>breakpoint</strong> on an interesting API, then inspect registers and memory the moment it is hit — the way to see values that only exist at runtime.</p>
<h3>Unpacking (the idea)</h3>
<pre><code>Manual unpacking, conceptually:
  1. Let the packer stub decompress the real code in memory
  2. Break just after it hands control to the unpacked code
  3. Dump that memory region for clean static analysis
</code></pre>
<p>You are not writing a packer — you are letting the sample unpack itself in the sandbox, then capturing the result to read.</p>
<h3>Config recovery</h3>
<p>Many families store a <strong>configuration</strong> (C2 domains, campaign id, keys) encrypted in the file and decrypt it at runtime. Breaking after the decryption routine lets you read the config — pure gold for detection.</p>
<div class="callout"><span class="badge">Method, not payload</span> The value here is the <em>configuration and indicators</em> you recover, not the malicious code. Extract, document, and move to detection.</div>`,
    `<span class="eyebrow">IAM302 · Chương 6 · Bài 6.1</span>
<h2>Phân tích động nâng cao</h2>
<h3>Gỡ lỗi (debugging)</h3>
<p>Một <strong>debugger</strong> (vd x64dbg) chạy mẫu từng bước trong máy ảo lab. Bạn đặt <strong>breakpoint</strong> tại một API đáng chú ý, rồi soi thanh ghi và bộ nhớ đúng lúc nó dừng — cách để thấy các giá trị chỉ tồn tại lúc chạy.</p>
<h3>Gỡ nén (ý tưởng)</h3>
<pre><code>Gỡ nén thủ công, về mặt ý tưởng:
  1. Để stub packer giải nén mã thật vào bộ nhớ
  2. Dừng ngay sau khi nó trao quyền cho mã đã gỡ nén
  3. Dump vùng nhớ đó để phân tích tĩnh sạch
</code></pre>
<p>Bạn không viết packer — bạn để mẫu tự gỡ nén trong sandbox, rồi bắt lại kết quả để đọc.</p>
<h3>Phục hồi cấu hình</h3>
<p>Nhiều họ mã độc lưu <strong>cấu hình</strong> (tên miền C2, id chiến dịch, khoá) đã mã hoá trong tệp và giải mã lúc chạy. Dừng sau đoạn giải mã cho phép đọc cấu hình — vàng ròng cho việc phát hiện.</p>
<div class="callout"><span class="badge">Phương pháp, không payload</span> Giá trị ở đây là <em>cấu hình và dấu hiệu</em> bạn phục hồi được, không phải mã độc. Rút ra, ghi lại, và chuyển sang phát hiện.</div>`,
  ]]);

const c6q = quiz('iam302-quiz-6', 'Quiz 6 — Advanced dynamic|||Quiz 6 — Động nâng cao', [
  { id: 'q1', question: 'Breakpoint trong debugger dùng để?|||Breakpoint trong debugger dùng để?', options: ['Xoá mẫu|||Xoá mẫu', 'Dừng thực thi tại điểm quan tâm để soi thanh ghi/bộ nhớ|||Dừng thực thi tại điểm quan tâm để soi thanh ghi/bộ nhớ', 'Nén tệp|||Nén tệp', 'Gửi mẫu ra Internet|||Gửi mẫu ra Internet'], correctIndex: 1, explanation: 'Breakpoint dừng chương trình để quan sát trạng thái lúc chạy.' },
  { id: 'q2', question: 'Ý tưởng cốt lõi của unpacking thủ công là?|||Ý tưởng cốt lõi của unpacking thủ công là?', options: ['Viết một packer mới|||Viết một packer mới', 'Để mẫu tự gỡ nén trong bộ nhớ rồi dump ra để đọc|||Để mẫu tự gỡ nén trong bộ nhớ rồi dump ra để đọc', 'Xoá PE header|||Xoá PE header', 'Tắt máy ảo|||Tắt máy ảo'], correctIndex: 1, explanation: 'Cho stub tự giải nén, dừng lại, rồi dump vùng nhớ đã gỡ nén.' },
  { id: 'q3', question: 'Phục hồi cấu hình C2 của mẫu có giá trị vì?|||Phục hồi cấu hình C2 của mẫu có giá trị vì?', options: ['Giúp phát tán mẫu|||Giúp phát tán mẫu', 'Cho ra tên miền/khoá làm dấu hiệu để phát hiện|||Cho ra tên miền/khoá làm dấu hiệu để phát hiện', 'Tăng tốc CPU|||Tăng tốc CPU', 'Mã hoá thêm tệp|||Mã hoá thêm tệp'], correctIndex: 1, explanation: 'Cấu hình lộ ra C2 và khoá — dấu hiệu quý để viết luật phát hiện.' },
]);

const c7 = doc('iam302-7-1-evasion-families', '7.1 — Evasion & malware families|||7.1 — Kỹ thuật lẩn tránh & họ mã độc',
  'Các kỹ thuật lẩn tránh (chống VM/debug, sống trên đất — living-off-the-land); đặc điểm nhận diện các họ: ransomware, trojan/RAT, botnet — để phân loại và phòng thủ.',
  [[
    `<span class="eyebrow">IAM302 · Chapter 7 · Lesson 7.1</span>
<h2>Evasion &amp; malware families</h2>
<h3>Evasion techniques (recognise)</h3>
<ul>
<li><strong>Anti-VM / anti-debug</strong> — refuse to run when analysed.</li>
<li><strong>Living-off-the-land</strong> — abuse built-in tools (PowerShell, scheduled tasks) so nothing looks foreign.</li>
<li><strong>Fileless / in-memory</strong> — run from memory to leave little on disk.</li>
</ul>
<h3>Common families &amp; their tells</h3>
<pre><code>Family        Signature behaviour (for identification)
  Ransomware  mass file encryption + a ransom note
  Trojan/RAT  hidden remote control, keylogging, screen capture
  Botnet      many hosts beacon to a shared C2 for commands
  Downloader  small stage-1 that pulls a bigger payload
</code></pre>
<h3>Why families matter</h3>
<p>Classifying a sample into a family instantly suggests <strong>known indicators, tooling and defenses</strong> others have already published — you rarely start from zero.</p>
<div class="callout"><span class="badge">Behaviour beats hashes</span> A hash changes with every rebuild; <strong>behavioural traits</strong> (mass encryption, beaconing) are far more durable for classification and detection.</div>`,
    `<span class="eyebrow">IAM302 · Chương 7 · Bài 7.1</span>
<h2>Kỹ thuật lẩn tránh &amp; họ mã độc</h2>
<h3>Kỹ thuật lẩn tránh (để nhận biết)</h3>
<ul>
<li><strong>Chống VM / chống debug</strong> — từ chối chạy khi bị phân tích.</li>
<li><strong>Sống trên đất (living-off-the-land)</strong> — lạm dụng công cụ sẵn có (PowerShell, tác vụ hẹn giờ) để không có gì trông lạ.</li>
<li><strong>Không tệp / chạy trong bộ nhớ</strong> — chạy từ bộ nhớ để để lại rất ít trên đĩa.</li>
</ul>
<h3>Các họ thường gặp &amp; dấu hiệu</h3>
<pre><code>Họ           Hành vi đặc trưng (để nhận diện)
  Ransomware  mã hoá hàng loạt tệp + để lại thư đòi tiền
  Trojan/RAT  điều khiển từ xa ẩn, keylog, chụp màn hình
  Botnet      nhiều máy beacon về một C2 chung để nhận lệnh
  Downloader  tầng-1 nhỏ, kéo về payload lớn hơn
</code></pre>
<h3>Vì sao họ mã độc quan trọng</h3>
<p>Phân loại một mẫu vào một họ lập tức gợi ra <strong>dấu hiệu, công cụ và cách phòng thủ đã biết</strong> mà người khác đã công bố — hiếm khi bạn bắt đầu từ số không.</p>
<div class="callout"><span class="badge">Hành vi hơn hash</span> Hash đổi theo mỗi lần build lại; <strong>đặc điểm hành vi</strong> (mã hoá hàng loạt, beaconing) bền hơn nhiều để phân loại và phát hiện.</div>`,
  ]]);

const c7q = quiz('iam302-quiz-7', 'Quiz 7 — Evasion & families|||Quiz 7 — Lẩn tránh & họ', [
  { id: 'q1', question: '"Living-off-the-land" nghĩa là?|||"Living-off-the-land" nghĩa là?', options: ['Viết công cụ mới|||Viết công cụ mới', 'Lạm dụng công cụ sẵn có của hệ thống để không bị chú ý|||Lạm dụng công cụ sẵn có của hệ thống để không bị chú ý', 'Mã hoá tệp|||Mã hoá tệp', 'Tắt Internet|||Tắt Internet'], correctIndex: 1, explanation: 'Dùng PowerShell, tác vụ hệ thống... nên hoạt động trông hợp lệ.' },
  { id: 'q2', question: 'Nhiều máy cùng beacon về một C2 để nhận lệnh là đặc trưng của?|||Nhiều máy cùng beacon về một C2 để nhận lệnh là đặc trưng của?', options: ['Botnet', 'Adware', 'Packer', 'Bootloader'], correctIndex: 0, explanation: 'Botnet gồm nhiều host bị điều khiển qua một C2 chung.' },
  { id: 'q3', question: 'Vì sao đặc điểm hành vi thường bền hơn hash để phân loại?|||Vì sao đặc điểm hành vi thường bền hơn hash để phân loại?', options: ['Hash không đổi bao giờ|||Hash không đổi bao giờ', 'Hash đổi theo mỗi lần build; hành vi thì ổn định hơn|||Hash đổi theo mỗi lần build; hành vi thì ổn định hơn', 'Hành vi không đo được|||Hành vi không đo được', 'Hash luôn sai|||Hash luôn sai'], correctIndex: 1, explanation: 'Đổi vài byte là hash khác; hành vi cốt lõi thì khó thay đổi.' },
]);

const c8 = doc('iam302-8-1-response-defense', '8.1 — Response, detection & defense|||8.1 — Ứng phó, phát hiện & phòng thủ',
  'Biến kết quả phân tích thành phòng thủ: IOC, luật YARA, threat intel; biện pháp phòng chống; và đạo đức, xử lý mẫu, báo cáo.',
  [[
    `<span class="eyebrow">IAM302 · Chapter 8 · Lesson 8.1</span>
<h2>Response, detection &amp; defense</h2>
<h3>Turn findings into detections</h3>
<ul>
<li><strong>IOCs (Indicators of Compromise)</strong> — hashes, domains, IPs, filenames, registry keys to sweep the fleet for.</li>
<li><strong>YARA rules</strong> — text/byte patterns that match a family across many samples, used for hunting and blocking.</li>
<li><strong>Threat intel</strong> — sharing IOCs and TTPs (e.g. mapped to MITRE ATT&amp;CK) so defenders act faster.</li>
</ul>
<h3>Defensive measures</h3>
<pre><code>Layered defense (prevention):
  - Patch + least privilege + application allow-listing
  - EDR/AV with the new detections deployed
  - Network segmentation so C2/spread is contained
  - Offline, tested backups against ransomware
</code></pre>
<h3>Ethics, handling &amp; reporting</h3>
<p>Store samples encrypted and access-controlled; only analyse what you are authorised to; and write a clear <strong>report</strong> — summary, capability, IOCs, detections, and recommended actions — so non-analysts can act.</p>
<div class="callout"><span class="badge">The whole point</span> Analysis is finished only when it has produced <strong>defense</strong>: shareable indicators, working detections, and advice that reduces risk.</div>`,
    `<span class="eyebrow">IAM302 · Chương 8 · Bài 8.1</span>
<h2>Ứng phó, phát hiện &amp; phòng thủ</h2>
<h3>Biến kết quả thành luật phát hiện</h3>
<ul>
<li><strong>IOC (Dấu hiệu xâm nhập)</strong> — hash, tên miền, IP, tên tệp, khoá registry để quét toàn hệ thống.</li>
<li><strong>Luật YARA</strong> — mẫu văn bản/byte khớp một họ qua nhiều mẫu, dùng để săn và chặn.</li>
<li><strong>Threat intel</strong> — chia sẻ IOC và TTP (vd ánh xạ MITRE ATT&amp;CK) để đội phòng thủ phản ứng nhanh hơn.</li>
</ul>
<h3>Biện pháp phòng thủ</h3>
<pre><code>Phòng thủ nhiều lớp (phòng ngừa):
  - Vá lỗi + tối thiểu đặc quyền + chỉ cho chạy ứng dụng hợp lệ
  - EDR/AV với các luật phát hiện mới được triển khai
  - Chia tách mạng để chặn C2/lan rộng
  - Sao lưu ngoại tuyến, đã kiểm thử, chống ransomware
</code></pre>
<h3>Đạo đức, xử lý mẫu &amp; báo cáo</h3>
<p>Lưu mẫu có mã hoá và kiểm soát truy cập; chỉ phân tích thứ bạn được phép; và viết một <strong>báo cáo</strong> rõ ràng — tóm tắt, năng lực, IOC, luật phát hiện và hành động khuyến nghị — để người không chuyên vẫn hành động được.</p>
<div class="callout"><span class="badge">Đích cuối cùng</span> Phân tích chỉ xong khi đã tạo ra <strong>phòng thủ</strong>: dấu hiệu chia sẻ được, luật phát hiện chạy được, và khuyến nghị giảm rủi ro.</div>`,
  ]]);

const c8q = quiz('iam302-quiz-8', 'Quiz 8 — Response & defense|||Quiz 8 — Ứng phó & phòng thủ', [
  { id: 'q1', question: 'IOC (Indicator of Compromise) là gì?|||IOC (Indicator of Compromise) là gì?', options: ['Tên của mã độc|||Tên của mã độc', 'Dấu hiệu (hash, tên miền, khoá registry...) để quét và phát hiện|||Dấu hiệu (hash, tên miền, khoá registry...) để quét và phát hiện', 'Một loại packer|||Một loại packer', 'Một thanh ghi CPU|||Một thanh ghi CPU'], correctIndex: 1, explanation: 'IOC là dấu hiệu cụ thể dùng để quét cả hệ thống tìm dấu vết.' },
  { id: 'q2', question: 'Luật YARA chủ yếu dùng để?|||Luật YARA chủ yếu dùng để?', options: ['Chạy mẫu|||Chạy mẫu', 'Khớp mẫu văn bản/byte để phát hiện & săn một họ mã độc|||Khớp mẫu văn bản/byte để phát hiện & săn một họ mã độc', 'Mã hoá ổ đĩa|||Mã hoá ổ đĩa', 'Tăng tốc mạng|||Tăng tốc mạng'], correctIndex: 1, explanation: 'YARA khớp mẫu để nhận diện và săn tìm mã độc theo họ.' },
  { id: 'q3', question: 'Biện pháp nào phòng thủ ransomware tốt nhất trong danh sách?|||Biện pháp nào phòng thủ ransomware tốt nhất trong danh sách?', options: ['Tắt tường lửa|||Tắt tường lửa', 'Sao lưu ngoại tuyến, đã kiểm thử|||Sao lưu ngoại tuyến, đã kiểm thử', 'Dùng chung mật khẩu|||Dùng chung mật khẩu', 'Mở mọi cổng|||Mở mọi cổng'], correctIndex: 1, explanation: 'Backup ngoại tuyến đã kiểm thử giúp khôi phục mà không trả tiền chuộc.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'IAM302',
    slug: 'iam302-malware-analysis-and-reverse-engineering',
    title: 'Malware Analysis and Reverse Engineering',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/IAM302.webp',
    shortDescription: 'Analyze malware safely in an isolated lab — types, static & dynamic analysis, reverse engineering with Ghidra/IDA, evasion & families, plus defense: IOCs, YARA, threat intel & ethics. Method & defense focused, no live payloads.|||Phân tích mã độc an toàn trong lab cách ly — phân loại, phân tích tĩnh & động, dịch ngược bằng Ghidra/IDA, kỹ thuật lẩn tránh & họ mã độc, cùng phòng thủ: IOC, YARA, threat intel & đạo đức. Nhấn phương pháp & phòng thủ.',
    description: 'Môn <strong>IAM302 — Malware Analysis and Reverse Engineering</strong> (kỳ 5, ngành An toàn thông tin) dạy <strong>hiểu mã độc để phòng thủ</strong>, không tạo ra nó. Mọi phân tích diễn ra trong <strong>lab cách ly</strong>. Lộ trình: mã độc &amp; quy trình → phân tích tĩnh (hash, strings, PE) → phân tích động (sandbox) → nhập môn dịch ngược (assembly, Ghidra/IDA) → tĩnh &amp; động nâng cao (luồng, API, unpacking) → lẩn tránh &amp; họ mã độc → ứng phó &amp; phòng thủ (IOC, YARA, threat intel, đạo đức). Bám tài liệu chuẩn (Sikorski &amp; Honig, SANS FOR610, Art of Memory Forensics), song ngữ, quiz mỗi chương. Nhấn phương pháp &amp; phòng thủ, KHÔNG payload thực thi.',
    whatYouLearn: 'Phân loại mã độc &amp; quy trình phân tích; dựng lab/sandbox cách ly an toàn; phân tích tĩnh cơ bản (hash, strings, PE header, packer); phân tích động (tiến trình/tệp/registry/mạng); nền assembly x86 &amp; đọc code trong Ghidra/IDA; luồng điều khiển, lời gọi API, obfuscation &amp; anti-analysis; debugger, ý tưởng unpacking, phục hồi cấu hình C2; kỹ thuật lẩn tránh &amp; đặc điểm các họ; IOC, luật YARA, threat intel, phòng chống, đạo đức &amp; báo cáo.',
    requirements: 'Kiến thức hệ điều hành &amp; mạng cơ bản; biết lập trình một ngôn ngữ. Cần một máy ảo cách ly (VirtualBox/VMware) để thực hành an toàn. Xem điều kiện tiên quyết ngành An toàn thông tin trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn, SANS FOR610, công cụ, lộ trình 4 bước.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Mục tiêu phòng thủ, lab cách ly, đạo đức & pháp lý.', lessons: [intro] },
    { title: 'Chương 1 — Mã độc & phân tích|||Chapter 1 — Malware & analysis', description: 'Loại malware, mục tiêu, lab/sandbox cách ly.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Phân tích tĩnh cơ bản|||Chapter 2 — Basic static', description: 'Hash, strings, PE header, packer.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Phân tích động cơ bản|||Chapter 3 — Basic dynamic', description: 'Sandbox, hành vi mạng/tệp/registry, giám sát.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Nhập môn dịch ngược|||Chapter 4 — Intro reversing', description: 'Assembly x86, disassembler/decompiler, Ghidra/IDA.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Tĩnh nâng cao|||Chapter 5 — Advanced static', description: 'Luồng điều khiển, API, obfuscation, anti-analysis.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Động nâng cao|||Chapter 6 — Advanced dynamic', description: 'Debugger, unpacking, phục hồi cấu hình.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Lẩn tránh & họ mã độc|||Chapter 7 — Evasion & families', description: 'Evasion, ransomware/trojan/botnet, nhận diện.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ứng phó & phòng thủ|||Chapter 8 — Response & defense', description: 'IOC, YARA, threat intel, phòng chống, đạo đức.', lessons: [c8, c8q] },
  ],
};
