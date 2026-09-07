/**
 * Authentication — Practical Exam (PE): 5 câu thực hành, nộp .zip.
 *
 * Đề tự soạn, bám sát `content/courses/authentication/s00…s12`. Khác đề FE (50
 * câu trắc nghiệm), đề này bắt VIẾT hiện vật chạy được: một tầng lưu mật khẩu
 * có đường chuyển đổi, một bộ kiểm JWT viết tay không dùng thư viện, một cỗ máy
 * phiên có xoay vòng và phát hiện tái dùng, một bộ TOTP đúng RFC 6238 kèm mã
 * khôi phục, và một bộ máy phân quyền cộng giới hạn tần suất cộng nhật ký kiểm
 * toán.
 *
 * ⚠️ MỌI `sampleSolution` VÀ MỌI `expectedOutput` DƯỚI ĐÂY ĐÃ CHẠY THẬT trên
 * **Node.js v22.21.0** (macOS, darwin arm64), chỉ dùng `node:crypto` — không
 * một gói ngoài nào, nên `node scripts/exam-check.mjs` GHÉP LẠI VÀ CHẠY ĐƯỢC
 * cả năm câu, và cả năm đều khớp `expectedOutput` từng dòng. Đó là lý do đề
 * này cố tình KHÔNG dùng `argon2`, `bcrypt` hay `jsonwebtoken`: một lời giải
 * mẫu mà chính bộ kiểm không chạy nổi là một lời giải chưa ai kiểm.
 *
 * Vì sao đầu ra tất định được: mỗi câu nhận muối, token, id và đồng hồ từ khối
 * "ĐỀ CHO SẴN" chứ không gọi `randomBytes` hay `Date.now()` trong lời giải.
 * Trên production thì ngược lại — đề nói rõ chỗ nào phải thay bằng CSPRNG.
 *
 * ⚠️ CHỖ GIÁO TRÌNH LỆCH VỚI MÁY, đã đo lại và đề THEO MÁY (xem chú thích đầu
 * `AUTHENTICATION-FE.mjs` cho danh sách đầy đủ). Hai chỗ chạm tới đề này:
 *   • Bài 2.2 gọi `crypto.scrypt(pw, salt, 64, { N: 2**15, r: 8, p: 1 })` mà
 *     không đặt `maxmem`. Trên Node 22 lệnh đó NÉM
 *     `ERR_CRYPTO_INVALID_SCRYPT_PARAMS` vì trần mặc định là 32 MB còn
 *     128·N·r = 32 MiB đã chạm trần. Câu 1 vì thế đặt `maxmem` tường minh.
 *   • Bài 12.2 nói cửa sổ ±1 bước "chịu được lệch từ −60s tới +59s". Đo thật:
 *     khoảng chấp nhận phụ thuộc vị trí của T trong bước, và khoảng BẢO ĐẢM
 *     cho mọi thời điểm chỉ là ±30 giây. Câu 4 vì thế chấm theo SỐ BƯỚC
 *     (`counter`), không theo số giây.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/AUTHENTICATION-PE.mjs --apply
 */
import { B, c, codeQ } from './_lib/authentication-exam-kit.mjs';

/**
 * Rubric riêng cho từng câu: tổng `maxScore` đúng bằng `points` của câu, nên
 * điểm từng tiêu chí cộng lại ra thẳng điểm câu — không phải quy đổi.
 */
const rubric = (rows) => rows.map(([id, en, vi, maxScore]) => ({
  id,
  criterion: B(en, vi),
  weight: maxScore,
  maxScore,
}));

const INSTRUCTIONS =
  '<div class="ml-en">' +
  '<p><b>How to take this exam.</b></p>' +
  '<ol>' +
  '<li>Create five files named <code>Q1.cjs … Q5.cjs</code> on your own machine. Each question shows a <b>Starter</b> block — copy it in <b>verbatim</b> and write your answer only between the two <code>ĐỀ CHO SẴN</code> markers. The fixtures above your answer and the harness below it are part of the grading; editing either is how you fail a question you actually solved.</li>' +
  '<li><b>Node 22 and <code>node:crypto</code> only.</b> No npm install, no <code>argon2</code>, no <code>bcrypt</code>, no <code>jsonwebtoken</code>, no <code>jose</code>. Everything these questions ask for is thirty lines of standard library, and writing it once is the point.</li>' +
  '<li><b>Run it before you submit:</b> <code>node Q1.cjs</code>. The output must match the "expected output" block <b>line for line</b>. Every reference answer was produced by running exactly that command.</li>' +
  '<li><b>Determinism is given to you.</b> Salts, tokens, ids and the clock all come from the starter block, so the same code always prints the same thing. Do not call <code>randomBytes</code> or <code>Date.now()</code> inside your answer — in production you would, and each question says where.</li>' +
  '<li>Zip the five files into <b>one .zip</b> and upload it in the submit box.</li>' +
  '</ol>' +
  '<p><b>How it is graded.</b> Behaviour first — an answer that does not reproduce the output cannot pass. But this is an authentication exam, so the <b>shape</b> of the code is graded too: a secret compared with <code>===</code>, a token stored in the clear, a claim read before the signature was checked, an error branch that answers faster than its neighbour, or a default path that ends in ALLOW all cost marks <em>even when every printed line matches</em>. Passing the tests is the floor here, not the ceiling.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  '<p><b>Cách làm bài thi.</b></p>' +
  '<ol>' +
  '<li>Tạo năm file tên <code>Q1.cjs … Q5.cjs</code> trên máy của bạn. Mỗi câu có một khối <b>Mã cho sẵn</b> — chép <b>nguyên văn</b> vào rồi chỉ viết lời giải ở vùng giữa hai mốc <code>ĐỀ CHO SẴN</code>. Phần dữ liệu phía trên lời giải và phần khung chạy phía dưới là một phần của việc chấm; sửa một trong hai là cách trượt một câu mà bạn thật ra đã làm được.</li>' +
  '<li><b>Chỉ Node 22 và <code>node:crypto</code>.</b> Không cài gói nào, không <code>argon2</code>, không <code>bcrypt</code>, không <code>jsonwebtoken</code>, không <code>jose</code>. Mọi thứ đề hỏi đều nằm gọn trong ba mươi dòng thư viện chuẩn, và tự viết một lần chính là điểm mấu chốt.</li>' +
  '<li><b>Chạy thử trước khi nộp:</b> <code>node Q1.cjs</code>. Kết quả phải khớp khối "kết quả mong đợi" <b>từng dòng một</b>. Mọi đáp án mẫu đều sinh ra bằng đúng câu lệnh đó.</li>' +
  '<li><b>Tính tất định là thứ đề cho sẵn.</b> Muối, token, id và đồng hồ đều lấy từ khối mã cho sẵn, nên cùng một đoạn mã luôn in ra cùng một thứ. ĐỪNG gọi <code>randomBytes</code> hay <code>Date.now()</code> bên trong lời giải — trên sản phẩm thật thì phải gọi, và mỗi câu đều chỉ rõ chỗ nào.</li>' +
  '<li>Nén năm file thành <b>một file .zip</b> rồi tải lên ô nộp bài.</li>' +
  '</ol>' +
  '<p><b>Chấm thế nào.</b> Hành vi trước — một lời giải không tái hiện được kết quả thì không thể qua. Nhưng đây là bài thi xác thực, nên <b>hình dạng</b> của đoạn mã cũng bị chấm: một bí mật so bằng <code>===</code>, một token cất ở dạng trần, một claim đọc ra trước khi kiểm chữ ký, một nhánh lỗi trả lời nhanh hơn nhánh bên cạnh, hay một đường mặc định kết thúc bằng CHO PHÉP đều bị trừ điểm <em>ngay cả khi mọi dòng in ra đều khớp</em>. Qua được phép kiểm ở đây là sàn, không phải trần.</p>' +
  '</div>';

/* ─────────────────────────── Câu 1 ─────────────────────────── */

const Q1_STARTER =
  "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n" +
  "'use strict';\n" +
  "const crypto = require('node:crypto');\n" +
  "\n" +
  "// The only KDF call you may make. It counts itself, because the exam measures\n" +
  "// how many times you call it, not only what you return.\n" +
  "let kdfCalls = 0;\n" +
  "function kdf(password, salt, keylen, params) {\n" +
  "  kdfCalls++;\n" +
  "  return crypto.scryptSync(password, salt, keylen, {\n" +
  "    N: params.N, r: params.r, p: params.p, maxmem: 256 * 1024 * 1024,\n" +
  "  });\n" +
  "}\n" +
  "\n" +
  "const PARAMS = { N: 16384, r: 8, p: 1 };\n" +
  "const KEYLEN = 32;\n" +
  "\n" +
  "// Fixed salts, so this exam has one expected output. In production every one\n" +
  "// of these comes from crypto.randomBytes(16).\n" +
  "const SALTS = ['00112233445566778899aabbccddeeff', 'f0e1d2c3b4a596871234567890abcdef',\n" +
  "               'a1a1a1a1a1a1a1a1b2b2b2b2b2b2b2b2'];\n" +
  "\n" +
  "// The user table, mid-migration: two rows still hold the 2015 scheme.\n" +
  "const users = [\n" +
  "  { email: 'an@example.com',   hash: '$scrypt$N=16384,r=8,p=1$ABEiM0RVZneImaq7zN3u_w$' +\n" +
  "      crypto.scryptSync('correct horse', Buffer.from(SALTS[0], 'hex'), KEYLEN, { N: 16384, r: 8, p: 1 }).toString('base64url') },\n" +
  "  { email: 'binh@example.com', hash: '$sha256$' + crypto.createHash('sha256').update('hunter2').digest('base64url') },\n" +
  "  { email: 'chi@example.com',  hash: '$scrypt$N=1024,r=8,p=1$oaGhoaGhoaGysrKysrKysg$' +\n" +
  "      crypto.scryptSync('tr0ub4dor', Buffer.from(SALTS[2], 'hex'), KEYLEN, { N: 1024, r: 8, p: 1 }).toString('base64url') },\n" +
  "];\n" +
  "\n" +
  "// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n" +
  "\n" +
  "\n" +
  "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n" +
  "const shape = (s) => String(s).split('$').slice(0, 3).join('$');\n" +
  "function attempt(label, email, password) {\n" +
  "  kdfCalls = 0;\n" +
  "  const r = login(email, password, SALTS[1]);\n" +
  "  console.log(`${label.padEnd(26)} ok=${r.ok} kdf=${kdfCalls} rehashed=${r.rehashed} msg=\"${r.message}\"`);\n" +
  "}\n" +
  "console.log('== stored formats ==');\n" +
  "for (const u of users) console.log(`${u.email.padEnd(18)} ${shape(u.hash)} needsRehash=${needsRehash(u.hash)}`);\n" +
  "console.log('== logins ==');\n" +
  "attempt('an / right', 'an@example.com', 'correct horse');\n" +
  "attempt('an / wrong', 'an@example.com', 'Correct horse');\n" +
  "attempt('nobody / anything', 'zz@example.com', 'correct horse');\n" +
  "attempt('binh legacy / right', 'binh@example.com', 'hunter2');\n" +
  "attempt('chi weak params / right', 'chi@example.com', 'tr0ub4dor');\n" +
  "console.log('== after migration ==');\n" +
  "for (const u of users) console.log(`${u.email.padEnd(18)} ${shape(u.hash)} needsRehash=${needsRehash(u.hash)}`);\n" +
  "console.log('== login again, now migrated ==');\n" +
  "attempt('binh / right', 'binh@example.com', 'hunter2');\n" +
  "attempt('binh / wrong', 'binh@example.com', 'hunter3');\n" +
  "console.log('== malformed stored values must not throw ==');\n" +
  "for (const bad of ['', 'not-a-hash', '$scrypt$N=16384,r=8,p=1$AAAA$AAAA', '$scrypt$N=x,r=8,p=1$AA$AA'])\n" +
  "  console.log(`verify(${JSON.stringify(bad).padEnd(38)}) = ${verifyPassword('correct horse', bad)}`);\n" +
  "console.log('== determinism ==');\n" +
  "console.log('same salt, same password ->', hashPassword('correct horse', SALTS[0]) === hashPassword('correct horse', SALTS[0]));\n" +
  "console.log('different salt          ->', hashPassword('correct horse', SALTS[0]) === hashPassword('correct horse', SALTS[1]));\n";

