/** Node.js · Lab Chương 14 — Viết bộ test cho chính code của chương 12–13: middleware giới hạn tần suất (đồng hồ giả) và vòng thử lại của worker; soát một tệp test có lỗi. */
import { modul, cs, q, tn, mutBai, c, TN, YC_MUT } from './_node-c12-14.mjs';

const RL = `/**
 * Fixed-window rate limiting middleware (lesson 12.4, Lab 12). The store does the atomic count:
 * in production a Redis Lua script, here an in-memory map with the same contract.
 *   store.incr(key, windowMs) → Promise<{ count, ttlMs }>
 */
export function memoryStore() {
  const windows = new Map();
  return {
    async incr(key, windowMs) {
      const now = Date.now();
      let w = windows.get(key);
      if (!w || now >= w.resetAt) {            // the window starts at the FIRST hit and stays fixed
        w = { count: 0, resetAt: now + windowMs };
        windows.set(key, w);
      }
      w.count++;
      return { count: w.count, ttlMs: w.resetAt - now };
    },
  };
}

/** nginx APPENDS the real address — only the last X-Forwarded-For entry can be trusted. */
export function clientKey(req) {
  const xff = req.headers['x-forwarded-for'];
  return xff ? xff.split(',').pop().trim() : req.ip;
}

export function rateLimit({ store, limit, windowMs, log = console }) {
  return async (req, res, next) => {
    let r;
    try {
      r = await store.incr('rl:' + clientKey(req), windowMs);
    } catch (err) {
      log.warn('rate limit skipped: ' + err.message);   // fail OPEN: a limiter outage is not a site outage
      return next();
    }
    res.set('RateLimit-Remaining', Math.max(0, limit - r.count));
    if (r.count > limit) {
      res.set('Retry-After', Math.ceil(r.ttlMs / 1000));
      return res.status(429).json({ error: 'TOO_MANY_REQUESTS' });
    }
    next();
  };
}
`;
const FAKES = `/** Express-like req / res / next for middleware tests. */
export const mkReq = ({ ip = '127.0.0.1', headers = {} } = {}) => ({ ip, headers, method: 'GET', path: '/' });
export function mkRes() {
  const res = { statusCode: 200, headers: {}, body: undefined };
  res.status = (s) => { res.statusCode = s; return res; };
  res.set = (k, v) => { res.headers[String(k).toLowerCase()] = String(v); return res; };
  res.json = (b) => { res.body = b; return res; };
  return res;
}
export function mkNext() { const next = (err) => { next.calls.push(err === undefined ? 'next()' : 'next(err)'); }; next.calls = []; return next; }
`;

