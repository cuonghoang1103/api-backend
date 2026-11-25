/**
 * 5.3 — Validate dữ liệu và hình dạng lỗi nhất quán (soạn 24/11/2026, agent fsp).
 * Output THẬT trên máy nhà (Express 5.3.0, body-parser của express.json, Zod 4.6.7 + locale vi, pg-pool qua @prisma/adapter-pg 7.10.1),
 * repo chiase commit 75025e4 + 20f7233 (nhánh ch5/binh-luan).
 * Phát hiện thật 24/11: soát 11 request "xấu" ⇒ 5 lỗi CỦA CLIENT thành 500 (body 200 KB, charset latin1, Content-Encoding lạ, gzip hỏng,
 * URL %-mã hỏng) vì errorHandler chỉ biết HttpError + entity.parse.failed; sau sửa: 413/415/400, một dòng cảnh báo, không stack.
 * 4 nơi tự viết JSON lỗi (validate, validate-id, require-auth, not-found) + rate-limit ⇒ gom về errorHandler (ném HttpError).
 * CSDL docker pause ⇒ request treo 65 s (kết nối đã mở trong pool, connectionTimeoutMillis không áp) ⇒ query_timeout 5 s ⇒ 500 sau 5,03 s
 * có requestId, grep log ra đúng dòng. Thêm requestId làm vỡ phép so "hai body lỗi giống hệt" (chống dò email) của checkpoint-3.
 * Nguồn (GET 200, 24/11/2026): RFC 9457; body-parser README (entity.too.large 413…); node-postgres Client (query_timeout);
 * Zod docs error-customization (locales); Wikipedia Twitter (05/08/2022, 5,4 triệu tài khoản).
 */
import { lienKet, spring, nguon } from '../_chung.mjs';

const SOAT_CA = `const ca = [
  ['JSON hỏng', 'POST', '/posts', { headers: J, body: '{"title":' }],
  ['body 200 KB', 'POST', '/posts', { headers: J, body: JSON.stringify({ title: 'x', body: 'a'.repeat(200_000) }) }],
  ['charset lạ', 'POST', '/posts', { headers: { ...J, 'content-type': 'application/json; charset=latin1' }, body: '{}' }],
  ['Content-Encoding lạ', 'POST', '/posts', { headers: { ...J, 'content-encoding': 'xyz' }, body: '{}' }],
  ['gzip hỏng', 'POST', '/posts', { headers: { ...J, 'content-encoding': 'gzip' }, body: gzipSync('{"a":1}').subarray(0, 10) }],
  ['URL %-mã hỏng', 'GET', '/posts/%E0%A4%A', {}],
  ['thiếu 2 trường', 'POST', '/posts', { headers: J, body: '{}' }],
  ['không token', 'POST', '/posts', { headers: { 'content-type': 'application/json' }, body: '{}' }],
  ['route không có', 'GET', '/khong-co', {}],
  ['sai method', 'PUT', '/posts/01a20dd1-1650-7a62-a783-dc48da6b7ba4', { headers: J, body: '{}' }],
  ['cursor hỏng', 'GET', '/posts?cursor=abc', {}],
];`;

const OUT_TRUOC = `$ node soat-loi.mjs        # gửi 11 request "xấu", in mã · content-type · hình dạng · code
JSON hỏng            POST → 400 application/json ✔ đúng hình dạng JSON_HONG
body 200 KB          POST → 500 application/json ✔ đúng hình dạng LOI_MAY_CHU
charset lạ           POST → 500 application/json ✔ đúng hình dạng LOI_MAY_CHU
Content-Encoding lạ  POST → 500 application/json ✔ đúng hình dạng LOI_MAY_CHU
gzip hỏng            POST → 500 application/json ✔ đúng hình dạng LOI_MAY_CHU
URL %-mã hỏng        GET  → 500 application/json ✔ đúng hình dạng LOI_MAY_CHU
thiếu 2 trường       POST → 400 application/json ✔ đúng hình dạng DU_LIEU_SAI
không token          POST → 401 application/json ✔ đúng hình dạng CHUA_DANG_NHAP
route không có       GET  → 404 application/json ✔ đúng hình dạng KHONG_CO_ROUTE
sai method           PUT  → 404 application/json ✔ đúng hình dạng KHONG_CO_ROUTE
cursor hỏng          GET  → 400 application/json ✔ đúng hình dạng CURSOR_SAI
$ grep -A3 PayloadTooLarge /tmp/fsp-api.log
[POST /api/posts] PayloadTooLargeError: request entity too large
    at readStream (/home/…/chiase/node_modules/raw-body/index.js:163:17)
    at getRawBody (/home/…/chiase/node_modules/raw-body/index.js:116:12)
    at read (/home/…/chiase/node_modules/body-parser/lib/read.js:134:3)`;

const ERROR_SCHEMA = `import { z } from 'zod';

// HỢP ĐỒNG LỖI của toàn bộ API — MỌI phản hồi 4xx/5xx đều đúng hình dạng này (bài 5.3).
// Dùng chung: errorHandler tạo ra nó; checkpoint-5 + frontend (Chương 6) kiểm/đọc nó bằng CHÍNH schema này.
export const loiSchema = z.strictObject({
  error: z.strictObject({
    code: z.string().regex(/^[A-Z_]+$/), // mã ỔN ĐỊNH cho máy đọc — frontend rẽ nhánh theo code, không theo message
    message: z.string().min(1), // câu cho người đọc — được phép đổi chữ bất cứ lúc nào
    details: z.array(z.strictObject({ field: z.string(), code: z.string(), message: z.string() })).optional(),
    requestId: z.uuid(), // khớp với dòng log máy chủ — người dùng báo lỗi kèm mã này
  }),
});
export type PhanHoiLoi = z.infer&lt;typeof loiSchema&gt;;`;

const HTTP_ERROR = `// Lỗi "có chủ đích": ai cũng NÉM HttpError (service, middleware, validate…), CHỈ errorHandler viết JSON lỗi ra client.
// Mọi lỗi KHÁC (bug, mất CSDL…) ⇒ 500 và KHÔNG lộ chi tiết cho client.
export type ChiTietLoi = { field: string; code: string; message: string };

export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: ChiTietLoi[], // lỗi từng trường (400 DU_LIEU_SAI) — frontend tô đỏ đúng ô nhập
    readonly headers?: Record&lt;string, string&gt;, // vd WWW-Authenticate cho 401
  ) {
    super(message);
    this.name = 'HttpError';
  }
}`;

