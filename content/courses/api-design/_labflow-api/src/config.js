// config.js — bài 12.7: MỘT chỗ đọc biến môi trường, kiểm NGAY lúc khởi động. Thiếu thứ bắt buộc ⇒ dừng với danh sách đầy đủ
// (đừng để instance "chạy được" rồi hỏng ở request đầu tiên lúc 7 giờ sáng).
const env = process.env;
const PROD = env.NODE_ENV === 'production';

export const config = {
  production: PROD,
  instance: env.LABFLOW_INSTANCE ?? null,
  // memory = mảng trong RAM như Chương 1–11 (npm test chạy không cần CSDL) · pg = PostgreSQL thật (Chương 12)
  store: env.LABFLOW_STORE ?? (PROD ? 'pg' : 'memory'),
  // Chương 3–10 đo trên CSDL `labflow` (bảng bookings 1 triệu dòng giả). Dự án cuối khoá dùng CSDL RIÊNG, dựng bằng migration: DATABASE_URL.
  databaseUrl: env.DATABASE_URL ?? env.PGURL ?? 'postgres://labflow@localhost:55432/labflow',
  poolMax: Number(env.PG_POOL_MAX ?? 10),                    // kết nối tối đa MỖI instance (bài 12.3)
  poolWaitMs: Number(env.PG_POOL_WAIT_MS ?? 2000),           // chờ mượn kết nối quá lâu ⇒ 503 thay vì treo
  statementTimeoutMs: Number(env.PG_STATEMENT_TIMEOUT_MS ?? 5000),
  redisUrl: env.LABFLOW_REDIS ?? null,
  shutdownGraceMs: Number(env.SHUTDOWN_GRACE_MS ?? 10000),   // bài 12.7: chờ request đang dở tối đa bao lâu khi tắt
};

// Trạng thái dùng chung giữa các instance (bài 12.4) — mặc định đi theo store: có PostgreSQL + Redis thì dùng chúng
config.shared = config.store === 'pg';
config.rateLimitStore = env.LABFLOW_RATE ?? (config.shared && config.redisUrl ? 'redis' : 'memory');
config.ticketStore = env.LABFLOW_TICKETS ?? (config.shared && config.redisUrl ? 'redis' : 'memory');
config.events = env.LABFLOW_EVENTS ?? (config.shared && config.redisUrl ? 'redis' : 'memory');   // Chương 10
config.jobs = env.LABFLOW_JOBS ?? (config.shared && config.redisUrl ? 'bullmq' : 'memory');

export function checkConfig() {
  const missing = [];
  if (PROD) {
    if (!env.LABFLOW_JWT_SECRET) missing.push('LABFLOW_JWT_SECRET (bí mật ký JWT, ≥ 32 byte ngẫu nhiên)');
    else if (env.LABFLOW_JWT_SECRET.length < 32) missing.push('LABFLOW_JWT_SECRET quá ngắn (< 32 ký tự)');
    if (!env.DATABASE_URL) missing.push('DATABASE_URL (postgres://user:pass@host:5432/db)');
    if (!env.LABFLOW_REDIS) missing.push('LABFLOW_REDIS (redis://host:6379 — rate limit, vé realtime, sự kiện, hàng đợi)');
    if (config.store !== 'pg') missing.push('LABFLOW_STORE phải là pg ở production (RAM mất dữ liệu khi khởi động lại)');
    for (const v of ['LABFLOW_VULN', 'LABFLOW_CHAOS', 'LABFLOW_CACHE_BUG', 'LABFLOW_NOW', 'LABFLOW_IP_LIMIT', 'LABFLOW_BOOKING_LIMIT'])
      if (env[v]) missing.push(`${v} là biến CHỈ để học — gỡ khỏi môi trường production`);
  }
  if (!['memory', 'pg'].includes(config.store)) missing.push(`LABFLOW_STORE=${config.store} không hợp lệ (memory | pg)`);
  if (config.store === 'pg' && !env.DATABASE_URL && !PROD) missing.push('LABFLOW_STORE=pg cần DATABASE_URL (CSDL riêng của dự án, đã chạy npm run db:migrate)');
  if (missing.length) {
    console.error(`LabFlow không khởi động — cấu hình thiếu/sai (${missing.length}):\n${missing.map((m) => `  • ${m}`).join('\n')}`);
    process.exit(1);
  }
}
