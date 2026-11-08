/** Node.js · 13.1 — Request không phải chỗ làm việc nặng: 202 + hàng đợi, 5/100 vs 100/100 email, giới hạn đồng thời, outbox. */
import { modul, cs, q, tn, ord, bang1, jsBai, c, TN, FAKE_HTTP } from './_node-c12-14.mjs';

const CHON = ['Queue it (background job)', 'Keep it in the request'];
const E1 = cs({
  ten: '13.1 · What belongs on a queue, and what does not', kho: 'EASY', phut: 8, loai: 'table',
  en: 'The lesson’s rule: a queue is for work whose answer the user does not need right now and that may fail on someone else’s side. It is NOT for anything needed immediately, anything that must run in the same transaction as the write, or work cheaper than enqueueing it.',
  vi: 'Quy tắc của bài: hàng đợi dành cho việc mà người dùng không cần câu trả lời ngay và có thể hỏng ở phía người khác. KHÔNG dành cho thứ cần ngay, thứ phải chạy cùng giao dịch với lệnh ghi, hay việc rẻ hơn cả chi phí xếp hàng.',
  bang: [bang1('b1', ['Work → where it runs', 'Việc → chạy ở đâu'], [{ ma: 'w', ten: 'Work' }, { ma: 'p', ten: 'Where', luaChon: CHON }], [
    { o: { w: 'Send the welcome email after sign-up' }, a: { p: CHON[0] } },
    { o: { w: 'Check the password at login' }, a: { p: CHON[1] } },
    { o: { w: 'Generate thumbnails for an uploaded image' }, a: { p: CHON[0] } },
    { o: { w: 'Insert the audit row that must commit together with the note update' }, a: { p: CHON[1] } },
    { o: { w: 'Export a 92-day usage report to CSV' }, a: { p: CHON[0] } },
    { o: { w: 'Format a 2 ms slug for the note being created' }, a: { p: CHON[1] } },
    { o: { w: 'Deliver an outbound webhook to a customer’s server' }, a: { p: CHON[0] } },
    { o: { w: 'Read the notes list the page is about to render' }, a: { p: CHON[1] } },
  ], ['Queue: email/SMS/push, third-party calls, thumbnails, video, search indexes, reports, webhooks, cleanup. Request: anything whose answer is needed now (password check, reads), work inside the same transaction, and work cheaper than a Redis round trip plus a worker wake-up — enqueueing a 2 ms job makes it slower and adds a moving part.', 'Hàng đợi: email/SMS/push, gọi bên thứ ba, ảnh thu nhỏ, video, chỉ mục tìm kiếm, báo cáo, webhook, dọn dẹp. Request: thứ cần câu trả lời ngay (kiểm mật khẩu, đọc dữ liệu), việc trong cùng giao dịch, và việc rẻ hơn một vòng Redis cộng một lần đánh thức worker — xếp hàng một việc 2 ms chỉ làm nó chậm hơn và thêm một bộ phận chuyển động.'])],
  goiY: [['Does the user need the result in THIS response?', 'Người dùng có cần kết quả trong CHÍNH câu trả lời này không?'], ['Does it depend on a server you do not control?', 'Nó có phụ thuộc vào máy chủ bạn không kiểm soát không?']],
  loi: [['Queueing the password check “for speed” — the login cannot answer until it is done anyway.', 'Đẩy kiểm mật khẩu vào hàng đợi "cho nhanh" — đằng nào đăng nhập cũng phải chờ nó xong mới trả lời được.'], ['Queueing work that must commit with the write: the job can run before the row exists, or after a rollback.', 'Xếp hàng việc phải commit cùng lệnh ghi: job có thể chạy trước khi dòng tồn tại, hoặc sau khi rollback.']],
  tns: [tn('background job', 'việc nền', 'làm ngoài vòng request/response'), tn('enqueue', 'xếp vào hàng đợi', 'ghi lại việc cần làm rồi trả lời ngay')],
  kn: ['background jobs'],
});