const Q1_SOLUTION =
  "function hashPassword(password, saltHex) {\n" +
  "  const salt = Buffer.from(saltHex, 'hex');\n" +
  "  const dk = kdf(password, salt, KEYLEN, PARAMS);\n" +
  "  return `$scrypt$N=${PARAMS.N},r=${PARAMS.r},p=${PARAMS.p}$` +\n" +
  "         `${salt.toString('base64url')}$${dk.toString('base64url')}`;\n" +
  "}\n" +
  "\n" +
  "function parseStored(stored) {\n" +
  "  const parts = String(stored).split('$');\n" +
  "  if (parts[1] === 'sha256' && parts.length === 3) return { scheme: 'sha256', digest: parts[2] };\n" +
  "  if (parts[1] !== 'scrypt' || parts.length !== 5) return null;\n" +
  "  const params = {};\n" +
  "  for (const kv of parts[2].split(',')) {\n" +
  "    const [k, v] = kv.split('=');\n" +
  "    if (!/^[Nrp]$/.test(k) || !/^[0-9]+$/.test(v)) return null;\n" +
  "    params[k] = Number(v);\n" +
  "  }\n" +
  "  if (params.N === undefined || params.r === undefined || params.p === undefined) return null;\n" +
  "  return { scheme: 'scrypt', params, salt: parts[3], digest: parts[4] };\n" +
  "}\n" +
  "\n" +
  "function verifyPassword(password, stored) {\n" +
  "  const rec = parseStored(stored);\n" +
  "  if (!rec) return false;\n" +
  "  let want, got;\n" +
  "  if (rec.scheme === 'sha256') {\n" +
  "    want = Buffer.from(rec.digest, 'base64url');\n" +
  "    got = crypto.createHash('sha256').update(password).digest();\n" +
  "  } else {\n" +
  "    want = Buffer.from(rec.digest, 'base64url');\n" +
  "    got = kdf(password, Buffer.from(rec.salt, 'base64url'), KEYLEN, rec.params);\n" +
  "  }\n" +
  "  // timingSafeEqual THROWS on a length mismatch, and the throw is itself a\n" +
  "  // length oracle. Check the length first, then compare in constant time.\n" +
  "  if (want.length !== got.length) return false;\n" +
  "  return crypto.timingSafeEqual(want, got);\n" +
  "}\n" +
  "\n" +
  "function needsRehash(stored) {\n" +
  "  const rec = parseStored(stored);\n" +
  "  if (!rec) return true;\n" +
  "  if (rec.scheme !== 'scrypt') return true;\n" +
  "  return rec.params.N < PARAMS.N || rec.params.r < PARAMS.r || rec.params.p < PARAMS.p;\n" +
  "}\n" +
  "\n" +
  "const DUMMY = '$scrypt$N=16384,r=8,p=1$AAAAAAAAAAAAAAAAAAAAAA$' + 'A'.repeat(43);\n" +
  "\n" +
  "function login(email, password, saltHex) {\n" +
  "  const user = users.find((u) => u.email === email);\n" +
  "  // No account: still pay the KDF, so the clock does not answer a question the\n" +
  "  // response body refuses to answer.\n" +
  "  if (!user) {\n" +
  "    verifyPassword(password, DUMMY);\n" +
  "    return { ok: false, message: 'invalid email or password', rehashed: false };\n" +
  "  }\n" +
  "  if (!verifyPassword(password, user.hash)) {\n" +
  "    return { ok: false, message: 'invalid email or password', rehashed: false };\n" +
  "  }\n" +
  "  let rehashed = false;\n" +
  "  if (needsRehash(user.hash)) {\n" +
  "    user.hash = hashPassword(password, saltHex);\n" +
  "    rehashed = true;\n" +
  "  }\n" +
  "  return { ok: true, message: 'welcome', rehashed };\n" +
  "}\n";

const Q1_OUTPUT =
  "== stored formats ==\n" +
  "an@example.com     $scrypt$N=16384,r=8,p=1 needsRehash=false\n" +
  "binh@example.com   $sha256$9S-9MrKzuG_4jvbEkGKChfSCrxXdyylUH5S89Saj9sc needsRehash=true\n" +
  "chi@example.com    $scrypt$N=1024,r=8,p=1 needsRehash=true\n" +
  "== logins ==\n" +
  "an / right                 ok=true kdf=1 rehashed=false msg=\"welcome\"\n" +
  "an / wrong                 ok=false kdf=1 rehashed=false msg=\"invalid email or password\"\n" +
  "nobody / anything          ok=false kdf=1 rehashed=false msg=\"invalid email or password\"\n" +
  "binh legacy / right        ok=true kdf=1 rehashed=true msg=\"welcome\"\n" +
  "chi weak params / right    ok=true kdf=2 rehashed=true msg=\"welcome\"\n" +
  "== after migration ==\n" +
  "an@example.com     $scrypt$N=16384,r=8,p=1 needsRehash=false\n" +
  "binh@example.com   $scrypt$N=16384,r=8,p=1 needsRehash=false\n" +
  "chi@example.com    $scrypt$N=16384,r=8,p=1 needsRehash=false\n" +
  "== login again, now migrated ==\n" +
  "binh / right               ok=true kdf=1 rehashed=false msg=\"welcome\"\n" +
  "binh / wrong               ok=false kdf=1 rehashed=false msg=\"invalid email or password\"\n" +
  "== malformed stored values must not throw ==\n" +
  "verify(\"\"                                    ) = false\n" +
  "verify(\"not-a-hash\"                          ) = false\n" +
  "verify(\"$scrypt$N=16384,r=8,p=1$AAAA$AAAA\"   ) = false\n" +
  "verify(\"$scrypt$N=x,r=8,p=1$AA$AA\"           ) = false\n" +
  "== determinism ==\n" +
  "same salt, same password -> true\n" +
  "different salt          -> false\n";

/* ─────────────────────────── Câu 2 ─────────────────────────── */

const Q2_STARTER =
  "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n" +
  "'use strict';\n" +
  "const crypto = require('node:crypto');\n" +
  "\n" +
  "const b64u = (buf) => Buffer.from(buf).toString('base64url');\n" +
  "const jsonPart = (obj) => b64u(JSON.stringify(obj));\n" +
  "\n" +
  "const ACCESS_SECRET = Buffer.from('access-signing-key-v1', 'utf8');\n" +
  "const OTHER_SECRET  = Buffer.from('some-other-service-key', 'utf8');\n" +
  "const IDP_SECRET    = Buffer.from('idp-shared-key-for-this-client', 'utf8');\n" +
  "\n" +
  "const NOW = 1_800_000_000;                 // the fixed \"current time\" in seconds\n" +
  "const ISS = 'https://auth.example.com';\n" +
  "const AUD = 'api://notes';\n" +
  "const CLIENT_ID = 'notes-web';\n" +
  "const NONCE = 'n-0S6_WzA2Mj';\n" +
  "\n" +
  "// Mints a token. `alg` goes in the header; `key` is what actually signs it —\n" +
  "// the two are allowed to disagree, which is the whole point of several rows.\n" +
  "function mint(header, payload, key) {\n" +
  "  const h = jsonPart(header);\n" +
  "  const p = jsonPart(payload);\n" +
  "  if (header.alg === 'none') return `${h}.${p}.`;\n" +
  "  const algo = header.alg === 'HS512' ? 'sha512' : 'sha256';\n" +
  "  return `${h}.${p}.${crypto.createHmac(algo, key).update(`${h}.${p}`).digest('base64url')}`;\n" +
  "}\n" +
  "\n" +
  "const base = { iss: ISS, aud: AUD, sub: 'u_1', iat: NOW - 60, exp: NOW + 300 };\n" +
  "const ACCESS_TOKENS = [\n" +
  "  ['valid',            mint({ alg: 'HS256', typ: 'JWT' }, base, ACCESS_SECRET)],\n" +
  "  ['alg none',         mint({ alg: 'none',  typ: 'JWT' }, { ...base, sub: 'admin' }, null)],\n" +
  "  ['alg HS512',        mint({ alg: 'HS512', typ: 'JWT' }, base, ACCESS_SECRET)],\n" +
  "  ['other key',        mint({ alg: 'HS256', typ: 'JWT' }, base, OTHER_SECRET)],\n" +
  "  ['payload swapped',  (() => { const t = mint({ alg: 'HS256', typ: 'JWT' }, base, ACCESS_SECRET).split('.');\n" +
  "                                return [t[0], jsonPart({ ...base, sub: 'admin' }), t[2]].join('.'); })()],\n" +
  "  ['expired',          mint({ alg: 'HS256', typ: 'JWT' }, { ...base, iat: NOW - 4000, exp: NOW - 1 }, ACCESS_SECRET)],\n" +
  "  ['not yet valid',    mint({ alg: 'HS256', typ: 'JWT' }, { ...base, nbf: NOW + 120 }, ACCESS_SECRET)],\n" +
  "  ['no exp',           mint({ alg: 'HS256', typ: 'JWT' }, { iss: ISS, aud: AUD, sub: 'u_1', iat: NOW - 60 }, ACCESS_SECRET)],\n" +
  "  ['wrong issuer',     mint({ alg: 'HS256', typ: 'JWT' }, { ...base, iss: 'https://evil.example' }, ACCESS_SECRET)],\n" +
  "  ['wrong audience',   mint({ alg: 'HS256', typ: 'JWT' }, { ...base, aud: 'api://billing' }, ACCESS_SECRET)],\n" +
  "  ['two segments',     mint({ alg: 'HS256', typ: 'JWT' }, base, ACCESS_SECRET).split('.').slice(0, 2).join('.')],\n" +
  "];\n" +
  "\n" +
  "const idBase = { iss: ISS, aud: CLIENT_ID, sub: 'u_1', iat: NOW - 30, exp: NOW + 300, nonce: NONCE };\n" +
  "const ID_TOKENS = [\n" +
  "  ['valid',            mint({ alg: 'HS256', typ: 'JWT' }, idBase, IDP_SECRET)],\n" +
  "  ['aud array + azp',  mint({ alg: 'HS256', typ: 'JWT' }, { ...idBase, aud: [CLIENT_ID, 'other-app'], azp: CLIENT_ID }, IDP_SECRET)],\n" +
  "  ['aud array, no azp',mint({ alg: 'HS256', typ: 'JWT' }, { ...idBase, aud: [CLIENT_ID, 'other-app'] }, IDP_SECRET)],\n" +
  "  ['azp is other app', mint({ alg: 'HS256', typ: 'JWT' }, { ...idBase, aud: [CLIENT_ID, 'other-app'], azp: 'other-app' }, IDP_SECRET)],\n" +
  "  ['replayed nonce',   mint({ alg: 'HS256', typ: 'JWT' }, { ...idBase, nonce: 'n-OLD-SESSION' }, IDP_SECRET)],\n" +
  "  ['no nonce',         mint({ alg: 'HS256', typ: 'JWT' }, { ...idBase, nonce: undefined }, IDP_SECRET)],\n" +
  "];\n" +
  "\n" +
  "// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n" +
  "\n" +
  "\n" +
  "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n" +
  "const report = (label, r) =>\n" +
  "  console.log(`${label.padEnd(20)} ${r.ok ? 'ACCEPT sub=' + r.claims.sub : 'REJECT ' + r.reason}`);\n" +
  "console.log('== access tokens ==');\n" +
  "for (const [label, tok] of ACCESS_TOKENS) report(label, verifyAccessToken(tok));\n" +
  "console.log('== id tokens (expected nonce ' + NONCE + ') ==');\n" +
  "for (const [label, tok] of ID_TOKENS) report(label, verifyIdToken(tok, NONCE));\n" +
  "console.log('== the header of the alg:none token, decoded ==');\n" +
  "console.log(Buffer.from(ACCESS_TOKENS[1][1].split('.')[0], 'base64url').toString());\n";

