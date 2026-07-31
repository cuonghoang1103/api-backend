/**
 * JPD123 — Elementary Japanese 1-A1.2 (Tiếng Nhật sơ cấp 1-A1.2). Kỳ 4.
 * Bám syllabus FPTU (sylID 14233, 4 CLO) + giáo trình できる日本語 初級 (Dekiru Nihongo)
 * + 漢字たまご (Kanji Tamago). Tiên quyết: JPD113. Nối tiếp A1.1 → A1.2.
 * Song ngữ EN/VN. KHÔNG CodeLab — luyện qua My Language (/language/ja) + heyjapan.net.
 * Mục tiêu A1.2: ~300 từ, 40+ kanji, động từ/tính từ, mời rủ, giới thiệu quê hương.
 * Ví dụ từng bước + ★ ngoài giáo trình.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/JPD123.mjs --apply
 */
export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'JPD123',
    slug: 'elementary-japanese-1-a12',
    title: 'Elementary Japanese 1 (A1.2)',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'The second step in Japanese, straight after JPD113: verbs and the polite ます-form, adjectives, telling time, making invitations, the essential て-form, plus ~300 words and 40 kanji — enough to talk about your hometown, plans and daily life.|||Bước thứ hai trong tiếng Nhật, ngay sau JPD113: động từ và thể lịch sự ます, tính từ, nói giờ, mời rủ, thể て thiết yếu, cùng ~300 từ và 40 kanji — đủ để nói về quê hương, dự định và đời sống hằng ngày.',
    description: 'Môn tiếng Nhật sơ cấp A1.2, nối tiếp JPD113 (A1.1). Bạn sẽ học động từ và chia thể ます (hiện tại/quá khứ, khẳng định/phủ định), tính từ (い và な), cách nói thời gian và ngày tháng, mời rủ và đề xuất (～ませんか, ～ましょう), thể て (nhờ vả, nối câu), cùng khoảng 300 từ vựng và hơn 40 chữ Hán. Mục tiêu: giới thiệu về quê hương, nói về dự định và công việc thường làm, mời bạn tham gia hoạt động. Tiên quyết: JPD113.',
    whatYouLearn: 'Động từ tiếng Nhật & thể lịch sự ます (hiện tại/quá khứ, khẳng định/phủ định); trợ từ chuyển động & hành động (へ/で/を/に); tính từ い và な để mô tả; thời gian, ngày, giờ; mời rủ & đề xuất (～ませんか / ～ましょう); thể て (～てください, nối hành động); ~300 từ vựng chủ đề; hơn 40 kanji; và giới thiệu về quê hương/dự định của bản thân.',
    requirements: 'Tiên quyết: đạt JPD113 (đọc/viết thành thạo hiragana & katakana, biết mẫu câu は/です/の và ~200 từ đầu). Khuyên dùng My Language (/language/ja) + heyjapan.net để luyện SRS.',
    documentsNote: 'Giáo trình: できる日本語 初級 本冊 (Dekiru Nihongo) · わたしのことばノート・わたしの文法ノート · 漢字たまご 初級 (Kanji Tamago). Công cụ: My Language (/language/ja) để luyện từ vựng/kanji/ngữ pháp, và heyjapan.net. Kèm file syllabus gốc JPD123.pdf.',
  },
  sections: [
    /* ══════════════════ MỤC 0 ══════════════════ */
    {
      title: 'Section 0 — Introduction & Study Guide|||Mục 0 — Giới thiệu môn học & Hướng dẫn học',
      description: 'Đọc trước tiên: môn học nối tiếp JPD113 thế nào, mục tiêu A1.2, và cách học hiệu quả.',
      lessons: [
        {
          title: '0.1 — About JPD123 & the study map|||0.1 — Giới thiệu JPD123 & bản đồ học',
          slug: 'jpd123-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'A1.2 nối tiếp A1.1 ra sao, và lộ trình từ động từ tới giới thiệu quê hương.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>About JPD123 — Elementary Japanese A1.2</h2>
<p class="lead">JPD113 gave you the alphabets and your first sentences (は・です・の). JPD123 makes Japanese come alive with <strong>verbs</strong> — now you can say what you <em>do</em>, did, and will do — plus adjectives to describe, and the phrases to invite a friend and talk about your hometown.</p>
<p>By the end you will handle real everyday conversation at a basic level: ~300 words, 40 kanji, and the grammar to actually <em>use</em> them.</p>
<h3>Study map</h3>
<div class="lz-map">
  <div class="lz-stage">Actions</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Verbs &amp; the ます-form</div><div class="lz-nsub">Present/past · positive/negative</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Particles of motion &amp; action</div><div class="lz-nsub">へ · で · を · に</div></div></div>
  <div class="lz-stage">Describing</div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Adjectives (い &amp; な)</div><div class="lz-nsub">Four forms · degree words · connectives</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Invitations, time &amp; counting</div><div class="lz-nsub">～ませんか · ～ましょう · counters</div></div></div>
  <div class="lz-stage">Expressing yourself</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Wishes, likes &amp; purpose</div><div class="lz-nsub">ほしい · ～たい · ～に いきます · すき</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Comparison</div><div class="lz-nsub">より · ほど · いちばん · どちらが</div></div></div>
  <div class="lz-stage">The key verb form</div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">The て-form</div><div class="lz-nsub">Full conjugation · ～てください · ～ています</div></div></div>
  <div class="lz-stage">Reading</div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Kanji A1.2 &amp; reading</div><div class="lz-nsub">40 kanji · short passages</div></div></div>
  <div class="lz-stage">Beyond A1.2</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Conversation practice · the JLPT N5 goal</div><div class="lz-nsub">Keep the momentum</div></div></div>
</div>
<div class="callout ok">The habit from JPD113 still rules: ten minutes of vocabulary and kanji every day, with spaced repetition. Verbs and adjectives multiply what you can say — but only if the base words are automatic.</div>
<a class="link-card codelab" href="/language/ja/grammar?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">🈴</span>
  <span class="lc-body"><span class="lc-title">Practise grammar &amp; vocab on My Language</span><span class="lc-sub">Japanese grammar patterns, vocabulary SRS and kanji.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>

<h3>Course materials & flashcard decks</h3>
<div class="lz-stack">
</div>
<a class="link-card dl" href="https://quizlet.com/vn/952402606/tu-vung-jpd123-minthep-flash-cards/" target="_blank" rel="noopener">
  <span class="lc-ico">🃏</span>
  <span class="lc-body"><span class="lc-title">Quizlet — Từ vựng JPD123</span><span class="lc-sub">Bộ thẻ từ vựng cả học phần</span></span>
  <span class="lc-cta">MỞ QUIZLET →</span>
</a>
<a class="link-card dl" href="https://quizlet.com/vn/956075868/kanji-jpd123-flash-cards/" target="_blank" rel="noopener">
  <span class="lc-ico">🈶</span>
  <span class="lc-body"><span class="lc-title">Quizlet — Kanji JPD123</span><span class="lc-sub">Bộ thẻ Hán tự của học phần</span></span>
  <span class="lc-cta">MỞ QUIZLET →</span>
</a>
<a class="link-card dl" href="https://thepkz.github.io/minthep-portfolio/blog/textblog-2.html" target="_blank" rel="noopener">
  <span class="lc-ico">📝</span>
  <span class="lc-body"><span class="lc-title">Blog tham khảo — Min Thep, JPD123</span><span class="lc-sub">Tính từ い/な, thể て và so sánh, một trang</span></span>
  <span class="lc-cta">ĐỌC BLOG →</span>
</a>
<a class="link-card dl" href="https://drive.google.com/file/d/1MLvq1RWvAXTsVs8m36yyN4lOaRkJu9L4/view?usp=sharing" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Dekiru Nihongo — Sơ cấp (PDF)</span><span class="lc-sub">Giáo trình dùng chung với JPD113</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Giới thiệu JPD123 — Tiếng Nhật sơ cấp A1.2</h2>
<p class="lead">JPD113 cho bạn bảng chữ cái và những câu đầu tiên (は・です・の). JPD123 làm tiếng Nhật sống động bằng <strong>động từ</strong> — giờ bạn nói được mình <em>làm</em> gì, đã làm, sẽ làm — cùng tính từ để mô tả, và các câu để mời một người bạn và nói về quê hương.</p>
<p>Cuối môn bạn xử lý được hội thoại đời thường ở mức cơ bản: ~300 từ, 40 kanji, và ngữ pháp để thực sự <em>dùng</em> chúng.</p>
<h3>Bản đồ học</h3>
<div class="lz-map">
  <div class="lz-stage">Hành động</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Động từ &amp; thể ます</div><div class="lz-nsub">Hiện tại/quá khứ · khẳng định/phủ định</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Trợ từ chuyển động &amp; hành động</div><div class="lz-nsub">へ · で · を · に</div></div></div>
  <div class="lz-stage">Mô tả</div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Tính từ (い &amp; な)</div><div class="lz-nsub">Bốn dạng · từ mức độ · liên từ</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Mời rủ, thời gian &amp; đếm</div><div class="lz-nsub">～ませんか · ～ましょう · trợ số từ</div></div></div>
  <div class="lz-stage">Bày tỏ bản thân</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Mong muốn, sở thích &amp; mục đích</div><div class="lz-nsub">ほしい · ～たい · ～に いきます · すき</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">So sánh</div><div class="lz-nsub">より · ほど · いちばん · どちらが</div></div></div>
  <div class="lz-stage">Thể động từ then chốt</div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Thể て</div><div class="lz-nsub">Bảng chia đầy đủ · ～てください · ～ています</div></div></div>
  <div class="lz-stage">Đọc</div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Kanji A1.2 &amp; đọc</div><div class="lz-nsub">40 kanji · đoạn ngắn</div></div></div>
  <div class="lz-stage">Vượt A1.2</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Luyện hội thoại · mục tiêu JLPT N5</div><div class="lz-nsub">Giữ đà tiến</div></div></div>
</div>
<div class="callout ok">Thói quen từ JPD113 vẫn là vua: mười phút từ vựng và kanji mỗi ngày, có lặp lại ngắt quãng. Động từ và tính từ nhân bội thứ bạn nói được — nhưng chỉ khi các từ nền đã thành phản xạ.</div>
<a class="link-card codelab" href="/language/ja/grammar?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">🈴</span>
  <span class="lc-body"><span class="lc-title">Luyện ngữ pháp &amp; từ vựng trên My Language</span><span class="lc-sub">Mẫu ngữ pháp tiếng Nhật, từ vựng SRS và kanji.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>

<h3>Tài liệu & bộ thẻ ghi nhớ</h3>
<div class="lz-stack">
</div>
<a class="link-card dl" href="https://quizlet.com/vn/952402606/tu-vung-jpd123-minthep-flash-cards/" target="_blank" rel="noopener">
  <span class="lc-ico">🃏</span>
  <span class="lc-body"><span class="lc-title">Quizlet — Từ vựng JPD123</span><span class="lc-sub">Bộ thẻ từ vựng cả học phần</span></span>
  <span class="lc-cta">MỞ QUIZLET →</span>
</a>
<a class="link-card dl" href="https://quizlet.com/vn/956075868/kanji-jpd123-flash-cards/" target="_blank" rel="noopener">
  <span class="lc-ico">🈶</span>
  <span class="lc-body"><span class="lc-title">Quizlet — Kanji JPD123</span><span class="lc-sub">Bộ thẻ Hán tự của học phần</span></span>
  <span class="lc-cta">MỞ QUIZLET →</span>
</a>
<a class="link-card dl" href="https://thepkz.github.io/minthep-portfolio/blog/textblog-2.html" target="_blank" rel="noopener">
  <span class="lc-ico">📝</span>
  <span class="lc-body"><span class="lc-title">Blog tham khảo — Min Thep, JPD123</span><span class="lc-sub">Tính từ い/な, thể て và so sánh, một trang</span></span>
  <span class="lc-cta">ĐỌC BLOG →</span>
</a>
<a class="link-card dl" href="https://drive.google.com/file/d/1MLvq1RWvAXTsVs8m36yyN4lOaRkJu9L4/view?usp=sharing" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Dekiru Nihongo — Sơ cấp (PDF)</span><span class="lc-sub">Giáo trình dùng chung với JPD113</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>
</div>
`,
        },
        {
          title: '0.2 — Passing requirements & how to study|||0.2 — Điều kiện qua môn & cách học',
          slug: 'jpd123-dieu-kien-qua-mon',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Tổng giờ, tiên quyết JPD113, điểm sàn, và cách học động từ/ngữ pháp hiệu quả.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Passing requirements &amp; how to study</h2>
<p class="lead">From the official JPD123 syllabus. The prerequisite is JPD113 — this course assumes you already read kana fluently and know the A1.1 patterns.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Credits</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Total hours</span><span class="v">150h <small>45h class (20 sessions) + exam + self-study</small></span></div>
  <div class="kv"><span class="k">Prerequisite</span><span class="v">JPD113</span></div>
  <div class="kv"><span class="k">Grading scale</span><span class="v">10 <small>pass when average ≥ 5.0</small></span></div>
  <div class="kv"><span class="k">Targets</span><span class="v">~300 words · 40 kanji · everyday conversation</span></div>
</div>
<h3>How to learn grammar (the A1.2 shift)</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Learn patterns, not translations.</b> Japanese grammar attaches to the end of words. Drill the <em>shape</em> of a pattern (verb + ます) with many examples until it feels natural.</div>
  <div class="lz-layer"><b>Verbs need conjugation practice.</b> Present, past, negative — practise transforming the same verb into all forms out loud.</div>
  <div class="lz-layer"><b>Make it personal.</b> Every new pattern: write one true sentence about your own life. "I go to school" → 学校へ行きます.</div>
  <div class="lz-layer"><b>Keep the SRS going.</b> New vocab and kanji still need daily spaced repetition — do not let A1.1 words fade.</div>
</div>
<a class="link-card exphub" href="/exp-hub/jpd113-cong-cu-hoc?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Study tools for Japanese</span><span class="lc-sub">My Language &amp; heyjapan.net — same setup as JPD113.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Điều kiện qua môn &amp; cách học</h2>
<p class="lead">Từ syllabus chính thức JPD123. Tiên quyết là JPD113 — môn này giả định bạn đã đọc kana thành thạo và biết các mẫu câu A1.1.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Tín chỉ</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Tổng giờ</span><span class="v">150h <small>45h lớp (20 session) + thi + tự học</small></span></div>
  <div class="kv"><span class="k">Tiên quyết</span><span class="v">JPD113</span></div>
  <div class="kv"><span class="k">Thang điểm</span><span class="v">10 <small>qua khi trung bình ≥ 5.0</small></span></div>
  <div class="kv"><span class="k">Mục tiêu</span><span class="v">~300 từ · 40 kanji · hội thoại đời thường</span></div>
</div>
<h3>Cách học ngữ pháp (bước chuyển A1.2)</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Học mẫu, không học bản dịch.</b> Ngữ pháp tiếng Nhật gắn vào cuối từ. Luyện <em>hình dạng</em> một mẫu (động từ + ます) với nhiều ví dụ tới khi thấy tự nhiên.</div>
  <div class="lz-layer"><b>Động từ cần luyện chia.</b> Hiện tại, quá khứ, phủ định — luyện biến đổi cùng một động từ ra mọi thể thành tiếng.</div>
  <div class="lz-layer"><b>Cá nhân hóa.</b> Mỗi mẫu mới: viết một câu thật về đời bạn. "Tôi đi học" → 学校へ行きます.</div>
  <div class="lz-layer"><b>Duy trì SRS.</b> Từ mới và kanji vẫn cần lặp lại ngắt quãng mỗi ngày — đừng để từ A1.1 phai.</div>
</div>
<a class="link-card exphub" href="/exp-hub/jpd113-cong-cu-hoc?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Công cụ học tiếng Nhật</span><span class="lc-sub">My Language &amp; heyjapan.net — cùng bộ với JPD113.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 1 — ĐỘNG TỪ & THỂ ます ══════════════════ */
    {
      title: 'Chapter 1 — Verbs & the ます-form|||Chương 1 — Động từ & thể ます',
      description: 'Động từ tiếng Nhật, thể lịch sự ます, và cách chia hiện tại/quá khứ, khẳng định/phủ định.',
      lessons: [
        {
          title: '1.1 — The ます-form: present, past, negative|||1.1 — Thể ます: hiện tại, quá khứ, phủ định',
          slug: 'jpd123-dong-tu-masu',
          type: 'VIDEO',
          description: 'Vị trí động từ cuối câu; bảng chia ます/ません/ました/ませんでした; trợ từ を cho tân ngữ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>Verbs — saying what you do</h2>
<p class="lead">Japanese sentences end with the verb, and the polite way to say a verb is the <strong>ます-form</strong>. The beauty: its conjugations are perfectly regular — learn the four endings once and they work for every verb.</p>
<h3>The four polite forms</h3>
<table>
  <thead><tr><th></th><th>Present/Future</th><th>Past</th></tr></thead>
  <tbody>
    <tr><td>Positive</td><td>たべ<b>ます</b> (eat / will eat)</td><td>たべ<b>ました</b> (ate)</td></tr>
    <tr><td>Negative</td><td>たべ<b>ません</b> (do not eat)</td><td>たべ<b>ませんでした</b> (did not eat)</td></tr>
  </tbody>
</table>
<div class="out"><b>Object particle を:</b> the thing the verb acts on is marked with を (written を, read "o"). わたしは ごはん<b>を</b> たべます = I eat rice.</div>

<h3>Ví dụ có lời giải · Worked example</h3>
<div class="out"><b>Say "I did not drink coffee yesterday":</b><br>
1) Time: きのう (yesterday) · 2) Topic: わたしは · 3) Object: コーヒーを · 4) Verb "drink" past-negative: のみませんでした<br>
→ <b>きのう わたしは コーヒーを のみませんでした。</b><br>
Notice the verb (holding tense &amp; negation) sits at the very end.</div>

<h3>Formulas · The polite conjugation &amp; asking questions</h3>
<div class="formula"><span class="lbl">One stem, four endings</span>[stem] + ます / ません / ました / ませんでした    たべ → たべます / たべません / たべました / たべませんでした</div>
<div class="formula"><span class="lbl">Turn any statement into a question</span>add か to the end    たべますか。= "Do you eat?"    答え: はい、たべます。/ いいえ、たべません。</div>
<h3>Ví dụ có lời giải · Q&amp;A worked example</h3>
<div class="out"><b>Q:</b> まいにち にほんごを べんきょうしますか。 ("Do you study Japanese every day?")<br>
<b>A (yes):</b> はい、べんきょうします。   <b>A (no):</b> いいえ、べんきょうしません。<br>
Note: the answer simply reuses the verb in the matching form — there is no "do/does" helper like in English.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The three verb groups &amp; the dictionary form.</b> The ます-form is polite, but every verb also has a plain "dictionary form" (たべる, のむ) — the form you look up and the base for all advanced grammar. Verbs fall into three groups (る-verbs, う-verbs, and two irregulars する/くる) that determine how they conjugate. A1.2 focuses on ます, but knowing the dictionary form and the groups exists is what makes the て-form (Chapter 6) and all of A2 grammar click instead of feeling random.</div>
<a class="link-card codelab" href="/language/ja/grammar?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Drill verb conjugation</span><span class="lc-sub">ます/ません/ました patterns on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Động từ — nói mình làm gì</h2>
<p class="lead">Câu tiếng Nhật kết thúc bằng động từ, và cách lịch sự để nói một động từ là <strong>thể ます</strong>. Cái hay: cách chia của nó hoàn toàn đều — học bốn đuôi một lần và chúng chạy cho mọi động từ.</p>
<h3>Bốn thể lịch sự</h3>
<table>
  <thead><tr><th></th><th>Hiện tại/Tương lai</th><th>Quá khứ</th></tr></thead>
  <tbody>
    <tr><td>Khẳng định</td><td>たべ<b>ます</b> (ăn / sẽ ăn)</td><td>たべ<b>ました</b> (đã ăn)</td></tr>
    <tr><td>Phủ định</td><td>たべ<b>ません</b> (không ăn)</td><td>たべ<b>ませんでした</b> (đã không ăn)</td></tr>
  </tbody>
</table>
<div class="out"><b>Trợ từ tân ngữ を:</b> vật mà động từ tác động được đánh dấu bằng を (viết を, đọc "o"). わたしは ごはん<b>を</b> たべます = Tôi ăn cơm.</div>

<h3>Ví dụ có lời giải</h3>
<div class="out"><b>Nói "Hôm qua tôi đã không uống cà phê":</b><br>
1) Thời gian: きのう (hôm qua) · 2) Chủ đề: わたしは · 3) Tân ngữ: コーヒーを · 4) Động từ "uống" quá-khứ-phủ-định: のみませんでした<br>
→ <b>きのう わたしは コーヒーを のみませんでした。</b><br>
Để ý động từ (mang thì &amp; phủ định) nằm ở tận cuối.</div>

<h3>Công thức · Cách chia lịch sự &amp; đặt câu hỏi</h3>
<div class="formula"><span class="lbl">Một gốc, bốn đuôi</span>[gốc] + ます / ません / ました / ませんでした    たべ → たべます / たべません / たべました / たべませんでした</div>
<div class="formula"><span class="lbl">Biến mọi câu kể thành câu hỏi</span>thêm か vào cuối    たべますか。= "Bạn có ăn không?"    答え (trả lời): はい、たべます。/ いいえ、たべません。</div>
<h3>Ví dụ có lời giải · Hỏi đáp</h3>
<div class="out"><b>Hỏi:</b> まいにち にほんごを べんきょうしますか。 ("Bạn học tiếng Nhật mỗi ngày không?")<br>
<b>Đáp (có):</b> はい、べんきょうします。   <b>Đáp (không):</b> いいえ、べんきょうしません。<br>
Chú ý: câu trả lời chỉ dùng lại động từ ở thể tương ứng — không có trợ động từ "do/does" như tiếng Anh.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Ba nhóm động từ &amp; thể từ điển.</b> Thể ます là lịch sự, nhưng mọi động từ còn có một "thể từ điển" thể ngắn (たべる, のむ) — thể bạn tra từ điển và là gốc cho mọi ngữ pháp nâng cao. Động từ chia thành ba nhóm (động từ る, động từ う, và hai bất quy tắc する/くる) quyết định cách chia. A1.2 tập trung vào ます, nhưng biết thể từ điển và các nhóm tồn tại là điều làm thể て (Chương 6) và toàn bộ ngữ pháp A2 "thấm" thay vì thấy ngẫu nhiên.</div>
<a class="link-card codelab" href="/language/ja/grammar?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Luyện chia động từ</span><span class="lc-sub">Mẫu ます/ません/ました trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 2 — TRỢ TỪ ══════════════════ */
    {
      title: 'Chapter 2 — Particles of motion & action|||Chương 2 — Trợ từ chuyển động & hành động',
      description: 'へ (đích đến), で (nơi/phương tiện), を (tân ngữ), に (thời điểm/đích) — chất keo của câu tiếng Nhật.',
      lessons: [
        {
          title: '2.1 — へ, で, を, に|||2.1 — へ, で, を, に',
          slug: 'jpd123-tro-tu',
          type: 'VIDEO',
          description: 'Mỗi trợ từ đánh dấu vai trò của từ đứng trước; ví dụ đi đâu, làm gì ở đâu, lúc mấy giờ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Particles — the glue that marks roles</h2>
<p class="lead">Japanese word order is flexible because tiny <strong>particles</strong> after each word tell you its <em>role</em> in the sentence, not its position. Master these four and you can build most A1.2 sentences.</p>
<table>
  <thead><tr><th>Particle</th><th>Marks</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td><b>へ / に</b></td><td>destination (go to)</td><td>学校<b>へ</b>行きます (go to school)</td></tr>
    <tr><td><b>で</b></td><td>place of action / means</td><td>図書館<b>で</b>勉強します (study at the library); バス<b>で</b>行きます (go by bus)</td></tr>
    <tr><td><b>を</b></td><td>direct object</td><td>本<b>を</b>読みます (read a book)</td></tr>
    <tr><td><b>に</b></td><td>point in time / target</td><td>7時<b>に</b>起きます (wake up at 7)</td></tr>
  </tbody>
</table>
<div class="out"><b>Full sentence:</b> わたしは あした バスで 学校へ 行きます。= Tomorrow I will go to school by bus. Each particle silently labels its word — remove them and the meaning collapses.</div>

<div class="pitfall"><b>Trap — で vs に for place.</b> Both can follow a place, but they mean different things: <span class="badge">で</span> = where an <em>action</em> happens (公園で遊びます, play in the park); <span class="badge">に</span> = where something <em>exists</em> or a destination (公園にいます, be in the park). Choosing the wrong one is the most common A1.2 mistake.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>は vs が — the topic/subject subtlety.</b> You met は (topic) in JPD113. Its partner が marks the <em>grammatical subject</em>, and choosing between them is one of the deepest, most famous puzzles in Japanese. A rough A1.2 rule: use は for the known topic you are talking <em>about</em>, が to introduce or emphasise new information ("who did it?"). You do not need to master this now — but noticing the difference early makes intermediate Japanese far less confusing.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Trợ từ — chất keo đánh dấu vai trò</h2>
<p class="lead">Trật tự từ tiếng Nhật linh hoạt vì các <strong>trợ từ</strong> tí hon sau mỗi từ cho bạn biết <em>vai trò</em> của nó trong câu, không phải vị trí. Thành thạo bốn cái này và bạn dựng được hầu hết câu A1.2.</p>
<table>
  <thead><tr><th>Trợ từ</th><th>Đánh dấu</th><th>Ví dụ</th></tr></thead>
  <tbody>
    <tr><td><b>へ / に</b></td><td>đích đến (đi tới)</td><td>学校<b>へ</b>行きます (đi tới trường)</td></tr>
    <tr><td><b>で</b></td><td>nơi hành động / phương tiện</td><td>図書館<b>で</b>勉強します (học ở thư viện); バス<b>で</b>行きます (đi bằng xe buýt)</td></tr>
    <tr><td><b>を</b></td><td>tân ngữ trực tiếp</td><td>本<b>を</b>読みます (đọc sách)</td></tr>
    <tr><td><b>に</b></td><td>thời điểm / đích</td><td>7時<b>に</b>起きます (thức dậy lúc 7 giờ)</td></tr>
  </tbody>
</table>
<div class="out"><b>Câu đầy đủ:</b> わたしは あした バスで 学校へ 行きます。= Ngày mai tôi sẽ đi tới trường bằng xe buýt. Mỗi trợ từ âm thầm gán nhãn cho từ của nó — bỏ chúng đi thì nghĩa sụp đổ.</div>

<div class="pitfall"><b>Bẫy — で vs に cho nơi chốn.</b> Cả hai có thể theo sau một nơi, nhưng nghĩa khác nhau: <span class="badge">で</span> = nơi một <em>hành động</em> xảy ra (公園で遊びます, chơi ở công viên); <span class="badge">に</span> = nơi một vật <em>tồn tại</em> hoặc đích đến (公園にいます, ở trong công viên). Chọn nhầm là lỗi A1.2 phổ biến nhất.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>は vs が — sắc thái chủ đề/chủ ngữ.</b> Bạn đã gặp は (chủ đề) ở JPD113. Bạn đồng hành が đánh dấu <em>chủ ngữ ngữ pháp</em>, và chọn giữa chúng là một trong những câu đố sâu, nổi tiếng nhất tiếng Nhật. Quy tắc A1.2 sơ bộ: dùng は cho chủ đề đã biết mà bạn đang nói <em>về</em>, dùng が để giới thiệu hoặc nhấn mạnh thông tin mới ("ai làm?"). Bạn chưa cần thạo cái này bây giờ — nhưng để ý khác biệt sớm làm tiếng Nhật trung cấp bớt rối hơn nhiều.</div>
</div>
`,
        },
        {
          title: 'Quiz 1 — Verbs & particles|||Quiz 1 — Động từ & trợ từ',
          slug: 'jpd123-quiz-1',
          type: 'QUIZ',
          description: 'Kiểm tra thể ます và các trợ từ へ/で/を/に.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'In a Japanese sentence, the verb usually comes…|||Trong câu tiếng Nhật, động từ thường đứng…', options: ['first|||đầu tiên', 'at the very end|||ở tận cuối', 'in the middle|||ở giữa', 'anywhere|||bất kỳ đâu'], correctIndex: 1, points: 1 },
              { question: 'The polite past-negative of たべます (eat) is…|||Thể quá-khứ-phủ-định lịch sự của たべます (ăn) là…', options: ['たべません', 'たべました', 'たべませんでした', 'たべます'], correctIndex: 2, points: 1 },
              { question: 'The particle that marks the direct object (the thing acted on) is…|||Trợ từ đánh dấu tân ngữ trực tiếp (vật bị tác động) là…', options: ['へ', 'を', 'で', 'に'], correctIndex: 1, points: 1 },
              { question: 'To say the place where an action happens (study at the library), use…|||Để nói nơi một hành động xảy ra (học ở thư viện), dùng…', options: ['に', 'で', 'へ', 'を'], correctIndex: 1, points: 1 },
              { question: 'A point in time (wake up AT 7) is marked with…|||Một thời điểm (thức dậy LÚC 7 giờ) được đánh dấu bằng…', options: ['を', 'に', 'で', 'は'], correctIndex: 1, points: 1 },
              { question: 'The ます-form conjugations are notable for being… (beyond-syllabus insight)|||Cách chia thể ます đáng chú ý vì… (gợi ý ngoài giáo trình)', options: ['completely irregular|||hoàn toàn bất quy tắc', 'perfectly regular across all verbs|||hoàn toàn đều với mọi động từ', 'only for one verb|||chỉ cho một động từ', 'never used|||không bao giờ dùng'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 3 — TÍNH TỪ ══════════════════ */
    {
      title: 'Chapter 3 — Adjectives (い & な)|||Chương 3 — Tính từ (い & な)',
      description: 'Hai loại tính từ, cách chúng bổ nghĩa danh từ và làm vị ngữ, và mô tả quê hương bạn.',
      lessons: [
        {
          title: '3.1 — い-adjectives, な-adjectives & describing|||3.1 — Tính từ い, tính từ な & cách mô tả',
          slug: 'jpd123-tinh-tu',
          type: 'VIDEO',
          description: 'Phân biệt hai loại tính từ; cách dùng trước danh từ và cuối câu; phủ định; mô tả quê hương (CLO chính).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Adjectives — describing your world</h2>
<p class="lead">To talk about your hometown (a course goal), you need adjectives. Japanese has <strong>two kinds</strong>, and they behave differently — mixing them up is a classic error, so learn the split clearly.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>い-adjectives</b> end in い: たかい (expensive), おおきい (big), たのしい (fun). They conjugate themselves.</div>
  <div class="lz-layer"><b>な-adjectives</b> need a な before a noun: きれい<b>な</b>まち (a pretty town), しずか<b>な</b>ところ (a quiet place).</div>
</div>
<table>
  <thead><tr><th></th><th>い-adj (たかい)</th><th>な-adj (きれい)</th></tr></thead>
  <tbody>
    <tr><td>Before a noun</td><td>たかい ビル</td><td>きれいな まち</td></tr>
    <tr><td>At sentence end</td><td>ビルは たかいです</td><td>まちは きれいです</td></tr>
    <tr><td>Negative</td><td>たか<b>くない</b>です</td><td>きれい<b>じゃない</b>です</td></tr>
  </tbody>
</table>

<h3>Ví dụ có lời giải · Describe your hometown</h3>
<div class="out"><b>"My hometown is small but very beautiful":</b><br>
わたしの まちは ちいさいですが、とても きれいです。<br>
1) ちいさい = small (い-adj) · 2) が = "but" · 3) とても = very · 4) きれいです = is beautiful (な-adj at sentence end drops な).</div>

<div class="pitfall"><b>Trap:</b> きれい and ゆうめい end in い but are <em>な-adjectives</em>, not い-adjectives (the い is part of the word, not the adjective ending). So it is きれい<b>な</b>はな, never きれいい. A handful of these exceptions must be memorised.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>い-adjectives are secretly verb-like.</b> Unlike English, a Japanese い-adjective conjugates for tense by itself, with no "to be": たかい (is expensive) → たか<b>かった</b> (was expensive). It carries its own past tense the way a verb does — which is why you never say たかいでした for the past. Seeing adjectives as "describing words that conjugate like verbs" removes a huge source of beginner errors.</div>
<a class="link-card codelab" href="/language/ja/vocab?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">Drill adjectives &amp; vocab</span><span class="lc-sub">Vocabulary SRS on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Tính từ — mô tả thế giới của bạn</h2>
<p class="lead">Để nói về quê hương (một mục tiêu môn học), bạn cần tính từ. Tiếng Nhật có <strong>hai loại</strong>, và chúng hành xử khác nhau — lẫn lộn chúng là lỗi kinh điển, nên học rõ sự phân chia.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Tính từ い</b> kết thúc bằng い: たかい (đắt), おおきい (to), たのしい (vui). Chúng tự chia.</div>
  <div class="lz-layer"><b>Tính từ な</b> cần một な trước danh từ: きれい<b>な</b>まち (thị trấn đẹp), しずか<b>な</b>ところ (nơi yên tĩnh).</div>
</div>
<table>
  <thead><tr><th></th><th>Tính từ い (たかい)</th><th>Tính từ な (きれい)</th></tr></thead>
  <tbody>
    <tr><td>Trước danh từ</td><td>たかい ビル</td><td>きれいな まち</td></tr>
    <tr><td>Cuối câu</td><td>ビルは たかいです</td><td>まちは きれいです</td></tr>
    <tr><td>Phủ định</td><td>たか<b>くない</b>です</td><td>きれい<b>じゃない</b>です</td></tr>
  </tbody>
</table>

<h3>Ví dụ có lời giải · Mô tả quê hương</h3>
<div class="out"><b>"Quê tôi nhỏ nhưng rất đẹp":</b><br>
わたしの まちは ちいさいですが、とても きれいです。<br>
1) ちいさい = nhỏ (tính từ い) · 2) が = "nhưng" · 3) とても = rất · 4) きれいです = thì đẹp (tính từ な ở cuối câu bỏ な).</div>

<div class="pitfall"><b>Bẫy:</b> きれい và ゆうめい kết thúc bằng い nhưng là <em>tính từ な</em>, không phải tính từ い (chữ い là một phần của từ, không phải đuôi tính từ). Nên là きれい<b>な</b>はな, không bao giờ きれいい. Vài ngoại lệ này phải học thuộc.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Tính từ い âm thầm giống động từ.</b> Khác tiếng Anh, một tính từ い tiếng Nhật tự chia theo thì, không cần "to be": たかい (đắt) → たか<b>かった</b> (đã đắt). Nó mang thì quá khứ của chính mình như động từ — đó là lý do bạn không bao giờ nói たかいでした cho quá khứ. Xem tính từ như "từ mô tả chia như động từ" loại bỏ một nguồn lỗi lớn của người mới.</div>
<a class="link-card codelab" href="/language/ja/vocab?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">Luyện tính từ &amp; từ vựng</span><span class="lc-sub">Từ vựng SRS trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
        {
          title: '3.2 — Conjugating adjectives: all four forms|||3.2 — Chia tính từ: đủ bốn dạng',
          slug: 'jpd123-tinh-tu-chia-4-dang',
          type: 'VIDEO',
          description: 'Bảng chia đầy đủ: khẳng định, phủ định, quá khứ, phủ định quá khứ — cho cả tính từ い và な.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>The full conjugation table</h2>
<p class="lead">Lesson 3.1 showed you the two adjective types. Now the part that actually gets tested: each type has <strong>four forms</strong>, and the two types build them completely differently. Memorise this table as a block — it is the single most examined thing in this chapter.</p>
<table>
  <thead><tr><th>Form</th><th>い-adjective</th><th>な-adjective</th></tr></thead>
  <tbody>
    <tr><td>Affirmative</td><td>Adj-<b>い</b> + です</td><td>Adj + <b>です</b></td></tr>
    <tr><td>Negative</td><td>Adj (drop い) + <b>くないです</b></td><td>Adj + <b>じゃありません</b></td></tr>
    <tr><td>Past</td><td>Adj (drop い) + <b>かったです</b></td><td>Adj + <b>でした</b></td></tr>
    <tr><td>Past negative</td><td>Adj (drop い) + <b>くなかったです</b></td><td>Adj + <b>じゃありませんでした</b></td></tr>
  </tbody>
</table>
<h3>Worked through with real words</h3>
<div class="out"><b>さむい (cold) — an い-adjective:</b><br>
さむい<b>です</b> = it is cold<br>
さむ<b>くないです</b> = it is not cold<br>
さむ<b>かったです</b> = it was cold<br>
さむ<b>くなかったです</b> = it was not cold<br><br>
<b>しずか (quiet) — a な-adjective:</b><br>
しずか<b>です</b> = it is quiet<br>
しずか<b>じゃありません</b> = it is not quiet<br>
しずか<b>でした</b> = it was quiet<br>
しずか<b>じゃありませんでした</b> = it was not quiet</div>
<div class="note-ct">Notice the pattern behind the pattern: an い-adjective <em>changes its own ending</em> (い → くない → かった), so です just sits on top politely and never changes. A な-adjective does not change at all — instead <b>です itself</b> conjugates (です → じゃありません → でした → じゃありませんでした), exactly like it does after a noun. That is why な-adjectives feel "noun-like" and い-adjectives feel "verb-like".</div>
<div class="pitfall"><b>The number-one error:</b> saying <s>さむいでした</s> for "it was cold". An い-adjective already carries its own past tense (さむかった) — you never put でした after it. でした belongs to な-adjectives and nouns only. Also note the polite variants: じゃありません can also be written/said as <b>ではありません</b> (more formal) or <b>じゃないです</b> (more casual) — all three are correct, but pick one and stay consistent in an exam answer.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>いい (good) is irregular — the one exception you must know.</b> It conjugates from its older form よい, not from いい: good = いいです, but not good = <b>よ</b>くないです, was good = <b>よ</b>かったです, was not good = <b>よ</b>くなかったです. Never いくないです. This matters because いい is one of the highest-frequency adjectives in the language, and かっこいい (cool) inherits the same irregularity: かっこ<b>よ</b>かったです.</div>
<a class="link-card codelab" href="/language/ja/grammar?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Drill adjective conjugation</span><span class="lc-sub">All four forms, both types, on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Bảng chia đầy đủ</h2>
<p class="lead">Bài 3.1 cho bạn hai loại tính từ. Giờ tới phần thực sự bị kiểm tra: mỗi loại có <strong>bốn dạng</strong>, và hai loại xây chúng hoàn toàn khác nhau. Học thuộc bảng này thành một khối — đây là thứ bị kiểm tra nhiều nhất trong chương.</p>
<table>
  <thead><tr><th>Dạng</th><th>Tính từ い</th><th>Tính từ な</th></tr></thead>
  <tbody>
    <tr><td>Khẳng định</td><td>Adj-<b>い</b> + です</td><td>Adj + <b>です</b></td></tr>
    <tr><td>Phủ định</td><td>Adj (bỏ い) + <b>くないです</b></td><td>Adj + <b>じゃありません</b></td></tr>
    <tr><td>Quá khứ</td><td>Adj (bỏ い) + <b>かったです</b></td><td>Adj + <b>でした</b></td></tr>
    <tr><td>Phủ định quá khứ</td><td>Adj (bỏ い) + <b>くなかったです</b></td><td>Adj + <b>じゃありませんでした</b></td></tr>
  </tbody>
</table>
<h3>Làm mẫu với từ thật</h3>
<div class="out"><b>さむい (lạnh) — tính từ い:</b><br>
さむい<b>です</b> = trời lạnh<br>
さむ<b>くないです</b> = trời không lạnh<br>
さむ<b>かったです</b> = trời đã lạnh<br>
さむ<b>くなかったです</b> = trời đã không lạnh<br><br>
<b>しずか (yên tĩnh) — tính từ な:</b><br>
しずか<b>です</b> = yên tĩnh<br>
しずか<b>じゃありません</b> = không yên tĩnh<br>
しずか<b>でした</b> = đã yên tĩnh<br>
しずか<b>じゃありませんでした</b> = đã không yên tĩnh</div>
<div class="note-ct">Để ý quy luật đằng sau quy luật: tính từ い <em>tự đổi đuôi của chính nó</em> (い → くない → かった), nên です chỉ ngồi lên trên cho lịch sự và không bao giờ đổi. Tính từ な thì không đổi gì cả — thay vào đó <b>chính です</b> chia (です → じゃありません → でした → じゃありませんでした), y hệt như sau một danh từ. Đó là lý do tính từ な cho cảm giác "giống danh từ" còn tính từ い "giống động từ".</div>
<div class="pitfall"><b>Lỗi số một:</b> nói <s>さむいでした</s> cho "trời đã lạnh". Tính từ い đã tự mang thì quá khứ (さむかった) — bạn không bao giờ đặt でした sau nó. でした chỉ thuộc về tính từ な và danh từ. Cũng lưu ý các biến thể lịch sự: じゃありません cũng có thể viết/nói là <b>ではありません</b> (trang trọng hơn) hoặc <b>じゃないです</b> (thân mật hơn) — cả ba đều đúng, nhưng chọn một và giữ nhất quán trong một bài thi.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>いい (tốt) bất quy tắc — ngoại lệ duy nhất bạn phải biết.</b> Nó chia từ dạng cổ よい, không phải từ いい: tốt = いいです, nhưng không tốt = <b>よ</b>くないです, đã tốt = <b>よ</b>かったです, đã không tốt = <b>よ</b>くなかったです. Không bao giờ いくないです. Điều này quan trọng vì いい là một trong những tính từ tần suất cao nhất, và かっこいい (ngầu) thừa hưởng cùng sự bất quy tắc: かっこ<b>よ</b>かったです.</div>
<a class="link-card codelab" href="/language/ja/grammar?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Luyện chia tính từ</span><span class="lc-sub">Cả bốn dạng, cả hai loại, trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
        {
          title: '3.3 — Adjectives modifying verbs (く / に)|||3.3 — Tính từ bổ nghĩa động từ (く / に)',
          slug: 'jpd123-tinh-tu-bo-nghia-dong-tu',
          type: 'VIDEO',
          description: 'Biến tính từ thành trạng từ: い → く, な → に, để mô tả CÁCH thực hiện hành động.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>Turning an adjective into "how" — く and に</h2>
<p class="lead">So far adjectives described <em>things</em> (a big house). Now make them describe <em>actions</em> — how something is done. English adds "-ly"; Japanese changes the adjective ending.</p>
<table>
  <thead><tr><th>Type</th><th>Rule</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td>い-adjective</td><td>drop い, add <b>く</b> + verb</td><td>パンを ちいさ<b>く</b> きります。(cut the bread small)</td></tr>
    <tr><td>な-adjective</td><td>add <b>に</b> + verb</td><td>へやを きれい<b>に</b> します。(make the room clean / tidy up)</td></tr>
  </tbody>
</table>
<h3>Compare the three jobs of one adjective</h3>
<div class="out">Using ちいさい (small) three ways:<br>
1. <b>Before a noun:</b> ちいさい パン (small bread)<br>
2. <b>At sentence end:</b> パンは ちいさいです。(the bread is small)<br>
3. <b>Before a verb:</b> パンを ちいさ<b>く</b> きります。(cut the bread small — describes the cutting)<br><br>
Using しずか (quiet) the same three ways:<br>
1. しずかな へや (a quiet room) · 2. へやは しずかです。(the room is quiet) · 3. しずか<b>に</b> はなします。(speak quietly)</div>
<div class="note-ct">The two most useful verbs to pair this with are <b>します</b> (do/make) and <b>なります</b> (become): へやを きれいに します = make the room clean; さむ<b>く</b> なります = it becomes cold; げんき<b>に</b> なります = become healthy/energetic. This "adjective + なります" pattern for describing change is worth learning now — it appears constantly from here on.</div>
<div class="pitfall"><b>Trap:</b> the く/に change is NOT the same as the negative. さむ<b>く</b>ないです (not cold) and さむ<b>く</b> なります (becomes cold) both contain く, but the first is negation (く + ない) and the second is the adverb form (く + verb). Read what comes AFTER the く to tell them apart.</div>
<a class="link-card codelab" href="/language/ja/grammar?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Drill く / に adverb forms</span><span class="lc-sub">Grammar reference on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>Biến tính từ thành "như thế nào" — く và に</h2>
<p class="lead">Tới giờ tính từ mô tả <em>sự vật</em> (ngôi nhà to). Giờ cho chúng mô tả <em>hành động</em> — việc gì đó được làm như thế nào. Tiếng Anh thêm "-ly"; tiếng Nhật đổi đuôi tính từ.</p>
<table>
  <thead><tr><th>Loại</th><th>Quy tắc</th><th>Ví dụ</th></tr></thead>
  <tbody>
    <tr><td>Tính từ い</td><td>bỏ い, thêm <b>く</b> + động từ</td><td>パンを ちいさ<b>く</b> きります。(cắt bánh mì nhỏ ra)</td></tr>
    <tr><td>Tính từ な</td><td>thêm <b>に</b> + động từ</td><td>へやを きれい<b>に</b> します。(làm phòng sạch / dọn phòng)</td></tr>
  </tbody>
</table>
<h3>So sánh ba nhiệm vụ của cùng một tính từ</h3>
<div class="out">Dùng ちいさい (nhỏ) theo ba cách:<br>
1. <b>Trước danh từ:</b> ちいさい パン (bánh mì nhỏ)<br>
2. <b>Cuối câu:</b> パンは ちいさいです。(bánh mì thì nhỏ)<br>
3. <b>Trước động từ:</b> パンを ちいさ<b>く</b> きります。(cắt bánh mì nhỏ ra — mô tả việc cắt)<br><br>
Dùng しずか (yên tĩnh) cũng ba cách đó:<br>
1. しずかな へや (căn phòng yên tĩnh) · 2. へやは しずかです。(phòng thì yên tĩnh) · 3. しずか<b>に</b> はなします。(nói nhỏ nhẹ)</div>
<div class="note-ct">Hai động từ hữu ích nhất để ghép với mẫu này là <b>します</b> (làm) và <b>なります</b> (trở nên): へやを きれいに します = làm phòng sạch; さむ<b>く</b> なります = trời trở lạnh; げんき<b>に</b> なります = trở nên khỏe mạnh. Mẫu "tính từ + なります" để mô tả sự thay đổi rất đáng học ngay bây giờ — nó xuất hiện liên tục từ đây trở đi.</div>
<div class="pitfall"><b>Bẫy:</b> biến đổi く/に KHÔNG giống với phủ định. さむ<b>く</b>ないです (không lạnh) và さむ<b>く</b> なります (trở lạnh) đều chứa く, nhưng cái đầu là phủ định (く + ない) còn cái sau là dạng trạng từ (く + động từ). Đọc phần đứng SAU く để phân biệt.</div>
<a class="link-card codelab" href="/language/ja/grammar?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Luyện dạng trạng từ く / に</span><span class="lc-sub">Tra cứu ngữ pháp trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
        {
          title: '3.4 — Degree words: とても, あまり, すこし, ぜんぜん|||3.4 — Từ chỉ mức độ: とても, あまり, すこし, ぜんぜん',
          slug: 'jpd123-tu-chi-muc-do',
          type: 'VIDEO',
          description: 'Bốn từ chỉ mức độ — và quy tắc sống còn: あまり/ぜんぜん BẮT BUỘC đi với thể phủ định.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.4</span>
<h2>How much? — degree adverbs</h2>
<p class="lead">These four little words sit right before an adjective and set its intensity. Two of them come with an iron rule that exams test relentlessly: they <strong>must</strong> be followed by a negative.</p>
<table>
  <thead><tr><th>Word</th><th>Meaning</th><th>Required form</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td>とても</td><td>very</td><td>affirmative</td><td>とても あついです。(it is very hot)</td></tr>
    <tr><td>すこし</td><td>a little, slightly</td><td>affirmative</td><td>すこし たかいです。(it is a little expensive)</td></tr>
    <tr><td><b>あまり</b></td><td>not very, not much</td><td><b>NEGATIVE required</b></td><td>あまり さむ<b>くないです</b>。(it is not very cold)</td></tr>
    <tr><td><b>ぜんぜん</b></td><td>not at all</td><td><b>NEGATIVE required</b></td><td>ぜんぜん げんき<b>じゃありません</b>。(not energetic at all)</td></tr>
  </tbody>
</table>
<div class="note-ct">Think of あまり and ぜんぜん as <em>half</em> of the meaning: あまり alone means nothing — it only produces "not very" when the negative arrives at the end of the sentence. The intensity scale runs: ぜんぜん…ない (0%) → あまり…ない (a little, ~20%) → すこし (a bit, ~30%) → とても (very, ~90%).</div>
<h3>Ví dụ có lời giải</h3>
<div class="out"><b>Q:</b> ベトナムの ふゆは さむいですか。(Is winter in Vietnam cold?)<br>
<b>A (not very):</b> いいえ、あまり さむくないです。= No, it is not very cold.<br>
<b>A (not at all):</b> いいえ、ぜんぜん さむくないです。= No, it is not cold at all.<br>
<b>A (very):</b> はい、とても さむいです。= Yes, it is very cold.</div>
<div class="pitfall"><b>Trap:</b> writing <s>あまり さむいです</s> is simply ungrammatical, not just "unusual" — an exam blank containing あまり or ぜんぜん is telling you the answer at the other end of the sentence must be negative. Use that as a free hint: spot あまり/ぜんぜん → immediately look for the negative ending among the options.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> In casual modern speech you will hear ぜんぜん used with an <em>affirmative</em> to mean "totally / not a problem at all" (ぜんぜん いいですよ = it's totally fine). This is a recent colloquial development and native speakers still debate it — do NOT use it in JPD123 exams, where only the negative pairing is accepted. Knowing it exists just stops you being confused when you hear it in anime or conversation.</div>
<a class="link-card codelab" href="/language/ja/grammar?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Drill degree adverbs</span><span class="lc-sub">Grammar reference on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.4</span>
<h2>Mức độ bao nhiêu? — trạng từ chỉ mức độ</h2>
<p class="lead">Bốn từ nhỏ này đứng ngay trước tính từ và định cường độ của nó. Hai trong số đó đi kèm một quy tắc sắt mà đề thi kiểm tra không thương tiếc: chúng <strong>bắt buộc</strong> phải theo sau bởi thể phủ định.</p>
<table>
  <thead><tr><th>Từ</th><th>Nghĩa</th><th>Dạng bắt buộc</th><th>Ví dụ</th></tr></thead>
  <tbody>
    <tr><td>とても</td><td>rất</td><td>khẳng định</td><td>とても あついです。(trời rất nóng)</td></tr>
    <tr><td>すこし</td><td>một chút, hơi</td><td>khẳng định</td><td>すこし たかいです。(hơi đắt một chút)</td></tr>
    <tr><td><b>あまり</b></td><td>không...lắm</td><td><b>BẮT BUỘC phủ định</b></td><td>あまり さむ<b>くないです</b>。(trời không lạnh lắm)</td></tr>
    <tr><td><b>ぜんぜん</b></td><td>hoàn toàn không</td><td><b>BẮT BUỘC phủ định</b></td><td>ぜんぜん げんき<b>じゃありません</b>。(hoàn toàn không khỏe)</td></tr>
  </tbody>
</table>
<div class="note-ct">Hãy coi あまり và ぜんぜん như <em>một nửa</em> của nghĩa: あまり đứng một mình không có nghĩa gì — nó chỉ tạo ra "không...lắm" khi thể phủ định xuất hiện ở cuối câu. Thang cường độ chạy: ぜんぜん…ない (0%) → あまり…ない (một chút, ~20%) → すこし (hơi, ~30%) → とても (rất, ~90%).</div>
<h3>Ví dụ có lời giải</h3>
<div class="out"><b>Hỏi:</b> ベトナムの ふゆは さむいですか。(Mùa đông ở Việt Nam có lạnh không?)<br>
<b>Đáp (không lắm):</b> いいえ、あまり さむくないです。= Không, không lạnh lắm.<br>
<b>Đáp (hoàn toàn không):</b> いいえ、ぜんぜん さむくないです。= Không, hoàn toàn không lạnh.<br>
<b>Đáp (rất):</b> はい、とても さむいです。= Có, rất lạnh.</div>
<div class="pitfall"><b>Bẫy:</b> viết <s>あまり さむいです</s> là sai ngữ pháp hẳn, không chỉ "không tự nhiên" — một chỗ trống trong đề có chứa あまり hoặc ぜんぜん đang mách bạn rằng đáp án ở đầu kia của câu phải là phủ định. Dùng điều đó như gợi ý miễn phí: thấy あまり/ぜんぜん → lập tức tìm đuôi phủ định trong các phương án.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> Trong khẩu ngữ hiện đại bạn sẽ nghe ぜんぜん dùng với <em>khẳng định</em> để nghĩa là "hoàn toàn ổn / không vấn đề gì" (ぜんぜん いいですよ = hoàn toàn ổn mà). Đây là cách dùng khẩu ngữ mới xuất hiện và người bản xứ vẫn tranh cãi — TUYỆT ĐỐI KHÔNG dùng trong đề thi JPD123, nơi chỉ chấp nhận cặp với phủ định. Biết nó tồn tại chỉ để bạn không bối rối khi nghe trong anime hay hội thoại.</div>
<a class="link-card codelab" href="/language/ja/grammar?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Luyện trạng từ chỉ mức độ</span><span class="lc-sub">Tra cứu ngữ pháp trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
        {
          title: '3.5 — Connectives: が, しかし, そして, でも, それから|||3.5 — Liên từ: が, しかし, そして, でも, それから',
          slug: 'jpd123-lien-tu',
          type: 'VIDEO',
          description: 'Năm từ nối câu — cái nào nối TRONG một câu, cái nào mở đầu câu mới, và mức trang trọng của từng cái.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.5</span>
<h2>Joining sentences — five connectives</h2>
<p class="lead">Once you can describe things, you need to link descriptions: "small <em>but</em> beautiful", "quiet <em>and</em> clean". Japanese splits this job across five words, and the key difference is <strong>where each one sits</strong>.</p>
<table>
  <thead><tr><th>Word</th><th>Meaning</th><th>Position</th><th>Register</th></tr></thead>
  <tbody>
    <tr><td>が</td><td>but</td><td><b>inside</b> one sentence: Clause1 が Clause2</td><td>neutral, most common</td></tr>
    <tr><td>しかし</td><td>however</td><td>starts a NEW sentence</td><td>formal, written</td></tr>
    <tr><td>でも</td><td>but</td><td>starts a NEW sentence</td><td>casual, spoken</td></tr>
    <tr><td>そして</td><td>and</td><td>starts a NEW sentence</td><td>neutral</td></tr>
    <tr><td>それから</td><td>and then, after that</td><td>starts a NEW sentence</td><td>neutral — implies sequence</td></tr>
  </tbody>
</table>
<h3>The same idea, five ways</h3>
<div class="out"><b>Inside one sentence (が):</b><br>
わたしの まちは ちいさいです<b>が</b>、とても きれいです。= My town is small, but very beautiful.<br><br>
<b>Two sentences (でも / しかし):</b><br>
わたしの まちは ちいさいです。<b>でも</b>、とても きれいです。(casual)<br>
わたしの まちは ちいさいです。<b>しかし</b>、とても きれいです。(formal/written)<br><br>
<b>Adding (そして) vs sequencing (それから):</b><br>
へやは しずかです。<b>そして</b>、きれいです。= The room is quiet. And it is clean. (two facts)<br>
ごはんを たべました。<b>それから</b>、テレビを 見ました。= I ate. After that, I watched TV. (order matters)</div>
<div class="note-ct">The clean way to remember: <b>が glues two halves into ONE sentence</b> (there is a comma after it, never a full stop), while the other four <b>begin a new sentence</b> after a full stop 。 If a question shows a full stop before the blank, が is wrong; if it shows a comma mid-sentence, が is likely right.</div>
<div class="pitfall"><b>Trap — が has two completely different jobs.</b> The が in ちいさいです<b>が</b>、きれいです means "but" (a connective). The が in ねこ<b>が</b> います means "subject marker" (a particle, JPD113 Chapter 5). Same character, unrelated roles — tell them apart by position: after a full clause ending in です/ます → "but"; directly after a noun → subject marker.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> それから also works <em>inside</em> a list to mean "and also, additionally": コーヒーと、それから ケーキを ください。(Coffee, and also cake, please.) That gives you a natural way to add one more item to an order after you have already started speaking — a genuinely useful restaurant phrase that textbooks rarely spell out.</div>
<a class="link-card codelab" href="/language/ja/grammar?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Drill connectives</span><span class="lc-sub">Grammar reference on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.5</span>
<h2>Nối câu — năm liên từ</h2>
<p class="lead">Khi đã mô tả được sự vật, bạn cần nối các mô tả lại: "nhỏ <em>nhưng</em> đẹp", "yên tĩnh <em>và</em> sạch". Tiếng Nhật chia việc này cho năm từ, và khác biệt then chốt là <strong>mỗi từ đứng ở đâu</strong>.</p>
<table>
  <thead><tr><th>Từ</th><th>Nghĩa</th><th>Vị trí</th><th>Sắc thái</th></tr></thead>
  <tbody>
    <tr><td>が</td><td>nhưng</td><td><b>bên trong</b> một câu: Vế1 が Vế2</td><td>trung tính, phổ biến nhất</td></tr>
    <tr><td>しかし</td><td>tuy nhiên</td><td>mở đầu câu MỚI</td><td>trang trọng, văn viết</td></tr>
    <tr><td>でも</td><td>nhưng</td><td>mở đầu câu MỚI</td><td>thân mật, khẩu ngữ</td></tr>
    <tr><td>そして</td><td>và</td><td>mở đầu câu MỚI</td><td>trung tính</td></tr>
    <tr><td>それから</td><td>và sau đó</td><td>mở đầu câu MỚI</td><td>trung tính — hàm ý trình tự</td></tr>
  </tbody>
</table>
<h3>Cùng một ý, năm cách</h3>
<div class="out"><b>Trong một câu (が):</b><br>
わたしの まちは ちいさいです<b>が</b>、とても きれいです。= Quê tôi nhỏ, nhưng rất đẹp.<br><br>
<b>Hai câu (でも / しかし):</b><br>
わたしの まちは ちいさいです。<b>でも</b>、とても きれいです。(thân mật)<br>
わたしの まちは ちいさいです。<b>しかし</b>、とても きれいです。(trang trọng/văn viết)<br><br>
<b>Bổ sung (そして) vs trình tự (それから):</b><br>
へやは しずかです。<b>そして</b>、きれいです。= Phòng yên tĩnh. Và nó sạch. (hai sự thật)<br>
ごはんを たべました。<b>それから</b>、テレビを 見ました。= Tôi đã ăn. Sau đó, tôi xem TV. (thứ tự quan trọng)</div>
<div class="note-ct">Cách nhớ gọn: <b>が dán hai nửa thành MỘT câu</b> (sau nó là dấu phẩy, không bao giờ là dấu chấm), còn bốn từ kia <b>mở đầu một câu mới</b> sau dấu chấm 。 Nếu câu hỏi có dấu chấm trước chỗ trống thì が sai; nếu có dấu phẩy giữa câu thì が nhiều khả năng đúng.</div>
<div class="pitfall"><b>Bẫy — が có hai vai trò hoàn toàn khác nhau.</b> Chữ が trong ちいさいです<b>が</b>、きれいです nghĩa là "nhưng" (liên từ). Chữ が trong ねこ<b>が</b> います là "trợ từ chủ ngữ" (JPD113 Chương 5). Cùng một ký tự, vai trò không liên quan — phân biệt bằng vị trí: sau một vế hoàn chỉnh kết thúc bằng です/ます → "nhưng"; ngay sau một danh từ → trợ từ chủ ngữ.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> それから cũng dùng được <em>bên trong</em> một danh sách với nghĩa "và thêm nữa": コーヒーと、それから ケーキを ください。(Cho tôi cà phê, và thêm bánh ngọt nữa.) Điều đó cho bạn một cách tự nhiên để gọi thêm một món sau khi đã bắt đầu nói — một câu thực sự hữu ích trong nhà hàng mà giáo trình hiếm khi nói rõ.</div>
<a class="link-card codelab" href="/language/ja/grammar?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Luyện liên từ</span><span class="lc-sub">Tra cứu ngữ pháp trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
        {
          title: 'Grammar Summary — Chapter 3|||Tóm tắt ngữ pháp — Chương 3',
          slug: 'jpd123-nguphap-chuong3',
          type: 'VIDEO',
          description: 'Gom toàn bộ hệ tính từ: hai loại, bốn dạng chia, ba vị trí dùng, mức độ và liên từ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Grammar Summary</span>
<h2>Everything from Chapter 3, in one place</h2>
<p class="lead">Adjectives are the biggest new system in A1.2 after verbs. This page puts the whole thing side by side — come back here before the quiz and before the exam.</p>
<h3>1. The four conjugated forms</h3>
<table>
  <thead><tr><th>Form</th><th>い-adj (さむい)</th><th>な-adj (しずか)</th></tr></thead>
  <tbody>
    <tr><td>Affirmative</td><td>さむいです</td><td>しずかです</td></tr>
    <tr><td>Negative</td><td>さむくないです</td><td>しずかじゃありません</td></tr>
    <tr><td>Past</td><td>さむかったです</td><td>しずかでした</td></tr>
    <tr><td>Past negative</td><td>さむくなかったです</td><td>しずかじゃありませんでした</td></tr>
  </tbody>
</table>
<h3>2. The three positions an adjective can occupy</h3>
<table>
  <thead><tr><th>Position</th><th>い-adj</th><th>な-adj</th></tr></thead>
  <tbody>
    <tr><td>Before a noun</td><td>あたらしい くるま</td><td>ゆうめい<b>な</b> ひと</td></tr>
    <tr><td>At sentence end</td><td>くるまは あたらしいです</td><td>ひとは ゆうめいです <small>(な disappears)</small></td></tr>
    <tr><td>Before a verb</td><td>ちいさ<b>く</b> きります</td><td>きれい<b>に</b> します</td></tr>
  </tbody>
</table>
<h3>3. Degree &amp; connectives</h3>
<table>
  <thead><tr><th>Group</th><th>Members</th><th>Rule</th></tr></thead>
  <tbody>
    <tr><td>Degree — affirmative</td><td>とても (very), すこし (a little)</td><td>normal affirmative adjective</td></tr>
    <tr><td>Degree — negative only</td><td>あまり (not very), ぜんぜん (not at all)</td><td><b>must</b> end in a negative</td></tr>
    <tr><td>Connective inside a sentence</td><td>が (but)</td><td>Clause1 が、Clause2 — comma, no full stop</td></tr>
    <tr><td>Connectives starting a sentence</td><td>しかし (formal but), でも (casual but), そして (and), それから (and then)</td><td>come after 。at the head of the next sentence</td></tr>
  </tbody>
</table>
<h3>Ví dụ có lời giải · Everything at once</h3>
<div class="out">わたしの まちは ちいさいですが、とても きれいです。ふゆは あまり さむくなかったです。でも、なつは とても あついです。<br>
= My town is small but very beautiful. The winter was not very cold. But the summer is very hot.<br>
Spot each piece: ちいさいです<b>が</b> (connective inside the sentence) · <b>とても</b> きれいです (degree + な-adj at sentence end) · <b>あまり</b> さむ<b>くなかった</b>です (negative-only degree word + い-adj past negative) · <b>でも</b> (connective starting a new sentence).</div>
<div class="callout"><span class="badge">★ Exam tip</span> The single highest-value drill for this chapter: take five い-adjectives and five な-adjectives you actually know, and write all four forms of each from memory. Ten words × four forms = forty lines that cover most of what this chapter can ask you.</div>
<a class="link-card codelab" href="/language/ja/grammar?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Review all Chapter 3 patterns</span><span class="lc-sub">Grammar reference on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Tóm tắt ngữ pháp</span>
<h2>Toàn bộ Chương 3, gom vào một chỗ</h2>
<p class="lead">Tính từ là hệ thống mới lớn nhất trong A1.2 sau động từ. Trang này đặt toàn bộ cạnh nhau — quay lại đây trước khi làm quiz và trước khi thi.</p>
<h3>1. Bốn dạng chia</h3>
<table>
  <thead><tr><th>Dạng</th><th>Tính từ い (さむい)</th><th>Tính từ な (しずか)</th></tr></thead>
  <tbody>
    <tr><td>Khẳng định</td><td>さむいです</td><td>しずかです</td></tr>
    <tr><td>Phủ định</td><td>さむくないです</td><td>しずかじゃありません</td></tr>
    <tr><td>Quá khứ</td><td>さむかったです</td><td>しずかでした</td></tr>
    <tr><td>Phủ định quá khứ</td><td>さむくなかったです</td><td>しずかじゃありませんでした</td></tr>
  </tbody>
</table>
<h3>2. Ba vị trí một tính từ có thể đứng</h3>
<table>
  <thead><tr><th>Vị trí</th><th>Tính từ い</th><th>Tính từ な</th></tr></thead>
  <tbody>
    <tr><td>Trước danh từ</td><td>あたらしい くるま</td><td>ゆうめい<b>な</b> ひと</td></tr>
    <tr><td>Cuối câu</td><td>くるまは あたらしいです</td><td>ひとは ゆうめいです <small>(な biến mất)</small></td></tr>
    <tr><td>Trước động từ</td><td>ちいさ<b>く</b> きります</td><td>きれい<b>に</b> します</td></tr>
  </tbody>
</table>
<h3>3. Mức độ &amp; liên từ</h3>
<table>
  <thead><tr><th>Nhóm</th><th>Thành viên</th><th>Quy tắc</th></tr></thead>
  <tbody>
    <tr><td>Mức độ — khẳng định</td><td>とても (rất), すこし (một chút)</td><td>tính từ khẳng định bình thường</td></tr>
    <tr><td>Mức độ — chỉ phủ định</td><td>あまり (không...lắm), ぜんぜん (hoàn toàn không)</td><td><b>bắt buộc</b> kết thúc bằng phủ định</td></tr>
    <tr><td>Liên từ trong câu</td><td>が (nhưng)</td><td>Vế1 が、Vế2 — dấu phẩy, không dấu chấm</td></tr>
    <tr><td>Liên từ mở đầu câu</td><td>しかし (nhưng, trang trọng), でも (nhưng, thân mật), そして (và), それから (và sau đó)</td><td>đứng sau 。ở đầu câu tiếp theo</td></tr>
  </tbody>
</table>
<h3>Ví dụ có lời giải · Tất cả cùng lúc</h3>
<div class="out">わたしの まちは ちいさいですが、とても きれいです。ふゆは あまり さむくなかったです。でも、なつは とても あついです。<br>
= Quê tôi nhỏ nhưng rất đẹp. Mùa đông đã không lạnh lắm. Nhưng mùa hè thì rất nóng.<br>
Nhận diện từng mảnh: ちいさいです<b>が</b> (liên từ trong câu) · <b>とても</b> きれいです (mức độ + tính từ な cuối câu) · <b>あまり</b> さむ<b>くなかった</b>です (từ mức độ chỉ-phủ-định + tính từ い phủ định quá khứ) · <b>でも</b> (liên từ mở đầu câu mới).</div>
<div class="callout"><span class="badge">★ Mẹo thi</span> Bài luyện giá trị nhất cho chương này: lấy năm tính từ い và năm tính từ な bạn thực sự biết, rồi viết cả bốn dạng của mỗi từ từ trí nhớ. Mười từ × bốn dạng = bốn mươi dòng phủ gần hết những gì chương này có thể hỏi bạn.</div>
<a class="link-card codelab" href="/language/ja/grammar?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Ôn lại toàn bộ mẫu câu Chương 3</span><span class="lc-sub">Tra cứu ngữ pháp trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 4 — MỜI RỦ & THỜI GIAN ══════════════════ */
    {
      title: 'Chapter 4 — Invitations, time & counting|||Chương 4 — Mời rủ, thời gian & đếm đồ vật',
      description: 'Rủ bạn làm gì đó (～ませんか), đề xuất cùng làm (～ましょう), nói giờ/ngày đầy đủ, và trợ số đếm đồ vật (助数詞).',
      lessons: [
        {
          title: '4.1 — ～ませんか, ～ましょう & telling time|||4.1 — ～ませんか, ～ましょう & nói giờ',
          slug: 'jpd123-moi-ru',
          type: 'VIDEO',
          description: 'Rủ lịch sự bằng ～ませんか; đề xuất "cùng làm" bằng ～ましょう; và cách nói giờ/ngày tháng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Inviting a friend — the social heart of A1.2</h2>
<p class="lead">A course goal is inviting someone to an activity and agreeing on a plan. Two verb endings do almost all the work, and they are beautifully simple: just swap the ます ending.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>～ませんか</b> — "won't you…? / shall we…?" a polite invitation. いっしょに たべ<b>ませんか</b> = Won't you eat with me?</div>
  <div class="lz-layer"><b>～ましょう</b> — "let's…!" agreeing / proposing to do together. たべ<b>ましょう</b> = Let's eat!</div>
</div>
<div class="out"><b>A tiny dialogue:</b><br>
A: しゅうまつ えいがを 見<b>ませんか</b>。(Won't you watch a movie this weekend?)<br>
B: いいですね。見<b>ましょう</b>。(Sounds good. Let's watch!)</div>

<h3>Telling time &amp; dates</h3>
<p>Time uses に (Chapter 2): number + じ (o'clock), number + ふん/ぷん (minutes). なんじ = what time. Days of the week end in ようび (げつようび = Monday). Combine with a verb: 9<b>時に</b> はじまります (starts at 9).</p>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The politeness ladder — why ～ませんか sounds kind.</b> Japanese encodes respect in grammar. A blunt command (食べろ! "Eat!") is rude; an invitation phrased as a <em>negative question</em> (食べませんか, literally "won't you eat?") is softer because it gives the other person room to decline without losing face. This indirectness is central to Japanese politeness (keigo), which you will study fully later — but noticing now <em>why</em> a negative question feels polite makes the whole language make more human sense.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Mời một người bạn — trái tim xã hội của A1.2</h2>
<p class="lead">Một mục tiêu môn học là mời ai đó tham gia hoạt động và thống nhất kế hoạch. Hai đuôi động từ làm gần hết việc, và chúng đơn giản tuyệt đẹp: chỉ đổi đuôi ます.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>～ませんか</b> — "bạn có… không? / chúng ta… nhé?" một lời mời lịch sự. いっしょに たべ<b>ませんか</b> = Bạn ăn cùng tôi không?</div>
  <div class="lz-layer"><b>～ましょう</b> — "cùng… nào!" đồng ý / đề xuất cùng làm. たべ<b>ましょう</b> = Cùng ăn nào!</div>
</div>
<div class="out"><b>Một đoạn hội thoại nhỏ:</b><br>
A: しゅうまつ えいがを 見<b>ませんか</b>。(Cuối tuần xem phim không?)<br>
B: いいですね。見<b>ましょう</b>。(Hay đấy. Cùng xem nào!)</div>

<h3>Nói giờ &amp; ngày</h3>
<p>Thời gian dùng に (Chương 2): số + じ (giờ), số + ふん/ぷん (phút). なんじ = mấy giờ. Thứ trong tuần kết thúc bằng ようび (げつようび = Thứ Hai). Ghép với động từ: 9<b>時に</b> はじまります (bắt đầu lúc 9 giờ).</p>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Thang lịch sự — vì sao ～ませんか nghe tử tế.</b> Tiếng Nhật mã hóa sự tôn trọng vào ngữ pháp. Một mệnh lệnh cộc lốc (食べろ! "Ăn đi!") là thô lỗ; một lời mời diễn đạt dưới dạng <em>câu hỏi phủ định</em> (食べませんか, nghĩa đen "bạn không ăn à?") thì mềm hơn vì cho người kia không gian từ chối mà không mất mặt. Sự gián tiếp này là trung tâm của phép lịch sự Nhật (keigo), bạn sẽ học đầy đủ sau — nhưng để ý bây giờ <em>vì sao</em> một câu hỏi phủ định nghe lịch sự làm cả ngôn ngữ có ý nghĩa "con người" hơn.</div>
</div>
`,
        },
        {
          title: '4.2 — Counting things & telling the time in full|||4.2 — Đếm đồ vật & nói giờ đầy đủ',
          slug: 'jpd123-dem-thoi-gian',
          type: 'VIDEO',
          description: 'Trợ số đếm (助数詞): つ chung, người 人, vật dẹt 枚, vật dài 本, sách 冊, cốc 杯; bảng giờ/phút đầy đủ (bất quy tắc よじ/しちじ/くじ + rendaku); mẫu hỏi đáp なんじ/なんぼん.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>Counting things — and the full clock</h2>
<p class="lead">Japanese does not simply say "three books." It picks a <strong>counter word</strong> (助数詞) that matches the <em>shape or category</em> of the thing, and the sounds shift with rendaku. Together with the complete clock, this is the everyday numeracy A1.2 expects — and it is the single topic beginners most often skip and later regret.</p>

<h3>The generic counter — つ (1–10)</h3>
<p>When you do not know the specific counter, the native <b>つ</b> series works for most physical objects up to ten — a reliable fallback.</p>
<div class="formula"><span class="lbl">ひとつ・ふたつ… (generic things)</span>1 ひとつ  2 ふたつ  3 みっつ  4 よっつ  5 いつつ<br>6 むっつ  7 ななつ  8 やっつ  9 ここのつ  10 とお</div>

<h3>Specific counters (助数詞)</h3>
<table>
  <thead><tr><th>Counter</th><th>Used for</th><th>Irregular readings to memorise</th></tr></thead>
  <tbody>
    <tr><td><b>～人 (にん)</b></td><td>people</td><td>1 <b>ひとり</b>, 2 <b>ふたり</b>, then 3 さんにん, 4 よにん…</td></tr>
    <tr><td><b>～枚 (まい)</b></td><td>flat things — paper, tickets, shirts</td><td>fully regular: いちまい, にまい, さんまい…</td></tr>
    <tr><td><b>～本 (ほん)</b></td><td>long things — pens, bottles, umbrellas</td><td>1 <b>いっぽん</b>, 3 <b>さんぼん</b>, 6 <b>ろっぽん</b>, 8 <b>はっぽん</b></td></tr>
    <tr><td><b>～冊 (さつ)</b></td><td>bound things — books, notebooks</td><td>1 <b>いっさつ</b>, 8 <b>はっさつ</b>, 10 じゅっさつ</td></tr>
    <tr><td><b>～杯 (はい)</b></td><td>cupfuls — coffee, tea, bowls of rice</td><td>1 <b>いっぱい</b>, 3 <b>さんばい</b>, 6 <b>ろっぱい</b></td></tr>
  </tbody>
</table>
<div class="formula"><span class="lbl">Counting-sentence pattern</span>[thing]を [number+counter] [verb]    りんごを みっつ ください = "please give me 3 apples"</div>

<h3>Telling the time — every reading</h3>
<p>Hours take ～じ, minutes take ～ふん/～ぷん. A few readings are irregular and must be memorised — they are the ones learners get wrong most.</p>
<div class="formula"><span class="lbl">Irregular hours (時)</span>4時 <b>よじ</b>    7時 <b>しちじ</b>    9時 <b>くじ</b>    (all others regular: 1 いちじ, 2 にじ, 3 さんじ…)</div>
<div class="formula"><span class="lbl">Minutes (分) — small-tsu &amp; rendaku</span>1 いっぷん  3 さんぷん  4 よんぷん  6 ろっぷん  8 はっぷん  10 じゅっぷん<br>(2 にふん, 5 ごふん, 7 ななふん stay plain · はん = "half past")</div>

<h3>Ví dụ có lời giải · Worked examples (with Q&amp;A)</h3>
<div class="out"><b>Q&amp;A — how many?</b><br>
Q: ペンが なん<b>ぼん</b> ありますか。 ("How many pens are there?")<br>
A: さん<b>ぼん</b> あります。 ("There are three.")  — 3 + 本 = さんぼん (rendaku).</div>
<div class="out"><b>Q&amp;A — what time?</b><br>
Q: いま なんじですか。 ("What time is it now?")  A: <b>よじ</b>はんです。 ("It is half past four.")<br>
Q: なんじに はじまりますか。 ("What time does it start?")  A: <b>くじ じゅっぷん</b>に はじまります。 ("It starts at 9:10.")</div>

<div class="pitfall"><b>Trap — the counter reshapes the number.</b> The number is not read the same before every counter: 3 alone is さん, but "3 bottles" is さん<b>ぼん</b> and "3 cups" is さん<b>ばい</b>. The 1 / 6 / 8 / 10 group especially triggers a small tsu (っ) and rendaku. No rule removes the memorising — only repetition does.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Why does Japanese need so many counters?</b> Counters classify nouns by shape and category — a feature Japanese shares with Chinese and other Asian languages but not English. There are hundreds (～台 for machines, ～匹 for small animals, ～階 for floors), yet daily life runs on about a dozen. When stuck, the generic つ series (up to 9) is an accepted fallback for most objects — the one safety net worth memorising first.</div>
<a class="link-card codelab" href="/language/ja/vocab?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">🔢</span>
  <span class="lc-body"><span class="lc-title">Drill counters &amp; time</span><span class="lc-sub">Number &amp; counter vocabulary SRS on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Đếm đồ vật — và đồng hồ đầy đủ</h2>
<p class="lead">Tiếng Nhật không chỉ nói "ba quyển sách." Nó chọn một <strong>trợ số đếm (助数詞)</strong> khớp với <em>hình dạng hoặc loại</em> của vật, và âm đọc đổi theo rendaku (biến âm). Cùng với đồng hồ đầy đủ, đây là kỹ năng số học đời thường mà A1.2 mong đợi — và là chủ đề người mới hay bỏ qua nhất rồi sau tiếc.</p>

<h3>Trợ số chung — つ (1–10)</h3>
<p>Khi chưa biết trợ số cụ thể, chuỗi bản ngữ <b>つ</b> dùng được cho hầu hết đồ vật tới mười — một cách dự phòng đáng tin.</p>
<div class="formula"><span class="lbl">ひとつ・ふたつ… (vật chung)</span>1 ひとつ  2 ふたつ  3 みっつ  4 よっつ  5 いつつ<br>6 むっつ  7 ななつ  8 やっつ  9 ここのつ  10 とお</div>

<h3>Trợ số cụ thể (助数詞)</h3>
<table>
  <thead><tr><th>Trợ số</th><th>Dùng cho</th><th>Âm bất quy tắc phải thuộc</th></tr></thead>
  <tbody>
    <tr><td><b>～人 (にん)</b></td><td>người</td><td>1 <b>ひとり</b>, 2 <b>ふたり</b>, rồi 3 さんにん, 4 よにん…</td></tr>
    <tr><td><b>～枚 (まい)</b></td><td>vật dẹt — giấy, vé, áo</td><td>hoàn toàn đều: いちまい, にまい, さんまい…</td></tr>
    <tr><td><b>～本 (ほん)</b></td><td>vật dài — bút, chai, ô</td><td>1 <b>いっぽん</b>, 3 <b>さんぼん</b>, 6 <b>ろっぽん</b>, 8 <b>はっぽん</b></td></tr>
    <tr><td><b>～冊 (さつ)</b></td><td>vật đóng gáy — sách, vở</td><td>1 <b>いっさつ</b>, 8 <b>はっさつ</b>, 10 じゅっさつ</td></tr>
    <tr><td><b>～杯 (はい)</b></td><td>cốc/chén — cà phê, trà, bát cơm</td><td>1 <b>いっぱい</b>, 3 <b>さんばい</b>, 6 <b>ろっぱい</b></td></tr>
  </tbody>
</table>
<div class="formula"><span class="lbl">Mẫu câu đếm</span>[vật]を [số+trợ số] [động từ]    りんごを みっつ ください = "cho tôi 3 quả táo"</div>

<h3>Nói giờ — mọi cách đọc</h3>
<p>Giờ dùng ～じ, phút dùng ～ふん/～ぷん. Vài cách đọc bất quy tắc phải học thuộc — chúng là những chỗ người học sai nhiều nhất.</p>
<div class="formula"><span class="lbl">Giờ bất quy tắc (時)</span>4時 <b>よじ</b>    7時 <b>しちじ</b>    9時 <b>くじ</b>    (còn lại đều: 1 いちじ, 2 にじ, 3 さんじ…)</div>
<div class="formula"><span class="lbl">Phút (分) — tsu nhỏ &amp; rendaku</span>1 いっぷん  3 さんぷん  4 よんぷん  6 ろっぷん  8 はっぷん  10 じゅっぷん<br>(2 にふん, 5 ごふん, 7 ななふん giữ nguyên · はん = "rưỡi")</div>

<h3>Ví dụ có lời giải · Giải từng bước (kèm hỏi đáp)</h3>
<div class="out"><b>Hỏi đáp — bao nhiêu cái?</b><br>
Hỏi: ペンが なん<b>ぼん</b> ありますか。 ("Có bao nhiêu cây bút?")<br>
Đáp: さん<b>ぼん</b> あります。 ("Có ba cây.")  — 3 + 本 = さんぼん (biến âm).</div>
<div class="out"><b>Hỏi đáp — mấy giờ?</b><br>
Hỏi: いま なんじですか。 ("Bây giờ mấy giờ?")  Đáp: <b>よじ</b>はんです。 ("Bốn giờ rưỡi.")<br>
Hỏi: なんじに はじまりますか。 ("Mấy giờ bắt đầu?")  Đáp: <b>くじ じゅっぷん</b>に はじまります。 ("Bắt đầu lúc 9 giờ 10.")</div>

<div class="pitfall"><b>Bẫy — trợ số làm đổi âm của số.</b> Số không đọc giống nhau trước mọi trợ số: 3 đứng một mình là さん, nhưng "3 chai" là さん<b>ぼん</b> và "3 cốc" là さん<b>ばい</b>. Nhóm 1 / 6 / 8 / 10 đặc biệt gây tsu nhỏ (っ) và biến âm. Không luật nào bỏ được việc học thuộc — chỉ luyện lặp mới xong.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Vì sao tiếng Nhật cần nhiều trợ số đến vậy?</b> Trợ số phân loại danh từ theo hình dạng và loại — đặc điểm tiếng Nhật chia sẻ với tiếng Trung và nhiều ngôn ngữ châu Á nhưng tiếng Anh thì không. Có hàng trăm cái (～台 cho máy móc, ～匹 cho động vật nhỏ, ～階 cho tầng lầu), nhưng đời thường chạy bằng khoảng một tá. Khi bí, chuỗi つ chung (tới 9) là cách dự phòng được chấp nhận cho hầu hết đồ vật — cái lưới an toàn đầu tiên đáng thuộc.</div>
<a class="link-card codelab" href="/language/ja/vocab?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">🔢</span>
  <span class="lc-body"><span class="lc-title">Luyện trợ số &amp; giờ</span><span class="lc-sub">Từ vựng số &amp; trợ số SRS trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 5 — MONG MUỐN, SỞ THÍCH & MỤC ĐÍCH (Dekiru Bài 5) ══════════════════ */
    {
      title: 'Chapter 5 — Wishes, likes & purpose|||Chương 5 — Mong muốn, sở thích & mục đích',
      description: 'Nói điều bạn MUỐN (ほしい / ～たい), đi đâu để LÀM GÌ (～に いきます), điều bạn THÍCH (が すき), và lý do (から).',
      lessons: [
        {
          title: '5.1 — Wanting things & wanting to do (ほしい / ～たい)|||5.1 — Muốn có & muốn làm (ほしい / ～たい)',
          slug: 'jpd123-mong-muon',
          type: 'VIDEO',
          description: 'N が ほしいです (muốn có một vật) vs V-たいです (muốn làm một việc) — hai mẫu khác nhau, đều chia như tính từ い.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Two ways to say "I want"</h2>
<p class="lead">English uses one word — "want" — for both a <em>thing</em> and an <em>action</em>. Japanese splits them into two completely different patterns. Choosing the wrong one is an instant error, so learn the split first.</p>
<table>
  <thead><tr><th>You want…</th><th>Pattern</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td>a THING (noun)</td><td>N <b>が ほしいです</b></td><td>くるま<b>が</b> ほしいです。(I want a car)</td></tr>
    <tr><td>to DO something (verb)</td><td>V-stem + <b>たいです</b></td><td>にほんへ 行き<b>たいです</b>。(I want to go to Japan)</td></tr>
  </tbody>
</table>
<h3>1. N が ほしいです — wanting a thing</h3>
<div class="out">わたしは あたらしい かばん<b>が</b> ほしいです。= I want a new bag.<br>
<b>The particle must be が, never を.</b> Even though "a bag" feels like an object in English, ほしい is an <em>adjective</em> ("desirable"), not a verb — and adjectives take が, not を.</div>
<h3>2. V-たいです — wanting to do something</h3>
<div class="out">Take the ます-form, drop ます, add たい:<br>
行き<s>ます</s> → 行き<b>たいです</b> (want to go) · 食べ<s>ます</s> → 食べ<b>たいです</b> (want to eat) · 見<s>ます</s> → 見<b>たいです</b> (want to watch)<br><br>
なにを し<b>たいですか</b>。= What do you want to do?<br>
どこへ 行き<b>たいですか</b>。= Where do you want to go?</div>
<h3>Both conjugate like an い-adjective</h3>
<table>
  <thead><tr><th>Form</th><th>ほしい</th><th>行きたい</th></tr></thead>
  <tbody>
    <tr><td>Affirmative</td><td>ほしいです</td><td>行きたいです</td></tr>
    <tr><td>Negative</td><td>ほしくないです</td><td>行きたくないです</td></tr>
    <tr><td>Past</td><td>ほしかったです</td><td>行きたかったです</td></tr>
    <tr><td>Past negative</td><td>ほしくなかったです</td><td>行きたくなかったです</td></tr>
  </tbody>
</table>
<div class="note-ct">This is why Chapter 3 mattered: both ほしい and ～たい end in い and conjugate with exactly the い-adjective rules you already drilled (くない / かった / くなかった). No new conjugation to learn — just recognise them as い-adjectives in disguise.</div>
<div class="pitfall"><b>Trap — you may only use these about YOURSELF.</b> ほしいです and ～たいです describe your own inner feelings, which Japanese treats as knowable only by you. Saying アンさんは 車が ほしいです (An wants a car) as a flat statement sounds wrong to a native ear. For other people, either ask them directly (アンさんは 車が ほしいですか) or use ～たがっています at a later level. In JPD123, keep these patterns in first person and in questions.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> With ～たい, the object particle can be either を or が: ごはん<b>を</b> 食べたいです and ごはん<b>が</b> 食べたいです are both correct. を keeps the focus on the action ("I want to eat rice"), が pushes it onto the thing wanted ("it's rice that I want to eat"). Textbooks usually teach を; exams accept it; but do not be surprised when you meet が in real material.</div>
<a class="link-card codelab" href="/language/ja/grammar?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Drill ほしい &amp; ～たい</span><span class="lc-sub">Grammar reference on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Hai cách nói "tôi muốn"</h2>
<p class="lead">Tiếng Việt dùng một chữ — "muốn" — cho cả một <em>vật</em> lẫn một <em>hành động</em>. Tiếng Nhật tách chúng thành hai mẫu hoàn toàn khác nhau. Chọn nhầm là sai ngay, nên học sự phân chia này trước.</p>
<table>
  <thead><tr><th>Bạn muốn…</th><th>Mẫu câu</th><th>Ví dụ</th></tr></thead>
  <tbody>
    <tr><td>một VẬT (danh từ)</td><td>N <b>が ほしいです</b></td><td>くるま<b>が</b> ほしいです。(Tôi muốn có xe hơi)</td></tr>
    <tr><td>LÀM gì đó (động từ)</td><td>gốc V + <b>たいです</b></td><td>にほんへ 行き<b>たいです</b>。(Tôi muốn đi Nhật)</td></tr>
  </tbody>
</table>
<h3>1. N が ほしいです — muốn có một vật</h3>
<div class="out">わたしは あたらしい かばん<b>が</b> ほしいです。= Tôi muốn có một cái cặp mới.<br>
<b>Trợ từ bắt buộc là が, không bao giờ là を.</b> Dù "cái cặp" nghe như tân ngữ trong tiếng Việt, ほしい là một <em>tính từ</em> ("đáng mong muốn"), không phải động từ — mà tính từ đi với が, không đi với を.</div>
<h3>2. V-たいです — muốn làm gì đó</h3>
<div class="out">Lấy thể ます, bỏ ます, thêm たい:<br>
行き<s>ます</s> → 行き<b>たいです</b> (muốn đi) · 食べ<s>ます</s> → 食べ<b>たいです</b> (muốn ăn) · 見<s>ます</s> → 見<b>たいです</b> (muốn xem)<br><br>
なにを し<b>たいですか</b>。= Bạn muốn làm gì?<br>
どこへ 行き<b>たいですか</b>。= Bạn muốn đi đâu?</div>
<h3>Cả hai đều chia như tính từ い</h3>
<table>
  <thead><tr><th>Dạng</th><th>ほしい</th><th>行きたい</th></tr></thead>
  <tbody>
    <tr><td>Khẳng định</td><td>ほしいです</td><td>行きたいです</td></tr>
    <tr><td>Phủ định</td><td>ほしくないです</td><td>行きたくないです</td></tr>
    <tr><td>Quá khứ</td><td>ほしかったです</td><td>行きたかったです</td></tr>
    <tr><td>Phủ định quá khứ</td><td>ほしくなかったです</td><td>行きたくなかったです</td></tr>
  </tbody>
</table>
<div class="note-ct">Đây là lý do Chương 3 quan trọng: cả ほしい lẫn ～たい đều kết thúc bằng い và chia theo đúng luật tính từ い bạn vừa luyện (くない / かった / くなかった). Không có cách chia mới nào phải học — chỉ cần nhận ra chúng là tính từ い trá hình.</div>
<div class="pitfall"><b>Bẫy — chỉ được dùng cho CHÍNH MÌNH.</b> ほしいです và ～たいです mô tả cảm xúc bên trong của bạn, thứ mà tiếng Nhật coi là chỉ bạn mới biết được. Nói アンさんは 車が ほしいです (An muốn có xe) như một câu khẳng định trơn nghe sai với tai người bản xứ. Với người khác, hoặc hỏi trực tiếp họ (アンさんは 車が ほしいですか) hoặc dùng ～たがっています ở cấp cao hơn. Trong JPD123, hãy giữ các mẫu này ở ngôi thứ nhất và trong câu hỏi.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> Với ～たい, trợ từ tân ngữ có thể là を hoặc が: ごはん<b>を</b> 食べたいです và ごはん<b>が</b> 食べたいです đều đúng. を giữ trọng tâm ở hành động ("tôi muốn ăn cơm"), が đẩy trọng tâm sang vật được muốn ("chính cơm là thứ tôi muốn ăn"). Giáo trình thường dạy を; đề thi chấp nhận を; nhưng đừng ngạc nhiên khi gặp が trong tài liệu thật.</div>
<a class="link-card codelab" href="/language/ja/grammar?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Luyện ほしい &amp; ～たい</span><span class="lc-sub">Tra cứu ngữ pháp trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
        {
          title: '5.2 — Purpose of a trip (～に いきます)|||5.2 — Mục đích chuyến đi (～に いきます)',
          slug: 'jpd123-muc-dich-chuyen-di',
          type: 'VIDEO',
          description: 'Địa điểm へ + [động từ gốc / danh động từ] に いきます/きます/かえります — đi đâu ĐỂ LÀM GÌ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>Going somewhere <em>in order to</em> do something</h2>
<p class="lead">You already know [place]へ いきます (go to a place). Now add the reason for going — a single に does all the work.</p>
<div class="out"><b>Pattern:</b> [place] へ + [verb-stem / noun] + <b>に</b> + いきます / きます / かえります<br>
= go / come / return to [place] <b>in order to</b> [do something]</div>
<h3>Building it step by step</h3>
<table>
  <thead><tr><th>Verb</th><th>Drop ます → stem</th><th>Full sentence</th></tr></thead>
  <tbody>
    <tr><td>かいます (buy)</td><td>かい</td><td>デパートへ かい<b>に</b> いきます。(go to the department store to buy)</td></tr>
    <tr><td>よみます (read)</td><td>よみ</td><td>としょかんへ ほんを よみ<b>に</b> いきます。(go to the library to read a book)</td></tr>
    <tr><td>だします (send)</td><td>だし</td><td>ゆうびんきょくへ こづつみを だし<b>に</b> いきます。(go to the post office to send a parcel)</td></tr>
    <tr><td>べんきょうします (study)</td><td>べんきょうし</td><td>がっこうへ べんきょうし<b>に</b> いきます。(go to school to study)</td></tr>
  </tbody>
</table>
<h3>Shortcut with noun-verbs</h3>
<div class="out">Words like かいもの (shopping), さんぽ (a walk), しごと (work) are nouns that can also be verbs with します. With these, you may drop the をしに and just use the noun + に:<br>
かいもの<b>に</b> いきます = かいものをし<b>に</b> いきます (go shopping) — both correct, the short form is more natural.<br>
さんぽ<b>に</b> いきます (go for a walk) · かいしゃへ しごと<b>に</b> いきます (go to the company for work)</div>
<div class="note-ct">Note the two に in one sentence do different jobs: がっこう<b>に</b> べんきょうし<b>に</b> いきます — the first に marks the destination (interchangeable with へ), the second marks the purpose. This is why textbooks prefer へ for the destination here: がっこう<b>へ</b> べんきょうし<b>に</b> いきます reads much more clearly.</div>
<div class="pitfall"><b>Trap:</b> the purpose verb must be a <b>stem</b>, never the full ます-form and never the dictionary form. It is 食べ<b>に</b> いきます (go to eat), never <s>食べますに</s> and never <s>食べるに</s>. Take the ます-form you already know and simply cut ます off the end.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> This に-of-purpose only attaches to <em>movement</em> verbs — いきます, きます, かえります, and a few like でかけます (go out) or もどります (return). You cannot say としょかんで べんきょうしに します. If the main verb is not about moving, Japanese expresses purpose differently (with ために at a later level). Keeping this restriction in mind stops you over-applying an otherwise very handy pattern.</div>
<a class="link-card codelab" href="/language/ja/grammar?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Drill ～に いきます</span><span class="lc-sub">Grammar reference on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Đi đâu đó <em>để</em> làm gì</h2>
<p class="lead">Bạn đã biết [nơi chốn]へ いきます (đi đến một nơi). Giờ thêm lý do đi — chỉ một chữ に làm hết mọi việc.</p>
<div class="out"><b>Mẫu câu:</b> [nơi chốn] へ + [gốc động từ / danh từ] + <b>に</b> + いきます / きます / かえります<br>
= đi / đến / về [nơi chốn] <b>để</b> [làm gì đó]</div>
<h3>Dựng từng bước</h3>
<table>
  <thead><tr><th>Động từ</th><th>Bỏ ます → gốc</th><th>Câu đầy đủ</th></tr></thead>
  <tbody>
    <tr><td>かいます (mua)</td><td>かい</td><td>デパートへ かい<b>に</b> いきます。(đi cửa hàng bách hóa để mua đồ)</td></tr>
    <tr><td>よみます (đọc)</td><td>よみ</td><td>としょかんへ ほんを よみ<b>に</b> いきます。(đi thư viện để đọc sách)</td></tr>
    <tr><td>だします (gửi)</td><td>だし</td><td>ゆうびんきょくへ こづつみを だし<b>に</b> いきます。(đi bưu điện để gửi bưu phẩm)</td></tr>
    <tr><td>べんきょうします (học)</td><td>べんきょうし</td><td>がっこうへ べんきょうし<b>に</b> いきます。(đi trường để học)</td></tr>
  </tbody>
</table>
<h3>Rút gọn với danh-động từ</h3>
<div class="out">Những từ như かいもの (mua sắm), さんぽ (đi dạo), しごと (công việc) là danh từ nhưng cũng làm động từ được với します. Với chúng, bạn có thể bỏ をしに và chỉ dùng danh từ + に:<br>
かいもの<b>に</b> いきます = かいものをし<b>に</b> いきます (đi mua sắm) — cả hai đều đúng, dạng ngắn tự nhiên hơn.<br>
さんぽ<b>に</b> いきます (đi dạo) · かいしゃへ しごと<b>に</b> いきます (đến công ty để làm việc)</div>
<div class="note-ct">Để ý hai chữ に trong cùng một câu làm hai việc khác nhau: がっこう<b>に</b> べんきょうし<b>に</b> いきます — chữ に thứ nhất đánh dấu điểm đến (thay thế được bằng へ), chữ に thứ hai đánh dấu mục đích. Đó là lý do giáo trình thích dùng へ cho điểm đến ở đây: がっこう<b>へ</b> べんきょうし<b>に</b> いきます đọc rõ ràng hơn nhiều.</div>
<div class="pitfall"><b>Bẫy:</b> động từ chỉ mục đích phải ở dạng <b>gốc</b>, không bao giờ là thể ます đầy đủ và không bao giờ là thể từ điển. Phải là 食べ<b>に</b> いきます (đi ăn), không bao giờ <s>食べますに</s> và không bao giờ <s>食べるに</s>. Lấy thể ます bạn đã biết rồi đơn giản cắt ます ở cuối đi.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> Chữ に chỉ mục đích này chỉ gắn được với động từ <em>chuyển động</em> — いきます, きます, かえります, và vài từ như でかけます (đi ra ngoài) hay もどります (quay lại). Bạn không thể nói としょかんで べんきょうしに します. Nếu động từ chính không nói về việc di chuyển, tiếng Nhật diễn đạt mục đích theo cách khác (bằng ために ở cấp cao hơn). Nhớ giới hạn này giúp bạn không lạm dụng một mẫu câu vốn rất tiện.</div>
<a class="link-card codelab" href="/language/ja/grammar?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Luyện ～に いきます</span><span class="lc-sub">Tra cứu ngữ pháp trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
        {
          title: '5.3 — Likes & dislikes (が すき / きらい)|||5.3 — Thích & ghét (が すき / きらい)',
          slug: 'jpd123-so-thich',
          type: 'VIDEO',
          description: 'Nhóm tính từ な đi với が: すき, きらい, じょうず, へた — và vì sao KHÔNG dùng を.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.3</span>
<h2>Saying what you like — the が family</h2>
<p class="lead">"I like sushi" is a sentence with a verb in English. In Japanese, すき is a <strong>な-adjective</strong> meaning "likeable" — so the thing you like is marked with が, exactly like ほしい in 5.1.</p>
<table>
  <thead><tr><th>Word</th><th>Meaning</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td>すき (な)</td><td>like</td><td>わたしは にほんの アニメ<b>が</b> すきです。(I like Japanese anime)</td></tr>
    <tr><td>きらい (な)</td><td>dislike, hate</td><td>わたしは さかな<b>が</b> きらいです。(I dislike fish)</td></tr>
    <tr><td>じょうず (な)</td><td>good at</td><td>アンさんは にほんご<b>が</b> じょうずです。(An is good at Japanese)</td></tr>
    <tr><td>へた (な)</td><td>bad at</td><td>わたしは りょうり<b>が</b> へたです。(I am bad at cooking)</td></tr>
  </tbody>
</table>
<div class="note-ct">All four are な-adjectives, so they conjugate with the な-adjective rules from Chapter 3: すきです → すきじゃありません → すきでした → すきじゃありませんでした. And すき has an intensified form: <b>だいすき</b> (love, like very much) — にほんの アニメが だいすきです.</div>
<h3>Ví dụ có lời giải</h3>
<div class="out"><b>Q:</b> どんな たべものが すきですか。(What kind of food do you like?)<br>
<b>A:</b> すし<b>が</b> すきです。でも、なっとうは あまり すきじゃありません。<br>
= I like sushi. But I don't much like nattō.<br>
Notice: the liked thing takes が, but when contrasting it switches to は (なっとう<b>は</b>) — は marks it as "as for nattō, by contrast". Combined with あまり…ません from Chapter 3.4.</div>
<div class="pitfall"><b>Trap:</b> never <s>すしを すきです</s>. を marks the object of a real verb, and すき is not a verb. The same trap applies to ほしい (5.1), じょうず and へた. Memorise them as a group: <b>すき・きらい・じょうず・へた・ほしい all take が</b>.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> じょうず is used about <em>other</em> people as praise, but Japanese modesty means you rarely say it about yourself — わたしは にほんごが じょうずです sounds boastful. To talk about your own ability, native speakers downplay it with へた or use できます. Conversely, when someone praises your Japanese with 日本語が じょうずですね, the expected reply is a modest いいえ、まだまだです (no, I still have a long way to go) rather than ありがとう.</div>
<a class="link-card codelab" href="/language/ja/grammar?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Drill すき / きらい / じょうず / へた</span><span class="lc-sub">Grammar reference on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.3</span>
<h2>Nói điều bạn thích — nhóm đi với が</h2>
<p class="lead">"Tôi thích sushi" là câu có động từ trong tiếng Việt. Trong tiếng Nhật, すき là một <strong>tính từ な</strong> nghĩa là "đáng thích" — nên thứ bạn thích được đánh dấu bằng が, y hệt như ほしい ở bài 5.1.</p>
<table>
  <thead><tr><th>Từ</th><th>Nghĩa</th><th>Ví dụ</th></tr></thead>
  <tbody>
    <tr><td>すき (な)</td><td>thích</td><td>わたしは にほんの アニメ<b>が</b> すきです。(Tôi thích anime Nhật)</td></tr>
    <tr><td>きらい (な)</td><td>ghét, không thích</td><td>わたしは さかな<b>が</b> きらいです。(Tôi ghét cá)</td></tr>
    <tr><td>じょうず (な)</td><td>giỏi</td><td>アンさんは にほんご<b>が</b> じょうずです。(An giỏi tiếng Nhật)</td></tr>
    <tr><td>へた (な)</td><td>kém, dở</td><td>わたしは りょうり<b>が</b> へたです。(Tôi nấu ăn dở)</td></tr>
  </tbody>
</table>
<div class="note-ct">Cả bốn đều là tính từ な, nên chúng chia theo luật tính từ な từ Chương 3: すきです → すきじゃありません → すきでした → すきじゃありませんでした. Và すき có dạng nhấn mạnh: <b>だいすき</b> (rất thích, yêu thích) — にほんの アニメが だいすきです.</div>
<h3>Ví dụ có lời giải</h3>
<div class="out"><b>Hỏi:</b> どんな たべものが すきですか。(Bạn thích loại đồ ăn nào?)<br>
<b>Đáp:</b> すし<b>が</b> すきです。でも、なっとうは あまり すきじゃありません。<br>
= Tôi thích sushi. Nhưng natto thì tôi không thích lắm.<br>
Để ý: thứ được thích đi với が, nhưng khi đối lập thì chuyển sang は (なっとう<b>は</b>) — は đánh dấu nó là "còn về natto thì ngược lại". Kết hợp với あまり…ません từ bài 3.4.</div>
<div class="pitfall"><b>Bẫy:</b> không bao giờ nói <s>すしを すきです</s>. を đánh dấu tân ngữ của một động từ thật, mà すき không phải động từ. Bẫy tương tự áp dụng cho ほしい (5.1), じょうず và へた. Học thuộc chúng thành một nhóm: <b>すき・きらい・じょうず・へた・ほしい đều đi với が</b>.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> じょうず dùng để khen <em>người khác</em>, nhưng tính khiêm tốn của người Nhật khiến bạn hiếm khi nói về chính mình — わたしは にほんごが じょうずです nghe khoe khoang. Để nói về khả năng của bản thân, người bản xứ hạ thấp bằng へた hoặc dùng できます. Ngược lại, khi ai đó khen tiếng Nhật của bạn bằng 日本語が じょうずですね, câu đáp được mong đợi là một lời khiêm tốn いいえ、まだまだです (không đâu, tôi còn kém lắm) chứ không phải ありがとう.</div>
<a class="link-card codelab" href="/language/ja/grammar?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Luyện すき / きらい / じょうず / へた</span><span class="lc-sub">Tra cứu ngữ pháp trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
        {
          title: '5.4 — Past events, reasons (から) & なにも|||5.4 — Chuyện đã qua, lý do (から) & なにも',
          slug: 'jpd123-qua-khu-ly-do',
          type: 'VIDEO',
          description: 'Bảng từ chỉ thời gian quá khứ/tương lai, nêu lý do bằng から, và なにも + phủ định.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.4</span>
<h2>Talking about what happened — and why</h2>
<p class="lead">Verbs already have their past form (ました / ませんでした, Chapter 1). What you need now are the time words to anchor them, and から to explain the reason.</p>
<h3>1. Time words</h3>
<table>
  <thead><tr><th></th><th>Past</th><th>Now</th><th>Future</th></tr></thead>
  <tbody>
    <tr><td>Day</td><td>おととい (day before yesterday) · きのう (yesterday)</td><td>きょう (today)</td><td>あした (tomorrow) · あさって (day after tomorrow)</td></tr>
    <tr><td>Week</td><td>せんしゅう (last week)</td><td>こんしゅう (this week)</td><td>らいしゅう (next week)</td></tr>
    <tr><td>Month</td><td>せんげつ (last month)</td><td>こんげつ (this month)</td><td>らいげつ (next month)</td></tr>
    <tr><td>Year</td><td>きょねん (last year)</td><td>ことし (this year)</td><td>らいねん (next year)</td></tr>
  </tbody>
</table>
<div class="note-ct">Spot the pattern: せん (previous) / こん (this) / らい (coming) attach to しゅう (week), げつ (month), ねん (year). Years break it slightly — きょねん and ことし are irregular, so memorise those two. These time words need <b>no particle</b>: きのう、しんじゅくへ 行きました (not きのうに).</div>
<h3>2. Giving a reason with から</h3>
<div class="out">[reason] <b>から</b>、[result]。 — から attaches to the END of the reason clause.<br>
きのう いそがしかったです<b>から</b>、行きませんでした。= I didn't go, because I was busy yesterday.<br>
あした テストが あります<b>から</b>、べんきょうします。= I'll study, because there's a test tomorrow.<br><br>
It also works as a standalone answer to どうして (why):<br>
<b>Q:</b> どうして 来ませんでしたか。(Why didn't you come?)<br>
<b>A:</b> いそがしかったですから。(Because I was busy.)</div>
<div class="note-ct">The reason clause keeps its own tense: if the reason is in the past, use the past form before から (いそがし<b>かった</b>ですから), even when the result is also past. Do not put the tense only on the second half.</div>
<h3>3. なにも + negative = "nothing at all"</h3>
<div class="out">きのうは なにも 食べませんでした。= I ate nothing yesterday.<br>
<b>Q:</b> どうして なにも 食べませんでしたか。= Why didn't you eat anything?<br>
Like どこも from JPD113, <b>なにも must be followed by a negative verb</b>. The family: なにも (nothing) · だれも (nobody) · どこも (nowhere) — all three demand a negative ending.</div>
<div class="pitfall"><b>Trap:</b> から has another job you have already met — [place]から [place]まで (from…to…, JPD113 6.4). Distinguish by what sits before it: after a <b>noun</b> = "from" (とうきょうから); after a full <b>clause</b> ending in です/ます = "because" (いそがしいですから).</div>
<a class="link-card codelab" href="/language/ja/grammar?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Drill から &amp; time words</span><span class="lc-sub">Grammar reference on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.4</span>
<h2>Nói về chuyện đã xảy ra — và vì sao</h2>
<p class="lead">Động từ đã có dạng quá khứ rồi (ました / ませんでした, Chương 1). Thứ bạn cần bây giờ là các từ chỉ thời gian để neo chúng lại, và から để giải thích lý do.</p>
<h3>1. Từ chỉ thời gian</h3>
<table>
  <thead><tr><th></th><th>Quá khứ</th><th>Hiện tại</th><th>Tương lai</th></tr></thead>
  <tbody>
    <tr><td>Ngày</td><td>おととい (hôm kia) · きのう (hôm qua)</td><td>きょう (hôm nay)</td><td>あした (ngày mai) · あさって (ngày kia)</td></tr>
    <tr><td>Tuần</td><td>せんしゅう (tuần trước)</td><td>こんしゅう (tuần này)</td><td>らいしゅう (tuần sau)</td></tr>
    <tr><td>Tháng</td><td>せんげつ (tháng trước)</td><td>こんげつ (tháng này)</td><td>らいげつ (tháng sau)</td></tr>
    <tr><td>Năm</td><td>きょねん (năm ngoái)</td><td>ことし (năm nay)</td><td>らいねん (năm sau)</td></tr>
  </tbody>
</table>
<div class="note-ct">Để ý quy luật: せん (trước) / こん (này) / らい (tới) gắn vào しゅう (tuần), げつ (tháng), ねん (năm). Riêng năm hơi phá luật — きょねん và ことし bất quy tắc, nên phải học thuộc hai từ đó. Các từ chỉ thời gian này <b>không cần trợ từ</b>: きのう、しんじゅくへ 行きました (không phải きのうに).</div>
<h3>2. Nêu lý do bằng から</h3>
<div class="out">[lý do] <b>から</b>、[kết quả]。 — から gắn vào CUỐI vế lý do.<br>
きのう いそがしかったです<b>から</b>、行きませんでした。= Tôi đã không đi, vì hôm qua bận.<br>
あした テストが あります<b>から</b>、べんきょうします。= Tôi sẽ học, vì mai có bài kiểm tra.<br><br>
Nó cũng dùng được như một câu trả lời độc lập cho どうして (tại sao):<br>
<b>Hỏi:</b> どうして 来ませんでしたか。(Sao bạn đã không đến?)<br>
<b>Đáp:</b> いそがしかったですから。(Vì tôi bận.)</div>
<div class="note-ct">Vế lý do giữ thì của chính nó: nếu lý do ở quá khứ, dùng dạng quá khứ trước から (いそがし<b>かった</b>ですから), ngay cả khi kết quả cũng ở quá khứ. Đừng chỉ đặt thì ở nửa sau.</div>
<h3>3. なにも + phủ định = "không gì cả"</h3>
<div class="out">きのうは なにも 食べませんでした。= Hôm qua tôi đã không ăn gì cả.<br>
<b>Hỏi:</b> どうして なにも 食べませんでしたか。= Sao bạn đã không ăn gì cả?<br>
Giống どこも từ JPD113, <b>なにも bắt buộc theo sau bởi động từ phủ định</b>. Cả nhóm: なにも (không gì) · だれも (không ai) · どこも (không đâu) — cả ba đều đòi đuôi phủ định.</div>
<div class="pitfall"><b>Bẫy:</b> から còn một vai trò khác bạn đã gặp — [nơi]から [nơi]まで (từ…đến…, JPD113 bài 6.4). Phân biệt bằng thứ đứng trước nó: sau một <b>danh từ</b> = "từ" (とうきょうから); sau một <b>vế câu</b> hoàn chỉnh kết thúc bằng です/ます = "vì" (いそがしいですから).</div>
<a class="link-card codelab" href="/language/ja/grammar?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Luyện から &amp; từ chỉ thời gian</span><span class="lc-sub">Tra cứu ngữ pháp trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
        {
          title: '5.5 — Conversation nuance: もう/まだ, ね/よ & declining politely|||5.5 — Sắc thái hội thoại: もう/まだ, ね/よ & từ chối lịch sự',
          slug: 'jpd123-sac-thai-hoi-thoai',
          type: 'VIDEO',
          description: 'もう…ました / まだです, trợ từ cuối câu ね (đồng tình) vs よ (thông tin mới), どうですか, và cách từ chối kiểu Nhật.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.5</span>
<h2>The small words that make you sound natural</h2>
<p class="lead">Grammar makes you correct; these four things make you sound like a person. All of them appear constantly in the speaking exam.</p>
<h3>1. もう (already) &amp; まだ (not yet)</h3>
<div class="out"><b>Q:</b> もう しゅくだいを しましたか。= Have you done the homework yet?<br>
<b>A (done):</b> はい、<b>もう</b> しました。= Yes, I've already done it.<br>
<b>A (not done):</b> いいえ、<b>まだです</b>。= No, not yet.<br><br>
The short answer まだです is the standard reply — you do not need to repeat the whole verb. If you do expand it, use the negative: まだ していません (I haven't done it yet).</div>
<h3>2. Sentence-final ね and よ</h3>
<table>
  <thead><tr><th>Particle</th><th>Function</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td><b>ね</b></td><td>seeking agreement / confirming — "right?"</td><td>5時です<b>ね</b>。わかりました。(It's 5 o'clock, right? Understood.)</td></tr>
    <tr><td><b>よ</b></td><td>giving NEW information the listener doesn't have</td><td>あしたは にちようびです<b>よ</b>。(Tomorrow is Sunday, you know.)</td></tr>
  </tbody>
</table>
<div class="note-ct">A useful mental image: <b>ね points back at the listener</b> (we both know this, agree with me), while <b>よ pushes information towards them</b> (you didn't know this, I'm telling you). Getting them backwards is jarring — telling someone news with ね sounds like you assume they already knew, and confirming with よ sounds pushy.</div>
<h3>3. Suggesting with どうですか</h3>
<div class="out">やきにくは どうですか。= How about yakiniku?<br>
Use [noun]は どうですか to float a suggestion politely, especially when replying to an invitation with a counter-proposal.</div>
<h3>4. Declining without saying "no"</h3>
<div class="out">Japanese rarely refuses flatly. The standard shape is <b>trail off with ちょっと…</b> plus a reason with から:<br>
<b>Q:</b> こんばん いっしょに ごはんを 食べに 行きませんか。<br>
<b>A:</b> すみません、こんばんは <b>ちょっと</b>…。あした テストが あります<b>から</b>。<br>
= Sorry, tonight is a bit… (difficult). Because I have a test tomorrow.<br>
The unfinished sentence IS the refusal — the listener understands immediately, and nobody loses face.</div>
<div class="pitfall"><b>Trap:</b> answering an invitation with a blunt いいえ、行きません (No, I won't go) is grammatically perfect but socially harsh. In the speaking exam, a polite decline (すみません + ちょっと + から-reason) scores better than a correct-but-blunt refusal. Learn the shape as a fixed phrase.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> ね and よ can combine as <b>よね</b> — "it is X, isn't it?" — when you are fairly sure but want confirmation: あしたは にちようびです<b>よね</b>? This is extremely common in real speech and sits exactly between the certainty of よ and the agreement-seeking of ね. Not required for JPD123, but you will hear it constantly.</div>
<a class="link-card codelab" href="/language/ja/roleplay?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">💬</span>
  <span class="lc-body"><span class="lc-title">Practise inviting &amp; declining</span><span class="lc-sub">Roleplay conversations on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.5</span>
<h2>Những từ nhỏ làm bạn nghe tự nhiên</h2>
<p class="lead">Ngữ pháp làm bạn nói đúng; bốn thứ này làm bạn nghe như một con người. Tất cả đều xuất hiện liên tục trong bài thi nói.</p>
<h3>1. もう (đã…rồi) &amp; まだ (chưa)</h3>
<div class="out"><b>Hỏi:</b> もう しゅくだいを しましたか。= Bạn làm bài tập chưa?<br>
<b>Đáp (rồi):</b> はい、<b>もう</b> しました。= Vâng, tôi làm rồi.<br>
<b>Đáp (chưa):</b> いいえ、<b>まだです</b>。= Chưa, chưa xong.<br><br>
Câu trả lời ngắn まだです là cách đáp chuẩn — bạn không cần lặp lại cả động từ. Nếu muốn nói đầy đủ thì dùng phủ định: まだ していません (tôi vẫn chưa làm).</div>
<h3>2. Trợ từ cuối câu ね và よ</h3>
<table>
  <thead><tr><th>Trợ từ</th><th>Chức năng</th><th>Ví dụ</th></tr></thead>
  <tbody>
    <tr><td><b>ね</b></td><td>tìm sự đồng tình / xác nhận — "nhỉ?"</td><td>5時です<b>ね</b>。わかりました。(5 giờ nhỉ? Tôi hiểu rồi.)</td></tr>
    <tr><td><b>よ</b></td><td>đưa thông tin MỚI mà người nghe chưa biết</td><td>あしたは にちようびです<b>よ</b>。(Mai là Chủ nhật đấy.)</td></tr>
  </tbody>
</table>
<div class="note-ct">Một hình dung hữu ích: <b>ね chỉ ngược về phía người nghe</b> (cả hai ta đều biết điều này, đồng ý với tôi nhé), còn <b>よ đẩy thông tin về phía họ</b> (bạn chưa biết điều này, tôi đang nói cho bạn). Dùng ngược nhau nghe rất chối — báo tin bằng ね nghe như bạn cho rằng họ đã biết rồi, còn xác nhận bằng よ nghe áp đặt.</div>
<h3>3. Đề xuất bằng どうですか</h3>
<div class="out">やきにくは どうですか。= Thịt nướng thì thế nào?<br>
Dùng [danh từ]は どうですか để thả một đề xuất lịch sự, nhất là khi đáp lại lời mời bằng một phương án khác.</div>
<h3>4. Từ chối mà không nói "không"</h3>
<div class="out">Người Nhật hiếm khi từ chối thẳng. Khuôn chuẩn là <b>bỏ lửng với ちょっと…</b> cộng một lý do bằng から:<br>
<b>Hỏi:</b> こんばん いっしょに ごはんを 食べに 行きませんか。<br>
<b>Đáp:</b> すみません、こんばんは <b>ちょっと</b>…。あした テストが あります<b>から</b>。<br>
= Xin lỗi, tối nay thì hơi… (bất tiện). Vì mai tôi có bài kiểm tra.<br>
Câu bỏ dở CHÍNH LÀ lời từ chối — người nghe hiểu ngay, và không ai mất mặt.</div>
<div class="pitfall"><b>Bẫy:</b> đáp lại lời mời bằng một câu cộc いいえ、行きません (Không, tôi không đi) thì đúng ngữ pháp hoàn hảo nhưng thô về mặt xã giao. Trong bài thi nói, một lời từ chối lịch sự (すみません + ちょっと + lý do から) được điểm cao hơn một lời từ chối đúng-mà-cộc. Học khuôn này như một câu cố định.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> ね và よ có thể ghép thành <b>よね</b> — "là X, đúng không nhỉ?" — khi bạn khá chắc nhưng vẫn muốn xác nhận: あしたは にちようびです<b>よね</b>? Cách này cực kỳ phổ biến trong lời nói thật và nằm đúng giữa sự chắc chắn của よ và sự tìm đồng tình của ね. Không bắt buộc cho JPD123, nhưng bạn sẽ nghe suốt.</div>
<a class="link-card codelab" href="/language/ja/roleplay?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">💬</span>
  <span class="lc-body"><span class="lc-title">Luyện mời &amp; từ chối</span><span class="lc-sub">Hội thoại nhập vai trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
        {
          title: 'Quiz — Wishes, likes & purpose|||Quiz — Mong muốn, sở thích & mục đích',
          slug: 'jpd123-quiz-mong-muon',
          type: 'QUIZ',
          description: 'Kiểm tra ほしい/～たい, mục đích ～に いきます, nhóm が (すき/きらい), から và なにも.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: 'くるま＿ ほしいです (I want a car) needs…|||くるま＿ ほしいです (Tôi muốn có xe) cần…', options: ['を', 'が', 'は', 'に'], correctIndex: 1, points: 1 },
              { question: 'The たい-form of 行きます is…|||Dạng たい của 行きます là…', options: ['行くたいです', '行きたいです', '行きますたい', '行ったいです'], correctIndex: 1, points: 1 },
              { question: '"I did not want to go" is…|||"Tôi đã không muốn đi" là…', options: ['行きたいくなかったです', '行きたくなかったです', '行きたいじゃありませんでした', '行きたいでした'], correctIndex: 1, points: 1 },
              { question: '"Go to the library to read a book" is としょかんへ ほんを…|||"Đi thư viện để đọc sách" là としょかんへ ほんを…', options: ['よみますに 行きます', 'よみに 行きます', 'よむに 行きます', 'よんで 行きます'], correctIndex: 1, points: 1 },
              { question: 'すし＿ すきです (I like sushi) needs…|||すし＿ すきです (Tôi thích sushi) cần…', options: ['を', 'が', 'に', 'で'], correctIndex: 1, points: 1 },
              { question: 'から meaning "because" attaches to…|||から nghĩa "vì" gắn vào…', options: ['the end of the reason clause|||cuối vế lý do', 'the start of the result|||đầu vế kết quả', 'a noun only|||chỉ danh từ', 'the verb stem|||gốc động từ'], correctIndex: 0, points: 1 },
              { question: 'なにも must be followed by…|||なにも bắt buộc theo sau bởi…', options: ['an affirmative verb|||động từ khẳng định', 'a negative verb|||động từ phủ định', 'a noun|||một danh từ', 'です'], correctIndex: 1, points: 1 },
              { question: 'Answering "not yet" to もう…ましたか is…|||Trả lời "chưa" cho もう…ましたか là…', options: ['いいえ、まだです', 'いいえ、もうです', 'はい、まだです', 'いいえ、ありません'], correctIndex: 0, points: 1 },
              { question: 'The particle that gives NEW information to the listener is…|||Trợ từ đưa thông tin MỚI cho người nghe là…', options: ['ね', 'よ', 'か', 'な'], correctIndex: 1, points: 1 },
              { question: '"Last month" is…|||"Tháng trước" là…', options: ['らいげつ', 'こんげつ', 'せんげつ', 'きょねん'], correctIndex: 2, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 6 — SO SÁNH (Dekiru Bài 6) ══════════════════ */
    {
      title: 'Chapter 6 — Comparison|||Chương 6 — So sánh',
      description: 'So sánh hơn (より), so sánh kém (ほど), so sánh nhất (いちばん), và cách hỏi–đáp so sánh.',
      lessons: [
        {
          title: '6.1 — More than / less than (より, ほど)|||6.1 — Hơn / kém (より, ほど)',
          slug: 'jpd123-so-sanh-hon-kem',
          type: 'VIDEO',
          description: 'A は B より + tính từ (A hơn B) và A は B ほど + tính từ PHỦ ĐỊNH (A không bằng B).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Comparing two things</h2>
<p class="lead">Japanese has no "-er" ending and no "more". Comparison is done entirely with two particles — より for the higher side, ほど for the lower side — and the adjective itself never changes.</p>
<h3>1. Comparative: A は B より + Adj</h3>
<div class="out"><b>Pattern:</b> A は B <b>より</b> + Adj + です = A is more Adj <b>than</b> B<br>
にほんごは えいご<b>より</b> むずかしいです。= Japanese is more difficult than English.<br><br>
Read より as "compared to". It attaches directly to the thing being <em>beaten</em> — the loser of the comparison. The topic (A, marked by は) is the winner.</div>
<h3>2. Negative comparative: A は B ほど + Adj-negative</h3>
<div class="out"><b>Pattern:</b> A は B <b>ほど</b> + Adj + <b>negative</b> = A is not as Adj <b>as</b> B<br>
えいごは にほんご<b>ほど</b> むずかし<b>くないです</b>。= English is not as difficult as Japanese.<br><br>
<b>ほど demands a negative ending</b> — exactly like あまり and ぜんぜん in Chapter 3.4. There is no affirmative use of ほど at this level.</div>
<table>
  <thead><tr><th>Meaning</th><th>Particle</th><th>Adjective form</th><th>Who wins</th></tr></thead>
  <tbody>
    <tr><td>A is MORE than B</td><td>より</td><td>affirmative</td><td>A (the topic)</td></tr>
    <tr><td>A is NOT AS…AS B</td><td>ほど</td><td><b>negative</b></td><td>B (the one after ほど)</td></tr>
  </tbody>
</table>
<div class="note-ct">The two sentences above describe the <em>same fact</em> from opposite directions: "Japanese is harder than English" = "English is not as hard as Japanese". If an exam gives you one and asks for the equivalent, swap the two nouns AND swap より↔ほど AND flip the adjective to negative.</div>
<div class="pitfall"><b>Trap:</b> writing <s>えいごは にほんごほど むずかしいです</s> (affirmative after ほど) is ungrammatical. Whenever you see ほど in a blank-filling question, the adjective at the other end must be negative — same free hint as あまり/ぜんぜん.</div>
<a class="link-card codelab" href="/language/ja/grammar?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Drill より / ほど</span><span class="lc-sub">Grammar reference on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>So sánh hai thứ</h2>
<p class="lead">Tiếng Nhật không có đuôi "-er" và không có chữ "more". So sánh hoàn toàn nhờ hai trợ từ — より cho vế cao hơn, ほど cho vế thấp hơn — và bản thân tính từ không bao giờ đổi.</p>
<h3>1. So sánh hơn: A は B より + Adj</h3>
<div class="out"><b>Mẫu câu:</b> A は B <b>より</b> + Adj + です = A thì Adj <b>hơn</b> B<br>
にほんごは えいご<b>より</b> むずかしいです。= Tiếng Nhật khó hơn tiếng Anh.<br><br>
Hãy đọc より là "so với". Nó gắn trực tiếp vào thứ bị <em>thua</em> — kẻ thua trong phép so sánh. Chủ đề (A, đánh dấu bằng は) là kẻ thắng.</div>
<h3>2. So sánh kém: A は B ほど + Adj phủ định</h3>
<div class="out"><b>Mẫu câu:</b> A は B <b>ほど</b> + Adj + <b>phủ định</b> = A không Adj <b>bằng</b> B<br>
えいごは にほんご<b>ほど</b> むずかし<b>くないです</b>。= Tiếng Anh không khó bằng tiếng Nhật.<br><br>
<b>ほど đòi hỏi đuôi phủ định</b> — y hệt như あまり và ぜんぜん ở bài 3.4. Không có cách dùng khẳng định của ほど ở cấp này.</div>
<table>
  <thead><tr><th>Nghĩa</th><th>Trợ từ</th><th>Dạng tính từ</th><th>Ai thắng</th></tr></thead>
  <tbody>
    <tr><td>A HƠN B</td><td>より</td><td>khẳng định</td><td>A (chủ đề)</td></tr>
    <tr><td>A KHÔNG BẰNG B</td><td>ほど</td><td><b>phủ định</b></td><td>B (từ đứng sau ほど)</td></tr>
  </tbody>
</table>
<div class="note-ct">Hai câu trên mô tả <em>cùng một sự thật</em> từ hai chiều ngược nhau: "Tiếng Nhật khó hơn tiếng Anh" = "Tiếng Anh không khó bằng tiếng Nhật". Nếu đề cho bạn một câu và hỏi câu tương đương, hãy đảo hai danh từ VÀ đổi より↔ほど VÀ lật tính từ sang phủ định.</div>
<div class="pitfall"><b>Bẫy:</b> viết <s>えいごは にほんごほど むずかしいです</s> (khẳng định sau ほど) là sai ngữ pháp. Hễ thấy ほど trong câu điền chỗ trống, tính từ ở đầu kia bắt buộc phải phủ định — cùng một gợi ý miễn phí như あまり/ぜんぜん.</div>
<a class="link-card codelab" href="/language/ja/grammar?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Luyện より / ほど</span><span class="lc-sub">Tra cứu ngữ pháp trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
        {
          title: '6.2 — The superlative (いちばん) & defining the scope|||6.2 — So sánh nhất (いちばん) & xác định phạm vi',
          slug: 'jpd123-so-sanh-nhat',
          type: 'VIDEO',
          description: '[Phạm vi]で N が いちばん + tính từ — và khi nào cần のなかで, khi nào chỉ cần で.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>Saying something is the most</h2>
<p class="lead">The superlative uses one fixed word: <strong>いちばん</strong> (literally "number one"), placed right before the adjective. The real skill here is marking the <em>scope</em> — "the most … <b>out of what?</b>"</p>
<div class="out"><b>Pattern:</b> [scope] <b>で</b> + N <b>が</b> + <b>いちばん</b> + Adj + です<br>
一年<b>で</b> 八月<b>が</b> <b>いちばん</b> あついです。= In a year, August is the hottest.<br>
日本のりょうり<b>で</b> スシ<b>が</b> <b>いちばん</b> すきです。= Of Japanese dishes, I like sushi the most.</div>
<h3>Which scope marker: で alone, or のなかで?</h3>
<table>
  <thead><tr><th>Scope type</th><th>Marker</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td>A range or group (a year, a class, a country)</td><td><b>で</b> alone</td><td>一年で · クラスで · 日本で</td></tr>
    <tr><td>A category of items</td><td><b>のなかで</b></td><td>くだもの<b>のなかで</b> (among fruits)</td></tr>
    <tr><td>An explicit list of choices</td><td>N1と N2と N3 <b>の中で</b></td><td>りんごと みかんと ぶどう<b>の中で</b>、りんごが いちばん 好きです。</td></tr>
  </tbody>
</table>
<div class="note-ct">Rule of thumb: if the scope is already a container or period (a year, a class, Japan), plain で is enough. If the scope is a set of things you could line up and point at (fruits, these three items), use のなかで. Adding のなかで to a period — 一年のなかで — is not wrong but sounds heavier than necessary.</div>
<div class="pitfall"><b>Trap:</b> the thing that wins takes <b>が</b>, not は: 八月<b>が</b> いちばん あついです. Learners reach for は out of habit from JPD113, but a superlative is picking one item out of a set, and picking-one-out-of-a-set is exactly what が does. The same logic returns in 6.3 with のほうが.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> いちばん literally means "number one", and you can hear it used on its own outside comparisons — for example ordering at a shop or ranking anything. Its counterpart にばん (second) exists but is rarely used in this superlative pattern; to say "the second most…" Japanese usually restructures the sentence entirely (二番目に あついです). Do not try to build "second-most" by analogy at this level.</div>
<a class="link-card codelab" href="/language/ja/grammar?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Drill いちばん</span><span class="lc-sub">Grammar reference on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Nói cái gì đó là nhất</h2>
<p class="lead">So sánh nhất dùng một từ cố định: <strong>いちばん</strong> (nghĩa đen "số một"), đặt ngay trước tính từ. Kỹ năng thật sự ở đây là đánh dấu <em>phạm vi</em> — "nhất … <b>trong cái gì?</b>"</p>
<div class="out"><b>Mẫu câu:</b> [phạm vi] <b>で</b> + N <b>が</b> + <b>いちばん</b> + Adj + です<br>
一年<b>で</b> 八月<b>が</b> <b>いちばん</b> あついです。= Trong một năm, tháng 8 nóng nhất.<br>
日本のりょうり<b>で</b> スシ<b>が</b> <b>いちばん</b> すきです。= Trong các món Nhật, tôi thích sushi nhất.</div>
<h3>Dùng dấu phạm vi nào: で một mình, hay のなかで?</h3>
<table>
  <thead><tr><th>Loại phạm vi</th><th>Dấu hiệu</th><th>Ví dụ</th></tr></thead>
  <tbody>
    <tr><td>Một khoảng hoặc nhóm (một năm, một lớp, một nước)</td><td><b>で</b> một mình</td><td>一年で · クラスで · 日本で</td></tr>
    <tr><td>Một loại/chủng vật</td><td><b>のなかで</b></td><td>くだもの<b>のなかで</b> (trong các loại trái cây)</td></tr>
    <tr><td>Một danh sách lựa chọn cụ thể</td><td>N1と N2と N3 <b>の中で</b></td><td>りんごと みかんと ぶどう<b>の中で</b>、りんごが いちばん 好きです。</td></tr>
  </tbody>
</table>
<div class="note-ct">Quy tắc ghi nhớ: nếu phạm vi vốn đã là một vật chứa hay một khoảng thời gian (một năm, một lớp, nước Nhật), で trơn là đủ. Nếu phạm vi là một tập hợp các thứ bạn có thể xếp ra và chỉ vào (trái cây, ba món này), dùng のなかで. Thêm のなかで vào một khoảng thời gian — 一年のなかで — không sai nhưng nghe nặng nề không cần thiết.</div>
<div class="pitfall"><b>Bẫy:</b> thứ thắng cuộc đi với <b>が</b>, không phải は: 八月<b>が</b> いちばん あついです. Người học hay với tay lấy は theo thói quen từ JPD113, nhưng so sánh nhất là chọn ra MỘT thứ khỏi một tập hợp, mà chọn-một-khỏi-tập-hợp chính xác là việc của が. Cùng logic đó quay lại ở bài 6.3 với のほうが.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> いちばん nghĩa đen là "số một", và bạn có thể nghe nó dùng độc lập ngoài phép so sánh — ví dụ khi gọi món hay xếp hạng bất cứ thứ gì. Từ đối ứng にばん (số hai) có tồn tại nhưng hiếm khi dùng trong mẫu so sánh nhất này; để nói "nhì" tiếng Nhật thường tái cấu trúc cả câu (二番目に あついです). Đừng cố dựng "nhì" bằng cách suy loại suy ở cấp này.</div>
<a class="link-card codelab" href="/language/ja/grammar?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Luyện いちばん</span><span class="lc-sub">Tra cứu ngữ pháp trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
        {
          title: '6.3 — Comparison questions (どちらが / のほうが)|||6.3 — Câu hỏi so sánh (どちらが / のほうが)',
          slug: 'jpd123-cau-hoi-so-sanh',
          type: 'VIDEO',
          description: 'A と B と どちらが + tính từ + ですか, trả lời bằng N のほうが, và câu hỏi so sánh nhất với なに/いつ/どこ/だれ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.3</span>
<h2>Asking someone to compare</h2>
<p class="lead">Two question shapes complete the comparison system: one for choosing between exactly two things, and one for finding the top of a whole group.</p>
<h3>1. Between two: A と B と どちらが … ですか</h3>
<div class="out"><b>Q:</b> えいごと にほんごと <b>どちらが</b> むずかしいですか。= Between English and Japanese, which is more difficult?<br>
<b>A:</b> にほんご<b>のほうが</b> むずかしいです。= Japanese is the more difficult one.<br><br>
Note the shape: both items get と, and どちら is used even for things (not just directions) whenever the choice is between exactly <b>two</b>.</div>
<div class="note-ct">のほうが literally means "the side of ~" — you are pointing at one of two sides. That is why the answer uses が and not は: you are singling one out. Answering with にほんご<b>は</b> むずかしいです would be a general statement about Japanese, not an answer to the comparison.</div>
<h3>2. Among many: [scope] で + question word + が いちばん … ですか</h3>
<table>
  <thead><tr><th>Asking about</th><th>Question word</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td>a thing</td><td>なに</td><td>くだものの中で <b>なに</b>が いちばん すきですか。</td></tr>
    <tr><td>a time</td><td>いつ</td><td>一年で <b>いつ</b>が いちばん あついですか。→ 八月が いちばん あついです。</td></tr>
    <tr><td>a place</td><td>どこ</td><td>日本で <b>どこ</b>が いちばん ゆうめいですか。</td></tr>
    <tr><td>a person</td><td>だれ</td><td>クラスで <b>だれ</b>が いちばん せが たかいですか。</td></tr>
  </tbody>
</table>
<div class="note-ct">The answer simply replaces the question word, keeping everything else identical: いつ<b>が</b> いちばん あついですか → 八月<b>が</b> いちばん あついです. This mirror-image structure is the fastest way to produce a correct answer under exam pressure.</div>
<div class="pitfall"><b>Trap:</b> use どちら for exactly TWO options and a normal question word (なに/どこ/いつ/だれ) for three or more. Asking くだものの中で どちらが いちばん すきですか is wrong because "fruits" is an open group, not a pair. Count the options before choosing the question word.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> In casual speech どちら shortens to <b>どっち</b>, and のほうが often drops to just のほう: 「コーヒーと おちゃと <b>どっち</b>が いい?」「コーヒー<b>のほう</b>。」 You will hear どっち constantly in conversation and drama, but write どちら in JPD123 exams — どっち is too informal for written work.</div>
<a class="link-card codelab" href="/language/ja/roleplay?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">💬</span>
  <span class="lc-body"><span class="lc-title">Practise comparison Q&amp;A</span><span class="lc-sub">Roleplay conversations on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.3</span>
<h2>Hỏi ai đó so sánh</h2>
<p class="lead">Hai khuôn câu hỏi hoàn thiện hệ thống so sánh: một để chọn giữa đúng hai thứ, một để tìm ra đỉnh của cả một nhóm.</p>
<h3>1. Giữa hai: A と B と どちらが … ですか</h3>
<div class="out"><b>Hỏi:</b> えいごと にほんごと <b>どちらが</b> むずかしいですか。= Giữa tiếng Anh và tiếng Nhật, cái nào khó hơn?<br>
<b>Đáp:</b> にほんご<b>のほうが</b> むずかしいです。= Tiếng Nhật thì khó hơn.<br><br>
Để ý khuôn: cả hai vật đều nhận と, và どちら được dùng cả cho đồ vật (không chỉ phương hướng) hễ khi lựa chọn là giữa đúng <b>hai</b> thứ.</div>
<div class="note-ct">のほうが nghĩa đen là "phía của ~" — bạn đang chỉ vào một trong hai phía. Đó là lý do câu trả lời dùng が chứ không dùng は: bạn đang tách riêng một cái ra. Trả lời にほんご<b>は</b> むずかしいです sẽ là một nhận định chung về tiếng Nhật, không phải câu trả lời cho phép so sánh.</div>
<h3>2. Trong nhiều: [phạm vi] で + từ để hỏi + が いちばん … ですか</h3>
<table>
  <thead><tr><th>Hỏi về</th><th>Từ để hỏi</th><th>Ví dụ</th></tr></thead>
  <tbody>
    <tr><td>một vật</td><td>なに</td><td>くだものの中で <b>なに</b>が いちばん すきですか。</td></tr>
    <tr><td>một thời điểm</td><td>いつ</td><td>一年で <b>いつ</b>が いちばん あついですか。→ 八月が いちばん あついです。</td></tr>
    <tr><td>một nơi chốn</td><td>どこ</td><td>日本で <b>どこ</b>が いちばん ゆうめいですか。</td></tr>
    <tr><td>một người</td><td>だれ</td><td>クラスで <b>だれ</b>が いちばん せが たかいですか。</td></tr>
  </tbody>
</table>
<div class="note-ct">Câu trả lời chỉ đơn giản thay thế từ để hỏi, giữ nguyên mọi thứ còn lại: いつ<b>が</b> いちばん あついですか → 八月<b>が</b> いちばん あついです. Cấu trúc soi-gương này là cách nhanh nhất để tạo ra câu trả lời đúng khi đang căng thẳng trong phòng thi.</div>
<div class="pitfall"><b>Bẫy:</b> dùng どちら cho đúng HAI lựa chọn và dùng từ để hỏi thường (なに/どこ/いつ/だれ) cho ba lựa chọn trở lên. Hỏi くだものの中で どちらが いちばん すきですか là sai vì "trái cây" là một nhóm mở, không phải một cặp. Hãy đếm số lựa chọn trước khi chọn từ để hỏi.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> Trong khẩu ngữ どちら rút gọn thành <b>どっち</b>, và のほうが thường rụng còn のほう: 「コーヒーと おちゃと <b>どっち</b>が いい?」「コーヒー<b>のほう</b>。」 Bạn sẽ nghe どっち liên tục trong hội thoại và phim, nhưng hãy viết どちら trong đề thi JPD123 — どっち quá suồng sã cho bài viết.</div>
<a class="link-card codelab" href="/language/ja/roleplay?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">💬</span>
  <span class="lc-body"><span class="lc-title">Luyện hỏi–đáp so sánh</span><span class="lc-sub">Hội thoại nhập vai trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
        {
          title: 'Grammar Summary — Chapter 6|||Tóm tắt ngữ pháp — Chương 6',
          slug: 'jpd123-nguphap-chuong6',
          type: 'VIDEO',
          description: 'Gom cả hệ so sánh: より, ほど, いちばん, どちらが, のほうが — kèm bảng chọn nhanh.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Grammar Summary</span>
<h2>The whole comparison system on one page</h2>
<p class="lead">Five pieces, one system. The fastest way to master it is to see which piece answers which question.</p>
<table>
  <thead><tr><th>You want to say…</th><th>Pattern</th><th>Adjective</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td>A is more than B</td><td>A は B <b>より</b> Adj です</td><td>affirmative</td><td>にほんごは えいごより むずかしいです</td></tr>
    <tr><td>A is not as … as B</td><td>A は B <b>ほど</b> Adj-neg です</td><td><b>negative</b></td><td>えいごは にほんごほど むずかしくないです</td></tr>
    <tr><td>A is the most</td><td>[scope]<b>で</b> A <b>が いちばん</b> Adj です</td><td>affirmative</td><td>一年で 八月が いちばん あついです</td></tr>
    <tr><td>Which of two?</td><td>A と B と <b>どちらが</b> Adj ですか</td><td>affirmative</td><td>えいごと にほんごと どちらが むずかしいですか</td></tr>
    <tr><td>Answer to "which of two"</td><td>N <b>のほうが</b> Adj です</td><td>affirmative</td><td>にほんごのほうが むずかしいです</td></tr>
    <tr><td>Which of many?</td><td>[scope]で <b>なに/いつ/どこ/だれ</b> が いちばん Adj ですか</td><td>affirmative</td><td>一年で いつが いちばん あついですか</td></tr>
  </tbody>
</table>
<h3>Three rules that cover most exam mistakes</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>1. ほど always ends negative.</b> Same family as あまり and ぜんぜん from Chapter 3.4.</div>
  <div class="lz-layer"><b>2. The winner takes が, never は.</b> 八月<b>が</b> いちばん…, にほんご<b>のほうが</b>… — comparison picks one out of a set, and that is が's job.</div>
  <div class="lz-layer"><b>3. どちら for exactly two; なに/いつ/どこ/だれ for three or more.</b> Count the options first.</div>
</div>
<h3>Ví dụ có lời giải · A full comparison conversation</h3>
<div class="out"><b>Q:</b> すしと ラーメンと どちらが すきですか。(Which do you like more, sushi or ramen?)<br>
<b>A:</b> すしのほうが すきです。ラーメンは すしほど すきじゃありません。(I like sushi more. I don't like ramen as much as sushi.)<br>
<b>Q:</b> 日本のりょうりで なにが いちばん すきですか。(Of Japanese dishes, what do you like most?)<br>
<b>A:</b> すしが いちばん すきです。(I like sushi the most.)<br>
Every comparison pattern from this chapter appears here — trace each one.</div>
<a class="link-card codelab" href="/language/ja/grammar?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Review all Chapter 6 patterns</span><span class="lc-sub">Grammar reference on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Tóm tắt ngữ pháp</span>
<h2>Toàn bộ hệ so sánh trên một trang</h2>
<p class="lead">Năm mảnh, một hệ thống. Cách nhanh nhất để làm chủ nó là xem mảnh nào trả lời câu hỏi nào.</p>
<table>
  <thead><tr><th>Bạn muốn nói…</th><th>Mẫu câu</th><th>Tính từ</th><th>Ví dụ</th></tr></thead>
  <tbody>
    <tr><td>A hơn B</td><td>A は B <b>より</b> Adj です</td><td>khẳng định</td><td>にほんごは えいごより むずかしいです</td></tr>
    <tr><td>A không bằng B</td><td>A は B <b>ほど</b> Adj-phủ định です</td><td><b>phủ định</b></td><td>えいごは にほんごほど むずかしくないです</td></tr>
    <tr><td>A là nhất</td><td>[phạm vi]<b>で</b> A <b>が いちばん</b> Adj です</td><td>khẳng định</td><td>一年で 八月が いちばん あついです</td></tr>
    <tr><td>Cái nào trong hai?</td><td>A と B と <b>どちらが</b> Adj ですか</td><td>khẳng định</td><td>えいごと にほんごと どちらが むずかしいですか</td></tr>
    <tr><td>Đáp cho "cái nào trong hai"</td><td>N <b>のほうが</b> Adj です</td><td>khẳng định</td><td>にほんごのほうが むずかしいです</td></tr>
    <tr><td>Cái nào trong nhiều?</td><td>[phạm vi]で <b>なに/いつ/どこ/だれ</b> が いちばん Adj ですか</td><td>khẳng định</td><td>一年で いつが いちばん あついですか</td></tr>
  </tbody>
</table>
<h3>Ba quy tắc phủ hầu hết lỗi thi</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>1. ほど luôn kết thúc bằng phủ định.</b> Cùng họ với あまり và ぜんぜん ở bài 3.4.</div>
  <div class="lz-layer"><b>2. Kẻ thắng nhận が, không bao giờ は.</b> 八月<b>が</b> いちばん…, にほんご<b>のほうが</b>… — so sánh là chọn một khỏi tập hợp, và đó là việc của が.</div>
  <div class="lz-layer"><b>3. どちら cho đúng hai; なに/いつ/どこ/だれ cho ba trở lên.</b> Đếm số lựa chọn trước đã.</div>
</div>
<h3>Ví dụ có lời giải · Một hội thoại so sánh đầy đủ</h3>
<div class="out"><b>Hỏi:</b> すしと ラーメンと どちらが すきですか。(Bạn thích sushi hay ramen hơn?)<br>
<b>Đáp:</b> すしのほうが すきです。ラーメンは すしほど すきじゃありません。(Tôi thích sushi hơn. Ramen thì tôi không thích bằng sushi.)<br>
<b>Hỏi:</b> 日本のりょうりで なにが いちばん すきですか。(Trong các món Nhật, bạn thích gì nhất?)<br>
<b>Đáp:</b> すしが いちばん すきです。(Tôi thích sushi nhất.)<br>
Mọi mẫu so sánh của chương này đều xuất hiện ở đây — hãy lần theo từng cái.</div>
<a class="link-card codelab" href="/language/ja/grammar?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Ôn lại toàn bộ mẫu câu Chương 6</span><span class="lc-sub">Tra cứu ngữ pháp trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 7 — THỂ て (Dekiru Bài 7) ══════════════════ */
    {
      title: 'Chapter 7 — The て-form|||Chương 7 — Thể て',
      description: 'Thể て — "chìa khóa vạn năng" của động từ: nhờ vả (～てください) và nối nhiều hành động.',
      lessons: [
        {
          title: '7.1 — ～てください & connecting actions|||7.1 — ～てください & nối hành động',
          slug: 'jpd123-the-te',
          type: 'VIDEO',
          description: 'Thể て dùng để nhờ vả lịch sự (～てください) và nối chuỗi hành động; vì sao nó là cửa ngõ ngữ pháp.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>The て-form — the most useful shape in Japanese</h2>
<p class="lead">If A1.2 has one "power" grammar point, this is it. The <strong>て-form</strong> of a verb is a connector that unlocks dozens of patterns. At this level you use it for two things: polite requests and joining actions in sequence.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Requests: ～てください</b> = "please do…". まって<b>ください</b> (please wait), 見て<b>ください</b> (please look).</div>
  <div class="lz-layer"><b>Connecting: verb-て, verb-て, …</b> = "do X, then Y". おきて、ごはんを たべて、学校へ 行きます (I get up, eat, and go to school).</div>
</div>
<div class="out"><b>Worked example — a morning routine:</b><br>
6時に おきて、シャワーを あびて、7時に うちを でます。<br>
= I wake up at 6, take a shower, and leave home at 7. Only the <em>final</em> verb carries the tense (でます); the て-forms hang off it.</div>

<div class="pitfall"><b>Trap — forming て is not fully regular.</b> The ending depends on the verb group and its last kana (う/つ/る → って; む/ぶ/ぬ → んで; く → いて…). It takes drilling. There is even a famous song to memorise the rules. Do not expect it to click from one reading — practise the conjugation many times.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Why the て-form is worth extra effort now.</b> The て-form is the gateway to almost all intermediate grammar: ～ています (be doing / ongoing state), ～てもいいです (may I…?), ～てから (after doing…), ～てみる (try doing). Every one of these builds directly on the て-form. Investing in solid て-conjugation at A1.2 pays off across your entire Japanese journey — it is the single highest-leverage thing to over-practise here.</div>
<a class="link-card codelab" href="/language/ja/practice?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">🎯</span>
  <span class="lc-body"><span class="lc-title">Drill the て-form</span><span class="lc-sub">Interactive conjugation practice on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Thể て — hình dạng hữu dụng nhất tiếng Nhật</h2>
<p class="lead">Nếu A1.2 có một điểm ngữ pháp "quyền lực", thì là cái này. <strong>Thể て</strong> của động từ là một chất nối mở khóa hàng chục mẫu. Ở cấp này bạn dùng nó cho hai việc: nhờ vả lịch sự và nối các hành động theo trình tự.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Nhờ vả: ～てください</b> = "hãy… giúp". まって<b>ください</b> (hãy đợi), 見て<b>ください</b> (hãy nhìn).</div>
  <div class="lz-layer"><b>Nối: động-từ-て, động-từ-て, …</b> = "làm X, rồi Y". おきて、ごはんを たべて、学校へ 行きます (Tôi dậy, ăn, rồi đi học).</div>
</div>
<div class="out"><b>Ví dụ có lời giải — thói quen buổi sáng:</b><br>
6時に おきて、シャワーを あびて、7時に うちを でます。<br>
= Tôi dậy lúc 6, tắm, và rời nhà lúc 7. Chỉ động từ <em>cuối</em> mang thì (でます); các thể て treo vào nó.</div>

<div class="pitfall"><b>Bẫy — tạo thể て không hoàn toàn đều.</b> Đuôi phụ thuộc nhóm động từ và kana cuối của nó (う/つ/る → って; む/ぶ/ぬ → んで; く → いて…). Cần luyện nhiều. Thậm chí có một bài hát nổi tiếng để thuộc luật. Đừng mong nó "thấm" từ một lần đọc — luyện chia nhiều lần.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Vì sao thể て đáng công sức thêm ngay bây giờ.</b> Thể て là cửa ngõ tới gần như mọi ngữ pháp trung cấp: ～ています (đang làm / trạng thái tiếp diễn), ～てもいいです (tôi… được không?), ～てから (sau khi làm…), ～てみる (thử làm). Mỗi cái đều xây trực tiếp trên thể て. Đầu tư cho chia て vững ở A1.2 sinh lời suốt cả hành trình tiếng Nhật — đây là thứ đáng luyện quá mức nhất ở đây.</div>
<a class="link-card codelab" href="/language/ja/practice?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">🎯</span>
  <span class="lc-body"><span class="lc-title">Luyện thể て</span><span class="lc-sub">Luyện chia tương tác trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
        {
          title: '7.2 — The complete て-form conjugation table|||7.2 — Bảng chia thể て đầy đủ',
          slug: 'jpd123-bang-chia-the-te',
          type: 'VIDEO',
          description: 'Ba nhóm động từ và mọi quy tắc đổi đuôi — bảng phải học thuộc nằm lòng, kèm ngoại lệ 行きます.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>How to actually build the て-form</h2>
<p class="lead">Lesson 7.1 showed you what the て-form does. This lesson is the mechanics — the exact rules, group by group. This is the single most drilled table in JPD123: you are expected to convert any verb on sight.</p>
<h3>Group 1 (う-verbs) — the ending decides everything</h3>
<table>
  <thead><tr><th>Last kana of the stem</th><th>Becomes</th><th>Examples</th></tr></thead>
  <tbody>
    <tr><td>い · ち · り</td><td><b>って</b></td><td>かいます → か<b>って</b> · まちます → ま<b>って</b> · のります → の<b>って</b></td></tr>
    <tr><td>み · び · に</td><td><b>んで</b></td><td>よみます → よ<b>んで</b> · あそびます → あそ<b>んで</b> · しにます → し<b>んで</b></td></tr>
    <tr><td>き</td><td><b>いて</b></td><td>かきます → か<b>いて</b> · あるきます → ある<b>いて</b></td></tr>
    <tr><td>ぎ</td><td><b>いで</b></td><td>およぎます → およ<b>いで</b> · いそぎます → いそ<b>いで</b></td></tr>
    <tr><td>し</td><td><b>して</b></td><td>はなします → はな<b>して</b> · かします → か<b>して</b></td></tr>
    <tr><td><b>いきます</b> (exception)</td><td><b>いって</b></td><td>いきます → い<b>って</b> — NOT いいて, despite ending in き</td></tr>
  </tbody>
</table>
<h3>Group 2 (る-verbs) — the easy group</h3>
<div class="out">Just drop ます and add て. Nothing else changes:<br>
たべます → たべ<b>て</b> · ねます → ね<b>て</b> · みます → み<b>て</b> · おきます → おき<b>て</b> · でます → で<b>て</b></div>
<h3>Group 3 — only three members</h3>
<table>
  <thead><tr><th>Verb</th><th>て-form</th></tr></thead>
  <tbody>
    <tr><td>します (do)</td><td>して</td></tr>
    <tr><td>きます (come)</td><td>きて</td></tr>
    <tr><td>[noun] + します</td><td>べんきょうします → べんきょう<b>して</b> · そうじします → そうじ<b>して</b></td></tr>
  </tbody>
</table>
<div class="pitfall"><b>The hard truth:</b> the ます-form does NOT tell you which group a verb belongs to. おきます (get up) is Group 2 but きます (come) is Group 3; かえります (return) looks like Group 2 but is Group 1 (かえ<b>って</b>). You must learn the group <em>together with</em> the vocabulary — write it next to every new verb from now on.</div>
<div class="note-ct">Memory aid for Group 1: the three sound families are <b>って</b> (from い/ち/り), <b>んで</b> (from み/び/に), and the く/ぐ pair <b>いて/いで</b>. Notice the voicing carries over: ぎ (voiced) → い<b>で</b> (voiced), び/に (nasal) → ん<b>で</b>. The one thing that breaks the logic is 行きます, which is why every textbook flags it separately.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> The て-form and the past plain form (た-form) follow <b>exactly the same rules</b> — just swap て→た and で→だ. かいて → かいた, よんで → よんだ, して → した. So the table you memorise here does double duty: master it once, and the plain past tense (taught at N4) costs you nothing extra. That is why teachers insist on over-drilling て now.</div>
<a class="link-card codelab" href="/language/ja/practice?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">🎯</span>
  <span class="lc-body"><span class="lc-title">Drill て-form conjugation</span><span class="lc-sub">Interactive practice on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>Cách thực sự tạo ra thể て</h2>
<p class="lead">Bài 7.1 cho bạn biết thể て làm được gì. Bài này là phần cơ khí — quy tắc chính xác, theo từng nhóm. Đây là bảng bị luyện nhiều nhất trong JPD123: bạn được kỳ vọng chuyển đổi bất kỳ động từ nào ngay khi nhìn thấy.</p>
<h3>Nhóm 1 (động từ う) — âm cuối quyết định tất cả</h3>
<table>
  <thead><tr><th>Kana cuối của gốc</th><th>Biến thành</th><th>Ví dụ</th></tr></thead>
  <tbody>
    <tr><td>い · ち · り</td><td><b>って</b></td><td>かいます → か<b>って</b> · まちます → ま<b>って</b> · のります → の<b>って</b></td></tr>
    <tr><td>み · び · に</td><td><b>んで</b></td><td>よみます → よ<b>んで</b> · あそびます → あそ<b>んで</b> · しにます → し<b>んで</b></td></tr>
    <tr><td>き</td><td><b>いて</b></td><td>かきます → か<b>いて</b> · あるきます → ある<b>いて</b></td></tr>
    <tr><td>ぎ</td><td><b>いで</b></td><td>およぎます → およ<b>いで</b> · いそぎます → いそ<b>いで</b></td></tr>
    <tr><td>し</td><td><b>して</b></td><td>はなします → はな<b>して</b> · かします → か<b>して</b></td></tr>
    <tr><td><b>いきます</b> (ngoại lệ)</td><td><b>いって</b></td><td>いきます → い<b>って</b> — KHÔNG PHẢI いいて, dù kết thúc bằng き</td></tr>
  </tbody>
</table>
<h3>Nhóm 2 (động từ る) — nhóm dễ</h3>
<div class="out">Chỉ cần bỏ ます và thêm て. Không đổi gì khác:<br>
たべます → たべ<b>て</b> · ねます → ね<b>て</b> · みます → み<b>て</b> · おきます → おき<b>て</b> · でます → で<b>て</b></div>
<h3>Nhóm 3 — chỉ có ba thành viên</h3>
<table>
  <thead><tr><th>Động từ</th><th>Thể て</th></tr></thead>
  <tbody>
    <tr><td>します (làm)</td><td>して</td></tr>
    <tr><td>きます (đến)</td><td>きて</td></tr>
    <tr><td>[danh từ] + します</td><td>べんきょうします → べんきょう<b>して</b> · そうじします → そうじ<b>して</b></td></tr>
  </tbody>
</table>
<div class="pitfall"><b>Sự thật phũ phàng:</b> thể ます KHÔNG cho bạn biết động từ thuộc nhóm nào. おきます (dậy) thuộc Nhóm 2 nhưng きます (đến) thuộc Nhóm 3; かえります (về) trông như Nhóm 2 nhưng lại là Nhóm 1 (かえ<b>って</b>). Bạn phải học nhóm <em>cùng lúc với</em> từ vựng — từ giờ hãy ghi nhóm ngay cạnh mỗi động từ mới.</div>
<div class="note-ct">Mẹo nhớ Nhóm 1: ba họ âm là <b>って</b> (từ い/ち/り), <b>んで</b> (từ み/び/に), và cặp く/ぐ thành <b>いて/いで</b>. Để ý tính đục được giữ nguyên: ぎ (đục) → い<b>で</b> (đục), び/に (âm mũi) → ん<b>で</b>. Thứ duy nhất phá logic là 行きます, đó là lý do mọi giáo trình đều đánh dấu riêng nó.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> Thể て và thể quá khứ thông thường (thể た) theo <b>đúng cùng một bộ quy tắc</b> — chỉ cần đổi て→た và で→だ. かいて → かいた, よんで → よんだ, して → した. Vậy nên bảng bạn học thuộc ở đây làm nhiệm vụ kép: nắm vững một lần, và thì quá khứ thông thường (dạy ở N4) không tốn thêm gì. Đó là lý do giáo viên khăng khăng bắt luyện て thật nhiều ngay bây giờ.</div>
<a class="link-card codelab" href="/language/ja/practice?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">🎯</span>
  <span class="lc-body"><span class="lc-title">Luyện chia thể て</span><span class="lc-sub">Luyện tương tác trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
        {
          title: '7.3 — ～ています: actions in progress|||7.3 — ～ています: hành động đang diễn ra',
          slug: 'jpd123-teimasu',
          type: 'VIDEO',
          description: 'Thể て + います để nói đang làm gì, cách hỏi 何をしていますか, và dạng rút gọn てます trong khẩu ngữ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.3</span>
<h2>Saying what is happening right now</h2>
<p class="lead">Attach います to the て-form and you get the present continuous — "am/is/are doing". This is the first real pay-off of memorising the て-table.</p>
<div class="out"><b>Pattern:</b> V-て + <b>います</b><br>
わたしは 今 テレビを 見<b>ています</b>。= I am watching TV now.<br>
あには 今 ごはんを 食べ<b>ています</b>。= My older brother is eating now.<br>
ちちは しんぶんを 読ん<b>でいます</b>。= My father is reading the newspaper.</div>
<h3>Asking what someone is doing</h3>
<div class="out"><b>Q:</b> (おとうさんは) 何を し<b>ていますか</b>。= What is (your father) doing?<br>
<b>A:</b> しんぶんを 読ん<b>でいます</b>。= He is reading the newspaper.<br><br>
The question word 何を しています is a fixed, very high-frequency phrase — learn it as a unit.</div>
<h3>Full conjugation</h3>
<table>
  <thead><tr><th>Form</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td>Affirmative</td><td>見ています (is watching)</td></tr>
    <tr><td>Negative</td><td>見ていません (is not watching)</td></tr>
    <tr><td>Past</td><td>見ていました (was watching)</td></tr>
    <tr><td>Question</td><td>見ていますか (is … watching?)</td></tr>
  </tbody>
</table>
<div class="note-ct">います here is the same います you met in JPD113 for animate existence — but its job has changed completely. In ねこが います it means "exists"; in 見ています it is a helper verb meaning "is in the state of". Do not try to translate it separately; treat ～ています as one unit.</div>
<div class="pitfall"><b>Trap — voicing carries over.</b> If the て-form ends in <b>で</b> (from the み/び/に or ぎ groups), it stays で before います: 読ん<b>でいます</b>, あそん<b>でいます</b>, およい<b>でいます</b>. Writing 読んています is wrong. The rule from 7.2 is simple: <b>after ん it is always で, never て</b>.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> In everyday speech the い of います is dropped: 見<b>てます</b>, 食べ<b>てます</b>, 読ん<b>でます</b>. You will hear this constantly in anime, drama and casual conversation — it is not slang, just normal fast speech. But in writing and in JPD123 exams, always write the full ～ています. Also worth knowing: with certain verbs ～ています describes a resulting <em>state</em> rather than an ongoing action — けっこんしています means "is married" (not "is getting married"), and すんでいます means "lives (in)". That nuance becomes important at N4.</div>
<a class="link-card codelab" href="/language/ja/practice?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">🎯</span>
  <span class="lc-body"><span class="lc-title">Drill ～ています</span><span class="lc-sub">Interactive practice on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.3</span>
<h2>Nói việc gì đang diễn ra ngay lúc này</h2>
<p class="lead">Gắn います vào thể て là bạn có thì hiện tại tiếp diễn — "đang làm". Đây là phần thưởng thật sự đầu tiên cho việc học thuộc bảng て.</p>
<div class="out"><b>Mẫu câu:</b> V-て + <b>います</b><br>
わたしは 今 テレビを 見<b>ています</b>。= Tôi đang xem TV bây giờ.<br>
あには 今 ごはんを 食べ<b>ています</b>。= Anh trai tôi đang ăn cơm.<br>
ちちは しんぶんを 読ん<b>でいます</b>。= Bố tôi đang đọc báo.</div>
<h3>Hỏi ai đó đang làm gì</h3>
<div class="out"><b>Hỏi:</b> (おとうさんは) 何を し<b>ていますか</b>。= (Bố bạn) đang làm gì?<br>
<b>Đáp:</b> しんぶんを 読ん<b>でいます</b>。= Bố đang đọc báo.<br><br>
Cụm hỏi 何を しています là một câu cố định tần suất rất cao — học nó như một khối.</div>
<h3>Chia đầy đủ</h3>
<table>
  <thead><tr><th>Dạng</th><th>Ví dụ</th></tr></thead>
  <tbody>
    <tr><td>Khẳng định</td><td>見ています (đang xem)</td></tr>
    <tr><td>Phủ định</td><td>見ていません (không đang xem)</td></tr>
    <tr><td>Quá khứ</td><td>見ていました (đã đang xem)</td></tr>
    <tr><td>Câu hỏi</td><td>見ていますか (có đang xem không?)</td></tr>
  </tbody>
</table>
<div class="note-ct">います ở đây chính là います bạn gặp ở JPD113 cho sự tồn tại của vật sống — nhưng nhiệm vụ của nó đã đổi hoàn toàn. Trong ねこが います nó nghĩa là "tồn tại"; trong 見ています nó là động từ bổ trợ nghĩa "đang ở trạng thái". Đừng cố dịch nó riêng; hãy coi ～ています là một khối.</div>
<div class="pitfall"><b>Bẫy — tính đục được giữ nguyên.</b> Nếu thể て kết thúc bằng <b>で</b> (từ nhóm み/び/に hoặc ぎ), nó vẫn là で trước います: 読ん<b>でいます</b>, あそん<b>でいます</b>, およい<b>でいます</b>. Viết 読んています là sai. Quy tắc từ bài 7.2 rất đơn giản: <b>sau ん luôn là で, không bao giờ là て</b>.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> Trong lời nói hằng ngày, chữ い của います bị lược: 見<b>てます</b>, 食べ<b>てます</b>, 読ん<b>でます</b>. Bạn sẽ nghe liên tục trong anime, phim và hội thoại thân mật — đây không phải tiếng lóng, chỉ là lời nói nhanh bình thường. Nhưng khi viết và trong đề thi JPD123, luôn viết đầy đủ ～ています. Cũng đáng biết: với một số động từ, ～ています mô tả <em>trạng thái</em> kết quả chứ không phải hành động đang diễn ra — けっこんしています nghĩa là "đã có gia đình" (không phải "đang cưới"), và すんでいます nghĩa là "đang sống (ở)". Sắc thái đó trở nên quan trọng ở trình độ N4.</div>
<a class="link-card codelab" href="/language/ja/practice?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">🎯</span>
  <span class="lc-body"><span class="lc-title">Luyện ～ています</span><span class="lc-sub">Luyện tương tác trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
        {
          title: '7.4 — Existence revisited, tools (で) & "how to" (～かた)|||7.4 — Ôn tồn tại, dụng cụ (で) & "cách làm" (～かた)',
          slug: 'jpd123-ton-tai-dung-cu-cach-lam',
          type: 'VIDEO',
          description: 'あります/います nhấn chủ thể hay nhấn nơi chốn, だれが, どの N, phương tiện で, và V-ます + かた.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.4</span>
<h2>Four smaller patterns that complete the chapter</h2>
<p class="lead">These appear throughout Dekiru Lesson 7 alongside the て-form. Each is short, but all four are commonly tested.</p>
<h3>1. Existence — which half do you emphasise?</h3>
<table>
  <thead><tr><th>Focus</th><th>Pattern</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td>On the SUBJECT (I know what, asking where)</td><td>N <b>は</b> [place] <b>に</b> あります/います</td><td>ほん<b>は</b> つくえのうえ<b>に</b> あります。(The book is on the desk)</td></tr>
    <tr><td>On the PLACE (I know where, saying what's there)</td><td>[place] <b>に</b> N <b>が</b> あります/います</td><td>へや<b>に</b> ねこ<b>が</b> います。(There is a cat in the room)</td></tr>
  </tbody>
</table>
<div class="note-ct">Same fact, different starting point. は introduces something already known and tells you where it is; が introduces something new into a known place. Choose by what the listener already has in mind. And remember from JPD113: <b>あります</b> for inanimate things, <b>います</b> for people and animals.</div>
<h3>2. だれが — emphasising who</h3>
<div class="out">だれ<b>が</b> にほんごを はなしますか。= <em>Who</em> speaks Japanese?<br>
When the question word is the subject, it takes が — never は. The answer keeps が too: アンさん<b>が</b> はなします.</div>
<h3>3. どの + noun — "which one?"</h3>
<div class="out">どの ほんですか。= Which book is it?<br>
どの always sits directly before a noun (like この/その/あの from JPD113), and is used when choosing from three or more. For exactly two, use どちら (Chapter 6.3).</div>
<h3>4. Tools &amp; means with で</h3>
<div class="out">はし<b>で</b> さかなを たべます。= I eat fish with chopsticks.<br>
えんぴつ<b>で</b> かきます。= I write with a pencil.<br>
This is the same で you used for transport (バスで いきます) and for place-of-action (としょかんで べんきょうします) — one particle, three related jobs: <b>by means of, using, at</b>.</div>
<h3>5. ～かた — "the way of doing"</h3>
<div class="out">Take the ます-stem and add <b>かた</b> (方):<br>
はなし<s>ます</s> → はなし<b>かた</b> (way of speaking) · つかい<s>ます</s> → つかい<b>かた</b> (way of using) · よみ<s>ます</s> → よみ<b>かた</b> (way of reading / how to read)<br><br>
にほんごの はなしかたを おしえてください。= Please teach me how to speak Japanese.<br>
この かんじの よみかたが わかりません。= I don't know how to read this kanji.</div>
<div class="note-ct">～かた turns a verb into a noun, so it takes noun particles (を, が, は) and can be modified by の: にほんご<b>の</b> はなしかた. This is a genuinely useful pattern for a learner — よみかた (how to read) is a phrase you will need constantly when studying kanji.</div>
<a class="link-card codelab" href="/language/ja/grammar?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Drill these patterns</span><span class="lc-sub">Grammar reference on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.4</span>
<h2>Bốn mẫu câu nhỏ hoàn thiện chương</h2>
<p class="lead">Những mẫu này xuất hiện xuyên suốt Bài 7 của Dekiru cùng với thể て. Mỗi cái đều ngắn, nhưng cả bốn đều hay bị kiểm tra.</p>
<h3>1. Sự tồn tại — bạn nhấn mạnh nửa nào?</h3>
<table>
  <thead><tr><th>Trọng tâm</th><th>Mẫu câu</th><th>Ví dụ</th></tr></thead>
  <tbody>
    <tr><td>Vào CHỦ THỂ (biết cái gì, hỏi ở đâu)</td><td>N <b>は</b> [nơi chốn] <b>に</b> あります/います</td><td>ほん<b>は</b> つくえのうえ<b>に</b> あります。(Quyển sách ở trên bàn)</td></tr>
    <tr><td>Vào NƠI CHỐN (biết ở đâu, nói có gì)</td><td>[nơi chốn] <b>に</b> N <b>が</b> あります/います</td><td>へや<b>に</b> ねこ<b>が</b> います。(Trong phòng có một con mèo)</td></tr>
  </tbody>
</table>
<div class="note-ct">Cùng một sự thật, khác điểm xuất phát. は giới thiệu thứ đã biết rồi cho bạn biết nó ở đâu; が đưa một thứ mới vào một nơi đã biết. Chọn theo điều người nghe đã có sẵn trong đầu. Và nhớ từ JPD113: <b>あります</b> cho vật vô tri, <b>います</b> cho người và động vật.</div>
<h3>2. だれが — nhấn mạnh ai</h3>
<div class="out">だれ<b>が</b> にほんごを はなしますか。= <em>Ai</em> nói tiếng Nhật?<br>
Khi từ để hỏi làm chủ ngữ, nó đi với が — không bao giờ với は. Câu trả lời cũng giữ が: アンさん<b>が</b> はなします.</div>
<h3>3. どの + danh từ — "cái nào?"</h3>
<div class="out">どの ほんですか。= Quyển sách nào?<br>
どの luôn đứng ngay trước danh từ (giống この/その/あの ở JPD113), và dùng khi chọn từ ba thứ trở lên. Với đúng hai thứ, dùng どちら (bài 6.3).</div>
<h3>4. Dụng cụ &amp; phương tiện với で</h3>
<div class="out">はし<b>で</b> さかなを たべます。= Tôi ăn cá bằng đũa.<br>
えんぴつ<b>で</b> かきます。= Tôi viết bằng bút chì.<br>
Đây chính là chữ で bạn đã dùng cho phương tiện (バスで いきます) và cho nơi diễn ra hành động (としょかんで べんきょうします) — một trợ từ, ba nhiệm vụ liên quan: <b>bằng, dùng, tại</b>.</div>
<h3>5. ～かた — "cách làm"</h3>
<div class="out">Lấy gốc ます rồi thêm <b>かた</b> (方):<br>
はなし<s>ます</s> → はなし<b>かた</b> (cách nói) · つかい<s>ます</s> → つかい<b>かた</b> (cách dùng) · よみ<s>ます</s> → よみ<b>かた</b> (cách đọc)<br><br>
にほんごの はなしかたを おしえてください。= Xin hãy dạy tôi cách nói tiếng Nhật.<br>
この かんじの よみかたが わかりません。= Tôi không biết cách đọc chữ Hán này.</div>
<div class="note-ct">～かた biến động từ thành danh từ, nên nó đi với trợ từ của danh từ (を, が, は) và có thể được bổ nghĩa bằng の: にほんご<b>の</b> はなしかた. Đây là mẫu thực sự hữu ích cho người học — よみかた (cách đọc) là cụm bạn sẽ cần liên tục khi học kanji.</div>
<a class="link-card codelab" href="/language/ja/grammar?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Luyện các mẫu này</span><span class="lc-sub">Tra cứu ngữ pháp trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
        {
          title: 'Quiz — The て-form|||Quiz — Thể て',
          slug: 'jpd123-quiz-the-te',
          type: 'QUIZ',
          description: 'Kiểm tra chia thể て ba nhóm, ～てください, ～ています và các mẫu câu Bài 7.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: 'The て-form of かいます (buy) is…|||Thể て của かいます (mua) là…', options: ['かいて', 'かって', 'かんで', 'かいで'], correctIndex: 1, points: 1 },
              { question: 'The て-form of よみます (read) is…|||Thể て của よみます (đọc) là…', options: ['よみて', 'よって', 'よんで', 'よいて'], correctIndex: 2, points: 1 },
              { question: 'The て-form of かきます (write) is…|||Thể て của かきます (viết) là…', options: ['かいて', 'かって', 'かきて', 'かいで'], correctIndex: 0, points: 1 },
              { question: 'The て-form of およぎます (swim) is…|||Thể て của およぎます (bơi) là…', options: ['およいて', 'およいで', 'およって', 'およんで'], correctIndex: 1, points: 1 },
              { question: 'The て-form of いきます (go) is…|||Thể て của いきます (đi) là…', options: ['いいて', 'いって', 'いきて', 'いんで'], correctIndex: 1, points: 1 },
              { question: 'The て-form of たべます (eat) is…|||Thể て của たべます (ăn) là…', options: ['たべて', 'たべって', 'たべんで', 'たべいて'], correctIndex: 0, points: 1 },
              { question: 'The て-form of べんきょうします is…|||Thể て của べんきょうします là…', options: ['べんきょうして', 'べんきょうきて', 'べんきょうって', 'べんきょうんで'], correctIndex: 0, points: 1 },
              { question: '"I am reading the newspaper" is しんぶんを…|||"Tôi đang đọc báo" là しんぶんを…', options: ['読んています', '読んでいます', '読みています', '読っています'], correctIndex: 1, points: 1 },
              { question: '"Please wait a moment" is ちょっと…|||"Xin đợi một chút" là ちょっと…', options: ['まちてください', 'まってください', 'まつてください', 'まんでください'], correctIndex: 1, points: 1 },
              { question: '"How to read" (this kanji) is…|||"Cách đọc" (chữ Hán này) là…', options: ['よみかた', 'よむかた', 'よんでかた', 'よみますかた'], correctIndex: 0, points: 1 },
              { question: 'へや＿ ねこ＿ います (there is a cat in the room) needs…|||へや＿ ねこ＿ います (trong phòng có mèo) cần…', options: ['は / が', 'に / が', 'で / を', 'に / は'], correctIndex: 1, points: 1 },
              { question: 'はし＿ さかなを たべます (eat fish with chopsticks) needs…|||はし＿ さかなを たべます (ăn cá bằng đũa) cần…', options: ['に', 'で', 'を', 'へ'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 8 — KANJI A1.2 & ĐỌC ══════════════════ */
    {
      title: 'Chapter 8 — Kanji A1.2 & reading|||Chương 8 — Kanji A1.2 & đọc',
      description: 'Hơn 40 chữ Hán mới (động từ, thời gian, nơi chốn) và đọc đoạn văn sơ cấp.',
      lessons: [
        {
          title: '8.1 — More kanji & reading passages|||8.1 — Thêm kanji & đọc đoạn văn',
          slug: 'jpd123-kanji',
          type: 'VIDEO',
          description: 'Kanji A1.2 thường gặp (行/食/見/時/来...); học kanji kèm từ; và đọc một đoạn ngắn.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>Kanji for actions &amp; time</h2>
<p class="lead">A1.2 adds about 40 more kanji, now including many that appear inside the verbs and time words you just learned. Seeing 行きます written 行きます (not just いきます) is the goal — real Japanese mixes kanji and kana.</p>
<table>
  <thead><tr><th>Kanji</th><th>Meaning</th><th>In a word</th></tr></thead>
  <tbody>
    <tr><td>行</td><td>go</td><td>行きます (ikimasu, go)</td></tr>
    <tr><td>食</td><td>eat</td><td>食べます (tabemasu, eat)</td></tr>
    <tr><td>見</td><td>see</td><td>見ます (mimasu, see)</td></tr>
    <tr><td>時</td><td>time/hour</td><td>時間 (jikan, time)</td></tr>
    <tr><td>来</td><td>come</td><td>来ます (kimasu, come)</td></tr>
  </tbody>
</table>
<div class="out"><b>Read this:</b> わたしは 毎日 学校へ 行きます。9時に 日本語を 勉強します。<br>= I go to school every day. I study Japanese at 9 o'clock. (Notice kanji 毎日, 学校, 時, 日本語, 勉強 carrying meaning, kana carrying grammar.)</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Kanji readings shift in compounds — on'yomi vs kun'yomi.</b> The same kanji is read differently alone versus in a compound word. 日 is <em>hi</em> (day) alone but <em>nichi/ni</em> in 日本 (Nihon, Japan) and 毎日 (mainichi, every day). Generally: a kanji beside kana (like a verb ending) uses its Japanese <em>kun</em> reading; two kanji stuck together often use the Chinese-derived <em>on</em> reading. This pattern, spotted early, turns kanji from random memorisation into a system you can partly predict.</div>
<a class="link-card codelab" href="/language/ja/hanzi?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">🖌️</span>
  <span class="lc-body"><span class="lc-title">Practise kanji writing</span><span class="lc-sub">Animated stroke order &amp; SRS on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Kanji cho hành động &amp; thời gian</h2>
<p class="lead">A1.2 thêm khoảng 40 kanji nữa, giờ gồm nhiều chữ xuất hiện bên trong các động từ và từ thời gian bạn vừa học. Thấy 行きます viết là 行きます (không chỉ いきます) là mục tiêu — tiếng Nhật thật trộn kanji và kana.</p>
<table>
  <thead><tr><th>Kanji</th><th>Nghĩa</th><th>Trong một từ</th></tr></thead>
  <tbody>
    <tr><td>行</td><td>đi</td><td>行きます (ikimasu, đi)</td></tr>
    <tr><td>食</td><td>ăn</td><td>食べます (tabemasu, ăn)</td></tr>
    <tr><td>見</td><td>thấy</td><td>見ます (mimasu, xem)</td></tr>
    <tr><td>時</td><td>thời gian/giờ</td><td>時間 (jikan, thời gian)</td></tr>
    <tr><td>来</td><td>đến</td><td>来ます (kimasu, đến)</td></tr>
  </tbody>
</table>
<div class="out"><b>Đọc câu này:</b> わたしは 毎日 学校へ 行きます。9時に 日本語を 勉強します。<br>= Tôi đi học mỗi ngày. Tôi học tiếng Nhật lúc 9 giờ. (Để ý kanji 毎日, 学校, 時, 日本語, 勉強 mang nghĩa, kana mang ngữ pháp.)</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Cách đọc kanji đổi trong từ ghép — on'yomi vs kun'yomi.</b> Cùng một kanji đọc khác nhau khi đứng một mình so với trong từ ghép. 日 là <em>hi</em> (ngày) khi đứng một mình nhưng <em>nichi/ni</em> trong 日本 (Nihon, Nhật Bản) và 毎日 (mainichi, mỗi ngày). Nói chung: một kanji cạnh kana (như đuôi động từ) dùng âm <em>kun</em> thuần Nhật; hai kanji dính nhau thường dùng âm <em>on</em> gốc Hán. Mẫu hình này, nhận ra sớm, biến kanji từ học thuộc ngẫu nhiên thành một hệ thống bạn phần nào đoán được.</div>
<a class="link-card codelab" href="/language/ja/hanzi?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">🖌️</span>
  <span class="lc-body"><span class="lc-title">Luyện viết kanji</span><span class="lc-sub">Thứ tự nét động &amp; SRS trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
      ],
    },

    /* ══════════════════ NÂNG CAO ══════════════════ */
    {
      title: 'Advanced — Beyond A1.2|||Nâng cao — Vượt A1.2',
      description: 'Toàn bộ chương này là học thêm: luyện hội thoại thật và lộ trình tới JLPT N5.',
      lessons: [
        {
          title: 'A.1 — Real conversation & the JLPT N5 path|||A.1 — Hội thoại thật & lộ trình JLPT N5',
          slug: 'jpd123-nang-cao',
          type: 'VIDEO',
          description: 'Cách chuyển từ mẫu câu sang nói thật; luyện với AI roleplay; và mục tiêu tiếp theo JLPT N5.',
          content: `
<div class="ml-en">
<span class="eyebrow">Advanced · Lesson A.1</span>
<h2><span class="badge">★ Beyond the syllabus</span> From patterns to real speech</h2>
<p class="lead">After JPD113 + JPD123 you know enough grammar to hold a simple conversation. The gap between "knowing patterns" and "speaking" is closed only by output practice.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Shadowing</b> — listen to a native sentence and repeat it immediately, copying the rhythm. Builds fluent pronunciation fast.</div>
  <div class="lz-layer"><b>Self-talk &amp; a diary</b> — narrate your day in Japanese in your head; write two sentences a day using a new pattern.</div>
  <div class="lz-layer"><b>Roleplay</b> — practise real scenarios: inviting a friend, ordering food, introducing your hometown — exactly the course goals.</div>
</div>
<div class="out"><b>Your A1.2 can-do list:</b> introduce your hometown (adjectives), talk about routines &amp; plans (verbs, time), invite someone (～ませんか), make simple requests (～てください). Practise until each is automatic.</div>

<h3>The JLPT N5 goal</h3>
<p>JPD113 + JPD123 together cover most of <strong>JLPT N5</strong> (the first proficiency level): ~800 words, ~100 kanji, basic grammar. Taking (or self-testing against) N5 is the natural next milestone — it certifies the foundation you now have and motivates the next stage.</p>
<div class="note-ct">Consistency beats intensity: a small daily habit after this course carries you to N5 and genuine conversation within a year. The verbs and て-form you drilled here are the engine of everything that follows.</div>
<a class="link-card codelab" href="/language/ja/roleplay?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">🗣️</span>
  <span class="lc-body"><span class="lc-title">Practise conversation with AI roleplay</span><span class="lc-sub">Real scenarios on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Nâng cao · Bài A.1</span>
<h2><span class="badge">★ Ngoài giáo trình</span> Từ mẫu câu tới nói thật</h2>
<p class="lead">Sau JPD113 + JPD123 bạn biết đủ ngữ pháp để giữ một hội thoại đơn giản. Khoảng cách giữa "biết mẫu" và "nói được" chỉ đóng lại bằng luyện đầu ra.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Shadowing</b> — nghe một câu người bản xứ và lặp lại ngay, sao chép nhịp điệu. Xây phát âm trôi chảy nhanh.</div>
  <div class="lz-layer"><b>Tự nói &amp; nhật ký</b> — kể lại ngày của bạn bằng tiếng Nhật trong đầu; viết hai câu mỗi ngày dùng một mẫu mới.</div>
  <div class="lz-layer"><b>Roleplay</b> — luyện tình huống thật: mời bạn, gọi món, giới thiệu quê hương — đúng mục tiêu môn học.</div>
</div>
<div class="out"><b>Danh sách "làm được" A1.2 của bạn:</b> giới thiệu quê hương (tính từ), nói về thói quen &amp; dự định (động từ, thời gian), mời ai đó (～ませんか), nhờ vả đơn giản (～てください). Luyện tới khi mỗi cái thành tự động.</div>

<h3>Mục tiêu JLPT N5</h3>
<p>JPD113 + JPD123 cùng nhau bao phủ hầu hết <strong>JLPT N5</strong> (cấp năng lực đầu tiên): ~800 từ, ~100 kanji, ngữ pháp cơ bản. Thi (hoặc tự kiểm với) N5 là cột mốc tiếp theo tự nhiên — nó chứng nhận nền tảng bạn đang có và tạo động lực cho giai đoạn kế.</p>
<div class="note-ct">Đều đặn thắng cường độ: một thói quen nhỏ hằng ngày sau môn này đưa bạn tới N5 và hội thoại thật trong vòng một năm. Động từ và thể て bạn luyện ở đây là động cơ của mọi thứ theo sau.</div>
<a class="link-card codelab" href="/language/ja/roleplay?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">🗣️</span>
  <span class="lc-body"><span class="lc-title">Luyện hội thoại với AI roleplay</span><span class="lc-sub">Tình huống thật trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
        {
          title: 'Quiz 2 — Adjectives, invitations, て-form & kanji|||Quiz 2 — Tính từ, mời rủ, thể て & kanji',
          slug: 'jpd123-quiz-2',
          type: 'QUIZ',
          description: 'Kiểm tra tính từ, mời rủ, thể て và kanji A1.2.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'A な-adjective before a noun needs…|||Một tính từ な trước danh từ cần…', options: ['nothing extra|||không thêm gì', 'な between it and the noun|||な giữa nó và danh từ', 'です', 'を'], correctIndex: 1, points: 1 },
              { question: 'きれい is actually a…|||きれい thực chất là một…', options: ['い-adjective|||tính từ い', 'な-adjective (despite ending in い)|||tính từ な (dù kết thúc bằng い)', 'verb|||động từ', 'noun|||danh từ'], correctIndex: 1, points: 1 },
              { question: '～ませんか is used to…|||～ませんか dùng để…', options: ['give a command|||ra lệnh', 'politely invite someone|||mời ai đó một cách lịch sự', 'say goodbye|||chào tạm biệt', 'ask the time|||hỏi giờ'], correctIndex: 1, points: 1 },
              { question: '～ましょう means…|||～ましょう nghĩa là…', options: ['please do it|||hãy làm đi', "let's do it (together)|||cùng làm nào", 'do not do it|||đừng làm', 'did it|||đã làm'], correctIndex: 1, points: 1 },
              { question: 'To make a polite request ("please wait"), you use the て-form plus…|||Để nhờ vả lịch sự ("hãy đợi"), bạn dùng thể て cộng…', options: ['ます', 'ください', 'ません', 'でした'], correctIndex: 1, points: 1 },
              { question: 'The kanji 日 is read differently in 日本 vs alone because… (beyond-syllabus)|||Kanji 日 đọc khác trong 日本 so với đứng một mình vì… (ngoài giáo trình)', options: ['it is a typo|||đó là lỗi gõ', "kanji have on'yomi (compound) &amp; kun'yomi (alone) readings|||kanji có âm on (từ ghép) &amp; âm kun (đứng một mình)", 'it changes meaning entirely|||nó đổi nghĩa hoàn toàn', 'Japanese has no rules|||tiếng Nhật không có luật'], correctIndex: 1, points: 1 },
              { question: 'The counter for long thin objects (pens, bottles) is…|||Trợ số cho vật dài mảnh (bút, chai) là…', options: ['～枚 (まい)', '～本 (ほん)', '～冊 (さつ)', '～杯 (はい)'], correctIndex: 1, points: 1 },
              { question: 'Counting people, 2人 (two people) is read…|||Đếm người, 2人 (hai người) đọc là…', options: ['にじん', 'ふたり', 'ににん', 'ふたつ'], correctIndex: 1, points: 1 },
              { question: '4時 (4:00) is read…|||4時 (4 giờ) đọc là…', options: ['よじ', 'よんじ', 'しじ', 'よっじ'], correctIndex: 0, points: 1 },
            ],
          },
        },
      ],
    },
    /* END-SECTIONS-MARKER */
    {
      "title": "Final Exam|||Thi cuối kỳ",
      "description": "Thi cuối kỳ gồm PE (thi thực hành) và FE (trắc nghiệm). Khung + câu mẫu; đề thật thêm sau khi có trang phòng thi.",
      "lessons": [
        {
          "title": "PE — Practical Exam|||PE — Thi thực hành",
          "slug": "jpd123-final-exam-pe",
          "type": "article",
          "description": "Khung thi thực hành (PE) của môn — format, cách chấm và cách chuẩn bị. Đề thật thêm sau.",
          "content": "\n<div class=\"ml-en\">\n<span class=\"eyebrow\">Final Exam · PE</span>\n<h2>PE — Practical Exam</h2>\n<p class=\"lead\">The Practical Exam (PE) for this subject is a <strong>speaking exam (kaiwa)</strong>: you talk with the examiner &mdash; self-introduction, a short conversation, or a brief presentation on a given topic &mdash; graded on pronunciation, grammar, vocabulary, fluency and responsiveness.</p>\n<h3>How to prepare</h3>\n<ul>\n<li>Practise speaking aloud daily; record yourself and check pronunciation.</li>\n<li>Memorize set phrases for greetings, self-introduction, and asking/answering.</li>\n<li>Prepare 3&ndash;5 common topics and be able to speak ~1 minute on each.</li>\n<li>When you do not understand, ask politely to repeat (&laquo;mou ichido onegaishimasu&raquo;) &mdash; do not freeze.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Sample</span> A real practical prompt bank for this subject will be added here later, in the exam room. Use the guidance above to prepare now.</div>\n</div>\n<div class=\"ml-vi\">\n<span class=\"eyebrow\">Thi cuối kỳ · PE</span>\n<h2>PE — Thi thực hành</h2>\n<p class=\"lead\">Thi thực hành (PE) của môn này là <strong>thi nói (kaiwa / speaking)</strong>: bạn nói chuyện với giám khảo &mdash; tự giới thiệu, một đoạn hội thoại ngắn, hoặc thuyết trình ngắn về một chủ đề cho sẵn &mdash; chấm theo phát âm, ngữ pháp, từ vựng, độ trôi chảy và khả năng phản hồi.</p>\n<h3>Cách chuẩn bị</h3>\n<ul>\n<li>Luyện nói to mỗi ngày; tự ghi âm và kiểm phát âm.</li>\n<li>Thuộc mẫu câu chào hỏi, tự giới thiệu, và hỏi/đáp.</li>\n<li>Chuẩn bị 3&ndash;5 chủ đề quen và nói được ~1 phút mỗi chủ đề.</li>\n<li>Khi không hiểu, lịch sự xin nhắc lại (&laquo;mou ichido onegaishimasu&raquo;) &mdash; đừng đơ.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Câu mẫu</span> Ngân hàng đề thực hành thật cho môn này sẽ được thêm vào đây sau, trong trang phòng thi. Dùng hướng dẫn trên để chuẩn bị ngay từ giờ.</div>\n</div>"
        },
        {
          "title": "FE — Final Exam (Multiple Choice)|||FE — Thi trắc nghiệm cuối kỳ",
          "slug": "jpd123-final-exam-fe",
          "type": "article",
          "description": "Khung thi trắc nghiệm cuối kỳ (FE) + vài câu mẫu từ môn. Đề thật thêm sau.",
          "content": "\n<div class=\"ml-en\">\n<span class=\"eyebrow\">Final Exam · FE</span>\n<h2>FE — Final Exam (Multiple Choice)</h2>\n<p class=\"lead\">The Final Exam (FE) for this subject is a <strong>computer-graded multiple-choice test</strong>. For the exact number of questions, duration, weight and pass mark, see <em>Lesson 0.2 — Grading</em>.</p>\n<h3>How to do well</h3>\n<ul>\n<li>Pace yourself: divide time by the number of questions; flag hard ones and return at the end.</li>\n<li>Eliminate clearly wrong options first, then choose among the rest.</li>\n<li>For \"what should you do / which is best\" items, answer by this subject's method, not gut feeling.</li>\n<li>Never leave the gated final blank &mdash; an educated guess beats an empty answer.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Sample</span> The questions below are <strong>sample questions</strong> drawn from this course to show the format. The <em>real past-exam questions</em> will be added here later, in the exam room.</div>\n</div>\n<div class=\"ml-vi\">\n<span class=\"eyebrow\">Thi cuối kỳ · FE</span>\n<h2>FE — Thi trắc nghiệm cuối kỳ</h2>\n<p class=\"lead\">Bài thi cuối kỳ (FE) của môn này là <strong>thi trắc nghiệm, máy chấm</strong>. Số câu, thời gian, trọng số và điểm qua cụ thể: xem <em>Bài 0.2 — Thang điểm</em>.</p>\n<h3>Cách làm tốt</h3>\n<ul>\n<li>Phân bổ thời gian: chia đều theo số câu; đánh dấu câu khó, quay lại ở cuối.</li>\n<li>Loại phương án sai rõ ràng trước, rồi chọn trong số còn lại.</li>\n<li>Câu \"nên làm gì / cái nào tốt nhất\" &mdash; trả lời theo phương pháp của môn, không theo cảm tính.</li>\n<li>Đừng bao giờ bỏ trống bài thi có cổng &mdash; đoán có suy luận vẫn hơn để trống.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Câu mẫu</span> Các câu dưới đây là <strong>câu mẫu</strong> lấy từ chính môn học để minh hoạ format. <em>Đề thi thật</em> sẽ được thêm vào đây sau, trong trang phòng thi.</div>\n</div>",
          "quiz": {
            "timeLimitSeconds": 360,
            "questions": [
              {
                "id": "q1",
                "points": 1,
                "question": "In a Japanese sentence, the verb usually comes…|||Trong câu tiếng Nhật, động từ thường đứng…",
                "options": [
                  "first|||đầu tiên",
                  "at the very end|||ở tận cuối",
                  "in the middle|||ở giữa",
                  "anywhere|||bất kỳ đâu"
                ],
                "correctIndex": 1
              },
              {
                "id": "q2",
                "points": 1,
                "question": "The polite past-negative of たべます (eat) is…|||Thể quá-khứ-phủ-định lịch sự của たべます (ăn) là…",
                "options": [
                  "たべません",
                  "たべました",
                  "たべませんでした",
                  "たべます"
                ],
                "correctIndex": 2
              },
              {
                "id": "q3",
                "points": 1,
                "question": "The particle that marks the direct object (the thing acted on) is…|||Trợ từ đánh dấu tân ngữ trực tiếp (vật bị tác động) là…",
                "options": [
                  "へ",
                  "を",
                  "で",
                  "に"
                ],
                "correctIndex": 1
              },
              {
                "id": "q4",
                "points": 1,
                "question": "To say the place where an action happens (study at the library), use…|||Để nói nơi một hành động xảy ra (học ở thư viện), dùng…",
                "options": [
                  "に",
                  "で",
                  "へ",
                  "を"
                ],
                "correctIndex": 1
              },
              {
                "id": "q5",
                "points": 1,
                "question": "A point in time (wake up AT 7) is marked with…|||Một thời điểm (thức dậy LÚC 7 giờ) được đánh dấu bằng…",
                "options": [
                  "を",
                  "に",
                  "で",
                  "は"
                ],
                "correctIndex": 1
              },
              {
                "id": "q6",
                "points": 1,
                "question": "The ます-form conjugations are notable for being… (beyond-syllabus insight)|||Cách chia thể ます đáng chú ý vì… (gợi ý ngoài giáo trình)",
                "options": [
                  "completely irregular|||hoàn toàn bất quy tắc",
                  "perfectly regular across all verbs|||hoàn toàn đều với mọi động từ",
                  "only for one verb|||chỉ cho một động từ",
                  "never used|||không bao giờ dùng"
                ],
                "correctIndex": 1
              }
            ]
          }
        }
      ]
    },
  ],
};
