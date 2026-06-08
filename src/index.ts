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

import { config } from './config/env.js';
import { prisma, connectDatabase } from './config/database.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// ─── Routes ────────────────────────────────────────────────
import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';
import blogRoutes from './routes/blog.routes.js';
import courseRoutes from './routes/course.routes.js';
import shopRoutes from './routes/shop.routes.js';
import musicRoutes from './routes/music.routes.js';
import aiRoutes from './routes/ai.routes.js';
import adminRoutes from './routes/admin.routes.js';
import skillRoutes from './routes/skill.routes.js';
import contactRoutes from './routes/contact.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import devPostRoutes from './routes/devPost.routes.js';
import systemRoutes from './routes/system.routes.js';

// ─── __dirname polyfill ──────────────────────────────
// @ts-ignore ESM import.meta polyfill
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// @ts-ignore suppress unused __dirname warning
void __dirname;

// ─── Express App ───────────────────────────────────────────
const app: Express = express();
const server = http.createServer(app);

// ─── 1. Trust Proxy (for Nginx/X-Forwarded-*) ────────────
app.set('trust proxy', 1);

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
// Production: https://cuonghoangdev.com hoặc custom domain
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Cho phép:
    // - Same-origin requests (no Origin header, e.g. SSR)
    // - Requests from configured ALLOWED_ORIGINS
    // - Requests from localhost (development)
    if (!origin) {
      callback(null, true);
      return;
    }
    const allowedOrigins = config.corsOrigins;
    if (allowedOrigins.includes(origin) || origin.includes('localhost')) {
      callback(null, true);
      return;
    }
    // In dev mode, allow all origins
    if (config.nodeEnv === 'development') {
      callback(null, true);
      return;
    }
    callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-Request-ID',
    'Accept',
    'Origin',
    'Cache-Control',
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
const generalLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs, // 15 phút
  max: config.rateLimitMaxRequests,    // 100 requests
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
  keyGenerator: (req: Request): string => {
    // Dùng X-Forwarded-For nếu có proxy
    return (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
      || req.ip
      || 'unknown';
  },
});

// Giới hạn riêng cho auth endpoints (ngăn brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 10, // 10 attempts
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again in 15 minutes.',
    code: 'AUTH_RATE_LIMITED',
  },
  keyGenerator: (req: Request): string => {
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

// ─── 9. API Routes ─────────────────────────────────────────
app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/blog', blogRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/shop', shopRoutes);
app.use('/api/v1/music', musicRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/skills', skillRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/files', uploadLimiter, uploadRoutes);
app.use('/api/v1/dev-posts', devPostRoutes);
app.use('/api/v1/system', systemRoutes);

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

// ─── 12. Global Error Handler ───────────────────────────────
app.use(errorHandler);

// ─── 13. Graceful Shutdown ─────────────────────────────────
// Xử lý khi container restart hoặc SIGTERM/SIGINT
function setupGracefulShutdown(): void {
  const shutdown = async (signal: string): Promise<void> => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);

    // Ngừng nhận request mới
    server.close(async () => {
      console.log('HTTP server closed');

      try {
        // Đợi request hiện tại hoàn thành (tối đa 10s)
        await prisma.$disconnect();
        console.log('Database connections closed');
      } catch (err) {
        console.error('Error during shutdown:', err);
      }

      console.log('Graceful shutdown complete');
      process.exit(0);
    });

    // Force close sau 30s
    setTimeout(() => {
      console.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 30_000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Xử lý uncaught exception
  process.on('uncaughtException', (err: Error) => {
    console.error('UNCAUGHT EXCEPTION! Shutting down...');
    console.error(err);
    shutdown('UNCAUGHT_EXCEPTION');
  });

  // Xử lý unhandled promise rejection
  process.on('unhandledRejection', (reason: unknown) => {
    console.error('UNHANDLED REJECTION! Shutting down...');
    console.error(reason);
    shutdown('UNHANDLED_REJECTION');
  });
}

// ─── 14. Server Startup ─────────────────────────────────────
async function startServer(): Promise<void> {
  try {
    // Kết nối database
    await connectDatabase();
    console.log('✅ Database connected');

    // Verify Prisma connection pool
    await prisma.$queryRaw`SELECT 1`;
    console.log(`✅ Database pool: OK (${config.nodeEnv})`);

    // Setup graceful shutdown handlers
    setupGracefulShutdown();

    // Start HTTP server
    server.listen(config.port, () => {
      console.log(`🚀 CuongHoangDev API running on port ${config.port}`);
      console.log(`   Environment: ${config.nodeEnv}`);
      console.log(`   Frontend URL: ${config.frontendUrl}`);
      console.log(`   Upload dir: ${config.uploadDir}`);
      console.log(`   Database: ${process.env.DATABASE_URL?.split('@')[1] || 'not configured'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export { app, server };
