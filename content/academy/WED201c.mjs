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
        {
          title: '1.2 — Text, links, images & multimedia|||1.2 — Văn bản, liên kết, ảnh & đa phương tiện',
          slug: 'wed201c-html-noi-dung',
          type: 'VIDEO',
          description: 'Các thẻ nội dung của MOOC 1: đường dẫn tương đối/tuyệt đối, ảnh responsive, audio/video, bảng dữ liệu.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>Putting real content on the page</h2>
<p class="lead">Lesson 1.1 gave you the skeleton. This is the content MOOC 1 module 2 covers: links, images, multimedia and tables — plus the details that separate a page that "works on my machine" from one that works everywhere.</p>

<h3>Links and the path rule</h3>
<pre>&lt;a href="about.html"&gt;About&lt;/a&gt;              <span class="tok-comment">&lt;!-- same folder --&gt;</span>
&lt;a href="pages/contact.html"&gt;Contact&lt;/a&gt;   <span class="tok-comment">&lt;!-- into a subfolder --&gt;</span>
&lt;a href="../index.html"&gt;Home&lt;/a&gt;           <span class="tok-comment">&lt;!-- up one level --&gt;</span>
&lt;a href="/css/style.css"&gt;                  <span class="tok-comment">&lt;!-- from the site root --&gt;</span>
&lt;a href="https://fpt.edu.vn" target="_blank" rel="noopener"&gt;FPTU&lt;/a&gt;
&lt;a href="#section2"&gt;Jump&lt;/a&gt;                <span class="tok-comment">&lt;!-- to id="section2" on this page --&gt;</span></pre>
<div class="out"><b>Why student sites break after upload.</b> <span class="badge">href="C:/Users/An/web/about.html"</span> works on your laptop and nowhere else. Always use relative paths (or root-relative starting with <span class="badge">/</span>), and remember that most web servers are <em>case sensitive</em>: <span class="badge">About.html</span> ≠ <span class="badge">about.html</span>. Those two rules fix almost every "it worked locally" bug.<br>
<b><span class="badge">rel="noopener"</span> with <span class="badge">target="_blank"</span></b> stops the opened page from getting a reference to yours — a genuine security fix, not decoration.</div>

<h3>Images — three attributes, all required in practice</h3>
<pre>&lt;img src="images/campus.jpg"
     alt="FPTU Hoa Lac campus seen from the main gate"
     width="800" height="600"&gt;</pre>
<div class="out"><b><span class="badge">alt</span></b> — what a screen reader announces and what shows if the file fails to load. Describe the <em>content</em>, not the file ("photo.jpg" is useless). A purely decorative image gets <span class="badge">alt=""</span>, which tells the reader to skip it.<br>
<b><span class="badge">width</span> and <span class="badge">height</span></b> — let the browser reserve the space before the image arrives, so the text does not jump as it loads. This is the "layout shift" metric Google measures.<br>
<b>Formats:</b> JPG for photographs, PNG for graphics with transparency, SVG for logos and icons (scales to any size), WebP for both at a smaller file size.</div>

<h3>Responsive images — one picture, several files</h3>
<pre>&lt;img src="hero-800.jpg"
     srcset="hero-400.jpg 400w, hero-800.jpg 800w, hero-1600.jpg 1600w"
     sizes="(max-width: 600px) 100vw, 50vw"
     alt="Campus"&gt;</pre>
<p>The browser picks the smallest file that still looks sharp on that device — a phone downloads 400px instead of 1600px, which is the single biggest saving on a mobile page.</p>

<h3>Audio and video</h3>
<pre>&lt;video controls poster="thumb.jpg" width="640"&gt;
    &lt;source src="intro.mp4" type="video/mp4"&gt;
    &lt;source src="intro.webm" type="video/webm"&gt;
    Your browser does not support video.
&lt;/video&gt;</pre>
<p>List several <span class="badge">&lt;source&gt;</span> elements and the browser takes the first it understands; the text inside is the fallback. Never use <span class="badge">autoplay</span> with sound — browsers block it and users hate it.</p>

<h3>Tables — for data, never for layout</h3>
<pre>&lt;table&gt;
  &lt;caption&gt;Semester 3 marks&lt;/caption&gt;
  &lt;thead&gt;&lt;tr&gt;&lt;th scope="col"&gt;Subject&lt;/th&gt;&lt;th scope="col"&gt;Mark&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;
  &lt;tbody&gt;
    &lt;tr&gt;&lt;th scope="row"&gt;WED201c&lt;/th&gt;&lt;td&gt;8.5&lt;/td&gt;&lt;/tr&gt;
    &lt;tr&gt;&lt;th scope="row"&gt;DBI202&lt;/th&gt;&lt;td&gt;7.0&lt;/td&gt;&lt;/tr&gt;
  &lt;/tbody&gt;
&lt;/table&gt;</pre>
<p><span class="badge">&lt;caption&gt;</span>, <span class="badge">&lt;thead&gt;</span> and <span class="badge">scope</span> are what let a screen reader say "Subject: WED201c, Mark: 8.5" instead of reading disconnected numbers. Page layout belongs to Flexbox and Grid (lesson 2.2), not to tables.</p>

<div class="pitfall"><b>An image with no <span class="badge">alt</span> fails the W3C validator and the accessibility check — both of which the MOOC 1 final project is graded on.</b> The same applies to a missing <span class="badge">&lt;title&gt;</span> and to skipped heading levels (h1 → h3). Run <span class="badge">validator.w3.org</span> before you submit; it takes ten seconds and catches all three.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b><span class="badge">loading="lazy"</span> — one attribute, a measurable win.</b> Adding it to images below the fold tells the browser not to download them until the user scrolls near them. On a gallery page that is often half the total bytes and a second of load time, with no JavaScript and no library. Pair it with <span class="badge">decoding="async"</span> and correct width/height and you have done most of what an "image optimisation" consultant would charge for. <em>Beyond syllabus because the MOOC teaches the <span class="badge">&lt;img&gt;</span> tag as markup, while performance is what your site is actually judged on.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Đưa nội dung thật lên trang</h2>
<p class="lead">Bài 1.1 cho bạn bộ khung. Đây là phần nội dung mà MOOC 1 mô-đun 2 dạy: liên kết, ảnh, đa phương tiện và bảng — cộng những chi tiết phân biệt một trang "chạy trên máy em" với một trang chạy được ở mọi nơi.</p>

<h3>Liên kết và quy tắc đường dẫn</h3>
<pre>&lt;a href="about.html"&gt;Giới thiệu&lt;/a&gt;         <span class="tok-comment">&lt;!-- cùng thư mục --&gt;</span>
&lt;a href="pages/contact.html"&gt;Liên hệ&lt;/a&gt;    <span class="tok-comment">&lt;!-- vào thư mục con --&gt;</span>
&lt;a href="../index.html"&gt;Trang chủ&lt;/a&gt;      <span class="tok-comment">&lt;!-- lùi lên một cấp --&gt;</span>
&lt;a href="/css/style.css"&gt;                  <span class="tok-comment">&lt;!-- tính từ gốc website --&gt;</span>
&lt;a href="https://fpt.edu.vn" target="_blank" rel="noopener"&gt;FPTU&lt;/a&gt;
&lt;a href="#section2"&gt;Nhảy tới&lt;/a&gt;            <span class="tok-comment">&lt;!-- tới id="section2" trên trang này --&gt;</span></pre>
<div class="out"><b>Vì sao trang của sinh viên hỏng sau khi tải lên.</b> <span class="badge">href="C:/Users/An/web/about.html"</span> chạy trên laptop của bạn và không chạy ở đâu khác. Luôn dùng đường dẫn tương đối (hoặc tương đối gốc, bắt đầu bằng <span class="badge">/</span>), và nhớ rằng phần lớn máy chủ web <em>phân biệt hoa thường</em>: <span class="badge">About.html</span> ≠ <span class="badge">about.html</span>. Hai quy tắc đó chữa gần hết các lỗi "ở máy em vẫn chạy".<br>
<b><span class="badge">rel="noopener"</span> đi kèm <span class="badge">target="_blank"</span></b> ngăn trang được mở lấy được tham chiếu tới trang của bạn — một bản vá an ninh thật sự, không phải trang trí.</div>

<h3>Ảnh — ba thuộc tính, trong thực tế đều bắt buộc</h3>
<pre>&lt;img src="images/campus.jpg"
     alt="Khuôn viên FPTU Hoà Lạc nhìn từ cổng chính"
     width="800" height="600"&gt;</pre>
<div class="out"><b><span class="badge">alt</span></b> — thứ trình đọc màn hình đọc lên và thứ hiện ra khi tệp không tải được. Hãy mô tả <em>nội dung</em>, không mô tả tệp ("photo.jpg" là vô dụng). Ảnh thuần trang trí thì để <span class="badge">alt=""</span>, để trình đọc bỏ qua.<br>
<b><span class="badge">width</span> và <span class="badge">height</span></b> — cho trình duyệt chừa sẵn chỗ trước khi ảnh về, nhờ đó chữ không bị nhảy loạn lúc tải. Đây chính là chỉ số "layout shift" mà Google đo.<br>
<b>Định dạng:</b> JPG cho ảnh chụp, PNG cho đồ hoạ có nền trong suốt, SVG cho logo và biểu tượng (phóng to cỡ nào cũng nét), WebP cho cả hai với dung lượng nhỏ hơn.</div>

<h3>Ảnh responsive — một bức hình, nhiều tệp</h3>
<pre>&lt;img src="hero-800.jpg"
     srcset="hero-400.jpg 400w, hero-800.jpg 800w, hero-1600.jpg 1600w"
     sizes="(max-width: 600px) 100vw, 50vw"
     alt="Khuôn viên"&gt;</pre>
<p>Trình duyệt chọn tệp nhỏ nhất mà vẫn nét trên thiết bị đó — điện thoại tải bản 400px thay vì 1600px, và đó là khoản tiết kiệm lớn nhất cho một trang trên di động.</p>

<h3>Âm thanh và video</h3>
<pre>&lt;video controls poster="thumb.jpg" width="640"&gt;
    &lt;source src="intro.mp4" type="video/mp4"&gt;
    &lt;source src="intro.webm" type="video/webm"&gt;
    Trình duyệt của bạn không hỗ trợ video.
&lt;/video&gt;</pre>
<p>Liệt kê nhiều thẻ <span class="badge">&lt;source&gt;</span> và trình duyệt lấy cái đầu tiên nó hiểu; phần chữ bên trong là nội dung dự phòng. Đừng bao giờ dùng <span class="badge">autoplay</span> kèm tiếng — trình duyệt chặn, còn người dùng thì ghét.</p>

<h3>Bảng — cho dữ liệu, không bao giờ để dàn trang</h3>
<pre>&lt;table&gt;
  &lt;caption&gt;Điểm kỳ 3&lt;/caption&gt;
  &lt;thead&gt;&lt;tr&gt;&lt;th scope="col"&gt;Môn&lt;/th&gt;&lt;th scope="col"&gt;Điểm&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;
  &lt;tbody&gt;
    &lt;tr&gt;&lt;th scope="row"&gt;WED201c&lt;/th&gt;&lt;td&gt;8.5&lt;/td&gt;&lt;/tr&gt;
    &lt;tr&gt;&lt;th scope="row"&gt;DBI202&lt;/th&gt;&lt;td&gt;7.0&lt;/td&gt;&lt;/tr&gt;
  &lt;/tbody&gt;
&lt;/table&gt;</pre>
<p><span class="badge">&lt;caption&gt;</span>, <span class="badge">&lt;thead&gt;</span> và <span class="badge">scope</span> là thứ giúp trình đọc màn hình nói "Môn: WED201c, Điểm: 8.5" thay vì đọc ra một mớ số rời rạc. Việc dàn trang thuộc về Flexbox và Grid (bài 2.2), không phải bảng.</p>

<div class="pitfall"><b>Ảnh không có <span class="badge">alt</span> là trượt bộ kiểm W3C và bộ kiểm khả năng tiếp cận — mà đồ án cuối MOOC 1 chấm cả hai.</b> Điều tương tự với việc thiếu <span class="badge">&lt;title&gt;</span> và nhảy cóc cấp tiêu đề (h1 → h3). Hãy chạy <span class="badge">validator.w3.org</span> trước khi nộp; mất mười giây và bắt được cả ba lỗi.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b><span class="badge">loading="lazy"</span> — một thuộc tính, một khoản lợi đo được.</b> Thêm nó vào các ảnh nằm dưới màn hình đầu là bảo trình duyệt đừng tải chúng cho tới khi người dùng cuộn tới gần. Với một trang thư viện ảnh, đó thường là một nửa tổng dung lượng và một giây thời gian tải, mà không cần JavaScript hay thư viện nào. Kết hợp với <span class="badge">decoding="async"</span> và width/height đúng là bạn đã làm gần hết những gì một chuyên gia "tối ưu ảnh" tính tiền. <em>Ngoài giáo trình vì MOOC dạy thẻ <span class="badge">&lt;img&gt;</span> như cú pháp, còn hiệu năng mới là thứ trang của bạn thật sự bị đánh giá.</em></div>
</div>
`,
        },
        {
          title: '1.3 — Forms: inputs, labels & built-in validation|||1.3 — Biểu mẫu: input, label & kiểm tra sẵn có',
          slug: 'wed201c-html-form',
          type: 'VIDEO',
          description: 'Mọi loại input, vì sao label bắt buộc, và bộ kiểm tra dữ liệu HTML5 chạy sẵn không cần JavaScript.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2>Forms — where users actually type</h2>
<p class="lead">A form is the only part of a static site that sends data anywhere. HTML5 gives you typed inputs and validation for free — most of what students write JavaScript for in MOOC 3 is already in the browser.</p>

<h3>A complete, correct form</h3>
<pre>&lt;form action="/register" method="post"&gt;
  &lt;label for="email"&gt;Email&lt;/label&gt;
  &lt;input type="email" id="email" name="email" required
         placeholder="you@example.com"&gt;

  &lt;label for="age"&gt;Age&lt;/label&gt;
  &lt;input type="number" id="age" name="age" min="16" max="99"&gt;

  &lt;label for="pw"&gt;Password&lt;/label&gt;
  &lt;input type="password" id="pw" name="pw" required minlength="8"&gt;

  &lt;fieldset&gt;
    &lt;legend&gt;Programme&lt;/legend&gt;
    &lt;input type="radio" id="se" name="prog" value="SE" checked&gt;
    &lt;label for="se"&gt;Software Engineering&lt;/label&gt;
    &lt;input type="radio" id="ai" name="prog" value="AI"&gt;
    &lt;label for="ai"&gt;Artificial Intelligence&lt;/label&gt;
  &lt;/fieldset&gt;

  &lt;button type="submit"&gt;Register&lt;/button&gt;
&lt;/form&gt;</pre>

<h3>The three attributes that must line up</h3>
<div class="out"><b><span class="badge">for</span> on the label must equal <span class="badge">id</span> on the input</b> — that pairing lets a screen reader announce the field, and it makes clicking the text focus the box (try it on a radio button: the clickable area triples).<br>
<b><span class="badge">name</span> is what the server receives</b> — the id is for the browser, the name is for the data. Forget <span class="badge">name</span> and the field is simply not submitted, which is the most confusing bug for a beginner because the page looks perfect.<br>
<b>Radio buttons share one <span class="badge">name</span></b> — that is what makes them mutually exclusive. Checkboxes with the same name send several values.</div>

<h3>Input types the browser already understands</h3>
<table><thead><tr><th>type</th><th>You get for free</th></tr></thead><tbody>
<tr><td><span class="badge">email</span></td><td>format check + the @ keyboard on mobile</td></tr>
<tr><td><span class="badge">number</span></td><td>spinner, numeric keypad, min/max/step</td></tr>
<tr><td><span class="badge">date</span> / <span class="badge">time</span></td><td>a native date picker</td></tr>
<tr><td><span class="badge">tel</span> / <span class="badge">url</span></td><td>the right mobile keyboard</td></tr>
<tr><td><span class="badge">range</span> / <span class="badge">color</span></td><td>a slider / a colour picker</td></tr>
<tr><td><span class="badge">file</span></td><td>the file dialog, with <span class="badge">accept="image/*"</span></td></tr>
</tbody></table>

<h3>Validation without a line of JavaScript</h3>
<pre>&lt;input type="text" name="code" required
       pattern="[A-Z]{3}[0-9]{3}"
       title="Three capital letters then three digits, e.g. WED201"&gt;</pre>
<div class="out"><b>What happens on submit:</b> the browser blocks it, focuses the first invalid field and shows the <span class="badge">title</span> text as the message. <span class="badge">required</span>, <span class="badge">min</span>, <span class="badge">max</span>, <span class="badge">minlength</span>, <span class="badge">pattern</span> and the typed inputs cover most rules.<br>
<b>Styling the states:</b> <span class="badge">input:invalid { border-color: red; }</span> and <span class="badge">input:valid { border-color: green; }</span> give live feedback with pure CSS (lesson 2.5).<br>
<b>Still needed in JavaScript:</b> anything comparing two fields ("passwords must match"), or checking against the server ("is this email taken?") — that is MOOC 3, lesson 3.5.</div>

<div class="pitfall"><b>Client-side validation is a convenience, never a security control.</b> Anyone can open DevTools, delete the <span class="badge">required</span> attribute and submit whatever they like — or skip the page entirely and post straight to your URL. Every rule must be re-checked on the server (DBI202 constraints, PRJ301 servlets). The HTML validation exists to help honest users, not to stop dishonest ones.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Autocomplete is an accessibility feature, not a convenience.</b> Adding <span class="badge">autocomplete="email"</span>, <span class="badge">"given-name"</span>, <span class="badge">"street-address"</span>, <span class="badge">"cc-number"</span> lets the browser and password managers fill fields correctly — which for a user with a motor impairment can be the difference between a usable form and an impossible one, and which measurably raises checkout completion on commercial sites. The full token list is in the HTML specification. <em>Beyond syllabus because the MOOC never mentions it, yet it is the cheapest usability win a form can get.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2>Biểu mẫu — nơi người dùng thật sự gõ chữ</h2>
<p class="lead">Biểu mẫu là phần duy nhất của một trang tĩnh gửi được dữ liệu đi đâu đó. HTML5 cho bạn các ô có kiểu và bộ kiểm tra miễn phí — phần lớn thứ mà sinh viên viết JavaScript ở MOOC 3 thì trình duyệt đã làm sẵn.</p>

<h3>Một biểu mẫu đầy đủ và đúng chuẩn</h3>
<pre>&lt;form action="/register" method="post"&gt;
  &lt;label for="email"&gt;Email&lt;/label&gt;
  &lt;input type="email" id="email" name="email" required
         placeholder="you@example.com"&gt;

  &lt;label for="age"&gt;Tuổi&lt;/label&gt;
  &lt;input type="number" id="age" name="age" min="16" max="99"&gt;

  &lt;label for="pw"&gt;Mật khẩu&lt;/label&gt;
  &lt;input type="password" id="pw" name="pw" required minlength="8"&gt;

  &lt;fieldset&gt;
    &lt;legend&gt;Ngành&lt;/legend&gt;
    &lt;input type="radio" id="se" name="prog" value="SE" checked&gt;
    &lt;label for="se"&gt;Kỹ thuật phần mềm&lt;/label&gt;
    &lt;input type="radio" id="ai" name="prog" value="AI"&gt;
    &lt;label for="ai"&gt;Trí tuệ nhân tạo&lt;/label&gt;
  &lt;/fieldset&gt;

  &lt;button type="submit"&gt;Đăng ký&lt;/button&gt;
&lt;/form&gt;</pre>

<h3>Ba thuộc tính bắt buộc phải khớp nhau</h3>
<div class="out"><b><span class="badge">for</span> ở label phải bằng <span class="badge">id</span> ở input</b> — cặp này giúp trình đọc màn hình đọc tên trường, và làm cho việc bấm vào chữ cũng đưa con trỏ vào ô (thử với nút radio: vùng bấm được rộng gấp ba).<br>
<b><span class="badge">name</span> mới là thứ máy chủ nhận được</b> — id dành cho trình duyệt, name dành cho dữ liệu. Quên <span class="badge">name</span> là trường đó đơn giản không được gửi đi, và đây là lỗi khó hiểu nhất với người mới vì trang trông vẫn hoàn hảo.<br>
<b>Các nút radio dùng chung một <span class="badge">name</span></b> — chính điều đó làm chúng loại trừ lẫn nhau. Còn checkbox cùng name thì gửi nhiều giá trị.</div>

<h3>Các kiểu input mà trình duyệt đã hiểu sẵn</h3>
<table><thead><tr><th>type</th><th>Được miễn phí</th></tr></thead><tbody>
<tr><td><span class="badge">email</span></td><td>kiểm định dạng + bàn phím có dấu @ trên di động</td></tr>
<tr><td><span class="badge">number</span></td><td>nút tăng giảm, bàn phím số, min/max/step</td></tr>
<tr><td><span class="badge">date</span> / <span class="badge">time</span></td><td>bộ chọn ngày giờ có sẵn</td></tr>
<tr><td><span class="badge">tel</span> / <span class="badge">url</span></td><td>đúng loại bàn phím di động</td></tr>
<tr><td><span class="badge">range</span> / <span class="badge">color</span></td><td>thanh trượt / bộ chọn màu</td></tr>
<tr><td><span class="badge">file</span></td><td>hộp thoại chọn tệp, kèm <span class="badge">accept="image/*"</span></td></tr>
</tbody></table>

<h3>Kiểm tra dữ liệu mà không cần một dòng JavaScript</h3>
<pre>&lt;input type="text" name="code" required
       pattern="[A-Z]{3}[0-9]{3}"
       title="Ba chữ in hoa rồi ba chữ số, ví dụ WED201"&gt;</pre>
<div class="out"><b>Chuyện gì xảy ra khi bấm gửi:</b> trình duyệt chặn lại, đưa con trỏ vào trường sai đầu tiên và hiện chữ trong <span class="badge">title</span> làm thông báo. <span class="badge">required</span>, <span class="badge">min</span>, <span class="badge">max</span>, <span class="badge">minlength</span>, <span class="badge">pattern</span> cùng các kiểu input phủ được hầu hết luật.<br>
<b>Tô màu theo trạng thái:</b> <span class="badge">input:invalid { border-color: red; }</span> và <span class="badge">input:valid { border-color: green; }</span> cho phản hồi tức thời bằng CSS thuần (bài 2.5).<br>
<b>Vẫn cần JavaScript cho:</b> mọi thứ so sánh hai trường ("mật khẩu phải khớp nhau"), hoặc kiểm với máy chủ ("email này có ai dùng chưa?") — đó là MOOC 3, bài 3.5.</div>

<div class="pitfall"><b>Kiểm tra ở phía trình duyệt là tiện ích, không bao giờ là biện pháp an ninh.</b> Ai cũng mở được DevTools, xoá thuộc tính <span class="badge">required</span> rồi gửi bất cứ thứ gì họ muốn — hoặc bỏ qua hẳn trang web và gửi thẳng tới URL của bạn. Mọi luật đều phải được kiểm lại ở máy chủ (ràng buộc DBI202, servlet PRJ301). Bộ kiểm HTML sinh ra để giúp người dùng ngay thẳng, không phải để chặn người gian.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Autocomplete là tính năng trợ năng, không phải chỉ là tiện lợi.</b> Thêm <span class="badge">autocomplete="email"</span>, <span class="badge">"given-name"</span>, <span class="badge">"street-address"</span>, <span class="badge">"cc-number"</span> giúp trình duyệt và trình quản lý mật khẩu điền đúng trường — với người dùng bị hạn chế vận động, đó có thể là ranh giới giữa một biểu mẫu dùng được và một biểu mẫu bất khả, và trên các trang thương mại nó nâng tỉ lệ hoàn tất thanh toán một cách đo được. Danh sách đầy đủ các giá trị nằm trong đặc tả HTML. <em>Ngoài giáo trình vì MOOC không hề nhắc tới, nhưng đó là khoản lợi về trải nghiệm rẻ nhất mà một biểu mẫu có thể nhận.</em></div>
</div>
`,
        },
        {
          title: '1.4 — Accessibility, validation & publishing|||1.4 — Trợ năng, kiểm chuẩn & đưa lên mạng',
          slug: 'wed201c-a11y-xuat-ban',
          type: 'VIDEO',
          description: 'MOOC 1 mô-đun 3: viết HTML ai cũng dùng được, kiểm bằng W3C validator, và đưa trang lên GitHub Pages.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.4</span>
<h2>Making the page usable by everyone — and getting it online</h2>
<p class="lead">MOOC 1 module 3 is graded on exactly three things: does the page work for a screen-reader user, does it validate, and is it actually on the web. All three are quick if you know what is being checked.</p>

<h3>Accessibility — the five checks that catch most problems</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>1. Headings form an outline.</b> One <span class="badge">&lt;h1&gt;</span> per page, then h2, h3 in order with no skipped levels. A screen-reader user navigates by heading the way you navigate by scrolling.</div>
  <div class="lz-layer"><b>2. Every image has a purposeful <span class="badge">alt</span>.</b> Content images describe the content; decorative images use <span class="badge">alt=""</span>.</div>
  <div class="lz-layer"><b>3. Every form field has a <span class="badge">&lt;label&gt;</span>.</b> Without it the reader announces "edit text, blank" and the user has no idea what to type.</div>
  <div class="lz-layer"><b>4. Link text makes sense alone.</b> Readers can list all links out of context, so "click here" ×12 is useless — write "Download the syllabus (PDF)".</div>
  <div class="lz-layer"><b>5. Colour contrast ≥ 4.5:1 for body text</b>, and colour is never the <em>only</em> signal (add an icon or text to a red error).</div>
</div>
<div class="out"><b>Test it in two minutes, without any special software:</b> unplug the mouse and press Tab through the whole page. Can you reach every control? Can you see where the focus is? (If you removed <span class="badge">outline</span> in CSS, you cannot — that one line makes a site unusable by keyboard.) Then run Lighthouse in Chrome DevTools → Accessibility, which scores it automatically.</div>

<h3>Landmarks and ARIA — only when HTML is not enough</h3>
<pre>&lt;header&gt;…&lt;/header&gt;
&lt;nav aria-label="Main"&gt;…&lt;/nav&gt;
&lt;main&gt;…&lt;/main&gt;                       <span class="tok-comment">&lt;!-- exactly one per page --&gt;</span>
&lt;footer&gt;…&lt;/footer&gt;

&lt;button aria-expanded="false" aria-controls="menu"&gt;Menu&lt;/button&gt;
&lt;div id="menu" hidden&gt;…&lt;/div&gt;</pre>
<p><b>The first rule of ARIA is not to use ARIA:</b> a real <span class="badge">&lt;button&gt;</span> is already focusable, clickable with Enter and announced as a button, while <span class="badge">&lt;div role="button"&gt;</span> needs you to reimplement all three. Reach for ARIA only for things HTML has no element for — an expandable menu, a live region, a tab set.</p>

<h3>Validation — the ten-second check before every submission</h3>
<div class="out">Paste your URL or file into <span class="badge">validator.w3.org</span>. Typical findings in student work:<br>
"End tag for element X which is not open" — a mis-nested tag · "Duplicate ID" — two elements share an id, which breaks <span class="badge">label for</span> and JavaScript · "Element X not allowed as child of element Y" — for example a <span class="badge">&lt;div&gt;</span> inside a <span class="badge">&lt;ul&gt;</span> · "Missing alt attribute".<br>
<b>Validate the CSS too</b> at <span class="badge">jigsaw.w3.org/css-validator</span>. A page that validates is not automatically good, but a page that does not validate will behave differently across browsers — and the MOOC marks it.</div>

<h3>Publishing with GitHub Pages (free, and the MOOC accepts it)</h3>
<div class="lz-flow">
  <div class="lz-fitem"><b>1</b><span>Create a public repository; the home page file must be named <span class="badge">index.html</span> in the root.</span></div>
  <div class="lz-fitem"><b>2</b><span>Push your files (or drag them into the web upload page).</span></div>
  <div class="lz-fitem"><b>3</b><span>Settings → Pages → Source: <em>main</em> branch, folder <em>/ (root)</em>, Save.</span></div>
  <div class="lz-fitem"><b>4</b><span>Wait a minute; the site appears at <span class="badge">https://&lt;user&gt;.github.io/&lt;repo&gt;/</span>.</span></div>
</div>
<div class="out"><b>The two things that go wrong, every time:</b> (1) the file is called <span class="badge">Index.html</span> or <span class="badge">home.html</span> — GitHub Pages serves only <span class="badge">index.html</span>; (2) links and images work locally but 404 online because the case does not match (<span class="badge">Images/Logo.PNG</span> vs <span class="badge">images/logo.png</span>). Windows ignores case, Linux servers do not.</div>

<div class="pitfall"><b>Never write <span class="badge">*:focus { outline: none; }</span> to "clean up" the blue ring.</b> It removes the only indication a keyboard user has of where they are on the page — an instant accessibility failure. If the default is ugly, replace it: <span class="badge">:focus-visible { outline: 3px solid #0a84ff; outline-offset: 2px; }</span>.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Accessibility is a legal requirement, not a nice-to-have.</b> WCAG 2.1 level AA is written into law in the EU (EN 301 549), the US (Section 508 / ADA), and is referenced by Vietnam's e-government standards; public-sector and large commercial sites are audited against it, and inaccessible sites have lost real lawsuits. The same markup that satisfies a screen reader also gives you better SEO — search engines parse headings, alt text and landmarks exactly as assistive technology does. <em>Beyond syllabus because the MOOC frames accessibility as courtesy, while professionally it is a specification you are held to.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.4</span>
<h2>Làm cho trang ai cũng dùng được — và đưa nó lên mạng</h2>
<p class="lead">MOOC 1 mô-đun 3 chấm đúng ba thứ: trang có dùng được với người dùng trình đọc màn hình không, có đạt chuẩn không, và có thật sự nằm trên mạng chưa. Cả ba đều nhanh nếu bạn biết người ta kiểm cái gì.</p>

<h3>Trợ năng — năm phép kiểm bắt được hầu hết vấn đề</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>1. Các tiêu đề tạo thành một dàn ý.</b> Mỗi trang một thẻ <span class="badge">&lt;h1&gt;</span>, rồi h2, h3 theo thứ tự không nhảy cấp. Người dùng trình đọc màn hình di chuyển theo tiêu đề đúng như bạn di chuyển bằng cách cuộn trang.</div>
  <div class="lz-layer"><b>2. Mọi ảnh đều có <span class="badge">alt</span> đúng mục đích.</b> Ảnh nội dung thì mô tả nội dung; ảnh trang trí thì để <span class="badge">alt=""</span>.</div>
  <div class="lz-layer"><b>3. Mọi trường biểu mẫu đều có <span class="badge">&lt;label&gt;</span>.</b> Thiếu nó, trình đọc chỉ đọc "ô nhập văn bản, trống" và người dùng không biết phải gõ gì.</div>
  <div class="lz-layer"><b>4. Chữ của liên kết đứng một mình vẫn có nghĩa.</b> Trình đọc liệt kê được tất cả liên kết tách khỏi ngữ cảnh, nên "bấm vào đây" ×12 là vô dụng — hãy viết "Tải syllabus (PDF)".</div>
  <div class="lz-layer"><b>5. Độ tương phản màu ≥ 4,5:1 cho chữ nội dung</b>, và màu không bao giờ là tín hiệu <em>duy nhất</em> (thêm biểu tượng hoặc chữ vào thông báo lỗi màu đỏ).</div>
</div>
<div class="out"><b>Kiểm trong hai phút, không cần phần mềm đặc biệt nào:</b> rút chuột ra và nhấn Tab đi hết cả trang. Bạn có tới được mọi nút không? Bạn có nhìn thấy con trỏ đang ở đâu không? (Nếu bạn đã xoá <span class="badge">outline</span> trong CSS thì không — đúng một dòng đó làm cả trang không dùng được bằng bàn phím.) Sau đó chạy Lighthouse trong Chrome DevTools → Accessibility để nó chấm điểm tự động.</div>

<h3>Vùng mốc và ARIA — chỉ khi HTML không đủ</h3>
<pre>&lt;header&gt;…&lt;/header&gt;
&lt;nav aria-label="Chính"&gt;…&lt;/nav&gt;
&lt;main&gt;…&lt;/main&gt;                       <span class="tok-comment">&lt;!-- mỗi trang đúng một thẻ --&gt;</span>
&lt;footer&gt;…&lt;/footer&gt;

&lt;button aria-expanded="false" aria-controls="menu"&gt;Menu&lt;/button&gt;
&lt;div id="menu" hidden&gt;…&lt;/div&gt;</pre>
<p><b>Quy tắc số một của ARIA là đừng dùng ARIA:</b> một thẻ <span class="badge">&lt;button&gt;</span> thật thì đã tự nhận được tiêu điểm, bấm được bằng Enter và được đọc lên là "nút", trong khi <span class="badge">&lt;div role="button"&gt;</span> bắt bạn tự làm lại cả ba. Chỉ dùng ARIA cho những thứ HTML không có thẻ tương ứng — menu bung ra, vùng cập nhật động, bộ tab.</p>

<h3>Kiểm chuẩn — mười giây trước mỗi lần nộp</h3>
<div class="out">Dán URL hoặc tệp của bạn vào <span class="badge">validator.w3.org</span>. Những lỗi điển hình trong bài sinh viên:<br>
"End tag for element X which is not open" — thẻ lồng sai · "Duplicate ID" — hai phần tử trùng id, làm hỏng <span class="badge">label for</span> và JavaScript · "Element X not allowed as child of element Y" — ví dụ một <span class="badge">&lt;div&gt;</span> nằm trong <span class="badge">&lt;ul&gt;</span> · "Missing alt attribute".<br>
<b>Kiểm cả CSS</b> tại <span class="badge">jigsaw.w3.org/css-validator</span>. Trang đạt chuẩn chưa chắc đã hay, nhưng trang không đạt chuẩn thì chạy khác nhau giữa các trình duyệt — và MOOC có chấm mục này.</div>

<h3>Đưa lên mạng bằng GitHub Pages (miễn phí, và MOOC chấp nhận)</h3>
<div class="lz-flow">
  <div class="lz-fitem"><b>1</b><span>Tạo một repository công khai; tệp trang chủ bắt buộc tên <span class="badge">index.html</span> nằm ở gốc.</span></div>
  <div class="lz-fitem"><b>2</b><span>Đẩy các tệp lên (hoặc kéo thả vào trang tải lên trên web).</span></div>
  <div class="lz-fitem"><b>3</b><span>Settings → Pages → Source: nhánh <em>main</em>, thư mục <em>/ (root)</em>, Save.</span></div>
  <div class="lz-fitem"><b>4</b><span>Chờ một phút; trang hiện ra tại <span class="badge">https://&lt;user&gt;.github.io/&lt;repo&gt;/</span>.</span></div>
</div>
<div class="out"><b>Hai thứ hỏng, lần nào cũng vậy:</b> (1) tệp được đặt tên <span class="badge">Index.html</span> hoặc <span class="badge">home.html</span> — GitHub Pages chỉ phục vụ <span class="badge">index.html</span>; (2) liên kết và ảnh chạy ở máy nhưng 404 khi lên mạng vì sai hoa thường (<span class="badge">Images/Logo.PNG</span> so với <span class="badge">images/logo.png</span>). Windows bỏ qua hoa thường, máy chủ Linux thì không.</div>

<div class="pitfall"><b>Đừng bao giờ viết <span class="badge">*:focus { outline: none; }</span> để "cho sạch" cái viền xanh.</b> Nó xoá đi dấu hiệu duy nhất cho người dùng bàn phím biết mình đang đứng ở đâu trên trang — trượt trợ năng ngay lập tức. Nếu thấy kiểu mặc định xấu thì hãy thay nó: <span class="badge">:focus-visible { outline: 3px solid #0a84ff; outline-offset: 2px; }</span>.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Trợ năng là yêu cầu pháp lý, không phải điểm cộng.</b> WCAG 2.1 mức AA được luật hoá ở châu Âu (EN 301 549), ở Mỹ (Section 508 / ADA), và được viện dẫn trong các chuẩn chính phủ điện tử của Việt Nam; các trang khu vực công và trang thương mại lớn bị kiểm toán theo nó, và những trang không tiếp cận được đã thua kiện thật. Cũng chính đoạn mã làm hài lòng trình đọc màn hình sẽ cho bạn SEO tốt hơn — công cụ tìm kiếm phân tích tiêu đề, chữ alt và vùng mốc đúng như công nghệ trợ giúp. <em>Ngoài giáo trình vì MOOC đóng khung trợ năng như phép lịch sự, còn trong nghề đó là một đặc tả mà bạn bị soi theo.</em></div>
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
        {
          title: '2.3 — The cascade, specificity & inheritance|||2.3 — Thứ tự tầng, độ ưu tiên & kế thừa',
          slug: 'wed201c-cascade',
          type: 'VIDEO',
          description: 'Vì sao luật CSS này thắng luật kia — tính điểm specificity từng bước và cách gỡ khi style không ăn.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>Why is my CSS not working? — the answer is always the cascade</h2>
<p class="lead">Two rules target the same element and set the same property. Which wins? CSS answers with three tests, in order: importance, then <strong>specificity</strong>, then source order. Knowing them turns "it just does not work" into a two-second diagnosis.</p>

<h3>Step 1 — importance</h3>
<p>An <span class="badge">!important</span> declaration beats any normal one. Inline <span class="badge">style=""</span> beats a stylesheet rule of equal specificity. Use both as a last resort — see the pitfall below.</p>

<h3>Step 2 — specificity, counted as (a, b, c)</h3>
<div class="formula"><span class="lbl">SPECIFICITY</span>a = #id &nbsp;·&nbsp; b = .class, [attr], :pseudo-class &nbsp;·&nbsp; c = element, ::pseudo-element</div>
<table><thead><tr><th>Selector</th><th>(a, b, c)</th><th>Value</th></tr></thead><tbody>
<tr><td><span class="badge">p</span></td><td>(0,0,1)</td><td>lowest</td></tr>
<tr><td><span class="badge">.intro</span></td><td>(0,1,0)</td><td>beats any number of elements</td></tr>
<tr><td><span class="badge">nav ul li a</span></td><td>(0,0,4)</td><td>still loses to a single class</td></tr>
<tr><td><span class="badge">.menu a:hover</span></td><td>(0,2,1)</td><td></td></tr>
<tr><td><span class="badge">#header .logo</span></td><td>(1,1,0)</td><td>an id outranks everything below it</td></tr>
</tbody></table>
<div class="out"><b>Worked example.</b> The element is <span class="badge">&lt;a class="btn" id="cta"&gt;</span> and four rules set its colour:<br>
<span class="badge">a { color: blue }</span> → (0,0,1)<br>
<span class="badge">.btn { color: green }</span> → (0,1,0)<br>
<span class="badge">nav ul li a { color: red }</span> → (0,0,4)<br>
<span class="badge">#cta { color: black }</span> → (1,0,0)<br>
<b>Compare left to right:</b> (1,0,0) wins on the first number, so the link is <b>black</b>. Note that (0,0,4) loses to (0,1,0) — a hundred element selectors never beat one class. That is the rule students get wrong most often.<br>
<b>If two rules tie exactly, the one written later in the file wins</b> — which is why your own stylesheet must be linked <em>after</em> Bootstrap, not before.</div>

<h3>Step 3 — inheritance</h3>
<div class="out"><b>Inherited by default:</b> <span class="badge">color</span>, <span class="badge">font-family</span>, <span class="badge">font-size</span>, <span class="badge">line-height</span>, <span class="badge">text-align</span> — the typography properties.<br>
<b>Not inherited:</b> <span class="badge">margin</span>, <span class="badge">padding</span>, <span class="badge">border</span>, <span class="badge">background</span>, <span class="badge">width</span> — the box properties. Setting a border on <span class="badge">body</span> does not put a border on every paragraph.<br>
<b>Force it either way</b> with the keywords <span class="badge">inherit</span>, <span class="badge">initial</span> and <span class="badge">unset</span>.<br>
<b>Practical use:</b> set <span class="badge">font-family</span> and <span class="badge">color</span> once on <span class="badge">body</span> and the whole document follows — the least code for the most effect.</div>

<h3>Debugging in ten seconds</h3>
<div class="lz-flow">
  <div class="lz-fitem"><b>1</b><span>Right-click the element → Inspect.</span></div>
  <div class="lz-fitem"><b>2</b><span>Look at the Styles panel: overridden declarations are shown <s>struck through</s>.</span></div>
  <div class="lz-fitem"><b>3</b><span>The winning rule is at the top, with its source file and line.</span></div>
  <div class="lz-fitem"><b>4</b><span>Nothing there at all? The selector never matched — check the spelling, the dot/hash, and whether the stylesheet actually loaded (Network tab).</span></div>
</div>

<div class="pitfall"><b><span class="badge">!important</span> is a debt, not a fix.</b> It wins today, so the next override needs another <span class="badge">!important</span>, and soon nothing can be changed without one. The professional response to "my rule loses" is to <em>lower</em> the specificity of the competing rule — replace <span class="badge">#nav ul li a</span> with a single class — rather than raise your own.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Naming conventions exist to keep specificity flat.</b> BEM writes one class per element — <span class="badge">.card</span>, <span class="badge">.card__title</span>, <span class="badge">.card--featured</span> — so every rule is (0,1,0) and source order alone decides. Utility frameworks such as Tailwind go further: every rule is a single class, and you compose in the HTML. Both approaches solve the same disease, which is a stylesheet where nobody can predict what wins. <em>Beyond syllabus because the MOOC teaches selectors but not the discipline that keeps a 2,000-line stylesheet maintainable.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>Sao CSS của em không ăn? — câu trả lời luôn nằm ở thứ tự tầng</h2>
<p class="lead">Hai luật cùng nhắm vào một phần tử và cùng đặt một thuộc tính. Luật nào thắng? CSS trả lời bằng ba phép kiểm, theo thứ tự: mức quan trọng, rồi <strong>độ ưu tiên (specificity)</strong>, rồi thứ tự xuất hiện. Nắm được chúng là biến "tự dưng không chạy" thành một chẩn đoán hai giây.</p>

<h3>Bước 1 — mức quan trọng</h3>
<p>Khai báo có <span class="badge">!important</span> thắng mọi khai báo thường. Style nội tuyến <span class="badge">style=""</span> thắng luật trong tệp CSS có cùng độ ưu tiên. Chỉ dùng cả hai như phương án cuối — xem phần bẫy phía dưới.</p>

<h3>Bước 2 — độ ưu tiên, tính theo bộ ba (a, b, c)</h3>
<div class="formula"><span class="lbl">ĐỘ ƯU TIÊN</span>a = #id &nbsp;·&nbsp; b = .class, [attr], :pseudo-class &nbsp;·&nbsp; c = thẻ, ::pseudo-element</div>
<table><thead><tr><th>Bộ chọn</th><th>(a, b, c)</th><th>Giá trị</th></tr></thead><tbody>
<tr><td><span class="badge">p</span></td><td>(0,0,1)</td><td>thấp nhất</td></tr>
<tr><td><span class="badge">.intro</span></td><td>(0,1,0)</td><td>thắng mọi số lượng thẻ</td></tr>
<tr><td><span class="badge">nav ul li a</span></td><td>(0,0,4)</td><td>vẫn thua một class đơn</td></tr>
<tr><td><span class="badge">.menu a:hover</span></td><td>(0,2,1)</td><td></td></tr>
<tr><td><span class="badge">#header .logo</span></td><td>(1,1,0)</td><td>một id vượt mọi thứ bên dưới</td></tr>
</tbody></table>
<div class="out"><b>Ví dụ có lời giải.</b> Phần tử là <span class="badge">&lt;a class="btn" id="cta"&gt;</span> và bốn luật cùng đặt màu chữ:<br>
<span class="badge">a { color: blue }</span> → (0,0,1)<br>
<span class="badge">.btn { color: green }</span> → (0,1,0)<br>
<span class="badge">nav ul li a { color: red }</span> → (0,0,4)<br>
<span class="badge">#cta { color: black }</span> → (1,0,0)<br>
<b>So từ trái sang phải:</b> (1,0,0) thắng ngay ở con số đầu, nên liên kết có màu <b>đen</b>. Chú ý (0,0,4) thua (0,1,0) — một trăm bộ chọn thẻ cũng không thắng nổi một class. Đây là chỗ sinh viên sai nhiều nhất.<br>
<b>Nếu hai luật hoà tuyệt đối thì luật viết sau trong tệp thắng</b> — vì thế tệp CSS của bạn phải được nhúng <em>sau</em> Bootstrap, không phải trước.</div>

<h3>Bước 3 — kế thừa</h3>
<div class="out"><b>Được kế thừa mặc định:</b> <span class="badge">color</span>, <span class="badge">font-family</span>, <span class="badge">font-size</span>, <span class="badge">line-height</span>, <span class="badge">text-align</span> — các thuộc tính chữ nghĩa.<br>
<b>Không kế thừa:</b> <span class="badge">margin</span>, <span class="badge">padding</span>, <span class="badge">border</span>, <span class="badge">background</span>, <span class="badge">width</span> — các thuộc tính hộp. Đặt viền cho <span class="badge">body</span> không làm mọi đoạn văn có viền.<br>
<b>Ép theo cả hai hướng</b> bằng các từ khoá <span class="badge">inherit</span>, <span class="badge">initial</span> và <span class="badge">unset</span>.<br>
<b>Ứng dụng thực tế:</b> đặt <span class="badge">font-family</span> và <span class="badge">color</span> một lần trên <span class="badge">body</span> là cả tài liệu theo — ít mã nhất mà tác dụng lớn nhất.</div>

<h3>Gỡ lỗi trong mười giây</h3>
<div class="lz-flow">
  <div class="lz-fitem"><b>1</b><span>Bấm chuột phải vào phần tử → Inspect.</span></div>
  <div class="lz-fitem"><b>2</b><span>Nhìn bảng Styles: các khai báo bị ghi đè hiện với <s>gạch ngang</s>.</span></div>
  <div class="lz-fitem"><b>3</b><span>Luật thắng nằm trên cùng, kèm tên tệp và số dòng.</span></div>
  <div class="lz-fitem"><b>4</b><span>Không thấy gì cả? Bộ chọn chưa từng khớp — kiểm chính tả, dấu chấm/dấu thăng, và xem tệp CSS có tải được không (tab Network).</span></div>
</div>

<div class="pitfall"><b><span class="badge">!important</span> là một khoản nợ, không phải cách chữa.</b> Hôm nay nó thắng, thế là lần ghi đè sau lại cần thêm một <span class="badge">!important</span> nữa, và chẳng mấy chốc không sửa được gì nếu không có nó. Phản ứng chuyên nghiệp khi "luật của tôi bị thua" là <em>hạ</em> độ ưu tiên của luật đối thủ — thay <span class="badge">#nav ul li a</span> bằng một class đơn — chứ không phải nâng luật của mình lên.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Các quy ước đặt tên sinh ra để giữ độ ưu tiên luôn phẳng.</b> BEM viết mỗi phần tử một class — <span class="badge">.card</span>, <span class="badge">.card__title</span>, <span class="badge">.card--featured</span> — nên mọi luật đều là (0,1,0) và chỉ thứ tự xuất hiện quyết định. Các framework tiện ích như Tailwind còn đi xa hơn: mọi luật là một class đơn, và bạn ghép chúng ngay trong HTML. Cả hai hướng cùng chữa một căn bệnh: một tệp CSS mà không ai đoán nổi cái gì sẽ thắng. <em>Ngoài giáo trình vì MOOC dạy bộ chọn nhưng không dạy kỷ luật giữ cho một tệp CSS 2.000 dòng còn bảo trì được.</em></div>
</div>
`,
        },
        {
          title: '2.4 — Typography, colour & CSS units|||2.4 — Chữ, màu & đơn vị trong CSS',
          slug: 'wed201c-typography',
          type: 'VIDEO',
          description: 'Chọn font và cỡ chữ, hệ màu HEX/RGB/HSL, và khi nào dùng px, rem, em, %, vw/vh.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.4</span>
<h2>The details that make a page look designed</h2>
<p class="lead">Most student pages fail on three things: text is too wide, line height is too tight, and font sizes are picked at random. Fixing those costs six lines of CSS and does more for the mark than any animation.</p>

<h3>Units — and which to use where</h3>
<table><thead><tr><th>Unit</th><th>Relative to</th><th>Use for</th></tr></thead><tbody>
<tr><td><span class="badge">px</span></td><td>nothing (absolute)</td><td>borders, shadows, tiny fixed details</td></tr>
<tr><td><span class="badge">rem</span></td><td>the root font size (16px by default)</td><td><b>font sizes, spacing — the default choice</b></td></tr>
<tr><td><span class="badge">em</span></td><td>the <em>parent's</em> font size</td><td>padding inside a component that must scale with its text</td></tr>
<tr><td><span class="badge">%</span></td><td>the parent's size</td><td>fluid widths</td></tr>
<tr><td><span class="badge">vw</span> / <span class="badge">vh</span></td><td>1% of the viewport width / height</td><td>full-screen sections, hero banners</td></tr>
<tr><td><span class="badge">ch</span></td><td>the width of the "0" character</td><td><b>line length</b> — <span class="badge">max-width: 65ch</span></td></tr>
</tbody></table>
<div class="out"><b>Why rem beats px for text.</b> A user who sets their browser font to 20px because they cannot read 16px gets nothing if you wrote <span class="badge">font-size: 14px</span> — it stays 14px. With <span class="badge">font-size: 0.875rem</span> it scales to 17.5px. This is an accessibility requirement, not a preference.<br>
<b>Why em is a trap when nested.</b> Set <span class="badge">.box { font-size: 1.2em }</span> and nest three boxes: 1.2 × 1.2 × 1.2 = <b>1.73×</b>, compounding invisibly. Use rem unless you deliberately want the relative behaviour.</div>

<h3>Colour — three notations, one recommendation</h3>
<pre>color: #0a84ff;                  <span class="tok-comment">/* hex — compact, everywhere */</span>
color: rgb(10 132 255);          <span class="tok-comment">/* rgb — mixing light */</span>
color: rgb(10 132 255 / 50%);    <span class="tok-comment">/* with transparency */</span>
color: hsl(211 100% 52%);        <span class="tok-comment">/* hue, saturation, lightness */</span></pre>
<div class="out"><b>Use HSL when you build a palette.</b> Keep the hue, change only the lightness: <span class="badge">hsl(211 100% 52%)</span> is your brand blue, <span class="badge">hsl(211 100% 92%)</span> is its background tint, <span class="badge">hsl(211 100% 25%)</span> is the hover state. With hex you would have to guess three unrelated codes.<br>
<b>Contrast is not optional:</b> body text needs a ratio of at least 4.5:1 against its background (3:1 for text above 24px). Check it in DevTools — hover the colour swatch and the contrast ratio is shown with a pass/fail tick.</div>

<h3>Typography — the six lines that fix most pages</h3>
<pre>body {
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  font-size: 1rem;
  line-height: 1.6;            <span class="tok-comment">/* unitless: scales with font size */</span>
  color: #1a1a1a;              <span class="tok-comment">/* not pure black — softer on screen */</span>
}
main { max-width: 70ch; margin-inline: auto; }   <span class="tok-comment">/* readable line length */</span>
h1, h2, h3 { line-height: 1.2; }                 <span class="tok-comment">/* headings sit tighter */</span></pre>
<div class="out"><b>Why <span class="badge">70ch</span>.</b> Typographic research puts comfortable reading at 45–75 characters per line; beyond that the eye loses the start of the next line. On a 1920px monitor, full-width paragraphs are roughly 200 characters — which is exactly why an unstyled page feels unpleasant to read.<br>
<b>Why <span class="badge">line-height: 1.6</span> with no unit.</b> A unitless value multiplies each element's own font size, so headings and body text both get sensible spacing. Writing <span class="badge">line-height: 24px</span> would cram a 32px heading.<br>
<b>Why <span class="badge">system-ui</span> first.</b> It uses the operating system's own interface font — nothing to download, instant rendering, and it looks native on every platform.</div>

<h3>Web fonts, if you need one</h3>
<pre>&lt;link rel="preconnect" href="https://fonts.gstatic.com" crossorigin&gt;
&lt;link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&amp;display=swap" rel="stylesheet"&gt;</pre>
<p><span class="badge">display=swap</span> shows the fallback font immediately and swaps when the web font arrives, instead of leaving invisible text for a second. Load only the weights you use — every extra weight is another file.</p>

<div class="pitfall"><b>Do not set <span class="badge">html { font-size: 62.5% }</span> to "make 1rem = 10px".</b> The trick was popular a decade ago, but it overrides the size the user chose in their browser settings — the exact thing rem was supposed to respect. Keep the root at its default and use decimals: 0.875rem, 1.125rem, 1.5rem.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Fluid type with <span class="badge">clamp()</span> — responsive text with no media query.</b> <span class="badge">font-size: clamp(1.5rem, 4vw + 0.5rem, 3rem)</span> reads: never below 1.5rem, never above 3rem, and in between it grows with the viewport. One line replaces three breakpoints, and it scales smoothly instead of jumping at each one. The same function works for padding, gaps and widths. <em>Beyond syllabus because MOOC 4 teaches breakpoints only, while modern layouts increasingly need none.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.4</span>
<h2>Những chi tiết làm một trang trông như có thiết kế</h2>
<p class="lead">Phần lớn trang của sinh viên hỏng ở ba chỗ: dòng chữ quá dài, khoảng cách dòng quá chật, và cỡ chữ chọn tuỳ hứng. Sửa cả ba tốn sáu dòng CSS và ăn điểm nhiều hơn mọi hiệu ứng chuyển động.</p>

<h3>Đơn vị — và dùng cái nào ở đâu</h3>
<table><thead><tr><th>Đơn vị</th><th>Tính theo</th><th>Dùng cho</th></tr></thead><tbody>
<tr><td><span class="badge">px</span></td><td>không theo gì (tuyệt đối)</td><td>viền, đổ bóng, các chi tiết nhỏ cố định</td></tr>
<tr><td><span class="badge">rem</span></td><td>cỡ chữ gốc (mặc định 16px)</td><td><b>cỡ chữ, khoảng cách — lựa chọn mặc định</b></td></tr>
<tr><td><span class="badge">em</span></td><td>cỡ chữ của <em>phần tử cha</em></td><td>đệm bên trong một thành phần cần co giãn theo chữ của nó</td></tr>
<tr><td><span class="badge">%</span></td><td>kích thước phần tử cha</td><td>chiều rộng co giãn</td></tr>
<tr><td><span class="badge">vw</span> / <span class="badge">vh</span></td><td>1% chiều rộng / cao khung nhìn</td><td>khối chiếm trọn màn hình, banner lớn</td></tr>
<tr><td><span class="badge">ch</span></td><td>bề rộng ký tự "0"</td><td><b>độ dài dòng</b> — <span class="badge">max-width: 65ch</span></td></tr>
</tbody></table>
<div class="out"><b>Vì sao rem hơn px với chữ.</b> Một người chỉnh cỡ chữ trình duyệt lên 20px vì không đọc nổi 16px sẽ chẳng được gì nếu bạn viết <span class="badge">font-size: 14px</span> — nó vẫn cứ 14px. Với <span class="badge">font-size: 0.875rem</span> thì nó thành 17,5px. Đây là yêu cầu trợ năng, không phải sở thích.<br>
<b>Vì sao em là cái bẫy khi lồng nhau.</b> Đặt <span class="badge">.box { font-size: 1.2em }</span> rồi lồng ba hộp: 1,2 × 1,2 × 1,2 = <b>1,73 lần</b>, nhân dồn một cách vô hình. Hãy dùng rem trừ khi bạn cố ý muốn hành vi tương đối đó.</div>

<h3>Màu — ba cách viết, một khuyến nghị</h3>
<pre>color: #0a84ff;                  <span class="tok-comment">/* hex — gọn, ở đâu cũng dùng được */</span>
color: rgb(10 132 255);          <span class="tok-comment">/* rgb — pha ánh sáng */</span>
color: rgb(10 132 255 / 50%);    <span class="tok-comment">/* kèm độ trong suốt */</span>
color: hsl(211 100% 52%);        <span class="tok-comment">/* sắc độ, độ bão hoà, độ sáng */</span></pre>
<div class="out"><b>Dùng HSL khi bạn dựng một bảng màu.</b> Giữ nguyên sắc độ, chỉ đổi độ sáng: <span class="badge">hsl(211 100% 52%)</span> là màu xanh thương hiệu, <span class="badge">hsl(211 100% 92%)</span> là nền nhạt của nó, <span class="badge">hsl(211 100% 25%)</span> là trạng thái di chuột. Với hex thì bạn phải đoán ba mã chẳng liên quan gì tới nhau.<br>
<b>Tương phản không phải tuỳ chọn:</b> chữ nội dung cần tỉ lệ ít nhất 4,5:1 so với nền (3:1 với chữ trên 24px). Kiểm ngay trong DevTools — rê chuột lên ô màu là thấy tỉ lệ tương phản kèm dấu đạt/không đạt.</div>

<h3>Chữ nghĩa — sáu dòng chữa được hầu hết các trang</h3>
<pre>body {
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  font-size: 1rem;
  line-height: 1.6;            <span class="tok-comment">/* không đơn vị: co giãn theo cỡ chữ */</span>
  color: #1a1a1a;              <span class="tok-comment">/* không đen tuyệt đối — dịu mắt hơn trên màn hình */</span>
}
main { max-width: 70ch; margin-inline: auto; }   <span class="tok-comment">/* độ dài dòng dễ đọc */</span>
h1, h2, h3 { line-height: 1.2; }                 <span class="tok-comment">/* tiêu đề thì sít hơn */</span></pre>
<div class="out"><b>Vì sao <span class="badge">70ch</span>.</b> Nghiên cứu về ấn loát cho thấy đọc thoải mái ở mức 45–75 ký tự mỗi dòng; dài hơn thì mắt lạc mất đầu dòng kế tiếp. Trên màn hình 1920px, đoạn văn chiếm hết bề ngang dài khoảng 200 ký tự — đó đúng là lý do một trang chưa tạo kiểu đọc rất khó chịu.<br>
<b>Vì sao <span class="badge">line-height: 1.6</span> không kèm đơn vị.</b> Giá trị không đơn vị nhân với cỡ chữ của chính từng phần tử, nên cả tiêu đề lẫn chữ nội dung đều có khoảng cách hợp lý. Viết <span class="badge">line-height: 24px</span> sẽ làm tiêu đề 32px bị bó nghẹt.<br>
<b>Vì sao đặt <span class="badge">system-ui</span> đầu tiên.</b> Nó dùng chính font giao diện của hệ điều hành — không phải tải gì, hiện ra tức thì, và trông tự nhiên trên mọi nền tảng.</div>

<h3>Font trên web, nếu bạn cần</h3>
<pre>&lt;link rel="preconnect" href="https://fonts.gstatic.com" crossorigin&gt;
&lt;link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&amp;display=swap" rel="stylesheet"&gt;</pre>
<p><span class="badge">display=swap</span> hiện font dự phòng ngay lập tức rồi tráo khi font web về, thay vì để chữ tàng hình mất một giây. Chỉ tải những độ đậm bạn dùng — mỗi độ đậm thêm là thêm một tệp.</p>

<div class="pitfall"><b>Đừng đặt <span class="badge">html { font-size: 62.5% }</span> để "cho 1rem = 10px".</b> Mẹo này thịnh hành cả chục năm trước, nhưng nó ghi đè cỡ chữ mà người dùng đã chọn trong cài đặt trình duyệt — đúng cái thứ mà rem sinh ra để tôn trọng. Hãy giữ cỡ gốc mặc định và dùng số thập phân: 0,875rem; 1,125rem; 1,5rem.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Chữ co giãn mượt với <span class="badge">clamp()</span> — responsive mà không cần media query.</b> <span class="badge">font-size: clamp(1.5rem, 4vw + 0.5rem, 3rem)</span> đọc là: không bao giờ nhỏ hơn 1,5rem, không bao giờ lớn hơn 3rem, và ở giữa thì lớn dần theo khung nhìn. Một dòng thay cho ba điểm ngắt, và nó co giãn mượt thay vì nhảy giật ở từng điểm. Cùng hàm đó dùng được cho padding, khoảng cách lưới và chiều rộng. <em>Ngoài giáo trình vì MOOC 4 chỉ dạy điểm ngắt, trong khi bố cục hiện đại ngày càng không cần điểm ngắt nào.</em></div>
</div>
`,
        },
        {
          title: '2.5 — Pseudo-classes, transitions & positioning|||2.5 — Pseudo-class, chuyển động & định vị',
          slug: 'wed201c-pseudo-position',
          type: 'VIDEO',
          description: 'MOOC 2 mô-đun 3: :hover/:focus/:nth-child, ::before/::after, transition, và năm giá trị của position.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.5</span>
<h2>States, generated content and where boxes actually sit</h2>
<p class="lead">This is MOOC 2 module 3 — the part that makes a page feel alive rather than printed. Three topics: selecting by state, animating the change, and taking an element out of the normal flow.</p>

<h3>Pseudo-classes — select by state or position</h3>
<pre>a:hover        <span class="tok-comment">/* mouse over */</span>
a:focus-visible <span class="tok-comment">/* reached by keyboard — style this, always */</span>
input:invalid  <span class="tok-comment">/* fails HTML5 validation (lesson 1.3) */</span>
li:first-child · li:last-child · li:nth-child(2n)   <span class="tok-comment">/* by position */</span>
tr:nth-child(odd)  { background: #f6f6f6; }         <span class="tok-comment">/* zebra stripes, no classes */</span>
.card:not(.featured) { opacity: .8; }</pre>
<div class="out"><b>Reading <span class="badge">nth-child</span>.</b> The argument is a formula <span class="badge">an + b</span>: <span class="badge">2n</span> = every second (2, 4, 6…), <span class="badge">2n+1</span> = the odd ones, <span class="badge">3n</span> = every third, <span class="badge">-n+3</span> = the first three. So a three-column grid where the last item of each row needs no right margin is <span class="badge">.item:nth-child(3n) { margin-right: 0 }</span>.<br>
<b>Always style <span class="badge">:focus-visible</span> next to <span class="badge">:hover</span></b> — otherwise keyboard users get no feedback at all (lesson 1.4).</div>

<h3>Pseudo-elements — content that is not in the HTML</h3>
<pre>.required label::after { content: " *"; color: red; }
blockquote::before { content: "\\201C"; font-size: 3rem; }
.external::after { content: " ↗"; }</pre>
<p>Two colons for pseudo-elements, one for pseudo-classes. <span class="badge">content</span> is mandatory — without it nothing renders. Generated content is decoration only: a screen reader may skip it, so never put meaning there.</p>

<h3>Transitions — animate the state change</h3>
<pre>.btn {
  background: #0a84ff;
  transition: background 200ms ease, transform 200ms ease;
}
.btn:hover  { background: #0060df; transform: translateY(-2px); }
.btn:active { transform: translateY(0); }

@media (prefers-reduced-motion: reduce) {   <span class="tok-comment">/* respect the OS setting */</span>
  * { transition: none !important; animation: none !important; }
}</pre>
<div class="out"><b>Put the transition on the base rule, not on <span class="badge">:hover</span></b> — that way it animates both in and out. Declaring it only inside <span class="badge">:hover</span> gives a smooth entrance and an abrupt exit.<br>
<b>Animate only <span class="badge">transform</span> and <span class="badge">opacity</span> when you can.</b> Those two are handled by the GPU without recalculating the layout; animating <span class="badge">width</span>, <span class="badge">top</span> or <span class="badge">margin</span> forces the browser to re-layout the page on every frame and visibly stutters on a phone.<br>
<b>150–300 ms is the range that feels responsive</b>; above 500 ms the interface feels slow.</div>

<h3>Positioning — five values, one decision</h3>
<table><thead><tr><th>position</th><th>Behaviour</th><th>Typical use</th></tr></thead><tbody>
<tr><td><span class="badge">static</span></td><td>the default; top/left ignored</td><td>everything, normally</td></tr>
<tr><td><span class="badge">relative</span></td><td>shifted from its own place, <b>keeps its space</b></td><td>nudge, and <b>anchor for an absolute child</b></td></tr>
<tr><td><span class="badge">absolute</span></td><td>removed from the flow, placed against the nearest positioned ancestor</td><td>badge on a card, close button</td></tr>
<tr><td><span class="badge">fixed</span></td><td>against the viewport, stays while scrolling</td><td>sticky header, back-to-top button</td></tr>
<tr><td><span class="badge">sticky</span></td><td>relative until it hits a threshold, then fixed</td><td>a section title that pins while its section scrolls</td></tr>
</tbody></table>
<div class="out"><b>The pairing everyone needs.</b> A "SALE" badge in the corner of a card:<br>
<span class="badge">.card { position: relative; }</span> — the parent becomes the reference frame<br>
<span class="badge">.card .badge { position: absolute; top: 8px; right: 8px; }</span> — placed against the card, not the page.<br>
<b>Forget the <span class="badge">relative</span> on the parent</b> and the badge jumps to the top-right corner of the whole document — the single most common positioning bug.<br>
<b><span class="badge">sticky</span> needs a threshold:</b> <span class="badge">position: sticky; top: 0;</span> — without <span class="badge">top</span> it silently does nothing.</div>

<div class="pitfall"><b>Do not build a layout out of <span class="badge">position: absolute</span>.</b> Absolutely positioned elements are removed from the flow, so the container collapses and nothing responds to a smaller screen. Layout is Flexbox and Grid (lesson 2.2); positioning is for the few things that must sit <em>on top</em> of the layout.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Stacking contexts explain why <span class="badge">z-index: 9999</span> does not work.</b> <span class="badge">z-index</span> only compares siblings inside the same stacking context — and a new context is created by <span class="badge">position</span> with a z-index, but also by <span class="badge">opacity</span> below 1, any <span class="badge">transform</span>, <span class="badge">filter</span> or <span class="badge">will-change</span>. So a modal inside a card that has <span class="badge">transform: translateY(-2px)</span> can never rise above a sibling of that card, whatever number you write. The fix is to move the element out of the trapping context, which is why UI libraries render modals into a portal at the end of <span class="badge">&lt;body&gt;</span>. <em>Beyond syllabus because the MOOC teaches z-index as a number, while in practice it is a tree.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.5</span>
<h2>Trạng thái, nội dung sinh ra và chỗ các hộp thật sự nằm</h2>
<p class="lead">Đây là MOOC 2 mô-đun 3 — phần làm cho trang có cảm giác sống động thay vì như trang in. Ba chủ đề: chọn theo trạng thái, làm mượt sự thay đổi, và đưa một phần tử ra khỏi dòng chảy thông thường.</p>

<h3>Pseudo-class — chọn theo trạng thái hoặc vị trí</h3>
<pre>a:hover        <span class="tok-comment">/* rê chuột lên */</span>
a:focus-visible <span class="tok-comment">/* tới bằng bàn phím — luôn luôn tạo kiểu cho cái này */</span>
input:invalid  <span class="tok-comment">/* không qua được kiểm tra HTML5 (bài 1.3) */</span>
li:first-child · li:last-child · li:nth-child(2n)   <span class="tok-comment">/* theo vị trí */</span>
tr:nth-child(odd)  { background: #f6f6f6; }         <span class="tok-comment">/* sọc ngựa vằn, không cần class */</span>
.card:not(.featured) { opacity: .8; }</pre>
<div class="out"><b>Đọc <span class="badge">nth-child</span> thế nào.</b> Tham số là công thức <span class="badge">an + b</span>: <span class="badge">2n</span> = cứ hai cái lấy một (2, 4, 6…), <span class="badge">2n+1</span> = các vị trí lẻ, <span class="badge">3n</span> = cứ ba cái, <span class="badge">-n+3</span> = ba cái đầu. Vậy với lưới ba cột mà phần tử cuối mỗi hàng không được có lề phải thì viết <span class="badge">.item:nth-child(3n) { margin-right: 0 }</span>.<br>
<b>Luôn tạo kiểu cho <span class="badge">:focus-visible</span> ngay cạnh <span class="badge">:hover</span></b> — nếu không, người dùng bàn phím chẳng nhận được phản hồi nào (bài 1.4).</div>

<h3>Pseudo-element — nội dung không có trong HTML</h3>
<pre>.required label::after { content: " *"; color: red; }
blockquote::before { content: "\\201C"; font-size: 3rem; }
.external::after { content: " ↗"; }</pre>
<p>Hai dấu hai chấm cho pseudo-element, một dấu cho pseudo-class. <span class="badge">content</span> là bắt buộc — thiếu nó thì không hiện gì cả. Nội dung sinh ra chỉ để trang trí: trình đọc màn hình có thể bỏ qua, nên đừng bao giờ đặt ý nghĩa vào đó.</p>

<h3>Transition — làm mượt sự đổi trạng thái</h3>
<pre>.btn {
  background: #0a84ff;
  transition: background 200ms ease, transform 200ms ease;
}
.btn:hover  { background: #0060df; transform: translateY(-2px); }
.btn:active { transform: translateY(0); }

@media (prefers-reduced-motion: reduce) {   <span class="tok-comment">/* tôn trọng cài đặt hệ điều hành */</span>
  * { transition: none !important; animation: none !important; }
}</pre>
<div class="out"><b>Đặt transition ở luật gốc, không đặt trong <span class="badge">:hover</span></b> — như vậy nó mượt cả lúc vào lẫn lúc ra. Khai báo chỉ trong <span class="badge">:hover</span> cho một lối vào mượt mà và một lối ra giật cục.<br>
<b>Chỉ làm chuyển động <span class="badge">transform</span> và <span class="badge">opacity</span> khi có thể.</b> Hai thứ đó do GPU xử lý mà không phải tính lại bố cục; làm chuyển động <span class="badge">width</span>, <span class="badge">top</span> hay <span class="badge">margin</span> buộc trình duyệt dựng lại bố cục trang ở mỗi khung hình và giật thấy rõ trên điện thoại.<br>
<b>150–300 mili-giây là khoảng cho cảm giác nhạy</b>; trên 500 mili-giây thì giao diện có cảm giác chậm chạp.</div>

<h3>Định vị — năm giá trị, một quyết định</h3>
<table><thead><tr><th>position</th><th>Hành vi</th><th>Dùng điển hình</th></tr></thead><tbody>
<tr><td><span class="badge">static</span></td><td>mặc định; bỏ qua top/left</td><td>bình thường thì mọi thứ</td></tr>
<tr><td><span class="badge">relative</span></td><td>dịch khỏi chỗ của chính nó, <b>vẫn giữ chỗ cũ</b></td><td>nhích nhẹ, và <b>làm mốc cho con absolute</b></td></tr>
<tr><td><span class="badge">absolute</span></td><td>ra khỏi dòng chảy, đặt theo tổ tiên gần nhất có định vị</td><td>nhãn trên thẻ, nút đóng</td></tr>
<tr><td><span class="badge">fixed</span></td><td>theo khung nhìn, đứng yên khi cuộn</td><td>thanh đầu dính, nút lên đầu trang</td></tr>
<tr><td><span class="badge">sticky</span></td><td>relative cho tới khi chạm ngưỡng rồi thành fixed</td><td>tiêu đề mục ghim lại trong lúc mục đó cuộn</td></tr>
</tbody></table>
<div class="out"><b>Cặp đôi ai cũng cần.</b> Một nhãn "SALE" ở góc thẻ sản phẩm:<br>
<span class="badge">.card { position: relative; }</span> — phần tử cha trở thành hệ quy chiếu<br>
<span class="badge">.card .badge { position: absolute; top: 8px; right: 8px; }</span> — đặt theo thẻ, không theo cả trang.<br>
<b>Quên <span class="badge">relative</span> ở phần tử cha</b> là cái nhãn nhảy tót lên góc trên bên phải của cả tài liệu — lỗi định vị phổ biến nhất.<br>
<b><span class="badge">sticky</span> cần một ngưỡng:</b> <span class="badge">position: sticky; top: 0;</span> — thiếu <span class="badge">top</span> thì nó âm thầm không làm gì cả.</div>

<div class="pitfall"><b>Đừng dựng bố cục bằng <span class="badge">position: absolute</span>.</b> Phần tử định vị tuyệt đối bị lấy ra khỏi dòng chảy, nên khung chứa xẹp lại và chẳng gì phản ứng khi màn hình nhỏ đi. Bố cục là việc của Flexbox và Grid (bài 2.2); định vị dành cho vài thứ phải nằm <em>đè lên</em> bố cục.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Ngữ cảnh xếp chồng giải thích vì sao <span class="badge">z-index: 9999</span> không ăn.</b> <span class="badge">z-index</span> chỉ so sánh các phần tử anh em trong cùng một ngữ cảnh xếp chồng — mà ngữ cảnh mới được tạo ra bởi <span class="badge">position</span> có z-index, nhưng cũng bởi <span class="badge">opacity</span> nhỏ hơn 1, bởi bất kỳ <span class="badge">transform</span>, <span class="badge">filter</span> hay <span class="badge">will-change</span> nào. Nên một hộp thoại nằm trong một thẻ có <span class="badge">transform: translateY(-2px)</span> sẽ không bao giờ nổi lên trên một phần tử anh em của thẻ đó, dù bạn ghi con số nào. Cách chữa là đưa phần tử ra khỏi ngữ cảnh đang giam nó, và đó là lý do các thư viện giao diện dựng hộp thoại vào một portal ở cuối <span class="badge">&lt;body&gt;</span>. <em>Ngoài giáo trình vì MOOC dạy z-index như một con số, trong khi thực tế nó là một cái cây.</em></div>
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
          title: '3.2 — Variables, arrays & loops|||3.2 — Biến, mảng & vòng lặp',
          slug: 'wed201c-js-co-ban',
          type: 'VIDEO',
          description: 'MOOC 3 mô-đun 3: let/const, kiểu dữ liệu, mảng và các vòng lặp — kèm bẫy so sánh == vs ===.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>The language itself, before you touch the page</h2>
<p class="lead">MOOC 3 module 3 is "Arrays and Looping". Ninety per cent of the JavaScript in a WED201c project is this: store some values, loop over them, build some HTML. Get these fundamentals right and the DOM work in lesson 3.3 becomes easy.</p>

<h3>Declaring variables — two keywords, one rule</h3>
<pre><span class="tok-keyword">const</span> siteName = <span class="tok-string">"FPTU Web"</span>;   <span class="tok-comment">// cannot be reassigned — the default</span>
<span class="tok-keyword">let</span> counter = 0;                <span class="tok-comment">// use only when the value must change</span>
counter = counter + 1;          <span class="tok-comment">// fine</span>

<span class="tok-comment">// const on an object still allows changing its contents</span>
<span class="tok-keyword">const</span> student = { name: <span class="tok-string">"An"</span>, gpa: 8.1 };
student.gpa = 8.5;              <span class="tok-comment">// allowed — the binding is fixed, not the object</span></pre>
<p><b>Never use <span class="badge">var</span>.</b> It ignores block scope, so a <span class="badge">var</span> declared inside an <span class="badge">if</span> leaks out of it — a source of bugs that <span class="badge">let</span> and <span class="badge">const</span> simply removed.</p>

<h3>Types, and the comparison trap</h3>
<div class="out"><b>Seven types you will meet:</b> string, number, boolean, null, undefined, object, array (technically an object).<br>
<b>The trap:</b> <span class="badge">"5" == 5</span> is <b>true</b> — the loose operator converts types before comparing. <span class="badge">"5" === 5</span> is <b>false</b>, comparing type and value.<br>
<b>Why it matters here:</b> everything read from an input is a <em>string</em>. <span class="badge">input.value + 1</span> where the user typed 5 gives <b>"51"</b>, not 6. Convert first: <span class="badge">Number(input.value) + 1</span> or <span class="badge">parseInt(input.value, 10)</span>.<br>
<b>Rule: always use <span class="badge">===</span> and <span class="badge">!==</span>.</b></div>

<h3>Arrays and the loops that matter</h3>
<pre><span class="tok-keyword">const</span> marks = [8.5, 7.0, 9.2, 6.4];

marks.length          <span class="tok-comment">// 4</span>
marks.push(7.8)       <span class="tok-comment">// add to the end</span>
marks[0]              <span class="tok-comment">// 8.5 — index starts at 0</span>

<span class="tok-comment">// classic for loop — when you need the index</span>
<span class="tok-keyword">for</span> (<span class="tok-keyword">let</span> i = 0; i &lt; marks.length; i++) console.log(i, marks[i]);

<span class="tok-comment">// for...of — when you only need the value (clearest)</span>
<span class="tok-keyword">for</span> (<span class="tok-keyword">const</span> m <span class="tok-keyword">of</span> marks) console.log(m);

<span class="tok-comment">// the three array methods worth memorising</span>
<span class="tok-keyword">const</span> passed  = marks.filter(m =&gt; m &gt;= 7);         <span class="tok-comment">// [8.5, 7.0, 9.2, 7.8] — keep some</span>
<span class="tok-keyword">const</span> rounded = marks.map(m =&gt; Math.round(m));     <span class="tok-comment">// [9, 7, 9, 6, 8]     — transform all</span>
<span class="tok-keyword">const</span> total   = marks.reduce((sum, m) =&gt; sum + m, 0);  <span class="tok-comment">// 38.9        — one value</span></pre>
<div class="out"><b>Worked example — average mark and pass rate:</b><br>
<span class="badge">const avg = marks.reduce((s, m) =&gt; s + m, 0) / marks.length;</span> → 38.9 / 5 = <b>7.78</b><br>
<span class="badge">const rate = marks.filter(m =&gt; m &gt;= 5).length / marks.length * 100;</span> → 5/5 = <b>100%</b><br>
The same in a classic for loop takes six lines and one accidental <span class="badge">&lt;=</span> away from an off-by-one error. That is why <span class="badge">filter/map/reduce</span> are worth learning early.</div>

<h3>Functions — three ways to write one</h3>
<pre><span class="tok-keyword">function</span> greet(name) { <span class="tok-keyword">return</span> <span class="tok-string">"Hello "</span> + name; }        <span class="tok-comment">// declaration</span>
<span class="tok-keyword">const</span> greet2 = <span class="tok-keyword">function</span>(name) { <span class="tok-keyword">return</span> <span class="tok-string">"Hi "</span> + name; };  <span class="tok-comment">// expression</span>
<span class="tok-keyword">const</span> greet3 = name =&gt; &#96;Xin chào \${name}&#96;;              <span class="tok-comment">// arrow + template string</span></pre>
<p>Template strings with backticks and <span class="badge">\${…}</span> replace string concatenation — essential once you start building HTML in lesson 3.3.</p>

<div class="pitfall"><b>An array index that does not exist gives <span class="badge">undefined</span>, not an error.</b> <span class="badge">marks[10]</span> silently returns undefined, and <span class="badge">undefined + 1</span> is <span class="badge">NaN</span> ("not a number"), which then spreads through every later calculation. If a number "becomes NaN", look for an out-of-range index or an unconverted input value.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Optional chaining and nullish coalescing remove most defensive code.</b> <span class="badge">user?.address?.city</span> returns undefined instead of throwing when <span class="badge">address</span> is missing, and <span class="badge">const page = input ?? 1</span> uses 1 only when the value is null or undefined — unlike <span class="badge">||</span>, which would also replace 0 and the empty string. Two operators that delete whole blocks of <span class="badge">if (x &amp;&amp; x.y &amp;&amp; x.y.z)</span> checks. <em>Beyond syllabus because the MOOC predates them, while every modern codebase assumes them.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Bản thân ngôn ngữ, trước khi đụng tới trang web</h2>
<p class="lead">MOOC 3 mô-đun 3 là "Mảng và vòng lặp". Chín mươi phần trăm JavaScript trong một đồ án WED201c chỉ là thế này: lưu vài giá trị, lặp qua chúng, dựng ra một ít HTML. Nắm chắc phần nền này thì việc thao tác DOM ở bài 3.3 trở nên dễ dàng.</p>

<h3>Khai báo biến — hai từ khoá, một quy tắc</h3>
<pre><span class="tok-keyword">const</span> siteName = <span class="tok-string">"FPTU Web"</span>;   <span class="tok-comment">// không gán lại được — mặc định dùng cái này</span>
<span class="tok-keyword">let</span> counter = 0;                <span class="tok-comment">// chỉ dùng khi giá trị bắt buộc phải đổi</span>
counter = counter + 1;          <span class="tok-comment">// hợp lệ</span>

<span class="tok-comment">// const trên một object vẫn cho phép đổi nội dung bên trong</span>
<span class="tok-keyword">const</span> student = { name: <span class="tok-string">"An"</span>, gpa: 8.1 };
student.gpa = 8.5;              <span class="tok-comment">// được — cái cố định là ràng buộc tên, không phải object</span></pre>
<p><b>Đừng bao giờ dùng <span class="badge">var</span>.</b> Nó bỏ qua phạm vi khối, nên một biến <span class="badge">var</span> khai trong <span class="badge">if</span> rò ra ngoài — nguồn lỗi mà <span class="badge">let</span> và <span class="badge">const</span> đã xoá sổ.</p>

<h3>Kiểu dữ liệu, và cái bẫy so sánh</h3>
<div class="out"><b>Bảy kiểu bạn sẽ gặp:</b> string, number, boolean, null, undefined, object, array (về mặt kỹ thuật là một object).<br>
<b>Cái bẫy:</b> <span class="badge">"5" == 5</span> cho <b>true</b> — toán tử lỏng tự chuyển kiểu trước khi so sánh. <span class="badge">"5" === 5</span> cho <b>false</b>, so cả kiểu lẫn giá trị.<br>
<b>Vì sao chuyện này quan trọng ở đây:</b> mọi thứ đọc từ ô nhập đều là <em>chuỗi</em>. <span class="badge">input.value + 1</span> khi người dùng gõ 5 sẽ cho <b>"51"</b>, không phải 6. Hãy chuyển kiểu trước: <span class="badge">Number(input.value) + 1</span> hoặc <span class="badge">parseInt(input.value, 10)</span>.<br>
<b>Quy tắc: luôn dùng <span class="badge">===</span> và <span class="badge">!==</span>.</b></div>

<h3>Mảng và những vòng lặp đáng dùng</h3>
<pre><span class="tok-keyword">const</span> marks = [8.5, 7.0, 9.2, 6.4];

marks.length          <span class="tok-comment">// 4</span>
marks.push(7.8)       <span class="tok-comment">// thêm vào cuối</span>
marks[0]              <span class="tok-comment">// 8.5 — chỉ số bắt đầu từ 0</span>

<span class="tok-comment">// vòng for kinh điển — khi cần chỉ số</span>
<span class="tok-keyword">for</span> (<span class="tok-keyword">let</span> i = 0; i &lt; marks.length; i++) console.log(i, marks[i]);

<span class="tok-comment">// for...of — khi chỉ cần giá trị (rõ ràng nhất)</span>
<span class="tok-keyword">for</span> (<span class="tok-keyword">const</span> m <span class="tok-keyword">of</span> marks) console.log(m);

<span class="tok-comment">// ba phương thức mảng đáng thuộc lòng</span>
<span class="tok-keyword">const</span> passed  = marks.filter(m =&gt; m &gt;= 7);         <span class="tok-comment">// [8.5, 7.0, 9.2, 7.8] — giữ một số</span>
<span class="tok-keyword">const</span> rounded = marks.map(m =&gt; Math.round(m));     <span class="tok-comment">// [9, 7, 9, 6, 8]     — biến đổi tất cả</span>
<span class="tok-keyword">const</span> total   = marks.reduce((sum, m) =&gt; sum + m, 0);  <span class="tok-comment">// 38.9        — gộp về một giá trị</span></pre>
<div class="out"><b>Ví dụ có lời giải — điểm trung bình và tỉ lệ qua môn:</b><br>
<span class="badge">const avg = marks.reduce((s, m) =&gt; s + m, 0) / marks.length;</span> → 38,9 / 5 = <b>7,78</b><br>
<span class="badge">const rate = marks.filter(m =&gt; m &gt;= 5).length / marks.length * 100;</span> → 5/5 = <b>100%</b><br>
Cũng việc đó viết bằng vòng for kinh điển thì mất sáu dòng và chỉ cách một dấu <span class="badge">&lt;=</span> nhầm là lệch một đơn vị. Vì thế <span class="badge">filter/map/reduce</span> đáng học sớm.</div>

<h3>Hàm — ba cách viết</h3>
<pre><span class="tok-keyword">function</span> greet(name) { <span class="tok-keyword">return</span> <span class="tok-string">"Hello "</span> + name; }        <span class="tok-comment">// khai báo</span>
<span class="tok-keyword">const</span> greet2 = <span class="tok-keyword">function</span>(name) { <span class="tok-keyword">return</span> <span class="tok-string">"Hi "</span> + name; };  <span class="tok-comment">// biểu thức</span>
<span class="tok-keyword">const</span> greet3 = name =&gt; &#96;Xin chào \${name}&#96;;              <span class="tok-comment">// mũi tên + chuỗi mẫu</span></pre>
<p>Chuỗi mẫu dùng dấu huyền và <span class="badge">\${…}</span> thay cho việc nối chuỗi — thiết yếu khi bạn bắt đầu dựng HTML ở bài 3.3.</p>

<div class="pitfall"><b>Chỉ số mảng không tồn tại thì cho <span class="badge">undefined</span> chứ không báo lỗi.</b> <span class="badge">marks[10]</span> âm thầm trả về undefined, và <span class="badge">undefined + 1</span> là <span class="badge">NaN</span> ("không phải số"), rồi giá trị đó lan ra mọi phép tính về sau. Nếu một con số "bỗng thành NaN", hãy tìm chỉ số vượt phạm vi hoặc một giá trị nhập chưa chuyển kiểu.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Toán tử chuỗi tuỳ chọn và hợp nhất null xoá gần hết mã phòng thủ.</b> <span class="badge">user?.address?.city</span> trả về undefined thay vì ném lỗi khi thiếu <span class="badge">address</span>, còn <span class="badge">const page = input ?? 1</span> chỉ lấy 1 khi giá trị là null hoặc undefined — khác với <span class="badge">||</span> vốn thay thế cả số 0 lẫn chuỗi rỗng. Hai toán tử xoá đi cả khối kiểm <span class="badge">if (x &amp;&amp; x.y &amp;&amp; x.y.z)</span>. <em>Ngoài giáo trình vì MOOC ra đời trước chúng, còn mọi mã nguồn hiện đại thì mặc định là có.</em></div>
</div>
`,
        },
        {
          title: '3.3 — The DOM: find, change, create|||3.3 — DOM: tìm, sửa, tạo phần tử',
          slug: 'wed201c-dom',
          type: 'VIDEO',
          description: 'querySelector, textContent vs innerHTML, đổi class và style, tạo phần tử mới — mọi thao tác DOM bạn cần.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>JavaScript's only job on a web page: change the DOM</h2>
<p class="lead">The browser turns your HTML into a tree of objects — the Document Object Model. Everything interactive is one of four operations on that tree: find a node, read it, change it, or create a new one.</p>

<h3>1. Find</h3>
<pre><span class="tok-keyword">const</span> title  = document.querySelector(<span class="tok-string">"#title"</span>);      <span class="tok-comment">// first match, any CSS selector</span>
<span class="tok-keyword">const</span> cards  = document.querySelectorAll(<span class="tok-string">".card"</span>);    <span class="tok-comment">// all matches (a NodeList)</span>
<span class="tok-keyword">const</span> first  = document.querySelector(<span class="tok-string">"nav ul li:first-child"</span>);</pre>
<p>You know CSS selectors already, so <span class="badge">querySelector</span> is the only finder you need — the older <span class="badge">getElementById</span> and <span class="badge">getElementsByClassName</span> do less with more typing.</p>

<h3>2. Read and change content</h3>
<pre>title.textContent = <span class="tok-string">"Xin chào"</span>;                 <span class="tok-comment">// text only — SAFE</span>
box.innerHTML = <span class="tok-string">"&lt;strong&gt;Bold&lt;/strong&gt;"</span>;      <span class="tok-comment">// parses HTML — careful</span>
input.value = <span class="tok-string">"An"</span>;                             <span class="tok-comment">// form fields use .value, not .textContent</span>
img.src = <span class="tok-string">"new.jpg"</span>;  link.href = <span class="tok-string">"/about"</span>;   <span class="tok-comment">// attributes are properties</span></pre>
<div class="out"><b>textContent or innerHTML?</b> If the string came from a user — a comment, a search box, a URL parameter — use <span class="badge">textContent</span>. With <span class="badge">innerHTML</span>, the text <span class="badge">&lt;img src=x onerror=alert(1)&gt;</span> executes as code. That is <em>cross-site scripting</em> (XSS), the most common vulnerability on the web, and <span class="badge">textContent</span> prevents it completely by never parsing tags.</div>

<h3>3. Change appearance — through classes, not styles</h3>
<pre>el.classList.add(<span class="tok-string">"active"</span>);
el.classList.remove(<span class="tok-string">"hidden"</span>);
el.classList.toggle(<span class="tok-string">"dark"</span>);            <span class="tok-comment">// add if absent, remove if present</span>
el.classList.contains(<span class="tok-string">"active"</span>);      <span class="tok-comment">// true / false</span>

el.style.display = <span class="tok-string">"none"</span>;             <span class="tok-comment">// works, but avoid for anything complex</span></pre>
<p>Keep the look in CSS and let JavaScript only switch class names. A dark-mode toggle is then <span class="badge">document.body.classList.toggle("dark")</span> plus a <span class="badge">.dark { … }</span> block — instead of twenty <span class="badge">el.style.…</span> assignments.</p>

<h3>4. Create and insert</h3>
<pre><span class="tok-keyword">const</span> li = document.createElement(<span class="tok-string">"li"</span>);
li.textContent = <span class="tok-string">"New item"</span>;
li.classList.add(<span class="tok-string">"todo"</span>);
list.appendChild(li);                    <span class="tok-comment">// add at the end</span>
li.remove();                             <span class="tok-comment">// delete it again</span></pre>

<h3>Worked example — render an array as a list</h3>
<pre><span class="tok-keyword">const</span> students = [
  { name: <span class="tok-string">"An"</span>,  gpa: 8.5 },
  { name: <span class="tok-string">"Bình"</span>, gpa: 6.4 },
  { name: <span class="tok-string">"Chi"</span>,  gpa: 9.1 },
];
<span class="tok-keyword">const</span> ul = document.querySelector(<span class="tok-string">"#list"</span>);

<span class="tok-keyword">for</span> (<span class="tok-keyword">const</span> s <span class="tok-keyword">of</span> students) {
  <span class="tok-keyword">const</span> li = document.createElement(<span class="tok-string">"li"</span>);
  li.textContent = &#96;\${s.name} — \${s.gpa}&#96;;
  <span class="tok-keyword">if</span> (s.gpa &gt;= 8) li.classList.add(<span class="tok-string">"excellent"</span>);
  ul.appendChild(li);
}</pre>
<div class="out"><b>Result:</b> three <span class="badge">&lt;li&gt;</span> elements, two of them carrying the class <span class="badge">excellent</span> which your CSS can colour gold. This eight-line pattern — array in, elements out — is the core of the MOOC 5 capstone and of every framework you will meet later (React does exactly this, just automatically).<br>
<b>Performance note:</b> appending inside a loop touches the page N times. For long lists, build the HTML in a string and assign once, or append into a <span class="badge">DocumentFragment</span> and insert that — one reflow instead of N.</div>

<div class="pitfall"><b>Put your <span class="badge">&lt;script&gt;</span> just before <span class="badge">&lt;/body&gt;</span>, or use <span class="badge">defer</span>.</b> A script in the <span class="badge">&lt;head&gt;</span> runs before the HTML exists, so <span class="badge">querySelector</span> returns <span class="badge">null</span> and you get "Cannot read properties of null". That single error accounts for most "my JavaScript does nothing" reports.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Data attributes carry state without a global variable.</b> Write <span class="badge">&lt;button data-id="42" data-action="delete"&gt;</span> and read it with <span class="badge">btn.dataset.id</span> and <span class="badge">btn.dataset.action</span>. The element carries its own context, so one handler can serve a whole list — which is exactly how event delegation (lesson 3.4) stays simple. The convention is standard HTML5 and is what React's props and Vue's directives ultimately compile down to. <em>Beyond syllabus because the MOOC keeps state in global variables, which stops working the moment the list is dynamic.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>Việc duy nhất của JavaScript trên một trang web: thay đổi DOM</h2>
<p class="lead">Trình duyệt biến HTML của bạn thành một cây các đối tượng — Document Object Model. Mọi thứ tương tác đều là một trong bốn thao tác trên cây đó: tìm một nút, đọc nó, sửa nó, hoặc tạo một nút mới.</p>

<h3>1. Tìm</h3>
<pre><span class="tok-keyword">const</span> title  = document.querySelector(<span class="tok-string">"#title"</span>);      <span class="tok-comment">// khớp đầu tiên, dùng bộ chọn CSS bất kỳ</span>
<span class="tok-keyword">const</span> cards  = document.querySelectorAll(<span class="tok-string">".card"</span>);    <span class="tok-comment">// mọi phần tử khớp (một NodeList)</span>
<span class="tok-keyword">const</span> first  = document.querySelector(<span class="tok-string">"nav ul li:first-child"</span>);</pre>
<p>Bạn đã biết bộ chọn CSS rồi, nên <span class="badge">querySelector</span> là công cụ tìm duy nhất bạn cần — <span class="badge">getElementById</span> và <span class="badge">getElementsByClassName</span> đời cũ làm được ít hơn mà gõ nhiều hơn.</p>

<h3>2. Đọc và sửa nội dung</h3>
<pre>title.textContent = <span class="tok-string">"Xin chào"</span>;                 <span class="tok-comment">// chỉ chữ — AN TOÀN</span>
box.innerHTML = <span class="tok-string">"&lt;strong&gt;Đậm&lt;/strong&gt;"</span>;       <span class="tok-comment">// phân tích HTML — phải cẩn thận</span>
input.value = <span class="tok-string">"An"</span>;                             <span class="tok-comment">// trường biểu mẫu dùng .value, không phải .textContent</span>
img.src = <span class="tok-string">"new.jpg"</span>;  link.href = <span class="tok-string">"/about"</span>;   <span class="tok-comment">// thuộc tính HTML là thuộc tính của đối tượng</span></pre>
<div class="out"><b>Dùng textContent hay innerHTML?</b> Nếu chuỗi đến từ người dùng — một bình luận, ô tìm kiếm, tham số URL — hãy dùng <span class="badge">textContent</span>. Với <span class="badge">innerHTML</span>, đoạn chữ <span class="badge">&lt;img src=x onerror=alert(1)&gt;</span> sẽ chạy như mã. Đó là <em>tấn công kịch bản chéo trang</em> (XSS), lỗ hổng phổ biến nhất trên web, và <span class="badge">textContent</span> ngăn nó triệt để vì không bao giờ phân tích thẻ.</div>

<h3>3. Đổi diện mạo — qua class, không qua style</h3>
<pre>el.classList.add(<span class="tok-string">"active"</span>);
el.classList.remove(<span class="tok-string">"hidden"</span>);
el.classList.toggle(<span class="tok-string">"dark"</span>);            <span class="tok-comment">// chưa có thì thêm, có rồi thì bỏ</span>
el.classList.contains(<span class="tok-string">"active"</span>);      <span class="tok-comment">// true / false</span>

el.style.display = <span class="tok-string">"none"</span>;             <span class="tok-comment">// chạy được, nhưng tránh dùng cho thứ phức tạp</span></pre>
<p>Hãy để diện mạo trong CSS và chỉ cho JavaScript bật/tắt tên class. Nút chuyển chế độ tối khi đó chỉ là <span class="badge">document.body.classList.toggle("dark")</span> cộng một khối <span class="badge">.dark { … }</span> — thay vì hai mươi dòng gán <span class="badge">el.style.…</span>.</p>

<h3>4. Tạo mới và chèn vào</h3>
<pre><span class="tok-keyword">const</span> li = document.createElement(<span class="tok-string">"li"</span>);
li.textContent = <span class="tok-string">"Mục mới"</span>;
li.classList.add(<span class="tok-string">"todo"</span>);
list.appendChild(li);                    <span class="tok-comment">// thêm vào cuối</span>
li.remove();                             <span class="tok-comment">// xoá nó đi</span></pre>

<h3>Ví dụ có lời giải — dựng danh sách từ một mảng</h3>
<pre><span class="tok-keyword">const</span> students = [
  { name: <span class="tok-string">"An"</span>,  gpa: 8.5 },
  { name: <span class="tok-string">"Bình"</span>, gpa: 6.4 },
  { name: <span class="tok-string">"Chi"</span>,  gpa: 9.1 },
];
<span class="tok-keyword">const</span> ul = document.querySelector(<span class="tok-string">"#list"</span>);

<span class="tok-keyword">for</span> (<span class="tok-keyword">const</span> s <span class="tok-keyword">of</span> students) {
  <span class="tok-keyword">const</span> li = document.createElement(<span class="tok-string">"li"</span>);
  li.textContent = &#96;\${s.name} — \${s.gpa}&#96;;
  <span class="tok-keyword">if</span> (s.gpa &gt;= 8) li.classList.add(<span class="tok-string">"excellent"</span>);
  ul.appendChild(li);
}</pre>
<div class="out"><b>Kết quả:</b> ba phần tử <span class="badge">&lt;li&gt;</span>, hai trong số đó mang class <span class="badge">excellent</span> để CSS của bạn tô màu vàng. Khuôn tám dòng này — mảng vào, phần tử ra — là lõi của đồ án capstone MOOC 5 và của mọi framework bạn gặp sau này (React làm đúng việc đó, chỉ là tự động).<br>
<b>Ghi chú hiệu năng:</b> gọi appendChild trong vòng lặp là đụng vào trang N lần. Với danh sách dài, hãy dựng HTML thành một chuỗi rồi gán một lần, hoặc chèn vào một <span class="badge">DocumentFragment</span> rồi đưa cả cụm vào — một lần dựng lại bố cục thay vì N lần.</div>

<div class="pitfall"><b>Đặt thẻ <span class="badge">&lt;script&gt;</span> ngay trước <span class="badge">&lt;/body&gt;</span>, hoặc dùng <span class="badge">defer</span>.</b> Script nằm trong <span class="badge">&lt;head&gt;</span> chạy trước khi HTML tồn tại, nên <span class="badge">querySelector</span> trả về <span class="badge">null</span> và bạn nhận lỗi "Cannot read properties of null". Chỉ riêng lỗi đó chiếm phần lớn các ca "JavaScript của em không chạy gì cả".</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Thuộc tính data mang trạng thái mà không cần biến toàn cục.</b> Viết <span class="badge">&lt;button data-id="42" data-action="delete"&gt;</span> rồi đọc bằng <span class="badge">btn.dataset.id</span> và <span class="badge">btn.dataset.action</span>. Phần tử tự mang ngữ cảnh của nó, nên một hàm xử lý phục vụ được cả danh sách — và đó đúng là lý do uỷ quyền sự kiện (bài 3.4) vẫn đơn giản. Quy ước này là HTML5 chuẩn và cũng là thứ mà props của React hay directive của Vue rốt cuộc biên dịch xuống. <em>Ngoài giáo trình vì MOOC giữ trạng thái trong biến toàn cục, cách làm hỏng ngay khi danh sách trở nên động.</em></div>
</div>
`,
        },
        {
          title: '3.4 — Events & form validation in JavaScript|||3.4 — Sự kiện & kiểm tra biểu mẫu bằng JavaScript',
          slug: 'wed201c-events-validation',
          type: 'VIDEO',
          description: 'addEventListener, đối tượng event, uỷ quyền sự kiện, và kiểm tra biểu mẫu đầy đủ có thông báo lỗi.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.4</span>
<h2>Reacting to your audience — MOOC 3, modules 2 and 4</h2>
<p class="lead">An event is something that happens: a click, a keypress, a form submission. You attach a function and the browser calls it. This lesson covers the three things that go wrong: attaching, reading the event, and handling elements that do not exist yet.</p>

<h3>Attaching a handler</h3>
<pre><span class="tok-keyword">const</span> btn = document.querySelector(<span class="tok-string">"#save"</span>);

btn.addEventListener(<span class="tok-string">"click"</span>, <span class="tok-keyword">function</span> (event) {
  console.log(<span class="tok-string">"clicked"</span>, event.target);
});

<span class="tok-comment">// arrow version, same thing</span>
btn.addEventListener(<span class="tok-string">"click"</span>, (e) =&gt; console.log(e.type));</pre>
<p>Prefer <span class="badge">addEventListener</span> to the HTML <span class="badge">onclick=""</span> attribute: you can attach several handlers, remove them again, and your behaviour stays in the JavaScript file instead of scattered through the markup.</p>

<h3>The events you will actually use</h3>
<table><thead><tr><th>Event</th><th>Fires on</th></tr></thead><tbody>
<tr><td><span class="badge">click</span></td><td>buttons, links, anything clickable</td></tr>
<tr><td><span class="badge">submit</span></td><td>the <span class="badge">&lt;form&gt;</span> — not the button</td></tr>
<tr><td><span class="badge">input</span></td><td>every keystroke in a field (live validation)</td></tr>
<tr><td><span class="badge">change</span></td><td>after leaving a field, or on select/checkbox</td></tr>
<tr><td><span class="badge">keydown</span></td><td>a key is pressed — check <span class="badge">e.key === "Enter"</span></td></tr>
<tr><td><span class="badge">DOMContentLoaded</span></td><td>the HTML is parsed and safe to query</td></tr>
</tbody></table>

<h3>Worked example — a validated registration form</h3>
<pre><span class="tok-keyword">const</span> form = document.querySelector(<span class="tok-string">"#register"</span>);

form.addEventListener(<span class="tok-string">"submit"</span>, <span class="tok-keyword">function</span> (e) {
  e.preventDefault();                       <span class="tok-comment">// stop the page reloading</span>

  <span class="tok-keyword">const</span> email = form.email.value.trim();    <span class="tok-comment">// fields by their name attribute</span>
  <span class="tok-keyword">const</span> pw    = form.pw.value;
  <span class="tok-keyword">const</span> pw2   = form.pw2.value;
  <span class="tok-keyword">const</span> errors = [];

  <span class="tok-keyword">if</span> (!email.includes(<span class="tok-string">"@"</span>))  errors.push(<span class="tok-string">"Email is not valid"</span>);
  <span class="tok-keyword">if</span> (pw.length &lt; 8)        errors.push(<span class="tok-string">"Password must be at least 8 characters"</span>);
  <span class="tok-keyword">if</span> (pw !== pw2)           errors.push(<span class="tok-string">"The two passwords do not match"</span>);

  <span class="tok-keyword">const</span> box = document.querySelector(<span class="tok-string">"#errors"</span>);
  <span class="tok-keyword">if</span> (errors.length &gt; 0) {
    box.textContent = errors.join(<span class="tok-string">" · "</span>);   <span class="tok-comment">// textContent, never innerHTML</span>
    box.classList.add(<span class="tok-string">"show"</span>);
    <span class="tok-keyword">return</span>;                                 <span class="tok-comment">// do not submit</span>
  }
  box.classList.remove(<span class="tok-string">"show"</span>);
  form.submit();                             <span class="tok-comment">// everything passed</span>
});</pre>
<div class="out"><b>Three details that make this correct:</b><br>
<b>1.</b> The listener is on the <em>form's</em> <span class="badge">submit</span>, not the button's <span class="badge">click</span> — so pressing Enter in a field is handled too.<br>
<b>2.</b> <span class="badge">e.preventDefault()</span> stops the browser's default reload; without it the page refreshes and your messages vanish instantly. This is the number-one beginner bug.<br>
<b>3.</b> Errors are collected in an array and shown together, rather than three separate alerts. The <span class="badge">alert()</span> box blocks the page and cannot be styled — never ship it.<br>
<b>Remember lesson 1.3:</b> the HTML attributes <span class="badge">required</span> and <span class="badge">minlength</span> already do most of this. Write JavaScript only for rules HTML cannot express — such as "the two passwords must match".</div>

<h3>Event delegation — one handler for a list that grows</h3>
<pre><span class="tok-comment">// wrong: no handler on items added later</span>
document.querySelectorAll(<span class="tok-string">".delete"</span>).forEach(b =&gt;
  b.addEventListener(<span class="tok-string">"click"</span>, remove));

<span class="tok-comment">// right: listen on the parent, check what was clicked</span>
list.addEventListener(<span class="tok-string">"click"</span>, (e) =&gt; {
  <span class="tok-keyword">const</span> btn = e.target.closest(<span class="tok-string">".delete"</span>);
  <span class="tok-keyword">if</span> (!btn) <span class="tok-keyword">return</span>;
  btn.closest(<span class="tok-string">"li"</span>).remove();
});</pre>
<p>Events <em>bubble</em> from the clicked element up to its ancestors, so a listener on the list sees clicks on every current and future child. One handler instead of hundreds — and it keeps working after you add an item.</p>

<div class="pitfall"><b><span class="badge">addEventListener("click", handler())</span> with brackets calls the function immediately and passes its return value.</b> Pass the reference: <span class="badge">handler</span>, no brackets. If you must pass an argument, wrap it: <span class="badge">() =&gt; handler(id)</span>. The symptom is a handler that runs once on page load and never again.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Debouncing — the technique that makes a search box usable.</b> An <span class="badge">input</span> event fires on every keystroke; if each one triggers a request, typing "database" sends eight. Wrap the handler so it only runs once the user has paused: <span class="badge">let t; input.addEventListener("input", () =&gt; { clearTimeout(t); t = setTimeout(search, 300); });</span>. Four lines, and it removes most of the traffic. The same pattern (throttling) is used for scroll and resize handlers, which otherwise fire dozens of times a second. <em>Beyond syllabus because the MOOC never runs into the volume, while any real search field does.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.4</span>
<h2>Phản ứng với người dùng — MOOC 3, mô-đun 2 và 4</h2>
<p class="lead">Sự kiện là một chuyện xảy ra: một cú bấm, một phím gõ, một lần gửi biểu mẫu. Bạn gắn một hàm vào và trình duyệt gọi nó. Bài này nói về ba chỗ hay sai: cách gắn, cách đọc đối tượng sự kiện, và cách xử lý những phần tử chưa tồn tại.</p>

<h3>Gắn một hàm xử lý</h3>
<pre><span class="tok-keyword">const</span> btn = document.querySelector(<span class="tok-string">"#save"</span>);

btn.addEventListener(<span class="tok-string">"click"</span>, <span class="tok-keyword">function</span> (event) {
  console.log(<span class="tok-string">"đã bấm"</span>, event.target);
});

<span class="tok-comment">// bản viết bằng hàm mũi tên, y hệt</span>
btn.addEventListener(<span class="tok-string">"click"</span>, (e) =&gt; console.log(e.type));</pre>
<p>Hãy ưu tiên <span class="badge">addEventListener</span> hơn thuộc tính HTML <span class="badge">onclick=""</span>: bạn gắn được nhiều hàm, gỡ ra được, và hành vi nằm gọn trong tệp JavaScript thay vì rải rác khắp mã HTML.</p>

<h3>Các sự kiện bạn thật sự dùng</h3>
<table><thead><tr><th>Sự kiện</th><th>Xảy ra khi</th></tr></thead><tbody>
<tr><td><span class="badge">click</span></td><td>nút, liên kết, mọi thứ bấm được</td></tr>
<tr><td><span class="badge">submit</span></td><td>trên thẻ <span class="badge">&lt;form&gt;</span> — không phải trên nút</td></tr>
<tr><td><span class="badge">input</span></td><td>mỗi phím gõ trong một ô (kiểm tra tức thời)</td></tr>
<tr><td><span class="badge">change</span></td><td>sau khi rời ô, hoặc khi chọn select/checkbox</td></tr>
<tr><td><span class="badge">keydown</span></td><td>một phím được nhấn — kiểm <span class="badge">e.key === "Enter"</span></td></tr>
<tr><td><span class="badge">DOMContentLoaded</span></td><td>HTML đã phân tích xong, truy vấn được an toàn</td></tr>
</tbody></table>

<h3>Ví dụ có lời giải — biểu mẫu đăng ký có kiểm tra</h3>
<pre><span class="tok-keyword">const</span> form = document.querySelector(<span class="tok-string">"#register"</span>);

form.addEventListener(<span class="tok-string">"submit"</span>, <span class="tok-keyword">function</span> (e) {
  e.preventDefault();                       <span class="tok-comment">// chặn trang tải lại</span>

  <span class="tok-keyword">const</span> email = form.email.value.trim();    <span class="tok-comment">// truy cập trường theo thuộc tính name</span>
  <span class="tok-keyword">const</span> pw    = form.pw.value;
  <span class="tok-keyword">const</span> pw2   = form.pw2.value;
  <span class="tok-keyword">const</span> errors = [];

  <span class="tok-keyword">if</span> (!email.includes(<span class="tok-string">"@"</span>))  errors.push(<span class="tok-string">"Email không hợp lệ"</span>);
  <span class="tok-keyword">if</span> (pw.length &lt; 8)        errors.push(<span class="tok-string">"Mật khẩu phải từ 8 ký tự"</span>);
  <span class="tok-keyword">if</span> (pw !== pw2)           errors.push(<span class="tok-string">"Hai mật khẩu không khớp"</span>);

  <span class="tok-keyword">const</span> box = document.querySelector(<span class="tok-string">"#errors"</span>);
  <span class="tok-keyword">if</span> (errors.length &gt; 0) {
    box.textContent = errors.join(<span class="tok-string">" · "</span>);   <span class="tok-comment">// dùng textContent, đừng innerHTML</span>
    box.classList.add(<span class="tok-string">"show"</span>);
    <span class="tok-keyword">return</span>;                                 <span class="tok-comment">// không gửi đi</span>
  }
  box.classList.remove(<span class="tok-string">"show"</span>);
  form.submit();                             <span class="tok-comment">// mọi thứ đã hợp lệ</span>
});</pre>
<div class="out"><b>Ba chi tiết làm đoạn này đúng:</b><br>
<b>1.</b> Hàm gắn vào sự kiện <span class="badge">submit</span> của <em>biểu mẫu</em>, không phải <span class="badge">click</span> của nút — nhờ vậy nhấn Enter trong một ô cũng được xử lý.<br>
<b>2.</b> <span class="badge">e.preventDefault()</span> chặn hành vi tải lại mặc định; thiếu nó thì trang làm mới và các thông báo của bạn biến mất tức thì. Đây là lỗi số một của người mới.<br>
<b>3.</b> Các lỗi được gom vào một mảng và hiện cùng lúc, thay vì ba hộp alert riêng lẻ. Hộp <span class="badge">alert()</span> chặn cả trang và không tạo kiểu được — đừng bao giờ để nó trong bài nộp.<br>
<b>Nhớ lại bài 1.3:</b> các thuộc tính HTML <span class="badge">required</span> và <span class="badge">minlength</span> đã làm phần lớn việc này rồi. Chỉ viết JavaScript cho những luật mà HTML không diễn đạt được — như "hai mật khẩu phải khớp nhau".</div>

<h3>Uỷ quyền sự kiện — một hàm xử lý cho một danh sách còn mọc thêm</h3>
<pre><span class="tok-comment">// sai: các mục thêm sau không có hàm xử lý nào</span>
document.querySelectorAll(<span class="tok-string">".delete"</span>).forEach(b =&gt;
  b.addEventListener(<span class="tok-string">"click"</span>, remove));

<span class="tok-comment">// đúng: nghe ở phần tử cha, rồi kiểm xem cái gì vừa bị bấm</span>
list.addEventListener(<span class="tok-string">"click"</span>, (e) =&gt; {
  <span class="tok-keyword">const</span> btn = e.target.closest(<span class="tok-string">".delete"</span>);
  <span class="tok-keyword">if</span> (!btn) <span class="tok-keyword">return</span>;
  btn.closest(<span class="tok-string">"li"</span>).remove();
});</pre>
<p>Sự kiện <em>nổi bọt</em> từ phần tử bị bấm lên các phần tử tổ tiên, nên một hàm nghe đặt ở danh sách nhìn thấy mọi cú bấm vào con hiện tại lẫn con sinh ra sau này. Một hàm thay vì hàng trăm — và nó vẫn chạy sau khi bạn thêm mục mới.</p>

<div class="pitfall"><b><span class="badge">addEventListener("click", handler())</span> có dấu ngoặc là gọi hàm ngay lập tức rồi truyền giá trị trả về.</b> Hãy truyền tham chiếu: <span class="badge">handler</span>, không ngoặc. Nếu buộc phải truyền tham số thì bọc lại: <span class="badge">() =&gt; handler(id)</span>. Triệu chứng là hàm chạy đúng một lần lúc tải trang rồi thôi.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Debounce — kỹ thuật làm cho ô tìm kiếm dùng được.</b> Sự kiện <span class="badge">input</span> bắn ra ở mỗi phím gõ; nếu mỗi lần đều gửi một yêu cầu thì gõ "database" là tám yêu cầu. Hãy bọc hàm xử lý để nó chỉ chạy khi người dùng đã ngừng gõ: <span class="badge">let t; input.addEventListener("input", () =&gt; { clearTimeout(t); t = setTimeout(search, 300); });</span>. Bốn dòng, và cắt gần hết lưu lượng. Cùng khuôn đó (throttle) được dùng cho các hàm xử lý cuộn và đổi cỡ màn hình, vốn bắn hàng chục lần mỗi giây. <em>Ngoài giáo trình vì MOOC không bao giờ chạm tới khối lượng đó, còn mọi ô tìm kiếm thật thì có.</em></div>
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
          title: 'A.1 — Modern CSS, frameworks & performance|||A.1 — CSS hiện đại, framework & hiệu năng',
          slug: 'wed201c-nang-cao',
          type: 'VIDEO',
          description: 'Biến CSS, dark mode, container query, chọn framework, và ba chỉ số hiệu năng Google thật sự đo.',
          content: `
<div class="ml-en">
<span class="eyebrow">Advanced · Lesson A.1</span>
<h2>What the MOOC does not reach — modern CSS and the performance budget</h2>
<p class="lead">Accessibility and publishing are covered in lesson 1.4. This is the other half of a professional front end: CSS features newer than the course material, an honest look at frameworks, and the three numbers your site is actually measured on.</p>

<h3>Custom properties — variables that live in the browser</h3>
<pre>:root {
  --brand: hsl(211 100% 52%);
  --text: #1a1a1a;
  --bg: #ffffff;
  --space: 1rem;
}
.btn { background: var(--brand); padding: var(--space); }

@media (prefers-color-scheme: dark) {     <span class="tok-comment">/* dark mode in four lines */</span>
  :root { --text: #f2f2f2; --bg: #16181d; }
}
body { color: var(--text); background: var(--bg); }</pre>
<div class="out"><b>Why these are not Sass variables.</b> A preprocessor variable disappears at build time; a CSS custom property is live in the browser — it inherits, it can be changed per component, and JavaScript can set it: <span class="badge">el.style.setProperty("--brand", "red")</span>. That is how theme switchers and design tokens are built, with no build step at all.</div>

<h3>Container queries — the feature that replaces most breakpoints</h3>
<pre>.sidebar { container-type: inline-size; }

@container (min-width: 400px) {
  .card { display: grid; grid-template-columns: 120px 1fr; }
}</pre>
<p>A media query asks how wide the <em>screen</em> is; a container query asks how wide the <em>parent</em> is. So one card component lays itself out correctly in a narrow sidebar and in a wide main column — without knowing where it was placed. This is what finally makes a component library truly reusable.</p>

<h3>Frameworks — what you gain and what you give up</h3>
<table><thead><tr><th></th><th>Bootstrap</th><th>Tailwind</th><th>Plain CSS</th></tr></thead><tbody>
<tr><td>Speed to a decent look</td><td><b>fastest</b></td><td>fast</td><td>slow</td></tr>
<tr><td>Custom design</td><td>hard (fights the defaults)</td><td><b>easy</b></td><td>total freedom</td></tr>
<tr><td>Result looks generic</td><td>very</td><td>no</td><td>no</td></tr>
<tr><td>What you must learn</td><td>its class names</td><td>its class names</td><td><b>CSS itself</b></td></tr>
</tbody></table>
<p>Both frameworks generate the CSS you already know how to write — which is why WED201c teaches the fundamentals first. Use Bootstrap for an admin dashboard nobody will admire; use Tailwind or plain CSS when the design is the point.</p>

<h3>The three numbers Google measures (Core Web Vitals)</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>LCP — Largest Contentful Paint</b> (target &lt; 2.5 s). When the main image or headline appears. Fix with compressed images, correct <span class="badge">srcset</span>, and <span class="badge">preload</span> for the hero.</div>
  <div class="lz-layer"><b>INP — Interaction to Next Paint</b> (target &lt; 200 ms). How fast the page responds to a click. Fix by doing less JavaScript work in handlers (debounce, lesson 3.4).</div>
  <div class="lz-layer"><b>CLS — Cumulative Layout Shift</b> (target &lt; 0.1). How much the content jumps while loading. Fix with <span class="badge">width</span>/<span class="badge">height</span> on images (lesson 1.2) and reserved space for banners.</div>
</div>
<div class="out"><b>Measure yours in one minute:</b> Chrome DevTools → Lighthouse → Analyze page load. It reports all three plus accessibility and SEO, with the specific elements to fix. Run it on your capstone before submitting — the report reads like a marking rubric.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Every framework you will meet is still HTML, CSS and the DOM.</b> React, Vue and Svelte automate the loop you wrote by hand in lesson 3.3: hold the data, describe what the HTML should look like, and let the library work out which nodes to change. Knowing what they do for you is why WED201c comes before FER202 — and it is why a developer who understands the cascade, the box model and the event loop can pick up any framework in a week, while one who only knows framework syntax is stuck when it behaves unexpectedly. <em>Beyond syllabus because the course ends at plain files, and the next course starts at React.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Nâng cao · Bài A.1</span>
<h2>Thứ MOOC chưa chạm tới — CSS hiện đại và ngân sách hiệu năng</h2>
<p class="lead">Trợ năng và đưa lên mạng đã nằm ở bài 1.4. Đây là nửa còn lại của một front-end chuyên nghiệp: các tính năng CSS mới hơn giáo trình, một cái nhìn thẳng thắn về framework, và ba con số mà trang của bạn thật sự bị đo.</p>

<h3>Biến CSS — biến sống ngay trong trình duyệt</h3>
<pre>:root {
  --brand: hsl(211 100% 52%);
  --text: #1a1a1a;
  --bg: #ffffff;
  --space: 1rem;
}
.btn { background: var(--brand); padding: var(--space); }

@media (prefers-color-scheme: dark) {     <span class="tok-comment">/* chế độ tối trong bốn dòng */</span>
  :root { --text: #f2f2f2; --bg: #16181d; }
}
body { color: var(--text); background: var(--bg); }</pre>
<div class="out"><b>Vì sao chúng không phải biến của Sass.</b> Biến của bộ tiền xử lý biến mất lúc build; biến CSS thì sống trong trình duyệt — nó kế thừa, đổi được theo từng thành phần, và JavaScript đặt được: <span class="badge">el.style.setProperty("--brand", "red")</span>. Đó là cách dựng bộ chuyển giao diện và hệ thống design token, mà không cần bước build nào.</div>

<h3>Container query — tính năng thay thế phần lớn điểm ngắt</h3>
<pre>.sidebar { container-type: inline-size; }

@container (min-width: 400px) {
  .card { display: grid; grid-template-columns: 120px 1fr; }
}</pre>
<p>Media query hỏi <em>màn hình</em> rộng bao nhiêu; container query hỏi <em>phần tử cha</em> rộng bao nhiêu. Nhờ đó một thành phần thẻ tự bố trí đúng cả trong thanh bên hẹp lẫn trong cột chính rộng — mà không cần biết mình được đặt ở đâu. Đây mới là thứ cuối cùng làm một thư viện thành phần thật sự dùng lại được.</p>

<h3>Framework — được gì và mất gì</h3>
<table><thead><tr><th></th><th>Bootstrap</th><th>Tailwind</th><th>CSS thuần</th></tr></thead><tbody>
<tr><td>Tốc độ tới một giao diện coi được</td><td><b>nhanh nhất</b></td><td>nhanh</td><td>chậm</td></tr>
<tr><td>Thiết kế riêng</td><td>khó (phải chống lại mặc định)</td><td><b>dễ</b></td><td>tự do hoàn toàn</td></tr>
<tr><td>Kết quả trông đại trà</td><td>rất</td><td>không</td><td>không</td></tr>
<tr><td>Thứ bạn phải học</td><td>tên class của nó</td><td>tên class của nó</td><td><b>chính CSS</b></td></tr>
</tbody></table>
<p>Cả hai framework đều sinh ra thứ CSS mà bạn đã biết cách tự viết — chính vì thế WED201c dạy phần nền trước. Dùng Bootstrap cho một trang quản trị chẳng ai ngắm; dùng Tailwind hoặc CSS thuần khi thiết kế mới là điểm nhấn.</p>

<h3>Ba con số Google đo (Core Web Vitals)</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>LCP — Largest Contentful Paint</b> (mục tiêu &lt; 2,5 giây). Thời điểm ảnh chính hoặc tiêu đề hiện ra. Chữa bằng nén ảnh, <span class="badge">srcset</span> đúng, và <span class="badge">preload</span> cho ảnh đầu trang.</div>
  <div class="lz-layer"><b>INP — Interaction to Next Paint</b> (mục tiêu &lt; 200 mili-giây). Trang phản hồi một cú bấm nhanh cỡ nào. Chữa bằng cách làm ít việc JavaScript hơn trong hàm xử lý (debounce, bài 3.4).</div>
  <div class="lz-layer"><b>CLS — Cumulative Layout Shift</b> (mục tiêu &lt; 0,1). Nội dung nhảy nhót bao nhiêu trong lúc tải. Chữa bằng <span class="badge">width</span>/<span class="badge">height</span> cho ảnh (bài 1.2) và chừa sẵn chỗ cho banner.</div>
</div>
<div class="out"><b>Đo trang của bạn trong một phút:</b> Chrome DevTools → Lighthouse → Analyze page load. Nó báo cả ba chỉ số cộng điểm trợ năng và SEO, kèm đúng những phần tử cần sửa. Hãy chạy nó trên bài capstone trước khi nộp — bản báo cáo đọc như một bảng chấm điểm.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Mọi framework bạn sẽ gặp rốt cuộc vẫn là HTML, CSS và DOM.</b> React, Vue và Svelte tự động hoá đúng vòng lặp mà bạn viết tay ở bài 3.3: giữ dữ liệu, mô tả HTML nên trông thế nào, rồi để thư viện tự tính xem phải đổi những nút nào. Biết chúng làm hộ mình cái gì là lý do WED201c đứng trước FER202 — và cũng là lý do một lập trình viên hiểu thứ tự tầng, box model và vòng lặp sự kiện có thể nắm bất kỳ framework nào trong một tuần, còn người chỉ thuộc cú pháp framework thì bí ngay khi nó hành xử khác dự đoán. <em>Ngoài giáo trình vì môn học kết thúc ở các tệp thuần, còn môn kế tiếp thì bắt đầu thẳng từ React.</em></div>
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
    {
      "title": "Final Exam|||Thi cuối kỳ",
      "description": "Thi cuối kỳ gồm PE (thi thực hành) và FE (trắc nghiệm). Khung + câu mẫu; đề thật thêm sau khi có trang phòng thi.",
      "lessons": [
        {
          "title": "PE — Practical Exam|||PE — Thi thực hành",
          "slug": "wed201c-final-exam-pe",
          "type": "article",
          "description": "Khung thi thực hành (PE) của môn — format, cách chấm và cách chuẩn bị. Đề thật thêm sau.",
          "content": "\n<div class=\"ml-en\">\n<span class=\"eyebrow\">Final Exam · PE</span>\n<h2>PE — Practical Exam</h2>\n<p class=\"lead\">The Practical Exam (PE) is a <strong>hands-on coding exam</strong>: you are given a problem or feature and must write (and usually run) working code on the machine within a time limit. It is graded on correctness, whether it runs, and good practice.</p>\n<h3>How to prepare</h3>\n<ul>\n<li>Rebuild small features from a blank file, <em>without notes</em> &mdash; copying tutorials is not enough.</li>\n<li>Practise the core pattern of this subject end-to-end until you can do it from memory.</li>\n<li>Read the requirement twice; build the smallest working version first, then extend.</li>\n<li>Test as you go; a program that runs and does 80% beats one that does not compile.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Sample</span> A real practical prompt bank for this subject will be added here later, in the exam room. Use the guidance above to prepare now.</div>\n</div>\n<div class=\"ml-vi\">\n<span class=\"eyebrow\">Thi cuối kỳ · PE</span>\n<h2>PE — Thi thực hành</h2>\n<p class=\"lead\">Thi thực hành (PE) là <strong>thi code trực tiếp</strong>: bạn được giao một bài toán/tính năng và phải viết (thường là chạy) code hoạt động trên máy trong thời gian quy định. Chấm theo tính đúng, có chạy được không, và thực hành tốt.</p>\n<h3>Cách chuẩn bị</h3>\n<ul>\n<li>Dựng lại các tính năng nhỏ từ một file trống, <em>không nhìn ghi chú</em> &mdash; chép tutorial là chưa đủ.</li>\n<li>Luyện mẫu cốt lõi của môn đầu-cuối tới khi làm được từ trí nhớ.</li>\n<li>Đọc yêu cầu hai lần; dựng bản chạy được nhỏ nhất trước, rồi mở rộng.</li>\n<li>Test dọc đường; một chương trình chạy và làm được 80% hơn một chương trình không biên dịch nổi.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Câu mẫu</span> Ngân hàng đề thực hành thật cho môn này sẽ được thêm vào đây sau, trong trang phòng thi. Dùng hướng dẫn trên để chuẩn bị ngay từ giờ.</div>\n</div>"
        },
        {
          "title": "FE — Final Exam (Multiple Choice)|||FE — Thi trắc nghiệm cuối kỳ",
          "slug": "wed201c-final-exam-fe",
          "type": "article",
          "description": "Khung thi trắc nghiệm cuối kỳ (FE) + vài câu mẫu từ môn. Đề thật thêm sau.",
          "content": "\n<div class=\"ml-en\">\n<span class=\"eyebrow\">Final Exam · FE</span>\n<h2>FE — Final Exam (Multiple Choice)</h2>\n<p class=\"lead\">The Final Exam (FE) for this subject is a <strong>computer-graded multiple-choice test</strong>. For the exact number of questions, duration, weight and pass mark, see <em>Lesson 0.2 — Grading</em>.</p>\n<h3>How to do well</h3>\n<ul>\n<li>Pace yourself: divide time by the number of questions; flag hard ones and return at the end.</li>\n<li>Eliminate clearly wrong options first, then choose among the rest.</li>\n<li>For \"what should you do / which is best\" items, answer by this subject's method, not gut feeling.</li>\n<li>Never leave the gated final blank &mdash; an educated guess beats an empty answer.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Sample</span> The questions below are <strong>sample questions</strong> drawn from this course to show the format. The <em>real past-exam questions</em> will be added here later, in the exam room.</div>\n</div>\n<div class=\"ml-vi\">\n<span class=\"eyebrow\">Thi cuối kỳ · FE</span>\n<h2>FE — Thi trắc nghiệm cuối kỳ</h2>\n<p class=\"lead\">Bài thi cuối kỳ (FE) của môn này là <strong>thi trắc nghiệm, máy chấm</strong>. Số câu, thời gian, trọng số và điểm qua cụ thể: xem <em>Bài 0.2 — Thang điểm</em>.</p>\n<h3>Cách làm tốt</h3>\n<ul>\n<li>Phân bổ thời gian: chia đều theo số câu; đánh dấu câu khó, quay lại ở cuối.</li>\n<li>Loại phương án sai rõ ràng trước, rồi chọn trong số còn lại.</li>\n<li>Câu \"nên làm gì / cái nào tốt nhất\" &mdash; trả lời theo phương pháp của môn, không theo cảm tính.</li>\n<li>Đừng bao giờ bỏ trống bài thi có cổng &mdash; đoán có suy luận vẫn hơn để trống.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Câu mẫu</span> Các câu dưới đây là <strong>câu mẫu</strong> lấy từ chính môn học để minh hoạ format. <em>Đề thi thật</em> sẽ được thêm vào đây sau, trong trang phòng thi.</div>\n</div>",
          "quiz": {
            "timeLimitSeconds": 360,
            "questions": [
              {
                "id": "q1",
                "points": 1,
                "question": "HTML is responsible for a page's…|||HTML chịu trách nhiệm về … của trang",
                "options": [
                  "style|||kiểu dáng",
                  "structure/content|||cấu trúc/nội dung",
                  "animation|||hoạt ảnh",
                  "server|||máy chủ"
                ],
                "correctIndex": 1
              },
              {
                "id": "q2",
                "points": 1,
                "question": "A CSS class selector is written as…|||Bộ chọn class trong CSS viết là…",
                "options": [
                  "#name",
                  ".name",
                  "name()",
                  "@name"
                ],
                "correctIndex": 1
              },
              {
                "id": "q3",
                "points": 1,
                "question": "box-sizing: border-box makes width…|||box-sizing: border-box khiến width…",
                "options": [
                  "exclude padding and border|||không gồm padding và border",
                  "include padding and border|||gồm cả padding và border",
                  "become zero|||thành 0",
                  "ignore content|||bỏ qua content"
                ],
                "correctIndex": 1
              },
              {
                "id": "q4",
                "points": 1,
                "question": "To run code when a button is clicked you use…|||Để chạy code khi bấm nút bạn dùng…",
                "options": [
                  "a CSS selector|||một bộ chọn CSS",
                  "addEventListener(\"click\", …)",
                  "a semantic tag|||một thẻ ngữ nghĩa",
                  "the box model|||box model"
                ],
                "correctIndex": 1
              },
              {
                "id": "q5",
                "points": 1,
                "question": "Flexbox is best for … layouts and Grid for … layouts.|||Flexbox tốt cho bố cục … và Grid cho bố cục …",
                "options": [
                  "two-dimensional / one-dimensional|||hai chiều / một chiều",
                  "one-dimensional / two-dimensional|||một chiều / hai chiều",
                  "both the same|||cả hai như nhau",
                  "neither|||không cái nào"
                ],
                "correctIndex": 1
              },
              {
                "id": "q6",
                "points": 1,
                "question": "Media queries let you…|||Media query cho phép bạn…",
                "options": [
                  "play audio|||phát âm thanh",
                  "apply different CSS at different screen widths|||áp CSS khác nhau ở các bề rộng màn hình khác nhau",
                  "query a database|||truy vấn database",
                  "add JavaScript|||thêm JavaScript"
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
