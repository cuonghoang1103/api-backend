/** Node.js 9.4 — Bí mật, phụ thuộc, và những gì lỗi khai ra (JWT_SECRET yếu bẻ trong 1 ms, timingSafeEqual, lỗi mờ + requestId, gitleaks). */
import { modul, cs, q, qn, tn, jsBai, nguon, MOI_TRUONG } from './_node-c9-11.mjs';

/* ─── 1. EASY · choice ─── */
const E1 = cs({
  ten: 'Secrets: where they live and what a leak really costs', kho: 'EASY', phut: 10,
  en: 'From the lesson: a dictionary attack on <code>JWT_SECRET</code>, nine direct dependencies becoming 183 packages, a "utility" that ships <code>process.env</code> away, and the table of where secrets may live.',
  vi: 'Từ bài: tấn công từ điển vào <code>JWT_SECRET</code>, chín phụ thuộc trực tiếp thành 183 gói, một gói "tiện ích" gửi <code>process.env</code> đi nơi khác, và bảng bí mật được phép nằm ở đâu.',
  cau: [
    q('s1', ['An attacker found your JWT_SECRET ("supersecret", 1.04 ms). What can they do that a stolen session could not?', 'Kẻ tấn công tìm ra JWT_SECRET ("supersecret", 1,04 ms). Họ làm được gì mà một phiên bị trộm không làm được?'],
      ['Mint valid tokens for any user, role and expiry — rotation and revocation of sessions do not help', 'Only read the payload of existing tokens, which was already visible in base64', 'Nothing new: they still need the user’s password to log in', 'Decrypt the database, because Prisma uses JWT_SECRET to encrypt columns'],
      ['With the signing key the server cannot tell their tokens from genuine ones. Fix: 32 bytes from a CSPRNG (crypto.randomBytes(32)), in runtime env, rotatable.', 'Có khoá ký thì máy chủ không phân biệt được token của họ với token thật. Sửa: 32 byte từ CSPRNG (crypto.randomBytes(32)), nằm trong env lúc chạy, xoay được.']),
    q('s2', ['A real API key was committed to git and pushed. What is the fix?', 'Một API key thật bị commit vào git và đã push. Cách sửa là gì?'],
      ['Rotate the key — deleting the line does not help, history and every clone still have it', 'Delete the line in a new commit; the old commit is hidden from the default branch', 'Force-push a rewritten history; then the key is gone everywhere', 'Add the file to .gitignore so the next clone does not download it'],
      ['Assume the value is public the moment it left your machine. Rotation is the only step that makes the leaked value worthless.', 'Coi giá trị là công khai ngay khi nó rời máy bạn. Xoay khoá là bước duy nhất khiến giá trị bị lộ thành vô dụng.']),
    q('s3', ['Where should a production secret live on this kind of deployment?', 'Bí mật production nên nằm ở đâu trong kiểu triển khai này?'],
      ['In the runtime environment, injected when the container starts from a file the deploy never overwrites', 'In a Docker ARG, so it is baked in at build time and never typed again', 'In a NEXT_PUBLIC_* variable, so both the frontend and the backend can read it', 'In the image layer as /app/.env, because images are private on GHCR'],
      ['Layers and ARG values are readable by anyone who can pull the image; NEXT_PUBLIC_* is inlined into the browser bundle. Runtime env (or a secret manager) is the answer.', 'Layer và giá trị ARG ai kéo được ảnh là đọc được; NEXT_PUBLIC_* bị chép vào bundle trình duyệt. Env lúc chạy (hoặc trình quản lý bí mật) mới là câu trả lời.']),
    q('s4', ['The left-pad-vn "utility" copied DATABASE_URL, JWT_SECRET and R2_SECRET_ACCESS_KEY at runtime. Which control would have limited the damage most directly?', '"Tiện ích" left-pad-vn chép DATABASE_URL, JWT_SECRET và R2_SECRET_ACCESS_KEY lúc chạy. Biện pháp nào hạn chế thiệt hại trực tiếp nhất?'],
      ['Least privilege: a process only holds the env vars it needs (no R2 key in a backend that never touches R2)', 'npm install --ignore-scripts, which blocks code from running inside node_modules', 'A unit test that checks the function’s output, since the payload changes it', 'Running npm audit before every deploy, which flags runtime payloads'],
      ['--ignore-scripts only stops install-time scripts; this is the runtime version. Tests pass because the function still returns "   7". Fewer dependencies + lockfile + least privilege are what work.', '--ignore-scripts chỉ chặn script lúc cài; đây là bản lúc chạy. Test vẫn qua vì hàm vẫn trả "   7". Ít phụ thuộc + lockfile + quyền tối thiểu mới hiệu quả.']),
    qn('s5', ['Which belong in the 500 response body the user sees? (choose all)', 'Cái nào được nằm trong thân phản hồi 500 người dùng thấy? (chọn mọi câu đúng)'],
      ['A stable error code such as "INTERNAL"', 'The request id, so the user can quote it in a support ticket', 'err.message, so the user knows which file was missing', 'The stack trace, trimmed to the first two frames', 'The Prisma P2002 meta with the constraint and column names'],
      [0, 1],
      ['Log everything in full (message, stack, request id, user id); return almost nothing. err.message leaked /opt/cuongthai/.env.production in the lesson; P2002 meta leaks your schema.', 'Ghi log đầy đủ (message, stack, request id, user id); trả về gần như không gì. err.message trong bài đã làm lộ /opt/cuongthai/.env.production; meta của P2002 làm lộ schema.']),
  ],
  goiY: [['For each question ask: "after this, who can read the value?"', 'Mỗi câu hỏi: "sau việc này, ai đọc được giá trị?"'], ['The lesson’s table "Where secrets actually live" has four rows: code/git · image · runtime env · secret manager.', 'Bảng "Bí mật thật sự nằm ở đâu" của bài có bốn dòng: code/git · ảnh · env lúc chạy · trình quản lý bí mật.']],
  loi: [['Deleting the leaked line and moving on without rotating.', 'Xoá dòng bị lộ rồi đi tiếp mà không xoay khoá.'], ['Returning err.message from a 500 "to help debugging".', 'Trả err.message trong lỗi 500 "để dễ gỡ lỗi".']],
  tns: [tn('CSPRNG', 'bộ sinh số ngẫu nhiên an toàn mật mã', 'crypto.randomBytes'), tn('rotate', 'xoay khoá', 'thay bí mật mới, vô hiệu bí mật cũ'), tn('least privilege', 'quyền tối thiểu', 'chỉ cấp đúng thứ tiến trình cần')],
  kn: ['secrets', 'supply chain'],
});