const VALIDATE = `import type { NextFunction, Request, Response } from 'express';
import type { z } from 'zod';
import { HttpError, type ChiTietLoi } from '../lib/http-error.js';

// Đổi lỗi Zod thành danh sách lỗi TỪNG TRƯỜNG (không chỉ lỗi đầu tiên): người dùng sửa một lần, không phải gửi đi gửi lại.
// Khoá lạ (z.strictObject) ⇒ mỗi khoá một dòng, field = tên khoá đó.
export function chiTietTuZod(loi: z.ZodError): ChiTietLoi[] {
  return loi.issues.flatMap((i) =&gt;
    i.code === 'unrecognized_keys'
      ? i.keys.map((k) =&gt; ({
          field: [...i.path, k].join('.'),
          code: 'unrecognized_key',
          message: 'trường không được phép gửi',
        }))
      : [{ field: i.path.join('.') || '(toàn bộ)', code: i.code, message: i.message }],
  );
}

const duLieuSai = (loi: z.ZodError) =&gt;
  new HttpError(400, 'DU_LIEU_SAI', 'Dữ liệu gửi lên không hợp lệ', chiTietTuZod(loi));

// Body: hợp lệ ⇒ THAY req.body bằng dữ liệu đã chuẩn hoá (đã trim, NFC, có mặc định…). Sai ⇒ NÉM, errorHandler viết JSON.
export const validateBody = (schema: z.ZodType) =&gt; (req: Request, _res: Response, next: NextFunction) =&gt; {
  const kq = schema.safeParse(req.body ?? {});
  if (!kq.success) throw duLieuSai(kq.error);
  req.body = kq.data;
  next();
};

// Query string: Express 5 KHÔNG cho gán lại req.query (getter) — "req.query = …" ném TypeError ⇒ 500 (bài 5.2).
// Dữ liệu đã kiểm + đã ép kiểu để ở res.locals.query; controller đọc từ đó, không đọc req.query thô.
export const validateQuery = (schema: z.ZodType) =&gt; (req: Request, res: Response, next: NextFunction) =&gt; {
  const kq = schema.safeParse(req.query);
  if (!kq.success) throw duLieuSai(kq.error);
  res.locals.query = kq.data;
  next();
};`;

const RA_DIFF = ` import type { NextFunction, Request, Response } from 'express';
 import { kiemAccessToken } from '../lib/tokens.js';
+import { HttpError } from '../lib/http-error.js';
 
 // 401 = "tôi không biết bạn là ai" (thiếu/sai/hết hạn token). 403 = "biết bạn là ai, nhưng bạn không được làm việc này".
-export async function requireAuth(req: Request, res: Response, next: NextFunction) {
+export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
   const [kieu, token] = (req.get('authorization') ?? '').split(' ');
-  if (kieu !== 'Bearer' || !token) {
-    res
-      .set('WWW-Authenticate', 'Bearer')
-      .status(401)
-      .json({ error: { code: 'CHUA_DANG_NHAP', message: 'Cần đăng nhập' } });
-    return;
-  }
+  if (kieu !== 'Bearer' || !token)
+    throw new HttpError(401, 'CHUA_DANG_NHAP', 'Cần đăng nhập', undefined, { 'WWW-Authenticate': 'Bearer' });
   const kq = await kiemAccessToken(token);
   if (!kq.ok) {
     // Mã riêng cho HẾT HẠN: frontend (Chương 6) thấy mã này mới gọi /auth/refresh rồi thử lại
     const code = kq.lyDo === 'HET_HAN' ? 'TOKEN_HET_HAN' : 'TOKEN_KHONG_HOP_LE';
-    res
-      .set('WWW-Authenticate', \`Bearer error="invalid_token"\`)
-      .status(401)
-      .json({ error: { code, message: 'Token không dùng được' } });
-    return;
+    throw new HttpError(401, code, 'Token không dùng được', undefined, {
+      'WWW-Authenticate': 'Bearer error="invalid_token"',
+    });
   }
   req.user = { id: kq.userId };
   next();`;

const REQUEST_ID = `import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

// Mỗi request một mã: nằm trong header X-Request-Id, trong dòng log và trong JSON lỗi.
// Người dùng chụp màn hình lỗi có mã ⇒ grep log ra đúng dòng, không phải đoán "lúc khoảng 3 giờ chiều".
export function ganRequestId(req: Request, res: Response, next: NextFunction) {
  req.id = randomUUID();
  res.set('X-Request-Id', req.id);
  next();
}`;

const ERROR_HANDLER = `import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../lib/http-error.js';
import type { PhanHoiLoi } from '../schemas/error.schema.js';

// Lỗi do CLIENT gửi sai mà thư viện (body-parser của express.json, router) ném ra — chúng mang sẵn status 4xx + type.
// Không ánh xạ ⇒ rơi xuống 500: client nhận "lỗi máy chủ" sai sự thật, còn bạn bị báo động vì lỗi không phải của mình (bài 5.3).
const LOI_THU_VIEN: Record&lt;string, [code: string, message: string]&gt; = {
  'entity.parse.failed': ['JSON_HONG', 'Body không phải JSON hợp lệ'],
  'entity.too.large': ['QUA_LON', 'Body quá lớn (tối đa 100 KB)'],
  'charset.unsupported': ['KHONG_HO_TRO', 'Chỉ nhận JSON mã hoá UTF-8'],
  'encoding.unsupported': ['KHONG_HO_TRO', 'Content-Encoding không được hỗ trợ'],
};

function laLoiClientCuaThuVien(err: unknown): err is { status: number; type?: string } {
  if (typeof err !== 'object' || err === null || !('status' in err)) return false;
  return typeof err.status === 'number' &amp;&amp; err.status &gt;= 400 &amp;&amp; err.status &lt; 500;
}

// Middleware lỗi của Express nhận ĐÚNG 4 tham số — thiếu \`next\` thì Express coi nó là middleware thường.
// Đây là NƠI DUY NHẤT viết JSON lỗi ra client ⇒ mọi lỗi cùng một hình dạng (schemas/error.schema.ts).
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  const gui = (status: number, code: string, message: string, details?: HttpError['details']) =&gt; {
    const than: PhanHoiLoi = { error: { code, message, ...(details &amp;&amp; { details }), requestId: req.id } };
    res.status(status).json(than);
  };
  if (err instanceof HttpError) {
    if (err.headers) res.set(err.headers);
    return gui(err.status, err.code, err.message, err.details);
  }
  if (laLoiClientCuaThuVien(err)) {
    const [code, message] = LOI_THU_VIEN[err.type ?? ''] ?? ['YEU_CAU_SAI', 'Yêu cầu không hợp lệ'];
    console.warn(\`[\${req.id}] \${req.method} \${req.originalUrl} → \${err.status} \${code}\`); // một dòng, không cần stack
    return gui(err.status, code, message);
  }
  // Lỗi THẬT của mình: ghi đủ stack (kèm requestId để tìm), client chỉ nhận mã chung + requestId.
  console.error(\`[\${req.id}] \${req.method} \${req.originalUrl}\`, err);
  gui(500, 'LOI_MAY_CHU', 'Có lỗi phía máy chủ');
}`;

const OUT_SAU = `$ node soat-loi.mjs
JSON hỏng            POST → 400 application/json ✔ đúng hình dạng JSON_HONG
body 200 KB          POST → 413 application/json ✔ đúng hình dạng QUA_LON
charset lạ           POST → 415 application/json ✔ đúng hình dạng KHONG_HO_TRO
Content-Encoding lạ  POST → 415 application/json ✔ đúng hình dạng KHONG_HO_TRO
gzip hỏng            POST → 400 application/json ✔ đúng hình dạng YEU_CAU_SAI
URL %-mã hỏng        GET  → 400 application/json ✔ đúng hình dạng YEU_CAU_SAI
thiếu 2 trường       POST → 400 application/json ✔ đúng hình dạng DU_LIEU_SAI
không token          POST → 401 application/json ✔ đúng hình dạng CHUA_DANG_NHAP
route không có       GET  → 404 application/json ✔ đúng hình dạng KHONG_CO_ROUTE
sai method           PUT  → 404 application/json ✔ đúng hình dạng KHONG_CO_ROUTE
cursor hỏng          GET  → 400 application/json ✔ đúng hình dạng CURSOR_SAI
$ grep "→ 4" /tmp/fsp-api.log | head -3      # lỗi của client: một dòng cảnh báo, không stack
[d8fc1f88-30c4-4aaa-9962-1dfc97bb1800] POST /api/posts → 400 JSON_HONG
[25abbd36-128d-421b-a9e5-a6c0cba13b81] POST /api/posts → 413 QUA_LON
[9ee54829-b8b2-418e-95a5-a50a60f29d08] POST /api/posts → 415 KHONG_HO_TRO`;

