/**
 * MLN122 — Political Economics of Marxism–Leninism / Kinh tế chính trị Mác–Lênin (Kỳ 8).
 * Môn lý luận chính trị (2 tín chỉ). KHÔNG code → Exp Hub (giáo trình + công cụ học), KHÔNG CodeLab.
 * Có công thức kinh tế (m'=m/v, cấu tạo hữu cơ, tỷ suất lợi nhuận) → dùng .formula + ví dụ giải.
 * Chuẩn SWP391 gold: Mục 0 6 bài (intro+lz-map, thang điểm, 9 CLO, công cụ, ngân hàng đề tài
 * assignment + rubric, anti-fail/high-mark) + 6 chương bám giáo trình + chương ÔN THI (ngân hàng
 * câu hỏi vấn đáp theo CLO + cách viết luận) + chương NÂNG CAO ★. Song ngữ EN/VN đối xứng.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/MLN122.mjs --apply
 */
export default {
  semester: { code: 'FPTU_Hola8', name: 'Kỳ 8', ordinal: 10 },
  course: {
    academyType: 'FPT',
    courseCode: 'MLN122',
    title: 'Political Economics of Marxism–Leninism',
    slug: 'political-economics-of-marxism-leninism',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'Understand how a market economy really works through Marx & Lenin: commodities, value, money, surplus value, capital, monopoly, and Vietnam\'s socialist-oriented market economy — with worked formulas and modern links.|||Hiểu nền kinh tế thị trường vận hành thật sự qua Marx & Lenin: hàng hóa, giá trị, tiền tệ, giá trị thặng dư, tư bản, độc quyền và kinh tế thị trường định hướng XHCN ở Việt Nam — kèm công thức có lời giải và liên hệ hiện đại.',
    description: 'MLN122 (Kinh tế chính trị Mác–Lênin) là môn lý luận chính trị 2 tín chỉ, nghiên cứu các QUAN HỆ KINH TẾ trong nền sản xuất xã hội. Bạn sẽ đi từ những phạm trù nền tảng — hàng hóa, giá trị, tiền tệ, thị trường và các quy luật của nó — tới học thuyết trung tâm của Marx là GIÁ TRỊ THẶNG DƯ (nguồn gốc lợi nhuận trong chủ nghĩa tư bản), rồi tới lý luận của Lenin về CẠNH TRANH và ĐỘC QUYỀN, và cuối cùng vận dụng vào thực tiễn Việt Nam: KINH TẾ THỊ TRƯỜNG ĐỊNH HƯỚNG XÃ HỘI CHỦ NGHĨA, các quan hệ lợi ích kinh tế, công nghiệp hóa – hiện đại hóa và hội nhập kinh tế quốc tế. Môn học không chỉ là lý thuyết trừu tượng: nó cho bạn một bộ công cụ để PHÂN TÍCH và NHẬN DIỆN bản chất các hiện tượng kinh tế thời sự — từ giá cả, lạm phát tới độc quyền công nghệ và kinh tế số. Khóa này trình bày cả CÔNG THỨC (tỷ suất giá trị thặng dư, cấu tạo hữu cơ của tư bản…) kèm ví dụ giải từng bước, và liên hệ ★ ngoài giáo trình với kinh tế hiện đại.',
    whatYouLearn: 'Đối tượng, phương pháp và chức năng của kinh tế chính trị Mác–Lênin; hai thuộc tính của hàng hóa (giá trị sử dụng & giá trị) và lượng giá trị (thời gian lao động xã hội cần thiết); nguồn gốc, bản chất và chức năng của tiền tệ; quy luật giá trị, cung–cầu, cạnh tranh; học thuyết giá trị thặng dư (m), tỷ suất và khối lượng giá trị thặng dư, cấu tạo hữu cơ của tư bản, tích lũy tư bản, lợi nhuận – lợi tức – địa tô; lý luận Lenin về độc quyền và độc quyền nhà nước (5 đặc điểm kinh tế) và biểu hiện mới ngày nay; bản chất và đặc trưng của kinh tế thị trường định hướng XHCN ở Việt Nam; các quan hệ lợi ích kinh tế và vai trò nhà nước; công nghiệp hóa – hiện đại hóa và hội nhập kinh tế quốc tế; và kỹ năng phân tích, viết luận, thuyết trình một vấn đề kinh tế – chính trị.',
    requirements: 'Không có môn tiên quyết. Cần: giáo trình Kinh tế chính trị Mác–Lênin (hệ không chuyên), truy cập tài liệu học, và tinh thần đọc – suy ngẫm – liên hệ thực tiễn. Nên có một công cụ vẽ sơ đồ tư duy để hệ thống hóa các phạm trù.',
    documentsNote: 'Tài liệu chính: Giáo trình Kinh tế chính trị Mác–Lênin (Bộ GD&ĐT, hệ không chuyên lý luận chính trị) • C. Mác & Ph. Ăngghen: Toàn tập (t.23 — Tư bản, quyển I) • V.I. Lênin: Toàn tập (t.27 — Chủ nghĩa đế quốc, giai đoạn tột cùng của CNTB) • Văn kiện Đại hội Đảng (VI–XIII) • Nghị quyết 57-NQ/TW (2024) & 68-NQ/TW (2025). Công cụ học & PDF → Exp Hub. Đây là môn lý luận — vừa học vừa liên hệ thực tiễn kinh tế Việt Nam và thế giới.',
  },
  sections: [
    /* ══════════════════ MỤC 0 — GIỚI THIỆU & HƯỚNG DẪN ══════════════════ */
    {
      title: 'Section 0 — Introduction & Study Guide|||Mục 0 — Giới thiệu & Hướng dẫn học',
      description: 'Đọc trước tiên: môn học nghiên cứu gì, bản đồ 6 chương, thang điểm, 9 CLO, công cụ, ngân hàng đề tài assignment và cách không trượt / ăn điểm cao.',
      lessons: [
        {
          title: '0.1 — What this subject is & why it matters|||0.1 — Môn học là gì & vì sao quan trọng',
          slug: 'mln122-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Bức tranh toàn cảnh: kinh tế chính trị Mác-Lênin nghiên cứu quan hệ kinh tế, và bản đồ 6 chương.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>An X-ray of how a market economy really works</h2>
<p class="lead">Political Economics of Marxism–Leninism studies the <strong>economic relations between people</strong> hidden behind everyday things — prices, wages, profit, money. It gives you a lens to see <em>why</em> a phone costs what it does, <em>where</em> profit comes from, and <em>how</em> monopolies and the modern digital economy behave. This is not just ideology; it is an analytical toolkit for reading economic reality.</p>
<p>The course builds in a clear arc: from the smallest unit (a <strong>commodity</strong>) up through <strong>surplus value</strong> (the engine of capitalism), <strong>monopoly</strong> (Lenin), and finally Vietnam's <strong>socialist-oriented market economy</strong>.</p>

<h3>The 6-chapter map</h3>
<div class="lz-map">
  <div class="lz-stage">Foundations</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Object, method & functions</div><div class="lz-nsub">what political economy studies & how</div></div></div>
  <div class="lz-stage">The market</div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Commodities, money & market</div><div class="lz-nsub">two properties of a commodity · value · money · the law of value</div></div></div>
  <div class="lz-stage">Capitalism's core</div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Surplus value</div><div class="lz-nsub">origin of profit · rate of surplus value · capital accumulation</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Competition & monopoly</div><div class="lz-nsub">Lenin · 5 economic features · state monopoly · today</div></div></div>
  <div class="lz-stage">Vietnam</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Socialist-oriented market economy</div><div class="lz-nsub">nature · characteristics · economic-interest relations</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Industrialization & integration</div><div class="lz-nsub">CNH-HĐH · international economic integration</div></div></div>
  <div class="lz-stage">Exam prep &amp; beyond ★</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Question bank + modern links</div><div class="lz-nsub">digital economy · Resolutions 57/68 · comparison</div></div></div>
</div>

<div class="callout ok"><strong>How to actually pass and enjoy it:</strong> don't memorize definitions blindly. For every concept, ask "what real thing does this explain?" — link surplus value to a real company's profit, monopoly to a real tech giant. Examiners reward <em>understanding + real-world connection</em>, and it makes the theory stick.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Why an IT student studies this.</b> The digital economy runs on exactly the categories here — value, price, monopoly, network effects. Understanding surplus value and monopoly helps you reason about platform economics, big-tech power and data as a factor of production. <em>This connection is beyond the syllabus but is why the theory is surprisingly relevant to tech.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Một tấm X-quang về cách nền kinh tế thị trường vận hành thật sự</h2>
<p class="lead">Kinh tế chính trị Mác–Lênin nghiên cứu các <strong>quan hệ kinh tế giữa con người</strong> ẩn sau những thứ hằng ngày — giá cả, tiền lương, lợi nhuận, tiền tệ. Nó cho bạn một lăng kính để thấy <em>vì sao</em> một chiếc điện thoại có giá như thế, <em>lợi nhuận</em> đến từ đâu, và độc quyền cùng kinh tế số hiện đại vận hành ra sao. Đây không chỉ là ý thức hệ; nó là một bộ công cụ phân tích để đọc hiểu thực tại kinh tế.</p>
<p>Môn học xây theo một mạch rõ ràng: từ đơn vị nhỏ nhất (một <strong>hàng hóa</strong>) đi lên qua <strong>giá trị thặng dư</strong> (động cơ của chủ nghĩa tư bản), <strong>độc quyền</strong> (Lenin), và cuối cùng là <strong>kinh tế thị trường định hướng XHCN</strong> ở Việt Nam.</p>

<h3>Bản đồ 6 chương</h3>
<div class="lz-map">
  <div class="lz-stage">Nền tảng</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Đối tượng, phương pháp & chức năng</div><div class="lz-nsub">kinh tế chính trị nghiên cứu gì & bằng cách nào</div></div></div>
  <div class="lz-stage">Thị trường</div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Hàng hóa, tiền tệ & thị trường</div><div class="lz-nsub">hai thuộc tính hàng hóa · giá trị · tiền tệ · quy luật giá trị</div></div></div>
  <div class="lz-stage">Lõi của CNTB</div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Giá trị thặng dư</div><div class="lz-nsub">nguồn gốc lợi nhuận · tỷ suất m · tích lũy tư bản</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Cạnh tranh & độc quyền</div><div class="lz-nsub">Lenin · 5 đặc điểm kinh tế · độc quyền nhà nước · ngày nay</div></div></div>
  <div class="lz-stage">Việt Nam</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Kinh tế thị trường định hướng XHCN</div><div class="lz-nsub">bản chất · đặc trưng · quan hệ lợi ích kinh tế</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Công nghiệp hóa & hội nhập</div><div class="lz-nsub">CNH-HĐH · hội nhập kinh tế quốc tế</div></div></div>
  <div class="lz-stage">Ôn thi &amp; ngoài giáo trình ★</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Ngân hàng câu hỏi + liên hệ hiện đại</div><div class="lz-nsub">kinh tế số · Nghị quyết 57/68 · so sánh</div></div></div>
</div>

<div class="callout ok"><strong>Cách thực sự qua môn và thấy hay:</strong> đừng học thuộc định nghĩa một cách mù quáng. Với mỗi khái niệm, hãy hỏi "cái này giải thích thứ thật nào?" — liên hệ giá trị thặng dư với lợi nhuận một công ty thật, độc quyền với một gã khổng lồ công nghệ thật. Giám khảo thưởng cho <em>sự hiểu + liên hệ thực tiễn</em>, và điều đó khiến lý thuyết bám chắc.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Vì sao sinh viên CNTT học môn này.</b> Kinh tế số vận hành đúng trên các phạm trù ở đây — giá trị, giá cả, độc quyền, hiệu ứng mạng. Hiểu giá trị thặng dư và độc quyền giúp bạn lý giải kinh tế nền tảng, quyền lực của big-tech và dữ liệu như một yếu tố sản xuất. <em>Liên hệ này ngoài syllabus nhưng là lý do lý thuyết bất ngờ liên quan tới ngành tech.</em></div>
</div>`,
        },
        {
          title: '0.2 — How you are graded|||0.2 — Cách tính điểm',
          slug: 'mln122-thang-diem',
          type: 'article',
          description: 'Bảng thang điểm: Participation 10% + Progress test 20% + Assignment 40% + Final exam 30%, và điều kiện qua môn.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>The grade breakdown — know where points come from</h2>
<p class="lead">MLN122 splits into ongoing work (70%) and a final exam (30%). The biggest single piece is the <strong>Assignment (40%)</strong> — so how you research and write it largely decides your grade.</p>
<table>
<thead><tr><th>Component</th><th>Weight</th><th>Form</th></tr></thead>
<tbody>
<tr><td>Participation</td><td><strong>10%</strong></td><td>Attendance, in-class discussion</td></tr>
<tr><td>Progress test</td><td><strong>20%</strong></td><td>1 test (~20 min)</td></tr>
<tr><td>Assignment</td><td><strong>40%</strong></td><td>Essay/report (instructor's chosen form)</td></tr>
<tr><td>Final exam</td><td><strong>30%</strong></td><td>~60 min</td></tr>
</tbody>
</table>
<div class="kv-grid">
<div class="kv"><span class="k">Scale</span><span class="v">10</span></div>
<div class="kv"><span class="k">Pass</span><span class="v">Final result ≥ 5 AND final exam ≥ 4</span></div>
<div class="kv"><span class="k">Attendance</span><span class="v">≥ 80% of class hours</span></div>
<div class="kv"><span class="k">Biggest lever</span><span class="v">Assignment 40%</span></div>
</div>
<div class="callout warn"><strong>Two gates, not one.</strong> You need final result ≥ 5 <em>and</em> final exam ≥ 4. A strong assignment can't fully rescue a failed final exam — you must clear the exam bar too. Don't neglect exam prep even if your assignment is excellent.</div>
<div class="pitfall"><strong>Attendance is a hard gate.</strong> Below 80% you may be barred from assessment. Track it from week 1.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The assignment rewards analysis over summary.</b> A report that <em>applies</em> a concept to a real case (e.g. surplus value in a specific industry, monopoly in a real market) scores far higher than one that just restates the textbook. Aim to analyze, not to copy. <em>Beyond the syllabus, but the difference between a 6 and a 9 on the 40% assignment.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Cấu trúc điểm — biết điểm đến từ đâu</h2>
<p class="lead">MLN122 chia thành phần thường xuyên (70%) và thi cuối kỳ (30%). Phần lớn nhất là <strong>Assignment (40%)</strong> — nên cách bạn nghiên cứu và viết nó quyết định phần lớn điểm.</p>
<table>
<thead><tr><th>Thành phần</th><th>Trọng số</th><th>Hình thức</th></tr></thead>
<tbody>
<tr><td>Tham gia (Participation)</td><td><strong>10%</strong></td><td>Điểm danh, thảo luận trên lớp</td></tr>
<tr><td>Kiểm tra tiến độ (Progress test)</td><td><strong>20%</strong></td><td>1 bài (~20 phút)</td></tr>
<tr><td>Assignment</td><td><strong>40%</strong></td><td>Tiểu luận/báo cáo (theo hình thức giảng viên chọn)</td></tr>
<tr><td>Thi cuối kỳ</td><td><strong>30%</strong></td><td>~60 phút</td></tr>
</tbody>
</table>
<div class="kv-grid">
<div class="kv"><span class="k">Thang</span><span class="v">10</span></div>
<div class="kv"><span class="k">Qua môn</span><span class="v">Kết quả ≥ 5 VÀ thi cuối ≥ 4</span></div>
<div class="kv"><span class="k">Điểm danh</span><span class="v">≥ 80% giờ học</span></div>
<div class="kv"><span class="k">Đòn bẩy lớn nhất</span><span class="v">Assignment 40%</span></div>
</div>
<div class="callout warn"><strong>Hai cổng, không phải một.</strong> Bạn cần kết quả ≥ 5 <em>và</em> thi cuối ≥ 4. Một assignment mạnh không cứu được hoàn toàn một bài thi cuối trượt — bạn phải vượt cả ngưỡng thi. Đừng lơ là ôn thi dù assignment xuất sắc.</div>
<div class="pitfall"><strong>Điểm danh là cổng cứng.</strong> Dưới 80% có thể bị cấm thi/đánh giá. Theo dõi từ tuần 1.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Assignment thưởng phân tích hơn tóm tắt.</b> Một báo cáo <em>vận dụng</em> khái niệm vào một ca thật (vd giá trị thặng dư trong một ngành cụ thể, độc quyền trong một thị trường thật) điểm cao hơn nhiều so với chép lại giáo trình. Hãy phân tích, đừng chép. <em>Ngoài syllabus, nhưng là khác biệt giữa điểm 6 và điểm 9 ở assignment 40%.</em></div>
</div>`,
        },
        {
          title: '0.3 — Course learning outcomes (9 CLOs)|||0.3 — Chuẩn đầu ra môn học (9 CLO)',
          slug: 'mln122-clo',
          type: 'article',
          description: '9 CLO của MLN122 nhóm gọn theo chương — dùng để tự soi trước khi thi/nộp.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>The 9 CLOs — what you must be able to do</h2>
<p class="lead">MLN122 has nine outcomes, mapping to the six chapters plus skills. Use this as a self-check.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">CLO1</span> Grasp the formation, object, method and functions of political economy. <em>→ Ch1</em></div>
<div class="lz-layer"><span class="lz-lk">CLO2</span> Understand & analyze Marx's views on commodities, money, market. <em>→ Ch2</em></div>
<div class="lz-layer"><span class="lz-lk">CLO3</span> Understand surplus value, capital & accumulation. <em>→ Ch3</em></div>
<div class="lz-layer"><span class="lz-lk">CLO4</span> Understand competition & monopoly and their modern forms. <em>→ Ch4</em></div>
<div class="lz-layer"><span class="lz-lk">CLO5</span> Grasp the socialist-oriented market economy & economic-interest relations in Vietnam. <em>→ Ch5</em></div>
<div class="lz-layer"><span class="lz-lk">CLO6</span> Analyze industrialization–modernization & international economic integration. <em>→ Ch6</em></div>
<div class="lz-layer"><span class="lz-lk">CLO7</span> Build revolutionary ethics & a firm political standpoint; see the scientific value. <em>→ all</em></div>
<div class="lz-layer"><span class="lz-lk">CLO8</span> Form analytical thinking to identify the essence of economic-interest relations. <em>→ all</em></div>
<div class="lz-layer"><span class="lz-lk">CLO9</span> Skills: reasoning, essay writing, presentation, responsible AI use. <em>→ assignment</em></div>
</div>
<div class="callout ok">The arc: <strong>foundations → market → capitalism's core → monopoly → Vietnam → integration</strong>, plus cross-cutting analysis and communication skills (CLO7-9). The exam tests CLO1-6; the assignment tests CLO8-9.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>9 CLO — bạn phải làm được gì</h2>
<p class="lead">MLN122 có chín chuẩn đầu ra, ánh xạ tới sáu chương cộng kỹ năng. Dùng để tự soi.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">CLO1</span> Nắm sự hình thành, đối tượng, phương pháp và chức năng của kinh tế chính trị. <em>→ Ch1</em></div>
<div class="lz-layer"><span class="lz-lk">CLO2</span> Hiểu & phân tích quan điểm của Marx về hàng hóa, tiền tệ, thị trường. <em>→ Ch2</em></div>
<div class="lz-layer"><span class="lz-lk">CLO3</span> Hiểu giá trị thặng dư, tư bản & tích lũy. <em>→ Ch3</em></div>
<div class="lz-layer"><span class="lz-lk">CLO4</span> Hiểu cạnh tranh & độc quyền và các biểu hiện hiện đại. <em>→ Ch4</em></div>
<div class="lz-layer"><span class="lz-lk">CLO5</span> Nắm kinh tế thị trường định hướng XHCN & quan hệ lợi ích kinh tế ở Việt Nam. <em>→ Ch5</em></div>
<div class="lz-layer"><span class="lz-lk">CLO6</span> Phân tích công nghiệp hóa–hiện đại hóa & hội nhập kinh tế quốc tế. <em>→ Ch6</em></div>
<div class="lz-layer"><span class="lz-lk">CLO7</span> Xây phẩm chất đạo đức cách mạng & lập trường chính trị vững; thấy giá trị khoa học. <em>→ tất cả</em></div>
<div class="lz-layer"><span class="lz-lk">CLO8</span> Hình thành tư duy phân tích, nhận diện bản chất các quan hệ lợi ích kinh tế. <em>→ tất cả</em></div>
<div class="lz-layer"><span class="lz-lk">CLO9</span> Kỹ năng: lập luận, viết luận, thuyết trình, ứng dụng AI có trách nhiệm. <em>→ assignment</em></div>
</div>
<div class="callout ok">Mạch: <strong>nền tảng → thị trường → lõi CNTB → độc quyền → Việt Nam → hội nhập</strong>, cộng kỹ năng phân tích và giao tiếp xuyên suốt (CLO7-9). Thi kiểm CLO1-6; assignment kiểm CLO8-9.</div>
</div>`,
        },
        {
          title: '0.4 — Tools & study setup (Exp Hub)|||0.4 — Công cụ & cách học (Exp Hub)',
          slug: 'mln122-cong-cu',
          type: 'article',
          description: 'Bộ công cụ học môn lý luận: giáo trình PDF, sơ đồ tư duy, AI hỗ trợ có đạo đức — kèm guide.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>How to study a theory-heavy subject efficiently</h2>
<p class="lead">MLN122 has no code — it rewards <em>structured understanding</em>. Your tools are the textbook, a mind-mapping habit, and responsible AI to test your understanding (not to write your assignment for you).</p>
<ul>
<li><strong>The official textbook (PDF)</strong> — the single source of truth for exam answers.</li>
<li><strong>Mind-mapping</strong> (XMind / draw.io) — turn each chapter's categories into a diagram.</li>
<li><strong>Flashcards</strong> (Anki / Quizlet) — for definitions and Lenin's 5 features.</li>
<li><strong>AI, used responsibly</strong> — to explain a concept or quiz yourself, never to fabricate an essay (CLO9 explicitly requires ethical AI use).</li>
</ul>
<a class="link-card exphub" href="/exp-hub/mln122-cong-cu-hoc?ref=%2Fcourses%2Fpolitical-economics-of-marxism-leninism%2Flearn&reflabel=MLN122%200.4" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Study guide: textbook, mind-maps & responsible AI</span><span class="lc-sub">Where to get the textbook, how to mind-map each chapter, flashcards, and ethical AI study.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Teach it to pass it.</b> The Feynman technique — explaining a concept in plain words as if teaching a friend — exposes exactly what you don't understand. If you can explain "where surplus value comes from" without jargon, you'll ace any question on it. <em>A learning method beyond the syllabus that works especially well for theory.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Cách học hiệu quả một môn nặng lý luận</h2>
<p class="lead">MLN122 không có code — nó thưởng cho <em>sự hiểu có cấu trúc</em>. Công cụ của bạn là giáo trình, thói quen vẽ sơ đồ tư duy, và AI dùng có trách nhiệm để kiểm tra sự hiểu (không phải để viết hộ assignment).</p>
<ul>
<li><strong>Giáo trình chính thức (PDF)</strong> — nguồn sự thật duy nhất cho đáp án thi.</li>
<li><strong>Sơ đồ tư duy</strong> (XMind / draw.io) — biến các phạm trù mỗi chương thành một sơ đồ.</li>
<li><strong>Thẻ ghi nhớ</strong> (Anki / Quizlet) — cho định nghĩa và 5 đặc điểm của Lenin.</li>
<li><strong>AI, dùng có trách nhiệm</strong> — để giải thích một khái niệm hoặc tự kiểm tra, không bao giờ để bịa một bài luận (CLO9 yêu cầu rõ dùng AI có đạo đức).</li>
</ul>
<a class="link-card exphub" href="/exp-hub/mln122-cong-cu-hoc?ref=%2Fcourses%2Fpolitical-economics-of-marxism-leninism%2Flearn&reflabel=MLN122%200.4" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Guide học: giáo trình, sơ đồ tư duy & AI có trách nhiệm</span><span class="lc-sub">Lấy giáo trình ở đâu, cách vẽ sơ đồ mỗi chương, thẻ ghi nhớ, và học với AI có đạo đức.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Dạy lại để hiểu.</b> Kỹ thuật Feynman — giải thích một khái niệm bằng lời đơn giản như đang dạy một người bạn — phơi bày đúng chỗ bạn chưa hiểu. Nếu giải thích được "giá trị thặng dư đến từ đâu" không dùng thuật ngữ rối, bạn sẽ ăn trọn mọi câu hỏi về nó. <em>Một phương pháp học ngoài syllabus đặc biệt hiệu quả với lý luận.</em></div>
</div>`,
        },
        {
          title: '0.5 — Assignment topic bank (12) + how to pick|||0.5 — Ngân hàng đề tài Assignment (12) + cách chọn',
          slug: 'mln122-ngan-hang-de-tai',
          type: 'article',
          description: '12 đề tài assignment đã kiểm scope (vận dụng lý luận vào thực tiễn) + rubric chọn & viết.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.5</span>
<h2>12 assignment topics — apply theory to reality</h2>
<p class="lead">The 40% assignment rewards <em>analysis of a real case through the theory</em>, not a textbook summary. Here are 12 pre-scoped topics that connect a course concept to something real and current. Pick one you can find real examples and data for.</p>
<table>
<thead><tr><th>#</th><th>Topic</th><th>Concept it applies</th></tr></thead>
<tbody>
<tr><td>1</td><td>Why an iPhone costs what it does: value vs price</td><td>Value, socially-necessary labor time (Ch2)</td></tr>
<tr><td>2</td><td>Surplus value in a modern factory / gig platform</td><td>Surplus value, exploitation rate (Ch3)</td></tr>
<tr><td>3</td><td>Big Tech as monopoly: Google/Meta and Lenin's features</td><td>Monopoly, Lenin's 5 features (Ch4)</td></tr>
<tr><td>4</td><td>Is EVN/Viettel a state monopoly? Analyze</td><td>State monopoly (Ch4)</td></tr>
<tr><td>5</td><td>The law of value in Vietnam's price movements</td><td>Law of value, supply–demand (Ch2)</td></tr>
<tr><td>6</td><td>Capital accumulation & inequality: opportunity or gap?</td><td>Accumulation (Ch3)</td></tr>
<tr><td>7</td><td>Characteristics of Vietnam's socialist-oriented market economy</td><td>SO market economy (Ch5)</td></tr>
<tr><td>8</td><td>Harmonizing economic-interest relations: the state's role</td><td>Economic-interest relations (Ch5)</td></tr>
<tr><td>9</td><td>Industry 4.0: opportunities & challenges for Vietnam</td><td>CNH-HĐH (Ch6)</td></tr>
<tr><td>10</td><td>Lessons from Japan/Korea industrialization for Vietnam</td><td>Industrialization (Ch6)</td></tr>
<tr><td>11</td><td>Vietnam's international economic integration: costs & benefits</td><td>Integration (Ch6)</td></tr>
<tr><td>12</td><td>Data & the digital economy as a new "commodity"</td><td>Commodity, value ★ (Ch2 extended)</td></tr>
</tbody>
</table>

<h3>The 4-test filter — pick a topic you can defend</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">1 · Concept-clear</span> Can you state which course concept it applies?</div>
<div class="lz-layer"><span class="lz-lk">2 · Evidence-rich</span> Can you find real examples, data, cases (not just opinion)?</div>
<div class="lz-layer"><span class="lz-lk">3 · Analyzable</span> Does it let you <em>analyze</em>, not just describe?</div>
<div class="lz-layer"><span class="lz-lk">4 · Right-sized</span> Narrow enough to go deep in the required length?</div>
</div>

<div class="callout ok"><strong>Essay skeleton that scores:</strong> (1) state the theory precisely → (2) present the real case with data → (3) analyze the case <em>through</em> the theory → (4) evaluate & connect to Vietnam → (5) conclude with your own reasoned view. Theory + real evidence + your analysis = top marks.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Cite real sources, use AI to check not to write.</b> A report grounded in real statistics (GSO, World Bank) and Party documents, with your own analysis, is far stronger — and honest. Using AI to fabricate content violates CLO9's ethical-use requirement and is easy to detect. <em>Beyond the syllabus, but the integrity practice that protects your grade.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.5</span>
<h2>12 đề tài assignment — vận dụng lý luận vào thực tiễn</h2>
<p class="lead">Assignment 40% thưởng cho <em>phân tích một ca thật qua lý thuyết</em>, không phải tóm tắt giáo trình. Đây là 12 đề tài đã kiểm scope nối một khái niệm của môn với một thứ thật và thời sự. Chọn một đề bạn tìm được ví dụ và số liệu thật.</p>
<table>
<thead><tr><th>#</th><th>Đề tài</th><th>Khái niệm vận dụng</th></tr></thead>
<tbody>
<tr><td>1</td><td>Vì sao iPhone có giá đó: giá trị vs giá cả</td><td>Giá trị, thời gian LĐ xã hội cần thiết (Ch2)</td></tr>
<tr><td>2</td><td>Giá trị thặng dư trong nhà máy / nền tảng gig hiện đại</td><td>Giá trị thặng dư, tỷ suất bóc lột (Ch3)</td></tr>
<tr><td>3</td><td>Big Tech như độc quyền: Google/Meta & đặc điểm Lenin</td><td>Độc quyền, 5 đặc điểm Lenin (Ch4)</td></tr>
<tr><td>4</td><td>EVN/Viettel có phải độc quyền nhà nước? Phân tích</td><td>Độc quyền nhà nước (Ch4)</td></tr>
<tr><td>5</td><td>Quy luật giá trị trong biến động giá cả ở Việt Nam</td><td>Quy luật giá trị, cung–cầu (Ch2)</td></tr>
<tr><td>6</td><td>Tích lũy tư bản & bất bình đẳng: cơ hội hay khoảng cách?</td><td>Tích lũy (Ch3)</td></tr>
<tr><td>7</td><td>Đặc trưng của kinh tế thị trường định hướng XHCN ở VN</td><td>KTTT định hướng XHCN (Ch5)</td></tr>
<tr><td>8</td><td>Hài hòa các quan hệ lợi ích kinh tế: vai trò nhà nước</td><td>Quan hệ lợi ích kinh tế (Ch5)</td></tr>
<tr><td>9</td><td>Công nghiệp 4.0: cơ hội & thách thức cho Việt Nam</td><td>CNH-HĐH (Ch6)</td></tr>
<tr><td>10</td><td>Bài học công nghiệp hóa Nhật/Hàn cho Việt Nam</td><td>Công nghiệp hóa (Ch6)</td></tr>
<tr><td>11</td><td>Hội nhập kinh tế quốc tế của VN: chi phí & lợi ích</td><td>Hội nhập (Ch6)</td></tr>
<tr><td>12</td><td>Dữ liệu & kinh tế số như một "hàng hóa" mới</td><td>Hàng hóa, giá trị ★ (Ch2 mở rộng)</td></tr>
</tbody>
</table>

<h3>Bộ lọc 4 phép thử — chọn đề bạn bảo vệ được</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">1 · Rõ khái niệm</span> Bạn nêu được nó vận dụng khái niệm nào của môn không?</div>
<div class="lz-layer"><span class="lz-lk">2 · Giàu bằng chứng</span> Bạn tìm được ví dụ, số liệu, ca thật (không chỉ ý kiến) không?</div>
<div class="lz-layer"><span class="lz-lk">3 · Phân tích được</span> Nó cho bạn <em>phân tích</em>, không chỉ mô tả, không?</div>
<div class="lz-layer"><span class="lz-lk">4 · Đúng cỡ</span> Đủ hẹp để đi sâu trong độ dài yêu cầu không?</div>
</div>

<div class="callout ok"><strong>Khung tiểu luận ăn điểm:</strong> (1) nêu lý thuyết chính xác → (2) trình bày ca thật có số liệu → (3) phân tích ca <em>qua</em> lý thuyết → (4) đánh giá & liên hệ Việt Nam → (5) kết luận bằng chính kiến có lập luận. Lý thuyết + bằng chứng thật + phân tích của bạn = điểm cao.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Trích nguồn thật, dùng AI để kiểm không phải để viết.</b> Một báo cáo dựa trên số liệu thật (Tổng cục Thống kê, World Bank) và văn kiện Đảng, kèm phân tích của bạn, mạnh hơn nhiều — và trung thực. Dùng AI bịa nội dung vi phạm yêu cầu dùng AI có đạo đức của CLO9 và dễ bị phát hiện. <em>Ngoài syllabus, nhưng là thực hành liêm chính bảo vệ điểm của bạn.</em></div>
</div>`,
        },
        {
          title: '0.6 — How not to fail & how to score high|||0.6 — Cách không trượt & cách ăn điểm cao',
          slug: 'mln122-chong-truot-diem-cao',
          type: 'article',
          description: '6 kiểu mất điểm ở môn lý luận + cách học/viết/thi để ăn điểm cao + cờ xanh cờ đỏ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.6</span>
<h2>6 ways students lose points — and how to avoid each</h2>
<p class="lead">Theory subjects fail students who memorize without understanding, or who write vaguely. Here are the classic point-losers and their fixes.</p>
<table>
<thead><tr><th>#</th><th>How you lose points</th><th>The fix</th></tr></thead>
<tbody>
<tr><td>1</td><td>Memorizing words without understanding meaning</td><td>Explain each concept in your own plain words</td></tr>
<tr><td>2</td><td>Assignment just restates the textbook</td><td>Apply theory to a real case with data & analysis</td></tr>
<tr><td>3</td><td>Confusing related categories (value vs price, m vs profit)</td><td>Make a comparison table for each confusing pair</td></tr>
<tr><td>4</td><td>Vague, unstructured essay</td><td>Use the 5-part skeleton (theory→case→analysis→VN→view)</td></tr>
<tr><td>5</td><td>Ignoring exam prep (final gate ≥4)</td><td>Practice the question bank; know Ch3 & Ch4 cold</td></tr>
<tr><td>6</td><td>Using AI to fabricate (violates CLO9)</td><td>Use AI to check understanding; write it yourself</td></tr>
</tbody>
</table>

<h3>Green flags / red flags</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Green</span> You can explain surplus value & monopoly in plain words · your assignment analyzes a real case · you can compute m' and c/v · you link theory to current events.</div>
<div class="lz-layer"><span class="lz-lk">Red</span> You only recite definitions · your essay is a textbook copy · you can't tell value from price · you skipped the formulas in Ch3.</div>
</div>

<div class="callout ok"><strong>The high-mark formula.</strong> Grade = (understand, not just memorize) × (apply theory to real cases) × (write with clear structure) × (pass the exam gate). Nail all four and you're in 9-territory; the theory even becomes genuinely interesting.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Connect old theory to today's news.</b> The most impressive answers link a 150-year-old concept to a 2025 headline: surplus value → gig-economy debates; monopoly → antitrust cases against Big Tech; the law of value → inflation. Examiners remember the student who made Marx feel current. <em>Beyond the syllabus, but the move that turns a memorized answer into a memorable one.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.6</span>
<h2>6 kiểu sinh viên mất điểm — và cách tránh từng cái</h2>
<p class="lead">Môn lý luận đánh trượt sinh viên học thuộc mà không hiểu, hoặc viết mơ hồ. Đây là các thủ phạm kinh điển và cách sửa.</p>
<table>
<thead><tr><th>#</th><th>Cách bạn mất điểm</th><th>Cách sửa</th></tr></thead>
<tbody>
<tr><td>1</td><td>Học thuộc chữ mà không hiểu nghĩa</td><td>Giải thích mỗi khái niệm bằng lời của chính bạn</td></tr>
<tr><td>2</td><td>Assignment chỉ chép lại giáo trình</td><td>Vận dụng lý thuyết vào ca thật có số liệu & phân tích</td></tr>
<tr><td>3</td><td>Lẫn lộn các phạm trù gần nhau (giá trị vs giá cả, m vs lợi nhuận)</td><td>Lập bảng so sánh cho mỗi cặp dễ nhầm</td></tr>
<tr><td>4</td><td>Tiểu luận mơ hồ, không cấu trúc</td><td>Dùng khung 5 phần (lý thuyết→ca→phân tích→VN→chính kiến)</td></tr>
<tr><td>5</td><td>Lơ ôn thi (cổng thi cuối ≥4)</td><td>Luyện ngân hàng câu hỏi; nắm chắc Ch3 & Ch4</td></tr>
<tr><td>6</td><td>Dùng AI bịa (vi phạm CLO9)</td><td>Dùng AI để kiểm tra sự hiểu; tự viết</td></tr>
</tbody>
</table>

<h3>Cờ xanh / cờ đỏ</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Xanh</span> Giải thích được giá trị thặng dư & độc quyền bằng lời · assignment phân tích một ca thật · tính được m' và c/v · liên hệ lý thuyết với thời sự.</div>
<div class="lz-layer"><span class="lz-lk">Đỏ</span> Chỉ đọc vẹt định nghĩa · tiểu luận chép giáo trình · không phân biệt giá trị với giá cả · bỏ qua công thức Ch3.</div>
</div>

<div class="callout ok"><strong>Công thức điểm cao.</strong> Điểm = (hiểu, không chỉ thuộc) × (vận dụng lý thuyết vào ca thật) × (viết có cấu trúc rõ) × (qua cổng thi). Đủ cả bốn là vùng 9; lý thuyết thậm chí trở nên thực sự thú vị.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Nối lý thuyết cũ với tin tức hôm nay.</b> Những câu trả lời ấn tượng nhất nối một khái niệm 150 năm tuổi với một tiêu đề 2025: giá trị thặng dư → tranh luận kinh tế gig; độc quyền → các vụ kiện chống độc quyền Big Tech; quy luật giá trị → lạm phát. Giám khảo nhớ sinh viên khiến Marx trở nên thời sự. <em>Ngoài syllabus, nhưng là nước đi biến một câu trả lời học thuộc thành một câu đáng nhớ.</em></div>
</div>`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 1 — ĐỐI TƯỢNG, PHƯƠNG PHÁP & CHỨC NĂNG ══════════════════ */
    {
      title: 'Chapter 1 — Object, method & functions|||Chương 1 — Đối tượng, phương pháp & chức năng',
      description: 'Kinh tế chính trị Mác-Lênin nghiên cứu gì, bằng phương pháp nào, và có những chức năng gì.',
      lessons: [
        {
          title: '1.1 — What political economy studies & how|||1.1 — Kinh tế chính trị nghiên cứu gì & thế nào',
          slug: 'mln122-1-1-doi-tuong-phuong-phap',
          type: 'VIDEO',
          description: 'Đối tượng (quan hệ sản xuất), phương pháp (trừu tượng hóa khoa học) và 4 chức năng của môn học.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>The science of production relations</h2>
<p class="lead">Marxist–Leninist political economy studies the <strong>relations of production</strong> — the economic relationships between people in producing, distributing, exchanging and consuming — in connection with the productive forces and the political-social superstructure. In short: it studies <em>how people relate economically</em>, not just how machines or markets work.</p>

<h3>Object, method, functions</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Object</span> Relations of production in their interaction with productive forces and superstructure.</div>
<div class="lz-layer"><span class="lz-lk">Core method</span> Scientific abstraction — strip away the accidental to grasp the essential (Marx couldn't use a lab, so he isolated economic essence by thought).</div>
<div class="lz-layer"><span class="lz-lk">Also uses</span> Materialist dialectics, logic + history, analysis + synthesis.</div>
</div>

<h3>The four functions</h3>
<table>
<thead><tr><th>Function</th><th>What it does</th></tr></thead>
<tbody>
<tr><td>Cognitive (nhận thức)</td><td>Reveals the laws & essence of economic phenomena</td></tr>
<tr><td>Practical (thực tiễn)</td><td>Guides real economic action & policy</td></tr>
<tr><td>Methodological (phương pháp luận)</td><td>A foundation for other economic sciences</td></tr>
<tr><td>Ideological (tư tưởng)</td><td>Shapes economic standpoint & worldview</td></tr>
</tbody>
</table>

<div class="callout ok"><strong>Why "scientific abstraction" matters:</strong> you can't put an economy in a test tube. To find the law behind messy reality, you mentally isolate the essential relation (e.g. "value") from thousands of accidental factors. This is the mental move you'll repeat all course.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Political economy vs micro/macroeconomics.</b> Mainstream micro/macro studies <em>how</em> to allocate resources efficiently (mechanisms, curves); political economy asks <em>who benefits and why</em> — the social relations behind the numbers. They're complementary lenses, not rivals. <em>Beyond the syllabus, but it clarifies what makes this subject distinct.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Khoa học về quan hệ sản xuất</h2>
<p class="lead">Kinh tế chính trị Mác–Lênin nghiên cứu <strong>quan hệ sản xuất</strong> — các quan hệ kinh tế giữa con người trong sản xuất, phân phối, trao đổi và tiêu dùng — trong mối liên hệ với lực lượng sản xuất và kiến trúc thượng tầng chính trị-xã hội. Nói ngắn: nó nghiên cứu <em>con người quan hệ kinh tế với nhau thế nào</em>, không chỉ máy móc hay thị trường vận hành ra sao.</p>

<h3>Đối tượng, phương pháp, chức năng</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Đối tượng</span> Quan hệ sản xuất trong tác động qua lại với lực lượng sản xuất và kiến trúc thượng tầng.</div>
<div class="lz-layer"><span class="lz-lk">Phương pháp cốt lõi</span> Trừu tượng hóa khoa học — bóc cái ngẫu nhiên để nắm cái bản chất (Marx không dùng được phòng thí nghiệm, nên tách bản chất kinh tế bằng tư duy).</div>
<div class="lz-layer"><span class="lz-lk">Cũng dùng</span> Phép biện chứng duy vật, logic + lịch sử, phân tích + tổng hợp.</div>
</div>

<h3>Bốn chức năng</h3>
<table>
<thead><tr><th>Chức năng</th><th>Làm gì</th></tr></thead>
<tbody>
<tr><td>Nhận thức</td><td>Vạch ra quy luật & bản chất các hiện tượng kinh tế</td></tr>
<tr><td>Thực tiễn</td><td>Định hướng hành động kinh tế & chính sách thật</td></tr>
<tr><td>Phương pháp luận</td><td>Nền tảng cho các khoa học kinh tế khác</td></tr>
<tr><td>Tư tưởng</td><td>Hình thành lập trường kinh tế & thế giới quan</td></tr>
</tbody>
</table>

<div class="callout ok"><strong>Vì sao "trừu tượng hóa khoa học" quan trọng:</strong> bạn không đặt được nền kinh tế vào ống nghiệm. Để tìm quy luật sau thực tại hỗn độn, bạn tách quan hệ bản chất (vd "giá trị") khỏi hàng nghìn yếu tố ngẫu nhiên bằng tư duy. Đây là thao tác tư duy bạn sẽ lặp lại suốt môn.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Kinh tế chính trị vs kinh tế vi/vĩ mô.</b> Kinh tế vi/vĩ mô chính thống nghiên cứu <em>làm sao</em> phân bổ nguồn lực hiệu quả (cơ chế, đường cong); kinh tế chính trị hỏi <em>ai được lợi và vì sao</em> — quan hệ xã hội sau những con số. Chúng là các lăng kính bổ sung, không phải đối thủ. <em>Ngoài syllabus, nhưng làm rõ điều khiến môn này khác biệt.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'The object of Marxist-Leninist political economy is:|||Đối tượng của kinh tế chính trị Mác-Lênin là:',
                options: [
                  'Only prices and money|||Chỉ giá cả và tiền tệ',
                  'Relations of production (economic relations between people)|||Quan hệ sản xuất (quan hệ kinh tế giữa con người)',
                  'Machines and technology|||Máy móc và công nghệ',
                  'Only individual firms|||Chỉ doanh nghiệp cá biệt',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'The core method of political economy is:|||Phương pháp cốt lõi của kinh tế chính trị là:',
                options: [
                  'Laboratory experiments|||Thí nghiệm phòng lab',
                  'Scientific abstraction|||Trừu tượng hóa khoa học',
                  'Random sampling|||Lấy mẫu ngẫu nhiên',
                  'Guessing|||Đoán',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'Which is NOT one of the four functions?|||Cái nào KHÔNG phải một trong bốn chức năng?',
                options: [
                  'Cognitive|||Nhận thức',
                  'Practical|||Thực tiễn',
                  'Entertainment|||Giải trí',
                  'Ideological|||Tư tưởng',
                ], correctIndex: 2,
              },
              {
                id: 'q4', points: 1,
                question: '(Beyond syllabus) Compared to mainstream micro/macro, political economy emphasizes:|||(Ngoài giáo trình) So với kinh tế vi/vĩ mô chính thống, kinh tế chính trị nhấn mạnh:',
                options: [
                  'Only mathematical curves|||Chỉ đường cong toán học',
                  'Who benefits and the social relations behind the numbers|||Ai được lợi và quan hệ xã hội sau các con số',
                  'Only stock prices|||Chỉ giá cổ phiếu',
                  'Nothing different|||Không gì khác',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 2 — HÀNG HÓA, TIỀN TỆ & THỊ TRƯỜNG ══════════════════ */
    {
      title: 'Chapter 2 — Commodities, money & the market|||Chương 2 — Hàng hóa, tiền tệ & thị trường',
      description: 'Hai thuộc tính của hàng hóa, lượng giá trị, nguồn gốc tiền tệ, và quy luật giá trị.',
      lessons: [
        {
          title: '2.1 — The commodity: two properties & value|||2.1 — Hàng hóa: hai thuộc tính & giá trị',
          slug: 'mln122-2-1-hang-hoa-gia-tri',
          type: 'VIDEO',
          description: 'Giá trị sử dụng & giá trị, lao động cụ thể & trừu tượng, và lượng giá trị = thời gian LĐ xã hội cần thiết.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>The commodity — the cell of the market economy</h2>
<p class="lead">Marx begins <em>Capital</em> with the commodity because it's the "economic cell" that contains all the contradictions of capitalism in miniature. A <strong>commodity</strong> is a product made to be exchanged, and it has <strong>two properties</strong>.</p>

<h3>The two properties</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Use-value (giá trị sử dụng)</span> Its usefulness — what need it satisfies. Created by <em>concrete labor</em>. Qualitative.</div>
<div class="lz-layer"><span class="lz-lk">Value (giá trị)</span> The socially-necessary human labor embodied in it — what makes it exchangeable. Created by <em>abstract labor</em>. Quantitative.</div>
</div>
<p>Exchange-value (the ratio at which goods trade) is just the <em>outward form</em> of value. Two very different use-values (a coat and 20m of cloth) exchange because they contain equal amounts of the same thing: human labor.</p>

<h3>The magnitude of value — the key formula</h3>
<div class="formula"><span class="lbl">Lượng giá trị của hàng hóa</span> Value = Socially-Necessary Labor Time (SNLT)</div>
<p>Not the time <em>you personally</em> take, but the time required <strong>on average</strong> under normal conditions and average skill/intensity. A lazy worker's extra hours don't add value.</p>

<h3>Worked example — why faster production lowers value</h3>
<div class="out"><strong>Setup:</strong> Society needs 4 hours to make one shirt (SNLT). A shirt's value = 4 labor-hours.
<strong>New machine:</strong> your factory now makes a shirt in 2 hours, but society's average is still 4.
<strong>Result:</strong> each of your shirts still <em>sells</em> at the 4-hour social value, but only <em>cost</em> you 2 → you pocket the difference (extra profit) until competitors adopt the machine.
<strong>Then:</strong> when everyone uses it, SNLT falls to 2 hours → the shirt's value (and price) drops to 2. <strong>This is why technology constantly cheapens goods.</strong></div>

<div class="callout ok"><strong>Key distinction to never confuse:</strong> higher <em>productivity</em> lowers value-per-unit (more units, same total value); higher <em>intensity</em> (working harder) creates more units AND more total value. Examiners love testing this pair.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Digital goods stress the theory.</b> Software has near-zero reproduction cost — the first copy embodies huge labor, the millionth almost none. This pushes the value theory to its edge and fuels modern debates about data, IP and platform value. <em>Beyond the syllabus, but a great assignment angle (topic #12).</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Hàng hóa — tế bào của nền kinh tế thị trường</h2>
<p class="lead">Marx mở đầu <em>Tư bản</em> bằng hàng hóa vì nó là "tế bào kinh tế" chứa đựng mọi mâu thuẫn của chủ nghĩa tư bản ở dạng thu nhỏ. <strong>Hàng hóa</strong> là sản phẩm làm ra để trao đổi, và nó có <strong>hai thuộc tính</strong>.</p>

<h3>Hai thuộc tính</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Giá trị sử dụng</span> Công dụng của nó — thỏa mãn nhu cầu gì. Do <em>lao động cụ thể</em> tạo ra. Về chất.</div>
<div class="lz-layer"><span class="lz-lk">Giá trị</span> Lao động xã hội cần thiết kết tinh trong nó — cái làm nó trao đổi được. Do <em>lao động trừu tượng</em> tạo ra. Về lượng.</div>
</div>
<p>Giá trị trao đổi (tỷ lệ trao đổi hàng hóa) chỉ là <em>hình thức biểu hiện bên ngoài</em> của giá trị. Hai giá trị sử dụng rất khác nhau (một cái áo và 20m vải) trao đổi được vì chúng chứa lượng bằng nhau của cùng một thứ: lao động con người.</p>

<h3>Lượng giá trị — công thức then chốt</h3>
<div class="formula"><span class="lbl">Lượng giá trị của hàng hóa</span> Giá trị = Thời gian lao động xã hội cần thiết (TGLĐXHCT)</div>
<p>Không phải thời gian <em>cá nhân bạn</em> bỏ ra, mà thời gian cần <strong>trung bình</strong> trong điều kiện bình thường với trình độ/cường độ trung bình. Giờ dư của người thợ lười không tạo thêm giá trị.</p>

<h3>Ví dụ có lời giải — vì sao sản xuất nhanh hơn làm giảm giá trị</h3>
<div class="out"><strong>Bối cảnh:</strong> Xã hội cần 4 giờ để làm một áo (TGLĐXHCT). Giá trị một áo = 4 giờ lao động.
<strong>Máy mới:</strong> nhà máy bạn giờ làm một áo trong 2 giờ, nhưng trung bình xã hội vẫn là 4.
<strong>Kết quả:</strong> mỗi áo của bạn vẫn <em>bán</em> theo giá trị xã hội 4 giờ, nhưng chỉ <em>tốn</em> 2 → bạn bỏ túi phần chênh (lợi nhuận siêu ngạch) cho tới khi đối thủ áp dụng máy.
<strong>Rồi:</strong> khi mọi người dùng máy, TGLĐXHCT giảm còn 2 giờ → giá trị (và giá) áo giảm còn 2. <strong>Đây là lý do công nghệ liên tục làm rẻ hàng hóa.</strong></div>

<div class="callout ok"><strong>Phân biệt then chốt đừng nhầm:</strong> tăng <em>năng suất</em> làm giảm giá trị mỗi đơn vị (nhiều đơn vị hơn, cùng tổng giá trị); tăng <em>cường độ</em> (làm cật lực hơn) tạo nhiều đơn vị hơn VÀ nhiều tổng giá trị hơn. Giám khảo rất thích kiểm cặp này.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Hàng hóa số thử thách lý thuyết.</b> Phần mềm có chi phí nhân bản gần bằng 0 — bản đầu tiên kết tinh lượng lao động khổng lồ, bản thứ triệu gần như không. Điều này đẩy lý thuyết giá trị tới giới hạn và làm nóng tranh luận hiện đại về dữ liệu, sở hữu trí tuệ và giá trị nền tảng. <em>Ngoài syllabus, nhưng là một góc assignment hay (đề #12).</em></div>
</div>`,
        },
        {
          title: '2.2 — Money & the law of value|||2.2 — Tiền tệ & quy luật giá trị',
          slug: 'mln122-2-2-tien-te-quy-luat',
          type: 'VIDEO',
          description: 'Nguồn gốc & 5 chức năng của tiền tệ, và quy luật giá trị điều tiết sản xuất – lưu thông.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Money — the universal equivalent</h2>
<p class="lead">Money isn't an arbitrary invention; it <strong>emerged from exchange itself</strong>. As barter grew complex, one commodity (historically gold) became the <em>universal equivalent</em> — the thing all others measure their value against. Money is a special commodity that expresses the value of all commodities.</p>

<h3>The five functions of money</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">1 · Measure of value</span> Prices express value in money terms.</div>
<div class="lz-layer"><span class="lz-lk">2 · Means of circulation</span> Mediates exchange (C–M–C).</div>
<div class="lz-layer"><span class="lz-lk">3 · Means of storage</span> A way to hoard value over time.</div>
<div class="lz-layer"><span class="lz-lk">4 · Means of payment</span> Settles debts, deferred payment.</div>
<div class="lz-layer"><span class="lz-lk">5 · World money</span> Functions in international exchange.</div>
</div>

<h3>The law of value — the invisible regulator</h3>
<p>The <strong>law of value</strong> says production and exchange must be based on socially-necessary labor time. It regulates the market through price fluctuating around value:</p>
<div class="formula"><span class="lbl">Cơ chế</span> Price oscillates around Value; supply &amp; demand push it above/below, competition pulls it back</div>
<ul>
<li><strong>Regulates production</strong> — capital flows to where price &gt; value (profitable), away from where price &lt; value.</li>
<li><strong>Stimulates technology</strong> — those who beat SNLT win extra profit, so everyone innovates.</li>
<li><strong>Selects & differentiates producers</strong> — efficient ones thrive, inefficient ones fail.</li>
</ul>

<div class="out"><strong>Worked example:</strong> if masks suddenly cost 50,000đ (price ≫ value) during a shortage, capital rushes into mask-making (regulation of production). Supply floods in, price falls back toward value. The "invisible hand" is really the law of value operating through price signals.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Inflation through this lens.</b> If money supply grows faster than the value of goods produced, each unit of money represents less value → prices rise (inflation). The law of value plus the money functions give you a clean way to reason about inflation for assignment topic #5. <em>Beyond the syllabus, but a powerful application to current events.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Tiền tệ — vật ngang giá chung</h2>
<p class="lead">Tiền không phải một phát minh tùy tiện; nó <strong>nảy sinh từ chính quá trình trao đổi</strong>. Khi trao đổi hàng lấy hàng trở nên phức tạp, một hàng hóa (lịch sử là vàng) trở thành <em>vật ngang giá chung</em> — thứ mà mọi hàng hóa khác đo giá trị của mình vào đó. Tiền là một hàng hóa đặc biệt biểu hiện giá trị của mọi hàng hóa.</p>

<h3>Năm chức năng của tiền tệ</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">1 · Thước đo giá trị</span> Giá cả biểu hiện giá trị bằng tiền.</div>
<div class="lz-layer"><span class="lz-lk">2 · Phương tiện lưu thông</span> Trung gian trao đổi (H–T–H).</div>
<div class="lz-layer"><span class="lz-lk">3 · Phương tiện cất trữ</span> Cách tích trữ giá trị theo thời gian.</div>
<div class="lz-layer"><span class="lz-lk">4 · Phương tiện thanh toán</span> Trả nợ, thanh toán trả chậm.</div>
<div class="lz-layer"><span class="lz-lk">5 · Tiền tệ thế giới</span> Vận hành trong trao đổi quốc tế.</div>
</div>

<h3>Quy luật giá trị — người điều tiết vô hình</h3>
<p><strong>Quy luật giá trị</strong> nói sản xuất và trao đổi phải dựa trên thời gian lao động xã hội cần thiết. Nó điều tiết thị trường qua giá cả dao động xoay quanh giá trị:</p>
<div class="formula"><span class="lbl">Cơ chế</span> Giá cả dao động quanh Giá trị; cung &amp; cầu đẩy nó lên/xuống, cạnh tranh kéo về</div>
<ul>
<li><strong>Điều tiết sản xuất</strong> — tư bản chảy về nơi giá &gt; giá trị (có lãi), rời nơi giá &lt; giá trị.</li>
<li><strong>Kích thích công nghệ</strong> — ai vượt TGLĐXHCT thì thắng lợi nhuận siêu ngạch, nên ai cũng đổi mới.</li>
<li><strong>Chọn lọc & phân hóa người sản xuất</strong> — người hiệu quả phát đạt, người kém thất bại.</li>
</ul>

<div class="out"><strong>Ví dụ có lời giải:</strong> nếu khẩu trang bỗng có giá 50.000đ (giá ≫ giá trị) lúc khan hiếm, tư bản đổ vào làm khẩu trang (điều tiết sản xuất). Nguồn cung tràn vào, giá rơi về gần giá trị. "Bàn tay vô hình" thực chất là quy luật giá trị vận hành qua tín hiệu giá.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Lạm phát qua lăng kính này.</b> Nếu lượng tiền tăng nhanh hơn giá trị hàng hóa sản xuất ra, mỗi đơn vị tiền đại diện ít giá trị hơn → giá tăng (lạm phát). Quy luật giá trị cộng các chức năng tiền cho bạn một cách lý giải lạm phát gọn ghẽ cho đề assignment #5. <em>Ngoài syllabus, nhưng là một ứng dụng mạnh vào thời sự.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'The two properties of a commodity are:|||Hai thuộc tính của hàng hóa là:',
                options: [
                  'Price and cost|||Giá và chi phí',
                  'Use-value and value|||Giá trị sử dụng và giá trị',
                  'Supply and demand|||Cung và cầu',
                  'Money and gold|||Tiền và vàng',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'The magnitude of a commodity\'s value is determined by:|||Lượng giá trị của hàng hóa được quyết định bởi:',
                options: [
                  'The time you personally spent|||Thời gian cá nhân bạn bỏ ra',
                  'Socially-necessary labor time|||Thời gian lao động xã hội cần thiết',
                  'The seller\'s mood|||Tâm trạng người bán',
                  'The buyer\'s income|||Thu nhập người mua',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'Raising productivity (better technology) does what to value per unit?|||Tăng năng suất (công nghệ tốt hơn) làm gì với giá trị mỗi đơn vị?',
                options: [
                  'Increases it|||Tăng nó',
                  'Lowers it (more units, same total value)|||Giảm nó (nhiều đơn vị hơn, cùng tổng giá trị)',
                  'No effect|||Không ảnh hưởng',
                  'Doubles it|||Gấp đôi nó',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'Which is NOT one of the five functions of money?|||Cái nào KHÔNG phải một trong năm chức năng của tiền tệ?',
                options: [
                  'Measure of value|||Thước đo giá trị',
                  'Means of circulation|||Phương tiện lưu thông',
                  'Producing goods|||Sản xuất hàng hóa',
                  'World money|||Tiền tệ thế giới',
                ], correctIndex: 2,
              },
              {
                id: 'q5', points: 1,
                question: 'The law of value regulates the market mainly through:|||Quy luật giá trị điều tiết thị trường chủ yếu qua:',
                options: [
                  'Government decree only|||Chỉ mệnh lệnh nhà nước',
                  'Price fluctuating around value|||Giá cả dao động quanh giá trị',
                  'Fixed prices forever|||Giá cố định mãi mãi',
                  'Random chance|||May rủi ngẫu nhiên',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 3 — GIÁ TRỊ THẶNG DƯ ══════════════════ */
    {
      title: 'Chapter 3 — Surplus value|||Chương 3 — Giá trị thặng dư',
      description: 'Học thuyết trung tâm của Marx: nguồn gốc lợi nhuận, công thức m\', tích lũy tư bản, và các hình thức biểu hiện.',
      lessons: [
        {
          title: '3.1 — The origin & rate of surplus value|||3.1 — Nguồn gốc & tỷ suất giá trị thặng dư',
          slug: 'mln122-3-1-gia-tri-thang-du',
          type: 'VIDEO',
          description: 'Sức lao động là hàng hóa đặc biệt, công thức m = giá trị mới − v, và tỷ suất m\' = m/v.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Where does profit really come from?</h2>
<p class="lead">This is Marx's central discovery. Profit doesn't come from "buying cheap, selling dear" (that just moves value around). It comes from a <strong>special commodity: labor-power</strong> — the worker's capacity to work — which has a unique property: <em>it creates more value than it costs</em>.</p>

<h3>The trick of labor-power</h3>
<p>The capitalist buys labor-power at its <strong>value</strong> (what it costs to keep the worker alive & able — say, 4 hours of labor). But labor-power can <em>work</em> longer than 4 hours — say 8. In the extra 4 hours the worker creates value the capitalist keeps for free. That unpaid, extra value is <strong>surplus value (m)</strong>.</p>
<div class="formula"><span class="lbl">Giá trị hàng hóa</span> W = c + v + m</div>
<p>where <strong>c</strong> = constant capital (machines, materials — value transferred, not created), <strong>v</strong> = variable capital (wages, buys labor-power), <strong>m</strong> = surplus value (created by labor beyond v).</p>

<h3>The rate of surplus value — the degree of exploitation</h3>
<div class="formula"><span class="lbl">Tỷ suất giá trị thặng dư</span> m&#39; = (m / v) × 100%</div>
<p>It measures how much surplus the worker produces relative to their own wage — i.e. the <em>degree of exploitation</em>.</p>

<h3>Worked example — compute m and m&#39;</h3>
<div class="out"><strong>Given:</strong> a worker's labor-power value (v) = 4 labor-hours/day; the working day = 8 hours; all 8 hours create new value.
<strong>Step 1 — new value created:</strong> 8 hours (the worker's living labor).
<strong>Step 2 — necessary labor (v):</strong> 4 hours (reproduces the wage).
<strong>Step 3 — surplus labor (m):</strong> 8 − 4 = 4 hours → m = 4.
<strong>Step 4 — rate:</strong> m&#39; = (m/v) × 100% = (4/4) × 100% = <strong>100%</strong>.
<strong>Meaning:</strong> the worker spends half the day working for themselves (v) and half producing surplus for the capitalist (m). A 100% rate = one hour of surplus for every hour of paid labor.</div>

<div class="callout ok"><strong>Two ways to raise m:</strong> <em>absolute</em> surplus value = lengthen the working day (more total hours); <em>relative</em> surplus value = raise productivity so necessary labor (v) shrinks, leaving more of the day as surplus. Modern capitalism relies mostly on <em>relative</em> (technology). Know this pair for the exam.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Gig platforms & surplus value.</b> Analyze a delivery app: the rider's fee vs the value they generate for the platform is a live surplus-value question. It makes assignment topic #2 vivid and current — the same logic, new packaging. <em>Beyond the syllabus, but exactly the kind of application that earns top marks.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Lợi nhuận thực sự đến từ đâu?</h2>
<p class="lead">Đây là phát hiện trung tâm của Marx. Lợi nhuận không đến từ "mua rẻ, bán đắt" (điều đó chỉ dịch chuyển giá trị). Nó đến từ một <strong>hàng hóa đặc biệt: sức lao động</strong> — khả năng làm việc của người công nhân — có một tính chất độc nhất: <em>nó tạo ra nhiều giá trị hơn chi phí của nó</em>.</p>

<h3>Bí mật của sức lao động</h3>
<p>Nhà tư bản mua sức lao động theo <strong>giá trị</strong> của nó (chi phí nuôi sống & duy trì người lao động — giả sử 4 giờ lao động). Nhưng sức lao động có thể <em>làm việc</em> lâu hơn 4 giờ — giả sử 8. Trong 4 giờ dôi ra, công nhân tạo giá trị mà nhà tư bản giữ không công. Phần giá trị dôi ra không được trả công đó là <strong>giá trị thặng dư (m)</strong>.</p>
<div class="formula"><span class="lbl">Giá trị hàng hóa</span> W = c + v + m</div>
<p>trong đó <strong>c</strong> = tư bản bất biến (máy móc, nguyên liệu — giá trị được chuyển, không tạo mới), <strong>v</strong> = tư bản khả biến (tiền lương, mua sức lao động), <strong>m</strong> = giá trị thặng dư (do lao động tạo ra vượt v).</p>

<h3>Tỷ suất giá trị thặng dư — trình độ bóc lột</h3>
<div class="formula"><span class="lbl">Tỷ suất giá trị thặng dư</span> m&#39; = (m / v) × 100%</div>
<p>Nó đo lượng thặng dư công nhân tạo ra so với chính tiền lương của họ — tức <em>trình độ bóc lột</em>.</p>

<h3>Ví dụ có lời giải — tính m và m&#39;</h3>
<div class="out"><strong>Cho:</strong> giá trị sức lao động (v) = 4 giờ lao động/ngày; ngày làm việc = 8 giờ; cả 8 giờ tạo giá trị mới.
<strong>Bước 1 — giá trị mới tạo ra:</strong> 8 giờ (lao động sống của công nhân).
<strong>Bước 2 — lao động tất yếu (v):</strong> 4 giờ (tái tạo tiền lương).
<strong>Bước 3 — lao động thặng dư (m):</strong> 8 − 4 = 4 giờ → m = 4.
<strong>Bước 4 — tỷ suất:</strong> m&#39; = (m/v) × 100% = (4/4) × 100% = <strong>100%</strong>.
<strong>Ý nghĩa:</strong> công nhân dành nửa ngày làm cho mình (v) và nửa ngày tạo thặng dư cho nhà tư bản (m). Tỷ suất 100% = một giờ thặng dư cho mỗi giờ lao động được trả.</div>

<div class="callout ok"><strong>Hai cách tăng m:</strong> giá trị thặng dư <em>tuyệt đối</em> = kéo dài ngày lao động (nhiều tổng giờ hơn); giá trị thặng dư <em>tương đối</em> = tăng năng suất để lao động tất yếu (v) co lại, chừa nhiều ngày hơn cho thặng dư. Chủ nghĩa tư bản hiện đại chủ yếu dựa vào <em>tương đối</em> (công nghệ). Nắm cặp này cho bài thi.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Nền tảng gig & giá trị thặng dư.</b> Phân tích một app giao hàng: phí của tài xế so với giá trị họ tạo cho nền tảng là một câu hỏi giá trị thặng dư sống động. Nó làm đề assignment #2 sinh động và thời sự — cùng logic, bao bì mới. <em>Ngoài syllabus, nhưng đúng kiểu vận dụng ăn điểm cao.</em></div>
</div>`,
        },
        {
          title: '3.2 — Capital accumulation & forms of surplus value|||3.2 — Tích lũy tư bản & các hình thức biểu hiện',
          slug: 'mln122-3-2-tich-luy-tu-ban',
          type: 'VIDEO',
          description: 'Tích lũy tư bản, cấu tạo hữu cơ c/v, và giá trị thặng dư biểu hiện thành lợi nhuận, lợi tức, địa tô.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>How capital grows and disguises itself</h2>
<p class="lead">Surplus value isn't just consumed — part of it is reinvested to make more capital. This is <strong>accumulation</strong>, the engine of capitalist growth. And surplus value doesn't appear openly; it disguises itself as profit, interest and rent.</p>

<h3>Capital accumulation & organic composition</h3>
<p><strong>Accumulation</strong> = converting part of surplus value back into capital (buying more c and v to expand). As it proceeds, capitalists invest more in machines (c) relative to labor (v), raising the <strong>organic composition of capital</strong>:</p>
<div class="formula"><span class="lbl">Cấu tạo hữu cơ của tư bản</span> OCC = c / v (tends to rise over time)</div>
<p>A rising c/v means more machinery per worker. It boosts productivity but, since only living labor (v) creates surplus, it also drives the long-run tendency of the profit rate to fall — a key Marxian idea.</p>

<h3>The disguised forms of surplus value</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Profit (lợi nhuận)</span> Surplus value seen as arising from the whole capital (c+v), hiding that only v produced it.</div>
<div class="lz-layer"><span class="lz-lk">Interest (lợi tức)</span> The share of surplus paid to money-capital lenders.</div>
<div class="lz-layer"><span class="lz-lk">Rent (địa tô)</span> The share of surplus captured by landowners.</div>
</div>
<div class="formula"><span class="lbl">Tỷ suất lợi nhuận</span> p&#39; = m / (c + v) × 100%</div>

<h3>Worked example — profit rate vs surplus-value rate</h3>
<div class="out"><strong>Given:</strong> c = 80, v = 20, m = 20.
<strong>Rate of surplus value:</strong> m&#39; = m/v = 20/20 = <strong>100%</strong>.
<strong>Rate of profit:</strong> p&#39; = m/(c+v) = 20/(80+20) = 20/100 = <strong>20%</strong>.
<strong>Insight:</strong> the profit rate (20%) looks far smaller than the exploitation rate (100%) because profit is measured against <em>all</em> capital (c+v), not just wages (v). This is exactly how surplus value <em>disguises</em> its origin — the capitalist sees a modest 20% "return on capital," concealing the 100% surplus squeezed from labor.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Why the profit rate tends to fall.</b> As automation raises c/v, the base (c+v) grows while surplus-creating labor (v) shrinks proportionally, so p&#39; tends downward — pushing capital toward monopoly, new markets and cost-cutting. This tendency links Ch3 directly to Ch4 (monopoly). <em>Beyond the syllabus, but the bridge that makes the whole theory cohere.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Tư bản lớn lên và tự ngụy trang thế nào</h2>
<p class="lead">Giá trị thặng dư không chỉ bị tiêu dùng — một phần được tái đầu tư để tạo thêm tư bản. Đây là <strong>tích lũy</strong>, động cơ tăng trưởng của chủ nghĩa tư bản. Và giá trị thặng dư không hiện ra công khai; nó ngụy trang thành lợi nhuận, lợi tức và địa tô.</p>

<h3>Tích lũy tư bản & cấu tạo hữu cơ</h3>
<p><strong>Tích lũy</strong> = chuyển một phần giá trị thặng dư trở lại thành tư bản (mua thêm c và v để mở rộng). Khi tiến triển, nhà tư bản đầu tư nhiều vào máy móc (c) hơn so với lao động (v), làm tăng <strong>cấu tạo hữu cơ của tư bản</strong>:</p>
<div class="formula"><span class="lbl">Cấu tạo hữu cơ của tư bản</span> = c / v (xu hướng tăng theo thời gian)</div>
<p>c/v tăng nghĩa là nhiều máy móc hơn trên mỗi công nhân. Nó tăng năng suất nhưng, vì chỉ lao động sống (v) tạo thặng dư, nó cũng thúc đẩy xu hướng tỷ suất lợi nhuận giảm về dài hạn — một tư tưởng Marxian then chốt.</p>

<h3>Các hình thức ngụy trang của giá trị thặng dư</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Lợi nhuận</span> Giá trị thặng dư nhìn như sinh ra từ toàn bộ tư bản (c+v), che giấu rằng chỉ v tạo ra nó.</div>
<div class="lz-layer"><span class="lz-lk">Lợi tức</span> Phần thặng dư trả cho người cho vay tư bản tiền tệ.</div>
<div class="lz-layer"><span class="lz-lk">Địa tô</span> Phần thặng dư mà chủ đất chiếm được.</div>
</div>
<div class="formula"><span class="lbl">Tỷ suất lợi nhuận</span> p&#39; = m / (c + v) × 100%</div>

<h3>Ví dụ có lời giải — tỷ suất lợi nhuận vs tỷ suất giá trị thặng dư</h3>
<div class="out"><strong>Cho:</strong> c = 80, v = 20, m = 20.
<strong>Tỷ suất giá trị thặng dư:</strong> m&#39; = m/v = 20/20 = <strong>100%</strong>.
<strong>Tỷ suất lợi nhuận:</strong> p&#39; = m/(c+v) = 20/(80+20) = 20/100 = <strong>20%</strong>.
<strong>Insight:</strong> tỷ suất lợi nhuận (20%) trông nhỏ hơn nhiều so với tỷ suất bóc lột (100%) vì lợi nhuận đo trên <em>toàn bộ</em> tư bản (c+v), không chỉ tiền lương (v). Đây chính là cách giá trị thặng dư <em>ngụy trang</em> nguồn gốc — nhà tư bản thấy một mức "sinh lời trên vốn" khiêm tốn 20%, che giấu 100% thặng dư vắt từ lao động.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Vì sao tỷ suất lợi nhuận có xu hướng giảm.</b> Khi tự động hóa làm tăng c/v, mẫu số (c+v) lớn lên trong khi lao động tạo thặng dư (v) co lại tương đối, nên p&#39; có xu hướng đi xuống — đẩy tư bản tới độc quyền, thị trường mới và cắt giảm chi phí. Xu hướng này nối Ch3 trực tiếp với Ch4 (độc quyền). <em>Ngoài syllabus, nhưng là cây cầu khiến toàn bộ lý thuyết ăn khớp.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'Surplus value comes from:|||Giá trị thặng dư đến từ:',
                options: [
                  'Buying cheap and selling dear|||Mua rẻ bán đắt',
                  'Labor-power creating more value than it costs|||Sức lao động tạo giá trị nhiều hơn chi phí của nó',
                  'Machines working by themselves|||Máy móc tự làm việc',
                  'Rising prices only|||Chỉ giá tăng',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'If v = 5 and m = 10, the rate of surplus value m\' is:|||Nếu v = 5 và m = 10, tỷ suất giá trị thặng dư m\' là:',
                options: ['50%', '100%', '200%', '20%'],
                correctIndex: 2,
              },
              {
                id: 'q3', points: 1,
                question: 'In W = c + v + m, which part creates new surplus value?|||Trong W = c + v + m, phần nào tạo ra giá trị thặng dư mới?',
                options: [
                  'c (constant capital)|||c (tư bản bất biến)',
                  'v (variable capital / labor-power)|||v (tư bản khả biến / sức lao động)',
                  'The machines|||Máy móc',
                  'The raw materials|||Nguyên liệu',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'If c = 90, v = 10, m = 10, the rate of profit p\' is:|||Nếu c = 90, v = 10, m = 10, tỷ suất lợi nhuận p\' là:',
                options: ['100%', '10%', '20%', '90%'],
                correctIndex: 1,
              },
              {
                id: 'q5', points: 1,
                question: 'Relative surplus value is increased by:|||Giá trị thặng dư tương đối được tăng bằng cách:',
                options: [
                  'Lengthening the working day|||Kéo dài ngày lao động',
                  'Raising productivity so necessary labor (v) shrinks|||Tăng năng suất để lao động tất yếu (v) co lại',
                  'Paying higher wages|||Trả lương cao hơn',
                  'Reducing output|||Giảm sản lượng',
                ], correctIndex: 1,
              },
              {
                id: 'q6', points: 1,
                question: '(Beyond syllabus) A rising organic composition of capital (c/v) tends to:|||(Ngoài giáo trình) Cấu tạo hữu cơ của tư bản (c/v) tăng có xu hướng:',
                options: [
                  'Raise the profit rate forever|||Tăng tỷ suất lợi nhuận mãi mãi',
                  'Push the profit rate to fall over the long run|||Đẩy tỷ suất lợi nhuận giảm về dài hạn',
                  'Have no effect|||Không ảnh hưởng',
                  'Eliminate all machines|||Loại bỏ mọi máy móc',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 4 — CẠNH TRANH & ĐỘC QUYỀN ══════════════════ */
    {
      title: 'Chapter 4 — Competition & monopoly|||Chương 4 — Cạnh tranh & độc quyền',
      description: 'Lenin về độc quyền: 5 đặc điểm kinh tế, độc quyền nhà nước, và biểu hiện mới trong thời đại số.',
      lessons: [
        {
          title: '4.1 — Lenin\'s theory of monopoly (5 features)|||4.1 — Lý luận Lenin về độc quyền (5 đặc điểm)',
          slug: 'mln122-4-1-doc-quyen-lenin',
          type: 'VIDEO',
          description: 'Vì sao cạnh tranh tự do sinh ra độc quyền, 5 đặc điểm kinh tế của độc quyền, và độc quyền nhà nước.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>How free competition produces its opposite — monopoly</h2>
<p class="lead">Lenin's key insight (in <em>Imperialism</em>): free competition, through accumulation and concentration, <strong>turns into its opposite — monopoly</strong>. Big firms swallow small ones until a few giants dominate each industry. Marx's Ch3 (rising c/v, falling profit rate) drives this concentration.</p>

<h3>Lenin's 5 economic features of monopoly capitalism</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">1</span> Concentration of production &amp; capital creates monopolies that dominate economic life.</div>
<div class="lz-layer"><span class="lz-lk">2</span> Bank capital merges with industrial capital → <strong>finance capital</strong> &amp; a financial oligarchy.</div>
<div class="lz-layer"><span class="lz-lk">3</span> Export of <strong>capital</strong> (not just goods) becomes especially important.</div>
<div class="lz-layer"><span class="lz-lk">4</span> International monopoly alliances divide the world market among themselves.</div>
<div class="lz-layer"><span class="lz-lk">5</span> The territorial division of the world among great powers is complete.</div>
</div>

<h3>State-monopoly capitalism</h3>
<p>Later, monopolies fuse with the state → <strong>state-monopoly capitalism</strong>, where state power is used to serve monopoly interests (bailouts, contracts, regulation shaped by giants). The state becomes an instrument intertwined with monopoly capital.</p>

<div class="out"><strong>Worked example — spotting the features today:</strong> a Big Tech firm shows: (1) massive concentration; (2) deep entanglement with finance/investors; (3) global capital export (data centers worldwide); (4) cross-border market carve-ups; plus lobbying that shapes regulation (a modern echo of state-monopoly). Not a perfect 1:1 map, but the analytical lens still cuts.</div>

<div class="callout ok"><strong>Note on competition:</strong> monopoly doesn't abolish competition — it makes it fiercer and more destructive (monopolies vs each other, vs outsiders, within themselves). Monopoly and competition coexist. A common exam trap is to say monopoly "ends" competition — it doesn't.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Antitrust as the modern battleground.</b> The EU/US cases against Google, Meta, Amazon are live tests of monopoly power — and of whether states discipline or serve monopoly capital. Assignment topic #3 lets you apply all 5 features to a real firm. <em>Beyond the syllabus, but the most current way to make Ch4 concrete.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Cạnh tranh tự do sinh ra mặt đối lập của nó — độc quyền</h2>
<p class="lead">Phát hiện then chốt của Lenin (trong <em>Chủ nghĩa đế quốc</em>): cạnh tranh tự do, qua tích lũy và tập trung, <strong>chuyển thành mặt đối lập — độc quyền</strong>. Doanh nghiệp lớn nuốt doanh nghiệp nhỏ cho tới khi vài gã khổng lồ thống trị mỗi ngành. Ch3 của Marx (c/v tăng, tỷ suất lợi nhuận giảm) thúc đẩy sự tập trung này.</p>

<h3>5 đặc điểm kinh tế của chủ nghĩa tư bản độc quyền (Lenin)</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">1</span> Tập trung sản xuất &amp; tư bản tạo ra các tổ chức độc quyền chi phối đời sống kinh tế.</div>
<div class="lz-layer"><span class="lz-lk">2</span> Tư bản ngân hàng hợp nhất với tư bản công nghiệp → <strong>tư bản tài chính</strong> &amp; bọn đầu sỏ tài chính.</div>
<div class="lz-layer"><span class="lz-lk">3</span> Xuất khẩu <strong>tư bản</strong> (không chỉ hàng hóa) trở nên đặc biệt quan trọng.</div>
<div class="lz-layer"><span class="lz-lk">4</span> Các liên minh độc quyền quốc tế chia nhau thị trường thế giới.</div>
<div class="lz-layer"><span class="lz-lk">5</span> Sự phân chia lãnh thổ thế giới giữa các cường quốc đã hoàn tất.</div>
</div>

<h3>Chủ nghĩa tư bản độc quyền nhà nước</h3>
<p>Về sau, độc quyền dung hợp với nhà nước → <strong>chủ nghĩa tư bản độc quyền nhà nước</strong>, nơi quyền lực nhà nước được dùng phục vụ lợi ích độc quyền (cứu trợ, hợp đồng, quy định do các ông lớn định hình). Nhà nước trở thành một công cụ đan xen với tư bản độc quyền.</p>

<div class="out"><strong>Ví dụ có lời giải — nhận diện các đặc điểm hôm nay:</strong> một hãng Big Tech thể hiện: (1) tập trung khổng lồ; (2) đan xen sâu với tài chính/nhà đầu tư; (3) xuất khẩu tư bản toàn cầu (trung tâm dữ liệu khắp nơi); (4) phân chia thị trường xuyên biên giới; cộng vận động hành lang định hình quy định (một tiếng vọng hiện đại của độc quyền nhà nước). Không phải ánh xạ 1:1 hoàn hảo, nhưng lăng kính phân tích vẫn sắc.</div>

<div class="callout ok"><strong>Lưu ý về cạnh tranh:</strong> độc quyền không xóa bỏ cạnh tranh — nó làm cạnh tranh khốc liệt và tàn phá hơn (độc quyền với nhau, với bên ngoài, trong nội bộ). Độc quyền và cạnh tranh cùng tồn tại. Một bẫy thi phổ biến là nói độc quyền "chấm dứt" cạnh tranh — không phải vậy.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Chống độc quyền là chiến trường hiện đại.</b> Các vụ kiện EU/Mỹ chống Google, Meta, Amazon là phép thử sống động về quyền lực độc quyền — và về việc nhà nước kỷ luật hay phục vụ tư bản độc quyền. Đề assignment #3 cho bạn vận dụng cả 5 đặc điểm vào một hãng thật. <em>Ngoài syllabus, nhưng là cách thời sự nhất để cụ thể hóa Ch4.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'According to Lenin, free competition tends to turn into:|||Theo Lenin, cạnh tranh tự do có xu hướng chuyển thành:',
                options: [
                  'Perfect equality|||Bình đẳng hoàn hảo',
                  'Monopoly (its opposite)|||Độc quyền (mặt đối lập của nó)',
                  'No production at all|||Không sản xuất gì',
                  'Barter economy|||Kinh tế hàng đổi hàng',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'The merger of bank capital with industrial capital creates:|||Sự hợp nhất tư bản ngân hàng với tư bản công nghiệp tạo ra:',
                options: [
                  'Finance capital|||Tư bản tài chính',
                  'Free trade|||Thương mại tự do',
                  'Small business|||Doanh nghiệp nhỏ',
                  'Barter|||Hàng đổi hàng',
                ], correctIndex: 0,
              },
              {
                id: 'q3', points: 1,
                question: 'Does monopoly abolish competition?|||Độc quyền có xóa bỏ cạnh tranh không?',
                options: [
                  'Yes, completely|||Có, hoàn toàn',
                  'No — they coexist, and competition becomes fiercer|||Không — chúng cùng tồn tại, và cạnh tranh khốc liệt hơn',
                  'Yes, temporarily|||Có, tạm thời',
                  'Competition never existed|||Cạnh tranh chưa từng tồn tại',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'State-monopoly capitalism means:|||Chủ nghĩa tư bản độc quyền nhà nước nghĩa là:',
                options: [
                  'The state owns all small shops|||Nhà nước sở hữu mọi tiệm nhỏ',
                  'Monopolies fuse with state power to serve monopoly interests|||Độc quyền dung hợp với quyền lực nhà nước phục vụ lợi ích độc quyền',
                  'No monopolies exist|||Không có độc quyền nào',
                  'The state bans all business|||Nhà nước cấm mọi kinh doanh',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 5 — KTTT ĐỊNH HƯỚNG XHCN Ở VIỆT NAM ══════════════════ */
    {
      title: 'Chapter 5 — Vietnam\'s socialist-oriented market economy|||Chương 5 — KTTT định hướng XHCN ở Việt Nam',
      description: 'Bản chất, đặc trưng của kinh tế thị trường định hướng XHCN, và các quan hệ lợi ích kinh tế + vai trò nhà nước.',
      lessons: [
        {
          title: '5.1 — Nature, features & economic-interest relations|||5.1 — Bản chất, đặc trưng & quan hệ lợi ích kinh tế',
          slug: 'mln122-5-1-kttt-xhcn',
          type: 'VIDEO',
          description: 'Vì sao Việt Nam chọn KTTT định hướng XHCN, đặc trưng của nó, và cách hài hòa các quan hệ lợi ích.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>A market economy with a socialist orientation</h2>
<p class="lead">Vietnam's model is a <strong>socialist-oriented market economy</strong>: it uses the market mechanism (competition, prices, multiple ownership forms) to develop productive forces, while directing that development toward socialist goals — prosperity, equity, and the leading role of the state economy under Party leadership.</p>

<h3>Why this model (objective necessity)</h3>
<ul>
<li>The market economy is the most effective way yet found to develop productive forces — Vietnam needs it to escape underdevelopment.</li>
<li>But an unguided market produces inequality and crises — hence the <em>socialist orientation</em> to harness its power while steering its outcomes.</li>
</ul>

<h3>Key characteristics</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Ownership</span> Multiple sectors; state economy plays the leading role, private economy an important driver (Resolution 68).</div>
<div class="lz-layer"><span class="lz-lk">Distribution</span> Mainly by labor and efficiency, plus via welfare — balancing growth with equity.</div>
<div class="lz-layer"><span class="lz-lk">Management</span> Market mechanism + state regulation under Party leadership.</div>
<div class="lz-layer"><span class="lz-lk">Goal</span> "Rich people, strong country, democratic, equitable, civilized."</div>
</div>

<h3>Economic-interest relations & the state's role</h3>
<p>An economy is a web of <strong>interest relations</strong> — between workers & employers, individual & collective & society, present & future. These interests both align and conflict. The state's job is to <strong>harmonize</strong> them: protect workers, encourage enterprise, ensure fair distribution, and resolve conflicts so society develops sustainably.</p>

<div class="out"><strong>Worked example — a wage dispute:</strong> workers want higher pay (their interest); the firm wants lower costs (its interest); society wants both stable jobs and competitive industry. The state harmonizes via minimum-wage law, social insurance, and dialogue mechanisms — not by crushing either side, but by balancing them. This is economic-interest harmonization in action (assignment topic #8).</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Vietnam vs the "free market" and vs central planning.</b> The model deliberately sits between pure laissez-faire (US) and old central planning (pre-Đổi Mới): market efficiency + state guidance. Comparing the three sharpens what "socialist orientation" actually adds (assignment topics #7). <em>Beyond the syllabus, but the comparison that makes the concept precise.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Một nền kinh tế thị trường có định hướng xã hội chủ nghĩa</h2>
<p class="lead">Mô hình của Việt Nam là <strong>kinh tế thị trường định hướng XHCN</strong>: dùng cơ chế thị trường (cạnh tranh, giá cả, nhiều hình thức sở hữu) để phát triển lực lượng sản xuất, đồng thời định hướng sự phát triển ấy tới mục tiêu XHCN — dân giàu, công bằng, và vai trò chủ đạo của kinh tế nhà nước dưới sự lãnh đạo của Đảng.</p>

<h3>Vì sao mô hình này (tính tất yếu khách quan)</h3>
<ul>
<li>Kinh tế thị trường là cách hiệu quả nhất tìm ra được để phát triển lực lượng sản xuất — Việt Nam cần nó để thoát kém phát triển.</li>
<li>Nhưng thị trường không được định hướng sinh ra bất bình đẳng và khủng hoảng — do đó <em>định hướng XHCN</em> để khai thác sức mạnh của nó trong khi lái kết quả.</li>
</ul>

<h3>Các đặc trưng chính</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Sở hữu</span> Nhiều thành phần; kinh tế nhà nước giữ vai trò chủ đạo, kinh tế tư nhân là một động lực quan trọng (Nghị quyết 68).</div>
<div class="lz-layer"><span class="lz-lk">Phân phối</span> Chủ yếu theo lao động và hiệu quả, cộng qua phúc lợi — cân bằng tăng trưởng với công bằng.</div>
<div class="lz-layer"><span class="lz-lk">Quản lý</span> Cơ chế thị trường + điều tiết nhà nước dưới sự lãnh đạo của Đảng.</div>
<div class="lz-layer"><span class="lz-lk">Mục tiêu</span> "Dân giàu, nước mạnh, dân chủ, công bằng, văn minh."</div>
</div>

<h3>Quan hệ lợi ích kinh tế & vai trò nhà nước</h3>
<p>Một nền kinh tế là mạng lưới các <strong>quan hệ lợi ích</strong> — giữa người lao động & người sử dụng lao động, cá nhân & tập thể & xã hội, hiện tại & tương lai. Các lợi ích này vừa thống nhất vừa mâu thuẫn. Việc của nhà nước là <strong>hài hòa</strong> chúng: bảo vệ người lao động, khuyến khích doanh nghiệp, đảm bảo phân phối công bằng, và giải quyết xung đột để xã hội phát triển bền vững.</p>

<div class="out"><strong>Ví dụ có lời giải — một tranh chấp tiền lương:</strong> người lao động muốn lương cao (lợi ích của họ); doanh nghiệp muốn chi phí thấp (lợi ích của nó); xã hội muốn cả việc làm ổn định lẫn ngành cạnh tranh. Nhà nước hài hòa qua luật lương tối thiểu, bảo hiểm xã hội, và cơ chế đối thoại — không đè bẹp bên nào, mà cân bằng chúng. Đây là hài hòa quan hệ lợi ích kinh tế trong thực tế (đề assignment #8).</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Việt Nam so với "thị trường tự do" và so với kế hoạch hóa tập trung.</b> Mô hình cố ý nằm giữa tự do tuyệt đối (Mỹ) và kế hoạch hóa tập trung cũ (trước Đổi Mới): hiệu quả thị trường + định hướng nhà nước. So sánh ba cái làm sắc điều "định hướng XHCN" thực sự thêm vào (đề assignment #7). <em>Ngoài syllabus, nhưng là so sánh làm khái niệm trở nên chính xác.</em></div>
</div>`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 6 — CNH-HĐH & HỘI NHẬP ══════════════════ */
    {
      title: 'Chapter 6 — Industrialization & international integration|||Chương 6 — Công nghiệp hóa, hiện đại hóa & hội nhập',
      description: 'Công nghiệp hóa – hiện đại hóa gắn với cách mạng công nghiệp 4.0, và hội nhập kinh tế quốc tế của Việt Nam.',
      lessons: [
        {
          title: '6.1 — Industrialization–modernization & integration|||6.1 — Công nghiệp hóa – hiện đại hóa & hội nhập',
          slug: 'mln122-6-1-cnh-hdh-hoi-nhap',
          type: 'VIDEO',
          description: 'Vì sao CNH-HĐH là tất yếu, nội dung mới gắn với 4.0, và cơ hội – thách thức của hội nhập kinh tế quốc tế.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Building a modern economy and joining the world</h2>
<p class="lead">To develop, Vietnam must (a) <strong>industrialize and modernize</strong> — transform from a low-productivity agrarian economy into a modern industrial one — and (b) <strong>integrate internationally</strong> — join the world economy to access markets, capital and technology.</p>

<h3>Industrialization–modernization (CNH-HĐH)</h3>
<ul>
<li><strong>Objective necessity:</strong> only by raising productive forces (technology, industry) can Vietnam escape the low-income trap and build the material base for socialism.</li>
<li><strong>Modern content:</strong> today CNH-HĐH is inseparable from the <strong>4th Industrial Revolution</strong> — digital transformation, AI, automation. Vietnam aims to "leapfrog" using new technology rather than repeat old smokestack industrialization (Resolution 57 on science, technology &amp; innovation).</li>
</ul>

<h3>International economic integration</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Forms</span> Trade (WTO, FTAs like CPTPP, EVFTA), investment (FDI), labor &amp; technology flows.</div>
<div class="lz-layer"><span class="lz-lk">Opportunities</span> Bigger markets, capital, technology transfer, jobs, learning global standards.</div>
<div class="lz-layer"><span class="lz-lk">Challenges</span> Fierce competition, dependency risk, pressure on domestic firms, need to protect economic sovereignty.</div>
</div>

<div class="out"><strong>Worked example — the two-edged sword:</strong> joining CPTPP gives Vietnamese exporters tariff-free access to big markets (opportunity), but also forces domestic firms to compete with stronger foreign ones and meet strict standards (challenge). The policy answer isn't "open everything" or "close up," but <em>proactive, selective integration</em> — build competitiveness while integrating (assignment topic #11).</div>

<div class="callout ok"><strong>Balanced-analysis tip:</strong> for any integration/CNH question, always present <em>both</em> opportunities and challenges, then the orientation to maximize the first and manage the second. One-sided answers ("integration is all good/bad") score low.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The middle-income trap & the 4.0 leapfrog.</b> Many countries industrialize partway then stall (the "middle-income trap"). Vietnam's bet is that digital/AI-led modernization (Resolution 57) can leapfrog stages — a live, testable strategy you can analyze against Japan/Korea's paths (topic #10). <em>Beyond the syllabus, but the most forward-looking angle in the course.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Xây một nền kinh tế hiện đại và gia nhập thế giới</h2>
<p class="lead">Để phát triển, Việt Nam phải (a) <strong>công nghiệp hóa và hiện đại hóa</strong> — chuyển từ nền kinh tế nông nghiệp năng suất thấp thành nền công nghiệp hiện đại — và (b) <strong>hội nhập quốc tế</strong> — gia nhập kinh tế thế giới để tiếp cận thị trường, vốn và công nghệ.</p>

<h3>Công nghiệp hóa – hiện đại hóa (CNH-HĐH)</h3>
<ul>
<li><strong>Tính tất yếu khách quan:</strong> chỉ bằng cách nâng lực lượng sản xuất (công nghệ, công nghiệp), Việt Nam mới thoát bẫy thu nhập thấp và xây cơ sở vật chất cho CNXH.</li>
<li><strong>Nội dung hiện đại:</strong> ngày nay CNH-HĐH không tách rời <strong>cách mạng công nghiệp lần thứ 4</strong> — chuyển đổi số, AI, tự động hóa. Việt Nam nhắm "đi tắt đón đầu" bằng công nghệ mới thay vì lặp lại công nghiệp hóa ống khói cũ (Nghị quyết 57 về khoa học, công nghệ &amp; đổi mới sáng tạo).</li>
</ul>

<h3>Hội nhập kinh tế quốc tế</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Hình thức</span> Thương mại (WTO, các FTA như CPTPP, EVFTA), đầu tư (FDI), dòng lao động &amp; công nghệ.</div>
<div class="lz-layer"><span class="lz-lk">Cơ hội</span> Thị trường lớn hơn, vốn, chuyển giao công nghệ, việc làm, học chuẩn mực toàn cầu.</div>
<div class="lz-layer"><span class="lz-lk">Thách thức</span> Cạnh tranh khốc liệt, rủi ro phụ thuộc, áp lực lên doanh nghiệp nội, cần bảo vệ chủ quyền kinh tế.</div>
</div>

<div class="out"><strong>Ví dụ có lời giải — con dao hai lưỡi:</strong> gia nhập CPTPP cho nhà xuất khẩu Việt tiếp cận miễn thuế các thị trường lớn (cơ hội), nhưng cũng buộc doanh nghiệp nội cạnh tranh với đối thủ ngoại mạnh hơn và đáp ứng tiêu chuẩn ngặt (thách thức). Câu trả lời chính sách không phải "mở hết" hay "đóng cửa", mà <em>hội nhập chủ động, có chọn lọc</em> — xây năng lực cạnh tranh trong khi hội nhập (đề assignment #11).</div>

<div class="callout ok"><strong>Mẹo phân tích cân bằng:</strong> với mọi câu về hội nhập/CNH, luôn trình bày <em>cả</em> cơ hội lẫn thách thức, rồi định hướng để tối đa cơ hội và quản trị thách thức. Câu trả lời một chiều ("hội nhập toàn tốt/toàn xấu") điểm thấp.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Bẫy thu nhập trung bình & cú "đi tắt" 4.0.</b> Nhiều nước công nghiệp hóa nửa chừng rồi khựng lại ("bẫy thu nhập trung bình"). Canh bạc của Việt Nam là hiện đại hóa dẫn dắt bằng số/AI (Nghị quyết 57) có thể đi tắt qua các giai đoạn — một chiến lược sống động, kiểm chứng được mà bạn có thể phân tích so với con đường Nhật/Hàn (đề #10). <em>Ngoài syllabus, nhưng là góc nhìn tương lai nhất trong môn.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'Why is industrialization-modernization an objective necessity for Vietnam?|||Vì sao CNH-HĐH là tất yếu khách quan với Việt Nam?',
                options: [
                  'To copy other countries|||Để sao chép nước khác',
                  'To raise productive forces and build the material base for socialism|||Để nâng lực lượng sản xuất và xây cơ sở vật chất cho CNXH',
                  'To reduce trade|||Để giảm thương mại',
                  'To close the economy|||Để đóng cửa kinh tế',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'Modern CNH-HĐH in Vietnam is closely linked to:|||CNH-HĐH hiện đại ở Việt Nam gắn chặt với:',
                options: [
                  'Only heavy smokestack industry|||Chỉ công nghiệp nặng ống khói',
                  'The 4th Industrial Revolution (digital, AI)|||Cách mạng công nghiệp 4.0 (số, AI)',
                  'Agriculture only|||Chỉ nông nghiệp',
                  'Reducing technology|||Giảm công nghệ',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'A balanced analysis of international integration should present:|||Một phân tích cân bằng về hội nhập quốc tế nên trình bày:',
                options: [
                  'Only the benefits|||Chỉ lợi ích',
                  'Both opportunities and challenges, plus the orientation|||Cả cơ hội lẫn thách thức, kèm định hướng',
                  'Only the risks|||Chỉ rủi ro',
                  'Nothing specific|||Không gì cụ thể',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: '(Beyond syllabus) The "middle-income trap" refers to:|||(Ngoài giáo trình) "Bẫy thu nhập trung bình" chỉ:',
                options: [
                  'Being too rich|||Quá giàu',
                  'Countries that industrialize partway then stall in growth|||Các nước công nghiệp hóa nửa chừng rồi khựng lại tăng trưởng',
                  'A type of tax|||Một loại thuế',
                  'A trade agreement|||Một hiệp định thương mại',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 7 — ÔN THI ══════════════════ */
    {
      title: 'Chapter 7 — Exam prep: question bank & essay skills|||Chương 7 — Ôn thi: ngân hàng câu hỏi & kỹ năng viết luận',
      description: 'Chương ÔN THI: ngân hàng câu hỏi thi/vấn đáp theo CLO, cách phân biệt các cặp dễ nhầm, và khung viết luận điểm cao.',
      lessons: [
        {
          title: '7.1 — Question bank by CLO & essay skills|||7.1 — Ngân hàng câu hỏi theo CLO & kỹ năng viết luận',
          slug: 'mln122-7-1-on-thi',
          type: 'article',
          description: 'Câu hỏi thi hay gặp nhóm theo CLO, bảng phân biệt cặp dễ nhầm, và khung 5 phần cho tiểu luận.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1 · Exam prep</span>
<h2>Prepare answers before the exam</h2>
<p class="lead">The exam (30%, gate ≥4) tests CLO1-6. Below is a question bank grouped by chapter, the confusing pairs you must distinguish, and the essay skeleton that earns marks.</p>

<h3>Question bank (by chapter/CLO)</h3>
<ul>
<li><strong>Ch1:</strong> What is the object & method of political economy? Explain scientific abstraction.</li>
<li><strong>Ch2:</strong> Analyze the two properties of a commodity. What determines the magnitude of value? Explain the law of value & its functions.</li>
<li><strong>Ch3:</strong> Where does surplus value come from? Compute m and m&#39; given data. Distinguish absolute vs relative surplus value. Explain capital accumulation.</li>
<li><strong>Ch4:</strong> State Lenin's 5 features of monopoly. Does monopoly abolish competition? What is state-monopoly capitalism?</li>
<li><strong>Ch5:</strong> Characteristics of Vietnam's socialist-oriented market economy? How does the state harmonize economic-interest relations?</li>
<li><strong>Ch6:</strong> Why is CNH-HĐH necessary? Opportunities & challenges of international integration?</li>
</ul>

<h3>Confusing pairs — make a table for each</h3>
<table>
<thead><tr><th>Distinguish</th><th>Key difference</th></tr></thead>
<tbody>
<tr><td>Value vs price</td><td>Value = SNLT embodied; price = money form fluctuating around value</td></tr>
<tr><td>Use-value vs value</td><td>Usefulness (concrete labor) vs exchangeability (abstract labor)</td></tr>
<tr><td>Surplus value (m) vs profit</td><td>Same magnitude; m relates to v, profit relates to (c+v)</td></tr>
<tr><td>Absolute vs relative surplus value</td><td>Longer day vs higher productivity (shrinking v)</td></tr>
<tr><td>m&#39; vs p&#39;</td><td>m/v (exploitation) vs m/(c+v) (profitability)</td></tr>
<tr><td>Productivity vs intensity</td><td>Lowers value/unit vs raises total value</td></tr>
</tbody>
</table>

<h3>Essay skeleton (for assignment & essay questions)</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">1 · Theory</span> State the concept precisely (definition, formula if any).</div>
<div class="lz-layer"><span class="lz-lk">2 · Case</span> Present a real example with data.</div>
<div class="lz-layer"><span class="lz-lk">3 · Analysis</span> Apply the theory to the case — this is where marks live.</div>
<div class="lz-layer"><span class="lz-lk">4 · Vietnam link</span> Connect to Vietnam's practice / policy.</div>
<div class="lz-layer"><span class="lz-lk">5 · Your view</span> A reasoned conclusion, not a copied one.</div>
</div>

<div class="callout ok"><strong>Exam tactic:</strong> for a compute question (m, m&#39;, p&#39;), always show the formula, substitute the numbers, and state the meaning — full marks require interpretation, not just the number.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The "definition → mechanism → example → significance" pattern.</b> Structure every theory answer this way and you never freeze: what it is → how it works → a concrete instance → why it matters. It converts memorized fragments into a complete, high-scoring answer. <em>Beyond the syllabus, but the template that reliably lifts theory answers.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1 · Ôn thi</span>
<h2>Chuẩn bị câu trả lời trước khi thi</h2>
<p class="lead">Bài thi (30%, cổng ≥4) kiểm CLO1-6. Dưới đây là ngân hàng câu hỏi nhóm theo chương, các cặp dễ nhầm bạn phải phân biệt, và khung viết luận ăn điểm.</p>

<h3>Ngân hàng câu hỏi (theo chương/CLO)</h3>
<ul>
<li><strong>Ch1:</strong> Đối tượng & phương pháp của kinh tế chính trị là gì? Giải thích trừu tượng hóa khoa học.</li>
<li><strong>Ch2:</strong> Phân tích hai thuộc tính của hàng hóa. Cái gì quyết định lượng giá trị? Giải thích quy luật giá trị & các chức năng.</li>
<li><strong>Ch3:</strong> Giá trị thặng dư đến từ đâu? Tính m và m&#39; với dữ liệu cho trước. Phân biệt giá trị thặng dư tuyệt đối vs tương đối. Giải thích tích lũy tư bản.</li>
<li><strong>Ch4:</strong> Nêu 5 đặc điểm độc quyền của Lenin. Độc quyền có xóa bỏ cạnh tranh? Chủ nghĩa tư bản độc quyền nhà nước là gì?</li>
<li><strong>Ch5:</strong> Đặc trưng của KTTT định hướng XHCN ở Việt Nam? Nhà nước hài hòa quan hệ lợi ích kinh tế thế nào?</li>
<li><strong>Ch6:</strong> Vì sao CNH-HĐH là tất yếu? Cơ hội & thách thức của hội nhập kinh tế quốc tế?</li>
</ul>

<h3>Các cặp dễ nhầm — lập bảng cho mỗi cặp</h3>
<table>
<thead><tr><th>Phân biệt</th><th>Khác biệt then chốt</th></tr></thead>
<tbody>
<tr><td>Giá trị vs giá cả</td><td>Giá trị = TGLĐXHCT kết tinh; giá cả = hình thức tiền dao động quanh giá trị</td></tr>
<tr><td>Giá trị sử dụng vs giá trị</td><td>Công dụng (lao động cụ thể) vs khả năng trao đổi (lao động trừu tượng)</td></tr>
<tr><td>Giá trị thặng dư (m) vs lợi nhuận</td><td>Cùng lượng; m so với v, lợi nhuận so với (c+v)</td></tr>
<tr><td>Thặng dư tuyệt đối vs tương đối</td><td>Ngày dài hơn vs năng suất cao hơn (v co lại)</td></tr>
<tr><td>m&#39; vs p&#39;</td><td>m/v (bóc lột) vs m/(c+v) (sinh lời)</td></tr>
<tr><td>Năng suất vs cường độ</td><td>Giảm giá trị/đơn vị vs tăng tổng giá trị</td></tr>
</tbody>
</table>

<h3>Khung viết luận (cho assignment & câu hỏi tự luận)</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">1 · Lý thuyết</span> Nêu khái niệm chính xác (định nghĩa, công thức nếu có).</div>
<div class="lz-layer"><span class="lz-lk">2 · Ca thật</span> Trình bày một ví dụ thật có số liệu.</div>
<div class="lz-layer"><span class="lz-lk">3 · Phân tích</span> Vận dụng lý thuyết vào ca — điểm nằm ở đây.</div>
<div class="lz-layer"><span class="lz-lk">4 · Liên hệ Việt Nam</span> Nối với thực tiễn / chính sách Việt Nam.</div>
<div class="lz-layer"><span class="lz-lk">5 · Chính kiến</span> Kết luận có lập luận, không phải chép.</div>
</div>

<div class="callout ok"><strong>Chiến thuật thi:</strong> với câu tính toán (m, m&#39;, p&#39;), luôn viết công thức, thế số, và nêu ý nghĩa — điểm tối đa đòi diễn giải, không chỉ con số.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Mẫu "định nghĩa → cơ chế → ví dụ → ý nghĩa".</b> Cấu trúc mọi câu trả lời lý thuyết theo cách này và bạn không bao giờ bí: nó là gì → vận hành thế nào → một ví dụ cụ thể → vì sao quan trọng. Nó biến những mảnh học thuộc thành một câu trả lời trọn vẹn, điểm cao. <em>Ngoài syllabus, nhưng là khuôn tin cậy nâng câu trả lời lý thuyết.</em></div>
</div>`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 8 — NÂNG CAO ★ ══════════════════ */
    {
      title: 'Chapter 8 — Beyond the syllabus ★: political economy in the digital age|||Chương 8 — Ngoài giáo trình ★: kinh tế chính trị trong thời đại số',
      description: 'Chương NÂNG CAO ngoài giáo trình: vận dụng lý thuyết vào kinh tế số, dữ liệu như tư liệu sản xuất, và các Nghị quyết 57/68.',
      lessons: [
        {
          title: '8.1 ★ — Data, platforms & the digital economy|||8.1 ★ — Dữ liệu, nền tảng & kinh tế số',
          slug: 'mln122-8-1-kinh-te-so',
          type: 'VIDEO',
          description: 'Dữ liệu như yếu tố sản xuất mới, kinh tế nền tảng qua lăng kính giá trị thặng dư & độc quyền, và Nghị quyết 57/68.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1 · ★ Beyond the syllabus</span>
<h2>150-year-old theory meets the digital economy</h2>
<p class="lead"><span class="badge">★ Beyond the syllabus</span> This chapter applies the whole course to today's economy — data, platforms, AI. It's the sharpest way to prove you <em>understand</em> the theory rather than memorized it, and it's assignment gold.</p>

<h3>Data as a new factor of production</h3>
<p>Classical factors were land, labor, capital. Today <strong>data</strong> acts as a new "means of production" — it is collected, processed and used to create value. This stretches the commodity/value theory of Ch2: data has near-zero reproduction cost yet enormous value in aggregate, raising fresh questions about who owns and profits from it.</p>

<h3>Platform economics through Marx & Lenin</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Surplus value (Ch3)</span> Gig platforms capture value from workers' labor while classifying them as "partners" — a modern surplus-value debate.</div>
<div class="lz-layer"><span class="lz-lk">Monopoly (Ch4)</span> Network effects create winner-take-all platforms — textbook concentration, now under global antitrust scrutiny.</div>
<div class="lz-layer"><span class="lz-lk">Value (Ch2)</span> "Free" services are paid for with data & attention — value in a disguised form.</div>
</div>

<h3>Vietnam's response — Resolutions 57 & 68</h3>
<ul>
<li><strong>Resolution 57-NQ/TW (2024):</strong> breakthrough in science, technology & innovation — the modern content of CNH-HĐH (digital transformation as the path to leapfrog).</li>
<li><strong>Resolution 68-NQ/TW (2025):</strong> developing the private economy as an important driver — refining the socialist-oriented model's ownership structure.</li>
</ul>

<div class="out"><strong>Worked example — a full-theory analysis:</strong> take a ride-hailing platform. Apply Ch2 (the "service" as commodity, price vs value), Ch3 (surplus from drivers' labor, the platform's take-rate as m/v analog), Ch4 (network-effect monopoly, Lenin's concentration), Ch5 (how Vietnam's state should harmonize platform–driver–consumer interests). That single case exercises five chapters — an A-grade assignment.</div>

<div class="callout ok"><strong>Why this matters for you:</strong> as an IT student, you'll build or work on exactly these platform economies. This theory gives you a critical lens on the systems you create — who benefits, who's exploited, where power concentrates. That's rare and valuable.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The enduring test: does the theory still explain reality?</b> The mark of understanding is applying old categories to new facts and seeing where they fit and where they strain. A student who can say "surplus value explains gig profits, but data as a commodity strains the labor theory of value — here's why" demonstrates genuine mastery. <em>The deepest ★ skill: critical, not dogmatic, application.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1 · ★ Ngoài giáo trình</span>
<h2>Lý thuyết 150 năm tuổi gặp kinh tế số</h2>
<p class="lead"><span class="badge">★ Ngoài giáo trình</span> Chương này vận dụng cả môn vào kinh tế hôm nay — dữ liệu, nền tảng, AI. Đây là cách sắc nhất để chứng minh bạn <em>hiểu</em> lý thuyết chứ không học thuộc, và là vàng cho assignment.</p>

<h3>Dữ liệu như một yếu tố sản xuất mới</h3>
<p>Các yếu tố cổ điển là đất đai, lao động, tư bản. Ngày nay <strong>dữ liệu</strong> đóng vai một "tư liệu sản xuất" mới — được thu thập, xử lý và dùng để tạo giá trị. Điều này kéo giãn lý thuyết hàng hóa/giá trị ở Ch2: dữ liệu có chi phí nhân bản gần bằng 0 nhưng giá trị khổng lồ ở tổng thể, đặt ra câu hỏi mới về ai sở hữu và hưởng lợi từ nó.</p>

<h3>Kinh tế nền tảng qua lăng kính Marx & Lenin</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Giá trị thặng dư (Ch3)</span> Nền tảng gig chiếm giá trị từ lao động của người làm trong khi gọi họ là "đối tác" — một tranh luận giá trị thặng dư hiện đại.</div>
<div class="lz-layer"><span class="lz-lk">Độc quyền (Ch4)</span> Hiệu ứng mạng tạo nền tảng thắng-ăn-cả — tập trung kinh điển, nay bị giám sát chống độc quyền toàn cầu.</div>
<div class="lz-layer"><span class="lz-lk">Giá trị (Ch2)</span> Dịch vụ "miễn phí" được trả bằng dữ liệu & sự chú ý — giá trị ở dạng ngụy trang.</div>
</div>

<h3>Việt Nam đáp lại — Nghị quyết 57 & 68</h3>
<ul>
<li><strong>Nghị quyết 57-NQ/TW (2024):</strong> đột phá phát triển khoa học, công nghệ & đổi mới sáng tạo — nội dung hiện đại của CNH-HĐH (chuyển đổi số là con đường đi tắt).</li>
<li><strong>Nghị quyết 68-NQ/TW (2025):</strong> phát triển kinh tế tư nhân như một động lực quan trọng — tinh chỉnh cơ cấu sở hữu của mô hình định hướng XHCN.</li>
</ul>

<div class="out"><strong>Ví dụ có lời giải — một phân tích vận dụng toàn lý thuyết:</strong> lấy một nền tảng gọi xe. Vận dụng Ch2 ("dịch vụ" như hàng hóa, giá cả vs giá trị), Ch3 (thặng dư từ lao động tài xế, tỷ lệ ăn chia của nền tảng như tương tự m/v), Ch4 (độc quyền hiệu ứng mạng, tập trung kiểu Lenin), Ch5 (nhà nước Việt Nam nên hài hòa lợi ích nền tảng–tài xế–người tiêu dùng thế nào). Một ca duy nhất luyện năm chương — một assignment điểm A.</div>

<div class="callout ok"><strong>Vì sao điều này quan trọng với bạn:</strong> là sinh viên CNTT, bạn sẽ xây hoặc làm việc trên đúng những nền kinh tế nền tảng này. Lý thuyết cho bạn một lăng kính phản biện về các hệ thống bạn tạo ra — ai được lợi, ai bị bóc lột, quyền lực tập trung ở đâu. Điều đó hiếm và quý.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Phép thử bền vững: lý thuyết còn giải thích được thực tại không?</b> Dấu hiệu của sự hiểu là vận dụng phạm trù cũ vào sự kiện mới và thấy chỗ nó khớp và chỗ nó căng. Một sinh viên nói được "giá trị thặng dư giải thích lợi nhuận gig, nhưng dữ liệu như hàng hóa làm căng lý thuyết giá trị-lao động — đây là vì sao" cho thấy sự làm chủ thực sự. <em>Kỹ năng ★ sâu nhất: vận dụng phản biện, không giáo điều.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              {
                id: 'q1', points: 1,
                question: '(Beyond syllabus) In the digital economy, data increasingly acts as:|||(Ngoài giáo trình) Trong kinh tế số, dữ liệu ngày càng đóng vai:',
                options: [
                  'A useless byproduct|||Một sản phẩm phụ vô dụng',
                  'A new factor / means of production that creates value|||Một yếu tố / tư liệu sản xuất mới tạo giá trị',
                  'The same as gold|||Giống hệt vàng',
                  'Nothing economic|||Không có tính kinh tế',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'Winner-take-all platforms (network effects) best illustrate which chapter\'s concept?|||Nền tảng thắng-ăn-cả (hiệu ứng mạng) minh họa rõ nhất khái niệm của chương nào?',
                options: [
                  'Ch1 method|||Ch1 phương pháp',
                  'Ch4 monopoly/concentration|||Ch4 độc quyền/tập trung',
                  'Ch6 integration|||Ch6 hội nhập',
                  'None|||Không chương nào',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'Resolution 57-NQ/TW (2024) is mainly about:|||Nghị quyết 57-NQ/TW (2024) chủ yếu về:',
                options: [
                  'Banning private business|||Cấm kinh doanh tư nhân',
                  'Breakthrough in science, technology & innovation|||Đột phá khoa học, công nghệ & đổi mới sáng tạo',
                  'Reducing trade|||Giảm thương mại',
                  'Fixing prices|||Cố định giá',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: '(Beyond syllabus) The deepest sign of understanding the theory is:|||(Ngoài giáo trình) Dấu hiệu sâu nhất của việc hiểu lý thuyết là:',
                options: [
                  'Reciting definitions perfectly|||Đọc vẹt định nghĩa hoàn hảo',
                  'Applying old categories to new facts and seeing where they fit or strain|||Vận dụng phạm trù cũ vào sự kiện mới và thấy chỗ khớp hay căng',
                  'Memorizing page numbers|||Nhớ số trang',
                  'Avoiding examples|||Tránh ví dụ',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },
  ],
};
