/** Node.js 8.1 — Lưu mật khẩu: kẻ tấn công có cả bảng, nhanh = hỏng, muối giết bảng cầu vồng, chuỗi bcrypt tự mô tả, bẫy 72 byte, đăng nhập trả lời như nhau (DUMMY_HASH), nâng chi phí lúc đăng nhập. */
import { modul, cs, q, tn, jsBai, goi } from './_node-c6-8.mjs';

/* ── 1. Trắc nghiệm ── */
const E1 = cs({
  ten: '8.1 · 1 — Why almost every way of storing passwords is wrong', kho: 'EASY', phut: 8,
  en: 'Lesson 8.1 is measurements first, opinions second. Six questions on the threat model and the numbers.',
  vi: 'Bài 8.1 là số đo trước, ý kiến sau. Sáu câu hỏi về mô hình mối đe doạ và các con số.',
  cau: [
    q('c1', ['Who is the attacker you design password storage against?', 'Kẻ tấn công mà bạn thiết kế việc lưu mật khẩu để chống là ai?'],
      ['Someone holding a copy of the whole User table, offline, with GPUs', 'Someone guessing passwords one by one on your login form', 'A user who forgot their password and keeps trying old ones', 'Someone sniffing HTTPS traffic on the same coffee-shop Wi-Fi'],
      ['Rate limiting handles the login form (8.4). Storage is about the day the database is copied: a backup, an SQL injection, a stolen laptop.', 'Chặn tần suất lo phần form đăng nhập (8.4). Lưu trữ là chuyện ngày CSDL bị sao chép: bản sao lưu, SQL injection, laptop bị trộm.']),
    q('c2', ['Why is encrypting passwords with AES wrong?', 'Vì sao mã hoá mật khẩu bằng AES là sai?'],
      ['It is reversible, and the key sits next to the table the attacker took', 'AES is far too slow to run on every login request', 'AES cannot encrypt Unicode passwords such as Vietnamese text', 'Encrypted values are longer than a VARCHAR(255) column allows'],
      ['A password is never stored, it is verified.', 'Mật khẩu không bao giờ được lưu, nó được kiểm chứng.']),
    q('c3', ['One laptop core: 1,016,503 SHA-256 per second, 3.1 bcrypt(cost=12) per second. What does that ratio mean?', 'Một nhân laptop: 1.016.503 SHA-256 mỗi giây, 3,1 bcrypt(cost=12) mỗi giây. Tỉ lệ đó nghĩa là gì?'],
      ['Slowness is the job: each offline guess becomes ~328,000× dearer', 'bcrypt is badly implemented in Node and should be avoided', 'SHA-256 is broken today and can be reversed in milliseconds', 'bcrypt only works for passwords shorter than 12 characters'],
      ['The whole 6-digit space: 1.8 s to precompute with SHA-256, 4.2 days per user with bcrypt(12).', 'Toàn bộ không gian 6 chữ số: 1,8 s để tính trước với SHA-256, 4,2 ngày mỗi người với bcrypt(12).']),
    q('c4', ['Why does a per-user salt stop rainbow tables?', 'Vì sao muối riêng cho từng người chặn được bảng cầu vồng?'],
      ['Each user’s hash differs, so one precomputed table cannot be reused', 'The salt encrypts the hash, so the attacker cannot read it', 'The salt makes hashing faster on the server side', 'Salted hashes cannot be copied out of the database'],
      ['Without salt you do not even need to crack: An and Chi share 8d969eef… — same password.', 'Không có muối thì chẳng cần bẻ: An và Chi cùng 8d969eef… — cùng mật khẩu.']),
    q('c5', ['<code>bcrypt.compare(B, hash(A))</code> returned <code>true</code> for two different passwords. Why?', '<code>bcrypt.compare(B, hash(A))</code> trả <code>true</code> cho hai mật khẩu khác nhau. Vì sao?'],
      ['bcrypt only reads the first 72 BYTES; both share them', 'The cost factor was too low', 'bcrypt compares case-insensitively', 'The salt was reused'],
      ['Cap at 72 bytes with an explicit error, or pre-hash with SHA-256 + base64 — or use argon2, which has no such limit.', 'Chặn ở 72 byte kèm lỗi rõ ràng, hoặc băm trước bằng SHA-256 + base64 — hoặc dùng argon2, không có giới hạn đó.']),
    q('c6', ['10 × <code>bcrypt.hashSync</code> in a handler: the 50 ms heartbeat was 2959 ms late. 10 × <code>bcrypt.hash</code>: 1 ms late. Why?', '10 × <code>bcrypt.hashSync</code> trong handler: nhịp tim 50 ms trễ 2959 ms. 10 × <code>bcrypt.hash</code>: trễ 1 ms. Vì sao?'],
      ['hashSync blocks the event loop; hash runs on the libuv thread pool', 'hashSync silently uses a much higher cost factor than hash', 'The async version skips the salt to save a few milliseconds', 'hashSync writes every intermediate round to disk'],
      ['Ten logins at once and the health check times out — the load balancer removes the container.', 'Mười lần đăng nhập cùng lúc và health check hết giờ — bộ cân bằng tải gỡ container ra.']),
  ],
  goiY: [['Always reason from the offline attacker who has the table.', 'Luôn suy luận từ kẻ tấn công ngoại tuyến đang giữ cả bảng.'], ['For password hashing, ask “how many guesses per second does this allow?”.', 'Với băm mật khẩu, hỏi "cái này cho phép đoán bao nhiêu lần mỗi giây?".']],
  loi: [['“SHA-256 cannot be reversed, so it is safe.” The attacker does not reverse it; they hash every guess.', '"SHA-256 không đảo ngược được nên an toàn." Kẻ tấn công không đảo ngược; họ băm từng lần đoán.'], ['Storing salt and cost in separate columns — the bcrypt/argon2 string already contains them.', 'Lưu muối và chi phí ở cột riêng — chuỗi bcrypt/argon2 đã chứa sẵn.']],
  tns: [tn('salt', 'muối', 'Giá trị ngẫu nhiên riêng cho mỗi người.'), tn('rainbow table', 'bảng cầu vồng', 'Bảng băm → mật khẩu tính trước.'), tn('cost factor', 'hệ số chi phí')],
  kn: ['password hashing'],
});

