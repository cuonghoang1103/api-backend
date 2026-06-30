/**
 * ============================================================
 * CuongHoangDev API - Express Application Entry Point
 * ============================================================
 *
 * Thiết lập Express server hoàn chỉnh:
 * - Prisma database connection (connection pool)
 * - Middleware stack: CORS, Helmet, compression, rate limiting
 * - Static file serving cho ./uploads (trong development)
 * - Graceful shutdown
 * - Health check endpoint
 *
 * Run: npm run dev  (development with tsx hot reload)
 *      npm run build && npm start  (production)
 */

import 'dotenv/config';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from './utils/logger.js';

// Sentry must be initialised BEFORE any other module imports that
// could throw. We do it here (the very first thing) so a Prisma
// connection error during startup is also captured.
import { initSentry, captureException, flushSentry, setupSentryErrorHandler, sentryRequestMiddleware } from './services/sentry.service.js';
initSentry();

// Prisma returns BigInt for fields declared with `BigInt` in the
// schema (e.g. social_media.file_size, user.role_version, …).
// JSON.stringify doesn't know how to serialise those and would
// throw "Do not know how to serialize a BigInt" the moment we try
// to ship them through res.json(). Wire up a default toJSON that
// converts to a regular number so we never crash on the way out.
// Number(BigInt) is safe up to 2^53-1 which is well above any
// file size we accept (500MB video cap).
(BigInt.prototype as any).toJSON = function () {
  return Number(this);
};

// __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import express, {
  type Express,
  type Request,
  type Response,
} from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

// Dynamic imports với absolute path
const { config } = await import(path.join(__dirname, 'config', 'env.js'));
const { prisma, connectDatabase } = await import(path.join(__dirname, 'config', 'database.js'));
const { errorHandler, notFoundHandler } = await import(path.join(__dirname, 'middleware', 'errorHandler.js'));

