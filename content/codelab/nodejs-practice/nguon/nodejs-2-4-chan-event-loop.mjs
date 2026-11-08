// Node.js 2.4 — Blocking the loop: measured. Số đo đối chiếu bằng Node 22.23.3: nhóm luồng 4 ⇒ hai đợt (n02/kiem-node/pool.cjs:
// 64–84 ms rồi 126–152 ms), monitorEventLoopDelay rảnh với resolution 20 ⇒ p99 ≈ 22 ms (eld.cjs), regex /^([a-z0-9]+-?)+$/
// trên 'a'×n + '!' gấp ~4 lần mỗi 2 ký tự: 24 ⇒ 111 ms, 26 ⇒ 447 ms (redos.cjs).
import { modul, cs, jsBai, q, bang1, tn, pre } from './_node.mjs';

const TN = [
  tn('blocking', 'chặn', 'Synchronous CPU work on the main thread: nothing else in the process runs until it returns.'),
  tn('event-loop lag', 'độ trễ event loop', 'How late a scheduled callback actually fires — the health metric of a Node service.'),
  tn('heartbeat', 'nhịp tim', 'A setInterval that records how late it arrives; late = now - prev - interval.'),
  tn('libuv thread pool', 'nhóm luồng libuv', '4 threads by default (UV_THREADPOOL_SIZE) for fs, dns.lookup, zlib and some crypto.'),
  tn('ReDoS', 'ReDoS (từ chối dịch vụ bằng regex)', 'A regex that backtracks exponentially on crafted input and freezes the loop.'),
];

