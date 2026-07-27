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
    <tr><td>n</td><td>ナ</td><td>ニ</td><td>ヌ</td><td>ネ</td><td>ノ</td></tr>
    <tr><td>h</td><td>ハ</td><td>ヒ</td><td>フ</td><td>ヘ</td><td>ホ</td></tr>
    <tr><td>m</td><td>マ</td><td>ミ</td><td>ム</td><td>メ</td><td>モ</td></tr>
    <tr><td>y</td><td>ヤ</td><td></td><td>ユ</td><td></td><td>ヨ</td></tr>
    <tr><td>r</td><td>ラ</td><td>リ</td><td>ル</td><td>レ</td><td>ロ</td></tr>
    <tr><td>w</td><td>ワ</td><td></td><td></td><td></td><td>ヲ</td></tr>
    <tr><td>n</td><td colspan="5">ン (same lone consonant as hiragana ん; ヲ is almost never used in loanwords, only kept to complete the grid)</td></tr>
  </tbody>
</table>
<div class="out"><b>Loanwords from real exams:</b> コーヒー=kōhī (coffee) · テレビ=terebi (TV) · タクシー=takushī (taxi) · ホテル=hoteru (hotel) · レストラン=resutoran (restaurant) · エスカレーター=esukarētā (escalator) · トイレ=toire (toilet) · カメラ=kamera (camera) · <b>country names in katakana:</b> ベトナム (Vietnam), アメリカ (America), フランス (France), イギリス (UK), ドイツ (Germany), オーストラリア (Australia), タイ (Thailand) — but neighbouring countries with a Chinese-character name, like かんこく (Korea) and ちゅうごく (China), stay in hiragana, NOT katakana. Long vowels use a dash ー: コーヒー is <em>ko-o-hi-i</em>, four beats, not three.</div>
<div class="pitfall"><b>Easy mix-ups:</b> シ (shi) vs ツ (tsu), and ン (n) vs ソ (so) — the stroke direction differs. Write them by hand to feel the difference. In multiple-choice exams, a katakana-loanword question usually asks for the <em>Vietnamese meaning</em> of a word like エスカレーター or ホテル — build a mental list of common loanwords rather than trying to "translate" them from English spelling alone.</div>
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
          title: '3.5 — Days of the week (曜日)|||3.5 — Ngày trong tuần (曜日)',
          slug: 'jpd113-youbi',
          type: 'VIDEO',
          description: '月火水木金土日 + 曜日, 何曜日ですか — kanji 曜 xuất hiện dày đặc trong đề thi thật.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.5</span>
<h2>Days of the week — 曜日 (ようび)</h2>
<p class="lead">Every day of the week is built the same way: a "element" kanji + 曜日 (yōbi, "day of the ~"). Learn the seven element kanji once and the whole week follows a pattern — no irregular readings here, unlike months and dates.</p>
<table>
  <thead><tr><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th><th>Sun</th></tr></thead>
  <tbody>
    <tr><td>月曜日</td><td>火曜日</td><td>水曜日</td><td>木曜日</td><td>金曜日</td><td>土曜日</td><td>日曜日</td></tr>
    <tr><td>げつようび</td><td>かようび</td><td>すいようび</td><td>もくようび</td><td>きんようび</td><td>どようび</td><td>にちようび</td></tr>
  </tbody>
</table>
<div class="note-ct">Each element kanji also means an element/body: 月=moon, 火=fire, 水=water, 木=wood, 金=gold/money, 土=earth, 日=sun. In fast/casual speech the trailing 日 is often dropped: 月曜 = げつよう.</div>
<h3>Asking "what day is it?"</h3>
<div class="out"><b>Q:</b> 今日は何曜日ですか。(きょうは なんようびですか) = What day is today?<br>
<b>A:</b> 今日は水曜日です。(きょうは すいようびです) = Today is Wednesday.<br><br>
<b>Q:</b> 何曜日に日本語のクラスがありますか。(なんようびに にほんごの クラスが ありますか) = On which day is the Japanese class?<br>
<b>A:</b> 月曜日と木曜日です。(げつようびと もくようびです) = Monday and Thursday. (と = "and", connects two nouns.)</div>
<h3>Ví dụ có lời giải · A weekly schedule</h3>
<div class="out">月曜日：日本語 (Japanese) · 火曜日：数学 (Math) · 水曜日：休み (day off) · 木曜日：日本語 · 金曜日：スピーキング (Speaking)<br>
Q: 休みは何曜日ですか。(きゅうびは なんようびですか) → A: 水曜日です。</div>
<div class="callout"><span class="badge">★ Exam frequency</span> The kanji <b>曜</b> is the <b>3rd most frequent kanji</b> across 420 real FE exam questions (60 occurrences) — right after 日 and 私. If you only memorise a handful of extra kanji before the exam, 曜 must be one of them.</div>
<div class="pitfall"><b>Watch:</b> 何曜日ですか (which day of the week) is asked with the counter-question-word 何 read <em>なん</em>, not どの — a different question-word pattern than これ/それ/あれ. Don't confuse 曜日 (day of week) with 日 alone (day of month, e.g. 8日).</div>
<a class="link-card codelab" href="/language/ja/vocab?ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">🗓️</span>
  <span class="lc-body"><span class="lc-title">Drill the 7 days of the week</span><span class="lc-sub">Vocabulary flashcards on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.5</span>
<h2>Ngày trong tuần — 曜日 (ようび)</h2>
<p class="lead">Mỗi ngày trong tuần xây theo cùng một mẫu: kanji "nguyên tố" + 曜日 (yōbi, "ngày của ~"). Học 7 kanji nguyên tố một lần là cả tuần theo đúng mẫu — không có cách đọc bất quy tắc nào ở đây, khác với tháng và ngày.</p>
<table>
  <thead><tr><th>Thứ 2</th><th>Thứ 3</th><th>Thứ 4</th><th>Thứ 5</th><th>Thứ 6</th><th>Thứ 7</th><th>CN</th></tr></thead>
  <tbody>
    <tr><td>月曜日</td><td>火曜日</td><td>水曜日</td><td>木曜日</td><td>金曜日</td><td>土曜日</td><td>日曜日</td></tr>
    <tr><td>げつようび</td><td>かようび</td><td>すいようび</td><td>もくようび</td><td>きんようび</td><td>どようび</td><td>にちようび</td></tr>
  </tbody>
