/**
 * IAM303 — Malware Analysis and Reverse Engineering (Phân tích mã độc & Dịch ngược).
 * Ngành Khoa học Máy tính (định hướng An toàn thông tin), Kỳ 4, FPTU.
 * Song ngữ VI+EN. Nguồn (trích dẫn, KHÔNG upload): Sikorski/Honig "Practical
 * Malware Analysis"; Ligh et al "Malware Analyst's Cookbook"; Eagle "The IDA
 * Pro Book"; SANS FOR610.
 *
 * ⚠️ ĐỊNH HƯỚNG PHÒNG THỦ/GIÁO DỤC: dạy PHƯƠNG PHÁP phân tích trong LAB CÁCH LY
 * để phòng thủ (blue-team, điều tra số). KHÔNG cung cấp mã độc thực thi, KHÔNG
 * hướng dẫn viết hay phát tán malware. Ví dụ chỉ là lệnh công cụ / assembly
 * minh hoạ, không phải payload thật.
 *
 * Giữ NGUYÊN slug/courseCode/semester/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('iam303-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình FLM, sách chuẩn (Practical Malware Analysis, Cookbook, IDA Pro Book), FOR610, công cụ phòng thủ miễn phí, kênh học, lộ trình an toàn.',
  [[
    `<span class="eyebrow">IAM303 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>malware analysis &amp; reverse engineering the defensive way</strong> — in an isolated lab, for detection, incident response and threat intelligence. The official FPTU slides &amp; syllabus live on <strong>FLM</strong>; below are legal, free resources.</p>
<div class="callout"><span class="badge">Ethics &amp; safety first</span> This course teaches <strong>analysis methods for defense</strong>. Never run unknown samples on a production machine or network. Work only in an <strong>isolated virtual machine</strong> with no bridge to real data. The goal is blue-team defense and investigation, not creating or spreading malware.</div>
<h3>📘 Syllabus &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for IAM303 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>Practical Malware Analysis</em> — Sikorski &amp; Honig (No Starch Press) — the standard hands-on textbook.</li>
<li><em>Malware Analyst's Cookbook</em> — Ligh, Adair, Hartstein &amp; Richard — recipes for triage, sandboxing, memory.</li>
<li><em>The IDA Pro Book</em> — Chris Eagle — the reference for disassembly with IDA.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://for610.com/" target="_blank" rel="noopener">SANS FOR610</a> — Reverse-Engineering Malware course outline &amp; cheat sheets.</li>
<li><a href="https://ghidra-sre.org/" target="_blank" rel="noopener">Ghidra</a> — the NSA's free, open-source reverse-engineering suite.</li>
<li><a href="https://attack.mitre.org/" target="_blank" rel="noopener">MITRE ATT&amp;CK</a> — the shared vocabulary for adversary techniques.</li>
</ul>
<h3>🛠️ Analyst tools (defensive)</h3>
<ul>
<li>Isolated VM: <strong>VirtualBox / VMware</strong> with host-only or no networking; snapshot before each run.</li>
<li>Static: <strong>PEview / PE-bear</strong>, <strong>CFF Explorer</strong>, <strong>strings</strong>, <strong>capa</strong>.</li>
<li>Dynamic (sandbox): <strong>Process Monitor</strong>, <strong>Process Explorer</strong>, <strong>Wireshark</strong>, <strong>FakeNet-NG</strong>, <strong>Cuckoo</strong>.</li>
<li>Disassembly: <strong>Ghidra</strong>, <strong>IDA (free)</strong>, <strong>x64dbg</strong>.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — build a safe, isolated lab; understand malware types &amp; the analysis workflow.</li>
<li><strong>Static then dynamic</strong> — triage with hashes/strings/PE, then observe behavior in the sandbox.</li>
<li><strong>Go deeper</strong> — x86 assembly, disassembly with Ghidra/IDA, and unpacking obfuscated code.</li>
<li><strong>Job-ready</strong> — write YARA rules, extract IOCs, and produce a clear analyst report.</li>
</ol></div>`,
    `<span class="eyebrow">IAM303 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>phân tích mã độc &amp; dịch ngược theo hướng phòng thủ</strong> — trong lab cách ly, phục vụ phát hiện, ứng cứu sự cố và tình báo mối đe doạ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<div class="callout"><span class="badge">Đạo đức &amp; an toàn trước tiên</span> Môn này dạy <strong>phương pháp phân tích để phòng thủ</strong>. Tuyệt đối KHÔNG chạy mẫu lạ trên máy thật hay mạng thật. Chỉ làm trong <strong>máy ảo cách ly</strong>, không nối tới dữ liệu thật. Mục tiêu là phòng thủ blue-team và điều tra, KHÔNG tạo hay phát tán mã độc.</div>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của IAM303 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>Practical Malware Analysis</em> — Sikorski &amp; Honig (No Starch Press) — sách thực hành chuẩn mực.</li>
<li><em>Malware Analyst's Cookbook</em> — Ligh, Adair, Hartstein &amp; Richard — công thức phân loại nhanh, sandbox, bộ nhớ.</li>
<li><em>The IDA Pro Book</em> — Chris Eagle — sách gối đầu về dịch ngược bằng IDA.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://for610.com/" target="_blank" rel="noopener">SANS FOR610</a> — đề cương khoá Dịch ngược mã độc &amp; cheat sheet.</li>
<li><a href="https://ghidra-sre.org/" target="_blank" rel="noopener">Ghidra</a> — bộ công cụ dịch ngược mã nguồn mở, miễn phí của NSA.</li>
<li><a href="https://attack.mitre.org/" target="_blank" rel="noopener">MITRE ATT&amp;CK</a> — từ điển chung mô tả kỹ thuật của kẻ tấn công.</li>
</ul>
<h3>🛠️ Công cụ phân tích (phòng thủ)</h3>
<ul>
<li>Máy ảo cách ly: <strong>VirtualBox / VMware</strong> mạng host-only hoặc tắt hẳn; chụp snapshot trước mỗi lần chạy.</li>
<li>Tĩnh: <strong>PEview / PE-bear</strong>, <strong>CFF Explorer</strong>, <strong>strings</strong>, <strong>capa</strong>.</li>
<li>Động (sandbox): <strong>Process Monitor</strong>, <strong>Process Explorer</strong>, <strong>Wireshark</strong>, <strong>FakeNet-NG</strong>, <strong>Cuckoo</strong>.</li>
<li>Dịch ngược: <strong>Ghidra</strong>, <strong>IDA (bản free)</strong>, <strong>x64dbg</strong>.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — dựng lab cách ly an toàn; hiểu phân loại mã độc &amp; quy trình phân tích.</li>
<li><strong>Tĩnh rồi động</strong> — phân loại nhanh bằng hash/strings/PE, sau đó quan sát hành vi trong sandbox.</li>
<li><strong>Đào sâu</strong> — x86 assembly, dịch ngược bằng Ghidra/IDA, và gỡ mã bị che giấu (unpacking).</li>
<li><strong>Sẵn sàng đi làm</strong> — viết YARA rule, rút IOC, và viết báo cáo phân tích rõ ràng.</li>
</ol></div>`,
  ]]);

const intro = doc('iam303-0-1-overview', 'Course overview: Malware analysis & reverse engineering|||Tổng quan: Phân tích mã độc & dịch ngược',
  'Môn học làm gì, vì sao phòng thủ cần phân tích mã độc; bốn tầng phân tích (tĩnh cơ bản → động cơ bản → tĩnh nâng cao/dịch ngược → động nâng cao); nguyên tắc lab cách ly; lộ trình 8 chương.',
  [[
    `<span class="eyebrow">IAM303 · Lesson 0.1 · Overview</span>
<h2>Malware analysis &amp; reverse engineering</h2>
<p class="lead">This course teaches you to <strong>understand what a suspicious program does</strong> — so you can detect it, respond to an incident, and warn others. It is a <strong>defensive, investigative</strong> discipline: everything happens inside an isolated lab, never against real systems.</p>
<h3>Why defenders analyze malware</h3>
<ul>
<li><strong>Detection</strong> — turn what you learn into signatures (YARA) and indicators (IOCs) so tools catch it next time.</li>
<li><strong>Incident response</strong> — answer "what did it touch, what did it steal, is it still here?".</li>
<li><strong>Threat intelligence</strong> — attribute campaigns and share knowledge with the community.</li>
</ul>
<h3>The four levels of analysis (Sikorski &amp; Honig)</h3>
<pre><code>1. Basic static   -> inspect the file WITHOUT running it (hashes, strings, PE)
2. Basic dynamic  -> RUN it in a sandbox, watch process/registry/network
3. Advanced static-> disassemble &amp; read the code (IDA / Ghidra)
4. Advanced dynamic-> debug the running code step by step</code></pre>
<p>You always go from cheap &amp; safe (static) toward deep &amp; costly (dynamic/debugging), stopping as soon as you have your answer.</p>
<h3>The one rule</h3>
<div class="callout"><span class="badge">Isolate, then observe</span> A sample is guilty until proven innocent. Run it only in a disposable VM with no path to real data or the internet. Snapshot first; revert after.</div>
<h3>Roadmap</h3>
<p>Types &amp; safe lab → basic static → x86 assembly → basic dynamic → disassembly (IDA/Ghidra) → obfuscation &amp; unpacking → advanced behavior (defensive view) → reporting, YARA &amp; IOCs.</p>`,
    `<span class="eyebrow">IAM303 · Bài 0.1 · Tổng quan</span>
<h2>Phân tích mã độc &amp; dịch ngược</h2>
<p class="lead">Môn này dạy bạn <strong>hiểu một chương trình khả nghi làm gì</strong> — để phát hiện nó, ứng cứu sự cố, và cảnh báo cho người khác. Đây là ngành <strong>phòng thủ, điều tra</strong>: mọi thứ diễn ra trong lab cách ly, không bao giờ nhắm vào hệ thống thật.</p>
<h3>Vì sao người phòng thủ phân tích mã độc</h3>
<ul>
<li><strong>Phát hiện</strong> — biến điều học được thành chữ ký (YARA) và chỉ dấu (IOC) để công cụ bắt được lần sau.</li>
<li><strong>Ứng cứu sự cố</strong> — trả lời "nó đụng vào gì, lấy trộm gì, còn ở đây không?".</li>
<li><strong>Tình báo mối đe doạ</strong> — quy chiếu chiến dịch tấn công và chia sẻ hiểu biết với cộng đồng.</li>
</ul>
<h3>Bốn tầng phân tích (Sikorski &amp; Honig)</h3>
<pre><code>1. Tĩnh cơ bản   -> soi file mà KHÔNG chạy (hash, strings, PE)
2. Động cơ bản   -> CHẠY trong sandbox, xem tiến trình/registry/mạng
3. Tĩnh nâng cao -> dịch ngược &amp; đọc mã (IDA / Ghidra)
4. Động nâng cao -> debug mã đang chạy từng bước</code></pre>
<p>Luôn đi từ rẻ &amp; an toàn (tĩnh) tới sâu &amp; tốn kém (động/debug), dừng ngay khi đã có câu trả lời.</p>
<h3>Nguyên tắc bất di bất dịch</h3>
<div class="callout"><span class="badge">Cách ly rồi mới quan sát</span> Coi mẫu là có tội cho tới khi chứng minh vô hại. Chỉ chạy trong máy ảo dùng-một-lần, không có đường tới dữ liệu thật hay Internet. Snapshot trước; hoàn nguyên sau.</div>
<h3>Lộ trình</h3>
<p>Phân loại &amp; lab an toàn → tĩnh cơ bản → x86 assembly → động cơ bản → dịch ngược (IDA/Ghidra) → che giấu &amp; unpacking → hành vi nâng cao (góc phòng thủ) → báo cáo, YARA &amp; IOC.</p>`,
  ]]);

const c1 = doc('iam303-1-1-types-lab', '1.1 — Malware types & building a safe isolated lab|||1.1 — Phân loại mã độc & dựng lab cách ly an toàn',
  'Phân loại mã độc theo hành vi (virus, worm, trojan, ransomware, rootkit, backdoor, spyware); mục tiêu của kẻ tấn công; dựng lab cách ly (máy ảo, snapshot, mạng host-only/tắt) và quy tắc an toàn khi xử lý mẫu.',
  [[
    `<span class="eyebrow">IAM303 · Chapter 1 · Lesson 1.1</span>
<h2>Malware types &amp; a safe isolated lab</h2>
<h3>Classifying by behavior</h3>
<ul>
<li><strong>Virus</strong> — attaches to a host file and spreads when that file runs.</li>
<li><strong>Worm</strong> — spreads across a network on its own, no host file needed.</li>
<li><strong>Trojan</strong> — pretends to be something useful to get run.</li>
<li><strong>Ransomware</strong> — encrypts files and demands payment.</li>
<li><strong>Rootkit</strong> — hides its presence deep in the system.</li>
<li><strong>Backdoor / RAT</strong> — gives an attacker remote control.</li>
<li><strong>Spyware / infostealer</strong> — quietly harvests data.</li>
</ul>
<p>Real samples usually combine several categories — a dropper that installs a backdoor that steals data. Classify by <em>what it does</em>, not by one label.</p>
<h3>Building the isolated lab</h3>
<p>The lab is a <strong>disposable virtual machine</strong> that you can throw away and rebuild. It must never reach real data, real credentials, or the live network.</p>
<pre><code>Safe lab checklist:
  [ ] Analysis VM (e.g. FLARE-VM style Windows) inside VirtualBox/VMware
  [ ] Networking = host-only or DISABLED (no bridge to real LAN/Internet)
  [ ] A clean SNAPSHOT taken before any sample runs
  [ ] No shared folders / clipboard with the host while running
  [ ] Host is fully patched; samples stored zipped + password "infected"</code></pre>
<div class="callout"><span class="badge">Snapshot &amp; revert</span> The single most important habit: snapshot the clean VM, run the sample, take your notes, then <strong>revert</strong> to the snapshot. Every analysis starts from the same known-clean state.</div>`,
    `<span class="eyebrow">IAM303 · Chương 1 · Bài 1.1</span>
<h2>Phân loại mã độc &amp; lab cách ly an toàn</h2>
<h3>Phân loại theo hành vi</h3>
<ul>
<li><strong>Virus</strong> — bám vào một file chủ và lây khi file đó chạy.</li>
<li><strong>Worm (sâu)</strong> — tự lây qua mạng, không cần file chủ.</li>
<li><strong>Trojan</strong> — giả dạng thứ hữu ích để được chạy.</li>
<li><strong>Ransomware (tống tiền)</strong> — mã hoá file và đòi tiền chuộc.</li>
<li><strong>Rootkit</strong> — ẩn sự hiện diện của mình sâu trong hệ thống.</li>
<li><strong>Backdoor / RAT</strong> — cho kẻ tấn công điều khiển từ xa.</li>
<li><strong>Spyware / infostealer</strong> — lặng lẽ thu thập dữ liệu.</li>
</ul>
<p>Mẫu thật thường gộp nhiều loại — một dropper cài một backdoor để đánh cắp dữ liệu. Hãy phân loại theo <em>việc nó làm</em>, đừng gói vào một nhãn.</p>
<h3>Dựng lab cách ly</h3>
<p>Lab là một <strong>máy ảo dùng-một-lần</strong> mà bạn có thể vứt đi rồi dựng lại. Nó tuyệt đối không được chạm tới dữ liệu thật, thông tin đăng nhập thật, hay mạng đang hoạt động.</p>
<pre><code>Danh sách kiểm lab an toàn:
  [ ] Máy ảo phân tích (vd Windows kiểu FLARE-VM) trong VirtualBox/VMware
  [ ] Mạng = host-only hoặc TẮT HẲN (không nối tới LAN/Internet thật)
  [ ] Chụp SNAPSHOT sạch trước khi chạy bất kỳ mẫu nào
  [ ] Không chia sẻ thư mục / clipboard với máy chủ khi đang chạy
  [ ] Máy chủ vá đầy đủ; mẫu lưu dạng zip + mật khẩu "infected"</code></pre>
<div class="callout"><span class="badge">Snapshot &amp; hoàn nguyên</span> Thói quen quan trọng nhất: chụp snapshot máy ảo sạch, chạy mẫu, ghi chú, rồi <strong>hoàn nguyên</strong> về snapshot. Mỗi lần phân tích đều bắt đầu từ đúng một trạng thái sạch đã biết.</div>`,
  ]]);

const c1q = quiz('iam303-quiz-1', 'Quiz 1 — Types & lab|||Quiz 1 — Phân loại & lab', [
  { id: 'q1', question: 'Điểm khác biệt cốt lõi giữa "worm" và "virus" là gì?', options: ['Worm mã hoá file, virus thì không', 'Worm tự lây qua mạng không cần file chủ; virus phải bám vào file chủ', 'Virus điều khiển từ xa, worm thì không', 'Không có khác biệt'], correctIndex: 1, explanation: 'Worm tự nhân bản và lây qua mạng độc lập; virus cần bám vào một file chủ và lây khi file đó chạy.' },
  { id: 'q2', question: 'Cấu hình mạng phù hợp cho lab phân tích mã độc là?', options: ['Bridged nối thẳng mạng công ty', 'Host-only hoặc tắt hẳn để cách ly', 'Mở mọi cổng ra Internet để mẫu chạy đủ', 'Dùng chính máy chủ, không cần máy ảo'], correctIndex: 1, explanation: 'Mạng phải host-only hoặc tắt hẳn để mẫu không lan ra mạng thật; bridged là rất nguy hiểm.' },
  { id: 'q3', question: 'Vì sao phải chụp snapshot máy ảo trước khi chạy mẫu?', options: ['Để tăng tốc CPU', 'Để hoàn nguyên về trạng thái sạch đã biết sau khi phân tích', 'Để mẫu chạy nhanh hơn', 'Để chia sẻ mẫu ra ngoài'], correctIndex: 1, explanation: 'Snapshot cho phép hoàn nguyên về trạng thái sạch, nên mỗi lần phân tích luôn bắt đầu từ cùng một điểm và không tích luỹ nhiễm bẩn.' },
]);

const c2 = doc('iam303-2-1-static', '2.1 — Basic static analysis (hashes, strings, PE, imports)|||2.1 — Phân tích tĩnh cơ bản (hash, strings, PE, import)',
  'Soi file mà không chạy: băm (MD5/SHA-256) để định danh & tra VirusTotal, đọc chuỗi (strings), cấu trúc PE (header, section, entropy), bảng import (IAT) để đoán khả năng của mã; cạm bẫy chuỗi bị đóng gói.',
  [[
    `<span class="eyebrow">IAM303 · Chapter 2 · Lesson 2.1</span>
<h2>Basic static analysis</h2>
<p class="lead">Static analysis inspects a file <strong>without running it</strong> — the safest first step. It gives fast leads: identity, capabilities, and whether the file is hiding something.</p>
<h3>Hashing — the file's fingerprint</h3>
<p>Compute a cryptographic hash to identify the sample uniquely and look it up in threat databases (e.g. VirusTotal).</p>
<pre><code>sha256sum sample.bin
strings -n 8 sample.bin | less        # printable strings, min length 8</code></pre>
<h3>Strings — cheap intelligence</h3>
<p>Readable text can reveal URLs, IP addresses, file paths, registry keys, error messages, or library names — strong hints about behavior. But be skeptical: packed samples show few meaningful strings.</p>
<h3>The PE (Portable Executable) structure</h3>
<ul>
<li><strong>Header</strong> — machine type, timestamp, entry point.</li>
<li><strong>Sections</strong> — .text (code), .data, .rsrc (resources). Odd names or a tiny .text with high <strong>entropy</strong> hint at packing.</li>
<li><strong>Imports (IAT)</strong> — the Windows API functions the program calls. This is the richest static clue.</li>
</ul>
<pre><code>Imports that suggest a capability:
  InternetOpenUrl / WSAStartup   -> network / C2
  CreateFile / RegSetValueEx     -> file &amp; registry persistence
  CryptEncrypt                   -> possible ransomware
  VirtualAllocEx / WriteProcessMemory -> code injection</code></pre>
<div class="callout"><span class="badge">Few imports = suspicious</span> A real program calls many APIs. A sample that imports almost nothing (often only LoadLibrary/GetProcAddress) is likely <strong>packed</strong> — it will unpack and resolve its real APIs at runtime.</div>`,
    `<span class="eyebrow">IAM303 · Chương 2 · Bài 2.1</span>
<h2>Phân tích tĩnh cơ bản</h2>
<p class="lead">Phân tích tĩnh soi file <strong>mà không chạy nó</strong> — bước đầu an toàn nhất. Nó cho manh mối nhanh: danh tính, khả năng, và liệu file có đang giấu gì không.</p>
<h3>Băm (hash) — vân tay của file</h3>
<p>Tính hash mật mã để định danh mẫu duy nhất và tra trong cơ sở dữ liệu mối đe doạ (vd VirusTotal).</p>
<pre><code>sha256sum sample.bin
strings -n 8 sample.bin | less        # chuỗi in được, dài tối thiểu 8</code></pre>
<h3>Chuỗi (strings) — tình báo rẻ tiền</h3>
<p>Văn bản đọc được có thể lộ URL, địa chỉ IP, đường dẫn file, khoá registry, thông báo lỗi, hay tên thư viện — gợi ý mạnh về hành vi. Nhưng phải hoài nghi: mẫu đã đóng gói (packed) hầu như không có chuỗi ý nghĩa.</p>
<h3>Cấu trúc PE (Portable Executable)</h3>
<ul>
<li><strong>Header</strong> — loại máy, mốc thời gian, điểm vào (entry point).</li>
<li><strong>Section</strong> — .text (mã), .data, .rsrc (tài nguyên). Tên lạ hoặc .text nhỏ xíu mà <strong>entropy</strong> cao là dấu hiệu đóng gói.</li>
<li><strong>Import (IAT)</strong> — các hàm Windows API mà chương trình gọi. Đây là manh mối tĩnh giàu nhất.</li>
</ul>
<pre><code>Import gợi ý khả năng của mã:
  InternetOpenUrl / WSAStartup   -> mạng / C2
  CreateFile / RegSetValueEx     -> ghi file &amp; bám trụ qua registry
  CryptEncrypt                   -> có thể là ransomware
  VirtualAllocEx / WriteProcessMemory -> tiêm mã (injection)</code></pre>
<div class="callout"><span class="badge">Ít import = đáng ngờ</span> Chương trình thật gọi nhiều API. Mẫu gần như không import gì (thường chỉ LoadLibrary/GetProcAddress) khả năng cao là <strong>đã đóng gói</strong> — nó sẽ tự bung và phân giải API thật lúc chạy.</div>`,
  ]]);

const c2q = quiz('iam303-quiz-2', 'Quiz 2 — Static analysis|||Quiz 2 — Phân tích tĩnh', [
  { id: 'q1', question: 'Vì sao tính hash SHA-256 của mẫu là bước đầu quan trọng?', options: ['Để chạy mẫu nhanh hơn', 'Để định danh duy nhất và tra cứu trong cơ sở dữ liệu mối đe doạ', 'Để mã hoá mẫu', 'Để xoá mẫu an toàn'], correctIndex: 1, explanation: 'Hash là vân tay duy nhất của file, cho phép so khớp và tra cứu (vd VirusTotal) mà không cần chạy mẫu.' },
  { id: 'q2', question: 'Bảng import (IAT) của một PE cho biết điều gì?', options: ['Kích thước ổ cứng', 'Các hàm Windows API mà chương trình gọi, gợi ý khả năng của nó', 'Mật khẩu người dùng', 'Tốc độ mạng'], correctIndex: 1, explanation: 'IAT liệt kê các API được gọi; ví dụ WriteProcessMemory gợi ý tiêm mã, CryptEncrypt gợi ý ransomware.' },
  { id: 'q3', question: 'Một mẫu hầu như không có chuỗi ý nghĩa và chỉ import LoadLibrary/GetProcAddress thường là dấu hiệu của?', options: ['File sạch chắc chắn', 'Đã bị đóng gói/che giấu (packed), sẽ bung lúc chạy', 'File văn bản', 'Lỗi tải file'], correctIndex: 1, explanation: 'Ít import và ít chuỗi cùng entropy cao là dấu hiệu điển hình của packing; mã thật được bung và API được phân giải khi chạy.' },
]);

const c3 = doc('iam303-3-1-x86', '3.1 — x86 assembly foundations & program structure|||3.1 — Nền tảng x86 assembly & cấu trúc chương trình',
  'Vì sao cần assembly khi dịch ngược; thanh ghi, ngăn xếp (stack), lệnh cơ bản (mov/add/cmp/jmp), cờ trạng thái; quy ước gọi hàm & khung stack; nhận diện vòng lặp và rẽ nhánh trong mã đã dịch ngược.',
  [[
    `<span class="eyebrow">IAM303 · Chapter 3 · Lesson 3.1</span>
<h2>x86 assembly foundations</h2>
<p class="lead">Malware ships as compiled machine code. To read it, you need enough <strong>x86 assembly</strong> to recognize the shapes of loops, branches, and function calls — not to write it.</p>
<h3>Registers &amp; the stack</h3>
<ul>
<li><strong>General registers</strong> — EAX, EBX, ECX, EDX (32-bit) hold values; EAX usually carries return values.</li>
<li><strong>ESP / EBP</strong> — the stack pointer and base pointer, which frame each function call.</li>
<li><strong>EIP</strong> — the instruction pointer: the address of the next instruction to run.</li>
</ul>
<h3>Instructions you will see constantly</h3>
<pre><code>mov  eax, 5        ; put 5 into eax
add  eax, ebx      ; eax = eax + ebx
cmp  eax, 0        ; compare, sets flags (ZF etc.)
jz   loc_401050    ; jump if zero flag set (result was equal)
call sub_401000    ; call a function
ret                ; return to caller</code></pre>
<h3>The function frame &amp; calling convention</h3>
<p>A typical function saves the caller's frame, makes room for locals, does its work, then restores and returns. Arguments (in the common stdcall/cdecl conventions) are pushed on the stack; the return value comes back in EAX.</p>
<pre><code>push ebp           ; save old base pointer   \\  function
mov  ebp, esp      ; set up new frame        /   prologue
sub  esp, 40h      ; reserve local variables
...                ; body
mov  esp, ebp      ; \\  function
pop  ebp           ; /   epilogue
ret</code></pre>
<div class="callout"><span class="badge">Read shapes, not every line</span> You rarely trace every instruction. Learn to spot the patterns: a compare + conditional jump is an <em>if</em>; a jump backwards to a compare is a <em>loop</em>; push arguments + call is a <em>function call</em>.</div>`,
    `<span class="eyebrow">IAM303 · Chương 3 · Bài 3.1</span>
<h2>Nền tảng x86 assembly</h2>
<p class="lead">Mã độc phát hành dưới dạng mã máy đã biên dịch. Để đọc nó, bạn cần đủ <strong>x86 assembly</strong> để nhận ra hình dạng của vòng lặp, rẽ nhánh và lời gọi hàm — không phải để viết nó.</p>
<h3>Thanh ghi &amp; ngăn xếp (stack)</h3>
<ul>
<li><strong>Thanh ghi chung</strong> — EAX, EBX, ECX, EDX (32-bit) giữ giá trị; EAX thường mang giá trị trả về.</li>
<li><strong>ESP / EBP</strong> — con trỏ ngăn xếp và con trỏ nền, định khung cho mỗi lời gọi hàm.</li>
<li><strong>EIP</strong> — con trỏ lệnh: địa chỉ lệnh kế tiếp sẽ chạy.</li>
</ul>
<h3>Những lệnh bạn sẽ gặp liên tục</h3>
<pre><code>mov  eax, 5        ; đặt 5 vào eax
add  eax, ebx      ; eax = eax + ebx
cmp  eax, 0        ; so sánh, đặt cờ (ZF ...)
jz   loc_401050    ; nhảy nếu cờ zero bật (kết quả bằng nhau)
call sub_401000    ; gọi một hàm
ret                ; trả về nơi gọi</code></pre>
<h3>Khung hàm &amp; quy ước gọi</h3>
<p>Một hàm điển hình lưu khung của nơi gọi, chừa chỗ cho biến cục bộ, làm việc, rồi khôi phục và trả về. Tham số (trong quy ước stdcall/cdecl phổ biến) được đẩy lên stack; giá trị trả về nằm trong EAX.</p>
<pre><code>push ebp           ; lưu con trỏ nền cũ    \\  mở đầu
mov  ebp, esp      ; dựng khung mới        /   (prologue)
sub  esp, 40h      ; dành chỗ biến cục bộ
...                ; thân hàm
mov  esp, ebp      ; \\  kết thúc
pop  ebp           ; /   (epilogue)
ret</code></pre>
<div class="callout"><span class="badge">Đọc hình dạng, không đọc từng dòng</span> Bạn hiếm khi lần từng lệnh. Hãy nhận ra khuôn mẫu: so sánh + nhảy có điều kiện là <em>if</em>; nhảy lùi về chỗ so sánh là <em>vòng lặp</em>; đẩy tham số + call là <em>lời gọi hàm</em>.</div>`,
  ]]);

const c3q = quiz('iam303-quiz-3', 'Quiz 3 — x86 assembly|||Quiz 3 — x86 assembly', [
  { id: 'q1', question: 'Trong x86, thanh ghi nào thường mang giá trị TRẢ VỀ của hàm?', options: ['ESP', 'EAX', 'EIP', 'EBP'], correctIndex: 1, explanation: 'Theo quy ước phổ biến, giá trị trả về của hàm nằm trong EAX.' },
  { id: 'q2', question: 'Cặp lệnh "cmp eax, 0" theo sau "jz loc_..." tạo thành cấu trúc gì?', options: ['Một vòng lặp vô hạn', 'Một rẽ nhánh có điều kiện (if): nhảy khi bằng nhau', 'Một lời gọi hàm', 'Một phép nhân'], correctIndex: 1, explanation: 'cmp đặt cờ trạng thái, jz nhảy khi cờ zero bật — đây là mẫu rẽ nhánh có điều kiện (if).' },
  { id: 'q3', question: 'Chuỗi "push ebp; mov ebp, esp; sub esp, ..." ở đầu một hàm được gọi là?', options: ['Epilogue (kết thúc)', 'Prologue (mở đầu) — dựng khung stack và dành chỗ biến cục bộ', 'Một lời gọi API', 'Một vòng lặp'], correctIndex: 1, explanation: 'Đó là function prologue: lưu con trỏ nền cũ, dựng khung mới và dành chỗ cho biến cục bộ.' },
]);

const c4 = doc('iam303-4-1-dynamic', '4.1 — Basic dynamic analysis (sandbox, process/registry/network)|||4.1 — Phân tích động cơ bản (sandbox, tiến trình/registry/mạng)',
  'Chạy mẫu trong sandbox cách ly và quan sát hành vi thật: giám sát tiến trình & luồng (Process Monitor/Explorer), thay đổi file & registry, lưu lượng mạng (Wireshark) với DNS/C2 giả (FakeNet-NG); giới hạn của phân tích động (nhánh không kích hoạt).',
  [[
    `<span class="eyebrow">IAM303 · Chapter 4 · Lesson 4.1</span>
<h2>Basic dynamic analysis</h2>
<p class="lead">Dynamic analysis <strong>runs the sample</strong> in the isolated lab and watches what it actually does. It reveals behavior that static analysis can miss — but it only shows the paths that actually execute during your run.</p>
<h3>What to monitor</h3>
<ul>
<li><strong>Processes &amp; threads</strong> — did it spawn children, inject into another process, or replace itself? (Process Explorer, Process Monitor)</li>
<li><strong>File system</strong> — files dropped, modified, or deleted; where it copies itself.</li>
<li><strong>Registry</strong> — keys written for persistence or configuration.</li>
<li><strong>Network</strong> — DNS lookups, connections, and beacons to a command-and-control (C2) server (Wireshark).</li>
</ul>
<h3>Faking the internet</h3>
<p>Since the lab has no real network, tools like <strong>FakeNet-NG</strong> or an INetSim host answer the malware's DNS and HTTP requests with fake responses — so you can observe the C2 conversation safely, without ever touching the real internet.</p>
<pre><code>Typical observed behavior (example, from monitoring tools):
  Process:  sample.exe -> spawns svch0st.exe (note the typo-name)
  File:     writes C:\\Users\\Public\\update.dat
  Registry: HKCU\\...\\Run\\Updater = C:\\Users\\Public\\svch0st.exe
  Network:  DNS query for update-server.example -> HTTP GET /gate.php</code></pre>
<div class="callout"><span class="badge">Dynamic shows only what ran</span> If the sample checks the date, the language, or whether a debugger/VM is present, it may hide its real behavior. Dynamic analysis is powerful but incomplete — combine it with static reading.</div>`,
    `<span class="eyebrow">IAM303 · Chương 4 · Bài 4.1</span>
<h2>Phân tích động cơ bản</h2>
<p class="lead">Phân tích động <strong>chạy mẫu</strong> trong lab cách ly và xem nó thật sự làm gì. Nó lộ ra hành vi mà phân tích tĩnh có thể bỏ sót — nhưng chỉ thấy những nhánh thực sự chạy trong lần đó.</p>
<h3>Giám sát cái gì</h3>
<ul>
<li><strong>Tiến trình &amp; luồng</strong> — nó có sinh tiến trình con, tiêm vào tiến trình khác, hay tự thay thế không? (Process Explorer, Process Monitor)</li>
<li><strong>Hệ thống file</strong> — file được thả, sửa, hay xoá; nó tự sao chép đi đâu.</li>
<li><strong>Registry</strong> — khoá được ghi để bám trụ hoặc cấu hình.</li>
<li><strong>Mạng</strong> — truy vấn DNS, kết nối, và "nhịp beacon" tới máy chủ điều khiển (C2) (Wireshark).</li>
</ul>
<h3>Giả lập Internet</h3>
<p>Vì lab không có mạng thật, các công cụ như <strong>FakeNet-NG</strong> hay máy INetSim trả lời truy vấn DNS và HTTP của mã độc bằng phản hồi giả — nên bạn quan sát được cuộc "hội thoại" C2 một cách an toàn, không hề chạm tới Internet thật.</p>
<pre><code>Hành vi quan sát điển hình (ví dụ, từ công cụ giám sát):
  Tiến trình: sample.exe -> sinh svch0st.exe (để ý tên gõ nhại)
  File:      ghi C:\\Users\\Public\\update.dat
  Registry:  HKCU\\...\\Run\\Updater = C:\\Users\\Public\\svch0st.exe
  Mạng:      truy vấn DNS update-server.example -> HTTP GET /gate.php</code></pre>
<div class="callout"><span class="badge">Động chỉ thấy cái đã chạy</span> Nếu mẫu kiểm ngày, ngôn ngữ, hoặc có debugger/máy ảo hay không, nó có thể giấu hành vi thật. Phân tích động mạnh nhưng không đầy đủ — hãy kết hợp với đọc tĩnh.</div>`,
  ]]);

const c4q = quiz('iam303-quiz-4', 'Quiz 4 — Dynamic analysis|||Quiz 4 — Phân tích động', [
  { id: 'q1', question: 'Công cụ như FakeNet-NG / INetSim dùng để làm gì trong lab?', options: ['Nối mẫu ra Internet thật', 'Giả lập DNS/HTTP để quan sát C2 an toàn mà không chạm mạng thật', 'Mã hoá ổ đĩa', 'Tăng tốc CPU máy ảo'], correctIndex: 1, explanation: 'Chúng trả lời truy vấn mạng của mẫu bằng phản hồi giả, cho phép quan sát hành vi C2 mà không kết nối Internet thật.' },
  { id: 'q2', question: 'Process Monitor / Process Explorer giúp quan sát điều gì?', options: ['Chỉ nhiệt độ CPU', 'Tiến trình sinh ra, thay đổi file & registry', 'Mật khẩu Wi-Fi', 'Phiên bản BIOS'], correctIndex: 1, explanation: 'Chúng theo dõi tiến trình/luồng, thao tác file và registry — trung tâm của phân tích động cơ bản.' },
  { id: 'q3', question: 'Vì sao phân tích động không đủ để kết luận mọi hành vi của mẫu?', options: ['Vì nó luôn sai', 'Vì mẫu có thể chỉ chạy một số nhánh và ẩn hành vi khi phát hiện VM/debugger', 'Vì máy ảo quá nhanh', 'Vì hash thay đổi'], correctIndex: 1, explanation: 'Động chỉ thấy các nhánh thực sự chạy; mẫu có thể kiểm tra điều kiện (ngày, VM, debugger) và giấu hành vi, nên cần kết hợp phân tích tĩnh.' },
]);

const c5 = doc('iam303-5-1-disassembly', '5.1 — Reverse engineering with IDA & Ghidra|||5.1 — Dịch ngược với IDA & Ghidra',
  'Dịch ngược (disassembly) vs giải biên dịch (decompilation); dùng IDA/Ghidra để dựng đồ thị luồng điều khiển, nhận diện hàm & lời gọi API, đặt tên/ghi chú, đọc pseudo-code; chiến lược ưu tiên đọc quanh API đáng ngờ.',
  [[
    `<span class="eyebrow">IAM303 · Chapter 5 · Lesson 5.1</span>
<h2>Reverse engineering with IDA &amp; Ghidra</h2>
<p class="lead">Advanced static analysis means reading the code itself. A <strong>disassembler</strong> turns machine code back into assembly; a <strong>decompiler</strong> goes further, reconstructing readable C-like pseudo-code.</p>
<h3>IDA and Ghidra</h3>
<ul>
<li><strong>IDA Pro / IDA Free</strong> — the industry-standard disassembler, with a powerful interactive database.</li>
<li><strong>Ghidra</strong> — the free, open-source suite from the NSA, with a strong built-in decompiler.</li>
</ul>
<p>Both build a <strong>control-flow graph</strong> (boxes of code joined by arrows), recover functions, and label API calls — turning a flat byte stream into something you can navigate.</p>
<h3>A practical workflow</h3>
<pre><code>1. Start at an interesting anchor: an imported API or a found string
2. Follow xrefs (cross-references) to WHO calls it
3. Read the decompiler pseudo-code first; drop to assembly only when needed
4. RENAME functions/variables as you understand them (analyze_config, ...)
5. Add comments; the database becomes your growing map of the sample</code></pre>
<div class="callout"><span class="badge">Anchor on capability</span> You don't read a binary top to bottom. Anchor on something meaningful — a suspicious API like <code>CreateRemoteThread</code> or a C2 string — and use cross-references to work outward to the code that matters.</div>`,
    `<span class="eyebrow">IAM303 · Chương 5 · Bài 5.1</span>
<h2>Dịch ngược với IDA &amp; Ghidra</h2>
<p class="lead">Phân tích tĩnh nâng cao là đọc chính mã. <strong>Disassembler</strong> biến mã máy trở lại thành assembly; <strong>decompiler</strong> đi xa hơn, tái dựng pseudo-code giống C dễ đọc.</p>
<h3>IDA và Ghidra</h3>
<ul>
<li><strong>IDA Pro / IDA Free</strong> — disassembler chuẩn ngành, với cơ sở dữ liệu tương tác mạnh.</li>
<li><strong>Ghidra</strong> — bộ công cụ mã nguồn mở miễn phí của NSA, có decompiler tích hợp tốt.</li>
</ul>
<p>Cả hai dựng <strong>đồ thị luồng điều khiển</strong> (các khối mã nối bằng mũi tên), khôi phục hàm, và gắn nhãn lời gọi API — biến dòng byte phẳng thành thứ bạn có thể đi lại được.</p>
<h3>Quy trình thực dụng</h3>
<pre><code>1. Bắt đầu ở một điểm neo thú vị: một API import hoặc một chuỗi tìm được
2. Lần theo xref (tham chiếu chéo) tới AI gọi nó
3. Đọc pseudo-code của decompiler trước; chỉ xuống assembly khi cần
4. ĐẶT LẠI TÊN hàm/biến khi bạn hiểu chúng (analyze_config, ...)
5. Thêm ghi chú; cơ sở dữ liệu dần thành tấm bản đồ của bạn về mẫu</code></pre>
<div class="callout"><span class="badge">Neo vào khả năng</span> Bạn không đọc một binary từ đầu tới cuối. Hãy neo vào thứ có ý nghĩa — một API đáng ngờ như <code>CreateRemoteThread</code> hoặc một chuỗi C2 — rồi dùng tham chiếu chéo lần ra phần mã quan trọng.</div>`,
  ]]);

const c5q = quiz('iam303-quiz-5', 'Quiz 5 — IDA & Ghidra|||Quiz 5 — IDA & Ghidra', [
  { id: 'q1', question: 'Khác biệt giữa disassembler và decompiler là?', options: ['Không khác gì', 'Disassembler cho ra assembly; decompiler tái dựng pseudo-code giống C dễ đọc hơn', 'Decompiler chạy mẫu, disassembler thì không', 'Disassembler mã hoá mã'], correctIndex: 1, explanation: 'Disassembler biến mã máy thành assembly; decompiler đi xa hơn, dựng lại pseudo-code cấp cao dễ đọc.' },
  { id: 'q2', question: 'Ghidra là công cụ như thế nào?', options: ['Phần mềm thương mại đắt tiền của Microsoft', 'Bộ dịch ngược mã nguồn mở, miễn phí do NSA phát hành', 'Một loại mã độc', 'Trình duyệt web'], correctIndex: 1, explanation: 'Ghidra là bộ công cụ dịch ngược mã nguồn mở, miễn phí của NSA, có decompiler tích hợp mạnh.' },
  { id: 'q3', question: 'Chiến lược hiệu quả khi bắt đầu dịch ngược một mẫu là?', options: ['Đọc tuần tự từ byte đầu tới byte cuối', 'Neo vào API/chuỗi đáng ngờ rồi lần theo tham chiếu chéo (xref)', 'Chạy mẫu trên máy thật', 'Xoá bảng import'], correctIndex: 1, explanation: 'Nên neo vào điểm có ý nghĩa (API đáng ngờ, chuỗi C2) và dùng xref để lần tới phần mã quan trọng, thay vì đọc tuần tự toàn bộ.' },
]);

const c6 = doc('iam303-6-1-obfuscation', '6.1 — Malware obfuscation (packing) & unpacking|||6.1 — Kỹ thuật che giấu (packing) & gỡ gói',
  'Vì sao mã độc che giấu; packing/compression, mã hoá chuỗi, kỹ thuật chống dịch ngược; nhận diện packer (entropy cao, ít import, section lạ); nguyên tắc unpack an toàn: chạy tới điểm gói tự bung rồi dump bộ nhớ trong lab cách ly.',
  [[
    `<span class="eyebrow">IAM303 · Chapter 6 · Lesson 6.1</span>
<h2>Obfuscation &amp; unpacking</h2>
<p class="lead">Malware authors hide their code to defeat both static analysis and signatures. Understanding these tricks — from a defender's seat — lets you see through them.</p>
<h3>Common concealment techniques</h3>
<ul>
<li><strong>Packing / compression</strong> — the real code is compressed or encrypted, and a small <em>stub</em> unpacks it in memory at runtime.</li>
<li><strong>String encryption</strong> — URLs and keys are decrypted only when used, so <code>strings</code> finds nothing.</li>
<li><strong>Anti-analysis</strong> — checks for a debugger, a VM, or timing anomalies, then behaves innocently if detected.</li>
</ul>
<h3>Recognizing a packed sample</h3>
<pre><code>Red flags of packing:
  - Very high entropy in the code section (looks random / encrypted)
  - Almost no imports (only LoadLibrary + GetProcAddress)
  - Unusual section names (UPX0, UPX1, .themida, ...)
  - Entry point in a section that is also writable</code></pre>
<h3>Unpacking — the safe idea</h3>
<p>The stub must reveal the real code in memory to run it. So the general approach is: let the stub do its job in the isolated lab, pause right after it finishes unpacking (at the "original entry point"), then <strong>dump the now-visible code from memory</strong> and analyze that. Known packers (e.g. UPX) often have a direct unpack option.</p>
<div class="callout"><span class="badge">Defender's goal</span> We study obfuscation only to <em>reverse</em> it — to recover the true code, write detection for the packer, and extract IOCs. We never build or distribute packed malware.</div>`,
    `<span class="eyebrow">IAM303 · Chương 6 · Bài 6.1</span>
<h2>Che giấu &amp; gỡ gói (unpacking)</h2>
<p class="lead">Kẻ viết mã độc giấu mã để đánh bại cả phân tích tĩnh lẫn chữ ký. Hiểu các mánh này — từ ghế người phòng thủ — giúp bạn nhìn xuyên qua chúng.</p>
<h3>Kỹ thuật che giấu thường gặp</h3>
<ul>
<li><strong>Packing / nén</strong> — mã thật bị nén hoặc mã hoá, và một <em>stub</em> nhỏ tự bung nó ra trong bộ nhớ lúc chạy.</li>
<li><strong>Mã hoá chuỗi</strong> — URL và khoá chỉ được giải mã khi dùng, nên <code>strings</code> không tìm thấy gì.</li>
<li><strong>Chống phân tích</strong> — kiểm tra có debugger, có máy ảo, hoặc bất thường thời gian, rồi cư xử vô hại nếu bị phát hiện.</li>
</ul>
<h3>Nhận diện mẫu đã đóng gói</h3>
<pre><code>Dấu hiệu của packing:
  - Entropy rất cao ở section mã (trông ngẫu nhiên / đã mã hoá)
  - Gần như không có import (chỉ LoadLibrary + GetProcAddress)
  - Tên section lạ (UPX0, UPX1, .themida, ...)
  - Điểm vào nằm trong section vừa ghi được vừa thực thi được</code></pre>
<h3>Gỡ gói — ý tưởng an toàn</h3>
<p>Stub buộc phải làm lộ mã thật trong bộ nhớ để chạy nó. Nên cách làm chung là: để stub làm việc trong lab cách ly, dừng ngay sau khi nó bung xong (tại "điểm vào gốc" — OEP), rồi <strong>dump phần mã giờ đã lộ ra từ bộ nhớ</strong> và phân tích phần đó. Packer đã biết (vd UPX) thường có tuỳ chọn gỡ trực tiếp.</p>
<div class="callout"><span class="badge">Mục tiêu người phòng thủ</span> Ta học che giấu chỉ để <em>đảo ngược</em> nó — khôi phục mã thật, viết chữ ký phát hiện packer, và rút IOC. Ta KHÔNG tạo hay phát tán mã độc đã đóng gói.</div>`,
  ]]);

const c6q = quiz('iam303-quiz-6', 'Quiz 6 — Obfuscation & unpacking|||Quiz 6 — Che giấu & gỡ gói', [
  { id: 'q1', question: '"Packing" trong mã độc nghĩa là gì?', options: ['Đóng gói cài đặt hợp lệ', 'Mã thật bị nén/mã hoá và một stub nhỏ tự bung nó trong bộ nhớ lúc chạy', 'Tăng tốc chương trình', 'Xoá bảng import vĩnh viễn'], correctIndex: 1, explanation: 'Packer nén/mã hoá mã thật; một stub bung nó ra trong bộ nhớ khi chạy để đánh bại phân tích tĩnh và chữ ký.' },
  { id: 'q2', question: 'Dấu hiệu nào gợi ý một mẫu đã bị đóng gói?', options: ['Nhiều import và nhiều chuỗi rõ ràng', 'Entropy cao ở section mã, rất ít import, tên section lạ', 'File rất nhỏ', 'Không có header PE'], correctIndex: 1, explanation: 'Entropy cao (trông ngẫu nhiên), gần như không import, và tên section lạ (UPX...) là các dấu hiệu điển hình của packing.' },
  { id: 'q3', question: 'Ý tưởng an toàn để gỡ gói (unpack) một mẫu là?', options: ['Chạy mẫu trên máy thật rồi chờ', 'Trong lab cách ly, để stub bung mã tới OEP rồi dump mã đã lộ từ bộ nhớ', 'Xoá section .text', 'Đổi tên file thành .txt'], correctIndex: 1, explanation: 'Trong môi trường cách ly, cho stub bung tới điểm vào gốc (OEP) rồi dump mã đã hiện ra trong bộ nhớ để phân tích — không chạy trên máy thật.' },
]);

const c7 = doc('iam303-7-1-advanced-behavior', '7.1 — Advanced behavior: C2, persistence & injection (defensive view)|||7.1 — Hành vi nâng cao: C2, bám trụ & tiêm mã (góc phòng thủ)',
  'Từ góc phòng thủ: máy chủ điều khiển (C2) & beacon; cơ chế bám trụ (Run key, service, scheduled task); tiêm mã vào tiến trình khác để ẩn — nhận diện API liên quan và ánh xạ sang MITRE ATT&CK để phát hiện, KHÔNG phải để tái tạo.',
  [[
    `<span class="eyebrow">IAM303 · Chapter 7 · Lesson 7.1</span>
<h2>Advanced behavior — the defender's view</h2>
<p class="lead">Serious malware maintains contact, survives reboots, and hides. We study these behaviors to <strong>detect and disrupt</strong> them — mapping each to MITRE ATT&amp;CK so a SOC can hunt for it. This is recognition, not a recipe.</p>
<h3>Command &amp; control (C2)</h3>
<p>Infected hosts <strong>beacon</strong> to an attacker's server for instructions and to exfiltrate data — often over HTTP/HTTPS or DNS to blend in. Defenders spot the <em>pattern</em>: regular intervals, odd user-agents, suspicious domains. (ATT&amp;CK: Command and Control.)</p>
<h3>Persistence</h3>
<pre><code>Common persistence footholds to CHECK during IR:
  Registry Run key    HKCU/HKLM\\...\\CurrentVersion\\Run
  Scheduled task      schtasks entries running an odd binary
  Windows service     an auto-start service pointing at a dropped file
  Startup folder      shortcuts placed in Startup</code></pre>
<p>(ATT&amp;CK: Persistence.) Knowing these locations tells a responder exactly where to look to confirm and remove a foothold.</p>
<h3>Process injection</h3>
<p>To hide, malware may run its code <em>inside</em> a legitimate process. Analysts recognize the classic API sequence <code>OpenProcess</code> → <code>VirtualAllocEx</code> → <code>WriteProcessMemory</code> → <code>CreateRemoteThread</code> as a strong injection indicator. (ATT&amp;CK: Defense Evasion / Process Injection.)</p>
<div class="callout"><span class="badge">Recognize to defend</span> The value of these techniques to us is entirely detection: EDR rules, hunting queries, and cleanup steps. We describe the fingerprints so defenders can find them — we never provide working offensive code.</div>`,
    `<span class="eyebrow">IAM303 · Chương 7 · Bài 7.1</span>
<h2>Hành vi nâng cao — góc nhìn người phòng thủ</h2>
<p class="lead">Mã độc nghiêm túc thường giữ liên lạc, sống sót qua khởi động lại, và ẩn mình. Ta học các hành vi này để <strong>phát hiện và phá vỡ</strong> chúng — ánh xạ mỗi thứ sang MITRE ATT&amp;CK để SOC săn lùng được. Đây là nhận diện, không phải công thức.</p>
<h3>Máy chủ điều khiển (C2)</h3>
<p>Máy nhiễm phát <strong>beacon</strong> tới máy chủ của kẻ tấn công để nhận lệnh và tuồn dữ liệu ra — thường qua HTTP/HTTPS hoặc DNS để trà trộn. Người phòng thủ nhận ra <em>khuôn mẫu</em>: nhịp đều đặn, user-agent lạ, tên miền đáng ngờ. (ATT&amp;CK: Command and Control.)</p>
<h3>Bám trụ (persistence)</h3>
<pre><code>Điểm bám trụ thường gặp cần KIỂM khi ứng cứu sự cố:
  Khoá Run registry   HKCU/HKLM\\...\\CurrentVersion\\Run
  Tác vụ định lịch    mục schtasks chạy một binary lạ
  Dịch vụ Windows     dịch vụ tự khởi động trỏ vào file được thả
  Thư mục Startup     shortcut đặt trong Startup</code></pre>
<p>(ATT&amp;CK: Persistence.) Biết các vị trí này giúp người ứng cứu biết chính xác chỗ cần soi để xác nhận và gỡ bỏ điểm bám trụ.</p>
<h3>Tiêm mã (process injection)</h3>
<p>Để ẩn, mã độc có thể chạy mã của mình <em>bên trong</em> một tiến trình hợp lệ. Người phân tích nhận ra chuỗi API kinh điển <code>OpenProcess</code> → <code>VirtualAllocEx</code> → <code>WriteProcessMemory</code> → <code>CreateRemoteThread</code> là chỉ dấu tiêm mã mạnh. (ATT&amp;CK: Defense Evasion / Process Injection.)</p>
<div class="callout"><span class="badge">Nhận diện để phòng thủ</span> Giá trị của các kỹ thuật này với ta hoàn toàn là để phát hiện: luật EDR, truy vấn săn lùng, và bước dọn dẹp. Ta mô tả "vân tay" để người phòng thủ tìm ra — KHÔNG cung cấp mã tấn công chạy được.</div>`,
  ]]);

const c7q = quiz('iam303-quiz-7', 'Quiz 7 — Advanced behavior|||Quiz 7 — Hành vi nâng cao', [
  { id: 'q1', question: 'Trong mã độc, "C2" (command and control) là gì?', options: ['Một loại thanh ghi CPU', 'Kênh liên lạc tới máy chủ của kẻ tấn công để nhận lệnh và tuồn dữ liệu', 'Một thuật toán nén', 'Tên một section PE'], correctIndex: 1, explanation: 'C2 là kênh mà máy nhiễm dùng để nhận lệnh và tuồn dữ liệu; người phòng thủ nhận ra nó qua khuôn mẫu beacon và tên miền đáng ngờ.' },
  { id: 'q2', question: 'Khoá registry "...\\CurrentVersion\\Run" thường liên quan tới kỹ thuật nào?', options: ['Tiêm mã', 'Bám trụ (persistence) — tự chạy lại sau khởi động', 'Mã hoá dữ liệu', 'Quét cổng'], correctIndex: 1, explanation: 'Khoá Run khiến chương trình tự chạy khi đăng nhập/khởi động — một cơ chế bám trụ phổ biến (MITRE ATT&CK: Persistence).' },
  { id: 'q3', question: 'Chuỗi API OpenProcess → VirtualAllocEx → WriteProcessMemory → CreateRemoteThread là chỉ dấu của?', options: ['Chỉnh lưu tín hiệu', 'Tiêm mã vào tiến trình khác (process injection)', 'Nén file', 'Tạo snapshot máy ảo'], correctIndex: 1, explanation: 'Đây là chuỗi API kinh điển của process injection — cấp phát và ghi mã vào tiến trình khác rồi tạo luồng chạy nó (ATT&CK: Process Injection).' },
]);

const c8 = doc('iam303-8-1-reporting-yara', '8.1 — Reporting, YARA rules, IOCs & threat intelligence|||8.1 — Viết báo cáo, YARA rule, IOC & tình báo mối đe doạ',
  'Biến phân tích thành sản phẩm phòng thủ: cấu trúc báo cáo (tóm tắt, khả năng, IOC, khuyến nghị); chỉ dấu tấn công (IOC) — hash, domain, IP, khoá registry; viết YARA rule để phát hiện; chia sẻ tình báo (ATT&CK, STIX) theo chuẩn.',
  [[
    `<span class="eyebrow">IAM303 · Chapter 8 · Lesson 8.1</span>
<h2>Reporting, YARA rules &amp; IOCs</h2>
<p class="lead">Analysis has no value until it becomes something others can act on: a clear report, detection rules, and shareable indicators. This is where the defensive loop closes.</p>
<h3>The analyst report</h3>
<ul>
<li><strong>Executive summary</strong> — what it is and why it matters, in plain language.</li>
<li><strong>Capabilities</strong> — what the sample does (persistence, C2, theft).</li>
<li><strong>Indicators of Compromise (IOCs)</strong> — hashes, domains, IPs, file paths, registry keys.</li>
<li><strong>Detection &amp; remediation</strong> — how to find it and how to remove it.</li>
</ul>
<h3>YARA — pattern-based detection</h3>
<p><strong>YARA</strong> rules describe a family by textual or byte patterns, so scanners can flag related samples.</p>
<pre><code>rule Example_Downloader
{
  meta:
    author = "analyst"
    description = "Detects strings seen in the sample family"
  strings:
    $s1 = "update-server.example"
    $s2 = "/gate.php"
    $mz = { 4D 5A }          // MZ header
  condition:
    $mz at 0 and all of ($s1, $s2)
}</code></pre>
<h3>IOCs &amp; threat intelligence</h3>
<p>Package indicators in a shareable form and map behavior to <strong>MITRE ATT&amp;CK</strong> techniques; standards like <strong>STIX</strong> let teams exchange intelligence so one analysis protects many organizations.</p>
<div class="callout"><span class="badge">Close the loop</span> A good report + a solid YARA rule + clean IOCs turns one painful incident into detection for everyone. That is the entire point of defensive malware analysis.</div>`,
    `<span class="eyebrow">IAM303 · Chương 8 · Bài 8.1</span>
<h2>Viết báo cáo, YARA rule &amp; IOC</h2>
<p class="lead">Phân tích không có giá trị cho tới khi trở thành thứ người khác hành động được: một báo cáo rõ ràng, luật phát hiện, và chỉ dấu chia sẻ được. Đây là chỗ vòng lặp phòng thủ khép lại.</p>
<h3>Báo cáo phân tích</h3>
<ul>
<li><strong>Tóm tắt điều hành</strong> — nó là gì và vì sao quan trọng, bằng ngôn ngữ dễ hiểu.</li>
<li><strong>Khả năng</strong> — mẫu làm gì (bám trụ, C2, đánh cắp).</li>
<li><strong>Chỉ dấu tấn công (IOC)</strong> — hash, domain, IP, đường dẫn file, khoá registry.</li>
<li><strong>Phát hiện &amp; khắc phục</strong> — cách tìm ra và cách gỡ bỏ.</li>
</ul>
<h3>YARA — phát hiện theo khuôn mẫu</h3>
<p>Luật <strong>YARA</strong> mô tả một họ mã độc bằng khuôn mẫu văn bản hoặc byte, để trình quét gắn cờ những mẫu cùng họ.</p>
<pre><code>rule Example_Downloader
{
  meta:
    author = "analyst"
    description = "Phat hien chuoi thay trong ho mau nay"
  strings:
    $s1 = "update-server.example"
    $s2 = "/gate.php"
    $mz = { 4D 5A }          // header MZ
  condition:
    $mz at 0 and all of ($s1, $s2)
}</code></pre>
<h3>IOC &amp; tình báo mối đe doạ</h3>
<p>Đóng gói chỉ dấu ở dạng chia sẻ được và ánh xạ hành vi sang kỹ thuật <strong>MITRE ATT&amp;CK</strong>; các chuẩn như <strong>STIX</strong> cho phép các đội trao đổi tình báo, để một phân tích bảo vệ được nhiều tổ chức.</p>
<div class="callout"><span class="badge">Khép vòng lặp</span> Một báo cáo tốt + một YARA rule chắc + IOC sạch biến một sự cố đau đớn thành khả năng phát hiện cho tất cả. Đó chính là toàn bộ ý nghĩa của phân tích mã độc phòng thủ.</div>`,
  ]]);

const c8q = quiz('iam303-quiz-8', 'Quiz 8 — Reporting & YARA|||Quiz 8 — Báo cáo & YARA', [
  { id: 'q1', question: 'IOC (Indicator of Compromise) là gì?', options: ['Một loại thanh ghi CPU', 'Chỉ dấu như hash, domain, IP, khoá registry giúp phát hiện dấu vết tấn công', 'Một trình dịch ngược', 'Một loại packer'], correctIndex: 1, explanation: 'IOC là các chỉ dấu (hash, domain, IP, đường dẫn, khoá registry) dùng để phát hiện sự hiện diện của mã độc trong hệ thống.' },
  { id: 'q2', question: 'Luật YARA dùng để làm gì?', options: ['Mã hoá ổ đĩa', 'Mô tả khuôn mẫu (chuỗi/byte) để trình quét phát hiện mẫu cùng họ', 'Tăng tốc CPU', 'Tạo máy ảo'], correctIndex: 1, explanation: 'YARA mô tả họ mã độc bằng khuôn mẫu văn bản/byte và điều kiện, giúp trình quét gắn cờ các mẫu liên quan.' },
  { id: 'q3', question: 'Vì sao ánh xạ hành vi sang MITRE ATT&CK và dùng chuẩn như STIX lại hữu ích?', options: ['Để mã độc chạy nhanh hơn', 'Để chia sẻ tình báo theo ngôn ngữ chung, giúp một phân tích bảo vệ nhiều tổ chức', 'Để ẩn báo cáo', 'Để xoá IOC'], correctIndex: 1, explanation: 'ATT&CK cho từ vựng chung về kỹ thuật; STIX cho định dạng trao đổi — nhờ đó tình báo được chia sẻ và một phân tích giúp phòng thủ cho nhiều bên.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'IAM303',
    slug: 'iam303-malware-analysis-and-reverse-engineering',
    title: 'Malware Analysis and Reverse Engineering',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/IAM303.webp',
    shortDescription: 'Defensive malware analysis & reverse engineering in an isolated lab: static & dynamic analysis, x86 assembly, IDA/Ghidra, unpacking, YARA & IOC reporting. Bilingual, with quizzes.|||Phân tích mã độc & dịch ngược phòng thủ trong lab cách ly: phân tích tĩnh & động, x86 assembly, IDA/Ghidra, unpacking, YARA & báo cáo IOC. Song ngữ, có quiz.',
    description: 'Môn <strong>IAM303 — Malware Analysis and Reverse Engineering</strong> (ngành Khoa học Máy tính, định hướng An toàn thông tin, kỳ 4) dạy <strong>phân tích mã độc theo hướng phòng thủ</strong> trong <strong>lab cách ly</strong>. Từ <strong>phân loại &amp; dựng lab an toàn</strong> → <strong>phân tích tĩnh</strong> (hash, strings, PE, import) → <strong>x86 assembly</strong> → <strong>phân tích động</strong> (sandbox, giám sát tiến trình/registry/mạng) → <strong>dịch ngược</strong> (IDA/Ghidra) → <strong>che giấu &amp; gỡ gói</strong> → <strong>hành vi nâng cao</strong> (C2, bám trụ, tiêm mã — góc phòng thủ) → <strong>báo cáo, YARA &amp; IOC</strong>. Bám các giáo trình chuẩn (Sikorski/Honig, Ligh et al, Eagle, SANS FOR610), song ngữ, quiz mỗi chương. ⚠️ Chỉ dạy phương pháp phân tích để phòng thủ; KHÔNG cung cấp mã độc thực thi.',
    whatYouLearn: 'Dựng lab cách ly an toàn (máy ảo, snapshot, mạng host-only); phân loại mã độc; phân tích tĩnh (hash, strings, PE header/section/entropy, IAT); nền tảng x86 assembly (thanh ghi, stack, prologue/epilogue); phân tích động trong sandbox (Process Monitor/Explorer, Wireshark, FakeNet); dịch ngược với IDA/Ghidra; nhận diện &amp; gỡ packing/obfuscation; nhận diện C2, bám trụ, tiêm mã và ánh xạ MITRE ATT&amp;CK; viết YARA rule, rút IOC và báo cáo phân tích.',
    requirements: 'Kiến thức lập trình cơ bản (C và khái niệm bộ nhớ), hệ điều hành/Windows nội bộ cơ bản, và mạng máy tính cơ bản. Cần máy ảo (VirtualBox/VMware) để dựng lab cách ly. Cam kết chỉ thực hành trong môi trường cách ly, mục đích phòng thủ &amp; học tập.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình FLM, sách chuẩn, FOR610, công cụ phòng thủ, lộ trình an toàn.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vì sao phòng thủ cần phân tích mã độc; bốn tầng phân tích; nguyên tắc lab cách ly.', lessons: [intro] },
    { title: 'Chương 1 — Phân loại & lab an toàn|||Chapter 1 — Types & safe lab', description: 'Phân loại mã độc, dựng máy ảo cách ly, snapshot, quy tắc an toàn.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Phân tích tĩnh|||Chapter 2 — Static analysis', description: 'Hash, strings, PE header/section, bảng import (IAT).', lessons: [c2, c2q] },
    { title: 'Chương 3 — x86 assembly|||Chapter 3 — x86 assembly', description: 'Thanh ghi, stack, lệnh cơ bản, khung hàm, vòng lặp/rẽ nhánh.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Phân tích động|||Chapter 4 — Dynamic analysis', description: 'Sandbox, giám sát tiến trình/registry/mạng, giả lập Internet.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Dịch ngược IDA/Ghidra|||Chapter 5 — Disassembly', description: 'Disassembler vs decompiler, đồ thị luồng, xref, quy trình đọc mã.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Che giấu & gỡ gói|||Chapter 6 — Obfuscation & unpacking', description: 'Packing, mã hoá chuỗi, chống phân tích; nhận diện & unpack an toàn.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Hành vi nâng cao|||Chapter 7 — Advanced behavior', description: 'C2, bám trụ, tiêm mã — góc phòng thủ, ánh xạ MITRE ATT&CK.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Báo cáo, YARA & IOC|||Chapter 8 — Reporting, YARA & IOC', description: 'Cấu trúc báo cáo, viết YARA rule, rút IOC, chia sẻ tình báo.', lessons: [c8, c8q] },
  ],
};
