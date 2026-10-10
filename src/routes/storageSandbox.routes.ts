/**
 * Đợt 6 — phục vụ kho R2 GIẢ cho backend local (`STORAGE_SANDBOX=1`): `GET /__r2-sandbox/<key>` trả tệp đã "tải lên",
 * `PUT /__r2-sandbox/<key>` nhận tải thẳng từ trình duyệt (thay cho URL ký sẵn của R2). Chỉ gắn khi sandbox đang bật
 * và KHÔNG BAO GIỜ ở production (xem index.ts). Không kiểm chữ ký — đây là máy của chính người phát triển.
 */
import express, { Router, type Request, type Response } from 'express';
import { handleSandboxRequest } from '../config/storageSandbox.js';
import { config } from '../config/env.js';

const router = Router();

async function relay(req: Request, res: Response, method: 'GET' | 'HEAD' | 'PUT') {
  const key = decodeURIComponent(req.path.replace(/^\/+/, ''));
  if (!key) { res.status(404).end(); return; }
  const headers: Record<string, string> = {};
  for (const [k, v] of Object.entries(req.headers)) if (typeof v === 'string') headers[k] = v;
  const out = await handleSandboxRequest({
    method, path: `/${encodeURIComponent(config.r2.bucketName)}/${key.split('/').map(encodeURIComponent).join('/')}`,
    headers, body: method === 'PUT' ? (Buffer.isBuffer(req.body) ? req.body : Buffer.alloc(0)) : undefined,
  });
  res.status(out.statusCode);
  for (const [k, v] of Object.entries(out.headers)) res.setHeader(k, v);
  const filename = typeof req.query.filename === 'string' ? req.query.filename : null;
  if (filename && method === 'GET') res.setHeader('Content-Disposition', `attachment; filename="${filename.replace(/[^\w.-]/g, '_')}"`);
  res.setHeader('X-Storage-Sandbox', '1');
  out.body.pipe(res);
}

router.get('/*', (req, res, next) => { relay(req, res, 'GET').catch(next); });
router.head('/*', (req, res, next) => { relay(req, res, 'HEAD').catch(next); });
router.put('/*', express.raw({ type: '*/*', limit: '200mb' }), (req, res, next) => { relay(req, res, 'PUT').catch(next); });

export default router;
