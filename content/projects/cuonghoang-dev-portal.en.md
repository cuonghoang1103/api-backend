# cuongthai.com (Portfolio web)

The first commit is dated `2026-06-08`: *"init optimized nodejs backend with pgvector infrastructure for VPS"*. The next seven commits, all within the same 24 hours, are every one of them `fix:` — a build path disagreeing with tsconfig, a failing Docker build, an rsync that deleted a data volume. There was never a "design phase" separate from a "coding phase": the architecture was bent by each failed deployment, starting on day one.

Fifty days and 1,672 commits later, this is what stands: 248 Prisma models, 63 backend routers under `/api/v1/*`, 180 frontend pages, 348 React components, and roughly 316,000 lines of TypeScript (80,795 backend, 235,762 frontend). A social network with Messenger, Feed and Stories; a learning platform with an AI-graded Exam Room; a simulation studio that renders lesson videos on canvas; a 3D driving playground running on WebGPU; and an LLM layer across three providers with per-feature circuit breakers.

This article is not feature marketing, and it does not stop at the "case study glancing at the architecture" level. It is written so that somebody who **knows nothing about this project** can read it end to end and rebuild a comparable system: from installing Node, Postgres and Redis, through how 248 models relate to one another, how a request traverses the middleware stack, how each major module actually works, and which production incidents taught this system to defend itself.

:::note[How to read this]
Every figure, file path and line number here was verified directly against the source at the time of writing (late July 2026) rather than inferred from variable names. A few operational details on the real VPS — crontabs, firewall rules — live outside the repository and could not be verified from here; those are marked "unverified" rather than assumed. The table of contents alongside is multi-level; click any entry to jump straight to it.
:::

## Architecture at a glance

One domain, five Docker containers, three storage layers:

```mermaid
flowchart TB
    Browser["Browser"]
    Browser -->|"HTTPS :443, TLS 1.2/1.3"| Nginx["Nginx 1.27 — TLS termination"]

    subgraph VPS["VPS 8GB RAM — Docker compose, bridge network"]
        Nginx -->|"location / → :3000"| FE["frontend — Next.js 15 standalone"]
        Nginx -->|"location /api/ → :3001"| BE["backend — Express + TypeScript"]
        Nginx -->|"location /uploads/ → disk"| Disk[("bind mount /opt/.../uploads")]
        Nginx -->|"location /socket.io/ → :3001, timeout 24h"| BE
        FE -->|"SSR: internal fetch http://backend:3001"| BE
        BE --> PG[("PostgreSQL 16 + PostGIS")]
        BE <-->|"cache, rate limits, AI quota, OTP, pub/sub adapter"| Redis[("Redis 7")]
    end

    BE -->|"presigned PUT/GET"| R2[("Cloudflare R2 — object storage")]
    BE -->|"fetch — no SDK"| LLM["Anthropic-compatible gateway · Groq · OpenRouter"]
    Browser -.->|"rewrite /playground, separate Vite app, own CSP"| FE
```

One domain serves two applications: Nginx's `location /api/` forwards to Express and everything else goes to Next.js. Inside the Docker network the backend listens on port 3001 **unencrypted** — which sounds alarming until you remember that port is not published to the host and TLS already terminated at Nginx. Redis is not merely a cache: it also backs rate limiting, AI quotas, OTP storage, and the pub/sub adapter that lets Socket.IO run across multiple processes. R2 (S3-compatible) holds all media through presigned URLs, with no true multipart — large files go up in a single PUT against a URL signed for 3600 seconds.

`/playground` is a deliberate architectural exception: a **completely separate** Vite/Three.js application, built into `frontend/public/playground/` and pulled in through a Next.js `rewrite`, carrying its own CSP (see the security section).

## Starting from zero — rebuilding this environment

### 1. System requirements

Before cloning anything, the machine needs:

- **Node.js 20.x or newer** — the root `package.json` declares `"engines": { "node": ">=20.0.0" }`. The code itself is ESM (`"type": "module"`) and runs through `tsx` (TypeScript executed directly, with no build step in development), so an older Node breaks on import/export syntax.
- **PostgreSQL** — mandatory, and not plain Postgres but **PostGIS + pgvector** (the schema uses `pgvector` for AI embeddings; see the `pgvector: 0.3.0` dependency in `package.json`). The project's official image is `postgis/postgis:16-3.4`.
- **Redis** — used for caching, rate limiting (`rate-limit-redis`), and the Socket.IO adapter when running multiple instances (`@socket.io/redis-adapter`). Without Redis parts of the app still run, but rate limiting and caching will not behave as designed.
- **npm** (not yarn or pnpm) — neither `package.json` (root or `frontend/`) carries a lockfile from another tool.
- Optional, but required by specific features: **ffmpeg** (audio and video processing), **yt-dlp** (downloading music from YouTube), and Docker if you would rather not install Postgres and Redis locally.

These are two independent codebases in one repository: the Express + TypeScript backend at the root, the Next.js frontend under `frontend/`. They have separate `package.json` files, separate `node_modules`, and entirely separate install and run lifecycles.

### 2. Clone and install dependencies

```bash
git clone <repo-url> api-backend
cd api-backend

# Backend (from the repository root)
npm install

# Frontend (its own directory)
cd frontend
npm install
cd ..
```

These two `npm install` runs are independent — installing the backend does not install the frontend, and vice versa.

### 3. Configure environment variables

```bash
cp .env.example .env
cp frontend/.env.example frontend/.env.local
```

The backend reads `.env` through `dotenv`, but more importantly `src/config/env.ts` uses **Zod** to validate every environment variable at application startup. Under `NODE_ENV=production`, a missing or malformed required variable makes the app **refuse to start** rather than run quietly with garbage values — a deliberate choice, avoiding the "auth broke at 3am because a secret was empty" class of failure. In development it merely warns and continues.

The important variable groups, by purpose:

**Server and database.** `PORT` (default 3001) and `NODE_ENV` determine the run mode. `DATABASE_URL` is a standard Postgres connection string, `postgresql://user:pass@host:port/db?schema=public` — `env.ts` validates that it begins with `postgresql://` or `postgres://`, so a malformed value is rejected at boot rather than surfacing later as a Prisma connection error.

**JWT and sessions.** `JWT_SECRET` signs and verifies access tokens — the proof of "which user is calling this API". `JWT_REFRESH_SECRET` is a separate secret for refresh tokens, which live longer and mint new access tokens without forcing the user to log in again. The secrets are separated so that a leaked access token does not enable forging refresh tokens. `JWT_EXPIRES_IN=24h`, `JWT_REFRESH_EXPIRES_IN=7d`.

**COOKIE_SECRET and SIGNED_URL_SECRET.** `COOKIE_SECRET` signs cookies, preventing client-side tampering. `SIGNED_URL_SECRET` produces the HMAC-SHA256 for time-limited upload and download URLs — a link that cannot be guessed or reused indefinitely.

All of these secrets are forced by Zod to be **at least 32 characters**, and familiar placeholders such as `"change-me"` are rejected outright. Generating valid ones:

```bash
openssl rand -base64 64   # JWT_SECRET / JWT_REFRESH_SECRET
openssl rand -base64 32   # COOKIE_SECRET / SIGNED_URL_SECRET
```

**Redis.** `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `REDIS_DB` — serving cache, rate limiting, AI quotas, OTP and the Socket.IO adapter.

**CORS and frontend.** `ALLOWED_ORIGINS` is a comma-separated list of domains permitted to call the API from a browser with cookies. Local development usually needs only `http://localhost:3000`.

**R2 (Cloudflare — file storage).** `R2_BUCKET_NAME`, `R2_PUBLIC_URL`, `R2_ENDPOINT_URL`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` — all four must be present for the system to select `R2StorageProvider`. With any one missing, the app falls back to `LocalStorageProvider`, writing files to the host disk — convenient for local development, but production requires R2.

**Admin and OAuth.** `ADMIN_EMAILS` lists the addresses granted admin rights at registration or login. `GOOGLE_CLIENT_ID/SECRET` and `GITHUB_CLIENT_ID/SECRET` are optional OAuth credentials — leaving them blank disables the corresponding button rather than crashing the app.

**Other groups (optional, degrading safely when absent):** email (Resend/SMTP), payments (PayOS/VNPay), AI (several modules switch to "STATIC mode" without a key), Sentry (disabled entirely on an empty DSN), and the YouTube Data API. The common thread: most are designed so that **missing values still run**, disabling only the relevant feature. Only the JWT, cookie, signed-URL and database groups are hard requirements.

On the frontend side, `frontend/.env.local`'s most important variables are `AUTH_SECRET` (NextAuth v5) and `NEXT_PUBLIC_API_URL` pointing at the backend. One convention learned from a real incident: every `NEXT_PUBLIC_*` variable is **baked into the JavaScript bundle at build time** — changing the value after a build has no effect until you rebuild — so third-party keys must never be `NEXT_PUBLIC_*` and must instead go through a backend proxy route that keeps the key server-side.

### 4. Stand up a local database

```bash
docker run -d --name cuonghoangdev_pg \
  -e POSTGRES_DB=cuonghoangdev_db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=123456 \
  -p 5432:5432 postgis/postgis:16-3.4

