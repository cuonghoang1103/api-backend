/**
 * CHI321 — Integrated Chinese 4 (Tiếng Trung tổng hợp 4). Khối Ngôn ngữ Trung
 * FPTU. NỐI TIẾP CHI311. Đây là MÔN NGÔN NGỮ: cấu trúc theo BÀI HỌC TIẾNG (từ
 * vựng, ngữ pháp, hội thoại, luyện tập) theo track "Integrated Chinese", bám
 * Level 2 Part 1 (Liu et al., Cheng &amp; Tsui) — mức tương đương HSK3. Giữ
 * NGUYÊN slug/semester/courseCode/thumb.
 * ⚠️ KHÔNG backtick lồng/${; trong HTML content "&" → "&amp;". shortDescription
 * dùng "&" thường.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh từ vựng & ngữ pháp của bài.', quiz: { timeLimitSeconds: 360, questions } });

const taiLieu = doc('chi321-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu & lộ trình học',
  'Giáo trình chuẩn (Integrated Chinese Level 2 Part 1, Liu et al.), workbook & character workbook, app (Pleco/Anki), từ điển hanzii.net, YouTube, lộ trình 4 bước. Nhắc lại nền tảng CHI311.',
  [[
    `<span class="eyebrow">CHI321 · Materials</span>
<h2>How to keep learning Chinese — materials &amp; roadmap</h2>
<p class="lead">Integrated Chinese 4 <strong>continues CHI311</strong> on the <strong>Integrated Chinese</strong> track: it assumes you already know pinyin, the 4 tones, resultative and degree complements with 得, and paired connectives such as 一…就 and 越来越. It moves on to a new semester, dorm life and moving, advanced shopping, traffic and directions, health and sports, part-time jobs, festivals and future plans — at roughly <strong>HSK3</strong>. Below are the standard textbook plus free tools.</p>
<h3>📘 Standard textbook</h3>
<ul>
<li><strong>Integrated Chinese, Level 2 Part 1</strong> (Yuehua Liu, Tao-chung Yao et al. — Cheng &amp; Tsui) — the mainstream university coursebook this track continues into.</li>
<li><strong>Integrated Chinese Workbook &amp; Character Workbook</strong> — drills for listening, speaking and stroke-order writing.</li>
</ul>
<h3>📱 Apps &amp; dictionaries</h3>
<ul>
<li><a href="https://www.pleco.com/" target="_blank" rel="noopener">Pleco</a> — the standard Chinese dictionary app (handwriting &amp; audio).</li>
<li><a href="https://apps.ankiweb.net/" target="_blank" rel="noopener">Anki</a> — spaced-repetition flashcards for hanzi &amp; vocab.</li>
<li><a href="https://hanzii.net/" target="_blank" rel="noopener">hanzii.net</a> — Chinese to Vietnamese dictionary with stroke order.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@ChineseZeroToHero" target="_blank" rel="noopener">Chinese Zero to Hero</a> — structured lessons that match this course order.</li>
<li><a href="https://www.youtube.com/@MandarinCorner" target="_blank" rel="noopener">Mandarin Corner</a> — real dialogues with subtitles.</li>
</ul>
<div class="callout"><span class="badge">4-step path</span>
<ol>
<li><strong>Review CHI311</strong> — make sure resultative complements, 得 degree complements, 一…就, 越来越 and the health / travel vocabulary are solid before you start.</li>
<li><strong>Vocabulary</strong> — learn hanzi in context, review daily with Anki/Pleco.</li>
<li><strong>Grammar</strong> — new patterns (把, 被, potential complements) build on old word order.</li>
<li><strong>Speaking</strong> — say every sentence out loud; shadow the audio.</li>
</ol></div>`,
    `<span class="eyebrow">CHI321 · Tài liệu</span>
<h2>Học tiếp tiếng Trung — tài liệu &amp; lộ trình</h2>
<p class="lead">Tiếng Trung tổng hợp 4 <strong>nối tiếp CHI311</strong> trên track <strong>Integrated Chinese</strong>: giả định bạn đã nắm pinyin, 4 thanh, bổ ngữ kết quả và bổ ngữ trình độ với 得, cùng các cặp liên từ như 一…就 và 越来越. Giờ học tiếp sang khai giảng học kỳ mới, ở ký túc và chuyển nhà, mua sắm nâng cao, giao thông và chỉ đường, sức khỏe và thể thao, việc làm thêm, lễ hội và kế hoạch tương lai — ở mức tương đương <strong>HSK3</strong>. Bên dưới là giáo trình chuẩn cùng công cụ miễn phí.</p>
<h3>📘 Giáo trình chuẩn</h3>
<ul>
<li><strong>Integrated Chinese, Level 2 Part 1</strong> (Yuehua Liu, Tao-chung Yao và cộng sự — NXB Cheng &amp; Tsui) — giáo trình đại học mà track này học tiếp.</li>
<li><strong>Integrated Chinese Workbook &amp; Character Workbook</strong> — bài luyện nghe, nói và tập viết theo thứ tự nét.</li>
</ul>
<h3>📱 App &amp; từ điển</h3>
<ul>
<li><a href="https://www.pleco.com/" target="_blank" rel="noopener">Pleco</a> — từ điển tiếng Trung chuẩn (viết tay &amp; phát âm).</li>
<li><a href="https://apps.ankiweb.net/" target="_blank" rel="noopener">Anki</a> — thẻ ghi nhớ lặp lại ngắt quãng cho chữ Hán &amp; từ vựng.</li>
<li><a href="https://hanzii.net/" target="_blank" rel="noopener">hanzii.net</a> — từ điển Trung sang Việt kèm thứ tự nét.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@ChineseZeroToHero" target="_blank" rel="noopener">Chinese Zero to Hero</a> — bài học có hệ thống, khớp thứ tự môn này.</li>
<li><a href="https://www.youtube.com/@MandarinCorner" target="_blank" rel="noopener">Mandarin Corner</a> — hội thoại thật có phụ đề.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình 4 bước</span>
<ol>
<li><strong>Ôn CHI311</strong> — bảo đảm bổ ngữ kết quả, bổ ngữ trình độ 得, 一…就, 越来越 và từ vựng sức khỏe / du lịch đã vững trước khi bắt đầu.</li>
<li><strong>Từ vựng</strong> — học chữ Hán trong ngữ cảnh, ôn mỗi ngày bằng Anki/Pleco.</li>
<li><strong>Ngữ pháp</strong> — mẫu câu mới (把, 被, bổ ngữ khả năng) xây trên trật tự từ cũ.</li>
<li><strong>Luyện nói</strong> — đọc to mọi câu; nói nhại theo audio.</li>
</ol></div>`,
  ]]);

const intro = doc('chi321-0-1-overview', 'Course overview: Integrated Chinese 4|||Tổng quan: Tiếng Trung tổng hợp 4',
  'Nối tiếp CHI311 (bổ ngữ kết quả, 得, 一…就, 越来越), track Integrated Chinese, mục tiêu HSK3, và lộ trình 8 bài chủ đề đời sống mở rộng.',
  [[
    `<span class="eyebrow">CHI321 · Lesson 0.1 · Overview</span>
<h2>Integrated Chinese 4</h2>
<p class="lead">This course picks up right where <strong>CHI311</strong> left off, still on the <strong>Integrated Chinese</strong> (Liu et al.) track. You already have resultative and degree complements, 一…就 and 越来越; now you learn to talk about a new semester and choosing courses, dorm life and moving, advanced shopping, traffic and directions, health and sports, applying for a part-time job, festivals, and plans for the future.</p>
<h3>What is new at this level</h3>
<ul>
<li><strong>The 把 sentence</strong> — 把家具搬进宿舍 (move the furniture into the dorm): move the object before the verb to say what happens to it.</li>
<li><strong>The 被 passive</strong> — 他被车撞伤了 (he was hit by a car), showing who or what an action is done by.</li>
<li><strong>Potential complements 得 / 不</strong> — 听得懂 / 听不懂 (can / cannot understand), 找得到 / 找不到 (can / cannot find).</li>
<li><strong>More connectives</strong> — 虽然…但是 (although), 不但…而且 (not only … but also), 除了…以外 (besides / except), 越…越 (the more … the more).</li>
</ul>
<h3>Roadmap of this course</h3>
<p>New semester &amp; courses → dorm life &amp; moving → advanced shopping → traffic &amp; directions → health &amp; sports → part-time jobs → festivals → future plans. Every lesson has a vocabulary table (汉字 | pinyin | meaning), grammar points with examples, a short dialogue, notes, and a quiz.</p>`,
    `<span class="eyebrow">CHI321 · Bài 0.1 · Tổng quan</span>
<h2>Tiếng Trung tổng hợp 4</h2>
<p class="lead">Môn này học tiếp ngay từ chỗ <strong>CHI311</strong> dừng lại, vẫn trên track <strong>Integrated Chinese</strong> (Liu và cộng sự). Bạn đã có bổ ngữ kết quả và bổ ngữ trình độ, 一…就 và 越来越; giờ học cách nói về khai giảng và chọn môn, ở ký túc và chuyển nhà, mua sắm nâng cao, giao thông và chỉ đường, sức khỏe và thể thao, xin việc làm thêm, lễ hội, và kế hoạch cho tương lai.</p>
<h3>Điểm mới ở trình độ này</h3>
<ul>
<li><strong>Câu chữ 把</strong> — 把家具搬进宿舍 (chuyển đồ đạc vào ký túc): đưa tân ngữ lên trước động từ để nói điều xảy ra với nó.</li>
<li><strong>Câu bị động 被</strong> — 他被车撞伤了 (anh ấy bị xe đâm bị thương), nêu ai hay cái gì thực hiện hành động.</li>
<li><strong>Bổ ngữ khả năng 得 / 不</strong> — 听得懂 / 听不懂 (nghe hiểu / nghe không hiểu được), 找得到 / 找不到 (tìm được / không tìm được).</li>
<li><strong>Thêm liên từ</strong> — 虽然…但是 (tuy … nhưng), 不但…而且 (không những … mà còn), 除了…以外 (ngoài … ra), 越…越 (càng … càng).</li>
</ul>
<h3>Lộ trình của môn</h3>
<p>Khai giảng &amp; chọn môn → ký túc &amp; chuyển nhà → mua sắm nâng cao → giao thông &amp; chỉ đường → sức khỏe &amp; thể thao → việc làm thêm → lễ hội → kế hoạch tương lai. Mỗi bài có bảng từ vựng (汉字 | pinyin | nghĩa), điểm ngữ pháp kèm ví dụ, một hội thoại ngắn, ghi chú, và quiz.</p>`,
  ]]);

const b1 = doc('chi321-1-1-new-semester', 'Lesson 1 — New semester &amp; courses|||Bài 1 — Khai giảng &amp; học kỳ',
  'Từ vựng: 开学, 学期, 选课, 专业, 复习, 打算, 决定, 报名, 除了. Ngữ pháp: 除了…以外, 打算 (dự định), 决定 (quyết định), 报名 (đăng ký).',
  [[
    `<span class="eyebrow">CHI321 · Lesson 1 · New semester</span>
<h2>New semester &amp; choosing courses (开学选课)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>开学</td><td>kāixué</td><td>to start a new term</td></tr>
<tr><td>学期</td><td>xuéqī</td><td>semester / term</td></tr>
<tr><td>选课</td><td>xuǎnkè</td><td>to choose / register courses</td></tr>
<tr><td>专业</td><td>zhuānyè</td><td>major</td></tr>
<tr><td>复习</td><td>fùxí</td><td>to review</td></tr>
<tr><td>打算</td><td>dǎsuàn</td><td>to plan / intend</td></tr>
<tr><td>决定</td><td>juédìng</td><td>to decide</td></tr>
<tr><td>报名</td><td>bàomíng</td><td>to sign up / enroll</td></tr>
<tr><td>除了</td><td>chúle</td><td>except / besides</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>除了 … 以外</strong> = besides / except: 除了汉语<strong>以外</strong>，我还学日语 (besides Chinese, I also study Japanese).</li>
<li><strong>打算 dǎsuàn</strong> = to plan: 这个学期我<strong>打算</strong>选四门课 (this term I plan to take four courses).</li>
<li><strong>决定 juédìng</strong> = to decide: 我<strong>决定</strong>换一个专业 (I decided to change my major).</li>
<li><strong>报名 bàomíng</strong> = to enroll: 开学以后要先<strong>报名</strong>选课 (after the term starts you enroll and choose courses first).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 快开学了，你打算选什么课？ Kuài kāixué le, nǐ dǎsuàn xuǎn shénme kè? (Term starts soon, what courses do you plan to take?)
B: 除了专业课以外，我还想选汉语。 Chúle zhuānyè kè yǐwài, wǒ hái xiǎng xuǎn hànyǔ. (Besides major courses, I also want Chinese.)
A: 你决定了吗？ Nǐ juédìng le ma? (Have you decided?)
B: 决定了，明天就去报名。 Juédìng le, míngtiān jiù qù bàomíng. (Yes, I will enroll tomorrow.)
</code></pre>
<div class="callout"><span class="badge">Note</span> 除了 … 以外 has two uses: with 还 or 也 it means besides (it adds more); with 都 it means except (it excludes one). Watch the second word to tell them apart.</div>`,
    `<span class="eyebrow">CHI321 · Bài 1 · Khai giảng</span>
<h2>Khai giảng &amp; chọn môn (开学选课)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>开学</td><td>kāixué</td><td>khai giảng, vào học kỳ</td></tr>
<tr><td>学期</td><td>xuéqī</td><td>học kỳ</td></tr>
<tr><td>选课</td><td>xuǎnkè</td><td>chọn môn, đăng ký môn</td></tr>
<tr><td>专业</td><td>zhuānyè</td><td>chuyên ngành</td></tr>
<tr><td>复习</td><td>fùxí</td><td>ôn tập</td></tr>
<tr><td>打算</td><td>dǎsuàn</td><td>dự định, tính</td></tr>
<tr><td>决定</td><td>juédìng</td><td>quyết định</td></tr>
<tr><td>报名</td><td>bàomíng</td><td>đăng ký, ghi danh</td></tr>
<tr><td>除了</td><td>chúle</td><td>ngoài, trừ</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>除了 … 以外</strong> = ngoài … ra: 除了汉语<strong>以外</strong>，我还学日语 (ngoài tiếng Trung ra, tôi còn học tiếng Nhật).</li>
<li><strong>打算 dǎsuàn</strong> = dự định: 这个学期我<strong>打算</strong>选四门课 (học kỳ này tôi định chọn bốn môn).</li>
<li><strong>决定 juédìng</strong> = quyết định: 我<strong>决定</strong>换一个专业 (tôi quyết định đổi chuyên ngành).</li>
<li><strong>报名 bàomíng</strong> = đăng ký: 开学以后要先<strong>报名</strong>选课 (sau khai giảng phải đăng ký chọn môn trước).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 快开学了，你打算选什么课？ Kuài kāixué le, nǐ dǎsuàn xuǎn shénme kè? (Sắp khai giảng, bạn định chọn môn gì?)
B: 除了专业课以外，我还想选汉语。 Chúle zhuānyè kè yǐwài, wǒ hái xiǎng xuǎn hànyǔ. (Ngoài môn chuyên ngành ra, tôi còn muốn chọn tiếng Trung.)
A: 你决定了吗？ Nǐ juédìng le ma? (Bạn quyết định chưa?)
B: 决定了，明天就去报名。 Juédìng le, míngtiān jiù qù bàomíng. (Quyết rồi, mai đi đăng ký luôn.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 除了 … 以外 có hai nghĩa: đi với 还 hoặc 也 nghĩa là ngoài … ra (thêm vào); đi với 都 nghĩa là trừ … ra (loại một cái). Nhìn từ đứng sau để phân biệt.</div>`,
  ]]);

const b1q = quiz('chi321-quiz-1', 'Quiz 1 — New semester &amp; courses|||Quiz 1 — Khai giảng &amp; học kỳ', [
  { id: 'q1', question: 'Câu 除了汉语以外，我还学日语 nghĩa là? / What does 除了汉语以外，我还学日语 mean?', options: ['Tôi chỉ học tiếng Trung|||I only study Chinese', 'Ngoài tiếng Trung ra, tôi còn học tiếng Nhật|||besides Chinese, I also study Japanese', 'Tôi không học tiếng Nhật|||I do not study Japanese', 'Tôi thích tiếng Nhật hơn|||I prefer Japanese'], correctIndex: 1, explanation: '除了…以外 đi với 还 nghĩa là ngoài … ra, thêm vào: ngoài tiếng Trung còn học tiếng Nhật.' },
  { id: 'q2', question: '"打算" (dǎsuàn) nghĩa là? / What does 打算 mean?', options: ['quyết định xong|||already decided', 'dự định, tính|||to plan / intend', 'từ chối|||to refuse', 'quên mất|||to forget'], correctIndex: 1, explanation: '打算 = dự định làm gì: 我打算选四门课 = tôi định chọn bốn môn.' },
  { id: 'q3', question: '"选课" (xuǎnkè) nghĩa là? / What does 选课 mean?', options: ['nghỉ học|||skip class', 'chọn / đăng ký môn học|||to choose or register courses', 'thi cử|||to take exams', 'dạy học|||to teach'], correctIndex: 1, explanation: '选 (chọn) + 课 (môn học) = chọn môn, đăng ký môn. Đầu học kỳ phải 报名选课.' },
]);

const b2 = doc('chi321-2-1-dorm-moving', 'Lesson 2 — Dorm life &amp; moving|||Bài 2 — Ở ký túc &amp; chuyển nhà',
  'Từ vựng: 宿舍, 搬家, 搬, 家具, 整齐, 干净, 放, 空调, 舒服. Ngữ pháp: câu chữ 把 (把家具搬进来), 放在…上, 搬进/搬出, 整齐/干净.',
  [[
    `<span class="eyebrow">CHI321 · Lesson 2 · Dorm life</span>
<h2>Dorm life &amp; moving (宿舍和搬家)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>宿舍</td><td>sùshè</td><td>dormitory</td></tr>
<tr><td>搬家</td><td>bānjiā</td><td>to move house</td></tr>
<tr><td>搬</td><td>bān</td><td>to move / carry</td></tr>
<tr><td>家具</td><td>jiājù</td><td>furniture</td></tr>
<tr><td>整齐</td><td>zhěngqí</td><td>tidy / neat</td></tr>
<tr><td>干净</td><td>gānjìng</td><td>clean</td></tr>
<tr><td>放</td><td>fàng</td><td>to put / place</td></tr>
<tr><td>空调</td><td>kōngtiáo</td><td>air conditioner</td></tr>
<tr><td>舒服</td><td>shūfu</td><td>comfortable</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>The 把 sentence</strong>: 把 + object + verb + result. It moves the object before the verb to say what happens to it — 请<strong>把</strong>家具<strong>搬</strong>进宿舍 (please move the furniture into the dorm).</li>
<li><strong>把 … 放在 … 上</strong>: 我<strong>把</strong>书<strong>放在</strong>桌子<strong>上</strong> (I put the books on the desk). The verb needs a result or location after it.</li>
<li><strong>搬进 / 搬出</strong>: 搬<strong>进</strong> (move in), 搬<strong>出</strong> (move out) use directional complements.</li>
<li><strong>整齐 ↔ 干净</strong>: 整齐 is tidy (well arranged); 干净 is clean (no dirt) — 把房间收拾<strong>整齐</strong> (tidy the room up).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 明天搬家，你准备好了吗？ Míngtiān bānjiā, nǐ zhǔnbèi hǎo le ma? (We move tomorrow, are you ready?)
B: 好了，请把家具搬进宿舍。 Hǎo le, qǐng bǎ jiājù bān jìn sùshè. (Yes, please move the furniture into the dorm.)
A: 把书放在桌子上吧。 Bǎ shū fàng zài zhuōzi shàng ba. (Put the books on the desk.)
B: 房间又整齐又干净，真舒服。 Fángjiān yòu zhěngqí yòu gānjìng, zhēn shūfu. (The room is tidy and clean, very comfortable.)
</code></pre>
<div class="callout"><span class="badge">Note</span> A 把 sentence must have something after the verb — a result, a direction, or a location. You cannot say 把书放 alone; say 把书放在桌子上 (put the books on the desk).</div>`,
    `<span class="eyebrow">CHI321 · Bài 2 · Ký túc</span>
<h2>Ở ký túc &amp; chuyển nhà (宿舍和搬家)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>宿舍</td><td>sùshè</td><td>ký túc xá</td></tr>
<tr><td>搬家</td><td>bānjiā</td><td>chuyển nhà, dọn nhà</td></tr>
<tr><td>搬</td><td>bān</td><td>chuyển, khiêng</td></tr>
<tr><td>家具</td><td>jiājù</td><td>đồ đạc, nội thất</td></tr>
<tr><td>整齐</td><td>zhěngqí</td><td>gọn gàng, ngăn nắp</td></tr>
<tr><td>干净</td><td>gānjìng</td><td>sạch sẽ</td></tr>
<tr><td>放</td><td>fàng</td><td>đặt, để</td></tr>
<tr><td>空调</td><td>kōngtiáo</td><td>máy điều hòa</td></tr>
<tr><td>舒服</td><td>shūfu</td><td>thoải mái, dễ chịu</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>Câu chữ 把</strong>: 把 + tân ngữ + động từ + kết quả. Nó đưa tân ngữ lên trước động từ để nói điều xảy ra với nó — 请<strong>把</strong>家具<strong>搬</strong>进宿舍 (xin chuyển đồ đạc vào ký túc).</li>
<li><strong>把 … 放在 … 上</strong>: 我<strong>把</strong>书<strong>放在</strong>桌子<strong>上</strong> (tôi đặt sách lên bàn). Sau động từ phải có kết quả hoặc nơi chốn.</li>
<li><strong>搬进 / 搬出</strong>: 搬<strong>进</strong> (chuyển vào), 搬<strong>出</strong> (chuyển ra) dùng bổ ngữ xu hướng.</li>
<li><strong>整齐 ↔ 干净</strong>: 整齐 là gọn gàng (sắp xếp ngăn nắp); 干净 là sạch (không bẩn) — 把房间收拾<strong>整齐</strong> (dọn phòng cho gọn).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 明天搬家，你准备好了吗？ Míngtiān bānjiā, nǐ zhǔnbèi hǎo le ma? (Mai chuyển nhà, bạn chuẩn bị xong chưa?)
B: 好了，请把家具搬进宿舍。 Hǎo le, qǐng bǎ jiājù bān jìn sùshè. (Xong rồi, xin chuyển đồ đạc vào ký túc.)
A: 把书放在桌子上吧。 Bǎ shū fàng zài zhuōzi shàng ba. (Đặt sách lên bàn nhé.)
B: 房间又整齐又干净，真舒服。 Fángjiān yòu zhěngqí yòu gānjìng, zhēn shūfu. (Phòng vừa gọn vừa sạch, thật dễ chịu.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> Câu chữ 把 bắt buộc có thành phần sau động từ — kết quả, xu hướng, hoặc nơi chốn. Không nói 把书放 trơ trọi; phải nói 把书放在桌子上 (đặt sách lên bàn).</div>`,
  ]]);

const b2q = quiz('chi321-quiz-2', 'Quiz 2 — Dorm life &amp; moving|||Quiz 2 — Ở ký túc &amp; chuyển nhà', [
  { id: 'q1', question: 'Câu chữ 把 dùng để làm gì? / What is the 把 sentence for?', options: ['so sánh hai vật|||to compare two things', 'đưa tân ngữ lên trước động từ để nói điều xảy ra với nó|||to move the object before the verb to say what happens to it', 'hỏi giờ|||to ask the time', 'phủ định câu|||to negate a sentence'], correctIndex: 1, explanation: 'Câu 把: 把 + tân ngữ + động từ + kết quả, ví dụ 把家具搬进宿舍.' },
  { id: 'q2', question: 'Câu nào ĐÚNG? / Which sentence is correct?', options: ['把书放|||把书放', '把书放在桌子上|||把书放在桌子上', '书把放桌子|||书把放桌子', '放把书桌子上|||放把书桌子上'], correctIndex: 1, explanation: 'Câu 把 phải có kết quả hoặc nơi chốn sau động từ: 把书放在桌子上 = đặt sách lên bàn.' },
  { id: 'q3', question: '"整齐" (zhěngqí) nghĩa là? / What does 整齐 mean?', options: ['bẩn thỉu|||dirty', 'gọn gàng, ngăn nắp|||tidy / neat', 'ồn ào|||noisy', 'rộng rãi|||spacious'], correctIndex: 1, explanation: '整齐 = gọn gàng; khác 干净 (sạch, không bẩn). 把房间收拾整齐 = dọn phòng cho gọn.' },
]);

const b3 = doc('chi321-3-1-shopping', 'Lesson 3 — Shopping &amp; comparison|||Bài 3 — Mua sắm &amp; so sánh',
  'Từ vựng: 质量, 牌子, 比较, 贵, 便宜, 退, 换, 打折, 售货员. Ngữ pháp: 比较 (tương đối), 越来越 (càng ngày càng), bổ ngữ khả năng 退得了/退不了, 买得起/买不起.',
  [[
    `<span class="eyebrow">CHI321 · Lesson 3 · Shopping</span>
<h2>Shopping &amp; comparison (购物和比较)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>质量</td><td>zhìliàng</td><td>quality</td></tr>
<tr><td>牌子</td><td>páizi</td><td>brand</td></tr>
<tr><td>比较</td><td>bǐjiào</td><td>fairly; to compare</td></tr>
<tr><td>贵</td><td>guì</td><td>expensive</td></tr>
<tr><td>便宜</td><td>piányi</td><td>cheap</td></tr>
<tr><td>退</td><td>tuì</td><td>to return (goods)</td></tr>
<tr><td>换</td><td>huàn</td><td>to exchange</td></tr>
<tr><td>打折</td><td>dǎzhé</td><td>to give a discount</td></tr>
<tr><td>售货员</td><td>shòuhuòyuán</td><td>shop assistant</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>比较 bǐjiào</strong> = fairly / rather (before an adjective): 这个牌子<strong>比较</strong>贵 (this brand is rather expensive).</li>
<li><strong>越来越 + adjective</strong> = more and more: 东西<strong>越来越</strong>贵 (things get more and more expensive).</li>
<li><strong>Potential complement 得 / 不</strong>: 退<strong>得</strong>了 (can return) / 退<strong>不</strong>了 (cannot return); 买<strong>得</strong>起 (can afford) / 买<strong>不</strong>起 (cannot afford).</li>
<li><strong>退 vs 换</strong>: 退 is to give it back for a refund; 换 is to swap it for another one — 可以<strong>退换</strong>吗? (can I return or exchange it?).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 这个牌子质量怎么样？ Zhège páizi zhìliàng zěnmeyàng? (How is this brand quality?)
B: 质量比较好，可是有点儿贵。 Zhìliàng bǐjiào hǎo, kěshì yǒudiǎnr guì. (The quality is rather good, but a bit expensive.)
A: 太贵了，我买不起。 Tài guì le, wǒ mǎi bù qǐ. (Too expensive, I cannot afford it.)
B: 现在打折，还可以退换。 Xiànzài dǎzhé, hái kěyǐ tuìhuàn. (It is on sale now, and can be returned or exchanged.)
</code></pre>
<div class="callout"><span class="badge">Note</span> A potential complement puts 得 (can) or 不 (cannot) between the verb and its result: 买得起 (can afford) vs 买不起 (cannot afford). Do not use 能 together with it.</div>`,
    `<span class="eyebrow">CHI321 · Bài 3 · Mua sắm</span>
<h2>Mua sắm &amp; so sánh (购物和比较)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>质量</td><td>zhìliàng</td><td>chất lượng</td></tr>
<tr><td>牌子</td><td>páizi</td><td>nhãn hiệu, thương hiệu</td></tr>
<tr><td>比较</td><td>bǐjiào</td><td>tương đối; so sánh</td></tr>
<tr><td>贵</td><td>guì</td><td>đắt</td></tr>
<tr><td>便宜</td><td>piányi</td><td>rẻ</td></tr>
<tr><td>退</td><td>tuì</td><td>trả lại (hàng)</td></tr>
<tr><td>换</td><td>huàn</td><td>đổi</td></tr>
<tr><td>打折</td><td>dǎzhé</td><td>giảm giá</td></tr>
<tr><td>售货员</td><td>shòuhuòyuán</td><td>nhân viên bán hàng</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>比较 bǐjiào</strong> = tương đối / khá (đứng trước tính từ): 这个牌子<strong>比较</strong>贵 (nhãn này khá đắt).</li>
<li><strong>越来越 + tính từ</strong> = càng ngày càng: 东西<strong>越来越</strong>贵 (đồ càng ngày càng đắt).</li>
<li><strong>Bổ ngữ khả năng 得 / 不</strong>: 退<strong>得</strong>了 (trả được) / 退<strong>不</strong>了 (không trả được); 买<strong>得</strong>起 (mua nổi) / 买<strong>不</strong>起 (không mua nổi).</li>
<li><strong>退 và 换</strong>: 退 là trả lại lấy tiền; 换 là đổi lấy cái khác — 可以<strong>退换</strong>吗? (đổi trả được không?).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 这个牌子质量怎么样？ Zhège páizi zhìliàng zěnmeyàng? (Nhãn này chất lượng thế nào?)
B: 质量比较好，可是有点儿贵。 Zhìliàng bǐjiào hǎo, kěshì yǒudiǎnr guì. (Chất lượng khá tốt, nhưng hơi đắt.)
A: 太贵了，我买不起。 Tài guì le, wǒ mǎi bù qǐ. (Đắt quá, tôi mua không nổi.)
B: 现在打折，还可以退换。 Xiànzài dǎzhé, hái kěyǐ tuìhuàn. (Đang giảm giá, còn đổi trả được.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> Bổ ngữ khả năng đặt 得 (được) hoặc 不 (không) giữa động từ và kết quả: 买得起 (mua nổi) và 买不起 (không mua nổi). Không dùng 能 kèm theo nó.</div>`,
  ]]);

const b3q = quiz('chi321-quiz-3', 'Quiz 3 — Shopping &amp; comparison|||Quiz 3 — Mua sắm &amp; so sánh', [
  { id: 'q1', question: '"买不起" (mǎi bù qǐ) nghĩa là? / What does 买不起 mean?', options: ['không muốn mua|||do not want to buy', 'mua không nổi (không đủ tiền)|||cannot afford', 'đã mua rồi|||already bought', 'mua rất nhiều|||buy a lot'], correctIndex: 1, explanation: '买得起 = mua nổi, 买不起 = không mua nổi. Đây là bổ ngữ khả năng với 得 / 不.' },
  { id: 'q2', question: 'Phân biệt 退 và 换? / Tell 退 from 换?', options: ['退 là đổi cái khác, 换 là trả lấy tiền|||退 exchange, 换 refund', '退 là trả lại lấy tiền, 换 là đổi cái khác|||退 return for refund, 换 exchange for another', 'Hai từ giống nhau|||both the same', '退 là mua, 换 là bán|||退 buy, 换 sell'], correctIndex: 1, explanation: '退 = trả lại lấy tiền; 换 = đổi lấy cái khác. Ghép lại 退换 = đổi trả.' },
  { id: 'q3', question: '"这个牌子比较贵" nghĩa là? / What does 这个牌子比较贵 mean?', options: ['Nhãn này rất rẻ|||this brand is very cheap', 'Nhãn này khá đắt|||this brand is rather expensive', 'Nhãn này không có hàng|||this brand is out of stock', 'Nhãn này chất lượng kém|||this brand is low quality'], correctIndex: 1, explanation: '比较 đứng trước tính từ nghĩa là tương đối / khá: 比较贵 = khá đắt.' },
]);

const b4 = doc('chi321-4-1-traffic-directions', 'Lesson 4 — Traffic &amp; directions|||Bài 4 — Giao thông &amp; chỉ đường',
  'Từ vựng: 堵车, 地铁, 打车, 迷路, 拐, 路口, 方向, 地图, 附近. Ngữ pháp: bổ ngữ khả năng 找得到/找不到, 往…拐 (rẽ về…), 一…就 (hễ…là…).',
  [[
    `<span class="eyebrow">CHI321 · Lesson 4 · Traffic</span>
<h2>Traffic &amp; directions (交通和问路)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>堵车</td><td>dǔchē</td><td>traffic jam</td></tr>
<tr><td>地铁</td><td>dìtiě</td><td>subway / metro</td></tr>
<tr><td>打车</td><td>dǎchē</td><td>to take a taxi</td></tr>
<tr><td>迷路</td><td>mílù</td><td>to get lost</td></tr>
<tr><td>拐</td><td>guǎi</td><td>to turn</td></tr>
<tr><td>路口</td><td>lùkǒu</td><td>intersection</td></tr>
<tr><td>方向</td><td>fāngxiàng</td><td>direction</td></tr>
<tr><td>地图</td><td>dìtú</td><td>map</td></tr>
<tr><td>附近</td><td>fùjìn</td><td>nearby</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>Potential complement 找得到 / 找不到</strong>: 有地图就<strong>找得到</strong> (with a map you can find it); 没有地图<strong>找不到</strong> (without a map you cannot find it).</li>
<li><strong>往 … 拐</strong> = turn toward: 往左<strong>拐</strong> (turn left), 往右<strong>拐</strong> (turn right); 一直走 (go straight).</li>
<li><strong>一 … 就 …</strong> = as soon as: 一出地铁站<strong>就</strong>到了 (as soon as you leave the subway station you are there).</li>
<li><strong>堵车 vs 打车</strong>: 堵车 is a traffic jam (bad); 打车 is to hail a taxi. If 堵车, take the 地铁 (subway) instead.</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 我迷路了，找不到那家饭馆。 Wǒ mílù le, zhǎo bú dào nà jiā fànguǎn. (I am lost, I cannot find that restaurant.)
B: 在路口往左拐就到了。 Zài lùkǒu wǎng zuǒ guǎi jiù dào le. (Turn left at the intersection and you are there.)
A: 现在堵车，我打车去吧。 Xiànzài dǔchē, wǒ dǎchē qù ba. (There is a jam now, I will take a taxi.)
B: 坐地铁更快，一出站就到了。 Zuò dìtiě gèng kuài, yì chū zhàn jiù dào le. (The subway is faster, you arrive as soon as you exit.)
</code></pre>
<div class="callout"><span class="badge">Note</span> 往 sets a direction and is followed by a place or side plus a movement verb: 往前走 (go forward), 往左拐 (turn left). Do not drop the verb after the direction.</div>`,
    `<span class="eyebrow">CHI321 · Bài 4 · Giao thông</span>
<h2>Giao thông &amp; chỉ đường (交通和问路)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>堵车</td><td>dǔchē</td><td>tắc đường, kẹt xe</td></tr>
<tr><td>地铁</td><td>dìtiě</td><td>tàu điện ngầm</td></tr>
<tr><td>打车</td><td>dǎchē</td><td>bắt taxi, gọi xe</td></tr>
<tr><td>迷路</td><td>mílù</td><td>lạc đường</td></tr>
<tr><td>拐</td><td>guǎi</td><td>rẽ, quẹo</td></tr>
<tr><td>路口</td><td>lùkǒu</td><td>ngã tư, đầu đường</td></tr>
<tr><td>方向</td><td>fāngxiàng</td><td>phương hướng</td></tr>
<tr><td>地图</td><td>dìtú</td><td>bản đồ</td></tr>
<tr><td>附近</td><td>fùjìn</td><td>gần đây, lân cận</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>Bổ ngữ khả năng 找得到 / 找不到</strong>: 有地图就<strong>找得到</strong> (có bản đồ là tìm được); 没有地图<strong>找不到</strong> (không có bản đồ thì không tìm được).</li>
<li><strong>往 … 拐</strong> = rẽ về phía: 往左<strong>拐</strong> (rẽ trái), 往右<strong>拐</strong> (rẽ phải); 一直走 (đi thẳng).</li>
<li><strong>一 … 就 …</strong> = hễ … là: 一出地铁站<strong>就</strong>到了 (hễ ra khỏi ga tàu điện là tới).</li>
<li><strong>堵车 và 打车</strong>: 堵车 là tắc đường (không tốt); 打车 là gọi taxi. Nếu 堵车 thì đi 地铁 (tàu điện) cho nhanh.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 我迷路了，找不到那家饭馆。 Wǒ mílù le, zhǎo bú dào nà jiā fànguǎn. (Tôi lạc rồi, không tìm được quán ăn đó.)
B: 在路口往左拐就到了。 Zài lùkǒu wǎng zuǒ guǎi jiù dào le. (Rẽ trái ở ngã tư là tới.)
A: 现在堵车，我打车去吧。 Xiànzài dǔchē, wǒ dǎchē qù ba. (Giờ đang kẹt xe, tôi gọi taxi đi vậy.)
B: 坐地铁更快，一出站就到了。 Zuò dìtiě gèng kuài, yì chū zhàn jiù dào le. (Đi tàu điện nhanh hơn, hễ ra ga là tới.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 往 nêu hướng và theo sau là nơi chốn hoặc bên cạnh cùng một động từ di chuyển: 往前走 (đi tới trước), 往左拐 (rẽ trái). Đừng bỏ động từ sau hướng.</div>`,
  ]]);

const b4q = quiz('chi321-quiz-4', 'Quiz 4 — Traffic &amp; directions|||Quiz 4 — Giao thông &amp; chỉ đường', [
  { id: 'q1', question: '"往左拐" (wǎng zuǒ guǎi) nghĩa là? / What does 往左拐 mean?', options: ['đi thẳng|||go straight', 'rẽ trái|||turn left', 'quay lại|||turn back', 'dừng lại|||stop'], correctIndex: 1, explanation: '往 (về phía) + 左 (trái) + 拐 (rẽ) = rẽ trái. 往右拐 = rẽ phải.' },
  { id: 'q2', question: '"找不到" (zhǎo bú dào) nghĩa là? / What does 找不到 mean?', options: ['tìm được|||can find', 'không tìm được|||cannot find', 'không muốn tìm|||do not want to look', 'tìm thấy rồi|||already found'], correctIndex: 1, explanation: '找得到 = tìm được; 找不到 = không tìm được. Bổ ngữ khả năng với 得 / 不.' },
  { id: 'q3', question: 'Khi 堵车 (kẹt xe) nên đi bằng gì cho nhanh? / When there is a jam, what is faster?', options: ['打车 dǎchē (taxi)', '地铁 dìtiě (tàu điện ngầm)', '迷路 mílù', '路口 lùkǒu'], correctIndex: 1, explanation: 'Khi 堵车 thì 地铁 (tàu điện ngầm) nhanh hơn: 一出站就到了.' },
]);

const b5 = doc('chi321-5-1-health-sports', 'Lesson 5 — Health &amp; sports|||Bài 5 — Sức khỏe &amp; thể thao',
  'Từ vựng: 锻炼, 减肥, 受伤, 坚持, 习惯, 健康, 运动, 累, 撞. Ngữ pháp: câu bị động 被 (被车撞伤了), 越…越 (càng…càng), 坚持 + động từ.',
  [[
    `<span class="eyebrow">CHI321 · Lesson 5 · Health &amp; sports</span>
<h2>Health &amp; sports (锻炼和健康)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>锻炼</td><td>duànliàn</td><td>to exercise / work out</td></tr>
<tr><td>减肥</td><td>jiǎnféi</td><td>to lose weight</td></tr>
<tr><td>受伤</td><td>shòushāng</td><td>to get injured</td></tr>
<tr><td>坚持</td><td>jiānchí</td><td>to keep at it / persist</td></tr>
<tr><td>习惯</td><td>xíguàn</td><td>habit; to be used to</td></tr>
<tr><td>健康</td><td>jiànkāng</td><td>healthy; health</td></tr>
<tr><td>运动</td><td>yùndòng</td><td>sports; to exercise</td></tr>
<tr><td>累</td><td>lèi</td><td>tired</td></tr>
<tr><td>撞</td><td>zhuàng</td><td>to hit / crash into</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>The 被 passive</strong>: subject + 被 + doer + verb + result — 他<strong>被</strong>车<strong>撞</strong>伤了 (he was hit and hurt by a car). The doer can be dropped: 他被撞伤了.</li>
<li><strong>越 … 越 …</strong> = the more … the more: 越<strong>锻炼</strong>越<strong>健康</strong> (the more you exercise the healthier you get).</li>
<li><strong>坚持 jiānchí</strong> = to keep doing: 我<strong>坚持</strong>每天运动 (I keep exercising every day).</li>
<li><strong>受伤 shòushāng</strong> = to get hurt: 运动的时候小心，别<strong>受伤</strong> (be careful when you exercise, do not get hurt).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 你为什么每天锻炼？ Nǐ wèishénme měitiān duànliàn? (Why do you exercise every day?)
B: 为了减肥，也为了健康。 Wèile jiǎnféi, yě wèile jiànkāng. (To lose weight and to be healthy.)
A: 越锻炼越健康，可是别太累。 Yuè duànliàn yuè jiànkāng, kěshì bié tài lèi. (The more you train the healthier, but do not overdo it.)
B: 昨天我朋友被车撞伤了，要小心。 Zuótiān wǒ péngyou bèi chē zhuàng shāng le, yào xiǎoxīn. (My friend was hit by a car yesterday, we must be careful.)
</code></pre>
<div class="callout"><span class="badge">Note</span> The 被 passive usually reports something unfortunate. The verb needs a result after it: 被撞<strong>伤</strong>了 (hurt), 被吃<strong>完</strong>了 (all eaten up).</div>`,
    `<span class="eyebrow">CHI321 · Bài 5 · Sức khỏe</span>
<h2>Sức khỏe &amp; thể thao (锻炼和健康)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>锻炼</td><td>duànliàn</td><td>rèn luyện, tập luyện</td></tr>
<tr><td>减肥</td><td>jiǎnféi</td><td>giảm cân</td></tr>
<tr><td>受伤</td><td>shòushāng</td><td>bị thương</td></tr>
<tr><td>坚持</td><td>jiānchí</td><td>kiên trì, giữ vững</td></tr>
<tr><td>习惯</td><td>xíguàn</td><td>thói quen; quen</td></tr>
<tr><td>健康</td><td>jiànkāng</td><td>khỏe mạnh; sức khỏe</td></tr>
<tr><td>运动</td><td>yùndòng</td><td>vận động, thể thao</td></tr>
<tr><td>累</td><td>lèi</td><td>mệt</td></tr>
<tr><td>撞</td><td>zhuàng</td><td>đâm, va</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>Câu bị động 被</strong>: chủ ngữ + 被 + tác nhân + động từ + kết quả — 他<strong>被</strong>车<strong>撞</strong>伤了 (anh ấy bị xe đâm bị thương). Có thể bỏ tác nhân: 他被撞伤了.</li>
<li><strong>越 … 越 …</strong> = càng … càng: 越<strong>锻炼</strong>越<strong>健康</strong> (càng tập luyện càng khỏe).</li>
<li><strong>坚持 jiānchí</strong> = kiên trì làm: 我<strong>坚持</strong>每天运动 (tôi kiên trì vận động mỗi ngày).</li>
<li><strong>受伤 shòushāng</strong> = bị thương: 运动的时候小心，别<strong>受伤</strong> (khi vận động cẩn thận, đừng bị thương).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 你为什么每天锻炼？ Nǐ wèishénme měitiān duànliàn? (Sao bạn tập luyện mỗi ngày vậy?)
B: 为了减肥，也为了健康。 Wèile jiǎnféi, yě wèile jiànkāng. (Để giảm cân và để khỏe.)
A: 越锻炼越健康，可是别太累。 Yuè duànliàn yuè jiànkāng, kěshì bié tài lèi. (Càng tập càng khỏe, nhưng đừng quá mệt.)
B: 昨天我朋友被车撞伤了，要小心。 Zuótiān wǒ péngyou bèi chē zhuàng shāng le, yào xiǎoxīn. (Hôm qua bạn tôi bị xe đâm bị thương, phải cẩn thận.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> Câu bị động 被 thường nói về điều không may. Sau động từ phải có kết quả: 被撞<strong>伤</strong>了 (bị thương), 被吃<strong>完</strong>了 (bị ăn hết).</div>`,
  ]]);

const b5q = quiz('chi321-quiz-5', 'Quiz 5 — Health &amp; sports|||Quiz 5 — Sức khỏe &amp; thể thao', [
  { id: 'q1', question: 'Câu 他被车撞伤了 nghĩa là? / What does 他被车撞伤了 mean?', options: ['Anh ấy đâm vào xe|||he hit a car', 'Anh ấy bị xe đâm bị thương|||he was hit and hurt by a car', 'Anh ấy lái xe|||he drives a car', 'Anh ấy sửa xe|||he fixes a car'], correctIndex: 1, explanation: 'Câu bị động 被: chủ ngữ + 被 + tác nhân + động từ + kết quả. 被车撞伤了 = bị xe đâm bị thương.' },
  { id: 'q2', question: 'Mẫu "越…越…" nghĩa là? / What does 越…越… mean?', options: ['càng … càng …|||the more … the more …', 'không những … mà còn …|||not only … but also …', 'tuy … nhưng …|||although … but …', 'ngoài … ra …|||besides …'], correctIndex: 0, explanation: '越…越… = càng … càng: 越锻炼越健康 = càng tập luyện càng khỏe.' },
  { id: 'q3', question: '"坚持每天运动" nghĩa là? / What does 坚持每天运动 mean?', options: ['thỉnh thoảng vận động|||exercise sometimes', 'kiên trì vận động mỗi ngày|||keep exercising every day', 'không vận động|||do not exercise', 'muốn vận động|||want to exercise'], correctIndex: 1, explanation: '坚持 = kiên trì, giữ vững thói quen: 坚持每天运动 = kiên trì vận động mỗi ngày.' },
]);

const b6 = doc('chi321-6-1-part-time-job', 'Lesson 6 — Applying for a part-time job|||Bài 6 — Xin việc làm thêm',
  'Từ vựng: 打工, 应聘, 经验, 工资, 面试, 机会, 简历, 招聘, 虽然. Ngữ pháp: 虽然…但是 (tuy…nhưng), 应聘/面试, 为了 (để).',
  [[
    `<span class="eyebrow">CHI321 · Lesson 6 · Part-time job</span>
<h2>Applying for a part-time job (打工应聘)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>打工</td><td>dǎgōng</td><td>to work part-time</td></tr>
<tr><td>应聘</td><td>yìngpìn</td><td>to apply for a job</td></tr>
<tr><td>经验</td><td>jīngyàn</td><td>experience</td></tr>
<tr><td>工资</td><td>gōngzī</td><td>salary / wage</td></tr>
<tr><td>面试</td><td>miànshì</td><td>interview</td></tr>
<tr><td>机会</td><td>jīhuì</td><td>opportunity</td></tr>
<tr><td>简历</td><td>jiǎnlì</td><td>resume / CV</td></tr>
<tr><td>招聘</td><td>zhāopìn</td><td>to recruit</td></tr>
<tr><td>虽然</td><td>suīrán</td><td>although</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>虽然 … 但是 …</strong> = although: <strong>虽然</strong>工资不高，<strong>但是</strong>能积累经验 (although the wage is not high, you gain experience).</li>
<li><strong>应聘 vs 招聘</strong>: 应聘 is what the applicant does (apply); 招聘 is what the company does (recruit).</li>
<li><strong>为了 wèile</strong> = in order to: <strong>为了</strong>面试，我准备了简历 (I prepared a resume for the interview).</li>
<li><strong>机会 jīhuì</strong> = chance: 这是一个好<strong>机会</strong> (this is a good opportunity).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 这家公司在招聘，你想去打工吗？ Zhè jiā gōngsī zài zhāopìn, nǐ xiǎng qù dǎgōng ma? (This company is recruiting, do you want a part-time job?)
B: 想，虽然工资不高，但是能积累经验。 Xiǎng, suīrán gōngzī bù gāo, dànshì néng jīlěi jīngyàn. (Yes, although the wage is low, I gain experience.)
A: 你准备好简历了吗？ Nǐ zhǔnbèi hǎo jiǎnlì le ma? (Have you prepared your resume?)
B: 准备好了，下午就去面试。 Zhǔnbèi hǎo le, xiàwǔ jiù qù miànshì. (Yes, I go for the interview this afternoon.)
</code></pre>
<div class="callout"><span class="badge">Note</span> 虽然 … 但是 … pairs up: 虽然 opens the concession, 但是 (or 可是) opens the contrast. You may drop 虽然 but keep 但是.</div>`,
    `<span class="eyebrow">CHI321 · Bài 6 · Việc làm thêm</span>
<h2>Xin việc làm thêm (打工应聘)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>打工</td><td>dǎgōng</td><td>làm thêm, đi làm</td></tr>
<tr><td>应聘</td><td>yìngpìn</td><td>ứng tuyển, xin việc</td></tr>
<tr><td>经验</td><td>jīngyàn</td><td>kinh nghiệm</td></tr>
<tr><td>工资</td><td>gōngzī</td><td>lương, tiền công</td></tr>
<tr><td>面试</td><td>miànshì</td><td>phỏng vấn</td></tr>
<tr><td>机会</td><td>jīhuì</td><td>cơ hội</td></tr>
<tr><td>简历</td><td>jiǎnlì</td><td>sơ yếu lý lịch, CV</td></tr>
<tr><td>招聘</td><td>zhāopìn</td><td>tuyển dụng</td></tr>
<tr><td>虽然</td><td>suīrán</td><td>tuy, mặc dù</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>虽然 … 但是 …</strong> = tuy … nhưng: <strong>虽然</strong>工资不高，<strong>但是</strong>能积累经验 (tuy lương không cao, nhưng tích lũy được kinh nghiệm).</li>
<li><strong>应聘 và 招聘</strong>: 应聘 là việc của người xin (ứng tuyển); 招聘 là việc của công ty (tuyển dụng).</li>
<li><strong>为了 wèile</strong> = để, vì: <strong>为了</strong>面试，我准备了简历 (để phỏng vấn, tôi chuẩn bị CV).</li>
<li><strong>机会 jīhuì</strong> = cơ hội: 这是一个好<strong>机会</strong> (đây là một cơ hội tốt).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 这家公司在招聘，你想去打工吗？ Zhè jiā gōngsī zài zhāopìn, nǐ xiǎng qù dǎgōng ma? (Công ty này đang tuyển, bạn muốn đi làm thêm không?)
B: 想，虽然工资不高，但是能积累经验。 Xiǎng, suīrán gōngzī bù gāo, dànshì néng jīlěi jīngyàn. (Muốn, tuy lương không cao nhưng tích lũy được kinh nghiệm.)
A: 你准备好简历了吗？ Nǐ zhǔnbèi hǎo jiǎnlì le ma? (Bạn chuẩn bị CV xong chưa?)
B: 准备好了，下午就去面试。 Zhǔnbèi hǎo le, xiàwǔ jiù qù miànshì. (Xong rồi, chiều nay đi phỏng vấn luôn.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 虽然 … 但是 … đi thành cặp: 虽然 mở phần nhượng bộ, 但是 (hoặc 可是) mở phần tương phản. Có thể bỏ 虽然 nhưng giữ 但是.</div>`,
  ]]);

const b6q = quiz('chi321-quiz-6', 'Quiz 6 — Applying for a part-time job|||Quiz 6 — Xin việc làm thêm', [
  { id: 'q1', question: 'Mẫu "虽然…但是…" nghĩa là? / What does 虽然…但是… mean?', options: ['ngoài … ra …|||besides …', 'tuy … nhưng …|||although … but …', 'càng … càng …|||the more … the more …', 'hễ … là …|||as soon as …'], correctIndex: 1, explanation: '虽然…但是… = tuy … nhưng: 虽然工资不高，但是能积累经验.' },
  { id: 'q2', question: 'Phân biệt 应聘 và 招聘? / Tell 应聘 from 招聘?', options: ['应聘 là công ty tuyển, 招聘 là người xin|||应聘 company recruits, 招聘 person applies', '应聘 là người xin việc, 招聘 là công ty tuyển|||应聘 person applies, 招聘 company recruits', 'Hai từ giống nhau|||both the same', '应聘 là lương, 招聘 là CV|||应聘 salary, 招聘 resume'], correctIndex: 1, explanation: '应聘 = ứng tuyển (người xin); 招聘 = tuyển dụng (công ty).' },
  { id: 'q3', question: '"面试" (miànshì) nghĩa là? / What does 面试 mean?', options: ['lương|||salary', 'phỏng vấn|||interview', 'kinh nghiệm|||experience', 'cơ hội|||opportunity'], correctIndex: 1, explanation: '面试 = phỏng vấn xin việc; thường cần chuẩn bị 简历 (CV) trước.' },
]);

const b7 = doc('chi321-7-1-festivals', 'Lesson 7 — Birthdays &amp; festivals|||Bài 7 — Sinh nhật &amp; lễ hội',
  'Từ vựng: 过节, 礼物, 热闹, 传统, 习俗, 生日, 庆祝, 邀请, 节日. Ngữ pháp: 不但…而且 (không những…mà còn), 给…送礼物, 热闹/传统.',
  [[
    `<span class="eyebrow">CHI321 · Lesson 7 · Festivals</span>
<h2>Birthdays &amp; festivals (生日和节日)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>过节</td><td>guòjié</td><td>to celebrate a festival</td></tr>
<tr><td>礼物</td><td>lǐwù</td><td>gift</td></tr>
<tr><td>热闹</td><td>rènao</td><td>lively / bustling</td></tr>
<tr><td>传统</td><td>chuántǒng</td><td>tradition; traditional</td></tr>
<tr><td>习俗</td><td>xísú</td><td>custom</td></tr>
<tr><td>生日</td><td>shēngrì</td><td>birthday</td></tr>
<tr><td>庆祝</td><td>qìngzhù</td><td>to celebrate</td></tr>
<tr><td>邀请</td><td>yāoqǐng</td><td>to invite</td></tr>
<tr><td>节日</td><td>jiérì</td><td>festival / holiday</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>不但 … 而且 …</strong> = not only … but also: 春节<strong>不但</strong>热闹<strong>而且</strong>有很多传统习俗 (Spring Festival is not only lively but also has many traditions).</li>
<li><strong>给 … 送礼物</strong>: 我<strong>给</strong>朋友<strong>送</strong>了一件生日礼物 (I gave my friend a birthday gift).</li>
<li><strong>邀请 yāoqǐng</strong> = to invite: 我<strong>邀请</strong>你来参加我的生日 (I invite you to my birthday).</li>
<li><strong>庆祝 qìngzhù</strong> = to celebrate: 大家一起<strong>庆祝</strong>节日 (everyone celebrates the festival together).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 这个周末是我的生日，邀请你来。 Zhège zhōumò shì wǒ de shēngrì, yāoqǐng nǐ lái. (This weekend is my birthday, I invite you.)
B: 好，我给你送一件礼物。 Hǎo, wǒ gěi nǐ sòng yí jiàn lǐwù. (Great, I will bring you a gift.)
A: 我们一起庆祝，一定很热闹。 Wǒmen yìqǐ qìngzhù, yídìng hěn rènao. (We celebrate together, it will be lively.)
B: 中国过节不但热闹，而且有很多传统习俗。 Zhōngguó guòjié búdàn rènao, érqiě yǒu hěn duō chuántǒng xísú. (Chinese festivals are lively and full of traditions.)
</code></pre>
<div class="callout"><span class="badge">Note</span> 不但 … 而且 … adds a second point in the same direction. 而且 can be followed by 还 or 也 for emphasis: 不但便宜，而且质量也好.</div>`,
    `<span class="eyebrow">CHI321 · Bài 7 · Lễ hội</span>
<h2>Sinh nhật &amp; lễ hội (生日和节日)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>过节</td><td>guòjié</td><td>đón lễ, ăn lễ Tết</td></tr>
<tr><td>礼物</td><td>lǐwù</td><td>quà, quà tặng</td></tr>
<tr><td>热闹</td><td>rènao</td><td>náo nhiệt, nhộn nhịp</td></tr>
<tr><td>传统</td><td>chuántǒng</td><td>truyền thống</td></tr>
<tr><td>习俗</td><td>xísú</td><td>phong tục</td></tr>
<tr><td>生日</td><td>shēngrì</td><td>sinh nhật</td></tr>
<tr><td>庆祝</td><td>qìngzhù</td><td>chúc mừng, tổ chức mừng</td></tr>
<tr><td>邀请</td><td>yāoqǐng</td><td>mời</td></tr>
<tr><td>节日</td><td>jiérì</td><td>ngày lễ, lễ hội</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>不但 … 而且 …</strong> = không những … mà còn: 春节<strong>不但</strong>热闹<strong>而且</strong>有很多传统习俗 (Tết Nguyên đán không những náo nhiệt mà còn có nhiều phong tục truyền thống).</li>
<li><strong>给 … 送礼物</strong>: 我<strong>给</strong>朋友<strong>送</strong>了一件生日礼物 (tôi tặng bạn một món quà sinh nhật).</li>
<li><strong>邀请 yāoqǐng</strong> = mời: 我<strong>邀请</strong>你来参加我的生日 (tôi mời bạn tới dự sinh nhật của tôi).</li>
<li><strong>庆祝 qìngzhù</strong> = tổ chức mừng: 大家一起<strong>庆祝</strong>节日 (mọi người cùng mừng ngày lễ).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 这个周末是我的生日，邀请你来。 Zhège zhōumò shì wǒ de shēngrì, yāoqǐng nǐ lái. (Cuối tuần này là sinh nhật tôi, mời bạn tới.)
B: 好，我给你送一件礼物。 Hǎo, wǒ gěi nǐ sòng yí jiàn lǐwù. (Được, tôi tặng bạn một món quà.)
A: 我们一起庆祝，一定很热闹。 Wǒmen yìqǐ qìngzhù, yídìng hěn rènao. (Chúng ta cùng mừng, chắc chắn rất vui.)
B: 中国过节不但热闹，而且有很多传统习俗。 Zhōngguó guòjié búdàn rènao, érqiě yǒu hěn duō chuántǒng xísú. (Lễ Tết Trung Quốc không những náo nhiệt mà còn nhiều phong tục truyền thống.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 不但 … 而且 … thêm một ý cùng chiều. 而且 có thể đi với 还 hoặc 也 để nhấn mạnh: 不但便宜，而且质量也好.</div>`,
  ]]);

const b7q = quiz('chi321-quiz-7', 'Quiz 7 — Birthdays &amp; festivals|||Quiz 7 — Sinh nhật &amp; lễ hội', [
  { id: 'q1', question: 'Mẫu "不但…而且…" nghĩa là? / What does 不但…而且… mean?', options: ['tuy … nhưng …|||although … but …', 'không những … mà còn …|||not only … but also …', 'nếu … thì …|||if … then …', 'càng … càng …|||the more … the more …'], correctIndex: 1, explanation: '不但…而且… = không những … mà còn: 不但热闹，而且有很多传统习俗.' },
  { id: 'q2', question: '"给朋友送礼物" nghĩa là? / What does 给朋友送礼物 mean?', options: ['nhận quà từ bạn|||get a gift from a friend', 'tặng quà cho bạn|||give a gift to a friend', 'mua quà cho mình|||buy a gift for oneself', 'trả lại quà|||return a gift'], correctIndex: 1, explanation: '给 (cho) + 朋友 + 送礼物 = tặng quà cho bạn.' },
  { id: 'q3', question: '"热闹" (rènao) nghĩa là? / What does 热闹 mean?', options: ['yên tĩnh|||quiet', 'náo nhiệt, nhộn nhịp|||lively / bustling', 'lạnh lẽo|||cold', 'buồn chán|||boring'], correctIndex: 1, explanation: '热闹 = náo nhiệt, đông vui: 节日很热闹 = ngày lễ rất nhộn nhịp.' },
]);

const b8 = doc('chi321-8-1-future-plans', 'Lesson 8 — Future plans|||Bài 8 — Kế hoạch tương lai',
  'Từ vựng: 打算, 将来, 毕业, 出国, 希望, 计划, 留学, 努力, 梦想. Ngữ pháp: 打算/希望 + động từ, 一…就 (hễ…là…), 越来越 (càng ngày càng).',
  [[
    `<span class="eyebrow">CHI321 · Lesson 8 · Future plans</span>
<h2>Future plans (将来的打算)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>打算</td><td>dǎsuàn</td><td>to plan / intend</td></tr>
<tr><td>将来</td><td>jiānglái</td><td>the future</td></tr>
<tr><td>毕业</td><td>bìyè</td><td>to graduate</td></tr>
<tr><td>出国</td><td>chūguó</td><td>to go abroad</td></tr>
<tr><td>希望</td><td>xīwàng</td><td>to hope; hope</td></tr>
<tr><td>计划</td><td>jìhuà</td><td>plan; to plan</td></tr>
<tr><td>留学</td><td>liúxué</td><td>to study abroad</td></tr>
<tr><td>努力</td><td>nǔlì</td><td>to work hard</td></tr>
<tr><td>梦想</td><td>mèngxiǎng</td><td>dream / aspiration</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>打算 / 希望 + verb</strong>: 毕业以后我<strong>打算</strong>出国留学 (after graduating I plan to study abroad); 我<strong>希望</strong>将来能实现梦想 (I hope to realize my dream in the future).</li>
<li><strong>一 … 就 …</strong> = as soon as: 我<strong>一</strong>毕业<strong>就</strong>去工作 (as soon as I graduate I will start work).</li>
<li><strong>越来越 + adjective</strong>: 我的汉语<strong>越来越</strong>好 (my Chinese is getting better and better).</li>
<li><strong>努力 nǔlì</strong> = to work hard: 只要<strong>努力</strong>，梦想一定能实现 (as long as you work hard, dreams come true).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 毕业以后你有什么打算？ Bìyè yǐhòu nǐ yǒu shénme dǎsuàn? (What are your plans after graduation?)
B: 我打算出国留学。 Wǒ dǎsuàn chūguó liúxué. (I plan to study abroad.)
A: 太好了！我希望将来也能出国。 Tài hǎo le! Wǒ xīwàng jiānglái yě néng chūguó. (Great! I hope to go abroad in the future too.)
B: 只要努力，梦想一定能实现。 Zhǐyào nǔlì, mèngxiǎng yídìng néng shíxiàn. (As long as we work hard, our dreams come true.)
</code></pre>
<div class="callout"><span class="badge">Note</span> 打算 and 计划 both mean to plan, but 打算 is more spoken and personal, while 计划 is more formal and can be a noun (a written plan). 将来 (the future) sets the time frame.</div>`,
    `<span class="eyebrow">CHI321 · Bài 8 · Tương lai</span>
<h2>Kế hoạch tương lai (将来的打算)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>打算</td><td>dǎsuàn</td><td>dự định, tính</td></tr>
<tr><td>将来</td><td>jiānglái</td><td>tương lai</td></tr>
<tr><td>毕业</td><td>bìyè</td><td>tốt nghiệp</td></tr>
<tr><td>出国</td><td>chūguó</td><td>ra nước ngoài</td></tr>
<tr><td>希望</td><td>xīwàng</td><td>hy vọng, mong</td></tr>
<tr><td>计划</td><td>jìhuà</td><td>kế hoạch; lên kế hoạch</td></tr>
<tr><td>留学</td><td>liúxué</td><td>du học</td></tr>
<tr><td>努力</td><td>nǔlì</td><td>nỗ lực, cố gắng</td></tr>
<tr><td>梦想</td><td>mèngxiǎng</td><td>ước mơ</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>打算 / 希望 + động từ</strong>: 毕业以后我<strong>打算</strong>出国留学 (sau khi tốt nghiệp tôi định đi du học); 我<strong>希望</strong>将来能实现梦想 (tôi hy vọng tương lai thực hiện được ước mơ).</li>
<li><strong>一 … 就 …</strong> = hễ … là: 我<strong>一</strong>毕业<strong>就</strong>去工作 (hễ tốt nghiệp là tôi đi làm).</li>
<li><strong>越来越 + tính từ</strong>: 我的汉语<strong>越来越</strong>好 (tiếng Trung của tôi càng ngày càng giỏi).</li>
<li><strong>努力 nǔlì</strong> = nỗ lực: 只要<strong>努力</strong>，梦想一定能实现 (chỉ cần cố gắng, ước mơ nhất định thành hiện thực).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 毕业以后你有什么打算？ Bìyè yǐhòu nǐ yǒu shénme dǎsuàn? (Sau tốt nghiệp bạn có dự định gì?)
B: 我打算出国留学。 Wǒ dǎsuàn chūguó liúxué. (Tôi định đi du học nước ngoài.)
A: 太好了！我希望将来也能出国。 Tài hǎo le! Wǒ xīwàng jiānglái yě néng chūguó. (Tuyệt quá! Tôi cũng mong tương lai ra nước ngoài được.)
B: 只要努力，梦想一定能实现。 Zhǐyào nǔlì, mèngxiǎng yídìng néng shíxiàn. (Chỉ cần cố gắng, ước mơ nhất định thành hiện thực.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 打算 và 计划 đều nghĩa là dự định, nhưng 打算 thiên về khẩu ngữ và cá nhân, còn 计划 trang trọng hơn và có thể là danh từ (bản kế hoạch). 将来 (tương lai) nêu mốc thời gian.</div>`,
  ]]);

const b8q = quiz('chi321-quiz-8', 'Quiz 8 — Future plans|||Quiz 8 — Kế hoạch tương lai', [
  { id: 'q1', question: '"我打算出国留学" nghĩa là? / What does 我打算出国留学 mean?', options: ['Tôi đã đi du học|||I already studied abroad', 'Tôi định ra nước ngoài du học|||I plan to study abroad', 'Tôi không muốn du học|||I do not want to study abroad', 'Tôi đang du học|||I am studying abroad now'], correctIndex: 1, explanation: '打算 + động từ = dự định: 打算出国留学 = định ra nước ngoài du học.' },
  { id: 'q2', question: 'Câu 我一毕业就去工作 nghĩa là? / What does 我一毕业就去工作 mean?', options: ['Tôi không đi làm|||I will not work', 'Hễ tốt nghiệp là tôi đi làm|||as soon as I graduate I will work', 'Tôi vừa học vừa làm|||I study and work', 'Tôi tốt nghiệp lâu rồi|||I graduated long ago'], correctIndex: 1, explanation: '一…就… = hễ … là: 一毕业就去工作 = hễ tốt nghiệp là đi làm.' },
  { id: 'q3', question: '"希望" (xīwàng) nghĩa là? / What does 希望 mean?', options: ['thất vọng|||to despair', 'hy vọng, mong|||to hope', 'quyết định|||to decide', 'nghi ngờ|||to doubt'], correctIndex: 1, explanation: '希望 = hy vọng, mong: 我希望将来能出国 = tôi mong tương lai ra nước ngoài được.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'CHI321',
    slug: 'chi321-integrated-chinese-4',
    title: 'Integrated Chinese 4',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CHI321.webp',
    shortDescription: 'Integrated Chinese 4 (continues CHI311, HSK3) — new semester, dorm & moving, shopping, traffic & directions, health & sports, part-time jobs, festivals and future plans. Bilingual vocab, grammar, dialogues & quizzes.|||Tiếng Trung tổng hợp 4 (nối tiếp CHI311, HSK3) — khai giảng, ký túc & chuyển nhà, mua sắm, giao thông & chỉ đường, sức khỏe & thể thao, việc làm thêm, lễ hội và kế hoạch tương lai. Song ngữ từ vựng, ngữ pháp, hội thoại & quiz.',
    description: 'Môn <strong>CHI321 — Integrated Chinese 4 (Tiếng Trung tổng hợp 4)</strong> <strong>nối tiếp CHI311</strong> trên track <strong>Integrated Chinese</strong> (Liu et al., Cheng &amp; Tsui), đưa bạn lên mức tương đương HSK3. Học tiếp qua các chủ đề đời sống mở rộng: <strong>khai giảng &amp; chọn môn</strong> → <strong>ký túc &amp; chuyển nhà</strong> → <strong>mua sắm &amp; so sánh</strong> → <strong>giao thông &amp; chỉ đường</strong> → <strong>sức khỏe &amp; thể thao</strong> → <strong>việc làm thêm</strong> → <strong>sinh nhật &amp; lễ hội</strong> → <strong>kế hoạch tương lai</strong>. Song ngữ Trung–Việt, mỗi bài có bảng từ vựng (汉字 | pinyin | nghĩa), điểm ngữ pháp kèm ví dụ, hội thoại ngắn, ghi chú và quiz.',
    whatYouLearn: 'Khai giảng &amp; chọn môn (开学, 学期, 选课, 专业, 打算/决定, 除了…以外); ký túc &amp; chuyển nhà (宿舍, 搬家, 家具, 整齐/干净, câu chữ 把); mua sắm &amp; so sánh (质量, 牌子, 比较, 退换, 打折, bổ ngữ khả năng 买不起, 越来越); giao thông &amp; chỉ đường (堵车, 地铁, 打车, 迷路, 往…拐, 找得到/找不到, 一…就); sức khỏe &amp; thể thao (锻炼, 减肥, 受伤, 坚持, câu bị động 被, 越…越); việc làm thêm (打工, 应聘, 面试, 工资, 简历, 虽然…但是); sinh nhật &amp; lễ hội (过节, 礼物, 热闹, 传统, 习俗, 不但…而且); kế hoạch tương lai (打算, 将来, 毕业, 出国, 留学, 希望).',
    requirements: 'Cần hoàn thành CHI311 hoặc nắm vững pinyin, 4 thanh điệu, bổ ngữ kết quả (听懂/看懂), bổ ngữ trình độ với 得 (考得好), các mẫu 一…就 và 越来越, cùng từ vựng sinh hoạt, sức khỏe và du lịch. Nên cài Pleco hoặc dùng từ điển hanzii.net để tra chữ &amp; nghe phát âm; luyện viết chữ Hán theo thứ tự nét.',
  },
  sections: [
    { title: '📚 Tài liệu &amp; lộ trình|||📚 Course materials', description: 'Giáo trình Integrated Chinese (Level 2 Part 1), workbook, app, từ điển, YouTube, lộ trình 4 bước.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Nối tiếp CHI311, track Integrated Chinese, mục tiêu HSK3, cách học.', lessons: [intro] },
    { title: 'Bài 1 — Khai giảng &amp; học kỳ|||Lesson 1 — New semester &amp; courses', description: '开学, 学期, 选课, 专业, 打算/决定, 除了…以外.', lessons: [b1, b1q] },
    { title: 'Bài 2 — Ở ký túc &amp; chuyển nhà|||Lesson 2 — Dorm life &amp; moving', description: '宿舍, 搬家, 家具, 整齐/干净, câu chữ 把.', lessons: [b2, b2q] },
    { title: 'Bài 3 — Mua sắm &amp; so sánh|||Lesson 3 — Shopping &amp; comparison', description: '质量, 牌子, 比较, 退换, 打折, 买不起, 越来越.', lessons: [b3, b3q] },
    { title: 'Bài 4 — Giao thông &amp; chỉ đường|||Lesson 4 — Traffic &amp; directions', description: '堵车, 地铁, 打车, 迷路, 往…拐, 找得到/找不到.', lessons: [b4, b4q] },
    { title: 'Bài 5 — Sức khỏe &amp; thể thao|||Lesson 5 — Health &amp; sports', description: '锻炼, 减肥, 受伤, 坚持, câu bị động 被, 越…越.', lessons: [b5, b5q] },
    { title: 'Bài 6 — Xin việc làm thêm|||Lesson 6 — Part-time job', description: '打工, 应聘, 面试, 工资, 简历, 虽然…但是.', lessons: [b6, b6q] },
    { title: 'Bài 7 — Sinh nhật &amp; lễ hội|||Lesson 7 — Birthdays &amp; festivals', description: '过节, 礼物, 热闹, 传统, 习俗, 不但…而且.', lessons: [b7, b7q] },
    { title: 'Bài 8 — Kế hoạch tương lai|||Lesson 8 — Future plans', description: '打算, 将来, 毕业, 出国, 留学, 希望.', lessons: [b8, b8q] },
  ],
};
