/**
 * sdn-05-1 — SDN302 · Chương 5 · Bài 5.1 "Passwords, bcrypt, sessions & Passport" (slide EN, đợt 7 — 01/11/2026). MỘT deck, MỘT tập (sdn-5-1).
 *   CLO6 · hai điều không thoả hiệp · bcrypt đăng ký/đăng nhập trên model User Mongoose (thật: tài liệu thô có $2b$10$…, findOne mặc định KHÔNG có password) ·
 *   select:false + toJSON · "Invalid credentials" chung nhưng thời gian lộ (thật: 0,7 vs 71,0 ms) ⇒ dẫn Courses 8.1 · session vs token ·
 *   express-session + connect-mongo v6 · Passport-local (usernameField email, serialize chỉ id) · chạy thật bằng curl (thật: 401 chung, cookie ĐỔI sau
 *   đăng nhập, /me 200, không cookie 401, tài liệu phiên trong MongoDB chỉ có passport.user, logout ⇒ 401) · cố định phiên · MemoryStore (thật: cảnh báo
 *   production, khởi động lại ⇒ 401; MongoStore ⇒ 200) · bẫy connect-mongo v6 · ăn điểm · bài tập · tự kiểm · tóm tắt
 * Nguồn: SDN302 › sdn302-5-1-passwords-sessions (bài web mỏng ⇒ phần lớn là BỔ SUNG, mọi output chạy thật).
 * Output THẬT: that/s5/{bcrypt-user,passport-app,session-restart} (Node 22.23.3, Express 5.3.0, Mongoose 9.11.4, bcrypt 6.0.0, express-session 1.19.0,
 *   connect-mongo 6.0.0, passport 0.7.0, passport-local 1.0.0, MongoDB 7.0.37).
 */
import { lamDeck, two, box, cards, flow, bang, js, term, ma, ra, gay, mg } from './_sdn-chung.mjs';
import { JW } from './_c7-chung.mjs';

