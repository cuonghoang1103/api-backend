/**
 * Socket.IO — Practical Exam (PE): 5 câu thực hành, nộp .zip. Tổng 10 điểm.
 *
 * Đề tự soạn, bám sát `content/courses/socket-io/s00…s11`. Khác đề FE (50 câu
 * trắc nghiệm, đọc packet), đề này bắt VIẾT hiện vật chạy được: một bộ giải mã
 * packet trên dây, một máy trạng thái nối-lại, một tầng presence có đếm tham
 * chiếu, một tầng giao hàng ack + thử lại + khử trùng lặp, và một gateway
 * socket.io thật.
 *
 * ⚠️ VÌ SAO BỐN TRONG NĂM CÂU LÀ JAVASCRIPT THUẦN, KHÔNG `require('socket.io')`.
 *
 *   `scripts/exam-check.mjs` chạy `sampleSolution` trong một thư mục tạm
 *   (`mkdtemp` dưới `os.tmpdir()`), và thư mục đó KHÔNG có `node_modules`. Đo
 *   thật 08/09/2026 trên Node v22.21.0: `require('socket.io')` ở đó chết bằng
 *   `MODULE_NOT_FOUND`. Nên một đề socket.io mà câu nào cũng gọi thư viện thì
 *   không có câu nào tự kiểm được, và cả file sẽ phải xin miễn.
 *
 *   Vì thế Q1–Q4 hỏi đúng phần NGỮ NGHĨA mà một kỹ sư realtime phải nắm — khuôn
 *   packet, thang giãn cách, phép đếm khán giả, khử trùng lặp theo id — dưới
 *   dạng chương trình đọc stdin, in stdout, tự thoát. Chúng CHẠY THẬT trong bộ
 *   kiểm. Chỉ Q5 cần một server socket.io sống, và nó khai `khongChayDuoc`.
 *
 * ⚠️ MỌI `expectedOutput` DƯỚI ĐÂY LÀ STDOUT THẬT của `sampleSolution` tương
 * ứng, và ba câu trong số đó còn được ĐỐI CHIẾU NGƯỢC với chính socket.io:
 *
 *   • Q1: 15 frame trong phần INPUT là packet NGUYÊN VĂN bắt được trên dây từ
 *     socket.io 4.8.3 (`420[...]`, `430[...]`, `451-[...]`, `40/admin,{...}`,
 *     `44/chat,{...}`, `41/chat,`, `2`, `3`, `5`, `6`). Bản giải mã của lời
 *     giải mẫu đã được so từng trường với `socket.io-parser` v5.2.3 +
 *     `engine.io-parser` v5.2.3 — khớp cả 15.
 *
 *   • Q2: thang giãn cách của lời giải mẫu được so với chính lớp `Backoff` mà
 *     `socket.io-client` 4.8.3 dùng, chạy với đúng dãy `Math.random()` đã ghi
 *     trong INPUT. Kết quả trùng khít: 1050, 1580, 2260, 5000, 5000, 1495,
 *     1760. Nhóm "không tự nối lại" cũng đo thật, kể cả `parse error` (nó CÓ
 *     nối lại — xem chú thích đầu file `SOCKET-IO-FE.mjs`).
 *
 *   • Q5: gateway chạy thật 3 lượt liên tiếp, stdout giống nhau từng byte; các
 *     chuỗi `reason=client namespace disconnect` và `rooms=2` trong khối kết
 *     quả là do máy in ra, không phải chép từ tài liệu.
 *
 * Kiểm: node scripts/exam-check.mjs ./content/exams/SOCKET-IO-PE.mjs
 * Seed:  node scripts/academy-seed-exam.mjs --file ./content/exams/SOCKET-IO-PE.mjs --apply
 */
import { B, c, codeQ } from './_lib/socketio-exam-kit.mjs';

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
  '<li>Create five files named <code>Q1.js … Q5.js</code>. <b>Q1 to Q4 are plain Node.js with no npm packages at all</b> — they read their input from <b>stdin</b> and write the answer to <b>stdout</b>. Test each one with <code>node Q1.js &lt; input.txt</code>, or paste the input and press Ctrl+D.</li>' +
  '<li><b>Q5 is different</b>: it needs <code>socket.io</code> and <code>socket.io-client</code> installed, it starts its own HTTP server on port 0, drives its own clients in the same process, prints a transcript and exits. Copy the starter block in <b>verbatim</b> and write only between the two <code>ĐỀ CHO SẴN</code> markers — the harness at the bottom is part of the grading.</li>' +
  '<li>The "expected output" block of every question shows the exact input used and the exact output required — <b>match it line for line</b>. Every one of those blocks is real stdout from a real run, not a description of one.</li>' +
  '<li>Every program must <b>exit on its own</b>. A server left listening, a timer left pending or an ack still being awaited will hang the grader, and a program that never exits scores nothing however correct its logic.</li>' +
  '<li>Zip the five files into <b>one .zip</b> and upload it in the submit box.</li>' +
  '</ol>' +
  '<p><b>How it is graded.</b> Output first — a program whose stdout does not match cannot pass. But this is a realtime exam, so the <b>shape</b> of the answer is graded too: state keyed by <code>socket.id</code> where it should be keyed by user, a broadcast that reaches everyone where a room would do, a timer or a pending-ack entry that is never cleared on disconnect, and a map that grows without a bound all cost marks <em>even when the transcript matches</em>. Ask of every handler: who exactly receives this packet, and what is left behind when this socket goes away?</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  '<p><b>Cách làm bài thi.</b></p>' +
  '<ol>' +
  '<li>Tạo năm file tên <code>Q1.js … Q5.js</code>. <b>Câu 1 tới câu 4 là Node.js thuần, không dùng gói npm nào cả</b> — chúng đọc dữ liệu vào từ <b>stdin</b> và in kết quả ra <b>stdout</b>. Chạy thử từng cái bằng <code>node Q1.js &lt; input.txt</code>, hoặc dán dữ liệu vào rồi bấm Ctrl+D.</li>' +
  '<li><b>Câu 5 thì khác</b>: nó cần cài <code>socket.io</code> và <code>socket.io-client</code>, nó tự dựng máy chủ HTTP ở cổng 0, tự lái các client trong cùng tiến trình, in ra một bản ghi rồi thoát. Chép khối mã cho sẵn vào <b>nguyên văn</b> và chỉ viết ở vùng giữa hai mốc <code>ĐỀ CHO SẴN</code> — phần khung chạy ở cuối file là một phần của việc chấm.</li>' +
  '<li>Khối "kết quả mong đợi" của mỗi câu ghi rõ dữ liệu vào đã dùng và kết quả bắt buộc phải ra — <b>hãy khớp từng dòng</b>. Mọi khối đó đều là stdout thật của một lượt chạy thật, không phải lời mô tả về nó.</li>' +
  '<li>Mọi chương trình phải <b>tự thoát</b>. Một máy chủ còn nghe, một timer còn treo hay một ack còn đang chờ sẽ làm bộ chấm treo, và một chương trình không bao giờ thoát thì không được điểm nào dù logic có đúng tới đâu.</li>' +
  '<li>Nén năm file thành <b>một file .zip</b> rồi tải lên ô nộp bài.</li>' +
  '</ol>' +
  '<p><b>Chấm thế nào.</b> Kết quả in ra trước — một chương trình có stdout không khớp thì không thể qua. Nhưng đây là bài thi realtime, nên <b>hình dạng</b> của lời giải cũng bị chấm: trạng thái khoá theo <code>socket.id</code> ở chỗ đáng lẽ phải khoá theo người dùng, một lượt broadcast tới cả hệ thống ở chỗ một room là đủ, một timer hay một mục ack đang chờ không bao giờ được dọn khi disconnect, và một map phình vô hạn — tất cả đều bị trừ điểm <em>ngay cả khi bản ghi khớp</em>. Hãy hỏi từng handler một: chính xác ai nhận cái packet này, và còn lại thứ gì khi cái socket này biến mất?</p>' +
  '</div>';

/* ─────────────────────────── Câu 1 ─────────────────────────── */

const Q1_STARTER =
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  "// Đọc toàn bộ stdin. Mỗi dòng là MỘT frame engine.io bắt được trên dây.\n" +
  "const lines = require('node:fs').readFileSync(0, 'utf8').split('\\n').filter((l) => l.length);\n" +
  '\n' +
  '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  '\n' +
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '// In đúng một dòng cho mỗi frame, theo thứ tự đã đọc.\n';

