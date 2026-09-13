/**
 * CAC301 — Cryptography and Applied Cryptography. Mật mã học & mật mã ứng dụng
 * (ngành Khoa học Máy tính FPTU, Kỳ 4). Khung chất lượng: 8 chương song ngữ —
 * mã cổ điển → mã khối/dòng → lý thuyết số → mã bất đối xứng → băm/MAC →
 * chữ ký số/PKI → mật mã ứng dụng. Sách chuẩn: Stallings, Katz & Lindell, Paar.
 * Giữ NGUYÊN slug/semester/thumb/courseCode. ⚠️ KHÔNG backtick lồng/${; & → &amp;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('cac301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Stallings, Katz & Lindell, Paar), tài liệu miễn phí, Cryptopals, YouTube, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">CAC301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Cryptography and Applied Cryptography</strong> — from classical ciphers to AES, RSA, hashes, digital signatures and TLS — in one place. The official FPTU slides &amp; syllabus live on <strong>FLM</strong>; below are the standard textbooks and free, legal resources.</p>
<h3>📘 Standard textbooks</h3>
<ul>
<li><strong>Stallings</strong> — <em>Cryptography and Network Security: Principles and Practice</em> (the FPTU reference).</li>
<li><strong>Katz &amp; Lindell</strong> — <em>Introduction to Modern Cryptography</em> (rigorous, definition-driven).</li>
<li><strong>Paar &amp; Pelzl</strong> — <em>Understanding Cryptography</em> (approachable, with a companion video course).</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — official FPTU syllabus &amp; slides.</li>
<li><a href="https://csrc.nist.gov/publications/fips" target="_blank" rel="noopener">NIST FIPS</a> — the source standards for AES (FIPS 197), SHA (FIPS 180/202), signatures (FIPS 186).</li>
</ul>
<h3>🧪 Hands-on practice</h3>
<ul>
<li><a href="https://cryptopals.com/" target="_blank" rel="noopener">Cryptopals Crypto Challenges</a> — break real ciphers, learn by attacking.</li>
<li><a href="https://cryptohack.org/" target="_blank" rel="noopener">CryptoHack</a> — gamified crypto puzzles.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@ComputerphileNSA" target="_blank" rel="noopener">Computerphile</a> — crypto concepts explained simply.</li>
<li><a href="https://www.youtube.com/@introductiontocryptography4223" target="_blank" rel="noopener">Christof Paar — Understanding Cryptography</a> — full lecture series.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.cryptool.org/en/cto/" target="_blank" rel="noopener">CrypTool-Online</a> — try ciphers &amp; hashes in the browser.</li>
<li><a href="https://gchq.github.io/CyberChef/" target="_blank" rel="noopener">CyberChef</a> — encode/decode/analyse data.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — CIA goals, terminology, classical ciphers and why they fail.</li>
<li><strong>Symmetric</strong> — block ciphers (AES, modes) and stream ciphers; the key-distribution problem.</li>
<li><strong>Asymmetric</strong> — the number theory behind RSA, Diffie-Hellman and ECC.</li>
<li><strong>Applied</strong> — hashes, HMAC, signatures, PKI, then TLS and end-to-end encryption.</li>
</ol></div>`,
    `<span class="eyebrow">CAC301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Mật mã học &amp; mật mã ứng dụng</strong> — từ mã cổ điển tới AES, RSA, hàm băm, chữ ký số và TLS — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là sách chuẩn và nguồn miễn phí, hợp pháp.</p>
<h3>📘 Sách chuẩn</h3>
<ul>
<li><strong>Stallings</strong> — <em>Cryptography and Network Security</em> (sách tham chiếu của FPTU).</li>
<li><strong>Katz &amp; Lindell</strong> — <em>Introduction to Modern Cryptography</em> (chặt chẽ, đi từ định nghĩa).</li>
<li><strong>Paar &amp; Pelzl</strong> — <em>Understanding Cryptography</em> (dễ tiếp cận, kèm khoá video).</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — giáo trình &amp; slide chính thức FPTU.</li>
<li><a href="https://csrc.nist.gov/publications/fips" target="_blank" rel="noopener">NIST FIPS</a> — chuẩn gốc của AES (FIPS 197), SHA (FIPS 180/202), chữ ký (FIPS 186).</li>
</ul>
<h3>🧪 Thực hành</h3>
<ul>
<li><a href="https://cryptopals.com/" target="_blank" rel="noopener">Cryptopals</a> — phá mã thật, học bằng cách tấn công.</li>
<li><a href="https://cryptohack.org/" target="_blank" rel="noopener">CryptoHack</a> — câu đố mật mã dạng game.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@ComputerphileNSA" target="_blank" rel="noopener">Computerphile</a> — giảng khái niệm mật mã dễ hiểu.</li>
<li><a href="https://www.youtube.com/@introductiontocryptography4223" target="_blank" rel="noopener">Christof Paar</a> — trọn bộ bài giảng.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.cryptool.org/en/cto/" target="_blank" rel="noopener">CrypTool-Online</a> — thử mã hoá &amp; băm trên trình duyệt.</li>
<li><a href="https://gchq.github.io/CyberChef/" target="_blank" rel="noopener">CyberChef</a> — mã hoá/giải mã/phân tích dữ liệu.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — mục tiêu CIA, thuật ngữ, mã cổ điển và vì sao chúng thất bại.</li>
<li><strong>Đối xứng</strong> — mã khối (AES, các chế độ) và mã dòng; bài toán phân phối khoá.</li>
<li><strong>Bất đối xứng</strong> — lý thuyết số đằng sau RSA, Diffie-Hellman và ECC.</li>
<li><strong>Ứng dụng</strong> — băm, HMAC, chữ ký, PKI, rồi TLS và mã hoá đầu-cuối.</li>
</ol></div>`,
  ]]);

const intro = doc('cac301-0-1-overview', 'Course overview: Cryptography|||Tổng quan: Mật mã học',
  'Mật mã làm gì; ba mục tiêu CIA (bí mật, toàn vẹn, xác thực); thuật ngữ plaintext/ciphertext/key; nguyên lý Kerckhoffs; lộ trình: đối xứng → lý thuyết số → bất đối xứng → băm/chữ ký → ứng dụng.',
  [[
    `<span class="eyebrow">CAC301 · Lesson 0.1 · Overview</span>
<h2>What is cryptography?</h2>
<p class="lead"><strong>Cryptography</strong> is the science of protecting information so that only intended parties can read or trust it — the maths behind HTTPS, messaging apps, bank cards and digital signatures. This course builds from <strong>classical ciphers</strong> up to the <strong>modern algorithms</strong> that secure the internet.</p>
<h3>The three security goals (CIA)</h3>
<ul>
<li><strong>Confidentiality</strong> — keep data secret from everyone but the intended reader (encryption).</li>
<li><strong>Integrity</strong> — detect any change to the data (hashes, MACs).</li>
<li><strong>Authenticity</strong> — prove who sent it and that it was not forged (signatures, certificates).</li>
</ul>
<h3>Core terminology</h3>
<pre><code>plaintext  --[ Encrypt(key) ]--&gt;  ciphertext
ciphertext --[ Decrypt(key) ]--&gt;  plaintext
</code></pre>
<p><strong>Kerckhoffs's principle:</strong> a system must stay secure even if everything about it is public <em>except the key</em>. Security lives in the key, never in a secret algorithm.</p>
<h3>Roadmap</h3>
<p>Classical ciphers &amp; cryptanalysis → symmetric (block &amp; stream) → number theory → asymmetric (RSA, Diffie-Hellman, ECC) → hashes &amp; MACs → digital signatures &amp; PKI → applied crypto (TLS, VPN, end-to-end encryption). Bilingual, with worked examples and quizzes.</p>`,
    `<span class="eyebrow">CAC301 · Bài 0.1 · Tổng quan</span>
<h2>Mật mã học là gì?</h2>
<p class="lead"><strong>Mật mã học</strong> là khoa học bảo vệ thông tin sao cho chỉ đúng người nhận mới đọc hoặc tin được — nền toán học sau HTTPS, ứng dụng nhắn tin, thẻ ngân hàng và chữ ký số. Môn này đi từ <strong>mã cổ điển</strong> lên tới các <strong>thuật toán hiện đại</strong> đang bảo vệ internet.</p>
<h3>Ba mục tiêu an toàn (CIA)</h3>
<ul>
<li><strong>Bí mật (Confidentiality)</strong> — giữ dữ liệu kín với mọi người trừ người nhận (mã hoá).</li>
<li><strong>Toàn vẹn (Integrity)</strong> — phát hiện mọi thay đổi trên dữ liệu (hàm băm, MAC).</li>
<li><strong>Xác thực (Authenticity)</strong> — chứng minh ai gửi và dữ liệu không bị giả mạo (chữ ký, chứng thư).</li>
</ul>
<h3>Thuật ngữ cốt lõi</h3>
<pre><code>bản rõ    --[ Mã hoá(khoá) ]--&gt;  bản mã
bản mã    --[ Giải mã(khoá) ]--&gt;  bản rõ
</code></pre>
<p><strong>Nguyên lý Kerckhoffs:</strong> hệ thống phải an toàn ngay cả khi mọi thứ về nó công khai <em>trừ khoá</em>. An toàn nằm ở khoá, không bao giờ ở một thuật toán bí mật.</p>
<h3>Lộ trình</h3>
<p>Mã cổ điển &amp; thám mã → đối xứng (khối &amp; dòng) → lý thuyết số → bất đối xứng (RSA, Diffie-Hellman, ECC) → băm &amp; MAC → chữ ký số &amp; PKI → mật mã ứng dụng (TLS, VPN, mã hoá đầu-cuối). Song ngữ, có ví dụ và quiz.</p>`,
  ]]);

const c1 = doc('cac301-1-1-classical', '1.1 — Cryptography overview & classical ciphers|||1.1 — Tổng quan mật mã & mã cổ điển',
  'CIA & thuật ngữ; mã thay thế Caesar, Vigenère; nguyên lý Kerckhoffs; thám mã bằng phân tích tần suất.',
  [[
    `<span class="eyebrow">CAC301 · Chapter 1 · Lesson 1.1</span>
<h2>Cryptography overview &amp; classical ciphers</h2>
<h3>Classical substitution ciphers</h3>
<ul>
<li><strong>Caesar cipher</strong> — shift every letter by a fixed amount k. With k = 3, A becomes D. There are only 25 keys, so it is trivially broken by brute force.</li>
<li><strong>Vigenère cipher</strong> — a Caesar shift that changes per letter, driven by a repeating keyword. It hid the letter frequencies for centuries, but a repeating key leaks its length (Kasiski examination), and each column is then a simple Caesar.</li>
</ul>
<pre><code>Caesar, shift k = 3:
  plaintext : H E L L O
  ciphertext: K H O O R
  formula   : c = (p + k) mod 26
</code></pre>
<h3>Cryptanalysis: frequency analysis</h3>
<p>In English, <strong>E</strong> is the most common letter (~12.7%), then T, A, O. A simple substitution keeps these frequencies, so counting symbols in the ciphertext reveals the mapping. This is why <em>any</em> cipher whose output preserves the statistics of the plaintext is weak.</p>
<div class="callout"><span class="badge">The lesson</span> Classical ciphers fail because their structure survives into the ciphertext. Modern ciphers aim to make output look like uniform random noise — no pattern to count.</div>`,
    `<span class="eyebrow">CAC301 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan mật mã &amp; mã cổ điển</h2>
<h3>Mã thay thế cổ điển</h3>
<ul>
<li><strong>Mã Caesar</strong> — dịch mỗi chữ cái đi một lượng cố định k. Với k = 3, A thành D. Chỉ có 25 khoá nên vét cạn là phá được ngay.</li>
<li><strong>Mã Vigenère</strong> — mã Caesar nhưng lượng dịch thay đổi theo từng chữ, dẫn bởi một từ khoá lặp. Nó giấu được tần suất chữ suốt nhiều thế kỷ, nhưng khoá lặp làm lộ độ dài (phân tích Kasiski), và mỗi cột khi đó chỉ là một Caesar.</li>
</ul>
<pre><code>Caesar, dịch k = 3:
  bản rõ : H E L L O
  bản mã : K H O O R
  công thức: c = (p + k) mod 26
</code></pre>
<h3>Thám mã: phân tích tần suất</h3>
<p>Trong tiếng Anh, <strong>E</strong> là chữ hay gặp nhất (~12,7%), rồi T, A, O. Mã thay thế đơn giữ nguyên các tần suất này, nên đếm ký hiệu trong bản mã sẽ lộ ra ánh xạ. Vì thế <em>bất kỳ</em> mã nào để lại thống kê của bản rõ trong đầu ra đều yếu.</p>
<div class="callout"><span class="badge">Bài học</span> Mã cổ điển thất bại vì cấu trúc của nó sống sót vào bản mã. Mã hiện đại nhắm cho đầu ra trông như nhiễu ngẫu nhiên đều — không còn mẫu để đếm.</div>`,
  ]]);

const c1q = quiz('cac301-quiz-1', 'Quiz 1 — Classical ciphers|||Quiz 1 — Mã cổ điển', [
  { id: 'q1', question: 'Nguyên lý Kerckhoffs nói an toàn của hệ mật phải nằm ở đâu?', options: ['Ở thuật toán bí mật', 'Ở khoá', 'Ở độ dài bản rõ', 'Ở tốc độ mã hoá'], correctIndex: 1, explanation: 'Hệ phải an toàn kể cả khi mọi thứ công khai trừ khoá.' },
  { id: 'q2', question: 'Mã Caesar bị phá dễ nhất bằng cách nào?', options: ['Phân tích Kasiski', 'Vét cạn 25 khoá', 'Tấn công sinh nhật', 'Phân tích thừa số'], correctIndex: 1, explanation: 'Không gian khoá chỉ 25 nên vét cạn là xong.' },
  { id: 'q3', question: 'Phân tích tần suất khai thác điều gì?', options: ['Khoá quá dài', 'Bản mã giữ thống kê chữ của bản rõ', 'Số nguyên tố nhỏ', 'Chế độ ECB'], correctIndex: 1, explanation: 'Mã thay thế đơn giữ tần suất chữ, đếm là lộ ánh xạ.' },
]);

const c2 = doc('cac301-2-1-block', '2.1 — Symmetric block ciphers|||2.1 — Mã đối xứng: mã khối',
  'Mã khối (block cipher), DES & AES; mạng thay thế-hoán vị; chế độ ECB/CBC/CTR; IV & padding.',
  [[
    `<span class="eyebrow">CAC301 · Chapter 2 · Lesson 2.1</span>
<h2>Symmetric block ciphers</h2>
<p><strong>Symmetric</strong> means the same secret key encrypts and decrypts. A <strong>block cipher</strong> transforms a fixed-size block (e.g. 128 bits) using rounds of substitution and permutation to achieve <em>confusion</em> (hide the key relation) and <em>diffusion</em> (spread each input bit over many output bits).</p>
<h3>DES vs AES</h3>
<ul>
<li><strong>DES</strong> — 64-bit block, 56-bit key. Its key is now far too short and it is broken by brute force; kept only for history and 3DES legacy.</li>
<li><strong>AES</strong> — 128-bit block, key of 128/192/256 bits. The current worldwide standard (FIPS 197); a substitution-permutation network with 10/12/14 rounds.</li>
</ul>
<h3>Modes of operation</h3>
<p>A block cipher alone only handles one block. A <strong>mode</strong> chains blocks to encrypt a whole message:</p>
<ul>
<li><strong>ECB</strong> — each block encrypted independently. <em>Insecure:</em> identical plaintext blocks give identical ciphertext, leaking patterns. Avoid.</li>
<li><strong>CBC</strong> — each block is XORed with the previous ciphertext before encryption; needs a random <strong>IV</strong> and padding.</li>
<li><strong>CTR</strong> — encrypts a counter and XORs it with the data, turning the block cipher into a stream; parallelisable, no padding.</li>
</ul>
<pre><code>CBC: C[i] = Encrypt(key, P[i] XOR C[i-1]),  C[0] uses a random IV
CTR: C[i] = P[i] XOR Encrypt(key, nonce || counter++)
</code></pre>
<div class="callout"><span class="badge">Never ECB</span> The classic "ECB penguin" image stays recognisable after encryption because ECB leaks repetition. Real systems use CBC or, better, an authenticated mode like GCM.</div>`,
    `<span class="eyebrow">CAC301 · Chương 2 · Bài 2.1</span>
<h2>Mã đối xứng: mã khối</h2>
<p><strong>Đối xứng</strong> nghĩa là cùng một khoá bí mật dùng để mã hoá và giải mã. <strong>Mã khối</strong> biến đổi một khối kích thước cố định (vd 128 bit) qua nhiều vòng thay thế và hoán vị để đạt <em>gây rối (confusion)</em> (che quan hệ với khoá) và <em>khuếch tán (diffusion)</em> (rải mỗi bit vào nhiều bit đầu ra).</p>
<h3>DES và AES</h3>
<ul>
<li><strong>DES</strong> — khối 64 bit, khoá 56 bit. Khoá nay quá ngắn, bị vét cạn; chỉ còn giữ vì lịch sử và 3DES cũ.</li>
<li><strong>AES</strong> — khối 128 bit, khoá 128/192/256 bit. Chuẩn toàn cầu hiện nay (FIPS 197); là mạng thay thế-hoán vị 10/12/14 vòng.</li>
</ul>
<h3>Các chế độ hoạt động</h3>
<p>Riêng mã khối chỉ xử lý được một khối. Một <strong>chế độ</strong> nối các khối để mã cả thông điệp:</p>
<ul>
<li><strong>ECB</strong> — mã từng khối độc lập. <em>Không an toàn:</em> khối bản rõ giống nhau cho ra bản mã giống nhau, lộ mẫu. Tránh dùng.</li>
<li><strong>CBC</strong> — mỗi khối XOR với bản mã trước rồi mới mã; cần <strong>IV</strong> ngẫu nhiên và padding.</li>
<li><strong>CTR</strong> — mã một bộ đếm rồi XOR với dữ liệu, biến mã khối thành mã dòng; chạy song song, không cần padding.</li>
</ul>
<pre><code>CBC: C[i] = Encrypt(khoá, P[i] XOR C[i-1]),  C[0] dùng IV ngẫu nhiên
CTR: C[i] = P[i] XOR Encrypt(khoá, nonce || counter++)
</code></pre>
<div class="callout"><span class="badge">Đừng dùng ECB</span> Ảnh "chim cánh cụt ECB" kinh điển vẫn nhận ra được sau mã hoá vì ECB lộ sự lặp lại. Hệ thống thật dùng CBC hoặc tốt hơn là chế độ có xác thực như GCM.</div>`,
  ]]);

const c2q = quiz('cac301-quiz-2', 'Quiz 2 — Block ciphers|||Quiz 2 — Mã khối', [
  { id: 'q1', question: 'Chuẩn mã khối toàn cầu hiện nay là?', options: ['DES', 'AES', 'RC4', 'RSA'], correctIndex: 1, explanation: 'AES (FIPS 197), khối 128 bit, khoá 128/192/256 bit.' },
  { id: 'q2', question: 'Vì sao chế độ ECB không an toàn?', options: ['Khoá quá dài', 'Khối bản rõ giống nhau cho bản mã giống nhau', 'Không dùng số nguyên tố', 'Quá chậm'], correctIndex: 1, explanation: 'ECB lộ mẫu lặp vì mã từng khối độc lập.' },
  { id: 'q3', question: 'Chế độ nào biến mã khối thành mã dòng và chạy song song?', options: ['ECB', 'CBC', 'CTR', 'DES'], correctIndex: 2, explanation: 'CTR mã bộ đếm rồi XOR với dữ liệu, không cần padding.' },
]);

const c3 = doc('cac301-3-1-stream', '3.1 — Symmetric stream ciphers|||3.1 — Mã đối xứng: mã dòng',
  'Mã dòng (stream cipher) & keystream; one-time pad và tính bí mật hoàn hảo; RC4 và vì sao nó lỗi thời; luật không tái dùng nonce/keystream.',
  [[
    `<span class="eyebrow">CAC301 · Chapter 3 · Lesson 3.1</span>
<h2>Symmetric stream ciphers</h2>
<p>A <strong>stream cipher</strong> generates a long pseudo-random <strong>keystream</strong> from the key and XORs it with the plaintext, one bit or byte at a time. It suits data of unknown length and low-latency links.</p>
<h3>The one-time pad (OTP)</h3>
<p>If the keystream is <em>truly random</em>, as long as the message, and <em>never reused</em>, the result is the <strong>one-time pad</strong> — proven to have <strong>perfect secrecy</strong> (the ciphertext reveals nothing about the plaintext). It is unbreakable, but impractical: the key is as large as all the data and can be used only once.</p>
<pre><code>OTP:  C = P XOR K        (K random, len(K) = len(P), used once)
Reuse trap:  C1 XOR C2 = P1 XOR P2   -&gt; the key cancels, plaintext leaks
</code></pre>
<h3>RC4 and the reuse rule</h3>
<p><strong>RC4</strong> was a fast, simple stream cipher used in early WEP and TLS, but it has statistical biases in its keystream and is now <strong>deprecated</strong> — never use it. The deeper rule for every stream cipher: <strong>never reuse a keystream</strong> (same key + same nonce). Reuse lets an attacker XOR two ciphertexts and cancel the key, exposing both plaintexts — exactly how WEP fell.</p>
<div class="callout"><span class="badge">The golden rule</span> Perfect secrecy needs a random, one-time, message-length key. Real stream ciphers approximate this with a pseudo-random keystream — and die the moment a nonce repeats.</div>`,
    `<span class="eyebrow">CAC301 · Chương 3 · Bài 3.1</span>
<h2>Mã đối xứng: mã dòng</h2>
<p>Một <strong>mã dòng</strong> sinh một <strong>keystream</strong> giả ngẫu nhiên rất dài từ khoá rồi XOR với bản rõ, từng bit hoặc từng byte. Nó hợp với dữ liệu không rõ độ dài và đường truyền cần độ trễ thấp.</p>
<h3>One-time pad (OTP)</h3>
<p>Nếu keystream <em>thật sự ngẫu nhiên</em>, dài bằng thông điệp và <em>không bao giờ tái dùng</em>, ta có <strong>one-time pad</strong> — đã chứng minh có <strong>bí mật hoàn hảo</strong> (bản mã không tiết lộ gì về bản rõ). Nó bất khả phá, nhưng bất tiện: khoá to bằng toàn bộ dữ liệu và chỉ dùng được một lần.</p>
<pre><code>OTP:  C = P XOR K        (K ngẫu nhiên, len(K) = len(P), dùng một lần)
Bẫy tái dùng:  C1 XOR C2 = P1 XOR P2   -&gt; khoá triệt tiêu, lộ bản rõ
</code></pre>
<h3>RC4 và luật không tái dùng</h3>
<p><strong>RC4</strong> là mã dòng nhanh, đơn giản, từng dùng trong WEP và TLS đời đầu, nhưng keystream của nó lệch thống kê và nay đã <strong>lỗi thời</strong> — đừng dùng. Luật sâu hơn cho mọi mã dòng: <strong>không bao giờ tái dùng keystream</strong> (cùng khoá + cùng nonce). Tái dùng cho phép kẻ tấn công XOR hai bản mã để triệt tiêu khoá, lộ cả hai bản rõ — đúng cách WEP sụp đổ.</p>
<div class="callout"><span class="badge">Luật vàng</span> Bí mật hoàn hảo cần khoá ngẫu nhiên, một lần, dài bằng thông điệp. Mã dòng thật xấp xỉ điều này bằng keystream giả ngẫu nhiên — và chết ngay khi một nonce lặp lại.</div>`,
  ]]);

const c3q = quiz('cac301-quiz-3', 'Quiz 3 — Stream ciphers|||Quiz 3 — Mã dòng', [
  { id: 'q1', question: 'One-time pad đạt bí mật hoàn hảo khi khoá thế nào?', options: ['Ngắn và tái dùng', 'Ngẫu nhiên, dài bằng thông điệp, dùng một lần', 'Là số nguyên tố', 'Được công khai'], correctIndex: 1, explanation: 'Khoá random, một lần, dài bằng bản rõ mới cho perfect secrecy.' },
  { id: 'q2', question: 'Tái dùng keystream (cùng khoá + nonce) gây hậu quả gì?', options: ['Chạy nhanh hơn', 'XOR hai bản mã triệt tiêu khoá, lộ bản rõ', 'Khoá dài ra', 'Không ảnh hưởng'], correctIndex: 1, explanation: 'C1 XOR C2 = P1 XOR P2, khoá biến mất.' },
  { id: 'q3', question: 'RC4 ngày nay nên?', options: ['Dùng cho TLS mới', 'Tránh dùng vì đã lỗi thời', 'Thay cho AES', 'Dùng làm hàm băm'], correctIndex: 1, explanation: 'RC4 có lệch thống kê keystream, đã deprecated.' },
]);

const c4 = doc('cac301-4-1-number-theory', '4.1 — Number theory for cryptography|||4.1 — Lý thuyết số cho mật mã',
  'Số học mô-đun; số nguyên tố & phân tích thừa số; hàm Euler phi; định lý nhỏ Fermat & định lý Euler; nghịch đảo mô-đun — nền của mã khoá công khai.',
  [[
    `<span class="eyebrow">CAC301 · Chapter 4 · Lesson 4.1</span>
<h2>Number theory for cryptography</h2>
<p>Public-key cryptography rests on arithmetic with remainders. This chapter gives the tools RSA and Diffie-Hellman need.</p>
<h3>Modular arithmetic</h3>
<p><strong>a mod n</strong> is the remainder of a divided by n — arithmetic that "wraps around" like a clock. Addition, multiplication and exponentiation all work modulo n, keeping numbers bounded.</p>
<h3>Primes &amp; factoring</h3>
<p>A <strong>prime</strong> has no divisors but 1 and itself. Multiplying two large primes is easy; <em>factoring</em> the product back is believed hard — this one-way gap is the hard problem behind RSA.</p>
<h3>Euler's totient, Fermat &amp; Euler</h3>
<ul>
<li><strong>Euler's totient</strong> phi(n) counts integers below n that are coprime to n. For a prime p, phi(p) = p - 1; for n = p*q, phi(n) = (p-1)(q-1).</li>
<li><strong>Fermat's little theorem:</strong> if p is prime and a is not a multiple of p, then a^(p-1) is congruent to 1 (mod p).</li>
<li><strong>Euler's theorem</strong> generalises it: a^phi(n) is congruent to 1 (mod n) when gcd(a, n) = 1 — this is exactly why RSA decryption undoes encryption.</li>
</ul>
<pre><code>Example (Fermat, p = 7, a = 3):
  3^(7-1) = 3^6 = 729 = 104*7 + 1  -&gt;  729 mod 7 = 1
Modular inverse: e*d congruent to 1 (mod phi(n))  (the RSA key relation)
</code></pre>
<div class="callout"><span class="badge">Why it matters</span> RSA works because exponentiation modulo n is reversible with the right exponent (Euler's theorem), yet finding that exponent needs phi(n), which needs the factors — the part an attacker cannot get.</div>`,
    `<span class="eyebrow">CAC301 · Chương 4 · Bài 4.1</span>
<h2>Lý thuyết số cho mật mã</h2>
<p>Mật mã khoá công khai dựa trên số học với số dư. Chương này cung cấp công cụ mà RSA và Diffie-Hellman cần.</p>
<h3>Số học mô-đun</h3>
<p><strong>a mod n</strong> là số dư của a chia n — phép toán "quấn vòng" như mặt đồng hồ. Cộng, nhân và luỹ thừa đều làm theo mô-đun n, giữ các số trong giới hạn.</p>
<h3>Số nguyên tố &amp; phân tích thừa số</h3>
<p>Một <strong>số nguyên tố</strong> không có ước nào ngoài 1 và chính nó. Nhân hai số nguyên tố lớn thì dễ; <em>phân tích</em> tích đó ra lại được cho là khó — khoảng cách một chiều này là bài toán khó sau RSA.</p>
<h3>Hàm Euler, Fermat &amp; Euler</h3>
<ul>
<li><strong>Hàm Euler</strong> phi(n) đếm các số nhỏ hơn n mà nguyên tố cùng nhau với n. Với p nguyên tố, phi(p) = p - 1; với n = p*q, phi(n) = (p-1)(q-1).</li>
<li><strong>Định lý nhỏ Fermat:</strong> nếu p nguyên tố và a không là bội của p thì a^(p-1) đồng dư 1 (mod p).</li>
<li><strong>Định lý Euler</strong> tổng quát hoá: a^phi(n) đồng dư 1 (mod n) khi gcd(a, n) = 1 — đây chính là lý do giải mã RSA hoàn tác được mã hoá.</li>
</ul>
<pre><code>Ví dụ (Fermat, p = 7, a = 3):
  3^(7-1) = 3^6 = 729 = 104*7 + 1  -&gt;  729 mod 7 = 1
Nghịch đảo mô-đun: e*d đồng dư 1 (mod phi(n))  (quan hệ khoá RSA)
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> RSA chạy được vì luỹ thừa theo mô-đun n đảo ngược được với đúng số mũ (định lý Euler), nhưng tìm số mũ đó cần phi(n), mà phi(n) cần các thừa số — thứ kẻ tấn công không có.</div>`,
  ]]);

const c4q = quiz('cac301-quiz-4', 'Quiz 4 — Number theory|||Quiz 4 — Lý thuyết số', [
  { id: 'q1', question: 'Với n = p*q (p, q nguyên tố), hàm Euler phi(n) bằng?', options: ['p*q', '(p-1)(q-1)', 'p+q', 'p-1'], correctIndex: 1, explanation: 'phi(p*q) = (p-1)(q-1), dùng để tính khoá RSA.' },
  { id: 'q2', question: 'Bài toán khó làm nền cho RSA là?', options: ['Sắp xếp mảng', 'Phân tích thừa số tích hai số nguyên tố lớn', 'Cộng mô-đun', 'Tìm số chẵn'], correctIndex: 1, explanation: 'Nhân dễ, phân tích ngược lại khó — khoảng cách một chiều.' },
  { id: 'q3', question: 'Định lý nhỏ Fermat: với p nguyên tố, a không là bội p thì a^(p-1) mod p =?', options: ['0', '1', 'p', 'a'], correctIndex: 1, explanation: 'a^(p-1) đồng dư 1 (mod p).' },
]);

const c5 = doc('cac301-5-1-asymmetric', '5.1 — Asymmetric (public-key) cryptography|||5.1 — Mã bất đối xứng (khoá công khai)',
  'Ý tưởng khoá công khai/riêng; RSA (sinh khoá, mã/giải mã); trao khoá Diffie-Hellman; mã đường cong elliptic (ECC) — khoá ngắn, an toàn tương đương.',
  [[
    `<span class="eyebrow">CAC301 · Chapter 5 · Lesson 5.1</span>
<h2>Asymmetric (public-key) cryptography</h2>
<p>Symmetric crypto has one problem: <em>how do two strangers share a key?</em> <strong>Public-key</strong> crypto solves it with a <strong>key pair</strong> — a <strong>public key</strong> anyone may use to encrypt (or verify), and a <strong>private key</strong> only the owner holds to decrypt (or sign).</p>
<h3>RSA</h3>
<ol>
<li>Pick two large primes p, q; let n = p*q and phi(n) = (p-1)(q-1).</li>
<li>Choose public exponent e coprime to phi(n) (often 65537); find d with e*d congruent to 1 (mod phi(n)).</li>
<li>Public key = (n, e); private key = (n, d).</li>
</ol>
<pre><code>Encrypt:  C = M^e mod n
Decrypt:  M = C^d mod n     (works by Euler's theorem)
</code></pre>
<h3>Diffie-Hellman key exchange</h3>
<p>Two parties agree on a shared secret over a public channel <em>without ever sending it</em>. Each picks a private number, exchanges g^(private) mod p, and raises the received value to their own private — both reach the same g^(ab) mod p. Its hardness is the <strong>discrete logarithm</strong> problem.</p>
<h3>Elliptic Curve Cryptography (ECC)</h3>
<p><strong>ECC</strong> does the same jobs over points on an elliptic curve, where the hard problem is even harder per bit — so a <strong>256-bit ECC key rivals a 3072-bit RSA key</strong>. Shorter keys mean faster maths and smaller certificates, which is why modern TLS prefers ECC.</p>
<div class="callout"><span class="badge">The trade-off</span> Asymmetric crypto is slow. In practice it is used only to exchange or protect a small symmetric key, then AES does the bulk encryption — this is "hybrid" cryptography.</div>`,
    `<span class="eyebrow">CAC301 · Chương 5 · Bài 5.1</span>
<h2>Mã bất đối xứng (khoá công khai)</h2>
<p>Mã đối xứng có một vấn đề: <em>hai người lạ chia sẻ khoá bằng cách nào?</em> Mã <strong>khoá công khai</strong> giải quyết bằng một <strong>cặp khoá</strong> — <strong>khoá công khai</strong> ai cũng dùng để mã hoá (hoặc kiểm tra), và <strong>khoá riêng</strong> chỉ chủ nhân giữ để giải mã (hoặc ký).</p>
<h3>RSA</h3>
<ol>
<li>Chọn hai số nguyên tố lớn p, q; đặt n = p*q và phi(n) = (p-1)(q-1).</li>
<li>Chọn số mũ công khai e nguyên tố cùng nhau với phi(n) (thường 65537); tìm d sao cho e*d đồng dư 1 (mod phi(n)).</li>
<li>Khoá công khai = (n, e); khoá riêng = (n, d).</li>
</ol>
<pre><code>Mã hoá:  C = M^e mod n
Giải mã: M = C^d mod n     (đúng nhờ định lý Euler)
</code></pre>
<h3>Trao khoá Diffie-Hellman</h3>
<p>Hai bên thống nhất một bí mật chung qua kênh công khai <em>mà không bao giờ gửi nó đi</em>. Mỗi bên chọn một số riêng, trao đổi g^(riêng) mod p, rồi nâng giá trị nhận được lên số riêng của mình — cả hai đạt cùng g^(ab) mod p. Độ khó của nó là bài toán <strong>logarit rời rạc</strong>.</p>
<h3>Mã đường cong elliptic (ECC)</h3>
<p><strong>ECC</strong> làm cùng những việc đó trên các điểm của đường cong elliptic, nơi bài toán khó còn khó hơn tính theo mỗi bit — nên một <strong>khoá ECC 256 bit ngang khoá RSA 3072 bit</strong>. Khoá ngắn hơn nghĩa là tính nhanh hơn và chứng thư nhỏ hơn, vì thế TLS hiện đại ưa ECC.</p>
<div class="callout"><span class="badge">Đánh đổi</span> Mã bất đối xứng chậm. Thực tế nó chỉ dùng để trao đổi hoặc bảo vệ một khoá đối xứng nhỏ, rồi AES mã phần lớn dữ liệu — đây là mật mã "lai" (hybrid).</div>`,
  ]]);

const c5q = quiz('cac301-quiz-5', 'Quiz 5 — Public-key|||Quiz 5 — Khoá công khai', [
  { id: 'q1', question: 'Trong RSA, khoá nào dùng để giải mã?', options: ['Khoá công khai (n, e)', 'Khoá riêng (n, d)', 'IV', 'Nonce'], correctIndex: 1, explanation: 'Chỉ chủ nhân giữ khoá riêng (n, d) để giải mã: M = C^d mod n.' },
  { id: 'q2', question: 'Độ an toàn của Diffie-Hellman dựa vào bài toán nào?', options: ['Phân tích thừa số', 'Logarit rời rạc', 'Sắp xếp', 'Va chạm băm'], correctIndex: 1, explanation: 'DH dựa vào độ khó của logarit rời rạc.' },
  { id: 'q3', question: 'Lợi thế chính của ECC so với RSA là?', options: ['An toàn tương đương với khoá ngắn hơn nhiều', 'Không cần khoá', 'Nhanh hơn AES', 'Không cần số nguyên tố'], correctIndex: 0, explanation: 'ECC 256-bit ngang RSA 3072-bit — khoá ngắn, tính nhanh.' },
]);

const c6 = doc('cac301-6-1-hash-mac', '6.1 — Hash functions & integrity|||6.1 — Hàm băm & toàn vẹn',
  'Hàm băm mật mã (SHA-2/SHA-3); ba tính chất & chống va chạm; tấn công sinh nhật; MAC & HMAC cho toàn vẹn + xác thực; băm mật khẩu (salt).',
  [[
    `<span class="eyebrow">CAC301 · Chapter 6 · Lesson 6.1</span>
<h2>Hash functions &amp; integrity</h2>
<p>A <strong>cryptographic hash</strong> maps any input to a fixed-size digest (e.g. SHA-256 gives 256 bits). It is the workhorse of integrity: change one bit of the input and the digest changes completely.</p>
<h3>The three required properties</h3>
<ul>
<li><strong>Pre-image resistance</strong> — given a hash, you cannot find an input that produces it.</li>
<li><strong>Second pre-image resistance</strong> — given an input, you cannot find a different one with the same hash.</li>
<li><strong>Collision resistance</strong> — you cannot find <em>any</em> two inputs with the same hash. MD5 and SHA-1 are broken here; use <strong>SHA-256</strong> or <strong>SHA-3</strong>.</li>
</ul>
<p>The <strong>birthday attack</strong> means collisions appear after roughly 2^(n/2) tries, so an n-bit hash gives only n/2 bits of collision security — a reason digests are 256 bits, not 128.</p>
<h3>MAC and HMAC</h3>
<p>A plain hash proves integrity but not <em>who</em> sent the data — an attacker who changes the message can recompute the hash. A <strong>MAC</strong> (Message Authentication Code) mixes a <em>secret key</em> into the hash, so only key-holders can produce or verify it. <strong>HMAC</strong> is the standard construction: HMAC(K, m) = H((K xor opad) || H((K xor ipad) || m)).</p>
<pre><code>Password storage: store salt + HMAC/bcrypt/Argon2 of the password
  never store the raw password, never a plain unsalted hash
</code></pre>
<div class="callout"><span class="badge">Hash vs MAC</span> A hash gives integrity; a MAC gives integrity AND authenticity. If a message could be tampered with in transit, you need a MAC (or a signature), not a bare hash.</div>`,
    `<span class="eyebrow">CAC301 · Chương 6 · Bài 6.1</span>
<h2>Hàm băm &amp; toàn vẹn</h2>
<p>Một <strong>hàm băm mật mã</strong> ánh xạ đầu vào bất kỳ thành một digest kích thước cố định (vd SHA-256 cho 256 bit). Nó là chủ lực của toàn vẹn: đổi một bit đầu vào là digest đổi hoàn toàn.</p>
<h3>Ba tính chất bắt buộc</h3>
<ul>
<li><strong>Chống tiền ảnh</strong> — cho một giá trị băm, không tìm được đầu vào tạo ra nó.</li>
<li><strong>Chống tiền ảnh thứ hai</strong> — cho một đầu vào, không tìm được đầu vào khác cùng giá trị băm.</li>
<li><strong>Chống va chạm</strong> — không tìm được <em>bất kỳ</em> hai đầu vào cùng giá trị băm. MD5 và SHA-1 đã vỡ ở đây; hãy dùng <strong>SHA-256</strong> hoặc <strong>SHA-3</strong>.</li>
</ul>
<p><strong>Tấn công sinh nhật</strong> khiến va chạm xuất hiện sau khoảng 2^(n/2) lần thử, nên hàm băm n bit chỉ cho n/2 bit an toàn va chạm — lý do digest dài 256 bit chứ không phải 128.</p>
<h3>MAC và HMAC</h3>
<p>Băm thường chứng minh toàn vẹn nhưng không chứng minh <em>ai</em> gửi — kẻ tấn công đổi thông điệp rồi tính lại băm. Một <strong>MAC</strong> (Mã xác thực thông điệp) trộn một <em>khoá bí mật</em> vào băm, nên chỉ người có khoá mới tạo hoặc kiểm được. <strong>HMAC</strong> là cấu trúc chuẩn: HMAC(K, m) = H((K xor opad) || H((K xor ipad) || m)).</p>
<pre><code>Lưu mật khẩu: lưu salt + HMAC/bcrypt/Argon2 của mật khẩu
  đừng bao giờ lưu mật khẩu thô, đừng lưu băm trơn không salt
</code></pre>
<div class="callout"><span class="badge">Băm và MAC</span> Băm cho toàn vẹn; MAC cho toàn vẹn VÀ xác thực. Nếu thông điệp có thể bị sửa trên đường truyền, bạn cần MAC (hoặc chữ ký), không phải băm trơn.</div>`,
  ]]);

const c6q = quiz('cac301-quiz-6', 'Quiz 6 — Hash & MAC|||Quiz 6 — Băm & MAC', [
  { id: 'q1', question: 'Tính chất "không tìm được hai đầu vào cùng giá trị băm" gọi là?', options: ['Chống tiền ảnh', 'Chống va chạm', 'Khuếch tán', 'Perfect secrecy'], correctIndex: 1, explanation: 'Đó là chống va chạm (collision resistance).' },
  { id: 'q2', question: 'Điểm khác của MAC/HMAC so với băm trơn là?', options: ['Nhanh hơn', 'Trộn khoá bí mật nên có thêm xác thực', 'Không cần đầu vào', 'Cho digest ngắn hơn'], correctIndex: 1, explanation: 'MAC trộn khoá bí mật → toàn vẹn + xác thực.' },
  { id: 'q3', question: 'Hàm băm nào KHÔNG nên dùng vì đã vỡ chống va chạm?', options: ['SHA-256', 'SHA-3', 'MD5 và SHA-1', 'HMAC'], correctIndex: 2, explanation: 'MD5, SHA-1 đã bị tìm ra va chạm — dùng SHA-256/SHA-3.' },
]);

const c7 = doc('cac301-7-1-signatures-pki', '7.1 — Digital signatures & certificates|||7.1 — Chữ ký số & chứng thực',
  'Chữ ký số (ký bằng khoá riêng, kiểm bằng khoá công khai); chống chối bỏ; PKI & Certificate Authority; chứng thư X.509; chuỗi tin cậy.',
  [[
    `<span class="eyebrow">CAC301 · Chapter 7 · Lesson 7.1</span>
<h2>Digital signatures &amp; certificates</h2>
<h3>Digital signatures</h3>
<p>A <strong>digital signature</strong> flips public-key crypto around: you <em>sign</em> with your <strong>private key</strong> and anyone <em>verifies</em> with your <strong>public key</strong>. Because only you hold the private key, a valid signature proves <strong>authenticity, integrity and non-repudiation</strong> — you cannot later deny signing.</p>
<pre><code>Sign:   signature = Encrypt_private( Hash(message) )
Verify: Hash(message)  ==  Decrypt_public( signature )  ?
</code></pre>
<p>You sign the <em>hash</em>, not the whole message, for speed. Common schemes: RSA-PSS, ECDSA, Ed25519.</p>
<h3>The trust problem &amp; PKI</h3>
<p>A public key is useless if you cannot be sure <em>whose</em> it is. <strong>Public Key Infrastructure (PKI)</strong> solves this with trusted <strong>Certificate Authorities (CAs)</strong> that vouch for the binding between an identity and a public key.</p>
<h3>X.509 certificates &amp; the chain of trust</h3>
<p>An <strong>X.509 certificate</strong> is a signed document stating "this public key belongs to this domain/person", signed by a CA's private key. Your browser trusts a small set of <strong>root CAs</strong>; each certificate is verified up a <strong>chain</strong> to one of those roots. This is what the padlock in HTTPS checks.</p>
<div class="callout"><span class="badge">Encrypt vs sign</span> Encrypt with the recipient's PUBLIC key (only they can read). Sign with YOUR OWN PRIVATE key (anyone can verify). Mixing these up is the classic beginner mistake.</div>`,
    `<span class="eyebrow">CAC301 · Chương 7 · Bài 7.1</span>
<h2>Chữ ký số &amp; chứng thực</h2>
<h3>Chữ ký số</h3>
<p>Một <strong>chữ ký số</strong> lật ngược mã khoá công khai: bạn <em>ký</em> bằng <strong>khoá riêng</strong> và ai cũng <em>kiểm</em> bằng <strong>khoá công khai</strong> của bạn. Vì chỉ bạn giữ khoá riêng, một chữ ký hợp lệ chứng minh <strong>xác thực, toàn vẹn và chống chối bỏ</strong> — sau này không thể chối là đã ký.</p>
<pre><code>Ký:   chữ_ký = Mã_khoá_riêng( Băm(thông điệp) )
Kiểm: Băm(thông điệp)  ==  Giải_khoá_công_khai( chữ_ký )  ?
</code></pre>
<p>Ta ký <em>giá trị băm</em>, không ký cả thông điệp, cho nhanh. Sơ đồ phổ biến: RSA-PSS, ECDSA, Ed25519.</p>
<h3>Bài toán tin cậy &amp; PKI</h3>
<p>Một khoá công khai vô dụng nếu không chắc nó <em>của ai</em>. <strong>Hạ tầng khoá công khai (PKI)</strong> giải quyết bằng các <strong>Nhà cấp chứng thư (CA)</strong> đáng tin, đứng ra bảo chứng ràng buộc giữa một danh tính và một khoá công khai.</p>
<h3>Chứng thư X.509 &amp; chuỗi tin cậy</h3>
<p>Một <strong>chứng thư X.509</strong> là một tài liệu có chữ ký nói "khoá công khai này thuộc về tên miền/người này", được ký bằng khoá riêng của CA. Trình duyệt tin một tập nhỏ các <strong>CA gốc</strong>; mỗi chứng thư được kiểm ngược theo một <strong>chuỗi</strong> tới một gốc. Đây chính là thứ ổ khoá HTTPS đang kiểm.</p>
<div class="callout"><span class="badge">Mã hoá và ký</span> Mã hoá bằng khoá CÔNG KHAI của người nhận (chỉ họ đọc được). Ký bằng khoá RIÊNG của CHÍNH BẠN (ai cũng kiểm được). Nhầm hai cái này là lỗi kinh điển của người mới.</div>`,
  ]]);

const c7q = quiz('cac301-quiz-7', 'Quiz 7 — Signatures & PKI|||Quiz 7 — Chữ ký & PKI', [
  { id: 'q1', question: 'Để tạo chữ ký số, người ký dùng khoá nào?', options: ['Khoá công khai của mình', 'Khoá riêng của mình', 'Khoá công khai người nhận', 'Khoá đối xứng'], correctIndex: 1, explanation: 'Ký bằng khoá riêng; ai cũng kiểm bằng khoá công khai của người ký.' },
  { id: 'q2', question: 'Chứng thư X.509 dùng để?', options: ['Nén dữ liệu', 'Ràng buộc một danh tính với một khoá công khai, được CA ký', 'Sinh số ngẫu nhiên', 'Thay cho AES'], correctIndex: 1, explanation: 'X.509 do CA ký, chứng nhận khoá công khai thuộc về ai.' },
  { id: 'q3', question: 'Tính chất chỉ chữ ký số cho được (băm/MAC không) là?', options: ['Bí mật', 'Chống chối bỏ (non-repudiation)', 'Tốc độ', 'Nén'], correctIndex: 1, explanation: 'Chỉ chủ khoá riêng ký được nên không thể chối bỏ.' },
]);

const c8 = doc('cac301-8-1-applied', '8.1 — Applied cryptography|||8.1 — Mật mã ứng dụng',
  'Mã hoá lai trong TLS/SSL (handshake, certificate, khoá phiên); VPN; mã hoá đầu-cuối (E2EE); quản lý khoá & thực hành an toàn.',
  [[
    `<span class="eyebrow">CAC301 · Chapter 8 · Lesson 8.1</span>
<h2>Applied cryptography</h2>
<p>Real systems combine every tool from this course. Here is how they fit together.</p>
<h3>TLS/SSL — the padlock</h3>
<p><strong>TLS</strong> secures HTTPS. Its handshake is <strong>hybrid crypto</strong> in action:</p>
<ol>
<li>The server presents an <strong>X.509 certificate</strong>; the client verifies the chain to a trusted root.</li>
<li>Both sides run an <strong>(EC)DHE key exchange</strong> to agree a fresh symmetric <strong>session key</strong> (forward secrecy).</li>
<li>The rest of the traffic is <strong>AES-GCM</strong> — fast symmetric encryption plus built-in authentication.</li>
</ol>
<h3>VPN &amp; end-to-end encryption</h3>
<ul>
<li><strong>VPN</strong> (IPsec, WireGuard) builds an encrypted tunnel between networks or devices, protecting all traffic in transit.</li>
<li><strong>End-to-end encryption (E2EE)</strong> — as in Signal or WhatsApp — encrypts on the sender's device and decrypts only on the recipient's, so not even the server can read it.</li>
</ul>
<h3>Key management &amp; safe practice</h3>
<ul>
<li>Use a <strong>CSPRNG</strong> for all keys, IVs and nonces — never <code>Math.random</code>.</li>
<li><strong>Don't roll your own crypto</strong> — use vetted libraries (libsodium, WebCrypto) and standard modes (AES-GCM).</li>
<li>Rotate keys, store them in a KMS/HSM or vault, and never hard-code secrets in source.</li>
</ul>
<div class="callout"><span class="badge">The big picture</span> Asymmetric crypto authenticates and shares a key; symmetric crypto does the bulk work; hashes and MACs guarantee integrity. Every secure protocol you use is these pieces, assembled correctly.</div>`,
    `<span class="eyebrow">CAC301 · Chương 8 · Bài 8.1</span>
<h2>Mật mã ứng dụng</h2>
<p>Hệ thống thật kết hợp mọi công cụ trong môn này. Đây là cách chúng ghép lại.</p>
<h3>TLS/SSL — cái ổ khoá</h3>
<p><strong>TLS</strong> bảo vệ HTTPS. Bắt tay (handshake) của nó là <strong>mã hoá lai</strong> trong thực tế:</p>
<ol>
<li>Máy chủ trình một <strong>chứng thư X.509</strong>; máy khách kiểm chuỗi tới một gốc tin cậy.</li>
<li>Hai bên chạy <strong>trao khoá (EC)DHE</strong> để thống nhất một <strong>khoá phiên</strong> đối xứng mới (forward secrecy).</li>
<li>Phần lưu lượng còn lại dùng <strong>AES-GCM</strong> — mã đối xứng nhanh kèm xác thực sẵn.</li>
</ol>
<h3>VPN &amp; mã hoá đầu-cuối</h3>
<ul>
<li><strong>VPN</strong> (IPsec, WireGuard) dựng một đường hầm mã hoá giữa các mạng hoặc thiết bị, bảo vệ toàn bộ lưu lượng trên đường truyền.</li>
<li><strong>Mã hoá đầu-cuối (E2EE)</strong> — như Signal hay WhatsApp — mã trên máy người gửi và chỉ giải trên máy người nhận, nên ngay cả máy chủ cũng không đọc được.</li>
</ul>
<h3>Quản lý khoá &amp; thực hành an toàn</h3>
<ul>
<li>Dùng <strong>CSPRNG</strong> cho mọi khoá, IV và nonce — đừng bao giờ dùng <code>Math.random</code>.</li>
<li><strong>Đừng tự chế mật mã</strong> — dùng thư viện đã kiểm định (libsodium, WebCrypto) và chế độ chuẩn (AES-GCM).</li>
<li>Xoay khoá, lưu trong KMS/HSM hoặc vault, và không bao giờ nhúng cứng bí mật vào mã nguồn.</li>
</ul>
<div class="callout"><span class="badge">Bức tranh lớn</span> Mã bất đối xứng xác thực và chia khoá; mã đối xứng làm phần nặng; băm và MAC bảo đảm toàn vẹn. Mọi giao thức an toàn bạn dùng đều là các mảnh này, ghép lại đúng cách.</div>`,
  ]]);

const c8q = quiz('cac301-quiz-8', 'Quiz 8 — Applied crypto|||Quiz 8 — Mật mã ứng dụng', [
  { id: 'q1', question: 'Trong TLS, sau khi trao khoá, phần lớn lưu lượng được mã bằng?', options: ['RSA cho từng gói', 'Mã đối xứng như AES-GCM với khoá phiên', 'One-time pad', 'Chỉ băm SHA-256'], correctIndex: 1, explanation: 'TLS là mã lai: bất đối xứng chia khoá, rồi AES-GCM mã dữ liệu.' },
  { id: 'q2', question: 'Mã hoá đầu-cuối (E2EE) bảo đảm điều gì?', options: ['Máy chủ đọc được nội dung', 'Chỉ máy người gửi và người nhận giải được, máy chủ thì không', 'Không cần khoá', 'Nhanh hơn TLS'], correctIndex: 1, explanation: 'E2EE mã ở máy gửi, giải ở máy nhận — máy chủ không đọc được.' },
  { id: 'q3', question: 'Thực hành an toàn khi sinh khoá/nonce là?', options: ['Dùng Math.random', 'Dùng CSPRNG (bộ sinh ngẫu nhiên an toàn mật mã)', 'Dùng thời gian hệ thống', 'Tái dùng một nonce cố định'], correctIndex: 1, explanation: 'Luôn dùng CSPRNG; Math.random không an toàn mật mã.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'CAC301',
    slug: 'cac301-cryptography-and-applied-cryptography',
    title: 'Cryptography and Applied Cryptography',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CAC301.webp',
    shortDescription: 'How cryptography protects information — CIA goals, classical ciphers, block (AES) & stream ciphers, number theory, public-key (RSA, Diffie-Hellman, ECC), hashes & HMAC, digital signatures & PKI, and applied crypto (TLS, VPN, E2EE).|||Mật mã bảo vệ thông tin thế nào — mục tiêu CIA, mã cổ điển, mã khối (AES) & mã dòng, lý thuyết số, khoá công khai (RSA, Diffie-Hellman, ECC), băm & HMAC, chữ ký số & PKI, mật mã ứng dụng (TLS, VPN, E2EE).',
    description: 'Môn <strong>CAC301 — Cryptography and Applied Cryptography</strong> (kỳ 4, ngành Khoa học Máy tính) giúp hiểu <strong>mật mã bảo vệ thông tin thế nào</strong>. Từ <strong>mục tiêu CIA &amp; mã cổ điển</strong> (Caesar, Vigenère, thám mã) → <strong>mã đối xứng</strong> (mã khối AES/DES, chế độ ECB/CBC/CTR; mã dòng, one-time pad) → <strong>lý thuyết số</strong> (số học mô-đun, Euler, Fermat) → <strong>mã bất đối xứng</strong> (RSA, Diffie-Hellman, ECC) → <strong>hàm băm &amp; MAC</strong> (SHA, HMAC) → <strong>chữ ký số &amp; PKI</strong> (X.509) → <strong>mật mã ứng dụng</strong> (TLS, VPN, E2EE). Bám sách chuẩn (Stallings; Katz &amp; Lindell; Paar), song ngữ, có ví dụ và quiz mỗi chương.',
    whatYouLearn: 'Ba mục tiêu CIA & nguyên lý Kerckhoffs; mã cổ điển & phân tích tần suất; mã khối AES/DES, chế độ ECB/CBC/CTR, IV/padding; mã dòng, one-time pad & luật không tái dùng nonce; số học mô-đun, số nguyên tố, hàm Euler, Fermat; RSA, Diffie-Hellman, ECC; hàm băm SHA & chống va chạm, MAC/HMAC, băm mật khẩu; chữ ký số, non-repudiation, PKI & X.509; TLS/SSL, VPN, mã hoá đầu-cuối, quản lý khoá an toàn.',
    requirements: 'Toán rời rạc cơ bản (số học mô-đun, số nguyên tố) và lập trình nền tảng. Không cần kinh nghiệm mật mã trước đó.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách chuẩn (Stallings, Katz & Lindell, Paar), FLM, NIST, Cryptopals, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Mật mã là gì, CIA, thuật ngữ, Kerckhoffs.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & mã cổ điển|||Chapter 1 — Overview & classical', description: 'CIA, Caesar, Vigenère, thám mã.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Mã khối|||Chapter 2 — Block ciphers', description: 'DES, AES, ECB/CBC/CTR.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Mã dòng|||Chapter 3 — Stream ciphers', description: 'Keystream, one-time pad, RC4.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Lý thuyết số|||Chapter 4 — Number theory', description: 'Mô-đun, nguyên tố, Euler, Fermat.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Mã bất đối xứng|||Chapter 5 — Asymmetric', description: 'RSA, Diffie-Hellman, ECC.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Hàm băm & MAC|||Chapter 6 — Hashing & MAC', description: 'SHA, va chạm, HMAC.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Chữ ký số & PKI|||Chapter 7 — Signatures & PKI', description: 'Chữ ký, non-repudiation, X.509.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Mật mã ứng dụng|||Chapter 8 — Applied crypto', description: 'TLS, VPN, E2EE, quản lý khoá.', lessons: [c8, c8q] },
  ],
};
