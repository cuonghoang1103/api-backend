import { readFileSync } from 'node:fs';
import express, { Router } from 'express';
import compression from 'compression';
import { labsRouter } from './routes/labs.js';
import { devicesRouter } from './routes/devices.js';
import { bookingsRouter } from './routes/bookings.js';
import { deviceIssuesRouter, issuesRouter } from './routes/issues.js';
import { meRouter } from './routes/me.js';
import { waitlistRouter } from './routes/waitlist.js';
import { reportsRouter } from './routes/reports.js';
import { HttpError } from './http.js';
import { sendProblem } from './problems.js';
import { inVersion, fromHeader } from './versioning.js';
import { deprecate, adminRouter } from './deprecation.js';
import { APP_CONFIG, appVersionGuard } from './appVersion.js';
import { chaos, chaosRouter } from './chaos.js';
import { authRouter } from './routes/auth.js';
import { cors } from './cors.js';
import { serverTiming } from './timing.js';
import { dependency, chaosDbRouter } from './resilience.js';

export const app = express();
app.disable('x-powered-by');
app.use(serverTiming);                                          // bài 8.1: Server-Timing cho mọi request
// Bài 8.3 — chạy nhiều instance: mỗi câu trả lời nói nó đến từ instance nào (chỉ để HỌC, production không cần)
if (process.env.LABFLOW_INSTANCE) app.use((req, res, next) => { res.set('LabFlow-Instance', process.env.LABFLOW_INSTANCE); next(); });
app.use(compression({ threshold: 1024 }));                      // bài 8.2: gzip/br khi client gửi Accept-Encoding và body > 1 KB
// Bài 5.3 — đứng sau reverse proxy? Chỉ tin X-Forwarded-For đúng số chặng proxy CỦA MÌNH (mặc định: không tin)
const TP = process.env.LABFLOW_TRUST_PROXY ?? 'false';
app.set('trust proxy', /^\d+$/.test(TP) ? Number(TP) : TP === 'true');
// Thụt lề 2 dấu cách cho dễ đọc khi học; production gửi JSON liền một dòng (ít byte hơn)
app.set('json spaces', process.env.NODE_ENV === 'production' ? 0 : 2);
const JSON_TYPES = ['application/json', 'application/merge-patch+json'];
// Có body mà không phải JSON ⇒ 415 ngay ở cửa (req.is: null = không có body, false = có body nhưng sai kiểu)
// Bài 7.2 — fetch() gửi "Content-Length: 0" cho POST không body; đó KHÔNG phải body sai kiểu (bộ kiểm hợp đồng bắt được)
const hasBody = (req) => req.get('transfer-encoding') !== undefined || Number(req.get('content-length') ?? 0) > 0;
app.use((req, res, next) => {
  if (hasBody(req) && req.is(JSON_TYPES) === false)
    throw new HttpError(415, 'UNSUPPORTED_MEDIA_TYPE', { got: req.get('content-type') });
  next();
});
app.use(express.json({ type: JSON_TYPES, limit: '10kb' }));   // body lớn nhất hợp lệ của LabFlow < 1 KB
// Bài 6.4 — để HỌC: in mỗi request tới được server (để thấy CORS KHÔNG chặn request ở server)
if (process.env.LABFLOW_LOG) app.use((req, res, next) => { console.log(`${req.method} ${req.originalUrl} origin=${req.get('Origin') ?? '-'}`); next(); });
app.use(cors);                                                  // bài 6.4: trình duyệt nào được gọi API
app.use(chaos);                                                 // Chương 5: giả lập mạng hỏng (chỉ khi đặt biến môi trường)

app.get('/health', (req, res) => res.json({ status: 'ok' }));          // sống (liveness): tiến trình còn trả lời
// Bài 8.4 — sẵn sàng (readiness): phụ thuộc còn dùng được không? Load balancer dựa vào đây để bớt gửi request tới instance này
app.get('/ready', (req, res) => (dependency.down
  ? res.status(503).set('Retry-After', '30').json({ status: 'degraded', database: 'down', since: dependency.since })
  : res.json({ status: 'ready', database: 'up' })));
if (process.env.LABFLOW_CHAOS) app.use('/chaos', chaosDbRouter);   // CHỈ để học: POST /chaos/db
// Bài 7.3 — tài liệu là một phần của API: công bố hợp đồng ở một URL cố định
const SPEC = readFileSync(new URL('../openapi/openapi.yaml', import.meta.url));
app.get('/openapi.yaml', (req, res) => res.type('application/yaml').set('Cache-Control', 'public, max-age=300').send(SPEC));
app.get('/docs', (req, res) => res.sendFile(new URL('../docs/index.html', import.meta.url).pathname));
if (process.env.LABFLOW_OUTAGE_MS) app.use('/chaos', chaosRouter);   // chỉ tồn tại khi đang giả lập sự cố
// Bài 5.3 — để HỌC: server thấy người gọi là ai (production không có đường này)
if (process.env.LABFLOW_DEBUG_IP) app.get('/debug/ip', (req, res) => res.json({ ip: req.ip, xff: req.get('X-Forwarded-For') ?? null }));
// Bài 4.4 — cấu hình cho app: đặt TRƯỚC chốt phiên bản (app quá cũ vẫn phải đọc được nó để biết mình cần cập nhật)
app.get('/app-config', (req, res) => res.set('Cache-Control', 'public, max-age=300').json(APP_CONFIG));
app.use(appVersionGuard);

