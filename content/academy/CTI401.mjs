/**
 * CTI401 — Translation & Interpreting (Biên - phiên dịch chuyên nghiệp).
 * Ngành Ngôn ngữ Trung FPTU, Kỳ 5. NỐI TIẾP CCT401/402 (lý thuyết dịch cơ
 * bản) — môn này KHÔNG lặp lý thuyết dịch nền tảng, mà nhấn KỸ NĂNG HÀNH NGHỀ
 * phiên dịch chuyên nghiệp: phiên dịch hội nghị (nối tiếp/song song), công cụ
 * CAT, quản lý thuật ngữ & dự án, kiểm định chất lượng, đạo đức nghề (AIIC),
 * và thị trường dịch thuật. Giữ NGUYÊN slug/semester/courseCode/thumb.
 * ⚠️ KHÔNG backtick lồng/${}; trong HTML content "&" → "&amp;".
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const c1 = doc('cti401-1-1-nghe-va-loai-hinh', '1.1 — The interpreting/translation profession & its types|||1.1 — Nghề biên-phiên dịch & các loại hình',
  'Phân biệt biên dịch (笔译) và phiên dịch (口译); các loại hình phiên dịch: đối thoại/tháp tùng, nối tiếp, song song, thì thầm, dịch nhìn; thị trường phiên dịch hội nghị.',
  [[
    `<span class="eyebrow">CTI401 · Chapter 1 · Lesson 1.1</span>
<h2>The profession: translation vs. interpreting, and its types</h2>
<p class="lead">CCT401/402 gave you the <strong>theory of translation</strong> (equivalence, translation methods, text analysis). CTI401 assumes that foundation and moves straight to <strong>professional practice</strong>: what the job actually looks like in the market.</p>
<h3>笔译 (bǐyì) vs. 口译 (kǒuyì)</h3>
<ul>
<li><strong>Translation (笔译)</strong> — written source text &amp; written target text; time to research, revise, use references and CAT tools; product is a document.</li>
<li><strong>Interpreting (口译)</strong> — spoken (or signed) source and target, delivered in real time, no second draft; the "product" disappears the moment it is spoken. This is CTI401's main focus.</li>
</ul>
<h3>Modes of interpreting</h3>
<ul>
<li><strong>Liaison / escort interpreting (联络传译 / 陪同传译)</strong> — short, informal exchanges: business meetings, factory visits, delegations. Sentence-by-sentence, no notes usually needed.</li>
<li><strong>Consecutive interpreting (交替传译, "交传")</strong> — speaker talks for 1-5+ minutes, interpreter takes notes, then renders the full segment. Used for speeches, press conferences, negotiations.</li>
<li><strong>Simultaneous interpreting (同声传译, "同传")</strong> — interpreter speaks almost at the same time as the source, from a soundproof booth, for conferences with many languages or a tight schedule.</li>
<li><strong>Whispered interpreting (耳语传译, chuchotage)</strong> — simultaneous technique without a booth, whispered to 1-2 listeners.</li>
<li><strong>Sight translation (视译)</strong> — reading a written document in the source language and rendering it orally in the target language on the spot; a bridge skill between 笔译 and 口译.</li>
</ul>
<h3>The conference interpreting market (会议口译市场)</h3>
<p>Buyers of professional interpreting fall into a few buckets: government &amp; diplomacy, international conferences/trade fairs, corporate (M&amp;A, board meetings), legal/court, medical, and community/public-service interpreting. Each has different pay scale, formality and risk profile.</p>
<pre><code>Example — same content, two interpreting modes:
 Source (zh): 我们公司去年的营业额同比增长了百分之十五。
 Consecutive: interpreter notes "营业额↑15% (去年→今年)", then delivers
   after the speaker finishes: "Doanh thu công ty chúng tôi năm ngoái
   tăng 15% so với cùng kỳ."
 Simultaneous: interpreter renders it almost live, a few words behind
   the speaker, with no notes and no pause.
</code></pre>
<div class="callout"><span class="badge">Key distinction</span> A translator can look up a term for ten minutes; an interpreter has about two seconds. Every professional skill in this course — notes, booth technique, CAT tools, QA, ethics, market positioning — exists because of that one constraint.</div>`,
    `<span class="eyebrow">CTI401 · Chương 1 · Bài 1.1</span>
<h2>Nghề nghiệp: biên dịch, phiên dịch và các loại hình</h2>
<p class="lead">CCT401/402 đã cho bạn <strong>lý thuyết dịch</strong> (tương đương dịch, phương pháp dịch, phân tích văn bản). CTI401 xem đó là nền tảng sẵn có và đi thẳng vào <strong>hành nghề chuyên nghiệp</strong>: công việc thực tế trên thị trường trông như thế nào.</p>
<h3>笔译 (bǐyì — biên dịch) vs. 口译 (kǒuyì — phiên dịch)</h3>
<ul>
<li><strong>Biên dịch (笔译)</strong> — văn bản nguồn viết &amp; văn bản đích viết; có thời gian tra cứu, sửa lại, dùng tài liệu tham khảo và công cụ CAT; sản phẩm là một tài liệu.</li>
<li><strong>Phiên dịch (口译)</strong> — nguồn và đích đều là lời nói (hoặc ngôn ngữ ký hiệu), thực hiện tức thời, không có bản nháp thứ hai; "sản phẩm" biến mất ngay khi vừa nói ra. Đây là trọng tâm chính của CTI401.</li>
</ul>
<h3>Các loại hình phiên dịch</h3>
<ul>
<li><strong>Phiên dịch đối thoại / tháp tùng (联络传译 / 陪同传译)</strong> — trao đổi ngắn, không nghi thức: họp kinh doanh, thăm nhà máy, đoàn công tác. Dịch từng câu, thường không cần ghi chú.</li>
<li><strong>Phiên dịch nối tiếp (交替传译, "交传")</strong> — người nói nói liên tục 1-5+ phút, phiên dịch viên ghi chú rồi dịch lại trọn đoạn. Dùng cho bài phát biểu, họp báo, đàm phán.</li>
<li><strong>Phiên dịch song song (同声传译, "同传")</strong> — phiên dịch viên nói gần như đồng thời với nguồn, ngồi trong cabin cách âm, dùng cho hội nghị nhiều ngôn ngữ hoặc lịch trình gấp.</li>
<li><strong>Phiên dịch thì thầm (耳语传译, chuchotage)</strong> — kỹ thuật song song không cần cabin, thì thầm cho 1-2 người nghe.</li>
<li><strong>Dịch nhìn (视译)</strong> — đọc một văn bản viết bằng ngôn ngữ nguồn và dịch nói ngay bằng ngôn ngữ đích; kỹ năng bắc cầu giữa 笔译 và 口译.</li>
</ul>
<h3>Thị trường phiên dịch hội nghị (会议口译市场)</h3>
<p>Người mua dịch vụ phiên dịch chuyên nghiệp chia thành vài nhóm: chính phủ &amp; ngoại giao, hội nghị/hội chợ quốc tế, doanh nghiệp (M&amp;A, họp hội đồng quản trị), pháp lý/toà án, y tế, và phiên dịch cộng đồng/dịch vụ công. Mỗi nhóm có mức thù lao, mức độ trang trọng và rủi ro nghề nghiệp khác nhau.</p>
<pre><code>Ví dụ — cùng nội dung, hai kiểu phiên dịch:
 Nguồn (zh): 我们公司去年的营业额同比增长了百分之十五。
 Nối tiếp: phiên dịch viên ghi "营业额↑15% (去年→今年)", rồi dịch sau khi
   người nói kết thúc: "Doanh thu công ty chúng tôi năm ngoái tăng 15%
   so với cùng kỳ."
 Song song: phiên dịch viên dịch gần như tức thời, chậm hơn người nói
   vài từ, không ghi chú, không có khoảng dừng.
</code></pre>
<div class="callout"><span class="badge">Khác biệt cốt lõi</span> Biên dịch viên có thể tra một thuật ngữ trong mười phút; phiên dịch viên chỉ có khoảng hai giây. Mọi kỹ năng chuyên nghiệp trong môn này — ghi chú, kỹ thuật cabin, công cụ CAT, kiểm định chất lượng, đạo đức, định vị thị trường — đều tồn tại vì ràng buộc duy nhất đó.</div>`,
  ]]);

const c1q = quiz('cti401-quiz-1', 'Quiz 1 — Profession & types|||Quiz 1 — Nghề & loại hình', [
  { id: 'q1', question: '交替传译 (交传) là loại hình phiên dịch nào?', options: ['Phiên dịch song song trong cabin', 'Phiên dịch nối tiếp — ghi chú rồi dịch lại sau khi người nói dứt đoạn', 'Dịch nhìn văn bản viết', 'Biên dịch tài liệu'], correctIndex: 1, explanation: '交替传译 (consecutive): nghe một đoạn, ghi chú, rồi dịch lại toàn bộ.' },
  { id: 'q2', question: 'Khác biệt cốt lõi giữa 笔译 (biên dịch) và 口译 (phiên dịch) là gì?', options: ['Biên dịch khó hơn phiên dịch', 'Phiên dịch không cần hiểu văn hoá nguồn', 'Biên dịch có thời gian tra cứu/sửa lại, phiên dịch phải xử lý tức thời', 'Không có khác biệt, chỉ là tên gọi khác nhau'], correctIndex: 2, explanation: 'Ràng buộc thời gian thực là điểm khác biệt cốt lõi, chi phối toàn bộ kỹ năng nghề phiên dịch.' },
  { id: 'q3', question: '视译 (dịch nhìn) là kỹ năng nào?', options: ['Nghe rồi ghi chú bằng ký hiệu', 'Đọc văn bản nguồn và dịch nói ngay lập tức', 'Dịch trong cabin cách âm', 'Chỉ dùng khi dịch tài liệu pháp lý dài'], correctIndex: 1, explanation: '视译 (sight translation): đọc bằng mắt ngôn ngữ nguồn, dịch ra miệng bằng ngôn ngữ đích ngay tại chỗ.' },
]);

const c2 = doc('cti401-2-1-noi-tiep-ghi-nho', '2.1 — Professional consecutive interpreting & memory technique|||2.1 — Phiên dịch nối tiếp chuyên nghiệp & kỹ thuật ghi nhớ',
  'Quy trình nghe-phân tích-ghi chú-tái tạo-truyền đạt; hệ thống ký hiệu ghi chú (符号); kỹ thuật ghi nhớ (chunking, hình dung, số liệu).',
  [[
    `<span class="eyebrow">CTI401 · Chapter 2 · Lesson 2.1</span>
<h2>Professional consecutive interpreting &amp; memory technique</h2>
<h3>The five-stage process</h3>
<pre><code>Listen &amp; analyze -> Note-take (符号) -> Retain in memory
   -> Reconstruct meaning -> Deliver in target language
</code></pre>
<p>Note-taking (笔记法) is NOT shorthand or dictation. You cannot write everything a speaker says in the time available — so you note the <strong>logic and key facts</strong> (who did what, to whom, when, numbers, links like "but/therefore/because"), not every word.</p>
<h3>A minimal symbol system (符号系统)</h3>
<pre><code>↑ / ↓        tăng / giảm (increase / decrease)
→            dẫn đến, gây ra (leads to, causes)
∴            vì vậy (therefore)
∵            bởi vì (because)
=            là, tương đương (is, equals)
≠            khác với (differs from)
□            quốc gia / chính phủ (country / government, a box)
○ with dot   cuộc họp, hội nghị (meeting, a circle)
2010, 15%    numbers &amp; percentages are ALWAYS written as digits
</code></pre>
<h3>Memory technique</h3>
<ul>
<li><strong>Chunking</strong> — group related facts (a date + an event + a number) instead of memorizing isolated words.</li>
<li><strong>Visualization</strong> — turn a narrative into a mental image or storyline; images are recalled faster than word lists.</li>
<li><strong>Numbers first</strong> — numbers, names and technical terms have the least redundancy and must be captured exactly; ideas and connectors can be reconstructed from memory even if the exact wording is lost.</li>
</ul>
<div class="callout"><span class="badge">Worked example</span> Source (zh): "根据最新统计，中国和越南之间的贸易额去年达到了2300亿美元，同比增长约百分之六。" Notes: "中越贸易 2023亿✕ 230e$ ↑6% (去年)". Delivery (vi): "Theo thống kê mới nhất, kim ngạch thương mại giữa Trung Quốc và Việt Nam năm ngoái đạt 230 tỉ đô la Mỹ, tăng khoảng 6% so với cùng kỳ."</div>`,
    `<span class="eyebrow">CTI401 · Chương 2 · Bài 2.1</span>
<h2>Phiên dịch nối tiếp chuyên nghiệp &amp; kỹ thuật ghi nhớ</h2>
<h3>Quy trình 5 bước</h3>
<pre><code>Nghe &amp; phân tích -> Ghi chú (符号) -> Lưu giữ trong trí nhớ
   -> Tái tạo lại nghĩa -> Truyền đạt bằng ngôn ngữ đích
</code></pre>
<p>Ghi chú (笔记法) KHÔNG phải tốc ký hay chép chính tả. Bạn không thể viết hết những gì người nói nói ra trong thời gian cho phép — nên bạn ghi <strong>logic và dữ kiện chính</strong> (ai làm gì, với ai, khi nào, số liệu, liên từ như "nhưng/vì vậy/bởi vì"), không phải từng chữ.</p>
<h3>Hệ thống ký hiệu tối giản (符号系统)</h3>
<pre><code>↑ / ↓        tăng / giảm
→            dẫn đến, gây ra
∴            vì vậy
∵            bởi vì
=            là, tương đương
≠            khác với
□            quốc gia / chính phủ (hình ô vuông)
○ có chấm    cuộc họp, hội nghị (hình tròn)
2010, 15%    số liệu &amp; phần trăm LUÔN viết bằng chữ số</code></pre>
<h3>Kỹ thuật ghi nhớ</h3>
<ul>
<li><strong>Chunking (nhóm ý)</strong> — nhóm các dữ kiện liên quan (một ngày tháng + một sự kiện + một con số) thay vì nhớ từng từ rời rạc.</li>
<li><strong>Hình dung (visualization)</strong> — biến câu chuyện thành hình ảnh hoặc mạch truyện trong đầu; hình ảnh được nhớ lại nhanh hơn danh sách từ.</li>
<li><strong>Ưu tiên số liệu</strong> — số, tên riêng và thuật ngữ chuyên môn có độ dư thừa thấp nhất nên phải ghi chính xác; ý tưởng và liên từ có thể tái tạo lại từ trí nhớ dù mất câu chữ chính xác.</li>
</ul>
<div class="callout"><span class="badge">Ví dụ thực tế</span> Nguồn (zh): "根据最新统计，中国和越南之间的贸易额去年达到了2300亿美元，同比增长约百分之六。" Ghi chú: "中越贸易 230e$ ↑6% (去年)". Truyền đạt (vi): "Theo thống kê mới nhất, kim ngạch thương mại giữa Trung Quốc và Việt Nam năm ngoái đạt 230 tỉ đô la Mỹ, tăng khoảng 6% so với cùng kỳ."</div>`,
  ]]);

const c2q = quiz('cti401-quiz-2', 'Quiz 2 — Consecutive & memory|||Quiz 2 — Nối tiếp & ghi nhớ', [
  { id: 'q1', question: 'Ghi chú (笔记法) trong phiên dịch nối tiếp có mục đích gì?', options: ['Chép lại chính xác từng từ người nói', 'Ghi logic và dữ kiện chính (ai/gì/khi nào/số liệu), không phải từng chữ', 'Thay thế hoàn toàn trí nhớ', 'Chỉ dùng cho phiên dịch song song'], correctIndex: 1, explanation: 'Ghi chú hỗ trợ trí nhớ bằng logic và dữ kiện, không phải tốc ký từng từ.' },
  { id: 'q2', question: 'Vì sao số liệu và tên riêng cần được ưu tiên ghi chính xác nhất?', options: ['Vì chúng dễ nhớ nhất', 'Vì chúng có độ dư thừa thấp, không thể suy luận lại nếu quên', 'Vì khán giả không quan tâm số liệu', 'Vì chúng luôn xuất hiện ở đầu câu'], correctIndex: 1, explanation: 'Không giống ý tưởng có thể tái tạo bằng logic, số liệu/tên riêng mất là mất hẳn.' },
  { id: 'q3', question: 'Kỹ thuật "chunking" trong ghi nhớ phiên dịch là gì?', options: ['Viết tốc ký từng chữ', 'Nhóm các dữ kiện liên quan thành một khối thay vì nhớ rời rạc', 'Chỉ ghi con số, bỏ qua ý nghĩa', 'Dịch từng từ một theo thứ tự nguồn'], correctIndex: 1, explanation: 'Chunking nhóm ý liên quan (ngày + sự kiện + số) để trí nhớ ngắn hạn xử lý hiệu quả hơn.' },
]);

const c3 = doc('cti401-3-1-song-song-cabin', '3.1 — Simultaneous interpreting & the booth|||3.1 — Phiên dịch song song & cabin',
  'Kỹ thuật song song (同声传译): độ trễ nghe-nói (décalage), tách chú ý; tiêu chuẩn cabin ISO, làm việc theo cặp, phiên dịch tiếp sức (接力传译).',
  [[
    `<span class="eyebrow">CTI401 · Chapter 3 · Lesson 3.1</span>
<h2>Simultaneous interpreting &amp; the booth</h2>
<h3>The core skill: split attention</h3>
<p>In <strong>simultaneous interpreting (同声传译)</strong> the interpreter listens, analyzes, reformulates and speaks — all at once, with a lag of a few seconds behind the speaker called the <strong>décalage (听说滞差, "ear-voice span")</strong>. A short décalage risks literal, awkward output; a long one risks losing information. Professional interpreters train to hold roughly 2-4 seconds.</p>
<h3>The booth (同传箱)</h3>
<pre><code>ISO 2603 (permanent booth) / ISO 4043 (mobile booth) require:
 - soundproofing so booths don't bleed into each other
 - clear sightline to the speaker &amp; screen
 - a console: channel select, volume, mute/cough button
 - 2 interpreters per booth per language pair (never 1, for a full day)
</code></pre>
<h3>Team rotation &amp; relay</h3>
<ul>
<li><strong>20-30 minute rotation</strong> — simultaneous interpreting is cognitively exhausting; partners swap on a schedule, and the resting partner supports with numbers/names on paper.</li>
<li><strong>Relay interpreting (接力传译)</strong> — when no interpreter covers a rare language pair directly (e.g. Vietnamese ↔ a third language with no direct booth), one booth interprets into a "pivot" language (often English or Chinese) that other booths then interpret from.</li>
</ul>
<div class="callout"><span class="badge">Worked example</span> Source (zh, live, no pause): "尊敬的各位来宾，欢迎大家参加本次中越经贸合作论坛。" Simultaneous rendering starts 2-3 seconds behind: "Kính thưa quý vị đại biểu, xin chào mừng quý vị đến với diễn đàn hợp tác kinh tế thương mại Việt-Trung lần này." — note the interpreter begins before the Chinese sentence even finishes.</div>`,
    `<span class="eyebrow">CTI401 · Chương 3 · Bài 3.1</span>
<h2>Phiên dịch song song &amp; cabin</h2>
<h3>Kỹ năng cốt lõi: tách chú ý</h3>
<p>Trong <strong>phiên dịch song song (同声传译)</strong>, phiên dịch viên vừa nghe, vừa phân tích, vừa tái tạo và vừa nói — cùng lúc, với độ trễ vài giây so với người nói gọi là <strong>décalage (听说滞差, "khoảng cách nghe-nói")</strong>. Độ trễ ngắn dễ dẫn đến dịch sát từng chữ, khiên cưỡng; độ trễ dài dễ mất thông tin. Phiên dịch viên chuyên nghiệp luyện giữ khoảng 2-4 giây.</p>
<h3>Cabin phiên dịch (同传箱)</h3>
<pre><code>ISO 2603 (cabin cố định) / ISO 4043 (cabin di động) yêu cầu:
 - cách âm để các cabin không lẫn tiếng nhau
 - tầm nhìn rõ tới người nói &amp; màn hình
 - bàn điều khiển: chọn kênh, âm lượng, nút tắt tiếng/ho
 - 2 phiên dịch viên mỗi cabin mỗi cặp ngôn ngữ (không bao giờ 1 người
   cho cả ngày)</code></pre>
<h3>Luân phiên theo đội &amp; phiên dịch tiếp sức</h3>
<ul>
<li><strong>Luân phiên 20-30 phút</strong> — phiên dịch song song hao tổn nhận thức rất lớn; hai người thay nhau theo lịch, người nghỉ hỗ trợ đối tác bằng cách ghi số liệu/tên riêng ra giấy.</li>
<li><strong>Phiên dịch tiếp sức (接力传译)</strong> — khi không có phiên dịch viên trực tiếp cho một cặp ngôn ngữ hiếm (vd Việt ↔ một ngôn ngữ thứ ba không có cabin trực tiếp), một cabin dịch sang ngôn ngữ "trung gian" (thường là Anh hoặc Trung) để các cabin khác dịch tiếp từ đó.</li>
</ul>
<div class="callout"><span class="badge">Ví dụ thực tế</span> Nguồn (zh, trực tiếp, không dừng): "尊敬的各位来宾，欢迎大家参加本次中越经贸合作论坛。" Bản dịch song song bắt đầu trễ 2-3 giây: "Kính thưa quý vị đại biểu, xin chào mừng quý vị đến với diễn đàn hợp tác kinh tế thương mại Việt-Trung lần này." — chú ý phiên dịch viên bắt đầu nói trước khi câu tiếng Trung kết thúc.</div>`,
  ]]);

const c3q = quiz('cti401-quiz-3', 'Quiz 3 — Simultaneous & booth|||Quiz 3 — Song song & cabin', [
  { id: 'q1', question: 'Décalage (听说滞差) trong phiên dịch song song là gì?', options: ['Số kênh trên bàn điều khiển cabin', 'Độ trễ giữa lúc nghe nguồn và lúc nói ra bản dịch', 'Thời gian nghỉ giữa hai phiên họp', 'Số lượng phiên dịch viên trong một cabin'], correctIndex: 1, explanation: 'Décalage là khoảng cách nghe-nói, thường giữ ở mức 2-4 giây.' },
  { id: 'q2', question: 'Vì sao một cabin song song luôn cần 2 phiên dịch viên cho cả ngày làm việc?', options: ['Vì tiêu chuẩn thẩm mỹ', 'Vì phiên dịch song song hao tổn nhận thức lớn, cần luân phiên 20-30 phút', 'Vì mỗi người chỉ biết một nửa ngôn ngữ', 'Không có lý do kỹ thuật, chỉ là thông lệ'], correctIndex: 1, explanation: 'Luân phiên giúp duy trì chất lượng và tránh kiệt sức nhận thức.' },
  { id: 'q3', question: 'Phiên dịch tiếp sức (接力传译) được dùng khi nào?', options: ['Khi phòng họp không có cabin', 'Khi không có phiên dịch viên trực tiếp cho một cặp ngôn ngữ hiếm, cần qua ngôn ngữ trung gian', 'Khi phiên dịch viên bị ốm giữa buổi', 'Khi dịch tài liệu viết dài'], correctIndex: 1, explanation: 'Tiếp sức dùng ngôn ngữ pivot (thường Anh/Trung) làm cầu nối giữa các cabin.' },
]);

const c4 = doc('cti401-4-1-cat-tools', '4.1 — CAT tools & translation memory|||4.1 — Công cụ hỗ trợ dịch (CAT) & bộ nhớ dịch',
  'Trados Studio, MemoQ; bộ nhớ dịch (TM), fuzzy match; máy dịch & hậu biên tập (MTPE); vai trò CAT trong dự án dịch lớn.',
  [[
    `<span class="eyebrow">CTI401 · Chapter 4 · Lesson 4.1</span>
<h2>CAT tools &amp; translation memory</h2>
<h3>What a CAT tool actually does</h3>
<p><strong>CAT (Computer-Assisted Translation)</strong> tools like <strong>SDL Trados Studio</strong> and <strong>MemoQ</strong> do not translate for you (that is machine translation). They split the source into segments (usually sentences), show source and target side by side, and — critically — remember every segment you translate in a <strong>translation memory (TM, 翻译记忆库)</strong>.</p>
<h3>Translation memory &amp; fuzzy match</h3>
<pre><code>New segment: "本合同自双方签字之日起生效。"
TM has (95% match): "本协议自双方签字之日起生效。"
  -&gt; CAT tool suggests the old Vietnamese translation, highlights the
     ONE changed word (合同/协议 = hợp đồng/thoả thuận) for you to fix.
100% match / repetition -&gt; auto-filled, still needs a human check.
No match -&gt; translate from scratch; it is added to the TM for next time.
</code></pre>
<p>A well-maintained TM means a returning client's contracts get <strong>faster, cheaper, and more consistent</strong> translations over time — consistency (统一) matters enormously in legal and technical texts.</p>
<h3>Machine translation post-editing (MTPE, 机器翻译译后编辑)</h3>
<p>Modern CAT tools plug in a machine-translation engine as a first draft. The human's job shifts from translating from scratch to <strong>post-editing</strong>: fixing terminology, tone, and factual errors — a different, faster, but equally skilled task, usually billed at a lower rate than full translation.</p>
<div class="callout"><span class="badge">Career note</span> Fluency with at least one CAT tool (Trados or MemoQ) is now a baseline requirement on almost every agency's job posting — treat it as a core professional skill, not an optional extra.</div>`,
    `<span class="eyebrow">CTI401 · Chương 4 · Bài 4.1</span>
<h2>Công cụ hỗ trợ dịch (CAT) &amp; bộ nhớ dịch</h2>
<h3>Công cụ CAT thực sự làm gì</h3>
<p>Công cụ <strong>CAT (Computer-Assisted Translation)</strong> như <strong>SDL Trados Studio</strong> và <strong>MemoQ</strong> KHÔNG dịch thay bạn (đó là máy dịch). Chúng chia văn bản nguồn thành các đoạn (segment, thường là câu), hiển thị nguồn và đích song song, và — quan trọng nhất — ghi nhớ mọi đoạn bạn đã dịch vào <strong>bộ nhớ dịch (TM, 翻译记忆库)</strong>.</p>
<h3>Bộ nhớ dịch &amp; khớp mờ (fuzzy match)</h3>
<pre><code>Đoạn mới: "本合同自双方签字之日起生效。"
TM có sẵn (khớp 95%): "本协议自双方签字之日起生效。"
  -&gt; Công cụ CAT gợi ý bản dịch tiếng Việt cũ, tô đậm MỘT từ đã đổi
     (合同/协议 = hợp đồng/thoả thuận) để bạn sửa.
Khớp 100% / lặp lại -&gt; điền tự động, vẫn cần người kiểm lại.
Không khớp -&gt; dịch từ đầu; đoạn này được thêm vào TM cho lần sau.
</code></pre>
<p>Một TM được duy trì tốt nghĩa là hợp đồng của một khách hàng quay lại sẽ được dịch <strong>nhanh hơn, rẻ hơn, và nhất quán hơn</strong> theo thời gian — tính nhất quán (统一) cực kỳ quan trọng trong văn bản pháp lý và kỹ thuật.</p>
<h3>Hậu biên tập máy dịch (MTPE, 机器翻译译后编辑)</h3>
<p>Công cụ CAT hiện đại tích hợp một công cụ máy dịch làm bản nháp đầu tiên. Công việc của con người chuyển từ dịch từ đầu sang <strong>hậu biên tập</strong>: sửa thuật ngữ, văn phong, và lỗi sự kiện — một kỹ năng khác, nhanh hơn, nhưng vẫn đòi hỏi tay nghề, thường được trả giá thấp hơn dịch trọn vẹn.</p>
<div class="callout"><span class="badge">Ghi chú nghề nghiệp</span> Thành thạo ít nhất một công cụ CAT (Trados hoặc MemoQ) giờ là yêu cầu cơ bản trong gần như mọi tin tuyển dụng của công ty dịch thuật — hãy coi đó là kỹ năng nghề cốt lõi, không phải phụ thêm.</div>`,
  ]]);

const c4q = quiz('cti401-quiz-4', 'Quiz 4 — CAT tools & TM|||Quiz 4 — Công cụ CAT & bộ nhớ dịch', [
  { id: 'q1', question: 'Bộ nhớ dịch (Translation Memory) lưu trữ điều gì?', options: ['Từ điển thuật ngữ chuyên ngành', 'Các cặp đoạn nguồn-đích đã dịch trước đó để tái sử dụng', 'Bản ghi âm phiên dịch', 'Danh sách khách hàng của công ty dịch'], correctIndex: 1, explanation: 'TM lưu cặp câu/đoạn nguồn-đích, gợi ý lại khi gặp đoạn giống hoặc gần giống.' },
  { id: 'q2', question: '"Fuzzy match 95%" trong công cụ CAT nghĩa là gì?', options: ['Bản dịch chắc chắn đúng 95%', 'Đoạn mới gần giống một đoạn đã có trong TM, chỉ khác một phần nhỏ', 'Máy dịch tự động không cần kiểm tra', 'Tốc độ xử lý của phần mềm'], correctIndex: 1, explanation: 'Fuzzy match báo phần trăm giống nhau với đoạn cũ trong TM, người dịch chỉnh phần khác biệt.' },
  { id: 'q3', question: 'MTPE (机器翻译译后编辑) là công việc gì?', options: ['Dịch hoàn toàn từ đầu không dùng công cụ', 'Sửa lại bản dịch máy về thuật ngữ, văn phong, lỗi sự kiện', 'Ghi chú trong phiên dịch nối tiếp', 'Quản lý dự án dịch thuật'], correctIndex: 1, explanation: 'MTPE = hậu biên tập bản dịch máy, một kỹ năng riêng biệt với dịch từ đầu.' },
]);

const c5 = doc('cti401-5-1-thuat-ngu-du-an', '5.1 — Terminology & translation project management|||5.1 — Quản lý thuật ngữ & dự án dịch thuật',
  'Xây dựng bảng thuật ngữ (术语库), quy trình dự án dịch (báo giá-phân công-dịch-hiệu đính-dàn trang-giao), vai trò PM/biên dịch/hiệu đính.',
  [[
    `<span class="eyebrow">CTI401 · Chapter 5 · Lesson 5.1</span>
<h2>Terminology &amp; translation project management</h2>
<h3>Terminology management (术语管理)</h3>
<p>For any client working across many documents (a company, a conference series), an agreed <strong>termbase / glossary (术语库)</strong> is built <em>before</em> translation starts: source term, approved target term, definition, domain, do-not-use variants. Without it, five translators on one project produce five different Vietnamese words for the same Chinese term.</p>
<pre><code>Termbase entry example:
 Source (zh)   : 供应链
 Target (vi)   : chuỗi cung ứng   [NOT "dây chuyền cung cấp"]
 Domain        : logistics / business
 Note          : always lowercase in running text, capitalize in titles
</code></pre>
<h3>The project workflow</h3>
<pre><code>Client request -> Quote &amp; deadline -> Assign translator(s)
   -> Translation (using TM + termbase) -> Review / revision
   -> Proofreading -> DTP / formatting -> Final QA -> Delivery
</code></pre>
<h3>Roles on a project</h3>
<ul>
<li><strong>Project manager (PM)</strong> — scopes the job, sets deadline &amp; budget, assigns people, is the single point of contact with the client.</li>
<li><strong>Translator</strong> — produces the first full draft.</li>
<li><strong>Reviewer / editor</strong> — a second linguist checks accuracy &amp; terminology against the source.</li>
<li><strong>Proofreader</strong> — checks the target text alone for spelling, grammar, formatting — see Chapter 6.</li>
</ul>
<div class="callout"><span class="badge">Why this matters</span> On a large project (a 500-page manual, a multi-day conference), the interpreter or translator is one link in a chain — professional value comes as much from following the process as from language skill alone.</div>`,
    `<span class="eyebrow">CTI401 · Chương 5 · Bài 5.1</span>
<h2>Quản lý thuật ngữ &amp; dự án dịch thuật</h2>
<h3>Quản lý thuật ngữ (术语管理)</h3>
<p>Với bất kỳ khách hàng nào làm việc trên nhiều tài liệu (một công ty, một chuỗi hội nghị), một <strong>bảng thuật ngữ (术语库)</strong> được thống nhất <em>trước khi</em> dịch bắt đầu: thuật ngữ nguồn, thuật ngữ đích đã duyệt, định nghĩa, lĩnh vực, các biến thể KHÔNG được dùng. Không có nó, năm biên dịch viên trên cùng một dự án sẽ tạo ra năm từ tiếng Việt khác nhau cho cùng một thuật ngữ tiếng Trung.</p>
<pre><code>Ví dụ mục trong bảng thuật ngữ:
 Nguồn (zh)    : 供应链
 Đích (vi)     : chuỗi cung ứng   [KHÔNG dùng "dây chuyền cung cấp"]
 Lĩnh vực      : logistics / kinh doanh
 Ghi chú       : viết thường trong văn bản, viết hoa trong tiêu đề</code></pre>
<h3>Quy trình dự án</h3>
<pre><code>Yêu cầu khách hàng -> Báo giá &amp; hạn chót -> Phân công biên dịch viên
   -> Dịch (dùng TM + bảng thuật ngữ) -> Hiệu đính / kiểm tra
   -> Đọc soát lỗi -> Dàn trang (DTP) -> Kiểm định cuối -> Giao hàng
</code></pre>
<h3>Vai trò trong dự án</h3>
<ul>
<li><strong>Quản lý dự án (PM)</strong> — xác định phạm vi, đặt hạn chót &amp; ngân sách, phân công nhân sự, là đầu mối liên lạc duy nhất với khách hàng.</li>
<li><strong>Biên dịch viên</strong> — tạo ra bản dịch đầy đủ đầu tiên.</li>
<li><strong>Người hiệu đính / biên tập</strong> — một biên dịch viên thứ hai kiểm tra độ chính xác &amp; thuật ngữ so với bản gốc.</li>
<li><strong>Người đọc soát</strong> — chỉ kiểm tra văn bản đích về chính tả, ngữ pháp, định dạng — xem Chương 6.</li>
</ul>
<div class="callout"><span class="badge">Vì sao điều này quan trọng</span> Trong một dự án lớn (một cuốn sổ tay 500 trang, một hội nghị nhiều ngày), phiên/biên dịch viên chỉ là một mắt xích trong chuỗi — giá trị chuyên nghiệp đến từ việc tuân thủ quy trình cũng nhiều như từ khả năng ngôn ngữ.</div>`,
  ]]);

const c5q = quiz('cti401-quiz-5', 'Quiz 5 — Terminology & project mgmt|||Quiz 5 — Thuật ngữ & quản lý dự án', [
  { id: 'q1', question: 'Bảng thuật ngữ (术语库) được xây dựng khi nào và để làm gì?', options: ['Sau khi giao hàng, để lưu trữ', 'Trước khi dịch, để nhiều biên dịch viên dùng chung một thuật ngữ thống nhất', 'Chỉ dùng cho phiên dịch song song', 'Do khách hàng tự viết, không liên quan tới nhóm dịch'], correctIndex: 1, explanation: 'Bảng thuật ngữ thống nhất cách dịch trước khi dự án bắt đầu, tránh mỗi người dịch một kiểu.' },
  { id: 'q2', question: 'Trong quy trình dự án dịch thuật, ai là đầu mối liên lạc duy nhất với khách hàng?', options: ['Biên dịch viên', 'Người đọc soát', 'Quản lý dự án (PM)', 'Khách hàng tự liên hệ từng biên dịch viên'], correctIndex: 2, explanation: 'PM chịu trách nhiệm phạm vi, hạn chót, ngân sách và là đầu mối duy nhất với khách hàng.' },
  { id: 'q3', question: 'Vai trò "Reviewer / editor" khác gì "Proofreader"?', options: ['Không khác gì, chỉ là tên gọi khác', 'Reviewer kiểm tra so với bản gốc; Proofreader chỉ kiểm tra bản đích (chính tả, ngữ pháp)', 'Proofreader kiểm tra thuật ngữ so với bản gốc', 'Reviewer chỉ làm việc với khách hàng'], correctIndex: 1, explanation: 'Reviewer đối chiếu nguồn-đích; proofreader chỉ đọc bản đích độc lập.' },
]);

const c6 = doc('cti401-6-1-kiem-dinh-hieu-dinh', '6.1 — Quality assurance & revision|||6.1 — Kiểm định chất lượng & hiệu đính bản dịch',
  'Phân biệt hiệu đính (revision) / biên tập (editing) / đọc soát (proofreading); tiêu chuẩn ISO 17100; chỉ số đánh giá chất lượng (LQA); dịch ngược để kiểm tra.',
  [[
    `<span class="eyebrow">CTI401 · Chapter 6 · Lesson 6.1</span>
<h2>Quality assurance &amp; revision</h2>
<h3>Three different checks, often confused</h3>
<ul>
<li><strong>Revision (审校 / 校对)</strong> — compares target AND source side by side; checks meaning, omissions, additions, terminology consistency.</li>
<li><strong>Editing (编辑)</strong> — improves the target text's style and readability, may or may not check against the source.</li>
<li><strong>Proofreading (校对)</strong> — reads the target text ALONE for spelling, grammar, punctuation, formatting; the last line of defense before delivery.</li>
</ul>
<h3>ISO 17100 — the industry standard</h3>
<p><strong>ISO 17100</strong> (translation services) requires that every translation is checked by a <em>second</em> qualified linguist before delivery — the "four-eyes principle". A single translator's own read-through of their own work does not satisfy this standard; bias toward one's own choices is well documented.</p>
<h3>Language Quality Assessment (LQA)</h3>
<pre><code>Typical LQA error categories &amp; severity:
 Critical -&gt; mistranslation that changes meaning / legal risk
 Major    -&gt; wrong terminology, omission, grammar breaking meaning
 Minor    -&gt; style, minor punctuation, formatting
Score = weighted error count per N words -&gt; pass/fail threshold
</code></pre>
<div class="callout"><span class="badge">Back-translation as a sanity check</span> For high-risk texts (legal contracts, pharma), a common technique is <strong>back-translation</strong>: have a different translator translate the target text back into the source language, then compare to the original — mismatches surface hidden errors neither reviewer caught.</div>`,
    `<span class="eyebrow">CTI401 · Chương 6 · Bài 6.1</span>
<h2>Kiểm định chất lượng &amp; hiệu đính bản dịch</h2>
<h3>Ba phép kiểm khác nhau, hay bị nhầm lẫn</h3>
<ul>
<li><strong>Hiệu đính (审校 / 校对)</strong> — đối chiếu song song bản đích VÀ bản nguồn; kiểm tra nghĩa, sót ý, thêm ý, tính nhất quán thuật ngữ.</li>
<li><strong>Biên tập (编辑)</strong> — cải thiện văn phong và độ dễ đọc của bản đích, có thể có hoặc không đối chiếu với nguồn.</li>
<li><strong>Đọc soát (校对)</strong> — chỉ đọc bản đích, kiểm tra chính tả, ngữ pháp, dấu câu, định dạng; tuyến phòng thủ cuối cùng trước khi giao.</li>
</ul>
<h3>ISO 17100 — chuẩn mực ngành</h3>
<p><strong>ISO 17100</strong> (dịch vụ dịch thuật) yêu cầu mọi bản dịch phải được kiểm tra bởi một biên dịch viên đủ trình độ <em>thứ hai</em> trước khi giao — "nguyên tắc bốn mắt". Việc một biên dịch viên tự đọc lại bài của chính mình KHÔNG đạt chuẩn này; thiên vị với lựa chọn của chính mình là hiện tượng đã được ghi nhận rõ.</p>
<h3>Đánh giá chất lượng ngôn ngữ (LQA)</h3>
<pre><code>Các mức lỗi LQA điển hình:
 Nghiêm trọng -&gt; dịch sai làm thay đổi nghĩa / rủi ro pháp lý
 Lớn         -&gt; sai thuật ngữ, sót ý, lỗi ngữ pháp làm sai nghĩa
 Nhỏ         -&gt; văn phong, dấu câu nhỏ, định dạng
Điểm = số lỗi có trọng số trên N từ -&gt; ngưỡng đạt/không đạt</code></pre>
<div class="callout"><span class="badge">Dịch ngược làm phép kiểm tra chéo</span> Với văn bản rủi ro cao (hợp đồng pháp lý, dược phẩm), một kỹ thuật phổ biến là <strong>dịch ngược (back-translation)</strong>: nhờ một biên dịch viên khác dịch ngược bản đích về ngôn ngữ nguồn, rồi so với bản gốc — sự lệch nhau lộ ra những lỗi ẩn mà cả hai lần kiểm trước đó đều bỏ sót.</div>`,
  ]]);

const c6q = quiz('cti401-quiz-6', 'Quiz 6 — QA & revision|||Quiz 6 — Kiểm định & hiệu đính', [
  { id: 'q1', question: 'Điểm khác biệt chính giữa "Revision" và "Proofreading" là gì?', options: ['Không khác nhau', 'Revision đối chiếu nguồn-đích; Proofreading chỉ đọc bản đích độc lập', 'Proofreading luôn làm trước Revision', 'Revision chỉ áp dụng cho phiên dịch, không áp dụng cho biên dịch'], correctIndex: 1, explanation: 'Revision so sánh với nguồn để bắt lỗi nghĩa; proofreading chỉ soát lỗi hình thức của bản đích.' },
  { id: 'q2', question: '"Nguyên tắc bốn mắt" trong ISO 17100 nghĩa là gì?', options: ['Cần bốn biên dịch viên cho mỗi dự án', 'Bản dịch phải được một biên dịch viên đủ trình độ THỨ HAI kiểm tra trước khi giao', 'Người dịch phải đọc lại bốn lần', 'Chỉ áp dụng cho văn bản pháp lý'], correctIndex: 1, explanation: 'Một người tự đọc lại bài của mình không đạt chuẩn ISO 17100 — cần người thứ hai kiểm tra độc lập.' },
  { id: 'q3', question: 'Kỹ thuật "dịch ngược" (back-translation) dùng để làm gì?', options: ['Tăng tốc độ dịch', 'Kiểm tra chéo bằng cách dịch bản đích ngược lại nguồn rồi so sánh, lộ lỗi ẩn', 'Thay thế hoàn toàn cho hiệu đính', 'Chỉ dùng trong phiên dịch song song'], correctIndex: 1, explanation: 'Dịch ngược là phép kiểm tra chéo bổ sung, thường dùng cho văn bản rủi ro cao.' },
]);

const c7 = doc('cti401-7-1-dao-duc-nghe', '7.1 — Professional ethics & standards (AIIC)|||7.1 — Đạo đức nghề nghiệp & chuẩn mực (AIIC)',
  'Bảo mật (保密), trung lập/khách quan (中立), chính xác (准确性); quy tắc đạo đức AIIC; điều kiện làm việc chuyên nghiệp.',
  [[
    `<span class="eyebrow">CTI401 · Chapter 7 · Lesson 7.1</span>
<h2>Professional ethics &amp; standards (AIIC)</h2>
<h3>The AIIC Code of Professional Ethics</h3>
<p><strong>AIIC (International Association of Conference Interpreters)</strong> sets the reference standard for professional conference interpreting worldwide. Its code rests on three pillars:</p>
<ul>
<li><strong>Confidentiality (保密义务)</strong> — everything heard in a professional assignment (business, medical, legal, diplomatic) stays strictly confidential, indefinitely, even after the event ends.</li>
<li><strong>Impartiality / neutrality (中立性)</strong> — the interpreter renders what is said without adding, omitting, editorializing, or taking sides — even if personally disagreeing with the speaker.</li>
<li><strong>Accuracy &amp; fidelity (准确性 / 忠实性)</strong> — render the full meaning and register faithfully; a professional does not "improve," soften, or censor the message.</li>
</ul>
<h3>Working conditions as an ethical matter</h3>
<p>AIIC's standards also cover conditions that protect quality: team size (never one interpreter alone for a full simultaneous day), rest breaks, advance access to documents and speeches, and refusing an assignment outside one's competence (language pair, subject matter) rather than improvising badly.</p>
<pre><code>A professional interpreter DOES:
  - decline an assignment they are not qualified for
  - ask for materials/glossaries in advance
  - flag a mistake immediately, in a neutral way
A professional interpreter does NOT:
  - share what they heard, even anonymized, after the job
  - "fix" a speaker's argument or add their own opinion
  - accept to work alone, unbriefed, for a full simultaneous day</code></pre>
<div class="callout"><span class="badge">Why ethics is a job skill</span> Clients hire interpreters for sensitive, high-stakes conversations precisely BECAUSE they trust these norms — breaking confidentiality or neutrality even once can end a career, regardless of language skill.</div>`,
    `<span class="eyebrow">CTI401 · Chương 7 · Bài 7.1</span>
<h2>Đạo đức nghề nghiệp &amp; chuẩn mực (AIIC)</h2>
<h3>Bộ quy tắc đạo đức nghề của AIIC</h3>
<p><strong>AIIC (Hiệp hội Phiên dịch viên Hội nghị Quốc tế)</strong> đặt ra chuẩn mực tham chiếu cho phiên dịch hội nghị chuyên nghiệp trên toàn thế giới. Bộ quy tắc dựa trên ba trụ cột:</p>
<ul>
<li><strong>Bảo mật (保密义务)</strong> — mọi thông tin nghe được trong một nhiệm vụ chuyên nghiệp (kinh doanh, y tế, pháp lý, ngoại giao) phải được giữ kín tuyệt đối, vô thời hạn, kể cả sau khi sự kiện kết thúc.</li>
<li><strong>Trung lập / khách quan (中立性)</strong> — phiên dịch viên truyền đạt đúng những gì được nói, không thêm, không bớt, không bình luận, không đứng về phe nào — kể cả khi cá nhân không đồng tình với người nói.</li>
<li><strong>Chính xác &amp; trung thực (准确性 / 忠实性)</strong> — truyền đạt đầy đủ nghĩa và văn phong một cách trung thực; người chuyên nghiệp không "làm cho hay hơn", làm dịu đi, hay kiểm duyệt thông điệp.</li>
</ul>
<h3>Điều kiện làm việc như một vấn đề đạo đức</h3>
<p>Chuẩn mực của AIIC cũng bao gồm điều kiện bảo vệ chất lượng: quy mô đội (không bao giờ một phiên dịch viên đơn độc cho cả ngày phiên dịch song song), thời gian nghỉ, được tiếp cận trước tài liệu và bài phát biểu, và từ chối một nhiệm vụ ngoài năng lực (cặp ngôn ngữ, lĩnh vực chuyên môn) thay vì ứng biến kém.</p>
<pre><code>Phiên dịch viên chuyên nghiệp NÊN:
  - từ chối nhiệm vụ mình không đủ năng lực
  - yêu cầu tài liệu/bảng thuật ngữ trước
  - báo lỗi ngay lập tức, theo cách trung lập
Phiên dịch viên chuyên nghiệp KHÔNG NÊN:
  - kể lại những gì đã nghe, kể cả ẩn danh, sau khi xong việc
  - "sửa" lập luận của người nói hay thêm ý kiến cá nhân
  - chấp nhận làm một mình, không được thông báo trước, cả ngày
    phiên dịch song song</code></pre>
<div class="callout"><span class="badge">Vì sao đạo đức là một kỹ năng nghề</span> Khách hàng thuê phiên dịch viên cho những cuộc trò chuyện nhạy cảm, rủi ro cao CHÍNH VÌ họ tin vào những chuẩn mực này — phá vỡ bảo mật hay trung lập dù chỉ một lần có thể chấm dứt sự nghiệp, bất kể trình độ ngôn ngữ.</div>`,
  ]]);

const c7q = quiz('cti401-quiz-7', 'Quiz 7 — Ethics & AIIC|||Quiz 7 — Đạo đức & AIIC', [
  { id: 'q1', question: 'Nguyên tắc "trung lập" (中立性) trong đạo đức nghề phiên dịch nghĩa là gì?', options: ['Phiên dịch viên được thêm ý kiến cá nhân để làm rõ ý', 'Truyền đạt đúng những gì được nói, không thêm bớt hay đứng về phe nào', 'Chỉ dịch những phần mình đồng ý', 'Bỏ qua những câu khó dịch'], correctIndex: 1, explanation: 'Trung lập nghĩa là truyền đạt trung thực, không can thiệp vào nội dung dù cá nhân có ý kiến khác.' },
  { id: 'q2', question: 'Nghĩa vụ bảo mật (保密义务) của phiên dịch viên kéo dài đến khi nào?', options: ['Chỉ trong lúc đang phiên dịch', 'Chỉ đến hết ngày làm việc', 'Vô thời hạn, kể cả sau khi sự kiện đã kết thúc', 'Không áp dụng nếu khách hàng không yêu cầu'], correctIndex: 2, explanation: 'Bảo mật là nghĩa vụ vô thời hạn theo chuẩn AIIC, không giới hạn trong thời gian sự kiện.' },
  { id: 'q3', question: 'Theo chuẩn AIIC, phiên dịch viên chuyên nghiệp nên làm gì khi nhận một nhiệm vụ ngoài năng lực của mình?', options: ['Nhận và cố gắng ứng biến', 'Từ chối nhiệm vụ thay vì ứng biến kém', 'Nhờ đồng nghiệp làm hộ mà không báo khách hàng', 'Chấp nhận với giá thấp hơn'], correctIndex: 1, explanation: 'Từ chối nhiệm vụ ngoài năng lực bảo vệ chất lượng và uy tín nghề nghiệp.' },
]);

const c8 = doc('cti401-8-1-thi-truong-ho-so', '8.1 — Translation market, portfolio & career development|||8.1 — Thị trường dịch thuật, xây dựng hồ sơ & phát triển sự nghiệp',
  'Phân khúc thị trường, freelance/agency/in-house, xây dựng CV & portfolio, định giá dịch vụ, hiệp hội nghề nghiệp, học tập liên tục.',
  [[
    `<span class="eyebrow">CTI401 · Chapter 8 · Lesson 8.1</span>
<h2>The translation market, portfolio &amp; career development</h2>
<h3>Career paths</h3>
<ul>
<li><strong>Freelance</strong> — direct clients or agencies, full control of schedule and specialization, but you handle marketing, invoicing, and inconsistent workload yourself.</li>
<li><strong>Agency staff</strong> — steady salary, project variety, but less say over which jobs you take.</li>
<li><strong>In-house</strong> — one company/organization (embassy, multinational, court), deep domain knowledge, less variety.</li>
</ul>
<h3>Building a professional portfolio</h3>
<pre><code>A hiring-ready portfolio includes:
 - a CV stating language pairs, direction(s), specializations
   (legal, business, medical, technical) and years of experience
 - 2-3 sample translations (with client permission, or self-made
   samples on public texts) showing register range
 - certifications: CATTI (中国), HSK level, university degree, AIIC
   membership (interpreters), CAT tool certificates (Trados/MemoQ)
 - references or a short case study of one real project
</code></pre>
<h3>Pricing &amp; positioning</h3>
<p>Interpreting is usually priced per <strong>half-day/full-day</strong>; translation per <strong>word or per page/1000 characters</strong>, often higher for rush jobs, rare language pairs, or high-stakes domains (legal, medical, financial). Specializing in one or two domains (e.g. legal contracts, or manufacturing/technical Chinese-Vietnamese) commands a premium over staying a generalist.</p>
<div class="callout"><span class="badge">Never stop learning</span> The market keeps moving: new domains (e.g. e-commerce cross-border, renewable energy), new CAT/MT tools, and professional associations (AIIC, ATA, national translator associations) all offer continuing education — treat certification and skill updates as part of the job, not optional extras.</div>`,
    `<span class="eyebrow">CTI401 · Chương 8 · Bài 8.1</span>
<h2>Thị trường dịch thuật, xây dựng hồ sơ &amp; phát triển sự nghiệp</h2>
<h3>Các hướng đi sự nghiệp</h3>
<ul>
<li><strong>Freelance (tự do)</strong> — làm trực tiếp với khách hàng hoặc qua công ty dịch, tự chủ hoàn toàn lịch trình và chuyên môn, nhưng tự lo marketing, hoá đơn, và khối lượng việc không đều.</li>
<li><strong>Nhân viên công ty dịch thuật</strong> — lương ổn định, đa dạng dự án, nhưng ít quyền chọn nhận việc nào.</li>
<li><strong>In-house (nội bộ)</strong> — làm cho một tổ chức/công ty (đại sứ quán, tập đoàn đa quốc gia, toà án), hiểu sâu một lĩnh vực, ít đa dạng hơn.</li>
</ul>
<h3>Xây dựng hồ sơ chuyên nghiệp</h3>
<pre><code>Một hồ sơ sẵn sàng ứng tuyển cần có:
 - CV ghi rõ cặp ngôn ngữ, chiều dịch, chuyên môn (pháp lý, kinh doanh,
   y tế, kỹ thuật) và số năm kinh nghiệm
 - 2-3 mẫu bản dịch (có sự đồng ý của khách hàng, hoặc tự làm mẫu trên
   văn bản công khai) thể hiện độ đa dạng văn phong
 - chứng chỉ: CATTI (中国), trình độ HSK, bằng đại học, thành viên AIIC
   (với phiên dịch viên), chứng chỉ công cụ CAT (Trados/MemoQ)
 - thư giới thiệu hoặc một case study ngắn về một dự án thật</code></pre>
<h3>Định giá &amp; định vị</h3>
<p>Phiên dịch thường tính giá theo <strong>nửa ngày/cả ngày</strong>; biên dịch tính theo <strong>từ hoặc trang/1000 ký tự</strong>, thường cao hơn cho việc gấp, cặp ngôn ngữ hiếm, hoặc lĩnh vực rủi ro cao (pháp lý, y tế, tài chính). Chuyên sâu vào một hoặc hai lĩnh vực (vd hợp đồng pháp lý, hoặc tiếng Trung-Việt sản xuất/kỹ thuật) mang lại giá trị cao hơn so với làm việc đa lĩnh vực chung chung.</p>
<div class="callout"><span class="badge">Đừng bao giờ ngừng học</span> Thị trường luôn thay đổi: lĩnh vực mới (vd thương mại điện tử xuyên biên giới, năng lượng tái tạo), công cụ CAT/máy dịch mới, và các hiệp hội nghề nghiệp (AIIC, ATA, hội dịch giả quốc gia) đều cung cấp đào tạo liên tục — hãy coi việc cập nhật chứng chỉ và kỹ năng là một phần của công việc, không phải điều phụ thêm.</div>`,
  ]]);

const c8q = quiz('cti401-quiz-8', 'Quiz 8 — Market & career|||Quiz 8 — Thị trường & sự nghiệp', [
  { id: 'q1', question: 'Ưu điểm chính của freelance so với làm nhân viên công ty dịch thuật là gì?', options: ['Lương cố định hằng tháng', 'Tự chủ hoàn toàn lịch trình và chuyên môn nhận việc', 'Không cần marketing bản thân', 'Luôn có khối lượng việc đều đặn'], correctIndex: 1, explanation: 'Freelancer tự quyết định dự án và lịch làm việc, đổi lại phải tự lo tìm khách và quản lý thu nhập.' },
  { id: 'q2', question: 'Vì sao chuyên sâu vào một hoặc hai lĩnh vực (vd pháp lý, kỹ thuật) thường mang lại giá trị cao hơn làm đa lĩnh vực chung chung?', options: ['Vì lĩnh vực chuyên sâu ít cần học thêm', 'Vì kiến thức chuyên môn sâu và độ chính xác thuật ngữ được trả giá cao hơn', 'Vì khách hàng không quan tâm chất lượng', 'Vì lĩnh vực chuyên sâu không cần chứng chỉ'], correctIndex: 1, explanation: 'Chuyên môn hoá giúp phiên/biên dịch viên định vị giá trị cao hơn so với người làm đại trà.' },
  { id: 'q3', question: 'Một hồ sơ (portfolio) sẵn sàng ứng tuyển nên bao gồm những gì?', options: ['Chỉ cần bằng đại học', 'CV ghi cặp ngôn ngữ/chuyên môn, mẫu bản dịch, chứng chỉ liên quan (CATTI/HSK/AIIC/CAT tool)', 'Chỉ cần số điện thoại liên hệ', 'Danh sách mọi ngôn ngữ trên thế giới dù chưa học'], correctIndex: 1, explanation: 'Hồ sơ chuyên nghiệp cần thể hiện rõ chuyên môn, kinh nghiệm thật và chứng chỉ xác thực.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'CTI401',
    slug: 'cti401-translation-interpreting',
    title: 'Translation & Interpreting',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CTI401.webp',
    shortDescription: 'Professional Chinese-Vietnamese translation & interpreting: conference modes, consecutive note-taking, simultaneous booth technique, CAT tools & TM, terminology/project management, QA, AIIC ethics, market & career.|||Biên - phiên dịch chuyên nghiệp Trung-Việt: các loại hình hội nghị, ghi chú nối tiếp, kỹ thuật cabin song song, công cụ CAT & bộ nhớ dịch, quản lý thuật ngữ/dự án, kiểm định chất lượng, đạo đức AIIC, thị trường & sự nghiệp.',
    description: 'Môn <strong>CTI401 — Translation &amp; Interpreting</strong> (kỳ 5, ngành Ngôn ngữ Trung) nối tiếp CCT401/402 và nhấn vào <strong>kỹ năng hành nghề phiên dịch chuyên nghiệp</strong>: các loại hình phiên dịch hội nghị (nối tiếp, song song), kỹ thuật ghi chú &amp; ghi nhớ, cabin &amp; phiên dịch tiếp sức, công cụ CAT (Trados/MemoQ) &amp; bộ nhớ dịch, quản lý thuật ngữ &amp; dự án dịch thuật, kiểm định chất lượng &amp; hiệu đính, đạo đức nghề theo chuẩn AIIC, và cách xây dựng hồ sơ, định vị trên thị trường dịch thuật. 8 chương, song ngữ, ví dụ Trung-Việt thực tế, quiz mỗi chương.',
    whatYouLearn: 'Phân biệt biên dịch/phiên dịch & các loại hình (đối thoại, nối tiếp, song song, thì thầm, dịch nhìn); kỹ thuật ghi chú & ghi nhớ trong phiên dịch nối tiếp; kỹ thuật song song, décalage, cabin ISO, phiên dịch tiếp sức; công cụ CAT (Trados/MemoQ), bộ nhớ dịch, fuzzy match, MTPE; quản lý thuật ngữ & quy trình dự án dịch; kiểm định chất lượng (revision/editing/proofreading), ISO 17100, LQA, dịch ngược; đạo đức nghề AIIC (bảo mật, trung lập, chính xác); thị trường dịch thuật, xây dựng hồ sơ, định giá & phát triển sự nghiệp.',
    requirements: 'Đã hoàn thành CCT401/CCT402 (lý thuyết & thực hành dịch cơ bản Trung-Việt) hoặc trình độ tiếng Trung tương đương HSK4 trở lên. Môn này không dạy lại lý thuyết dịch nền tảng.',
  },
  sections: [
    { title: 'Chương 1 — Nghề & loại hình|||Chapter 1 — Profession & types', description: 'Biên dịch vs phiên dịch, các loại hình phiên dịch, thị trường hội nghị.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Nối tiếp & ghi nhớ|||Chapter 2 — Consecutive & memory', description: 'Quy trình 5 bước, ký hiệu ghi chú, kỹ thuật ghi nhớ.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Song song & cabin|||Chapter 3 — Simultaneous & booth', description: 'Décalage, tiêu chuẩn cabin ISO, luân phiên đội, tiếp sức.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Công cụ CAT & bộ nhớ dịch|||Chapter 4 — CAT tools & TM', description: 'Trados/MemoQ, translation memory, fuzzy match, MTPE.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Thuật ngữ & quản lý dự án|||Chapter 5 — Terminology & project mgmt', description: 'Bảng thuật ngữ, quy trình dự án, vai trò PM/biên dịch/hiệu đính.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Kiểm định chất lượng & hiệu đính|||Chapter 6 — QA & revision', description: 'Revision/editing/proofreading, ISO 17100, LQA, dịch ngược.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Đạo đức nghề & AIIC|||Chapter 7 — Ethics & AIIC', description: 'Bảo mật, trung lập, chính xác, điều kiện làm việc chuyên nghiệp.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Thị trường & sự nghiệp|||Chapter 8 — Market & career', description: 'Freelance/agency/in-house, portfolio, định giá, phát triển sự nghiệp.', lessons: [c8, c8q] },
  ],
};