/* ── 2. Bảng bị rò, không muối ── */
function auditLeak(rows, table) {
  // 1) without salt, equal hashes = equal passwords: no cracking needed to see who shares one
  const byHash = new Map();
  for (const r of rows) byHash.set(r.hash, [...(byHash.get(r.hash) || []), r.email]);
  const shared = [...byHash.values()].filter((emails) => emails.length > 1).map((emails) => emails.sort()).sort((a, b) => (a[0] < b[0] ? -1 : 1));
  // 2) a precomputed table (hash -> guess) cracks every unsalted hash by a lookup, ~0.002 ms each
  const cracked = {};
  for (const r of rows) if (Object.prototype.hasOwnProperty.call(table, r.hash)) cracked[r.email] = table[r.hash];
  return { shared, cracked };
}
const H123 = '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92';
const HQW = 'f1d7e9dcf81a76784e1b759815403aa87fd15406746862d1807c8777516f3818';
const ROWS = [{ email: 'an@vd.com', hash: H123 }, { email: 'binh@vd.com', hash: HQW }, { email: 'chi@vd.com', hash: H123 }];
const E2 = jsBai({
  ten: '8.1 · 2 — Write auditLeak(rows, table): what an unsalted leak gives away for free', kho: 'EASY', phut: 10,
  en: `<p>The lesson’s leaked table, unsalted SHA-256. <code>rows = [{ email, hash }]</code>; <code>table</code> is an attacker’s precomputed object <code>{ hash: guess }</code> (the lesson built one for all 1,000,000 six-digit passwords in 1.8 s). Write <code>auditLeak(rows, table)</code> returning <code>{ shared, cracked }</code>:</p>
<ul><li><code>shared</code>: every group of ≥ 2 emails with the same hash — each group sorted alphabetically, groups sorted by their first email.</li>
<li><code>cracked</code>: <code>{ email: password }</code> for every row whose hash is a key of <code>table</code> (own keys only — <code>table</code> may come from anywhere).</li></ul>`,
  vi: `<p>Bảng bị rò của bài, SHA-256 không muối. <code>rows = [{ email, hash }]</code>; <code>table</code> là object tính trước của kẻ tấn công <code>{ hash: guess }</code> (bài dựng một bảng cho toàn bộ 1.000.000 mật khẩu 6 chữ số trong 1,8 s). Viết <code>auditLeak(rows, table)</code> trả <code>{ shared, cracked }</code>:</p>
<ul><li><code>shared</code>: mọi nhóm ≥ 2 email có cùng hash — mỗi nhóm sắp theo bảng chữ cái, các nhóm sắp theo email đầu tiên.</li>
<li><code>cracked</code>: <code>{ email: password }</code> cho mọi dòng có hash là khoá của <code>table</code> (chỉ khoá của chính nó — <code>table</code> có thể đến từ bất cứ đâu).</li></ul>`,
  yc: [['Do not mutate the inputs.', 'Không sửa đầu vào.'], ['Use own-key checks for the table.', 'Kiểm khoá riêng của table.']],
  goiY: [['Group with a <code>Map(hash → [emails])</code>, keep the groups longer than 1.', 'Gom bằng <code>Map(hash → [emails])</code>, giữ các nhóm dài hơn 1.'], ['<code>Object.prototype.hasOwnProperty.call(table, hash)</code> — a row whose “hash” is <code>"constructor"</code> must not crack.', '<code>Object.prototype.hasOwnProperty.call(table, hash)</code> — dòng có "hash" là <code>"constructor"</code> không được bị "bẻ".']],
  loi: [['Thinking an attacker must crack before learning anything — equal hashes already say “same password”.', 'Nghĩ kẻ tấn công phải bẻ mới biết gì đó — hash bằng nhau đã nói "cùng mật khẩu".'], ['<code>if (table[r.hash])</code>: inherited keys of a plain object answer too.', '<code>if (table[r.hash])</code>: khoá thừa kế của object thường cũng trả lời.']],
  gt: ['Both results come straight from the property that makes a fast, unsalted hash useless: it is deterministic and cheap. Determinism groups identical passwords; cheapness lets an attacker precompute every guess once and look each one up in microseconds. A per-user salt breaks the first, a slow function breaks the second.', 'Cả hai kết quả đến thẳng từ tính chất làm hash nhanh, không muối trở nên vô dụng: nó tất định và rẻ. Tất định gom các mật khẩu giống nhau; rẻ cho kẻ tấn công tính trước mọi lần đoán một lần rồi tra mỗi cái trong vài micro giây. Muối riêng phá cái đầu, hàm chậm phá cái sau.'],
  kn: ['password hashing', 'salt'],
  tns: [tn('deterministic', 'tất định', 'Cùng đầu vào luôn ra cùng đầu ra.')],
  dau: `function auditLeak(rows, table) {
  // Write your solution here
  return { shared: [], cracked: {} };
}
`,
  giai: auditLeak,
  cases: [
    { goi: goi('auditLeak', ROWS, { [H123]: '123456' }), moTa: ['The lesson’s three rows', 'Ba dòng của bài'] },
    { goi: goi('auditLeak', [...ROWS, { email: 'dung@vd.com', hash: HQW }, { email: 'em@vd.com', hash: 'aa' }], { [H123]: '123456', [HQW]: 'qwerty', bb: 'x' }), an: true },
    { goi: goi('auditLeak', [{ email: 'z@vd.com', hash: 'constructor' }, { email: 'a@vd.com', hash: 'toString' }], {}), an: true },
    { goi: goi('auditLeak', [{ email: 'c@x', hash: 'h' }, { email: 'a@x', hash: 'h' }, { email: 'b@x', hash: 'g' }, { email: 'aa@x', hash: 'g' }], {}), an: true },
  ],
});

