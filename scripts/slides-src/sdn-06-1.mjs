/**
 * sdn-06-1 — SDN302 · Chương 6 · Bài 6.1 "Connect React, deploy & BaaS" (slide EN, đợt 12b — 08/11/2026). MỘT deck, MỘT tập sdn-6-1.
 *   React gọi API qua CORS trong Chromium THẬT (trang :4610 → API :4600): đúng origin ⇒ 3 sản phẩm; sai origin ⇒ lỗi CORS thật + API chỉ thấy OPTIONS ·
 *   VITE_* dán vào bundle lúc build (thật: URL + "secret" giả nằm trong dist/pay.js) · 12-factor · kiểm env lúc khởi động · nền tảng hosting làm gì
 *   với repo (thư mục sạch thật: thiếu "start", chỉ có PORT, quên JWT_SECRET ⇒ /health 200 mà login 500, cổng cứng ⇒ curl exit 7, Mongo không tới
 *   được ⇒ thoát sau 3,3 s, đủ biến ⇒ chạy) · BaaS (CLO7).
 * Nguồn: SDN302 › sdn302-6-1-react-deploy. Output THẬT: that/s6/{browser,host,bundle} (Node 22.23.3, Express 5.3.0, Mongoose 9.11.4, cors 2.8.6,
 *   jsonwebtoken 9.0.3, dotenv 18.0.9, React 18.3.1 bundle bằng esbuild 0.28.0, Chromium qua Playwright 1.61.0, MongoDB 7.0.37 container sdn-mongo).
 */
import { lamDeck, two, box, cards, flow, bang, ma, ra, steps, gay } from './_sdn-chung.mjs';
import { J, T, JW, tep } from './_c7-chung.mjs';

