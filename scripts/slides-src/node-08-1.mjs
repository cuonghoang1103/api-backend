/**
 * node-08-1 — Node.js · Chapter 8 · Lesson 8.1 "Storing passwords: why almost every way is wrong" (slide EN, đợt 7 — 01/11/2026).
 * MỘT deck, HAI tập: node-8-1 (slide 1–13) · node-8-1-2 (slide 14–28).
 *   A: mối đe doạ (kẻ tấn công CÓ bảng User, ngoại tuyến) · bốn cách thua · đo 1 "nhanh" (thật: sha256 2.010.039/s vs bcrypt12 3,6/s = 560.026×) ·
 *      đo 2 bảng cầu vồng 1.000.000 mục 1.059 ms, tra 0,0025 ms; bcrypt12 3,2 ngày/MỘT người · không muối lộ gì · bcrypt 3 lần 3 chuỗi · mổ chuỗi
 *      $2b$10$ · argon2id $argon2id$v=19$m=19456,p=1,t=2$ · chọn hàm · chỉnh tham số
 *   B: đo 3 tải 1/4/16/64 (thật: p50 21/27/68/202 ms, RSS dừng ở 120 MB vì bể luồng 4; =8: 196 MB) · đo 4 hashSync đóng băng 2.856 ms vs 3/1 ms ·
 *      server thật: /health 2.784 ms vs 1 ms · bẫy 72 byte (thật: sai vẫn true; câu tiếng Việt 59 ký tự = 81 byte) · cột passwordHash + migration ·
 *      module password.mjs · đo 5 dò email 27,4× vs 1,0× · nâng chi phí khi đăng nhập (thật: bcrypt→argon2, t=1→t=2) · quy tắc mật khẩu +
 *      HIBP k-anonymity (thật: "123456" 210.461.208 lần) · website · bài tập · tự kiểm · tóm tắt
 * Nguồn: s08-*.mjs › nodejs-8-1-mat-khau-va-bam. Output THẬT: that/c8/{hash-speed,rainbow,salt,load-run,sync-freeze,server-freeze,trunc72,setup,timing-login,rehash,pwned}.
 * Số khác web (máy khác): sha256 2.010.039/s (web 1.016.503) · argon2 OWASP 21,7 ms (web 33,0) · bcrypt12 278,6 ms (web 324,3) · tỉ lệ 560.026× (web ~328.000×).
 */
import { lamDeck, two, box, cards, flow, bang, tep, P, J, JW, T, G, TT, dong, thanh, so } from './_c8-chung.mjs';
import { ra, ma } from './_node-chung.mjs';

