/**
 * FER202 · Nâng cao A3 — TypeScript & Next.js: đọc kiểu (trắc nghiệm), ánh xạ tệp app router → URL (bảng).
 */
import { doiDau, KHOA, lc, tinh } from './_chung.mjs';

const q = (ma, de, luaChon, dapAn, giaiThich, nhieu) => ({ ma, de, luaChon: lc(...luaChon), dapAn, giaiThich, ...(nhieu ? { nhieu: true } : {}) });
const v = (...ds) => ds;

export default doiDau({
  slug: 'fer202-a3-1-typescript-nextjs',
  ten: '14.3 TypeScript & Next.js (advanced)',
  khoa: KHOA,
  baiHoc: 'fer202-a3-1-typescript-nextjs',
  de: [
    tinh({
      tieuDe: 'TypeScript for React: read the types',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['props types', 'union types', 'optional props', 'generics', 'type errors'], the: ['typescript', 'quiz'],
      moTa: {
        en: '<p>Eight questions on typing React components with TypeScript: props interfaces, optional props, unions, event types, <code>useState</code> generics and what the compiler will or will not catch.</p>',
        vi: '<p>Tám câu về khai báo kiểu cho component React bằng TypeScript: interface props, prop tuỳ chọn, union, kiểu sự kiện, generic của <code>useState</code> và điều trình biên dịch bắt được hay không.</p>',
      },
      goiY: ['TypeScript chỉ kiểm lúc biên dịch; lúc chạy là JavaScript thường.', 'prop?: T nghĩa là T | undefined.'],
      loiHayGap: ['Dùng any khắp nơi ⇒ mất hết lợi ích.', 'Nghĩ TS kiểm được dữ liệu API trả về lúc chạy.'],
      giaiThich: '<p>Xem giải thích từng câu sau khi nộp.</p>',
      thuatNgu: [{ en: 'type annotation', vi: 'chú thích kiểu' }, { en: 'union type', vi: 'kiểu hợp: A | B' }],
      cauHoi: [
        q('t1', '<code>type Props = { title: string; count?: number }</code>. Which JSX compiles?', [['a', '<code>&lt;Card /&gt;</code>'], ['b', '<code>&lt;Card title="Hi" /&gt;</code>'], ['c', '<code>&lt;Card title={1} /&gt;</code>'], ['d', '<code>&lt;Card count="2" title="x" /&gt;</code>']], ['b'], 'title is required and must be a string; count is optional but must be a number.|||title bắt buộc và là chuỗi; count tuỳ chọn nhưng phải là số.'),
        q('t2', '<code>status: "idle" | "loading" | "done"</code> — what is this?', [['a', 'An enum class'], ['b', 'A union of string literal types'], ['c', 'An array'], ['d', 'A regular expression']], ['b'], 'Assigning "error" is a compile error.|||Gán "error" sẽ báo lỗi biên dịch.'),
        q('t3', 'Type of <code>e</code> in <code>&lt;input onChange={(e) =&gt; …} /&gt;</code>?', [['a', '<code>React.ChangeEvent&lt;HTMLInputElement&gt;</code>'], ['b', '<code>MouseEvent</code>'], ['c', '<code>string</code>'], ['d', '<code>any</code> always']], ['a'], 'Usually inferred automatically when written inline.|||Thường tự suy ra khi viết trực tiếp.'),
        q('t4', '<code>const [user, setUser] = useState&lt;User | null&gt;(null)</code> — why the generic?', [['a', 'Required syntax'], ['b', 'From null alone TS would infer type null and refuse setUser(realUser)'], ['c', 'It makes it faster'], ['d', 'To allow strings']], ['b'], 'Give the full type when the initial value is narrower.|||Khai báo đầy đủ khi giá trị đầu hẹp hơn.'),
        q('t5', 'Data fetched from an API at runtime…', [['a', 'is automatically validated by TypeScript'], ['b', 'is NOT checked by TypeScript at runtime — validate it (e.g. zod) if it may be wrong'], ['c', 'cannot be typed'], ['d', 'must be any']], ['b'], 'Types are erased after compilation.|||Kiểu bị xoá sau khi biên dịch.'),
        q('t6', 'Benefits of TypeScript in a React team? (choose all)', [['a', 'Autocomplete and safer refactors'], ['b', 'Catches wrong props at compile time'], ['c', 'Makes the bundle smaller'], ['d', 'Self-documenting component APIs']], [['a', 'b', 'd']], 'Bundle size is unchanged.|||Dung lượng bundle không đổi.', true),
        q('t7', 'Next.js adds to React… (choose all)', [['a', 'File-based routing'], ['b', 'Server-side rendering / static generation'], ['c', 'A replacement for JavaScript'], ['d', 'API routes / server actions']], [['a', 'b', 'd']], 'It is a React framework.|||Đó là framework của React.', true),
        q('t8', 'Why does SSR help SEO compared with a pure client SPA?', [['a', 'It hides content'], ['b', 'The server sends HTML that already contains the content, so crawlers and users see it before JS runs'], ['c', 'It removes JavaScript'], ['d', 'It is faster to type']], ['b'], 'Hydration then makes it interactive.|||Hydration sau đó làm trang tương tác được.'),
      ],
    }),
    tinh({
      loai: 'table',
      tieuDe: 'Next.js app router: file → URL',
      doKho: 'MEDIUM', phut: 8,
      khaiNiem: ['app directory', 'page.tsx', 'dynamic segment', 'route groups'], the: ['nextjs', 'table'],
      moTa: {
        en: '<p>In the Next.js <code>app/</code> router every folder is a URL segment and <code>page.tsx</code> makes it public. Write the URL each file serves (use <code>:slug</code> style for dynamic parts, e.g. <code>/blog/:slug</code>).</p>',
        vi: '<p>Trong router <code>app/</code> của Next.js mỗi thư mục là một đoạn URL và <code>page.tsx</code> làm nó truy cập được. Ghi URL mà mỗi tệp phục vụ (phần động viết kiểu <code>:slug</code>, vd <code>/blog/:slug</code>).</p>',
      },
      bang: [{
        ma: 'n', de: 'URL served',
        cot: [{ ma: 'file', ten: 'File' }, { ma: 'url', ten: 'URL' }],
        hang: [
          { ma: 'root', o: { file: 'app/page.tsx' } },
          { ma: 'about', o: { file: 'app/about/page.tsx' } },
          { ma: 'slug', o: { file: 'app/blog/[slug]/page.tsx' } },
          { ma: 'group', o: { file: 'app/(shop)/cart/page.tsx' } },
          { ma: 'nested', o: { file: 'app/courses/[id]/lessons/[lessonId]/page.tsx' } },
        ],
        dapAn: {
          'root.url': '/', 'about.url': '/about', 'slug.url': v('/blog/:slug', '/blog/[slug]'),
          'group.url': '/cart', 'nested.url': v('/courses/:id/lessons/:lessonId', '/courses/[id]/lessons/[lessonId]'),
        },
        giaiThich: '[x] = dynamic segment; (group) folders organise files without adding a URL segment.|||[x] = đoạn động; thư mục (nhóm) để sắp xếp tệp, không thêm đoạn URL.',
      }],
      goiY: ['Thư mục trong ngoặc tròn không xuất hiện trên URL.', 'Ngoặc vuông = tham số, giống :param của React Router.'],
      loiHayGap: ['Ghi /shop/cart cho route group.', 'Nghĩ layout.tsx tạo URL — chỉ page.tsx mới tạo.'],
      giaiThich: '<p>Định tuyến theo tệp thay cho mảng route của React Router; ý tưởng tham số và lồng nhau giữ nguyên.</p>',
      thuatNgu: [{ en: 'route group', vi: 'nhóm route: thư mục (tên) không thành đoạn URL' }],
    }),
  ],
});
