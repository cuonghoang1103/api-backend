// Node.js 0.0 (2/2) — How this course is built. Bài định hướng ⇒ đề nhẹ + một hàm "đo, đừng đoán" (đồng hồ ảo của máy chấm).
import { modul, cs, jsBai, q, ord, bang1, tn, pre } from './_node.mjs';

const TN = [
  tn('measure, do not guess', 'đo, đừng đoán', 'Trust a number you ran over code that merely looks right.'),
  tn('invisible failure', 'lỗi vô hình', 'A backend bug that shows nothing on screen until it is expensive.'),
  tn('production example', 'ví dụ từ production', 'Code taken from a real running system, not a toy snippet.'),
  tn('six stages', 'sáu chặng', 'Foundations, Building an API, Making it safe, Real systems, Trust & operations, Shipping.'),
  tn('run, do not read', 'chạy, đừng chỉ đọc', 'Typing and running an example teaches what reading cannot.'),
];

export default modul('nodejs-0-0-start-here-2', '0.0 Start here (2/2): how this course is built', [
  cs({
    ten: 'The six stages, in order',
    kho: 'EASY', phut: 4, loai: 'order',
    en: 'Six stages, eighteen chapters, each stage assuming the one before it. Put the stages in order — "the fastest way to get stuck is to skip ahead".',
    vi: 'Sáu chặng, mười tám chương, chặng sau dựa trên chặng trước. Sắp các chặng đúng thứ tự — "cách nhanh nhất để kẹt là nhảy cóc".',
    cau: [
      ord('s1', ['Order the stages.', 'Sắp các chặng.'], [
        'Foundations (chapters 1–4)', 'Building an API (5–7)', 'Making it safe (8–10)', 'Real systems (11–13)', 'Trust and operations (14–16)', 'Shipping (17–18)',
      ], ['You learn the language and the runtime, then build an API on them, then protect it, then add realtime/cache/jobs, then test and observe it, and only then ship it. Auth (stage 3) is unreadable if async (stage 1) never clicked.', 'Học ngôn ngữ và runtime, rồi dựng API trên đó, rồi bảo vệ nó, rồi thêm realtime/cache/job, rồi kiểm thử và quan sát, cuối cùng mới đưa lên. Xác thực (chặng 3) không đọc nổi nếu bất đồng bộ (chặng 1) chưa thông.']),
    ],
    goiY: [['You cannot protect an API you have not built yet.', 'Không thể bảo vệ một API chưa dựng.'], ['Testing and logs come before shipping.', 'Kiểm thử và log đến trước khi đưa lên.']],
    loi: [['Putting "Making it safe" first — there is nothing to protect yet.', 'Đặt "An toàn" lên đầu — chưa có gì để bảo vệ.'], ['Putting "Shipping" before "Trust and operations".', 'Đặt "Đưa lên" trước "Tin cậy và vận hành".']],
    tns: TN,
  }),

  cs({
    ten: 'Visible on screen, or only in a measurement?',
    kho: 'EASY', phut: 5, loai: 'table',
    en: '"A frontend mistake is visible on the next reload. A backend mistake is usually invisible until it is expensive." For each bug, decide whether you would notice it by looking at the screen, or only by measuring.',
    vi: '"Lỗi frontend thấy ngay lần tải lại sau. Lỗi backend thường vô hình cho tới khi đắt giá." Với mỗi bug, quyết định bạn thấy nó bằng mắt trên màn hình, hay chỉ thấy khi đo.',
    bang: [bang1('v1', ['How would you notice it?', 'Bạn sẽ nhận ra nó bằng cách nào?'],
      [{ ma: 'bug', ten: 'Bug|||Bug' }, { ma: 'thay', ten: 'Noticed by|||Nhận ra nhờ', luaChon: ['looking at the screen', 'only a measurement'] }],
      [
        { o: { bug: 'The "Save" button is hidden behind the footer' }, a: { thay: 'looking at the screen' } },
        { o: { bug: 'Each request leaks one database connection; the API dies after a few hours' }, a: { thay: 'only a measurement' } },
        { o: { bug: 'A query is instant on 50 rows and takes 9 s on 50 000 rows' }, a: { thay: 'only a measurement' } },
        { o: { bug: 'Two writes that should be one transaction; once a week a note loses its tags' }, a: { thay: 'only a measurement' } },
        { o: { bug: 'The note title is printed in white on a white background' }, a: { thay: 'looking at the screen' } },
        { o: { bug: 'Memory grows by 2 MB every hour until the container is killed' }, a: { thay: 'only a measurement' } },
      ],
      ['Layout and colour bugs show on the next reload. Leaks, slow queries on real data sizes, broken transactions and memory growth change nothing on screen while you test with one user — which is why the course ends chapters with numbers you run yourself: connection counts, timings, memory graphs.', 'Lỗi bố cục và màu hiện ngay lần tải lại. Rò kết nối, truy vấn chậm trên dữ liệu thật, giao dịch hỏng và bộ nhớ tăng dần không đổi gì trên màn hình khi bạn thử với một người dùng — vì vậy khoá kết thúc các chương bằng con số bạn tự chạy: số kết nối, thời gian, biểu đồ bộ nhớ.'])],
    goiY: [['Ask: would one user, clicking once, see anything wrong?', 'Hỏi: một người dùng bấm một lần có thấy gì sai không?'], ['Problems that grow with time, data size or load are measurement problems.', 'Vấn đề lớn dần theo thời gian, cỡ dữ liệu hay tải là vấn đề phải đo.']],
    loi: [['Treating "it works when I click it" as proof on the server.', 'Coi "tôi bấm thì chạy" là bằng chứng ở phía server.'], ['Assuming slow queries would be visible during development (with 50 rows they are not).', 'Tưởng truy vấn chậm sẽ lộ khi phát triển (với 50 dòng thì không).']],
    tns: TN,
  }),

  cs({
    ten: 'The rules this course is built on',
    kho: 'EASY', phut: 4,
    en: 'Short questions on how the course works.',
    vi: 'Câu hỏi ngắn về cách khoá học vận hành.',
    cau: [
      q('k1', ['Where do the examples come from?', 'Ví dụ lấy từ đâu?'],
        ['A production Node.js backend — this website — including its outages and fixes', 'Small toy apps with three routes, written only for the course', 'The official Node.js documentation, copied without changes', 'Popular blog posts and tutorials collected from the internet'],
        ['That is why chapters end with "what does this look like in a system that is actually running?" and often with a measurement instead of a screenshot.', 'Vì vậy các chương kết bằng "trong một hệ thống đang chạy thật thì trông thế nào?" và thường bằng một phép đo thay vì ảnh chụp.']),
      q('k2', ['Your code "looks right" and you got 200 OK once. On the server, what does that prove?', 'Code "trông đúng" và bạn nhận 200 OK một lần. Ở server, điều đó chứng minh gì?'],
        ['Very little — make it prove itself with numbers under realistic conditions', 'That it is correct, because the server answered without an error', 'That it will scale, because one request is the hardest case', 'That it has no security bugs, because the response looked normal'],
        ['"It works" is a weak signal on the server. Measure, do not guess.', '"Nó chạy" là tín hiệu yếu ở server. Đo, đừng đoán.']),
      q('k3', ['The single study habit that decides whether you can build anything at the end?', 'Thói quen học duy nhất quyết định cuối khoá bạn có tự dựng được gì không?'],
        ['Type and run every example instead of only reading it', 'Read every lesson twice', 'Watch the videos at 2× speed', 'Copy the final project from the repository'],
        ['Reading feels like learning; typing and running is learning. Lesson 0.2 turns this into a five-step loop.', 'Đọc có cảm giác như học; gõ và chạy mới là học. Bài 0.2 biến điều này thành vòng năm bước.']),
    ],
    goiY: [['Every rule in this lesson is a form of "do not trust what merely looks right".', 'Mọi luật trong bài là một dạng của "đừng tin thứ chỉ trông có vẻ đúng".'], ['Think about how the course ends its chapters.', 'Nghĩ về cách khoá học kết thúc các chương.']],
    loi: [['Believing one successful request proves correctness.', 'Tin một request thành công là chứng minh đúng.'], ['Planning to "read through" the course first and practise later.', 'Định "đọc lướt" cả khoá trước rồi luyện sau.']],
    tns: TN,
  }),

  jsBai({
    ten: 'Measure, do not guess: write timeIt',
    kho: 'MEDIUM', phut: 10,
    en: `<p>Your first measuring tool. Write <code>async timeIt(fn)</code>: it runs the async function <code>fn</code>, waits until it has really finished, and returns <code>{ ms, result }</code> — the elapsed milliseconds (<code>Date.now()</code> after minus before) and whatever <code>fn</code> resolved to.</p>${pre("const r = await timeIt(() => loadNotesOneByOne());   // { ms: 900, result: [...] }\nconst s = await timeIt(() => loadNotesTogether());   // { ms: 300, result: [...] }\n// same result, 3× faster — you know it because you measured it")}<p>The starter forgets to wait, so it always reports <code>0</code> ms — a tool that "looks right" and measures nothing. In the grader <code>Date.now()</code> is a virtual clock, so the numbers are exact.</p>`,
    vi: `<p>Công cụ đo đầu tiên. Viết async timeIt(fn): chạy hàm async fn, chờ tới khi nó THẬT SỰ xong, trả { ms, result } — số mili giây đã trôi (Date.now() sau trừ trước) và giá trị fn trả. Code khởi đầu quên chờ nên luôn báo 0 ms — công cụ "trông đúng" mà không đo gì. Trong máy chấm Date.now() là đồng hồ ảo nên số đo chính xác.</p>`,
    yc: [
      ['Return <code>{ ms, result }</code> after <code>fn</code> has finished.', 'Trả { ms, result } sau khi fn xong.'],
      ['If <code>fn</code> rejects, <code>timeIt</code> rejects with the same error (a failed run has no meaningful time).', 'fn reject thì timeIt reject đúng lỗi đó.'],
    ],
    goiY: [['<code>const start = Date.now();</code> before calling <code>fn</code>, then <code>const result = await fn();</code>.', 'const start = Date.now(); trước khi gọi fn, rồi const result = await fn();.'], ['Chapter 1.4 explains <code>await</code> fully; for now: it pauses the function until the work is done.', 'Bài 1.4 giải thích đầy đủ await; tạm hiểu: nó dừng hàm tới khi việc xong.']],
    loi: [['Reading the clock right after calling <code>fn()</code> without <code>await</code> — you measure how long it took to <i>start</i>, which is 0.', 'Đọc đồng hồ ngay sau khi gọi fn() không await — đo được thời gian BẮT ĐẦU, tức 0.'], ['Returning the Promise as <code>result</code> instead of its value.', 'Trả chính Promise làm result thay vì giá trị của nó.']],
    gt: ['An async function returns immediately with a Promise; the work finishes later. Only after <code>await fn()</code> has the work really ended, so the difference of the two clock readings is the true duration. A measuring tool that does not wait is the perfect example of the lesson\'s warning: code that looks right and proves nothing.',
      'Hàm async trả về ngay một Promise; việc xong sau. Chỉ sau await fn() việc mới thật sự xong, nên hiệu hai lần đọc đồng hồ là thời lượng thật. Công cụ đo mà không chờ là ví dụ hoàn hảo cho lời cảnh báo của bài: code trông đúng mà không chứng minh gì.'],
    kn: ['measurement', 'async/await (preview)'],
    tns: TN,
    viDu: [{ input: 'await timeIt(() => sleep(300).then(() => "ok"))', output: '{"ms":300,"result":"ok"}', explanation: 'The starter reports ms: 0 and a Promise.|||Code khởi đầu báo ms: 0 và một Promise.' }],
    chung: `const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const loadOne = (id) => sleep(300).then(() => ({ id }));
const oneByOne = async () => [await loadOne(1), await loadOne(2), await loadOne(3)];
const together = () => Promise.all([loadOne(1), loadOne(2), loadOne(3)]);`,
    dau: `async function timeIt(fn) {
  const start = Date.now();
  const result = fn();
  return { ms: Date.now() - start, result };
}
`,
    giai: `// Measure, do not guess: read the clock before, WAIT for the work, read it again.
async function timeIt(fn) {
  const start = Date.now();
  const result = await fn();          // without await we would time only the start (0 ms)
  return { ms: Date.now() - start, result };
  // if fn rejects, the await throws and timeIt rejects with the same error
}
`,
    cases: [
      { moTa: ['measures a 300 ms task', 'đo việc 300 ms'], goi: 'await timeIt(() => sleep(300).then(() => "ok"))' },
      { moTa: ['one by one vs together: same result, different time', 'lần lượt vs cùng lúc'], chuanBi: 'const a = await timeIt(oneByOne); const b = await timeIt(together);', goi: '[a.ms, b.ms, JSON.stringify(a.result) === JSON.stringify(b.result)]' },
      { moTa: ['a failing task ⇒ timeIt rejects', 'việc lỗi ⇒ timeIt reject'], goi: "await timeIt(() => sleep(10).then(() => { throw new Error('DB down'); }))", nem: 'Error', thongDiep: 'DB down' },
      { an: true, goi: 'await timeIt(async () => { await sleep(120); await sleep(80); return 7; })' },
      { an: true, goi: 'await timeIt(async () => "instant")' },
    ],
  }),
]);
