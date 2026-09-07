/**
 * Redis — Practical Exam (PE): 5 câu lập trình, nộp .zip.
 *
 * Đề tự soạn, bám sát `content/courses/redis/s00…s12`. Khác đề FE (50 câu
 * trắc nghiệm, đọc transcript), đề này bắt VIẾT mã: vòng đời khoá và TTL,
 * ngữ nghĩa sorted set, cache-aside chống giẫm đạp, WATCH/MULTI/EXEC cùng
 * kịch bản nguyên khối, và nhóm tiêu thụ của Stream.
 *
 * ⚠️ MỌI NGỮ NGHĨA REDIS TRONG NĂM CÂU DƯỚI ĐÂY ĐÃ ĐƯỢC ĐO TRÊN MÁY CHỦ THẬT
 * — `redis:7` (báo `redis_version:7.4.9`) chạy trong Docker — chứ không lấy
 * từ trí nhớ. Cụ thể: toàn bộ transcript của câu 1, câu 2 và câu 5 đã được
 * PHÁT LẠI nguyên văn qua `redis-cli` và `expectedOutput` khớp từng dòng với
 * máy chủ. Câu 1 dùng đồng hồ ảo (`TICK`) nên khi đối chiếu với máy thật,
 * mỗi bước `TICK n` được mô phỏng bằng một kịch bản Lua trừ đúng n giây khỏi
 * PTTL của mọi khoá.
 *
 * ⚠️ Hai chỗ máy THẮNG dự đoán, và đề đã sửa theo máy:
 *   • `EXPIRE key n GT` trên một khoá KHÔNG có TTL trả về 0 và không đặt gì
 *     (khoá không hạn được coi là hạn vô hạn), trong khi `EXPIRE key n LT`
 *     trên đúng khoá ấy trả về 1. Trực giác "GT thì lớn hơn nên đặt được" là sai.
 *   • `ZRANGEBYSCORE k (10 +inf` — bản lời giải đầu tiên trả về mảng RỖNG vì
 *     `Number('+inf')` là `NaN`. Máy trả về `alice`. Đã vá và ghi chú ngay
 *     trong lời giải mẫu.
 *
 * ⚠️ Vì sao đề KHÔNG bắt gọi vào một Redis sống: `scripts/exam-check.mjs`
 * chạy lời giải mẫu bằng `node answer.cjs` trong một thư mục tạm ngoài kho —
 * ở đó `require('redis')` không phân giải được, và cũng không có máy chủ nào
 * đảm bảo đang chạy. `NODEJS-PE` giải quyết đúng bài này bằng cách cho mỗi
 * câu là một chương trình độc lập chỉ đọc stdin. Đề Redis đi cùng hướng đó:
 * mỗi câu là một chương trình độc lập, và thứ bị chấm là NGỮ NGHĨA REDIS mà
 * học viên phải tự cài lại — thứ mà một lời gọi `redis.get()` sẽ giấu đi.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/REDIS-PE.mjs --apply
 * Kiểm: node scripts/exam-check.mjs ./content/exams/REDIS-PE.mjs
 */
import { B, c, code, codeQ } from './_lib/redis-exam-kit.mjs';

