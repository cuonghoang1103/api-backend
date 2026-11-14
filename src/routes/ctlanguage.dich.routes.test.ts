/**
 * Tuyến màn Dịch của CT Language — `npx tsx --test src/routes/ctlanguage.dich.routes.test.ts` (không CSDL, không AI).
 *   · đủ 3 tuyến, đường AI có `/ai/` (app dựa vào đó để xin đồng ý chia sẻ AI — App Store 5.1.2(i));
 *   · khách (không token) ⇒ 401, KHÔNG 404 (smoke-test deploy.sh gọi `ctlanguage/dich/luot`);
 *   · index.ts gắn `/api/v1/ctlanguage/dich` TRƯỚC `/api/v1/ctlanguage` (router kia `router.use(authenticate)` + `/:nn`).
 */
import 'dotenv/config';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { after, test } from 'node:test';
import express from 'express';

// RedisStore của rate-limit mở kết nối Redis lúc nạp router ⇒ tiến trình không tự thoát; xong hết thì thoát hẳn.
after(() => { setTimeout(() => process.exit(process.exitCode ?? 0), 200).unref(); });

test('đủ tuyến, đường AI có /ai/', async () => {
  const router = (await import('./ctlanguage.dich.routes.js')).default as unknown as {
    stack: { route?: { path: string; methods: Record<string, boolean> } }[];
  };
  const ds = router.stack.filter((l) => l.route).map((l) => `${Object.keys(l.route!.methods)[0].toUpperCase()} ${l.route!.path}`);
  assert.deepEqual(ds.sort(), ['GET /luot', 'POST /ai/sua-bai', 'POST /bao-cao-ai'].sort());
});

test('khách không token ⇒ 401 ở mọi tuyến', async () => {
  const router = (await import('./ctlanguage.dich.routes.js')).default;
  const app = express();
  app.use(express.json());
  app.use('/api/v1/ctlanguage/dich', router);
  const sv = app.listen(0);
  try {
    const cong = (sv.address() as { port: number }).port;
    for (const [m, p] of [['GET', '/luot'], ['POST', '/ai/sua-bai'], ['POST', '/bao-cao-ai']]) {
      const r = await fetch(`http://127.0.0.1:${cong}/api/v1/ctlanguage/dich${p}`, { method: m, headers: { 'content-type': 'application/json' }, body: m === 'POST' ? '{}' : undefined });
      assert.equal(r.status, 401, `${m} ${p}`);
    }
  } finally { sv.close(); }
});

test('index.ts gắn /ctlanguage/dich trước /ctlanguage', () => {
  const s = readFileSync(new URL('../index.ts', import.meta.url), 'utf8');
  const a = s.indexOf("app.use('/api/v1/ctlanguage/dich'"), b = s.indexOf("app.use('/api/v1/ctlanguage', ");
  assert.ok(a > 0 && b > 0 && a < b);
});
