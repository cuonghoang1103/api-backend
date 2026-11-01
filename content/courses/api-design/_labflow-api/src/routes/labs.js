import { Router } from 'express';
import { store } from '../store/index.js';
import { HttpError, onlyAllow } from '../http.js';
import { validate } from '../validate.js';
import { LabsQuery } from '../schemas.js';
import { viewsOf, list } from '../views.js';
import { ipLimit } from '../rateLimit.js';
import { joinWaitlist } from './waitlist.js';
import { withLastGood } from '../resilience.js';
import { notModifiedEarly } from '../httpCache.js';
import { cachedLabs } from '../labsCache.js';

export const labsRouter = Router();
// Bài 12.5: danh sách phòng đọc qua cache Redis (LABFLOW_CACHE_MODE) — kho pg không phải trả một câu SQL cho MỖI người xem
const readLabs = withLastGood((req) => cachedLabs(req, req.valid.query, () => store.listLabs(req.valid.query)));

async function findLab(labId) {
  const lab = await store.getLab(labId);
  if (!lab) throw new HttpError(404, 'LAB_NOT_FOUND', { id: labId });
  if (lab.retiredAt) throw new HttpError(410, 'LAB_RETIRED', { id: labId, since: lab.retiredAt });
  return lab;
}

// Bài 9.1 — danh sách phòng giống nhau cho mọi người, hiếm khi đổi ⇒ public, cache dùng chung giữ 60 s
labsRouter.route('/')
  .get(ipLimit, validate('query', LabsQuery), notModifiedEarly('labs', () => 'public, max-age=60'), async (req, res) => {
    // Bài 8.4: CSDL sập thì trả bản tốt gần nhất, nói rõ là dữ liệu cũ (Chương 12: "sập" là THẬT — mất kết nối PostgreSQL)
    const { data, stale } = await readLabs(req, res);
    if (stale !== null) res.set('Age', String(stale)).set('LabFlow-Degraded', 'stale-data');
    res.json(list(data, viewsOf(req).lab));
  })
  .all(onlyAllow('GET', 'HEAD'));

labsRouter.route('/:labId')
  .get(async (req, res) => res.json(viewsOf(req).lab(await findLab(req.params.labId))))
  .all(onlyAllow('GET', 'HEAD'));

// Bộ sưu tập con: thiết bị THUỘC một phòng lab
labsRouter.route('/:labId/devices')
  .get(async (req, res) => {
    const lab = await findLab(req.params.labId);
    res.json(list(await store.listDevices({ labId: lab.id }), viewsOf(req).device));
  })
  .all(onlyAllow('GET', 'HEAD'));

// Lab 7 — hàng chờ: POST /v2/labs/:labId/waitlist (thiết kế ở openapi.yaml TRƯỚC, code sau)
labsRouter.route('/:labId/waitlist')
  .post(...joinWaitlist)
  .all(onlyAllow('POST'));