docker run -d --name cuonghoangdev_redis -p 6379:6379 redis:7-alpine
```

The `docker-compose.yml` at the root is the full production stack for the VPS (backend, frontend and nginx on one network), not a "Postgres and Redis for development" file — it demands mandatory secrets declared as `${VAR:?...}` (a missing one stops `docker compose up` immediately with a clear error) and builds both images, which is heavy work just to obtain a local database. Running the two containers individually, as above, is far more practical for development.

### 5. Run Prisma: generate → migrate → seed

This order **cannot be rearranged**:

```bash
npm run db:generate   # prisma generate
npm run db:migrate    # prisma migrate dev
npm run db:seed       # tsx prisma/seed.ts
```

`db:generate` reads `prisma/schema.prisma` (248 models, 49 enums) and emits the Prisma Client — the types and query API used throughout `src/services/*`. `db:migrate` compares the schema against the migration history, creates a new migration if anything changed, and applies that SQL to the real database — this is the step that **actually creates tables**. Running the seed before it will certainly fail, because the tables do not exist yet. `db:seed` runs `prisma/seed.ts`, which is idempotent (it uses `upsert`), creating roles (`ROLE_ADMIN`, `ROLE_USER`) and admin accounts from `ADMIN_EMAILS`.

Beyond the default `seed.ts`, `prisma/` holds a series of specialised seeds run by hand when needed: `seed.my-language.ts`, `seed.ja-kana.ts` and `seed.hanzi-*.ts` (language-learning data), `seed.interview.ts` (interview questions), `seed.exp-hub.ts`, `seed.finance.demo.ts`, `seed-repos.ts`. Somebody setting up the environment only needs `npm run db:seed`; the rest matter only when you want to exercise the corresponding feature. To browse the data visually, `npm run db:studio` opens Prisma Studio.

### 6. Run the development servers

Two separate terminals:

```bash
# Terminal 1 — backend on port 3001, hot reload through tsx watch
npm run dev

# Terminal 2 — frontend on port 3000
cd frontend && npm run dev
```

The frontend depends on the backend already running with roles and admin seeded. The backend does not depend on the frontend at all; it only needs `ALLOWED_ORIGINS` to match the frontend's port.

### 7. Directory layout

**Backend — `src/`:**
- `routes/` — HTTP endpoint definitions, one file per domain. They declare routes, call middleware and validation, and call services; they contain no business logic.
- `services/` — all business logic and Prisma queries live here. Thin routes and thick services is the convention throughout.
- `middleware/` — `auth.ts` (JWT authentication), `captcha.ts` (Turnstile), `errorHandler.ts` (centralised error handling), `validate.ts` (input validation).
- `config/` — `env.ts`, `database.ts` (the Prisma client), `redis.ts`, `r2.ts`, `payos.ts`.
- `storage/` — the abstraction over where files live (R2 or local disk).
- `socket/` — Socket.IO handling.

**Frontend — `frontend/src/`:**
- `app/` — the App Router; each subdirectory is a route.
- `components/` — organised by domain to mirror `app/` (`components/academy/`, `components/cv/` and so on), plus `components/ui/` and `common/` for shared pieces.
- `store/` — Zustand, one file per domain.
- `lib/` — the Axios client that calls the backend (`api.ts`) and pure-logic utilities.
- `hooks/`, `types/`, `context/`, `config/`, `data/`, `styles/`, `i18n.ts`.

### 8. Naming and coding conventions actually observed

- Backend: every file carries a domain suffix — `<name>.routes.ts` for routes, `<name>.service.ts` for services, split further when a domain grows too large (`codeLab.ai.service.ts`, `codeLab.coach.service.ts`).
- ESM imports carry a full `.js` extension even though the sources are `.ts` — required by `"type": "module"`.
- Prisma columns use `camelCase` in TypeScript but map to `snake_case` in the actual database via `@map("...")`.
- Comments explain *why* rather than only *what*, placed directly above decisions that are easy to misread — a convention applied consistently across the repository.

## Technology stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend | Next.js 15 (App Router, `output: standalone`), TypeScript, TailwindCSS, Zustand, TanStack Query | 180 pages, 348 components, 27 proxy Route Handlers |
| Backend | Node.js 22, Express, TypeScript, Zod + express-validator | 63 routers, compiled with `tsc` |
| Database | PostgreSQL 16 (image `postgis/postgis:16-3.4`) through Prisma ORM | 248 models, 95 migrations, `migrate deploy` — never `db push` in production |
| Cache / light queueing | Redis 7, `allkeys-lru`, AOF enabled | No BullMQ — the embedding queue is a deliberate in-process array |
| Realtime | Socket.IO with `@socket.io/redis-adapter` | 7 modules use realtime; the rest use REST, SSE or polling |
| Storage | Cloudflare R2 (S3-compatible) via `@aws-sdk/client-s3` | Presigned PUT/GET, no true multipart |
| Media pipeline | ffmpeg, sharp, `yt-dlp` | Two-pass EBU R128 loudness normalisation for music, WebM→MP4 transcoding for simulation videos |
| AI/LLM | Anthropic-compatible gateway, Groq, OpenRouter, `@xenova/transformers` (local ONNX embeddings) | Three parallel stacks; no official Anthropic SDK — raw `fetch` calls |
| Infrastructure | Docker Compose (5 services), Nginx reverse proxy, Let's Encrypt, GitHub Actions (manual) | Pushing does NOT deploy — see the infrastructure section |
| Advanced graphics | Canvas 2D (Simulation Studio), Web Worker sandbox (Algorithm Visualizer), Three.js WebGPU + TSL + Rapier WASM (3D Playground) | Three different engines for three different purposes, sharing nothing |

## Backend architecture — how a request traverses the system

Express knows nothing about an application beyond a list of functions called in sequence — *middleware*. Every HTTP request runs that list in **exactly the order they were registered with `app.use()`**, top to bottom. Ninety per cent of the strange failures people hit while learning Express ("why does my middleware never run", "why isn't my thrown error caught") come from registering them in the wrong order.

### 1. The middleware stack — the real order in `src/index.ts`

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

// 7. Static File Serving (development only)
if (config.nodeEnv === 'development' || config.nodeEnv === 'test') {
  app.use('/uploads', express.static(uploadsDir, { ... }));
}

// 8. Rate Limiting
app.use('/api/', failOpen(generalLimiter));
app.use('/api/', sentryRequestMiddleware);

// 9. API Routes (63 routers)
app.use('/api/v1/auth', failOpen(authLimiter), authRoutes);
app.use('/api/v1/profile', profileRoutes);
// ... the other 61 routers ...

// 11. 404 Handler
app.use(notFoundHandler);

// 11b. Sentry Express Error Handler
setupSentryErrorHandler(app);

// 12. Global Error Handler
app.use(errorHandler);
```

Each step solves one specific problem, and its position is **not arbitrary**:

- **Trust proxy must be absolutely first.** Production runs behind Cloudflare → Nginx → Express, two proxy layers. Without declaring it, `req.ip` returns Nginx's internal address rather than the real client IP — and rate limiting then buckets every user together.
- **CORS must precede the body parsers** — browsers send a preflight `OPTIONS` before the real request, and the CORS middleware must answer that preflight before Express tries to parse a body that may not exist.
- **Body parsers must precede every route** — a route registered before `express.json()` sees `req.body` as permanently `undefined`.
- **The rate limiter sits immediately before the routes** — it is the gate in front of business logic.
- **The 404 handler goes after every router** — it is simply the middleware that catches "no route matched".
- **`errorHandler` must be the LAST middleware.** Express identifies error-handling middleware by **counting parameters** — four, `(err, req, res, next)`, instead of three. Any route or middleware calling `next(error)` makes Express skip every ordinary middleware in between to find the nearest error handler *after* it. Register `errorHandler` at the top of the file and it will catch nothing from the 63 routers below, because when it runs those routers do not exist yet.

`setupSentryErrorHandler(app)` sits between the 404 handler and `errorHandler` — also a four-parameter error middleware, which reports to Sentry and then calls `next(err)` to pass the error along. It is proof that Express permits **several error middlewares in sequence**, each handling one aspect and forwarding.

### 2. One request end to end: `POST /api/v1/pro/redeem`

Follow a real request: a user types a Pro activation code and submits it.

**Step 1 — the route receives it and validates superficially.** `src/routes/pro.routes.ts`:

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

Two things to notice: (1) `router.use(authenticate)` applies to the **whole router** — every route declared afterwards requires login automatically, with no repetition; (2) the route handler **writes no business logic** — it pulls data off the request, calls a service, returns a response. All the reasoning lives in the service.

**Step 2 — the service does the work and touches Prisma.** `src/services/pro.service.ts`, function `redeemProCode`:

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

Five consecutive checks, each throwing the moment something is wrong — fail-fast code: no nested `if/else`, just throw and stop on that line. `prisma.$transaction(...)` guarantees that creating the `proRedemption` and incrementing `usedCount` happen **together or not at all** — separated, a code could exceed `maxUses` whenever the increment failed midway.

**Step 3 — where does the error go?** When `redeemProCode` throws `BadRequestError`, the promise rejects. In the route, the `await` sits inside a `try`, so JavaScript enters `catch (err) { next(err); }`. Calling `next(err)` **with an argument** signals Express: this is not the next ordinary middleware, find an error handler. Express skips every remaining ordinary middleware and jumps straight to the global `errorHandler` at the end of `src/index.ts`.

### 3. Centralised error handling: `AppError` and `errorHandler`

Rather than each route inventing its own `res.status(400).json(...)` — 63 routers would produce 63 error formats — the project defines one standard error class:

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

`AppError` is a *deliberate* error — it knows its status code (400/401/403/404/409…) and carries a short `code` the frontend can branch on. `errorHandler`, the four-parameter middleware at the end of the chain, treats error kinds differently:

```ts
export function errorHandler(err, req, res, _next) {
  logger.error('Express error handler', { error: err.message, stack: err.stack });

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Map Prisma errors (Pxxxx) to safe 4xx responses, never exposing table or column names
  if (!err.statusCode && typeof err.code === 'string' && /^P\d{4}$/.test(err.code)) {
    if (err.code === 'P2002') { statusCode = 409; message = 'Giá trị đã tồn tại'; }
    else if (err.code === 'P2025') { statusCode = 404; message = 'Không tìm thấy dữ liệu'; }
    else { statusCode = 400; message = 'Yêu cầu không hợp lệ'; }
  }

  // SECURITY: never leak internal error detail on 5xx
  if (statusCode >= 500) message = 'Internal Server Error';
  if (statusCode >= 500) captureException(err, { url: req.originalUrl, method: req.method, statusCode });

  res.status(statusCode).json({
    success: false, message, code: err.code,
    ...(err.data ? { data: err.data } : {}),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}
```

If `err` is an `AppError`, the status code is already known and `errorHandler` returns the `message` verbatim, because it was written for a human to read ("this code has expired"). If `err` has no `statusCode` — an unexpected failure — the code defaults to 500 and **the real message is replaced by "Internal Server Error"** before the response is sent; the original text goes only to `logger.error` and Sentry, never into the response. Raw Prisma errors (`P2002`, `P2025`…) are caught and mapped to 4xx before they can fall into the 500 branch.

### 4. Authorisation: `authenticate` versus `requireRole` versus `requireAdmin`

**`authenticate`** — checks only "are you logged in", with no interest in roles:

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

`authenticate` does not decode the JWT and simply trust it — it **re-queries the database on every request** to check `enabled` and `accountNonLocked`. The reason: the cookie token lives seven days, so when an administrator locks an account the old JWT remains *cryptographically valid* until it expires. Without the database re-check, a locked account would keep calling the API normally for a week.

**`requireRole(...roles)`** — for routes reachable by several different roles; it re-reads the role from the database and normalises the name (`toUpperCase().replace('ROLE_', '')`) before comparing.

**`requireAdmin(role = 'ROLE_ADMIN')`** — specialised for administrators, decoding the token itself rather than assuming `authenticate` ran first, so it can stand alone.

The selection rule: public route → no middleware; login required but role irrelevant → `authenticate`; a non-admin role group → `requireRole(...)`; system administration → `requireAdmin()`. There is also `optionalAuth`, which decodes a token when present but does not throw when absent — for public routes that personalise themselves for signed-in visitors.

`extractToken` tries **four sources in order**: the `Authorization: Bearer` header, the `backend_token` cookie, a `?token=` query parameter (for SSE), and finally parsing the raw `Cookie` header itself (for the Socket.IO handshake, before `cookie-parser` has run).

### 5. Input validation: `express-validator` versus Zod

**`express-validator`** — rules declared inline in the middleware array, paired with a `validate` middleware:

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

Note that the object passed to `next({...})` is not an `AppError` instance, merely a plain object carrying `statusCode` and `code`. `errorHandler` does not care about the actual class — it reads the `statusCode`, `message` and `code` fields off whatever it receives (duck typing), so both work identically.

**Zod** — used in newer routes, with the schema declared separately and `.safeParse()` called inside the handler:

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

`express-validator` suits simple forms (login, registration). Zod generates **compile-time safe types**, which matters more when payloads nest several levels deep. The project does not pick one and eliminate the other: older code stays as it is because it works, while new modules use Zod for the type safety.

### 6. File organisation conventions: `*.routes.ts`, `*.service.ts`, `*.types.ts`

- **`*.routes.ts`** — declares endpoints, attaches authorisation and validation middleware, and **calls services**. It should hold no complex business logic.
- **`*.service.ts`** — `export async function` declarations of pure business logic, querying and mutating Prisma, and **the only place permitted to `throw new AppError(...)`**. It knows nothing about `req` or `res` — it takes plain arguments and returns plain data, so it can be called from several routes or from a cron job.
- Simple routes that only read static data with no meaningful business logic (`skill.routes.ts`, for example) may call Prisma directly. Where to draw the service boundary depends on **business complexity**, not on a rigid rule.
- **`*.types.ts`** — appears only when a domain has several interfaces or types shared between its routes and services, avoiding duplicated or divergent definitions.

The flow in summary: **request → middleware stack (security, rate limiting, logging) → router matched by prefix → authorisation and validation middleware → service performing business logic and Prisma work → `res.json(...)` on success, or `next(err)` jumping straight to the global `errorHandler`.** Learn that one path and the other 62 routers read themselves.

## Database architecture — organising 248 models without collapse

The repository has a single `prisma/schema.prisma`, 6,980 lines long, declaring 248 models. Without a reading strategy it is simply a wall of text. But it is organised into roughly 30 side-by-side "chapters", each standing on its own.

### Step 1: find the table of contents through comments, not by scrolling

Prisma has no namespace or module concept in its schema language — every model sits flat in one file. The only way to divide 7,000 lines into meaningful sections is a **comment convention**:

```prisma
// ============================================================
// 6. COURSE MODULE (Education / LMS)
// ============================================================
```

```bash
grep -n "^// ====" prisma/schema.prisma
```

That command lists every banner comment — a table of contents for the file without reading all 6,980 lines. Counting models between consecutive banners produces the overall picture: the largest blocks are MoneyFlow Phase 2 (41 models) and Music Post Phase 4 (25 models), both carrying "Phase X" in their names. That is, those modules were not designed whole from the start but accreted across several rounds, each adding new objects rather than reworking old ones. This is precisely how a 248-model schema survives: divided across time.

One detail worth remembering: the block numbers are **neither contiguous nor in file order** — block "13. CONTACT FORM" sits after block "14. SOCIAL FEED". This is not an error: the number was assigned once when the module was born, while its position is wherever Prisma allowed insertion at the moment the code was written. The lesson: **do not infer dependency relationships between modules from their order in the file.**

### Step 2: three relationship shapes repeated 248 times — learn them once

**A simple one-to-many.** One `Project` has many `ProjectMilestone`:

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

The shape is always the same: the "many" side holds the foreign key plus a back-reference field; the "one" side declares only an array. Prisma infers the one-to-many relationship from the fact that one side has an array and the other a scalar foreign key.

**Many-to-many through an explicit join table.** Prisma supports implicit many-to-many, but this schema chooses the **explicit** form, because it allows adding extra columns later without changing the relationship type:

```prisma
model UserRole {
  userId Int
  roleId Int
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  role Role @relation(fields: [roleId], references: [id], onDelete: Cascade)
  @@id([userId, roleId], map: "pk_user_roles")
}
```

`UserRole` has no `id` column of its own — the primary key is the pair `(userId, roleId)`, the standard shape for a pure join table: it exists only to say "user X has role Y", and that pair is naturally unique and therefore naturally the key.

**`@relation("OwnName")` — when one model reaches the same table by several paths.** `MessageThread` points at `User` **four separate times**:

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

Drop the names in parentheses and Prisma fails at `generate`, because it cannot tell which `MessageThread` field pairs with which back-relation on `User` — four relationships to the same table are ambiguous. Naming them is how you tell Prisma "these are four independent paths, do not merge them". The rule to remember: **the name inside `@relation("...")` is only a thread tying two ends of a relationship together — it never appears in the database and it is not a column name.**

### Step 3: compressing three tables into one — the compact schema pattern via `ProjectListItem`

Before `ProjectListItem` existed, each project needed three independent lists: "Core Knowledge", "Portfolio Bonus" and "Completion Outcome". The obvious approach is three identical tables. Instead the schema chose **one table plus an enum column to classify**:

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

The single-table choice pays off at two levels. **At the schema level** — three identical tables are a duplication signal, where every new column means editing three places and risking divergence. **At the API and service level** — three tables need three nearly identical CRUD route pairs, while merging them needs one service and one route set taking an extra `kind` parameter. The general principle: **when N tables share an identical structure and differ only by "kind", consider merging them behind an enum column** rather than duplicating the struct.

### Step 4: the `@@unique(name: "...")` trap — a custom key name must be used verbatim

By default, an unnamed `@@unique([subjectId, recipientId])` produces the compound key `subjectId_recipientId`. But the `NoteSubjectShare` model assigns a **custom name**:

```prisma
model NoteSubjectShare {
  subjectId   Int @map("subject_id")
  recipientId Int @map("recipient_id")
  @@unique([subjectId, recipientId], name: "uk_note_subject_share")
}
```

Because `name` is present, the default `subjectId_recipientId` **no longer exists** — the correct query is:

```typescript
// Wrong:   where: { subjectId_recipientId: { subjectId, recipientId } }
// Correct: where: { uk_note_subject_share: { subjectId, recipientId } }
```

This is a real bug that happened in this project (recorded in `CLAUDE.md`, 2026-06-29). The lesson: **whenever you see `@@unique(..., name: "...")`, look up the exact string in quotes before writing a `where` clause, and never guess using the default `field1_field2` rule.**

### Step 5: `migrate dev` while coding, `migrate deploy` in production — and why never `db push`

- **`prisma migrate dev --name <name>`** — for local development. It compares the schema against migration history, generates a new `.sql` file in `prisma/migrations/`, applies it to the development database, and reruns `generate`. Because it creates a history file, somebody (or CI) can later replay them in order to rebuild the database from scratch.
- **`prisma migrate deploy`** — for production and CI. It **only applies** existing `.sql` files the target database has not yet run, in timestamp order. It generates nothing and asks nothing interactively — safe to run automatically in a pipeline.
- **`prisma db push`** — syncs the schema straight into the database **with no migration file at all**. This project's `CLAUDE.md` states plainly: "NEVER run `npx prisma db push` against production". Use it there and the database structure changes with no `.sql` recording it; the next deployment's `migrate deploy` then finds migration history and reality disagreeing (schema drift), leading straight to a `P3009` error — an incident `CLAUDE.md` lists as having actually happened.

`db push` is reasonable in exactly one case: rapid prototyping against a throwaway database nobody else uses. Never against a database holding real data.

### Step 6: read one real migration file

`prisma/migrations/` holds 95 subdirectories named `<timestamp>_<description>` (for example `20260624000000_add_project_list_items_and_milestone_code/`). The `YYYYMMDDHHMMSS` timestamp determines application order absolutely, independent of git history. The `.sql` contents show how explicitly Prisma translates models into plain SQL:

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

`enum ProjectListKind` becomes a genuine `CREATE TYPE ... AS ENUM` in Postgres — not an application-level string check. `@map("project_id")` is why the SQL column is `project_id` (snake_case) while the Prisma field is `projectId` (camelCase), a convention applied across all 248 models. `onDelete: Cascade` translates into `ON DELETE CASCADE` — deleting a `Project` automatically removes every child `ProjectListItem`, with no application code cleaning up. The 95 timestamped files are a complete, replayable journal of how 248 models were built up over time.

## Frontend architecture — organising 180 pages and managing state

With 180 pages and 348 components, without clear organising rules nobody would know within a few months where a component lives, who owns a piece of state, or which path an API call takes.

### The `src/` map

```
app/        → routing (each subdirectory = one route)
components/ → UI, organised by BUSINESS DOMAIN
store/      → Zustand — long-lived client state
lib/        → api client, utilities, configuration
hooks/      → shared custom hooks (many wrapping TanStack Query)
types/      → TypeScript definitions used throughout
context/    → React Context (ThemeContext, for example)
```

### `app/` — routing by directory structure

The Next.js App Router has no "routes.js" listing routes. A directory inside `app/` **is** a URL: `src/app/roadmap/page.tsx` → `/roadmap`. The 180 pages are 180 `page.tsx` files spread across roughly 40 top-level directories. You never read a configuration file to learn what `/exam` renders — open `src/app/exam/page.tsx` and there it is. Beyond `page.tsx`, `app/` also uses `layout.tsx` (a shared wrapper), `loading.tsx` (an automatic loading state) and `error.tsx` (runtime error boundaries) — framework conventions provided out of the box.

### `components/` — organised by domain, not by type

This is the UI layer's most important architectural decision. There are two common ways to divide: by **type** (`buttons/`, `modals/`, `cards/`), which is easy to picture while learning but scales badly, because one feature ends up with a card in `cards/`, a modal in `modals/` and a form in `forms/`; or by **business domain**, where each feature owns a directory containing all its components. This project chose the second: `components/academy/, admin/, algorithms/, chat/, code-lab/, course/, cv/, exp-hub/, finance/, games/, language/, messaging/, music/, notes/, profile/, projects/, roadmap/, shop/, simulation/, social/…` — one directory per major feature area. Only `components/ui/` and `components/common/` are reasonable exceptions for genuinely shared pieces. The lesson: **when you encounter a large project, look at how it divides its component directories first** — it reveals immediately whether the organising instinct was "feature" or "UI type".

### Server Components versus Client Components — the App Router's most important boundary

By default, **every component under `app/` is a Server Component** — running on the server, with no state, no `onClick`, no `useState` or `useEffect`. To run in the browser with interactivity, the file must declare `'use client'` on its first line.

`src/app/roadmap/page.tsx` is a pure Server Component, declaring only `metadata` (SEO, present in the HTML that ships) before delegating to `RoadmapLanding`:

```tsx
import type { Metadata } from 'next';
import RoadmapLanding from '@/components/roadmap/RoadmapLanding';

export const metadata: Metadata = { title: 'RoadMap — Learning paths by role & skill', ... };
export default function RoadmapPage() { return <RoadmapLanding />; }
```

`src/app/about/page.tsx` is the opposite — `'use client'` on line 1, because it needs `useState`, `useEffect`, animation and a self-typing search box, all of which is browser behaviour.

The selection rule: a page that only displays data, with no clicking, typing or state → Server Component (faster, better for SEO, smaller bundle). A page needing interaction → `'use client'` is mandatory. The common compromise used throughout the project: keep `page.tsx` as a Server Component so it can export `metadata`, then import a child component marked `'use client'` for the interactive part.

### State management — three layers, three tools, three different purposes

- **Local `useState`** — data only one component needs (the text currently in an input, whether a modal is open).
- **Zustand (`store/`)** — client data that must **live a long time and be read by unrelated components**, not necessarily from the server (a shopping cart, the theme, what is currently playing).
- **TanStack Query (`hooks/`)** — data that **comes from the server**, needing caching, automatic refetching, and synchronisation across every place it is displayed.

Put briefly: **Zustand answers "what state is the browser in" while TanStack Query answers "what data does the server have".** They do not replace one another; this project uses both in parallel.

Reading `projectStore.ts`:

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

Three things worth learning here: (1) `create<ProjectState>()` **needs no Provider** — unlike React Context, a Zustand store is a hook usable directly in any component; (2) the `persist` middleware saves state to `localStorage` automatically (through `ssrSafeStorage`, a wrapper that is safe because the server has no `window`) and reloads it on page load; (3) `get()` allows reading current state inside an action, so read-and-write logic stays inside the store definition.

TanStack Query conversely **holds no state of its own** — it asks the server and caches the answer:

```ts
export const socialKeys = { feed: (params) => ['social', 'feed', params ?? {}] };
// useQuery({ queryKey: socialKeys.feed(params), queryFn: ..., staleTime: 30_000 })
```

The `queryKey` is a cache address — two components in different places calling with the same `queryKey` cause exactly one API call whose result is shared. `lib/queryClient.ts` also lets Zustand actively call `queryClient.invalidateQueries(...)` when needed, so the two tools cooperate rather than remaining strictly separate.

### `lib/api.ts` — a single gateway to the backend

All 180 pages call the API through exactly one file (over 4,000 lines, split by domain: `authApi`, `projectsApi`, `coursesApi`…):

```ts
const api = axios.create({ baseURL: '/api/v1', withCredentials: true });
```

That `baseURL` is Next.js's internal proxy route rather than the backend domain directly — avoiding CORS and keeping the httpOnly cookie safe on the server. Axios also carries an **interceptor that refreshes the session on a 401**: the cookie lives seven days while the token inside lives about 24 hours, so on the first 401 the interceptor calls `/api/auth/refresh` once and retries the original request — users are not ejected in the middle of a long working session.

### `next.config.js` — why `output: 'standalone'`

`standalone` packages the application into a minimal, self-contained directory: only the built code plus exactly the `node_modules` needed at runtime. It matters because deployment is Docker-based — without it, the Docker image must copy the entire `node_modules` (hundreds of unnecessary megabytes). With `standalone`, the Dockerfile only needs `COPY .next/standalone` and can run `node server.js`, with no `npm install` inside the production container.

### The light/dark theme system — just one class on `html`

```ts
function applyThemeToDOM(t) {
  const html = document.documentElement;
  if (t === 'dark') { html.classList.remove('light'); html.classList.add('theme-dark'); }
  else { html.classList.remove('theme-dark'); html.classList.add('light'); }
}
```

The site-wide dark mode class is `theme-dark`, **not** Tailwind's default `dark`. The reason: the Notes section has its own three-way theme (light, dark, brown) that uses Tailwind's standard `.dark` class on a subtree of the DOM. If the global theme also used `.dark` on `html`, every `dark:` utility inside Notes would activate spuriously and destroy its own theming. The general lesson: **when a large system has several regions needing independent theming, do not reuse a UI library's single class convention for all of them** — give the global theme its own name.

### In summary: the path a new page takes

Create a directory under `app/` → write a thin `page.tsx` declaring only `metadata` and importing the main component → inside `components/<domain>/`, create the child components, deciding `'use client'` based on whether they need interaction → server data arrives through a new TanStack Query hook calling a new function added to `lib/api.ts` → only if some UI state must be shared across places and outlive a single component should you add a Zustand store. Dividing work clearly by domain and by the nature of the data (UI state versus server state) is what keeps 180 pages openable and editable without guesswork.

## Feature map

Forty-six feature modules across six groups. The tables below list only what genuinely exists in routes and code — a few modules turn out not to be what their names suggest. How the core modules actually work is covered in depth in "How it works" immediately after this map.

### Social and communication

| Module | Route | Main models | Technical note |
|---|---|---|---|
| Feed | `/feed`, `/feed/video` | `SocialPost`, `SocialComment`, `SocialPoll` | TikTok-style vertical reels: a single `IntersectionObserver`, with only the active slide mounting a real `<video>` — one decoder at a time |
| Messenger | `/messages` | `MessageThread`, `Message`, `MessageReaction` | A full three-column Messenger clone with nicknames, mute, archive, block and report; a 1,642-line state store |
| Friends & Presence | `/friends` | `Friendship`, `Follow` | The "active now" dot targets exactly friends ∪ thread peers, never a global `io.emit` |
| Admin announcements | `/forum`, `/forum/[id]` | `Announcement` | **Not a user forum** — an admin-published bulletin board with four badge types |
| Stories | *no route attached yet* | `Story`, `StoryView`, `StoryHighlight` | 13 backend endpoints and a 623-line component are finished, but nothing imports them — see the technical debt section |

### Learning (the product core)

| Module | Route | Main models | Technical note |
|---|---|---|---|
| Academy FPTU | `/academy` | `Semester`, `Course`, `Assignment` | 50 subjects but only one real page — the other two `redirect()` to `/courses` |
| Courses (CuongThai) | `/courses/[slug]/learn` | `Course`, `Lesson`, `Enrollment` | Self-authored curricula (an 18-chapter Node.js course, for instance) with videos linked directly to simulation scripts |
| Exam Room | `/exam`, `/exam/attempt/[id]` | `Exam`, `ExamAttempt`, `ExamQuestionBookmark` | Hybrid deterministic + AI grading — detailed in its own section below |
| Code Lab | `/code-lab/[track]/[exercise]` | `CodeTrack`, `CodeExercise`, `CodeProgress` | **No real code-execution sandbox** — see "Technical debt" |
| My Language | `/language/[code]/*` | `Language`, `LangVocabWord`, `LangHanziChar` | 19 subpages: kana, hanzi, grammar, roleplay, translation — SM-2-style spaced repetition |
| RoadMap | `/roadmap/[slug]` | `Roadmap`, `RoadmapNode` | 33 learning paths, 1,286 nodes |
| Certificates | `/certificates/[number]` | `Certificate` | Public lookup by code |

### Career tools

| Module | Route | Main models | Technical note |
|---|---|---|---|
| Interview Simulator | `/interview/session/[id]` | `InterviewSession`, `InterviewTurn`, `InterviewReport` | The **deterministic** grading core (keyword plus fuzzy matching) works with the LLM entirely disabled; AI is only an additional layer |
| CV Builder | `/cv/builder/[id]` | `CvProfile`, `CvBullet`, `CvDocument` | A free rules engine grades first; the AI critique is evidence-gated and may not invent figures |
| Exp Hub (Snippets) | `/exp-hub/[slug]` | `Snippet`, `SnippetCategory` | An IDE-style layout, and **not** the same module as `/hub` despite the similar name |
| Hub (bookmarks/files) | `/hub` | `HubFolder`, `HubLink`, `HubFile` | Kanban with dnd-kit, AI tag suggestions, OG metadata scraping |
| Notes | `/notes` | `NoteSubject`, `Note`, `NoteVocabEntry` | TipTap editor, flashcards, per-subject sharing |

### Visualisation (the technical showpieces)

| Module | Route | Engine | Why that engine |
|---|---|---|---|
| Simulation Studio | `/simulation` | Deterministic Canvas 2D at 1920×1080 | `captureStream()` exists only on `<canvas>` and `<video>` — recording video rules out SVG |
| Algorithm Visualizer | `/algorithms` | SVG + DOM, with user code in a Web Worker | Isolation so a user's `while(true)` cannot freeze the tab — with a hard timeout |
| 3D Playground | `/playground` (rewrite) | Three.js r0.183 WebGPU + TSL, Rapier3D WASM | A standalone Vite app calling none of the site's APIs |

### Media, finance, commerce

| Module | Route | Worth noting |
|---|---|---|
| Finance/MoneyFlow | `/finance/*` (13 pages) | Dual VND/USD currency with user-managed exchange rates; debt schedules across four interest models, computed entirely in `Prisma.Decimal` — never JavaScript floats |
| Music | `/music`, `/remix` | A real player using the MediaSession API (playing with the screen locked); but the "DJ deck" at `/remix` is largely visual — the waveform is a hash-derived simulation, not real PCM analysis |
| Shop / e-commerce | `/shop`, `/cart`, `/checkout` | Sells both digital goods (a key pool moving AVAILABLE→SOLD, never duplicated) and physical items; two payment gateways, PayOS and VNPay, with active reconciliation beyond webhooks |
| Pro | `/pro`, `/my-codes` | Not a subscription — redeemable activation codes with a Redis sliding-window quota |
| Games | `/games/*` | Five genuinely playable games (Snake, Memory, Math Blitz…), with scores clamped server-side against cheating |

### Admin (45 pages, 8 functional clusters)

Overview and system · Content and publishing · Learning management (7 pages) · Commerce and payments (7 pages) · Users and moderation · AI operations (embedding jobs, AI analytics) · Analytics and SEO · 14 per-module editors.

:::warning[Three things that are not what their names suggest]
This is the part of the feature map most worth reading carefully, because it carries a general lesson: **a route name does not guarantee what is behind it.**
- `/exp-hub` and `/hub` are **two entirely different modules** (IDE-style snippets versus personal bookmarks and files) — easily confused when skimming names.
- `Code Lab` does not grade by running tests — the "solved" badge is just a `POST` updating a status, with no test harness behind it.
- `/academy` looks like its own module but has only one real page; the rest shares an engine with `/courses`.
:::

## How it works — inside the major modules

The section above says what each module *has*. This one explains how they *work* — in enough detail to rebuild each of them — for the platform's 15 core and most distinctive modules.

### Messenger (direct messaging)

Messenger uses one system for two conversation kinds: support chat (user ↔ admin) and private chat (user ↔ user). The logic lives in `src/services/messages.service.ts` (business layer) and `src/socket/messaging.socket.ts` (realtime layer).

**The core data model.** `MessageThread` has no separate participants table — it branches on a `type` column:

```prisma
model MessageThread {
  type          String    // 'ADMIN' or 'USER'
  userId        Int?      // ADMIN thread: the user who opened the ticket
  adminUserId   Int?      // ADMIN thread: the assigned admin
  userAId       Int?      // USER thread: the lower id
  userBId       Int?      // USER thread: the higher id
  lastMessageAt DateTime?
  preferences   Json      // { [userId]: { pinnedAt?, mutedUntil?, archivedAt?, ... } }
}
```

Two column pairs share one table for two different meanings, rather than splitting out a `ThreadParticipant` table. The trade: every function must branch on `type`, but the "list my threads" query needs one `findMany` with an `OR` instead of joining a secondary table. For USER threads the two ids are always sorted, `[a, b] = userId < peerId ? [userId, peerId] : [peerId, userId]`, before creation — the only way a unique index can prevent duplicate threads for the same pair of people. `preferences` is a JSONB column keyed by `userId`, so pin, mute, archive, mark-unread and delete-for-me are **per-viewer independent state** without additional tables.

`Message` carries `mediaUrl`/`mediaKind` (GIFs and stickers share those two columns), `parentMessageId` for replies, and two soft-state flags with different meanings: `deletedAt` (deleted — hidden from the UI, retained for audit) and `recalledAt` (recalled within five minutes — the content really is removed). `MessageReaction` has a unique constraint on `(messageId, userId, emoji)` so one person leaves one emoji once — the toggle behaviour rests directly on that constraint.

**The flow: A sends B a message.** (1) Client A calls `POST /threads/:id/messages`. (2) `sendMessage` loads the thread, calls `assertParticipant` (verifying `senderId` really is one of the two sides — necessary because thread ids are sequential integers and therefore guessable), checks blocking in both directions, validates length and attachment count, runs `prisma.message.create(...)`, updates `lastMessageAt`, then calls `emitter.emit('thread:new-message', payload)`. (3) The emitter broadcasts to **two places simultaneously**: `io.to(thread:<id>)` and `io.to(user:<uid>)` for each participant — emitting only to the thread room would leave somebody sitting in the sidebar, with that conversation not open, receiving nothing. (4) On connection the server automatically joins B to every thread room B belongs to, so B is ready to receive from the moment of connect with no further action. (5) When B opens the thread, `markRead` upserts `MessageRead` and emits `thread:read` — A sees "seen".

```mermaid
sequenceDiagram
    participant A as Client A
    participant API as REST API (messages.service.ts)
    participant DB as PostgreSQL
    participant SIO as Socket.IO server
    participant B as Client B (logged in, auto-joined)

    A->>API: POST /threads/:id/messages { content }
    API->>DB: assertParticipant + block checks
    API->>DB: prisma.message.create(...)
    API->>DB: update messageThread.lastMessageAt
    API->>SIO: emitter.emit('thread:new-message', payload)
    SIO->>SIO: io.to(thread:id).emit(...) and io.to(user:A/B).emit(...)
    SIO-->>B: 'thread:new-message' (B is in both rooms)
    SIO-->>A: 'thread:new-message' (syncing A's other tabs)
    B->>API: (on opening the thread) POST /threads/:id/read
    API->>DB: upsert MessageRead
    API->>SIO: emit('thread:read', {readerId: B, readAt})
    SIO-->>A: 'thread:read' — the UI shows "seen"
```

**Points worth noting.** Rooms per thread plus rooms per user, never a global `io.emit()` — broadcasts reach exactly the people concerned, so clients never have to filter raw payloads themselves. Re-authorisation on every event rather than only at handshake — a client-sent `thread:join` (with a guessable id) still hits the database to confirm participation before `socket.join`, without which any logged-in user could eavesdrop by guessing numeric ids. A `roleVersion` field defeats stale tokens — changing roles or passwords invalidates older tokens even before expiry. JSONB `preferences` instead of a table per small feature buys development speed, at the cost of writing a migration later if any single slot ever needs indexing at scale.

### Feed and the social layer

Implemented in `src/services/social.service.ts` (2,262 lines). The core principle: **the feed never pushes new posts into the interface** — the server only rings a bell announcing that something new exists, and the client decides when to fetch.

**The core data model.** `SocialPost` carries `visibility` (PUBLIC/FRIENDS/PRIVATE, enforced entirely server-side), `type` (POST/VIDEO/FILE for the home page tabs), and denormalised `viewCount`/`sharesCount` counters avoiding runtime `COUNT()`. `SocialComment` supports two levels (`depth` 0 or 1) — replies-to-replies are blocked in code to avoid unbounded recursion when rendering comment trees.

**The flow: A posts, and B (following A) sees "something new".** (1) `createPost` writes the `SocialPost`, stripping `blob:` and `data:` URLs (temporary URLs inside A's own browser — persisted to the database, every other viewer would see them permanently broken). (2) If the post is not PRIVATE, it calls `pingFollowersAboutNewPost(...)` **without awaiting** — inside `setImmediate`, so A's response is not delayed. (3) That function queries `Follow` and emits `feed:has-new` to each follower — **carrying no post content**, only `{viewerId, count}`. (4) B, already in room `user:B` since connecting, receives `feed:has-new` and displays a "new posts" banner. (5) B taps the banner → `GET /social/posts?cursor=<oldest-id>` fetches exactly the newer posts. (6) `getFeed` enforces every visibility rule: the cursor is by `id` (not offset, avoiding page drift when posts arrive mid-scroll), and `visibilityWhere` is computed from `currentUserId` rather than trusted from the client.

```mermaid
sequenceDiagram
    participant A as Client A (author)
    participant API as social.service.ts
    participant DB as PostgreSQL
    participant SIO as Socket.IO server
    participant B as Client B (follower, Feed open)

    A->>API: POST /social/posts
    API->>DB: prisma.socialPost.create(...)
    API-->>A: 201 + serialised post (A sees it immediately, optimistically)
    API->>API: setImmediate(pingFollowersAboutNewPost) [not awaited]
    API->>DB: Follow.findMany({ followingId: A })
    API->>SIO: emit('feed:has-new', {viewerId: B, count: 1}) x N followers
    SIO-->>B: 'feed:has-new' — shows the "new posts" banner
    B->>API: GET /social/posts?cursor=<lastSeenId> (when B taps it)
    API->>DB: getFeed — visibility filter + cursor + tab
    API-->>B: the new posts — prepended to the feed
```

**Points worth noting.** A light ping rather than pushed data — the `feed:has-new` payload holds only `viewerId` and `count`, so socket cost is near constant regardless of how many images or videos a post contains, and it avoids the "server pushed content that was edited or deleted before the client fetched" problem. Client-supplied `visibility` is never trusted when filtering the feed — this was once a real vulnerability (a code comment says outright: "it was the vector that let anonymous callers read everyone's PRIVATE posts") — the lesson being that every privacy predicate must be recomputed server-side. The cursor uses `id` rather than `createdAt` or an offset, because `id` increases monotonically and does not shift when new posts arrive while somebody is scrolling.

### Presence (who is online)

Not a separate module — a controlled side effect of the Socket.IO connection lifecycle.

**The core data model.** There is no database table for online status — it lives entirely in process memory (`const onlineUserIds = new Set<number>()`). A deliberate choice: presence is ephemeral, needs no persistence, and a server restart naturally means everyone counts as offline until they reconnect.

**The flow: A opens the app and their friends and peers see them online.** (1) A connects a socket; middleware verifies the JWT and `roleVersion`. (2) `socket.join(user:<A>)`; `wasOffline = !onlineUserIds.has(A)` is captured **before** adding to the set — if A already had another tab open, `wasOffline` is false and no duplicate "just came online" is emitted. (3) A parallel async task queries `MessageThread` and `Friendship` (ACCEPTED) to build the **audience** — friends ∪ thread peers — joining each discovered thread room (this is the auto-join mechanism Messenger relies on). (4) If `wasOffline === true`, `emitPresenceTo(audience, {userId:A, online:true})` iterates the uids and emits `presence:update` into each `user:<uid>` room, **never** a global `io.emit()`. (5) When A closes a tab, `disconnect` recounts A's remaining sockets — only when none remain is A treated as offline and presence re-emitted.

```mermaid
sequenceDiagram
    participant A as Client A
    participant SIO as Socket.IO server
    participant DB as PostgreSQL (Friendship, MessageThread)
    participant P as A's friends / peers (already online)

    A->>SIO: connect (JWT in the backend_token cookie)
    SIO->>SIO: middleware: verify JWT + roleVersion
    SIO->>SIO: socket.join(user:A)
    SIO->>SIO: capture wasOffline, then add A to onlineUserIds
    par Compute the audience in parallel
        SIO->>DB: MessageThread.findMany (A's threads)
        SIO->>DB: Friendship.findMany (ACCEPTED, involving A)
    end
    SIO->>SIO: socket.join(thread:id) for each thread found
    alt wasOffline == true
        SIO->>SIO: emitPresenceTo(audience, {userId:A, online:true})
        SIO-->>P: io.to(user:uid).emit('presence:update', ...)
    end
    Note over A,SIO: ... later, A closes the tab ...
    A--xSIO: disconnect
    SIO->>SIO: count A's remaining sockets
    alt none of A's sockets remain
        SIO->>SIO: onlineUserIds.delete(A)
        SIO-->>P: emitPresenceTo(audience, {userId:A, online:false})
    end
```

**Points worth noting.** The audience is friends ∪ thread peers rather than a global broadcast — an earlier version used `io.emit()` on every connect and disconnect, which a code comment calls outright "an O(N²) storm during deploy reconnects": the server restarts, hundreds of clients reconnect nearly simultaneously, and each reconnection triggers a global broadcast. Narrowing to the real audience makes each event's cost linear in the number of people who actually need to know. Reading `wasOffline` before writing to the set prevents duplicate notifications across tabs. And there is a controlled fail-open: if the audience query errors, it falls back to a global `socket.broadcast.emit()` — accepting a performance cost in a rare case rather than losing presence entirely.

### Academy and Courses — the learning system

The LMS core: Course → Section → Lesson, with users enrolling and working through lessons while the system computes completion and issues certificates.

**The core data model.** `Course` has `academyType` (GENERAL/FPT), `accessType`, and cached figures (`totalLessons`, `totalStudents`) — deliberate denormalisation, updated on relevant events rather than recounted on every render. `Lesson` has a `lessonType` (VIDEO/QUIZ/EXERCISE/SOLUTION); quizzes **store no learner answers in the database** — grading happens entirely client-side on each attempt, so a quiz can be replayed indefinitely with no server state. `Enrollment` carries `@@unique([userId, courseId])` against duplicate enrolment, plus `progressPercent` (cached), `lastLessonId` and `lastAccessedAt` (powering "continue learning"), and `source` (FREE/PAID/CODE/ADMIN — how the user obtained access). `LessonProgress` carries `@@unique([enrollmentId, lessonId])` and is the source of truth for percentages.

**The flow: finish a lesson → mark complete → how course percentage is recomputed.** (1) Verify access: find the `Enrollment` by `(userId, courseId)` — absent means 400. (2) Upsert `LessonProgress` on the natural key `(enrollmentId, lessonId)` — atomic at the database level, which matters because video sends progress heartbeats several times a minute. (3) **Recount from scratch rather than incrementing**: `courseLessons = Lesson.count(...)`, `completedCount = LessonProgress.count({isCompleted:true})` — because lesson counts change when an instructor adds or removes lessons after somebody enrolled, and a running counter would permanently distort existing learners' percentages. (4) `progressPercent = completedCount/courseLessons × 100`, written back to `Enrollment` together with `lastLessonId` and `lastAccessedAt` in the **same request**. (5) At 100%, issue a `Certificate` with code `CUONGTHAI-<year>-<hex>`, wrapped in a try/catch that swallows unique-constraint violations — handling the race between two near-simultaneous "last lesson complete" requests without transactions or locks.

The `progressPercent` stored on `Enrollment` is a **cache, not the source of truth** — the evidence: `GET /courses/my` does not read it but recomputes the identical formula from `lessonProgress` and the currently published lesson count. This is layered defence: the cache serves broad, fast queries, while anything displayed directly to a user is recomputed on the spot.

**Course content is authored as `.mjs` files and seeded into the database.** `content/academy/PRF192.mjs` default-exports an object describing Semester ▸ Course ▸ Section ▸ Lesson in exactly the Prisma shape. `scripts/academy-seed-course.mjs` dynamically `import()`s it and upserts on **natural keys** (Semester by `code`, Course by `(courseCode, academyType)`, Lesson by `(course, slug)`) — existing lessons are updated in place, new ones appended. It has `--dry` (the default) and `--apply` flags. Why content-as-code rather than an admin form: it is reviewable through `git diff`; bulk authoring is many times faster; logic can be reused through imported helpers; it is safe to rerun (it never touches `LessonProgress`); and it automates at deploy time (`bash deploy.sh` seeds it).

### Exam Room

Separated from courses at the grading layer: an `Exam` is either **FE** (multiple choice, automatically graded) or **PE** (AI-graded code, essays or speech).

**The core data model.** `Exam` belongs to a `Course`, has a `kind` (FE/PE) and, when PE, a `peType` (CODE/WRITE/SPEAK). `ExamQuestion.correctIndexes` is an **array** rather than a single number, supporting multi-select questions. An FE exam may also contain `CODE` questions (a Progress Test mixing multiple choice with one or two coding tasks). `ExamAttempt` moves through `IN_PROGRESS → SUBMITTED/GRADED` (or EXPIRED), with `expiresAt` computed server-side — timing lives on the server and client-reported time is never trusted.

**The submission flow.** Starting an attempt: find the user's own unexpired `IN_PROGRESS` attempt and resume it, or create a new one (moving stale attempts to EXPIRED). **FE grading**: compare the selected set against `correctIndexes` with `sameSet()` — order-independent, all or nothing. A `CODE` question embedded in an FE exam is graded by AI separately; if the AI fails, that question is marked `ungraded:true` and **excluded from both numerator and denominator** — an AI infrastructure incident must never cost a learner marks. **PE grading**: CODE unzips the submission (filtering to source files, capping characters, storing the original zip on R2 for audit); WRITE accepts an essay; SPEAK transcribes with Groq Whisper before grading the transcript, automatically switching to Japanese mode when the subject code starts with `JPD`. All three PE paths share one mandatory bilingual JSON output shape; invalid JSON triggers exactly one retry before failure is accepted.

```mermaid
flowchart TD
    A["Learner presses Submit"] --> B{"Exam kind?"}

    B -->|"FE - multiple choice"| C["submitFinalExam()"]
    C --> D["Per MCQ: sameSet(selected, correctIndexes)"]
    C --> E{"Any CODE questions mixed in?"}
    E -->|"Yes"| F["gradeCode() via AI"]
    F -->|"AI error / overload"| G["Mark ungraded, exclude from numerator AND denominator"]
    F -->|"AI OK"| H["Add the code question's marks"]
    D --> I["score = (raw / maxRaw) x totalPoints"]
    G --> I
    H --> I

    B -->|"PE - practical"| J{"peType?"}
    J -->|"CODE"| K["Unzip, filter to source files"]
    J -->|"WRITE"| L["Accept the English essay"]
    J -->|"SPEAK"| M["Groq Whisper: audio -> transcript"]

    K --> N["Assemble the prompt: task + rubric + submission"]
    L --> N
    M --> N
    N --> O["Call the LLM under GRADE_JSON_SPEC (bilingual)"]
    O -->|"Invalid JSON"| P["Retry exactly once"]
    P --> Q["normalizeGrade(): scale onto the question's point value"]
    O -->|"Valid JSON"| Q
    Q --> R["finalizePe(): combine question scores"]

    I --> S["Update ExamAttempt: status=GRADED, score, passed"]
    R --> S
    S --> T["buildReview(): return correct answers and explanations"]
```

**Points worth noting.** Making `Exam.kind` and `ExamQuestion.kind` explicit data columns, rather than inferring them from content, lets routes reject mismatches immediately — `submit-code` checks `exam.kind!=='PE' || exam.peType!=='CODE'` and returns 400, so a multiple-choice exam cannot be sent to the code-grading API by mistake. The `gradingMode` field on `ExamAttempt` becomes a filterable, aggregatable column, supporting cost and stability monitoring of the LLM gateway shared with the Interview Simulator.

### Code Lab — a coding playground with no real sandbox

Learners write code in an embedded editor and press "Run" to see output in the browser — no backend call, no Docker, no WASM.

**The core data model.** A `Track → Module → Exercise` tree, where each `Exercise` holds `examplesJson`, `solutionCodeJson` and `language`. Progress is keyed by `(userId, exerciseId)` and stores `status` plus `savedCode` — the entire multi-file workspace, not just the open file (an earlier version saved only the active file and lost work whenever a learner opened another file and came back).

**The distinctive technical point — and a truth worth stating plainly: there is no sandbox.** The core of the Run button:

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

`new Function` is essentially equivalent to `eval` — it compiles a string into a function that runs **in the same global scope, the same origin and the same tab** as the page itself. There is no memory or scope isolation (the code has `window`, `document`, `fetch` and cookies — in principle it could read `document.cookie` or call APIs using the logged-in session), no timeout (`while(true){}` freezes the whole tab), and no resource limits. This is acceptable because the exercises are admin-authored content and each person only runs their own code — but if the platform ever grades submissions by *the system* running that code, this design cannot be reused as it stands.

The contrast lives in the same repository: `Algorithm Visualizer` solves the identical "run user code" problem with a Web Worker, a hard six-second timeout and a 300,000-instruction ceiling — user code runs in a completely different global scope (no `window`, `document` or `fetch` reaching the page's cookies), and an infinite loop cannot freeze the UI because the main thread can still call `worker.terminate()`. The pedagogical lesson: the same "run user-supplied JavaScript" problem carries two different risk levels depending on product context, and sandbox investment must match the actual risk — this is known technical debt, not an undiscovered oversight.

### My Language — the spaced repetition engine

Teaching vocabulary, grammar and kanji/hanzi across several languages. The part most worth studying: how it decides *when* a learner should review a word again.

**The core data model.** Progress and review scheduling live in one table shared by every content type, `LangUserProgress`:

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

The progress table is **polymorphic on `itemType`** rather than seven separate tables for seven content types — which reduces "what is due for review today" to a single `SELECT` regardless of content type.

**The distinctive technical point: a condensed SM-2.**

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

`quality < 3` (a wrong answer) resets to the beginning — `repetitions=0`, review again tomorrow. `quality >= 3` (recalled correctly) makes the interval **grow geometrically**: one day the first time, jumping straight to six the second (a fixed step from the original SM-2), then multiplying by `easeFactor` (2.5 by default) from the third onwards — a consistently well-remembered word follows 1 → 6 → 15 → 38 → 95 days, expanding rapidly, exactly the philosophy of spaced repetition: do not spend time reviewing what is already known. `easeFactor` self-adjusts each time: an easy answer nudges it up (future intervals stretch faster), a struggle pulls it down; the hard floor of 1.3 prevents intervals collapsing towards zero permanently.

### Interview Simulator — two-tier grading: hard rules first, AI second

**The core data model.** `InterviewQuestion` carries its grading criteria in the question row itself — `rubric` (weighted JSON), `mustMention` and `shouldMention` (required and desirable keywords), `redFlags` (keywords indicating a misconception), and `synonyms`. There is a parallel English set, because English answers matched against Vietnamese keywords would fail unfairly. `InterviewSession.engineMode` (STATIC/HYBRID/FULL_AI) determines whether answers are graded by rules alone or rules plus AI.

**The flow when an answer is submitted.** (1) Open questions select the keyword set matching the answer's language. (2) **Pass A — keyword grading, immediate, costing no LLM spend.** (3) If HYBRID or FULL_AI and quota remains: **Pass C — AI rubric grading**, receiving Pass A's result as context. (4) On AI failure or exhausted quota: **graceful degradation** — drop to STATIC, keep Pass A's score, and never lose or corrupt an answer merely because the AI was unavailable.

Pass A does not use a naive `includes()` — the `mentions()` function handles three variants at once: whole-phrase matching after normalisation, matching after flattening away whitespace and hyphens (`"micro task"` ≈ `"microtask"`), and per-word matching for multi-word compounds. The Pass A score is `70% coverage(mustMention) + 30% coverage(shouldMention) − redFlags × 15`.

**The distinctive technical point: evidence-gating against fabricated AI marks.** The system prompt requires that, for each criterion, "evidence" must be a verbatim quotation from the answer — if `evidence: null`, that criterion's score **cannot exceed one quarter**, however good the AI "feels" the answer was. This blocks exactly the classic failure of an LLM as examiner: awarding marks based on its own inference rather than what the candidate actually wrote. The system also computes `disagreement = |aiScore − passA.score|` and sets `needsReview=true` beyond a threshold — self-monitoring for when two independent graders diverge too far.

### CV Builder — free hard rules first, AI critique second

**The core data model.** `CvBullet` is the atomic unit — one achievement line. `userStatedFacts` and `provenance` are provenance anchors: every phrase the AI has touched must trace back to a fact the user supplied, and `verified` gates export.

**The flow — two grading tiers.** Tier 1, `lintProfile()` — free, deterministic, no AI, grading as you type. Tier 2, `critiqueProfile()` — AI, Pro only, wrapping the CV content in `<candidate_cv>` tags (anti-injection, marking it clearly as DATA rather than instructions).

**Distinctive point one: an AI-free bullet grading rule set.** `lintBullet()` scores with deterministic additions and subtractions: opening with a strong verb +2, stating a job title instead of an action −3, containing a measurable figure +2, no outcome −2, first person −2, passive voice −1, and one subtle rule — merely "being present in a team" without stating a contribution takes the heaviest penalty (−2.5). The design principle: favour high precision on strong bullets — a line with a strong verb and a real outcome must never be labelled WEAK, because wrongly criticising a good line destroys trust in every other comment.

**Distinctive point two: evidence-gating against invented figures.** The real risk: asked to "make this stronger", an LLM tends to insert plausible-sounding numbers ("reduced processing time by 40%") the candidate never provided. The system prompt blocks this with an overriding rule and concrete examples: a suggested fix may **never** contain a number or technology the candidate did not state. When a missing fact is needed, the output must set `needsUserInput=true` with a `clarifyingQuestion` to ask back, while `suggestedFix` describes only how to restructure the sentence — inventing nothing. The principle throughout, as a code comment puts it: "an honest line without numbers beats a fabricated one."

### Simulation Studio (/simulation)

**The core data model.** A `Scenario` consists of a static diagram (`nodes` and `edges`, or `panels` for stacks and queues) plus a `build(opts) => SimStep[]` function. `build()` must be a **pure function** — the same `opts` always yields the same step array, with no hidden state surviving between calls — which is the precondition for a scrubbing timeline: the state at step `i` must be derivable by replaying `0..i`, not by advancing from the previous step. Each `SimStep` carries `nodeStates` (cumulative) and `ops: PanelOp[]` for panels — event sourcing in miniature, applied to animation.

**The distinctive technical point: a simulation clock in real time, not frame counting.** The first version advanced the simulation by exactly `1000/60`ms per `requestAnimationFrame`, reasoning that "counting frames is deterministic" — which is wrong, because rAF is not fixed at 60 per second (a 120Hz display runs nearly twice as fast, so the simulation ran at twice real speed). The fix accumulates **real elapsed time**, capped at `MAX_FRAME_MS=100` so returning to a backgrounded tab does not jump.

**Two video export paths sharing one data source.** Interactive: `canvas.captureStream(60)` plus Web Audio (sound effects and microphone mixed through a `MediaStreamAudioDestinationNode` into a single track — feeding two separate tracks into `MediaRecorder` gets only the first encoded in most browsers). Batch and offline: `window.__SIMULATION__.renderAt(ms)` — headless Playwright calls it 30 times per video second, capturing each frame as PNG and assembling with ffmpeg — independent of machine speed and producing byte-identical output every time, which is the precondition for rendering dozens of videos overnight unattended.

```mermaid
flowchart TD
    A["Scenario: nodes/edges or panels + build(opts)"] --> B["Pure, deterministic SimStep[]"]
    B --> C["useSimulationEngine: advance() by real elapsed time"]
    C --> D["canvasRenderer/panelRenderer draws the current frame"]
    D --> E1["captureStream(60) + WebAudio mixed track -> MediaRecorder -> .webm"]
    D --> E2["Playwright: renderAt(ms) freezes virtual time, captures each frame as PNG"]
    E2 --> F["ffmpeg assembles PNG + audio -> .mp4 H.264"]
```

### Algorithm Visualizer (/algorithms)

**The distinctive technical point: a Worker sandbox built from a Blob.** `WORKER_SRC` is the entire Worker source embedded as a string inside a TypeScript file. Pressing run does `new Blob([WORKER_SRC])` → `URL.createObjectURL` → `new Worker(url)` — the "inline worker" technique, keeping the Worker strictly same-origin with no separately served worker file. Inside the Worker, six tracer classes (`Array1DTracer`, `GraphTracer` and others) draw nothing at all — they push commands (`Cmd`) onto a `commands` array. User code runs through `new Function(...tracers, code)` — effectively `eval` with controlled parameters, but because it runs in a Worker there is no `window` or DOM, and the only channel out is `postMessage`.

**A hard timeout kills infinite loops.** `runCode(code, timeoutMs=6000)` sets a `setTimeout` on the main thread — six seconds without a response and it calls `worker.terminate()`. This is the only workable way to stop `while(true){}`: single-threaded code inside the Worker cannot interrupt itself, but `terminate()` from outside kills it instantly without touching the main page. A `CAP=300000` instruction ceiling is the second guard — an algorithm generating too many visualisation steps throws before exhausting memory.

**Replay: from a raw command stream to individual frames.** The Worker returns the whole `commands` array in call order. `buildFrames()` on the main thread walks it, applying each command to a `live` state, and **only on a `delay` command** does it `snapshot()` a deep clone into a `Frame` — `Tracer.delay()` is the step boundary.

```mermaid
flowchart TD
    A["User edits code in the catalog"] --> B["runCode(): Blob(WORKER_SRC) -> URL -> new Worker"]
    B --> C["new Function(Tracers, code) runs INSIDE the Worker, isolated from the DOM"]
    C --> D["Each set/patch/select/delay -> pushed onto commands[]"]
    D -->|postMessage| E["Main thread: buildFrames() replays the commands"]
    E -->|"on delay -> deep-clone snapshot"| F["frames: Frame[] one per step"]
    F --> G["React renders frames[step]"]
    B -.->|"no response after 6s"| H["worker.terminate() — kills the infinite loop"]
```

The most distinctive aspect: an absolute separation between "recording commands" (inside the Worker, with a self-destructing hard timeout) and "replaying them as images" (main thread, pure rendering, never executing foreign code) — the classic sandboxed-execution pattern, scaled down to exactly what a visualiser needs.

### 3D Playground (/playground)

`playground-3d/` is a standalone Vite app (outside Next.js) built on `three/webgpu` (falling back to WebGL where unsupported) together with **TSL** (Three.js Shading Language) — writing shaders as composable JavaScript functions rather than GLSL strings, compiled to WGSL or GLSL depending on the runtime backend. Physics uses `@dimforge/rapier3d` (WASM), loaded in parallel with the second heavy asset batch so it does not extend the loading screen.

**The distinctive technical point: the FPT University campus is built in code, with no `.glb` file involved.** Hundreds of buildings, trees and roads reuse exactly one `BoxGeometry` and one `CylinderGeometry`, differing only in scale, position and material; high-count repeated elements (windows, shrubs) use `THREE.InstancedMesh` — one draw call rendering hundreds of copies. Visual randomness (which windows are dark) uses a deterministic hash rather than `Math.random()` — guaranteeing the campus looks identical across every load on every machine without storing a seed server-side.

Quiz questions inside the game come from `content/exams/*.mjs` — the same source as the real `/exam` page. Because a static app makes no API calls at runtime, the content is baked at build time: a script reads the exams, filters by subject, and writes static JSON; at play time it simply `fetch()`es the JSON for the chosen term — no CORS, no auth.

**A separate CSP.** Because this area is entirely self-contained it carries its own CSP, stricter than the main site about third-party domains (none are permitted) but looser in one required respect: `'unsafe-eval'` for Rapier's WASM compilation. The easiest thing to miss: `connect-src` must include `blob:` — `.glb` files embed their textures, and `GLTFLoader` decompresses them into `blob:` URLs then loads them with `fetch()` (not an `<img>` tag, so they fall under `connect-src` rather than `img-src`). Omit that one line and every texture dies and the world hangs on the loading screen forever — with the console reporting only a blob load failure and never mentioning CSP.

```mermaid
flowchart TD
    A["Game.init(): Scene, Ticker, Time..."] --> B["Batch 1: small textures for the intro"]
    B --> C["in parallel: batch 2 (glb/textures) + import Rapier WASM"]
    C --> D["new Physics() — RAPIER.World + collision groups"]
    D --> E["new World() -> FptuCampus, Trees... built in code + InstancedMesh"]
    E --> F["world.step(1) builds content, registers fixed colliders"]
    F --> G["reveal.updateStep(0) — the intro opens"]
    G --> H["loop: ticker tick -> Physics.update() -> render through TSL on WebGPU/WebGL"]
```

### Finance / MoneyFlow

**The core data model.** `Debt` (the original loan) → `DebtScheduleItem` (each instalment, computed and written to the database at creation — as a bank prints the repayment schedule when the contract is signed, rather than recomputing on every view) → `DebtPayment` (what was actually paid).

**Why `Prisma.Decimal` rather than `number`.** JavaScript stores numbers as IEEE-754 doubles — `0.1+0.2` yields `0.30000000000000004`, because binary cannot represent those decimals exactly. That error accumulates across instalments and users notice immediately. `Prisma.Decimal` computes with arbitrary-precision arithmetic, matching Postgres's `Decimal(18,2)` columns. The rule applied throughout: **every money calculation rounds to two places HALF_UP immediately after each step**, never letting error drift and rounding once at the end.

**Four interest models.** `FLAT_MONTHLY` — fixed interest on the original principal, considerably more expensive than the advertised rate because interest does not fall with the outstanding balance. `REDUCING_BALANCE` — the standard bank EMI: `EMI = P·r·(1+r)^n / ((1+r)^n − 1)`, where interest tracks the remaining balance and therefore falls while principal rises, even though the EMI is constant. `DAILY_PERCENT` — interest by actual days elapsed on the remaining balance (the payday-loan shape), supporting open-ended terms. `NO_INTEREST` — divided evenly.

**The final instalment absorbs rounding error.** A 10,000,000₫ loan over three instalments: `10000000/3 = 3,333,333.33…`, and rounding each then multiplying by three falls one cent short. The solution: the first n−1 instalments use the evenly rounded figure, and the **final one** takes the actual remainder, `= principal − allocated` — so the total always matches the principal exactly.

**Snowball versus avalanche.** With several debts and a fixed monthly budget, where does the surplus go first? Snowball targets the smallest balance (a psychological benefit), avalanche targets the highest rate (the mathematical optimum). The simulation runs month by month (capped at 600 months against infinite loops) and returns `months` and `totalInterest` for direct comparison.

```mermaid
sequenceDiagram
    participant U as User (frontend)
    participant API as debt.service.ts
    participant Calc as debtCalculator.ts (pure)
    participant DB as Postgres (Prisma)

    U->>API: POST /finance/debts {principal, interestType, rate, termMonths}
    API->>Calc: computeDebt(input)
    Calc-->>API: {schedule[], totalInterest, totalPayable}
    API->>DB: $transaction: create Debt + createMany DebtScheduleItem
    DB-->>U: Debt + the full schedule
    Note over U,DB: ... the first instalment falls due ...
    U->>API: POST /finance/debts/:id/schedule/:itemId/pay
    API->>DB: create DebtPayment + update DebtScheduleItem {isPaid}
    alt every instalment is paid
        API->>DB: update Debt {status: PAID_OFF}
    end
```

`computeDebt()` is a pure function — unit-testable without mocking Prisma, and reused unchanged by `previewSchedule()` so that when a user changes the amount or interest type the repayment schedule updates live in the UI without writing a single database row.

### Music

**Why audio does not stream directly from an R2 link.** The player creates an `<audio crossOrigin="anonymous">` element — mandatory for feeding audio bytes into an `AnalyserNode` for a real frequency visualiser. But once `crossOrigin` is set, the browser enforces CORS on every byte downloaded, and the R2 bucket **has no CORS policy**. The solution: the backend does not redirect but fetches the object from R2 itself and pipes the bytes back through `/music/stream/:id` — first-party, so the browser does not block it.

**HTTP Range (206 Partial Content).** The browser sends `Range` to probe the size, fetches the first chunk, then sends a new `Range` wherever the user seeks — and the backend forwards that header verbatim to R2. Forget to forward it and R2 returns the whole file, the response body disagrees with `Content-Range`, and the browser rewinds to the beginning even though the progress bar shows it near the end.

**The MediaSession API — playback with the screen locked.** Without it, `<audio>` still plays in the background but no lock-screen control works. Handlers registered for `play`, `pause`, `nexttrack` and `previoustrack` call `useMusicStore.getState()` directly (bypassing React state to avoid staleness). `seekbackward` and `seekforward` are deliberately **not** registered — on iOS, registering those two makes the lock screen show ±10-second skip buttons, while their absence makes the OS fall back to previous/next track, which is the correct behaviour for a music app.

**The truth about the "DJ deck" at `/music/remix`.** The waveform on the deck is **not real audio analysis** — the `waveform()` function FNV-1a-hashes `track.id` then uses xorshift to generate numbers that "look like a waveform" under a sine envelope. The same id always produces the same shape (deterministic, so it does not flicker on re-render), but it has nothing to do with the actual audio — no FFT, no PCM reading. Conversely, the visualiser shown *while music is genuinely playing* uses `AnalyserNode` for real frequency data — but is deliberately disabled on mobile, because the OS suspends `AudioContext` when the app is backgrounded.

### Shop and payments

**The core data model.** `Product.type` is PHYSICAL (needing shipment) or DIGITAL. `ProductKey` is a **pool of individual keys**: each row is one real account or licence, with `status` moving AVAILABLE→SOLD, so each buyer receives a key nobody else has rather than a shared payload. `ShopOrderItem` snapshots `productName` and `price` **denormalised** at purchase time, with no live foreign key to `Product` — renaming or deleting a product later does not corrupt historical orders.

**The key pool: AVAILABLE → SOLD, never duplicated.**

```ts
const candidates = await tx.productKey.findMany({ where: { productId, status: 'AVAILABLE' }, take: item.quantity + 5 });
for (const k of candidates) {
  if (claimed.length >= item.quantity) break;
  const c = await tx.productKey.updateMany({ where: { id: k.id, status: 'AVAILABLE' }, data: { status: 'SOLD', ... } });
  if (c.count === 1) claimed.push(k.content);
}
```

The `findMany` only collects candidates and locks nothing. Real ownership is claimed by `updateMany({ where: { id, status: 'AVAILABLE' } })` — the `status` condition inside `WHERE` turns the UPDATE into an **atomic compare-and-swap** guaranteed by Postgres: two concurrent requests reaching for the same key mean exactly one succeeds, and the loser sees `count=0` and tries the next candidate.

**Preventing double fulfilment: an atomic conditional PENDING→PAID.** Webhooks can fire repeatedly for one order. Condition and action are merged into a single `updateMany`:

```ts
const flipped = await tx.shopOrder.updateMany({ where: { id: order.id, status: 'PENDING' }, data: { status: 'PAID', ... } });
if (flipped.count !== 1) return; // already handled — ignore
```

`flipped.count` is only ever 1 (this call won, so fulfil) or 0 (it lost, so return silently) — there is no gap between checking and acting.

**Two payment gateways, one fulfilment function.** PayOS handles shop orders and VNPay handles course orders. PayOS requires an `orderCode` unique across the whole merchant regardless of product — solved by partitioning the number space: course orders use their id directly, shop orders use `OFFSET(2 billion) + ShopOrder.id`. The webhook only compares `payosCode >= OFFSET` to know which kind it is.

**Active reconciliation beyond webhooks.** A webhook may never arrive. The solution: ask PayOS again at every natural point (the return page, `GET /shop/orders/my`) — and because the fulfilment function is idempotent, calling it from the webhook, from reconciliation, or from both nearly simultaneously is entirely safe.

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend (checkout)
    participant API as Backend
    participant PayOS as PayOS Gateway
    participant DB as Postgres

    U->>FE: Place the order, press Pay
    FE->>API: POST /shop/orders {items}
    API->>DB: create ShopOrder (status=PENDING)
    FE->>API: POST /payments/payos/shop/create
    API->>PayOS: createPaymentLink(orderCode = OFFSET + id)
    PayOS-->>API: {checkoutUrl}
    API-->>FE: checkoutUrl
    FE-->>U: redirect to PayOS

    par Webhook (if it arrives)
        PayOS->>API: POST /payments/payos/webhook
        API->>DB: markShopOrderPaidAndFulfill() — updateMany PENDING->PAID
        API->>DB: claim ProductKey AVAILABLE->SOLD (transaction)
    and User returns to the return page
        PayOS-->>FE: redirect /shop/payment-return
        FE->>API: GET /shop/orders/:code (poll)
        API->>PayOS: reconcilePayosShopOrder() — ask for status directly
        API->>DB: markShopOrderPaidAndFulfill() if PAID (idempotent, may race the webhook)
        API-->>FE: order.status = PAID
    end
```

Both branches call `markShopOrderPaidAndFulfill` — whichever arrives second finds the order already PAID and does not fulfil twice. This is why the whole flow is unafraid of a webhook arriving late, arriving twice, or never arriving at all.

## Security and authentication

### The login and token refresh flow

```mermaid
sequenceDiagram
    participant B as Browser
    participant N as Nginx
    participant E as Express backend
    participant D as PostgreSQL

    B->>N: POST /api/v1/auth/login (+ Turnstile token)
    N->>E: proxy_pass, forwarding Cookie explicitly
    E->>D: SELECT user, bcrypt.compare (12 rounds, dummy hash against user enumeration)
    E-->>B: Set-Cookie backend_token (httpOnly, sameSite=lax, 24h)
    Note over B,E: The JWT lives 24h — access token and login cookie share the same 24h

    B->>E: GET /api/v1/... (Cookie backend_token)
    E-->>B: 401 once the JWT expires

    B->>N: POST /api/auth/refresh (Next.js proxy route)
    N->>E: jwt.verify(ignoreExpiration: true) then RE-CHECK the database
    E->>D: verify enabled + accountNonLocked
    E-->>B: a new JWT + a cookie reset to 7 days
```

The token does not live only in a cookie: `extractToken()` also reads the `Authorization` header, the `?token=` query parameter (for SSE), and parses the raw `Cookie:` header for the Socket.IO handshake. The downside: a token in a query string forces the logging middleware to redact it by hand — `morgan` is patched to replace `?token=...` with `[REDACTED]` before writing, without which every JWT would sit in plain text in the access log.

Authorisation is not a static enum: `Role` and `User` are joined through a many-to-many `UserRole` table, with a `roleVersion` column invalidating older tokens when a password changes.

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
  roleVersion BigInt   @default(0)   // ++ on every password change — invalidates old tokens
  roles       UserRole[]
}
```

:::danger[roleVersion is checked on WebSocket only, not on HTTP]
Express's `authenticate` middleware verifies `enabled` and `accountNonLocked` on every request but **does not compare the token's `roleVersion` against the database**. The Socket.IO layer does: the handshake is rejected immediately when `roleVersion` diverges. The consequence: after changing a password over HTTP, the old token keeps working until its 24-hour expiry, while over WebSocket it is ejected instantly. This is a genuine asymmetry, and it is on the list to close.
:::

Three other defensive layers worth naming:

| Mechanism | Location | The deliberate trade-off |
|---|---|---|
| Redis rate limiter (`general` 2000/15m, `auth` 10/1m, `upload` 20/1m) | `src/index.ts` | **`failOpen()`**: if Redis dies, requests pass unlimited — losing rate limiting beats 500-ing the whole site |
| XFF spoofing defence | The rate-limit key takes the **rightmost** `X-Forwarded-For` entry (appended by Nginx), never the leftmost, which a client can set freely | Exploited for real: sending a different `X-Forwarded-For` each time yielded unlimited counters |
| Upload MIME checking | `assertSafeUploadType()` — blocking by declared MIME plus dangerous extensions (`.html`, `.svg`, `.js`…) | **Does not read magic bytes** — the defence rests on the declaration, with a deliberate exception for `application/octet-stream` (mobile drag-and-drop) |
| Internal presigned URLs | Hand-rolled HMAC-SHA256, 30-minute expiry | Signature comparison uses plain string `!==` rather than `crypto.timingSafeEqual` |

:::note[One inconsistency, recorded honestly]
The repository contains **two entirely different ways of hashing an IP address**: `project.routes.ts` uses proper HMAC-SHA256 for anonymous likes, while `snippets.service.ts` uses a Java-style `String.hashCode` (djb2, 32-bit) for upvotes and bookmarks — a 32-bit space, so collision-prone and reversible. Not a severe vulnerability (it only affects anonymous counters), but a clear demonstration of why a shared `hashIp()` helper should exist rather than each service reinventing one.
:::

CSP is the clearest example of layered responsibility: the backend **disables CSP entirely** (`contentSecurityPolicy: false` in Helmet, with a comment saying "Next.js handles it"), and Next.js genuinely does — with two different policies for two surfaces:

```mermaid
flowchart LR
    Req["Request reaching Next.js"] --> Check{"Path?"}
    Check -->|"/playground/*"| Strict["Strict CSP: default-src 'self' blob: data:\nno third-party domains, object-src 'none'\n(but unsafe-eval for Rapier's WASM)"]
    Check -->|everything else| Wide["Broad CSP: explicit allowlist for R2, YouTube,\nGiphy, Cloudflare Turnstile, the Sentry tunnel"]
```

An Nginx-layer rate limiter adds more: an `auth` zone capping 5 requests per minute across four login and registration routes, and an `api` zone at 30 per second for everything else — independent of the Express-layer limits, two layers unaware of each other protecting the same endpoints.

## Infrastructure and deployment

Five Docker Compose containers, with the project name pinned (`cuonghoangdev`) to stop Compose inventing a duplicate "repo" project — a real incident, when the missing `-p` flag made a deployment report success while the site kept running the old image.

| Service | Image | RAM limit | Published to host |
|---|---|---|---|
| postgres | `postgis/postgis:16-3.4`, 11 tuning flags (`shared_buffers=512MB`…) | 2G | `5432:5432` |
| redis | `redis:7-alpine`, `allkeys-lru`, AOF | 512M | `6379:6379` |
| backend | built from `Dockerfile.backend`, 2-stage | 2G | `3001:3001` |
| frontend | built from `frontend/Dockerfile`, 3-stage (glibc required for SWC) | 2G | *not published* |
| nginx | `nginx:1.27-alpine` | 256M | `80:80`, `443:443` |

### Deployment: from one command to zero downtime

```mermaid
flowchart TB
    A["bash deploy.sh — local machine"] --> B["Verify curricula match simulations\n+ actually run every sample exam"]
    B --> C["rsync code to the VPS\nexcluding .env / node_modules / dist"]
    C --> D["SSH into the VPS\nre-invoking deploy.sh in VPS mode"]
    D --> E["Build the backend image, THEN the frontend\nsequentially — against OOM"]
    E --> F["up -d --force-recreate\natomic swap, no --build"]
    F --> G["npx prisma migrate deploy"]
    G --> H["13 idempotent content seed steps"]
    H --> I["Internal health check\n18 attempts x 10 seconds"]
    I --> J["Smoke-test 29 unauthenticated routes\n404 = stale build, stop the deploy"]
    J --> K["Verify the /playground JS bundle hash"]
    K --> L["nginx -s reload"]
    L --> M["docker prune\nkeeping 8GB of build cache"]
```

Two pre-checks run **before rsync even starts**, on the local machine: reconciling curricula against the simulation scenario list, and **actually executing** every exam's sample answer to compare against `expectedOutput` — a failure stops everything before the VPS is touched.

Building the backend before the frontend is a specific defence: parallel builds on an 8GB VPS were once OOM-killed by the kernel (`exit 137`), because the cache is pruned after each deployment so every build is a cold build. The container swap step (`--force-recreate`) deliberately **omits** `--build`, because Compose would rebuild both images in parallel right there — destroying the very guard erected in the previous step.

The 29-route smoke test is a layer learned from a real incident: one deployment had a container reporting "healthy" (because the health check touched only a static route) while `/api/v1/gifs` returned 404 — the production image had not mounted that router even though the source contained it. Since then, every new feature module adds one parameter-free, unauthenticated GET route to the smoke-test list, and a `404` on any of them halts the deployment outright.

:::warning[Only one workflow runs automatically on push]
Of the repository's ten GitHub Actions workflows, only `ci-lint.yml` (type checking and tests) runs automatically on push or pull request. Every deployment workflow — including the "fast path" through GHCR — is `workflow_dispatch`-only and must be triggered by hand. That decision followed two real incidents: two deployment workflows raced each other on a push to `main`, once making the feed return 500 because the schema lagged the image, and once causing a container recreate race in the backend (`Exited(137)` plus orphaned containers). "Push to main equals automatic production deploy" sounds convenient, right up to the point where two independent processes touch one container.
:::

Nginx sits between every request and everything else, and pays for it by having to forward all the context itself: the original protocol, the original hostname and the user's IP — three things that vanish behind a proxy unless copied manually into headers (`X-Forwarded-For`, `X-Forwarded-Proto`). Omitting one line causes no immediate error — it surfaces far away, usually in a feature with nothing to do with networking. (A simulation scenario reproduces exactly this incident — see the resources section.)

## The AI / LLM layer

There is no single "AI service" — there are three, deliberately separated:

| Stack | Used by | Provider | Default model |
|---|---|---|---|
| A — multi-provider with ordered fallback | Free-tier AI Chat | Groq → OpenRouter → OpenAI | `llama-3.1-8b-instant` |
| B — Anthropic-compatible gateway (the platform core) | Interview, My Language, Code Lab, Tech Trends | Anthropic-compatible gateway | Sonnet for interaction, Opus for reports and content generation |
| C — CV Builder's own router | CV critique, translation, rewriting | Per task (`LLM_PROVIDER_<TASK>`) | Opus for critique, Haiku for the rest |

There is no official Anthropic SDK in `package.json` — stacks B and C call it directly with `fetch`. Embeddings run **entirely locally**: `Xenova/all-MiniLM-L6-v2` through ONNX, 384 dimensions, with no API calls and no network — serving only the site chatbot's RAG. The Interview Simulator's knowledge base has **no** embedding column; it looks up through Postgres `tsvector`, purely lexically, because the Postgres image running in production lacks `pgvector` (the `pgvector` package is in `package.json` but nothing imports it).

:::warning[Three independent circuit breakers, and why the second is split into buckets]
Stack B splits its circuit breaker into per-feature buckets (`interview`, `language`, `cv`, `chat`, `bulk_gen`, `exphub`, `codelab`) rather than one shared counter. The reason: a production run of 1,840 failed background calls (bulk content generation for Exp Hub plus bulk-gen) once took down interactive chat for users who were online, because everything shared one global breaker. Bucketing means a failing background job no longer drags down a feature somebody is actively using.
:::

There is a platform-wide kill switch (`FORCE_STATIC_MODE=true` disables every LLM), a two-tier quota (requests per minute through Redis, tokens per day through a `Decimal(12,6)` cost log table — an unrecognised model defaults to the *highest* price rather than zero, so spend never quietly vanishes from reports), and one anti-fabrication principle applied throughout: CV Builder's AI critique **may not** invent figures the user never supplied and must return `needsUserInput` instead of guessing.

## Realtime and data flow

Seven modules use real Socket.IO (Messenger, Presence, Feed, Notifications, Announcements, Music access, Listen Together) through a best-effort Redis adapter — if Redis dies it degrades to in-memory with a warning, accepting the loss of cross-process fan-out rather than accepting a downed server. The rest of the platform (Interview, CV, Code Lab, Exam, Finance…) is deliberately **not** realtime — REST and caching suffice, and opening a socket channel merely adds failure surface to a feature that does not need it.

AI Chat is the single exception, using Server-Sent Events rather than Socket.IO — because it is a one-way stream (server → client, LLM tokens arriving continuously) that does not need WebSocket's bidirectional complexity. The most memorable technical detail here is the `X-Accel-Buffering: no` header: without it, Nginx buffers the entire response and delivers it in one lump — users see the chatbot freeze and then answer instantly, exactly the opposite of the streaming effect required.

## Testing and quality evaluation

The honest picture: this project does **not** have high test coverage, and that is a debatable choice — but where it does test is not arbitrary.

**34 test cases across 4 files, run by Node's built-in test runner** (`tsx --test` — no Jest, no Vitest, one fewer heavy dependency):

| File | Cases | What it covers | Why this is the right place |
|---|---|---|---|
| `src/services/finance/money.test.ts` | 4 | Money arithmetic, HALF_UP rounding, the final instalment absorbing error | **Pure** functions untouched by the database — one wrong cent and users notice immediately |
| `src/services/payment/vnpay.test.ts` | 3 | Signing and verifying VNPay signatures | A wrong signature means broken payments or a forgery hole |
| `src/services/cv/cv.test.ts` | 13 | The deterministic CV bullet grading rules | A scoring rule set must stay stable across every edit |
| `src/utils/crypto.test.ts` | 14 | HMAC, presigned URLs, hashing | Fails silently, never surfacing through manual use |

The selection principle: **test what is deterministic, pure, and fails silently.** An interest calculation that is wrong throws no exception — it merely returns a slightly incorrect number that nobody notices until a customer reconciles their statement. A broken CRUD route, by contrast, reveals itself on the first click. For one person working over 50 days, investing test effort in the first category returns far more.

:::warning[A real process gap, found while writing this section]
`package.json` declares `"test": "tsx --test src/services/finance/money.test.ts src/services/payment/vnpay.test.ts src/services/cv/cv.test.ts"` — it **lists files explicitly**, and `src/utils/crypto.test.ts` (14 cases, the most of the four) is **not on the list**. Which means CI has never run it. This is the consequence of enumerating files by hand rather than using a glob: add a new test file, forget to edit `package.json`, and it exists while nobody runs it. The correct fix is `tsx --test "src/**/*.test.ts"`.
:::