/* ── 3. Chuỗi bcrypt tự mô tả ── */
function parseBcrypt(hash) {
  // $2b$10$ + 22 chars of salt + 31 chars of hash, in bcrypt's own base64 alphabet ./A-Za-z0-9
  const m = /^\$(2[aby])\$(\d{2})\$([./A-Za-z0-9]{22})([./A-Za-z0-9]{31})$/.exec(String(hash));
  if (!m) return null;
  const cost = Number(m[2]);
  if (cost < 4 || cost > 31) return null;            // bcrypt only accepts 4..31
  return { algorithm: m[1], cost, rounds: 2 ** cost, salt: m[3], hash: m[4] };
}
const E3 = jsBai({
  ten: '8.1 · 3 — Write parseBcrypt(hash): read the algorithm, cost and salt out of the stored string', kho: 'EASY', phut: 10,
  en: `<p>“This self-describing format is why you never store the salt or cost in separate columns.” The lesson took this one apart:</p>
<pre>$2b$10$a7vd/4xSVvoK5VKpGGzbD.x4Y05t1q0YIRcs.YQcb4WEtp1sivisK
algorithm $2b$ · cost 10 (2^10 = 1024 rounds) · salt 22 chars · hash 31 chars</pre>
<p>Write <code>parseBcrypt(hash)</code> returning <code>{ algorithm, cost, rounds, salt, hash }</code> — <code>algorithm</code> without dollars (<code>"2b"</code>), <code>cost</code> a number, <code>rounds = 2^cost</code> — or <code>null</code> when the string is not a bcrypt hash: the prefix must be <code>$2a$</code>, <code>$2b$</code> or <code>$2y$</code>; the cost exactly two digits between 04 and 31; then exactly 22 + 31 characters from <code>./A-Za-z0-9</code>, nothing else.</p>`,
  vi: `<p>"Định dạng tự mô tả này là lý do bạn không bao giờ lưu muối hay chi phí ở cột riêng." Bài đã tháo rời chuỗi ở bản tiếng Anh. Viết <code>parseBcrypt(hash)</code> trả <code>{ algorithm, cost, rounds, salt, hash }</code> — <code>algorithm</code> không có dấu đô la (<code>"2b"</code>), <code>cost</code> là số, <code>rounds = 2^cost</code> — hoặc <code>null</code> khi chuỗi không phải hash bcrypt: tiền tố phải là <code>$2a$</code>, <code>$2b$</code> hoặc <code>$2y$</code>; chi phí đúng hai chữ số từ 04 tới 31; rồi đúng 22 + 31 ký tự thuộc <code>./A-Za-z0-9</code>, không gì khác.</p>`,
  yc: [['Return null for anything malformed — never throw.', 'Trả null cho mọi thứ sai dạng — không bao giờ ném lỗi.'], ['Numbers are numbers.', 'Số là số.']],
  goiY: [['One anchored regex: <code>/^\\$(2[aby])\\$(\\d{2})\\$([./A-Za-z0-9]{22})([./A-Za-z0-9]{31})$/</code>.', 'Một regex có neo: <code>/^\\$(2[aby])\\$(\\d{2})\\$([./A-Za-z0-9]{22})([./A-Za-z0-9]{31})$/</code>.'], ['Then check 4 ≤ cost ≤ 31; <code>2 ** cost</code> for the rounds.', 'Rồi kiểm 4 ≤ cost ≤ 31; <code>2 ** cost</code> cho số vòng.']],
  loi: [['<code>hash.split("$")</code>: the salt alphabet contains <code>/</code> and <code>.</code> but never <code>$</code>, so it works — until an argon2 string arrives and you index the wrong part.', '<code>hash.split("$")</code>: bảng chữ của muối có <code>/</code> và <code>.</code> nhưng không có <code>$</code>, nên chạy — cho tới khi một chuỗi argon2 tới và bạn lấy nhầm phần.'], ['Forgetting the anchors: a hash with garbage appended still “parses”.', 'Quên neo: hash bị nối rác phía sau vẫn "đọc được".']],
  gt: ['Everything verify() needs travels in one string: which algorithm, how expensive, which salt. That is what makes migration possible later — a stored $2b$10$ keeps verifying after you raise the cost to 12, and the prefix tells you which function to call when you move to argon2 (exercise 6).', 'Mọi thứ verify() cần đi trong một chuỗi: thuật toán nào, đắt cỡ nào, muối nào. Chính điều đó làm việc chuyển đổi sau này khả thi — chuỗi $2b$10$ đã lưu vẫn kiểm được sau khi bạn tăng chi phí lên 12, và tiền tố cho biết gọi hàm nào khi chuyển sang argon2 (bài 6).'],
  kn: ['bcrypt'],
  tns: [tn('self-describing', 'tự mô tả', 'Chuỗi mang theo tham số của chính nó.')],
  dau: `function parseBcrypt(hash) {
  // Write your solution here
  const parts = hash.split('$');
  return { algorithm: parts[1], cost: parts[2], rounds: 0, salt: parts[3].slice(0, 22), hash: parts[3].slice(22) };
}
`,
  giai: parseBcrypt,
  cases: [
    { goi: goi('parseBcrypt', '$2b$10$a7vd/4xSVvoK5VKpGGzbD.x4Y05t1q0YIRcs.YQcb4WEtp1sivisK'), moTa: ['The lesson’s hash', 'Hash của bài'] },
    { goi: goi('parseBcrypt', '$2b$12$MRH7iTpyMP9El9H3RnW5fO66xOCW9YM9aVJ6zlWcPd7JckvuJwz9u') },
    { goi: goi('parseBcrypt', '$argon2id$v=19$m=19456,t=2,p=1$c29tZXNhbHQ$abcdef'), moTa: ['An argon2 string is not bcrypt', 'Chuỗi argon2 không phải bcrypt'] },
    { goi: `[${['$2a$04$fjT.b90BeGd2LC7x.ZWWhOKs1pHRqQwniP96nFT6KUbT4GSjaryJ.', '$2b$03$fjT.b90BeGd2LC7x.ZWWhOKs1pHRqQwniP96nFT6KUbT4GSjaryJ.', '$2b$32$fjT.b90BeGd2LC7x.ZWWhOKs1pHRqQwniP96nFT6KUbT4GSjaryJ.', '$2x$10$fjT.b90BeGd2LC7x.ZWWhOKs1pHRqQwniP96nFT6KUbT4GSjaryJ.'].map((h) => `parseBcrypt(${JSON.stringify(h)})`).join(', ')}]`, an: true },
    { goi: `[parseBcrypt('$2b$10$a7vd/4xSVvoK5VKpGGzbD.x4Y05t1q0YIRcs.YQcb4WEtp1sivisKextra'), parseBcrypt('$2b$10$a7vd/4xSVvoK5VKpGGzbD.x4Y05t1q0YIRcs.YQcb4WEtp1sivis'), parseBcrypt('$2y$31$sGfJY1C3L.Kf7DzOZVRFqeRDj73jX4u4eRDSRSgDBrWqe7.lv.t9G'), parseBcrypt(null), parseBcrypt('')]`, an: true },
  ],
});

