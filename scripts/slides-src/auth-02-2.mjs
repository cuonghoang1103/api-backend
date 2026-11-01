/**
 * auth-02-2 — Authentication · Chapter 2 · Lesson 2.2 "Choosing and tuning the hash, by measurement" (01/11/2026).
 * Slug bài: auth-2-2-chon-va-chinh. Output = s02/_ma.mjs (argon2 0.45.1, bcrypt 6.0.0, Node 22.23.3, Apple M1 Max, env -i).
 */
import { lamDeck, js, sh, two, box, cards, steps, c } from './_auth-chung.mjs';
import { OUT, CODE } from '../../content/courses/authentication/s02/_ma.mjs';

export const deck = { key: 'auth-02-2', code: 'AUTH 2.2', title: 'Choosing and tuning the hash, by measurement', sub: 'argon2id, scrypt, bcrypt — and two budgets' };
const body = (k) => OUT[k].split('\n').slice(1).join('\n');
const TU = CODE.tune.split('\n');
const TUNE_CORE = TU.slice(TU.findIndex((l) => l.startsWith('const BUDGET_MS')), TU.findIndex((l) => l.startsWith('const MEMORY_KIB'))).join('\n').trim();
const LOAD = body('22-load').replace(/ logins · /g, ' · ');
const noCmt = (t) => t.replace(/ *\/\/.*$/gm, '');
const SCRYPT = body('22-scrypt').replace(/ — Invalid scrypt params: error:030000AC:digital envelope routines::/, ' — … ');
const HASH = CODE.hash.split('\n');
const HASH_EX = [HASH[5], HASH[6], '', HASH[9], '', HASH[11]].join('\n');