const L1 = mutBai({
  ten: 'Lab 14 · 1 — Write the test suite for the rate limiter of chapter 12', kho: 'HARD', phut: 35, dangBai: 'lab',
  en: `<p>${c('src/rateLimit.js')} is the limiter of Lab 12, with its counter behind a ${c('store')} interface so it can be tested without Redis (${c('memoryStore()')} keeps the same contract as the Lua script). ${c('src/http-fakes.js')} gives you ${c('mkReq / mkRes / mkNext')}. Its rules:</p><ul><li>exactly ${c('limit')} requests per window pass; the next gets ${c('429')} ${c("{ error: 'TOO_MANY_REQUESTS' }")};</li><li>the window is FIXED: it starts at the first hit and does not slide with later hits;</li><li>${c('Retry-After')} is the remaining window in whole seconds, rounded UP; ${c('RateLimit-Remaining')} never goes below 0;</li><li>the key is the LAST ${c('X-Forwarded-For')} entry, else ${c('req.ip')};</li><li>if the store throws, it logs a warning and calls ${c('next()')} with no error (fail open).</li></ul><p>Write ${c('src/rateLimit.test.js')} with fake timers (${c('vi.useFakeTimers()')}, ${c('vi.advanceTimersByTime')}) that kills all 6 mutants.</p>`,
  vi: `<p>${c('src/rateLimit.js')} là bộ giới hạn của Lab 12, với bộ đếm đặt sau giao diện ${c('store')} để test được mà không cần Redis (${c('memoryStore()')} giữ đúng hợp đồng của kịch bản Lua). ${c('src/http-fakes.js')} cho bạn ${c('mkReq / mkRes / mkNext')}. Các luật:</p><ul><li>đúng ${c('limit')} request mỗi cửa sổ được qua; request kế nhận ${c('429')} ${c("{ error: 'TOO_MANY_REQUESTS' }")};</li><li>cửa sổ CỐ ĐỊNH: bắt đầu ở lần đầu và không trượt theo các lần sau;</li><li>${c('Retry-After')} là phần còn lại của cửa sổ tính bằng giây nguyên, làm tròn LÊN; ${c('RateLimit-Remaining')} không bao giờ dưới 0;</li><li>khoá là mục CUỐI của ${c('X-Forwarded-For')}, không có thì ${c('req.ip')};</li><li>nếu store ném lỗi, nó ghi cảnh báo và gọi ${c('next()')} không kèm lỗi (fail-open).</li></ul><p>Viết ${c('src/rateLimit.test.js')} dùng đồng hồ giả (${c('vi.useFakeTimers()')}, ${c('vi.advanceTimersByTime')}) diệt cả 6 đột biến.</p>`,
  yc: [...YC_MUT(6, 6), ['Use fake timers for every time-dependent rule; restore real timers after each test.', 'Dùng đồng hồ giả cho mọi luật phụ thuộc thời gian; trả đồng hồ thật sau mỗi test.']],
  dauVao: ['src/rateLimit.test.js (Vitest, fake timers).', 'src/rateLimit.test.js (Vitest, đồng hồ giả).'],
  dauRa: ['Green on the correct limiter; red on each mutant.', 'Xanh với bộ giới hạn đúng; đỏ với từng đột biến.'],
  viDu: [{ input: 'Mutant: every hit pushes resetAt forward (a sliding window)|||Đột biến: mỗi lần chạm đẩy resetAt về sau (cửa sổ trượt)', output: 'Killed by: limit 2, hits at 0 ms and 600 ms, then at 1,100 ms → must pass (the window that began at 0 is over)|||Bị diệt bởi: giới hạn 2, chạm ở 0 ms và 600 ms, rồi ở 1.100 ms → phải qua (cửa sổ bắt đầu từ 0 đã hết)', explanation: 'A client that keeps retrying is never released by the mutant. Only a test that moves the clock across the boundary sees it.|||Client cứ thử lại sẽ không bao giờ được thả với đột biến này. Chỉ test vặn đồng hồ qua ranh giới mới thấy nó.' }],
  goiY: [['A helper keeps tests short: const hit = async (mw, req) => { const res = mkRes(), next = mkNext(); await mw(req, res, next); return { res, next }; };', 'Một hàm phụ giữ test ngắn: const hit = async (mw, req) => { const res = mkRes(), next = mkNext(); await mw(req, res, next); return { res, next }; };'], ['Boundaries: exactly limit requests pass (the limit-th must pass); Retry-After at 1.5 s left must be "2"; RateLimit-Remaining after an extra request must be "0".', 'Các biên: đúng limit request được qua (request thứ limit phải qua); Retry-After khi còn 1,5 s phải là "2"; RateLimit-Remaining sau một request thừa phải là "0".'], ['Fail open: a store whose incr rejects, and a log object { warn: vi.fn() } — expect next.calls to equal [\'next()\'] and warn to have been called.', 'Fail-open: một store mà incr reject, và một đối tượng log { warn: vi.fn() } — kỳ vọng next.calls bằng [\'next()\'] và warn đã được gọi.']],
  loi: [['Sending limit + 5 requests and checking only that the LAST one is 429: the “≥ instead of >” mutant also answers 429 there.', 'Gửi limit + 5 request rồi chỉ kiểm cái CUỐI là 429: đột biến "≥ thay vì >" cũng trả 429 ở đó.'], ['Waiting with real time for the window to end: 60 s per test, or a window so short that the test is flaky.', 'Chờ giờ thật cho cửa sổ hết: 60 s mỗi test, hoặc một cửa sổ ngắn tới mức test chập chờn.'], ['Testing XFF with a single entry: first and last are the same, so the spoofable version passes.', 'Test XFF với chỉ một mục: đầu và cuối trùng nhau, nên bản dễ bị giả vẫn qua.']],
  gt: ['The limiter’s value is in its edges: the limit-th request, the window boundary, the rounding of Retry-After, a negative remaining, the forged header, and the outage. Each mutant moves one edge by one step, so only tests that stand exactly on that edge kill it — with fake timers the clock is an input, which is what makes “1,100 ms later” a one-line test. This is chapter 12’s code held in place by chapter 14’s technique.', 'Giá trị của bộ giới hạn nằm ở các cạnh: request thứ limit, ranh giới cửa sổ, cách làm tròn Retry-After, số còn lại bị âm, header bị giả, và sự cố. Mỗi đột biến dời một cạnh đi một bước, nên chỉ test đứng đúng trên cạnh đó mới diệt được — với đồng hồ giả thời gian là một đầu vào, thứ biến "1.100 ms sau" thành test một dòng. Đây là code của chương 12 được ghim chặt bằng kỹ thuật của chương 14.'],
  kn: ['mutation testing', 'fake timers', 'rate limiting'], tns: [TN.mutant, tn('fixed window', 'cửa sổ cố định', 'bắt đầu ở lần chạm đầu, không trượt'), tn('fail-open', 'hỏng thì cho qua', 'store lỗi ⇒ ghi cảnh báo, next()')],
  impl: { 'src/rateLimit.js': RL, 'src/http-fakes.js': FAKES },
  tepTest: 'src/rateLimit.test.js',
  toiThieuTest: 6,
  dau: `import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { rateLimit, memoryStore } from './rateLimit.js';
import { mkReq, mkRes, mkNext } from './http-fakes.js';

beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date('2026-11-08T03:00:00Z')); });
afterEach(() => vi.useRealTimers());

const hit = async (mw, req = mkReq()) => { const res = mkRes(), next = mkNext(); await mw(req, res, next); return { res, next }; };

// Six tests, all green — most mutants survive.
describe('rateLimit', () => {
  it('lets a first request through', async () => {
    const mw = rateLimit({ store: memoryStore(), limit: 3, windowMs: 60000 });
    const { next } = await hit(mw);
    expect(next.calls).toEqual(['next()']);
  });

  it('blocks a flood', async () => {
    const mw = rateLimit({ store: memoryStore(), limit: 3, windowMs: 60000 });
    for (let i = 0; i < 5; i++) await hit(mw);
    const { res } = await hit(mw);
    expect(res.statusCode).toBe(429);
  });

  it('sets a Retry-After header when blocking', async () => {
    const mw = rateLimit({ store: memoryStore(), limit: 1, windowMs: 60000 });
    await hit(mw);
    const { res } = await hit(mw);
    expect(res.headers['retry-after']).toBeDefined();
  });

  it('counts clients separately', async () => {
    const mw = rateLimit({ store: memoryStore(), limit: 1, windowMs: 60000 });
    await hit(mw, mkReq({ ip: '1.1.1.1' }));
    const { next } = await hit(mw, mkReq({ ip: '2.2.2.2' }));
    expect(next.calls).toEqual(['next()']);
  });

  it('answers with an error body when blocking', async () => {
    const mw = rateLimit({ store: memoryStore(), limit: 1, windowMs: 1000 });
    await hit(mw);
    const { res } = await hit(mw);
    expect(res.body).toEqual({ error: 'TOO_MANY_REQUESTS' });
  });

  it('sets RateLimit-Remaining', async () => {
    const mw = rateLimit({ store: memoryStore(), limit: 3, windowMs: 1000 });
    const { res } = await hit(mw);
    expect(res.headers['ratelimit-remaining']).toBe('2');
  });
});
`,
  giai: `import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { rateLimit, memoryStore } from './rateLimit.js';
import { mkReq, mkRes, mkNext } from './http-fakes.js';

beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date('2026-11-08T03:00:00Z')); });
afterEach(() => vi.useRealTimers());

const hit = async (mw, req = mkReq()) => { const res = mkRes(), next = mkNext(); await mw(req, res, next); return { res, next }; };
const limiter = (limit, windowMs, extra = {}) => rateLimit({ store: memoryStore(), limit, windowMs, ...extra });

describe('rateLimit', () => {
  // the boundary: the limit-th request PASSES, the next one does not — kills ">=" instead of ">"
  it('lets exactly limit requests through, then answers 429', async () => {
    const mw = limiter(3, 60000);
    const passed = [];
    for (let i = 0; i < 3; i++) passed.push((await hit(mw)).next.calls.length);
    const blocked = await hit(mw);
    expect(passed).toEqual([1, 1, 1]);
    expect(blocked.res.statusCode).toBe(429);
    expect(blocked.res.body).toEqual({ error: 'TOO_MANY_REQUESTS' });
    expect(blocked.next.calls).toEqual([]);
  });

  // a FIXED window — kills the version where every hit pushes the deadline forward
  it('does not slide: a new window starts 1 s after the FIRST hit', async () => {
    const mw = limiter(2, 1000);
    await hit(mw);                        // t = 0 — the window is 0 … 1000
    vi.advanceTimersByTime(600);
    await hit(mw);                        // t = 600, count 2
    vi.advanceTimersByTime(500);          // t = 1100 — the first window is over
    const { next } = await hit(mw);
    expect(next.calls).toEqual(['next()']);
  });

  // rounding UP — kills Math.floor
  it('Retry-After is the rest of the window in whole seconds, rounded up', async () => {
    const mw = limiter(1, 2500);
    await hit(mw);
    vi.advanceTimersByTime(1000);         // 1.5 s left
    const { res } = await hit(mw);
    expect(res.headers['retry-after']).toBe('2');
  });

  // never negative — kills limit - count without Math.max
  it('RateLimit-Remaining counts down to 0, never below', async () => {
    const mw = limiter(2, 60000);
    const seen = [];
    for (let i = 0; i < 4; i++) seen.push((await hit(mw)).res.headers['ratelimit-remaining']);
    expect(seen).toEqual(['1', '0', '0', '0']);
  });

  // only the LAST X-Forwarded-For entry is trusted — kills split(',')[0]
  it('keys on the last X-Forwarded-For entry, so forged entries do not reset the limit', async () => {
    const mw = limiter(1, 60000);
    await hit(mw, mkReq({ headers: { 'x-forwarded-for': '1.1.1.1, 203.0.113.9' } }));
    const { res } = await hit(mw, mkReq({ headers: { 'x-forwarded-for': '2.2.2.2, 203.0.113.9' } }));
    expect(res.statusCode).toBe(429);
  });

  it('falls back to req.ip without the header', async () => {
    const mw = limiter(1, 60000);
    await hit(mw, mkReq({ ip: '9.9.9.9' }));
    expect((await hit(mw, mkReq({ ip: '9.9.9.9' }))).res.statusCode).toBe(429);
    expect((await hit(mw, mkReq({ ip: '8.8.8.8' }))).next.calls).toEqual(['next()']);
  });

  // fail OPEN — kills next(err)
  it('lets the request through with a warning when the store is down', async () => {
    const log = { warn: vi.fn() };
    const store = { incr: async () => { throw new Error('ECONNREFUSED'); } };
    const mw = rateLimit({ store, limit: 1, windowMs: 1000, log });
    const { next } = await hit(mw);
    expect(next.calls).toEqual(['next()']);
    expect(log.warn).toHaveBeenCalled();
  });
});
`,
  dotBien: [
    { file: 'src/rateLimit.js', from: 'if (r.count > limit) {', to: 'if (r.count >= limit) {', label: 'the limit-th request is refused', goiY: 'send EXACTLY limit requests: all of them must pass · gửi ĐÚNG limit request: tất cả phải qua' },
    { file: 'src/rateLimit.js', from: '      w.count++;\n', to: '      w.count++;\n      w.resetAt = now + windowMs;\n', label: 'the window slides with every hit', goiY: 'limit 2: hits at 0 and 600 ms, then 1,100 ms must pass · giới hạn 2: chạm ở 0 và 600 ms, lần ở 1.100 ms phải qua' },
    { file: 'src/rateLimit.js', from: 'Math.ceil(r.ttlMs / 1000)', to: 'Math.floor(r.ttlMs / 1000)', label: 'Retry-After rounded down', goiY: 'with 1.5 s left, Retry-After must be "2" · còn 1,5 s thì Retry-After phải là "2"' },
    { file: 'src/rateLimit.js', from: "      log.warn('rate limit skipped: ' + err.message);   // fail OPEN: a limiter outage is not a site outage\n      return next();", to: '      return next(err);', label: 'fails closed (next(err)) when the store is down', goiY: 'a store that throws: next() must be called WITHOUT an error · store ném lỗi: next() phải được gọi KHÔNG kèm lỗi' },
    { file: 'src/rateLimit.js', from: "xff.split(',').pop().trim()", to: "xff.split(',')[0].trim()", label: 'keys on the FIRST X-Forwarded-For entry', goiY: 'two requests with different forged first entries and the same last one must share a limit · hai request có mục đầu giả khác nhau, mục cuối giống nhau' },
    { file: 'src/rateLimit.js', from: 'Math.max(0, limit - r.count)', to: 'limit - r.count', label: 'RateLimit-Remaining goes negative', goiY: 'after the limit, RateLimit-Remaining must stay "0" · quá giới hạn, RateLimit-Remaining phải giữ "0"', an: true },
  ],
});

