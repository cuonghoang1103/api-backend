import { Router } from 'express';
import { devices, labs, nextId } from '../db.js';
import { HttpError, onlyAllow } from '../http.js';
import { requireAuth, requireRole } from '../auth.js';
import { validate } from '../validate.js';
import { DeviceCreate, DevicePatch, DeviceCreateV2, DevicePatchV2 } from '../schemas.js';
import { etagOf, checkIfMatch, bump } from '../concurrency.js';
import { viewsOf, list } from '../views.js';
import { z } from 'zod';
import { safeFetch } from '../safeFetch.js';

export const devicesRouter = Router();
const manager = [requireAuth, requireRole('LAB_MANAGER')];

function findDevice(id) {
  const d = devices.find((x) => x.id === id);
  if (!d) throw new HttpError(404, 'DEVICE_NOT_FOUND', { id });
  return d;
}
// Lab 4 — body v2 ⇒ dạng NỘI BỘ (serialNumber ⇒ serialNo) ở MỘT chỗ; sau đó mọi luật dùng chung cho cả hai phiên bản
const CREATE = { 1: DeviceCreate, 2: DeviceCreateV2 };
const PATCH = { 1: DevicePatch, 2: DevicePatchV2 };
function internal(body) {
  if (!('serialNumber' in body)) return body;
  const { serialNumber, ...rest } = body;
  return { ...rest, serialNo: serialNumber };
}

// Luật NGHIỆP VỤ (cần tra dữ liệu) — chạy SAU khi hình dạng đã đúng
function checkRules(body, selfId) {
  if (body.labId !== undefined && !labs.some((l) => l.id === body.labId && !l.retiredAt))
    throw new HttpError(422, 'UNKNOWN_LAB', { id: body.labId });
  if (body.serialNo !== undefined && devices.some((d) => d.serialNo === body.serialNo && d.id !== selfId))
    throw new HttpError(409, 'DUPLICATE_SERIAL', { serialNo: body.serialNo });
}

devicesRouter.route('/')
  .get((req, res) => {
    const { labId } = req.query;
    res.json(list(labId ? devices.filter((d) => d.labId === labId) : devices, viewsOf(req).device));
  })
  .post(...manager, validate('body', CREATE), (req, res) => {
    const body = internal(req.valid.body);
    checkRules(body);
    const device = { id: nextId('dev'), ...body };     // body đã qua strictObject ⇒ không có trường lạ
    devices.push(device);
    res.status(201).location(`${req.baseUrl}/${device.id}`).json(viewsOf(req).device(device));
  })
  .all(onlyAllow('GET', 'HEAD', 'POST'));

devicesRouter.route('/:id')
  .get((req, res) => {
    const d = findDevice(req.params.id);
    res.set('ETag', etagOf(d)).json(viewsOf(req).device(d));      // If-None-Match khớp ⇒ Express tự trả 304
  })
  // PUT = THAY TOÀN BỘ: lược đồ giống hệt lúc tạo
  .put(...manager, validate('body', CREATE), (req, res) => {   // PUT = thay toàn bộ ⇒ cùng lược đồ với POST
    const d = findDevice(req.params.id);
    checkIfMatch(req, d);                                          // bài 5.4: sửa trên bản cũ ⇒ 412
    const body = internal(req.valid.body);
    checkRules(body, d.id);
    const version = d.version;
    Object.keys(d).forEach((k) => delete d[k]);
    Object.assign(d, { id: req.params.id, ...body, version });
    bump(res, d);
    res.json(viewsOf(req).device(d));
  })
  // PATCH = JSON Merge Patch (RFC 7396): null ⇒ xoá trường (chỉ note cho phép null)
  .patch(...manager, validate('body', PATCH), (req, res) => {
    const d = findDevice(req.params.id);
    checkIfMatch(req, d);                                          // bài 5.4: sửa trên bản cũ ⇒ 412
    const body = internal(req.valid.body);
    checkRules(body, d.id);
    for (const [k, v] of Object.entries(body)) {
      if (v === null) delete d[k];
      else d[k] = v;
    }
    bump(res, d);
    res.json(viewsOf(req).device(d));
  })
  .delete(...manager, (req, res) => {
    const i = devices.findIndex((x) => x.id === req.params.id);
    if (i === -1) throw new HttpError(404, 'DEVICE_NOT_FOUND', { id: req.params.id });
    devices.splice(i, 1);
    res.status(204).end();
  })
  .all(onlyAllow('GET', 'HEAD', 'PUT', 'PATCH', 'DELETE'));

// Bài 6.3 (OWASP API7 — SSRF): đính kèm link sách hướng dẫn; server tải thử để kiểm ⇒ phải chặn địa chỉ nội bộ
const ManualBody = z.strictObject({ url: z.string().max(500) });
devicesRouter.route('/:id/manual')
  .post(...manager, validate('body', ManualBody), async (req, res) => {
    const d = findDevice(req.params.id);
    const probe = await safeFetch(req.valid.body.url);
    d.manualUrl = req.valid.body.url;
    res.json({ id: d.id, manualUrl: d.manualUrl, probe });
  })
  .all(onlyAllow('POST'));