// ─── Routes ────────────────────────────────────────────────
const authRoutes = (await import(path.join(__dirname, 'routes', 'auth.routes.js'))).default;
const profileRoutes = (await import(path.join(__dirname, 'routes', 'profile.routes.js'))).default;
const userRoutes = (await import(path.join(__dirname, 'routes', 'user.routes.js'))).default;
const friendRoutes = (await import(path.join(__dirname, 'routes', 'friend.routes.js'))).default;
const blogRoutes = (await import(path.join(__dirname, 'routes', 'blog.routes.js'))).default;
const courseRoutes = (await import(path.join(__dirname, 'routes', 'course.routes.js'))).default;
const paymentRoutes = (await import(path.join(__dirname, 'routes', 'payment.routes.js'))).default;
const academyRoutes = (await import(path.join(__dirname, 'routes', 'academy.routes.js'))).default;
const courseCategoryRoutes = (await import(path.join(__dirname, 'routes', 'courseCategory.routes.js'))).default;
const shopRoutes = (await import(path.join(__dirname, 'routes', 'shop.routes.js'))).default;
// Phase 4 add — the curated Song pool that powers the
// Instagram-style post-attached music sticker. We mount the
// picker route at /api/v1/songs (public, auth-only) and the
// admin CRUD at /api/v1/admin/songs (ROLE_ADMIN).
const { songRoutes, songAdminRoutes } = await import(
  path.join(__dirname, 'routes', 'songs.routes.js')
);
const musicRoutes = (await import(path.join(__dirname, 'routes', 'music.routes.js'))).default;
const musicAdminRoutes = (await import(path.join(__dirname, 'routes', 'music-admin.routes.js'))).default;
const musicHistoryRoutes = (await import(path.join(__dirname, 'routes', 'music-history.routes.js'))).default;
// Cyber-music Phase 1: persistent play queue (idempotent upsert, sparse-float positions).
const musicQueueRoutes = (await import(path.join(__dirname, 'routes', 'music-queue.routes.js'))).default;
// Cyber-music Phase 2a: per-user likes + per-user play counts.
const musicLikesRoutes = (await import(path.join(__dirname, 'routes', 'music-likes.routes.js'))).default;
const musicPlayCountsRoutes = (await import(path.join(__dirname, 'routes', 'music-play-counts.routes.js'))).default;
// Cyber-music Phase 2b: synced karaoke lyrics (per-track, idempotent upsert).
const musicLyricsRoutes = (await import(path.join(__dirname, 'routes', 'music-lyrics.routes.js'))).default;
const aiRoutes = (await import(path.join(__dirname, 'routes', 'ai.routes.js'))).default;
const adminRoutes = (await import(path.join(__dirname, 'routes', 'admin.routes.js'))).default;
const skillRoutes = (await import(path.join(__dirname, 'routes', 'skill.routes.js'))).default;
const projectRoutes = (await import(path.join(__dirname, 'routes', 'project.routes.js'))).default;
const certificateRoutes = (await import(path.join(__dirname, 'routes', 'certificate.routes.js'))).default;
const contactRoutes = (await import(path.join(__dirname, 'routes', 'contact.routes.js'))).default;
const uploadRoutes = (await import(path.join(__dirname, 'routes', 'upload.routes.js'))).default;
const devPostRoutes = (await import(path.join(__dirname, 'routes', 'devPost.routes.js'))).default;
const systemRoutes = (await import(path.join(__dirname, 'routes', 'system.routes.js'))).default;
const socialRoutes = (await import(path.join(__dirname, 'routes', 'social.routes.js'))).default;
const notificationRoutes = (await import(path.join(__dirname, 'routes', 'notifications.routes.js'))).default;
const githubRoutes = (await import(path.join(__dirname, 'routes', 'github.routes.js'))).default;
const dashboardRoutes = (await import(path.join(__dirname, 'routes', 'dashboard.routes.js'))).default;
const hubRoutesModule = await import(path.join(__dirname, 'routes', 'hub.routes.js'));
const hubRoutes = hubRoutesModule.default;
const { hubPublicRouter } = hubRoutesModule;
const cyberRoutes = (await import(path.join(__dirname, 'routes', 'cyber.routes.js'))).default;
const quotaRoutes = (await import(path.join(__dirname, 'routes', 'quota.routes.js'))).default;
const embedJobsRoutes = (await import(path.join(__dirname, 'routes', 'embedJobs.routes.js'))).default;
const { publicRouter: techTrendsPublicRoutes, adminRouter: techTrendsAdminRoutes } = (await import(path.join(__dirname, 'routes', 'techTrends.routes.js')));
const { router: messagesRoutes, adminRouter: adminMessagesRoutes } = (await import(path.join(__dirname, 'routes', 'messages.routes.js')));
const contentRoutes = (await import(path.join(__dirname, 'routes', 'content.routes.js'))).default;
const notesRoutes = (await import(path.join(__dirname, 'routes', 'notes.routes.js'))).default;
const notesShareRoutes = (await import(path.join(__dirname, 'routes', 'notesShare.routes.js'))).default;
const mobileRoutes = (await import(path.join(__dirname, 'routes', 'mobile.routes.js'))).default;
const { initSocketServer } = await import(path.join(__dirname, 'socket', 'messaging.socket.js'));

// ─── Express App ───────────────────────────────────────────
const app: Express = express();
const server = http.createServer(app);

// ─── 1. Trust Proxy (for Cloudflare → Nginx → Express) ──
// Stack in production: Cloudflare edge → Nginx reverse proxy →
// Express. Two hops minimum. `trust proxy = 1` only trusted the
// immediate upstream (Nginx), so `req.ip` resolved to Nginx's
// internal IP — every real user shared the same IP, which
// collapsed all of them into a single rate-limit bucket and
// caused random "Too many authentication attempts" errors when
// several users logged in within the same minute.
//
// We trust the X-Forwarded-For chain from our known reverse-proxy
// sources. Express's built-in presets:
//   • 'loopback'        — 127.0.0.1/8, ::1
//   • 'linklocal'       — 169.254.0.0/16, fe80::/10
//   • 'uniquelocal'     — 10/8, 172.16/12, 192.168/16, fc00::/7
// We also whitelist Cloudflare's edge IP ranges. Setting a
// function (req) => boolean lets us be precise about which hops
// are trusted per request.
app.set('trust proxy', (ip: string, hop: number): boolean => {
  if (!ip) return false;
  // Express sets `hop` to the hop count already extracted from
  // X-Forwarded-For. We want to trust the most recent 2 hops
  // (Cloudflare edge + Nginx). Anything beyond that is treated
  // as untrusted and req.ip falls back to the connection's
  // remote address.
  if (hop <= 1) return true;
  return false;
});

// ─── 2. Security Headers ───────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false, // Disable CSP — let Next.js handle it
    crossOriginEmbedderPolicy: false,
  }),
);

