/**
 * WED201c — Web Design (Thiết kế web). Kỳ 3.
 * Bám syllabus FPTU (sylID 13172, 5 CLO) — dựa trên bộ Coursera "Web Design for
 * Everybody" (Univ. of Michigan). Tiên quyết: None. Công cụ: trình duyệt + Internet.
 * Song ngữ EN/VN. HTML/CSS/JS <pre>+.tok-*+.out. Link Coursera MOOC + CodeLab javascript.
 * Grading: MOOC completion + FE=(TE+PE)/2 + Bonus; pass TE≥4 & PE≥4 & FR≥5.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/WED201c.mjs --apply
 */
export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'WED201c',
    slug: 'web-design',
    title: 'Web Design',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'Build websites from scratch: HTML5 for structure, CSS3 for style, JavaScript for interactivity, and responsive design so pages look right on any screen. Based on the University of Michigan "Web Design for Everybody" Coursera series.|||Xây website từ đầu: HTML5 cho cấu trúc, CSS3 cho kiểu dáng, JavaScript cho tương tác, và responsive để trang hiển thị đúng trên mọi màn hình. Dựa trên bộ Coursera "Web Design for Everybody" của Đại học Michigan.',
    description: 'Môn nhập môn thiết kế và lập trình web front-end: HTML5 (cấu trúc trang), CSS3 (kiểu dáng, bố cục), JavaScript (thêm tương tác, thao tác DOM), và thiết kế responsive (trang hiển thị tốt trên mọi thiết bị). Môn dựa trên bộ MOOC "Web Design for Everybody" của Đại học Michigan trên Coursera; điểm gồm hoàn thành MOOC + thi lý thuyết + thi thực hành. Tiên quyết: không.',
    whatYouLearn: 'HTML5: cấu trúc trang, phần tử ngữ nghĩa, DOM; CSS3: bộ chọn, hộp (box model), màu/font, bố cục Flexbox & Grid; JavaScript: biến, sự kiện, thao tác DOM, thêm tương tác; thiết kế responsive: media query, mobile-first, viewport; và xây một website hoàn chỉnh, responsive như capstone.',
    requirements: 'Tiên quyết: không có. Cần một trình duyệt hiện đại (Chrome/Firefox/Edge), một trình soạn thảo (VS Code khuyên dùng), Internet, và tài khoản Coursera để học các MOOC bắt buộc.',
    documentsNote: 'Học liệu chính: bộ Coursera "Web Design for Everybody" (Univ. of Michigan): Introduction to HTML5, Introduction to CSS3, Interactivity with JavaScript, Advanced Styling with Responsive Design, Web Design for Everybody Capstone. Công cụ: trình duyệt + VS Code. Luyện tập: track Code Lab JavaScript. Kèm file syllabus gốc WED201c.pdf.',
  },
  sections: [
    /* ══════════════════ MỤC 0 ══════════════════ */
    {
      title: 'Section 0 — Introduction & Study Guide|||Mục 0 — Giới thiệu môn học & Hướng dẫn học',
      description: 'Đọc trước tiên: môn học là gì, cách chấm (MOOC + thi), và cách học qua Coursera.',
      lessons: [
        {
          title: '0.1 — About WED201c & the course map|||0.1 — Giới thiệu WED201c & bản đồ môn học',
          slug: 'wed201c-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Front-end web là gì, và toàn cảnh lộ trình HTML → CSS → JS → responsive.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>About WED201c — Web Design</h2>
<p class="lead">Every website is three languages working together: <strong>HTML</strong> gives structure, <strong>CSS</strong> gives style, <strong>JavaScript</strong> gives behaviour. WED201c teaches all three from zero, plus the responsive design that makes a page look right on a phone and a desktop alike.</p>
<p>The course follows the University of Michigan's <strong>"Web Design for Everybody"</strong> Coursera series — you learn on the MOOCs and build a real site as your capstone.</p>
<h3>Course map</h3>
<div class="lz-map">
  <div class="lz-stage">The three languages</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">HTML5 — structure</div><div class="lz-nsub">Elements · semantic tags · the DOM</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">CSS3 — style</div><div class="lz-nsub">Selectors · box model · layout</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">JavaScript — behaviour</div><div class="lz-nsub">Events · DOM manipulation · interactivity</div></div></div>
  <div class="lz-stage">Design for every screen</div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Responsive Design</div><div class="lz-nsub">Media queries · mobile-first · Flexbox/Grid</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Capstone</div><div class="lz-nsub">Build a full responsive website</div></div></div>
  <div class="lz-stage">Advanced · beyond the syllabus</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Accessibility · modern CSS · deploying your site</div><div class="lz-nsub">From student to real front-end</div></div></div>
</div>
<div class="callout ok">Web design is learned by building. Open your editor, write the tags, and refresh the browser constantly. This course pairs each topic with the official Coursera MOOC and hands-on practice.</div>
<a class="link-card codelab" href="https://www.coursera.org/specializations/web-design" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">Web Design for Everybody (Coursera specialization)</span><span class="lc-sub">University of Michigan — the official MOOC series for this course.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Giới thiệu WED201c — Thiết kế web</h2>
<p class="lead">Mọi website là ba ngôn ngữ làm việc cùng nhau: <strong>HTML</strong> tạo cấu trúc, <strong>CSS</strong> tạo kiểu dáng, <strong>JavaScript</strong> tạo hành vi. WED201c dạy cả ba từ số không, cộng thiết kế responsive để trang hiển thị đúng trên điện thoại và máy tính như nhau.</p>
<p>Môn theo bộ Coursera <strong>"Web Design for Everybody"</strong> của Đại học Michigan — bạn học trên MOOC và xây một site thật làm capstone.</p>
<h3>Bản đồ môn học</h3>
<div class="lz-map">
  <div class="lz-stage">Ba ngôn ngữ</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">HTML5 — cấu trúc</div><div class="lz-nsub">Phần tử · thẻ ngữ nghĩa · DOM</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">CSS3 — kiểu dáng</div><div class="lz-nsub">Bộ chọn · box model · bố cục</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">JavaScript — hành vi</div><div class="lz-nsub">Sự kiện · thao tác DOM · tương tác</div></div></div>
  <div class="lz-stage">Thiết kế cho mọi màn hình</div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Responsive Design</div><div class="lz-nsub">Media query · mobile-first · Flexbox/Grid</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Capstone</div><div class="lz-nsub">Xây một website responsive hoàn chỉnh</div></div></div>
  <div class="lz-stage">Nâng cao · ngoài giáo trình</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Khả năng tiếp cận · CSS hiện đại · triển khai site</div><div class="lz-nsub">Từ sinh viên tới front-end thật</div></div></div>
</div>
<div class="callout ok">Thiết kế web học bằng cách xây. Mở trình soạn thảo, viết thẻ, và refresh trình duyệt liên tục. Môn này ghép mỗi chủ đề với MOOC Coursera chính thức và thực hành.</div>
<a class="link-card codelab" href="https://www.coursera.org/specializations/web-design" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">Web Design for Everybody (Coursera specialization)</span><span class="lc-sub">Đại học Michigan — bộ MOOC chính thức của môn này.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
`,
        },
        {
          title: '0.2 — Grading & how the MOOCs count|||0.2 — Cách chấm & vai trò của MOOC',
          slug: 'wed201c-dieu-kien-qua-mon',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Sơ đồ điểm đặc thù: hoàn thành MOOC + FE=(TE+PE)/2; qua khi TE≥4, PE≥4 và FR≥5.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Grading — the MOOCs are part of your grade</h2>
<p class="lead">WED201c has an unusual scheme: you must complete the Coursera MOOCs (with certificates) to be allowed to sit the Final Exam, and your grade combines a theory and a practical exam.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Credits</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Total hours</span><span class="v">150h <small>50h online + 3h offline + exams + self-study</small></span></div>
  <div class="kv"><span class="k">Prerequisite</span><span class="v">None</span></div>
  <div class="kv"><span class="k">Final Exam</span><span class="v">FE = (TE + PE) / 2</span></div>
  <div class="kv"><span class="k">Final Result</span><span class="v">FR = min(10, (TE+PE)/2 + Bonus)</span></div>
  <div class="kv"><span class="k">Pass</span><span class="v">TE ≥ 4 AND PE ≥ 4 AND FR ≥ 5</span></div>
</div>
<div class="callout warn">Three gates, all required: <strong>TE ≥ 4</strong>, <strong>PE ≥ 4</strong>, and <strong>FR ≥ 5</strong>. Finish the MOOCs early and on time — the completion bonus lifts your final result, and certificates are required to take the exam at all.</div>
<div class="note-ct">Study at least 5 hours/week on the MOOCs, keep your progress up to date, and join the forum discussions — bonus is awarded for timely completion.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Cách chấm — MOOC là một phần điểm</h2>
<p class="lead">WED201c có sơ đồ điểm đặc biệt: bạn phải hoàn thành các MOOC Coursera (kèm chứng chỉ) mới được dự thi cuối kỳ, và điểm gồm một bài thi lý thuyết và một bài thi thực hành.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Tín chỉ</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Tổng giờ</span><span class="v">150h <small>50h online + 3h offline + thi + tự học</small></span></div>
  <div class="kv"><span class="k">Tiên quyết</span><span class="v">Không</span></div>
  <div class="kv"><span class="k">Thi cuối (FE)</span><span class="v">FE = (TE + PE) / 2</span></div>
  <div class="kv"><span class="k">Kết quả (FR)</span><span class="v">FR = min(10, (TE+PE)/2 + Bonus)</span></div>
  <div class="kv"><span class="k">Qua môn</span><span class="v">TE ≥ 4 VÀ PE ≥ 4 VÀ FR ≥ 5</span></div>
</div>
<div class="callout warn">Ba cửa ải, đều bắt buộc: <strong>TE ≥ 4</strong>, <strong>PE ≥ 4</strong>, và <strong>FR ≥ 5</strong>. Hoàn thành MOOC sớm và đúng hạn — điểm thưởng hoàn thành nâng kết quả cuối, và chứng chỉ là điều kiện để được thi.</div>
<div class="note-ct">Học ít nhất 5 giờ/tuần trên MOOC, cập nhật tiến độ đều đặn, và tham gia thảo luận diễn đàn — điểm thưởng cho hoàn thành đúng hạn.</div>
</div>
`,
        },
        {
          title: '0.3 — Set up your tools (VS Code + browser)|||0.3 — Cài công cụ (VS Code + trình duyệt)',
          slug: 'wed201c-cai-dat',
          type: 'VIDEO',
          description: 'Trình soạn thảo, trình duyệt và DevTools — không cần cài server, chỉ mở file HTML.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>Set up your tools</h2>
<p class="lead">Front-end needs almost nothing to start: a text editor and a browser. Write an <span class="badge">.html</span> file, double-click it, and it opens in the browser. That is your whole workflow.</p>
<div class="lz-flow">
  <div class="lz-step">Install VS Code (editor)</div>
  <div class="lz-step">Use any modern browser</div>
  <div class="lz-step">Learn DevTools (F12)</div>
  <div class="lz-step">Enrol in the Coursera MOOCs</div>
</div>
<div class="note-ct">The browser's DevTools (press <kbd>F12</kbd>) let you inspect any element, tweak CSS live, and read the console — your most important debugging tool in this course.</div>
<a class="link-card exphub" href="/exp-hub/wed201c-cai-dat-web?ref=%2Fcourses%2Fweb-design%2Flearn&reflabel=WED201c%20%E2%80%94%20Web%20Design" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Install VS Code &amp; set up your workflow</span><span class="lc-sub">Editor, Live Server, DevTools — on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Cài công cụ</h2>
<p class="lead">Front-end gần như không cần gì để bắt đầu: một trình soạn thảo và một trình duyệt. Viết một file <span class="badge">.html</span>, nhấp đúp, nó mở trong trình duyệt. Đó là toàn bộ quy trình.</p>
<div class="lz-flow">
  <div class="lz-step">Cài VS Code (trình soạn thảo)</div>
  <div class="lz-step">Dùng trình duyệt hiện đại nào cũng được</div>
  <div class="lz-step">Học DevTools (F12)</div>
  <div class="lz-step">Ghi danh các MOOC Coursera</div>
</div>
<div class="note-ct">DevTools của trình duyệt (nhấn <kbd>F12</kbd>) cho bạn xem bất kỳ phần tử nào, chỉnh CSS trực tiếp, và đọc console — công cụ gỡ lỗi quan trọng nhất trong môn này.</div>
<a class="link-card exphub" href="/exp-hub/wed201c-cai-dat-web?ref=%2Fcourses%2Fweb-design%2Flearn&reflabel=WED201c%20%E2%80%94%20Web%20Design" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Cài VS Code &amp; thiết lập quy trình</span><span class="lc-sub">Trình soạn thảo, Live Server, DevTools — trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 1 — HTML5 ══════════════════ */
    {
      title: 'Chapter 1 — HTML5: structure|||Chương 1 — HTML5: cấu trúc',
      description: 'Thẻ, phần tử ngữ nghĩa, và DOM — bộ xương của mọi trang web.',
      lessons: [
        {
          title: '1.1 — HTML elements & semantic structure|||1.1 — Phần tử HTML & cấu trúc ngữ nghĩa',
          slug: 'wed201c-html',
          type: 'VIDEO',
          description: 'Cú pháp thẻ, các phần tử thường dùng, và thẻ ngữ nghĩa (header/nav/main/footer).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>HTML5 — the skeleton of a page</h2>
<p class="lead">HTML marks up content with <strong>tags</strong>. A tag like <span class="badge">&lt;p&gt;</span>…<span class="badge">&lt;/p&gt;</span> wraps a paragraph; the browser reads these and builds the page. HTML5 adds <em>semantic</em> tags that describe meaning, not just looks.</p>
<pre><span class="tok-keyword">&lt;!DOCTYPE html&gt;</span>
<span class="tok-keyword">&lt;html&gt;</span>
  <span class="tok-keyword">&lt;head&gt;</span><span class="tok-keyword">&lt;title&gt;</span>My Page<span class="tok-keyword">&lt;/title&gt;</span><span class="tok-keyword">&lt;/head&gt;</span>
  <span class="tok-keyword">&lt;body&gt;</span>
    <span class="tok-keyword">&lt;header&gt;</span><span class="tok-keyword">&lt;h1&gt;</span>Welcome<span class="tok-keyword">&lt;/h1&gt;</span><span class="tok-keyword">&lt;/header&gt;</span>
    <span class="tok-keyword">&lt;main&gt;</span><span class="tok-keyword">&lt;p&gt;</span>Hello, web!<span class="tok-keyword">&lt;/p&gt;</span><span class="tok-keyword">&lt;/main&gt;</span>
  <span class="tok-keyword">&lt;/body&gt;</span>
<span class="tok-keyword">&lt;/html&gt;</span></pre>
<div class="out">Semantic tags — <span class="badge">&lt;header&gt;</span>, <span class="badge">&lt;nav&gt;</span>, <span class="badge">&lt;main&gt;</span>, <span class="badge">&lt;article&gt;</span>, <span class="badge">&lt;footer&gt;</span> — tell browsers and screen readers what each part means. Use them instead of generic <span class="badge">&lt;div&gt;</span> where you can.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Semantic HTML is SEO and accessibility.</b> Search engines weight a single <span class="badge">&lt;h1&gt;</span> and a logical heading order, while screen readers let users jump between <span class="badge">&lt;nav&gt;</span>, <span class="badge">&lt;main&gt;</span> and <span class="badge">&lt;article&gt;</span> landmarks. A wall of <span class="badge">&lt;div&gt;</span> looks identical on screen but is invisible to both. <em>The syllabus shows the tags; it rarely explains that choosing them well is what makes a page findable and usable.</em></div>
<div class="note-ct">The browser turns your HTML into the <b>DOM</b> (Document Object Model) — a tree of nodes that CSS styles and JavaScript manipulates. Everything later builds on this tree.</div>
<a class="link-card codelab" href="https://www.coursera.org/learn/html" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC: Introduction to HTML5</span><span class="lc-sub">University of Michigan on Coursera.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>HTML5 — bộ xương của trang</h2>
<p class="lead">HTML đánh dấu nội dung bằng <strong>thẻ (tag)</strong>. Một thẻ như <span class="badge">&lt;p&gt;</span>…<span class="badge">&lt;/p&gt;</span> bọc một đoạn văn; trình duyệt đọc chúng và dựng trang. HTML5 thêm các thẻ <em>ngữ nghĩa</em> mô tả ý nghĩa, không chỉ hình thức.</p>
<pre><span class="tok-keyword">&lt;!DOCTYPE html&gt;</span>
<span class="tok-keyword">&lt;html&gt;</span>
  <span class="tok-keyword">&lt;head&gt;</span><span class="tok-keyword">&lt;title&gt;</span>My Page<span class="tok-keyword">&lt;/title&gt;</span><span class="tok-keyword">&lt;/head&gt;</span>
  <span class="tok-keyword">&lt;body&gt;</span>
    <span class="tok-keyword">&lt;header&gt;</span><span class="tok-keyword">&lt;h1&gt;</span>Welcome<span class="tok-keyword">&lt;/h1&gt;</span><span class="tok-keyword">&lt;/header&gt;</span>
    <span class="tok-keyword">&lt;main&gt;</span><span class="tok-keyword">&lt;p&gt;</span>Hello, web!<span class="tok-keyword">&lt;/p&gt;</span><span class="tok-keyword">&lt;/main&gt;</span>
  <span class="tok-keyword">&lt;/body&gt;</span>
<span class="tok-keyword">&lt;/html&gt;</span></pre>
<div class="out">Thẻ ngữ nghĩa — <span class="badge">&lt;header&gt;</span>, <span class="badge">&lt;nav&gt;</span>, <span class="badge">&lt;main&gt;</span>, <span class="badge">&lt;article&gt;</span>, <span class="badge">&lt;footer&gt;</span> — cho trình duyệt và trình đọc màn hình biết mỗi phần nghĩa là gì. Dùng chúng thay cho <span class="badge">&lt;div&gt;</span> chung chung khi có thể.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>HTML ngữ nghĩa chính là SEO và khả năng tiếp cận.</b> Công cụ tìm kiếm coi trọng một thẻ <span class="badge">&lt;h1&gt;</span> duy nhất và thứ tự heading hợp lý, còn trình đọc màn hình cho người dùng nhảy giữa các mốc <span class="badge">&lt;nav&gt;</span>, <span class="badge">&lt;main&gt;</span> và <span class="badge">&lt;article&gt;</span>. Một mớ <span class="badge">&lt;div&gt;</span> trông y hệt trên màn hình nhưng vô hình với cả hai. <em>Giáo trình chỉ các thẻ; hiếm khi giải thích rằng chọn thẻ đúng mới làm trang dễ tìm và dễ dùng.</em></div>
<div class="note-ct">Trình duyệt biến HTML của bạn thành <b>DOM</b> (Document Object Model) — một cây các nút mà CSS tạo kiểu và JavaScript thao tác. Mọi thứ sau này dựng trên cây này.</div>
<a class="link-card codelab" href="https://www.coursera.org/learn/html" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC: Introduction to HTML5</span><span class="lc-sub">Đại học Michigan trên Coursera.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 2 — CSS3 ══════════════════ */
    {
      title: 'Chapter 2 — CSS3: style|||Chương 2 — CSS3: kiểu dáng',
      description: 'Bộ chọn, box model, màu/font, và bố cục hiện đại với Flexbox & Grid.',
      lessons: [
        {
          title: '2.1 — Selectors, box model & colours|||2.1 — Bộ chọn, box model & màu',
          slug: 'wed201c-css-basics',
          type: 'VIDEO',
          description: 'CSS gắn kiểu vào phần tử qua bộ chọn; box model (content/padding/border/margin).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>CSS3 — making it beautiful</h2>
<p class="lead">CSS attaches style to HTML. A <strong>selector</strong> picks elements, then a block of <span class="badge">property: value</span> rules styles them. Colours, fonts, spacing, borders — all live here.</p>
<pre><span class="tok-function">h1</span> { <span class="tok-keyword">color</span>: navy; <span class="tok-keyword">font-size</span>: 2rem; }
<span class="tok-function">.card</span> { <span class="tok-keyword">padding</span>: 16px; <span class="tok-keyword">border</span>: 1px solid #ccc; }
<span class="tok-function">#logo</span> { <span class="tok-keyword">width</span>: 120px; }</pre>
<div class="out"><b>Selectors:</b> <span class="badge">h1</span> by tag · <span class="badge">.card</span> by class · <span class="badge">#logo</span> by id. Class is the everyday workhorse.</div>
<h3>The box model</h3>
<div class="lz-flow">
  <div class="lz-step">content</div>
  <div class="lz-step">+ padding (inside)</div>
  <div class="lz-step">+ border</div>
  <div class="lz-step">+ margin (outside)</div>
</div>
<div class="pitfall"><b>Trap:</b> by default width does not include padding/border, which surprises beginners. Add <span class="badge">box-sizing: border-box</span> so width means the visible box — almost everyone sets this globally.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Specificity decides which rule wins.</b> When two rules target the same element, the browser scores each selector — inline style, then id (<span class="badge">#logo</span>), then class (<span class="badge">.card</span>), then tag (<span class="badge">h1</span>) — and the higher score wins, regardless of order in the file. That is why a stubborn colour won't change: something more specific is beating you, not a typo. <em>Beginners are taught "last rule wins", but the cascade is really specificity first, order only as a tie-breaker.</em></div>
<a class="link-card codelab" href="https://www.coursera.org/learn/introcss" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC: Introduction to CSS3</span><span class="lc-sub">University of Michigan on Coursera.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>CSS3 — làm cho đẹp</h2>
<p class="lead">CSS gắn kiểu vào HTML. Một <strong>bộ chọn (selector)</strong> chọn các phần tử, rồi một khối luật <span class="badge">thuộc-tính: giá-trị</span> tạo kiểu cho chúng. Màu, font, khoảng cách, viền — đều ở đây.</p>
<pre><span class="tok-function">h1</span> { <span class="tok-keyword">color</span>: navy; <span class="tok-keyword">font-size</span>: 2rem; }
<span class="tok-function">.card</span> { <span class="tok-keyword">padding</span>: 16px; <span class="tok-keyword">border</span>: 1px solid #ccc; }
<span class="tok-function">#logo</span> { <span class="tok-keyword">width</span>: 120px; }</pre>
<div class="out"><b>Bộ chọn:</b> <span class="badge">h1</span> theo thẻ · <span class="badge">.card</span> theo class · <span class="badge">#logo</span> theo id. Class là con ngựa thồ hằng ngày.</div>
<h3>Box model (mô hình hộp)</h3>
<div class="lz-flow">
  <div class="lz-step">content (nội dung)</div>
  <div class="lz-step">+ padding (đệm trong)</div>
  <div class="lz-step">+ border (viền)</div>
  <div class="lz-step">+ margin (lề ngoài)</div>
</div>
<div class="pitfall"><b>Bẫy:</b> mặc định width không tính padding/border, khiến người mới bất ngờ. Thêm <span class="badge">box-sizing: border-box</span> để width nghĩa là hộp nhìn thấy — hầu như ai cũng đặt cái này toàn cục.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Specificity quyết định luật nào thắng.</b> Khi hai luật cùng nhắm một phần tử, trình duyệt chấm điểm mỗi bộ chọn — inline style, rồi id (<span class="badge">#logo</span>), rồi class (<span class="badge">.card</span>), rồi thẻ (<span class="badge">h1</span>) — điểm cao hơn thắng, bất kể thứ tự trong file. Đó là lý do một màu cứng đầu không đổi: có thứ specificity cao hơn đang thắng bạn, không phải lỗi gõ. <em>Người mới được dạy "luật cuối thắng", nhưng cascade thật ra là specificity trước, thứ tự chỉ để phá hòa.</em></div>
<a class="link-card codelab" href="https://www.coursera.org/learn/introcss" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC: Introduction to CSS3</span><span class="lc-sub">Đại học Michigan trên Coursera.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
`,
        },
        {
          title: '2.2 — Layout with Flexbox & Grid|||2.2 — Bố cục với Flexbox & Grid',
          slug: 'wed201c-flexbox-grid',
          type: 'VIDEO',
          description: 'Hai hệ bố cục hiện đại: Flexbox (một chiều) và Grid (hai chiều).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Layout — Flexbox &amp; Grid</h2>
<p class="lead">Arranging boxes on a page used to be painful. Modern CSS gives two powerful systems: <strong>Flexbox</strong> for one-dimensional rows or columns, and <strong>Grid</strong> for two-dimensional layouts.</p>
<pre><span class="tok-function">.row</span> {
  <span class="tok-keyword">display</span>: flex;
  <span class="tok-keyword">justify-content</span>: space-between;  <span class="tok-comment">/* spread along the row */</span>
  <span class="tok-keyword">align-items</span>: center;            <span class="tok-comment">/* center across it */</span>
}</pre>
<div class="lz-stack">
  <div class="lz-layer"><b>Flexbox</b> — line items up in a row/column, distribute space, align them. Perfect for navbars, card rows, toolbars.</div>
  <div class="lz-layer"><b>Grid</b> — define rows AND columns; place items into cells. Perfect for page layouts and galleries.</div>
</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Grid can be responsive with zero media queries.</b> <span class="badge">grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))</span> tells the browser to fit as many 220px-plus columns as the width allows and wrap the rest — a card gallery that reflows from four columns to one entirely on its own. Add <span class="badge">gap</span> for spacing instead of margins. <em>The course teaches media queries for responsiveness; intrinsic sizing like this often replaces them and is what modern layouts actually use.</em></div>
<div class="note-ct">Rule of thumb: Flexbox for one axis (a menu), Grid for two axes (a whole page layout). Together they replace the old float/table hacks entirely.</div>
<a class="link-card codelab" href="https://www.coursera.org/learn/introcss" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC: CSS3 — layout & positioning</span><span class="lc-sub">University of Michigan on Coursera.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Bố cục — Flexbox &amp; Grid</h2>
<p class="lead">Sắp xếp các hộp trên trang từng rất khổ. CSS hiện đại cho hai hệ mạnh: <strong>Flexbox</strong> cho hàng/cột một chiều, và <strong>Grid</strong> cho bố cục hai chiều.</p>
<pre><span class="tok-function">.row</span> {
  <span class="tok-keyword">display</span>: flex;
  <span class="tok-keyword">justify-content</span>: space-between;  <span class="tok-comment">/* dàn theo hàng */</span>
  <span class="tok-keyword">align-items</span>: center;            <span class="tok-comment">/* căn giữa theo chiều ngang */</span>
}</pre>
<div class="lz-stack">
  <div class="lz-layer"><b>Flexbox</b> — xếp các mục thành hàng/cột, phân bổ khoảng trống, căn chúng. Hoàn hảo cho navbar, hàng thẻ, thanh công cụ.</div>
  <div class="lz-layer"><b>Grid</b> — định nghĩa hàng VÀ cột; đặt các mục vào ô. Hoàn hảo cho bố cục trang và thư viện ảnh.</div>
</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Grid có thể responsive mà không cần media query nào.</b> <span class="badge">grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))</span> bảo trình duyệt nhét vừa nhiều cột từ 220px trở lên theo bề rộng cho phép rồi xuống dòng phần còn lại — một thư viện thẻ tự co từ bốn cột về một cột hoàn toàn tự động. Dùng <span class="badge">gap</span> cho khoảng cách thay cho margin. <em>Môn dạy media query để responsive; cách định cỡ nội tại như thế này thường thay thế chúng và là thứ bố cục hiện đại thật sự dùng.</em></div>
<div class="note-ct">Nguyên tắc: Flexbox cho một trục (một menu), Grid cho hai trục (bố cục cả trang). Cùng nhau chúng thay hẳn các mẹo float/table cũ.</div>
<a class="link-card codelab" href="https://www.coursera.org/learn/introcss" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC: CSS3 — bố cục & định vị</span><span class="lc-sub">Đại học Michigan trên Coursera.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 3 — JAVASCRIPT ══════════════════ */
    {
      title: 'Chapter 3 — JavaScript: interactivity|||Chương 3 — JavaScript: tương tác',
      description: 'Biến, sự kiện, và thao tác DOM — làm cho trang phản hồi người dùng.',
      lessons: [
        {
          title: '3.1 — JavaScript, events & the DOM|||3.1 — JavaScript, sự kiện & DOM',
          slug: 'wed201c-javascript',
          type: 'VIDEO',
          description: 'Thêm hành vi: bắt sự kiện (click), thay đổi nội dung/kiểu trang qua DOM.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>JavaScript — making pages respond</h2>
<p class="lead">HTML and CSS make a static page. <strong>JavaScript</strong> makes it react: click a button, validate a form, update content without reloading. It runs in the browser and manipulates the DOM.</p>
<pre><span class="tok-keyword">const</span> btn = document.<span class="tok-function">querySelector</span>(<span class="tok-string">"#greet"</span>);
btn.<span class="tok-function">addEventListener</span>(<span class="tok-string">"click"</span>, () =&gt; {
  document.<span class="tok-function">querySelector</span>(<span class="tok-string">"#out"</span>).textContent = <span class="tok-string">"Hello!"</span>;
});</pre>
<div class="out">Clicking the button finds the output element and changes its text — the page updates instantly, no reload. That is DOM manipulation.</div>
<div class="lz-stack">
  <div class="lz-layer"><b>Select</b> — <span class="badge">querySelector</span> finds an element by CSS selector.</div>
  <div class="lz-layer"><b>Listen</b> — <span class="badge">addEventListener</span> runs code on click, input, submit…</div>
  <div class="lz-layer"><b>Change</b> — set <span class="badge">textContent</span>, <span class="badge">.style</span>, add/remove classes.</div>
</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>One listener can handle a whole list — event delegation.</b> Because a click <em>bubbles</em> up from the clicked element through its ancestors, you can attach a single <span class="badge">addEventListener</span> on a parent and read <span class="badge">event.target</span> to know which child was hit. This keeps working for items added later, and beats attaching hundreds of listeners. <em>The syllabus shows one button, one listener; real apps lean on bubbling and delegation, which the intro rarely names.</em></div>
<a class="link-card codelab" href="/code-lab/javascript?ref=%2Fcourses%2Fweb-design%2Flearn&reflabel=WED201c%20%E2%80%94%20Web%20Design#module-265" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practise: DOM manipulation & events</span><span class="lc-sub">JavaScript track — run code in the browser.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="https://www.coursera.org/learn/javascript" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC: Interactivity with JavaScript</span><span class="lc-sub">University of Michigan on Coursera.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>JavaScript — làm trang phản hồi</h2>
<p class="lead">HTML và CSS tạo trang tĩnh. <strong>JavaScript</strong> làm nó phản ứng: bấm nút, kiểm tra form, cập nhật nội dung mà không tải lại. Nó chạy trong trình duyệt và thao tác DOM.</p>
<pre><span class="tok-keyword">const</span> btn = document.<span class="tok-function">querySelector</span>(<span class="tok-string">"#greet"</span>);
btn.<span class="tok-function">addEventListener</span>(<span class="tok-string">"click"</span>, () =&gt; {
  document.<span class="tok-function">querySelector</span>(<span class="tok-string">"#out"</span>).textContent = <span class="tok-string">"Hello!"</span>;
});</pre>
<div class="out">Bấm nút sẽ tìm phần tử output và đổi text của nó — trang cập nhật tức thì, không tải lại. Đó là thao tác DOM.</div>
<div class="lz-stack">
  <div class="lz-layer"><b>Chọn</b> — <span class="badge">querySelector</span> tìm phần tử theo bộ chọn CSS.</div>
  <div class="lz-layer"><b>Lắng nghe</b> — <span class="badge">addEventListener</span> chạy code khi click, input, submit…</div>
  <div class="lz-layer"><b>Thay đổi</b> — đặt <span class="badge">textContent</span>, <span class="badge">.style</span>, thêm/xóa class.</div>
</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Một listener xử lý cả danh sách — event delegation.</b> Vì cú click <em>nổi bọt (bubble)</em> từ phần tử được bấm lên qua các tổ tiên, bạn có thể gắn một <span class="badge">addEventListener</span> duy nhất trên phần tử cha rồi đọc <span class="badge">event.target</span> để biết con nào bị bấm. Cách này vẫn chạy cho các mục thêm sau, và hơn hẳn việc gắn hàng trăm listener. <em>Giáo trình chỉ một nút, một listener; ứng dụng thật dựa vào bubbling và delegation, điều bài nhập môn hiếm khi gọi tên.</em></div>
<a class="link-card codelab" href="/code-lab/javascript?ref=%2Fcourses%2Fweb-design%2Flearn&reflabel=WED201c%20%E2%80%94%20Web%20Design#module-265" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: thao tác DOM & sự kiện</span><span class="lc-sub">Track JavaScript — chạy code trong trình duyệt.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="https://www.coursera.org/learn/javascript" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC: Interactivity with JavaScript</span><span class="lc-sub">Đại học Michigan trên Coursera.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
`,
        },
        {
          title: 'Quiz 1 — HTML, CSS & JavaScript|||Quiz 1 — HTML, CSS & JavaScript',
          slug: 'wed201c-quiz-1',
          type: 'QUIZ',
          description: 'Kiểm tra ba ngôn ngữ nền tảng của web.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'HTML is responsible for a page\'s…|||HTML chịu trách nhiệm về … của trang', options: ['style|||kiểu dáng', 'structure/content|||cấu trúc/nội dung', 'animation|||hoạt ảnh', 'server|||máy chủ'], correctIndex: 1, points: 1 },
              { question: 'A CSS class selector is written as…|||Bộ chọn class trong CSS viết là…', options: ['#name', '.name', 'name()', '@name'], correctIndex: 1, points: 1 },
              { question: 'box-sizing: border-box makes width…|||box-sizing: border-box khiến width…', options: ['exclude padding and border|||không gồm padding và border', 'include padding and border|||gồm cả padding và border', 'become zero|||thành 0', 'ignore content|||bỏ qua content'], correctIndex: 1, points: 1 },
              { question: 'To run code when a button is clicked you use…|||Để chạy code khi bấm nút bạn dùng…', options: ['a CSS selector|||một bộ chọn CSS', 'addEventListener("click", …)', 'a semantic tag|||một thẻ ngữ nghĩa', 'the box model|||box model'], correctIndex: 1, points: 1 },
              { question: 'Flexbox is best for … layouts and Grid for … layouts.|||Flexbox tốt cho bố cục … và Grid cho bố cục …', options: ['two-dimensional / one-dimensional|||hai chiều / một chiều', 'one-dimensional / two-dimensional|||một chiều / hai chiều', 'both the same|||cả hai như nhau', 'neither|||không cái nào'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 4 — RESPONSIVE ══════════════════ */
    {
      title: 'Chapter 4 — Responsive Design|||Chương 4 — Thiết kế responsive',
      description: 'Media query, mobile-first và viewport — một trang, mọi màn hình.',
      lessons: [
        {
          title: '4.1 — Media queries & mobile-first|||4.1 — Media query & mobile-first',
          slug: 'wed201c-responsive',
          type: 'VIDEO',
          description: 'Trang tự thích ứng kích thước màn hình bằng media query; tư duy mobile-first.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Responsive design — one page, every screen</h2>
<p class="lead">A site must look right on a phone, a tablet and a desktop. <strong>Responsive design</strong> achieves this with <span class="badge">media queries</span> that apply different CSS at different screen widths.</p>
<pre><span class="tok-comment">/* base styles = mobile first */</span>
<span class="tok-function">.grid</span> { <span class="tok-keyword">display</span>: block; }

<span class="tok-comment">/* wider screens get columns */</span>
<span class="tok-keyword">@media</span> (min-width: 768px) {
  <span class="tok-function">.grid</span> { <span class="tok-keyword">display</span>: grid; <span class="tok-keyword">grid-template-columns</span>: 1fr 1fr; }
}</pre>
<div class="lz-stack">
  <div class="lz-layer"><b>Mobile-first</b> — write the small-screen layout first, then add complexity for bigger screens. Simpler and faster.</div>
  <div class="lz-layer"><b>The viewport tag</b> — <span class="badge">&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;</span> is required, or mobiles pretend to be desktop.</div>
  <div class="lz-layer"><b>Relative units</b> — use %, rem, vw over fixed px so things scale.</div>
</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>clamp() gives fluid sizing without breakpoints.</b> <span class="badge">font-size: clamp(1rem, 2.5vw, 1.5rem)</span> scales smoothly between a minimum and a maximum as the viewport changes — no media query, no sudden jumps. Newer <span class="badge">@container</span> queries go further, letting a component respond to its own width instead of the screen's, so the same card adapts inside a sidebar or a wide main area. <em>The course stops at media queries; clamp() and container queries are how modern responsive design avoids the "breakpoint jungle".</em></div>
<a class="link-card codelab" href="https://www.coursera.org/learn/responsivedesign" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC: Responsive Design</span><span class="lc-sub">University of Michigan on Coursera.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Thiết kế responsive — một trang, mọi màn hình</h2>
<p class="lead">Một site phải hiển thị đúng trên điện thoại, máy tính bảng và máy để bàn. <strong>Thiết kế responsive</strong> đạt điều này bằng <span class="badge">media query</span> áp CSS khác nhau ở các bề rộng màn hình khác nhau.</p>
<pre><span class="tok-comment">/* kiểu nền = mobile trước */</span>
<span class="tok-function">.grid</span> { <span class="tok-keyword">display</span>: block; }

<span class="tok-comment">/* màn hình rộng hơn có cột */</span>
<span class="tok-keyword">@media</span> (min-width: 768px) {
  <span class="tok-function">.grid</span> { <span class="tok-keyword">display</span>: grid; <span class="tok-keyword">grid-template-columns</span>: 1fr 1fr; }
}</pre>
<div class="lz-stack">
  <div class="lz-layer"><b>Mobile-first</b> — viết bố cục màn hình nhỏ trước, rồi thêm phức tạp cho màn hình lớn. Đơn giản và nhanh hơn.</div>
  <div class="lz-layer"><b>Thẻ viewport</b> — <span class="badge">&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;</span> là bắt buộc, nếu không điện thoại giả vờ là desktop.</div>
  <div class="lz-layer"><b>Đơn vị tương đối</b> — dùng %, rem, vw thay px cố định để mọi thứ co giãn.</div>
</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>clamp() cho cỡ co giãn mượt mà không cần breakpoint.</b> <span class="badge">font-size: clamp(1rem, 2.5vw, 1.5rem)</span> co giãn mượt giữa một cực tiểu và một cực đại khi viewport đổi — không media query, không nhảy đột ngột. <span class="badge">@container</span> query mới hơn còn đi xa hơn, cho một component phản hồi theo bề rộng của chính nó thay vì của màn hình, nên cùng một thẻ tự thích ứng trong sidebar hay vùng main rộng. <em>Môn dừng ở media query; clamp() và container query là cách thiết kế responsive hiện đại tránh "rừng breakpoint".</em></div>
<a class="link-card codelab" href="https://www.coursera.org/learn/responsivedesign" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC: Responsive Design</span><span class="lc-sub">Đại học Michigan trên Coursera.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 5 — CAPSTONE ══════════════════ */
    {
      title: 'Chapter 5 — Capstone: build a website|||Chương 5 — Capstone: xây một website',
      description: 'Ghép HTML + CSS + JS + responsive thành một site hoàn chỉnh — dự án tổng kết.',
      lessons: [
        {
          title: '5.1 — Putting it all together|||5.1 — Ghép tất cả lại',
          slug: 'wed201c-capstone',
          type: 'VIDEO',
          description: 'Quy trình xây một website nhiều trang, responsive, có tương tác — như bài thi thực hành.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Capstone — build a real website</h2>
<p class="lead">The final MOOC and the practical exam ask the same thing: build a complete, responsive site. Everything you learned comes together — structure, style, interactivity, adaptation.</p>
<div class="lz-flow">
  <div class="lz-step">Plan pages &amp; content (sketch first)</div>
  <div class="lz-step">HTML structure with semantic tags</div>
  <div class="lz-step">CSS styling + Flexbox/Grid layout</div>
  <div class="lz-step">Media queries for mobile → desktop</div>
  <div class="lz-step">JavaScript for interactivity</div>
  <div class="lz-step">Test on real screen sizes (DevTools)</div>
</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Ship it, then measure it with Lighthouse.</b> Chrome DevTools has a built-in <b>Lighthouse</b> audit that scores your finished site on performance, accessibility, best practices and SEO, with concrete fixes: compress images, add <span class="badge">alt</span> text, defer scripts, set a viewport. Running it turns "it looks done" into a checklist of what actually needs work. <em>The capstone grades that the page works; professionals also grade how fast and how accessible it is — a habit the syllabus leaves out.</em></div>
<div class="callout ok">Build incrementally and check in the browser after every change — exactly like the practical exam. A working single page beats an ambitious broken one.</div>
<a class="link-card codelab" href="https://www.coursera.org/learn/web-design-project" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC: Web Design for Everybody Capstone</span><span class="lc-sub">University of Michigan on Coursera.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Capstone — xây một website thật</h2>
<p class="lead">MOOC cuối và thi thực hành yêu cầu cùng một điều: xây một site hoàn chỉnh, responsive. Mọi thứ bạn học hội tụ — cấu trúc, kiểu dáng, tương tác, thích ứng.</p>
<div class="lz-flow">
  <div class="lz-step">Lên kế hoạch trang &amp; nội dung (phác thảo trước)</div>
  <div class="lz-step">Cấu trúc HTML với thẻ ngữ nghĩa</div>
  <div class="lz-step">Tạo kiểu CSS + bố cục Flexbox/Grid</div>
  <div class="lz-step">Media query cho mobile → desktop</div>
  <div class="lz-step">JavaScript cho tương tác</div>
  <div class="lz-step">Kiểm trên kích thước màn hình thật (DevTools)</div>
</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Đưa lên rồi đo bằng Lighthouse.</b> Chrome DevTools có sẵn công cụ kiểm <b>Lighthouse</b> chấm điểm site hoàn chỉnh về hiệu năng, khả năng tiếp cận, best practice và SEO, kèm cách sửa cụ thể: nén ảnh, thêm chữ <span class="badge">alt</span>, hoãn tải script, đặt viewport. Chạy nó biến "trông có vẻ xong" thành một danh sách những gì thật sự cần làm. <em>Capstone chấm trang chạy được; dân chuyên nghiệp còn chấm nó nhanh và tiếp cận tốt tới đâu — thói quen giáo trình bỏ qua.</em></div>
<div class="callout ok">Xây từng bước và kiểm trong trình duyệt sau mỗi thay đổi — đúng như thi thực hành. Một trang đơn chạy được hơn một trang tham vọng bị hỏng.</div>
<a class="link-card codelab" href="https://www.coursera.org/learn/web-design-project" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC: Web Design for Everybody Capstone</span><span class="lc-sub">Đại học Michigan trên Coursera.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
`,
        },
      ],
    },

    /* ══════════════════ NÂNG CAO ══════════════════ */
    {
      title: 'Advanced — Beyond the syllabus|||Nâng cao — Ngoài giáo trình',
      description: 'Khả năng tiếp cận, CSS hiện đại (framework), và triển khai site lên Internet.',
      lessons: [
        {
          title: 'A.1 — Accessibility, modern CSS & deploying|||A.1 — Tiếp cận, CSS hiện đại & triển khai',
          slug: 'wed201c-nang-cao',
          type: 'VIDEO',
          description: 'Làm web ai cũng dùng được (a11y); framework CSS (Tailwind/Bootstrap); đưa site lên mạng miễn phí.',
          content: `
<div class="ml-en">
<span class="eyebrow">Advanced · Lesson A.1</span>
<h2>Beyond the basics — real front-end habits</h2>
<p class="lead">Passing WED201c makes you a web author; these habits make you a good one — and they show up in interviews and real jobs.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Accessibility (a11y)</b> — semantic tags, <span class="badge">alt</span> text on images, keyboard navigation, sufficient colour contrast. A site everyone can use, including screen-reader users.</div>
  <div class="lz-layer"><b>Modern CSS frameworks</b> — utility-first Tailwind CSS or component libraries like Bootstrap speed up real projects. You already understand what they generate.</div>
  <div class="lz-layer"><b>Deploying</b> — put your site online for free with GitHub Pages, Netlify or Vercel. A live URL beats a folder on your laptop for a portfolio.</div>
</div>
<div class="note-ct">Your capstone site, deployed to a live URL, is the first piece of your developer portfolio. Employers click links, not zip files.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Nâng cao · Bài A.1</span>
<h2>Vượt cơ bản — thói quen front-end thật</h2>
<p class="lead">Qua WED201c biến bạn thành người viết web; những thói quen này biến bạn thành người giỏi — và chúng xuất hiện trong phỏng vấn và công việc thật.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Khả năng tiếp cận (a11y)</b> — thẻ ngữ nghĩa, chữ <span class="badge">alt</span> cho ảnh, điều hướng bàn phím, độ tương phản màu đủ. Một site ai cũng dùng được, kể cả người dùng trình đọc màn hình.</div>
  <div class="lz-layer"><b>Framework CSS hiện đại</b> — Tailwind CSS (utility-first) hay thư viện component như Bootstrap tăng tốc dự án thật. Bạn đã hiểu chúng sinh ra cái gì.</div>
  <div class="lz-layer"><b>Triển khai</b> — đưa site lên mạng miễn phí với GitHub Pages, Netlify hay Vercel. Một URL sống hơn một thư mục trên laptop cho portfolio.</div>
</div>
<div class="note-ct">Site capstone của bạn, triển khai lên một URL sống, là mảnh đầu tiên trong portfolio lập trình viên. Nhà tuyển dụng bấm link, không mở file zip.</div>
</div>
`,
        },
        {
          title: 'Quiz 2 — Responsive, Capstone & Advanced|||Quiz 2 — Responsive, Capstone & Nâng cao',
          slug: 'wed201c-quiz-2',
          type: 'QUIZ',
          description: 'Kiểm tra responsive design và thực hành xây site.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'Media queries let you…|||Media query cho phép bạn…', options: ['play audio|||phát âm thanh', 'apply different CSS at different screen widths|||áp CSS khác nhau ở các bề rộng màn hình khác nhau', 'query a database|||truy vấn database', 'add JavaScript|||thêm JavaScript'], correctIndex: 1, points: 1 },
              { question: 'The viewport meta tag is needed so that…|||Thẻ meta viewport cần để…', options: ['the page loads faster|||trang tải nhanh hơn', 'mobiles render at real device width, not pretend desktop|||điện thoại hiển thị đúng bề rộng thiết bị, không giả desktop', 'CSS works|||CSS hoạt động', 'images show|||ảnh hiện'], correctIndex: 1, points: 1 },
              { question: 'Mobile-first means…|||Mobile-first nghĩa là…', options: ['ignore desktop|||bỏ qua desktop', 'write the small-screen layout first, then enhance for larger|||viết bố cục màn hình nhỏ trước, rồi nâng cho lớn hơn', 'only build apps|||chỉ xây app', 'use fixed pixels|||dùng pixel cố định'], correctIndex: 1, points: 1 },
              { question: 'For the practical exam, the safest approach is to…|||Cho thi thực hành, cách an toàn nhất là…', options: ['build everything then test once|||xây tất cả rồi kiểm một lần', 'build incrementally and check in the browser after each change|||xây từng bước và kiểm trong trình duyệt sau mỗi thay đổi', 'skip responsive|||bỏ responsive', 'avoid semantic tags|||tránh thẻ ngữ nghĩa'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* END-SECTIONS-MARKER */
  ],
};