export const deck = { key: 'node-08-1', code: 'NODE 8.1', title: 'Storing passwords: why almost every way is wrong', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const ps = (re) => Number(dong('c8/hash-speed', re).match(/->\s+([\d,.]+) +per second/)[1].replace(/,/g, ''));
const ms = (re) => dong('c8/hash-speed', re).match(/([\d.]+) ms each/)[1];
const SHA = ps(/^sha256/), B12 = ps(/^bcrypt cost=12/), AR = ps(/^argon2id \(OWASP/), MD5 = ps(/^md5/), B10 = ps(/^bcrypt cost=10/);
const TILE = dong('c8/hash-speed', /faster than/).match(/is ([\d,]+)x/)[1];

export const slides = lamDeck({ chuong: 'Chapter 8 — Authentication & authorisation', bai: '8.1' }, [
  { cover: true, t: 'Storing passwords:<br>why almost every way is wrong', sub: 'The one place in a backend where intuition does real damage. So this lesson measures first and argues later.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>The threat model: what you are really defending against</li>
<li>Four ways to lose, and the one rule: a password is never stored, only verified</li>
<li>Five measurements on this laptop: speed, a rainbow table, load, a frozen server, a timing leak</li>
<li>argon2id with OWASP settings, a complete <code class="i">password.mjs</code>, and how to upgrade old hashes</li>
<li>Which password rules help and which ones hurt</li>
</ul>` + box('Why it matters to you', 'Every backend job has a login. Interviewers ask "how do you store passwords?" — and the honest answer comes with numbers.', 'lam') },

  { t: 'The threat model: say it before you code', to: true, giua: true, body: two(
    box('Not this', 'Someone typing guesses into your login form. That is the job of rate limiting (lesson 8.4).', 'do2'),
    box('This', 'The day your database is <b>copied out</b>: a leaked backup, an SQL injection, a lost laptop, a former employee.', 'xanh')) +
    flow([{ t: 'your User table', s: 'copied out', mau: LAM }, { t: 'attacker\'s machine', s: 'offline, many GPUs', mau: DO }, { t: 'try guesses', s: 'no rate limit', mau: DO }, { t: 'same password', s: 'on their e-mail', mau: CAM }]) +
    box('The only question that matters', 'With your table on their machine, how long until one stored value turns back into a password the user also uses for their e-mail?', '') },

  { t: 'Four ways to lose', to: true, giua: true, body: cards([
    ['Plain text', 'The leak IS the password. Most people reuse passwords, so you leak their e-mail too.'],
    ['Encryption (AES…)', 'Built to be reversed. The key sits in the same .env the app reads, so whoever got the table often gets the key.'],
    ['MD5 / SHA-256', 'Cannot be reversed, but fast — and fast is the vulnerability. Measured next.'],
    ['SHA-256 + home-made salt', 'Still fast. Home-made schemes also leak elsewhere: no version, non-constant-time compare, reused salt.'],
  ], 2) + box('The rule to remember', 'A password is never <b>stored</b>, it is only <b>verified</b>. You keep a value that answers "is this the right password?" and is worthless to whoever steals it.', 'xanh') },

  { t: 'Measurement 1 — how fast is "fast"?', to: true, giua: true, body: J(ma('c8/hash-speed', 10, 12), { sm: false }) +
    J("for (const cost of [8, 10, 12, 14]) bcrypt.hashSync(PW, cost);\nawait argon2.hash(PW, { type: argon2.argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1 });", { sm: false }) +
    TT('c8/hash-speed', 2, 13, 'node hash-speed.mjs · one core of this laptop · real', { hl: [2, 7, 10], n: 110 }) },

  { t: `${so(SHA)} versus ${B12}`, to: true, giua: true, body: thanh([
    ['sha256', SHA, DO, `${so(SHA)} / s`],
    ['md5', MD5, DO, `${so(MD5)} / s`],
    ['argon2id (OWASP)', AR, NODE, `${AR} / s`],
    ['bcrypt cost=10', B10, NODE, `${B10} / s`],
    ['bcrypt cost=12', B12, NODE, `${B12} / s`],
  ], { log: true, wMax: 520, ghi: 'guesses per second on ONE core · log scale (each step to the right = 10× more) · real' }) +
    box(`sha256 is ${TILE}× faster than bcrypt cost=12`, 'A password hash is not a hash that happens to be slow. Being slow is its entire job: every guess costs the attacker the same time it costs you once at login.', 'cam') },

  { t: 'Measurement 2 — build a rainbow table, right here', to: true, giua: true, body: J(ma('c8/rainbow', 7, 12), { sm: false, hl: [5] }) + J(ma('c8/rainbow', 16, 18), { sm: false }) +
    TT('c8/rainbow', 2, 3, 'node rainbow.mjs · every 6-digit password · real', { hl: [2] }) +
    box('"Nobody can reverse SHA-256" is true and irrelevant', 'The attacker does not reverse anything. They hash every candidate once, then look the leaked value up in a table.', 'do2') },

  { t: 'The same attack against bcrypt', to: true, giua: true, body: J(ma('c8/rainbow', 21, 27), { sm: false, hl: [5] }) + TT('c8/rainbow', 5, 7, 'node rainbow.mjs · real', { hl: [2] }) +
    two(box('No table any more', 'Every guess is one slow bcrypt call, so building a table costs as much as the attack itself.', 'xanh'),
      box('…and per user', 'Each user has a different random salt, so the work for An cannot be reused for Chi.', 'xanh')) },

  { t: 'Salt: what a table without it leaks', to: true, giua: true, body: TT('c8/salt', 2, 5, 'node salt.mjs · sha256, no salt · real', { hl: [2, 4] }) +
    box('Nothing cracked yet, already a leak', 'An and Chi have the same value, so they have the same password. Crack one, you have both.', 'do2') +
    TT('c8/salt', 7, 11, 'node salt.mjs · bcrypt, the same password three times · real', { hl: [5] }) +
    box('salt (muối)', 'random bytes mixed into the hash, different for every call. Same password, three different strings — and compare still says true.', 'xanh') },

  { t: 'One stored string, taken apart', to: true, giua: true, body: TT('c8/salt', 14, 19, 'node salt.mjs · real') + cards([
    ['$2b$', 'which algorithm — so you can migrate later'],
    ['$10$', 'the cost — old hashes still verify after you raise it'],
    ['salt (22)', 'random per user — kills shared rainbow tables'],
    ['hash (31)', 'the actual derived key'],
  ], 4) + box('One column is enough', 'The string describes itself, so you never store salt or cost in separate columns. verify() reads everything it needs from this one value.', 'lam') },

  { t: 'argon2id stores the same kind of string', to: true, giua: true, body: TT('c8/salt', 22, 23, 'node salt.mjs · argon2 0.45.1 · real', { n: 96 }) +
    bang(['part', 'meaning'], [
      ['<code class="i">argon2id</code>', 'the algorithm (a hybrid of argon2i and argon2d)'],
      ['<code class="i">v=19</code>', 'version 1.3 of the algorithm'],
      ['<code class="i">m=19456,p=1,t=2</code>', '19 MiB of memory, 1 lane, 2 passes'],
      ['then', 'the salt, then the hash (base64)'],
    ], { co: 22 }) + box('m is the new weapon', 'bcrypt only costs time. argon2id also costs memory, and memory is exactly what a GPU with thousands of cores cannot give each core.', 'cam') },

  { t: 'Which function to choose', to: true, giua: true, body: cards([
    ['argon2id', 'First choice. Tunable memory AND time. Winner of the Password Hashing Competition (2015).'],
    ['bcrypt', 'Still fine, 25+ years of scrutiny, everywhere. Two real limits: truncates at 72 bytes, CPU-hard only.'],
    ['scrypt', 'Memory-hard too, built into Node (crypto.scrypt), no native module. Good when you cannot add packages.'],
    ['PBKDF2', 'Only when a compliance rule names it. Not memory-hard, not modern.'],
  ], 2) + box('If you took API Design lesson 6.1', 'There LabFlow uses scrypt from node:crypto — the "no extra package" choice from this list, salted and compared in constant time.', 'lam') },

  { t: 'Tuning the parameters', to: true, giua: true, body: J("// OWASP 2024 baseline for argon2id\nconst OPTS = { type: argon2.argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1 };", { sm: false }) +
    bang(['setting', 'measured here', 'note'], [
      ['argon2id, library default (m=64 MiB, t=3, p=4)', `${ms(/^argon2id \(library/)} ms`, 'stronger, 3× the memory per login'],
      ['argon2id, OWASP (m=19 MiB, t=2, p=1)', `${ms(/^argon2id \(OWASP/)} ms`, 'the baseline this course uses'],
      ['bcrypt cost=12', `${ms(/^bcrypt cost=12/)} ms`, 'each +1 doubles the time'],
    ], { co: 21, hl: [1] }) +
    box('The rule is not "copy a number"', 'Pick the highest cost your login endpoint can afford, then measure it on the machine that will run it. The next part measures exactly that.', 'xanh') },

  // ───────── phần B (tập node-8-1-2) ─────────
  { t: 'Measurement 3 — what that cost does under load', to: true, giua: true, body: J(ma('c8/load', 9, 15), { sm: false, hl: [5, 6] }) +
    TT('c8/load-run', 1, 12, 'node load.mjs, then UV_THREADPOOL_SIZE=8 · real', { hl: [6, 12] }) },

  { t: 'Read the two runs', to: true, giua: true, body: thanh([
    ['1 at once', 21, NODE, '21 ms'], ['4 at once', 27, NODE, '27 ms'], ['16 at once', 68, CAM, '68 ms'], ['64 at once', 202, DO, '202 ms (slowest 366)'],
  ], { wMax: 440, ghi: 'median login time, default thread pool of 4 · real' }) + two(
    box('Latency degrades, it does not collapse', 'Four hashes run at a time on the libuv thread pool (chapter 2); the rest wait in line.', 'lam'),
    box('Memory stays bounded', 'RSS stops at 120 MB with 4 threads and 196 MB with 8: 64 × 19 MiB never all exist at once. The pool is your memory limit.', 'xanh')) +
    box('That is why /auth/login is a target', 'Every attempt burns ~22 ms of CPU and 19 MiB of RAM. Lesson 8.4 rate-limits it.', 'do2') },

  { t: 'Measurement 4 — the sync version freezes everything', to: true, giua: true, body: JW(ma('c8/sync-freeze', 17, 20), 100, [1], { sm: false }) +
    TT('c8/sync-freeze', 2, 4, 'node sync-freeze.mjs · a 50 ms heartbeat runs alongside · real', { hl: [1], n: 110 }) +
    box('Four letters apart: hashSync vs hash', 'The sync call runs on the event loop itself, so nothing else runs for 2.9 seconds. The async call runs on the thread pool: the heartbeat was at most 3 ms late.', 'do2') },

  { t: 'On a real Express server', to: true, giua: true, body: J(ma('c8/server-freeze', 9, 11), { sm: false, hl: [2] }) +
    TT('c8/server-freeze', 2, 3, 'node server-freeze.mjs · 10 logins, then GET /health · real', { hl: [1] }) +
    box('What the load balancer sees', 'A health check that takes 2.8 seconds looks like a dead container. With 10 people logging in, it pulls your server out of rotation.', 'do2') +
    box('Chapter 2 again, with the bill this time', 'Never call a *Sync crypto function inside a request handler.', 'xanh') },

  { t: 'The trap that lets a WRONG password log in', to: true, giua: true, body: JW(ma('c8/trunc72', 5, 12), 96, [5], { sm: false }) +
    TT('c8/trunc72', 2, 4, 'node trunc72.mjs · real', { hl: [2] }) +
    box('bcrypt reads only the first 72 BYTES', 'Everything after byte 72 is dropped silently: no error, no warning. argon2 has no such limit.', 'do2') },

  { t: '72 bytes is not 72 characters', to: true, giua: true, body: TT('c8/trunc72', 6, 9, 'node trunc72.mjs · a Vietnamese passphrase · real', { hl: [1, 2] }) +
    two(box('Why', 'In UTF-8, letters with Vietnamese marks take 2–3 bytes. 59 characters became 81 bytes, so the last word was never hashed.', 'cam'),
      box('If you stay on bcrypt', 'Reject passwords over 72 bytes with a clear message — never silently. Or migrate to argon2id at the next login (later in this lesson).', 'xanh')) +
    J(ma('c8/trunc72', 19, 20), { sm: false }) },

  { t: 'Where the hash lives: one nullable column', to: true, giua: true, body: P(tep('c8/schema-auth.prisma', 15, 22), { sm: false, hl: [5, 6, 7] }) + T(G('c8/setup', 21, 23), 'npx prisma migrate dev --name add_auth  ⇒  migration.sql · real', { hl: [1] }) +
    box('Why String? and not String', 'An account created through Google sign-in has no password at all. NULL plus a verify that returns false is what stops "log in with an empty password".', 'lam') },

  { t: 'The whole module', to: true, giua: true, body: J(ma('c8notes/password', 1, 18), { hl: [5, 9, 12, 16] }) },

  { t: 'Measurement 5 — does your login say "this email exists"?', to: true, giua: true, body: JW(ma('c8/timing-login', 8, 12), 104, [3], { sm: false }) + JW(ma('c8/timing-login', 13, 17), 104, [3], { sm: false }) +
    TT('c8/timing-login', 2, 3, 'node timing-login.mjs · median of 30 each · real', { hl: [1] }) },

  { t: 'Same answer, same time, same status', to: true, giua: true, body: two(
    box('The leak', 'Skipping the hash for unknown emails makes them 27 times faster. A script can sort a million addresses into "has an account here" and "does not" without guessing one password.', 'do2'),
    box('The fix', 'Always verify — against DUMMY_HASH when the user does not exist. Both paths now cost one argon2 call.', 'xanh')) +
    bang(['', 'email unknown', 'wrong password'], [['time', '≈ the same', '≈ the same'], ['status', '401', '401'], ['message', '"Wrong email or password"', '"Wrong email or password"']], { co: 23 }) +
    box('Why it matters', 'On a dating site, a health portal or a political forum, "this person has an account" can endanger a real person.', 'cam') },

  { t: 'Raise the cost without asking anyone to reset', to: true, giua: true, body: JW(ma('c8/rehash', 16, 25), 118, [5, 6]) +
    TT('c8/rehash', 2, 4, 'node rehash.mjs · three accounts stored over the years · real', { n: 112 }) +
    box('Login is the only moment you hold the plain password', 'Check with whatever algorithm the stored prefix says, then re-hash with today\'s settings. After a few months only inactive accounts remain old.', 'xanh') },

  { t: 'Password rules that help, and rules that hurt', to: true, giua: true, body: two(
    box('Help', '<b>Length</b>: at least 8–12, allow long passphrases (64+) and every character.<br><b>Block leaked passwords</b>: check them against Have I Been Pwned.', 'xanh'),
    box('Hurt', '<b>Forced change every 90 days</b>: NIST dropped it; it breeds Password1! → Password2!.<br><b>"1 upper, 1 digit, 1 symbol"</b>: everybody lands on the same guessable pattern.', 'do2')) +
    J(ma('c8/pwned', 5, 7), { sm: false, hl: [2] }) + TT('c8/pwned', 2, 5, 'node pwned.mjs · api.pwnedpasswords.com · real', { n: 118, hl: [1] }) },

  { t: 'This website', to: true, giua: true, body: cards([
    ['argon2id, OWASP settings', 'And only the async API — the hashSync measurement above is the reason.'],
    ['Always verify', 'Even for unknown emails, so the response time carries no information.'],
    ['passwordHash String?', 'Nullable, because Google OAuth accounts have no password; verify returns false on null.'],
  ], 3) + flow([{ t: 'POST /auth/login', s: 'email + password', mau: LAM }, { t: 'findUnique(email)', s: 'maybe null', mau: LAM }, { t: 'argon2.verify', s: 'real hash or DUMMY_HASH', mau: NODE }, { t: '401 or tokens', s: 'same time either way', mau: CAM }], { h: 130 }) + box('The same rules in other courses', 'The Authentication course spends a whole chapter here (lessons 2.1–2.5): hash migration, constant-time login flow, policy. Use it when you want to go deeper.', 'lam') },

  { t: 'Exercise', to: true, giua: true, body: J("// what the teammate wrote\nconst salt = crypto.randomBytes(16).toString('hex');\nconst stored = salt + ':' + crypto.createHash('sha256').update(salt + pw).digest('hex');", { sm: false }) + box('Exercise', 'Your teammate stores passwords with <code class="i">crypto.createHash(\'sha256\').update(salt + pw)</code>, with a random salt per user. They say "it is salted, so it is fine". Using this lesson\'s numbers, what do you answer, and what do you change without forcing anyone to reset?', '') +
    `<div data-k="dapan">${box('Answer', `Salt stops shared tables, but each guess still costs one SHA-256: about ${so(SHA)} guesses per second per core, against ${AR} for argon2id. Switch to argon2id and upgrade each account at its next successful login (check the old format by its prefix, re-hash, save).`, 'xanh')}</div>` },

  { t: 'Self-check', to: true, giua: true, body: `<ol>
<li>What exactly are you defending against when you hash passwords?</li>
<li>Why is a fast hash dangerous even with a salt?</li>
<li>Why does a bcrypt string not need separate salt and cost columns?</li>
<li>What can a 27× faster "email not found" response leak?</li>
<li>When can you re-hash a user's password with new settings?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. Someone who has a copy of your User table, offline. &nbsp;2. Every guess is cheap, so trying millions is cheap. &nbsp;3. Algorithm, cost and salt are inside the string. &nbsp;4. Which emails have an account. &nbsp;5. Only at login, when you briefly hold the plain password.', 'xanh')}</div>` },

  { t: 'Summary', to: true, giua: true, body: `<ul>
<li>Threat: the attacker has your table, offline. Never store a password, only verify it</li>
<li>Fast = broken: ${so(SHA)} SHA-256 per second vs ${B12} bcrypt(12) per second</li>
<li>Salt per user, inside the stored string; argon2id with OWASP settings (m=19 MiB, t=2, p=1)</li>
<li>Never the sync API: hashSync froze the server for 2.9 seconds</li>
<li>One answer for every failed login: same time, same 401, same message</li>
<li>Upgrade old hashes at login; block leaked passwords, not "symbols"</li>
</ul>` + box('Next: lesson 8.2', 'What you hand back after a correct password: JWT access tokens, refresh tokens, and rotation.', 'lam') },
]);
