// app.mjs — Express 5 + express-rate-limit sau nginx. Cổng 3000: trust proxy = true (SAI). Cổng 3001: chỉ tin nginx 10.113.0.10 (ĐÚNG).
import express from 'express';
import { rateLimit } from 'express-rate-limit';
const tao = (cong, trust) => {
  const app = express();
  app.set('trust proxy', trust);
  app.use((req, res, next) => {
    res.on('finish', () => console.log(JSON.stringify({ cong, ip: req.ip, ips: req.ips, xff: req.get('x-forwarded-for') ?? null,
      ray: req.get('cf-ray') ?? null, method: req.method, path: req.path, status: res.statusCode })));
    next();
  });
  app.post('/login', rateLimit({ windowMs: 60_000, limit: 5, standardHeaders: 'draft-8', legacyHeaders: false }),
    (req, res) => res.status(401).json({ error: 'sai mật khẩu' }));
  app.get('/loi', (req, res) => res.status(500).json({ error: 'TypeError: cannot read properties of undefined' }));
  app.get('/', (req, res) => res.json({ ban_la: req.ip }));
  app.listen(cong);
};
tao(3000, true);
tao(3001, '10.113.0.10');