const Q1_SOLUTION =
  "const lines = require('node:fs').readFileSync(0, 'utf8').split('\\n').filter((l) => l.length);\n" +
  '\n' +
  "const ENGINE = { 0: 'OPEN', 1: 'CLOSE', 2: 'PING', 3: 'PONG', 4: 'MESSAGE', 5: 'UPGRADE', 6: 'NOOP' };\n" +
  "const SIO = { 0: 'CONNECT', 1: 'DISCONNECT', 2: 'EVENT', 3: 'ACK', 4: 'CONNECT_ERROR', 5: 'BINARY_EVENT', 6: 'BINARY_ACK' };\n" +
  '\n' +
  'for (const frame of lines) {\n' +
  '  const eng = ENGINE[frame[0]];\n' +
  '\n' +
  '  // Thứ gì không phải MESSAGE thì không cõng packet socket.io nào cả.\n' +
  "  if (eng !== 'MESSAGE') {\n" +
  "    if (eng === 'OPEN') {\n" +
  '      const h = JSON.parse(frame.slice(1));\n' +
  "      console.log('OPEN sid=' + h.sid + ' pingInterval=' + h.pingInterval + ' pingTimeout=' + h.pingTimeout);\n" +
  '    } else {\n' +
  '      console.log(eng);\n' +
  '    }\n' +
  '    continue;\n' +
  '  }\n' +
  '\n' +
  '  let rest = frame.slice(1);\n' +
  '  const type = SIO[rest[0]];\n' +
  '  rest = rest.slice(1);\n' +
  '\n' +
  '  // BINARY_EVENT / BINARY_ACK đặt "<n>-" TRƯỚC namespace.\n' +
  '  let attachments = null;\n' +
  '  const dash = /^(\\d+)-/.exec(rest);\n' +
  "  if (dash && (type === 'BINARY_EVENT' || type === 'BINARY_ACK')) {\n" +
  '    attachments = Number(dash[1]);\n' +
  '    rest = rest.slice(dash[0].length);\n' +
  '  }\n' +
  '\n' +
  '  // Namespace chỉ xuất hiện khi phần còn lại bắt đầu bằng "/", và nó kết\n' +
  '  // thúc ở dấu phẩy đầu tiên. Namespace mặc định thì không viết gì cả.\n' +
  "  let nsp = '/';\n" +
  "  if (rest.startsWith('/')) {\n" +
  "    const comma = rest.indexOf(',');\n" +
  '    if (comma === -1) { nsp = rest; rest = null; }\n' +
  '    else { nsp = rest.slice(0, comma); rest = rest.slice(comma + 1); }\n' +
  '  }\n' +
  '\n' +
  '  // Rồi tới ack id (có thể không có), rồi phần JSON còn lại (cũng có thể không).\n' +
  '  const idm = /^(\\d+)/.exec(rest);\n' +
  "  const ack = idm ? idm[1] : '-';\n" +
  '  if (idm) rest = rest.slice(idm[0].length);\n' +
  '  const payload = rest && rest.length ? JSON.parse(rest) : null;\n' +
  '\n' +
  "  if (type === 'CONNECT') console.log('CONNECT nsp=' + nsp + ' sid=' + (payload ? payload.sid : '-'));\n" +
  "  else if (type === 'DISCONNECT') console.log('DISCONNECT nsp=' + nsp);\n" +
  "  else if (type === 'CONNECT_ERROR') console.log('CONNECT_ERROR nsp=' + nsp + ' message=' + payload.message);\n" +
  "  else if (type === 'ACK') console.log('ACK nsp=' + nsp + ' ack=' + ack);\n" +
  "  else if (type === 'BINARY_ACK') console.log('BINARY_ACK nsp=' + nsp + ' ack=' + ack + ' attachments=' + attachments);\n" +
  "  else if (type === 'EVENT') console.log('EVENT nsp=' + nsp + ' name=' + payload[0] + ' ack=' + ack);\n" +
  "  else if (type === 'BINARY_EVENT') console.log('BINARY_EVENT nsp=' + nsp + ' name=' + payload[0] + ' ack=' + ack + ' attachments=' + attachments);\n" +
  '}\n';

const Q1_OUTPUT =
  'INPUT:\n' +
  '0{"sid":"A6HoDAHbgW7s-JwMAAAA","upgrades":["websocket"],"pingInterval":25000,"pingTimeout":20000,"maxPayload":1000000}\n' +
  '40{"sid":"VZSneazpeNjNBsgQAAAA"}\n' +
  '2\n' +
  '3\n' +
  '420["ev",{"x":1}]\n' +
  '430["ok",2]\n' +
  '42["sendbin"]\n' +
  '451-["blob",{"_placeholder":true,"num":0},{"meta":1}]\n' +
  '40/admin,{"sid":"wWaZ7cZ4apx-2ps9AAAB"}\n' +
  '42/chat,0["q",1]\n' +
  '43/chat,0["r"]\n' +
  '41/chat,\n' +
  '44/chat,{"message":"nope","data":{"code":42}}\n' +
  '5\n' +
  '6\n' +
  'OUTPUT:\n' +
  'OPEN sid=A6HoDAHbgW7s-JwMAAAA pingInterval=25000 pingTimeout=20000\n' +
  'CONNECT nsp=/ sid=VZSneazpeNjNBsgQAAAA\n' +
  'PING\n' +
  'PONG\n' +
  'EVENT nsp=/ name=ev ack=0\n' +
  'ACK nsp=/ ack=0\n' +
  'EVENT nsp=/ name=sendbin ack=-\n' +
  'BINARY_EVENT nsp=/ name=blob ack=- attachments=1\n' +
  'CONNECT nsp=/admin sid=wWaZ7cZ4apx-2ps9AAAB\n' +
  'EVENT nsp=/chat name=q ack=0\n' +
  'ACK nsp=/chat ack=0\n' +
  'DISCONNECT nsp=/chat\n' +
  'CONNECT_ERROR nsp=/chat message=nope\n' +
  'UPGRADE\n' +
  'NOOP';

/* ─────────────────────────── Câu 2 ─────────────────────────── */

const Q2_STARTER =
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  "const raw = require('node:fs').readFileSync(0, 'utf8').split('\\n').filter((l) => l.length);\n" +
  'const [min, max, factor, jitter] = raw[0].trim().split(/\\s+/).map(Number);\n' +
  'const rands = raw[1].trim().split(/\\s+/).map(Number);\n' +
  'const events = raw.slice(2).map((l) => l.trim());\n' +
  '\n' +
  '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  '\n' +
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '// Một dòng cho mỗi sự kiện, rồi một dòng tổng kết.\n';

const Q2_SOLUTION =
  "const raw = require('node:fs').readFileSync(0, 'utf8').split('\\n').filter((l) => l.length);\n" +
  'const [min, max, factor, jitter] = raw[0].trim().split(/\\s+/).map(Number);\n' +
  'const rands = raw[1].trim().split(/\\s+/).map(Number);\n' +
  'const events = raw.slice(2).map((l) => l.trim());\n' +
  '\n' +
  '// Hai lý do duy nhất mà client không tự thử lại: có ai đó đã gọi\n' +
  '// disconnect(), ở phía này hoặc phía kia. Mọi thứ còn lại là tai nạn.\n' +
  "const MANUAL = new Set(['io server disconnect', 'io client disconnect']);\n" +
  '\n' +
  'let attempts = 0;\n' +
  'let cursor = 0;\n' +
  '\n' +
  '// Nguyên văn backo2: bộ đếm lượt được ĐỌC rồi mới tăng, cùng MỘT số ngẫu\n' +
  '// nhiên quyết định cả độ lớn lệch lẫn dấu, và trần áp SAU jitter chứ không\n' +
  '// phải trước.\n' +
  'function duration() {\n' +
  '  let ms = min * Math.pow(factor, attempts++);\n' +
  '  if (jitter) {\n' +
  '    const rand = rands[cursor++];\n' +
  '    const deviation = Math.floor(rand * jitter * ms);\n' +
  '    ms = (Math.floor(rand * 10) & 1) === 0 ? ms - deviation : ms + deviation;\n' +
  '  }\n' +
  '  return Math.min(ms, max) | 0;\n' +
  '}\n' +
  '\n' +
  'for (const ev of events) {\n' +
  "  if (ev === 'connect') { attempts = 0; console.log('connect reset'); continue; }\n" +
  "  if (MANUAL.has(ev)) { console.log(ev + ' reconnect=no'); continue; }\n" +
  '  const d = duration();\n' +
  "  console.log(ev + ' reconnect=yes attempt=' + attempts + ' delay=' + d);\n" +
  '}\n' +
  "console.log('attempts=' + attempts + ' randUsed=' + cursor);\n";

const Q2_OUTPUT =
  'INPUT:\n' +
  '1000 5000 2 0.5\n' +
  '0.10 0.42 0.87 0.03 0.55 0.99 0.24 0.71 0.36\n' +
  'transport close\n' +
  'ping timeout\n' +
  'transport error\n' +
  'transport close\n' +
  'transport close\n' +
  'connect\n' +
  'parse error\n' +
  'io server disconnect\n' +
  'io client disconnect\n' +
  'transport close\n' +
  'OUTPUT:\n' +
  'transport close reconnect=yes attempt=1 delay=1050\n' +
  'ping timeout reconnect=yes attempt=2 delay=1580\n' +
  'transport error reconnect=yes attempt=3 delay=2260\n' +
  'transport close reconnect=yes attempt=4 delay=5000\n' +
  'transport close reconnect=yes attempt=5 delay=5000\n' +
  'connect reset\n' +
  'parse error reconnect=yes attempt=1 delay=1495\n' +
  'io server disconnect reconnect=no\n' +
  'io client disconnect reconnect=no\n' +
  'transport close reconnect=yes attempt=2 delay=1760\n' +
  'attempts=2 randUsed=7';

