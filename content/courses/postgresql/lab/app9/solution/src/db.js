// db.js — ONE PrismaClient per process (each client owns its own pool: never create one per request).
// db.js — MỘT PrismaClient cho mỗi tiến trình (mỗi client giữ một pool riêng: đừng bao giờ tạo mỗi request một cái).
import { PrismaClient } from '@prisma/client';

export const dem = { sql: 0 };   // how many SQL statements Prisma has sent (dev only — shared by all requests)

export function taoPrisma(url = process.env.DATABASE_URL, { logLoi = true } = {}) {
  const prisma = new PrismaClient({
    datasourceUrl: url,
    log: [{ emit: 'event', level: 'query' }, { emit: 'stdout', level: 'warn' }, ...(logLoi ? [{ emit: 'stdout', level: 'error' }] : [])],
  });
  prisma.$on('query', (e) => {
    dem.sql++;
    if (process.env.LOG_SQL === '1') console.log(`prisma:query ${e.duration}ms ${e.query} ${e.params}`);
  });
  return prisma;
}

// The pool settings Prisma reads from the URL (connection_limit default = 2 × CPU cores + 1, pool_timeout default = 10 s).
export function thongSoPool(url = process.env.DATABASE_URL) {
  const p = new URL(url).searchParams;
  return { connection_limit: p.get('connection_limit') ?? 'default', pool_timeout: p.get('pool_timeout') ?? 'default' };
}