**Three AI evaluation suites run in CI** — the more distinctive part, because testing software and evaluating model output are different problems. `ci-lint.yml` runs, in order: `npx tsc --noEmit` → `npm run eval:grader` → `npm run eval:cv-linter` → `npm run eval:cv-fabrication` → `npm test` → `npm run lint` (non-blocking).

`eval:cv-fabrication` is the one worth describing: it feeds in a CV **deliberately containing no figures**, then fails if the AI returns a `suggestedFix` containing a number without setting `needsUserInput`. In other words, it is **an automated test for whether the AI fabricates** — precisely the risk conventional software testing never touches. (It currently sleeps in CI because the API key secret was removed deliberately — see the technical debt section.)

**What is missing, stated plainly:** no integration tests touching a real database, no end-to-end test of the payment flow (despite `playwright` being a devDependency, used for rendering simulation videos), and no coverage measurement. For a system with money flowing through it, this sits at the top of the debt list the moment a second person joins.

## Backup and recovery

`scripts/backup-cron.sh` runs at **2am daily** (the crontab is installed by `backend-vps.yml`, not set up by hand):

```bash
D=$(date +%Y%m%d_%H%M%S)
F="/opt/cuonghoangdev/backups/${D}_backup.sql.gz"
docker exec cuonghoangdev_postgres pg_dump -U postgres cuonghoangdev_db | gzip > "$F"
```

