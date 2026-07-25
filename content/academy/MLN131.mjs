/**
 * MLN131 — Chủ nghĩa xã hội khoa học (Kỳ 9). 2 tín chỉ. Prereq MLN111, MLN122.
 * Bộ phận thứ ba của chủ nghĩa Mác-Lênin. 7 chương: nhập môn; sứ mệnh lịch sử giai cấp công nhân;
 * CNXH & thời kỳ quá độ; dân chủ XHCN & nhà nước XHCN; cơ cấu xã hội-giai cấp & liên minh;
 * dân tộc & tôn giáo; gia đình — trong thời kỳ quá độ lên CNXH.
 * KHÔNG code → link tài liệu chính chủ + Exp Hub công cụ học.
 * Grading: Participation 10% + Progress Test 20% + Assignment 40% + Final 30% (>=4); pass FR>=5 & Final>=4.
 * Chuẩn SWP391 gold: Mục 0 6 bài + 7 chương bám giáo trình + ÔN THI + NÂNG CAO ★.
 * Song ngữ EN/VN đối xứng (ml-en == ml-vi). shortDescription < 500.
 */
export default {
  semester: { code: 'FPTU_Hola9', name: 'Kỳ 9', ordinal: 11 },
  course: {
    academyType: 'FPT',
    courseCode: 'MLN131',
    title: 'Scientific Socialism',
    slug: 'scientific-socialism',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'The third part of Marxism-Leninism across seven chapters: the working class\'s historic mission, socialism & the transition, socialist democracy & state, class structure & alliance, the nation & religion, and the family — with essay and exam prep.|||Bộ phận thứ ba của chủ nghĩa Mác-Lênin qua bảy chương: sứ mệnh lịch sử giai cấp công nhân, CNXH & thời kỳ quá độ, dân chủ & nhà nước XHCN, cơ cấu giai cấp & liên minh, dân tộc & tôn giáo, và gia đình — kèm ôn tập tiểu luận và thi.',
    description: 'MLN131 (Chủ nghĩa xã hội khoa học) là môn lý luận chính trị bắt buộc, nối tiếp MLN111 (Triết học Mác-Lênin) và MLN122 (Kinh tế chính trị Mác-Lênin). Chủ nghĩa xã hội khoa học là một trong ba bộ phận hợp thành chủ nghĩa Mác-Lênin, luận giải trên cơ sở khoa học về con đường tất yếu đi lên chủ nghĩa xã hội của loài người và sứ mệnh lịch sử của giai cấp công nhân. Bảy chương đi từ nhập môn (sự ra đời, giai đoạn phát triển, đối tượng, phương pháp) → sứ mệnh lịch sử của giai cấp công nhân → chủ nghĩa xã hội và thời kỳ quá độ lên CNXH → dân chủ xã hội chủ nghĩa và nhà nước xã hội chủ nghĩa → cơ cấu xã hội - giai cấp và liên minh giai cấp, tầng lớp → vấn đề dân tộc và tôn giáo → vấn đề gia đình — tất cả trong thời kỳ quá độ lên CNXH ở Việt Nam. Đánh giá gồm Chuyên cần 10% + Progress Test 20% + Bài tập/Tiểu luận 40% + Thi cuối kỳ 30%. Môn học rèn tư duy phản biện, năng lực lý luận và khả năng vận dụng vào đời sống.',
    whatYouLearn: 'Sự ra đời, các giai đoạn phát triển, đối tượng và phương pháp của chủ nghĩa xã hội khoa học; sứ mệnh lịch sử của giai cấp công nhân (nội dung, điều kiện khách quan – chủ quan, giai cấp công nhân Việt Nam); quan niệm khoa học về chủ nghĩa xã hội, những đặc trưng và thời kỳ quá độ lên CNXH; dân chủ xã hội chủ nghĩa và nhà nước xã hội chủ nghĩa (bản chất, mối quan hệ, xây dựng ở Việt Nam); cơ cấu xã hội - giai cấp và liên minh công - nông - trí thức trong thời kỳ quá độ; vấn đề dân tộc và tôn giáo (Cương lĩnh dân tộc của Lênin, nguyên tắc giải quyết ở Việt Nam); và vấn đề gia đình (vị trí, chức năng, cơ sở xây dựng gia đình trong thời kỳ quá độ). Kèm phương pháp lập luận, phản biện và vận dụng lý luận vào các vấn đề xã hội hiện nay.',
    requirements: 'Tiên quyết MLN111 (Triết học Mác-Lênin) và MLN122 (Kinh tế chính trị Mác-Lênin). Cần: giáo trình Chủ nghĩa xã hội khoa học (bản dành cho hệ không chuyên lý luận chính trị), truy cập C. Mác và Ph. Ăngghen Toàn tập, V.I. Lênin Toàn tập. Dự lớp tối thiểu 80% mới được thi. Có thể dùng công cụ AI hỗ trợ học tập một cách có trách nhiệm.',
    documentsNote: 'Tài liệu chính: Giáo trình Chủ nghĩa xã hội khoa học (Bộ GD&ĐT, bản cho hệ không chuyên) • C. Mác và Ph. Ăngghen Toàn tập • V.I. Lênin Toàn tập • Văn kiện Đại hội Đảng • Tài liệu về phòng, chống tham nhũng. Nguồn tra cứu chính chủ và công cụ học tập → Exp Hub. Môn học không code — trọng tâm là hiểu hệ thống lý luận, phân tích luận điểm và vận dụng vào thực tiễn.',
  },
  sections: [
    /* ══════════════════ MỤC 0 — GIỚI THIỆU & HƯỚNG DẪN ══════════════════ */
    {
      title: 'Section 0 — Introduction & Study Guide|||Mục 0 — Giới thiệu & Hướng dẫn học',
      description: 'Đọc trước tiên: môn học vận hành thế nào, thang điểm 4 cột, CLO, tài liệu & công cụ, ngân hàng đề tài tiểu luận và cách không trượt / ăn điểm cao.',
      lessons: [
        {
          title: '0.1 — What MLN131 is & the seven-chapter map|||0.1 — MLN131 là gì & bản đồ bảy chương',
          slug: 'mln131-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Bức tranh toàn cảnh: bộ phận thứ ba của chủ nghĩa Mác-Lênin, luận giải khoa học về con đường lên CNXH và sứ mệnh giai cấp công nhân.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>MLN131 — the scientific case for socialism, in one system</h2>
<p class="lead">MLN131 (Scientific Socialism) is the <strong>third of the three parts of Marxism-Leninism</strong> — after philosophy (MLN111) and political economy (MLN122). Where philosophy gives the worldview and economics analyzes capitalism, scientific socialism draws the conclusion: capitalism will be replaced by socialism, and the <strong>working class</strong> is the force that carries out that historic mission.</p>
<p>The seven chapters form one argument: <em>who</em> makes the change (the working class) → <em>what</em> is being built (socialism, the transition) → <em>how</em> it is organized (democracy, the state, class alliance) → and the <em>specific issues</em> along the way (nation & religion, the family).</p>

<h3>The whole course in one map</h3>
<div class="lz-map">
  <div class="lz-stage">Foundations</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Introduction</div><div class="lz-nsub">birth · stages · object · method</div></div></div>
  <div class="lz-stage">The agent</div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">The working class's mission</div><div class="lz-nsub">why the working class · conditions</div></div></div>
  <div class="lz-stage">The goal</div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Socialism & the transition</div><div class="lz-nsub">characteristics · the transition period</div></div></div>
  <div class="lz-stage">The organization</div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Socialist democracy & state</div><div class="lz-nsub">nature · relationship · in Vietnam</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Class structure & alliance</div><div class="lz-nsub">worker-peasant-intellectual alliance</div></div></div>
  <div class="lz-stage">Specific issues</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Nation & religion</div><div class="lz-nsub">Lenin's programme · Vietnam's principles</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">The family</div><div class="lz-nsub">position · functions · building it</div></div></div>
  <div class="lz-stage">Beyond the syllabus ★</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Applying it today · rebutting distortions</div><div class="lz-nsub">critical thinking</div></div></div>
</div>

<div class="callout ok"><strong>The connecting thread:</strong> <em>the historic mission of the working class.</em> Chapter 2 states it; every later chapter is a condition for fulfilling it — you cannot build socialism (Ch3) without the right democracy and state (Ch4), a firm class alliance (Ch5), and solving the questions of nation, religion and family (Ch6-7). Hold this thread and the seven chapters become one line of reasoning.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Why "scientific" socialism.</b> Marx and Engels called their socialism "scientific" to distinguish it from earlier "utopian" socialism (More, Owen, Fourier), which dreamed of a just society but had no analysis of <em>how</em> to get there. Scientific socialism grounds the goal in the laws of history and identifies the real social force to achieve it. Knowing this utopian-vs-scientific contrast is a favorite exam point. <em>Context that frames the whole subject.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>MLN131 — luận chứng khoa học cho chủ nghĩa xã hội, trong một hệ thống</h2>
<p class="lead">MLN131 (Chủ nghĩa xã hội khoa học) là <strong>bộ phận thứ ba trong ba bộ phận của chủ nghĩa Mác-Lênin</strong> — sau triết học (MLN111) và kinh tế chính trị (MLN122). Nơi triết học cho thế giới quan và kinh tế học phân tích chủ nghĩa tư bản, chủ nghĩa xã hội khoa học rút ra kết luận: chủ nghĩa tư bản sẽ được thay thế bằng chủ nghĩa xã hội, và <strong>giai cấp công nhân</strong> là lực lượng thực hiện sứ mệnh lịch sử ấy.</p>
<p>Bảy chương hợp thành một luận điểm: <em>ai</em> tạo ra sự thay đổi (giai cấp công nhân) → <em>cái gì</em> đang được xây dựng (CNXH, thời kỳ quá độ) → <em>tổ chức thế nào</em> (dân chủ, nhà nước, liên minh giai cấp) → và những <em>vấn đề cụ thể</em> trên đường đi (dân tộc & tôn giáo, gia đình).</p>

<h3>Cả môn học trong một bản đồ</h3>
<div class="lz-map">
  <div class="lz-stage">Nền tảng</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Nhập môn</div><div class="lz-nsub">sự ra đời · giai đoạn · đối tượng · phương pháp</div></div></div>
  <div class="lz-stage">Chủ thể</div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Sứ mệnh giai cấp công nhân</div><div class="lz-nsub">vì sao giai cấp công nhân · điều kiện</div></div></div>
  <div class="lz-stage">Mục tiêu</div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">CNXH & thời kỳ quá độ</div><div class="lz-nsub">đặc trưng · thời kỳ quá độ</div></div></div>
  <div class="lz-stage">Tổ chức</div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Dân chủ & nhà nước XHCN</div><div class="lz-nsub">bản chất · mối quan hệ · ở Việt Nam</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Cơ cấu giai cấp & liên minh</div><div class="lz-nsub">liên minh công-nông-trí</div></div></div>
  <div class="lz-stage">Vấn đề cụ thể</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Dân tộc & tôn giáo</div><div class="lz-nsub">Cương lĩnh Lênin · nguyên tắc Việt Nam</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Gia đình</div><div class="lz-nsub">vị trí · chức năng · xây dựng</div></div></div>
  <div class="lz-stage">Ngoài giáo trình ★</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Vận dụng hôm nay · phản bác xuyên tạc</div><div class="lz-nsub">tư duy phản biện</div></div></div>
</div>

<div class="callout ok"><strong>Sợi chỉ nối:</strong> <em>sứ mệnh lịch sử của giai cấp công nhân.</em> Chương 2 nêu nó; mọi chương sau là một điều kiện để hoàn thành — bạn không thể xây CNXH (Ch3) mà thiếu nền dân chủ và nhà nước đúng (Ch4), một liên minh giai cấp vững (Ch5), và giải quyết các vấn đề dân tộc, tôn giáo, gia đình (Ch6-7). Nắm sợi chỉ này thì bảy chương thành một mạch lập luận.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Vì sao là chủ nghĩa xã hội "khoa học".</b> Mác và Ăngghen gọi chủ nghĩa xã hội của mình là "khoa học" để phân biệt với chủ nghĩa xã hội "không tưởng" trước đó (More, Owen, Fourier) — mơ về một xã hội công bằng nhưng không có phân tích về <em>cách</em> đạt tới. Chủ nghĩa xã hội khoa học đặt mục tiêu trên các quy luật lịch sử và chỉ ra lực lượng xã hội thực để thực hiện. Biết sự đối lập không-tưởng-vs-khoa-học là một ý thi được ưa chuộng. <em>Bối cảnh đóng khung cả môn.</em></div>
</div>`,
        },
        {
          title: '0.2 — How you are graded: 4 components|||0.2 — Cách tính điểm: 4 thành phần',
          slug: 'mln131-thang-diem',
          type: 'article',
          description: 'Bảng thang điểm: Chuyên cần 10% + Progress Test 20% + Assignment 40% + Final 30%, cổng Final ≥ 4, pass FR ≥ 5.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>The grade breakdown — the Assignment (40%) carries the course</h2>
<p class="lead">MLN131 is 70% continuous work plus a 30% final. The <strong>Assignment (40%)</strong> — usually a group essay/presentation — is the biggest component. The Final has a <strong>≥ 4 gate</strong>.</p>
<table>
<thead><tr><th>Component</th><th>Weight</th><th>Gate</th><th>Form</th></tr></thead>
<tbody>
<tr><td>Participation</td><td><strong>10%</strong></td><td>—</td><td>Attendance + in-class contribution</td></tr>
<tr><td>Progress Test</td><td><strong>20%</strong></td><td>—</td><td>1 test</td></tr>
<tr><td>Assignment</td><td><strong>40%</strong></td><td>—</td><td>Group essay / presentation</td></tr>
<tr><td>Final Exam</td><td><strong>30%</strong></td><td>≥ 4</td><td>60'</td></tr>
</tbody>
</table>
<div class="kv-grid">
<div class="kv"><span class="k">Scale</span><span class="v">10</span></div>
<div class="kv"><span class="k">Pass final result</span><span class="v">≥ 5.0</span></div>
<div class="kv"><span class="k">Final exam gate</span><span class="v">≥ 4.0</span></div>
<div class="kv"><span class="k">Attendance</span><span class="v">≥ 80% to sit the final</span></div>
</div>
<div class="out"><strong>Worked example:</strong> Participation 8, Progress Test 7, Assignment 8, Final 3.5.
FR = 0.10·8 + 0.20·7 + 0.40·8 + 0.30·3.5 = 0.8 + 1.4 + 3.2 + 1.05 = 6.45.
FR ≥ 5 ✓ but Final = 3.5 < 4 → <strong>FAIL</strong> on the gate. Strong coursework cannot rescue a weak final.</div>
<div class="callout warn"><strong>The Assignment is your safest points.</strong> At 40% and under your control (unlike the timed final), a well-researched, well-argued group essay is the surest route to a high grade. Start early, use primary sources (Marx-Engels, Lenin), and rehearse the presentation.</div>
<div class="pitfall"><strong>The final is gated — don't neglect theory.</strong> A Final below 4 fails the course no matter how good your coursework is. Study each chapter and connect them; practice past-style questions.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Argue, don't summarize.</b> The strongest MLN131 essays take a position, support it with Marx/Engels/Lenin quotations, and connect to a current issue (the market economy, class alliance today, family in modern Vietnam). Argument + primary sources + contemporary application is the formula. <em>The difference between a 7 and a 9.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Cấu trúc điểm — Bài tập (40%) gánh cả môn</h2>
<p class="lead">MLN131 gồm 70% điểm quá trình cộng 30% thi cuối. <strong>Bài tập (40%)</strong> — thường là tiểu luận/thuyết trình nhóm — là thành phần lớn nhất. Thi cuối có <strong>cổng ≥ 4</strong>.</p>
<table>
<thead><tr><th>Thành phần</th><th>Trọng số</th><th>Cổng</th><th>Hình thức</th></tr></thead>
<tbody>
<tr><td>Chuyên cần</td><td><strong>10%</strong></td><td>—</td><td>Điểm danh + đóng góp trên lớp</td></tr>
<tr><td>Progress Test</td><td><strong>20%</strong></td><td>—</td><td>1 bài</td></tr>
<tr><td>Bài tập</td><td><strong>40%</strong></td><td>—</td><td>Tiểu luận / thuyết trình nhóm</td></tr>
<tr><td>Thi cuối kỳ</td><td><strong>30%</strong></td><td>≥ 4</td><td>60'</td></tr>
</tbody>
</table>
<div class="kv-grid">
<div class="kv"><span class="k">Thang</span><span class="v">10</span></div>
<div class="kv"><span class="k">Kết quả cuối qua</span><span class="v">≥ 5.0</span></div>
<div class="kv"><span class="k">Cổng thi cuối</span><span class="v">≥ 4.0</span></div>
<div class="kv"><span class="k">Điểm danh</span><span class="v">≥ 80% mới được thi</span></div>
</div>
<div class="out"><strong>Ví dụ có lời giải:</strong> Chuyên cần 8, Progress Test 7, Bài tập 8, Thi cuối 3.5.
FR = 0.10·8 + 0.20·7 + 0.40·8 + 0.30·3.5 = 0.8 + 1.4 + 3.2 + 1.05 = 6.45.
FR ≥ 5 ✓ nhưng Thi cuối = 3.5 < 4 → <strong>TRƯỢT</strong> ở cổng. Điểm quá trình tốt không cứu được bài thi yếu.</div>
<div class="callout warn"><strong>Bài tập là điểm chắc nhất của bạn.</strong> Với 40% và nằm trong tầm kiểm soát (khác bài thi tính giờ), một tiểu luận nhóm nghiên cứu kỹ, lập luận tốt là con đường chắc nhất tới điểm cao. Bắt đầu sớm, dùng nguồn gốc (Mác-Ăngghen, Lênin), và tập thuyết trình.</div>
<div class="pitfall"><strong>Thi cuối có cổng — đừng bỏ lý thuyết.</strong> Final dưới 4 là trượt môn dù điểm quá trình tốt đến đâu. Học từng chương và nối chúng; luyện câu hỏi kiểu đề cũ.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Lập luận, đừng tóm tắt.</b> Tiểu luận MLN131 mạnh nhất nêu một quan điểm, chống lưng bằng trích dẫn Mác/Ăngghen/Lênin, và nối với vấn đề hiện tại (kinh tế thị trường, liên minh giai cấp hôm nay, gia đình Việt Nam hiện đại). Lập luận + nguồn gốc + vận dụng đương đại là công thức. <em>Ranh giới giữa 7 và 9.</em></div>
</div>`,
        },
        {
          title: '0.3 — Course learning outcomes (CLOs)|||0.3 — Chuẩn đầu ra môn học (CLO)',
          slug: 'mln131-clo',
          type: 'article',
          description: '10 CLO (kiến thức, kỹ năng, thái độ) và bản đồ CLO → chương.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>Knowledge, skills and attitudes you build</h2>
<p class="lead">The CLOs split into three families: <em>knowledge</em> of scientific socialism (mapped one-to-one onto the chapters), <em>skills</em> of reasoning and argument, and <em>attitudes</em> of civic responsibility.</p>
<table>
<thead><tr><th>Family</th><th>You can…</th><th>Where</th></tr></thead>
<tbody>
<tr><td>Knowledge (CLO1-7)</td><td>Grasp the birth & method; the working class's mission; socialism & transition; socialist democracy & state; class structure & alliance; nation & religion; the family</td><td>Ch 1-7</td></tr>
<tr><td>Skills (CLO8, 10)</td><td>Understand practice, apply theory, argue, write, present, think critically</td><td>Assignment</td></tr>
<tr><td>Attitudes (CLO9)</td><td>Correct political attitude; citizen responsibility; apply theory to personal & social life</td><td>Whole course</td></tr>
</tbody>
</table>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Each knowledge CLO is one chapter.</b> Conveniently, CLO1-7 map directly to Chapters 1-7. So your revision checklist is simply: can I explain each chapter's core idea and connect it to the working class's mission? Prepare knowledge for the final, skills for the essay. <em>A study frame the CLO list implies.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Kiến thức, kỹ năng và thái độ bạn xây dựng</h2>
<p class="lead">Các CLO chia thành ba nhóm: <em>kiến thức</em> về chủ nghĩa xã hội khoa học (ánh xạ một-một với các chương), <em>kỹ năng</em> lập luận và viết, và <em>thái độ</em> trách nhiệm công dân.</p>
<table>
<thead><tr><th>Nhóm</th><th>Bạn có thể…</th><th>Ở đâu</th></tr></thead>
<tbody>
<tr><td>Kiến thức (CLO1-7)</td><td>Nắm sự ra đời & phương pháp; sứ mệnh giai cấp công nhân; CNXH & quá độ; dân chủ & nhà nước XHCN; cơ cấu & liên minh giai cấp; dân tộc & tôn giáo; gia đình</td><td>Ch 1-7</td></tr>
<tr><td>Kỹ năng (CLO8, 10)</td><td>Hiểu thực tiễn, vận dụng lý luận, lập luận, viết, thuyết trình, tư duy phản biện</td><td>Bài tập</td></tr>
<tr><td>Thái độ (CLO9)</td><td>Thái độ chính trị đúng đắn; trách nhiệm công dân; vận dụng lý luận vào đời sống cá nhân & xã hội</td><td>Cả môn</td></tr>
</tbody>
</table>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Mỗi CLO kiến thức là một chương.</b> Tiện lợi, CLO1-7 ánh xạ thẳng vào Chương 1-7. Nên checklist ôn của bạn đơn giản là: tôi giải thích được ý cốt lõi mỗi chương và nối nó với sứ mệnh giai cấp công nhân không? Chuẩn bị kiến thức cho bài thi, kỹ năng cho tiểu luận. <em>Một khung học mà danh sách CLO hàm ý.</em></div>
</div>`,
        },
        {
          title: '0.4 — Materials & study tools (Exp Hub)|||0.4 — Tài liệu & công cụ học (Exp Hub)',
          slug: 'mln131-cong-cu',
          type: 'article',
          description: 'Nguồn chính chủ (Mác-Ăngghen Toàn tập, Lênin Toàn tập, văn kiện Đảng) và công cụ học: sơ đồ tư duy, Zotero.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>Read primary sources, organize with study tools</h2>
<p class="lead">Not a coding course — your "tools" are reliable sources and note-taking. Grounding your essay in <em>primary</em> texts (Marx-Engels, Lenin) and Party documents, not second-hand summaries, is what separates strong work.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Primary</div><div class="lz-t">Marx-Engels / Lenin</div><div class="lz-d">the source texts</div></div>
  <div class="lz-step"><div class="lz-k">Official</div><div class="lz-t">Party documents</div><div class="lz-d">tulieuvankien.dangcongsan.vn</div></div>
  <div class="lz-step"><div class="lz-k">Organize</div><div class="lz-t">Mind maps</div><div class="lz-d">connect the seven chapters</div></div>
  <div class="lz-step"><div class="lz-k">Cite</div><div class="lz-t">Zotero</div><div class="lz-d">manage quotations</div></div>
</div>
<a class="link-card exphub" href="/exp-hub/mln131-cong-cu-hoc?ref=%2Fcourses%2Fscientific-socialism%2Flearn&reflabel=MLN131%20·%20Công%20cụ" >
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Exp Hub — MLN131 sources & study tools</span><span class="lc-sub">Marx-Engels / Lenin · Party documents · mind maps · Zotero</span></span>
  <span class="lc-cta">Open →</span>
</a>
<div class="callout ok"><strong>Use AI responsibly.</strong> The syllabus lists AI as a tool — use it to summarize or check understanding, never to write your essay or invent quotations. Verify every quote against the primary text before citing.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Đọc nguồn gốc, sắp xếp bằng công cụ học tập</h2>
<p class="lead">Không phải môn code — "công cụ" của bạn là nguồn tài liệu tin cậy và cách ghi chú. Đặt tiểu luận trên văn bản <em>gốc</em> (Mác-Ăngghen, Lênin) và văn kiện Đảng, không phải bản tóm tắt second-hand, mới làm nên bài tốt.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Nguồn gốc</div><div class="lz-t">Mác-Ăngghen / Lênin</div><div class="lz-d">văn bản gốc</div></div>
  <div class="lz-step"><div class="lz-k">Chính thống</div><div class="lz-t">Văn kiện Đảng</div><div class="lz-d">tulieuvankien.dangcongsan.vn</div></div>
  <div class="lz-step"><div class="lz-k">Sắp xếp</div><div class="lz-t">Sơ đồ tư duy</div><div class="lz-d">nối bảy chương</div></div>
  <div class="lz-step"><div class="lz-k">Trích nguồn</div><div class="lz-t">Zotero</div><div class="lz-d">quản lý trích dẫn</div></div>
</div>
<a class="link-card exphub" href="/exp-hub/mln131-cong-cu-hoc?ref=%2Fcourses%2Fscientific-socialism%2Flearn&reflabel=MLN131%20·%20Công%20cụ" >
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Exp Hub — Tài liệu & công cụ học MLN131</span><span class="lc-sub">Mác-Ăngghen / Lênin · văn kiện Đảng · sơ đồ tư duy · Zotero</span></span>
  <span class="lc-cta">Mở →</span>
</a>
<div class="callout ok"><strong>Dùng AI có trách nhiệm.</strong> Syllabus liệt kê AI là một công cụ — dùng để tóm tắt hoặc kiểm tra hiểu biết, đừng bao giờ để nó viết tiểu luận hay bịa trích dẫn. Đối chiếu mọi trích dẫn với văn bản gốc trước khi dẫn.</div>
</div>`,
        },
        {
          title: '0.5 — Assignment/essay topic bank (12) + rubric|||0.5 — Ngân hàng đề tài tiểu luận (12) + rubric',
          slug: 'mln131-ngan-hang-de-tai',
          type: 'article',
          description: 'Ngân hàng 12 đề tài tiểu luận bám 7 chương + rubric 6 phép thử chọn và chấm để ăn điểm cột Assignment 40%.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.5</span>
<h2>Pick an essay topic you can argue with primary sources</h2>
<p class="lead">The Assignment is 40% of the grade. The best topics let you take a position, quote Marx/Engels/Lenin, and connect to a present-day issue. Below are 12 pre-scoped topics from the seven chapters.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lk">Ch 2 · Working class</span> 1) The working class's historic mission today · 2) The Vietnamese working class in the industrialization era · 3) Utopian vs scientific socialism</div>
  <div class="lz-layer"><span class="lz-lk">Ch 3 · Socialism</span> 4) Characteristics of socialism · 5) Why the transition period is long and difficult in Vietnam</div>
  <div class="lz-layer"><span class="lz-lk">Ch 4-5 · State & class</span> 6) Socialist democracy vs bourgeois democracy · 7) The rule-of-law socialist state in Vietnam · 8) The worker-peasant-intellectual alliance today</div>
  <div class="lz-layer"><span class="lz-lk">Ch 6-7 · Nation, religion, family</span> 9) Lenin's national programme & Vietnam's ethnic policy · 10) The right to religious freedom & the anti-superstition line · 11) The family's functions in the transition · 12) Building the progressive Vietnamese family today</div>
