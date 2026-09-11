/**
 * FER202 · Advanced section (A3) addition — Introduction to Next.js & Tailwind
 * CSS (Slot 20, 17 slides). Grounded slide-by-slide in
 * Slot20_Introduct_NextJS_TailwindCSS.pptx. Spliced into the "Advanced A3 —
 * TypeScript & Next.js" section before its quiz; existing a3-1 lesson untouched.
 * This is the last FER202 deck — every Slot 1–20 slide is now on the site.
 */
import { walk, walkHead, bi, books } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202';
const EXPHUB = `/exp-hub${REF}`;

const SLIDES = {
  title: 'A3.2 — Slide by slide: Next.js & Tailwind CSS (Slot 20)|||A3.2 — Học theo từng slide: Next.js & Tailwind CSS (Slot 20)',
  slug: 'fer202-a3-2-slot20-nextjs-tailwind-slides',
  type: 'DOCUMENT',
  description: 'Toàn bộ 17 slide Slot 20: Next.js là gì (SSR/SSG, file-system routing, App Router, create-next-app, scripts), và Tailwind CSS là gì (utility-first, so với Bootstrap, cài & cấu hình với React) — kèm code.',
  content: [
    bi(
      `<span class="eyebrow">Advanced A3 · Lesson A3.2 · Slot 20 deck (17 slides)</span>
<h2>Next.js &amp; Tailwind CSS, slide by slide</h2>
<p class="lead">The final deck looks beyond plain React: <strong>Next.js</strong> (a React framework adding server-side rendering, static generation and file-system routing) and <strong>Tailwind CSS</strong> (a utility-first styling approach). This completes the course — every Slot 1–20 slide is now explained on this site.</p>`,
      `<span class="eyebrow">Nâng cao A3 · Bài A3.2 · Bộ slide Slot 20 (17 slide)</span>
<h2>Next.js &amp; Tailwind CSS, theo từng slide</h2>
<p class="lead">Bộ slide cuối nhìn xa hơn React thuần: <strong>Next.js</strong> (một framework React thêm server-side rendering, static generation và file-system routing) và <strong>Tailwind CSS</strong> (cách tạo kiểu utility-first). Đây là chặng khép lại môn — mọi slide Slot 1–20 giờ đã được giải thích trên trang.</p>`,
    ),
    walkHead('slot20', 1, 17),
    walk('slot20', [
      [1, 'Introducing Next.js and Tailwind CSS', `<p>Title slide.</p>`, `<p>Slide bìa.</p>`],
      [2, 'Objectives', `<p>What Next.js is (install, config, run) and what Tailwind CSS is (install, config, run).</p>`, `<p>Next.js là gì (cài, cấu hình, chạy) và Tailwind CSS là gì (cài, cấu hình, chạy).</p>`],
      [3, 'What is Next.js?', `<p>An open-source <strong>React framework</strong> for web apps with <strong>server-side rendering</strong> and <strong>static site generation</strong>. Released by Vercel in 2016 (Google contributing from 2019). It "completes React" with: SSR, SSG, image optimization and built-in routing.</p>`, `<p>Một <strong>framework React</strong> mã nguồn mở cho web app với <strong>server-side rendering</strong> và <strong>static site generation</strong>. Vercel phát hành 2016 (Google đóng góp từ 2019). Nó "hoàn thiện React" với: SSR, SSG, tối ưu ảnh và routing dựng sẵn.</p>`],
      [4, 'History & features', `<p>Next.js's main advantage is <strong>server-side rendering out of the box</strong>: your app is rendered on the server before reaching the client, giving faster initial loads and better <strong>SEO</strong> — the two things a client-only React SPA struggles with.</p>`, `<p>Lợi thế chính của Next.js là <strong>server-side rendering sẵn có</strong>: app được render trên server trước khi tới client, cho tải đầu nhanh hơn và <strong>SEO</strong> tốt hơn — đúng hai điều một SPA React thuần-client gặp khó.</p>`],
      [5, 'Installing Next.js', `<p>Recommended: <code>npx create-next-app@latest</code> — it scaffolds the whole project (automatic install; a manual path also exists). Answer the prompts (TypeScript, App Router, Tailwind) and you have a running app.</p>`, `<p>Khuyến nghị: <code>npx create-next-app@latest</code> — nó dựng cả dự án (cài tự động; cũng có cách thủ công). Trả lời các câu hỏi (TypeScript, App Router, Tailwind) là bạn có một app chạy được.</p>`],
      [6, 'package.json scripts', `<p>The four scripts: <code>dev</code> (<code>next dev</code> — development mode), <code>build</code> (<code>next build</code> — production build), <code>start</code> (<code>next start</code> — production server), <code>lint</code> (<code>next lint</code> — built-in ESLint). Same idea as CRA/Vite, Next-specific commands.</p>`, `<p>Bốn script: <code>dev</code> (<code>next dev</code> — chế độ phát triển), <code>build</code> (<code>next build</code> — build production), <code>start</code> (<code>next start</code> — server production), <code>lint</code> (<code>next lint</code> — ESLint dựng sẵn). Cùng ý với CRA/Vite, lệnh riêng của Next.</p>`],
      [7, 'File-system routing', `<p>Next.js's headline difference from React Router: <strong>routes come from your file structure</strong>, not JSX <code>&lt;Route&gt;</code>s. A file's location <em>is</em> its URL — no route config to maintain.</p>`, `<p>Khác biệt nổi bật của Next.js so với React Router: <strong>route đến từ cấu trúc file</strong>, không phải <code>&lt;Route&gt;</code> JSX. Vị trí một file <em>chính là</em> URL của nó — không phải bảo trì config route.</p>`],
      [8, 'The App Router', `<p>New apps use the <strong>App Router</strong> (an evolution of the Pages Router) to access React's latest features. Create an <code>app/</code> folder with <code>layout.tsx</code> and <code>page.tsx</code> — these render at the root URL <code>/</code>. Nested folders become nested routes.</p>`, `<p>App mới dùng <strong>App Router</strong> (bản tiến hoá của Pages Router) để dùng các tính năng React mới nhất. Tạo thư mục <code>app/</code> với <code>layout.tsx</code> và <code>page.tsx</code> — chúng render ở URL gốc <code>/</code>. Thư mục lồng thành route lồng.</p>`],
      [9, 'Run the dev server', `<p><code>npm run dev</code> → open <code>http://localhost:3000</code>. Edit <code>app/layout.tsx</code> or <code>app/page.tsx</code> and save to see the update — the same fast edit-refresh loop as CRA/Vite.</p>`, `<p><code>npm run dev</code> → mở <code>http://localhost:3000</code>. Sửa <code>app/layout.tsx</code> hoặc <code>app/page.tsx</code> và lưu để thấy cập nhật — cùng vòng sửa-làm mới nhanh như CRA/Vite.</p>`],
      [10, 'Tailwind CSS', `<p>Section divider — a different way to style, contrasted with Bootstrap (Chapter 4).</p>`, `<p>Slide phân mục — một cách tạo kiểu khác, đối chiếu với Bootstrap (Chương 4).</p>`],
      [11, 'What is Tailwind CSS?', `<p>An open-source <strong>utility-first</strong> CSS framework: a huge set of small utility classes (<code>p-4</code>, <code>text-lg</code>, <code>bg-gray-200</code>, <code>flex</code>) you mix and match to style elements directly in the markup. Unlike Bootstrap's ready components, Tailwind gives you freedom to build custom designs fast.</p>`, `<p>Một framework CSS <strong>utility-first</strong> mã nguồn mở: một bộ khổng lồ các class tiện ích nhỏ (<code>p-4</code>, <code>text-lg</code>, <code>bg-gray-200</code>, <code>flex</code>) bạn trộn để tạo kiểu ngay trong markup. Khác các component sẵn của Bootstrap, Tailwind cho bạn tự do dựng thiết kế riêng nhanh.</p>`],
      [12, 'Bootstrap vs Tailwind', `<p>Bootstrap ships pre-designed components (you get its look); Tailwind ships low-level utilities (you get your own look). The slide points to npmtrends for popularity — both are widely used; the choice is design philosophy, not capability.</p>`, `<p>Bootstrap có sẵn component thiết kế trước (bạn nhận giao diện của nó); Tailwind có các tiện ích cấp thấp (bạn tự tạo giao diện). Slide dẫn npmtrends để so độ phổ biến — cả hai đều dùng rộng; lựa chọn là triết lý thiết kế, không phải khả năng.</p>`],
      [13, 'History of Tailwind', `<p>Created by <strong>Adam Wathan and Steve Schoger in 2017</strong>. Wathan, a Bootstrap fan, added utility classes (paddings, flex containers); as demand grew they extracted them into a library and open-sourced it.</p>`, `<p>Do <strong>Adam Wathan và Steve Schoger tạo năm 2017</strong>. Wathan, một fan Bootstrap, thêm các class tiện ích (padding, flex container); khi nhu cầu tăng, họ tách thành thư viện và mã nguồn mở.</p>`],
      [14, 'Using Tailwind with React — setup', `<p>Three steps: (1) <code>npm install -D tailwindcss postcss autoprefixer</code>; (2) <code>npx tailwindcss init -p</code> to generate <code>tailwind.config.js</code> + <code>postcss.config.js</code>; (3) set the <code>content</code> paths in the config and add the <code>@tailwind base; @tailwind components; @tailwind utilities;</code> directives to your CSS.</p>`, `<p>Ba bước: (1) <code>npm install -D tailwindcss postcss autoprefixer</code>; (2) <code>npx tailwindcss init -p</code> để sinh <code>tailwind.config.js</code> + <code>postcss.config.js</code>; (3) đặt các đường <code>content</code> trong config và thêm chỉ thị <code>@tailwind base; @tailwind components; @tailwind utilities;</code> vào file CSS.</p>`],
      [15, 'Using Tailwind — in a component', `<p>Then style with classes directly: <code>&lt;div className="container mx-auto bg-gray-200 rounded-xl shadow p-8 m-10"&gt;&lt;p className="text-3xl text-gray-700 font-bold mb-5"&gt;Welcome!&lt;/p&gt;&lt;/div&gt;</code>. Run <code>npm run start</code> and the utilities apply — no separate CSS file to write.</p>`, `<p>Rồi tạo kiểu bằng class trực tiếp: <code>&lt;div className="container mx-auto bg-gray-200 rounded-xl shadow p-8 m-10"&gt;&lt;p className="text-3xl text-gray-700 font-bold mb-5"&gt;Welcome!&lt;/p&gt;&lt;/div&gt;</code>. Chạy <code>npm run start</code> và các tiện ích áp dụng — không phải viết file CSS riêng.</p>`],
      [16, 'Assignment 02', `<p>Points to the course assignment — build something with Next.js and/or Tailwind. Apply everything from Chapters 1–12 plus this framework/styling knowledge.</p>`, `<p>Trỏ tới bài tập lớn của môn — dựng một thứ với Next.js và/hoặc Tailwind. Áp dụng mọi thứ từ Chương 1–12 cộng kiến thức framework/tạo kiểu này.</p>`],
      [17, 'Summary', `<p>Recap: Next.js is a React framework adding SSR, SSG, image optimization and file-system routing (App Router with <code>layout.tsx</code>/<code>page.tsx</code>); Tailwind CSS is a utility-first framework you configure with PostCSS and use via class names in JSX. Together they are a common modern production stack.</p>`, `<p>Tóm tắt: Next.js là framework React thêm SSR, SSG, tối ưu ảnh và file-system routing (App Router với <code>layout.tsx</code>/<code>page.tsx</code>); Tailwind CSS là framework utility-first cấu hình bằng PostCSS và dùng qua class trong JSX. Kết hợp lại là một stack production hiện đại phổ biến.</p>`],
    ]),
    bi(
      `<div class="callout"><span class="badge">🎉 Course decks complete</span> That was the last of the twenty FER202 slot decks. Every slide the lecturer shows — Slots 1 through 20 — now has an image and a bilingual explanation on this site, with the 27 course exercises solved in their matching chapters.</div>`,
      `<div class="callout"><span class="badge">🎉 Đã đủ slide toàn môn</span> Đó là bộ slide cuối trong hai mươi bộ của FER202. Mọi slide thầy/cô chiếu — Slot 1 tới 20 — giờ đều có ảnh và giải thích song ngữ trên trang, cùng 27 exercise được giải trong đúng chương của chúng.</div>`,
    ),
    books([
      ['reactdoc', 'react.dev “Start a New React Project” (recommends Next.js) and the Next.js docs (nextjs.org/docs)', 'react.dev “Start a New React Project” (khuyến nghị Next.js) và tài liệu Next.js (nextjs.org/docs)'],
    ]),
    bi(
      `<div class="di-toi"><a class="link-card exphub" href="${EXPHUB}" target="_blank" rel="noopener"><span class="lc-ico">🛠️</span><span class="lc-body"><span class="lc-title">Next.js &amp; Tailwind setup</span><span class="lc-sub">create-next-app + Tailwind config — Exp Hub.</span></span><span class="lc-cta">EXP HUB →</span></a></div>`,
      `<div class="di-toi"><a class="link-card exphub" href="${EXPHUB}" target="_blank" rel="noopener"><span class="lc-ico">🛠️</span><span class="lc-body"><span class="lc-title">Cài Next.js &amp; Tailwind</span><span class="lc-sub">create-next-app + cấu hình Tailwind — Exp Hub.</span></span><span class="lc-cta">EXP HUB →</span></a></div>`,
    ),
  ].join('\n'),
};

export default [SLIDES];
