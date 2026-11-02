/**
 * Web Foundations — Chương 5: JavaScript nâng cao (bất đồng bộ, event loop,
 * Promise, async/await, fetch, ES modules). Song ngữ EN/VI (.ml-en / .ml-vi,
 * số khối bằng nhau). ⚠️ KHÔNG backtick trần trong content (dùng &#96;); `${`
 * trong code escape thành \${. Câu "in ra gì" (thứ tự event loop) đã CHẠY THẬT.
 */

import { gallery, galleryGiang } from './_slides.mjs';
import L55 from './s05/wf-5-5-es-modules.mjs';
import L54 from './s05/wf-5-4-fetch-apis.mjs';
import L53 from './s05/wf-5-3-async-await.mjs';
import L52 from './s05/wf-5-2-promises.mjs';
import L51 from './s05/wf-5-1-event-loop.mjs';
import { onTapBai } from './_on-tap/index.mjs';

export default {
  title: 'Chapter 5 — Asynchronous JavaScript & modules|||Chương 5 — JavaScript bất đồng bộ & modules',
  description: 'Web đầy những việc phải chờ: tải dữ liệu từ server, đọc file, hẹn giờ. JavaScript xử lý chúng mà không "đứng hình" nhờ mô hình bất đồng bộ. Học event loop, Promise, async/await, gọi API bằng fetch, và cách chia code thành module với import/export — đúng những thứ Node.js và React dựa vào.',
  lessons: [
    /* ─────────────────────── 5.0 slide bài giảng ─────────────────────── */
    {
      title: '5.0 — Lecture slides: the whole chapter in 15 slides|||5.0 — Slide bài giảng: cả chương trong 15 slide',
      slug: 'wf-5-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ slide bài giảng chương 5 — event loop, Promise, async/await, fetch và ES Modules. Mã tô màu như VS Code, đánh dấu ⭐ phần sẽ gặp lại ở FER202.',
      content: `
<div class="ml-en"><h2>📑 Chapter 5 in 15 slides</h2>
<p>This is the hardest chapter of the course, so use the deck twice: skim it before you start so the vocabulary is familiar, then come back after the lessons to check that each slide now makes sense on its own.</p>
<p>Slide 4 (the event loop) and slide 8 (<code>res.ok</code>) are the two that people skip and then lose an afternoon to. Give them an extra minute.</p></div>
<div class="ml-vi"><h2>📑 Chương 5 trong 15 slide</h2>
<p>Đây là chương khó nhất của khoá, nên dùng bộ slide này hai lần: lướt trước khi học để quen từ ngữ, rồi quay lại sau khi học xong để kiểm xem mỗi slide giờ tự nó đã dễ hiểu chưa.</p>
<p>Slide 4 (event loop) và slide 8 (<code>res.ok</code>) là hai chỗ người ta hay bỏ qua rồi mất cả buổi chiều vì nó. Dành thêm một phút cho chúng.</p></div>
${galleryGiang('wf-js2', [
  [1, 'Bìa chương'],
  [2, 'Nội dung chương — bảy phần'],
  [3, 'JavaScript chỉ có MỘT luồng — vì sao trang bị đứng hình'],
  [4, 'Event loop: call stack · Web APIs · hàng đợi'],
  [5, 'Callback và "callback hell"'],
  [6, 'Promise — ba trạng thái, .then / .catch / .finally'],
  [7, 'async / await — viết bất đồng bộ như đồng bộ ⭐'],
  [8, 'try / catch — và bẫy res.ok của fetch'],
  [9, 'fetch — GET và POST JSON ⭐⭐'],
  [10, 'Promise.all — chạy song song thay vì tuần tự'],
  [11, 'ES Modules: export / import · default vs named ⭐'],
  [12, 'Bốn bẫy bất đồng bộ hay gặp'],
  [13, 'Bảng đối chiếu: chương 5 dùng ở đâu trong FER202'],
  [14, 'Tự luyện — bốn bài với API công khai'],
  [15, 'Học thêm ở đâu'],
])}
`,
    },

    /* ─────────────────────────── 5.1 ─────────────────────────── */
    L51,

    /* ─────────────────────────── 5.2 ─────────────────────────── */
    L52,

    /* ─────────────────────────── 5.3 ─────────────────────────── */
    L53,

    /* ─────────────────────────── 5.4 ─────────────────────────── */
    L54,

    /* ─────────────────────────── 5.5 ─────────────────────────── */
    L55,

    /* ─────────────────────────── 5.6 quiz ─────────────────────────── */
    {
      title: '5.6 — Chapter 5 quiz|||5.6 — Kiểm tra chương 5',
      slug: 'wf-5-6-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về event loop, Promise, async/await, fetch và ES modules — có câu thứ tự in ra đã chạy thật.',
      content: `
<div class="ml-en"><p class="lead">Ten questions on Chapter 5: synchronous vs asynchronous, the event loop and print order, Promise states, async/await and try/catch, fetch and response.ok, and ES module import/export. The ordering answers were verified by running the code.</p>
<p class="note-ct"><strong>Now practice by doing.</strong> Async is best learned hands-on. On Code Lab, write Promises, async/await and fetch-style tasks — run your code to check the output, then mark the exercise solved yourself (automatic grading is still being built).</p>
<h3>The chapter in four points</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">One thread</span><span class="lz-t">Slow work is handed off</span><span class="lz-d">A long synchronous loop blocks clicks, timers and repaints. If a page freezes, look for a loop, not a network call.</span></div>
<div class="lz-node"><span class="lz-k">Promises settle once</span><span class="lz-t">And you must return them</span><span class="lz-d">A <code>.then</code> that forgets to return the inner promise breaks the chain silently and swallows its errors.</span></div>
<div class="lz-node"><span class="lz-k">await is sequential</span><span class="lz-t">Promise.all is not</span><span class="lz-d">Two <code>await</code>s in a row wait twice. And <code>await</code> inside <code>forEach</code> does nothing at all — use <code>for…of</code>.</span></div>
<div class="lz-node"><span class="lz-k">fetch and modules</span><span class="lz-t">Two silent traps</span><span class="lz-d"><code>fetch</code> does not reject on 404 or 500 — check <code>res.ok</code>. And modules need a real server, not <code>file://</code>.</span></div>
</div>
<p class="note-ct"><strong>Async bugs are ordering bugs.</strong> When something is <code>undefined</code> that should have a value, add a <code>console.log</code> with a label at each step and read the order they print in — it is almost never the order you assumed.</p>
<div class="link-card"><a href="/code-lab/web-foundations-practice?bai=wf-5-0-slides&khoa=web-foundations">Practice on Code Lab → Chapter 5 practice set</a></div></div>
<div class="ml-vi"><p class="lead">Mười câu cho Chương 5: đồng bộ vs bất đồng bộ, event loop và thứ tự in ra, các trạng thái Promise, async/await và try/catch, fetch và response.ok, và import/export ES module. Đáp án thứ tự đã được xác minh bằng cách chạy code.</p>
<p class="note-ct"><strong>Giờ luyện bằng cách làm.</strong> Bất đồng bộ học tốt nhất qua thực hành. Trên Code Lab, hãy viết Promise, async/await và bài kiểu fetch — chạy thử để xem kết quả, rồi tự đánh dấu đã giải (máy chấm tự động đang được làm).</p>
<h3>Cả chương trong bốn ý</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">Một luồng duy nhất</span><span class="lz-t">Việc chậm được giao đi nơi khác</span><span class="lz-d">Một vòng lặp đồng bộ dài chặn cả cú bấm, bộ đếm giờ và việc vẽ lại. Trang đơ thì hãy tìm một vòng lặp, đừng tìm một lời gọi mạng.</span></div>
<div class="lz-node"><span class="lz-k">Promise chốt một lần</span><span class="lz-t">Và bạn phải return chúng</span><span class="lz-d">Một <code>.then</code> quên return cái promise bên trong sẽ làm đứt chuỗi một cách lặng lẽ và nuốt luôn lỗi của nó.</span></div>
<div class="lz-node"><span class="lz-k">await là tuần tự</span><span class="lz-t">Promise.all thì không</span><span class="lz-d">Hai <code>await</code> liền nhau là chờ hai lần. Và <code>await</code> trong <code>forEach</code> thì chẳng làm gì cả — hãy dùng <code>for…of</code>.</span></div>
<div class="lz-node"><span class="lz-k">fetch và module</span><span class="lz-t">Hai cái bẫy lặng lẽ</span><span class="lz-d"><code>fetch</code> không từ chối khi gặp 404 hay 500 — hãy kiểm <code>res.ok</code>. Và module cần một máy chủ thật, không phải <code>file://</code>.</span></div>
</div>
<p class="note-ct"><strong>Lỗi bất đồng bộ là lỗi thứ tự.</strong> Khi một thứ đang là <code>undefined</code> mà lẽ ra phải có giá trị, hãy thêm một <code>console.log</code> có nhãn ở từng bước rồi đọc thứ tự chúng in ra — nó gần như chẳng bao giờ là thứ tự bạn đã giả định.</p>
<div class="link-card"><a href="/code-lab/web-foundations-practice?bai=wf-5-0-slides&khoa=web-foundations">Luyện tập ở Code Lab → bộ đề Chương 5</a></div></div>
${onTapBai('wf-5-6-quiz')}
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'JavaScript is single-threaded. How does it stay responsive while waiting?|||JavaScript đơn luồng. Làm sao nó vẫn mượt khi đang chờ?',
            options: [
              'The event loop runs queued callbacks after the current sync code finishes|||Event loop chạy các callback trong hàng đợi sau khi code đồng bộ hiện tại xong',
              'It creates a new thread for each task|||Nó tạo một luồng mới cho mỗi tác vụ',
              'It pauses the whole program until done|||Nó tạm dừng cả chương trình tới khi xong',
              'It runs everything at random|||Nó chạy mọi thứ ngẫu nhiên',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What does this print?  console.log("start"); setTimeout(() => console.log("timeout"), 0); console.log("end");|||Đoạn này in ra gì?  console.log("start"); setTimeout(() => console.log("timeout"), 0); console.log("end");',
            options: [
              'start, end, timeout|||start, end, timeout',
              'start, timeout, end|||start, timeout, end',
              'timeout, start, end|||timeout, start, end',
              'start, end (timeout never runs)|||start, end (timeout không bao giờ chạy)',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A Promise callback (microtask) and a setTimeout callback are both queued. Which runs first?|||Một callback Promise (microtask) và một callback setTimeout cùng vào hàng đợi. Cái nào chạy trước?',
            options: [
              'The Promise microtask runs before the setTimeout callback|||Microtask Promise chạy trước callback setTimeout',
              'The setTimeout callback runs first|||Callback setTimeout chạy trước',
              'They run at exactly the same time|||Chúng chạy đúng cùng lúc',
              'Whichever was written first in the code|||Cái nào viết trước trong code',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What are the three states of a Promise?|||Ba trạng thái của một Promise là gì?',
            options: [
              'pending, fulfilled, rejected|||pending, fulfilled, rejected',
              'start, running, stop|||start, running, stop',
              'open, closed, error|||open, closed, error',
              'true, false, undefined|||true, false, undefined',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What does the "await" keyword do inside an async function?|||Từ khoá "await" làm gì bên trong một hàm async?',
            options: [
              'Pauses the function until the Promise settles, then gives its value|||Dừng hàm tới khi Promise chốt, rồi trao giá trị của nó',
              'Blocks the entire browser thread|||Chặn cả luồng trình duyệt',
              'Cancels the Promise|||Huỷ Promise',
              'Converts a value into a string|||Chuyển một giá trị thành chuỗi',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'How do you catch an error from an awaited call?|||Làm sao bắt lỗi từ một lời gọi có await?',
            options: [
              'Wrap it in try/catch|||Bọc nó trong try/catch',
              'It cannot be caught|||Không bắt được',
              'Use an if statement on the value|||Dùng câu if trên giá trị',
              'Add a second await|||Thêm một await thứ hai',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Two independent requests each take 1 second. What runs them in ~1 second total?|||Hai yêu cầu độc lập mỗi cái tốn 1 giây. Cái gì chạy chúng trong ~1 giây tổng?',
            options: [
              'await Promise.all([fetchA(), fetchB()])|||await Promise.all([fetchA(), fetchB()])',
              'await fetchA(); await fetchB();|||await fetchA(); await fetchB();',
              'Awaiting them one at a time in a loop|||Await từng cái một trong vòng lặp',
              'They can never overlap|||Chúng không bao giờ chồng lặp được',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Does fetch() reject its Promise on an HTTP 404 response?|||fetch() có reject Promise của nó khi phản hồi HTTP 404 không?',
            options: [
              'No — it fulfils; you must check response.ok yourself|||Không — nó fulfilled; bạn phải tự kiểm response.ok',
              'Yes — 404 always rejects|||Có — 404 luôn reject',
              'Yes — any status other than 200 rejects|||Có — mọi mã khác 200 đều reject',
              'It throws a syntax error|||Nó ném một lỗi cú pháp',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'To read the JSON body of a fetch response, you…|||Để đọc phần thân JSON của một phản hồi fetch, bạn…',
            options: [
              'await response.json()|||await response.json()',
              'read response.body directly as an object|||đọc response.body trực tiếp như một đối tượng',
              'call JSON.parse(response)|||gọi JSON.parse(response)',
              'use response.text without await|||dùng response.text không cần await',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which import matches  export default function User(){}  in User.js?|||Import nào khớp với  export default function User(){}  trong User.js?',
            options: [
              'import User from "./User.js"|||import User from "./User.js"',
              'import { User } from "./User.js"|||import { User } from "./User.js"',
              'import * User from "./User.js"|||import * User from "./User.js"',
              'require User from "./User.js"|||require User from "./User.js"',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