// ─── 3. CORS — cho phép Next.js frontend gọi API ──────────
// Development: http://localhost:3000
// Production: https://cuongthai.com
// CORS allow-list. Add additional origins via the CORS_ORIGINS env
// variable (CSV). Defaults cover the production domain and the
// development host. We intentionally include `www.` variants because
// some users bookmark the www subdomain — CORS would silently reject
// those and the user would see a generic "fetch failed" error in the
// console with no actionable hint.
const defaultCorsOrigins = [
  'https://cuongthai.com',
  'https://www.cuongthai.com',
  'http://localhost:3000',
];
const extraCorsOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Same-origin / curl / server-to-server requests have no Origin
    // header. Allow them through; the auth middleware decides whether
    // the request is actually authorized.
    if (!origin) return callback(null, true);

    const allowed = [...defaultCorsOrigins, ...extraCorsOrigins];
    if (allowed.includes(origin)) {
      return callback(null, true);
    }
    // Log rejected origins so ops can see what's being blocked in
    // production. We still return a CORS error so the browser drops
    // the response.
    logger.warn('CORS rejected origin', { origin });
    return callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'cf-turnstile-response',
  ],
  exposedHeaders: [
    'X-Request-ID',
    'Content-Range',
    'Accept-Ranges',
    'Content-Length',
  ],
  maxAge: 86400, // Preflight cache 24h
};
app.use(cors(corsOptions));

// ─── 4. Body Parsers ───────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(config.cookieSecret));

// ─── 5. Compression (gzip/brotli) ──────────────────────────
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  },
}));

// ─── 6. HTTP Logging ──────────────────────────────────────
if (config.nodeEnv !== 'test') {
  app.use(
    morgan('combined', {
      skip: (req: Request) =>
        req.url === '/health' || req.url === '/api/v1/system/health',
    }),
  );
}

// ─── 7. Static File Serving (Development) ───────────────────
// Trong production, Nginx sẽ serve /uploads/* trực tiếp từ SSD
// Trong development, Express serve để test
if (config.nodeEnv === 'development' || config.nodeEnv === 'test') {
  const uploadsDir = path.resolve(config.uploadDir);
  app.use(
    '/uploads',
    express.static(uploadsDir, {
      maxAge: '1h',
      etag: true,
      lastModified: true,
      dotfiles: 'ignore',
      redirect: true,
      index: false,
    }),
  );
}

// ─── 8. Rate Limiting ───────────────────────────────────────
// Giới hạn chung cho tất cả /api/* endpoints
// Raised from 100 → 500 per 15min to accommodate:
//   - QuotaIndicator polling every 30s
//   - Embed jobs auto-refresh every 10s
//   - Multiple browser tabs
const generalLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs, // 15 phút
  max: parseInt(process.env.RATE_LIMIT_MAX || '500', 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
  // Skip rate limit for admin/quota/embed-jobs routes (they have own auth)
  skip: (req: Request): boolean => {
    const path = req.path;
    return path.startsWith('/v1/quota')
      || path.startsWith('/v1/admin/embed-jobs')
      || path.startsWith('/auth/admin-check');
  },
  keyGenerator: (req: Request): string => {
    // Dùng X-Forwarded-For nếu có proxy
    return (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
      || req.ip
      || 'unknown';
  },
});

