// GET /health — is the API up AND can it reach PostgreSQL? (a load balancer or Docker healthcheck calls this)
import { Router } from 'express';
import { thongSoPool } from '../db.js';

export function routerHealth(prisma, url) {
  const r = Router();
  r.get('/health', async (req, res) => {
    try {
      const [row] = await prisma.$queryRaw`SELECT current_user AS db_user, current_setting('server_version') AS pg,
                                                  current_setting('statement_timeout') AS statement_timeout`;
      res.json({ status: 'ok', db: 'ok', ...row, pool: thongSoPool(url) });
    } catch (e) {
      res.status(503).json({ status: 'degraded', db: 'unreachable', message: e.message.split('\n').at(-1) });
    }
  });
  return r;
}