/* ─── 2. EASY · js — thời gian bẻ + tấn công từ điển ─── */
function crackDays(alphabetSize, length, guessesPerSecond) {
  // Search space: every string of `length` characters from the alphabet. Worst case = try them all.
  const space = Math.pow(alphabetSize, length);
  const days = space / guessesPerSecond / 86400;          // 86,400 seconds in a day
  return Math.round(days * 10) / 10;                      // one decimal, like the lesson's table
}

function dictionaryAttack(token, words, verify) {
  let tries = 0;
  for (const w of words) {
    tries++;
    try {
      verify(token, w);          // jwt.verify THROWS on a wrong secret — the attacker's loop just catches and moves on
      return { found: w, tries };
    } catch {
      // wrong guess: keep going
    }
  }
  return { found: null, tries };
}

const VERIFY = String.raw`
// fake jwt.verify: throws unless the secret is right (the token remembers which secret signed it)
function verify(token, secret) { if (token.signedWith !== secret) { const e = new Error('invalid signature'); e.name = 'JsonWebTokenError'; throw e; } return { userId: 7 }; }
const WEAK = ['secret', 'password', '123456', 'changeme', 'jwt_secret', 'supersecret', 'mysecretkey', 'secretkey', 'nodejs', 'admin123'];
`;