const E2 = cs({
  ten: '13.1 · Reading the 5-out-of-100 measurement', kho: 'EASY', phut: 8,
  en: 'One hundred users sign up at once; the SMTP server accepts 5 connections, takes 200 ms per message and answers 421 beyond that.',
  vi: 'Một trăm người đăng ký cùng lúc; máy chủ SMTP nhận 5 kết nối, mất 200 ms mỗi thư và trả 421 khi quá mức đó.',
  cau: [
    q('c1', ['Sending inline: HTTP 200 × 5, HTTP 500 × 95. Queued with concurrency 5: 202 × 100, 100 emails sent. What kind of difference is this?', 'Gửi ngay trong request: HTTP 200 × 5, HTTP 500 × 95. Xếp hàng với concurrency 5: 202 × 100, gửi đủ 100 thư. Đây là loại khác biệt gì?'],
      ['Correctness: inline, 95 emails were never sent and nothing remembers them', 'Performance only: the queue sends the same emails, just faster', 'Cosmetic: 500 and 202 both mean the email will arrive later', 'Capacity: the queue raised the SMTP limit from 5 to 100 connections'],
      ['The synchronous version did not send slowly — it did not send at all, for 95 people, and reported 500 to each of them.', 'Bản đồng bộ không gửi chậm — nó không gửi gì cả, cho 95 người, và báo 500 cho từng người.']),
    q('c2', ['Peak concurrent SMTP connections were 5 in BOTH runs. So what did the queue change?', 'Đỉnh kết nối SMTP đồng thời là 5 ở CẢ hai lần. Vậy hàng đợi đã đổi gì?'],
      ['It never asked for more than 5, and kept the rest for later', 'It made the SMTP server faster by batching messages', 'It retried the 95 rejected emails in parallel', 'It moved the SMTP connections into Redis'],
      ['A queue is, first of all, a place to put things down. The drain took 4,126 ms; nothing was lost.', 'Hàng đợi, trước hết, là chỗ để đặt việc xuống. Rút cạn mất 4.126 ms; không mất gì.']),
    q('c3', ['Why does the job carry { userId } and not the whole user object?', 'Vì sao job mang { userId } mà không mang cả đối tượng user?'],
      ['The worker re-reads the database, so it never acts on a stale snapshot from ten minutes ago', 'Redis cannot store nested objects in a job', 'BullMQ rejects jobs larger than 64 bytes', 'The user object contains a password hash that BullMQ encrypts'],
      ['A job created ten minutes ago with a full user object will happily email an address the user has since changed.', 'Một job tạo mười phút trước mang cả đối tượng user sẽ vui vẻ gửi thư tới địa chỉ mà người dùng đã đổi.']),
    q('c4', ['You call queue.add() inside the database transaction, before COMMIT. What can go wrong?', 'Bạn gọi queue.add() bên trong giao dịch CSDL, trước COMMIT. Điều gì có thể hỏng?'],
      ['The job may run before the row exists, or after a rollback', 'Nothing, because BullMQ waits for the transaction to commit', 'The transaction deadlocks with Redis', 'The job is silently dropped because the connection is busy'],
      ['Enqueue after the commit. If losing the job between commit and enqueue is unacceptable, write it as a row in the same transaction and let a sweeper move it (transactional outbox).', 'Xếp hàng sau commit. Nếu không chấp nhận mất job giữa commit và xếp hàng, ghi nó thành một dòng trong cùng giao dịch và để một tiến trình quét chuyển nó đi (transactional outbox).']),
    q('c5', ['The route still answers 201 after enqueueing the welcome email. When should it answer 202 Accepted instead?', 'Route vẫn trả 201 sau khi xếp hàng email chào mừng. Khi nào nên trả 202 Accepted?'],
      ['When the resource itself is not ready yet — e.g. a report that is still being generated', 'Always, because any background work makes the response asynchronous', 'Never: 202 is reserved for WebSocket upgrades', 'Only when the queue is longer than 100 jobs'],
      ['The user really was created, so 201. A report export returns 202 plus a job resource the client can poll (GET /jobs/:id).', 'Người dùng thật sự đã được tạo, nên 201. Xuất báo cáo trả 202 kèm một tài nguyên job để client hỏi lại (GET /jobs/:id).']),
  ],
  goiY: [['Compare the third line of each block: peak connections.', 'So dòng thứ ba của mỗi khối: số kết nối đỉnh.'], ['Who reads the data, and when?', 'Ai đọc dữ liệu, và vào lúc nào?']],
  loi: [['“The queue made email faster” — it made it reliable; throughput is still 5 at a time.', '"Hàng đợi làm email nhanh hơn" — nó làm email đáng tin; thông lượng vẫn 5 cái một lúc.'], ['Putting the whole user in job.data and emailing a stale address.', 'Nhét cả user vào job.data rồi gửi thư tới địa chỉ cũ.']],
  tns: [tn('202 Accepted', 'đã nhận, chưa xong', 'yêu cầu được nhận, kết quả sẽ có sau'), tn('transactional outbox', 'hộp thư đi trong giao dịch', 'ghi job thành dòng trong cùng giao dịch, một tiến trình quét chuyển nó vào hàng đợi')],
  kn: ['background jobs', 'outbox'],
});