/**
 * Rubric riêng cho từng câu: tổng `maxScore` đúng bằng `points` của câu, nên
 * điểm từng tiêu chí cộng lại ra thẳng điểm câu — không phải quy đổi.
 * `weight` giữ nguyên vai trò cũ (bộ chấm AI in ra kèm tiêu chí).
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
  '<li>Create five files named <code>Q1.cjs … Q5.cjs</code> in your own editor. Each question shows a <b>Starter</b> block — copy it into the file <b>verbatim</b> and write your answer only in the middle region, between the two <code>ĐỀ CHO SẴN</code> markers. The transcript, the fixtures and the printing loop are part of the grading; changing them is how you fail a question you actually solved.</li>' +
  '<li><b>No npm packages at all</b> — not even a Redis client. Every question hands you a small in-memory harness and asks you to implement the <em>server semantics</em> yourself. That is the point: a call to <code>redis.get()</code> would hide exactly the behaviour being tested.</li>' +
  '<li>Run each file with <code>node Q1.cjs</code> and compare with the "expected output" block, <b>line for line</b>. Node 22 runs these as CommonJS; do not add <code>import</code> or <code>export</code>.</li>' +
  '<li>Nothing here depends on the wall clock. Where time matters, the harness gives you a virtual clock that only moves when the transcript says so — if your answer reads <code>Date.now()</code>, it is wrong.</li>' +
  '<li>Zip the five files into <b>one .zip</b> and upload it in the submit box.</li>' +
  '</ol>' +
  '<p><b>How it is graded.</b> Output first — a program that prints the wrong lines cannot pass. But the marks live in the <b>Redis semantics</b>: a TTL that survives a write it should not have survived, a sorted-set tie broken the wrong way, an <code>XACK</code> that fires whether or not the work succeeded, a compare-and-delete split into two round trips. Every expected line below came from running these exact transcripts against a real Redis 7.4 server, so when your intuition and the expected output disagree, the server is right.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  '<p><b>Cách làm bài thi.</b></p>' +
  '<ol>' +
  '<li>Tạo năm file tên <code>Q1.cjs … Q5.cjs</code> bằng trình soạn thảo của bạn. Mỗi câu có khối <b>Mã cho sẵn</b> — chép <b>nguyên văn</b> vào file và chỉ viết lời giải ở vùng giữa, nằm giữa hai mốc <code>ĐỀ CHO SẴN</code>. Phần transcript, dữ liệu cho sẵn và vòng lặp in kết quả là một phần của việc chấm; sửa chúng là cách trượt một câu mà bạn thật ra đã làm được.</li>' +
  '<li><b>Không dùng gói npm nào cả</b> — kể cả một client Redis. Mỗi câu cho sẵn một bộ khung nhỏ chạy trong bộ nhớ và yêu cầu bạn tự cài lại <em>ngữ nghĩa của máy chủ</em>. Đó chính là điều đề muốn hỏi: một lời gọi <code>redis.get()</code> sẽ giấu mất đúng cái hành vi đang bị kiểm.</li>' +
  '<li>Chạy từng file bằng <code>node Q1.cjs</code> rồi đối chiếu với khối "kết quả mong đợi", <b>từng dòng một</b>. Node 22 chạy các file này ở chế độ CommonJS; đừng thêm <code>import</code> hay <code>export</code>.</li>' +
  '<li>Không câu nào phụ thuộc đồng hồ thật. Chỗ nào cần thời gian thì khung đề đã cho một đồng hồ ảo, và nó chỉ nhích khi transcript bảo nhích — lời giải mà đọc <code>Date.now()</code> là sai.</li>' +
  '<li>Nén năm file thành <b>một file .zip</b> rồi tải lên ô nộp bài.</li>' +
  '</ol>' +
  '<p><b>Chấm thế nào.</b> Kết quả in ra trước — chương trình in sai dòng thì không thể qua. Nhưng điểm nằm ở <b>ngữ nghĩa Redis</b>: một TTL sống sót qua một lần ghi lẽ ra phải xoá nó, một cặp điểm bằng nhau phân định sai thứ tự, một <code>XACK</code> bắn ra bất kể việc có thành công hay không, một phép so-rồi-xoá bị tách thành hai lượt đi về. Mọi dòng kết quả mong đợi dưới đây đều lấy từ việc chạy đúng những transcript ấy trên một máy chủ Redis 7.4 thật, nên khi trực giác của bạn và kết quả mong đợi đá nhau thì máy chủ đúng.</p>' +
  '</div>';

const Q1_STARTER =
  "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n" +
  "// Đồng hồ ảo: db.now là \"giây hiện tại\". Lệnh TICK do khung đề xử lý sẵn,\n" +
  "// nó chỉ đẩy đồng hồ tới trước — nhờ vậy kết quả không đổi theo lúc bạn chạy.\n" +
  "const db = { data: new Map(), now: 1000 };\n" +
  "\n" +
  "const TRANSCRIPT = `\n" +
  "SET a hello EX 100\n" +
  "TTL a\n" +
  "SET a world\n" +
  "TTL a\n" +
  "SET a again EX 60\n" +
  "SET a keep KEEPTTL\n" +
  "TTL a\n" +
  "APPEND a !\n" +
  "TTL a\n" +
  "GET a\n" +
  "TICK 30\n" +
  "TTL a\n" +
  "EXPIRE a 100 GT\n" +
  "TTL a\n" +
  "EXPIRE a 50 GT\n" +
  "TTL a\n" +
  "EXPIRE a 50 LT\n" +
  "TTL a\n" +
  "EXPIRE a 10 NX\n" +
  "TTL a\n" +
  "SET n 5\n" +
  "EXPIRE n 30 GT\n" +
  "TTL n\n" +
  "EXPIRE n 30 LT\n" +
  "TTL n\n" +
  "INCR n\n" +
  "TTL n\n" +
  "PERSIST n\n" +
  "TTL n\n" +
  "PERSIST n\n" +
  "SET s abc\n" +
  "INCR s\n" +
  "SET t x EX 5\n" +
  "TICK 5\n" +
  "GET t\n" +
  "TTL t\n" +
  "SET u v NX\n" +
  "SET u w NX\n" +
  "GET u\n" +
  "SET z q XX\n" +
  "DEL a n s\n" +
  "TTL a\n" +
  "`;\n" +
  "\n" +
  "// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n" +
  "function execute(db, argv) {\n" +
  "  throw new Error('chưa cài đặt');\n" +
  "}\n" +
  "\n" +
  "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n" +
  "function fmt(reply) {\n" +
  "  if (reply === null) return '(nil)';\n" +
  "  if (typeof reply === 'number') return `(integer) ${reply}`;\n" +
  "  return String(reply);\n" +
  "}\n" +
  "\n" +
  "for (const raw of TRANSCRIPT.trim().split('\\n')) {\n" +
  "  const argv = raw.trim().split(/\\s+/);\n" +
  "  if (argv[0] === 'TICK') { db.now += Number(argv[1]); continue; }\n" +
  "  console.log(`${raw.trim()} -> ${fmt(execute(db, argv))}`);\n" +
  "}\n";

const Q1_SOLUTION =
  "function execute(db, argv) {\n" +
  "  const cmd = argv[0].toUpperCase();\n" +
  "  const key = argv[1];\n" +
  "\n" +
  "  // Hết hạn là LƯỜI: khoá quá hạn vẫn nằm trong Map cho tới khi có ai chạm vào.\n" +
  "  const live = (k) => {\n" +
  "    const e = db.data.get(k);\n" +
  "    if (!e) return undefined;\n" +
  "    if (e.expireAt !== null && db.now >= e.expireAt) { db.data.delete(k); return undefined; }\n" +
  "    return e;\n" +
  "  };\n" +
  "\n" +
  "  if (cmd === 'SET') {\n" +
  "    const value = argv[2];\n" +
  "    const flags = argv.slice(3).map((f) => f.toUpperCase());\n" +
  "    const exAt = flags.includes('EX') ? db.now + Number(argv[3 + flags.indexOf('EX') + 1]) : null;\n" +
  "    const cur = live(key);\n" +
  "    if (flags.includes('NX') && cur) return null;\n" +
  "    if (flags.includes('XX') && !cur) return null;\n" +
  "    // Mặc định một lần SET XOÁ SẠCH TTL cũ. Chỉ KEEPTTL mới giữ lại.\n" +
  "    let expireAt = null;\n" +
  "    if (exAt !== null) expireAt = exAt;\n" +
  "    else if (flags.includes('KEEPTTL') && cur) expireAt = cur.expireAt;\n" +
  "    db.data.set(key, { value, expireAt });\n" +
  "    return 'OK';\n" +
  "  }\n" +
  "\n" +
  "  if (cmd === 'GET') {\n" +
  "    const e = live(key);\n" +
  "    return e ? e.value : null;\n" +
  "  }\n" +
  "\n" +
  "  if (cmd === 'TTL') {\n" +
  "    const e = live(key);\n" +
  "    if (!e) return -2;\n" +
  "    if (e.expireAt === null) return -1;\n" +
  "    return e.expireAt - db.now;\n" +
  "  }\n" +
  "\n" +
  "  if (cmd === 'EXPIRE') {\n" +
  "    const e = live(key);\n" +
  "    if (!e) return 0;\n" +
  "    const cond = (argv[3] || '').toUpperCase();\n" +
  "    const has = e.expireAt !== null;\n" +
  "    // Khoá KHÔNG có TTL được coi là hạn VÔ HẠN: GT không bao giờ thắng nó,\n" +
  "    // còn LT thì luôn thắng.\n" +
  "    if (cond === 'NX' && has) return 0;\n" +
  "    if (cond === 'XX' && !has) return 0;\n" +
  "    if (cond === 'GT' && !has) return 0;\n" +
  "    if (cond === 'GT' && has && db.now + Number(argv[2]) <= e.expireAt) return 0;\n" +
  "    if (cond === 'LT' && has && db.now + Number(argv[2]) >= e.expireAt) return 0;\n" +
  "    e.expireAt = db.now + Number(argv[2]);\n" +
  "    return 1;\n" +
  "  }\n" +
  "\n" +
  "  if (cmd === 'PERSIST') {\n" +
  "    const e = live(key);\n" +
  "    if (!e || e.expireAt === null) return 0;\n" +
  "    e.expireAt = null;\n" +
  "    return 1;\n" +
  "  }\n" +
  "\n" +
  "  if (cmd === 'APPEND') {\n" +
  "    const e = live(key);\n" +
  "    // Ghi vào một khoá đã có KHÔNG đụng tới TTL của nó.\n" +
  "    if (!e) { db.data.set(key, { value: argv[2], expireAt: null }); return argv[2].length; }\n" +
  "    e.value += argv[2];\n" +
  "    return e.value.length;\n" +
  "  }\n" +
  "\n" +
  "  if (cmd === 'INCR') {\n" +
  "    const e = live(key);\n" +
  "    if (!e) { db.data.set(key, { value: '1', expireAt: null }); return 1; }\n" +
  "    if (!/^-?\\d+$/.test(e.value)) return 'ERR value is not an integer or out of range';\n" +
  "    e.value = String(Number(e.value) + 1);\n" +
  "    return Number(e.value);\n" +
  "  }\n" +
  "\n" +
  "  if (cmd === 'DEL') {\n" +
  "    let n = 0;\n" +
  "    for (const k of argv.slice(1)) if (live(k)) { db.data.delete(k); n++; }\n" +
  "    return n;\n" +
  "  }\n" +
  "\n" +
  "  throw new Error(`lệnh chưa hỗ trợ: ${cmd}`);\n" +
  "}\n";

const Q1_OUTPUT =
  "SET a hello EX 100 -> OK\n" +
  "TTL a -> (integer) 100\n" +
  "SET a world -> OK\n" +
  "TTL a -> (integer) -1\n" +
  "SET a again EX 60 -> OK\n" +
  "SET a keep KEEPTTL -> OK\n" +
  "TTL a -> (integer) 60\n" +
  "APPEND a ! -> (integer) 5\n" +
  "TTL a -> (integer) 60\n" +
  "GET a -> keep!\n" +
  "TTL a -> (integer) 30\n" +
  "EXPIRE a 100 GT -> (integer) 1\n" +
  "TTL a -> (integer) 100\n" +
  "EXPIRE a 50 GT -> (integer) 0\n" +
  "TTL a -> (integer) 100\n" +
  "EXPIRE a 50 LT -> (integer) 1\n" +
  "TTL a -> (integer) 50\n" +
  "EXPIRE a 10 NX -> (integer) 0\n" +
  "TTL a -> (integer) 50\n" +
  "SET n 5 -> OK\n" +
  "EXPIRE n 30 GT -> (integer) 0\n" +
  "TTL n -> (integer) -1\n" +
  "EXPIRE n 30 LT -> (integer) 1\n" +
  "TTL n -> (integer) 30\n" +
  "INCR n -> (integer) 6\n" +
  "TTL n -> (integer) 30\n" +
  "PERSIST n -> (integer) 1\n" +
  "TTL n -> (integer) -1\n" +
  "PERSIST n -> (integer) 0\n" +
  "SET s abc -> OK\n" +
  "INCR s -> ERR value is not an integer or out of range\n" +
  "SET t x EX 5 -> OK\n" +
  "GET t -> (nil)\n" +
  "TTL t -> (integer) -2\n" +
  "SET u v NX -> OK\n" +
  "SET u w NX -> (nil)\n" +
  "GET u -> v\n" +
  "SET z q XX -> (nil)\n" +
  "DEL a n s -> (integer) 3\n" +
  "TTL a -> (integer) -2";

const Q2_STARTER =
  "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n" +
  "// Một sorted set = Map<member, score>. Thứ tự KHÔNG lưu ở đây: nó được tính\n" +
  "// lại mỗi lần đọc, đúng như skip list của Redis tính ra.\n" +
  "const zsets = new Map();\n" +
  "\n" +
  "const TRANSCRIPT = `\n" +
  "ZADD board 10 alice 10 bob 5 carol 10 aaron\n" +
  "ZRANGE board 0 -1 WITHSCORES\n" +
  "ZREVRANGE board 0 -1 WITHSCORES\n" +
  "ZRANK board bob\n" +
  "ZREVRANK board bob\n" +
  "ZRANK board nobody\n" +
  "ZSCORE board alice\n" +
  "ZADD board NX 99 alice\n" +
  "ZSCORE board alice\n" +
  "ZADD board XX 1 zed\n" +
  "ZSCORE board zed\n" +
  "ZADD board GT CH 3 alice\n" +
  "ZSCORE board alice\n" +
  "ZADD board GT CH 30 alice\n" +
  "ZSCORE board alice\n" +
  "ZINCRBY board 2.5 carol\n" +
  "ZCARD board\n" +
  "ZRANGE board 0 1 WITHSCORES\n" +
  "ZCOUNT board 10 30\n" +
  "ZRANGEBYSCORE board (10 +inf\n" +
  "ZREMRANGEBYRANK board 0 0\n" +
  "ZRANGE board 0 -1\n" +
  "ZREM board bob nobody\n" +
  "ZRANGE board 0 -1 WITHSCORES\n" +
  "`;\n" +
  "\n" +
  "// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n" +
  "function execute(zsets, argv) {\n" +
  "  throw new Error('chưa cài đặt');\n" +
  "}\n" +
  "\n" +
  "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n" +
  "function fmt(reply) {\n" +
  "  if (reply === null) return '(nil)';\n" +
  "  if (Array.isArray(reply)) return reply.length ? reply.join(' ') : '(empty array)';\n" +
  "  if (typeof reply === 'number') return `(integer) ${reply}`;\n" +
  "  return String(reply);\n" +
  "}\n" +
  "\n" +
  "for (const raw of TRANSCRIPT.trim().split('\\n')) {\n" +
  "  console.log(`${raw.trim()} -> ${fmt(execute(zsets, raw.trim().split(/\\s+/)))}`);\n" +
  "}\n";

const Q2_SOLUTION =
  "// Redis in điểm số như một CHUỖI, và bỏ phần thập phân thừa: 10 chứ không\n" +
  "// phải 10.0, còn 7.5 thì giữ nguyên.\n" +
  "const fmtScore = (n) => String(n);\n" +
  "\n" +
  "// Thứ tự của một sorted set: theo ĐIỂM tăng dần, và khi điểm BẰNG NHAU thì\n" +
  "// theo tên thành viên so sánh từng byte, tăng dần. Đây là chỗ dễ sai nhất.\n" +
  "function sorted(z) {\n" +
  "  return [...z.entries()].sort((a, b) => a[1] - b[1] || (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));\n" +
  "}\n" +
  "\n" +
  "function execute(zsets, argv) {\n" +
  "  const cmd = argv[0].toUpperCase();\n" +
  "  const key = argv[1];\n" +
  "  const z = zsets.get(key);\n" +
  "  const rest = argv.slice(2);\n" +
  "\n" +
  "  if (cmd === 'ZADD') {\n" +
  "    const flags = [];\n" +
  "    while (rest.length && /^(NX|XX|GT|LT|CH)$/i.test(rest[0])) flags.push(rest.shift().toUpperCase());\n" +
  "    const target = z ?? new Map();\n" +
  "    if (!z) zsets.set(key, target);\n" +
  "    let added = 0, changed = 0;\n" +
  "    for (let i = 0; i < rest.length; i += 2) {\n" +
  "      const score = Number(rest[i]);\n" +
  "      const member = rest[i + 1];\n" +
  "      const has = target.has(member);\n" +
  "      if (flags.includes('NX') && has) continue;\n" +
  "      if (flags.includes('XX') && !has) continue;\n" +
  "      // GT/LT chỉ so khi thành viên ĐÃ có; thành viên mới thì luôn được thêm.\n" +
  "      if (has && flags.includes('GT') && score <= target.get(member)) continue;\n" +
  "      if (has && flags.includes('LT') && score >= target.get(member)) continue;\n" +
  "      if (has && target.get(member) !== score) changed++;\n" +
  "      if (!has) added++;\n" +
  "      target.set(member, score);\n" +
  "    }\n" +
  "    // Không có CH thì ZADD chỉ đếm thành viên MỚI, không đếm thành viên đổi điểm.\n" +
  "    return flags.includes('CH') ? added + changed : added;\n" +
  "  }\n" +
  "\n" +
  "  if (cmd === 'ZINCRBY') {\n" +
  "    const target = z ?? new Map();\n" +
  "    if (!z) zsets.set(key, target);\n" +
  "    const next = (target.get(argv[3]) ?? 0) + Number(argv[2]);\n" +
  "    target.set(argv[3], next);\n" +
  "    return fmtScore(next);\n" +
  "  }\n" +
  "\n" +
  "  if (cmd === 'ZSCORE') return z && z.has(argv[2]) ? fmtScore(z.get(argv[2])) : null;\n" +
  "  if (cmd === 'ZCARD') return z ? z.size : 0;\n" +
  "\n" +
  "  if (cmd === 'ZRANK' || cmd === 'ZREVRANK') {\n" +
  "    if (!z || !z.has(argv[2])) return null;\n" +
  "    const order = sorted(z).map(([m]) => m);\n" +
  "    const i = order.indexOf(argv[2]);\n" +
  "    // Hạng đếm từ 0. ZREVRANK là hạng trong danh sách đảo ngược.\n" +
  "    return cmd === 'ZRANK' ? i : order.length - 1 - i;\n" +
  "  }\n" +
  "\n" +
  "  if (cmd === 'ZRANGE' || cmd === 'ZREVRANGE') {\n" +
  "    if (!z) return [];\n" +
  "    let order = sorted(z);\n" +
  "    if (cmd === 'ZREVRANGE') order = order.reverse();\n" +
  "    const n = order.length;\n" +
  "    // Chỉ số âm đếm ngược từ cuối; hai đầu đều LẤY CẢ (inclusive).\n" +
  "    const norm = (v) => (Number(v) < 0 ? Math.max(0, n + Number(v)) : Number(v));\n" +
  "    const slice = order.slice(norm(argv[2]), norm(argv[3]) + 1);\n" +
  "    const withScores = (argv[4] || '').toUpperCase() === 'WITHSCORES';\n" +
  "    return slice.flatMap(([m, s]) => (withScores ? [m, fmtScore(s)] : [m]));\n" +
  "  }\n" +
  "\n" +
  "  if (cmd === 'ZCOUNT' || cmd === 'ZRANGEBYSCORE') {\n" +
  "    if (!z) return cmd === 'ZCOUNT' ? 0 : [];\n" +
  "    // Dấu ngoặc mở đầu nghĩa là \"không lấy chính giá trị này\".\n" +
  "    // `+inf` / `-inf` là điểm hợp lệ trong Redis, và Number('+inf') là NaN —\n" +
  "    // quên chỗ này thì mọi khoảng có vô cực trả về rỗng mà không báo lỗi.\n" +
  "    const num = (t) => (/^[+-]?inf$/i.test(t) ? (t[0] === '-' ? -Infinity : Infinity) : Number(t));\n" +
  "    const bound = (raw) => ({ excl: raw.startsWith('('), v: num(raw.startsWith('(') ? raw.slice(1) : raw) });\n" +
  "    const lo = bound(argv[2]), hi = bound(argv[3]);\n" +
  "    const hit = sorted(z).filter(([, s]) =>\n" +
  "      (lo.excl ? s > lo.v : s >= lo.v) && (hi.excl ? s < hi.v : s <= hi.v));\n" +
  "    return cmd === 'ZCOUNT' ? hit.length : hit.map(([m]) => m);\n" +
  "  }\n" +
  "\n" +
  "  if (cmd === 'ZREMRANGEBYRANK') {\n" +
  "    if (!z) return 0;\n" +
  "    const order = sorted(z);\n" +
  "    const n = order.length;\n" +
  "    const norm = (v) => (Number(v) < 0 ? Math.max(0, n + Number(v)) : Number(v));\n" +
  "    const doomed = order.slice(norm(argv[2]), norm(argv[3]) + 1);\n" +
  "    for (const [m] of doomed) z.delete(m);\n" +
  "    if (z.size === 0) zsets.delete(key);\n" +
  "    return doomed.length;\n" +
  "  }\n" +
  "\n" +
  "  if (cmd === 'ZREM') {\n" +
  "    if (!z) return 0;\n" +
  "    let n = 0;\n" +
  "    for (const m of argv.slice(2)) if (z.delete(m)) n++;\n" +
  "    // Sorted set rỗng KHÔNG tồn tại: khoá biến mất cùng thành viên cuối cùng.\n" +
  "    if (z.size === 0) zsets.delete(key);\n" +
  "    return n;\n" +
  "  }\n" +
  "\n" +
  "  throw new Error(`lệnh chưa hỗ trợ: ${cmd}`);\n" +
  "}\n";

const Q2_OUTPUT =
  "ZADD board 10 alice 10 bob 5 carol 10 aaron -> (integer) 4\n" +
  "ZRANGE board 0 -1 WITHSCORES -> carol 5 aaron 10 alice 10 bob 10\n" +
  "ZREVRANGE board 0 -1 WITHSCORES -> bob 10 alice 10 aaron 10 carol 5\n" +
  "ZRANK board bob -> (integer) 3\n" +
  "ZREVRANK board bob -> (integer) 0\n" +
  "ZRANK board nobody -> (nil)\n" +
  "ZSCORE board alice -> 10\n" +
  "ZADD board NX 99 alice -> (integer) 0\n" +
  "ZSCORE board alice -> 10\n" +
  "ZADD board XX 1 zed -> (integer) 0\n" +
  "ZSCORE board zed -> (nil)\n" +
  "ZADD board GT CH 3 alice -> (integer) 0\n" +
  "ZSCORE board alice -> 10\n" +
  "ZADD board GT CH 30 alice -> (integer) 1\n" +
  "ZSCORE board alice -> 30\n" +
  "ZINCRBY board 2.5 carol -> 7.5\n" +
  "ZCARD board -> (integer) 4\n" +
  "ZRANGE board 0 1 WITHSCORES -> carol 7.5 aaron 10\n" +
  "ZCOUNT board 10 30 -> (integer) 3\n" +
  "ZRANGEBYSCORE board (10 +inf -> alice\n" +
  "ZREMRANGEBYRANK board 0 0 -> (integer) 1\n" +
  "ZRANGE board 0 -1 -> aaron bob alice\n" +
  "ZREM board bob nobody -> (integer) 1\n" +
  "ZRANGE board 0 -1 WITHSCORES -> aaron 10 alice 30";

const Q3_STARTER =
  "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n" +
  "// Đồng hồ ảo (ms) + một \"Redis\" chỉ có GET/SET-với-TTL/TTL, một \"cơ sở dữ\n" +
  "// liệu\" chậm có đếm số lần bị gọi, và một bộ sinh số giả ngẫu nhiên CỐ ĐỊNH\n" +
  "// để độ nhiễu TTL luôn ra đúng một dãy số.\n" +
  "const clock = { now: 0 };\n" +
  "\n" +
  "const cache = {\n" +
  "  store: new Map(),\n" +
  "  live(key) {\n" +
  "    const e = this.store.get(key);\n" +
  "    if (!e) return undefined;\n" +
  "    if (clock.now >= e.expireAt) { this.store.delete(key); return undefined; }\n" +
  "    return e;\n" +
  "  },\n" +
  "  async get(key) { const e = this.live(key); return e ? e.value : null; },\n" +
  "  async set(key, value, ttlMs) { this.store.set(key, { value, expireAt: clock.now + ttlMs, ttlMs }); return 'OK'; },\n" +
  "  ttlOf(key) { const e = this.live(key); return e ? e.ttlMs : -2; },\n" +
  "};\n" +
  "\n" +
  "const ROWS = { 1: { id: 1, name: 'Laptop' }, 2: { id: 2, name: 'Chuột' } };\n" +
  "const db = {\n" +
  "  calls: 0,\n" +
  "  async findProduct(id) {\n" +
  "    this.calls++;\n" +
  "    await new Promise((r) => setImmediate(r));   // truy vấn chậm\n" +
  "    return ROWS[id] ?? null;\n" +
  "  },\n" +
  "};\n" +
  "\n" +
  "// Bộ sinh số cố định: rng() luôn trả cùng một dãy, nên TTL có nhiễu vẫn kiểm được.\n" +
  "let seed = 20260908;\n" +
  "const rng = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };\n" +
  "\n" +
  "const BASE_TTL_MS = 300_000;   // 300 giây\n" +
  "const JITTER_MS = 60_000;      // cộng thêm 0…59_999 ms\n" +
  "const NEG_TTL_MS = 30_000;     // bộ đệm phủ định: ngắn hơn hẳn\n" +
  "const NULL_SENTINEL = '__null__';\n" +
  "const keyOf = (id) => `product:${id}`;\n" +
  "\n" +
  "// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n" +
  "async function getProduct(id) {\n" +
  "  throw new Error('chưa cài đặt');\n" +
  "}\n" +
  "\n" +
  "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n" +
  "const show = (v) => (v === null ? 'null' : v.name);\n" +
  "\n" +
  "(async () => {\n" +
  "  const burst1 = await Promise.all([1, 1, 1, 1, 1].map(getProduct));\n" +
  "  console.log(`burst id=1 -> ${burst1.map(show).join(',')}`);\n" +
  "  console.log(`db.calls=${db.calls}`);\n" +
  "\n" +
  "  console.log(`hit id=1 -> ${show(await getProduct(1))}`);\n" +
  "  console.log(`db.calls=${db.calls}`);\n" +
  "\n" +
  "  const burst2 = await Promise.all([999, 999, 999, 999].map(getProduct));\n" +
  "  console.log(`burst id=999 -> ${burst2.map(show).join(',')}`);\n" +
  "  console.log(`db.calls=${db.calls}`);\n" +
  "  console.log(`cached id=999 raw -> ${await cache.get(keyOf(999))}`);\n" +
  "  console.log(`ttl id=999 -> ${cache.ttlOf(keyOf(999))}`);\n" +
  "\n" +
  "  console.log(`again id=999 -> ${show(await getProduct(999))}`);\n" +
  "  console.log(`db.calls=${db.calls}`);\n" +
  "\n" +
  "  clock.now += NEG_TTL_MS;\n" +
  "  console.log(`after neg-ttl id=999 -> ${show(await getProduct(999))}`);\n" +
  "  console.log(`db.calls=${db.calls}`);\n" +
  "\n" +
  "  console.log(`ttl id=2 -> ${await getProduct(2).then(() => cache.ttlOf(keyOf(2)))}`);\n" +
  "  const ttl1 = cache.ttlOf(keyOf(1));\n" +
  "  console.log(`ttl id=1 -> ${ttl1}`);\n" +
  "  console.log(`jitter differs -> ${ttl1 !== cache.ttlOf(keyOf(2))}`);\n" +
  "  console.log(`db.calls=${db.calls}`);\n" +
  "})();\n";

const Q3_SOLUTION =
  "// Một lượt gọi đang bay cho MỖI khoá. Đây là \"single-flight\" của bài 6.3:\n" +
  "// N lượt cùng trượt bộ đệm chỉ sinh ra ĐÚNG MỘT truy vấn.\n" +
  "const inFlight = new Map();\n" +
  "\n" +
  "async function getProduct(id) {\n" +
  "  const key = keyOf(id);\n" +
  "\n" +
  "  const cached = await cache.get(key);\n" +
  "  // Trúng bộ đệm PHỦ ĐỊNH: chuỗi mốc, không phải hàng dữ liệu.\n" +
  "  if (cached === NULL_SENTINEL) return null;\n" +
  "  if (cached !== null) return JSON.parse(cached);\n" +
  "\n" +
  "  const flying = inFlight.get(key);\n" +
  "  if (flying) return flying;\n" +
  "\n" +
  "  const promise = (async () => {\n" +
  "    const row = await db.findProduct(id);\n" +
  "    if (row === null) {\n" +
  "      // Đệm cả câu trả lời \"không có\" — nếu không, mọi id không tồn tại đều\n" +
  "      // xuyên thẳng xuống cơ sở dữ liệu, mãi mãi (cache penetration).\n" +
  "      await cache.set(key, NULL_SENTINEL, NEG_TTL_MS);\n" +
  "      return null;\n" +
  "    }\n" +
  "    // Nhiễu cộng THÊM vào TTL gốc, không trừ bớt: hai khoá nạp cùng lúc sẽ\n" +
  "    // hết hạn ở hai thời điểm khác nhau thay vì cùng rơi một nhịp.\n" +
  "    await cache.set(key, JSON.stringify(row), BASE_TTL_MS + Math.floor(rng() * JITTER_MS));\n" +
  "    return row;\n" +
  "  })().finally(() => { inFlight.delete(key); });\n" +
  "\n" +
  "  inFlight.set(key, promise);\n" +
  "  return promise;\n" +
  "}\n";

const Q3_OUTPUT =
  "burst id=1 -> Laptop,Laptop,Laptop,Laptop,Laptop\n" +
  "db.calls=1\n" +
  "hit id=1 -> Laptop\n" +
  "db.calls=1\n" +
  "burst id=999 -> null,null,null,null\n" +
  "db.calls=2\n" +
  "cached id=999 raw -> __null__\n" +
  "ttl id=999 -> 30000\n" +
  "again id=999 -> null\n" +
  "db.calls=2\n" +
  "after neg-ttl id=999 -> null\n" +
  "db.calls=3\n" +
  "ttl id=2 -> 336983\n" +
  "ttl id=1 -> 354330\n" +
  "jitter differs -> true\n" +
  "db.calls=4";

const Q4_STARTER =
  "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n" +
  "// Một Redis thu nhỏ, đủ để hỏi đúng câu chuyện của chương 7: WATCH / MULTI /\n" +
  "// EXEC, và một kịch bản chạy NGUYÊN KHỐI (chỗ Lua nằm trong Redis thật).\n" +
  "const srv = {\n" +
  "  data: new Map(),\n" +
  "  watchers: new Set(),\n" +
  "  // Mỗi hàm ở đây là một \"client khác\" chen vào ĐÚNG MỘT lần, ngay trước EXEC.\n" +
  "  interfere: [],\n" +
  "\n" +
  "  touch(key) { for (const c of this.watchers) if (c.watched.has(key)) c.dirty = true; },\n" +
  "\n" +
  "  connect() {\n" +
  "    const srvRef = this;\n" +
  "    return {\n" +
  "      watched: new Set(), dirty: false, queue: null,\n" +
  "      get(key) { return srvRef.data.has(key) ? srvRef.data.get(key) : null; },\n" +
  "      set(key, value) {\n" +
  "        if (this.queue) { this.queue.push(['SET', key, value]); return 'QUEUED'; }\n" +
  "        srvRef.data.set(key, String(value)); srvRef.touch(key); return 'OK';\n" +
  "      },\n" +
  "      incrby(key, by) {\n" +
  "        if (this.queue) { this.queue.push(['INCRBY', key, by]); return 'QUEUED'; }\n" +
  "        const next = Number(srvRef.data.get(key) ?? 0) + Number(by);\n" +
  "        srvRef.data.set(key, String(next)); srvRef.touch(key); return next;\n" +
  "      },\n" +
  "      del(key) {\n" +
  "        if (this.queue) { this.queue.push(['DEL', key]); return 'QUEUED'; }\n" +
  "        const had = srvRef.data.delete(key); srvRef.touch(key); return had ? 1 : 0;\n" +
  "      },\n" +
  "      watch(...keys) { for (const k of keys) this.watched.add(k); srvRef.watchers.add(this); return 'OK'; },\n" +
  "      unwatch() { this.watched.clear(); this.dirty = false; srvRef.watchers.delete(this); return 'OK'; },\n" +
  "      multi() { this.queue = []; return 'OK'; },\n" +
  "      exec() {\n" +
  "        const sabotage = srvRef.interfere.shift();\n" +
  "        if (sabotage) sabotage(srvRef);\n" +
  "        const q = this.queue;\n" +
  "        this.queue = null;\n" +
  "        // Khoá bị canh mà có người đụng vào -> EXEC trả về null, KHÔNG chạy gì.\n" +
  "        if (this.dirty) { this.unwatch(); return null; }\n" +
  "        this.unwatch();\n" +
  "        const out = [];\n" +
  "        for (const [cmd, ...args] of q) {\n" +
  "          if (cmd === 'SET') { srvRef.data.set(args[0], String(args[1])); out.push('OK'); }\n" +
  "          if (cmd === 'INCRBY') {\n" +
  "            const next = Number(srvRef.data.get(args[0]) ?? 0) + Number(args[1]);\n" +
  "            srvRef.data.set(args[0], String(next)); out.push(next);\n" +
  "          }\n" +
  "          if (cmd === 'DEL') out.push(srvRef.data.delete(args[0]) ? 1 : 0);\n" +
  "          srvRef.touch(args[0]);\n" +
  "        }\n" +
  "        return out;\n" +
  "      },\n" +
  "    };\n" +
  "  },\n" +
  "\n" +
  "  // Chạy `fn` như một kịch bản Lua: không lệnh nào của ai khác chen vào giữa.\n" +
  "  eval(fn, keys, args) {\n" +
  "    const api = {\n" +
  "      call: (cmd, ...rest) => {\n" +
  "        if (cmd === 'GET') return srv.data.has(rest[0]) ? srv.data.get(rest[0]) : false;\n" +
  "        if (cmd === 'DEL') { const had = srv.data.delete(rest[0]); srv.touch(rest[0]); return had ? 1 : 0; }\n" +
  "        if (cmd === 'SET') { srv.data.set(rest[0], String(rest[1])); srv.touch(rest[0]); return 'OK'; }\n" +
  "        throw new Error(`kịch bản chưa hỗ trợ ${cmd}`);\n" +
  "      },\n" +
  "    };\n" +
  "    return fn(api, keys, args);\n" +
  "  },\n" +
  "};\n" +
  "\n" +
  "const conn = srv.connect();\n" +
  "conn.set('bal:A', 100);\n" +
  "conn.set('bal:B', 50);\n" +
  "\n" +
  "// Lần EXEC ĐẦU TIÊN của phiên chuyển tiền sẽ bị một client khác chen ngang.\n" +
  "srv.interfere.push((s) => { s.data.set('bal:A', '200'); s.touch('bal:A'); });\n" +
  "\n" +
  "// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n" +
  "function transfer(conn, from, to, amount) {\n" +
  "  throw new Error('chưa cài đặt');\n" +
  "}\n" +
  "\n" +
  "function releaseLock(key, token) {\n" +
  "  throw new Error('chưa cài đặt');\n" +
  "}\n" +
  "\n" +
  "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n" +
  "const bal = () => `A=${conn.get('bal:A')} B=${conn.get('bal:B')}`;\n" +
  "\n" +
  "console.log(`before -> ${bal()}`);\n" +
  "const r1 = transfer(conn, 'bal:A', 'bal:B', 30);\n" +
  "console.log(`transfer 30 -> ok=${r1.ok} attempts=${r1.attempts} reason=${r1.reason}`);\n" +
  "console.log(`after -> ${bal()}`);\n" +
  "\n" +
  "const r2 = transfer(conn, 'bal:A', 'bal:B', 5000);\n" +
  "console.log(`transfer 5000 -> ok=${r2.ok} attempts=${r2.attempts} reason=${r2.reason}`);\n" +
  "console.log(`after -> ${bal()}`);\n" +
  "\n" +
  "conn.set('lock:job', 'token-1');\n" +
  "console.log(`release wrong token -> ${releaseLock('lock:job', 'token-9')}`);\n" +
  "console.log(`lock still held by -> ${conn.get('lock:job')}`);\n" +
  "console.log(`release right token -> ${releaseLock('lock:job', 'token-1')}`);\n" +
  "console.log(`lock now -> ${conn.get('lock:job')}`);\n" +
  "\n" +
  "// Khoá của worker 1 hết hạn, worker 2 đã giành được nó. Worker 1 tỉnh dậy và\n" +
  "// gọi giải phóng bằng token CŨ của mình.\n" +
  "conn.set('lock:job', 'token-2');\n" +
  "console.log(`late release by token-1 -> ${releaseLock('lock:job', 'token-1')}`);\n" +
  "console.log(`lock survived as -> ${conn.get('lock:job')}`);\n";

const Q4_SOLUTION =
  "function transfer(conn, from, to, amount) {\n" +
  "  for (let attempt = 1; attempt <= 5; attempt++) {\n" +
  "    // WATCH phải đặt TRƯỚC lần đọc mà quyết định dựa vào: canh sau khi đọc là\n" +
  "    // canh một giá trị mình đã cầm rồi, chẳng bảo vệ được gì.\n" +
  "    conn.watch(from);\n" +
  "    const balance = Number(conn.get(from) ?? 0);\n" +
  "\n" +
  "    if (balance < amount) {\n" +
  "      // Bỏ cuộc thì phải NHẢ canh, không thì lần MULTI sau thừa hưởng cờ bẩn.\n" +
  "      conn.unwatch();\n" +
  "      return { ok: false, attempts: attempt, reason: 'insufficient' };\n" +
  "    }\n" +
  "\n" +
  "    conn.multi();\n" +
  "    conn.incrby(from, -amount);\n" +
  "    conn.incrby(to, amount);\n" +
  "    const replies = conn.exec();\n" +
  "\n" +
  "    // null nghĩa là khoá bị canh đã đổi giữa WATCH và EXEC: KHÔNG có lệnh nào\n" +
  "    // chạy, và việc đúng đắn là đọc lại rồi quyết định lại từ đầu.\n" +
  "    if (replies !== null) return { ok: true, attempts: attempt, reason: 'ok' };\n" +
  "  }\n" +
  "  return { ok: false, attempts: 5, reason: 'contention' };\n" +
  "}\n" +
  "\n" +
  "function releaseLock(key, token) {\n" +
  "  // So token rồi mới xoá phải là MỘT bước. Viết thành GET rồi DEL thì giữa hai\n" +
  "  // lệnh ấy khoá có thể hết hạn và rơi vào tay người khác — và ta xoá khoá của họ.\n" +
  "  return srv.eval((redis, keys, args) => {\n" +
  "    if (redis.call('GET', keys[0]) === args[0]) return redis.call('DEL', keys[0]);\n" +
  "    return 0;\n" +
  "  }, [key], [token]);\n" +
  "}\n";

const Q4_OUTPUT =
  "before -> A=100 B=50\n" +
  "transfer 30 -> ok=true attempts=2 reason=ok\n" +
  "after -> A=170 B=80\n" +
  "transfer 5000 -> ok=false attempts=1 reason=insufficient\n" +
  "after -> A=170 B=80\n" +
  "release wrong token -> 0\n" +
  "lock still held by -> token-1\n" +
  "release right token -> 1\n" +
  "lock now -> null\n" +
  "late release by token-1 -> 0\n" +
  "lock survived as -> token-2";

const Q5_STARTER =
  "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n" +
  "// Đồng hồ ảo (ms). Lệnh IDLE do khung đề xử lý: nó chỉ đẩy đồng hồ tới trước,\n" +
  "// để \"đã nằm chờ bao lâu\" là một con số cố định thay vì phụ thuộc lúc chạy.\n" +
  "const clock = { now: 1_000_000 };\n" +
  "\n" +
  "// Một stream + các nhóm tiêu thụ của nó. Bạn tự quyết cách lưu bên trong;\n" +
  "// khung đề chỉ đọc qua execute().\n" +
  "const state = { streams: new Map() };\n" +
  "\n" +
  "const TRANSCRIPT = `\n" +
  "XADD orders 1-1 item apple\n" +
  "XADD orders 2-1 item banana\n" +
  "XADD orders 3-1 item cherry\n" +
  "XLEN orders\n" +
  "XGROUP CREATE orders billing 0\n" +
  "XREADGROUP GROUP billing w1 COUNT 2 STREAMS orders >\n" +
  "XREADGROUP GROUP billing w2 COUNT 5 STREAMS orders >\n" +
  "XREADGROUP GROUP billing w1 COUNT 5 STREAMS orders >\n" +
  "XPENDING orders billing\n" +
  "XACK orders billing 1-1\n" +
  "XACK orders billing 1-1\n" +
  "XPENDING orders billing\n" +
  "XREADGROUP GROUP billing w1 COUNT 5 STREAMS orders 0\n" +
  "IDLE 5000\n" +
  "XAUTOCLAIM orders billing w3 60000 0-0\n" +
  "IDLE 120000\n" +
  "XAUTOCLAIM orders billing w3 60000 0-0\n" +
  "XPENDING orders billing\n" +
  "XREADGROUP GROUP billing w3 COUNT 5 STREAMS orders 0\n" +
  "XACK orders billing 2-1 3-1\n" +
  "XPENDING orders billing\n" +
  "XADD orders 4-1 item date\n" +
  "XREADGROUP GROUP billing w1 COUNT 5 STREAMS orders >\n" +
  "`;\n" +
  "\n" +
  "// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n" +
  "function execute(state, argv) {\n" +
  "  throw new Error('chưa cài đặt');\n" +
  "}\n" +
  "\n" +
  "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n" +
  "const showEntries = (list) =>\n" +
  "  list.map(([id, fields]) =>\n" +
  "    `${id}{${Object.entries(fields).map(([f, v]) => `${f}=${v}`).join(',')}}`).join(' ');\n" +
  "\n" +
  "function fmt(reply) {\n" +
  "  if (reply === null) return '(nil)';\n" +
  "  if (typeof reply === 'number') return `(integer) ${reply}`;\n" +
  "  if (typeof reply === 'string') return reply;\n" +
  "  if (Array.isArray(reply)) return showEntries(reply);\n" +
  "  if ('cursor' in reply) return `cursor=${reply.cursor} claimed=[${showEntries(reply.entries)}]`;\n" +
  "  const per = Object.entries(reply.consumers).map(([n, k]) => `${n}=${k}`).join(' ');\n" +
  "  return `count=${reply.count} min=${reply.min ?? '(nil)'} max=${reply.max ?? '(nil)'}${per ? ' ' + per : ''}`;\n" +
  "}\n" +
  "\n" +
  "for (const raw of TRANSCRIPT.trim().split('\\n')) {\n" +
  "  const line = raw.trim();\n" +
  "  const argv = line.split(/\\s+/);\n" +
  "  if (argv[0] === 'IDLE') { clock.now += Number(argv[1]); continue; }\n" +
  "  console.log(`${line} -> ${fmt(execute(state, argv))}`);\n" +
  "}\n";

const Q5_SOLUTION =
  "function execute(state, argv) {\n" +
  "  const cmd = argv[0].toUpperCase();\n" +
  "\n" +
  "  if (cmd === 'XADD') {\n" +
  "    const key = argv[1], id = argv[2];\n" +
  "    const s = state.streams.get(key) ?? { entries: [], groups: new Map() };\n" +
  "    state.streams.set(key, s);\n" +
  "    const fields = {};\n" +
  "    for (let i = 3; i < argv.length; i += 2) fields[argv[i]] = argv[i + 1];\n" +
  "    s.entries.push({ id, fields });\n" +
  "    return id;\n" +
  "  }\n" +
  "\n" +
  "  if (cmd === 'XGROUP') {\n" +
  "    // Chú ý vị trí tham số: XGROUP CREATE <key> <group> <id> — tên khoá nằm ở\n" +
  "    // ô thứ BA, không phải ô thứ hai như mọi lệnh stream khác.\n" +
  "    const s = state.streams.get(argv[2]);\n" +
  "    // `0` = phát lại từ đầu; `$` = chỉ những mục thêm SAU thời điểm tạo nhóm.\n" +
  "    const startAfter = argv[4] === '$' ? (s.entries.at(-1)?.id ?? '0-0') : '0-0';\n" +
  "    // pel: id -> { consumer, deliveredAt, deliveries }\n" +
  "    s.groups.set(argv[3], { lastDelivered: startAfter, pel: new Map() });\n" +
  "    return 'OK';\n" +
  "  }\n" +
  "\n" +
  "  const stream = state.streams.get(argv[1]);\n" +
  "  if (cmd === 'XLEN') return stream ? stream.entries.length : 0;\n" +
  "\n" +
  "  if (cmd === 'XACK') {\n" +
  "    const g = stream.groups.get(argv[2]);\n" +
  "    let n = 0;\n" +
  "    // XACK chỉ đếm những mục ĐANG nằm trong PEL. Ack lại lần hai trả về 0 —\n" +
  "    // đó là cách phân biệt \"vừa xong\" với \"ai đó đã xong trước rồi\".\n" +
  "    for (const id of argv.slice(3)) if (g.pel.delete(id)) n++;\n" +
  "    return n;\n" +
  "  }\n" +
  "\n" +
  "  if (cmd === 'XREADGROUP') {\n" +
  "    const group = argv[2], consumer = argv[3];\n" +
  "    const count = Number(argv[argv.findIndex((a) => a.toUpperCase() === 'COUNT') + 1]);\n" +
  "    const key = argv[argv.length - 2];\n" +
  "    const from = argv[argv.length - 1];\n" +
  "    const s = state.streams.get(key);\n" +
  "    const g = s.groups.get(group);\n" +
  "\n" +
  "    if (from !== '>') {\n" +
  "      // ID tường minh = danh sách chờ CỦA CHÍNH consumer này, không phải của\n" +
  "      // người khác. Đây là đường phục hồi sau khi worker khởi động lại.\n" +
  "      const mine = s.entries\n" +
  "        .filter((e) => g.pel.get(e.id)?.consumer === consumer)\n" +
  "        .slice(0, count);\n" +
  "      return mine.map((e) => [e.id, e.fields]);\n" +
  "    }\n" +
  "\n" +
  "    // `>` = những mục CHƯA từng giao cho bất kỳ ai trong nhóm.\n" +
  "    const fresh = s.entries.filter((e) => e.id > g.lastDelivered).slice(0, count);\n" +
  "    if (!fresh.length) return null;   // không có gì mới: nil, không phải mảng rỗng\n" +
  "    for (const e of fresh) {\n" +
  "      g.pel.set(e.id, { consumer, deliveredAt: clock.now, deliveries: 1 });\n" +
  "      g.lastDelivered = e.id;\n" +
  "    }\n" +
  "    return fresh.map((e) => [e.id, e.fields]);\n" +
  "  }\n" +
  "\n" +
  "  if (cmd === 'XPENDING') {\n" +
  "    const g = stream.groups.get(argv[2]);\n" +
  "    const ids = [...g.pel.keys()].sort();\n" +
  "    const consumers = {};\n" +
  "    for (const { consumer } of g.pel.values()) consumers[consumer] = (consumers[consumer] ?? 0) + 1;\n" +
  "    return { count: ids.length, min: ids[0] ?? null, max: ids.at(-1) ?? null, consumers };\n" +
  "  }\n" +
  "\n" +
  "  if (cmd === 'XAUTOCLAIM') {\n" +
  "    const g = stream.groups.get(argv[2]);\n" +
  "    const claimer = argv[3], minIdle = Number(argv[4]);\n" +
  "    const claimed = [];\n" +
  "    for (const e of stream.entries) {\n" +
  "      const p = g.pel.get(e.id);\n" +
  "      // min-idle-time là chốt an toàn: chỉ giành được mục đã nằm chờ ĐỦ LÂU.\n" +
  "      // Nhờ nó, nhiều sweeper chạy song song vẫn an toàn — người giành được\n" +
  "      // đầu tiên đặt lại đồng hồ chờ về 0, người sau không thấy gì để lấy.\n" +
  "      if (!p || clock.now - p.deliveredAt < minIdle) continue;\n" +
  "      p.consumer = claimer;\n" +
  "      p.deliveredAt = clock.now;\n" +
  "      p.deliveries++;\n" +
  "      claimed.push([e.id, e.fields]);\n" +
  "    }\n" +
  "    // Con trỏ 0-0 nghĩa là đã quét hết một vòng.\n" +
  "    return { cursor: '0-0', entries: claimed };\n" +
  "  }\n" +
  "\n" +
  "  throw new Error(`lệnh chưa hỗ trợ: ${cmd}`);\n" +
  "}\n";

const Q5_OUTPUT =
  "XADD orders 1-1 item apple -> 1-1\n" +
  "XADD orders 2-1 item banana -> 2-1\n" +
  "XADD orders 3-1 item cherry -> 3-1\n" +
  "XLEN orders -> (integer) 3\n" +
  "XGROUP CREATE orders billing 0 -> OK\n" +
  "XREADGROUP GROUP billing w1 COUNT 2 STREAMS orders > -> 1-1{item=apple} 2-1{item=banana}\n" +
  "XREADGROUP GROUP billing w2 COUNT 5 STREAMS orders > -> 3-1{item=cherry}\n" +
  "XREADGROUP GROUP billing w1 COUNT 5 STREAMS orders > -> (nil)\n" +
  "XPENDING orders billing -> count=3 min=1-1 max=3-1 w1=2 w2=1\n" +
  "XACK orders billing 1-1 -> (integer) 1\n" +
  "XACK orders billing 1-1 -> (integer) 0\n" +
  "XPENDING orders billing -> count=2 min=2-1 max=3-1 w1=1 w2=1\n" +
  "XREADGROUP GROUP billing w1 COUNT 5 STREAMS orders 0 -> 2-1{item=banana}\n" +
  "XAUTOCLAIM orders billing w3 60000 0-0 -> cursor=0-0 claimed=[]\n" +
  "XAUTOCLAIM orders billing w3 60000 0-0 -> cursor=0-0 claimed=[2-1{item=banana} 3-1{item=cherry}]\n" +
  "XPENDING orders billing -> count=2 min=2-1 max=3-1 w3=2\n" +
  "XREADGROUP GROUP billing w3 COUNT 5 STREAMS orders 0 -> 2-1{item=banana} 3-1{item=cherry}\n" +
  "XACK orders billing 2-1 3-1 -> (integer) 2\n" +
  "XPENDING orders billing -> count=0 min=(nil) max=(nil)\n" +
  "XADD orders 4-1 item date -> 4-1\n" +
  "XREADGROUP GROUP billing w1 COUNT 5 STREAMS orders > -> 4-1{item=date}";

export default {
  course: { slug: 'redis' },
  exams: [
    {
      kind: 'PE',
      peType: 'CODE',
      code: 'PE',
      source: 'SAMPLE',
      sortOrder: 10,
      title: B(
        'Practical Exam — implement the semantics, not just the calls',
        'Thi thực hành — cài đặt ngữ nghĩa, chứ không chỉ gọi lệnh',
      ),
      description: B(
        'Five coding questions, submitted as a .zip. Key lifetime and the TTL rules, sorted-set ordering and the ZADD flags, cache-aside with negative caching and single-flight, WATCH/MULTI/EXEC with an atomic compare-and-delete, and a Stream consumer group with a pending list and XAUTOCLAIM — chapters 2, 4, 6, 7 and 8.',
        'Năm câu lập trình, nộp dưới dạng .zip. Vòng đời khoá và các luật TTL, thứ tự sorted set cùng các cờ của ZADD, cache-aside có đệm phủ định và gộp lượt, WATCH/MULTI/EXEC cùng phép so-rồi-xoá nguyên khối, và một nhóm tiêu thụ Stream với danh sách chờ và XAUTOCLAIM — các chương 2, 4, 6, 7 và 8.',
      ),
      durationMinutes: 90,
      totalPoints: 10,
      passMark: 4,
      isPublished: true,
      instructions: INSTRUCTIONS,
      questions: [
        /* ── Q1 · chương 2 ───────────────────────────────────────── */
        codeQ({
          points: 1.5,
          language: 'javascript',
          prompt: B(
            '<p><b>Q1 — The life of a key, and what a write does to its TTL (chapter 2).</b> Implement ' + c('execute(db, argv)') + ', which runs one command against the tiny keyspace in ' + c('db.data') + ' and returns the reply. The harness handles ' + c('TICK n') + ' for you — it only moves ' + c('db.now') + ' forward — and prints ' + c('null') + ' as ' + c('(nil)') + ' and a number as ' + c('(integer) n') + '.</p>' +
            '<p>Commands to support: ' + c('SET') + ' (with ' + c('EX') + ', ' + c('KEEPTTL') + ', ' + c('NX') + ', ' + c('XX') + '), ' + c('GET') + ', ' + c('TTL') + ', ' + c('EXPIRE') + ' (with ' + c('NX') + ', ' + c('XX') + ', ' + c('GT') + ', ' + c('LT') + '), ' + c('PERSIST') + ', ' + c('APPEND') + ', ' + c('INCR') + ' and ' + c('DEL') + '.</p>' +
            '<p>The rules that carry the marks, every one of them measured on a real 7.4 server:</p>' +
            '<ul>' +
            '<li>A plain ' + c('SET') + ' over an existing key <b>clears its TTL</b>. ' + c('SET k v KEEPTTL') + ' keeps it. This is the trap the whole chapter is built around: the key becomes immortal and nothing tells you.</li>' +
            '<li>An in-place modification — ' + c('APPEND') + ', ' + c('INCR') + ' — <b>preserves</b> the TTL. Only a full overwrite resets it.</li>' +
            '<li>' + c('TTL') + ' returns the seconds remaining, ' + c('-1') + ' when the key exists with no expiry, and ' + c('-2') + ' when there is no key. ' + c('PERSIST') + ' returns 1 only if it actually removed a TTL.</li>' +
            '<li>' + c('EXPIRE') + ' treats a key with <b>no TTL as having an infinite one</b>. So ' + c('EXPIRE k 30 GT') + ' on such a key returns 0 and sets nothing, while ' + c('EXPIRE k 30 LT') + ' on the very same key returns 1. Getting this backwards is the single most common wrong answer.</li>' +
            '<li>Expiry is <b>lazy</b>: a key past its deadline stays in the map until something touches it, and then it is gone for every command at once.</li>' +
            '<li>' + c('INCR') + ' on a non-numeric value returns the string ' + c('ERR value is not an integer or out of range') + ' — verbatim, and it must not modify the key.</li>' +
            '<li>' + c('SET k v NX') + ' returns ' + c('null') + ' (printed as ' + c('(nil)') + ') when the key exists, not an error. ' + c('XX') + ' is the mirror image.</li>' +
            '</ul>',

            '<p><b>Câu 1 — Vòng đời một khoá, và một lần ghi làm gì với TTL của nó (chương 2).</b> Cài đặt ' + c('execute(db, argv)') + ', chạy một câu lệnh trên cái keyspace tí hon nằm trong ' + c('db.data') + ' rồi trả về đáp. Khung đề tự lo lệnh ' + c('TICK n') + ' — nó chỉ đẩy ' + c('db.now') + ' tới trước — và in ' + c('null') + ' thành ' + c('(nil)') + ', in số thành ' + c('(integer) n') + '.</p>' +
            '<p>Các lệnh phải đỡ được: ' + c('SET') + ' (kèm ' + c('EX') + ', ' + c('KEEPTTL') + ', ' + c('NX') + ', ' + c('XX') + '), ' + c('GET') + ', ' + c('TTL') + ', ' + c('EXPIRE') + ' (kèm ' + c('NX') + ', ' + c('XX') + ', ' + c('GT') + ', ' + c('LT') + '), ' + c('PERSIST') + ', ' + c('APPEND') + ', ' + c('INCR') + ' và ' + c('DEL') + '.</p>' +
            '<p>Những luật ăn điểm, và cái nào cũng đã đo trên máy chủ 7.4 thật:</p>' +
            '<ul>' +
            '<li>Một lệnh ' + c('SET') + ' trơn đè lên khoá đã có sẽ <b>xoá sạch TTL</b> của nó. ' + c('SET k v KEEPTTL') + ' thì giữ lại. Đây đúng là cái bẫy mà cả chương xoay quanh: khoá trở thành bất tử và không có gì báo cho bạn biết.</li>' +
            '<li>Một phép sửa tại chỗ — ' + c('APPEND') + ', ' + c('INCR') + ' — thì <b>giữ nguyên</b> TTL. Chỉ ghi đè trọn vẹn mới đặt lại nó.</li>' +
            '<li>' + c('TTL') + ' trả về số giây còn lại, ' + c('-1') + ' khi khoá có mà không hạn, và ' + c('-2') + ' khi không có khoá. ' + c('PERSIST') + ' chỉ trả 1 nếu nó thật sự gỡ được một TTL.</li>' +
            '<li>' + c('EXPIRE') + ' coi một khoá <b>không có TTL là có hạn vô hạn</b>. Nên ' + c('EXPIRE k 30 GT') + ' trên khoá ấy trả về 0 và không đặt gì, còn ' + c('EXPIRE k 30 LT') + ' trên đúng khoá ấy trả về 1. Nhớ ngược chỗ này là câu trả lời sai phổ biến nhất.</li>' +
            '<li>Hết hạn là <b>lười</b>: khoá quá hạn vẫn nằm trong map cho tới khi có ai chạm vào, và lúc ấy nó biến mất với mọi lệnh cùng lúc.</li>' +
            '<li>' + c('INCR') + ' trên một giá trị không phải số trả về chuỗi ' + c('ERR value is not an integer or out of range') + ' — nguyên văn, và nó không được sửa khoá.</li>' +
            '<li>' + c('SET k v NX') + ' trả về ' + c('null') + ' (in ra thành ' + c('(nil)') + ') khi khoá đã tồn tại, chứ không phải một lỗi. ' + c('XX') + ' là hình phản chiếu của nó.</li>' +
            '</ul>',
          ),
          starterCode: Q1_STARTER,
          expectedOutput: Q1_OUTPUT,
          sampleSolution: Q1_SOLUTION,
          rubric: rubric([
            ['ttlwrite',
              'A plain <code>SET</code> clears the TTL, <code>KEEPTTL</code> keeps it, and <code>APPEND</code> / <code>INCR</code> leave it untouched — the three lines that separate a working cache from an immortal keyspace.',
              'Một lệnh <code>SET</code> trơn xoá TTL, <code>KEEPTTL</code> giữ lại, còn <code>APPEND</code> / <code>INCR</code> không đụng tới nó — ba dòng phân biệt một bộ đệm chạy được với một keyspace bất tử.',
              0.5],
            ['expireflags',
              'The four <code>EXPIRE</code> conditions are right, including the pair that decides the question: <code>GT</code> refuses a key with no TTL (returns 0) while <code>LT</code> accepts it (returns 1).',
              'Bốn điều kiện của <code>EXPIRE</code> đúng, kể cả cặp quyết định cả câu: <code>GT</code> từ chối khoá không có TTL (trả 0) còn <code>LT</code> thì nhận (trả 1).',
              0.4],
            ['replies',
              'Reply shapes match the server: <code>TTL</code> gives -1 vs -2 for the right reasons, <code>PERSIST</code> returns 1 then 0, <code>SET … NX</code> returns nil rather than throwing, and <code>INCR</code> on a string returns the exact error text without changing the value.',
              'Dạng đáp trả khớp máy chủ: <code>TTL</code> cho -1 và -2 đúng lý do, <code>PERSIST</code> trả 1 rồi 0, <code>SET … NX</code> trả nil chứ không ném lỗi, và <code>INCR</code> trên chuỗi trả đúng nguyên văn thông báo lỗi mà không đổi giá trị.',
              0.4],
            ['lazy',
              'Expiry is lazy and consistent: after the clock passes a deadline the key is invisible to <code>GET</code>, to <code>TTL</code> (-2) and to <code>DEL</code>&#x27;s count alike, with no timer anywhere in the answer.',
              'Hết hạn là lười và nhất quán: sau khi đồng hồ vượt hạn thì khoá tàng hình với <code>GET</code>, với <code>TTL</code> (-2) và với số đếm của <code>DEL</code> như nhau, và trong bài không có một cái hẹn giờ nào.',
              0.2],
          ]),
        }),

        /* ── Q2 · chương 4 ───────────────────────────────────────── */
        codeQ({
          points: 1.5,
          language: 'javascript',
          prompt: B(
            '<p><b>Q2 — A sorted set is ordered by two things, not one (chapter 4).</b> Implement ' + c('execute(zsets, argv)') + ' for ' + c('ZADD') + ' (flags ' + c('NX') + ', ' + c('XX') + ', ' + c('GT') + ', ' + c('LT') + ', ' + c('CH') + '), ' + c('ZINCRBY') + ', ' + c('ZSCORE') + ', ' + c('ZCARD') + ', ' + c('ZRANK') + ', ' + c('ZREVRANK') + ', ' + c('ZRANGE') + ' / ' + c('ZREVRANGE') + ' (with ' + c('WITHSCORES') + '), ' + c('ZCOUNT') + ', ' + c('ZRANGEBYSCORE') + ', ' + c('ZREMRANGEBYRANK') + ' and ' + c('ZREM') + '.</p>' +
            '<p>What the marks are actually for:</p>' +
            '<ul>' +
            '<li><b>The tie-break.</b> Order is by score ascending and, when two members share a score, by the member string compared byte for byte, also ascending. In the fixture ' + c('aaron') + ', ' + c('alice') + ' and ' + c('bob') + ' all score 10, so they come out in that order — and ' + c('ZREVRANGE') + ' reverses the whole list, giving ' + c('bob, alice, aaron') + ', not "score descending, name ascending".</li>' +
            '<li><b>Ranks are 0-based</b>, and ' + c('ZRANK') + ' of a member that is not there is ' + c('(nil)') + ', not ' + c('-1') + ' and not "last".</li>' +
            '<li><b>The flags.</b> ' + c('NX') + ' refuses to touch an existing member; ' + c('XX') + ' refuses to create a new one; ' + c('GT') + ' only raises a score and ' + c('LT') + ' only lowers it. Without ' + c('CH') + ', ' + c('ZADD') + ' counts only members it <em>added</em> — a score it merely changed counts as zero.</li>' +
            '<li><b>Scores print like Redis prints them:</b> the integer 10 comes back as ' + c('10') + ', never ' + c('10.0') + ', while 7.5 stays ' + c('7.5') + '.</li>' +
            '<li><b>Range endpoints are inclusive on both sides</b> and a negative index counts back from the end. In ' + c('ZRANGEBYSCORE') + ', a leading ' + c('(') + ' makes a bound exclusive, and ' + c('+inf') + ' / ' + c('-inf') + ' are real bounds — note that ' + c('Number(&#x27;+inf&#x27;)') + ' is ' + c('NaN') + ', which is exactly how this question is failed silently.</li>' +
            '<li><b>An empty sorted set does not exist</b> — when the last member goes, so does the key.</li>' +
            '</ul>',

            '<p><b>Câu 2 — Một sorted set sắp theo HAI thứ, không phải một (chương 4).</b> Cài đặt ' + c('execute(zsets, argv)') + ' cho ' + c('ZADD') + ' (các cờ ' + c('NX') + ', ' + c('XX') + ', ' + c('GT') + ', ' + c('LT') + ', ' + c('CH') + '), ' + c('ZINCRBY') + ', ' + c('ZSCORE') + ', ' + c('ZCARD') + ', ' + c('ZRANK') + ', ' + c('ZREVRANK') + ', ' + c('ZRANGE') + ' / ' + c('ZREVRANGE') + ' (có ' + c('WITHSCORES') + '), ' + c('ZCOUNT') + ', ' + c('ZRANGEBYSCORE') + ', ' + c('ZREMRANGEBYRANK') + ' và ' + c('ZREM') + '.</p>' +
            '<p>Điểm thật ra dành cho những chỗ này:</p>' +
            '<ul>' +
            '<li><b>Cách phân định khi bằng điểm.</b> Thứ tự là theo điểm tăng dần, và khi hai thành viên cùng điểm thì theo chuỗi tên so từng byte, cũng tăng dần. Trong dữ liệu cho sẵn, ' + c('aaron') + ', ' + c('alice') + ' và ' + c('bob') + ' cùng 10 điểm nên ra đúng thứ tự đó — và ' + c('ZREVRANGE') + ' đảo NGUYÊN danh sách, cho ra ' + c('bob, alice, aaron') + ', chứ không phải "điểm giảm dần, tên tăng dần".</li>' +
            '<li><b>Hạng đếm từ 0</b>, và ' + c('ZRANK') + ' của một thành viên không có trong tập là ' + c('(nil)') + ', không phải ' + c('-1') + ' và cũng không phải "hạng chót".</li>' +
            '<li><b>Các cờ.</b> ' + c('NX') + ' từ chối đụng vào thành viên đã có; ' + c('XX') + ' từ chối tạo thành viên mới; ' + c('GT') + ' chỉ nâng điểm còn ' + c('LT') + ' chỉ hạ điểm. Không có ' + c('CH') + ' thì ' + c('ZADD') + ' chỉ đếm những thành viên nó <em>thêm mới</em> — một điểm số chỉ bị đổi thì đếm là không.</li>' +
            '<li><b>Điểm in ra đúng kiểu Redis in:</b> số nguyên 10 trả về là ' + c('10') + ', không bao giờ là ' + c('10.0') + ', còn 7.5 thì vẫn là ' + c('7.5') + '.</li>' +
            '<li><b>Hai đầu khoảng đều LẤY CẢ</b>, và chỉ số âm đếm ngược từ cuối. Trong ' + c('ZRANGEBYSCORE') + ', dấu ' + c('(') + ' mở đầu làm cận trở thành loại trừ, và ' + c('+inf') + ' / ' + c('-inf') + ' là cận hợp lệ — nhớ rằng ' + c('Number(&#x27;+inf&#x27;)') + ' là ' + c('NaN') + ', và đó đúng là cách trượt câu này một cách im lặng.</li>' +
            '<li><b>Một sorted set rỗng thì không tồn tại</b> — thành viên cuối cùng đi thì khoá đi theo.</li>' +
            '</ul>',
          ),
          starterCode: Q2_STARTER,
          expectedOutput: Q2_OUTPUT,
          sampleSolution: Q2_SOLUTION,
          rubric: rubric([
            ['ordering',
              'Ordering is recomputed from (score, member) on every read, with equal scores broken lexicographically ascending, and <code>ZREVRANGE</code> reverses that whole order rather than sorting names the other way.',
              'Thứ tự được tính lại từ (điểm, tên) ở mỗi lần đọc, điểm bằng nhau thì phân định theo tên tăng dần, và <code>ZREVRANGE</code> đảo NGUYÊN thứ tự đó chứ không phải sắp tên theo chiều ngược.',
              0.5],
            ['flags',
              'The five <code>ZADD</code> flags behave as specified — <code>GT</code> raises only, <code>LT</code> lowers only, <code>NX</code>/<code>XX</code> are mirror images, and the return value counts added members unless <code>CH</code> is present.',
              'Năm cờ của <code>ZADD</code> chạy đúng như mô tả — <code>GT</code> chỉ nâng, <code>LT</code> chỉ hạ, <code>NX</code>/<code>XX</code> là hình phản chiếu của nhau, và giá trị trả về đếm thành viên thêm mới trừ khi có <code>CH</code>.',
              0.4],
            ['ranges',
              'Rank ranges include both ends and accept negative indices; score ranges honour the exclusive <code>(</code> prefix and both infinities.',
              'Khoảng theo hạng lấy cả hai đầu và nhận chỉ số âm; khoảng theo điểm tôn trọng dấu <code>(</code> loại trừ và cả hai đầu vô cực.',
              0.3],
            ['replies',
              'Reply shapes match: scores are strings with no trailing decimal, a missing member gives nil not -1, and a sorted set that loses its last member ceases to exist.',
              'Dạng đáp trả khớp: điểm là chuỗi không có phần thập phân thừa, thành viên không có trả nil chứ không phải -1, và một sorted set mất thành viên cuối thì không còn tồn tại.',
              0.3],
          ]),
        }),

        /* ── Q3 · chương 6 ───────────────────────────────────────── */
        codeQ({
          points: 2,
          language: 'javascript',
          prompt: B(
            '<p><b>Q3 — The production cache-aside, not the five-line one (chapter 6).</b> The starter gives you a cache with a TTL, a slow database that counts its own calls, a deterministic ' + c('rng()') + ' and a virtual clock. Implement ' + c('getProduct(id)') + '. Chapter 6.1 says the five-line version is missing four things; three of them are graded here.</p>' +
            '<ul>' +
            '<li><b>Single-flight.</b> Five concurrent calls for the same cold id must produce <b>exactly one</b> database call, and all five must resolve to the same row. Keep a map of in-flight promises keyed by the cache key, and delete the entry when the work settles — a lock that is never released is worse than no lock. (Inside one process a promise map is the honest implementation; across processes you would take ' + c('SET lock:key token NX EX 10') + ' and release it with the compare-and-delete script from question 4.)</li>' +
            '<li><b>Negative caching.</b> An id the database does not have must also be cached, as the sentinel ' + c('NULL_SENTINEL') + ' with the short ' + c('NEG_TTL_MS') + ', and read back as ' + c('null') + '. Without it every request for a missing id goes straight through to the database forever — cache penetration, which looks like a cold cache that never warms up. The sentinel exists so that "cached the value null" and "not cached at all" stay distinguishable.</li>' +
            '<li><b>TTL jitter.</b> A real row is cached for ' + c('BASE_TTL_MS + Math.floor(rng() * JITTER_MS)') + ' — jitter added <b>upward</b>, never subtracted, so that keys filled in the same second do not all expire in the same second. The two ids in the transcript must end up with different TTLs.</li>' +
            '<li>A cache hit must not call the database at all, and the negative entry must expire on its own once the clock passes ' + c('NEG_TTL_MS') + ', letting the next call reach the database again.</li>' +
            '</ul>' +
            '<p>The harness prints ' + c('db.calls') + ' after each step; those numbers are the question. ' + c('rng()') + ' is seeded, so calling it a different number of times changes the printed TTLs — call it exactly once per row you cache.</p>',

            '<p><b>Câu 3 — Bản cache-aside dùng thật, không phải bản năm dòng (chương 6).</b> Khung đề cho sẵn một bộ đệm có TTL, một cơ sở dữ liệu chậm tự đếm số lần bị gọi, một hàm ' + c('rng()') + ' cố định và một đồng hồ ảo. Hãy cài ' + c('getProduct(id)') + '. Bài 6.1 nói bản năm dòng thiếu bốn thứ; ba trong số đó bị chấm ở đây.</p>' +
            '<ul>' +
            '<li><b>Gộp lượt (single-flight).</b> Năm lời gọi đồng thời cho cùng một id còn nguội phải sinh ra <b>đúng một</b> truy vấn, và cả năm phải trả về cùng một hàng. Hãy giữ một map các promise đang bay, khoá theo tên khoá bộ đệm, và xoá mục ấy khi việc xong — một cái khoá không bao giờ được nhả còn tệ hơn không có khoá. (Trong một tiến trình thì map promise là bản cài đặt thành thật; xuyên nhiều tiến trình thì bạn sẽ giành ' + c('SET lock:key token NX EX 10') + ' rồi nhả bằng đúng kịch bản so-rồi-xoá của câu 4.)</li>' +
            '<li><b>Đệm phủ định.</b> Một id mà cơ sở dữ liệu không có cũng phải được đệm, dưới dạng chuỗi mốc ' + c('NULL_SENTINEL') + ' với ' + c('NEG_TTL_MS') + ' ngắn, và đọc ra thành ' + c('null') + '. Không có nó thì mọi lượt hỏi một id không tồn tại đều xuyên thẳng xuống cơ sở dữ liệu, mãi mãi — đó là cache penetration, nhìn giống hệt một bộ đệm nguội mãi không ấm lên. Chuỗi mốc tồn tại để "đã đệm giá trị null" và "chưa đệm gì cả" vẫn phân biệt được với nhau.</li>' +
            '<li><b>Nhiễu TTL.</b> Một hàng thật được đệm trong ' + c('BASE_TTL_MS + Math.floor(rng() * JITTER_MS)') + ' — nhiễu cộng <b>THÊM</b>, không bao giờ trừ đi, để những khoá được nạp trong cùng một giây không cùng hết hạn trong một giây. Hai id trong transcript phải ra hai TTL khác nhau.</li>' +
            '<li>Trúng bộ đệm thì tuyệt đối không được gọi cơ sở dữ liệu, và mục phủ định phải tự hết hạn khi đồng hồ vượt ' + c('NEG_TTL_MS') + ', để lượt gọi kế tiếp lại xuống được tới cơ sở dữ liệu.</li>' +
            '</ul>' +
            '<p>Khung đề in ' + c('db.calls') + ' sau mỗi bước; chính những con số ấy là câu hỏi. ' + c('rng()') + ' đã gieo hạt sẵn, nên gọi nó nhiều hay ít lần hơn sẽ làm đổi các TTL in ra — hãy gọi đúng MỘT lần cho mỗi hàng bạn đem đi đệm.</p>',
          ),
          starterCode: Q3_STARTER,
          expectedOutput: Q3_OUTPUT,
          sampleSolution: Q3_SOLUTION,
          rubric: rubric([
            ['singleflight',
              'Five concurrent misses on one id produce exactly one <code>db.findProduct</code> call and five identical results, and the in-flight entry is removed when the promise settles rather than leaking.',
              'Năm lượt cùng trượt trên một id sinh ra đúng một lời gọi <code>db.findProduct</code> và năm kết quả giống nhau, và mục đang-bay được xoá khi promise kết thúc chứ không rò lại.',
              0.7],
            ['negative',
              'A missing row is cached as the sentinel with the short TTL, read back as <code>null</code>, keeps <code>db.calls</code> flat on the repeat, and lets the database be reached again only after the clock passes that TTL.',
              'Một hàng không có được đệm dưới dạng chuỗi mốc với TTL ngắn, đọc ra thành <code>null</code>, giữ <code>db.calls</code> đứng yên ở lượt lặp lại, và chỉ cho xuống cơ sở dữ liệu lần nữa sau khi đồng hồ vượt qua TTL đó.',
              0.6],
            ['jitter',
              'The TTL for a real row is the base plus a value drawn from the given <code>rng()</code>, added upward, with <code>rng()</code> called exactly once per cached row so the two printed TTLs differ and stay reproducible.',
              'TTL của một hàng thật là TTL gốc cộng thêm một giá trị lấy từ <code>rng()</code> cho sẵn, cộng lên chứ không trừ đi, và <code>rng()</code> được gọi đúng một lần cho mỗi hàng đem đệm, nhờ đó hai TTL in ra khác nhau và vẫn lặp lại được.',
              0.4],
            ['hits',
              'A cache hit returns the parsed row without touching the database, and the value stored is a serialised row rather than an object reference.',
              'Trúng bộ đệm thì trả về hàng đã giải mã mà không đụng tới cơ sở dữ liệu, và thứ được cất là một hàng đã tuần tự hoá chứ không phải một tham chiếu object.',
              0.3],
          ]),
        }),

        /* ── Q4 · chương 7 ───────────────────────────────────────── */
        codeQ({
          points: 2.5,
          language: 'javascript',
          prompt: B(
            '<p><b>Q4 — Optimistic concurrency, and the release that must be one step (chapter 7).</b> The starter is a miniature Redis with ' + c('WATCH') + ', ' + c('UNWATCH') + ', ' + c('MULTI') + ', ' + c('EXEC') + ' and an ' + c('srv.eval(fn, keys, args)') + ' that runs a callback the way Redis runs a Lua script: nothing else happens in the middle. One "other client" is queued in ' + c('srv.interfere') + ' and fires exactly once, immediately before the first ' + c('EXEC') + '.</p>' +
            '<p><b>Part one — ' + c('transfer(conn, from, to, amount)') + '.</b> Return ' + c('{ ok, attempts, reason }') + '.</p>' +
            '<ul>' +
            '<li><b>WATCH before you read</b>, not after. Reading first and watching afterwards is the ordering bug that makes a retry loop look correct and protect nothing.</li>' +
            '<li>If the balance is short, ' + c('UNWATCH') + ' and return ' + c('{ ok: false, reason: &#x27;insufficient&#x27; }') + '. An abandoned watch rides the connection into somebody else&#x27;s next transaction and makes it fail for no visible reason.</li>' +
            '<li>Otherwise ' + c('MULTI') + ', queue both ' + c('INCRBY') + ' calls, ' + c('EXEC') + '. <b>' + c('EXEC') + ' returning ' + c('null') + ' means a watched key changed and nothing ran</b> — it is not an empty result and it is not success. Re-read and decide again from the top, up to five attempts; count them, because the harness prints the count.</li>' +
            '</ul>' +
            '<p><b>Part two — ' + c('releaseLock(key, token)') + '.</b> Return 1 if this token owned the lock and it was deleted, 0 otherwise. It must go through ' + c('srv.eval') + ': comparing with ' + c('GET') + ' and then deleting with ' + c('DEL') + ' as two separate calls is the classic bug, because between them the lock can expire and be taken by another worker whose lock you then delete. The last two lines of the expected output are exactly that scenario, and a two-step release prints ' + c('1') + ' there instead of ' + c('0') + '.</p>' +
            '<p>Note what the harness reports back: inside ' + c('srv.eval') + ', ' + c('redis.call(&#x27;GET&#x27;, k)') + ' on a missing key returns <b>' + c('false') + '</b>, exactly as it does in Lua — never ' + c('null') + ', never ' + c('undefined') + '.</p>',

            '<p><b>Câu 4 — Kiểm soát đồng thời lạc quan, và phép nhả khoá buộc phải là MỘT bước (chương 7).</b> Khung đề là một Redis thu nhỏ có ' + c('WATCH') + ', ' + c('UNWATCH') + ', ' + c('MULTI') + ', ' + c('EXEC') + ' và một hàm ' + c('srv.eval(fn, keys, args)') + ' chạy một callback theo đúng cách Redis chạy một kịch bản Lua: không có gì chen vào giữa. Một "client khác" đã xếp sẵn trong ' + c('srv.interfere') + ' và nổ đúng một lần, ngay trước lần ' + c('EXEC') + ' đầu tiên.</p>' +
            '<p><b>Phần một — ' + c('transfer(conn, from, to, amount)') + '.</b> Trả về ' + c('{ ok, attempts, reason }') + '.</p>' +
            '<ul>' +
            '<li><b>WATCH trước khi đọc</b>, không phải sau. Đọc trước rồi mới canh là đúng cái lỗi thứ tự khiến một vòng thử lại trông thì đúng mà chẳng bảo vệ được gì.</li>' +
            '<li>Nếu số dư không đủ thì ' + c('UNWATCH') + ' rồi trả ' + c('{ ok: false, reason: &#x27;insufficient&#x27; }') + '. Một phép canh bỏ dở sẽ đi theo kết nối vào giao dịch kế tiếp của người khác và làm nó hỏng mà không có lý do nào nhìn thấy được.</li>' +
            '<li>Nếu đủ thì ' + c('MULTI') + ', xếp hàng hai lệnh ' + c('INCRBY') + ', rồi ' + c('EXEC') + '. <b>' + c('EXEC') + ' trả về ' + c('null') + ' nghĩa là một khoá đang canh đã đổi và KHÔNG lệnh nào chạy</b> — nó không phải kết quả rỗng, và cũng không phải thành công. Hãy đọc lại rồi quyết định lại từ đầu, tối đa năm lượt; đếm số lượt, vì khung đề in con số đó ra.</li>' +
            '</ul>' +
            '<p><b>Phần hai — ' + c('releaseLock(key, token)') + '.</b> Trả 1 nếu token này đúng là chủ khoá và khoá đã bị xoá, ngược lại trả 0. Nó bắt buộc phải đi qua ' + c('srv.eval') + ': so bằng ' + c('GET') + ' rồi xoá bằng ' + c('DEL') + ' thành hai lời gọi tách rời chính là con bug kinh điển, bởi giữa hai lệnh ấy khoá có thể hết hạn và rơi vào tay một worker khác — và bạn xoá mất khoá của họ. Hai dòng cuối của kết quả mong đợi đúng là kịch bản đó, và một phép nhả hai bước sẽ in ' + c('1') + ' ở chỗ ấy thay vì ' + c('0') + '.</p>' +
            '<p>Để ý điều khung đề trả về: bên trong ' + c('srv.eval') + ', ' + c('redis.call(&#x27;GET&#x27;, k)') + ' trên một khoá không tồn tại trả về <b>' + c('false') + '</b>, y hệt trong Lua — không phải ' + c('null') + ', cũng không phải ' + c('undefined') + '.</p>',
          ),
          starterCode: Q4_STARTER,
          expectedOutput: Q4_OUTPUT,
          sampleSolution: Q4_SOLUTION,
          rubric: rubric([
            ['watchorder',
              '<code>WATCH</code> is issued before the read that the decision depends on, and every path that gives up calls <code>UNWATCH</code> so no watch is left on the connection.',
              '<code>WATCH</code> được gọi TRƯỚC lần đọc mà quyết định dựa vào, và mọi nhánh bỏ cuộc đều gọi <code>UNWATCH</code> để không bỏ lại phép canh nào trên kết nối.',
              0.7],
            ['execnull',
              'A <code>null</code> from <code>EXEC</code> is treated as "aborted, nothing ran" and drives a bounded re-read-and-retry loop; the transfer succeeds on the second attempt with A=170 and B=80.',
              'Giá trị <code>null</code> từ <code>EXEC</code> được hiểu là "bị huỷ, không lệnh nào chạy" và dẫn tới một vòng đọc-lại-rồi-thử-lại có giới hạn; phép chuyển tiền thành công ở lượt thứ hai với A=170 và B=80.',
              0.7],
            ['insufficient',
              'The insufficient-funds path returns before opening a <code>MULTI</code>, leaves both balances untouched, and reports one attempt.',
              'Nhánh không đủ tiền trả về TRƯỚC khi mở <code>MULTI</code>, để nguyên cả hai số dư, và báo đúng một lượt.',
              0.4],
            ['atomicrelease',
              'The lock release compares and deletes inside a single <code>srv.eval</code> call, so a wrong token returns 0 and leaves the lock, and a stale token cannot delete a lock that has since been retaken.',
              'Phép nhả khoá so sánh rồi xoá trong CÙNG một lời gọi <code>srv.eval</code>, nhờ đó token sai trả 0 và để khoá lại, còn token cũ không thể xoá một cái khoá đã bị người khác giành mất.',
              0.7],
          ]),
        }),

        /* ── Q5 · chương 8 ───────────────────────────────────────── */
        codeQ({
          points: 2.5,
          language: 'javascript',
          prompt: B(
            '<p><b>Q5 — A consumer group is a pending list with opinions (chapter 8).</b> Implement ' + c('execute(state, argv)') + ' for ' + c('XADD') + ', ' + c('XLEN') + ', ' + c('XGROUP CREATE') + ', ' + c('XREADGROUP') + ', ' + c('XACK') + ', ' + c('XPENDING') + ' (summary form) and ' + c('XAUTOCLAIM') + '. The harness handles ' + c('IDLE n') + ', which only moves the virtual clock, and formats the replies for you.</p>' +
            '<ul>' +
            '<li><b>Work is split, not copied.</b> ' + c('XREADGROUP … STREAMS key &gt;') + ' delivers only entries never handed to anyone in this group, so ' + c('w1') + ' taking two entries leaves the third for ' + c('w2') + '. When there is nothing new the reply is ' + c('(nil)') + ', not an empty list.</li>' +
            '<li><b>An explicit id is a different question.</b> ' + c('XREADGROUP … STREAMS key 0') + ' returns <em>this consumer&#x27;s own</em> still-pending entries — the recovery path a worker runs on startup. It never returns another consumer&#x27;s pending entries; that is what claiming is for.</li>' +
            '<li><b>The PEL.</b> Every delivery records which entry, which consumer, when, and how many times. ' + c('XACK') + ' removes entries from it and returns how many it actually removed, so acking the same id twice gives 1 then <b>0</b>. ' + c('XPENDING') + ' reports the count, the lowest and highest pending id, and a per-consumer tally — and when nothing is pending the min and max are ' + c('(nil)') + '.</li>' +
            '<li><b>' + c('min-idle-time') + ' is the safety catch.</b> ' + c('XAUTOCLAIM') + ' may only take an entry that has been pending at least that long, which is why several sweepers can run at once: the first claimer resets the idle clock to zero and the second finds nothing. In the transcript the same claim is attempted twice — after 5 seconds it takes nothing, after a further 120 it takes both. Claiming <b>changes the owner in the pending list; it does not deliver</b>, so the new owner sees the work on its next read with an explicit id. Return the cursor ' + c('0-0') + ' to mean the sweep reached the end.</li>' +
            '<li>Watch the argument positions: ' + c('XGROUP CREATE key group id') + ' puts the key <b>third</b>, unlike every other command here.</li>' +
            '</ul>',

            '<p><b>Câu 5 — Một nhóm tiêu thụ là một danh sách chờ có quan điểm (chương 8).</b> Cài đặt ' + c('execute(state, argv)') + ' cho ' + c('XADD') + ', ' + c('XLEN') + ', ' + c('XGROUP CREATE') + ', ' + c('XREADGROUP') + ', ' + c('XACK') + ', ' + c('XPENDING') + ' (dạng tóm tắt) và ' + c('XAUTOCLAIM') + '. Khung đề lo lệnh ' + c('IDLE n') + ' — nó chỉ đẩy đồng hồ ảo — và tự định dạng các đáp trả.</p>' +
            '<ul>' +
            '<li><b>Việc được CHIA, không phải nhân bản.</b> ' + c('XREADGROUP … STREAMS key &gt;') + ' chỉ giao những mục chưa từng đưa cho bất kỳ ai trong nhóm, nên ' + c('w1') + ' lấy hai mục thì mục thứ ba còn lại cho ' + c('w2') + '. Khi không còn gì mới, đáp trả là ' + c('(nil)') + ', không phải một danh sách rỗng.</li>' +
            '<li><b>Một ID tường minh là một câu hỏi khác.</b> ' + c('XREADGROUP … STREAMS key 0') + ' trả về những mục còn đang chờ <em>của chính consumer này</em> — đường phục hồi mà một worker chạy lúc khởi động. Nó không bao giờ trả về mục đang chờ của consumer khác; đó là việc của phép giành.</li>' +
            '<li><b>Danh sách chờ (PEL).</b> Mỗi lần giao đều ghi lại: mục nào, consumer nào, lúc nào, và đã giao mấy lần. ' + c('XACK') + ' gỡ mục khỏi danh sách ấy và trả về số mục nó THẬT SỰ gỡ được, nên ack cùng một id hai lần cho ra 1 rồi <b>0</b>. ' + c('XPENDING') + ' báo số lượng, id nhỏ nhất và lớn nhất đang chờ, cùng bảng đếm theo từng consumer — và khi không còn gì chờ thì min với max là ' + c('(nil)') + '.</li>' +
            '<li><b>' + c('min-idle-time') + ' là cái chốt an toàn.</b> ' + c('XAUTOCLAIM') + ' chỉ được lấy một mục đã nằm chờ ít nhất bấy nhiêu lâu, và chính vì thế nhiều sweeper chạy cùng lúc vẫn an toàn: người giành trước đặt lại đồng hồ chờ về không, người sau không thấy gì để lấy. Trong transcript, cùng một phép giành được thử hai lần — sau 5 giây nó không lấy được gì, sau 120 giây nữa thì lấy cả hai. Giành là <b>đổi chủ trong danh sách chờ; nó KHÔNG giao hàng</b>, nên chủ mới chỉ thấy việc ở lần đọc kế tiếp bằng một ID tường minh. Trả con trỏ ' + c('0-0') + ' để báo vòng quét đã hết.</li>' +
            '<li>Để ý vị trí tham số: ' + c('XGROUP CREATE key group id') + ' đặt tên khoá ở ô <b>thứ ba</b>, khác với mọi lệnh còn lại ở đây.</li>' +
            '</ul>',
          ),
          starterCode: Q5_STARTER,
          expectedOutput: Q5_OUTPUT,
          sampleSolution: Q5_SOLUTION,
          rubric: rubric([
            ['split',
              'The <code>&gt;</code> path splits entries across consumers instead of copying them, advances the group&#x27;s last-delivered id, and returns nil rather than an empty list when nothing is new.',
              'Đường <code>&gt;</code> chia mục cho các consumer thay vì nhân bản, đẩy mốc đã-giao-cuối của nhóm tiến lên, và trả nil chứ không phải danh sách rỗng khi không có gì mới.',
              0.6],
            ['pel',
              'The pending list records the owner and the delivery time; <code>XACK</code> returns 1 then 0 for the same id, and <code>XPENDING</code> reports the right count, min, max and per-consumer tally at every step, including the empty case.',
              'Danh sách chờ ghi lại chủ sở hữu và thời điểm giao; <code>XACK</code> trả 1 rồi 0 cho cùng một id, và <code>XPENDING</code> báo đúng số lượng, min, max cùng bảng đếm theo consumer ở mọi bước, kể cả khi rỗng.',
              0.7],
            ['ownpending',
              'Reading with an explicit id returns only the calling consumer&#x27;s pending entries — <code>w1</code> sees 2-1 and not 3-1, and after the claim <code>w3</code> sees both.',
              'Đọc bằng ID tường minh chỉ trả về những mục đang chờ của chính consumer gọi — <code>w1</code> thấy 2-1 mà không thấy 3-1, và sau khi giành thì <code>w3</code> thấy cả hai.',
              0.5],
            ['claim',
              '<code>XAUTOCLAIM</code> respects <code>min-idle-time</code> — nothing at 5 seconds, both entries at 125 — transfers ownership without acknowledging anything, resets the idle clock, and returns the 0-0 cursor.',
              '<code>XAUTOCLAIM</code> tôn trọng <code>min-idle-time</code> — không lấy gì ở mốc 5 giây, lấy cả hai ở mốc 125 giây — chuyển quyền sở hữu mà không ack gì cả, đặt lại đồng hồ chờ, và trả con trỏ 0-0.',
              0.7],
          ]),
        }),
      ],
    },
  ],
};
