import { Router } from 'express';
import { labs, devices } from '../db.js';
import { HttpError, onlyAllow } from '../http.js';
import { validate } from '../validate.js';
import { LabsQuery } from '../schemas.js';
import { fold } from '../text.js';
import { viewsOf, list } from '../views.js';
import { ipLimit } from '../rateLimit.js';
import { joinWaitlist } from './waitlist.js';
import { withLastGood } from '../resilience.js';
import { notModifiedEarly } from '../httpCache.js';

export const labsRouter = Router();
const readLabs = withLastGood(() => labs.filter((l) => !l.retiredAt));


function findLab(labId) {
  const lab = labs.find((l) => l.id === labId);
  if (!lab) throw new HttpError(404, 'LAB_NOT_FOUND', { id: labId });
  if (lab.retiredAt) throw new HttpError(410, 'LAB_RETIRED', { id: labId, since: lab.retiredAt });
  return lab;
}

// Bài 9.1 — danh sách phòng giống nhau cho mọi người, hiếm khi đổi ⇒ public, cache dùng chung giữ 60 s
labsRouter.route('/')
  .get(ipLimit, validate('query', LabsQuery), notModifiedEarly('labs', () => 'public, max-age=60'), (req, res) => {
    const { building, minCapacity, q } = req.valid.query;   // tham số lạ, sai kiểu ⇒ 400 trước khi tới đây
    // Bài 8.4: danh sách phòng gần như không đổi ⇒ CSDL sập vẫn trả bản tốt gần nhất, nói rõ là dữ liệu cũ
    const { data: all, stale } = readLabs(req, res);
    if (stale !== null) res.set('Age', String(stale)).set('LabFlow-Degraded', 'stale-data');
    let data = all;
    if (building) data = data.filter((l) => l.building === building);
    if (minCapacity) data = data.filter((l) => l.capacity >= minCapacity);
    if (q) data = data.filter((l) => fold(l.name).includes(fold(q)));
    res.json(list(data, viewsOf(req).lab));
  })
  .all(onlyAllow('GET', 'HEAD'));

labsRouter.route('/:labId')
  .get((req, res) => res.json(viewsOf(req).lab(findLab(req.params.labId))))
  .all(onlyAllow('GET', 'HEAD'));

// Bộ sưu tập con: thiết bị THUỘC một phòng lab
labsRouter.route('/:labId/devices')
  .get((req, res) => {
    const lab = findLab(req.params.labId);
    res.json(list(devices.filter((d) => d.labId === lab.id), viewsOf(req).device));
  })
  .all(onlyAllow('GET', 'HEAD'));

// Lab 7 — hàng chờ: POST /v2/labs/:labId/waitlist (thiết kế ở openapi.yaml TRƯỚC, code sau)
labsRouter.route('/:labId/waitlist')
  .post(...joinWaitlist)
  .all(onlyAllow('POST'));
