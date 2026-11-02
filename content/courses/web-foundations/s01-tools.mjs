/**
 * Web Foundations — Chương 1: Bộ công cụ (terminal, VS Code, Git, GitHub, Node & npm).
 * Song ngữ EN/VI (.ml-en / .ml-vi, số khối bằng nhau). ⚠️ KHÔNG backtick trần
 * trong content (dùng &#96;); `${` trong code escape thành \${. Quiz có field content.
 */

import { gallery, galleryGiang } from './_slides.mjs';
import L15 from './s01/wf-1-5-node-npm.mjs';
import L13 from './s01/wf-1-3-git.mjs';
import L11 from './s01/wf-1-1-terminal.mjs';
import { onTapBai } from './_on-tap/index.mjs';
import L14 from './s01/wf-1-4-github.mjs';
import L12 from './s01/wf-1-2-vscode.mjs';

export default {
  title: 'Chapter 1 — Your toolbox: terminal, VS Code, Git, npm|||Chương 1 — Bộ công cụ: terminal, VS Code, Git, npm',
  description: 'Dùng thành thạo bốn công cụ nền: dòng lệnh, trình soạn thảo, quản lý phiên bản, và trình chạy JavaScript cùng npm. Đây là những thứ bạn gõ mỗi ngày trong mọi khoá sau.',
  lessons: [
    /* ─────────────────── 1.0 slide bài giảng ─────────────────── */
    {
      title: '1.0 — Lecture slides: the toolbox in 13 slides|||1.0 — Slide bài giảng: bộ công cụ trong 13 slide',
      slug: 'wf-1-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Terminal, VS Code, Git, GitHub, Node & npm — gom mọi lệnh cần thuộc vào một chỗ tra nhanh.',
      content: `
<div class="ml-en"><h2>📑 Lecture slides: the toolbox in 13 slides</h2>
<p>Use this as a cheat sheet. The terminal and git slides are the ones you will come back to most.</p>
<p>Two ways to use it: skim before the chapter to see what is coming, then come back afterwards to revise. If a slide still does not make sense, the lesson that teaches it is right below.</p></div>
<div class="ml-vi"><h2>📑 Slide bài giảng: bộ công cụ trong 13 slide</h2>
<p>Dùng như một tờ tra nhanh. Slide terminal và git là hai cái bạn sẽ quay lại nhiều nhất.</p>
<p>Hai cách dùng: lướt trước khi học chương để biết sắp học gì, rồi quay lại ôn sau. Slide nào còn chưa hiểu thì bài dạy nó nằm ngay bên dưới.</p></div>
${galleryGiang('wf-tools', [
  [1, "Bìa"],
  [2, "Nội dung chương"],
  [3, "Terminal — mười lệnh đủ dùng"],
  [4, "Hai mẹo tiết kiệm nửa thời gian gõ"],
  [5, "VS Code — bốn tiện ích nên cài"],
  [6, "Phím tắt VS Code đáng thuộc"],
  [7, "Git — ba vùng phải hiểu"],
  [8, "Git — bốn lệnh gỡ khi lỡ tay"],
  [9, ".gitignore — làm trước lần add đầu"],
  [10, "GitHub — đẩy mã lên lần đầu"],
  [11, "Node & npm ⭐"],
  [12, "Ba file quyết định mọi thứ"],
  [13, "Tự luyện"],
])}
`,
    },

    /* ─────────────────────────── 1.1 ─────────────────────────── */
    L11,

    /* ─────────────────────────── 1.2 ─────────────────────────── */
    L12,

    /* ─────────────────────────── 1.3 ─────────────────────────── */
    L13,

    /* ─────────────────────────── 1.4 ─────────────────────────── */
    L14,

    /* ─────────────────────────── 1.5 ─────────────────────────── */
    L15,

    /* ─────────────────────────── 1.6 quiz ─────────────────────────── */
    {
      title: '1.6 — Chapter 1 quiz|||1.6 — Kiểm tra chương 1',
      slug: 'wf-1-6-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về terminal, đường dẫn, VS Code, Git, GitHub và npm.',
      content: `
<div class="ml-en"><p class="lead">Ten questions on Chapter 1: terminal navigation, absolute vs relative paths, VS Code, the Git snapshot model, GitHub remotes, and npm/package.json.</p>
<p class="note-ct"><strong>Now practice by doing.</strong> These tools stick only through repetition. Drill real terminal and Git commands on Code Lab until they are muscle memory.</p>
<h3>The chapter in four points</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">Paths</span><span class="lz-t">Absolute vs relative</span><span class="lz-d">A relative path is meaningless without <code>pwd</code>. The same idea returns in <code>import './x.js'</code> and in every <code>src=""</code>.</span></div>
<div class="lz-node"><span class="lz-k">The editor</span><span class="lz-t">Search and rename, not scrolling</span><span class="lz-d">Ctrl/Cmd+P to reach a file, Shift+F to search the project, F2 to rename a symbol everywhere at once.</span></div>
<div class="lz-node"><span class="lz-k">Git</span><span class="lz-t">Three places, one command to see them</span><span class="lz-d">Working directory → staging → repository. <code>git status</code> tells you where everything is; run it constantly.</span></div>
<div class="lz-node"><span class="lz-k">npm</span><span class="lz-t">Two files, one folder</span><span class="lz-d"><code>package.json</code> declares, <code>package-lock.json</code> pins, <code>node_modules</code> is disposable. Commit the first two, never the third.</span></div>
</div>
<p class="note-ct"><strong>If a question stumps you</strong>, do not guess — open a terminal and run the command. Every answer in this quiz can be checked in under a minute on your own machine, and checking it is worth more than the point.</p>
<div class="link-card"><a href="/code-lab/web-foundations-practice?bai=wf-1-0-slides&khoa=web-foundations">Practice on Code Lab → Chapter 1 practice set (30 auto-graded exercises)</a></div>
<div class="link-card"><a href="/code-lab/git">Practice on Code Lab → Git track</a></div>
<div class="link-card"><a href="/code-lab/linux-bash">Practice on Code Lab → Linux &amp; Bash (terminal) track</a></div></div>
<div class="ml-vi"><p class="lead">Mười câu cho Chương 1: di chuyển terminal, đường dẫn tuyệt đối vs tương đối, VS Code, mô hình ảnh chụp của Git, remote GitHub, và npm/package.json.</p>
<p class="note-ct"><strong>Giờ luyện bằng cách làm.</strong> Mấy công cụ này chỉ thấm qua lặp lại. Hãy luyện lệnh terminal và Git thật ở Code Lab tới khi thành phản xạ.</p>
<h3>Cả chương trong bốn ý</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">Đường dẫn</span><span class="lz-t">Tuyệt đối với tương đối</span><span class="lz-d">Một đường dẫn tương đối là vô nghĩa nếu không có <code>pwd</code>. Cùng ý đó quay lại trong <code>import './x.js'</code> và trong mọi <code>src=""</code>.</span></div>
<div class="lz-node"><span class="lz-k">Trình soạn thảo</span><span class="lz-t">Tìm và đổi tên, đừng cuộn</span><span class="lz-d">Ctrl/Cmd+P để tới một file, Shift+F để tìm khắp dự án, F2 để đổi tên một ký hiệu ở mọi nơi một lượt.</span></div>
<div class="lz-node"><span class="lz-k">Git</span><span class="lz-t">Ba chỗ, một lệnh để nhìn cả ba</span><span class="lz-d">Thư mục làm việc → vùng chờ → kho. <code>git status</code> cho biết mọi thứ đang ở đâu; hãy chạy nó liên tục.</span></div>
<div class="lz-node"><span class="lz-k">npm</span><span class="lz-t">Hai file, một thư mục</span><span class="lz-d"><code>package.json</code> khai báo, <code>package-lock.json</code> ghim, <code>node_modules</code> vứt đi được. Commit hai cái đầu, đừng bao giờ commit cái thứ ba.</span></div>
</div>
<p class="note-ct"><strong>Nếu một câu làm bạn bí</strong>, đừng đoán — hãy mở terminal và chạy thử cái lệnh đó. Mọi đáp án trong bài kiểm tra này đều kiểm được dưới một phút trên chính máy bạn, và việc kiểm ấy đáng giá hơn cái điểm.</p>
<div class="link-card"><a href="/code-lab/web-foundations-practice?bai=wf-1-0-slides&khoa=web-foundations">Luyện tập ở Code Lab → bộ đề Chương 1 (30 bài, máy chấm tự động)</a></div>
<div class="link-card"><a href="/code-lab/git">Luyện tập ở Code Lab → track Git</a></div>
<div class="link-card"><a href="/code-lab/linux-bash">Luyện tập ở Code Lab → track Linux &amp; Bash (terminal)</a></div></div>
${onTapBai('wf-1-6-quiz')}
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Which command prints the folder you are currently in?|||Lệnh nào in ra thư mục bạn đang đứng?',
            options: ['pwd|||pwd', 'ls|||ls', 'cd|||cd', 'clear|||clear'],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'In a path, what does ../ mean?|||Trong một đường dẫn, ../ nghĩa là gì?',
            options: [
              'Go up one folder from where you are|||Lùi lên một thư mục so với chỗ bạn đứng',
              'The root of the disk|||Gốc của ổ đĩa',
              'The current folder|||Thư mục hiện tại',
              'Your home folder|||Thư mục nhà của bạn',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which is an ABSOLUTE path?|||Cái nào là đường dẫn TUYỆT ĐỐI?',
            options: [
              '/Users/binh/site/index.html|||/Users/binh/site/index.html',
              './src/app.js|||./src/app.js',
              '../images/logo.png|||../images/logo.png',
              'index.html|||index.html',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'The recommended way to work in VS Code is to…|||Cách làm việc được khuyến nghị trong VS Code là…',
            options: [
              'Open the whole project folder, not single files|||Mở cả thư mục dự án, không phải file lẻ',
              'Open one file at a time from the Desktop|||Mở từng file một từ Desktop',
              'Never use the integrated terminal|||Không bao giờ dùng terminal tích hợp',
              'Disable all extensions|||Tắt mọi extension',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'In Git, what does "git add" do?|||Trong Git, "git add" làm gì?',
            options: [
              'Stages changes for the next commit|||Đưa các thay đổi vào vùng stage cho commit kế tiếp',
              'Uploads commits to GitHub|||Tải commit lên GitHub',
              'Creates a new repository|||Tạo một repository mới',
              'Permanently deletes a file|||Xoá vĩnh viễn một file',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which command takes a snapshot with a message?|||Lệnh nào chụp một ảnh kèm thông điệp?',
            options: [
              'git commit -m "message"|||git commit -m "thông điệp"',
              'git status|||git status',
              'git add .|||git add .',
              'git log|||git log',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What is a "remote" named origin?|||"remote" tên origin là gì?',
            options: [
              'A copy of your repo hosted elsewhere, e.g. on GitHub|||Một bản sao repo của bạn lưu ở nơi khác, vd trên GitHub',
              'The main branch of your project|||Nhánh chính của dự án',
              'A deleted commit|||Một commit đã bị xoá',
              'A VS Code extension|||Một extension của VS Code',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which file should you NOT commit to Git?|||File nào bạn KHÔNG nên commit vào Git?',
            options: [
              'node_modules/ (installed libraries)|||node_modules/ (thư viện đã cài)',
              'package.json|||package.json',
              'index.html|||index.html',
              'README.md|||README.md',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What is the difference between dependencies and devDependencies?|||Khác biệt giữa dependencies và devDependencies là gì?',
            options: [
              'dependencies are needed at runtime; devDependencies only while developing|||dependencies cần lúc chạy; devDependencies chỉ khi phát triển',
              'They are identical|||Chúng y hệt nhau',
              'devDependencies run in the browser only|||devDependencies chỉ chạy trong trình duyệt',
              'dependencies are never installed|||dependencies không bao giờ được cài',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You run "npm run dev". Where is "dev" defined?|||Bạn chạy "npm run dev". "dev" được định nghĩa ở đâu?',
            options: [
              'In the "scripts" section of package.json|||Trong mục "scripts" của package.json',
              'Inside node_modules|||Bên trong node_modules',
              'In the .gitignore file|||Trong file .gitignore',
              'It is a built-in Node command|||Đó là một lệnh có sẵn của Node',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