// Chương 4 — MỘT bộ route dùng chung cho mọi phiên bản; khác nhau ở view và lược đồ (chọn theo req.apiVersion)
const api = Router();
// Chương 9 — các route dùng PostgreSQL (+ replica, Redis) chỉ bật khi có LABFLOW_PG=1; thiếu thì LabFlow vẫn chạy như cũ
const pgRoutes = process.env.LABFLOW_PG ? { ...(await import('./routes/notes.js')), ...(await import('./routes/stats.js')) } : null;
if (pgRoutes) api.use('/labs/:labId/notes', pgRoutes.labNotesRouter);   // bài 9.3 — đặt TRƯỚC /labs
api.use('/labs', labsRouter);
api.use('/devices/:id/issues', deviceIssuesRouter);   // đặt TRƯỚC /devices
api.use('/devices', devicesRouter);
api.use('/issues', issuesRouter);
api.use('/bookings', bookingsRouter);
api.use('/me', meRouter);
api.use('/waitlist', waitlistRouter);                         // Lab 7
api.use('/reports', reportsRouter);                            // Lab 8
if (pgRoutes) api.use('/stats', pgRoutes.statsRouter);          // bài 9.2
if (pgRoutes) api.use('/notes', pgRoutes.notesRouter);          // bài 9.3
api.use('/admin', adminRouter);
api.use('/auth', authRouter);                                  // bài 6.1: /v1/auth/login, /v2/auth/login

// Lab 4 — /v1/devices khai tử (serialNo ⇒ serialNumber ở v2); phần còn lại của v1 vẫn bình thường
app.use('/v1/devices', deprecate({
  since: '2026-11-15T00:00:00Z',
  sunset: '2027-06-01T00:00:00Z',
  docs: 'https://labflow.example/docs/devices-v2',
  successor: (req) => req.originalUrl.replace(/^\/v1/, '/v2'),
}));
app.use('/v1', inVersion(1), api);
app.use('/v2', inVersion(2), api);
// Đường cũ không số phiên bản (client Chương 1–3 vẫn đang gọi): giữ nguyên = v1 (hoặc theo header LabFlow-Version),
// nhưng từ bài 4.3 đã KHAI TỬ: báo trước bằng Deprecation + Sunset, hết hạn ⇒ 410
const LEGACY = ['/labs', '/devices', '/issues', '/bookings', '/me'];
const legacy = Router();
legacy.use(deprecate({
  since: '2026-11-01T00:00:00Z',
  sunset: '2027-05-01T00:00:00Z',                          // hết học kỳ sau: đủ một vòng phát hành app
  docs: 'https://labflow.example/docs/migrate-to-v1',
  successor: (req) => `/v1${req.originalUrl}`,
}), fromHeader, api);
const isLegacy = (req) => LEGACY.some((p) => req.path === p || req.path.startsWith(`${p}/`));
app.use((req, res, next) => (isLegacy(req) ? legacy(req, res, next) : next()));

app.use((req, res) => {
  sendProblem(req, res, { status: 404, code: 'ROUTE_NOT_FOUND', params: { method: req.method, path: req.path } });
});

// Một chỗ duy nhất biến MỌI lỗi thành application/problem+json
app.use((err, req, res, next) => {
  if (err instanceof HttpError) {
    const more = Array.isArray(err.more)
      ? { errors: err.more }   // lỗi từng trường: { pointer | parameter, detail }
      : err.more;                                                                          // thành viên mở rộng khác
    return sendProblem(req, res, { status: err.status, code: err.code, params: err.params, ...more });
  }
  if (err.type === 'entity.parse.failed') {   // express.json không đọc được body
    return sendProblem(req, res, { status: 400, code: 'MALFORMED_JSON' });
  }
  if (err.type === 'entity.too.large') {      // body vượt giới hạn của express.json
    return sendProblem(req, res, { status: 413, code: 'PAYLOAD_TOO_LARGE', params: { limit: err.limit, length: err.length } });
  }
  console.error(err);                         // chi tiết thật chỉ nằm trong log của server
  sendProblem(req, res, { status: 500, code: 'INTERNAL' });
});
