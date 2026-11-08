/** Node.js 15.1 — Ba trụ cột, console.log vs pino, event loop bị đứng, che bí mật, cấp độ log. */
import { modul, cs, q, qn, tn, jsBai, nguon, goi } from './_node-c15-18.mjs';

const E1 = cs({
  ten: 'Three pillars, and what the 100,000-line benchmark really measured', kho: 'EASY', phut: 7,
  en: 'Questions on the measurements of lesson 15.1: which pillar answers which question, why pino beat console.log, and what one burst of logging does to the event loop.',
  vi: 'Câu hỏi về các phép đo của bài 15.1: trụ cột nào trả lời câu hỏi nào, vì sao pino thắng console.log, và một loạt log làm gì với event loop.',
  cau: [
    q('c1', ['An alert fires: “5xx rate rose from 0.1% to 4% in 10 minutes”. Which pillar told you that, and which one tells you WHAT exactly happened to one failing request?', 'Cảnh báo bật: “tỉ lệ 5xx tăng từ 0,1% lên 4% trong 10 phút”. Trụ cột nào báo điều đó, và trụ cột nào cho biết CHÍNH XÁC chuyện gì xảy ra với một request lỗi?'],
      ['A metric said THAT it is wrong; the log line of that request says WHAT happened', 'A trace said THAT it is wrong; the metric of that request says WHAT happened', 'A log said THAT it is wrong; the trace of that request says WHAT happened', 'A metric said THAT it is wrong; another metric with a user label says WHAT happened'],
      ['Metric = that, trace = where, log = what. Incidents usually walk them in that order. Debugging with metrics is impossible: a metric contains no single request.', 'Metric = có chuyện, trace = ở đâu, log = chuyện gì. Sự cố thường đi theo thứ tự đó. Gỡ lỗi bằng metric là bất khả: metric không chứa request riêng lẻ nào.']),
    q('c2', ['100,000 lines: console.log 417.3 ms, pino to stdout 172.8 ms, pino with sync: true 526.8 ms. What made pino fast?', '100.000 dòng: console.log 417,3 ms, pino ra stdout 172,8 ms, pino với sync: true 526,8 ms. Điều gì làm pino nhanh?'],
      ['Buffering: lines are collected in memory and written in one big write() later', 'JSON itself: a JSON line is cheaper to print than a plain text line', 'Fewer bytes: pino writes shorter lines than console.log does', 'Worker threads: pino always formats lines on another CPU core'],
      ['The same pino with sync: true dropped back to console.log speed, so the library was never the variable — buffering was. pino even wrote MORE bytes (17 MB vs 10.4 MB).', 'Cùng pino mà sync: true thì tụt về tốc độ console.log, nên thư viện không phải biến số — bộ đệm mới là. pino còn ghi NHIỀU byte hơn (17 MB so với 10,4 MB).']),
    q('c3', ['A heartbeat setInterval(…, 20) was late by up to 371 ms while console.log wrote a burst to a FILE. What happened during those 371 ms?', 'Một nhịp setInterval(…, 20) bị trễ tới 371 ms trong lúc console.log ghi một loạt vào FILE. Trong 371 ms đó chuyện gì xảy ra?'],
      ['Nothing else ran: each write to the file blocked the event loop until the kernel took the bytes', 'Only timers stopped; requests and promises kept being handled on other threads', 'The garbage collector ran, because console.log allocates a string per line', 'The disk was full, so Node retried each write until the kernel accepted it'],
      ['stdout pointing to a file is written synchronously: no request parsed, no promise resolved, no timer fired. It never shows in your logs, because the thing that would log it is the thing being blocked.', 'stdout trỏ vào file được ghi đồng bộ: không request nào được đọc, không promise nào resolve, không timer nào chạy. Nó không bao giờ hiện trong log, vì thứ lẽ ra ghi log chính là thứ đang bị chặn.']),
    q('c4', ['The same burst into a pipe that nobody reads (a stalled Docker log driver) took only 78 ms in a Linux container. Why is that NOT good news?', 'Cùng loạt log đó vào một pipe không ai đọc (log driver của Docker bị kẹt) chỉ mất 78 ms trong container Linux. Vì sao đó KHÔNG phải tin tốt?'],
      ['The 10.3 MB waits in the process’s own memory, and it grows without limit while the consumer stalls', 'The lines are silently dropped by Docker, so the incident leaves no evidence at all', 'The pipe compresses the lines, so the log store later receives a corrupted file', 'Docker restarts the container when the pipe is full, so all in-flight requests are lost'],
      ['RSS went 50 → 88 MB: a latency spike was traded for a memory leak. The only good answer is buffered AND bounded.', 'RSS tăng 50 → 88 MB: đổi một cú trễ lấy một chỗ rò bộ nhớ. Câu trả lời đúng duy nhất: có bộ đệm VÀ có giới hạn.']),
    qn('c5', ['Which statements about log levels are true, measured in this lesson? (choose all that apply)', 'Những câu nào về cấp độ log là đúng theo phép đo của bài? (chọn mọi câu đúng)'],
      ['log.debug() at level warn costs about 5 ns, but its argument expression still runs', 'if (log.isLevelEnabled(\'debug\')) stops an expensive argument from being computed', 'log.debug() at level warn costs nothing, because Node skips the call and its arguments', 'Every log.info() you write is a line you will pay for in production'],
      [0, 1, 3],
      ['JavaScript evaluates arguments BEFORE calling the function: countEverything() ran 1,000 times out of 1,000 although nothing was written. Guard expensive arguments; debug calls themselves are cheap.', 'JavaScript tính đối số TRƯỚC khi gọi hàm: countEverything() chạy 1.000/1.000 lần dù không ghi gì. Hãy rào các đối số đắt; bản thân lời gọi debug thì rẻ.']),
  ],
  goiY: [['Remember the three words: that, where, what.', 'Nhớ ba chữ: có chuyện, ở đâu, chuyện gì.'], ['Look at the row that changed only one thing (sync: true) — it tells you what the variable was.', 'Nhìn dòng chỉ đổi một thứ (sync: true) — nó cho biết biến số là gì.']],
  loi: [['Concluding “JSON is slow” without measuring: structure was never the slow part.', 'Kết luận “JSON chậm” mà không đo: cấu trúc chưa bao giờ là phần chậm.'], ['Thinking a skipped debug() line is free even when its argument is a database query.', 'Nghĩ dòng debug() bị bỏ qua là miễn phí dù đối số của nó là một truy vấn DB.']],
  tns: [tn('structured log', 'log có cấu trúc', 'each line is a JSON record a machine can query'), tn('buffering', 'gom bộ đệm', 'collect lines in memory, write them in one system call'), tn('event-loop lag', 'độ trễ event loop', 'how late a timer fires because the loop was busy')],
  kn: ['logging', 'observability', 'event loop'],
});