export const deck = { key: 'sdn-05-1', code: 'SDN302 5.1', title: 'Passwords, bcrypt, sessions & Passport', sub: 'SDN302 — Node.js, Express & MongoDB' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const J = (src, o = {}) => js(src, { sm: o.sm ?? true, hl: o.hl });
const T = (text, title, o = {}) => term(text, { title, sm: o.sm ?? true, hl: o.hl });
/** Transcript curl thật: thay mỗi dòng "$ lệnh dài" bằng nhãn ngắn (đã ghi trong lời), giữ nguyên MỌI dòng output. */
const rut = (ten, nhan, a, b) => { let k = 0; return gay(ra(ten, a, b).split('\n').map((l) => (l.startsWith('$ ') ? `$ ${nhan[k++] ?? l.slice(2)}` : l)).join('\n'), 100); };

export const slides = lamDeck({ chuong: 'Chapter 5 — Authentication & security', bai: '5.1' }, [
  { cover: true, t: 'Passwords, bcrypt,<br>sessions & Passport', sub: 'Proving who the user is — without ever storing the password (CLO6).' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>bcrypt on a Mongoose User model: register, log in, never send the hash back</li>
<li>Session + cookie login with express-session, stored in MongoDB</li>
<li>Passport-local: the strategy, serializeUser, req.login, req.logout</li>
<li>Every step run with curl, and the session document inside MongoDB</li>
<li>Three traps measured: a timing leak, MemoryStore, and a breaking change in connect-mongo 6</li>
</ul>` + box('CLO6 — secure authentication', 'Exam projects lose these points for plain-text passwords, password fields in JSON responses and "email does not exist" messages. Each one is a slide here.', 'lam') },

  { t: 'Two rules you never bend', to: true, giua: true, body: two(
    box('Never store the password', 'Store a slow, salted hash. If the database leaks, the attacker gets hashes, not passwords people also use for their e-mail.', 'xanh'),
    box('Never trust the client', 'The server decides who you are, from a session it keeps or a token it signed — never from a field the browser sends.', 'xanh')) +
    flow([{ t: 'register', s: 'bcrypt.hash(password, 10)', mau: NODE }, { t: 'MongoDB', s: 'stores only the hash', mau: LAM }, { t: 'login', s: 'bcrypt.compare(…)', mau: NODE }, { t: 'true / false', s: 'never "decrypt"', mau: CAM }]) +
    box('If you know the Node.js course', 'Lesson 8.1 there measures why: SHA-256 runs about 2 million times a second on one core, bcrypt cost 12 about 3.6 times.', '') },

  { t: 'The User model', to: true, giua: true, body: J(ma('s5/user-model')) +
    two(box('select: false', 'The password field is left out of every query unless you ask for it with <code class="i">.select(\'+password\')</code>.', 'xanh'),
      box('toJSON transform', 'A second net: even a document that has the field never puts it in a JSON response.', 'xanh')) },

  { t: 'Register and log in with bcrypt', to: true, giua: true, body: J(ma('s5/bcrypt-user', 6, 14), { hl: [2, 7] }) +
    two(box('bcrypt.hash(password, 10)', '10 is the cost: 2^10 rounds. bcrypt makes a new random salt every call and stores it inside the hash string.', 'lam'),
      box('bcrypt.compare', 'Re-hashes the guess with the stored salt and compares. There is no "decrypt" — that is the point.', 'lam')) },

  { t: 'What MongoDB really stores', to: true, giua: true, body: T(gay(ra('s5/bcrypt-user', 2, 11), 104), 'node bcrypt-user.js · MongoDB 7.0 · real', { hl: [4, 7] }) +
    box('Wrong password and unknown email: both null', 'The route turns both into the same 401 "Invalid credentials" — so nobody can ask your API which emails are registered.', 'xanh') },

  { t: 'Same message… but not the same time', to: true, giua: true, body: J(ma('s5/bcrypt-user', 10, 13), { sm: false, hl: [3] }) +
    T(ra('s5/bcrypt-user', 13, 13), 'node bcrypt-user.js · median of 15 · real', { sm: false }) +
    box('The short-circuit leaks', 'An unknown email skips bcrypt and answers 100 times faster. A script can still sort emails into "registered" and "not registered".', 'do2') +
    box('The fix, if you want full marks', 'Always run one compare — against a fixed dummy hash when the user does not exist. Node.js course lesson 8.1 measures the fix: 27× before, 1.0× after.', 'xanh') },

  { t: 'Session + cookie versus a token', to: true, giua: true, body: flow([
    { t: 'POST /login', s: 'server checks password', mau: LAM }, { t: 'session saved', s: 'in MongoDB', mau: NODE }, { t: 'Set-Cookie', s: 'connect.sid = session id', mau: CAM }, { t: 'next request', s: 'cookie → look up session', mau: LAM },
  ]) + two(
    box('Session (this lesson)', 'The server remembers. The cookie holds only a random id. Log out = delete the session. Good for server-rendered pages (lesson 4.2).', 'lam'),
    box('Token (lesson 5.2)', 'The client carries a signed token, the server remembers nothing. Good for a React app or a mobile app calling your API.', 'cam')) +
    bang(['', 'session', 'token (JWT)'], [['state lives', 'on the server (MongoDB)', 'inside the token'], ['log out / revoke', 'delete the session: instant', 'wait for expiry (or extra work)'], ['each request', 'one session lookup', 'verify a signature']], { co: 22 }) },

  { t: 'express-session, stored in MongoDB', to: true, giua: true, body: J(ma('s5/passport-app', 20, 31), { hl: [4, 7, 8, 9] }) +
    two(box('secret', 'Signs the cookie so it cannot be forged. From an environment variable, never the code.', 'lam'),
      box('saveUninitialized: false', 'No session (and no cookie) until something is stored — no empty sessions for every visitor.', 'lam')) },

  { t: 'Passport-local: the strategy', to: true, giua: true, body: J(ma('s5/passport-app', 11, 18), { hl: [1, 4, 7] }) +
    cards([
      ['usernameField: \'email\'', 'Passport expects "username" by default; we log in with email.'],
      ['done(null, false, …)', 'Not an error, just "no such user": the same message for both cases.'],
      ['serializeUser', 'The session stores ONLY the user id. deserializeUser loads the user on each request.'],
    ], 3) + flow([{ t: 'POST /login', mau: LAM }, { t: 'LocalStrategy', s: 'bcrypt.compare', mau: NODE }, { t: 'serializeUser', s: 'session = { user: id }', mau: CAM }, { t: 'every request', s: 'deserializeUser(id)', mau: LAM }], { h: 130 }) },

  { t: 'Routes: login, me, logout', to: true, giua: true, body: JW(ma('s5/passport-app', 34, 41), 96, [4, 6]) +
    two(box('req.login(user)', 'Puts the id into the session and — since Passport 0.6 — gives the session a NEW id.', 'lam'),
      box('req.isAuthenticated()', 'True when the session has a user. requireLogin is the whole route guard.', 'lam')) +
    box('passport.authenticate with a callback', 'We answer with JSON (401 + message) instead of Passport\'s default redirect — the API style of this course.', '') },

  { t: 'Run it with curl', to: true, giua: true, body: T(rut('s5/passport-app', ['curl -c jar :4300/visit', 'curl -b jar -c jar POST /login  (wrong password)', 'curl -b jar -c jar POST /login  (right password)', 'curl -b jar :4300/me', 'curl :4300/me  (no cookie)'], 1, 12), 'curl against node app.js · real', { hl: [3, 9], sm: true }) +
    two(box('With the cookie', '/me answers 200 with An\'s profile — and no password field.', 'xanh'), box('Without it', 'The same URL is 401 "Login required". The cookie IS the login.', 'lam')) },

  { t: 'Look inside MongoDB', to: true, giua: true, body: mg(gay(ra('s5/passport-app', 14, 16), 100), { title: 'db.sessions.find({}, {session: 1}) · mongosh · real' }) +
    T(rut('s5/passport-app', ['curl POST /logout, then curl -b jar :4300/me'], 17, 19), 'logout · real', { hl: [3] }) +
    box('The session holds only the id', '<code class="i">passport.user</code> is the user\'s _id. No password, no profile — those come from deserializeUser on every request.', 'xanh') },

  { t: 'Why the cookie changed at login', to: true, giua: true, body: T(rut('s5/passport-app', ['curl -c jar :4300/visit', 'curl … POST /login (wrong)', 'curl … POST /login (right)'], 1, 8).split('\n').filter((l) => /cookie|^\$/.test(l)).join('\n'), 'the two connect.sid values from the run · real', { hl: [2, 5] }) +
    box('Session fixation (cố định phiên)', 'If the id stayed the same, an attacker who planted a session id in your browser before you logged in would be logged in as you afterwards. Passport 0.6+ calls req.session.regenerate() on login: new id, old one gone.', 'cam') +
    box('Only one session left', 'MongoDB held one session document: the pre-login one (visits: 1) was destroyed.', 'lam') },

  { t: 'Trap: the default MemoryStore', to: true, giua: true, body: T(gay(ra('s5/session-restart', 3, 9), 100), 'node session-restart.js · login, restart the server, same cookie · real', { hl: [1, 3, 7] }) +
    two(box('MemoryStore', 'Prints a warning in production. Every restart or deploy logs everyone out, and two processes do not share sessions.', 'do2'),
      box('A real store', 'MongoDB (connect-mongo) or Redis. The session survives restarts and is shared by every instance.', 'xanh')) },

  { t: 'Trap: connect-mongo 6 changed its export', to: true, giua: true, body: (
    J("// tutorials written for connect-mongo 4–5\nconst MongoStore = require('connect-mongo');\nMongoStore.create({ mongoUrl });   // TypeError in 6.0.0", { sm: false, hl: [3] }) +
    J("// connect-mongo 6.0.0 (installed today)\nconst { MongoStore } = require('connect-mongo');\nMongoStore.create({ mongoUrl });", { sm: false, hl: [2] })) +
    T(ra('s5/mongo-export', 1, 10).replace(/\[\n\s+/g, '[ ').replace(/,\n\s+/g, ', ').replace(/\n\]/g, ' ]'), 'node mongo-export.js · connect-mongo 6.0.0 · real', { hl: [3, 5] }) +
    box('Read the version, not the tutorial', 'npm installs the latest major. When a copied line fails, check what the package really exports.', 'cam') },

  { t: 'What earns the marks', to: true, giua: true, body: bang(['in your project', 'why'], [
    ['bcrypt.hash before saving, bcrypt.compare at login', 'never store or compare plain text'],
    ['password: { select: false } + toJSON', 'the hash never reaches a response'],
    ['one message: "Invalid credentials"', 'no email enumeration'],
    ['SESSION_SECRET from .env', 'a secret in Git is a key for everyone'],
    ['a real session store', 'MemoryStore leaks and forgets'],
  ], { co: 22 }) + box('Going deeper', 'Node.js course lessons 8.1 (measuring password hashing) and 8.4 (cookie flags, CSRF); Authentication course chapter 3 (the session table and each cookie attribute).', 'lam') },

  { t: 'Exercise', to: true, giua: true, body: J("router.post('/login', async (req, res) => {\n  const user = await User.findOne({ email: req.body.email });\n  if (!user) return res.status(404).json({ error: 'Email not registered' });\n  if (user.password !== req.body.password) return res.status(401).json({ error: 'Wrong password' });\n  res.json(user);\n});", { sm: false, hl: [3, 4, 5] }) +
    box('Exercise', 'Find three security mistakes in this login route and rewrite it.', '') +
    `<div data-k="dapan">${box('Answer', '1. Two different messages (404 vs 401) reveal which emails exist — use one 401 "Invalid credentials". 2. Plain-text comparison — store bcrypt.hash, check with bcrypt.compare. 3. res.json(user) can send the password field — select:false / toJSON, or send only id, name, email.', 'xanh')}</div>` },

  { t: 'Self-check', to: true, giua: true, body: `<ol>
<li>Why can bcrypt.compare check a password it cannot decrypt?</li>
<li>What does the session store keep for a logged-in user?</li>
<li>Why does the session id change at login?</li>
<li>What happens to MemoryStore sessions when you redeploy?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. It re-hashes the guess with the salt stored in the hash and compares the results. &nbsp;2. Only passport.user = the user id (plus cookie settings). &nbsp;3. Protection against session fixation (Passport regenerates the session). &nbsp;4. They are gone: everyone is logged out.', 'xanh')}</div>` },

  { t: 'Summary', to: true, giua: true, body: `<ul>
<li>bcrypt.hash on register, bcrypt.compare on login; the hash never leaves the server</li>
<li>One "Invalid credentials" for both cases (and ideally the same time)</li>
<li>express-session + a real store; the cookie holds only a random id</li>
<li>Passport-local: strategy, serializeUser (id only), req.login regenerates the session</li>
<li>Check what a package exports in the version you installed</li>
</ul>` + box('Practise', 'Code Lab › Authentication track: register/login with bcrypt, then add a session.', 'xanh') +
    box('Next: lesson 5.2', 'Tokens instead of sessions: JWT, CORS, file upload/download and HTTPS.', 'lam') },
]);
