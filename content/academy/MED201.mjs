/**
 * MED201 — New Media Technology. Giáo trình FLM (khối Quản trị Kinh doanh, Kỳ 1)
 * (syl): new media là gì & khác biệt truyền thông truyền thống; số hoá & hội tụ
 * truyền thông; Internet/web/nền tảng số; mạng xã hội & tương tác; nội dung số
 * (văn bản/hình/âm/video); di động & đa nền tảng; dữ liệu lớn/AI & cá nhân hoá;
 * tác động xã hội, tin giả, quyền riêng tư, AR/VR/metaverse. Trích dẫn: Lister
 * "New Media: A Critical Introduction"; Manovich "The Language of New Media";
 * McLuhan "Understanding Media" — không upload PDF. Song ngữ. Giữ NGUYÊN
 * slug/semester/thumb(v3). KHÔNG backtick/${ lồng trong nội dung.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('med201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: sách nền (Lister, Manovich, McLuhan), giáo trình FLM, tài liệu miễn phí, YouTube, lộ trình tự học.',
  [[
    `<span class="eyebrow">MED201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to study New Media Technology — what makes media "new", convergence, platforms, social &amp; interactive media, digital content, mobile, data/AI and social impact — in one place. The official slides &amp; syllabus live on <strong>FLM</strong>; below are the foundational books this course is built on, plus free resources.</p>
<h3>📗 Foundational books (cited, not uploaded)</h3>
<ul>
<li><em>New Media: A Critical Introduction</em> — Martin Lister, Jon Dovey, Seth Giddings, Iain Grant, Kieran Kelly. The core critical-studies textbook: defines the five characteristics of new media (digital, networked, interactive, hypertextual, virtual/simulated) and their social context.</li>
<li><em>The Language of New Media</em> — Lev Manovich. The theory of digital media as a cultural form: numerical representation, modularity, automation, variability, transcoding.</li>
<li><em>Understanding Media: The Extensions of Man</em> — Marshall McLuhan. The origin of "the medium is the message" and "hot vs cool" media — still the reference point for every media-technology argument today.</li>
</ul>
<h3>📘 Official syllabus &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for MED201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>🌐 Free reading</h3>
<ul>
<li><a href="https://en.wikipedia.org/wiki/New_media" target="_blank" rel="noopener">New media — overview (Wikipedia)</a></li>
<li><a href="https://en.wikipedia.org/wiki/The_Medium_is_the_Massage" target="_blank" rel="noopener">McLuhan's "the medium is the message" — background</a></li>
<li><a href="https://en.wikipedia.org/wiki/Media_convergence" target="_blank" rel="noopener">Media convergence — overview</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@crashcourse" target="_blank" rel="noopener">CrashCourse — Media Literacy series</a></li>
<li><a href="https://www.youtube.com/@TheMediaInsider" target="_blank" rel="noopener">Media &amp; technology explainers</a></li>
</ul>
<h3>🛠️ Tools to try</h3>
<ul>
<li><a href="https://trends.google.com/" target="_blank" rel="noopener">Google Trends</a> — see algorithmic/attention patterns first-hand</li>
<li><a href="https://www.canva.com/" target="_blank" rel="noopener">Canva</a> — practise multi-format digital content (text/image/video)</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — what "new media" means, digitization &amp; convergence, the internet/web/platforms.</li>
<li><strong>Practice</strong> — analyse a real platform or app using Lister's five characteristics.</li>
<li><strong>Go deeper</strong> — social &amp; interactive media, digital content formats, mobile &amp; cross-platform storytelling.</li>
<li><strong>Job-ready</strong> — data/AI-driven personalization, and the social risks: misinformation, privacy, AR/VR/metaverse trends.</li>
</ol></div>`,
    `<span class="eyebrow">MED201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Công nghệ Truyền thông mới — new media là gì, hội tụ truyền thông, nền tảng số, mạng xã hội &amp; tương tác, nội dung số, di động, dữ liệu/AI và tác động xã hội — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là các sách nền môn này dựa vào, cùng nguồn miễn phí.</p>
<h3>📗 Sách nền (trích dẫn, không upload)</h3>
<ul>
<li><em>New Media: A Critical Introduction</em> — Martin Lister, Jon Dovey, Seth Giddings, Iain Grant, Kieran Kelly. Giáo trình lý thuyết cốt lõi: định nghĩa năm đặc điểm của new media (số hoá, kết nối mạng, tương tác, siêu văn bản, ảo/mô phỏng) và bối cảnh xã hội của chúng.</li>
<li><em>The Language of New Media</em> — Lev Manovich. Lý thuyết truyền thông số như một hình thức văn hoá: biểu diễn số, tính mô-đun, tự động hoá, khả biến, chuyển mã (transcoding).</li>
<li><em>Understanding Media: The Extensions of Man</em> — Marshall McLuhan. Nguồn gốc câu "phương tiện là thông điệp" và khái niệm truyền thông "nóng/lạnh" — vẫn là điểm tựa cho mọi tranh luận về công nghệ truyền thông hôm nay.</li>
</ul>
<h3>📘 Giáo trình &amp; slide chính thức</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của MED201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>🌐 Đọc thêm miễn phí</h3>
<ul>
<li><a href="https://en.wikipedia.org/wiki/New_media" target="_blank" rel="noopener">New media — tổng quan (Wikipedia)</a></li>
<li><a href="https://en.wikipedia.org/wiki/The_Medium_is_the_Massage" target="_blank" rel="noopener">"Phương tiện là thông điệp" của McLuhan — bối cảnh</a></li>
<li><a href="https://en.wikipedia.org/wiki/Media_convergence" target="_blank" rel="noopener">Hội tụ truyền thông — tổng quan</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@crashcourse" target="_blank" rel="noopener">CrashCourse — chuỗi Media Literacy</a></li>
<li><a href="https://www.youtube.com/@TheMediaInsider" target="_blank" rel="noopener">Giải thích truyền thông &amp; công nghệ</a></li>
</ul>
<h3>🛠️ Công cụ nên thử</h3>
<ul>
<li><a href="https://trends.google.com/" target="_blank" rel="noopener">Google Trends</a> — quan sát mẫu chú ý/thuật toán trực tiếp</li>
<li><a href="https://www.canva.com/" target="_blank" rel="noopener">Canva</a> — luyện tạo nội dung số đa hình thức (chữ/ảnh/video)</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — "new media" là gì, số hoá &amp; hội tụ, Internet/web/nền tảng.</li>
<li><strong>Luyện tập</strong> — phân tích một nền tảng/app thật bằng năm đặc điểm của Lister.</li>
<li><strong>Đào sâu</strong> — mạng xã hội &amp; tương tác, các dạng nội dung số, di động &amp; kể chuyện đa nền tảng.</li>
<li><strong>Sẵn sàng đi làm</strong> — cá nhân hoá bằng dữ liệu/AI, và rủi ro xã hội: tin giả, quyền riêng tư, xu hướng AR/VR/metaverse.</li>
</ol></div>`,
  ]]);

const intro = doc('med201-0-1-overview', 'Course overview: New Media Technology|||Tổng quan: Công nghệ Truyền thông mới',
  'New media khác truyền thông truyền thống ở đâu; ba tác giả nền (Lister, Manovich, McLuhan); lộ trình 8 chương từ khái niệm tới xu hướng AR/VR/metaverse.',
  [[
    `<span class="eyebrow">MED201 · Lesson 0.1 · Overview</span>
<h2>New Media Technology</h2>
<p class="lead">This course asks a deceptively simple question: <strong>what makes media "new"?</strong> You'll study the technical, cultural and social shift from print/broadcast media to digital, networked, interactive media — and where that shift is heading next (AI personalization, AR/VR, the metaverse).</p>
<h3>Three thinkers who frame the course</h3>
<ul>
<li><strong>Lister et al., <em>New Media: A Critical Introduction</em></strong> — five defining characteristics: digital, networked, interactive, hypertextual, virtual/simulated.</li>
<li><strong>Manovich, <em>The Language of New Media</em></strong> — new media as computation: numerical representation, modularity, automation, variability, transcoding.</li>
<li><strong>McLuhan, <em>Understanding Media</em></strong> — "the medium is the message": a medium's form shapes society as much as its content does.</li>
</ul>
<h3>Roadmap</h3>
<p>What is new media &amp; how it differs from traditional media → digitization &amp; convergence → internet, web &amp; platforms → social &amp; interactive media → digital content (text/image/audio/video) → mobile, apps &amp; cross-platform media → big data, AI &amp; personalization → social impact: misinformation, privacy, AR/VR &amp; the metaverse.</p>`,
    `<span class="eyebrow">MED201 · Bài 0.1 · Tổng quan</span>
<h2>Công nghệ Truyền thông mới</h2>
<p class="lead">Môn này đặt một câu hỏi tưởng đơn giản: <strong>điều gì làm truyền thông trở nên "mới"?</strong> Bạn sẽ học sự chuyển dịch về kỹ thuật, văn hoá và xã hội — từ báo in/truyền hình sang truyền thông số, kết nối mạng, tương tác — và hướng đi tiếp theo của nó (cá nhân hoá bằng AI, AR/VR, metaverse).</p>
<h3>Ba nhà nghiên cứu định hình môn học</h3>
<ul>
<li><strong>Lister và cộng sự, <em>New Media: A Critical Introduction</em></strong> — năm đặc điểm định nghĩa: số hoá, kết nối mạng, tương tác, siêu văn bản, ảo/mô phỏng.</li>
<li><strong>Manovich, <em>The Language of New Media</em></strong> — new media như tính toán: biểu diễn số, tính mô-đun, tự động hoá, khả biến, chuyển mã.</li>
<li><strong>McLuhan, <em>Understanding Media</em></strong> — "phương tiện là thông điệp": hình thức của một phương tiện định hình xã hội không kém gì nội dung của nó.</li>
</ul>
<h3>Lộ trình</h3>
<p>New media là gì &amp; khác biệt truyền thông truyền thống → số hoá &amp; hội tụ truyền thông → Internet, web &amp; nền tảng số → mạng xã hội &amp; truyền thông tương tác → nội dung số (văn bản/hình ảnh/âm thanh/video) → di động, ứng dụng &amp; truyền thông đa nền tảng → dữ liệu lớn, AI &amp; cá nhân hoá → tác động xã hội: tin giả, quyền riêng tư, AR/VR &amp; metaverse.</p>`,
  ]]);

const c1 = doc('med201-1-1-what-is-new-media', '1.1 — What is new media & how it differs from traditional media|||1.1 — New media là gì & khác biệt với truyền thông truyền thống',
  'Định nghĩa new media qua 5 đặc điểm của Lister; so sánh truyền thông truyền thống (một chiều, tuyến tính, tập trung) với new media (tương tác, siêu văn bản, phi tuyến, phân tán); "phương tiện là thông điệp" của McLuhan.',
  [[
    `<span class="eyebrow">MED201 · Chapter 1 · Lesson 1.1</span>
<h2>What is new media &amp; how it differs from traditional media</h2>
<h3>Lister's five characteristics of new media</h3>
<ul>
<li><strong>Digital</strong> — content is stored and processed as numbers (0/1), not as a continuous analog signal.</li>
<li><strong>Networked</strong> — media travels over interconnected networks (the internet), not through a fixed one-to-many broadcast pipe.</li>
<li><strong>Interactive</strong> — the audience can respond, choose, or alter the content, not just receive it.</li>
<li><strong>Hypertextual</strong> — content links to other content non-linearly (click a link, jump anywhere).</li>
<li><strong>Virtual / simulated</strong> — media can construct spaces and experiences that have no physical original (a game world, a simulation).</li>
</ul>
<h3>Traditional media vs new media</h3>
<pre><code>Traditional media (print, radio, broadcast TV)
  One-to-many        : one sender, many passive receivers
  Linear              : fixed running order, fixed schedule
  Analog              : continuous signal (ink on paper, radio waves)
  Centralized         : a few gatekeepers (publishers, broadcasters) control output

New media (web, apps, social platforms)
  Many-to-many        : anyone can also be a sender
  Non-linear          : hyperlinks, on-demand, user-chosen order
  Digital             : discrete numeric data, copyable without loss
  Distributed         : production and distribution open to (almost) anyone</code></pre>
<h3>"The medium is the message" (McLuhan)</h3>
<p>McLuhan's core claim: a medium's <em>form</em> — how it delivers content, not just what content it carries — reshapes how people think, relate and organize society. A newspaper and a TikTok video can report the "same" event, but the medium itself changes what kind of attention, participation and speed that event gets.</p>
<div class="callout"><span class="badge">Why it matters</span> "New" is not just "digital version of the old." Interactivity and hypertext change WHO can speak, not just how fast a message travels.</div>`,
    `<span class="eyebrow">MED201 · Chương 1 · Bài 1.1</span>
<h2>New media là gì &amp; khác biệt với truyền thông truyền thống</h2>
<h3>Năm đặc điểm của new media (Lister)</h3>
<ul>
<li><strong>Số hoá (Digital)</strong> — nội dung được lưu và xử lý dưới dạng số (0/1), không phải tín hiệu analog liên tục.</li>
<li><strong>Kết nối mạng (Networked)</strong> — truyền thông di chuyển qua các mạng liên kết (Internet), không qua một đường phát một-chiều-tới-nhiều cố định.</li>
<li><strong>Tương tác (Interactive)</strong> — người xem có thể phản hồi, chọn, hoặc thay đổi nội dung, không chỉ tiếp nhận.</li>
<li><strong>Siêu văn bản (Hypertextual)</strong> — nội dung liên kết tới nội dung khác theo cách phi tuyến (bấm link, nhảy tới bất kỳ đâu).</li>
<li><strong>Ảo / mô phỏng (Virtual/simulated)</strong> — truyền thông có thể dựng không gian và trải nghiệm không có nguyên bản vật lý (một thế giới game, một mô phỏng).</li>
</ul>
<h3>Truyền thông truyền thống so với new media</h3>
<pre><code>Truyền thông truyền thống (báo in, radio, TV phát sóng)
  Một-tới-nhiều      : một người gửi, nhiều người nhận thụ động
  Tuyến tính          : lịch phát cố định, thứ tự cố định
  Analog              : tín hiệu liên tục (mực trên giấy, sóng radio)
  Tập trung           : ít người gác cổng (nhà xuất bản, đài) kiểm soát đầu ra

New media (web, app, nền tảng xã hội)
  Nhiều-tới-nhiều    : ai cũng có thể là người gửi
  Phi tuyến           : siêu liên kết, xem theo yêu cầu, thứ tự do người dùng chọn
  Số hoá              : dữ liệu số rời rạc, sao chép không mất chất lượng
  Phân tán            : (gần như) ai cũng sản xuất và phân phối được</code></pre>
<h3>"Phương tiện là thông điệp" (McLuhan)</h3>
<p>Luận điểm cốt lõi của McLuhan: <em>hình thức</em> của một phương tiện — cách nó truyền tải nội dung, không chỉ nội dung nó mang — định hình lại cách con người suy nghĩ, kết nối và tổ chức xã hội. Một tờ báo và một video TikTok có thể đưa tin "cùng" một sự kiện, nhưng chính phương tiện thay đổi loại sự chú ý, sự tham gia và tốc độ mà sự kiện đó nhận được.</p>
<div class="callout"><span class="badge">Vì sao quan trọng</span> "Mới" không chỉ là "phiên bản số của cái cũ". Tính tương tác và siêu văn bản thay đổi AI được nói, không chỉ tốc độ thông điệp di chuyển.</div>`,
  ]]);

const c1q = quiz('med201-quiz-1', 'Quiz 1 — What is new media|||Quiz 1 — New media là gì', [
  { id: 'q1', question: 'Theo Lister, đặc điểm nào KHÔNG thuộc 5 đặc điểm của new media?', options: ['Số hoá (digital)', 'Kết nối mạng (networked)', 'Tuyến tính, một chiều', 'Tương tác (interactive)'], correctIndex: 2, explanation: 'Truyền thông truyền thống mới là một chiều/tuyến tính; new media là tương tác, siêu văn bản, mạng, số hoá, ảo/mô phỏng.' },
  { id: 'q2', question: 'Câu "phương tiện là thông điệp" là luận điểm của ai?', options: ['Lev Manovich', 'Marshall McLuhan', 'Martin Lister', 'Không ai trong số này'], correctIndex: 1, explanation: 'McLuhan trong Understanding Media: hình thức của phương tiện định hình xã hội, không chỉ nội dung.' },
  { id: 'q3', question: 'Khác biệt lớn nhất giữa "một-tới-nhiều" và "nhiều-tới-nhiều" là?', options: ['Tốc độ Internet', 'Ai có thể là người gửi thông tin', 'Giá thiết bị', 'Ngôn ngữ sử dụng'], correctIndex: 1, explanation: 'Truyền thông truyền thống tập trung ở vài người gửi; new media cho phép gần như ai cũng gửi được.' },
]);

const c2 = doc('med201-2-1-digitization-convergence', '2.1 — Digitization & media convergence|||2.1 — Số hoá & hội tụ truyền thông',
  'Số hoá: analog→digital, lợi ích (sao chép không mất chất lượng, xử lý, lưu trữ); hội tụ truyền thông: hội tụ công nghệ, ngành công nghiệp, nội dung (Manovich: transcoding, modularity).',
  [[
    `<span class="eyebrow">MED201 · Chapter 2 · Lesson 2.1</span>
<h2>Digitization &amp; media convergence</h2>
<h3>Digitization: analog → digital</h3>
<p><strong>Digitization</strong> converts a continuous analog signal (sound wave, light, ink) into discrete numbers (bits) that a computer can store, copy and process. Once content is numbers, Manovich's principles apply: <strong>numerical representation</strong> (media = code), <strong>modularity</strong> (built from independent parts: pixels, samples, objects), <strong>automation</strong> (software can create/edit it), <strong>variability</strong> (many versions from one source), and <strong>transcoding</strong> (it can be converted between computer formats and cultural forms — a photo is both a JPEG file and a cultural image).</p>
<h3>Media convergence — three kinds</h3>
<ul>
<li><strong>Technological convergence</strong> — one device does many jobs a phone is a camera, a music player, a TV, a newspaper.</li>
<li><strong>Industry convergence</strong> — companies that used to be separate (telecom, publishing, tech, entertainment) now compete/merge in the same digital space.</li>
<li><strong>Content convergence</strong> — the "same" story flows across formats: an article becomes a video, a podcast, a set of social posts.</li>
</ul>
<pre><code>Before digitization           After digitization
  Camera  (film)                One smartphone:
  Phone   (landline)             - camera
  TV      (broadcast)            - phone / messenger
  Newspaper (print)              - video player
  Music player (cassette/CD)     - news reader
                                  - music/podcast player</code></pre>
<div class="callout"><span class="badge">Why it matters</span> Convergence is why a media company today competes with a phone maker and an AI company — the boundary between "media industry" and "tech industry" mostly dissolved.</div>`,
    `<span class="eyebrow">MED201 · Chương 2 · Bài 2.1</span>
<h2>Số hoá &amp; hội tụ truyền thông</h2>
<h3>Số hoá: analog → digital</h3>
<p><strong>Số hoá</strong> chuyển một tín hiệu analog liên tục (sóng âm, ánh sáng, mực) thành các số rời rạc (bit) mà máy tính lưu, sao chép và xử lý được. Khi nội dung đã là số, các nguyên lý của Manovich áp dụng: <strong>biểu diễn số</strong> (truyền thông = mã), <strong>tính mô-đun</strong> (dựng từ các phần độc lập: pixel, mẫu âm, đối tượng), <strong>tự động hoá</strong> (phần mềm tự tạo/sửa được), <strong>khả biến</strong> (nhiều phiên bản từ một nguồn), và <strong>chuyển mã (transcoding)</strong> (chuyển đổi được giữa định dạng máy tính và hình thức văn hoá — một tấm ảnh vừa là file JPEG vừa là hình ảnh văn hoá).</p>
<h3>Hội tụ truyền thông — ba loại</h3>
<ul>
<li><strong>Hội tụ công nghệ</strong> — một thiết bị làm nhiều việc: điện thoại vừa là máy ảnh, máy nghe nhạc, TV, báo.</li>
<li><strong>Hội tụ ngành</strong> — các công ty từng tách biệt (viễn thông, xuất bản, công nghệ, giải trí) giờ cạnh tranh/sáp nhập trong cùng không gian số.</li>
<li><strong>Hội tụ nội dung</strong> — "cùng" một câu chuyện chảy qua nhiều định dạng: một bài báo trở thành video, podcast, một loạt bài đăng mạng xã hội.</li>
</ul>
<pre><code>Trước số hoá                  Sau số hoá
  Máy ảnh (phim)                Một smartphone:
  Điện thoại (cố định)           - máy ảnh
  TV (phát sóng)                 - điện thoại/tin nhắn
  Báo giấy (in)                  - máy chiếu video
  Máy nghe nhạc (băng/CD)        - đọc tin tức
                                  - nghe nhạc/podcast</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Hội tụ là lý do một công ty truyền thông hôm nay cạnh tranh với hãng điện thoại và công ty AI — biên giới giữa "ngành truyền thông" và "ngành công nghệ" gần như tan biến.</div>`,
  ]]);

const c2q = quiz('med201-quiz-2', 'Quiz 2 — Digitization & convergence|||Quiz 2 — Số hoá & hội tụ', [
  { id: 'q1', question: 'Số hoá (digitization) là gì?', options: ['Chuyển tín hiệu analog liên tục thành số rời rạc', 'In tài liệu ra giấy', 'Xoá dữ liệu cũ', 'Ghi âm bằng băng cassette'], correctIndex: 0, explanation: 'Số hoá chuyển tín hiệu analog (âm/ánh sáng/mực) thành bit để máy tính xử lý.' },
  { id: 'q2', question: 'Một smartphone vừa là máy ảnh, máy nghe nhạc, TV, báo — đó là ví dụ của?', options: ['Hội tụ công nghệ', 'Hội tụ ngành', 'Chuyển mã (transcoding)', 'Siêu văn bản'], correctIndex: 0, explanation: 'Hội tụ công nghệ: một thiết bị gộp nhiều chức năng vốn tách biệt.' },
  { id: 'q3', question: 'Nguyên lý "modularity" của Manovich nghĩa là?', options: ['Nội dung số dựng từ các phần độc lập (pixel, mẫu âm, đối tượng)', 'Chỉ một công ty kiểm soát nội dung', 'Nội dung chỉ tồn tại trên giấy', 'Không thể sao chép nội dung số'], correctIndex: 0, explanation: 'Modularity: media số gồm các đơn vị/phần độc lập ghép lại, sửa từng phần được.' },
]);

const c3 = doc('med201-3-1-internet-web-platforms', '3.1 — Internet, the web & digital platforms|||3.1 — Internet, web & nền tảng số',
  'Internet (hạ tầng mạng toàn cầu) khác web (dịch vụ siêu văn bản trên Internet); Web 1.0 (đọc)→2.0 (đọc-viết, do người dùng tạo)→3.0; nền tảng số & hiệu ứng mạng.',
  [[
    `<span class="eyebrow">MED201 · Chapter 3 · Lesson 3.1</span>
<h2>Internet, the web &amp; digital platforms</h2>
<h3>Internet vs. web — not the same thing</h3>
<p>The <strong>Internet</strong> is the global network of interconnected computer networks — the infrastructure (cables, routers, protocols like TCP/IP) that lets any two devices exchange data. The <strong>web</strong> is one service that runs on top of the Internet: hypertext documents (pages) linked by URLs, viewed with a browser. Email, streaming and gaming are other services running on the same Internet.</p>
<h3>Web 1.0 → 2.0 → 3.0 (a working shorthand)</h3>
<pre><code>Web 1.0  "read"        static pages, few publishers, one-way
Web 2.0  "read-write"   user-generated content, social platforms,
                        the reader can also publish (blogs, wikis, social media)
Web 3.0  "smart/decentralized" (contested term) — AI-driven, semantic,
                        blockchain/decentralization experiments</code></pre>
<h3>Digital platforms &amp; network effects</h3>
<p>A <strong>platform</strong> (search engine, marketplace, social app) doesn't just publish content — it hosts an ecosystem where OTHER people/businesses create value. Platforms grow through <strong>network effects</strong>: each new user makes the platform more valuable to every existing user (more sellers → more buyers → more sellers). This is why a handful of platforms tend to dominate a category.</p>
<div class="callout"><span class="badge">Why it matters</span> "The internet" in casual speech usually means "the web + platforms" — but the distinction matters: a platform can restrict access to a service without shutting down the Internet itself.</div>`,
    `<span class="eyebrow">MED201 · Chương 3 · Bài 3.1</span>
<h2>Internet, web &amp; nền tảng số</h2>
<h3>Internet khác web — không phải một thứ</h3>
<p><strong>Internet</strong> là mạng toàn cầu của các mạng máy tính liên kết nhau — hạ tầng (cáp, router, giao thức như TCP/IP) cho phép hai thiết bị bất kỳ trao đổi dữ liệu. <strong>Web</strong> là một dịch vụ chạy trên Internet: các trang siêu văn bản liên kết bằng URL, xem qua trình duyệt. Email, streaming, chơi game là các dịch vụ khác cùng chạy trên Internet đó.</p>
<h3>Web 1.0 → 2.0 → 3.0 (cách gọi quen dùng)</h3>
<pre><code>Web 1.0  "đọc"           trang tĩnh, ít người xuất bản, một chiều
Web 2.0  "đọc-viết"      nội dung do người dùng tạo, nền tảng xã hội,
                          người đọc cũng xuất bản được (blog, wiki, mạng xã hội)
Web 3.0  "thông minh/phi tập trung" (thuật ngữ còn tranh luận) — dựa trên AI,
                          ngữ nghĩa, thử nghiệm blockchain/phi tập trung</code></pre>
<h3>Nền tảng số &amp; hiệu ứng mạng</h3>
<p>Một <strong>nền tảng</strong> (công cụ tìm kiếm, chợ điện tử, app mạng xã hội) không chỉ xuất bản nội dung — nó chứa một hệ sinh thái nơi NGƯỜI KHÁC tạo ra giá trị. Nền tảng lớn lên nhờ <strong>hiệu ứng mạng</strong>: mỗi người dùng mới làm nền tảng có giá trị hơn với mọi người dùng cũ (nhiều người bán → nhiều người mua → nhiều người bán). Đây là lý do một số ít nền tảng thường thống trị một ngành.</p>
<div class="callout"><span class="badge">Vì sao quan trọng</span> "Internet" trong lời nói thường nghĩa là "web + nền tảng" — nhưng sự phân biệt quan trọng: một nền tảng có thể hạn chế truy cập dịch vụ mà không tắt cả Internet.</div>`,
  ]]);

const c3q = quiz('med201-quiz-3', 'Quiz 3 — Internet, web & platforms|||Quiz 3 — Internet, web & nền tảng', [
  { id: 'q1', question: 'Internet và web khác nhau ở điểm nào?', options: ['Internet là hạ tầng mạng toàn cầu; web là một dịch vụ siêu văn bản chạy trên đó', 'Chúng hoàn toàn giống nhau', 'Web có trước Internet', 'Internet chỉ dùng cho email'], correctIndex: 0, explanation: 'Internet = hạ tầng (cáp, giao thức); web = dịch vụ trang siêu văn bản liên kết qua URL.' },
  { id: 'q2', question: 'Đặc trưng của Web 2.0 là?', options: ['Trang tĩnh, một chiều', 'Nội dung do người dùng tạo, người đọc cũng xuất bản được', 'Không có Internet', 'Chỉ dùng cho doanh nghiệp'], correctIndex: 1, explanation: 'Web 2.0 "đọc-viết": blog, wiki, mạng xã hội cho người dùng tự xuất bản.' },
  { id: 'q3', question: 'Hiệu ứng mạng (network effect) trên một nền tảng nghĩa là?', options: ['Nền tảng chậm hơn khi có thêm người dùng', 'Mỗi người dùng mới làm nền tảng có giá trị hơn với người dùng cũ', 'Chỉ nhà phát triển được lợi', 'Không liên quan đến số người dùng'], correctIndex: 1, explanation: 'Network effect: giá trị nền tảng tăng theo số người dùng (nhiều người bán↔nhiều người mua).' },
]);

const c4 = doc('med201-4-1-social-interactive-media', '4.1 — Social media & interactive communication|||4.1 — Mạng xã hội & truyền thông tương tác',
  'Đặc điểm mạng xã hội: hồ sơ, kết nối, dòng nội dung; nội dung do người dùng tạo (UGC); các mức độ tương tác; thuật toán dòng thời gian.',
  [[
    `<span class="eyebrow">MED201 · Chapter 4 · Lesson 4.1</span>
<h2>Social media &amp; interactive communication</h2>
<h3>What makes something "social media"</h3>
<ul>
<li><strong>Profiles</strong> — a persistent identity users build and present.</li>
<li><strong>Connections</strong> — a visible graph of relationships (friends, followers, groups).</li>
<li><strong>User-generated content (UGC)</strong> — the platform's value comes mostly from what USERS post, not what the company produces.</li>
<li><strong>Feeds</strong> — content is assembled and re-ordered continuously, usually by an algorithm, not published on a fixed schedule.</li>
</ul>
<h3>Levels of interactivity</h3>
<pre><code>Low     : reading a static page, no reply possible
Medium  : commenting, liking, sharing existing content
High    : co-creating content (duets, remixes, collaborative docs, live chat with the creator)</code></pre>
<h3>Algorithmic feeds</h3>
<p>Instead of showing content in the order it was posted, most platforms rank content by predicted engagement (how likely you are to watch, like, comment). This makes attention the currency of new media — and rewards content designed to trigger a reaction, which is why interactive media raises different ethical questions than one-way broadcast media did.</p>
<div class="callout"><span class="badge">Why it matters</span> Interactivity is not just "more features" — it changes power: the audience becomes a co-producer, and the platform's ranking algorithm becomes an invisible editor.</div>`,
    `<span class="eyebrow">MED201 · Chương 4 · Bài 4.1</span>
<h2>Mạng xã hội &amp; truyền thông tương tác</h2>
<h3>Điều gì làm một thứ trở thành "mạng xã hội"</h3>
<ul>
<li><strong>Hồ sơ (profile)</strong> — một danh tính bền vững mà người dùng dựng và trình bày.</li>
<li><strong>Kết nối</strong> — một đồ thị quan hệ hiển thị (bạn bè, người theo dõi, nhóm).</li>
<li><strong>Nội dung do người dùng tạo (UGC)</strong> — giá trị nền tảng chủ yếu đến từ những gì NGƯỜI DÙNG đăng, không phải nội dung công ty sản xuất.</li>
<li><strong>Dòng nội dung (feed)</strong> — nội dung được xếp và sắp lại liên tục, thường bằng thuật toán, không theo lịch phát cố định.</li>
</ul>
<h3>Các mức độ tương tác</h3>
<pre><code>Thấp    : đọc trang tĩnh, không thể phản hồi
Vừa     : bình luận, thích, chia sẻ nội dung có sẵn
Cao     : cùng tạo nội dung (duet, remix, tài liệu cộng tác, chat trực tiếp với người tạo)</code></pre>
<h3>Dòng thời gian theo thuật toán</h3>
<p>Thay vì hiện nội dung theo thứ tự đăng, hầu hết nền tảng xếp hạng nội dung theo dự đoán mức độ tương tác (khả năng bạn xem, thích, bình luận). Điều này làm sự chú ý trở thành "đồng tiền" của new media — và ưu ái nội dung được thiết kế để gây phản ứng, đó là lý do truyền thông tương tác đặt ra các câu hỏi đạo đức khác với truyền thông phát sóng một chiều.</p>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Tương tác không chỉ là "thêm chức năng" — nó thay đổi quyền lực: khán giả trở thành người đồng sản xuất, và thuật toán xếp hạng của nền tảng trở thành một biên tập viên vô hình.</div>`,
  ]]);

const c4q = quiz('med201-quiz-4', 'Quiz 4 — Social & interactive media|||Quiz 4 — Mạng xã hội & tương tác', [
  { id: 'q1', question: 'Giá trị của một mạng xã hội chủ yếu đến từ đâu?', options: ['Nội dung do người dùng tạo (UGC)', 'Chỉ nội dung công ty tự sản xuất', 'Quảng cáo TV', 'Số lượng máy chủ'], correctIndex: 0, explanation: 'Mạng xã hội sống nhờ UGC — nội dung người dùng đăng, không phải nội dung công ty làm.' },
  { id: 'q2', question: 'Mức tương tác CAO nhất trong ví dụ dưới đây là?', options: ['Đọc một trang tĩnh', 'Thích một bài đăng', 'Cùng tạo nội dung (duet/remix/cộng tác)', 'Không làm gì'], correctIndex: 2, explanation: 'Cùng tạo nội dung là mức tương tác cao nhất — người xem trở thành người đồng sản xuất.' },
  { id: 'q3', question: 'Dòng thời gian theo thuật toán xếp hạng nội dung dựa trên?', options: ['Thứ tự đăng bài (mới nhất trước)', 'Dự đoán mức độ tương tác (khả năng xem/thích/bình luận)', 'Ngày sinh người dùng', 'Số ký tự bài đăng'], correctIndex: 1, explanation: 'Feed thuật toán ưu tiên nội dung dự đoán giữ được sự chú ý/tương tác cao.' },
]);

const c5 = doc('med201-5-1-digital-content-formats', '5.1 — Digital content: text, image, audio, video|||5.1 — Nội dung số: văn bản, hình ảnh, âm thanh, video',
  'Văn bản số & siêu văn bản; ảnh raster/vector & nén; âm thanh số (lấy mẫu, bit depth); video (khung hình, codec, streaming); mỗi định dạng có đánh đổi chất lượng/dung lượng.',
  [[
    `<span class="eyebrow">MED201 · Chapter 5 · Lesson 5.1</span>
<h2>Digital content: text, image, audio, video</h2>
<h3>Text — hypertext</h3>
<p>Digital text is not just "typed words" — it's <strong>hypertext</strong>: text that links to other text, non-linearly. A Wikipedia article, with its blue links, is the clearest example: reading order is chosen by the reader, not fixed by the author.</p>
<h3>Image — raster vs. vector, and compression</h3>
<ul>
<li><strong>Raster</strong> (JPEG, PNG) — a grid of pixels; quality is fixed to resolution; scaling up blurs it.</li>
<li><strong>Vector</strong> (SVG) — described by mathematical shapes; scales to any size with no quality loss.</li>
<li><strong>Compression</strong> trades file size for quality — <em>lossy</em> (JPEG: smaller, some detail discarded) vs. <em>lossless</em> (PNG: bigger, exact original).</li>
</ul>
<h3>Audio — sampling</h3>
<p>Digital audio captures a continuous sound wave as discrete <strong>samples</strong> many times per second (sample rate, e.g. 44,100 Hz) with each sample stored at a given precision (<strong>bit depth</strong>). Higher sample rate/bit depth = closer to the original wave, but a bigger file.</p>
<h3>Video &amp; streaming</h3>
<pre><code>Video = a sequence of image frames (frame rate, e.g. 30/60 fps) + an audio track
Codec  = the algorithm that compresses/decompresses video (H.264, VP9, AV1)
Streaming = sending video in small chunks over the internet as it plays,
            adapting quality to the viewer's connection speed</code></pre>
<div class="callout"><span class="badge">Why it matters</span> Every format is a trade-off between quality, file size and processing cost — the "right" format depends on the use (a thumbnail vs. a cinema-quality master file need very different choices).</div>`,
    `<span class="eyebrow">MED201 · Chương 5 · Bài 5.1</span>
<h2>Nội dung số: văn bản, hình ảnh, âm thanh, video</h2>
<h3>Văn bản — siêu văn bản</h3>
<p>Văn bản số không chỉ là "chữ được gõ" — đó là <strong>siêu văn bản (hypertext)</strong>: chữ liên kết tới chữ khác theo cách phi tuyến. Một bài Wikipedia, với các liên kết màu xanh, là ví dụ rõ nhất: thứ tự đọc do người đọc chọn, không cố định theo tác giả.</p>
<h3>Hình ảnh — raster và vector, và nén ảnh</h3>
<ul>
<li><strong>Raster</strong> (JPEG, PNG) — lưới điểm ảnh (pixel); chất lượng gắn với độ phân giải; phóng to sẽ mờ.</li>
<li><strong>Vector</strong> (SVG) — mô tả bằng hình học toán học; phóng to cỡ nào cũng không mất chất lượng.</li>
<li><strong>Nén</strong> đánh đổi dung lượng file với chất lượng — <em>mất mát (lossy)</em> (JPEG: nhỏ hơn, bỏ vài chi tiết) so với <em>không mất mát (lossless)</em> (PNG: lớn hơn, giữ nguyên bản gốc).</li>
</ul>
<h3>Âm thanh — lấy mẫu</h3>
<p>Âm thanh số ghi lại một sóng âm liên tục thành các <strong>mẫu (sample)</strong> rời rạc nhiều lần mỗi giây (tần số lấy mẫu, vd 44.100 Hz), mỗi mẫu lưu ở một độ chính xác (<strong>bit depth</strong>). Tần số lấy mẫu/bit depth cao hơn = gần bản gốc hơn, nhưng file lớn hơn.</p>
<h3>Video &amp; streaming</h3>
<pre><code>Video = một chuỗi khung hình ảnh (tốc độ khung hình, vd 30/60 fps) + track âm thanh
Codec  = thuật toán nén/giải nén video (H.264, VP9, AV1)
Streaming = gửi video theo từng đoạn nhỏ qua Internet trong lúc phát,
            tự điều chỉnh chất lượng theo tốc độ mạng người xem</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Mỗi định dạng là một sự đánh đổi giữa chất lượng, dung lượng và chi phí xử lý — định dạng "đúng" phụ thuộc vào mục đích dùng (ảnh thu nhỏ khác rất nhiều so với file gốc chất lượng điện ảnh).</div>`,
  ]]);

const c5q = quiz('med201-quiz-5', 'Quiz 5 — Digital content formats|||Quiz 5 — Định dạng nội dung số', [
  { id: 'q1', question: 'Ảnh vector (SVG) khác ảnh raster (JPEG/PNG) ở điểm nào?', options: ['Vector mô tả bằng hình học, phóng to không mất chất lượng', 'Vector luôn nặng hơn raster', 'Raster không thể nén', 'Không có khác biệt'], correctIndex: 0, explanation: 'Vector dùng công thức hình học nên scale tự do; raster là lưới pixel cố định độ phân giải.' },
  { id: 'q2', question: 'Nén "lossy" (như JPEG) đánh đổi điều gì?', options: ['Giữ nguyên 100% dữ liệu gốc, file lớn hơn', 'Bỏ vài chi tiết để giảm dung lượng file', 'Không ảnh hưởng gì tới file', 'Chỉ dùng cho video'], correctIndex: 1, explanation: 'Lossy giảm dung lượng bằng cách bỏ chi tiết; lossless giữ nguyên bản gốc nhưng nặng hơn.' },
  { id: 'q3', question: 'Streaming video hoạt động bằng cách?', options: ['Tải toàn bộ file trước khi phát được', 'Gửi video theo đoạn nhỏ, tự điều chỉnh chất lượng theo mạng', 'Chỉ hoạt động khi offline', 'Không cần codec'], correctIndex: 1, explanation: 'Streaming gửi từng chunk và thích ứng chất lượng theo băng thông người xem.' },
]);

const c6 = doc('med201-6-1-mobile-apps-crossplatform', '6.1 — Mobile media, apps & cross-platform storytelling|||6.1 — Di động, ứng dụng & truyền thông đa nền tảng',
  'Di động thay đổi truyền thông ra sao (mọi lúc, định vị, cảm biến); ứng dụng vs web; kể chuyện đa nền tảng/transmedia — một câu chuyện trải trên nhiều nền tảng.',
  [[
    `<span class="eyebrow">MED201 · Chapter 6 · Lesson 6.1</span>
<h2>Mobile media, apps &amp; cross-platform storytelling</h2>
<h3>What mobile changed</h3>
<ul>
<li><strong>Always-with-you</strong> — media consumption is no longer tied to a fixed location/time (a living room TV, an office desktop).</li>
<li><strong>Location &amp; sensors</strong> — GPS, camera, microphone let media respond to where and who you are (maps, AR filters, push notifications).</li>
<li><strong>Micro-moments</strong> — content is consumed in short bursts throughout the day, favoring short-form formats.</li>
</ul>
<h3>App vs. web</h3>
<pre><code>Web (browser)                 Native app
  No install needed            Must be downloaded/installed
  Works across devices          Built for one platform (iOS/Android)
  Limited access to hardware    Full access to camera, sensors, notifications
  Update instantly               Update via app store</code></pre>
<h3>Transmedia / cross-platform storytelling</h3>
<p>A single story or brand is told across multiple platforms, each contributing a different piece (a film + a companion app + a social account + a game), so the "full story" only emerges if the audience follows it across platforms. This differs from simply re-posting the same content everywhere.</p>
<div class="callout"><span class="badge">Why it matters</span> Mobile didn't just shrink the screen — it added context (location, time, sensors) that desktop-era media never had, and made cross-platform strategy a core media skill.</div>`,
    `<span class="eyebrow">MED201 · Chương 6 · Bài 6.1</span>
<h2>Di động, ứng dụng &amp; kể chuyện đa nền tảng</h2>
<h3>Di động đã thay đổi điều gì</h3>
<ul>
<li><strong>Luôn mang theo</strong> — việc tiêu thụ truyền thông không còn gắn với một địa điểm/thời gian cố định (TV phòng khách, máy tính bàn văn phòng).</li>
<li><strong>Định vị &amp; cảm biến</strong> — GPS, camera, micro cho phép truyền thông phản hồi theo nơi bạn ở và bạn là ai (bản đồ, filter AR, thông báo đẩy).</li>
<li><strong>Khoảnh khắc ngắn</strong> — nội dung được tiêu thụ theo từng đợt ngắn suốt ngày, ưu ái định dạng ngắn.</li>
</ul>
<h3>Ứng dụng so với web</h3>
<pre><code>Web (trình duyệt)             Ứng dụng gốc (native app)
  Không cần cài đặt             Phải tải/cài đặt
  Chạy trên nhiều thiết bị       Xây riêng cho một nền tảng (iOS/Android)
  Truy cập phần cứng hạn chế     Truy cập đầy đủ camera, cảm biến, thông báo
  Cập nhật ngay lập tức           Cập nhật qua app store</code></pre>
<h3>Kể chuyện đa nền tảng / transmedia</h3>
<p>Một câu chuyện hoặc thương hiệu được kể trên nhiều nền tảng, mỗi nền tảng góp một phần khác nhau (một bộ phim + app đồng hành + tài khoản mạng xã hội + game), nên "câu chuyện đầy đủ" chỉ hiện ra nếu khán giả theo dõi qua nhiều nền tảng. Điều này khác với chỉ đăng lại cùng một nội dung ở mọi nơi.</p>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Di động không chỉ thu nhỏ màn hình — nó thêm bối cảnh (vị trí, thời gian, cảm biến) mà truyền thông thời máy tính bàn chưa từng có, và biến chiến lược đa nền tảng thành kỹ năng cốt lõi của truyền thông.</div>`,
  ]]);

const c6q = quiz('med201-quiz-6', 'Quiz 6 — Mobile & cross-platform media|||Quiz 6 — Di động & đa nền tảng', [
  { id: 'q1', question: 'Yếu tố nào là MỚI mà di động mang lại so với truyền thông thời máy tính bàn?', options: ['Định vị & cảm biến (GPS, camera, micro)', 'Chỉ có màn hình lớn hơn', 'Không cần Internet', 'Không thể xem video'], correctIndex: 0, explanation: 'Di động thêm bối cảnh: vị trí, thời gian, cảm biến — thứ TV/desktop không có.' },
  { id: 'q2', question: 'Ưu điểm chính của ứng dụng gốc (native app) so với web là?', options: ['Không cần cài đặt', 'Truy cập đầy đủ camera, cảm biến, thông báo đẩy', 'Luôn cập nhật ngay lập tức', 'Chạy y hệt trên mọi nền tảng'], correctIndex: 1, explanation: 'App gốc được xây riêng cho nền tảng, truy cập phần cứng sâu hơn web.' },
  { id: 'q3', question: 'Kể chuyện đa nền tảng (transmedia) khác gì với đăng lại cùng nội dung mọi nơi?', options: ['Mỗi nền tảng góp một phần khác của câu chuyện, phải theo dõi nhiều nơi mới thấy đủ', 'Chỉ dùng một nền tảng duy nhất', 'Không có sự khác biệt', 'Chỉ áp dụng cho quảng cáo'], correctIndex: 0, explanation: 'Transmedia phân vai cho từng nền tảng; đăng lại y nguyên không phải transmedia.' },
]);

const c7 = doc('med201-7-1-bigdata-ai-personalization', '7.1 — Big data, AI & media personalization|||7.1 — Dữ liệu lớn, AI & cá nhân hoá truyền thông',
  'Dữ liệu lớn: 3V (volume, velocity, variety); thuật toán gợi ý học từ hành vi người dùng; cá nhân hoá làm mỗi người thấy một "phiên bản" nền tảng khác nhau; bong bóng lọc (filter bubble).',
  [[
    `<span class="eyebrow">MED201 · Chapter 7 · Lesson 7.1</span>
<h2>Big data, AI &amp; media personalization</h2>
<h3>Big data — the 3 Vs</h3>
<ul>
<li><strong>Volume</strong> — the sheer amount of data platforms collect (clicks, watch time, likes, location, every scroll).</li>
<li><strong>Velocity</strong> — how fast it's generated and needs processing (real-time feeds, live recommendations).</li>
<li><strong>Variety</strong> — many kinds of data at once (text, video, location, device, social graph).</li>
</ul>
<h3>Recommendation algorithms &amp; personalization</h3>
<p>A recommendation system learns from a user's past behavior (and behavior of similar users) to predict what they're likely to engage with next, then ranks/serves content accordingly. The result: two people on the "same" platform see two different feeds — <strong>personalization</strong> means the platform is not one product, but millions of individually assembled ones.</p>
<h3>The filter bubble</h3>
<pre><code>User behavior -> algorithm predicts preference -> shows MORE of similar content
             -> user engages with it (confirms the prediction)
             -> algorithm narrows further -> user sees a narrower slice of views</code></pre>
<p>Personalization that optimizes purely for engagement can trap users in a <strong>filter bubble</strong> — a feed that mostly confirms existing views, narrowing exposure to different perspectives.</p>
<div class="callout"><span class="badge">Why it matters</span> AI/data-driven personalization is what makes new media platforms feel "smart" — but the same mechanism that makes recommendations useful can also concentrate attention and reduce exposure to diverse viewpoints.</div>`,
    `<span class="eyebrow">MED201 · Chương 7 · Bài 7.1</span>
<h2>Dữ liệu lớn, AI &amp; cá nhân hoá truyền thông</h2>
<h3>Dữ liệu lớn — 3V</h3>
<ul>
<li><strong>Volume (khối lượng)</strong> — lượng dữ liệu khổng lồ nền tảng thu thập (lượt bấm, thời gian xem, lượt thích, vị trí, mỗi lần cuộn).</li>
<li><strong>Velocity (tốc độ)</strong> — dữ liệu sinh ra và cần xử lý nhanh thế nào (feed thời gian thực, gợi ý trực tiếp).</li>
<li><strong>Variety (đa dạng)</strong> — nhiều loại dữ liệu cùng lúc (văn bản, video, vị trí, thiết bị, đồ thị xã hội).</li>
</ul>
<h3>Thuật toán gợi ý &amp; cá nhân hoá</h3>
<p>Một hệ thống gợi ý học từ hành vi trong quá khứ của người dùng (và hành vi người dùng tương tự) để dự đoán họ sẽ tương tác với gì tiếp theo, rồi xếp hạng/hiển thị nội dung theo đó. Kết quả: hai người trên "cùng" một nền tảng thấy hai dòng nội dung khác nhau — <strong>cá nhân hoá</strong> nghĩa là nền tảng không phải một sản phẩm, mà là hàng triệu sản phẩm được lắp riêng cho từng người.</p>
<h3>Bong bóng lọc (filter bubble)</h3>
<pre><code>Hành vi người dùng -> thuật toán dự đoán sở thích -> hiện THÊM nội dung tương tự
                   -> người dùng tương tác (xác nhận dự đoán đúng)
                   -> thuật toán thu hẹp thêm -> người dùng thấy góc nhìn hẹp hơn</code></pre>
<p>Cá nhân hoá tối ưu thuần cho mức độ tương tác có thể nhốt người dùng trong một <strong>bong bóng lọc</strong> — một dòng nội dung chủ yếu xác nhận quan điểm đã có, thu hẹp việc tiếp cận góc nhìn khác.</p>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Cá nhân hoá dựa trên AI/dữ liệu là điều làm nền tảng new media có vẻ "thông minh" — nhưng chính cơ chế đó, khi giúp gợi ý hữu ích, cũng có thể tập trung sự chú ý và giảm tiếp xúc với góc nhìn đa dạng.</div>`,
  ]]);

const c7q = quiz('med201-quiz-7', 'Quiz 7 — Big data, AI & personalization|||Quiz 7 — Dữ liệu lớn, AI & cá nhân hoá', [
  { id: 'q1', question: '3V của dữ liệu lớn gồm?', options: ['Volume, Velocity, Variety', 'Video, Voice, Vision', 'Value, Vision, Velocity', 'Volume, Value, Voice'], correctIndex: 0, explanation: 'Big data thường mô tả bằng 3V: khối lượng, tốc độ, đa dạng.' },
  { id: 'q2', question: 'Vì sao hai người dùng trên cùng một nền tảng có thể thấy feed hoàn toàn khác nhau?', options: ['Vì họ dùng thiết bị khác màu', 'Vì thuật toán cá nhân hoá theo hành vi riêng của mỗi người', 'Vì nền tảng ngẫu nhiên trộn nội dung', 'Không thể xảy ra'], correctIndex: 1, explanation: 'Cá nhân hoá dựa trên dữ liệu hành vi khiến mỗi người thấy một phiên bản feed khác nhau.' },
  { id: 'q3', question: '"Bong bóng lọc" (filter bubble) là kết quả của?', options: ['Cá nhân hoá tối ưu tương tác, dần thu hẹp góc nhìn hiển thị', 'Lỗi kết nối mạng', 'Thiếu dữ liệu người dùng', 'Nội dung không được nén'], correctIndex: 0, explanation: 'Vòng lặp gợi ý-tương tác-thu hẹp thêm tạo ra bong bóng lọc.' },
]);

const c8 = doc('med201-8-1-social-impact-trends', '8.1 — Social impact: misinformation, privacy & trends (AR/VR, metaverse)|||8.1 — Tác động xã hội: tin giả, quyền riêng tư & xu hướng (AR/VR, metaverse)',
  'Tin giả/thông tin sai lệch lan nhanh vì tương tác & thuật toán; quyền riêng tư & giám sát dữ liệu (surveillance capitalism); xu hướng: AR/VR & metaverse — không gian ảo/mô phỏng theo Lister.',
  [[
    `<span class="eyebrow">MED201 · Chapter 8 · Lesson 8.1</span>
<h2>Social impact: misinformation, privacy &amp; trends</h2>
<h3>Misinformation &amp; fake news</h3>
<p>New media's own advantages — many-to-many publishing, interactivity, algorithmic ranking by engagement — also make false or misleading content spread faster than corrections, because sensational content often generates more engagement than accurate content. Verifying a source is harder when anyone can publish with the same visual credibility as an established outlet.</p>
<h3>Privacy &amp; data surveillance</h3>
<p>The personalization from Chapter 7 requires collecting detailed behavioral data. When platforms' business model depends on turning that data into ad targeting, critics call it <strong>surveillance capitalism</strong> — the data isn't just used to improve the product, it becomes the product sold to advertisers. Key questions: what data is collected, who can see it, and can a user meaningfully opt out.</p>
<h3>Emerging trends: AR/VR &amp; the metaverse</h3>
<pre><code>AR (Augmented Reality)  : overlays digital content on the real world (a phone filter, navigation arrows)
VR (Virtual Reality)     : replaces the real world with a fully simulated one (a headset)
Metaverse                : a proposed persistent, shared, 3D virtual space combining
                            social media + gaming + commerce — Lister's "virtual/simulated"
                            characteristic taken to its extreme</code></pre>
<div class="callout"><span class="badge">Why it matters</span> The same features that make new media powerful — speed, interactivity, personalization, simulated space — are exactly what create its biggest risks. Studying "what's new" also means studying what that novelty costs society.</div>`,
    `<span class="eyebrow">MED201 · Chương 8 · Bài 8.1</span>
<h2>Tác động xã hội: tin giả, quyền riêng tư & xu hướng</h2>
<h3>Tin giả &amp; thông tin sai lệch</h3>
<p>Chính những lợi thế của new media — xuất bản nhiều-tới-nhiều, tính tương tác, xếp hạng theo thuật toán dựa trên tương tác — cũng khiến nội dung sai lệch lan nhanh hơn cả đính chính, vì nội dung giật gân thường tạo ra nhiều tương tác hơn nội dung chính xác. Xác minh nguồn khó hơn khi ai cũng xuất bản được với độ tin cậy hình ảnh ngang một cơ quan báo chí chính thống.</p>
<h3>Quyền riêng tư &amp; giám sát dữ liệu</h3>
<p>Cá nhân hoá ở Chương 7 cần thu thập dữ liệu hành vi chi tiết. Khi mô hình kinh doanh của nền tảng phụ thuộc vào biến dữ liệu đó thành nhắm quảng cáo, giới phê bình gọi đó là <strong>chủ nghĩa tư bản giám sát (surveillance capitalism)</strong> — dữ liệu không chỉ dùng để cải thiện sản phẩm, mà trở thành sản phẩm bán cho nhà quảng cáo. Câu hỏi cốt lõi: dữ liệu nào được thu thập, ai xem được, và người dùng có thể từ chối thực sự không.</p>
<h3>Xu hướng mới: AR/VR &amp; metaverse</h3>
<pre><code>AR (Thực tế tăng cường) : chồng nội dung số lên thế giới thực (filter điện thoại, mũi tên chỉ đường)
VR (Thực tế ảo)          : thay thế thế giới thực bằng một thế giới mô phỏng đầy đủ (kính VR)
Metaverse                 : không gian ảo 3D bền vững, dùng chung, gộp mạng xã hội +
                             game + thương mại — đặc điểm "ảo/mô phỏng" của Lister
                             được đẩy tới cực điểm</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Chính những đặc điểm làm new media mạnh mẽ — tốc độ, tương tác, cá nhân hoá, không gian mô phỏng — cũng là những gì tạo ra rủi ro lớn nhất của nó. Học "cái gì là mới" cũng là học cái mới đó khiến xã hội phải trả giá gì.</div>`,
  ]]);

const c8q = quiz('med201-quiz-8', 'Quiz 8 — Misinformation, privacy & trends|||Quiz 8 — Tin giả, quyền riêng tư & xu hướng', [
  { id: 'q1', question: 'Vì sao tin giả thường lan nhanh hơn tin chính xác trên new media?', options: ['Vì nội dung giật gân thường tạo nhiều tương tác hơn, được thuật toán ưu tiên', 'Vì tin giả luôn ngắn hơn', 'Vì Internet chặn tin chính xác', 'Không có sự khác biệt về tốc độ lan truyền'], correctIndex: 0, explanation: 'Thuật toán xếp hạng theo tương tác vô tình ưu ái nội dung giật gân/sai lệch.' },
  { id: 'q2', question: '"Chủ nghĩa tư bản giám sát" (surveillance capitalism) mô tả điều gì?', options: ['Dữ liệu người dùng bị biến thành sản phẩm bán cho nhà quảng cáo', 'Chính phủ cấm mạng xã hội', 'Không thu thập dữ liệu người dùng', 'Chỉ áp dụng cho báo in'], correctIndex: 0, explanation: 'Mô hình kinh doanh dựa trên khai thác dữ liệu hành vi để bán quảng cáo nhắm mục tiêu.' },
  { id: 'q3', question: 'Metaverse liên hệ trực tiếp với đặc điểm nào của Lister về new media?', options: ['Ảo/mô phỏng (virtual/simulated)', 'Siêu văn bản', 'Số hoá', 'Kết nối mạng'], correctIndex: 0, explanation: 'Metaverse là ví dụ cực điểm của đặc điểm "ảo/mô phỏng" — không gian không có nguyên bản vật lý.' },
]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'MED201',
    slug: 'med201-new-media-technology',
    title: 'New Media Technology',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/MED201.webp',
    shortDescription: 'What makes media "new": digitization/convergence, internet/platforms, social & interactive media, digital content, mobile & cross-platform, AI personalization, misinformation/privacy, AR/VR & metaverse.|||Điều gì làm truyền thông "mới": số hoá/hội tụ, Internet/nền tảng, mạng xã hội & tương tác, nội dung số, di động đa nền tảng, cá nhân hoá AI, tin giả/quyền riêng tư, AR/VR & metaverse.',
    description: 'Môn <strong>MED201 — New Media Technology</strong> (kỳ 1, khối Quản trị Kinh doanh) giúp hiểu <strong>điều gì làm truyền thông trở nên "mới"</strong>. Từ <strong>new media là gì &amp; khác biệt với truyền thông truyền thống</strong> (Lister, McLuhan) → <strong>số hoá &amp; hội tụ truyền thông</strong> (Manovich) → <strong>Internet, web &amp; nền tảng số</strong> → <strong>mạng xã hội &amp; truyền thông tương tác</strong> → <strong>nội dung số</strong> (văn bản/hình ảnh/âm thanh/video) → <strong>di động &amp; truyền thông đa nền tảng</strong> → <strong>dữ liệu lớn, AI &amp; cá nhân hoá</strong> → <strong>tác động xã hội</strong>: tin giả, quyền riêng tư, xu hướng AR/VR &amp; metaverse. Bám giáo trình FLM, trích dẫn Lister/Manovich/McLuhan, song ngữ, quiz mỗi chương.',
    whatYouLearn: 'Năm đặc điểm của new media (Lister); "phương tiện là thông điệp" (McLuhan); số hoá & nguyên lý Manovich (biểu diễn số, mô-đun, tự động hoá, khả biến, chuyển mã); hội tụ truyền thông (công nghệ/ngành/nội dung); Internet vs web, Web 1.0/2.0/3.0, nền tảng & hiệu ứng mạng; đặc điểm mạng xã hội, mức độ tương tác, feed thuật toán; định dạng nội dung số (raster/vector, nén, lấy mẫu âm, codec/streaming); di động, app vs web, kể chuyện đa nền tảng; dữ liệu lớn (3V), gợi ý & cá nhân hoá, bong bóng lọc; tin giả, giám sát dữ liệu, xu hướng AR/VR & metaverse.',
    requirements: 'Không yêu cầu kiến thức kỹ thuật trước. Nên có tài khoản dùng thử một vài nền tảng số (mạng xã hội, ứng dụng di động) để đối chiếu với lý thuyết trong bài.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách nền (Lister, Manovich, McLuhan), giáo trình FLM, tài liệu miễn phí, YouTube, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'New media là gì, ba tác giả nền, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — New media là gì & khác biệt|||Chapter 1 — What is new media & how it differs', description: '5 đặc điểm của Lister; truyền thông truyền thống vs new media; McLuhan.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Số hoá & hội tụ truyền thông|||Chapter 2 — Digitization & convergence', description: 'Analog→digital; nguyên lý Manovich; hội tụ công nghệ/ngành/nội dung.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Internet, web & nền tảng số|||Chapter 3 — Internet, web & platforms', description: 'Internet vs web; Web 1.0/2.0/3.0; nền tảng & hiệu ứng mạng.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Mạng xã hội & truyền thông tương tác|||Chapter 4 — Social & interactive media', description: 'Đặc điểm mạng xã hội, mức tương tác, feed thuật toán.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Nội dung số: văn bản, hình ảnh, âm thanh, video|||Chapter 5 — Digital content formats', description: 'Siêu văn bản, raster/vector, lấy mẫu âm, codec/streaming.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Di động, ứng dụng & đa nền tảng|||Chapter 6 — Mobile, apps & cross-platform', description: 'Di động, app vs web, kể chuyện đa nền tảng.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Dữ liệu lớn, AI & cá nhân hoá|||Chapter 7 — Big data, AI & personalization', description: '3V dữ liệu lớn, thuật toán gợi ý, bong bóng lọc.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Tác động xã hội & xu hướng|||Chapter 8 — Social impact & trends', description: 'Tin giả, quyền riêng tư/giám sát dữ liệu, AR/VR & metaverse.', lessons: [c8, c8q] },
  ],
};
