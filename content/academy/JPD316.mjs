/**
 * JPD316 — Intermediate Japanese 1 (B1/B2, hướng N3). Giáo trình FLM (syl): tổng
 * hợp JPD113~JPD226, hoàn thiện 4 kỹ năng, đạt N3; trọng tâm "trình bày vấn đề/
 * suy nghĩ bản thân" và giao tiếp. Song ngữ VI + chữ Nhật (kanji/kana + romaji).
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('jpd316-0-1-overview', 'Course overview: Intermediate Japanese|||Tổng quan: Tiếng Nhật trung cấp',
  'Trung cấp hướng N3; tổng hợp ngữ pháp trước đó, hoàn thiện 4 kỹ năng, trọng tâm trình bày ý kiến & giao tiếp. Lộ trình: ngữ pháp trung cấp → diễn đạt ý kiến → nghe-nói-đọc-viết chủ đề.',
  [[
    `<span class="eyebrow">JPD316 · Lesson 0.1 · Overview</span>
<h2>Intermediate Japanese 1 (toward N3)</h2>
<p class="lead">This course consolidates everything from JPD113–JPD226 and pushes you toward <strong>N3</strong>. It has five lessons, each building the ability to <strong>state your own problems and opinions</strong> and to <strong>communicate and exchange</strong> with others — across listening, speaking, grammar, reading and writing.</p>
<h3>What "intermediate" adds</h3>
<p>Beyond basic sentences, you now <strong>connect ideas</strong> (because, if, even though), <strong>express opinions and reasons</strong>, and handle <strong>politeness levels</strong> — moving from "I can name things" to "I can explain and discuss."</p>
<h3>Roadmap</h3>
<p>Intermediate grammar (connectors &amp; conditionals) → expressing opinions &amp; reasons → the four skills across everyday topics. Bilingual (Vietnamese), with Japanese (kanji/kana + romaji) and practice.</p>`,
    `<span class="eyebrow">JPD316 · Bài 0.1 · Tổng quan</span>
<h2>Tiếng Nhật trung cấp 1 (hướng N3)</h2>
<p class="lead">Môn này tổng hợp mọi thứ từ JPD113–JPD226 và đẩy bạn tới <strong>N3</strong>. Gồm năm bài, mỗi bài xây khả năng <strong>trình bày vấn đề và ý kiến của bản thân</strong> và <strong>giao tiếp, trao đổi</strong> với người khác — qua nghe, nói, ngữ pháp, đọc và viết.</p>
<h3>"Trung cấp" thêm gì</h3>
<p>Vượt câu cơ bản, giờ bạn <strong>nối các ý</strong> (vì, nếu, dù), <strong>diễn đạt ý kiến và lý do</strong>, và xử lý <strong>mức lịch sự</strong> — chuyển từ "gọi tên được" sang "giải thích và thảo luận được".</p>
<h3>Lộ trình</h3>
<p>Ngữ pháp trung cấp (từ nối &amp; điều kiện) → diễn đạt ý kiến &amp; lý do → bốn kỹ năng qua các chủ đề hằng ngày. Song ngữ (tiếng Việt), có chữ Nhật (kanji/kana + romaji) và luyện tập.</p>`,
  ]]);

const c1 = doc('jpd316-1-1-connectors-conditionals', '1.1 — Connectors & conditionals|||1.1 — Từ nối & câu điều kiện',
  'Nối câu (て-form, から/ので lý do, のに/ても nhượng bộ), các điều kiện と/たら/ば/なら và sắc thái khác nhau.',
  [[
    `<span class="eyebrow">JPD316 · Chapter 1 · Lesson 1.1</span>
<h2>Connectors &amp; conditionals</h2>
<h3>Joining ideas</h3>
<ul>
<li><strong>て-form</strong> — links actions in sequence: 起きて、食べて、行きます (okite, tabete, ikimasu = wake up, eat, then go).</li>
<li><strong>から / ので</strong> — "because": 高いから買いません (takai kara kaimasen = because it's expensive, I won't buy). ので is softer/more polite.</li>
<li><strong>のに / ても</strong> — "even though / even if": 勉強したのに、できなかった (I studied, even though — but couldn't do it).</li>
</ul>
<h3>The four conditionals</h3>
<table><thead><tr><th>Form</th><th>Nuance</th></tr></thead><tbody>
<tr><td>と</td><td>natural/automatic result ("when you do X, Y always happens")</td></tr>
<tr><td>たら</td><td>most general "if/when" (very common in speech)</td></tr>
<tr><td>ば</td><td>hypothetical "if" (conditions/general truths)</td></tr>
<tr><td>なら</td><td>"if it's the case that…" (responding to context)</td></tr>
</tbody></table>
<pre><code>雨が降ったら、行きません。
ame ga futtara, ikimasen.
= If it rains, I won't go.
</code></pre>
<div class="callout"><span class="badge">Intermediate leap</span> N3 is where the four conditionals and the nuance between から/ので and のに/ても really matter — they let you express cause, contrast and hypotheticals, not just facts.</div>`,
    `<span class="eyebrow">JPD316 · Chương 1 · Bài 1.1</span>
<h2>Từ nối &amp; câu điều kiện</h2>
<h3>Nối các ý</h3>
<ul>
<li><strong>Thể て</strong> — nối hành động theo trình tự: 起きて、食べて、行きます (okite, tabete, ikimasu = thức dậy, ăn, rồi đi).</li>
<li><strong>から / ので</strong> — "vì": 高いから買いません (takai kara kaimasen = vì đắt nên không mua). ので nhẹ/lịch sự hơn.</li>
<li><strong>のに / ても</strong> — "mặc dù / dù": 勉強したのに、できなかった (đã học vậy mà vẫn không làm được).</li>
</ul>
<h3>Bốn loại điều kiện</h3>
<table><thead><tr><th>Dạng</th><th>Sắc thái</th></tr></thead><tbody>
<tr><td>と</td><td>kết quả tự nhiên/đương nhiên ("hễ làm X là Y luôn xảy ra")</td></tr>
<tr><td>たら</td><td>"nếu/khi" chung nhất (rất hay dùng khi nói)</td></tr>
<tr><td>ば</td><td>"nếu" giả định (điều kiện/chân lý chung)</td></tr>
<tr><td>なら</td><td>"nếu là trường hợp…" (đáp lại ngữ cảnh)</td></tr>
</tbody></table>
<pre><code>雨が降ったら、行きません。
ame ga futtara, ikimasen.
= Nếu trời mưa, tôi sẽ không đi.
</code></pre>
<div class="callout"><span class="badge">Bước nhảy trung cấp</span> N3 là lúc bốn loại điều kiện và sắc thái giữa から/ので và のに/ても thực sự quan trọng — chúng cho bạn diễn đạt nguyên nhân, tương phản và giả định, không chỉ sự thật.</div>`,
  ]]);

const c1q = quiz('jpd316-quiz-1', 'Quiz 1 — Connectors & conditionals|||Quiz 1 — Từ nối & điều kiện', [
  { id: 'q1', question: '「から」/「ので」dùng để diễn đạt?', options: ['Điều kiện', 'Lý do/nguyên nhân ("vì")', 'Nhượng bộ', 'Trình tự'], correctIndex: 1, explanation: 'から/ので = "vì"; ので lịch sự/mềm hơn.' },
  { id: 'q2', question: '「勉強したのに、できなかった」— 「のに」thể hiện?', options: ['Vì', 'Mặc dù/vậy mà (nhượng bộ, kết quả trái mong đợi)', 'Nếu', 'Và'], correctIndex: 1, explanation: 'のに = "mặc dù…vậy mà", kết quả trái ngược.' },
  { id: 'q3', question: '「雨が降ったら」— 「たら」là?', options: ['Từ nối lý do', 'Điều kiện "nếu/khi" chung nhất', 'Kính ngữ', 'Quá khứ đơn'], correctIndex: 1, explanation: 'たら là điều kiện phổ biến nhất trong hội thoại.' },
]);

const c2 = doc('jpd316-2-1-opinions', '2.1 — Expressing opinions & reasons|||2.1 — Diễn đạt ý kiến & lý do',
  'Mẫu nêu ý kiến (と思います, と考えます), lý do (からです), nêu vấn đề bản thân, đồng ý/không đồng ý lịch sự.',
  [[
    `<span class="eyebrow">JPD316 · Chapter 2 · Lesson 2.1</span>
<h2>Expressing opinions &amp; reasons</h2>
<h3>Stating an opinion</h3>
<pre><code>私はこの計画に賛成だと思います。
watashi wa kono keikaku ni sansei da to omoimasu.
= I think I agree with this plan.

理由は、時間が足りないからです。
riyuu wa, jikan ga tarinai kara desu.
= The reason is that there isn't enough time.
</code></pre>
<p><strong>〜と思います (to omoimasu)</strong> = "I think…" softens a statement into an opinion. <strong>〜と考えます (to kangaemasu)</strong> is more formal. Give a reason with <strong>理由は〜からです (riyuu wa … kara desu)</strong>.</p>
<h3>Agreeing / disagreeing politely</h3>
<ul>
<li>Agree: そうですね、私もそう思います (sou desu ne, watashi mo sou omoimasu = yes, I think so too).</li>
<li>Disagree softly: なるほど、でも〜 (naruhodo, demo… = I see, but…) — acknowledge first, then differ.</li>
</ul>
<div class="callout"><span class="badge">Core skill</span> The course's central goal is presenting <em>your own</em> ideas and problems: state the opinion, back it with a reason, and respond to others' views politely. That's the jump from tourist Japanese to discussion Japanese.</div>`,
    `<span class="eyebrow">JPD316 · Chương 2 · Bài 2.1</span>
<h2>Diễn đạt ý kiến &amp; lý do</h2>
<h3>Nêu ý kiến</h3>
<pre><code>私はこの計画に賛成だと思います。
watashi wa kono keikaku ni sansei da to omoimasu.
= Tôi nghĩ tôi tán thành kế hoạch này.

理由は、時間が足りないからです。
riyuu wa, jikan ga tarinai kara desu.
= Lý do là vì không đủ thời gian.
</code></pre>
<p><strong>〜と思います (to omoimasu)</strong> = "Tôi nghĩ…" làm mềm câu thành ý kiến. <strong>〜と考えます (to kangaemasu)</strong> trang trọng hơn. Nêu lý do bằng <strong>理由は〜からです (riyuu wa … kara desu)</strong>.</p>
<h3>Đồng ý / không đồng ý lịch sự</h3>
<ul>
<li>Đồng ý: そうですね、私もそう思います (vâng, tôi cũng nghĩ vậy).</li>
<li>Không đồng ý nhẹ: なるほど、でも〜 (naruhodo, demo… = tôi hiểu, nhưng…) — công nhận trước, rồi khác đi.</li>
</ul>
<div class="callout"><span class="badge">Kỹ năng cốt lõi</span> Mục tiêu trung tâm của môn là trình bày ý tưởng và vấn đề <em>của chính bạn</em>: nêu ý kiến, chống đỡ bằng lý do, và đáp lại ý người khác lịch sự. Đó là bước nhảy từ tiếng Nhật du lịch sang tiếng Nhật thảo luận.</div>`,
  ]]);

const c2q = quiz('jpd316-quiz-2', 'Quiz 2 — Opinions|||Quiz 2 — Ý kiến', [
  { id: 'q1', question: '「〜と思います」(to omoimasu) dùng để?', options: ['Ra lệnh', 'Nêu ý kiến/suy nghĩ ("tôi nghĩ…")', 'Hỏi giờ', 'Từ chối'], correctIndex: 1, explanation: 'と思います làm mềm câu thành ý kiến cá nhân.' },
  { id: 'q2', question: 'Nêu lý do trang trọng dùng mẫu?', options: ['理由は〜からです', 'ください', 'ました', 'ですか'], correctIndex: 0, explanation: '理由は…からです = "lý do là vì…".' },
  { id: 'q3', question: 'Cách không đồng ý LỊCH SỰ trong tiếng Nhật?', options: ['Nói "違う" (sai) ngay', 'Công nhận trước rồi mới khác: なるほど、でも〜', 'Im lặng', 'Đổi chủ đề'], correctIndex: 1, explanation: 'Công nhận (naruhodo) rồi でも… giữ hoà khí.' },
]);

const c3 = doc('jpd316-3-1-four-skills', '3.1 — The four skills in context|||3.1 — Bốn kỹ năng theo ngữ cảnh',
  'Chiến lược nghe (bắt ý chính), nói (Hanashite Miyou/Charenji), đọc lướt vs đọc kỹ, viết đoạn có mở-thân-kết; luyện theo chủ đề đời sống.',
  [[
    `<span class="eyebrow">JPD316 · Chapter 3 · Lesson 3.1</span>
<h2>The four skills in context</h2>
<p>N3 practice integrates all four skills around real topics (daily life, work, society):</p>
<ul>
<li><strong>Listening (聞く)</strong> — catch the main point and key details even if you miss some words; predict from context.</li>
<li><strong>Speaking (話す)</strong> — the textbook's "Hanashite Miyou / Charenji / Yatte miyou" steps: try, challenge, then do it — build fluency by producing, not just recognizing.</li>
<li><strong>Reading (読む)</strong> — <em>skim</em> (ざっと読む) for the gist, then <em>scan/read closely</em> for specifics. Don't stop at every unknown kanji — guess from context and kanji roots.</li>
<li><strong>Writing (書く)</strong> — a short paragraph with a clear intro → body (reasons/examples) → conclusion, using the connectors and opinion patterns from Chapters 1-2.</li>
</ul>
<pre><code>私の意見を書きます。まず〜。次に〜。だから〜と思います。
watashi no iken wo kakimasu. mazu…, tsugi ni…, dakara … to omoimasu.
= I'll write my opinion. First…, next…, therefore I think…
</code></pre>
<div class="callout"><span class="badge">Put it together</span> By combining connectors (Ch.1), opinion patterns (Ch.2) and topic vocabulary, you can now listen to a discussion, read an article, state your view with reasons, and write a short structured piece — the whole point of intermediate Japanese.</div>`,
    `<span class="eyebrow">JPD316 · Chương 3 · Bài 3.1</span>
<h2>Bốn kỹ năng theo ngữ cảnh</h2>
<p>Luyện N3 tích hợp cả bốn kỹ năng quanh chủ đề thật (đời sống, công việc, xã hội):</p>
<ul>
<li><strong>Nghe (聞く)</strong> — bắt ý chính và chi tiết quan trọng dù sót vài từ; đoán theo ngữ cảnh.</li>
<li><strong>Nói (話す)</strong> — các bước "Hanashite Miyou / Charenji / Yatte miyou" trong giáo trình: thử, thử thách, rồi làm — luyện trôi chảy bằng cách tạo ra, không chỉ nhận biết.</li>
<li><strong>Đọc (読む)</strong> — <em>đọc lướt</em> (ざっと読む) lấy ý chính, rồi <em>đọc kỹ/quét</em> tìm chi tiết. Đừng dừng ở mọi kanji lạ — đoán theo ngữ cảnh và gốc kanji.</li>
<li><strong>Viết (書く)</strong> — một đoạn ngắn có mở → thân (lý do/ví dụ) → kết, dùng từ nối và mẫu ý kiến từ Chương 1-2.</li>
</ul>
<pre><code>私の意見を書きます。まず〜。次に〜。だから〜と思います。
watashi no iken wo kakimasu. mazu…, tsugi ni…, dakara … to omoimasu.
= Tôi sẽ viết ý kiến. Đầu tiên…, tiếp theo…, vì thế tôi nghĩ…
</code></pre>
<div class="callout"><span class="badge">Ghép lại</span> Kết hợp từ nối (Ch.1), mẫu ý kiến (Ch.2) và từ vựng chủ đề, giờ bạn có thể nghe thảo luận, đọc bài báo, nêu quan điểm kèm lý do, và viết một đoạn có cấu trúc — chính là đích của tiếng Nhật trung cấp.</div>`,
  ]]);

const c3q = quiz('jpd316-quiz-3', 'Quiz 3 — Four skills|||Quiz 3 — Bốn kỹ năng', [
  { id: 'q1', question: 'Chiến lược đọc hiệu quả ở N3?', options: ['Tra mọi kanji lạ ngay', 'Đọc lướt lấy ý chính rồi đọc kỹ chi tiết, đoán theo ngữ cảnh', 'Chỉ đọc romaji', 'Bỏ qua bài dài'], correctIndex: 1, explanation: 'ざっと読む (lướt) + đọc kỹ + đoán theo ngữ cảnh/gốc kanji.' },
  { id: 'q2', question: 'Một đoạn viết ý kiến tốt nên có cấu trúc?', options: ['Chỉ một câu', 'Mở → thân (lý do/ví dụ) → kết', 'Chỉ liệt kê từ', 'Không cần cấu trúc'], correctIndex: 1, explanation: 'まず/次に/だから nối mở-thân-kết rõ ràng.' },
  { id: 'q3', question: 'Cách luyện NÓI trôi chảy theo giáo trình là?', options: ['Chỉ nghe', 'Chủ động tạo ra lời nói (thử-thử thách-làm), không chỉ nhận biết', 'Học thuộc lòng bảng chữ', 'Dịch sang tiếng Việt'], correctIndex: 1, explanation: 'Fluency đến từ sản xuất ngôn ngữ, không chỉ nhận diện.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'JPD316',
    slug: 'jpd316-intermediate-japanese-1-b1-b2',
    title: 'Intermediate Japanese 1-B1/B2',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'Intermediate Japanese toward N3 — connectors & conditionals (から/ので, たら/ば/なら), expressing opinions & reasons, and the four skills across everyday topics. Bilingual, with Japanese + romaji & quizzes.|||Tiếng Nhật trung cấp hướng N3 — từ nối & điều kiện (から/ので, たら/ば/なら), diễn đạt ý kiến & lý do, và bốn kỹ năng qua chủ đề đời sống. Song ngữ, có chữ Nhật + romaji & quiz.',
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/JPD316.webp',
    description: 'Môn <strong>JPD316 — Tiếng Nhật trung cấp 1 (B1/B2, hướng N3)</strong> (kỳ 7) tổng hợp JPD113–JPD226 và hoàn thiện bốn kỹ năng, trọng tâm <strong>trình bày vấn đề/ý kiến của bản thân</strong> và giao tiếp. Gồm <strong>ngữ pháp trung cấp</strong> (từ nối て/から/ので/のに, bốn điều kiện と/たら/ば/なら) → <strong>diễn đạt ý kiến &amp; lý do</strong> (と思います, 理由は…からです, đồng ý/không đồng ý lịch sự) → <strong>bốn kỹ năng theo ngữ cảnh</strong> (nghe bắt ý, nói chủ động, đọc lướt/đọc kỹ, viết đoạn có cấu trúc). Bám giáo trình FLM, song ngữ, có chữ Nhật (kanji/kana + romaji) và quiz.',
    whatYouLearn: 'Nối câu (thể て, から/ので lý do, のに/ても nhượng bộ); bốn điều kiện と/たら/ば/なら và sắc thái; nêu ý kiến (〜と思います/と考えます) & lý do (理由は…からです); đồng ý/không đồng ý lịch sự; chiến lược nghe (bắt ý chính), nói (sản xuất chủ động), đọc (lướt vs kỹ, đoán theo ngữ cảnh), viết đoạn mở-thân-kết. Hướng trình độ N3.',
    requirements: 'Đã học tới khoảng JPD226 (sơ-trung cấp), nắm kana và ngữ pháp N4. Hướng tới N3.',
  },
  sections: [
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Trung cấp hướng N3, trọng tâm nêu ý kiến.', lessons: [intro] },
    { title: 'Chương 1 — Từ nối & điều kiện|||Chapter 1 — Connectors & conditionals', description: 'から/ので, のに, と/たら/ば/なら.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Diễn đạt ý kiến|||Chapter 2 — Expressing opinions', description: 'と思います, lý do, đồng ý/không.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Bốn kỹ năng|||Chapter 3 — Four skills', description: 'Nghe-nói-đọc-viết theo chủ đề.', lessons: [c3, c3q] },
  ],
};
