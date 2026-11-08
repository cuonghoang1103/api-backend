/**
 * sdn-05-2 — SDN302 · Chương 5 · Bài 5.2 "JWT, HTTPS, CORS & file upload/download" (slide EN, đợt 7 — 01/11/2026).
 * MỘT deck, HAI tập: sdn-5-2 (slide 1–12: JWT + CORS) · sdn-5-2-2 (slide 13–27: Multer, tải xuống, HTTPS).
 *   A: luồng token · đăng nhập JWT trên model User (thật: token, /profile 200, không token 401 "jwt must be provided") · payload đọc được (thật: id, iat, exp
 *      = 1 ngày) · thiếu JWT_SECRET (thật: "secretOrPrivateKey must have a value" lúc ĐĂNG NHẬP, sửa = không cho khởi động) · CORS là gì ·
 *      gói cors (thật: ACAO luôn là origin đã khai, kể cả với evil.example; server VẪN chạy GET — log thật) · preflight (thật: 204 + Allow-*) · bẫy CORS
 *   B: Multer (thật: tên ngẫu nhiên không đuôi, phục vụ thành application/octet-stream) · giới hạn 1 MB (thật: 413 LIMIT_FILE_SIZE) · static vs download
 *      (thật: Content-Disposition attachment) · path traversal (thật: bản basename 404, bản thô trả nguyên mã app.js) · vì sao HTTPS (thật: relay thấy
 *      "authorization: Bearer …" qua HTTP; qua HTTPS 1.832 byte, không thấy Bearer, vẫn thấy "localhost" ở SNI) · chứng chỉ tự ký (thật: curl exit 60,
 *      -k 200) · chuyển hướng 301 · production · ăn điểm · bài tập · tự kiểm · tóm tắt
 * Nguồn: SDN302 › sdn302-5-2-jwt-cors. Output THẬT: that/s5/{jwt-app,no-secret,cors-app,upload-app,https-app,sniff}.
 */
import { lamDeck, two, box, cards, flow, bang, js, term, ma, ra, gay } from './_sdn-chung.mjs';
import { JW } from './_c7-chung.mjs';