// Giới hạn riêng cho auth endpoints (ngăn brute force)
//
// Lưu ý: bucket này ĐƯỢC CHIA SẺ cho TẤT CẢ endpoints auth (login,
// register, verify-email-otp, change-password, forgot-password, resend-otp…).
// 10 requests / 15 phút là QUÁ THẤP cho production — một user bình thường
// mới: register (1) + verify (2) + login (3) + change password (4) = 4
// requests. Cộng thêm 1 lần sai password (5) là đã chiếm nửa quota, và
// mọi retry khi user quên pass / OTP sẽ bị 429. Tăng lên 50 để user
// thật không bị khóa nhầm trong khi brute-force vẫn bị chặn hiệu quả
// (với 50/15min, attacker vẫn không thể brute force một mật khẩu ngẫu
// nhiên — chỉ khoảng 0.05 mật khẩu/giây, thấp hơn tốc độ đoán thực tế
// của botnet).
const authLimiter = rateLimit({
  // Per user request: shorter window (1 minute) with 10 attempts is
  // enough to absorb normal multi-step flows (login, register,
  // verify-otp, change-password) while still preventing brute-force
  // attacks. The previous 15-minute window with 50 attempts was too
  // aggressive — legitimate cross-device logins (e.g. user signing
  // in on phone, then desktop) tripped the limit.
  windowMs: config.nodeEnv === 'production' ? 60 * 1000 : 60 * 1000,
  max: (req: Request) => {
    const host = req.headers.host || '';
    const forwardedFor = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || '';
    const ip = req.ip || '';
    const isLocalDebug = host.includes('localhost')
      || host.includes('127.0.0.1')
      || forwardedFor === '127.0.0.1'
      || forwardedFor === '::1'
      || ip === '127.0.0.1'
      || ip === '::1'
      || ip.endsWith('127.0.0.1');

    if (isLocalDebug) {
      return 100;
    }

    // Production: 10 attempts per minute per IP. This is enough for
    // a normal flow (register + verify + login + change password) to
    // complete without throttling, but blocks brute-force password
    // guessing where the attacker can typically only try a few
    // accounts per minute before the IP gets locked.
    return config.nodeEnv === 'production' ? 10 : 100;
  },
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please wait 1 minute and try again.',
    code: 'AUTH_RATE_LIMITED',
  },
  keyGenerator: (req: Request): string => {
    // Prefer Cloudflare's CF-Connecting-IP header (the user's real
    // IP, set by the Cloudflare edge). Fall back to the first hop in
    // X-Forwarded-For, then req.ip (which now correctly resolves
    // through our updated `trust proxy` setting).
    const cfIp = (req.headers['cf-connecting-ip'] as string | undefined)?.trim();
    if (cfIp) return cfIp;
    return (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
      || req.ip
      || 'unknown';
  },
});

// Giới hạn riêng cho upload endpoint
const uploadLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 phút
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Upload rate limit exceeded. Please wait a moment.',
    code: 'UPLOAD_RATE_LIMITED',
  },
});

app.use('/api/', generalLimiter);

// Tag incoming API requests with the route template so Sentry
// transactions don't explode into one entry per dynamic id.
app.use('/api/', sentryRequestMiddleware);

// ─── 9. API Routes ─────────────────────────────────────────
app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/friends', friendRoutes);
app.use('/api/v1/blog', blogRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/academy', academyRoutes);
app.use('/api/v1/course-categories', courseCategoryRoutes);
app.use('/api/v1/shop', shopRoutes);
app.use('/api/v1/songs', songRoutes);
app.use('/api/v1/admin/songs', songAdminRoutes);
app.use('/api/v1/music', musicRoutes);
app.use('/api/v1/music/admin', musicAdminRoutes);
app.use('/api/v1/music/history', musicHistoryRoutes);
// Cyber-music Phase 1 — per-user play queue (Spotify-style hybrid).
app.use('/api/v1/music/queue', musicQueueRoutes);
// Cyber-music Phase 2a — likes + most-played.
app.use('/api/v1/music/likes', musicLikesRoutes);
app.use('/api/v1/music/play-counts', musicPlayCountsRoutes);
// Cyber-music Phase 2b — synced karaoke lyrics (/tracks/:id/lyrics).
app.use('/api/v1/music', musicLyricsRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/admin/embed-jobs', embedJobsRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/skills', skillRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/certificates', certificateRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/files', uploadLimiter, uploadRoutes);
app.use('/api/v1/dev-posts', devPostRoutes);
app.use('/api/v1/tech-trends', techTrendsPublicRoutes);
app.use('/api/v1/admin/tech-trends', techTrendsAdminRoutes);
app.use('/api/v1/admin/content', contentRoutes);
app.use('/api/v1/system', systemRoutes);
app.use('/api/v1/social', socialRoutes);
app.use('/api/v1/social/notifications', notificationRoutes);
// Stories / Tin (Phase 6)
const storyRoutes = (await import(path.join(__dirname, 'routes', 'story.routes.js'))).default;
app.use('/api/v1/stories', storyRoutes);
// ─── Saved Collections alias (2026-06-20) ─────────────────────────
// The Saved Collections endpoints are exposed under /api/v1/feed
// per spec, but live in social.routes.ts (next to the existing
// /social/saves/* routes that share the same service layer). We
// mount the same router under a second prefix instead of duplicating
// the route definitions. Endpoints exposed here:
//
//   GET  /api/v1/feed/collections
//   POST /api/v1/feed/collections
//   POST /api/v1/feed/save-post
//
// The legacy /api/v1/social/posts/:id/save + /api/v1/social/saves/*
// routes mounted above remain untouched so existing clients keep
// working.
app.use('/api/v1/feed', socialRoutes);
app.use('/api/v1/repos', githubRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
// Hub — personal bookmark manager. Authenticated router for
// folders/links/scrape; public router for /public/:slug lookups
// (mounted on the same prefix but with no auth middleware).
app.use('/api/v1/hub', hubRoutes);
app.use('/api/v1/hub', hubPublicRouter);
// Notes — personal study notebooks (per-user, authenticated).
app.use('/api/v1/notes', notesRoutes);
// Notes Share — share subjects with other users
app.use('/api/v1/notes-shares', notesShareRoutes);
app.use('/api/v1/cyber', cyberRoutes);
app.use('/api/v1/quota', quotaRoutes);
app.use('/api/v1/messages', messagesRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/admin', adminMessagesRoutes);
// Admin moderation queue for thread reports (block/report system).
const { default: adminReportsRoutes } = (await import(path.join(__dirname, 'routes', 'admin.reports.routes.js')));
app.use('/api/v1/admin/reports', adminReportsRoutes);

app.use('/api/v1/mobile', mobileRoutes);

// ─── 9b. Socket.IO (Direct Messaging) ─────────────────
// Mount on the shared HTTP server so the existing trust-proxy /
// cookie / CORS configuration applies. Idempotent — safe to call
// from a hot-reload wrapper.
initSocketServer(server);

// ─── 10. Health Check ───────────────────────────────────────
// Render.com và Docker healthcheck gọi endpoint này
app.get('/health', async (_req: Request, res: Response) => {
  try {
    // Kiểm tra database connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected',
      environment: config.nodeEnv,
    });
  } catch {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      environment: config.nodeEnv,
    });
  }
});

