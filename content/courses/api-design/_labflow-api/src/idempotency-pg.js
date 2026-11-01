// idempotency-pg.js — bài 8.3: CÙNG luật của bài 5.1, nhưng bảng khoá nằm trong PostgreSQL dùng CHUNG cho mọi instance.
// Một câu INSERT … ON CONFLICT DO NOTHING là "cái khoá" nguyên tử: hai instance nhận cùng khoá thì chỉ MỘT thắng.
import { createHash } from 'node:crypto';
import pg from 'pg';
import { HttpError } from './http.js';

const pool = new pg.Pool({ connectionString: process.env.PGURL ?? 'postgres://labflow@localhost:55432/labflow', max: 5 });
await pool.query(`CREATE TABLE IF NOT EXISTS idempotency_keys (
  scope text NOT NULL, key text NOT NULL, fp text NOT NULL,
  state text NOT NULL CHECK (state IN ('running', 'done')),
  status int, body jsonb, location text,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (scope, key))`);

const parseKey = (raw) => /^"?([\x21\x23-\x7e]{1,255}?)"?$/.exec(raw)?.[1];

export const idempotent = ({ required = false } = {}) => async (req, res, next) => {
  const raw = req.get('Idempotency-Key');
  if (raw === undefined) {
    if (required) throw new HttpError(400, 'IDEMPOTENCY_KEY_MISSING');
    return next();
  }
  const key = parseKey(raw);
  if (!key) throw new HttpError(400, 'IDEMPOTENCY_KEY_INVALID');
  const scope = req.user?.id ?? req.ip;
  const fp = createHash('sha256').update(`${req.method} ${req.originalUrl} ${JSON.stringify(req.body ?? null)}`).digest('hex');
  await pool.query(`DELETE FROM idempotency_keys WHERE scope = $1 AND key = $2 AND created_at < now() - interval '24 hours'`, [scope, key]);
  const won = await pool.query(`INSERT INTO idempotency_keys (scope, key, fp, state) VALUES ($1, $2, $3, 'running')
    ON CONFLICT DO NOTHING RETURNING 1`, [scope, key, fp]);
  if (won.rowCount === 0) {                                        // khoá đã có — ở instance này hay instance khác
    const { rows: [e] } = await pool.query('SELECT * FROM idempotency_keys WHERE scope = $1 AND key = $2', [scope, key]);
    if (e.fp !== fp) throw new HttpError(422, 'IDEMPOTENCY_KEY_REUSED');
    if (e.state === 'running') { res.set('Retry-After', '1'); throw new HttpError(409, 'IDEMPOTENCY_IN_PROGRESS'); }
    res.set('Idempotent-Replayed', 'true');
    if (e.location) res.location(e.location);
    return res.status(e.status).json(e.body);
  }
  let result;
  const json = res.json.bind(res);
  res.json = (body) => { result = { status: res.statusCode, body, location: res.get('Location') }; return json(body); };
  res.once('close', () => {
    const done = result && result.status < 300
      ? pool.query(`UPDATE idempotency_keys SET state = 'done', status = $3, body = $4, location = $5 WHERE scope = $1 AND key = $2`,
        [scope, key, result.status, JSON.stringify(result.body), result.location ?? null])
      : pool.query('DELETE FROM idempotency_keys WHERE scope = $1 AND key = $2', [scope, key]);
    done.catch((e) => console.error('idempotency-pg', e.message));
  });
  next();
};
