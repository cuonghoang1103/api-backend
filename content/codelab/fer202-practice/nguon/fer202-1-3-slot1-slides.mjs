/**
 * FER202 · 1.3 — Slide check: Slot 1 (React, JSX, Virtual DOM, React 18, công cụ, Node/npm, Git). Trắc nghiệm.
 */
import { doiDau, KHOA, lc, tinh } from './_chung.mjs';

const q = (ma, de, luaChon, dapAn, giaiThich, nhieu) => ({ ma, de, luaChon: lc(...luaChon), dapAn, giaiThich, ...(nhieu ? { nhieu: true } : {}) });

export default doiDau({
  slug: 'fer202-1-3-slot1-slides',
  ten: '1.3 Slide check — Slot 1',
  khoa: KHOA,
  baiHoc: 'fer202-1-3-slot1-slides',
  de: [
    tinh({
      tieuDe: 'Slide check: React, tools, Node/npm and Git',
      doKho: 'EASY', phut: 12,
      khaiNiem: ['view layer', 'JSX', 'Virtual DOM', 'React 18', 'Node', 'npm', 'Git'], the: ['react', 'tools', 'quiz'],
      moTa: {
        en: '<p>Ten questions covering the 34 slides of Slot 1: what React is, JSX, the Virtual DOM, React 18, the development tools (VS Code, Node, React DevTools), Node and npm with <code>package.json</code>, and Git.</p>',
        vi: '<p>Mười câu phủ 34 slide của Slot 1: React là gì, JSX, Virtual DOM, React 18, công cụ phát triển (VS Code, Node, React DevTools), Node và npm với <code>package.json</code>, và Git.</p>',
      },
      goiY: ['JSX được biên dịch thành lời gọi hàm tạo phần tử React.', 'Git phân tán: mỗi máy có đủ lịch sử.'],
      loiHayGap: ['Nghĩ trình duyệt hiểu JSX trực tiếp.', 'Nhầm Git với GitHub.'],
      giaiThich: '<p>Xem giải thích từng câu sau khi nộp.</p>',
      thuatNgu: [{ en: 'transpile', vi: 'dịch mã sang dạng khác cùng mức (JSX → JS)' }],
      cauHoi: [
        q('q1', 'React handles which part of an MVC-style app?', [['a', 'Model'], ['b', 'View'], ['c', 'Controller'], ['d', 'Database']], ['b'], 'React is "the V in MVC".|||React là "chữ V trong MVC".'),
        q('q2', 'Browsers run JSX…', [['a', 'directly'], ['b', 'only after a build tool (Babel/SWC/esbuild) transforms it into JavaScript'], ['c', 'only in Chrome'], ['d', 'never; JSX is server-only']], ['b'], 'Vite/CRA run that transform for you.|||Vite/CRA làm việc biến đổi đó giúp bạn.'),
        q('q3', 'React 18 introduced… (choose all)', [['a', 'createRoot'], ['b', 'automatic batching of state updates'], ['c', 'concurrent features like transitions'], ['d', 'class components']], [['a', 'b', 'c']], 'Class components existed long before.|||Class component có từ lâu trước đó.', true),
        q('q4', 'React Developer Tools let you…', [['a', 'inspect the component tree, props and state in the browser'], ['b', 'deploy the app'], ['c', 'write CSS'], ['d', 'manage Git']], ['a'], 'Install it as a browser extension.|||Cài như tiện ích trình duyệt.'),
        q('q5', 'Node.js is…', [['a', 'a browser'], ['b', 'a JavaScript runtime outside the browser (V8 engine), used for tooling and servers'], ['c', 'a React plugin'], ['d', 'a database']], ['b'], 'Build tools like Vite run on Node.|||Công cụ build như Vite chạy trên Node.'),
        q('q6', 'Which file lists a project\'s dependencies and scripts?', [['a', 'index.html'], ['b', 'package.json'], ['c', '.gitignore'], ['d', 'README.md']], ['b'], 'package-lock.json pins exact versions.|||package-lock.json chốt phiên bản chính xác.'),
        q('q7', 'Why is node_modules in .gitignore?', [['a', 'It is secret'], ['b', 'It is huge and can be rebuilt with npm install from package.json'], ['c', 'Git cannot store JavaScript'], ['d', 'It is optional']], ['b'], 'Commit package.json and the lock file instead.|||Thay vào đó commit package.json và tệp lock.'),
        q('q8', 'Git is ___, GitHub is ___.', [['a', 'a website / a version control tool'], ['b', 'a distributed version control system / a hosting service for Git repositories'], ['c', 'the same thing'], ['d', 'a language / a library']], ['b'], 'GitLab and Bitbucket also host Git repos.|||GitLab, Bitbucket cũng lưu repo Git.'),
        q('q9', 'What does a commit record?', [['a', 'Only the file names'], ['b', 'A snapshot of the staged changes with author, time and message'], ['c', 'The whole computer'], ['d', 'Only the last line changed']], ['b'], 'History is a chain of commits.|||Lịch sử là chuỗi các commit.'),
        q('q10', 'A component name in JSX must start with…', [['a', 'a lowercase letter'], ['b', 'an uppercase letter'], ['c', 'an underscore'], ['d', 'a number']], ['b'], 'Lowercase tags are treated as HTML elements.|||Thẻ chữ thường được coi là thẻ HTML.'),
      ],
    }),
  ],
});