const FAKE_SIGNUP = `// fake-signup.js — PROVIDED (loaded before answer.js).
//   await createUser(body)          → { id, email } after 10 ms (throws Error('EMAIL_TAKEN') for 'taken@x.vn')
//   await sendWelcomeEmail(email)   → 300 ms of SMTP (counts sent.length)
//   emailQueue.add(name, data, opts) → 2 ms (one Redis round trip); emailQueue.added = [{ name, data, opts, at }]
let nextId = 41;
const sent = [];
async function createUser(body) {
  await new Promise((ok) => setTimeout(ok, 10));
  if (body.email === 'taken@x.vn') throw Object.assign(new Error('EMAIL_TAKEN'), { status: 409 });
  return { id: ++nextId, email: body.email, name: body.name, passwordHash: '$argon2id$v=19$…' };
}
async function sendWelcomeEmail(email) { await new Promise((ok) => setTimeout(ok, 300)); sent.push(email); }
const emailQueue = {
  added: [],
  add(name, data, opts) { emailQueue.added.push({ name, data: JSON.parse(JSON.stringify(data)), opts, at: Date.now() }); return new Promise((ok) => setTimeout(() => ok({ id: String(emailQueue.added.length) }), 2)); },
};
`;

const E3 = jsBai({
  ten: '13.1 · Move the welcome email out of the request', kho: 'MEDIUM', phut: 15,
  en: `<p>The sign-up route sends the welcome email inline: 300 ms of the user waiting, and if SMTP fails the request 500s and the email is lost. Write ${c('makeRegister({ createUser, emailQueue })')} returning the Express handler ${c('async (req, res, next)')}:</p><ol><li>${c('const user = await createUser(req.body)')} — if it throws, pass the error to ${c('next(err)')} and enqueue NOTHING;</li><li>enqueue ${c("emailQueue.add('welcome', { userId: user.id }, { attempts: 5, backoff: { type: 'exponential', delay: 1000 } })")} — the id only, never the user object (it carries the password hash and goes stale);</li><li>answer ${c('201')} with ${c('{ id, email }')} — the user really was created.</li></ol>`,
  vi: `<p>Route đăng ký gửi email chào mừng ngay trong request: người dùng chờ 300 ms, và nếu SMTP hỏng thì request 500 và email mất. Viết ${c('makeRegister({ createUser, emailQueue })')} trả về handler Express ${c('async (req, res, next)')}:</p><ol><li>${c('const user = await createUser(req.body)')} — nếu nó ném lỗi, chuyển lỗi cho ${c('next(err)')} và KHÔNG xếp hàng gì;</li><li>xếp hàng ${c("emailQueue.add('welcome', { userId: user.id }, { attempts: 5, backoff: { type: 'exponential', delay: 1000 } })")} — chỉ id, không bao giờ cả đối tượng user (nó mang hash mật khẩu và sẽ cũ đi);</li><li>trả ${c('201')} với ${c('{ id, email }')} — người dùng thật sự đã được tạo.</li></ol>`,
  yc: [['No email is sent inside the request.', 'Không gửi email nào bên trong request.'], ['The job is enqueued only after createUser succeeded.', 'Job chỉ được xếp hàng sau khi createUser thành công.'], ['job.data is exactly { userId }; the response never contains passwordHash.', 'job.data đúng bằng { userId }; câu trả lời không bao giờ chứa passwordHash.']],
  dauVao: ['{ createUser, emailQueue } · then (req, res, next)', '{ createUser, emailQueue } · rồi (req, res, next)'],
  dauRa: ['handler — async (req, res, next) => void', 'handler — async (req, res, next) => void'],
  goiY: [['try { const user = await createUser(req.body); … } catch (err) { return next(err); }', 'try { const user = await createUser(req.body); … } catch (err) { return next(err); }'], ['After the add: res.status(201).json({ id: user.id, email: user.email }).', 'Sau lệnh add: res.status(201).json({ id: user.id, email: user.email }).']],
  loi: [['await sendWelcomeEmail(user.email) in the route: the user waits for the slowest party, and an SMTP error loses the email with a 500.', 'await sendWelcomeEmail(user.email) trong route: người dùng chờ bên chậm nhất, và lỗi SMTP làm mất email kèm một 500.'], ['emailQueue.add(\'welcome\', user): the password hash sits in Redis readable by anyone with redis-cli, and the address can be stale by the time the job runs.', 'emailQueue.add(\'welcome\', user): hash mật khẩu nằm trong Redis, ai có redis-cli cũng đọc được, và địa chỉ có thể đã cũ khi job chạy.'], ['Enqueueing before createUser: a failed sign-up still sends a welcome email to an account that does not exist.', 'Xếp hàng trước createUser: đăng ký hỏng mà vẫn gửi thư chào mừng tới một tài khoản không tồn tại.']],
  gt: ['The route now only records the work: one 2 ms Redis round trip instead of 300 ms of SMTP, and attempts + exponential backoff turn “the email failed” into “the email was late”. Carrying only the id makes the worker re-read the current address. Enqueueing after the user exists (and not at all when creation fails) is the in-request half of the outbox rule.', 'Route giờ chỉ ghi lại việc cần làm: một vòng Redis 2 ms thay vì 300 ms SMTP, và attempts + backoff cấp số nhân biến "email hỏng" thành "email tới trễ". Chỉ mang id buộc worker đọc lại địa chỉ hiện tại. Xếp hàng sau khi người dùng đã tồn tại (và không xếp gì khi tạo hỏng) là nửa phần trong request của quy tắc outbox.'],
  kn: ['background jobs'], tns: [tn('fire-and-respond', 'nhận-xếp-trả lời', 'kiểm tra, xếp hàng, trả lời — phần chậm làm sau')],
  gia: { 'fake-signup.js': FAKE_SIGNUP, 'fake-http.js': FAKE_HTTP },
  dau: `/** POST /register */
function makeRegister({ createUser, emailQueue }) {
  // Write your solution here — the "before" version of the lesson
  return async (req, res, next) => {
    try {
      const user = await createUser(req.body);
      await sendWelcomeEmail(user.email);
      res.status(201).json(user);
    } catch (err) { next(err); }
  };
}
`,
  giai: `/** POST /register — the route only RECORDS the work; a worker sends the email */
function makeRegister({ createUser, emailQueue }) {
  return async (req, res, next) => {
    let user;
    try {
      user = await createUser(req.body);                 // the part the user is waiting for
    } catch (err) {
      return next(err);                                  // failed sign-up: nothing is enqueued
    }
    await emailQueue.add('welcome', { userId: user.id }, {   // the id only — the worker re-reads the row
      attempts: 5,
      backoff: { type: 'exponential', delay: 1000 },     // "the email failed" becomes "the email was late"
    });
    res.status(201).json({ id: user.id, email: user.email });   // 201: the user really was created
  };
}
`,
  chung: `const handler = makeRegister({ createUser, emailQueue });
const call = async (body) => { const req = mkReq({ method: 'POST', body }); const res = mkRes(); const next = mkNext(); const t0 = Date.now(); await handler(req, res, next); return { status: res.statusCode, body: res.body, next: next.calls, ms: Date.now() - t0 }; };`,
  cases: [
    { goi: `[await call({ email: 'an@x.vn', name: 'An' }).then((r) => [r.status, r.body, r.ms < 50]), sent.length]`, moTa: ['201 fast, no inline email', '201 nhanh, không gửi thư trong request'] },
    { goi: `await call({ email: 'an@x.vn' }).then(() => emailQueue.added.map(({ name, data, opts }) => ({ name, data, opts })))`, moTa: ['One job: welcome, { userId }, attempts 5 + exponential backoff', 'Một job: welcome, { userId }, attempts 5 + backoff cấp số nhân'] },
    { goi: `[await call({ email: 'taken@x.vn' }).then((r) => r.next), emailQueue.added.length]`, moTa: ['Sign-up fails → next(err), nothing enqueued', 'Đăng ký hỏng → next(err), không xếp gì'] },
    { goi: `await (async () => { const r = await Promise.all(Array.from({ length: 20 }, (_, i) => call({ email: 'u' + i + '@x.vn' }))); return [r.every((x) => x.status === 201 && !('passwordHash' in x.body)), emailQueue.added.length, sent.length, JSON.stringify(emailQueue.added).includes('argon2')]; })()`, an: true },
    { goi: `await call({ email: 'b@x.vn' }).then((r) => [r.body, emailQueue.added[0].data])`, an: true },
  ],
});