But the instructive part is the second step — the **off-site copy**, and how it handles credentials:

```bash
# Read R2_BACKUP_* from the VPS env file and INJECT them into a ONE-SHOT docker exec.
# The always-running backend container NEVER carries backup-write credentials.
docker exec -e R2_BACKUP_BUCKET="$BK_BUCKET" \
            -e R2_BACKUP_ACCESS_KEY_ID="$BK_AK" \
            -e R2_BACKUP_SECRET_ACCESS_KEY="$BK_SK" \
            cuonghoangdev_backend node /app/backup-r2-upload.mjs ...
```

Three decisions inside those six lines, each countering a specific risk:

- **Least privilege.** The key with **write** access to the backup bucket is not in the long-running container's environment. If the application is compromised, an attacker has no credentials at hand to **delete or encrypt the backups themselves** — the scenario in which most ransomware victims actually lose.
- **A backup bucket separate from the media bucket.** Two key sets, two scopes.
- **An upload failure does NOT fail the local backup.** The command is wrapped in `|| echo WARN` — losing connectivity to R2 still leaves the copy on the VPS disk, rather than losing both.

:::note[A correction to a claim made in this very article]
The opening note says that "a few operational details on the real VPS — crontabs, firewall rules — live outside the repository and could not be verified from here". For **the backup crontab that is no longer true**: `backend-vps.yml` installs it explicitly and `scripts/backup-cron.sh` sits in the repository. The original claim was correct when written but has aged out — and correcting it here, rather than quietly editing the old line, matches the "write down what was wrong" spirit of the whole article.
:::