</div>
<h3>The 6-test rubric — score a topic before you commit</h3>
<table>
<thead><tr><th>Test</th><th>Ask</th><th>Red flag</th></tr></thead>
<tbody>
<tr><td>Clear position</td><td>Can I argue a thesis, not just describe?</td><td>Pure summary</td></tr>
<tr><td>Primary sources</td><td>Can I quote Marx/Engels/Lenin/Party docs?</td><td>Only textbook paraphrase</td></tr>
<tr><td>One chapter focus</td><td>Anchored in one chapter?</td><td>Vague across all seven</td></tr>
<tr><td>Contemporary link</td><td>Connects to a real issue today?</td><td>Purely abstract</td></tr>
<tr><td>Team-splittable</td><td>Can the group divide sub-sections?</td><td>One opinion only</td></tr>
<tr><td>Presentable in 10'</td><td>Can we present & defend it?</td><td>Too broad</td></tr>
</tbody>
</table>
<div class="callout ok"><strong>Green light:</strong> a topic passing 5-6 tests. "The worker-peasant-intellectual alliance today" passes all six. "All of scientific socialism" fails focus and presentable.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Structure: thesis → evidence → application → conclusion.</b> A high-scoring essay states a thesis, backs each point with a primary quotation + analysis, applies it to a current issue, and concludes — the same structure you learned in ENW492c. Using it lifts a "restated textbook" into a real argument. <em>Cross-course skill the rubric rewards implicitly.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.5</span>
<h2>Chọn đề tiểu luận mà bạn lập luận được bằng nguồn gốc</h2>
<p class="lead">Bài tập chiếm 40% điểm. Đề tốt nhất cho bạn nêu một quan điểm, trích dẫn Mác/Ăngghen/Lênin, và nối với vấn đề hiện nay. Dưới đây là 12 đề đã kiểm scope từ bảy chương.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lk">Ch 2 · Giai cấp công nhân</span> 1) Sứ mệnh lịch sử của giai cấp công nhân hôm nay · 2) Giai cấp công nhân Việt Nam thời kỳ công nghiệp hóa · 3) Chủ nghĩa xã hội không tưởng vs khoa học</div>
  <div class="lz-layer"><span class="lz-lk">Ch 3 · Chủ nghĩa xã hội</span> 4) Những đặc trưng của chủ nghĩa xã hội · 5) Vì sao thời kỳ quá độ ở Việt Nam lâu dài và khó khăn</div>
  <div class="lz-layer"><span class="lz-lk">Ch 4-5 · Nhà nước & giai cấp</span> 6) Dân chủ XHCN vs dân chủ tư sản · 7) Nhà nước pháp quyền XHCN ở Việt Nam · 8) Liên minh công-nông-trí thức hôm nay</div>
  <div class="lz-layer"><span class="lz-lk">Ch 6-7 · Dân tộc, tôn giáo, gia đình</span> 9) Cương lĩnh dân tộc của Lênin & chính sách dân tộc Việt Nam · 10) Quyền tự do tín ngưỡng & bài trừ mê tín · 11) Chức năng gia đình trong thời kỳ quá độ · 12) Xây dựng gia đình Việt Nam tiến bộ hôm nay</div>
