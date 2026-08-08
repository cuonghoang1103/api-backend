# cuongthai.com (Portfolio web)

Commit đầu tiên là `2026-06-08`: *"init optimized nodejs backend with pgvector infrastructure for VPS"*. Bảy commit tiếp theo trong cùng 24 giờ đó toàn là `fix:` — build path lệch tsconfig, Docker build fail, rsync xoá nhầm volume dữ liệu. Không có "giai đoạn thiết kế" tách biệt khỏi "giai đoạn code": kiến trúc bị bẻ cong theo từng lần triển khai thất bại, ngay từ ngày đầu tiên.

Hơn 50 ngày và 1.672 commit sau, đây là những gì đứng vững: 248 model Prisma, 63 router backend (`/api/v1/*`), 180 trang frontend, 348 component React, khoảng 316.000 dòng TypeScript (80.795 backend + 235.762 frontend). Một mạng xã hội đủ Messenger/Feed/Story, một hệ thống học tập với Phòng thi chấm bằng AI, một xưởng mô phỏng dựng video giáo trình bằng canvas, một sân chơi lái xe 3D chạy WebGPU, và một tầng LLM 3-nhà-cung-cấp có circuit breaker theo từng tính năng.

Bài viết này không phải tài liệu quảng cáo tính năng, cũng không dừng ở mức "case-study điểm qua kiến trúc". Nó được viết để một người **chưa biết gì về dự án** có thể đọc từ đầu tới cuối và tự dựng lại một hệ thống tương tự: từ việc cài Node/Postgres/Redis đầu tiên, tới cách 248 model quan hệ với nhau, cách một request đi qua middleware, cơ chế hoạt động thật của từng module lớn, và cả những sự cố production đã dạy hệ thống này cách tự vệ.

:::note[Cách đọc bài này]
Mọi con số, đường dẫn file và số dòng trong bài đều được xác minh trực tiếp từ mã nguồn tại thời điểm viết (cuối tháng 7/2026), không suy đoán từ tên biến. Một vài chi tiết vận hành trên VPS thật (crontab, tường lửa) không nằm trong repo nên không thể xác minh từ đây — những chỗ đó được ghi rõ là "chưa xác minh" thay vì giả định. Mục lục bên cạnh có nhiều tầng — bấm vào bất kỳ mục nào để nhảy thẳng tới đó.
:::

## Kiến trúc tổng quan

Một tên miền, năm container Docker, ba lớp lưu trữ:

```mermaid
flowchart TB
    Browser["Trình duyệt"]
    Browser -->|"HTTPS :443, TLS 1.2/1.3"| Nginx["Nginx 1.27 — TLS termination"]

    subgraph VPS["VPS 8GB RAM — Docker compose, network bridge"]
        Nginx -->|"location / → :3000"| FE["frontend — Next.js 15 standalone"]
        Nginx -->|"location /api/ → :3001"| BE["backend — Express + TypeScript"]
        Nginx -->|"location /uploads/ → disk"| Disk[("bind mount /opt/.../uploads")]
        Nginx -->|"location /socket.io/ → :3001, timeout 24h"| BE
        FE -->|"SSR: fetch nội bộ http://backend:3001"| BE
        BE --> PG[("PostgreSQL 16 + PostGIS")]
        BE <-->|"cache, rate-limit, quota, OTP, adapter pub/sub"| Redis[("Redis 7")]
    end

    BE -->|"presigned PUT/GET"| R2[("Cloudflare R2 — object storage")]
    BE -->|"fetch — không SDK"| LLM["Anthropic-compatible gateway · Groq · OpenRouter"]
    Browser -.->|"rewrite /playground, app Vite riêng, CSP riêng"| FE
```

Một domain phục vụ hai ứng dụng: `location /api/` của Nginx chuyển sang Express, mọi thứ còn lại sang Next.js. Bên trong mạng Docker, backend nghe cổng 3001 **không mã hoá** — nghe đáng lo cho tới khi nhớ rằng cổng đó không publish ra host, TLS đã kết thúc ở Nginx rồi. Redis không chỉ là cache: nó còn là store cho rate-limit, quota AI, OTP, và pub/sub cho Socket.IO chạy đa tiến trình. R2 (S3-compatible) giữ toàn bộ media qua presigned URL, không multipart thật — file lớn đi một phát PUT với URL ký hạn 3600s.

`/playground` là một ngoại lệ kiến trúc cố ý: một ứng dụng Vite/Three.js **tách biệt hoàn toàn**, build ra `frontend/public/playground/` rồi Next.js `rewrite` vào, mang bộ CSP riêng (xem phần Bảo mật).

## Bắt đầu từ số 0 — dựng lại môi trường này

### 1. Yêu cầu hệ thống

Trước khi clone bất cứ thứ gì, máy cần có:

- **Node.js 20.x trở lên** — `package.json` ở root khai báo `"engines": { "node": ">=20.0.0" }`. Bản thân code dùng ESM (`"type": "module"`) và chạy qua `tsx` (TypeScript chạy trực tiếp, không cần build trước ở dev), nên Node quá cũ sẽ vỡ cú pháp import/export.
- **PostgreSQL** — bắt buộc, và không phải bản Postgres bình thường mà là **PostGIS + pgvector** (schema dùng `pgvector` cho embedding AI, xem dependency `pgvector: 0.3.0` trong `package.json`). Image Docker chính thức của dự án là `postgis/postgis:16-3.4`.
- **Redis** — dùng cho cache, rate-limit (`rate-limit-redis`), và Socket.io adapter khi có nhiều instance (`@socket.io/redis-adapter`). Không có Redis app vẫn có thể chạy một phần nhưng rate-limit/cache sẽ không hoạt động đúng thiết kế.
- **npm** (không phải yarn/pnpm) — cả hai `package.json` (root và `frontend/`) đều không có lockfile của công cụ khác.
- Không bắt buộc nhưng cần cho một số tính năng cụ thể: **ffmpeg** (xử lý audio/video), **yt-dlp** (tải nhạc YouTube), Docker (nếu không muốn cài Postgres/Redis local).

Đây là hai codebase độc lập trong cùng một repo: backend Express+TypeScript nằm ở thư mục gốc, frontend Next.js nằm trong `frontend/`. Chúng có `package.json`, `node_modules`, và vòng đời cài đặt/chạy hoàn toàn tách biệt.

### 2. Clone và cài dependencies

```bash
git clone <repo-url> api-backend
cd api-backend

# Cài backend (chạy ở thư mục gốc)
npm install

# Cài frontend (thư mục riêng)
cd frontend
npm install
cd ..
```

Hai lệnh `npm install` này độc lập — cài backend không tự động cài frontend và ngược lại.

### 3. Cấu hình biến môi trường

```bash
cp .env.example .env
cp frontend/.env.example frontend/.env.local
```

Backend đọc `.env` bằng `dotenv`, nhưng quan trọng hơn: `src/config/env.ts` dùng **Zod** để validate toàn bộ biến môi trường ngay lúc khởi động app. Ở `NODE_ENV=production`, thiếu hoặc sai bất kỳ biến bắt buộc nào sẽ khiến app **từ chối khởi động** thay vì chạy ngầm với giá trị rác — lựa chọn có chủ đích, tránh kiểu lỗi "auth vỡ lúc 3 giờ sáng vì secret rỗng". Ở dev, nó chỉ cảnh báo và cho chạy tiếp.

Các nhóm biến quan trọng, theo ý nghĩa:

**Server & Database.** `PORT` (mặc định 3001) và `NODE_ENV` xác định chế độ chạy. `DATABASE_URL` là chuỗi kết nối Postgres chuẩn `postgresql://user:pass@host:port/db?schema=public` — `env.ts` validate nó phải bắt đầu bằng `postgresql://`/`postgres://`, sai định dạng bị chặn ngay lúc boot chứ không đợi Prisma báo lỗi kết nối.

**JWT & phiên đăng nhập.** `JWT_SECRET` dùng để ký/xác minh access token — chứng minh "user đang gọi API là ai". `JWT_REFRESH_SECRET` là secret riêng cho refresh token (sống lâu hơn, cấp lại access token mới mà không bắt user đăng nhập lại). Tách hai secret để access token lộ không kéo theo refresh token bị giả mạo. `JWT_EXPIRES_IN=24h`, `JWT_REFRESH_EXPIRES_IN=7d`.

**COOKIE_SECRET và SIGNED_URL_SECRET.** `COOKIE_SECRET` ký cookie (chống giả mạo/sửa cookie phía client). `SIGNED_URL_SECRET` tạo HMAC-SHA256 cho URL upload/download có thời hạn — một link không thể bị đoán hay tái sử dụng vô thời hạn.

Cả ba secret trên (và cả `SIGNED_URL_SECRET`) bị Zod ép **tối thiểu 32 ký tự**, đồng thời chặn cứng các placeholder quen thuộc như `"change-me"`. Cách tạo secret hợp lệ:

```bash
openssl rand -base64 64   # JWT_SECRET / JWT_REFRESH_SECRET
openssl rand -base64 32   # COOKIE_SECRET / SIGNED_URL_SECRET
```

**Redis.** `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `REDIS_DB` — phục vụ cache, rate-limiting, quota AI, OTP, Socket.IO adapter.

**CORS & Frontend.** `ALLOWED_ORIGINS` là danh sách domain (phân tách dấu phẩy) được phép gọi API từ trình duyệt kèm cookie. Dev local thường chỉ cần `http://localhost:3000`.

**R2 (Cloudflare — lưu trữ file).** `R2_BUCKET_NAME`, `R2_PUBLIC_URL`, `R2_ENDPOINT_URL`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` — cả 4 biến bắt buộc phải có để hệ thống chọn `R2StorageProvider`; thiếu một trong số đó, app tự rơi về `LocalStorageProvider` (lưu file trên đĩa host) — tiện cho dev local, nhưng production bắt buộc R2.

**Admin & OAuth.** `ADMIN_EMAILS` là danh sách email được cấp quyền admin ngay khi đăng ký/đăng nhập. `GOOGLE_CLIENT_ID/SECRET`, `GITHUB_CLIENT_ID/SECRET` là OAuth tuỳ chọn — để trống thì nút OAuth tương ứng không hoạt động chứ không crash app.

**Các nhóm khác (tuỳ chọn, degrade an toàn khi thiếu):** email (Resend/SMTP), thanh toán (PayOS/VNPay), AI (nhiều module tự chuyển sang "STATIC mode" khi thiếu key), Sentry (tắt hoàn toàn khi DSN rỗng), YouTube Data API. Điểm chung: phần lớn được thiết kế để **thiếu vẫn chạy được**, chỉ tắt đúng tính năng liên quan — chỉ nhóm JWT/Cookie/Signed-URL/Database là bắt buộc cứng.

Bên `frontend/.env.local`, biến quan trọng nhất là `AUTH_SECRET` (NextAuth v5) và `NEXT_PUBLIC_API_URL` trỏ về backend. Ghi nhớ một quy ước rút ra từ sự cố thật: mọi biến `NEXT_PUBLIC_*` bị **nhúng cứng vào bundle JS lúc build** — đổi giá trị sau khi build không có tác dụng cho tới khi build lại, nên key của bên thứ ba tuyệt đối không đặt thành `NEXT_PUBLIC_*`, phải đi qua route proxy backend để giữ key ở server.

### 4. Dựng cơ sở dữ liệu local

```bash
docker run -d --name cuonghoangdev_pg \
  -e POSTGRES_DB=cuonghoangdev_db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=123456 \
  -p 5432:5432 postgis/postgis:16-3.4