</table>
<div class="note-ct">Mỗi kanji nguyên tố cũng có nghĩa riêng: 月=mặt trăng, 火=lửa, 水=nước, 木=gỗ/cây, 金=vàng/tiền, 土=đất, 日=mặt trời. Trong lời nói nhanh/thân mật, thường bỏ 日 phía sau: 月曜 = げつよう.</div>
<h3>Cách hỏi "hôm nay thứ mấy?"</h3>
<div class="out"><b>Hỏi:</b> 今日は何曜日ですか。(きょうは なんようびですか) = Hôm nay thứ mấy?<br>
<b>Đáp:</b> 今日は水曜日です。(きょうは すいようびです) = Hôm nay thứ Tư.<br><br>
<b>Hỏi:</b> 何曜日に日本語のクラスがありますか。(なんようびに にほんごの クラスが ありますか) = Lớp tiếng Nhật vào thứ mấy?<br>
<b>Đáp:</b> 月曜日と木曜日です。(げつようびと もくようびです) = Thứ Hai và thứ Năm. (と = "và", nối hai danh từ.)</div>
<h3>Ví dụ có lời giải · Thời khoá biểu trong tuần</h3>
<div class="out">月曜日：日本語 (Tiếng Nhật) · 火曜日：数学 (Toán) · 水曜日：休み (nghỉ) · 木曜日：日本語 · 金曜日：スピーキング (Nói)<br>
Hỏi: 休みは何曜日ですか。(きゅうびは なんようびですか) → Đáp: 水曜日です。</div>
<div class="callout"><span class="badge">★ Tần suất trong đề thi</span> Kanji <b>曜</b> là kanji <b>xuất hiện nhiều thứ 3</b> trong 420 câu FE thật (60 lần) — chỉ sau 日 và 私. Nếu chỉ học thuộc thêm vài kanji trước khi thi, 曜 phải là một trong số đó.</div>
<div class="pitfall"><b>Chú ý:</b> 何曜日ですか (thứ mấy) dùng từ hỏi 何 đọc là <em>なん</em>, không phải どの — khác mẫu từ hỏi với これ/それ/あれ. Đừng nhầm 曜日 (thứ trong tuần) với 日 đứng một mình (ngày trong tháng, ví dụ 8日).</div>
<a class="link-card codelab" href="/language/ja/vocab?ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">🗓️</span>
  <span class="lc-body"><span class="lc-title">Luyện 7 ngày trong tuần</span><span class="lc-sub">Flashcard từ vựng trên My Language.</span></span>
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
              { question: 'Wednesday (水曜日) is read…|||Thứ Tư (水曜日) đọc là…', options: ['もくようび', 'すいようび', 'かようび', 'きんようび'], correctIndex: 1, points: 1 },
              { question: '"What day of the week is it?" is…|||"Hôm nay thứ mấy?" là…', options: ['何日ですか', '何曜日ですか', '何時ですか', '何歳ですか'], correctIndex: 1, points: 1 },
            ],
          },
        },
        {
          title: 'Grammar Summary — Chapter 3|||Tóm tắt ngữ pháp — Chương 3',
          slug: 'jpd113-nguphap-chuong3',
          type: 'VIDEO',
          description: 'Gom lại toàn bộ mẫu câu chương 3: chào hỏi, hệ số đếm, tiền, ngày giờ, tuổi, thứ trong tuần — kèm hướng dẫn dùng lại.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Grammar Summary</span>
<h2>Everything from Chapter 3, in one place</h2>
<p class="lead">Chapter 3 packed in a lot of small, high-frequency patterns. This page is your one-stop reference — come back here before quizzes and before the real exam.</p>
<table>
  <thead><tr><th>Pattern</th><th>Use</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td>Greetings/classroom set phrases</td><td>Fixed daily expressions</td><td>おはようございます、すみません、わかりません</td></tr>
    <tr><td>Number grouping every 4 digits</td><td>Counting beyond 1,000</td><td>1万=いちまん, 100万=ひゃくまん</td></tr>
    <tr><td>ひゃく/びゃく/ぴゃく sound changes</td><td>300/600/800 soften</td><td>さんびゃく, ろっぴゃく, はっぴゃく</td></tr>
    <tr><td>これは いくらですか</td><td>Ask a price</td><td>それは 500円です。</td></tr>
    <tr><td>[number]年生まれです</td><td>State a birth year</td><td>2005年生まれです。</td></tr>
    <tr><td>[number]月 — irregular 4,7,9</td><td>Name a month</td><td>4月=しがつ、7月=しちがつ、9月=くがつ</td></tr>
    <tr><td>[number]日 — irregular 1–10, 14, 20, 24</td><td>Name a day of the month</td><td>1日=ついたち、20日=はつか</td></tr>
    <tr><td>[number]時[分] &amp; 何時ですか</td><td>Tell/ask the time</td><td>3時30分です。今何時ですか。</td></tr>
    <tr><td>[number]歳 — irregular 20</td><td>State age</td><td>20歳=はたち、18歳=じゅうはっさい</td></tr>
    <tr><td>[day]曜日 &amp; 何曜日ですか</td><td>Name/ask a day of the week</td><td>今日は水曜日です。</td></tr>
  </tbody>
</table>
<h3>How to reuse this chapter's grammar together</h3>
<div class="out">お誕生日は いつですか。8月4日です。何歳ですか。19歳です。2005年生まれです。今日は何曜日ですか。水曜日です。<br>
= When is your birthday? August 4th. How old are you? 19. Born in 2005. What day is today? Wednesday.<br>
Notice how every answer follows the same shape: [number/word] + counter + です — that single shape covers dates, money, time, age and days of the week.</div>
<div class="callout"><span class="badge">★ Study tip</span> Numbers and their irregular readings (4/7/9 months, 1–10/14/20/24 days, 20 years old) cause more lost points on the real FE exam than any grammar logic in this chapter — drill the irregular readings until they are automatic, before worrying about anything else here.</div>
<a class="link-card codelab" href="/language/ja/grammar?level=JPD113&ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Review all Chapter 3 patterns</span><span class="lc-sub">Grammar reference on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Tóm tắt ngữ pháp</span>
<h2>Toàn bộ Chương 3, gom vào một chỗ</h2>
<p class="lead">Chương 3 nhồi khá nhiều mẫu câu nhỏ nhưng tần suất cao. Trang này là nơi tra cứu duy nhất — quay lại đây trước khi làm quiz và trước khi thi thật.</p>
<table>
  <thead><tr><th>Mẫu câu</th><th>Dùng để</th><th>Ví dụ</th></tr></thead>
  <tbody>
    <tr><td>Cụm chào hỏi/lớp học cố định</td><td>Câu nói hằng ngày</td><td>おはようございます、すみません、わかりません</td></tr>
    <tr><td>Nhóm số mỗi 4 chữ số</td><td>Đếm quá 1.000</td><td>1万=いちまん, 100万=ひゃくまん</td></tr>
    <tr><td>Biến âm ひゃく/びゃく/ぴゃく</td><td>300/600/800 đọc mềm</td><td>さんびゃく, ろっぴゃく, はっぴゃく</td></tr>
    <tr><td>これは いくらですか</td><td>Hỏi giá</td><td>それは 500円です。</td></tr>
    <tr><td>[số]年生まれです</td><td>Nói năm sinh</td><td>2005年生まれです。</td></tr>
    <tr><td>[số]月 — bất quy tắc 4,7,9</td><td>Nói tên tháng</td><td>4月=しがつ、7月=しちがつ、9月=くがつ</td></tr>
    <tr><td>[số]日 — bất quy tắc 1–10, 14, 20, 24</td><td>Nói ngày trong tháng</td><td>1日=ついたち、20日=はつか</td></tr>
    <tr><td>[số]時[分] & 何時ですか</td><td>Nói/hỏi giờ</td><td>3時30分です。今何時ですか。</td></tr>
    <tr><td>[số]歳 — bất quy tắc 20</td><td>Nói tuổi</td><td>20歳=はたち、18歳=じゅうはっさい</td></tr>
    <tr><td>[thứ]曜日 & 何曜日ですか</td><td>Nói/hỏi thứ trong tuần</td><td>今日は水曜日です。</td></tr>
  </tbody>
</table>
<h3>Cách dùng lại toàn bộ ngữ pháp chương này cùng nhau</h3>
<div class="out">お誕生日は いつですか。8月4日です。何歳ですか。19歳です。2005年生まれです。今日は何曜日ですか。水曜日です。<br>
= Sinh nhật bạn khi nào? Ngày 4 tháng 8. Bạn bao nhiêu tuổi? 19 tuổi. Sinh năm 2005. Hôm nay thứ mấy? Thứ Tư.<br>
Để ý mỗi câu trả lời đều theo cùng một khuôn: [số/từ] + trợ số từ + です — chỉ một khuôn này phủ hết ngày tháng, tiền, giờ, tuổi và thứ trong tuần.</div>
<div class="callout"><span class="badge">★ Mẹo học</span> Số và cách đọc bất quy tắc của chúng (tháng 4/7/9, ngày 1–10/14/20/24, tuổi 20) khiến mất điểm trong đề FE thật nhiều hơn bất kỳ logic ngữ pháp nào trong chương này — luyện cách đọc bất quy tắc tới khi thành phản xạ trước khi lo những thứ khác.</div>
<a class="link-card codelab" href="/language/ja/grammar?level=JPD113&ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Ôn lại toàn bộ mẫu câu Chương 3</span><span class="lc-sub">Tra cứu ngữ pháp trên My Language.</span></span>
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
<a class="link-card codelab" href="/language/ja/grammar?level=JPD113&ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Study grammar patterns</span><span class="lc-sub">は/です/の with examples on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
<a class="link-card codelab" href="/language/ja/vocab?level=JPD113&categoryId=994&ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">🌍</span>
  <span class="lc-body"><span class="lc-title">Bài 1 vocabulary: self & country</span><span class="lc-sub">JPD113 word list on My Language.</span></span>
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
<a class="link-card codelab" href="/language/ja/grammar?level=JPD113&ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Học mẫu ngữ pháp</span><span class="lc-sub">は/です/の kèm ví dụ trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
<a class="link-card codelab" href="/language/ja/vocab?level=JPD113&categoryId=994&ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">🌍</span>
  <span class="lc-body"><span class="lc-title">Từ vựng Bài 1: bản thân & quốc gia</span><span class="lc-sub">Bộ từ JPD113 trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
        {
          title: '4.2 — も (also) & か (question particle)|||4.2 — も (cũng) & か (trợ từ hỏi)',
          slug: 'jpd113-mo-ka',
          type: 'VIDEO',
          description: 'も thay は để nói "cũng"; か thêm vào cuối câu để hỏi — hai trợ từ bị test rất nhiều nhưng chưa có bài riêng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>も (also) &amp; か (question particle)</h2>
<p class="lead">Two of the most-tested particles on the real exam, yet easy to learn: <b>も</b> replaces は to mean "also/too", and <b>か</b> turns any です statement into a yes/no question just by adding it to the end — no word order change, no question mark needed.</p>
<h3>も — "also / too"</h3>
<div class="out">わたしは がくせいです。 → I am a student.<br>
かれ<b>も</b> がくせいです。 → He is <b>also</b> a student. (も replaces は, not added next to it)<br>
アンさんは ベトナム人です。マイさん<b>も</b> ベトナム人です。 → An is Vietnamese. Mai is Vietnamese <b>too</b>.</div>
<div class="pitfall"><b>Trap:</b> も <em>replaces</em> は/が, it never appears together with them in the same slot — わたしはもがくせいです is wrong. Say わたしもがくせいです.</div>
<h3>か — turning a statement into a question</h3>
<div class="out">あなたは がくせいです。 → You are a student. (statement)<br>
あなたは がくせいです<b>か</b>。 → Are you a student? (statement + か, same word order)<br>
<b>A (yes):</b> はい、そうです。 <b>A (no):</b> いいえ、ちがいます。 / いいえ、がくせいじゃないです。</div>
<h3>Ví dụ có lời giải · Combining は/です/の/も/か</h3>
<div class="out"><b>Q:</b> アンさんは ベトナムの がくせいですか。 (Is An a Vietnamese student?)<br>
<b>A:</b> はい、そうです。マイさんも ベトナムの がくせいです。 (Yes. Mai is also a Vietnamese student.)</div>
<div class="callout"><span class="badge">★ Exam tip</span> On multiple-choice papers, a blank right before ですか with no other particle in sight is almost always filled by <b>か</b> itself (the sentence needs it to be a grammatical question) or by <b>も</b> (if the sentence already established a similar fact about someone else). Read the sentence <em>before</em> the blank for a matching topic — that is the strongest clue between も and は.</div>
<a class="link-card codelab" href="/language/ja/grammar?level=JPD113&ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Drill も & か</span><span class="lc-sub">Grammar patterns with examples on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>も (cũng) &amp; か (trợ từ hỏi)</h2>
<p class="lead">Hai trợ từ bị test nhiều nhất trong đề thi thật, nhưng lại rất dễ học: <b>も</b> thay thế は để nói "cũng", và <b>か</b> biến bất kỳ câu です nào thành câu hỏi có/không chỉ bằng cách thêm vào cuối câu — không đổi trật tự từ, không cần dấu hỏi.</p>
<h3>も — "cũng"</h3>
<div class="out">わたしは がくせいです。 → Tôi là sinh viên.<br>
かれ<b>も</b> がくせいです。 → Anh ấy <b>cũng</b> là sinh viên. (も thay thế は, không thêm vào bên cạnh)<br>
アンさんは ベトナム人です。マイさん<b>も</b> ベトナム人です。 → An là người Việt Nam. Mai <b>cũng</b> là người Việt Nam.</div>
<div class="pitfall"><b>Bẫy:</b> も <em>thay thế</em> は/が, không bao giờ xuất hiện cùng chỗ với chúng — わたしはもがくせいです là SAI. Nói わたしもがくせいです.</div>
<h3>か — biến câu khẳng định thành câu hỏi</h3>
<div class="out">あなたは がくせいです。 → Bạn là sinh viên. (câu khẳng định)<br>
あなたは がくせいです<b>か</b>。 → Bạn có phải là sinh viên không? (khẳng định + か, giữ nguyên trật tự từ)<br>
<b>Đáp (có):</b> はい、そうです。 <b>Đáp (không):</b> いいえ、ちがいます。 / いいえ、がくせいじゃないです。</div>
<h3>Ví dụ có lời giải · Kết hợp は/です/の/も/か</h3>
<div class="out"><b>Hỏi:</b> アンさんは ベトナムの がくせいですか。 (An có phải sinh viên Việt Nam không?)<br>
<b>Đáp:</b> はい、そうです。マイさんも ベトナムの がくせいです。 (Đúng vậy. Mai cũng là sinh viên Việt Nam.)</div>
<div class="callout"><span class="badge">★ Mẹo thi</span> Trong đề trắc nghiệm, chỗ trống ngay trước ですか mà không thấy trợ từ nào khác gần đó gần như luôn điền <b>か</b> (câu cần nó để thành câu hỏi đúng ngữ pháp) hoặc <b>も</b> (nếu câu trước đã nói việc tương tự về người khác). Đọc câu <em>trước</em> chỗ trống để tìm chủ đề trùng lặp — đó là manh mối mạnh nhất giữa も và は.</div>
<a class="link-card codelab" href="/language/ja/grammar?level=JPD113&ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Luyện も & か</span><span class="lc-sub">Mẫu ngữ pháp kèm ví dụ trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
        {
          title: '4.3 — Nationality & occupation|||4.3 — Quốc tịch & nghề nghiệp',
          slug: 'jpd113-quoc-tich-nghe-nghiep',
          type: 'VIDEO',
          description: 'Vocab quốc gia/quốc tịch + nghề nghiệp, mẫu câu おくには どちらですか / おしごとは なんですか.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.3</span>
<h2>Nationality &amp; occupation</h2>
<p class="lead">Now that you have は/です/の/も/か, fill in the vocabulary that makes self-introductions real: where you are from, and what you do. This is one of the densest vocabulary groups on the real exam.</p>
<h3>Countries &amp; nationalities (X + 人 = a person of X)</h3>
<table>
  <thead><tr><th>Country</th><th>Reading</th><th>Nationality</th></tr></thead>
  <tbody>
    <tr><td>にほん (日本)</td><td>nihon</td><td>にほんじん</td></tr>
    <tr><td>ベトナム</td><td>Betonamu</td><td>ベトナムじん</td></tr>
    <tr><td>かんこく (韓国)</td><td>kankoku</td><td>かんこくじん</td></tr>
    <tr><td>ちゅうごく (中国)</td><td>chūgoku</td><td>ちゅうごくじん</td></tr>
    <tr><td>アメリカ</td><td>Amerika</td><td>アメリカじん</td></tr>
    <tr><td>フランス</td><td>Furansu</td><td>フランスじん</td></tr>
    <tr><td>イギリス</td><td>Igirisu</td><td>イギリスじん</td></tr>
    <tr><td>ドイツ</td><td>Doitsu</td><td>ドイツじん</td></tr>
    <tr><td>オーストラリア</td><td>Ōsutoraria</td><td>オーストラリアじん</td></tr>
    <tr><td>タイ</td><td>Tai</td><td>タイじん</td></tr>
  </tbody>
</table>
<div class="note-ct">Neighbouring countries with a kanji name (にほん, かんこく, ちゅうごく) are usually written in hiragana at this level, while Western/foreign countries are always katakana — see <a href="/courses/elementary-japanese-1-a11/learn">Lesson 2.1</a>.</div>
<h3>Common occupations</h3>
<div class="out">がくせい (student) · かいしゃいん (company employee) · きょうし / せんせい (teacher) · しゃいん (staff/employee) · いしゃ (doctor) · かんごし (nurse) · エンジニア (engineer) · デザイナー (designer) · しゅふ (homemaker) · こうむいん (civil servant)</div>
<h3>Asking politely — おくに &amp; おしごと</h3>
<div class="out"><b>Q:</b> おくには どちらですか。(Where are you from? — polite, lit. "your country is which way")<br>
<b>A:</b> ベトナムです。<br><br>
<b>Q:</b> おしごとは なんですか。(What is your job?)<br>
<b>A:</b> かいしゃいんです。</div>
<h3>Ví dụ có lời giải · Full self-introduction</h3>
<div class="out">はじめまして。わたしは アンです。ベトナムじんです。がくせいです。どうぞよろしく。<br>
= Nice to meet you. I am An. I am Vietnamese. I am a student. Pleased to meet you.</div>
<div class="pitfall"><b>Trap:</b> どちら (which way/direction) is the polite way to ask "where", not どこ, when asking about someone's home country to their face — どこ feels blunter. なん vs なに also matters here: おしごとは <b>なん</b>ですか (before です, always なん), never なにですか.</div>
<a class="link-card codelab" href="/language/ja/vocab?level=JPD113&categoryId=994&ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">🌍</span>
  <span class="lc-body"><span class="lc-title">Drill countries & languages</span><span class="lc-sub">JPD113 word list on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
<a class="link-card codelab" href="/language/ja/vocab?level=JPD113&categoryId=995&ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">🏫</span>
  <span class="lc-body"><span class="lc-title">Drill school & occupations</span><span class="lc-sub">JPD113 word list on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.3</span>
<h2>Quốc tịch &amp; nghề nghiệp</h2>
<p class="lead">Giờ đã có は/です/の/も/か, hãy lấp đầy vốn từ khiến phần tự giới thiệu trở nên thật: bạn từ đâu tới, và làm nghề gì. Đây là một trong những nhóm từ vựng dày đặc nhất trong đề thi thật.</p>
<h3>Nước & quốc tịch (X + 人 = người của X)</h3>
<table>
  <thead><tr><th>Nước</th><th>Đọc</th><th>Quốc tịch</th></tr></thead>
  <tbody>
    <tr><td>にほん (日本)</td><td>nihon</td><td>にほんじん</td></tr>
    <tr><td>ベトナム</td><td>Betonamu</td><td>ベトナムじん</td></tr>
    <tr><td>かんこく (韓国)</td><td>kankoku</td><td>かんこくじん</td></tr>
    <tr><td>ちゅうごく (中国)</td><td>chūgoku</td><td>ちゅうごくじん</td></tr>
    <tr><td>アメリカ</td><td>Amerika</td><td>アメリカじん</td></tr>
    <tr><td>フランス</td><td>Furansu</td><td>フランスじん</td></tr>
    <tr><td>イギリス</td><td>Igirisu</td><td>イギリスじん</td></tr>
    <tr><td>ドイツ</td><td>Doitsu</td><td>ドイツじん</td></tr>
    <tr><td>オーストラリア</td><td>Ōsutoraria</td><td>オーストラリアじん</td></tr>
    <tr><td>タイ</td><td>Tai</td><td>タイじん</td></tr>
  </tbody>
</table>
<div class="note-ct">Các nước láng giềng có tên chữ Hán (にほん, かんこく, ちゅうごく) ở trình độ này thường viết bằng hiragana, còn nước phương Tây/nước ngoài luôn viết katakana — xem <a href="/courses/elementary-japanese-1-a11/learn">Bài 2.1</a>.</div>
<h3>Nghề nghiệp thường gặp</h3>
<div class="out">がくせい (sinh viên) · かいしゃいん (nhân viên công ty) · きょうし / せんせい (giáo viên) · しゃいん (nhân viên) · いしゃ (bác sĩ) · かんごし (y tá) · エンジニア (kỹ sư) · デザイナー (nhà thiết kế) · しゅふ (nội trợ) · こうむいん (công chức)</div>
<h3>Hỏi lịch sự — おくに & おしごと</h3>
<div class="out"><b>Hỏi:</b> おくには どちらですか。(Bạn đến từ đâu? — lịch sự, nghĩa đen "nước của bạn là hướng nào")<br>
<b>Đáp:</b> ベトナムです。<br><br>
<b>Hỏi:</b> おしごとは なんですか。(Nghề của bạn là gì?)<br>
<b>Đáp:</b> かいしゃいんです。</div>
<h3>Ví dụ có lời giải · Tự giới thiệu đầy đủ</h3>
<div class="out">はじめまして。わたしは アンです。ベトナムじんです。がくせいです。どうぞよろしく。<br>
= Rất vui được gặp. Tôi là An. Tôi là người Việt Nam. Tôi là sinh viên. Mong được giúp đỡ.</div>
<div class="pitfall"><b>Bẫy:</b> どちら (hướng nào) là cách lịch sự để hỏi "ở đâu", không phải どこ, khi hỏi quốc gia trực tiếp trước mặt ai đó — どこ nghe cộc hơn. なん vs なに cũng quan trọng ở đây: おしごとは <b>なん</b>ですか (trước です, luôn là なん), không bao giờ なにですか.</div>
<a class="link-card codelab" href="/language/ja/vocab?level=JPD113&categoryId=994&ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">🌍</span>
  <span class="lc-body"><span class="lc-title">Luyện quốc gia & ngôn ngữ</span><span class="lc-sub">Bộ từ JPD113 trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
<a class="link-card codelab" href="/language/ja/vocab?level=JPD113&categoryId=995&ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">🏫</span>
  <span class="lc-body"><span class="lc-title">Luyện trường học & nghề nghiệp</span><span class="lc-sub">Bộ từ JPD113 trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
        {
          title: 'Grammar Summary — Chapter 4|||Tóm tắt ngữ pháp — Chương 4',
          slug: 'jpd113-nguphap-chuong4',
          type: 'VIDEO',
          description: 'Gom lại は/です/の/も/か và mẫu quốc tịch-nghề nghiệp thành một bộ khung tự giới thiệu hoàn chỉnh.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Grammar Summary</span>
<h2>Everything from Chapter 4, in one place</h2>
<p class="lead">Five small words — は, です, の, も, か — plus nationality/occupation vocabulary are ALL you need for a complete self-introduction. Here they are side by side.</p>
<table>
  <thead><tr><th>Particle/ending</th><th>Role</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td>は (wa)</td><td>marks the topic</td><td>わたしは アンです。</td></tr>
    <tr><td>です</td><td>polite "am/is/are", always sentence-final</td><td>がくせいです。</td></tr>
    <tr><td>の</td><td>possession/connection between two nouns</td><td>ベトナムの がくせい</td></tr>
    <tr><td>も</td><td>"also" — replaces は/が, never sits beside it</td><td>マイさんも がくせいです。</td></tr>
    <tr><td>か</td><td>turns a です-statement into a question, same word order</td><td>がくせいですか。</td></tr>
  </tbody>
</table>
<h3>The full self-introduction skeleton</h3>
<div class="out">はじめまして。わたしは[name]です。[country]じんです。[occupation]です。どうぞよろしく。<br>
Filled in: はじめまして。わたしはアンです。ベトナムじんです。がくせいです。どうぞよろしく。</div>
<h3>Ví dụ có lời giải · Asking &amp; confirming with か and も together</h3>
<div class="out"><b>Q:</b> アンさんは ベトナムの がくせいですか。 <b>A:</b> はい、そうです。マイさんも ベトナムの がくせいです。<br>
(Is An a Vietnamese student? Yes. Mai is also a Vietnamese student.)</div>
<div class="pitfall"><b>Common exam trap:</b> a blank right before ですか with no other particle nearby is filled by か itself or by も (if the sentence echoes a fact already stated about someone else) — always check the previous sentence's topic first.</div>
<a class="link-card codelab" href="/language/ja/grammar?level=JPD113&ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Review all Chapter 4 patterns</span><span class="lc-sub">Grammar reference on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
<a class="link-card codelab" href="/language/ja/vocab?level=JPD113&ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">Browse all Bài 1 vocabulary</span><span class="lc-sub">Full JPD113 word list on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Tóm tắt ngữ pháp</span>
<h2>Toàn bộ Chương 4, gom vào một chỗ</h2>
<p class="lead">Năm từ nhỏ — は, です, の, も, か — cộng từ vựng quốc tịch/nghề nghiệp là TẤT CẢ những gì bạn cần cho một câu tự giới thiệu hoàn chỉnh. Đây là chúng đặt cạnh nhau.</p>
<table>
  <thead><tr><th>Trợ từ/đuôi câu</th><th>Vai trò</th><th>Ví dụ</th></tr></thead>
  <tbody>
    <tr><td>は (wa)</td><td>đánh dấu chủ đề</td><td>わたしは アンです。</td></tr>
    <tr><td>です</td><td>"là/thì" lịch sự, luôn ở cuối câu</td><td>がくせいです。</td></tr>
    <tr><td>の</td><td>sở hữu/liên kết giữa hai danh từ</td><td>ベトナムの がくせい</td></tr>
    <tr><td>も</td><td>"cũng" — thay thế は/が, không đứng cạnh nó</td><td>マイさんも がくせいです。</td></tr>
    <tr><td>か</td><td>biến câu です thành câu hỏi, giữ nguyên trật tự từ</td><td>がくせいですか。</td></tr>
  </tbody>
</table>
<h3>Khung tự giới thiệu đầy đủ</h3>
<div class="out">はじめまして。わたしは[tên]です。[nước]じんです。[nghề]です。どうぞよろしく。<br>
Điền vào: はじめまして。わたしはアンです。ベトナムじんです。がくせいです。どうぞよろしく。</div>
<h3>Ví dụ có lời giải · Hỏi & xác nhận với か và も cùng nhau</h3>
<div class="out"><b>Hỏi:</b> アンさんは ベトナムの がくせいですか。 <b>Đáp:</b> はい、そうです。マイさんも ベトナムの がくせいです。<br>
(An có phải sinh viên Việt Nam không? Đúng vậy. Mai cũng là sinh viên Việt Nam.)</div>
<div class="pitfall"><b>Bẫy thi thường gặp:</b> chỗ trống ngay trước ですか mà không có trợ từ nào gần đó thì điền か hoặc も (nếu câu lặp lại việc đã nói về người khác) — luôn kiểm tra chủ đề câu trước.</div>
<a class="link-card codelab" href="/language/ja/grammar?level=JPD113&ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Ôn lại toàn bộ mẫu câu Chương 4</span><span class="lc-sub">Tra cứu ngữ pháp trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
<a class="link-card codelab" href="/language/ja/vocab?level=JPD113&ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">Xem toàn bộ từ vựng Bài 1</span><span class="lc-sub">Trọn bộ từ JPD113 trên My Language.</span></span>
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
<a class="link-card codelab" href="/language/ja/vocab?level=JPD113&categoryId=999&ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">❓</span>
  <span class="lc-body"><span class="lc-title">Bài 2-3 vocabulary: pointing & places</span><span class="lc-sub">JPD113 word list on My Language.</span></span>
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
<a class="link-card codelab" href="/language/ja/vocab?level=JPD113&categoryId=999&ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">❓</span>
  <span class="lc-body"><span class="lc-title">Từ vựng Bài 2-3: chỉ định & nơi chốn</span><span class="lc-sub">Bộ từ JPD113 trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
        {
          title: '5.2 — この/その/あの (before a noun)|||5.2 — この/その/あの (đứng trước danh từ)',
          slug: 'jpd113-kono-sono-ano',
          type: 'VIDEO',
          description: 'Dạng chỉ định ĐỨNG TRƯỚC danh từ, đối lập trực tiếp với これ/それ/あれ (đứng một mình) — bẫy lặp lại nhiều nhất trong đề thi thật.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>この/その/あの — the form that stands before a noun</h2>
<p class="lead">これ/それ/あれ (Lesson 5.1) stand <strong>alone</strong>, replacing a noun entirely. この/その/あの do the opposite job: they <strong>always sit directly in front of a noun</strong>, like "this ___" / "that ___" in English. Mixing the two up is the single most repeated trap across 420 real exam questions.</p>
<table>
  <thead><tr><th></th><th>Stands ALONE (= "this/that [thing]")</th><th>Before a NOUN (= "this/that ___")</th></tr></thead>
  <tbody>
    <tr><td>Near me</td><td>これ (kore)</td><td>この + noun (kono)</td></tr>
    <tr><td>Near you</td><td>それ (sore)</td><td>その + noun (sono)</td></tr>
    <tr><td>Far from both</td><td>あれ (are)</td><td>あの + noun (ano)</td></tr>
    <tr><td>Which?</td><td>どれ (dore)</td><td>どの + noun (dono)</td></tr>
  </tbody>
</table>
<div class="out"><b>Compare directly:</b><br>
これは ほんです。 = <b>This</b> is a book. (これ stands alone, no noun after it)<br>
<b>この</b> ほんは わたしのです。 = <b>This</b> book is mine. (この must be followed by ほん — never alone)<br><br>
それは だれのペンですか。 = Whose pen is that?<br>
<b>その</b>ペンは アンさんのです。 = <b>That</b> pen is An's.</div>
<div class="pitfall"><b>The rule that decides the answer on the exam:</b> look at what comes <em>right after</em> the blank. A bare noun right after → the answer must be この/その/あの/どの. A verb, particle, or nothing (end of clause) right after → the answer must be これ/それ/あれ/どれ. This single check resolves the vast majority of こ/そ/あ fill-in-the-blank questions.</div>
<h3>Ví dụ có lời giải</h3>
<div class="out"><b>Q:</b> ＿＿＿ かばんは わたしのです。(A bare noun かばん follows the blank → needs the adnominal form.)<br>
<b>A:</b> この (This bag is mine.)<br><br>
<b>Q:</b> ＿＿＿ は なんですか。(Nothing follows but は → needs the standalone pronoun.)<br>
<b>A:</b> これ (What is this?)</div>
<a class="link-card codelab" href="/language/ja/grammar?level=JPD113&ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Drill これ/それ/あれ vs この/その/あの</span><span class="lc-sub">Contrast drills on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
<a class="link-card codelab" href="/language/ja/vocab?level=JPD113&categoryId=999&ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">❓</span>
  <span class="lc-body"><span class="lc-title">Demonstrative & question-word vocab</span><span class="lc-sub">JPD113 word list on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>この/その/あの — dạng đứng TRƯỚC danh từ</h2>
<p class="lead">これ/それ/あれ (Bài 5.1) đứng <strong>một mình</strong>, thay thế hoàn toàn cho danh từ. この/その/あの làm việc ngược lại: chúng <strong>luôn đứng ngay trước một danh từ</strong>, giống "cái ___ này" / "cái ___ đó" trong tiếng Việt. Nhầm lẫn hai nhóm này là bẫy lặp lại nhiều nhất trong 420 câu đề thi thật.</p>
<table>
  <thead><tr><th></th><th>Đứng MỘT MÌNH (= "cái này/đó [vật]")</th><th>Đứng trước DANH TỪ (= "___ này/đó")</th></tr></thead>
  <tbody>
    <tr><td>Gần tôi</td><td>これ (kore)</td><td>この + danh từ (kono)</td></tr>
    <tr><td>Gần bạn</td><td>それ (sore)</td><td>その + danh từ (sono)</td></tr>
    <tr><td>Xa cả hai</td><td>あれ (are)</td><td>あの + danh từ (ano)</td></tr>
    <tr><td>Cái nào?</td><td>どれ (dore)</td><td>どの + danh từ (dono)</td></tr>
  </tbody>
</table>
<div class="out"><b>So sánh trực tiếp:</b><br>
これは ほんです。 = <b>Cái này</b> là sách. (これ đứng một mình, không có danh từ theo sau)<br>
<b>この</b> ほんは わたしのです。 = Quyển sách <b>này</b> là của tôi. (この phải theo sau bởi ほん — không bao giờ đứng một mình)<br><br>
それは だれのペンですか。 = Đó là bút của ai?<br>
<b>その</b>ペンは アンさんのです。 = Cây bút <b>đó</b> là của An.</div>
<div class="pitfall"><b>Quy tắc quyết định đáp án khi thi:</b> nhìn vào phần <em>ngay sau</em> chỗ trống. Có danh từ trần ngay sau → đáp án PHẢI là この/その/あの/どの. Có động từ, trợ từ, hoặc không có gì (hết mệnh đề) ngay sau → đáp án PHẢI là これ/それ/あれ/どれ. Chỉ một phép kiểm tra này giải quyết phần lớn câu điền chỗ trống dạng こ/そ/あ.</div>
<h3>Ví dụ có lời giải</h3>
<div class="out"><b>Hỏi:</b> ＿＿＿ かばんは わたしのです。(Danh từ trần かばん theo sau chỗ trống → cần dạng chỉ định trước danh từ.)<br>
<b>Đáp:</b> この (Cái cặp này là của tôi.)<br><br>
<b>Hỏi:</b> ＿＿＿ は なんですか。(Không có gì theo sau ngoài は → cần đại từ đứng một mình.)<br>
<b>Đáp:</b> これ (Cái này là gì?)</div>
<a class="link-card codelab" href="/language/ja/grammar?level=JPD113&ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Luyện これ/それ/あれ vs この/その/あの</span><span class="lc-sub">Bài tập đối chiếu trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
<a class="link-card codelab" href="/language/ja/vocab?level=JPD113&categoryId=999&ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">❓</span>
  <span class="lc-body"><span class="lc-title">Từ vựng chỉ định & từ hỏi</span><span class="lc-sub">Bộ từ JPD113 trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
        {
          title: '5.3 — Question words: なに/だれ/どこ/いつ/なん/どちら|||5.3 — Từ để hỏi: なに/だれ/どこ/いつ/なん/どちら',
          slug: 'jpd113-tu-de-hoi',
          type: 'VIDEO',
          description: '6 từ để hỏi cốt lõi, kèm mẹo "đọc câu trả lời trước, suy ngược ra từ hỏi" — kỹ thuật làm bài thi thật.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.3</span>
<h2>The 6 core question words</h2>
<p class="lead">These six words appear in almost every dialogue on the exam. Learn each one with its typical answer shape — that pairing is what lets you solve fill-in-the-blank questions fast.</p>
<table>
  <thead><tr><th>Word</th><th>Meaning</th><th>Typical answer</th></tr></thead>
  <tbody>
    <tr><td>なに / なん (何)</td><td>what</td><td>a thing/name: ほんです、がくせいです</td></tr>
    <tr><td>だれ (誰)</td><td>who</td><td>a person: アンさんです</td></tr>
    <tr><td>どこ</td><td>where</td><td>a place: がっこうです、ここです</td></tr>
    <tr><td>いつ</td><td>when</td><td>a time: あした、8月4日です</td></tr>
    <tr><td>どちら</td><td>which way / where (polite)</td><td>a place or direction, politely: ベトナムです</td></tr>
  </tbody>
</table>
<div class="note-ct">何 is read <b>なに</b> when standing alone or before で/を/が (何ですか), but <b>なん</b> right before です/だ or a counter/particle starting with な・だ・と (何ですか is actually なんですか — memorise this exception; 何時 なんじ, 何人 なんにん, 何曜日 なんようび).</div>
<h3>Working backward from the answer</h3>
<div class="out"><b>Q:</b> ＿＿＿ですか。 <b>A:</b> アンさんです。 → the answer is a person's name, so the question word must be <b>だれ</b>: だれですか。<br>
<b>Q:</b> ＿＿＿ですか。 <b>A:</b> 火曜日です。 → the answer is a day, so: 何曜日ですか。<br>
<b>Q:</b> ＿＿＿ですか。 <b>A:</b> がっこうです。 → the answer is a place: どこですか。</div>
<div class="pitfall"><b>Exam technique:</b> when a fill-in-the-blank gives you the <em>answer sentence</em> but blanks the question word, always read the answer FIRST — its category (person/place/time/thing) tells you exactly which question word fits. Guessing the question word before reading the answer wastes time.</div>
<h3>Ví dụ có lời giải</h3>
<div class="out"><b>Q:</b> おくには どちらですか。 <b>A:</b> タイです。 (Where are you from? — Thailand.)<br>
<b>Q:</b> たんじょうびは いつですか。 <b>A:</b> 3月です。 (When is your birthday? — March.)</div>
<a class="link-card codelab" href="/language/ja/grammar?level=JPD113&ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">❓</span>
  <span class="lc-body"><span class="lc-title">Drill the 6 question words</span><span class="lc-sub">Pattern practice on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
<a class="link-card codelab" href="/language/ja/vocab?level=JPD113&categoryId=999&ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">❓</span>
  <span class="lc-body"><span class="lc-title">Question-word vocab</span><span class="lc-sub">JPD113 word list on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.3</span>
<h2>6 từ để hỏi cốt lõi</h2>
<p class="lead">Sáu từ này xuất hiện trong gần như mọi đoạn hội thoại trong đề thi. Học từng từ kèm hình dạng câu trả lời điển hình — sự ghép cặp đó giúp bạn giải câu điền chỗ trống nhanh.</p>
<table>
  <thead><tr><th>Từ</th><th>Nghĩa</th><th>Trả lời điển hình</th></tr></thead>
  <tbody>
    <tr><td>なに / なん (何)</td><td>cái gì</td><td>một vật/tên: ほんです、がくせいです</td></tr>
    <tr><td>だれ (誰)</td><td>ai</td><td>một người: アンさんです</td></tr>
    <tr><td>どこ</td><td>ở đâu</td><td>một nơi: がっこうです、ここです</td></tr>
    <tr><td>いつ</td><td>khi nào</td><td>một mốc thời gian: あした、8月4日です</td></tr>
    <tr><td>どちら</td><td>hướng nào / ở đâu (lịch sự)</td><td>nơi hoặc hướng, lịch sự: ベトナムです</td></tr>
  </tbody>
</table>
<div class="note-ct">何 đọc là <b>なに</b> khi đứng một mình hoặc trước で/を/が (何ですか), nhưng đọc <b>なん</b> ngay trước です/だ hoặc trợ số từ/trợ từ bắt đầu bằng な・だ・と (何ですか thực ra là なんですか — học thuộc ngoại lệ này; 何時 なんじ, 何人 なんにん, 何曜日 なんようび).</div>
<h3>Suy ngược từ câu trả lời</h3>
<div class="out"><b>Hỏi:</b> ＿＿＿ですか。 <b>Đáp:</b> アンさんです。 → câu trả lời là tên người, nên từ hỏi phải là <b>だれ</b>: だれですか。<br>
<b>Hỏi:</b> ＿＿＿ですか。 <b>Đáp:</b> 火曜日です。 → câu trả lời là thứ trong tuần, nên: 何曜日ですか。<br>
<b>Hỏi:</b> ＿＿＿ですか。 <b>Đáp:</b> がっこうです。 → câu trả lời là nơi chốn: どこですか。</div>
<div class="pitfall"><b>Kỹ thuật làm bài thi:</b> khi câu điền chỗ trống cho bạn <em>câu trả lời</em> nhưng bỏ trống từ hỏi, LUÔN đọc câu trả lời TRƯỚC — loại của nó (người/nơi/thời gian/vật) cho bạn biết chính xác từ hỏi nào phù hợp. Đoán từ hỏi trước khi đọc câu trả lời là phí thời gian.</div>
<h3>Ví dụ có lời giải</h3>
<div class="out"><b>Hỏi:</b> おくには どちらですか。 <b>Đáp:</b> タイです。 (Bạn đến từ đâu? — Thái Lan.)<br>
<b>Hỏi:</b> たんじょうびは いつですか。 <b>Đáp:</b> 3月です。 (Sinh nhật bạn khi nào? — Tháng 3.)</div>
<a class="link-card codelab" href="/language/ja/grammar?level=JPD113&ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">❓</span>
  <span class="lc-body"><span class="lc-title">Luyện 6 từ để hỏi</span><span class="lc-sub">Luyện mẫu câu trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
<a class="link-card codelab" href="/language/ja/vocab?level=JPD113&categoryId=999&ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">❓</span>
  <span class="lc-body"><span class="lc-title">Từ vựng từ hỏi</span><span class="lc-sub">Bộ từ JPD113 trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
        {
          title: '5.4 — Particles を/に/で/へ|||5.4 — Trợ từ を/に/で/へ',
          slug: 'jpd113-tro-tu-wo-ni-de-e',
          type: 'VIDEO',
          description: 'Đối tượng (を), thời điểm/điểm đến (に), phương tiện-địa điểm hành động (で), hướng đi (へ) — nền tảng bắt buộc trước chương động từ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.4</span>
<h2>Four particles that unlock every verb sentence</h2>
<p class="lead">You already have は/の/も/が. These four particles mark the pieces of an action sentence — object, time/destination, place of action, and direction. You will use all four constantly once you start conjugating verbs in the next chapter.</p>
<table>
  <thead><tr><th>Particle</th><th>Marks</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td>を (o)</td><td>the direct object — the thing acted on</td><td>パン<b>を</b> たべます。(eat bread)</td></tr>
    <tr><td>に (ni)</td><td>a specific point in time, or a destination point</td><td>7時<b>に</b> おきます。(get up at 7); がっこう<b>に</b> いきます。(go to school)</td></tr>
    <tr><td>で (de)</td><td>the place where an action happens, or the means/tool</td><td>としょかん<b>で</b> べんきょうします。(study at the library); バス<b>で</b> いきます。(go by bus)</td></tr>
    <tr><td>へ (e)</td><td>direction of movement (read "e", written へ)</td><td>にほん<b>へ</b> いきます。(go to/toward Japan)</td></tr>
  </tbody>
</table>
<div class="note-ct">に and へ can both mark a destination with いきます/きます (がっこうに行きます = がっこうへ行きます), but only に marks a clock time (7時に) — へ never does. で never marks a destination, only the place an action happens or the tool used.</div>
<div class="pitfall"><b>Trap:</b> を is written with the hiragana を but pronounced "o" (identical sound to お) — it exists ONLY as this object particle, never as a normal syllable in a word. If you see を in a sentence, it is always marking the object right before it.</div>
<h3>Ví dụ có lời giải</h3>
<div class="out"><b>Q:</b> まいにち としょかん＿べんきょうします。(Which particle — place of action)<br>
<b>A:</b> で (としょかんで べんきょうします — study at the library every day.)<br><br>
<b>Q:</b> あさ7時＿おきます。(Which particle — specific clock time)<br>
<b>A:</b> に (7時に おきます — get up at 7 o'clock.)</div>
<a class="link-card codelab" href="/language/ja/grammar?level=JPD113&ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Drill を/に/で/へ</span><span class="lc-sub">Particle-choice practice on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
<a class="link-card codelab" href="/language/ja/vocab?level=JPD113&categoryId=1000&ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">🏢</span>
  <span class="lc-body"><span class="lc-title">Places & shopping vocab</span><span class="lc-sub">JPD113 word list on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.4</span>
<h2>Bốn trợ từ mở khoá mọi câu có động từ</h2>
<p class="lead">Bạn đã có は/の/も/が. Bốn trợ từ này đánh dấu các thành phần của câu hành động — đối tượng, thời điểm/điểm đến, nơi hành động diễn ra, và hướng đi. Bạn sẽ dùng cả bốn liên tục ngay khi bắt đầu chia động từ ở chương sau.</p>
<table>
  <thead><tr><th>Trợ từ</th><th>Đánh dấu</th><th>Ví dụ</th></tr></thead>
  <tbody>
    <tr><td>を (o)</td><td>tân ngữ trực tiếp — vật bị tác động</td><td>パン<b>を</b> たべます。(ăn bánh mì)</td></tr>
    <tr><td>に (ni)</td><td>mốc thời gian cụ thể, hoặc điểm đến</td><td>7時<b>に</b> おきます。(dậy lúc 7 giờ); がっこう<b>に</b> いきます。(đi đến trường)</td></tr>
    <tr><td>で (de)</td><td>nơi hành động diễn ra, hoặc phương tiện/công cụ</td><td>としょかん<b>で</b> べんきょうします。(học ở thư viện); バス<b>で</b> いきます。(đi bằng xe buýt)</td></tr>
    <tr><td>へ (e)</td><td>hướng di chuyển (đọc "e", viết へ)</td><td>にほん<b>へ</b> いきます。(đi về hướng/đến Nhật)</td></tr>
  </tbody>
</table>
<div class="note-ct">に và へ đều có thể đánh dấu điểm đến với いきます/きます (がっこうに行きます = がっこうへ行きます), nhưng chỉ に đánh dấu giờ đồng hồ (7時に) — へ không bao giờ làm việc này. で không bao giờ đánh dấu điểm đến, chỉ đánh dấu nơi hành động diễn ra hoặc công cụ dùng.</div>
<div class="pitfall"><b>Bẫy:</b> を viết bằng hiragana を nhưng đọc "o" (âm giống hệt お) — nó chỉ tồn tại như trợ từ tân ngữ này, không bao giờ là âm tiết bình thường trong một từ. Nếu thấy を trong câu, nó luôn đánh dấu tân ngữ ngay trước nó.</div>
<h3>Ví dụ có lời giải</h3>
<div class="out"><b>Hỏi:</b> まいにち としょかん＿べんきょうします。(Trợ từ nào — nơi hành động)<br>
<b>Đáp:</b> で (としょかんで べんきょうします — học ở thư viện mỗi ngày.)<br><br>
<b>Hỏi:</b> あさ7時＿おきます。(Trợ từ nào — giờ cụ thể)<br>
<b>Đáp:</b> に (7時に おきます — dậy lúc 7 giờ.)</div>
<a class="link-card codelab" href="/language/ja/grammar?level=JPD113&ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Luyện を/に/で/へ</span><span class="lc-sub">Bài tập chọn trợ từ trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
<a class="link-card codelab" href="/language/ja/vocab?level=JPD113&categoryId=1000&ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">🏢</span>
  <span class="lc-body"><span class="lc-title">Từ vựng nơi chốn & mua sắm</span><span class="lc-sub">Bộ từ JPD113 trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
        {
          title: 'Grammar Summary — Chapter 5|||Tóm tắt ngữ pháp — Chương 5',
          slug: 'jpd113-nguphap-chuong5',
          type: 'VIDEO',
          description: 'Gom lại これ/それ/あれ, この/その/あの, 6 từ để hỏi, và を/に/で/へ — nhóm ngữ pháp bị test nhiều nhất đề thi thật.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Grammar Summary</span>
<h2>Everything from Chapter 5, in one place</h2>
<p class="lead">Chapter 5 is the densest grammar chapter before verbs — four separate systems that are frequently confused with each other on the real exam. Seeing them together, side by side, is the fastest way to stop mixing them up.</p>
<table>
  <thead><tr><th>System</th><th>Members</th><th>Rule of thumb</th></tr></thead>
  <tbody>
    <tr><td>Standalone demonstratives</td><td>これ/それ/あれ/どれ</td><td>Stand ALONE, replace a noun entirely</td></tr>
    <tr><td>Adnominal demonstratives</td><td>この/その/あの/どの</td><td>ALWAYS sit right before a noun, never alone</td></tr>
    <tr><td>Place demonstratives</td><td>ここ/そこ/あそこ/どこ</td><td>"here/there/over there/where"</td></tr>
    <tr><td>Existence verbs</td><td>あります (inanimate) / います (animate)</td><td>Choose by whether the subject is alive</td></tr>
    <tr><td>Question words</td><td>なに・なん/だれ/どこ/いつ/どちら</td><td>Read the ANSWER first, then match its category</td></tr>
    <tr><td>Action-sentence particles</td><td>を(object)/に(time,destination)/で(place,means)/へ(direction)</td><td>Each marks a different sentence role</td></tr>
  </tbody>
</table>
<h3>The single most important contrast: これ vs この</h3>
<div class="out">これは ほんです。(standalone — nothing follows) ／ この ほんは わたしのです。(adnominal — ほん follows immediately)<br>
<b>Rule:</b> bare noun right after the blank → この/その/あの/どの. Nothing (or a particle/verb) right after → これ/それ/あれ/どれ.</div>
<h3>Ví dụ có lời giải · Combining everything from this chapter</h3>
<div class="out">この かばんは だれのですか。 (Whose bag is this?)<br>
それは アンさんの かばんです。あそこに あります。 (That is An's bag. It is over there.)<br>
アンさんは としょかんで べんきょうしますか。 (Does An study at the library?) — はい、7時に がっこうへ いきます。それから としょかんで べんきょうします。</div>
<a class="link-card codelab" href="/language/ja/grammar?level=JPD113&ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Review all Chapter 5 patterns</span><span class="lc-sub">Grammar reference on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
<a class="link-card codelab" href="/language/ja/vocab?level=JPD113&ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">Browse all Bài 2-3 vocabulary</span><span class="lc-sub">Full JPD113 word list on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Tóm tắt ngữ pháp</span>
<h2>Toàn bộ Chương 5, gom vào một chỗ</h2>
<p class="lead">Chương 5 là chương ngữ pháp dày đặc nhất trước khi vào động từ — bốn hệ thống riêng biệt thường bị nhầm lẫn với nhau trong đề thi thật. Nhìn chúng cạnh nhau là cách nhanh nhất để hết nhầm.</p>
<table>
  <thead><tr><th>Hệ thống</th><th>Thành viên</th><th>Quy tắc ghi nhớ</th></tr></thead>
  <tbody>
    <tr><td>Chỉ định đứng một mình</td><td>これ/それ/あれ/どれ</td><td>Đứng MỘT MÌNH, thay thế hoàn toàn danh từ</td></tr>
    <tr><td>Chỉ định trước danh từ</td><td>この/その/あの/どの</td><td>LUÔN đứng ngay trước danh từ, không bao giờ một mình</td></tr>
    <tr><td>Chỉ định nơi chốn</td><td>ここ/そこ/あそこ/どこ</td><td>"ở đây/ở đó/đằng kia/ở đâu"</td></tr>
    <tr><td>Động từ tồn tại</td><td>あります (vô tri) / います (hữu sinh)</td><td>Chọn theo chủ thể có sống hay không</td></tr>
    <tr><td>Từ để hỏi</td><td>なに・なん/だれ/どこ/いつ/どちら</td><td>Đọc CÂU TRẢ LỜI trước, rồi khớp loại của nó</td></tr>
    <tr><td>Trợ từ câu hành động</td><td>を(tân ngữ)/に(thời gian,điểm đến)/で(nơi,phương tiện)/へ(hướng)</td><td>Mỗi trợ từ đánh dấu một vai trò khác nhau trong câu</td></tr>
  </tbody>
</table>
<h3>Đối lập quan trọng nhất: これ vs この</h3>
<div class="out">これは ほんです。(một mình — không có gì theo sau) ／ この ほんは わたしのです。(trước danh từ — ほん theo ngay sau)<br>
<b>Quy tắc:</b> danh từ trần ngay sau chỗ trống → この/その/あの/どの. Không có gì (hoặc trợ từ/động từ) ngay sau → これ/それ/あれ/どれ.</div>
<h3>Ví dụ có lời giải · Kết hợp mọi thứ trong chương này</h3>
<div class="out">この かばんは だれのですか。 (Cái cặp này của ai?)<br>
それは アンさんの かばんです。あそこに あります。 (Đó là cặp của An. Nó ở đằng kia.)<br>
アンさんは としょかんで べんきょうしますか。 (An có học ở thư viện không?) — はい、7時に がっこうへ いきます。それから としょかんで べんきょうします。</div>
<a class="link-card codelab" href="/language/ja/grammar?level=JPD113&ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Ôn lại toàn bộ mẫu câu Chương 5</span><span class="lc-sub">Tra cứu ngữ pháp trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
<a class="link-card codelab" href="/language/ja/vocab?level=JPD113&ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">Xem toàn bộ từ vựng Bài 2-3</span><span class="lc-sub">Trọn bộ từ JPD113 trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 6 — ĐỘNG TỪ ます-FORM ══════════════════ */
    {
      title: 'Chapter 6 — Verbs: the ます-form|||Chương 6 — Động từ: thể ます',
      description: 'Mảng ngữ pháp lớn nhất bị test trong đề thi thật nhưng chưa từng có bài riêng — động từ lịch sự khẳng định/phủ định và cách ghép trợ từ đúng.',
      lessons: [
        {
          title: '6.1 — The polite ます-form: affirmative & negative|||6.1 — Thể lịch sự ます: khẳng định & phủ định',
          slug: 'jpd113-masu-form',
          type: 'VIDEO',
          description: 'ます (làm)/ません (không làm), động từ nhóm 3 します/きます, và cách học động từ như từ vựng ở trình độ này.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Verbs: the polite ます-form</h2>
<p class="lead">Every sentence you have built so far used です (to be). Now come <strong>action verbs</strong> — the single largest grammar area on the real exam, yet the syllabus never gave it its own lesson. At A1.1 level, treat each ます-form as a vocabulary item to memorise whole, the same way you memorised です sentences — the deeper conjugation rules (group 1/2/3 stems) come later at N5/N4.</p>
<h3>Affirmative &amp; negative</h3>
<table>
  <thead><tr><th></th><th>Affirmative</th><th>Negative</th></tr></thead>
  <tbody>
    <tr><td>Pattern</td><td>verb stem + <b>ます</b></td><td>verb stem + <b>ません</b></td></tr>
    <tr><td>go</td><td>いきます (ikimasu)</td><td>いきません (ikimasen)</td></tr>
    <tr><td>eat</td><td>たべます (tabemasu)</td><td>たべません (tabemasen)</td></tr>
    <tr><td>do</td><td>します (shimasu)</td><td>しません (shimasen)</td></tr>
    <tr><td>come</td><td>きます (kimasu)</td><td>きません (kimasen)</td></tr>
  </tbody>
</table>
<div class="note-ct">します and きます are the two irregular "group 3" verbs — you will meet them constantly because they combine with nouns to build new verbs: べんきょう<b>します</b> (study), うんてん<b>します</b> (drive). Any noun + します = "to do [noun]".</div>
<h3>Present tense = future too</h3>
<div class="out">The ます-form covers BOTH habitual present and future — there is no separate future tense: まいにち べんきょうします。(I study every day.) / あした べんきょうします。(I will study tomorrow.)</div>
<h3>Ví dụ có lời giải</h3>
<div class="out"><b>Q:</b> あさごはんを たべますか。(Do you eat breakfast?)<br>
<b>A (yes):</b> はい、たべます。 <b>A (no):</b> いいえ、たべません。<br><br>
<b>Q:</b> にほんごを べんきょうしますか。(Do you study Japanese?)<br>
<b>A:</b> はい、べんきょうします。</div>
<div class="pitfall"><b>Trap:</b> か still works exactly as in Lesson 4.2 — just add it to a ます-form sentence to make a question, no word-order change. Don't confuse ません (verb negative) with じゃないです (です negative, Lesson 4.2) — they attach to different word types.</div>
<a class="link-card codelab" href="/language/ja/grammar?level=JPD113&ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Drill ます/ません</span><span class="lc-sub">Verb pattern practice on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Động từ: thể lịch sự ます</h2>
<p class="lead">Mọi câu bạn xây từ đầu tới giờ đều dùng です (là/thì). Giờ đến <strong>động từ hành động</strong> — mảng ngữ pháp lớn nhất trong đề thi thật, nhưng syllabus chưa bao giờ dành riêng một bài. Ở trình độ A1.1, hãy coi mỗi động từ thể ます như một mục từ vựng học thuộc nguyên khối, giống cách bạn học câu です — quy tắc chia động từ sâu hơn (gốc động từ nhóm 1/2/3) sẽ học sau ở N5/N4.</p>
<h3>Khẳng định &amp; phủ định</h3>
<table>
  <thead><tr><th></th><th>Khẳng định</th><th>Phủ định</th></tr></thead>
  <tbody>
    <tr><td>Mẫu</td><td>gốc động từ + <b>ます</b></td><td>gốc động từ + <b>ません</b></td></tr>
    <tr><td>đi</td><td>いきます (ikimasu)</td><td>いきません (ikimasen)</td></tr>
    <tr><td>ăn</td><td>たべます (tabemasu)</td><td>たべません (tabemasen)</td></tr>
    <tr><td>làm</td><td>します (shimasu)</td><td>しません (shimasen)</td></tr>
    <tr><td>đến</td><td>きます (kimasu)</td><td>きません (kimasen)</td></tr>
  </tbody>
</table>
<div class="note-ct">します và きます là hai động từ bất quy tắc "nhóm 3" — bạn sẽ gặp liên tục vì chúng ghép với danh từ để tạo động từ mới: べんきょう<b>します</b> (học), うんてん<b>します</b> (lái xe). Danh từ bất kỳ + します = "làm [danh từ]".</div>
<h3>Hiện tại = cả tương lai</h3>
<div class="out">Thể ます phủ CẢ hiện tại thường xuyên lẫn tương lai — không có thì tương lai riêng: まいにち べんきょうします。(Tôi học mỗi ngày.) / あした べんきょうします。(Ngày mai tôi sẽ học.)</div>
<h3>Ví dụ có lời giải</h3>
<div class="out"><b>Hỏi:</b> あさごはんを たべますか。(Bạn có ăn sáng không?)<br>
<b>Đáp (có):</b> はい、たべます。 <b>Đáp (không):</b> いいえ、たべません。<br><br>
<b>Hỏi:</b> にほんごを べんきょうしますか。(Bạn có học tiếng Nhật không?)<br>
<b>Đáp:</b> はい、べんきょうします。</div>
<div class="pitfall"><b>Bẫy:</b> か vẫn hoạt động y hệt như Bài 4.2 — chỉ cần thêm vào câu thể ます để thành câu hỏi, không đổi trật tự từ. Đừng nhầm ません (phủ định động từ) với じゃないです (phủ định です, Bài 4.2) — chúng gắn vào loại từ khác nhau.</div>
<a class="link-card codelab" href="/language/ja/grammar?level=JPD113&ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Luyện ます/ません</span><span class="lc-sub">Bài tập mẫu động từ trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
        {
          title: '6.2 — Common verbs & the right particle|||6.2 — Động từ thường gặp & ghép đúng trợ từ',
          slug: 'jpd113-dong-tu-thuong-gap',
          type: 'VIDEO',
          description: 'Bảng tần suất thật từ 420 câu FE + cách ghép を/に/で/へ đúng với từng động từ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>The verbs that actually appear on the exam</h2>
<p class="lead">Counted across 420 real FE questions — this is exactly where to spend your memorisation time, ranked by frequency. Learn each verb <em>together with</em> its usual particle; that pairing is what the exam tests.</p>
<table>
  <thead><tr><th>Verb</th><th>Meaning</th><th>Usual particle pattern</th><th>Exam count</th></tr></thead>
  <tbody>
    <tr><td>いきます</td><td>go</td><td>[place]へ/に いきます</td><td>43</td></tr>
    <tr><td>たべます</td><td>eat</td><td>[food]を たべます</td><td>29</td></tr>
    <tr><td>かいます</td><td>buy</td><td>[thing]を かいます</td><td>23</td></tr>
    <tr><td>べんきょうします</td><td>study</td><td>[subject]を べんきょうします</td><td>18</td></tr>
    <tr><td>よみます</td><td>read</td><td>[thing]を よみます</td><td>14</td></tr>
    <tr><td>おきます</td><td>get up</td><td>[time]に おきます</td><td>13</td></tr>
    <tr><td>ききます</td><td>listen/ask</td><td>[thing]を ききます</td><td>12</td></tr>
    <tr><td>はたらきます</td><td>work</td><td>[place]で はたらきます</td><td>11</td></tr>
    <tr><td>のみます</td><td>drink</td><td>[thing]を のみます</td><td>10</td></tr>
    <tr><td>かえります</td><td>go home/return</td><td>[place]へ/に かえります</td><td>6</td></tr>
    <tr><td>みます / します / かります</td><td>watch / do / borrow</td><td>を みます・します・かります</td><td>less frequent, still worth knowing</td></tr>
  </tbody>
</table>
<h3>Ví dụ có lời giải · A daily-routine paragraph</h3>
<div class="out">まいあさ 7時に おきます。がっこうへ いきます。としょかんで べんきょうします。ひるごはんを たべます。うちへ かえります。<br>
= Every morning I get up at 7. I go to school. I study at the library. I eat lunch. I go home.</div>
<div class="callout"><span class="badge">★ Exam tip</span> Fill-in-the-blank particle questions almost always pair one of these verbs with the wrong particle as a distractor (e.g. がっこう<b>を</b> いきます instead of がっこう<b>へ</b> いきます). Memorise the verb+particle PAIR from the table above, not the verb alone.</div>
<a class="link-card codelab" href="/language/ja/vocab?ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">🎯</span>
  <span class="lc-body"><span class="lc-title">Drill verbs + particles together</span><span class="lc-sub">Ranked by real exam frequency, on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Những động từ THẬT SỰ xuất hiện trong đề thi</h2>
<p class="lead">Đếm được từ 420 câu FE thật — đây chính xác là nơi nên dành thời gian học thuộc, xếp theo tần suất. Học mỗi động từ <em>cùng với</em> trợ từ thường đi kèm — sự ghép cặp đó là thứ đề thi kiểm tra.</p>
<table>
  <thead><tr><th>Động từ</th><th>Nghĩa</th><th>Mẫu trợ từ thường dùng</th><th>Số lần trong đề</th></tr></thead>
  <tbody>
    <tr><td>いきます</td><td>đi</td><td>[nơi]へ/に いきます</td><td>43</td></tr>
    <tr><td>たべます</td><td>ăn</td><td>[món]を たべます</td><td>29</td></tr>
    <tr><td>かいます</td><td>mua</td><td>[vật]を かいます</td><td>23</td></tr>
    <tr><td>べんきょうします</td><td>học</td><td>[môn]を べんきょうします</td><td>18</td></tr>
    <tr><td>よみます</td><td>đọc</td><td>[vật]を よみます</td><td>14</td></tr>
    <tr><td>おきます</td><td>dậy</td><td>[giờ]に おきます</td><td>13</td></tr>
    <tr><td>ききます</td><td>nghe/hỏi</td><td>[vật]を ききます</td><td>12</td></tr>
    <tr><td>はたらきます</td><td>làm việc</td><td>[nơi]で はたらきます</td><td>11</td></tr>
    <tr><td>のみます</td><td>uống</td><td>[vật]を のみます</td><td>10</td></tr>
    <tr><td>かえります</td><td>về nhà/quay lại</td><td>[nơi]へ/に かえります</td><td>6</td></tr>
    <tr><td>みます / します / かります</td><td>xem / làm / mượn</td><td>を みます・します・かります</td><td>ít hơn, vẫn nên biết</td></tr>
  </tbody>
</table>
<h3>Ví dụ có lời giải · Đoạn văn sinh hoạt hằng ngày</h3>
<div class="out">まいあさ 7時に おきます。がっこうへ いきます。としょかんで べんきょうします。ひるごはんを たべます。うちへ かえります。<br>
= Mỗi sáng tôi dậy lúc 7 giờ. Tôi đi đến trường. Tôi học ở thư viện. Tôi ăn trưa. Tôi về nhà.</div>
<div class="callout"><span class="badge">★ Mẹo thi</span> Câu điền chỗ trống trợ từ gần như luôn ghép một trong các động từ này với trợ từ SAI làm phương án gây nhiễu (vd. がっこう<b>を</b> いきます thay vì がっこう<b>へ</b> いきます). Học thuộc CẶP động từ+trợ từ trong bảng trên, không học động từ riêng lẻ.</div>
<a class="link-card codelab" href="/language/ja/vocab?ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">🎯</span>
  <span class="lc-body"><span class="lc-title">Luyện động từ + trợ từ cùng nhau</span><span class="lc-sub">Xếp theo tần suất đề thi thật, trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
        {
          title: 'Quiz 3 — Verbs|||Quiz 3 — Động từ',
          slug: 'jpd113-quiz-dong-tu',
          type: 'QUIZ',
          description: 'Kiểm tra thể ます/ません và ghép trợ từ đúng với động từ.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'The negative of たべます (eat) is…|||Phủ định của たべます (ăn) là…', options: ['たべません', 'たべないです', 'たべじゃない', 'たべんです'], correctIndex: 0, points: 1 },
              { question: '"To study" as a します-compound is…|||"Học" ghép với します là…', options: ['べんきょうします', 'がくせいします', 'にほんごします', 'ほんします'], correctIndex: 0, points: 1 },
              { question: 'がっこう＿いきます (go TO school) needs…|||がっこう＿いきます (đi ĐẾN trường) cần…', options: ['を', 'へ hoặc に', 'で', 'が'], correctIndex: 1, points: 1 },
              { question: 'としょかん＿べんきょうします (study AT the library) needs…|||としょかん＿べんきょうします (học Ở thư viện) cần…', options: ['へ', 'を', 'で', 'と'], correctIndex: 2, points: 1 },
              { question: '7時＿おきます (get up AT 7:00) needs…|||7時＿おきます (dậy LÚC 7 giờ) cần…', options: ['で', 'へ', 'に', 'を'], correctIndex: 2, points: 1 },
              { question: 'ジュース＿のみます (drink juice) needs…|||ジュース＿のみます (uống nước ép) cần…', options: ['を', 'に', 'で', 'へ'], correctIndex: 0, points: 1 },
            ],
          },
        },
        {
          title: 'Grammar Summary — Chapter 6|||Tóm tắt ngữ pháp — Chương 6',
          slug: 'jpd113-nguphap-chuong6',
          type: 'VIDEO',
          description: 'Gom lại ます/ません, します/きます, và bảng động từ+trợ từ tần suất thật — bản đồ ôn thi nhanh nhất cho mảng lớn nhất của đề.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Grammar Summary</span>
<h2>Everything from Chapter 6, in one place</h2>
<p class="lead">Verbs are the single largest grammar area on the real exam. This page merges the ます/ません rule with the ranked verb+particle table so you can review both together.</p>
<table>
  <thead><tr><th>Rule</th><th>Shape</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td>Affirmative</td><td>verb stem + ます</td><td>たべます</td></tr>
    <tr><td>Negative</td><td>verb stem + ません</td><td>たべません</td></tr>
    <tr><td>Question</td><td>ます-form + か (no word-order change)</td><td>たべますか。</td></tr>
    <tr><td>Group 3 irregulars</td><td>します / きます; noun + します = "to do [noun]"</td><td>べんきょうします、うんてんします</td></tr>
    <tr><td>Present = future too</td><td>no separate future tense</td><td>まいにち／あした べんきょうします</td></tr>
  </tbody>
</table>
<h3>The ranked verb + particle table (memorise as pairs, not verbs alone)</h3>
<table>
  <thead><tr><th>Verb</th><th>Particle pair</th><th>Exam count</th></tr></thead>
  <tbody>
    <tr><td>いきます (go)</td><td>[place]へ/に</td><td>43</td></tr>
    <tr><td>たべます (eat)</td><td>[food]を</td><td>29</td></tr>
    <tr><td>かいます (buy)</td><td>[thing]を</td><td>23</td></tr>
    <tr><td>べんきょうします (study)</td><td>[subject]を</td><td>18</td></tr>
    <tr><td>よみます (read)</td><td>[thing]を</td><td>14</td></tr>
    <tr><td>おきます (get up)</td><td>[time]に</td><td>13</td></tr>
    <tr><td>ききます (listen/ask)</td><td>[thing]を</td><td>12</td></tr>
    <tr><td>はたらきます (work)</td><td>[place]で</td><td>11</td></tr>
    <tr><td>のみます (drink)</td><td>[thing]を</td><td>10</td></tr>
    <tr><td>かえります (go home)</td><td>[place]へ/に</td><td>6</td></tr>
  </tbody>
</table>
<h3>Ví dụ có lời giải · A complete daily-routine paragraph</h3>
<div class="out">まいあさ 7時に おきます。がっこうへ いきます。としょかんで べんきょうします。ひるごはんを たべます。うちへ かえります。にほんごを べんきょうしません — テレビを みます。<br>
= Every morning I get up at 7. I go to school. I study at the library. I eat lunch. I go home. I don't study Japanese — I watch TV.</div>
<a class="link-card codelab" href="/language/ja/grammar?level=JPD113&ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Review all Chapter 6 patterns</span><span class="lc-sub">Grammar reference on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Tóm tắt ngữ pháp</span>
<h2>Toàn bộ Chương 6, gom vào một chỗ</h2>
<p class="lead">Động từ là mảng ngữ pháp lớn nhất trong đề thi thật. Trang này gộp quy tắc ます/ません với bảng động từ+trợ từ xếp theo tần suất để bạn ôn cả hai cùng lúc.</p>
<table>
  <thead><tr><th>Quy tắc</th><th>Khuôn mẫu</th><th>Ví dụ</th></tr></thead>
  <tbody>
    <tr><td>Khẳng định</td><td>gốc động từ + ます</td><td>たべます</td></tr>
    <tr><td>Phủ định</td><td>gốc động từ + ません</td><td>たべません</td></tr>
    <tr><td>Câu hỏi</td><td>thể ます + か (không đổi trật tự từ)</td><td>たべますか。</td></tr>
    <tr><td>Bất quy tắc nhóm 3</td><td>します / きます; danh từ + します = "làm [danh từ]"</td><td>べんきょうします、うんてんします</td></tr>
    <tr><td>Hiện tại = cả tương lai</td><td>không có thì tương lai riêng</td><td>まいにち／あした べんきょうします</td></tr>
  </tbody>
</table>
<h3>Bảng động từ + trợ từ xếp theo tần suất (học thuộc theo CẶP, không học động từ riêng)</h3>
<table>
  <thead><tr><th>Động từ</th><th>Cặp trợ từ</th><th>Số lần trong đề</th></tr></thead>
  <tbody>
    <tr><td>いきます (đi)</td><td>[nơi]へ/に</td><td>43</td></tr>
    <tr><td>たべます (ăn)</td><td>[món]を</td><td>29</td></tr>
    <tr><td>かいます (mua)</td><td>[vật]を</td><td>23</td></tr>
    <tr><td>べんきょうします (học)</td><td>[môn]を</td><td>18</td></tr>
    <tr><td>よみます (đọc)</td><td>[vật]を</td><td>14</td></tr>
    <tr><td>おきます (dậy)</td><td>[giờ]に</td><td>13</td></tr>
    <tr><td>ききます (nghe/hỏi)</td><td>[vật]を</td><td>12</td></tr>
    <tr><td>はたらきます (làm việc)</td><td>[nơi]で</td><td>11</td></tr>
    <tr><td>のみます (uống)</td><td>[vật]を</td><td>10</td></tr>
    <tr><td>かえります (về nhà)</td><td>[nơi]へ/に</td><td>6</td></tr>
  </tbody>
</table>
<h3>Ví dụ có lời giải · Đoạn văn sinh hoạt hằng ngày đầy đủ</h3>
<div class="out">まいあさ 7時に おきます。がっこうへ いきます。としょかんで べんきょうします。ひるごはんを たべます。うちへ かえります。にほんごを べんきょうしません — テレビを みます。<br>
= Mỗi sáng tôi dậy lúc 7 giờ. Tôi đi đến trường. Tôi học ở thư viện. Tôi ăn trưa. Tôi về nhà. Tôi không học tiếng Nhật — tôi xem TV.</div>
<a class="link-card codelab" href="/language/ja/grammar?level=JPD113&ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Ôn lại toàn bộ mẫu câu Chương 6</span><span class="lc-sub">Tra cứu ngữ pháp trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 7 — KANJI & ĐỌC ══════════════════ */
    {
      title: 'Chapter 7 — Kanji & short reading|||Chương 7 — Kanji & đọc đoạn ngắn',
      description: '35 chữ Hán cơ bản (âm on/kun, bộ thủ) và đọc đoạn văn sơ cấp.',
      lessons: [
        {
          title: '7.1 — Your first kanji|||7.1 — Những chữ Hán đầu tiên',
          slug: 'jpd113-kanji',
          type: 'VIDEO',
          description: 'Kanji là gì, âm on/kun, số nét & bộ thủ; 5 chữ nền tảng (số, người, ngày, sách, học).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
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
<a class="link-card codelab" href="/language/ja/hanzi?level=JPD113&ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">🖌️</span>
  <span class="lc-body"><span class="lc-title">Practise kanji writing</span><span class="lc-sub">Animated stroke order &amp; SRS on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
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
<a class="link-card codelab" href="/language/ja/hanzi?level=JPD113&ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">🖌️</span>
  <span class="lc-body"><span class="lc-title">Luyện viết kanji</span><span class="lc-sub">Thứ tự nét động &amp; SRS trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
        {
          title: '7.2 — Number & time kanji|||7.2 — Kanji số & thời gian',
          slug: 'jpd113-kanji-so-thoi-gian',
          type: 'VIDEO',
          description: '四五六七八九十百千万 (số) + 時分間何 — nhóm kanji tần suất cao nhất trong đề thi thật, cùng 曜 đã học ở Bài 3.5.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>Number &amp; time kanji</h2>
<p class="lead">You already read 一二三 (Lesson 7.1). Complete the 1–10 set, add the big counting units, and learn the four kanji behind every time expression — together these cover the densest kanji cluster on the real exam.</p>
<h3>Completing 1–10 &amp; the big units</h3>
<table>
  <thead><tr><th>四</th><th>五</th><th>六</th><th>七</th><th>八</th><th>九</th><th>十</th><th>百</th><th>千</th><th>万</th></tr></thead>
  <tbody>
    <tr><td>four</td><td>five</td><td>six</td><td>seven</td><td>eight</td><td>nine</td><td>ten</td><td>hundred</td><td>thousand</td><td>ten-thousand</td></tr>
    <tr><td>し/よん</td><td>ご</td><td>ろく</td><td>しち/なな</td><td>はち</td><td>きゅう/く</td><td>じゅう</td><td>ひゃく</td><td>せん</td><td>まん</td></tr>
  </tbody>
</table>
<div class="note-ct">四, 七 and 九 each have TWO common readings, and the "correct" one depends on context (し・しち・く are the on-readings used for months, よん・なな・きゅう are usually used for standalone counting) — you already met this irregularity for months in Lesson 3.4 (4月=しがつ, 7月=しちがつ, 9月=くがつ).</div>
<h3>Time kanji — 時・分・間・何</h3>
<table>
  <thead><tr><th>Kanji</th><th>Meaning</th><th>Reading</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td>時</td><td>hour, o'clock</td><td>じ / とき</td><td>3時 = さんじ</td></tr>
    <tr><td>分</td><td>minute</td><td>ふん / ぷん</td><td>3分 = さんぷん</td></tr>
    <tr><td>間</td><td>interval, between</td><td>かん / あいだ</td><td>時間 = じかん (time, duration)</td></tr>
    <tr><td>何</td><td>what/how many</td><td>なに / なん</td><td>何時 = なんじ (what time)</td></tr>
  </tbody>
</table>
<div class="callout"><span class="badge">★ Exam frequency</span> Among 420 real FE questions: <b>時 appears 66 times</b> (2nd most frequent kanji overall) and <b>何 appears 57 times</b> — both nearly always inside a compound like 何時/何曜日/何歳/何人. Recognising 何+[counter] as a single question-chunk is faster than reading kanji-by-kanji.</div>
<h3>Already-met kanji from Lesson 3.5</h3>
<div class="out">月・火・水・木・金・土・日 + 曜 (the seven day-of-week kanji plus 曜) were already introduced in Lesson 3.5 as whole words — you can now recognise each one individually: 月=moon/month, 火=fire, 水=water, 木=wood, 金=gold/money, 土=earth, 日=sun/day.</div>
<h3>Ví dụ có lời giải</h3>
<div class="out"><b>Q:</b> 一週間は何日ですか。(How many days in a week?)<br>
<b>A:</b> 七日です。(Seven days.)<br><br>
<b>Q:</b> 今、何時何分ですか。(What time is it right now?)<br>
<b>A:</b> 九時十五分です。(9:15.)</div>
<a class="link-card codelab" href="/language/ja/hanzi?level=JPD113&ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">🖌️</span>
  <span class="lc-body"><span class="lc-title">Practise number & time kanji</span><span class="lc-sub">Stroke order & SRS on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>Kanji số & thời gian</h2>
<p class="lead">Bạn đã đọc được 一二三 (Bài 7.1). Hoàn thiện bộ 1–10, thêm các đơn vị đếm lớn, và học 4 kanji đứng sau mọi cách diễn đạt thời gian — cùng nhau chúng là cụm kanji dày đặc nhất trong đề thi thật.</p>
<h3>Hoàn thiện 1–10 & đơn vị lớn</h3>
<table>
  <thead><tr><th>四</th><th>五</th><th>六</th><th>七</th><th>八</th><th>九</th><th>十</th><th>百</th><th>千</th><th>万</th></tr></thead>
  <tbody>
    <tr><td>bốn</td><td>năm</td><td>sáu</td><td>bảy</td><td>tám</td><td>chín</td><td>mười</td><td>trăm</td><td>nghìn</td><td>vạn (10.000)</td></tr>
    <tr><td>し/よん</td><td>ご</td><td>ろく</td><td>しち/なな</td><td>はち</td><td>きゅう/く</td><td>じゅう</td><td>ひゃく</td><td>せん</td><td>まん</td></tr>
  </tbody>
</table>
<div class="note-ct">四, 七, 九 mỗi chữ có HAI cách đọc phổ biến, và cách đọc "đúng" phụ thuộc ngữ cảnh (し・しち・く là âm on dùng cho tháng, よん・なな・きゅう thường dùng khi đếm độc lập) — bạn đã gặp bất quy tắc này với tháng ở Bài 3.4 (4月=しがつ, 7月=しちがつ, 9月=くがつ).</div>
<h3>Kanji thời gian — 時・分・間・何</h3>
<table>
  <thead><tr><th>Kanji</th><th>Nghĩa</th><th>Cách đọc</th><th>Ví dụ</th></tr></thead>
  <tbody>
    <tr><td>時</td><td>giờ</td><td>じ / とき</td><td>3時 = さんじ</td></tr>
    <tr><td>分</td><td>phút</td><td>ふん / ぷん</td><td>3分 = さんぷん</td></tr>
    <tr><td>間</td><td>khoảng, giữa</td><td>かん / あいだ</td><td>時間 = じかん (thời gian, khoảng thời gian)</td></tr>
    <tr><td>何</td><td>gì/bao nhiêu</td><td>なに / なん</td><td>何時 = なんじ (mấy giờ)</td></tr>
  </tbody>
</table>
<div class="callout"><span class="badge">★ Tần suất trong đề thi</span> Trong 420 câu FE thật: <b>時 xuất hiện 66 lần</b> (kanji nhiều thứ 2 toàn đề) và <b>何 xuất hiện 57 lần</b> — gần như luôn nằm trong cụm như 何時/何曜日/何歳/何人. Nhận diện 何+[trợ số từ] như MỘT cụm hỏi duy nhất nhanh hơn đọc từng kanji riêng lẻ.</div>
<h3>Kanji đã gặp ở Bài 3.5</h3>
<div class="out">月・火・水・木・金・土・日 + 曜 (bảy kanji ngày trong tuần cộng 曜) đã được giới thiệu ở Bài 3.5 dưới dạng từ trọn vẹn — giờ bạn có thể nhận ra từng chữ riêng lẻ: 月=mặt trăng/tháng, 火=lửa, 水=nước, 木=gỗ/cây, 金=vàng/tiền, 土=đất, 日=mặt trời/ngày.</div>
<h3>Ví dụ có lời giải</h3>
<div class="out"><b>Hỏi:</b> 一週間は何日ですか。(Một tuần có mấy ngày?)<br>
<b>Đáp:</b> 七日です。(Bảy ngày.)<br><br>
<b>Hỏi:</b> 今、何時何分ですか。(Bây giờ là mấy giờ mấy phút?)<br>
<b>Đáp:</b> 九時十五分です。(9 giờ 15 phút.)</div>
<a class="link-card codelab" href="/language/ja/hanzi?level=JPD113&ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">🖌️</span>
  <span class="lc-body"><span class="lc-title">Luyện kanji số & thời gian</span><span class="lc-sub">Thứ tự nét & SRS trên My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
`,
        },
        {
          title: '7.3 — People, school & everyday life kanji|||7.3 — Kanji người, trường học & đời sống',
          slug: 'jpd113-kanji-nguoi-truong-hoc',
          type: 'VIDEO',
          description: '私生校語先食円才 + 田中誕字性 — nhóm kanji cuối để đạt ~35 chữ, ưu tiên đúng theo tần suất thật.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.3</span>
<h2>People, school &amp; everyday life kanji</h2>
<p class="lead">The last group completes your ~35-kanji target for A1.1 — chosen strictly by how often they actually appear on real exam papers, not by textbook tradition.</p>
<table>
  <thead><tr><th>Kanji</th><th>Meaning</th><th>Reading</th><th>Example</th><th>Exam count</th></tr></thead>
  <tbody>
    <tr><td>私</td><td>I, me</td><td>わたし</td><td>私は学生です。</td><td>86 (#1 overall!)</td></tr>
    <tr><td>生</td><td>life, birth, raw</td><td>せい / なま / う-</td><td>学生 (student), 誕生日 (birthday)</td><td>38</td></tr>
    <tr><td>才</td><td>years old (age counter)</td><td>さい</td><td>18才 = じゅうはっさい</td><td>36</td></tr>
    <tr><td>円</td><td>yen, circle</td><td>えん</td><td>1000円</td><td>29</td></tr>
    <tr><td>語</td><td>language</td><td>ご</td><td>日本語 (Japanese), 英語 (English)</td><td>14</td></tr>
    <tr><td>校</td><td>school</td><td>こう</td><td>学校 (school)</td><td>13</td></tr>
    <tr><td>食</td><td>eat, food</td><td>しょく / た-</td><td>食べます (eat), 食堂 (canteen)</td><td>12</td></tr>
    <tr><td>間</td><td>(review, Lesson 7.2)</td><td>かん / あいだ</td><td>時間, 一週間</td><td>11</td></tr>
    <tr><td>田 / 中</td><td>rice field / middle, inside</td><td>た / ちゅう・なか</td><td>田中さん (surname Tanaka), 中国 (China)</td><td>5 each</td></tr>
    <tr><td>誕</td><td>birth</td><td>たん</td><td>誕生日 (たんじょうび, birthday)</td><td>4</td></tr>
    <tr><td>先</td><td>previous, ahead</td><td>せん</td><td>先生 (せんせい, teacher)</td><td>4</td></tr>
    <tr><td>字</td><td>character, letter</td><td>じ</td><td>漢字 (kanji), 名字 (surname)</td><td>4</td></tr>
    <tr><td>性</td><td>nature, gender</td><td>せい</td><td>男性 (male), 女性 (female)</td><td>4</td></tr>
  </tbody>
</table>
<div class="note-ct">先生 (せんせい) is built from 先 (ahead/before) + 生 (life) — "one born before you", i.e. teacher. This is a good example of how two kanji you already know combine into a brand-new meaning.</div>
<h3>Ví dụ có lời giải · A short self-introduction paragraph, in kanji</h3>
<div class="out">私は アンです。18才です。ベトナムの学生です。日本語学校で勉強します。誕生日は8月です。<br>
= I am An. I am 18 years old. I am a Vietnamese student. I study at a Japanese-language school. My birthday is in August.</div>
<div class="callout"><span class="badge">★ Exam frequency</span> 私 is the single MOST frequent kanji across all 420 real FE questions (86 times) — nearly every dialogue starts with 私は. If you learn only one kanji perfectly before the exam, make it this one.</div>
<div class="pitfall"><b>Watch:</b> 生 has three different readings depending on the compound — がくせい (student), たんじょうび uses 生 read しょう inside 誕生, and なまビール (draft beer) reads it なま. Always learn 生 <em>inside its compound word</em>, never alone.</div>
<a class="link-card codelab" href="/language/ja/hanzi?level=JPD113&ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">🖌️</span>
  <span class="lc-body"><span class="lc-title">Practise the final kanji set</span><span class="lc-sub">Stroke order & SRS on My Language.</span></span>
  <span class="lc-cta">MY LANGUAGE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.3</span>
<h2>Kanji người, trường học & đời sống</h2>
<p class="lead">Nhóm cuối hoàn thành mục tiêu ~35 kanji của A1.1 — chọn nghiêm ngặt theo tần suất xuất hiện thật trong đề thi, không theo truyền thống giáo trình.</p>
<table>
  <thead><tr><th>Kanji</th><th>Nghĩa</th><th>Cách đọc</th><th>Ví dụ</th><th>Số lần trong đề</th></tr></thead>
  <tbody>
    <tr><td>私</td><td>tôi</td><td>わたし</td><td>私は学生です。</td><td>86 (#1 toàn đề!)</td></tr>
    <tr><td>生</td><td>sự sống, sinh, sống/tươi</td><td>せい / なま / う-</td><td>学生 (sinh viên), 誕生日 (sinh nhật)</td><td>38</td></tr>
    <tr><td>才</td><td>tuổi (trợ số từ)</td><td>さい</td><td>18才 = じゅうはっさい</td><td>36</td></tr>
    <tr><td>円</td><td>yên (tiền), vòng tròn</td><td>えん</td><td>1000円</td><td>29</td></tr>
    <tr><td>語</td><td>ngôn ngữ</td><td>ご</td><td>日本語 (tiếng Nhật), 英語 (tiếng Anh)</td><td>14</td></tr>
    <tr><td>校</td><td>trường học</td><td>こう</td><td>学校 (trường học)</td><td>13</td></tr>
    <tr><td>食</td><td>ăn, thức ăn</td><td>しょく / た-</td><td>食べます (ăn), 食堂 (căng-tin)</td><td>12</td></tr>
    <tr><td>間</td><td>(ôn lại, Bài 7.2)</td><td>かん / あいだ</td><td>時間, 一週間</td><td>11</td></tr>
    <tr><td>田 / 中</td><td>ruộng / giữa, trong</td><td>た / ちゅう・なか</td><td>田中さん (họ Tanaka), 中国 (Trung Quốc)</td><td>5 mỗi chữ</td></tr>
    <tr><td>誕</td><td>sinh</td><td>たん</td><td>誕生日 (たんじょうび, sinh nhật)</td><td>4</td></tr>
    <tr><td>先</td><td>trước, phía trước</td><td>せん</td><td>先生 (せんせい, giáo viên)</td><td>4</td></tr>
    <tr><td>字</td><td>chữ, ký tự</td><td>じ</td><td>漢字 (kanji), 名字 (họ)</td><td>4</td></tr>
    <tr><td>性</td><td>bản chất, giới tính</td><td>せい</td><td>男性 (nam giới), 女性 (nữ giới)</td><td>4</td></tr>
  </tbody>
</table>
<div class="note-ct">先生 (せんせい) ghép từ 先 (trước) + 生 (sự sống) — "người sinh ra trước bạn", tức giáo viên. Đây là ví dụ tốt về cách hai kanji đã biết ghép thành một nghĩa hoàn toàn mới.</div>
<h3>Ví dụ có lời giải · Đoạn tự giới thiệu ngắn, bằng kanji</h3>
<div class="out">私は アンです。18才です。ベトナムの学生です。日本語学校で勉強します。誕生日は8月です。<br>
= Tôi là An. Tôi 18 tuổi. Tôi là sinh viên Việt Nam. Tôi học ở trường tiếng Nhật. Sinh nhật tôi vào tháng 8.</div>
<div class="callout"><span class="badge">★ Tần suất trong đề thi</span> 私 là kanji xuất hiện NHIỀU NHẤT trong toàn bộ 420 câu FE thật (86 lần) — gần như mọi đoạn hội thoại đều bắt đầu bằng 私は. Nếu chỉ học thuộc thật kỹ một kanji trước khi thi, hãy chọn chữ này.</div>
<div class="pitfall"><b>Chú ý:</b> 生 có ba cách đọc khác nhau tuỳ từ ghép — がくせい (sinh viên), たんじょうび dùng 生 đọc しょう trong 誕生, và なまビール (bia tươi) đọc là なま. Luôn học 生 <em>trong từ ghép của nó</em>, không bao giờ học lẻ.</div>
<a class="link-card codelab" href="/language/ja/hanzi?level=JPD113&ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese" target="_blank" rel="noopener">
  <span class="lc-ico">🖌️</span>
  <span class="lc-body"><span class="lc-title">Luyện bộ kanji cuối</span><span class="lc-sub">Thứ tự nét & SRS trên My Language.</span></span>
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
