/**
 * ============================================================
 * Prisma Database Configuration
 *
 * - Singleton pattern: ngăn tạo nhiều PrismaClient instances
 * - Connection pool: tối ưu cho VPS với giới hạn kết nối
 * - Logging: query timing trong dev, error-only trong prod
 * - Shutdown: clean disconnect khi process exit
 * ============================================================
 */

import { PrismaClient, Prisma } from '@prisma/client';

// ─── Global singleton (ngăn hot reload tạo nhiều instances) ────
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

// ─── PrismaClient instance ─────────────────────────────────────
// Mỗi Node.js process chỉ nên có 1 PrismaClient duy nhất
// Prisma quản lý connection pool internally
const prismaClient = global.__prisma ?? new PrismaClient({
  // ─── Connection Pool Configuration ───────────────────────────
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },

  // ─── Log levels ────────────────────────────────────────────
  // development: log tất cả queries + warnings + errors
  // production:  log chỉ errors
  log: buildLogLevels(process.env.NODE_ENV),

  // ─── Prisma Client Runtime ────────────────────────────────
  // Dùng 'node' runtime thay vì 'edge' (edge chỉ cho serverless)
});

// ─── Attach to global trong non-production ───────────────────
if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prismaClient;
}

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

// ─── Connect ────────────────────────────────────────────────
export async function connectDatabase(): Promise<void> {
  try {
    // $connect() mở connection pool
    await prismaClient.$connect();

    // Verify bằng raw query (kiểm tra DB còn alive)
    const start = Date.now();
    await prismaClient.$queryRaw`SELECT 1`;
    const elapsed = Date.now() - start;

    console.log(`✅ Database connected (${elapsed}ms)`);
  } catch (error) {
    console.error('❌ Database connection failed:');
    throw error;
  }
}

// ─── Disconnect ─────────────────────────────────────────────
export async function disconnectDatabase(): Promise<void> {
  try {
    await prismaClient.$disconnect();
    console.log('✅ Database disconnected');
  } catch (error) {
    console.error('❌ Database disconnect error:', error);
    throw error;
  }
}

// ─── Query timeout wrapper ──────────────────────────────────
// Dùng cho các query nặng (migrate, seed, bulk operations)
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
// Dùng cho các operation cần atomicity
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function withTransaction<T>(
  fn: (tx: any) => Promise<T>,
): Promise<T> {
  return prismaClient.$transaction(fn);
}

// ─── Raw query shorthand ───────────────────────────────────
// Tiện cho các query phức tạp không fit vào Prisma API
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
