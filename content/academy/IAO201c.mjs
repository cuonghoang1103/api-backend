/**
 * IAO201c — Introduction to Information Assurance (Nhập môn Đảm bảo an toàn
 * thông tin). Ngành Hệ thống thông tin, kỳ 5, FPTU. Giáo trình: Whitman/Mattord
 * "Principles of Information Security"; Stallings "Computer Security"; NIST
 * SP 800-12; ISO 27001. Định hướng PHÒNG THỦ/giáo dục. Song ngữ + ví dụ + quiz.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG nested backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('iao201c-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn, tài liệu chính thức miễn phí (NIST, OWASP), YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">IAO201c · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Information Assurance</strong> — the CIA triad, cryptography, access control, network defense, malware, application security, risk management and incident response — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal, defensive-oriented resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for IAO201c are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li>Whitman &amp; Mattord — <em>Principles of Information Security</em> (main textbook)</li>
<li>Stallings — <em>Computer Security: Principles and Practice</em></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://csrc.nist.gov/pubs/sp/800/12/r1/final" target="_blank" rel="noopener">NIST SP 800-12 — An Introduction to Information Security</a></li>
<li><a href="https://www.iso.org/standard/27001" target="_blank" rel="noopener">ISO/IEC 27001 — Information security management</a></li>
<li><a href="https://owasp.org/www-project-top-ten/" target="_blank" rel="noopener">OWASP Top 10 — most critical web app risks</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@professormesser" target="_blank" rel="noopener">Professor Messer</a> — Security+ &amp; security fundamentals</li>
<li><a href="https://www.youtube.com/@computerphile" target="_blank" rel="noopener">Computerphile</a> — crypto &amp; security explained</li>
</ul>
<h3>🛠️ Learning tools (defensive)</h3>
<ul>
<li><a href="https://tryhackme.com/" target="_blank" rel="noopener">TryHackMe</a> — guided, legal hands-on security labs</li>
<li><a href="https://www.cyberchef.io/" target="_blank" rel="noopener">CyberChef</a> — encode/decode, hashing, crypto playground</li>
<li><a href="https://haveibeenpwned.com/" target="_blank" rel="noopener">Have I Been Pwned</a> — check breached credentials</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — CIA triad, threats vs vulnerabilities vs risk, defense in depth.</li>
<li><strong>Mechanisms</strong> — cryptography, authentication &amp; access control, network defenses.</li>
<li><strong>Attacks &amp; defenses</strong> — malware, common attacks, OWASP Top 10 (understand to defend).</li>
<li><strong>Govern</strong> — risk management, policy, law, ethics and incident response.</li>
</ol></div>`,
    `<span class="eyebrow">IAO201c · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Đảm bảo an toàn thông tin</strong> — bộ ba CIA, mã hoá, kiểm soát truy cập, phòng thủ mạng, mã độc, an toàn ứng dụng, quản lý rủi ro và ứng phó sự cố — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp, hướng phòng thủ.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của IAO201c có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li>Whitman &amp; Mattord — <em>Principles of Information Security</em> (giáo trình chính)</li>
<li>Stallings — <em>Computer Security: Principles and Practice</em></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://csrc.nist.gov/pubs/sp/800/12/r1/final" target="_blank" rel="noopener">NIST SP 800-12 — Nhập môn an toàn thông tin</a></li>
<li><a href="https://www.iso.org/standard/27001" target="_blank" rel="noopener">ISO/IEC 27001 — Quản lý an toàn thông tin</a></li>
<li><a href="https://owasp.org/www-project-top-ten/" target="_blank" rel="noopener">OWASP Top 10 — 10 rủi ro web nghiêm trọng nhất</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@professormesser" target="_blank" rel="noopener">Professor Messer</a> — Security+ &amp; nền tảng an toàn</li>
<li><a href="https://www.youtube.com/@computerphile" target="_blank" rel="noopener">Computerphile</a> — mã hoá &amp; an toàn giảng dễ hiểu</li>
</ul>
<h3>🛠️ Công cụ học tập (phòng thủ)</h3>
<ul>
<li><a href="https://tryhackme.com/" target="_blank" rel="noopener">TryHackMe</a> — lab an toàn thực hành hợp pháp, có hướng dẫn</li>
<li><a href="https://www.cyberchef.io/" target="_blank" rel="noopener">CyberChef</a> — sân chơi mã hoá/băm/encode-decode</li>
<li><a href="https://haveibeenpwned.com/" target="_blank" rel="noopener">Have I Been Pwned</a> — kiểm tra thông tin đăng nhập bị lộ</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — bộ ba CIA, phân biệt mối đe doạ / lỗ hổng / rủi ro, phòng thủ theo lớp.</li>
<li><strong>Cơ chế</strong> — mã hoá, xác thực &amp; kiểm soát truy cập, phòng thủ mạng.</li>
<li><strong>Tấn công &amp; phòng thủ</strong> — mã độc, tấn công phổ biến, OWASP Top 10 (hiểu để phòng).</li>
<li><strong>Quản trị</strong> — quản lý rủi ro, chính sách, pháp lý, đạo đức và ứng phó sự cố.</li>
</ol></div>`,
  ]]);

const intro = doc('iao201c-0-1-overview', 'Course overview: Introduction to Information Assurance|||Tổng quan: Nhập môn Đảm bảo an toàn thông tin',
  'Đảm bảo an toàn thông tin là gì; bộ ba CIA; lộ trình 8 chương: CIA & rủi ro → mã hoá → xác thực & kiểm soát truy cập → an ninh mạng → mã độc → an toàn ứng dụng → quản lý rủi ro → pháp lý, đạo đức & ứng phó sự cố.',
  [[
    `<span class="eyebrow">IAO201c · Lesson 0.1 · Overview</span>
<h2>Introduction to Information Assurance</h2>
<p class="lead">This course teaches you how to <strong>protect information and systems</strong> — the defensive foundation behind everything from a login form to a bank's data center. You will learn the vocabulary, the core mechanisms (cryptography, access control, network defenses) and the management practices (risk, policy, law, incident response) that keep data safe.</p>
<h3>The heart of it: the CIA triad</h3>
<ul>
<li><strong>Confidentiality</strong> — only authorised people can read the data.</li>
<li><strong>Integrity</strong> — data is accurate and has not been tampered with.</li>
<li><strong>Availability</strong> — the system is up and reachable when needed.</li>
</ul>
<p>Almost every security control exists to protect one or more of these three properties.</p>
<h3>A defensive mindset</h3>
<p>This course is <strong>defensive and educational</strong>: we study how attacks work only so we can <em>stop</em> them. The goal is to build, configure and operate systems that resist misuse — not to attack anyone.</p>
<h3>Roadmap</h3>
<p>Core concepts (CIA, threat, vulnerability, risk) → cryptography → authentication &amp; access control → network security (firewall/IDS/VPN) → malware &amp; common attacks → application security &amp; OWASP Top 10 → risk management &amp; policy → law, ethics &amp; incident response. Bilingual, with examples and a quiz each chapter.</p>`,
    `<span class="eyebrow">IAO201c · Bài 0.1 · Tổng quan</span>
<h2>Nhập môn Đảm bảo an toàn thông tin</h2>
<p class="lead">Môn này dạy bạn cách <strong>bảo vệ thông tin và hệ thống</strong> — nền phòng thủ đứng sau mọi thứ, từ một ô đăng nhập đến trung tâm dữ liệu của ngân hàng. Bạn sẽ học thuật ngữ, các cơ chế cốt lõi (mã hoá, kiểm soát truy cập, phòng thủ mạng) và các thực hành quản lý (rủi ro, chính sách, pháp lý, ứng phó sự cố) giúp giữ an toàn dữ liệu.</p>
<h3>Trái tim của môn: bộ ba CIA</h3>
<ul>
<li><strong>Bí mật (Confidentiality)</strong> — chỉ người được phép mới đọc được dữ liệu.</li>
<li><strong>Toàn vẹn (Integrity)</strong> — dữ liệu chính xác, không bị sửa trộm.</li>
<li><strong>Sẵn sàng (Availability)</strong> — hệ thống hoạt động và truy cập được khi cần.</li>
</ul>
<p>Gần như mọi biện pháp an toàn tồn tại để bảo vệ một hoặc nhiều trong ba tính chất này.</p>
<h3>Tư duy phòng thủ</h3>
<p>Môn học mang tính <strong>phòng thủ và giáo dục</strong>: ta tìm hiểu cách tấn công hoạt động chỉ để <em>ngăn chặn</em> chúng. Mục tiêu là dựng, cấu hình và vận hành hệ thống chống bị lạm dụng — không phải để tấn công ai.</p>
<h3>Lộ trình</h3>
<p>Khái niệm cốt lõi (CIA, đe doạ, lỗ hổng, rủi ro) → mã hoá → xác thực &amp; kiểm soát truy cập → an ninh mạng (firewall/IDS/VPN) → mã độc &amp; tấn công phổ biến → an toàn ứng dụng &amp; OWASP Top 10 → quản lý rủi ro &amp; chính sách → pháp lý, đạo đức &amp; ứng phó sự cố. Song ngữ, có ví dụ và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('iao201c-1-1-cia-risk', '1.1 — Core concepts: CIA, threats, vulnerabilities & risk|||1.1 — Khái niệm cơ bản: CIA, đe doạ, lỗ hổng & rủi ro',
  'Bộ ba CIA (và AAA); phân biệt tài sản, mối đe doạ, tác nhân đe doạ, lỗ hổng, rủi ro; công thức rủi ro; phòng thủ theo lớp (defense in depth).',
  [[
    `<span class="eyebrow">IAO201c · Chapter 1 · Lesson 1.1</span>
<h2>Core concepts: CIA, threats, vulnerabilities &amp; risk</h2>
<h3>The CIA triad</h3>
<ul>
<li><strong>Confidentiality</strong> — keep secrets secret (encryption, access control).</li>
<li><strong>Integrity</strong> — detect/prevent unauthorised change (hashing, signatures).</li>
<li><strong>Availability</strong> — keep services running (redundancy, backups, anti-DoS).</li>
</ul>
<p>Some models add <strong>Authentication, Authorization &amp; Accounting (AAA)</strong> and <strong>non-repudiation</strong>.</p>
<h3>Key vocabulary — get these straight</h3>
<pre><code>Asset          -> something of value (data, server, reputation)
Threat         -> a potential cause of harm (fire, hacker, malware)
Threat agent   -> the actor behind a threat (attacker, insider, nature)
Vulnerability  -> a weakness that a threat can exploit (unpatched bug)
Exploit        -> the method/code that uses a vulnerability
Risk           -> chance a threat exploits a vuln AND the impact if it does
</code></pre>
<h3>Thinking about risk</h3>
<p>A useful mental model: <strong>Risk ≈ Likelihood × Impact</strong>. You reduce risk by lowering either factor — patching a vulnerability lowers likelihood; backups lower impact.</p>
<div class="callout"><span class="badge">Defense in depth</span> Never rely on one control. Layer them — a firewall, plus patched software, plus least-privilege accounts, plus backups — so that one failure does not become a breach.</div>`,
    `<span class="eyebrow">IAO201c · Chương 1 · Bài 1.1</span>
<h2>Khái niệm cơ bản: CIA, đe doạ, lỗ hổng &amp; rủi ro</h2>
<h3>Bộ ba CIA</h3>
<ul>
<li><strong>Bí mật</strong> — giữ kín thông tin (mã hoá, kiểm soát truy cập).</li>
<li><strong>Toàn vẹn</strong> — phát hiện/ngăn sửa trái phép (hàm băm, chữ ký).</li>
<li><strong>Sẵn sàng</strong> — giữ dịch vụ chạy (dự phòng, sao lưu, chống DoS).</li>
</ul>
<p>Một số mô hình bổ sung <strong>Xác thực, Phân quyền &amp; Ghi vết (AAA)</strong> và <strong>chống chối bỏ (non-repudiation)</strong>.</p>
<h3>Thuật ngữ then chốt — phải phân biệt rõ</h3>
<pre><code>Tài sản (asset)      -> thứ có giá trị (dữ liệu, máy chủ, uy tín)
Mối đe doạ (threat)  -> nguyên nhân gây hại tiềm tàng (cháy, hacker, mã độc)
Tác nhân đe doạ      -> chủ thể đứng sau đe doạ (kẻ tấn công, nội gián, thiên tai)
Lỗ hổng (vuln)       -> điểm yếu mà đe doạ khai thác được (lỗi chưa vá)
Khai thác (exploit)  -> cách/mã dùng để lợi dụng lỗ hổng
Rủi ro (risk)        -> khả năng đe doạ khai thác lỗ hổng VÀ mức thiệt hại
</code></pre>
<h3>Tư duy về rủi ro</h3>
<p>Một mô hình hữu ích: <strong>Rủi ro ≈ Khả năng xảy ra × Mức tác động</strong>. Giảm rủi ro bằng cách hạ một trong hai — vá lỗ hổng hạ khả năng xảy ra; sao lưu hạ mức tác động.</p>
<div class="callout"><span class="badge">Phòng thủ theo lớp</span> Đừng bao giờ dựa vào một biện pháp duy nhất. Xếp lớp — firewall, cộng phần mềm đã vá, cộng tài khoản tối thiểu quyền, cộng sao lưu — để một lớp hỏng không biến thành một vụ lộ dữ liệu.</div>`,
  ]]);

const c1q = quiz('iao201c-quiz-1', 'Quiz 1 — CIA & risk|||Quiz 1 — CIA & rủi ro', [
  { id: 'q1', question: 'Bộ ba CIA trong an toàn thông tin gồm?', options: ['Confidentiality, Integrity, Availability', 'Control, Identity, Access', 'Confidentiality, Identity, Authorization', 'Crypto, Integrity, Audit'], correctIndex: 0, explanation: 'CIA = Bí mật, Toàn vẹn, Sẵn sàng — ba tính chất cốt lõi cần bảo vệ.' },
  { id: 'q2', question: '"Lỗ hổng (vulnerability)" được hiểu đúng nhất là?', options: ['Chủ thể tấn công', 'Thứ có giá trị cần bảo vệ', 'Điểm yếu mà mối đe doạ có thể khai thác', 'Thiệt hại đã xảy ra'], correctIndex: 2, explanation: 'Lỗ hổng là điểm yếu; mối đe doạ khai thác lỗ hổng mới thành rủi ro.' },
  { id: 'q3', question: 'Nguyên tắc "phòng thủ theo lớp (defense in depth)" nghĩa là?', options: ['Chỉ dùng một firewall mạnh', 'Xếp nhiều lớp biện pháp để một lớp hỏng không thành sự cố', 'Mã hoá mọi thứ hai lần', 'Chỉ tập trung vào tính sẵn sàng'], correctIndex: 1, explanation: 'Nhiều lớp độc lập giúp một điểm hỏng không dẫn tới vi phạm toàn hệ thống.' },
]);

const c2 = doc('iao201c-2-1-crypto', '2.1 — Cryptography basics|||2.1 — Mã hoá cơ bản',
  'Mã hoá đối xứng (AES) vs bất đối xứng (RSA); hàm băm (SHA-256) và toàn vẹn; chữ ký số; mã hoá lai (hybrid); băm mật khẩu có salt.',
  [[
    `<span class="eyebrow">IAO201c · Chapter 2 · Lesson 2.1</span>
<h2>Cryptography basics</h2>
<h3>Symmetric vs asymmetric</h3>
<ul>
<li><strong>Symmetric</strong> (e.g. <strong>AES</strong>) — one shared secret key encrypts and decrypts. Fast, but you must share the key safely.</li>
<li><strong>Asymmetric</strong> (e.g. <strong>RSA</strong>, ECC) — a <em>public</em> key encrypts, a <em>private</em> key decrypts. Solves key sharing but is slower.</li>
</ul>
<h3>Hash functions — for integrity</h3>
<p>A <strong>hash</strong> (e.g. <strong>SHA-256</strong>) turns any input into a fixed-size fingerprint. It is one-way and change-sensitive: flip one bit of input and the hash changes completely. Used to verify a file was not altered and to store passwords safely.</p>
<pre><code>Confidentiality  -> encryption (AES, RSA)
Integrity        -> hashing (SHA-256), MAC/HMAC
Authenticity     -> digital signature (sign with private key)
Passwords        -> hash + unique SALT (bcrypt/argon2), never plaintext
</code></pre>
<h3>Digital signatures &amp; hybrid encryption</h3>
<p>A <strong>digital signature</strong> hashes a message then encrypts the hash with the sender's <em>private</em> key — anyone can verify with the public key, proving origin and integrity. Real systems use <strong>hybrid encryption</strong>: asymmetric crypto to exchange a random symmetric key, then fast symmetric crypto for the data (this is how HTTPS/TLS works).</p>
<div class="callout"><span class="badge">Golden rule</span> Never invent your own crypto. Use vetted libraries and standard algorithms — the security is in the key, not in keeping the algorithm secret (Kerckhoffs's principle).</div>`,
    `<span class="eyebrow">IAO201c · Chương 2 · Bài 2.1</span>
<h2>Mã hoá cơ bản</h2>
<h3>Đối xứng vs bất đối xứng</h3>
<ul>
<li><strong>Đối xứng</strong> (vd <strong>AES</strong>) — một khoá bí mật chung dùng cả mã hoá lẫn giải mã. Nhanh, nhưng phải chia sẻ khoá an toàn.</li>
<li><strong>Bất đối xứng</strong> (vd <strong>RSA</strong>, ECC) — khoá <em>công khai</em> mã hoá, khoá <em>riêng</em> giải mã. Giải được bài toán chia khoá nhưng chậm hơn.</li>
</ul>
<h3>Hàm băm — cho tính toàn vẹn</h3>
<p>Một <strong>hàm băm</strong> (vd <strong>SHA-256</strong>) biến dữ liệu bất kỳ thành một dấu vân tay có kích thước cố định. Nó một chiều và nhạy thay đổi: đổi một bit đầu vào thì băm đổi hoàn toàn. Dùng để kiểm tra tệp không bị sửa và lưu mật khẩu an toàn.</p>
<pre><code>Bí mật        -> mã hoá (AES, RSA)
Toàn vẹn      -> băm (SHA-256), MAC/HMAC
Xác thực gốc  -> chữ ký số (ký bằng khoá riêng)
Mật khẩu      -> băm + SALT riêng (bcrypt/argon2), KHÔNG lưu thô
</code></pre>
<h3>Chữ ký số &amp; mã hoá lai</h3>
<p>Một <strong>chữ ký số</strong> băm thông điệp rồi mã hoá bản băm bằng khoá <em>riêng</em> của người gửi — ai cũng kiểm được bằng khoá công khai, chứng minh nguồn gốc và tính toàn vẹn. Hệ thống thật dùng <strong>mã hoá lai</strong>: dùng bất đối xứng để trao đổi một khoá đối xứng ngẫu nhiên, rồi dùng đối xứng nhanh để mã hoá dữ liệu (đây là cách HTTPS/TLS chạy).</p>
<div class="callout"><span class="badge">Quy tắc vàng</span> Đừng tự sáng chế thuật toán mã hoá. Dùng thư viện đã kiểm định và thuật toán chuẩn — an toàn nằm ở khoá, không nằm ở việc giấu thuật toán (nguyên lý Kerckhoffs).</div>`,
  ]]);

const c2q = quiz('iao201c-quiz-2', 'Quiz 2 — Cryptography|||Quiz 2 — Mã hoá', [
  { id: 'q1', question: 'Khác biệt cốt lõi giữa mã hoá đối xứng và bất đối xứng?', options: ['Đối xứng dùng một khoá chung; bất đối xứng dùng cặp khoá công khai/riêng', 'Đối xứng luôn an toàn hơn', 'Bất đối xứng không cần khoá', 'Không có khác biệt'], correctIndex: 0, explanation: 'Đối xứng: một khoá bí mật chung. Bất đối xứng: cặp khoá công khai + riêng.' },
  { id: 'q2', question: 'Hàm băm như SHA-256 chủ yếu bảo vệ tính chất nào?', options: ['Tính sẵn sàng', 'Tính toàn vẹn', 'Tốc độ mạng', 'Tính ẩn danh'], correctIndex: 1, explanation: 'Băm cho dấu vân tay nhạy thay đổi → phát hiện dữ liệu bị sửa (toàn vẹn).' },
  { id: 'q3', question: 'Cách lưu mật khẩu an toàn trong CSDL là?', options: ['Lưu dạng văn bản thô', 'Mã hoá AES rồi lưu khoá cạnh đó', 'Băm có salt riêng bằng bcrypt/argon2', 'Nén rồi lưu'], correctIndex: 2, explanation: 'Mật khẩu nên được băm một chiều kèm salt riêng, không bao giờ lưu thô.' },
]);

const c3 = doc('iao201c-3-1-authn-access', '3.1 — Authentication & access control|||3.1 — Xác thực & kiểm soát truy cập',
  'Xác thực (3 yếu tố: biết/có/là) vs phân quyền; MFA; mô hình kiểm soát truy cập DAC/MAC/RBAC; nguyên tắc tối thiểu quyền và cần-mới-biết.',
  [[
    `<span class="eyebrow">IAO201c · Chapter 3 · Lesson 3.1</span>
<h2>Authentication &amp; access control</h2>
<h3>Authentication vs authorization</h3>
<ul>
<li><strong>Authentication</strong> — proving <em>who you are</em> (login).</li>
<li><strong>Authorization</strong> — deciding <em>what you may do</em> once identified.</li>
</ul>
<h3>The three authentication factors</h3>
<pre><code>Something you KNOW  -> password, PIN
Something you HAVE  -> phone, security token, smart card
Something you ARE   -> fingerprint, face, iris (biometrics)

MFA = combine 2+ DIFFERENT factors (e.g. password + phone code)
</code></pre>
<p><strong>Multi-factor authentication (MFA)</strong> is the single highest-value defense against stolen passwords.</p>
<h3>Access control models</h3>
<ul>
<li><strong>DAC</strong> (Discretionary) — the owner grants access (e.g. file permissions).</li>
<li><strong>MAC</strong> (Mandatory) — a central policy/labels decide (used in high-security/military systems).</li>
<li><strong>RBAC</strong> (Role-Based) — permissions attach to roles, users get roles. Scales well — the common choice for business apps.</li>
</ul>
<div class="callout"><span class="badge">Least privilege</span> Give every user and process the <em>minimum</em> access needed for its job, and only for as long as needed (need-to-know). It shrinks the blast radius when an account is compromised.</div>`,
    `<span class="eyebrow">IAO201c · Chương 3 · Bài 3.1</span>
<h2>Xác thực &amp; kiểm soát truy cập</h2>
<h3>Xác thực vs phân quyền</h3>
<ul>
<li><strong>Xác thực (authentication)</strong> — chứng minh <em>bạn là ai</em> (đăng nhập).</li>
<li><strong>Phân quyền (authorization)</strong> — quyết định <em>bạn được làm gì</em> sau khi đã nhận diện.</li>
</ul>
<h3>Ba yếu tố xác thực</h3>
<pre><code>Thứ bạn BIẾT  -> mật khẩu, mã PIN
Thứ bạn CÓ    -> điện thoại, token, thẻ thông minh
Thứ bạn LÀ    -> vân tay, khuôn mặt, mống mắt (sinh trắc)

MFA = kết hợp từ 2 yếu tố KHÁC LOẠI (vd mật khẩu + mã trên điện thoại)
</code></pre>
<p><strong>Xác thực đa yếu tố (MFA)</strong> là biện pháp hiệu quả nhất chống lại việc mật khẩu bị đánh cắp.</p>
<h3>Các mô hình kiểm soát truy cập</h3>
<ul>
<li><strong>DAC</strong> (tuỳ ý) — chủ sở hữu cấp quyền (vd quyền tệp).</li>
<li><strong>MAC</strong> (bắt buộc) — chính sách/nhãn trung tâm quyết định (dùng trong hệ thống an ninh cao/quân sự).</li>
<li><strong>RBAC</strong> (theo vai trò) — quyền gắn vào vai trò, người dùng nhận vai trò. Dễ mở rộng — lựa chọn phổ biến cho ứng dụng doanh nghiệp.</li>
</ul>
<div class="callout"><span class="badge">Tối thiểu quyền</span> Cấp cho mỗi người dùng và tiến trình lượng quyền <em>tối thiểu</em> cần cho công việc, và chỉ trong thời gian cần (cần-mới-biết). Điều này thu nhỏ phạm vi thiệt hại khi một tài khoản bị chiếm.</div>`,
  ]]);

const c3q = quiz('iao201c-quiz-3', 'Quiz 3 — Authentication & access|||Quiz 3 — Xác thực & truy cập', [
  { id: 'q1', question: 'Phân biệt xác thực (authentication) và phân quyền (authorization)?', options: ['Xác thực = bạn được làm gì; phân quyền = bạn là ai', 'Xác thực = bạn là ai; phân quyền = bạn được làm gì', 'Hai từ đồng nghĩa', 'Cả hai chỉ nói về mật khẩu'], correctIndex: 1, explanation: 'Xác thực chứng minh danh tính; phân quyền quyết định quyền hạn sau đó.' },
  { id: 'q2', question: 'MFA (xác thực đa yếu tố) mạnh vì?', options: ['Dùng hai mật khẩu', 'Kết hợp từ 2 yếu tố KHÁC LOẠI (biết/có/là)', 'Mã hoá mật khẩu', 'Chặn mọi kết nối mạng'], correctIndex: 1, explanation: 'MFA cần nhiều loại bằng chứng khác nhau, nên lộ một yếu tố vẫn chưa đủ để vào.' },
  { id: 'q3', question: 'Mô hình gán quyền theo VAI TRÒ, người dùng nhận vai trò, dễ mở rộng cho doanh nghiệp là?', options: ['DAC', 'MAC', 'RBAC', 'MFA'], correctIndex: 2, explanation: 'RBAC gắn quyền vào vai trò và gán vai trò cho người dùng.' },
]);

const c4 = doc('iao201c-4-1-network-security', '4.1 — Basic network security|||4.1 — An ninh mạng cơ bản',
  'Firewall (lọc gói/stateful), IDS vs IPS (phát hiện vs chặn), VPN (kênh mã hoá), phân vùng mạng & DMZ; mô hình phòng thủ vành đai + nội bộ.',
  [[
    `<span class="eyebrow">IAO201c · Chapter 4 · Lesson 4.1</span>
<h2>Basic network security</h2>
<h3>Firewalls — the gatekeeper</h3>
<p>A <strong>firewall</strong> filters traffic against a rule set (allow/deny by IP, port, protocol). A <strong>stateful</strong> firewall also tracks connection state, allowing return traffic only for connections that were legitimately started.</p>
<h3>IDS vs IPS</h3>
<pre><code>IDS (Intrusion Detection System)  -> WATCHES and ALERTS on suspicious traffic
IPS (Intrusion Prevention System) -> sits inline and can BLOCK it in real time
Detection styles:
  Signature-based -> matches known attack patterns (misses new attacks)
  Anomaly-based   -> flags deviations from normal (more false positives)
</code></pre>
<h3>VPN — a private tunnel over a public network</h3>
<p>A <strong>VPN</strong> creates an <em>encrypted tunnel</em> across the internet, protecting confidentiality and integrity of traffic between two points (e.g. a remote worker and the office network).</p>
<h3>Segmentation &amp; the DMZ</h3>
<p>Split the network into zones. Public-facing servers (web, mail) go in a <strong>DMZ</strong> between two firewalls, so a compromise there does not directly reach the internal network.</p>
<div class="callout"><span class="badge">Perimeter is not enough</span> Firewalls guard the edge, but modern defense assumes attackers get inside. Combine perimeter controls with internal segmentation, monitoring and least privilege (zero-trust thinking).</div>`,
    `<span class="eyebrow">IAO201c · Chương 4 · Bài 4.1</span>
<h2>An ninh mạng cơ bản</h2>
<h3>Firewall — người gác cổng</h3>
<p>Một <strong>firewall</strong> lọc lưu lượng theo bộ luật (cho/chặn theo IP, cổng, giao thức). Firewall <strong>stateful</strong> còn theo dõi trạng thái kết nối, chỉ cho lưu lượng phản hồi của những kết nối được khởi tạo hợp lệ.</p>
<h3>IDS vs IPS</h3>
<pre><code>IDS (Hệ phát hiện xâm nhập)  -> QUAN SÁT và CẢNH BÁO lưu lượng đáng ngờ
IPS (Hệ ngăn xâm nhập)       -> nằm chặn giữa, CHẶN được ngay lập tức
Kiểu phát hiện:
  Theo chữ ký (signature) -> khớp mẫu tấn công đã biết (sót tấn công mới)
  Theo bất thường         -> báo lệch so với bình thường (nhiều báo giả hơn)
</code></pre>
<h3>VPN — đường hầm riêng qua mạng công cộng</h3>
<p>Một <strong>VPN</strong> tạo một <em>đường hầm mã hoá</em> qua internet, bảo vệ tính bí mật và toàn vẹn của lưu lượng giữa hai điểm (vd nhân viên làm từ xa và mạng công ty).</p>
<h3>Phân vùng mạng &amp; DMZ</h3>
<p>Chia mạng thành các vùng. Máy chủ hướng công cộng (web, mail) đặt trong <strong>DMZ</strong> giữa hai firewall, để nếu vùng đó bị chiếm cũng không chạm thẳng vào mạng nội bộ.</p>
<div class="callout"><span class="badge">Vành đai chưa đủ</span> Firewall canh biên, nhưng phòng thủ hiện đại giả định kẻ tấn công lọt vào trong. Hãy kết hợp kiểm soát vành đai với phân vùng nội bộ, giám sát và tối thiểu quyền (tư duy zero-trust).</div>`,
  ]]);

const c4q = quiz('iao201c-quiz-4', 'Quiz 4 — Network security|||Quiz 4 — An ninh mạng', [
  { id: 'q1', question: 'Khác nhau cốt lõi giữa IDS và IPS?', options: ['IDS chặn được, IPS chỉ cảnh báo', 'IDS chỉ phát hiện/cảnh báo; IPS nằm chặn giữa và có thể chặn ngay', 'Cả hai đều là firewall', 'IDS là VPN'], correctIndex: 1, explanation: 'IDS quan sát và cảnh báo; IPS nằm inline và chặn được lưu lượng độc.' },
  { id: 'q2', question: 'Chức năng chính của VPN là?', options: ['Tăng tốc độ mạng', 'Tạo đường hầm mã hoá qua mạng công cộng', 'Quét virus', 'Sao lưu dữ liệu'], correctIndex: 1, explanation: 'VPN mã hoá lưu lượng trong một đường hầm giữa hai điểm qua internet.' },
  { id: 'q3', question: 'Đặt máy chủ web hướng công cộng vào DMZ nhằm?', options: ['Tăng băng thông', 'Cách ly để nếu bị chiếm cũng không chạm thẳng mạng nội bộ', 'Tắt firewall', 'Bỏ mã hoá'], correctIndex: 1, explanation: 'DMZ là vùng đệm giữa hai firewall, giới hạn thiệt hại lan vào trong.' },
]);

const c5 = doc('iao201c-5-1-malware-attacks', '5.1 — Malware & common attacks (defense)|||5.1 — Mã phần mềm độc hại & tấn công phổ biến (phòng thủ)',
  'Các loại mã độc (virus, worm, trojan, ransomware, spyware); tấn công phổ biến (phishing, social engineering, DoS/DDoS, MITM, brute-force); cách phòng thủ.',
  [[
    `<span class="eyebrow">IAO201c · Chapter 5 · Lesson 5.1</span>
<h2>Malware &amp; common attacks — how to defend</h2>
<p class="lead">We study these <strong>only to defend against them</strong>. Knowing the pattern lets you recognise and block it.</p>
<h3>Malware families</h3>
<pre><code>Virus       -> attaches to a file, spreads when the file runs
Worm        -> self-replicates across a network, no user action
Trojan      -> disguised as useful software, hides a payload
Ransomware  -> encrypts your files, demands payment
Spyware     -> secretly collects information (keystrokes, data)
</code></pre>
<h3>Common attacks</h3>
<ul>
<li><strong>Phishing / social engineering</strong> — trick a person into revealing secrets or clicking. Targets people, not code.</li>
<li><strong>DoS / DDoS</strong> — flood a service so it becomes unavailable (attacks <em>availability</em>).</li>
<li><strong>Man-in-the-middle (MITM)</strong> — intercept traffic between two parties.</li>
<li><strong>Brute-force / credential stuffing</strong> — guess or reuse leaked passwords.</li>
</ul>
<h3>Defenses that cover most of these</h3>
<div class="callout"><span class="badge">Practical defenses</span>
<ul>
<li>Patch and update — closes the holes worms and exploits use.</li>
<li>Anti-malware + email filtering — catches known payloads and phishing.</li>
<li>Backups (offline copies) — the real cure for ransomware.</li>
<li>MFA + strong unique passwords — kills brute-force and credential stuffing.</li>
<li>HTTPS/TLS everywhere — defeats most MITM.</li>
<li>Security awareness training — the fix for social engineering.</li>
</ul></div>`,
    `<span class="eyebrow">IAO201c · Chương 5 · Bài 5.1</span>
<h2>Mã độc &amp; tấn công phổ biến — cách phòng thủ</h2>
<p class="lead">Ta tìm hiểu những điều này <strong>chỉ để phòng thủ</strong>. Biết mẫu hành vi giúp bạn nhận ra và chặn nó.</p>
<h3>Các họ mã độc</h3>
<pre><code>Virus       -> bám vào tệp, lây khi tệp chạy
Worm (sâu)  -> tự nhân bản qua mạng, không cần người dùng thao tác
Trojan      -> giả dạng phần mềm hữu ích, giấu payload bên trong
Ransomware  -> mã hoá tệp của bạn, đòi tiền chuộc
Spyware     -> lén thu thập thông tin (phím gõ, dữ liệu)
</code></pre>
<h3>Tấn công phổ biến</h3>
<ul>
<li><strong>Phishing / tấn công phi kỹ thuật (social engineering)</strong> — lừa con người tiết lộ bí mật hoặc bấm vào. Nhắm vào người, không phải mã.</li>
<li><strong>DoS / DDoS</strong> — làm ngập dịch vụ khiến nó ngừng phục vụ (đánh vào tính <em>sẵn sàng</em>).</li>
<li><strong>Người-đứng-giữa (MITM)</strong> — chặn bắt lưu lượng giữa hai bên.</li>
<li><strong>Dò mật khẩu / nhồi thông tin đăng nhập</strong> — đoán hoặc dùng lại mật khẩu bị lộ.</li>
</ul>
<h3>Biện pháp phòng thủ bao phủ phần lớn</h3>
<div class="callout"><span class="badge">Phòng thủ thực dụng</span>
<ul>
<li>Vá và cập nhật — bịt lỗ mà sâu và mã khai thác lợi dụng.</li>
<li>Anti-malware + lọc email — bắt payload đã biết và phishing.</li>
<li>Sao lưu (bản offline) — thuốc chữa thật sự cho ransomware.</li>
<li>MFA + mật khẩu mạnh, không trùng — chặn dò và nhồi mật khẩu.</li>
<li>HTTPS/TLS ở mọi nơi — vô hiệu phần lớn MITM.</li>
<li>Đào tạo nhận thức an toàn — cách chữa cho tấn công phi kỹ thuật.</li>
</ul></div>`,
  ]]);

const c5q = quiz('iao201c-quiz-5', 'Quiz 5 — Malware & attacks|||Quiz 5 — Mã độc & tấn công', [
  { id: 'q1', question: 'Loại mã độc TỰ nhân bản lan qua mạng mà không cần người dùng thao tác là?', options: ['Virus', 'Worm (sâu)', 'Trojan', 'Spyware'], correctIndex: 1, explanation: 'Worm tự lây lan qua mạng; virus cần tệp/hành động để lây.' },
  { id: 'q2', question: 'Biện pháp phòng thủ HIỆU QUẢ NHẤT chống ransomware là?', options: ['Đổi mật khẩu thường xuyên', 'Sao lưu dữ liệu ở bản offline', 'Tắt firewall', 'Dùng mạng công cộng'], correctIndex: 1, explanation: 'Có bản sao lưu offline giúp khôi phục mà không phải trả tiền chuộc.' },
  { id: 'q3', question: 'Tấn công DoS/DDoS chủ yếu phá hoại tính chất nào của CIA?', options: ['Bí mật', 'Toàn vẹn', 'Sẵn sàng', 'Không phá tính chất nào'], correctIndex: 2, explanation: 'DoS/DDoS làm ngập dịch vụ khiến nó không sẵn sàng phục vụ.' },
]);

const c6 = doc('iao201c-6-1-appsec-owasp', '6.1 — Application security & OWASP Top 10|||6.1 — An toàn ứng dụng & OWASP Top 10',
  'Vì sao ứng dụng web là bề mặt tấn công lớn; OWASP Top 10 (injection, broken access control, XSS...); nguyên tắc: không tin dữ liệu người dùng, validate & escape.',
  [[
    `<span class="eyebrow">IAO201c · Chapter 6 · Lesson 6.1</span>
<h2>Application security &amp; OWASP Top 10</h2>
<p>Most breaches today hit the <strong>application layer</strong>. The <strong>OWASP Top 10</strong> is the community's list of the most critical web application security risks — a checklist to build against.</p>
<h3>Selected OWASP Top 10 risks</h3>
<pre><code>Broken Access Control -> user reaches data/actions they shouldn't
Injection (SQLi)      -> untrusted input executed as a query/command
XSS                   -> attacker script runs in a victim's browser
Cryptographic Failures-> weak/missing encryption of sensitive data
Security Misconfig    -> default passwords, verbose errors, open buckets
Vulnerable Components -> outdated libraries with known CVEs
</code></pre>
<h3>The one rule behind most of them</h3>
<p><strong>Never trust input from the client.</strong> Validate on the server, use <em>parameterised queries</em> (defeats SQL injection), <em>escape/encode output</em> (defeats XSS), and enforce access control on the <em>server</em>, not just by hiding buttons in the UI.</p>
<div class="callout"><span class="badge">Build it in</span> Security is cheapest when designed in from the start ("shift left"): threat-model early, use safe framework defaults, keep dependencies patched, and add automated security tests to CI.</div>`,
    `<span class="eyebrow">IAO201c · Chương 6 · Bài 6.1</span>
<h2>An toàn ứng dụng &amp; OWASP Top 10</h2>
<p>Phần lớn vụ vi phạm ngày nay đánh vào <strong>tầng ứng dụng</strong>. <strong>OWASP Top 10</strong> là danh sách các rủi ro an toàn ứng dụng web nghiêm trọng nhất do cộng đồng tổng hợp — một checklist để xây dựng theo.</p>
<h3>Một số rủi ro trong OWASP Top 10</h3>
<pre><code>Kiểm soát truy cập hỏng -> người dùng chạm tới dữ liệu/hành động cấm
Injection (SQLi)        -> dữ liệu không tin cậy bị chạy như câu truy vấn/lệnh
XSS                     -> script kẻ tấn công chạy trong trình duyệt nạn nhân
Lỗi mã hoá              -> dữ liệu nhạy cảm mã hoá yếu hoặc không mã hoá
Cấu hình sai            -> mật khẩu mặc định, lỗi lộ chi tiết, bucket mở
Thành phần lỗi thời     -> thư viện cũ dính CVE đã biết
</code></pre>
<h3>Một quy tắc đứng sau phần lớn chúng</h3>
<p><strong>Đừng bao giờ tin dữ liệu từ phía client.</strong> Hãy kiểm tra ở phía máy chủ, dùng <em>truy vấn tham số hoá</em> (chặn SQL injection), <em>escape/encode dữ liệu xuất ra</em> (chặn XSS), và ép kiểm soát truy cập ở <em>máy chủ</em>, không chỉ bằng cách ẩn nút trên giao diện.</p>
<div class="callout"><span class="badge">Xây từ đầu</span> An toàn rẻ nhất khi thiết kế ngay từ đầu ("shift left"): mô hình hoá đe doạ sớm, dùng thiết lập an toàn mặc định của framework, giữ thư viện được vá, và thêm kiểm thử an toàn tự động vào CI.</div>`,
  ]]);

const c6q = quiz('iao201c-quiz-6', 'Quiz 6 — AppSec & OWASP|||Quiz 6 — An toàn ứng dụng & OWASP', [
  { id: 'q1', question: 'Cách phòng thủ chuẩn chống SQL injection là?', options: ['Ẩn ô nhập trên giao diện', 'Dùng truy vấn tham số hoá (parameterised query)', 'Đổi tên bảng CSDL', 'Tắt log'], correctIndex: 1, explanation: 'Truy vấn tham số hoá tách dữ liệu khỏi câu lệnh nên input không bị chạy như SQL.' },
  { id: 'q2', question: 'OWASP Top 10 là gì?', options: ['Bộ 10 thuật toán mã hoá', 'Danh sách 10 rủi ro an toàn ứng dụng web nghiêm trọng nhất', '10 loại firewall', '10 mật khẩu phổ biến'], correctIndex: 1, explanation: 'OWASP Top 10 liệt kê các rủi ro bảo mật web quan trọng nhất để phòng thủ theo.' },
  { id: 'q3', question: 'Nguyên tắc nền tảng đứng sau phần lớn lỗ hổng ứng dụng web?', options: ['Luôn tin dữ liệu từ client', 'Không bao giờ tin dữ liệu người dùng, phải validate & escape ở server', 'Chỉ kiểm tra ở phía trình duyệt', 'Ẩn nút là đủ an toàn'], correctIndex: 1, explanation: 'Dữ liệu client không đáng tin; phải kiểm tra và escape ở máy chủ.' },
]);

const c7 = doc('iao201c-7-1-risk-policy', '7.1 — Risk management & security policy|||7.1 — Quản lý rủi ro & chính sách bảo mật',
  'Quy trình quản lý rủi ro (nhận diện → đánh giá → xử lý → giám sát); bốn cách xử lý rủi ro; chính sách bảo mật; ISO 27001 & ISMS.',
  [[
    `<span class="eyebrow">IAO201c · Chapter 7 · Lesson 7.1</span>
<h2>Risk management &amp; security policy</h2>
<h3>The risk management cycle</h3>
<pre><code>1. Identify   -> list assets, threats, vulnerabilities
2. Assess     -> estimate likelihood x impact -> prioritise
3. Treat      -> choose a response for each risk (below)
4. Monitor    -> review continuously; risks and systems change
</code></pre>
<h3>Four ways to treat a risk</h3>
<ul>
<li><strong>Mitigate / reduce</strong> — add controls to lower likelihood or impact.</li>
<li><strong>Transfer</strong> — shift it to someone else (insurance, outsourcing).</li>
<li><strong>Avoid</strong> — stop doing the risky activity.</li>
<li><strong>Accept</strong> — knowingly live with a small residual risk.</li>
</ul>
<h3>Security policy &amp; ISMS</h3>
<p>A <strong>security policy</strong> is management's written statement of rules and responsibilities (acceptable use, access, passwords, data handling). <strong>ISO/IEC 27001</strong> defines an <strong>Information Security Management System (ISMS)</strong> — a repeatable, auditable framework to manage security risk across the whole organisation.</p>
<div class="callout"><span class="badge">People &amp; process, not just tech</span> Technology alone does not make you secure. Policies, training, roles and regular review turn controls into a working program — and satisfy standards like ISO 27001.</div>`,
    `<span class="eyebrow">IAO201c · Chương 7 · Bài 7.1</span>
<h2>Quản lý rủi ro &amp; chính sách bảo mật</h2>
<h3>Vòng quản lý rủi ro</h3>
<pre><code>1. Nhận diện  -> liệt kê tài sản, mối đe doạ, lỗ hổng
2. Đánh giá   -> ước lượng khả năng x tác động -> xếp ưu tiên
3. Xử lý      -> chọn cách ứng phó cho từng rủi ro (bên dưới)
4. Giám sát   -> rà soát liên tục; rủi ro và hệ thống luôn đổi
</code></pre>
<h3>Bốn cách xử lý rủi ro</h3>
<ul>
<li><strong>Giảm thiểu</strong> — thêm biện pháp để hạ khả năng xảy ra hoặc tác động.</li>
<li><strong>Chuyển giao</strong> — đẩy cho bên khác (mua bảo hiểm, thuê ngoài).</li>
<li><strong>Tránh</strong> — ngừng thực hiện hoạt động nhiều rủi ro.</li>
<li><strong>Chấp nhận</strong> — chủ động chấp nhận một phần rủi ro nhỏ còn lại.</li>
</ul>
<h3>Chính sách bảo mật &amp; ISMS</h3>
<p>Một <strong>chính sách bảo mật</strong> là văn bản của ban quản lý quy định luật lệ và trách nhiệm (sử dụng hợp lý, truy cập, mật khẩu, xử lý dữ liệu). <strong>ISO/IEC 27001</strong> định nghĩa một <strong>Hệ thống quản lý an toàn thông tin (ISMS)</strong> — khung lặp lại và kiểm toán được để quản lý rủi ro an toàn trên toàn tổ chức.</p>
<div class="callout"><span class="badge">Con người &amp; quy trình, không chỉ công nghệ</span> Chỉ công nghệ không làm bạn an toàn. Chính sách, đào tạo, vai trò và rà soát định kỳ biến các biện pháp thành một chương trình vận hành được — và đáp ứng chuẩn như ISO 27001.</div>`,
  ]]);

const c7q = quiz('iao201c-quiz-7', 'Quiz 7 — Risk & policy|||Quiz 7 — Rủi ro & chính sách', [
  { id: 'q1', question: 'Mua bảo hiểm mạng để bù thiệt hại là cách xử lý rủi ro nào?', options: ['Giảm thiểu', 'Chuyển giao', 'Tránh', 'Chấp nhận'], correctIndex: 1, explanation: 'Chuyển giao rủi ro = đẩy gánh nặng tài chính sang bên khác, vd bảo hiểm/thuê ngoài.' },
  { id: 'q2', question: 'Chuẩn quốc tế định nghĩa Hệ thống quản lý an toàn thông tin (ISMS) là?', options: ['OWASP Top 10', 'ISO/IEC 27001', 'RSA', 'HTTPS'], correctIndex: 1, explanation: 'ISO/IEC 27001 là chuẩn cho ISMS — khung quản lý rủi ro an toàn thông tin.' },
  { id: 'q3', question: 'Thứ tự đúng của vòng quản lý rủi ro?', options: ['Xử lý → nhận diện → giám sát → đánh giá', 'Nhận diện → đánh giá → xử lý → giám sát', 'Giám sát → xử lý → nhận diện → đánh giá', 'Đánh giá → tránh → nhận diện → chấp nhận'], correctIndex: 1, explanation: 'Chu trình: nhận diện tài sản/đe doạ → đánh giá → chọn cách xử lý → giám sát liên tục.' },
]);

const c8 = doc('iao201c-8-1-law-ethics-ir', '8.1 — Law, ethics & incident response|||8.1 — Pháp lý, đạo đức & ứng phó sự cố',
  'Khung pháp lý & quyền riêng tư (Luật ANM VN, GDPR); đạo đức nghề & tấn công có phép (authorised testing); vòng ứng phó sự cố; sao lưu & khôi phục.',
  [[
    `<span class="eyebrow">IAO201c · Chapter 8 · Lesson 8.1</span>
<h2>Law, ethics &amp; incident response</h2>
<h3>Law &amp; privacy</h3>
<p>Security work is bound by law. Data-protection and cybersecurity laws (Vietnam's <strong>Cybersecurity Law</strong> and Personal Data Protection rules; the EU's <strong>GDPR</strong>) impose duties to protect personal data, and often to <strong>report breaches</strong> within a deadline. Unauthorised access to a system is a crime — even "just looking".</p>
<h3>Ethics — the defender's line</h3>
<p>Testing is only legal and ethical with <strong>explicit written permission</strong> (a signed scope). Study attacks to defend, protect the privacy of any data you touch, and disclose vulnerabilities responsibly. This is the core of professional codes (e.g. (ISC)² Code of Ethics).</p>
<h3>Incident response (IR) lifecycle</h3>
<pre><code>Preparation   -> plans, contacts, backups, tools ready BEFORE trouble
Identification-> detect and confirm an incident is real
Containment   -> stop the bleeding; isolate affected systems
Eradication   -> remove the cause (malware, bad accounts)
Recovery      -> restore from clean backups, verify, monitor
Lessons       -> post-incident review; fix root cause
</code></pre>
<div class="callout"><span class="badge">Backups close the loop</span> Reliable, tested, offline backups are what turn a disaster into an inconvenience — the last line for both ransomware and recovery. Prepare and rehearse before you need them.</div>`,
    `<span class="eyebrow">IAO201c · Chương 8 · Bài 8.1</span>
<h2>Pháp lý, đạo đức &amp; ứng phó sự cố</h2>
<h3>Pháp lý &amp; quyền riêng tư</h3>
<p>Công việc an toàn bị ràng buộc bởi luật. Các luật bảo vệ dữ liệu và an ninh mạng (<strong>Luật An ninh mạng</strong> và quy định bảo vệ dữ liệu cá nhân của Việt Nam; <strong>GDPR</strong> của EU) đặt ra nghĩa vụ bảo vệ dữ liệu cá nhân, và thường phải <strong>báo cáo sự cố lộ dữ liệu</strong> trong thời hạn quy định. Truy cập trái phép vào hệ thống là hành vi phạm pháp — kể cả chỉ "xem thử".</p>
<h3>Đạo đức — lằn ranh của người phòng thủ</h3>
<p>Kiểm thử chỉ hợp pháp và có đạo đức khi có <strong>sự cho phép bằng văn bản rõ ràng</strong> (phạm vi đã ký). Học tấn công để phòng thủ, bảo vệ quyền riêng tư của mọi dữ liệu bạn chạm tới, và công bố lỗ hổng một cách có trách nhiệm. Đây là cốt lõi của các bộ quy tắc nghề (vd Bộ quy tắc đạo đức (ISC)²).</p>
<h3>Vòng ứng phó sự cố (IR)</h3>
<pre><code>Chuẩn bị     -> kế hoạch, liên hệ, sao lưu, công cụ sẵn TRƯỚC khi có sự cố
Nhận diện    -> phát hiện và xác nhận sự cố là thật
Cô lập        -> chặn lan; cách ly hệ thống bị ảnh hưởng
Loại bỏ       -> gỡ nguyên nhân (mã độc, tài khoản xấu)
Khôi phục    -> phục hồi từ bản sao lưu sạch, kiểm tra, giám sát
Bài học       -> rà soát sau sự cố; sửa tận gốc nguyên nhân
</code></pre>
<div class="callout"><span class="badge">Sao lưu khép vòng</span> Bản sao lưu đáng tin, đã kiểm thử, để offline là thứ biến thảm hoạ thành phiền toái — lằn cuối cho cả ransomware lẫn khôi phục. Hãy chuẩn bị và diễn tập trước khi cần đến.</div>`,
  ]]);

const c8q = quiz('iao201c-quiz-8', 'Quiz 8 — Law, ethics & IR|||Quiz 8 — Pháp lý, đạo đức & ứng phó', [
  { id: 'q1', question: 'Điều kiện để kiểm thử an ninh (security testing) là hợp pháp và có đạo đức?', options: ['Chỉ cần mục đích tốt', 'Có sự cho phép bằng văn bản rõ ràng, đúng phạm vi đã thoả thuận', 'Hệ thống công khai thì được thử tự do', 'Không cần điều kiện gì'], correctIndex: 1, explanation: 'Kiểm thử phải có phép bằng văn bản, đúng phạm vi; truy cập trái phép là phạm pháp.' },
  { id: 'q2', question: 'Trong vòng ứng phó sự cố, bước "cô lập (containment)" nhằm?', options: ['Xoá toàn bộ dữ liệu', 'Chặn sự cố lan rộng bằng cách cách ly hệ thống bị ảnh hưởng', 'Báo cáo cho báo chí', 'Tắt vĩnh viễn hệ thống'], correctIndex: 1, explanation: 'Cô lập ngăn thiệt hại lan sang phần còn lại trong khi tìm cách loại bỏ nguyên nhân.' },
  { id: 'q3', question: 'Yếu tố nào biến một thảm hoạ (vd ransomware) thành phiền toái nhỏ?', options: ['Đổi mật khẩu wifi', 'Bản sao lưu offline đáng tin và đã được kiểm thử', 'Xoá log hệ thống', 'Trả tiền chuộc ngay'], correctIndex: 1, explanation: 'Sao lưu sạch, offline, đã kiểm thử cho phép khôi phục mà không lệ thuộc kẻ tấn công.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'IAO201c',
    slug: 'iao201c-introduction-to-information-assurance',
    title: 'Introduction to Information Assurance',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/IAO201c.webp',
    shortDescription: 'Foundations of information assurance — CIA triad, threats & risk, cryptography, authentication & access control, network defense, malware, OWASP Top 10, risk management, law, ethics & incident response. Bilingual, defensive, with quizzes.|||Nền tảng đảm bảo an toàn thông tin — bộ ba CIA, mối đe doạ & rủi ro, mã hoá, xác thực & kiểm soát truy cập, phòng thủ mạng, mã độc, OWASP Top 10, quản lý rủi ro, pháp lý, đạo đức & ứng phó sự cố. Song ngữ, hướng phòng thủ, có quiz.',
    description: 'Môn <strong>IAO201c — Introduction to Information Assurance</strong> (Nhập môn Đảm bảo an toàn thông tin, kỳ 5) xây nền <strong>phòng thủ</strong> để bảo vệ thông tin và hệ thống. Từ <strong>khái niệm cốt lõi</strong> (bộ ba CIA, đe doạ/lỗ hổng/rủi ro) → <strong>mã hoá</strong> (đối xứng/bất đối xứng, băm) → <strong>xác thực &amp; kiểm soát truy cập</strong> → <strong>an ninh mạng</strong> (firewall/IDS/VPN) → <strong>mã độc &amp; tấn công phổ biến</strong> → <strong>an toàn ứng dụng &amp; OWASP Top 10</strong> → <strong>quản lý rủi ro &amp; chính sách</strong> → <strong>pháp lý, đạo đức &amp; ứng phó sự cố</strong>. Bám giáo trình Whitman/Mattord, Stallings, NIST SP 800-12, ISO 27001; song ngữ, có ví dụ và quiz mỗi chương.',
    whatYouLearn: 'Bộ ba CIA và AAA; phân biệt tài sản/đe doạ/lỗ hổng/rủi ro; mã hoá đối xứng vs bất đối xứng, hàm băm, chữ ký số; xác thực đa yếu tố &amp; mô hình DAC/MAC/RBAC; firewall, IDS/IPS, VPN, DMZ; nhận diện mã độc &amp; tấn công phổ biến và cách phòng; OWASP Top 10 và an toàn ứng dụng; vòng quản lý rủi ro &amp; ISO 27001; pháp lý, đạo đức nghề và vòng ứng phó sự cố.',
    requirements: 'Kiến thức máy tính &amp; mạng cơ bản (địa chỉ IP, HTTP). Không cần lập trình nâng cao. Định hướng phòng thủ, không thực hiện tấn công thật.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn, NIST/OWASP, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Đảm bảo an toàn thông tin, bộ ba CIA, tư duy phòng thủ.', lessons: [intro] },
    { title: 'Chương 1 — CIA & rủi ro|||Chapter 1 — CIA & risk', description: 'CIA, đe doạ, lỗ hổng, rủi ro, phòng thủ theo lớp.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Mã hoá cơ bản|||Chapter 2 — Cryptography', description: 'Đối xứng/bất đối xứng, băm, chữ ký số.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Xác thực & truy cập|||Chapter 3 — Auth & access control', description: 'MFA, DAC/MAC/RBAC, tối thiểu quyền.', lessons: [c3, c3q] },
    { title: 'Chương 4 — An ninh mạng|||Chapter 4 — Network security', description: 'Firewall, IDS/IPS, VPN, DMZ.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Mã độc & tấn công|||Chapter 5 — Malware & attacks', description: 'Virus/worm/ransomware, phishing, DoS; phòng thủ.', lessons: [c5, c5q] },
    { title: 'Chương 6 — An toàn ứng dụng & OWASP|||Chapter 6 — AppSec & OWASP', description: 'OWASP Top 10, injection, XSS, không tin dữ liệu client.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Quản lý rủi ro & chính sách|||Chapter 7 — Risk & policy', description: 'Vòng rủi ro, 4 cách xử lý, chính sách, ISO 27001.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Pháp lý, đạo đức & ứng phó|||Chapter 8 — Law, ethics & IR', description: 'Luật ANM/GDPR, đạo đức, vòng ứng phó sự cố, sao lưu.', lessons: [c8, c8q] },
  ],
};
