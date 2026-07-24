/**
 * JPD113 — Elementary Japanese 1-A1.1 (Tiếng Nhật sơ cấp 1-A1.1). Kỳ 3.
 * Bám syllabus FPTU (sylID 14232, 5 CLO) + giáo trình できる日本語 初級 (Dekiru Nihongo)
 * + 漢字たまご (Kanji Tamago) + Kana Nyuumon. Tiên quyết: None.
 * Song ngữ EN/VN (.ml-en/.ml-vi). KHÔNG CodeLab — luyện qua My Language (/language/ja) + heyjapan.net.
 * Mục tiêu A1.1: kana thành thạo, ~200 từ vựng, 23 mẫu ngữ pháp, 35 kanji, tự giới thiệu.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/JPD113.mjs --apply
 */
export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'JPD113',
    slug: 'elementary-japanese-1-a11',
    title: 'Elementary Japanese 1 (A1.1)',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'Your first step into Japanese: read and write both kana alphabets (hiragana & katakana), learn ~200 words and 35 kanji, master 23 grammar patterns, and introduce yourself. Practise every character and word on My Language.|||Bước đầu vào tiếng Nhật: đọc & viết cả hai bảng kana (hiragana & katakana), học ~200 từ và 35 kanji, thành thạo 23 mẫu ngữ pháp, và tự giới thiệu. Luyện từng chữ và từ trên My Language.',
    description: 'Môn nhập môn tiếng Nhật trình độ A1.1, không yêu cầu biết trước. Bạn sẽ đọc và viết thành thạo hai bảng chữ cái kana (hiragana - chữ mềm và katakana - chữ cứng), ghi nhớ khoảng 200 từ vựng cơ bản, 35 chữ Hán (kanji), và 23 mẫu ngữ pháp, đủ để tự giới thiệu bản thân và đọc đoạn văn ngắn. Giáo trình theo bộ できる日本語 (Dekiru Nihongo). Tiên quyết: không.',
    whatYouLearn: 'Đọc & viết Hiragana (chữ mềm) và Katakana (chữ cứng) đầy đủ; âm đục/bán đục, âm ghép, trường âm, âm ngắt; chào hỏi và câu dùng trong lớp; số đếm; ~200 từ vựng chủ đề; 23 mẫu ngữ pháp sơ cấp (は, の, です, これ/それ/あれ, あります/います…); 35 chữ Hán cơ bản; tự giới thiệu bản thân; và đọc đoạn văn ngắn.',
    requirements: 'Tiên quyết: không có. Cần một cuốn vở luyện viết kana, và (khuyên dùng) tài khoản để luyện trên My Language + heyjapan.net. Không cần biết tiếng Nhật trước.',
    documentsNote: 'Giáo trình: できる日本語 初級 本冊 (Dekiru Nihongo) · わたしのことばノート・わたしの文法ノート · 漢字たまご 初級 (Kanji Tamago) · Kana Nyuumon (Japan Foundation). Công cụ: My Language (/language/ja) để luyện kana/từ vựng/kanji, và heyjapan.net. Kèm file syllabus gốc JPD113.pdf.',
  },
  sections: [
    /* ══════════════════ MỤC 0 ══════════════════ */
    {
      title: 'Section 0 — Introduction & Study Guide|||Mục 0 — Giới thiệu môn học & Hướng dẫn học',
      description: 'Đọc trước tiên: môn học là gì, mục tiêu A1.1, điều kiện qua môn, và cách học tiếng Nhật hiệu quả.',
      lessons: [
        {
          title: '0.1 — About JPD113 & the study map|||0.1 — Giới thiệu JPD113 & bản đồ học',
          slug: 'jpd113-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Tiếng Nhật sơ cấp A1.1 gồm những gì, và lộ trình từ kana tới tự giới thiệu.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>About JPD113 — Elementary Japanese A1.1</h2>
<p class="lead">This is your first step into Japanese — from zero. Japanese uses three writing systems; A1.1 gives you the two phonetic ones (<strong>hiragana</strong> and <strong>katakana</strong>) plus your first <strong>kanji</strong>, enough vocabulary and grammar to introduce yourself and read simple text.</p>
<p>The goal by the end: read and write both kana fluently, know ~200 words, 35 kanji and 23 grammar patterns. It is very achievable with daily practice — Japanese rewards little-and-often.</p>
<h3>Study map</h3>
<div class="lz-map">
  <div class="lz-stage">The alphabets first</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Hiragana ひらがな</div><div class="lz-nsub">46 base + voiced + combined + long/small</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Katakana カタカナ</div><div class="lz-nsub">The "hard" kana for foreign words</div></div></div>
  <div class="lz-stage">Speaking &amp; grammar</div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Greetings, classroom &amp; numbers</div><div class="lz-nsub">Everyday phrases · counting</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Lesson 1 — self-introduction</div><div class="lz-nsub">は · です · の</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Lessons 2–3 — this/that &amp; places</div><div class="lz-nsub">これ/それ/あれ · あります/います</div></div></div>
  <div class="lz-stage">Reading &amp; characters</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Kanji &amp; short reading</div><div class="lz-nsub">35 basic kanji · reading passages</div></div></div>
  <div class="lz-stage">Beyond A1.1</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Study method · the JLPT N5 path</div><div class="lz-nsub">Keep the momentum going</div></div></div>
</div>
<div class="callout ok">Japanese is a memory-and-habit skill. Ten minutes of kana and vocabulary every day beats a three-hour cram once a week. Use the spaced-repetition tools below.</div>
<a class="link-card codelab" href="/language/ja/alphabet?ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">🈴</span>
  <span class="lc-body"><span class="lc-title">Learn the kana on My Language</span><span class="lc-sub">Interactive hiragana/katakana with stroke order &amp; spaced repetition.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Giới thiệu JPD113 — Tiếng Nhật sơ cấp A1.1</h2>
<p class="lead">Đây là bước đầu tiên của bạn vào tiếng Nhật — từ số không. Tiếng Nhật dùng ba hệ chữ viết; A1.1 cho bạn hai hệ ghi âm (<strong>hiragana</strong> và <strong>katakana</strong>) cộng những <strong>kanji</strong> đầu tiên, đủ từ vựng và ngữ pháp để tự giới thiệu và đọc văn bản đơn giản.</p>
<p>Mục tiêu cuối kỳ: đọc và viết cả hai kana thành thạo, biết ~200 từ, 35 kanji và 23 mẫu ngữ pháp. Rất khả thi nếu luyện mỗi ngày — tiếng Nhật thưởng cho việc học ít-mà-đều.</p>
<h3>Bản đồ học</h3>
<div class="lz-map">
  <div class="lz-stage">Bảng chữ cái trước</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Hiragana ひらがな</div><div class="lz-nsub">46 chữ gốc + âm đục + âm ghép + trường/ngắt</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Katakana カタカナ</div><div class="lz-nsub">Chữ "cứng" cho từ ngoại lai</div></div></div>
  <div class="lz-stage">Nói &amp; ngữ pháp</div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Chào hỏi, câu trong lớp &amp; số đếm</div><div class="lz-nsub">Câu hằng ngày · đếm số</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Bài 1 — tự giới thiệu</div><div class="lz-nsub">は · です · の</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Bài 2–3 — cái này/cái kia &amp; nơi chốn</div><div class="lz-nsub">これ/それ/あれ · あります/います</div></div></div>
  <div class="lz-stage">Đọc &amp; chữ Hán</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Kanji &amp; đọc đoạn ngắn</div><div class="lz-nsub">35 kanji cơ bản · bài đọc</div></div></div>
  <div class="lz-stage">Vượt A1.1</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Phương pháp học · lộ trình JLPT N5</div><div class="lz-nsub">Giữ đà tiến</div></div></div>
</div>
<div class="callout ok">Tiếng Nhật là kỹ năng trí nhớ và thói quen. Mười phút kana và từ vựng mỗi ngày hơn ba tiếng nhồi một lần mỗi tuần. Dùng các công cụ lặp lại ngắt quãng bên dưới.</div>
<a class="link-card codelab" href="/language/ja/alphabet?ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">🈴</span>
  <span class="lc-body"><span class="lc-title">Học kana trên My Language</span><span class="lc-sub">Hiragana/katakana tương tác kèm thứ tự nét &amp; lặp lại ngắt quãng.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
        {
          title: '0.2 — Passing requirements & how to study|||0.2 — Điều kiện qua môn & cách học',
          slug: 'jpd113-dieu-kien-qua-mon',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Tổng giờ, điểm sàn qua môn, và phương pháp học tiếng Nhật hiệu quả với công cụ SRS.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Passing requirements &amp; how to study</h2>
<p class="lead">From the official JPD113 syllabus. There is no prerequisite — anyone can start. The exam checks kana reading/writing, vocabulary, grammar and a self-introduction.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Credits</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Total hours</span><span class="v">150h <small>45h class (20 sessions) + exam + self-study</small></span></div>
  <div class="kv"><span class="k">Prerequisite</span><span class="v">None</span></div>
  <div class="kv"><span class="k">Grading scale</span><span class="v">10 <small>pass when average ≥ 5.0</small></span></div>
  <div class="kv"><span class="k">Targets</span><span class="v">~200 words · 23 grammar · 35 kanji</span></div>
</div>
<h3>How to actually learn Japanese</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Kana before everything.</b> You cannot progress until reading hiragana is automatic. Spend the first weeks here — it pays back all term.</div>
  <div class="lz-layer"><b>Spaced repetition daily.</b> Review characters and words with an SRS (My Language, heyjapan) so they move into long-term memory.</div>
  <div class="lz-layer"><b>Write by hand.</b> Copy each kana and kanji with correct stroke order — it cements the shape far better than reading.</div>
  <div class="lz-layer"><b>Say it out loud.</b> Practise greetings and self-introduction aloud, not just in your head.</div>
</div>
<a class="link-card exphub" href="/exp-hub/jpd113-cong-cu-hoc?ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Study tools for Japanese</span><span class="lc-sub">My Language, heyjapan.net &amp; how to use them — on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Điều kiện qua môn &amp; cách học</h2>
<p class="lead">Từ syllabus chính thức JPD113. Không có tiên quyết — ai cũng bắt đầu được. Kỳ thi kiểm đọc/viết kana, từ vựng, ngữ pháp và một bài tự giới thiệu.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Tín chỉ</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Tổng giờ</span><span class="v">150h <small>45h lớp (20 session) + thi + tự học</small></span></div>
  <div class="kv"><span class="k">Tiên quyết</span><span class="v">Không</span></div>
  <div class="kv"><span class="k">Thang điểm</span><span class="v">10 <small>qua khi trung bình ≥ 5.0</small></span></div>
  <div class="kv"><span class="k">Mục tiêu</span><span class="v">~200 từ · 23 ngữ pháp · 35 kanji</span></div>
</div>
<h3>Cách học tiếng Nhật thực sự</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Kana trước mọi thứ.</b> Bạn không tiến được cho tới khi đọc hiragana thành phản xạ. Dồn những tuần đầu vào đây — nó sinh lời cả kỳ.</div>
  <div class="lz-layer"><b>Lặp lại ngắt quãng mỗi ngày.</b> Ôn chữ và từ bằng SRS (My Language, heyjapan) để chúng vào trí nhớ dài hạn.</div>
  <div class="lz-layer"><b>Viết tay.</b> Chép từng kana và kanji theo đúng thứ tự nét — nó khắc sâu hình dạng hơn nhiều so với chỉ đọc.</div>
  <div class="lz-layer"><b>Nói to.</b> Luyện chào hỏi và tự giới thiệu thành tiếng, không chỉ trong đầu.</div>
</div>
<a class="link-card exphub" href="/exp-hub/jpd113-cong-cu-hoc?ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Công cụ học tiếng Nhật</span><span class="lc-sub">My Language, heyjapan.net &amp; cách dùng — trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 1 — HIRAGANA ══════════════════ */
    {
      title: 'Chapter 1 — Hiragana ひらがな|||Chương 1 — Hiragana ひらがな',
      description: 'Bảng chữ mềm: 46 âm gốc, âm đục/bán đục, âm ghép, trường âm và âm ngắt.',
      lessons: [
        {
          title: '1.1 — The 46 base hiragana|||1.1 — 46 âm gốc hiragana',
          slug: 'jpd113-hiragana-goc',
          type: 'VIDEO',
          description: 'Bảng gojūon: 5 nguyên âm + các hàng k/s/t/n/h/m/y/r/w — nền của mọi âm tiếng Nhật.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>The 46 base hiragana</h2>
<p class="lead">Hiragana is the "soft" phonetic alphabet — the first thing every learner masters. It is arranged in a grid (gojūon) of 5 vowels crossed with consonants. Learn it row by row.</p>
<table>
  <thead><tr><th></th><th>a</th><th>i</th><th>u</th><th>e</th><th>o</th></tr></thead>
  <tbody>
    <tr><td>—</td><td>あ</td><td>い</td><td>う</td><td>え</td><td>お</td></tr>
    <tr><td>k</td><td>か</td><td>き</td><td>く</td><td>け</td><td>こ</td></tr>
    <tr><td>s</td><td>さ</td><td>し</td><td>す</td><td>せ</td><td>そ</td></tr>
    <tr><td>t</td><td>た</td><td>ち</td><td>つ</td><td>て</td><td>と</td></tr>
    <tr><td>n</td><td>な</td><td>に</td><td>ぬ</td><td>ね</td><td>の</td></tr>
    <tr><td>h</td><td>は</td><td>ひ</td><td>ふ</td><td>へ</td><td>ほ</td></tr>
    <tr><td>m</td><td>ま</td><td>み</td><td>む</td><td>め</td><td>も</td></tr>
    <tr><td>y</td><td>や</td><td></td><td>ゆ</td><td></td><td>よ</td></tr>
    <tr><td>r</td><td>ら</td><td>り</td><td>る</td><td>れ</td><td>ろ</td></tr>
    <tr><td>w</td><td>わ</td><td></td><td></td><td></td><td>を</td></tr>
    <tr><td>n</td><td colspan="5">ん (the only standalone consonant)</td></tr>
  </tbody>
</table>
<div class="note-ct">Read left-to-right: あ=a, か=ka, さ=sa… A few are irregular — し=shi (not si), ち=chi, つ=tsu, ふ=fu. Learn these by sound, not by the pattern.</div>
<a class="link-card codelab" href="/language/ja/alphabet?ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">✍️</span>
  <span class="lc-body"><span class="lc-title">Practise hiragana with stroke order</span><span class="lc-sub">Trace each character &amp; drill with spaced repetition.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>46 âm gốc hiragana</h2>
<p class="lead">Hiragana là bảng chữ ghi âm "mềm" — thứ đầu tiên mọi người học phải thuộc. Nó xếp thành lưới (gojūon) gồm 5 nguyên âm giao với các phụ âm. Học từng hàng.</p>
<table>
  <thead><tr><th></th><th>a</th><th>i</th><th>u</th><th>e</th><th>o</th></tr></thead>
  <tbody>
    <tr><td>—</td><td>あ</td><td>い</td><td>う</td><td>え</td><td>お</td></tr>
    <tr><td>k</td><td>か</td><td>き</td><td>く</td><td>け</td><td>こ</td></tr>
    <tr><td>s</td><td>さ</td><td>し</td><td>す</td><td>せ</td><td>そ</td></tr>
    <tr><td>t</td><td>た</td><td>ち</td><td>つ</td><td>て</td><td>と</td></tr>
    <tr><td>n</td><td>な</td><td>に</td><td>ぬ</td><td>ね</td><td>の</td></tr>
    <tr><td>h</td><td>は</td><td>ひ</td><td>ふ</td><td>へ</td><td>ほ</td></tr>
    <tr><td>m</td><td>ま</td><td>み</td><td>む</td><td>め</td><td>も</td></tr>
    <tr><td>y</td><td>や</td><td></td><td>ゆ</td><td></td><td>よ</td></tr>
    <tr><td>r</td><td>ら</td><td>り</td><td>る</td><td>れ</td><td>ろ</td></tr>
    <tr><td>w</td><td>わ</td><td></td><td></td><td></td><td>を</td></tr>
    <tr><td>n</td><td colspan="5">ん (phụ âm đứng một mình duy nhất)</td></tr>
  </tbody>
</table>
<div class="note-ct">Đọc trái sang phải: あ=a, か=ka, さ=sa… Vài chữ bất quy tắc — し=shi (không phải si), ち=chi, つ=tsu, ふ=fu. Học chúng theo âm, không theo mẫu.</div>
<a class="link-card codelab" href="/language/ja/alphabet?ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">✍️</span>
  <span class="lc-body"><span class="lc-title">Luyện hiragana theo thứ tự nét</span><span class="lc-sub">Tô từng chữ &amp; ôn bằng lặp lại ngắt quãng.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
        {
          title: '1.2 — Voiced, combined, long & double sounds|||1.2 — Âm đục, âm ghép, trường âm & âm ngắt',
          slug: 'jpd113-hiragana-bien-am',
          type: 'VIDEO',
          description: 'Dakuten/handakuten (が/ぱ), âm ghép (きゃ), trường âm (おう), và âm ngắt っ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>Beyond the 46 — the sound modifiers</h2>
<p class="lead">Once you know the base kana, four rules unlock every remaining sound. They are small marks and combinations, not new characters — so learning is fast.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Dakuten (゛) — voiced.</b> か→が (ka→ga), さ→ざ, た→だ, は→ば. A little quote mark voices the consonant.</div>
  <div class="lz-layer"><b>Handakuten (゜) — p-sounds.</b> は→ぱ (ha→pa), ひ→ぴ, ふ→ぷ. A little circle.</div>
  <div class="lz-layer"><b>Combined (yōon).</b> A small や/ゆ/よ merges: き+ゃ = きゃ (kya), し+ょ = しょ (sho).</div>
  <div class="lz-layer"><b>Long vowels &amp; small っ.</b> おう lengthens the o; a small っ doubles the next consonant: がっこう = gakkō (school).</div>
</div>
<div class="pitfall"><b>Watch:</b> the small っ (sokuon) is written smaller than a normal つ and means "double the next consonant" — きって (kitte, stamp) vs きて (kite, come). Long vowels and double consonants change meaning, so hear them carefully.</div>
<a class="link-card codelab" href="/language/ja/alphabet?ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">✍️</span>
  <span class="lc-body"><span class="lc-title">Drill dakuten & combined sounds</span><span class="lc-sub">On My Language, with audio.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Vượt 46 chữ — các bộ biến âm</h2>
<p class="lead">Khi đã biết kana gốc, bốn quy tắc mở khóa mọi âm còn lại. Chúng là các dấu nhỏ và tổ hợp, không phải chữ mới — nên học rất nhanh.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Dakuten (゛) — âm đục.</b> か→が (ka→ga), さ→ざ, た→だ, は→ば. Một dấu nháy nhỏ làm đục phụ âm.</div>
  <div class="lz-layer"><b>Handakuten (゜) — âm p.</b> は→ぱ (ha→pa), ひ→ぴ, ふ→ぷ. Một vòng tròn nhỏ.</div>
  <div class="lz-layer"><b>Âm ghép (yōon).</b> Một や/ゆ/よ nhỏ ghép vào: き+ゃ = きゃ (kya), し+ょ = しょ (sho).</div>
  <div class="lz-layer"><b>Trường âm &amp; っ nhỏ.</b> おう kéo dài âm o; một っ nhỏ gấp đôi phụ âm kế: がっこう = gakkō (trường học).</div>
</div>
<div class="pitfall"><b>Chú ý:</b> っ nhỏ (âm ngắt/sokuon) viết nhỏ hơn つ thường và nghĩa là "gấp đôi phụ âm kế" — きって (kitte, con tem) vs きて (kite, hãy đến). Trường âm và phụ âm đôi làm đổi nghĩa, nên nghe kỹ.</div>
<a class="link-card codelab" href="/language/ja/alphabet?ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">✍️</span>
  <span class="lc-body"><span class="lc-title">Luyện âm đục & âm ghép</span><span class="lc-sub">Trên My Language, có âm thanh.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 2 — KATAKANA ══════════════════ */
    {
      title: 'Chapter 2 — Katakana カタカナ|||Chương 2 — Katakana カタカナ',
      description: 'Bảng chữ cứng dùng cho từ ngoại lai, tên nước ngoài và từ tượng thanh.',
      lessons: [
        {
          title: '2.1 — Katakana & when to use it|||2.1 — Katakana & khi nào dùng',
          slug: 'jpd113-katakana',
          type: 'VIDEO',
          description: 'Cùng bộ âm với hiragana nhưng hình dạng khác; dùng cho từ mượn, tên, thương hiệu.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Katakana — the "hard" kana</h2>
<p class="lead">Katakana represents the <em>same</em> sounds as hiragana, with different, more angular shapes. It is used for foreign loanwords, foreign names, brand names and sound effects. Your name will be written in katakana.</p>
<table>
  <thead><tr><th></th><th>a</th><th>i</th><th>u</th><th>e</th><th>o</th></tr></thead>
  <tbody>
    <tr><td>—</td><td>ア</td><td>イ</td><td>ウ</td><td>エ</td><td>オ</td></tr>
    <tr><td>k</td><td>カ</td><td>キ</td><td>ク</td><td>ケ</td><td>コ</td></tr>
    <tr><td>s</td><td>サ</td><td>シ</td><td>ス</td><td>セ</td><td>ソ</td></tr>
    <tr><td>t</td><td>タ</td><td>チ</td><td>ツ</td><td>テ</td><td>ト</td></tr>
  </tbody>
</table>
<div class="out"><b>Examples:</b> コーヒー = kōhī (coffee) · テレビ = terebi (TV) · ベトナム = Betonamu (Vietnam). Long vowels use a dash ー.</div>
<div class="pitfall"><b>Easy mix-ups:</b> シ (shi) vs ツ (tsu), and ン (n) vs ソ (so) — the stroke direction differs. Write them by hand to feel the difference.</div>
<a class="link-card codelab" href="/language/ja/alphabet?ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">✍️</span>
  <span class="lc-body"><span class="lc-title">Practise katakana</span><span class="lc-sub">Stroke order &amp; spaced repetition on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Katakana — kana "cứng"</h2>
<p class="lead">Katakana biểu diễn <em>cùng</em> các âm với hiragana, nhưng hình dạng khác, góc cạnh hơn. Nó dùng cho từ mượn nước ngoài, tên nước ngoài, tên thương hiệu và từ tượng thanh. Tên bạn sẽ viết bằng katakana.</p>
<table>
  <thead><tr><th></th><th>a</th><th>i</th><th>u</th><th>e</th><th>o</th></tr></thead>
  <tbody>
    <tr><td>—</td><td>ア</td><td>イ</td><td>ウ</td><td>エ</td><td>オ</td></tr>
    <tr><td>k</td><td>カ</td><td>キ</td><td>ク</td><td>ケ</td><td>コ</td></tr>
    <tr><td>s</td><td>サ</td><td>シ</td><td>ス</td><td>セ</td><td>ソ</td></tr>
    <tr><td>t</td><td>タ</td><td>チ</td><td>ツ</td><td>テ</td><td>ト</td></tr>
  </tbody>
</table>
<div class="out"><b>Ví dụ:</b> コーヒー = kōhī (cà phê) · テレビ = terebi (TV) · ベトナム = Betonamu (Việt Nam). Trường âm dùng gạch ー.</div>
<div class="pitfall"><b>Dễ nhầm:</b> シ (shi) vs ツ (tsu), và ン (n) vs ソ (so) — hướng nét khác nhau. Viết tay để cảm nhận khác biệt.</div>
<a class="link-card codelab" href="/language/ja/alphabet?ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">✍️</span>
  <span class="lc-body"><span class="lc-title">Luyện katakana</span><span class="lc-sub">Thứ tự nét &amp; lặp lại ngắt quãng trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
        {
          title: 'Quiz 1 — Kana|||Quiz 1 — Kana',
          slug: 'jpd113-quiz-1',
          type: 'QUIZ',
          description: 'Kiểm tra hiragana và katakana.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'Which kana is read "ka"?|||Chữ kana nào đọc là "ka"?', options: ['さ', 'か', 'た', 'な'], correctIndex: 1, points: 1 },
              { question: 'Katakana is mainly used for…|||Katakana chủ yếu dùng cho…', options: ['native Japanese grammar words|||từ ngữ pháp thuần Nhật', 'foreign loanwords and names|||từ mượn và tên nước ngoài', 'kanji readings|||cách đọc kanji', 'numbers only|||chỉ số đếm'], correctIndex: 1, points: 1 },
              { question: 'The dakuten mark (゛) changes か into…|||Dấu dakuten (゛) biến か thành…', options: ['が (ga)', 'ぱ (pa)', 'きゃ (kya)', 'こ (ko)'], correctIndex: 0, points: 1 },
              { question: 'A small っ (sokuon) means…|||Một っ nhỏ (sokuon) nghĩa là…', options: ['a long vowel|||một trường âm', 'double the next consonant|||gấp đôi phụ âm kế', 'a question|||một câu hỏi', 'silence|||im lặng'], correctIndex: 1, points: 1 },
              { question: 'し is read…|||し đọc là…', options: ['si', 'shi', 'chi', 'hi'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 3 — CHÀO HỎI & SỐ ĐẾM ══════════════════ */
    {
      title: 'Chapter 3 — Greetings, classroom & numbers|||Chương 3 — Chào hỏi, câu trong lớp & số đếm',
      description: 'Câu chào hằng ngày, câu dùng trong lớp học, và cách đếm số.',
      lessons: [
        {
          title: '3.1 — Everyday greetings & numbers|||3.1 — Chào hỏi hằng ngày & số đếm',
          slug: 'jpd113-chao-hoi-so',
          type: 'VIDEO',
          description: 'あいさつ (chào hỏi) theo thời điểm trong ngày, câu lớp học, và số 1–10.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Greetings, classroom phrases &amp; numbers</h2>
<p class="lead">Your first usable Japanese. Greetings (あいさつ) change with the time of day and the situation — learn them as fixed phrases and use them from day one.</p>
<table>
  <thead><tr><th>Japanese</th><th>Reading</th><th>Meaning</th></tr></thead>
  <tbody>
    <tr><td>おはようございます</td><td>ohayō gozaimasu</td><td>Good morning</td></tr>
    <tr><td>こんにちは</td><td>konnichiwa</td><td>Hello / Good afternoon</td></tr>
    <tr><td>こんばんは</td><td>konbanwa</td><td>Good evening</td></tr>
    <tr><td>ありがとうございます</td><td>arigatō gozaimasu</td><td>Thank you</td></tr>
    <tr><td>すみません</td><td>sumimasen</td><td>Excuse me / Sorry</td></tr>
    <tr><td>はじめまして</td><td>hajimemashite</td><td>Nice to meet you</td></tr>
  </tbody>
</table>
<h3>Numbers 1–10</h3>
<div class="diagram">1 いち · 2 に · 3 さん · 4 し/よん · 5 ご · 6 ろく · 7 しち/なな · 8 はち · 9 きゅう · 10 じゅう</div>
<div class="note-ct">Numbers 4, 7 and 9 have two readings — pick the right one by context (yon and nana are common in counting). Numbers combine simply: 11 = じゅういち (10+1), 20 = にじゅう (2×10).</div>
<a class="link-card codelab" href="/language/ja/vocab?ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">Drill greetings &amp; numbers</span><span class="lc-sub">Vocabulary SRS on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Chào hỏi, câu trong lớp &amp; số đếm</h2>
<p class="lead">Tiếng Nhật dùng được đầu tiên của bạn. Chào hỏi (あいさつ) đổi theo thời điểm trong ngày và tình huống — học như câu cố định và dùng ngay từ ngày đầu.</p>
<table>
  <thead><tr><th>Tiếng Nhật</th><th>Cách đọc</th><th>Nghĩa</th></tr></thead>
  <tbody>
    <tr><td>おはようございます</td><td>ohayō gozaimasu</td><td>Chào buổi sáng</td></tr>
    <tr><td>こんにちは</td><td>konnichiwa</td><td>Xin chào / Chào buổi trưa</td></tr>
    <tr><td>こんばんは</td><td>konbanwa</td><td>Chào buổi tối</td></tr>
    <tr><td>ありがとうございます</td><td>arigatō gozaimasu</td><td>Cảm ơn</td></tr>
    <tr><td>すみません</td><td>sumimasen</td><td>Xin lỗi / Làm ơn</td></tr>
    <tr><td>はじめまして</td><td>hajimemashite</td><td>Rất vui được gặp</td></tr>
  </tbody>
</table>
<h3>Số 1–10</h3>
<div class="diagram">1 いち · 2 に · 3 さん · 4 し/よん · 5 ご · 6 ろく · 7 しち/なな · 8 はち · 9 きゅう · 10 じゅう</div>
<div class="note-ct">Số 4, 7 và 9 có hai cách đọc — chọn đúng theo ngữ cảnh (yon và nana hay dùng khi đếm). Số ghép đơn giản: 11 = じゅういち (10+1), 20 = にじゅう (2×10).</div>
<a class="link-card codelab" href="/language/ja/vocab?ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">Luyện chào hỏi &amp; số đếm</span><span class="lc-sub">Từ vựng SRS trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 4 — BÀI 1: TỰ GIỚI THIỆU ══════════════════ */
    {
      title: 'Chapter 4 — Lesson 1: Self-introduction|||Chương 4 — Bài 1: Tự giới thiệu',
      description: 'Mẫu câu cốt lõi: は (chủ đề), です (là), の (sở hữu) — đủ để giới thiệu bản thân.',
      lessons: [
        {
          title: '4.1 — は, です & の|||4.1 — は, です & の',
          slug: 'jpd113-bai-1-ngu-phap',
          type: 'VIDEO',
          description: 'Trợ từ chủ đề は, đuôi lịch sự です, trợ từ sở hữu の — ba viên gạch đầu tiên.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Self-introduction — は, です &amp; の</h2>
<p class="lead">With three little words you can already introduce yourself. Japanese marks the <strong>topic</strong> with は and ends polite statements with <strong>です</strong>. Word order is Subject–Object–Verb, so the verb (です) comes last.</p>
<pre>わたし は アン です。
watashi wa An desu.
= I am An.  (topic: I / "am")</pre>
<div class="lz-stack">
  <div class="lz-layer"><b>は (wa)</b> — the topic particle. Written は but pronounced "wa". Marks what the sentence is about.</div>
  <div class="lz-layer"><b>です (desu)</b> — the polite "am / is / are". Always at the end.</div>
  <div class="lz-layer"><b>の (no)</b> — possession/connection: わたし<b>の</b>なまえ = my name; ベトナム<b>の</b>がくせい = a student from Vietnam.</div>
</div>
<div class="out"><b>Full self-intro:</b> はじめまして。わたしはアンです。ベトナムのがくせいです。どうぞよろしく。<br>= Nice to meet you. I am An. I am a student from Vietnam. Pleased to meet you.</div>
<div class="pitfall"><b>Trap:</b> the topic particle は is always written with the hiragana は but read "wa", never "ha", in this role. Same for へ (read "e") as a direction particle.</div>
<a class="link-card codelab" href="/language/ja/grammar?ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Study grammar patterns</span><span class="lc-sub">は/です/の with examples on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Tự giới thiệu — は, です &amp; の</h2>
<p class="lead">Với ba từ nhỏ bạn đã có thể tự giới thiệu. Tiếng Nhật đánh dấu <strong>chủ đề</strong> bằng は và kết thúc câu lịch sự bằng <strong>です</strong>. Trật tự là Chủ–Tân–Động, nên động từ (です) đứng cuối.</p>
<pre>わたし は アン です。
watashi wa An desu.
= Tôi là An.  (chủ đề: tôi / "là")</pre>
<div class="lz-stack">
  <div class="lz-layer"><b>は (wa)</b> — trợ từ chủ đề. Viết là は nhưng đọc "wa". Đánh dấu câu nói về cái gì.</div>
  <div class="lz-layer"><b>です (desu)</b> — "là / thì" lịch sự. Luôn ở cuối câu.</div>
  <div class="lz-layer"><b>の (no)</b> — sở hữu/liên kết: わたし<b>の</b>なまえ = tên của tôi; ベトナム<b>の</b>がくせい = sinh viên đến từ Việt Nam.</div>
</div>
<div class="out"><b>Câu tự giới thiệu đầy đủ:</b> はじめまして。わたしはアンです。ベトナムのがくせいです。どうぞよろしく。<br>= Rất vui được gặp. Tôi là An. Tôi là sinh viên đến từ Việt Nam. Mong được giúp đỡ.</div>
<div class="pitfall"><b>Bẫy:</b> trợ từ chủ đề は luôn viết bằng hiragana は nhưng đọc "wa", không bao giờ "ha", trong vai trò này. Tương tự へ (đọc "e") khi làm trợ từ chỉ hướng.</div>
<a class="link-card codelab" href="/language/ja/grammar?ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Học mẫu ngữ pháp</span><span class="lc-sub">は/です/の kèm ví dụ trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 5 — BÀI 2-3: NÀY/KIA & NƠI CHỐN ══════════════════ */
    {
      title: 'Chapter 5 — Lessons 2-3: this/that & places|||Chương 5 — Bài 2-3: cái này/kia & nơi chốn',
      description: 'これ/それ/あれ (chỉ định) và あります/います (tồn tại) — mô tả đồ vật và vị trí.',
      lessons: [
        {
          title: '5.1 — これ/それ/あれ & あります/います|||5.1 — これ/それ/あれ & あります/います',
          slug: 'jpd113-bai-2-3-ngu-phap',
          type: 'VIDEO',
          description: 'Bộ chỉ định theo khoảng cách (こ/そ/あ), và hai động từ tồn tại cho vật vô tri vs hữu sinh.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Pointing &amp; existence</h2>
<p class="lead">Two everyday patterns: how to say "this/that", and how to say something "exists / is here". Both are built on tidy, regular systems.</p>
<h3>The こ・そ・あ system</h3>
<table>
  <thead><tr><th>Near me</th><th>Near you</th><th>Far from both</th><th>Which?</th></tr></thead>
  <tbody>
    <tr><td>これ kore (this)</td><td>それ sore (that)</td><td>あれ are (that over there)</td><td>どれ dore (which)</td></tr>
    <tr><td>ここ koko (here)</td><td>そこ soko (there)</td><td>あそこ asoko (over there)</td><td>どこ doko (where)</td></tr>
  </tbody>
</table>
<h3>あります vs います</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>あります</b> — something <em>exists</em> for inanimate things: 本があります (there is a book).</div>
  <div class="lz-layer"><b>います</b> — for living things (people, animals): 猫がいます (there is a cat).</div>
</div>
<div class="out"><b>Example:</b> これはなんですか。— それはほんです。("What is this?" — "That is a book.")</div>
<div class="pitfall"><b>Trap:</b> choose あります/います by whether the thing is <em>alive</em>, not by size. A person or animal → います; a book, car, building → あります.</div>
<a class="link-card codelab" href="/language/ja/practice?ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">🎯</span>
  <span class="lc-body"><span class="lc-title">Practice these patterns</span><span class="lc-sub">Interactive drills on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Chỉ định &amp; tồn tại</h2>
<p class="lead">Hai mẫu hằng ngày: cách nói "cái này/cái kia", và cách nói cái gì đó "tồn tại / có ở đây". Cả hai xây trên hệ thống gọn gàng, đều đặn.</p>
<h3>Hệ こ・そ・あ</h3>
<table>
  <thead><tr><th>Gần tôi</th><th>Gần bạn</th><th>Xa cả hai</th><th>Cái nào?</th></tr></thead>
  <tbody>
    <tr><td>これ kore (cái này)</td><td>それ sore (cái đó)</td><td>あれ are (cái kia)</td><td>どれ dore (cái nào)</td></tr>
    <tr><td>ここ koko (ở đây)</td><td>そこ soko (ở đó)</td><td>あそこ asoko (đằng kia)</td><td>どこ doko (ở đâu)</td></tr>
  </tbody>
</table>
<h3>あります vs います</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>あります</b> — vật <em>tồn tại</em>, dùng cho đồ vật vô tri: 本があります (có một quyển sách).</div>
  <div class="lz-layer"><b>います</b> — cho vật hữu sinh (người, động vật): 猫がいます (có một con mèo).</div>
</div>
<div class="out"><b>Ví dụ:</b> これはなんですか。— それはほんです。("Cái này là gì?" — "Đó là quyển sách.")</div>
<div class="pitfall"><b>Bẫy:</b> chọn あります/います theo việc vật đó có <em>sống</em> hay không, không theo kích thước. Người hay động vật → います; sách, xe, tòa nhà → あります.</div>
<a class="link-card codelab" href="/language/ja/practice?ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">🎯</span>
  <span class="lc-body"><span class="lc-title">Luyện các mẫu này</span><span class="lc-sub">Bài tập tương tác trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 6 — KANJI & ĐỌC ══════════════════ */
    {
      title: 'Chapter 6 — Kanji & short reading|||Chương 6 — Kanji & đọc đoạn ngắn',
      description: '35 chữ Hán cơ bản (âm on/kun, bộ thủ) và đọc đoạn văn sơ cấp.',
      lessons: [
        {
          title: '6.1 — Your first kanji|||6.1 — Những chữ Hán đầu tiên',
          slug: 'jpd113-kanji',
          type: 'VIDEO',
          description: 'Kanji là gì, âm on/kun, số nét & bộ thủ; 35 chữ đầu (số, người, ngày…).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Your first kanji</h2>
<p class="lead">Kanji are characters borrowed from Chinese, each carrying meaning. A1.1 introduces about 35 of the most common. Unlike kana, a kanji can have several readings: an <em>on</em> reading (from Chinese) and a <em>kun</em> reading (native Japanese).</p>
<table>
  <thead><tr><th>Kanji</th><th>Meaning</th><th>Readings</th></tr></thead>
  <tbody>
    <tr><td>一 二 三</td><td>one, two, three</td><td>ichi, ni, san</td></tr>
    <tr><td>人</td><td>person</td><td>hito / jin, nin</td></tr>
    <tr><td>日</td><td>day, sun</td><td>hi / nichi</td></tr>
    <tr><td>本</td><td>book, origin</td><td>hon / moto</td></tr>
    <tr><td>学</td><td>study</td><td>gaku</td></tr>
  </tbody>
</table>
<div class="note-ct">日本 = Nihon (Japan): 日 (sun) + 本 (origin) = "origin of the sun". Kanji combine to build words — learning the pieces makes new words readable.</div>
<div class="pitfall"><b>Tip:</b> always learn a kanji <em>with a word</em>, not in isolation — 学 alone is abstract, but 学生 (gakusei, student) and 大学 (daigaku, university) make it stick. Write with correct stroke order.</div>
<a class="link-card codelab" href="/language/ja/hanzi?ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">🖌️</span>
  <span class="lc-body"><span class="lc-title">Practise kanji writing</span><span class="lc-sub">Animated stroke order &amp; SRS on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Những chữ Hán đầu tiên</h2>
<p class="lead">Kanji là các chữ mượn từ tiếng Trung, mỗi chữ mang một ý nghĩa. A1.1 giới thiệu khoảng 35 chữ phổ biến nhất. Khác kana, một kanji có thể có nhiều cách đọc: âm <em>on</em> (từ tiếng Hán) và âm <em>kun</em> (thuần Nhật).</p>
<table>
  <thead><tr><th>Kanji</th><th>Nghĩa</th><th>Cách đọc</th></tr></thead>
  <tbody>
    <tr><td>一 二 三</td><td>một, hai, ba</td><td>ichi, ni, san</td></tr>
    <tr><td>人</td><td>người</td><td>hito / jin, nin</td></tr>
    <tr><td>日</td><td>ngày, mặt trời</td><td>hi / nichi</td></tr>
    <tr><td>本</td><td>sách, gốc</td><td>hon / moto</td></tr>
    <tr><td>学</td><td>học</td><td>gaku</td></tr>
  </tbody>
</table>
<div class="note-ct">日本 = Nihon (Nhật Bản): 日 (mặt trời) + 本 (gốc) = "gốc của mặt trời". Kanji ghép lại để tạo từ — học các mảnh làm từ mới đọc được.</div>
<div class="pitfall"><b>Mẹo:</b> luôn học một kanji <em>kèm một từ</em>, không học lẻ — 学 đứng một mình thì trừu tượng, nhưng 学生 (gakusei, sinh viên) và 大学 (daigaku, đại học) làm nó khắc sâu. Viết theo đúng thứ tự nét.</div>
<a class="link-card codelab" href="/language/ja/hanzi?ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
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
      title: 'Advanced — Beyond A1.1|||Nâng cao — Vượt A1.1',
      description: 'Phương pháp học bền vững và lộ trình tiếp theo tới JLPT N5.',
      lessons: [
        {
          title: 'A.1 — Study method & the JLPT N5 path|||A.1 — Phương pháp học & lộ trình JLPT N5',
          slug: 'jpd113-nang-cao',
          type: 'VIDEO',
          description: 'Cách duy trì đà học tiếng Nhật, và mục tiêu tiếp theo: kỳ thi JLPT N5.',
          content: `
<div class="ml-en">
<span class="eyebrow">Advanced · Lesson A.1</span>
<h2>Keeping the momentum — toward JLPT N5</h2>
<p class="lead">A1.1 is the foundation. What separates people who reach fluency from those who quit is a sustainable daily habit. Here is how to keep going after this course.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Daily SRS.</b> 10–15 minutes of spaced repetition every day beats marathon sessions. Never skip two days in a row.</div>
  <div class="lz-layer"><b>Input beyond textbooks.</b> Simple graded readers, children's anime with Japanese subtitles, songs — real language cements what you study.</div>
  <div class="lz-layer"><b>Output early.</b> Write a daily diary sentence, record yourself introducing yourself, talk to a language partner.</div>
  <div class="lz-layer"><b>Aim at JLPT N5.</b> The Japanese-Language Proficiency Test N5 is the natural next milestone — roughly 800 words, 100 kanji, basic grammar. This course is the first third of the road there.</div>
</div>
<div class="note-ct">Consistency beats intensity in language learning. If you keep a small daily habit after JPD113, N5 and real conversation are genuinely within reach within a year.</div>
<a class="link-card codelab" href="/language/ja/roadmap?ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">🗺️</span>
  <span class="lc-body"><span class="lc-title">Follow the Japanese roadmap</span><span class="lc-sub">Structured path from A1 onward on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Nâng cao · Bài A.1</span>
<h2>Giữ đà tiến — hướng tới JLPT N5</h2>
<p class="lead">A1.1 là nền móng. Điều tách người đạt trôi chảy khỏi người bỏ cuộc là một thói quen hằng ngày bền vững. Đây là cách tiếp tục sau môn này.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>SRS mỗi ngày.</b> 10–15 phút lặp lại ngắt quãng mỗi ngày hơn các buổi marathon. Đừng bao giờ bỏ hai ngày liên tiếp.</div>
  <div class="lz-layer"><b>Đầu vào ngoài giáo trình.</b> Truyện phân cấp đơn giản, anime thiếu nhi có phụ đề tiếng Nhật, bài hát — ngôn ngữ thật khắc sâu điều bạn học.</div>
  <div class="lz-layer"><b>Đầu ra sớm.</b> Viết một câu nhật ký mỗi ngày, tự thu âm giới thiệu bản thân, nói với bạn học ngôn ngữ.</div>
  <div class="lz-layer"><b>Nhắm tới JLPT N5.</b> Kỳ thi năng lực tiếng Nhật N5 là cột mốc tiếp theo tự nhiên — khoảng 800 từ, 100 kanji, ngữ pháp cơ bản. Môn này là một phần ba đầu của con đường tới đó.</div>
</div>
<div class="note-ct">Đều đặn thắng cường độ trong học ngôn ngữ. Nếu bạn giữ một thói quen nhỏ hằng ngày sau JPD113, N5 và giao tiếp thật thực sự trong tầm với trong vòng một năm.</div>
<a class="link-card codelab" href="/language/ja/roadmap?ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">🗺️</span>
  <span class="lc-body"><span class="lc-title">Theo lộ trình tiếng Nhật</span><span class="lc-sub">Con đường có cấu trúc từ A1 trở đi trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
        {
          title: 'Quiz 2 — Grammar, kanji & study|||Quiz 2 — Ngữ pháp, kanji & cách học',
          slug: 'jpd113-quiz-2',
          type: 'QUIZ',
          description: 'Kiểm tra ngữ pháp Bài 1-3 và kanji.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'The topic particle は is pronounced…|||Trợ từ chủ đề は được đọc là…', options: ['ha', 'wa', 'ba', 'pa'], correctIndex: 1, points: 1 },
              { question: 'In "わたしのなまえ", の shows…|||Trong "わたしのなまえ", の thể hiện…', options: ['a question|||một câu hỏi', 'possession (my name)|||sở hữu (tên của tôi)', 'past tense|||thì quá khứ', 'negation|||phủ định'], correctIndex: 1, points: 1 },
              { question: 'For a living thing (a cat), "there is" uses…|||Với vật hữu sinh (một con mèo), "có" dùng…', options: ['あります', 'います', 'です', 'これ'], correctIndex: 1, points: 1 },
              { question: 'これ means…|||これ nghĩa là…', options: ['that over there|||cái kia đằng xa', 'this (near me)|||cái này (gần tôi)', 'where|||ở đâu', 'which|||cái nào'], correctIndex: 1, points: 1 },
              { question: 'A kanji typically has…|||Một kanji thường có…', options: ['exactly one reading|||đúng một cách đọc', 'multiple readings (on and kun)|||nhiều cách đọc (on và kun)', 'no meaning|||không nghĩa', 'only a katakana form|||chỉ dạng katakana'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* END-SECTIONS-MARKER */
  ],
};
