/**
 * JIS401 — Japanese in Software. Giáo trình FLM (syl): môn tự chọn định hướng
 * CNTT sau OJT — từ vựng chuyên ngành CNTT trong ngành PHẦN MỀM (quy trình phát
 * triển, vai trò, tài liệu). Song ngữ VI + chữ Nhật (kanji/kana + romaji). Giữ
 * NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('jis401-0-1-overview', 'Course overview: Japanese in Software|||Tổng quan: Tiếng Nhật ngành phần mềm',
  'Môn tự chọn sau OJT, chuyên sâu tiếng Nhật ngành phần mềm; lộ trình: quy trình phát triển (工程) → vai trò & tài liệu → giao tiếp dự án với khách/đội Nhật.',
  [[
    `<span class="eyebrow">JIS401 · Lesson 0.1 · Overview</span>
<h2>Japanese in Software</h2>
<p class="lead">An IT-track elective taken after OJT, once you already have language skills and software knowledge. It builds the <strong>software-industry Japanese vocabulary</strong> you use daily on a Japanese software project — the development phases, the roles, and the documents.</p>
<h3>Why software-specific Japanese</h3>
<p>Japanese IT firms follow a well-defined process with its own vocabulary: 要件定義 (requirements), 設計 (design), 実装 (implementation), テスト (testing), リリース (release). Knowing these lets you read a 仕様書 (specification) and take part in reviews and meetings.</p>
<h3>Roadmap</h3>
<p>Development process (工程) → roles &amp; documents → project communication (with Japanese clients/teams). Bilingual (Vietnamese), with Japanese terms (kanji/kana + romaji) and example sentences.</p>`,
    `<span class="eyebrow">JIS401 · Bài 0.1 · Tổng quan</span>
<h2>Tiếng Nhật ngành phần mềm</h2>
<p class="lead">Môn tự chọn định hướng CNTT học sau OJT, khi bạn đã có kỹ năng tiếng và kiến thức phần mềm. Môn xây <strong>vốn từ tiếng Nhật ngành phần mềm</strong> dùng hằng ngày trong một dự án phần mềm Nhật — các pha phát triển, vai trò, và tài liệu.</p>
<h3>Vì sao cần tiếng Nhật riêng cho phần mềm</h3>
<p>Công ty IT Nhật theo quy trình rõ ràng với từ vựng riêng: 要件定義 (yêu cầu), 設計 (thiết kế), 実装 (hiện thực), テスト (kiểm thử), リリース (phát hành). Nắm chúng giúp bạn đọc 仕様書 (bản đặc tả) và tham gia review, họp.</p>
<h3>Lộ trình</h3>
<p>Quy trình phát triển (工程) → vai trò &amp; tài liệu → giao tiếp dự án (với khách hàng/đội Nhật). Song ngữ (tiếng Việt), có thuật ngữ Nhật (kanji/kana + romaji) và câu ví dụ.</p>`,
  ]]);

const c1 = doc('jis401-1-1-process', '1.1 — Development process (工程)|||1.1 — Quy trình phát triển (工程)',
  'Các pha phát triển phần mềm bằng tiếng Nhật: 要件定義→設計→実装→テスト→リリース→保守; mô hình ウォーターフォール/アジャイル.',
  [[
    `<span class="eyebrow">JIS401 · Chapter 1 · Lesson 1.1</span>
<h2>The development process (工程)</h2>
<table><thead><tr><th>Japanese</th><th>Romaji</th><th>Phase</th></tr></thead><tbody>
<tr><td>要件定義 (ようけんていぎ)</td><td>youken teigi</td><td>requirements definition</td></tr>
<tr><td>設計 (せっけい)</td><td>sekkei</td><td>design</td></tr>
<tr><td>実装 (じっそう)</td><td>jissou</td><td>implementation (coding)</td></tr>
<tr><td>テスト</td><td>tesuto</td><td>testing</td></tr>
<tr><td>リリース</td><td>ririisu</td><td>release</td></tr>
<tr><td>保守 (ほしゅ)</td><td>hoshu</td><td>maintenance</td></tr>
</tbody></table>
<p>Two process models you'll hear: <strong>ウォーターフォール (uootaafooru, waterfall)</strong> — phases in strict order, still common in Japanese enterprise projects; and <strong>アジャイル (ajairu, agile)</strong> — iterative sprints.</p>
<pre><code>今、設計の工程です。
ima, sekkei no koutei desu.
= We are now in the design phase.
</code></pre>
<div class="callout"><span class="badge">Note</span> 工程 (koutei) = process/phase. Japanese enterprise software still leans on waterfall with detailed documents at each 工程 — so the phase vocabulary is used constantly.</div>`,
    `<span class="eyebrow">JIS401 · Chương 1 · Bài 1.1</span>
<h2>Quy trình phát triển (工程)</h2>
<table><thead><tr><th>Tiếng Nhật</th><th>Romaji</th><th>Pha</th></tr></thead><tbody>
<tr><td>要件定義 (ようけんていぎ)</td><td>youken teigi</td><td>định nghĩa yêu cầu</td></tr>
<tr><td>設計 (せっけい)</td><td>sekkei</td><td>thiết kế</td></tr>
<tr><td>実装 (じっそう)</td><td>jissou</td><td>hiện thực (code)</td></tr>
<tr><td>テスト</td><td>tesuto</td><td>kiểm thử</td></tr>
<tr><td>リリース</td><td>ririisu</td><td>phát hành</td></tr>
<tr><td>保守 (ほしゅ)</td><td>hoshu</td><td>bảo trì</td></tr>
</tbody></table>
<p>Hai mô hình quy trình bạn sẽ nghe: <strong>ウォーターフォール (uootaafooru, thác nước)</strong> — các pha theo thứ tự chặt, vẫn phổ biến ở dự án doanh nghiệp Nhật; và <strong>アジャイル (ajairu, agile)</strong> — lặp theo sprint.</p>
<pre><code>今、設計の工程です。
ima, sekkei no koutei desu.
= Bây giờ chúng ta đang ở pha thiết kế.
</code></pre>
<div class="callout"><span class="badge">Lưu ý</span> 工程 (koutei) = quy trình/pha. Phần mềm doanh nghiệp Nhật vẫn thiên về waterfall với tài liệu chi tiết mỗi 工程 — nên từ vựng pha được dùng liên tục.</div>`,
  ]]);

const c1q = quiz('jis401-quiz-1', 'Quiz 1 — Process|||Quiz 1 — Quy trình', [
  { id: 'q1', question: '「要件定義」(youken teigi) là pha?', options: ['Thiết kế', 'Định nghĩa yêu cầu', 'Kiểm thử', 'Bảo trì'], correctIndex: 1, explanation: '要件定義 = requirements definition.' },
  { id: 'q2', question: '「実装」(jissou) nghĩa là?', options: ['Phát hành', 'Hiện thực/viết code (implementation)', 'Thiết kế', 'Yêu cầu'], correctIndex: 1, explanation: '実装 = implementation (coding).' },
  { id: 'q3', question: '「ウォーターフォール」là mô hình?', options: ['Agile', 'Thác nước (waterfall) — pha theo thứ tự chặt', 'Scrum', 'Kanban'], correctIndex: 1, explanation: 'uootaafooru = waterfall, phổ biến ở doanh nghiệp Nhật.' },
]);

const c2 = doc('jis401-2-1-roles-documents', '2.1 — Roles & documents|||2.1 — Vai trò & tài liệu',
  'Vai trò trong dự án (PM, SE, PG, BrSE…) và tài liệu (仕様書, 設計書, テスト仕様書) bằng tiếng Nhật.',
  [[
    `<span class="eyebrow">JIS401 · Chapter 2 · Lesson 2.1</span>
<h2>Roles &amp; documents</h2>
<h3>Roles</h3>
<table><thead><tr><th>Term</th><th>Meaning</th></tr></thead><tbody>
<tr><td>PM (プロジェクトマネージャー)</td><td>project manager</td></tr>
<tr><td>SE (システムエンジニア)</td><td>systems engineer (design/requirements)</td></tr>
<tr><td>PG (プログラマー)</td><td>programmer (implementation)</td></tr>
<tr><td>BrSE (ブリッジSE)</td><td>bridge SE — links the Japanese client and the offshore team</td></tr>
<tr><td>お客様 (おきゃくさま)</td><td>the client/customer</td></tr>
</tbody></table>
<p>The <strong>BrSE (bridge SE)</strong> role is especially important for Vietnamese engineers on Japanese projects — you translate requirements and communication between the Japanese customer and the development team.</p>
<h3>Documents</h3>
<ul>
<li><strong>仕様書 (shiyousho)</strong> — specification.</li>
<li><strong>設計書 (sekkeisho)</strong> — design document.</li>
<li><strong>テスト仕様書 (tesuto shiyousho)</strong> — test specification.</li>
<li><strong>議事録 (gijiroku)</strong> — meeting minutes.</li>
</ul>
<pre><code>仕様書を確認してください。
shiyousho wo kakunin shite kudasai.
= Please check the specification.
</code></pre>`,
    `<span class="eyebrow">JIS401 · Chương 2 · Bài 2.1</span>
<h2>Vai trò &amp; tài liệu</h2>
<h3>Vai trò</h3>
<table><thead><tr><th>Thuật ngữ</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>PM (プロジェクトマネージャー)</td><td>quản lý dự án</td></tr>
<tr><td>SE (システムエンジニア)</td><td>kỹ sư hệ thống (thiết kế/yêu cầu)</td></tr>
<tr><td>PG (プログラマー)</td><td>lập trình viên (hiện thực)</td></tr>
<tr><td>BrSE (ブリッジSE)</td><td>kỹ sư cầu nối — nối khách Nhật và đội offshore</td></tr>
<tr><td>お客様 (おきゃくさま)</td><td>khách hàng</td></tr>
</tbody></table>
<p>Vai trò <strong>BrSE (kỹ sư cầu nối)</strong> đặc biệt quan trọng với kỹ sư Việt trong dự án Nhật — bạn dịch yêu cầu và trao đổi giữa khách hàng Nhật và đội phát triển.</p>
<h3>Tài liệu</h3>
<ul>
<li><strong>仕様書 (shiyousho)</strong> — bản đặc tả.</li>
<li><strong>設計書 (sekkeisho)</strong> — tài liệu thiết kế.</li>
<li><strong>テスト仕様書 (tesuto shiyousho)</strong> — đặc tả kiểm thử.</li>
<li><strong>議事録 (gijiroku)</strong> — biên bản họp.</li>
</ul>
<pre><code>仕様書を確認してください。
shiyousho wo kakunin shite kudasai.
= Vui lòng kiểm tra bản đặc tả.
</code></pre>`,
  ]]);

const c2q = quiz('jis401-quiz-2', 'Quiz 2 — Roles & documents|||Quiz 2 — Vai trò & tài liệu', [
  { id: 'q1', question: 'BrSE (ブリッジSE) làm gì?', options: ['Chỉ viết code', 'Kỹ sư cầu nối giữa khách Nhật và đội phát triển', 'Quản lý nhân sự', 'Thiết kế UI'], correctIndex: 1, explanation: 'BrSE dịch yêu cầu/giao tiếp giữa khách Nhật và team offshore.' },
  { id: 'q2', question: '「仕様書」(shiyousho) là?', options: ['Biên bản họp', 'Bản đặc tả (specification)', 'Mã nguồn', 'Hợp đồng'], correctIndex: 1, explanation: '仕様書 = specification; 議事録 = biên bản họp.' },
  { id: 'q3', question: '「お客様」(okyakusama) nghĩa là?', options: ['Đồng nghiệp', 'Khách hàng', 'Sếp', 'Lập trình viên'], correctIndex: 1, explanation: 'お客様 = khách hàng (kính ngữ).' },
]);

const c3 = doc('jis401-3-1-communication', '3.1 — Project communication|||3.1 — Giao tiếp dự án',
  'Mẫu câu công việc: xác nhận, báo cáo tiến độ, hỏi/nhờ lịch sự (kính ngữ), email công việc; lưu ý văn hoá.',
  [[
    `<span class="eyebrow">JIS401 · Chapter 3 · Lesson 3.1</span>
<h2>Project communication</h2>
<h3>Everyday project phrases</h3>
<pre><code>進捗を報告します。
shinchoku wo houkoku shimasu.
= I will report the progress.

スケジュールに遅れthat... 遅れています。
sukejuuru ni okurete imasu.
= We are behind schedule.

確認をお願いします。
kakunin wo onegai shimasu.
= Please confirm (I request confirmation).
</code></pre>
<h3>Politeness &amp; email</h3>
<p>Business Japanese uses <strong>keigo (敬語)</strong> — honorific/humble forms. Emails open with お世話になっております (osewa ni natte orimasu, "thank you for your continued support") and close with よろしくお願いします (yoroshiku onegai shimasu). Getting the politeness level right is part of the job.</p>
<div class="callout"><span class="badge">Culture</span> Be precise and proactive: report progress (進捗 shinchoku) early, confirm (確認 kakunin) before assuming, and use polite forms with お客様. Clear, humble, timely communication is what Japanese clients value most.</div>`,
    `<span class="eyebrow">JIS401 · Chương 3 · Bài 3.1</span>
<h2>Giao tiếp dự án</h2>
<h3>Câu thường dùng trong dự án</h3>
<pre><code>進捗を報告します。
shinchoku wo houkoku shimasu.
= Tôi sẽ báo cáo tiến độ.

スケジュールに遅れています。
sukejuuru ni okurete imasu.
= Chúng ta đang chậm so với lịch.

確認をお願いします。
kakunin wo onegai shimasu.
= Xin vui lòng xác nhận.
</code></pre>
<h3>Lịch sự &amp; email</h3>
<p>Tiếng Nhật công việc dùng <strong>kính ngữ (敬語 keigo)</strong> — thể tôn kính/khiêm nhường. Email mở đầu bằng お世話になっております (osewa ni natte orimasu, "cảm ơn sự hợp tác") và kết bằng よろしくお願いします (yoroshiku onegai shimasu). Dùng đúng mức lịch sự là một phần của công việc.</p>
<div class="callout"><span class="badge">Văn hoá</span> Chính xác và chủ động: báo cáo tiến độ (進捗 shinchoku) sớm, xác nhận (確認 kakunin) trước khi giả định, và dùng thể lịch sự với お客様. Giao tiếp rõ ràng, khiêm nhường, kịp thời là thứ khách Nhật coi trọng nhất.</div>`,
  ]]);

const c3q = quiz('jis401-quiz-3', 'Quiz 3 — Communication|||Quiz 3 — Giao tiếp', [
  { id: 'q1', question: '「進捗を報告します」nghĩa gần nhất là?', options: ['Tôi sẽ nghỉ phép', 'Tôi sẽ báo cáo tiến độ', 'Xin xác nhận', 'Cảm ơn'], correctIndex: 1, explanation: '進捗 (tiến độ) + 報告 (báo cáo).' },
  { id: 'q2', question: '敬語 (keigo) là?', options: ['Từ vựng IT', 'Kính ngữ (thể tôn kính/khiêm nhường)', 'Tên một pha', 'Loại tài liệu'], correctIndex: 1, explanation: 'Keigo = kính ngữ, dùng trong giao tiếp công việc.' },
  { id: 'q3', question: 'Điều khách hàng Nhật coi trọng nhất trong giao tiếp?', options: ['Nói nhanh', 'Rõ ràng, khiêm nhường, kịp thời (báo cáo/xác nhận sớm)', 'Dùng nhiều từ Anh', 'Không cần lịch sự'], correctIndex: 1, explanation: 'Giao tiếp chủ động, đúng lễ nghi là giá trị cốt lõi.' },
]);

const taiLieu = doc('jis401-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">JIS401 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn software-industry Japanese — the development process, roles &amp; documents, and project communication with keigo — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for JIS401 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.japantimes.co.jp/books/" target="_blank" rel="noopener"><em>Nihongo So-matome / Shin Kanzen Master</em> — business &amp; JLPT N2 grammar</a></li>
<li><a href="https://en.wikipedia.org/wiki/Honorific_speech_in_Japanese" target="_blank" rel="noopener">Keigo (敬語) — honorific speech reference</a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.jlpt.jp/e/" target="_blank" rel="noopener">JLPT — official test site (levels &amp; can-do)</a></li>
<li><a href="https://nihongo-e-na.com/eng/" target="_blank" rel="noopener">Nihongo e-na — curated free Japanese-learning sites</a></li>
<li><a href="https://www.weblio.jp/" target="_blank" rel="noopener">Weblio — Japanese dictionary &amp; business/IT terms</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@JapanesePod101" target="_blank" rel="noopener">JapanesePod101</a> — business Japanese &amp; keigo</li>
<li><a href="https://www.youtube.com/@Nihongonomori2013" target="_blank" rel="noopener">日本語の森 (Nihongo no Mori)</a> — JLPT grammar in Japanese</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://apps.ankiweb.net/" target="_blank" rel="noopener">Anki</a> — spaced-repetition flashcards for software vocabulary</li>
<li><a href="https://jisho.org/" target="_blank" rel="noopener">Jisho.org</a> — Japanese–English dictionary (kanji lookup)</li>
<li><a href="https://ja.wikipedia.org/" target="_blank" rel="noopener">Japanese Wikipedia</a> — read real 仕様書-style technical Japanese</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — development-process terms (要件定義→設計→実装→テスト) and 工程 vocabulary.</li>
<li><strong>Practice</strong> — drill roles (PM/SE/PG/BrSE) &amp; document names (仕様書/議事録) in Anki with example sentences.</li>
<li><strong>Go deeper</strong> — write short progress reports (進捗) and confirmations (確認); read a real spec both ways.</li>
<li><strong>Job-ready</strong> — keigo (敬語) and business email for communicating with a Japanese client (お客様).</li>
</ol></div>`,
    `<span class="eyebrow">JIS401 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Tiếng Nhật ngành phần mềm — quy trình phát triển, vai trò &amp; tài liệu, giao tiếp dự án với kính ngữ — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của JIS401 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.japantimes.co.jp/books/" target="_blank" rel="noopener"><em>Nihongo So-matome / Shin Kanzen Master</em> — ngữ pháp thương mại &amp; JLPT N2</a></li>
<li><a href="https://en.wikipedia.org/wiki/Honorific_speech_in_Japanese" target="_blank" rel="noopener">Kính ngữ (敬語) — tra cứu thể tôn kính/khiêm nhường</a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.jlpt.jp/e/" target="_blank" rel="noopener">JLPT — trang thi chính thức (cấp độ &amp; can-do)</a></li>
<li><a href="https://nihongo-e-na.com/eng/" target="_blank" rel="noopener">Nihongo e-na — tuyển tập trang học tiếng Nhật miễn phí</a></li>
<li><a href="https://www.weblio.jp/" target="_blank" rel="noopener">Weblio — từ điển Nhật &amp; thuật ngữ thương mại/IT</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@JapanesePod101" target="_blank" rel="noopener">JapanesePod101</a> — tiếng Nhật thương mại &amp; kính ngữ</li>
<li><a href="https://www.youtube.com/@Nihongonomori2013" target="_blank" rel="noopener">日本語の森 (Nihongo no Mori)</a> — ngữ pháp JLPT bằng tiếng Nhật</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://apps.ankiweb.net/" target="_blank" rel="noopener">Anki</a> — thẻ ghi nhớ lặp lại ngắt quãng cho từ vựng phần mềm</li>
<li><a href="https://jisho.org/" target="_blank" rel="noopener">Jisho.org</a> — từ điển Nhật–Anh (tra kanji)</li>
<li><a href="https://ja.wikipedia.org/" target="_blank" rel="noopener">Wikipedia tiếng Nhật</a> — đọc tiếng Nhật kỹ thuật kiểu 仕様書 thật</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — từ vựng pha phát triển (要件定義→設計→実装→テスト) và thuật ngữ 工程.</li>
<li><strong>Luyện tập</strong> — nhồi vai trò (PM/SE/PG/BrSE) &amp; tên tài liệu (仕様書/議事録) trong Anki kèm câu mẫu.</li>
<li><strong>Đào sâu thực tế</strong> — viết báo cáo tiến độ (進捗) và xác nhận (確認); đọc một bản spec thật cả hai chiều.</li>
<li><strong>Sẵn sàng đi làm</strong> — kính ngữ (敬語) và email công việc để giao tiếp với khách Nhật (お客様).</li>
</ol></div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola8', name: 'Kỳ 8', ordinal: 10 },
  course: {
    courseCode: 'JIS401',
    slug: 'jis401-japanese-in-software',
    title: 'Japanese in Software',
    level: 'ADVANCED',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/JIS401.webp',
    shortDescription: 'Software-industry Japanese — the development process (要件定義→設計→実装→テスト), roles (PM/SE/PG/BrSE) & documents (仕様書), and project communication with keigo. Bilingual, with terms + romaji & quizzes.|||Tiếng Nhật ngành phần mềm — quy trình phát triển (yêu cầu→thiết kế→hiện thực→test), vai trò (PM/SE/PG/BrSE) & tài liệu (仕様書), giao tiếp dự án với kính ngữ. Song ngữ, có thuật ngữ + romaji & quiz.',
    description: 'Môn <strong>JIS401 — Japanese in Software</strong> (kỳ 8), tự chọn định hướng CNTT sau OJT, xây <strong>vốn từ tiếng Nhật ngành phần mềm</strong>. Gồm <strong>quy trình phát triển (工程)</strong> (要件定義/設計/実装/テスト/リリース/保守, waterfall vs agile) → <strong>vai trò &amp; tài liệu</strong> (PM/SE/PG/BrSE, 仕様書/設計書/議事録) → <strong>giao tiếp dự án</strong> (báo cáo tiến độ, xác nhận, email, kính ngữ). Bám giáo trình FLM, song ngữ (tiếng Việt), có thuật ngữ Nhật (kanji/kana + romaji), câu mẫu và quiz mỗi chương.',
    whatYouLearn: 'Từ vựng pha phát triển (要件定義/設計/実装/テスト/リリース/保守, 工程); mô hình waterfall (ウォーターフォール) vs agile; vai trò dự án (PM/SE/PG, đặc biệt BrSE cầu nối, お客様); tài liệu (仕様書/設計書/テスト仕様書/議事録); mẫu câu công việc (báo cáo 進捗, xác nhận 確認, nhờ お願いします); kính ngữ (敬語) & email công việc; văn hoá giao tiếp với khách Nhật.',
    requirements: 'Đã học phần lớn tiếng Nhật (khoảng N3) + có kiến thức phần mềm cơ bản (đã qua OJT là lý tưởng).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Tiếng Nhật chuyên sâu ngành phần mềm.', lessons: [intro] },
    { title: 'Chương 1 — Quy trình phát triển|||Chapter 1 — Development process', description: '要件定義→設計→実装→テスト.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Vai trò & tài liệu|||Chapter 2 — Roles & documents', description: 'PM/SE/PG/BrSE, 仕様書.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Giao tiếp dự án|||Chapter 3 — Project communication', description: 'Báo cáo, xác nhận, kính ngữ.', lessons: [c3, c3q] },
  ],
};
