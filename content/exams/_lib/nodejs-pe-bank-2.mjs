/**
 * Ngân hàng đề PE khoá Node.js — phần 2 (PE-05 … PE-07).
 * Xem chú thích ở `nodejs-pe-bank-1.mjs`: file này là NGUỒN, `expectedOutput`
 * do `scripts/exam-build-pe.mjs` chạy thật rồi sinh ra.
 */
export default [
  {
    code: 'PE-05',
    title: { en: 'Practical Exam 05 — passwords, tokens and permissions', vi: 'Thi thực hành 05 — mật khẩu, token và phân quyền' },
    desc: {
      en: 'Chapter 8 with node:crypto only: constant-time answers, signed tokens, rotation and the ownership rule.',
      vi: 'Chương 8 chỉ với node:crypto: trả lời trong thời gian không đổi, token có chữ ký, xoay vòng và quy tắc sở hữu.',
    },
    questions: [
      {
        points: 1.5,
        en: '<p><b>Q1.</b> Read one password per line and print <code>&lt;password&gt; OK</code> or <code>&lt;password&gt; REJECT &lt;reason&gt;</code>. Rules in this order: shorter than 12 CHARACTERS → <code>too-short</code>; longer than 72 BYTES → <code>too-long-for-bcrypt</code> (remember accented Vietnamese letters cost 2 bytes); appears in the breached list <code>123456789012, matkhau12345, Password1234</code> → <code>breached</code>.</p>',
        vi: '<p><b>Câu 1.</b> Mỗi dòng đọc một mật khẩu và in <code>&lt;mật khẩu&gt; OK</code> hoặc <code>&lt;mật khẩu&gt; REJECT &lt;lý do&gt;</code>. Luật theo đúng thứ tự: ngắn hơn 12 KÝ TỰ → <code>too-short</code>; dài hơn 72 BYTE → <code>too-long-for-bcrypt</code> (nhớ rằng chữ tiếng Việt có dấu tốn 2 byte); nằm trong danh sách đã rò rỉ <code>123456789012, matkhau12345, Password1234</code> → <code>breached</code>.</p>',
        stdin: 'ngan\n123456789012\nmot-cau-mat-khau-du-dai\nmật_khẩu_rất_dài_bằng_tiếng_Việt_có_dấu_đầy_đủ_và_còn_dài_hơn_nữa_nhé\n',
        solution:
          "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\n" +
          "const BREACHED = new Set(['123456789012', 'matkhau12345', 'Password1234']);\n" +
          'for (const pw of lines) {\n' +
          '  let reason = null;\n' +
          "  if (pw.length < 12) reason = 'too-short';\n" +
          "  else if (Buffer.byteLength(pw, 'utf8') > 72) reason = 'too-long-for-bcrypt';\n" +
          "  else if (BREACHED.has(pw)) reason = 'breached';\n" +
          '  console.log(reason ? `${pw} REJECT ${reason}` : `${pw} OK`);\n' +
          '}\n',
      },
      {
        points: 1.5,
        en: '<p><b>Q2.</b> Compare secrets safely. Read pairs <code>&lt;a&gt; &lt;b&gt;</code>, one per line, and print <code>&lt;a&gt; &lt;b&gt; &lt;true|false&gt;</code> using <code>crypto.timingSafeEqual</code>. Guard the length yourself — <code>timingSafeEqual</code> THROWS on buffers of different lengths, and an uncaught throw here is a 500 on your login route.</p>',
        vi: '<p><b>Câu 2.</b> So sánh bí mật một cách an toàn. Đọc từng cặp <code>&lt;a&gt; &lt;b&gt;</code> trên mỗi dòng và in <code>&lt;a&gt; &lt;b&gt; &lt;true|false&gt;</code> bằng <code>crypto.timingSafeEqual</code>. Tự kiểm độ dài trước — <code>timingSafeEqual</code> NÉM LỖI khi hai buffer khác độ dài, và một lỗi không bắt ở đây là một mã 500 trên route đăng nhập.</p>',
        stdin: 'abc abc\nabc abcd\nkhoa-that khoa-that\nkhoa-that khoa-thax\n',
        solution:
          "const crypto = require('node:crypto');\n" +
          "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\n" +
          'const safeEqual = (a, b) => {\n' +
          '  const x = Buffer.from(a), y = Buffer.from(b);\n' +
          '  return x.length === y.length && crypto.timingSafeEqual(x, y);\n' +
          '};\n' +
          'for (const line of lines) {\n' +
          "  const [a, b] = line.trim().split(/\\s+/);\n" +
          '  console.log(a, b, safeEqual(a, b));\n' +
          '}\n',
      },
      {
        points: 2,
        en: '<p><b>Q3.</b> Implement the ownership rule as ONE function <code>canTouch(note, actor)</code>: the owner may touch it, an ADMIN may touch anything, everyone else may not. Read a JSON array of notes on line 1, then requests <code>&lt;actorId&gt; &lt;role&gt; &lt;action&gt; &lt;noteId&gt;</code>. Print <code>200</code> when allowed and <code>404</code> when not (never 403 — a 403 confirms the note exists), and <code>404</code> for an id that does not exist at all.</p>',
        vi: '<p><b>Câu 3.</b> Cài quy tắc sở hữu thành MỘT hàm <code>canTouch(note, actor)</code>: chủ sở hữu được đụng, ADMIN được đụng mọi thứ, còn lại thì không. Dòng 1 đọc mảng JSON các ghi chú, rồi tới các request <code>&lt;idNgườiGọi&gt; &lt;vaiTrò&gt; &lt;hànhĐộng&gt; &lt;idGhiChú&gt;</code>. In <code>200</code> khi được phép và <code>404</code> khi không (tuyệt đối không 403 — vì 403 xác nhận ghi chú đó tồn tại), và cũng in <code>404</code> với id hoàn toàn không tồn tại.</p>',
        stdin: '[{"id":1,"authorId":1},{"id":2,"authorId":2}]\n1 USER read 1\n2 USER read 1\n2 USER delete 1\n9 ADMIN read 1\n1 USER read 99\n',
        solution:
          "const raw = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\n" +
          'const notes = JSON.parse(raw[0]);\n' +
          'const byId = new Map(notes.map((n) => [n.id, n]));\n' +
          "const canTouch = (note, actor) => note.authorId === actor.id || actor.role === 'ADMIN';\n" +
          'for (const line of raw.slice(1)) {\n' +
          "  const [actorId, role, , noteId] = line.trim().split(/\\s+/);\n" +
          '  const note = byId.get(Number(noteId));\n' +
          '  const actor = { id: Number(actorId), role };\n' +
          "  console.log(note && canTouch(note, actor) ? '200' : '404');\n" +
          '}\n',
      },
      {
        points: 2.5,
        en: '<p><b>Q4.</b> Sign and verify an access token with HMAC-SHA256 (<code>node:crypto</code>, base64url, three dot-separated parts, header <code>{"alg":"HS256"}</code> and payload <code>{ sub, role, exp }</code>). Read the shared secret on line 1, the "current time" as a unix second on line 2, then one task per line: <code>sign &lt;sub&gt; &lt;role&gt; &lt;ttlSeconds&gt;</code> prints the token, and <code>verify &lt;token&gt;</code> prints <code>ok &lt;sub&gt; &lt;role&gt;</code> or <code>fail &lt;MALFORMED|BAD_ALG|BAD_SIGNATURE|EXPIRED&gt;</code> — checked in that order, with the algorithm decided by the SERVER (only <code>HS256</code>), never read from the token.</p>',
        vi: '<p><b>Câu 4.</b> Ký và kiểm một access token bằng HMAC-SHA256 (<code>node:crypto</code>, base64url, ba phần cách nhau bởi dấu chấm, header <code>{"alg":"HS256"}</code> và payload <code>{ sub, role, exp }</code>). Dòng 1 đọc khoá bí mật dùng chung, dòng 2 đọc "thời điểm hiện tại" tính bằng giây unix, rồi mỗi dòng một việc: <code>sign &lt;sub&gt; &lt;vaiTrò&gt; &lt;ttlGiây&gt;</code> thì in ra token, còn <code>verify &lt;token&gt;</code> thì in <code>ok &lt;sub&gt; &lt;vaiTrò&gt;</code> hoặc <code>fail &lt;MALFORMED|BAD_ALG|BAD_SIGNATURE|EXPIRED&gt;</code> — kiểm theo đúng thứ tự đó, với thuật toán do MÁY CHỦ quyết (chỉ chấp nhận <code>HS256</code>), không bao giờ đọc từ token.</p>',
        stdin: 'khoa-bi-mat\n1785000000\nsign 7 USER 900\nverify khong-phai-token\nverify eyJhbGciOiJub25lIn0.eyJzdWIiOiI3Iiwicm9sZSI6IkFETUlOIn0.\n',
        solution:
          "const crypto = require('node:crypto');\n" +
          "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\n" +
          'const SECRET = lines[0].trim();\n' +
          'const NOW = Number(lines[1].trim());\n' +
          "const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');\n" +
          "const mac = (data) => crypto.createHmac('sha256', SECRET).update(data).digest('base64url');\n" +
          'function sign(sub, role, ttl) {\n' +
          "  const data = b64({ alg: 'HS256' }) + '.' + b64({ sub, role, exp: NOW + ttl });\n" +
          "  return data + '.' + mac(data);\n" +
          '}\n' +
          'function verify(token) {\n' +
          "  const parts = String(token).split('.');\n" +
          "  if (parts.length !== 3) return 'fail MALFORMED';\n" +
          '  const [h, p, s] = parts;\n' +
          '  let header, payload;\n' +
          "  try { header = JSON.parse(Buffer.from(h, 'base64url').toString('utf8')); }\n" +
          "  catch { return 'fail MALFORMED'; }\n" +
          '  // Thuật toán do máy chủ chốt — token không có quyền bỏ phiếu.\n' +
          "  if (header.alg !== 'HS256') return 'fail BAD_ALG';\n" +
          "  const expected = mac(h + '.' + p);\n" +
          '  const a = Buffer.from(s), b = Buffer.from(expected);\n' +
          "  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return 'fail BAD_SIGNATURE';\n" +
          "  try { payload = JSON.parse(Buffer.from(p, 'base64url').toString('utf8')); }\n" +
          "  catch { return 'fail MALFORMED'; }\n" +
          "  if (typeof payload.exp !== 'number' || payload.exp <= NOW) return 'fail EXPIRED';\n" +
          '  return `ok ${payload.sub} ${payload.role}`;\n' +
          '}\n' +
          'for (const line of lines.slice(2)) {\n' +
          "  const [cmd, ...rest] = line.trim().split(/\\s+/);\n" +
          "  if (cmd === 'sign') console.log(sign(rest[0], rest[1], Number(rest[2])));\n" +
          '  else console.log(verify(rest[0]));\n' +
          '}\n',
      },
      {
        points: 2.5,
        en: '<p><b>Q5.</b> Refresh-token rotation with reuse detection. Every login starts a FAMILY; redeeming a refresh token marks it used and issues a new one in the same family. Read commands: <code>login &lt;user&gt;</code> prints <code>&lt;user&gt; token=&lt;t&gt; family=&lt;f&gt;</code> (tokens are <code>t1, t2, …</code> and families <code>f1, f2, …</code> in creation order); <code>refresh &lt;token&gt;</code> prints either the new token line or <code>401 REFRESH_REUSE_DETECTED revoked=&lt;n&gt;</code> when the token was already used or revoked — and revoking must kill the WHOLE family. End with <code>alive=&lt;still-valid tokens, comma separated&gt;</code>.</p>',
        vi: '<p><b>Câu 5.</b> Xoay vòng refresh token kèm phát hiện tái sử dụng. Mỗi lần đăng nhập mở một HỌ; đổi một refresh token thì đánh dấu nó đã dùng và cấp token mới trong cùng họ. Đọc các lệnh: <code>login &lt;người dùng&gt;</code> in ra <code>&lt;người dùng&gt; token=&lt;t&gt; family=&lt;f&gt;</code> (token đánh số <code>t1, t2, …</code> và họ đánh số <code>f1, f2, …</code> theo thứ tự tạo); <code>refresh &lt;token&gt;</code> thì in dòng token mới, hoặc in <code>401 REFRESH_REUSE_DETECTED revoked=&lt;n&gt;</code> khi token đó đã dùng hoặc đã bị thu hồi — và thu hồi thì phải giết CẢ HỌ. Kết thúc bằng dòng <code>alive=&lt;các token còn hiệu lực, cách nhau bởi dấu phẩy&gt;</code>.</p>',
        stdin: 'login an\nlogin binh\nrefresh t1\nrefresh t1\nrefresh t2\n',
        solution:
          "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\n" +
          'const sessions = new Map();   // token -> { user, family, used, revoked }\n' +
          'let t = 0, f = 0;\n' +
          'function issue(user, family) {\n' +
          '  const token = `t${++t}`;\n' +
          '  sessions.set(token, { user, family, used: false, revoked: false });\n' +
          '  return token;\n' +
          '}\n' +
          'for (const line of lines) {\n' +
          "  const [cmd, arg] = line.trim().split(/\\s+/);\n" +
          "  if (cmd === 'login') {\n" +
          '    const family = `f${++f}`;\n' +
          '    const token = issue(arg, family);\n' +
          '    console.log(`${arg} token=${token} family=${family}`);\n' +
          '    continue;\n' +
          '  }\n' +
          '  const s = sessions.get(arg);\n' +
          "  if (!s) { console.log('401 REFRESH_REUSE_DETECTED revoked=0'); continue; }\n" +
          '  if (s.used || s.revoked) {\n' +
          '    // Dùng lại = hai bên cùng cầm một token. Không biết ai là kẻ trộm → đốt cả họ.\n' +
          '    let revoked = 0;\n' +
          '    for (const row of sessions.values()) {\n' +
          '      if (row.family === s.family && !row.revoked) { row.revoked = true; revoked++; }\n' +
          '    }\n' +
          '    console.log(`401 REFRESH_REUSE_DETECTED revoked=${revoked}`);\n' +
          '    continue;\n' +
          '  }\n' +
          '  s.used = true;\n' +
          '  const token = issue(s.user, s.family);\n' +
          '  console.log(`${s.user} token=${token} family=${s.family}`);\n' +
          '}\n' +
          'const alive = [...sessions.entries()].filter(([, s]) => !s.used && !s.revoked).map(([k]) => k);\n' +
          "console.log(`alive=${alive.join(',')}`);\n",
      },
    ],
  },

  {
    code: 'PE-06',
    title: { en: 'Practical Exam 06 — hostile input', vi: 'Thi thực hành 06 — đầu vào thù địch' },
    desc: {
      en: 'Chapter 9: escaping, allow-lists, prototype pollution, redaction and bounding the work before a regex runs.',
      vi: 'Chương 9: thoát ký tự, danh sách trắng, ô nhiễm nguyên mẫu, che bí mật, và chặn khối lượng việc trước khi regex chạy.',
    },
    questions: [
      {
        points: 1.5,
        en: '<p><b>Q1.</b> Escape untrusted text for HTML output. Read one line per input and print it with <code>&amp;</code>, <code>&lt;</code>, <code>&gt;</code>, <code>"</code> and <code>&#x27;</code> replaced by <code>&amp;amp;</code>, <code>&amp;lt;</code>, <code>&amp;gt;</code>, <code>&amp;quot;</code>, <code>&amp;#39;</code>. Order matters: escape the ampersand FIRST or you double-escape everything else.</p>',
        vi: '<p><b>Câu 1.</b> Thoát ký tự cho văn bản không tin cậy trước khi in ra HTML. Mỗi dòng đọc một chuỗi và in lại nó với <code>&amp;</code>, <code>&lt;</code>, <code>&gt;</code>, <code>"</code> và <code>&#x27;</code> được thay bằng <code>&amp;amp;</code>, <code>&amp;lt;</code>, <code>&amp;gt;</code>, <code>&amp;quot;</code>, <code>&amp;#39;</code>. Thứ tự có ý nghĩa: phải thoát dấu &amp; TRƯỚC, nếu không mọi ký tự khác sẽ bị thoát hai lần.</p>',
        stdin: '<script>alert(1)</script>\nTom & Jerry\nhe said "hi" & left\n',
        solution:
          "const lines = require('node:fs').readFileSync(0, 'utf8').split('\\n').filter((l) => l.length);\n" +
          'const escapeHtml = (s) => s\n' +
          "  .replace(/&/g, '&amp;')\n" +
          "  .replace(/</g, '&lt;')\n" +
          "  .replace(/>/g, '&gt;')\n" +
          '  .replace(/"/g, \'&quot;\')\n' +
          "  .replace(/'/g, '&#39;');\n" +
          'for (const line of lines) console.log(escapeHtml(line));\n',
      },
      {
        points: 1.5,
        en: '<p><b>Q2.</b> Validate outbound URLs for a link-preview feature. The allow-list is <code>media.cuongthai.com</code> and <code>i.giphy.com</code>. Read one URL per line and print <code>OK &lt;hostname&gt;</code> or <code>REJECT &lt;reason&gt;</code>: unparseable → <code>bad-url</code>; protocol not <code>https:</code> → <code>protocol</code>; host not on the list → <code>host</code>. Parse with <code>new URL()</code> — a regex loses to <code>http://127.1</code>.</p>',
        vi: '<p><b>Câu 2.</b> Kiểm URL đi ra ngoài cho tính năng xem trước liên kết. Danh sách trắng gồm <code>media.cuongthai.com</code> và <code>i.giphy.com</code>. Mỗi dòng đọc một URL và in <code>OK &lt;tên miền&gt;</code> hoặc <code>REJECT &lt;lý do&gt;</code>: không phân tích được → <code>bad-url</code>; giao thức không phải <code>https:</code> → <code>protocol</code>; tên miền không nằm trong danh sách → <code>host</code>. Hãy phân tích bằng <code>new URL()</code> — regex sẽ thua trước <code>http://127.1</code>.</p>',
        stdin: 'https://media.cuongthai.com/a.png\nhttp://127.0.0.1:4404/admin/config\nhttp://127.1/\nfile:///etc/hostname\nkhong-phai-url\nhttps://evil.example/x\n',
        solution:
          "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\n" +
          "const ALLOW = new Set(['media.cuongthai.com', 'i.giphy.com']);\n" +
          'for (const line of lines) {\n' +
          '  let u;\n' +
          "  try { u = new URL(line.trim()); } catch { console.log('REJECT bad-url'); continue; }\n" +
          "  if (u.protocol !== 'https:') { console.log('REJECT protocol'); continue; }\n" +
          "  if (!ALLOW.has(u.hostname)) { console.log('REJECT host'); continue; }\n" +
          '  console.log(`OK ${u.hostname}`);\n' +
          '}\n',
      },
      {
        points: 2,
        en: '<p><b>Q3.</b> Write a deep merge that cannot be used to pollute the prototype. Read a base object and a patch object as JSON on two lines, merge the patch into a copy of the base recursively, and SKIP any key named <code>__proto__</code>, <code>constructor</code> or <code>prototype</code>. Print the merged object as JSON, then <code>polluted=&lt;true|false&gt;</code> where the check is <code>({}).isAdmin !== undefined</code>.</p>',
        vi: '<p><b>Câu 3.</b> Viết một hàm trộn sâu không thể bị lợi dụng để làm ô nhiễm nguyên mẫu. Đọc object gốc và object vá dưới dạng JSON trên hai dòng, trộn bản vá vào một bản sao của object gốc theo kiểu đệ quy, và BỎ QUA mọi khoá tên <code>__proto__</code>, <code>constructor</code> hoặc <code>prototype</code>. In object đã trộn dưới dạng JSON, rồi in <code>polluted=&lt;true|false&gt;</code> với phép kiểm là <code>({}).isAdmin !== undefined</code>.</p>',
        stdin: '{"name":"An","prefs":{"theme":"dark"}}\n{"prefs":{"lang":"vi"},"__proto__":{"isAdmin":true}}\n',
        solution:
          "const [baseLine, patchLine] = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\n" +
          "const DANGEROUS = new Set(['__proto__', 'constructor', 'prototype']);\n" +
          'function safeMerge(target, src) {\n' +
          '  for (const key of Object.keys(src)) {\n' +
          '    if (DANGEROUS.has(key)) continue;\n' +
          '    const v = src[key];\n' +
          "    if (v && typeof v === 'object' && !Array.isArray(v)) {\n" +
          "      const base = target[key] && typeof target[key] === 'object' ? { ...target[key] } : {};\n" +
          '      target[key] = safeMerge(base, v);\n' +
          '    } else target[key] = v;\n' +
          '  }\n' +
          '  return target;\n' +
          '}\n' +
          'const merged = safeMerge(structuredClone(JSON.parse(baseLine)), JSON.parse(patchLine));\n' +
          'console.log(JSON.stringify(merged));\n' +
          'console.log(`polluted=${({}).isAdmin !== undefined}`);\n',
      },
      {
        points: 2.5,
        en: '<p><b>Q4.</b> Redact before logging. Read one JSON log record per line and print it back with every value under a key named <code>password</code>, <code>token</code>, <code>authorization</code>, <code>cookie</code> or <code>secret</code> (case-insensitive, at ANY depth, inside arrays too) replaced by <code>[REDACTED]</code>. Also strip a <code>token=</code> or <code>code=</code> query parameter inside any string field named <code>url</code>, leaving <code>token=[REDACTED]</code>.</p>',
        vi: '<p><b>Câu 4.</b> Che bí mật trước khi ghi log. Mỗi dòng đọc một bản ghi log JSON và in lại nó với mọi giá trị nằm dưới khoá tên <code>password</code>, <code>token</code>, <code>authorization</code>, <code>cookie</code> hoặc <code>secret</code> (không phân biệt hoa thường, ở MỌI độ sâu, kể cả trong mảng) được thay bằng <code>[REDACTED]</code>. Ngoài ra, với trường chuỗi tên <code>url</code> thì cắt tham số truy vấn <code>token=</code> hoặc <code>code=</code>, thay bằng <code>token=[REDACTED]</code>.</p>',
        stdin: '{"msg":"login","body":{"email":"a@b.com","password":"MatKhauThat"}}\n{"headers":{"authorization":"Bearer eyJ","accept":"*/*"},"url":"/sse?token=abc123&x=1"}\n{"items":[{"secret":"s1"},{"ok":true}]}\n',
        solution:
          "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\n" +
          "const SECRET_KEYS = new Set(['password', 'token', 'authorization', 'cookie', 'secret']);\n" +
          'function redact(value, key) {\n' +
          "  if (key && SECRET_KEYS.has(key.toLowerCase())) return '[REDACTED]';\n" +
          '  if (Array.isArray(value)) return value.map((v) => redact(v));\n' +
          "  if (value && typeof value === 'object') {\n" +
          '    const out = {};\n' +
          '    for (const [k, v] of Object.entries(value)) out[k] = redact(v, k);\n' +
          '    return out;\n' +
          '  }\n' +
          "  if (typeof value === 'string' && key === 'url') {\n" +
          "    return value.replace(/([?&](?:token|code)=)[^&]+/gi, '$1[REDACTED]');\n" +
          '  }\n' +
          '  return value;\n' +
          '}\n' +
          'for (const line of lines) console.log(JSON.stringify(redact(JSON.parse(line))));\n',
      },
      {
        points: 2.5,
        en: '<p><b>Q5.</b> Bound the work before the regex runs. Read a max length on line 1, then one candidate per line, and decide with the pattern <code>/^(a+)+$/</code>. Print <code>&lt;len&gt; REJECT too-long</code> when the input exceeds the cap (WITHOUT running the regex), otherwise <code>&lt;len&gt; &lt;match|no-match&gt;</code>. A correct solution finishes instantly even with a 40-character input; running the regex first does not.</p>',
        vi: '<p><b>Câu 5.</b> Chặn khối lượng công việc TRƯỚC khi regex chạy. Dòng 1 đọc độ dài tối đa, rồi mỗi dòng một chuỗi cần xét, và dùng mẫu <code>/^(a+)+$/</code> để quyết định. In <code>&lt;độ dài&gt; REJECT too-long</code> khi đầu vào vượt ngưỡng (KHÔNG được chạy regex), còn lại thì in <code>&lt;độ dài&gt; &lt;match|no-match&gt;</code>. Lời giải đúng xong tức thì ngay cả với chuỗi 40 ký tự; chạy regex trước thì không.</p>',
        stdin: '20\naaaa\naaaab\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n',
        solution:
          "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\n" +
          'const MAX = Number(lines[0].trim());\n' +
          'const RE = /^(a+)+$/;\n' +
          'for (const s of lines.slice(1)) {\n' +
          '  // Chặn độ dài TRƯỚC: tăng trưởng hàm mũ trên đầu vào có giới hạn là chi phí có giới hạn.\n' +
          '  if (s.length > MAX) { console.log(`${s.length} REJECT too-long`); continue; }\n' +
          "  console.log(`${s.length} ${RE.test(s) ? 'match' : 'no-match'}`);\n" +
          '}\n',
      },
    ],
  },

  {
    code: 'PE-07',
    title: { en: 'Practical Exam 07 — uploads and object storage', vi: 'Thi thực hành 07 — upload và object storage' },
    desc: {
      en: 'Chapter 10: sniff the bytes, build the key, re-check what the signature never bound, and find the orphans.',
      vi: 'Chương 10: đánh hơi byte thật, dựng key, kiểm lại những gì chữ ký không ràng buộc, và tìm ra các object mồ côi.',
    },
    questions: [
      {
        points: 1.5,
        en: '<p><b>Q1.</b> Sniff the real type from magic bytes. Read one hex string per line (the first bytes of a file) and print <code>image/jpeg</code> (starts <code>ffd8ff</code>), <code>image/png</code> (<code>89504e47</code>), <code>image/gif</code> (<code>474946383</code>), <code>application/pdf</code> (<code>25504446</code>) or <code>unknown</code>. The client\'s declared MIME is not an input here — that is the point.</p>',
        vi: '<p><b>Câu 1.</b> Đánh hơi kiểu thật từ magic bytes. Mỗi dòng đọc một chuỗi hex (những byte đầu của một file) và in <code>image/jpeg</code> (bắt đầu bằng <code>ffd8ff</code>), <code>image/png</code> (<code>89504e47</code>), <code>image/gif</code> (<code>474946383</code>), <code>application/pdf</code> (<code>25504446</code>) hoặc <code>unknown</code>. Kiểu MIME do client khai KHÔNG phải đầu vào ở đây — và đó chính là điểm mấu chốt.</p>',
        stdin: 'ffd8ffdb004300030202020202030202\n89504e470d0a1a0a0000000d49484452\n4749463839612f2a2a2f3d313b3c7363\n3c3f7068702073797374656d28245f47\n255044462d312e340a25c7ec8fa2\n',
        solution:
          "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\n" +
          'const SIGNATURES = [\n' +
          "  ['ffd8ff', 'image/jpeg'],\n" +
          "  ['89504e47', 'image/png'],\n" +
          "  ['474946383', 'image/gif'],\n" +
          "  ['25504446', 'application/pdf'],\n" +
          '];\n' +
          'for (const line of lines) {\n' +
          '  const hex = line.trim().toLowerCase();\n' +
          '  const hit = SIGNATURES.find(([sig]) => hex.startsWith(sig));\n' +
          "  console.log(hit ? hit[1] : 'unknown');\n" +
          '}\n',
      },
      {
        points: 1.5,
        en: '<p><b>Q2.</b> Build storage keys the way the course does: <code>&lt;family&gt;/&lt;kind&gt;/u&lt;userId&gt;/&lt;timestamp&gt;-&lt;random&gt;&lt;ext&gt;</code>. Read <code>&lt;family&gt; &lt;kind&gt; &lt;userId&gt; &lt;timestamp&gt; &lt;originalName&gt;</code> per line. Take only the LAST extension from the original name, lowercase it, and never keep the rest of the name. Print the key with the random part written literally as <code>&lt;rand&gt;</code> so the output is deterministic, then on the next line <code>ownedBy=&lt;userId&gt;</code> extracted back OUT of the key with a regex.</p>',
        vi: '<p><b>Câu 2.</b> Dựng key lưu trữ đúng như giáo trình: <code>&lt;họ&gt;/&lt;loại&gt;/u&lt;idNgườiDùng&gt;/&lt;mốcThờiGian&gt;-&lt;ngẫuNhiên&gt;&lt;đuôi&gt;</code>. Mỗi dòng đọc <code>&lt;họ&gt; &lt;loại&gt; &lt;idNgườiDùng&gt; &lt;mốcThờiGian&gt; &lt;tênFileGốc&gt;</code>. Chỉ lấy phần mở rộng CUỐI CÙNG của tên gốc, đổi sang chữ thường, và tuyệt đối không giữ lại phần tên còn lại. In key với phần ngẫu nhiên ghi đúng chữ <code>&lt;rand&gt;</code> để kết quả xác định, rồi dòng kế in <code>ownedBy=&lt;idNgườiDùng&gt;</code> trích NGƯỢC ra từ chính key bằng một biểu thức chính quy.</p>',
        stdin: 'images post 7 1753660000000 IMG_0001.JPG\nvideo post 42 1753660001234 anh cua toi.final.MP4\ndocuments cv 3 1753660002000 shell.php.png\n',
        solution:
          "const path = require('node:path');\n" +
          "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\n" +
          'for (const line of lines) {\n' +
          "  const [family, kind, userId, ts, ...nameParts] = line.trim().split(/\\s+/);\n" +
          "  const ext = path.extname(nameParts.join(' ')).toLowerCase();\n" +
          '  const key = `${family}/${kind}/u${userId}/${ts}-<rand>${ext}`;\n' +
          '  console.log(key);\n' +
          "  const owner = key.match(/\\/u(\\d+)\\//)?.[1] ?? 'unknown';\n" +
          '  console.log(`ownedBy=${owner}`);\n' +
          '}\n',
      },
      {
        points: 2,
        en: '<p><b>Q3.</b> Enforce the upload policy. Read <code>&lt;declaredMime&gt; &lt;filename&gt; &lt;bytes&gt; &lt;sniffedMime&gt;</code> per line and print <code>ACCEPT</code> or <code>REJECT &lt;reason&gt;</code>, checked in this order: dangerous extension (<code>.html .htm .svg .js .mjs .php .phtml .xml</code>) → <code>active-content</code>; declared MIME in <code>text/html, image/svg+xml, application/javascript</code> → <code>active-content</code>; sniffed MIME not starting with <code>image/</code> → <code>not-an-image</code>; bytes above 10485760 → <code>too-large</code>.</p>',
        vi: '<p><b>Câu 3.</b> Áp dụng chính sách upload. Mỗi dòng đọc <code>&lt;mimeKhaiBáo&gt; &lt;tênFile&gt; &lt;sốByte&gt; &lt;mimeĐánhHơi&gt;</code> và in <code>ACCEPT</code> hoặc <code>REJECT &lt;lý do&gt;</code>, kiểm theo đúng thứ tự: đuôi nguy hiểm (<code>.html .htm .svg .js .mjs .php .phtml .xml</code>) → <code>active-content</code>; MIME khai báo nằm trong <code>text/html, image/svg+xml, application/javascript</code> → <code>active-content</code>; MIME đánh hơi không bắt đầu bằng <code>image/</code> → <code>not-an-image</code>; số byte vượt 10485760 → <code>too-large</code>.</p>',
        stdin: 'image/png anh.png 204800 image/png\nimage/png shell.php.png 1024 unknown\nimage/jpeg trang.html 2048 unknown\nimage/svg+xml logo.svg 900 unknown\nimage/jpeg to-qua.jpg 20971520 image/jpeg\n',
        solution:
          "const path = require('node:path');\n" +
          "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\n" +
          "const DANGEROUS_EXT = new Set(['.html', '.htm', '.svg', '.js', '.mjs', '.php', '.phtml', '.xml']);\n" +
          "const DANGEROUS_MIME = new Set(['text/html', 'image/svg+xml', 'application/javascript']);\n" +
          'const MAX = 10485760;\n' +
          'for (const line of lines) {\n' +
          "  const [declared, name, bytes, sniffed] = line.trim().split(/\\s+/);\n" +
          '  const ext = path.extname(name).toLowerCase();\n' +
          "  if (DANGEROUS_EXT.has(ext)) { console.log('REJECT active-content'); continue; }\n" +
          "  if (DANGEROUS_MIME.has(declared)) { console.log('REJECT active-content'); continue; }\n" +
          "  if (!sniffed.startsWith('image/')) { console.log('REJECT not-an-image'); continue; }\n" +
          "  if (Number(bytes) > MAX) { console.log('REJECT too-large'); continue; }\n" +
          "  console.log('ACCEPT');\n" +
          '}\n',
      },
      {
        points: 2.5,
        en: '<p><b>Q4.</b> Finish a presigned upload safely. Line 1 is a JSON map of the objects that really exist in storage (<code>key -&gt; size</code>), the rest are completion calls <code>&lt;key&gt; &lt;declaredSize&gt;</code>. The signature bound the method and the key, never the size or the body, so re-check everything: the key must match <code>^video/[\\w./-]+$</code> and contain no <code>..</code> → else <code>400 BAD_KEY</code>; the object must exist → else <code>404 NOT_UPLOADED</code>; the REAL size must be at most 104857600 → else <code>413 TOO_LARGE delete=&lt;key&gt;</code>; otherwise <code>201 &lt;key&gt; &lt;realSize&gt;</code>.</p>',
        vi: '<p><b>Câu 4.</b> Hoàn tất một lần upload presigned cho an toàn. Dòng 1 là map JSON các object THẬT SỰ có trong kho (<code>key -&gt; kích thước</code>), các dòng sau là lời gọi hoàn tất <code>&lt;key&gt; &lt;kíchThướcKhaiBáo&gt;</code>. Chữ ký chỉ ràng buộc phương thức và key, không ràng buộc kích thước hay nội dung, nên phải kiểm lại tất cả: key phải khớp <code>^video/[\\w./-]+$</code> và không chứa <code>..</code> → nếu không thì <code>400 BAD_KEY</code>; object phải tồn tại → nếu không thì <code>404 NOT_UPLOADED</code>; kích thước THẬT phải tối đa 104857600 → nếu không thì <code>413 TOO_LARGE delete=&lt;key&gt;</code>; còn lại thì <code>201 &lt;key&gt; &lt;kíchThướcThật&gt;</code>.</p>',
        stdin: '{"video/post/u7/1-a.mp4":5242880,"video/post/u7/2-b.mp4":209715200}\nvideo/post/u7/1-a.mp4 5242880\nvideo/post/u7/2-b.mp4 5242880\nvideo/post/u7/3-c.mp4 1024\nvideo/../etc/passwd 10\n',
        solution:
          "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\n" +
          'const storage = JSON.parse(lines[0]);\n' +
          'const MAX = 104857600;\n' +
          'for (const line of lines.slice(1)) {\n' +
          "  const [key] = line.trim().split(/\\s+/);\n" +
          "  if (!/^video\\/[\\w./-]+$/.test(key) || key.includes('..')) { console.log('400 BAD_KEY'); continue; }\n" +
          "  if (!(key in storage)) { console.log('404 NOT_UPLOADED'); continue; }\n" +
          '  const realSize = storage[key];\n' +
          '  // Kích thước client khai lúc xin ký chỉ là đầu vào cho phép kiểm CỦA BẠN.\n' +
          '  if (realSize > MAX) { console.log(`413 TOO_LARGE delete=${key}`); continue; }\n' +
          '  console.log(`201 ${key} ${realSize}`);\n' +
          '}\n',
      },
      {
        points: 2.5,
        en: '<p><b>Q5.</b> Find the orphans a storage bill is made of. Line 1 is a JSON array of every key in the bucket, line 2 a JSON array of the keys referenced by rows in the database, line 3 a JSON array of <code>{ key, ageHours }</code> pending uploads. Print <code>orphan &lt;key&gt;</code> for every stored key that no row references AND that is not a pending upload younger than 24 hours (in bucket order), then <code>missing &lt;key&gt;</code> for every referenced key with no object behind it, then <code>orphans=&lt;n&gt; missing=&lt;n&gt;</code>.</p>',
        vi: '<p><b>Câu 5.</b> Tìm những object mồ côi làm nên hoá đơn lưu trữ. Dòng 1 là mảng JSON mọi key trong bucket, dòng 2 là mảng JSON các key đang được bản ghi trong cơ sở dữ liệu tham chiếu, dòng 3 là mảng JSON các <code>{ key, ageHours }</code> đang chờ hoàn tất. In <code>orphan &lt;key&gt;</code> cho mỗi key có trong kho mà không bản ghi nào tham chiếu VÀ không phải một upload đang chờ dưới 24 giờ (theo thứ tự trong bucket), rồi in <code>missing &lt;key&gt;</code> cho mỗi key được tham chiếu mà chẳng có object nào phía sau, rồi in <code>orphans=&lt;n&gt; missing=&lt;n&gt;</code>.</p>',
        stdin: '["images/a.png","images/b.png","video/c.mp4","video/d.mp4"]\n["images/a.png","images/z.png"]\n[{"key":"video/c.mp4","ageHours":2},{"key":"video/d.mp4","ageHours":48}]\n',
        solution:
          "const [sLine, rLine, pLine] = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\n" +
          'const stored = JSON.parse(sLine);\n' +
          'const referenced = new Set(JSON.parse(rLine));\n' +
          'const pending = new Map(JSON.parse(pLine).map((p) => [p.key, p.ageHours]));\n' +
          'let orphans = 0, missing = 0;\n' +
          'for (const key of stored) {\n' +
          '  if (referenced.has(key)) continue;\n' +
          '  const age = pending.get(key);\n' +
          '  if (age !== undefined && age < 24) continue;   // còn trong hạn chờ hoàn tất\n' +
          '  orphans++;\n' +
          '  console.log(`orphan ${key}`);\n' +
          '}\n' +
          'const storedSet = new Set(stored);\n' +
          'for (const key of referenced) {\n' +
          '  if (storedSet.has(key)) continue;\n' +
          '  missing++;\n' +
          '  console.log(`missing ${key}`);\n' +
          '}\n' +
          'console.log(`orphans=${orphans} missing=${missing}`);\n',
      },
    ],
  },
];
