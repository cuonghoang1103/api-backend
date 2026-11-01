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
const MODE = process.env.LABFLOW_READS ?? 'replica';
const view = (r) => ({ id: `note_${r.id}`, labId: r.lab_id, author: r.author, body: r.body, createdAt: r.created_at.toISOString() });

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

const NoteCreate = z.strictObject({ body: z.string().trim().min(1).max(500) });
export const labNotesRouter = Router({ mergeParams: true });
labNotesRouter.route('/')
  .get(async (req, res) => {
    const db = await readPool(req, res);
    // Lab 9 (bản khởi đầu): phân trang ?page=N bằng OFFSET, 20 ghi chú mỗi trang
    const page = Math.max(1, Number.parseInt(req.query.page ?? '1', 10) || 1);
    const { rows } = await req.timing.timeAsync('db', () =>
      db.query('SELECT * FROM lab_notes WHERE lab_id = $1 ORDER BY id DESC LIMIT 20 OFFSET $2', [req.params.labId, (page - 1) * 20]));
    res.json({ data: rows.map(view), page });
  })
  .post(requireAuth, requireRole('LAB_MANAGER'), validate('body', NoteCreate), async (req, res) => {
    const { rows: [r] } = await primary.query('INSERT INTO lab_notes (lab_id, author, body) VALUES ($1, $2, $3) RETURNING *',
      [req.params.labId, req.user.name, req.valid.body.body]);
    const { rows: [w] } = await primary.query('SELECT pg_current_wal_lsn()::text AS lsn');
    res.status(201).location(`/v2/notes/note_${r.id}`)
      .set('LabFlow-Consistency', w.lsn)                         // "dữ liệu của bạn có ở vị trí WAL này" — gửi lại khi đọc
      .json(view(r));                                            // trả LUÔN bản ghi vừa tạo: client không cần đọc lại
  })
  .all(onlyAllow('GET', 'POST'));

export const notesRouter = Router();
notesRouter.route('/:id')
  .get(async (req, res) => {
    const id = /^note_(\d+)$/.exec(req.params.id)?.[1];
    if (!id) throw new HttpError(404, 'NOTE_NOT_FOUND', { id: req.params.id });
    const db = await readPool(req, res);
    const { rows: [r] } = await db.query('SELECT * FROM lab_notes WHERE id = $1', [id]);
    if (!r) throw new HttpError(404, 'NOTE_NOT_FOUND', { id: req.params.id });
    res.json(view(r));
  })
  .all(onlyAllow('GET'));