**What is still open:** there is no evidence anywhere in the repository that a backup has ever been **restored as a test**. A backup never restored is not a backup — it is a `.gz` file somebody hopes is correct. The minimum check worth running: monthly, take the newest archive, `gunzip | psql` it into an empty database, then count tables and row counts in a few core tables.

## Indexes and query performance

`prisma/schema.prisma` declares **411 `@@index`** entries and **77 `@@unique`** constraints across 248 models — nearly two indexes per table on average, a figure suggesting indexes were placed while designing the models rather than patched in after a slowness incident.

Three index patterns recur throughout, each worth learning because each answers a different query shape:

```prisma
// 1. A COMPOSITE index on (foreign key, sort column) — for "fetch this parent's children, in order"
@@index([projectId, order], name: "idx_project_milestones_project_order")

// 2. THREE columns when a filter is added — the column order MUST match the order used in WHERE
@@index([projectId, kind, order], name: "idx_project_list_items_project_kind_order")

// 3. @@unique as a BUSINESS CONSTRAINT, not merely for speed
@@unique([userId, courseId])                    // no duplicate enrolments
@@unique([userId, itemType, itemId])            // one progress row per item
@@unique([messageId, userId, emoji])            // one emoji per person, once
```

The third group is the most memorable and the through-line of this whole case study: **many `@@unique` constraints in this schema exist for correctness rather than performance.** The `@@unique([messageId, userId, emoji])` constraint is exactly what makes reaction toggling behave correctly under two concurrent requests — the application logic needs no lock at all, because the database refuses the second row. The same principle as `updateMany({ where: { status: 'AVAILABLE' } })` in the Shop section: **push the condition down to where atomicity lives.**

