// routes/jobs.js — bài 10.1: tài nguyên công việc. GET hỏi trạng thái, POST …/cancel huỷ, GET …/result lấy kết quả.
import { Router } from 'express';
import { HttpError, onlyAllow } from '../http.js';
import { requireAuth } from '../auth.js';
import { getJob, cancelJob, getResult, toJob, RESULT_TTL_SEC } from '../jobs.js';

const POLL_SEC = process.env.JOB_POLL_SEC ?? '2';                 // gợi ý cho client: hỏi lại sau bao lâu
export const jobsRouter = Router();
jobsRouter.use(requireAuth);

// Việc của người khác ⇒ 404 (không lộ là việc đó tồn tại — bài 6.2)
async function ownJob(req) {
  const j = await getJob(req.params.id);
  if (!j || j.owner !== req.user.id) throw new HttpError(404, 'JOB_NOT_FOUND', { id: req.params.id });
  return j;
}
const finished = (j) => ['succeeded', 'failed', 'cancelled'].includes(j.status);

jobsRouter.route('/:id')
  .get(async (req, res) => {
    const j = await ownJob(req);
    if (!finished(j)) res.set('Retry-After', POLL_SEC);         // chưa xong ⇒ nói luôn lúc nào nên hỏi lại
    res.set('Cache-Control', 'no-store').json(toJob(j, req.baseUrl));
  })
  .all(onlyAllow('GET', 'HEAD'));

jobsRouter.route('/:id/cancel')
  .post(async (req, res) => {
    const j = await ownJob(req);
    if (finished(j)) throw new HttpError(409, 'JOB_FINISHED', { id: j.id, status: j.status });
    await cancelJob(j.id);
    res.status(202).json(toJob(await getJob(j.id), req.baseUrl));   // 202: đã nhận yêu cầu huỷ; worker dừng ở lô kế tiếp
  })
  .all(onlyAllow('POST'));

jobsRouter.route('/:id/result')
  .get(async (req, res) => {
    const j = await ownJob(req);
    if (j.status !== 'succeeded') {
      if (!finished(j)) res.set('Retry-After', POLL_SEC);
      throw new HttpError(409, 'JOB_NOT_FINISHED', { id: j.id, status: j.status });
    }
    const r = await getResult(j.id);
    if (!r) throw new HttpError(410, 'RESULT_EXPIRED', { id: j.id, ttl: RESULT_TTL_SEC });   // 410: đã từng có, nay hết hạn
    res.type(r.type).set('Cache-Control', 'private, max-age=60')
      .set('Content-Disposition', `attachment; filename="${j.id}.${r.type.startsWith('text/csv') ? 'csv' : 'json'}"`).send(r.body);
  })
  .all(onlyAllow('GET', 'HEAD'));