const FAKE_SMTP = `// fake-smtp.js — PROVIDED (loaded before answer.js). A real SMTP server: it accepts 5 concurrent
// connections, takes 200 ms per message, and answers "421 Too many concurrent connections" beyond that.
//   await smtp.send(to)  → 'queued as <n>'      smtp.peak — highest number of concurrent connections seen
//   smtp.sent — delivered addresses             smtp.rejected — number of 421 answers
const smtp = {
  max: 5, ms: 200, open: 0, peak: 0, sent: [], rejected: 0,
  send(to) {
    if (smtp.open >= smtp.max) { smtp.rejected++; return Promise.reject(new Error('421 Too many concurrent connections')); }
    smtp.open++; smtp.peak = Math.max(smtp.peak, smtp.open);
    return new Promise((ok) => setTimeout(() => { smtp.open--; smtp.sent.push(to); ok('queued as ' + smtp.sent.length); }, smtp.ms));
  },
};
`;

const E4 = jsBai({
  ten: '13.1 · A worker pool that never asks for more than the downstream can give', kho: 'HARD', phut: 25,
  en: `<p>The worker side of measurement 2: 100 emails, an SMTP server that accepts 5 connections. ${c('Promise.all')} over all 100 is the inline version again — 95 answers of 421. Write ${c('runPool(items, worker, concurrency)')}:</p><ul><li>call ${c('await worker(item)')} for every item, with <b>never more than</b> ${c('concurrency')} calls in flight at the same time;</li><li>start the next item as soon as one finishes (do not wait for a whole batch of 5 to finish);</li><li>a failing item does not stop the others: resolve to an array, in the ORDER of ${c('items')}, of ${c('{ ok: true, value }')} or ${c('{ ok: false, error: <message> }')}.</li></ul>`,
  vi: `<p>Phía worker của phép đo 2: 100 email, một máy chủ SMTP nhận 5 kết nối. ${c('Promise.all')} cả 100 cái lại chính là bản gửi trong request — 95 câu trả lời 421. Viết ${c('runPool(items, worker, concurrency)')}:</p><ul><li>gọi ${c('await worker(item)')} cho mọi phần tử, <b>không bao giờ quá</b> ${c('concurrency')} lời gọi đang chạy cùng lúc;</li><li>bắt đầu phần tử kế ngay khi một cái xong (đừng chờ cả lô 5 cái xong);</li><li>một phần tử hỏng không dừng các phần tử khác: resolve ra mảng, theo ĐÚNG thứ tự ${c('items')}, gồm ${c('{ ok: true, value }')} hoặc ${c('{ ok: false, error: <thông điệp> }')}.</li></ul>`,
  yc: [['Peak in-flight calls ≤ concurrency.', 'Số lời gọi đang chạy tối đa ≤ concurrency.'], ['A free slot is reused immediately (100 × 200 ms at 5 ⇒ ~4,000 ms).', 'Chỗ trống được dùng lại ngay (100 × 200 ms ở mức 5 ⇒ ~4.000 ms).'], ['Results in input order; errors captured, not thrown.', 'Kết quả theo thứ tự đầu vào; lỗi được ghi lại, không ném ra.']],
  dauVao: ['items — any[] · worker — async (item) => any · concurrency — number ≥ 1', 'items — any[] · worker — async (item) => any · concurrency — số ≥ 1'],
  dauRa: ['Promise<({ ok: true, value } | { ok: false, error })[]>', 'Promise<({ ok: true, value } | { ok: false, error })[]>'],
  goiY: [['Start `concurrency` lanes; each lane loops: take the next index (let next = 0; const i = next++), run it, store the result at results[i], repeat until next >= items.length.', 'Khởi `concurrency` làn; mỗi làn lặp: lấy chỉ số kế tiếp (let next = 0; const i = next++), chạy nó, lưu kết quả vào results[i], lặp tới khi next >= items.length.'], ['await Promise.all(lanes) and return results. next++ is safe: the event loop runs one lane at a time between awaits.', 'await Promise.all(lanes) rồi trả results. next++ an toàn: giữa các await event loop chỉ chạy một làn mỗi lúc.']],
  loi: [['Promise.all(items.map(worker)): 100 connections at once against a server that takes 5 — the lesson’s 95 lost emails.', 'Promise.all(items.map(worker)): 100 kết nối cùng lúc vào máy chủ chỉ nhận 5 — đúng 95 email mất của bài.'], ['Chunking into batches of 5 with await Promise.all(batch): correct but one slow message stalls the other four slots.', 'Chia lô 5 cái và await Promise.all(lô): đúng nhưng một thư chậm làm treo bốn chỗ còn lại.'], ['Pushing results in completion order: result i no longer belongs to item i.', 'Đẩy kết quả theo thứ tự hoàn thành: kết quả i không còn thuộc về phần tử i.']],
  gt: ['This is what a worker’s concurrency setting does: it bounds how many jobs are in flight, which keeps the downstream inside its limit. The lane loop reuses a slot the moment it frees up, so 100 × 200 ms at concurrency 5 takes about 4 s — the lesson’s worker drained the queue in 4,126 ms with a peak of 5 connections and zero rejections.', 'Đây chính là việc thiết lập concurrency của worker làm: chặn số job đang chạy, giữ bên dưới trong giới hạn của nó. Vòng lặp theo làn dùng lại chỗ trống ngay khi có, nên 100 × 200 ms ở mức 5 mất khoảng 4 s — worker trong bài rút cạn hàng đợi trong 4.126 ms với đỉnh 5 kết nối và không lần từ chối nào.'],
  kn: ['concurrency', 'worker pool'], tns: [tn('concurrency', 'mức đồng thời', 'bao nhiêu job một worker cho chạy cùng lúc'), tn('backpressure', 'áp lực ngược', 'không đòi bên dưới nhiều hơn nó chịu được')],
  gia: { 'fake-smtp.js': FAKE_SMTP },
  dau: `/** Run worker(item) for every item, at most \`concurrency\` at a time. */
async function runPool(items, worker, concurrency) {
  // Write your solution here — this is the inline version: everything at once
  const settled = await Promise.allSettled(items.map((it) => worker(it)));
  return settled.map((s) => (s.status === 'fulfilled' ? { ok: true, value: s.value } : { ok: false, error: s.reason.message }));
}
`,
  giai: `/** Run worker(item) for every item, at most \`concurrency\` at a time; results in input order. */
async function runPool(items, worker, concurrency) {
  const results = new Array(items.length);
  let next = 0;                                          // shared cursor — safe: one lane runs at a time between awaits
  async function lane() {
    while (next < items.length) {
      const i = next++;                                  // claim the next item synchronously
      try {
        results[i] = { ok: true, value: await worker(items[i]) };
      } catch (err) {
        results[i] = { ok: false, error: err.message };  // one failure does not stop the pool
      }
    }                                                    // a lane picks the next item the moment it is free
  }
  const lanes = Array.from({ length: Math.min(concurrency, items.length) }, lane);
  await Promise.all(lanes);
  return results;
}
`,
  chung: `const emails = Array.from({ length: 100 }, (_, i) => 'user' + i + '@x.vn');`,
  cases: [
    { goi: `await (async () => { const t0 = Date.now(); const r = await runPool(emails, (e) => smtp.send(e), 5); return [r.filter((x) => x.ok).length, smtp.rejected, smtp.peak, Date.now() - t0]; })()`, moTa: ['100 emails, SMTP limit 5 → all sent, peak 5, ~4,000 ms', '100 email, SMTP giới hạn 5 → gửi đủ, đỉnh 5, ~4.000 ms'] },
    { goi: `await runPool([1, 2, 3, 4], async (x) => { await new Promise((ok) => setTimeout(ok, (5 - x) * 10)); if (x === 3) throw new Error('bad ' + x); return x * 10; }, 2)`, moTa: ['Results keep input order; the failure is captured', 'Kết quả giữ thứ tự đầu vào; lỗi được ghi lại'] },
    { goi: `await (async () => { const t0 = Date.now(); const ms = [500, 100, 100, 100, 100, 100]; await runPool(ms, (m) => new Promise((ok) => setTimeout(ok, m)), 2); return Date.now() - t0; })()`, moTa: ['A free slot is reused at once (not batch by batch)', 'Chỗ trống được dùng lại ngay (không chờ theo lô)'] },
    { goi: `await (async () => { let open = 0, peak = 0; const r = await runPool(Array.from({ length: 37 }, (_, i) => i), async (i) => { open++; peak = Math.max(peak, open); await new Promise((ok) => setTimeout(ok, 7 + (i % 5))); open--; return i; }, 8); return [peak, r.map((x) => x.value).join(',') === Array.from({ length: 37 }, (_, i) => i).join(',')]; })()`, an: true },
    { goi: `[await runPool([], async () => 1, 5), await runPool(['a'], async (x) => x + '!', 10)]`, an: true },
  ],
});

