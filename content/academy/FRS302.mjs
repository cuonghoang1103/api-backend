/**
 * FRS302 — Network Forensics (Điều tra số trên mạng). Khoa học Máy tính,
 * định hướng An toàn thông tin, kỳ 5. Giáo trình: Davidoff/Ham "Network
 * Forensics", Casey "Digital Evidence and Computer Crime", NIST SP 800-86,
 * SANS FOR572. Định hướng PHÒNG THỦ / điều tra hợp pháp — KHÔNG dạy tấn công.
 * Song ngữ + ví dụ Wireshark/tcpdump/tshark/Zeek/Python + quiz.
 * ⚠️ KHÔNG backtick lồng/${; "<"→&lt; ">"→&gt; "&"→&amp; trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('frs302-0-0-tai-lieu', '📚 Course materials &amp; references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình chuẩn (Davidoff/Ham, Casey), chuẩn NIST SP 800-86, SANS FOR572, công cụ (Wireshark/Zeek), lộ trình tự học.',
  [[
    `<span class="eyebrow">FRS302 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Network Forensics</strong> — capturing evidence, analysing packets and flows, and reporting findings — in one place. This course is strictly <strong>defensive and legal</strong>: we investigate incidents, we do not attack. Official FPTU slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbooks &amp; standards</h3>
<ul>
<li><a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — official FPTU giáo trình &amp; slides (sign in with your FPTU account)</li>
<li><em>Network Forensics: Tracking Hackers through Cyberspace</em> — Davidoff &amp; Ham (Prentice Hall)</li>
<li><em>Digital Evidence and Computer Crime</em> — Eoghan Casey (Academic Press)</li>
<li><a href="https://csrc.nist.gov/pubs/sp/800/86/final" target="_blank" rel="noopener">NIST SP 800-86</a> — Guide to Integrating Forensic Techniques into Incident Response</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.wireshark.org/docs/" target="_blank" rel="noopener">Wireshark documentation &amp; User's Guide</a></li>
<li><a href="https://docs.zeek.org/" target="_blank" rel="noopener">Zeek (Bro) documentation</a></li>
<li><a href="https://www.tcpdump.org/manpages/tcpdump.1.html" target="_blank" rel="noopener">tcpdump manual page</a></li>
<li><a href="https://www.sans.org/cyber-security-courses/advanced-network-forensics-threat-hunting-incident-response/" target="_blank" rel="noopener">SANS FOR572</a> — Advanced Network Forensics (course outline)</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@Chrissanders88" target="_blank" rel="noopener">Chris Sanders</a> — packet analysis &amp; intrusion detection</li>
<li><a href="https://www.youtube.com/@davidbombal" target="_blank" rel="noopener">David Bombal</a> — networking &amp; security tooling</li>
</ul>
<h3>🛠️ Tools (practice on YOUR OWN captures / lab pcaps)</h3>
<ul>
<li><a href="https://www.wireshark.org/" target="_blank" rel="noopener">Wireshark / tshark</a> — packet capture &amp; analysis</li>
<li><a href="https://zeek.org/" target="_blank" rel="noopener">Zeek</a> — network-security monitor that turns traffic into logs</li>
<li><a href="https://www.malware-traffic-analysis.net/" target="_blank" rel="noopener">Malware-Traffic-Analysis.net</a> — free lab pcaps &amp; exercises</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundations</strong> — the forensic process, chain of custody, and evidence integrity (NIST SP 800-86).</li>
<li><strong>Acquisition</strong> — how to capture traffic correctly (tap vs SPAN) without altering it.</li>
<li><strong>Analysis</strong> — packets (Wireshark/tcpdump) then flows (NetFlow/Zeek), then protocols (HTTP/DNS/email).</li>
<li><strong>Investigation &amp; reporting</strong> — spot C2 &amp; exfiltration, read firewall/IDS logs, and write a defensible report.</li>
</ol></div>`,
    `<span class="eyebrow">FRS302 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Điều tra số trên mạng</strong> — thu thập chứng cứ, phân tích gói &amp; luồng, viết báo cáo — gom về một chỗ. Môn này thuần <strong>phòng thủ và hợp pháp</strong>: ta điều tra sự cố, không tấn công. Slide &amp; đề cương FPTU chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Sách giáo trình &amp; chuẩn</h3>
<ul>
<li><a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — giáo trình &amp; slide FPTU chính thức (đăng nhập bằng tài khoản FPTU)</li>
<li><em>Network Forensics: Tracking Hackers through Cyberspace</em> — Davidoff &amp; Ham (Prentice Hall)</li>
<li><em>Digital Evidence and Computer Crime</em> — Eoghan Casey (Academic Press)</li>
<li><a href="https://csrc.nist.gov/pubs/sp/800/86/final" target="_blank" rel="noopener">NIST SP 800-86</a> — Hướng dẫn tích hợp kỹ thuật điều tra số vào ứng phó sự cố</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.wireshark.org/docs/" target="_blank" rel="noopener">Tài liệu &amp; User's Guide của Wireshark</a></li>
<li><a href="https://docs.zeek.org/" target="_blank" rel="noopener">Tài liệu Zeek (Bro)</a></li>
<li><a href="https://www.tcpdump.org/manpages/tcpdump.1.html" target="_blank" rel="noopener">Trang man của tcpdump</a></li>
<li><a href="https://www.sans.org/cyber-security-courses/advanced-network-forensics-threat-hunting-incident-response/" target="_blank" rel="noopener">SANS FOR572</a> — Điều tra mạng nâng cao (đề cương)</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@Chrissanders88" target="_blank" rel="noopener">Chris Sanders</a> — phân tích gói &amp; phát hiện xâm nhập</li>
<li><a href="https://www.youtube.com/@davidbombal" target="_blank" rel="noopener">David Bombal</a> — mạng &amp; công cụ bảo mật</li>
</ul>
<h3>🛠️ Công cụ (luyện trên capture CỦA BẠN / pcap lab)</h3>
<ul>
<li><a href="https://www.wireshark.org/" target="_blank" rel="noopener">Wireshark / tshark</a> — bắt &amp; phân tích gói tin</li>
<li><a href="https://zeek.org/" target="_blank" rel="noopener">Zeek</a> — bộ giám sát an ninh mạng, biến lưu lượng thành log</li>
<li><a href="https://www.malware-traffic-analysis.net/" target="_blank" rel="noopener">Malware-Traffic-Analysis.net</a> — pcap &amp; bài tập lab miễn phí</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — quy trình điều tra, chuỗi hành trình chứng cứ, toàn vẹn chứng cứ (NIST SP 800-86).</li>
<li><strong>Thu thập</strong> — bắt lưu lượng đúng cách (tap vs SPAN) mà không làm thay đổi nó.</li>
<li><strong>Phân tích</strong> — gói (Wireshark/tcpdump) → luồng (NetFlow/Zeek) → giao thức (HTTP/DNS/email).</li>
<li><strong>Điều tra &amp; báo cáo</strong> — phát hiện C2 &amp; rò rỉ dữ liệu, đọc log firewall/IDS, viết báo cáo có giá trị pháp lý.</li>
</ol></div>`,
  ]]);

const intro = doc('frs302-0-1-overview', 'Course overview: Network Forensics|||Tổng quan: Điều tra số trên mạng',
  'Điều tra số trên mạng là gì; mục tiêu phòng thủ/hợp pháp; đối tượng chứng cứ (gói, luồng, log); lộ trình 8 chương từ nguyên lý → thu thập → phân tích → báo cáo.',
  [[
    `<span class="eyebrow">FRS302 · Lesson 0.1 · Overview</span>
<h2>Network Forensics</h2>
<p class="lead"><strong>Network forensics</strong> is the capture, recording and analysis of network traffic to <strong>investigate a security incident</strong> — to answer who, what, when, where and how. Unlike disk forensics, much network evidence is <em>volatile</em>: if you do not capture it, it is gone. This course is strictly <strong>defensive and lawful</strong> — reconstructing what an attacker did, never attacking.</p>
<h3>What counts as evidence?</h3>
<ul>
<li><strong>Full packets</strong> — the complete traffic (a pcap file); the richest but heaviest source.</li>
<li><strong>Flow records</strong> — summaries of who talked to whom (NetFlow / Zeek conn logs); light and long-lived.</li>
<li><strong>Logs</strong> — firewall, IDS/IPS, DNS, proxy and server logs.</li>
</ul>
<h3>The golden rule</h3>
<p>Evidence must be <strong>authentic, complete and unaltered</strong>, and every hand that touches it must be recorded (<strong>chain of custody</strong>). A finding you cannot defend in court — or in an internal disciplinary hearing — is worthless.</p>
<h3>Roadmap</h3>
<p>Principles &amp; chain of custody → acquisition (tap/SPAN) → packet analysis (Wireshark/tcpdump) → flow analysis (NetFlow/Zeek) → protocol investigation (HTTP/DNS/email) → attack investigation (C2, exfiltration) → firewall/IDS logs &amp; network devices → reporting, legal aspects &amp; presenting evidence. Bilingual, with tool examples and quizzes.</p>`,
    `<span class="eyebrow">FRS302 · Bài 0.1 · Tổng quan</span>
<h2>Điều tra số trên mạng</h2>
<p class="lead"><strong>Điều tra số trên mạng (network forensics)</strong> là việc bắt, ghi và phân tích lưu lượng mạng để <strong>điều tra một sự cố an ninh</strong> — trả lời ai, cái gì, khi nào, ở đâu và bằng cách nào. Khác điều tra ổ đĩa, phần lớn chứng cứ mạng có tính <em>bay hơi</em>: không bắt kịp thì mất. Môn này thuần <strong>phòng thủ và hợp pháp</strong> — dựng lại việc kẻ tấn công đã làm, không tấn công.</p>
<h3>Cái gì được coi là chứng cứ?</h3>
<ul>
<li><strong>Gói đầy đủ</strong> — toàn bộ lưu lượng (file pcap); nguồn giàu nhất nhưng nặng nhất.</li>
<li><strong>Bản ghi luồng</strong> — tóm tắt ai nói với ai (NetFlow / conn log của Zeek); nhẹ và giữ được lâu.</li>
<li><strong>Log</strong> — firewall, IDS/IPS, DNS, proxy và log máy chủ.</li>
</ul>
<h3>Nguyên tắc vàng</h3>
<p>Chứng cứ phải <strong>xác thực, đầy đủ và không bị sửa đổi</strong>, và mọi bàn tay chạm vào nó đều phải được ghi lại (<strong>chuỗi hành trình chứng cứ — chain of custody</strong>). Một kết luận không thể bảo vệ trước toà — hay trong một buổi kỷ luật nội bộ — thì vô giá trị.</p>
<h3>Lộ trình</h3>
<p>Nguyên lý &amp; chuỗi hành trình → thu thập (tap/SPAN) → phân tích gói (Wireshark/tcpdump) → phân tích luồng (NetFlow/Zeek) → điều tra giao thức (HTTP/DNS/email) → điều tra tấn công (C2, rò rỉ) → log firewall/IDS &amp; thiết bị mạng → báo cáo, khía cạnh pháp lý &amp; trình bày chứng cứ. Song ngữ, có ví dụ công cụ và quiz.</p>`,
  ]]);

const c1 = doc('frs302-1-1-principles-coc', '1.1 — Forensic principles &amp; chain of custody|||1.1 — Nguyên lý điều tra số &amp; chuỗi hành trình chứng cứ',
  'Quy trình điều tra 4 bước (thu thập → giám định → phân tích → báo cáo, NIST SP 800-86); toàn vẹn chứng cứ bằng hàm băm; chuỗi hành trình; nguyên tắc trao đổi Locard.',
  [[
    `<span class="eyebrow">FRS302 · Chapter 1 · Lesson 1.1</span>
<h2>Forensic principles &amp; chain of custody</h2>
<h3>The forensic process (NIST SP 800-86)</h3>
<ul>
<li><strong>Collection</strong> — identify and acquire the data with minimal disturbance.</li>
<li><strong>Examination</strong> — extract the relevant data from what was collected.</li>
<li><strong>Analysis</strong> — draw conclusions from the examined data.</li>
<li><strong>Reporting</strong> — present the results clearly and defensibly.</li>
</ul>
<h3>Integrity by hashing</h3>
<p>Prove evidence has not changed by hashing it the moment you acquire it and re-checking later. A matching hash means the bytes are identical.</p>
<pre><code>sha256sum evidence.pcap    &gt; evidence.pcap.sha256
sha256sum -c evidence.pcap.sha256
# evidence.pcap: OK  -> integrity preserved
</code></pre>
<h3>Chain of custody</h3>
<p>A <strong>chain of custody</strong> records every person who handled the evidence, when, and why — from acquisition to court. A single unexplained gap can make the evidence inadmissible.</p>
<h3>Locard's exchange principle</h3>
<p>Adapted to networks: <em>every interaction leaves a trace</em> — a connection, a log line, a DNS lookup. The investigator's job is to find and correlate those traces.</p>
<div class="callout"><span class="badge">Order of volatility</span> Capture the most fleeting evidence first (live connections, memory, ARP tables) before the durable (disk, archived logs) — RFC 3227.</div>`,
    `<span class="eyebrow">FRS302 · Chương 1 · Bài 1.1</span>
<h2>Nguyên lý điều tra số &amp; chuỗi hành trình chứng cứ</h2>
<h3>Quy trình điều tra (NIST SP 800-86)</h3>
<ul>
<li><strong>Thu thập (collection)</strong> — nhận diện và lấy dữ liệu với ít xáo trộn nhất.</li>
<li><strong>Giám định (examination)</strong> — rút dữ liệu liên quan ra khỏi cái đã thu.</li>
<li><strong>Phân tích (analysis)</strong> — rút ra kết luận từ dữ liệu đã giám định.</li>
<li><strong>Báo cáo (reporting)</strong> — trình bày kết quả rõ ràng, có thể bảo vệ.</li>
</ul>
<h3>Toàn vẹn bằng hàm băm</h3>
<p>Chứng minh chứng cứ không đổi bằng cách băm nó ngay khi thu và kiểm lại sau. Băm khớp nghĩa là từng byte y hệt.</p>
<pre><code>sha256sum evidence.pcap    &gt; evidence.pcap.sha256
sha256sum -c evidence.pcap.sha256
# evidence.pcap: OK  -> toàn vẹn được giữ
</code></pre>
<h3>Chuỗi hành trình chứng cứ</h3>
<p><strong>Chuỗi hành trình (chain of custody)</strong> ghi lại từng người đã chạm vào chứng cứ, khi nào và vì sao — từ lúc thu đến khi ra toà. Một khoảng trống không giải thích được có thể khiến chứng cứ bị bác.</p>
<h3>Nguyên tắc trao đổi Locard</h3>
<p>Áp vào mạng: <em>mọi tương tác đều để lại dấu vết</em> — một kết nối, một dòng log, một truy vấn DNS. Việc của điều tra viên là tìm và đối chiếu các dấu vết đó.</p>
<div class="callout"><span class="badge">Thứ tự bay hơi</span> Bắt chứng cứ dễ mất trước (kết nối đang sống, bộ nhớ, bảng ARP) rồi mới tới cái bền (đĩa, log lưu trữ) — RFC 3227.</div>`,
  ]]);

const c1q = quiz('frs302-quiz-1', 'Quiz 1 — Principles &amp; chain of custody|||Quiz 1 — Nguyên lý &amp; chuỗi hành trình', [
  { id: 'q1', question: 'Thứ tự đúng của quy trình điều tra số theo NIST SP 800-86?', options: ['Phân tích → thu thập → báo cáo → giám định', 'Thu thập → giám định → phân tích → báo cáo', 'Báo cáo → phân tích → thu thập → giám định', 'Giám định → báo cáo → thu thập → phân tích'], correctIndex: 1, explanation: 'NIST SP 800-86: Collection → Examination → Analysis → Reporting.' },
  { id: 'q2', question: 'Vì sao ta băm (sha256) file pcap ngay khi thu thập?', options: ['Để nén file nhỏ lại', 'Để mã hoá chứng cứ', 'Để sau này chứng minh chứng cứ KHÔNG bị sửa đổi', 'Để tăng tốc phân tích'], correctIndex: 2, explanation: 'Băm khớp giữa hai thời điểm chứng minh từng byte y hệt → toàn vẹn.' },
  { id: 'q3', question: '"Chuỗi hành trình chứng cứ" (chain of custody) ghi lại điều gì?', options: ['Cấu hình của switch', 'Mọi người đã chạm vào chứng cứ, khi nào và vì sao', 'Danh sách địa chỉ IP nội bộ', 'Tốc độ đường truyền'], correctIndex: 1, explanation: 'Một khoảng trống không giải thích được có thể khiến chứng cứ bị bác.' },
]);

const c2 = doc('frs302-2-1-acquisition', '2.1 — Acquiring &amp; preserving network data|||2.1 — Thu thập &amp; bảo toàn dữ liệu mạng',
  'Điểm bắt lưu lượng: TAP thụ động vs cổng SPAN/mirror; bắt bằng tcpdump; capture filter (BPF) vs display filter; xoay vòng file; bảo toàn & write-once.',
  [[
    `<span class="eyebrow">FRS302 · Chapter 2 · Lesson 2.1</span>
<h2>Acquiring &amp; preserving network data</h2>
<h3>Where do you tap in?</h3>
<ul>
<li><strong>Network TAP</strong> — a passive hardware device that copies traffic. It cannot drop or alter packets, so it is the forensically soundest choice.</li>
<li><strong>SPAN / mirror port</strong> — a switch feature that copies traffic to a monitor port. Convenient, but under load the switch may <em>drop</em> mirrored packets — note this in your report.</li>
</ul>
<h3>Capturing with tcpdump</h3>
<pre><code># Capture on eth0, do not resolve names (-n), write raw to disk
tcpdump -i eth0 -n -w case42.pcap

# Rotate files: 100 MB each, keep 50 (ring buffer)
tcpdump -i eth0 -n -w case42-%Y%m%d-%H%M%S.pcap -C 100 -W 50

# Capture filter (BPF): only host 10.0.0.5 on port 443
tcpdump -i eth0 -n host 10.0.0.5 and port 443 -w tls.pcap
</code></pre>
<h3>Capture filter vs display filter</h3>
<p>A <strong>capture filter</strong> (BPF) decides what is written to disk — you can never get back what you did not capture. A <strong>display filter</strong> only changes what you see in an existing file. When in doubt, <strong>capture broad, filter later</strong>.</p>
<div class="callout"><span class="badge">Preserve, then work</span> Treat the original pcap as read-only: hash it, store it write-once, and do all analysis on a copy.</div>`,
    `<span class="eyebrow">FRS302 · Chương 2 · Bài 2.1</span>
<h2>Thu thập &amp; bảo toàn dữ liệu mạng</h2>
<h3>Bắt lưu lượng ở đâu?</h3>
<ul>
<li><strong>TAP mạng</strong> — thiết bị phần cứng thụ động sao chép lưu lượng. Nó không thể làm rớt hay sửa gói, nên là lựa chọn vững nhất về mặt điều tra.</li>
<li><strong>Cổng SPAN / mirror</strong> — tính năng của switch, sao lưu lượng sang một cổng giám sát. Tiện, nhưng khi tải cao switch có thể <em>làm rớt</em> gói mirror — hãy ghi rõ điều này trong báo cáo.</li>
</ul>
<h3>Bắt gói bằng tcpdump</h3>
<pre><code># Bắt trên eth0, không phân giải tên (-n), ghi thô ra đĩa
tcpdump -i eth0 -n -w case42.pcap

# Xoay vòng file: mỗi file 100 MB, giữ 50 file (ring buffer)
tcpdump -i eth0 -n -w case42-%Y%m%d-%H%M%S.pcap -C 100 -W 50

# Capture filter (BPF): chỉ host 10.0.0.5 trên cổng 443
tcpdump -i eth0 -n host 10.0.0.5 and port 443 -w tls.pcap
</code></pre>
<h3>Capture filter vs display filter</h3>
<p><strong>Capture filter</strong> (BPF) quyết định cái gì được ghi ra đĩa — cái đã không bắt thì không lấy lại được. <strong>Display filter</strong> chỉ đổi cái bạn NHÌN thấy trong file có sẵn. Khi phân vân, <strong>bắt rộng, lọc sau</strong>.</p>
<div class="callout"><span class="badge">Bảo toàn rồi mới làm</span> Coi pcap gốc là chỉ-đọc: băm nó, lưu ghi-một-lần, và phân tích trên bản sao.</div>`,
  ]]);

const c2q = quiz('frs302-quiz-2', 'Quiz 2 — Acquisition|||Quiz 2 — Thu thập dữ liệu', [
  { id: 'q1', question: 'Vì sao TAP thụ động vững hơn cổng SPAN về mặt điều tra?', options: ['TAP nhanh hơn', 'TAP không thể làm rớt/sửa gói, còn SPAN có thể rớt gói khi tải cao', 'TAP rẻ hơn', 'SPAN không sao chép được lưu lượng'], correctIndex: 1, explanation: 'Switch có thể ưu tiên chuyển tiếp hơn mirror và làm rớt gói SPAN khi tải cao.' },
  { id: 'q2', question: 'Khác biệt cốt lõi giữa capture filter (BPF) và display filter?', options: ['Không có khác biệt', 'Capture filter quyết định cái GHI ra đĩa; display filter chỉ đổi cái NHÌN thấy', 'Display filter quyết định cái ghi ra đĩa', 'Cả hai chỉ dùng cho Wireshark'], correctIndex: 1, explanation: 'Cái đã không capture thì không lấy lại được → khi phân vân hãy bắt rộng, lọc sau.' },
  { id: 'q3', question: 'Thực hành đúng để bảo toàn pcap gốc là gì?', options: ['Chỉnh sửa trực tiếp file gốc cho gọn', 'Băm file gốc, lưu ghi-một-lần, phân tích trên bản sao', 'Xoá gói không liên quan trong file gốc', 'Nén rồi ghi đè lên file gốc'], correctIndex: 1, explanation: 'Coi bản gốc là chỉ-đọc; mọi thao tác làm trên bản sao để giữ toàn vẹn.' },
]);

const c3 = doc('frs302-3-1-packet-analysis', '3.1 — Packet analysis with Wireshark/tcpdump|||3.1 — Phân tích gói tin với Wireshark/tcpdump',
  'Các tầng gói (Ethernet/IP/TCP); display filter Wireshark; Follow TCP Stream; tshark dòng lệnh; bắt tay TCP 3 bước; đọc cờ SYN/ACK/RST.',
  [[
    `<span class="eyebrow">FRS302 · Chapter 3 · Lesson 3.1</span>
<h2>Packet analysis with Wireshark/tcpdump</h2>
<h3>A packet is layered</h3>
<p>Every packet wraps layers: <strong>Ethernet</strong> (MAC addresses) → <strong>IP</strong> (source/destination IP) → <strong>TCP/UDP</strong> (ports) → <strong>application</strong> (HTTP, DNS...). Reading a packet means peeling these layers.</p>
<h3>Display filters (Wireshark)</h3>
<pre><code>ip.addr == 10.0.0.5            # any traffic to/from this host
tcp.port == 443               # TLS traffic
http.request.method == "POST" # only HTTP POSTs
tcp.flags.syn == 1 and tcp.flags.ack == 0   # connection attempts
</code></pre>
<h3>tshark on the command line</h3>
<pre><code># List conversations, read a saved file, apply a display filter (-Y)
tshark -r case42.pcap -Y "dns" -T fields -e ip.src -e dns.qry.name

# Follow one TCP stream as text
tshark -r case42.pcap -q -z follow,tcp,ascii,3
</code></pre>
<h3>The TCP 3-way handshake</h3>
<pre><code>Client -&gt; Server : SYN         (I want to talk)
Server -&gt; Client : SYN, ACK    (OK, and I want to talk too)
Client -&gt; Server : ACK         (connection established)
</code></pre>
<p>A lone <strong>RST</strong> means "connection refused/reset"; a flood of SYNs with no ACK can indicate scanning — context decides.</p>
<div class="callout"><span class="badge">Follow the Stream</span> Wireshark's <strong>Follow TCP Stream</strong> reassembles a conversation from scattered packets into readable text — the single most useful button in the tool.</div>`,
    `<span class="eyebrow">FRS302 · Chương 3 · Bài 3.1</span>
<h2>Phân tích gói tin với Wireshark/tcpdump</h2>
<h3>Gói tin có nhiều tầng</h3>
<p>Mỗi gói bọc nhiều tầng: <strong>Ethernet</strong> (địa chỉ MAC) → <strong>IP</strong> (IP nguồn/đích) → <strong>TCP/UDP</strong> (cổng) → <strong>ứng dụng</strong> (HTTP, DNS...). Đọc gói là bóc dần các tầng này.</p>
<h3>Display filter (Wireshark)</h3>
<pre><code>ip.addr == 10.0.0.5            # mọi lưu lượng đến/từ host này
tcp.port == 443               # lưu lượng TLS
http.request.method == "POST" # chỉ HTTP POST
tcp.flags.syn == 1 and tcp.flags.ack == 0   # các lần xin mở kết nối
</code></pre>
<h3>tshark trên dòng lệnh</h3>
<pre><code># Đọc file đã lưu, áp display filter (-Y), in ra trường cần
tshark -r case42.pcap -Y "dns" -T fields -e ip.src -e dns.qry.name

# Theo một luồng TCP dưới dạng văn bản
tshark -r case42.pcap -q -z follow,tcp,ascii,3
</code></pre>
<h3>Bắt tay TCP 3 bước</h3>
<pre><code>Client -&gt; Server : SYN         (tôi muốn nói chuyện)
Server -&gt; Client : SYN, ACK    (được, và tôi cũng muốn nói)
Client -&gt; Server : ACK         (kết nối đã thiết lập)
</code></pre>
<p>Một gói <strong>RST</strong> đơn lẻ nghĩa là "từ chối/đặt lại kết nối"; một loạt SYN mà không có ACK có thể là dấu hiệu quét — ngữ cảnh quyết định.</p>
<div class="callout"><span class="badge">Follow the Stream</span> Nút <strong>Follow TCP Stream</strong> của Wireshark ghép một cuộc trao đổi từ các gói rời rạc thành văn bản đọc được — nút hữu dụng nhất của công cụ.</div>`,
  ]]);

const c3q = quiz('frs302-quiz-3', 'Quiz 3 — Packet analysis|||Quiz 3 — Phân tích gói tin', [
  { id: 'q1', question: 'Thứ tự bọc tầng đúng của một gói tin (ngoài vào trong)?', options: ['HTTP → TCP → IP → Ethernet', 'Ethernet → IP → TCP → ứng dụng (HTTP...)', 'IP → Ethernet → HTTP → TCP', 'TCP → IP → Ethernet → HTTP'], correctIndex: 1, explanation: 'Đóng gói: Ethernet (MAC) → IP → TCP/UDP (cổng) → dữ liệu ứng dụng.' },
  { id: 'q2', question: 'Bắt tay TCP 3 bước diễn ra theo trình tự nào?', options: ['ACK → SYN → RST', 'SYN → SYN/ACK → ACK', 'SYN → RST → ACK', 'FIN → ACK → SYN'], correctIndex: 1, explanation: 'Client gửi SYN, server đáp SYN+ACK, client gửi ACK → kết nối thiết lập.' },
  { id: 'q3', question: 'Tính năng nào của Wireshark ghép các gói rời rạc thành văn bản một cuộc trao đổi?', options: ['Capture filter', 'Follow TCP Stream', 'Coloring rules', 'IO Graph'], correctIndex: 1, explanation: 'Follow TCP Stream tái dựng luồng thành text đọc được — công cụ then chốt.' },
]);

const c4 = doc('frs302-4-1-flow-netflow-zeek', '4.1 — Flow analysis: NetFlow &amp; Zeek logs|||4.1 — Phân tích luồng: NetFlow &amp; log Zeek',
  'Luồng (flow) là gì vs gói đầy đủ; NetFlow/IPFIX; Zeek biến lưu lượng thành log (conn.log, dns.log); dùng flow để phát hiện beaconing & khối lượng bất thường khi không có full pcap.',
  [[
    `<span class="eyebrow">FRS302 · Chapter 4 · Lesson 4.1</span>
<h2>Flow analysis: NetFlow &amp; Zeek logs</h2>
<h3>Flows vs full packets</h3>
<p>A <strong>flow record</strong> summarises a conversation — source/destination IP and port, protocol, byte and packet counts, start and duration — <em>without</em> storing the payload. Flows are tiny, so organisations keep months of them where full pcap lasts hours. Perfect for "who talked to whom, when, how much".</p>
<h3>NetFlow / IPFIX</h3>
<p><strong>NetFlow</strong> (Cisco) and its standard <strong>IPFIX</strong> are exported by routers/switches. One line ≈ one conversation. Great for spotting a host that suddenly sends gigabytes out at 3am.</p>
<h3>Zeek turns traffic into logs</h3>
<p><strong>Zeek</strong> watches traffic and writes rich, tab-separated logs: <code>conn.log</code> (every connection), <code>dns.log</code>, <code>http.log</code>, <code>ssl.log</code>, <code>files.log</code>.</p>
<pre><code># Generate logs from a pcap
zeek -r case42.pcap

# Top talkers by bytes from conn.log (field 10 = orig_bytes)
zeek-cut id.orig_h id.resp_h resp_bytes &lt; conn.log | sort -k3 -n -r | head
</code></pre>
<div class="callout"><span class="badge">Beaconing</span> Malware "phones home" on a regular interval. In flow data this shows as many small, evenly-spaced connections to one destination — a pattern invisible in a single packet but obvious across flows.</div>`,
    `<span class="eyebrow">FRS302 · Chương 4 · Bài 4.1</span>
<h2>Phân tích luồng: NetFlow &amp; log Zeek</h2>
<h3>Luồng vs gói đầy đủ</h3>
<p>Một <strong>bản ghi luồng (flow)</strong> tóm tắt một cuộc trao đổi — IP/cổng nguồn và đích, giao thức, số byte và số gói, thời điểm bắt đầu và thời lượng — mà <em>không</em> lưu payload. Luồng rất nhẹ, nên tổ chức giữ được hàng tháng trong khi full pcap chỉ giữ được vài giờ. Hoàn hảo cho câu hỏi "ai nói với ai, khi nào, bao nhiêu".</p>
<h3>NetFlow / IPFIX</h3>
<p><strong>NetFlow</strong> (Cisco) và chuẩn <strong>IPFIX</strong> được router/switch xuất ra. Một dòng ≈ một cuộc trao đổi. Rất hợp để phát hiện một host bỗng gửi hàng GB ra ngoài lúc 3 giờ sáng.</p>
<h3>Zeek biến lưu lượng thành log</h3>
<p><strong>Zeek</strong> theo dõi lưu lượng và ghi log giàu thông tin, ngăn cách bằng tab: <code>conn.log</code> (mọi kết nối), <code>dns.log</code>, <code>http.log</code>, <code>ssl.log</code>, <code>files.log</code>.</p>
<pre><code># Sinh log từ một pcap
zeek -r case42.pcap

# Xếp top host theo số byte trả về (từ conn.log)
zeek-cut id.orig_h id.resp_h resp_bytes &lt; conn.log | sort -k3 -n -r | head
</code></pre>
<div class="callout"><span class="badge">Beaconing</span> Malware "gọi về nhà" theo chu kỳ đều đặn. Trong dữ liệu luồng, điều này hiện ra thành nhiều kết nối nhỏ, cách đều nhau tới một đích — một mẫu vô hình trong một gói đơn nhưng lộ rõ khi nhìn qua các luồng.</div>`,
  ]]);

const c4q = quiz('frs302-quiz-4', 'Quiz 4 — Flow analysis|||Quiz 4 — Phân tích luồng', [
  { id: 'q1', question: 'Bản ghi luồng (flow) KHÁC gói đầy đủ ở điểm cốt lõi nào?', options: ['Flow lưu toàn bộ payload', 'Flow chỉ tóm tắt cuộc trao đổi (IP/cổng/byte/thời lượng), KHÔNG lưu payload', 'Flow chỉ dùng cho DNS', 'Flow nặng hơn full pcap'], correctIndex: 1, explanation: 'Vì không lưu payload nên flow rất nhẹ, giữ được hàng tháng → hợp cho tra cứu lịch sử.' },
  { id: 'q2', question: 'Zeek chủ yếu làm gì cho điều tra viên?', options: ['Tấn công máy chủ đích', 'Biến lưu lượng thành các log giàu thông tin (conn.log, dns.log...)', 'Mã hoá pcap', 'Chặn kết nối như firewall'], correctIndex: 1, explanation: 'Zeek sinh conn.log/dns.log/http.log/ssl.log... để phân tích, không phải công cụ tấn công.' },
  { id: 'q3', question: 'Trong dữ liệu luồng, "beaconing" của malware hiện ra như thế nào?', options: ['Một kết nối lớn duy nhất', 'Nhiều kết nối nhỏ, cách đều nhau tới cùng một đích', 'Không để lại dấu vết nào', 'Chỉ thấy trong một gói đơn'], correctIndex: 1, explanation: 'Gọi về nhà theo chu kỳ đều → mẫu chỉ lộ khi nhìn qua nhiều luồng theo thời gian.' },
]);

const c5 = doc('frs302-5-1-http-dns-email', '5.1 — Investigating HTTP, DNS &amp; email|||5.1 — Điều tra giao thức HTTP/DNS/email',
  'Đọc yêu cầu/phản hồi HTTP, header & User-Agent; điều tra DNS (truy vấn, DGA, tunneling); dấu vết email (SMTP, header Received, đọc ngược đường đi).',
  [[
    `<span class="eyebrow">FRS302 · Chapter 5 · Lesson 5.1</span>
<h2>Investigating HTTP, DNS &amp; email</h2>
<h3>HTTP</h3>
<p>An HTTP transaction is a <strong>request</strong> (method, URL, headers) and a <strong>response</strong> (status, headers, body). Forensically useful fields: <code>Host</code>, <code>User-Agent</code> (odd values betray malware/tools), <code>Referer</code>, and the requested URI.</p>
<pre><code>tshark -r case42.pcap -Y "http.request" \\
  -T fields -e ip.dst -e http.host -e http.request.uri -e http.user_agent
</code></pre>
<h3>DNS</h3>
<p>Almost every connection starts with a DNS lookup, so <code>dns.log</code> is a map of intent. Watch for:</p>
<ul>
<li><strong>DGA domains</strong> — long, random-looking names (algorithm-generated) used by malware.</li>
<li><strong>DNS tunnelling</strong> — data smuggled inside DNS queries; shows as huge numbers of long TXT/subdomain lookups to one domain.</li>
</ul>
<h3>Email trail</h3>
<p>SMTP carries the envelope and the message. The <strong>Received:</strong> headers stack up as the mail passes each server — <em>read them bottom-to-top</em> to reconstruct the true path and spot a forged origin.</p>
<div class="callout"><span class="badge">Correlate</span> A suspicious HTTP POST, the DNS lookup that preceded it, and the flow that carried it are three views of one event — line them up by timestamp.</div>`,
    `<span class="eyebrow">FRS302 · Chương 5 · Bài 5.1</span>
<h2>Điều tra giao thức HTTP/DNS/email</h2>
<h3>HTTP</h3>
<p>Một giao dịch HTTP gồm <strong>request</strong> (phương thức, URL, header) và <strong>response</strong> (status, header, thân). Trường hữu ích khi điều tra: <code>Host</code>, <code>User-Agent</code> (giá trị lạ để lộ malware/công cụ), <code>Referer</code>, và URI được yêu cầu.</p>
<pre><code>tshark -r case42.pcap -Y "http.request" \\
  -T fields -e ip.dst -e http.host -e http.request.uri -e http.user_agent
</code></pre>
<h3>DNS</h3>
<p>Gần như mọi kết nối bắt đầu bằng một truy vấn DNS, nên <code>dns.log</code> là tấm bản đồ ý định. Cần để ý:</p>
<ul>
<li><strong>Tên miền DGA</strong> — tên dài, trông ngẫu nhiên (do thuật toán sinh) mà malware dùng.</li>
<li><strong>DNS tunnelling</strong> — dữ liệu bị lén nhét trong truy vấn DNS; hiện ra thành cực nhiều truy vấn TXT/subdomain dài tới cùng một tên miền.</li>
</ul>
<h3>Dấu vết email</h3>
<p>SMTP mang phong bì và nội dung thư. Các header <strong>Received:</strong> chồng lên nhau khi thư đi qua từng máy chủ — <em>đọc từ dưới lên</em> để dựng lại đường đi thật và phát hiện nguồn gốc bị giả mạo.</p>
<div class="callout"><span class="badge">Đối chiếu</span> Một HTTP POST khả nghi, truy vấn DNS trước nó, và luồng đã chở nó là ba góc nhìn của cùng một sự kiện — hãy xếp chúng theo mốc thời gian.</div>`,
  ]]);

const c5q = quiz('frs302-quiz-5', 'Quiz 5 — HTTP/DNS/email|||Quiz 5 — HTTP/DNS/email', [
  { id: 'q1', question: 'Trường HTTP nào thường để lộ malware/công cụ tự động?', options: ['Content-Length', 'User-Agent có giá trị lạ', 'Date', 'Connection'], correctIndex: 1, explanation: 'User-Agent bất thường (chuỗi lạ/thiếu) là dấu hiệu client không phải trình duyệt thật.' },
  { id: 'q2', question: 'Dấu hiệu nào gợi ý DNS tunnelling (tuồn dữ liệu qua DNS)?', options: ['Rất nhiều truy vấn TXT/subdomain dài tới cùng một tên miền', 'Một truy vấn A duy nhất tới google.com', 'Không có truy vấn DNS nào', 'Chỉ có phản hồi NXDOMAIN'], correctIndex: 0, explanation: 'Dữ liệu bị mã hoá vào tên miền → khối lượng lớn truy vấn dài, bất thường tới một domain.' },
  { id: 'q3', question: 'Đọc header "Received:" của email theo chiều nào để dựng lại đường đi thật?', options: ['Từ trên xuống', 'Từ dưới lên', 'Theo thứ tự bảng chữ cái', 'Ngẫu nhiên'], correctIndex: 1, explanation: 'Mỗi máy chủ chèn Received: lên đầu → đọc từ dưới lên cho ra trình tự đi qua các server.' },
]);

const c6 = doc('frs302-6-1-attack-c2-exfil', '6.1 — Detecting &amp; investigating attacks|||6.1 — Phát hiện &amp; điều tra tấn công',
  'Chuỗi tấn công (recon → khai thác → C2 → di chuyển ngang → rò rỉ); nhận diện C2 (beaconing, domain lạ, TLS bất thường); dấu hiệu exfiltration (upload lớn/ra ngoài giờ); IOC.',
  [[
    `<span class="eyebrow">FRS302 · Chapter 6 · Lesson 6.1</span>
<h2>Detecting &amp; investigating attacks</h2>
<h3>The attack lifecycle (defender's view)</h3>
<p>Reconnaissance → exploitation → <strong>command-and-control (C2)</strong> → lateral movement → <strong>exfiltration</strong>. Each stage leaves a network trace; the investigator reconstructs the timeline from them.</p>
<h3>Spotting C2</h3>
<ul>
<li><strong>Beaconing</strong> — regular, evenly-spaced call-backs (see Chapter 4).</li>
<li><strong>Rare destinations</strong> — a domain only one host ever contacts, newly registered, or DGA-looking.</li>
<li><strong>Odd TLS</strong> — self-signed certs, mismatched SNI, unusual JA3 fingerprints.</li>
</ul>
<h3>Signs of exfiltration</h3>
<p>Look for <strong>large outbound transfers</strong>, especially uploads far bigger than downloads, at odd hours, to an unfamiliar host or cloud endpoint.</p>
<pre><code># Zeek conn.log: connections where the client SENT a lot (orig_bytes)
zeek-cut id.orig_h id.resp_h orig_bytes duration &lt; conn.log \\
  | sort -k3 -n -r | head
</code></pre>
<h3>IOCs</h3>
<p>An <strong>Indicator of Compromise</strong> is a concrete artefact — an IP, a domain, a file hash, a URI — that marks the attack. Extract them so peers can hunt the same threat.</p>
<div class="callout"><span class="badge">Investigate, do not engage</span> The forensic job is to observe, record and reconstruct on captured data — never to probe or strike back at the attacker's infrastructure.</div>`,
    `<span class="eyebrow">FRS302 · Chương 6 · Bài 6.1</span>
<h2>Phát hiện &amp; điều tra tấn công</h2>
<h3>Vòng đời tấn công (góc nhìn phòng thủ)</h3>
<p>Trinh sát → khai thác → <strong>điều khiển (command-and-control, C2)</strong> → di chuyển ngang → <strong>rò rỉ dữ liệu (exfiltration)</strong>. Mỗi giai đoạn để lại dấu vết mạng; điều tra viên dựng lại dòng thời gian từ chúng.</p>
<h3>Nhận diện C2</h3>
<ul>
<li><strong>Beaconing</strong> — gọi về đều đặn, cách đều nhau (xem Chương 4).</li>
<li><strong>Đích hiếm gặp</strong> — tên miền chỉ một host liên hệ, mới đăng ký, hoặc trông kiểu DGA.</li>
<li><strong>TLS bất thường</strong> — chứng chỉ tự ký, SNI lệch, dấu vân tay JA3 lạ.</li>
</ul>
<h3>Dấu hiệu rò rỉ dữ liệu</h3>
<p>Tìm các <strong>lần truyền ra ngoài lớn</strong>, nhất là upload lớn hơn hẳn download, vào giờ bất thường, tới một host hay điểm cuối đám mây lạ.</p>
<pre><code># Zeek conn.log: các kết nối mà client GỬI đi nhiều (orig_bytes)
zeek-cut id.orig_h id.resp_h orig_bytes duration &lt; conn.log \\
  | sort -k3 -n -r | head
</code></pre>
<h3>IOC</h3>
<p><strong>Chỉ dấu xâm nhập (Indicator of Compromise)</strong> là một dấu vết cụ thể — một IP, tên miền, hàm băm file, một URI — đánh dấu cuộc tấn công. Rút chúng ra để đồng nghiệp truy tìm cùng mối đe doạ.</p>
<div class="callout"><span class="badge">Điều tra, không can dự</span> Việc điều tra là quan sát, ghi lại và dựng lại trên dữ liệu đã bắt — không bao giờ dò hay đánh trả hạ tầng của kẻ tấn công.</div>`,
  ]]);

const c6q = quiz('frs302-quiz-6', 'Quiz 6 — Attack investigation|||Quiz 6 — Điều tra tấn công', [
  { id: 'q1', question: 'Trong vòng đời tấn công, "C2" (command-and-control) là giai đoạn nào?', options: ['Trinh sát ban đầu', 'Kênh kẻ tấn công điều khiển máy đã chiếm', 'Rò rỉ dữ liệu ra ngoài', 'Xoá dấu vết trên đĩa'], correctIndex: 1, explanation: 'C2 là kênh liên lạc/điều khiển; thường lộ qua beaconing tới đích lạ.' },
  { id: 'q2', question: 'Dấu hiệu mạng điển hình của exfiltration (rò rỉ dữ liệu) là?', options: ['Download lớn từ trang tin tức', 'Upload ra ngoài lớn bất thường, lệch hẳn với download, vào giờ lạ', 'Truy vấn DNS tới máy chủ nội bộ', 'Nhiều gói ICMP ping'], correctIndex: 1, explanation: 'orig_bytes lớn tới host/đám mây lạ vào giờ bất thường là cờ đỏ rò rỉ.' },
  { id: 'q3', question: 'IOC (Indicator of Compromise) là gì?', options: ['Một loại firewall', 'Dấu vết cụ thể (IP, domain, hash, URI) đánh dấu cuộc tấn công', 'Tên của một hàm băm', 'Một cổng SPAN'], correctIndex: 1, explanation: 'IOC được rút ra để chia sẻ và truy tìm cùng mối đe doạ ở nơi khác.' },
]);

const c7 = doc('frs302-7-1-wireless-devices-logs', '7.1 — Wireless &amp; network-device logs|||7.1 — Điều tra không dây &amp; log thiết bị mạng',
  'Chứng cứ Wi-Fi (802.11, SSID/BSSID, khung quản lý, rogue AP); log firewall (allow/deny, 5-tuple); log IDS/IPS (Snort/Suricata) và cảnh báo; tương quan log tập trung (syslog/SIEM); đồng bộ thời gian NTP.',
  [[
    `<span class="eyebrow">FRS302 · Chapter 7 · Lesson 7.1</span>
<h2>Wireless &amp; network-device logs</h2>
<h3>Wireless (802.11) evidence</h3>
<p>Wi-Fi adds MAC-layer artefacts: <strong>SSID/BSSID</strong>, association and deauthentication frames, and signal metadata. A <strong>rogue access point</strong> (an unauthorised AP impersonating the corporate SSID) shows up as an unexpected BSSID advertising a known SSID.</p>
<h3>Firewall logs</h3>
<p>Each line records an allow/deny decision with the <strong>5-tuple</strong> (src IP, src port, dst IP, dst port, protocol) and a timestamp. A burst of denies to many ports from one source is a scan; an allow to a rare destination may be the C2 you traced in packets.</p>
<h3>IDS/IPS alerts</h3>
<p><strong>Snort</strong> and <strong>Suricata</strong> match traffic against signatures and raise alerts. Treat an alert as a <em>lead, not a verdict</em> — confirm it against the packets/flows before concluding.</p>
<pre><code># Suricata: run rules against a saved pcap, then read the alerts
suricata -r case42.pcap -l ./out
cat ./out/fast.log
</code></pre>
<h3>Correlation &amp; time</h3>
<p>Central logging (<strong>syslog</strong> / a <strong>SIEM</strong>) lets you line up firewall, IDS and server logs. This only works if every device shares synchronised time (<strong>NTP</strong>) — mismatched clocks wreck timelines.</p>
<div class="callout"><span class="badge">One clock</span> Record and normalise every source to UTC. A five-minute clock skew can make cause look like effect.</div>`,
    `<span class="eyebrow">FRS302 · Chương 7 · Bài 7.1</span>
<h2>Điều tra không dây &amp; log thiết bị mạng</h2>
<h3>Chứng cứ không dây (802.11)</h3>
<p>Wi-Fi thêm dấu vết ở tầng MAC: <strong>SSID/BSSID</strong>, khung association và deauthentication, cùng metadata tín hiệu. Một <strong>điểm truy cập giả mạo (rogue AP)</strong> — một AP trái phép đóng vai SSID của công ty — lộ ra dưới dạng một BSSID lạ đang quảng bá một SSID quen thuộc.</p>
<h3>Log firewall</h3>
<p>Mỗi dòng ghi một quyết định cho phép/chặn kèm <strong>5-tuple</strong> (IP nguồn, cổng nguồn, IP đích, cổng đích, giao thức) và mốc thời gian. Một loạt "chặn" tới nhiều cổng từ một nguồn là dấu hiệu quét; một "cho phép" tới đích hiếm gặp có thể chính là C2 bạn đã lần theo trong gói.</p>
<h3>Cảnh báo IDS/IPS</h3>
<p><strong>Snort</strong> và <strong>Suricata</strong> so lưu lượng với signature và phát cảnh báo. Hãy coi cảnh báo là <em>manh mối, không phải phán quyết</em> — xác nhận lại với gói/luồng trước khi kết luận.</p>
<pre><code># Suricata: chạy luật trên một pcap đã lưu, rồi đọc cảnh báo
suricata -r case42.pcap -l ./out
cat ./out/fast.log
</code></pre>
<h3>Tương quan &amp; thời gian</h3>
<p>Ghi log tập trung (<strong>syslog</strong> / một <strong>SIEM</strong>) cho phép xếp thẳng hàng log firewall, IDS và máy chủ. Chỉ hiệu quả nếu mọi thiết bị dùng chung thời gian đồng bộ (<strong>NTP</strong>) — đồng hồ lệch nhau phá nát dòng thời gian.</p>
<div class="callout"><span class="badge">Một đồng hồ</span> Ghi và chuẩn hoá mọi nguồn về UTC. Đồng hồ lệch năm phút có thể khiến nguyên nhân trông như hệ quả.</div>`,
  ]]);

const c7q = quiz('frs302-quiz-7', 'Quiz 7 — Wireless &amp; device logs|||Quiz 7 — Không dây &amp; log thiết bị', [
  { id: 'q1', question: '"5-tuple" trong log firewall gồm những gì?', options: ['5 địa chỉ MAC', 'IP nguồn, cổng nguồn, IP đích, cổng đích, giao thức', 'Tên miền, SSID, kênh, RSSI, thời gian', '5 dòng cảnh báo IDS'], correctIndex: 1, explanation: '5-tuple định danh một luồng: src IP/port, dst IP/port, protocol.' },
  { id: 'q2', question: 'Nên coi một cảnh báo IDS (Snort/Suricata) là gì?', options: ['Phán quyết cuối cùng, kết luận ngay', 'Manh mối cần xác nhận lại với gói/luồng trước khi kết luận', 'Bằng chứng đủ để truy tố', 'Lỗi cấu hình, nên bỏ qua'], correctIndex: 1, explanation: 'Signature có thể báo nhầm/sót → luôn đối chiếu với dữ liệu gốc.' },
  { id: 'q3', question: 'Vì sao đồng bộ thời gian (NTP) quan trọng khi tương quan log nhiều thiết bị?', options: ['Để tiết kiệm băng thông', 'Để đồng hồ lệch không phá dòng thời gian, tránh nguyên nhân trông như hệ quả', 'Để mã hoá log', 'Để giảm dung lượng log'], correctIndex: 1, explanation: 'Lệch giờ vài phút có thể đảo lộn trình tự sự kiện khi ghép log.' },
]);

const c8 = doc('frs302-8-1-reporting-legal', '8.1 — Reporting, legal aspects &amp; presenting evidence|||8.1 — Báo cáo, khía cạnh pháp lý &amp; trình bày chứng cứ',
  'Cấu trúc báo cáo điều tra (tóm tắt điều hành → phương pháp → phát hiện → kết luận); tính chấp nhận được của chứng cứ; hợp pháp/riêng tư khi bắt lưu lượng; báo cáo dựa trên sự thật, nhân chứng chuyên môn.',
  [[
    `<span class="eyebrow">FRS302 · Chapter 8 · Lesson 8.1</span>
<h2>Reporting, legal aspects &amp; presenting evidence</h2>
<h3>Structure of a forensic report</h3>
<ul>
<li><strong>Executive summary</strong> — plain-language answer to "what happened" for non-technical readers.</li>
<li><strong>Scope &amp; methodology</strong> — what you examined and how (tools, versions, hashes).</li>
<li><strong>Findings</strong> — the facts, each tied to specific evidence (packet, flow, log line, timestamp).</li>
<li><strong>Conclusions</strong> — what the facts support, and clearly-labelled limitations.</li>
</ul>
<h3>Admissibility</h3>
<p>For evidence to hold up, it must be <strong>authentic</strong>, its integrity provable (hashes), its handling documented (chain of custody), and its collection <strong>lawful</strong>. A brilliant finding from an unlawful capture may be thrown out entirely.</p>
<h3>Legal &amp; privacy</h3>
<p>Capturing traffic can intercept private communications. Only monitor with proper <strong>authorisation</strong> (policy, banner, or a legal order), collect no more than the investigation needs, and follow the applicable law and your organisation's policy.</p>
<h3>Fact vs opinion</h3>
<p>Report <strong>facts</strong> ("host A sent 4.2 GB to 203.0.113.9 at 03:14 UTC") separately from <strong>interpretation</strong> ("consistent with data exfiltration"). As an expert witness you may offer an opinion, but it must rest on the stated facts.</p>
<div class="callout"><span class="badge">Reproducible</span> A peer following your report with the same evidence and tools must reach the same result — that is what makes a finding defensible.</div>`,
    `<span class="eyebrow">FRS302 · Chương 8 · Bài 8.1</span>
<h2>Báo cáo, khía cạnh pháp lý &amp; trình bày chứng cứ</h2>
<h3>Cấu trúc một báo cáo điều tra</h3>
<ul>
<li><strong>Tóm tắt điều hành</strong> — trả lời "chuyện gì đã xảy ra" bằng ngôn ngữ dễ hiểu cho người không kỹ thuật.</li>
<li><strong>Phạm vi &amp; phương pháp</strong> — đã giám định cái gì và bằng cách nào (công cụ, phiên bản, hàm băm).</li>
<li><strong>Phát hiện</strong> — các sự thật, mỗi cái gắn với chứng cứ cụ thể (gói, luồng, dòng log, mốc thời gian).</li>
<li><strong>Kết luận</strong> — những gì sự thật ủng hộ, và các giới hạn được ghi rõ.</li>
</ul>
<h3>Tính chấp nhận được</h3>
<p>Để chứng cứ đứng vững, nó phải <strong>xác thực</strong>, toàn vẹn chứng minh được (hàm băm), quá trình xử lý được ghi chép (chuỗi hành trình), và việc thu thập <strong>hợp pháp</strong>. Một phát hiện tài tình từ một lần bắt trái phép có thể bị loại bỏ hoàn toàn.</p>
<h3>Pháp lý &amp; riêng tư</h3>
<p>Bắt lưu lượng có thể chặn cả liên lạc riêng tư. Chỉ giám sát khi có <strong>thẩm quyền</strong> hợp lệ (chính sách, banner, hoặc lệnh pháp lý), thu không nhiều hơn nhu cầu điều tra, và tuân theo luật hiện hành cùng chính sách của tổ chức.</p>
<h3>Sự thật vs nhận định</h3>
<p>Báo cáo <strong>sự thật</strong> ("host A đã gửi 4,2 GB tới 203.0.113.9 lúc 03:14 UTC") tách khỏi <strong>diễn giải</strong> ("phù hợp với hành vi rò rỉ dữ liệu"). Là nhân chứng chuyên môn bạn có thể nêu nhận định, nhưng nó phải dựa trên các sự thật đã trình bày.</p>
<div class="callout"><span class="badge">Tái lập được</span> Một đồng nghiệp làm theo báo cáo của bạn với cùng chứng cứ và công cụ phải ra cùng kết quả — đó là điều làm một phát hiện có thể bảo vệ được.</div>`,
  ]]);

const c8q = quiz('frs302-quiz-8', 'Quiz 8 — Reporting &amp; legal|||Quiz 8 — Báo cáo &amp; pháp lý', [
  { id: 'q1', question: 'Điều kiện nào KHÔNG thể thiếu để chứng cứ được chấp nhận (admissible)?', options: ['Báo cáo dài nhiều trang', 'Xác thực, toàn vẹn chứng minh được, xử lý được ghi chép, thu thập hợp pháp', 'Dùng công cụ đắt tiền', 'Có nhiều biểu đồ màu'], correctIndex: 1, explanation: 'Chứng cứ từ một lần bắt trái phép có thể bị loại bỏ hoàn toàn dù nội dung có giá trị.' },
  { id: 'q2', question: 'Trong báo cáo điều tra, nên trình bày sự thật và diễn giải như thế nào?', options: ['Trộn lẫn cho gọn', 'Tách bạch: sự thật (dữ liệu đo được) riêng, diễn giải/nhận định riêng', 'Chỉ ghi nhận định', 'Chỉ ghi sự thật, không kết luận gì'], correctIndex: 1, explanation: 'Nhận định chuyên môn phải dựa trên các sự thật đã nêu, và tách khỏi chúng cho minh bạch.' },
  { id: 'q3', question: 'Yêu cầu về pháp lý/riêng tư khi bắt lưu lượng để điều tra là gì?', options: ['Bắt càng nhiều càng tốt, không cần xin phép', 'Chỉ giám sát khi có thẩm quyền hợp lệ, thu vừa đủ nhu cầu, tuân luật &amp; chính sách', 'Được phép chặn mọi liên lạc riêng tư bất cứ lúc nào', 'Không cần quan tâm luật vì là phòng thủ'], correctIndex: 1, explanation: 'Giám sát cần thẩm quyền (chính sách/banner/lệnh), thu tối thiểu, theo luật và chính sách tổ chức.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'FRS302',
    slug: 'frs302-network-forensics',
    title: 'Network Forensics',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/FRS302.webp',
    shortDescription: 'Network forensics for defenders — capture & preserve evidence, chain of custody, packet & flow analysis (Wireshark, tcpdump, NetFlow, Zeek), HTTP/DNS/email, C2 & exfiltration, firewall/IDS logs, legal reporting. Bilingual, tool examples & quizzes.|||Điều tra số trên mạng cho phòng thủ — thu thập & bảo toàn chứng cứ, chuỗi hành trình, phân tích gói & luồng (Wireshark, tcpdump, NetFlow, Zeek), HTTP/DNS/email, C2 & rò rỉ, log firewall/IDS, báo cáo pháp lý. Song ngữ, ví dụ & quiz.',
    description: 'Môn <strong>FRS302 — Network Forensics</strong> (Điều tra số trên mạng, kỳ 5, định hướng An toàn thông tin) dạy cách <strong>điều tra sự cố an ninh qua lưu lượng mạng</strong> theo hướng phòng thủ, hợp pháp. Từ <strong>nguyên lý &amp; chuỗi hành trình chứng cứ</strong> (NIST SP 800-86) → <strong>thu thập</strong> (TAP/SPAN, tcpdump) → <strong>phân tích gói</strong> (Wireshark/tshark) → <strong>phân tích luồng</strong> (NetFlow/Zeek) → <strong>giao thức</strong> (HTTP/DNS/email) → <strong>điều tra tấn công</strong> (C2, rò rỉ dữ liệu) → <strong>log firewall/IDS &amp; không dây</strong> → <strong>báo cáo &amp; pháp lý</strong>. Bám giáo trình Davidoff/Ham, Casey; song ngữ, có ví dụ công cụ và quiz mỗi chương.',
    whatYouLearn: 'Quy trình điều tra số (NIST SP 800-86); toàn vẹn chứng cứ bằng hàm băm &amp; chuỗi hành trình; bắt lưu lượng đúng cách (TAP vs SPAN, tcpdump, BPF); phân tích gói với Wireshark/tshark (bắt tay TCP, Follow Stream); phân tích luồng NetFlow/Zeek, phát hiện beaconing; điều tra HTTP/DNS/email; nhận diện C2 &amp; exfiltration, rút IOC; đọc log firewall/IDS (Snort/Suricata) &amp; chứng cứ Wi-Fi; viết báo cáo có giá trị pháp lý.',
    requirements: 'Kiến thức mạng cơ bản (mô hình TCP/IP, giao thức HTTP/DNS) và dòng lệnh Linux. Nên cài Wireshark và Zeek để thực hành trên pcap lab của chính mình.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình chuẩn, NIST SP 800-86, SANS FOR572, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Điều tra mạng là gì, đối tượng chứng cứ, nguyên tắc vàng.', lessons: [intro] },
    { title: 'Chương 1 — Nguyên lý & chuỗi hành trình|||Chapter 1 — Principles & chain of custody', description: 'Quy trình NIST, hàm băm, chain of custody, Locard.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Thu thập & bảo toàn|||Chapter 2 — Acquisition & preservation', description: 'TAP vs SPAN, tcpdump, BPF, write-once.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Phân tích gói tin|||Chapter 3 — Packet analysis', description: 'Wireshark/tshark, display filter, TCP handshake, Follow Stream.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Phân tích luồng|||Chapter 4 — Flow analysis', description: 'NetFlow/IPFIX, Zeek logs, beaconing.', lessons: [c4, c4q] },
    { title: 'Chương 5 — HTTP/DNS/email|||Chapter 5 — HTTP/DNS/email', description: 'Header HTTP, DGA/DNS tunnelling, dấu vết email.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Điều tra tấn công|||Chapter 6 — Attack investigation', description: 'Vòng đời tấn công, C2, exfiltration, IOC.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Không dây & log thiết bị|||Chapter 7 — Wireless & device logs', description: 'Wi-Fi/rogue AP, firewall, IDS/IPS, NTP.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Báo cáo & pháp lý|||Chapter 8 — Reporting & legal', description: 'Cấu trúc báo cáo, tính chấp nhận được, sự thật vs nhận định.', lessons: [c8, c8q] },
  ],
};