docker run -d --name cuonghoangdev_redis -p 6379:6379 redis:7-alpine
```

`docker-compose.yml` ở root là bản đầy đủ dùng cho VPS production (backend + frontend + nginx cùng một mạng), không phải file "chạy Postgres+Redis cho dev" — nó đòi hỏi các secret bắt buộc khai kiểu `${VAR:?...}` (thiếu là `docker compose up` dừng ngay với lỗi rõ ràng) và build cả hai image, khá nặng chỉ để lấy DB local. Chạy container Postgres/Redis riêng lẻ như trên thực dụng hơn nhiều cho dev.

### 5. Chạy Prisma: generate → migrate → seed

Thứ tự này **không thể đảo**:

```bash
npm run db:generate   # prisma generate
npm run db:migrate    # prisma migrate dev
npm run db:seed       # tsx prisma/seed.ts
```

`db:generate` đọc `prisma/schema.prisma` (248 model, 49 enum) và sinh ra Prisma Client — bộ type và API truy vấn dùng trong toàn bộ `src/services/*`. `db:migrate` so sánh schema với lịch sử migration, tạo migration mới nếu có thay đổi, rồi áp SQL đó vào database thật — đây là bước **thực sự tạo bảng**. Chạy seed trước bước này chắc chắn lỗi vì bảng chưa tồn tại. `db:seed` chạy `prisma/seed.ts` — idempotent (dùng `upsert`), tạo roles (`ROLE_ADMIN`, `ROLE_USER`), tài khoản admin theo `ADMIN_EMAILS`.

Ngoài `seed.ts` mặc định, `prisma/` còn một loạt seed chuyên biệt chạy tay khi cần: `seed.my-language.ts`/`seed.ja-kana.ts`/`seed.hanzi-*.ts` (dữ liệu học ngôn ngữ), `seed.interview.ts` (câu hỏi phỏng vấn), `seed.exp-hub.ts`, `seed.finance.demo.ts`, `seed-repos.ts`. Người mới dựng môi trường chỉ bắt buộc `npm run db:seed`; các seed còn lại chỉ cần khi muốn thử tính năng tương ứng. Muốn xem dữ liệu trực quan: `npm run db:studio` mở Prisma Studio.

### 6. Chạy dev server

Hai terminal riêng biệt:

```bash
# Terminal 1 — backend, cổng 3001, hot-reload qua tsx watch
npm run dev

# Terminal 2 — frontend, cổng 3000
cd frontend && npm run dev
```

Frontend phụ thuộc backend đã chạy và đã seed roles/admin. Ngược lại backend không phụ thuộc frontend chạy, chỉ cần `ALLOWED_ORIGINS` khớp cổng frontend.

### 7. Cấu trúc thư mục tổng quan

**Backend — `src/`:**
- `routes/` — định nghĩa endpoint HTTP, một file cho mỗi domain. Chỉ khai báo route + gọi middleware/validate + gọi service, không chứa logic nghiệp vụ.
- `services/` — toàn bộ logic nghiệp vụ và truy vấn Prisma nằm ở đây. Route mỏng, service dày là quy ước xuyên suốt.
- `middleware/` — `auth.ts` (xác thực JWT), `captcha.ts` (Turnstile), `errorHandler.ts` (bắt lỗi tập trung), `validate.ts` (validate input).
- `config/` — `env.ts`, `database.ts` (Prisma client), `redis.ts`, `r2.ts`, `payos.ts`.
- `storage/` — abstraction cho nơi lưu file (R2 hay local disk).
- `socket/` — xử lý Socket.io.

**Frontend — `frontend/src/`:**
- `app/` — App Router, mỗi thư mục con là một route.
- `components/` — chia theo domain trùng với `app/` (`components/academy/`, `components/cv/`...), cộng `components/ui/`/`common/` cho phần dùng chung.
- `store/` — Zustand, một file một domain.
- `lib/` — client Axios gọi backend (`api.ts`), tiện ích thuần logic.
- `hooks/`, `types/`, `context/`, `config/`, `data/`, `styles/`, `i18n.ts`.

### 8. Quy ước đặt tên / coding convention quan sát được

- Backend: mỗi file gắn hậu tố domain — `<tên>.routes.ts` cho route, `<tên>.service.ts` cho service, tách nhỏ hơn khi domain quá lớn (`codeLab.ai.service.ts`, `codeLab.coach.service.ts`).
- Import ESM đầy đủ đuôi `.js` ngay cả khi source là `.ts` — bắt buộc vì `"type": "module"`.
- Cột Prisma dùng `camelCase` ở TypeScript nhưng map sang `snake_case` ở cột DB thật qua `@map("...")`.
- Comment giải thích "tại sao" (không chỉ "làm gì") ngay phía trên các quyết định dễ gây nhầm lẫn — quy ước xuyên suốt toàn repo.

## Ngăn xếp công nghệ

| Lớp | Công nghệ | Ghi chú |
|---|---|---|
| Frontend | Next.js 15 (App Router, `output: standalone`), TypeScript, TailwindCSS, Zustand, TanStack Query | 180 trang, 348 component, 27 Route Handler proxy |
| Backend | Node.js 22, Express, TypeScript, Zod + express-validator | 63 router, biên dịch bằng `tsc` |
| CSDL | PostgreSQL 16 (image `postgis/postgis:16-3.4`) qua Prisma ORM | 248 model, 95 migration, `migrate deploy` — không `db push` ở prod |
| Cache / hàng đợi nhẹ | Redis 7, `allkeys-lru`, AOF bật | Không BullMQ — hàng đợi embed là mảng in-process có chủ đích |
| Realtime | Socket.IO + `@socket.io/redis-adapter` | 7 module dùng realtime, còn lại REST/SSE/polling |
| Lưu trữ | Cloudflare R2 (S3-compatible) qua `@aws-sdk/client-s3` | Presigned PUT/GET, không multipart thật |
| Media pipeline | ffmpeg, sharp, `yt-dlp` | Loudness normalize 2-pass EBU R128 cho nhạc, transcode WebM→MP4 cho video mô phỏng |
| AI/LLM | Anthropic-compatible gateway, Groq, OpenRouter, `@xenova/transformers` (embedding local ONNX) | 3 stack song song, không có SDK Anthropic chính thức — gọi bằng `fetch` thô |
| Hạ tầng | Docker Compose (5 service), Nginx reverse proxy, Let's Encrypt, GitHub Actions (thủ công) | Deploy KHÔNG chạy tự động khi push — xem phần Hạ tầng |
| Đồ hoạ nâng cao | Canvas 2D (Xưởng mô phỏng), Web Worker sandbox (Algorithm Visualizer), Three.js WebGPU + TSL + Rapier WASM (Sân chơi 3D) | Ba engine khác nhau cho ba mục đích khác nhau, không dùng chung |

## Kiến trúc Backend — cách một request đi qua hệ thống

Express không "biết" gì về ứng dụng ngoài một danh sách hàm được gọi tuần tự — *middleware*. Mọi request HTTP chạy qua danh sách đó theo **đúng thứ tự đăng ký bằng `app.use()`**, từ trên xuống dưới. 90% lỗi kỳ lạ khi mới học Express ("sao middleware của tôi không chạy", "sao lỗi tôi throw ra không bị bắt") xuất phát từ việc đăng ký sai thứ tự.

### 1. Middleware stack — thứ tự thật trong `src/index.ts`

```ts
// 1. Trust Proxy (Cloudflare → Nginx → Express)
app.set('trust proxy', (ip, hop) => {
  if (!ip) return false;
  if (hop <= 1) return true;
  return false;
});

// 1b. Request ID (correlation)
app.use((req, res, next) => {
  const incoming = req.headers['x-request-id']?.trim();
  const id = incoming && incoming.length <= 64 ? incoming : nanoid(12);
  req.id = id;
  res.setHeader('X-Request-ID', id);
  next();
});

// 2. Security Headers
app.use(helmet({ ... }));

// 3. CORS
app.use(cors(corsOptions));

// 4. Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(config.cookieSecret));

// 5. Compression (gzip/brotli)
app.use(compression({ ... }));

// 6. HTTP Logging
app.use(morgan('combined', { ... }));

// 7. Static File Serving (chỉ development)
if (config.nodeEnv === 'development' || config.nodeEnv === 'test') {
  app.use('/uploads', express.static(uploadsDir, { ... }));
}

// 8. Rate Limiting
app.use('/api/', failOpen(generalLimiter));
app.use('/api/', sentryRequestMiddleware);

// 9. API Routes (63 router)
app.use('/api/v1/auth', failOpen(authLimiter), authRoutes);
app.use('/api/v1/profile', profileRoutes);
// ... 61 router còn lại ...

// 11. 404 Handler
app.use(notFoundHandler);

// 11b. Sentry Express Error Handler
setupSentryErrorHandler(app);

// 12. Global Error Handler
app.use(errorHandler);
```

Từng bước giải quyết một vấn đề cụ thể, và vị trí của nó **không ngẫu nhiên**:

- **Trust proxy phải là bước đầu tiên tuyệt đối.** Production chạy sau Cloudflare → Nginx → Express (hai lớp proxy). Không khai báo, `req.ip` trả về IP nội bộ của Nginx thay vì IP thật — rate-limit gộp tất cả người dùng vào chung một bucket.
- **CORS phải đứng trước body parser** — trình duyệt gửi preflight `OPTIONS` trước request thật, CORS middleware cần trả lời preflight đó trước khi Express cố parse một body có thể không tồn tại.
- **Body parser phải đứng trước mọi route** — route chạy trước khi `express.json()` đăng ký thì `req.body` luôn `undefined`.
- **Rate limiter đứng ngay trước routes** — là "cổng chặn" trước khi request chạm logic nghiệp vụ.
- **404 handler đứng sau tất cả router** — nó chỉ là middleware bắt "không route nào khớp".
- **`errorHandler` bắt buộc là middleware CUỐI CÙNG.** Express nhận diện một hàm là error-handling middleware bằng cách đếm **số tham số** — 4 tham số `(err, req, res, next)` thay vì 3. Bất kỳ route/middleware nào gọi `next(error)` khiến Express nhảy qua mọi middleware thường ở giữa để tìm error middleware gần nhất phía sau. Đặt `errorHandler` ở đầu file, nó sẽ không bắt được lỗi từ 63 router phía sau — vì lúc nó chạy, các router đó chưa được đăng ký.

`setupSentryErrorHandler(app)` đứng giữa 404 handler và `errorHandler` — cũng là error middleware 4 tham số, chỉ gửi lỗi lên Sentry rồi gọi `next(err)` đẩy tiếp — bằng chứng Express cho phép **nhiều error middleware nối tiếp**, mỗi cái xử lý một phần rồi chuyền tiếp.

### 2. Một request đi trọn vòng: `POST /api/v1/pro/redeem`

Đi theo một request thật: người dùng nhập mã kích hoạt Pro rồi bấm gửi.

**Bước 1 — Route nhận request, validate sơ bộ.** `src/routes/pro.routes.ts`:

```ts
import * as pro from '../services/pro.service.js';

const router = Router();
router.use(authenticate);

router.post('/redeem', async (req, res, next) => {
  try {
    const data = await pro.redeemProCode(req.userId!, String(req.body?.code ?? ''));
    res.json({ success: true, data });
  } catch (err) { next(err); }
});
```

Chú ý hai điều: (1) `router.use(authenticate)` áp dụng cho **toàn bộ router** — bất kỳ route nào khai báo sau đó tự động yêu cầu đăng nhập, không cần lặp lại; (2) route handler **không tự viết logic nghiệp vụ** — chỉ lấy dữ liệu từ request, gọi service, trả response. Toàn bộ "não" nằm ở service.

**Bước 2 — Service thực thi nghiệp vụ, chạm Prisma.** `src/services/pro.service.ts`, hàm `redeemProCode`:

```ts
export async function redeemProCode(userId: number, rawCode: string): Promise<ProStatus> {
  const code = (rawCode || '').trim().toUpperCase();
  if (!code) throw new BadRequestError('Vui lòng nhập mã Pro');

  const pc = await prisma.proCode.findUnique({ where: { code } });
  if (!pc || !pc.isActive) throw new BadRequestError('Mã không hợp lệ hoặc đã bị khoá');
  if (pc.expiresAt && pc.expiresAt < new Date()) throw new BadRequestError('Mã đã hết hạn');
  if (pc.usedCount >= pc.maxUses) throw new BadRequestError('Mã đã hết lượt sử dụng');

  const already = await prisma.proRedemption.findUnique({
    where: { uk_pro_redemption: { proCodeId: pc.id, userId } },
  });
  if (already) throw new BadRequestError('Bạn đã sử dụng mã này rồi');

  await prisma.$transaction(async (tx) => {
    await tx.proRedemption.create({ data: { proCodeId: pc.id, userId, grantedDays: pc.durationDays } });
    await tx.proCode.update({ where: { id: pc.id }, data: { usedCount: { increment: 1 } } });
  });

  return grantProToUser(userId, pc.durationDays, 'CODE');
}
```

Năm điều kiện kiểm tra liên tiếp, mỗi cái `throw` ngay khi phát hiện sai — kiểu code "fail fast": không `if/else` lồng nhau, cứ sai là ném lỗi và dừng lại ngay dòng đó. `prisma.$transaction(...)` đảm bảo tạo `proRedemption` và tăng `usedCount` xảy ra **cùng lúc hoặc không xảy ra gì cả** — nếu tách rời, mã có thể bị dùng vượt `maxUses` khi bước tăng count thất bại giữa chừng.

**Bước 3 — Lỗi bay ngược lên đâu?** Khi `redeemProCode` throw `BadRequestError`, Promise bị reject. Trong route, `await` nằm trong `try`, JavaScript nhảy vào `catch (err) { next(err); }`. `next(err)` **có tham số** là tín hiệu cho Express: "đây không phải middleware tiếp theo bình thường, hãy tìm error handler". Express bỏ qua mọi middleware thường còn lại, nhảy thẳng tới `errorHandler` toàn cục ở cuối `src/index.ts`.

### 3. Xử lý lỗi tập trung: `AppError` và `errorHandler`

Thay vì mỗi route tự viết `res.status(400).json(...)` theo ý riêng — 63 router sẽ ra 63 kiểu format lỗi khác nhau — dự án định nghĩa một class lỗi chuẩn:

```ts
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string,
    public data?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string, code?: string) { super(message, 400, code); }
}
export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') { super(message, 401, 'UNAUTHORIZED'); }
}
export class ForbiddenError extends AppError {
  constructor(message = 'Access denied') { super(message, 403, 'FORBIDDEN'); }
}
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') { super(message, 404, 'NOT_FOUND'); }
}
```

`AppError` là lỗi "có chủ đích" — biết trước status code (400/401/403/404/409...) và một `code` ngắn để frontend rẽ nhánh xử lý. `errorHandler` — middleware 4 tham số cuối chuỗi — xử lý khác nhau tuỳ loại lỗi:

```ts
export function errorHandler(err, req, res, _next) {
  logger.error('Express error handler', { error: err.message, stack: err.stack });

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Map lỗi Prisma (mã Pxxxx) sang 4xx an toàn, tránh lộ tên bảng/cột
  if (!err.statusCode && typeof err.code === 'string' && /^P\d{4}$/.test(err.code)) {
    if (err.code === 'P2002') { statusCode = 409; message = 'Giá trị đã tồn tại'; }
    else if (err.code === 'P2025') { statusCode = 404; message = 'Không tìm thấy dữ liệu'; }
    else { statusCode = 400; message = 'Yêu cầu không hợp lệ'; }
  }

  // SECURITY: không bao giờ lộ chi tiết lỗi nội bộ ra ngoài với lỗi 5xx
  if (statusCode >= 500) message = 'Internal Server Error';
  if (statusCode >= 500) captureException(err, { url: req.originalUrl, method: req.method, statusCode });

  res.status(statusCode).json({
    success: false, message, code: err.code,
    ...(err.data ? { data: err.data } : {}),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}
```

Nếu `err` là `AppError`, `statusCode` đã có sẵn — `errorHandler` trả nguyên `message` về client vì nó được viết ra để người dùng đọc được (ví dụ "Mã đã hết hạn"). Nếu `err` không có `statusCode` — lỗi bất ngờ — `statusCode` mặc định 500, và **message thật bị thay bằng "Internal Server Error"** trước khi gửi cho client; message gốc chỉ vào `logger.error` và Sentry, không bao giờ lộ ra response. Lỗi Prisma thô (`P2002`, `P2025`...) được bắt và ánh xạ thành 4xx trước khi rơi vào nhánh 500.

### 4. Phân quyền: `authenticate` vs `requireRole` vs `requireAdmin`

**`authenticate`** — chỉ kiểm tra "đã đăng nhập chưa", không quan tâm vai trò:

```ts
export async function authenticate(req, _res, next) {
  try {
    const token = extractToken(req);
    if (!token) throw new UnauthorizedError('No authentication token provided');

    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    req.userId = decoded.userId;

    const dbUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { enabled: true, accountNonLocked: true },
    });
    if (!dbUser) throw new UnauthorizedError('User not found');
    if (!dbUser.enabled) throw new ForbiddenError('Account is disabled');
    if (!dbUser.accountNonLocked) throw new ForbiddenError('Account is locked');

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) next(new UnauthorizedError('Token has expired'));
    else if (error instanceof jwt.JsonWebTokenError) next(new UnauthorizedError('Invalid token'));
    else next(error);
  }
}
```

`authenticate` không chỉ giải mã JWT rồi tin luôn — nó **query lại database mỗi request** để kiểm `enabled`/`accountNonLocked`. Lý do: token cookie sống 7 ngày; nếu admin khoá một tài khoản, JWT cũ vẫn "hợp lệ về chữ ký" tới khi hết hạn — không tái kiểm DB, tài khoản bị khoá vẫn gọi API bình thường suốt 7 ngày.

**`requireRole(...roles)`** — dùng khi route được truy cập bởi nhiều vai trò khác nhau, tự tra lại role từ DB và chuẩn hoá tên (`toUpperCase().replace('ROLE_', '')`) trước khi so khớp.

**`requireAdmin(role = 'ROLE_ADMIN')`** — chuyên biệt hoá cho admin, tự giải mã token từ đầu (không giả định `authenticate` đã chạy trước), nên có thể đứng một mình.

Quy tắc chọn: route công khai → không middleware; cần đăng nhập nhưng không phân biệt vai trò → `authenticate`; nhóm vai trò không phải admin → `requireRole(...)`; quản trị hệ thống → `requireAdmin()`. Còn có `optionalAuth` — giải mã token nếu có nhưng không throw nếu thiếu — dùng cho route công khai muốn cá nhân hoá nếu đã đăng nhập.

`extractToken` thử **bốn nguồn theo thứ tự**: header `Authorization: Bearer`, cookie `backend_token`, query `?token=` (SSE), và tự parse header `Cookie` thô (bắt tay Socket.IO, khi `cookie-parser` chưa kịp chạy).

### 5. Validate input: `express-validator` vs Zod

**`express-validator`** — khai báo rule ngay trong mảng middleware, dùng với middleware `validate`:

```ts
export function validate(req, _res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => `${e.path}: ${e.msg}`);
    return next({ message: messages.join(', '), statusCode: 422, code: 'VALIDATION_ERROR' });
  }
  next();
}
```

```ts
router.post('/login', softCaptchaMiddleware,
  [body('username').notEmpty(), body('password').notEmpty()],
  validate,
  async (req, res, next) => { ... },
);
```

Chú ý object truyền vào `next({...})` không phải instance `AppError`, chỉ là object thường có `statusCode`/`code`. `errorHandler` không quan tâm class thực sự — nó đọc field `statusCode`/`message`/`code` trên object lỗi (duck typing), nên cả hai đều xử lý đúng.

**Zod** — dùng ở route mới hơn, khai báo schema riêng rồi `.safeParse()` ngay trong handler:

```ts
const scoreSchema = z.object({
  score: z.number().int().min(0).max(10_000_000),
  duration: z.number().int().min(0).max(86_400).optional().nullable(),
});
publicRouter.post('/:id/score', playLimiter, optionalAuth, async (req, res, next) => {
  try {
    const parsed = scoreSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError('Dữ liệu điểm không hợp lệ', 400, 'INVALID_SCORE');
    const data = await svc.submitScore({ ...parsed.data, gameId: intParam(req.params.id) });
    res.status(201).json({ success: true, data });
  } catch (e) { next(e); }
});
```

`express-validator` phù hợp form đơn giản (login, register). Zod tự sinh **type an toàn lúc biên dịch**, hữu ích hơn khi payload lồng nhau nhiều tầng. Dự án không "chọn một, bỏ một" — code cũ giữ nguyên vì đã ổn định, module mới dùng Zod vì lợi ích type-safety.

### 6. Quy ước tổ chức file: `*.routes.ts`, `*.service.ts`, `*.types.ts`

- **`*.routes.ts`** — định nghĩa endpoint, gắn middleware phân quyền/validate, **gọi service**. Không nên chứa logic nghiệp vụ phức tạp.
- **`*.service.ts`** — hàm `export async function` thuần logic nghiệp vụ, query/mutate Prisma, và **là nơi duy nhất được phép `throw new AppError(...)`**. Không biết gì về `req`/`res` — chỉ nhận tham số thuần và trả dữ liệu thuần, gọi lại được từ nhiều route hoặc cron job.
- Route đơn giản, chỉ đọc dữ liệu tĩnh không nghiệp vụ đáng kể (ví dụ `skill.routes.ts`) — gọi Prisma trực tiếp cũng chấp nhận được. Ranh giới tách service phụ thuộc **độ phức tạp nghiệp vụ**, không phải quy tắc cứng.
- **`*.types.ts`** — chỉ xuất hiện khi một domain có nhiều interface/type dùng chung giữa route và service, tránh định nghĩa trùng hoặc lệch.

Tổng kết luồng: **request → middleware stack (bảo mật, rate-limit, log) → router khớp theo prefix → middleware phân quyền/validate → service xử lý nghiệp vụ + Prisma → `res.json(...)` nếu thành công, hoặc `next(err)` nhảy thẳng tới `errorHandler` toàn cục.** Học thuộc một luồng là đọc hiểu được toàn bộ 63 router còn lại.

## Kiến trúc Database — tổ chức 248 model không vỡ

Repo có một file duy nhất `prisma/schema.prisma`, dài 6.980 dòng, khai báo 248 model. Nếu không có chiến lược đọc, đây chỉ là một bức tường chữ. Nhưng nó được tổ chức thành khoảng 30 "chương sách" xếp cạnh nhau, mỗi chương tự đứng độc lập.

### Bước 1: tìm "mục lục" bằng comment, không phải bằng mắt

Prisma không có khái niệm namespace/module trong ngôn ngữ schema — mọi model nằm phẳng trong cùng file. Cách duy nhất để chia 7.000 dòng thành các phần có ý nghĩa là **comment quy ước**:

```prisma
// ============================================================
// 6. COURSE MODULE (Education / LMS)
// ============================================================
```

```bash
grep -n "^// ====" prisma/schema.prisma
```

lệnh này liệt kê toàn bộ vị trí khung comment — "mục lục" của file mà không cần đọc hết 6.980 dòng. Đếm số model giữa hai khung liên tiếp, ta có bức tranh toàn cảnh: khối lớn nhất là MoneyFlow Phase 2 (41 model) và Music Post Phase 4 (25 model) — cả hai đều ghi "Phase X" trong tên, tức module không được thiết kế trọn vẹn từ đầu mà bồi đắp qua nhiều đợt, mỗi đợt cộng thêm object mới thay vì sửa lại object cũ. Đó chính là cách một schema 248 model tồn tại được: chia nhỏ theo thời gian.

Một chi tiết đáng nhớ: số thứ tự các khối **không liền mạch và không theo đúng thứ tự xuất hiện trong file** — khối "13. CONTACT FORM" nằm sau khối "14. SOCIAL FEED". Không phải lỗi: số được gán một lần khi module ra đời, vị trí trong file là chỗ Prisma cho phép chèn tại thời điểm code được viết. Bài học: **đừng dựa vào thứ tự để suy ra quan hệ phụ thuộc giữa các module.**

### Bước 2: ba kiểu quan hệ lặp lại 248 lần — chỉ cần hiểu một lần

**Quan hệ 1-nhiều đơn giản.** Một `Project` có nhiều `ProjectMilestone`:

```prisma
model Project {
  id ...
  milestones ProjectMilestone[]
}

model ProjectMilestone {
  id        Int @id @default(autoincrement())
  projectId Int @map("project_id")
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  @@index([projectId, order], name: "idx_project_milestones_project_order")
}
```

Khuôn mẫu luôn giống nhau: bên "nhiều" giữ khoá ngoại + field trỏ ngược; bên "một" chỉ khai báo mảng — Prisma tự suy ra quan hệ 1-n từ việc một bên có mảng, một bên có scalar FK.

**Quan hệ nhiều-nhiều qua bảng trung gian.** Prisma hỗ trợ nhiều-nhiều "ngầm", nhưng schema này chọn cách **tường minh** — vì nó cho phép thêm cột phụ sau này mà không phải đổi kiểu quan hệ:

```prisma
model UserRole {
  userId Int
  roleId Int
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  role Role @relation(fields: [roleId], references: [id], onDelete: Cascade)
  @@id([userId, roleId], map: "pk_user_roles")
}
```

`UserRole` không có cột `id` riêng — khoá chính là cặp `(userId, roleId)`, mẫu chuẩn cho bảng nối thuần: nó chỉ tồn tại để nói "user X có role Y", cặp đó tự nhiên là duy nhất và cũng là khoá chính.

**`@relation("TênRiêng")` — khi một model có nhiều đường tới cùng một bảng.** `MessageThread` trỏ tới `User` tới **4 lần khác nhau**:

```prisma
model MessageThread {
  userId      Int? @map("user_id")
  adminUserId Int? @map("admin_user_id")
  userAId     Int? @map("user_a_id")
  userBId     Int? @map("user_b_id")

  user      User? @relation("ThreadAsUser",  fields: [userId],      references: [id], onDelete: Cascade)
  adminUser User? @relation("ThreadAsAdmin", fields: [adminUserId], references: [id], onDelete: Cascade)
  userA     User? @relation("ThreadUserA",   fields: [userAId],     references: [id], onDelete: Cascade)
  userB     User? @relation("ThreadUserB",   fields: [userBId],     references: [id], onDelete: Cascade)
}
```

Bỏ tên trong ngoặc, Prisma báo lỗi ngay khi `generate` vì không biết field nào của `MessageThread` khớp back-relation nào bên `User` — bốn quan hệ đều trỏ cùng bảng nên mơ hồ. Đặt tên riêng là cách nói với Prisma: "đây là 4 con đường độc lập, đừng gộp lại". Quy tắc nhớ: **tên trong `@relation("...")` chỉ là sợi chỉ buộc hai đầu quan hệ — không xuất hiện trong database, không phải tên cột.**

### Bước 3: nén 3 bảng thành 1 — "compact schema pattern" qua `ProjectListItem`

Trước khi có `ProjectListItem`, mỗi dự án cần hiển thị 3 danh sách độc lập: "Core Knowledge", "Portfolio Bonus", "Completion Outcome". Cách "hiển nhiên" là tạo 3 bảng giống hệt nhau. Thay vào đó, schema chọn **một bảng + một cột enum để phân loại**:

```prisma
enum ProjectListKind { CORE_KNOWLEDGE PORTFOLIO_BONUS COMPLETION_OUTCOME }

model ProjectListItem {
  id        Int             @id @default(autoincrement())
  projectId Int             @map("project_id")
  kind      ProjectListKind
  content   String          @db.VarChar(500)
  order     Int             @default(0)
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  @@index([projectId, kind, order], name: "idx_project_list_items_project_kind_order")
}
```

Lý do chọn 1 bảng có hai lớp lợi ích: **tầng schema** — 3 bảng giống hệt nhau là dấu hiệu trùng lặp, mỗi lần thêm cột mới phải sửa 3 nơi, dễ tạo lệch pha; **tầng API/service** — 3 bảng riêng cần 3 cặp route CRUD gần như giống hệt nhau, gộp lại chỉ cần một service, một bộ route nhận thêm tham số `kind`. Nguyên tắc chung: **nếu N bảng có cấu trúc giống hệt nhau và chỉ khác ở "loại", hãy cân nhắc gộp bằng một cột enum** thay vì nhân bản struct.

### Bước 4: bẫy `@@unique(name: "...")` — tên khoá tuỳ chỉnh phải dùng đúng tên

Mặc định, `@@unique([subjectId, recipientId])` không đặt tên sinh ra khoá compound `subjectId_recipientId`. Nhưng model `NoteSubjectShare` đặt **tên tuỳ chỉnh**:

```prisma
model NoteSubjectShare {
  subjectId   Int @map("subject_id")
  recipientId Int @map("recipient_id")
  @@unique([subjectId, recipientId], name: "uk_note_subject_share")
}
```

Vì có `name`, cái tên mặc định `subjectId_recipientId` **không còn tồn tại** — query đúng phải là:

```typescript
// Sai:   where: { subjectId_recipientId: { subjectId, recipientId } }
// Đúng:  where: { uk_note_subject_share: { subjectId, recipientId } }
```

Đây là lỗi thật đã xảy ra trong dự án (ghi lại trong `CLAUDE.md`, 2026-06-29). Bài học: **hễ thấy `@@unique(..., name: "...")`, phải tra đúng chuỗi trong ngoặc kép khi viết `where`, tuyệt đối không suy đoán theo quy tắc mặc định `field1_field2`.**

### Bước 5: `migrate dev` khi code, `migrate deploy` khi production — vì sao không bao giờ `db push`

- **`prisma migrate dev --name <tên>`** — dùng khi code cục bộ. So sánh schema với lịch sử migration, sinh file `.sql` mới trong `prisma/migrations/`, áp vào DB dev, chạy lại `generate`. Vì tạo file lịch sử, ai đó (hoặc CI) sau này replay đúng thứ tự để dựng lại DB từ đầu.
- **`prisma migrate deploy`** — dùng trên production/CI. **Chỉ áp dụng** các file `.sql` có sẵn mà DB đích chưa chạy qua, theo đúng thứ tự timestamp. Không tự sinh migration, không hỏi tương tác — an toàn để chạy tự động trong pipeline.
- **`prisma db push`** — đồng bộ schema thẳng vào DB **không qua file migration nào**. `CLAUDE.md` của dự án ghi rõ: "NEVER run `npx prisma db push` against production" — dùng lệnh này trên production, DB đổi cấu trúc nhưng không có file `.sql` ghi lại; lần deploy tiếp theo chạy `migrate deploy` sẽ thấy lịch sử migration và DB thực tế lệch nhau (schema drift), dẫn thẳng tới lỗi `P3009` — sự cố CLAUDE.md liệt kê đã từng xảy ra thật.

`db push` chỉ hợp lý cho một use-case: prototype nhanh trên DB tạm không ai khác dùng, sẵn sàng bị xoá — không bao giờ dùng cho DB có dữ liệu thật.

### Bước 6: đọc một migration file thật

`prisma/migrations/` chứa 95 thư mục con, tên theo mẫu `<timestamp>_<tên_mô_tả>` (ví dụ `20260624000000_add_project_list_items_and_milestone_code/`). Timestamp dạng `YYYYMMDDHHMMSS` quyết định thứ tự áp dụng tuyệt đối, không phụ thuộc git log. Nội dung file `.sql` cho thấy Prisma dịch model tường minh sang SQL thuần:

```sql
CREATE TYPE "ProjectListKind" AS ENUM ('CORE_KNOWLEDGE', 'PORTFOLIO_BONUS', 'COMPLETION_OUTCOME');

CREATE TABLE "project_list_items" (
 "id" SERIAL NOT NULL,
 "project_id" INTEGER NOT NULL,
 "kind" "ProjectListKind" NOT NULL,
 "content" VARCHAR(500) NOT NULL,
 "order" INTEGER NOT NULL DEFAULT 0,
 CONSTRAINT "project_list_items_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_project_list_items_project_kind_order"
 ON "project_list_items"("project_id", "kind", "order");

ALTER TABLE "project_list_items"
 ADD CONSTRAINT "project_list_items_project_id_fkey"
 FOREIGN KEY ("project_id") REFERENCES "projects"("id")
 ON DELETE CASCADE ON UPDATE CASCADE;
```

`enum ProjectListKind` trở thành `CREATE TYPE ... AS ENUM` thật trong Postgres — không phải chuỗi kiểm tra ở tầng ứng dụng. `@map("project_id")` là lý do cột SQL tên `project_id` (snake_case) trong khi field Prisma tên `projectId` (camelCase) — quy ước xuyên suốt 248 model. `onDelete: Cascade` dịch thành `ON DELETE CASCADE` — xoá một `Project` tự động xoá mọi `ProjectListItem` con, không cần code tầng ứng dụng dọn dẹp thủ công. 95 file xếp theo timestamp chính là cuốn nhật ký đầy đủ, replay lại được, của toàn bộ quá trình 248 model được xây dựng dần theo thời gian.

## Kiến trúc Frontend — tổ chức 180 trang và quản lý state

Với 180 trang và 348 component, không có quy tắc tổ chức rõ ràng thì chỉ sau vài tháng không ai còn biết "component này ở đâu", "state này ai giữ", "gọi API này qua đường nào".

### Bản đồ thư mục `src/`

```
app/        → routing (mỗi thư mục con = một route)
components/ → UI, chia theo DOMAIN nghiệp vụ
store/      → Zustand — state phía client, sống lâu
lib/        → api client, hàm tiện ích, cấu hình
hooks/      → custom hook dùng chung (nhiều hook bọc TanStack Query)
types/      → định nghĩa TypeScript dùng xuyên suốt
context/    → React Context (ví dụ ThemeContext)
```

### `app/` — routing bằng cấu trúc thư mục

Next.js App Router không có file "routes.js" liệt kê danh sách route. Một thư mục trong `app/` **chính là một URL**: `src/app/roadmap/page.tsx` → `/roadmap`. 180 trang chính là 180 file `page.tsx` rải trong khoảng 40 thư mục cấp 1. Không cần đọc file cấu hình nào để biết `/exam` render gì — mở `src/app/exam/page.tsx` là ra ngay. Ngoài `page.tsx`, `app/` còn có `layout.tsx` (khung bao quanh dùng chung), `loading.tsx` (màn chờ tự động), `error.tsx` (bắt lỗi runtime) — quy ước có sẵn của framework.

### `components/` — chia theo domain, không chia theo loại

Đây là quyết định kiến trúc quan trọng nhất của tầng UI. Có hai cách chia phổ biến: theo **loại** (`buttons/`, `modals/`, `cards/`) — dễ tưởng tượng lúc mới học nhưng khó mở rộng, vì một tính năng sẽ có card ở `cards/`, modal ở `modals/`, form ở `forms/`; hoặc theo **domain nghiệp vụ** — mỗi tính năng có một thư mục riêng chứa mọi component của nó. Dự án chọn cách hai: `components/academy/, admin/, algorithms/, chat/, code-lab/, course/, cv/, exp-hub/, finance/, games/, language/, messaging/, music/, notes/, profile/, projects/, roadmap/, shop/, simulation/, social/...` — mỗi thư mục ứng với một mảng tính năng lớn. Chỉ `components/ui/` và `components/common/` là ngoại lệ hợp lý cho phần dùng chung thật sự. Bài học: **khi thấy một dự án lớn, nhìn cách nó chia thư mục component trước tiên** — nó tiết lộ ngay tư duy tổ chức là "tính năng" hay "loại UI".

### Server Component vs Client Component — ranh giới quan trọng nhất của App Router

Mặc định, **mọi component trong `app/` là Server Component** — chạy trên server, không có state, không `onClick`, không dùng `useState`/`useEffect`. Muốn chạy trong trình duyệt (có tương tác), phải khai báo `'use client'` ở dòng đầu file.

`src/app/roadmap/page.tsx` — Server Component thuần, chỉ khai báo `metadata` (SEO — nằm sẵn trong HTML gửi về) rồi giao việc cho `RoadmapLanding`:

```tsx
import type { Metadata } from 'next';
import RoadmapLanding from '@/components/roadmap/RoadmapLanding';

export const metadata: Metadata = { title: 'RoadMap — Learning paths by role & skill', ... };
export default function RoadmapPage() { return <RoadmapLanding />; }
```

`src/app/about/page.tsx` ngược lại — `'use client'` ngay dòng 1 vì cần `useState`, `useEffect`, animation, ô tìm kiếm gõ chữ tự động — toàn bộ là hành vi phía trình duyệt.

Quy tắc chọn: trang chỉ hiển thị dữ liệu, không cần bấm/gõ/state → Server Component (nhanh hơn, SEO tốt hơn, bundle nhỏ hơn). Trang cần tương tác → bắt buộc `'use client'`. Cách dung hoà phổ biến trong dự án: `page.tsx` giữ Server Component để có `metadata`, rồi import một component con đã đánh dấu `'use client'` cho phần tương tác.

### Quản lý state — ba tầng, ba công cụ, ba mục đích khác nhau

- **`useState` cục bộ** — dữ liệu chỉ một component cần (ô input đang gõ, modal đang mở/đóng).
- **Zustand (`store/`)** — dữ liệu client cần **sống lâu, dùng ở nhiều component không họ hàng**, không nhất thiết từ server (giỏ hàng, theme, trạng thái đang nghe nhạc).
- **TanStack Query (`hooks/`)** — dữ liệu **đến từ server**, cần cache, tự refetch, tự đồng bộ giữa nhiều nơi hiển thị cùng dữ liệu.

Nói ngắn: **Zustand trả lời "trình duyệt đang ở trạng thái nào" — TanStack Query trả lời "server đang có dữ liệu gì".** Chúng không thay thế nhau; dự án dùng cả hai song song.

Đọc `projectStore.ts`:

```ts
'use client';
export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: SEED_PROJECTS,
      setProjects: (projects) => set({ projects }),
      getProjectBySlug: (slug) => get().projects.find((p) => p.slug === slug),
    }),
    { name: 'projects-storage', storage: createJSONStorage(() => ssrSafeStorage), partialize: (s) => ({ projects: s.projects }) }
  )
);
```

Ba điều đáng học: (1) `create<ProjectState>()` **không cần Provider** — khác React Context, một store Zustand là hook dùng thẳng ở bất kỳ component nào; (2) middleware `persist` tự lưu state xuống `localStorage` (qua `ssrSafeStorage` — wrapper an toàn vì server không có `window`) và tự nạp lại khi tải trang; (3) `get()` cho phép đọc state hiện tại bên trong action, logic đọc+ghi nằm gọn trong định nghĩa store.

TanStack Query ngược lại **không tự giữ state** — nó hỏi server rồi cache câu trả lời:

```ts
export const socialKeys = { feed: (params) => ['social', 'feed', params ?? {}] };
// useQuery({ queryKey: socialKeys.feed(params), queryFn: ..., staleTime: 30_000 })
```

`queryKey` là "địa chỉ cache" — hai component ở hai nơi khác nhau cùng gọi với cùng `queryKey`, TanStack Query chỉ gọi API một lần và chia sẻ kết quả. `lib/queryClient.ts` còn cho phép Zustand chủ động gọi `queryClient.invalidateQueries(...)` khi cần — hai công cụ phối hợp thay vì tách biệt tuyệt đối.

### `lib/api.ts` — một cổng duy nhất ra backend

Toàn bộ 180 trang gọi API qua đúng một file (hơn 4.000 dòng, chia theo domain: `authApi`, `projectsApi`, `coursesApi`...):

```ts
const api = axios.create({ baseURL: '/api/v1', withCredentials: true });
```

`baseURL` là route proxy nội bộ của Next.js, không gọi thẳng domain backend — tránh CORS, giữ cookie httpOnly an toàn ở server. Axios có một **interceptor tự refresh phiên đăng nhập khi gặp 401**: cookie sống 7 ngày nhưng token bên trong chỉ sống ~24 giờ, nên gặp 401 đầu tiên, interceptor tự gọi `/api/auth/refresh` một lần rồi gửi lại request cũ — người dùng không bị "văng ra" giữa phiên làm việc dài.

### `next.config.js` — vì sao có `output: 'standalone'`

`standalone` đóng gói ứng dụng thành một thư mục tối giản, tự chứa (chỉ code đã build + đúng `node_modules` cần dùng runtime). Vì hệ thống deploy bằng Docker — không có `standalone`, ảnh Docker phải copy cả `node_modules` gốc (vài trăm MB không cần thiết). Với `standalone`, Dockerfile chỉ cần `COPY .next/standalone` là chạy được bằng `node server.js`, không cần `npm install` lại trong container production.

### Hệ thống theme sáng/tối — chỉ là một class trên thẻ `html`

```ts
function applyThemeToDOM(t) {
  const html = document.documentElement;
  if (t === 'dark') { html.classList.remove('light'); html.classList.add('theme-dark'); }
  else { html.classList.remove('theme-dark'); html.classList.add('light'); }
}
```

Class dùng cho dark mode toàn site là `theme-dark`, **không phải** `dark` mặc định của Tailwind. Lý do: trang Notes có hệ theme riêng (sáng/tối/nâu) dùng đúng class `.dark` chuẩn Tailwind cho một vùng DOM con. Nếu theme toàn site cũng dùng `.dark` trên `html`, mọi tiện ích `dark:` trong Notes sẽ bị kích hoạt nhầm, phá vỡ theme riêng của nó. Bài học tổng quát: **khi một hệ thống lớn có nhiều "vùng" cần theme độc lập, đừng dùng chung đúng một quy ước class của thư viện UI** — tách tên riêng cho theme toàn cục.

### Tổng kết: một trang mới đi qua đường nào

Tạo thư mục trong `app/` → viết `page.tsx` mỏng chỉ khai `metadata` và import component chính → trong `components/<domain>/`, tạo component con, quyết định `'use client'` dựa trên việc có tương tác hay không → dữ liệu từ server lấy qua hook TanStack Query mới, gọi vào hàm mới thêm trong `lib/api.ts` → nếu có trạng thái UI cần dùng ở nhiều nơi và sống lâu hơn một component, mới cân nhắc thêm store Zustand. Chia việc rõ theo domain và theo bản chất dữ liệu (UI-state hay server-state) là thứ giúp 180 trang vẫn mở/sửa được mà không phải đoán mò.

## Bản đồ tính năng

46 module tính năng, phân theo 6 nhóm. Bảng dưới chỉ liệt kê những gì thực sự tồn tại trong route và code — một vài module tưởng như hiển nhiên hoá ra không như tên gọi. Cơ chế hoạt động chi tiết của các module lõi được trình bày sâu ở mục "Cơ chế hoạt động" ngay bên dưới bản đồ này.

### Mạng xã hội & giao tiếp

| Module | Route | Model chính | Điểm kỹ thuật |
|---|---|---|---|
| Feed | `/feed`, `/feed/video` | `SocialPost`, `SocialComment`, `SocialPoll` | Reel dọc kiểu TikTok: một `IntersectionObserver` duy nhất, chỉ slide đang active mount `<video>` thật — một decoder tại một thời điểm |
| Messenger | `/messages` | `MessageThread`, `Message`, `MessageReaction` | Clone Messenger đủ 3 cột, nickname/mute/archive/block/report, store quản lý state 1.642 dòng |
| Friends & Presence | `/friends` | `Friendship`, `Follow` | Chấm "đang hoạt động" nhắm đúng tập bạn bè ∪ peer thread, không `io.emit` toàn cục |
| Thông báo admin | `/forum`, `/forum/[id]` | `Announcement` | **Không phải diễn đàn người dùng** — bảng tin do admin đăng, 4 loại badge |
| Story | *chưa gắn route* | `Story`, `StoryView`, `StoryHighlight` | Backend 13 endpoint + component 623 dòng đã viết xong, nhưng chưa nơi nào import — nằm trong hạng mục "chưa xong" bên dưới |

### Học tập (lõi sản phẩm)

| Module | Route | Model chính | Điểm kỹ thuật |
|---|---|---|---|
| Academy FPTU | `/academy` | `Semester`, `Course`, `Assignment` | 50 môn học, chỉ 1 trang thật — 2 trang còn lại `redirect()` sang `/courses` |
| Courses (CuongThai) | `/courses/[slug]/learn` | `Course`, `Lesson`, `Enrollment` | Giáo trình tự soạn (vd. Node.js 18 chương), video liên kết trực tiếp tới kịch bản mô phỏng |
| Phòng thi | `/exam`, `/exam/attempt/[id]` | `Exam`, `ExamAttempt`, `ExamQuestionBookmark` | Chấm lai deterministic + AI — chi tiết ở mục riêng bên dưới |
| Code Lab | `/code-lab/[track]/[exercise]` | `CodeTrack`, `CodeExercise`, `CodeProgress` | **Không có sandbox chạy code thật** — xem "Nợ kỹ thuật" |
| My Language | `/language/[code]/*` | `Language`, `LangVocabWord`, `LangHanziChar` | 19 trang con: kana, Hán tự, ngữ pháp, roleplay, dịch — SRS kiểu SM-2 |
| RoadMap | `/roadmap/[slug]` | `Roadmap`, `RoadmapNode` | 33 lộ trình, 1.286 node |
| Chứng chỉ | `/certificates/[number]` | `Certificate` | Tra cứu công khai theo mã |

### Công cụ nghề nghiệp

| Module | Route | Model chính | Điểm kỹ thuật |
|---|---|---|---|
| Interview Simulator | `/interview/session/[id]` | `InterviewSession`, `InterviewTurn`, `InterviewReport` | Lõi chấm **deterministic** (khớp từ khoá + fuzzy) chạy được khi tắt hẳn LLM; AI chỉ là tầng cộng thêm |
| CV Builder | `/cv/builder/[id]` | `CvProfile`, `CvBullet`, `CvDocument` | Rules-engine miễn phí chấm trước, AI critique có evidence-gating — không được bịa số liệu |
| Exp Hub (Snippets) | `/exp-hub/[slug]` | `Snippet`, `SnippetCategory` | Layout kiểu IDE, không phải cùng module với `/hub` (dễ nhầm tên) |
| Hub (bookmark/file) | `/hub` | `HubFolder`, `HubLink`, `HubFile` | Kanban dnd-kit, tự gợi ý tag bằng AI, scrape OG metadata |
| Notes | `/notes` | `NoteSubject`, `Note`, `NoteVocabEntry` | TipTap editor, flashcard, chia sẻ theo môn học |

### Trực quan hoá (điểm nhấn kỹ thuật)

| Module | Route | Engine | Vì sao chọn engine đó |
|---|---|---|---|
| Xưởng mô phỏng | `/simulation` | Canvas 2D deterministic, 1920×1080 | `captureStream()` chỉ tồn tại trên `<canvas>`/`<video>` — cần ghi video nên không thể dùng SVG |
| Algorithm Visualizer | `/algorithms` | SVG + DOM, code người dùng chạy trong Web Worker | Cách ly để `while(true)` của người dùng không treo tab — có timeout cứng |
| Sân chơi 3D | `/playground` (rewrite) | Three.js r0.183 WebGPU + TSL, Rapier3D WASM | Ứng dụng Vite độc lập, không gọi API nào của site |

### Media, tài chính, thương mại

| Module | Route | Điểm đáng chú ý |
|---|---|---|
| Finance/MoneyFlow | `/finance/*` (13 trang) | Song tệ VND/USD với tỷ giá do chính người dùng quản lý; lịch trả nợ 4 mô hình lãi suất, toàn bộ tính bằng `Prisma.Decimal` — không dùng số thực JS |
| Music | `/music`, `/remix` | Trình phát thật có MediaSession API (phát khi khoá màn hình); nhưng "DJ deck" ở `/remix` phần lớn là hiệu ứng thị giác — waveform là hash giả lập, không phân tích PCM thật |
| Shop/TMĐT | `/shop`, `/cart`, `/checkout` | Bán cả hàng số (pool key AVAILABLE→SOLD, không bao giờ trùng) lẫn vật lý; hai cổng thanh toán PayOS + VNPay, đối soát chủ động ngoài webhook |
| Pro | `/pro`, `/my-codes` | Không phải subscription — đổi mã kích hoạt, quota Redis sliding-window |
| Games | `/games/*` | 5 game chơi được thật (Snake, Memory, Math Blitz...), điểm số bị chặn (clamp) phía server chống gian lận |

### Admin (45 trang, 8 cụm chức năng)

Tổng quan & hệ thống · Nội dung & xuất bản · Quản lý học tập (7 trang) · Thương mại & thanh toán (7 trang) · Người dùng & kiểm duyệt · Vận hành AI (embed jobs, ai-analytics) · Analytics & SEO · 14 editor riêng theo module.

:::warning[Ba điều không như tên gọi]
Đây là chỗ đáng đọc kỹ nhất trong bản đồ tính năng, vì nó là bài học chung: **tên route không đảm bảo đúng những gì bên trong.**
- `/exp-hub` và `/hub` là **hai module hoàn toàn khác nhau** (Snippets kiểu IDE vs. bookmark/file cá nhân) — dễ nhầm khi đọc lướt tên.
- `Code Lab` không chấm bài bằng cách chạy test thật — badge "đã giải" chỉ là một `POST` cập nhật trạng thái, không có test harness nào đứng sau nó.
- `/academy` nhìn như module riêng nhưng chỉ có 1 trang thật; phần còn lại dùng chung engine với `/courses`.
:::

## Cơ chế hoạt động — đi sâu vào các module chính

Phần trên cho biết mỗi module *có gì*. Phần này giải thích chúng *hoạt động thế nào* — đủ chi tiết để tự dựng lại từng cái, cho 15 module lõi và đặc sắc nhất của nền tảng.

### Messenger (nhắn tin trực tiếp)

Messenger dùng chung một hệ thống cho hai loại hội thoại: chat hỗ trợ (user ↔ admin) và chat riêng (user ↔ user). Logic nằm ở `src/services/messages.service.ts` (lớp nghiệp vụ) và `src/socket/messaging.socket.ts` (lớp thời gian thực).

**Model dữ liệu chính.** `MessageThread` không có bảng "participant" riêng — nó tự phân nhánh theo cột `type`:

```prisma
model MessageThread {
  type          String    // 'ADMIN' hoặc 'USER'
  userId        Int?      // ADMIN-thread: user mở ticket
  adminUserId   Int?      // ADMIN-thread: admin được gán
  userAId       Int?      // USER-thread: id nhỏ hơn
  userBId       Int?      // USER-thread: id lớn hơn
  lastMessageAt DateTime?
  preferences   Json      // { [userId]: { pinnedAt?, mutedUntil?, archivedAt?, ... } }
}
```

Hai cặp cột dùng chung một bảng cho hai ngữ nghĩa khác nhau, thay vì tách bảng `ThreadParticipant`. Đánh đổi: mọi hàm phải if/else theo `type`, nhưng truy vấn "liệt kê thread của tôi" chỉ cần một `findMany` với `OR` thay vì join bảng phụ. Với USER-thread, hai id luôn được sắp `[a, b] = userId < peerId ? [userId, peerId] : [peerId, userId]` trước khi tạo — cách duy nhất để ràng buộc unique index ngăn tạo trùng thread cho cùng một cặp người dùng. `preferences` là cột JSONB keyed theo `userId`, nên pin/mute/archive/mark-unread/xoá-cho-riêng-mình là trạng thái *độc lập theo từng người xem* mà không cần thêm bảng.

`Message` mang `mediaUrl`/`mediaKind` (GIF/sticker dùng chung 2 cột), `parentMessageId` cho reply, và hai cờ soft-state khác ngữ nghĩa: `deletedAt` (xoá — ẩn với UI, giữ lại audit) và `recalledAt` (thu hồi trong 5 phút — nội dung bị xoá thật). `MessageReaction` có unique `(messageId, userId, emoji)` để một người chỉ thả một emoji một lần — cơ chế toggle dựa thẳng vào ràng buộc này.

**Luồng hoạt động: A gửi tin nhắn cho B.** (1) Client A gọi `POST /threads/:id/messages`. (2) `sendMessage` tải `thread`, gọi `assertParticipant` (kiểm `senderId` thực sự là một trong hai phía — chặn vì id thread là số nguyên tuần tự, đoán được), kiểm block hai chiều, validate độ dài/số file đính kèm, `prisma.message.create(...)`, cập nhật `lastMessageAt`, rồi `emitter.emit('thread:new-message', payload)`. (3) Emitter phát vào **hai nơi cùng lúc**: `io.to(thread:<id>)` và `io.to(user:<uid>)` cho từng participant — nếu chỉ phát vào room thread, một người ở sidebar nhưng chưa mở đúng cuộc trò chuyện sẽ không nhận được gì. (4) Khi kết nối, server tự động join B vào mọi room thread B tham gia — B đã sẵn sàng nhận ngay từ lúc connect, không cần thao tác gì thêm. (5) Khi B mở đúng thread, `markRead` upsert bảng `MessageRead`, phát `thread:read` — A thấy "đã xem".

```mermaid
sequenceDiagram
    participant A as Client A
    participant API as REST API (messages.service.ts)
    participant DB as PostgreSQL
    participant SIO as Socket.IO server
    participant B as Client B (đã đăng nhập, đã auto-join)

    A->>API: POST /threads/:id/messages { content }
    API->>DB: assertParticipant + kiểm tra block
    API->>DB: prisma.message.create(...)
    API->>DB: update messageThread.lastMessageAt
    API->>SIO: emitter.emit('thread:new-message', payload)
    SIO->>SIO: io.to(thread:id).emit(...) và io.to(user:A/B).emit(...)
    SIO-->>B: 'thread:new-message' (B đang ở cả 2 room)
    SIO-->>A: 'thread:new-message' (đồng bộ các tab khác của A)
    B->>API: (khi mở thread) POST /threads/:id/read
    API->>DB: upsert MessageRead
    API->>SIO: emit('thread:read', {readerId: B, readAt})
    SIO-->>A: 'thread:read' — UI hiện "đã xem"
```

**Điểm kỹ thuật đáng chú ý.** Room theo thread + room theo user, không `io.emit()` toàn cục — giới hạn phát tin cho đúng người liên quan, tránh mọi client phải tự lọc payload thô. Xác thực lại mỗi sự kiện, không chỉ lúc bắt tay — `thread:join` do client tự gửi (id đoán được) vẫn phải truy DB xem có phải participant không mới `socket.join`, nếu không một user đã đăng nhập có thể nghe lén tin nhắn người khác chỉ bằng đoán số id. `roleVersion` chống token cũ — đổi quyền/mật khẩu, token cũ bị từ chối dù còn hạn. `preferences` JSONB thay vì bảng riêng cho mỗi tính năng nhỏ — tốc độ phát triển nhanh, đổi lại phải tự viết migration nếu sau này cần index theo một slot cụ thể ở quy mô lớn.

### Feed & mạng xã hội

Nằm ở `src/services/social.service.ts` (2.262 dòng). Nguyên tắc cốt lõi: **feed không tự động đẩy bài viết mới vào giao diện** — server chỉ gửi một "tiếng chuông" báo có bài mới, client mới quyết định khi nào tải thật.

**Model dữ liệu chính.** `SocialPost` — `visibility` (PUBLIC/FRIENDS/PRIVATE, enforce hoàn toàn ở server), `type` (POST/VIDEO/FILE cho các tab trang chủ), cột đếm nhanh `viewCount`/`sharesCount` tránh `COUNT()` runtime. `SocialComment` hỗ trợ 2 cấp (`depth` 0/1) — chặn reply-vào-reply ngay ở tầng code để tránh đệ quy vô hạn khi render cây bình luận.

**Luồng hoạt động: A đăng bài, B (đang follow A) thấy "có bài mới".** (1) `createPost` ghi `SocialPost`, lọc bỏ URL kiểu `blob:`/`data:` (URL tạm trong trình duyệt của A — lưu vào DB thì người xem khác thấy hỏng vĩnh viễn). (2) Nếu bài không PRIVATE, gọi `pingFollowersAboutNewPost(...)` **không `await`** — chạy trong `setImmediate` để không làm chậm response trả về A. (3) Hàm này truy `Follow`, emit `feed:has-new` cho từng follower — **không kèm nội dung bài**, chỉ `{viewerId, count}`. (4) B (đã ở sẵn room `user:B` từ lúc connect) nhận `feed:has-new`, hiện banner "bài viết mới". (5) B bấm banner → `GET /social/posts?cursor=<id-cũ-nhất>` lấy đúng bài mới hơn. (6) `getFeed` enforce toàn bộ luật hiển thị: cursor theo `id` (không offset, tránh lệch trang khi có bài chen vào), lọc `visibilityWhere` tính từ `currentUserId` chứ không tin client.

```mermaid
sequenceDiagram
    participant A as Client A (tác giả)
    participant API as social.service.ts
    participant DB as PostgreSQL
    participant SIO as Socket.IO server
    participant B as Client B (follower, đang mở Feed)

    A->>API: POST /social/posts
    API->>DB: prisma.socialPost.create(...)
    API-->>A: 201 + post đã serialize (A thấy ngay, optimistic)
    API->>API: setImmediate(pingFollowersAboutNewPost) [không chờ]
    API->>DB: Follow.findMany({ followingId: A })
    API->>SIO: emit('feed:has-new', {viewerId: B, count: 1}) x N follower
    SIO-->>B: 'feed:has-new' — hiện banner "bài viết mới"
    B->>API: GET /social/posts?cursor=<lastSeenId> (khi B bấm banner)
    API->>DB: getFeed — lọc visibility + cursor + tab
    API-->>B: danh sách bài mới — chèn lên đầu feed
```

**Điểm kỹ thuật đáng chú ý.** Ping nhẹ, không đẩy dữ liệu — payload `feed:has-new` chỉ có `viewerId`/`count`, chi phí socket gần như hằng số bất kể bài có bao nhiêu ảnh/video, và tránh vấn đề "server push nội dung nhưng lúc client fetch lại thì bài đã bị sửa/xoá". Không tin `visibility` do client gửi khi lọc feed — từng là lỗ hổng thật (comment trong code: "it was the vector that let anonymous callers read everyone's PRIVATE posts") — bài học là mọi điều kiện lọc quyền riêng tư phải tính lại phía server. Cursor theo `id`, không theo `createdAt`/`offset` — vì `id` tăng đơn điệu, không đổi ngay cả khi có bài mới chèn giữa lúc người dùng đang cuộn.

### Trạng thái online (Presence)

Không phải module tách riêng — là tác dụng phụ có kiểm soát của vòng đời kết nối Socket.IO.

**Model dữ liệu chính.** Không có bảng DB cho "online/offline" — trạng thái sống hoàn toàn trong bộ nhớ tiến trình (`const onlineUserIds = new Set<number>()`). Lựa chọn có chủ đích: online/offline là dữ liệu phù du, không cần persist, server restart thì tự nhiên mọi người coi như offline tới khi reconnect.

**Luồng hoạt động: A mở app, bạn bè/peer của A thấy A "online".** (1) A kết nối socket, middleware verify JWT + `roleVersion`. (2) `socket.join(user:<A>)`; `wasOffline = !onlineUserIds.has(A)` được chốt **trước khi** thêm vào Set — nếu A đã có tab khác mở, `wasOffline=false`, không phát lại "vừa online". (3) Một tác vụ async song song truy `MessageThread` + `Friendship` (ACCEPTED) để dựng **audience** — bạn bè ∪ người cùng thread; join từng room thread tìm được (chính là cơ chế auto-join ở Messenger). (4) Nếu `wasOffline===true`, `emitPresenceTo(audience, {userId:A, online:true})` — lặp qua từng uid, phát `presence:update` vào đúng room `user:<uid>`, **không** `io.emit()` toàn cục. (5) A đóng tab: `disconnect` đếm lại toàn bộ socket còn lại của A — chỉ khi không còn cái nào mới coi A offline và phát lại presence.

```mermaid
sequenceDiagram
    participant A as Client A
    participant SIO as Socket.IO server
    participant DB as PostgreSQL (Friendship, MessageThread)
    participant P as Bạn bè / peer của A (đã online)

    A->>SIO: kết nối (JWT trong cookie backend_token)
    SIO->>SIO: middleware: verify JWT + roleVersion
    SIO->>SIO: socket.join(user:A)
    SIO->>SIO: tính wasOffline rồi thêm A vào onlineUserIds
    par Tính audience song song
        SIO->>DB: MessageThread.findMany (thread của A)
        SIO->>DB: Friendship.findMany (status ACCEPTED, liên quan A)
    end
    SIO->>SIO: socket.join(thread:id) cho từng thread tìm được
    alt wasOffline == true
        SIO->>SIO: emitPresenceTo(audience, {userId:A, online:true})
        SIO-->>P: io.to(user:uid).emit('presence:update', ...)
    end
    Note over A,SIO: ... sau này A đóng tab ...
    A--xSIO: disconnect
    SIO->>SIO: đếm socket còn lại của A
    alt không còn socket nào của A
        SIO->>SIO: onlineUserIds.delete(A)
        SIO-->>P: emitPresenceTo(audience, {userId:A, online:false})
    end
```

**Điểm kỹ thuật đáng chú ý.** Audience = bạn bè ∪ người cùng thread, không phát toàn cục — bản cũ dùng `io.emit()` cho mỗi lần connect/disconnect, comment trong code gọi thẳng đây là "an O(N²) storm during deploy reconnects": server restart, hàng loạt client reconnect gần đồng thời, mỗi kết nối lại kích hoạt broadcast toàn cục. Thu hẹp về đúng audience khiến chi phí mỗi sự kiện chỉ còn tuyến tính theo số bạn bè thực sự cần biết. `wasOffline` đọc trước khi ghi vào Set chống báo trùng multi-tab. Fail-open có kiểm soát: nếu truy vấn audience lỗi, fallback về `socket.broadcast.emit()` toàn cục — chấp nhận đánh đổi hiệu năng ở tình huống hiếm để không mất tín hiệu presence hoàn toàn.

### Academy & Courses — hệ thống khoá học

"LMS lõi": Course → Section → Lesson, người dùng ghi danh (Enrollment) rồi học từng bài, hệ thống tự tính % hoàn thành và cấp chứng chỉ khi xong.

**Model dữ liệu chính.** `Course` có `academyType` (GENERAL/FPT), `accessType`, và các số liệu cache sẵn (`totalLessons`, `totalStudents`) — denormalize có chủ đích, cập nhật khi có sự kiện liên quan thay vì `COUNT()` mỗi lần render. `Lesson` có `lessonType` (VIDEO/QUIZ/EXERCISE/SOLUTION); quiz **không lưu câu trả lời học viên trong DB** — chấm điểm diễn ra hoàn toàn ở client mỗi lần làm lại, một quiz chơi lại vô hạn lần không cần state server. `Enrollment` khoá `@@unique([userId, courseId])` chống ghi danh trùng, có `progressPercent` (cache), `lastLessonId`/`lastAccessedAt` (nút "Học tiếp"), `source` (FREE/PAID/CODE/ADMIN — cách người dùng có được quyền truy cập). `LessonProgress` khoá `@@unique([enrollmentId, lessonId])` — nguồn sự thật để tính %.

**Luồng hoạt động: học xong một bài → đánh dấu hoàn thành → % khoá học được tính lại thế nào.** (1) Xác thực quyền học: tìm `Enrollment` theo `(userId, courseId)` — không có thì 400. (2) Upsert `LessonProgress` theo khoá tự nhiên `(enrollmentId, lessonId)` — atomic ở tầng DB, quan trọng vì video gửi heartbeat tiến độ nhiều lần/phút. (3) **Đếm lại từ đầu, không cộng dồn tăng dần**: `courseLessons = Lesson.count(...)`, `completedCount = LessonProgress.count({isCompleted:true})` — vì số bài học có thể đổi (giảng viên thêm/xoá bài sau khi học viên ghi danh); dùng bộ đếm cộng dồn sẽ khiến % của học viên cũ sai lệch vĩnh viễn khi khoá thêm bài mới. (4) `progressPercent = completedCount/courseLessons × 100`, ghi lại `Enrollment` cùng `lastLessonId`/`lastAccessedAt` trong **cùng một request**. (5) Nếu đạt 100%, cấp `Certificate` với mã `CUONGTHAI-<năm>-<hex>`, bọc try/catch nuốt lỗi vi phạm unique constraint — cách xử lý race hai request hoàn thành-bài-cuối gần như đồng thời mà không cần transaction/lock phức tạp.

`progressPercent` lưu trong `Enrollment` là **cache, không phải nguồn sự thật** — bằng chứng: `GET /courses/my` không đọc thẳng nó mà tính lại y hệt công thức từ `lessonProgress` + số bài publish hiện tại. Đây là kiểu "phòng thủ kép": cache dùng cho truy vấn nhanh diện rộng, nơi hiển thị trực tiếp cho người dùng thì luôn tính lại tại chỗ.

**Nội dung khoá học soạn dưới dạng file `.mjs`, seed vào DB.** `content/academy/PRF192.mjs` export mặc định một object mô tả Semester ▸ Course ▸ Section ▸ Lesson theo đúng cấu trúc Prisma. `scripts/academy-seed-course.mjs` `import()` động file đó, upsert theo **khoá tự nhiên** (Semester theo `code`, Course theo `(courseCode, academyType)`, Lesson theo `(course, slug)`) — bài đã tồn tại thì UPDATE tại chỗ, bài mới thêm vào cuối. Cờ `--dry` (mặc định) và `--apply`. Vì sao "content-as-code" thay vì form admin UI: review được qua `git diff`; soạn hàng loạt nhanh hơn nhiều lần; tái sử dụng logic qua helper import được; an toàn khi chạy lại nhiều lần (không đụng `LessonProgress`); tự động hoá lúc deploy (`bash deploy.sh` tự seed).

### Phòng thi (Exam Room)

Tách biệt khỏi khoá học ở tầng chấm điểm: một đề (`Exam`) là **FE** (trắc nghiệm, chấm tự động) hoặc **PE** (chấm bằng AI cho code/luận/nói).

**Model dữ liệu chính.** `Exam` thuộc một `Course`, có `kind` (FE/PE), nếu PE thêm `peType` (CODE/WRITE/SPEAK). `ExamQuestion.correctIndexes` là **mảng** chứ không phải một số — hỗ trợ câu multi-select. Một đề FE cũng có thể chứa câu `CODE` (Progress Test trộn trắc nghiệm với 1-2 câu code). `ExamAttempt` đi qua vòng đời `IN_PROGRESS → SUBMITTED/GRADED` (hoặc EXPIRED), có `expiresAt` server tính sẵn — chấm giờ ở phía server, không tin thời gian client gửi lên.

**Luồng hoạt động khi nộp bài.** Bắt đầu lượt thi: tìm attempt `IN_PROGRESS` chưa hết hạn của chính user — có thì resume, không thì tạo mới (và tự chuyển attempt cũ hết hạn sang EXPIRED). **Chấm FE**: so tập đáp án với `correctIndexes` bằng `sameSet()` — không quan tâm thứ tự chọn, chấm tất-cả-hoặc-không. Câu `CODE` lẫn trong đề FE gọi AI chấm riêng; nếu AI lỗi, câu đó `ungraded:true` và **loại khỏi cả tử số lẫn mẫu số** — sự cố hạ tầng AI không được phép biến thành câu bị trừ điểm oan. **Chấm PE**: CODE giải nén `.zip` (lọc file mã nguồn, giới hạn ký tự, lưu zip gốc lên R2 để audit); WRITE nhận bài luận; SPEAK phiên âm bằng Groq Whisper trước rồi mới chấm transcript, tự chuyển chế độ tiếng Nhật nếu mã môn bắt đầu `JPD`. Cả ba đường PE dùng chung khuôn JSON đầu ra bắt buộc, song ngữ; JSON không hợp lệ thì gọi lại đúng một lần trước khi chấp nhận thất bại.

```mermaid
flowchart TD
    A["Học viên bấm Nộp bài"] --> B{"Loại đề?"}

    B -->|"FE - trắc nghiệm"| C["submitFinalExam()"]
    C --> D["Với mỗi câu MCQ: sameSet(selected, correctIndexes)"]
    C --> E{"Có câu CODE trộn trong đề?"}
    E -->|"Có"| F["gradeCode() qua AI"]
    F -->|"AI lỗi/quá tải"| G["Đánh dấu ungraded, loại khỏi tử số & mẫu số"]
    F -->|"AI OK"| H["Cộng điểm câu code"]
    D --> I["score = (raw / maxRaw) x totalPoints"]
    G --> I
    H --> I

    B -->|"PE - thực hành"| J{"peType?"}
    J -->|"CODE"| K["Giải nén .zip, lọc file mã nguồn"]
    J -->|"WRITE"| L["Nhận bài luận tiếng Anh"]
    J -->|"SPEAK"| M["Groq Whisper: audio -> transcript"]

    K --> N["Ghép prompt: đề bài + rubric + bài làm"]
    L --> N
    M --> N
    N --> O["Gọi LLM theo GRADE_JSON_SPEC (song ngữ)"]
    O -->|"JSON không hợp lệ"| P["Gọi lại 1 lần"]
    P --> Q["normalizeGrade(): quy điểm về thang points của câu"]
    O -->|"JSON hợp lệ"| Q
    Q --> R["finalizePe(): gộp điểm các câu"]

    I --> S["Cập nhật ExamAttempt: status=GRADED, score, passed"]
    R --> S
    S --> T["buildReview(): trả đáp án đúng, giải thích cho học viên"]
```

**Điểm kỹ thuật đáng chú ý.** Để `Exam.kind`/`ExamQuestion.kind` là cột dữ liệu tường minh (thay vì suy luận từ nội dung) cho phép route chặn nhầm loại ngay từ đầu — `submit-code` kiểm `exam.kind!=='PE' || exam.peType!=='CODE'` rồi trả 400 nếu sai, tránh một đề trắc nghiệm bị gọi nhầm API chấm code. `gradingMode` trên `ExamAttempt` trở thành trường lọc/thống kê được, phục vụ theo dõi chi phí và độ ổn định của cổng LLM dùng chung với Interview Simulator.

### Code Lab — sân chơi code không có sandbox thật

Học viên viết code trong editor nhúng, bấm "Run" để xem output ngay trong trình duyệt — không gọi backend, không Docker, không WASM.

**Model dữ liệu chính.** Cây `Track → Module → Exercise`, mỗi `Exercise` có `examplesJson`/`solutionCodeJson`/`language`. Progress khoá `(userId, exerciseId)`, lưu `status` và `savedCode` — toàn bộ workspace nhiều file, không chỉ file đang mở (bản cũ chỉ lưu file active từng làm mất code khi học viên mở file khác rồi quay lại).

**Điểm kỹ thuật đặc sắc — và sự thật cần nói thẳng: không có sandbox.** Lõi của nút Run:

```js
const runJs = () => {
  const logs = [];
  const orig = console.log;
  try {
    console.log = (...a) => logs.push(a.map((x) => typeof x === 'object' ? JSON.stringify(x) : String(x)).join(' '));
    const fn = new Function((jsFile?.code ?? '').replace(/\bexport\b/g, ''));
    const ret = fn();
    if (ret !== undefined) logs.push(String(ret));
    setRunOut(logs.join('\n') || '(no output)');
  } catch (e) { setRunOut('Error: ' + (e?.message || String(e))); }
  finally { console.log = orig; }
};
```

`new Function` về bản chất tương đương `eval` — biên dịch chuỗi thành hàm và chạy **trong cùng global scope, cùng origin, cùng tab** với chính trang. Không có cách ly bộ nhớ/scope (code có `window`, `document`, `fetch`, cookie — về lý thuyết đọc được `document.cookie` hoặc gọi API bằng session đang đăng nhập), không timeout (`while(true){}` treo cứng cả tab), không giới hạn tài nguyên. Chấp nhận được vì bài tập là nội dung admin biên soạn, mỗi người chỉ chạy code của chính mình — nhưng nếu một ngày tính năng nộp bài rồi *hệ thống* tự chạy code đó (auto-grade), thiết kế này không được dùng nguyên trạng.

Đối chiếu ngay trong cùng repo: `Algorithm Visualizer` giải đúng bài toán "chạy code người dùng" bằng Web Worker + timeout cứng 6 giây + trần 300.000 lệnh — code người dùng chạy trong global scope hoàn toàn khác (không `window`/`document`/`fetch` tới cookie trang), vòng lặp vô hạn không đơ UI chính vì main thread vẫn `worker.terminate()` được. Bài học sư phạm: cùng một bài toán "chạy JS người dùng nhập" có hai mức rủi ro khác nhau tuỳ ngữ cảnh sản phẩm, và mức đầu tư sandbox phải theo đúng rủi ro đó — đây là nợ kỹ thuật đã biết, không phải sơ suất chưa phát hiện.

### My Language — bộ máy ôn tập ngắt quãng (Spaced Repetition)

Dạy từ vựng, ngữ pháp, kanji/hanzi cho nhiều ngôn ngữ. Phần đáng học nhất: cơ chế quyết định "khi nào nên cho học viên ôn lại một từ".

**Model dữ liệu chính.** Tiến độ và lịch ôn nằm ở một bảng dùng chung cho mọi loại nội dung, `LangUserProgress`:

```prisma
model LangUserProgress {
  userId       Int
  itemType     LangItemType    // VOCAB | ALPHABET | GRAMMAR | ...
  itemId       Int
  status       LangLearnStatus @default(NEW)
  easeFactor   Float           @default(2.5)
  intervalDays Int             @default(0)
  repetitions  Int             @default(0)
  nextReviewAt DateTime?
  @@unique([userId, itemType, itemId], map: "uk_lang_progress_user_item")
}
```

Bảng progress **đa hình theo `itemType`** thay vì bảy bảng riêng cho bảy loại nội dung — đơn giản hoá truy vấn "cái gì đến hạn ôn hôm nay" thành một `SELECT` duy nhất bất kể loại nội dung.

**Điểm kỹ thuật đặc sắc: công thức SM-2 rút gọn.**

```js
if (quality < 3) {
  repetitions = 0; intervalDays = 1;
} else {
  if (repetitions === 0) intervalDays = 1;
  else if (repetitions === 1) intervalDays = 6;
  else intervalDays = Math.round(intervalDays * easeFactor);
  repetitions += 1;
}
easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
```

`quality < 3` (trả lời sai) reset về đầu — `repetitions=0`, mai ôn lại ngay. `quality >= 3` (nhớ đúng), khoảng ôn **giãn theo cấp số nhân**: lần đầu 1 ngày, lần hai nhảy thẳng 6 ngày (bước cố định theo SM-2 gốc), từ lần ba trở đi nhân với `easeFactor` (mặc định 2.5) — một từ nhớ tốt liên tục có lịch 1 → 6 → 15 → 38 → 95 ngày, giãn rất nhanh, đúng triết lý SRS: đừng lãng phí thời gian ôn thứ đã nhớ chắc. `easeFactor` tự điều chỉnh mỗi lần: trả lời dễ thì tăng nhẹ (ôn sau giãn nhanh hơn), trả lời chật vật thì giảm; sàn cứng 1.3 tránh khoảng ôn co lại gần bằng không mãi mãi.

### Interview Simulator — chấm hai tầng: luật cứng trước, AI sau

**Model dữ liệu chính.** `InterviewQuestion` mang bộ tiêu chí chấm ngay trong bảng câu hỏi — `rubric` (JSON trọng số), `mustMention`/`shouldMention` (từ khoá bắt buộc/nên có), `redFlags` (từ khoá sai kiến thức), `synonyms`. Có cả bộ song song tiếng Anh vì câu trả lời tiếng Anh so khớp từ khoá tiếng Việt sẽ trượt oan. `InterviewSession.engineMode` (STATIC/HYBRID/FULL_AI) quyết định câu trả lời chấm bằng luật thuần hay luật + AI.

**Luồng hoạt động khi nộp câu trả lời.** (1) Câu tự luận chọn đúng bộ từ khoá theo ngôn ngữ trả lời. (2) **Pass A — chấm từ khoá, tức thời, không tốn phí LLM.** (3) Nếu HYBRID/FULL_AI và còn quota: **Pass C — AI chấm rubric**, truyền cả kết quả Pass A làm ngữ cảnh. (4) AI lỗi/hết quota: **suy biến êm** — hạ về STATIC, điểm cuối vẫn là điểm Pass A, câu trả lời không bao giờ mất hay chấm hỏng chỉ vì AI sập.

Pass A không dùng `includes()` ngây thơ — hàm `mentions()` xử lý ba biến thể cùng lúc: khớp nguyên cụm sau chuẩn hoá, khớp sau khi ép phẳng bỏ khoảng trắng/gạch nối (`"micro task"` ≈ `"microtask"`), và khớp từng từ con khi cụm nhiều từ ghép. Điểm Pass A = `70% coverage(mustMention) + 30% coverage(shouldMention) − số red-flag × 15`.

**Điểm kỹ thuật đặc sắc: evidence-gating chống AI cho điểm bịa.** Prompt hệ thống bắt buộc: với mỗi tiêu chí, "evidence" phải là trích dẫn nguyên văn từ câu trả lời — nếu `evidence: null`, điểm tiêu chí đó **không thể vượt quá 1/4**, dù AI có "cảm thấy" câu trả lời tốt đến đâu. Cơ chế này chặn đúng lỗi kinh điển của LLM-làm-giám khảo: cho điểm cao dựa trên suy diễn của chính AI thay vì những gì thí sinh thực sự viết ra. Hệ thống còn so `disagreement = |aiScore − passA.score|` — vượt ngưỡng thì `needsReview=true`, tự-giám sát khi hai bộ máy chấm độc lập bất đồng quá xa.

### CV Builder — luật cứng miễn phí trước, AI phê bình sau

**Model dữ liệu chính.** `CvBullet` là đơn vị nguyên tử — một dòng thành tích. `userStatedFacts`/`provenance` là "neo xuất xứ": mỗi câu chữ AI từng chạm vào phải truy ngược được về sự thật do chính người dùng cung cấp; `verified` gates export.

**Luồng hoạt động — hai tầng chấm.** Tầng 1 `lintProfile()` — miễn phí, tất định, không AI, chấm ngay khi gõ. Tầng 2 `critiqueProfile()` — AI, chỉ Pro, bọc nội dung CV trong thẻ `<candidate_cv>` (chống injection, đánh dấu rõ là DỮ LIỆU không phải chỉ thị).

**Điểm kỹ thuật đặc sắc thứ nhất: bộ luật chấm bullet không dùng AI.** `lintBullet()` chấm bằng hệ điểm cộng-trừ tất định: mở đầu bằng động từ mạnh +2, chức danh thay vì hành động -3, có số liệu đo được +2, không có kết quả -2, ngôi thứ nhất -2, câu bị động -1, và một luật tinh tế — "chỉ có mặt trong nhóm" mà không nói rõ đóng góp gì bị phạt nặng nhất (-2.5). Nguyên tắc thiết kế: ưu tiên độ chính xác cao trên các bullet mạnh — một dòng có động từ mạnh + kết quả thật không bao giờ bị gắn nhãn WEAK, vì chê oan một dòng tốt phá sạch lòng tin vào mọi nhận xét khác.

**Điểm kỹ thuật đặc sắc thứ hai: evidence-gating chống AI bịa số liệu.** Rủi ro thật: khi được yêu cầu "viết lại cho mạnh hơn", LLM có xu hướng tự chèn số liệu nghe hợp lý ("giảm 40% thời gian xử lý") dù ứng viên chưa từng cung cấp. System prompt chặn bằng luật tối thượng kèm ví dụ cụ thể: gợi ý sửa **tuyệt đối không** được chứa con số/công nghệ ứng viên chưa nêu. Khi cần một sự thật chưa có, output bắt buộc `needsUserInput=true` + `clarifyingQuestion` để hỏi ngược, còn `suggestedFix` chỉ mô tả cách viết lại về *cấu trúc* — không bịa nội dung. Nguyên tắc xuyên suốt, đúng như comment trong code: "Một dòng thật thà không số vẫn hơn một dòng bịa."

### Xưởng mô phỏng (/simulation)

**Model dữ liệu chính.** Một `Scenario` gồm sơ đồ tĩnh (`nodes`+`edges`, hoặc `panels` cho ngăn xếp/hàng đợi) cộng hàm `build(opts) => SimStep[]`. Bắt buộc `build()` phải là **hàm thuần** — cùng `opts` luôn ra cùng mảng bước, không state ẩn nào sống sót giữa hai lần gọi — điều kiện sống còn của thanh tua: trạng thái tại bước `i` phải suy ra được bằng phát lại tuần tự `0..i`, không phải "tiến dần" từ bước trước. Từng `SimStep` mang `nodeStates` (cộng dồn) và `ops: PanelOp[]` cho panel — mô hình event-sourcing thu nhỏ áp vào hoạt hình.

**Điểm kỹ thuật đặc sắc: đồng hồ mô phỏng theo thời gian thực, không đếm khung.** Bản đầu tiên đẩy mô phỏng đúng `1000/60`ms mỗi `requestAnimationFrame`, lập luận "đếm khung là tất định" — sai vì rAF không cố định 60 lần/giây (màn 120Hz chạy gần gấp đôi, mô phỏng nhanh gấp đôi thời gian thực). Bản sửa cộng dồn **delta thời gian thật**, chặn trần `MAX_FRAME_MS=100` (chuyển tab quay lại không nhảy vọt).

**Hai đường xuất video, dùng chung một nguồn dữ liệu.** Tương tác: `canvas.captureStream(60)` + Web Audio (SFX và micro trộn qua `MediaStreamAudioDestinationNode` thành một track — đưa 2 track riêng vào `MediaRecorder`, đa số trình duyệt chỉ mã hoá track đầu). Hàng loạt/ngoại tuyến: `window.__SIMULATION__.renderAt(ms)` — Playwright headless gọi 30 lần/giây video, chụp PNG từng khung, ghép bằng ffmpeg — không phụ thuộc tốc độ máy, cho ra file giống hệt nhau mọi lần dựng, điều kiện bắt buộc để dựng hàng chục video qua đêm không cần người canh.

```mermaid
flowchart TD
    A["Scenario: nodes/edges hoặc panels + build(opts)"] --> B["SimStep[] thuần, tất định"]
    B --> C["useSimulationEngine: advance() theo delta thời gian thật"]
    C --> D["canvasRenderer/panelRenderer vẽ frame hiện tại"]
    D --> E1["captureStream(60) + WebAudio mixed track -> MediaRecorder -> .webm"]
    D --> E2["Playwright: renderAt(ms) đóng băng thời gian ảo, chụp PNG từng khung"]
    E2 --> F["ffmpeg ghép PNG + audio -> .mp4 H.264"]
```

### Algorithm Visualizer (/algorithms)

**Điểm kỹ thuật đặc sắc: sandbox Worker dựng từ Blob.** `WORKER_SRC` là toàn bộ mã nguồn Worker nhúng thẳng thành chuỗi trong file TypeScript. Bấm chạy: `new Blob([WORKER_SRC])` → `URL.createObjectURL` → `new Worker(url)` — kỹ thuật "inline worker" giữ Worker cùng-nguồn tuyệt đối, không cần phục vụ file worker riêng. Bên trong Worker, sáu lớp "tracer" (`Array1DTracer`, `GraphTracer`...) không vẽ gì cả — chỉ đẩy lệnh (`Cmd`) vào mảng `commands`. Code người dùng chạy qua `new Function(...tracers, code)` — thực chất `eval` có kiểm soát tham số, nhưng vì chạy trong Worker, không có `window`/DOM, kênh duy nhất ra ngoài là `postMessage`.

**Timeout cứng diệt vòng lặp vô hạn.** `runCode(code, timeoutMs=6000)` đặt `setTimeout` ở main thread — hết 6 giây Worker chưa trả lời thì `worker.terminate()`. Đây là cách duy nhất khả thi chặn `while(true){}`: code đơn luồng bên trong Worker không tự ngắt được, nhưng `terminate()` từ ngoài giết ngay lập tức, không đụng trang chính. `CAP=300000` lệnh là chốt thứ hai — thuật toán tạo quá nhiều bước visualize tự ném lỗi trước khi tràn bộ nhớ.

**Replay: từ chuỗi lệnh thô sang từng khung hình.** Worker trả về nguyên mảng `commands` theo đúng thứ tự gọi. `buildFrames()` ở main thread duyệt tuần tự, áp từng lệnh lên state `live`, và **chỉ khi gặp lệnh `delay`** mới `snapshot()` deep-clone thành một `Frame` — `Tracer.delay()` chính là ranh giới bước.

```mermaid
flowchart TD
    A["Người dùng sửa code trong catalog"] --> B["runCode(): Blob(WORKER_SRC) -> URL -> new Worker"]
    B --> C["new Function(Tracers, code) chạy TRONG Worker, cô lập khỏi DOM"]
    C --> D["Mỗi lệnh set/patch/select/delay -> push vào commands[]"]
    D -->|postMessage| E["Main thread: buildFrames() replay commands"]
    E -->|"gặp delay -> snapshot deep-clone"| F["frames: Frame[] theo từng bước"]
    F --> G["React render frames[step]"]
    B -.->|"quá 6s không trả lời"| H["worker.terminate() — diệt vòng lặp vô hạn"]
```

Điểm đặc sắc nhất: tách bạch tuyệt đối "ghi lệnh" (trong Worker, có timeout cứng tự huỷ) và "phát lại thành ảnh" (main thread, thuần render, không chạy code lạ) — mẫu hình sandbox execution kinh điển thu nhỏ vừa đủ cho một trình trực quan hoá.

### Sân chơi 3D (/playground)

`playground-3d/` là app Vite độc lập (không thuộc Next.js), build bằng `three/webgpu` (tự rơi về WebGL khi chưa hỗ trợ) kết hợp **TSL** (Three.js Shading Language) — viết shader bằng hàm JS composable thay vì chuỗi GLSL, biên dịch ra WGSL/GLSL tuỳ backend runtime. Vật lý dùng `@dimforge/rapier3d` (WASM), nạp song song với đợt tải resource nặng thứ hai để không kéo dài màn hình tải.

**Điểm kỹ thuật đặc sắc: khu Đại học FPT dựng bằng code, không đụng file `.glb`.** Hàng trăm khối nhà/cây/đường tái sử dụng đúng một `BoxGeometry` và một `CylinderGeometry`, khác nhau ở scale/position/material; phần tử lặp lại số lượng lớn (cửa sổ, cây bụi) dùng `THREE.InstancedMesh` — một draw call vẽ hàng trăm bản sao. Ngẫu nhiên trực quan (ô cửa nào tối) dùng hàm băm tất định thay vì `Math.random()` — đảm bảo campus giống hệt nhau qua mọi lần tải, mọi máy, dù không lưu seed ở server.

Câu hỏi thi trong game lấy từ `content/exams/*.mjs` — cùng nguồn với trang `/exam` thật. Vì app tĩnh không gọi API lúc chạy, nội dung được "nướng" sẵn lúc build: script đọc đề thi, lọc theo môn, ghi ra JSON tĩnh; lúc chơi chỉ `fetch()` đúng file JSON của kỳ đã chọn — không CORS, không auth.

**CSP tách biệt.** Vì khu vực này tự chứa hoàn toàn, nó có CSP riêng, chặt hơn site chính về domain bên thứ ba (không domain nào được phép) nhưng lỏng hơn ở một điểm bắt buộc: `'unsafe-eval'` cho biên dịch WASM của Rapier. Điểm dễ bỏ sót nhất: `connect-src` phải có `blob:` — file `.glb` nhúng texture bên trong, `GLTFLoader` giải nén thành `blob:` URL rồi nạp bằng `fetch()` (không phải thẻ `<img>`, nên rơi vào `connect-src` chứ không phải `img-src`). Thiếu đúng một dòng này, mọi texture chết và cả thế giới kẹt vĩnh viễn ở màn hình tải — console chỉ báo lỗi load blob, không hề nhắc gì tới CSP.

```mermaid
flowchart TD
    A["Game.init(): Scene, Ticker, Time..."] --> B["Tải đợt 1: texture nhỏ cho intro"]
    B --> C["song song: tải đợt 2 (glb/texture) + import Rapier WASM"]
    C --> D["new Physics() — RAPIER.World + collision groups"]
    D --> E["new World() -> FptuCampus, Trees... dựng bằng code + InstancedMesh"]
    E --> F["world.step(1) dựng nội dung, đăng ký collider fixed"]
    F --> G["reveal.updateStep(0) — mở màn intro"]
    G --> H["vòng lặp: ticker tick -> Physics.update() -> vẽ qua TSL trên WebGPU/WebGL"]
```

### Finance / MoneyFlow

**Model dữ liệu chính.** `Debt` (khoản nợ gốc) → `DebtScheduleItem` (từng kỳ trả, tính sẵn và lưu xuống DB ngay lúc tạo — giống ngân hàng in tờ lịch trả góp lúc ký hợp đồng, không tính lại mỗi lần xem) → `DebtPayment` (lịch sử thực trả).

**Vì sao dùng `Prisma.Decimal` thay vì `number`.** JavaScript lưu số bằng IEEE-754 double — `0.1+0.2` ra `0.30000000000000004` vì hệ nhị phân không biểu diễn tròn được số thập phân. Sai số này tích luỹ qua nhiều kỳ trả góp, người dùng phát hiện ngay. `Prisma.Decimal` tính bằng số học chính xác tuỳ ý, khớp cột `Decimal(18,2)` Postgres. Quy tắc xuyên suốt: **mọi phép tính tiền làm tròn 2 chữ số HALF_UP ngay sau mỗi bước**, không để sai số trôi tự do rồi làm tròn một lần ở cuối.

**Bốn mô hình lãi suất.** `FLAT_MONTHLY` — lãi cố định tính trên nguyên gốc ban đầu, đắt hơn nhiều so với % quảng cáo vì lãi không giảm theo dư nợ thực. `REDUCING_BALANCE` — EMI chuẩn ngân hàng: `EMI = P·r·(1+r)^n / ((1+r)^n − 1)`, lãi tính trên dư nợ còn lại nên giảm dần, gốc tăng dần dù EMI không đổi. `DAILY_PERCENT` — lãi theo số ngày thực tế trên dư nợ còn lại (kiểu vay nhanh), hỗ trợ không kỳ hạn. `NO_INTEREST` — chia đều.

**Kỳ cuối hấp thụ sai số làm tròn.** Vay 10.000.000₫ chia 3 kỳ: `10000000/3 = 3.333.333,33...`, làm tròn từng kỳ rồi nhân 3 thiếu 1 xu. Giải pháp: n-1 kỳ đầu dùng số đã làm tròn đều, **kỳ cuối** nhận phần còn lại thực tế `= principal − allocated` — nhờ vậy tổng luôn khớp gốc tuyệt đối.

**Snowball vs Avalanche.** Nhiều khoản nợ, ngân sách cố định mỗi tháng, phần dư dồn vào khoản nào trước? Snowball ưu tiên dư nợ nhỏ nhất (lợi ích tâm lý), Avalanche ưu tiên lãi suất cao nhất (tối ưu toán học). Mô phỏng tháng-qua-tháng (tối đa 600 tháng chống vòng lặp vô hạn), trả về `months` và `totalInterest` để so sánh trực tiếp.

```mermaid
sequenceDiagram
    participant U as User (FE)
    participant API as debt.service.ts
    participant Calc as debtCalculator.ts (pure)
    participant DB as Postgres (Prisma)

    U->>API: POST /finance/debts {principal, interestType, rate, termMonths}
    API->>Calc: computeDebt(input)
    Calc-->>API: {schedule[], totalInterest, totalPayable}
    API->>DB: $transaction: create Debt + createMany DebtScheduleItem
    DB-->>U: Debt + full schedule
    Note over U,DB: ... đến hạn kỳ 1 ...
    U->>API: POST /finance/debts/:id/schedule/:itemId/pay
    API->>DB: create DebtPayment + update DebtScheduleItem {isPaid}
    alt tất cả kỳ đã trả
        API->>DB: update Debt {status: PAID_OFF}
    end
```

`computeDebt()` là hàm thuần — unit-test không cần mock Prisma, và tái dùng nguyên vẹn cho `previewSchedule()` khi người dùng đổi số tiền/loại lãi, lịch trả nợ cập nhật real-time trên UI mà chưa ghi DB dòng nào.

### Music

**Vì sao nhạc không phát thẳng từ link R2.** Trình phát tạo thẻ `<audio crossOrigin="anonymous">` — bắt buộc để đưa byte âm thanh vào `AnalyserNode` (visualizer tần số thực). Nhưng khi `crossOrigin` được set, trình duyệt bắt buộc kiểm CORS trên mọi byte tải về, mà bucket R2 **không có chính sách CORS**. Giải pháp: backend không redirect, tự tải object từ R2 rồi pipe byte về qua `/music/stream/:id` — vì đây là first-party, trình duyệt không chặn.

**HTTP Range (206 Partial Content).** Trình duyệt gửi `Range` để dò dung lượng, tải khối đầu, rồi tua tới đâu gửi `Range` tới đó — backend forward y nguyên chuỗi này cho R2. Quên forward, R2 trả toàn bộ file, thân response không khớp `Content-Range`, trình duyệt tự tua ngược về đầu bài dù đĩa hiển thị gần cuối.

**MediaSession API — phát nhạc khi khoá màn hình.** Không có nó, `<audio>` vẫn phát ngầm nhưng lock-screen không nút nào hoạt động. Đăng ký handler cho `play`/`pause`/`nexttrack`/`previoustrack` gọi thẳng `useMusicStore.getState()` (không qua React state, tránh stale). Cố tình **không** đăng ký `seekbackward`/`seekforward` — trên iOS, có 2 handler này thì lock-screen hiện nút tua ±10s; vắng mặt thì hệ điều hành tự chuyển sang nút prev/next-track, đúng hành vi app nghe nhạc.

**Sự thật về "DJ deck" ở `/music/remix`.** Waveform trên bàn DJ **không phải phân tích âm thanh thật** — hàm `waveform()` băm FNV-1a lên `track.id` rồi xorshift sinh dãy số "trông giống sóng nhạc" qua một đường bao hình sin. Cùng id luôn ra cùng hình dạng (tất định, không nhấp nháy khi re-render), nhưng không liên quan gì tới âm thanh thật — không FFT, không đọc PCM. Ngược lại, visualizer khi *đang phát nhạc thật* dùng `AnalyserNode` lấy tần số thật — nhưng chủ động tắt trên mobile vì `AudioContext` bị hệ điều hành suspend khi app chạy nền.

### Shop & Thanh toán

**Model dữ liệu chính.** `Product.type` = PHYSICAL (cần ship) hoặc DIGITAL. `ProductKey` — **pool key riêng lẻ**: mỗi dòng là một tài khoản/license thật, `status` AVAILABLE→SOLD, mỗi người mua nhận key chưa ai dùng thay vì phát chung một nội dung. `ShopOrderItem` snapshot **denormalized** `productName`/`price` tại thời điểm mua, không FK sống tới `Product` — đổi tên/xoá sản phẩm sau này không phá vỡ lịch sử đơn cũ.

**Cơ chế pool key: AVAILABLE → SOLD, không bao giờ trùng.**

```ts
const candidates = await tx.productKey.findMany({ where: { productId, status: 'AVAILABLE' }, take: item.quantity + 5 });
for (const k of candidates) {
  if (claimed.length >= item.quantity) break;
  const c = await tx.productKey.updateMany({ where: { id: k.id, status: 'AVAILABLE' }, data: { status: 'SOLD', ... } });
  if (c.count === 1) claimed.push(k.content);
}
```

`findMany` chỉ lấy danh sách ứng viên, không khoá gì. Giành quyền sở hữu thật nằm ở `updateMany({ where: { id, status: 'AVAILABLE' } })` — điều kiện `status` trong `WHERE` biến UPDATE thành **so sánh-và-đổi nguyên tử** do Postgres đảm bảo: hai request đụng cùng key song song, chỉ một đổi được, cái thua nhận `count=0` và tự thử ứng viên kế tiếp.

**Chống double-fulfill: `updateMany` điều kiện PENDING→PAID nguyên tử.** Webhook có thể gọi lại nhiều lần cho cùng một đơn. Gộp điều kiện + hành động vào một `updateMany`:

```ts
const flipped = await tx.shopOrder.updateMany({ where: { id: order.id, status: 'PENDING' }, data: { status: 'PAID', ... } });
if (flipped.count !== 1) return; // đã bị xử lý trước — bỏ qua
```

`flipped.count` chỉ là 1 (thắng, giao hàng) hoặc 0 (thua, im lặng bỏ qua) — không có khoảng hở giữa kiểm tra và hành động.

**Hai cổng thanh toán, một hàm fulfillment.** PayOS (đơn Shop) và VNPay (đơn khoá học). PayOS yêu cầu `orderCode` duy nhất toàn merchant, không phân biệt sản phẩm — giải quyết bằng chia không gian số: đơn khoá học dùng thẳng id, đơn shop dùng `OFFSET(2 tỷ) + ShopOrder.id`. Webhook chỉ so `payosCode >= OFFSET` để biết loại đơn.

**Đối soát chủ động ngoài webhook.** Webhook có thể không bao giờ tới. Giải pháp: hỏi lại chính PayOS ở mọi điểm tự nhiên (trang return, `GET /shop/orders/my`) — vì hàm fulfillment đã idempotent, gọi từ webhook, từ đối soát, hay cả hai gần như đồng thời đều an toàn tuyệt đối.

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend (checkout)
    participant API as Backend
    participant PayOS as PayOS Gateway
    participant DB as Postgres

    U->>FE: Đặt hàng, bấm Thanh toán
    FE->>API: POST /shop/orders {items}
    API->>DB: create ShopOrder (status=PENDING)
    FE->>API: POST /payments/payos/shop/create
    API->>PayOS: createPaymentLink(orderCode = OFFSET + id)
    PayOS-->>API: {checkoutUrl}
    API-->>FE: checkoutUrl
    FE-->>U: redirect sang PayOS

    par Webhook (nếu tới)
        PayOS->>API: POST /payments/payos/webhook
        API->>DB: markShopOrderPaidAndFulfill() — updateMany PENDING->PAID
        API->>DB: gán ProductKey AVAILABLE->SOLD (transaction)
    and User quay lại trang return
        PayOS-->>FE: redirect /shop/payment-return
        FE->>API: GET /shop/orders/:code (poll)
        API->>PayOS: reconcilePayosShopOrder() — hỏi trạng thái trực tiếp
        API->>DB: markShopOrderPaidAndFulfill() nếu PAID (idempotent, có thể trùng webhook)
        API-->>FE: order.status = PAID
    end
```

Cả hai nhánh cùng gọi `markShopOrderPaidAndFulfill` — nhánh tới sau tự nhận ra đơn đã PAID và không giao hàng lần hai. Đây là lý do toàn bộ luồng "không sợ" webhook đến trễ, đến trùng, hay không đến.

## Bảo mật & xác thực

### Luồng đăng nhập và làm mới token

```mermaid
sequenceDiagram
    participant B as Trình duyệt
    participant N as Nginx
    participant E as Express backend
    participant D as PostgreSQL

    B->>N: POST /api/v1/auth/login (+ Turnstile token)
    N->>E: proxy_pass, forward Cookie tường minh
    E->>D: SELECT user, bcrypt.compare (12 rounds, dummy-hash chống dò user)
    E-->>B: Set-Cookie backend_token (httpOnly, sameSite=lax, 24h)
    Note over B,E: JWT sống 24h — access token và cookie login CÙNG hạn 24h

    B->>E: GET /api/v1/... (Cookie backend_token)
    E-->>B: 401 khi JWT hết hạn

    B->>N: POST /api/auth/refresh (Next.js route proxy)
    N->>E: jwt.verify(ignoreExpiration: true) rồi TRA LẠI DB
    E->>D: kiểm enabled + accountNonLocked
    E-->>B: JWT mới + cookie đặt lại hạn 7 ngày
```

Token không chỉ nằm trong cookie: `extractToken()` còn đọc từ header `Authorization`, từ query `?token=` (cho SSE), và tự parse `Cookie:` thô cho bắt tay Socket.IO. Mặt trái: query-string token buộc middleware log phải tự tay che nó — `morgan` được vá để thay `?token=...` bằng `[REDACTED]` trước khi ghi log, nếu không mọi JWT sẽ nằm trần trong access log.

Phân quyền không phải enum tĩnh: `Role` và `User` nối nhau qua bảng `UserRole` nhiều-nhiều, kèm cột `roleVersion` để vô hiệu hoá token cũ khi đổi mật khẩu.

```prisma
model Role {
  id    Int        @id @default(autoincrement())
  name  String     @unique @db.VarChar(50)   // "ROLE_ADMIN" | "ROLE_USER"
  users UserRole[]
}

model UserRole {
  userId Int
  roleId Int
  user   User @relation(fields: [userId], references: [id], onDelete: Cascade)
  role   Role @relation(fields: [roleId], references: [id], onDelete: Cascade)
  @@id([userId, roleId])
}

model User {
  id          Int      @id @default(autoincrement())
  roleVersion BigInt   @default(0)   // ++ mỗi lần đổi mật khẩu — vô hiệu token cũ
  roles       UserRole[]
}
```

:::danger[roleVersion chỉ được kiểm ở WebSocket, không ở HTTP]
Middleware `authenticate` của Express kiểm `enabled` và `accountNonLocked` trên mỗi request, nhưng **không so `roleVersion` trong token với DB**. Tầng Socket.IO thì có: bắt tay từ chối ngay nếu `roleVersion` lệch. Hệ quả: đổi mật khẩu qua HTTP xong, token cũ vẫn dùng được tới khi hết hạn 24h; qua WebSocket thì bị đá ngay lập tức. Đây là một bất đối xứng thật, đang nằm trong danh sách cần thu hẹp.
:::

Ba lớp phòng thủ khác đáng nói:

| Cơ chế | Vị trí | Đánh đổi có chủ đích |
|---|---|---|
| Rate limiter Redis (`general` 2000/15′, `auth` 10/1′, `upload` 20/1′) | `src/index.ts` | **`failOpen()`**: Redis chết → request đi qua không giới hạn, thà mất rate-limit còn hơn 500 toàn site |
| Chống XFF giả mạo | key rate-limit lấy entry **phải cùng** của `X-Forwarded-For` (Nginx tự nối), không lấy entry trái — client tự đặt được entry trái | Từng bị khai thác thật: gửi `X-Forwarded-For` khác nhau mỗi lần để có vô hạn bộ đếm |
| Upload MIME check | `assertSafeUploadType()` — chặn theo MIME khai báo + đuôi file nguy hiểm (`.html`, `.svg`, `.js`...) | **Không đọc magic bytes** — phòng thủ dựa trên khai báo, có ngoại lệ cố ý cho `application/octet-stream` (drag-drop di động) |
| Presigned URL nội bộ | HMAC-SHA256 tự chế, hạn 30 phút | So khớp chữ ký bằng `!==` chuỗi thường, không dùng `crypto.timingSafeEqual` |

:::note[Một điểm chưa nhất quán, ghi nhận thẳng thắn]
Repo có **hai cách băm địa chỉ IP khác hẳn nhau**: `project.routes.ts` dùng HMAC-SHA256 đúng chuẩn cho lượt "thích" ẩn danh; `snippets.service.ts` lại dùng một hàm băm kiểu `String.hashCode` của Java (djb2, 32-bit) cho upvote/bookmark — không gian 32-bit nên dễ đụng độ và đảo ngược được. Không phải lỗ hổng nghiêm trọng (chỉ ảnh hưởng đếm lượt ẩn danh), nhưng là một minh chứng cho lý do cần một hàm `hashIp()` dùng chung thay vì để mỗi service tự viết lại.
:::

CSP là ví dụ rõ nhất cho việc phân lớp trách nhiệm: backend **tắt hẳn CSP** (`contentSecurityPolicy: false` trong Helmet, comment ghi rõ "để Next.js lo"), và Next.js thật sự lo — hai chính sách khác nhau cho hai bề mặt:

```mermaid
flowchart LR
    Req["Request tới Next.js"] --> Check{"Đường dẫn?"}
    Check -->|"/playground/*"| Strict["CSP chặt: default-src 'self' blob: data:\nkhông domain thứ ba, object-src 'none'\n(nhưng unsafe-eval cho WASM Rapier)"]
    Check -->|còn lại| Wide["CSP rộng: whitelist rõ tên R2, YouTube,\nGiphy, Cloudflare Turnstile, Sentry tunnel"]
```

Rate limiter ở tầng Nginx bổ sung thêm: zone `auth` giới hạn 5 request/phút cho 4 route đăng nhập/đăng ký, zone `api` 30 request/giây cho phần còn lại — độc lập với rate-limit ở tầng Express, hai lớp không biết về nhau nhưng cùng bảo vệ một endpoint.

## Hạ tầng & triển khai

5 container Docker Compose, ghim project name (`cuonghoangdev`) để tránh Compose tự tạo project "repo" trùng lặp — sự cố từng xảy ra thật khi thiếu cờ `-p`, khiến deploy báo "thành công" trong khi site vẫn chạy image cũ.

| Service | Image | RAM giới hạn | Publish ra host |
|---|---|---|---|
| postgres | `postgis/postgis:16-3.4`, 11 cờ tuning (`shared_buffers=512MB`...) | 2G | `5432:5432` |
| redis | `redis:7-alpine`, `allkeys-lru`, AOF | 512M | `6379:6379` |
| backend | build từ `Dockerfile.backend`, 2-stage | 2G | `3001:3001` |
| frontend | build từ `frontend/Dockerfile`, 3-stage (glibc bắt buộc cho SWC) | 2G | *không publish* |
| nginx | `nginx:1.27-alpine` | 256M | `80:80`, `443:443` |

### Deploy: từ một dòng lệnh tới zero-downtime

```mermaid
flowchart TB
    A["bash deploy.sh — máy local"] --> B["Kiểm giáo trình khớp mô phỏng\n+ chạy thật từng đề thi mẫu"]
    B --> C["rsync code sang VPS\nloại .env / node_modules / dist"]
    C --> D["SSH vào VPS\ntự gọi lại deploy.sh ở chế độ VPS"]
    D --> E["Build image backend, RỒI MỚI frontend\ntuần tự — chống OOM"]
    E --> F["up -d --force-recreate\nswap nguyên tử, không --build"]
    F --> G["npx prisma migrate deploy"]
    G --> H["13 bước seed nội dung, idempotent"]
    H --> I["Health check nội bộ\n18 lần × 10 giây"]
    I --> J["Smoke-test 29 route không xác thực\n404 = build cũ, dừng deploy"]
    J --> K["Kiểm hash gói JS của /playground"]
    K --> L["nginx -s reload"]
    L --> M["docker prune\ngiữ 8GB cache build"]
```

Hai bước tiền kiểm chạy **trước cả rsync**, ngay trên máy local: đối chiếu giáo trình với danh sách kịch bản mô phỏng, và **chạy thật** từng đáp án mẫu của đề thi để so `expectedOutput` — hỏng thì dừng lại trước khi động tới VPS.

Build backend rồi mới build frontend là một quyết định chống lỗi cụ thể: build song song trên VPS 8GB từng bị kernel OOM-kill (`exit 137`) vì cache bị dọn sạch sau mỗi lần deploy nên mọi build đều là build nguội. Bước swap container (`--force-recreate`) cố tình **không** kèm `--build`, vì Compose sẽ dựng lại cả hai image song song ngay tại đó — phá đúng hàng rào vừa dựng ở bước trước.

Smoke-test 29 route là lớp phòng thủ học từ một sự cố thật: một bản deploy từng có container báo "healthy" (vì health-check chỉ chạm một route tĩnh) trong khi route `/api/v1/gifs` bị 404 — ảnh production không mount route đó dù mã nguồn có đủ. Từ đó, mỗi module tính năng mới thêm một route GET không tham số/không xác thực vào danh sách smoke-test, và `404` ở bất kỳ route nào trong danh sách sẽ chặn hẳn deploy.

:::warning[Chỉ một workflow chạy tự động khi push]
Trong 10 GitHub Actions workflow của repo, duy nhất `ci-lint.yml` (type-check + test) chạy tự động trên push/PR. Mọi workflow triển khai — kể cả bản "fast path" qua GHCR — đều `workflow_dispatch`-only, tức phải bấm tay. Quyết định này tới sau hai sự cố thật: hai workflow deploy từng đua nhau chạy cùng lúc khi push lên `main`, một lần làm feed trả 500 vì schema lệch với image, một lần làm backend bị race điều kiện recreate container (`Exited(137)` + container mồ côi). "Push lên main = production tự deploy" nghe tiện, nhưng tiện đến mức hai quy trình độc lập cùng động vào một container thì không còn là tiện nữa.
:::

Nginx đứng giữa mọi request và trả giá bằng việc phải tự chuyển tiếp mọi ngữ cảnh: giao thức gốc, tên miền gốc, và IP người dùng — ba thứ đó biến mất sau proxy trừ khi được chép thủ công vào header (`X-Forwarded-For`, `X-Forwarded-Proto`). Quên một dòng không gây lỗi ngay — nó chỉ lộ ra rất xa, thường là ở một tính năng chẳng liên quan gì tới networking. (Kịch bản mô phỏng tái hiện đúng sự cố này — xem phần Tài nguyên.)

## Tầng AI / LLM

Không có một "AI service" duy nhất — có ba, cố ý tách biệt:

| Stack | Dùng cho | Provider | Model mặc định |
|---|---|---|---|
| A — đa nhà cung cấp, fallback theo thứ tự | AI Chat tầng miễn phí | Groq → OpenRouter → OpenAI | `llama-3.1-8b-instant` |
| B — gateway tương thích Anthropic (lõi nền tảng) | Interview, My Language, Code Lab, Tech Trends | Anthropic-compatible gateway | Sonnet cho tương tác, Opus cho báo cáo/sinh nội dung |
| C — router riêng của CV Builder | Phản biện CV, dịch, viết lại | Theo từng tác vụ (`LLM_PROVIDER_<TASK>`) | Opus cho critique, Haiku cho phần còn lại |

Không có SDK Anthropic chính thức trong `package.json` — stack B/C gọi thẳng bằng `fetch`. Embedding chạy **hoàn toàn local**: `Xenova/all-MiniLM-L6-v2` qua ONNX, 384 chiều, không tốn API call, không network — chỉ phục vụ RAG cho chatbot của site. Cơ sở tri thức của Interview Simulator **không** có cột embedding; nó tra cứu bằng `tsvector` của Postgres thuần lexical, vì image Postgres đang chạy production không có `pgvector` (gói `pgvector` có trong `package.json` nhưng không nơi nào import).

:::warning[Ba circuit breaker độc lập, và lý do cái thứ hai chia theo "giỏ"]
Stack B chia circuit breaker thành từng "giỏ" theo tính năng (`interview`, `language`, `cv`, `chat`, `bulk_gen`, `exphub`, `codelab`) thay vì một bộ đếm chung. Lý do: một lần production có 1.840 lời gọi nền thất bại (job sinh nội dung hàng loạt cho Exp Hub + bulk-gen) đã làm sập luôn cả tính năng chat tương tác của người dùng đang online, vì tất cả dùng chung một circuit breaker toàn cục. Chia giỏ nghĩa là một job nền hỏng không còn kéo sập tính năng người dùng đang chạm vào.
:::

Có kill-switch toàn nền tảng (`FORCE_STATIC_MODE=true` tắt hết LLM), quota hai tầng (request/phút qua Redis, token/ngày qua bảng log chi phí `Decimal(12,6)` — model lạ mặc định về giá cao nhất thay vì 0, để chi phí không bao giờ âm thầm biến mất khỏi báo cáo), và một nguyên tắc chống bịa xuyên suốt: AI critique của CV Builder **không được phép** phát minh số liệu người dùng chưa cung cấp — phải trả về `needsUserInput` thay vì đoán.

## Realtime & luồng dữ liệu

Bảy module dùng Socket.IO thật (Messenger, Presence, Feed, Notifications, Announcement, Music access, Listen Together) qua một adapter Redis best-effort — Redis chết thì tụt về in-memory kèm cảnh báo, chấp nhận mất fan-out đa tiến trình chứ không chấp nhận sập server. Phần còn lại của nền tảng (Interview, CV, Code Lab, Exam, Finance...) cố tình **không** realtime — REST và cache là đủ, mở thêm kênh socket chỉ thêm bề mặt lỗi cho tính năng không cần nó.

AI Chat là ngoại lệ duy nhất dùng Server-Sent Events thay vì Socket.IO — vì đó là luồng một chiều (server → client, token LLM đổ về liên tục) không cần độ phức tạp hai chiều của WebSocket. Điểm kỹ thuật đáng nhớ nhất ở đây là header `X-Accel-Buffering: no`: thiếu nó, Nginx đệm toàn bộ response lại rồi mới trả một cục — người dùng nhìn thấy chatbot "đứng hình" rồi trả lời tức thì, đúng ngược lại hiệu ứng streaming cần có.

## Kiểm thử & đánh giá chất lượng

Bức tranh trung thực: dự án **không** có độ phủ kiểm thử cao, và đó là một lựa chọn có thể tranh luận — nhưng chỗ nó chọn để kiểm thử thì không ngẫu nhiên.

**34 test case, 4 file, chạy bằng test runner có sẵn của Node** (`tsx --test`, không Jest, không Vitest — bớt một phụ thuộc nặng):

| File | Test case | Kiểm cái gì | Vì sao đúng chỗ này |
|---|---|---|---|
| `src/services/finance/money.test.ts` | 4 | Số học tiền tệ, làm tròn HALF_UP, kỳ cuối hấp thụ sai số | Hàm **thuần**, không chạm DB — sai một xu là người dùng phát hiện ngay |
| `src/services/payment/vnpay.test.ts` | 3 | Ký và xác minh chữ ký VNPay | Sai chữ ký = thanh toán hỏng hoặc lỗ hổng giả mạo |
| `src/services/cv/cv.test.ts` | 13 | Bộ luật chấm bullet CV (tất định) | Luật cộng-trừ điểm phải ổn định qua mọi lần sửa |
| `src/utils/crypto.test.ts` | 14 | HMAC, presigned URL, băm | Sai thầm lặng, không lộ ra qua thao tác tay |

Nguyên tắc chọn rút ra được: **kiểm thử tập trung vào phần tất định, thuần, và sai-thì-im-lặng.** Một hàm tính lãi suất sai không ném lỗi — nó chỉ trả về con số hơi lệch, và không ai phát hiện cho tới khi khách hàng đối chiếu. Ngược lại, một route CRUD hỏng thì lộ ra ngay lần bấm đầu tiên. Với một người làm trong 50 ngày, đầu tư kiểm thử vào nhóm thứ nhất cho tỉ lệ hoàn vốn cao hơn hẳn.

:::warning[Một lỗ hổng quy trình thật, tìm ra khi viết mục này]
`package.json` khai `"test": "tsx --test src/services/finance/money.test.ts src/services/payment/vnpay.test.ts src/services/cv/cv.test.ts"` — **liệt kê tường minh từng file**, và `src/utils/crypto.test.ts` (14 test case, nhiều nhất trong bốn file) **không có trong danh sách**. Nghĩa là CI chưa bao giờ chạy nó. Đây là hệ quả của việc liệt kê file bằng tay thay vì dùng mẫu glob: thêm file test mới mà quên sửa `package.json` thì nó tồn tại nhưng không ai chạy. Cách sửa đúng là đổi sang `tsx --test "src/**/*.test.ts"`.
:::