const E2 = jsBai({
  ten: 'How long does a secret survive?', kho: 'EASY', phut: 10,
  en: `<p>Two functions from the lesson’s first measurement:</p>
<ul><li><code>crackDays(alphabetSize, length, guessesPerSecond)</code> — the worst-case time to try every secret of that shape: <code>alphabetSize<sup>length</sup> / guessesPerSecond</code> seconds, converted to days and rounded to <b>1 decimal</b>. The lesson’s rates: 35,465/s through <code>jwt.verify</code>, 877,404/s with raw HMAC.</li>
<li><code>dictionaryAttack(token, words, verify)</code> — try each word as the secret with <code>verify(token, word)</code>, which <b>throws</b> on a wrong secret (like <code>jwt.verify</code>). Return <code>{ found, tries }</code>: the first word that does not throw and how many were tried; <code>{ found: null, tries: words.length }</code> if none.</li></ul>
<p>The tests provide a fake <code>verify</code> and the lesson’s 10-word list <code>WEAK</code>.</p>${MOI_TRUONG.en}`,
  vi: `<p>Hai hàm từ phép đo đầu tiên của bài:</p>
<ul><li><code>crackDays(alphabetSize, length, guessesPerSecond)</code> — thời gian xấu nhất để thử mọi bí mật dạng đó: <code>alphabetSize<sup>length</sup> / guessesPerSecond</code> giây, đổi ra ngày, làm tròn <b>1 chữ số thập phân</b>. Tốc độ trong bài: 35.465/giây qua <code>jwt.verify</code>, 877.404/giây bằng HMAC thô.</li>
<li><code>dictionaryAttack(token, words, verify)</code> — thử từng từ làm bí mật bằng <code>verify(token, word)</code>, hàm này <b>ném lỗi</b> khi sai (như <code>jwt.verify</code>). Trả <code>{ found, tries }</code>: từ đầu tiên không ném lỗi và số từ đã thử; <code>{ found: null, tries: words.length }</code> nếu không có.</li></ul>
<p>Bộ kiểm cấp <code>verify</code> giả và danh sách 10 từ <code>WEAK</code> của bài.</p>${MOI_TRUONG.vi}`,
  goiY: [['<code>Math.pow(26, 8)</code> is 208,827,064,576; divide by the rate and by 86,400.', '<code>Math.pow(26, 8)</code> là 208.827.064.576; chia cho tốc độ rồi chia 86.400.'], ['Round with <code>Math.round(x * 10) / 10</code>. For the attack, put <code>verify</code> inside <code>try { … } catch { }</code> in the loop.', 'Làm tròn bằng <code>Math.round(x * 10) / 10</code>. Với tấn công, đặt <code>verify</code> trong <code>try { … } catch { }</code> trong vòng lặp.']],
  loi: [['Not catching the throw: the first wrong word ends the whole attack with a JsonWebTokenError.', 'Không bắt lỗi ném ra: từ sai đầu tiên kết thúc cả cuộc tấn công bằng JsonWebTokenError.'], ['Dividing by 3600 (hours) or 60 instead of 86,400 seconds per day.', 'Chia cho 3600 (giờ) hoặc 60 thay vì 86.400 giây mỗi ngày.']],
  gt: ['The numbers are the argument of the lesson: 26<sup>8</sup> at the jwt.verify rate is 68.2 days, 36<sup>8</sup> at the raw-HMAC rate is 37.2 days on one core — and a dictionary word falls in milliseconds. A 32-byte random secret is 2<sup>256</sup>: no rate makes that finite. The attack loop shows why: a wrong guess costs one caught exception, nothing more.', 'Các con số chính là lập luận của bài: 26<sup>8</sup> với tốc độ jwt.verify là 68,2 ngày, 36<sup>8</sup> với tốc độ HMAC thô là 37,2 ngày trên một nhân — còn một từ trong từ điển rơi trong vài mili giây. Bí mật ngẫu nhiên 32 byte là 2<sup>256</sup>: không tốc độ nào làm nó hữu hạn. Vòng tấn công cho thấy lý do: đoán sai chỉ tốn một lỗi bị bắt, không hơn.'],
  kn: ['secrets', 'brute force'],
  tns: [tn('search space', 'không gian tìm kiếm', 'số bí mật có thể có'), tn('dictionary attack', 'tấn công từ điển', 'thử các từ người hay đặt trước')],
  fakes: VERIFY,
  dau: `/** Worst-case days to brute-force a secret. */
function crackDays(alphabetSize, length, guessesPerSecond) {
  // Write your solution here
  return Math.round(alphabetSize * length / guessesPerSecond);
}

/** Try each word with verify(token, word) — which throws when the secret is wrong. */
function dictionaryAttack(token, words, verify) {
  for (let i = 0; i < words.length; i++) {
    verify(token, words[i]);
    return { found: words[i], tries: i + 1 };
  }
  return { found: null, tries: words.length };
}
`,
  giai: '// Reference solution\n' + nguon(crackDays, dictionaryAttack),
  cases: [
    { goi: 'crackDays(26, 8, 35465)', moTa: ['8 lower-case letters through jwt.verify', '8 chữ thường qua jwt.verify'] },
    { goi: 'crackDays(36, 8, 877404)', moTa: ['8 letters+digits with raw HMAC', '8 chữ+số bằng HMAC thô'] },
    { goi: 'dictionaryAttack({ signedWith: "supersecret" }, WEAK, verify)', moTa: ['The lesson’s token', 'Token của bài'] },
    { goi: '[crackDays(36, 8, 35465), crackDays(10, 6, 35465), crackDays(62, 10, 877404) > 1e6]', an: true },
    { goi: '[dictionaryAttack({ signedWith: "xUMtHMbnIi6NDoiYUqHLnNsgPLpRnGpdcZp0KD1qk6g" }, WEAK, verify), dictionaryAttack({ signedWith: "secret" }, WEAK, verify), dictionaryAttack({ signedWith: "a" }, [], verify)]', an: true },
  ],
});