const Q2_SOLUTION =
  "function decodeSegment(seg) {\n" +
  "  // A JSON parse on attacker-controlled bytes is a normal thing to fail.\n" +
  "  try {\n" +
  "    const obj = JSON.parse(Buffer.from(seg, 'base64url').toString('utf8'));\n" +
  "    return (obj && typeof obj === 'object' && !Array.isArray(obj)) ? obj : null;\n" +
  "  } catch { return null; }\n" +
  "}\n" +
  "\n" +
  "function verifySignature(signingInput, sigSeg, key) {\n" +
  "  const want = Buffer.from(sigSeg, 'base64url');\n" +
  "  const got = crypto.createHmac('sha256', key).update(signingInput).digest();\n" +
  "  if (want.length !== got.length) return false;\n" +
  "  return crypto.timingSafeEqual(want, got);\n" +
  "}\n" +
  "\n" +
  "// Returns { ok: true, claims } or { ok: false, reason }.\n" +
  "function verifyJwt(token, { key, iss, aud, now, requireNonce }) {\n" +
  "  if (typeof token !== 'string') return { ok: false, reason: 'malformed' };\n" +
  "  const parts = token.split('.');\n" +
  "  if (parts.length !== 3) return { ok: false, reason: 'malformed' };\n" +
  "\n" +
  "  const header = decodeSegment(parts[0]);\n" +
  "  if (!header) return { ok: false, reason: 'malformed' };\n" +
  "  // The algorithm comes from OUR configuration, never from the token. This one\n" +
  "  // line is the whole defence against alg:none and against substitution.\n" +
  "  if (header.alg !== 'HS256') return { ok: false, reason: 'alg not allowed' };\n" +
  "  if (header.typ !== undefined && header.typ !== 'JWT') return { ok: false, reason: 'typ not allowed' };\n" +
  "\n" +
  "  if (!verifySignature(`${parts[0]}.${parts[1]}`, parts[2], key)) {\n" +
  "    return { ok: false, reason: 'bad signature' };\n" +
  "  }\n" +
  "  // Nothing below this line runs until the signature is good.\n" +
  "  const claims = decodeSegment(parts[1]);\n" +
  "  if (!claims) return { ok: false, reason: 'malformed' };\n" +
  "\n" +
  "  if (typeof claims.sub !== 'string' || !claims.sub) return { ok: false, reason: 'no sub' };\n" +
  "  if (typeof claims.exp !== 'number') return { ok: false, reason: 'no exp' };\n" +
  "  if (now >= claims.exp) return { ok: false, reason: 'expired' };\n" +
  "  if (claims.nbf !== undefined && now < claims.nbf) return { ok: false, reason: 'not yet valid' };\n" +
  "  if (typeof claims.iat !== 'number' || claims.iat > now + 60) return { ok: false, reason: 'bad iat' };\n" +
  "  if (claims.iss !== iss) return { ok: false, reason: 'wrong issuer' };\n" +
  "\n" +
  "  const audList = Array.isArray(claims.aud) ? claims.aud : [claims.aud];\n" +
  "  if (!audList.includes(aud)) return { ok: false, reason: 'wrong audience' };\n" +
  "  // More than one audience means the token was not minted for us alone; azp\n" +
  "  // must then name us explicitly.\n" +
  "  if (audList.length > 1 && claims.azp !== aud) return { ok: false, reason: 'azp mismatch' };\n" +
  "\n" +
  "  if (requireNonce !== undefined) {\n" +
  "    if (claims.nonce !== requireNonce) return { ok: false, reason: 'nonce mismatch' };\n" +
  "  }\n" +
  "  return { ok: true, claims };\n" +
  "}\n" +
  "\n" +
  "const verifyAccessToken = (token) =>\n" +
  "  verifyJwt(token, { key: ACCESS_SECRET, iss: ISS, aud: AUD, now: NOW });\n" +
  "\n" +
  "const verifyIdToken = (token, expectedNonce) =>\n" +
  "  verifyJwt(token, { key: IDP_SECRET, iss: ISS, aud: CLIENT_ID, now: NOW, requireNonce: expectedNonce });\n";

const Q2_OUTPUT =
  "== access tokens ==\n" +
  "valid                ACCEPT sub=u_1\n" +
  "alg none             REJECT alg not allowed\n" +
  "alg HS512            REJECT alg not allowed\n" +
  "other key            REJECT bad signature\n" +
  "payload swapped      REJECT bad signature\n" +
  "expired              REJECT expired\n" +
  "not yet valid        REJECT not yet valid\n" +
  "no exp               REJECT no exp\n" +
  "wrong issuer         REJECT wrong issuer\n" +
  "wrong audience       REJECT wrong audience\n" +
  "two segments         REJECT malformed\n" +
  "== id tokens (expected nonce n-0S6_WzA2Mj) ==\n" +
  "valid                ACCEPT sub=u_1\n" +
  "aud array + azp      ACCEPT sub=u_1\n" +
  "aud array, no azp    REJECT azp mismatch\n" +
  "azp is other app     REJECT azp mismatch\n" +
  "replayed nonce       REJECT nonce mismatch\n" +
  "no nonce             REJECT nonce mismatch\n" +
  "== the header of the alg:none token, decoded ==\n" +
  "{\"alg\":\"none\",\"typ\":\"JWT\"}\n";

/* ─────────────────────────── Câu 3 ─────────────────────────── */

const Q3_STARTER =
  "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n" +
  "'use strict';\n" +
  "const crypto = require('node:crypto');\n" +
  "\n" +
  "// A fake clock and a deterministic token source, so this exam has ONE expected\n" +
  "// output. In production `now()` is Date.now() and `newToken()` is\n" +
  "// crypto.randomBytes(32).toString('base64url').\n" +
  "let clock = 1_800_000_000;\n" +
  "const now = () => clock;\n" +
  "const advance = (seconds) => { clock += seconds; };\n" +
  "let seq = 0;\n" +
  "let ids = 0;\n" +
  "const newId = (prefix) => `${prefix}_${++ids}`;\n" +
  "const newToken = () => `rt_${String(++seq).padStart(2, '0')}_` +\n" +
  "  crypto.createHash('sha256').update(`seed:${seq}`).digest('base64url').slice(0, 10);\n" +
  "\n" +
  "const sha256 = (s) => crypto.createHash('sha256').update(s).digest('base64url');\n" +
  "\n" +
  "const REFRESH_TTL = 30 * 24 * 3600;   // absolute lifetime of a refresh token\n" +
  "const GRACE = 10;                     // seconds a just-rotated token stays usable\n" +
  "\n" +
  "// The two tables. `refreshTokens` is keyed by the HASH of the token: the raw\n" +
  "// value must never be readable from a database dump.\n" +
  "const refreshTokens = new Map();      // hash -> { family, user, issuedAt, usedAt, successor }\n" +
  "const families = new Map();           // family -> { user, revoked, reason }\n" +
  "const resets = new Map();             // hash -> { user, expiresAt, usedAt }\n" +
  "\n" +
  "// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n" +
  "\n" +
  "\n" +
  "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n" +
  "const say = (label, r) => console.log(\n" +
  "  `${label.padEnd(30)} ${r.ok ? 'OK  token=' + r.refreshToken + (r.replay ? ' (replayed)' : '') : 'NO  ' + r.reason}`);\n" +
  "\n" +
  "console.log('== normal rotation ==');\n" +
  "const s = startSession('u_1');\n" +
  "console.log(`start                          OK  token=${s.refreshToken} family=${s.family}`);\n" +
  "advance(60); const r1 = refresh(s.refreshToken); say('refresh #1', r1);\n" +
  "advance(60); const r2 = refresh(r1.refreshToken); say('refresh #2', r2);\n" +
  "console.log('raw tokens in the table:', [...refreshTokens.keys()].every((k) => !k.startsWith('rt_')));\n" +
  "\n" +
  "console.log('== the dropped reply (inside the grace window) ==');\n" +
  "advance(3); const again = refresh(r1.refreshToken); say('reuse of #1 after 3s', again);\n" +
  "console.log('same successor handed back:', again.refreshToken === r2.refreshToken);\n" +
  "\n" +
  "console.log('== the thief (outside the grace window) ==');\n" +
  "advance(600); const stolen = refresh(r1.refreshToken); say('reuse of #1 after 603s', stolen);\n" +
  "say('legitimate holder tries next', refresh(r2.refreshToken));\n" +
  "console.log('family state:', JSON.stringify([...families.values()]));\n" +
  "\n" +
  "console.log('== a second session, and the five events ==');\n" +
  "const a = startSession('u_2'); const b = startSession('u_2');\n" +
  "advance(5);\n" +
  "console.log('ended by password change:', endAllSessions('u_2', 'password changed'));\n" +
  "say('u_2 session A refresh', refresh(a.refreshToken));\n" +
  "say('u_2 session B refresh', refresh(b.refreshToken));\n" +
  "\n" +
  "console.log('== password reset is single use ==');\n" +
  "const c1 = startSession('u_3');\n" +
  "const token = createReset('u_3');\n" +
  "advance(30);\n" +
  "console.log('use #1:', JSON.stringify(useReset(token)));\n" +
  "console.log('use #2:', JSON.stringify(useReset(token)));\n" +
  "console.log('unknown:', JSON.stringify(useReset('rt_99_deadbeef')));\n" +
  "say('u_3 refresh after reset', refresh(c1.refreshToken));\n" +
  "const late = createReset('u_3');\n" +
  "advance(901);\n" +
  "console.log('expired:', JSON.stringify(useReset(late)));\n";

const Q3_SOLUTION =
  "function issueRefresh(user, family) {\n" +
  "  const raw = newToken();\n" +
  "  refreshTokens.set(sha256(raw), { family, user, issuedAt: now(), usedAt: null, successor: null });\n" +
  "  return raw;\n" +
  "}\n" +
  "\n" +
  "function startSession(user) {\n" +
  "  const family = newId('fam');\n" +
  "  families.set(family, { user, revoked: false, reason: null });\n" +
  "  return { family, refreshToken: issueRefresh(user, family) };\n" +
  "}\n" +
  "\n" +
  "function refresh(raw) {\n" +
  "  const rec = refreshTokens.get(sha256(String(raw)));\n" +
  "  // An unknown token is not necessarily an attack — it is also every token\n" +
  "  // that was ever rotated out on a server that forgets. We keep them, so\n" +
  "  // \"unknown\" really means unknown.\n" +
  "  if (!rec) return { ok: false, reason: 'unknown token' };\n" +
  "\n" +
  "  const fam = families.get(rec.family);\n" +
  "  if (!fam || fam.revoked) return { ok: false, reason: `family revoked: ${fam ? fam.reason : 'gone'}` };\n" +
  "  if (now() - rec.issuedAt >= REFRESH_TTL) return { ok: false, reason: 'expired' };\n" +
  "\n" +
  "  if (rec.usedAt !== null) {\n" +
  "    // Already rotated. Two very different things look identical here.\n" +
  "    if (now() - rec.usedAt <= GRACE && rec.successor) {\n" +
  "      // The client never received the response to its own refresh — a dropped\n" +
  "      // reply, not a thief. Hand back the SAME successor instead of burning\n" +
  "      // the session of a user who did nothing wrong.\n" +
  "      return { ok: true, refreshToken: rec.successor, replay: true };\n" +
  "    }\n" +
  "    // Past the grace window, two holders of one token means one of them stole\n" +
  "    // it, and we cannot tell which. End the whole family.\n" +
  "    revokeFamily(rec.family, 'refresh token reuse detected');\n" +
  "    return { ok: false, reason: 'reuse detected' };\n" +
  "  }\n" +
  "\n" +
  "  const next = issueRefresh(rec.user, rec.family);\n" +
  "  rec.usedAt = now();\n" +
  "  rec.successor = next;\n" +
  "  return { ok: true, refreshToken: next, replay: false };\n" +
  "}\n" +
  "\n" +
  "function revokeFamily(family, reason) {\n" +
  "  const fam = families.get(family);\n" +
  "  if (fam && !fam.revoked) { fam.revoked = true; fam.reason = reason; }\n" +
  "}\n" +
  "\n" +
  "// The five events that must end every session a user has, not just this one.\n" +
  "function endAllSessions(user, event) {\n" +
  "  let n = 0;\n" +
  "  for (const [family, fam] of families) {\n" +
  "    if (fam.user === user && !fam.revoked) { revokeFamily(family, event); n++; }\n" +
  "  }\n" +
  "  return n;\n" +
  "}\n" +
  "\n" +
  "function createReset(user) {\n" +
  "  const raw = newToken();\n" +
  "  resets.set(sha256(raw), { user, expiresAt: now() + 900, usedAt: null });\n" +
  "  return raw;\n" +
  "}\n" +
  "\n" +
  "function useReset(raw) {\n" +
  "  const rec = resets.get(sha256(String(raw)));\n" +
  "  // Same answer for \"never existed\" and \"already spent\": neither tells the\n" +
  "  // sender whether they guessed a real token.\n" +
  "  if (!rec || rec.usedAt !== null) return { ok: false, reason: 'invalid or used' };\n" +
  "  if (now() >= rec.expiresAt) return { ok: false, reason: 'invalid or used' };\n" +
  "  rec.usedAt = now();\n" +
  "  // Resetting a password is one of the five events. Everything the thief still\n" +
  "  // holds dies here, or the reset accomplished nothing.\n" +
  "  const ended = endAllSessions(rec.user, 'password reset');\n" +
  "  return { ok: true, user: rec.user, endedFamilies: ended };\n" +
  "}\n";

