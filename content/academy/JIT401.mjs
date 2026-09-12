/**
 * JIT401 — Information Technology Japanese. Giáo trình FLM (syl): kiến thức CNTT
 * bằng tiếng Nhật (máy tính, internet, thiết bị, truyền dữ liệu, an toàn/bảo mật,
 * cấu trúc máy tính, CSDL, lập trình, CTDL & giải thuật) + từ vựng/thuật ngữ IT
 * để đọc-hiểu-dịch. Song ngữ VI + chữ Nhật (kanji/kana + romaji). Giữ NGUYÊN
 * slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('jit401-0-1-overview', 'Course overview: IT Japanese|||Tổng quan: Tiếng Nhật CNTT',
  'Mục tiêu làm việc tại công ty IT Nhật; hai trục: kiến thức IT bằng tiếng Nhật + từ vựng/thuật ngữ để đọc-dịch. Lộ trình: máy tính & mạng → lập trình & dữ liệu → bảo mật & giao tiếp công việc.',
  [[
    `<span class="eyebrow">JIT401 · Lesson 0.1 · Overview</span>
<h2>Information Technology Japanese</h2>
<p class="lead">This course prepares Japanese-major students to work at <strong>Japanese IT companies</strong>. It has two threads: (1) basic <strong>IT knowledge expressed in Japanese</strong> — computers, the internet, IT devices, data transmission, security, computer architecture, databases, programming, data structures &amp; algorithms; and (2) the <strong>vocabulary, terms and expressions</strong> you need to read, understand and translate IT documents.</p>
<h3>Why domain Japanese matters</h3>
<p>General Japanese isn't enough at an IT firm — you must recognize terms like <strong>データベース (deetabeesu, database)</strong>, <strong>プログラム (puroguramu, program)</strong>, and read specs and manuals. Many IT words are <strong>katakana loanwords</strong> from English, which makes them easier once you know the katakana sound system.</p>
<h3>Roadmap</h3>
<p>Computers &amp; networks → programming &amp; data → security &amp; workplace communication. Bilingual (Vietnamese), with Japanese terms (kanji/kana + romaji) and reading practice.</p>`,
    `<span class="eyebrow">JIT401 · Bài 0.1 · Tổng quan</span>
<h2>Tiếng Nhật Công nghệ thông tin</h2>
<p class="lead">Môn này chuẩn bị cho sinh viên chuyên ngành Nhật ngữ làm việc tại <strong>các công ty IT Nhật Bản</strong>. Có hai trục: (1) <strong>kiến thức IT cơ bản diễn đạt bằng tiếng Nhật</strong> — máy tính, internet, thiết bị IT, truyền dữ liệu, bảo mật, cấu trúc máy tính, cơ sở dữ liệu, lập trình, cấu trúc dữ liệu &amp; giải thuật; và (2) <strong>từ vựng, thuật ngữ và cách diễn đạt</strong> để đọc, hiểu và dịch tài liệu IT.</p>
<h3>Vì sao cần tiếng Nhật chuyên ngành</h3>
<p>Tiếng Nhật thường không đủ ở công ty IT — bạn phải nhận ra thuật ngữ như <strong>データベース (deetabeesu, cơ sở dữ liệu)</strong>, <strong>プログラム (puroguramu, chương trình)</strong>, và đọc được đặc tả, tài liệu. Nhiều từ IT là <strong>từ mượn katakana</strong> từ tiếng Anh, nên dễ hơn khi bạn nắm hệ âm katakana.</p>
<h3>Lộ trình</h3>
<p>Máy tính &amp; mạng → lập trình &amp; dữ liệu → bảo mật &amp; giao tiếp công việc. Song ngữ (tiếng Việt), có thuật ngữ Nhật (kanji/kana + romaji) và luyện đọc.</p>`,
  ]]);

const c1 = doc('jit401-1-1-computer-network', '1.1 — Computers & networks (terms)|||1.1 — Máy tính & mạng (thuật ngữ)',
  'Từ vựng phần cứng/mạng bằng tiếng Nhật (コンピュータ, ハードウェア, ネットワーク, インターネット…) và cách đọc câu mô tả kỹ thuật.',
  [[
    `<span class="eyebrow">JIT401 · Chapter 1 · Lesson 1.1</span>
<h2>Computers &amp; networks — core terms</h2>
<table><thead><tr><th>Japanese</th><th>Romaji</th><th>Meaning</th></tr></thead><tbody>
<tr><td>コンピュータ</td><td>konpyuuta</td><td>computer</td></tr>
<tr><td>ハードウェア</td><td>haadowea</td><td>hardware</td></tr>
<tr><td>ソフトウェア</td><td>sofutowea</td><td>software</td></tr>
<tr><td>ネットワーク</td><td>nettowaaku</td><td>network</td></tr>
<tr><td>インターネット</td><td>intaanetto</td><td>internet</td></tr>
<tr><td>サーバー</td><td>saabaa</td><td>server</td></tr>
<tr><td>記憶装置 (きおくそうち)</td><td>kioku souchi</td><td>storage device</td></tr>
</tbody></table>
<p>Notice most modern IT terms are <strong>katakana loanwords</strong> (konpyuuta, nettowaaku), while some use <strong>kanji</strong> compounds (記憶装置 = memory + device = storage).</p>
<h3>Reading a technical sentence</h3>
<pre><code>このコンピュータはネットワークにつながっています。
kono konpyuuta wa nettowaaku ni tsunagatte imasu.
= This computer is connected to the network.
</code></pre>
<div class="callout"><span class="badge">Study tip</span> For each concept, learn the term in BOTH forms you'll meet: the katakana loanword (in modern docs) and any kanji equivalent (in formal writing).</div>`,
    `<span class="eyebrow">JIT401 · Chương 1 · Bài 1.1</span>
<h2>Máy tính &amp; mạng — thuật ngữ cốt lõi</h2>
<table><thead><tr><th>Tiếng Nhật</th><th>Romaji</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>コンピュータ</td><td>konpyuuta</td><td>máy tính</td></tr>
<tr><td>ハードウェア</td><td>haadowea</td><td>phần cứng</td></tr>
<tr><td>ソフトウェア</td><td>sofutowea</td><td>phần mềm</td></tr>
<tr><td>ネットワーク</td><td>nettowaaku</td><td>mạng</td></tr>
<tr><td>インターネット</td><td>intaanetto</td><td>internet</td></tr>
<tr><td>サーバー</td><td>saabaa</td><td>máy chủ</td></tr>
<tr><td>記憶装置 (きおくそうち)</td><td>kioku souchi</td><td>thiết bị lưu trữ</td></tr>
</tbody></table>
<p>Chú ý phần lớn thuật ngữ IT hiện đại là <strong>từ mượn katakana</strong> (konpyuuta, nettowaaku), còn một số dùng ghép <strong>kanji</strong> (記憶装置 = ký ức + thiết bị = lưu trữ).</p>
<h3>Đọc một câu kỹ thuật</h3>
<pre><code>このコンピュータはネットワークにつながっています。
kono konpyuuta wa nettowaaku ni tsunagatte imasu.
= Máy tính này đang được kết nối với mạng.
</code></pre>
<div class="callout"><span class="badge">Mẹo học</span> Mỗi khái niệm, học thuật ngữ ở CẢ hai dạng sẽ gặp: từ mượn katakana (tài liệu hiện đại) và tương đương kanji nếu có (văn viết trang trọng).</div>`,
  ]]);

const c1q = quiz('jit401-quiz-1', 'Quiz 1 — Computer terms|||Quiz 1 — Thuật ngữ máy tính', [
  { id: 'q1', question: '「ネットワーク」(nettowaaku) nghĩa là?', options: ['Máy tính', 'Mạng (network)', 'Phần mềm', 'Máy chủ'], correctIndex: 1, explanation: 'nettowaaku = network = mạng (katakana loanword).' },
  { id: 'q2', question: 'Đa số thuật ngữ IT hiện đại trong tiếng Nhật viết bằng?', options: ['Hiragana', 'Katakana (từ mượn tiếng Anh)', 'Chỉ kanji cổ', 'Romaji'], correctIndex: 1, explanation: 'IT loanword thường viết katakana.' },
  { id: 'q3', question: '「ソフトウェア」(sofutowea) là?', options: ['Phần cứng', 'Phần mềm (software)', 'Mạng', 'Bộ nhớ'], correctIndex: 1, explanation: 'sofutowea = software = phần mềm.' },
]);

const c2 = doc('jit401-2-1-programming-data', '2.1 — Programming & data (terms)|||2.1 — Lập trình & dữ liệu (thuật ngữ)',
  'Từ vựng lập trình/CSDL/giải thuật bằng tiếng Nhật (プログラム, 変数, データベース, アルゴリズム…) và đọc mô tả chức năng.',
  [[
    `<span class="eyebrow">JIT401 · Chapter 2 · Lesson 2.1</span>
<h2>Programming &amp; data — core terms</h2>
<table><thead><tr><th>Japanese</th><th>Romaji</th><th>Meaning</th></tr></thead><tbody>
<tr><td>プログラム</td><td>puroguramu</td><td>program</td></tr>
<tr><td>プログラミング言語 (げんご)</td><td>puroguramingu gengo</td><td>programming language</td></tr>
<tr><td>変数 (へんすう)</td><td>hensuu</td><td>variable</td></tr>
<tr><td>関数 (かんすう)</td><td>kansuu</td><td>function</td></tr>
<tr><td>データベース</td><td>deetabeesu</td><td>database</td></tr>
<tr><td>アルゴリズム</td><td>arugorizumu</td><td>algorithm</td></tr>
<tr><td>データ構造 (こうぞう)</td><td>deeta kouzou</td><td>data structure</td></tr>
</tbody></table>
<h3>Reading a spec-style sentence</h3>
<pre><code>この関数は二つの変数を受け取ります。
kono kansuu wa futatsu no hensuu wo uketorimasu.
= This function receives two variables.
</code></pre>
<p>Here <strong>kanji</strong> compounds carry meaning: 変数 (change + number = variable), 関数 (relation + number = function), データ構造 (data + structure). Recognizing the kanji roots helps you guess new terms.</p>
<div class="callout"><span class="badge">Translate practice</span> Read Japanese IT sentences and render them into natural Vietnamese/English — the goal isn't word-for-word but conveying the technical meaning correctly.</div>`,
    `<span class="eyebrow">JIT401 · Chương 2 · Bài 2.1</span>
<h2>Lập trình &amp; dữ liệu — thuật ngữ cốt lõi</h2>
<table><thead><tr><th>Tiếng Nhật</th><th>Romaji</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>プログラム</td><td>puroguramu</td><td>chương trình</td></tr>
<tr><td>プログラミング言語 (げんご)</td><td>puroguramingu gengo</td><td>ngôn ngữ lập trình</td></tr>
<tr><td>変数 (へんすう)</td><td>hensuu</td><td>biến</td></tr>
<tr><td>関数 (かんすう)</td><td>kansuu</td><td>hàm</td></tr>
<tr><td>データベース</td><td>deetabeesu</td><td>cơ sở dữ liệu</td></tr>
<tr><td>アルゴリズム</td><td>arugorizumu</td><td>giải thuật</td></tr>
<tr><td>データ構造 (こうぞう)</td><td>deeta kouzou</td><td>cấu trúc dữ liệu</td></tr>
</tbody></table>
<h3>Đọc một câu kiểu đặc tả</h3>
<pre><code>この関数は二つの変数を受け取ります。
kono kansuu wa futatsu no hensuu wo uketorimasu.
= Hàm này nhận hai biến.
</code></pre>
<p>Ở đây các ghép <strong>kanji</strong> mang nghĩa: 変数 (biến đổi + số = biến), 関数 (quan hệ + số = hàm), データ構造 (dữ liệu + cấu trúc). Nhận ra gốc kanji giúp bạn đoán thuật ngữ mới.</p>
<div class="callout"><span class="badge">Luyện dịch</span> Đọc câu IT tiếng Nhật và chuyển sang tiếng Việt/Anh tự nhiên — mục tiêu không phải dịch từng chữ mà truyền đạt đúng nghĩa kỹ thuật.</div>`,
  ]]);

const c2q = quiz('jit401-quiz-2', 'Quiz 2 — Programming terms|||Quiz 2 — Thuật ngữ lập trình', [
  { id: 'q1', question: '「データベース」(deetabeesu) là?', options: ['Biến', 'Cơ sở dữ liệu (database)', 'Giải thuật', 'Hàm'], correctIndex: 1, explanation: 'deetabeesu = database = cơ sở dữ liệu.' },
  { id: 'q2', question: '「変数」(hensuu) nghĩa là?', options: ['Hàm', 'Biến (variable)', 'Chương trình', 'Mạng'], correctIndex: 1, explanation: '変数 = biến; 関数 (kansuu) = hàm.' },
  { id: 'q3', question: '「アルゴリズム」(arugorizumu) là?', options: ['Cấu trúc dữ liệu', 'Giải thuật (algorithm)', 'Cơ sở dữ liệu', 'Máy chủ'], correctIndex: 1, explanation: 'arugorizumu = algorithm = giải thuật.' },
]);

const c3 = doc('jit401-3-1-security-workplace', '3.1 — Security & workplace communication|||3.1 — Bảo mật & giao tiếp công việc',
  'Từ vựng an toàn/bảo mật (セキュリティ, パスワード, ウイルス…) và mẫu câu công việc IT Nhật (báo cáo/hỏi/xác nhận — hou-ren-sou).',
  [[
    `<span class="eyebrow">JIT401 · Chapter 3 · Lesson 3.1</span>
<h2>Security &amp; workplace communication</h2>
<h3>Security terms</h3>
<table><thead><tr><th>Japanese</th><th>Romaji</th><th>Meaning</th></tr></thead><tbody>
<tr><td>セキュリティ</td><td>sekyuriti</td><td>security</td></tr>
<tr><td>パスワード</td><td>pasuwaado</td><td>password</td></tr>
<tr><td>ウイルス</td><td>uirusu</td><td>virus</td></tr>
<tr><td>暗号化 (あんごうか)</td><td>angouka</td><td>encryption</td></tr>
<tr><td>バックアップ</td><td>bakkuappu</td><td>backup</td></tr>
</tbody></table>
<h3>Workplace: HOU-REN-SOU (報連相)</h3>
<p>Japanese IT workplaces prize <strong>報連相 (hou-ren-sou)</strong> — 報告 (houkoku, report), 連絡 (renraku, inform/contact), 相談 (soudan, consult). You keep the team updated proactively.</p>
<pre><code>バグを見つけました。報告します。
bagu wo mitsukemashita. houkoku shimasu.
= I found a bug. I will report it.

この点について相談したいです。
kono ten ni tsuite soudan shitai desu.
= I'd like to consult about this point.
</code></pre>
<div class="callout"><span class="badge">Culture + language</span> In a Japanese IT team, HOW you communicate (polite forms, timely hou-ren-sou) matters as much as the technical content. Learning the terms and the etiquette together is what makes you employable there.</div>`,
    `<span class="eyebrow">JIT401 · Chương 3 · Bài 3.1</span>
<h2>Bảo mật &amp; giao tiếp công việc</h2>
<h3>Thuật ngữ bảo mật</h3>
<table><thead><tr><th>Tiếng Nhật</th><th>Romaji</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>セキュリティ</td><td>sekyuriti</td><td>bảo mật</td></tr>
<tr><td>パスワード</td><td>pasuwaado</td><td>mật khẩu</td></tr>
<tr><td>ウイルス</td><td>uirusu</td><td>virus</td></tr>
<tr><td>暗号化 (あんごうか)</td><td>angouka</td><td>mã hoá</td></tr>
<tr><td>バックアップ</td><td>bakkuappu</td><td>sao lưu</td></tr>
</tbody></table>
<h3>Nơi làm việc: HOU-REN-SOU (報連相)</h3>
<p>Công ty IT Nhật coi trọng <strong>報連相 (hou-ren-sou)</strong> — 報告 (houkoku, báo cáo), 連絡 (renraku, thông báo/liên lạc), 相談 (soudan, tham vấn). Bạn chủ động cập nhật cho nhóm.</p>
<pre><code>バグを見つけました。報告します。
bagu wo mitsukemashita. houkoku shimasu.
= Tôi đã tìm thấy một lỗi. Tôi sẽ báo cáo.

この点について相談したいです。
kono ten ni tsuite soudan shitai desu.
= Tôi muốn tham vấn về điểm này.
</code></pre>
<div class="callout"><span class="badge">Văn hoá + ngôn ngữ</span> Trong nhóm IT Nhật, CÁCH bạn giao tiếp (thể lịch sự, hou-ren-sou kịp thời) quan trọng ngang nội dung kỹ thuật. Học thuật ngữ và lễ nghi cùng nhau là thứ giúp bạn được tuyển ở đó.</div>`,
  ]]);

const c3q = quiz('jit401-quiz-3', 'Quiz 3 — Security & workplace|||Quiz 3 — Bảo mật & công việc', [
  { id: 'q1', question: '「暗号化」(angouka) nghĩa là?', options: ['Sao lưu', 'Mã hoá (encryption)', 'Virus', 'Mật khẩu'], correctIndex: 1, explanation: '暗号化 = mã hoá; バックアップ = sao lưu.' },
  { id: 'q2', question: '報連相 (hou-ren-sou) trong công ty Nhật gồm?', options: ['Báo cáo – Liên lạc – Tham vấn', 'Đọc – Viết – Nói', 'Code – Test – Deploy', 'Sáng – Trưa – Tối'], correctIndex: 0, explanation: '報告/連絡/相談 = report/inform/consult — văn hoá giao tiếp chủ động.' },
  { id: 'q3', question: '「パスワード」(pasuwaado) là?', options: ['Mật khẩu (password)', 'Máy chủ', 'Bảo mật', 'Sao lưu'], correctIndex: 0, explanation: 'pasuwaado = password = mật khẩu.' },
]);

export default {
  semester: { code: 'FPTU_Hola8', name: 'Kỳ 8', ordinal: 10 },
  course: {
    courseCode: 'JIT401',
    slug: 'jit401-information-technology-japanese',
    title: 'Information Technology Japanese',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/JIT401.webp',
    shortDescription: 'IT Japanese for working at Japanese tech firms — IT knowledge in Japanese (computers, networks, programming, data, security) plus the vocabulary to read and translate IT docs. Bilingual, with terms + romaji & quizzes.|||Tiếng Nhật CNTT để làm việc tại công ty IT Nhật — kiến thức IT bằng tiếng Nhật (máy tính, mạng, lập trình, dữ liệu, bảo mật) cùng từ vựng để đọc-dịch tài liệu IT. Song ngữ, có thuật ngữ + romaji & quiz.',
    description: 'Môn <strong>JIT401 — Information Technology Japanese</strong> (kỳ 8) giúp sinh viên Nhật ngữ làm việc tại <strong>công ty IT Nhật Bản</strong>. Hai trục: (1) kiến thức IT diễn đạt bằng tiếng Nhật — <strong>máy tính &amp; mạng</strong> → <strong>lập trình &amp; dữ liệu</strong> (biến, hàm, CSDL, giải thuật) → <strong>bảo mật &amp; giao tiếp công việc</strong> (hou-ren-sou); và (2) từ vựng, thuật ngữ, cách diễn đạt để đọc-hiểu-dịch tài liệu IT. Bám giáo trình FLM, song ngữ (tiếng Việt), có thuật ngữ Nhật (kanji/kana + romaji), câu mẫu và quiz mỗi chương.',
    whatYouLearn: 'Từ vựng IT tiếng Nhật (máy tính/mạng: konpyuuta, nettowaaku, saabaa, 記憶装置; lập trình/dữ liệu: puroguramu, 変数/関数, deetabeesu, arugorizumu, データ構造; bảo mật: sekyuriti, 暗号化, バックアップ); nhận biết từ mượn katakana vs ghép kanji; đọc & dịch câu kỹ thuật; văn hoá công việc IT Nhật (報連相 hou-ren-sou: báo cáo/liên lạc/tham vấn), thể lịch sự.',
    requirements: 'Đã có tiếng Nhật cơ bản (khoảng N4-N3) và biết kana. Không bắt buộc nền IT sâu.',
  },
  sections: [
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Làm việc tại công ty IT Nhật.', lessons: [intro] },
    { title: 'Chương 1 — Máy tính & mạng|||Chapter 1 — Computers & networks', description: 'Thuật ngữ phần cứng/mạng.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Lập trình & dữ liệu|||Chapter 2 — Programming & data', description: 'Biến/hàm/CSDL/giải thuật.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Bảo mật & công việc|||Chapter 3 — Security & workplace', description: 'Bảo mật, hou-ren-sou.', lessons: [c3, c3q] },
  ],
};