const OUT_NHIEU_TRUONG = `$ curl -s $A/posts -H "authorization: Bearer $AN" -H "$J" -d "{\\"title\\":\\"   \\",\\"status\\":\\"public\\",\\"authorId\\":\\"x\\",\\"likes\\":99}" | jq
{
  "error": {
    "code": "DU_LIEU_SAI",
    "message": "Dữ liệu gửi lên không hợp lệ",
    "details": [
      {
        "field": "title",
        "code": "too_small",
        "message": "không được để trống"
      },
      {
        "field": "body",
        "code": "invalid_type",
        "message": "Đầu vào không hợp lệ: mong đợi string, nhận được undefined"
      },
      {
        "field": "status",
        "code": "invalid_value",
        "message": "Tùy chọn không hợp lệ: mong đợi một trong các giá trị \\"draft\\"|\\"published\\""
      },
      {
        "field": "authorId",
        "code": "unrecognized_key",
        "message": "trường không được phép gửi"
      },
      {
        "field": "likes",
        "code": "unrecognized_key",
        "message": "trường không được phép gửi"
      }
    ],
    "requestId": "b8866f3c-33b8-42b7-bf3a-528881c0c0df"
  }
}`;

const OUT_429 = `$ curl -si $A/auth/login -H "$J" -d "{\\"email\\":\\"an@chiase.dev\\",\\"password\\":\\"sai-mat-khau-dai-15\\"}" | grep -iE "^HTTP|^ratelimit|^retry-after|^x-request-id|^\\{"
HTTP/1.1 429 Too Many Requests
X-Request-Id: 2e8fbc33-339e-42f6-928b-79d53cd5000e
RateLimit: "3-in-15min"; r=0; t=893
RateLimit-Policy: "3-in-15min"; q=3; w=900; pk=:YmIwY2Q1MTM2YWU1:
Retry-After: 893
{"error":{"code":"QUA_NHIEU_LAN","message":"Thử quá nhiều lần, hãy đợi 15 phút","requestId":"2e8fbc33-339e-42f6-928b-79d53cd5000e"}}`;

const OUT_TREO = `$ docker pause fsp-pg      # giả lập CSDL treo (máy chủ CSDL quá tải, mạng đứt nửa chừng…)
$ curl -s "$A/posts?limit=1" -w "  → %{http_code} sau %{time_total}s\\n"
                                  … (không có gì, 65 giây — tới khi chạy docker unpause fsp-pg ở cửa sổ khác) …
{"items":[{"id":"01a20dd5-…","title":"Bài vừa đăng", …}],"nextCursor":"eyJ0Ijoi…"}  → 200 sau 65.122345s
$ tail -1 /tmp/fsp-api.log
2026-11-24T14:00:30.061Z 5b3a378c-732d-4c1b-adb5-ac51ae95bb11 GET /api/posts?limit=1 200 65125.6ms`;

const POOL = `const adapter = new PrismaPg({
  connectionString: config.databaseUrl,
  max: 10, // tối đa 10 kết nối trong pool
  connectionTimeoutMillis: 3_000, // mặc định của pg là 0 = chờ MÃI nếu CSDL treo
  // Hạn chót cho MỖI truy vấn, đo phía Node. connectionTimeoutMillis chỉ áp khi MỞ kết nối mới — kết nối đã mở sẵn trong
  // pool mà CSDL treo thì request chờ vô hạn (đo thật bài 5.3: 65 s, tới khi CSDL sống lại). statement_timeout phía
  // Postgres không cứu được trường hợp này: máy chủ CSDL treo thì nó cũng chẳng đếm giờ được.
  query_timeout: 5_000,
});`;

const OUT_500 = `$ docker pause fsp-pg      # CSDL treo lần nữa — lần này API có query_timeout 5 s
$ curl -s -m 20 "$A/posts?limit=1" -w "  → %{http_code} sau %{time_total}s\\n"
{"error":{"code":"LOI_MAY_CHU","message":"Có lỗi phía máy chủ","requestId":"178a2284-6c4d-4d52-83fb-7f53f68fc178"}}  → 500 sau 5.035273s
$ grep 178a2284-6c4d-4d52-83fb-7f53f68fc178 /tmp/fsp-api.log
[178a2284-6c4d-4d52-83fb-7f53f68fc178] GET /api/posts?limit=1 Error: Query read timeout
    at /home/…/chiase/node_modules/pg-pool/index.js:45:11
    at process.processTicksAndRejections (node:internal/process/task_queues:103:5)
    at async PrismaPgAdapter.performIO (file:///home/…/chiase/node_modules/@prisma/adapter-pg/dist/index.mjs:645:22)
--
2026-11-24T14:00:58.714Z 178a2284-6c4d-4d52-83fb-7f53f68fc178 GET /api/posts?limit=1 500 5034.4ms
$ docker unpause fsp-pg; curl -s "$A/posts?limit=1" -o /dev/null -w "%{http_code} %{time_total}s
"
200 0.033051s`;

const OUT_CP3_VO = `$ node scripts/checkpoint-3.mjs        # sau khi thêm requestId vào mọi lỗi
  …
  ✔ đăng ký dữ liệu sai → 400 DU_LIEU_SAI
  ✘ sai mật khẩu → 401; email không có → 401; hai body giống hệt
  …
KẾT QUẢ: 22 đạt, 1 trượt`;

const CP3_DIFF = `+// Từ bài 5.3 mỗi lỗi có requestId RIÊNG (khác nhau ở mọi request, không lộ gì về email) ⇒ so mọi thứ TRỪ requestId.
+const boMa = (r) =&gt; JSON.stringify({ ...js(r).error, requestId: undefined });
-  \`sai mật khẩu → \${saiMk.ma}; email không có → \${khongCo.ma}; hai body giống hệt\`,
-  saiMk.ma === 401 &amp;&amp; saiMk.text === khongCo.text,
+  \`sai mật khẩu → \${saiMk.ma}; email không có → \${khongCo.ma}; hai body giống hệt (trừ requestId)\`,
+  saiMk.ma === 401 &amp;&amp; boMa(saiMk) === boMa(khongCo),`;

