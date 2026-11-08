/**
 * node-09-4 — Node.js · Chapter 9 · Lesson 9.4 "Secrets, dependencies and what your errors give away" (slide EN, đợt 8 — 01/11/2026).
 * MỘT deck, HAI tập: node-9-4 (slide 1–14) · node-9-4-2 (slide 15–26).
 *   A: bí mật JWT yếu (thật: tìm "supersecret" trong 0,93 ms; jwt.verify 38 736/s vs HMAC thô 877 404/s ⇒ 26^8 = 2,8 ngày, 36^8 = 37,2 ngày) · token admin giả
 *      verify được (thật) · 32 byte ngẫu nhiên · so chuỗi bí mật (thật: timingSafeEqual ném lỗi khi khác độ dài) · so bản băm · lỗi khai gì (thật: ENOENT +
 *      đường dẫn + stack) vs INTERNAL + requestId · X-Request-ID của production (curl thật: 12 ký tự)
 *   B: bao nhiêu code không do mình viết (thật: sandbox Ch8 10 gói trực tiếp, 181 package.json ở độ sâu 2, 243 gói theo npm ls) · gói độc lúc CHẠY (thật, giá trị
 *      giả, env sạch) · bốn lớp phòng · bí mật nằm ở đâu · NEXT_PUBLIC_* không phải bí mật · website này (gitleaks: đọc .gitleaks.toml thật) · danh sách
 *      kiểm trước production · bài tập · tự kiểm · tóm tắt
 * Nguồn: nodejs-9-4-bi-mat-va-phu-thuoc. Output THẬT: that/c9/{jwt-crack,timing-safe,error-leak,deps-count,evil-dep} + c9/prod-headers.
 * Khác web: tốc độ đoán đo bằng HMAC thô (cách kẻ tấn công làm) nhanh hơn jwt.verify 22× ⇒ 26^8 = 2,8 ngày (web 68,2 ngày, đo bằng jwt.verify) ·
 *   10 gói / 181 (web 9 / 183) · X-Request-ID 12 ký tự (web "tám ký tự") · .gitleaks.toml nay miễn trừ generic-api-key + jwt trên courses/exphub/exams.
 */
import { lamDeck, two, box, cards, flow, bang, J, JW, T, TT, G, gay, thanh, dong } from './_c9-chung.mjs';
import { ma, ra } from './_node-chung.mjs';
const gonLenh = (t) => t.replace(/cd ~\/Documents\/video-bai-giang\/scratchpad\/node\/may-auth && /g, '').replace(/PATH=\S+ HOME=\S+ /, '').replace(/\/Users\/\S+\/bin\/node /, 'node ');