const Q3_OUTPUT =
  "== normal rotation ==\n" +
  "start                          OK  token=rt_01_geS6O8IJfY family=fam_1\n" +
  "refresh #1                     OK  token=rt_02_l8PdzTVreQ\n" +
  "refresh #2                     OK  token=rt_03_dBMQLd9rJK\n" +
  "raw tokens in the table: true\n" +
  "== the dropped reply (inside the grace window) ==\n" +
  "reuse of #1 after 3s           OK  token=rt_03_dBMQLd9rJK (replayed)\n" +
  "same successor handed back: true\n" +
  "== the thief (outside the grace window) ==\n" +
  "reuse of #1 after 603s         NO  reuse detected\n" +
  "legitimate holder tries next   NO  family revoked: refresh token reuse detected\n" +
  "family state: [{\"user\":\"u_1\",\"revoked\":true,\"reason\":\"refresh token reuse detected\"}]\n" +
  "== a second session, and the five events ==\n" +
  "ended by password change: 2\n" +
  "u_2 session A refresh          NO  family revoked: password changed\n" +
  "u_2 session B refresh          NO  family revoked: password changed\n" +
  "== password reset is single use ==\n" +
  "use #1: {\"ok\":true,\"user\":\"u_3\",\"endedFamilies\":1}\n" +
  "use #2: {\"ok\":false,\"reason\":\"invalid or used\"}\n" +
  "unknown: {\"ok\":false,\"reason\":\"invalid or used\"}\n" +
  "u_3 refresh after reset        NO  family revoked: password reset\n" +
  "expired: {\"ok\":false,\"reason\":\"invalid or used\"}\n";

/* ─────────────────────────── Câu 4 ─────────────────────────── */

const Q4_STARTER =
  "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n" +
  "'use strict';\n" +
  "const crypto = require('node:crypto');\n" +
  "\n" +
  "const B32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';\n" +
  "\n" +
  "// RFC 6238 Appendix B publishes its test vectors for the ASCII secret\n" +
  "// \"12345678901234567890\". This is that secret in base32, the way an\n" +
  "// authenticator app receives it in an otpauth:// URI.\n" +
  "const RFC_SECRET_B32 = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';\n" +
  "const USER_SECRET_B32 = 'JBSWY3DPEHPK3PXP';\n" +
  "\n" +
  "const STEP = 30;      // seconds per code\n" +
  "const DIGITS = 6;\n" +
  "const DRIFT = 1;      // accept one step either side of now, and no more\n" +
  "\n" +
  "// Recovery codes are credentials. The table holds only their hashes.\n" +
  "const sha256 = (s) => crypto.createHash('sha256').update(s).digest();\n" +
  "const RECOVERY_PLAINTEXT = ['j4m2-8xqp', 'r7bk-1vzn', 'w3hd-9tsc'];\n" +
  "const recovery = RECOVERY_PLAINTEXT.map((c) => ({ hash: sha256(c), usedAt: null }));\n" +
  "\n" +
  "// Per-enrolment replay state. Persisted in production; a Map here.\n" +
  "const seen = { lastCounter: -1 };\n" +
  "\n" +
  "// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n" +
  "\n" +
  "\n" +
  "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n" +
  "console.log('== RFC 6238 Appendix B, SHA-1, 8 digits ==');\n" +
  "const rfcKey = base32Decode(RFC_SECRET_B32);\n" +
  "console.log('secret decodes to:', rfcKey.toString('ascii'));\n" +
  "for (const t of [59, 1111111109, 1111111111, 1234567890, 2000000000, 20000000000]) {\n" +
  "  console.log(`T=${String(t).padStart(11)}  ${totp(rfcKey, t, 8)}`);\n" +
  "}\n" +
  "console.log('== the code the user is looking at ==');\n" +
  "const key = base32Decode(USER_SECRET_B32);\n" +
  "const T = 1_800_000_000;\n" +
  "for (const d of [-2, -1, 0, 1, 2]) console.log(`step ${String(d).padStart(2)}  ${totp(key, T + d * STEP)}`);\n" +
  "\n" +
  "console.log('== verification ==');\n" +
  "const show = (label, r) => console.log(`${label.padEnd(34)} ${r.ok ? 'ACCEPT counter=' + r.counter : 'REJECT ' + r.reason}`);\n" +
  "show('code for now', verifyTotp(USER_SECRET_B32, totp(key, T), T, seen));\n" +
  "show('same code again (replay)', verifyTotp(USER_SECRET_B32, totp(key, T), T, seen));\n" +
  "show('previous step (inside drift)', verifyTotp(USER_SECRET_B32, totp(key, T - STEP), T, seen));\n" +
  "show('next step (inside drift)', verifyTotp(USER_SECRET_B32, totp(key, T + STEP), T, seen));\n" +
  "show('two steps back (outside)', verifyTotp(USER_SECRET_B32, totp(key, T - 2 * STEP), T, seen));\n" +
  "show('wrong code', verifyTotp(USER_SECRET_B32, '000000', T, seen));\n" +
  "show('five digits', verifyTotp(USER_SECRET_B32, '12345', T, seen));\n" +
  "show('letters', verifyTotp(USER_SECRET_B32, 'ABC123', T, seen));\n" +
  "\n" +
  "console.log('== recovery codes ==');\n" +
  "const r = (label, x) => console.log(`${label.padEnd(34)} ${x.ok ? 'ACCEPT remaining=' + x.remaining : 'REJECT ' + x.reason}`);\n" +
  "r('valid code', useRecoveryCode('J4M2-8XQP', recovery));\n" +
  "r('same code again', useRecoveryCode('j4m2-8xqp', recovery));\n" +
  "r('second code', useRecoveryCode(' r7bk-1vzn ', recovery));\n" +
  "r('never issued', useRecoveryCode('zzzz-0000', recovery));\n" +
  "console.log('nothing readable in the table:', recovery.every((x) => Buffer.isBuffer(x.hash)));\n";

const Q4_SOLUTION =
  "function base32Decode(input) {\n" +
  "  let bits = 0, value = 0;\n" +
  "  const out = [];\n" +
  "  for (const ch of String(input).toUpperCase().replace(/=+$/, '')) {\n" +
  "    const idx = B32_ALPHABET.indexOf(ch);\n" +
  "    if (idx === -1) throw new Error(`bad base32 character: ${ch}`);\n" +
  "    value = (value << 5) | idx;\n" +
  "    bits += 5;\n" +
  "    if (bits >= 8) { out.push((value >>> (bits - 8)) & 0xff); bits -= 8; }\n" +
  "  }\n" +
  "  return Buffer.from(out);\n" +
  "}\n" +
  "\n" +
  "function hotp(key, counter, digits = DIGITS, alg = 'sha1') {\n" +
  "  const ctr = Buffer.alloc(8);\n" +
  "  ctr.writeBigUInt64BE(BigInt(counter));\n" +
  "  const mac = crypto.createHmac(alg, key).update(ctr).digest();\n" +
  "  // Dynamic truncation, RFC 4226 §5.3: the low nibble of the LAST byte picks\n" +
  "  // the offset, and the top bit of the first chosen byte is masked off so the\n" +
  "  // number is never read as negative.\n" +
  "  const off = mac[mac.length - 1] & 0x0f;\n" +
  "  const bin = ((mac[off] & 0x7f) << 24) | (mac[off + 1] << 16) | (mac[off + 2] << 8) | mac[off + 3];\n" +
  "  return String(bin % 10 ** digits).padStart(digits, '0');\n" +
  "}\n" +
  "\n" +
  "const totp = (key, t, digits = DIGITS, alg = 'sha1', step = STEP) =>\n" +
  "  hotp(key, Math.floor(t / step), digits, alg);\n" +
  "\n" +
  "function verifyTotp(secretB32, submitted, t, state) {\n" +
  "  const code = String(submitted).replace(/\\s/g, '');\n" +
  "  if (!/^[0-9]{6}$/.test(code)) return { ok: false, reason: 'malformed' };\n" +
  "  const key = base32Decode(secretB32);\n" +
  "  const counter = Math.floor(t / STEP);\n" +
  "  const submittedBuf = Buffer.from(code, 'utf8');\n" +
  "\n" +
  "  let matched = null;\n" +
  "  // Walk every step in the window even after a hit: bailing out early makes\n" +
  "  // the loop's running time depend on WHICH step matched.\n" +
  "  for (let d = -DRIFT; d <= DRIFT; d++) {\n" +
  "    const candidate = Buffer.from(hotp(key, counter + d), 'utf8');\n" +
  "    if (crypto.timingSafeEqual(submittedBuf, candidate)) matched = counter + d;\n" +
  "  }\n" +
  "  if (matched === null) return { ok: false, reason: 'no match' };\n" +
  "  // A correct code is a one-time password. Seeing it twice means someone read\n" +
  "  // it over the user's shoulder, or off a phishing page.\n" +
  "  if (matched <= state.lastCounter) return { ok: false, reason: 'already used' };\n" +
  "  state.lastCounter = matched;\n" +
  "  return { ok: true, counter: matched };\n" +
  "}\n" +
  "\n" +
  "function useRecoveryCode(submitted, codes) {\n" +
  "  const given = sha256(String(submitted).trim().toLowerCase());\n" +
  "  for (const rec of codes) {\n" +
  "    if (!crypto.timingSafeEqual(given, rec.hash)) continue;\n" +
  "    if (rec.usedAt !== null) return { ok: false, reason: 'already used' };\n" +
  "    rec.usedAt = 'now';\n" +
  "    return { ok: true, remaining: codes.filter((r) => r.usedAt === null).length };\n" +
  "  }\n" +
  "  return { ok: false, reason: 'no match' };\n" +
  "}\n";

const Q4_OUTPUT =
  "== RFC 6238 Appendix B, SHA-1, 8 digits ==\n" +
  "secret decodes to: 12345678901234567890\n" +
  "T=         59  94287082\n" +
  "T= 1111111109  07081804\n" +
  "T= 1111111111  14050471\n" +
  "T= 1234567890  89005924\n" +
  "T= 2000000000  69279037\n" +
  "T=20000000000  65353130\n" +
  "== the code the user is looking at ==\n" +
  "step -2  909724\n" +
  "step -1  292210\n" +
  "step  0  309848\n" +
  "step  1  489290\n" +
  "step  2  260565\n" +
  "== verification ==\n" +
  "code for now                       ACCEPT counter=60000000\n" +
  "same code again (replay)           REJECT already used\n" +
  "previous step (inside drift)       REJECT already used\n" +
  "next step (inside drift)           ACCEPT counter=60000001\n" +
  "two steps back (outside)           REJECT no match\n" +
  "wrong code                         REJECT no match\n" +
  "five digits                        REJECT malformed\n" +
  "letters                            REJECT malformed\n" +
  "== recovery codes ==\n" +
  "valid code                         ACCEPT remaining=2\n" +
  "same code again                    REJECT already used\n" +
  "second code                        ACCEPT remaining=1\n" +
  "never issued                       REJECT no match\n" +
  "nothing readable in the table: true\n";

/* ─────────────────────────── Câu 5 ─────────────────────────── */

