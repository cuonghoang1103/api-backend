// pg.js — bài 12.3: MỘT pool kết nối cho cả instance. Mọi module dùng chung pool này (mã Chương 11 có 7 chỗ tạo pool riêng).
import pg from 'pg';
import { config } from './config.js';
import { HttpError } from './http.js';

// int8 (bigint, count(*)) mặc định ra chuỗi để không mất chính xác; LabFlow không có số > 2^53 ⇒ đọc thành số
pg.types.setTypeParser(20, Number);

export const pool = new pg.Pool({
  connectionString: config.databaseUrl,
  max: config.poolMax,                                // tổng kết nối = max × số instance ≤ max_connections của PostgreSQL
  connectionTimeoutMillis: config.poolWaitMs,         // pool cạn: chờ tối đa chừng này rồi BÁO LỖI (mặc định của pg là chờ mãi)
  idleTimeoutMillis: 30_000,
  allowExitOnIdle: true,                              // test/script xong việc thì thoát được, không bị kết nối rảnh giữ lại
  statement_timeout: config.statementTimeoutMs,       // một câu SQL chạy quá 5 s ⇒ PostgreSQL tự huỷ (57014)
  application_name: process.env.PG_APP_NAME ?? `labflow-api${config.instance ? `-${config.instance}` : ''}`,   // thấy trong pg_stat_activity
});
// Kết nối đang RẢNH bị đứt (CSDL khởi động lại) ⇒ pool phát 'error'; không bắt là cả tiến trình chết
pool.on('error', (e) => console.error('pg pool:', e.message));

// Lỗi "không tới được CSDL" ⇒ 503 + Retry-After (bài 8.4), không phải 500. Lỗi khác (SQL sai…) để nguyên ⇒ 500.
const DOWN = new Set(['ECONNREFUSED', 'ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND', '57P01', '57P02', '57P03', '08006', '08001', '08003']);
export function asHttp(e) {
  if (e instanceof HttpError) return e;
  if (DOWN.has(e.code) || /Connection terminated|timeout exceeded when trying to connect/.test(e.message)) {
    const err = new HttpError(503, 'DEPENDENCY_DOWN');
    err.retryAfter = 5;
    err.cause = e;
    return err;
  }
  if (e.code === '57014') {                           // statement_timeout
    const err = new HttpError(503, 'DEPENDENCY_DOWN');
    err.retryAfter = 1;
    err.cause = e;
    return err;
  }
  return e;
}

export async function q(text, args) {
  try { return await pool.query(text, args); } catch (e) { throw asHttp(e); }
}

// tx(fn): BEGIN → fn(client) → COMMIT; lỗi bất kỳ ⇒ ROLLBACK rồi ném tiếp. Luôn trả kết nối về pool.
export async function tx(fn) {
  let c;
  try { c = await pool.connect(); } catch (e) { throw asHttp(e); }
  try {
    await c.query('BEGIN');
    const out = await fn(c);
    await c.query('COMMIT');
    return out;
  } catch (e) {
    await c.query('ROLLBACK').catch(() => {});
    throw asHttp(e);
  } finally {
    c.release();
  }
}

export const poolStats = () => ({ total: pool.totalCount, idle: pool.idleCount, waiting: pool.waitingCount, max: config.poolMax });