**Ba bộ đánh giá AI chạy trong CI** — đây mới là phần đặc sắc, vì kiểm thử phần mềm thường và đánh giá đầu ra mô hình là hai bài toán khác nhau. `ci-lint.yml` chạy tuần tự: `npx tsc --noEmit` → `npm run eval:grader` → `npm run eval:cv-linter` → `npm run eval:cv-fabrication` → `npm test` → `npm run lint` (không chặn).

`eval:cv-fabrication` là bộ đáng nói nhất: nạp một CV **cố tình không có con số nào**, rồi bắt lỗi nếu AI trả về `suggestedFix` chứa một con số mà không đặt `needsUserInput`. Nói cách khác, đây là **một bài kiểm tra tự động cho việc AI có bịa hay không** — đúng loại rủi ro mà kiểm thử phần mềm truyền thống không chạm tới. (Bộ này hiện đang ngủ trong CI vì secret khoá API đã bị gỡ có chủ đích — xem mục Nợ kỹ thuật.)

**Còn thiếu, nói thẳng:** không có kiểm thử tích hợp chạm database thật, không có kiểm thử end-to-end cho luồng thanh toán (dù `playwright` có trong devDependencies và được dùng cho việc dựng video mô phỏng), và không đo độ phủ. Với một hệ thống có tiền đi qua, đây là khoản nợ đứng đầu danh sách nếu có người thứ hai tham gia.

