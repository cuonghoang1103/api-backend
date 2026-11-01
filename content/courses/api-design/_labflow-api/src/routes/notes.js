// routes/notes.js — bài 9.3: ghi chú của phòng lab trong PostgreSQL có BẢN SAO ĐỌC (replica)
//   ghi ⇒ primary (PGURL)  ·  đọc ⇒ replica (PG_REPLICA_URL), trừ khi client cần "đọc thấy cái mình vừa ghi"
//   LABFLOW_READS = replica (đọc luôn ở replica) | token (tôn trọng header LabFlow-Consistency)
import { Router } from 'express';
import { z } from 'zod';
import pg from 'pg';
import { HttpError, onlyAllow } from '../http.js';
import { requireAuth, requireRole } from '../auth.js';
import { validate } from '../validate.js';

const primary = new pg.Pool({ connectionString: process.env.PGURL ?? 'postgres://labflow@localhost:55432/labflow', max: 5 });
const replica = new pg.Pool({ connectionString: process.env.PG_REPLICA_URL ?? 'postgres://labflow@localhost:55433/labflow', max: 5 });
await primary.query(`CREATE TABLE IF NOT EXISTS lab_notes (id bigserial PRIMARY KEY, lab_id text NOT NULL,
  author text NOT NULL, body text NOT NULL, created_at timestamptz NOT NULL DEFAULT now())`);
// Lab 9 — id công khai: uuidv7 (không lộ số lượng, không đoán được, vẫn xếp theo thời gian) + chỉ mục cho trang theo phòng
await primary.query(`ALTER TABLE lab_notes ADD COLUMN IF NOT EXISTS public_id uuid NOT NULL DEFAULT uuidv7()`);
await primary.query(`CREATE UNIQUE INDEX IF NOT EXISTS lab_notes_public ON lab_notes (public_id)`);
await primary.query(`CREATE INDEX IF NOT EXISTS lab_notes_lab_public ON lab_notes (lab_id, public_id DESC)`);
const MODE = process.env.LABFLOW_READS ?? 'replica';
const view = (r) => ({ id: r.public_id, labId: r.lab_id, author: r.author, body: r.body, createdAt: r.created_at.toISOString() });

// Chọn nơi đọc: có token (vị trí WAL lúc ghi) ⇒ chờ replica đuổi kịp tối đa 300 ms, không kịp thì đọc primary
async function readPool(req, res) {
  const token = req.get('LabFlow-Consistency');
  if (MODE !== 'token' || !token) { res.set('LabFlow-Read-From', 'replica'); return replica; }
  if (!/^[0-9A-F]{1,8}\/[0-9A-F]{1,8}$/i.test(token)) throw new HttpError(400, 'VALIDATION_FAILED', { header: 'LabFlow-Consistency' });
  const t0 = performance.now();
  while (performance.now() - t0 < 300) {
    const { rows: [r] } = await replica.query('SELECT pg_last_wal_replay_lsn() >= $1::pg_lsn AS ok', [token]);
    if (r.ok) { req.timing.add('wait', performance.now() - t0); res.set('LabFlow-Read-From', 'replica'); return replica; }
    await new Promise((ok) => setTimeout(ok, 20));
  }
  req.timing.add('wait', performance.now() - t0);
  res.set('LabFlow-Read-From', 'primary');                      // replica chậm quá ngân sách ⇒ đọc bản gốc
  return primary;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const NoteCreate = z.strictObject({ body: z.string().trim().min(1).max(500) });
export const labNotesRouter = Router({ mergeParams: true });
labNotesRouter.route('/')
  .get(async (req, res) => {
    // Lab 9 (lời giải): cursor = id công khai của ghi chú cuối trang (uuidv7 xếp theo thời gian) — không còn OFFSET
    const { cursor } = req.query;
    if (cursor !== undefined && !UUID.test(cursor)) throw new HttpError(400, 'VALIDATION_FAILED', { query: 'cursor' });
    const db = await readPool(req, res);
    const lab = req.params.labId;
    // ETag rẻ: ghi chú mới nhất của phòng (một lần dò chỉ mục) + trang nào ⇒ 304 TRƯỚC khi đọc 20 dòng
    const { rows: [top = {}] } = await req.timing.timeAsync('etag', () =>
      db.query('SELECT public_id::text AS newest FROM lab_notes WHERE lab_id = $1 ORDER BY public_id DESC LIMIT 1', [lab]));
    const tag = `"notes-${lab}-${top.newest ?? 'none'}-${cursor ?? 'first'}"`;
    res.set('ETag', tag).set('Cache-Control', 'public, max-age=5').vary('LabFlow-Consistency');   // client đòi đọc-sau-ghi ⇒ bản cache khác
    const inm = req.get('If-None-Match');
    if (inm && inm.split(',').map((x) => x.trim()).includes(tag)) return res.status(304).end();
    const { rows } = await req.timing.timeAsync('db', () => (cursor
      ? db.query('SELECT * FROM lab_notes WHERE lab_id = $1 AND public_id < $2 ORDER BY public_id DESC LIMIT 21', [lab, cursor])
      : db.query('SELECT * FROM lab_notes WHERE lab_id = $1 ORDER BY public_id DESC LIMIT 21', [lab])));
    const page = rows.slice(0, 20);
    const next = rows.length > 20 ? page[page.length - 1].public_id : null;
    if (next) res.links({ next: `${req.baseUrl}?cursor=${next}` });
    res.json({ data: page.map(view), page: { limit: 20, next } });
  })
  .post(requireAuth, requireRole('LAB_MANAGER'), validate('body', NoteCreate), async (req, res) => {
    const { rows: [r] } = await primary.query('INSERT INTO lab_notes (lab_id, author, body) VALUES ($1, $2, $3) RETURNING *',
      [req.params.labId, req.user.name, req.valid.body.body]);
    const { rows: [w] } = await primary.query('SELECT pg_current_wal_lsn()::text AS lsn');
    res.status(201).location(`/v2/notes/${r.public_id}`)
      .set('LabFlow-Consistency', w.lsn)                         // "dữ liệu của bạn có ở vị trí WAL này" — gửi lại khi đọc
      .json(view(r));                                            // trả LUÔN bản ghi vừa tạo: client không cần đọc lại
  })
  .all(onlyAllow('GET', 'POST'));

export const notesRouter = Router();
notesRouter.route('/:id')
  .get(async (req, res) => {
    if (!UUID.test(req.params.id)) throw new HttpError(404, 'NOTE_NOT_FOUND', { id: req.params.id });
    const db = await readPool(req, res);
    const { rows: [r] } = await db.query('SELECT * FROM lab_notes WHERE public_id = $1', [req.params.id]);
    if (!r) throw new HttpError(404, 'NOTE_NOT_FOUND', { id: req.params.id });
    res.json(view(r));
  })
  .all(onlyAllow('GET'));