**What has not been done, stated plainly:** there is no evidence in the repository of systematic `EXPLAIN ANALYZE` work, no slow-query alerting threshold, and no percentile latency figures (p95/p99) for any endpoint. Across 63 routers there are quite likely undiscovered N+1 queries — the cheapest way to find them is enabling Prisma's query logging in development, opening a few list pages, and **counting**.

## If asked in an interview — the questions this project answers

A 248-model system does not automatically make a good interview story. What makes a strong answer is **one specific decision, the reasoning behind it, and what it cost**. Here are the question-to-section pairings inside this article:

| Common question | Answered by | The key point to make |
|---|---|---|
| "Tell me about a production incident and how you handled it" | Infrastructure and deployment | A deployment reported "healthy" while a route 404'd on a stale image ⇒ a 29-route smoke test where any `404` halts the deploy |
| "How do you handle concurrency?" | Shop — the key pool | `updateMany({where:{status:'AVAILABLE'}})` is an atomic compare-and-swap; the loser gets `count=0` and tries the next key |
| "What is idempotency and where did you use it?" | Shop — double-fulfilment defence | Webhooks may arrive twice or never ⇒ a conditional PENDING→PAID `updateMany` plus active reconciliation, both calling one function |
| "Why not use floats for money?" | Finance | IEEE-754, `Prisma.Decimal`, HALF_UP rounding after **every step**, the final instalment absorbing the remainder |
| "How do you design a realtime system?" | Presence | Audience = friends ∪ thread peers, never a global `io.emit()` — the earlier version caused an "O(N²) storm during deploy reconnects" |
| "How do you secure an API?" | Security and authentication | `authenticate` re-queries the database each request (a 7-day token means account locking must take effect immediately), `failOpen` rate limiting, XFF spoofing defence |
| "How do you use AI in a real product?" | The AI layer, Interview, CV | A deterministic core that works with the LLM disabled; evidence-gating against fabrication; per-bucket circuit breakers after a 1,840-call incident |
| "What trade-offs did you make, and why?" | Code Lab | No real sandbox, knowingly, written down, with a clear explanation of why it is acceptable here and would not be if the system graded submissions |
| "How do you test?" | Testing and evaluation | Testing concentrated on what is deterministic and fails silently — and an honest statement of what is missing |
| "What would you do differently?" | Technical debt and the rebuild route | Six stages, and why each defensive layer in `deploy.sh` was born from one specific incident |

