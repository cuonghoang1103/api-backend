import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, createApiKey } from '../auth.js';
import { store } from '../store/index.js';
import { onlyAllow } from '../http.js';
import { validate } from '../validate.js';
import { toMe } from '../views.js';
import { VULN } from '../vuln.js';
import { myWaitlist } from './waitlist.js';

export const meRouter = Router();
// Người dùng chỉ được đổi TÊN của mình. Vai trò, email… không bao giờ đến từ body (OWASP API3, bài 6.3)
const MePatch = z.strictObject({ name: z.string().trim().normalize('NFC').min(1).max(100) });
meRouter.route('/')
  .get(requireAuth, (req, res) => res.json(toMe(req.user)))   // chỉ 4 trường của hợp đồng
  .patch(requireAuth, (req, res, next) => (VULN ? next() : validate('body', MePatch)(req, res, next)), async (req, res) => {
    // VULN: chép nguyên body ⇒ tự nâng vai trò (chỉ kho RAM — kho pg chỉ có cột name cho lệnh này)
    res.json(toMe(await store.updateUser(req.user.id, VULN ? req.body : req.valid.body)));
  })
  .all(onlyAllow('GET', 'HEAD', 'PATCH'));

// Bài 6.1 — API key cho script của chính mình: hiện MỘT lần, sau đó chỉ còn tiền tố
meRouter.route('/waitlist').get(...myWaitlist).all(onlyAllow('GET', 'HEAD'));   // Lab 7

meRouter.route('/api-keys')
  .post(requireAuth, async (req, res) => res.status(201).set('Cache-Control', 'no-store').json(await createApiKey(req.user.id)))
  .get(requireAuth, async (req, res) => res.json({ data: (await store.listApiKeys(req.user.id)).map(({ prefix, createdAt }) => ({ prefix, createdAt })) }))
  .all(onlyAllow('GET', 'HEAD', 'POST'));