export const deck = { key: 'sdn-06-1', code: 'SDN302 6.1', title: 'Connect React, deploy & BaaS', sub: 'SDN302 — Node.js, Express & MongoDB' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const B = (a, b) => ra('s6/browser', a, b);
const H = (a, b) => ra('s6/host', a, b);

export const slides = lamDeck({ chuong: 'Chapter 6 — Integrating React & deployment', bai: '6.1' }, [
  { cover: true, t: 'Connect React,<br>deploy & BaaS', sub: 'A real browser calls your API, then the API leaves your laptop. Every failure on the way is run for real.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>A React page calling your API in a real browser — with a token, across two origins</li>
<li>The exact CORS error you will meet, and what the API saw when it happened</li>
<li>Why a "secret" in a front-end env variable is public</li>
<li>Config in the environment (12-factor), checked when the server starts</li>
<li>What a hosting platform does with your repo — five ways it fails, each run on a clean folder</li>
<li>Backend-as-a-Service (CLO7): when you do not write the server at all</li>
</ul>` + box('Closing the loop', 'Chapters 2–5 built the API. This lesson connects the front-end (FER202) to it and puts it somewhere public.', 'lam') },

  { t: 'The whole loop', to: true, giua: true, body: flow([
    { t: 'React app', s: 'http://localhost:4610', mau: LAM }, { t: 'fetch + Bearer token', s: 'another origin', mau: CAM }, { t: 'Express API', s: 'http://localhost:4600', mau: NODE }, { t: 'MongoDB', s: 'local or Atlas', mau: TIM },
  ]) + two(box('Two servers, two origins', 'The page comes from one origin, the data from another. The browser lets the page read the data only if the API says so (CORS).', 'lam'),
    box('Later, the same picture online', 'https://myshop.app → https://api.myshop.app → Atlas. Same code; only the environment values change.', 'xanh')) +
    bang(['piece', 'on your laptop', 'after deploy'], [['front-end origin', 'http://localhost:4610', 'https://myshop.app'], ['API URL', 'http://localhost:4600', 'https://api.myshop.app'], ['database', 'mongodb://127.0.0.1:4617', 'mongodb+srv://…atlas'], ['secret', 'a dev value in .env', 'set on the host dashboard']], { co: 21 }) },

  { t: 'Calling the API from React', to: true, giua: true, body: J(tep('s6/web/App.jsx', 5, 21), { hl: [1, 9, 14] }) +
    box('Log in, keep the token, send it', 'POST /api/login returns { token }; every protected call sends Authorization: Bearer &lt;token&gt;. API_URL comes from the build (Vite: import.meta.env.VITE_API_URL) — slide 9.', 'lam') },

  { t: 'The API side', to: true, giua: true, body: JW(ma('s6/api', 16, 30), 110, [3, 8, 14]) +
    box('cors({ origin: [ …your front-ends… ] })', 'The list comes from FRONTEND_ORIGIN: localhost:4610 today, https://myshop.app tomorrow.', 'xanh') },

  { t: 'Run it in a real browser', to: true, giua: true, body: T(B(1, 10), 'node browser.mjs · headless Chromium · real', { hl: [5] }) +
    two(box('Four requests for two fetches', 'Each fetch with a JSON body or an Authorization header is "non-simple": Chromium first sends OPTIONS (the preflight), then the real request.', 'lam'),
      box('The page shows the data', 'Keyboard, Mouse, Monitor came from MongoDB, through Express, into React state.', 'xanh')) },

  { t: 'The same page, a wrong origin', to: true, giua: true, body: T(B(12, 17).replace(' has been blocked by CORS policy: ', '\n    has been blocked by CORS policy:\n    ').replace(" No 'Access", "\n    No 'Access"), 'API FRONTEND_ORIGIN=http://localhost:5173 · real', { sm: false, hl: [3, 4, 5, 6] }) +
    two(box('The API saw ONE request', 'Only the OPTIONS preflight arrived. The answer had no Access-Control-Allow-Origin, so Chromium never sent the POST.', 'cam'),
      box('React only sees "Failed to fetch"', 'The reason is printed in the browser console, not in the page and not in the API log. Open DevTools → Console first.', 'do2')) },

  { t: 'Reading a CORS error in three steps', to: true, giua: true, body: steps([
    'Read the two origins: <b>from origin \'http://localhost:4610\'</b> is the page; the URL is the API.',
    'Find the missing header: <b>No \'Access-Control-Allow-Origin\'</b> ⇒ the API did not list that origin.',
    'Fix it on the SERVER: add the page\'s exact origin (scheme + host + port) to FRONTEND_ORIGIN, restart the API. Not a fix: a "disable CORS" browser extension, or cors() with no options.',
  ]) + bang(['you see', 'it means', 'fix'], [['blocked … preflight … no ACAO header', 'origin not in the list', 'add it to FRONTEND_ORIGIN'], ['401 in the Network tab', 'CORS passed; the token is wrong or missing', 'check the Authorization header'], ['net::ERR_CONNECTION_REFUSED', 'nothing listens at that URL', 'wrong API_URL or the API is down']], { co: 19 }) },

  { t: 'Front-end env values are baked into the bundle', to: true, giua: true, body: J(tep('s6/web/pay.jsx', 2, 3), { sm: false }) +
    T(ra('s6/bundle', 2, 5), 'node bundle.mjs · esbuild, the way Vite builds · real', { hl: [2, 4] }) +
    two(box('VITE_* = text pasted into the .js file', 'The value is copied in at BUILD time. Every visitor downloads it; "View source" shows it.', 'do2'),
      box('So', 'A public API URL is fine there. A payment key, a JWT secret or a database URI is never fine — those stay on the server.', 'xanh')) },

  { t: 'Config lives in the environment (12-factor)', to: true, giua: true, body: bang(['variable', 'read by', 'local (.env, git-ignored)', 'production (host dashboard)'], [
    ['PORT', 'API', 'not set ⇒ 4600', 'given by the host'], ['MONGODB_URI', 'API', 'mongodb://127.0.0.1:4617/shop61', 'mongodb+srv://… (Atlas)'], ['JWT_SECRET', 'API', 'a dev value', 'a long random value'], ['FRONTEND_ORIGIN', 'API', 'http://localhost:4610', 'https://myshop.app'], ['VITE_API_URL', 'React build', 'http://localhost:4600', 'https://api.myshop.app'],
  ], { co: 19 }) + two(box('One code base, many deploys', 'The same commit runs on your laptop and in production. Only the environment differs — never edit code to deploy.', 'lam'),
    box('.env stays out of Git', 'It holds secrets. That is exactly why the host does NOT have it — slides 13–16.', 'cam')) },

  { t: 'Check the environment when the server starts', to: true, giua: true, body: J(ma('s6/api', 8, 13), { sm: false, hl: [1, 3] }) +
    T(H(13, 15), 'the host started it with only PORT set · real', { hl: [3] }) +
    two(box('Fail fast', 'One clear line, exit code 1, the deploy is marked failed — before any user arrives.', 'xanh'),
      box('Instead of failing late', 'Without the check the server starts "fine", and the first user who logs in gets a 500. Slide 14.', 'do2')) },

  { t: 'What the host does with your repo', to: true, giua: true, body: flow([
    { t: 'git push', s: 'only committed files', mau: LAM }, { t: 'host clones', s: 'no .env, no node_modules', mau: CAM }, { t: 'npm install', s: 'build step', mau: NODE }, { t: 'npm start', s: 'with the dashboard env', mau: TIM },
  ]) + T(H(1, 6), 'a clean folder, the way Render / Railway see it · real', { hl: [3] }) +
    two(box('Render, Railway, Heroku…', 'Different dashboards, the same four steps. They run npm start and send traffic to the PORT they give you.', 'lam'),
      box('Your job on the host', 'Pick the repo, set the build and start commands, add every environment variable. Push code, set env: two separate steps.', 'cam')) },

  { t: 'Failure 1: no start script', to: true, giua: true, body: T(H(7, 11), 'npm start in the clean folder · real', { hl: [3] }) +
    J('"scripts": {\n  "start": "node api.js",\n  "dev": "node --watch api.js"\n}', { sm: false, hl: [2] }) +
    two(box('npm start must work', 'The host does not know your file is called api.js, app.js or bin/www. The start script tells it.', 'lam'),
      box('Express Generator projects', 'Already have "start": "node ./bin/www" — keep it, and make bin/www read process.env.PORT.', 'xanh')) },

  { t: 'Failure 2: works locally, 500 in production', to: true, giua: true, body: T(H(18, 26), 'the NAIVE app (no start-up check), JWT_SECRET forgotten on the dashboard · real', { sm: false, hl: [5, 7, 9] }) +
    two(box('Health check green, login red', '/health needs no secret, so the host shows "live". The first login calls jwt.sign without one.', 'do2'),
      box('Why it hid locally', 'Your laptop has .env; the host never had it. The cure: the start-up check (slide 11).', 'xanh')) },

  { t: 'Failure 3: a hard-coded port', to: true, giua: true, body: T(H(28, 32), 'host sets PORT=4605, the code listens on 4609 · real', { hl: [2, 4] }) +
    J('// ✗ the host routes to $PORT, nobody answers there\napp.listen(4609);\n// ✓\nconst PORT = process.env.PORT || 4600;\napp.listen(PORT, () => console.log(`listening on ${PORT}`));', { sm: false, hl: [2, 5] }) +
    box('The log looks healthy', '"listening on 4609" — and every request still fails. Hosts report it as "no open port detected" or a timeout.', 'cam') },

  { t: 'Failure 4: the database is not reachable', to: true, giua: true, body: T(H(34, 37), 'MONGODB_URI points at a port nobody listens on · real', { hl: [3, 4] }) +
    box('Make it fail fast too', 'serverSelectionTimeoutMS: 3000 ⇒ the deploy fails in 3.3 s with a clear error instead of hanging.', 'xanh') +
    J("mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 3000 })   // then app.listen", { sm: false }) +
    bang(['Atlas check', 'where'], [['the database user exists, the password in the URI is right', 'Database Access'], ['the host\'s outgoing IPs (or 0.0.0.0/0 for a class demo) are allowed', 'Network Access'], ['special characters in the password are URL-encoded', 'the connection string']], { co: 20, cap: 'On a real host it is usually Atlas — check these three' }) },

  { t: 'Everything set: it runs', to: true, giua: true, body: T(H(39, 43), 'all four variables on the dashboard · real', { hl: [2] }) +
    bang(['symptom after deploy', 'first suspect'], [['deploy failed, "Missing script: start"', 'package.json scripts'], ['exits at start with a config error', 'a missing variable (good — it told you)'], ['live, but one route returns 500', 'a missing variable used only by that route'], ['live, nothing answers', 'listening on a fixed port'], ['MongooseServerSelectionError', 'URI, Atlas user, Network Access']], { co: 21 }) },

  { t: 'Backend-as-a-Service (CLO7)', to: true, giua: true, body: bang(['you need', 'your own Express + MongoDB', 'BaaS (Firebase, Supabase, Atlas App Services)'], [
    ['sign-up, login, tokens', 'bcrypt + JWT, written by you', 'built in'], ['database access', 'routes → controllers → models', 'client SDK + security rules'], ['file storage', 'Multer + a disk or S3', 'built in'], ['custom business logic', 'anywhere you like', 'cloud functions, with limits'], ['control and portability', 'full', 'tied to one provider'],
  ], { co: 20 }) + two(box('Choose BaaS when', 'A small app, a hackathon, a prototype: speed matters more than control.', 'xanh'),
    box('Choose your own server when', 'You need your own rules, your own data model, or you must not depend on one vendor — and in SDN302, because the exam asks you to write it.', 'lam')) },

  { t: 'What earns the marks', to: true, giua: true, body: bang(['in your project', 'why'], [
    ['the React page calls the deployed API', 'proves the full loop (CLO7)'], ['cors({ origin: FRONTEND_ORIGIN })', 'your front-end only, not *'], ['every secret and URL from process.env', 'nothing hard-coded, nothing in Git'], ['the env checked at start-up', 'no "500 only in production"'], ['"start" script + process.env.PORT', 'the host can run it'], ['README: the env variables to set', 'the examiner can run it too'],
  ], { co: 22 }) + box('Practise', 'Code Lab › React track: fetch with a token; then deploy your Chapter 4 API with every value from the environment.', 'xanh') },

  { t: 'Exercise', to: true, giua: true, body: J("// api.js\nmongoose.connect('mongodb://localhost:27017/shop');\napp.use(cors());\napp.listen(3000);\n// React\nconst res = await fetch('http://localhost:3000/api/products');", { sm: false, hl: [2, 3, 4, 6] }) +
    box('Exercise', 'It works on your laptop. Name four reasons it breaks the day you deploy, and fix each.', '') +
    `<div data-k="dapan">${box('Answer', '1. The URI is local: read process.env.MONGODB_URI (Atlas in production). 2. cors() lets every site in: cors({ origin: process.env.FRONTEND_ORIGIN.split(\',\') }). 3. A fixed port: process.env.PORT || 3000. 4. The API URL is baked into React: use import.meta.env.VITE_API_URL, set at build time. And send the token in Authorization if the route is protected.', 'xanh')}</div>` },

  { t: 'Self-check', to: true, giua: true, body: `<ol>
<li>The page shows "Failed to fetch". Where do you find the real reason?</li>
<li>With a wrong origin, which requests reached the API?</li>
<li>Is VITE_PAYMENT_SECRET safe in a React app?</li>
<li>Why did /health return 200 while /api/login returned 500?</li>
<li>When is BaaS a better choice than your own server?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. The browser console (DevTools). &nbsp;2. Only the OPTIONS preflight. &nbsp;3. No — it is pasted into the public bundle. &nbsp;4. /health does not use JWT_SECRET; login does, and the host never had it. &nbsp;5. Small apps and prototypes where speed matters more than control.', 'xanh')}</div>` },

  { t: 'Summary', to: true, giua: true, body: `<ul>
<li>React calls the API with fetch + Bearer token; the API lists the front-end's origin in cors()</li>
<li>A CORS error is read in the browser console; the fix is on the server</li>
<li>Front-end env values are public; secrets stay on the server</li>
<li>Config in the environment, checked at start-up; the host has no .env</li>
<li>Deploy = push code + set env; npm start, process.env.PORT, a reachable database</li>
</ul>` + box('Going deeper', 'Node.js course 17.4 (secrets in images), 17.6 (when a deploy lies: smoke tests, rollback); API Design 6.4 (CORS in a real browser).', 'lam') },
]);
