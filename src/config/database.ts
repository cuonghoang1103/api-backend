/**
 * ============================================================
 * Prisma Database Configuration
 *
 * - Mỗi startup tạo PrismaClient mới — tránh cache từ container cũ
 * - Connection pool: tối ưu cho VPS với giới hạn kết nối
 * - Logging: query timing trong dev, error-only trong prod
 * - Shutdown: clean disconnect khi process exit
 * ============================================================
 */

import { PrismaClient, Prisma } from '@prisma/client';
import { logger } from '../utils/logger.js';

// ─── PrismaClient instance ─────────────────────────────────────
// Tạo mới mỗi lần process start — KHÔNG dùng singleton global
// Vì production không cần hot-reload, singleton gây bug khi env vars thay đổi
const prismaClient = new PrismaClient({
  // ─── Connection Pool Configuration ───────────────────────────
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },

  // ─── Log levels ───────────────────────────────────────────
  log: buildLogLevels(process.env.NODE_ENV),
});

// ─── Helper: Build log levels từ NODE_ENV ───────────────────
function buildLogLevels(
  env: string | undefined,
): Array<Prisma.LogLevel | Prisma.LogDefinition> {
  switch (env) {
    case 'development':
      return [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
        { emit: 'event', level: 'error' },
      ];
    case 'test':
      return [{ emit: 'event', level: 'error' }];
    case 'production':
    default:
      return [
        { emit: 'event', level: 'error' },
        // Bật query log trong production chỉ khi cần debug
        ...(process.env.DEBUG_SQL === 'true'
          ? [{ emit: 'event' as const, level: 'query' as const }]
          : []),
      ];
  }
}

// ─── Connect ───────────────────────────────────────────────
export async function connectDatabase(): Promise<void> {
  try {
    // $connect() mở connection pool
    await prismaClient.$connect();

    // Verify bằng raw query (kiểm tra DB còn alive)
    const start = Date.now();
    await prismaClient.$queryRaw`SELECT 1`;
    const elapsed = Date.now() - start;

 logger.info('Database connected', { elapsedMs: elapsed });
 } catch (error) {
 logger.error('Database connection failed', { error: error instanceof Error ? error.message : String(error) });
 throw error;
 }
}

// ─── Disconnect ─────────────────────────────────────────────
export async function disconnectDatabase(): Promise<void> {
  try {
    await prismaClient.$disconnect();
 logger.info('Database disconnected');
 } catch (error) {
 logger.error('Database disconnect error', { error: error instanceof Error ? error.message : String(error) });
 throw error;
 }
}

// ─── Query timeout wrapper ─────────────────────────────────
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 30_000,
): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(
      () => reject(new Error(`Query timeout after ${timeoutMs}ms`)),
      timeoutMs,
    ),
  );
  return Promise.race([promise, timeout]);
}

// ─── Transaction helper ─────────────────────────────────────
export async function withTransaction<T>(
  fn: (tx: unknown) => Promise<T>,
): Promise<T> {
  return prismaClient.$transaction(fn);
}

// ─── Raw query shorthand ───────────────────────────────────
export async function rawQuery<T>(
  query: TemplateStringsArray,
  ...values: unknown[]
): Promise<T> {
  const sql = query.join('?');
  return prismaClient.$queryRawUnsafe<T>(sql, ...values);
}

// ─── Health check ───────────────────────────────────────────
export async function isDatabaseHealthy(): Promise<boolean> {
  try {
    await prismaClient.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

// ─── Prisma Client instance ─────────────────────────────────
export { prismaClient as prisma };