/* ─────────────────────────── Câu 3 ─────────────────────────── */

const Q3_STARTER =
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  "const lines = require('node:fs').readFileSync(0, 'utf8').split('\\n').filter((l) => l.trim().length);\n" +
  '\n' +
  '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  '\n' +
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '// Một dòng cho mỗi CONNECT/DISCONNECT, rồi một dòng tổng kết chi phí.\n';

const Q3_SOLUTION =
  "const lines = require('node:fs').readFileSync(0, 'utf8').split('\\n').filter((l) => l.trim().length);\n" +
  '\n' +
  'const friends = new Map();        // userId   -> Set<userId>\n' +
  'const socketsByUser = new Map();  // userId   -> Set<socketId>   (phép đếm tham chiếu)\n' +
  'const userBySocket = new Map();   // socketId -> userId\n' +
  'let targeted = 0;\n' +
  'let naive = 0;\n' +
  '\n' +
  'const link = (a, b) => {\n' +
  '  if (!friends.has(a)) friends.set(a, new Set());\n' +
  '  friends.get(a).add(b);\n' +
  '};\n' +
  '\n' +
  'const onlineSockets = () => {\n' +
  '  let n = 0;\n' +
  '  for (const set of socketsByUser.values()) n += set.size;\n' +
  '  return n;\n' +
  '};\n' +
  '\n' +
  '// Khán giả là những người bạn ĐANG online, và mỗi socket của họ nhận một\n' +
  '// packet — đó đúng là chi phí của io.to("user:<id>") tính trên mỗi người nhận.\n' +
  'const audienceOf = (user) => {\n' +
  '  const out = [];\n' +
  '  for (const f of [...(friends.get(user) || [])].sort()) {\n' +
  '    const set = socketsByUser.get(f);\n' +
  '    if (set && set.size) out.push(...[...set].sort());\n' +
  '  }\n' +
  '  return out;\n' +
  '};\n' +
  '\n' +
  'const presence = (verb, user) => {\n' +
  '  const to = audienceOf(user);\n' +
  '  targeted += to.length;\n' +
  '  naive += onlineSockets();   // io.emit sẽ tốn đúng chừng này cho sự kiện đó\n' +
  "  console.log(verb + ' ' + user + ' to=' + (to.length ? to.join(',') : '-') + ' packets=' + to.length);\n" +
  '};\n' +
  '\n' +
  'for (const raw of lines) {\n' +
  '  const parts = raw.trim().split(/\\s+/);\n' +
  '\n' +
  "  if (parts[0] === 'FRIENDS') {\n" +
  '    const [, a, ...rest] = parts;\n' +
  '    for (const b of rest) { link(a, b); link(b, a); }\n' +
  '    continue;\n' +
  '  }\n' +
  '\n' +
  "  if (parts[0] === 'CONNECT') {\n" +
  '    const [, user, sock] = parts;\n' +
  '    userBySocket.set(sock, user);\n' +
  '    if (!socketsByUser.has(user)) socketsByUser.set(user, new Set());\n' +
  '    const set = socketsByUser.get(user);\n' +
  '    set.add(sock);\n' +
  '    // Chỉ lần vượt ngưỡng 0 -> 1 mới là một thay đổi presence.\n' +
  "    if (set.size === 1) presence('ONLINE', user);\n" +
  "    else console.log('TAB+ ' + user + ' tabs=' + set.size);\n" +
  '    continue;\n' +
  '  }\n' +
  '\n' +
  "  if (parts[0] === 'DISCONNECT') {\n" +
  '    const [, sock] = parts;\n' +
  '    const user = userBySocket.get(sock);\n' +
  "    if (!user) { console.log('IGNORE ' + sock); continue; }\n" +
  '    userBySocket.delete(sock);\n' +
  '    const set = socketsByUser.get(user);\n' +
  '    set.delete(sock);\n' +
  '    if (set.size === 0) {\n' +
  '      // Xoá TRƯỚC khi phát, để người vừa rời không bị tính vào fanout của chính mình.\n' +
  '      socketsByUser.delete(user);\n' +
  "      presence('OFFLINE', user);\n" +
  '    } else {\n' +
  "      console.log('TAB- ' + user + ' tabs=' + set.size);\n" +
  '    }\n' +
  '  }\n' +
  '}\n' +
  '\n' +
  "console.log('targeted=' + targeted + ' naive=' + naive);\n";

const Q3_OUTPUT =
  'INPUT:\n' +
  'FRIENDS u1 u2 u3\n' +
  'FRIENDS u2 u4\n' +
  'FRIENDS u5 u1\n' +
  'CONNECT u2 s20\n' +
  'CONNECT u3 s30\n' +
  'CONNECT u1 s10\n' +
  'CONNECT u1 s11\n' +
  'CONNECT u4 s40\n' +
  'CONNECT u5 s50\n' +
  'DISCONNECT s10\n' +
  'DISCONNECT s11\n' +
  'DISCONNECT s99\n' +
  'CONNECT u1 s12\n' +
  'DISCONNECT s20\n' +
  'DISCONNECT s30\n' +
  'OUTPUT:\n' +
  'ONLINE u2 to=- packets=0\n' +
  'ONLINE u3 to=- packets=0\n' +
  'ONLINE u1 to=s20,s30 packets=2\n' +
  'TAB+ u1 tabs=2\n' +
  'ONLINE u4 to=s20 packets=1\n' +
  'ONLINE u5 to=s10,s11 packets=2\n' +
  'TAB- u1 tabs=1\n' +
  'OFFLINE u1 to=s20,s30,s50 packets=3\n' +
  'IGNORE s99\n' +
  'ONLINE u1 to=s20,s30,s50 packets=3\n' +
  'OFFLINE u2 to=s12,s40 packets=2\n' +
  'OFFLINE u3 to=s12 packets=1\n' +
  'targeted=14 naive=33';

/* ─────────────────────────── Câu 4 ─────────────────────────── */

const Q4_STARTER =
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  "const lines = require('node:fs').readFileSync(0, 'utf8').split('\\n').filter((l) => l.trim().length);\n" +
  'const maxAttempts = Number(lines[0].trim());\n' +
  '\n' +
  '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  '\n' +
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '// Một dòng cho mỗi tin nhắn, rồi hai dòng tổng kết.\n';

const Q4_SOLUTION =
  "const lines = require('node:fs').readFileSync(0, 'utf8').split('\\n').filter((l) => l.trim().length);\n" +
  'const maxAttempts = Number(lines[0].trim());\n' +
  '\n' +
  '// ── phía máy chủ: nhận ít-nhất-một-lần, áp dụng đúng-một-lần ────────────\n' +
  'const applied = [];        // bản ghi mà người nhận thật sự thấy\n' +
  'const seen = new Set();    // tầng khử trùng lặp — ngoài đời là một UNIQUE index\n' +
  'let received = 0;          // mọi packet đã tới được máy chủ\n' +
  'let duplicates = 0;        // số packet mà tầng khử trùng lặp vứt đi\n' +
  '\n' +
  'function serverReceive(id, text) {\n' +
  '  received++;\n' +
  '  if (seen.has(id)) { duplicates++; return; }\n' +
  '  seen.add(id);\n' +
  "  applied.push(id + ':' + text);\n" +
  '}\n' +
  '\n' +
  '// ── phía client: ack + thời hạn + thử lại, khoá bằng id do CLIENT sinh ──\n' +
  'for (const raw of lines.slice(1)) {\n' +
  '  const [id, text, ...script] = raw.trim().split(/\\s+/);\n' +
  '  let attempts = 0;\n' +
  '  let delivered = false;\n' +
  '\n' +
  '  for (const outcome of script) {\n' +
  '    if (attempts >= maxAttempts) break;\n' +
  '    attempts++;\n' +
  "    if (outcome === 'lost') continue;   // chưa từng tới được máy chủ\n" +
  '    serverReceive(id, text);            // nó có tới máy chủ\n' +
  "    if (outcome === 'ok') { delivered = true; break; }\n" +
  "    // 'ackLost': đã áp dụng trên máy chủ, nhưng ack không quay về — và client\n" +
  "    // không phân biệt được ca này với 'lost', nên đằng nào nó cũng thử lại.\n" +
  '  }\n' +
  '\n' +
  "  console.log(id + ' ' + (delivered ? 'DELIVERED' : 'FAILED') + ' attempts=' + attempts);\n" +
  '}\n' +
  '\n' +
  "console.log('applied=' + applied.join(','));\n" +
  "console.log('received=' + received + ' duplicates=' + duplicates);\n";

const Q4_OUTPUT =
  'INPUT:\n' +
  '3\n' +
  'm1 hello ok\n' +
  'm2 chao lost lost ok\n' +
  'm3 hi ackLost ok\n' +
  'm4 bye lost lost lost ok\n' +
  'm5 yo ackLost ackLost ackLost\n' +
  'OUTPUT:\n' +
  'm1 DELIVERED attempts=1\n' +
  'm2 DELIVERED attempts=3\n' +
  'm3 DELIVERED attempts=2\n' +
  'm4 FAILED attempts=3\n' +
  'm5 FAILED attempts=3\n' +
  'applied=m1:hello,m2:chao,m3:hi,m5:yo\n' +
  'received=7 duplicates=3';