function worstLag(beats, interval) {
  // beats[i] = thời điểm (ms) nhịp thứ i THẬT SỰ chạy; mỗi nhịp lẽ ra cách nhịp trước đúng `interval` ms.
  let worst = 0;
  for (let i = 1; i < beats.length; i++) {
    const lag = beats[i] - beats[i - 1] - interval;   // now - last - 20 như đoạn mã của bài
    if (lag > worst) worst = lag;                       // giữ giá trị TỆ NHẤT, không lấy trung bình
  }
  return worst;                                         // < 2 nhịp, hoặc mọi nhịp đúng giờ ⇒ 0
}
const E2 = await jsBai({
  ten: 'worstLag(beats, interval): the heartbeat that caught the 371 ms freeze', kho: 'EASY', phut: 8,
  en: '<p>The lesson measured how a burst of logging freezes the event loop with a heartbeat: <code>setInterval(fn, 20)</code>, and on each beat <code>lag = now - last - 20</code>, keeping the <b>worst</b> value. Write <code>worstLag(beats, interval)</code>: <code>beats</code> is the array of times (ms) at which the beat really ran, in order. Return the largest lag between two consecutive beats, or <code>0</code> if no beat was late (or there are fewer than two beats).</p>',
  vi: '<p>Bài đo việc một loạt log làm đứng event loop bằng một “nhịp tim”: <code>setInterval(fn, 20)</code>, mỗi nhịp tính <code>lag = now - last - 20</code> và giữ giá trị <b>tệ nhất</b>. Viết <code>worstLag(beats, interval)</code>: <code>beats</code> là mảng thời điểm (ms) nhịp thật sự chạy, theo thứ tự. Trả về độ trễ lớn nhất giữa hai nhịp liền nhau, hoặc <code>0</code> nếu không nhịp nào trễ (hoặc có ít hơn hai nhịp).</p>',
  dauVao: ['beats — number[] (ms, increasing); interval — number (ms)', 'beats — number[] (ms, tăng dần); interval — number (ms)'],
  dauRa: ['number — the worst lag in ms (≥ 0)', 'number — độ trễ tệ nhất tính bằng ms (≥ 0)'],
  goiY: [['Lag of beat i = beats[i] − beats[i−1] − interval.', 'Độ trễ của nhịp i = beats[i] − beats[i−1] − interval.'], ['Keep a running maximum that starts at 0; an early beat (negative lag) never counts.', 'Giữ một giá trị lớn nhất bắt đầu từ 0; nhịp tới sớm (độ trễ âm) không tính.']],
  loi: [['Returning the average lag: one 371 ms freeze averaged over 1,000 beats looks like 0.4 ms — exactly the spike you wanted to see.', 'Trả về độ trễ trung bình: một cú đứng 371 ms chia cho 1.000 nhịp trông như 0,4 ms — đúng cái gai bạn muốn thấy bị xoá mất.'], ['Measuring from the start (beats[i] − beats[0]) instead of from the previous beat.', 'Đo từ đầu (beats[i] − beats[0]) thay vì từ nhịp ngay trước.']],
  gt: ['A blocked loop delays the NEXT beat, so the gap between two consecutive beats grows by the blocked time. The maximum is the number that matters: users wait during the worst freeze, not during the average one.', 'Event loop bị chặn làm nhịp KẾ TIẾP tới muộn, nên khoảng cách giữa hai nhịp liền nhau dài thêm đúng bằng thời gian bị chặn. Giá trị lớn nhất mới là con số quan trọng: người dùng chờ trong cú đứng tệ nhất, không phải cú trung bình.'],
  kn: ['event loop', 'measurement'],
  tns: [tn('heartbeat', 'nhịp tim', 'a timer used to detect that the loop was busy'), tn('lag', 'độ trễ')],
  dau: `/** worst event-loop lag seen by a heartbeat */
function worstLag(beats, interval) {
  // Write your solution here
  if (beats.length < 2) return 0;
  const total = beats[beats.length - 1] - beats[0];
  return total / (beats.length - 1) - interval;   // average gap — is that what we want?
}
`,
  giai: '// Reference solution\n' + nguon(worstLag),
  cases: [
    { goi: goi('worstLag', [0, 20, 40, 411, 431], 20), moTa: ['A 371 ms freeze between two beats', 'Một cú đứng 371 ms giữa hai nhịp'] },
    { goi: goi('worstLag', [0, 21, 41, 62], 20), moTa: ['A healthy loop: at most 1 ms late', 'Event loop khoẻ: trễ tối đa 1 ms'] },
    { goi: goi('worstLag', [100], 20), an: true },
    { goi: goi('worstLag', [0, 20, 197, 217, 237, 239], 20), an: true },
    { goi: goi('worstLag', [0, 19, 38, 57], 20), an: true },
  ],
});

