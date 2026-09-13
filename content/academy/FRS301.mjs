/**
 * FRS301 — Digital Forensics / Điều tra số (Pháp chứng số). Ngành An toàn
 * thông tin FPTU, Kỳ 5. Khung 8 chương, song ngữ VI+EN, mỗi chương 1 DOCUMENT
 * (khái niệm + quy trình + công cụ + ví dụ vụ việc) + 1 QUIZ 3 câu.
 * Sách chuẩn: Nelson "Guide to Computer Forensics and Investigations";
 * Casey "Digital Evidence and Computer Crime"; SANS DFIR; Autopsy/Volatility.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; & → &amp;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('frs301-0-1-overview', 'Course overview: Digital Forensics|||Tổng quan môn: Điều tra số',
  'Điều tra số làm gì; vì sao cần; lộ trình 8 chương: khái niệm → quy trình → bằng chứng & pháp lý → ổ đĩa → bộ nhớ → mạng → di động & cloud → công cụ, báo cáo & đạo đức.',
  [[
    `<span class="eyebrow">FRS301 · Lesson 0.1 · Overview</span>
<h2>Digital Forensics</h2>
<p class="lead">Digital forensics is the science of <strong>finding, preserving, analysing and presenting digital evidence</strong> so it can be trusted — in a courtroom, an incident report, or an internal investigation. When a laptop is seized, a server is breached, or a phone holds the key to a case, a forensic examiner turns raw bytes into a defensible story of <em>what happened, when, and who did it</em>.</p>
<h3>Why it matters</h3>
<ul>
<li>Cybercrime, fraud and insider abuse leave digital traces — forensics recovers them.</li>
<li>Evidence is only useful if it is <strong>admissible</strong>: collected legally, unaltered, and documented.</li>
<li>The same skills drive <strong>incident response</strong> — knowing how an attacker got in and what they touched.</li>
</ul>
<h3>Roadmap (8 chapters)</h3>
<p>What forensics is &amp; cybercrime types → the investigation process &amp; chain of custody → digital evidence &amp; the law → disk &amp; file-system forensics → memory forensics (Volatility) → network forensics → mobile &amp; cloud → tools, reporting &amp; ethics. Bilingual, with real-case examples and a quiz per chapter.</p>
<div class="callout"><span class="badge">Golden rule</span> Never work on the original. Acquire a verified copy (image), prove it is identical with a hash, and analyse the copy — the original stays untouched.</div>`,
    `<span class="eyebrow">FRS301 · Bài 0.1 · Tổng quan</span>
<h2>Điều tra số (Pháp chứng số)</h2>
<p class="lead">Điều tra số là khoa học <strong>tìm, bảo toàn, phân tích và trình bày bằng chứng số</strong> sao cho nó đáng tin — trước toà, trong báo cáo sự cố, hay một cuộc điều tra nội bộ. Khi một laptop bị thu giữ, một máy chủ bị xâm nhập, hay một chiếc điện thoại nắm mấu chốt vụ án, điều tra viên biến từng byte thô thành lời kể vững chắc về <em>chuyện gì đã xảy ra, khi nào, và ai làm</em>.</p>
<h3>Vì sao quan trọng</h3>
<ul>
<li>Tội phạm mạng, gian lận và lạm dụng nội bộ đều để lại dấu vết số — điều tra số phục hồi chúng.</li>
<li>Bằng chứng chỉ có giá trị khi <strong>được chấp nhận (admissible)</strong>: thu thập hợp pháp, không bị sửa đổi, và có tài liệu ghi chép.</li>
<li>Cùng kỹ năng đó phục vụ <strong>ứng phó sự cố</strong> — biết kẻ tấn công vào bằng cách nào và chạm vào những gì.</li>
</ul>
<h3>Lộ trình (8 chương)</h3>
<p>Điều tra số là gì &amp; loại tội phạm → quy trình điều tra &amp; chuỗi hành trình chứng cứ → bằng chứng số &amp; pháp lý → ổ đĩa &amp; file system → bộ nhớ (Volatility) → mạng → di động &amp; cloud → công cụ, báo cáo &amp; đạo đức. Song ngữ, có ví dụ vụ việc thật và quiz mỗi chương.</p>
<div class="callout"><span class="badge">Nguyên tắc vàng</span> Không bao giờ làm việc trên bản gốc. Tạo bản sao đã kiểm chứng (image), chứng minh nó giống hệt bằng hash, rồi phân tích bản sao — bản gốc giữ nguyên.</div>`,
  ]]);

const c1 = doc('frs301-1-1-what-is', '1.1 — What digital forensics is|||1.1 — Điều tra số là gì',
  'Khái niệm điều tra số, vai trò của điều tra viên, các loại tội phạm số, và bốn nguyên tắc ACPO về xử lý bằng chứng.',
  [[
    `<span class="eyebrow">FRS301 · Chapter 1 · Lesson 1.1</span>
<h2>What digital forensics is</h2>
<h3>Definition &amp; role</h3>
<p><strong>Digital forensics</strong> applies scientific method to digital data: identify what could be evidence, preserve it without change, analyse it, and report findings clearly and repeatably. The examiner is a <strong>neutral finder of fact</strong> — the goal is truth, not a conviction.</p>
<h3>Types of digital crime</h3>
<ul>
<li><strong>Computer as target</strong> — hacking, ransomware, denial-of-service.</li>
<li><strong>Computer as tool</strong> — fraud, phishing, intellectual-property theft.</li>
<li><strong>Computer as witness</strong> — a device that merely stores evidence of a physical crime (chats, photos, GPS).</li>
</ul>
<h3>The four ACPO principles</h3>
<pre><code>1. Do NOT change data on a seized device.
2. If you must access the original, be competent and explain why.
3. Keep an audit trail — another expert could repeat your steps.
4. The case lead is responsible for following the law and these rules.
</code></pre>
<div class="callout"><span class="badge">Case example</span> In a leaked-documents inquiry, an examiner showed a suspect file was created BEFORE the employee had access — clearing them. The timeline, not the file, cracked the case.</div>`,
    `<span class="eyebrow">FRS301 · Chương 1 · Bài 1.1</span>
<h2>Điều tra số là gì</h2>
<h3>Khái niệm &amp; vai trò</h3>
<p><strong>Điều tra số</strong> áp dụng phương pháp khoa học lên dữ liệu số: nhận diện thứ có thể là bằng chứng, bảo toàn không đổi, phân tích, rồi báo cáo rõ ràng và có thể lặp lại. Điều tra viên là <strong>người tìm sự thật trung lập</strong> — mục tiêu là sự thật, không phải một bản án.</p>
<h3>Các loại tội phạm số</h3>
<ul>
<li><strong>Máy tính là đích</strong> — tấn công xâm nhập, mã độc tống tiền, từ chối dịch vụ.</li>
<li><strong>Máy tính là công cụ</strong> — lừa đảo, giả mạo (phishing), đánh cắp sở hữu trí tuệ.</li>
<li><strong>Máy tính là nhân chứng</strong> — thiết bị chỉ lưu bằng chứng của một tội phạm ngoài đời (tin nhắn, ảnh, GPS).</li>
</ul>
<h3>Bốn nguyên tắc ACPO</h3>
<pre><code>1. KHÔNG làm thay đổi dữ liệu trên thiết bị thu giữ.
2. Nếu buộc phải truy cập bản gốc, phải đủ năng lực và giải thích được vì sao.
3. Lưu nhật ký thao tác — chuyên gia khác có thể lặp lại từng bước của bạn.
4. Người phụ trách vụ án chịu trách nhiệm tuân thủ luật và các nguyên tắc này.
</code></pre>
<div class="callout"><span class="badge">Ví dụ vụ việc</span> Trong vụ rò rỉ tài liệu, điều tra viên chứng minh tệp nghi vấn được tạo TRƯỚC khi nhân viên có quyền truy cập — minh oan cho họ. Chính dòng thời gian, không phải tệp, đã hoá giải vụ án.</div>`,
  ]]);

const c1q = quiz('frs301-quiz-1', 'Quiz 1 — What forensics is|||Quiz 1 — Điều tra số là gì', [
  { id: 'q1', question: 'Mục tiêu của điều tra viên số là?', options: ['Kết tội nghi phạm bằng mọi giá', 'Tìm sự thật một cách trung lập, có thể lặp lại', 'Xoá dấu vết tấn công', 'Sửa dữ liệu cho khớp giả thuyết'], correctIndex: 1, explanation: 'Điều tra viên là người tìm sự thật trung lập, kết quả phải lặp lại được.' },
  { id: 'q2', question: 'Nguyên tắc ACPO số 1 nói gì?', options: ['Luôn tắt máy ngay', 'KHÔNG làm thay đổi dữ liệu trên thiết bị thu giữ', 'Chỉ dùng công cụ trả phí', 'Xoá bản gốc sau khi sao chép'], correctIndex: 1, explanation: 'ACPO 1: không thay đổi dữ liệu trên thiết bị gốc.' },
  { id: 'q3', question: 'Điện thoại lưu tin nhắn làm bằng chứng cho một vụ án ngoài đời thuộc loại?', options: ['Máy tính là đích', 'Máy tính là công cụ', 'Máy tính là nhân chứng', 'Không phải bằng chứng số'], correctIndex: 2, explanation: 'Thiết bị chỉ lưu bằng chứng của tội phạm ngoài đời = máy tính là nhân chứng.' },
]);

const c2 = doc('frs301-2-1-process', '2.1 — The investigation process|||2.1 — Quy trình điều tra',
  'Năm bước: identification, preservation, collection, analysis, reporting; và chuỗi hành trình chứng cứ (chain of custody) — vì sao mỗi lần chuyển giao phải ghi lại.',
  [[
    `<span class="eyebrow">FRS301 · Chapter 2 · Lesson 2.1</span>
<h2>The investigation process</h2>
<h3>Five phases</h3>
<pre><code>Identification -> what &amp; where is the potential evidence?
Preservation   -> isolate, image, hash; stop anything writing to it
Collection     -> gather devices/data legally, label everything
Analysis       -> examine the copy; recover, correlate, build timeline
Reporting      -> plain, factual write-up an outsider can follow
</code></pre>
<h3>Chain of custody</h3>
<p>The <strong>chain of custody</strong> is an unbroken record of <em>who</em> handled the evidence, <em>when</em>, <em>why</em>, and <em>where it was stored</em> — from seizure to court. A single undocumented gap lets the defence argue the evidence was tampered with, and it can be thrown out.</p>
<ul>
<li>Record time, handler, and hash at every transfer.</li>
<li>Store originals in sealed, access-controlled storage.</li>
<li>Work only on verified copies; log every tool and action.</li>
</ul>
<div class="callout"><span class="badge">Case example</span> A strong hacking case collapsed because a hard drive sat overnight on an unlocked desk with no log entry. The bytes were fine; the broken custody chain sank it.</div>`,
    `<span class="eyebrow">FRS301 · Chương 2 · Bài 2.1</span>
<h2>Quy trình điều tra</h2>
<h3>Năm giai đoạn</h3>
<pre><code>Nhận diện    -> bằng chứng tiềm năng là gì &amp; ở đâu?
Bảo toàn     -> cô lập, tạo image, băm hash; chặn mọi ghi lên nó
Thu thập     -> lấy thiết bị/dữ liệu hợp pháp, dán nhãn tất cả
Phân tích    -> soi bản sao; phục hồi, đối chiếu, dựng dòng thời gian
Báo cáo      -> viết rõ, đúng sự thật, người ngoài đọc theo được
</code></pre>
<h3>Chuỗi hành trình chứng cứ</h3>
<p><strong>Chuỗi hành trình chứng cứ (chain of custody)</strong> là bản ghi liên tục về <em>ai</em> đã cầm bằng chứng, <em>khi nào</em>, <em>vì sao</em>, và <em>lưu ở đâu</em> — từ lúc thu giữ đến khi ra toà. Chỉ một khoảng trống không ghi chép là bên bào chữa có thể lập luận bằng chứng đã bị can thiệp, và nó bị loại.</p>
<ul>
<li>Ghi thời gian, người xử lý và hash mỗi lần chuyển giao.</li>
<li>Cất bản gốc trong kho niêm phong, kiểm soát truy cập.</li>
<li>Chỉ làm việc trên bản sao đã kiểm chứng; ghi lại mọi công cụ và thao tác.</li>
</ul>
<div class="callout"><span class="badge">Ví dụ vụ việc</span> Một vụ tấn công mạnh chứng cứ đã sụp vì ổ cứng để qua đêm trên bàn không khoá, không có dòng nhật ký nào. Byte vẫn nguyên; chuỗi hành trình đứt gãy đã đánh chìm nó.</div>`,
  ]]);

const c2q = quiz('frs301-quiz-2', 'Quiz 2 — Process|||Quiz 2 — Quy trình', [
  { id: 'q1', question: 'Thứ tự đúng của quy trình điều tra số là?', options: ['Phân tích → thu thập → báo cáo', 'Nhận diện → bảo toàn → thu thập → phân tích → báo cáo', 'Thu thập → xoá → phân tích', 'Báo cáo → nhận diện → bảo toàn'], correctIndex: 1, explanation: 'Năm bước: identification, preservation, collection, analysis, reporting.' },
  { id: 'q2', question: 'Chuỗi hành trình chứng cứ (chain of custody) ghi lại điều gì?', options: ['Chỉ tên vụ án', 'Ai cầm bằng chứng, khi nào, vì sao, lưu ở đâu', 'Mật khẩu của nghi phạm', 'Giá trị thị trường của thiết bị'], correctIndex: 1, explanation: 'Chain of custody là bản ghi liên tục về người/thời gian/lý do/nơi lưu.' },
  { id: 'q3', question: 'Vì sao một khoảng trống trong chain of custody nguy hiểm?', options: ['Làm chậm phân tích', 'Bên bào chữa có thể cãi bằng chứng bị can thiệp và nó bị loại', 'Tốn dung lượng lưu trữ', 'Không ảnh hưởng gì'], correctIndex: 1, explanation: 'Khoảng trống cho phép nghi ngờ can thiệp → bằng chứng có thể bị loại khỏi toà.' },
]);

const c3 = doc('frs301-3-1-evidence-law', '3.1 — Digital evidence & the law|||3.1 — Bằng chứng số & pháp lý',
  'Bằng chứng số là gì, tính toàn vẹn qua hàm băm (MD5/SHA-256), tính chấp nhận được (admissibility), và khung pháp lý Việt Nam & quốc tế.',
  [[
    `<span class="eyebrow">FRS301 · Chapter 3 · Lesson 3.1</span>
<h2>Digital evidence &amp; the law</h2>
<h3>What makes evidence trustworthy</h3>
<p>Digital evidence is fragile: a single byte changed breaks it. We prove nothing changed with a <strong>cryptographic hash</strong> — a fixed-length fingerprint of the data.</p>
<pre><code>Acquire drive  -> SHA-256 = a1b2c3...  (record this)
Analyse copy   -> SHA-256 = a1b2c3...  (must MATCH)
One bit differs -> a totally different hash -> tampering is visible
</code></pre>
<p>MD5 and SHA-256 are the workhorses; SHA-256 is preferred because MD5 collisions are now cheap to create.</p>
<h3>Admissibility</h3>
<ul>
<li><strong>Relevant</strong> — it actually bears on the case.</li>
<li><strong>Authentic</strong> — provably the data from that device (hash + custody).</li>
<li><strong>Lawfully obtained</strong> — proper warrant/authority, or it can be excluded.</li>
</ul>
<h3>Legal frameworks</h3>
<p>Vietnam: the <em>Luật An ninh mạng</em> and the Criminal Procedure Code govern seizure and electronic evidence. Internationally: the <strong>Budapest Convention</strong> on Cybercrime and rules like the US Federal Rules of Evidence shape cross-border cooperation.</p>
<div class="callout"><span class="badge">Case example</span> A confession chat was ruled inadmissible because it was extracted without a warrant — lawful process matters as much as the data itself.</div>`,
    `<span class="eyebrow">FRS301 · Chương 3 · Bài 3.1</span>
<h2>Bằng chứng số &amp; pháp lý</h2>
<h3>Điều gì làm bằng chứng đáng tin</h3>
<p>Bằng chứng số rất mong manh: đổi một byte là hỏng. Ta chứng minh không có gì thay đổi bằng <strong>hàm băm mật mã (hash)</strong> — dấu vân tay độ dài cố định của dữ liệu.</p>
<pre><code>Thu ổ đĩa    -> SHA-256 = a1b2c3...  (ghi lại con số này)
Soi bản sao  -> SHA-256 = a1b2c3...  (phải TRÙNG khớp)
Lệch một bit -> hash khác hẳn -> thấy ngay dấu can thiệp
</code></pre>
<p>MD5 và SHA-256 là hai hàm chủ lực; SHA-256 được ưu tiên vì tạo va chạm (collision) MD5 nay đã rẻ.</p>
<h3>Tính chấp nhận được (admissibility)</h3>
<ul>
<li><strong>Liên quan</strong> — thực sự dính tới vụ án.</li>
<li><strong>Xác thực</strong> — chứng minh được là dữ liệu từ chính thiết bị đó (hash + chuỗi hành trình).</li>
<li><strong>Thu thập hợp pháp</strong> — đúng lệnh/thẩm quyền, nếu không có thể bị loại.</li>
</ul>
<h3>Khung pháp lý</h3>
<p>Việt Nam: <em>Luật An ninh mạng</em> và Bộ luật Tố tụng hình sự điều chỉnh việc thu giữ và chứng cứ điện tử. Quốc tế: <strong>Công ước Budapest</strong> về tội phạm mạng và các quy tắc như US Federal Rules of Evidence định hình hợp tác xuyên biên giới.</p>
<div class="callout"><span class="badge">Ví dụ vụ việc</span> Một đoạn chat nhận tội bị loại vì trích xuất không có lệnh — quy trình hợp pháp quan trọng ngang với chính dữ liệu.</div>`,
  ]]);

const c3q = quiz('frs301-quiz-3', 'Quiz 3 — Evidence & law|||Quiz 3 — Bằng chứng & pháp lý', [
  { id: 'q1', question: 'Dùng gì để chứng minh bằng chứng số không bị thay đổi?', options: ['Nén file zip', 'Hàm băm mật mã (MD5/SHA-256)', 'Đổi tên file', 'Mã hoá bằng mật khẩu'], correctIndex: 1, explanation: 'Hash là dấu vân tay dữ liệu; hash trùng nghĩa là dữ liệu không đổi.' },
  { id: 'q2', question: 'Vì sao SHA-256 được ưu tiên hơn MD5?', options: ['SHA-256 nhanh hơn', 'Va chạm (collision) MD5 nay tạo được dễ và rẻ', 'MD5 dài hơn', 'SHA-256 nén dữ liệu'], correctIndex: 1, explanation: 'MD5 đã bị phá va chạm nên kém tin cậy cho tính toàn vẹn.' },
  { id: 'q3', question: 'Bằng chứng thu thập không có lệnh hợp pháp thì?', options: ['Vẫn luôn dùng được', 'Có thể bị loại (không admissible)', 'Tự động thắng kiện', 'Chỉ cần hash là đủ'], correctIndex: 1, explanation: 'Thu thập hợp pháp là điều kiện để bằng chứng được chấp nhận tại toà.' },
]);

const c4 = doc('frs301-4-1-disk', '4.1 — Disk & file system forensics|||4.1 — Điều tra ổ đĩa & file system',
  'Disk imaging (dd/E01, write blocker), cấu trúc FAT/NTFS, file carving theo chữ ký, và phục hồi file đã xoá.',
  [[
    `<span class="eyebrow">FRS301 · Chapter 4 · Lesson 4.1</span>
<h2>Disk &amp; file system forensics</h2>
<h3>Imaging the disk</h3>
<p>Never analyse the live disk. Use a <strong>write blocker</strong> and copy every sector into an image file (<code>dd</code> raw or the EnCase <code>E01</code> format), then hash it.</p>
<pre><code>dd if=/dev/sdb of=case01.img bs=4M     # bit-for-bit copy
sha256sum case01.img                    # fingerprint the image
</code></pre>
<h3>File systems &amp; deleted files</h3>
<ul>
<li><strong>FAT / NTFS</strong> store a table pointing to where each file lives. Deleting a file usually just marks its entry free — the data stays until overwritten.</li>
<li><strong>Recovery</strong> — undelete from the table while it survives; when the table entry is gone, use <strong>file carving</strong>: scan raw sectors for known headers/footers (e.g. a JPEG starts <code>FF D8 FF</code>) and rebuild the file from content alone.</li>
<li><strong>Slack space</strong> and unallocated space often hide fragments of old data.</li>
</ul>
<div class="callout"><span class="badge">Case example</span> A suspect wiped the recycle bin, but carving unallocated space rebuilt dozens of deleted photos by their JPEG signatures — the files were never truly gone.</div>`,
    `<span class="eyebrow">FRS301 · Chương 4 · Bài 4.1</span>
<h2>Điều tra ổ đĩa &amp; file system</h2>
<h3>Tạo image ổ đĩa</h3>
<p>Không bao giờ soi ổ đĩa đang sống. Dùng <strong>write blocker</strong> (chặn ghi) rồi sao từng sector sang một image (<code>dd</code> dạng raw hoặc định dạng <code>E01</code> của EnCase), sau đó băm hash.</p>
<pre><code>dd if=/dev/sdb of=case01.img bs=4M     # sao từng bit
sha256sum case01.img                    # lấy vân tay của image
</code></pre>
<h3>File system &amp; file đã xoá</h3>
<ul>
<li><strong>FAT / NTFS</strong> lưu một bảng trỏ tới nơi từng file nằm. Xoá file thường chỉ đánh dấu ô đó là trống — dữ liệu còn nguyên tới khi bị ghi đè.</li>
<li><strong>Phục hồi</strong> — khôi phục từ bảng khi mục còn; khi mục trong bảng mất, dùng <strong>file carving</strong>: quét sector thô tìm header/footer đã biết (vd JPEG bắt đầu bằng <code>FF D8 FF</code>) và dựng lại file chỉ từ nội dung.</li>
<li><strong>Slack space</strong> và vùng chưa cấp phát thường giấu mảnh dữ liệu cũ.</li>
</ul>
<div class="callout"><span class="badge">Ví dụ vụ việc</span> Nghi phạm dọn thùng rác, nhưng carving vùng chưa cấp phát đã dựng lại hàng chục ảnh đã xoá theo chữ ký JPEG — các file chưa từng thực sự biến mất.</div>`,
  ]]);

const c4q = quiz('frs301-quiz-4', 'Quiz 4 — Disk forensics|||Quiz 4 — Điều tra ổ đĩa', [
  { id: 'q1', question: 'Write blocker (thiết bị chặn ghi) dùng để làm gì?', options: ['Tăng tốc ổ đĩa', 'Ngăn mọi thao tác ghi lên ổ gốc khi tạo image', 'Mã hoá ổ đĩa', 'Xoá an toàn ổ đĩa'], correctIndex: 1, explanation: 'Write blocker đảm bảo bản gốc không bị thay đổi trong khi sao chép.' },
  { id: 'q2', question: 'Khi xoá một file trên NTFS, dữ liệu thực tế?', options: ['Bị ghi đè ngay lập tức', 'Còn nguyên tới khi bị ghi đè, chỉ mục bảng bị đánh dấu trống', 'Chuyển sang cloud', 'Biến mất vĩnh viễn tức thì'], correctIndex: 1, explanation: 'Xoá chỉ giải phóng mục trong bảng; dữ liệu còn cho tới khi bị ghi đè.' },
  { id: 'q3', question: 'File carving phục hồi file bằng cách nào?', options: ['Đọc bảng file system', 'Quét sector thô tìm chữ ký header/footer đã biết', 'Hỏi hệ điều hành', 'Giải mã mật khẩu'], correctIndex: 1, explanation: 'Carving dựng lại file từ chữ ký nội dung khi mục bảng đã mất.' },
]);

const c5 = doc('frs301-5-1-memory', '5.1 — Memory & process forensics|||5.1 — Điều tra bộ nhớ & tiến trình',
  'Vì sao RAM quý; RAM dump; phân tích bằng Volatility (tiến trình, kết nối mạng, DLL); tìm malware chỉ sống trong bộ nhớ.',
  [[
    `<span class="eyebrow">FRS301 · Chapter 5 · Lesson 5.1</span>
<h2>Memory &amp; process forensics</h2>
<h3>Why RAM is gold</h3>
<p>RAM holds what the disk never sees: running processes, open network connections, decryption keys, and <strong>fileless malware</strong> that lives only in memory. It is <em>volatile</em> — power off and it is gone — so capture it FIRST, while the machine is still live.</p>
<h3>Analysing a memory dump with Volatility</h3>
<pre><code>volatility -f mem.raw windows.pslist      # running processes
volatility -f mem.raw windows.netscan     # network connections
volatility -f mem.raw windows.malfind     # injected/hidden code
volatility -f mem.raw windows.dlllist     # loaded libraries
</code></pre>
<ul>
<li>Spot a process with no file on disk, or a name pretending to be a system service.</li>
<li>Recover a live connection to an attacker command-and-control server.</li>
<li>Pull encryption keys and passwords still resident in memory.</li>
</ul>
<div class="callout"><span class="badge">Case example</span> Disk analysis found nothing, but a RAM dump revealed a fileless backdoor injected into a browser process — visible only because memory was captured before shutdown.</div>`,
    `<span class="eyebrow">FRS301 · Chương 5 · Bài 5.1</span>
<h2>Điều tra bộ nhớ &amp; tiến trình</h2>
<h3>Vì sao RAM là vàng</h3>
<p>RAM giữ thứ ổ đĩa không thấy: tiến trình đang chạy, kết nối mạng đang mở, khoá giải mã, và <strong>malware phi tệp (fileless)</strong> chỉ sống trong bộ nhớ. Nó <em>bay hơi</em> — tắt nguồn là mất — nên phải lấy nó TRƯỚC TIÊN, khi máy còn sống.</p>
<h3>Phân tích RAM dump bằng Volatility</h3>
<pre><code>volatility -f mem.raw windows.pslist      # tiến trình đang chạy
volatility -f mem.raw windows.netscan     # kết nối mạng
volatility -f mem.raw windows.malfind     # mã bị tiêm/ẩn
volatility -f mem.raw windows.dlllist     # thư viện đã nạp
</code></pre>
<ul>
<li>Phát hiện tiến trình không có file trên đĩa, hoặc tên giả làm dịch vụ hệ thống.</li>
<li>Phục hồi kết nối sống tới máy chủ điều khiển (C2) của kẻ tấn công.</li>
<li>Lấy khoá mã hoá và mật khẩu còn nằm trong bộ nhớ.</li>
</ul>
<div class="callout"><span class="badge">Ví dụ vụ việc</span> Soi ổ đĩa không thấy gì, nhưng RAM dump lộ ra một backdoor phi tệp bị tiêm vào tiến trình trình duyệt — chỉ thấy được vì bộ nhớ đã được chụp trước khi tắt máy.</div>`,
  ]]);

const c5q = quiz('frs301-quiz-5', 'Quiz 5 — Memory forensics|||Quiz 5 — Điều tra bộ nhớ', [
  { id: 'q1', question: 'Vì sao phải chụp RAM trước khi tắt máy?', options: ['RAM chạy nhanh hơn ổ đĩa', 'RAM bay hơi — tắt nguồn là mất tiến trình, kết nối, khoá', 'RAM không thể sao chép', 'Ổ đĩa quan trọng hơn'], correctIndex: 1, explanation: 'RAM là bộ nhớ bay hơi; nhiều bằng chứng chỉ tồn tại khi máy còn sống.' },
  { id: 'q2', question: 'Công cụ phổ biến để phân tích RAM dump là?', options: ['Wireshark', 'Volatility', 'Photoshop', 'nmap'], correctIndex: 1, explanation: 'Volatility là framework chuẩn cho memory forensics.' },
  { id: 'q3', question: 'Malware phi tệp (fileless) đặc biệt vì?', options: ['Nó chạy nhanh', 'Nó chỉ sống trong bộ nhớ, không để lại file trên đĩa', 'Nó luôn có chữ ký antivirus', 'Nó chỉ tấn công Linux'], correctIndex: 1, explanation: 'Fileless malware sống trong RAM nên soi đĩa không thấy, phải soi bộ nhớ.' },
]);

const c6 = doc('frs301-6-1-network', '6.1 — Network forensics|||6.1 — Điều tra mạng',
  'Bắt gói tin (packet capture) với Wireshark/tcpdump, phân tích log (firewall/proxy/DNS), truy vết địa chỉ IP và tái dựng phiên tấn công.',
  [[
    `<span class="eyebrow">FRS301 · Chapter 6 · Lesson 6.1</span>
<h2>Network forensics</h2>
<h3>Two sources of network evidence</h3>
<ul>
<li><strong>Packet captures (PCAP)</strong> — the raw traffic itself, grabbed live with <code>tcpdump</code> or Wireshark. Full fidelity, but you must be capturing when it happens.</li>
<li><strong>Logs</strong> — firewall, proxy, DNS, and server logs. Always-on, but only as detailed as they were configured to record.</li>
</ul>
<h3>What you reconstruct</h3>
<pre><code>tcpdump -i eth0 -w capture.pcap        # record traffic to a file
# In Wireshark: Follow TCP Stream -> rebuild a whole conversation
# Filter:  ip.addr == 203.0.113.10 &amp;&amp; http
</code></pre>
<p>Trace which internal host talked to a malicious IP, when data left the network (<strong>exfiltration</strong>), and correlate timestamps across logs to build the attack timeline. Beware: attackers use VPNs, Tor and spoofing, so an IP is a lead, not proof of identity.</p>
<div class="callout"><span class="badge">Case example</span> Proxy logs showed a workstation uploading gigabytes to an unknown host at 3 a.m.; the matching PCAP proved a database was being exfiltrated — caught before it finished.</div>`,
    `<span class="eyebrow">FRS301 · Chương 6 · Bài 6.1</span>
<h2>Điều tra mạng</h2>
<h3>Hai nguồn bằng chứng mạng</h3>
<ul>
<li><strong>Bắt gói tin (PCAP)</strong> — chính lưu lượng thô, chụp trực tiếp bằng <code>tcpdump</code> hoặc Wireshark. Trung thực tuyệt đối, nhưng bạn phải đang bắt đúng lúc nó xảy ra.</li>
<li><strong>Log (nhật ký)</strong> — log tường lửa, proxy, DNS và máy chủ. Luôn bật, nhưng chỉ chi tiết đúng mức đã cấu hình ghi.</li>
</ul>
<h3>Bạn tái dựng được gì</h3>
<pre><code>tcpdump -i eth0 -w capture.pcap        # ghi lưu lượng ra file
# Trong Wireshark: Follow TCP Stream -> dựng lại cả cuộc trao đổi
# Bộ lọc:  ip.addr == 203.0.113.10 &amp;&amp; http
</code></pre>
<p>Truy máy nội bộ nào đã nói chuyện với IP độc hại, dữ liệu rời mạng khi nào (<strong>rò rỉ/exfiltration</strong>), và đối chiếu mốc thời gian giữa các log để dựng dòng thời gian tấn công. Lưu ý: kẻ tấn công dùng VPN, Tor và giả mạo IP, nên một IP là manh mối, không phải bằng chứng danh tính.</p>
<div class="callout"><span class="badge">Ví dụ vụ việc</span> Log proxy cho thấy một máy trạm tải nhiều gigabyte lên máy chủ lạ lúc 3 giờ sáng; PCAP khớp chứng minh một cơ sở dữ liệu đang bị rò rỉ — bắt được trước khi hoàn tất.</div>`,
  ]]);

const c6q = quiz('frs301-quiz-6', 'Quiz 6 — Network forensics|||Quiz 6 — Điều tra mạng', [
  { id: 'q1', question: 'Công cụ nào dùng để bắt và phân tích gói tin mạng?', options: ['Volatility', 'Wireshark / tcpdump', 'Autopsy', 'FTK Imager'], correctIndex: 1, explanation: 'Wireshark/tcpdump bắt và phân tích packet (PCAP).' },
  { id: 'q2', question: 'Nhược điểm của việc dựa vào packet capture là?', options: ['Không trung thực', 'Phải đang bắt đúng lúc sự việc xảy ra', 'Không đọc được', 'Chỉ chạy trên Windows'], correctIndex: 1, explanation: 'PCAP chỉ có nếu ta đang capture; log thì luôn bật nhưng kém chi tiết.' },
  { id: 'q3', question: 'Một địa chỉ IP trong log nên được coi là?', options: ['Bằng chứng danh tính tuyệt đối', 'Manh mối — vì có VPN, Tor, giả mạo IP', 'Vô dụng', 'Luôn là kẻ tấn công'], correctIndex: 1, explanation: 'IP có thể bị che/giả mạo nên chỉ là manh mối cần đối chiếu thêm.' },
]);

const c7 = doc('frs301-7-1-mobile-cloud', '7.1 — Mobile & cloud forensics|||7.1 — Điều tra thiết bị di động & cloud',
  'Trích xuất Android/iOS (logical vs physical), dữ liệu ứng dụng & SQLite, thách thức mã hoá; điều tra dữ liệu cloud và vấn đề pháp lý xuyên biên giới.',
  [[
    `<span class="eyebrow">FRS301 · Chapter 7 · Lesson 7.1</span>
<h2>Mobile &amp; cloud forensics</h2>
<h3>Mobile devices</h3>
<ul>
<li><strong>Logical extraction</strong> — pull what the phone API exposes (contacts, messages, call logs). Fast, but limited.</li>
<li><strong>Physical extraction</strong> — a bit-level image of storage; more data, including deleted items, but often blocked by encryption.</li>
<li><strong>App data</strong> — most evidence lives in <strong>SQLite</strong> databases inside each app (chats, locations, timestamps). Full-disk encryption on modern Android/iOS is the biggest hurdle.</li>
</ul>
<h3>Cloud</h3>
<p>Data increasingly lives in the cloud, not the device — email, Drive/iCloud, chat backups. That raises hard questions:</p>
<pre><code>Where is the data physically stored? (which country/law?)
Who controls it — the user, or the provider?
Do you need a warrant, or provider cooperation, or both?
</code></pre>
<p>Cross-border data means multiple jurisdictions; a legal request to the provider is often the only lawful route.</p>
<div class="callout"><span class="badge">Case example</span> A wiped phone yielded little, but the suspect chat backup in the cloud — obtained via a lawful provider request — reconstructed the full conversation.</div>`,
    `<span class="eyebrow">FRS301 · Chương 7 · Bài 7.1</span>
<h2>Điều tra thiết bị di động &amp; cloud</h2>
<h3>Thiết bị di động</h3>
<ul>
<li><strong>Trích xuất logic (logical)</strong> — lấy thứ API điện thoại cho phép (danh bạ, tin nhắn, nhật ký cuộc gọi). Nhanh nhưng hạn chế.</li>
<li><strong>Trích xuất vật lý (physical)</strong> — image mức bit của bộ nhớ; nhiều dữ liệu hơn, kể cả mục đã xoá, nhưng thường bị mã hoá chặn.</li>
<li><strong>Dữ liệu ứng dụng</strong> — phần lớn bằng chứng nằm trong cơ sở dữ liệu <strong>SQLite</strong> bên trong mỗi app (tin nhắn, vị trí, mốc thời gian). Mã hoá toàn ổ trên Android/iOS hiện đại là rào cản lớn nhất.</li>
</ul>
<h3>Cloud</h3>
<p>Dữ liệu ngày càng nằm trên cloud, không trên thiết bị — email, Drive/iCloud, bản sao lưu chat. Điều đó đặt ra câu hỏi khó:</p>
<pre><code>Dữ liệu lưu vật lý ở đâu? (nước nào/luật nào?)
Ai kiểm soát nó — người dùng hay nhà cung cấp?
Cần lệnh, hay sự hợp tác của nhà cung cấp, hay cả hai?
</code></pre>
<p>Dữ liệu xuyên biên giới kéo theo nhiều khu vực pháp lý; một yêu cầu pháp lý gửi nhà cung cấp thường là con đường hợp pháp duy nhất.</p>
<div class="callout"><span class="badge">Ví dụ vụ việc</span> Điện thoại đã bị xoá cho ít dữ liệu, nhưng bản sao lưu chat trên cloud — lấy qua yêu cầu hợp pháp tới nhà cung cấp — đã dựng lại toàn bộ cuộc trò chuyện.</div>`,
  ]]);

const c7q = quiz('frs301-quiz-7', 'Quiz 7 — Mobile & cloud|||Quiz 7 — Di động & cloud', [
  { id: 'q1', question: 'Phần lớn bằng chứng trong ứng dụng di động thường nằm trong?', options: ['File văn bản .txt', 'Cơ sở dữ liệu SQLite của từng app', 'BIOS', 'Card SIM'], correctIndex: 1, explanation: 'App lưu chat, vị trí, timestamp trong SQLite.' },
  { id: 'q2', question: 'Rào cản lớn nhất khi trích xuất vật lý điện thoại hiện đại là?', options: ['Dung lượng nhỏ', 'Mã hoá toàn ổ', 'Không có cáp USB', 'Thiếu điện'], correctIndex: 1, explanation: 'Full-disk encryption trên Android/iOS chặn trích xuất vật lý.' },
  { id: 'q3', question: 'Thách thức đặc thù của điều tra dữ liệu cloud là?', options: ['Dữ liệu quá nhỏ', 'Dữ liệu ở nhiều quốc gia/khu vực pháp lý, do nhà cung cấp kiểm soát', 'Không thể mã hoá', 'Luôn miễn phí truy cập'], correctIndex: 1, explanation: 'Cloud kéo theo pháp lý xuyên biên giới và quyền kiểm soát của nhà cung cấp.' },
]);

const c8 = doc('frs301-8-1-tools-report-ethics', '8.1 — Tools, reporting & ethics|||8.1 — Công cụ, báo cáo & đạo đức',
  'Bộ công cụ (Autopsy, FTK, EnCase, SANS SIFT); cách viết báo cáo pháp chứng; ra toà làm nhân chứng chuyên môn; và đạo đức điều tra viên.',
  [[
    `<span class="eyebrow">FRS301 · Chapter 8 · Lesson 8.1</span>
<h2>Tools, reporting &amp; ethics</h2>
<h3>The toolkit</h3>
<ul>
<li><strong>Autopsy</strong> — free, open-source disk analysis (built on The Sleuth Kit).</li>
<li><strong>FTK</strong> &amp; <strong>EnCase</strong> — industry-standard commercial suites, widely accepted in court.</li>
<li><strong>SANS SIFT</strong>, Volatility, Wireshark — the open DFIR stack.</li>
</ul>
<p>Prefer <strong>validated</strong> tools: you must be able to explain and, if challenged, reproduce what a tool did.</p>
<h3>Writing the report</h3>
<pre><code>1. Summary        - findings in plain language
2. Method         - tools, versions, hashes, every step
3. Findings       - facts and where they came from
4. Conclusion     - what the evidence supports (and its limits)
</code></pre>
<p>In court, you may testify as an <strong>expert witness</strong>: state facts, admit uncertainty, and never overreach beyond what the data proves.</p>
<h3>Ethics</h3>
<p>Stay <strong>objective</strong> — report exculpatory evidence too. Work only within your <strong>authorisation</strong>, protect privacy, and never fabricate or exaggerate a result.</p>
<div class="callout"><span class="badge">Case example</span> An examiner who noted the limits of a partial recovery — rather than overstating it — kept the whole report credible; an overreaching peer was discredited on the stand.</div>`,
    `<span class="eyebrow">FRS301 · Chương 8 · Bài 8.1</span>
<h2>Công cụ, báo cáo &amp; đạo đức</h2>
<h3>Bộ công cụ</h3>
<ul>
<li><strong>Autopsy</strong> — phân tích ổ đĩa miễn phí, mã nguồn mở (dựng trên The Sleuth Kit).</li>
<li><strong>FTK</strong> &amp; <strong>EnCase</strong> — bộ công cụ thương mại chuẩn ngành, được toà chấp nhận rộng rãi.</li>
<li><strong>SANS SIFT</strong>, Volatility, Wireshark — bộ DFIR mã nguồn mở.</li>
</ul>
<p>Ưu tiên công cụ <strong>đã kiểm chứng</strong>: bạn phải giải thích được và, nếu bị chất vấn, lặp lại được điều công cụ đã làm.</p>
<h3>Viết báo cáo</h3>
<pre><code>1. Tóm tắt      - kết quả bằng ngôn ngữ dễ hiểu
2. Phương pháp  - công cụ, phiên bản, hash, từng bước
3. Phát hiện    - sự thật và chúng đến từ đâu
4. Kết luận     - bằng chứng chứng minh được gì (và giới hạn của nó)
</code></pre>
<p>Trước toà, bạn có thể làm chứng với tư cách <strong>nhân chứng chuyên môn</strong>: nêu sự thật, thừa nhận điểm chưa chắc chắn, và không bao giờ nói quá điều dữ liệu chứng minh.</p>
<h3>Đạo đức</h3>
<p>Giữ <strong>khách quan</strong> — báo cả bằng chứng gỡ tội. Chỉ làm trong <strong>phạm vi được uỷ quyền</strong>, bảo vệ quyền riêng tư, và không bao giờ bịa hay thổi phồng kết quả.</p>
<div class="callout"><span class="badge">Ví dụ vụ việc</span> Điều tra viên ghi rõ giới hạn của một phần phục hồi — thay vì nói quá — đã giữ cả báo cáo đáng tin; một đồng nghiệp nói quá đã bị bác uy tín ngay tại toà.</div>`,
  ]]);

const c8q = quiz('frs301-quiz-8', 'Quiz 8 — Tools, report & ethics|||Quiz 8 — Công cụ, báo cáo & đạo đức', [
  { id: 'q1', question: 'Công cụ điều tra ổ đĩa miễn phí, mã nguồn mở phổ biến là?', options: ['EnCase', 'Autopsy (The Sleuth Kit)', 'FTK', 'Microsoft Word'], correctIndex: 1, explanation: 'Autopsy dựng trên The Sleuth Kit, miễn phí và mã nguồn mở.' },
  { id: 'q2', question: 'Một báo cáo pháp chứng tốt phải?', options: ['Giấu phương pháp để bảo mật', 'Ghi rõ công cụ, phiên bản, hash và từng bước để lặp lại được', 'Chỉ nêu kết luận', 'Dùng biệt ngữ càng nhiều càng tốt'], correctIndex: 1, explanation: 'Báo cáo phải minh bạch, có thể tái lập; nêu cả giới hạn.' },
  { id: 'q3', question: 'Nguyên tắc đạo đức cốt lõi của điều tra viên số là?', options: ['Luôn chứng minh nghi phạm có tội', 'Khách quan — báo cả bằng chứng gỡ tội, không nói quá', 'Che giấu bằng chứng bất lợi cho bên thuê', 'Bỏ qua quyền riêng tư'], correctIndex: 1, explanation: 'Khách quan và trung thực: báo cả bằng chứng gỡ tội, không thổi phồng.' },
]);

const taiLieu = doc('frs301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Nelson, Casey), tài liệu chính thức miễn phí (SANS, NIST), công cụ (Autopsy, Volatility), lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">FRS301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn digital forensics — process &amp; chain of custody, disk, memory, network, mobile &amp; cloud, tools and ethics — in one place. The full official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU syllabus &amp; lecture slides for FRS301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.cengage.com/c/guide-to-computer-forensics-and-investigations-6e-nelson" target="_blank" rel="noopener"><em>Guide to Computer Forensics and Investigations</em> — Nelson, Phillips &amp; Steuart</a></li>
<li><a href="https://www.elsevier.com/books/digital-evidence-and-computer-crime/casey/978-0-12-374268-1" target="_blank" rel="noopener"><em>Digital Evidence and Computer Crime</em> — Eoghan Casey</a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.sans.org/cyber-security-courses/?focus-area=digital-forensics-incident-response" target="_blank" rel="noopener">SANS DFIR — courses, posters &amp; cheat sheets</a></li>
<li><a href="https://www.nist.gov/itl/ssd/software-quality-group/computer-forensics-tool-testing-program-cftt" target="_blank" rel="noopener">NIST CFTT — forensic tool testing</a></li>
<li><a href="https://volatility3.readthedocs.io/" target="_blank" rel="noopener">Volatility 3 documentation</a></li>
<li><a href="https://sleuthkit.org/autopsy/docs.php" target="_blank" rel="noopener">Autopsy user documentation</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@13cubed" target="_blank" rel="noopener">13Cubed</a> — DFIR tutorials (memory, disk, Windows internals)</li>
<li><a href="https://www.youtube.com/@DFIRScience" target="_blank" rel="noopener">DFIR Science</a> — hands-on digital forensics walkthroughs</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.autopsy.com/" target="_blank" rel="noopener">Autopsy</a> — free open-source disk forensics</li>
<li><a href="https://volatilityfoundation.org/" target="_blank" rel="noopener">Volatility</a> — memory forensics framework</li>
<li><a href="https://www.wireshark.org/" target="_blank" rel="noopener">Wireshark</a> — network packet analysis</li>
<li><a href="https://digital-forensics.sans.org/community/downloads" target="_blank" rel="noopener">SANS SIFT Workstation</a> — free DFIR Linux toolkit</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — the process (identify → preserve → collect → analyse → report), chain of custody, hashing and admissibility.</li>
<li><strong>Practice</strong> — image a spare USB with FTK Imager, analyse it in Autopsy, and carve deleted files.</li>
<li><strong>Go deeper</strong> — memory with Volatility, traffic with Wireshark, and a mobile extraction.</li>
<li><strong>Job-ready</strong> — work public CTF/DFIR challenges and write a clean, defensible report for each.</li>
</ol></div>`,
    `<span class="eyebrow">FRS301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học điều tra số — quy trình &amp; chuỗi hành trình chứng cứ, ổ đĩa, bộ nhớ, mạng, di động &amp; cloud, công cụ và đạo đức — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của FRS301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.cengage.com/c/guide-to-computer-forensics-and-investigations-6e-nelson" target="_blank" rel="noopener"><em>Guide to Computer Forensics and Investigations</em> — Nelson, Phillips &amp; Steuart</a></li>
<li><a href="https://www.elsevier.com/books/digital-evidence-and-computer-crime/casey/978-0-12-374268-1" target="_blank" rel="noopener"><em>Digital Evidence and Computer Crime</em> — Eoghan Casey</a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.sans.org/cyber-security-courses/?focus-area=digital-forensics-incident-response" target="_blank" rel="noopener">SANS DFIR — khoá học, poster &amp; cheat sheet</a></li>
<li><a href="https://www.nist.gov/itl/ssd/software-quality-group/computer-forensics-tool-testing-program-cftt" target="_blank" rel="noopener">NIST CFTT — kiểm thử công cụ pháp chứng</a></li>
<li><a href="https://volatility3.readthedocs.io/" target="_blank" rel="noopener">Tài liệu Volatility 3</a></li>
<li><a href="https://sleuthkit.org/autopsy/docs.php" target="_blank" rel="noopener">Tài liệu người dùng Autopsy</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@13cubed" target="_blank" rel="noopener">13Cubed</a> — hướng dẫn DFIR (bộ nhớ, ổ đĩa, nội bộ Windows)</li>
<li><a href="https://www.youtube.com/@DFIRScience" target="_blank" rel="noopener">DFIR Science</a> — thực hành điều tra số từng bước</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.autopsy.com/" target="_blank" rel="noopener">Autopsy</a> — điều tra ổ đĩa miễn phí, mã nguồn mở</li>
<li><a href="https://volatilityfoundation.org/" target="_blank" rel="noopener">Volatility</a> — framework điều tra bộ nhớ</li>
<li><a href="https://www.wireshark.org/" target="_blank" rel="noopener">Wireshark</a> — phân tích gói tin mạng</li>
<li><a href="https://digital-forensics.sans.org/community/downloads" target="_blank" rel="noopener">SANS SIFT Workstation</a> — bộ công cụ DFIR Linux miễn phí</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — quy trình (nhận diện → bảo toàn → thu thập → phân tích → báo cáo), chuỗi hành trình chứng cứ, hash và tính chấp nhận được.</li>
<li><strong>Luyện tập</strong> — tạo image một USB dự phòng bằng FTK Imager, soi trong Autopsy, và carve file đã xoá.</li>
<li><strong>Đào sâu</strong> — bộ nhớ với Volatility, lưu lượng với Wireshark, và một lần trích xuất di động.</li>
<li><strong>Sẵn sàng đi làm</strong> — làm thử thách CTF/DFIR công khai và viết một báo cáo sạch, vững chắc cho mỗi bài.</li>
</ol></div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'FRS301',
    slug: 'frs301-digital-forensics',
    title: 'Digital Forensics',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/FRS301.webp',
    shortDescription: 'Digital forensics end to end — cybercrime types, the process & chain of custody, evidence & law, disk & memory forensics (Volatility), network, mobile & cloud, tools (Autopsy/FTK), reports & ethics. Bilingual, with cases & quizzes.|||Điều tra số từ A đến Z — loại tội phạm, quy trình & chuỗi hành trình chứng cứ, bằng chứng & pháp lý, ổ đĩa & bộ nhớ (Volatility), mạng, di động & cloud, công cụ (Autopsy/FTK), báo cáo & đạo đức. Song ngữ, có vụ việc & quiz.',
    description: 'Môn <strong>FRS301 — Digital Forensics (Điều tra số)</strong> thuộc ngành An toàn thông tin, kỳ 5, dạy cách <strong>tìm, bảo toàn, phân tích và trình bày bằng chứng số</strong> sao cho đáng tin trước toà. Từ <strong>khái niệm &amp; quy trình</strong> (nhận diện → bảo toàn → thu thập → phân tích → báo cáo, chuỗi hành trình chứng cứ) → <strong>bằng chứng số &amp; pháp lý</strong> (hash, admissibility, luật VN/quốc tế) → <strong>ổ đĩa &amp; file system</strong> (imaging, FAT/NTFS, carving) → <strong>bộ nhớ</strong> (Volatility) → <strong>mạng</strong> (PCAP, log) → <strong>di động &amp; cloud</strong> → <strong>công cụ, báo cáo &amp; đạo đức</strong>. Bám sách chuẩn Nelson &amp; Casey và SANS DFIR, song ngữ, có ví dụ vụ việc và quiz mỗi chương.',
    whatYouLearn: 'Khái niệm & loại tội phạm số, nguyên tắc ACPO; quy trình 5 bước & chain of custody; bằng chứng số, hash (MD5/SHA-256), admissibility, luật VN & Budapest; disk imaging, FAT/NTFS, file carving, phục hồi file xoá; memory forensics với Volatility (pslist/netscan/malfind); network forensics (tcpdump/Wireshark, log, exfiltration); mobile (logical/physical, SQLite) & cloud; công cụ Autopsy/FTK/EnCase/SIFT, viết báo cáo, ra toà & đạo đức điều tra viên.',
    requirements: 'Kiến thức nền về hệ điều hành, hệ thống tệp và mạng máy tính. Nên cài Autopsy, Volatility và Wireshark (hoặc dùng SANS SIFT) để thực hành.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Điều tra số làm gì, vì sao cần, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Điều tra số là gì|||Chapter 1 — What forensics is', description: 'Khái niệm, vai trò, loại tội phạm, nguyên tắc ACPO.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Quy trình điều tra|||Chapter 2 — The process', description: '5 bước & chuỗi hành trình chứng cứ.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Bằng chứng số & pháp lý|||Chapter 3 — Evidence & law', description: 'Hash, admissibility, luật VN & quốc tế.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Ổ đĩa & file system|||Chapter 4 — Disk forensics', description: 'Imaging, FAT/NTFS, carving, phục hồi file xoá.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Bộ nhớ & tiến trình|||Chapter 5 — Memory forensics', description: 'RAM dump, Volatility, malware trong RAM.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Điều tra mạng|||Chapter 6 — Network forensics', description: 'PCAP, log, truy vết, exfiltration.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Di động & cloud|||Chapter 7 — Mobile & cloud', description: 'Android/iOS, SQLite, cloud, pháp lý xuyên biên giới.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Công cụ, báo cáo & đạo đức|||Chapter 8 — Tools, report & ethics', description: 'Autopsy/FTK/EnCase, viết báo cáo, ra toà, đạo đức.', lessons: [c8, c8q] },
  ],
};
