import { Router } from 'express';
import { store } from '../store/index.js';
import { HttpError, onlyAllow } from '../http.js';
import { requireAuth, requireRole } from '../auth.js';
import { validate } from '../validate.js';
import { DeviceCreate, DevicePatch, DeviceCreateV2, DevicePatchV2 } from '../schemas.js';
import { etagOf, ifMatchVersion, preconditionFailed } from '../concurrency.js';
import { viewsOf, list } from '../views.js';
import { z } from 'zod';
import { safeFetch } from '../safeFetch.js';

export const devicesRouter = Router();
const manager = [requireAuth, requireRole('LAB_MANAGER')];

async function findDevice(id) {
  const d = await store.getDevice(id);
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

// Luật NGHIỆP VỤ (cần tra dữ liệu) — chạy SAU khi hình dạng đã đúng. Kho pg còn có UNIQUE(serial_no) chặn cuộc đua.
async function checkRules(body, selfId) {
  if (body.labId !== undefined) {
    const lab = await store.getLab(body.labId);
    if (!lab || lab.retiredAt) throw new HttpError(422, 'UNKNOWN_LAB', { id: body.labId });
  }
  if (body.serialNo !== undefined && await store.serialTaken(body.serialNo, selfId))
    throw new HttpError(409, 'DUPLICATE_SERIAL', { serialNo: body.serialNo });
}

devicesRouter.route('/')
  .get(async (req, res) => res.json(list(await store.listDevices({ labId: req.query.labId }), viewsOf(req).device)))
  .post(...manager, validate('body', CREATE), async (req, res) => {
    const body = internal(req.valid.body);
    await checkRules(body);
    const device = await store.createDevice(body);     // body đã qua strictObject ⇒ không có trường lạ
    res.status(201).location(`${req.baseUrl}/${device.id}`).json(viewsOf(req).device(device));
  })
  .all(onlyAllow('GET', 'HEAD', 'POST'));

// Bài 5.4 + 12.4: If-Match ⇒ "sửa NẾU version vẫn là số tôi đã thấy" — kiểm sớm (412 rẻ) VÀ kiểm lại trong câu UPDATE
async function write(req, res, fn) {
  const d = await findDevice(req.params.id);
  const expected = ifMatchVersion(req, d);                         // If-Match không khớp ⇒ 412 ngay; không gửi ⇒ undefined
  const body = internal(req.valid.body);
  await checkRules(body, d.id);
  const updated = await fn(d.id, body, expected);
  if (!updated) throw preconditionFailed(await findDevice(d.id));  // giữa lúc kiểm và lúc ghi có người sửa trước ⇒ vẫn 412
  res.set('ETag', etagOf(updated)).json(viewsOf(req).device(updated));
}

devicesRouter.route('/:id')
  .get(async (req, res) => {
    const d = await findDevice(req.params.id);
    res.set('ETag', etagOf(d)).json(viewsOf(req).device(d));      // If-None-Match khớp ⇒ Express tự trả 304
  })
  // PUT = THAY TOÀN BỘ: lược đồ giống hệt lúc tạo
  .put(...manager, validate('body', CREATE), (req, res) => write(req, res, store.replaceDevice))
  // PATCH = JSON Merge Patch (RFC 7396): null ⇒ xoá trường (chỉ note cho phép null)
  .patch(...manager, validate('body', PATCH), (req, res) => write(req, res, store.patchDevice))
  .delete(...manager, async (req, res) => {
    if (!await store.deleteDevice(req.params.id)) throw new HttpError(404, 'DEVICE_NOT_FOUND', { id: req.params.id });
    res.status(204).end();
  })
  .all(onlyAllow('GET', 'HEAD', 'PUT', 'PATCH', 'DELETE'));

// Bài 6.3 (OWASP API7 — SSRF): đính kèm link sách hướng dẫn; server tải thử để kiểm ⇒ phải chặn địa chỉ nội bộ
const ManualBody = z.strictObject({ url: z.string().max(500) });
devicesRouter.route('/:id/manual')
  .post(...manager, validate('body', ManualBody), async (req, res) => {
    const d = await findDevice(req.params.id);
    const probe = await safeFetch(req.valid.body.url);
    await store.setManualUrl(d.id, req.valid.body.url);
    res.json({ id: d.id, manualUrl: req.valid.body.url, probe });
  })
  .all(onlyAllow('POST'));