## Sao lưu & khôi phục

`scripts/backup-cron.sh` chạy **2 giờ sáng mỗi ngày** (crontab do `backend-vps.yml` cài đặt, không phải thao tác tay):

```bash
D=$(date +%Y%m%d_%H%M%S)
F="/opt/cuonghoangdev/backups/${D}_backup.sql.gz"
docker exec cuonghoangdev_postgres pg_dump -U postgres cuonghoangdev_db | gzip > "$F"
```

Nhưng phần đáng học nằm ở bước thứ hai — **bản sao ngoài máy chủ**, và cách nó xử lý thông tin xác thực:

```bash
# Đọc R2_BACKUP_* từ file env của VPS rồi TIÊM vào một lệnh docker exec DÙNG MỘT LẦN.
# Container backend chạy thường trực KHÔNG BAO GIỜ mang khoá ghi backup.
docker exec -e R2_BACKUP_BUCKET="$BK_BUCKET" \
            -e R2_BACKUP_ACCESS_KEY_ID="$BK_AK" \
            -e R2_BACKUP_SECRET_ACCESS_KEY="$BK_SK" \
            cuonghoangdev_backend node /app/backup-r2-upload.mjs ...
```

Ba quyết định trong sáu dòng đó, mỗi cái chống một rủi ro cụ thể:

- **Đặc quyền tối thiểu.** Khoá có quyền **ghi** vào bucket sao lưu không nằm trong biến môi trường của container thường trực. Nếu ứng dụng bị chiếm quyền, kẻ tấn công không có sẵn khoá để **xoá hoặc mã hoá chính bản sao lưu** — đây là kịch bản mà phần lớn hệ thống bị ransomware thất thủ.
- **Bucket sao lưu tách khỏi bucket media.** Hai bộ khoá khác nhau, hai phạm vi khác nhau.
- **Thất bại ở bước tải lên KHÔNG làm hỏng bản sao lưu cục bộ.** Lệnh bọc trong `|| echo WARN` — mất mạng tới R2 thì vẫn còn bản trên đĩa VPS, thay vì mất cả hai.

:::note[Đính chính một nhận định trong chính bài này]
Phần mở đầu bài viết nói rằng "một vài chi tiết vận hành trên VPS thật (crontab, tường lửa) không nằm trong repo nên không thể xác minh từ đây". Với **crontab sao lưu thì điều đó không còn đúng**: `backend-vps.yml` cài đặt crontab một cách tường minh và `scripts/backup-cron.sh` nằm ngay trong repo. Nhận định gốc đúng vào thời điểm viết nhưng đã lạc hậu — và việc đính chính nó ngay tại đây, thay vì lặng lẽ sửa dòng cũ, là đúng tinh thần "ghi lại cái sai" của toàn bài.
:::