/* ── 4. Quy tắc mật khẩu: độ dài, và 72 BYTE của bcrypt ── */
function utf8Bytes(str) {
  // count UTF-8 bytes by code point: 1 (ASCII) · 2 (≤ U+07FF) · 3 (≤ U+FFFF) · 4 (emoji and other astral characters)
  let n = 0;
  for (const ch of str) {
    const c = ch.codePointAt(0);
    n += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
  }
  return n;
}
function checkPassword(pw) {
  const chars = [...pw].length;           // characters as a person counts them (code points), not UTF-16 units
  const bytes = utf8Bytes(pw);
  if (chars < 8) return { ok: false, code: 'TOO_SHORT', chars, bytes };
  if (bytes > 72) return { ok: false, code: 'TOO_LONG_FOR_BCRYPT', chars, bytes };   // explicit, never silent truncation
  return { ok: true, chars, bytes };      // spaces, emoji, any script: allowed — no composition rules
}
const VN = 'Mật khẩu của tôi là một câu tiếng Việt khá dài nhé';
const E4 = jsBai({
  ten: '8.1 · 4 — Write checkPassword(pw): length that matters, and bcrypt’s 72 bytes said out loud', kho: 'MEDIUM', phut: 15,
  en: `<p>Two rules from lesson 8.1 for a system that is still on bcrypt: <b>length is the only requirement with real entropy behind it</b> (no “1 upper 1 digit 1 symbol”, allow spaces and emoji), and <b>do not leave the 72-byte truncation silent</b> — “72 bytes is not 72 characters once your users type in their own language”. Write <code>checkPassword(pw)</code> returning <code>{ ok, code?, chars, bytes }</code>:</p>
<ul><li><code>chars</code> = number of characters as a person counts them: Unicode code points (<code>[...pw].length</code>), so 🔑 is 1, not 2.</li>
<li><code>bytes</code> = UTF-8 length. The grader has no <code>TextEncoder</code> or <code>Buffer</code>: count per code point — 1 byte below U+0080, 2 below U+0800, 3 below U+10000, otherwise 4.</li>
<li><code>chars &lt; 8</code> ⇒ <code>{ ok: false, code: "TOO_SHORT", … }</code>; else <code>bytes &gt; 72</code> ⇒ <code>{ ok: false, code: "TOO_LONG_FOR_BCRYPT", … }</code>; else <code>{ ok: true, chars, bytes }</code>.</li></ul>`,
  vi: `<p>Hai luật của bài 8.1 cho hệ thống vẫn dùng bcrypt: <b>độ dài là yêu cầu duy nhất có entropy thật đứng sau</b> (không "1 hoa 1 số 1 ký hiệu", cho phép khoảng trắng và emoji), và <b>đừng để việc cắt ở 72 byte diễn ra lặng lẽ</b> — "72 byte không phải 72 ký tự khi người dùng gõ bằng tiếng mẹ đẻ". Viết <code>checkPassword(pw)</code> trả <code>{ ok, code?, chars, bytes }</code>:</p>
<ul><li><code>chars</code> = số ký tự theo cách người đếm: điểm mã Unicode (<code>[...pw].length</code>), nên 🔑 là 1, không phải 2.</li>
<li><code>bytes</code> = độ dài UTF-8. Máy chấm không có <code>TextEncoder</code> hay <code>Buffer</code>: đếm theo điểm mã — 1 byte dưới U+0080, 2 dưới U+0800, 3 dưới U+10000, còn lại 4.</li>
<li><code>chars &lt; 8</code> ⇒ <code>{ ok: false, code: "TOO_SHORT", … }</code>; không thì <code>bytes &gt; 72</code> ⇒ <code>{ ok: false, code: "TOO_LONG_FOR_BCRYPT", … }</code>; không nữa thì <code>{ ok: true, chars, bytes }</code>.</li></ul>`,
  yc: [['No composition rules.', 'Không có luật thành phần.'], ['Iterate by code point (<code>for…of</code>), not by <code>.length</code> index.', 'Duyệt theo điểm mã (<code>for…of</code>), không theo chỉ số <code>.length</code>.']],
  goiY: [['<code>for (const ch of pw) { const c = ch.codePointAt(0); … }</code> visits each code point once, emoji included.', '<code>for (const ch of pw) { const c = ch.codePointAt(0); … }</code> đi qua mỗi điểm mã một lần, kể cả emoji.'], ['Vietnamese letters with diacritics such as ậ or ẩ are U+1Exx ⇒ 3 bytes each; đ and ô are below U+0800 ⇒ 2 bytes.', 'Chữ tiếng Việt có dấu như ậ hay ẩ là U+1Exx ⇒ mỗi chữ 3 byte; đ và ô dưới U+0800 ⇒ 2 byte.']],
  loi: [['<code>pw.length &gt; 72</code>: counts UTF-16 units, so a 50-character Vietnamese sentence of 64 bytes passes and one of 99 bytes passes too — bcrypt silently drops the tail.', '<code>pw.length &gt; 72</code>: đếm đơn vị UTF-16, nên câu tiếng Việt 50 ký tự 64 byte lọt qua và câu 99 byte cũng lọt — bcrypt lặng lẽ bỏ phần đuôi.'], ['Adding “must contain a digit and a symbol”: pushes everyone to Password1!, which cracking rigs know.', 'Thêm "phải có số và ký hiệu": đẩy mọi người tới Password1!, thứ máy bẻ khoá đã biết.']],
  gt: ['bcrypt’s limit is in bytes, and every byte beyond 72 is ignored — so two passphrases that share their first 72 bytes are the same password to bcrypt. Counting UTF-8 bytes by code point is exactly what an encoder does. Rejecting loudly (or moving to argon2, which has no such limit) turns a silent security hole into a form error the user can act on.', 'Giới hạn của bcrypt tính bằng byte, và mọi byte sau 72 bị bỏ qua — nên hai câu mật khẩu chung 72 byte đầu là cùng một mật khẩu với bcrypt. Đếm byte UTF-8 theo điểm mã đúng là việc bộ mã hoá làm. Từ chối rõ ràng (hoặc chuyển sang argon2, không có giới hạn đó) biến một lỗ hổng lặng lẽ thành lỗi form mà người dùng sửa được.'],
  kn: ['password policy', 'UTF-8', 'bcrypt'],
  tns: [tn('code point', 'điểm mã', 'Một ký tự Unicode.'), tn('UTF-8', 'UTF-8', 'Mã hoá 1–4 byte mỗi ký tự.'), tn('entropy', 'entropy', 'Độ khó đoán.')],
  dau: `function checkPassword(pw) {
  // Write your solution here
  if (pw.length < 8) return { ok: false, code: 'TOO_SHORT', chars: pw.length, bytes: pw.length };
  if (!/[0-9]/.test(pw)) return { ok: false, code: 'NEEDS_DIGIT', chars: pw.length, bytes: pw.length };
  return { ok: true, chars: pw.length, bytes: pw.length };
}
`,
  giai: [utf8Bytes, checkPassword],
  cases: [
    { goi: goi('checkPassword', 'correct horse battery staple'), moTa: ['A long English passphrase, no digit', 'Câu mật khẩu tiếng Anh dài, không có số'] },
    { goi: goi('checkPassword', VN), moTa: ['A Vietnamese sentence of 50 characters', 'Một câu tiếng Việt 50 ký tự'] },
    { goi: goi('checkPassword', 'A'.repeat(72) + '-mat-khau-that-cua-toi'), moTa: ['The lesson’s 94-byte password', 'Mật khẩu 94 byte của bài'] },
    { goi: `[checkPassword('1234567'), checkPassword('🔑🔑🔑🔑🔑🔑🔑'), checkPassword('🔑🔑🔑🔑🔑🔑🔑🔑')]`, an: true, moTa: ['Emoji count as one character each', 'Emoji mỗi cái tính một ký tự'] },
    { goi: goi('checkPassword', VN + ' và còn dài hơn'), an: true },
    { goi: `[checkPassword('a'.repeat(72)), checkPassword('a'.repeat(71) + 'đ'), checkPassword('a'.repeat(70) + 'đ')]`, an: true, moTa: ['Exactly at the 72-byte edge', 'Đúng ở biên 72 byte'] },
  ],
  saiMau: [
    `${utf8Bytes}\nfunction checkPassword(pw) { const chars = pw.length, bytes = utf8Bytes(pw); if (chars < 8) return { ok: false, code: 'TOO_SHORT', chars, bytes }; if (bytes > 72) return { ok: false, code: 'TOO_LONG_FOR_BCRYPT', chars, bytes }; return { ok: true, chars, bytes }; }`,
    `${utf8Bytes}\nfunction checkPassword(pw) { const chars = [...pw].length, bytes = pw.length; if (chars < 8) return { ok: false, code: 'TOO_SHORT', chars, bytes }; if (bytes > 72) return { ok: false, code: 'TOO_LONG_FOR_BCRYPT', chars, bytes }; return { ok: true, chars, bytes }; }`,
  ],
});