const E5 = cs({
  ten: '13.1 · The transactional outbox, step by step', kho: 'MEDIUM', phut: 8, loai: 'order',
  en: 'Losing the job between COMMIT and queue.add() is unacceptable for this sign-up (the welcome email carries the activation link). Put the steps of the transactional outbox in order.',
  vi: 'Mất job giữa COMMIT và queue.add() là không chấp nhận được với lượt đăng ký này (email chào mừng mang liên kết kích hoạt). Sắp các bước của transactional outbox theo đúng thứ tự.',
  cau: [ord('o1', ['Order the steps', 'Sắp thứ tự các bước'], [
    'BEGIN the transaction',
    'INSERT the user row',
    'INSERT an outbox row { type: "welcome", userId } in the SAME transaction',
    'COMMIT — the user and the job record exist together, or neither does',
    'Answer 201 to the client',
    'The sweeper reads unsent outbox rows and calls queue.add() for each',
    'The sweeper marks those rows as sent (the job may be enqueued twice on a crash — the worker is idempotent)',
  ], ['The point is that the job is written as data inside the same transaction as the user, so a crash can never separate them; moving it to the queue happens afterwards, outside the request, and may repeat — which is why every handler must survive running twice (13.3).', 'Điểm mấu chốt: job được ghi như dữ liệu bên trong cùng giao dịch với user, nên một lần sập không bao giờ tách được chúng; việc chuyển vào hàng đợi xảy ra sau đó, ngoài request, và có thể lặp — đó là lý do mọi handler phải chịu được việc chạy hai lần (13.3).'])],
  goiY: [['Everything that must survive together goes between BEGIN and COMMIT.', 'Mọi thứ phải sống sót cùng nhau nằm giữa BEGIN và COMMIT.'], ['The queue is touched only after the commit.', 'Hàng đợi chỉ được chạm sau khi commit.']],
  loi: [['Calling queue.add() before COMMIT: the worker can read nothing, or act on a rolled-back user.', 'Gọi queue.add() trước COMMIT: worker có thể đọc thấy rỗng, hoặc làm việc với một user đã rollback.'], ['Marking the outbox row sent BEFORE enqueueing: a crash in between loses the job for good.', 'Đánh dấu dòng outbox đã gửi TRƯỚC khi xếp hàng: sập ở giữa là mất job vĩnh viễn.']],
  tns: [tn('transactional outbox', 'hộp thư đi trong giao dịch', 'job ghi thành dòng trong cùng giao dịch; một tiến trình quét chuyển nó vào hàng đợi')],
  kn: ['outbox'],
});

export default modul('nodejs-13-1-vi-sao-hang-doi', '13.1 Why a queue: 202, bounded concurrency, outbox', [E1, E2, E3, E4, E5]);