function redactUrl(url) {
  // Chỉ thay GIÁ TRỊ của đúng hai tham số token và code; mọi thứ khác giữ nguyên từng ký tự (không mã hoá lại).
  // ([?&]) bắt dấu mở đầu tham số ⇒ "mytoken=" hay "barcode=" không bị đụng; giá trị dừng ở & hoặc #.
  return url.replace(/([?&])(token|code)=([^&#]*)/g, '$1$2=[REDACTED]');
}
const E3 = await jsBai({
  ten: 'redactUrl(url): the morgan :url override that keeps ?token= out of the access log', kho: 'MEDIUM', phut: 10,
  en: '<p>Some endpoints of the website accept a JWT as <code>?token=</code> (SSE streaming), so morgan’s default <code>:url</code> would write the token into every access-log line. The site redefines the url token so the value of <code>token</code> and <code>code</code> becomes <code>[REDACTED]</code>. Write <code>redactUrl(url)</code>: replace the value (possibly empty) of every query parameter named exactly <code>token</code> or <code>code</code> with <code>[REDACTED]</code>. Everything else — path, other parameters, their order, a <code>#fragment</code> — stays byte-for-byte the same.</p>',
  vi: '<p>Vài endpoint của website nhận JWT qua <code>?token=</code> (SSE), nên <code>:url</code> mặc định của morgan sẽ ghi token vào mọi dòng access log. Website định nghĩa lại token url để giá trị của <code>token</code> và <code>code</code> thành <code>[REDACTED]</code>. Viết <code>redactUrl(url)</code>: thay giá trị (có thể rỗng) của mọi tham số query tên đúng là <code>token</code> hoặc <code>code</code> bằng <code>[REDACTED]</code>. Mọi thứ khác — đường dẫn, tham số khác, thứ tự, <code>#fragment</code> — giữ nguyên từng byte.</p>',
  dauVao: ['url — the request URL as morgan sees it (path + query)', 'url — URL của request như morgan thấy (đường dẫn + query)'],
  dauRa: ['string — the same URL with the two values hidden', 'string — cùng URL với hai giá trị bị che'],
  goiY: [['A parameter starts right after ? or &. Match that character too, so mytoken= is not a match.', 'Một tham số bắt đầu ngay sau ? hoặc &. Bắt cả ký tự đó, để mytoken= không bị khớp.'], ['The value ends at the next & or # (or the end): [^&#]*. Use the g flag — a URL can carry both.', 'Giá trị dừng ở & hoặc # kế tiếp (hoặc hết chuỗi): [^&#]*. Dùng cờ g — URL có thể mang cả hai.']],
  loi: [['/token=[^&]*/ also rewrites ?mytoken=… and misses code= entirely.', '/token=[^&]*/ sửa cả ?mytoken=… và bỏ sót hoàn toàn code=.'], ['Parsing with URLSearchParams and printing it back: it re-encodes other values, so the log line no longer matches what the client sent.', 'Phân tích bằng URLSearchParams rồi in lại: nó mã hoá lại các giá trị khác, nên dòng log không còn khớp thứ client gửi.']],
  gt: ['This is the same leak the lesson found in pino-http (authorization and cookie headers in plaintext), blocked in advance for the URL. A token in a 90-day log store is a 90-day incident: whoever can read the dashboard can become that user.', 'Đây là đúng chỗ rò bài học tìm thấy ở pino-http (header authorization và cookie ở dạng rõ), được chặn trước cho URL. Một token trong kho log 90 ngày là một sự cố kéo dài 90 ngày: ai đọc được dashboard đều trở thành người dùng đó.'],
  kn: ['logging', 'security', 'regex'],
  tns: [tn('access log', 'log truy cập', 'one line per request: method, url, status, time'), tn('redaction', 'che giấu', 'replacing a secret value before it is written')],
  dau: `/** hide ?token= and ?code= values in an access-log URL */
function redactUrl(url) {
  // Write your solution here
  return url.replace(/token=[^&]*/, 'token=[REDACTED]');
}
`,
  giai: '// Reference solution\n' + nguon(redactUrl),
  cases: [
    { goi: goi('redactUrl', '/api/v1/ai/stream?token=eyJhbGciOi.abc.def&lesson=12'), moTa: ['An SSE URL with a JWT', 'URL SSE kèm JWT'] },
    { goi: goi('redactUrl', '/api/v1/auth/google/callback?state=xyz&code=4/0AbCd'), moTa: ['An OAuth callback code', 'Mã code của OAuth callback'] },
    { goi: goi('redactUrl', '/notes?mytoken=keep&barcode=9&token=t1&code=c2#top'), an: true },
    { goi: goi('redactUrl', '/notes?page=2'), an: true },
    { goi: goi('redactUrl', '/x?token=&code='), an: true },
  ],
});

function redact(obj, paths) {
  // Ý nghĩa đường dẫn giống pino (đã chạy thật với pino 9): phân tách bằng ".", ["tên-có-gạch"] là một khoá,
  // và "*" khớp ĐÚNG MỘT khoá bất kỳ ở vị trí đó — "*.password" che body.password nhưng KHÔNG che password ở
  // gốc, cũng không che body.user.password.
  const out = structuredCloneLite(obj);                       // không sửa object gốc
  for (const p of paths) {
    const segs = p.match(/\["[^"]*"\]|[^.[\]]+/g).map((s) => (s.startsWith('["') ? s.slice(2, -2) : s));
    walk(out, segs);
  }
  return out;

  function walk(node, segs) {
    if (!node || typeof node !== 'object') return;
    const [head, ...rest] = segs;
    const keys = head === '*' ? Object.keys(node) : [head];
    for (const k of keys) {
      if (!Object.prototype.hasOwnProperty.call(node, k)) continue;  // không có ⇒ không thêm khoá mới
      if (rest.length === 0) node[k] = '[REDACTED]';
      else walk(node[k], rest);
    }
  }
  function structuredCloneLite(v) {
    if (Array.isArray(v)) return v.map(structuredCloneLite);
    if (v && typeof v === 'object') { const o = {}; for (const k of Object.keys(v)) o[k] = structuredCloneLite(v[k]); return o; }
    return v;
  }
}
const LOGIN = { req: { method: 'POST', url: '/auth/login', headers: { authorization: 'Bearer FAKE.jwt', cookie: 'backend_token=FAKE', 'user-agent': 'curl/8.7' } }, body: { email: 'an@example.com', password: 'FAKE-pass', refresh: { token: 'FAKE-rt' } }, res: { headers: { 'set-cookie': 'backend_token=FAKE2' } } };
const PATHS = ['req.headers.authorization', 'req.headers.cookie', 'res.headers["set-cookie"]', '*.password', '*.token'];
const E4 = await jsBai({
  ten: 'redact(obj, paths): pino-style redaction, including what *.password does NOT cover', kho: 'MEDIUM', phut: 15,
  en: '<p>Implement the redaction rule of the lesson’s pino config. <code>paths</code> uses pino’s syntax: segments separated by <code>.</code>; a segment in brackets like <code>["set-cookie"]</code> is one key; <code>*</code> matches <b>exactly one key, any name</b>, at that position. Return a <b>copy</b> of <code>obj</code> where every value at a matching path is replaced by the string <code>"[REDACTED]"</code>. A path that does not exist adds nothing.</p><p>Run for real with pino 9: with <code>*.password</code>, <code>body.password</code> is censored but a top-level <code>password</code> and <code>body.user.password</code> are <b>not</b>. Your function must behave the same way.</p>',
  vi: '<p>Cài đặt luật che của cấu hình pino trong bài. <code>paths</code> theo cú pháp pino: các đoạn phân tách bằng <code>.</code>; đoạn trong ngoặc như <code>["set-cookie"]</code> là một khoá; <code>*</code> khớp <b>đúng một khoá, tên bất kỳ</b>, ở vị trí đó. Trả về <b>bản sao</b> của <code>obj</code> trong đó mọi giá trị ở đường dẫn khớp được thay bằng chuỗi <code>"[REDACTED]"</code>. Đường dẫn không tồn tại thì không thêm gì.</p><p>Chạy thật với pino 9: với <code>*.password</code>, <code>body.password</code> bị che nhưng <code>password</code> ở gốc và <code>body.user.password</code> thì <b>không</b>. Hàm của bạn phải cư xử y như vậy.</p>',
  dauVao: ['obj — a plain JSON object (a log record); paths — string[]', 'obj — object JSON thuần (một bản ghi log); paths — string[]'],
  dauRa: ['a new object; obj itself is unchanged', 'object mới; obj giữ nguyên'],
  goiY: [['Split each path into segments first: /\\["[^"]*"\\]|[^.[\\]]+/g, then strip the [" "].', 'Tách mỗi đường dẫn thành các đoạn trước: /\\["[^"]*"\\]|[^.[\\]]+/g, rồi bỏ [" "].'], ['Walk recursively: at a "*" loop over Object.keys(node); at the last segment replace the value, but only if the key exists.', 'Duyệt đệ quy: gặp "*" thì lặp Object.keys(node); tới đoạn cuối thì thay giá trị, nhưng chỉ khi khoá có thật.']],
  loi: [['Treating *.password as “password anywhere”: it is one level, so a password logged at the top level or two levels deep is written in plaintext. List those paths too (password, *.*.password).', 'Hiểu *.password là “password ở bất kỳ đâu”: nó chỉ một tầng, nên password log ở gốc hay sâu hai tầng vẫn bị ghi rõ. Hãy liệt kê cả các đường đó (password, *.*.password).'], ['Mutating the record in place: the same object may still be used by the request handler after it was logged.', 'Sửa trực tiếp bản ghi: chính object đó có thể còn được handler dùng sau khi đã ghi log.']],
  gt: ['Redaction is a list of paths decided before the first deploy, not something every developer must remember. Knowing the exact reach of a wildcard is what keeps the list honest: the lesson’s login test only passed because the secrets sat exactly one level below the top.', 'Che bí mật là một danh sách đường dẫn chốt trước lần deploy đầu, không phải thứ mọi lập trình viên phải tự nhớ. Biết chính xác tầm với của ký tự đại diện mới giữ cho danh sách trung thực: bài kiểm tra login của bài học chỉ qua vì các bí mật nằm đúng một tầng dưới gốc.'],
  kn: ['logging', 'security', 'recursion'],
  tns: [tn('wildcard', 'ký tự đại diện', '* = any one key'), tn('censor', 'giá trị thay thế', 'the text written instead of the secret')],
  dau: `/** pino-style redaction */
function redact(obj, paths) {
  // Write your solution here
  const out = JSON.parse(JSON.stringify(obj));
  for (const p of paths) {
    const segs = p.split('.');
    let node = out;
    for (let i = 0; i < segs.length - 1; i++) node = node && node[segs[i]];
    if (node) node[segs[segs.length - 1]] = '[REDACTED]';
  }
  return out;
}
`,
  giai: '// Reference solution\n' + nguon(redact),
  cases: [
    { goi: goi('redact', LOGIN, PATHS), moTa: ['The login request of the lesson', 'Request đăng nhập của bài học'] },
    { goi: goi('redact', { password: 'top', body: { password: 'one', user: { password: 'two' } } }, ['*.password']), moTa: ['* is exactly one level (as pino 9 does)', '* đúng một tầng (như pino 9)'] },
    { goi: goi('redact', { msg: 'ok', req: { headers: {} } }, PATHS), an: true },
    { goi: `(() => { const o = ${JSON.stringify(LOGIN)}; redact(o, ${JSON.stringify(PATHS)}); return o.body.password; })()`, an: true, moTa: ['The input object is not modified', 'Object đầu vào không bị sửa'] },
    { goi: goi('redact', { a: { token: 1 }, b: { token: 2, c: { token: 3 } } }, ['*.token', '*.*.token']), an: true },
  ],
});

function createLogger(level, out, bindings = {}) {
  const LEVELS = { trace: 10, debug: 20, info: 30, warn: 40, error: 50 };
  const min = LEVELS[level];
  const log = { isLevelEnabled: (l) => LEVELS[l] >= min };
  for (const name of Object.keys(LEVELS)) {
    log[name] = (fields, msg) => {
      if (LEVELS[name] < min) return;                         // dưới ngưỡng: không làm gì, KHÔNG gọi hàm đối số
      const f = typeof fields === 'function' ? fields() : fields;   // đối số đắt viết dạng hàm ⇒ chỉ tính khi thật sự ghi
      out.push({ level: name, ...bindings, ...f, msg });
    };
  }
  // logger con mang thêm trường cố định (reqId…) — đúng thứ AsyncLocalStorage giữ ở bài 15.2
  log.child = (more) => createLogger(level, out, { ...bindings, ...more });
  return log;
}
const E5 = await jsBai({
  ten: 'createLogger(level, out): levels, lazy arguments and child loggers', kho: 'HARD', phut: 20,
  en: '<p>Write a tiny structured logger. Levels: <code>trace 10, debug 20, info 30, warn 40, error 50</code>. <code>createLogger(level, out)</code> returns an object with:</p><ul><li><code>trace/debug/info/warn/error(fields, msg)</code> — if the call’s level is ≥ the logger’s level, push <code>{ level: "&lt;name&gt;", ...bindings, ...fields, msg }</code> into the array <code>out</code>; otherwise do nothing;</li><li><code>fields</code> may be a <b>function</b>: call it only when the line is really written (the lesson’s <code>countEverything()</code> trap);</li><li><code>isLevelEnabled(name)</code> → boolean;</li><li><code>child(bindings)</code> → a logger with the same level and <code>out</code> whose lines also carry <code>bindings</code> (a child of a child carries both).</li></ul>',
  vi: '<p>Viết một logger có cấu trúc nhỏ. Cấp độ: <code>trace 10, debug 20, info 30, warn 40, error 50</code>. <code>createLogger(level, out)</code> trả về object có:</p><ul><li><code>trace/debug/info/warn/error(fields, msg)</code> — nếu cấp của lời gọi ≥ cấp của logger thì đẩy <code>{ level: "&lt;tên&gt;", ...bindings, ...fields, msg }</code> vào mảng <code>out</code>; không thì không làm gì;</li><li><code>fields</code> có thể là <b>hàm</b>: chỉ gọi khi dòng thật sự được ghi (bẫy <code>countEverything()</code> của bài);</li><li><code>isLevelEnabled(name)</code> → boolean;</li><li><code>child(bindings)</code> → logger cùng cấp và cùng <code>out</code>, mỗi dòng mang thêm <code>bindings</code> (con của con mang cả hai).</li></ul>',
  yc: [['Push plain objects into out (no JSON string).', 'Đẩy object thuần vào out (không phải chuỗi JSON).'], ['Field order in a line: level, bindings, fields, msg (later keys win).', 'Thứ tự trường trong một dòng: level, bindings, fields, msg (khoá sau thắng).']],
  goiY: [['Keep a table LEVELS = { trace: 10, … } and compare numbers, not names.', 'Giữ bảng LEVELS = { trace: 10, … } và so số, không so tên.'], ['child can simply call createLogger again with the merged bindings — same level, same out array.', 'child chỉ cần gọi lại createLogger với bindings đã gộp — cùng cấp, cùng mảng out.']],
  loi: [['Evaluating a function argument before checking the level: nothing is written, yet the expensive work runs on every call, forever.', 'Tính đối số dạng hàm trước khi xét cấp: không ghi gì mà việc đắt vẫn chạy ở mọi lời gọi, mãi mãi.'], ['Comparing level names as strings: "warn" > "info" happens to work, "error" > "debug" does not.', 'So tên cấp như chuỗi: "warn" > "info" tình cờ đúng, "error" > "debug" thì sai.']],
  gt: ['A level is a threshold, and a skipped call must cost (almost) nothing — but JavaScript evaluates arguments before the call. Accepting a function and calling it only after the check is exactly what if (log.isLevelEnabled(\'debug\')) does by hand. child() is how a request id rides on every line (lesson 15.2).', 'Cấp độ là một ngưỡng, và một lời gọi bị bỏ qua phải (gần như) không tốn gì — nhưng JavaScript tính đối số trước khi gọi. Nhận một hàm và chỉ gọi nó sau khi xét cấp chính là việc if (log.isLevelEnabled(\'debug\')) làm bằng tay. child() là cách mã request đi theo mọi dòng (bài 15.2).'],
  kn: ['logging', 'closures'],
  tns: [tn('log level', 'cấp độ log', 'a threshold: calls below it are skipped'), tn('child logger', 'logger con', 'a logger that adds fixed fields to every line'), tn('lazy evaluation', 'tính trễ', 'compute only when the value is needed')],
  dau: `/** a tiny structured logger */
function createLogger(level, out, bindings = {}) {
  // Write your solution here
  const log = {};
  for (const name of ['trace', 'debug', 'info', 'warn', 'error']) {
    log[name] = (fields, msg) => {
      const f = typeof fields === 'function' ? fields() : fields;
      if (name >= level) out.push({ level: name, ...bindings, ...f, msg });
    };
  }
  log.isLevelEnabled = (l) => l >= level;
  log.child = (more) => createLogger(level, out, more);
  return log;
}
`,
  giai: '// Reference solution\n' + nguon(createLogger),
  cases: [
    { chuanBi: 'const out = []; const log = createLogger("info", out); log.debug({ a: 1 }, "hidden"); log.info({ route: "/notes" }, "list"); log.error({ code: "E1" }, "boom");', goi: 'out', moTa: ['Level info: debug skipped, info and error written', 'Cấp info: bỏ debug, ghi info và error'] },
    { chuanBi: 'const out = []; const log = createLogger("warn", out); let runs = 0; for (let i = 0; i < 1000; i++) log.debug(() => { runs++; return { rows: 42 }; }, "stats");', goi: '({ runs, written: out.length })', moTa: ['The countEverything() trap: 1,000 skipped calls', 'Bẫy countEverything(): 1.000 lời gọi bị bỏ qua'] },
    { chuanBi: 'const out = []; const log = createLogger("debug", out); const a = log.child({ reqId: "f360ef6b" }); const b = a.child({ userId: "an" }); b.debug(() => ({ rows: 3 }), "repo: done"); a.info({}, "route: reply");', goi: 'out', an: true },
    { chuanBi: 'const log = createLogger("warn", []);', goi: '["trace","debug","info","warn","error"].map((l) => log.isLevelEnabled(l))', an: true },
    { chuanBi: 'const out = []; const log = createLogger("error", out); log.warn({ x: 1 }, "w"); log.error({ code: "E2" }, "e");', goi: 'out', an: true },
  ],
});

export default modul('nodejs-15-1-log-co-cau-truc', '15.1 Structured logs, buffering, redaction and levels', [E1, E2, E3, E4, E5]);
