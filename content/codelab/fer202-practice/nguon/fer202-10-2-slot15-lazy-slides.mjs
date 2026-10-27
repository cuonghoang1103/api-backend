/**
 * FER202 · 10.2 — Slide check: Lazy loading & Suspense (Slot 15). Trắc nghiệm.
 */
import { doiDau, KHOA, lc, tinh } from './_chung.mjs';

const q = (ma, de, luaChon, dapAn, giaiThich, nhieu) => ({ ma, de, luaChon: lc(...luaChon), dapAn, giaiThich, ...(nhieu ? { nhieu: true } : {}) });

export default doiDau({
  slug: 'fer202-10-2-slot15-lazy-slides',
  ten: '10.2 Slide check — Lazy loading',
  khoa: KHOA,
  baiHoc: 'fer202-10-2-slot15-lazy-slides',
  de: [
    tinh({
      tieuDe: 'Slide check: React.lazy, import() and Suspense',
      doKho: 'EASY', phut: 12,
      khaiNiem: ['bundle', 'code splitting', 'React.lazy', 'Suspense'], the: ['lazy', 'quiz'],
      moTa: {
        en: '<p>Ten questions on Slot 15: why bundles get big, how dynamic <code>import()</code> splits code, what <code>React.lazy</code> needs, where to put <code>Suspense</code>, and the pitfalls of lazy-loading too much.</p>',
        vi: '<p>Mười câu về Slot 15: vì sao bundle phình to, <code>import()</code> động chia mã thế nào, <code>React.lazy</code> cần gì, đặt <code>Suspense</code> ở đâu, và cái giá của lazy quá nhiều.</p>',
      },
      goiY: ['lazy nhận HÀM trả Promise của module có default export.', 'Suspense hiện fallback khi component con đang "treo".'],
      loiHayGap: ['Nghĩ lazy làm giảm tổng dung lượng mã — nó chỉ chia ra, tổng gần như không đổi.', 'Quên rằng lazy component phải nằm trong Suspense.'],
      giaiThich: '<p>Xem giải thích từng câu sau khi nộp.</p>',
      thuatNgu: [{ en: 'bundle', vi: 'tệp JS gộp toàn bộ mã của app' }],
      cauHoi: [
        q('q1', 'Main goal of code splitting?', [['a', 'Make the total code smaller'], ['b', 'Load less JavaScript up front so the first screen appears sooner'], ['c', 'Hide source code'], ['d', 'Avoid using React']], ['b'], 'The total size stays similar; it is downloaded in pieces when needed.|||Tổng dung lượng gần như giữ nguyên; chỉ được tải từng phần khi cần.'),
        q('q2', 'What does <code>import("./Chart")</code> return?', [['a', 'The component'], ['b', 'A Promise that resolves to the module object'], ['c', 'A string path'], ['d', 'undefined']], ['b'], 'Bundlers turn it into a separate chunk.|||Bundler biến nó thành chunk riêng.'),
        q('q3', 'Correct use of React.lazy:', [['a', '<code>const Chart = lazy(import("./Chart"))</code>'], ['b', '<code>const Chart = lazy(() =&gt; import("./Chart"))</code>'], ['c', '<code>const Chart = await lazy("./Chart")</code>'], ['d', '<code>lazy.Chart()</code>']], ['b'], 'lazy takes a FUNCTION so loading starts only when the component first renders.|||lazy nhận một HÀM để chỉ bắt đầu tải khi component render lần đầu.'),
        q('q4', 'React.lazy requires the module to…', [['a', 'have a default export that is a component'], ['b', 'use class components'], ['c', 'be in node_modules'], ['d', 'export a function named lazy']], ['a'], 'For named exports, map with .then(m => ({ default: m.X })).|||Export có tên thì ánh xạ bằng .then(m => ({ default: m.X })).'),
        q('q5', 'What happens if a lazy component renders without any Suspense above it?', [['a', 'It renders nothing silently'], ['b', 'React throws an error (a component suspended without a Suspense boundary)'], ['c', 'It loads synchronously'], ['d', 'The page reloads']], ['b'], 'There must be a Suspense somewhere above.|||Phải có Suspense ở đâu đó phía trên.'),
        q('q6', 'The <code>fallback</code> prop of Suspense is…', [['a', 'a function called on error'], ['b', 'any React element shown while children are loading'], ['c', 'a CSS class'], ['d', 'the URL of the chunk']], ['b'], 'Usually a spinner or skeleton.|||Thường là vòng xoay hoặc khung xương.'),
        q('q7', 'Why do tutorials add an artificial delay when demonstrating lazy?', [['a', 'Lazy requires it'], ['b', 'On localhost chunks load too fast to see the fallback'], ['c', 'To fix a bug'], ['d', 'To reduce bundle size']], ['b'], 'In production on a slow network the fallback is visible for real.|||Trên production với mạng chậm thì fallback hiện thật.'),
        q('q8', 'One Suspense can wrap several lazy components.', [['a', 'True — it shows the fallback until all of them are ready'], ['b', 'False — one Suspense per component']], ['a'], 'Nest Suspense boundaries when parts should appear independently.|||Lồng nhiều Suspense khi muốn các phần hiện độc lập.'),
        q('q9', 'Best default place to split a React app?', [['a', 'Every component'], ['b', 'Routes / pages'], ['c', 'CSS files'], ['d', 'Only the App component']], ['b'], 'Users visit one page at a time; route splitting gives the biggest win for the least effort.|||Người dùng mở từng trang một; chia theo route lợi nhiều nhất mà ít công nhất.'),
        q('q10', 'Downsides of too many lazy components? (choose all)', [['a', 'More network requests'], ['b', 'Many spinners / layout flashes'], ['c', 'Larger total download size'], ['d', 'Waterfalls when nested lazy chunks load one after another']], [['a', 'b', 'd']], 'Total size barely changes; the cost is requests and UX.|||Tổng dung lượng hầu như không đổi; cái giá là request và trải nghiệm.', true),
      ],
    }),
  ],
});
