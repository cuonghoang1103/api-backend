/**
 * 12.6 — Bảo vệ dự án: kịch bản demo 7 phút (cham/demo.sh chạy thật), câu hỏi bất ngờ "Redis chết thì sao?" (đo trước/sau sửa),
 * 15 câu hội đồng hay hỏi, tự chấm theo rubric (khoá nestjs, soạn 24/11/2026).
 * Output THẬT (máy nhà, Node 22.22, Nest 12.6.0, @nestjs/throttler 6.8.0, ioredis 5.11.1, Redis 7.4, PostgreSQL 16): lab/c12 —
 * ../chay-demo.sh, ../redis-chet.sh ⇒ lab/c12/o/126-*.txt. Ghép: gen.mjs rồi ghep.sh 126 nst-12-6-bao-ve.
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'nestjs', bai: 'nst-7-5-throttler-helmet', title: 'NestJS 7.5 — Throttler theo email', sub: 'Bộ đếm đăng nhập mà mục 2 quyết định "đóng" khi Redis hỏng.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-11-2-health', title: 'NestJS 11.2 — Liveness, readiness', sub: 'Câu hỏi mở cuối mục 2: readiness có nên hỏi Redis?', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-12-7-phong-van', title: 'NestJS 12.7 — Câu hỏi phỏng vấn', sub: 'Sau buổi bảo vệ là buổi phỏng vấn — cùng chất liệu.', cta: 'Mở bài →' }),
].join('\n');
const NGUON = [
  nguon('🕵️', 'Laxman Muthiyah (14/07/2019) — How I Could Have Hacked Any Instagram Account', 'Vượt giới hạn tốc độ bằng request đồng thời từ 1000 máy.', 'https://thezerohack.com/hack-any-instagram'),
].join('\n');
const MA_DEMO = "#!/usr/bin/env bash\n# demo.sh — kịch bản demo 7 phút trước hội đồng, mỗi bước MỘT lệnh, in đúng thứ cần nói. Cần: stack đang chạy + seed.\n#   U=http://127.0.0.1:42150 MK=<SEED_PASSWORD> HOPTHU=\"docker compose exec -T redis redis-cli LRANGE hopthu 0 -1\" ./cham/demo.sh\nset -u\nU=${U:-http://127.0.0.1:42150}; MK=${MK:?đặt MK}; HOPTHU=${HOPTHU:-true}\nJ='content-type: application/json'\ntok() { curl -s $U/auth/login -H \"$J\" -d \"{\\\"email\\\":\\\"$1\\\",\\\"password\\\":\\\"$MK\\\"}\" | node -pe 'JSON.parse(require(\"fs\").readFileSync(0)).accessToken'; }\nbuoc() { printf '\\n── %s\\n' \"$*\"; }\nngan() { node -e 'let s=\"\";process.stdin.on(\"data\",d=>s+=d).on(\"end\",()=>{const j=JSON.parse(s);const k=process.argv.slice(1);console.log(JSON.stringify(Array.isArray(j)?j.map(x=>Object.fromEntries(k.map(t=>[t,x[t]]))):Object.fromEntries(k.filter(t=>t in j).map(t=>[t,j[t]]))))})' \"$@\"; }\nNGAY=2027-09-$(printf '%02d' $(( $(date +%s) / 60 % 28 + 1 )))\nREG() { curl -s $U/auth/register -H \"$J\" -d \"{\\\"email\\\":\\\"$1@fpt.edu.vn\\\",\\\"password\\\":\\\"$MK\\\",\\\"studentCode\\\":\\\"$2\\\"}\" >/dev/null; }\nDUOI=$(date +%s | tail -c 5); REG binh$DUOI SE18$DUOI\nAN=$(tok an.se170001@fpt.edu.vn); BINH=$(tok binh$DUOI@fpt.edu.vn); GV=$(tok gv.lan@fpt.edu.vn); AD=$(tok admin@fpt.edu.vn)\nDAT() { curl -s -w '\\n' $U/bookings -H \"$J\" -H \"authorization: Bearer $1\" -d \"{\\\"roomId\\\":1,\\\"start\\\":\\\"${NGAY}T$2:00+07:00\\\",\\\"end\\\":\\\"${NGAY}T$3:00+07:00\\\",\\\"attendees\\\":12$4}\"; }\n\nbuoc \"1. Phòng và giờ mở cửa (công khai)\"\ncurl -s $U/rooms | ngan code capacity managerId open close\nbuoc \"2. An đặt AL-201 09:00–11:00 ⇒ CHỜ DUYỆT\"\nR=$(DAT \"$AN\" 09:00 11:00 \"\"); echo \"$R\" | ngan id status start end\nID=$(echo \"$R\" | node -pe 'JSON.parse(require(\"fs\").readFileSync(0)).id')\nbuoc \"3. Bình đặt chồng 10:00–12:00 ⇒ 409 (PostgreSQL EXCLUDE chặn, không phải if trong mã)\"\nDAT \"$BINH\" 10:00 12:00 \"\" | ngan status type detail\nbuoc \"4. Bình gửi kèm status/userId (mass assignment) ⇒ 400\"\nDAT \"$BINH\" 13:00 14:00 ',\"status\":\"APPROVED\",\"userId\":1' | ngan status errors\nbuoc \"5. Bình xem / huỷ lịch của An ⇒ 404 (không lộ lịch có tồn tại)\"\ncurl -s $U/bookings/$ID -H \"authorization: Bearer $BINH\" | ngan status detail\ncurl -s -X DELETE $U/bookings/$ID -H \"authorization: Bearer $BINH\" | ngan status detail\nbuoc \"6. Giảng viên phụ trách duyệt ⇒ 200; worker gửi email qua hàng đợi\"\ncurl -s -X PATCH $U/bookings/$ID/approve -H \"authorization: Bearer $GV\" | ngan id status\nsleep 1; $HOPTHU | grep \"#$ID \" || true\nbuoc \"7. Admin thu hẹp giờ 10:00–21:00 ⇒ lịch của An ra ngoài giờ: không bị huỷ, An được báo\"\ncurl -s -X PUT $U/rooms/1/hours -H \"$J\" -H \"authorization: Bearer $AD\" -d '{\"open\":\"10:00\",\"close\":\"21:00\"}' | ngan code open close ngoaiGioMoi\nsleep 1; $HOPTHU | grep \"#$ID \" || true\ncurl -s -X PUT $U/rooms/1/hours -H \"$J\" -H \"authorization: Bearer $AD\" -d '{\"open\":\"07:00\",\"close\":\"21:00\"}' >/dev/null";
const OUT_DEMO = "── 1. Phòng và giờ mở cửa (công khai)\n[{\"code\":\"AL-201\",\"capacity\":30,\"managerId\":2,\"open\":\"07:00\",\"close\":\"21:00\"},{\"code\":\"BE-105\",\"capacity\":24,\"managerId\":null,\"open\":\"07:00\",\"close\":\"21:00\"},{\"code\":\"GA-310\",\"capacity\":40,\"managerId\":null,\"open\":\"07:00\",\"close\":\"21:00\"}]\n── 2. An đặt AL-201 09:00–11:00 ⇒ CHỜ DUYỆT\n{\"id\":1,\"status\":\"PENDING\",\"start\":\"2027-09-18T02:00:00.000Z\",\"end\":\"2027-09-18T04:00:00.000Z\"}\n── 3. Bình đặt chồng 10:00–12:00 ⇒ 409 (PostgreSQL EXCLUDE chặn, không phải if trong mã)\n{\"status\":409,\"type\":\"https://lab-booking.example/errors/BOOKING_CONFLICT\",\"detail\":\"khung giờ đã có người đặt\"}\n── 4. Bình gửi kèm status/userId (mass assignment) ⇒ 400\n{\"status\":400,\"errors\":[\"property status should not exist\",\"property userId should not exist\"]}\n── 5. Bình xem / huỷ lịch của An ⇒ 404 (không lộ lịch có tồn tại)\n{\"status\":404,\"detail\":\"không có lịch 1\"}\n{\"status\":404,\"detail\":\"không có lịch 1\"}\n── 6. Giảng viên phụ trách duyệt ⇒ 200; worker gửi email qua hàng đợi\n{\"id\":1,\"status\":\"APPROVED\"}\nan.se170001@fpt.edu.vn | Lịch #1 (phòng AL-201) đã được duyệt\n── 7. Admin thu hẹp giờ 10:00–21:00 ⇒ lịch của An ra ngoài giờ: không bị huỷ, An được báo\n{\"code\":\"AL-201\",\"open\":\"10:00\",\"close\":\"21:00\",\"ngoaiGioMoi\":[1]}\nan.se170001@fpt.edu.vn | Lịch #1 (phòng AL-201) đã được duyệt\nan.se170001@fpt.edu.vn | Phòng AL-201 đổi giờ mở cửa 10:00–21:00: lịch #1 nằm ngoài giờ mới, hãy đổi hoặc huỷ";
const OUT_RC_TRUOC = "## Redis còn sống\nGET /rooms                        200 0.010269s  [{\"id\":1,\"code\":\"AL-201\",\"building\":\"Alpha\",\"capacity\":30,\"managerId\":2,\"open\":\"07:00\",\"close\":\"21:00\nPOST /bookings                    201 0.040971s  {\"id\":1,\"roomId\":1,\"userId\":3,\"start\":\"2027-05-01T02:00:00.000Z\",\"end\":\"2027-05-01T03:00:00.000Z\",\"at\n## docker stop nst-redis\nGET /rooms                        500 1.234583s  {\"type\":\"https://lab-booking.example/errors/500\",\"title\":\"Internal Server Error\",\"status\":500,\"detail\nPOST /bookings                    500 1.942440s  {\"type\":\"https://lab-booking.example/errors/500\",\"title\":\"Internal Server Error\",\"status\":500,\"detail\nGET /health/ready                 503 0.005745s  {\"type\":\"https://lab-booking.example/errors/503\",\"title\":\"ServiceUnavailableException\",\"status\":503,\"\n## docker start nst-redis\nGET /rooms                        200 0.007249s  [{\"id\":1,\"code\":\"AL-201\",\"building\":\"Alpha\",\"capacity\":30,\"managerId\":2,\"open\":\"07:00\",\"close\":\"21:00\nPOST /bookings                    201 0.036827s  {\"id\":2,\"roomId\":1,\"userId\":3,\"start\":\"2027-05-03T02:00:00.000Z\",\"end\":\"2027-05-03T03:00:00.000Z\",\"at";
const OUT_RC_SAU = "## Redis còn sống\nGET /rooms                        200 0.011010s  [{\"id\":1,\"code\":\"AL-201\",\"building\":\"Alpha\",\"capacity\":30,\"managerId\":2,\"open\":\"07:00\",\"close\":\"21:00\nPOST /bookings                    201 0.058399s  {\"id\":1,\"roomId\":1,\"userId\":3,\"start\":\"2027-05-01T02:00:00.000Z\",\"end\":\"2027-05-01T03:00:00.000Z\",\"at\n## docker stop nst-redis\nGET /rooms                        200 0.007081s  [{\"id\":1,\"code\":\"AL-201\",\"building\":\"Alpha\",\"capacity\":30,\"managerId\":2,\"open\":\"07:00\",\"close\":\"21:00\nPOST /bookings                    201 0.013106s  {\"id\":2,\"roomId\":1,\"userId\":3,\"start\":\"2027-05-02T02:00:00.000Z\",\"end\":\"2027-05-02T03:00:00.000Z\",\"at\nGET /health/ready                 503 0.007881s  {\"type\":\"https://lab-booking.example/errors/503\",\"title\":\"ServiceUnavailableException\",\"status\":503,\"\nPOST /auth/login                  503 0.002835s  {\"type\":\"https://lab-booking.example/errors/RATE_LIMIT_STORE_DOWN\",\"title\":\"ServiceUnavailableExcepti\n## docker start nst-redis\nGET /rooms                        200 0.005444s  [{\"id\":1,\"code\":\"AL-201\",\"building\":\"Alpha\",\"capacity\":30,\"managerId\":2,\"open\":\"07:00\",\"close\":\"21:00\nPOST /bookings                    201 0.012951s  {\"id\":3,\"roomId\":1,\"userId\":3,\"start\":\"2027-05-03T02:00:00.000Z\",\"end\":\"2027-05-03T03:00:00.000Z\",\"at";
const MA_THR = "  private readonly log = new Logger('Throttler');\n  private canhBaoLuc = 0;\n  // mốc 12: enableOfflineQueue: false ⇒ Redis mất kết nối thì lệnh hỏng NGAY (không xếp hàng chờ ~1,2 s mỗi request như đo ở bài 12.6)\n  constructor(c: ConfigService<Env, true>) { this.redis = new Redis(c.get('REDIS_URL', { infer: true }), { maxRetriesPerRequest: 2, enableOfflineQueue: false }); }\n\n  /** mốc 12 — Redis hỏng thì sao? Đo được: cả API trả 500, kể cả GET /rooms công khai. Quyết định (ADR-006):\n   *  - bộ đếm chung 'default' ⇒ MỞ (cho qua, cảnh báo tối đa mỗi 10 s): mất giới hạn tốc độ vài phút còn hơn mất cả hệ thống\n   *  - bộ đếm đăng nhập 'login-email' ⇒ ĐÓNG (503): không có bộ đếm thì đoán mật khẩu không bị chặn */\n  async increment(key: string, ttl: number, limit: number, blockDuration: number, name: string) {\n    try { return await this.dem(key, ttl, limit, blockDuration, name); }\n    catch (err) {\n      if (name === 'login-email') throw new ServiceUnavailableException('tạm thời không đăng nhập được, thử lại sau ít phút', { errorCode: 'RATE_LIMIT_STORE_DOWN' });\n      if (Date.now() - this.canhBaoLuc > 10_000) { this.canhBaoLuc = Date.now(); this.log.warn(`Redis hỏng, tạm bỏ giới hạn '${name}': ${(err as Error).message}`); }\n      return { totalHits: 0, timeToExpire: 0, isBlocked: false, timeToBlockExpire: 0 };\n    }\n  }";
const ADR6 = "# ADR-006: When Redis is down, the general rate limit fails open, the login limit fails closed\n\n- Status: accepted (milestone 12) · Context: throttler counters live in Redis (milestone 11). Measured with Redis stopped: every request — even public `GET /rooms` — returned 500 after ~1.2 s of ioredis retries.\n- Decision: `RedisThrottlerStorage.increment()` catches store errors. Limit `default` ⇒ let the request through and log a warning at most every 10 s. Limit `login-email` ⇒ `503 RATE_LIMIT_STORE_DOWN`, because without a counter password guessing is not limited. `enableOfflineQueue: false` so commands fail immediately instead of waiting.\n- Consequences: measured after the change, Redis stopped: `GET /rooms` 200, `POST /bookings` 201, `POST /auth/login` 503, no added latency. Open question: `/health/ready` still includes Redis, so an active health checker would drain every replica — see lesson 12.6.";

