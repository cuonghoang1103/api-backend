/**
 * CRY303c — Applied Cryptography (Mật mã ứng dụng). Ngành IT FPTU, Kỳ 5.
 * KHUNG bám giáo trình FLM (sylID 12624): nguồn chính = Coursera "Applied
 * Cryptography" Specialization (University of Colorado — Sang-Yoon Chang) +
 * "Understanding Cryptography" (Paar & Pelzl). Python (cryptography /
 * PyCryptodome). Tiên quyết MAD101. 4 CLO · 4 module.
 * Mức KHUNG: đủ outline module/bài + quiz + Tài liệu; đào sâu sau.
 * Giữ NGUYÊN slug/semester/courseCode/thumbnailUrl. ⚠️ KHÔNG backtick lồng,
 * KHÔNG ${ } trong HTML, & → &amp;, code trong <pre><code class="language-python">.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức module.', quiz: { timeLimitSeconds: 480, questions } });

// ── 📚 Tài liệu tham khảo ────────────────────────────────────────────────────
const taiLieu = doc('cry303c-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: Coursera Applied Cryptography Specialization, sách (Paar, Ferguson/Schneier), cryptopals, công cụ Python & OpenSSL, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">CRY303c · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Applied Cryptography</strong> — information theory, symmetric &amp; asymmetric ciphers, key management and integrity protection — in one place. The official FPTU slides &amp; syllabus live on <strong>FLM</strong>; the primary MOOC is the Coursera specialization below.</p>
<h3>🎓 Primary MOOC (required)</h3>
<ul>
<li><a href="https://www.coursera.org/specializations/applied-crypto" target="_blank" rel="noopener">Coursera — Applied Cryptography Specialization</a> (University of Colorado, Sang-Yoon Chang). Completing it makes you eligible to sit the exam and earns <strong>+1 bonus point</strong>.</li>
</ul>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.cryptography-textbook.com/" target="_blank" rel="noopener"><em>Understanding Cryptography</em> — Christof Paar &amp; Jan Pelzl</a> (free slides &amp; video lectures)</li>
<li><a href="https://www.schneier.com/books/cryptography-engineering/" target="_blank" rel="noopener"><em>Cryptography Engineering</em> — Ferguson, Schneier &amp; Kohno</a></li>
</ul>
<h3>🌐 Practice &amp; free documentation</h3>
<ul>
<li><a href="https://cryptopals.com/" target="_blank" rel="noopener">The Cryptopals Crypto Challenges</a> — learn by breaking real crypto</li>
<li><a href="https://cryptography.io/" target="_blank" rel="noopener">Python <code>cryptography</code> library docs</a></li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://cryptography.io/" target="_blank" rel="noopener">pyca/cryptography</a> — high-level recipes (AES-GCM, RSA, HMAC)</li>
<li><a href="https://pycryptodome.readthedocs.io/" target="_blank" rel="noopener">PyCryptodome</a> — low-level primitives for study</li>
<li><a href="https://www.openssl.org/" target="_blank" rel="noopener">OpenSSL</a> — keys, certificates &amp; a command-line crypto toolkit</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — terminology, Kerckhoffs' principle, entropy, modular arithmetic (MAD101 review).</li>
<li><strong>Symmetric</strong> — classical ciphers, DES/3DES, AES; encrypt/decrypt in Python.</li>
<li><strong>Asymmetric</strong> — RSA, Diffie-Hellman, certificates &amp; PKI.</li>
<li><strong>Integrity</strong> — hash functions, MACs, digital signatures; wire it together in a small demo.</li>
</ol></div>`,
    `<span class="eyebrow">CRY303c · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Mật mã ứng dụng</strong> — lý thuyết thông tin, mã đối xứng &amp; bất đối xứng, quản lý khoá và bảo vệ toàn vẹn — gom về một chỗ. Slide &amp; syllabus chính thức của FPTU nằm trên <strong>FLM</strong>; MOOC chính là chuyên đề Coursera bên dưới.</p>
<h3>🎓 MOOC chính (bắt buộc)</h3>
<ul>
<li><a href="https://www.coursera.org/specializations/applied-crypto" target="_blank" rel="noopener">Coursera — Applied Cryptography Specialization</a> (University of Colorado, Sang-Yoon Chang). Hoàn thành chuyên đề này là điều kiện đủ để dự thi và được <strong>+1 điểm thưởng</strong>.</li>
</ul>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.cryptography-textbook.com/" target="_blank" rel="noopener"><em>Understanding Cryptography</em> — Christof Paar &amp; Jan Pelzl</a> (slide &amp; video bài giảng miễn phí)</li>
<li><a href="https://www.schneier.com/books/cryptography-engineering/" target="_blank" rel="noopener"><em>Cryptography Engineering</em> — Ferguson, Schneier &amp; Kohno</a></li>
</ul>
<h3>🌐 Luyện tập &amp; tài liệu miễn phí</h3>
<ul>
<li><a href="https://cryptopals.com/" target="_blank" rel="noopener">Cryptopals Crypto Challenges</a> — học bằng cách phá mã thật</li>
<li><a href="https://cryptography.io/" target="_blank" rel="noopener">Tài liệu thư viện <code>cryptography</code> của Python</a></li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://cryptography.io/" target="_blank" rel="noopener">pyca/cryptography</a> — API mức cao (AES-GCM, RSA, HMAC)</li>
<li><a href="https://pycryptodome.readthedocs.io/" target="_blank" rel="noopener">PyCryptodome</a> — primitive mức thấp để học</li>
<li><a href="https://www.openssl.org/" target="_blank" rel="noopener">OpenSSL</a> — khoá, chứng chỉ &amp; bộ công cụ mật mã dòng lệnh</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — thuật ngữ, nguyên lý Kerckhoff, entropy, số học modular (ôn MAD101).</li>
<li><strong>Đối xứng</strong> — mã cổ điển, DES/3DES, AES; mã hoá/giải mã bằng Python.</li>
<li><strong>Bất đối xứng</strong> — RSA, Diffie-Hellman, chứng chỉ &amp; PKI.</li>
<li><strong>Toàn vẹn</strong> — hàm băm, MAC, chữ ký số; ráp lại thành một demo nhỏ.</li>
</ol></div>`,
  ]]);

// ── Giới thiệu môn học ───────────────────────────────────────────────────────
const intro = doc('cry303c-0-1-overview', 'Course overview: Applied Cryptography|||Tổng quan: Mật mã ứng dụng',
  'Mật mã ứng dụng là gì; 4 CLO; cơ cấu điểm (Practical 50% · Theory 50%, hoàn thành MOOC Coursera + 1 điểm thưởng); tiên quyết MAD101.',
  [[
    `<span class="eyebrow">CRY303c · Lesson 0.1 · Overview</span>
<h2>Applied Cryptography</h2>
<p class="lead"><strong>Cryptography</strong> is the science of protecting information: keeping it <em>confidential</em>, detecting whether it was <em>tampered with</em>, proving <em>who</em> sent it. This course teaches the building blocks — ciphers, key exchange, hashes and signatures — and how to use them correctly in Python with the <code>cryptography</code> library.</p>
<h3>Four course learning outcomes (CLO)</h3>
<ul>
<li><strong>CLO1</strong> — Explain cryptography &amp; information theory: terminology, Kerckhoffs' principle, entropy, attacks; review the number theory behind modern crypto.</li>
<li><strong>CLO2</strong> — Apply symmetric cryptography: classical ciphers, DES/3DES and AES; block vs stream ciphers.</li>
<li><strong>CLO3</strong> — Apply asymmetric cryptography &amp; key management: RSA, Diffie-Hellman, certificates and PKI.</li>
<li><strong>CLO4</strong> — Apply cryptographic hashing &amp; integrity protection: hash functions, MACs and digital signatures.</li>
</ul>
<h3>Assessment</h3>
<ul>
<li><strong>Practical Exam — 50%</strong></li>
<li><strong>Theory Exam — 50%</strong></li>
<li>Completing the Coursera MOOC is required to be eligible to sit the exam and earns <strong>+1 bonus point</strong>.</li>
</ul>
<h3>Prerequisite</h3>
<p><strong>MAD101</strong> (Discrete Mathematics) — you should be comfortable with modular arithmetic, primes, GCD and the extended Euclidean algorithm.</p>`,
    `<span class="eyebrow">CRY303c · Bài 0.1 · Tổng quan</span>
<h2>Mật mã ứng dụng</h2>
<p class="lead"><strong>Mật mã học</strong> là khoa học bảo vệ thông tin: giữ <em>bí mật</em>, phát hiện <em>bị sửa</em>, chứng minh <em>ai</em> đã gửi. Môn này dạy các khối nền — mã hoá, trao đổi khoá, hàm băm và chữ ký — và cách dùng đúng trong Python với thư viện <code>cryptography</code>.</p>
<h3>Bốn chuẩn đầu ra (CLO)</h3>
<ul>
<li><strong>CLO1</strong> — Giải thích mật mã &amp; lý thuyết thông tin: thuật ngữ, nguyên lý Kerckhoff, entropy, tấn công; ôn lại số học nền của mật mã hiện đại.</li>
<li><strong>CLO2</strong> — Áp dụng mật mã đối xứng: mã cổ điển, DES/3DES và AES; block so với stream.</li>
<li><strong>CLO3</strong> — Áp dụng mật mã bất đối xứng &amp; quản lý khoá: RSA, Diffie-Hellman, chứng chỉ và PKI.</li>
<li><strong>CLO4</strong> — Áp dụng băm mật mã &amp; bảo vệ toàn vẹn: hàm băm, MAC và chữ ký số.</li>
</ul>
<h3>Cơ cấu điểm</h3>
<ul>
<li><strong>Practical Exam (thi thực hành) — 50%</strong></li>
<li><strong>Theory Exam (thi lý thuyết) — 50%</strong></li>
<li>Hoàn thành MOOC Coursera là điều kiện đủ để dự thi và được <strong>+1 điểm thưởng</strong>.</li>
</ul>
<h3>Điều kiện tiên quyết</h3>
<p><strong>MAD101</strong> (Toán rời rạc) — cần thành thạo số học modular, số nguyên tố, ước chung lớn nhất (GCD) và thuật toán Euclid mở rộng.</p>`,
  ]]);

// ── Module 1 — Cryptography & Information Theory (CLO1) ───────────────────────
const m1 = doc('cry303c-1-1-info-theory', '1.1 — Cryptography & information theory|||1.1 — Mật mã & lý thuyết thông tin',
  'Thuật ngữ (plaintext/ciphertext/key), nguyên lý Kerckhoff, deterministic vs random, entropy; tấn công (brute force, cryptanalysis, side-channel); ôn số học (số nguyên tố, modular, nghịch đảo, Euclid mở rộng, luỹ thừa modular).',
  [[
    `<span class="eyebrow">CRY303c · Module 1 · Lesson 1.1</span>
<h2>Cryptography &amp; information theory</h2>
<h3>Terminology</h3>
<ul>
<li><strong>Plaintext</strong> — the readable message. <strong>Ciphertext</strong> — the scrambled output. <strong>Key</strong> — the secret that controls encryption/decryption.</li>
<li><strong>Encryption</strong> turns plaintext into ciphertext; <strong>decryption</strong> reverses it with the right key.</li>
</ul>
<h3>Kerckhoffs' principle</h3>
<p>A system must be secure <em>even if everything about it is public except the key</em>. Security lives in the key, never in a secret algorithm ("no security through obscurity").</p>
<h3>Deterministic vs random &amp; entropy</h3>
<p>Good encryption should look <strong>random</strong>: the same plaintext encrypted twice should not reveal that it is the same. <strong>Entropy</strong> measures uncertainty (in bits) — a key with more entropy is harder to guess. A 128-bit key has 2^128 possibilities.</p>
<h3>Attacks</h3>
<ul>
<li><strong>Brute force</strong> — try every key; defeated by a large enough key space.</li>
<li><strong>Cryptanalysis</strong> — exploit mathematical structure (e.g. frequency analysis on classical ciphers).</li>
<li><strong>Side-channel</strong> — leak from timing, power or electromagnetic signals, not the maths.</li>
</ul>
<h3>Number theory review (MAD101)</h3>
<p>Modern crypto rests on <strong>modular arithmetic</strong>: primes, <code>a mod n</code>, the modular inverse (the number that multiplies to 1 mod n), the extended Euclidean algorithm (finds inverses and GCD), and fast <strong>modular exponentiation</strong>.</p>
<pre><code class="language-python"># Nền của RSA &amp; Diffie-Hellman: luỹ thừa và nghịch đảo modular
a, n = 7, 13
print(pow(a, 5, n))     # 7**5 mod 13, tính nhanh không cần số khổng lồ
print(pow(a, -1, n))    # nghịch đảo modular của 7 (mod 13), Python 3.8+
import math
print(math.gcd(240, 46))  # ước chung lớn nhất, lõi của Euclid
</code></pre>
<div class="callout"><span class="badge">Key idea</span> Everything is public except the key — so the whole field is about making the key impossible to guess and the maths impossible to shortcut.</div>`,
    `<span class="eyebrow">CRY303c · Module 1 · Bài 1.1</span>
<h2>Mật mã &amp; lý thuyết thông tin</h2>
<h3>Thuật ngữ</h3>
<ul>
<li><strong>Plaintext (bản rõ)</strong> — thông điệp đọc được. <strong>Ciphertext (bản mã)</strong> — đầu ra bị xáo trộn. <strong>Key (khoá)</strong> — bí mật điều khiển mã hoá/giải mã.</li>
<li><strong>Mã hoá</strong> biến bản rõ thành bản mã; <strong>giải mã</strong> đảo lại nhờ đúng khoá.</li>
</ul>
<h3>Nguyên lý Kerckhoff</h3>
<p>Một hệ phải an toàn <em>kể cả khi mọi thứ đều công khai trừ khoá</em>. Sự an toàn nằm ở khoá, không bao giờ ở thuật toán bí mật ("không có an toàn nhờ giấu giếm").</p>
<h3>Tất định so với ngẫu nhiên &amp; entropy</h3>
<p>Mã hoá tốt phải trông <strong>ngẫu nhiên</strong>: cùng một bản rõ mã hai lần không được để lộ rằng chúng giống nhau. <strong>Entropy</strong> đo độ bất định (theo bit) — khoá nhiều entropy thì khó đoán hơn. Khoá 128-bit có 2^128 khả năng.</p>
<h3>Tấn công</h3>
<ul>
<li><strong>Brute force (vét cạn)</strong> — thử mọi khoá; chống bằng không gian khoá đủ lớn.</li>
<li><strong>Cryptanalysis (thám mã)</strong> — khai thác cấu trúc toán (vd phân tích tần suất với mã cổ điển).</li>
<li><strong>Side-channel (kênh phụ)</strong> — rò rỉ từ thời gian, điện năng hay tín hiệu điện từ, không phải từ toán.</li>
</ul>
<h3>Ôn số học (MAD101)</h3>
<p>Mật mã hiện đại dựa trên <strong>số học modular</strong>: số nguyên tố, <code>a mod n</code>, nghịch đảo modular (số nhân ra 1 mod n), thuật toán Euclid mở rộng (tìm nghịch đảo và GCD), và <strong>luỹ thừa modular</strong> nhanh.</p>
<pre><code class="language-python"># Nền của RSA &amp; Diffie-Hellman: luỹ thừa và nghịch đảo modular
a, n = 7, 13
print(pow(a, 5, n))     # 7**5 mod 13, tính nhanh không cần số khổng lồ
print(pow(a, -1, n))    # nghịch đảo modular của 7 (mod 13), Python 3.8+
import math
print(math.gcd(240, 46))  # ước chung lớn nhất, lõi của Euclid
</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Mọi thứ công khai trừ khoá — nên cả lĩnh vực xoay quanh việc làm khoá không thể đoán và toán không thể đi tắt.</div>`,
  ]]);

const m1q = quiz('cry303c-quiz-1', 'Quiz 1 — Info theory|||Quiz 1 — Lý thuyết thông tin', [
  { id: 'q1', question: "Kerckhoffs' principle says a system stays secure even if…?|||Nguyên lý Kerckhoff nói hệ vẫn an toàn kể cả khi…?", options: ['The key is public|||Khoá bị công khai', 'Everything except the key is public|||Mọi thứ trừ khoá đều công khai', 'The plaintext is public|||Bản rõ bị công khai', 'Nothing is public|||Không gì công khai'], correctIndex: 1, explanation: 'An toàn nằm ở khoá, không ở thuật toán bí mật.' },
  { id: 'q2', question: 'A side-channel attack exploits…?|||Tấn công kênh phụ khai thác…?', options: ['The cipher algebra|||Đại số của mã', 'Timing/power/EM leakage|||Rò rỉ thời gian/điện năng/điện từ', 'A weak password|||Mật khẩu yếu', 'A public key|||Khoá công khai'], correctIndex: 1, explanation: 'Kênh phụ rò từ vật lý cài đặt, không từ toán.' },
  { id: 'q3', question: 'Which does modern crypto rely on from MAD101?|||Mật mã hiện đại dựa vào phần nào của MAD101?', options: ['Calculus limits|||Giới hạn giải tích', 'Modular arithmetic & primes|||Số học modular & số nguyên tố', 'Matrix eigenvalues|||Trị riêng ma trận', 'Graph coloring|||Tô màu đồ thị'], correctIndex: 1, explanation: 'Modular arithmetic, số nguyên tố, Euclid mở rộng là nền RSA/DH.' },
]);

// ── Module 2 — Symmetric Cryptography (CLO2) ─────────────────────────────────
const m2a = doc('cry303c-2-1-classical', '2.1 — Classical ciphers, block vs stream|||2.1 — Mã cổ điển, block vs stream',
  'Substitution/Caesar, transposition/rail fence, product cipher; block vs stream cipher; ví dụ Caesar bằng Python.',
  [[
    `<span class="eyebrow">CRY303c · Module 2 · Lesson 2.1</span>
<h2>Classical ciphers &amp; cipher types</h2>
<h3>Substitution — Caesar</h3>
<p>A <strong>substitution cipher</strong> replaces each symbol with another. The <strong>Caesar cipher</strong> shifts every letter by a fixed amount (key). It is trivially broken by <strong>frequency analysis</strong> — there are only 26 shifts.</p>
<h3>Transposition — rail fence</h3>
<p>A <strong>transposition cipher</strong> keeps the letters but rearranges their order. The <strong>rail fence</strong> writes the text zig-zag across rows, then reads row by row.</p>
<h3>Product cipher</h3>
<p>A <strong>product cipher</strong> combines substitution and transposition in several rounds — the idea behind modern block ciphers (confusion + diffusion).</p>
<h3>Block vs stream</h3>
<ul>
<li><strong>Block cipher</strong> — encrypts fixed-size blocks (e.g. AES: 128-bit blocks); needs a <em>mode of operation</em> (CBC, CTR, GCM) to handle long messages.</li>
<li><strong>Stream cipher</strong> — generates a keystream and XORs it with the plaintext byte by byte (e.g. ChaCha20).</li>
</ul>
<pre><code class="language-python"># Caesar cipher — mã cổ điển, dễ phá bằng phân tích tần suất
def caesar(text, k):
    out = ''
    for c in text:
        if c.isalpha():
            base = ord('A') if c.isupper() else ord('a')
            out += chr((ord(c) - base + k) % 26 + base)
        else:
            out += c
    return out

print(caesar('HELLO', 3))          # KHOOR
print(caesar('KHOOR', -3))         # HELLO
</code></pre>
<div class="callout"><span class="badge">Confusion + diffusion</span> Modern ciphers repeat substitution and transposition over many rounds — one round is weak, many rounds hide all structure.</div>`,
    `<span class="eyebrow">CRY303c · Module 2 · Bài 2.1</span>
<h2>Mã cổ điển &amp; kiểu mã</h2>
<h3>Thay thế — Caesar</h3>
<p><strong>Mã thay thế (substitution)</strong> đổi mỗi ký hiệu bằng một ký hiệu khác. <strong>Mã Caesar</strong> dịch mỗi chữ đi một lượng cố định (khoá). Nó bị phá dễ dàng bằng <strong>phân tích tần suất</strong> — chỉ có 26 phép dịch.</p>
<h3>Hoán vị — rail fence</h3>
<p><strong>Mã hoán vị (transposition)</strong> giữ nguyên các chữ nhưng đổi thứ tự. <strong>Rail fence</strong> viết chữ theo đường zig-zag trên các hàng rồi đọc từng hàng.</p>
<h3>Product cipher</h3>
<p><strong>Product cipher</strong> ghép thay thế và hoán vị qua nhiều vòng — chính là ý tưởng của block cipher hiện đại (confusion + diffusion).</p>
<h3>Block so với stream</h3>
<ul>
<li><strong>Block cipher</strong> — mã theo khối cố định (vd AES: khối 128-bit); cần một <em>chế độ vận hành</em> (CBC, CTR, GCM) để xử lý thông điệp dài.</li>
<li><strong>Stream cipher</strong> — sinh một keystream và XOR với bản rõ từng byte (vd ChaCha20).</li>
</ul>
<pre><code class="language-python"># Caesar cipher — mã cổ điển, dễ phá bằng phân tích tần suất
def caesar(text, k):
    out = ''
    for c in text:
        if c.isalpha():
            base = ord('A') if c.isupper() else ord('a')
            out += chr((ord(c) - base + k) % 26 + base)
        else:
            out += c
    return out

print(caesar('HELLO', 3))          # KHOOR
print(caesar('KHOOR', -3))         # HELLO
</code></pre>
<div class="callout"><span class="badge">Confusion + diffusion</span> Mã hiện đại lặp thay thế và hoán vị qua nhiều vòng — một vòng thì yếu, nhiều vòng giấu hết cấu trúc.</div>`,
  ]]);

const m2b = doc('cry303c-2-2-des-aes', '2.2 — DES, 3DES & AES|||2.2 — DES, 3DES & AES',
  'DES; Double-DES & meet-in-the-middle; Triple-DES; AES (SubBytes/ShiftRows/MixColumns/AddRoundKey); trường hữu hạn GF(2^8); ví dụ AES-GCM bằng thư viện cryptography.',
  [[
    `<span class="eyebrow">CRY303c · Module 2 · Lesson 2.2</span>
<h2>DES, 3DES &amp; AES</h2>
<h3>DES</h3>
<p><strong>DES</strong> is a 16-round Feistel block cipher with a 64-bit block and an effective <strong>56-bit key</strong> — too small today, brute-forceable in hours.</p>
<h3>Double-DES &amp; meet-in-the-middle</h3>
<p>Encrypting twice (Double-DES) seems to give 112-bit security but does <em>not</em>: the <strong>meet-in-the-middle</strong> attack breaks it with about 2^57 work by matching encryptions from one side against decryptions from the other.</p>
<h3>Triple-DES</h3>
<p><strong>3DES</strong> applies DES three times (encrypt–decrypt–encrypt) for real strength, but it is slow and now legacy.</p>
<h3>AES</h3>
<p><strong>AES</strong> is the modern standard: 128-bit blocks, keys of 128/192/256 bits, 10/12/14 rounds. Each round does <strong>SubBytes</strong> (substitution via an S-box), <strong>ShiftRows</strong> and <strong>MixColumns</strong> (diffusion), and <strong>AddRoundKey</strong> (XOR the round key).</p>
<h3>Finite field GF(2^8)</h3>
<p>AES treats each byte as an element of the finite field <strong>GF(2^8)</strong>; MixColumns is matrix multiplication in that field. This algebra is what makes the S-box and mixing invertible.</p>
<pre><code class="language-python"># AES-256 authenticated encryption (AES-GCM) — cách dùng đúng, an toàn
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import os

key   = AESGCM.generate_key(bit_length=256)   # AES-256
aes   = AESGCM(key)
nonce = os.urandom(12)                         # nonce phải duy nhất mỗi lần
ct    = aes.encrypt(nonce, b'Secret message', None)
pt    = aes.decrypt(nonce, ct, None)
print(pt)                                      # b'Secret message'
</code></pre>
<div class="callout"><span class="badge">Never double-encrypt</span> Encrypting twice does not double the key strength — meet-in-the-middle is why 3DES (not 2DES) was standardised.</div>`,
    `<span class="eyebrow">CRY303c · Module 2 · Bài 2.2</span>
<h2>DES, 3DES &amp; AES</h2>
<h3>DES</h3>
<p><strong>DES</strong> là block cipher Feistel 16 vòng, khối 64-bit, khoá hiệu dụng <strong>56-bit</strong> — nay quá nhỏ, vét cạn được trong vài giờ.</p>
<h3>Double-DES &amp; meet-in-the-middle</h3>
<p>Mã hai lần (Double-DES) tưởng cho 112-bit nhưng <em>không</em>: tấn công <strong>meet-in-the-middle</strong> phá nó với khoảng 2^57 phép, bằng cách khớp bản mã từ một phía với bản giải từ phía kia.</p>
<h3>Triple-DES</h3>
<p><strong>3DES</strong> áp dụng DES ba lần (mã–giải–mã) để đủ mạnh thật, nhưng chậm và nay đã lỗi thời.</p>
<h3>AES</h3>
<p><strong>AES</strong> là chuẩn hiện đại: khối 128-bit, khoá 128/192/256 bit, 10/12/14 vòng. Mỗi vòng gồm <strong>SubBytes</strong> (thay thế qua S-box), <strong>ShiftRows</strong> và <strong>MixColumns</strong> (khuếch tán), và <strong>AddRoundKey</strong> (XOR khoá vòng).</p>
<h3>Trường hữu hạn GF(2^8)</h3>
<p>AES coi mỗi byte là một phần tử của trường hữu hạn <strong>GF(2^8)</strong>; MixColumns là phép nhân ma trận trong trường đó. Chính đại số này làm S-box và phép trộn khả nghịch.</p>
<pre><code class="language-python"># AES-256 authenticated encryption (AES-GCM) — cách dùng đúng, an toàn
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import os

key   = AESGCM.generate_key(bit_length=256)   # AES-256
aes   = AESGCM(key)
nonce = os.urandom(12)                         # nonce phải duy nhất mỗi lần
ct    = aes.encrypt(nonce, b'Secret message', None)
pt    = aes.decrypt(nonce, ct, None)
print(pt)                                      # b'Secret message'
</code></pre>
<div class="callout"><span class="badge">Đừng mã hai lần</span> Mã hai lần không nhân đôi độ mạnh khoá — meet-in-the-middle là lý do 3DES (không phải 2DES) được chuẩn hoá.</div>`,
  ]]);

const m2q = quiz('cry303c-quiz-2', 'Quiz 2 — Symmetric crypto|||Quiz 2 — Mã đối xứng', [
  { id: 'q1', question: 'Why is Double-DES not much stronger than DES?|||Vì sao Double-DES không mạnh hơn DES nhiều?', options: ['Its key is shorter|||Khoá của nó ngắn hơn', 'The meet-in-the-middle attack|||Tấn công meet-in-the-middle', 'It uses stream mode|||Nó dùng chế độ stream', 'It has no rounds|||Nó không có vòng nào'], correctIndex: 1, explanation: 'Meet-in-the-middle hạ 2DES về ~2^57 phép.' },
  { id: 'q2', question: 'A block cipher processing long data needs a…?|||Block cipher xử lý dữ liệu dài cần một…?', options: ['Longer key|||Khoá dài hơn', 'Mode of operation (CBC/CTR/GCM)|||Chế độ vận hành (CBC/CTR/GCM)', 'Second cipher|||Mã thứ hai', 'Public key|||Khoá công khai'], correctIndex: 1, explanation: 'Mode of operation cho phép mã nhiều khối an toàn.' },
  { id: 'q3', question: 'AES treats each byte as an element of…?|||AES coi mỗi byte là phần tử của…?', options: ['The real numbers|||Số thực', 'GF(2^8) finite field|||Trường hữu hạn GF(2^8)', 'A 64-bit integer|||Số nguyên 64-bit', 'ASCII table|||Bảng ASCII'], correctIndex: 1, explanation: 'MixColumns/S-box là đại số trên GF(2^8).' },
]);

// ── Module 3 — Asymmetric Cryptography & Key Management (CLO3) ────────────────
const m3a = doc('cry303c-3-1-rsa', '3.1 — Public-key crypto & RSA|||3.1 — Mã khoá công khai & RSA',
  'Ý tưởng mã bất đối xứng & chữ ký; RSA: sinh khoá (p,q,n,φ,e,d), mã/giải (c=m^e, m=c^d), độ bảo mật (khó phân tích n); ví dụ RSA-OAEP bằng thư viện cryptography.',
  [[
    `<span class="eyebrow">CRY303c · Module 3 · Lesson 3.1</span>
<h2>Public-key cryptography &amp; RSA</h2>
<h3>Why asymmetric?</h3>
<p>Symmetric crypto needs both sides to share one secret key — but how do strangers agree on it? <strong>Asymmetric (public-key)</strong> crypto gives each person a <strong>public key</strong> (shared freely) and a <strong>private key</strong> (kept secret). Anyone can encrypt to you with your public key; only your private key decrypts. Reverse the roles and you get <strong>digital signatures</strong>.</p>
<h3>RSA — key generation</h3>
<ul>
<li>Pick two large primes <strong>p</strong> and <strong>q</strong>; let <strong>n = p·q</strong>.</li>
<li>Compute <strong>φ(n) = (p−1)(q−1)</strong>.</li>
<li>Pick public exponent <strong>e</strong> coprime to φ(n) (often 65537).</li>
<li>Compute private exponent <strong>d = e⁻¹ mod φ(n)</strong> (extended Euclid).</li>
</ul>
<h3>Encrypt / decrypt</h3>
<p>Ciphertext <strong>c = m^e mod n</strong>; recover <strong>m = c^d mod n</strong>. Security rests on the hardness of <strong>factoring n</strong> back into p and q — easy to multiply, hard to reverse.</p>
<pre><code class="language-python"># RSA-2048 với padding OAEP (không bao giờ dùng RSA "trần")
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes

priv = rsa.generate_private_key(public_exponent=65537, key_size=2048)
pub  = priv.public_key()
pad  = padding.OAEP(mgf=padding.MGF1(hashes.SHA256()),
                    algorithm=hashes.SHA256(), label=None)
ct = pub.encrypt(b'hi Bob', pad)
pt = priv.decrypt(ct, pad)
print(pt)          # b'hi Bob'
</code></pre>
<div class="callout"><span class="badge">Easy one way</span> Multiplying two big primes is instant; factoring the product is believed infeasible — that gap is RSA's security.</div>`,
    `<span class="eyebrow">CRY303c · Module 3 · Bài 3.1</span>
<h2>Mã khoá công khai &amp; RSA</h2>
<h3>Vì sao cần bất đối xứng?</h3>
<p>Mã đối xứng cần hai bên chung một khoá bí mật — nhưng người lạ thoả thuận khoá đó thế nào? Mã <strong>bất đối xứng (khoá công khai)</strong> cho mỗi người một <strong>khoá công khai</strong> (chia sẻ tự do) và một <strong>khoá riêng</strong> (giữ kín). Ai cũng có thể mã gửi cho bạn bằng khoá công khai; chỉ khoá riêng của bạn giải được. Đảo vai lại thì được <strong>chữ ký số</strong>.</p>
<h3>RSA — sinh khoá</h3>
<ul>
<li>Chọn hai số nguyên tố lớn <strong>p</strong> và <strong>q</strong>; đặt <strong>n = p·q</strong>.</li>
<li>Tính <strong>φ(n) = (p−1)(q−1)</strong>.</li>
<li>Chọn số mũ công khai <strong>e</strong> nguyên tố cùng nhau với φ(n) (thường 65537).</li>
<li>Tính số mũ riêng <strong>d = e⁻¹ mod φ(n)</strong> (Euclid mở rộng).</li>
</ul>
<h3>Mã / giải</h3>
<p>Bản mã <strong>c = m^e mod n</strong>; khôi phục <strong>m = c^d mod n</strong>. Độ bảo mật dựa trên độ khó <strong>phân tích n</strong> về lại p và q — nhân thì dễ, đảo lại thì khó.</p>
<pre><code class="language-python"># RSA-2048 với padding OAEP (không bao giờ dùng RSA "trần")
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes

priv = rsa.generate_private_key(public_exponent=65537, key_size=2048)
pub  = priv.public_key()
pad  = padding.OAEP(mgf=padding.MGF1(hashes.SHA256()),
                    algorithm=hashes.SHA256(), label=None)
ct = pub.encrypt(b'hi Bob', pad)
pt = priv.decrypt(ct, pad)
print(pt)          # b'hi Bob'
</code></pre>
<div class="callout"><span class="badge">Dễ một chiều</span> Nhân hai số nguyên tố lớn là tức thì; phân tích tích trở lại được tin là bất khả thi — khoảng cách đó là bảo mật của RSA.</div>`,
  ]]);

const m3b = doc('cry303c-3-2-dh-pki', '3.2 — Diffie-Hellman, certificates & PKI|||3.2 — Diffie-Hellman, chứng chỉ & PKI',
  'Bài toán logarithm rời rạc & trao đổi khoá Diffie-Hellman; tấn công man-in-the-middle; phân phối khoá, chứng chỉ khoá công khai & PKI (CA).',
  [[
    `<span class="eyebrow">CRY303c · Module 3 · Lesson 3.2</span>
<h2>Diffie-Hellman, certificates &amp; PKI</h2>
<h3>Discrete logarithm &amp; Diffie-Hellman</h3>
<p><strong>Diffie-Hellman (DH)</strong> lets two parties agree on a shared secret over a public channel — without ever sending it. Its security rests on the <strong>discrete logarithm problem</strong>: given g^a mod p it is hard to find a.</p>
<pre><code class="language-python"># Diffie-Hellman (số nhỏ để minh hoạ; thực tế p có hàng nghìn bit)
p, g = 23, 5          # số nguyên tố công khai + căn nguyên thuỷ
a, b = 6, 15          # khoá riêng của Alice, Bob
A = pow(g, a, p)      # Alice gửi công khai
B = pow(g, b, p)      # Bob gửi công khai
s_alice = pow(B, a, p)
s_bob   = pow(A, b, p)
print(s_alice, s_bob) # bằng nhau -> khoá chung bí mật
</code></pre>
<h3>Man-in-the-middle</h3>
<p>Plain DH has no identity: an attacker in the middle can swap the public values and share a key with each side separately. DH must be <strong>authenticated</strong> (signed values or certificates) to stop this.</p>
<h3>Key distribution, certificates &amp; PKI</h3>
<ul>
<li>How do you trust that a public key really belongs to "the bank"? A <strong>certificate</strong> binds an identity to a public key, <strong>signed by a Certificate Authority (CA)</strong>.</li>
<li><strong>PKI</strong> (Public Key Infrastructure) is the system of CAs, certificates and trust chains — the basis of HTTPS/TLS.</li>
</ul>
<div class="callout"><span class="badge">Trust needs identity</span> Key exchange without authentication is wide open to man-in-the-middle — certificates and PKI supply the missing "who".</div>`,
    `<span class="eyebrow">CRY303c · Module 3 · Bài 3.2</span>
<h2>Diffie-Hellman, chứng chỉ &amp; PKI</h2>
<h3>Logarithm rời rạc &amp; Diffie-Hellman</h3>
<p><strong>Diffie-Hellman (DH)</strong> cho hai bên thoả thuận một bí mật chung qua kênh công khai — mà không hề gửi nó đi. Bảo mật dựa trên <strong>bài toán logarithm rời rạc</strong>: biết g^a mod p thì khó tìm a.</p>
<pre><code class="language-python"># Diffie-Hellman (số nhỏ để minh hoạ; thực tế p có hàng nghìn bit)
p, g = 23, 5          # số nguyên tố công khai + căn nguyên thuỷ
a, b = 6, 15          # khoá riêng của Alice, Bob
A = pow(g, a, p)      # Alice gửi công khai
B = pow(g, b, p)      # Bob gửi công khai
s_alice = pow(B, a, p)
s_bob   = pow(A, b, p)
print(s_alice, s_bob) # bằng nhau -> khoá chung bí mật
</code></pre>
<h3>Man-in-the-middle</h3>
<p>DH trần không có danh tính: kẻ đứng giữa có thể tráo các giá trị công khai và chia sẻ khoá riêng với từng bên. DH phải được <strong>xác thực</strong> (giá trị có ký hoặc chứng chỉ) mới chặn được.</p>
<h3>Phân phối khoá, chứng chỉ &amp; PKI</h3>
<ul>
<li>Làm sao tin khoá công khai thật sự thuộc về "ngân hàng"? Một <strong>chứng chỉ</strong> gắn danh tính với một khoá công khai, <strong>được ký bởi một Certificate Authority (CA)</strong>.</li>
<li><strong>PKI</strong> (hạ tầng khoá công khai) là hệ thống các CA, chứng chỉ và chuỗi tin cậy — nền của HTTPS/TLS.</li>
</ul>
<div class="callout"><span class="badge">Tin cậy cần danh tính</span> Trao đổi khoá mà không xác thực thì hở toang cho man-in-the-middle — chứng chỉ và PKI bổ sung phần "ai" còn thiếu.</div>`,
  ]]);

const m3q = quiz('cry303c-quiz-3', 'Quiz 3 — Asymmetric & keys|||Quiz 3 — Bất đối xứng & khoá', [
  { id: 'q1', question: 'RSA security relies on the hardness of…?|||Bảo mật RSA dựa trên độ khó của…?', options: ['Sorting|||Sắp xếp', 'Factoring a large n|||Phân tích số n lớn', 'Hashing|||Băm', 'XOR|||XOR'], correctIndex: 1, explanation: 'Nhân p·q dễ, phân tích n về p,q khó.' },
  { id: 'q2', question: 'Plain Diffie-Hellman without authentication is vulnerable to…?|||DH trần không xác thực dễ bị…?', options: ['Brute force only|||Chỉ vét cạn', 'Man-in-the-middle|||Kẻ đứng giữa (MITM)', 'Frequency analysis|||Phân tích tần suất', 'Nothing|||Không gì'], correctIndex: 1, explanation: 'Không danh tính -> kẻ giữa tráo giá trị công khai.' },
  { id: 'q3', question: 'A certificate signed by a CA binds…?|||Chứng chỉ do CA ký gắn kết…?', options: ['Two private keys|||Hai khoá riêng', 'An identity to a public key|||Danh tính với khoá công khai', 'A hash to a salt|||Băm với salt', 'A nonce to a block|||Nonce với khối'], correctIndex: 1, explanation: 'PKI: CA ký chứng chỉ gắn danh tính với khoá công khai.' },
]);

// ── Module 4 — Cryptographic Hash & Integrity Protection (CLO4) ───────────────
const m4 = doc('cry303c-4-1-hash-mac', '4.1 — Hashes, MACs & digital signatures|||4.1 — Hàm băm, MAC & chữ ký số',
  'Hàm băm mật mã & thuộc tính (preimage, second-preimage, collision resistance); hash chain, S/Key OTP; cryptocurrency & Bitcoin; MAC (HMAC); yêu cầu & thuộc tính chữ ký số; ví dụ SHA-256 + HMAC bằng Python.',
  [[
    `<span class="eyebrow">CRY303c · Module 4 · Lesson 4.1</span>
<h2>Cryptographic hashes, MACs &amp; signatures</h2>
<h3>Cryptographic hash functions</h3>
<p>A <strong>hash</strong> (e.g. SHA-256) maps any input to a fixed-size digest. Security properties:</p>
<ul>
<li><strong>Preimage resistance</strong> — given a digest, you cannot find an input that produces it.</li>
<li><strong>Second-preimage resistance</strong> — given one input, you cannot find a different one with the same digest.</li>
<li><strong>Collision resistance</strong> — you cannot find any two inputs with the same digest.</li>
</ul>
<h3>Hash chains &amp; S/Key OTP</h3>
<p>Hashing repeatedly builds a <strong>hash chain</strong>. <strong>S/Key</strong> one-time passwords walk the chain backwards: each login reveals the previous hash, which the server verifies by hashing forward — a stolen value cannot be replayed.</p>
<h3>Cryptocurrency &amp; Bitcoin</h3>
<p><strong>Bitcoin</strong> chains blocks by hash: each block includes the hash of the one before, so altering history breaks every later hash. Proof-of-work asks miners to find an input whose hash meets a target.</p>
<h3>MAC — message authentication code</h3>
<p>A <strong>MAC</strong> (e.g. HMAC) uses a shared secret key with a hash to prove a message is <em>both</em> authentic and untampered. A plain hash proves integrity only; a MAC adds authentication.</p>
<h3>Digital signatures</h3>
<p>A <strong>signature</strong> is the public-key analogue: sign with your <em>private</em> key, anyone verifies with your <em>public</em> key. It provides integrity, authentication and <strong>non-repudiation</strong> (the signer cannot deny it).</p>
<pre><code class="language-python"># Băm SHA-256 và MAC (HMAC-SHA256)
import hashlib, hmac

digest = hashlib.sha256(b'hello').hexdigest()
print(digest)                       # bản tóm tắt cố định 256-bit

key = b'shared-secret'
tag = hmac.new(key, b'transfer 100', hashlib.sha256).hexdigest()
print(tag)                          # MAC: xác thực + toàn vẹn
# so sánh MAC phải dùng hàm hằng-thời-gian để tránh side-channel:
print(hmac.compare_digest(tag, tag))
</code></pre>
<div class="callout"><span class="badge">Hash vs MAC vs signature</span> Hash = integrity. MAC = integrity + authentication (shared key). Signature = integrity + authentication + non-repudiation (public key).</div>`,
    `<span class="eyebrow">CRY303c · Module 4 · Bài 4.1</span>
<h2>Hàm băm mật mã, MAC &amp; chữ ký</h2>
<h3>Hàm băm mật mã</h3>
<p>Một <strong>hàm băm</strong> (vd SHA-256) ánh xạ đầu vào bất kỳ thành một digest cố định. Thuộc tính bảo mật:</p>
<ul>
<li><strong>Kháng preimage</strong> — biết digest, không tìm được đầu vào tạo ra nó.</li>
<li><strong>Kháng second-preimage</strong> — biết một đầu vào, không tìm được đầu vào khác cùng digest.</li>
<li><strong>Kháng va chạm (collision)</strong> — không tìm được bất kỳ hai đầu vào nào cùng digest.</li>
</ul>
<h3>Hash chain &amp; S/Key OTP</h3>
<p>Băm lặp lại tạo thành <strong>hash chain</strong>. Mật khẩu một lần <strong>S/Key</strong> đi ngược chuỗi: mỗi lần đăng nhập lộ ra băm trước đó, máy chủ xác minh bằng cách băm tiến — giá trị bị trộm không phát lại được.</p>
<h3>Cryptocurrency &amp; Bitcoin</h3>
<p><strong>Bitcoin</strong> xâu các khối bằng băm: mỗi khối chứa băm của khối trước, nên sửa lịch sử làm hỏng mọi băm sau. Proof-of-work bắt thợ đào tìm đầu vào có băm đạt ngưỡng.</p>
<h3>MAC — mã xác thực thông điệp</h3>
<p>Một <strong>MAC</strong> (vd HMAC) dùng khoá bí mật chung cùng hàm băm để chứng minh thông điệp <em>vừa</em> đúng người gửi <em>vừa</em> không bị sửa. Băm trần chỉ chứng minh toàn vẹn; MAC thêm xác thực.</p>
<h3>Chữ ký số</h3>
<p>Một <strong>chữ ký</strong> là bản khoá-công-khai tương ứng: ký bằng khoá <em>riêng</em>, ai cũng xác minh bằng khoá <em>công khai</em>. Nó cho toàn vẹn, xác thực và <strong>chống chối bỏ (non-repudiation)</strong> (người ký không thể phủ nhận).</p>
<pre><code class="language-python"># Băm SHA-256 và MAC (HMAC-SHA256)
import hashlib, hmac

digest = hashlib.sha256(b'hello').hexdigest()
print(digest)                       # bản tóm tắt cố định 256-bit

key = b'shared-secret'
tag = hmac.new(key, b'transfer 100', hashlib.sha256).hexdigest()
print(tag)                          # MAC: xác thực + toàn vẹn
# so sánh MAC phải dùng hàm hằng-thời-gian để tránh side-channel:
print(hmac.compare_digest(tag, tag))
</code></pre>
<div class="callout"><span class="badge">Hash vs MAC vs chữ ký</span> Hash = toàn vẹn. MAC = toàn vẹn + xác thực (khoá chung). Chữ ký = toàn vẹn + xác thực + chống chối bỏ (khoá công khai).</div>`,
  ]]);

const m4q = quiz('cry303c-quiz-4', 'Quiz 4 — Hash & integrity|||Quiz 4 — Băm & toàn vẹn', [
  { id: 'q1', question: 'Collision resistance means you cannot find…?|||Kháng va chạm nghĩa là không tìm được…?', options: ['One input for a given digest|||Một đầu vào cho digest cho trước', 'Any two inputs with the same digest|||Bất kỳ hai đầu vào cùng digest', 'The key from the tag|||Khoá từ tag', 'A prime factor|||Một thừa số nguyên tố'], correctIndex: 1, explanation: 'Collision: không có hai đầu vào khác nhau cùng băm.' },
  { id: 'q2', question: 'What does a MAC add over a plain hash?|||MAC thêm gì so với băm trần?', options: ['Compression|||Nén', 'Authentication via a shared key|||Xác thực nhờ khoá chung', 'A larger digest|||Digest lớn hơn', 'Encryption|||Mã hoá'], correctIndex: 1, explanation: 'MAC dùng khoá bí mật -> chứng minh cả nguồn gốc lẫn toàn vẹn.' },
  { id: 'q3', question: 'A digital signature uniquely provides…?|||Chữ ký số cung cấp riêng biệt tính…?', options: ['Confidentiality|||Bí mật', 'Non-repudiation|||Chống chối bỏ', 'Compression|||Nén', 'Faster hashing|||Băm nhanh hơn'], correctIndex: 1, explanation: 'Ký bằng khoá riêng -> người ký không thể phủ nhận.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'CRY303c',
    slug: 'cry303c-applied-cryptography',
    title: 'Applied Cryptography',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CRY303c.webp',
    shortDescription: 'Protect information in practice: information theory & number theory, symmetric ciphers (Caesar, DES/3DES, AES), asymmetric crypto (RSA, Diffie-Hellman, PKI), hashes, MACs & digital signatures — coded in Python. Bilingual, with examples & quizzes.|||Bảo vệ thông tin trong thực tế: lý thuyết thông tin & số học, mã đối xứng (Caesar, DES/3DES, AES), mã bất đối xứng (RSA, Diffie-Hellman, PKI), hàm băm, MAC & chữ ký số — viết bằng Python. Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>CRY303c — Applied Cryptography</strong> (Mật mã ứng dụng, kỳ 5, ngành IT/An toàn thông tin) dạy cách <strong>bảo vệ thông tin</strong>: giữ bí mật, phát hiện sửa đổi và chứng minh nguồn gốc. Bốn module bám giáo trình FLM: <strong>lý thuyết thông tin &amp; số học</strong> (Kerckhoff, entropy, modular arithmetic) → <strong>mã đối xứng</strong> (mã cổ điển, DES/3DES, AES, GF(2^8)) → <strong>mã bất đối xứng &amp; quản lý khoá</strong> (RSA, Diffie-Hellman, chứng chỉ &amp; PKI) → <strong>băm &amp; toàn vẹn</strong> (hàm băm, MAC, chữ ký số). Nguồn chính là chuyên đề Coursera "Applied Cryptography" (Univ. of Colorado) và sách "Understanding Cryptography" (Paar). Song ngữ, có ví dụ Python với thư viện <code>cryptography</code>, quiz mỗi module.',
    whatYouLearn: 'Thuật ngữ mật mã, nguyên lý Kerckhoff, entropy & các loại tấn công; ôn số học modular (số nguyên tố, nghịch đảo, Euclid mở rộng, luỹ thừa modular); mã cổ điển (Caesar, rail fence, product cipher); block vs stream; DES, meet-in-the-middle, 3DES, AES & GF(2^8); RSA (sinh khoá, mã/giải, độ bảo mật); Diffie-Hellman & logarithm rời rạc; man-in-the-middle, chứng chỉ & PKI; hàm băm & thuộc tính, hash chain/S/Key, Bitcoin; MAC (HMAC) & chữ ký số; lập trình bằng Python (cryptography/PyCryptodome).',
    requirements: 'Tiên quyết <strong>MAD101</strong> (Toán rời rạc): số học modular, số nguyên tố, GCD & Euclid mở rộng. Biết Python cơ bản; nên cài thư viện <code>cryptography</code> hoặc PyCryptodome. Khuyến nghị hoàn thành MOOC Coursera "Applied Cryptography" (điều kiện dự thi + 1 điểm thưởng).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Coursera Applied Cryptography, sách Paar & Ferguson/Schneier, cryptopals, công cụ Python & OpenSSL, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Mật mã ứng dụng, 4 CLO, cơ cấu điểm, tiên quyết MAD101.', lessons: [intro] },
    { title: 'Module 1 — Cryptography & Information Theory|||Module 1 — Mật mã & lý thuyết thông tin', description: 'Thuật ngữ, Kerckhoff, entropy, tấn công; ôn số học modular.', lessons: [m1, m1q] },
    { title: 'Module 2 — Symmetric Cryptography|||Module 2 — Mã đối xứng', description: 'Mã cổ điển, block/stream, DES/3DES, AES, GF(2^8).', lessons: [m2a, m2b, m2q] },
    { title: 'Module 3 — Asymmetric Cryptography & Key Management|||Module 3 — Mã bất đối xứng & quản lý khoá', description: 'RSA, Diffie-Hellman, MITM, chứng chỉ & PKI.', lessons: [m3a, m3b, m3q] },
    { title: 'Module 4 — Cryptographic Hash & Integrity Protection|||Module 4 — Băm mật mã & bảo vệ toàn vẹn', description: 'Hàm băm, hash chain/S/Key, Bitcoin, MAC, chữ ký số.', lessons: [m4, m4q] },
  ],
};