export const deck = { key: 'sdn-05-2', code: 'SDN302 5.2', title: 'JWT, HTTPS, CORS & file upload/download', sub: 'SDN302 — Node.js, Express & MongoDB' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const J = (src, o = {}) => js(src, { sm: o.sm ?? true, hl: o.hl });
const T = (text, title, o = {}) => term(text, { title, sm: o.sm ?? true, hl: o.hl });
const rut = (ten, nhan, a, b, n = 100) => { let k = 0; return gay(ra(ten, a, b).split('\n').map((l) => (l.startsWith('$ ') ? `$ ${nhan[k++] ?? l.slice(2)}` : l)).join('\n'), n); };

export const slides = lamDeck({ chuong: 'Chapter 5 — Authentication & security', bai: '5.2' }, [
  { cover: true, t: 'JWT, HTTPS, CORS<br>& file upload/download', sub: 'What a React app needs from your API: a token, permission to call, files, and an encrypted line.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>JWT login on the Mongoose User model, and a requireAuth middleware</li>
<li>What anyone can read inside the token, and where the secret must live</li>
<li>CORS: what the cors package really sends, and what it does NOT stop</li>
<li>Upload with Multer, download safely, and a path-traversal hole run for real</li>
<li>HTTPS: what a network sees with and without it, a self-signed certificate, and the redirect</li>
</ul>` + box('Exam sessions 31–36', 'HTTPS, upload and download are graded parts of the syllabus. Every piece here runs on this laptop.', 'lam') },

  { t: 'The token flow', to: true, giua: true, body: flow([
    { t: 'POST /login', s: 'email + password', mau: LAM }, { t: 'jwt.sign', s: '{ id } + secret', mau: NODE }, { t: 'client keeps it', s: 'memory / storage', mau: CAM }, { t: 'every request', s: 'Authorization: Bearer …', mau: LAM },
  ]) + two(box('Why a token for React', 'The API stays stateless: no session to look up, works the same for a web app, a mobile app and another server.', 'xanh'),
    box('The price', 'The server cannot take a token back before it expires — the Node.js course, lesson 8.2, builds refresh tokens for exactly that.', 'cam')) +
    J("// in the React app, after login\nconst res = await fetch('http://localhost:4300/profile', {\n  headers: { Authorization: `Bearer ${token}` },\n});", { sm: false, hl: [3] }) },

  { t: 'Login and requireAuth', to: true, giua: true, body: J(ma('s5/jwt-app', 11, 27), { hl: [6, 12, 14] }) +
    box('algorithms: [\'HS256\']', 'One extra option the syllabus code does not have: the server, not the token, decides how it is checked.', 'xanh') },

  { t: 'Run it', to: true, giua: true, body: T(rut('s5/jwt-app', ['curl POST :4300/login', 'curl :4300/profile -H "Authorization: Bearer $TOKEN"', 'curl :4300/profile  (no token)'], 1, 7), 'curl against node app.js · real', { hl: [5, 7] }) +
    bang(['token', 'jwt.verify', 'status'], [['valid, not expired', 'returns { id, iat, exp }', '200'], ['missing', 'jwt must be provided', '401'], ['edited or wrong secret', 'invalid signature', '401'], ['older than 1 day', 'jwt expired', '401']], { co: 21 }) },

  { t: 'Anyone can read the payload', to: true, giua: true, body: flow([{ t: 'header', s: 'algorithm', mau: DO }, { t: 'payload', s: '{ id, iat, exp } — readable', mau: TIM }, { t: 'signature', s: 'needs the secret', mau: LAM }], { h: 130 }) +
    T(rut('s5/jwt-app', ['node -p "JSON.parse(Buffer.from(TOKEN.split(\'.\')[1], \'base64url\'))"'], 8, 9), 'decode the middle part — no secret needed · real') +
    two(box('Signed, not encrypted', 'Base64url is an encoding. Never put a password, phone number or anything private in the payload.', 'do2'),
      box('exp − iat = 86,400 s', 'One day, as in the syllabus. A stolen token works for a day. The Node.js course uses 15 minutes plus a refresh token.', 'cam')) },

  { t: 'The secret lives in .env', to: true, giua: true, body: JW(ma('s5/no-secret', 1, 11), 100, [3, 8]) + T(ra('s5/no-secret', 2, 3), 'node no-secret.js · JWT_SECRET not set · real', { hl: [1] }) +
    box('A secret in Git = an admin token for every reader', 'Load it from process.env (a git-ignored .env), and refuse to start without it — not crash on the first login.', 'xanh') },

  { t: 'CORS: what problem it solves', to: true, giua: true, body: flow([
    { t: 'React on :5173', s: 'one origin', mau: LAM }, { t: 'fetch(\'http://api:4300\')', s: 'another origin', mau: CAM }, { t: 'API answers', s: '+ Access-Control-Allow-Origin', mau: NODE }, { t: 'browser decides', s: 'let JS read it, or not', mau: DO },
  ]) + box('Same-origin policy', 'By default, JavaScript on one origin (scheme + host + port) may not read responses from another. CORS headers are the API saying "this origin may read me".', 'lam') +
    box('Key point', 'CORS is enforced by the BROWSER, on reading the response. It is not a firewall and not authentication.', 'cam') },

  { t: 'The cors package, measured', to: true, giua: true, body: J(ma('s5/cors-app', 4, 5), { sm: false, hl: [2] }) +
    T(rut('s5/cors-app', ['curl :4300/api/products -H "Origin: http://localhost:5173"', 'curl :4300/api/products -H "Origin: http://evil.example"'], 1, 5), 'response headers · real', { hl: [5] }) +
    T(ra('s5/cors-app', 3, 4, 'server'), 'the server log · real', { hl: [2] }) +
    box('Surprise: the server answered the stranger', 'With a fixed origin, cors always sends that same value. The browser compares it with the page\'s origin and hides the response — but the GET already ran on the server.', 'do2') },

  { t: 'The preflight', to: true, giua: true, body: T(rut('s5/cors-app', ['curl -X OPTIONS :4300/api/products -H "Origin: http://localhost:5173" -H "Access-Control-Request-Method: POST" …'], 6, 10), 'preflight · real') +
    two(box('When the browser asks first', 'A POST with JSON, a PUT/DELETE, or custom headers like Authorization: the browser sends OPTIONS and waits for permission.', 'lam'),
      box('Measured further in API Design 6.4', 'In a real Chromium: a stranger\'s GET still reaches the server, a JSON POST stops at the preflight. Node.js course 9.1 adds headers like Vary: Origin.', 'cam')) },

  { t: 'CORS traps', to: true, giua: true, body: cards([
    ['origin: \'*\' in production', 'Any website may read your API from a visitor\'s browser. List your front-end origins.'],
    ['"CORS protects my API"', 'It does not: curl, Postman and servers ignore it. Authentication protects the API.'],
    ['Reflecting any origin + credentials', 'Echoing back whatever Origin arrives, with cookies allowed, hands every site your users\' data.'],
  ], 3) + J("app.use(cors({ origin: ['http://localhost:5173', 'https://myapp.com'] }));   // an allow-list", { sm: false }) +
    bang(['who calls', 'does CORS stop it?'], [['JavaScript on another website, in a browser', 'it stops the page READING the answer'], ['curl, Postman, another server', 'no — CORS does not exist for them'], ['your own React app (listed origin)', 'allowed']], { co: 22 }) },

  // ───────── phần B (tập sdn-5-2-2) ─────────
  { t: 'Upload with Multer', to: true, giua: true, body: J(ma('s5/upload-app', 1, 11), { hl: [7, 8] }) +
    box('multipart/form-data', 'A browser form with a file sends the file in parts. Multer parses it, writes the file to uploads/, and puts the details in req.file.', 'lam') },

  { t: 'Run it', to: true, giua: true, body: T(rut('s5/upload-app', ['curl -F file=@note.txt :4300/upload', 'ls uploads', 'curl -i :4300/files/$F'], 1, 8), 'curl against node app.js · real', { hl: [2, 4, 6] }) +
    two(box('A random name, no extension', 'Good: a user cannot choose the file name on your disk. But the browser now gets application/octet-stream.', 'cam'),
      box('Keep the original name in the database', 'Or use multer.diskStorage({ filename }) with a random name + a checked extension.', 'lam')) },

  { t: 'Limits are not optional', to: true, giua: true, body: J(ma('s5/upload-app', 7, 7), { sm: false }) + JW(ma('s5/upload-app', 22, 22), 100, [], { sm: false }) +
    T(rut('s5/upload-app', ['curl -F file=@big.bin :4300/upload   (2 MB)'], 12, 13), 'real') +
    two(box('Without fileSize', 'Anyone can fill your disk with one request.', 'do2'), box('413 Payload Too Large', 'Multer throws LIMIT_FILE_SIZE; our error handler turns it into a clean 413.', 'xanh')) },

  { t: 'Show it, or download it', to: true, giua: true, body: J(ma('s5/upload-app', 13, 18), { hl: [1, 5] }) +
    T(rut('s5/upload-app', ['curl -i :4300/download/$F'], 9, 11), 'real', { hl: [3] }) +
    box('Content-Disposition: attachment', 'res.download tells the browser to save the file instead of showing it — under the name you choose.', 'lam') },

  { t: 'Path traversal, run for real', to: true, giua: true, body: JW(ma('s5/upload-app', 19, 20), 100) +
    T(rut('s5/upload-app', ['curl --path-as-is :4300/download/..%2Fapp.js', 'curl --path-as-is :4300/download-unsafe/..%2Fapp.js'], 14, 19), 'real', { hl: [4, 5, 6] }) +
    two(box('The unsafe route served our source code', '../ climbed out of uploads/. The same trick reads .env — with the JWT secret inside.', 'do2'),
      box('path.basename', 'Keeps only the last part of the name, so ../app.js becomes app.js inside uploads/ — which does not exist: 404.', 'xanh')) },

  { t: 'Why HTTPS: what the network sees', to: true, giua: true, body: T(ra('s5/sniff', 2, 6), 'a relay between client and server, over plain HTTP · real', { hl: [3] }) +
    flow([{ t: 'client', s: 'sends the token', mau: LAM }, { t: 'relay :4391', s: 'records every byte', mau: DO }, { t: 'server :4381', mau: NODE }], { h: 130 }) +
    box('Plain HTTP', 'Anyone on the same Wi-Fi, the router, or the ISP reads the request — including the token. Copy it, and they are you for a day.', 'do2') },

  { t: 'The same request over HTTPS', to: true, giua: true, body: T(gay(ra('s5/sniff', 8, 10), 100), 'the same relay, HTTPS · real', { hl: [4] }) +
    bang(['the network sees…', 'HTTP', 'HTTPS'], [['path and query', 'yes', 'no'], ['headers (Authorization, cookies)', 'yes', 'no'], ['body (passwords, JSON)', 'yes', 'no'], ['host name (SNI), IPs, sizes', 'yes', 'yes']], { co: 21 }) +
    box('Encrypted — but not everything', 'No "Bearer", no token, no path: bytes starting with a TLS handshake (16 03 01). The host name (SNI), IPs and sizes still show.', 'xanh') },

  { t: 'A self-signed certificate (local only)', to: true, giua: true, body: T("$ openssl req -x509 -newkey rsa:2048 -nodes -keyout key.pem -out cert.pem -days 365 -subj '/CN=localhost'", 'terminal · OpenSSL 3.6') +
    T(ra('s5/https-app', 1, 4), 'real') + J(ma('s5/https-app', 1, 10), { sm: false, hl: [9] }) },

  { t: 'What a client thinks of it', to: true, giua: true, body: T(rut('s5/https-app', ['curl https://localhost:4443/profile', 'curl -S https://localhost:4443/profile', 'curl -k https://localhost:4443/profile'], 5, 11), 'real', { hl: [4, 7] }) +
    two(box('Exit code 60', 'Nobody trusted vouches for this certificate — the browser shows the same warning.', 'cam'),
      box('-k = "accept anyway"', 'Fine on your own laptop. Never in code that talks to a real service: it turns off the check that stops a man in the middle.', 'do2')) +
    box('req.secure is true', 'Express knows the request came over TLS — useful for Secure cookies (Node.js course 8.4).', 'lam') },

  { t: 'Redirect every HTTP request to HTTPS', to: true, giua: true, body: JW(ma('s5/https-app', 12, 16), 100, [3], { sm: false }) +
    T(rut('s5/https-app', ['curl -i http://localhost:4380/profile?x=1', 'curl -k -L http://localhost:4380/profile'], 12, 16), 'real', { hl: [3] }) +
    box('301 keeps the path and the query', 'The browser follows it automatically; -L makes curl do the same.', 'lam') },

  { t: 'In production', to: true, giua: true, body: flow([
    { t: 'browser', s: 'https://myapp.com', mau: LAM }, { t: 'proxy / host', s: 'real certificate, TLS ends here', mau: NODE }, { t: 'your Node app', s: 'plain HTTP on :3000', mau: CAM },
  ]) + two(box('Certificates from a CA', 'Let\'s Encrypt, Cloudflare or the hosting platform issue and renew them. You rarely load key.pem in Node.', 'lam'),
    box('Then trust the proxy correctly', 'req.secure and req.ip come from proxy headers: app.set(\'trust proxy\', 1) for one proxy — the Node.js course, lesson 8.4, shows what goes wrong otherwise.', 'cam')) +
    J("app.set('trust proxy', 1);                 // exactly one proxy in front\napp.use((req, res, next) =>\n  req.secure ? next() : res.redirect(301, 'https://' + req.get('host') + req.originalUrl));", { sm: false }) },

  { t: 'What earns the marks', to: true, giua: true, body: bang(['in your project', 'why'], [
    ['JWT_SECRET from .env, checked at startup', 'no secret in Git, no crash on first login'],
    ['jwt.verify with algorithms, 401 on failure', 'never jwt.decode for auth'],
    ['cors({ origin: [your front-end] })', 'not * in production'],
    ['multer limits + a checked file type', 'no disk-filling uploads'],
    ['path.basename on user file names', 'no path traversal'],
    ['HTTPS (redirect HTTP)', 'the token never travels in clear'],
  ], { co: 23 }) + box('Practise', 'Code Lab › Authentication track: JWT login + a protected route; then add an upload endpoint with limits.', 'xanh') },

  { t: 'Exercise', to: true, giua: true, body: J("app.use(cors());\napp.get('/avatar/:name', (req, res) =>\n  res.sendFile(path.join(__dirname, 'avatars', req.params.name)));\nconst token = jwt.sign({ id: user._id, password: user.password }, 'secret123');", { sm: false, hl: [1, 3, 4] }) +
    box('Exercise', 'Four problems in four lines. Name them and fix each.', '') +
    `<div data-k="dapan">${box('Answer', '1. cors() = any origin: list your front-end. 2. User input in a path: path.basename(req.params.name). 3. The password hash inside a readable payload: sign only { id }. 4. A hard-coded short secret: process.env.JWT_SECRET (32+ random characters), plus an expiresIn.', 'xanh')}</div>` },

  { t: 'Self-check', to: true, giua: true, body: `<ol>
<li>Who can read a JWT payload?</li>
<li>Does cors({ origin }) stop the stranger's GET from running on your server?</li>
<li>Why does Multer store files under random names?</li>
<li>What does path.basename protect against?</li>
<li>Over HTTPS, what can someone on the Wi-Fi still see?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. Anyone holding it. &nbsp;2. No — the browser only hides the response; the request already ran. &nbsp;3. So users cannot choose names on your disk. &nbsp;4. ../ climbing out of the uploads folder. &nbsp;5. The host name (SNI), IPs and traffic size — not the path, headers or token.', 'xanh')}</div>` },

  { t: 'Summary', to: true, giua: true, body: `<ul>
<li>JWT: sign { id } with a secret from .env, verify with algorithms pinned; the payload is readable</li>
<li>CORS is the browser's rule for reading responses — list your origins, protect the API with auth</li>
<li>Multer with limits; res.download for "Save as"; path.basename for every user file name</li>
<li>HTTPS hides the token from the network; redirect HTTP with 301; in production TLS ends at the proxy</li>
</ul>` + box('Going deeper', 'Node.js course 8.2 (refresh tokens, attacks), 9.1 (headers, CORS), 10.1 (uploads and memory); API Design 6.4 (CORS in a real browser).', 'lam') },
]);