const RUNJOB = `export class UnrecoverableError extends Error {
  constructor(message) { super(message); this.name = 'UnrecoverableError'; }
}

const sleep = (ms) => new Promise((ok) => setTimeout(ok, ms));

/** What a worker does with ONE job: attempts (default 1), backoff, UnrecoverableError (lesson 13.3). */
export async function runJob(handler, opts = {}) {
  const attempts = opts.attempts || 1;
  const b = opts.backoff;
  const t0 = Date.now();
  const at = [];
  let made = 0;
  for (;;) {
    at.push(Date.now() - t0);
    try {
      const returnvalue = await handler({ attemptsMade: made });
      return { state: 'completed', attemptsMade: made + 1, returnvalue, at };
    } catch (err) {
      made++;
      const hopeless = err && err.name === 'UnrecoverableError';
      if (hopeless || made >= attempts) return { state: 'failed', attemptsMade: made, failedReason: err.message, at };
      const wait = !b ? 0 : b.type === 'exponential' ? b.delay * 2 ** (made - 1) : b.delay;
      await sleep(wait);
    }
  }
}
`;

const L2 = mutBai({
  ten: 'Lab 14 · 2 — Pin down the retry loop of chapter 13', kho: 'HARD', phut: 30, dangBai: 'lab',
  en: `<p>${c('src/runJob.js')} is the attempts/backoff loop of 13.3: ${c('attempts')} defaults to 1 (no retry); exponential waits ${c('delay × 2^(failures − 1)')}, fixed waits ${c('delay')}; an ${c('UnrecoverableError')} fails at once; the result is ${c("{ state, attemptsMade, returnvalue | failedReason, at }")} where ${c('at')} lists the start times relative to the first run. Write ${c('src/runJob.test.js')} that kills all 6 mutants.</p><p>The waits are real ${c('setTimeout')}s: start the job, then let fake timers run them — ${c('vi.useFakeTimers(); const p = runJob(h, opts); await vi.runAllTimersAsync(); const r = await p;')} — so 15 seconds of backoff take no time at all.</p>`,
  vi: `<p>${c('src/runJob.js')} là vòng attempts/backoff của 13.3: ${c('attempts')} mặc định 1 (không thử lại); exponential chờ ${c('delay × 2^(số lần hỏng − 1)')}, fixed chờ ${c('delay')}; ${c('UnrecoverableError')} hỏng ngay; kết quả là ${c("{ state, attemptsMade, returnvalue | failedReason, at }")} trong đó ${c('at')} liệt kê thời điểm bắt đầu so với lần chạy đầu. Viết ${c('src/runJob.test.js')} diệt cả 6 đột biến.</p><p>Các khoảng chờ là ${c('setTimeout')} thật: khởi job, rồi để đồng hồ giả chạy chúng — ${c('vi.useFakeTimers(); const p = runJob(h, opts); await vi.runAllTimersAsync(); const r = await p;')} — nên 15 giây backoff chẳng tốn chút thời gian nào.</p>`,
  yc: [...YC_MUT(5, 6), ['Use fake timers; never wait for real backoff.', 'Dùng đồng hồ giả; không bao giờ chờ backoff thật.']],
  dauVao: ['src/runJob.test.js (Vitest, fake timers).', 'src/runJob.test.js (Vitest, đồng hồ giả).'],
  dauRa: ['Green on the correct loop; red on each mutant.', 'Xanh với vòng lặp đúng; đỏ với từng đột biến.'],
  viDu: [{ input: 'Mutant: attempts defaults to 3|||Đột biến: attempts mặc định là 3', output: "Killed by: a handler that fails once, no options → expect(r).toMatchObject({ state: 'failed', attemptsMade: 1 })|||Bị diệt bởi: handler hỏng một lần, không tuỳ chọn → expect(r).toMatchObject({ state: 'failed', attemptsMade: 1 })", explanation: 'BullMQ does not retry unless told to; a silent default of 3 retries a payment twice.|||BullMQ không thử lại trừ khi được bảo; mặc định ngầm 3 lần sẽ thử lại một khoản thanh toán hai lần.' }],
  goiY: [['A flaky handler factory: const flaky = (n) => { let i = 0; return async () => { if (i++ < n) throw new Error(\'SMTP 421\'); return { sent: true }; }; };', 'Hàm dựng handler chập chờn: const flaky = (n) => { let i = 0; return async () => { if (i++ < n) throw new Error(\'SMTP 421\'); return { sent: true }; }; };'], ['Timings are part of the contract: with exponential 200 and two failures, at must equal [0, 200, 600]; with fixed 300, [0, 300, 600].', 'Thời điểm là một phần hợp đồng: với exponential 200 và hai lần hỏng, at phải bằng [0, 200, 600]; với fixed 300 là [0, 300, 600].'], ['Count the boundaries: attempts 3 and always failing ⇒ attemptsMade 3, not 4; success on the first try ⇒ attemptsMade 1.', 'Đếm các biên: attempts 3 và luôn hỏng ⇒ attemptsMade 3, không phải 4; thành công ngay lần đầu ⇒ attemptsMade 1.']],
  loi: [['await runJob(…) before running the timers: the test waits on a promise that only the fake timers can resolve, and times out.', 'await runJob(…) trước khi chạy đồng hồ giả: test chờ một promise mà chỉ đồng hồ giả mới resolve được, và hết giờ.'], ['Asserting only state: \'completed\': the wrong backoff formula and the off-by-one counts survive.', 'Chỉ khẳng định state: \'completed\': công thức backoff sai và các số đếm lệch một vẫn sống sót.'], ['Using a real UnrecoverableError-like object without the right name: import the class from runJob.js.', 'Dùng một object giả kiểu UnrecoverableError mà sai name: hãy import class từ runJob.js.']],
  gt: ['The retry loop is all boundaries — the default, the first exponential wait, the last attempt, the count reported on success — and each mutant shifts one of them by one. Fake timers turn the waits into data (at), so the formula itself becomes assertable. These are the behaviours that decide whether a queue turns “the email failed” into “the email was late”, or charges a card three times.', 'Vòng thử lại toàn là biên — giá trị mặc định, khoảng chờ cấp số nhân đầu tiên, lần thử cuối, số đếm báo ra khi thành công — và mỗi đột biến dời một biên đi một bước. Đồng hồ giả biến các khoảng chờ thành dữ liệu (at), nên chính công thức trở nên khẳng định được. Đây là những hành vi quyết định một hàng đợi biến "email hỏng" thành "email tới trễ", hay trừ thẻ ba lần.'],
  kn: ['mutation testing', 'fake timers', 'retries'], tns: [TN.mutant, TN.backoff, tn('runAllTimersAsync', 'chạy hết hẹn giờ (async)', 'chạy mọi setTimeout đang chờ, xả promise giữa các lần')],
  impl: { 'src/runJob.js': RUNJOB },
  tepTest: 'src/runJob.test.js',
  toiThieuTest: 5,
  dau: `import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { runJob, UnrecoverableError } from './runJob.js';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

const run = async (h, opts) => { const p = runJob(h, opts); await vi.runAllTimersAsync(); return p; };
const flaky = (n) => { let i = 0; return async () => { if (i++ < n) throw new Error('SMTP 421'); return { sent: true }; }; };

// Five tests, all green — the mutants live in the numbers these tests never look at.
describe('runJob', () => {
  it('completes a job that works', async () => {
    const r = await run(async () => 'ok');
    expect(r.state).toBe('completed');
  });

  it('recovers from a transient failure when retries are on', async () => {
    const r = await run(flaky(2), { attempts: 5, backoff: { type: 'exponential', delay: 200 } });
    expect(r.state).toBe('completed');
  });

  it('gives up eventually', async () => {
    const r = await run(flaky(99), { attempts: 3 });
    expect(r.state).toBe('failed');
  });

  it('reports the failure reason', async () => {
    const r = await run(flaky(99), { attempts: 2 });
    expect(r.failedReason).toBe('SMTP 421');
  });

  it('returns the handler result', async () => {
    const r = await run(async () => ({ id: 1 }));
    expect(r.returnvalue).toEqual({ id: 1 });
  });
});
`,
  giai: `import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { runJob, UnrecoverableError } from './runJob.js';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

// start the job, let the fake timers run every backoff, then read the result
const run = async (h, opts) => { const p = runJob(h, opts); await vi.runAllTimersAsync(); return p; };
const flaky = (n) => { let i = 0; return async () => { if (i++ < n) throw new Error('SMTP 421'); return { sent: true }; }; };

describe('runJob', () => {
  // kills "attemptsMade: made" on success
  it('a job that works completes after one attempt', async () => {
    const r = await run(async () => 'ok');
    expect(r).toEqual({ state: 'completed', attemptsMade: 1, returnvalue: 'ok', at: [0] });
  });

  // kills "attempts defaults to 3"
  it('does not retry by default', async () => {
    const r = await run(flaky(1));
    expect(r).toMatchObject({ state: 'failed', attemptsMade: 1, failedReason: 'SMTP 421' });
  });

  // kills "2 ** made": the FIRST exponential wait is delay itself
  it('exponential backoff waits delay, 2·delay, … between attempts', async () => {
    const r = await run(flaky(2), { attempts: 5, backoff: { type: 'exponential', delay: 200 } });
    expect(r).toMatchObject({ state: 'completed', attemptsMade: 3, at: [0, 200, 600] });
  });

  // kills "fixed backoff ignored"
  it('fixed backoff waits the same delay each time', async () => {
    const r = await run(flaky(2), { attempts: 3, backoff: { type: 'fixed', delay: 300 } });
    expect(r.at).toEqual([0, 300, 600]);
  });

  // kills "made > attempts": exactly attempts runs, never one more
  it('stops after exactly attempts runs', async () => {
    const r = await run(flaky(99), { attempts: 3, backoff: { type: 'fixed', delay: 10 } });
    expect(r).toMatchObject({ state: 'failed', attemptsMade: 3 });
    expect(r.at).toHaveLength(3);
  });

  // kills "UnrecoverableError retried"
  it('an UnrecoverableError fails at once, whatever attempts says', async () => {
    const r = await run(async () => { throw new UnrecoverableError('user no longer exists'); }, { attempts: 5, backoff: { type: 'fixed', delay: 1000 } });
    expect(r).toMatchObject({ state: 'failed', attemptsMade: 1, failedReason: 'user no longer exists' });
  });
});
`,
  dotBien: [
    { file: 'src/runJob.js', from: 'const attempts = opts.attempts || 1;', to: 'const attempts = opts.attempts || 3;', label: 'attempts defaults to 3', goiY: 'no options + one failure ⇒ failed after ONE attempt · không tuỳ chọn + một lần hỏng ⇒ hỏng sau MỘT lần thử' },
    { file: 'src/runJob.js', from: 'b.delay * 2 ** (made - 1)', to: 'b.delay * 2 ** made', label: 'exponential waits start at 2·delay', goiY: 'exponential 200 with two failures ⇒ at === [0, 200, 600] · exponential 200 hai lần hỏng ⇒ at === [0, 200, 600]' },
    { file: 'src/runJob.js', from: "const hopeless = err && err.name === 'UnrecoverableError';", to: 'const hopeless = false;', label: 'UnrecoverableError is retried', goiY: 'throw new UnrecoverableError(…) with attempts 5 ⇒ attemptsMade 1 · ném UnrecoverableError với attempts 5' },
    { file: 'src/runJob.js', from: 'if (hopeless || made >= attempts)', to: 'if (hopeless || made > attempts)', label: 'one attempt too many', goiY: 'attempts 3 and always failing ⇒ attemptsMade 3 · attempts 3 và luôn hỏng ⇒ attemptsMade 3' },
    { file: 'src/runJob.js', from: ': b.delay;', to: ': 0;', label: 'fixed backoff ignored', goiY: 'fixed 300 with two failures ⇒ at === [0, 300, 600] · fixed 300 hai lần hỏng ⇒ at === [0, 300, 600]' },
    { file: 'src/runJob.js', from: "return { state: 'completed', attemptsMade: made + 1, returnvalue, at };", to: "return { state: 'completed', attemptsMade: made, returnvalue, at };", label: 'success reports one attempt too few', goiY: 'success on the first try ⇒ attemptsMade 1 · thành công ngay lần đầu ⇒ attemptsMade 1', an: true },
  ],
});