/* ─────────────────────────── Câu 5 ─────────────────────────── */

const Q5_STARTER =
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  "const http = require('node:http');\n" +
  "const { Server } = require('socket.io');\n" +
  "const { io: Client } = require('socket.io-client');\n" +
  '\n' +
  "const USERS = { 'tok-an': 'u1', 'tok-binh': 'u2', 'tok-cuong': 'u3' };\n" +
  "const FRIENDS = { u1: ['u2'], u2: ['u1', 'u3'], u3: ['u2'] };\n" +
  "const THREAD_MEMBERS = { t1: ['u1', 'u2'] };\n" +
  'const log = (...a) => console.log(...a);\n' +
  '\n' +
  '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  '// Phải khai báo: const socketsByUser = new Map();\n' +
  '// và:            function buildGateway(httpServer) { ... return io; }\n' +
  '\n' +
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  'const srv = http.createServer();\n' +
  'const io = buildGateway(srv);\n' +
  'const connect = (token) => new Promise((res, rej) => {\n' +
  "  const c = Client('http://localhost:' + srv.address().port + '/chat',\n" +
  "    { auth: { token }, reconnection: false, transports: ['websocket'] });\n" +
  "  c.on('connect', () => res(c));\n" +
  "  c.on('connect_error', (e) => rej(e));\n" +
  '});\n' +
  '\n' +
  'srv.listen(0, async () => {\n' +
  "  const an1 = await connect('tok-an');\n" +
  "  const an2 = await connect('tok-an');\n" +
  "  const binh = await connect('tok-binh');\n" +
  "  binh.on('chat:message', (m) => log('binh got chat:message from=' + m.from + ' text=' + m.text));\n" +
  "  an1.on('presence:update', (p) => log('an1 got presence ' + p.userId + ' online=' + p.online));\n" +
  '\n' +
  "  try { await connect('tok-nobody'); }\n" +
  "  catch (e) { log('reject message=' + e.message + ' data=' + JSON.stringify(e.data)); }\n" +
  '\n' +
  "  log('join t1 (an1) ->', JSON.stringify(await an1.emitWithAck('chat:join', 't1')));\n" +
  "  log('join t1 (binh) ->', JSON.stringify(await binh.emitWithAck('chat:join', 't1')));\n" +
  "  const cuong = await connect('tok-cuong');\n" +
  "  log('join t1 (cuong) ->', JSON.stringify(await cuong.emitWithAck('chat:join', 't1')));\n" +
  "  log('send before join (cuong) ->', JSON.stringify(await cuong.emitWithAck('chat:send', { threadId: 't1', text: 'x' })));\n" +
  "  log('send (an1) ->', JSON.stringify(await an1.emitWithAck('chat:send', { threadId: 't1', text: 'chao' })));\n" +
  '  await new Promise((r) => setTimeout(r, 100));\n' +
  '\n' +
  '  an1.disconnect();\n' +
  '  await new Promise((r) => setTimeout(r, 100));\n' +
  '  an2.disconnect();\n' +
  '  await new Promise((r) => setTimeout(r, 100));\n' +
  '  binh.disconnect(); cuong.disconnect();\n' +
  '  await new Promise((r) => setTimeout(r, 100));\n' +
  '  io.close(); srv.close();\n' +
  '  process.exit(0);\n' +
  '});\n';

const Q5_SOLUTION =
  'const socketsByUser = new Map();   // userId -> Set<socket.id>\n' +
  '\n' +
  'function buildGateway(httpServer) {\n' +
  '  const io = new Server(httpServer);\n' +
  "  const chat = io.of('/chat');\n" +
  '\n' +
  '  // io.use() chỉ canh namespace CHÍNH "/", nên chốt phải đặt lên đúng cái\n' +
  '  // namespace đang cõng lưu lượng.\n' +
  '  chat.use((socket, next) => {\n' +
  '    const userId = USERS[socket.handshake.auth && socket.handshake.auth.token];\n' +
  '    if (!userId) {\n' +
  "      const err = new Error('unauthorized');\n" +
  "      err.data = { code: 'NO_TOKEN' };\n" +
  '      return next(err);\n' +
  '    }\n' +
  '    socket.data.userId = userId;\n' +
  '    next();\n' +
  '  });\n' +
  '\n' +
  '  const audienceOf = (userId) =>\n' +
  '    (FRIENDS[userId] || []).filter((f) => {\n' +
  '      const set = socketsByUser.get(f);\n' +
  '      return set ? set.size > 0 : false;\n' +
  '    });\n' +
  '\n' +
  '  const emitPresence = (userId, online) => {\n' +
  "    const audience = audienceOf(userId);\n" +
  "    for (const uid of audience) chat.to('user:' + uid).emit('presence:update', { userId, online });\n" +
  "    log('presence ' + userId + ' online=' + online + ' audience=' + (audience.length ? audience.join(',') : '-'));\n" +
  '  };\n' +
  '\n' +
  "  chat.on('connection', (socket) => {\n" +
  '    const userId = socket.data.userId;\n' +
  "    socket.join('user:' + userId);\n" +
  '    if (!socketsByUser.has(userId)) socketsByUser.set(userId, new Set());\n' +
  '    const tabs = socketsByUser.get(userId);\n' +
  '    tabs.add(socket.id);\n' +
  "    log('connect ' + userId + ' tabs=' + tabs.size + ' rooms=' + socket.rooms.size);\n" +
  '    if (tabs.size === 1) emitPresence(userId, true);   // chỉ lần vượt 0 -> 1\n' +
  '\n' +
  "    socket.on('chat:join', (threadId, ack) => {\n" +
  "      if (!(THREAD_MEMBERS[threadId] || []).includes(userId)) return ack({ error: 'forbidden' });\n" +
  "      socket.join('thread:' + threadId);\n" +
  "      ack({ ok: true, room: 'thread:' + threadId });\n" +
  '    });\n' +
  '\n' +
  "    socket.on('chat:send', (msg, ack) => {\n" +
  "      const room = 'thread:' + msg.threadId;\n" +
  "      if (!socket.rooms.has(room)) return ack({ error: 'not-in-thread' });\n" +
  '      // socket.to(room) loại trừ người gửi, vốn đã có sẵn đoạn chữ đó.\n' +
  "      socket.to(room).emit('chat:message', { from: userId, text: msg.text });\n" +
  '      ack({ ok: true });\n' +
  '    });\n' +
  '\n' +
  "    socket.on('disconnect', (reason) => {\n" +
  '      const set = socketsByUser.get(userId);\n' +
  '      set.delete(socket.id);\n' +
  "      log('disconnect ' + userId + ' reason=' + reason + ' tabs=' + set.size);\n" +
  '      if (set.size === 0) { socketsByUser.delete(userId); emitPresence(userId, false); }\n' +
  '    });\n' +
  '  });\n' +
  '\n' +
  '  return io;\n' +
  '}\n';

const Q5_OUTPUT =
  '$ npm i socket.io socket.io-client && node Q5.js\n' +
  'connect u1 tabs=1 rooms=2\n' +
  'presence u1 online=true audience=-\n' +
  'connect u1 tabs=2 rooms=2\n' +
  'connect u2 tabs=1 rooms=2\n' +
  'presence u2 online=true audience=u1\n' +
  'an1 got presence u2 online=true\n' +
  'reject message=unauthorized data={"code":"NO_TOKEN"}\n' +
  'join t1 (an1) -> {"ok":true,"room":"thread:t1"}\n' +
  'join t1 (binh) -> {"ok":true,"room":"thread:t1"}\n' +
  'connect u3 tabs=1 rooms=2\n' +
  'presence u3 online=true audience=u2\n' +
  'join t1 (cuong) -> {"error":"forbidden"}\n' +
  'send before join (cuong) -> {"error":"not-in-thread"}\n' +
  'binh got chat:message from=u1 text=chao\n' +
  'send (an1) -> {"ok":true}\n' +
  'disconnect u1 reason=client namespace disconnect tabs=1\n' +
  'disconnect u1 reason=client namespace disconnect tabs=0\n' +
  'presence u1 online=false audience=u2\n' +
  'disconnect u2 reason=client namespace disconnect tabs=0\n' +
  'presence u2 online=false audience=u3\n' +
  'disconnect u3 reason=client namespace disconnect tabs=0\n' +
  'presence u3 online=false audience=-';

