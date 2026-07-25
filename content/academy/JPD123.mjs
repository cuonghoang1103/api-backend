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
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Adjectives (い &amp; な)</div><div class="lz-nsub">Describe things &amp; your hometown</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Time, days &amp; numbers</div><div class="lz-nsub">When things happen</div></div></div>
  <div class="lz-stage">Interacting</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Invitations &amp; suggestions</div><div class="lz-nsub">～ませんか · ～ましょう</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">The て-form</div><div class="lz-nsub">Requests · connecting actions</div></div></div>
  <div class="lz-stage">Reading</div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Kanji A1.2 &amp; reading</div><div class="lz-nsub">40 kanji · short passages</div></div></div>
  <div class="lz-stage">Beyond A1.2</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Conversation practice · the JLPT N5 goal</div><div class="lz-nsub">Keep the momentum</div></div></div>
</div>
<div class="callout ok">The habit from JPD113 still rules: ten minutes of vocabulary and kanji every day, with spaced repetition. Verbs and adjectives multiply what you can say — but only if the base words are automatic.</div>
<a class="link-card codelab" href="/language/ja/grammar?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">🈴</span>
  <span class="lc-body"><span class="lc-title">Practise grammar &amp; vocab on My Language</span><span class="lc-sub">Japanese grammar patterns, vocabulary SRS and kanji.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
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
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Tính từ (い &amp; な)</div><div class="lz-nsub">Mô tả sự vật &amp; quê hương</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Thời gian, ngày &amp; số</div><div class="lz-nsub">Khi nào việc xảy ra</div></div></div>
  <div class="lz-stage">Tương tác</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Mời rủ &amp; đề xuất</div><div class="lz-nsub">～ませんか · ～ましょう</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Thể て</div><div class="lz-nsub">Nhờ vả · nối hành động</div></div></div>
  <div class="lz-stage">Đọc</div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Kanji A1.2 &amp; đọc</div><div class="lz-nsub">40 kanji · đoạn ngắn</div></div></div>
  <div class="lz-stage">Vượt A1.2</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Luyện hội thoại · mục tiêu JLPT N5</div><div class="lz-nsub">Giữ đà tiến</div></div></div>
</div>
<div class="callout ok">Thói quen từ JPD113 vẫn là vua: mười phút từ vựng và kanji mỗi ngày, có lặp lại ngắt quãng. Động từ và tính từ nhân bội thứ bạn nói được — nhưng chỉ khi các từ nền đã thành phản xạ.</div>
<a class="link-card codelab" href="/language/ja/grammar?ref=%2Fcourses%2Felementary-japanese-1-a12%2Flearn&reflabel=JPD123%20%E2%80%94%20Elementary%20Japanese%20A1.2" target="_blank" rel="noopener">
  <span class="lc-ico">🈴</span>
  <span class="lc-body"><span class="lc-title">Luyện ngữ pháp &amp; từ vựng trên My Language</span><span class="lc-sub">Mẫu ngữ pháp tiếng Nhật, từ vựng SRS và kanji.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
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

    /* ══════════════════ CHƯƠNG 5 — THỂ て ══════════════════ */
    {
      title: 'Chapter 5 — The て-form|||Chương 5 — Thể て',
      description: 'Thể て — "chìa khóa vạn năng" của động từ: nhờ vả (～てください) và nối nhiều hành động.',
      lessons: [
        {
          title: '5.1 — ～てください & connecting actions|||5.1 — ～てください & nối hành động',
          slug: 'jpd123-the-te',
          type: 'VIDEO',
          description: 'Thể て dùng để nhờ vả lịch sự (～てください) và nối chuỗi hành động; vì sao nó là cửa ngõ ngữ pháp.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
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
<span class="eyebrow">Chương 5 · Bài 5.1</span>
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
      ],
    },

    /* ══════════════════ CHƯƠNG 6 — KANJI A1.2 & ĐỌC ══════════════════ */
    {
      title: 'Chapter 6 — Kanji A1.2 & reading|||Chương 6 — Kanji A1.2 & đọc',
      description: 'Hơn 40 chữ Hán mới (động từ, thời gian, nơi chốn) và đọc đoạn văn sơ cấp.',
      lessons: [
        {
          title: '6.1 — More kanji & reading passages|||6.1 — Thêm kanji & đọc đoạn văn',
          slug: 'jpd123-kanji',
          type: 'VIDEO',
          description: 'Kanji A1.2 thường gặp (行/食/見/時/来...); học kanji kèm từ; và đọc một đoạn ngắn.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
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
<span class="eyebrow">Chương 6 · Bài 6.1</span>
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