/* ── 5. Đăng nhập trả lời như nhau ── */
async function login(users, verifyPassword, DUMMY_HASH, email, password) {
  const user = await users.findByEmail(email.toLowerCase());
  // ALWAYS run the expensive verification — against a dummy hash when the email does not exist —
  // so the response time carries no information about which emails have accounts
  const ok = await verifyPassword(user?.passwordHash ?? DUMMY_HASH, password);
  if (!user || !ok) return { status: 401, body: { error: { code: 'INVALID_CREDENTIALS', message: 'Email or password is incorrect' } } };
  return { status: 200, body: { userId: user.id } };
}
const FAKE_LOGIN = `const DUMMY_HASH = '$argon2id$v=19$m=19456,t=2,p=1$ZHVtbXk$ZHVtbXloYXNo';
const mkUsers = () => { const rows = [{ id: 1, email: 'an@vd.com', passwordHash: 'h:correct horse' }, { id: 2, email: 'google@vd.com', passwordHash: null }];
  return { findByEmail: (e) => new Promise((ok) => setTimeout(() => ok(rows.find((r) => r.email === e) || null), 1)) }; };
let verifyCalls = 0;
// fake argon2: 33 virtual ms per call, like the OWASP parameters; false for null / corrupt hashes instead of throwing
const verifyPassword = (hash, plain) => new Promise((ok) => setTimeout(() => { verifyCalls++; ok(typeof hash === 'string' && hash.startsWith('h:') && hash === 'h:' + plain); }, 33));
const timed = async (email, pw) => { const t0 = Date.now(); const r = await login(mkUsers(), verifyPassword, DUMMY_HASH, email, pw); return { ...r, ms: Date.now() - t0 }; };`;
const E5 = jsBai({
  ten: '8.1 · 5 — Write login(): the same answer, in the same time, for every failure', kho: 'MEDIUM', phut: 15,
  en: `<p>Measurement 5: the obvious login returns early for an unknown email, skipping the 33 ms hash — 1.42 ms vs 35.52 ms, a 25× gap that tells a script which emails have accounts. Write <code>async login(users, verifyPassword, DUMMY_HASH, email, password)</code>:</p>
<ul><li><code>await users.findByEmail(email.toLowerCase())</code> ⇒ user <code>{ id, email, passwordHash }</code> or <code>null</code>.</li>
<li><b>Always</b> <code>await verifyPassword(hash, password)</code> exactly once, with <code>user?.passwordHash ?? DUMMY_HASH</code> — also for accounts created through Google OAuth, whose <code>passwordHash</code> is <code>null</code>.</li>
<li>Any failure (no user, wrong password, null hash) ⇒ <code>{ status: 401, body: { error: { code: "INVALID_CREDENTIALS", message: "Email or password is incorrect" } } }</code> — never “that email does not exist”.</li>
<li>Success ⇒ <code>{ status: 200, body: { userId } }</code>.</li></ul>
<p>The fake <code>verifyPassword</code> takes 33 virtual ms and returns <code>false</code> for <code>null</code>; the checks compare response times.</p>`,
  vi: `<p>Phép đo 5: bản đăng nhập hiển nhiên return sớm với email không có, bỏ qua lần băm 33 ms — 1,42 ms so với 35,52 ms, chênh 25 lần, đủ để một script biết email nào có tài khoản. Viết <code>async login(users, verifyPassword, DUMMY_HASH, email, password)</code>:</p>
<ul><li><code>await users.findByEmail(email.toLowerCase())</code> ⇒ người dùng <code>{ id, email, passwordHash }</code> hoặc <code>null</code>.</li>
<li><b>Luôn</b> <code>await verifyPassword(hash, password)</code> đúng một lần, với <code>user?.passwordHash ?? DUMMY_HASH</code> — kể cả tài khoản tạo qua Google OAuth có <code>passwordHash</code> là <code>null</code>.</li>
<li>Mọi thất bại (không có user, sai mật khẩu, hash null) ⇒ <code>{ status: 401, body: { error: { code: "INVALID_CREDENTIALS", message: "Email or password is incorrect" } } }</code> — không bao giờ "email đó không tồn tại".</li>
<li>Thành công ⇒ <code>{ status: 200, body: { userId } }</code>.</li></ul>
<p><code>verifyPassword</code> giả mất 33 ms ảo và trả <code>false</code> cho <code>null</code>; các kiểm so thời gian phản hồi.</p>`,
  yc: [['Same status, same body, same time for every failure.', 'Mọi thất bại cùng mã, cùng body, cùng thời gian.'], ['One verification per login, never zero.', 'Mỗi lần đăng nhập một lần kiểm, không bao giờ là không.']],
  goiY: [['<code>const ok = await verifyPassword(user?.passwordHash ?? DUMMY_HASH, password);</code> runs before any decision.', '<code>const ok = await verifyPassword(user?.passwordHash ?? DUMMY_HASH, password);</code> chạy trước mọi quyết định.'], ['Then <code>if (!user || !ok) return 401</code> — <code>Boolean(user) &amp;&amp; ok</code> is the lesson’s spelling.', 'Rồi <code>if (!user || !ok) return 401</code> — <code>Boolean(user) &amp;&amp; ok</code> là cách viết của bài.']],
  loi: [['<code>if (!user) return 401</code> before hashing — 25× faster for unknown emails, an account-enumeration oracle.', '<code>if (!user) return 401</code> trước khi băm — nhanh hơn 25 lần với email lạ, một cỗ máy dò tài khoản.'], ['Different messages (“no such email” / “wrong password”) — the same leak without even measuring time.', 'Thông điệp khác nhau ("không có email" / "sai mật khẩu") — cùng lỗ rò mà chẳng cần đo thời gian.'], ['Calling verify only when the hash is not null: OAuth accounts answer fast, and “log in with an empty password” is one bug away.', 'Chỉ gọi verify khi hash khác null: tài khoản OAuth trả lời nhanh, và "đăng nhập bằng mật khẩu rỗng" chỉ cách một lỗi.']],
  gt: ['A side channel is any observable difference between two outcomes you meant to look alike. Here the difference was work: no user meant no hash. Verifying against a DUMMY_HASH does the same work in every branch, so the time (34.73 ms vs 36.62 ms in the lesson), the status and the message are all the same — the response carries one bit: success or not.', 'Kênh phụ là bất kỳ khác biệt quan sát được giữa hai kết quả mà bạn định cho giống nhau. Ở đây khác biệt là khối lượng việc: không có user nghĩa là không băm. Kiểm với DUMMY_HASH làm cùng một việc ở mọi nhánh, nên thời gian (34,73 ms so với 36,62 ms trong bài), mã trạng thái và thông điệp đều như nhau — phản hồi chỉ mang một bit: thành công hay không.'],
  kn: ['authentication', 'timing side channel'],
  tns: [tn('side channel', 'kênh phụ', 'Thông tin lộ qua thời gian, kích thước…'), tn('account enumeration', 'dò tài khoản')],
  dau: `async function login(users, verifyPassword, DUMMY_HASH, email, password) {
  // Write your solution here
  const user = await users.findByEmail(email.toLowerCase());
  if (!user) return { status: 401, body: { error: { code: 'NO_SUCH_EMAIL', message: 'That email does not exist' } } };
  if (!user.passwordHash) return { status: 401, body: { error: { code: 'INVALID_CREDENTIALS', message: 'Email or password is incorrect' } } };
  const ok = await verifyPassword(user.passwordHash, password);
  if (!ok) return { status: 401, body: { error: { code: 'INVALID_CREDENTIALS', message: 'Email or password is incorrect' } } };
  return { status: 200, body: { userId: user.id } };
}
`,
  giai: login,
  chung: FAKE_LOGIN,
  cases: [
    { goi: `[await timed('an@vd.com', 'correct horse'), await timed('An@VD.com', 'wrong')]`, moTa: ['Right and wrong password', 'Đúng và sai mật khẩu'] },
    { goi: `[await timed('nobody@vd.com', 'whatever'), verifyCalls]`, moTa: ['Unknown email: same 401, same time, verify still ran', 'Email lạ: cùng 401, cùng thời gian, verify vẫn chạy'] },
    { goi: `[await timed('google@vd.com', ''), await timed('google@vd.com', 'x'), verifyCalls]`, an: true, moTa: ['OAuth account with null hash', 'Tài khoản OAuth có hash null'] },
    { goi: `await (async () => { const a = await timed('an@vd.com', 'nope'); const b = await timed('ghost@vd.com', 'nope'); return [a.ms === b.ms, a.body, b.body, verifyCalls]; })()`, an: true },
  ],
});

