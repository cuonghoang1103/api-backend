/**
 * FER202 · 11.4 — Slide check: Promise, async/await, fetch & axios (Slot 19). Trắc nghiệm + sắp thứ tự in ra.
 */
import { doiDau, KHOA, lc, tinh } from './_chung.mjs';

const q = (ma, de, luaChon, dapAn, giaiThich, nhieu) => ({ ma, de, luaChon: lc(...luaChon), dapAn, giaiThich, ...(nhieu ? { nhieu: true } : {}) });
const o = (ma, de, muc, dapAn, giaiThich) => ({ ma, de, muc: lc(...muc), dapAn, giaiThich });

export default doiDau({
  slug: 'fer202-11-4-slot19-fetch-axios-slides',
  ten: '11.4 Slide check — fetch & axios',
  khoa: KHOA,
  baiHoc: 'fer202-11-4-slot19-fetch-axios-slides',
  de: [
    tinh({
      tieuDe: 'Slide check: promises, async/await, fetch and axios',
      doKho: 'EASY', phut: 12,
      khaiNiem: ['Promise states', 'callback hell', 'async/await', 'fetch', 'axios'], the: ['async', 'quiz'],
      moTa: {
        en: '<p>Ten questions on Slot 19: the three states of a Promise, escaping callback hell, how <code>async/await</code> works, running async code in <code>useEffect</code>, and the practical differences between <code>fetch</code> and <code>axios</code>.</p>',
        vi: '<p>Mười câu về Slot 19: ba trạng thái của Promise, thoát callback hell, <code>async/await</code> hoạt động thế nào, chạy code async trong <code>useEffect</code>, và khác biệt thực tế giữa <code>fetch</code> và <code>axios</code>.</p>',
      },
      goiY: ['async function LUÔN trả Promise.', 'fetch không reject khi 404/500; axios thì có.'],
      loiHayGap: ['Viết useEffect(async () => …).', 'Quên rằng await chỉ dùng được trong async function (hoặc top-level module).'],
      giaiThich: '<p>Xem giải thích từng câu sau khi nộp.</p>',
      thuatNgu: [{ en: 'callback hell', vi: 'callback lồng nhau nhiều tầng, khó đọc' }],
      cauHoi: [
        q('q1', 'The three states of a Promise:', [['a', 'start, run, stop'], ['b', 'pending, fulfilled, rejected'], ['c', 'open, closed, error'], ['d', 'sync, async, await']], ['b'], 'Once settled it never changes again.|||Đã settle thì không đổi nữa.'),
        q('q2', 'What does an <code>async function</code> return?', [['a', 'Whatever you return, directly'], ['b', 'Always a Promise'], ['c', 'undefined'], ['d', 'A callback']], ['b'], 'return 5 inside async ⇒ Promise resolving to 5.|||return 5 trong async ⇒ Promise resolve ra 5.'),
        q('q3', 'How do you handle errors with async/await?', [['a', '<code>.catch</code> is impossible'], ['b', '<code>try { await … } catch (e) { … }</code>'], ['c', 'Errors are ignored'], ['d', 'Use <code>if (error)</code> after await']], ['b'], 'A rejected awaited promise throws at the await.|||Promise bị reject sẽ ném lỗi tại chỗ await.'),
        q('q4', '<code>fetch("/api/x")</code> gets a 404. The promise…', [['a', 'rejects'], ['b', 'resolves with res.ok === false'], ['c', 'never settles'], ['d', 'throws synchronously']], ['b'], 'Only network failures reject.|||Chỉ lỗi mạng mới reject.'),
        q('q5', 'With fetch, reading the JSON body requires…', [['a', 'nothing, res is the data'], ['b', '<code>await res.json()</code>'], ['c', '<code>res.data</code>'], ['d', '<code>JSON.parse(res)</code>']], ['b'], 'axios puts it in res.data instead.|||axios đặt sẵn ở res.data.'),
        q('q6', 'Sending JSON with fetch needs… (choose all)', [['a', 'method: "POST"'], ['b', 'headers: { "Content-Type": "application/json" }'], ['c', 'body: JSON.stringify(data)'], ['d', 'res.json() before sending']], [['a', 'b', 'c']], 'axios.post(url, data) does all three for you.|||axios.post(url, data) làm cả ba giúp bạn.', true),
        q('q7', 'axios rejects when…', [['a', 'never'], ['b', 'the status is outside 2xx, or the network fails'], ['c', 'only on network failure'], ['d', 'the body is empty']], ['b'], 'err.response.status tells you which code.|||err.response.status cho biết mã nào.'),
        q('q8', 'Correct way to fetch in useEffect:', [['a', '<code>useEffect(async () =&gt; { await load(); }, [])</code>'], ['b', '<code>useEffect(() =&gt; { const load = async () =&gt; { … }; load(); }, [])</code>'], ['c', '<code>await useEffect(…)</code>'], ['d', 'Fetch in the render body']], ['b'], 'The effect must return nothing or a cleanup, not a Promise.|||Effect phải trả về không gì hoặc cleanup, không phải Promise.'),
        q('q9', '<code>Promise.all([a, b])</code> rejects when…', [['a', 'both reject'], ['b', 'any one rejects'], ['c', 'never'], ['d', 'the array is empty']], ['b'], 'Use Promise.allSettled to get every outcome.|||Dùng Promise.allSettled để nhận mọi kết quả.'),
        q('q10', 'Which is an advantage of axios over fetch?', [['a', 'It is built into the browser'], ['b', 'Automatic JSON, errors on bad status, instances with baseURL, interceptors'], ['c', 'It does not use Promises'], ['d', 'It only works with json-server']], ['b'], 'fetch needs no install; axios saves boilerplate.|||fetch không cần cài; axios bớt code lặp.'),
      ],
    }),
    tinh({
      loai: 'order',
      tieuDe: 'Event loop: order the console output',
      doKho: 'MEDIUM', phut: 6,
      khaiNiem: ['call stack', 'microtasks', 'macrotasks'], the: ['async', 'order'],
      moTa: {
        en: '<p>Code:</p><pre>console.log("A");\nsetTimeout(() =&gt; console.log("B"), 0);\nPromise.resolve().then(() =&gt; console.log("C"));\n(async () =&gt; { console.log("D"); await null; console.log("E"); })();\nconsole.log("F");</pre><p>Put the letters in the order they are printed.</p>',
        vi: '<p>Đoạn mã:</p><pre>console.log("A");\nsetTimeout(() =&gt; console.log("B"), 0);\nPromise.resolve().then(() =&gt; console.log("C"));\n(async () =&gt; { console.log("D"); await null; console.log("E"); })();\nconsole.log("F");</pre><p>Hãy sắp các chữ theo thứ tự được in ra.</p>',
      },
      goiY: ['Code đồng bộ chạy hết trước; thân async chạy đồng bộ tới await đầu tiên.', 'Microtask (then, phần sau await) chạy trước macrotask (setTimeout).'],
      loiHayGap: ['Nghĩ setTimeout 0 chạy ngay.', 'Nghĩ thân async function chờ tới sau mọi thứ — phần trước await chạy ngay.'],
      giaiThich: '<p>A, D, F (đồng bộ) → C, E (microtask theo thứ tự xếp hàng) → B (macrotask).</p>',
      thuatNgu: [{ en: 'microtask', vi: 'việc nhỏ chạy ngay sau code đồng bộ (Promise)' }, { en: 'macrotask', vi: 'việc chạy ở lượt vòng lặp sau (setTimeout)' }],
      cauHoi: [
        o('e1', 'Order of output', [['F', 'F'], ['B', 'B'], ['D', 'D'], ['A', 'A'], ['E', 'E'], ['C', 'C']], ['A', 'D', 'F', 'C', 'E', 'B'], 'Synchronous first (A, D, F), then microtasks in queue order (C, E), then the timer (B).|||Đồng bộ trước (A, D, F), rồi microtask theo thứ tự (C, E), rồi hẹn giờ (B).'),
      ],
    }),
  ],
});