const L3 = cs({
  ten: 'Lab 14 · 3 — Review a test file before it is merged', kho: 'MEDIUM', phut: 12, dangBai: 'lab',
  en: 'A teammate’s test file for the Notes API is green locally. Each question shows one excerpt. Find what is wrong — each mistake is one the chapter measured.',
  vi: 'Tệp test Notes API của một đồng đội xanh trên máy. Mỗi câu cho xem một đoạn. Tìm chỗ sai — mỗi lỗi là một lỗi chương này đã đo.',
  cau: [
    q('r1', ['it(\'409 on duplicates\', async () => { await request(app).post(\'/notes\').send(n); const res = request(app).post(\'/notes\').send(n); expect(res.status).toBe(409); })', 'it(\'409 khi trùng\', async () => { await request(app).post(\'/notes\').send(n); const res = request(app).post(\'/notes\').send(n); expect(res.status).toBe(409); })'],
      ['The second request is not awaited: res is the request builder, res.status is undefined', 'request(app) must be created once outside the test', 'send(n) must come before post()', '409 is the wrong status for a duplicate'],
      ['Await every supertest call — it is a thenable. Here the expect even fails, but in the reject/catch variants of 14.2 the same mistake stays green.', 'Await mọi lời gọi supertest — nó là một thenable. Ở đây expect còn đỏ, nhưng ở các biến thể reject/catch của 14.2 cùng lỗi đó vẫn xanh.']),
    q('r2', ['expect(res.body).toEqual({ id: 1, title: \'Hi\', slug: \'hi\', body: \'\', authorId: 7, createdAt: \'2026-11-08T03:00:00.000Z\' })', 'expect(res.body).toEqual({ id: 1, title: \'Hi\', slug: \'hi\', body: \'\', authorId: 7, createdAt: \'2026-11-08T03:00:00.000Z\' })'],
      ['It asserts every column, not just the promised fields', 'toEqual cannot compare dates', 'The id must never be asserted in a test', 'authorId should be a string in JSON'],
      ['Assert the fields the contract promises (toMatchObject({ slug: \'hi\' })), not every column.', 'Khẳng định các trường mà hợp đồng hứa (toMatchObject({ slug: \'hi\' })), không phải mọi cột.']),
    q('r3', ['const app = createApp({ service: createNotesService(createMemoryRepo()), auth: headerAuth }); — once, at the top of the file, shared by every test.', 'const app = createApp({ service: createNotesService(createMemoryRepo()), auth: headerAuth }); — một lần, ở đầu tệp, dùng chung cho mọi test.'],
      ['Shared state between tests — build it in beforeEach', 'createApp must be awaited', 'headerAuth cannot be used in tests', 'Nothing — sharing the app is faster and equally correct'],
      ['The first flaky-test cause of 14.5. Shuffle the order (--sequence.shuffle) and it shows in one run.', 'Nguyên nhân chập chờn đầu tiên của 14.5. Xáo thứ tự (--sequence.shuffle) là lộ ra ngay trong một lần chạy.']),
    q('r4', ['it(\'session expires\', async () => { const s = { createdAt: Date.now() }; await new Promise((r) => setTimeout(r, 15 * 60 * 1000)); expect(isExpired(s)).toBe(true); })', 'it(\'phiên hết hạn\', async () => { const s = { createdAt: Date.now() }; await new Promise((r) => setTimeout(r, 15 * 60 * 1000)); expect(isExpired(s)).toBe(true); })'],
      ['It waits 15 real minutes — use fake timers instead', 'setTimeout cannot be awaited', 'isExpired must be called with a second argument', 'Date.now() is frozen inside tests'],
      ['Twenty simulated minutes cost 4 ms with fake timers; one real 1.5 s wait cost 1,610 ms for a third of the coverage.', 'Hai mươi phút mô phỏng tốn 4 ms với đồng hồ giả; một lần chờ thật 1,5 s tốn 1.610 ms cho một phần ba độ phủ.']),
    q('r5', ['it(\'charges once\', async () => { try { expect(await charge(order)).toMatchObject({ charged: true }); } catch { /* flaky PSP */ } })', 'it(\'trừ tiền một lần\', async () => { try { expect(await charge(order)).toMatchObject({ charged: true }); } catch { /* PSP chập chờn */ } })'],
      ['The catch swallows the failing assertion: it can never go red', 'charge must not be awaited inside expect', 'toMatchObject cannot be used with async results', 'The comment explains the catch, so it is acceptable'],
      ['The assertion ran and failed; the catch ate it. No runner flag saves you — break the code on purpose and watch it stay green.', 'Khẳng định đã chạy và đỏ; catch nuốt mất. Không cờ runner nào cứu được — cố ý làm hỏng code và nhìn nó vẫn xanh.']),
    q('r6', ['vitest.config.js: test: { retry: 3 } “because the DB tests are flaky on CI”.', 'vitest.config.js: test: { retry: 3 } "vì test DB chập chờn trên CI".'],
      ['It hides the shared state instead of removing it', 'Retries make the DB tests faster', 'retry is required by Vitest for database tests', 'It is fine, because CI runs on a clean machine'],
      ['Retries are only for dependencies you do not control. Shared tables get a schema per worker; leftovers get a known starting state.', 'Thử lại chỉ dành cho phụ thuộc bạn không kiểm soát. Bảng dùng chung thì mỗi worker một schema; dữ liệu sót thì bắt đầu từ trạng thái đã biết.']),
  ],
  goiY: [['For each excerpt ask: can this test go red when the code is wrong?', 'Với mỗi đoạn hãy hỏi: test này có thể đỏ khi code sai không?'], ['Then ask: can it go red when the code is RIGHT?', 'Rồi hỏi: nó có thể đỏ khi code ĐÚNG không?']],
  loi: [['Approving a file because it is green.', 'Duyệt một tệp vì nó xanh.'], ['Treating flakiness as a CI problem instead of a test problem.', 'Coi chập chờn là vấn đề của CI thay vì của test.']],
  tns: [tn('code review of tests', 'soát code test', 'đọc test như đọc code: nó có thể đỏ khi code sai không?')],
  kn: ['test review'],
});

export default modul('nodejs-14-lab-notes-suite', 'Lab 14 — Test suites for the code of chapters 12–13', [L1, L2, L3], 'nodejs-14-5-do-phu-flaky-ci');