/* ── 6. Nâng chi phí lúc đăng nhập — bcrypt → argon2 ── */
async function loginAndUpgrade(user, password, { bcrypt, argon2, save }) {
  if (!user || !user.passwordHash) return { ok: false, upgraded: false };
  const h = user.passwordHash;
  // the stored prefix names the algorithm: verify with whichever one wrote it
  const isBcrypt = /^\$2[aby]\$/.test(h);
  const ok = isBcrypt ? await bcrypt.compare(password, h) : await argon2.verify(h, password);
  if (!ok) return { ok: false, upgraded: false };                       // never touch the hash on a failed login
  // the only moment you ever hold the plain password: re-hash with today's parameters if needed
  if (isBcrypt || argon2.needsRehash(h)) {
    await save(user.id, await argon2.hash(password));
    return { ok: true, upgraded: true };
  }
  return { ok: true, upgraded: false };
}
const FAKE_HASHERS = `const saved = [];
const deps = {
  bcrypt: { compare: (pw, h) => new Promise((ok) => setTimeout(() => ok(h.slice(7) === 'S'.repeat(22) + pw.padEnd(31, '.').slice(0, 31)), 78)) },
  argon2: {
    hash: (pw) => new Promise((ok) => setTimeout(() => ok('$argon2id$v=19$m=19456,t=2,p=1$c2FsdA$' + pw), 33)),
    verify: (h, pw) => new Promise((ok) => setTimeout(() => ok(h.endsWith('$' + pw) && h.startsWith('$argon2id$')), 33)),
    needsRehash: (h) => h.startsWith('$argon2') && !h.includes('m=19456,t=2,p=1'),   // like the real one, it only judges argon2 strings
  },
  save: (id, hash) => new Promise((ok) => setTimeout(() => { saved.push({ id, hash }); ok(); }, 2)),
};
const bc = (pw) => '$2b$10$' + 'S'.repeat(22) + pw.padEnd(31, '.').slice(0, 31);
const U = (id, passwordHash) => ({ id, email: 'u' + id + '@vd.com', passwordHash });`;
const E6 = jsBai({
  ten: '8.1 · 6 — Write loginAndUpgrade(): move users from bcrypt (or old argon2) without a password reset', kho: 'HARD', phut: 20,
  en: `<p>“Because the parameters live inside every stored string, you can migrate one user at a time, at the only moment you ever hold their plain password — the instant they log in.” Write <code>async loginAndUpgrade(user, password, { bcrypt, argon2, save })</code> returning <code>{ ok, upgraded }</code>:</p>
<ul><li>No user or a null hash ⇒ <code>{ ok: false, upgraded: false }</code>.</li>
<li>Pick the verifier from the stored prefix: <code>$2a$</code>/<code>$2b$</code>/<code>$2y$</code> ⇒ <code>await bcrypt.compare(password, hash)</code>; anything else ⇒ <code>await argon2.verify(hash, password)</code> (note the different argument orders — they are the real libraries’).</li>
<li>Wrong password ⇒ <code>{ ok: false, upgraded: false }</code> and nothing saved.</li>
<li>Right password and (the hash is bcrypt <b>or</b> <code>argon2.needsRehash(hash)</code>) ⇒ <code>await save(user.id, await argon2.hash(password))</code> ⇒ <code>{ ok: true, upgraded: true }</code>. Otherwise <code>{ ok: true, upgraded: false }</code>.</li></ul>`,
  vi: `<p>"Vì tham số nằm trong mỗi chuỗi đã lưu, bạn có thể chuyển từng người một, đúng lúc duy nhất bạn cầm mật khẩu gốc của họ — khoảnh khắc họ đăng nhập." Viết <code>async loginAndUpgrade(user, password, { bcrypt, argon2, save })</code> trả <code>{ ok, upgraded }</code>:</p>
<ul><li>Không có user hoặc hash null ⇒ <code>{ ok: false, upgraded: false }</code>.</li>
<li>Chọn hàm kiểm theo tiền tố đã lưu: <code>$2a$</code>/<code>$2b$</code>/<code>$2y$</code> ⇒ <code>await bcrypt.compare(password, hash)</code>; còn lại ⇒ <code>await argon2.verify(hash, password)</code> (chú ý thứ tự đối số khác nhau — đúng như thư viện thật).</li>
<li>Sai mật khẩu ⇒ <code>{ ok: false, upgraded: false }</code> và không lưu gì.</li>
<li>Đúng mật khẩu và (hash là bcrypt <b>hoặc</b> <code>argon2.needsRehash(hash)</code>) ⇒ <code>await save(user.id, await argon2.hash(password))</code> ⇒ <code>{ ok: true, upgraded: true }</code>. Không thì <code>{ ok: true, upgraded: false }</code>.</li></ul>`,
  yc: [['Verify first, upgrade second — never on a failed login.', 'Kiểm trước, nâng cấp sau — không bao giờ khi đăng nhập hỏng.'], ['bcrypt.compare(plain, hash) vs argon2.verify(hash, plain).', 'bcrypt.compare(plain, hash) so với argon2.verify(hash, plain).']],
  goiY: [['<code>const isBcrypt = /^\\$2[aby]\\$/.test(hash)</code>.', '<code>const isBcrypt = /^\\$2[aby]\\$/.test(hash)</code>.'], ['The upgrade condition is <code>isBcrypt || argon2.needsRehash(hash)</code>; await the new hash, then await save.', 'Điều kiện nâng cấp là <code>isBcrypt || argon2.needsRehash(hash)</code>; await hash mới, rồi await save.']],
  loi: [['Swapping the argument order of one of the two libraries: every login fails, or worse, compares the hash to itself.', 'Đảo thứ tự đối số của một trong hai thư viện: mọi lần đăng nhập hỏng, hoặc tệ hơn, so hash với chính nó.'], ['Re-hashing before verifying: a wrong password overwrites the right one.', 'Băm lại trước khi kiểm: mật khẩu sai ghi đè mật khẩu đúng.'], ['Re-hashing on every login: 33 ms of argon2 plus a write on every request for no reason.', 'Băm lại mọi lần đăng nhập: thêm 33 ms argon2 và một lần ghi mỗi request mà chẳng để làm gì.']],
  gt: ['The prefix tells you which function wrote the hash, so old and new users can coexist forever in one column. A successful login is the one moment you can derive a new hash; after a few months only inactive accounts remain on the old scheme, and those you expire. Raising argon2’s cost later is the same move, triggered by needsRehash.', 'Tiền tố cho biết hàm nào đã viết hash, nên người dùng cũ và mới có thể sống chung mãi trong một cột. Một lần đăng nhập thành công là lúc duy nhất bạn tạo được hash mới; vài tháng sau chỉ còn tài khoản không hoạt động nằm ở cách cũ, và những cái đó bạn cho hết hạn. Tăng chi phí argon2 sau này là cùng một nước đi, kích hoạt bởi needsRehash.'],
  kn: ['password hashing', 'migration'],
  tns: [tn('rehash', 'băm lại'), tn('needsRehash', 'needsRehash', 'Hash có dùng tham số cũ không.')],
  dau: `async function loginAndUpgrade(user, password, { bcrypt, argon2, save }) {
  // Write your solution here
  const ok = await argon2.verify(user.passwordHash, password);
  if (argon2.needsRehash(user.passwordHash)) await save(user.id, await argon2.hash(password));
  return { ok, upgraded: false };
}
`,
  giai: loginAndUpgrade,
  chung: FAKE_HASHERS,
  cases: [
    { goi: `[await loginAndUpgrade(U(1, bc('123456')), '123456', deps), saved]`, moTa: ['bcrypt user logs in ⇒ upgraded to argon2', 'Người dùng bcrypt đăng nhập ⇒ nâng lên argon2'] },
    { goi: `[await loginAndUpgrade(U(1, bc('123456')), 'wrong', deps), saved]`, moTa: ['Wrong password ⇒ nothing saved', 'Sai mật khẩu ⇒ không lưu gì'] },
    { goi: `[await loginAndUpgrade(U(2, '$argon2id$v=19$m=19456,t=2,p=1$c2FsdA$pw'), 'pw', deps), saved]`, moTa: ['Current argon2 ⇒ no upgrade', 'argon2 hiện hành ⇒ không nâng cấp'] },
    { goi: `[await loginAndUpgrade(U(3, '$argon2id$v=19$m=4096,t=3,p=1$c2FsdA$pw'), 'pw', deps), await loginAndUpgrade(U(4, '$argon2id$v=19$m=4096,t=3,p=1$c2FsdA$pw'), 'nope', deps), saved]`, an: true, moTa: ['Old argon2 parameters ⇒ re-hashed', 'Tham số argon2 cũ ⇒ băm lại'] },
    { goi: `[await loginAndUpgrade(null, 'x', deps), await loginAndUpgrade(U(5, null), '', deps), await loginAndUpgrade(U(6, '$2y$10$' + 'S'.repeat(22) + 'abc'.padEnd(31, '.')), 'abc', deps), saved.map((s) => s.id)]`, an: true },
    { goi: `await (async () => { const t0 = Date.now(); await loginAndUpgrade(U(7, bc('pw')), 'pw', deps); return Date.now() - t0; })()`, an: true, moTa: ['Time: 78 ms bcrypt + 33 ms argon2 + 2 ms save', 'Thời gian: 78 ms bcrypt + 33 ms argon2 + 2 ms lưu'] },
  ],
  saiMau: [
    loginAndUpgrade.toString().replace('await bcrypt.compare(password, h)', 'await bcrypt.compare(h, password)'),
    loginAndUpgrade.toString().replace('if (isBcrypt || argon2.needsRehash(h)) {', 'if (argon2.needsRehash(h)) {'),
  ],
});

export default modul('nodejs-8-1-mat-khau-va-bam', '8.1 Storing passwords: why almost every way is wrong', [E1, E2, E3, E4, E5, E6]);