const HOI = [
  ['Why is this a guard and not a middleware?', 'Vì sao chỗ này là guard mà không phải middleware?', 'A guard runs after routing and sees the handler\'s metadata (@Public, @CanPerm); a middleware does not know which handler will run. (1.4, 3.4)', 'Guard chạy sau khi đã định tuyến và đọc được metadata của handler (@Public, @CanPerm); middleware không biết handler nào sẽ chạy. (1.4, 3.4)'],
  ['What stops two students booking the same slot?', 'Cái gì chặn hai sinh viên đặt cùng khung?', 'The EXCLUDE constraint in PostgreSQL; the service only maps 23P01 to 409. Show L1: 1 × 201, 49 × 409. (6.5, ADR-001)', 'Ràng buộc EXCLUDE trong PostgreSQL; service chỉ đổi 23P01 thành 409. Chỉ vào L1: 1 × 201, 49 × 409. (6.5, ADR-001)'],
  ['Why does a pending request hold the slot?', 'Sao lịch chờ duyệt lại giữ chỗ?', 'ADR-002: first come, first served, one-click approval; abuse limited by 3 pending per user.', 'ADR-002: ai xin trước giữ trước, duyệt một cú bấm; lạm dụng bị chặn bằng hạn mức 3 lịch chờ.'],
  ['Show me the pending limit under concurrency.', 'Cho xem hạn mức khi đồng thời.', 'L7: 10 concurrent ⇒ exactly 3; without the advisory lock 8. Explain why a transaction alone was not enough. (12.3)', 'L7: 10 request đồng thời ⇒ đúng 3; bỏ khoá tư vấn thì 8. Giải thích vì sao chỉ transaction là chưa đủ. (12.3)'],
  ['Why 404 and not 403 for someone else\'s booking?', 'Sao lịch của người khác trả 404 chứ không phải 403?', '403 confirms the id exists; 404 reveals nothing. 403 only when you may see it but not change it. (7.4)', '403 xác nhận id đó có tồn tại; 404 không lộ gì. Chỉ 403 khi được xem mà không được sửa. (7.4)'],
  ['What if I send "status": "APPROVED" in the body?', 'Nếu tôi gửi "status": "APPROVED" trong body thì sao?', 'Global ValidationPipe with whitelist + forbidNonWhitelisted ⇒ 400 listing the fields. (4.2)', 'ValidationPipe toàn cục bật whitelist + forbidNonWhitelisted ⇒ 400 kèm tên các trường. (4.2)'],
  ['Kill the worker now. Do emails get duplicated?', 'Giết worker ngay bây giờ. Email có bị trùng không?', 'No: job id, email_log row, provider idempotency key; the SIGKILL experiment is in 9.4. Each layer has a test (12.4).', 'Không: id job, dòng email_log, khoá idempotency của nhà cung cấp; phép thử SIGKILL ở bài 9.4. Mỗi lớp có test (12.4).'],
  ['Redis is down. What still works?', 'Redis chết. Cái gì còn chạy?', 'Booking and reading work; login is 503 on purpose; queued emails wait and the sweep job re-queues them. Measured before/after. (this lesson)', 'Đặt và xem lịch vẫn chạy; đăng nhập 503 có chủ đích; email chờ và job quét bù xếp lại. Có số đo trước/sau. (bài này)'],
  ['How do two API replicas share socket events?', 'Hai bản API chia sự kiện socket thế nào?', 'Socket.IO Redis adapter; T2 in CI passes through nginx with two replicas. (10.2)', 'Redis adapter của Socket.IO; T2 trong CI đi qua nginx với hai bản API. (10.2)'],
  ['Where does the time zone live?', 'Múi giờ nằm ở đâu?', 'Instants in UTC (timestamptz); opening hours in Vietnam minutes; fixed +07:00 (ADR-004) — and the POSIX "+07" trap.', 'Thời điểm lưu UTC (timestamptz); giờ mở cửa lưu số phút giờ Việt Nam; lệch cố định +07:00 (ADR-004) — và bẫy "+07" của POSIX.'],
  ['How do you know your tests test the right thing?', 'Sao biết test kiểm đúng thứ cần kiểm?', 'Every protection was removed once and the matching test went red; one stayed green and got a new assertion. (12.3, 12.4)', 'Mỗi lớp bảo vệ đều bị gỡ một lần và test tương ứng đỏ; một lần vẫn xanh nên đã thêm khẳng định. (12.3, 12.4)'],
  ['What happens on deploy while users are booking?', 'Đang có người đặt mà triển khai thì sao?', 'Migrate runs once before replicas start; replicas stop with a grace period and Connection: close; nginx retries the other replica. (11.5)', 'Migrate chạy một lần trước khi các bản khởi động; mỗi bản tắt có thời gian ân hạn và Connection: close; nginx thử bản còn lại. (11.5)'],
  ['Why NestJS and not plain Express?', 'Sao dùng NestJS mà không dùng Express thuần?', 'Same Express underneath; Nest adds DI, a fixed place for each concern and testable modules. Name the cost too: decorators, magic, startup time. (0.8)', 'Bên dưới vẫn là Express; Nest thêm DI, chỗ cố định cho từng mối quan tâm và module dễ test. Nói cả cái giá: decorator, "phép màu", thời gian khởi động. (0.8)'],
  ['What would you do with two more weeks?', 'Có thêm hai tuần thì bạn làm gì?', 'Pick one with a reason: recurring bookings, a waiting list, or readiness without Redis. Not "more features".', 'Chọn một và nêu lý do: lịch lặp, danh sách chờ, hoặc readiness không phụ thuộc Redis. Không nói "thêm tính năng".'],
  ['Which part did you find hardest?', 'Phần nào bạn thấy khó nhất?', 'Tell one real bug: the grader that was wrong (12.1) or the "+07" trap (12.3) — what you saw, how you found it, what test prevents it now.', 'Kể một lỗi thật: bộ chấm sai (12.1) hoặc bẫy "+07" (12.3) — thấy gì, tìm ra thế nào, giờ test nào chặn nó.'],
];
const RUB = [
  ['Core rule under concurrency', 'Quy tắc lõi khi đồng thời', 20, 'cham L1–L7 15/15; 12.3 measurements', 'cham L1–L7 15/15; số đo bài 12.3'],
  ['Security', 'Bảo mật', 20, 'B1–B5; 404 vs 403; whitelist; login fails closed', 'B1–B5; 404 và 403; whitelist; đăng nhập "đóng" khi Redis hỏng'],
  ['Nest structure', 'Cấu trúc Nest', 15, 'module map (7 edges), events instead of imports, ADRs', 'sơ đồ module (7 cạnh), sự kiện thay import, ADR'],
  ['Tests in CI', 'Test trong CI', 15, '70 tests ↔ 10 stories; break → red', '70 test ↔ 10 câu chuyện; phá ⇒ đỏ'],
  ['Async + real time', 'Bất đồng bộ + thời gian thực', 10, 'T1–T3; 9.4 SIGKILL; job-count test', 'T1–T3; SIGKILL bài 9.4; test đếm job'],
  ['Operations', 'Vận hành', 10, 'compose + seed; CI anh green; Redis-down behaviour', 'compose + seed; job anh xanh; hành vi khi Redis chết'],
  ['Docs + defence', 'Tài liệu + bảo vệ', 10, 'README EN, openapi.json, demo ≤ 7 min, 15 answers', 'README tiếng Anh, openapi.json, demo ≤ 7 phút, 15 câu trả lời'],
];
const bangHoi = (vi) => `<ol>\n${HOI.map(([qen, qvi, aen, avi]) => `<li><strong>${vi ? qvi : qen}</strong> — ${vi ? avi : aen}</li>`).join('\n')}\n</ol>`;
const bangRub = (vi) => `<table>
<thead><tr><th>${vi ? 'Tiêu chí' : 'Criterion'}</th><th>${vi ? 'Điểm' : 'Points'}</th><th>${vi ? 'Bằng chứng mang theo' : 'Evidence you bring'}</th></tr></thead>
<tbody>
${RUB.map(([en, viT, d, een, evi]) => `<tr><td>${vi ? viT : en}</td><td>${d}</td><td>${vi ? evi : een}</td></tr>`).join('\n')}
</tbody>
</table>`;