export const deck = { key: 'node-09-4', code: 'NODE 9.4', title: 'Secrets, dependencies and what your errors give away', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e';
const so = (re) => Number(dong('c9/jwt-crack', re).match(/([\d,]+) secrets/)[1].replace(/,/g, ''));

export const slides = lamDeck({ chuong: 'Chapter 9 — Application security', bai: '9.4' }, [
  { cover: true, t: 'Secrets, dependencies<br>and what your errors give away', sub: 'Not a clever payload: the values your process holds, the code it runs, and what it says when something breaks.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>A weak JWT secret cracked from one token — and how fast an attacker really guesses</li>
<li>Comparing secrets without leaking them through timing</li>
<li>What one well-meant error line tells an attacker, and the request-id pattern instead</li>
<li>How much code you run that you never wrote — and a "utility" that steals your env</li>
<li>Where secrets belong, and a short checklist before production</li>
</ul>` + box('Why it matters to you', 'None of this is fun to do, and all three are how real systems get in — far more often than a clever payload.', 'lam') },

  { t: 'This lesson is about your own process', to: true, giua: true, body: flow([
    { t: 'values it holds', s: 'JWT_SECRET, DATABASE_URL…', mau: CAM }, { t: 'code it runs', s: 'yours + 240 packages', mau: LAM }, { t: 'what it says', s: 'error responses, logs', mau: DO }], { h: 150 }) +
    cards([['Lessons 9.1–9.3', 'were about requests: headers, XSS, hostile input.'], ['This one', 'is about the process those requests hit — what it knows and what it lets slip.'], ['The theme', 'Make the boring defaults right once, then never think about them again.']], 3) +
    bang(['measurement', 'question'], [['1 · weak secret', 'how long does one token protect a guessable key?'], ['2 · comparison', 'can timing reveal a key?'], ['3 · errors', 'what does a 500 tell a stranger?'], ['4 · dependencies', 'how much code runs with your rights?']], { co: 22 }) },

  { t: 'Measurement 1: a weak JWT secret', to: true, giua: true, body: J("const WEAK = ['secret', 'password', '123456', 'changeme', 'jwt_secret',\n             'supersecret', 'mysecretkey', 'secretkey', 'nodejs', 'admin123'];\nfor (const w of WEAK) { try { jwt.verify(token, w); found = w; break } catch {} }", { sm: false, hl: [2, 3] }) +
    TT('c9/jwt-crack', 2, 2, 'node jwt-crack.mjs · the attacker has ONE token, readable from any logged-in browser · real', { hl: [1], sm: false }) +
    box('Under a millisecond', 'Chapter 8 built the whole auth system on JWT_SECRET. If it is an English word, the system is one dictionary away.', 'do2') +
    flow([{ t: 'any logged-in user', s: 'DevTools → copy token', mau: LAM }, { t: 'offline, no requests', s: 'your rate limit never sees it', mau: CAM }, { t: 'try candidate secrets', s: 'until the signature matches', mau: DO }], { h: 130 }) },

  { t: 'How fast does an attacker really guess?', to: true, giua: true, body: TT('c9/jwt-crack', 3, 4, 'node jwt-crack.mjs · ONE core of this laptop · real', { hl: [2], sm: false }) +
    thanh([['jwt.verify', so(/via jwt.verify/), CAM, so(/via jwt.verify/).toLocaleString('en-US') + ' / s'], ['raw HMAC-SHA256', so(/raw HMAC/), DO, so(/raw HMAC/).toLocaleString('en-US') + ' / s']], { ghi: 'secrets tried per second · one core · real' }) +
    box('A cracker does not call jwt.verify', 'It recomputes the HMAC of header.payload and compares the signature: about 22× faster here. A GPU is much faster again.', 'do2') },

  { t: 'Brute force, at the raw speed', to: true, giua: true, body: TT('c9/jwt-crack', 5, 7, 'node jwt-crack.mjs · one core · real', { hl: [1, 2], sm: false }) +
    bang(['secret', 'one core', 'verdict'], [['8 lowercase letters', dong('c9/jwt-crack', /26\^8/).match(/= (.*)$/)[1], 'gone over a weekend'], ['8 letters + digits (human-made)', dong('c9/jwt-crack', /36\^8/).match(/= (.*)$/)[1], 'gone in a month — days on rented GPUs'], ['32 random bytes', dong('c9/jwt-crack', /2\^256/).match(/= (.*)$/)[1], 'the only acceptable line']], { co: 22, hl: [2] }) +
    box('The lesson page said 68.2 days', 'It measured through jwt.verify. Measured the way an attacker works, it is 2.8 days — the page now says so.', 'cam') },

  { t: 'Once they have the secret', to: true, giua: true, body: J("jwt.sign({ sub: 1, role: 'admin' }, found, { algorithm: 'HS256', expiresIn: '365d' });", { sm: false, hl: [1] }) +
    TT('c9/jwt-crack', 8, 8, 'node jwt-crack.mjs · the forged token, verified by the real secret · real', { hl: [1], n: 100, sm: false }) +
    two(box('They do not steal sessions', 'They MINT tokens: any user id, any role, any expiry, correctly signed.', 'do2'),
      box('Chapter 8 is void', 'Rotation, revocation, rate limits: to the server these tokens are genuine.', 'do2')) +
    flow([{ t: 'secret cracked', s: '"supersecret"', mau: DO }, { t: 'jwt.sign(role: admin)', s: 'on the attacker\'s laptop', mau: CAM }, { t: 'your jwt.verify', s: '✓ valid signature', mau: LAM }, { t: 'admin for a year', s: 'expiresIn 365d', mau: DO }], { h: 130 }) },

  { t: 'The rule: generate, never invent', to: true, giua: true, body: TT('c9/jwt-crack', 9, 9, 'node jwt-crack.mjs · real', { sm: false, n: 100 }) +
    J("node -e \"console.log(require('crypto').randomBytes(32).toString('base64url'))\"", { sm: false }) +
    cards([['Same shape, same rule', 'Session keys, webhook signing keys, service-to-service tokens, cron trigger keys.'], ['If a human remembers it', 'it is too short.'], ['Leaked once?', 'Rotate it. Deleting the line from the code does not un-leak it.']], 3) +
    box('Per environment', 'Development, staging and production each get their own generated value. An .env.example holds a placeholder, never a working secret.', 'lam') },

  { t: 'Measurement 2: comparing a secret', to: true, giua: true, body: J("const cmpSafe = (a, b) => {\n  const x = Buffer.from(a), y = Buffer.from(b);\n  return x.length === y.length && crypto.timingSafeEqual(x, y);\n};", { sm: false, hl: [3] }) +
    TT('c9/timing-safe', 2, 3, 'node timing-safe.mjs · real', { hl: [1], n: 100, sm: false }) +
    two(box('=== stops at the first different byte', 'So its time depends on how many leading bytes are RIGHT — measurable, and usable to rebuild a key byte by byte.', 'do2'),
      box('timingSafeEqual THROWS on different lengths', 'It does not return false. Always check the length first, as the wrapper does.', 'cam')) },

  { t: 'Usually: compare hashes instead', to: true, giua: true, body: TT('c9/timing-safe', 4, 4, 'node timing-safe.mjs · real', { sm: false, n: 100 }) +
    two(box('Fixed length by construction', 'sha256 of anything is 32 bytes: the length check can never fail, and timing tells nothing about the stored key.', 'xanh'),
      box('Safer if the database leaks', 'The same pattern chapter 8 used for refresh tokens: store the hash, never the token.', 'xanh')) +
    box('If you took Authentication lesson 1.3', 'It measures the timing difference of a naive compare and builds constant-time comparison from scratch.', 'lam') },

  { t: 'Measurement 3: what your errors say', to: true, giua: true, body: J("catch (err) { res.status(500).json({ error: err.message, stack: … }); }   // well-meant", { sm: false, hl: [1] }) +
    TT('c9/error-leak', 2, 4, 'node error-leak.mjs · real', { hl: [1, 3], n: 96, sm: false }) +
    two(box('The first response says', 'the deployment path, that a .env.production exists, and the Node internals in the stack frames.', 'do2'),
      box('Database errors are worse', 'Connection errors print host, port and user; a Prisma P2002 prints constraint and column names — your schema.', 'do2')) },

  { t: 'Log everything, return almost nothing', to: true, giua: true, body: J("app.use((err, req, res, next) => {\n  logger.error({ requestId: req.id, msg: err.message, stack: err.stack });   // your log\n  res.status(500).json({ error: 'INTERNAL', requestId: req.id });              // the client\n});", { hl: [2, 3], sm: false }) +
    TT('c9/prod-headers', 17, 17, 'curl -sI https://cuongthai.com/api/v1/courses · real', { sm: false }) +
    cards([['Log in full', 'message, stack, request id, user id — where only you read.'], ['Return a stable code + the id', 'Enough for the user to paste into a support ticket.'], ['4xx ≠ 5xx', 'Validation errors should be specific (lesson 6.3); internal ones should not.']], 3) },

  { t: 'The request id makes it work', to: true, giua: true, body: flow([
    { t: 'user sees', s: 'INTERNAL · hrQtOFKxH4G7', mau: LAM }, { t: 'support ticket', s: '12 characters', mau: CAM }, { t: 'grep the log', s: 'requestId', mau: NODE }, { t: 'full stack trace', s: 'for you only', mau: NODE }], { h: 150 }) +
    box('This website', 'Every response carries X-Request-ID (12 characters from nanoid, or the id nginx already sent). It is also in exposedHeaders, so the frontend can show it.', 'xanh') +
    box('Never the other way round', 'The detail lives in your log; the client gets a key to find it.', 'lam') +
    box('The lesson page said "eight characters"', 'Measured: 12 (nanoid(12) in src/index.ts). Fixed on the page.', 'cam') },

  { t: 'Part 1 in one table', to: true, giua: true, body: bang(['measured', 'result', 'fix'], [
    ['weak JWT secret', 'found in under 1 ms; 8 chars ≈ days', 'randomBytes(32), from env'],
    ['comparing secrets', '=== leaks timing; timingSafeEqual throws on length', 'compare fixed-length hashes'],
    ['500 with err.message', 'path, file name, stack', 'INTERNAL + requestId; details to the log'],
  ], { co: 22 }) + box('The common thread', 'Every one of these is a default you set once: a generated secret, a hash compare, an error handler. Nobody notices them until they are missing.', 'xanh') +
    box('Next: the code you did not write', '10 dependencies, 240 packages, and one that sends your environment away.', 'lam') },

  { t: 'Measurement 4: code you did not write', to: true, giua: true, body: T(gonLenh(ra('c9/deps-count', 1, 6)), 'cd may-auth · the chapter 8 sandbox (Express + Prisma + auth) · real', { hl: [2, 4, 6], sm: false }) +
    two(box('10 chosen, ~240 run', 'Every one of them executes with the FULL rights of your process: process.env, the file system, the network.', 'do2'),
      box('Measured three ways', '10 direct dependencies; 181 package.json at depth two (the lesson page\'s command); 243 packages in npm ls.', 'lam')) +
    flow([{ t: 'package.json', s: '10 lines you wrote', mau: NODE }, { t: 'npm install', s: 'resolves the tree', mau: CAM }, { t: 'node_modules', s: '243 packages', mau: DO }], { h: 120 }) },

  { t: 'A "utility" package', to: true, giua: true, body: JW(ma('c9/evil/left-pad-vn/index', 1, 7), 84, [2, 4, 5], { sm: false }) +
    flow([{ t: 'require(\'left-pad-vn\')', s: 'your app.js', mau: LAM }, { t: 'module code runs', s: 'once, at load', mau: CAM }, { t: 'filter process.env', s: '/SECRET|KEY|TOKEN|…/', mau: DO }, { t: 'send it away', s: 'here: a file', mau: DO }], { h: 130 }) +
    box('Line 2 is the real function', 'The rest is the payload. In a real attack the file write is a network request.', 'do2') },

  { t: 'Run it', to: true, giua: true, body: T(gay(gonLenh(ra('c9/evil-dep', 1, 1)), 96) + '\n' + G('c9/evil-dep', 2, 4, 96), 'a clean environment, all values FAKE · real', { hl: [2, 4], sm: false }) +
    two(box('The function still works', 'The result is right. Tests stay green.', 'cam'),
      box('The only trace', 'An outbound connection nobody watches.', 'do2')) +
    box('A lesson we learned making this slide', 'The first run used the shell\'s normal environment: the "loot" contained two real tokens of the recording machine. Rerun with env -i and fake values only. Your dev machine is a target too.', 'do2') },

  { t: 'Runtime, not install time', to: true, giua: true, body: two(
    box('Chapter 4 measured install time', 'A postinstall script wrote to your HOME before you imported anything. <code class="i">--ignore-scripts</code> stops that.', 'lam'),
    box('This is runtime', 'The code runs when you require it, inside your app. --ignore-scripts does nothing here.', 'do2')) +
    flow([{ t: 'npm install', s: 'postinstall (ch. 4)', mau: CAM }, { t: 'require()', s: 'module code runs', mau: DO }, { t: 'your app', s: 'same process.env', mau: DO }], { h: 130 }) +
    box('What limited the damage in our run', 'Only what was in the environment could leave. A process that holds fewer secrets loses fewer — the fourth defence on the next slide.', 'xanh') },

  { t: 'Four defences, strongest first', to: true, giua: true, body: cards([
    ['Fewer dependencies', '"Is this worth 40 packages?" is a security question, not a style question.'],
    ['Lockfile + npm ci', 'You reviewed one tree; install exactly that tree (lesson 4.2). A caret range means tomorrow\'s build runs code nobody read.'],
    ['Read the diff on upgrade', 'Not every line — but new network code or a new transitive dependency deserves thirty seconds.'],
    ['Least privilege at runtime', 'A backend that never touches R2 should not have R2_SECRET_ACCESS_KEY in its environment.'],
  ], 2) + box('What npm audit does and does not do', 'It reports KNOWN vulnerabilities in published versions. A brand-new malicious release is not in any database yet — the four habits above are what catch it.', 'cam') },

  { t: 'Where secrets actually belong', to: true, giua: true, body: bang(['place', 'verdict', 'why'], [
    ['in code / in git', 'NEVER', 'git history and every clone keep it; rotate, do not just delete'],
    ['in the Docker image', 'no', 'anyone who pulls the image reads the layers; ARG values stay in history'],
    ['runtime environment', 'yes', 'loaded when the container starts, from a file deploys never overwrite'],
    ['a secrets manager', 'better', 'rotation, access log, per-service permissions — the step after one VPS'],
  ], { co: 22, hl: [2] }) + two(box('.env in .gitignore', 'From the first commit. Check with git status before every push.', 'xanh'), box('.env.example in git', 'Variable NAMES with placeholders — documentation, never values.', 'lam')) +
    flow([{ t: 'git', s: 'names only', mau: NODE }, { t: 'image', s: 'no secrets', mau: NODE }, { t: 'container start', s: 'env loaded', mau: CAM }, { t: 'process.env', s: 'only what it needs', mau: LAM }], { h: 120 }) },

  { t: 'Frontend variables are not secrets', to: true, giua: true, body: J("NEXT_PUBLIC_GIPHY_API_KEY=…   // baked into the JavaScript bundle at build time", { sm: false, hl: [1] }) +
    two(box('NEXT_PUBLIC_* goes to every visitor', 'Embedded at build time; restarts do not change it. A third-party key there is public the moment you deploy.', 'do2'),
      box('This website learned it', 'The GIF picker once called GIPHY from the browser with that variable. Today /api/v1/gifs is a server-side proxy with the key from runtime env.', 'xanh')) +
    flow([{ t: 'next build', s: 'reads NEXT_PUBLIC_*', mau: CAM }, { t: 'JS bundle', s: 'value inlined', mau: DO }, { t: 'every visitor', s: 'View Source → key', mau: DO }], { h: 130 }) +
    box('Rule', 'Every third-party API the browser needs goes through a backend route.', 'lam') },

  { t: 'This website keeps secrets like this', to: true, giua: true, body: cards([
    ['Runtime env on the VPS', 'One .env outside the code tree, loaded at every deploy; deploys never overwrite it and nothing secret is baked into an image.'],
    ['gitleaks before every commit', 'Refuses anything shaped like a key.'],
    ['A narrow, tested exception', 'Course content prints sample tokens on purpose, so only the generic-api-key and jwt rules are off, only for content/(courses|exphub|exams)/ — and a real RSA key put there is still caught.'],
  ], 3) + T("[[allowlists]]\ntargetRules = [\"generic-api-key\", \"jwt\"]\npaths = ['''content/(courses|exphub|exams)/''']", '.gitleaks.toml · read 01/11/2026', { sm: false }) },

  { t: 'A short checklist before production', to: true, giua: true, body: bang(['', 'check', 'lesson'], [
    ['1', 'helmet + CSP, one owner per header', '9.1'], ['2', 'explicit CORS allow-list, never origin: true with credentials', '9.1'],
    ['3', 'sanitise at render; every dangerouslySetInnerHTML through one function', '9.2'], ['4', 'schema first: length, item count, body size', '9.3'],
    ['5', 'no URLs from users — or allow-list + re-check every hop', '9.3'], ['6', '32-byte random secrets in runtime env, rotatable', '9.4'],
    ['7', 'opaque 5xx: code + request id; stack to the log', '9.4'], ['8', 'npm ci in CI: the tree you reviewed is the tree you ship', '4.2'],
  ], { co: 21 }) },

  { t: 'Exercise', to: true, giua: true, body: J("// .env.example committed to git\nJWT_SECRET=supersecret\n\n// app.js\napp.use((err, req, res, next) => res.status(500).json({ error: err.message }));", { sm: false, hl: [2, 5] }) +
    box('Exercise', 'Two problems. For each: what can an attacker do, and what exactly do you change?', '') +
    `<div data-k="dapan">${box('Answer', 'JWT_SECRET=supersecret: a real deploy that copies the example is cracked in under 1 ms and anyone can mint admin tokens — generate randomBytes(32) per environment and rotate the leaked one. err.message: leaks paths, file names and schema — log it with a request id, return { error: \'INTERNAL\', requestId }.', 'xanh')}</div>` },

  { t: 'Self-check', to: true, giua: true, body: `<ol>
<li>Why is a cracker much faster than looping over jwt.verify?</li>
<li>What does an attacker do with your JWT secret?</li>
<li>Why must you check lengths before timingSafeEqual?</li>
<li>What should a 500 response contain?</li>
<li>Why does --ignore-scripts not protect against a malicious dependency at runtime?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. It recomputes the HMAC directly: ~22× faster on one core here. &nbsp;2. Mints valid tokens for any user and role. &nbsp;3. It throws on different lengths. &nbsp;4. A stable code and the request id — nothing else. &nbsp;5. The payload runs when the module is required, not at install.', 'xanh')}</div>` },

  { t: 'Summary', to: true, giua: true, body: `<ul>
<li>Weak JWT secret: found in under 1 ms; raw HMAC guesses ${so(/raw HMAC/).toLocaleString('en-US')}/s on one core — use randomBytes(32)</li>
<li>Compare fixed-length hashes; timingSafeEqual throws on different lengths</li>
<li>Errors: details to the log, INTERNAL + requestId to the client</li>
<li>10 dependencies → ~240 packages, all with your process's rights; fewer deps, npm ci, least privilege</li>
<li>Secrets in runtime env, never in git, images or NEXT_PUBLIC_*</li>
</ul>` + box('Next: chapter 10', 'Upload and object storage: receiving files, presigned URLs, checking what a file really is, and serving media.', 'lam') },
]);