A note on delivery: **every strong answer in that table has a number or a real incident behind it.** "I used Redis for caching" is something anybody can say; "a background job failing 1,840 calls once took down chat for users who were online, so the circuit breaker had to be split per feature rather than sharing one counter" is not.

## Technical debt — stated plainly

An honest case study must list what is unfinished. Here is what is known and queued:

1. **Code Lab has no real execution sandbox.** The client-side runner calls `new Function(code)` inside the page's own realm — same-origin, unsandboxed, untimed. The contrast: `/algorithms` solves the identical problem with a Web Worker and a hard timeout, in the same repository (see "How it works" above). "Solved" in Code Lab is currently only a status flag with no test harness behind it.
2. **Stories are finished but not routed.** Thirteen backend endpoints and a 623-line frontend component exist — but nothing in the app imports them. Whether that is a deliberate deferral or an abandoned thread is unclear.
3. **Semantic search is not enabled for the Interview knowledge base** — currently lexical-only, because the production Postgres image lacks `pgvector`.
4. **Two parallel IP hashing schemes** (proper HMAC versus a weak 32-bit hash) — they need consolidating behind one shared helper.
5. **Redis is published to the host with no password** in the repository's configuration — this needs verifying against the real VPS firewall, which cannot be checked from inside the repository.

