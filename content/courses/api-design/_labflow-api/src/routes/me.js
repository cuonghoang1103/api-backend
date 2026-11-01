import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, createApiKey, apiKeys } from '../auth.js';
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
  .patch(requireAuth, (req, res, next) => (VULN ? next() : validate('body', MePatch)(req, res, next)), (req, res) => {
    Object.assign(req.user, VULN ? req.body : req.valid.body);  // VULN: chép nguyên body ⇒ tự nâng vai trò
    res.json(toMe(req.user));
  })
  .all(onlyAllow('GET', 'HEAD', 'PATCH'));

// Bài 6.1 — API key cho script của chính mình: hiện MỘT lần, sau đó chỉ còn tiền tố
meRouter.route('/waitlist').get(...myWaitlist).all(onlyAllow('GET', 'HEAD'));   // Lab 7

meRouter.route('/api-keys')
  .post(requireAuth, (req, res) => res.status(201).set('Cache-Control', 'no-store').json(createApiKey(req.user.id)))
  .get(requireAuth, (req, res) => res.json({ data: [...apiKeys.values()]
    .filter((k) => k.userId === req.user.id).map(({ prefix, createdAt }) => ({ prefix, createdAt })) }))
  .all(onlyAllow('GET', 'HEAD', 'POST'));
