/**
 * Deep Dives — các chủ đề hướng dẫn dài trên trang chủ.
 *
 * ─── CÁCH HOẠT ĐỘNG ─────────────────────────────────────────────────────────
 * Mỗi thẻ có MỘT trong hai kiểu đích, và đó là chủ ý:
 *
 *   `article: '<slug>'`  → bài viết dài đã soạn, mở `/tech-trends/<slug>`.
 *                           Bài nằm trong hệ TechTrendArticle (bodyMdx +
 *                           bodyHtml), nên được SSR, JSON-LD, RSS và bình luận
 *                           miễn phí. KHÔNG viết trang Next riêng cho từng bài.
 *
 *   `href: '/...'`       → chủ đề này site ĐÃ dạy sâu ở nơi khác (Code Lab,
 *                           Academy, khoá học, Xưởng mô phỏng). Dẫn thẳng vào đó
 *                           thay vì viết lại — viết lại là làm hai lần một việc,
 *                           và về sau hai bản chắc chắn lệch nhau.
 *
 * ⚠️ ĐỪNG đặt `article` cho slug chưa tồn tại trong DB. Thẻ sẽ thành link chết.
 *    Soạn bài xong (seeder ở `scripts/deepdive-seed.mjs`), publish, RỒI mới đổi
 *    `href` thành `article` ở đây.
 *
 * `logo` khớp tên file trong `frontend/public/logos/<logo>.svg` — SVG tự phục
 * vụ, vì CSP của site đặt `img-src 'self' data:` nên ảnh CDN ngoài bị chặn.
 * Xem `public/logos/README.md` về giấy phép.
 */
export interface DeepDive {
  logo: string;
  title: string;
  blurb: string;
  /** Slug bài viết dài trong hệ tech-trends. Ưu tiên hơn `href`. */
  article?: string;
  /** Đích thay thế khi chủ đề đã được dạy sâu ở nơi khác trên site. */
  href?: string;
  /** Nhãn nhỏ cho biết thẻ dẫn đi đâu — để người đọc không bị bất ngờ. */
  via?: string;
}

export const DEEP_DIVES: DeepDive[] = [
  {
    logo: 'terminal',
    title: 'How to Use the Command Line in Linux and macOS',
    blurb: 'Navigate, move files, edit text and chain commands — from zero.',
    article: 'how-to-use-the-command-line-in-linux-and-macos',
  },
  {
    logo: 'javascript',
    title: 'The Event Loop, Callbacks, Promises and Async/Await',
    blurb: 'Why JavaScript never blocks, and where your await actually goes.',
    article: 'the-event-loop-callbacks-promises-and-async-await',
  },
  {
    logo: 'nodedotjs',
    title: 'Node.js From Zero to Production',
    blurb: '19 chapters: runtime, HTTP, PostgreSQL, auth, queues, observability.',
    href: '/courses',
    via: 'Full course · 112 lessons',
  },
  {
    logo: 'graphql',
    title: 'An Introduction to GraphQL',
    blurb: 'Schemas, resolvers and why it is not a REST replacement.',
    article: 'an-introduction-to-graphql',
  },
  {
    logo: 'react',
    title: 'How to Structure and Organize a React Application',
    blurb: 'Folders, state boundaries and the seams that survive a rewrite.',
    href: '/code-lab',
    via: 'Graded exercises in Code Lab',
  },
  {
    logo: 'css',
    title: 'A Complete Guide to CSS Concepts and Fundamentals',
    blurb: 'The box model, cascade, specificity, flex and grid — properly.',
    href: '/code-lab',
    via: 'Graded exercises in Code Lab',
  },
  {
    logo: 'redux',
    title: 'How to Use Redux and React',
    blurb: 'Store, actions, reducers — and when you genuinely need them.',
    href: '/code-lab',
    via: 'Graded exercises in Code Lab',
  },
  {
    logo: 'vuedotjs',
    title: 'How to Use Vue, the JavaScript Framework',
    blurb: 'Reactivity, components and the single-file component model.',
    href: '/code-lab',
    via: 'Graded exercises in Code Lab',
  },
  {
    logo: 'webpack',
    title: 'How to Set Up webpack From Scratch',
    blurb: 'Entry, output, loaders, plugins — a bundler you can reason about.',
    article: 'how-to-set-up-webpack-from-scratch',
  },
  {
    logo: 'gnubash',
    title: 'Shell Scripting for People Who Deploy Things',
    blurb: 'set -euo pipefail, traps, and why your script eats its own errors.',
    href: '/exp-hub',
    via: 'Snippets in Exp Hub',
  },
  {
    logo: 'apple',
    title: 'How to Set up a Mac for Development',
    blurb: 'Shell, Homebrew, Node, Docker, keys — a machine ready to work.',
    href: '/exp-hub',
    via: 'Setup guides in Exp Hub',
  },
  {
    logo: 'linux',
    title: 'Reading Production: Logs, Metrics and a Calm Head',
    blurb: 'What to look at first when the thing you shipped is on fire.',
    href: '/exam',
    via: 'Practical exam · PE-10',
  },
];