</div>
<h3>Rubric 6 phép thử — chấm đề trước khi cam kết</h3>
<table>
<thead><tr><th>Phép thử</th><th>Hỏi</th><th>Cờ đỏ</th></tr></thead>
<tbody>
<tr><td>Quan điểm rõ</td><td>Lập luận một luận đề, không chỉ mô tả?</td><td>Chỉ tóm tắt</td></tr>
<tr><td>Nguồn gốc</td><td>Trích được Mác/Ăngghen/Lênin/văn kiện?</td><td>Chỉ diễn giải giáo trình</td></tr>
<tr><td>Tập trung một chương</td><td>Bám vào một chương?</td><td>Lan man cả bảy</td></tr>
<tr><td>Nối đương đại</td><td>Nối với vấn đề thật hôm nay?</td><td>Thuần trừu tượng</td></tr>
<tr><td>Chia được cho nhóm</td><td>Nhóm chia được các mục?</td><td>Chỉ một ý kiến</td></tr>
<tr><td>Thuyết trình 10'</td><td>Trình bày & bảo vệ được?</td><td>Quá rộng</td></tr>
</tbody>
</table>
<div class="callout ok"><strong>Đèn xanh:</strong> đề qua 5-6 phép thử. "Liên minh công-nông-trí thức hôm nay" qua cả sáu. "Toàn bộ chủ nghĩa xã hội khoa học" trượt tập-trung và thuyết-trình.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Cấu trúc: luận đề → bằng chứng → vận dụng → kết luận.</b> Một tiểu luận điểm cao nêu luận đề, chống lưng mỗi ý bằng trích dẫn gốc + phân tích, vận dụng vào vấn đề hiện tại, rồi kết — chính cấu trúc bạn học ở ENW492c. Dùng nó nâng một "chép giáo trình" thành lập luận thật. <em>Kỹ năng liên môn rubric thưởng ngầm.</em></div>
</div>`,
        },
        {
          title: '0.6 — How not to fail & how to score high|||0.6 — Cách không trượt & cách ăn điểm cao',
          slug: 'mln131-chong-truot-diem-cao',
          type: 'article',
          description: '7 kiểu mất điểm + cờ xanh/đỏ theo tuần + công thức điểm cao.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.6</span>
<h2>Anti-fail & high-mark guide</h2>
<p class="lead">MLN131 rarely fails students on difficulty — it fails them on logistics and a weak, gated final. Here are the seven ways to lose points and their fixes.</p>
<table>
<thead><tr><th>#</th><th>How you lose</th><th>Fix</th></tr></thead>
<tbody>
<tr><td>1</td><td>Below 80% attendance → barred from the final</td><td>Track attendance from week 1</td></tr>
<tr><td>2</td><td>Final &lt; 4 (gate) despite good coursework</td><td>Study by chapter, connect the seven, do past questions</td></tr>
<tr><td>3</td><td>Essay just re-copied the textbook</td><td>Argue a thesis + quote primary sources</td></tr>
<tr><td>4</td><td>Memorized terms but couldn't connect chapters</td><td>Learn the "working class's mission" thread</td></tr>
<tr><td>5</td><td>Confused similar concepts (socialism vs communism; democracy vs state)</td><td>Build a compare-table (Ch 8)</td></tr>
<tr><td>6</td><td>One teammate did the whole assignment</td><td>Everyone owns a section and can defend it</td></tr>
<tr><td>7</td><td>Answered "prove/analyze" with a bare list</td><td>Add reasoning + example + application</td></tr>
</tbody>
</table>
<div class="kv-grid">
<div class="kv"><span class="k">🟢 Green</span><span class="v">You can state each chapter's core idea in one sentence</span></div>
<div class="kv"><span class="k">🟢 Green</span><span class="v">Your essay has a thesis and real quotations</span></div>
<div class="kv"><span class="k">🔴 Red</span><span class="v">You memorize terms but can't connect chapters</span></div>
<div class="kv"><span class="k">🔴 Red</span><span class="v">Attendance slipping below 80%</span></div>
</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The exam rewards "analyze and apply", not "list".</b> Prepare with the 4-step method (state → why → evidence → apply) and a one-line thesis per chapter. Seven sentences plus the method covers most of the final and essay. <em>A compression strategy that beats re-reading everything.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.6</span>
<h2>Cẩm nang chống trượt & ăn điểm cao</h2>
<p class="lead">MLN131 hiếm khi làm trượt vì độ khó — nó làm trượt vì hậu cần và một bài thi yếu có cổng. Đây là bảy cách mất điểm và cách sửa.</p>
<table>
<thead><tr><th>#</th><th>Cách bạn mất</th><th>Sửa</th></tr></thead>
<tbody>
<tr><td>1</td><td>Điểm danh dưới 80% → bị cấm thi cuối</td><td>Theo dõi điểm danh từ tuần 1</td></tr>
<tr><td>2</td><td>Thi cuối &lt; 4 (cổng) dù điểm quá trình tốt</td><td>Học theo chương, nối bảy chương, làm đề cũ</td></tr>
<tr><td>3</td><td>Tiểu luận chỉ chép lại giáo trình</td><td>Lập luận một luận đề + trích nguồn gốc</td></tr>
<tr><td>4</td><td>Thuộc thuật ngữ nhưng không nối được các chương</td><td>Học sợi chỉ "sứ mệnh giai cấp công nhân"</td></tr>
<tr><td>5</td><td>Nhầm khái niệm giống nhau (CNXH vs CNCS; dân chủ vs nhà nước)</td><td>Lập bảng so sánh (Ch 8)</td></tr>
<tr><td>6</td><td>Một người làm hết bài tập nhóm</td><td>Ai cũng sở hữu một mục và bảo vệ được</td></tr>
<tr><td>7</td><td>Trả lời "chứng minh/phân tích" bằng danh sách trơ</td><td>Thêm lập luận + ví dụ + vận dụng</td></tr>
</tbody>
</table>
<div class="kv-grid">
<div class="kv"><span class="k">🟢 Xanh</span><span class="v">Bạn nói được ý cốt lõi mỗi chương trong một câu</span></div>
<div class="kv"><span class="k">🟢 Xanh</span><span class="v">Tiểu luận của bạn có luận đề và trích dẫn thật</span></div>
<div class="kv"><span class="k">🔴 Đỏ</span><span class="v">Bạn thuộc thuật ngữ nhưng không nối được các chương</span></div>
<div class="kv"><span class="k">🔴 Đỏ</span><span class="v">Điểm danh tụt dưới 80%</span></div>
</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Đề thi thưởng "phân tích và vận dụng", không thưởng "liệt kê".</b> Chuẩn bị bằng khung 4 bước (nêu → vì sao → dẫn chứng → vận dụng) và một câu luận đề mỗi chương. Bảy câu cộng khung phủ được phần lớn bài thi và tiểu luận. <em>Một chiến lược nén hơn hẳn đọc lại tất cả.</em></div>
</div>`,
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 1 — NHẬP MÔN ══════════════════ */
    {
      title: 'Chapter 1 — Introduction to Scientific Socialism|||Chương 1 — Nhập môn Chủ nghĩa xã hội khoa học',
      description: 'Sự ra đời, các giai đoạn phát triển, đối tượng, phương pháp và ý nghĩa của chủ nghĩa xã hội khoa học.',
      lessons: [
        {
          title: '1.1 — Birth, development, object & method|||1.1 — Sự ra đời, phát triển, đối tượng & phương pháp',
          slug: 'mln131-1-1-nhap-mon',
          type: 'VIDEO',
          description: 'Từ chủ nghĩa xã hội không tưởng tới khoa học, các điều kiện ra đời, và đối tượng – phương pháp nghiên cứu.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>From utopian dream to scientific theory</h2>
<p class="lead">Scientific socialism did not begin with Marx. For centuries, "utopian socialists" (Thomas More, Saint-Simon, Fourier, Owen) criticized the injustice of their societies and imagined fairer ones — but they could not explain <em>the laws</em> that would bring such a society, nor identify the social force to build it.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lk">Utopian socialism</span> a moral critique + a beautiful dream, but no scientific analysis of how to get there. Its value: it kept alive the idea of a just society.</div>
  <div class="lz-layer"><span class="lz-lk">Two discoveries made it scientific</span> Marx's <em>materialist conception of history</em> and <em>the theory of surplus value</em> (from MLN122) turned socialism from a wish into a law-governed necessity.</div>
  <div class="lz-layer"><span class="lz-lk">Conditions of birth</span> mid-19th-century industrial capitalism + a maturing working-class movement gave the theory both its object and its social force.</div>
</div>
<h3>Object and method</h3>
<table>
<thead><tr><th>Aspect</th><th>In short</th></tr></thead>
<tbody>
<tr><td>Object</td><td>The political-social laws of the transition from capitalism to socialism, and the working class's mission in it</td></tr>
<tr><td>Method</td><td>Dialectical & historical materialism; combining logic with history; theory with practice</td></tr>
<tr><td>Stages</td><td>Marx-Engels founded it; Lenin developed it (imperialism, the possibility of revolution); it continues to develop in practice</td></tr>
</tbody>
</table>
<div class="callout ok"><strong>"Utopian → scientific" is the exam's framing question.</strong> Be able to say: utopian socialism dreamed of justice but couldn't explain how; scientific socialism grounds the goal in historical laws and names the working class as the agent. That contrast answers a whole family of Chapter 1 questions.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The two great discoveries link the three parts.</b> Notice the bridge across your three politics courses: philosophy (MLN111) gives historical materialism; political economy (MLN122) gives surplus value; scientific socialism (MLN131) uses <em>both</em> to prove socialism is a law-governed outcome. The three parts are one integrated theory. <em>Seeing the link makes all three easier to remember.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Từ giấc mơ không tưởng tới lý luận khoa học</h2>
<p class="lead">Chủ nghĩa xã hội khoa học không bắt đầu từ Mác. Nhiều thế kỷ, các "nhà xã hội chủ nghĩa không tưởng" (Thomas More, Saint-Simon, Fourier, Owen) phê phán sự bất công của xã hội họ và hình dung xã hội công bằng hơn — nhưng họ không giải thích được <em>những quy luật</em> đưa tới xã hội ấy, cũng không chỉ ra lực lượng xã hội để xây dựng.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lk">CNXH không tưởng</span> một sự phê phán đạo đức + một giấc mơ đẹp, nhưng không có phân tích khoa học về cách đạt tới. Giá trị của nó: giữ sống ý tưởng về một xã hội công bằng.</div>
  <div class="lz-layer"><span class="lz-lk">Hai phát kiến làm nó thành khoa học</span> <em>quan niệm duy vật về lịch sử</em> và <em>học thuyết giá trị thặng dư</em> (từ MLN122) của Mác biến CNXH từ một ước mong thành một tất yếu có quy luật.</div>
  <div class="lz-layer"><span class="lz-lk">Điều kiện ra đời</span> chủ nghĩa tư bản công nghiệp giữa thế kỷ XIX + phong trào công nhân trưởng thành cho lý luận cả đối tượng lẫn lực lượng xã hội.</div>
</div>
<h3>Đối tượng và phương pháp</h3>
<table>
<thead><tr><th>Khía cạnh</th><th>Tóm tắt</th></tr></thead>
<tbody>
<tr><td>Đối tượng</td><td>Những quy luật chính trị - xã hội của quá trình chuyển từ chủ nghĩa tư bản lên chủ nghĩa xã hội, và sứ mệnh giai cấp công nhân trong đó</td></tr>
<tr><td>Phương pháp</td><td>Duy vật biện chứng & duy vật lịch sử; kết hợp lô-gíc với lịch sử; lý luận với thực tiễn</td></tr>
<tr><td>Các giai đoạn</td><td>Mác-Ăngghen sáng lập; Lênin phát triển (chủ nghĩa đế quốc, khả năng cách mạng); tiếp tục phát triển trong thực tiễn</td></tr>
</tbody>
</table>
<div class="callout ok"><strong>"Không tưởng → khoa học" là câu hỏi đóng khung của đề thi.</strong> Hãy nói được: CNXH không tưởng mơ về công bằng nhưng không giải thích được cách; CNXH khoa học đặt mục tiêu trên quy luật lịch sử và gọi tên giai cấp công nhân là chủ thể. Sự đối lập đó trả lời cả một nhóm câu hỏi Chương 1.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Hai phát kiến lớn nối ba bộ phận.</b> Để ý cây cầu qua ba môn chính trị: triết học (MLN111) cho duy vật lịch sử; kinh tế chính trị (MLN122) cho giá trị thặng dư; chủ nghĩa xã hội khoa học (MLN131) dùng <em>cả hai</em> để chứng minh CNXH là kết cục có quy luật. Ba bộ phận là một lý luận thống nhất. <em>Thấy được mối liên kết làm cả ba dễ nhớ hơn.</em></div>
</div>`,
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 2 — SỨ MỆNH GIAI CẤP CÔNG NHÂN ══════════════════ */
    {
      title: 'Chapter 2 — The historic mission of the working class|||Chương 2 — Sứ mệnh lịch sử của giai cấp công nhân',
      description: 'Nội dung sứ mệnh, điều kiện khách quan – chủ quan, và giai cấp công nhân Việt Nam.',
      lessons: [
        {
          title: '2.1 — Why the working class? Content & conditions|||2.1 — Vì sao giai cấp công nhân? Nội dung & điều kiện',
          slug: 'mln131-2-1-su-menh',
          type: 'VIDEO',
          description: 'Định nghĩa giai cấp công nhân, nội dung sứ mệnh lịch sử, điều kiện khách quan – chủ quan, và giai cấp công nhân Việt Nam.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>The working class is the agent of the transition — and why</h2>
<p class="lead">This is the course's central thread. Marxism holds that the <strong>working class</strong> (those who sell their labor and do not own the means of production) has the <em>historic mission</em> of leading the overthrow of capitalism and the building of socialism and communism.</p>
<h3>The content of the mission</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Economic</div><div class="lz-t">Build new relations</div><div class="lz-d">socialist production, freeing labor</div></div>
  <div class="lz-step"><div class="lz-k">Political</div><div class="lz-t">Seize & hold power</div><div class="lz-d">lead the people, build the state</div></div>
  <div class="lz-step"><div class="lz-k">Cultural</div><div class="lz-t">Build a new culture</div><div class="lz-d">new values, the new person</div></div>
</div>
<h3>Why the working class, not another class?</h3>
<div class="out"><strong>Objective conditions (its position in production):</strong>
1. It is the product of large-scale modern industry — the most advanced productive force.
2. It owns no means of production → nothing to lose but its chains; its interest aligns with abolishing exploitation for all.
3. Large industry organizes it, disciplines it, and concentrates it — giving it the capacity to act collectively.
<strong>Subjective conditions (what it must develop):</strong>
4. Its own political party (armed with Marxism-Leninism) to give leadership and direction.
5. Alliance with the peasantry and other laboring strata.
<strong>Conclusion:</strong> the mission is not chosen or willed — it flows from the working class's objective place in modern production, realized through its party and alliances.</div>
<div class="pitfall"><strong>Don't confuse "mission" with "merit."</strong> The working class has this role because of its <em>objective position</em>, not because it is morally superior. The exam wants the objective (position in production) + subjective (party, alliance) conditions — state both.</div>
<div class="callout ok"><strong>The Vietnamese working class.</strong> Born under French colonialism, it is small but grew with the nation's struggle; led by the Party, allied with the peasantry, it carried the revolution. Today, in the industrialization-modernization era, developing this class (in number, quality, organization) is a live policy issue — a strong essay angle.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The working class in the knowledge economy.</b> A common "distortion" claims the working class is "disappearing" as automation grows. The disciplined reply: the working class is <em>changing form</em> (more knowledge workers, services), not vanishing; wage labor without ownership of the means of production still defines it. Answering this shows the critical thinking the skills CLOs prize. <em>A contemporary rebuttal beyond the syllabus.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Giai cấp công nhân là chủ thể của quá trình quá độ — và vì sao</h2>
<p class="lead">Đây là sợi chỉ trung tâm của môn học. Chủ nghĩa Mác cho rằng <strong>giai cấp công nhân</strong> (những người bán sức lao động và không sở hữu tư liệu sản xuất) có <em>sứ mệnh lịch sử</em> lãnh đạo việc lật đổ chủ nghĩa tư bản và xây dựng chủ nghĩa xã hội, chủ nghĩa cộng sản.</p>
<h3>Nội dung của sứ mệnh</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Kinh tế</div><div class="lz-t">Xây quan hệ mới</div><div class="lz-d">sản xuất XHCN, giải phóng lao động</div></div>
  <div class="lz-step"><div class="lz-k">Chính trị</div><div class="lz-t">Giành & giữ chính quyền</div><div class="lz-d">lãnh đạo nhân dân, xây nhà nước</div></div>
  <div class="lz-step"><div class="lz-k">Văn hóa</div><div class="lz-t">Xây văn hóa mới</div><div class="lz-d">giá trị mới, con người mới</div></div>
</div>
<h3>Vì sao là giai cấp công nhân, không phải giai cấp khác?</h3>
<div class="out"><strong>Điều kiện khách quan (địa vị trong sản xuất):</strong>
1. Là sản phẩm của nền đại công nghiệp hiện đại — lực lượng sản xuất tiên tiến nhất.
2. Không sở hữu tư liệu sản xuất → không có gì để mất ngoài xiềng xích; lợi ích của nó gắn với xóa bỏ bóc lột cho tất cả.
3. Đại công nghiệp tổ chức, kỷ luật và tập trung nó — cho nó khả năng hành động tập thể.
<strong>Điều kiện chủ quan (phải phát triển):</strong>
4. Chính đảng của mình (trang bị chủ nghĩa Mác-Lênin) để lãnh đạo và định hướng.
5. Liên minh với giai cấp nông dân và các tầng lớp lao động khác.
<strong>Kết luận:</strong> sứ mệnh không phải do chọn hay muốn — nó bắt nguồn từ địa vị khách quan của giai cấp công nhân trong nền sản xuất hiện đại, được hiện thực hóa qua chính đảng và liên minh.</div>
<div class="pitfall"><strong>Đừng nhầm "sứ mệnh" với "công lao đạo đức".</strong> Giai cấp công nhân có vai trò này vì <em>địa vị khách quan</em>, không phải vì nó cao thượng hơn về đạo đức. Đề thi muốn cả điều kiện khách quan (địa vị trong sản xuất) + chủ quan (đảng, liên minh) — nêu cả hai.</div>
<div class="callout ok"><strong>Giai cấp công nhân Việt Nam.</strong> Ra đời dưới ách thực dân Pháp, nhỏ nhưng lớn lên cùng cuộc đấu tranh dân tộc; do Đảng lãnh đạo, liên minh với nông dân, đã đưa cách mạng đi tới. Hôm nay, thời kỳ công nghiệp hóa - hiện đại hóa, phát triển giai cấp này (về số lượng, chất lượng, tổ chức) là một vấn đề chính sách sống động — một góc tiểu luận mạnh.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Giai cấp công nhân trong nền kinh tế tri thức.</b> Một "luận điệu xuyên tạc" phổ biến cho rằng giai cấp công nhân đang "biến mất" khi tự động hóa tăng. Câu trả lời có kỷ luật: giai cấp công nhân đang <em>thay đổi hình thức</em> (nhiều lao động tri thức, dịch vụ), không biến mất; lao động làm thuê không sở hữu tư liệu sản xuất vẫn định nghĩa nó. Trả lời được thể hiện tư duy phản biện mà các CLO kỹ năng coi trọng. <em>Một phản bác đương đại ngoài syllabus.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'What distinguishes "scientific" from "utopian" socialism?|||Điều gì phân biệt CNXH "khoa học" với "không tưởng"?',
                options: [
                  'Scientific socialism is newer|||CNXH khoa học mới hơn',
                  'It grounds the goal in historical laws and names the working class as the agent|||Nó đặt mục tiêu trên quy luật lịch sử và gọi tên giai cấp công nhân là chủ thể',
                  'It rejects any idea of justice|||Nó bác bỏ mọi ý tưởng về công bằng',
                  'It has no method|||Nó không có phương pháp',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'The working class has its historic mission mainly because of:|||Giai cấp công nhân có sứ mệnh lịch sử chủ yếu vì:',
                options: [
                  'Its moral superiority|||Sự cao thượng đạo đức của nó',
                  'Its objective position in modern large-scale production|||Địa vị khách quan của nó trong nền sản xuất đại công nghiệp hiện đại',
                  'Its large numbers alone|||Chỉ vì số đông',
                  'Government decree|||Sắc lệnh của chính phủ',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'A key SUBJECTIVE condition for fulfilling the mission is:|||Một điều kiện CHỦ QUAN then chốt để hoàn thành sứ mệnh là:',
                options: [
                  'Owning factories|||Sở hữu nhà máy',
                  'Having its own political party (armed with Marxism-Leninism) and alliances|||Có chính đảng của mình (trang bị Mác-Lênin) và liên minh',
                  'A large territory|||Lãnh thổ rộng',
                  'Foreign aid|||Viện trợ nước ngoài',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: '(Beyond syllabus) The claim "the working class is disappearing" is best answered by:|||(Ngoài giáo trình) Luận điệu "giai cấp công nhân đang biến mất" được trả lời tốt nhất bằng:',
                options: [
                  'Agreeing with it|||Đồng ý với nó',
                  'Showing the class is changing form (knowledge/service work), not vanishing — wage labor without ownership still defines it|||Cho thấy giai cấp đang đổi hình thức (lao động tri thức/dịch vụ), không biến mất — lao động làm thuê không sở hữu vẫn định nghĩa nó',
                  'Ignoring the claim|||Bỏ qua luận điệu',
                  'Saying automation is fake|||Nói tự động hóa là giả',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 3 — CNXH & THỜI KỲ QUÁ ĐỘ ══════════════════ */
    {
      title: 'Chapter 3 — Socialism & the transition period|||Chương 3 — Chủ nghĩa xã hội & thời kỳ quá độ',
      description: 'Quan niệm khoa học về CNXH, những đặc trưng, và thời kỳ quá độ lên CNXH (ở Việt Nam).',
      lessons: [
        {
          title: '3.1 — Socialism\'s characteristics & the transition|||3.1 — Đặc trưng của CNXH & thời kỳ quá độ',
          slug: 'mln131-3-1-cnxh',
          type: 'VIDEO',
          description: 'CNXH là gì (giai đoạn đầu của CNCS), các đặc trưng, và vì sao thời kỳ quá độ là tất yếu, lâu dài.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Socialism as the first phase of communism — and the long road to it</h2>
<p class="lead">In Marxism, <strong>socialism</strong> is the <em>first (lower) phase</em> of the communist social formation. It is not yet full communism (distribution "to each according to need") but the stage where society is built on public ownership of the main means of production, the people are masters, and distribution is mainly "to each according to labor."</p>
<h3>The characteristics of socialism</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lk">Liberated people</span> the working people are freed from exploitation and are the masters of society.</div>
  <div class="lz-layer"><span class="lz-lk">Advanced economy</span> highly developed productive forces on the basis of public ownership of the main means of production.</div>
  <div class="lz-layer"><span class="lz-lk">Real democracy & a state of the people</span> genuine popular power, not formal.</div>
  <div class="lz-layer"><span class="lz-lk">Rich culture, equality, unity</span> a high culture, social equality, unity among nations/peoples, and friendship with the world.</div>
</div>
<h3>Why a transition period — and why it is long</h3>
<div class="out"><strong>Reasoning:</strong>
1. Socialism does not appear overnight — the old society's economic, social and cultural remnants persist.
2. Building new (socialist) relations of production and a new material base takes time.
3. For a country like Vietnam — starting from a low, agrarian, formerly colonial base and <em>bypassing the capitalist stage</em> — the transition is especially long, difficult, and must be gradual and realistic.
<strong>Conclusion:</strong> the transition is an objective necessity, not a delay to be rushed; it is the period of building the conditions for socialism.</div>
<div class="pitfall"><strong>Socialism ≠ communism.</strong> A classic confusion. Socialism is the <em>lower</em> phase (distribution by labor; the state still exists); communism is the <em>higher</em> phase (distribution by need; the state "withers away"). Mixing them up is a common exam error — keep the two phases distinct.</div>
<div class="callout ok"><strong>Vietnam's transition and đổi mới.</strong> Vietnam builds socialism through a <em>socialist-oriented market economy</em> — using markets and multiple economic sectors to develop productive forces, while keeping the socialist direction and the leading role of the state economy. This is the living application of Chapter 3 and a favorite essay topic.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>"Bypassing capitalism" does not mean skipping its achievements.</b> Vietnam bypasses the capitalist <em>regime</em> (the domination of the exploiting class) but not the <em>civilizational achievements</em> of capitalism — modern industry, markets, science, management. Ho Chi Minh and the Party stress inheriting these while rejecting exploitation. This nuance separates a deep answer from a slogan. <em>A depth point beyond the textbook line.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Chủ nghĩa xã hội là giai đoạn đầu của chủ nghĩa cộng sản — và con đường dài tới nó</h2>
<p class="lead">Trong chủ nghĩa Mác, <strong>chủ nghĩa xã hội</strong> là <em>giai đoạn đầu (thấp)</em> của hình thái cộng sản chủ nghĩa. Nó chưa phải cộng sản đầy đủ (phân phối "theo nhu cầu") mà là giai đoạn xã hội được xây trên chế độ công hữu về những tư liệu sản xuất chủ yếu, nhân dân làm chủ, và phân phối chủ yếu "theo lao động".</p>
<h3>Những đặc trưng của chủ nghĩa xã hội</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lk">Con người được giải phóng</span> nhân dân lao động được giải phóng khỏi bóc lột và là người làm chủ xã hội.</div>
  <div class="lz-layer"><span class="lz-lk">Kinh tế tiên tiến</span> lực lượng sản xuất phát triển cao trên cơ sở công hữu những tư liệu sản xuất chủ yếu.</div>
  <div class="lz-layer"><span class="lz-lk">Dân chủ thực sự & nhà nước của dân</span> quyền lực nhân dân thực chất, không hình thức.</div>
  <div class="lz-layer"><span class="lz-lk">Văn hóa cao, bình đẳng, đoàn kết</span> nền văn hóa cao, bình đẳng xã hội, đoàn kết các dân tộc, và hữu nghị với thế giới.</div>
</div>
<h3>Vì sao có thời kỳ quá độ — và vì sao lâu dài</h3>
<div class="out"><strong>Lập luận:</strong>
1. Chủ nghĩa xã hội không xuất hiện sau một đêm — những tàn dư kinh tế, xã hội và văn hóa của xã hội cũ còn tồn tại.
2. Xây dựng quan hệ sản xuất mới (XHCN) và một cơ sở vật chất mới cần thời gian.
3. Với một nước như Việt Nam — xuất phát từ nền tảng thấp, nông nghiệp, từng là thuộc địa và <em>bỏ qua giai đoạn tư bản chủ nghĩa</em> — thời kỳ quá độ đặc biệt lâu dài, khó khăn, và phải tuần tự, thực tế.
<strong>Kết luận:</strong> thời kỳ quá độ là một tất yếu khách quan, không phải một sự trì hoãn để nóng vội; đó là thời kỳ xây dựng những điều kiện cho CNXH.</div>
<div class="pitfall"><strong>Chủ nghĩa xã hội ≠ chủ nghĩa cộng sản.</strong> Một nhầm lẫn kinh điển. CNXH là giai đoạn <em>thấp</em> (phân phối theo lao động; nhà nước vẫn còn); CNCS là giai đoạn <em>cao</em> (phân phối theo nhu cầu; nhà nước "tự tiêu vong"). Lẫn lộn hai cái là lỗi thi phổ biến — giữ hai giai đoạn rõ ràng.</div>
<div class="callout ok"><strong>Thời kỳ quá độ của Việt Nam và đổi mới.</strong> Việt Nam xây dựng CNXH qua một <em>nền kinh tế thị trường định hướng xã hội chủ nghĩa</em> — dùng thị trường và nhiều thành phần kinh tế để phát triển lực lượng sản xuất, đồng thời giữ định hướng XHCN và vai trò chủ đạo của kinh tế nhà nước. Đây là sự vận dụng sống động của Chương 3 và một đề tiểu luận được ưa chuộng.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>"Bỏ qua tư bản chủ nghĩa" không có nghĩa bỏ qua thành tựu của nó.</b> Việt Nam bỏ qua <em>chế độ</em> tư bản (sự thống trị của giai cấp bóc lột) nhưng không bỏ qua <em>những thành tựu văn minh</em> của chủ nghĩa tư bản — công nghiệp hiện đại, thị trường, khoa học, quản lý. Hồ Chí Minh và Đảng nhấn mạnh kế thừa những cái đó trong khi bác bỏ bóc lột. Sắc thái này tách một câu trả lời sâu khỏi một khẩu hiệu. <em>Một ý chiều sâu vượt câu chữ giáo trình.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'In Marxism, socialism is:|||Trong chủ nghĩa Mác, chủ nghĩa xã hội là:',
                options: [
                  'The same as full communism|||Giống hệt chủ nghĩa cộng sản đầy đủ',
                  'The first (lower) phase of the communist formation|||Giai đoạn đầu (thấp) của hình thái cộng sản chủ nghĩa',
                  'A form of capitalism|||Một hình thức của chủ nghĩa tư bản',
                  'A return to feudalism|||Sự quay lại phong kiến',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'Distribution in socialism is mainly:|||Phân phối trong CNXH chủ yếu là:',
                options: [
                  'to each according to need|||theo nhu cầu',
                  'to each according to labor|||theo lao động',
                  'equal shares regardless of work|||chia đều bất kể lao động',
                  'according to inheritance|||theo thừa kế',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'Why is Vietnam\'s transition period especially long and difficult?|||Vì sao thời kỳ quá độ của Việt Nam đặc biệt lâu dài và khó khăn?',
                options: [
                  'Because of bad luck|||Vì kém may mắn',
                  'It starts from a low, agrarian, formerly colonial base and bypasses the capitalist stage|||Xuất phát từ nền tảng thấp, nông nghiệp, từng là thuộc địa và bỏ qua giai đoạn tư bản chủ nghĩa',
                  'Because it skipped socialism|||Vì bỏ qua chủ nghĩa xã hội',
                  'For no reason|||Không vì lý do gì',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'Vietnam builds socialism through:|||Việt Nam xây dựng chủ nghĩa xã hội qua:',
                options: [
                  'a pure command economy with no markets|||một nền kinh tế mệnh lệnh thuần túy không có thị trường',
                  'a socialist-oriented market economy|||một nền kinh tế thị trường định hướng xã hội chủ nghĩa',
                  'unregulated free-market capitalism|||chủ nghĩa tư bản thị trường tự do không điều tiết',
                  'feudal agriculture|||nông nghiệp phong kiến',
                ], correctIndex: 1,
              },
              {
                id: 'q5', points: 1,
                question: '(Beyond syllabus) "Bypassing capitalism" means Vietnam skips:|||(Ngoài giáo trình) "Bỏ qua tư bản chủ nghĩa" nghĩa là Việt Nam bỏ qua:',
                options: [
                  'all of capitalism\'s achievements (industry, science, markets)|||mọi thành tựu của chủ nghĩa tư bản (công nghiệp, khoa học, thị trường)',
                  'the capitalist regime (rule of the exploiting class), while inheriting its civilizational achievements|||chế độ tư bản (sự thống trị của giai cấp bóc lột), trong khi kế thừa những thành tựu văn minh của nó',
                  'building any economy|||việc xây dựng bất kỳ nền kinh tế nào',
                  'socialism itself|||chính chủ nghĩa xã hội',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 4 — DÂN CHỦ & NHÀ NƯỚC XHCN ══════════════════ */
    {
      title: 'Chapter 4 — Socialist democracy & the socialist state|||Chương 4 — Dân chủ XHCN & nhà nước XHCN',
      description: 'Bản chất của dân chủ XHCN và nhà nước XHCN, mối quan hệ giữa chúng, và xây dựng ở Việt Nam.',
      lessons: [
        {
          title: '4.1 — Socialist democracy & the state of the people|||4.1 — Dân chủ XHCN & nhà nước của nhân dân',
          slug: 'mln131-4-1-dan-chu',
          type: 'VIDEO',
          description: 'Dân chủ XHCN so với dân chủ tư sản, bản chất nhà nước XHCN, và nhà nước pháp quyền XHCN ở Việt Nam.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Democracy for the majority, not the few</h2>
<p class="lead">Building socialism (Ch3) requires an organized political power. <strong>Socialist democracy</strong> means power genuinely belonging to the working people (the majority); the <strong>socialist state</strong> is the instrument through which that power is organized and exercised.</p>
<h3>Socialist vs bourgeois democracy</h3>
<table>
<thead><tr><th>Aspect</th><th>Bourgeois democracy</th><th>Socialist democracy</th></tr></thead>
<tbody>
<tr><td>For whom</td><td>Formally all, substantively the propertied minority</td><td>The working people — the majority</td></tr>
<tr><td>Economic base</td><td>Private ownership of the means of production</td><td>Public ownership of the main means of production</td></tr>
<tr><td>Nature</td><td>Democracy + the rule of capital</td><td>The most complete democracy in history, in principle</td></tr>
</tbody>
</table>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lk">Democracy is both goal and means</span> the people's mastery is the aim of socialism <em>and</em> the method of building it.</div>
  <div class="lz-layer"><span class="lz-lk">The state's nature</span> a state of the working people, led by the working class through its party; it manages the economy and society and defends the gains of the revolution.</div>
  <div class="lz-layer"><span class="lz-lk">Democracy ↔ state</span> democracy is the content; the state is the chief instrument to realize it. Neither exists without the other in the transition.</div>
</div>
<div class="out"><strong>Vietnam — the socialist rule-of-law state:</strong>
Vietnam is building a "socialist rule-of-law state of the people, by the people, for the people":
• All power belongs to the people (of the people).
• The people build and supervise it (by the people).
• It serves the people's interests (for the people).
• It is governed by law, with the Party's leadership and the people's mastery as three linked pillars.</div>
<div class="pitfall"><strong>Don't reduce democracy to elections.</strong> Socialist democracy includes the people's ongoing participation and <em>supervision</em> of power, plus economic and social rights — not just periodic voting. The exam wants the breadth (political + economic + social), and the class content (for the majority).</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>"Dân biết, dân bàn, dân làm, dân kiểm tra, dân giám sát, dân thụ hưởng."</b> Vietnam's practical formula for grassroots democracy — the people know, discuss, do, check, supervise, and benefit. It operationalizes "of/by/for the people" into concrete rights and is a strong, current reference for the Chapter 4 essay. <em>The living, applied form of socialist democracy.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Dân chủ cho đa số, không cho thiểu số</h2>
<p class="lead">Xây dựng CNXH (Ch3) đòi hỏi một quyền lực chính trị được tổ chức. <strong>Dân chủ xã hội chủ nghĩa</strong> nghĩa là quyền lực thực sự thuộc về nhân dân lao động (đa số); <strong>nhà nước xã hội chủ nghĩa</strong> là công cụ để quyền lực ấy được tổ chức và thực hiện.</p>
<h3>Dân chủ XHCN vs dân chủ tư sản</h3>
<table>
<thead><tr><th>Khía cạnh</th><th>Dân chủ tư sản</th><th>Dân chủ XHCN</th></tr></thead>
<tbody>
<tr><td>Cho ai</td><td>Hình thức cho tất cả, thực chất cho thiểu số hữu sản</td><td>Nhân dân lao động — đa số</td></tr>
<tr><td>Cơ sở kinh tế</td><td>Tư hữu về tư liệu sản xuất</td><td>Công hữu về những tư liệu sản xuất chủ yếu</td></tr>
<tr><td>Bản chất</td><td>Dân chủ + sự thống trị của tư bản</td><td>Về nguyên tắc, nền dân chủ đầy đủ nhất trong lịch sử</td></tr>
</tbody>
</table>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lk">Dân chủ vừa là mục tiêu vừa là phương tiện</span> nhân dân làm chủ là mục tiêu của CNXH <em>và</em> phương pháp xây dựng nó.</div>
  <div class="lz-layer"><span class="lz-lk">Bản chất nhà nước</span> một nhà nước của nhân dân lao động, do giai cấp công nhân lãnh đạo qua chính đảng của mình; nó quản lý kinh tế, xã hội và bảo vệ thành quả cách mạng.</div>
  <div class="lz-layer"><span class="lz-lk">Dân chủ ↔ nhà nước</span> dân chủ là nội dung; nhà nước là công cụ chủ yếu để hiện thực hóa nó. Không cái nào tồn tại thiếu cái kia trong thời kỳ quá độ.</div>
</div>
<div class="out"><strong>Việt Nam — nhà nước pháp quyền XHCN:</strong>
Việt Nam đang xây dựng "nhà nước pháp quyền XHCN của dân, do dân, vì dân":
• Mọi quyền lực thuộc về nhân dân (của dân).
• Nhân dân xây dựng và giám sát (do dân).
• Nó phục vụ lợi ích của nhân dân (vì dân).
• Nó được quản lý bằng pháp luật, với sự lãnh đạo của Đảng và quyền làm chủ của nhân dân là ba trụ cột gắn kết.</div>
<div class="pitfall"><strong>Đừng rút gọn dân chủ thành bầu cử.</strong> Dân chủ XHCN bao gồm sự tham gia thường xuyên và <em>giám sát</em> quyền lực của nhân dân, cùng các quyền kinh tế và xã hội — không chỉ bỏ phiếu định kỳ. Đề thi muốn bề rộng (chính trị + kinh tế + xã hội), và nội dung giai cấp (cho đa số).</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>"Dân biết, dân bàn, dân làm, dân kiểm tra, dân giám sát, dân thụ hưởng."</b> Công thức thực tiễn của Việt Nam về dân chủ ở cơ sở — dân biết, bàn, làm, kiểm tra, giám sát, và thụ hưởng. Nó cụ thể hóa "của/do/vì dân" thành các quyền cụ thể và là một liên hệ mạnh, thời sự cho tiểu luận Chương 4. <em>Hình thức sống động, được vận dụng của dân chủ XHCN.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'Socialist democracy is, in principle, democracy for:|||Dân chủ XHCN, về nguyên tắc, là dân chủ cho:',
                options: [
                  'the propertied minority|||thiểu số hữu sản',
                  'the working people — the majority|||nhân dân lao động — đa số',
                  'the state officials only|||chỉ cán bộ nhà nước',
                  'foreign investors|||nhà đầu tư nước ngoài',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'The relationship between socialist democracy and the socialist state is:|||Mối quan hệ giữa dân chủ XHCN và nhà nước XHCN là:',
                options: [
                  'They are unrelated|||Chúng không liên quan',
                  'Democracy is the content; the state is the chief instrument to realize it|||Dân chủ là nội dung; nhà nước là công cụ chủ yếu để hiện thực hóa nó',
                  'The state opposes democracy|||Nhà nước chống lại dân chủ',
                  'They are identical|||Chúng giống hệt nhau',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'The economic base distinguishing socialist from bourgeois democracy is:|||Cơ sở kinh tế phân biệt dân chủ XHCN với dân chủ tư sản là:',
                options: [
                  'private ownership of the means of production|||tư hữu tư liệu sản xuất',
                  'public ownership of the main means of production|||công hữu những tư liệu sản xuất chủ yếu',
                  'no ownership at all|||không sở hữu gì',
                  'foreign ownership|||sở hữu nước ngoài',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'Vietnam is building a state described as:|||Việt Nam đang xây dựng một nhà nước được mô tả là:',
                options: [
                  'a feudal monarchy|||một chế độ quân chủ phong kiến',
                  'a socialist rule-of-law state of the people, by the people, for the people|||nhà nước pháp quyền XHCN của dân, do dân, vì dân',
                  'a stateless anarchy|||tình trạng vô chính phủ',
                  'a colonial administration|||một chính quyền thuộc địa',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 5 — CƠ CẤU XÃ HỘI-GIAI CẤP & LIÊN MINH ══════════════════ */
    {
      title: 'Chapter 5 — Class structure & the class alliance|||Chương 5 — Cơ cấu xã hội-giai cấp & liên minh giai cấp',
      description: 'Cơ cấu xã hội - giai cấp trong thời kỳ quá độ và liên minh công - nông - trí thức ở Việt Nam.',
      lessons: [
        {
          title: '5.1 — The worker-peasant-intellectual alliance|||5.1 — Liên minh công - nông - trí thức',
          slug: 'mln131-5-1-lien-minh',
          type: 'VIDEO',
          description: 'Cơ cấu xã hội - giai cấp trong thời kỳ quá độ, tính tất yếu của liên minh, và nội dung liên minh ở Việt Nam.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>The alliance that gives the working class its social base</h2>
<p class="lead">The working class cannot fulfill its mission alone. In the transition, society still has multiple classes and strata; the decisive question is who allies with the working class. Marxism-Leninism answers: above all, the <strong>peasantry</strong>, and — in the modern era — the <strong>intelligentsia</strong>.</p>
<h3>Why the alliance is necessary</h3>
<div class="out"><strong>Reasoning:</strong>
1. Politically: the working class is a minority; without allies it cannot lead the whole society or hold power.
2. Economically: industry (workers) and agriculture (peasants) are interdependent; modern development needs science and technology (intellectuals).
3. Historically: revolutions succeeded where the worker-peasant alliance was firm; they failed where it broke.
<strong>Conclusion:</strong> the worker-peasant-intellectual alliance, under the working class's leadership, is the <em>foundation</em> of the state power and of the whole national unity bloc.</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lk">Political content</span> shared goal — building socialism under the Party's leadership; the alliance is the core of state power.</div>
  <div class="lz-layer"><span class="lz-lk">Economic content</span> linking industry, agriculture and science; mutual support so all strata develop together (the deepest, most lasting bond).</div>
  <div class="lz-layer"><span class="lz-lk">Cultural-social content</span> raising the education, culture and living standards of all allied classes.</div>
</div>
<div class="callout ok"><strong>Connect to Ho Chi Minh's "great unity" (HCM202 Ch5).</strong> The worker-peasant-intellectual alliance is the <em>core</em>; the wider national unity bloc is the <em>breadth</em>. Scientific socialism explains <em>why</em> this core is necessary; Ho Chi Minh's thought shows how to build the broad bloc around it. The two courses reinforce each other here.</div>
<div class="pitfall"><strong>The economic content is the deepest bond.</strong> Students often stress only the political alliance. Ho Chi Minh and Lenin stressed that the <em>economic</em> link (mutual benefit, developing agriculture and industry together) is what makes the alliance durable — a political alliance without economic substance withers.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Why the intelligentsia now, not in Marx's day.</b> Marx emphasized workers and peasants; the explicit inclusion of the <em>intelligentsia</em> reflects the modern knowledge economy, where science and technology are direct productive forces. Vietnam's "công-nông-trí" formula updates the classic alliance for industrialization-modernization — a sharp contemporary point. <em>The alliance evolving with the productive forces.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Liên minh cho giai cấp công nhân cơ sở xã hội của mình</h2>
<p class="lead">Giai cấp công nhân không thể hoàn thành sứ mệnh một mình. Trong thời kỳ quá độ, xã hội còn nhiều giai cấp và tầng lớp; câu hỏi quyết định là ai liên minh với giai cấp công nhân. Chủ nghĩa Mác-Lênin trả lời: trước hết là <strong>giai cấp nông dân</strong>, và — trong thời đại hiện nay — <strong>đội ngũ trí thức</strong>.</p>
<h3>Vì sao liên minh là tất yếu</h3>
<div class="out"><strong>Lập luận:</strong>
1. Về chính trị: giai cấp công nhân là thiểu số; không có đồng minh thì không thể lãnh đạo cả xã hội hay giữ chính quyền.
2. Về kinh tế: công nghiệp (công nhân) và nông nghiệp (nông dân) phụ thuộc lẫn nhau; phát triển hiện đại cần khoa học và công nghệ (trí thức).
3. Về lịch sử: cách mạng thắng lợi ở nơi liên minh công-nông vững; thất bại ở nơi nó tan vỡ.
<strong>Kết luận:</strong> liên minh công-nông-trí thức, dưới sự lãnh đạo của giai cấp công nhân, là <em>nền tảng</em> của chính quyền nhà nước và của cả khối đại đoàn kết dân tộc.</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lk">Nội dung chính trị</span> mục tiêu chung — xây dựng CNXH dưới sự lãnh đạo của Đảng; liên minh là nòng cốt của chính quyền nhà nước.</div>
  <div class="lz-layer"><span class="lz-lk">Nội dung kinh tế</span> gắn kết công nghiệp, nông nghiệp và khoa học; hỗ trợ lẫn nhau để mọi tầng lớp cùng phát triển (mối liên kết sâu nhất, bền nhất).</div>
  <div class="lz-layer"><span class="lz-lk">Nội dung văn hóa-xã hội</span> nâng cao trình độ học vấn, văn hóa và mức sống của mọi giai cấp liên minh.</div>
</div>
<div class="callout ok"><strong>Nối với "đại đoàn kết" của Hồ Chí Minh (HCM202 Ch5).</strong> Liên minh công-nông-trí là <em>nòng cốt</em>; khối đại đoàn kết dân tộc rộng hơn là <em>bề rộng</em>. Chủ nghĩa xã hội khoa học giải thích <em>vì sao</em> nòng cốt này là cần thiết; tư tưởng Hồ Chí Minh cho thấy cách xây khối rộng quanh nó. Hai môn củng cố nhau ở đây.</div>
<div class="pitfall"><strong>Nội dung kinh tế là mối liên kết sâu nhất.</strong> Sinh viên thường chỉ nhấn liên minh chính trị. Hồ Chí Minh và Lênin nhấn mạnh rằng liên kết <em>kinh tế</em> (cùng có lợi, phát triển nông nghiệp và công nghiệp cùng nhau) mới làm liên minh bền vững — một liên minh chính trị thiếu thực chất kinh tế sẽ tàn lụi.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Vì sao là trí thức bây giờ, không phải thời Mác.</b> Mác nhấn mạnh công nhân và nông dân; việc đưa <em>trí thức</em> vào rõ ràng phản ánh nền kinh tế tri thức hiện đại, nơi khoa học và công nghệ là lực lượng sản xuất trực tiếp. Công thức "công-nông-trí" của Việt Nam cập nhật liên minh kinh điển cho công nghiệp hóa - hiện đại hóa — một ý đương đại sắc bén. <em>Liên minh tiến hóa cùng lực lượng sản xuất.</em></div>
</div>`,
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 6 — DÂN TỘC & TÔN GIÁO ══════════════════ */
    {
      title: 'Chapter 6 — The nation & religion in the transition|||Chương 6 — Vấn đề dân tộc & tôn giáo',
      description: 'Cương lĩnh dân tộc của Lênin, quan điểm về tôn giáo, và nguyên tắc giải quyết ở Việt Nam.',
      lessons: [
        {
          title: '6.1 — Lenin\'s national programme & the religious question|||6.1 — Cương lĩnh dân tộc của Lênin & vấn đề tôn giáo',
          slug: 'mln131-6-1-dan-toc-ton-giao',
          type: 'VIDEO',
          description: 'Ba nội dung Cương lĩnh dân tộc của Lênin, quan điểm mác-xít về tôn giáo, và chính sách dân tộc – tôn giáo ở Việt Nam.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Two sensitive questions the transition must solve well</h2>
<p class="lead">A socialist society of many peoples and beliefs must handle the <strong>national (ethnic)</strong> and <strong>religious</strong> questions carefully — mishandling them divides the very unity that socialism depends on.</p>
<h3>Lenin's national programme — three principles</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Equality</div><div class="lz-d">all nations/ethnicities are equal</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Self-determination</div><div class="lz-d">the right of nations to decide their path</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Unity</div><div class="lz-d">unite the workers of all nations</div></div>
</div>
<p>Vietnam applies this as: <em>equality, unity, mutual respect and help, common development</em> among all 54 ethnic groups — with special support for the material and cultural life of ethnic-minority and highland areas.</p>
<h3>The Marxist view of religion</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lk">What religion is</span> a form of social consciousness reflecting reality in a distorted, otherworldly way; it has roots in nature, society and psychology.</div>
  <div class="lz-layer"><span class="lz-lk">Respect freedom of belief</span> the socialist state guarantees the right to follow OR not follow a religion; belief is a private matter of the citizen.</div>
  <div class="lz-layer"><span class="lz-lk">Distinguish belief from superstition &amp; abuse</span> protect genuine faith; oppose superstition and any exploitation of religion for anti-people ends.</div>
</div>
<div class="pitfall"><strong>Freedom of belief includes the freedom NOT to believe — and it is a right, not a concession.</strong> A common error treats religion as merely to be "tolerated." The Marxist-Leninist and Vietnamese line is to <em>respect and protect</em> freedom of belief and non-belief as a citizen's right, while separating that from superstition and from those who abuse religion politically.</div>
<div class="callout ok"><strong>Ethnic and religious unity serves the whole.</strong> Both chapters share one aim: keep the people united. Solving the national and religious questions on principles of equality and respect strengthens the great unity bloc (Ch5 alliance + HCM202 Ch5) that the whole revolution rests on.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>"Tôn trọng và bảo đảm quyền tự do tín ngưỡng."</b> Vietnam's constitution and law guarantee freedom of belief and religion, and religions "live good lives, do good deeds, accompany the nation." Citing this current legal-policy framing — not just the abstract principle — makes a Chapter 6 essay concrete and contemporary. <em>Principle grounded in today's policy.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Hai vấn đề nhạy cảm mà thời kỳ quá độ phải giải quyết tốt</h2>
<p class="lead">Một xã hội xã hội chủ nghĩa gồm nhiều dân tộc và tín ngưỡng phải xử lý cẩn thận vấn đề <strong>dân tộc</strong> và <strong>tôn giáo</strong> — xử lý sai sẽ chia rẽ chính sự đoàn kết mà CNXH dựa vào.</p>
<h3>Cương lĩnh dân tộc của Lênin — ba nội dung</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Bình đẳng</div><div class="lz-d">các dân tộc đều bình đẳng</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Tự quyết</div><div class="lz-d">quyền các dân tộc tự quyết con đường</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Đoàn kết</div><div class="lz-d">đoàn kết công nhân các dân tộc</div></div>
</div>
<p>Việt Nam vận dụng thành: <em>bình đẳng, đoàn kết, tôn trọng và giúp nhau cùng phát triển</em> giữa 54 dân tộc — với sự hỗ trợ đặc biệt cho đời sống vật chất và văn hóa vùng đồng bào dân tộc thiểu số và miền núi.</p>
<h3>Quan điểm mác-xít về tôn giáo</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lk">Tôn giáo là gì</span> một hình thái ý thức xã hội phản ánh hiện thực một cách hư ảo, siêu nhiên; có nguồn gốc tự nhiên, xã hội và tâm lý.</div>
  <div class="lz-layer"><span class="lz-lk">Tôn trọng tự do tín ngưỡng</span> nhà nước XHCN bảo đảm quyền theo HOẶC không theo một tôn giáo; tín ngưỡng là việc riêng của công dân.</div>
  <div class="lz-layer"><span class="lz-lk">Phân biệt tín ngưỡng với mê tín & lợi dụng</span> bảo vệ đức tin chân chính; chống mê tín và mọi sự lợi dụng tôn giáo vì mục đích phản nhân dân.</div>
</div>
<div class="pitfall"><strong>Tự do tín ngưỡng bao gồm tự do KHÔNG tin — và đó là quyền, không phải sự ban ơn.</strong> Một lỗi phổ biến coi tôn giáo chỉ là thứ để "dung thứ". Đường lối Mác-Lênin và Việt Nam là <em>tôn trọng và bảo vệ</em> tự do tín ngưỡng và không tín ngưỡng như một quyền của công dân, đồng thời tách nó khỏi mê tín và khỏi những kẻ lợi dụng tôn giáo về chính trị.</div>
<div class="callout ok"><strong>Đoàn kết dân tộc và tôn giáo phục vụ cái toàn thể.</strong> Cả hai chương chung một mục đích: giữ nhân dân đoàn kết. Giải quyết vấn đề dân tộc và tôn giáo trên nguyên tắc bình đẳng và tôn trọng củng cố khối đại đoàn kết (liên minh Ch5 + HCM202 Ch5) mà cả cuộc cách mạng dựa vào.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>"Tôn trọng và bảo đảm quyền tự do tín ngưỡng."</b> Hiến pháp và pháp luật Việt Nam bảo đảm tự do tín ngưỡng, tôn giáo, và các tôn giáo "sống tốt đời, đẹp đạo, đồng hành cùng dân tộc". Dẫn khung pháp lý - chính sách hiện hành này — không chỉ nguyên tắc trừu tượng — làm tiểu luận Chương 6 cụ thể và thời sự. <em>Nguyên tắc đặt trên chính sách hôm nay.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'The three principles of Lenin\'s national programme are:|||Ba nội dung Cương lĩnh dân tộc của Lênin là:',
                options: [
                  'Wealth, power, expansion|||Của cải, quyền lực, bành trướng',
                  'Equality, self-determination, unity of workers of all nations|||Bình đẳng, tự quyết, đoàn kết công nhân các dân tộc',
                  'Isolation, dominance, assimilation|||Biệt lập, thống trị, đồng hóa',
                  'War, tribute, conquest|||Chiến tranh, cống nạp, chinh phục',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'Vietnam\'s ethnic policy is summarized as:|||Chính sách dân tộc của Việt Nam tóm tắt là:',
                options: [
                  'assimilation of minorities|||đồng hóa các dân tộc thiểu số',
                  'equality, unity, mutual respect and help, common development|||bình đẳng, đoàn kết, tôn trọng và giúp nhau cùng phát triển',
                  'separation of ethnic groups|||chia tách các dân tộc',
                  'ignoring minorities|||phớt lờ các dân tộc thiểu số',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'The socialist state\'s stance on religion is to:|||Lập trường của nhà nước XHCN về tôn giáo là:',
                options: [
                  'ban all religion|||cấm mọi tôn giáo',
                  'respect and guarantee freedom to follow or not follow a religion, while opposing superstition and abuse|||tôn trọng và bảo đảm tự do theo hoặc không theo tôn giáo, đồng thời chống mê tín và lợi dụng',
                  'require everyone to be religious|||buộc mọi người phải có tôn giáo',
                  'ignore religion entirely|||phớt lờ tôn giáo hoàn toàn',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'Marxism distinguishes genuine religious belief from:|||Chủ nghĩa Mác phân biệt tín ngưỡng chân chính với:',
                options: [
                  'science|||khoa học',
                  'superstition and the political abuse of religion|||mê tín và sự lợi dụng tôn giáo về chính trị',
                  'culture|||văn hóa',
                  'education|||giáo dục',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 7 — GIA ĐÌNH ══════════════════ */
    {
      title: 'Chapter 7 — The family in the transition|||Chương 7 — Vấn đề gia đình trong thời kỳ quá độ',
      description: 'Vị trí, chức năng của gia đình và cơ sở xây dựng gia đình trong thời kỳ quá độ lên CNXH ở Việt Nam.',
      lessons: [
        {
          title: '7.1 — The family\'s position, functions & how to build it|||7.1 — Vị trí, chức năng gia đình & cách xây dựng',
          slug: 'mln131-7-1-gia-dinh',
          type: 'VIDEO',
          description: 'Gia đình là "tế bào của xã hội", các chức năng cơ bản, và cơ sở xây dựng gia đình mới tiến bộ ở Việt Nam.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>The family is the "cell" of society — build it well and society is strong</h2>
<p class="lead">The final chapter returns to the smallest social unit. Marxism calls the <strong>family</strong> a "cell of society": society is healthy when families are; the transition to socialism must therefore build a new, progressive family.</p>
<h3>The family's position and functions</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lk">Position</span> a cell of society, a bridge between the individual and society, and a place that shapes personality — its quality directly affects the nation.</div>
  <div class="lz-layer"><span class="lz-lk">Reproduction function</span> reproducing the population and human beings for society.</div>
  <div class="lz-layer"><span class="lz-lk">Economic function</span> organizing consumption and, often, production; a basic economic unit.</div>
  <div class="lz-layer"><span class="lz-lk">Education function</span> nurturing and educating children — the first and lasting school of morality and character.</div>
  <div class="lz-layer"><span class="lz-lk">Emotional-cultural function</span> satisfying spiritual and emotional needs; transmitting culture and values.</div>
</div>
<h3>Building the new family in Vietnam</h3>
<div class="out"><strong>The bases of the new, progressive family:</strong>
1. Economic base: developing the socialist economy raises family living standards and independence.
2. Political-legal base: laws on marriage and family guaranteeing <em>voluntary, progressive, monogamous, equal</em> marriage and gender equality.
3. Cultural base: overcoming feudal remnants (patriarchy, arranged marriage, son-preference) and building equality, love, and responsibility.
<strong>Target:</strong> a family that is "ấm no, tiến bộ, hạnh phúc, văn minh" (prosperous, progressive, happy, civilized).</div>
<div class="pitfall"><strong>Gender equality is central, not decorative.</strong> A key mark of the new family is the <em>equal</em> status of women — overcoming the feudal "trọng nam khinh nữ" (favoring sons over daughters). Essays that describe the family but skip gender equality miss the chapter's core reform.</div>
<div class="callout ok"><strong>Connect the whole course.</strong> The family (Ch7) shapes the "new person" that socialism needs (Ch3); a progressive, equal family produces citizens for a democratic society (Ch4) and strengthens national unity (Ch5-6). The smallest unit and the largest goal are linked.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The modern family under pressure.</b> Today's Vietnamese family faces new challenges — urbanization, migration, technology, changing roles, low birth rates. A strong Chapter 7 essay applies the theory to a real trend: how to keep the family's education and emotional functions strong while economies and lifestyles change. <em>Applying the theory to a live social trend.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Gia đình là "tế bào" của xã hội — xây tốt thì xã hội mạnh</h2>
<p class="lead">Chương cuối trở về đơn vị xã hội nhỏ nhất. Chủ nghĩa Mác gọi <strong>gia đình</strong> là "tế bào của xã hội": xã hội lành mạnh khi các gia đình lành mạnh; do đó thời kỳ quá độ lên CNXH phải xây dựng một gia đình mới, tiến bộ.</p>
<h3>Vị trí và chức năng của gia đình</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lk">Vị trí</span> một tế bào của xã hội, cầu nối giữa cá nhân và xã hội, và nơi hình thành nhân cách — chất lượng của nó ảnh hưởng trực tiếp tới dân tộc.</div>
  <div class="lz-layer"><span class="lz-lk">Chức năng tái sản xuất</span> tái sản xuất dân số và con người cho xã hội.</div>
  <div class="lz-layer"><span class="lz-lk">Chức năng kinh tế</span> tổ chức tiêu dùng và, thường, sản xuất; một đơn vị kinh tế cơ bản.</div>
  <div class="lz-layer"><span class="lz-lk">Chức năng giáo dục</span> nuôi dưỡng và giáo dục con cái — trường học đầu tiên và bền lâu về đạo đức và nhân cách.</div>
  <div class="lz-layer"><span class="lz-lk">Chức năng tình cảm-văn hóa</span> thỏa mãn nhu cầu tinh thần và tình cảm; trao truyền văn hóa và giá trị.</div>
</div>
<h3>Xây dựng gia đình mới ở Việt Nam</h3>
<div class="out"><strong>Cơ sở của gia đình mới, tiến bộ:</strong>
1. Cơ sở kinh tế: phát triển kinh tế xã hội chủ nghĩa nâng cao mức sống và tính độc lập của gia đình.
2. Cơ sở chính trị-pháp lý: pháp luật về hôn nhân và gia đình bảo đảm hôn nhân <em>tự nguyện, tiến bộ, một vợ một chồng, bình đẳng</em> và bình đẳng giới.
3. Cơ sở văn hóa: khắc phục tàn dư phong kiến (gia trưởng, ép duyên, trọng nam khinh nữ) và xây dựng bình đẳng, yêu thương, trách nhiệm.
<strong>Mục tiêu:</strong> một gia đình "ấm no, tiến bộ, hạnh phúc, văn minh".</div>
<div class="pitfall"><strong>Bình đẳng giới là trung tâm, không phải trang trí.</strong> Một dấu hiệu then chốt của gia đình mới là địa vị <em>bình đẳng</em> của người phụ nữ — khắc phục "trọng nam khinh nữ" của phong kiến. Bài mô tả gia đình mà bỏ qua bình đẳng giới bỏ lỡ cuộc cải cách cốt lõi của chương.</div>
<div class="callout ok"><strong>Nối cả môn học.</strong> Gia đình (Ch7) hình thành "con người mới" mà CNXH cần (Ch3); một gia đình tiến bộ, bình đẳng sản sinh công dân cho một xã hội dân chủ (Ch4) và củng cố đại đoàn kết (Ch5-6). Đơn vị nhỏ nhất và mục tiêu lớn nhất nối với nhau.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Gia đình hiện đại dưới áp lực.</b> Gia đình Việt Nam hôm nay đối mặt thách thức mới — đô thị hóa, di cư, công nghệ, vai trò thay đổi, mức sinh thấp. Một tiểu luận Chương 7 mạnh vận dụng lý luận vào một xu hướng thật: làm sao giữ vững chức năng giáo dục và tình cảm của gia đình khi kinh tế và lối sống đổi thay. <em>Vận dụng lý luận vào một xu hướng xã hội sống động.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'Marxism describes the family as:|||Chủ nghĩa Mác mô tả gia đình là:',
                options: [
                  'a private business|||một doanh nghiệp tư nhân',
                  'a "cell" of society|||một "tế bào" của xã hội',
                  'a political party|||một đảng phái',
                  'a state agency|||một cơ quan nhà nước',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'Which is NOT one of the family\'s basic functions discussed?|||Đâu KHÔNG phải một chức năng cơ bản của gia đình được bàn?',
                options: [
                  'Reproduction of population|||Tái sản xuất dân số',
                  'Education of children|||Giáo dục con cái',
                  'Making national foreign policy|||Hoạch định chính sách đối ngoại quốc gia',
                  'Emotional and cultural function|||Chức năng tình cảm và văn hóa',
                ], correctIndex: 2,
              },
              {
                id: 'q3', points: 1,
                question: 'Marriage in the new family is characterized as:|||Hôn nhân trong gia đình mới có đặc trưng là:',
                options: [
                  'arranged and patriarchal|||sắp đặt và gia trưởng',
                  'voluntary, progressive, monogamous, and equal|||tự nguyện, tiến bộ, một vợ một chồng, và bình đẳng',
                  'based on wealth only|||chỉ dựa trên của cải',
                  'decided by the state|||do nhà nước quyết định',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'A central reform of the new family is:|||Một cải cách trung tâm của gia đình mới là:',
                options: [
                  'keeping son-preference|||giữ trọng nam khinh nữ',
                  'gender equality (overcoming feudal "favoring sons over daughters")|||bình đẳng giới (khắc phục "trọng nam khinh nữ" phong kiến)',
                  'abolishing the family|||xóa bỏ gia đình',
                  'returning to arranged marriage|||quay lại hôn nhân sắp đặt',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 8 — ÔN THI (EXAM PREP) ══════════════════ */
    {
      title: 'Chapter 8 — Exam prep: question bank & compare-table|||Chương 8 — Ôn thi: ngân hàng câu hỏi & bảng so sánh',
      description: 'Ngân hàng câu hỏi theo chương/CLO, khung trả lời 4 bước, và bảng so sánh các khái niệm hay nhầm.',
      lessons: [
        {
          title: '8.1 — Question bank + the 4-step method + compare-table|||8.1 — Ngân hàng câu hỏi + khung 4 bước + bảng so sánh',
          slug: 'mln131-8-1-on-thi',
          type: 'article',
          description: 'Câu hỏi ôn theo từng chương, khung trả lời "nêu – vì sao – dẫn chứng – vận dụng", và bảng phân biệt cặp khái niệm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>Answer every question the same way, and drill the confusing pairs</h2>
<p class="lead">Like all the politics courses, MLN131 rewards <em>analysis and application</em>, not listing. Use one 4-step method for every question, know the chapter bank, and memorize a compare-table of the terms students most often confuse.</p>
<h3>The 4-step answer method</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1 State</div><div class="lz-t">the concept</div><div class="lz-d">what the theory says</div></div>
  <div class="lz-step"><div class="lz-k">2 Why</div><div class="lz-t">explain / prove</div><div class="lz-d">the reasoning</div></div>
  <div class="lz-step"><div class="lz-k">3 Evidence</div><div class="lz-t">quote / fact</div><div class="lz-d">Marx/Engels/Lenin, history</div></div>
  <div class="lz-step"><div class="lz-k">4 Apply</div><div class="lz-t">today</div><div class="lz-d">Vietnam's practice</div></div>
</div>
<h3>Self-check question bank (by chapter)</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lk">Ch 1-2</span> Utopian vs scientific socialism? Why does the working class have the historic mission (objective + subjective conditions)?</div>
  <div class="lz-layer"><span class="lz-lk">Ch 3</span> Characteristics of socialism? Socialism vs communism? Why is the transition long in Vietnam? What is "socialist-oriented market economy"?</div>
  <div class="lz-layer"><span class="lz-lk">Ch 4-5</span> Socialist vs bourgeois democracy? Relationship of democracy and the state? Why is the worker-peasant-intellectual alliance necessary?</div>
  <div class="lz-layer"><span class="lz-lk">Ch 6-7</span> Lenin's three national principles? The state's stance on religion? The family's functions? Bases for building the new family?</div>
</div>
<h3>Compare-table — the pairs students confuse</h3>
<table>
<thead><tr><th>Pair</th><th>Key difference</th></tr></thead>
<tbody>
<tr><td>Socialism vs Communism</td><td>lower phase (distribute by labor, state exists) vs higher phase (by need, state withers)</td></tr>
<tr><td>Utopian vs Scientific socialism</td><td>moral dream, no method vs grounded in laws + the working class</td></tr>
<tr><td>Democracy vs the State</td><td>the content (people's power) vs the chief instrument to realize it</td></tr>
<tr><td>Objective vs Subjective conditions</td><td>the class's position in production vs its party + alliances</td></tr>
<tr><td>Belief vs Superstition</td><td>protected freedom of faith vs opposed; abuse of religion also opposed</td></tr>
<tr><td>Core vs Breadth (unity)</td><td>worker-peasant-intellectual alliance vs the whole national unity bloc</td></tr>
</tbody>
</table>
<div class="pitfall"><strong>Never answer "prove/analyze" by listing.</strong> If the verb is "chứng minh / phân tích / vận dụng," add the "why" and an example. Reading the exam verb tells you the depth required.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>One-line thesis per chapter.</b> Reduce each chapter to a memorable sentence (Ch2 = "the working class's position in production gives it the mission"; Ch3 = "socialism is the lower phase, reached through a long transition"). Seven sentences + the 4-step method + the compare-table cover the exam. <em>A compression that beats re-reading everything.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Trả lời mọi câu theo cùng một cách, và luyện các cặp dễ nhầm</h2>
<p class="lead">Như mọi môn chính trị, MLN131 thưởng <em>phân tích và vận dụng</em>, không phải liệt kê. Dùng một khung 4 bước cho mọi câu, thuộc ngân hàng theo chương, và học thuộc bảng so sánh các thuật ngữ sinh viên hay nhầm nhất.</p>
<h3>Khung trả lời 4 bước</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1 Nêu</div><div class="lz-t">khái niệm</div><div class="lz-d">lý luận nói gì</div></div>
  <div class="lz-step"><div class="lz-k">2 Vì sao</div><div class="lz-t">giải thích / chứng minh</div><div class="lz-d">lập luận</div></div>
  <div class="lz-step"><div class="lz-k">3 Dẫn chứng</div><div class="lz-t">trích / sự kiện</div><div class="lz-d">Mác/Ăngghen/Lênin, lịch sử</div></div>
  <div class="lz-step"><div class="lz-k">4 Vận dụng</div><div class="lz-t">hôm nay</div><div class="lz-d">thực tiễn Việt Nam</div></div>
</div>
<h3>Ngân hàng câu tự kiểm (theo chương)</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lk">Ch 1-2</span> CNXH không tưởng vs khoa học? Vì sao giai cấp công nhân có sứ mệnh lịch sử (điều kiện khách quan + chủ quan)?</div>
  <div class="lz-layer"><span class="lz-lk">Ch 3</span> Đặc trưng của CNXH? CNXH vs CNCS? Vì sao thời kỳ quá độ ở Việt Nam lâu dài? "Kinh tế thị trường định hướng XHCN" là gì?</div>
  <div class="lz-layer"><span class="lz-lk">Ch 4-5</span> Dân chủ XHCN vs tư sản? Mối quan hệ dân chủ và nhà nước? Vì sao liên minh công-nông-trí thức là tất yếu?</div>
  <div class="lz-layer"><span class="lz-lk">Ch 6-7</span> Ba nội dung Cương lĩnh dân tộc của Lênin? Lập trường nhà nước về tôn giáo? Chức năng gia đình? Cơ sở xây dựng gia đình mới?</div>
</div>
<h3>Bảng so sánh — các cặp sinh viên hay nhầm</h3>
<table>
<thead><tr><th>Cặp</th><th>Khác biệt then chốt</th></tr></thead>
<tbody>
<tr><td>CNXH vs CNCS</td><td>giai đoạn thấp (phân phối theo lao động, nhà nước còn) vs giai đoạn cao (theo nhu cầu, nhà nước tiêu vong)</td></tr>
<tr><td>CNXH không tưởng vs khoa học</td><td>giấc mơ đạo đức, không phương pháp vs đặt trên quy luật + giai cấp công nhân</td></tr>
<tr><td>Dân chủ vs Nhà nước</td><td>nội dung (quyền lực nhân dân) vs công cụ chủ yếu để hiện thực hóa nó</td></tr>
<tr><td>Điều kiện khách quan vs chủ quan</td><td>địa vị giai cấp trong sản xuất vs đảng + liên minh của nó</td></tr>
<tr><td>Tín ngưỡng vs Mê tín</td><td>tự do đức tin được bảo vệ vs bị chống; lợi dụng tôn giáo cũng bị chống</td></tr>
<tr><td>Nòng cốt vs Bề rộng (đoàn kết)</td><td>liên minh công-nông-trí vs cả khối đại đoàn kết dân tộc</td></tr>
</tbody>
</table>
<div class="pitfall"><strong>Đừng bao giờ trả lời "chứng minh/phân tích" bằng liệt kê.</strong> Nếu động từ là "chứng minh / phân tích / vận dụng", thêm "vì sao" và một ví dụ. Đọc động từ của đề cho biết độ sâu cần có.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Một câu luận đề mỗi chương.</b> Rút mỗi chương về một câu dễ nhớ (Ch2 = "địa vị của giai cấp công nhân trong sản xuất cho nó sứ mệnh"; Ch3 = "CNXH là giai đoạn thấp, đạt tới qua một thời kỳ quá độ dài"). Bảy câu + khung 4 bước + bảng so sánh phủ được bài thi. <em>Một cách nén hơn hẳn đọc lại tất cả.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'The key difference between socialism and communism is:|||Khác biệt then chốt giữa CNXH và CNCS là:',
                options: [
                  'They are identical|||Chúng giống hệt nhau',
                  'Socialism (lower phase, distribute by labor, state exists) vs communism (higher phase, by need, state withers)|||CNXH (giai đoạn thấp, phân phối theo lao động, nhà nước còn) vs CNCS (giai đoạn cao, theo nhu cầu, nhà nước tiêu vong)',
                  'Communism came first|||CNCS có trước',
                  'Socialism has no state at all|||CNXH không có nhà nước',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'The recommended answer method is:|||Khung trả lời được khuyến nghị là:',
                options: [
                  'List as many points as possible|||Liệt kê càng nhiều ý càng tốt',
                  'State → why → evidence → apply today|||Nêu → vì sao → dẫn chứng → vận dụng hôm nay',
                  'Copy the textbook|||Chép giáo trình',
                  'Write only definitions|||Chỉ viết định nghĩa',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'In the unity theme, "core" vs "breadth" means:|||Trong chủ đề đoàn kết, "nòng cốt" vs "bề rộng" nghĩa là:',
                options: [
                  'the state vs the party|||nhà nước vs đảng',
                  'the worker-peasant-intellectual alliance vs the whole national unity bloc|||liên minh công-nông-trí vs cả khối đại đoàn kết dân tộc',
                  'workers vs peasants|||công nhân vs nông dân',
                  'city vs countryside|||thành thị vs nông thôn',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 9 — NÂNG CAO ★ (BEYOND SYLLABUS) ══════════════════ */
    {
      title: 'Chapter 9 — Beyond the syllabus ★: applying the theory & rebutting distortions|||Chương 9 — Nâng cao ★: vận dụng lý luận & phản bác xuyên tạc',
      description: 'Cả chương ★ ngoài giáo trình: vận dụng CNXH khoa học vào thực tiễn Việt Nam và phản bác các luận điệu xuyên tạc.',
      lessons: [
        {
          title: '9.1 — Applying the theory today & rebutting distortions ★|||9.1 — Vận dụng lý luận hôm nay & phản bác xuyên tạc ★',
          slug: 'mln131-9-1-nang-cao',
          type: 'VIDEO',
          description: 'Vì sao lý luận còn giá trị, cách vận dụng vào con đường Việt Nam, và lập luận phản bác các luận điệu sai trái.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1 · ★ Beyond the syllabus</span>
<h2>From learning the theory to applying and defending it</h2>
<p class="lead">This whole chapter is <span class="badge">★ Beyond the syllabus</span> — application and critical thinking that lift an essay from "restated textbook" to a mature argument. Three themes: why the theory still matters, how Vietnam applies it, and how to rebut distortions.</p>

<h3>1 — Why scientific socialism still has value</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lk">A method, not a fixed blueprint</span> its lasting value is a way of analyzing society — class relations, productive forces, whose interests a system serves — usable in any era.</div>
  <div class="lz-layer"><span class="lz-lk">Live problems it speaks to</span> inequality, the role of the state and markets, the class alliance, ethnic and religious harmony, the family — all remain real questions.</div>
</div>

<h3>2 — Vietnam's application: đổi mới and the socialist-oriented market economy</h3>
<div class="out"><strong>The living application, in one line:</strong>
Develop productive forces using markets and multiple economic sectors (a lesson learned from capitalism's achievements) WHILE keeping the socialist direction — public ownership of the main means of production leading, the Party's leadership, social equity, and the state serving the people. This is Chapters 3-5 in practice.</div>
<p>Essays that connect the theory to Vietnam's concrete path (đổi mới since 1986, the market economy, poverty reduction, industrialization) show the "vận dụng" the skills CLOs prize.</p>

<h3>3 — Rebutting distortions (critical thinking)</h3>
<div class="out"><strong>Rebuttal structure (for claims like "socialism has failed / is outdated"):</strong>
1. State the claim fairly.
2. Distinguish the collapse of a particular model (e.g. bureaucratic centralism) from the <em>theory and values</em> (equality, people's power, the alliance).
3. Give evidence the method still works: it explains and guides Vietnam's real achievements.
4. Conclude: what failed was a flawed application, not the scientific analysis of class society.</div>
<div class="callout ok"><strong>Rebut with reason, not assertion.</strong> A strong rebuttal <em>engages</em> the opposing claim and answers it with argument and evidence — the critical-thinking skill the CLOs demand (and that you built in ITE302c and ENW492c).</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The mark of an A: your own analysis.</b> Top essays add one genuine, specific link the textbook doesn't make — a current policy, a data point, a real trend — analyzed with the class-and-productive-forces method. Examiners tell the difference between memorized content and thought applied. Bringing scientific socialism to bear on something you actually care about separates a 9 from a 7. <em>The whole point of "vận dụng."</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1 · ★ Ngoài giáo trình</span>
<h2>Từ học lý luận tới vận dụng và bảo vệ nó</h2>
<p class="lead">Cả chương này là <span class="badge">★ Ngoài giáo trình</span> — vận dụng và tư duy phản biện nâng một tiểu luận từ "chép giáo trình" thành một lập luận chín. Ba chủ đề: vì sao lý luận còn giá trị, Việt Nam vận dụng thế nào, và cách phản bác xuyên tạc.</p>

<h3>1 — Vì sao chủ nghĩa xã hội khoa học còn giá trị</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lk">Một phương pháp, không phải bản thiết kế cứng</span> giá trị bền vững của nó là một cách phân tích xã hội — quan hệ giai cấp, lực lượng sản xuất, một chế độ phục vụ lợi ích của ai — dùng được cho mọi thời đại.</div>
  <div class="lz-layer"><span class="lz-lk">Những vấn đề sống động nó nói tới</span> bất bình đẳng, vai trò của nhà nước và thị trường, liên minh giai cấp, hòa hợp dân tộc và tôn giáo, gia đình — tất cả vẫn là câu hỏi thật.</div>
</div>

<h3>2 — Việt Nam vận dụng: đổi mới và kinh tế thị trường định hướng XHCN</h3>
<div class="out"><strong>Sự vận dụng sống động, trong một dòng:</strong>
Phát triển lực lượng sản xuất bằng thị trường và nhiều thành phần kinh tế (một bài học từ thành tựu của chủ nghĩa tư bản) TRONG KHI giữ định hướng xã hội chủ nghĩa — công hữu những tư liệu sản xuất chủ yếu giữ vai trò chủ đạo, sự lãnh đạo của Đảng, công bằng xã hội, và nhà nước phục vụ nhân dân. Đây là Chương 3-5 trong thực tiễn.</div>
<p>Tiểu luận nối lý luận với con đường cụ thể của Việt Nam (đổi mới từ 1986, kinh tế thị trường, giảm nghèo, công nghiệp hóa) thể hiện sự "vận dụng" mà các CLO kỹ năng coi trọng.</p>

<h3>3 — Phản bác xuyên tạc (tư duy phản biện)</h3>
<div class="out"><strong>Cấu trúc phản bác (cho luận điệu như "CNXH đã thất bại / đã lỗi thời"):</strong>
1. Nêu luận điệu một cách công bằng.
2. Phân biệt sự sụp đổ của một mô hình cụ thể (vd tập trung quan liêu) với <em>lý luận và giá trị</em> (bình đẳng, quyền lực nhân dân, liên minh).
3. Đưa bằng chứng phương pháp vẫn hiệu quả: nó giải thích và dẫn dắt các thành tựu thật của Việt Nam.
4. Kết luận: cái thất bại là một sự vận dụng sai lầm, không phải sự phân tích khoa học về xã hội có giai cấp.</div>
<div class="callout ok"><strong>Phản bác bằng lý lẽ, không chỉ khẳng định.</strong> Một phản bác mạnh <em>đối thoại</em> với luận điệu đối lập và trả lời nó bằng lập luận và bằng chứng — kỹ năng tư duy phản biện mà các CLO đòi hỏi (và bạn đã xây ở ITE302c và ENW492c).</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Dấu hiệu của điểm A: phân tích của chính bạn.</b> Tiểu luận hàng đầu thêm một liên hệ thật, cụ thể mà giáo trình không nêu — một chính sách hiện tại, một số liệu, một xu hướng thật — được phân tích bằng phương pháp giai-cấp-và-lực-lượng-sản-xuất. Giám khảo phân biệt được nội dung học thuộc với tư duy được vận dụng. Đem chủ nghĩa xã hội khoa học soi vào điều bạn thực sự quan tâm mới tách một điểm 9 khỏi một điểm 7. <em>Toàn bộ ý nghĩa của "vận dụng".</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'The lasting value of scientific socialism is best understood as:|||Giá trị bền vững của chủ nghĩa xã hội khoa học được hiểu đúng nhất là:',
                options: [
                  'A fixed blueprint for every country|||Một bản thiết kế cứng cho mọi nước',
                  'A method of analyzing society — class relations, productive forces, whose interests a system serves|||Một phương pháp phân tích xã hội — quan hệ giai cấp, lực lượng sản xuất, chế độ phục vụ lợi ích của ai',
                  'Only of historical interest|||Chỉ có ý nghĩa lịch sử',
                  'Irrelevant to today|||Không liên quan hôm nay',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'Vietnam applies the theory today mainly through:|||Việt Nam vận dụng lý luận hôm nay chủ yếu qua:',
                options: [
                  'a pure command economy|||một nền kinh tế mệnh lệnh thuần túy',
                  'đổi mới and a socialist-oriented market economy|||đổi mới và kinh tế thị trường định hướng XHCN',
                  'abandoning socialism|||từ bỏ chủ nghĩa xã hội',
                  'returning to feudalism|||quay lại phong kiến',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'The disciplined way to rebut "socialism has failed" is to:|||Cách có kỷ luật để phản bác "CNXH đã thất bại" là:',
                options: [
                  'just deny it|||chỉ phủ nhận',
                  'distinguish a flawed model from the theory/values, then give evidence the method still works|||phân biệt một mô hình sai lầm với lý luận/giá trị, rồi đưa bằng chứng phương pháp vẫn hiệu quả',
                  'ignore the claim|||bỏ qua luận điệu',
                  'change the subject|||đổi chủ đề',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'What most separates a top (9) essay from an average (7) one?|||Điều gì tách một tiểu luận hàng đầu (9) khỏi một bài trung bình (7)?',
                options: [
                  'Length|||Độ dài',
                  'A genuine, specific application analyzed with the class-and-productive-forces method|||Một liên hệ/vận dụng thật, cụ thể được phân tích bằng phương pháp giai cấp và lực lượng sản xuất',
                  'More quotations copied|||Chép nhiều trích dẫn hơn',
                  'Bigger handwriting|||Chữ viết to hơn',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },
  ],
};