**Chỗ vẫn còn hở:** không có bằng chứng nào trong repo cho thấy bản sao lưu **từng được khôi phục thử**. Một bản sao lưu chưa bao giờ phục hồi thử thì chưa phải bản sao lưu — nó chỉ là một file `.gz` mà người ta hy vọng là đúng. Phép kiểm tối thiểu nên có: mỗi tháng lấy bản mới nhất, `gunzip | psql` vào một database trống, rồi đếm số bảng và số dòng ở vài bảng lõi.

## Chỉ mục & hiệu năng truy vấn

`prisma/schema.prisma` khai **411 `@@index`** và **77 `@@unique`** trên 248 model — trung bình gần 2 chỉ mục mỗi bảng, con số cho thấy chỉ mục được đặt lúc thiết kế model chứ không phải vá sau khi có sự cố chậm.

Ba mẫu hình đặt chỉ mục lặp lại xuyên suốt, đáng học vì mỗi cái ứng với một dạng truy vấn:

```prisma
// 1. Chỉ mục KÉP theo (khoá ngoại, cột sắp xếp) — cho "lấy con của cha này, đúng thứ tự"
@@index([projectId, order], name: "idx_project_milestones_project_order")

// 2. Chỉ mục BA CỘT khi có thêm cột lọc — thứ tự cột PHẢI khớp thứ tự dùng trong WHERE
@@index([projectId, kind, order], name: "idx_project_list_items_project_kind_order")

// 3. @@unique làm RÀNG BUỘC NGHIỆP VỤ, không chỉ để tăng tốc
@@unique([userId, courseId])                    // chống ghi danh trùng
@@unique([userId, itemType, itemId])            // một tiến độ cho một mục
@@unique([messageId, userId, emoji])            // một người một emoji một lần
```

