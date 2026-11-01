/**
 * Web Foundations — Chương 14: Đưa sản phẩm lên mạng (build, biến môi trường,
 * deploy, đo hiệu năng). Song ngữ EN/VI.
 * ⚠️ KHÔNG backtick trần trong content (dùng &#96;); `${` trong code escape thành \${.
 */

import { gallery } from './_slides.mjs';
import L144 from './s14/wf-14-4-performance.mjs';
import L143 from './s14/wf-14-3-deploy.mjs';
import L142 from './s14/wf-14-2-env-secrets.mjs';
import L141 from './s14/wf-14-1-build.mjs';

export default {
  title: 'Chapter 14 — Shipping it|||Chương 14 — Đưa sản phẩm lên mạng',
  description: 'Mã chạy trên máy bạn chưa phải là sản phẩm. Chương này đi hết quãng còn lại: dựng bản production, quản lý biến môi trường và khoá bí mật, đưa lên hosting với tên miền và HTTPS, rồi đo xem nó có thật sự nhanh không.',
  lessons: [
    /* ─────────────────── 14.0 slide bài giảng ─────────────────── */
    {
      title: '14.0 — Shipping it in 12 slides|||14.0 — Đưa lên mạng trong 12 slide',
      slug: 'wf-14-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Build, biến môi trường, deploy và đo hiệu năng — 12 slide.',
      content: `
<div class="ml-en"><h2>📑 Shipping it in 12 slides</h2>
<p>Slide 5 is the one to read twice: a key in a frontend variable ships to every visitor.</p>
<p>Skim before the chapter to see what is coming, then come back afterwards to revise. If a slide still does not make sense, the lesson that teaches it is right below.</p></div>
<div class="ml-vi"><h2>📑 Đưa lên mạng trong 12 slide</h2>
<p>Slide 5 nên đọc hai lần: một cái khoá để trong biến frontend là đi tới mọi khách truy cập.</p>
<p>Lướt trước khi học chương để biết sắp học gì, rồi quay lại ôn sau. Slide nào còn chưa hiểu thì bài dạy nó nằm ngay bên dưới.</p></div>
${gallery('wf-ship', [
  [1, "Bìa"],
  [2, "Nội dung chương"],
  [3, "Dev server và bản build là HAI chương trình"],
  [4, "Đọc kết quả build"],
  [5, "Biến môi trường — chỗ gây sự cố thật ⭐⭐"],
  [6, "Đổi biến frontend thì phải DỰNG LẠI"],
  [7, "Nếu lỡ lộ khoá"],
  [8, "Deploy — chọn thứ đơn giản nhất"],
  [9, "Bẫy 404 khi tải lại trang ⭐"],
  [10, "Danh sách kiểm trước khi coi là xong"],
  [11, "Đo hiệu năng — Core Web Vitals"],
  [12, "Bốn cách sửa đáng làm trước"],
])}
`,
    },

    L141,

    L142,

    L143,

    L144,

    {
      title: '14.5 — Chapter 14 quiz|||14.5 — Kiểm tra chương 14',
      slug: 'wf-14-5-quiz',
      type: 'QUIZ',
      description: 'Sáu câu về build, biến môi trường, deploy SPA và đo hiệu năng.',
      content: `
<div class="ml-en"><p class="lead">Six questions on builds, environment variables, deploying a single-page app, and measuring performance.</p>
<h3>The chapter in four points</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">Frontend env vars are public</span><span class="lz-t">baked into the bundle at build time</span><span class="lz-d">A key in REACT_APP_* ships to every visitor. Secrets belong on the server, behind a proxy route.</span></div>
<div class="lz-node"><span class="lz-k">Changing them needs a rebuild</span><span class="lz-t">a restart is not enough</span><span class="lz-d">Backend variables are the opposite — read at process start, so restarting does the job.</span></div>
<div class="lz-node"><span class="lz-k">SPAs 404 on reload</span><span class="lz-t">until the host rewrites to index.html</span><span class="lz-d">Clicking a link never asks the server; reloading does, and the path is not a real file.</span></div>
<div class="lz-node"><span class="lz-k">Measure before optimising</span><span class="lz-t">Network tab sorted by Size</span><span class="lz-d">The biggest row is usually the whole problem. Guessing costs days and changes nothing.</span></div>
</div></div>
<div class="ml-vi"><p class="lead">Sáu câu về bản dựng, biến môi trường, deploy ứng dụng một trang và đo hiệu năng.</p>
<h3>Cả chương trong bốn ý</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">Biến env của frontend là CÔNG KHAI</span><span class="lz-t">nướng vào bundle lúc build</span><span class="lz-d">Một khoá trong REACT_APP_* đi tới mọi khách truy cập. Khoá bí mật thuộc về máy chủ, sau một route proxy.</span></div>
<div class="lz-node"><span class="lz-k">Đổi chúng thì phải DỰNG LẠI</span><span class="lz-t">khởi động lại là không đủ</span><span class="lz-d">Biến của backend thì ngược lại — đọc lúc tiến trình khởi động, nên restart là xong.</span></div>
<div class="lz-node"><span class="lz-k">SPA trả 404 khi tải lại</span><span class="lz-t">tới khi hosting rewrite về index.html</span><span class="lz-d">Bấm link thì không hỏi máy chủ; tải lại thì có, mà đường dẫn đó không phải file thật.</span></div>
<div class="lz-node"><span class="lz-k">Đo trước khi tối ưu</span><span class="lz-t">tab Network, sắp theo Size</span><span class="lz-d">Dòng to nhất thường là toàn bộ vấn đề. Ngồi đoán thì tốn ngày mà không đổi gì.</span></div>
</div></div>
`,
      quiz: {
        timeLimitSeconds: 480,
        questions: [
          {
            question: 'Where is it safe to keep a third-party API key?|||Để khoá API của bên thứ ba ở đâu là an toàn?',
            options: [
              'On the server, behind a backend route that forwards the request|||Trên máy chủ, sau một route backend chuyển tiếp yêu cầu',
              'In a REACT_APP_ variable|||Trong một biến REACT_APP_',
              'In a comment in the source|||Trong một dòng chú thích ở mã nguồn',
              'In localStorage|||Trong localStorage',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You change REACT_APP_API_URL and restart the server, but nothing changes. Why?|||Bạn đổi REACT_APP_API_URL rồi khởi động lại server mà không thấy gì đổi. Vì sao?',
            options: [
              'Frontend variables are baked in at build time — you must rebuild|||Biến frontend được nướng vào lúc BUILD — phải dựng lại',
              'The variable name is wrong|||Tên biến bị sai',
              'Environment variables do not work in React|||React không dùng được biến môi trường',
              'You need to clear localStorage|||Phải xoá localStorage',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Your SPA works when clicking links, but reloading /pizzas gives 404. The fix?|||SPA của bạn chạy khi bấm link, nhưng tải lại /pizzas thì 404. Cách chữa?',
            options: [
              'Tell the host to serve index.html for unknown paths|||Bảo hosting trả index.html cho mọi đường dẫn lạ',
              'Add a pizzas.html file|||Thêm một file pizzas.html',
              'Switch from React Router to links|||Bỏ React Router, dùng thẻ a thường',
              'Disable HTTPS|||Tắt HTTPS',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What does the hash in main.a80b38e9.js allow?|||Mã băm trong main.a80b38e9.js cho phép điều gì?',
            options: [
              'Caching that file forever, while new code gets a new name|||Lưu đệm file đó vĩnh viễn, còn mã mới thì có tên mới',
              'Encrypting the source code|||Mã hoá mã nguồn',
              'Making the file smaller|||Làm file nhỏ đi',
              'Preventing others from reading it|||Ngăn người khác đọc được nó',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A page feels slow. What do you open FIRST?|||Một trang thấy chậm. Bạn mở cái gì TRƯỚC?',
            options: [
              'The Network tab, sorted by Size|||Tab Network, sắp xếp theo Size',
              'The source code of the slowest component|||Mã nguồn của component chậm nhất',
              'A rewrite in a faster framework|||Một bản viết lại bằng framework nhanh hơn',
              'The database|||Cơ sở dữ liệu',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which metric measures things jumping around while the page loads?|||Chỉ số nào đo việc mọi thứ nhảy nhót trong lúc trang tải?',
            options: ['CLS|||CLS', 'LCP|||LCP', 'INP|||INP', 'TTFB|||TTFB'],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
