// routes/webhooks.js — bài 10.5: đăng ký webhook (chỉ LAB_MANAGER), xem nhật ký giao. Cần PostgreSQL (LABFLOW_PG=1).
// Việc GỬI nằm ở worker (src/worker.js): đọc stream sự kiện ⇒ xếp lượt giao vào hàng đợi ⇒ gửi, ký, thử lại lùi dần.
import { Router } from 'express';
import { z } from 'zod';
import pg from 'pg';
import { HttpError, onlyAllow } from '../http.js';
import { requireAuth, requireRole } from '../auth.js';
import { validate } from '../validate.js';
import { assertPublicUrl } from '../safeFetch.js';
import { newSecret } from '../webhooks.js';

export const pool = new pg.Pool({ connectionString: process.env.PGURL ?? 'postgres://labflow@localhost:55432/labflow', max: 3 });
await pool.query(`CREATE TABLE IF NOT EXISTS webhook_subscriptions (
  id text PRIMARY KEY, owner_id text NOT NULL, url text NOT NULL, events text[] NOT NULL, secret text NOT NULL,
  status text NOT NULL DEFAULT 'active', created_at timestamptz NOT NULL DEFAULT now())`);
await pool.query(`CREATE TABLE IF NOT EXISTS webhook_deliveries (
  id bigserial PRIMARY KEY, msg_id text NOT NULL, subscription_id text NOT NULL, event_type text NOT NULL,
  attempt int NOT NULL, status_code int, error text, duration_ms int, at timestamptz NOT NULL DEFAULT now())`);

export const EVENT_TYPES = ['labflow.booking.created.v1', 'labflow.booking.cancelled.v1', 'labflow.booking.checked_in.v1',
  'labflow.export.completed.v1', 'labflow.report.ready.v1'];
const Create = z.strictObject({ url: z.string().max(500), events: z.array(z.enum(EVENT_TYPES)).min(1) });
const view = (s) => ({ id: s.id, url: s.url, events: s.events, status: s.status, createdAt: s.created_at.toISOString() });

export const webhooksRouter = Router();
webhooksRouter.use(requireAuth, requireRole('LAB_MANAGER'));
webhooksRouter.route('/')
  .post(validate('body', Create), async (req, res) => {
    const { url, events } = req.valid.body;
    await assertPublicUrl(url);                                    // SSRF: không cho LabFlow tự gọi vào mạng nội bộ
    const id = `wh_${Date.now().toString(36)}`, secret = newSecret();
    const { rows: [s] } = await pool.query(
      'INSERT INTO webhook_subscriptions (id, owner_id, url, events, secret) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [id, req.user.id, url, events, secret]);
    res.status(201).location(`${req.baseUrl}/${id}`).set('Cache-Control', 'no-store').json({ ...view(s), secret });   // secret: chỉ lần này
  })
  .get(async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM webhook_subscriptions WHERE owner_id = $1 ORDER BY created_at', [req.user.id]);
    res.json({ data: rows.map(view) });
  })
  .all(onlyAllow('GET', 'HEAD', 'POST'));

async function own(req) {
  const { rows: [s] } = await pool.query('SELECT * FROM webhook_subscriptions WHERE id = $1 AND owner_id = $2', [req.params.id, req.user.id]);
  if (!s) throw new HttpError(404, 'WEBHOOK_NOT_FOUND', { id: req.params.id });
  return s;
}
webhooksRouter.route('/:id')
  .get(async (req, res) => res.json(view(await own(req))))
  .delete(async (req, res) => { await own(req); await pool.query('DELETE FROM webhook_subscriptions WHERE id = $1', [req.params.id]); res.status(204).end(); })
  .all(onlyAllow('GET', 'HEAD', 'DELETE'));

// Nhật ký giao: bên nhận hỏi "sao tôi không nhận được?" ⇒ trả lời bằng dữ liệu, không bằng phỏng đoán
webhooksRouter.route('/:id/deliveries')
  .get(async (req, res) => {
    await own(req);
    const { rows } = await pool.query(`SELECT msg_id, event_type, attempt, status_code, error, duration_ms, at FROM webhook_deliveries
      WHERE subscription_id = $1 ORDER BY id DESC LIMIT 50`, [req.params.id]);
    res.json({ data: rows.map((r) => ({ messageId: r.msg_id, type: r.event_type, attempt: r.attempt, status: r.status_code,
      error: r.error, durationMs: r.duration_ms, at: r.at.toISOString() })) });
  })
  .all(onlyAllow('GET', 'HEAD'));