const Q5_STARTER =
  "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n" +
  "'use strict';\n" +
  "const crypto = require('node:crypto');\n" +
  "\n" +
  "let clock = 1_800_000_000;\n" +
  "const now = () => clock;\n" +
  "const advance = (s) => { clock += s; };\n" +
  "\n" +
  "// One membership row per (user, tenant). A user with no row in a tenant has no\n" +
  "// standing there at all — not \"reader\", not \"none\": no row.\n" +
  "const memberships = [\n" +
  "  { user: 'u_an',   tenant: 't_acme', role: 'admin' },\n" +
  "  { user: 'u_binh', tenant: 't_acme', role: 'editor' },\n" +
  "  { user: 'u_chi',  tenant: 't_acme', role: 'viewer' },\n" +
  "  { user: 'u_binh', tenant: 't_globex', role: 'viewer' },\n" +
  "];\n" +
  "\n" +
  "const documents = [\n" +
  "  { id: 'd1', tenant: 't_acme',   owner: 'u_binh', state: 'draft' },\n" +
  "  { id: 'd2', tenant: 't_acme',   owner: 'u_chi',  state: 'published' },\n" +
  "  { id: 'd3', tenant: 't_globex', owner: 'u_binh', state: 'draft' },\n" +
  "];\n" +
  "\n" +
  "const ROLE_GRANTS = {\n" +
  "  viewer: ['document:read'],\n" +
  "  editor: ['document:read', 'document:create', 'document:update'],\n" +
  "  admin:  ['document:read', 'document:create', 'document:update', 'document:delete', 'member:invite'],\n" +
  "};\n" +
  "\n" +
  "const RATE = { perAccount: 5, perIp: 10, window: 60, lockout: 900 };\n" +
  "const attempts = [];        // { at, account, ip, ok }\n" +
  "const audit = [];\n" +
  "\n" +
  "// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n" +
  "\n" +
  "\n" +
  "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n" +
  "const doc = (id) => documents.find((d) => d.id === id);\n" +
  "const ask = (user, perm, id) => {\n" +
  "  const r = can(user, perm, doc(id));\n" +
  "  console.log(`${user.padEnd(7)} ${perm.padEnd(17)} ${id}  ${r.allow ? 'ALLOW' : 'DENY '}  ${r.reason}`);\n" +
  "};\n" +
  "console.log('== authorization ==');\n" +
  "ask('u_an', 'document:delete', 'd1');\n" +
  "ask('u_an', 'document:delete', 'd3');\n" +
  "ask('u_binh', 'document:update', 'd1');\n" +
  "ask('u_binh', 'document:update', 'd2');\n" +
  "ask('u_chi', 'document:update', 'd2');\n" +
  "ask('u_chi', 'document:read', 'd2');\n" +
  "ask('u_binh', 'document:update', 'd3');\n" +
  "ask('u_binh', 'document:read', 'd3');\n" +
  "ask('u_dung', 'document:read', 'd1');\n" +
  "console.log(`u_an    document:read     (no resource)  ${can('u_an', 'document:read', null).reason}`);\n" +
  "\n" +
  "console.log('== rate limiting ==');\n" +
  "const tryLogin = (account, ip, ok) => {\n" +
  "  const t = throttle(account, ip);\n" +
  "  if (!t.allow) { console.log(`${account} from ${ip}: BLOCKED ${t.reason} retryAfter=${t.retryAfter}`); return; }\n" +
  "  recordAttempt(account, ip, ok);\n" +
  "  console.log(`${account} from ${ip}: ${ok ? 'ok' : 'fail'} (account=${t.byAccount} ip=${t.byIp})`);\n" +
  "};\n" +
  "for (let i = 0; i < 6; i++) tryLogin('an@example.com', '203.0.113.9', false);\n" +
  "tryLogin('binh@example.com', '203.0.113.9', false);\n" +
  "console.log('-- the botnet: one guess each, eleven accounts, eleven addresses --');\n" +
  "for (let i = 0; i < 11; i++) tryLogin(`user${i}@example.com`, `198.51.100.${i}`, false);\n" +
  "console.log('-- after the window --');\n" +
  "advance(61);\n" +
  "tryLogin('an@example.com', '203.0.113.9', true);\n" +
  "\n" +
  "console.log('== audit log ==');\n" +
  "console.log(JSON.stringify(auditLine('login.failed', {\n" +
  "  user: 'u_an', ip: '203.0.113.9', password: 'hunter2', reason: 'bad password',\n" +
  "})));\n" +
  "console.log(JSON.stringify(auditLine('token.refreshed', {\n" +
  "  user: 'u_an', refresh_token: 'rt_01_geS6O8IJfY', family: 'fam_1',\n" +
  "})));\n" +
  "console.log('every line has at, event, user:', audit.every((l) => l.at && l.event && l.user));\n" +
  "console.log('no plaintext credential anywhere:',\n" +
  "  !JSON.stringify(audit).includes('hunter2') && !JSON.stringify(audit).includes('rt_01_geS6O8IJfY'));\n";

const Q5_SOLUTION =
  "// Deny by default: every path out of this function that is not an explicit\n" +
  "// grant returns a denial, and every denial carries the reason an on-call\n" +
  "// engineer will need at 3am.\n" +
  "function can(userId, permission, resource) {\n" +
  "  if (!resource || typeof resource.tenant !== 'string') return { allow: false, reason: 'no resource' };\n" +
  "\n" +
  "  // The tenant boundary is checked FIRST and separately from the role. A role\n" +
  "  // is only ever meaningful inside the tenant that granted it.\n" +
  "  const m = memberships.find((x) => x.user === userId && x.tenant === resource.tenant);\n" +
  "  if (!m) return { allow: false, reason: 'not a member of this tenant' };\n" +
  "\n" +
  "  const grants = ROLE_GRANTS[m.role];\n" +
  "  if (!grants) return { allow: false, reason: `unknown role: ${m.role}` };\n" +
  "\n" +
  "  if (grants.includes(permission)) {\n" +
  "    // A relationship can still narrow a role: an editor may only edit while a\n" +
  "    // document is a draft, and only a draft they own.\n" +
  "    if (permission === 'document:update' && m.role === 'editor') {\n" +
  "      if (resource.owner !== userId) return { allow: false, reason: 'editor may only update own documents' };\n" +
  "      if (resource.state !== 'draft') return { allow: false, reason: 'document is published' };\n" +
  "    }\n" +
  "    return { allow: true, reason: `${m.role} in ${m.tenant}` };\n" +
  "  }\n" +
  "  // A relationship can also widen: the owner of a draft may read it whatever\n" +
  "  // the role table says.\n" +
  "  if (permission === 'document:read' && resource.owner === userId) {\n" +
  "    return { allow: true, reason: 'owner' };\n" +
  "  }\n" +
  "  return { allow: false, reason: `role ${m.role} lacks ${permission}` };\n" +
  "}\n" +
  "\n" +
  "function recordAttempt(account, ip, ok) {\n" +
  "  attempts.push({ at: now(), account, ip, ok });\n" +
  "}\n" +
  "\n" +
  "function throttle(account, ip) {\n" +
  "  const since = now() - RATE.window;\n" +
  "  const recent = attempts.filter((a) => a.at > since && !a.ok);\n" +
  "  const byAccount = recent.filter((a) => a.account === account).length;\n" +
  "  const byIp = recent.filter((a) => a.ip === ip).length;\n" +
  "  // Two counters, because they stop two different attacks. Per-IP alone lets a\n" +
  "  // botnet spread one guess per address across a million accounts; per-account\n" +
  "  // alone lets anyone lock a named user out on purpose.\n" +
  "  if (byAccount >= RATE.perAccount) return { allow: false, reason: 'account throttled', retryAfter: RATE.lockout };\n" +
  "  if (byIp >= RATE.perIp) return { allow: false, reason: 'ip throttled', retryAfter: RATE.window };\n" +
  "  return { allow: true, byAccount, byIp };\n" +
  "}\n" +
  "\n" +
  "const REDACT = new Set(['password', 'token', 'refresh_token', 'code', 'otp', 'authorization', 'cookie']);\n" +
  "\n" +
  "function auditLine(event, fields) {\n" +
  "  const out = { at: now(), event };\n" +
  "  for (const [k, v] of Object.entries(fields)) {\n" +
  "    if (REDACT.has(k)) {\n" +
  "      // Never the value. A fingerprint is enough to correlate two log lines\n" +
  "      // and useless to anyone who steals the log.\n" +
  "      out[k] = `sha256:${crypto.createHash('sha256').update(String(v)).digest('hex').slice(0, 8)}`;\n" +
  "    } else {\n" +
  "      out[k] = v;\n" +
  "    }\n" +
  "  }\n" +
  "  audit.push(out);\n" +
  "  return out;\n" +
  "}\n";

const Q5_OUTPUT =
  "== authorization ==\n" +
  "u_an    document:delete   d1  ALLOW  admin in t_acme\n" +
  "u_an    document:delete   d3  DENY   not a member of this tenant\n" +
  "u_binh  document:update   d1  ALLOW  editor in t_acme\n" +
  "u_binh  document:update   d2  DENY   editor may only update own documents\n" +
  "u_chi   document:update   d2  DENY   role viewer lacks document:update\n" +
  "u_chi   document:read     d2  ALLOW  viewer in t_acme\n" +
  "u_binh  document:update   d3  DENY   role viewer lacks document:update\n" +
  "u_binh  document:read     d3  ALLOW  viewer in t_globex\n" +
  "u_dung  document:read     d1  DENY   not a member of this tenant\n" +
  "u_an    document:read     (no resource)  no resource\n" +
  "== rate limiting ==\n" +
  "an@example.com from 203.0.113.9: fail (account=0 ip=0)\n" +
  "an@example.com from 203.0.113.9: fail (account=1 ip=1)\n" +
  "an@example.com from 203.0.113.9: fail (account=2 ip=2)\n" +
  "an@example.com from 203.0.113.9: fail (account=3 ip=3)\n" +
  "an@example.com from 203.0.113.9: fail (account=4 ip=4)\n" +
  "an@example.com from 203.0.113.9: BLOCKED account throttled retryAfter=900\n" +
  "binh@example.com from 203.0.113.9: fail (account=0 ip=5)\n" +
  "-- the botnet: one guess each, eleven accounts, eleven addresses --\n" +
  "user0@example.com from 198.51.100.0: fail (account=0 ip=0)\n" +
  "user1@example.com from 198.51.100.1: fail (account=0 ip=0)\n" +
  "user2@example.com from 198.51.100.2: fail (account=0 ip=0)\n" +
  "user3@example.com from 198.51.100.3: fail (account=0 ip=0)\n" +
  "user4@example.com from 198.51.100.4: fail (account=0 ip=0)\n" +
  "user5@example.com from 198.51.100.5: fail (account=0 ip=0)\n" +
  "user6@example.com from 198.51.100.6: fail (account=0 ip=0)\n" +
  "user7@example.com from 198.51.100.7: fail (account=0 ip=0)\n" +
  "user8@example.com from 198.51.100.8: fail (account=0 ip=0)\n" +
  "user9@example.com from 198.51.100.9: fail (account=0 ip=0)\n" +
  "user10@example.com from 198.51.100.10: fail (account=0 ip=0)\n" +
  "-- after the window --\n" +
  "an@example.com from 203.0.113.9: ok (account=0 ip=0)\n" +
  "== audit log ==\n" +
  "{\"at\":1800000061,\"event\":\"login.failed\",\"user\":\"u_an\",\"ip\":\"203.0.113.9\",\"password\":\"sha256:f52fbd32\",\"reason\":\"bad password\"}\n" +
  "{\"at\":1800000061,\"event\":\"token.refreshed\",\"user\":\"u_an\",\"refresh_token\":\"sha256:6ba082a0\",\"family\":\"fam_1\"}\n" +
  "every line has at, event, user: true\n" +
  "no plaintext credential anywhere: true\n";

