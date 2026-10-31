/** API Design · Lab 5 — Báo hỏng tin cậy: thứ tự middleware, thiết kế header/ETag (output thật Lab 5). */
import { doiDau, KHOA, cs, ord, bang1, tn } from './_api.mjs';

const E1 = cs({
  ten: 'Lab 5 · 1 — The middleware order', kho: 'EASY', phut: 6, loai: 'order',
  en: 'Order the middleware on POST /v2/devices/:id/issues as in the reference solution.',
  vi: 'Sắp các middleware trên POST /v2/devices/:id/issues như lời giải tham khảo.',
  cau: [ord('o1', ['From first to last', 'Từ đầu tới cuối'], [
    'requireAuth — who is calling (keys and limits are per user)',
    'idempotent() — a replay is answered here, before any cost',
    'reportLimit — 3 reports per minute per user',
    'loadDevice — 404 if the device does not exist',
    'validate(body, IssueCreate) — 400 for a bad body',
    'the handler — create the issue',
  ], ['Identity first; replays before the limiter so they are free; then the Lab 1 order 404 → 400; work last.', 'Danh tính trước; phát lại trước bộ giới hạn để miễn phí; rồi thứ tự 404 → 400 của Lab 1; việc thật cuối cùng.'])],
  goiY: [['Keys and buckets need req.user.', 'Khoá và xô cần req.user.'], ['What must a replay never cost?', 'Lần phát lại không bao giờ được tốn gì?']],
  loi: [['Limiter before idempotency — retries of one tap use up the quota.', 'Đặt giới hạn trước idempotency — các lần thử lại của một lần bấm tiêu hết hạn mức.'], ['Validation before the device lookup — breaks the 404 → 400 order.', 'Kiểm dữ liệu trước khi tìm thiết bị — phá thứ tự 404 → 400.']],
  tns: [tn('middleware order', 'thứ tự middleware'), tn('replay', 'phát lại')],
  kn: ['reliability'],
});

const A = ['201 with Idempotent-Replayed', '201, RateLimit r=0', '429 + Retry-After', '200, ETag "iss_1-v2"', '412 PRECONDITION_FAILED', '304 Not Modified'];
const E2 = cs({
  ten: 'Lab 5 · 2 — Part A: predict the answers', kho: 'MEDIUM', phut: 8, loai: 'table',
  en: 'Predict each answer of the Lab 5 transcript (one fresh report already sent by An).',
  vi: 'Dự đoán từng câu trả lời trong transcript của Lab 5 (An đã gửi một báo hỏng mới).',
  bang: [bang1('b1', ['Request → answer', 'Request → câu trả lời'], [{ ma: 'x', ten: 'Request' }, { ma: 'a', ten: 'Answer', luaChon: A }], [
    { o: { x: 'report.mjs retry after the lost response' }, a: { a: '201 with Idempotent-Replayed' } },
    { o: { x: 'An’s 3rd report in the minute' }, a: { a: '201, RateLimit r=0' } },
    { o: { x: 'An’s 4th report in the minute' }, a: { a: '429 + Retry-After' } },
    { o: { x: 'resolve iss_1 with If-Match "iss_1-v1"' }, a: { a: '200, ETag "iss_1-v2"' } },
    { o: { x: 'resolve iss_1 again with If-Match "iss_1-v1"' }, a: { a: '412 PRECONDITION_FAILED' } },
    { o: { x: 'GET iss_1 with If-None-Match "iss_1-v2"' }, a: { a: '304 Not Modified' } },
  ], ['Real run: the lost report used one of three tokens (the replay was free), so the 2nd and 3rd reports were 201 r=1 and r=0, the 4th 429 with Retry-After 20; resolving bumps v1 → v2.', 'Lần chạy thật: báo hỏng bị mất dùng một trong ba token (lần phát lại miễn phí), nên báo hỏng thứ 2 và 3 là 201 r=1 và r=0, thứ 4 là 429 kèm Retry-After 20; xử lý làm v1 → v2.'])],
  goiY: [['Count tokens: the first report already used one.', 'Đếm token: báo hỏng đầu đã dùng một.'], ['Resolving changes the version.', 'Xử lý làm đổi version.']],
  loi: [['Counting the replay as a token.', 'Tính lần phát lại là một token.'], ['Expecting 409 ALREADY_RESOLVED instead of 412 — If-Match is checked first.', 'Chờ 409 ALREADY_RESOLVED thay vì 412 — If-Match được kiểm trước.']],
  tns: [tn('rubric', 'thang chấm'), tn('transcript', 'bản ghi lần chạy thật')],
  kn: ['reliability'],
});

export default doiDau({ slug: 'api-5-5-lab', ten: 'Lab 5 — Reporting that survives the basement', khoa: KHOA, baiHoc: 'api-5-5-lab', de: [E1, E2] });