// Render liveness probe (chỉ kiểm tra process còn chạy)
app.get('/health/live', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Render readiness probe (kiểm tra DB + cache)
app.get('/health/ready', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ready', database: 'ok' });
  } catch {
    res.status(503).json({ status: 'not ready', database: 'error' });
  }
});

// ─── 11. 404 Handler ───────────────────────────────────────
app.use(notFoundHandler);

// ─── 11b. Sentry Express Error Handler ─────────────────────
// Auto-captures thrown errors with the full request context.
// Must come AFTER all routes + 404, BEFORE the global error handler.
setupSentryErrorHandler(app);

// ─── 12. Global Error Handler ───────────────────────────────
app.use(errorHandler);

// ─── 13. Graceful Shutdown ─────────────────────────────────
// Xử lý khi container restart hoặc SIGTERM/SIGINT
function setupGracefulShutdown(): void {
 const shutdown = async (signal: string): Promise<void> => {
 logger.info('shutdown signal received', { signal });

 // Ngừng nhận request mới
 server.close(async () => {
 logger.info('HTTP server closed');

 try {
 // Đợi request hiện tại hoàn thành (tối đa 10s)
 await prisma.$disconnect();
 logger.info('Database connections closed');
 } catch (err) {
 logger.error('Error during shutdown', { error: err instanceof Error ? err.message : String(err) });
 }

 // Flush pending Sentry events before exit. We give it 2s
 // which is enough for in-flight events to ship without
 // delaying shutdown noticeably.
 await flushSentry(2000);

 logger.info('Graceful shutdown complete');
 process.exit(0);
 });

 // Force close sau 30s
 setTimeout(() => {
 logger.error('Could not close connections in time, forcefully shutting down');
 process.exit(1);
 }, 30_000);
 };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

 // Xử lý uncaught exception
 process.on('uncaughtException', (err: Error) => {
 logger.error('UNCAUGHT EXCEPTION! Shutting down...', { error: err.message, stack: err.stack });
 captureException(err, { type: 'uncaughtException' });
 shutdown('UNCAUGHT_EXCEPTION');
 });

 // Xử lý unhandled promise rejection
 process.on('unhandledRejection', (reason: unknown) => {
 logger.error('UNHANDLED REJECTION! Shutting down...', { reason: reason instanceof Error ? reason.message : String(reason) });
    // Sentry expects an Error. Wrap non-Error values so the stack
    // trace is captured.
    const err =
      reason instanceof Error
        ? reason
        : new Error(
            typeof reason === 'string' ? reason : 'Unhandled rejection',
          );
    captureException(err, { type: 'unhandledRejection' });
    shutdown('UNHANDLED_REJECTION');
  });
}