export default {
  course: { slug: 'authentication' },
  exams: [
    {
      kind: 'PE',
      peType: 'CODE',
      code: 'PE',
      source: 'SAMPLE',
      sortOrder: 10,
      title: B(
        'Practical Exam — write the credential layer, then run it',
        'Thi thực hành — viết tầng tín vật, rồi chạy nó',
      ),
      description: B(
        'Five practical questions, submitted as a .zip, written in plain Node with nothing but node:crypto. A password store with a migration path, a JWT verifier written by hand, a session and refresh-token engine with rotation and reuse detection, a TOTP verifier checked against the RFC 6238 vectors plus single-use recovery codes, and an authorization engine with rate limiting and an audit log — chapters 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 and 12.',
        'Năm câu thực hành, nộp dưới dạng .zip, viết bằng Node thuần với đúng một thư viện là node:crypto. Một tầng lưu mật khẩu kèm đường chuyển đổi, một bộ kiểm JWT viết tay, một cỗ máy phiên và refresh token có xoay vòng cùng phát hiện tái dùng, một bộ TOTP đối chiếu với các vector của RFC 6238 cộng mã khôi phục dùng một lần, và một bộ máy phân quyền kèm giới hạn tần suất cùng nhật ký kiểm toán — các chương 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 và 12.',
      ),
      durationMinutes: 120,
      totalPoints: 10,
      passMark: 4,
      isPublished: true,
      instructions: INSTRUCTIONS,
      questions: [
        /* ── Q1 · chương 1, 2 ─────────────────────────────────────── */
        codeQ({
          points: 2,
          language: 'javascript',
          prompt: B(
            '<p><b>Q1 — A password store you can still upgrade in three years (chapters 1 and 2).</b> The starter block gives you a <code>kdf()</code> wrapper around ' + c('crypto.scryptSync') + ' that counts its own calls, the current parameters ' + c('PARAMS = { N: 16384, r: 8, p: 1 }') + ', three fixed salts, and a user table caught mid-migration: one row in the current format, one still holding a bare ' + c('$sha256$') + ' digest from 2015, and one in the right algorithm with parameters that are now too weak.</p>' +
            '<p>Write four functions:</p>' +
            '<ul>' +
            '<li><b><code>hashPassword(password, saltHex)</code></b> returning a self-describing string ' + c('$scrypt$N=16384,r=8,p=1$<salt>$<hash>') + ', both fields base64url. The parameters live <em>inside</em> the string, because that is what makes the next upgrade possible without a second column.</li>' +
            '<li><b><code>verifyPassword(password, stored)</code></b>, which understands both formats, and returns <code>false</code> — never throws — on anything malformed. Note that ' + c('crypto.timingSafeEqual') + ' throws ' + c('ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH') + ' when the two buffers differ in length, so the length has to be settled before the comparison, not by it.</li>' +
            '<li><b><code>needsRehash(stored)</code></b>, true for the legacy format and for any parameter below <code>PARAMS</code>.</li>' +
            '<li><b><code>login(email, password, saltHex)</code></b> returning ' + c('{ ok, message, rehashed }') + '. On success with an outdated hash it re-stores the password in the current format — the only moment you hold the plaintext. Both failure branches return the identical message.</li>' +
            '</ul>' +
            '<p>The harness prints <code>kdf</code> per attempt, and that number is the question. A login for an address with no account must cost the same KDF work as a login with the wrong password: equal messages and equal status codes close the wording leak, and the clock reopens it. Verify against a dummy hash rather than returning early.</p>',

            '<p><b>Câu 1 — Một tầng lưu mật khẩu ba năm nữa vẫn nâng cấp được (chương 1 và 2).</b> Khối mã cho sẵn đưa bạn một hàm bọc <code>kdf()</code> quanh ' + c('crypto.scryptSync') + ' tự đếm số lần được gọi, bộ tham số hiện hành ' + c('PARAMS = { N: 16384, r: 8, p: 1 }') + ', ba muối cố định, và một bảng người dùng đang dở cuộc chuyển đổi: một dòng đúng định dạng hiện tại, một dòng còn giữ chuỗi ' + c('$sha256$') + ' trần từ năm 2015, và một dòng đúng thuật toán nhưng tham số nay đã quá yếu.</p>' +
            '<p>Hãy viết bốn hàm:</p>' +
            '<ul>' +
            '<li><b><code>hashPassword(password, saltHex)</code></b> trả về một chuỗi tự mô tả ' + c('$scrypt$N=16384,r=8,p=1$<salt>$<hash>') + ', cả hai trường ở dạng base64url. Tham số nằm BÊN TRONG chuỗi, vì chính điều đó khiến lần nâng cấp sau không cần thêm một cột nào.</li>' +
            '<li><b><code>verifyPassword(password, stored)</code></b> hiểu được cả hai định dạng, và trả về <code>false</code> — không bao giờ ném — với mọi đầu vào méo mó. Nhớ rằng ' + c('crypto.timingSafeEqual') + ' NÉM ' + c('ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH') + ' khi hai buffer lệch độ dài, nên độ dài phải được giải quyết TRƯỚC phép so sánh chứ không phải bởi nó.</li>' +
            '<li><b><code>needsRehash(stored)</code></b> đúng với định dạng cũ và với mọi tham số thấp hơn <code>PARAMS</code>.</li>' +
            '<li><b><code>login(email, password, saltHex)</code></b> trả về ' + c('{ ok, message, rehashed }') + '. Đăng nhập thành công mà băm đã lỗi thời thì cất lại mật khẩu theo định dạng hiện hành — đó là khoảnh khắc duy nhất bạn cầm bản rõ. Cả hai nhánh hỏng trả về đúng cùng một thông điệp.</li>' +
            '</ul>' +
            '<p>Khung chạy in ra số <code>kdf</code> của từng lượt, và chính con số đó là câu hỏi. Một lượt đăng nhập vào địa chỉ KHÔNG có tài khoản phải tốn đúng bằng lượng công KDF của một lượt sai mật khẩu: thông điệp giống nhau và mã trạng thái giống nhau bịt được chỗ rò ở câu chữ, còn cái đồng hồ thì mở nó ra lại. Hãy đối chiếu với một băm giả thay vì thoát sớm.</p>',
          ),
          starterCode: Q1_STARTER,
          expectedOutput: Q1_OUTPUT,
          sampleSolution: Q1_SOLUTION,
          rubric: rubric([
            ['format',
              'A self-describing <code>$scrypt$N=…,r=…,p=…$salt$hash</code> string that <code>verifyPassword</code> parses back, so nothing but that one column is needed to verify a row.',
              'Một chuỗi tự mô tả <code>$scrypt$N=…,r=…,p=…$salt$hash</code> mà <code>verifyPassword</code> phân tích ngược lại được, nên không cần gì ngoài đúng một cột đó để kiểm một dòng.',
              0.4],
            ['constanttime',
              'The digests are compared with <code>timingSafeEqual</code> and never with <code>===</code>, with the length settled first so a length mismatch returns false instead of throwing.',
              'Hai chuỗi băm so bằng <code>timingSafeEqual</code> chứ không bao giờ bằng <code>===</code>, và độ dài được giải quyết trước để lệch độ dài trả về false thay vì ném lỗi.',
              0.4],
            ['uniform',
              'Unknown account and wrong password produce the same message and the same number of KDF calls — the dummy hash is computed on the no-account path.',
              'Không có tài khoản và sai mật khẩu cho cùng một thông điệp và cùng một số lần gọi KDF — băm giả được tính trên nhánh không có tài khoản.',
              0.5],
            ['migration',
              '<code>needsRehash</code> catches both the legacy scheme and under-strength parameters, and a successful login re-stores the password in the current format.',
              '<code>needsRehash</code> bắt được cả lược đồ cũ lẫn tham số dưới chuẩn, và một lượt đăng nhập thành công cất lại mật khẩu theo định dạng hiện hành.',
              0.4],
            ['robust',
              'Every malformed stored value — empty, unparseable, wrong field count, non-numeric parameters — returns false rather than throwing, and the KDF work is never skipped as a shortcut.',
              'Mọi giá trị lưu trữ méo mó — rỗng, không phân tích được, sai số trường, tham số không phải số — đều trả về false chứ không ném, và phần việc KDF không bao giờ bị bỏ qua để đi tắt.',
              0.3],
          ]),
        }),

        /* ── Q2 · chương 4, 8 ─────────────────────────────────────── */
        codeQ({
          points: 2,
          language: 'javascript',
          prompt: B(
            '<p><b>Q2 — A JWT verifier, written by hand (chapters 4 and 8).</b> The starter block mints eleven access tokens and six ID tokens against three different HMAC keys. Several are correct. The rest are the attacks: ' + c('alg: "none"') + ', a header claiming <code>HS512</code>, a token signed with another service\'s key, a token whose payload segment was swapped after signing, an expired one, one that is not valid yet, one with no <code>exp</code> at all, a wrong issuer, a wrong audience, and one that is only two segments long.</p>' +
            '<p>Write <code>verifyAccessToken(token)</code> and <code>verifyIdToken(token, expectedNonce)</code>. Both return ' + c('{ ok: true, claims }') + ' or ' + c('{ ok: false, reason }') + ', and the reason strings are fixed by the expected output: <code>malformed</code>, <code>alg not allowed</code>, <code>bad signature</code>, <code>no sub</code>, <code>no exp</code>, <code>expired</code>, <code>not yet valid</code>, <code>wrong issuer</code>, <code>wrong audience</code>, <code>azp mismatch</code>, <code>nonce mismatch</code>.</p>' +
            '<p>Three things decide this question:</p>' +
            '<ul>' +
            '<li><b>The algorithm comes from your configuration, not from the token.</b> One line, and it closes both ' + c('alg: "none"') + ' and every substitution at once. A denylist of <code>none</code> does not, because <code>None</code> and <code>nOnE</code> exist.</li>' +
            '<li><b>Nothing is trusted before the signature.</b> Decode the header to pick the algorithm, verify, and only then parse the claims. A verifier that reads <code>sub</code> "just for the log line" before checking the signature is reading attacker-supplied JSON.</li>' +
            '<li><b>An ID token needs three checks an access token does not:</b> the <code>nonce</code> must equal the one you stored for this flow, an absent <code>nonce</code> is a failure rather than a pass, and when <code>aud</code> holds more than one value, <code>azp</code> must name you explicitly.</li>' +
            '</ul>' +
            '<p>Compare signatures with ' + c('crypto.timingSafeEqual') + ', not with a string comparison. Reject the ' + c('exp') + '-less token: a bearer credential with no expiry is not a token, it is a password you cannot change.</p>',

            '<p><b>Câu 2 — Một bộ kiểm JWT viết tay (chương 4 và 8).</b> Khối mã cho sẵn đúc mười một access token và sáu ID token bằng ba khoá HMAC khác nhau. Vài cái là hợp lệ. Số còn lại là các cú tấn công: ' + c('alg: "none"') + ', một header khai <code>HS512</code>, một token ký bằng khoá của dịch vụ khác, một token bị tráo đoạn payload sau khi ký, một cái đã hết hạn, một cái chưa tới lúc dùng, một cái không có <code>exp</code>, một cái sai issuer, một cái sai audience, và một cái chỉ có hai đoạn.</p>' +
            '<p>Hãy viết <code>verifyAccessToken(token)</code> và <code>verifyIdToken(token, expectedNonce)</code>. Cả hai trả về ' + c('{ ok: true, claims }') + ' hoặc ' + c('{ ok: false, reason }') + ', và các chuỗi lý do đã bị khối kết quả mong đợi chốt cứng: <code>malformed</code>, <code>alg not allowed</code>, <code>bad signature</code>, <code>no sub</code>, <code>no exp</code>, <code>expired</code>, <code>not yet valid</code>, <code>wrong issuer</code>, <code>wrong audience</code>, <code>azp mismatch</code>, <code>nonce mismatch</code>.</p>' +
            '<p>Ba thứ quyết định câu này:</p>' +
            '<ul>' +
            '<li><b>Thuật toán đến từ CẤU HÌNH của bạn, không đến từ token.</b> Một dòng, và nó đóng cả ' + c('alg: "none"') + ' lẫn mọi cú thay thế cùng lúc. Một danh sách đen chặn chữ <code>none</code> thì không, vì còn có <code>None</code> và <code>nOnE</code>.</li>' +
            '<li><b>Không tin gì trước chữ ký.</b> Giải mã header để chọn thuật toán, kiểm chữ ký, rồi mới phân tích các claim. Một bộ kiểm đọc <code>sub</code> "chỉ để ghi một dòng log" trước khi kiểm chữ ký là đang đọc JSON do kẻ tấn công đưa vào.</li>' +
            '<li><b>ID token cần ba phép kiểm mà access token không cần:</b> <code>nonce</code> phải khớp cái bạn đã cất cho lượt này, thiếu <code>nonce</code> là HỎNG chứ không phải qua, và khi <code>aud</code> mang nhiều hơn một giá trị thì <code>azp</code> phải gọi đích danh bạn.</li>' +
            '</ul>' +
            '<p>So chữ ký bằng ' + c('crypto.timingSafeEqual') + ', đừng so bằng phép so chuỗi. Và hãy từ chối cái token không có ' + c('exp') + ': một tín vật mang theo mà không có hạn thì không phải token, nó là một cái mật khẩu bạn không đổi được.</p>',
          ),
          starterCode: Q2_STARTER,
          expectedOutput: Q2_OUTPUT,
          sampleSolution: Q2_SOLUTION,
          rubric: rubric([
            ['algpin',
              'The accepted algorithm is a fixed value in the verifier, so <code>alg: "none"</code> and <code>HS512</code> are both rejected as <code>alg not allowed</code> without any special case for either.',
              'Thuật toán được chấp nhận là một giá trị cố định trong bộ kiểm, nên <code>alg: "none"</code> và <code>HS512</code> đều bị từ chối là <code>alg not allowed</code> mà không cần ca riêng cho cái nào.',
              0.5],
            ['signature',
              'The signature is recomputed over the exact <code>header.payload</code> bytes as received and compared with <code>timingSafeEqual</code>; no claim is read before it passes.',
              'Chữ ký được tính lại trên đúng dãy byte <code>header.payload</code> như nhận được và so bằng <code>timingSafeEqual</code>; không claim nào được đọc trước khi nó qua.',
              0.4],
            ['claims',
              '<code>exp</code>, <code>nbf</code>, <code>iat</code>, <code>iss</code>, <code>aud</code> and <code>sub</code> are each checked, a missing <code>exp</code> is a rejection, and each failure reports its own reason.',
              '<code>exp</code>, <code>nbf</code>, <code>iat</code>, <code>iss</code>, <code>aud</code> và <code>sub</code> đều được kiểm, thiếu <code>exp</code> là từ chối, và mỗi ca hỏng báo đúng lý do của nó.',
              0.5],
            ['idtoken',
              'The ID token path additionally requires the stored <code>nonce</code> and, whenever <code>aud</code> is an array, an <code>azp</code> naming this client.',
              'Nhánh ID token còn đòi thêm <code>nonce</code> đã cất, và bất cứ khi nào <code>aud</code> là một mảng thì đòi <code>azp</code> gọi đích danh client này.',
              0.4],
            ['parsing',
              'A token with the wrong number of segments, or whose header or payload is not a JSON object, returns <code>malformed</code> rather than throwing.',
              'Một token sai số đoạn, hoặc có header hay payload không phải một đối tượng JSON, trả về <code>malformed</code> chứ không ném lỗi.',
              0.2],
          ]),
        }),

        /* ── Q3 · chương 3, 5, 6 ──────────────────────────────────── */
        codeQ({
          points: 2,
          language: 'javascript',
          prompt: B(
            '<p><b>Q3 — Rotation, reuse detection, and the race that looks exactly like a thief (chapters 3, 5 and 6).</b> The starter block gives you a fake clock, a deterministic token source, three empty tables and two constants: a 30-day absolute lifetime and a 10-second grace window.</p>' +
            '<p>Write <code>startSession</code>, <code>refresh</code>, <code>revokeFamily</code>, <code>endAllSessions</code>, <code>createReset</code> and <code>useReset</code>. The rules:</p>' +
            '<ul>' +
            '<li><b>Only hashes are stored.</b> The raw token is returned once and never written down. The harness asserts that no key in the table looks like a token.</li>' +
            '<li><b>Every refresh rotates.</b> The old token is marked used, a new one is issued into the <em>same family</em>, and the absolute expiry does not move — rotation must not become sliding expiry.</li>' +
            '<li><b>A token presented twice is two people holding it.</b> Past the grace window, revoke the entire family, not just that token: you cannot tell which of the two is the thief, and revoking only one leaves whichever it was still logged in.</li>' +
            '<li><b>Inside the grace window it is a dropped reply, not a theft.</b> A client whose refresh response never arrived retries with a token that is already used. Hand back the same successor it was issued, and say so. Ten seconds is deliberately short: for those ten seconds a real thief also gets a working session with no alarm, so the window is a weakening you are choosing on purpose.</li>' +
            '<li><b>A password reset ends everything.</b> The reset token is single use, expires in fifteen minutes, and "never existed" and "already spent" must answer identically. Redeeming it revokes every family the user has.</li>' +
            '</ul>' +
            '<p>The harness runs the whole story: two clean rotations, a replay three seconds later, the same replay ten minutes later, a second user with two devices, and a reset used twice. Read the expected output before you write anything — it is the specification.</p>',

            '<p><b>Câu 3 — Xoay vòng, phát hiện tái dùng, và cuộc đua trông y hệt một tên trộm (chương 3, 5 và 6).</b> Khối mã cho sẵn đưa bạn một đồng hồ giả, một nguồn token tất định, ba cái bảng rỗng và hai hằng số: hạn tuyệt đối 30 ngày và cửa sổ ân hạn 10 giây.</p>' +
            '<p>Hãy viết <code>startSession</code>, <code>refresh</code>, <code>revokeFamily</code>, <code>endAllSessions</code>, <code>createReset</code> và <code>useReset</code>. Các luật:</p>' +
            '<ul>' +
            '<li><b>Chỉ băm được lưu.</b> Token trần trả về đúng một lần và không bao giờ được ghi xuống. Khung chạy khẳng định rằng không khoá nào trong bảng trông giống một cái token.</li>' +
            '<li><b>Mỗi lượt refresh đều xoay.</b> Token cũ bị đánh dấu đã dùng, một cái mới được cấp vào CÙNG MỘT HỌ, và hạn tuyệt đối không nhúc nhích — xoay vòng không được biến thành hạn trượt.</li>' +
            '<li><b>Một token xuất hiện hai lần là hai người cùng cầm nó.</b> Quá cửa sổ ân hạn thì thu hồi CẢ HỌ chứ không riêng cái token đó: bạn không phân biệt được ai trong hai người là kẻ trộm, và thu hồi mỗi một cái thì kẻ đó vẫn còn đăng nhập.</li>' +
            '<li><b>Bên trong cửa sổ ân hạn thì đó là một câu trả lời bị rớt, không phải một vụ trộm.</b> Một client không nhận được phản hồi refresh của chính mình sẽ thử lại bằng cái token đã dùng. Hãy trả lại đúng cái kế nhiệm đã cấp, và nói rõ điều đó. Mười giây là ngắn có chủ đích: trong mười giây ấy một tên trộm thật cũng nhận được một phiên chạy được mà không có chuông nào kêu, nên cửa sổ này là một chỗ làm yếu đi mà bạn cố ý chọn.</li>' +
            '<li><b>Đặt lại mật khẩu là chấm dứt tất cả.</b> Token đặt lại dùng một lần, hết hạn sau mười lăm phút, và "chưa từng tồn tại" với "đã tiêu rồi" phải trả lời y như nhau. Dùng nó là thu hồi mọi họ token của người đó.</li>' +
            '</ul>' +
            '<p>Khung chạy diễn lại cả câu chuyện: hai lượt xoay sạch sẽ, một lượt phát lại sau ba giây, đúng lượt phát lại đó sau mười phút, một người dùng thứ hai với hai thiết bị, và một token đặt lại bị dùng hai lần. Hãy đọc khối kết quả mong đợi trước khi viết một dòng nào — nó chính là bản đặc tả.</p>',
          ),
          starterCode: Q3_STARTER,
          expectedOutput: Q3_OUTPUT,
          sampleSolution: Q3_SOLUTION,
          rubric: rubric([
            ['hashed',
              'Refresh tokens and reset tokens are stored only as hashes, keyed by the hash, and the raw value is returned exactly once.',
              'Refresh token và token đặt lại chỉ được lưu dưới dạng băm, đánh khoá theo băm, và giá trị trần trả về đúng một lần.',
              0.3],
            ['rotation',
              'Each refresh marks the old token used, issues a successor in the same family, and leaves the absolute expiry where it was.',
              'Mỗi lượt refresh đánh dấu token cũ đã dùng, cấp một cái kế nhiệm trong cùng họ, và để nguyên hạn tuyệt đối ở chỗ cũ.',
              0.4],
            ['reuse',
              'A used token presented after the grace window revokes the whole family, and the legitimate current token is refused afterwards with the family\'s recorded reason.',
              'Một token đã dùng xuất hiện sau cửa sổ ân hạn làm thu hồi cả họ, và token chính đáng đang sống sau đó cũng bị từ chối kèm đúng lý do đã ghi của họ.',
              0.5],
            ['grace',
              'Inside the grace window the same successor is returned instead of a revocation, so a dropped response does not end a session that nobody attacked.',
              'Bên trong cửa sổ ân hạn thì trả lại đúng cái kế nhiệm cũ thay vì thu hồi, nên một phản hồi bị rớt không chấm dứt một phiên mà không ai tấn công.',
              0.4],
            ['lifecycle',
              'The reset token is single use and time limited, "unknown" and "already used" answer identically, and redeeming it ends every family the user has.',
              'Token đặt lại dùng một lần và có hạn, "không biết" và "đã dùng rồi" trả lời y như nhau, và dùng nó là chấm dứt mọi họ token của người đó.',
              0.4],
          ]),
        }),

        /* ── Q4 · chương 7 ────────────────────────────────────────── */
        codeQ({
          points: 2,
          language: 'javascript',
          prompt: B(
            '<p><b>Q4 — TOTP from the inside, and the recovery codes beside it (chapter 7).</b> Write <code>base32Decode</code>, <code>hotp</code>, <code>totp</code>, <code>verifyTotp</code> and <code>useRecoveryCode</code> against the constants in the starter block: the standard base32 alphabet, a 30-second step, six digits, a drift window of one step either side.</p>' +
            '<p>The first thing the harness does is decode <code>GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ</code> and print the six <b>RFC 6238 Appendix B</b> values at eight digits. Those numbers are published, so this half of the question has one right answer and you can check it yourself before submitting. Get the pieces exactly right: the counter is <b>eight bytes, big-endian</b>; the MAC is <b>HMAC-SHA1</b> (SHA-1 is broken for collisions, which HOTP does not rely on, and almost no authenticator app implements anything else); the offset is the <b>low nibble of the last byte</b>; and the top bit of the first selected byte is masked off before the four bytes become a 31-bit number.</p>' +
            '<p>Then <code>verifyTotp</code>, which has to do three things a naive version does not:</p>' +
            '<ul>' +
            '<li><b>Return the step, not a boolean.</b> A boolean makes replay impossible to prevent, and replay is the attack that actually happens: a code stays valid for up to ninety seconds, which is plenty of time to read it over someone\'s shoulder or off a phishing page. A matching step must be strictly greater than the last one accepted.</li>' +
            '<li><b>Walk the whole window.</b> Do not stop at the first match — the loop\'s running time should not depend on which step matched.</li>' +
            '<li><b>Reject malformed input before touching the key.</b> Five digits and letters both come back <code>malformed</code>, and ' + c('crypto.timingSafeEqual') + ' would throw on the length difference anyway.</li>' +
            '</ul>' +
            '<p><code>useRecoveryCode</code> compares against stored SHA-256 hashes, is case-insensitive and tolerant of surrounding whitespace, marks a code used rather than accepting it twice, and reports how many are left. A recovery code is a complete bypass of the factor it replaces, so it gets the same care.</p>',

            '<p><b>Câu 4 — Mổ TOTP từ bên trong, và mấy cái mã khôi phục nằm cạnh nó (chương 7).</b> Hãy viết <code>base32Decode</code>, <code>hotp</code>, <code>totp</code>, <code>verifyTotp</code> và <code>useRecoveryCode</code> dựa trên các hằng số trong khối mã cho sẵn: bảng chữ base32 chuẩn, bước 30 giây, sáu chữ số, cửa sổ trôi một bước mỗi bên.</p>' +
            '<p>Việc đầu tiên khung chạy làm là giải mã <code>GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ</code> rồi in sáu giá trị của <b>RFC 6238 Phụ lục B</b> ở dạng tám chữ số. Sáu con số đó đã được công bố, nên nửa này của câu hỏi có đúng một đáp án và bạn tự kiểm được trước khi nộp. Hãy làm đúng từng mảnh: bộ đếm là <b>tám byte, big-endian</b>; MAC là <b>HMAC-SHA1</b> (SHA-1 vỡ ở tính kháng va chạm, thứ mà HOTP không dựa vào, và gần như không app xác thực nào cài thứ khác); độ lệch là <b>bốn bit thấp của byte cuối</b>; và bit cao nhất của byte đầu tiên được chọn bị che đi trước khi bốn byte thành một số 31 bit.</p>' +
            '<p>Rồi tới <code>verifyTotp</code>, thứ phải làm ba việc mà bản ngây thơ không làm:</p>' +
            '<ul>' +
            '<li><b>Trả về số BƯỚC, không phải một giá trị đúng-sai.</b> Trả về đúng-sai làm cho việc chống phát lại thành bất khả, mà phát lại mới là cú tấn công thật sự xảy ra: một mã sống được tới chín mươi giây, thừa thời gian để ai đó đọc trộm qua vai hoặc lấy từ một trang lừa đảo. Bước khớp phải LỚN HƠN HẲN bước được chấp nhận lần trước.</li>' +
            '<li><b>Đi hết cửa sổ.</b> Đừng dừng ở lần khớp đầu tiên — thời gian chạy của vòng lặp không nên phụ thuộc vào việc bước nào đã khớp.</li>' +
            '<li><b>Từ chối đầu vào méo mó trước khi chạm vào khoá.</b> Năm chữ số và chữ cái đều trả về <code>malformed</code>, mà dù sao ' + c('crypto.timingSafeEqual') + ' cũng sẽ ném lỗi vì lệch độ dài.</li>' +
            '</ul>' +
            '<p><code>useRecoveryCode</code> đối chiếu với các băm SHA-256 đã lưu, không phân biệt hoa thường và chịu được khoảng trắng thừa hai đầu, đánh dấu một mã đã dùng thay vì nhận nó hai lần, và báo còn lại bao nhiêu cái. Một mã khôi phục là một đường vòng qua trọn vẹn cái yếu tố mà nó thay thế, nên nó được chăm sóc y như vậy.</p>',
          ),
          starterCode: Q4_STARTER,
          expectedOutput: Q4_OUTPUT,
          sampleSolution: Q4_SOLUTION,
          rubric: rubric([
            ['rfc',
              'All six RFC 6238 Appendix B values reproduce exactly, which means the counter encoding, HMAC-SHA1, dynamic truncation and the modulo are each right.',
              'Cả sáu giá trị của RFC 6238 Phụ lục B tái hiện chính xác, tức là cách mã hoá bộ đếm, HMAC-SHA1, phép cắt động và phép chia lấy dư đều đúng.',
              0.5],
            ['base32',
              '<code>base32Decode</code> handles the alphabet, is case-insensitive, strips padding, and yields the 20 bytes the vectors need.',
              '<code>base32Decode</code> xử lý đúng bảng chữ, không phân biệt hoa thường, bỏ phần đệm, và cho ra đúng 20 byte mà các vector cần.',
              0.3],
            ['replay',
              'The verifier returns the matching step and the caller records it, so a correct code cannot be accepted twice and an earlier step inside the window is refused.',
              'Bộ kiểm trả về số bước đã khớp và bên gọi ghi lại nó, nên một mã đúng không thể được nhận hai lần và một bước sớm hơn nằm trong cửa sổ bị từ chối.',
              0.5],
            ['window',
              'Exactly one step either side is accepted, the loop does not exit early on a match, and the comparison is constant time.',
              'Đúng một bước mỗi bên được chấp nhận, vòng lặp không thoát sớm khi khớp, và phép so sánh chạy hằng thời gian.',
              0.4],
            ['recovery',
              'Recovery codes are matched against stored hashes, normalised for case and whitespace, single use, and the remaining count is reported.',
              'Mã khôi phục đối chiếu với băm đã lưu, chuẩn hoá hoa thường và khoảng trắng, dùng một lần, và số mã còn lại được báo ra.',
              0.3],
          ]),
        }),

        /* ── Q5 · chương 9, 10, 11, 12 ────────────────────────────── */
        codeQ({
          points: 2,
          language: 'javascript',
          prompt: B(
            '<p><b>Q5 — Deny by default, count on the right axis, and write down who did it (chapters 9, 10, 11 and 12).</b> The starter block holds four membership rows across two tenants, three documents, a role-to-permission map, and rate-limit settings of five failures per account and ten per IP in a sixty-second window.</p>' +
            '<p>Write <code>can</code>, <code>throttle</code>, <code>recordAttempt</code> and <code>auditLine</code>.</p>' +
            '<ul>' +
            '<li><b><code>can(userId, permission, resource)</code></b> returns ' + c('{ allow, reason }') + ' and denies by default — every path out of it that is not an explicit grant is a denial, and every denial carries the reason an on-call engineer will need at three in the morning. The <b>tenant boundary is checked first and separately from the role</b>, because a role only means anything inside the tenant that granted it: an admin of one tenant is nobody in another. A relationship then narrows the role (an editor may update only their own document, and only while it is a draft) and can also widen it (the owner of a document may read it whatever the role table says).</li>' +
            '<li><b><code>throttle(account, ip)</code></b> counts <em>recent failures</em> along two axes at once. Per-IP alone is the wrong axis for a login: an attacker rotates addresses far more cheaply than they rotate the account they are aiming at, so an IP limit is measuring the one thing they control, while punishing the office and the carrier NAT where two hundred real users share one address. Per-account alone lets anybody lock out a named user on purpose. The harness proves both halves: six attempts on one account from one address, then eleven accounts from eleven addresses.</li>' +
            '<li><b><code>auditLine(event, fields)</code></b> records who did it, to what, from where, and what happened — and never the credential. Fields named <code>password</code>, <code>token</code>, <code>refresh_token</code>, <code>code</code>, <code>otp</code>, <code>authorization</code> and <code>cookie</code> are replaced by a short SHA-256 fingerprint: enough to correlate two log lines, useless to whoever steals the log. The harness asserts that no plaintext credential survives anywhere in the log.</li>' +
            '</ul>' +
            '<p>Note what the harness asks of <code>can</code> with a null resource. An unexpected input is exactly the case where a policy engine must fail closed, and "it threw" is not the same answer as "it denied".</p>',

            '<p><b>Câu 5 — Mặc định từ chối, đếm đúng trục, và ghi lại ai đã làm (chương 9, 10, 11 và 12).</b> Khối mã cho sẵn giữ bốn dòng thành viên trải trên hai tenant, ba tài liệu, một bản đồ vai trò sang quyền, và cấu hình giới hạn tần suất năm lần hỏng mỗi tài khoản và mười lần mỗi địa chỉ IP trong cửa sổ sáu mươi giây.</p>' +
            '<p>Hãy viết <code>can</code>, <code>throttle</code>, <code>recordAttempt</code> và <code>auditLine</code>.</p>' +
            '<ul>' +
            '<li><b><code>can(userId, permission, resource)</code></b> trả về ' + c('{ allow, reason }') + ' và MẶC ĐỊNH TỪ CHỐI — mọi đường ra khỏi nó mà không phải một lời cấp phép tường minh đều là một lời từ chối, và mỗi lời từ chối mang theo cái lý do mà người trực ba giờ sáng sẽ cần. <b>Ranh giới tenant được kiểm TRƯỚC và TÁCH RỜI khỏi vai trò</b>, vì một vai trò chỉ có nghĩa bên trong đúng cái tenant đã cấp nó: quản trị viên của tenant này là người dưng ở tenant kia. Sau đó quan hệ THU HẸP vai trò lại (một biên tập viên chỉ sửa được tài liệu của chính mình, và chỉ khi nó còn là bản nháp) và cũng có thể NỚI nó ra (chủ sở hữu một tài liệu đọc được nó bất kể bảng vai trò nói gì).</li>' +
            '<li><b><code>throttle(account, ip)</code></b> đếm SỐ LẦN HỎNG GẦN ĐÂY trên hai trục cùng lúc. Chỉ đếm theo IP là sai trục cho một trang đăng nhập: kẻ tấn công đổi địa chỉ rẻ hơn nhiều so với đổi cái tài khoản nó đang nhắm, nên một hạn mức theo IP là đang đo đúng thứ mà nó điều khiển được, đồng thời phạt oan cái văn phòng và cái NAT của nhà mạng nơi hai trăm người dùng thật dùng chung một địa chỉ. Chỉ đếm theo tài khoản thì ai cũng khoá được một người dùng có tên tuổi một cách cố ý. Khung chạy chứng minh cả hai nửa: sáu lượt vào một tài khoản từ một địa chỉ, rồi mười một tài khoản từ mười một địa chỉ.</li>' +
            '<li><b><code>auditLine(event, fields)</code></b> ghi lại ai đã làm, làm lên cái gì, từ đâu, và kết quả ra sao — và không bao giờ ghi chính cái tín vật. Các trường tên <code>password</code>, <code>token</code>, <code>refresh_token</code>, <code>code</code>, <code>otp</code>, <code>authorization</code> và <code>cookie</code> bị thay bằng một dấu vân tay SHA-256 ngắn: đủ để nối hai dòng log lại với nhau, vô dụng với kẻ lấy trộm cái log. Khung chạy khẳng định rằng không một tín vật dạng trần nào sống sót ở bất kỳ đâu trong nhật ký.</li>' +
            '</ul>' +
            '<p>Hãy để ý khung chạy hỏi <code>can</code> điều gì với một tài nguyên rỗng. Một đầu vào bất ngờ đúng là ca mà một bộ máy chính sách phải HỎNG THEO HƯỚNG ĐÓNG, và "nó ném lỗi" không phải là cùng một câu trả lời với "nó từ chối".</p>',
          ),
          starterCode: Q5_STARTER,
          expectedOutput: Q5_OUTPUT,
          sampleSolution: Q5_SOLUTION,
          rubric: rubric([
            ['denybydefault',
              'Every path out of <code>can</code> that is not an explicit grant returns a denial with a usable reason, including a missing or malformed resource, which denies rather than throwing.',
              'Mọi đường ra khỏi <code>can</code> mà không phải một lời cấp phép tường minh đều trả về một lời từ chối kèm lý do dùng được, kể cả tài nguyên thiếu hay méo mó, thứ bị TỪ CHỐI chứ không làm ném lỗi.',
              0.4],
            ['tenant',
              'Membership in the resource\'s tenant is established before the role is consulted, so a role in one tenant grants nothing in another.',
              'Tư cách thành viên trong tenant của tài nguyên được xác lập TRƯỚC khi tra vai trò, nên một vai trò ở tenant này không cấp gì ở tenant khác.',
              0.4],
            ['relationship',
              'Ownership and document state narrow the editor role and widen read access for an owner, so the decision depends on the relationship to this object rather than the role alone.',
              'Quyền sở hữu và trạng thái tài liệu thu hẹp vai trò biên tập và nới quyền đọc cho chủ sở hữu, nên quyết định phụ thuộc vào quan hệ với chính vật này chứ không riêng vai trò.',
              0.4],
            ['ratelimit',
              'Failures are counted inside the window along both the account and the IP axis, the account cap fires first for a single-target run, and the window expiring lets a legitimate user back in.',
              'Số lần hỏng được đếm trong cửa sổ theo cả trục tài khoản lẫn trục IP, hạn mức tài khoản bật trước trong một đợt nhắm vào một đích, và cửa sổ hết hạn thì người dùng chính đáng vào lại được.',
              0.4],
            ['audit',
              'Every audit line carries the actor, the event and the time, and every credential-bearing field is reduced to a fingerprint so nothing replayable reaches the log.',
              'Mỗi dòng kiểm toán mang theo chủ thể, tên sự kiện và thời điểm, và mọi trường có chứa tín vật đều bị rút xuống thành một dấu vân tay nên không thứ gì phát lại được lọt vào nhật ký.',
              0.4],
          ]),
        }),
      ],
    },
  ],
};
