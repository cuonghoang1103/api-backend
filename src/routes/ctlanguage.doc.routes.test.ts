/** Đọc to cho khách (15/11/2026): KHÔNG đòi token (khách dùng app được), vẫn kiểm thân. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import router from './ctlanguage.doc.routes.js';

test('POST /ctlanguage/doc — khách không bị 401, thân sai ⇒ 422', async () => {
  const app = express();
  app.use(express.json());
  app.use('/d', router);
  app.use((e: { statusCode?: number }, _q: express.Request, s: express.Response, _n: express.NextFunction) => {
    s.status(e.statusCode ?? 500).end();
  });
  const sv = app.listen(0);
  const port = (sv.address() as { port: number }).port;
  const goi = async (b: unknown) => (await fetch(`http://127.0.0.1:${port}/d`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b),
  })).status;
  try {
    assert.equal(await goi({ text: '' }), 422);
    assert.equal(await goi({ text: 'x'.repeat(601) }), 422);
    assert.equal(await goi({}), 422);
  } finally { sv.close(); }
});