Nhóm thứ ba là điểm đáng nhớ nhất và cũng là sợi chỉ xuyên suốt cả case-study: **nhiều `@@unique` trong schema này không tồn tại vì hiệu năng mà vì tính đúng đắn.** Ràng buộc `@@unique([messageId, userId, emoji])` chính là thứ khiến cơ chế bật/tắt reaction hoạt động đúng khi có hai request đồng thời — logic ứng dụng không cần khoá gì cả, database từ chối bản ghi thứ hai. Cùng nguyên tắc với `updateMany({ where: { status: 'AVAILABLE' } })` ở phần Shop: **đẩy điều kiện xuống nơi có tính nguyên tử**.

**Chỗ chưa làm, nói thẳng:** không có bằng chứng trong repo về việc chạy `EXPLAIN ANALYZE` một cách hệ thống, không có ngưỡng cảnh báo truy vấn chậm, và không có số đo độ trễ theo phân vị (p95/p99) cho bất kỳ endpoint nào. Với 63 router, nhiều khả năng có truy vấn N+1 chưa ai phát hiện — cách rẻ nhất để tìm là bật ghi nhật ký truy vấn của Prisma ở dev rồi mở vài trang danh sách và **đếm**.

## Nếu bị hỏi trong phỏng vấn — dự án này trả lời được câu nào

