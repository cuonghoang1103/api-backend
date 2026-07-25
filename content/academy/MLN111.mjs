/**
 * MLN111 — Philosophy of Marxism–Leninism / Triết học Mác–Lênin (Kỳ 8).
 * Môn lý luận chính trị (3 tín chỉ). KHÔNG code → Exp Hub (giáo trình + công cụ học), KHÔNG CodeLab.
 * 3 chương lớn: Triết học & vai trò → CNDV biện chứng (vật chất-ý thức, 2 nguyên lý/3 quy luật/6 cặp
 * phạm trù, lý luận nhận thức) → CNDV lịch sử (hình thái KT-XH, giai cấp/nhà nước, con người).
 * Chuẩn SWP391 gold: Mục 0 6 bài + chương bám giáo trình + chương ÔN THI + chương NÂNG CAO ★.
 * Song ngữ EN/VN đối xứng. Grading giống MLN122 (chuẩn FPT MLN series).
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/MLN111.mjs --apply
 */
export default {
  semester: { code: 'FPTU_Hola8', name: 'Kỳ 8', ordinal: 10 },
  course: {
    academyType: 'FPT',
    courseCode: 'MLN111',
    title: 'Philosophy of Marxism–Leninism',
    slug: 'philosophy-of-marxism-leninism',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'A thinking toolkit: dialectical & historical materialism — matter & consciousness, the laws of dialectics, theory of knowledge, and how societies change — with worked examples and modern links.|||Một bộ công cụ tư duy: chủ nghĩa duy vật biện chứng & lịch sử — vật chất & ý thức, các quy luật biện chứng, lý luận nhận thức, và cách xã hội vận động — kèm ví dụ giải và liên hệ hiện đại.',
    description: 'MLN111 (Triết học Mác–Lênin) là môn lý luận chính trị nền tảng, trang bị một THẾ GIỚI QUAN và PHƯƠNG PHÁP LUẬN khoa học. Không phải học thuộc những câu trừu tượng, mà học một cách TƯ DUY: nhìn sự vật trong mối liên hệ và vận động, tìm mâu thuẫn bên trong làm động lực phát triển, và phân biệt bản chất với hiện tượng. Môn học gồm ba phần: (1) Triết học và vai trò của nó — vấn đề cơ bản của triết học, chủ nghĩa duy vật vs duy tâm, biện chứng vs siêu hình, và sự ra đời của triết học Mác; (2) Chủ nghĩa duy vật biện chứng — vật chất & ý thức, phép biện chứng duy vật (2 nguyên lý, 3 quy luật, 6 cặp phạm trù), và lý luận nhận thức; (3) Chủ nghĩa duy vật lịch sử — hình thái kinh tế-xã hội, giai cấp & nhà nước, ý thức xã hội, và con người. Xuyên suốt, khóa học kèm VÍ DỤ GIẢI áp dụng từng quy luật vào tình huống thật, và liên hệ ★ ngoài giáo trình với khoa học, công nghệ và đời sống hiện đại.',
    whatYouLearn: 'Vấn đề cơ bản của triết học và hai trường phái lớn (duy vật vs duy tâm); phương pháp biện chứng vs siêu hình; định nghĩa vật chất của Lênin và mối quan hệ vật chất – ý thức; hai nguyên lý của phép biện chứng (mối liên hệ phổ biến, sự phát triển); ba quy luật cơ bản (lượng đổi – chất đổi, thống nhất & đấu tranh của các mặt đối lập, phủ định của phủ định); sáu cặp phạm trù (cái riêng – cái chung, nguyên nhân – kết quả, tất nhiên – ngẫu nhiên, nội dung – hình thức, bản chất – hiện tượng, khả năng – hiện thực); lý luận nhận thức (thực tiễn & nhận thức, chân lý); chủ nghĩa duy vật lịch sử (hình thái kinh tế-xã hội, lực lượng sản xuất – quan hệ sản xuất, cơ sở hạ tầng – kiến trúc thượng tầng, giai cấp, nhà nước, cách mạng, ý thức xã hội, con người); và kỹ năng vận dụng phương pháp luận biện chứng để phân tích các vấn đề thực tiễn.',
    requirements: 'Không có môn tiên quyết. Cần: giáo trình Triết học Mác–Lênin (hệ không chuyên), tinh thần đọc – suy ngẫm – liên hệ, và một công cụ vẽ sơ đồ tư duy để hệ thống hóa các quy luật & phạm trù (nhiều và dễ nhầm).',
    documentsNote: 'Tài liệu chính: Giáo trình Triết học Mác–Lênin (Bộ GD&ĐT, hệ không chuyên lý luận chính trị) • Ph. Ăngghen: Biện chứng của tự nhiên; Chống Đuyrinh • V.I. Lênin: Chủ nghĩa duy vật và chủ nghĩa kinh nghiệm phê phán; Bút ký triết học • C. Mác: Luận cương về Phoiơbắc. Công cụ học & PDF → Exp Hub. Đây là môn lý luận nền tảng — vừa học vừa vận dụng phương pháp tư duy biện chứng vào thực tiễn.',
  },
  sections: [
    /* ══════════════════ MỤC 0 — GIỚI THIỆU & HƯỚNG DẪN ══════════════════ */
    {
      title: 'Section 0 — Introduction & Study Guide|||Mục 0 — Giới thiệu & Hướng dẫn học',
      description: 'Đọc trước tiên: môn học là gì, bản đồ 3 phần, thang điểm, CLO, công cụ, ngân hàng đề tài assignment và cách không trượt / ăn điểm cao.',
      lessons: [
        {
          title: '0.1 — What this subject is & why it matters|||0.1 — Môn học là gì & vì sao quan trọng',
          slug: 'mln111-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Bức tranh toàn cảnh: triết học Mác-Lênin là một cách TƯ DUY, và bản đồ 3 phần lớn.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>Not facts to memorize — a way of thinking</h2>
<p class="lead">Marxist–Leninist philosophy isn't a list of quotes to recite. It's a <strong>worldview and a method</strong>: a way to see things in their connections and motion, to find the internal contradiction that drives change, and to tell essence from appearance. Master the method and you reason better about <em>everything</em> — science, society, technology, your own decisions.</p>
<p>The course has three parts, building from "how to think" up to "how societies change".</p>

<h3>The 3-part map</h3>
<div class="lz-map">
  <div class="lz-stage">Foundations</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Philosophy &amp; its role</div><div class="lz-nsub">the basic question · materialism vs idealism · dialectics vs metaphysics · the birth of Marxist philosophy</div></div></div>
  <div class="lz-stage">Dialectical materialism</div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Matter &amp; consciousness</div><div class="lz-nsub">Lenin's definition of matter · how consciousness relates to matter</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">The dialectic: 2 principles, 3 laws, 6 categories</div><div class="lz-nsub">the engine of the whole method</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Theory of knowledge</div><div class="lz-nsub">practice · cognition · truth</div></div></div>
  <div class="lz-stage">Historical materialism</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">How societies work &amp; change</div><div class="lz-nsub">socio-economic formation · class &amp; state · consciousness · the human being</div></div></div>
  <div class="lz-stage">Exam prep &amp; beyond ★</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Question bank + applying dialectics today</div><div class="lz-nsub">science · technology · AI · daily life</div></div></div>
</div>

<div class="callout ok"><strong>How to actually enjoy it:</strong> for every law, ask "what real change does this explain?" — apply "quantity into quality" to learning a skill, "contradiction" to a real conflict, "negation of negation" to how technology evolves. Examiners reward <em>understanding + application</em>, and it makes abstract theory click.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Why a tech student studies philosophy.</b> Dialectical thinking — seeing systems, contradictions and change over time — is exactly how good engineers and scientists reason about complex, evolving systems. The method here is a general-purpose thinking tool, not just political theory. <em>This framing is beyond the syllabus but is why the subject is more useful than it first appears.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Không phải sự kiện để học thuộc — một cách tư duy</h2>
<p class="lead">Triết học Mác–Lênin không phải một danh sách câu trích để đọc vẹt. Nó là một <strong>thế giới quan và một phương pháp</strong>: cách nhìn sự vật trong mối liên hệ và vận động, tìm mâu thuẫn bên trong làm động lực của sự thay đổi, và phân biệt bản chất với hiện tượng. Làm chủ phương pháp thì bạn lý giải tốt hơn <em>mọi thứ</em> — khoa học, xã hội, công nghệ, cả quyết định của chính bạn.</p>
<p>Môn học có ba phần, xây từ "cách tư duy" lên tới "cách xã hội vận động".</p>

<h3>Bản đồ 3 phần</h3>
<div class="lz-map">
  <div class="lz-stage">Nền tảng</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Triết học &amp; vai trò của nó</div><div class="lz-nsub">vấn đề cơ bản · duy vật vs duy tâm · biện chứng vs siêu hình · sự ra đời triết học Mác</div></div></div>
  <div class="lz-stage">Chủ nghĩa duy vật biện chứng</div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Vật chất &amp; ý thức</div><div class="lz-nsub">định nghĩa vật chất của Lênin · quan hệ vật chất – ý thức</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Phép biện chứng: 2 nguyên lý, 3 quy luật, 6 cặp phạm trù</div><div class="lz-nsub">động cơ của cả phương pháp</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Lý luận nhận thức</div><div class="lz-nsub">thực tiễn · nhận thức · chân lý</div></div></div>
  <div class="lz-stage">Chủ nghĩa duy vật lịch sử</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Xã hội vận hành &amp; thay đổi thế nào</div><div class="lz-nsub">hình thái KT-XH · giai cấp &amp; nhà nước · ý thức · con người</div></div></div>
  <div class="lz-stage">Ôn thi &amp; ngoài giáo trình ★</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Ngân hàng câu hỏi + vận dụng biện chứng hôm nay</div><div class="lz-nsub">khoa học · công nghệ · AI · đời sống</div></div></div>
</div>

<div class="callout ok"><strong>Cách thực sự thấy hay:</strong> với mỗi quy luật, hãy hỏi "cái này giải thích sự thay đổi thật nào?" — áp "lượng đổi thành chất" vào học một kỹ năng, "mâu thuẫn" vào một xung đột thật, "phủ định của phủ định" vào cách công nghệ tiến hóa. Giám khảo thưởng cho <em>sự hiểu + vận dụng</em>, và điều đó khiến lý thuyết trừu tượng "sáng" ra.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Vì sao sinh viên tech học triết.</b> Tư duy biện chứng — nhìn hệ thống, mâu thuẫn và sự thay đổi theo thời gian — chính là cách kỹ sư và nhà khoa học giỏi lý giải các hệ thống phức tạp, đang tiến hóa. Phương pháp ở đây là một công cụ tư duy đa dụng, không chỉ là lý thuyết chính trị. <em>Góc nhìn này ngoài syllabus nhưng là lý do môn học hữu ích hơn vẻ ngoài của nó.</em></div>
</div>`,
        },
        {
          title: '0.2 — How you are graded|||0.2 — Cách tính điểm',
          slug: 'mln111-thang-diem',
          type: 'article',
          description: 'Bảng thang điểm: Participation 10% + Progress test 20% + Assignment 40% + Final exam 30%, và điều kiện qua môn.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>The grade breakdown</h2>
<p class="lead">MLN111 follows the FPT political-theory grading pattern: ongoing work (70%) plus a final exam (30%). The largest single piece is the <strong>Assignment (40%)</strong>, so researching and writing it well largely decides your grade.</p>
<table>
<thead><tr><th>Component</th><th>Weight</th><th>Form</th></tr></thead>
<tbody>
<tr><td>Participation</td><td><strong>10%</strong></td><td>Attendance, in-class discussion</td></tr>
<tr><td>Progress test</td><td><strong>20%</strong></td><td>1 test</td></tr>
<tr><td>Assignment</td><td><strong>40%</strong></td><td>Essay/report (instructor's chosen form)</td></tr>
<tr><td>Final exam</td><td><strong>30%</strong></td><td>Written exam</td></tr>
</tbody>
</table>
<div class="kv-grid">
<div class="kv"><span class="k">Scale</span><span class="v">10</span></div>
<div class="kv"><span class="k">Pass</span><span class="v">Final result ≥ 5 AND final exam ≥ 4</span></div>
<div class="kv"><span class="k">Attendance</span><span class="v">≥ 80% of class hours</span></div>
<div class="kv"><span class="k">Biggest lever</span><span class="v">Assignment 40%</span></div>
</div>
<div class="callout warn"><strong>Two gates, not one.</strong> You need final result ≥ 5 <em>and</em> final exam ≥ 4. A great assignment can't fully rescue a failed exam — clear both bars. Don't neglect exam prep even with an excellent assignment.</div>
<div class="pitfall"><strong>Attendance is a hard gate.</strong> Below 80% you may be barred from assessment. Track it from week 1.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The assignment rewards application over recitation.</b> A report that <em>applies</em> a dialectical law to a real case (a technology's evolution, a social change) scores far higher than one restating the textbook. Analyze, don't copy. <em>Beyond the syllabus, but the difference between a 6 and a 9 on the 40% assignment.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Cấu trúc điểm</h2>
<p class="lead">MLN111 theo khuôn chấm môn lý luận chính trị của FPT: phần thường xuyên (70%) cộng thi cuối kỳ (30%). Phần lớn nhất là <strong>Assignment (40%)</strong>, nên nghiên cứu và viết tốt quyết định phần lớn điểm.</p>
<table>
<thead><tr><th>Thành phần</th><th>Trọng số</th><th>Hình thức</th></tr></thead>
<tbody>
<tr><td>Tham gia (Participation)</td><td><strong>10%</strong></td><td>Điểm danh, thảo luận trên lớp</td></tr>
<tr><td>Kiểm tra tiến độ (Progress test)</td><td><strong>20%</strong></td><td>1 bài</td></tr>
<tr><td>Assignment</td><td><strong>40%</strong></td><td>Tiểu luận/báo cáo (theo hình thức giảng viên chọn)</td></tr>
<tr><td>Thi cuối kỳ</td><td><strong>30%</strong></td><td>Thi viết</td></tr>
</tbody>
</table>
<div class="kv-grid">
<div class="kv"><span class="k">Thang</span><span class="v">10</span></div>
<div class="kv"><span class="k">Qua môn</span><span class="v">Kết quả ≥ 5 VÀ thi cuối ≥ 4</span></div>
<div class="kv"><span class="k">Điểm danh</span><span class="v">≥ 80% giờ học</span></div>
<div class="kv"><span class="k">Đòn bẩy lớn nhất</span><span class="v">Assignment 40%</span></div>
</div>
<div class="callout warn"><strong>Hai cổng, không phải một.</strong> Bạn cần kết quả ≥ 5 <em>và</em> thi cuối ≥ 4. Một assignment tốt không cứu được hoàn toàn bài thi trượt — vượt cả hai ngưỡng. Đừng lơ ôn thi dù assignment xuất sắc.</div>
<div class="pitfall"><strong>Điểm danh là cổng cứng.</strong> Dưới 80% có thể bị cấm thi/đánh giá. Theo dõi từ tuần 1.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Assignment thưởng vận dụng hơn đọc vẹt.</b> Một báo cáo <em>vận dụng</em> một quy luật biện chứng vào ca thật (sự tiến hóa của một công nghệ, một biến đổi xã hội) điểm cao hơn nhiều so với chép giáo trình. Phân tích, đừng chép. <em>Ngoài syllabus, nhưng là khác biệt giữa điểm 6 và điểm 9 ở assignment 40%.</em></div>
</div>`,
        },
        {
          title: '0.3 — Course learning outcomes (CLOs)|||0.3 — Chuẩn đầu ra môn học (CLO)',
          slug: 'mln111-clo',
          type: 'article',
          description: 'Các CLO của MLN111 nhóm theo phần — dùng để tự soi trước khi thi/nộp.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>The CLOs — what you must be able to do</h2>
<p class="lead">MLN111's outcomes map to the three parts plus thinking skills. Use them as a self-check before each assessment.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">CLO1</span> Grasp the object, basic question and role of philosophy; the birth of Marxist philosophy. <em>→ Part 1</em></div>
<div class="lz-layer"><span class="lz-lk">CLO2</span> Understand matter, consciousness and their relationship. <em>→ Part 2</em></div>
<div class="lz-layer"><span class="lz-lk">CLO3</span> Master the dialectic: 2 principles, 3 laws, 6 categories, and apply them. <em>→ Part 2</em></div>
<div class="lz-layer"><span class="lz-lk">CLO4</span> Understand the theory of knowledge (practice, cognition, truth). <em>→ Part 2</em></div>
<div class="lz-layer"><span class="lz-lk">CLO5</span> Grasp historical materialism: formations, class, state, consciousness, human. <em>→ Part 3</em></div>
<div class="lz-layer"><span class="lz-lk">CLO6</span> Form a scientific worldview & dialectical method; apply to real problems. <em>→ all</em></div>
<div class="lz-layer"><span class="lz-lk">CLO7</span> Skills: reasoning, essay writing, presentation, responsible AI use. <em>→ assignment</em></div>
</div>
<div class="callout ok">The arc: <strong>how to think (foundations) → the dialectical method → how we know → how society changes</strong>. The exam tests CLO1-5; the assignment tests CLO6-7 (applying the method).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Các CLO — bạn phải làm được gì</h2>
<p class="lead">Chuẩn đầu ra MLN111 ánh xạ tới ba phần cộng kỹ năng tư duy. Dùng để tự soi trước mỗi đánh giá.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">CLO1</span> Nắm đối tượng, vấn đề cơ bản và vai trò của triết học; sự ra đời triết học Mác. <em>→ Phần 1</em></div>
<div class="lz-layer"><span class="lz-lk">CLO2</span> Hiểu vật chất, ý thức và quan hệ giữa chúng. <em>→ Phần 2</em></div>
<div class="lz-layer"><span class="lz-lk">CLO3</span> Nắm phép biện chứng: 2 nguyên lý, 3 quy luật, 6 cặp phạm trù, và vận dụng. <em>→ Phần 2</em></div>
<div class="lz-layer"><span class="lz-lk">CLO4</span> Hiểu lý luận nhận thức (thực tiễn, nhận thức, chân lý). <em>→ Phần 2</em></div>
<div class="lz-layer"><span class="lz-lk">CLO5</span> Nắm chủ nghĩa duy vật lịch sử: hình thái, giai cấp, nhà nước, ý thức, con người. <em>→ Phần 3</em></div>
<div class="lz-layer"><span class="lz-lk">CLO6</span> Hình thành thế giới quan khoa học & phương pháp biện chứng; vận dụng vào vấn đề thực. <em>→ tất cả</em></div>
<div class="lz-layer"><span class="lz-lk">CLO7</span> Kỹ năng: lập luận, viết luận, thuyết trình, dùng AI có trách nhiệm. <em>→ assignment</em></div>
</div>
<div class="callout ok">Mạch: <strong>cách tư duy (nền tảng) → phương pháp biện chứng → cách ta nhận thức → cách xã hội thay đổi</strong>. Thi kiểm CLO1-5; assignment kiểm CLO6-7 (vận dụng phương pháp).</div>
</div>`,
        },
        {
          title: '0.4 — Tools & study setup (Exp Hub)|||0.4 — Công cụ & cách học (Exp Hub)',
          slug: 'mln111-cong-cu',
          type: 'article',
          description: 'Bộ công cụ học môn triết: giáo trình PDF, sơ đồ tư duy (nhiều quy luật/phạm trù), flashcard, AI có đạo đức.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>How to study a concept-dense subject</h2>
<p class="lead">MLN111 has many laws and categories that are easy to confuse. The winning tools are the textbook, heavy mind-mapping, flashcards, and responsible AI to test your understanding — never to write your assignment.</p>
<ul>
<li><strong>The official textbook (PDF)</strong> — the source of truth for exam answers.</li>
<li><strong>Mind-mapping</strong> (XMind / draw.io) — essential here: draw the 2 principles → 3 laws → 6 categories as one tree.</li>
<li><strong>Flashcards</strong> (Anki / Quizlet) — for definitions and the confusing law/category pairs.</li>
<li><strong>AI, used responsibly</strong> — to explain or quiz yourself; CLO7 requires ethical AI use.</li>
</ul>
<a class="link-card exphub" href="/exp-hub/mln111-cong-cu-hoc?ref=%2Fcourses%2Fphilosophy-of-marxism-leninism%2Flearn&reflabel=MLN111%200.4" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Study guide: textbook, mind-maps & responsible AI</span><span class="lc-sub">Where to get the textbook, how to map the laws & categories, flashcards, and ethical AI study.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Teach it to pass it (Feynman).</b> If you can explain "quantity into quality" or "negation of negation" in plain words with your own example, you understand it. If you can only recite the definition, you don't. Explaining exposes the gap. <em>A learning method beyond the syllabus that works especially well for abstract theory.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Cách học một môn dày khái niệm</h2>
<p class="lead">MLN111 có nhiều quy luật và phạm trù dễ nhầm. Công cụ thắng là giáo trình, sơ đồ tư duy dày, flashcard, và AI dùng có trách nhiệm để kiểm tra sự hiểu — không bao giờ để viết hộ assignment.</p>
<ul>
<li><strong>Giáo trình chính thức (PDF)</strong> — nguồn sự thật cho đáp án thi.</li>
<li><strong>Sơ đồ tư duy</strong> (XMind / draw.io) — thiết yếu ở đây: vẽ 2 nguyên lý → 3 quy luật → 6 cặp phạm trù thành một cây.</li>
<li><strong>Flashcard</strong> (Anki / Quizlet) — cho định nghĩa và các cặp quy luật/phạm trù dễ nhầm.</li>
<li><strong>AI, dùng có trách nhiệm</strong> — để giải thích hoặc tự kiểm tra; CLO7 yêu cầu dùng AI có đạo đức.</li>
</ul>
<a class="link-card exphub" href="/exp-hub/mln111-cong-cu-hoc?ref=%2Fcourses%2Fphilosophy-of-marxism-leninism%2Flearn&reflabel=MLN111%200.4" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Guide học: giáo trình, sơ đồ tư duy & AI có trách nhiệm</span><span class="lc-sub">Lấy giáo trình ở đâu, cách vẽ sơ đồ quy luật & phạm trù, flashcard, và học với AI có đạo đức.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Dạy lại để hiểu (Feynman).</b> Nếu bạn giải thích được "lượng đổi thành chất" hay "phủ định của phủ định" bằng lời đơn giản với ví dụ của chính mình, bạn hiểu nó. Nếu chỉ đọc được định nghĩa, bạn chưa hiểu. Giải thích phơi bày lỗ hổng. <em>Một phương pháp học ngoài syllabus đặc biệt hiệu quả với lý thuyết trừu tượng.</em></div>
</div>`,
        },
        {
          title: '0.5 — Assignment topic bank (12) + how to pick|||0.5 — Ngân hàng đề tài Assignment (12) + cách chọn',
          slug: 'mln111-ngan-hang-de-tai',
          type: 'article',
          description: '12 đề tài assignment đã kiểm scope (vận dụng quy luật biện chứng vào thực tiễn) + rubric chọn & viết.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.5</span>
<h2>12 assignment topics — apply the method to reality</h2>
<p class="lead">The 40% assignment rewards <em>applying a philosophical principle to a real case</em>, not a textbook summary. Here are 12 pre-scoped topics that connect a course concept to something real. Pick one you can analyze with real examples.</p>
<table>
<thead><tr><th>#</th><th>Topic</th><th>Concept it applies</th></tr></thead>
<tbody>
<tr><td>1</td><td>"Quantity into quality" in learning a skill / study</td><td>Law of quantitative → qualitative change</td></tr>
<tr><td>2</td><td>Contradiction as the driver of a real conflict/technology</td><td>Law of unity & struggle of opposites</td></tr>
<tr><td>3</td><td>"Negation of negation" in how a technology evolves</td><td>Law of negation of the negation</td></tr>
<tr><td>4</td><td>Matter determines consciousness: a real example</td><td>Matter–consciousness relationship</td></tr>
<tr><td>5</td><td>Practice as the basis & criterion of truth</td><td>Theory of knowledge (practice)</td></tr>
<tr><td>6</td><td>Cause–effect vs necessity–chance in an event</td><td>Categories: cause-effect, necessity-chance</td></tr>
<tr><td>7</td><td>Essence vs appearance: not judging by surface</td><td>Category: essence-appearance</td></tr>
<tr><td>8</td><td>Productive forces vs relations of production today</td><td>Historical materialism (formation)</td></tr>
<tr><td>9</td><td>Social consciousness lagging/leading social being</td><td>Social being & social consciousness</td></tr>
<tr><td>10</td><td>The role of the masses vs the individual in history</td><td>Human & society (role of masses)</td></tr>
<tr><td>11</td><td>Dialectical vs metaphysical thinking in problem-solving</td><td>Dialectics vs metaphysics (method)</td></tr>
<tr><td>12</td><td>Applying dialectics to AI / the digital age ★</td><td>Method extended (Part 2 + modern)</td></tr>
</tbody>
</table>

<h3>The 4-test filter — pick a topic you can defend</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">1 · Concept-clear</span> Can you name which principle/law/category it applies?</div>
<div class="lz-layer"><span class="lz-lk">2 · Example-rich</span> Can you find a concrete real case to analyze?</div>
<div class="lz-layer"><span class="lz-lk">3 · Analyzable</span> Does it let you <em>apply the method</em>, not just describe?</div>
<div class="lz-layer"><span class="lz-lk">4 · Right-sized</span> Narrow enough to go deep in the required length?</div>
</div>

<div class="callout ok"><strong>Essay skeleton that scores:</strong> (1) state the principle precisely → (2) present the real case → (3) analyze the case <em>through</em> the principle → (4) draw a practical/methodological lesson → (5) conclude with your own reasoned view. Principle + real case + your analysis = top marks.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The best essays make the abstract concrete.</b> "Learning React shows quantity→quality: 100 small practice reps suddenly click into fluency (the leap)" is far more memorable than restating the law. Grounding a 19th-century principle in your own 2025 experience proves genuine understanding. <em>Beyond the syllabus, but the move that lifts an assignment from correct to impressive.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.5</span>
<h2>12 đề tài assignment — vận dụng phương pháp vào thực tiễn</h2>
<p class="lead">Assignment 40% thưởng cho <em>vận dụng một nguyên lý triết học vào một ca thật</em>, không phải tóm tắt giáo trình. Đây là 12 đề tài đã kiểm scope nối một khái niệm của môn với một thứ thật. Chọn một đề bạn phân tích được bằng ví dụ thật.</p>
<table>
<thead><tr><th>#</th><th>Đề tài</th><th>Khái niệm vận dụng</th></tr></thead>
<tbody>
<tr><td>1</td><td>"Lượng đổi thành chất" trong học một kỹ năng / học tập</td><td>Quy luật lượng đổi → chất đổi</td></tr>
<tr><td>2</td><td>Mâu thuẫn là động lực của một xung đột/công nghệ thật</td><td>Quy luật thống nhất & đấu tranh của các mặt đối lập</td></tr>
<tr><td>3</td><td>"Phủ định của phủ định" trong sự tiến hóa một công nghệ</td><td>Quy luật phủ định của phủ định</td></tr>
<tr><td>4</td><td>Vật chất quyết định ý thức: một ví dụ thật</td><td>Quan hệ vật chất – ý thức</td></tr>
<tr><td>5</td><td>Thực tiễn là cơ sở & tiêu chuẩn của chân lý</td><td>Lý luận nhận thức (thực tiễn)</td></tr>
<tr><td>6</td><td>Nguyên nhân–kết quả vs tất nhiên–ngẫu nhiên trong một sự kiện</td><td>Cặp phạm trù: nhân-quả, tất nhiên-ngẫu nhiên</td></tr>
<tr><td>7</td><td>Bản chất vs hiện tượng: đừng đánh giá qua bề ngoài</td><td>Cặp phạm trù: bản chất-hiện tượng</td></tr>
<tr><td>8</td><td>Lực lượng sản xuất vs quan hệ sản xuất ngày nay</td><td>CNDV lịch sử (hình thái)</td></tr>
<tr><td>9</td><td>Ý thức xã hội đi sau/dẫn dắt tồn tại xã hội</td><td>Tồn tại xã hội & ý thức xã hội</td></tr>
<tr><td>10</td><td>Vai trò quần chúng vs cá nhân trong lịch sử</td><td>Con người & xã hội (vai trò quần chúng)</td></tr>
<tr><td>11</td><td>Tư duy biện chứng vs siêu hình trong giải quyết vấn đề</td><td>Biện chứng vs siêu hình (phương pháp)</td></tr>
<tr><td>12</td><td>Vận dụng biện chứng vào AI / thời đại số ★</td><td>Phương pháp mở rộng (Phần 2 + hiện đại)</td></tr>
</tbody>
</table>

<h3>Bộ lọc 4 phép thử — chọn đề bạn bảo vệ được</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">1 · Rõ khái niệm</span> Nêu được nó vận dụng nguyên lý/quy luật/phạm trù nào không?</div>
<div class="lz-layer"><span class="lz-lk">2 · Giàu ví dụ</span> Tìm được một ca thật cụ thể để phân tích không?</div>
<div class="lz-layer"><span class="lz-lk">3 · Phân tích được</span> Nó cho bạn <em>vận dụng phương pháp</em>, không chỉ mô tả, không?</div>
<div class="lz-layer"><span class="lz-lk">4 · Đúng cỡ</span> Đủ hẹp để đi sâu trong độ dài yêu cầu không?</div>
</div>

<div class="callout ok"><strong>Khung tiểu luận ăn điểm:</strong> (1) nêu nguyên lý chính xác → (2) trình bày ca thật → (3) phân tích ca <em>qua</em> nguyên lý → (4) rút một bài học thực tiễn/phương pháp → (5) kết luận bằng chính kiến có lập luận. Nguyên lý + ca thật + phân tích của bạn = điểm cao.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Tiểu luận hay nhất biến trừu tượng thành cụ thể.</b> "Học React cho thấy lượng→chất: 100 lần luyện nhỏ bỗng 'click' thành thành thạo (bước nhảy)" đáng nhớ hơn nhiều so với đọc lại quy luật. Đặt một nguyên lý thế kỷ 19 vào trải nghiệm 2025 của chính bạn chứng minh sự hiểu thật. <em>Ngoài syllabus, nhưng là nước đi nâng assignment từ đúng thành ấn tượng.</em></div>
</div>`,
        },
        {
          title: '0.6 — How not to fail & how to score high|||0.6 — Cách không trượt & cách ăn điểm cao',
          slug: 'mln111-chong-truot-diem-cao',
          type: 'article',
          description: '6 kiểu mất điểm ở môn triết + cách học/viết/thi để ăn điểm cao + cờ xanh cờ đỏ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.6</span>
<h2>6 ways students lose points — and how to avoid each</h2>
<p class="lead">Philosophy subjects fail students who memorize without understanding or confuse the many laws/categories. Here are the classic point-losers and their fixes.</p>
<table>
<thead><tr><th>#</th><th>How you lose points</th><th>The fix</th></tr></thead>
<tbody>
<tr><td>1</td><td>Reciting laws without understanding meaning</td><td>Explain each with your own real example</td></tr>
<tr><td>2</td><td>Confusing the 3 laws / 6 categories with each other</td><td>One mind-map + a comparison table for each pair</td></tr>
<tr><td>3</td><td>Assignment just restates the textbook</td><td>Apply a principle to a real, concrete case</td></tr>
<tr><td>4</td><td>Vague, unstructured essay</td><td>Use the 5-part skeleton (principle→case→analysis→lesson→view)</td></tr>
<tr><td>5</td><td>Ignoring exam prep (final gate ≥4)</td><td>Drill the question bank; know the 3 laws cold</td></tr>
<tr><td>6</td><td>Using AI to fabricate (violates CLO7)</td><td>Use AI to check understanding; write it yourself</td></tr>
</tbody>
</table>

<h3>Green flags / red flags</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Green</span> You can explain each of the 3 laws with your own example · you never confuse cause-effect with necessity-chance · your assignment applies a principle to a real case · you link method to real problems.</div>
<div class="lz-layer"><span class="lz-lk">Red</span> You only recite definitions · you mix up the laws · your essay copies the textbook · you skipped the dialectic (Part 2 core).</div>
</div>

<div class="callout ok"><strong>The high-mark formula.</strong> Grade = (understand, not just memorize) × (never confuse the laws/categories) × (apply the method to real cases) × (pass the exam gate). Nail all four and the abstract becomes genuinely useful.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Connect the dialectic to today.</b> The most impressive answers link a law to a modern reality: quantity→quality to a viral tipping point, contradiction to an open-source-vs-proprietary tension, negation-of-negation to how AI models supersede each other. Examiners remember the student who made the dialectic feel alive. <em>Beyond the syllabus, but the move that turns a memorized answer into a memorable one.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.6</span>
<h2>6 kiểu sinh viên mất điểm — và cách tránh từng cái</h2>
<p class="lead">Môn triết đánh trượt sinh viên học thuộc mà không hiểu hoặc nhầm lẫn nhiều quy luật/phạm trù. Đây là các thủ phạm kinh điển và cách sửa.</p>
<table>
<thead><tr><th>#</th><th>Cách bạn mất điểm</th><th>Cách sửa</th></tr></thead>
<tbody>
<tr><td>1</td><td>Đọc vẹt quy luật mà không hiểu nghĩa</td><td>Giải thích mỗi cái bằng ví dụ thật của chính bạn</td></tr>
<tr><td>2</td><td>Nhầm 3 quy luật / 6 cặp phạm trù với nhau</td><td>Một sơ đồ tư duy + một bảng so sánh cho mỗi cặp</td></tr>
<tr><td>3</td><td>Assignment chỉ chép lại giáo trình</td><td>Vận dụng một nguyên lý vào một ca thật, cụ thể</td></tr>
<tr><td>4</td><td>Tiểu luận mơ hồ, không cấu trúc</td><td>Dùng khung 5 phần (nguyên lý→ca→phân tích→bài học→chính kiến)</td></tr>
<tr><td>5</td><td>Lơ ôn thi (cổng thi cuối ≥4)</td><td>Luyện ngân hàng câu hỏi; nắm chắc 3 quy luật</td></tr>
<tr><td>6</td><td>Dùng AI bịa (vi phạm CLO7)</td><td>Dùng AI để kiểm tra sự hiểu; tự viết</td></tr>
</tbody>
</table>

<h3>Cờ xanh / cờ đỏ</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Xanh</span> Giải thích được mỗi quy luật bằng ví dụ của mình · không nhầm nhân-quả với tất nhiên-ngẫu nhiên · assignment vận dụng nguyên lý vào ca thật · liên hệ phương pháp với vấn đề thực.</div>
<div class="lz-layer"><span class="lz-lk">Đỏ</span> Chỉ đọc vẹt định nghĩa · lẫn lộn các quy luật · tiểu luận chép giáo trình · bỏ qua phép biện chứng (lõi Phần 2).</div>
</div>

<div class="callout ok"><strong>Công thức điểm cao.</strong> Điểm = (hiểu, không chỉ thuộc) × (không nhầm quy luật/phạm trù) × (vận dụng phương pháp vào ca thật) × (qua cổng thi). Đủ cả bốn là cái trừu tượng trở nên thực sự hữu ích.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Nối phép biện chứng với hôm nay.</b> Những câu trả lời ấn tượng nhất nối một quy luật với thực tại hiện đại: lượng→chất với một điểm bùng phát viral, mâu thuẫn với căng thẳng mã nguồn mở vs độc quyền, phủ định-của-phủ định với cách các mô hình AI thay thế nhau. Giám khảo nhớ sinh viên khiến phép biện chứng sống động. <em>Ngoài syllabus, nhưng là nước đi biến câu trả lời học thuộc thành câu đáng nhớ.</em></div>
</div>`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 1 — TRIẾT HỌC & VẤN ĐỀ CƠ BẢN ══════════════════ */
    {
      title: 'Chapter 1 — Philosophy & its basic question|||Chương 1 — Triết học & vấn đề cơ bản',
      description: 'Triết học là gì, vấn đề cơ bản, chủ nghĩa duy vật vs duy tâm, biện chứng vs siêu hình, và sự ra đời của triết học Mác.',
      lessons: [
        {
          title: '1.1 — The basic question & the great divide|||1.1 — Vấn đề cơ bản & sự phân đôi lớn',
          slug: 'mln111-1-1-van-de-co-ban',
          type: 'VIDEO',
          description: 'Vấn đề cơ bản của triết học, hai trường phái (duy vật vs duy tâm), hai phương pháp (biện chứng vs siêu hình).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>Every philosophy answers one basic question</h2>
<p class="lead">The <strong>basic question of philosophy</strong> is the relationship between <em>matter</em> and <em>consciousness</em> (being and thinking). It has two sides: (1) which is primary — matter or consciousness? (2) Can we know the world? How you answer side 1 splits all of philosophy into two camps.</p>

<h3>The great divide: materialism vs idealism</h3>
<table>
<thead><tr><th></th><th>Materialism (duy vật)</th><th>Idealism (duy tâm)</th></tr></thead>
<tbody>
<tr><td>What's primary</td><td>Matter — it exists first; consciousness reflects it</td><td>Consciousness/spirit — it comes first</td></tr>
<tr><td>Example claim</td><td>"The brain produces thought"</td><td>"Ideas/spirit shape reality"</td></tr>
<tr><td>Marxist stance</td><td>✔ Dialectical materialism</td><td>✘</td></tr>
</tbody>
</table>

<h3>Two methods: dialectics vs metaphysics</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Dialectics (biện chứng)</span> Sees things in connection, motion, and change; contradiction drives development.</div>
<div class="lz-layer"><span class="lz-lk">Metaphysics (siêu hình)</span> Sees things in isolation, static, unchanging; denies internal contradiction.</div>
</div>

<h3>Worked example — two ways to see a student</h3>
<div class="out"><strong>Metaphysical view:</strong> "He's a bad student — fixed, always will be." Isolated, static.
<strong>Dialectical view:</strong> "He struggles now, but he's connected to his circumstances, changing over time; the tension between his effort and difficulty can drive growth." Connected, in motion, contradiction as engine.
<strong>Lesson:</strong> the dialectical method sees potential and change where the metaphysical one sees only fixed labels. This is the core mental shift of the whole course.</div>

<div class="callout ok"><strong>Marxist philosophy = dialectical materialism + historical materialism:</strong> the materialist answer to "what's primary" PLUS the dialectical method. It's the union of both correct choices above.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The knowability question and science.</b> Side 2 (can we know the world?) matters for science: materialism says yes, the world is knowable through practice; agnosticism doubts it. Every experiment you'll ever run assumes the knowable, practice-tested world of dialectical materialism. <em>Beyond the syllabus, but it links philosophy directly to the scientific method.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Mọi triết học đều trả lời một vấn đề cơ bản</h2>
<p class="lead"><strong>Vấn đề cơ bản của triết học</strong> là mối quan hệ giữa <em>vật chất</em> và <em>ý thức</em> (tồn tại và tư duy). Nó có hai mặt: (1) cái nào có trước — vật chất hay ý thức? (2) Con người có nhận thức được thế giới không? Cách bạn trả lời mặt 1 chia toàn bộ triết học thành hai phe.</p>

<h3>Sự phân đôi lớn: duy vật vs duy tâm</h3>
<table>
<thead><tr><th></th><th>Chủ nghĩa duy vật</th><th>Chủ nghĩa duy tâm</th></tr></thead>
<tbody>
<tr><td>Cái có trước</td><td>Vật chất — tồn tại trước; ý thức phản ánh nó</td><td>Ý thức/tinh thần — có trước</td></tr>
<tr><td>Tuyên bố ví dụ</td><td>"Bộ não sinh ra tư duy"</td><td>"Ý niệm/tinh thần định hình hiện thực"</td></tr>
<tr><td>Lập trường Mác</td><td>✔ Chủ nghĩa duy vật biện chứng</td><td>✘</td></tr>
</tbody>
</table>

<h3>Hai phương pháp: biện chứng vs siêu hình</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Biện chứng</span> Nhìn sự vật trong mối liên hệ, vận động, thay đổi; mâu thuẫn là động lực phát triển.</div>
<div class="lz-layer"><span class="lz-lk">Siêu hình</span> Nhìn sự vật cô lập, tĩnh tại, bất biến; phủ nhận mâu thuẫn bên trong.</div>
</div>

<h3>Ví dụ có lời giải — hai cách nhìn một sinh viên</h3>
<div class="out"><strong>Cách nhìn siêu hình:</strong> "Cậu ấy là sinh viên kém — cố định, luôn thế." Cô lập, tĩnh.
<strong>Cách nhìn biện chứng:</strong> "Cậu ấy vật lộn bây giờ, nhưng gắn với hoàn cảnh, thay đổi theo thời gian; căng thẳng giữa nỗ lực và khó khăn có thể thúc đẩy trưởng thành." Gắn kết, vận động, mâu thuẫn làm động cơ.
<strong>Bài học:</strong> phương pháp biện chứng thấy tiềm năng và sự thay đổi ở nơi phương pháp siêu hình chỉ thấy những nhãn cố định. Đây là sự dịch chuyển tư duy cốt lõi của cả môn.</div>

<div class="callout ok"><strong>Triết học Mác = chủ nghĩa duy vật biện chứng + chủ nghĩa duy vật lịch sử:</strong> câu trả lời duy vật cho "cái nào có trước" CỘNG phương pháp biện chứng. Đó là sự kết hợp của cả hai lựa chọn đúng ở trên.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Vấn đề khả tri và khoa học.</b> Mặt 2 (có nhận thức được thế giới không?) quan trọng với khoa học: duy vật nói có, thế giới nhận thức được qua thực tiễn; thuyết bất khả tri thì nghi ngờ. Mọi thí nghiệm bạn từng chạy đều giả định thế giới nhận thức được, kiểm chứng qua thực tiễn của chủ nghĩa duy vật biện chứng. <em>Ngoài syllabus, nhưng nối triết học trực tiếp với phương pháp khoa học.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'The basic question of philosophy is about the relationship between:|||Vấn đề cơ bản của triết học là về quan hệ giữa:',
                options: [
                  'Money and power|||Tiền và quyền',
                  'Matter and consciousness (being and thinking)|||Vật chất và ý thức (tồn tại và tư duy)',
                  'Rich and poor|||Giàu và nghèo',
                  'Old and new|||Cũ và mới',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'Materialism holds that what is primary?|||Chủ nghĩa duy vật cho rằng cái gì có trước?',
                options: [
                  'Consciousness/spirit|||Ý thức/tinh thần',
                  'Matter|||Vật chất',
                  'Neither|||Không cái nào',
                  'God|||Thượng đế',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'The dialectical method sees things as:|||Phương pháp biện chứng nhìn sự vật là:',
                options: [
                  'Isolated, static and unchanging|||Cô lập, tĩnh và bất biến',
                  'Connected, in motion, with contradiction driving change|||Gắn kết, vận động, mâu thuẫn thúc đẩy thay đổi',
                  'Purely random|||Hoàn toàn ngẫu nhiên',
                  'Fixed forever|||Cố định mãi mãi',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'Marxist philosophy combines:|||Triết học Mác kết hợp:',
                options: [
                  'Idealism and metaphysics|||Duy tâm và siêu hình',
                  'Dialectical materialism and historical materialism|||Chủ nghĩa duy vật biện chứng và duy vật lịch sử',
                  'Only metaphysics|||Chỉ siêu hình',
                  'Agnosticism|||Thuyết bất khả tri',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 2 — VẬT CHẤT & Ý THỨC ══════════════════ */
    {
      title: 'Chapter 2 — Matter & consciousness|||Chương 2 — Vật chất & ý thức',
      description: 'Định nghĩa vật chất của Lênin, nguồn gốc & bản chất của ý thức, và mối quan hệ biện chứng vật chất – ý thức.',
      lessons: [
        {
          title: '2.1 — Lenin\'s definition of matter & consciousness|||2.1 — Định nghĩa vật chất của Lênin & ý thức',
          slug: 'mln111-2-1-vat-chat-y-thuc',
          type: 'VIDEO',
          description: 'Định nghĩa vật chất của Lênin (thực tại khách quan), nguồn gốc ý thức, và ý nghĩa phương pháp luận.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Matter = objective reality, existing independent of the mind</h2>
<p class="lead">Lenin's classic definition: <strong>"Matter is a philosophical category denoting objective reality, which is given to man by his sensations, and which is copied, photographed, reflected by our sensations, while existing independently of them."</strong> The key: matter exists <em>objectively</em>, outside and independent of consciousness.</p>

<h3>Unpacking the definition</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Objective reality</span> Matter's only essential property is existing outside/independent of the mind — not "solid stuff" specifically.</div>
<div class="lz-layer"><span class="lz-lk">Knowable</span> It's reflected in our sensations — so we <em>can</em> know it (against agnosticism).</div>
<div class="lz-layer"><span class="lz-lk">Independent</span> It exists whether or not anyone perceives it.</div>
</div>
<p>Why so abstract? Because "matter" as a philosophical category must cover everything objective — atoms, fields, even things not yet discovered. Defining it as "objective reality" made the concept robust to new physics (which is why it survived the crisis when the atom was split).</p>

<h3>Consciousness — origin & essence</h3>
<ul>
<li><strong>Natural origin:</strong> a property of highly-organized matter (the human brain).</li>
<li><strong>Social origin:</strong> arose through <em>labor</em> and <em>language</em> in social life.</li>
<li><strong>Essence:</strong> a subjective reflection of objective reality — an active, creative image of the world in the brain, not a mirror copy.</li>
</ul>

<div class="callout ok"><strong>The relationship (the heart of Part 2):</strong> matter is primary and determines consciousness; but consciousness is <em>relatively independent</em> and actively reacts back on matter through human practice. We know the world (matter → consciousness) and then change it (consciousness → matter, via action).</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Consciousness as "reflection" and AI.</b> If consciousness is highly-organized matter reflecting reality, it raises a live question: can artificial systems (neural networks in silicon) reflect and reason? The materialist view suggests mind is a natural process, not a mystical spark — a fascinating angle for assignment topic #12. <em>Beyond the syllabus, but where old philosophy meets the AI debate.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Vật chất = thực tại khách quan, tồn tại độc lập với ý thức</h2>
<p class="lead">Định nghĩa kinh điển của Lênin: <strong>"Vật chất là một phạm trù triết học dùng để chỉ thực tại khách quan được đem lại cho con người trong cảm giác, được cảm giác của chúng ta chép lại, chụp lại, phản ánh, và tồn tại không lệ thuộc vào cảm giác."</strong> Then chốt: vật chất tồn tại <em>khách quan</em>, bên ngoài và độc lập với ý thức.</p>

<h3>Giải mã định nghĩa</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Thực tại khách quan</span> Thuộc tính bản chất duy nhất của vật chất là tồn tại bên ngoài/độc lập với ý thức — không phải cụ thể "vật rắn".</div>
<div class="lz-layer"><span class="lz-lk">Nhận thức được</span> Nó được phản ánh trong cảm giác của ta — nên ta <em>có thể</em> nhận thức được (chống thuyết bất khả tri).</div>
<div class="lz-layer"><span class="lz-lk">Độc lập</span> Nó tồn tại dù có ai tri giác hay không.</div>
</div>
<p>Vì sao trừu tượng vậy? Vì "vật chất" như một phạm trù triết học phải bao trùm mọi thứ khách quan — nguyên tử, trường, cả những thứ chưa được khám phá. Định nghĩa nó là "thực tại khách quan" khiến khái niệm vững trước vật lý mới (đó là lý do nó sống sót qua khủng hoảng khi nguyên tử bị phân chia).</p>

<h3>Ý thức — nguồn gốc & bản chất</h3>
<ul>
<li><strong>Nguồn gốc tự nhiên:</strong> một thuộc tính của vật chất có tổ chức cao (bộ não người).</li>
<li><strong>Nguồn gốc xã hội:</strong> nảy sinh qua <em>lao động</em> và <em>ngôn ngữ</em> trong đời sống xã hội.</li>
<li><strong>Bản chất:</strong> sự phản ánh chủ quan hiện thực khách quan — một hình ảnh năng động, sáng tạo về thế giới trong bộ não, không phải bản sao gương.</li>
</ul>

<div class="callout ok"><strong>Mối quan hệ (trái tim Phần 2):</strong> vật chất có trước và quyết định ý thức; nhưng ý thức có <em>tính độc lập tương đối</em> và tác động trở lại vật chất qua thực tiễn của con người. Ta nhận thức thế giới (vật chất → ý thức) rồi cải tạo nó (ý thức → vật chất, qua hành động).</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Ý thức như "phản ánh" và AI.</b> Nếu ý thức là vật chất có tổ chức cao phản ánh hiện thực, nó đặt ra một câu hỏi sống động: hệ thống nhân tạo (mạng nơ-ron trên silicon) có phản ánh và suy luận được không? Quan điểm duy vật gợi ý tâm trí là một quá trình tự nhiên, không phải một tia thần bí — một góc hấp dẫn cho đề assignment #12. <em>Ngoài syllabus, nhưng là nơi triết học cũ gặp tranh luận AI.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'In Lenin\'s definition, the only essential property of matter is:|||Trong định nghĩa của Lênin, thuộc tính bản chất duy nhất của vật chất là:',
                options: [
                  'Being hard and solid|||Cứng và rắn',
                  'Existing as objective reality, independent of consciousness|||Tồn tại như thực tại khách quan, độc lập với ý thức',
                  'Being visible|||Nhìn thấy được',
                  'Being made of atoms only|||Chỉ làm bằng nguyên tử',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'The social origin of consciousness is:|||Nguồn gốc xã hội của ý thức là:',
                options: [
                  'The atom|||Nguyên tử',
                  'Labor and language|||Lao động và ngôn ngữ',
                  'The weather|||Thời tiết',
                  'Genetics only|||Chỉ di truyền',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'The materialist relationship of matter and consciousness is:|||Quan hệ duy vật giữa vật chất và ý thức là:',
                options: [
                  'Consciousness determines matter|||Ý thức quyết định vật chất',
                  'Matter is primary and determines consciousness; consciousness reacts back through practice|||Vật chất có trước và quyết định ý thức; ý thức tác động trở lại qua thực tiễn',
                  'They are unrelated|||Chúng không liên quan',
                  'Only consciousness exists|||Chỉ có ý thức tồn tại',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'Consciousness reflecting reality is best described as:|||Ý thức phản ánh hiện thực được mô tả đúng nhất là:',
                options: [
                  'A passive mirror copy|||Một bản sao gương thụ động',
                  'An active, creative subjective image of the objective world|||Một hình ảnh chủ quan năng động, sáng tạo về thế giới khách quan',
                  'Pure imagination with no reality|||Tưởng tượng thuần túy không hiện thực',
                  'Identical to matter|||Giống hệt vật chất',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 3 — PHÉP BIỆN CHỨNG DUY VẬT ══════════════════ */
    {
      title: 'Chapter 3 — Materialist dialectics|||Chương 3 — Phép biện chứng duy vật',
      description: 'Trái tim phương pháp: 2 nguyên lý, 3 quy luật cơ bản (lượng-chất, mâu thuẫn, phủ định của phủ định), và 6 cặp phạm trù.',
      lessons: [
        {
          title: '3.1 — Two principles & three laws|||3.1 — Hai nguyên lý & ba quy luật',
          slug: 'mln111-3-1-nguyen-ly-quy-luat',
          type: 'VIDEO',
          description: '2 nguyên lý (mối liên hệ phổ biến, sự phát triển) và 3 quy luật cơ bản với ví dụ giải từng cái.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>The engine of the whole method</h2>
<p class="lead">Materialist dialectics is a system: <strong>2 principles</strong> (the general view), <strong>3 laws</strong> (how development happens), and <strong>6 pairs of categories</strong> (analytical tools). This lesson covers the principles and the three laws — the exam core.</p>

<h3>The two principles</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Universal connection</span> Everything is connected to everything else — nothing exists in isolation. → analyze things in their relationships.</div>
<div class="lz-layer"><span class="lz-lk">Development</span> Everything moves and develops in an upward, spiral direction — not static, not merely circular. → see the tendency of change.</div>
</div>

<h3>The three basic laws</h3>
<table>
<thead><tr><th>Law</th><th>Answers</th><th>In one line</th></tr></thead>
<tbody>
<tr><td>Quantity ↔ Quality</td><td>HOW development happens</td><td>Gradual quantitative change → a leap → new quality</td></tr>
<tr><td>Unity &amp; struggle of opposites</td><td>WHY (the source)</td><td>Internal contradiction is the source of development</td></tr>
<tr><td>Negation of the negation</td><td>The DIRECTION/form</td><td>Development is spiral: negation, then negation-of-that, on a higher level</td></tr>
</tbody>
</table>

<h3>Worked examples — one per law</h3>
<div class="out"><strong>Quantity → Quality:</strong> heat water: 1°, 2°… 99° (quantity) — nothing dramatic — then at 100° it BOILS: a leap to a new quality (steam). Learning: 100 practice reps accumulate until fluency suddenly "clicks" (the leap). The point where quantity turns to quality is the <em>node</em>.
<strong>Contradiction:</strong> a seed contains the contradiction of "being a seed" vs "becoming a plant"; resolving that tension IS growth. In society, the tension between productive forces and relations of production drives historical change.
<strong>Negation of negation:</strong> seed → (negated by) plant → (negated by) many new seeds — but now richer, on a higher level. A spiral, not a circle: technology negates old tech, then is negated again, each time advancing.</div>

<div class="callout ok"><strong>Methodological lessons (what to DO with the laws):</strong> accumulate quantity patiently but be ready for the leap (don't quit at 99°); find and resolve the real internal contradiction (not surface symptoms); expect progress to be spiral (setbacks are part of upward development, not the end).</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Tipping points = quantity into quality.</b> Modern "tipping point" and "critical mass" ideas (a network suddenly goes viral, a habit suddenly sticks) are exactly the quantity→quality law in new language. Naming this connection in an assignment shows you grasp the law, not just memorized it. <em>Beyond the syllabus, but the bridge from a 19th-century law to 21st-century phenomena.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Động cơ của cả phương pháp</h2>
<p class="lead">Phép biện chứng duy vật là một hệ thống: <strong>2 nguyên lý</strong> (quan điểm chung), <strong>3 quy luật</strong> (sự phát triển diễn ra thế nào), và <strong>6 cặp phạm trù</strong> (công cụ phân tích). Bài này bàn các nguyên lý và ba quy luật — lõi thi.</p>

<h3>Hai nguyên lý</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Mối liên hệ phổ biến</span> Mọi thứ liên hệ với nhau — không gì tồn tại cô lập. → phân tích sự vật trong mối quan hệ.</div>
<div class="lz-layer"><span class="lz-lk">Sự phát triển</span> Mọi thứ vận động và phát triển theo hướng đi lên, xoáy ốc — không tĩnh, không chỉ vòng tròn. → thấy khuynh hướng của sự thay đổi.</div>
</div>

<h3>Ba quy luật cơ bản</h3>
<table>
<thead><tr><th>Quy luật</th><th>Trả lời</th><th>Một câu</th></tr></thead>
<tbody>
<tr><td>Lượng ↔ Chất</td><td>Phát triển diễn ra THẾ NÀO</td><td>Lượng đổi dần → bước nhảy → chất mới</td></tr>
<tr><td>Thống nhất &amp; đấu tranh của các mặt đối lập</td><td>VÌ SAO (nguồn gốc)</td><td>Mâu thuẫn bên trong là nguồn gốc của phát triển</td></tr>
<tr><td>Phủ định của phủ định</td><td>HƯỚNG/hình thức</td><td>Phát triển xoáy ốc: phủ định, rồi phủ định cái đó, ở mức cao hơn</td></tr>
</tbody>
</table>

<h3>Ví dụ có lời giải — mỗi quy luật một cái</h3>
<div class="out"><strong>Lượng → Chất:</strong> đun nước: 1°, 2°… 99° (lượng) — chưa gì đột biến — rồi tới 100° nó SÔI: bước nhảy sang chất mới (hơi nước). Học tập: 100 lần luyện tích lũy tới khi thành thạo bỗng "click" (bước nhảy). Điểm lượng chuyển thành chất là <em>điểm nút</em>.
<strong>Mâu thuẫn:</strong> một hạt giống chứa mâu thuẫn "là hạt" vs "thành cây"; giải quyết căng thẳng đó CHÍNH LÀ sự lớn lên. Trong xã hội, căng thẳng giữa lực lượng sản xuất và quan hệ sản xuất thúc đẩy thay đổi lịch sử.
<strong>Phủ định của phủ định:</strong> hạt → (bị phủ định bởi) cây → (bị phủ định bởi) nhiều hạt mới — nhưng giờ phong phú hơn, ở mức cao hơn. Một đường xoáy ốc, không phải vòng tròn: công nghệ phủ định công nghệ cũ, rồi lại bị phủ định, mỗi lần tiến lên.</div>

<div class="callout ok"><strong>Bài học phương pháp (LÀM GÌ với các quy luật):</strong> tích lũy lượng kiên nhẫn nhưng sẵn sàng cho bước nhảy (đừng bỏ ở 99°); tìm và giải quyết mâu thuẫn bên trong thật (không phải triệu chứng bề mặt); kỳ vọng tiến bộ theo xoáy ốc (thất bại là một phần của phát triển đi lên, không phải dấu chấm hết).</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Điểm bùng phát = lượng đổi thành chất.</b> Các ý tưởng hiện đại "tipping point" và "khối lượng tới hạn" (một mạng bỗng viral, một thói quen bỗng bám) chính là quy luật lượng→chất bằng ngôn ngữ mới. Gọi tên liên hệ này trong assignment cho thấy bạn nắm quy luật, không chỉ học thuộc. <em>Ngoài syllabus, nhưng là cây cầu từ một quy luật thế kỷ 19 tới hiện tượng thế kỷ 21.</em></div>
</div>`,
        },
        {
          title: '3.2 — The six pairs of categories|||3.2 — Sáu cặp phạm trù',
          slug: 'mln111-3-2-pham-tru',
          type: 'VIDEO',
          description: '6 cặp phạm trù (riêng-chung, nhân-quả, tất nhiên-ngẫu nhiên, nội dung-hình thức, bản chất-hiện tượng, khả năng-hiện thực) với ví dụ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Six analytical lenses</h2>
<p class="lead">The <strong>six pairs of categories</strong> are precise thinking tools — each a pair of connected opposites. They're the most commonly-confused part of the course, so learn each pair with a clear example and a comparison.</p>

<table>
<thead><tr><th>Pair</th><th>Meaning</th><th>Example</th></tr></thead>
<tbody>
<tr><td>The particular ↔ the general (riêng–chung)</td><td>A single thing vs the common features across many</td><td>This apple vs "fruit" in general</td></tr>
<tr><td>Cause ↔ effect (nhân–quả)</td><td>What produces vs what is produced</td><td>Studying (cause) → passing (effect)</td></tr>
<tr><td>Necessity ↔ chance (tất nhiên–ngẫu nhiên)</td><td>What must happen from the essence vs the accidental</td><td>A seed must grow (necessity) but its exact height (chance)</td></tr>
<tr><td>Content ↔ form (nội dung–hình thức)</td><td>The substance vs the way it's organized/expressed</td><td>A story (content) vs book/film (form)</td></tr>
<tr><td>Essence ↔ appearance (bản chất–hiện tượng)</td><td>The inner nature vs the outer manifestation</td><td>A person's character (essence) vs behavior on one day (appearance)</td></tr>
<tr><td>Possibility ↔ actuality (khả năng–hiện thực)</td><td>What could become vs what already is</td><td>A talented student (possibility) vs a graduate (actuality)</td></tr>
</tbody>
</table>

<h3>Worked example — don't confuse the tricky ones</h3>
<div class="out"><strong>Cause–effect vs necessity–chance:</strong> These are different lenses. "Rain caused the flood" is cause→effect. "This particular flood on this day" mixes necessity (floods happen in the rainy season — from the essence) with chance (that it happened on Tuesday — accidental). Exam trap: labeling a chance event as necessity or vice versa.
<strong>Essence vs appearance:</strong> a stock's price jumping (appearance) may hide a failing company (essence). "Don't judge by the surface" IS the essence-appearance category. Apply it to avoid being fooled by phenomena.</div>

<div class="callout ok"><strong>Methodological value:</strong> these categories train you to (a) find the general law behind particular cases, (b) trace causes rather than blame symptoms, (c) separate the necessary from the accidental, (d) see essence beneath appearance, and (e) turn possibility into actuality through action. That's a complete analytical toolkit.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Essence vs appearance in a data-driven world.</b> Metrics (appearance) can mislead: vanity numbers, gamed KPIs, surface correlations. The category tells you to dig for the essence behind the data. This is exactly critical-thinking about statistics — a directly employable skill. <em>Beyond the syllabus, but why this "old" category is sharp for modern analytics.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Sáu lăng kính phân tích</h2>
<p class="lead"><strong>Sáu cặp phạm trù</strong> là công cụ tư duy chính xác — mỗi cặp là hai mặt đối lập gắn kết. Đây là phần dễ nhầm nhất của môn, nên học mỗi cặp với một ví dụ rõ và một so sánh.</p>

<table>
<thead><tr><th>Cặp</th><th>Nghĩa</th><th>Ví dụ</th></tr></thead>
<tbody>
<tr><td>Cái riêng ↔ cái chung</td><td>Một sự vật đơn lẻ vs đặc điểm chung của nhiều cái</td><td>Quả táo này vs "trái cây" nói chung</td></tr>
<tr><td>Nguyên nhân ↔ kết quả</td><td>Cái sinh ra vs cái được sinh ra</td><td>Học (nhân) → đậu (quả)</td></tr>
<tr><td>Tất nhiên ↔ ngẫu nhiên</td><td>Cái phải xảy ra từ bản chất vs cái ngẫu nhiên</td><td>Hạt phải nảy mầm (tất nhiên) nhưng cao đúng bao nhiêu (ngẫu nhiên)</td></tr>
<tr><td>Nội dung ↔ hình thức</td><td>Cái bản thể vs cách nó được tổ chức/biểu hiện</td><td>Một câu chuyện (nội dung) vs sách/phim (hình thức)</td></tr>
<tr><td>Bản chất ↔ hiện tượng</td><td>Bản tính bên trong vs biểu hiện bên ngoài</td><td>Tính cách một người (bản chất) vs hành vi một ngày (hiện tượng)</td></tr>
<tr><td>Khả năng ↔ hiện thực</td><td>Cái có thể thành vs cái đã là</td><td>Một sinh viên tài năng (khả năng) vs một cử nhân (hiện thực)</td></tr>
</tbody>
</table>

<h3>Ví dụ có lời giải — đừng nhầm những cặp khó</h3>
<div class="out"><strong>Nhân–quả vs tất nhiên–ngẫu nhiên:</strong> Đây là hai lăng kính khác nhau. "Mưa gây ra lũ" là nhân→quả. "Trận lũ cụ thể này vào ngày này" trộn tất nhiên (lũ xảy ra mùa mưa — từ bản chất) với ngẫu nhiên (nó xảy ra hôm thứ Ba — ngẫu nhiên). Bẫy thi: gán một sự kiện ngẫu nhiên thành tất nhiên hoặc ngược lại.
<strong>Bản chất vs hiện tượng:</strong> giá cổ phiếu nhảy vọt (hiện tượng) có thể che một công ty đang thua lỗ (bản chất). "Đừng đánh giá qua bề mặt" CHÍNH LÀ cặp bản chất-hiện tượng. Vận dụng nó để không bị hiện tượng đánh lừa.</div>

<div class="callout ok"><strong>Giá trị phương pháp:</strong> các phạm trù này rèn bạn (a) tìm quy luật chung sau các ca riêng, (b) truy nguyên nhân thay vì đổ lỗi triệu chứng, (c) tách cái tất nhiên khỏi ngẫu nhiên, (d) thấy bản chất dưới hiện tượng, và (e) biến khả năng thành hiện thực qua hành động. Đó là một bộ công cụ phân tích trọn vẹn.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Bản chất vs hiện tượng trong thế giới dữ liệu.</b> Chỉ số (hiện tượng) có thể đánh lừa: số phù phiếm, KPI bị "gian", tương quan bề mặt. Cặp phạm trù bảo bạn đào tìm bản chất sau dữ liệu. Đây chính là tư duy phản biện về thống kê — một kỹ năng dùng được ngay trong nghề. <em>Ngoài syllabus, nhưng là lý do cặp phạm trù "cũ" này sắc cho phân tích hiện đại.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'The law that answers HOW development happens (gradual change then a leap) is:|||Quy luật trả lời phát triển diễn ra THẾ NÀO (đổi dần rồi bước nhảy) là:',
                options: [
                  'Negation of the negation|||Phủ định của phủ định',
                  'Quantitative → qualitative change|||Lượng đổi → chất đổi',
                  'Unity of opposites|||Thống nhất của các mặt đối lập',
                  'Cause and effect|||Nhân và quả',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'According to dialectics, the source (WHY) of development is:|||Theo biện chứng, nguồn gốc (VÌ SAO) của phát triển là:',
                options: [
                  'External force only|||Chỉ lực bên ngoài',
                  'Internal contradiction (unity & struggle of opposites)|||Mâu thuẫn bên trong (thống nhất & đấu tranh của các mặt đối lập)',
                  'Pure chance|||Ngẫu nhiên thuần túy',
                  'Nothing|||Không gì',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'The "negation of the negation" describes development as:|||"Phủ định của phủ định" mô tả phát triển là:',
                options: [
                  'A straight line|||Một đường thẳng',
                  'A spiral: advancing to a higher level, not a mere circle|||Một đường xoáy ốc: tiến lên mức cao hơn, không chỉ vòng tròn',
                  'Going backward|||Đi lùi',
                  'Staying still|||Đứng yên',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'Water boiling at exactly 100°C best illustrates:|||Nước sôi đúng 100°C minh họa rõ nhất:',
                options: [
                  'Cause and effect|||Nhân và quả',
                  'The node where quantity turns into quality (a leap)|||Điểm nút nơi lượng chuyển thành chất (bước nhảy)',
                  'Chance|||Ngẫu nhiên',
                  'Essence vs appearance|||Bản chất vs hiện tượng',
                ], correctIndex: 1,
              },
              {
                id: 'q5', points: 1,
                question: '"Don\'t judge by the surface" corresponds to which category pair?|||"Đừng đánh giá qua bề mặt" tương ứng cặp phạm trù nào?',
                options: [
                  'Content–form|||Nội dung–hình thức',
                  'Essence–appearance|||Bản chất–hiện tượng',
                  'Cause–effect|||Nhân–quả',
                  'Particular–general|||Riêng–chung',
                ], correctIndex: 1,
              },
              {
                id: 'q6', points: 1,
                question: '(Beyond syllabus) Modern "tipping point / critical mass" ideas restate which law?|||(Ngoài giáo trình) Ý tưởng hiện đại "điểm bùng phát / khối lượng tới hạn" nhắc lại quy luật nào?',
                options: [
                  'Negation of the negation|||Phủ định của phủ định',
                  'Quantity into quality|||Lượng đổi thành chất',
                  'Essence–appearance|||Bản chất–hiện tượng',
                  'Cause–effect|||Nhân–quả',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 4 — LÝ LUẬN NHẬN THỨC ══════════════════ */
    {
      title: 'Chapter 4 — Theory of knowledge|||Chương 4 — Lý luận nhận thức',
      description: 'Thực tiễn là cơ sở, động lực & tiêu chuẩn của nhận thức; con đường biện chứng của nhận thức; và chân lý.',
      lessons: [
        {
          title: '4.1 — Practice, cognition & truth|||4.1 — Thực tiễn, nhận thức & chân lý',
          slug: 'mln111-4-1-nhan-thuc-chan-ly',
          type: 'VIDEO',
          description: 'Vai trò của thực tiễn, con đường nhận thức (cảm tính → lý tính), và tiêu chuẩn của chân lý.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Practice is the basis and the test of knowledge</h2>
<p class="lead">How do we know the world, and how do we know we're right? The materialist answer centers on <strong>practice</strong> (praxis — human activity that changes the world): practice is the basis, driving force, purpose, AND criterion of truth. We don't know by pure thinking alone; we know by acting and testing.</p>

<h3>The four roles of practice</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Basis</span> Knowledge starts from practical contact with reality.</div>
<div class="lz-layer"><span class="lz-lk">Driving force</span> Practical problems push knowledge forward (needs create science).</div>
<div class="lz-layer"><span class="lz-lk">Purpose</span> We seek knowledge to change the world, not just contemplate it.</div>
<div class="lz-layer"><span class="lz-lk">Criterion of truth</span> An idea is true if practice confirms it works.</div>
</div>

<h3>The dialectical path of cognition</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Sensory (cảm tính)</div><div class="lz-d">sensation · perception · representation</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Rational (lý tính)</div><div class="lz-d">concept · judgment · inference</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Back to practice</div><div class="lz-d">test &amp; apply</div></div>
</div>
<p>Lenin's formula: <em>"From living perception to abstract thinking, and from abstract thinking back to practice."</em> Knowledge spirals: observe → theorize → test in practice → refine.</p>

<h3>Truth — and why practice is its judge</h3>
<ul>
<li><strong>Objective truth:</strong> content that correctly reflects reality, independent of who believes it.</li>
<li><strong>Absolute &amp; relative:</strong> we approach complete truth through successive relative truths (science advances).</li>
<li><strong>Concrete:</strong> truth is always tied to specific conditions — "true" here may not hold there.</li>
</ul>

<div class="out"><strong>Worked example:</strong> "This bridge design is safe" is a hypothesis (rational knowledge). Is it true? You don't settle it by arguing — you <em>build and load-test</em> it (practice). Practice is the criterion. Every engineering test, every code deployment to production, is this principle in action: the real world is the final judge of your idea.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>"Practice is the criterion of truth" = the scientific method + agile.</b> Hypothesis → experiment → evidence is exactly this. So is "ship it and measure": build a feature (idea), release it (practice), let real usage confirm or refute it. The 150-year-old principle underlies both modern science and modern software. <em>Beyond the syllabus, but a strikingly practical takeaway.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Thực tiễn là cơ sở và phép thử của nhận thức</h2>
<p class="lead">Ta nhận thức thế giới thế nào, và làm sao biết mình đúng? Câu trả lời duy vật xoay quanh <strong>thực tiễn</strong> (hoạt động của con người cải tạo thế giới): thực tiễn là cơ sở, động lực, mục đích, VÀ tiêu chuẩn của chân lý. Ta không nhận thức chỉ bằng tư duy thuần túy; ta nhận thức bằng hành động và kiểm nghiệm.</p>

<h3>Bốn vai trò của thực tiễn</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Cơ sở</span> Nhận thức bắt đầu từ tiếp xúc thực tiễn với hiện thực.</div>
<div class="lz-layer"><span class="lz-lk">Động lực</span> Vấn đề thực tiễn thúc đẩy nhận thức tiến lên (nhu cầu sinh ra khoa học).</div>
<div class="lz-layer"><span class="lz-lk">Mục đích</span> Ta tìm tri thức để cải tạo thế giới, không chỉ để chiêm nghiệm.</div>
<div class="lz-layer"><span class="lz-lk">Tiêu chuẩn của chân lý</span> Một ý tưởng đúng nếu thực tiễn xác nhận nó hoạt động.</div>
</div>

<h3>Con đường biện chứng của nhận thức</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Cảm tính</div><div class="lz-d">cảm giác · tri giác · biểu tượng</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Lý tính</div><div class="lz-d">khái niệm · phán đoán · suy lý</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Trở về thực tiễn</div><div class="lz-d">kiểm nghiệm &amp; vận dụng</div></div>
</div>
<p>Công thức của Lênin: <em>"Từ trực quan sinh động đến tư duy trừu tượng, và từ tư duy trừu tượng trở về thực tiễn."</em> Nhận thức đi xoáy ốc: quan sát → lý luận → kiểm nghiệm trong thực tiễn → tinh chỉnh.</p>

<h3>Chân lý — và vì sao thực tiễn là quan tòa</h3>
<ul>
<li><strong>Chân lý khách quan:</strong> nội dung phản ánh đúng hiện thực, độc lập với ai tin nó.</li>
<li><strong>Tuyệt đối &amp; tương đối:</strong> ta tiến tới chân lý hoàn toàn qua các chân lý tương đối kế tiếp (khoa học tiến bộ).</li>
<li><strong>Cụ thể:</strong> chân lý luôn gắn với điều kiện cụ thể — "đúng" ở đây có thể không đúng ở kia.</li>
</ul>

<div class="out"><strong>Ví dụ có lời giải:</strong> "Thiết kế cầu này an toàn" là một giả thuyết (tri thức lý tính). Nó đúng không? Bạn không giải quyết bằng tranh luận — bạn <em>xây và thử tải trọng</em> (thực tiễn). Thực tiễn là tiêu chuẩn. Mỗi lần test kỹ thuật, mỗi lần deploy code lên production, chính là nguyên lý này trong hành động: thế giới thực là quan tòa cuối cùng cho ý tưởng của bạn.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>"Thực tiễn là tiêu chuẩn của chân lý" = phương pháp khoa học + agile.</b> Giả thuyết → thí nghiệm → bằng chứng chính là điều này. "Ship it and measure" cũng vậy: xây một tính năng (ý tưởng), phát hành (thực tiễn), để mức dùng thật xác nhận hoặc bác bỏ. Nguyên lý 150 năm tuổi làm nền cho cả khoa học lẫn phần mềm hiện đại. <em>Ngoài syllabus, nhưng là một bài học thực dụng đáng kinh ngạc.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'In Marxist epistemology, the criterion (test) of truth is:|||Trong lý luận nhận thức Mác, tiêu chuẩn (phép thử) của chân lý là:',
                options: [
                  'Pure logic alone|||Chỉ logic thuần túy',
                  'Practice|||Thực tiễn',
                  'Majority opinion|||Ý kiến số đông',
                  'Authority|||Uy quyền',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'The dialectical path of cognition goes:|||Con đường biện chứng của nhận thức đi:',
                options: [
                  'Rational → sensory → stop|||Lý tính → cảm tính → dừng',
                  'Sensory → rational → back to practice|||Cảm tính → lý tính → trở về thực tiễn',
                  'Practice → nothing|||Thực tiễn → không gì',
                  'Only pure thinking|||Chỉ tư duy thuần túy',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: '"Concrete truth" means:|||"Chân lý cụ thể" nghĩa là:',
                options: [
                  'Truth is the same in all conditions|||Chân lý giống nhau trong mọi điều kiện',
                  'Truth is always tied to specific conditions|||Chân lý luôn gắn với điều kiện cụ thể',
                  'Truth is impossible|||Chân lý bất khả',
                  'Truth is only opinion|||Chân lý chỉ là ý kiến',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: '(Beyond syllabus) "Ship it and measure" reflects which principle?|||(Ngoài giáo trình) "Ship it and measure" phản ánh nguyên lý nào?',
                options: [
                  'Idealism|||Duy tâm',
                  'Practice as the criterion of truth|||Thực tiễn là tiêu chuẩn của chân lý',
                  'Metaphysics|||Siêu hình',
                  'Agnosticism|||Bất khả tri',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 5 — CHỦ NGHĨA DUY VẬT LỊCH SỬ ══════════════════ */
    {
      title: 'Chapter 5 — Historical materialism|||Chương 5 — Chủ nghĩa duy vật lịch sử',
      description: 'Hình thái kinh tế-xã hội, lực lượng sản xuất – quan hệ sản xuất, cơ sở hạ tầng – kiến trúc thượng tầng, giai cấp, nhà nước, và con người.',
      lessons: [
        {
          title: '5.1 — Socio-economic formation & what drives history|||5.1 — Hình thái kinh tế-xã hội & điều gì thúc đẩy lịch sử',
          slug: 'mln111-5-1-hinh-thai',
          type: 'VIDEO',
          description: 'Tồn tại xã hội quyết định ý thức xã hội, LLSX-QHSX, cơ sở hạ tầng-kiến trúc thượng tầng, và động lực lịch sử.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Applying materialism to society and history</h2>
<p class="lead">Historical materialism extends the materialist method to society. Its core claim: <strong>social being determines social consciousness</strong> — how people produce their material life shapes their ideas, politics and institutions, not the other way around. History has laws; it's not random or purely idea-driven.</p>

<h3>The productive forces ↔ relations of production</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Productive forces (LLSX)</span> People + tools/technology + knowledge — the capacity to produce. They constantly develop.</div>
<div class="lz-layer"><span class="lz-lk">Relations of production (QHSX)</span> How people relate in production (ownership, distribution). They tend to lag.</div>
</div>
<p>The <strong>law:</strong> relations of production must fit the level of the productive forces. When forces outgrow the old relations, a contradiction builds → resolved by transforming the relations. This is the contradiction (Ch3!) that drives historical change.</p>

<h3>Base & superstructure</h3>
<div class="diagram">SUPERSTRUCTURE   politics · law · ideology · institutions
       ▲ ▼         (shaped by, and reacts on)
BASE             the economic structure (sum of relations of production)</div>
<p>The economic <strong>base</strong> determines the political-legal-ideological <strong>superstructure</strong>; the superstructure reacts back. Change the economic base and, over time, the ideas and institutions shift too.</p>

<h3>Socio-economic formation</h3>
<p>A <strong>socio-economic formation</strong> = productive forces + relations of production (base) + superstructure, as a whole. History progresses through formations (primitive → slave → feudal → capitalist → …) driven by the LLSX–QHSX contradiction. This gives history a lawful, materialist explanation.</p>

<div class="out"><strong>Worked example — the digital economy:</strong> new productive forces (internet, AI, platforms) are outgrowing old relations of production (industrial-era labor law, ownership, IP rules). The friction we see — gig-work disputes, data ownership fights, platform regulation — is exactly a LLSX–QHSX contradiction demanding new relations. Historical materialism predicts the institutions must eventually adapt to the new forces.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Technology as a productive force reshaping society.</b> Every major tech shift (printing, steam, computing, AI) eventually reshaped law, work and ideas — a testable pattern of historical materialism. It's a powerful lens for assignment topic #8: analyze how AI (a productive force) is pressuring today's relations of production. <em>Beyond the syllabus, but the most current application of the theory.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Vận dụng chủ nghĩa duy vật vào xã hội và lịch sử</h2>
<p class="lead">Chủ nghĩa duy vật lịch sử mở rộng phương pháp duy vật vào xã hội. Luận điểm cốt lõi: <strong>tồn tại xã hội quyết định ý thức xã hội</strong> — cách con người sản xuất đời sống vật chất định hình tư tưởng, chính trị và thể chế, không phải ngược lại. Lịch sử có quy luật; nó không ngẫu nhiên hay thuần túy do ý niệm dẫn dắt.</p>

<h3>Lực lượng sản xuất ↔ quan hệ sản xuất</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Lực lượng sản xuất (LLSX)</span> Con người + công cụ/công nghệ + tri thức — năng lực sản xuất. Chúng phát triển liên tục.</div>
<div class="lz-layer"><span class="lz-lk">Quan hệ sản xuất (QHSX)</span> Cách con người quan hệ trong sản xuất (sở hữu, phân phối). Chúng có xu hướng đi sau.</div>
</div>
<p><strong>Quy luật:</strong> quan hệ sản xuất phải phù hợp với trình độ của lực lượng sản xuất. Khi LLSX vượt quá QHSX cũ, mâu thuẫn tích tụ → được giải quyết bằng cải biến QHSX. Đây là mâu thuẫn (Ch3!) thúc đẩy thay đổi lịch sử.</p>

<h3>Cơ sở hạ tầng & kiến trúc thượng tầng</h3>
<div class="diagram">KIẾN TRÚC THƯỢNG TẦNG   chính trị · pháp luật · tư tưởng · thể chế
       ▲ ▼               (được định hình bởi, và tác động trở lại)
CƠ SỞ HẠ TẦNG           kết cấu kinh tế (tổng hòa các quan hệ sản xuất)</div>
<p><strong>Cơ sở</strong> kinh tế quyết định <strong>kiến trúc thượng tầng</strong> chính trị-pháp lý-tư tưởng; thượng tầng tác động trở lại. Đổi cơ sở kinh tế thì, theo thời gian, tư tưởng và thể chế cũng chuyển.</p>

<h3>Hình thái kinh tế-xã hội</h3>
<p>Một <strong>hình thái kinh tế-xã hội</strong> = lực lượng sản xuất + quan hệ sản xuất (cơ sở) + kiến trúc thượng tầng, như một chỉnh thể. Lịch sử tiến qua các hình thái (nguyên thủy → chiếm hữu nô lệ → phong kiến → tư bản → …) do mâu thuẫn LLSX–QHSX thúc đẩy. Điều này cho lịch sử một lời giải có quy luật, duy vật.</p>

<div class="out"><strong>Ví dụ có lời giải — kinh tế số:</strong> lực lượng sản xuất mới (internet, AI, nền tảng) đang vượt quá quan hệ sản xuất cũ (luật lao động thời công nghiệp, sở hữu, quy tắc SHTT). Ma sát ta thấy — tranh chấp gig-work, cuộc chiến sở hữu dữ liệu, quản lý nền tảng — chính là một mâu thuẫn LLSX–QHSX đòi hỏi quan hệ mới. Chủ nghĩa duy vật lịch sử dự báo thể chế rốt cuộc phải thích nghi với lực lượng mới.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Công nghệ như một lực lượng sản xuất định hình lại xã hội.</b> Mỗi bước ngoặt công nghệ lớn (in ấn, hơi nước, máy tính, AI) rốt cuộc đều định hình lại luật, việc làm và tư tưởng — một mẫu hình kiểm chứng được của chủ nghĩa duy vật lịch sử. Đây là lăng kính mạnh cho đề assignment #8: phân tích cách AI (một lực lượng sản xuất) đang gây áp lực lên quan hệ sản xuất hôm nay. <em>Ngoài syllabus, nhưng là ứng dụng thời sự nhất của lý thuyết.</em></div>
</div>`,
        },
        {
          title: '5.2 — Class, state, revolution & the human being|||5.2 — Giai cấp, nhà nước, cách mạng & con người',
          slug: 'mln111-5-2-giai-cap-con-nguoi',
          type: 'VIDEO',
          description: 'Giai cấp & đấu tranh giai cấp, nguồn gốc nhà nước, cách mạng xã hội, và quan điểm về con người.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>Class, state, and the human being</h2>
<p class="lead">Historical materialism explains the big social structures — classes, the state, revolutions — and ends with a view of the human being. All flow from the economic base.</p>

<h3>Class & the state</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Class</span> Groups defined by their relation to the means of production (owners vs non-owners). Class arose with private property &amp; surplus.</div>
<div class="lz-layer"><span class="lz-lk">Class struggle</span> A driving force of history in class societies.</div>
<div class="lz-layer"><span class="lz-lk">The state</span> Arose from irreconcilable class contradictions — historically an instrument of the dominant class, with functions (management, coercion) and evolving forms.</div>
</div>

<h3>Social revolution</h3>
<p>When the LLSX–QHSX contradiction (Ch5.1) becomes acute and the old superstructure blocks progress, <strong>social revolution</strong> transforms society to a higher formation. Revolution is the resolution of a deep social contradiction — the dialectic (Ch3) operating at the scale of whole societies.</p>

<h3>The human being — the masses make history</h3>
<ul>
<li><strong>Human essence:</strong> Marx — "the human essence is the ensemble of social relations." We're shaped by society, not by an abstract fixed nature.</li>
<li><strong>Masses vs individual:</strong> the popular masses are the true makers of history (they produce, and drive revolutions); outstanding individuals matter but act within conditions the masses create.</li>
<li><strong>Goal:</strong> the free, all-round development of every person — the humanist aim of the philosophy.</li>
</ul>

<div class="out"><strong>Worked example — masses vs individual:</strong> a great founder builds a famous company (individual), but only because a whole society produced the education, technology, market and workers that made it possible (the masses &amp; conditions). Historical materialism doesn't deny great individuals — it insists they act on a stage the masses built. Balanced analysis credits both, in proportion.</div>

<div class="callout ok"><strong>The through-line of Part 3:</strong> the economic base → shapes classes → shapes the state → whose contradictions drive revolutions → all made by real, socially-formed humans. Society is a lawful, changeable, material process — the opposite of "history is just great men and ideas."</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>"Human essence = ensemble of social relations" and identity today.</b> This anticipates modern social science: identity, values and even personality are largely socially formed, not innate. It's a materialist counter to "human nature is fixed" — and a rich angle for analyzing how digital society reshapes people (assignment topic #10). <em>Beyond the syllabus, but where the philosophy meets contemporary social thought.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Giai cấp, nhà nước, và con người</h2>
<p class="lead">Chủ nghĩa duy vật lịch sử giải thích các kết cấu xã hội lớn — giai cấp, nhà nước, cách mạng — và kết thúc bằng quan điểm về con người. Tất cả đều bắt nguồn từ cơ sở kinh tế.</p>

<h3>Giai cấp & nhà nước</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Giai cấp</span> Các tập đoàn người xác định bởi quan hệ với tư liệu sản xuất (người sở hữu vs không sở hữu). Giai cấp nảy sinh cùng tư hữu &amp; sản phẩm thặng dư.</div>
<div class="lz-layer"><span class="lz-lk">Đấu tranh giai cấp</span> Một động lực của lịch sử trong xã hội có giai cấp.</div>
<div class="lz-layer"><span class="lz-lk">Nhà nước</span> Nảy sinh từ mâu thuẫn giai cấp không thể điều hòa — lịch sử là công cụ của giai cấp thống trị, có các chức năng (quản lý, cưỡng chế) và hình thức tiến hóa.</div>
</div>

<h3>Cách mạng xã hội</h3>
<p>Khi mâu thuẫn LLSX–QHSX (Ch5.1) trở nên gay gắt và thượng tầng cũ cản trở tiến bộ, <strong>cách mạng xã hội</strong> cải biến xã hội lên một hình thái cao hơn. Cách mạng là sự giải quyết một mâu thuẫn xã hội sâu sắc — phép biện chứng (Ch3) vận hành ở quy mô cả xã hội.</p>

<h3>Con người — quần chúng làm nên lịch sử</h3>
<ul>
<li><strong>Bản chất con người:</strong> Marx — "bản chất con người là tổng hòa các quan hệ xã hội." Ta được xã hội định hình, không phải bởi một bản tính cố định trừu tượng.</li>
<li><strong>Quần chúng vs cá nhân:</strong> quần chúng nhân dân là người sáng tạo chân chính của lịch sử (họ sản xuất, và thúc đẩy cách mạng); cá nhân kiệt xuất có vai trò nhưng hành động trong điều kiện quần chúng tạo ra.</li>
<li><strong>Mục tiêu:</strong> sự phát triển tự do, toàn diện của mỗi người — mục đích nhân văn của triết học.</li>
</ul>

<div class="out"><strong>Ví dụ có lời giải — quần chúng vs cá nhân:</strong> một founder vĩ đại xây một công ty nổi tiếng (cá nhân), nhưng chỉ vì cả một xã hội đã tạo ra giáo dục, công nghệ, thị trường và người lao động khiến điều đó khả thi (quần chúng &amp; điều kiện). Chủ nghĩa duy vật lịch sử không phủ nhận cá nhân vĩ đại — nó khẳng định họ hành động trên một sân khấu quần chúng dựng nên. Phân tích cân bằng ghi công cả hai, theo tỷ lệ.</div>

<div class="callout ok"><strong>Mạch xuyên suốt Phần 3:</strong> cơ sở kinh tế → định hình giai cấp → định hình nhà nước → mâu thuẫn của chúng thúc đẩy cách mạng → tất cả do những con người thật, được xã hội hình thành làm nên. Xã hội là một quá trình vật chất, có quy luật, thay đổi được — ngược với "lịch sử chỉ là những vĩ nhân và ý niệm".</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>"Bản chất con người = tổng hòa các quan hệ xã hội" và bản sắc hôm nay.</b> Điều này báo trước khoa học xã hội hiện đại: bản sắc, giá trị và cả tính cách phần lớn được hình thành bởi xã hội, không phải bẩm sinh. Đó là phản đề duy vật cho "bản tính con người là cố định" — và một góc giàu để phân tích cách xã hội số định hình lại con người (đề assignment #10). <em>Ngoài syllabus, nhưng là nơi triết học gặp tư tưởng xã hội đương đại.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'The core claim of historical materialism is:|||Luận điểm cốt lõi của chủ nghĩa duy vật lịch sử là:',
                options: [
                  'Ideas determine the economy|||Ý niệm quyết định kinh tế',
                  'Social being determines social consciousness|||Tồn tại xã hội quyết định ý thức xã hội',
                  'History is random|||Lịch sử ngẫu nhiên',
                  'Only great men make history|||Chỉ vĩ nhân làm nên lịch sử',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'What drives change between socio-economic formations?|||Cái gì thúc đẩy sự thay đổi giữa các hình thái kinh tế-xã hội?',
                options: [
                  'Random chance|||May rủi ngẫu nhiên',
                  'The contradiction between productive forces and relations of production|||Mâu thuẫn giữa lực lượng sản xuất và quan hệ sản xuất',
                  'The weather|||Thời tiết',
                  'Individual willpower alone|||Chỉ ý chí cá nhân',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'The economic base and the superstructure relate how?|||Cơ sở kinh tế và kiến trúc thượng tầng quan hệ thế nào?',
                options: [
                  'The superstructure determines the base|||Thượng tầng quyết định cơ sở',
                  'The base determines the superstructure, which reacts back|||Cơ sở quyết định thượng tầng, thượng tầng tác động trở lại',
                  'They are unrelated|||Không liên quan',
                  'Only the superstructure exists|||Chỉ thượng tầng tồn tại',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'By Marx, "the human essence is":|||Theo Marx, "bản chất con người là":',
                options: [
                  'A fixed, innate nature|||Một bản tính cố định, bẩm sinh',
                  'The ensemble of social relations|||Tổng hòa các quan hệ xã hội',
                  'Purely biological|||Thuần túy sinh học',
                  'Unknowable|||Bất khả tri',
                ], correctIndex: 1,
              },
              {
                id: 'q5', points: 1,
                question: 'On who makes history, historical materialism holds:|||Về ai làm nên lịch sử, chủ nghĩa duy vật lịch sử cho rằng:',
                options: [
                  'Only outstanding individuals|||Chỉ cá nhân kiệt xuất',
                  'The popular masses are the true makers; individuals act within conditions they create|||Quần chúng là người sáng tạo chân chính; cá nhân hành động trong điều kiện họ tạo ra',
                  'No one makes history|||Không ai làm nên lịch sử',
                  'Only kings and generals|||Chỉ vua và tướng lĩnh',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 6 — ÔN THI ══════════════════ */
    {
      title: 'Chapter 6 — Exam prep: question bank & essay skills|||Chương 6 — Ôn thi: ngân hàng câu hỏi & kỹ năng viết luận',
      description: 'Chương ÔN THI: ngân hàng câu hỏi theo phần, bảng phân biệt các quy luật/phạm trù dễ nhầm, và khung viết luận điểm cao.',
      lessons: [
        {
          title: '6.1 — Question bank by CLO & essay skills|||6.1 — Ngân hàng câu hỏi theo CLO & kỹ năng viết luận',
          slug: 'mln111-6-1-on-thi',
          type: 'article',
          description: 'Câu hỏi thi hay gặp nhóm theo phần, bảng phân biệt cặp dễ nhầm, và khung 5 phần cho tiểu luận.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1 · Exam prep</span>
<h2>Prepare answers before the exam</h2>
<p class="lead">The exam (30%, gate ≥4) tests CLO1-5. Below is a question bank by part, the confusing pairs you must distinguish, and the essay skeleton that earns marks.</p>

<h3>Question bank (by part)</h3>
<ul>
<li><strong>Part 1:</strong> What is the basic question of philosophy? Distinguish materialism/idealism and dialectics/metaphysics.</li>
<li><strong>Part 2 — matter/consciousness:</strong> State &amp; analyze Lenin's definition of matter. Explain the matter–consciousness relationship.</li>
<li><strong>Part 2 — dialectics:</strong> State the 2 principles. Explain each of the 3 laws WITH an example. Explain any category pair with an example.</li>
<li><strong>Part 2 — knowledge:</strong> Why is practice the criterion of truth? Describe the path of cognition.</li>
<li><strong>Part 3:</strong> Explain "social being determines social consciousness." Analyze the LLSX–QHSX law. Base/superstructure? Role of the masses?</li>
</ul>

<h3>Confusing pairs — make a comparison for each</h3>
<table>
<thead><tr><th>Distinguish</th><th>Key difference</th></tr></thead>
<tbody>
<tr><td>The 3 laws</td><td>Quantity-quality = HOW; contradiction = WHY/source; negation² = DIRECTION (spiral)</td></tr>
<tr><td>Cause-effect vs necessity-chance</td><td>Producer→product vs must-happen (essence) vs accidental</td></tr>
<tr><td>Essence vs appearance</td><td>Inner nature vs outer manifestation</td></tr>
<tr><td>Content vs form</td><td>The substance vs how it's organized/expressed</td></tr>
<tr><td>Materialism vs dialectics</td><td>Answer to "what's primary" vs the method of thinking</td></tr>
<tr><td>Base vs superstructure</td><td>Economic structure vs politics/law/ideology</td></tr>
</tbody>
</table>

<h3>Essay skeleton (for assignment & essay questions)</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">1 · Principle</span> State the law/category precisely.</div>
<div class="lz-layer"><span class="lz-lk">2 · Case</span> A concrete real example.</div>
<div class="lz-layer"><span class="lz-lk">3 · Analysis</span> Apply the principle TO the case — where marks live.</div>
<div class="lz-layer"><span class="lz-lk">4 · Lesson</span> The methodological/practical takeaway.</div>
<div class="lz-layer"><span class="lz-lk">5 · Your view</span> A reasoned conclusion.</div>
</div>

<div class="callout ok"><strong>Exam tactic:</strong> for any law/category question, always give the definition PLUS your own example PLUS the methodological lesson ("so in practice we should…"). Definition-only answers cap at average marks.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The "definition → mechanism → example → significance" pattern.</b> Structure every theory answer this way and you never freeze: what it is → how it works → a concrete instance → why it matters / what to do. It turns memorized fragments into a complete, high-scoring answer. <em>Beyond the syllabus, but the template that reliably lifts theory answers.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1 · Ôn thi</span>
<h2>Chuẩn bị câu trả lời trước khi thi</h2>
<p class="lead">Bài thi (30%, cổng ≥4) kiểm CLO1-5. Dưới đây là ngân hàng câu hỏi theo phần, các cặp dễ nhầm bạn phải phân biệt, và khung viết luận ăn điểm.</p>

<h3>Ngân hàng câu hỏi (theo phần)</h3>
<ul>
<li><strong>Phần 1:</strong> Vấn đề cơ bản của triết học là gì? Phân biệt duy vật/duy tâm và biện chứng/siêu hình.</li>
<li><strong>Phần 2 — vật chất/ý thức:</strong> Nêu &amp; phân tích định nghĩa vật chất của Lênin. Giải thích quan hệ vật chất–ý thức.</li>
<li><strong>Phần 2 — biện chứng:</strong> Nêu 2 nguyên lý. Giải thích từng quy luật trong 3 quy luật KÈM ví dụ. Giải thích một cặp phạm trù kèm ví dụ.</li>
<li><strong>Phần 2 — nhận thức:</strong> Vì sao thực tiễn là tiêu chuẩn của chân lý? Mô tả con đường nhận thức.</li>
<li><strong>Phần 3:</strong> Giải thích "tồn tại xã hội quyết định ý thức xã hội." Phân tích quy luật LLSX–QHSX. Cơ sở/thượng tầng? Vai trò quần chúng?</li>
</ul>

<h3>Các cặp dễ nhầm — lập so sánh cho mỗi cặp</h3>
<table>
<thead><tr><th>Phân biệt</th><th>Khác biệt then chốt</th></tr></thead>
<tbody>
<tr><td>3 quy luật</td><td>Lượng-chất = THẾ NÀO; mâu thuẫn = VÌ SAO/nguồn gốc; phủ định² = HƯỚNG (xoáy ốc)</td></tr>
<tr><td>Nhân-quả vs tất nhiên-ngẫu nhiên</td><td>Sinh ra→sản phẩm vs phải-xảy-ra (bản chất) vs ngẫu nhiên</td></tr>
<tr><td>Bản chất vs hiện tượng</td><td>Bản tính bên trong vs biểu hiện bên ngoài</td></tr>
<tr><td>Nội dung vs hình thức</td><td>Cái bản thể vs cách nó được tổ chức/biểu hiện</td></tr>
<tr><td>Duy vật vs biện chứng</td><td>Câu trả lời "cái nào có trước" vs phương pháp tư duy</td></tr>
<tr><td>Cơ sở vs thượng tầng</td><td>Kết cấu kinh tế vs chính trị/pháp luật/tư tưởng</td></tr>
</tbody>
</table>

<h3>Khung viết luận (cho assignment & câu hỏi tự luận)</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">1 · Nguyên lý</span> Nêu quy luật/phạm trù chính xác.</div>
<div class="lz-layer"><span class="lz-lk">2 · Ca thật</span> Một ví dụ thật cụ thể.</div>
<div class="lz-layer"><span class="lz-lk">3 · Phân tích</span> Vận dụng nguyên lý VÀO ca — điểm nằm ở đây.</div>
<div class="lz-layer"><span class="lz-lk">4 · Bài học</span> Bài học phương pháp/thực tiễn.</div>
<div class="lz-layer"><span class="lz-lk">5 · Chính kiến</span> Kết luận có lập luận.</div>
</div>

<div class="callout ok"><strong>Chiến thuật thi:</strong> với mọi câu về quy luật/phạm trù, luôn cho định nghĩa CỘNG ví dụ của chính bạn CỘNG bài học phương pháp ("nên trong thực tiễn ta cần…"). Câu trả lời chỉ định nghĩa dừng ở điểm trung bình.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Mẫu "định nghĩa → cơ chế → ví dụ → ý nghĩa".</b> Cấu trúc mọi câu trả lời lý thuyết theo cách này và bạn không bao giờ bí: nó là gì → vận hành thế nào → một ví dụ cụ thể → vì sao quan trọng / làm gì. Nó biến những mảnh học thuộc thành một câu trả lời trọn vẹn, điểm cao. <em>Ngoài syllabus, nhưng là khuôn tin cậy nâng câu trả lời lý thuyết.</em></div>
</div>`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 7 — NÂNG CAO ★ ══════════════════ */
    {
      title: 'Chapter 7 — Beyond the syllabus ★: dialectics in science, technology & daily life|||Chương 7 — Ngoài giáo trình ★: biện chứng trong khoa học, công nghệ & đời sống',
      description: 'Chương NÂNG CAO ngoài giáo trình: vận dụng phương pháp biện chứng vào tư duy khoa học, công nghệ, AI và ra quyết định hằng ngày.',
      lessons: [
        {
          title: '7.1 ★ — Using the dialectical method today|||7.1 ★ — Vận dụng phương pháp biện chứng hôm nay',
          slug: 'mln111-7-1-van-dung-hien-dai',
          type: 'VIDEO',
          description: 'Biện chứng như một công cụ tư duy: phân tích hệ thống, mâu thuẫn, sự thay đổi — trong khoa học, công nghệ và quyết định cá nhân.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1 · ★ Beyond the syllabus</span>
<h2>The dialectic as a general-purpose thinking tool</h2>
<p class="lead"><span class="badge">★ Beyond the syllabus</span> The real payoff of MLN111 isn't reciting laws — it's using the method to think better about anything. Here's the dialectic applied to science, technology and your own decisions.</p>

<h3>1 · Systems thinking (universal connection)</h3>
<p>The principle of universal connection is modern <em>systems thinking</em>: don't analyze a bug, a market, or an ecosystem in isolation — trace its connections. A good engineer debugging a distributed system, or a doctor treating a patient holistically, is applying this principle whether they name it or not.</p>

<h3>2 · Contradiction as a design lens</h3>
<p>Every real design has contradictions to resolve: speed vs cost, security vs usability, flexibility vs simplicity. The dialectic says: don't pretend the tension away — find the resolution that raises the whole to a higher level. This is exactly how good architecture and product decisions are made.</p>

<h3>3 · Quantity → quality in growth</h3>
<p>Skills, habits, communities, and products all show the leap: patient accumulation, then a sudden threshold (fluency, virality, network effect). Knowing this keeps you going through the flat "99°" phase — the leap comes if you don't quit before the node.</p>

<h3>4 · Negation of negation in technology</h3>
<p>Technology evolves in spirals: mainframes → PCs → cloud (a "return" to centralized computing, but on a higher level); monoliths → microservices → back toward consolidation, each time richer. Recognizing the spiral helps you anticipate where a field is heading.</p>

<div class="out"><strong>Worked example — applying the whole method to a decision:</strong> "Should our team adopt a new framework?"
• <em>Connection:</em> how does it affect the whole system, team, timeline — not just the code?
• <em>Contradiction:</em> the tension is "productivity gains vs learning cost" — how to resolve, not deny?
• <em>Quantity-quality:</em> is the accumulated pain of the old tool near a threshold that justifies the leap?
• <em>Practice as criterion:</em> don't argue endlessly — run a small real trial and let evidence decide.
That's dialectical materialism as a decision procedure — genuinely useful, not just examinable.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The dialectic and AI.</b> AI development itself is dialectical: models improve through contradiction (adversarial training), leap in capability at scale thresholds (quantity→quality / emergent abilities), and each generation negates and surpasses the last (negation of negation). Analyzing AI through these laws is a standout assignment (topic #12) — proving the 19th-century method still cuts. <em>The deepest ★ skill: the method is alive, not a museum piece.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1 · ★ Ngoài giáo trình</span>
<h2>Phép biện chứng như một công cụ tư duy đa dụng</h2>
<p class="lead"><span class="badge">★ Ngoài giáo trình</span> Giá trị thật của MLN111 không phải đọc vẹt quy luật — mà là dùng phương pháp để tư duy tốt hơn về mọi thứ. Đây là phép biện chứng vận dụng vào khoa học, công nghệ và quyết định của chính bạn.</p>

<h3>1 · Tư duy hệ thống (mối liên hệ phổ biến)</h3>
<p>Nguyên lý mối liên hệ phổ biến chính là <em>tư duy hệ thống</em> hiện đại: đừng phân tích một bug, một thị trường, hay một hệ sinh thái một cách cô lập — truy các mối liên hệ của nó. Một kỹ sư giỏi debug một hệ phân tán, hay một bác sĩ chữa bệnh nhân một cách toàn diện, đang vận dụng nguyên lý này dù có gọi tên hay không.</p>

<h3>2 · Mâu thuẫn như một lăng kính thiết kế</h3>
<p>Mọi thiết kế thật đều có mâu thuẫn cần giải: tốc độ vs chi phí, bảo mật vs dễ dùng, linh hoạt vs đơn giản. Biện chứng nói: đừng giả vờ căng thẳng không tồn tại — tìm cách giải nâng cả thể lên mức cao hơn. Đây chính là cách những quyết định kiến trúc và sản phẩm tốt được đưa ra.</p>

<h3>3 · Lượng → chất trong tăng trưởng</h3>
<p>Kỹ năng, thói quen, cộng đồng, và sản phẩm đều cho thấy bước nhảy: tích lũy kiên nhẫn, rồi một ngưỡng đột ngột (thành thạo, viral, hiệu ứng mạng). Biết điều này giữ bạn đi tiếp qua pha "99°" phẳng — bước nhảy sẽ tới nếu bạn không bỏ trước điểm nút.</p>

<h3>4 · Phủ định của phủ định trong công nghệ</h3>
<p>Công nghệ tiến hóa theo xoáy ốc: mainframe → PC → cloud (một "trở về" với tính toán tập trung, nhưng ở mức cao hơn); monolith → microservices → quay lại hợp nhất, mỗi lần phong phú hơn. Nhận ra đường xoáy ốc giúp bạn dự đoán một lĩnh vực đang đi đâu.</p>

<div class="out"><strong>Ví dụ có lời giải — vận dụng cả phương pháp vào một quyết định:</strong> "Đội mình có nên dùng framework mới không?"
• <em>Liên hệ:</em> nó ảnh hưởng cả hệ thống, đội, tiến độ thế nào — không chỉ code?
• <em>Mâu thuẫn:</em> căng thẳng là "lợi ích năng suất vs chi phí học" — giải thế nào, không phủ nhận?
• <em>Lượng-chất:</em> nỗi đau tích lũy của công cụ cũ đã gần một ngưỡng biện minh cho bước nhảy chưa?
• <em>Thực tiễn là tiêu chuẩn:</em> đừng cãi mãi — chạy một thử nghiệm nhỏ thật và để bằng chứng quyết định.
Đó là chủ nghĩa duy vật biện chứng như một quy trình ra quyết định — thực sự hữu ích, không chỉ để thi.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Phép biện chứng và AI.</b> Bản thân sự phát triển AI mang tính biện chứng: mô hình cải thiện qua mâu thuẫn (huấn luyện đối kháng), nhảy vọt năng lực ở ngưỡng quy mô (lượng→chất / năng lực trồi lên), và mỗi thế hệ phủ định và vượt thế hệ trước (phủ định của phủ định). Phân tích AI qua các quy luật này là một assignment nổi bật (đề #12) — chứng minh phương pháp thế kỷ 19 vẫn sắc. <em>Kỹ năng ★ sâu nhất: phương pháp còn sống, không phải một hiện vật bảo tàng.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              {
                id: 'q1', points: 1,
                question: '(Beyond syllabus) The principle of universal connection corresponds to modern:|||(Ngoài giáo trình) Nguyên lý mối liên hệ phổ biến tương ứng với hiện đại:',
                options: [
                  'Isolated analysis|||Phân tích cô lập',
                  'Systems thinking|||Tư duy hệ thống',
                  'Ignoring context|||Bỏ qua bối cảnh',
                  'Random guessing|||Đoán ngẫu nhiên',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'Applying the dialectic to a design trade-off (e.g. security vs usability) means:|||Vận dụng biện chứng vào một đánh đổi thiết kế (vd bảo mật vs dễ dùng) nghĩa là:',
                options: [
                  'Deny the tension exists|||Phủ nhận căng thẳng tồn tại',
                  'Find a resolution that raises the whole to a higher level|||Tìm cách giải nâng cả thể lên mức cao hơn',
                  'Always pick the cheapest|||Luôn chọn cái rẻ nhất',
                  'Ignore the problem|||Bỏ qua vấn đề',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'The evolution mainframes → PCs → cloud illustrates:|||Sự tiến hóa mainframe → PC → cloud minh họa:',
                options: [
                  'A straight line|||Một đường thẳng',
                  'Negation of negation (spiral return at a higher level)|||Phủ định của phủ định (trở về xoáy ốc ở mức cao hơn)',
                  'No change|||Không thay đổi',
                  'Pure chance|||Ngẫu nhiên thuần túy',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'When deciding whether to adopt a new tool, the dialectical-materialist final step is:|||Khi quyết định có dùng công cụ mới không, bước cuối duy vật biện chứng là:',
                options: [
                  'Argue endlessly|||Cãi mãi',
                  'Run a small real trial and let practice/evidence decide|||Chạy một thử nghiệm nhỏ thật và để thực tiễn/bằng chứng quyết định',
                  'Flip a coin|||Tung đồng xu',
                  'Ask the loudest person|||Hỏi người nói to nhất',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },
  ],
};
