// routes/stats.js — bài 9.2: số lượt đặt theo phòng trên bảng 1.000.000 dòng của PostgreSQL (Chương 3) — một truy vấn ĐẮT
import { Router } from 'express';
import pg from 'pg';
import { onlyAllow } from '../http.js';
import { cached } from '../serverCache.js';

const pool = new pg.Pool({ connectionString: process.env.PGURL ?? 'postgres://labflow@localhost:55432/labflow', max: 10 });
let queries = 0;                                                  // để HỌC: CSDL đã bị hỏi bao nhiêu lần
const SQL = `SELECT lab_id AS "labId", count(*)::int AS bookings FROM bookings WHERE status <> 'CANCELLED' GROUP BY lab_id ORDER BY lab_id`;

export const statsRouter = Router();
statsRouter.route('/labs')
  .get(async (req, res) => {
    const data = await cached(req, 'stats:labs:v1', 10, async () => { queries++; return (await pool.query(SQL)).rows; });
    res.set('LabFlow-DB-Queries', String(queries)).json({ data });
  })
  .all(onlyAllow('GET'));