export const slides = lamDeck({ chuong: 'Chapter 2 — Passwords', bai: '2.2' }, [
  { cover: true, t: 'Choosing and tuning<br>the hash, by measurement', sub: 'Chapter 2 · Lesson 2.2 — argon2id, scrypt, bcrypt, and two budgets' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Which algorithm, when: <b>argon2id</b> first, scrypt and bcrypt as fallbacks</li>
    <li>Parameters from <b>two budgets</b>: milliseconds per login, RAM per hashing thread</li>
    <li>What 40 simultaneous logins do to latency and memory</li>
    <li>Reading the self-describing string — by name, not by position</li>
    <li>Two traps that ship: scrypt’s 32 MiB ${c('maxmem')}, bcrypt’s 72 bytes</li></ul>` },
  { t: 'A time-delay safe', body: cards([
      ['The bank', 'a safe that opens <b>10 minutes</b> after the right code — the cashier waits once a day'],
      ['The robber', 'needs thousands of tries; at 10 minutes each the night is over before the second hundred'],
      ['argon2id', 'adds a delay <b>and</b> a desk-sized pile of memory (64 MiB) to every single try'],
    ], 3) + box('The trade-off you tune', 'Every real login pays the cost once. Every guess pays it too. Pick the highest cost your <b>login endpoint</b> can afford — and measure it on the machine that runs it.', 'lam') },
  { t: 'Four candidates', body: `<table class="t"><tr><th>Algorithm</th><th>Costs per guess</th><th>Use it when</th></tr>
    <tr><td><b>argon2id</b></td><td>time + memory (m, t, p)</td><td>default — OWASP min m=19 MiB t=2 p=1</td></tr>
    <tr><td>scrypt</td><td>time + memory (N, r, p)</td><td>no native module allowed: it is in ${c('node:crypto')}</td></tr>
    <tr><td>bcrypt</td><td>time only (cost)</td><td>legacy / ecosystem; cost ≥ 10; <b>72-byte limit</b></td></tr>
    <tr><td>PBKDF2-SHA256</td><td>time only (iterations)</td><td>FIPS-140 required; 600,000 iterations</td></tr>
    <tr><td>SHA-256, MD5…</td><td>nothing</td><td>never for passwords (lesson 2.1)</td></tr></table>` +
    box('Why memory matters', 'A GPU has thousands of cores but little memory per core. When every guess needs 64 MiB, most of those cores sit idle.', 'xanh') },
  { t: 'Measure: demo2/tune.mjs', body: js(noCmt(TUNE_CORE), { sm: true }) + two(sh(body('22-tune').split('\n').slice(1).join('\n'), { title: 'node demo2/tune.mjs 100 256', sm: true }),
      box('Two budgets', '≤ <b>100 ms</b> per login · <b>256 MiB</b> for hashing, shared by ' + c('UV_THREADPOOL_SIZE') + ' (default 4) threads ⇒ ≤ 64 MiB each. Then: the most memory, then the most passes, that fit both.', 'lam'), 'r64') },
  { t: 'Why a memory budget, not just a time budget', body: steps([
      'Time alone picks <b>128 MiB, t=1</b> (85 ms) — the most memory that is fast enough',
      'But 4 threads hash at once ⇒ 4 × 128 MiB = <b>512 MiB</b> just for logins',
      'With ≤ 64 MiB each: <b>m=64 MiB, t=2, p=1 → 86.5 ms</b> — LabFlow ID v0.2’s PARAMS',
    ]) + box('OWASP lists equivalents', 'm=19 MiB t=2 · m=46 MiB t=1 · m=12 MiB t=3 “provide an equal level of defense”. Ours is above all of them; the numbers just have to come from <b>your</b> machine.', 'xanh') },
  { t: '40 people press “Sign in” at once', body: sh(LOAD, { title: 'UV_THREADPOOL_SIZE=… node demo2/load.mjs <logins> <p>', sm: true }) +
      cards([
        ['4 threads', '40 logins queue: p95 <b>850 ms</b>, +194 MiB (3 more × 64)'],
        ['64 threads', '10 cores do not get faster: p50 537 ms, <b>+2,498 MiB</b>'],
        ['p = 4', 'one hash in <b>27 ms</b>, p95 529 ms — the 4 lanes run in parallel on extra cores'],
      ], 3) },
  { t: 'Read the string by name, not by position', body: sh(body('22-format'), { title: 'node demo2/format.mjs', sm: true }) +
      two(box('The bug', `The argon2 package writes ${c('m=65536,p=1,t=2')}. A regex for ${c('m=…,t=…,p=…')} returns <b>null</b> ⇒ “needs rehash” on <b>every</b> login ⇒ every login hashes twice.`, 'do2'),
        box('The fix', `Split ${c('m=…,p=…,t=…')} into key=value pairs, or call ${c('argon2.needsRehash(stored, PARAMS)')}.`, 'xanh')) },
  { t: 'Trap: scrypt with OWASP’s parameters throws', body: sh(SCRYPT, { title: 'node demo2/scrypt-maxmem.mjs' }) +
      two(js(`// OWASP: N=2^17, r=8 ⇒ 128 × N × r = 128 MiB
const N = 2 ** 17, r = 8, p = 1;
await scryptAsync(pw, salt, 32, { N, r, p });
// ✗ ERR_CRYPTO_INVALID_SCRYPT_PARAMS
await scryptAsync(pw, salt, 32,
  { N, r, p, maxmem: 129 * 2 ** 20 });
// ✓ 275 ms`, { hl: [3] }),
        box('Why', `Node’s ${c('maxmem')} defaults to <b>32 MiB</b>. The error says “memory limit exceeded”, not “raise maxmem” — so teams “fix” it by lowering N, i.e. by making every guess cheaper.`, 'do2')) +
      cards([
        ['The rule', `${c('maxmem')} ≥ 128 × N × r bytes, plus a little`],
        ['The cost', '275 ms for one hash here — argon2id at 64 MiB is 86 ms'],
        ['When scrypt', 'no native module allowed; otherwise argon2id'],
      ], 3) },
  { t: 'Trap: bcrypt reads 72 bytes', body: two(js(`const base = 'Mật khẩu của tôi là câu thơ dài: '
  + 'Trăm năm trong cõi người ta, chữ tài';
const stored = await bcrypt.hash(
  base + ' chữ mệnh khéo là ghét nhau', 10);
await bcrypt.compare(
  base + ' — anything at all', stored);`, { hl: [5] }), sh(body('22-bcrypt72'), { title: 'node demo2/bcrypt-72.mjs' })) +
      cards([
        ['Vietnamese costs bytes', '69 characters = <b>89 bytes</b> in UTF-8; everything after byte 72 is ignored'],
        ['If you must keep bcrypt', 'cap the input at 72 bytes and say so — never silently'],
        ['Or move on', 'argon2id has no such limit (lesson 2.5 migrates bcrypt rows)'],
      ], 3) + box('Measured in depth elsewhere', 'Node.js 8.1 shows the same trap with a whole Vietnamese sentence and a wrong password that logs in. Here it is one reason, among four, to prefer argon2id.', 'lam') },
  { t: 'Where the numbers go: src/passwords/hash.js', body: js(noCmt(HASH_EX).replace(/^\n/, '// chosen by demo2/tune.mjs 100 256 (this lesson)\n'), { hl: [2] }) +
      cards([
        ['m = 65536', '64 MiB per hash — the memory budget ÷ 4 threads'],
        ['t = 2', 'two passes over that memory — the most that fits 100 ms'],
        ['p = 1', 'one login = one core: capacity is simple maths. p=4 measured faster here, but takes 4 cores per login'],
      ], 3) +
      box('Re-measure when the machine changes', 'New VPS, new CPU, Docker memory limit, a bigger thread pool: run ' + c('demo2/tune.mjs') + ' again. Raising PARAMS is safe — old rows upgrade on login (lesson 2.5).', 'lam') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li><b>argon2id</b> by default; scrypt (raise ${c('maxmem')}) or bcrypt (72 bytes) only with a reason</li>
    <li>Two budgets: ≤ 100 ms per hash, ≤ RAM ÷ threads per hash ⇒ m=64 MiB t=2 p=1 (86.5 ms here)</li>
    <li>Concurrency multiplies memory: 64 threads = +2.5 GB and no faster</li>
    <li>Parse ${c('m=…,p=…,t=…')} by name; never ${c('hashSync')} in a server</li>
    <li>Next — 2.3: a sign-in whose branches look the same</li></ul>` },
]);