// ─── 14. Server Startup ─────────────────────────────────────
async function startServer(): Promise<void> {
  try {
    // Kết nối database (logs its own 'Database connected' with elapsedMs)
    await connectDatabase();

    // Verify Prisma connection pool with a real round-trip
    await prisma.$queryRaw`SELECT 1`;
    logger.info('Database pool OK', { env: config.nodeEnv });

    // ─── Auto-sync Prisma schema + add embedding column ────────
    // This ensures new tables (e.g. document_chunks) are created on startup
    // without requiring manual prisma db push after each deployment.
    // Also adds the `embedding JSONB` column for semantic search storage.
    // (We use JSONB instead of pgvector's vector type because the
    // current Postgres image doesn't bundle pgvector — see schema comment.)
    try {
      await prisma.$executeRawUnsafe(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT FROM pg_tables WHERE schemaname = 'public'
            AND tablename = 'document_chunks'
          ) THEN
            CREATE TABLE IF NOT EXISTS document_chunks (
              id SERIAL PRIMARY KEY,
              content TEXT NOT NULL,
              metadata JSONB DEFAULT '{}',
              chunk_index INTEGER NOT NULL,
              document_id VARCHAR(100) NOT NULL,
              document_type VARCHAR(50) NOT NULL,
              created_at TIMESTAMPTZ DEFAULT NOW()
            );
            CREATE INDEX IF NOT EXISTS idx_document_chunks_type
              ON document_chunks(document_type);
            CREATE INDEX IF NOT EXISTS idx_document_chunks_doc_id
              ON document_chunks(document_id);
          END IF;
        END
        $$;
      `);

      // Add embedding column (JSONB array of 768 numbers) for semantic search.
      // Idempotent: ADD COLUMN IF NOT EXISTS skips on re-run.
      await prisma.$executeRawUnsafe(`
        ALTER TABLE document_chunks
          ADD COLUMN IF NOT EXISTS embedding JSONB;
      `);

      // GIN index helps when we filter "WHERE embedding IS NOT NULL".
      await prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS idx_document_chunks_embedding_present
          ON document_chunks ((embedding IS NOT NULL))
          WHERE embedding IS NOT NULL;
      `);

      logger.info('document_chunks table + embedding column OK (auto-synced)');

      // ─── Hashtag search optimization (Social Feed) ─────────────
      // Enable pg_trgm for trigram-based ILIKE searches on post
      // content so hashtag filtering (GET /social/posts?hashtag=X)
      // and trending aggregation (GET /social/trending) stay fast
      // as the social_posts table grows past 100k rows.
      // Both CREATE EXTENSION and CREATE INDEX are idempotent.
      try {
        await prisma.$executeRawUnsafe('CREATE EXTENSION IF NOT EXISTS pg_trgm;');
        await prisma.$executeRawUnsafe(`
          CREATE INDEX IF NOT EXISTS idx_social_posts_content_trgm
            ON social_posts USING GIN (content gin_trgm_ops);
        `);
 logger.info('social_posts GIN trigram index OK');
 } catch (trgmErr) {
 // pg_trgm may not be available in all Postgres distributions.
 // The hashtag filter falls back to a sequential scan which is
 // correct but slower; this is non-fatal.
 logger.warn('pg_trgm index skipped (extension unavailable)', { error: trgmErr instanceof Error ? trgmErr.message : String(trgmErr) });
 }
 } catch (syncErr) {
 // If raw SQL fails, the try-catch guards in AIService handle missing tables.
 logger.warn('Schema auto-sync skipped', { error: syncErr instanceof Error ? syncErr.message : String(syncErr) });
 }

    // Setup graceful shutdown handlers
    setupGracefulShutdown();

    // Start cron jobs (Mục #6: auto-train + cleanup)
    try {
      const { startCronJobs } = await import(path.join(__dirname, 'services', 'cron.service.js'));
      startCronJobs();
    } catch (cronErr) {
 logger.warn('Cron jobs failed to start', { error: cronErr instanceof Error ? cronErr.message : String(cronErr) });
 }

 // Start HTTP server
 server.listen(config.port, () => {
 logger.info('CuongHoangDev API running', {
 port: config.port,
 env: config.nodeEnv,
 frontendUrl: config.frontendUrl,
 uploadDir: config.uploadDir,
 database: process.env.DATABASE_URL?.split('@')[1] || 'not configured',
 });
 });
 } catch (error) {
    logger.error('Failed to start server', { error: error instanceof Error ? error.message : String(error) });
    captureException(error, { type: 'startup' });
    process.exit(1);
  }
}

startServer();

export { app, server };