export default modul('nodejs-2-4-chan-event-loop', '2.4 Blocking the loop: measured', [
  cs({
    ten: 'Blocks, waits, or queues on the pool?',
    kho: 'EASY', phut: 7, loai: 'table',
    en: 'The lesson sorts work into three kinds: <b>blocks</b> the JS thread (nothing else runs), <b>waits</b> without blocking (the thread is free), or goes to libuv\'s <b>thread pool</b> (does not block JS, but can queue behind 4 threads). Classify each call made inside a request handler.',
    vi: 'Bài học chia việc thành ba loại: CHẶN luồng JS (không gì khác chạy), CHỜ không chặn (luồng rảnh), hoặc vào NHÓM LUỒNG của libuv (không chặn JS nhưng có thể xếp hàng sau 4 luồng). Phân loại từng lời gọi trong một handler.',
    bang: [bang1('b1', ['Classify each operation.', 'Phân loại từng thao tác.'],
      [{ ma: 'op', ten: 'Operation|||Thao tác' }, { ma: 'k', ten: 'Kind|||Loại', luaChon: ['blocks the JS thread', 'waits — does not block', 'libuv thread pool'] }],
      [
        { o: { op: 'for (let i = 0; i < 3e9; i++) s += i' }, a: { k: 'blocks the JS thread' } },
        { o: { op: 'JSON.parse(a 50 MB request body)' }, a: { k: 'blocks the JS thread' } },
        { o: { op: "fs.readFileSync('big.csv')" }, a: { k: 'blocks the JS thread' } },
        { o: { op: "crypto.pbkdf2Sync(pw, salt, 200000, 64, 'sha512')" }, a: { k: 'blocks the JS thread' } },
        { o: { op: 'await prisma.note.findMany() (PostgreSQL over the network)' }, a: { k: 'waits — does not block' } },
        { o: { op: "await fetch('https://api.example.com/rates')" }, a: { k: 'waits — does not block' } },
        { o: { op: "crypto.pbkdf2(pw, salt, 200000, 64, 'sha512', cb)" }, a: { k: 'libuv thread pool' } },
        { o: { op: "await fs.promises.readFile('note.txt')" }, a: { k: 'libuv thread pool' } },
        { o: { op: 'a regex that backtracks on a crafted 30-character input' }, a: { k: 'blocks the JS thread' } },
      ],
      ['Anything synchronous — loops, JSON.parse, every *Sync API, a backtracking regex — runs on the JS thread and freezes the process. Network waits (database, HTTP) are handled by the OS: the thread is free. File I/O and async crypto are not free either: they occupy one of libuv\'s 4 pool threads, so a fifth concurrent call queues (measured: 8 pbkdf2 calls finish in two waves of four).', 'Mọi thứ đồng bộ — vòng lặp, JSON.parse, mọi API *Sync, regex quay lui — chạy trên luồng JS và làm đông cứng process. Chờ mạng (CSDL, HTTP) do hệ điều hành lo: luồng rảnh. I/O tệp và crypto async cũng không miễn phí: chúng chiếm một trong 4 luồng của nhóm libuv, nên lời gọi thứ năm phải xếp hàng (đo: 8 lần pbkdf2 xong thành hai đợt bốn).'])],
    goiY: [['"Sync" in the name, or plain JavaScript computation ⇒ blocks.', 'Có "Sync" trong tên, hoặc tính toán JavaScript thuần ⇒ chặn.'], ['Network sockets are watched by the OS; files, DNS lookups, zlib and crypto go to the pool.', 'Socket mạng do hệ điều hành theo dõi; tệp, dns.lookup, zlib và crypto vào nhóm luồng.']],
    loi: [['Thinking an await on fs is "free" like a database query — it is pool-backed and can queue.', 'Nghĩ await trên fs "miễn phí" như truy vấn CSDL — nó dùng nhóm luồng và có thể xếp hàng.'], ['Thinking JSON.parse is fast enough to ignore — on a huge payload it is a blocking loop.', 'Nghĩ JSON.parse đủ nhanh để bỏ qua — với dữ liệu lớn nó là một vòng lặp chặn.']],
    tns: TN,
  }),

  jsBai({
    ten: 'Read the heartbeat: compute event-loop lag',
    kho: 'MEDIUM', phut: 10,
    en: `<p>The lesson's experiment runs a heartbeat every 100 ms and records <code>late = Date.now() - prev - 100</code>, then <code>prev = Date.now()</code>. Write <code>lagReport(start, beats, interval)</code> that analyses such a recording:</p>
<ul><li><code>start</code>: the time the heartbeat was started (the first <code>prev</code>). <code>beats</code>: the times at which the callback actually ran, in order.</li>
<li>Return <code>{ maxLateMs, lateBeats, status }</code>: the largest lateness, how many beats were late by <b>50 ms or more</b>, and a status using the lesson's guide on <code>maxLateMs</code>: below 10 ⇒ <code>'healthy'</code>, below 500 ⇒ <code>'investigate'</code>, otherwise <code>'users feel it'</code>.</li></ul>${pre("// interval 100: beats at 100, 200, 3073 (a 2871 ms loop ran in between), 3173\nlagReport(0, [100, 200, 3073, 3173], 100)\n// { maxLateMs: 2773, lateBeats: 1, status: 'users feel it' }")}`,
    vi: `<p>Thí nghiệm của bài chạy nhịp tim mỗi 100 ms và ghi late = Date.now() - prev - 100, rồi prev = Date.now(). Viết lagReport(start, beats, interval) phân tích bản ghi đó: trả { maxLateMs, lateBeats, status } — độ trễ lớn nhất, số nhịp trễ từ 50 ms trở lên, và trạng thái theo maxLateMs: dưới 10 ⇒ 'healthy', dưới 500 ⇒ 'investigate', còn lại ⇒ 'users feel it'.</p>`,
    yc: [
      ['Lateness of each beat = <code>beat - previous - interval</code>, where the first previous is <code>start</code>.', 'Độ trễ mỗi nhịp = beat - previous - interval, previous đầu tiên là start.'],
      ['Count beats with lateness ≥ 50.', 'Đếm nhịp có độ trễ ≥ 50.'],
      ['No beats ⇒ <code>{ maxLateMs: 0, lateBeats: 0, status: \'healthy\' }</code>.', 'Không có nhịp ⇒ { maxLateMs: 0, lateBeats: 0, status: \'healthy\' }.'],
    ],
    goiY: [['Copy the lesson\'s loop: <code>let prev = start, max = 0;</code> then for each beat compute <code>late</code>, update <code>max</code>, set <code>prev = beat</code>.', 'Chép vòng của bài: let prev = start, max = 0; mỗi nhịp tính late, cập nhật max, gán prev = beat.'], ['Each lateness is measured from the PREVIOUS beat, not from <code>start</code> — a long block delays one beat, not all the later ones.', 'Mỗi độ trễ đo từ nhịp TRƯỚC, không từ start — một lần chặn dài làm trễ một nhịp, không phải mọi nhịp sau.']],
    loi: [['Comparing each beat with <code>start + k × interval</code>: after one long block every later beat looks late too.', 'So mỗi nhịp với start + k × interval: sau một lần chặn dài, mọi nhịp sau cũng trông như trễ.'], ['Forgetting to subtract the interval — then a perfectly healthy loop reports 100 ms of lag.', 'Quên trừ interval — vòng lặp khoẻ mạnh vẫn báo trễ 100 ms.']],
    gt: ['Lateness is the gap between two consecutive callbacks minus the gap you asked for. A blocked loop delays the one callback that was due during the block; afterwards the interval starts over from that late beat, which is why measuring from the previous beat isolates each stall. The largest value is the number the lesson compares with the length of the blocking work (2871 ms of computation ⇒ 2873 ms late).',
      'Độ trễ là khoảng cách giữa hai callback liên tiếp trừ khoảng bạn yêu cầu. Vòng lặp bị chặn làm trễ đúng callback đến hạn trong lúc chặn; sau đó chu kỳ tính lại từ nhịp trễ đó, vì vậy đo từ nhịp trước tách riêng được từng lần nghẽn. Giá trị lớn nhất là con số bài học so với độ dài việc chặn (2871 ms tính toán ⇒ trễ 2873 ms).'],
    kn: ['event-loop lag', 'measurement'],
    tns: TN,
    viDu: [{ input: 'lagReport(0, [100, 200, 3073, 3173], 100)', output: '{"maxLateMs":2773,"lateBeats":1,"status":"users feel it"}', explanation: 'The third beat waited behind the blocking loop.|||Nhịp thứ ba chờ sau vòng lặp chặn.' }],
    dau: `function lagReport(start, beats, interval) {
  let max = 0;
  beats.forEach((t, k) => {
    const late = t - (start + (k + 1) * interval);
    if (late > max) max = late;
  });
  return { maxLateMs: max, lateBeats: 0, status: max < 10 ? 'healthy' : 'investigate' };
}
`,
    giai: `// Same formula as the lesson's heartbeat: late = now - prev - interval.
function lagReport(start, beats, interval) {
  let prev = start;
  let max = 0;
  let lateBeats = 0;
  for (const t of beats) {
    const late = t - prev - interval;   // measured from the PREVIOUS beat
    if (late > max) max = late;
    if (late >= 50) lateBeats += 1;
    prev = t;                           // the next interval starts from this beat
  }
  const status = max < 10 ? 'healthy' : max < 500 ? 'investigate' : 'users feel it';
  return { maxLateMs: max, lateBeats, status };
}
`,
    cases: [
      { moTa: ['one long block (the lesson experiment)', 'một lần chặn dài (thí nghiệm của bài)'], goi: 'lagReport(0, [100, 200, 3073, 3173], 100)' },
      { moTa: ['a healthy loop', 'vòng lặp khoẻ'], goi: 'lagReport(1000, [1101, 1202, 1302, 1405], 100)' },
      { moTa: ['no beats yet', 'chưa có nhịp nào'], goi: 'lagReport(0, [], 100)' },
      { an: true, goi: 'lagReport(500, [560, 680, 740, 860, 920], 50)' },
      { an: true, goi: '[lagReport(0, [100, 299, 399], 100), lagReport(0, [100, 609], 100), lagReport(0, [109], 100)]' },
    ],
  }),

  jsBai({
    ten: 'Two waves: simulate libuv\'s thread pool',
    kho: 'MEDIUM', phut: 14,
    en: `<p>"Tasks 1–4 finish around 50–63 ms; tasks 5–8 only start once a thread frees up and land at 100–131 ms. Two clean waves — you are literally watching a pool of four workers." Write <code>poolFinishTimes(durations, poolSize)</code>: tasks are submitted at time 0 in array order; each starts on the thread that becomes free <b>earliest</b> (ties: any), runs for <code>durations[i]</code> ms, and nothing else interrupts it. Return the finish time of every task, in input order.</p>${pre("poolFinishTimes([50, 50, 50, 50, 50, 50, 50, 50], 4)   // [50, 50, 50, 50, 100, 100, 100, 100]\npoolFinishTimes([50, 50, 50, 50, 50, 50, 50, 50], 8)   // all 50 — UV_THREADPOOL_SIZE=8\npoolFinishTimes([300, 10, 10, 10, 10], 2)              // [300, 10, 20, 30, 40]")}`,
    vi: `<p>"Tác vụ 1–4 xong khoảng 50–63 ms; 5–8 chỉ bắt đầu khi có luồng rảnh và xong ở 100–131 ms. Hai đợt rõ rệt — bạn đang nhìn tận mắt một nhóm bốn luồng." Viết poolFinishTimes(durations, poolSize): tác vụ nộp lúc 0 theo thứ tự mảng; mỗi tác vụ chạy trên luồng rảnh SỚM NHẤT, chạy durations[i] ms. Trả thời điểm xong của từng tác vụ theo thứ tự đầu vào.</p>`,
    yc: [
      ['Simulate exactly <code>poolSize</code> threads; a task starts when it reaches the front of the queue and a thread is free.', 'Mô phỏng đúng poolSize luồng; tác vụ bắt đầu khi tới đầu hàng và có luồng rảnh.'],
      ['Return finish times in input order.', 'Trả thời điểm xong theo thứ tự đầu vào.'],
      ['<code>durations</code> must not be modified.', 'Không sửa durations.'],
    ],
    goiY: [['Keep an array <code>free</code> of length poolSize: the time each thread becomes free (all 0 at the start).', 'Giữ mảng free dài poolSize: thời điểm mỗi luồng rảnh (ban đầu đều 0).'], ['For each task: pick the index with the smallest <code>free[j]</code>; start = free[j]; finish = start + duration; <code>free[j] = finish</code>.', 'Mỗi tác vụ: chọn chỉ số có free[j] nhỏ nhất; start = free[j]; finish = start + duration; free[j] = finish.']],
    loi: [['Assuming "wave k" for task i = floor(i / poolSize) × duration — breaks as soon as durations differ (a long task holds its thread while the others keep going).', 'Giả sử tác vụ i thuộc đợt floor(i / poolSize) × duration — sai ngay khi thời lượng khác nhau (tác vụ dài giữ luồng trong khi các luồng khác chạy tiếp).'], ['Giving each task its own thread (no limit) — that is the UV_THREADPOOL_SIZE=8 run, not the default.', 'Cho mỗi tác vụ một luồng (không giới hạn) — đó là lượt UV_THREADPOOL_SIZE=8, không phải mặc định.']],
    gt: ['A fixed pool is a tiny scheduler: the next task in the queue goes to whichever thread frees up first. With equal durations that produces the clean waves of the lesson; with one slow task, the other threads keep draining the queue around it. The same model explains why four concurrent password hashes make an unrelated file read wait: it is just the fifth task in the queue.',
      'Một nhóm cố định là một bộ lập lịch nhỏ: tác vụ kế tiếp trong hàng vào luồng nào rảnh trước. Thời lượng bằng nhau cho ra các đợt rõ như bài; có một tác vụ chậm thì các luồng khác vẫn xả hàng quanh nó. Cùng mô hình đó giải thích vì sao bốn lần băm mật khẩu đồng thời bắt một lần đọc tệp không liên quan phải chờ: nó chỉ là tác vụ thứ năm trong hàng.'],
    kn: ['thread pool', 'queueing', 'UV_THREADPOOL_SIZE'],
    tns: TN,
    viDu: [{ input: 'poolFinishTimes([50, 50, 50, 50, 50, 50, 50, 50], 4)', output: '[50,50,50,50,100,100,100,100]', explanation: 'Two waves of four.|||Hai đợt bốn.' }],
    dau: `function poolFinishTimes(durations, poolSize) {
  return durations.map((d) => d);
}
`,
    giai: `// A fixed pool of threads: each task, in order, takes the thread that frees up first.
function poolFinishTimes(durations, poolSize) {
  const free = new Array(poolSize).fill(0); // when each thread becomes free
  return durations.map((d) => {
    let j = 0;
    for (let k = 1; k < poolSize; k++) if (free[k] < free[j]) j = k; // earliest-free thread
    const finish = free[j] + d; // start when that thread is free, run d ms
    free[j] = finish;
    return finish;
  });
}
`,
    cases: [
      { moTa: ['8 equal tasks, pool of 4 ⇒ two waves', '8 tác vụ bằng nhau, nhóm 4 ⇒ hai đợt'], goi: 'poolFinishTimes([50, 50, 50, 50, 50, 50, 50, 50], 4)' },
      { moTa: ['pool of 8 ⇒ one wave', 'nhóm 8 ⇒ một đợt'], goi: 'poolFinishTimes([50, 50, 50, 50, 50, 50, 50, 50], 8)' },
      { moTa: ['one slow task does not hold up the others', 'một tác vụ chậm không giữ chân các tác vụ khác'], goi: 'poolFinishTimes([300, 10, 10, 10, 10], 2)' },
      { an: true, goi: 'poolFinishTimes([49, 54, 61, 63, 51, 59, 60, 68], 4)' },
      { an: true, goi: '[poolFinishTimes([], 4), poolFinishTimes([5, 5, 5], 1), poolFinishTimes([100, 1, 1, 1, 1, 1], 3)]' },
    ],
  }),

  cs({
    ten: 'Measuring in production: numbers that fool people',
    kho: 'MEDIUM', phut: 8,
    en: 'Questions about the measurements of lesson 2.4.',
    vi: 'Các câu hỏi về những phép đo của bài 2.4.',
    cau: [
      q('m1', ['An idle service uses <code>monitorEventLoopDelay({ resolution: 20 })</code> and reports p99 ≈ 21 ms. How much real loop delay is that?', 'Dịch vụ rảnh dùng monitorEventLoopDelay({ resolution: 20 }) báo p99 ≈ 21 ms. Độ trễ thật là bao nhiêu?'],
        ['About 1 ms — the histogram includes the 20 ms sampling gap itself', '21 ms — above the 10 ms healthy line, so investigate now', '41 ms — the resolution has to be added, not subtracted', '0 ms — an idle loop never has any delay, the number is noise'],
        ['The sampler wakes every <code>resolution</code> ms and records how long it actually slept, so the resolution is inside every sample. Subtract it before comparing with the thresholds (we measured p99 ≈ 22 ms idle on Node 22).', 'Bộ lấy mẫu thức dậy mỗi resolution ms và ghi nó thật sự ngủ bao lâu, nên resolution nằm trong mọi mẫu. Trừ nó đi trước khi so với ngưỡng (đo được p99 ≈ 22 ms khi rảnh trên Node 22).']),
      q('m2', ['One endpoint does 2.9 s of synchronous work. 200 users call it at the same moment. Roughly how long does the 200th wait?', 'Một endpoint làm 2,9 s việc đồng bộ. 200 người gọi cùng lúc. Người thứ 200 chờ khoảng bao lâu?'],
        ['About 10 minutes (200 × 2.9 s ≈ 580 s)', '2.9 s, like everyone else', 'About 29 s', 'It times out at 2.9 s'],
        ['They do not each wait 2.9 s — they queue behind one thread. That is how a single unoptimised endpoint takes down an entire API, and why "fast on my machine with one user" proves nothing.', 'Họ không mỗi người chờ 2,9 s — họ xếp hàng sau một luồng. Đó là cách một endpoint chưa tối ưu đánh sập cả API, và vì sao "nhanh trên máy tôi với một người" không chứng minh gì.']),
      q('m3', ['Eight async password hashes are slow in two waves. You set <code>UV_THREADPOOL_SIZE=64</code> on a 4-core server. What happens?', 'Tám lần băm async chậm thành hai đợt. Bạn đặt UV_THREADPOOL_SIZE=64 trên server 4 lõi. Chuyện gì xảy ra?'],
        ['Little gain: more threads than cores just compete for the same 4 cores', 'Every hash now finishes in one wave at full speed', 'The JS thread becomes 64× faster', 'Node refuses to start'],
        ['Raising the pool helps up to your core count (the lesson\'s 8-thread run on a 10-core laptop removed the waves). Past that, threads time-slice the same cores, and your JavaScript loops never go to the pool anyway.', 'Tăng nhóm có ích tới số lõi (lượt 8 luồng của bài trên laptop 10 lõi xoá được các đợt). Vượt quá đó, các luồng chia nhau cùng số lõi, và vòng lặp JavaScript của bạn không bao giờ vào nhóm.']),
      q('m4', ['During a 2 871 ms synchronous loop, which of these can the process still do?', 'Trong một vòng lặp đồng bộ 2 871 ms, process còn làm được gì?'],
        ['Nothing on the JS side: no new request, no response, no health check, no timer', 'Answer health checks, because they are tiny', 'Serve requests that do not touch the database', 'Run setTimeout callbacks that were already due'],
        ['"From outside, the server looked dead." Every callback, however small, needs the one JS thread. That is why the heartbeat came back 2 873 ms late — the same number as the computation.', '"Từ bên ngoài, server trông như đã chết." Callback nào, dù nhỏ, cũng cần luồng JS duy nhất. Vì vậy nhịp tim về trễ 2 873 ms — đúng bằng thời gian tính toán.']),
    ],
    goiY: [['A sampling histogram includes its own sampling interval.', 'Biểu đồ lấy mẫu gồm cả khoảng lấy mẫu của chính nó.'], ['One thread ⇒ requests form a queue; waits add up.', 'Một luồng ⇒ request thành hàng đợi; thời gian chờ cộng dồn.']],
    loi: [['Alerting on raw p99 without subtracting the resolution — every idle service looks "slow".', 'Cảnh báo theo p99 thô mà không trừ resolution — mọi dịch vụ rảnh đều trông "chậm".'], ['Fixing a blocking endpoint by raising UV_THREADPOOL_SIZE — JS loops never run on the pool.', 'Sửa endpoint chặn bằng cách tăng UV_THREADPOOL_SIZE — vòng lặp JS không chạy trên nhóm luồng.']],
    tns: TN,
  }),

  jsBai({
    ten: 'ReDoS: a tag validator that cannot freeze the loop',
    kho: 'HARD', phut: 16,
    en: `<p>"A regex on user input can backtrack exponentially — a 30-character string can hang the loop for minutes." The Notes API validates tags with the starter's <code>/^([a-z0-9]+-?)+$/</code>. On <code>'aaaaaaaaaaaaaaaaaaaaaaaaaa!'</code> it tries every way to split the letters between the groups before failing — measured on Node 22: 24 letters 111 ms, 26 letters 447 ms, ×4 every two more letters.</p>
<p>Write <code>isValidTag(tag)</code> with the same intent but linear time:</p>
<ul><li>A tag is one or more groups of <code>a–z</code> / <code>0–9</code> joined by <b>single</b> hyphens: <code>node</code>, <code>node-js</code>, <code>es2024</code>, <code>a-b-c</code>.</li>
<li>No hyphen at the start or end, no double hyphen, no uppercase, no spaces; length 1–40.</li>
<li>Must return <code>false</code> quickly for a 30-character attack string (the grader stops code that runs longer than about 1 s).</li></ul>`,
    vi: `<p>"Regex trên dữ liệu người dùng có thể quay lui theo hàm mũ — một chuỗi 30 ký tự có thể treo vòng lặp nhiều phút." Notes API kiểm tag bằng /^([a-z0-9]+-?)+$/ của code khởi đầu. Viết isValidTag(tag) cùng ý nhưng thời gian tuyến tính: một hoặc nhiều nhóm a–z/0–9 nối bằng MỘT dấu gạch; không gạch ở đầu/cuối, không gạch đôi, không chữ hoa, không khoảng trắng; dài 1–40; phải trả false nhanh với chuỗi tấn công 30 ký tự.</p>`,
    yc: [
      ['Accept exactly: groups of <code>[a-z0-9]</code> separated by single <code>-</code>, length 1–40.', 'Chấp nhận đúng: nhóm [a-z0-9] cách nhau bởi một -, dài 1–40.'],
      ['Reject a trailing hyphen (the starter accepts <code>node-</code>).', 'Từ chối gạch ở cuối (code khởi đầu chấp nhận node-).'],
      ['Finish fast on any input: no nested quantifiers that can split the same characters many ways.', 'Xong nhanh với mọi đầu vào: không lượng từ lồng nhau có thể chia cùng các ký tự theo nhiều cách.'],
    ],
    goiY: [['The problem is <code>(X+)+</code>: the outer and inner <code>+</code> can share the same letters in exponentially many ways. Make every character belong to exactly one place.', 'Vấn đề là (X+)+: + ngoài và + trong chia nhau cùng các chữ theo số cách hàm mũ. Làm cho mỗi ký tự chỉ thuộc đúng một chỗ.'], ['Shape: first group, then zero or more "hyphen + group": <code>/^[a-z0-9]+(?:-[a-z0-9]+)*$/</code>. The mandatory hyphen separates the groups, so there is only one way to match.', 'Dạng: nhóm đầu, rồi không hoặc nhiều "gạch + nhóm": /^[a-z0-9]+(?:-[a-z0-9]+)*$/. Dấu gạch bắt buộc ngăn các nhóm nên chỉ có một cách khớp.'], ['Check the length first with <code>typeof tag === \'string\' && tag.length &gt;= 1 &amp;&amp; tag.length &lt;= 40</code> — cheap, and it also caps the regex\'s work.', 'Kiểm độ dài trước — rẻ, và cũng giới hạn việc của regex.']],
    loi: [['Making the hyphen optional inside a repeated group (<code>-?</code>) — that is exactly what creates the many ways to split.', 'Để dấu gạch tuỳ chọn trong nhóm lặp (-?) — chính nó tạo ra vô số cách chia.'], ['Testing only with valid tags — ReDoS only shows on input that almost matches and then fails at the end.', 'Chỉ thử với tag hợp lệ — ReDoS chỉ lộ ra với đầu vào gần khớp rồi hỏng ở cuối.'], ['Adding a length check AFTER the regex — the regex has already run on the attack string.', 'Kiểm độ dài SAU regex — regex đã chạy trên chuỗi tấn công rồi.']],
    gt: ['In <code>^([a-z0-9]+-?)+$</code> a run of n letters with no hyphen can be divided among the repetitions of the outer group in 2<sup>n-1</sup> ways, and when the final <code>!</code> makes the match fail the engine tries all of them — on the one JS thread, so the whole server stops. In <code>^[a-z0-9]+(?:-[a-z0-9]+)*$</code> every repetition must start with a hyphen, so each character has exactly one place to go and a failure is detected in one pass. The length cap is defence in depth.',
      'Trong ^([a-z0-9]+-?)+$, một dãy n chữ không có gạch có thể chia cho các lần lặp của nhóm ngoài theo 2^(n-1) cách, và khi dấu ! cuối làm khớp thất bại, bộ máy thử hết — trên luồng JS duy nhất, nên cả server dừng. Trong ^[a-z0-9]+(?:-[a-z0-9]+)*$, mỗi lần lặp phải bắt đầu bằng gạch, nên mỗi ký tự chỉ có đúng một chỗ và thất bại được phát hiện trong một lượt. Trần độ dài là lớp phòng thủ thêm.'],
    kn: ['ReDoS', 'regular expressions', 'blocking the event loop'],
    tns: TN,
    viDu: [{ input: "[isValidTag('node-js'), isValidTag('node-'), isValidTag('a'.repeat(30) + '!')]", output: '[true,false,false]', explanation: 'The starter accepts node- and hangs on the third.|||Code khởi đầu nhận node- và treo ở cái thứ ba.' }],
    dau: `function isValidTag(tag) {
  return /^([a-z0-9]+-?)+$/.test(tag);
}
`,
    giai: `// Linear-time tag check. Every character has exactly ONE place to match:
// a first group, then any number of "-group" (the hyphen is mandatory there),
// so a failing input is rejected in a single pass — no catastrophic backtracking.
const TAG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isValidTag(tag) {
  if (typeof tag !== 'string' || tag.length < 1 || tag.length > 40) return false; // cheap guard first
  return TAG.test(tag);
}
`,
    cases: [
      { moTa: ['valid tags', 'tag hợp lệ'], goi: "['node', 'node-js', 'es2024', 'a-b-c'].map(isValidTag)" },
      { moTa: ['invalid tags (trailing, leading, double hyphen, uppercase, space)', 'tag không hợp lệ'], goi: "['node-', '-node', 'node--js', 'Node', 'node js', ''].map(isValidTag)" },
      { moTa: ['30-character attack string returns false quickly', 'chuỗi tấn công 30 ký tự trả false nhanh'], goi: "isValidTag('a'.repeat(30) + '!')" },
      { an: true, goi: "[isValidTag('a1-b2-c3-d4-e5-f6-g7-h8-i9-j0'), isValidTag('x'.repeat(40)), isValidTag('x'.repeat(41)), isValidTag(42)]" },
      { an: true, goi: "[isValidTag('ab1'.repeat(10) + '-'), isValidTag('a-'.repeat(15) + '!'), isValidTag('z'.repeat(32) + '_')]" },
    ],
  }),
]);