/* ─── 3. MEDIUM · js — so sánh thời gian hằng ─── */
function timingSafeEqual(a, b) {
  // Same contract as Node's crypto.timingSafeEqual: different lengths THROW (RangeError), they do not return false.
  if (a.length !== b.length) throw new RangeError('Input buffers must have the same byte length');
  let diff = 0;
  // Visit EVERY byte, whatever happens. An early "return false" makes the time depend on how many leading
  // bytes are right — which is exactly what an attacker measures to rebuild a key byte by byte.
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

function cmpSafe(a, b) {
  const x = Array.from(String(a), (ch) => ch.charCodeAt(0));
  const y = Array.from(String(b), (ch) => ch.charCodeAt(0));
  // Guard the length yourself (the lesson's wrapper): timingSafeEqual would throw on it.
  return x.length === y.length && timingSafeEqual(x, y);
}

const DEM = String.raw`
// wraps an array so the test can count how many bytes your function READ
function counted(arr) { const box = { reads: 0 }; box.p = new Proxy(arr, { get(t, k) { if (typeof k === 'string' && /^\d+$/.test(k)) box.reads++; return t[k]; } }); return box; }
`;

const E3 = jsBai({
  ten: 'Compare API keys in constant time', kho: 'MEDIUM', phut: 15,
  en: `<p><code>a === b</code> returns as soon as it finds a differing byte, so its time leaks how many leading bytes are right. Node ships <code>crypto.timingSafeEqual</code>; there is no <code>crypto</code> in the browser grader, so write it yourself:</p>
<ul><li><code>timingSafeEqual(a, b)</code> — <code>a</code>, <code>b</code> are arrays of byte values. If lengths differ <b>throw</b> <code>RangeError('Input buffers must have the same byte length')</code> (exactly like Node). Otherwise return <code>true</code>/<code>false</code> after looking at <b>every</b> index — no early return.</li>
<li><code>cmpSafe(a, b)</code> — the lesson’s wrapper for strings: convert each to an array of char codes, return <code>false</code> for different lengths (never throw), otherwise <code>timingSafeEqual</code>.</li></ul>
<p>A test wraps the arrays in a counter: when the very first byte differs, your function must still read all of them.</p>${MOI_TRUONG.en}`,
  vi: `<p><code>a === b</code> trả về ngay khi gặp byte khác, nên thời gian của nó làm lộ số byte đầu đúng. Node có sẵn <code>crypto.timingSafeEqual</code>; máy chấm trình duyệt không có <code>crypto</code>, nên bạn tự viết:</p>
<ul><li><code>timingSafeEqual(a, b)</code> — <code>a</code>, <code>b</code> là mảng giá trị byte. Độ dài khác nhau thì <b>ném</b> <code>RangeError('Input buffers must have the same byte length')</code> (đúng như Node). Ngược lại trả <code>true</code>/<code>false</code> sau khi xem <b>mọi</b> chỉ số — không trả về sớm.</li>
<li><code>cmpSafe(a, b)</code> — vỏ bọc cho chuỗi trong bài: đổi mỗi chuỗi thành mảng mã ký tự, độ dài khác thì trả <code>false</code> (không ném), còn lại gọi <code>timingSafeEqual</code>.</li></ul>
<p>Một ca bọc mảng trong bộ đếm: khi byte đầu tiên đã khác, hàm của bạn vẫn phải đọc hết.</p>${MOI_TRUONG.vi}`,
  goiY: [['Accumulate differences with OR: <code>diff |= a[i] ^ b[i]</code> is 0 only if every pair is equal.', 'Cộng dồn khác biệt bằng OR: <code>diff |= a[i] ^ b[i]</code> chỉ bằng 0 khi mọi cặp bằng nhau.'], ['Decide only after the loop: <code>return diff === 0</code>.', 'Chỉ quyết sau vòng lặp: <code>return diff === 0</code>.'], ['In cmpSafe check the lengths before calling timingSafeEqual — that call throws on a mismatch.', 'Trong cmpSafe kiểm độ dài trước khi gọi timingSafeEqual — lời gọi đó ném lỗi khi lệch.']],
  loi: [['<code>if (a[i] !== b[i]) return false</code> inside the loop: correct answers, leaking time.', '<code>if (a[i] !== b[i]) return false</code> trong vòng lặp: đáp án đúng, nhưng làm lộ thời gian.'], ['Calling Node’s timingSafeEqual on keys of different lengths and getting ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH instead of false.', 'Gọi timingSafeEqual của Node với khoá khác độ dài và nhận ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH thay vì false.'], ['Comparing the raw key at all: comparing a HASH of the key (chapter 8) is timing-safe by construction and safer if the DB leaks.', 'So khoá thô ngay từ đầu: so BĂM của khoá (chương 8) vốn an toàn về thời gian và an toàn hơn nếu CSDL lộ.']],
  gt: ['The loop does the same work for every input of a given length, so its duration says nothing about where the first difference is. OR-ing XORs is the standard trick: any mismatch sets some bit and nothing can clear it. Lengths are not secret in this contract (they are compared openly), which is why Node throws and why the wrapper returns false first — verified on Node 22: different lengths throw RangeError ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH.', 'Vòng lặp làm cùng một lượng việc với mọi input cùng độ dài, nên thời gian chạy không nói gì về chỗ khác đầu tiên. OR các XOR là mẹo chuẩn: bất kỳ chỗ lệch nào cũng bật một bit và không gì tắt nó được. Độ dài không phải bí mật trong hợp đồng này (được so công khai), vì vậy Node ném lỗi và vỏ bọc trả false trước — kiểm trên Node 22: khác độ dài ném RangeError ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH.'],
  kn: ['timing attacks', 'secrets'],
  tns: [tn('timing attack', 'tấn công đo thời gian', 'suy ra bí mật từ thời gian phản hồi'), tn('constant time', 'thời gian hằng', 'không phụ thuộc giá trị bí mật')],
  fakes: DEM,
  dau: `/** Constant-time comparison of two byte arrays (throws on different lengths). */
function timingSafeEqual(a, b) {
  // Write your solution here
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

/** String wrapper: false on different lengths, otherwise timingSafeEqual. */
function cmpSafe(a, b) {
  return a === b;
}
`,
  giai: '// Reference solution\n' + nguon(timingSafeEqual, cmpSafe),
  cases: [
    { goi: '[cmpSafe("abc", "abcd"), cmpSafe("sk_live_7f3a", "sk_live_7f3a"), cmpSafe("sk_live_7f3a", "sk_live_7f3b")]', moTa: ['The lesson’s three comparisons', 'Ba phép so của bài'] },
    { goi: '(() => { try { timingSafeEqual([1, 2, 3], [1, 2]); return "no throw"; } catch (e) { return [e.name, e.message]; } })()', moTa: ['Different lengths throw RangeError', 'Khác độ dài ném RangeError'] },
    { goi: '(() => { const a = counted([9, 2, 3, 4, 5, 6, 7, 8]), b = counted([1, 2, 3, 4, 5, 6, 7, 8]); const r = timingSafeEqual(a.p, b.p); return [r, a.reads >= 8, b.reads >= 8]; })()', moTa: ['First byte differs: every byte is still read', 'Byte đầu đã khác: vẫn đọc mọi byte'] },
    { goi: '[timingSafeEqual([], []), timingSafeEqual([0, 255], [0, 255]), timingSafeEqual([0, 255], [0, 254]), timingSafeEqual([128], [0])]', an: true },
    { goi: '[cmpSafe("", ""), cmpSafe("key", "kez"), cmpSafe("Key", "key"), cmpSafe("a", "")]', an: true },
    { goi: '(() => { const a = counted([5, 5, 5, 5, 5, 5]), b = counted([5, 5, 5, 5, 5, 6]); return [timingSafeEqual(a.p, b.p), a.reads >= 6, b.reads >= 6]; })()', an: true },
  ],
});

/* ─── 4. MEDIUM · js — handler lỗi: log đủ, trả gần như không gì ─── */
function makeErrorHandler({ log, newId }) {
  return function errorHandler(err, req, res, next) {
    const requestId = req.id || newId();            // reuse the id the request-id middleware set, if any
    const status = Number.isInteger(err && err.status) && err.status >= 400 && err.status < 500 ? err.status : 500;
    // EVERYTHING goes to the log, where only you read it (a real app logs err.stack too).
    log.push({ level: 'error', requestId, userId: req.user ? req.user.id : null, status, message: String(err && err.message) });
    res.setHeader('X-Request-ID', requestId);       // the twelve characters the user quotes in a ticket
    if (status < 500) {
      // A 4xx is the client's own mistake: be specific (lesson 6.3) — it reveals nothing about the server.
      return res.status(status).json({ error: err.code || 'BAD_REQUEST', message: err.message, requestId });
    }
    // A 5xx is OUR failure: paths, hosts, SQL, constraint names stay in the log. Stable code + id out.
    return res.status(500).json({ error: 'INTERNAL', requestId });
  };
}

const ERRS = String.raw`
const log = [];
let n = 0; const newId = () => 'req-' + (++n);
function enoent() { const e = new Error("ENOENT: no such file or directory, open '/opt/cuongthai/.env.production'"); e.code = 'ENOENT'; e.errno = -2; return e; }
function p2002() { const e = new Error('Unique constraint failed on the fields: (email)'); e.code = 'P2002'; e.meta = { target: ['email'], modelName: 'User' }; return e; }
function bad(msg) { const e = new Error(msg); e.status = 400; e.code = 'VALIDATION'; return e; }
async function runErr(h, err, req) { req = req || { headers: {} }; const res = makeRes(); const next = []; await h(err, req, res, (e) => next.push(e ? 'next:' + e.message : 'next')); return { status: res.statusCode, headers: res.headers, body: res.body, next }; }
`;

const E4 = jsBai({
  ten: 'An error handler that tells the user nothing useful to an attacker', kho: 'MEDIUM', phut: 18,
  en: `<p><code>res.status(500).json({ error: err.message })</code> gave away <code>/opt/cuongthai/.env.production</code> in the lesson. Write <code>makeErrorHandler({ log, newId })</code> → Express error middleware <code>(err, req, res, next)</code>:</p>
<ul><li><code>requestId</code> = <code>req.id</code> if set, else <code>newId()</code>; always set header <code>X-Request-ID</code>;</li>
<li><code>status</code> = <code>err.status</code> when it is an integer 400–499, otherwise 500;</li>
<li>push to <code>log</code> exactly <code>{ level:'error', requestId, userId, status, message }</code> (<code>userId</code> = <code>req.user.id</code> or <code>null</code>; <code>message</code> = <code>err.message</code>);</li>
<li>4xx → <code>res.status(status).json({ error: err.code || 'BAD_REQUEST', message: err.message, requestId })</code>;</li>
<li>5xx → <code>res.status(500).json({ error: 'INTERNAL', requestId })</code> — nothing else.</li></ul>
<p>(A real handler also logs <code>err.stack</code>; it is left out here only because stack text differs between engines.)</p>${MOI_TRUONG.en}`,
  vi: `<p><code>res.status(500).json({ error: err.message })</code> đã làm lộ <code>/opt/cuongthai/.env.production</code> trong bài. Viết <code>makeErrorHandler({ log, newId })</code> → middleware lỗi của Express <code>(err, req, res, next)</code>:</p>
<ul><li><code>requestId</code> = <code>req.id</code> nếu có, không thì <code>newId()</code>; luôn đặt header <code>X-Request-ID</code>;</li>
<li><code>status</code> = <code>err.status</code> khi là số nguyên 400–499, còn lại 500;</li>
<li>đẩy vào <code>log</code> đúng <code>{ level:'error', requestId, userId, status, message }</code> (<code>userId</code> = <code>req.user.id</code> hoặc <code>null</code>; <code>message</code> = <code>err.message</code>);</li>
<li>4xx → <code>res.status(status).json({ error: err.code || 'BAD_REQUEST', message: err.message, requestId })</code>;</li>
<li>5xx → <code>res.status(500).json({ error: 'INTERNAL', requestId })</code> — không gì khác.</li></ul>
<p>(Handler thật còn log <code>err.stack</code>; ở đây bỏ ra chỉ vì chữ của stack khác nhau giữa các engine.)</p>${MOI_TRUONG.vi}`,
  goiY: [['Compute <code>requestId</code> and <code>status</code> first; the rest is two branches.', 'Tính <code>requestId</code> và <code>status</code> trước; phần còn lại là hai nhánh.'], ['An error with <code>status: 503</code> is still the server’s failure → the opaque branch.', 'Lỗi có <code>status: 503</code> vẫn là lỗi của máy chủ → nhánh mờ.']],
  loi: [['<code>{ error: err.message }</code> on a 500 — the path, the host, the constraint name all go to the client.', '<code>{ error: err.message }</code> ở lỗi 500 — đường dẫn, host, tên ràng buộc đều tới client.'], ['Making 4xx opaque too: a validation error should say exactly which field is wrong.', 'Làm mờ cả 4xx: lỗi kiểm dữ liệu phải nói đúng trường nào sai.'], ['Generating a new id instead of reusing req.id — the log line and the response no longer match.', 'Sinh id mới thay vì dùng lại req.id — dòng log và phản hồi không còn khớp nhau.']],
  gt: ['The asymmetry is the whole design: the log gets everything because only you read it, the client gets a stable code plus the same request id, which is enough to find the full entry. 4xx errors describe the client’s own input, so specificity leaks nothing; 5xx errors describe your infrastructure, so they say nothing at all. Reusing <code>req.id</code> keeps the support ticket, the response header and the log line on one key.', 'Sự bất đối xứng là cả thiết kế: log nhận mọi thứ vì chỉ bạn đọc, client nhận một mã ổn định cộng đúng request id, đủ để tìm dòng log đầy đủ. Lỗi 4xx mô tả chính input của client nên cụ thể cũng không lộ gì; lỗi 5xx mô tả hạ tầng của bạn nên không nói gì cả. Dùng lại <code>req.id</code> giữ phiếu hỗ trợ, header phản hồi và dòng log trên cùng một khoá.'],
  kn: ['error handling', 'information disclosure'],
  tns: [tn('request id', 'mã request', 'chuỗi ngắn nối phản hồi với dòng log'), tn('opaque error', 'lỗi mờ', 'chỉ có mã + id, không có chi tiết')],
  fakes: ERRS,
  dau: `/** Build the last middleware of the app: (err, req, res, next). */
function makeErrorHandler({ log, newId }) {
  return function errorHandler(err, req, res, next) {
    // Write your solution here
    res.status(err.status || 500).json({ error: err.message, code: err.code });
  };
}
`,
  giai: '// Reference solution\n' + nguon(makeErrorHandler),
  cases: [
    { goi: 'await runErr(makeErrorHandler({ log, newId }), enoent(), { headers: {}, id: "90779998-0e6f" })', moTa: ['ENOENT with the .env path', 'ENOENT kèm đường dẫn .env'] },
    { goi: '[await runErr(makeErrorHandler({ log, newId }), bad("title: too long"), { headers: {}, user: { id: 7 } }), log]', moTa: ['A validation error is specific; the log has the user', 'Lỗi kiểm dữ liệu cụ thể; log có người dùng'] },
    { goi: '[await runErr(makeErrorHandler({ log, newId }), p2002(), { headers: {} }), log]', moTa: ['Prisma P2002: no schema in the response', 'Prisma P2002: không lộ schema'] },
    { goi: 'await (async () => { const h = makeErrorHandler({ log, newId }); const e = new Error("connect ECONNREFUSED 10.0.0.5:5432"); e.status = 503; const a = await runErr(h, e, { headers: {}, user: { id: 3 } }); const b = await runErr(h, Object.assign(new Error("not yours"), { status: 403 }), { headers: {} }); return [a, b, log]; })()', an: true },
    { goi: '[await runErr(makeErrorHandler({ log, newId }), Object.assign(new Error("x"), { status: "400" }), { headers: {} }), await runErr(makeErrorHandler({ log, newId }), Object.assign(new Error("gone"), { status: 404, code: "NOT_FOUND" }), { headers: {}, id: "abc123" })]', an: true },
  ],
});

/* ─── 5. HARD · js — quét bí mật kiểu gitleaks, ngoại lệ hẹp ─── */
function scanSecrets(files, allow) {
  const RULES = [
    { id: 'private-key', re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
    { id: 'jwt', re: /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]*/ },
    { id: 'generic-api-key', re: /\b(?:api[_-]?key|secret|token)\b\s*[:=]\s*['"]?[A-Za-z0-9_-]{20,}/i },
  ];
  // An exception is (path pattern AND rule list). A path match alone must NOT silence every rule:
  // the lesson's allow-list for content/(courses|exphub|exams)/ covers generic-api-key + jwt ONLY.
  const allowed = (file, rule) => allow.some((a) => new RegExp(a.path).test(file) && a.rules.includes(rule));
  const findings = [];
  for (const file of Object.keys(files).sort()) {
    String(files[file]).split('\n').forEach((text, i) => {
      for (const r of RULES) {
        if (r.re.test(text) && !allowed(file, r.id)) findings.push({ file, line: i + 1, rule: r.id });
      }
    });
  }
  return findings;
}

const KEY = '-----BEGIN RSA PRIVATE KEY-----';
const JWT = 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjd9.Jp4sHk3m2Yq9TfLx0aBcDeFgH';
const JWT_NONE = 'eyJhbGciOiJub25lIn0.eyJ1c2VySWQiOjF9.';
const ALLOW = [{ path: '^content/(courses|exphub|exams)/', rules: ['generic-api-key', 'jwt'] }];

const E5 = jsBai({
  ten: 'A pre-commit secret scan with an exception that is tested both ways', kho: 'HARD', phut: 25,
  en: `<p>This repository’s gitleaks hook once refused a commit because a course page printed a sample refresh token. The fix was an allow-list for <code>content/(courses|exphub|exams)/</code> <b>scoped to the generic-api-key and jwt rules only</b> — "verified by checking that a real RSA key in the same directory is still caught". Write <code>scanSecrets(files, allow)</code>:</p>
<ul><li><code>files</code>: <code>{ path: content }</code>; <code>allow</code>: <code>[{ path: '&lt;regex source&gt;', rules: ['rule-id', …] }]</code>;</li>
<li>use exactly these rules, tested on each line:
<pre>private-key      /-----BEGIN [A-Z ]*PRIVATE KEY-----/
jwt              /\\beyJ[A-Za-z0-9_-]{10,}\\.eyJ[A-Za-z0-9_-]{10,}\\.[A-Za-z0-9_-]*/
generic-api-key  /\\b(?:api[_-]?key|secret|token)\\b\\s*[:=]\\s*['"]?[A-Za-z0-9_-]{20,}/i</pre></li>
<li>a finding is skipped only if some allow entry’s path regex matches the file <b>and</b> its <code>rules</code> include that rule;</li>
<li>return <code>[{ file, line, rule }]</code> (line is 1-based), files in sorted path order, lines in order, rules in the order listed above.</li></ul>${MOI_TRUONG.en}`,
  vi: `<p>Hook gitleaks của chính repo này từng từ chối một commit vì trang khoá học in một refresh token mẫu. Cách sửa là danh sách trắng cho <code>content/(courses|exphub|exams)/</code> <b>chỉ áp cho hai luật generic-api-key và jwt</b> — "đã kiểm rằng một khoá RSA thật trong cùng thư mục vẫn bị bắt". Viết <code>scanSecrets(files, allow)</code>:</p>
<ul><li><code>files</code>: <code>{ đường_dẫn: nội_dung }</code>; <code>allow</code>: <code>[{ path: '&lt;mã regex&gt;', rules: ['mã-luật', …] }]</code>;</li>
<li>dùng đúng các luật sau, kiểm trên từng dòng:
<pre>private-key      /-----BEGIN [A-Z ]*PRIVATE KEY-----/
jwt              /\\beyJ[A-Za-z0-9_-]{10,}\\.eyJ[A-Za-z0-9_-]{10,}\\.[A-Za-z0-9_-]*/
generic-api-key  /\\b(?:api[_-]?key|secret|token)\\b\\s*[:=]\\s*['"]?[A-Za-z0-9_-]{20,}/i</pre></li>
<li>một phát hiện chỉ bị bỏ qua khi có mục allow mà regex path khớp tệp <b>và</b> <code>rules</code> của nó có luật đó;</li>
<li>trả <code>[{ file, line, rule }]</code> (line đếm từ 1), tệp theo thứ tự đường dẫn đã sắp xếp, dòng theo thứ tự, luật theo thứ tự liệt kê ở trên.</li></ul>${MOI_TRUONG.vi}`,
  goiY: [['Three nested loops: files (sorted) → lines → rules. Push a finding when the rule matches and the exception does not apply.', 'Ba vòng lồng nhau: tệp (đã sắp) → dòng → luật. Đẩy phát hiện khi luật khớp và ngoại lệ không áp dụng.'], ['Write the exception as one function <code>allowed(file, ruleId)</code> that needs BOTH conditions.', 'Viết ngoại lệ thành một hàm <code>allowed(file, ruleId)</code> cần CẢ HAI điều kiện.']],
  loi: [['Allowing a whole directory: the RSA key in content/courses/ goes into history unnoticed.', 'Cho qua cả thư mục: khoá RSA trong content/courses/ lọt vào lịch sử không ai hay.'], ['Stopping at the first matching rule per line: one line can hold two different findings.', 'Dừng ở luật khớp đầu tiên của mỗi dòng: một dòng có thể chứa hai phát hiện khác nhau.'], ['Counting lines from 0 — editors and gitleaks report them from 1.', 'Đếm dòng từ 0 — trình soạn thảo và gitleaks đếm từ 1.']],
  gt: ['A security exception should be as narrow as possible and tested in both directions: the sample token in a course file must pass, and a real key in the same directory must still be caught. Encoding the exception as path AND rule makes it impossible to widen by accident; scanning every rule on every line means one allowed finding cannot hide another on the same line.', 'Một ngoại lệ bảo mật phải hẹp nhất có thể và được kiểm cả hai chiều: token mẫu trong tệp khoá học phải qua, và khoá thật trong cùng thư mục vẫn phải bị bắt. Mã hoá ngoại lệ thành đường dẫn VÀ luật khiến nó không thể vô tình bị nới; quét mọi luật trên mọi dòng nghĩa là một phát hiện được phép không che được phát hiện khác trên cùng dòng.'],
  kn: ['secrets', 'tooling'],
  tns: [tn('pre-commit hook', 'móc trước commit', 'chạy trước khi commit được tạo'), tn('false positive', 'báo động giả', 'bị bắt nhưng không phải bí mật thật')],
  dau: `/** Scan files for secrets; skip findings covered by an allow entry. */
function scanSecrets(files, allow) {
  const RULES = [
    { id: 'private-key', re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
    { id: 'jwt', re: /\\beyJ[A-Za-z0-9_-]{10,}\\.eyJ[A-Za-z0-9_-]{10,}\\.[A-Za-z0-9_-]*/ },
    { id: 'generic-api-key', re: /\\b(?:api[_-]?key|secret|token)\\b\\s*[:=]\\s*['"]?[A-Za-z0-9_-]{20,}/i },
  ];
  // Write your solution here
  const findings = [];
  for (const file of Object.keys(files)) {
    if (allow.some((a) => new RegExp(a.path).test(file))) continue;
    files[file].split('\\n').forEach((text, i) => {
      const r = RULES.find((x) => x.re.test(text));
      if (r) findings.push({ file, line: i + 1, rule: r.id });
    });
  }
  return findings;
}
`,
  giai: '// Reference solution\n' + nguon(scanSecrets),
  cases: [
    { goi: `scanSecrets(${JSON.stringify({ 'content/courses/nodejs/s08.mjs': `const sample = '${JWT}';\nrefresh_token: 'r8KxPq2mVn7LwZ3yTb5cJd9hFs'`, 'src/config/r2.ts': `const secret = 'wJalrXUtnFEMIK7MDENGbPxRfiCYEXAMPLEKEY';` })}, ${JSON.stringify(ALLOW)})`, moTa: ['Course samples allowed, real key in src caught', 'Mẫu trong khoá học được qua, khoá thật trong src bị bắt'] },
    { goi: `scanSecrets(${JSON.stringify({ 'content/courses/auth/test-key.pem': `${KEY}\nMIIEowIBAAKCAQEA…`, 'content/exams/de1.md': `alg none: ${JWT_NONE}x` })}, ${JSON.stringify(ALLOW)})`, moTa: ['A real RSA key in the same directory is still caught', 'Khoá RSA thật trong cùng thư mục vẫn bị bắt'] },
    { goi: `scanSecrets(${JSON.stringify({ 'b.env': 'API_KEY=sk_live_FAKE_lab_0000_notreal\nok=1', 'a.ts': `// token: ${JWT}` })}, [])`, moTa: ['No exceptions: sorted by file', 'Không ngoại lệ: sắp theo tệp'] },
    { goi: `scanSecrets(${JSON.stringify({ 'content/exphub/x.md': `secret = "abcdefghijklmnopqrstuvwx" and ${JWT}`, 'contentX/courses/y.md': `${JWT}`, 'content/blog/z.md': `api-key: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'` })}, ${JSON.stringify(ALLOW)})`, an: true },
    { goi: `scanSecrets(${JSON.stringify({ 'src/a.ts': `const t = '${JWT}'; const secret = 'ZZZZZZZZZZZZZZZZZZZZZZZZ';\n${KEY}`, 'docs/b.md': 'token: short' })}, [{ path: '^src/', rules: ['jwt'] }])`, an: true },
  ],
});

export default modul('nodejs-9-4-bi-mat-va-phu-thuoc', '9.4 Secrets, dependencies and error messages', [E1, E2, E3, E4, E5]);