Một hệ thống 248 model không tự động thành câu chuyện phỏng vấn tốt. Cái làm nên câu trả lời hay là **một quyết định cụ thể, lý do đằng sau, và cái giá đã trả**. Dưới đây là những cặp câu hỏi–chỗ trả lời trong chính bài này:

| Câu hỏi thường gặp | Trả lời bằng phần nào | Điểm mấu chốt nên nói |
|---|---|---|
| "Kể về một sự cố production và cách bạn xử lý" | Hạ tầng & triển khai | Deploy báo "healthy" trong khi route 404 vì ảnh cũ ⇒ thêm smoke-test 29 route, `404` chặn hẳn deploy |
| "Bạn xử lý đồng thời thế nào?" | Shop — pool key | `updateMany({where:{status:'AVAILABLE'}})` là so sánh-và-đổi nguyên tử; kẻ thua nhận `count=0` và thử key kế tiếp |
| "Idempotency là gì, bạn dùng ở đâu?" | Shop — chống double-fulfill | Webhook có thể tới hai lần hoặc không bao giờ tới ⇒ `updateMany` PENDING→PAID + đối soát chủ động, cả hai nhánh gọi cùng một hàm |
| "Vì sao không dùng float cho tiền?" | Finance | IEEE-754, `Prisma.Decimal`, làm tròn HALF_UP sau **mỗi bước**, kỳ cuối hấp thụ sai số |
| "Thiết kế hệ thống realtime thế nào?" | Presence | Audience = bạn bè ∪ peer thread, không `io.emit()` toàn cục — bản cũ gây "O(N²) storm during deploy reconnects" |
| "Bạn bảo mật API ra sao?" | Bảo mật & xác thực | `authenticate` truy DB lại mỗi request (token sống 7 ngày, khoá tài khoản phải có tác dụng ngay), rate-limit `failOpen`, chống XFF giả mạo |
| "Dùng AI trong sản phẩm thật thế nào?" | Tầng AI + Interview + CV | Lõi deterministic chạy được khi tắt LLM; evidence-gating chống bịa; circuit breaker chia theo giỏ sau sự cố 1.840 lời gọi |
| "Bạn đánh đổi cái gì và vì sao?" | Code Lab | Không có sandbox thật, biết rõ, ghi ra, và giải thích được vì sao chấp nhận được ở ngữ cảnh này mà không chấp nhận được nếu tự động chấm bài |
| "Bạn kiểm thử thế nào?" | Kiểm thử & đánh giá | Kiểm thử tập trung vào phần tất định và sai-thì-im-lặng; và thừa nhận thẳng chỗ còn thiếu |
| "Nếu làm lại, bạn làm khác gì?" | Nợ kỹ thuật + Lộ trình | Sáu giai đoạn, và lý do mỗi lớp phòng thủ trong `deploy.sh` ra đời sau một sự cố cụ thể |

Một lưu ý về cách kể: **câu trả lời mạnh nhất trong bảng trên đều có một con số hoặc một sự cố thật đứng sau.** "Tôi dùng Redis để cache" là câu ai cũng nói được; "một job nền hỏng 1.840 lời gọi từng kéo sập chat của người dùng đang online, nên circuit breaker phải chia theo giỏ tính năng chứ không dùng bộ đếm chung" thì không.

## Nợ kỹ thuật — nói thẳng, không giấu

Một case-study trung thực phải liệt kê cả phần chưa xong. Đây là những gì đang biết rõ và đang xếp hàng:

1. **Code Lab không có sandbox chạy code thật.** Runner client-side gọi `new Function(code)` ngay trong realm của trang — same-origin, không sandbox, không timeout. Đối chiếu: `/algorithms` giải đúng bài toán này bằng Web Worker + timeout cứng, trong cùng repo (xem mục "Cơ chế hoạt động" phía trên). Việc "đã giải" ở Code Lab hiện chỉ là một cờ trạng thái, không có test harness đứng sau.
2. **Story đã code xong nhưng chưa gắn route.** Backend đủ 13 endpoint, component frontend 623 dòng — nhưng không nơi nào trong app import nó. Chưa rõ là cố ý hoãn hay bỏ sót giữa chừng.
3. **Semantic search chưa bật cho Interview knowledge base** — đang lexical-only vì thiếu `pgvector` ở image Postgres production.
4. **Hai cách băm IP khác nhau song song** (HMAC đúng chuẩn vs. hàm băm 32-bit yếu) — cần gộp về một hàm dùng chung.
5. **Redis publish thẳng ra host không đặt mật khẩu** trong file cấu hình repo — cần xác minh lại tường lửa VPS thật có chặn cổng này từ ngoài hay không (không thể xác minh từ trong repo).

:::tip[Vì sao liệt kê nợ kỹ thuật ra công khai]
Một hệ thống 248 model, xây trong 50 ngày, không có bàn tay thứ hai review — sẽ luôn có nợ. Ghi nó ra rõ ràng, kèm lý do tại sao nó ở đó, là cách duy nhất để nợ không âm thầm biến thành sự cố production lần thứ tư.
:::

## Nếu bạn muốn tự làm lại từ đầu — lộ trình gợi ý

Toàn bộ bài viết ở trên mô tả hệ thống *đã* hoàn chỉnh — nhưng không ai dựng 248 model và 46 module cùng một lúc. Đây là thứ tự thực tế nên đi nếu muốn tự xây một nền tảng tương tự từ con số 0, dựa trên chính cách dự án này đã lớn lên (xem lại timeline ở đầu bài): mỗi giai đoạn chỉ nên bắt đầu khi giai đoạn trước đã chạy ổn định.

**Giai đoạn 1 — lõi xác thực và một domain dữ liệu duy nhất.** Trước khi nghĩ tới 248 model, dựng đúng 6-10 model đầu tiên: `User`, `Role`, `UserRole`, một domain nghiệp vụ đơn giản (ví dụ Blog hoặc Skills — xem mục Kiến trúc Database). Làm đúng ba thứ ngay từ đầu vì sửa lại sau này tốn công gấp nhiều lần: (a) JWT + refresh token + cookie httpOnly (mục Bảo mật), (b) middleware `authenticate`/`requireRole` tái sử dụng được (mục Kiến trúc Backend), (c) quy ước `*.routes.ts` → `*.service.ts` → Prisma ngay từ route đầu tiên, đừng để logic nghiệp vụ lẫn vào route rồi tái cấu trúc sau.

**Giai đoạn 2 — một tính năng realtime để học Socket.IO đúng cách.** Messenger hoặc Presence (mục Cơ chế hoạt động) là lựa chọn tốt vì nó ép bạn phải giải quyết đúng những vấn đề realtime kinh điển: quy ước room (theo user, theo tài nguyên — không bao giờ `io.emit()` toàn cục), xác thực lại ở tầng sự kiện chứ không chỉ lúc bắt tay, và Redis adapter nếu định chạy nhiều instance sau này.

**Giai đoạn 3 — một hệ nội dung có seed-from-code.** Trước khi xây UI nhập liệu qua admin, thử mô hình "content-as-code" mà Academy & Courses dùng: nội dung là file `.mjs`/`.md` trong repo, một script seed idempotent đọc và upsert theo khoá tự nhiên. Lợi ích lớn nhất thấy ngay: mọi thay đổi nội dung review được qua `git diff`, không biến mất sau một lần submit form.

**Giai đoạn 4 — hạ tầng deploy, trước khi hệ thống lớn tới mức deploy sai một lần là mất nhiều giờ dọn dẹp.** Dựng Docker Compose (Postgres + Redis + app), viết một script deploy đơn giản trước, rồi bồi dần từng lớp phòng thủ theo đúng thứ tự dự án này đã đi: build tuần tự chống OOM → force-recreate không kèm build → health check → smoke-test route → (khi có asset tĩnh build riêng) kiểm hash asset. Đừng cố viết đủ cả 7 lớp ngay từ đầu — mỗi lớp trong `deploy.sh` ra đời sau một sự cố thật cụ thể; thêm nó khi bạn thực sự gặp đúng sự cố đó dễ nhớ hơn nhiều so với copy nguyên xi từ đầu.

**Giai đoạn 5 — AI là tầng cộng thêm, không phải lõi.** Bài học lớn nhất rút ra từ Interview Simulator, CV Builder, và Phòng thi: xây **lõi deterministic chạy được khi tắt hẳn LLM** trước (chấm bằng luật, khớp từ khoá, rules-engine) — AI chỉ nên là lớp phủ lên trên, có thể tắt bằng một biến môi trường (`FORCE_STATIC_MODE`) mà không phá chức năng cốt lõi. Thêm circuit breaker theo tính năng (không dùng một bộ đếm toàn cục) trước khi có nhiều hơn một luồng gọi AI trong hệ thống — chia giỏ từ đầu rẻ hơn nhiều so với chia lại sau khi một job nền đã từng kéo sập tính năng người dùng.

**Giai đoạn 6 — công cụ trực quan hoá, nếu sản phẩm cần.** Ba lựa chọn engine trong bài (Canvas 2D cho Xưởng mô phỏng, Web Worker cho Algorithm Visualizer, WebGPU cho Sân chơi 3D) không phải ba cách làm một việc — mỗi cái giải đúng một bài toán khác nhau. Trước khi chọn engine, tự hỏi: có cần xuất video không (Canvas + `captureStream`)? có chạy code không tin cậy của người dùng không (Worker + timeout)? có cần đồ hoạ 3D thời gian thực không (WebGPU)? Chọn sai engine ngay từ đầu là khoản nợ kỹ thuật tốn công refactor nhất trong toàn bộ danh sách ở mục trên.

**Xuyên suốt mọi giai đoạn:** viết nợ kỹ thuật ra ngay khi phát hiện, đừng đợi tới lúc viết case-study mới liệt kê. Một dòng comment "biết rồi, chưa sửa, đây là lý do" ngay tại chỗ có giá trị hơn nhiều một bài viết hồi tưởng sau 50 ngày.

## Kết quả hiện tại

248 model Prisma · 95 migration · 63 router backend · 180 trang frontend · 348 component · ~316.000 dòng TypeScript · 46 module tính năng · 62 kịch bản mô phỏng · 80 thuật toán trực quan hoá · 33 lộ trình học · 1.286 node roadmap · 1.672 commit trong hơn 50 ngày.

Còn dang dở, đang tiếp tục: sandbox chạy code thật cho Code Lab, gắn route cho Story, bật semantic search cho Interview, và một vòng dọn nợ bảo mật nhỏ (thống nhất hàm băm IP, xác minh tường lửa Redis).