const THE = [
  lienKet({ khoa: 'api-design', bai: 'api-2-1-problem-details', title: 'API Design 2.1 — Problem Details (RFC 9457)', sub: 'Định dạng lỗi chuẩn của IETF — so với hình dạng gọn của ChiaSe.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'api-design', bai: 'api-2-2-validation', title: 'API Design 2.2 — Kiểm dữ liệu vào ngay cửa', sub: 'Schema, object strict, 415 và 422.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-5-4-xu-ly-loi', title: 'Node.js 5.4 — Xử lý lỗi tập trung', sub: 'Middleware lỗi của Express, bài khái niệm gốc.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-15-2-request-id', title: 'Node.js 15.2 — Một mã số xuyên qua mọi tầng', sub: 'Request id, AsyncLocalStorage, log có ngữ cảnh.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'prisma-orm', bai: 'pr-7-4-timeout', title: 'Prisma ORM 7.4 — Timeout, thử lại và tính idempotent', sub: 'Mọi loại timeout của Prisma + pg, chuyên sâu.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'RFC 9457 — Problem Details for HTTP APIs (2023)', 'Chuẩn IETF cho thân lỗi: type, title, status, detail, instance.', 'https://www.rfc-editor.org/rfc/rfc9457'),
  nguon('📘', 'body-parser — Errors', 'Danh sách lỗi có status + type: entity.parse.failed, entity.too.large (413), charset.unsupported, encoding.unsupported (415)…', 'https://github.com/expressjs/body-parser'),
  nguon('📘', 'node-postgres — Client config', 'statement_timeout, query_timeout, lock_timeout — mặc định đều là "không giới hạn".', 'https://node-postgres.com/apis/client'),
  nguon('📘', 'Zod — Customizing errors / Internationalization', 'z.config(z.locales.vi()) và thứ tự ưu tiên câu báo lỗi.', 'https://zod.dev/error-customization'),
  nguon('📘', 'Wikipedia — Twitter (mục an ninh, 05/08/2022)', 'Lỗi từ bản cập nhật 06/2021 cho phép gắn email/số điện thoại với tài khoản ⇒ 5,4 triệu hồ sơ bị gom và rao bán.', 'https://en.wikipedia.org/wiki/Twitter'),
].join('\n');

const MERMAID = `flowchart LR
  subgraph NEM["Ai cũng NÉM HttpError"]
    V["validateBody / validateQuery"]
    I["validateIdParam"]
    R["requireAuth"]
    L["rate-limit"]
    S["service: 404 / 403 / 409"]
    N["notFound"]
  end
  T["Thư viện: body-parser, router (status 4xx + type)"]
  X["Bug thật / CSDL treo"]
  NEM --> H["errorHandler — NƠI DUY NHẤT viết JSON lỗi"]
  T --> H
  X --> H
  H --> O["{ error: { code, message, details?, requestId } }"]`;

export default {
  title: '5.3 — Validation and a consistent error shape|||5.3 — Validate dữ liệu và hình dạng lỗi nhất quán',
  slug: 'fp-5-3-validation-nhat-quan',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Một hợp đồng lỗi cho cả API — { error: { code, message, details?, requestId } } — viết thành Zod schema dùng chung; mọi nơi NÉM HttpError, chỉ errorHandler viết JSON. Soát thật 11 request xấu: 5 lỗi của client (413, 415, gzip hỏng, URL hỏng) từng thành 500; details liệt kê MỌI trường sai; requestId nối thông báo lỗi với dòng log; CSDL treo làm request chờ 65 s ⇒ query_timeout 5 s; requestId làm vỡ phép kiểm chống dò email — kèm vụ Twitter 2022.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Errors</span>
<h2>Every error, one shape — and the five that were lying</h2>
<p class="lead">Chapter 6 will build a React app on top of this API. That app needs to handle failures with <em>one</em> piece of code: show a field's message under the right input, refresh the token on <code>TOKEN_HET_HAN</code>, show "try again" with a reference number on a server error. That only works if every error the API can produce has the same shape. In this lesson we audit what ChiaSe actually returns, find five client errors disguised as server errors and a request that hangs for a minute, and end with an error contract written as a schema.</p>

<pre><code class="language-mermaid">${MERMAID}</code></pre>

<h3>1. Audit first: what does the API really return?</h3>
<p>Before designing anything, measure. A small script sends eleven bad requests — broken JSON, a 200 KB body, an unknown charset, a broken gzip stream, a URL with a broken percent-encoding, missing fields, no token… — and prints status, content type, whether the body has the <code>{ error: { code, message } }</code> shape, and the code:</p>
<pre><code class="language-js">${SOAT_CA}</code></pre>
<div class="out">${OUT_TRUOC}</div>
<p>The shape is fine everywhere — Chapter 2's error middleware already guaranteed JSON. The <em>status</em> is wrong five times. Sending a 200 KB body is the client's fault (413), an unsupported charset or encoding is 415, a broken URL is 400 — but our handler only knew <code>HttpError</code> and one body-parser case, so everything else fell into "500 + full stack trace in the log". Two consequences in production: the client is told "our fault, retry", and retries; and your alerting fires on errors you cannot fix, until the team learns to ignore 500s — including the real ones.</p>
<p>Reading the code found a second, quieter problem: <strong>five places wrote error JSON themselves</strong> (<code>validateBody</code>, <code>validateIdParam</code>, <code>requireAuth</code>, <code>notFound</code>, the rate limiter's <code>message</code>). Same shape today; the day someone adds a field to one of them, they diverge.</p>

<h3>2. The contract, as a schema</h3>
<pre><code class="language-ts">${ERROR_SCHEMA}</code></pre>
<ul>
<li><strong><code>code</code></strong> is for machines: <code>UPPER_SNAKE</code>, stable forever. The frontend branches on it (<code>TOKEN_HET_HAN</code> ⇒ refresh). Never branch on a message.</li>
<li><strong><code>message</code></strong> is for humans and may change at any time (wording, language).</li>
<li><strong><code>details</code></strong> appear only for <code>DU_LIEU_SAI</code>: one entry per wrong field, so a form can mark every bad input at once.</li>
<li><strong><code>requestId</code></strong> is in every error, in the <code>X-Request-Id</code> header and in the log line. A user's screenshot becomes one <code>grep</code>.</li>
</ul>
<p>The standard alternative is RFC 9457 <em>Problem Details</em> (<code>type</code>, <code>title</code>, <code>status</code>, <code>detail</code>, <code>instance</code>, media type <code>application/problem+json</code>) — Spring's <code>ProblemDetail</code> implements it. ChiaSe keeps a smaller shape because one team owns both ends; a public API used by strangers should seriously consider the RFC. Either way the principle is the same: <strong>one shape, documented, enforced by code</strong>. "Shared" here is literal: Checkpoint 5 checks every error it sees against this contract, and Chapter 6's frontend will type its error handling from <code>PhanHoiLoi</code>.</p>

<h3>3. One writer: everybody throws, only the handler writes</h3>
<pre><code class="language-ts">${HTTP_ERROR}</code></pre>
<pre><code class="language-ts">${VALIDATE}</code></pre>
<p>Express 5 forwards errors thrown in middleware — sync or async — to the error handler, so a middleware can simply <code>throw</code>. <code>requireAuth</code> becomes shorter, and the <code>WWW-Authenticate</code> header travels inside the error:</p>
<pre><code class="language-diff">${RA_DIFF}</code></pre>
<pre><code class="language-ts">${REQUEST_ID}</code></pre>
<pre><code class="language-ts">${ERROR_HANDLER}</code></pre>
<p>Three branches, in order of trust: our own <code>HttpError</code> (message is safe to show); a library error that carries a 4xx <code>status</code> (mapped to our codes, logged as one warning line without a stack); everything else is a real bug — full stack in the log, generic message plus <code>requestId</code> to the client. The handler also calls <code>z.config(z.locales.vi())</code> once at startup (in <code>app.ts</code>) so Zod's default messages are Vietnamese.</p>

<h3>4. After: the same audit</h3>
<div class="out">${OUT_SAU}</div>
<p>Zero 500s from client mistakes, and the log for them is one line each. Now a request with five problems at once:</p>
<div class="out">${OUT_NHIEU_TRUONG}</div>
<p>Every problem in one answer, each with a <code>field</code>. Two honest remarks. Zod's built-in Vietnamese messages are generic ("mong đợi string, nhận được undefined") — for important fields write your own (<code>'không được để trống'</code> above) and let the frontend map <code>code</code> to friendly text. And the old confusing <code>body: Unrecognized key</code> from lesson 5.1 is gone: unknown keys now come back as <code>{ field: "authorId", code: "unrecognized_key" }</code>.</p>
<p>The rate limiter goes through the same handler; its standard headers survive:</p>
<div class="out">${OUT_429}</div>

<h3>5. The request that waited 65 seconds</h3>
<p>To see a real 500 we froze the database with <code>docker pause</code> and asked for the feed. We expected an error after the 3-second <code>connectionTimeoutMillis</code> set in Chapter 2. Instead:</p>
<div class="out">${OUT_TREO}</div>
<p>Nothing for 65 seconds, then a 200 — only because we unpaused the database in another terminal. <code>connectionTimeoutMillis</code> applies when the pool <em>opens</em> a connection; the pool already had an open one, so the query waited forever. Every request during an outage holds a socket, memory, and a user staring at a spinner. And PostgreSQL's own <code>statement_timeout</code> cannot help: a frozen server does not count anything. The deadline has to live in Node:</p>
<pre><code class="language-ts">${POOL}</code></pre>
<div class="out">${OUT_500}</div>
<p>Five seconds, a 500 with a <code>requestId</code>, the matching stack in the log (<code>Query read timeout</code>), and the very next request after the database came back took 33 ms — the pool recovered by itself. Returning 503 with <code>Retry-After</code> for this case is a good exercise.</p>

<h3>6. The fix that broke a security test</h3>
<div class="out">${OUT_CP3_VO}</div>
<p>Chapter 3 made "wrong password" and "no such email" return <em>identical</em> bodies, so nobody can test which emails have accounts — and Checkpoint 3 compared the two bodies byte by byte. Now each body carries its own <code>requestId</code>, so they always differ. The right fix is not to remove the request id; it is to state precisely what must be equal — everything except the field that is unique per request:</p>
<pre><code class="language-diff">${CP3_DIFF}</code></pre>
<div class="pitfall co-tieu-de"><p><strong>Trap — "just update the snapshot".</strong> When a security test breaks after a harmless-looking change, the lazy fix is to delete the assertion. Ask instead: what property was this test protecting? Here: "the two answers leak nothing about whether the account exists". A random id leaks nothing; a different <code>code</code> or message would.</p></div>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">audit</span><span class="lz-d">send bad requests on purpose; list status + shape</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">contract</span><span class="lz-d">write the error shape as a schema; stable codes</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">throw</span><span class="lz-d">every layer throws HttpError; nobody else writes JSON</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">classify</span><span class="lz-d">ours ⇒ as is · library 4xx ⇒ mapped · rest ⇒ 500 + stack</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">deadline</span><span class="lz-d">every external call has a timeout; every error has a requestId</span></div>
</div>

<h3>🕵️ Hacker's corner — Twitter (2022): when two answers differ</h3>
<p>On 5 August 2022 Twitter disclosed that a bug introduced in a June 2021 update let anyone submit an email address or phone number and learn which Twitter account it belonged to. It had been reported through the bug bounty programme in January 2022 and fixed — but someone had already used it to compile 5.4 million profiles, offered for sale for 30,000 USD (Wikipedia, "Twitter"). The vulnerability was, at its core, an API that answered differently depending on whether an account existed.</p>
<p>That is why Chapter 3 returns identical errors for "wrong password" and "no such email", why this lesson's checkpoint fix compares everything but the <code>requestId</code>, and why our 500s never contain the exception message: a stack trace in a response tells an attacker your file paths, library versions and sometimes SQL. Consistent errors are not only nicer for the frontend — they leak less.</p>

<h3>In everyday life</h3>
<p>At a bank counter, every problem — missing signature, wrong form, system down — comes back on the same slip with a reason code, a sentence for you, and a ticket number. You do not get a scribbled note one day and a phone call the next. When you call the hotline, you read out the ticket number and they find your case in seconds. That ticket number is <code>requestId</code>.</p>

<h3>On a real job</h3>
<p>In an outsourcing project, the client's frontend team and your backend team are often in different countries. The error contract is what they code against; changing a <code>code</code> string is a breaking change, so it goes in the API document and the changelog. Second scene: a customer reports "the app said error at 3 p.m." — support asks for the code on the screen, you grep the log, and you know in one minute whether it was their bad input (4xx, one line) or your bug (500, stack). Third: on-call alerts fire on 5xx rate. If client mistakes become 500s, the alert is noise; fix the classification before tuning the alert.</p>

${spring(false, 'Spring Boot gives you most of this for free: Bean Validation on the DTO (<code>@Valid</code>), a <code>@RestControllerAdvice</code> with <code>@ExceptionHandler</code> methods that return <code>ProblemDetail</code> (RFC 9457), and <code>spring.mvc.problemdetails.enabled</code> for framework errors such as 415. The same rules apply: one advice class writes every error, add <code>errors</code> per field, add a request id (Micrometer tracing puts a traceId in the log), and set JDBC/Hikari timeouts.', [
  ['sb-5-1-bean-validation', 'Spring Boot 5.1 — Jakarta Bean Validation'],
  ['sb-5-2-exception-handler-spring', 'Spring Boot 5.2 — Centralized error handling with ProblemDetail'],
  ['sb-21-3-cors-loi', 'Spring Boot 21.3 — Errors and CORS end to end: ProblemDetail in a React form'],
])}

<h3>🎤 What the interviewer will ask</h3>
<ol>
<li><strong>"How do you design error responses for a REST API?"</strong> — One documented shape for every error; a stable machine-readable code; a human message; per-field details for validation; a correlation id; correct status codes; no internals (stack, SQL) in the body. Mention RFC 9457.</li>
<li><strong>"400 or 422 for validation errors?"</strong> — Both are defensible: 400 for malformed syntax, 422 for well-formed but semantically invalid content. Pick one, document it, be consistent (ChiaSe uses 400 for both).</li>
<li><strong>"A client sends a body that is too large. What should happen?"</strong> — 413 from the body parser, mapped to your error shape; never 500. Same for 415 (unsupported media type/charset).</li>
<li><strong>"What is a correlation/request id and why?"</strong> — A unique id per request, returned to the client and written in every log line for that request, so a report can be matched to logs (and across services).</li>
<li><strong>"Your API hangs when the database is slow. What do you set?"</strong> — Timeouts on every external call: connection acquire, query (client side), statement/lock timeouts (server side), plus an HTTP server timeout; then decide 500 vs 503 + Retry-After.</li>
</ol>

<h3>🧪 Lab 5.3 (60 minutes)</h3>
<div class="callout ok">
<ol>
<li>Write your own audit script with at least the eleven cases above. Run it before changing anything and save the output.</li>
<li>Write <code>schemas/error.schema.ts</code>, extend <code>HttpError</code> with <code>details</code> and <code>headers</code>, add <code>ganRequestId</code>, make every middleware <em>throw</em>, rewrite <code>errorHandler</code> with the three branches.</li>
<li>Run the audit again: no 5xx for client mistakes, every body passes the schema.</li>
<li>Freeze the database with <code>docker pause</code>, call the feed, time it. Add <code>query_timeout</code>, repeat, find the request in the log by its <code>requestId</code>.</li>
<li>Run Checkpoint 3. If it breaks on "identical bodies", fix the comparison — not the security property.</li>
</ol>
<p><strong>Done when:</strong> every error from the API — your own, the libraries', the rate limiter's, a frozen database's — has the same shape with a <code>requestId</code>, and no client mistake produces a 500.</p>
<p><strong>Rubric (10):</strong> audit before/after (2) · error schema + stable codes (1) · one writer (2) · library 4xx mapped (2) · details for every field (1) · query timeout measured (1) · checkpoint-3 fixed for the right reason (1).</p>
</div>
<details><summary>Solution</summary>
<p>Commit <code>75025e4</code> on <code>ch5/binh-luan</code>: <code>lib/http-error.ts</code>, <code>schemas/error.schema.ts</code>, <code>middlewares/request-id.ts</code>, <code>middlewares/validate.ts</code> (<code>chiTietTuZod</code>), <code>validate-id.ts</code>, <code>require-auth.ts</code>, <code>not-found.ts</code>, <code>rate-limit.ts</code> (<code>handler</code> instead of <code>message</code>), <code>error-handler.ts</code>, <code>app.ts</code>, <code>db/prisma.ts</code> (<code>query_timeout</code>), <code>types/express.d.ts</code> (<code>req.id</code>). Commit <code>20f7233</code>: <code>scripts/checkpoint-3.mjs</code>. If TypeScript complains that <code>notFound</code> has the wrong signature, remember Express accepts a middleware with fewer parameters — <code>(req) =&gt; { throw … }</code> is valid. Why does the 429 keep <code>RateLimit</code> and <code>Retry-After</code>? express-rate-limit sets those headers <em>before</em> calling <code>handler</code>, and our <code>errorHandler</code> only adds a body — section 4 shows them in the real response.</p>
</details>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">error contract</span><span class="v">The documented shape of every error response; clients code against it.</span></div>
  <div class="kv"><span class="k">error code</span><span class="v">Stable machine-readable identifier (e.g. TOKEN_HET_HAN), separate from the message.</span></div>
  <div class="kv"><span class="k">correlation / request id</span><span class="v">Unique id per request, shown to the client and written in the logs.</span></div>
  <div class="kv"><span class="k">413 / 415</span><span class="v">Payload Too Large / Unsupported Media Type — client errors, never 500.</span></div>
  <div class="kv"><span class="k">RFC 9457</span><span class="v">Problem Details for HTTP APIs: a standard error body (application/problem+json).</span></div>
  <div class="kv"><span class="k">query_timeout</span><span class="v">node-postgres client-side deadline for one query; default is no limit.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Audit first: five client mistakes were reported as 500s, and five places wrote error JSON.</li>
<li>One contract — <code>{ error: { code, message, details?, requestId } }</code> — written as a schema and checked by the checkpoint.</li>
<li>Everyone throws <code>HttpError</code>; only <code>errorHandler</code> writes; library 4xx errors are mapped, real bugs get a stack in the log only.</li>
<li><code>details</code> list every wrong field; <code>code</code> is for machines, <code>message</code> for humans.</li>
<li>A frozen database held a request for 65 s: every external call needs a deadline.</li>
<li>When a change breaks a security test, keep the property, fix the comparison.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Lỗi</span>
<h2>Mọi lỗi, một hình dạng — và năm lỗi đang "nói dối"</h2>
<p class="lead">Chương 6 sẽ dựng ứng dụng React trên API này. Ứng dụng đó cần xử lý thất bại bằng <em>một</em> đoạn mã: hiện câu báo dưới đúng ô nhập, làm mới token khi gặp <code>TOKEN_HET_HAN</code>, hiện "thử lại" kèm mã tham chiếu khi máy chủ lỗi. Điều đó chỉ làm được nếu mọi lỗi API có thể trả ra đều cùng một hình dạng. Bài này soát xem ChiaSe thật sự trả gì, tìm ra năm lỗi của client đội lốt lỗi máy chủ và một request treo cả phút, và kết thúc bằng một hợp đồng lỗi viết thành schema.</p>

<pre><code class="language-mermaid">${MERMAID}</code></pre>

<h3>1. Soát trước: API thật sự trả về gì?</h3>
<p>Trước khi thiết kế gì, hãy đo. Một script nhỏ gửi mười một request "xấu" — JSON hỏng, body 200 KB, charset lạ, luồng gzip hỏng, URL có mã phần trăm hỏng, thiếu trường, không token… — rồi in mã trạng thái, content type, thân có đúng hình dạng <code>{ error: { code, message } }</code> không, và code:</p>
<pre><code class="language-js">${SOAT_CA}</code></pre>
<div class="out">${OUT_TRUOC}</div>
<p>Hình dạng thì ổn ở mọi nơi — middleware lỗi của Chương 2 đã bảo đảm JSON. Nhưng <em>mã trạng thái</em> sai năm lần. Gửi body 200 KB là lỗi của client (413), charset hay encoding không hỗ trợ là 415, URL hỏng là 400 — nhưng handler của ta chỉ biết <code>HttpError</code> và một ca của body-parser, nên mọi thứ khác rơi xuống "500 + nguyên stack trace trong log". Hai hậu quả trên production: client được bảo "lỗi của chúng tôi, thử lại đi" và thử lại thật; còn hệ thống báo động kêu vì những lỗi bạn không sửa được, tới lúc cả đội quen bỏ qua 500 — kể cả 500 thật.</p>
<p>Đọc mã còn thấy vấn đề thứ hai, âm thầm hơn: <strong>năm chỗ tự viết JSON lỗi</strong> (<code>validateBody</code>, <code>validateIdParam</code>, <code>requireAuth</code>, <code>notFound</code>, <code>message</code> của bộ giới hạn tần suất). Hôm nay cùng hình dạng; ngày ai đó thêm một trường vào một chỗ, chúng sẽ lệch nhau.</p>

<h3>2. Hợp đồng, viết thành schema</h3>
<pre><code class="language-ts">${ERROR_SCHEMA}</code></pre>
<ul>
<li><strong><code>code</code></strong> cho máy đọc: <code>CHU_HOA_GACH_DUOI</code>, ổn định mãi mãi. Frontend rẽ nhánh theo nó (<code>TOKEN_HET_HAN</code> ⇒ làm mới token). Đừng bao giờ rẽ nhánh theo message.</li>
<li><strong><code>message</code></strong> cho người đọc, được phép đổi bất cứ lúc nào (câu chữ, ngôn ngữ).</li>
<li><strong><code>details</code></strong> chỉ có ở <code>DU_LIEU_SAI</code>: mỗi trường sai một mục, để form tô đỏ MỌI ô sai cùng lúc.</li>
<li><strong><code>requestId</code></strong> có trong mọi lỗi, trong header <code>X-Request-Id</code> và trong dòng log. Ảnh chụp màn hình của người dùng trở thành một lệnh <code>grep</code>.</li>
</ul>
<p>Lựa chọn chuẩn hoá là RFC 9457 <em>Problem Details</em> (<code>type</code>, <code>title</code>, <code>status</code>, <code>detail</code>, <code>instance</code>, kiểu <code>application/problem+json</code>) — <code>ProblemDetail</code> của Spring làm theo nó. ChiaSe giữ hình dạng gọn hơn vì một đội nắm cả hai đầu; API công khai cho người lạ dùng thì nên cân nhắc nghiêm túc chuẩn RFC. Cách nào thì nguyên tắc vẫn vậy: <strong>một hình dạng, có tài liệu, được mã ép buộc</strong>. "Dùng chung" ở đây là nghĩa đen: Checkpoint 5 soát mọi lỗi nó gặp theo hợp đồng này, và frontend ở Chương 6 sẽ đặt kiểu cho phần xử lý lỗi từ <code>PhanHoiLoi</code>.</p>

<h3>3. Một người viết: ai cũng ném, chỉ handler viết</h3>
<pre><code class="language-ts">${HTTP_ERROR}</code></pre>
<pre><code class="language-ts">${VALIDATE}</code></pre>
<p>Express 5 chuyển lỗi ném ra trong middleware — đồng bộ hay async — tới handler lỗi, nên middleware chỉ cần <code>throw</code>. <code>requireAuth</code> ngắn đi, và header <code>WWW-Authenticate</code> đi theo bên trong lỗi:</p>
<pre><code class="language-diff">${RA_DIFF}</code></pre>
<pre><code class="language-ts">${REQUEST_ID}</code></pre>
<pre><code class="language-ts">${ERROR_HANDLER}</code></pre>
<p>Ba nhánh, theo mức độ tin cậy: <code>HttpError</code> của ta (message an toàn để hiện); lỗi thư viện mang <code>status</code> 4xx (ánh xạ sang code của ta, ghi một dòng cảnh báo, không stack); còn lại là bug thật — stack đầy đủ trong log, client chỉ nhận câu chung kèm <code>requestId</code>. Ngoài ra <code>app.ts</code> gọi <code>z.config(z.locales.vi())</code> một lần lúc khởi động để câu báo mặc định của Zod là tiếng Việt.</p>

<h3>4. Sau khi sửa: soát lại đúng như cũ</h3>
<div class="out">${OUT_SAU}</div>
<p>Không còn 500 nào do client gửi sai, và log của chúng chỉ một dòng mỗi lỗi. Giờ một request sai năm chỗ cùng lúc:</p>
<div class="out">${OUT_NHIEU_TRUONG}</div>
<p>Mọi lỗi trong một câu trả lời, mỗi lỗi có <code>field</code>. Hai nhận xét trung thực. Câu tiếng Việt có sẵn của Zod khá "máy" ("mong đợi string, nhận được undefined") — trường quan trọng thì tự viết câu (như <code>'không được để trống'</code> ở trên) và để frontend ánh xạ <code>code</code> sang câu thân thiện. Và câu khó hiểu <code>body: Unrecognized key</code> ở bài 5.1 đã biến mất: khoá lạ giờ trả về <code>{ field: "authorId", code: "unrecognized_key" }</code>.</p>
<p>Bộ giới hạn tần suất cũng đi qua cùng handler; các header chuẩn của nó vẫn còn nguyên:</p>
<div class="out">${OUT_429}</div>

<h3>5. Request chờ 65 giây</h3>
<p>Để thấy một lỗi 500 thật, ta đóng băng CSDL bằng <code>docker pause</code> rồi gọi feed. Ta chờ lỗi sau 3 giây của <code>connectionTimeoutMillis</code> đặt từ Chương 2. Thay vào đó:</p>
<div class="out">${OUT_TREO}</div>
<p>Không có gì suốt 65 giây, rồi ra 200 — chỉ vì ta đã mở lại CSDL ở cửa sổ khác. <code>connectionTimeoutMillis</code> chỉ áp khi pool <em>mở</em> kết nối mới; pool đã có sẵn một kết nối mở, nên truy vấn chờ vô hạn. Trong lúc sự cố, mỗi request giữ một socket, một ít bộ nhớ, và một người dùng nhìn vòng xoay. <code>statement_timeout</code> của chính PostgreSQL cũng không cứu được: máy chủ CSDL đã đóng băng thì chẳng đếm giờ được gì. Hạn chót phải nằm ở phía Node:</p>
<pre><code class="language-ts">${POOL}</code></pre>
<div class="out">${OUT_500}</div>
<p>Năm giây, một lỗi 500 kèm <code>requestId</code>, stack tương ứng trong log (<code>Query read timeout</code>), và request ngay sau khi CSDL sống lại chỉ mất 33 ms — pool tự hồi phục. Trả 503 kèm <code>Retry-After</code> cho ca này là một bài tập tốt.</p>

<h3>6. Sửa xong thì vỡ một phép kiểm bảo mật</h3>
<div class="out">${OUT_CP3_VO}</div>
<p>Chương 3 cho "sai mật khẩu" và "email không tồn tại" trả thân <em>giống hệt</em> nhau, để không ai dò được email nào có tài khoản — và Checkpoint 3 so hai thân đó từng byte. Giờ mỗi thân có <code>requestId</code> riêng, nên luôn khác nhau. Cách sửa đúng không phải bỏ request id; mà là nói CHÍNH XÁC cái gì phải bằng nhau — mọi thứ trừ trường duy nhất theo từng request:</p>
<pre><code class="language-diff">${CP3_DIFF}</code></pre>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — "cập nhật lại bản chụp cho xong".</strong> Phép kiểm bảo mật vỡ sau một thay đổi trông vô hại, cách lười là xoá luôn khẳng định đó. Hãy hỏi: phép kiểm này đang bảo vệ TÍNH CHẤT gì? Ở đây: "hai câu trả lời không lộ gì về việc tài khoản có tồn tại". Một mã ngẫu nhiên không lộ gì; một <code>code</code> hay message khác thì có.</p></div>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">soát</span><span class="lz-d">cố tình gửi request xấu; ghi lại mã + hình dạng</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">hợp đồng</span><span class="lz-d">viết hình dạng lỗi thành schema; code ổn định</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">ném</span><span class="lz-d">mọi tầng ném HttpError; không ai khác viết JSON</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">phân loại</span><span class="lz-d">của ta ⇒ giữ nguyên · thư viện 4xx ⇒ ánh xạ · còn lại ⇒ 500 + stack</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">hạn chót</span><span class="lz-d">mọi lời gọi ra ngoài có timeout; mọi lỗi có requestId</span></div>
</div>

<h3>🕵️ Góc hacker — Twitter (2022): khi hai câu trả lời khác nhau</h3>
<p>Ngày 05/08/2022, Twitter công bố một lỗi đưa vào từ bản cập nhật 06/2021 cho phép bất kỳ ai gửi một email hoặc số điện thoại và biết nó thuộc tài khoản Twitter nào. Lỗi đã được báo qua chương trình bug bounty hồi 01/2022 và đã vá — nhưng ai đó đã kịp dùng nó gom 5,4 triệu hồ sơ, rao bán 30.000 USD (Wikipedia, "Twitter"). Cốt lõi của lỗ hổng: một API trả lời KHÁC NHAU tuỳ tài khoản có tồn tại hay không.</p>
<p>Đó là lý do Chương 3 trả lỗi giống hệt cho "sai mật khẩu" và "không có email này", lý do phép kiểm ở bài này so mọi thứ trừ <code>requestId</code>, và lý do lỗi 500 của ta không bao giờ chứa message của exception: stack trace trong phản hồi cho kẻ tấn công biết đường dẫn tệp, phiên bản thư viện, đôi khi cả SQL. Lỗi nhất quán không chỉ dễ chịu cho frontend — nó còn lộ ít hơn.</p>

<h3>Liên hệ đời thường</h3>
<p>Ở quầy ngân hàng, mọi vấn đề — thiếu chữ ký, sai mẫu đơn, hệ thống trục trặc — đều trả về trên cùng một mẫu phiếu: mã lý do, một câu cho bạn đọc, và số phiếu. Không có chuyện hôm nay nhận mảnh giấy viết tay, mai nhận cuộc gọi. Gọi tổng đài, bạn đọc số phiếu là họ tìm ra hồ sơ trong vài giây. Số phiếu đó chính là <code>requestId</code>.</p>

<h3>Tình huống đi làm thật</h3>
<p>Ở dự án outsourcing, đội frontend của khách và đội backend của bạn thường ở hai nước. Hợp đồng lỗi là thứ họ viết mã theo; đổi một chuỗi <code>code</code> là thay đổi phá vỡ, phải vào tài liệu API và changelog. Cảnh thứ hai: khách báo "ứng dụng báo lỗi lúc 3 giờ chiều" — bộ phận hỗ trợ xin mã trên màn hình, bạn grep log, và trong một phút biết đó là dữ liệu sai của họ (4xx, một dòng) hay bug của bạn (500, có stack). Cảnh thứ ba: báo động trực ca kêu theo tỉ lệ 5xx. Lỗi của client mà thành 500 thì báo động thành tiếng ồn; sửa phân loại trước khi chỉnh ngưỡng báo động.</p>

${spring(false, 'Spring Boot cho sẵn phần lớn việc này: Bean Validation trên DTO (<code>@Valid</code>), một <code>@RestControllerAdvice</code> với các hàm <code>@ExceptionHandler</code> trả <code>ProblemDetail</code> (RFC 9457), và <code>spring.mvc.problemdetails.enabled</code> cho lỗi của framework như 415. Luật y hệt: một lớp advice viết MỌI lỗi, thêm <code>errors</code> theo từng trường, thêm request id (Micrometer tracing ghi traceId vào log), và đặt timeout cho JDBC/Hikari.', [
  ['sb-5-1-bean-validation', 'Spring Boot 5.1 — Jakarta Bean Validation'],
  ['sb-5-2-exception-handler-spring', 'Spring Boot 5.2 — Xử lý lỗi tập trung với ProblemDetail'],
  ['sb-21-3-cors-loi', 'Spring Boot 21.3 — Lỗi và CORS trọn tuyến: ProblemDetail trong form React'],
])}

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Bạn thiết kế phản hồi lỗi cho REST API thế nào?"</strong> — Một hình dạng có tài liệu cho mọi lỗi; code máy đọc ổn định; message cho người; chi tiết theo trường khi validate; mã tương quan; mã trạng thái đúng; không lộ nội tình (stack, SQL) trong thân. Nhắc tới RFC 9457.</li>
<li><strong>"Lỗi validate trả 400 hay 422?"</strong> — Cả hai đều bảo vệ được: 400 cho cú pháp hỏng, 422 cho nội dung đúng cú pháp nhưng sai nghĩa. Chọn một, ghi tài liệu, nhất quán (ChiaSe dùng 400 cho cả hai).</li>
<li><strong>"Client gửi body quá lớn thì sao?"</strong> — 413 từ bộ đọc body, ánh xạ sang hình dạng lỗi của bạn; không bao giờ 500. Tương tự 415 (kiểu nội dung/charset không hỗ trợ).</li>
<li><strong>"Correlation/request id là gì, để làm gì?"</strong> — Mã duy nhất cho mỗi request, trả về client và ghi vào mọi dòng log của request đó, để ghép một báo lỗi với log (và xuyên qua nhiều dịch vụ).</li>
<li><strong>"API treo khi CSDL chậm. Bạn đặt gì?"</strong> — Timeout cho mọi lời gọi ra ngoài: lấy kết nối, truy vấn (phía client), statement/lock timeout (phía máy chủ), cộng timeout của máy chủ HTTP; rồi quyết 500 hay 503 + Retry-After.</li>
</ol>

<h3>🧪 Lab 5.3 (60 phút)</h3>
<div class="callout ok">
<ol>
<li>Tự viết script soát với ít nhất mười một ca như trên. Chạy TRƯỚC khi sửa gì và lưu output.</li>
<li>Viết <code>schemas/error.schema.ts</code>, mở rộng <code>HttpError</code> với <code>details</code> và <code>headers</code>, thêm <code>ganRequestId</code>, cho mọi middleware <em>ném</em>, viết lại <code>errorHandler</code> với ba nhánh.</li>
<li>Soát lại: không 5xx nào do client sai, mọi thân lỗi qua được schema.</li>
<li>Đóng băng CSDL bằng <code>docker pause</code>, gọi feed, đo giờ. Thêm <code>query_timeout</code>, làm lại, tìm request trong log theo <code>requestId</code>.</li>
<li>Chạy Checkpoint 3. Vỡ ở "hai body giống hệt" thì sửa PHÉP SO — không bỏ tính chất bảo mật.</li>
</ol>
<p><strong>Xong khi:</strong> mọi lỗi của API — của ta, của thư viện, của bộ giới hạn tần suất, của CSDL đóng băng — cùng một hình dạng có <code>requestId</code>, và không lỗi nào do client gây ra lại thành 500.</p>
<p><strong>Thang điểm (10):</strong> soát trước/sau (2) · schema lỗi + code ổn định (1) · một người viết (2) · ánh xạ lỗi 4xx của thư viện (2) · details cho mọi trường (1) · đo query timeout (1) · sửa checkpoint-3 đúng lý do (1).</p>
</div>
<details><summary>Lời giải</summary>
<p>Commit <code>75025e4</code> trên <code>ch5/binh-luan</code>: <code>lib/http-error.ts</code>, <code>schemas/error.schema.ts</code>, <code>middlewares/request-id.ts</code>, <code>middlewares/validate.ts</code> (<code>chiTietTuZod</code>), <code>validate-id.ts</code>, <code>require-auth.ts</code>, <code>not-found.ts</code>, <code>rate-limit.ts</code> (<code>handler</code> thay cho <code>message</code>), <code>error-handler.ts</code>, <code>app.ts</code>, <code>db/prisma.ts</code> (<code>query_timeout</code>), <code>types/express.d.ts</code> (<code>req.id</code>). Commit <code>20f7233</code>: <code>scripts/checkpoint-3.mjs</code>. TypeScript kêu <code>notFound</code> sai chữ ký: Express nhận middleware ít tham số hơn — <code>(req) =&gt; { throw … }</code> vẫn hợp lệ. Vì sao 429 vẫn giữ <code>RateLimit</code> và <code>Retry-After</code>? express-rate-limit đặt các header đó <em>trước</em> khi gọi <code>handler</code>, còn <code>errorHandler</code> của ta chỉ thêm thân — mục 4 cho thấy chúng trong phản hồi thật.</p>
</details>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">hợp đồng lỗi</span><span class="v">Hình dạng có tài liệu của mọi phản hồi lỗi; client viết mã theo nó.</span></div>
  <div class="kv"><span class="k">mã lỗi (code)</span><span class="v">Định danh ổn định cho máy đọc (vd TOKEN_HET_HAN), tách khỏi message.</span></div>
  <div class="kv"><span class="k">correlation / request id</span><span class="v">Mã duy nhất cho mỗi request, hiện cho client và ghi vào log.</span></div>
  <div class="kv"><span class="k">413 / 415</span><span class="v">Payload Too Large / Unsupported Media Type — lỗi của client, không bao giờ là 500.</span></div>
  <div class="kv"><span class="k">RFC 9457</span><span class="v">Problem Details for HTTP APIs: thân lỗi chuẩn (application/problem+json).</span></div>
  <div class="kv"><span class="k">query_timeout</span><span class="v">Hạn chót phía client của node-postgres cho một truy vấn; mặc định không giới hạn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Soát trước: năm lỗi do client bị báo thành 500, và năm chỗ tự viết JSON lỗi.</li>
<li>Một hợp đồng — <code>{ error: { code, message, details?, requestId } }</code> — viết thành schema, checkpoint soát theo nó.</li>
<li>Ai cũng ném <code>HttpError</code>; chỉ <code>errorHandler</code> viết; lỗi 4xx của thư viện được ánh xạ, bug thật chỉ để stack trong log.</li>
<li><code>details</code> liệt kê mọi trường sai; <code>code</code> cho máy, <code>message</code> cho người.</li>
<li>CSDL đóng băng giữ một request 65 giây: mọi lời gọi ra ngoài cần hạn chót.</li>
<li>Thay đổi làm vỡ phép kiểm bảo mật: giữ tính chất, sửa phép so.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