export default {
  title: '12.6 — Defending your project: demo script and the panel\'s questions|||12.6 — Bảo vệ dự án: kịch bản demo và câu hỏi của hội đồng',
  slug: 'nst-12-6-bao-ve',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Demo 7 phút bằng một script 7 bước (chạy thật trong 9 giây) thay vì gõ tay; câu hỏi bất ngờ "Redis chết thì sao?" — đo được cả API trả 500 kể cả GET /rooms, sửa thành giới hạn chung "mở", đăng nhập "đóng" 503, kèm sự cố Instagram 2019; 15 câu hội đồng hay hỏi có gợi ý; bảng tự chấm theo rubric với bằng chứng.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 6</span>
<h2>12.6 — Seven minutes, fifteen questions, one surprise</h2>
<p class="lead">The defence is 7 minutes of demo plus questions, worth 10 points directly and much more indirectly: the panel decides how much of the other 90 they believe. Prepare it like code — a script, a test run, measured answers.</p>

<h3>Everyday analogy: the dress rehearsal</h3>
<p>A school performance is rehearsed on the real stage, in costume, with a stopwatch — not "we know the song". The surprise questions are the moment the microphone fails: performers who rehearsed with a failing microphone keep going.</p>

<h3>1. The demo is a script</h3>
<p>Typing commands live costs time and invites typos. Each step is one line and prints only what you will talk about:</p>
<pre><code class="language-bash">${esc(MA_DEMO)}</code></pre>
<pre><code class="language-text">${esc(OUT_DEMO)}</code></pre>
<p>Nine seconds of machine time; the other minutes are you explaining. A suggested 7 minutes: 0:00–1:00 the problem and the module map (12.2); 1:00–5:00 the seven steps — say <em>who</em> enforces each rule (step 3: "PostgreSQL, not an if"); 5:00–6:00 the green CI run with the grader's 15/15; 6:00–7:00 one honest limitation and what you would do next. Keep a screen recording of the same run in case the projector or network fails.</p>

<h3>2. The surprise question: "Redis is down — what happens?"</h3>
<p>Do not guess. Measured with the real app, stopping the Redis container mid-run:</p>
<pre><code class="language-text">${esc(OUT_RC_TRUOC)}</code></pre>
<p>Everything failed — even public <code>GET /rooms</code>, which never touches Redis in its own code. The global throttler guard runs on every request and its storage (11.6) lives in Redis; ioredis retried twice (~1.2 s) and then threw. A rate limiter had become a single point of failure. The decision (ADR-006): the general limit fails <em>open</em>, the login limit fails <em>closed</em>:</p>
<pre><code class="language-ts">${esc(MA_THR)}</code></pre>
<pre><code class="language-text">${esc(OUT_RC_SAU)}</code></pre>
<p>Reading and booking keep working, login says 503 with its own error code, and nothing waits 1.2 s anymore (<code>enableOfflineQueue: false</code>). Two unit tests with a fake Redis pin both behaviours.</p>
<h3>🕵️ Hacker corner — Instagram password reset (July 2019)</h3>
<p>Laxman Muthiyah found that Instagram's 6-digit recovery code was protected by a per-IP rate limit of roughly 200 attempts. Sending requests concurrently from 1,000 machines let him send 200,000 guesses in his tests — 20% of the one million possible codes; with enough machines, any account could be taken over. Facebook paid a $30,000 bounty. Rate limits on login and recovery are a security control, not a performance feature — which is why ours stops logins when its counter is unavailable instead of letting unlimited guesses through.</p>
<p><strong>Open question for your defence</strong>: <code>/health/ready</code> still reports Redis. Compose and HAProxy use it, so with Redis down an active health checker would take <em>every</em> API replica out of rotation — even though they can now serve. Should readiness include Redis? Prepare an answer with a reason (exercise 2).</p>

<h3>3. Fifteen questions panels ask</h3>
${bangHoi(false)}

<h3>4. Grade yourself first</h3>
${bangRub(false)}
<p>For each line, open the evidence on your laptop before the defence. If you cannot point to it in ten seconds, the panel will assume it does not exist.</p>

<h3>🧪 Exercise (60 min)</h3>
<ol>
<li>Run your demo script twice with a stopwatch; cut until it fits 7 minutes with your explanations.</li>
<li>Answer the open question: should <code>/health/ready</code> include Redis now that the API survives without it? Decide, change the code or write an ADR, and test it by stopping Redis.</li>
<li>Have a friend ask you five of the fifteen questions at random; record the answers and listen back.</li>
</ol>
<details><summary>Show one reasonable answer to the open question</summary>
<p>Readiness means "send me traffic". After ADR-006 the API serves without Redis (except login), so a Redis outage should <em>not</em> drain every replica — that turns a partial outage into a full one. Keep the database in <code>/health/ready</code> (nothing works without it), move Redis to a separate <code>/health/deps</code> that monitoring alerts on, and add a test that <code>/health/ready</code> stays 200 when the Redis check fails. The opposite choice is defensible only if most traffic is logins.</p>
</details>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>"What is a single point of failure in your system?"</strong> — Show the Redis measurement: one was found and removed; PostgreSQL remains, by design.</li>
<li><strong>"Fail open or fail closed?"</strong> — Depends on what the control protects: availability ⇒ open, security ⇒ closed. Give both examples from the project.</li>
<li><strong>"Walk me through a demo of your project in two minutes."</strong> — Steps 2, 3 and 6 of the script.</li>
</ol>

<h3>💼 On the job</h3>
<p>Every sprint review at an outsourcing company is a small defence in front of the client. The habits are the same: a scripted demo on a prepared environment, the acceptance results on screen, and short honest answers — "we measured it, here is the number" — instead of "it should be fine".</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Single point of failure</span><span class="v">A component whose failure stops the whole system.</span></div>
  <div class="kv"><span class="k">Fail open / fail closed</span><span class="v">When a control cannot decide: allow (availability) or deny (security).</span></div>
  <div class="kv"><span class="k">Degraded mode</span><span class="v">Running with reduced features instead of failing completely.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Demo = a 7-step script (9 s of machine time) plus your explanation; keep a recording.</li>
<li>Redis down made every request 500; now reads and bookings work, login is 503 by design.</li>
<li>Fifteen panel questions with evidence-based answers; self-grade before they do.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 6</span>
<h2>12.6 — Bảy phút, mười lăm câu hỏi, một câu bất ngờ</h2>
<p class="lead">Buổi bảo vệ là 7 phút demo cộng phần hỏi đáp, trực tiếp được 10 điểm và gián tiếp hơn thế nhiều: hội đồng quyết định tin bao nhiêu trong 90 điểm còn lại. Hãy chuẩn bị nó như viết mã — có script, có lần chạy thử, có câu trả lời kèm số đo.</p>

<h3>Liên hệ đời thường: buổi tổng duyệt</h3>
<p>Tiết mục văn nghệ của trường được tổng duyệt trên chính sân khấu, mặc đúng trang phục, có người bấm giờ — không phải "bọn em thuộc bài rồi". Câu hỏi bất ngờ là lúc micro tắt giữa chừng: nhóm nào từng tập với micro hỏng thì vẫn hát tiếp.</p>

<h3>1. Buổi demo là một script</h3>
<p>Gõ lệnh trực tiếp tốn thời gian và dễ gõ nhầm. Mỗi bước một dòng và chỉ in đúng thứ bạn sẽ nói tới:</p>
<pre><code class="language-bash">${esc(MA_DEMO)}</code></pre>
<pre><code class="language-text">${esc(OUT_DEMO)}</code></pre>
<p>Máy chạy hết chín giây; mấy phút còn lại là phần bạn giải thích. Gợi ý chia 7 phút: 0:00–1:00 bài toán và sơ đồ module (12.2); 1:00–5:00 bảy bước — nói rõ <em>ai</em> giữ từng luật (bước 3: "PostgreSQL, không phải một câu if"); 5:00–6:00 lượt CI xanh với 15/15 của bộ chấm; 6:00–7:00 một giới hạn thật lòng và việc bạn sẽ làm tiếp. Giữ sẵn bản quay màn hình của chính lượt chạy đó phòng khi máy chiếu hay mạng trục trặc.</p>

<h3>2. Câu hỏi bất ngờ: "Redis chết thì sao?"</h3>
<p>Đừng đoán. Đo bằng ứng dụng thật, dừng container Redis giữa chừng:</p>
<pre><code class="language-text">${esc(OUT_RC_TRUOC)}</code></pre>
<p>Mọi thứ đều hỏng — kể cả <code>GET /rooms</code> công khai, route mà mã của nó chẳng hề đụng tới Redis. Guard throttler toàn cục chạy trên mọi request và kho đếm của nó (bài 11.6) nằm trong Redis; ioredis thử lại hai lần (~1,2 giây) rồi ném lỗi. Một bộ giới hạn tốc độ đã thành điểm chết duy nhất của cả hệ thống. Quyết định (ADR-006): giới hạn chung thì <em>mở</em>, giới hạn đăng nhập thì <em>đóng</em>:</p>
<pre><code class="language-ts">${esc(MA_THR)}</code></pre>
<pre><code class="language-text">${esc(OUT_RC_SAU)}</code></pre>
<p>Xem và đặt lịch vẫn chạy, đăng nhập trả 503 với mã lỗi riêng, và không còn request nào phải chờ 1,2 giây (<code>enableOfflineQueue: false</code>). Hai test đơn vị dùng Redis giả ghim cả hai hành vi.</p>
<h3>🕵️ Góc hacker — khôi phục mật khẩu Instagram (tháng 7/2019)</h3>
<p>Laxman Muthiyah phát hiện mã khôi phục 6 chữ số của Instagram chỉ được bảo vệ bằng giới hạn khoảng 200 lần thử mỗi IP. Gửi request đồng thời từ 1.000 máy cho phép anh gửi 200.000 lượt đoán trong lúc kiểm tra — 20% của một triệu mã có thể có; đủ máy thì tài khoản nào cũng chiếm được. Facebook trả 30.000 đô tiền thưởng. Giới hạn tốc độ ở đăng nhập và khôi phục là một lớp bảo mật, không phải tính năng hiệu năng — vì vậy bộ đếm của ta chặn đăng nhập khi không đếm được, thay vì để người ta đoán thoải mái.</p>
<p><strong>Câu hỏi mở cho buổi bảo vệ của bạn</strong>: <code>/health/ready</code> vẫn báo trạng thái Redis. Compose và HAProxy dùng nó, nên khi Redis chết, bộ kiểm sức khoẻ chủ động sẽ rút <em>mọi</em> bản API khỏi vòng phục vụ — dù giờ chúng đã phục vụ được. Readiness có nên tính Redis không? Chuẩn bị một câu trả lời kèm lý do (bài thực hành 2).</p>

<h3>3. Mười lăm câu hội đồng hay hỏi</h3>
${bangHoi(true)}

<h3>4. Tự chấm trước khi hội đồng chấm</h3>
${bangRub(true)}
<p>Với mỗi dòng, mở sẵn bằng chứng trên máy trước buổi bảo vệ. Nếu không chỉ ra được trong mười giây, hội đồng sẽ coi như nó không tồn tại.</p>

<h3>🧪 Thực hành (60 phút)</h3>
<ol>
<li>Chạy script demo của bạn hai lần có bấm giờ; cắt bớt cho tới khi vừa 7 phút kể cả lời giải thích.</li>
<li>Trả lời câu hỏi mở: giờ API đã sống được khi không có Redis, <code>/health/ready</code> có nên tính Redis không? Quyết định, sửa mã hoặc viết ADR, và test bằng cách dừng Redis.</li>
<li>Nhờ một người bạn hỏi ngẫu nhiên năm trong mười lăm câu; ghi âm câu trả lời rồi nghe lại.</li>
</ol>
<details><summary>Xem một câu trả lời hợp lý cho câu hỏi mở</summary>
<p>Readiness nghĩa là "hãy gửi request cho tôi". Sau ADR-006, API phục vụ được khi không có Redis (trừ đăng nhập), nên Redis chết <em>không</em> nên rút hết mọi bản — làm vậy biến một sự cố một phần thành sự cố toàn phần. Giữ cơ sở dữ liệu trong <code>/health/ready</code> (thiếu nó thì không gì chạy), chuyển Redis sang một <code>/health/deps</code> riêng để hệ thống giám sát cảnh báo, và thêm test khẳng định <code>/health/ready</code> vẫn 200 khi phép kiểm Redis hỏng. Lựa chọn ngược lại chỉ bảo vệ được nếu phần lớn lưu lượng là đăng nhập.</p>
</details>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Hệ thống của bạn có điểm chết duy nhất nào?"</strong> — Chỉ vào số đo Redis: đã tìm ra một và gỡ nó; PostgreSQL vẫn là điểm chết, có chủ đích.</li>
<li><strong>"Fail open hay fail closed?"</strong> — Tuỳ lớp kiểm soát bảo vệ cái gì: tính sẵn sàng ⇒ mở, bảo mật ⇒ đóng. Nêu cả hai ví dụ trong dự án.</li>
<li><strong>"Demo dự án cho tôi trong hai phút."</strong> — Bước 2, 3 và 6 của script.</li>
</ol>

<h3>💼 Tình huống đi làm</h3>
<p>Mỗi buổi sprint review ở công ty outsourcing là một buổi bảo vệ nhỏ trước khách hàng. Thói quen y hệt: demo theo script trên môi trường chuẩn bị sẵn, kết quả nghiệm thu trên màn hình, và câu trả lời ngắn, thật — "bọn em đã đo, đây là con số" — thay vì "chắc là ổn".</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Điểm chết duy nhất</span><span class="v">Thành phần mà hỏng là cả hệ thống dừng.</span></div>
  <div class="kv"><span class="k">Fail open / fail closed</span><span class="v">Khi một lớp kiểm soát không quyết được: cho qua (ưu tiên sẵn sàng) hay chặn (ưu tiên bảo mật).</span></div>
  <div class="kv"><span class="k">Chế độ suy giảm</span><span class="v">Chạy với ít tính năng hơn thay vì hỏng hoàn toàn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Demo = một script 7 bước (máy chạy 9 giây) cộng lời giải thích của bạn; giữ sẵn bản quay.</li>
<li>Redis chết từng làm mọi request trả 500; giờ xem và đặt lịch vẫn chạy, đăng nhập 503 có chủ đích.</li>
<li>Mười lăm câu hội đồng hay hỏi, trả lời bằng bằng chứng; tự chấm trước khi hội đồng chấm.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