:::tip[Why publish the technical debt]
A system of 248 models, built in 50 days, with no second pair of hands reviewing it, will always carry debt. Writing it down clearly, with the reason it is there, is the only way to stop it quietly becoming a fourth production incident.
:::

## If you want to rebuild this from scratch — a suggested route

Everything above describes the system as it *is* — but nobody builds 248 models and 46 modules simultaneously. This is the realistic order to follow when building a comparable platform from zero, based on how this project actually grew (see the timeline at the top): each stage should begin only once the previous one runs reliably.

**Stage 1 — an authentication core and one data domain.** Before contemplating 248 models, build the first six to ten: `User`, `Role`, `UserRole`, and one simple business domain (Blog or Skills, say — see the database architecture section). Get three things right immediately, because retrofitting them costs many times more: (a) JWT plus refresh tokens plus httpOnly cookies (the security section), (b) reusable `authenticate` and `requireRole` middleware (the backend architecture section), and (c) the `*.routes.ts` → `*.service.ts` → Prisma convention from the very first route, rather than letting business logic settle into routes and refactoring later.

**Stage 2 — one realtime feature, to learn Socket.IO properly.** Messenger or Presence (the "how it works" section) are good choices because they force you to solve the classic realtime problems: room conventions (per user, per resource — never a global `io.emit()`), re-authorisation at the event layer rather than only at handshake, and a Redis adapter if you ever intend to run multiple instances.

**Stage 3 — a content system with seed-from-code.** Before building an admin data-entry UI, try the content-as-code model that Academy and Courses use: content is `.mjs` or `.md` files in the repository, and an idempotent seed script reads and upserts them on natural keys. The immediate benefit: every content change is reviewable through `git diff` rather than vanishing after a form submission.

**Stage 4 — deployment infrastructure, before the system grows large enough that one bad deploy costs hours of cleanup.** Stand up Docker Compose (Postgres, Redis, the app), write a simple deploy script first, then accrete defensive layers in the order this project did: sequential builds against OOM → force-recreate without build → health checks → route smoke tests → (once you have separately built static assets) asset hash verification. Do not try to write all seven layers up front — each layer in `deploy.sh` was born from one specific real incident, and adding it when you actually hit that incident sticks far better than copying the whole thing.

**Stage 5 — AI as an additional layer, never the core.** The biggest lesson from the Interview Simulator, CV Builder and the Exam Room: build a **deterministic core that works with the LLM entirely disabled** first (rule-based grading, keyword matching, a rules engine) — AI should be an overlay switchable off by one environment variable (`FORCE_STATIC_MODE`) without breaking core functionality. Add per-feature circuit breakers (never a single global counter) before you have more than one AI call path — bucketing early is far cheaper than re-bucketing after a background job has already taken down a user-facing feature.

**Stage 6 — visualisation tooling, if the product needs it.** The three engine choices in this article (Canvas 2D for the Simulation Studio, a Web Worker for the Algorithm Visualizer, WebGPU for the 3D Playground) are not three ways of doing one thing — each solves a different problem. Before choosing, ask: does this need to export video (Canvas plus `captureStream`)? Does it run untrusted user code (a Worker plus a timeout)? Does it need real-time 3D graphics (WebGPU)? Choosing the wrong engine at the start is the most expensive item to refactor on the entire debt list above.

**Throughout every stage:** write technical debt down the moment you find it, rather than waiting until you write a case study. One comment saying "known, unfixed, here is why" at the point of the problem is worth far more than a retrospective article fifty days later.

## Where it stands today

248 Prisma models · 95 migrations · 63 backend routers · 180 frontend pages · 348 components · ~316,000 lines of TypeScript · 46 feature modules · 62 simulation scenarios · 80 visualised algorithms · 33 learning paths · 1,286 roadmap nodes · 1,672 commits across just over 50 days.

Still unfinished and in progress: a real execution sandbox for Code Lab, routing for Stories, enabling semantic search for Interview, and a small round of security debt cleanup (unifying the IP hashing, verifying the Redis firewall).
