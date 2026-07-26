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

    /* ══════════════════ CHƯƠNG 3 — CHÀO HỎI, SỐ, TIỀN, NGÀY GIỜ ══════════════════ */
    {
      title: 'Chapter 3 — Greetings, numbers, money & dates|||Chương 3 — Chào hỏi, số, tiền & ngày giờ',
      description: 'Câu chào & câu lớp học, hệ số đếm đầy đủ, tiền/giá cả, và ngày–giờ–tuổi kèm cách hỏi đáp.',
      lessons: [
        {
          title: '3.1 — Greetings & classroom phrases|||3.1 — Chào hỏi & câu trong lớp',
          slug: 'jpd113-chao-hoi-so',
          type: 'VIDEO',
          description: 'あいさつ theo thời điểm trong ngày và các câu dùng trong lớp học.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Greetings &amp; classroom phrases</h2>
<p class="lead">Your first usable Japanese. Greetings (あいさつ) change with the time of day — learn them as fixed phrases and use them from day one.</p>
<table>
  <thead><tr><th>Japanese</th><th>Reading</th><th>Meaning</th></tr></thead>
  <tbody>
    <tr><td>おはようございます</td><td>ohayō gozaimasu</td><td>Good morning</td></tr>
    <tr><td>こんにちは</td><td>konnichiwa</td><td>Hello / Good afternoon</td></tr>
    <tr><td>こんばんは</td><td>konbanwa</td><td>Good evening</td></tr>
    <tr><td>さようなら</td><td>sayōnara</td><td>Goodbye</td></tr>
    <tr><td>ありがとうございます</td><td>arigatō gozaimasu</td><td>Thank you</td></tr>
    <tr><td>すみません</td><td>sumimasen</td><td>Excuse me / Sorry</td></tr>
    <tr><td>はじめまして</td><td>hajimemashite</td><td>Nice to meet you</td></tr>
    <tr><td>どうぞよろしく</td><td>dōzo yoroshiku</td><td>Pleased to meet you</td></tr>
  </tbody>
</table>
<h3>Classroom phrases (教室のことば)</h3>
<table>
  <thead><tr><th>Japanese</th><th>Meaning</th></tr></thead>
  <tbody>
    <tr><td>わかりました / わかりません</td><td>I understand / I don't understand</td></tr>
    <tr><td>もう一度おねがいします</td><td>Once more, please</td></tr>
    <tr><td>ちょっとまってください</td><td>Please wait a moment</td></tr>
    <tr><td>しつもんがあります</td><td>I have a question</td></tr>
  </tbody>
</table>
<a class="link-card codelab" href="/language/ja/vocab?ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">Drill greetings</span><span class="lc-sub">Vocabulary SRS on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Chào hỏi &amp; câu trong lớp</h2>
<p class="lead">Tiếng Nhật dùng được đầu tiên. Chào hỏi (あいさつ) đổi theo thời điểm trong ngày — học như câu cố định và dùng ngay từ ngày đầu.</p>
<table>
  <thead><tr><th>Tiếng Nhật</th><th>Cách đọc</th><th>Nghĩa</th></tr></thead>
  <tbody>
    <tr><td>おはようございます</td><td>ohayō gozaimasu</td><td>Chào buổi sáng</td></tr>
    <tr><td>こんにちは</td><td>konnichiwa</td><td>Xin chào / Chào buổi trưa</td></tr>
    <tr><td>こんばんは</td><td>konbanwa</td><td>Chào buổi tối</td></tr>
    <tr><td>さようなら</td><td>sayōnara</td><td>Tạm biệt</td></tr>
    <tr><td>ありがとうございます</td><td>arigatō gozaimasu</td><td>Cảm ơn</td></tr>
    <tr><td>すみません</td><td>sumimasen</td><td>Xin lỗi / Làm ơn</td></tr>
    <tr><td>はじめまして</td><td>hajimemashite</td><td>Rất vui được gặp</td></tr>
    <tr><td>どうぞよろしく</td><td>dōzo yoroshiku</td><td>Mong được giúp đỡ</td></tr>
  </tbody>
</table>
<h3>Câu trong lớp học (教室のことば)</h3>
<table>
  <thead><tr><th>Tiếng Nhật</th><th>Nghĩa</th></tr></thead>
  <tbody>
    <tr><td>わかりました / わかりません</td><td>Em hiểu rồi / Em không hiểu</td></tr>
    <tr><td>もう一度おねがいします</td><td>Xin nhắc lại một lần nữa</td></tr>
    <tr><td>ちょっとまってください</td><td>Xin đợi một chút</td></tr>
    <tr><td>しつもんがあります</td><td>Em có một câu hỏi</td></tr>
  </tbody>
</table>
<a class="link-card codelab" href="/language/ja/vocab?ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">Luyện chào hỏi</span><span class="lc-sub">Từ vựng SRS trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
        {
          title: '3.2 — The full number system (1 → 100,000,000)|||3.2 — Hệ số đếm đầy đủ (1 → 100 triệu)',
          slug: 'jpd113-so-dem-day-du',
          type: 'VIDEO',
          description: 'Số 1-10, hàng chục/trăm/nghìn/vạn, các biến âm quan trọng, và cách đọc một số lớn bất kỳ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Counting in Japanese — the whole system</h2>
<p class="lead">Japanese numbers are wonderfully regular: learn 1–10 and the "place words" (ten, hundred, thousand…) and you can build <em>any</em> number. But a few sound-changes (rendaku) trip up beginners, so learn them explicitly.</p>

<h3>1 – 10 (the base)</h3>
<table>
  <thead><tr><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th></tr></thead>
  <tbody>
    <tr><td>いち</td><td>に</td><td>さん</td><td>し/よん</td><td>ご</td><td>ろく</td><td>しち/なな</td><td>はち</td><td>きゅう/く</td><td>じゅう</td></tr>
  </tbody>
</table>

<h3>Tens (10s), then teens &amp; beyond — just combine</h3>
<div class="out"><b>Rule:</b> [digit] + じゅう(10). 20 = に+じゅう = にじゅう. 34 = さんじゅう + よん = さんじゅうよん. 99 = きゅうじゅうきゅう.<br>
Teens: 11 = じゅういち (10+1), 15 = じゅうご, 18 = じゅうはち.</div>

<h3>Place words — 100, 1,000, 10,000</h3>
<table>
  <thead><tr><th>Place</th><th>Word</th><th>Note</th></tr></thead>
  <tbody>
    <tr><td>100 (hundred)</td><td>ひゃく (hyaku)</td><td>百</td></tr>
    <tr><td>1,000 (thousand)</td><td>せん (sen)</td><td>千</td></tr>
    <tr><td>10,000 (ten-thousand)</td><td>まん (man)</td><td>万 — Japanese groups by 10,000!</td></tr>
    <tr><td>100,000,000</td><td>おく (oku)</td><td>億 (hundred million)</td></tr>
  </tbody>
</table>

<h3>The sound-changes you MUST memorise (rendaku)</h3>
<div class="out"><b>Hundreds:</b> 300 = さん<b>び</b>ゃく (not さんひゃく) · 600 = ろ<b>っぴ</b>ゃく · 800 = は<b>っぴ</b>ゃく.<br>
<b>Thousands:</b> 3,000 = さん<b>ぜ</b>ん (not さんせん) · 8,000 = は<b>っせ</b>ん.<br>
Others are regular: 400 = よんひゃく, 500 = ごひゃく, 2,000 = にせん, 5,000 = ごせん.</div>

<h3>Ví dụ có lời giải · Read a big number step by step</h3>
<div class="out"><b>Read 25,300.</b> Japanese groups by 万 (10,000): 25,300 = 2万 + 5,300.<br>
2万 = にまん · 5,300 = ごせん さんびゃく (5,000 + 300, with 300 = さんびゃく).<br>
→ <b>にまん ごせん さんびゃく</b> (ni-man go-sen san-byaku).<br><br>
<b>Read 1,000,000 (one million).</b> In Japanese that is 100 万 → <b>ひゃくまん</b> (hyaku-man). A million is "hundred ten-thousands" — this 万-grouping is the #1 thing Vietnamese learners must rewire.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Why Japanese "breaks" every 4 digits, not 3.</b> Western numbers group by thousands (1,000 / 1,000,000). Japanese groups by <b>万 (10,000)</b>: 一万 (10⁴), 一億 (10⁸), 一兆 (10¹²). So 100万 = 1 million and 1億 = 100 million. When converting prices or populations, mentally re-comma the number every 4 digits from the right — do this and large numbers stop being scary.</div>
<a class="link-card codelab" href="/language/ja/vocab?ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">🔢</span>
  <span class="lc-body"><span class="lc-title">Drill numbers</span><span class="lc-sub">Vocabulary SRS on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Đếm số trong tiếng Nhật — cả hệ thống</h2>
<p class="lead">Số tiếng Nhật đều đặn tuyệt vời: học 1–10 và các "từ hàng" (chục, trăm, nghìn…) là bạn dựng được <em>bất kỳ</em> số nào. Nhưng vài biến âm (rendaku) hay làm người mới vấp, nên học thẳng chúng.</p>

<h3>1 – 10 (nền tảng)</h3>
<table>
  <thead><tr><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th></tr></thead>
  <tbody>
    <tr><td>いち</td><td>に</td><td>さん</td><td>し/よん</td><td>ご</td><td>ろく</td><td>しち/なな</td><td>はち</td><td>きゅう/く</td><td>じゅう</td></tr>
  </tbody>
</table>

<h3>Hàng chục, rồi 11-19 và hơn — chỉ việc ghép</h3>
<div class="out"><b>Quy tắc:</b> [chữ số] + じゅう(10). 20 = に+じゅう = にじゅう. 34 = さんじゅう + よん = さんじゅうよん. 99 = きゅうじゅうきゅう.<br>
Số 11-19: 11 = じゅういち (10+1), 15 = じゅうご, 18 = じゅうはち.</div>

<h3>Từ hàng — 100, 1.000, 10.000</h3>
<table>
  <thead><tr><th>Hàng</th><th>Từ</th><th>Ghi chú</th></tr></thead>
  <tbody>
    <tr><td>100 (trăm)</td><td>ひゃく (hyaku)</td><td>百</td></tr>
    <tr><td>1.000 (nghìn)</td><td>せん (sen)</td><td>千</td></tr>
    <tr><td>10.000 (vạn)</td><td>まん (man)</td><td>万 — tiếng Nhật nhóm theo 10.000!</td></tr>
    <tr><td>100.000.000</td><td>おく (oku)</td><td>億 (trăm triệu)</td></tr>
  </tbody>
</table>

<h3>Các biến âm PHẢI thuộc (rendaku)</h3>
<div class="out"><b>Hàng trăm:</b> 300 = さん<b>び</b>ゃく (không phải さんひゃく) · 600 = ろ<b>っぴ</b>ゃく · 800 = は<b>っぴ</b>ゃく.<br>
<b>Hàng nghìn:</b> 3.000 = さん<b>ぜ</b>ん (không phải さんせん) · 8.000 = は<b>っせ</b>ん.<br>
Còn lại đều: 400 = よんひゃく, 500 = ごひゃく, 2.000 = にせん, 5.000 = ごせん.</div>

<h3>Ví dụ có lời giải · Đọc một số lớn từng bước</h3>
<div class="out"><b>Đọc 25.300.</b> Tiếng Nhật nhóm theo 万 (10.000): 25.300 = 2万 + 5.300.<br>
2万 = にまん · 5.300 = ごせん さんびゃく (5.000 + 300, với 300 = さんびゃく).<br>
→ <b>にまん ごせん さんびゃく</b> (ni-man go-sen san-byaku).<br><br>
<b>Đọc 1.000.000 (một triệu).</b> Trong tiếng Nhật đó là 100 万 → <b>ひゃくまん</b> (hyaku-man). Một triệu là "trăm vạn" — cách nhóm theo 万 này là điều số 1 người Việt phải "lập trình lại" trong đầu.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Vì sao tiếng Nhật "ngắt" mỗi 4 chữ số, không phải 3.</b> Số phương Tây nhóm theo nghìn (1,000 / 1,000,000). Tiếng Nhật nhóm theo <b>万 (10.000)</b>: 一万 (10⁴), 一億 (10⁸), 一兆 (10¹²). Nên 100万 = 1 triệu và 1億 = 100 triệu. Khi đổi giá tiền hay dân số, hãy nhẩm đặt lại dấu phẩy mỗi 4 chữ số từ phải sang — làm vậy thì số lớn thôi đáng sợ.</div>
<a class="link-card codelab" href="/language/ja/vocab?ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">🔢</span>
  <span class="lc-body"><span class="lc-title">Luyện số đếm</span><span class="lc-sub">Từ vựng SRS trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
        {
          title: '3.3 — Money & prices (いくらですか)|||3.3 — Tiền & giá cả (いくらですか)',
          slug: 'jpd113-tien-gia-ca',
          type: 'VIDEO',
          description: 'Đồng yên 円, đọc giá tiền, hỏi giá bằng いくらですか và trả lời — hội thoại mua sắm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>Money — asking and saying prices</h2>
<p class="lead">Now put those numbers to work. Japanese currency is the <strong>yen</strong>, written 円 and read <strong>えん (en)</strong>. Prices are just a number + 円.</p>

<h3>Reading prices</h3>
<div class="out">50円 = ごじゅうえん · 100円 = ひゃくえん · 500円 = ごひゃくえん · 1,000円 = せんえん · 3,800円 = さんぜんはっぴゃくえん · 10,000円 = いちまんえん.<br>
(Note the rendaku from Lesson 3.2 carries over: 3,800 → さんぜん はっぴゃく.)</div>

<h3>The shopping question &amp; answer</h3>
<div class="out"><b>Q:</b> これは いくらですか。 = How much is this?  (いくら = how much)<br>
<b>A:</b> 350円です。 = It's 350 yen.  (さんびゃく ごじゅう えん です)<br><br>
<b>Q:</b> ぜんぶで いくらですか。 = How much altogether?<br>
<b>A:</b> ぜんぶで 1,200円です。 = 1,200 yen in total.</div>

<h3>Ví dụ có lời giải · A mini shopping dialogue</h3>
<div class="out">Customer: すみません、この本は いくらですか。 (Excuse me, how much is this book?)<br>
Clerk: 1,500円です。 (せんごひゃくえん です — 1,500 yen.)<br>
Customer: じゃあ、これを ください。 (Then, this one please.)<br>
Clerk: ありがとうございます。 (Thank you.)</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Yen ↔ đồng: a quick mental conversion.</b> 1 円 ≈ 170–180 đồng (rate varies). So a 500円 lunch ≈ 90,000 đồng; a 1万円 note ≈ 1.8 triệu đồng. Because Japanese counts in 万, a "1万円" (ichi-man-en) bill is the everyday large note — like the 500,000đ note. Getting a feel for these lets you actually shop, not just recite numbers.</div>
<a class="link-card codelab" href="/language/ja/roleplay?ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">🛒</span>
  <span class="lc-body"><span class="lc-title">Practise a shopping roleplay</span><span class="lc-sub">Ask prices &amp; buy things on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>Tiền — hỏi và nói giá</h2>
<p class="lead">Giờ cho các con số đó vào việc. Tiền Nhật là <strong>yên</strong>, viết 円 và đọc <strong>えん (en)</strong>. Giá tiền chỉ là một số + 円.</p>

<h3>Đọc giá tiền</h3>
<div class="out">50円 = ごじゅうえん · 100円 = ひゃくえん · 500円 = ごひゃくえん · 1.000円 = せんえん · 3.800円 = さんぜんはっぴゃくえん · 10.000円 = いちまんえん.<br>
(Biến âm ở Bài 3.2 áp dụng luôn: 3.800 → さんぜん はっぴゃく.)</div>

<h3>Câu hỏi &amp; trả lời khi mua sắm</h3>
<div class="out"><b>Hỏi:</b> これは いくらですか。 = Cái này bao nhiêu tiền?  (いくら = bao nhiêu)<br>
<b>Đáp:</b> 350円です。 = 350 yên.  (さんびゃく ごじゅう えん です)<br><br>
<b>Hỏi:</b> ぜんぶで いくらですか。 = Tất cả bao nhiêu?<br>
<b>Đáp:</b> ぜんぶで 1.200円です。 = Tổng cộng 1.200 yên.</div>

<h3>Ví dụ có lời giải · Hội thoại mua sắm nhỏ</h3>
<div class="out">Khách: すみません、この本は いくらですか。 (Xin lỗi, quyển sách này bao nhiêu tiền?)<br>
Nhân viên: 1.500円です。 (せんごひゃくえん です — 1.500 yên.)<br>
Khách: じゃあ、これを ください。 (Vậy, cho tôi cái này.)<br>
Nhân viên: ありがとうございます。 (Cảm ơn.)</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Yên ↔ đồng: quy đổi nhanh trong đầu.</b> 1 円 ≈ 170–180 đồng (tỷ giá thay đổi). Nên bữa trưa 500円 ≈ 90.000 đồng; tờ 1万円 ≈ 1,8 triệu đồng. Vì tiếng Nhật đếm theo 万, tờ "1万円" (ichi-man-en) là tờ tiền lớn hằng ngày — như tờ 500.000đ. Có cảm giác về các mức này giúp bạn thực sự mua sắm được, không chỉ đọc số.</div>
<a class="link-card codelab" href="/language/ja/roleplay?ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">🛒</span>
  <span class="lc-body"><span class="lc-title">Luyện roleplay mua sắm</span><span class="lc-sub">Hỏi giá &amp; mua đồ trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
        {
          title: '3.4 — Dates, time & age (with questions)|||3.4 — Ngày, giờ & tuổi (kèm cách hỏi)',
          slug: 'jpd113-ngay-gio-tuoi',
          type: 'VIDEO',
          description: 'Năm/tháng/ngày (kèm các cách đọc bất quy tắc), giờ, tuổi, năm sinh — và toàn bộ mẫu câu hỏi–đáp.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.4</span>
<h2>Telling dates, time &amp; age</h2>
<p class="lead">This is where numbers become truly useful: saying <em>when</em>. Japanese dates read big-to-small: <b>year → month → day</b>. Watch out — several readings are irregular and must be memorised.</p>

<h3>Year (年 = ねん) &amp; birth year</h3>
<div class="out">Just a number + 年: 2024年 = にせんにじゅうよ<b>ねん</b>. (Note: 4年 = よ<b>ね</b>ん, an irregular reading.)<br>
<b>Q:</b> 何年生まれですか。(なんねん うまれ ですか) = What year were you born?<br>
<b>A:</b> 2005年生まれです。= I was born in 2005.</div>

<h3>Months (月 = がつ) — 4, 7, 9 are irregular!</h3>
<table>
  <thead><tr><th>1月</th><th>2月</th><th>3月</th><th>4月</th><th>5月</th><th>6月</th><th>7月</th><th>8月</th><th>9月</th><th>10月</th><th>11月</th><th>12月</th></tr></thead>
  <tbody>
    <tr><td>いちがつ</td><td>にがつ</td><td>さんがつ</td><td><b>し</b>がつ</td><td>ごがつ</td><td>ろくがつ</td><td><b>しち</b>がつ</td><td>はちがつ</td><td><b>く</b>がつ</td><td>じゅうがつ</td><td>じゅういちがつ</td><td>じゅうにがつ</td></tr>
  </tbody>
</table>
<div class="note-ct"><b>Memorise:</b> 4月 = しがつ (not よんがつ), 7月 = しちがつ (not なながつ), 9月 = くがつ (not きゅうがつ). These three are always irregular.</div>

<h3>Days of the month (日 = にち) — days 1–10 are special</h3>
<div class="out">1日 = <b>ついたち</b> · 2日 = <b>ふつか</b> · 3日 = <b>みっか</b> · 4日 = <b>よっか</b> · 5日 = <b>いつか</b> · 6日 = <b>むいか</b> · 7日 = <b>なのか</b> · 8日 = <b>ようか</b> · 9日 = <b>ここのか</b> · 10日 = <b>とおか</b>.<br>
From 11 on it is mostly regular + にち: 11日 = じゅういち<b>にち</b>. Exception: 14日 = じゅうよっか, 20日 = <b>はつか</b>, 24日 = にじゅうよっか.</div>

<h3>Time (時 = じ, 分 = ふん/ぷん) &amp; age (歳 = さい)</h3>
<div class="out"><b>Time:</b> 3時 = さんじ (3 o'clock), 3時30分 = さんじ さんじゅっぷん. Q: いま何時ですか。(What time is it now?)<br>
<b>Age:</b> 20歳 = はたち (irregular!), 18歳 = じゅうはっさい. Q: 何歳ですか / おいくつですか。(How old are you?)</div>

<h3>Ví dụ có lời giải · Full self-introduction with dates</h3>
<div class="out"><b>Q:</b> お誕生日は いつですか。(When is your birthday?)<br>
<b>A:</b> 8月4日です。(はちがつ よっか です — August 4th.)<br><br>
<b>Q:</b> 何歳ですか。(How old are you?)<br>
<b>A:</b> 19歳です。(じゅうきゅうさい です — 19 years old.) 2005年生まれです。(Born in 2005.)</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The pattern behind the "special" day readings.</b> The odd day-of-month readings (ついたち, ふつか, みっか…) are ancient native-Japanese (kun) number words, the same roots as ひとつ・ふたつ・みっつ (one thing, two things…). They survive only in dates. Rather than memorise 31 random words, notice they echo the native counting 1–10 you meet again in Chapter counters — a hint that Japanese has two number systems living side by side.</div>
<a class="link-card codelab" href="/language/ja/practice?ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">📅</span>
  <span class="lc-body"><span class="lc-title">Practise dates &amp; asking questions</span><span class="lc-sub">Interactive drills on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.4</span>
<h2>Nói ngày, giờ &amp; tuổi</h2>
<p class="lead">Đây là lúc số trở nên thật sự hữu ích: nói <em>khi nào</em>. Ngày tháng tiếng Nhật đọc từ lớn tới nhỏ: <b>năm → tháng → ngày</b>. Chú ý — vài cách đọc bất quy tắc, phải học thuộc.</p>

<h3>Năm (年 = ねん) &amp; năm sinh</h3>
<div class="out">Chỉ một số + 年: 2024年 = にせんにじゅうよ<b>ねん</b>. (Lưu ý: 4年 = よ<b>ね</b>ん, đọc bất quy tắc.)<br>
<b>Hỏi:</b> 何年生まれですか。(なんねん うまれ ですか) = Bạn sinh năm nào?<br>
<b>Đáp:</b> 2005年生まれです。= Tôi sinh năm 2005.</div>

<h3>Tháng (月 = がつ) — tháng 4, 7, 9 bất quy tắc!</h3>
<table>
  <thead><tr><th>1月</th><th>2月</th><th>3月</th><th>4月</th><th>5月</th><th>6月</th><th>7月</th><th>8月</th><th>9月</th><th>10月</th><th>11月</th><th>12月</th></tr></thead>
  <tbody>
    <tr><td>いちがつ</td><td>にがつ</td><td>さんがつ</td><td><b>し</b>がつ</td><td>ごがつ</td><td>ろくがつ</td><td><b>しち</b>がつ</td><td>はちがつ</td><td><b>く</b>がつ</td><td>じゅうがつ</td><td>じゅういちがつ</td><td>じゅうにがつ</td></tr>
  </tbody>
</table>
<div class="note-ct"><b>Học thuộc:</b> 4月 = しがつ (không phải よんがつ), 7月 = しちがつ (không phải なながつ), 9月 = くがつ (không phải きゅうがつ). Ba tháng này luôn bất quy tắc.</div>

<h3>Ngày trong tháng (日 = にち) — ngày 1–10 đặc biệt</h3>
<div class="out">1日 = <b>ついたち</b> · 2日 = <b>ふつか</b> · 3日 = <b>みっか</b> · 4日 = <b>よっか</b> · 5日 = <b>いつか</b> · 6日 = <b>むいか</b> · 7日 = <b>なのか</b> · 8日 = <b>ようか</b> · 9日 = <b>ここのか</b> · 10日 = <b>とおか</b>.<br>
Từ 11 trở đi phần lớn đều + にち: 11日 = じゅういち<b>にち</b>. Ngoại lệ: 14日 = じゅうよっか, 20日 = <b>はつか</b>, 24日 = にじゅうよっか.</div>

<h3>Giờ (時 = じ, 分 = ふん/ぷん) &amp; tuổi (歳 = さい)</h3>
<div class="out"><b>Giờ:</b> 3時 = さんじ (3 giờ), 3時30分 = さんじ さんじゅっぷん. Hỏi: いま何時ですか。(Bây giờ mấy giờ?)<br>
<b>Tuổi:</b> 20歳 = はたち (bất quy tắc!), 18歳 = じゅうはっさい. Hỏi: 何歳ですか / おいくつですか。(Bạn bao nhiêu tuổi?)</div>

<h3>Ví dụ có lời giải · Tự giới thiệu đầy đủ kèm ngày tháng</h3>
<div class="out"><b>Hỏi:</b> お誕生日は いつですか。(Sinh nhật bạn khi nào?)<br>
<b>Đáp:</b> 8月4日です。(はちがつ よっか です — Ngày 4 tháng 8.)<br><br>
<b>Hỏi:</b> 何歳ですか。(Bạn bao nhiêu tuổi?)<br>
<b>Đáp:</b> 19歳です。(じゅうきゅうさい です — 19 tuổi.) 2005年生まれです。(Sinh năm 2005.)</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Mẫu hình đằng sau các cách đọc ngày "đặc biệt".</b> Các cách đọc ngày lạ (ついたち, ふつか, みっか…) là từ số thuần Nhật (kun) cổ, cùng gốc với ひとつ・ふたつ・みっつ (một cái, hai cái…). Chúng chỉ còn sót trong ngày tháng. Thay vì học thuộc 31 từ ngẫu nhiên, hãy để ý chúng vọng lại cách đếm thuần Nhật 1–10 mà bạn gặp lại ở các "trợ số từ" — dấu hiệu tiếng Nhật có hai hệ số sống song song.</div>
<a class="link-card codelab" href="/language/ja/practice?ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">📅</span>
  <span class="lc-body"><span class="lc-title">Luyện ngày tháng &amp; cách hỏi</span><span class="lc-sub">Bài tập tương tác trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
        {
          title: 'Quiz 2 — Numbers, money & dates|||Quiz 2 — Số, tiền & ngày tháng',
          slug: 'jpd113-quiz-so',
          type: 'QUIZ',
          description: 'Kiểm tra hệ số đếm, tiền, ngày tháng và cách hỏi đáp.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'Japanese groups large numbers every… digits.|||Tiếng Nhật nhóm số lớn mỗi… chữ số.', options: ['3 (thousands)|||3 (nghìn)', '4 (万 / ten-thousand)|||4 (万 / vạn)', '2', '5'], correctIndex: 1, points: 1 },
              { question: '300 is read…|||300 đọc là…', options: ['さんひゃく', 'さんびゃく', 'さんぴゃく', 'みっぴゃく'], correctIndex: 1, points: 1 },
              { question: 'One million (1,000,000) in Japanese is…|||Một triệu (1.000.000) trong tiếng Nhật là…', options: ['いちまん (1万)', 'ひゃくまん (100万)', 'せんまん (1000万)', 'いちおく (1億)'], correctIndex: 1, points: 1 },
              { question: 'To ask "How much is this?" you say…|||Để hỏi "Cái này bao nhiêu tiền?" bạn nói…', options: ['なんですか', 'これは いくらですか', 'なんじですか', 'だれですか'], correctIndex: 1, points: 1 },
              { question: 'The month 4月 (April) is read…|||Tháng 4月 (tháng Tư) đọc là…', options: ['よんがつ', 'しがつ', 'よがつ', 'しちがつ'], correctIndex: 1, points: 1 },
              { question: 'The 1st of the month (1日) is read…|||Ngày mùng 1 (1日) đọc là…', options: ['いちにち', 'ついたち', 'ひとつ', 'いっか'], correctIndex: 1, points: 1 },
              { question: 'To ask someone their age you can say…|||Để hỏi tuổi ai đó bạn có thể nói…', options: ['何歳ですか / おいくつですか', 'いくらですか', 'なんじですか', 'いつですか'], correctIndex: 0, points: 1 },
            ],
          },
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
    {
      "title": "Final Exam|||Thi cuối kỳ",
      "description": "Thi cuối kỳ gồm PE (thi thực hành) và FE (trắc nghiệm). Khung + câu mẫu; đề thật thêm sau khi có trang phòng thi.",
      "lessons": [
        {
          "title": "PE — Practical Exam|||PE — Thi thực hành",
          "slug": "jpd113-final-exam-pe",
          "type": "article",
          "description": "Khung thi thực hành (PE) của môn — format, cách chấm và cách chuẩn bị. Đề thật thêm sau.",
          "content": "\n<div class=\"ml-en\">\n<span class=\"eyebrow\">Final Exam · PE</span>\n<h2>PE — Practical Exam</h2>\n<p class=\"lead\">The Practical Exam (PE) for this subject is a <strong>speaking exam (kaiwa)</strong>: you talk with the examiner &mdash; self-introduction, a short conversation, or a brief presentation on a given topic &mdash; graded on pronunciation, grammar, vocabulary, fluency and responsiveness.</p>\n<h3>How to prepare</h3>\n<ul>\n<li>Practise speaking aloud daily; record yourself and check pronunciation.</li>\n<li>Memorize set phrases for greetings, self-introduction, and asking/answering.</li>\n<li>Prepare 3&ndash;5 common topics and be able to speak ~1 minute on each.</li>\n<li>When you do not understand, ask politely to repeat (&laquo;mou ichido onegaishimasu&raquo;) &mdash; do not freeze.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Sample</span> A real practical prompt bank for this subject will be added here later, in the exam room. Use the guidance above to prepare now.</div>\n</div>\n<div class=\"ml-vi\">\n<span class=\"eyebrow\">Thi cuối kỳ · PE</span>\n<h2>PE — Thi thực hành</h2>\n<p class=\"lead\">Thi thực hành (PE) của môn này là <strong>thi nói (kaiwa / speaking)</strong>: bạn nói chuyện với giám khảo &mdash; tự giới thiệu, một đoạn hội thoại ngắn, hoặc thuyết trình ngắn về một chủ đề cho sẵn &mdash; chấm theo phát âm, ngữ pháp, từ vựng, độ trôi chảy và khả năng phản hồi.</p>\n<h3>Cách chuẩn bị</h3>\n<ul>\n<li>Luyện nói to mỗi ngày; tự ghi âm và kiểm phát âm.</li>\n<li>Thuộc mẫu câu chào hỏi, tự giới thiệu, và hỏi/đáp.</li>\n<li>Chuẩn bị 3&ndash;5 chủ đề quen và nói được ~1 phút mỗi chủ đề.</li>\n<li>Khi không hiểu, lịch sự xin nhắc lại (&laquo;mou ichido onegaishimasu&raquo;) &mdash; đừng đơ.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Câu mẫu</span> Ngân hàng đề thực hành thật cho môn này sẽ được thêm vào đây sau, trong trang phòng thi. Dùng hướng dẫn trên để chuẩn bị ngay từ giờ.</div>\n</div>"
        },
        {
          "title": "FE — Final Exam (Multiple Choice)|||FE — Thi trắc nghiệm cuối kỳ",
          "slug": "jpd113-final-exam-fe",
          "type": "article",
          "description": "Đánh giá độ khó + tổng quan cấu trúc đề + cách ôn, đúc kết từ 14 đề FE thật (420 câu) đã có trong Phòng thi.",
          "content": "\n<div class=\"ml-en\">\n<span class=\"eyebrow\">Final Exam · FE</span>\n<h2>FE — Final Exam (Multiple Choice)</h2>\n<p class=\"lead\">The Final Exam (FE) for this subject is a <strong>computer-graded multiple-choice test</strong>. For the exact number of questions, duration, weight and pass mark, see <em>Lesson 0.2 — Grading</em>.</p>\n<h3>Difficulty &amp; question breakdown (14 real past-exam papers, 420 questions)</h3>\n<p>Based on all 14 real FE papers now in the Exam Room (420 questions total), this exam sits at a solid <strong>N5 level</strong>: no advanced grammar, but heavy on memorization &mdash; number/kanji readings and vocabulary collocations trip up more students than grammar logic does.</p>\n<table>\n<thead><tr><th>Question type</th><th>Share</th></tr></thead>\n<tbody>\n<tr><td>Fill-in-the-blank (particles, question words, demonstratives, verb conjugation, vocabulary-in-context)</td><td>~70%</td></tr>\n<tr><td>Kanji &rarr; hiragana reading</td><td>~11%</td></tr>\n<tr><td>Word/hiragana &rarr; correct kanji</td><td>~11%</td></tr>\n<tr><td>Rearrange word cues into a sentence</td><td>~4%</td></tr>\n<tr><td>Katakana loanword &rarr; Vietnamese meaning</td><td>~2%</td></tr>\n<tr><td>Odd one out (which word doesn't belong)</td><td>~2%</td></tr>\n</tbody>\n</table>\n<h3>Where students actually lose points</h3>\n<ul>\n<li><strong>Irregular number/date/time readings</strong> (一日 tsuitachi, 二日 futsuka, 九日 kokonoka, 二十一分 nijuuippun, 八千 hassen&hellip;) &mdash; not derivable from rules, must be memorized.</li>\n<li><strong>これ/それ/あれ vs この/その/あの</strong> &mdash; standalone pronoun vs. adnominal form right before a noun; tested repeatedly across papers.</li>\n<li><strong>Question words</strong> (なに/だれ/どこ/いつ/なん/どちら) &mdash; read the given answer first, then infer the question word backward.</li>\n<li><strong>Vocabulary collocations</strong> (buy X where, eat Y how) &mdash; the single largest chunk of questions; needs broad N5 vocabulary, not grammar reasoning.</li>\n</ul>\n<h3>How to review</h3>\n<ol>\n<li>Drill the 1&ndash;100 number chart plus irregular date/time readings first &mdash; the single biggest point-loser.</li>\n<li>Master これ/それ/あれ vs この/その/あの: a bare noun right after the blank means an adnominal form is needed.</li>\n<li>Practice the 6 question words by reading the answer first and working backward.</li>\n<li>Build topic vocabulary (shopping, food, school, time) &mdash; most fill-in-the-blank items test this, not grammar.</li>\n<li>Time yourself: 45 minutes / 30 questions &asymp; 1.5 min/question &mdash; take all 14 real papers in the Exam Room to build speed.</li>\n</ol>\n<h3>How to do well (general test-taking)</h3>\n<ul>\n<li>Pace yourself: divide time by the number of questions; flag hard ones and return at the end.</li>\n<li>Eliminate clearly wrong options first, then choose among the rest.</li>\n<li>For \"what should you do / which is best\" items, answer by this subject's method, not gut feeling.</li>\n<li>Never leave the gated final blank &mdash; an educated guess beats an empty answer.</li>\n</ul>\n<div class=\"callout ok\"><span class=\"badge\">Live</span> All 14 real past FE papers (420 questions, bilingual explanations) are now live in the <a href=\"/exam?course=JPD113&amp;kind=FE\">Exam Room</a> &mdash; practice there before the real test.</div>\n</div>\n<div class=\"ml-vi\">\n<span class=\"eyebrow\">Thi cuối kỳ · FE</span>\n<h2>FE — Thi trắc nghiệm cuối kỳ</h2>\n<p class=\"lead\">Bài thi cuối kỳ (FE) của môn này là <strong>thi trắc nghiệm, máy chấm</strong>. Số câu, thời gian, trọng số và điểm qua cụ thể: xem <em>Bài 0.2 — Thang điểm</em>.</p>\n<h3>Độ khó &amp; tỉ lệ dạng câu (14 đề FE thật, 420 câu)</h3>\n<p>Dựa trên toàn bộ 14 đề FE thật hiện có trong Phòng thi (420 câu), đề này ở mức <strong>N5 chuẩn</strong>: không có ngữ pháp nâng cao, nhưng nặng về học thuộc &mdash; đọc số/Hán tự và collocation từ vựng khiến mất điểm nhiều hơn là logic ngữ pháp.</p>\n<table>\n<thead><tr><th>Dạng câu</th><th>Tỉ lệ</th></tr></thead>\n<tbody>\n<tr><td>Điền chỗ trống (trợ từ, từ để hỏi, đại từ chỉ định, chia động từ, từ vựng theo ngữ cảnh)</td><td>~70%</td></tr>\n<tr><td>Đọc Hán tự &rarr; hiragana</td><td>~11%</td></tr>\n<tr><td>Chọn Hán tự đúng cho từ/hiragana cho sẵn</td><td>~11%</td></tr>\n<tr><td>Sắp xếp từ gợi ý thành câu</td><td>~4%</td></tr>\n<tr><td>Từ mượn katakana &rarr; nghĩa tiếng Việt</td><td>~2%</td></tr>\n<tr><td>Chọn từ khác loại (odd one out)</td><td>~2%</td></tr>\n</tbody>\n</table>\n<h3>Điểm hay mất điểm nhất</h3>\n<ul>\n<li><strong>Đọc số/ngày/giờ bất quy tắc</strong> (一日 ついたち, 二日 ふつか, 九日 ここのか, 二十一分 にじゅういっぷん, 八千 はっせん&hellip;) &mdash; không suy luận được, phải học thuộc.</li>\n<li><strong>これ/それ/あれ vs この/その/あの</strong> &mdash; đại từ độc lập vs từ chỉ định đứng trước danh từ &mdash; lặp lại rất nhiều lần qua các đề.</li>\n<li><strong>Từ để hỏi</strong> (なに/だれ/どこ/いつ/なん/どちら) &mdash; đọc câu trả lời cho sẵn trước, rồi suy ngược ra từ hỏi.</li>\n<li><strong>Collocation từ vựng</strong> (mua gì ở đâu, ăn gì thế nào) &mdash; nhóm câu hỏi lớn nhất, cần vốn từ N5 rộng chứ không phải suy luận ngữ pháp.</li>\n</ul>\n<h3>Cách ôn</h3>\n<ol>\n<li>Học chắc bảng số 1&ndash;100 và cách đọc ngày/giờ bất quy tắc trước &mdash; điểm mất điểm nhiều nhất.</li>\n<li>Nắm chắc これ/それ/あれ vs この/その/あの: có danh từ trần ngay sau chỗ trống nghĩa là cần dạng chỉ định.</li>\n<li>Luyện 6 từ để hỏi bằng cách đọc câu trả lời trước rồi suy ngược.</li>\n<li>Xây từ vựng theo chủ đề (mua sắm, ăn uống, trường học, thời gian) &mdash; phần lớn câu điền chỗ trống kiểm tra cái này, không phải ngữ pháp.</li>\n<li>Canh giờ: 45 phút / 30 câu &asymp; 1.5 phút/câu &mdash; làm thử cả 14 đề thật trong Phòng thi để quen tốc độ.</li>\n</ol>\n<h3>Cách làm tốt (kỹ năng thi trắc nghiệm chung)</h3>\n<ul>\n<li>Phân bổ thời gian: chia đều theo số câu; đánh dấu câu khó, quay lại ở cuối.</li>\n<li>Loại phương án sai rõ ràng trước, rồi chọn trong số còn lại.</li>\n<li>Câu \"nên làm gì / cái nào tốt nhất\" &mdash; trả lời theo phương pháp của môn, không theo cảm tính.</li>\n<li>Đừng bao giờ bỏ trống bài thi có cổng &mdash; đoán có suy luận vẫn hơn để trống.</li>\n</ul>\n<div class=\"callout ok\"><span class=\"badge\">Đã có</span> Toàn bộ 14 đề FE thật (420 câu, giải thích song ngữ) hiện đã có trong <a href=\"/exam?course=JPD113&amp;kind=FE\">Phòng thi</a> &mdash; vào luyện trước khi thi thật.</div>\n</div>",
          "quiz": {
            "timeLimitSeconds": 360,
            "questions": [
              {
                "id": "q1",
                "points": 1,
                "question": "Which kana is read \"ka\"?|||Chữ kana nào đọc là \"ka\"?",
                "options": [
                  "さ",
                  "か",
                  "た",
                  "な"
                ],
                "correctIndex": 1
              },
              {
                "id": "q2",
                "points": 1,
                "question": "Katakana is mainly used for…|||Katakana chủ yếu dùng cho…",
                "options": [
                  "native Japanese grammar words|||từ ngữ pháp thuần Nhật",
                  "foreign loanwords and names|||từ mượn và tên nước ngoài",
                  "kanji readings|||cách đọc kanji",
                  "numbers only|||chỉ số đếm"
                ],
                "correctIndex": 1
              },
              {
                "id": "q3",
                "points": 1,
                "question": "The dakuten mark (゛) changes か into…|||Dấu dakuten (゛) biến か thành…",
                "options": [
                  "が (ga)",
                  "ぱ (pa)",
                  "きゃ (kya)",
                  "こ (ko)"
                ],
                "correctIndex": 0
              },
              {
                "id": "q4",
                "points": 1,
                "question": "A small っ (sokuon) means…|||Một っ nhỏ (sokuon) nghĩa là…",
                "options": [
                  "a long vowel|||một trường âm",
                  "double the next consonant|||gấp đôi phụ âm kế",
                  "a question|||một câu hỏi",
                  "silence|||im lặng"
                ],
                "correctIndex": 1
              },
              {
                "id": "q5",
                "points": 1,
                "question": "し is read…|||し đọc là…",
                "options": [
                  "si",
                  "shi",
                  "chi",
                  "hi"
                ],
                "correctIndex": 1
              },
              {
                "id": "q6",
                "points": 1,
                "question": "Japanese groups large numbers every… digits.|||Tiếng Nhật nhóm số lớn mỗi… chữ số.",
                "options": [
                  "3 (thousands)|||3 (nghìn)",
                  "4 (万 / ten-thousand)|||4 (万 / vạn)",
                  "2",
                  "5"
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