export default {
  course: { slug: 'socket-io' },
  exams: [
    {
      kind: 'PE',
      peType: 'CODE',
      code: 'PE',
      source: 'SAMPLE',
      sortOrder: 10,
      title: B(
        'Practical Exam — write the realtime layer, then prove it runs',
        'Thi thực hành — viết cái tầng realtime, rồi chứng minh nó chạy',
      ),
      description: B(
        'Five practical questions, submitted as a .zip. A decoder for the packets socket.io really puts on the wire, the reconnect state machine and its backoff ladder, a presence layer with multi-tab reference counting and an audience instead of a global broadcast, a delivery layer that turns at-most-once into exactly-once-applied, and a real socket.io gateway with namespace auth, room membership checks and acks — units 0, 1, 2, 3, 4, 5, 6 and 10.',
        'Năm câu thực hành, nộp dưới dạng .zip. Một bộ giải mã đúng những packet socket.io thật sự đặt lên dây, máy trạng thái nối lại cùng thang giãn cách của nó, một tầng presence có đếm tham chiếu nhiều tab và có khán giả thay cho broadcast toàn hệ thống, một tầng giao hàng biến nhiều-nhất-một-lần thành áp-dụng-đúng-một-lần, và một gateway socket.io thật với xác thực theo namespace, kiểm tra thành viên room và ack — các mục 0, 1, 2, 3, 4, 5, 6 và 10.',
      ),
      durationMinutes: 120,
      totalPoints: 10,
      passMark: 4,
      isPublished: true,
      instructions: INSTRUCTIONS,
      questions: [
        /* ── Q1 · Mục 0, chương 2, chương 3 ──────────────────────── */
        codeQ({
          points: 2,
          language: 'javascript',
          prompt: B(
            '<p><b>Q1 — Decode what is actually on the wire (unit 0, chapters 2 and 3).</b> Every line of stdin is one engine.io frame, captured verbatim from a running socket.io 4.8.3 connection. Print exactly one line per frame, in order.</p>' +
            '<p>The grammar you need, one character at a time:</p>' +
            '<ul>' +
            '<li><b>Engine.io type</b> is the first character: <code>0</code> OPEN, <code>1</code> CLOSE, <code>2</code> PING, <code>3</code> PONG, <code>4</code> MESSAGE, <code>5</code> UPGRADE, <code>6</code> NOOP. Only MESSAGE carries a socket.io packet; print the bare name for the others.</li>' +
            '<li>For <b>OPEN</b>, the rest is JSON — print ' + c('OPEN sid=<sid> pingInterval=<n> pingTimeout=<n>') + '.</li>' +
            '<li><b>Socket.io type</b> is the next character: <code>0</code> CONNECT, <code>1</code> DISCONNECT, <code>2</code> EVENT, <code>3</code> ACK, <code>4</code> CONNECT_ERROR, <code>5</code> BINARY_EVENT, <code>6</code> BINARY_ACK.</li>' +
            '<li>A <b>binary</b> packet then carries ' + c('<n>-') + ' — the attachment count.</li>' +
            '<li>A <b>namespace</b> appears only if what follows starts with <code>/</code>, and it ends at the first comma. The default namespace is written as nothing at all, and you must print it as <code>/</code>.</li>' +
            '<li>An <b>ack id</b> is the digits that follow, if any. Print <code>-</code> when there is none.</li>' +
            '</ul>' +
            '<p>Output lines, exactly these shapes: ' + c('CONNECT nsp=<nsp> sid=<sid>') + ' · ' + c('DISCONNECT nsp=<nsp>') + ' · ' + c('CONNECT_ERROR nsp=<nsp> message=<message>') + ' · ' + c('EVENT nsp=<nsp> name=<event> ack=<id|->') + ' · ' + c('ACK nsp=<nsp> ack=<id|->') + ' · and the BINARY_ variants of the last two with ' + c(' attachments=<n>') + ' appended.</p>' +
            '<p>Two of the frames are the traps: <code>41/chat,</code> has a namespace and nothing after it, and <code>451-[...]</code> puts the attachment count where you might look for an ack id.</p>',

            '<p><b>Câu 1 — Giải mã đúng thứ đang nằm trên dây (mục 0, chương 2 và 3).</b> Mỗi dòng stdin là một frame engine.io, bắt nguyên văn từ một kết nối socket.io 4.8.3 đang chạy. Hãy in đúng một dòng cho mỗi frame, theo thứ tự.</p>' +
            '<p>Bộ ngữ pháp bạn cần, từng ký tự một:</p>' +
            '<ul>' +
            '<li><b>Kiểu engine.io</b> là ký tự đầu: <code>0</code> OPEN, <code>1</code> CLOSE, <code>2</code> PING, <code>3</code> PONG, <code>4</code> MESSAGE, <code>5</code> UPGRADE, <code>6</code> NOOP. Chỉ MESSAGE mới cõng một packet socket.io; những cái khác thì in trơ cái tên.</li>' +
            '<li>Với <b>OPEN</b>, phần còn lại là JSON — in ' + c('OPEN sid=<sid> pingInterval=<n> pingTimeout=<n>') + '.</li>' +
            '<li><b>Kiểu socket.io</b> là ký tự kế: <code>0</code> CONNECT, <code>1</code> DISCONNECT, <code>2</code> EVENT, <code>3</code> ACK, <code>4</code> CONNECT_ERROR, <code>5</code> BINARY_EVENT, <code>6</code> BINARY_ACK.</li>' +
            '<li>Packet <b>nhị phân</b> rồi mới tới ' + c('<n>-') + ' — số đính kèm.</li>' +
            '<li><b>Namespace</b> chỉ xuất hiện nếu phần theo sau bắt đầu bằng <code>/</code>, và nó kết thúc ở dấu phẩy đầu tiên. Namespace mặc định thì không viết gì cả, và bạn phải in nó ra thành <code>/</code>.</li>' +
            '<li><b>Ack id</b> là các chữ số đi ngay sau đó, nếu có. Không có thì in <code>-</code>.</li>' +
            '</ul>' +
            '<p>Các dòng ra, đúng những hình dạng này: ' + c('CONNECT nsp=<nsp> sid=<sid>') + ' · ' + c('DISCONNECT nsp=<nsp>') + ' · ' + c('CONNECT_ERROR nsp=<nsp> message=<message>') + ' · ' + c('EVENT nsp=<nsp> name=<event> ack=<id|->') + ' · ' + c('ACK nsp=<nsp> ack=<id|->') + ' · và hai biến thể BINARY_ của hai cái cuối, có nối thêm ' + c(' attachments=<n>') + '.</p>' +
            '<p>Hai frame là chỗ gài: <code>41/chat,</code> có namespace và không có gì phía sau, còn <code>451-[...]</code> đặt số đính kèm vào đúng chỗ bạn có thể tưởng là ack id.</p>',
          ),
          starterCode: Q1_STARTER,
          expectedOutput: Q1_OUTPUT,
          sampleSolution: Q1_SOLUTION,
          rubric: rubric([
            ['engine',
              'The engine.io layer is decoded first and independently: OPEN reports sid and both timings, and PING, PONG, UPGRADE and NOOP are printed without being mistaken for socket.io packets.',
              'Tầng engine.io được giải mã trước và độc lập: OPEN báo sid cùng cả hai con số thời gian, còn PING, PONG, UPGRADE và NOOP được in ra mà không bị nhầm thành packet socket.io.',
              0.4],
            ['nsp',
              'The namespace is parsed by the real rule — present only when the remainder starts with <code>/</code>, ending at the first comma — so <code>42["sendbin"]</code> reports <code>/</code> and <code>41/chat,</code> reports <code>/chat</code> with no payload.',
              'Namespace được phân tích theo đúng luật thật — chỉ có mặt khi phần còn lại bắt đầu bằng <code>/</code>, kết thúc ở dấu phẩy đầu tiên — nên <code>42["sendbin"]</code> báo <code>/</code> còn <code>41/chat,</code> báo <code>/chat</code> mà không có phần tải.',
              0.5],
            ['ack',
              'An ack id is distinguished from an attachment count: <code>451-</code> yields one attachment and no ack, while <code>420</code> and <code>43/chat,0</code> yield ack 0.',
              'Ack id được phân biệt với số đính kèm: <code>451-</code> cho ra một đính kèm và không có ack, còn <code>420</code> với <code>43/chat,0</code> thì cho ack 0.',
              0.5],
            ['shapes',
              'Every output line matches the required shape byte for byte, including <code>ack=-</code> for a packet with no ack id and <code>sid=-</code> for a CONNECT with no payload.',
              'Mọi dòng ra khớp hình dạng yêu cầu tới từng byte, kể cả <code>ack=-</code> cho packet không có ack id và <code>sid=-</code> cho CONNECT không có phần tải.',
              0.4],
            ['robust',
              'A packet with a namespace and no payload does not crash the parser — a bare <code>JSON.parse("")</code> on the remainder is the failure this input is built to catch.',
              'Một packet có namespace mà không có phần tải thì không làm sập bộ phân tích — gọi trần <code>JSON.parse("")</code> lên phần còn lại chính là kiểu hỏng mà dữ liệu vào này dựng ra để bắt.',
              0.2],
          ]),
        }),
        /* ── Q2 · chương 1, chương 2 ─────────────────────────────── */
        codeQ({
          points: 2,
          language: 'javascript',
          prompt: B(
            '<p><b>Q2 — The reconnect state machine (chapters 1 and 2).</b> Replay a session log and decide, for each disconnect, whether the client retries by itself and how long it would wait.</p>' +
            '<p>Input. Line 1 is ' + c('<min> <max> <factor> <jitter>') + '. Line 2 is the sequence of values that <code>Math.random()</code> would return, in order, one consumed per delay computed. Every line after that is one session event: a disconnect reason, or the literal <code>connect</code>.</p>' +
            '<p>Rules, and each of them is a place people get it wrong:</p>' +
            '<ul>' +
            '<li>Only <b>two</b> reasons mean the client will not retry on its own — the two that say somebody called <code>disconnect()</code>. Print ' + c('<reason> reconnect=no') + ' for those and consume no random number. Every other reason is an accident and does retry, <b>including</b> <code>parse error</code>; check that against a running client before you trust a lesson on it.</li>' +
            '<li>A <code>connect</code> line resets the attempt counter to zero. Print ' + c('connect reset') + '.</li>' +
            '<li>For a retrying reason print ' + c('<reason> reconnect=yes attempt=<n> delay=<ms>') + ', where <code>n</code> is 1 for the first attempt of the current episode.</li>' +
            '</ul>' +
            '<p>The delay is the exact algorithm socket.io-client uses, and all three details matter: ' + c('ms = min * factor ** attempts') + ' with <code>attempts</code> read <em>then</em> incremented; ' + c('deviation = floor(rand * jitter * ms)') + '; the sign is <b>minus</b> when ' + c('floor(rand * 10) & 1') + ' is 0 and plus otherwise — the same random number decides size and sign; and the result is ' + c('min(ms, max) | 0') + ', so the cap is applied <b>after</b> the jitter, never before.</p>' +
            '<p>Finish with one line: ' + c('attempts=<counter> randUsed=<how many randoms were consumed>') + '.</p>',

            '<p><b>Câu 2 — Máy trạng thái nối lại (chương 1 và 2).</b> Phát lại một nhật ký phiên và quyết định, với mỗi lần ngắt, client có tự thử lại không và nó sẽ chờ bao lâu.</p>' +
            '<p>Dữ liệu vào. Dòng 1 là ' + c('<min> <max> <factor> <jitter>') + '. Dòng 2 là dãy giá trị mà <code>Math.random()</code> sẽ trả về, theo thứ tự, mỗi lần tính một khoảng chờ thì tiêu một giá trị. Mọi dòng sau đó là một sự kiện của phiên: một lý do disconnect, hoặc đúng chữ <code>connect</code>.</p>' +
            '<p>Các luật, và mỗi luật đều là một chỗ người ta hay làm sai:</p>' +
            '<ul>' +
            '<li>Chỉ <b>hai</b> lý do nghĩa là client sẽ không tự thử lại — hai lý do nói rằng có ai đó đã gọi <code>disconnect()</code>. Với chúng thì in ' + c('<reason> reconnect=no') + ' và không tiêu giá trị ngẫu nhiên nào. Mọi lý do khác là tai nạn và CÓ thử lại, <b>kể cả</b> <code>parse error</code>; hãy đối chiếu điều đó với một client đang chạy trước khi tin một bài học nào về nó.</li>' +
            '<li>Một dòng <code>connect</code> đặt lại bộ đếm lượt về không. In ' + c('connect reset') + '.</li>' +
            '<li>Với một lý do có thử lại thì in ' + c('<reason> reconnect=yes attempt=<n> delay=<ms>') + ', trong đó <code>n</code> là 1 ở lượt đầu của đợt hiện tại.</li>' +
            '</ul>' +
            '<p>Khoảng chờ tính đúng theo thuật toán socket.io-client dùng, và cả ba chi tiết đều quan trọng: ' + c('ms = min * factor ** attempts') + ' với <code>attempts</code> được đọc <em>rồi mới</em> tăng; ' + c('deviation = floor(rand * jitter * ms)') + '; dấu là <b>trừ</b> khi ' + c('floor(rand * 10) & 1') + ' bằng 0 và cộng trong trường hợp còn lại — cùng một số ngẫu nhiên quyết định cả độ lớn lẫn dấu; và kết quả là ' + c('min(ms, max) | 0') + ', nên trần được áp <b>sau</b> jitter, không bao giờ trước.</p>' +
            '<p>Kết thúc bằng một dòng: ' + c('attempts=<bộ đếm> randUsed=<đã tiêu bao nhiêu số ngẫu nhiên>') + '.</p>',
          ),
          starterCode: Q2_STARTER,
          expectedOutput: Q2_OUTPUT,
          sampleSolution: Q2_SOLUTION,
          rubric: rubric([
            ['classify',
              'Exactly the two deliberate reasons are marked <code>reconnect=no</code>, and <code>parse error</code> is correctly treated as one that DOES retry.',
              'Đúng hai lý do cố ý được đánh dấu <code>reconnect=no</code>, và <code>parse error</code> được xử lý đúng là một lý do CÓ thử lại.',
              0.5],
            ['ladder',
              'The ladder is <code>min * factor ** attempts</code> with the counter read then incremented, so the first retry of an episode is attempt 1 at the <code>min</code> scale.',
              'Cái thang là <code>min * factor ** attempts</code> với bộ đếm đọc rồi mới tăng, nên lượt thử lại đầu tiên của một đợt là lượt 1 ở mức <code>min</code>.',
              0.4],
            ['jitter',
              'One random number per delay drives BOTH the deviation size and its sign, using <code>floor(rand * 10) &amp; 1</code> — not two draws, and not an unconditional addition.',
              'Một số ngẫu nhiên cho mỗi khoảng chờ, và nó lái CẢ độ lớn lệch lẫn dấu của nó, bằng <code>floor(rand * 10) &amp; 1</code> — không phải rút hai lần, và không phải luôn luôn cộng.',
              0.5],
            ['cap',
              'The cap is applied AFTER the jitter: attempt 4 and 5 both report exactly <code>delay=5000</code> even though the jittered values before clamping were 7880 and 20400.',
              'Trần được áp SAU jitter: lượt 4 và lượt 5 đều báo đúng <code>delay=5000</code> dù giá trị sau jitter trước khi chặn là 7880 và 20400.',
              0.4],
            ['reset',
              'A <code>connect</code> line resets the counter but NOT the random cursor, so the ladder restarts at <code>min</code> while the random sequence continues where it left off.',
              'Một dòng <code>connect</code> đặt lại bộ đếm nhưng KHÔNG đặt lại con trỏ ngẫu nhiên, nên cái thang khởi động lại ở <code>min</code> trong khi dãy ngẫu nhiên đi tiếp từ chỗ đang dở.',
              0.2],
          ]),
        }),
        /* ── Q3 · chương 3, chương 4 ─────────────────────────────── */
        codeQ({
          points: 2,
          language: 'javascript',
          prompt: B(
            '<p><b>Q3 — Presence without the O(N squared) trap (chapters 3 and 4).</b> Replay a session log and emit presence the way a real gateway must: to an audience, and only when the user actually crossed the online/offline line.</p>' +
            '<p>Input lines, in order:</p>' +
            '<ul>' +
            '<li>' + c('FRIENDS <a> <b> [c ...]') + ' — <code>a</code> is friends with each of the others. Friendship is symmetric.</li>' +
            '<li>' + c('CONNECT <user> <socket>') + ' — one tab opens.</li>' +
            '<li>' + c('DISCONNECT <socket>') + ' — one tab closes.</li>' +
            '</ul>' +
            '<p>What to print:</p>' +
            '<ul>' +
            '<li>On a user\'s <b>first</b> socket: ' + c('ONLINE <user> to=<socket ids> packets=<n>') + ', where the recipients are every socket belonging to a friend who is online at that moment, friends sorted then their sockets sorted, joined by commas — or <code>-</code> when there are none.</li>' +
            '<li>On the <b>last</b> socket going away: the same line with <code>OFFLINE</code>. The leaver must not appear in its own recipient list.</li>' +
            '<li>On any other tab opening or closing, no presence change at all: print ' + c('TAB+ <user> tabs=<n>') + ' or ' + c('TAB- <user> tabs=<n>') + '. A user with three tabs closing one is not offline.</li>' +
            '<li>A <code>DISCONNECT</code> for a socket you have never seen: ' + c('IGNORE <socket>') + '.</li>' +
            '</ul>' +
            '<p>Finish with ' + c('targeted=<n> naive=<n>') + ' — the total packets your audience approach sent, against what a plain ' + c("io.emit(...)") + ' would have cost (one packet per socket connected anywhere in the system, counted at the moment of each presence change).</p>',

            '<p><b>Câu 3 — Presence không dính bẫy O(N bình phương) (chương 3 và 4).</b> Phát lại một nhật ký phiên và phát presence theo đúng cách một gateway thật phải làm: tới một nhóm khán giả, và chỉ khi người dùng thật sự vượt qua ranh giới online/offline.</p>' +
            '<p>Các dòng dữ liệu vào, theo thứ tự:</p>' +
            '<ul>' +
            '<li>' + c('FRIENDS <a> <b> [c ...]') + ' — <code>a</code> là bạn với từng người còn lại. Quan hệ bạn bè là đối xứng.</li>' +
            '<li>' + c('CONNECT <user> <socket>') + ' — một tab mở ra.</li>' +
            '<li>' + c('DISCONNECT <socket>') + ' — một tab đóng lại.</li>' +
            '</ul>' +
            '<p>Cần in ra:</p>' +
            '<ul>' +
            '<li>Ở socket <b>đầu tiên</b> của một người: ' + c('ONLINE <user> to=<các socket id> packets=<n>') + ', trong đó người nhận là mọi socket thuộc về một người bạn đang online tại thời điểm đó, bạn bè sắp xếp rồi tới socket của họ sắp xếp, nối bằng dấu phẩy — hoặc <code>-</code> nếu không có ai.</li>' +
            '<li>Ở socket <b>cuối cùng</b> ra đi: cũng dòng đó với <code>OFFLINE</code>. Người vừa rời không được xuất hiện trong danh sách người nhận của chính mình.</li>' +
            '<li>Với mọi lượt mở hay đóng tab khác, không có thay đổi presence nào cả: in ' + c('TAB+ <user> tabs=<n>') + ' hoặc ' + c('TAB- <user> tabs=<n>') + '. Một người có ba tab mà đóng một tab thì không phải là đã offline.</li>' +
            '<li>Một <code>DISCONNECT</code> cho socket bạn chưa từng thấy: ' + c('IGNORE <socket>') + '.</li>' +
            '</ul>' +
            '<p>Kết thúc bằng ' + c('targeted=<n> naive=<n>') + ' — tổng số packet mà cách làm theo khán giả của bạn đã gửi, so với chi phí của một lượt ' + c("io.emit(...)") + ' trần (một packet cho mỗi socket đang kết nối ở bất cứ đâu trong hệ thống, đếm tại thời điểm mỗi lần presence thay đổi).</p>',
          ),
          starterCode: Q3_STARTER,
          expectedOutput: Q3_OUTPUT,
          sampleSolution: Q3_SOLUTION,
          rubric: rubric([
            ['refcount',
              'Presence is keyed by user and counted by sockets: only the 0 to 1 and the 1 to 0 crossings produce ONLINE/OFFLINE, everything else prints a TAB line.',
              'Presence khoá theo người dùng và đếm theo socket: chỉ hai lần vượt ngưỡng 0 lên 1 và 1 về 0 mới sinh ra ONLINE/OFFLINE, mọi lượt khác in một dòng TAB.',
              0.5],
            ['audience',
              'The recipient list is the online friends only — not everyone, and not offline friends — with friends sorted and each friend\'s sockets sorted, so a user with two tabs contributes two recipients.',
              'Danh sách người nhận chỉ gồm những người bạn đang online — không phải tất cả, và không gồm bạn đang offline — với bạn bè sắp xếp và socket của từng người bạn sắp xếp, nên một người có hai tab đóng góp hai người nhận.',
              0.5],
            ['selfexcl',
              'The leaving user is removed from the registry BEFORE the OFFLINE fanout is computed, so it never appears in its own recipient list.',
              'Người vừa rời được gỡ khỏi sổ đăng ký TRƯỚC khi tính fanout của OFFLINE, nên nó không bao giờ có mặt trong danh sách người nhận của chính mình.',
              0.4],
            ['cost',
              'Both counters are accumulated on every presence change, and the naive figure is the number of sockets connected system-wide at that moment — the comparison is the point of the exercise.',
              'Cả hai bộ đếm đều cộng dồn ở mỗi lần presence thay đổi, và con số naive là số socket đang kết nối trên toàn hệ thống tại thời điểm đó — phép so sánh ấy chính là mục đích của bài.',
              0.4],
            ['unknown',
              'A DISCONNECT for an unknown socket prints IGNORE and mutates nothing — it must not create an empty entry or throw.',
              'Một DISCONNECT cho socket lạ thì in IGNORE và không đổi gì cả — nó không được tạo ra một mục rỗng và cũng không được ném lỗi.',
              0.2],
          ]),
        }),

        /* ── Q4 · chương 6 ───────────────────────────────────────── */
        codeQ({
          points: 2,
          language: 'javascript',
          prompt: B(
            '<p><b>Q4 — From at-most-once to exactly-once applied (chapter 6).</b> Simulate the delivery layer you would put under a chat send path, over a link whose behaviour is scripted so the run is deterministic.</p>' +
            '<p>Line 1 of stdin is <code>maxAttempts</code>. Every line after that is ' + c('<id> <text> <outcome> [outcome ...]') + ', where <code>id</code> is the message id the CLIENT generated and each outcome describes one attempt:</p>' +
            '<ul>' +
            '<li><code>ok</code> — the server received it and the ack came back.</li>' +
            '<li><code>lost</code> — the packet never reached the server at all.</li>' +
            '<li><code>ackLost</code> — the server received it and processed it, but the ack was lost on the way back. The client cannot tell this apart from <code>lost</code>, so it retries.</li>' +
            '</ul>' +
            '<p>The client retries until an ack arrives or <code>maxAttempts</code> is spent. The server deduplicates on the message id: a repeat is counted as received but is NOT applied a second time.</p>' +
            '<p>Print ' + c('<id> DELIVERED attempts=<n>') + ' or ' + c('<id> FAILED attempts=<n>') + ' per message, then two summary lines: ' + c('applied=<ids and texts, in the order the server applied them>') + ' and ' + c('received=<total packets the server saw> duplicates=<how many the dedupe layer threw away>') + '.</p>' +
            '<p>Read your own <code>applied=</code> line against the FAILED messages when you are done. One of them is in there, and understanding why is the whole point of the question.</p>',

            '<p><b>Câu 4 — Từ nhiều-nhất-một-lần tới áp-dụng-đúng-một-lần (chương 6).</b> Mô phỏng cái tầng giao hàng mà bạn sẽ đặt dưới đường gửi chat, trên một đường truyền có hành vi được viết sẵn thành kịch bản để lượt chạy là tất định.</p>' +
            '<p>Dòng 1 của stdin là <code>maxAttempts</code>. Mọi dòng sau đó là ' + c('<id> <text> <outcome> [outcome ...]') + ', trong đó <code>id</code> là message id do CHÍNH CLIENT sinh và mỗi outcome mô tả một lượt thử:</p>' +
            '<ul>' +
            '<li><code>ok</code> — máy chủ nhận được và ack đã quay về.</li>' +
            '<li><code>lost</code> — packet chưa từng tới được máy chủ.</li>' +
            '<li><code>ackLost</code> — máy chủ nhận được và đã xử lý, nhưng ack mất trên đường về. Client không phân biệt được ca này với <code>lost</code>, nên nó thử lại.</li>' +
            '</ul>' +
            '<p>Client thử lại cho tới khi có ack hoặc tiêu hết <code>maxAttempts</code>. Máy chủ khử trùng lặp theo message id: một bản lặp vẫn được tính là đã nhận nhưng KHÔNG được áp dụng lần thứ hai.</p>' +
            '<p>In ' + c('<id> DELIVERED attempts=<n>') + ' hoặc ' + c('<id> FAILED attempts=<n>') + ' cho mỗi tin nhắn, rồi hai dòng tổng kết: ' + c('applied=<các id và text, theo thứ tự máy chủ đã áp dụng>') + ' và ' + c('received=<tổng số packet máy chủ đã thấy> duplicates=<tầng khử trùng lặp vứt bao nhiêu>') + '.</p>' +
            '<p>Làm xong, hãy đọc lại dòng <code>applied=</code> của chính bạn và đối chiếu với những tin nhắn FAILED. Một trong số chúng nằm trong đó, và hiểu vì sao chính là toàn bộ mục đích của câu này.</p>',
          ),
          starterCode: Q4_STARTER,
          expectedOutput: Q4_OUTPUT,
          sampleSolution: Q4_SOLUTION,
          rubric: rubric([
            ['retry',
              'The retry loop stops on the first <code>ok</code> and is bounded by <code>maxAttempts</code>, so <code>m4</code> reports 3 attempts even though its script lists four outcomes.',
              'Vòng thử lại dừng ở <code>ok</code> đầu tiên và bị chặn bởi <code>maxAttempts</code>, nên <code>m4</code> báo 3 lượt dù kịch bản của nó liệt kê bốn outcome.',
              0.5],
            ['dedupe',
              'The server counts every packet it receives but applies each id once, so <code>received</code> and the length of <code>applied</code> are different numbers and <code>duplicates</code> is their difference on the ids that repeated.',
              'Máy chủ đếm mọi packet nó nhận nhưng chỉ áp dụng mỗi id một lần, nên <code>received</code> và độ dài của <code>applied</code> là hai con số khác nhau, còn <code>duplicates</code> là phần chênh trên những id bị lặp.',
              0.5],
            ['ackLost',
              '<code>ackLost</code> is applied on the server and still triggers a retry, while <code>lost</code> reaches the server not at all — conflating the two makes <code>received</code> and <code>duplicates</code> both wrong.',
              '<code>ackLost</code> được áp dụng trên máy chủ mà vẫn kích hoạt một lượt thử lại, còn <code>lost</code> thì hoàn toàn không tới được máy chủ — gộp hai ca đó làm sai cả <code>received</code> lẫn <code>duplicates</code>.',
              0.4],
            ['falseneg',
              'A message whose acks were all lost is reported FAILED and still appears in <code>applied</code> — the answer must reproduce that, because the false negative is the real lesson.',
              'Một tin nhắn mà mọi ack đều mất thì bị báo FAILED và vẫn xuất hiện trong <code>applied</code> — lời giải phải tái hiện đúng điều đó, vì cái âm tính giả ấy mới là bài học thật.',
              0.4],
            ['order',
              '<code>applied</code> preserves the order in which the server actually committed each message, not the order of the input lines.',
              '<code>applied</code> giữ đúng thứ tự máy chủ thật sự ghi nhận từng tin nhắn, không phải thứ tự các dòng dữ liệu vào.',
              0.2],
          ]),
        }),
        /* ── Q5 · chương 1, 3, 4, 5, 10 ──────────────────────────── */
        codeQ({
          points: 2,
          language: 'javascript',
          khongChayDuoc: "cần socket.io + socket.io-client cài sẵn, mà scripts/exam-check.mjs chạy lời giải trong một thư mục tạm KHÔNG có node_modules (đo thật: require('socket.io') ở đó trả MODULE_NOT_FOUND); đã chạy thật 3 lượt, stdout giống nhau từng byte và khớp expectedOutput",
          prompt: B(
            '<p><b>Q5 — A gateway you would put in front of real users (chapters 1, 3, 4, 5 and 10).</b> This is the only question that uses socket.io itself. The starter block gives you three lookup tables and a harness that drives five clients and exits; write the two things between the markers: ' + c('const socketsByUser = new Map()') + ' and ' + c('function buildGateway(httpServer)') + ', which creates the server and returns it.</p>' +
            '<p>Six behaviours are graded, and each one is visible in the expected transcript:</p>' +
            '<ul>' +
            '<li><b>Auth on the namespace that carries the traffic.</b> Everything happens on <code>/chat</code>. A missing or unknown token is rejected with an error whose message is <code>unauthorized</code> and whose <code>data</code> is ' + c("{ code: 'NO_TOKEN' }") + '. Think about where the middleware has to be registered for this to protect anything at all.</li>' +
            '<li><b>A room per user.</b> Every accepted socket joins ' + c("'user:' + userId") + '. The transcript prints ' + c('socket.rooms.size') + ' right after — work out what number that should be before you run it.</li>' +
            '<li><b>Membership before join.</b> ' + c('chat:join') + ' takes a thread id and an ack. A non-member gets ' + c("{ error: 'forbidden' }") + ' and does NOT join; a member joins ' + c("'thread:' + threadId") + ' and gets ' + c("{ ok: true, room: ... }") + '.</li>' +
            '<li><b>Send, acked, to the room only.</b> ' + c('chat:send') + ' takes ' + c('{ threadId, text }') + ' and an ack. A socket that is not in the room gets ' + c("{ error: 'not-in-thread' }") + '. Otherwise the message goes to the thread room <em>excluding the sender</em>, and the ack is ' + c('{ ok: true }') + '.</li>' +
            '<li><b>Targeted presence with reference counting.</b> Announce <code>presence:update</code> only on the 0-to-1 and 1-to-0 crossings, and only to the <code>user:</code> rooms of friends who are currently online — never with ' + c('io.emit') + '. Log ' + c("'presence ' + userId + ' online=' + online + ' audience=' + ...") + ' with the friend ids joined by commas, or <code>-</code> when nobody is listening.</li>' +
            '<li><b>Cleanup.</b> On <code>disconnect</code>, remove the socket from your map, log the reason and the remaining tab count, and delete the user entry when it empties — no orphan Set may survive the run.</li>' +
            '</ul>' +
            '<p>Note what the transcript says the disconnect reason is. It is not the string the client logs for the same event, and knowing which side produced it is half of Chapter 10.</p>',

            '<p><b>Câu 5 — Một gateway bạn dám đặt trước người dùng thật (chương 1, 3, 4, 5 và 10).</b> Đây là câu duy nhất dùng chính socket.io. Khối mã cho sẵn đưa bạn ba bảng tra và một khung chạy lái năm client rồi thoát; hãy viết hai thứ nằm giữa hai mốc: ' + c('const socketsByUser = new Map()') + ' và ' + c('function buildGateway(httpServer)') + ', hàm này tạo máy chủ rồi trả về nó.</p>' +
            '<p>Sáu hành vi bị chấm, và mỗi hành vi đều nhìn thấy được trong bản ghi kết quả:</p>' +
            '<ul>' +
            '<li><b>Xác thực đặt ở namespace đang cõng lưu lượng.</b> Mọi thứ diễn ra trên <code>/chat</code>. Token thiếu hoặc lạ thì bị từ chối bằng một lỗi có message là <code>unauthorized</code> và <code>data</code> là ' + c("{ code: 'NO_TOKEN' }") + '. Hãy nghĩ xem middleware phải đăng ký ở đâu thì việc này mới bảo vệ được thứ gì.</li>' +
            '<li><b>Mỗi người một room.</b> Mọi socket được chấp nhận đều vào ' + c("'user:' + userId") + '. Bản ghi in ' + c('socket.rooms.size') + ' ngay sau đó — hãy tự tính con số đó phải là bao nhiêu trước khi chạy.</li>' +
            '<li><b>Kiểm thành viên trước khi cho vào.</b> ' + c('chat:join') + ' nhận một thread id và một ack. Người không phải thành viên nhận ' + c("{ error: 'forbidden' }") + ' và KHÔNG được vào; thành viên thì vào ' + c("'thread:' + threadId") + ' và nhận ' + c("{ ok: true, room: ... }") + '.</li>' +
            '<li><b>Gửi có ack, và chỉ tới room.</b> ' + c('chat:send') + ' nhận ' + c('{ threadId, text }') + ' và một ack. Một socket không ở trong room thì nhận ' + c("{ error: 'not-in-thread' }") + '. Còn lại thì tin nhắn đi tới room của cuộc trò chuyện <em>trừ chính người gửi</em>, và ack là ' + c('{ ok: true }') + '.</li>' +
            '<li><b>Presence có mục tiêu và có đếm tham chiếu.</b> Chỉ thông báo <code>presence:update</code> ở hai lần vượt ngưỡng 0 lên 1 và 1 về 0, và chỉ tới các room <code>user:</code> của những người bạn đang online — tuyệt đối không dùng ' + c('io.emit') + '. Ghi log ' + c("'presence ' + userId + ' online=' + online + ' audience=' + ...") + ' với các id bạn bè nối bằng dấu phẩy, hoặc <code>-</code> khi không có ai đang nghe.</li>' +
            '<li><b>Dọn dẹp.</b> Khi <code>disconnect</code>, hãy gỡ socket khỏi map của bạn, ghi log lý do cùng số tab còn lại, và xoá mục của người dùng khi nó rỗng — không được để sót một Set mồ côi nào sau lượt chạy.</li>' +
            '</ul>' +
            '<p>Hãy để ý bản ghi kết quả nói lý do disconnect là gì. Đó không phải chuỗi mà client ghi ra cho cùng sự kiện ấy, và biết được phía nào sinh ra nó đã là một nửa của Chương 10.</p>',
          ),
          starterCode: Q5_STARTER,
          expectedOutput: Q5_OUTPUT,
          sampleSolution: Q5_SOLUTION,
          rubric: rubric([
            ['auth',
              'The middleware is registered on the <code>/chat</code> namespace, not with <code>io.use</code> — a guard on the main namespace would let every client in and the transcript would show no rejection line at all.',
              'Middleware được đăng ký lên namespace <code>/chat</code>, không phải bằng <code>io.use</code> — một chốt đặt ở namespace chính sẽ cho mọi client vào và bản ghi sẽ không có dòng từ chối nào.',
              0.4],
            ['rooms',
              'Every socket joins its <code>user:</code> room, and <code>chat:join</code> checks thread membership BEFORE joining, so a non-member is refused and never appears in the room afterwards.',
              'Mọi socket đều vào room <code>user:</code> của mình, và <code>chat:join</code> kiểm tra thành viên TRƯỚC khi cho vào, nên người không phải thành viên bị từ chối và về sau không bao giờ có mặt trong room.',
              0.4],
            ['send',
              '<code>chat:send</code> is acked in both the success and the refusal path, and the broadcast excludes the sender — using <code>io.to(room)</code> instead of <code>socket.to(room)</code> would echo the message back to its author.',
              '<code>chat:send</code> đều có ack ở cả đường thành công lẫn đường từ chối, và lượt phát loại trừ chính người gửi — dùng <code>io.to(room)</code> thay cho <code>socket.to(room)</code> sẽ dội tin nhắn ngược về chính tác giả.',
              0.4],
            ['presence',
              'Presence is emitted only on the 0-to-1 and 1-to-0 crossings and only to the <code>user:</code> rooms of online friends: the second tab of the same user produces no presence line, and no path uses <code>io.emit</code>.',
              'Presence chỉ được phát ở hai lần vượt ngưỡng 0 lên 1 và 1 về 0, và chỉ tới các room <code>user:</code> của những người bạn đang online: tab thứ hai của cùng một người không sinh ra dòng presence nào, và không đường nào dùng <code>io.emit</code>.',
              0.5],
            ['cleanup',
              'The disconnect handler removes the socket, deletes the user entry when the Set empties, and the process exits on its own — nothing is left listening and no map entry outlives its user.',
              'Handler disconnect gỡ socket ra, xoá mục của người dùng khi Set rỗng, và tiến trình tự thoát — không còn gì nghe lại và không mục map nào sống lâu hơn người dùng của nó.',
              0.3],
          ]),
        }),
      ],
    },
  ],
};
