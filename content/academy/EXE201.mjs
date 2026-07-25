/**
 * EXE201 — Experiential Entrepreneurship 2 (Kỳ 8). Prereq: EXE101.
 * Nối tiếp EXE101: đội xây SẢN PHẨM/DỊCH VỤ thật → lập kế hoạch thu hút khách → LAUNCH trên
 * nhiều kênh → phân tích phản hồi & TĂNG TRƯỞNG. Grading: Outcome 1 (product demo) 40% +
 * Outcome 2 (customer acquisition presentation) 20% + Outcome 3 (growth reports) 40%.
 * KHÔNG code trọng tâm → Exp Hub công cụ; song ngữ EN/VN đối xứng. Chuẩn SWP391 gold.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/EXE201.mjs --apply
 */
export default {
  semester: { code: 'FPTU_Hola8', name: 'Kỳ 8', ordinal: 10 },
  course: {
    academyType: 'FPT',
    courseCode: 'EXE201',
    title: 'Experiential Entrepreneurship 2',
    slug: 'experiential-entrepreneurship-2',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'The execution sequel to EXE101: build a real product/service, plan customer acquisition, launch it on real channels, get your first users, and grow — measured by outcomes, not exams.|||Phần thực thi nối tiếp EXE101: xây sản phẩm/dịch vụ thật, lập kế hoạch thu hút khách, launch trên kênh thật, có người dùng đầu tiên và tăng trưởng — chấm bằng kết quả, không bằng thi.',
    description: 'EXE201 (Trải nghiệm khởi nghiệp 2) là phần THỰC THI nối tiếp EXE101. Nếu EXE101 dừng ở ý tưởng, đội và pitch, thì EXE201 bắt bạn BIẾN NÓ THÀNH THẬT: xây một sản phẩm/dịch vụ dùng được, lập kế hoạch thu hút khách hàng, LAUNCH nó ra các kênh thật (mạng xã hội, cộng đồng, cửa hàng…), có được những người dùng đầu tiên, đo lường và phân tích phản hồi, rồi TĂNG TRƯỞNG. Vẫn theo mô hình Y Combinator (How to Launch, How to Get Users and Grow, How to Sell) và The Lean Startup. Đánh giá 100% qua ba OUTCOME — bản demo sản phẩm, kế hoạch thu hút khách, và báo cáo tăng trưởng — nên môn này thưởng cho đội nào thực sự SHIP và có SỐ LIỆU, không thưởng cho slide đẹp.',
    whatYouLearn: 'Biến MVP thành một sản phẩm/dịch vụ dùng được (thiết kế cho startup, xây và tích hợp); lập kế hoạch thu hút khách hàng (kênh, thông điệp, phễu); chiến lược LAUNCH "ra mắt lại nhiều lần"; cách có 10 khách hàng đầu tiên bằng những việc không mở rộng được; các kênh tăng trưởng (viral/nội dung/trả phí) và growth loops; kỹ năng bán hàng và nói chuyện với khách; đặt KPI/mục tiêu và đọc chỉ số (activation, retention, cohort); phân tích phản hồi từ các kênh để cải tiến; và trình bày ba outcome (demo sản phẩm, kế hoạch acquisition, báo cáo tăng trưởng) một cách thuyết phục có số liệu.',
    requirements: 'Tiên quyết EXE101 (đã có ý tưởng, đội và bằng chứng vấn đề). Cần: đội của bạn từ EXE101, một MVP/prototype để phát triển tiếp, tài khoản các kênh bạn sẽ launch (mạng xã hội/cộng đồng), một công cụ đo lường (Google Analytics/Sheets) và công cụ thiết kế (Canva/Figma). Tinh thần dám launch một thứ chưa hoàn hảo.',
    documentsNote: 'Tài nguyên chính: Y Combinator Library — "How to Launch", "How to Get Users and Grow", "How to Sell", "How to Set KPIs and Goals" • The Lean Startup — Eric Ries • Traction — Gabriel Weinberg & Justin Mares (19 kênh) • The Mom Test — Rob Fitzpatrick. Công cụ cài đặt & template → Exp Hub. Đây là môn TRẢI NGHIỆM nối tiếp EXE101 — vừa xây, launch và tăng trưởng startup thật của đội bạn.',
  },
  sections: [
    /* ══════════════════ MỤC 0 — GIỚI THIỆU & HƯỚNG DẪN ══════════════════ */
    {
      title: 'Section 0 — Introduction & Study Guide|||Mục 0 — Giới thiệu & Hướng dẫn học',
      description: 'Đọc trước tiên: EXE201 khác EXE101 thế nào, thang điểm 3 outcome, CLO, công cụ, ngân hàng sản phẩm launch được, và cách không trượt / ăn điểm cao.',
      lessons: [
        {
          title: '0.1 — From idea to shipped: what EXE201 demands|||0.1 — Từ ý tưởng tới ra mắt: EXE201 đòi hỏi gì',
          slug: 'exe201-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Bức tranh toàn cảnh: EXE201 là phần thực thi — xây thật, launch thật, tăng trưởng thật, chấm bằng số liệu.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>EXE201 — now you actually ship it</h2>
<p class="lead">EXE101 got you to a validated idea, a team and a pitch. <strong>EXE201 is about execution:</strong> build a real product or service, launch it on real channels, win your first users, and grow — with numbers to prove it. There is no written exam; you are graded on three <strong>outcomes</strong> you produce.</p>
<p>The mindset shift: EXE101 rewarded <em>evidence a problem exists</em>; EXE201 rewards <em>a thing that exists and people use</em>. Slides matter far less than shipped reality and a growing metric.</p>

<h3>The execution journey — the whole course in one map</h3>
<div class="lz-map">
  <div class="lz-stage">Build</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Design &amp; build the real product</div><div class="lz-nsub">MVP → usable v1 · scope · integrate</div></div></div>
  <div class="lz-stage">Launch</div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Launch strategy</div><div class="lz-nsub">launch again &amp; again · channels · message</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">First 10 customers</div><div class="lz-nsub">do things that don't scale</div></div></div>
  <div class="lz-stage">Grow</div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Get users &amp; grow</div><div class="lz-nsub">channels · growth loops · Traction's 19 channels</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Sell</div><div class="lz-nsub">talk to customers · close · pricing</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">KPIs &amp; feedback</div><div class="lz-nsub">set goals · cohorts · analyze channel data</div></div></div>
  <div class="lz-stage">Present</div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Three outcome deliverables</div><div class="lz-nsub">product demo · acquisition plan · growth report</div></div></div>
  <div class="lz-stage">Beyond the syllabus ★</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Cohort retention · channel economics · scaling</div><div class="lz-nsub">grow like a real company</div></div></div>
</div>

<div class="callout ok"><strong>The rule that decides your grade:</strong> ship something real and get <em>one metric moving</em>. "We launched, got 60 users, 22 came back in week 2, here's what we changed" beats any amount of planning. Outcomes 1 and 3 (40% each) are literally graded on shipped product and growth evidence.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The "launch" is a process, not an event.</b> Real startups launch continuously — to a small group, learn, fix, launch again wider. Treat each week as a mini-launch to more people. <em>This continuous-launch mindset is beyond the syllabus but is why some teams show a growth curve while others show a single flat spike.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>EXE201 — giờ bạn thực sự ra mắt nó</h2>
<p class="lead">EXE101 đưa bạn tới một ý tưởng đã kiểm chứng, một đội và một bài pitch. <strong>EXE201 nói về thực thi:</strong> xây một sản phẩm hoặc dịch vụ thật, launch nó trên kênh thật, giành người dùng đầu tiên và tăng trưởng — có số liệu để chứng minh. Không có thi viết; bạn được chấm qua ba <strong>outcome</strong> bạn tạo ra.</p>
<p>Sự dịch chuyển tư duy: EXE101 thưởng <em>bằng chứng vấn đề tồn tại</em>; EXE201 thưởng <em>một thứ tồn tại và người ta dùng</em>. Slide quan trọng ít hơn nhiều so với thực tế đã ra mắt và một chỉ số đang tăng.</p>

<h3>Hành trình thực thi — cả môn học trong một bản đồ</h3>
<div class="lz-map">
  <div class="lz-stage">Xây</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Thiết kế &amp; xây sản phẩm thật</div><div class="lz-nsub">MVP → v1 dùng được · scope · tích hợp</div></div></div>
  <div class="lz-stage">Ra mắt</div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Chiến lược launch</div><div class="lz-nsub">ra mắt lại nhiều lần · kênh · thông điệp</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">10 khách hàng đầu tiên</div><div class="lz-nsub">làm những việc không mở rộng được</div></div></div>
  <div class="lz-stage">Tăng trưởng</div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Có người dùng &amp; lớn lên</div><div class="lz-nsub">kênh · growth loops · 19 kênh của Traction</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Bán hàng</div><div class="lz-nsub">nói chuyện khách · chốt · định giá</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">KPI &amp; phản hồi</div><div class="lz-nsub">đặt mục tiêu · cohort · phân tích dữ liệu kênh</div></div></div>
  <div class="lz-stage">Trình bày</div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Ba sản phẩm outcome</div><div class="lz-nsub">demo sản phẩm · kế hoạch acquisition · báo cáo tăng trưởng</div></div></div>
  <div class="lz-stage">Ngoài giáo trình ★</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Retention theo cohort · kinh tế kênh · mở rộng</div><div class="lz-nsub">tăng trưởng như một công ty thật</div></div></div>
</div>

<div class="callout ok"><strong>Quy tắc quyết định điểm:</strong> ra một thứ thật và làm <em>một chỉ số di chuyển</em>. "Bọn em đã launch, có 60 người dùng, 22 quay lại tuần 2, đây là cái bọn em đã đổi" thắng bất kỳ lượng kế hoạch nào. Outcome 1 và 3 (mỗi cái 40%) được chấm đúng nghĩa đen bằng sản phẩm đã ra mắt và bằng chứng tăng trưởng.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>"Launch" là một quá trình, không phải một sự kiện.</b> Startup thật launch liên tục — cho một nhóm nhỏ, học, sửa, launch lại rộng hơn. Coi mỗi tuần là một lần ra mắt nhỏ cho nhiều người hơn. <em>Tư duy launch-liên-tục này ngoài syllabus nhưng là lý do một số đội cho thấy đường cong tăng trưởng còn đội khác chỉ có một đỉnh phẳng.</em></div>
</div>`,
        },
        {
          title: '0.2 — Grading: three outcomes, no exam|||0.2 — Thang điểm: ba outcome, không thi',
          slug: 'exe201-thang-diem',
          type: 'article',
          description: 'Bảng thang điểm: Outcome 1 (product demo) 40% + Outcome 2 (acquisition) 20% + Outcome 3 (growth reports) 40%.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Graded on outcomes you ship</h2>
<p class="lead">EXE201 is 100% continuous outcomes — no final written exam. Each outcome is a concrete deliverable your team produces and presents.</p>
<table>
<thead><tr><th>Outcome</th><th>Weight</th><th>CLO</th><th>What it proves</th></tr></thead>
<tbody>
<tr><td>Outcome 1 — Product/service demonstration</td><td><strong>40%</strong></td><td>CLO1</td><td>You built a real, usable product/service</td></tr>
<tr><td>Outcome 2 — Customer acquisition presentation</td><td><strong>20%</strong></td><td>CLO2</td><td>You have a real plan + first channels to get users</td></tr>
<tr><td>Outcome 3 — Growth reports (launch + feedback)</td><td><strong>40%</strong></td><td>CLO3, CLO4</td><td>You launched, measured, and analyzed feedback</td></tr>
</tbody>
</table>
<div class="kv-grid">
<div class="kv"><span class="k">Scale</span><span class="v">10</span></div>
<div class="kv"><span class="k">Pass</span><span class="v">Final ≥ 5.0</span></div>
<div class="kv"><span class="k">Outcome 3 gate</span><span class="v">completion ≥ 4 on CLO3/CLO4</span></div>
<div class="kv"><span class="k">Attendance</span><span class="v">≥ 80% of sessions/seminars/mentoring</span></div>
</div>
<div class="callout warn"><strong>Read this twice.</strong> 80% of your grade (Outcome 1 + 3) requires a <em>shipped product</em> and <em>real launch data</em>. A team that plans beautifully but never launches cannot pass the two big outcomes. Ship early, launch small, gather numbers weekly.</div>
<div class="pitfall"><strong>Attendance is a hard gate.</strong> Below 80% you're not accepted to final outcome presentations. Track it from week 1.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The "growth report" wins on a chart, not adjectives.</b> A single weekly line chart of active users (going up, even a little) is worth more than pages of description. Instructors and investors read the same signal: is it growing? <em>Beyond the syllabus, but the presentation habit that separates a 7 from a 9 on Outcome 3.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Chấm bằng những outcome bạn ra mắt</h2>
<p class="lead">EXE201 chấm 100% qua outcome liên tục — không có thi viết cuối kỳ. Mỗi outcome là một sản phẩm cụ thể đội bạn tạo ra và trình bày.</p>
<table>
<thead><tr><th>Outcome</th><th>Trọng số</th><th>CLO</th><th>Nó chứng minh gì</th></tr></thead>
<tbody>
<tr><td>Outcome 1 — Demo sản phẩm/dịch vụ</td><td><strong>40%</strong></td><td>CLO1</td><td>Bạn đã xây một sản phẩm/dịch vụ thật, dùng được</td></tr>
<tr><td>Outcome 2 — Thuyết trình thu hút khách hàng</td><td><strong>20%</strong></td><td>CLO2</td><td>Bạn có kế hoạch thật + kênh đầu tiên để có người dùng</td></tr>
<tr><td>Outcome 3 — Báo cáo tăng trưởng (launch + phản hồi)</td><td><strong>40%</strong></td><td>CLO3, CLO4</td><td>Bạn đã launch, đo lường và phân tích phản hồi</td></tr>
</tbody>
</table>
<div class="kv-grid">
<div class="kv"><span class="k">Thang</span><span class="v">10</span></div>
<div class="kv"><span class="k">Qua môn</span><span class="v">Điểm ≥ 5.0</span></div>
<div class="kv"><span class="k">Cổng Outcome 3</span><span class="v">hoàn thành ≥ 4 ở CLO3/CLO4</span></div>
<div class="kv"><span class="k">Điểm danh</span><span class="v">≥ 80% buổi/seminar/mentoring</span></div>
</div>
<div class="callout warn"><strong>Đọc kỹ hai lần.</strong> 80% điểm (Outcome 1 + 3) đòi hỏi một <em>sản phẩm đã ra mắt</em> và <em>dữ liệu launch thật</em>. Đội lập kế hoạch đẹp mà không bao giờ launch thì không qua được hai outcome lớn. Ra sớm, launch nhỏ, thu số liệu hàng tuần.</div>
<div class="pitfall"><strong>Điểm danh là cổng cứng.</strong> Dưới 80% bạn không được vào thuyết trình outcome cuối. Theo dõi từ tuần 1.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>"Báo cáo tăng trưởng" thắng bằng biểu đồ, không bằng tính từ.</b> Một biểu đồ đường hàng tuần về người dùng hoạt động (đi lên, dù chỉ một chút) đáng giá hơn hàng trang mô tả. Giảng viên và nhà đầu tư đọc cùng một tín hiệu: nó có đang tăng không? <em>Ngoài syllabus, nhưng là thói quen trình bày tách điểm 7 khỏi điểm 9 ở Outcome 3.</em></div>
</div>`,
        },
        {
          title: '0.3 — Course learning outcomes (CLOs)|||0.3 — Chuẩn đầu ra môn học (CLO)',
          slug: 'exe201-clo',
          type: 'article',
          description: '4 CLO của EXE201 và outcome nào chứng minh CLO nào.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>The 4 CLOs — what you must be able to do</h2>
<p class="lead">EXE201's outcomes map directly to four learning outcomes. Use them as a self-check before each outcome presentation.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">CLO1</span> Build a physical/real product or service. <em>→ Outcome 1</em></div>
<div class="lz-layer"><span class="lz-lk">CLO2</span> Map out the customer acquisition plan. <em>→ Outcome 2</em></div>
<div class="lz-layer"><span class="lz-lk">CLO3</span> Launch the product on different channels. <em>→ Outcome 3</em></div>
<div class="lz-layer"><span class="lz-lk">CLO4</span> Analyze feedback from the channels. <em>→ Outcome 3</em></div>
</div>
<div class="callout ok">The arc: <strong>build → plan reach → launch → learn</strong>. Each depends on the last. You can't analyze channel feedback (CLO4) if you never launched (CLO3), and you can't launch what you never built (CLO1). Do them in order.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>4 CLO — bạn phải làm được gì</h2>
<p class="lead">Các outcome của EXE201 ánh xạ trực tiếp tới bốn chuẩn đầu ra. Dùng chúng để tự soi trước mỗi buổi trình bày outcome.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">CLO1</span> Xây một sản phẩm/dịch vụ thật, cụ thể. <em>→ Outcome 1</em></div>
<div class="lz-layer"><span class="lz-lk">CLO2</span> Lập kế hoạch thu hút khách hàng. <em>→ Outcome 2</em></div>
<div class="lz-layer"><span class="lz-lk">CLO3</span> Launch sản phẩm trên nhiều kênh khác nhau. <em>→ Outcome 3</em></div>
<div class="lz-layer"><span class="lz-lk">CLO4</span> Phân tích phản hồi từ các kênh. <em>→ Outcome 3</em></div>
</div>
<div class="callout ok">Mạch: <strong>xây → lập kế hoạch tiếp cận → launch → học</strong>. Mỗi cái phụ thuộc cái trước. Bạn không thể phân tích phản hồi kênh (CLO4) nếu chưa launch (CLO3), và không thể launch thứ chưa xây (CLO1). Làm theo thứ tự.</div>
</div>`,
        },
        {
          title: '0.4 — Tools & setup (Exp Hub)|||0.4 — Công cụ & cài đặt (Exp Hub)',
          slug: 'exe201-cong-cu',
          type: 'article',
          description: 'Bộ công cụ launch & đo lường: kênh mạng xã hội, analytics, no-code builder, email — kèm guide cài đặt.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>Your launch & growth toolkit</h2>
<p class="lead">EXE201 needs tools to <em>build, launch, and measure</em>. Beyond the EXE101 kit (YC library, Forms, Canva, Notion) you add channels, a builder, and analytics.</p>
<ul>
<li><strong>No-code builder</strong> (Glide / Softr / Carrd) — turn your MVP into something real users can touch.</li>
<li><strong>Analytics</strong> (Google Analytics / a simple metrics Sheet) — measure activation & retention.</li>
<li><strong>Launch channels</strong> — Facebook groups, TikTok, Zalo communities, campus reps.</li>
<li><strong>Email / forms</strong> — collect signups, send updates, ask for feedback.</li>
</ul>
<a class="link-card exphub" href="/exp-hub/exe201-cong-cu-launch?ref=%2Fcourses%2Fexperiential-entrepreneurship-2%2Flearn&reflabel=EXE201%200.4" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Setup guide: launch &amp; growth toolkit</span><span class="lc-sub">No-code builder, Google Analytics, launch channels and a weekly metrics sheet — step by step.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Instrument before you launch.</b> Add your analytics/tracking <em>before</em> the first user arrives, not after. Otherwise your first (and most informative) launch produces no data. <em>A practitioner habit beyond the syllabus — you can't analyze feedback you never captured.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Bộ công cụ launch & tăng trưởng của bạn</h2>
<p class="lead">EXE201 cần công cụ để <em>xây, launch và đo lường</em>. Ngoài bộ của EXE101 (kho YC, Forms, Canva, Notion), bạn thêm kênh, một công cụ dựng và analytics.</p>
<ul>
<li><strong>Công cụ dựng no-code</strong> (Glide / Softr / Carrd) — biến MVP thành thứ người dùng thật chạm được.</li>
<li><strong>Analytics</strong> (Google Analytics / một Sheet chỉ số đơn giản) — đo activation & retention.</li>
<li><strong>Kênh launch</strong> — group Facebook, TikTok, cộng đồng Zalo, lớp trưởng/đại sứ campus.</li>
<li><strong>Email / form</strong> — thu đăng ký, gửi cập nhật, xin phản hồi.</li>
</ul>
<a class="link-card exphub" href="/exp-hub/exe201-cong-cu-launch?ref=%2Fcourses%2Fexperiential-entrepreneurship-2%2Flearn&reflabel=EXE201%200.4" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Guide cài đặt: bộ công cụ launch &amp; tăng trưởng</span><span class="lc-sub">Công cụ dựng no-code, Google Analytics, kênh launch và một sheet chỉ số hàng tuần — từng bước.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Gắn đo trước khi launch.</b> Thêm analytics/tracking <em>trước</em> khi người dùng đầu tiên tới, không phải sau. Nếu không, lần launch đầu tiên (và giàu thông tin nhất) của bạn không tạo ra dữ liệu nào. <em>Thói quen của người làm nghề ngoài syllabus — bạn không thể phân tích phản hồi bạn chưa bao giờ ghi lại.</em></div>
</div>`,
        },
        {
          title: '0.5 — Launchable-product bank (12) + how to pick|||0.5 — Ngân hàng sản phẩm launch được (12) + cách chọn',
          slug: 'exe201-ngan-hang-san-pham',
          type: 'article',
          description: '12 dạng sản phẩm/dịch vụ launch được trong 10 tuần + rubric chọn thứ ship kịp và đo được.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.5</span>
<h2>12 launchable products — pick what you can ship & measure</h2>
<p class="lead">EXE201 is graded on a <em>shipped</em> product. So pick a form you can actually build and launch in ~10 weeks and instrument for data. Here are 12 realistic forms (works for most EXE101 ideas), from lowest to higher build effort.</p>
<table>
<thead><tr><th>#</th><th>Product form</th><th>Build effort · how you launch</th></tr></thead>
<tbody>
<tr><td>1</td><td>Manual/concierge service (you do it by hand)</td><td>Low · post in a community, take orders via chat</td></tr>
<tr><td>2</td><td>Google Form + Sheet workflow</td><td>Low · share link in target groups</td></tr>
<tr><td>3</td><td>Landing page + waitlist (Carrd)</td><td>Low · ads/posts drive signups</td></tr>
<tr><td>4</td><td>Instagram/TikTok shop or content brand</td><td>Low · organic content + DMs</td></tr>
<tr><td>5</td><td>Physical product small batch</td><td>Medium · pre-orders then fulfil</td></tr>
<tr><td>6</td><td>No-code app (Glide/Softr)</td><td>Medium · share app link to a cohort</td></tr>
<tr><td>7</td><td>Notion/Sheet template product</td><td>Low · sell/giveaway in communities</td></tr>
<tr><td>8</td><td>Booking/marketplace (no-code)</td><td>Medium · seed both sides manually</td></tr>
<tr><td>9</td><td>Chatbot/automation service</td><td>Medium · demo in target group</td></tr>
<tr><td>10</td><td>Event/workshop as a service</td><td>Low · sell tickets, run it, get feedback</td></tr>
<tr><td>11</td><td>Subscription mini-service (weekly value)</td><td>Medium · onboard first subscribers by hand</td></tr>
<tr><td>12</td><td>Coded MVP (if team has devs)</td><td>High · launch to a small user group</td></tr>
</tbody>
</table>

<h3>The 5-test filter — before you commit the build</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">1 · Shippable</span> Can you launch a usable version in ≤ 4 weeks?</div>
<div class="lz-layer"><span class="lz-lk">2 · Measurable</span> Can you track a clear activation & retention metric?</div>
<div class="lz-layer"><span class="lz-lk">3 · Launchable</span> Do you have a real channel to reach users this week?</div>
<div class="lz-layer"><span class="lz-lk">4 · Feedback-rich</span> Will users generate feedback you can analyze (CLO4)?</div>
<div class="lz-layer"><span class="lz-lk">5 · Team-capable</span> Can your actual team build & run it (no devs → no-code)?</div>
</div>

<div class="callout warn"><strong>The classic EXE201 mistake:</strong> choosing a form so ambitious you spend all 10 weeks building and never launch — so Outcome 3 (40%, launch + feedback) is empty. When in doubt, choose the <em>less ambitious form that ships in week 4</em> and grows for 6 weeks.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>A service can beat an app.</b> Doing the value manually (concierge) for real customers often teaches more, launches faster, and produces richer feedback than a half-built app. "Software later, service now" is a legitimate strategy — Airbnb and DoorDash both started manual. <em>Beyond the syllabus, but why "boring" manual products often score higher on outcomes.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.5</span>
<h2>12 dạng sản phẩm launch được — chọn thứ ship & đo được</h2>
<p class="lead">EXE201 chấm trên sản phẩm <em>đã ra mắt</em>. Nên hãy chọn một dạng bạn thực sự xây và launch được trong ~10 tuần và gắn đo được dữ liệu. Đây là 12 dạng thực tế (hợp với hầu hết ý tưởng EXE101), từ ít tới nhiều công sức xây.</p>
<table>
<thead><tr><th>#</th><th>Dạng sản phẩm</th><th>Công sức xây · launch thế nào</th></tr></thead>
<tbody>
<tr><td>1</td><td>Dịch vụ thủ công/concierge (bạn tự làm tay)</td><td>Thấp · đăng trong cộng đồng, nhận đơn qua chat</td></tr>
<tr><td>2</td><td>Quy trình Google Form + Sheet</td><td>Thấp · chia link trong group mục tiêu</td></tr>
<tr><td>3</td><td>Landing page + waitlist (Carrd)</td><td>Thấp · quảng cáo/bài đăng đẩy đăng ký</td></tr>
<tr><td>4</td><td>Shop/thương hiệu nội dung Instagram/TikTok</td><td>Thấp · nội dung hữu cơ + DM</td></tr>
<tr><td>5</td><td>Sản phẩm vật lý lô nhỏ</td><td>Trung bình · đặt trước rồi giao</td></tr>
<tr><td>6</td><td>App no-code (Glide/Softr)</td><td>Trung bình · chia link app cho một nhóm</td></tr>
<tr><td>7</td><td>Sản phẩm template Notion/Sheet</td><td>Thấp · bán/tặng trong cộng đồng</td></tr>
<tr><td>8</td><td>Đặt lịch/chợ (no-code)</td><td>Trung bình · gieo mầm cả hai phía thủ công</td></tr>
<tr><td>9</td><td>Dịch vụ chatbot/tự động hoá</td><td>Trung bình · demo trong group mục tiêu</td></tr>
<tr><td>10</td><td>Sự kiện/workshop như một dịch vụ</td><td>Thấp · bán vé, chạy, lấy phản hồi</td></tr>
<tr><td>11</td><td>Dịch vụ thuê bao nhỏ (giá trị hàng tuần)</td><td>Trung bình · onboard người thuê đầu bằng tay</td></tr>
<tr><td>12</td><td>MVP có code (nếu đội có dev)</td><td>Cao · launch cho một nhóm người dùng nhỏ</td></tr>
</tbody>
</table>

<h3>Bộ lọc 5 phép thử — trước khi cam kết xây</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">1 · Ship được</span> Bạn launch một bản dùng được trong ≤ 4 tuần không?</div>
<div class="lz-layer"><span class="lz-lk">2 · Đo được</span> Bạn theo dõi được một chỉ số activation & retention rõ ràng không?</div>
<div class="lz-layer"><span class="lz-lk">3 · Launch được</span> Bạn có kênh thật để tiếp cận người dùng tuần này không?</div>
<div class="lz-layer"><span class="lz-lk">4 · Giàu phản hồi</span> Người dùng có tạo ra phản hồi bạn phân tích được (CLO4) không?</div>
<div class="lz-layer"><span class="lz-lk">5 · Đội làm được</span> Đội thật của bạn xây & vận hành được không (không dev → no-code)?</div>
</div>

<div class="callout warn"><strong>Sai lầm kinh điển của EXE201:</strong> chọn một dạng quá tham vọng đến mức tốn hết 10 tuần để xây mà không bao giờ launch — nên Outcome 3 (40%, launch + phản hồi) trống rỗng. Khi phân vân, chọn <em>dạng ít tham vọng hơn nhưng ship trong tuần 4</em> rồi tăng trưởng trong 6 tuần.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Một dịch vụ có thể thắng một app.</b> Làm giá trị bằng tay (concierge) cho khách hàng thật thường dạy nhiều hơn, launch nhanh hơn và tạo phản hồi giàu hơn một app xây dở. "Phần mềm sau, dịch vụ ngay" là một chiến lược hợp lệ — Airbnb và DoorDash đều bắt đầu thủ công. <em>Ngoài syllabus, nhưng là lý do sản phẩm thủ công "chán" thường điểm cao hơn ở outcome.</em></div>
</div>`,
        },
        {
          title: '0.6 — How not to fail & how to score high|||0.6 — Cách không trượt & cách ăn điểm cao',
          slug: 'exe201-chong-truot-diem-cao',
          type: 'article',
          description: '7 kiểu mất điểm ở môn thực thi + cờ xanh/đỏ theo outcome + công thức điểm cao.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.6</span>
<h2>7 ways teams lose points — and how to avoid each</h2>
<p class="lead">EXE201 fails teams that <em>plan instead of ship</em>. Here are the seven classic point-losers on the execution course.</p>
<table>
<thead><tr><th>#</th><th>How you lose points</th><th>The fix</th></tr></thead>
<tbody>
<tr><td>1</td><td>Never actually launched — only a prototype</td><td>Launch a small real version by week 4-5</td></tr>
<tr><td>2</td><td>No metrics — can't show activation/retention</td><td>Instrument before launch; track weekly</td></tr>
<tr><td>3</td><td>Over-built one feature, launched nothing usable</td><td>Ship the core loop; cut everything else</td></tr>
<tr><td>4</td><td>Launched to no one (no real channel)</td><td>Pick 1-2 real channels; go where users are</td></tr>
<tr><td>5</td><td>Collected feedback but never analyzed it</td><td>Turn feedback into a change; show before/after</td></tr>
<tr><td>6</td><td>Vanity metrics only (likes, not retention)</td><td>Report activation & week-over-week retention</td></tr>
<tr><td>7</td><td>Flat "one-shot" launch, no iteration</td><td>Launch again and again; show the growth curve</td></tr>
</tbody>
</table>

<h3>Green flags / red flags by outcome</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">O1 green</span> A real product/service users actually touched · a working demo.</div>
<div class="lz-layer"><span class="lz-lk">O1 red</span> A mockup or slides describing a product that doesn't exist.</div>
<div class="lz-layer"><span class="lz-lk">O2 green</span> A concrete acquisition plan: channels, message, funnel, first results.</div>
<div class="lz-layer"><span class="lz-lk">O2 red</span> "We'll post on social media" with no specifics.</div>
<div class="lz-layer"><span class="lz-lk">O3 green</span> Launched on 1-2 channels · a growth chart · feedback → a change made.</div>
<div class="lz-layer"><span class="lz-lk">O3 red</span> No launch data · vanity likes · no analysis.</div>
</div>

<div class="callout ok"><strong>The high-mark formula.</strong> Score = (a real shipped product) × (launched on real channels) × (a metric that grew) × (feedback turned into an improvement). All four → 9-territory. Miss "launched" or "a metric that grew" and Outcome 1+3 (80%) collapse.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Show the "learning story," not just the numbers.</b> The most persuasive Outcome 3 is a narrative: "we launched on TikTok, activation was low, feedback said onboarding was confusing, we simplified it, retention doubled." That before→change→after loop is exactly the Build-Measure-Learn cycle graders reward. <em>Beyond the syllabus, but the storytelling that turns raw data into a top score.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.6</span>
<h2>7 kiểu đội mất điểm — và cách tránh từng cái</h2>
<p class="lead">EXE201 đánh trượt đội <em>lập kế hoạch thay vì ship</em>. Đây là bảy thủ phạm kinh điển làm mất điểm ở môn thực thi.</p>
<table>
<thead><tr><th>#</th><th>Cách bạn mất điểm</th><th>Cách sửa</th></tr></thead>
<tbody>
<tr><td>1</td><td>Chưa bao giờ launch thật — chỉ là prototype</td><td>Launch một bản thật nhỏ trong tuần 4-5</td></tr>
<tr><td>2</td><td>Không có chỉ số — không cho thấy activation/retention</td><td>Gắn đo trước launch; theo dõi hàng tuần</td></tr>
<tr><td>3</td><td>Xây quá kỹ một tính năng, không launch được gì dùng được</td><td>Ship vòng lõi; cắt mọi thứ khác</td></tr>
<tr><td>4</td><td>Launch cho không ai (không kênh thật)</td><td>Chọn 1-2 kênh thật; tới nơi người dùng ở</td></tr>
<tr><td>5</td><td>Thu phản hồi nhưng không phân tích</td><td>Biến phản hồi thành thay đổi; cho thấy trước/sau</td></tr>
<tr><td>6</td><td>Chỉ chỉ số phù phiếm (like, không retention)</td><td>Báo cáo activation & retention tuần-qua-tuần</td></tr>
<tr><td>7</td><td>Launch "một phát" phẳng, không lặp</td><td>Launch lại nhiều lần; cho thấy đường cong tăng trưởng</td></tr>
</tbody>
</table>

<h3>Cờ xanh / cờ đỏ theo outcome</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">O1 xanh</span> Một sản phẩm/dịch vụ thật mà người dùng đã chạm · một demo chạy được.</div>
<div class="lz-layer"><span class="lz-lk">O1 đỏ</span> Một mockup hoặc slide mô tả một sản phẩm không tồn tại.</div>
<div class="lz-layer"><span class="lz-lk">O2 xanh</span> Một kế hoạch acquisition cụ thể: kênh, thông điệp, phễu, kết quả đầu.</div>
<div class="lz-layer"><span class="lz-lk">O2 đỏ</span> "Bọn em sẽ đăng mạng xã hội" mà không cụ thể gì.</div>
<div class="lz-layer"><span class="lz-lk">O3 xanh</span> Đã launch trên 1-2 kênh · một biểu đồ tăng trưởng · phản hồi → một thay đổi đã làm.</div>
<div class="lz-layer"><span class="lz-lk">O3 đỏ</span> Không dữ liệu launch · like phù phiếm · không phân tích.</div>
</div>

<div class="callout ok"><strong>Công thức điểm cao.</strong> Điểm = (một sản phẩm thật đã ship) × (launch trên kênh thật) × (một chỉ số đã tăng) × (phản hồi biến thành cải tiến). Đủ cả bốn → vùng 9. Thiếu "đã launch" hoặc "một chỉ số đã tăng" là Outcome 1+3 (80%) sụp.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Kể "câu chuyện học hỏi", không chỉ con số.</b> Outcome 3 thuyết phục nhất là một câu chuyện: "bọn em launch trên TikTok, activation thấp, phản hồi nói onboarding khó hiểu, bọn em đơn giản hoá nó, retention tăng gấp đôi." Vòng trước→thay đổi→sau đó chính là chu trình Build-Measure-Learn mà người chấm thưởng. <em>Ngoài syllabus, nhưng là cách kể biến dữ liệu thô thành điểm cao.</em></div>
</div>`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 1 — XÂY SẢN PHẨM THẬT ══════════════════ */
    {
      title: 'Chapter 1 — Design & build the real product|||Chương 1 — Thiết kế & xây sản phẩm thật',
      description: 'Từ MVP tới một v1 dùng được: quyết scope, thiết kế cho startup, và tích hợp thành một trải nghiệm chạy được.',
      lessons: [
        {
          title: '1.1 — From MVP to a usable v1|||1.1 — Từ MVP tới v1 dùng được',
          slug: 'exe201-1-1-mvp-to-v1',
          type: 'VIDEO',
          description: 'Cách nâng MVP thành một sản phẩm người dùng thật dùng được mà không rơi vào bẫy over-build.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>Build the core loop, not the whole vision</h2>
<p class="lead">In EXE101 your MVP tested demand. In EXE201 you build a v1 that real users can actually use and come back to — but the danger doubles: now you can over-build. The discipline is to ship the <strong>core loop</strong> (the one repeated action that delivers value) and cut everything else.</p>

<h3>Find your core loop</h3>
<div class="out"><strong>Ask:</strong> what single action, repeated, IS the value?
• BookSwap → "list an item / find & complete a trade."
• A tutor-matching app → "post a need / get matched / book a session."
• A content brand → "see a post / save it / come back for the next."
<strong>Rule:</strong> v1 = that loop working end-to-end for a real user. Profile pages, settings, dark mode — all later. If the loop works and repeats, you have a product.</div>

<h3>Design principles for a startup v1</h3>
<ul>
<li><strong>One obvious next action</strong> on every screen — don't make users think.</li>
<li><strong>Fast to first value</strong> — a new user should feel the benefit in under a minute.</li>
<li><strong>Manual behind the scenes is fine</strong> — a human can do what code doesn't yet.</li>
<li><strong>Instrument it</strong> — every key step logs an event so you can measure.</li>
</ul>

<div class="pitfall"><strong>Trap:</strong> polishing UI on features nobody uses. Ship the ugly core loop, watch real usage, then improve where users actually are.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The "riskiest assumption" first.</b> Build the part that would kill you if wrong, before the easy parts. If "will people even list an item?" is the riskiest unknown, that's your v1 — not the payment system. <em>Assumption-mapping is beyond the syllabus but stops teams from perfecting the wrong thing.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Xây vòng lõi, không xây cả tầm nhìn</h2>
<p class="lead">Ở EXE101, MVP của bạn thử nhu cầu. Ở EXE201 bạn xây một v1 mà người dùng thật dùng được và quay lại — nhưng nguy hiểm tăng gấp đôi: giờ bạn có thể over-build. Kỷ luật là ship <strong>vòng lõi</strong> (một hành động lặp lại tạo ra giá trị) và cắt mọi thứ khác.</p>

<h3>Tìm vòng lõi của bạn</h3>
<div class="out"><strong>Hỏi:</strong> hành động duy nhất nào, lặp lại, CHÍNH LÀ giá trị?
• BookSwap → "đăng một món / tìm & hoàn tất một giao dịch."
• App ghép gia sư → "đăng nhu cầu / được ghép / đặt buổi học."
• Thương hiệu nội dung → "xem một bài / lưu / quay lại xem bài tiếp."
<strong>Nguyên tắc:</strong> v1 = vòng đó chạy trọn vẹn cho một người dùng thật. Trang hồ sơ, cài đặt, dark mode — để sau hết. Nếu vòng chạy và lặp, bạn có một sản phẩm.</div>

<h3>Nguyên tắc thiết kế cho v1 startup</h3>
<ul>
<li><strong>Một hành động tiếp theo hiển nhiên</strong> trên mỗi màn hình — đừng bắt người dùng phải nghĩ.</li>
<li><strong>Nhanh tới giá trị đầu tiên</strong> — người dùng mới nên cảm nhận lợi ích trong dưới một phút.</li>
<li><strong>Thủ công sau hậu trường là được</strong> — con người làm cái code chưa làm.</li>
<li><strong>Gắn đo</strong> — mỗi bước quan trọng ghi một sự kiện để bạn đo được.</li>
</ul>

<div class="pitfall"><strong>Bẫy:</strong> gọt UI cho tính năng chẳng ai dùng. Ship vòng lõi xấu xí, quan sát mức dùng thật, rồi cải thiện đúng chỗ người dùng thực sự ở.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>"Giả định rủi ro nhất" trước.</b> Xây phần mà nếu sai sẽ giết bạn, trước những phần dễ. Nếu "liệu người ta có đăng món không?" là ẩn số rủi ro nhất, đó là v1 của bạn — không phải hệ thanh toán. <em>Lập bản đồ giả định ngoài syllabus nhưng ngăn đội hoàn thiện nhầm thứ.</em></div>
</div>`,
        },
        {
          title: '1.2 — Scope, cut, and integrate|||1.2 — Chốt phạm vi, cắt, và tích hợp',
          slug: 'exe201-1-2-scope-integrate',
          type: 'VIDEO',
          description: 'Quyết cái gì vào v1 (MoSCoW), cắt không thương tiếc, và ghép mọi mảnh thành một trải nghiệm liền mạch.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>Deciding what's in — and ruthlessly cutting the rest</h2>
<p class="lead">A 10-week team must scope hard. Use <strong>MoSCoW</strong> to sort features, ship only the Must-haves for v1, and integrate them into one smooth flow — a chain of half-built features is worse than one complete loop.</p>

<h3>MoSCoW — worked example (tutor-matching app)</h3>
<div class="out"><strong>Must</strong> (v1): post a need · browse tutors · request & confirm a session.
<strong>Should</strong> (if time): ratings, chat.
<strong>Could</strong> (later): payments, calendar sync.
<strong>Won't</strong> (not now): video calls, AI matching, mobile app.
<strong>Result:</strong> v1 is the three Musts, fully working. Everything else is explicitly parked — so no one wastes a day on "Won't" items.</div>

<h3>Integration: make it feel like one product</h3>
<ul>
<li><strong>One consistent path</strong> — a user can go start→value without hitting a dead end.</li>
<li><strong>Handle the sad paths</strong> — empty states, errors, "no results" don't break the flow.</li>
<li><strong>Seed data</strong> so a first user doesn't see an empty, dead product.</li>
<li><strong>Test the whole loop</strong> as a real user before you launch, not feature-by-feature.</li>
</ul>

<div class="callout ok"><strong>Outcome-1 tie-in:</strong> the demo you present is exactly this integrated loop, run live. Rehearse it as one continuous story ("watch a student go from need to booked session in 40 seconds").</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Feature creep is the silent killer.</b> Every added feature multiplies testing, bugs and confusion. Mature teams keep a visible "Won't do (yet)" list to protect focus. Saying no is a product skill, not a limitation. <em>Beyond the syllabus, but the discipline that gets a team to a working demo on time.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Quyết cái gì vào — và cắt phần còn lại không thương tiếc</h2>
<p class="lead">Một đội 10 tuần phải chốt scope thật gắt. Dùng <strong>MoSCoW</strong> để phân loại tính năng, chỉ ship Must-have cho v1, và tích hợp chúng thành một luồng mượt — một chuỗi tính năng xây dở còn tệ hơn một vòng lặp hoàn chỉnh.</p>

<h3>MoSCoW — ví dụ có lời giải (app ghép gia sư)</h3>
<div class="out"><strong>Must (bắt buộc)</strong> (v1): đăng nhu cầu · duyệt gia sư · yêu cầu & xác nhận buổi học.
<strong>Should (nên)</strong> (nếu kịp): đánh giá, chat.
<strong>Could (có thể)</strong> (sau): thanh toán, đồng bộ lịch.
<strong>Won't (chưa)</strong> (không phải bây giờ): gọi video, ghép bằng AI, app di động.
<strong>Kết quả:</strong> v1 là ba Must, chạy trọn vẹn. Mọi thứ khác được gác rõ ràng — nên không ai phí một ngày cho món "Won't".</div>

<h3>Tích hợp: làm cho nó cảm giác như một sản phẩm</h3>
<ul>
<li><strong>Một đường đi nhất quán</strong> — người dùng đi từ bắt đầu→giá trị mà không gặp ngõ cụt.</li>
<li><strong>Xử lý đường buồn</strong> — trạng thái trống, lỗi, "không có kết quả" không làm hỏng luồng.</li>
<li><strong>Gieo dữ liệu</strong> để người dùng đầu không thấy một sản phẩm trống rỗng, chết.</li>
<li><strong>Test cả vòng</strong> như một người dùng thật trước khi launch, không test từng tính năng.</li>
</ul>

<div class="callout ok"><strong>Gắn Outcome 1:</strong> bản demo bạn trình bày chính là vòng tích hợp này, chạy trực tiếp. Tập nó như một câu chuyện liền mạch ("xem một sinh viên đi từ nhu cầu tới buổi học đã đặt trong 40 giây").</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Phình tính năng (feature creep) là kẻ giết thầm lặng.</b> Mỗi tính năng thêm nhân lên việc test, lỗi và sự rối. Đội chín giữ một danh sách "Chưa làm (bây giờ)" nhìn thấy được để bảo vệ sự tập trung. Nói không là một kỹ năng sản phẩm, không phải giới hạn. <em>Ngoài syllabus, nhưng là kỷ luật đưa đội tới một demo chạy được đúng hạn.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'The "core loop" of a product is:|||"Vòng lõi" của một sản phẩm là:',
                options: [
                  'Every feature the product could have|||Mọi tính năng sản phẩm có thể có',
                  'The single repeated action that delivers the value|||Một hành động lặp lại tạo ra giá trị',
                  'The login screen|||Màn hình đăng nhập',
                  'The settings page|||Trang cài đặt',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'In MoSCoW, features you will NOT build for v1 are labeled:|||Trong MoSCoW, tính năng bạn KHÔNG xây cho v1 được gán nhãn:',
                options: ['Must|||Bắt buộc', 'Should|||Nên', "Won't|||Chưa/không", 'Could|||Có thể'],
                correctIndex: 2,
              },
              {
                id: 'q3', points: 1,
                question: 'The biggest EXE201 build risk is:|||Rủi ro xây lớn nhất của EXE201 là:',
                options: [
                  'Shipping too small a version|||Ship một bản quá nhỏ',
                  'Over-building and never launching|||Xây quá nhiều và không bao giờ launch',
                  'Adding analytics too early|||Thêm analytics quá sớm',
                  'Talking to too many users|||Nói chuyện với quá nhiều người dùng',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: '(Beyond syllabus) The "riskiest assumption first" rule means you build:|||(Ngoài giáo trình) Quy tắc "giả định rủi ro nhất trước" nghĩa là bạn xây:',
                options: [
                  'The easiest feature first|||Tính năng dễ nhất trước',
                  'The part that would kill you if it is wrong|||Phần mà nếu sai sẽ giết bạn',
                  'The prettiest screen first|||Màn hình đẹp nhất trước',
                  'The payment system first|||Hệ thanh toán trước',
                ], correctIndex: 1,
              },
              {
                id: 'q5', points: 1,
                question: 'Before launching, you should test:|||Trước khi launch, bạn nên test:',
                options: [
                  'Each feature separately only|||Chỉ từng tính năng riêng lẻ',
                  'The whole core loop end-to-end as a real user|||Cả vòng lõi từ đầu đến cuối như một người dùng thật',
                  'Nothing, launch and see|||Không gì cả, launch rồi xem',
                  'Only the login|||Chỉ đăng nhập',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 2 — CHIẾN LƯỢC LAUNCH ══════════════════ */
    {
      title: 'Chapter 2 — Launch strategy|||Chương 2 — Chiến lược launch',
      description: 'Vì sao "launch lại nhiều lần" thắng big-bang, chọn kênh launch, và viết thông điệp ra mắt.',
      lessons: [
        {
          title: '2.1 — Launch again and again|||2.1 — Ra mắt lại nhiều lần',
          slug: 'exe201-2-1-launch-often',
          type: 'VIDEO',
          description: 'Triết lý launch liên tục của YC, các kiểu launch, và cách mỗi lần launch là một thí nghiệm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>There is no single "big launch"</h2>
<p class="lead">New founders imagine one dramatic launch day. Reality (per YC's "How to Launch"): you <strong>launch continuously</strong> — to a tiny group, learn, fix, launch wider. Each launch is an experiment, not a fireworks show. This is exactly what produces a growth curve for Outcome 3.</p>

<h3>Types of launch you can stack</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Silent launch</span> Quietly give it to 5-10 friendly users; fix the obvious breaks.</div>
<div class="lz-layer"><span class="lz-lk">Community launch</span> Post in one relevant group/community where your users already are.</div>
<div class="lz-layer"><span class="lz-lk">Content launch</span> A story/video showing the problem & your solution.</div>
<div class="lz-layer"><span class="lz-lk">Milestone re-launch</span> Each new feature/version = a reason to launch again.</div>
</div>

<h3>Worked example — a 6-week launch calendar</h3>
<div class="out"><strong>Wk 4:</strong> silent launch to 10 classmates. Fix top 3 issues.
<strong>Wk 5:</strong> post in one FPT community. Measure signups & activation.
<strong>Wk 6:</strong> a TikTok/Reels showing the core value. Watch which channel converts.
<strong>Wk 7:</strong> re-launch with the fix that feedback demanded.
<strong>Wk 8-9:</strong> double down on the channel that worked; report the curve.
<strong>Point:</strong> five small launches produce five data points and a rising line — infinitely better than one week-9 reveal.</div>

<div class="callout warn"><strong>Trap:</strong> holding the launch until it's "ready." It's never ready. A silent launch in week 4 to ten people is the single highest-value move you can make.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>"Launch when you're embarrassed, iterate in public."</b> Building in public — sharing progress, asking for feedback openly — turns spectators into your first users and creates its own small marketing loop. <em>Beyond the syllabus, but a modern launch tactic that compounds attention over the term.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Không có một "big launch" duy nhất</h2>
<p class="lead">Founder mới tưởng tượng một ngày ra mắt hoành tráng. Thực tế (theo "How to Launch" của YC): bạn <strong>launch liên tục</strong> — cho một nhóm bé, học, sửa, launch rộng hơn. Mỗi lần launch là một thí nghiệm, không phải màn pháo hoa. Đây chính là thứ tạo ra đường cong tăng trưởng cho Outcome 3.</p>

<h3>Các kiểu launch bạn có thể xếp chồng</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Launch im lặng</span> Lặng lẽ đưa cho 5-10 người dùng thân thiện; sửa những chỗ hỏng rõ ràng.</div>
<div class="lz-layer"><span class="lz-lk">Launch cộng đồng</span> Đăng trong một group/cộng đồng liên quan nơi người dùng đã ở đó.</div>
<div class="lz-layer"><span class="lz-lk">Launch nội dung</span> Một câu chuyện/video cho thấy vấn đề & giải pháp của bạn.</div>
<div class="lz-layer"><span class="lz-lk">Re-launch cột mốc</span> Mỗi tính năng/phiên bản mới = một lý do để launch lại.</div>
</div>

<h3>Ví dụ có lời giải — lịch launch 6 tuần</h3>
<div class="out"><strong>Tuần 4:</strong> launch im lặng cho 10 bạn cùng lớp. Sửa 3 vấn đề lớn nhất.
<strong>Tuần 5:</strong> đăng trong một cộng đồng FPT. Đo đăng ký & activation.
<strong>Tuần 6:</strong> một TikTok/Reels cho thấy giá trị lõi. Xem kênh nào chuyển đổi.
<strong>Tuần 7:</strong> re-launch với bản sửa mà phản hồi đòi.
<strong>Tuần 8-9:</strong> dồn lực vào kênh đã hiệu quả; báo cáo đường cong.
<strong>Ý:</strong> năm lần launch nhỏ tạo năm điểm dữ liệu và một đường đi lên — tốt hơn vô hạn so với một lần "trình làng" ở tuần 9.</div>

<div class="callout warn"><strong>Bẫy:</strong> giữ launch tới khi "sẵn sàng". Nó không bao giờ sẵn sàng. Một launch im lặng ở tuần 4 cho mười người là nước đi giá trị nhất bạn có thể làm.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>"Launch khi bạn thấy ngượng, lặp lại công khai."</b> Xây công khai — chia sẻ tiến độ, xin phản hồi cởi mở — biến người xem thành người dùng đầu tiên và tạo một vòng marketing nhỏ của riêng nó. <em>Ngoài syllabus, nhưng là chiến thuật launch hiện đại cộng dồn sự chú ý qua cả kỳ.</em></div>
</div>`,
        },
        {
          title: '2.2 — Choose channels & craft the message|||2.2 — Chọn kênh & viết thông điệp',
          slug: 'exe201-2-2-channels-message',
          type: 'VIDEO',
          description: 'Đi tới nơi khách hàng đã ở, chọn 1-2 kênh, và viết thông điệp launch rõ giá trị.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Go where your users already are</h2>
<p class="lead">Don't broadcast everywhere. Find the <strong>1-2 channels</strong> where your exact customer already gathers, and launch there with a message about <em>their</em> problem — not your features.</p>

<h3>Matching channels to your customer</h3>
<table>
<thead><tr><th>Customer</th><th>Where they already are</th></tr></thead>
<tbody>
<tr><td>FPT students</td><td>Campus Facebook/Zalo groups, class chats, TikTok</td></tr>
<tr><td>Local café owners</td><td>Owner communities, direct visits, Zalo</td></tr>
<tr><td>Gamers/hobbyists</td><td>Discord servers, subreddits, niche forums</td></tr>
<tr><td>Parents</td><td>Parent groups, school channels, Facebook</td></tr>
</tbody>
</table>

<h3>The launch message formula</h3>
<div class="out"><strong>Bad (feature-led):</strong> "We built an app with real-time matching and ratings!"
<strong>Good (problem-led):</strong> "Tired of getting scammed buying used textbooks? We made a safe, verified way to trade with other FPT students. Try it free — link in comments."
<strong>Formula:</strong> [their pain] → [the relief] → [one clear call to action]. Talk about them, not you.</div>

<div class="pitfall"><strong>Trap:</strong> spreading thin across 6 channels and doing none well. One channel done well (5 posts, real engagement, DMs answered) beats six channels touched once.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Bullseye framework (from <em>Traction</em>).</b> Gabriel Weinberg lists 19 traction channels; the method is to brainstorm all 19, pick the 3 most promising to test cheaply, then double down on the one that works. Systematic channel testing beats guessing. <em>Beyond the syllabus, but the framework that turns "let's post everywhere" into a real acquisition experiment for Outcome 2.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Tới nơi người dùng đã ở</h2>
<p class="lead">Đừng phát tán khắp nơi. Tìm <strong>1-2 kênh</strong> nơi đúng khách hàng của bạn đã tụ tập, và launch ở đó với một thông điệp về vấn đề <em>của họ</em> — không phải tính năng của bạn.</p>

<h3>Ghép kênh với khách hàng của bạn</h3>
<table>
<thead><tr><th>Khách hàng</th><th>Họ đã ở đâu</th></tr></thead>
<tbody>
<tr><td>Sinh viên FPT</td><td>Group Facebook/Zalo campus, chat lớp, TikTok</td></tr>
<tr><td>Chủ quán cà phê nhỏ</td><td>Cộng đồng chủ quán, ghé trực tiếp, Zalo</td></tr>
<tr><td>Game thủ/người có sở thích</td><td>Server Discord, subreddit, diễn đàn ngách</td></tr>
<tr><td>Phụ huynh</td><td>Group phụ huynh, kênh trường, Facebook</td></tr>
</tbody>
</table>

<h3>Công thức thông điệp launch</h3>
<div class="out"><strong>Tệ (dẫn bằng tính năng):</strong> "Bọn em xây một app có ghép thời gian thực và đánh giá!"
<strong>Tốt (dẫn bằng vấn đề):</strong> "Chán bị lừa khi mua giáo trình cũ? Bọn mình làm một cách an toàn, có xác thực để trao đổi với sinh viên FPT khác. Dùng thử miễn phí — link ở bình luận."
<strong>Công thức:</strong> [nỗi đau của họ] → [sự nhẹ nhõm] → [một lời kêu gọi hành động rõ ràng]. Nói về họ, không về bạn.</div>

<div class="pitfall"><strong>Bẫy:</strong> dàn mỏng trên 6 kênh và không làm tốt kênh nào. Một kênh làm tốt (5 bài, tương tác thật, trả lời DM) thắng sáu kênh chạm một lần.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Khung Bullseye (từ sách <em>Traction</em>).</b> Gabriel Weinberg liệt kê 19 kênh traction; phương pháp là brainstorm cả 19, chọn 3 kênh hứa hẹn nhất để thử rẻ, rồi dồn lực vào cái hiệu quả. Thử kênh có hệ thống thắng đoán mò. <em>Ngoài syllabus, nhưng là khung biến "đăng khắp nơi" thành một thí nghiệm acquisition thật cho Outcome 2.</em></div>
</div>`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 3 — 10 KHÁCH HÀNG ĐẦU TIÊN ══════════════════ */
    {
      title: 'Chapter 3 — Your first 10 customers|||Chương 3 — 10 khách hàng đầu tiên',
      description: 'Do things that don\'t scale: đi tìm tay từng người dùng đầu, onboard thủ công, và biến họ thành fan.',
      lessons: [
        {
          title: '3.1 — Do things that don\'t scale|||3.1 — Làm những việc không mở rộng được',
          slug: 'exe201-3-1-unscalable',
          type: 'VIDEO',
          description: 'Vì sao 10 khách đầu phải kiếm bằng tay, onboard thủ công, và chăm sóc quá mức.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Recruit your first users one by one</h2>
<p class="lead">Paul Graham's famous advice: <strong>"Do things that don't scale."</strong> Your first 10 customers won't come from clever automation — you get them by hand: message people directly, onboard them personally, deliver the value manually, and delight them beyond reason.</p>

<h3>How the first 10 actually happen</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Hunt</span> DM 30 specific people who have the problem; invite them personally.</div>
<div class="lz-layer"><span class="lz-lk">Onboard by hand</span> Walk each one through it; watch where they get stuck.</div>
<div class="lz-layer"><span class="lz-lk">Do it manually</span> If code isn't ready, you (the team) fulfil the value yourself.</div>
<div class="lz-layer"><span class="lz-lk">Overdeliver</span> Respond in minutes; fix their problem personally; make them feel special.</div>
</div>

<h3>Worked example — BookSwap's first 10 trades</h3>
<div class="out"><strong>Don't:</strong> post once and wait for magic.
<strong>Do:</strong> DM 30 students who complained about textbooks. Personally help each list an item. When two match, you (the team) message both, coordinate the handoff, follow up to confirm it went well.
<strong>Result:</strong> 10 completed trades, 10 delighted users who tell friends — and you learned exactly where the flow breaks. That hands-on data is Outcome 3 gold.</div>

<div class="callout ok"><strong>Why it works:</strong> ten users who love you beat a thousand who shrug. Word of mouth from a delighted few starts the growth loop; you can't manufacture that with ads.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The "manual concierge" doubles as research.</b> Doing the value by hand for your first users teaches you the real workflow, edge cases and objections — exactly what you'd otherwise discover the hard way after automating the wrong thing. <em>Beyond the syllabus, but why unscalable early work is an investment, not a waste.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Tuyển người dùng đầu tiên từng người một</h2>
<p class="lead">Lời khuyên nổi tiếng của Paul Graham: <strong>"Làm những việc không mở rộng được."</strong> 10 khách hàng đầu tiên sẽ không tới từ tự động hoá thông minh — bạn có họ bằng tay: nhắn tin trực tiếp, onboard đích thân, cung cấp giá trị thủ công, và chăm sóc họ quá mức hợp lý.</p>

<h3>10 người đầu thực sự đến thế nào</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Săn</span> DM 30 người cụ thể có vấn đề; mời đích thân họ.</div>
<div class="lz-layer"><span class="lz-lk">Onboard bằng tay</span> Dắt từng người qua nó; xem họ kẹt ở đâu.</div>
<div class="lz-layer"><span class="lz-lk">Làm thủ công</span> Nếu code chưa sẵn, bạn (cả đội) tự cung cấp giá trị.</div>
<div class="lz-layer"><span class="lz-lk">Chăm quá mức</span> Trả lời trong vài phút; sửa vấn đề đích thân; khiến họ thấy đặc biệt.</div>
</div>

<h3>Ví dụ có lời giải — 10 giao dịch đầu của BookSwap</h3>
<div class="out"><strong>Đừng:</strong> đăng một lần rồi chờ phép màu.
<strong>Hãy:</strong> DM 30 sinh viên từng than về giáo trình. Đích thân giúp mỗi người đăng một món. Khi hai người khớp, bạn (cả đội) nhắn cả hai, điều phối cuộc trao đổi, theo dõi để xác nhận nó ổn.
<strong>Kết quả:</strong> 10 giao dịch hoàn tất, 10 người dùng hài lòng rủ bạn bè — và bạn học chính xác chỗ luồng bị hỏng. Dữ liệu thực chiến đó là vàng cho Outcome 3.</div>

<div class="callout ok"><strong>Vì sao hiệu quả:</strong> mười người yêu bạn thắng một nghìn người nhún vai. Truyền miệng từ vài người hài lòng khởi động vòng tăng trưởng; bạn không chế ra điều đó bằng quảng cáo được.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>"Concierge thủ công" kiêm luôn nghiên cứu.</b> Làm giá trị bằng tay cho người dùng đầu dạy bạn quy trình thật, các ca biên và phản đối — đúng thứ mà nếu không bạn sẽ phát hiện theo cách khó khăn sau khi tự động hoá nhầm thứ. <em>Ngoài syllabus, nhưng là lý do công việc không-mở-rộng giai đoạn đầu là khoản đầu tư, không phải lãng phí.</em></div>
</div>`,
        },
        {
          title: '3.2 — Turn early users into fans & referrals|||3.2 — Biến người dùng đầu thành fan & giới thiệu',
          slug: 'exe201-3-2-fans-referrals',
          type: 'VIDEO',
          description: 'Cách tạo trải nghiệm "wow", xin phản hồi & giới thiệu, và khởi động vòng truyền miệng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Ten fans beat a thousand shrugs</h2>
<p class="lead">Growth starts with a small group who genuinely love the product. Your job in weeks 4-6 is to <strong>manufacture love</strong>: a wow experience, fast support, and an easy way for happy users to bring the next ones.</p>

<h3>The love loop</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Wow experience</div><div class="lz-d">first value fast · overdeliver</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Ask for feedback</div><div class="lz-d">"what almost stopped you?"</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Ask for referral</div><div class="lz-d">"know one friend with this problem?"</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">They bring the next</div><div class="lz-d">word of mouth ↺</div></div>
</div>

<h3>How to ask (scripts that work)</h3>
<ul>
<li><strong>Feedback:</strong> "What was confusing or almost made you quit?" (not "did you like it?")</li>
<li><strong>Referral:</strong> "Who's one friend that struggles with this too? Mind introducing us?"</li>
<li><strong>Testimonial:</strong> "Could you tell me in one line what changed for you?" — use it in your launch post.</li>
</ul>

<div class="callout ok"><strong>Outcome tie-in:</strong> a quote from a delighted early user ("saved me two weeks and 200k") is powerful evidence in Outcome 1 and 2. Collect these deliberately from day one.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>NPS &amp; the "very disappointed" test.</b> Ask users "how disappointed would you be if this disappeared?" If ≥40% say "very," you have early product-market fit; if not, keep improving before scaling acquisition. It tells you whether to pour fuel on the fire yet. <em>Beyond the syllabus, but the metric that says when to shift from love to growth.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Mười fan thắng một nghìn cái nhún vai</h2>
<p class="lead">Tăng trưởng bắt đầu từ một nhóm nhỏ thực sự yêu sản phẩm. Việc của bạn ở tuần 4-6 là <strong>chế tạo tình yêu</strong>: một trải nghiệm wow, hỗ trợ nhanh, và một cách dễ để người dùng vui mang tới người tiếp theo.</p>

<h3>Vòng lặp tình yêu</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Trải nghiệm wow</div><div class="lz-d">giá trị đầu nhanh · chăm quá mức</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Xin phản hồi</div><div class="lz-d">"cái gì suýt cản bạn?"</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Xin giới thiệu</div><div class="lz-d">"biết một người bạn có vấn đề này?"</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Họ mang người tiếp</div><div class="lz-d">truyền miệng ↺</div></div>
</div>

<h3>Cách hỏi (kịch bản hiệu quả)</h3>
<ul>
<li><strong>Phản hồi:</strong> "Cái gì gây khó hiểu hoặc suýt khiến bạn bỏ?" (không phải "bạn có thích không?")</li>
<li><strong>Giới thiệu:</strong> "Một người bạn nào cũng vật lộn với việc này? Giới thiệu bọn mình nhé?"</li>
<li><strong>Lời chứng thực:</strong> "Bạn kể một câu điều gì đã thay đổi với bạn?" — dùng nó trong bài launch.</li>
</ul>

<div class="callout ok"><strong>Gắn outcome:</strong> một câu trích từ người dùng đầu hài lòng ("tiết kiệm cho em hai tuần và 200k") là bằng chứng mạnh trong Outcome 1 và 2. Thu thập chúng có chủ đích từ ngày đầu.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>NPS &amp; phép thử "rất thất vọng".</b> Hỏi người dùng "bạn thất vọng đến mức nào nếu cái này biến mất?" Nếu ≥40% nói "rất", bạn có product-market fit sớm; nếu không, cứ cải thiện trước khi mở rộng acquisition. Nó cho bạn biết đã nên đổ dầu vào lửa chưa. <em>Ngoài syllabus, nhưng là chỉ số báo khi nào chuyển từ tình yêu sang tăng trưởng.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'YC\'s advice for getting your first users is:|||Lời khuyên của YC để có người dùng đầu tiên là:',
                options: [
                  'Automate acquisition immediately|||Tự động hoá acquisition ngay',
                  'Do things that don\'t scale (recruit them by hand)|||Làm những việc không mở rộng được (tuyển họ bằng tay)',
                  'Buy ads at large scale|||Mua quảng cáo quy mô lớn',
                  'Wait for word of mouth|||Chờ truyền miệng',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'When launching, you should target:|||Khi launch, bạn nên nhắm:',
                options: [
                  'As many channels as possible at once|||Càng nhiều kênh càng tốt cùng lúc',
                  '1-2 channels where your customer already gathers|||1-2 kênh nơi khách hàng đã tụ tập',
                  'Only paid advertising|||Chỉ quảng cáo trả phí',
                  'No channels; wait|||Không kênh nào; chờ',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'A good launch message is:|||Một thông điệp launch tốt là:',
                options: [
                  'Feature-led: lists what you built|||Dẫn bằng tính năng: liệt kê bạn xây gì',
                  'Problem-led: their pain → relief → one call to action|||Dẫn bằng vấn đề: nỗi đau của họ → nhẹ nhõm → một lời kêu gọi',
                  'A long technical description|||Một mô tả kỹ thuật dài',
                  'Only your company name|||Chỉ tên công ty bạn',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'The better feedback question is:|||Câu hỏi phản hồi tốt hơn là:',
                options: [
                  '"Did you like it?"|||"Bạn có thích không?"',
                  '"What was confusing or almost made you quit?"|||"Cái gì gây khó hiểu hoặc suýt khiến bạn bỏ?"',
                  '"Isn\'t it great?"|||"Nó tuyệt đúng không?"',
                  '"Would you recommend it?"|||"Bạn có giới thiệu nó không?"',
                ], correctIndex: 1,
              },
              {
                id: 'q5', points: 1,
                question: '(Beyond syllabus) The "very disappointed" test signals early PMF at roughly:|||(Ngoài giáo trình) Phép thử "rất thất vọng" báo PMF sớm ở khoảng:',
                options: ['≥10%', '≥40%', '≥90%', '0%'],
                correctIndex: 1,
              },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 4 — CÓ NGƯỜI DÙNG & TĂNG TRƯỞNG ══════════════════ */
    {
      title: 'Chapter 4 — Get users & grow|||Chương 4 — Có người dùng & tăng trưởng',
      description: 'Các kênh tăng trưởng, growth loops, và cách chọn một kênh để dồn lực (Traction 19 kênh).',
      lessons: [
        {
          title: '4.1 — Growth channels & growth loops|||4.1 — Kênh tăng trưởng & growth loops',
          slug: 'exe201-4-1-growth-channels',
          type: 'VIDEO',
          description: 'Ba loại tăng trưởng (viral/nội dung/trả phí), growth loop vs funnel, và chọn kênh chủ lực.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Grow through loops, not endless spending</h2>
<p class="lead">Following YC's "How to Get Users and Grow": the best growth <strong>compounds</strong> through loops, where each user's action helps bring the next — instead of a leaky funnel you must keep refilling with ads.</p>

<h3>Three engines of growth</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Viral</span> Users bring users — invites, sharing, network effects. Best for marketplaces/social.</div>
<div class="lz-layer"><span class="lz-lk">Content/SEO</span> You create posts/videos that attract users over time. Compounds slowly but free.</div>
<div class="lz-layer"><span class="lz-lk">Paid</span> Buy users with ads — only sustainable if LTV &gt; CAC.</div>
</div>

<h3>Loop vs funnel — why loops win</h3>
<div class="diagram">Funnel (one-way, leaky):  post → visit → signup → (most leave)
Loop (compounding):       user acts → brings another → more activity ↺</div>
<p>For BookSwap the loop is built-in: every trade needs two people, so each seller pulls in a buyer. Name your loop explicitly — it's a standout point in Outcome 2 and 3.</p>

<div class="callout ok"><strong>For a 10-week project:</strong> viral (referrals) + one content channel usually beats paid ads (you have no budget). Focus on making sharing natural and posting consistently on one channel.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The viral coefficient (k).</b> If each user brings on average k new users, then k &gt; 1 means self-sustaining growth; k &lt; 1 means growth fades without new input. Even a rough estimate ("each active user invited ~0.5 others") sharpens your growth story. <em>Beyond the syllabus, but the number that quantifies whether your loop actually loops.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Tăng trưởng qua vòng lặp, không phải chi tiền vô tận</h2>
<p class="lead">Theo "How to Get Users and Grow" của YC: tăng trưởng tốt nhất <strong>cộng dồn</strong> qua các vòng lặp, nơi hành động của mỗi người dùng giúp mang người tiếp theo — thay vì một phễu rò rỉ bạn phải liên tục đổ đầy bằng quảng cáo.</p>

<h3>Ba động cơ tăng trưởng</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Viral</span> Người dùng mang người dùng — mời, chia sẻ, hiệu ứng mạng. Tốt cho chợ/mạng xã hội.</div>
<div class="lz-layer"><span class="lz-lk">Nội dung/SEO</span> Bạn tạo bài/video thu hút người dùng theo thời gian. Cộng dồn chậm nhưng miễn phí.</div>
<div class="lz-layer"><span class="lz-lk">Trả phí</span> Mua người dùng bằng quảng cáo — chỉ bền nếu LTV &gt; CAC.</div>
</div>

<h3>Vòng vs phễu — vì sao vòng thắng</h3>
<div class="diagram">Phễu (một chiều, rò rỉ):  đăng → ghé → đăng ký → (đa số rời)
Vòng (cộng dồn):          người dùng hành động → mang người khác → thêm hoạt động ↺</div>
<p>Với BookSwap vòng lặp có sẵn: mỗi giao dịch cần hai người, nên mỗi người bán kéo vào một người mua. Gọi tên vòng của bạn rõ ràng — đó là điểm nổi bật trong Outcome 2 và 3.</p>

<div class="callout ok"><strong>Với một dự án 10 tuần:</strong> viral (giới thiệu) + một kênh nội dung thường thắng quảng cáo trả phí (bạn không có ngân sách). Tập trung làm chia sẻ trở nên tự nhiên và đăng đều trên một kênh.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Hệ số lan truyền (k).</b> Nếu mỗi người dùng mang trung bình k người mới, thì k &gt; 1 nghĩa là tăng trưởng tự duy trì; k &lt; 1 nghĩa là tăng trưởng tắt dần nếu không có đầu vào mới. Kể cả ước lượng thô ("mỗi người dùng tích cực mời ~0,5 người") cũng làm sắc câu chuyện tăng trưởng. <em>Ngoài syllabus, nhưng là con số định lượng liệu vòng của bạn có thật sự lặp không.</em></div>
</div>`,
        },
        {
          title: '4.2 — Pick one channel and double down|||4.2 — Chọn một kênh và dồn lực',
          slug: 'exe201-4-2-one-channel',
          type: 'VIDEO',
          description: 'Vì sao dồn một kênh thắng dàn mỏng, cách thử rẻ rồi tăng cường (Bullseye).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>One channel that works beats five that sort-of do</h2>
<p class="lead">Most early startups grow through <strong>one dominant channel</strong>, not ten. The method (Bullseye, from <em>Traction</em>): brainstorm many channels, cheaply test the 2-3 most promising, then pour your effort into the one that actually converts.</p>

<h3>Test cheap, then commit</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Brainstorm</div><div class="lz-d">list all plausible channels</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Cheap tests</div><div class="lz-d">small effort on top 2-3</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Measure</div><div class="lz-d">which gives real signups/activation?</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Double down</div><div class="lz-d">focus effort on the winner</div></div>
</div>

<h3>Worked example — finding BookSwap's channel</h3>
<div class="out"><strong>Test week (each ~2 hours):</strong>
• Facebook group post → 40 clicks, 12 signups.
• TikTok video → 2,000 views, 8 signups.
• Class-rep shoutout → 25 signups from 1 message.
<strong>Read the data:</strong> class-rep referrals convert far best per effort. → double down: recruit reps across campuses. Don't keep splitting time equally across all three.</div>

<div class="pitfall"><strong>Trap:</strong> "we did a bit of everything." Graders (and reality) reward one channel with real traction over six channels with a handful of likes each.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Channel-market fit changes over time.</b> The channel that gets your first 100 users often isn't the one that gets your next 10,000. Re-run the Bullseye test as you grow; don't marry your first channel forever. <em>Beyond the syllabus, but why growth is a series of channel experiments, not one fixed tactic.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Một kênh hiệu quả thắng năm kênh nửa vời</h2>
<p class="lead">Hầu hết startup giai đoạn đầu tăng trưởng qua <strong>một kênh chủ lực</strong>, không phải mười. Phương pháp (Bullseye, từ <em>Traction</em>): brainstorm nhiều kênh, thử rẻ 2-3 kênh hứa hẹn nhất, rồi dồn công sức vào cái thực sự chuyển đổi.</p>

<h3>Thử rẻ, rồi cam kết</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Brainstorm</div><div class="lz-d">liệt kê mọi kênh hợp lý</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Thử rẻ</div><div class="lz-d">công sức nhỏ trên 2-3 kênh top</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Đo</div><div class="lz-d">cái nào cho đăng ký/activation thật?</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Dồn lực</div><div class="lz-d">tập trung vào kênh thắng</div></div>
</div>

<h3>Ví dụ có lời giải — tìm kênh của BookSwap</h3>
<div class="out"><strong>Tuần thử (mỗi cái ~2 giờ):</strong>
• Bài đăng group Facebook → 40 lượt bấm, 12 đăng ký.
• Video TikTok → 2.000 lượt xem, 8 đăng ký.
• Lớp trưởng hô hào → 25 đăng ký từ 1 tin nhắn.
<strong>Đọc dữ liệu:</strong> giới thiệu qua lớp trưởng chuyển đổi tốt nhất trên mỗi công sức. → dồn lực: tuyển lớp trưởng khắp các campus. Đừng cứ chia thời gian đều cho cả ba.</div>

<div class="pitfall"><strong>Bẫy:</strong> "bọn em làm mỗi thứ một ít." Người chấm (và thực tế) thưởng một kênh có traction thật hơn sáu kênh mỗi cái vài like.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Channel-market fit thay đổi theo thời gian.</b> Kênh đưa 100 người dùng đầu thường không phải kênh đưa 10.000 người tiếp theo. Chạy lại phép thử Bullseye khi bạn lớn; đừng cưới kênh đầu tiên mãi mãi. <em>Ngoài syllabus, nhưng là lý do tăng trưởng là một chuỗi thí nghiệm kênh, không phải một chiến thuật cố định.</em></div>
</div>`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 5 — BÁN HÀNG ══════════════════ */
    {
      title: 'Chapter 5 — How to sell|||Chương 5 — Bán hàng',
      description: 'Bán không phải thao túng: nói chuyện với khách, xử lý phản đối, định giá, và chốt.',
      lessons: [
        {
          title: '5.1 — Selling is helping, not manipulating|||5.1 — Bán là giúp, không phải thao túng',
          slug: 'exe201-5-1-selling',
          type: 'VIDEO',
          description: 'Tư duy bán đúng, cấu trúc một cuộc trò chuyện bán, và xử lý phản đối phổ biến.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Great selling is great listening</h2>
<p class="lead">Founders often fear "selling." But early sales isn't slick persuasion — it's <strong>understanding a customer's problem so well that the right solution is obvious</strong>. You listen more than you talk, and you only "close" when it genuinely helps them.</p>

<h3>A simple sales conversation structure</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">1 · Understand</span> Ask about their situation & pain (Mom Test style). Listen.</div>
<div class="lz-layer"><span class="lz-lk">2 · Connect</span> Reflect their pain back; show you get it.</div>
<div class="lz-layer"><span class="lz-lk">3 · Show</span> Present your solution specifically to THAT pain, not a generic pitch.</div>
<div class="lz-layer"><span class="lz-lk">4 · Handle objections</span> Answer honestly; don't fight, clarify.</div>
<div class="lz-layer"><span class="lz-lk">5 · Ask</span> Make a clear, small next-step ask ("want to try it this week?").</div>
</div>

<h3>Common objections & honest responses</h3>
<table>
<thead><tr><th>Objection</th><th>Honest response</th></tr></thead>
<tbody>
<tr><td>"It's too expensive."</td><td>"Compared to what? Here's what the current pain costs you."</td></tr>
<tr><td>"I don't have time."</td><td>"It takes 2 minutes and saves you an hour — want me to set it up?"</td></tr>
<tr><td>"I already use X."</td><td>"What frustrates you about X?" (find the gap you fill)</td></tr>
<tr><td>"Let me think about it."</td><td>"Sure — what's the one thing you're unsure about?"</td></tr>
</tbody>
</table>

<div class="callout ok"><strong>Outcome tie-in:</strong> even a service/free product needs "selling" — convincing users to try and stay. Documenting how you closed your first users is strong Outcome 2 material.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Sell the outcome, not the product.</b> People don't buy a drill; they buy a hole in the wall. Sell "you'll never get scammed on textbooks again," not "a marketplace with ratings." Framing benefit over feature is the core of persuasion. <em>Beyond the syllabus, but the single biggest lever in any pitch or sale.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Bán giỏi là lắng nghe giỏi</h2>
<p class="lead">Founder thường sợ "bán hàng". Nhưng bán giai đoạn đầu không phải thuyết phục trơn tru — nó là <strong>hiểu vấn đề của khách hàng kỹ đến mức giải pháp đúng trở nên hiển nhiên</strong>. Bạn lắng nghe nhiều hơn nói, và chỉ "chốt" khi nó thực sự giúp họ.</p>

<h3>Cấu trúc một cuộc trò chuyện bán đơn giản</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">1 · Hiểu</span> Hỏi về tình huống & nỗi đau của họ (kiểu Mom Test). Lắng nghe.</div>
<div class="lz-layer"><span class="lz-lk">2 · Kết nối</span> Phản chiếu lại nỗi đau; cho thấy bạn hiểu.</div>
<div class="lz-layer"><span class="lz-lk">3 · Trình bày</span> Trình bày giải pháp cụ thể cho ĐÚNG nỗi đau đó, không pitch chung chung.</div>
<div class="lz-layer"><span class="lz-lk">4 · Xử lý phản đối</span> Trả lời trung thực; đừng cãi, hãy làm rõ.</div>
<div class="lz-layer"><span class="lz-lk">5 · Mời</span> Đưa một lời mời bước-tiếp nhỏ, rõ ("muốn thử tuần này không?").</div>
</div>

<h3>Phản đối phổ biến & phản hồi trung thực</h3>
<table>
<thead><tr><th>Phản đối</th><th>Phản hồi trung thực</th></tr></thead>
<tbody>
<tr><td>"Đắt quá."</td><td>"So với cái gì? Đây là nỗi đau hiện tại đang tốn của bạn bao nhiêu."</td></tr>
<tr><td>"Tôi không có thời gian."</td><td>"Mất 2 phút và tiết kiệm cho bạn một giờ — để mình set up cho nhé?"</td></tr>
<tr><td>"Tôi đã dùng X rồi."</td><td>"X làm bạn bực điều gì?" (tìm khoảng trống bạn lấp)</td></tr>
<tr><td>"Để tôi suy nghĩ đã."</td><td>"Được — điều duy nhất bạn còn phân vân là gì?"</td></tr>
</tbody>
</table>

<div class="callout ok"><strong>Gắn outcome:</strong> kể cả một dịch vụ/sản phẩm miễn phí cũng cần "bán" — thuyết phục người dùng thử và ở lại. Ghi lại cách bạn chốt những người dùng đầu là tư liệu Outcome 2 mạnh.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Bán kết quả, không bán sản phẩm.</b> Người ta không mua cái khoan; họ mua cái lỗ trên tường. Bán "bạn sẽ không bao giờ bị lừa mua giáo trình nữa", không bán "một chợ có đánh giá". Đóng khung lợi ích thay vì tính năng là cốt lõi của thuyết phục. <em>Ngoài syllabus, nhưng là đòn bẩy lớn nhất trong mọi pitch hay cuộc bán.</em></div>
</div>`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 6 — KPI & PHÂN TÍCH PHẢN HỒI ══════════════════ */
    {
      title: 'Chapter 6 — KPIs, metrics & analyzing feedback|||Chương 6 — KPI, chỉ số & phân tích phản hồi',
      description: 'Đặt KPI/mục tiêu, đọc chỉ số (activation/retention/cohort), và biến phản hồi kênh thành cải tiến (CLO4).',
      lessons: [
        {
          title: '6.1 — Set KPIs & read the right metrics|||6.1 — Đặt KPI & đọc đúng chỉ số',
          slug: 'exe201-6-1-kpis',
          type: 'VIDEO',
          description: 'Đặt mục tiêu SMART, chọn chỉ số thật (không phù phiếm), và đọc phễu AARRR.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Pick goals you can actually move</h2>
<p class="lead">Following YC's "How to Set KPIs and Goals": choose <strong>one primary metric</strong> that reflects real value, set a concrete weekly target, and review it every week. Vanity metrics (likes, impressions) feel good but don't reflect value — track <em>activation</em> and <em>retention</em> instead.</p>

<h3>Vanity vs real metrics</h3>
<table>
<thead><tr><th>❌ Vanity (feels good)</th><th>✅ Real (reflects value)</th></tr></thead>
<tbody>
<tr><td>Total signups / followers</td><td>Activation: % who did the core action</td></tr>
<tr><td>Page views / impressions</td><td>Retention: % who came back next week</td></tr>
<tr><td>Likes</td><td>Referral: users who invited others</td></tr>
</tbody>
</table>

<h3>Worked example — a SMART weekly KPI</h3>
<div class="out"><strong>Vague:</strong> "get more users."
<strong>SMART:</strong> "By end of week 6, reach 50 activated users (listed an item) and ≥30% week-1 retention."
<strong>Why better:</strong> Specific, Measurable, Achievable, Relevant, Time-bound. You'll know Friday whether you hit it, and it points at a real behavior, not a vanity number.</div>

<h3>The AARRR funnel (pirate metrics)</h3>
<div class="diagram">Acquisition → Activation → Retention → Referral → Revenue
   found you     first value    came back    invited     paid</div>
<p>For Outcome 3, report at least Acquisition → Activation → Retention with real counts and a weekly trend.</p>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The North Star Metric.</b> Mature teams pick one metric that best captures delivered value (e.g. "weekly completed trades") and align everything to grow it. It prevents optimizing sub-metrics that don't matter. <em>Beyond the syllabus, but the concept that keeps a growing team pointed the same way.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Chọn mục tiêu bạn thực sự làm di chuyển được</h2>
<p class="lead">Theo "How to Set KPIs and Goals" của YC: chọn <strong>một chỉ số chính</strong> phản ánh giá trị thật, đặt một mục tiêu tuần cụ thể, và xem lại mỗi tuần. Chỉ số phù phiếm (like, lượt hiển thị) cảm giác dễ chịu nhưng không phản ánh giá trị — hãy theo dõi <em>activation</em> và <em>retention</em>.</p>

<h3>Phù phiếm vs chỉ số thật</h3>
<table>
<thead><tr><th>❌ Phù phiếm (cảm giác đẹp)</th><th>✅ Thật (phản ánh giá trị)</th></tr></thead>
<tbody>
<tr><td>Tổng đăng ký / người theo dõi</td><td>Activation: % làm hành động lõi</td></tr>
<tr><td>Lượt xem trang / hiển thị</td><td>Retention: % quay lại tuần sau</td></tr>
<tr><td>Lượt thích</td><td>Referral: người dùng đã mời người khác</td></tr>
</tbody>
</table>

<h3>Ví dụ có lời giải — một KPI tuần SMART</h3>
<div class="out"><strong>Mơ hồ:</strong> "có thêm người dùng."
<strong>SMART:</strong> "Cuối tuần 6, đạt 50 người dùng đã activation (đã đăng một món) và retention tuần-1 ≥30%."
<strong>Vì sao tốt hơn:</strong> Cụ thể, Đo được, Khả thi, Liên quan, Có hạn. Thứ Sáu bạn sẽ biết mình đạt chưa, và nó trỏ vào một hành vi thật, không phải con số phù phiếm.</div>

<h3>Phễu AARRR (chỉ số hải tặc)</h3>
<div class="diagram">Acquisition → Activation → Retention → Referral → Revenue
   tìm ra bạn    giá trị đầu    quay lại     mời        trả tiền</div>
<p>Cho Outcome 3, báo cáo ít nhất Acquisition → Activation → Retention với số đếm thật và xu hướng hàng tuần.</p>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>North Star Metric (chỉ số sao Bắc Đẩu).</b> Đội chín chọn một chỉ số nắm bắt tốt nhất giá trị đã trao (vd "số giao dịch hoàn tất hàng tuần") và căn mọi thứ để làm nó tăng. Nó ngăn tối ưu các chỉ số con không quan trọng. <em>Ngoài syllabus, nhưng là khái niệm giữ một đội đang lớn trỏ cùng một hướng.</em></div>
</div>`,
        },
        {
          title: '6.2 — Analyze channel feedback → improve (CLO4)|||6.2 — Phân tích phản hồi kênh → cải tiến (CLO4)',
          slug: 'exe201-6-2-analyze-feedback',
          type: 'VIDEO',
          description: 'Thu phản hồi từ nhiều kênh, tìm mẫu hình, và biến insight thành thay đổi có đo được (before/after).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>Feedback is only useful when it changes something</h2>
<p class="lead">CLO4 is literally "analyze feedback from the channels." Collecting feedback isn't enough — you must find patterns, decide a change, ship it, and measure the effect. That before→change→after loop is the heart of Outcome 3.</p>

<h3>Where feedback comes from</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Direct</span> User interviews, DMs, support chats, survey after use.</div>
<div class="lz-layer"><span class="lz-lk">Behavioral</span> Analytics: where do users drop off? which step loses them?</div>
<div class="lz-layer"><span class="lz-lk">Channel</span> Comments, replies, reviews on each launch channel.</div>
<div class="lz-layer"><span class="lz-lk">Passive</span> Refunds, uninstalls, no-return users (the loudest silence).</div>
</div>

<h3>Worked example — turning feedback into a win</h3>
<div class="out"><strong>Signal:</strong> analytics show 60% of new users drop at the "list an item" step; DMs say "the form was confusing."
<strong>Analysis:</strong> onboarding friction, not lack of interest.
<strong>Change:</strong> cut the form from 8 fields to 3; add an example.
<strong>Measure:</strong> next cohort's drop-off falls from 60% → 25%; retention rises.
<strong>Outcome 3 story:</strong> "We saw drop-off, feedback said the form was confusing, we simplified it, activation more than doubled." That narrative is exactly what earns a top mark.</div>

<div class="callout warn"><strong>Trap:</strong> collecting feedback but never closing the loop. A folder of survey answers with no change made scores low. One clear "we changed X because of feedback Y, and Z improved" beats a hundred uncounted comments.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Cohort analysis reveals the truth.</b> Group users by the week they joined and track each group's retention over time. It shows whether your <em>changes</em> actually improved retention for newer users — something a single aggregate number hides. <em>Beyond the syllabus, but the analysis that proves your improvements worked, not just that totals grew.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Phản hồi chỉ hữu ích khi nó thay đổi điều gì đó</h2>
<p class="lead">CLO4 đúng nghĩa đen là "phân tích phản hồi từ các kênh". Thu phản hồi thôi chưa đủ — bạn phải tìm mẫu hình, quyết một thay đổi, ship nó, và đo tác động. Vòng trước→thay đổi→sau đó là trái tim của Outcome 3.</p>

<h3>Phản hồi đến từ đâu</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Trực tiếp</span> Phỏng vấn người dùng, DM, chat hỗ trợ, khảo sát sau khi dùng.</div>
<div class="lz-layer"><span class="lz-lk">Hành vi</span> Analytics: người dùng rơi rụng ở đâu? bước nào làm mất họ?</div>
<div class="lz-layer"><span class="lz-lk">Kênh</span> Bình luận, trả lời, đánh giá trên mỗi kênh launch.</div>
<div class="lz-layer"><span class="lz-lk">Thụ động</span> Hoàn tiền, gỡ cài, người dùng không quay lại (sự im lặng lớn nhất).</div>
</div>

<h3>Ví dụ có lời giải — biến phản hồi thành một chiến thắng</h3>
<div class="out"><strong>Tín hiệu:</strong> analytics cho thấy 60% người dùng mới rơi ở bước "đăng một món"; DM nói "cái form khó hiểu".
<strong>Phân tích:</strong> ma sát onboarding, không phải thiếu quan tâm.
<strong>Thay đổi:</strong> cắt form từ 8 trường xuống 3; thêm một ví dụ.
<strong>Đo:</strong> tỷ lệ rơi của cohort tiếp theo giảm từ 60% → 25%; retention tăng.
<strong>Câu chuyện Outcome 3:</strong> "Bọn em thấy rơi rụng, phản hồi nói form khó hiểu, bọn em đơn giản hoá, activation tăng hơn gấp đôi." Câu chuyện đó chính là thứ ăn điểm cao.</div>

<div class="callout warn"><strong>Bẫy:</strong> thu phản hồi nhưng không bao giờ khép vòng. Một thư mục câu trả lời khảo sát mà không có thay đổi nào thì điểm thấp. Một câu rõ "bọn em đổi X vì phản hồi Y, và Z cải thiện" thắng một trăm bình luận không được đếm.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Phân tích cohort hé lộ sự thật.</b> Nhóm người dùng theo tuần họ tham gia và theo dõi retention của từng nhóm theo thời gian. Nó cho thấy các <em>thay đổi</em> của bạn có thực sự cải thiện retention cho người dùng mới hơn không — điều mà một con số tổng gộp che giấu. <em>Ngoài syllabus, nhưng là phân tích chứng minh cải tiến của bạn hiệu quả, không chỉ tổng tăng.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'Which is a vanity metric?|||Cái nào là chỉ số phù phiếm?',
                options: [
                  'Week-over-week retention|||Retention tuần-qua-tuần',
                  'Total followers / likes|||Tổng người theo dõi / lượt thích',
                  'Activation rate|||Tỷ lệ activation',
                  'Completed core actions|||Số hành động lõi hoàn tất',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'To satisfy CLO4, collecting feedback must be followed by:|||Để thoả CLO4, thu phản hồi phải kèm theo:',
                options: [
                  'Storing it and moving on|||Lưu lại và bỏ qua',
                  'Finding patterns, making a change, and measuring the effect|||Tìm mẫu hình, tạo thay đổi, và đo tác động',
                  'Ignoring negative feedback|||Bỏ qua phản hồi tiêu cực',
                  'Only counting likes|||Chỉ đếm like',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'A SMART KPI is:|||Một KPI SMART là:',
                options: [
                  '"Get more users"|||"Có thêm người dùng"',
                  '"50 activated users and ≥30% week-1 retention by week 6"|||"50 người dùng activation và retention tuần-1 ≥30% vào tuần 6"',
                  '"Be successful"|||"Thành công"',
                  '"Lots of likes"|||"Nhiều like"',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'In AARRR, "Activation" means:|||Trong AARRR, "Activation" nghĩa là:',
                options: [
                  'They found you|||Họ tìm ra bạn',
                  'A new user completed the first core value action|||Người dùng mới hoàn tất hành động giá trị lõi đầu tiên',
                  'They paid|||Họ trả tiền',
                  'They uninstalled|||Họ gỡ cài',
                ], correctIndex: 1,
              },
              {
                id: 'q5', points: 1,
                question: '(Beyond syllabus) Cohort analysis groups users by:|||(Ngoài giáo trình) Phân tích cohort nhóm người dùng theo:',
                options: [
                  'Their favorite color|||Màu yêu thích của họ',
                  'The period they joined, to compare retention over time|||Giai đoạn họ tham gia, để so retention theo thời gian',
                  'Random assignment|||Gán ngẫu nhiên',
                  'Alphabetical order|||Thứ tự bảng chữ cái',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 7 — ÔN THI / BA OUTCOME ══════════════════ */
    {
      title: 'Chapter 7 — Outcome deliverables & Q&A defense|||Chương 7 — Ba outcome & bảo vệ Q&A',
      description: 'Chương ÔN THI: cách trình bày ba outcome (demo sản phẩm 40%, kế hoạch acquisition 20%, báo cáo tăng trưởng 40%) + ngân hàng câu hỏi phản biện theo CLO.',
      lessons: [
        {
          title: '7.1 — Nailing the three outcomes|||7.1 — Ăn điểm ba outcome',
          slug: 'exe201-7-1-outcomes',
          type: 'article',
          description: 'Cấu trúc và kịch bản demo cho từng outcome: product demo, acquisition plan, growth report.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1 · Exam prep</span>
<h2>Present each outcome to win its points</h2>
<p class="lead">Your grade is three outcomes. Present each deliberately — a live shipped thing, a concrete plan, and a growth story with a chart.</p>

<h3>Outcome 1 — Product/service demo (40%, CLO1)</h3>
<ul>
<li>Run the <strong>core loop live</strong> as a real user, end-to-end (have a backup video).</li>
<li>Narrate the value, not the buttons: "watch a trade complete safely in 30 seconds."</li>
<li>Show it's <strong>real</strong>: real data, real users have touched it.</li>
</ul>

<h3>Outcome 2 — Customer acquisition plan (20%, CLO2)</h3>
<ul>
<li>Name your <strong>target customer</strong> and where they gather.</li>
<li>Show your <strong>channels</strong>, the message, and the funnel (acquisition → activation).</li>
<li>Include <strong>first results</strong> from channel tests — not just a plan on paper.</li>
</ul>

<h3>Outcome 3 — Growth report (40%, CLO3+4)</h3>
<ul>
<li>Show you <strong>launched on real channels</strong> (evidence: posts, links, screenshots).</li>
<li>A <strong>weekly growth chart</strong> (acquisition/activation/retention going up).</li>
<li>A <strong>feedback→change→result</strong> story (the before/after loop).</li>
</ul>

<div class="callout ok"><strong>The through-line:</strong> across all three, the graders want to see a <em>real thing that real people used, that you grew and improved from evidence</em>. Every claim backed by a number or a screenshot.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>One slide, one number, one image per point.</b> The most memorable outcome presentations reduce each claim to a single chart or screenshot. Judges remember "activation doubled after we simplified onboarding" — a sentence + a chart — far longer than a paragraph. <em>Beyond the syllabus, but the presentation discipline that lifts an average outcome to a high one.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1 · Ôn thi</span>
<h2>Trình bày từng outcome để ăn điểm của nó</h2>
<p class="lead">Điểm của bạn là ba outcome. Trình bày từng cái có chủ đích — một thứ đã ship chạy trực tiếp, một kế hoạch cụ thể, và một câu chuyện tăng trưởng có biểu đồ.</p>

<h3>Outcome 1 — Demo sản phẩm/dịch vụ (40%, CLO1)</h3>
<ul>
<li>Chạy <strong>vòng lõi trực tiếp</strong> như một người dùng thật, từ đầu đến cuối (có video dự phòng).</li>
<li>Kể giá trị, không kể nút: "xem một giao dịch hoàn tất an toàn trong 30 giây."</li>
<li>Cho thấy nó <strong>thật</strong>: dữ liệu thật, người dùng thật đã chạm.</li>
</ul>

<h3>Outcome 2 — Kế hoạch thu hút khách (20%, CLO2)</h3>
<ul>
<li>Gọi tên <strong>khách hàng mục tiêu</strong> và nơi họ tụ tập.</li>
<li>Cho thấy <strong>kênh</strong>, thông điệp, và phễu (acquisition → activation).</li>
<li>Kèm <strong>kết quả đầu tiên</strong> từ thử kênh — không chỉ kế hoạch trên giấy.</li>
</ul>

<h3>Outcome 3 — Báo cáo tăng trưởng (40%, CLO3+4)</h3>
<ul>
<li>Cho thấy bạn <strong>đã launch trên kênh thật</strong> (bằng chứng: bài đăng, link, ảnh chụp).</li>
<li>Một <strong>biểu đồ tăng trưởng hàng tuần</strong> (acquisition/activation/retention đi lên).</li>
<li>Một câu chuyện <strong>phản hồi→thay đổi→kết quả</strong> (vòng trước/sau).</li>
</ul>

<div class="callout ok"><strong>Mạch xuyên suốt:</strong> qua cả ba, người chấm muốn thấy một <em>thứ thật mà người thật đã dùng, mà bạn tăng trưởng và cải tiến từ bằng chứng</em>. Mỗi tuyên bố có một con số hoặc một ảnh chụp đỡ.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Một slide, một con số, một hình cho mỗi ý.</b> Những buổi trình bày outcome đáng nhớ nhất rút mỗi tuyên bố thành một biểu đồ hoặc ảnh chụp duy nhất. Giám khảo nhớ "activation tăng gấp đôi sau khi bọn em đơn giản hoá onboarding" — một câu + một biểu đồ — lâu hơn hẳn một đoạn văn. <em>Ngoài syllabus, nhưng là kỷ luật trình bày nâng một outcome trung bình lên cao.</em></div>
</div>`,
        },
        {
          title: '7.2 — Q&A defense bank (by CLO)|||7.2 — Ngân hàng câu hỏi phản biện (theo CLO)',
          slug: 'exe201-7-2-qa-bank',
          type: 'article',
          description: 'Ngân hàng câu hỏi giám khảo hay hỏi ở EXE201, nhóm theo CLO, kèm cách trả lời bằng dữ liệu.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2 · Exam prep</span>
<h2>Prepare the questions before they're asked</h2>
<p class="lead">Rehearse a crisp, data-backed answer for each. Golden rule: <strong>answer with a number or a screenshot, not an opinion.</strong></p>

<h3>CLO1 — the product</h3>
<ul>
<li>"Is this actually built and used, or just a mockup?"</li>
<li>"Show me a real user completing the core action."</li>
<li>"What did you cut to ship on time, and why?"</li>
</ul>
<h3>CLO2 — customer acquisition</h3>
<ul>
<li>"Exactly which channel gets you users, and what does it cost?"</li>
<li>"Who is your customer and where do they already gather?"</li>
<li>"What's your funnel: of 100 who see it, how many activate?"</li>
</ul>
<h3>CLO3 — launch</h3>
<ul>
<li>"When and where did you launch? Show the evidence."</li>
<li>"How many times did you launch/iterate over the term?"</li>
<li>"What's your growth trend week over week?"</li>
</ul>
<h3>CLO4 — feedback analysis</h3>
<ul>
<li>"What did the data tell you, and what did you change because of it?"</li>
<li>"Show a before/after where feedback improved a metric."</li>
<li>"What's the biggest thing users complain about, and your plan?"</li>
</ul>

<div class="callout ok"><strong>Answer formula:</strong> (1) direct answer → (2) the number/screenshot → (3) what you'd do next. E.g. "Class-rep referrals — 25 signups from one message, ~0 cost; next we'd recruit reps on two more campuses."</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>"Here's what surprised us" earns trust.</b> Judges reward teams that were genuinely changed by their data. Sharing a surprise ("we assumed TikTok would win; class reps crushed it") signals you actually ran experiments and learned — the exact maturity EXE201 grades. <em>Beyond the syllabus, but the move that turns a Q&A into a credibility win.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2 · Ôn thi</span>
<h2>Chuẩn bị câu hỏi trước khi bị hỏi</h2>
<p class="lead">Tập một câu trả lời sắc gọn, có dữ liệu đỡ cho mỗi câu. Quy tắc vàng: <strong>trả lời bằng một con số hoặc ảnh chụp, không bằng ý kiến.</strong></p>

<h3>CLO1 — sản phẩm</h3>
<ul>
<li>"Cái này thực sự đã xây và được dùng, hay chỉ là mockup?"</li>
<li>"Cho tôi xem một người dùng thật hoàn tất hành động lõi."</li>
<li>"Bạn đã cắt gì để ship đúng hạn, và vì sao?"</li>
</ul>
<h3>CLO2 — thu hút khách hàng</h3>
<ul>
<li>"Chính xác kênh nào đem người dùng về, và tốn gì?"</li>
<li>"Khách hàng của bạn là ai và họ đã tụ tập ở đâu?"</li>
<li>"Phễu của bạn: trong 100 người thấy nó, bao nhiêu activation?"</li>
</ul>
<h3>CLO3 — launch</h3>
<ul>
<li>"Bạn launch khi nào và ở đâu? Cho xem bằng chứng."</li>
<li>"Bạn launch/lặp bao nhiêu lần trong kỳ?"</li>
<li>"Xu hướng tăng trưởng tuần-qua-tuần của bạn thế nào?"</li>
</ul>
<h3>CLO4 — phân tích phản hồi</h3>
<ul>
<li>"Dữ liệu nói gì với bạn, và bạn đã đổi gì vì nó?"</li>
<li>"Cho xem một before/after nơi phản hồi cải thiện một chỉ số."</li>
<li>"Điều người dùng phàn nàn nhất là gì, và kế hoạch của bạn?"</li>
</ul>

<div class="callout ok"><strong>Công thức trả lời:</strong> (1) trả lời thẳng → (2) con số/ảnh chụp → (3) bước tiếp. Vd: "Giới thiệu qua lớp trưởng — 25 đăng ký từ một tin nhắn, chi phí ~0; tiếp theo bọn em sẽ tuyển lớp trưởng ở hai campus nữa."</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>"Đây là điều làm bọn em bất ngờ" tạo niềm tin.</b> Giám khảo thưởng đội thực sự bị dữ liệu thay đổi. Chia sẻ một bất ngờ ("bọn em tưởng TikTok sẽ thắng; lớp trưởng lại đè bẹp") cho thấy bạn thực sự chạy thí nghiệm và học — đúng độ chín mà EXE201 chấm. <em>Ngoài syllabus, nhưng là nước đi biến Q&A thành điểm cộng uy tín.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'Outcome 1 (40%) is graded on:|||Outcome 1 (40%) được chấm dựa trên:',
                options: [
                  'A slide describing a future product|||Một slide mô tả sản phẩm tương lai',
                  'A real, built product/service demonstrated live|||Một sản phẩm/dịch vụ thật, đã xây, demo trực tiếp',
                  'The size of your team|||Quy mô đội',
                  'A written business plan only|||Chỉ một kế hoạch kinh doanh viết',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'The strongest Outcome 3 growth report includes:|||Báo cáo tăng trưởng Outcome 3 mạnh nhất bao gồm:',
                options: [
                  'A big number of likes|||Một số lượng like lớn',
                  'A weekly growth chart + a feedback→change→result story|||Một biểu đồ tăng trưởng hàng tuần + câu chuyện phản hồi→thay đổi→kết quả',
                  'No data, just a plan|||Không dữ liệu, chỉ kế hoạch',
                  'A long feature list|||Một danh sách tính năng dài',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'When asked "which channel gets you users?", the best answer:|||Khi bị hỏi "kênh nào đem người dùng về?", câu trả lời tốt nhất:',
                options: [
                  'Names all channels vaguely|||Kể mơ hồ mọi kênh',
                  'Gives the specific channel + its numbers + cost|||Nêu kênh cụ thể + con số + chi phí',
                  'Says "social media"|||Nói "mạng xã hội"',
                  'Avoids the question|||Né câu hỏi',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'A safeguard for a live demo is:|||Một biện pháp an toàn cho demo trực tiếp là:',
                options: [
                  'Never demo|||Đừng bao giờ demo',
                  'A backup recorded video/screenshots|||Một video quay/ảnh chụp dự phòng',
                  'Improvise everything|||Ứng biến mọi thứ',
                  'Demo every feature|||Demo mọi tính năng',
                ], correctIndex: 1,
              },
              {
                id: 'q5', points: 1,
                question: 'The Q&A answer formula is:|||Công thức trả lời Q&A là:',
                options: [
                  'Opinion → guess|||Ý kiến → đoán',
                  'Direct answer → number/screenshot → next step|||Trả lời thẳng → con số/ảnh chụp → bước tiếp',
                  'Talk until time runs out|||Nói tới hết giờ',
                  'Deflect|||Né tránh',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 8 — NÂNG CAO ★ ══════════════════ */
    {
      title: 'Chapter 8 — Beyond the syllabus ★: cohorts, channel economics & scaling|||Chương 8 — Ngoài giáo trình ★: cohort, kinh tế kênh & mở rộng',
      description: 'Chương NÂNG CAO ngoài giáo trình: đọc retention theo cohort, kinh tế từng kênh (CAC/LTV theo kênh), và khi nào chuyển từ thủ công sang mở rộng.',
      lessons: [
        {
          title: '8.1 ★ — Cohort retention & channel economics|||8.1 ★ — Retention theo cohort & kinh tế kênh',
          slug: 'exe201-8-1-cohorts-economics',
          type: 'VIDEO',
          description: 'Đọc bảng cohort retention, tính CAC/LTV theo từng kênh, và quyết kênh nào đáng mở rộng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1 · ★ Beyond the syllabus</span>
<h2>The numbers that separate real growth from noise</h2>
<p class="lead"><span class="badge">★ Beyond the syllabus</span> This chapter is how real growth teams reason. You won't be required to master it, but even touching it makes your Outcome 3 dramatically more credible.</p>

<h3>Reading a cohort retention table</h3>
<div class="diagram">Joined \\ Weeks later   W0    W1    W2    W3
Cohort (wk3 joiners)  100%  45%   30%   28%
Cohort (wk5 joiners)  100%  60%   48%   —      (improved after onboarding fix)
Cohort (wk7 joiners)  100%  65%   —     —</div>
<p>Each row is a group by join-week; each column is retention N weeks later. A <em>flattening</em> curve (that stops dropping) means you found value for that group. Rising retention across newer cohorts proves your <strong>changes worked</strong> — the strongest possible Outcome 3 evidence.</p>

<h3>Channel economics — CAC & LTV per channel</h3>
<div class="out"><strong>Compare channels honestly:</strong>
• TikTok: 4 hours work → 8 users → high effort/user, low retention.
• Class-rep referral: 1 message → 25 users → ~0 cost, high retention.
<strong>Per-channel LTV/CAC decides where to scale.</strong> A channel with cheap acquisition AND high retention is where you pour effort; a channel with expensive acquisition and users who never return is a trap, however "viral" it looked.</div>

<div class="callout ok"><strong>Decision rule:</strong> scale the channel with the best (retention × low CAC), not the one with the biggest vanity reach. This is exactly the analysis that turns "we grew" into "we know why we grew and how to grow more."</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The retention curve shape tells you everything.</b> A curve that keeps dropping to zero = no real value (leaky bucket); a curve that flattens = a core of users who love it. You cannot out-market a leaky bucket — fix retention before pouring in acquisition. <em>The deepest growth principle beyond the syllabus.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1 · ★ Ngoài giáo trình</span>
<h2>Những con số tách tăng trưởng thật khỏi nhiễu</h2>
<p class="lead"><span class="badge">★ Ngoài giáo trình</span> Chương này là cách đội tăng trưởng thật suy luận. Bạn không bắt buộc phải thạo, nhưng chỉ cần chạm tới nó cũng làm Outcome 3 của bạn đáng tin hơn hẳn.</p>

<h3>Đọc bảng cohort retention</h3>
<div class="diagram">Tham gia \\ Sau N tuần   W0    W1    W2    W3
Cohort (vào tuần 3)     100%  45%   30%   28%
Cohort (vào tuần 5)     100%  60%   48%   —      (cải thiện sau khi sửa onboarding)
Cohort (vào tuần 7)     100%  65%   —     —</div>
<p>Mỗi hàng là một nhóm theo tuần tham gia; mỗi cột là retention N tuần sau. Một đường cong <em>đi ngang</em> (ngừng rơi) nghĩa là bạn tìm được giá trị cho nhóm đó. Retention tăng dần qua các cohort mới hơn chứng minh các <strong>thay đổi của bạn hiệu quả</strong> — bằng chứng Outcome 3 mạnh nhất có thể.</p>

<h3>Kinh tế kênh — CAC & LTV theo từng kênh</h3>
<div class="out"><strong>So sánh kênh trung thực:</strong>
• TikTok: 4 giờ làm → 8 người dùng → công sức/người cao, retention thấp.
• Giới thiệu qua lớp trưởng: 1 tin nhắn → 25 người dùng → chi phí ~0, retention cao.
<strong>LTV/CAC theo từng kênh quyết định mở rộng ở đâu.</strong> Kênh có acquisition rẻ VÀ retention cao là nơi bạn dồn lực; kênh có acquisition đắt và người dùng không quay lại là một cái bẫy, dù nó trông "viral" đến đâu.</div>

<div class="callout ok"><strong>Quy tắc quyết định:</strong> mở rộng kênh có (retention × CAC thấp) tốt nhất, không phải kênh có độ phủ phù phiếm lớn nhất. Đây chính là phân tích biến "bọn em đã tăng trưởng" thành "bọn em biết vì sao tăng và làm sao tăng thêm."</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Hình dạng đường cong retention nói lên tất cả.</b> Một đường cứ rơi về 0 = không có giá trị thật (xô thủng); một đường đi ngang = một lõi người dùng yêu nó. Bạn không thể marketing thắng một cái xô thủng — sửa retention trước khi đổ acquisition vào. <em>Nguyên tắc tăng trưởng sâu nhất ngoài syllabus.</em></div>
</div>`,
        },
        {
          title: '8.2 ★ — When to scale: from manual to machine|||8.2 ★ — Khi nào mở rộng: từ thủ công sang máy',
          slug: 'exe201-8-2-when-to-scale',
          type: 'VIDEO',
          description: 'Dấu hiệu đã sẵn sàng mở rộng, tự động hoá cái gì trước, và bẫy scale quá sớm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2 · ★ Beyond the syllabus</span>
<h2>Do things that don't scale — until they must</h2>
<p class="lead"><span class="badge">★ Beyond the syllabus</span> There's a right moment to switch from doing things by hand to building systems. Scale <em>too early</em> and you automate the wrong thing; scale <em>too late</em> and manual work caps your growth. The signal is retention + demand you can't serve by hand.</p>

<h3>Signals you're ready to scale</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Retention flattens</span> Users stick — there's real value to scale (not a leaky bucket).</div>
<div class="lz-layer"><span class="lz-lk">Demand exceeds hands</span> You can't onboard/fulfil manually fast enough.</div>
<div class="lz-layer"><span class="lz-lk">A repeatable channel</span> One channel reliably brings users at good economics.</div>
<div class="lz-layer"><span class="lz-lk">A clear bottleneck</span> You know exactly which manual step to automate first.</div>
</div>

<h3>Automate the bottleneck, not everything</h3>
<div class="out"><strong>Example:</strong> BookSwap's team manually matches trades every evening. It's now the bottleneck at 50+ trades/day.
<strong>Scale move:</strong> automate <em>only</em> the matching step (the bottleneck). Keep support and verification manual a while longer — they're not the constraint yet.
<strong>Why:</strong> automating the actual bottleneck multiplies capacity; automating a non-bottleneck just adds complexity with no gain.</div>

<div class="callout warn"><strong>The premature-scaling trap.</strong> Startups die more often from scaling too early (building infra for users who never come) than too late. Manual until it hurts; automate the pain, not the hypothetical.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Growth = retention first, then acquisition, then monetization — in that order.</b> Pouring acquisition into weak retention wastes money; monetizing before you have value chases users away. The healthy sequence is fix value → keep users → grow users → then earn. <em>The strategic ordering beyond the syllabus that many funded startups got fatally wrong.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2 · ★ Ngoài giáo trình</span>
<h2>Làm những việc không mở rộng — cho tới khi buộc phải</h2>
<p class="lead"><span class="badge">★ Ngoài giáo trình</span> Có một thời điểm đúng để chuyển từ làm tay sang xây hệ thống. Mở rộng <em>quá sớm</em> thì bạn tự động hoá nhầm thứ; <em>quá muộn</em> thì việc thủ công chặn tăng trưởng. Tín hiệu là retention + nhu cầu bạn không phục vụ nổi bằng tay.</p>

<h3>Dấu hiệu bạn đã sẵn sàng mở rộng</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Retention đi ngang</span> Người dùng ở lại — có giá trị thật để mở rộng (không phải xô thủng).</div>
<div class="lz-layer"><span class="lz-lk">Nhu cầu vượt tay</span> Bạn không onboard/phục vụ thủ công đủ nhanh.</div>
<div class="lz-layer"><span class="lz-lk">Một kênh lặp được</span> Một kênh đều đặn đem người dùng với kinh tế tốt.</div>
<div class="lz-layer"><span class="lz-lk">Một điểm nghẽn rõ</span> Bạn biết chính xác bước thủ công nào cần tự động hoá trước.</div>
</div>

<h3>Tự động hoá điểm nghẽn, không phải mọi thứ</h3>
<div class="out"><strong>Ví dụ:</strong> đội BookSwap ghép giao dịch thủ công mỗi tối. Giờ nó là điểm nghẽn ở 50+ giao dịch/ngày.
<strong>Nước đi mở rộng:</strong> tự động hoá <em>chỉ</em> bước ghép (điểm nghẽn). Giữ hỗ trợ và xác thực thủ công thêm một thời gian — chúng chưa phải ràng buộc.
<strong>Vì sao:</strong> tự động hoá đúng điểm nghẽn nhân lên năng lực; tự động hoá thứ không phải điểm nghẽn chỉ thêm phức tạp mà không lợi.</div>

<div class="callout warn"><strong>Bẫy mở rộng quá sớm.</strong> Startup chết vì mở rộng quá sớm (xây hạ tầng cho người dùng không bao giờ tới) thường xuyên hơn quá muộn. Thủ công tới khi đau; tự động hoá cái đau, không tự động hoá cái giả định.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Tăng trưởng = retention trước, rồi acquisition, rồi kiếm tiền — đúng thứ tự đó.</b> Đổ acquisition vào retention yếu là phí tiền; kiếm tiền trước khi có giá trị là đuổi người dùng đi. Trình tự khỏe mạnh là sửa giá trị → giữ người dùng → tăng người dùng → rồi mới kiếm. <em>Trình tự chiến lược ngoài syllabus mà nhiều startup có vốn đã làm sai chí mạng.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'A retention curve that flattens (stops dropping) means:|||Một đường cong retention đi ngang (ngừng rơi) nghĩa là:',
                options: [
                  'The product has no value|||Sản phẩm không có giá trị',
                  'A core of users found real value|||Một lõi người dùng tìm được giá trị thật',
                  'Everyone left|||Mọi người đã rời',
                  'Acquisition is too high|||Acquisition quá cao',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'You should scale the channel with:|||Bạn nên mở rộng kênh có:',
                options: [
                  'The biggest vanity reach|||Độ phủ phù phiếm lớn nhất',
                  'The best retention × low CAC|||Retention tốt nhất × CAC thấp',
                  'The most likes|||Nhiều like nhất',
                  'The highest cost|||Chi phí cao nhất',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'When scaling, you should first automate:|||Khi mở rộng, bạn nên tự động hoá trước:',
                options: [
                  'Everything at once|||Mọi thứ cùng lúc',
                  'The actual bottleneck step|||Đúng bước điểm nghẽn',
                  'The prettiest feature|||Tính năng đẹp nhất',
                  'Nothing ever|||Không bao giờ gì cả',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'The premature-scaling trap is:|||Bẫy mở rộng quá sớm là:',
                options: [
                  'Staying manual too long|||Giữ thủ công quá lâu',
                  'Building infrastructure for users who never come|||Xây hạ tầng cho người dùng không bao giờ tới',
                  'Talking to too many customers|||Nói chuyện với quá nhiều khách hàng',
                  'Launching too small|||Launch quá nhỏ',
                ], correctIndex: 1,
              },
              {
                id: 'q5', points: 1,
                question: '(Beyond syllabus) The healthy growth order is:|||(Ngoài giáo trình) Trình tự tăng trưởng khỏe mạnh là:',
                options: [
                  'Monetize → acquire → retain|||Kiếm tiền → thu hút → giữ chân',
                  'Retention → acquisition → monetization|||Giữ chân → thu hút → kiếm tiền',
                  'Acquire → monetize → then maybe retain|||Thu hút → kiếm tiền → rồi có thể giữ chân',
                  'Order does not matter|||Thứ tự không quan trọng',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },
  ],
};
