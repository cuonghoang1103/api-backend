/**
 * EXE101 — Experiential Entrepreneurship 1 (Kỳ 8).
 * Startup/khởi nghiệp theo mô hình Y Combinator: đội 4-6, phát triển 1 ý tưởng khởi nghiệp,
 * nghiên cứu thị trường, dựng MVP, business model canvas, và pitch deck bảo vệ ở Demo Day.
 * KHÔNG code → link Exp Hub (công cụ) + tài nguyên YC/Coursera; KHÔNG CodeLab.
 * Chuẩn SWP391 gold: Mục 0 6 bài (intro+lz-map, thang điểm 4 checkpoint, CLO, công cụ,
 * ngân hàng ý tưởng 12 + rubric chọn, anti-fail/high-mark) + chương bám giáo trình
 * + chương ÔN THI/Pitch Day (ngân hàng vấn đáp theo CLO + kịch bản pitch) + chương NÂNG CAO ★.
 * Song ngữ EN/VN đối xứng (ml-en == ml-vi). shortDescription < 500.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/EXE101.mjs --apply
 */
export default {
  semester: { code: 'FPTU_Hola8', name: 'Kỳ 8', ordinal: 10 },
  course: {
    academyType: 'FPT',
    courseCode: 'EXE101',
    title: 'Experiential Entrepreneurship 1',
    slug: 'experiential-entrepreneurship-1',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'Learn to start a startup the Y Combinator way: build a team, find a real problem, do market research, ship an MVP, design a business model, and pitch convincingly on Demo Day.|||Học khởi nghiệp theo cách Y Combinator: lập đội, tìm vấn đề thật, nghiên cứu thị trường, ra mắt MVP, thiết kế mô hình kinh doanh và pitch thuyết phục ở Demo Day.',
    description: 'EXE101 (Trải nghiệm khởi nghiệp 1) là môn học TRẢI NGHIỆM: bạn không ngồi nghe lý thuyết suông mà cùng một đội 4-6 người phát triển một ý tưởng khởi nghiệp thật từ con số 0. Môn học dựa trên kho tài liệu của Y Combinator (vườn ươm startup danh tiếng nhất thế giới) và cuốn The Lean Startup của Eric Ries. Bạn sẽ đi qua trọn hành trình của một founder: khơi dậy tinh thần khởi nghiệp → lập đội chiến thắng → tìm và đánh giá ý tưởng → hiểu khách hàng và tìm product-market fit → nghiên cứu thị trường → dựng MVP → thiết kế mô hình kinh doanh (Business Model Canvas) → gọi vốn → quản trị startup → và cuối cùng là PITCH ý tưởng ở Demo Day. Đánh giá 100% qua 4 checkpoint đồ án + thuyết trình (không thi cuối kỳ), nên môn này ăn điểm bằng SẢN PHẨM và cách bạn kể chuyện, không phải bằng học thuộc.',
    whatYouLearn: 'Tư duy founder & phân biệt startup vs SME (mô hình tăng trưởng 10x); cách lập đội đồng sáng lập, chia vai trò và equity; sinh & đánh giá ý tưởng theo tiêu chí (vấn đề thật, thị trường lớn, khả thi); phỏng vấn khách hàng đúng cách (The Mom Test) để tìm problem-solution fit; nghiên cứu thị trường TAM/SAM/SOM + phân tích đối thủ; xây MVP theo vòng Build-Measure-Learn và mini-launch; thiết kế Business Model Canvas 9 khối + nguồn doanh thu & cấu trúc chi phí; cơ bản về gọi vốn seed, định giá, cap table; và dựng một pitch deck 10 slide + kịch bản thuyết trình Demo Day thuyết phục cùng ngân hàng câu hỏi phản biện.',
    requirements: 'Không có môn tiên quyết. Cần: một đội 4-6 người (khuyến khích khác ngành), một tài khoản Google (Forms/Slides), một công cụ thiết kế (Canva) và tinh thần dám thử — dám sai — sửa nhanh. Nên có laptop và truy cập được kho tài liệu Y Combinator (ycombinator.com/library).',
    documentsNote: 'Tài nguyên chính: Y Combinator Startup Library (ycombinator.com/library) • Startup School (startupschool.org) • The Lean Startup — Eric Ries • How to Design a Better Pitch Deck — Kevin Hale • A Guide to Seed Fundraising — Geoff Ralston • The Mom Test — Rob Fitzpatrick. Công cụ cài đặt & template → Exp Hub. Đây là môn TRẢI NGHIỆM — vừa học vừa xây startup thật của đội bạn.',
  },
  sections: [
    /* ══════════════════ MỤC 0 — GIỚI THIỆU & HƯỚNG DẪN ══════════════════ */
    {
      title: 'Section 0 — Introduction & Study Guide|||Mục 0 — Giới thiệu & Hướng dẫn học',
      description: 'Đọc trước tiên: môn học vận hành thế nào, thang điểm 4 checkpoint, CLO, công cụ, ngân hàng ý tưởng khởi nghiệp và cách không trượt / ăn điểm cao.',
      lessons: [
        {
          title: '0.1 — What EXE101 is & your journey to Demo Day|||0.1 — EXE101 là gì & hành trình tới Demo Day',
          slug: 'exe101-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Bức tranh toàn cảnh: một môn trải nghiệm, bạn xây startup thật theo mô hình Y Combinator và bảo vệ ở Demo Day.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>EXE101 — you don't study a startup, you build one</h2>
<p class="lead">EXE101 (Experiential Entrepreneurship 1) is a <strong>hands-on</strong> course. Instead of memorizing theory, you and a team of 4-6 people take one real startup idea from zero and push it as far as you can in ten weeks — then pitch it on <strong>Demo Day</strong>. The whole course is modeled on <strong>Y Combinator</strong>, the accelerator behind Airbnb, Stripe, Dropbox and thousands more, and on Eric Ries's <em>The Lean Startup</em>.</p>
<p>There is <strong>no final written exam</strong>. Your grade comes from four checkpoints and a final pitch — that is, from what you <em>build</em> and how convincingly you <em>tell the story</em>. This is closer to a real founder's life than any other course in your degree.</p>

<h3>The founder's journey — the whole course in one map</h3>
<div class="lz-map">
  <div class="lz-stage">Spark</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Entrepreneurial mindset</div><div class="lz-nsub">Why start · startup vs SME · the 10x idea</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Build a winning team</div><div class="lz-nsub">Co-founders · roles · equity · how teams die</div></div></div>
  <div class="lz-stage">Discover</div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Find & evaluate an idea</div><div class="lz-nsub">Problem-first · idea filters · market size</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Customer & market-fit</div><div class="lz-nsub">Customer interviews · The Mom Test · PMF</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Market research</div><div class="lz-nsub">TAM/SAM/SOM · surveys · competitors</div></div></div>
  <div class="lz-stage">Build</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">MVP & mini-launch</div><div class="lz-nsub">Build-Measure-Learn · ship small</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Business model</div><div class="lz-nsub">Business Model Canvas · revenue · costs</div></div></div>
  <div class="lz-stage">Raise & run</div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Fundraising & managing</div><div class="lz-nsub">Seed rounds · valuation · metrics · legal</div></div></div>
  <div class="lz-stage">Pitch</div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Demo Day pitch</div><div class="lz-nsub">10-slide deck · story · Q&A defense</div></div></div>
  <div class="lz-stage">Beyond the syllabus ★</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Unit economics · growth · advanced fundraising</div><div class="lz-nsub">Think like a real founder</div></div></div>
</div>

<div class="callout ok"><strong>The one rule that decides your grade:</strong> talk to real customers <em>early and often</em>. Teams that build in a cave for ten weeks and never leave the building always lose to teams that shipped something ugly, showed it to 20 people, and fixed it. Ideas are cheap; evidence wins checkpoints.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Why FPT teaches this at all.</b> Even if you never found a company, the EXE loop — <em>find a real problem → test cheaply → decide from evidence</em> — is exactly how good product engineers, PMs and consultants work. You are learning a professional decision method, not just "how to start a business." <em>This framing is not in the syllabus but is why the skill transfers.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>EXE101 — bạn không "học" startup, bạn XÂY một startup</h2>
<p class="lead">EXE101 (Trải nghiệm khởi nghiệp 1) là môn <strong>thực chiến</strong>. Thay vì học thuộc lý thuyết, bạn cùng một đội 4-6 người đưa một ý tưởng khởi nghiệp thật từ con số 0 đi xa nhất có thể trong mười tuần — rồi pitch ở <strong>Demo Day</strong>. Toàn bộ môn học mô phỏng theo <strong>Y Combinator</strong> — vườn ươm đứng sau Airbnb, Stripe, Dropbox và hàng nghìn startup khác — và cuốn <em>The Lean Startup</em> của Eric Ries.</p>
<p><strong>Không có thi viết cuối kỳ.</strong> Điểm của bạn đến từ bốn checkpoint và một buổi pitch cuối — tức là từ thứ bạn <em>xây</em> được và cách bạn <em>kể câu chuyện</em> thuyết phục ra sao. Đây là môn gần với đời sống một founder thật nhất trong cả chương trình học.</p>

<h3>Hành trình của founder — cả môn học trong một bản đồ</h3>
<div class="lz-map">
  <div class="lz-stage">Khơi nguồn</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Tư duy khởi nghiệp</div><div class="lz-nsub">Vì sao khởi nghiệp · startup vs SME · ý tưởng 10x</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Lập đội chiến thắng</div><div class="lz-nsub">Đồng sáng lập · vai trò · chia cổ phần · vì sao đội tan</div></div></div>
  <div class="lz-stage">Khám phá</div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Tìm & đánh giá ý tưởng</div><div class="lz-nsub">Xuất phát từ vấn đề · bộ lọc ý tưởng · quy mô thị trường</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Khách hàng & market-fit</div><div class="lz-nsub">Phỏng vấn khách hàng · The Mom Test · PMF</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Nghiên cứu thị trường</div><div class="lz-nsub">TAM/SAM/SOM · khảo sát · đối thủ</div></div></div>
  <div class="lz-stage">Xây dựng</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">MVP & mini-launch</div><div class="lz-nsub">Vòng Build-Measure-Learn · ra mắt nhỏ</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Mô hình kinh doanh</div><div class="lz-nsub">Business Model Canvas · doanh thu · chi phí</div></div></div>
  <div class="lz-stage">Gọi vốn & vận hành</div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Gọi vốn & quản trị</div><div class="lz-nsub">Vòng seed · định giá · chỉ số · pháp lý</div></div></div>
  <div class="lz-stage">Pitch</div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Pitch Demo Day</div><div class="lz-nsub">Deck 10 slide · câu chuyện · phản biện Q&A</div></div></div>
  <div class="lz-stage">Ngoài giáo trình ★</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Unit economics · tăng trưởng · gọi vốn nâng cao</div><div class="lz-nsub">Tư duy như một founder thật</div></div></div>
</div>

<div class="callout ok"><strong>Một quy tắc quyết định điểm của bạn:</strong> nói chuyện với khách hàng thật <em>sớm và thường xuyên</em>. Đội nào cắm đầu xây trong "hang" suốt mười tuần mà không bước ra ngoài luôn thua đội đã ra một thứ xấu xí, cho 20 người xem rồi sửa. Ý tưởng thì rẻ; bằng chứng mới thắng checkpoint.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Vì sao FPT dạy môn này.</b> Kể cả bạn không bao giờ mở công ty, vòng lặp EXE — <em>tìm vấn đề thật → thử rẻ → quyết định dựa trên bằng chứng</em> — chính là cách một product engineer, PM hay tư vấn giỏi làm việc. Bạn đang học một PHƯƠNG PHÁP RA QUYẾT ĐỊNH chuyên nghiệp, không chỉ "cách mở công ty". <em>Góc nhìn này không nằm trong syllabus nhưng là lý do kỹ năng này chuyển được sang nghề khác.</em></div>
</div>`,
        },
        {
          title: '0.2 — How you are graded: 4 checkpoints, no final exam|||0.2 — Cách tính điểm: 4 checkpoint, không thi cuối kỳ',
          slug: 'exe101-thang-diem',
          type: 'article',
          description: 'Bảng thang điểm đầy đủ: Presentations 15% + 3 Group Assignment checkpoint + Pitch cuối 40%. Ai qua, ai trượt.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>The grade breakdown — know exactly where points come from</h2>
<p class="lead">EXE101 is graded 100% by <strong>continuous checkpoints</strong> — there is no final written exam. Every point is a team deliverable presented to the instructor. Miss a checkpoint and you cannot get those points back.</p>

<table>
<thead><tr><th>Component</th><th>Weight</th><th>CLO</th><th>What you submit</th></tr></thead>
<tbody>
<tr><td>Ongoing Presentations</td><td><strong>15%</strong></td><td>All</td><td>Weekly progress pitches, participation</td></tr>
<tr><td>Group Assignment 1 — Checkpoint 1</td><td><strong>10%</strong></td><td>CLO1, CLO2</td><td>Team + idea + why-this-problem</td></tr>
<tr><td>Group Assignment 2 — Checkpoint 2</td><td><strong>20%</strong></td><td>CLO3</td><td>Customer interviews + market research</td></tr>
<tr><td>Group Assignment 3 — Checkpoint 3</td><td><strong>15%</strong></td><td>CLO4</td><td>MVP + business model</td></tr>
<tr><td>Final Presentation — Checkpoint 4</td><td><strong>40%</strong></td><td>CLO5</td><td>Demo Day pitch deck + demo</td></tr>
</tbody>
</table>

<div class="kv-grid">
<div class="kv"><span class="k">Scale</span><span class="v">10</span></div>
<div class="kv"><span class="k">Pass</span><span class="v">Final average ≥ 5.0</span></div>
<div class="kv"><span class="k">Attendance gate</span><span class="v">≥ 80% of coaching / seminars / mentoring</span></div>
<div class="kv"><span class="k">Final pitch weight</span><span class="v">40% — the single biggest bet</span></div>
</div>

<div class="callout warn"><strong>Read this twice.</strong> The final pitch is 40% of the whole course — but it is graded on the <em>evidence you gathered in checkpoints 1-3</em>, not on slide design. A beautiful deck with no real customer proof scores low. Do the boring customer work early; the pitch is just where you show it.</div>

<div class="pitfall"><strong>Attendance is a hard gate, not a soft one.</strong> Below 80% attendance you are <em>not accepted</em> to the final presentation — which is 40%. That alone fails the course regardless of your product. Track your own attendance from week 1.</div>

<h3>How the 40% pitch is actually scored</h3>
<p>Instructors look for four things, roughly equally: (1) is the <strong>problem real</strong> and did you prove it; (2) is the <strong>solution</strong> a genuine fit; (3) is the <strong>market</strong> big enough and did you size it; (4) can the team <strong>tell the story and defend it</strong> under questions. Your deck should have one slide per item.</p>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The "traction slide" wins rooms.</b> Even a class pitch is dramatically stronger with one number that moved: "45 people signed up in 5 days", "12 of 20 interviewees said they'd pay". Real investors call this <em>traction</em>; it is the single most persuasive slide. <em>Not required by the rubric — but it separates a 7 from a 9.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Cấu trúc điểm — biết chính xác điểm đến từ đâu</h2>
<p class="lead">EXE101 chấm 100% qua <strong>checkpoint liên tục</strong> — không có thi viết cuối kỳ. Mỗi điểm là một sản phẩm nhóm trình bày trước giảng viên. Lỡ một checkpoint là mất điểm đó, không lấy lại được.</p>

<table>
<thead><tr><th>Thành phần</th><th>Trọng số</th><th>CLO</th><th>Bạn nộp gì</th></tr></thead>
<tbody>
<tr><td>Thuyết trình liên tục</td><td><strong>15%</strong></td><td>Tất cả</td><td>Pitch tiến độ hàng tuần, tham gia</td></tr>
<tr><td>Bài nhóm 1 — Checkpoint 1</td><td><strong>10%</strong></td><td>CLO1, CLO2</td><td>Đội + ý tưởng + vì sao vấn đề này</td></tr>
<tr><td>Bài nhóm 2 — Checkpoint 2</td><td><strong>20%</strong></td><td>CLO3</td><td>Phỏng vấn khách hàng + nghiên cứu thị trường</td></tr>
<tr><td>Bài nhóm 3 — Checkpoint 3</td><td><strong>15%</strong></td><td>CLO4</td><td>MVP + mô hình kinh doanh</td></tr>
<tr><td>Thuyết trình cuối — Checkpoint 4</td><td><strong>40%</strong></td><td>CLO5</td><td>Pitch deck Demo Day + demo</td></tr>
</tbody>
</table>

<div class="kv-grid">
<div class="kv"><span class="k">Thang</span><span class="v">10</span></div>
<div class="kv"><span class="k">Qua môn</span><span class="v">Điểm tổng ≥ 5.0</span></div>
<div class="kv"><span class="k">Cổng điểm danh</span><span class="v">≥ 80% buổi coaching / seminar / mentoring</span></div>
<div class="kv"><span class="k">Trọng số pitch cuối</span><span class="v">40% — canh bạc lớn nhất</span></div>
</div>

<div class="callout warn"><strong>Đọc kỹ hai lần.</strong> Pitch cuối chiếm 40% cả môn — nhưng nó được chấm dựa trên <em>bằng chứng bạn thu thập ở checkpoint 1-3</em>, không phải thiết kế slide. Một deck đẹp mà không có bằng chứng khách hàng thật sẽ điểm thấp. Làm việc "chán" với khách hàng từ sớm; pitch chỉ là nơi bạn khoe nó ra.</div>

<div class="pitfall"><strong>Điểm danh là cổng cứng, không phải mềm.</strong> Dưới 80% điểm danh, bạn <em>không được</em> vào thuyết trình cuối — vốn chiếm 40%. Chỉ riêng điều đó đã trượt môn dù sản phẩm tốt đến đâu. Tự theo dõi điểm danh của mình từ tuần 1.</div>

<h3>Pitch 40% thực chất được chấm thế nào</h3>
<p>Giảng viên tìm bốn thứ, gần như cân bằng: (1) <strong>vấn đề có thật</strong> không và bạn có chứng minh được không; (2) <strong>giải pháp</strong> có thực sự khớp không; (3) <strong>thị trường</strong> có đủ lớn không và bạn đã ước lượng chưa; (4) đội có <strong>kể câu chuyện và bảo vệ</strong> được dưới câu hỏi không. Deck của bạn nên có một slide cho mỗi ý.</p>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>"Slide traction" thắng cả phòng.</b> Kể cả pitch trên lớp cũng mạnh hơn hẳn khi có một con số biết di chuyển: "45 người đăng ký trong 5 ngày", "12/20 người được phỏng vấn nói sẽ trả tiền". Nhà đầu tư thật gọi đây là <em>traction</em>; đó là slide thuyết phục nhất. <em>Rubric không bắt buộc — nhưng nó là ranh giới giữa điểm 7 và điểm 9.</em></div>
</div>`,
        },
        {
          title: '0.3 — Course learning outcomes (CLOs)|||0.3 — Chuẩn đầu ra môn học (CLO)',
          slug: 'exe101-clo',
          type: 'article',
          description: '5 CLO của EXE101 và checkpoint nào chứng minh CLO nào — dùng để tự soi mình trước mỗi buổi nộp.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>The 5 CLOs — what you must be able to do</h2>
<p class="lead">Every checkpoint maps to a Course Learning Outcome. If you can honestly tick all five, you pass comfortably. Use this as a self-check before each submission.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">CLO1</span> Demonstrate understanding of the key aspects of a startup at a basic level. <em>→ Checkpoint 1</em></div>
<div class="lz-layer"><span class="lz-lk">CLO2</span> Build the right team and show effective teamwork. <em>→ Checkpoint 1</em></div>
<div class="lz-layer"><span class="lz-lk">CLO3</span> Conduct surveys and do market research. <em>→ Checkpoint 2</em></div>
<div class="lz-layer"><span class="lz-lk">CLO4</span> Build the right product and a reasonable business model. <em>→ Checkpoint 3</em></div>
<div class="lz-layer"><span class="lz-lk">CLO5</span> Create a preliminary pitch deck and present it convincingly. <em>→ Checkpoint 4 (Demo Day)</em></div>
</div>
<div class="callout ok">Notice the arc: <strong>understand → team → evidence → product → pitch</strong>. Each CLO builds on the last. You cannot fake CLO5 (the pitch) if you skipped CLO3 (the customer evidence) — the questions will expose you.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>5 CLO — bạn phải làm được gì</h2>
<p class="lead">Mỗi checkpoint ánh xạ tới một chuẩn đầu ra. Nếu bạn thành thật tích được cả năm, bạn qua môn thoải mái. Dùng nó để tự soi trước mỗi lần nộp.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">CLO1</span> Hiểu các khía cạnh cốt lõi của một startup ở mức cơ bản. <em>→ Checkpoint 1</em></div>
<div class="lz-layer"><span class="lz-lk">CLO2</span> Lập đúng đội và thể hiện làm việc nhóm hiệu quả. <em>→ Checkpoint 1</em></div>
<div class="lz-layer"><span class="lz-lk">CLO3</span> Thực hiện khảo sát và nghiên cứu thị trường. <em>→ Checkpoint 2</em></div>
<div class="lz-layer"><span class="lz-lk">CLO4</span> Xây đúng sản phẩm và một mô hình kinh doanh hợp lý. <em>→ Checkpoint 3</em></div>
<div class="lz-layer"><span class="lz-lk">CLO5</span> Tạo pitch deck sơ bộ và trình bày thuyết phục. <em>→ Checkpoint 4 (Demo Day)</em></div>
</div>
<div class="callout ok">Để ý mạch: <strong>hiểu → đội → bằng chứng → sản phẩm → pitch</strong>. Mỗi CLO xây trên cái trước. Bạn không thể "diễn" CLO5 (pitch) nếu bỏ qua CLO3 (bằng chứng khách hàng) — các câu hỏi sẽ lộ ra ngay.</div>
</div>`,
        },
        {
          title: '0.4 — Tools & setup (Exp Hub)|||0.4 — Công cụ & cài đặt (Exp Hub)',
          slug: 'exe101-cong-cu',
          type: 'article',
          description: 'Bộ công cụ khởi nghiệp: Google Forms khảo sát, Canva/Slides pitch deck, Notion quản lý, kho YC — kèm guide cài đặt.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>Your startup toolkit</h2>
<p class="lead">You don't need to code in EXE101. You need tools to <em>talk to customers, measure, and tell a story</em>. Here is the minimal kit — all free.</p>
<ul>
<li><strong>Y Combinator Library + Startup School</strong> — the primary source; watch the founder talks per topic.</li>
<li><strong>Google Forms + Google Sheets</strong> — run surveys, collect and analyze responses.</li>
<li><strong>Canva / Google Slides</strong> — build the pitch deck (templates included).</li>
<li><strong>Notion / Trello</strong> — team tasks, interview notes, decision log.</li>
<li><strong>Figma (optional)</strong> — mock up your MVP screens without building them.</li>
</ul>
<a class="link-card exphub" href="/exp-hub/exe101-cong-cu-khoi-nghiep?ref=%2Fcourses%2Fexperiential-entrepreneurship-1%2Flearn&reflabel=EXE101%200.4" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Setup guide: startup toolkit</span><span class="lc-sub">Google Forms, Canva pitch deck template, Notion board, and the YC library — step by step.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>One shared "source of truth" doc.</b> Great teams keep a single living doc: problem statement, target customer, top 3 assumptions, and this week's experiment. Update it after every customer call. It prevents the #1 team failure — five people quietly believing five different versions of the idea. <em>A practice from real accelerators, not the syllabus.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Bộ công cụ khởi nghiệp của bạn</h2>
<p class="lead">Bạn không cần code trong EXE101. Bạn cần công cụ để <em>nói chuyện với khách hàng, đo lường và kể chuyện</em>. Đây là bộ tối thiểu — đều miễn phí.</p>
<ul>
<li><strong>Y Combinator Library + Startup School</strong> — nguồn chính; xem các buổi chia sẻ của founder theo chủ đề.</li>
<li><strong>Google Forms + Google Sheets</strong> — chạy khảo sát, thu thập và phân tích phản hồi.</li>
<li><strong>Canva / Google Slides</strong> — dựng pitch deck (có sẵn template).</li>
<li><strong>Notion / Trello</strong> — việc nhóm, ghi chú phỏng vấn, nhật ký quyết định.</li>
<li><strong>Figma (tuỳ chọn)</strong> — phác màn hình MVP mà không cần code.</li>
</ul>
<a class="link-card exphub" href="/exp-hub/exe101-cong-cu-khoi-nghiep?ref=%2Fcourses%2Fexperiential-entrepreneurship-1%2Flearn&reflabel=EXE101%200.4" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Guide cài đặt: bộ công cụ khởi nghiệp</span><span class="lc-sub">Google Forms, template pitch deck Canva, board Notion và kho YC — từng bước.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Một tài liệu "nguồn sự thật" chung.</b> Đội giỏi giữ một tài liệu sống duy nhất: phát biểu vấn đề, khách hàng mục tiêu, 3 giả định lớn nhất và thí nghiệm tuần này. Cập nhật sau mỗi cuộc gọi khách hàng. Nó ngăn thất bại số 1 của đội — năm người âm thầm tin năm phiên bản khác nhau của ý tưởng. <em>Một thực hành từ vườn ươm thật, không có trong syllabus.</em></div>
</div>`,
        },
        {
          title: '0.5 — Startup idea bank (12 ideas) + how to pick|||0.5 — Ngân hàng ý tưởng khởi nghiệp (12) + cách chọn',
          slug: 'exe101-ngan-hang-y-tuong',
          type: 'article',
          description: '12 ý tưởng đã kiểm scope cho đội sinh viên + rubric 6 phép thử để chọn ý tưởng không "chết yểu".',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.5</span>
<h2>12 student-scoped startup ideas — and how to choose</h2>
<p class="lead">The most common way teams waste week 1-3 is arguing about ideas. Here are 12 ideas already scoped for a 10-week student team — all start from a <strong>real, verifiable problem</strong> you can reach as a student. Pick one, or use them as sparks.</p>
<table>
<thead><tr><th>#</th><th>Idea</th><th>The problem it attacks</th></tr></thead>
<tbody>
<tr><td>1</td><td>Campus second-hand marketplace</td><td>Students throw away/lose value on books, gear each semester</td></tr>
<tr><td>2</td><td>Group-study / tutor matching</td><td>Hard to find a reliable peer tutor for a specific FPT subject</td></tr>
<tr><td>3</td><td>Shared-ride to campus</td><td>Commuting cost & parking for students far from campus</td></tr>
<tr><td>4</td><td>Local-food pre-order for lunch rush</td><td>Long queues + food waste at peak hours near campus</td></tr>
<tr><td>5</td><td>Freelance-gig board for students</td><td>Students want paid micro-jobs matched to their skills</td></tr>
<tr><td>6</td><td>Habit / study-streak accountability app</td><td>Students start habits, quit in a week, no social pressure</td></tr>
<tr><td>7</td><td>Landlord–student room finder (verified)</td><td>Scams & unclear info in the student rental market</td></tr>
<tr><td>8</td><td>Event & club discovery for campus</td><td>Clubs can't reach students; students miss events</td></tr>
<tr><td>9</td><td>Lost-and-found network for campus</td><td>Lost items rarely returned; no central channel</td></tr>
<tr><td>10</td><td>Micro-SaaS for a niche local shop</td><td>Small shops manage inventory/orders on paper</td></tr>
<tr><td>11</td><td>Mental-wellness check-in for students</td><td>Stigma & no low-friction way to ask for help</td></tr>
<tr><td>12</td><td>Sustainable packaging for local F&B</td><td>Small cafés want green packaging but can't source cheaply</td></tr>
</tbody>
</table>

<h3>The 6-test filter — pass all before you commit</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">1 · Real pain</span> Can you name a specific person who has this problem <em>this week</em>?</div>
<div class="lz-layer"><span class="lz-lk">2 · Reachable</span> Can your team actually talk to 20 of these customers in 2 weeks?</div>
<div class="lz-layer"><span class="lz-lk">3 · Big enough</span> If it worked, could it be 100k+ users someday (10x thinking)?</div>
<div class="lz-layer"><span class="lz-lk">4 · Buildable</span> Can you fake/build a usable MVP in ~4 weeks with your skills?</div>
<div class="lz-layer"><span class="lz-lk">5 · Money path</span> Is there a plausible way someone eventually pays?</div>
<div class="lz-layer"><span class="lz-lk">6 · Team fit</span> Does someone on the team actually care about this problem?</div>
</div>
<div class="callout warn"><strong>If an idea fails test 1 or 2, drop it — no matter how exciting.</strong> "Cool idea, no reachable customer" is the #1 cause of a dead student startup project. You cannot do CLO3 (market research) on customers you can't reach.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Start from a problem you personally live.</b> YC's strongest advice: build for yourself as a user. "I couldn't find X and it drove me crazy" beats "I read that market Y is big." You already <em>are</em> the customer for half these ideas — that is a real advantage. <em>The "founder-problem fit" idea is beyond the syllabus but is why student teams from their own pain win.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.5</span>
<h2>12 ý tưởng khởi nghiệp cỡ sinh viên — và cách chọn</h2>
<p class="lead">Cách phổ biến nhất khiến đội phí tuần 1-3 là cãi nhau về ý tưởng. Đây là 12 ý tưởng đã được kiểm scope cho một đội sinh viên 10 tuần — tất cả xuất phát từ một <strong>vấn đề thật, kiểm chứng được</strong> mà bạn tiếp cận được với tư cách sinh viên. Chọn một, hoặc dùng làm mồi lửa.</p>
<table>
<thead><tr><th>#</th><th>Ý tưởng</th><th>Vấn đề nó tấn công</th></tr></thead>
<tbody>
<tr><td>1</td><td>Chợ đồ cũ trong trường</td><td>Sinh viên bỏ phí sách, đồ dùng mỗi kỳ</td></tr>
<tr><td>2</td><td>Ghép nhóm học / gia sư</td><td>Khó tìm bạn kèm đáng tin cho một môn FPT cụ thể</td></tr>
<tr><td>3</td><td>Đi chung xe tới trường</td><td>Chi phí đi lại & chỗ đỗ cho SV ở xa</td></tr>
<tr><td>4</td><td>Đặt cơm trước giờ cao điểm</td><td>Xếp hàng dài + lãng phí đồ ăn giờ trưa quanh trường</td></tr>
<tr><td>5</td><td>Bảng việc freelance cho SV</td><td>SV muốn việc nhỏ có trả tiền khớp kỹ năng</td></tr>
<tr><td>6</td><td>App giữ chuỗi thói quen/học tập</td><td>SV bắt đầu thói quen, tuần sau bỏ, thiếu áp lực xã hội</td></tr>
<tr><td>7</td><td>Tìm phòng trọ có xác thực</td><td>Lừa đảo & thông tin mập mờ trong thị trường trọ SV</td></tr>
<tr><td>8</td><td>Khám phá sự kiện & CLB trong trường</td><td>CLB không tiếp cận được SV; SV bỏ lỡ sự kiện</td></tr>
<tr><td>9</td><td>Mạng tìm đồ thất lạc trong trường</td><td>Đồ mất hiếm khi được trả; không kênh tập trung</td></tr>
<tr><td>10</td><td>Micro-SaaS cho một tiệm nhỏ ngách</td><td>Tiệm nhỏ quản kho/đơn hàng trên giấy</td></tr>
<tr><td>11</td><td>Check-in sức khoẻ tinh thần cho SV</td><td>Kỳ thị & không có cách xin giúp đỡ ít ngại ngùng</td></tr>
<tr><td>12</td><td>Bao bì bền vững cho F&B nhỏ</td><td>Quán nhỏ muốn bao bì xanh nhưng khó mua rẻ</td></tr>
</tbody>
</table>

<h3>Bộ lọc 6 phép thử — qua hết rồi mới chốt</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">1 · Đau thật</span> Bạn có kể tên một người cụ thể đang gặp vấn đề này <em>tuần này</em> không?</div>
<div class="lz-layer"><span class="lz-lk">2 · Tiếp cận được</span> Đội bạn có thực sự nói chuyện được với 20 khách hàng này trong 2 tuần không?</div>
<div class="lz-layer"><span class="lz-lk">3 · Đủ lớn</span> Nếu thành công, một ngày nào đó có thể đạt 100k+ người dùng không (tư duy 10x)?</div>
<div class="lz-layer"><span class="lz-lk">4 · Xây được</span> Bạn có thể giả lập/xây một MVP dùng được trong ~4 tuần với kỹ năng hiện có không?</div>
<div class="lz-layer"><span class="lz-lk">5 · Đường ra tiền</span> Có cách hợp lý để một ngày nào đó ai đó trả tiền không?</div>
<div class="lz-layer"><span class="lz-lk">6 · Hợp đội</span> Có ai trong đội thực sự quan tâm vấn đề này không?</div>
</div>
<div class="callout warn"><strong>Nếu ý tưởng trượt phép thử 1 hoặc 2, bỏ — dù hấp dẫn đến đâu.</strong> "Ý tưởng hay, không có khách hàng tiếp cận được" là nguyên nhân số 1 khiến đồ án startup SV chết. Bạn không thể làm CLO3 (nghiên cứu thị trường) trên những khách hàng bạn không với tới.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Xuất phát từ vấn đề bạn tự sống với nó.</b> Lời khuyên mạnh nhất của YC: xây cho chính bạn như một người dùng. "Tôi không tìm được X và nó khiến tôi phát điên" thắng "Tôi đọc thấy thị trường Y lớn". Bạn <em>đã là</em> khách hàng của một nửa số ý tưởng trên — đó là lợi thế thật. <em>Ý "founder-problem fit" nằm ngoài syllabus nhưng là lý do đội SV xuất phát từ nỗi đau của chính mình thường thắng.</em></div>
</div>`,
        },
        {
          title: '0.6 — How not to fail & how to score high|||0.6 — Cách không trượt & cách ăn điểm cao',
          slug: 'exe101-chong-truot-diem-cao',
          type: 'article',
          description: '7 kiểu mất điểm ở đồ án khởi nghiệp + cờ xanh/cờ đỏ theo checkpoint + công thức điểm cao.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.6</span>
<h2>7 ways teams lose points — and how to avoid each</h2>
<p class="lead">EXE101 rarely fails people on "not enough work." It fails them on <em>wrong work</em>: polishing slides while never talking to a customer. Here are the seven classic point-losers.</p>
<table>
<thead><tr><th>#</th><th>How you lose points</th><th>The fix</th></tr></thead>
<tbody>
<tr><td>1</td><td>No real customer evidence — only opinions</td><td>Do 20 real interviews; quote them in the deck</td></tr>
<tr><td>2</td><td>Solution in search of a problem</td><td>Start from the problem; prove it before building</td></tr>
<tr><td>3</td><td>Leading survey questions ("Would you use X?")</td><td>Ask about past behavior, not future intent (Mom Test)</td></tr>
<tr><td>4</td><td>Vague market size ("everyone needs this")</td><td>Compute TAM/SAM/SOM with a real number trail</td></tr>
<tr><td>5</td><td>MVP that took 4 weeks and no one used</td><td>Ship a fake/manual MVP in days; measure usage</td></tr>
<tr><td>6</td><td>One person did everything; team can't answer</td><td>Everyone owns a slide and can defend it</td></tr>
<tr><td>7</td><td>Pitch reads slides, no story, no ask</td><td>Tell a story; end with a clear ask/next step</td></tr>
</tbody>
</table>

<h3>Green flags / red flags by checkpoint</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">CP1 green</span> Team roles clear · one crisp problem statement · you can name 3 real people with the pain.</div>
<div class="lz-layer"><span class="lz-lk">CP1 red</span> Still "3 ideas we might do" in week 3 · no defined customer.</div>
<div class="lz-layer"><span class="lz-lk">CP2 green</span> 20+ interviews · patterns quoted · survey with unbiased questions · sized market.</div>
<div class="lz-layer"><span class="lz-lk">CP2 red</span> "We asked our friends, they liked it."</div>
<div class="lz-layer"><span class="lz-lk">CP3 green</span> A working/faked MVP real users touched · a filled Business Model Canvas.</div>
<div class="lz-layer"><span class="lz-lk">CP3 red</span> Beautiful mockups no one has ever used.</div>
<div class="lz-layer"><span class="lz-lk">CP4 green</span> 10-slide story · one traction number · whole team fields questions.</div>
<div class="lz-layer"><span class="lz-lk">CP4 red</span> Reading slides · no evidence · froze on the first question.</div>
</div>

<div class="callout ok"><strong>The high-mark formula.</strong> Score = (real problem, proven) × (evidence from real customers) × (one number that moved) × (a team that can defend it). Miss any factor and the product drops fast. Nail all four and you are in 9-territory even with an "ordinary" idea.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Kill your own idea on purpose.</b> Once, run a "pre-mortem": imagine it's Demo Day and you failed — why? Write the top 3 reasons, then spend a week attacking the biggest. Founders who actively try to disprove themselves reach the truth faster than founders who defend. <em>A rationality practice used by real founders, beyond the syllabus.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.6</span>
<h2>7 kiểu đội mất điểm — và cách tránh từng cái</h2>
<p class="lead">EXE101 hiếm khi đánh trượt vì "làm chưa đủ". Nó đánh trượt vì <em>làm sai việc</em>: gọt slide bóng bẩy mà không nói chuyện với khách hàng nào. Đây là bảy thủ phạm kinh điển làm mất điểm.</p>
<table>
<thead><tr><th>#</th><th>Cách bạn mất điểm</th><th>Cách sửa</th></tr></thead>
<tbody>
<tr><td>1</td><td>Không có bằng chứng khách hàng thật — chỉ ý kiến</td><td>Phỏng vấn thật 20 người; trích lời họ vào deck</td></tr>
<tr><td>2</td><td>Giải pháp đi tìm vấn đề</td><td>Xuất phát từ vấn đề; chứng minh trước khi xây</td></tr>
<tr><td>3</td><td>Câu khảo sát mớm ("Bạn có dùng X không?")</td><td>Hỏi về hành vi quá khứ, không hỏi ý định tương lai (Mom Test)</td></tr>
<tr><td>4</td><td>Quy mô thị trường mơ hồ ("ai cũng cần")</td><td>Tính TAM/SAM/SOM với đường dẫn số thật</td></tr>
<tr><td>5</td><td>MVP tốn 4 tuần mà không ai dùng</td><td>Ra MVP giả/thủ công trong vài ngày; đo mức dùng</td></tr>
<tr><td>6</td><td>Một người làm hết; cả đội không trả lời được</td><td>Mỗi người sở hữu một slide và bảo vệ được</td></tr>
<tr><td>7</td><td>Pitch đọc slide, không câu chuyện, không lời mời</td><td>Kể chuyện; kết bằng một lời mời/bước tiếp rõ ràng</td></tr>
</tbody>
</table>

<h3>Cờ xanh / cờ đỏ theo checkpoint</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">CP1 xanh</span> Vai trò đội rõ · một phát biểu vấn đề sắc gọn · kể được tên 3 người thật có nỗi đau.</div>
<div class="lz-layer"><span class="lz-lk">CP1 đỏ</span> Tuần 3 còn "3 ý tưởng có thể làm" · chưa xác định khách hàng.</div>
<div class="lz-layer"><span class="lz-lk">CP2 xanh</span> 20+ phỏng vấn · trích được mẫu hình · khảo sát câu hỏi không thiên lệch · ước lượng thị trường.</div>
<div class="lz-layer"><span class="lz-lk">CP2 đỏ</span> "Bọn em hỏi bạn bè, họ thích."</div>
<div class="lz-layer"><span class="lz-lk">CP3 xanh</span> Một MVP chạy được/giả lập mà người dùng thật đã chạm · một Business Model Canvas đã điền.</div>
<div class="lz-layer"><span class="lz-lk">CP3 đỏ</span> Mockup đẹp mà chưa ai từng dùng.</div>
<div class="lz-layer"><span class="lz-lk">CP4 xanh</span> Câu chuyện 10 slide · một con số traction · cả đội đỡ được câu hỏi.</div>
<div class="lz-layer"><span class="lz-lk">CP4 đỏ</span> Đọc slide · không bằng chứng · đứng hình ở câu hỏi đầu tiên.</div>
</div>

<div class="callout ok"><strong>Công thức điểm cao.</strong> Điểm = (vấn đề thật, đã chứng minh) × (bằng chứng từ khách hàng thật) × (một con số biết di chuyển) × (một đội bảo vệ được). Thiếu bất kỳ thừa số nào là điểm rớt nhanh. Đủ cả bốn là bạn ở "vùng 9" kể cả với một ý tưởng "bình thường".</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Cố tình "giết" ý tưởng của chính mình.</b> Hãy chạy một "pre-mortem": tưởng tượng đã tới Demo Day và bạn thất bại — vì sao? Viết ra 3 lý do lớn nhất, rồi dành một tuần tấn công cái lớn nhất. Founder chủ động chứng minh mình sai chạm tới sự thật nhanh hơn founder chỉ lo bảo vệ. <em>Một thực hành tư duy của founder thật, ngoài syllabus.</em></div>
</div>`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 1 — TƯ DUY KHỞI NGHIỆP ══════════════════ */
    {
      title: 'Chapter 1 — The entrepreneurial mindset|||Chương 1 — Tư duy khởi nghiệp',
      description: 'Vì sao người ta khởi nghiệp, startup khác SME thế nào, và tư duy tăng trưởng 10x.',
      lessons: [
        {
          title: '1.1 — Startup vs SME & the 10x idea|||1.1 — Startup vs SME & ý tưởng 10x',
          slug: 'exe101-1-1-startup-vs-sme',
          type: 'VIDEO',
          description: 'Định nghĩa startup theo Paul Graham, phân biệt với doanh nghiệp nhỏ, và vì sao startup cần tăng trưởng 10x.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>A startup is a company designed to grow fast</h2>
<p class="lead">Paul Graham's definition: <strong>"A startup is a company designed to grow fast."</strong> Not every new business is a startup. A great phở shop is a wonderful business — but it is an <strong>SME</strong> (small-and-medium enterprise), not a startup, because it cannot serve a million customers next year without opening a million shops.</p>

<h3>The key difference — scalability</h3>
<table>
<thead><tr><th></th><th>SME (small business)</th><th>Startup</th></tr></thead>
<tbody>
<tr><td>Growth</td><td>Linear, steady</td><td>Exponential, fast</td></tr>
<tr><td>Scaling</td><td>More units = more staff/cost</td><td>Serve 10× users at ~same cost</td></tr>
<tr><td>Goal</td><td>Profitable & stable</td><td>Find a repeatable, scalable model</td></tr>
<tr><td>Example</td><td>A café, a salon</td><td>Grab, Shopee, Notion</td></tr>
</tbody>
</table>

<h3>Worked example — is "campus food pre-order" a startup?</h3>
<div class="out"><strong>Question:</strong> Team picks idea #4 (lunch pre-order near campus). Startup or SME?
<strong>Step 1 — can it scale?</strong> If it's just <em>your</em> canteen, it's a local service (SME-ish).
<strong>Step 2 — 10x test:</strong> could the <em>software</em> run pre-orders for 500 canteens across every FPT campus with almost no extra cost per canteen? Yes — software scales.
<strong>Conclusion:</strong> Framed as "one canteen's helper" → SME. Framed as "the pre-order platform any canteen plugs into" → startup. <strong>Same idea; the framing decides.</strong> Pick the scalable framing for EXE101.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>"Do things that don't scale" — first.</b> Counter-intuitively, YC tells early founders to do <em>unscalable</em> things at the start: hand-recruit your first 10 users, deliver the pho yourself. You scale the <em>model</em> later; you earn the <em>first users</em> by hand. Both truths coexist. <em>Paul Graham's essay, beyond the syllabus.</em></div>

<div class="pitfall"><strong>Trap:</strong> forcing "startup" language onto an idea that is really a local service. If you genuinely can't imagine 100k users, that's fine — but say so honestly and reframe, don't fake a hockey-stick chart.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Startup là công ty được thiết kế để tăng trưởng nhanh</h2>
<p class="lead">Định nghĩa của Paul Graham: <strong>"Startup là công ty được thiết kế để tăng trưởng nhanh."</strong> Không phải doanh nghiệp mới nào cũng là startup. Một quán phở ngon là một doanh nghiệp tuyệt vời — nhưng nó là <strong>SME</strong> (doanh nghiệp vừa và nhỏ), không phải startup, vì nó không thể phục vụ một triệu khách năm sau mà không mở một triệu quán.</p>

<h3>Khác biệt cốt lõi — khả năng mở rộng (scalability)</h3>
<table>
<thead><tr><th></th><th>SME (doanh nghiệp nhỏ)</th><th>Startup</th></tr></thead>
<tbody>
<tr><td>Tăng trưởng</td><td>Tuyến tính, ổn định</td><td>Cấp số nhân, nhanh</td></tr>
<tr><td>Mở rộng</td><td>Thêm cơ sở = thêm người/chi phí</td><td>Phục vụ 10× người dùng ở ~cùng chi phí</td></tr>
<tr><td>Mục tiêu</td><td>Có lãi & ổn định</td><td>Tìm mô hình lặp lại được & mở rộng được</td></tr>
<tr><td>Ví dụ</td><td>Quán cà phê, tiệm tóc</td><td>Grab, Shopee, Notion</td></tr>
</tbody>
</table>

<h3>Ví dụ có lời giải — "đặt cơm trước quanh trường" có phải startup?</h3>
<div class="out"><strong>Câu hỏi:</strong> Đội chọn ý tưởng #4 (đặt cơm trước giờ trưa quanh trường). Startup hay SME?
<strong>Bước 1 — có mở rộng được không?</strong> Nếu chỉ là căng-tin <em>của bạn</em>, đó là dịch vụ địa phương (kiểu SME).
<strong>Bước 2 — phép thử 10x:</strong> liệu <em>phần mềm</em> có thể chạy đặt cơm cho 500 căng-tin khắp mọi campus FPT với chi phí thêm gần như bằng 0 mỗi căng-tin không? Có — phần mềm mở rộng được.
<strong>Kết luận:</strong> Đóng khung là "trợ lý một căng-tin" → SME. Đóng khung là "nền tảng đặt trước mà bất kỳ căng-tin nào cắm vào" → startup. <strong>Cùng một ý tưởng; cách đóng khung quyết định.</strong> Chọn cách đóng khung mở rộng được cho EXE101.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>"Làm những việc không mở rộng được" — trước đã.</b> Ngược đời thay, YC bảo founder giai đoạn đầu làm những việc <em>không mở rộng</em>: đi tuyển tay 10 người dùng đầu, tự giao phở. Bạn mở rộng <em>mô hình</em> sau; bạn kiếm <em>người dùng đầu tiên</em> bằng tay. Cả hai đúng cùng lúc. <em>Bài luận của Paul Graham, ngoài syllabus.</em></div>

<div class="pitfall"><strong>Bẫy:</strong> ép ngôn ngữ "startup" lên một ý tưởng thực chất là dịch vụ địa phương. Nếu bạn thật sự không hình dung nổi 100k người dùng, không sao — nhưng hãy nói thật và đóng khung lại, đừng vẽ biểu đồ hockey-stick giả.</div>
</div>`,
        },
        {
          title: '1.2 — Why founders start & the reality of the journey|||1.2 — Vì sao founder khởi nghiệp & thực tế hành trình',
          slug: 'exe101-1-2-why-start',
          type: 'VIDEO',
          description: 'Động lực đúng vs sai khi khởi nghiệp, đường cong cảm xúc của founder, và tinh thần bền bỉ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>Start for the problem, not the title</h2>
<p class="lead">The founders who last are pulled by a <strong>problem they can't stop thinking about</strong>, not pushed by "I want to be a CEO." Wrong reasons (status, quick money, hating your boss) burn out at the first hard month. Right reasons (this problem matters, I'm the person to fix it) survive the "trough of sorrow."</p>

<h3>The emotional curve every founder rides</h3>
<div class="diagram">Excitement ▲
           │    ___
           │   /   \\        Startup School calls the dip
           │  /     \\____   the "Trough of Sorrow"
           │ /            \\____/‾‾‾ crawl of hope → traction
           └────────────────────────▶ time
             launch    it's hard     you learn &amp; adapt</div>
<p>Knowing the curve exists is half the battle. Week 4-6 (right when checkpoint 2 lands) is usually the trough — the idea feels dead, interviews are discouraging. Teams that expect this <em>keep going</em>; teams that don't, quit.</p>

<div class="callout ok"><strong>For EXE101 specifically:</strong> the trough is your <em>data</em>, not your failure. "We thought X, customers actually said Y, so we pivoted to Z" is one of the strongest stories you can tell at Demo Day. Instructors reward learning, not luck.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Grit beats brilliance.</b> Research by Angela Duckworth shows persistence predicts success more than raw talent. In startups it's called <em>default alive</em> thinking: keep the team moving in short weekly loops so momentum never fully dies. <em>Beyond the syllabus, but the trait instructors quietly grade.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Khởi nghiệp vì vấn đề, không vì chức danh</h2>
<p class="lead">Những founder trụ lại được bị <strong>một vấn đề mà họ không ngừng nghĩ tới</strong> kéo đi, không phải bị "tôi muốn làm CEO" đẩy đi. Lý do sai (địa vị, tiền nhanh, ghét sếp) cháy sạch ở tháng khó đầu tiên. Lý do đúng (vấn đề này quan trọng, tôi là người nên sửa nó) sống sót qua "vực sầu".</p>

<h3>Đường cong cảm xúc mà mọi founder đều trải</h3>
<div class="diagram">Hưng phấn ▲
          │    ___
          │   /   \\        Startup School gọi đáy này
          │  /     \\____   là "Vực Sầu" (Trough of Sorrow)
          │ /            \\____/‾‾‾ bò lên hy vọng → traction
          └────────────────────────▶ thời gian
            ra mắt    khó khăn     bạn học &amp; thích nghi</div>
<p>Biết đường cong này tồn tại đã là nửa trận đánh. Tuần 4-6 (đúng lúc checkpoint 2 tới) thường là đáy — ý tưởng như đã chết, phỏng vấn gây nản. Đội nào lường trước điều này thì <em>đi tiếp</em>; đội nào không thì bỏ cuộc.</p>

<div class="callout ok"><strong>Riêng với EXE101:</strong> vực sầu là <em>dữ liệu</em> của bạn, không phải thất bại. "Bọn em nghĩ X, khách hàng thực ra nói Y, nên bọn em xoay sang Z" là một trong những câu chuyện mạnh nhất bạn có thể kể ở Demo Day. Giảng viên thưởng cho sự học hỏi, không thưởng cho may mắn.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Bền bỉ thắng thông minh.</b> Nghiên cứu của Angela Duckworth cho thấy sự kiên trì dự báo thành công tốt hơn tài năng thô. Trong startup gọi là tư duy <em>default alive</em>: giữ đội di chuyển trong các vòng tuần ngắn để đà không bao giờ tắt hẳn. <em>Ngoài syllabus, nhưng là phẩm chất giảng viên âm thầm chấm.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              {
                id: 'q1', points: 1,
                question: "By Paul Graham's definition, what makes a company a startup?|||Theo định nghĩa của Paul Graham, điều gì khiến một công ty là startup?",
                options: [
                  'It uses technology|||Nó dùng công nghệ',
                  'It is designed to grow fast (scalable)|||Nó được thiết kế để tăng trưởng nhanh (mở rộng được)',
                  'It has raised money|||Nó đã gọi được vốn',
                  'It is registered as a company|||Nó đã đăng ký thành công ty',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'A profitable café that grows by opening more branches is best described as:|||Một quán cà phê có lãi, tăng trưởng bằng cách mở thêm chi nhánh, được mô tả đúng nhất là:',
                options: ['A startup|||Một startup', 'An SME / small business|||Một SME / doanh nghiệp nhỏ', 'A unicorn|||Một kỳ lân', 'A non-profit|||Một tổ chức phi lợi nhuận'],
                correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'The "trough of sorrow" around week 4-6 should be treated as:|||"Vực sầu" quanh tuần 4-6 nên được coi là:',
                options: [
                  'A sign to quit the idea|||Dấu hiệu nên bỏ ý tưởng',
                  'Normal, and a source of learning/pivot data|||Bình thường, và là nguồn dữ liệu học hỏi/xoay hướng',
                  'A grading penalty|||Một khoản trừ điểm',
                  'Proof the market is too small|||Bằng chứng thị trường quá nhỏ',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: '(Beyond syllabus) YC advises early founders to first:|||(Ngoài giáo trình) YC khuyên founder giai đoạn đầu trước hết nên:',
                options: [
                  'Automate everything immediately|||Tự động hoá mọi thứ ngay',
                  'Do things that don\'t scale (hand-recruit first users)|||Làm những việc không mở rộng được (đi tuyển tay người dùng đầu)',
                  'Raise a large round first|||Gọi một vòng vốn lớn trước',
                  'Hire 10 engineers|||Tuyển 10 kỹ sư',
                ], correctIndex: 1,
              },
              {
                id: 'q5', points: 1,
                question: 'The strongest motivation for a lasting founder is:|||Động lực mạnh nhất cho một founder bền bỉ là:',
                options: [
                  'Wanting the CEO title|||Muốn chức danh CEO',
                  'A problem they deeply care about and can solve|||Một vấn đề họ thực sự quan tâm và có thể giải',
                  'Making quick money|||Kiếm tiền nhanh',
                  'Disliking their current job|||Không thích công việc hiện tại',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 2 — LẬP ĐỘI CHIẾN THẮNG ══════════════════ */
    {
      title: 'Chapter 2 — Build a winning team|||Chương 2 — Lập đội chiến thắng',
      description: 'Chọn đồng sáng lập, chia vai trò & cổ phần, và vì sao xung đột đội giết startup nhiều hơn đối thủ.',
      lessons: [
        {
          title: '2.1 — Co-founders, roles & equity|||2.1 — Đồng sáng lập, vai trò & cổ phần',
          slug: 'exe101-2-1-team-equity',
          type: 'VIDEO',
          description: 'Tiêu chí chọn đồng sáng lập, phân vai theo thế mạnh, và nguyên tắc chia cổ phần công bằng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Team failure kills more startups than competitors</h2>
<p class="lead">YC data: <strong>co-founder conflict is a top reason early startups die</strong> — ahead of running out of money or being out-competed. In EXE101 the same is true: the teams that implode do so over unclear roles and unfair effort, not over the idea.</p>

<h3>Choosing co-founders — what actually matters</h3>
<ul>
<li><strong>Complementary skills</strong> — not five people who all only design slides. Cover: product/build, customers/sell, coordinate/PM.</li>
<li><strong>Shared values & work ethic</strong> — how you handle a bad week matters more than raw talent.</li>
<li><strong>You've worked together before</strong> — a class project counts; you know who ships.</li>
<li><strong>Honest communication</strong> — can you disagree without it becoming personal?</li>
</ul>

<h3>Worked example — split roles for a 5-person team</h3>
<div class="out"><strong>Idea:</strong> campus second-hand marketplace (idea #1). Sensible split:
• <strong>CEO / customer lead</strong> — owns interviews, pitch, decisions.
• <strong>Product lead</strong> — owns MVP scope & screens.
• <strong>Research lead</strong> — owns survey, market sizing, competitors.
• <strong>Ops / build lead</strong> — owns the actual thing users touch (even if no-code).
• <strong>Design / story lead</strong> — owns deck, brand, demo script.
<strong>Rule:</strong> one owner per area (a "single wringable neck"), but everyone helps. Owner ≠ does-it-alone.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Equity: split by future, not past.</b> Real founders are warned against splitting equity by "who had the idea." The idea is ~1% of the work; execution over years is 99%. For a class, agree effort norms up front and a fair contribution split. <em>Slicing-pie / dynamic-equity thinking is beyond the syllabus but prevents the classic "founder who did nothing kept half" story.</em></div>

<div class="pitfall"><strong>Trap:</strong> "we're all friends, we'll figure roles out later." Undefined roles = week-6 resentment. Write roles down in checkpoint 1.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Đội tan rã giết startup nhiều hơn đối thủ</h2>
<p class="lead">Dữ liệu YC: <strong>xung đột đồng sáng lập là một trong những lý do hàng đầu khiến startup giai đoạn đầu chết</strong> — hơn cả hết tiền hay bị đối thủ vượt. Ở EXE101 cũng vậy: đội nào nổ tung là vì vai trò không rõ và công sức không công bằng, không phải vì ý tưởng.</p>

<h3>Chọn đồng sáng lập — điều gì thực sự quan trọng</h3>
<ul>
<li><strong>Kỹ năng bổ trợ</strong> — không phải năm người đều chỉ biết làm slide. Phủ: xây sản phẩm, khách hàng/bán, điều phối/PM.</li>
<li><strong>Chung giá trị & đạo đức làm việc</strong> — cách xử lý một tuần tệ quan trọng hơn tài năng thô.</li>
<li><strong>Đã từng làm việc cùng nhau</strong> — một đồ án lớp cũng tính; bạn biết ai thực sự ra sản phẩm.</li>
<li><strong>Giao tiếp thẳng thắn</strong> — bất đồng được mà không thành chuyện cá nhân không?</li>
</ul>

<h3>Ví dụ có lời giải — chia vai cho đội 5 người</h3>
<div class="out"><strong>Ý tưởng:</strong> chợ đồ cũ trong trường (ý tưởng #1). Cách chia hợp lý:
• <strong>CEO / phụ trách khách hàng</strong> — sở hữu phỏng vấn, pitch, quyết định.
• <strong>Phụ trách sản phẩm</strong> — sở hữu scope MVP & màn hình.
• <strong>Phụ trách nghiên cứu</strong> — sở hữu khảo sát, ước lượng thị trường, đối thủ.
• <strong>Phụ trách vận hành/xây</strong> — sở hữu thứ mà người dùng thật chạm vào (kể cả no-code).
• <strong>Phụ trách thiết kế/câu chuyện</strong> — sở hữu deck, thương hiệu, kịch bản demo.
<strong>Nguyên tắc:</strong> mỗi mảng một chủ (một "cái cổ chịu trách nhiệm"), nhưng ai cũng hỗ trợ. Chủ ≠ làm một mình.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Cổ phần: chia theo tương lai, không theo quá khứ.</b> Founder thật được cảnh báo đừng chia cổ phần theo "ai nghĩ ra ý tưởng". Ý tưởng chỉ ~1% công việc; thực thi qua nhiều năm là 99%. Với đồ án lớp, hãy thống nhất chuẩn công sức từ đầu và cách chia đóng góp công bằng. <em>Tư duy slicing-pie / cổ phần động ngoài syllabus nhưng ngăn câu chuyện kinh điển "founder không làm gì vẫn giữ nửa phần".</em></div>

<div class="pitfall"><strong>Bẫy:</strong> "bọn mình bạn bè cả, vai trò tính sau." Vai trò không rõ = bực bội tuần 6. Viết vai trò ra ở checkpoint 1.</div>
</div>`,
        },
        {
          title: '2.2 — Teamwork that survives 10 weeks|||2.2 — Làm việc nhóm sống sót 10 tuần',
          slug: 'exe101-2-2-teamwork',
          type: 'VIDEO',
          description: 'Nhịp họp hàng tuần, nhật ký quyết định, xử lý xung đột và thành viên "chìm".',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Rhythm beats heroics</h2>
<p class="lead">A team that meets 30 minutes every week and ships something small each time will crush a team that plans one heroic all-nighter before each checkpoint. Startups run on <strong>short loops</strong>: decide → do → review → decide.</p>

<h3>A weekly team operating system</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Monday 15'</span> What's this week's ONE experiment? Who owns each task?</div>
<div class="lz-layer"><span class="lz-lk">Midweek async</span> Post progress + blockers in the group chat; no meeting needed.</div>
<div class="lz-layer"><span class="lz-lk">Friday 20'</span> What did we learn? Update the source-of-truth doc. Decide next week.</div>
</div>
<p>Keep a <strong>decision log</strong>: date, decision, why. It stops the "wait, why did we choose that?" spiral and makes your Demo Day story ("we pivoted here because…") effortless.</p>

<h3>Handling the two hard cases</h3>
<ul>
<li><strong>Conflict:</strong> separate the person from the problem. "I disagree with the plan" not "you're wrong." Decide by evidence (what did customers say?), not by volume.</li>
<li><strong>A silent / absent member:</strong> address it early and directly, one-on-one. Reassign or shrink their scope. Don't let resentment build to week 9 — and remember the 80% attendance gate is individual.</li>
</ul>

<div class="callout ok"><strong>Checkpoint tie-in:</strong> instructors literally grade "effective teamwork" (CLO2). Being able to say "here's our weekly cadence and decision log" is direct evidence — show it.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Tuckman's stages: forming → storming → norming → performing.</b> Every team hits "storming" (friction) around week 3-4. Naming it out loud — "we're in storming, that's normal, let's set norms" — moves you to "norming" faster. <em>An organizational-behavior model beyond the EXE syllabus, but it demystifies the week-4 tension.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Nhịp điệu thắng sự anh hùng</h2>
<p class="lead">Một đội họp 30 phút mỗi tuần và ra một thứ nhỏ mỗi lần sẽ đè bẹp một đội định thức trắng một đêm anh hùng trước mỗi checkpoint. Startup chạy bằng <strong>vòng lặp ngắn</strong>: quyết → làm → xem lại → quyết.</p>

<h3>Hệ điều hành đội hàng tuần</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Thứ Hai 15'</span> Thí nghiệm DUY NHẤT tuần này là gì? Ai sở hữu mỗi việc?</div>
<div class="lz-layer"><span class="lz-lk">Giữa tuần async</span> Đăng tiến độ + điểm nghẽn vào chat nhóm; không cần họp.</div>
<div class="lz-layer"><span class="lz-lk">Thứ Sáu 20'</span> Học được gì? Cập nhật tài liệu nguồn-sự-thật. Quyết tuần sau.</div>
</div>
<p>Giữ một <strong>nhật ký quyết định</strong>: ngày, quyết định, vì sao. Nó chặn vòng xoáy "khoan, sao mình lại chọn cái đó?" và khiến câu chuyện Demo Day ("bọn em xoay hướng ở đây vì…") trở nên dễ dàng.</p>

<h3>Xử lý hai ca khó</h3>
<ul>
<li><strong>Xung đột:</strong> tách con người khỏi vấn đề. "Tôi không đồng ý với kế hoạch" chứ không phải "bạn sai". Quyết bằng bằng chứng (khách hàng nói gì?), không bằng ai nói to hơn.</li>
<li><strong>Thành viên im lặng / vắng mặt:</strong> xử lý sớm và trực tiếp, một-một. Giao lại hoặc thu nhỏ phạm vi của họ. Đừng để bực bội dồn tới tuần 9 — và nhớ cổng điểm danh 80% là của từng cá nhân.</li>
</ul>

<div class="callout ok"><strong>Gắn với checkpoint:</strong> giảng viên chấm đúng nghĩa đen "làm việc nhóm hiệu quả" (CLO2). Nói được "đây là nhịp tuần và nhật ký quyết định của bọn em" là bằng chứng trực tiếp — hãy trưng ra.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Các giai đoạn Tuckman: forming → storming → norming → performing.</b> Đội nào cũng chạm "storming" (va chạm) quanh tuần 3-4. Gọi tên nó ra — "bọn mình đang storming, bình thường thôi, đặt luật chơi nào" — giúp bạn sang "norming" nhanh hơn. <em>Một mô hình hành vi tổ chức ngoài syllabus EXE, nhưng nó giải toả căng thẳng tuần 4.</em></div>
</div>`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 3 — TÌM & ĐÁNH GIÁ Ý TƯỞNG ══════════════════ */
    {
      title: 'Chapter 3 — Find & evaluate an idea|||Chương 3 — Tìm & đánh giá ý tưởng',
      description: 'Sinh ý tưởng từ vấn đề, đánh giá bằng bộ lọc, và ước lượng "ý tưởng có đủ lớn không".',
      lessons: [
        {
          title: '3.1 — Problem-first idea generation|||3.1 — Sinh ý tưởng xuất phát từ vấn đề',
          slug: 'exe101-3-1-idea-generation',
          type: 'VIDEO',
          description: 'Vì sao bắt đầu từ vấn đề thắng bắt đầu từ giải pháp, và cách săn vấn đề quanh bạn.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Fall in love with the problem, not the solution</h2>
<p class="lead">The most common student mistake is <strong>solution-first thinking</strong>: "let's build an app with AI!" — then hunting for a problem it might solve. Winners go the other way: find a <strong>real, painful, frequent problem</strong> first; the solution is the easy part.</p>

<h3>Where good problems hide</h3>
<ul>
<li><strong>Your own annoyances</strong> — "every semester I struggle to…". You are the expert customer.</li>
<li><strong>Things people already pay for badly</strong> — clunky, expensive, manual workflows.</li>
<li><strong>"I wish there was…"</strong> overheard from friends, family, local shops.</li>
<li><strong>Changes creating new needs</strong> — new rules, new tech, new habits.</li>
</ul>

<h3>Worked example — turn an annoyance into an idea</h3>
<div class="out"><strong>Annoyance:</strong> "Finding a good used textbook before the semester is painful — Facebook groups are chaos, scams everywhere."
<strong>Problem statement:</strong> FPT students waste time & money and risk scams buying/selling used course materials each semester.
<strong>Who:</strong> ~thousands of students, every semester, predictable timing.
<strong>Frequency:</strong> 2-3× per year → recurring, not one-off.
<strong>Result:</strong> strong candidate — real, frequent, reachable, you live it. That's idea #1.</div>

<div class="callout ok"><strong>Sharpen it into one sentence:</strong> "[Who] struggles to [do what] because [why], and today they cope by [current bad workaround]." If you can say this crisply, checkpoint 1 is basically done.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>"Vitamins vs painkillers."</b> Investors distinguish <em>painkillers</em> (solve an urgent pain — people pay now) from <em>vitamins</em> (nice-to-have — people forget). Aim for a painkiller. Test: if it vanished tomorrow, would anyone be genuinely upset? <em>A framing beyond the syllabus that predicts which ideas get traction.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Yêu vấn đề, đừng yêu giải pháp</h2>
<p class="lead">Sai lầm phổ biến nhất của sinh viên là <strong>tư duy giải-pháp-trước</strong>: "làm một app có AI đi!" — rồi đi săn một vấn đề nó có thể giải. Người thắng đi ngược lại: tìm một <strong>vấn đề thật, đau, thường xuyên</strong> trước; giải pháp là phần dễ.</p>

<h3>Vấn đề tốt ẩn ở đâu</h3>
<ul>
<li><strong>Khó chịu của chính bạn</strong> — "kỳ nào tôi cũng vật lộn với…". Bạn là khách hàng chuyên gia.</li>
<li><strong>Thứ người ta đã trả tiền một cách tệ</strong> — quy trình lằng nhằng, đắt, thủ công.</li>
<li><strong>"Giá mà có…"</strong> nghe lỏm từ bạn bè, gia đình, tiệm quán quanh nhà.</li>
<li><strong>Thay đổi tạo nhu cầu mới</strong> — luật mới, công nghệ mới, thói quen mới.</li>
</ul>

<h3>Ví dụ có lời giải — biến một khó chịu thành ý tưởng</h3>
<div class="out"><strong>Khó chịu:</strong> "Tìm giáo trình cũ tốt trước kỳ học rất mệt — group Facebook thì hỗn loạn, lừa đảo khắp nơi."
<strong>Phát biểu vấn đề:</strong> Sinh viên FPT tốn thời gian & tiền và có nguy cơ bị lừa khi mua/bán tài liệu môn học cũ mỗi kỳ.
<strong>Ai:</strong> ~hàng nghìn sinh viên, mỗi kỳ, thời điểm dự đoán được.
<strong>Tần suất:</strong> 2-3 lần/năm → lặp lại, không phải một lần.
<strong>Kết quả:</strong> ứng viên mạnh — thật, thường xuyên, tiếp cận được, bạn sống với nó. Đó là ý tưởng #1.</div>

<div class="callout ok"><strong>Mài thành một câu:</strong> "[Ai] vật lộn để [làm gì] vì [vì sao], và hiện tại họ chống chọi bằng [cách chắp vá tệ hiện tại]." Nói được câu này gọn ghẽ là checkpoint 1 gần như xong.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>"Vitamin vs thuốc giảm đau."</b> Nhà đầu tư phân biệt <em>thuốc giảm đau</em> (giải một nỗi đau cấp bách — người ta trả tiền ngay) với <em>vitamin</em> (có thì tốt — người ta quên). Nhắm tới thuốc giảm đau. Phép thử: nếu mai nó biến mất, có ai thực sự buồn không? <em>Một cách đóng khung ngoài syllabus dự báo ý tưởng nào có traction.</em></div>
</div>`,
        },
        {
          title: '3.2 — Evaluate an idea & size the market (10x)|||3.2 — Đánh giá ý tưởng & ước lượng thị trường (10x)',
          slug: 'exe101-3-2-evaluate-market',
          type: 'VIDEO',
          description: 'Chấm ý tưởng theo bộ lọc, và tính "thị trường có đủ lớn không" bằng ước lượng đơn giản.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Score the idea before you fall for it</h2>
<p class="lead">Run your candidate through the 6-test filter from lesson 0.5, then do a quick <strong>market size sanity check</strong>. You don't need perfect numbers — you need a defensible <em>order of magnitude</em>.</p>

<h3>Worked example — is the used-textbook market "big enough"?</h3>
<div class="out"><strong>Napkin math (top-down):</strong>
• FPT University ≈ 100,000 students across campuses (rough).
• Say 60% buy/sell used materials each semester → 60,000 active users.
• × 2 semesters → 120,000 transactions/year.
• If you take a tiny 5,000đ fee per deal → 600,000,000đ/year at just FPT.
<strong>Now the 10x test:</strong> the SAME software works for every university in Vietnam (millions of students). Order of magnitude: potentially billions/year.
<strong>Conclusion:</strong> big enough to be a startup, not just a class exercise. The number is rough — that's fine; you're proving the <em>scale</em>, not forecasting revenue.</div>

<h3>TAM / SAM / SOM — the three rings you'll present</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">TAM</span> Total Addressable Market — everyone with the problem (all VN students).</div>
<div class="lz-layer"><span class="lz-lk">SAM</span> Serviceable Available Market — those you can actually serve (students on campuses you reach).</div>
<div class="lz-layer"><span class="lz-lk">SOM</span> Serviceable Obtainable Market — what you can realistically win first (your campus, year 1).</div>
</div>

<div class="pitfall"><strong>Trap:</strong> "the market is everyone, so it's huge." Vague hugeness scores <em>lower</em> than a modest, well-reasoned SOM. Instructors trust a clear 60,000 far more than a hand-wavy "millions."</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Bottom-up beats top-down.</b> Instead of "1% of a huge market," build up: "50 users × 3 orders/month × 5,000đ = …". Bottom-up numbers are harder to fake and far more convincing in a pitch, because each assumption is checkable. <em>A market-sizing technique beyond the syllabus that VCs specifically look for.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Chấm điểm ý tưởng trước khi trót yêu nó</h2>
<p class="lead">Cho ứng viên của bạn chạy qua bộ lọc 6 phép thử ở bài 0.5, rồi làm một <strong>phép kiểm quy mô thị trường</strong> nhanh. Bạn không cần số hoàn hảo — bạn cần một <em>bậc độ lớn</em> bảo vệ được.</p>

<h3>Ví dụ có lời giải — thị trường giáo trình cũ có "đủ lớn" không?</h3>
<div class="out"><strong>Tính nhẩm (từ trên xuống):</strong>
• Đại học FPT ≈ 100.000 sinh viên khắp các campus (ước chừng).
• Giả sử 60% mua/bán tài liệu cũ mỗi kỳ → 60.000 người dùng tích cực.
• × 2 kỳ → 120.000 giao dịch/năm.
• Nếu lấy phí bé xíu 5.000đ/giao dịch → 600.000.000đ/năm chỉ riêng ở FPT.
<strong>Giờ phép thử 10x:</strong> CÙNG phần mềm chạy được cho mọi đại học ở Việt Nam (hàng triệu sinh viên). Bậc độ lớn: có thể lên tỷ đồng/năm.
<strong>Kết luận:</strong> đủ lớn để là startup, không chỉ bài tập lớp. Con số ước chừng — không sao; bạn đang chứng minh <em>quy mô</em>, không dự báo doanh thu.</div>

<h3>TAM / SAM / SOM — ba vòng bạn sẽ trình bày</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">TAM</span> Tổng thị trường tiềm năng — tất cả ai có vấn đề (mọi sinh viên VN).</div>
<div class="lz-layer"><span class="lz-lk">SAM</span> Thị trường phục vụ được — những người bạn thực sự phục vụ được (SV ở các campus bạn tới).</div>
<div class="lz-layer"><span class="lz-lk">SOM</span> Thị trường giành được — cái bạn giành thực tế trước (campus của bạn, năm 1).</div>
</div>

<div class="pitfall"><strong>Bẫy:</strong> "thị trường là tất cả mọi người nên nó khổng lồ." Sự khổng lồ mơ hồ điểm <em>thấp hơn</em> một SOM khiêm tốn nhưng lý lẽ chặt. Giảng viên tin một con số 60.000 rõ ràng hơn nhiều so với "hàng triệu" khua tay.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Từ dưới lên thắng từ trên xuống.</b> Thay vì "1% của một thị trường khổng lồ", hãy dựng lên: "50 người dùng × 3 đơn/tháng × 5.000đ = …". Con số từ dưới lên khó bịa hơn và thuyết phục hơn nhiều trong pitch, vì mỗi giả định đều kiểm được. <em>Một kỹ thuật ước lượng thị trường ngoài syllabus mà VC đặc biệt tìm.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'The recommended way to find a startup idea is:|||Cách được khuyến nghị để tìm ý tưởng khởi nghiệp là:',
                options: [
                  'Solution-first: pick a cool technology, then find a use|||Giải-pháp-trước: chọn công nghệ hay rồi tìm chỗ dùng',
                  'Problem-first: find a real, frequent pain, then solve it|||Vấn-đề-trước: tìm nỗi đau thật, thường xuyên rồi giải',
                  'Copy the biggest company exactly|||Sao chép y hệt công ty lớn nhất',
                  'Ask an AI to invent one|||Nhờ AI bịa ra một cái',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'In TAM/SAM/SOM, which one is what you realistically win first (e.g. your campus, year 1)?|||Trong TAM/SAM/SOM, cái nào là thứ bạn giành thực tế trước (vd campus của bạn, năm 1)?',
                options: ['TAM', 'SAM', 'SOM', 'None|||Không cái nào'],
                correctIndex: 2,
              },
              {
                id: 'q3', points: 1,
                question: 'A "painkiller" idea (vs a "vitamin") is one that:|||Ý tưởng "thuốc giảm đau" (so với "vitamin") là ý tưởng:',
                options: [
                  'Is nice-to-have and easily forgotten|||Có thì tốt và dễ bị quên',
                  'Solves an urgent pain people would miss if it vanished|||Giải nỗi đau cấp bách mà người ta sẽ nhớ nếu nó biến mất',
                  'Uses the newest technology|||Dùng công nghệ mới nhất',
                  'Is cheapest to build|||Rẻ nhất để xây',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: '(Beyond syllabus) Why is bottom-up market sizing more convincing than top-down?|||(Ngoài giáo trình) Vì sao ước lượng thị trường từ dưới lên thuyết phục hơn từ trên xuống?',
                options: [
                  'It always gives a bigger number|||Nó luôn cho con số lớn hơn',
                  'Each assumption is concrete and checkable|||Mỗi giả định cụ thể và kiểm được',
                  'It requires no data|||Nó không cần dữ liệu',
                  'It is faster to compute|||Nó tính nhanh hơn',
                ], correctIndex: 1,
              },
              {
                id: 'q5', points: 1,
                question: 'Which market claim would an instructor trust most?|||Tuyên bố thị trường nào giảng viên tin nhất?',
                options: [
                  '"Everyone needs this, the market is millions."|||"Ai cũng cần, thị trường là hàng triệu."',
                  '"~60,000 FPT students buy used materials each semester; here is the math."|||"~60.000 SV FPT mua tài liệu cũ mỗi kỳ; đây là phép tính."',
                  '"It is a huge global opportunity."|||"Đây là cơ hội toàn cầu khổng lồ."',
                  '"Trust us, it is big."|||"Tin bọn em đi, nó lớn lắm."',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 4 — KHÁCH HÀNG & MARKET-FIT ══════════════════ */
    {
      title: 'Chapter 4 — Customers & product-market fit|||Chương 4 — Khách hàng & product-market fit',
      description: 'Phỏng vấn khách hàng đúng cách (The Mom Test), problem-solution fit và product-market fit.',
      lessons: [
        {
          title: '4.1 — Customer interviews & The Mom Test|||4.1 — Phỏng vấn khách hàng & The Mom Test',
          slug: 'exe101-4-1-mom-test',
          type: 'VIDEO',
          description: 'Cách phỏng vấn để lấy sự thật, không lấy lời khen; hỏi hành vi quá khứ thay vì ý định tương lai.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Interviews that get truth, not compliments</h2>
<p class="lead">Rob Fitzpatrick's <em>The Mom Test</em> makes one point: <strong>never ask "would you use my product?"</strong> Everyone lies to be nice (even your mom). Instead ask about their <strong>past behavior and current pain</strong> — facts they can't fake.</p>

<h3>Bad questions vs good questions</h3>
<table>
<thead><tr><th>❌ Bad (invites lying)</th><th>✅ Good (asks for facts)</th></tr></thead>
<tbody>
<tr><td>"Would you use an app for this?"</td><td>"Tell me about the last time you had this problem."</td></tr>
<tr><td>"Do you think this is a good idea?"</td><td>"What did you do to solve it? How much did it cost you?"</td></tr>
<tr><td>"Would you pay 50k for it?"</td><td>"What have you already paid to deal with this?"</td></tr>
</tbody>
</table>

<h3>Worked example — a Mom-Test interview snippet</h3>
<div class="out"><strong>You:</strong> "Walk me through how you got your textbooks last semester."
<strong>Them:</strong> "I searched three Facebook groups, messaged five people, two ghosted me, I overpaid one, and one book was the wrong edition."
<strong>You:</strong> "How long did that take? How did it feel?"
<strong>Them:</strong> "Two weeks, super annoying, I almost gave up and bought new."
<strong>What you just learned:</strong> real pain (2 weeks, frustration, scam risk), current workaround (FB groups), and even willingness to pay (bought new = spent more). <strong>Zero leading questions. Pure gold for checkpoint 2.</strong></div>

<div class="callout warn"><strong>Rule of 20:</strong> aim for ~20 real conversations before checkpoint 2. Patterns appear around interview 8-12; 20 gives you quotable confidence.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Signal words: "always / usually" beats "would / might".</b> Past-tense, specific answers ("last Tuesday I…") are signal; future, hypothetical answers ("I'd probably…") are noise. Weight your notes accordingly. <em>A practitioner's filter beyond the syllabus for separating real demand from politeness.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Phỏng vấn để lấy sự thật, không lấy lời khen</h2>
<p class="lead">Cuốn <em>The Mom Test</em> của Rob Fitzpatrick chốt một ý: <strong>đừng bao giờ hỏi "bạn có dùng sản phẩm của tôi không?"</strong> Ai cũng nói dối cho dễ thương (kể cả mẹ bạn). Thay vào đó hỏi về <strong>hành vi quá khứ và nỗi đau hiện tại</strong> — những sự thật họ không bịa được.</p>

<h3>Câu hỏi tệ vs câu hỏi tốt</h3>
<table>
<thead><tr><th>❌ Tệ (mời nói dối)</th><th>✅ Tốt (hỏi sự thật)</th></tr></thead>
<tbody>
<tr><td>"Bạn có dùng một app cho việc này không?"</td><td>"Kể cho tôi lần gần nhất bạn gặp vấn đề này."</td></tr>
<tr><td>"Bạn thấy ý tưởng này hay không?"</td><td>"Bạn đã làm gì để giải nó? Tốn bao nhiêu?"</td></tr>
<tr><td>"Bạn có trả 50k cho nó không?"</td><td>"Bạn đã từng trả gì để xử lý việc này?"</td></tr>
</tbody>
</table>

<h3>Ví dụ có lời giải — một đoạn phỏng vấn kiểu Mom-Test</h3>
<div class="out"><strong>Bạn:</strong> "Kể mình nghe bạn kiếm giáo trình kỳ trước thế nào."
<strong>Họ:</strong> "Tôi lục ba group Facebook, nhắn năm người, hai người lơ, tôi mua hớ một cuốn, và một cuốn sai phiên bản."
<strong>Bạn:</strong> "Mất bao lâu? Cảm giác thế nào?"
<strong>Họ:</strong> "Hai tuần, siêu bực, suýt bỏ cuộc mua sách mới."
<strong>Bạn vừa học được:</strong> nỗi đau thật (2 tuần, bực bội, nguy cơ lừa), cách chống chọi hiện tại (group FB), và cả sẵn lòng trả tiền (mua mới = tốn hơn). <strong>Không câu mớm nào. Vàng ròng cho checkpoint 2.</strong></div>

<div class="callout warn"><strong>Quy tắc 20:</strong> nhắm ~20 cuộc trò chuyện thật trước checkpoint 2. Mẫu hình xuất hiện quanh phỏng vấn thứ 8-12; 20 cho bạn sự tự tin để trích dẫn.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Từ tín hiệu: "luôn / thường" thắng "sẽ / có thể".</b> Câu trả lời quá khứ, cụ thể ("thứ Ba tuần trước tôi…") là tín hiệu; câu tương lai, giả định ("chắc tôi sẽ…") là nhiễu. Cân trọng số ghi chú theo đó. <em>Bộ lọc của người làm nghề, ngoài syllabus, để tách nhu cầu thật khỏi phép lịch sự.</em></div>
</div>`,
        },
        {
          title: '4.2 — Problem-solution fit → product-market fit|||4.2 — Problem-solution fit → product-market fit',
          slug: 'exe101-4-2-pmf',
          type: 'VIDEO',
          description: 'Hai cột mốc: khớp vấn đề-giải pháp rồi mới tới product-market fit, và cách nhận biết PMF.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>Two milestones, in order</h2>
<p class="lead">Don't confuse the two big fits. <strong>Problem-solution fit</strong> = you've confirmed the problem is real and your proposed solution would plausibly fix it. <strong>Product-market fit (PMF)</strong> = you've built something and the market pulls it out of your hands. You earn the first with interviews; the second only shows up after a real MVP.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Problem confirmed</div><div class="lz-d">20 interviews · real pain</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Problem-solution fit</div><div class="lz-d">"this would solve it" · they want it</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Build MVP</div><div class="lz-d">smallest testable version</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Product-market fit</div><div class="lz-d">users come back · tell friends</div></div>
</div>

<h3>How you know you have PMF (signs)</h3>
<ul>
<li>People use it <strong>without you pushing</strong>, and come back.</li>
<li>They get <strong>upset if it breaks</strong> or disappears.</li>
<li>They <strong>tell friends</strong> unprompted (organic growth).</li>
<li>Sean Ellis test: <strong>≥40%</strong> of users would be "very disappointed" without it.</li>
</ul>

<div class="callout ok"><strong>Reality for EXE101:</strong> a 10-week student project rarely reaches full PMF — and that's OK. Your goal is honest <em>problem-solution fit</em> plus early signals. Instructors reward "here's the evidence, here's the early usage, here's what we'd test next," not fake PMF claims.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>PMF feels like a "pull."</b> Marc Andreessen: before PMF you're pushing a boulder uphill; after PMF the market pulls product out of you and your only problem is keeping up. If you're still convincing people one-by-one, you're pre-PMF — keep iterating. <em>A famous framing beyond the syllabus that tells you which phase you're truly in.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Hai cột mốc, theo thứ tự</h2>
<p class="lead">Đừng lẫn lộn hai "fit" lớn. <strong>Problem-solution fit</strong> = bạn đã xác nhận vấn đề có thật và giải pháp đề xuất có vẻ sẽ sửa được. <strong>Product-market fit (PMF)</strong> = bạn đã xây ra thứ gì đó và thị trường giật nó khỏi tay bạn. Cái đầu bạn giành được bằng phỏng vấn; cái sau chỉ xuất hiện sau một MVP thật.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Xác nhận vấn đề</div><div class="lz-d">20 phỏng vấn · đau thật</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Problem-solution fit</div><div class="lz-d">"cái này sẽ giải" · họ muốn nó</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Xây MVP</div><div class="lz-d">phiên bản nhỏ nhất thử được</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Product-market fit</div><div class="lz-d">người dùng quay lại · rủ bạn bè</div></div>
</div>

<h3>Làm sao biết bạn có PMF (dấu hiệu)</h3>
<ul>
<li>Người ta dùng nó <strong>mà bạn không phải thúc</strong>, và quay lại.</li>
<li>Họ <strong>bực nếu nó hỏng</strong> hoặc biến mất.</li>
<li>Họ <strong>rủ bạn bè</strong> không cần nhắc (tăng trưởng hữu cơ).</li>
<li>Phép thử Sean Ellis: <strong>≥40%</strong> người dùng "rất thất vọng" nếu thiếu nó.</li>
</ul>

<div class="callout ok"><strong>Thực tế cho EXE101:</strong> một đồ án SV 10 tuần hiếm khi đạt PMF trọn vẹn — và không sao. Mục tiêu của bạn là <em>problem-solution fit</em> trung thực cộng tín hiệu sớm. Giảng viên thưởng "đây là bằng chứng, đây là mức dùng ban đầu, đây là cái bọn em sẽ thử tiếp", không thưởng tuyên bố PMF giả.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>PMF có cảm giác như bị "kéo".</b> Marc Andreessen: trước PMF bạn đẩy tảng đá lên dốc; sau PMF thị trường kéo sản phẩm khỏi tay bạn và vấn đề duy nhất là theo kịp. Nếu vẫn phải thuyết phục từng người một, bạn đang trước-PMF — cứ lặp tiếp. <em>Một cách đóng khung nổi tiếng ngoài syllabus cho bạn biết mình thật sự đang ở pha nào.</em></div>
</div>`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 5 — NGHIÊN CỨU THỊ TRƯỜNG ══════════════════ */
    {
      title: 'Chapter 5 — Market research|||Chương 5 — Nghiên cứu thị trường',
      description: 'Thiết kế khảo sát không thiên lệch, phân tích đối thủ, và biến dữ liệu thành insight cho checkpoint 2.',
      lessons: [
        {
          title: '5.1 — Designing surveys that aren\'t biased|||5.1 — Thiết kế khảo sát không thiên lệch',
          slug: 'exe101-5-1-survey-design',
          type: 'VIDEO',
          description: 'Câu hỏi khảo sát trung lập, thang đo, cỡ mẫu, và cách tránh câu mớm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Surveys scale interviews — if they aren't rigged</h2>
<p class="lead">Interviews give depth; surveys give breadth. Use surveys to <em>quantify</em> what interviews revealed ("how often does this happen? how much do you spend?"). But a badly-worded survey just collects flattering noise.</p>

<h3>Rules for honest questions</h3>
<ul>
<li><strong>No leading:</strong> "How do you currently find used books?" not "Isn't finding used books frustrating?"</li>
<li><strong>Ask behavior, not opinion:</strong> "How many times last semester?" beats "Do you like…".</li>
<li><strong>One idea per question;</strong> avoid double-barreled ("fast and cheap?").</li>
<li><strong>Neutral scale:</strong> equal positive/negative options; include "N/A".</li>
<li><strong>Short:</strong> under 10 questions or people drop out.</li>
</ul>

<h3>Worked example — fix a biased question</h3>
<div class="out"><strong>Biased:</strong> "Would you love a cheaper, safer way to buy textbooks?"  → everyone says yes; useless.
<strong>Fixed set:</strong>
1) "Last semester, how did you get your course materials?" (choose all)
2) "How many hours did it take?" (0-1 / 2-4 / 5+)
3) "Did you ever get scammed or wrong items?" (yes/no)
4) "How much did you spend on materials?" (ranges)
<strong>Why better:</strong> every answer is a fact you can chart. Now "68% spent 5+ hours" is a checkpoint-2 headline.</div>

<div class="pitfall"><strong>Trap:</strong> sample bias. If you only survey your own class, you measure your bubble. Spread across campuses/majors, and report your sample honestly (n=, who).</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Combine methods (triangulation).</b> Strong research triangulates: interviews (why) + survey (how many) + observation/competitor data (what exists). When all three point the same way, your claim is bulletproof at Demo Day. <em>A research-methods principle beyond the syllabus that turns "we think" into "we know."</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Khảo sát mở rộng phỏng vấn — nếu không bị "gài"</h2>
<p class="lead">Phỏng vấn cho chiều sâu; khảo sát cho chiều rộng. Dùng khảo sát để <em>định lượng</em> cái phỏng vấn hé lộ ("việc này xảy ra bao lâu một lần? tốn bao nhiêu?"). Nhưng khảo sát viết dở chỉ thu về nhiễu tâng bốc.</p>

<h3>Luật cho câu hỏi trung thực</h3>
<ul>
<li><strong>Không mớm:</strong> "Hiện bạn tìm sách cũ thế nào?" chứ không "Tìm sách cũ bực đúng không?"</li>
<li><strong>Hỏi hành vi, không hỏi ý kiến:</strong> "Kỳ trước bao nhiêu lần?" thắng "Bạn có thích…".</li>
<li><strong>Một ý mỗi câu;</strong> tránh câu hai nòng ("nhanh và rẻ?").</li>
<li><strong>Thang đo trung lập:</strong> số lựa chọn tích cực/tiêu cực cân nhau; có "Không áp dụng".</li>
<li><strong>Ngắn:</strong> dưới 10 câu, nếu không người ta bỏ ngang.</li>
</ul>

<h3>Ví dụ có lời giải — sửa một câu thiên lệch</h3>
<div class="out"><strong>Thiên lệch:</strong> "Bạn có thích một cách mua giáo trình rẻ hơn, an toàn hơn không?" → ai cũng nói có; vô dụng.
<strong>Bộ đã sửa:</strong>
1) "Kỳ trước, bạn lấy tài liệu môn học bằng cách nào?" (chọn tất cả)
2) "Mất bao nhiêu giờ?" (0-1 / 2-4 / 5+)
3) "Bạn từng bị lừa hay nhận sai đồ không?" (có/không)
4) "Bạn chi bao nhiêu cho tài liệu?" (khoảng)
<strong>Vì sao tốt hơn:</strong> mỗi câu trả lời là một sự thật có thể vẽ biểu đồ. Giờ "68% mất 5+ giờ" là tiêu đề cho checkpoint 2.</div>

<div class="pitfall"><strong>Bẫy:</strong> lệch mẫu. Nếu chỉ khảo sát lớp mình, bạn đo cái bong bóng của mình. Trải ra nhiều campus/ngành, và báo cáo mẫu trung thực (n=, ai).</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Kết hợp phương pháp (tam giác hoá).</b> Nghiên cứu mạnh tam giác hoá: phỏng vấn (vì sao) + khảo sát (bao nhiêu) + quan sát/dữ liệu đối thủ (đang có gì). Khi cả ba chỉ cùng hướng, tuyên bố của bạn chống đạn ở Demo Day. <em>Nguyên tắc phương pháp nghiên cứu ngoài syllabus biến "bọn em nghĩ" thành "bọn em biết".</em></div>
</div>`,
        },
        {
          title: '5.2 — Competitor analysis & positioning|||5.2 — Phân tích đối thủ & định vị',
          slug: 'exe101-5-2-competitors',
          type: 'VIDEO',
          description: 'Lập bản đồ đối thủ, tìm khoảng trống, và định vị "vì sao bạn khác/tốt hơn".',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>"No competitors" is a red flag, not a green one</h2>
<p class="lead">If you claim you have no competitors, an instructor hears "no market" or "you didn't look." Everyone solves the problem <em>somehow</em> today — even if the competitor is "a chaotic Facebook group" or "doing it manually." Map that honestly, then show your edge.</p>

<h3>The competitor matrix</h3>
<table>
<thead><tr><th>Solution</th><th>Price</th><th>Trust/safety</th><th>Speed</th><th>Gap you fill</th></tr></thead>
<tbody>
<tr><td>Facebook groups</td><td>Free</td><td>Low (scams)</td><td>Slow</td><td>Verification + escrow</td></tr>
<tr><td>New from bookstore</td><td>High</td><td>High</td><td>Fast</td><td>Cheaper (used)</td></tr>
<tr><td>Ask seniors</td><td>Free</td><td>Medium</td><td>Random</td><td>Reliable inventory</td></tr>
<tr><td><strong>You</strong></td><td>Low</td><td><strong>High (verified)</strong></td><td><strong>Fast</strong></td><td>—</td></tr>
</tbody>
</table>

<h3>Positioning statement — one sentence</h3>
<div class="out"><strong>Template:</strong> "For [target customer] who [need], [your product] is a [category] that [key benefit], unlike [main alternative] which [weakness]."
<strong>Filled:</strong> "For FPT students who need affordable course materials, BookSwap is a verified campus marketplace that guarantees safe, fast trades — unlike Facebook groups, which are chaotic and scam-prone."
<strong>Use it</strong> as slide 3 of your pitch. If you can't fill it, you haven't found your edge yet.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Compete on a wedge, not on "everything better."</b> Startups win by being <em>dramatically</em> better at one thing for one segment (the "wedge"), not slightly better at everything. Pick your wedge (e.g. trust/verification) and dominate it first. <em>A positioning strategy beyond the syllabus — being 10× better at one thing beats 10% better at ten.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>"Không có đối thủ" là cờ đỏ, không phải cờ xanh</h2>
<p class="lead">Nếu bạn tuyên bố không có đối thủ, giảng viên nghe thành "không có thị trường" hoặc "bạn chưa tìm kỹ". Hôm nay ai cũng giải vấn đề <em>bằng cách nào đó</em> — kể cả đối thủ là "một group Facebook hỗn loạn" hay "làm thủ công". Vẽ nó ra trung thực, rồi cho thấy lợi thế của bạn.</p>

<h3>Ma trận đối thủ</h3>
<table>
<thead><tr><th>Giải pháp</th><th>Giá</th><th>Tin cậy/an toàn</th><th>Tốc độ</th><th>Khoảng trống bạn lấp</th></tr></thead>
<tbody>
<tr><td>Group Facebook</td><td>Miễn phí</td><td>Thấp (lừa đảo)</td><td>Chậm</td><td>Xác thực + ký quỹ</td></tr>
<tr><td>Mua mới ở nhà sách</td><td>Cao</td><td>Cao</td><td>Nhanh</td><td>Rẻ hơn (đồ cũ)</td></tr>
<tr><td>Xin anh chị khoá trên</td><td>Miễn phí</td><td>Trung bình</td><td>Hên xui</td><td>Kho hàng ổn định</td></tr>
<tr><td><strong>Bạn</strong></td><td>Thấp</td><td><strong>Cao (đã xác thực)</strong></td><td><strong>Nhanh</strong></td><td>—</td></tr>
</tbody>
</table>

<h3>Câu định vị — một câu</h3>
<div class="out"><strong>Khuôn:</strong> "Cho [khách hàng mục tiêu] cần [nhu cầu], [sản phẩm của bạn] là một [danh mục] giúp [lợi ích chính], khác với [giải pháp thay thế chính] vốn [điểm yếu]."
<strong>Điền:</strong> "Cho sinh viên FPT cần tài liệu học giá rẻ, BookSwap là chợ trong trường có xác thực đảm bảo giao dịch an toàn, nhanh — khác với group Facebook vốn hỗn loạn và dễ bị lừa."
<strong>Dùng nó</strong> làm slide 3 của pitch. Nếu không điền được, bạn chưa tìm ra lợi thế.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Cạnh tranh bằng "mũi nêm", không bằng "tốt hơn mọi thứ".</b> Startup thắng bằng cách <em>vượt trội hẳn</em> ở MỘT thứ cho MỘT phân khúc (cái "wedge"), không phải tốt hơn tí chút ở mọi thứ. Chọn mũi nêm (vd tin cậy/xác thực) và thống trị nó trước. <em>Một chiến lược định vị ngoài syllabus — tốt hơn 10× ở một thứ thắng tốt hơn 10% ở mười thứ.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'The core lesson of The Mom Test is:|||Bài học cốt lõi của The Mom Test là:',
                options: [
                  'Ask people if they would use your product|||Hỏi người ta có dùng sản phẩm của bạn không',
                  'Ask about past behavior and real pain, not future intent|||Hỏi về hành vi quá khứ và nỗi đau thật, không hỏi ý định tương lai',
                  'Only interview family members|||Chỉ phỏng vấn người nhà',
                  'Pitch your solution first, then ask|||Pitch giải pháp trước rồi mới hỏi',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'Product-market fit differs from problem-solution fit because PMF:|||Product-market fit khác problem-solution fit vì PMF:',
                options: [
                  'Only needs interviews, no product|||Chỉ cần phỏng vấn, không cần sản phẩm',
                  'Shows up after a real product and means the market pulls it|||Xuất hiện sau một sản phẩm thật và nghĩa là thị trường kéo nó',
                  'Is decided before you talk to customers|||Được quyết trước khi nói chuyện khách hàng',
                  'Is the same thing|||Là cùng một thứ',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'Which survey question is LEAST biased?|||Câu khảo sát nào ÍT thiên lệch nhất?',
                options: [
                  '"Would you love a cheaper, safer app?"|||"Bạn có thích một app rẻ hơn, an toàn hơn không?"',
                  '"How many hours did buying materials take last semester?"|||"Kỳ trước mua tài liệu mất bao nhiêu giờ?"',
                  '"Isn\'t the current way frustrating?"|||"Cách hiện tại bực đúng không?"',
                  '"Don\'t you think this is a great idea?"|||"Bạn không thấy đây là ý tưởng tuyệt sao?"',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'Claiming "we have no competitors" is usually:|||Tuyên bố "bọn em không có đối thủ" thường là:',
                options: [
                  'A strong selling point|||Một điểm bán mạnh',
                  'A red flag — every problem is solved somehow today|||Một cờ đỏ — vấn đề nào hôm nay cũng được giải bằng cách nào đó',
                  'Required for a good pitch|||Bắt buộc để pitch tốt',
                  'Proof of a huge market|||Bằng chứng thị trường khổng lồ',
                ], correctIndex: 1,
              },
              {
                id: 'q5', points: 1,
                question: '(Beyond syllabus) Triangulation in research means:|||(Ngoài giáo trình) Tam giác hoá trong nghiên cứu nghĩa là:',
                options: [
                  'Asking three people|||Hỏi ba người',
                  'Combining interviews + survey + observation/competitor data|||Kết hợp phỏng vấn + khảo sát + quan sát/dữ liệu đối thủ',
                  'Using three surveys|||Dùng ba khảo sát',
                  'Meeting three times a week|||Họp ba lần một tuần',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 6 — MVP & MINI-LAUNCH ══════════════════ */
    {
      title: 'Chapter 6 — MVP & mini-launch|||Chương 6 — MVP & ra mắt nhỏ',
      description: 'Xây phiên bản nhỏ nhất thử được theo vòng Build-Measure-Learn, và ra mắt nhỏ để lấy dữ liệu thật.',
      lessons: [
        {
          title: '6.1 — Build the smallest testable product|||6.1 — Xây sản phẩm nhỏ nhất thử được',
          slug: 'exe101-6-1-mvp',
          type: 'VIDEO',
          description: 'MVP là gì (và không là gì), các kiểu MVP không cần code, và vòng Build-Measure-Learn.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>An MVP tests a hypothesis, not "version 1.0"</h2>
<p class="lead">A Minimum Viable Product is the <strong>smallest thing that lets you learn</strong> whether people want your solution — not a shrunk version of the final app. Eric Ries's loop: <strong>Build → Measure → Learn</strong>, as fast as possible, as cheaply as possible.</p>

<h3>MVP types — most need no code</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Concierge</span> Do it manually for a few users (you personally match buyers & sellers over chat).</div>
<div class="lz-layer"><span class="lz-lk">Wizard of Oz</span> Looks automated to the user; a human does the work behind the curtain.</div>
<div class="lz-layer"><span class="lz-lk">Landing page</span> A page describing the product + a "sign up" button; measure who clicks.</div>
<div class="lz-layer"><span class="lz-lk">No-code app</span> Google Form + Sheet, or a tool like Glide/Softr, to run the real flow.</div>
</div>

<h3>Worked example — MVP for BookSwap in 3 days</h3>
<div class="out"><strong>Don't:</strong> spend 4 weeks coding a marketplace app.
<strong>Do (concierge MVP):</strong>
• A Google Form: "list a book you want to sell / buy."
• A shared Sheet you (the team) manually match each evening.
• A group chat to connect matched people and confirm the trade.
<strong>Measure:</strong> how many list? how many trades complete? do they come back next week?
<strong>Learn:</strong> if 30 people list and 12 trade in a week — real demand, and you learned the workflow before writing one line of code.</div>

<div class="callout warn"><strong>The trap that kills checkpoint 3:</strong> building for four weeks, launching in week 9, no time to measure. Launch something embarrassing in week 6 so you have <em>data</em> to show.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>"If you're not embarrassed by v1, you launched too late." — Reid Hoffman.</b> The point of an MVP is speed of learning, not polish. Every day polishing before contact with users is a day you learn nothing. <em>A founder maxim beyond the syllabus — ugly-but-shipped beats perfect-but-hidden.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>MVP thử một giả thuyết, không phải "bản 1.0"</h2>
<p class="lead">MVP (sản phẩm khả dụng tối thiểu) là <strong>thứ nhỏ nhất giúp bạn học được</strong> liệu người ta có muốn giải pháp của bạn không — không phải bản thu nhỏ của app cuối. Vòng lặp của Eric Ries: <strong>Build → Measure → Learn</strong> (Xây → Đo → Học), càng nhanh càng tốt, càng rẻ càng tốt.</p>

<h3>Các kiểu MVP — hầu hết không cần code</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Concierge</span> Làm thủ công cho vài người dùng (bạn tự tay ghép người mua & bán qua chat).</div>
<div class="lz-layer"><span class="lz-lk">Wizard of Oz</span> Với người dùng trông như tự động; một con người làm việc sau tấm màn.</div>
<div class="lz-layer"><span class="lz-lk">Landing page</span> Một trang mô tả sản phẩm + nút "đăng ký"; đo ai bấm.</div>
<div class="lz-layer"><span class="lz-lk">App no-code</span> Google Form + Sheet, hoặc công cụ như Glide/Softr, để chạy luồng thật.</div>
</div>

<h3>Ví dụ có lời giải — MVP cho BookSwap trong 3 ngày</h3>
<div class="out"><strong>Đừng:</strong> tốn 4 tuần code một app chợ.
<strong>Hãy (MVP concierge):</strong>
• Một Google Form: "đăng cuốn sách muốn bán / mua."
• Một Sheet chung mà bạn (cả đội) ghép thủ công mỗi tối.
• Một group chat để kết nối người đã ghép và xác nhận giao dịch.
<strong>Đo:</strong> bao nhiêu người đăng? bao nhiêu giao dịch hoàn tất? họ có quay lại tuần sau không?
<strong>Học:</strong> nếu 30 người đăng và 12 giao dịch trong một tuần — nhu cầu thật, và bạn học được quy trình trước khi viết một dòng code.</div>

<div class="callout warn"><strong>Bẫy giết checkpoint 3:</strong> xây bốn tuần, ra mắt tuần 9, không còn thời gian để đo. Hãy ra một thứ "ngượng ngùng" ở tuần 6 để có <em>dữ liệu</em> mà khoe.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>"Nếu bạn không thấy ngượng với v1, bạn ra mắt quá trễ." — Reid Hoffman.</b> Mục đích của MVP là tốc độ học, không phải độ bóng. Mỗi ngày gọt giũa trước khi tiếp xúc người dùng là một ngày bạn không học được gì. <em>Một châm ngôn founder ngoài syllabus — xấu-mà-ra-được thắng hoàn-hảo-mà-giấu.</em></div>
</div>`,
        },
        {
          title: '6.2 — Mini-launch, metrics & iterate|||6.2 — Ra mắt nhỏ, chỉ số & lặp lại',
          slug: 'exe101-6-2-mini-launch',
          type: 'VIDEO',
          description: 'Vì sao ra mắt nhỏ nhiều lần thắng một big-bang, và chọn chỉ số "một con số quan trọng".',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>Launch small, launch often</h2>
<p class="lead">YC's advice: a startup should "launch again and again." A big-bang launch is a single roll of the dice; a series of mini-launches to small groups lets you fix and improve between each. Every mini-launch is a checkpoint-3 evidence point.</p>

<h3>Pick your One Metric That Matters (OMTM)</h3>
<p>Don't drown in dashboards. At each stage, one number matters most:</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Early</span> Activation — did a new user complete the core action once? (listed a book)</div>
<div class="lz-layer"><span class="lz-lk">Then</span> Retention — do they come back next week? (the truest signal of value)</div>
<div class="lz-layer"><span class="lz-lk">Later</span> Referral / revenue — do they invite others / would they pay?</div>
</div>

<h3>The pirate metrics (AARRR) — a simple funnel</h3>
<div class="diagram">Acquisition → Activation → Retention → Referral → Revenue
  (they find you)  (first value)  (come back)  (tell friends)  (pay)</div>
<p>For a class MVP, focus on <strong>Activation</strong> and <strong>Retention</strong>. "40 signed up (acquisition), 25 listed a book (activation), 15 came back week 2 (retention)" is a compelling checkpoint-3 story.</p>

<div class="callout ok"><strong>Iterate visibly:</strong> keep a simple changelog — "week 1 tried X, retention was low, we changed Y, it improved." Instructors love seeing the Build-Measure-Learn loop actually turning.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Retention is the only vanity-proof metric.</b> Signups can be inflated (ask friends); retention can't be faked — people only come back if it's useful. Investors and instructors both know this, so a flat retention curve quietly beats a big signup number. <em>A growth truth beyond the syllabus that separates real value from hype.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Ra mắt nhỏ, ra mắt thường xuyên</h2>
<p class="lead">Lời khuyên của YC: startup nên "ra mắt lại nhiều lần". Ra mắt big-bang là một lần tung xúc xắc; một chuỗi ra mắt nhỏ cho nhóm nhỏ cho bạn sửa và cải thiện giữa mỗi lần. Mỗi lần ra mắt nhỏ là một điểm bằng chứng cho checkpoint 3.</p>

<h3>Chọn Một Con Số Quan Trọng Nhất (OMTM)</h3>
<p>Đừng chết chìm trong dashboard. Ở mỗi giai đoạn, một con số quan trọng nhất:</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Sớm</span> Activation (kích hoạt) — người dùng mới có hoàn tất hành động lõi một lần không? (đăng một cuốn sách)</div>
<div class="lz-layer"><span class="lz-lk">Rồi</span> Retention (giữ chân) — họ có quay lại tuần sau không? (tín hiệu giá trị thật nhất)</div>
<div class="lz-layer"><span class="lz-lk">Sau</span> Referral / doanh thu — họ có rủ người khác / sẽ trả tiền không?</div>
</div>

<h3>Chỉ số hải tặc (AARRR) — một phễu đơn giản</h3>
<div class="diagram">Acquisition → Activation → Retention → Referral → Revenue
  (tìm ra bạn)  (giá trị đầu)  (quay lại)  (rủ bạn bè)  (trả tiền)</div>
<p>Với MVP lớp, tập trung vào <strong>Activation</strong> và <strong>Retention</strong>. "40 đăng ký (acquisition), 25 đăng một cuốn sách (activation), 15 quay lại tuần 2 (retention)" là câu chuyện checkpoint-3 thuyết phục.</p>

<div class="callout ok"><strong>Lặp lại một cách nhìn thấy được:</strong> giữ một changelog đơn giản — "tuần 1 thử X, retention thấp, bọn em đổi Y, cải thiện." Giảng viên rất thích thấy vòng Build-Measure-Learn thực sự quay.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Retention là chỉ số duy nhất không thể "làm màu".</b> Lượt đăng ký có thể thổi phồng (nhờ bạn bè); retention không bịa được — người ta chỉ quay lại nếu hữu ích. Nhà đầu tư và giảng viên đều biết điều này, nên một đường retention phẳng âm thầm thắng một con số đăng ký lớn. <em>Một sự thật tăng trưởng ngoài syllabus tách giá trị thật khỏi hào nhoáng.</em></div>
</div>`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 7 — MÔ HÌNH KINH DOANH ══════════════════ */
    {
      title: 'Chapter 7 — Business model|||Chương 7 — Mô hình kinh doanh',
      description: 'Business Model Canvas 9 khối, nguồn doanh thu và cấu trúc chi phí — cho checkpoint 3.',
      lessons: [
        {
          title: '7.1 — The Business Model Canvas (9 blocks)|||7.1 — Business Model Canvas (9 khối)',
          slug: 'exe101-7-1-bmc',
          type: 'VIDEO',
          description: 'Chín khối của Business Model Canvas và cách điền cho startup của bạn trên một trang.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>Your whole business on one page</h2>
<p class="lead">The <strong>Business Model Canvas</strong> (Osterwalder) captures how your startup creates, delivers and captures value in nine blocks — on one page. It's the checkpoint-3 deliverable and the backbone of your business-model slide.</p>

<h3>The nine blocks</h3>
<table>
<thead><tr><th>Block</th><th>Question it answers</th></tr></thead>
<tbody>
<tr><td>1. Customer Segments</td><td>Who exactly are you serving?</td></tr>
<tr><td>2. Value Proposition</td><td>What pain do you solve / gain do you create?</td></tr>
<tr><td>3. Channels</td><td>How do customers find & get it?</td></tr>
<tr><td>4. Customer Relationships</td><td>How do you get, keep, grow customers?</td></tr>
<tr><td>5. Revenue Streams</td><td>How do you make money?</td></tr>
<tr><td>6. Key Resources</td><td>What assets do you need?</td></tr>
<tr><td>7. Key Activities</td><td>What must you do well?</td></tr>
<tr><td>8. Key Partners</td><td>Who helps you (suppliers, allies)?</td></tr>
<tr><td>9. Cost Structure</td><td>What are your main costs?</td></tr>
</tbody>
</table>

<h3>Worked example — BookSwap canvas (condensed)</h3>
<div class="out"><strong>Segments:</strong> FPT students buying/selling course materials.
<strong>Value prop:</strong> safe, fast, cheap used-book trades (verified, no scams).
<strong>Channels:</strong> campus groups, class reps, word of mouth.
<strong>Relationships:</strong> ratings/trust system; responsive support.
<strong>Revenue:</strong> small fee per completed trade + optional "boost listing."
<strong>Key resources:</strong> the platform, verified user base.
<strong>Key activities:</strong> matching, verification, dispute handling.
<strong>Key partners:</strong> student clubs, campus bookstore (for new-book referrals).
<strong>Costs:</strong> hosting, payment fees, marketing.
<strong>Sanity check:</strong> does revenue plausibly exceed cost at scale? Yes at 100k+ trades. That's your model.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Value Proposition Canvas — zoom into block 2.</b> Osterwalder's companion tool maps customer <em>jobs, pains, gains</em> against your <em>pain-relievers</em> and <em>gain-creators</em>. Doing this makes your value prop provably fit the customer, not just sound nice. <em>Beyond the EXE syllabus but the sharpest tool for nailing product-market fit on paper.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Cả doanh nghiệp của bạn trên một trang</h2>
<p class="lead"><strong>Business Model Canvas</strong> (Osterwalder) nắm bắt cách startup của bạn tạo, trao và thu giá trị trong chín khối — trên một trang. Đây là sản phẩm nộp cho checkpoint 3 và là xương sống của slide mô hình kinh doanh.</p>

<h3>Chín khối</h3>
<table>
<thead><tr><th>Khối</th><th>Câu hỏi nó trả lời</th></tr></thead>
<tbody>
<tr><td>1. Phân khúc khách hàng</td><td>Bạn phục vụ chính xác ai?</td></tr>
<tr><td>2. Đề xuất giá trị</td><td>Bạn giải nỗi đau / tạo lợi ích gì?</td></tr>
<tr><td>3. Kênh</td><td>Khách hàng tìm & nhận nó thế nào?</td></tr>
<tr><td>4. Quan hệ khách hàng</td><td>Bạn có, giữ, tăng khách hàng thế nào?</td></tr>
<tr><td>5. Nguồn doanh thu</td><td>Bạn kiếm tiền thế nào?</td></tr>
<tr><td>6. Nguồn lực chính</td><td>Bạn cần tài sản gì?</td></tr>
<tr><td>7. Hoạt động chính</td><td>Bạn phải làm tốt việc gì?</td></tr>
<tr><td>8. Đối tác chính</td><td>Ai giúp bạn (nhà cung cấp, đồng minh)?</td></tr>
<tr><td>9. Cấu trúc chi phí</td><td>Chi phí chính của bạn là gì?</td></tr>
</tbody>
</table>

<h3>Ví dụ có lời giải — canvas BookSwap (rút gọn)</h3>
<div class="out"><strong>Phân khúc:</strong> sinh viên FPT mua/bán tài liệu môn học.
<strong>Đề xuất giá trị:</strong> giao dịch sách cũ an toàn, nhanh, rẻ (đã xác thực, không lừa đảo).
<strong>Kênh:</strong> group campus, lớp trưởng, truyền miệng.
<strong>Quan hệ:</strong> hệ thống đánh giá/tin cậy; hỗ trợ nhanh.
<strong>Doanh thu:</strong> phí nhỏ mỗi giao dịch hoàn tất + tuỳ chọn "đẩy tin".
<strong>Nguồn lực chính:</strong> nền tảng, tập người dùng đã xác thực.
<strong>Hoạt động chính:</strong> ghép, xác thực, xử lý tranh chấp.
<strong>Đối tác chính:</strong> CLB sinh viên, nhà sách campus (giới thiệu sách mới).
<strong>Chi phí:</strong> hosting, phí thanh toán, marketing.
<strong>Kiểm tra:</strong> doanh thu có hợp lý vượt chi phí ở quy mô lớn không? Có, ở 100k+ giao dịch. Đó là mô hình của bạn.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Value Proposition Canvas — phóng to khối 2.</b> Công cụ đồng hành của Osterwalder ánh xạ <em>công việc, nỗi đau, lợi ích</em> của khách hàng với <em>bộ giảm đau</em> và <em>bộ tạo lợi ích</em> của bạn. Làm việc này khiến đề xuất giá trị của bạn khớp khách hàng một cách chứng minh được, không chỉ nghe hay. <em>Ngoài syllabus EXE nhưng là công cụ sắc nhất để chốt product-market fit trên giấy.</em></div>
</div>`,
        },
        {
          title: '7.2 — Revenue streams & cost drivers|||7.2 — Nguồn doanh thu & yếu tố chi phí',
          slug: 'exe101-7-2-revenue-cost',
          type: 'VIDEO',
          description: 'Các mô hình doanh thu phổ biến, cấu trúc chi phí, và phép kiểm "có lãi ở quy mô không".',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>Where the money comes from — and goes</h2>
<p class="lead">A business model isn't real until you can say <strong>how you make money</strong> and <strong>what it costs</strong>. You don't need to be profitable in 10 weeks, but you must show a <em>plausible path</em>.</p>

<h3>Common revenue models</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Transaction fee</span> Take a % or flat fee per deal (marketplaces).</div>
<div class="lz-layer"><span class="lz-lk">Subscription</span> Recurring monthly fee (SaaS, memberships).</div>
<div class="lz-layer"><span class="lz-lk">Freemium</span> Free core + paid premium features.</div>
<div class="lz-layer"><span class="lz-lk">Advertising</span> Free to users, brands pay for attention.</div>
<div class="lz-layer"><span class="lz-lk">Commission / affiliate</span> Earn when you refer a sale elsewhere.</div>
</div>

<h3>Worked example — is BookSwap's model sustainable?</h3>
<div class="out"><strong>Revenue:</strong> 5,000đ fee × 120,000 trades/year (FPT) = 600,000,000đ/year.
<strong>Costs (rough, year 1):</strong>
• Hosting/tools: ~12,000,000đ
• Payment fees (~2% of GMV): depends on trade value
• Marketing: ~50,000,000đ
• Team time: (unpaid in school)
<strong>Check:</strong> at just FPT the fee revenue comfortably covers tool + marketing costs. Nationwide, margins grow because software cost is nearly fixed. → <strong>plausible path to profit.</strong> Say exactly this at Demo Day; don't claim "we'll be profitable in month 2."</div>

<div class="pitfall"><strong>Trap:</strong> a free product with "we'll figure out revenue later" and no plausible model. Instructors ask "how do you make money?" — have a real answer, even if year-2.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Unit economics: CAC vs LTV.</b> The deepest money question is per-customer: does the <em>Lifetime Value</em> of a customer exceed the <em>Cost to Acquire</em> them (LTV &gt; CAC, ideally 3×)? If yes, growth prints money; if no, growth burns it. We go deeper in the advanced chapter. <em>Beyond the syllabus, but the number real investors grill you on.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>Tiền đến từ đâu — và đi về đâu</h2>
<p class="lead">Một mô hình kinh doanh chưa thật cho tới khi bạn nói được <strong>bạn kiếm tiền thế nào</strong> và <strong>nó tốn gì</strong>. Bạn không cần có lãi trong 10 tuần, nhưng phải cho thấy một <em>con đường hợp lý</em>.</p>

<h3>Các mô hình doanh thu phổ biến</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Phí giao dịch</span> Lấy % hoặc phí cố định mỗi giao dịch (chợ/marketplace).</div>
<div class="lz-layer"><span class="lz-lk">Thuê bao</span> Phí định kỳ hàng tháng (SaaS, hội viên).</div>
<div class="lz-layer"><span class="lz-lk">Freemium</span> Lõi miễn phí + tính năng cao cấp trả tiền.</div>
<div class="lz-layer"><span class="lz-lk">Quảng cáo</span> Miễn phí với người dùng, thương hiệu trả tiền cho sự chú ý.</div>
<div class="lz-layer"><span class="lz-lk">Hoa hồng / affiliate</span> Kiếm khi giới thiệu một giao dịch nơi khác.</div>
</div>

<h3>Ví dụ có lời giải — mô hình BookSwap có bền không?</h3>
<div class="out"><strong>Doanh thu:</strong> phí 5.000đ × 120.000 giao dịch/năm (FPT) = 600.000.000đ/năm.
<strong>Chi phí (ước, năm 1):</strong>
• Hosting/công cụ: ~12.000.000đ
• Phí thanh toán (~2% GMV): tuỳ giá trị giao dịch
• Marketing: ~50.000.000đ
• Thời gian đội: (không lương khi còn đi học)
<strong>Kiểm tra:</strong> chỉ riêng ở FPT, doanh thu phí thừa sức bù chi phí công cụ + marketing. Toàn quốc, biên lợi nhuận tăng vì chi phí phần mềm gần như cố định. → <strong>con đường tới lợi nhuận hợp lý.</strong> Nói đúng điều này ở Demo Day; đừng tuyên bố "bọn em sẽ có lãi trong tháng 2".</div>

<div class="pitfall"><strong>Bẫy:</strong> một sản phẩm miễn phí với "doanh thu tính sau" mà không có mô hình hợp lý. Giảng viên sẽ hỏi "bạn kiếm tiền thế nào?" — hãy có câu trả lời thật, kể cả là năm-2.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Unit economics: CAC vs LTV.</b> Câu hỏi tiền sâu nhất là theo từng khách hàng: <em>Giá trị trọn đời</em> của một khách hàng có vượt <em>Chi phí thu hút</em> họ không (LTV &gt; CAC, lý tưởng 3×)? Nếu có, tăng trưởng in ra tiền; nếu không, tăng trưởng đốt tiền. Ta đi sâu ở chương nâng cao. <em>Ngoài syllabus, nhưng là con số nhà đầu tư thật truy bạn.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'The purpose of an MVP is to:|||Mục đích của MVP là:',
                options: [
                  'Ship a polished version 1.0|||Ra một bản 1.0 bóng bẩy',
                  'Learn cheaply whether people want the solution (Build-Measure-Learn)|||Học rẻ liệu người ta có muốn giải pháp (Build-Measure-Learn)',
                  'Impress investors with features|||Gây ấn tượng nhà đầu tư bằng tính năng',
                  'Replace customer interviews|||Thay thế phỏng vấn khách hàng',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'Which metric is hardest to fake and most trusted?|||Chỉ số nào khó bịa nhất và được tin nhất?',
                options: ['Total signups|||Tổng lượt đăng ký', 'Retention (do users come back)|||Retention (người dùng có quay lại)', 'Number of features|||Số tính năng', 'Social media likes|||Lượt thích mạng xã hội'],
                correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'In the Business Model Canvas, the block answering "how do you make money" is:|||Trong Business Model Canvas, khối trả lời "bạn kiếm tiền thế nào" là:',
                options: ['Key Resources|||Nguồn lực chính', 'Revenue Streams|||Nguồn doanh thu', 'Channels|||Kênh', 'Key Partners|||Đối tác chính'],
                correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'A concierge MVP means:|||MVP concierge nghĩa là:',
                options: [
                  'A fully automated app|||Một app tự động hoàn toàn',
                  'Delivering the service manually for a few users to learn the workflow|||Cung cấp dịch vụ thủ công cho vài người dùng để học quy trình',
                  'A landing page only|||Chỉ một landing page',
                  'Hiring a concierge company|||Thuê một công ty concierge',
                ], correctIndex: 1,
              },
              {
                id: 'q5', points: 1,
                question: '(Beyond syllabus) Healthy unit economics usually means:|||(Ngoài giáo trình) Unit economics khỏe mạnh thường nghĩa là:',
                options: [
                  'CAC > LTV|||CAC > LTV',
                  'LTV > CAC (ideally about 3×)|||LTV > CAC (lý tưởng khoảng 3×)',
                  'No costs at all|||Không có chi phí gì',
                  'Revenue equals zero|||Doanh thu bằng 0',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 8 — GỌI VỐN & QUẢN TRỊ ══════════════════ */
    {
      title: 'Chapter 8 — Fundraising & managing a startup|||Chương 8 — Gọi vốn & quản trị startup',
      description: 'Cơ bản về vòng seed, định giá, cap table, và những việc pháp lý/vận hành một founder phải nắm.',
      lessons: [
        {
          title: '8.1 — Seed fundraising basics|||8.1 — Cơ bản về gọi vốn seed',
          slug: 'exe101-8-1-fundraising',
          type: 'VIDEO',
          description: 'Vì sao & khi nào gọi vốn, các nguồn vốn, định giá và pha loãng cơ bản (Geoff Ralston/YC).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>Raise money to grow faster — not to survive</h2>
<p class="lead">Following Geoff Ralston's <em>A Guide to Seed Fundraising</em>: you raise money to <strong>accelerate a business that already shows signs of working</strong>, not to fund a hope. The best time to raise is when you have traction and a clear use for the money.</p>

<h3>The funding ladder</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Bootstrapping</span> Fund it yourself from savings/revenue — keep 100% control.</div>
<div class="lz-layer"><span class="lz-lk">FFF</span> Friends, Family, Fools — earliest small checks.</div>
<div class="lz-layer"><span class="lz-lk">Angels</span> Individual investors writing small early checks + advice.</div>
<div class="lz-layer"><span class="lz-lk">Accelerators</span> YC, Techstars, 500 — money + mentorship + network for equity.</div>
<div class="lz-layer"><span class="lz-lk">Seed VC</span> Funds investing at the earliest institutional round.</div>
</div>

<h3>Worked example — dilution in plain numbers</h3>
<div class="out"><strong>Setup:</strong> Your startup is valued at 4,000,000,000đ (pre-money). An investor puts in 1,000,000,000đ.
<strong>Post-money:</strong> 4,000,000,000 + 1,000,000,000 = 5,000,000,000đ.
<strong>Investor's share:</strong> 1,000,000,000 / 5,000,000,000 = <strong>20%</strong>.
<strong>Founders now own:</strong> 80% (were 100%). This is <em>dilution</em>: a smaller slice of a bigger pie.
<strong>Key idea:</strong> raising is a trade — capital for ownership. Only trade if the money makes the pie grow enough that your smaller slice is worth more.</div>

<div class="callout ok"><strong>For EXE101:</strong> you won't actually raise, but your pitch's last slide is often "the ask" — how much you'd raise and what you'd do with it. A crisp ask ("we'd raise X to reach Y users in Z months") signals you understand your own plan.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The SAFE — how seed rounds really close.</b> Y Combinator invented the <em>SAFE</em> (Simple Agreement for Future Equity): investors give money now, get equity later at the next priced round, skipping a formal valuation fight. It's why modern seed rounds close in days, not months. <em>Beyond the syllabus, but the instrument behind most real early rounds today.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Gọi vốn để lớn nhanh hơn — không phải để sống sót</h2>
<p class="lead">Theo <em>A Guide to Seed Fundraising</em> của Geoff Ralston: bạn gọi vốn để <strong>tăng tốc một doanh nghiệp đã có dấu hiệu hoạt động</strong>, không phải để tài trợ cho một hy vọng. Thời điểm tốt nhất để gọi vốn là khi bạn có traction và mục đích rõ ràng cho số tiền.</p>

<h3>Bậc thang vốn</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Tự thân (Bootstrapping)</span> Tự bỏ tiền tiết kiệm/doanh thu — giữ 100% quyền kiểm soát.</div>
<div class="lz-layer"><span class="lz-lk">FFF</span> Friends, Family, Fools — những tấm séc nhỏ sớm nhất.</div>
<div class="lz-layer"><span class="lz-lk">Nhà đầu tư thiên thần</span> Cá nhân bỏ séc nhỏ sớm + lời khuyên.</div>
<div class="lz-layer"><span class="lz-lk">Vườn ươm</span> YC, Techstars, 500 — tiền + cố vấn + mạng lưới đổi cổ phần.</div>
<div class="lz-layer"><span class="lz-lk">Seed VC</span> Quỹ đầu tư ở vòng thể chế sớm nhất.</div>
</div>

<h3>Ví dụ có lời giải — pha loãng bằng con số đơn giản</h3>
<div class="out"><strong>Bối cảnh:</strong> Startup của bạn được định giá 4.000.000.000đ (pre-money). Nhà đầu tư rót 1.000.000.000đ.
<strong>Post-money:</strong> 4.000.000.000 + 1.000.000.000 = 5.000.000.000đ.
<strong>Phần của nhà đầu tư:</strong> 1.000.000.000 / 5.000.000.000 = <strong>20%</strong>.
<strong>Founder giờ sở hữu:</strong> 80% (trước là 100%). Đây là <em>pha loãng</em>: một lát nhỏ hơn của chiếc bánh lớn hơn.
<strong>Ý chính:</strong> gọi vốn là một cuộc đổi chác — vốn lấy quyền sở hữu. Chỉ đổi nếu số tiền làm chiếc bánh lớn đủ để lát nhỏ hơn của bạn đáng giá hơn.</div>

<div class="callout ok"><strong>Với EXE101:</strong> bạn sẽ không thực sự gọi vốn, nhưng slide cuối của pitch thường là "lời mời" — bạn sẽ gọi bao nhiêu và làm gì với nó. Một lời mời sắc gọn ("bọn em sẽ gọi X để đạt Y người dùng trong Z tháng") cho thấy bạn hiểu kế hoạch của chính mình.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>SAFE — vòng seed thực sự chốt thế nào.</b> Y Combinator phát minh ra <em>SAFE</em> (Simple Agreement for Future Equity): nhà đầu tư đưa tiền bây giờ, nhận cổ phần sau ở vòng định giá tiếp theo, bỏ qua cuộc cãi vã định giá chính thức. Đó là lý do vòng seed hiện đại chốt trong vài ngày, không phải vài tháng. <em>Ngoài syllabus, nhưng là công cụ đứng sau hầu hết vòng sớm thật ngày nay.</em></div>
</div>`,
        },
        {
          title: '8.2 — Managing a startup: legal, metrics, focus|||8.2 — Quản trị startup: pháp lý, chỉ số, tập trung',
          slug: 'exe101-8-2-managing',
          type: 'VIDEO',
          description: 'Những việc vận hành cơ bản: đăng ký, hợp đồng đội, theo dõi chỉ số, và kỷ luật tập trung.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>Running the thing without it running you</h2>
<p class="lead">Once something works, you have to <em>manage</em> it. For a young startup that means a few basics done well, not a corporate bureaucracy.</p>

<h3>The founder's minimal operating checklist</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Legal</span> Register the entity when real money flows; a simple founder agreement (roles, equity, what if someone leaves) from day one.</div>
<div class="lz-layer"><span class="lz-lk">Money</span> Separate business money; track runway (how many months of cash left).</div>
<div class="lz-layer"><span class="lz-lk">Metrics</span> One weekly dashboard: your OMTM + growth rate. Review every week.</div>
<div class="lz-layer"><span class="lz-lk">Focus</span> One priority at a time. Say no to shiny distractions; ship the core.</div>
</div>

<h3>Worked example — the weekly founder review</h3>
<div class="out"><strong>Every Monday, answer 4 questions:</strong>
1) What is our OMTM this week, and did it move?
2) What did we learn from users last week?
3) What is the ONE most important thing to do this week?
4) Are we default-alive (will we survive at current pace)?
<strong>Why:</strong> this five-minute ritual keeps a small team focused and honest. Most student teams fail not from one big mistake but from drifting without a weekly check.</div>

<div class="callout warn"><strong>The discipline that matters most: focus.</strong> A startup dies of indigestion (too many things) more often than starvation (too few). Do one thing extremely well before adding the next.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>"Default alive or default dead?" — Paul Graham.</b> Ask: at your current growth and spend, do you reach profitability before the money runs out? If yes, you're <em>default alive</em> and can take risks; if no, fix that first. It's the single most clarifying question a founder can ask. <em>Beyond the syllabus, but the mental model that reframes every other decision.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>Vận hành nó mà không để nó vận hành bạn</h2>
<p class="lead">Khi một thứ đã chạy, bạn phải <em>quản trị</em> nó. Với startup non trẻ, điều đó nghĩa là làm tốt vài việc cơ bản, không phải một bộ máy quan liêu.</p>

<h3>Checklist vận hành tối thiểu của founder</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Pháp lý</span> Đăng ký pháp nhân khi tiền thật chảy vào; một thoả thuận founder đơn giản (vai trò, cổ phần, nếu ai đó rời đi thì sao) từ ngày đầu.</div>
<div class="lz-layer"><span class="lz-lk">Tiền</span> Tách tiền doanh nghiệp; theo dõi runway (còn bao nhiêu tháng tiền mặt).</div>
<div class="lz-layer"><span class="lz-lk">Chỉ số</span> Một dashboard hàng tuần: OMTM + tốc độ tăng trưởng. Xem lại mỗi tuần.</div>
<div class="lz-layer"><span class="lz-lk">Tập trung</span> Một ưu tiên mỗi lần. Nói không với cám dỗ hào nhoáng; ra phần lõi.</div>
</div>

<h3>Ví dụ có lời giải — buổi review founder hàng tuần</h3>
<div class="out"><strong>Mỗi thứ Hai, trả lời 4 câu:</strong>
1) OMTM tuần này là gì, và nó có di chuyển không?
2) Tuần trước học được gì từ người dùng?
3) Việc QUAN TRỌNG NHẤT tuần này là gì?
4) Bọn mình có default-alive không (còn sống ở nhịp hiện tại)?
<strong>Vì sao:</strong> nghi thức năm phút này giữ đội nhỏ tập trung và trung thực. Hầu hết đội SV thất bại không vì một sai lầm lớn mà vì trôi dạt không có buổi kiểm hàng tuần.</div>

<div class="callout warn"><strong>Kỷ luật quan trọng nhất: tập trung.</strong> Startup chết vì bội thực (quá nhiều thứ) thường xuyên hơn chết đói (quá ít). Làm một thứ cực tốt trước khi thêm thứ tiếp theo.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>"Default alive hay default dead?" — Paul Graham.</b> Hỏi: ở tốc độ tăng trưởng và mức chi hiện tại, bạn có đạt điểm hoà vốn trước khi hết tiền không? Nếu có, bạn <em>default alive</em> và có thể mạo hiểm; nếu không, sửa điều đó trước. Đây là câu hỏi làm rõ nhất mà một founder có thể tự hỏi. <em>Ngoài syllabus, nhưng là mô hình tư duy đóng khung lại mọi quyết định khác.</em></div>
</div>`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 9 — ÔN THI / PITCH DAY ══════════════════ */
    {
      title: 'Chapter 9 — Demo Day: pitch, demo script & Q&A defense|||Chương 9 — Demo Day: pitch, kịch bản demo & bảo vệ Q&A',
      description: 'Chương ÔN THI cho checkpoint 4 (40%): cấu trúc deck 10 slide, kịch bản pitch có thời gian, và ngân hàng câu hỏi phản biện theo CLO.',
      lessons: [
        {
          title: '9.1 — The 10-slide pitch deck (Kevin Hale)|||9.1 — Pitch deck 10 slide (Kevin Hale)',
          slug: 'exe101-9-1-pitch-deck',
          type: 'VIDEO',
          description: 'Cấu trúc pitch deck chuẩn YC, một ý mỗi slide, và slide traction làm nên khác biệt.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1 · Exam prep</span>
<h2>Your Demo Day deck — one idea per slide</h2>
<p class="lead">Following Kevin Hale's <em>How to Design a Better Pitch Deck</em>: a pitch deck is a <strong>story with evidence</strong>, not a document. Ten slides, one idea each, big text, no walls of words. This is your 40% checkpoint — structure it deliberately.</p>

<h3>The 10-slide structure</h3>
<table>
<thead><tr><th>#</th><th>Slide</th><th>What it must say</th></tr></thead>
<tbody>
<tr><td>1</td><td>Title + one-liner</td><td>Name + "what you do" in one sentence</td></tr>
<tr><td>2</td><td>Problem</td><td>The real pain, made vivid (with a customer quote)</td></tr>
<tr><td>3</td><td>Solution</td><td>How you solve it — and why it's 10× better</td></tr>
<tr><td>4</td><td>Product / demo</td><td>Show the MVP actually working</td></tr>
<tr><td>5</td><td>Market size</td><td>TAM/SAM/SOM with a number trail</td></tr>
<tr><td>6</td><td>Traction ★</td><td>Evidence: interviews, signups, retention</td></tr>
<tr><td>7</td><td>Business model</td><td>How you make money</td></tr>
<tr><td>8</td><td>Competition</td><td>Matrix + your wedge</td></tr>
<tr><td>9</td><td>Team</td><td>Why you're the ones to win</td></tr>
<tr><td>10</td><td>Ask / next steps</td><td>What you need + where you're going</td></tr>
</tbody>
</table>

<div class="callout ok"><strong>Design rules that raise your grade:</strong> one message per slide; font readable from the back row; a real customer quote on the problem slide; the traction number in huge text on slide 6. Judges remember one image and one number — make them yours.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Open with the problem as a mini-story, not a definition.</b> "Last month, Minh spent two weeks and got scammed twice buying textbooks…" grabs a room far better than "The used-book market is inefficient." Specific human story → then the numbers. <em>A storytelling technique beyond the syllabus that pitch coaches drill first.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1 · Ôn thi</span>
<h2>Deck Demo Day của bạn — một ý mỗi slide</h2>
<p class="lead">Theo <em>How to Design a Better Pitch Deck</em> của Kevin Hale: pitch deck là một <strong>câu chuyện có bằng chứng</strong>, không phải tài liệu. Mười slide, mỗi slide một ý, chữ to, không có bức tường chữ. Đây là checkpoint 40% của bạn — hãy cấu trúc có chủ đích.</p>

<h3>Cấu trúc 10 slide</h3>
<table>
<thead><tr><th>#</th><th>Slide</th><th>Nó phải nói gì</th></tr></thead>
<tbody>
<tr><td>1</td><td>Tiêu đề + một câu</td><td>Tên + "bạn làm gì" trong một câu</td></tr>
<tr><td>2</td><td>Vấn đề</td><td>Nỗi đau thật, sinh động (kèm trích lời khách hàng)</td></tr>
<tr><td>3</td><td>Giải pháp</td><td>Bạn giải thế nào — và vì sao tốt hơn 10×</td></tr>
<tr><td>4</td><td>Sản phẩm / demo</td><td>Cho thấy MVP thực sự chạy</td></tr>
<tr><td>5</td><td>Quy mô thị trường</td><td>TAM/SAM/SOM với đường dẫn số</td></tr>
<tr><td>6</td><td>Traction ★</td><td>Bằng chứng: phỏng vấn, đăng ký, retention</td></tr>
<tr><td>7</td><td>Mô hình kinh doanh</td><td>Bạn kiếm tiền thế nào</td></tr>
<tr><td>8</td><td>Đối thủ</td><td>Ma trận + mũi nêm của bạn</td></tr>
<tr><td>9</td><td>Đội</td><td>Vì sao bạn là người sẽ thắng</td></tr>
<tr><td>10</td><td>Lời mời / bước tiếp</td><td>Bạn cần gì + đang đi về đâu</td></tr>
</tbody>
</table>

<div class="callout ok"><strong>Luật thiết kế nâng điểm:</strong> một thông điệp mỗi slide; cỡ chữ đọc được từ hàng ghế cuối; một trích lời khách hàng thật trên slide vấn đề; con số traction cỡ chữ khổng lồ trên slide 6. Giám khảo nhớ một hình ảnh và một con số — hãy làm chúng thành của bạn.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Mở đầu bằng vấn đề như một mẩu chuyện, không phải định nghĩa.</b> "Tháng trước, Minh mất hai tuần và bị lừa hai lần khi mua giáo trình…" cuốn cả phòng hơn hẳn "Thị trường sách cũ kém hiệu quả." Chuyện con người cụ thể → rồi mới tới con số. <em>Một kỹ thuật kể chuyện ngoài syllabus mà huấn luyện viên pitch rèn đầu tiên.</em></div>
</div>`,
        },
        {
          title: '9.2 — Demo script with timing (8 minutes)|||9.2 — Kịch bản demo có thời gian (8 phút)',
          slug: 'exe101-9-2-demo-script',
          type: 'article',
          description: 'Kịch bản pitch 8 phút chia theo phút, ai nói gì khi nào, và cách demo MVP không "chết".',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2 · Exam prep</span>
<h2>An 8-minute pitch, minute by minute</h2>
<p class="lead">Great pitches are rehearsed to the minute. Here is a battle-tested timing plan for a ~8-minute team pitch + Q&A. Assign each part to an owner and practice out loud at least three times.</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">0:00-1:00</span> Hook + problem story (CEO). One vivid customer story, then the one-line problem.</div>
<div class="lz-layer"><span class="lz-lk">1:00-2:30</span> Solution + live demo (Product lead). Show the MVP doing the ONE core action. Have a backup video/screenshots.</div>
<div class="lz-layer"><span class="lz-lk">2:30-3:30</span> Evidence: interviews + traction number (Research lead). "20 interviews, 68% spent 5+ hours, 40 signups, 15 came back."</div>
<div class="lz-layer"><span class="lz-lk">3:30-4:30</span> Market size (Research lead). TAM/SAM/SOM with the number trail.</div>
<div class="lz-layer"><span class="lz-lk">4:30-5:30</span> Business model + competition (Ops lead). How you make money + your wedge vs alternatives.</div>
<div class="lz-layer"><span class="lz-lk">5:30-6:30</span> Team + ask (CEO). Why this team + the clear next step.</div>
<div class="lz-layer"><span class="lz-lk">6:30-8:00</span> Q&A. Everyone ready; the question-owner answers, others support.</div>
</div>

<h3>Demo survival rules</h3>
<ul>
<li><strong>Always have a backup</strong> — a recorded screen video in case live fails. Never let a crash kill your pitch.</li>
<li><strong>Demo the ONE core action</strong>, not a tour of every button.</li>
<li><strong>Narrate the value</strong>, not the clicks: "watch how a trade completes safely in 20 seconds."</li>
<li><strong>Pre-load data</strong> so screens look alive, not empty.</li>
</ul>

<div class="callout warn"><strong>The #1 timing killer:</strong> spending 3 minutes on the problem and rushing evidence. Evidence (slide 6) is what wins the 40% — protect its time.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Rehearse the "handoffs."</b> The moments where the mic passes between teammates are where pitches stall. Scripting one clean sentence to hand off ("…and that's why we built it — over to Lan on what customers told us") makes a five-person team look like one voice. <em>A presentation-craft detail beyond the syllabus that separates smooth teams from clumsy ones.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.2 · Ôn thi</span>
<h2>Một bài pitch 8 phút, từng phút một</h2>
<p class="lead">Pitch hay được tập tới từng phút. Đây là kế hoạch thời gian đã được kiểm chứng cho một bài pitch đội ~8 phút + Q&A. Giao mỗi phần cho một người chủ và tập nói to ít nhất ba lần.</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">0:00-1:00</span> Mở màn + chuyện vấn đề (CEO). Một chuyện khách hàng sinh động, rồi vấn đề một câu.</div>
<div class="lz-layer"><span class="lz-lk">1:00-2:30</span> Giải pháp + demo trực tiếp (Phụ trách sản phẩm). Cho thấy MVP làm MỘT hành động lõi. Có video/ảnh chụp dự phòng.</div>
<div class="lz-layer"><span class="lz-lk">2:30-3:30</span> Bằng chứng: phỏng vấn + con số traction (Phụ trách nghiên cứu). "20 phỏng vấn, 68% mất 5+ giờ, 40 đăng ký, 15 quay lại."</div>
<div class="lz-layer"><span class="lz-lk">3:30-4:30</span> Quy mô thị trường (Phụ trách nghiên cứu). TAM/SAM/SOM với đường dẫn số.</div>
<div class="lz-layer"><span class="lz-lk">4:30-5:30</span> Mô hình kinh doanh + đối thủ (Phụ trách vận hành). Kiếm tiền thế nào + mũi nêm so với giải pháp thay thế.</div>
<div class="lz-layer"><span class="lz-lk">5:30-6:30</span> Đội + lời mời (CEO). Vì sao đội này + bước tiếp rõ ràng.</div>
<div class="lz-layer"><span class="lz-lk">6:30-8:00</span> Q&A. Mọi người sẵn sàng; người chủ câu hỏi trả lời, người khác hỗ trợ.</div>
</div>

<h3>Luật sống sót khi demo</h3>
<ul>
<li><strong>Luôn có dự phòng</strong> — một video quay màn hình phòng khi demo trực tiếp hỏng. Đừng để một cú crash giết bài pitch.</li>
<li><strong>Demo MỘT hành động lõi</strong>, không dạo qua từng nút.</li>
<li><strong>Kể giá trị</strong>, không kể cú bấm: "xem một giao dịch hoàn tất an toàn trong 20 giây."</li>
<li><strong>Nạp sẵn dữ liệu</strong> để màn hình trông sống động, không trống trơn.</li>
</ul>

<div class="callout warn"><strong>Thủ phạm số 1 phá thời gian:</strong> dành 3 phút cho vấn đề rồi vội vàng phần bằng chứng. Bằng chứng (slide 6) là thứ thắng 40% — bảo vệ thời gian của nó.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Tập cả những "cú chuyền".</b> Khoảnh khắc mic chuyền giữa các thành viên là nơi pitch khựng lại. Viết sẵn một câu chuyền gọn ("…và đó là lý do bọn em xây nó — mời Lan nói về điều khách hàng đã kể") khiến đội năm người trông như một giọng nói. <em>Một chi tiết nghề thuyết trình ngoài syllabus tách đội mượt khỏi đội lóng ngóng.</em></div>
</div>`,
        },
        {
          title: '9.3 — Q&A defense bank (by CLO)|||9.3 — Ngân hàng câu hỏi phản biện (theo CLO)',
          slug: 'exe101-9-3-qa-bank',
          type: 'article',
          description: 'Ngân hàng câu hỏi phản biện giám khảo hay hỏi, nhóm theo CLO, kèm cách trả lời mạnh.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.3 · Exam prep</span>
<h2>Prepare the questions before they're asked</h2>
<p class="lead">The Q&A is where checkpoint scores are won or lost. Below is a defense bank grouped by CLO — rehearse a crisp, evidence-backed answer for each. The golden rule: <strong>answer with data, not opinion.</strong></p>

<h3>CLO1-2 — startup basics & team</h3>
<ul>
<li>"Is this a startup or a small business — can it scale?"</li>
<li>"How did you divide roles, and what did each person own?"</li>
<li>"What was your biggest team disagreement and how did you resolve it?"</li>
</ul>
<h3>CLO3 — customers & market research</h3>
<ul>
<li>"How many customers did you actually talk to? What did they say?"</li>
<li>"How do you know this is a real problem and not your assumption?"</li>
<li>"How did you size the market — walk me through the numbers."</li>
<li>"Weren't your survey questions leading? How did you avoid bias?"</li>
</ul>
<h3>CLO4 — product & business model</h3>
<ul>
<li>"Did real users touch your MVP? What did they do?"</li>
<li>"How exactly do you make money? When are you profitable?"</li>
<li>"Who are your competitors and why would customers pick you?"</li>
</ul>
<h3>CLO5 — pitch & vision</h3>
<ul>
<li>"What's your single strongest piece of evidence?"</li>
<li>"What would you do with more time / money?"</li>
<li>"What's the biggest risk that could kill this, and your plan for it?"</li>
</ul>

<div class="callout ok"><strong>Answer formula:</strong> (1) direct answer in one sentence → (2) the evidence/number → (3) what you'd do next. E.g. "Yes it scales — the software serves any campus at near-zero extra cost; we validated the flow with 15 real trades; next we'd add two more campuses."</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>"I don't know, but here's how I'd find out" is a strong answer.</b> Judges test honesty as much as knowledge. Bluffing a number you didn't measure is worse than admitting the gap and showing a plan to close it. Real investors respect founders who know the edge of their own data. <em>A poise principle beyond the syllabus that turns a hard question into a credibility win.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.3 · Ôn thi</span>
<h2>Chuẩn bị câu hỏi trước khi bị hỏi</h2>
<p class="lead">Q&A là nơi điểm checkpoint được thắng hoặc mất. Dưới đây là ngân hàng phản biện nhóm theo CLO — hãy tập một câu trả lời sắc gọn, có bằng chứng cho mỗi câu. Quy tắc vàng: <strong>trả lời bằng dữ liệu, không bằng ý kiến.</strong></p>

<h3>CLO1-2 — cơ bản startup & đội</h3>
<ul>
<li>"Đây là startup hay doanh nghiệp nhỏ — nó có mở rộng được không?"</li>
<li>"Bạn chia vai trò thế nào, mỗi người sở hữu gì?"</li>
<li>"Bất đồng đội lớn nhất là gì và bạn giải quyết ra sao?"</li>
</ul>
<h3>CLO3 — khách hàng & nghiên cứu thị trường</h3>
<ul>
<li>"Bạn thực sự nói chuyện với bao nhiêu khách hàng? Họ nói gì?"</li>
<li>"Làm sao bạn biết đây là vấn đề thật chứ không phải giả định của bạn?"</li>
<li>"Bạn ước lượng thị trường thế nào — dẫn tôi qua các con số."</li>
<li>"Câu khảo sát của bạn có mớm không? Bạn tránh thiên lệch ra sao?"</li>
</ul>
<h3>CLO4 — sản phẩm & mô hình kinh doanh</h3>
<ul>
<li>"Người dùng thật có chạm MVP không? Họ làm gì?"</li>
<li>"Bạn kiếm tiền chính xác thế nào? Khi nào có lãi?"</li>
<li>"Đối thủ của bạn là ai và vì sao khách chọn bạn?"</li>
</ul>
<h3>CLO5 — pitch & tầm nhìn</h3>
<ul>
<li>"Bằng chứng mạnh nhất duy nhất của bạn là gì?"</li>
<li>"Có thêm thời gian / tiền bạn sẽ làm gì?"</li>
<li>"Rủi ro lớn nhất có thể giết dự án là gì, và kế hoạch của bạn?"</li>
</ul>

<div class="callout ok"><strong>Công thức trả lời:</strong> (1) trả lời thẳng một câu → (2) bằng chứng/con số → (3) bước tiếp. Vd: "Có, nó mở rộng được — phần mềm phục vụ campus nào cũng gần như không tốn thêm; bọn em kiểm chứng luồng với 15 giao dịch thật; tiếp theo sẽ thêm hai campus."</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>"Em chưa biết, nhưng đây là cách em sẽ tìm ra" là một câu trả lời mạnh.</b> Giám khảo kiểm sự trung thực ngang với kiến thức. Bịa một con số bạn chưa đo tệ hơn thừa nhận lỗ hổng và cho thấy kế hoạch lấp nó. Nhà đầu tư thật tôn trọng founder biết ranh giới dữ liệu của chính mình. <em>Một nguyên tắc điềm tĩnh ngoài syllabus biến câu hỏi khó thành điểm cộng uy tín.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'On the pitch deck, the slide that most separates a 7 from a 9 is:|||Trên pitch deck, slide tạo khác biệt nhất giữa điểm 7 và 9 là:',
                options: ['Title slide|||Slide tiêu đề', 'Traction/evidence slide|||Slide traction/bằng chứng', 'Team slide|||Slide đội', 'Contact slide|||Slide liên hệ'],
                correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'The safest way to avoid a demo disaster is:|||Cách an toàn nhất để tránh thảm hoạ demo là:',
                options: [
                  'Never demo|||Đừng bao giờ demo',
                  'Have a recorded backup video/screenshots|||Có video quay/ảnh chụp dự phòng',
                  'Demo every single feature|||Demo mọi tính năng',
                  'Improvise on the spot|||Ứng biến tại chỗ',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'The recommended answer formula in Q&A is:|||Công thức trả lời được khuyến nghị trong Q&A là:',
                options: [
                  'Opinion → guess → hope|||Ý kiến → đoán → hy vọng',
                  'Direct answer → evidence/number → next step|||Trả lời thẳng → bằng chứng/số → bước tiếp',
                  'Deflect the question|||Né câu hỏi',
                  'Talk until time runs out|||Nói tới hết giờ',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'When asked a number you did not measure, the best response is:|||Khi bị hỏi một con số bạn chưa đo, phản hồi tốt nhất là:',
                options: [
                  'Make up a confident number|||Bịa một con số tự tin',
                  'Admit it honestly and explain how you would find out|||Thừa nhận trung thực và giải thích cách bạn sẽ tìm ra',
                  'Blame a teammate|||Đổ lỗi cho đồng đội',
                  'Change the subject|||Đổi chủ đề',
                ], correctIndex: 1,
              },
              {
                id: 'q5', points: 1,
                question: 'In an 8-minute pitch, you should protect the most time for:|||Trong bài pitch 8 phút, bạn nên bảo vệ nhiều thời gian nhất cho:',
                options: [
                  'The title and intro|||Tiêu đề và giới thiệu',
                  'Evidence/traction (it wins the 40%)|||Bằng chứng/traction (nó thắng 40%)',
                  'Thanking the audience|||Cảm ơn khán giả',
                  'The competition slide|||Slide đối thủ',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 10 — NÂNG CAO ★ ══════════════════ */
    {
      title: 'Chapter 10 — Beyond the syllabus ★: unit economics, growth & fundraising|||Chương 10 — Ngoài giáo trình ★: unit economics, tăng trưởng & gọi vốn',
      description: 'Chương NÂNG CAO ngoài giáo trình: tư duy như founder thật — CAC/LTV, growth loops và gọi vốn nâng cao.',
      lessons: [
        {
          title: '10.1 ★ — Unit economics: CAC, LTV & payback|||10.1 ★ — Unit economics: CAC, LTV & hoàn vốn',
          slug: 'exe101-10-1-unit-economics',
          type: 'VIDEO',
          description: 'Cách tính chi phí thu hút khách (CAC), giá trị trọn đời (LTV) và tỷ lệ LTV/CAC lành mạnh.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1 · ★ Beyond the syllabus</span>
<h2>The math that decides if growth is worth it</h2>
<p class="lead"><span class="badge">★ Beyond the syllabus</span> This whole chapter is beyond the EXE101 syllabus — it's how real founders and investors judge a business. Master it and your pitch answers become bulletproof.</p>

<h3>The two numbers</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">CAC</span> Customer Acquisition Cost — total sales/marketing spend ÷ new customers gained.</div>
<div class="lz-layer"><span class="lz-lk">LTV</span> Lifetime Value — average profit a customer brings over their whole relationship.</div>
</div>

<h3>Worked example — BookSwap unit economics</h3>
<div class="out"><strong>CAC:</strong> You spend 2,000,000đ on flyers + ads and get 400 new users → CAC = 2,000,000 / 400 = <strong>5,000đ per user</strong>.
<strong>LTV:</strong> An average user does 6 trades over 2 years, you earn 5,000đ/trade → LTV = 6 × 5,000 = <strong>30,000đ</strong>.
<strong>Ratio:</strong> LTV / CAC = 30,000 / 5,000 = <strong>6×</strong>.
<strong>Verdict:</strong> healthy! (Rule of thumb: LTV/CAC ≥ 3 is good.) Every 5,000đ spent to acquire returns 30,000đ — so spending more on acquisition <em>makes</em> money. This is the number that justifies raising to grow.</div>

<div class="callout warn"><strong>The reverse case:</strong> if CAC were 40,000đ and LTV 30,000đ, growth would <em>burn</em> money — you'd lose 10,000đ per user. Many flashy startups died exactly here: great growth, broken unit economics.</div>

<h3>Payback period</h3>
<p>Also ask: how long until a customer repays their CAC? Short payback (months, not years) means you can reinvest fast and grow without huge cash reserves.</p>

<div class="callout ok"><strong>Pitch power move:</strong> even a rough "our LTV/CAC looks like ~4× based on early trades" on your traction slide signals a maturity most student teams never reach. It directly answers the toughest investor question before it's asked.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1 · ★ Ngoài giáo trình</span>
<h2>Phép toán quyết định tăng trưởng có đáng không</h2>
<p class="lead"><span class="badge">★ Ngoài giáo trình</span> Cả chương này nằm ngoài syllabus EXE101 — đây là cách founder và nhà đầu tư thật đánh giá một doanh nghiệp. Nắm được nó, câu trả lời pitch của bạn chống đạn.</p>

<h3>Hai con số</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">CAC</span> Chi phí thu hút khách hàng — tổng chi bán hàng/marketing ÷ số khách mới có được.</div>
<div class="lz-layer"><span class="lz-lk">LTV</span> Giá trị trọn đời — lợi nhuận trung bình một khách mang lại suốt cả mối quan hệ.</div>
</div>

<h3>Ví dụ có lời giải — unit economics của BookSwap</h3>
<div class="out"><strong>CAC:</strong> Bạn chi 2.000.000đ cho tờ rơi + quảng cáo và có 400 người dùng mới → CAC = 2.000.000 / 400 = <strong>5.000đ/người</strong>.
<strong>LTV:</strong> Một người dùng trung bình làm 6 giao dịch trong 2 năm, bạn kiếm 5.000đ/giao dịch → LTV = 6 × 5.000 = <strong>30.000đ</strong>.
<strong>Tỷ lệ:</strong> LTV / CAC = 30.000 / 5.000 = <strong>6×</strong>.
<strong>Kết luận:</strong> khỏe mạnh! (Quy tắc: LTV/CAC ≥ 3 là tốt.) Mỗi 5.000đ chi để thu hút trả lại 30.000đ — nên chi thêm cho thu hút <em>tạo ra</em> tiền. Đây là con số biện minh cho việc gọi vốn để lớn.</div>

<div class="callout warn"><strong>Trường hợp ngược:</strong> nếu CAC là 40.000đ và LTV 30.000đ, tăng trưởng sẽ <em>đốt</em> tiền — bạn lỗ 10.000đ mỗi người dùng. Nhiều startup hào nhoáng chết đúng chỗ này: tăng trưởng tuyệt vời, unit economics hỏng.</div>

<h3>Thời gian hoàn vốn (payback)</h3>
<p>Cũng hỏi: bao lâu tới khi một khách trả lại CAC của họ? Payback ngắn (vài tháng, không phải vài năm) nghĩa là bạn tái đầu tư nhanh và lớn mà không cần dự trữ tiền mặt khổng lồ.</p>

<div class="callout ok"><strong>Đòn pitch mạnh:</strong> kể cả một câu ước chừng "LTV/CAC của bọn em nhìn như ~4× dựa trên giao dịch ban đầu" trên slide traction cho thấy độ chín mà hầu hết đội SV không bao giờ đạt. Nó trả lời trực tiếp câu hỏi khó nhất của nhà đầu tư trước khi bị hỏi.</div>
</div>`,
        },
        {
          title: '10.2 ★ — Growth loops & advanced fundraising|||10.2 ★ — Vòng tăng trưởng & gọi vốn nâng cao',
          slug: 'exe101-10-2-growth-fundraising',
          type: 'VIDEO',
          description: 'Growth loop vs funnel, tăng trưởng lan truyền, và các công cụ gọi vốn hiện đại (SAFE, cap table).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.2 · ★ Beyond the syllabus</span>
<h2>How companies grow without spending forever</h2>
<p class="lead"><span class="badge">★ Beyond the syllabus</span> The strongest startups grow through <strong>loops</strong>, not one-way funnels: each user's action brings the next user, so growth compounds instead of requiring endless ad spend.</p>

<h3>Growth loop vs funnel</h3>
<div class="diagram">Funnel (leaky, one-way):   Ads → visit → signup → (most drop off)
Loop (compounding):        User trades → invites the other side →
                           more listings → more trades → more invites ↺</div>
<p>For BookSwap the loop is natural: every trade needs two people, so each seller drags in a buyer (and vice-versa) — the marketplace grows itself. Naming your growth loop is a standout pitch move.</p>

<h3>Types of growth</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Viral</span> Users bring users (referrals, invites, network effects).</div>
<div class="lz-layer"><span class="lz-lk">Content/SEO</span> You create assets that attract search traffic over time.</div>
<div class="lz-layer"><span class="lz-lk">Paid</span> You buy growth — only sustainable if LTV &gt; CAC (chapter 10.1).</div>
</div>

<h3>Advanced fundraising vocabulary</h3>
<table>
<thead><tr><th>Term</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td>SAFE</td><td>Simple Agreement for Future Equity — money now, equity later</td></tr>
<tr><td>Valuation cap</td><td>Max valuation at which a SAFE converts — protects early investors</td></tr>
<tr><td>Cap table</td><td>Who owns what % of the company</td></tr>
<tr><td>Runway</td><td>Months of cash left at current burn</td></tr>
<tr><td>Burn rate</td><td>Net cash spent per month</td></tr>
</tbody>
</table>

<div class="callout ok"><strong>You've now seen the founder's full toolkit</strong> — from finding a problem to unit economics to growth loops. For EXE101 you won't need all of it, but sprinkling the right term at the right moment ("our growth loop is…", "LTV/CAC looks healthy") signals you think like a real founder, and that's exactly what earns top marks.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Network effects are the ultimate moat.</b> A marketplace where each new user makes the product more valuable for everyone (more buyers → more sellers → more buyers) becomes very hard to displace. If your idea has this property, say so — it's the most powerful long-term defensibility story you can tell. <em>The deepest strategic idea beyond the syllabus.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.2 · ★ Ngoài giáo trình</span>
<h2>Cách công ty lớn lên mà không phải chi tiền mãi mãi</h2>
<p class="lead"><span class="badge">★ Ngoài giáo trình</span> Những startup mạnh nhất lớn lên qua <strong>vòng lặp</strong>, không phải phễu một chiều: mỗi hành động của người dùng mang tới người dùng tiếp theo, nên tăng trưởng cộng dồn thay vì đòi chi quảng cáo vô tận.</p>

<h3>Vòng tăng trưởng vs phễu</h3>
<div class="diagram">Phễu (rò rỉ, một chiều):   Quảng cáo → ghé → đăng ký → (đa số rơi rụng)
Vòng (cộng dồn):           Người dùng giao dịch → mời phía bên kia →
                           thêm tin đăng → thêm giao dịch → thêm lời mời ↺</div>
<p>Với BookSwap, vòng lặp là tự nhiên: mỗi giao dịch cần hai người, nên mỗi người bán kéo theo một người mua (và ngược lại) — chợ tự lớn lên. Gọi tên vòng tăng trưởng của bạn là một đòn pitch nổi bật.</p>

<h3>Các kiểu tăng trưởng</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lk">Lan truyền</span> Người dùng mang người dùng (giới thiệu, mời, hiệu ứng mạng).</div>
<div class="lz-layer"><span class="lz-lk">Nội dung/SEO</span> Bạn tạo tài sản thu hút lượng tìm kiếm theo thời gian.</div>
<div class="lz-layer"><span class="lz-lk">Trả phí</span> Bạn mua tăng trưởng — chỉ bền nếu LTV &gt; CAC (bài 10.1).</div>
</div>

<h3>Từ vựng gọi vốn nâng cao</h3>
<table>
<thead><tr><th>Thuật ngữ</th><th>Nghĩa</th></tr></thead>
<tbody>
<tr><td>SAFE</td><td>Thoả thuận cổ phần tương lai — tiền bây giờ, cổ phần sau</td></tr>
<tr><td>Valuation cap</td><td>Mức định giá tối đa để SAFE quy đổi — bảo vệ nhà đầu tư sớm</td></tr>
<tr><td>Cap table</td><td>Ai sở hữu bao nhiêu % công ty</td></tr>
<tr><td>Runway</td><td>Số tháng tiền mặt còn lại ở mức đốt hiện tại</td></tr>
<tr><td>Burn rate</td><td>Tiền ròng chi mỗi tháng</td></tr>
</tbody>
</table>

<div class="callout ok"><strong>Bạn giờ đã thấy trọn bộ công cụ của founder</strong> — từ tìm vấn đề tới unit economics tới vòng tăng trưởng. Với EXE101 bạn không cần hết, nhưng rắc đúng thuật ngữ vào đúng lúc ("vòng tăng trưởng của bọn em là…", "LTV/CAC nhìn khỏe") cho thấy bạn nghĩ như founder thật, và đó chính là thứ ăn điểm cao.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Hiệu ứng mạng là hào nước tối thượng.</b> Một chợ mà mỗi người dùng mới làm sản phẩm giá trị hơn cho mọi người (thêm người mua → thêm người bán → thêm người mua) trở nên rất khó bị thay thế. Nếu ý tưởng của bạn có tính chất này, hãy nói ra — đó là câu chuyện phòng thủ dài hạn mạnh nhất bạn có thể kể. <em>Ý tưởng chiến lược sâu nhất ngoài syllabus.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'A healthy LTV/CAC ratio is generally considered to be:|||Tỷ lệ LTV/CAC khỏe mạnh thường được coi là:',
                options: ['Below 1|||Dưới 1', 'At least 3|||Ít nhất 3', 'Exactly 1|||Đúng bằng 1', 'It does not matter|||Không quan trọng'],
                correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'If CAC = 40,000đ and LTV = 30,000đ, growing faster will:|||Nếu CAC = 40.000đ và LTV = 30.000đ, lớn nhanh hơn sẽ:',
                options: [
                  'Print money|||In ra tiền',
                  'Burn money (lose per customer)|||Đốt tiền (lỗ mỗi khách)',
                  'Have no effect|||Không ảnh hưởng',
                  'Always be fine|||Luôn ổn',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'A growth loop differs from a funnel because:|||Vòng tăng trưởng khác phễu vì:',
                options: [
                  'It is one-way and leaky|||Nó một chiều và rò rỉ',
                  "Each user's action helps bring the next user (it compounds)|||Hành động mỗi người dùng giúp mang người dùng tiếp theo (cộng dồn)",
                  'It requires more ads|||Nó cần nhiều quảng cáo hơn',
                  'It has no users|||Nó không có người dùng',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'A SAFE is:|||SAFE là:',
                options: [
                  'A type of bank loan|||Một loại vay ngân hàng',
                  'An agreement giving money now for equity later|||Một thoả thuận đưa tiền bây giờ lấy cổ phần sau',
                  'A government grant|||Một khoản trợ cấp chính phủ',
                  'A marketing tactic|||Một chiến thuật marketing',
                ], correctIndex: 1,
              },
              {
                id: 'q5', points: 1,
                question: 'The strongest long-term defensibility ("moat") mentioned is:|||"Hào nước" phòng thủ dài hạn mạnh nhất được nhắc là:',
                options: [
                  'A big advertising budget|||Ngân sách quảng cáo lớn',
                  'Network effects (each user makes it more valuable)|||Hiệu ứng mạng (mỗi người dùng làm nó giá trị hơn)',
                  'A nice logo|||Một logo đẹp',
                  'Low prices only|||Chỉ giá thấp',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },
  ],
};
