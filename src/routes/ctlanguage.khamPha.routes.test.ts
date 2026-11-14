/**
 * Tuyến "khám phá" + "bài học AI" của CT Language — `npx tsx --test src/routes/ctlanguage.khamPha.routes.test.ts`
 * (không CSDL, không AI):
 *   · đủ tuyến; đường gọi model có `/ai/` (app dựa vào đó để xin đồng ý chia sẻ AI — App Store 5.1.2(i));
 *   · tuyến ghi không token ⇒ 401 (KHÔNG 404 — smoke-test deploy.sh gọi `kham-pha/su-kien/thuong`, `bai-ai/luot`);
 *   · đường cố định khai TRƯỚC `/:nn/...`; index.ts gắn hai router TRƯỚC `/api/v1/ctlanguage`;
 *   · tuyến mở mục từ điển + lượt mở đầu cuộc gọi có gọi bộ đếm.
 */
import 'dotenv/config';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { after, test } from 'node:test';
import express from 'express';

after(() => { setTimeout(() => process.exit(process.exitCode ?? 0), 200).unref(); });

type R = { stack: { route?: { path: string; methods: Record<string, boolean> } }[] };
const tuyen = (r: R) => r.stack.filter((l) => l.route).map((l) => `${Object.keys(l.route!.methods)[0]!.toUpperCase()} ${l.route!.path}`);

test('khám phá: đủ tuyến, đường cố định trước /:nn', async () => {
  const ds = tuyen((await import('./ctlanguage.khamPha.routes.js')).default as unknown as R);
  assert.deepEqual([...ds].sort(), [
    'GET /:nn/chu-de', 'GET /:nn/chu-de/:ma', 'GET /:nn/hoat-dong', 'GET /:nn/tra-nhieu', 'GET /:nn/xep-hang-phut',
    'GET /admin/su-kien', 'GET /su-kien', 'GET /su-kien/thuong', 'POST /admin/su-kien', 'POST /hoat-dong', 'POST /su-kien/:id/nhan',
    'PUT /admin/su-kien/:id', 'PUT /xep-hang/an',
  ].sort());
  const dauNn = ds.findIndex((x) => x.includes('/:nn'));
  assert.ok(ds.slice(dauNn).every((x) => x.includes('/:nn')), 'mọi tuyến cố định phải đứng trên /:nn');
});

test('bài học AI: đủ tuyến, đường gọi model có /ai/', async () => {
  const ds = tuyen((await import('./ctlanguage.baiAi.routes.js')).default as unknown as R);
  assert.deepEqual([...ds].sort(), [
    'DELETE /bai/:id', 'DELETE /bai/:id/luu', 'GET /:nn/goi-y', 'GET /bai/:id', 'GET /cua-toi', 'GET /luot',
    'POST /:nn/ai/goi-y/:ma', 'POST /:nn/ai/tao', 'POST /admin/bai/:id/an', 'POST /bai/:id/luu', 'POST /bai/:id/xong', 'POST /bao-cao-ai',
  ].sort());
});

test('khách không token ⇒ 401 ở mọi tuyến ghi / của tôi', async () => {
  const app = express();
  app.use(express.json());
  app.use('/kp', (await import('./ctlanguage.khamPha.routes.js')).default);
  app.use('/ba', (await import('./ctlanguage.baiAi.routes.js')).default);
  const sv = app.listen(0);
  try {
    const cong = (sv.address() as { port: number }).port;
    for (const [m, p] of [
      ['POST', '/kp/hoat-dong'], ['PUT', '/kp/xep-hang/an'], ['POST', '/kp/su-kien/1/nhan'], ['GET', '/kp/su-kien/thuong'], ['GET', '/kp/zh/hoat-dong'],
      ['GET', '/kp/admin/su-kien'], ['POST', '/kp/admin/su-kien'],
      ['GET', '/ba/luot'], ['GET', '/ba/cua-toi'], ['POST', '/ba/zh/ai/tao'], ['POST', '/ba/zh/ai/goi-y/goi-mon'], ['POST', '/ba/bai/1/xong'],
      ['DELETE', '/ba/bai/1'], ['POST', '/ba/bao-cao-ai'], ['POST', '/ba/admin/bai/1/an'],
    ]) {
      const r = await fetch(`http://127.0.0.1:${cong}${p}`, { method: m, headers: { 'content-type': 'application/json' }, body: m === 'GET' ? undefined : '{}' });
      assert.equal(r.status, 401, `${m} ${p}`);
    }
  } finally { sv.close(); }
});

test('index.ts gắn /kham-pha + /bai-ai TRƯỚC /ctlanguage; router chung gọi bộ đếm', () => {
  const s = readFileSync(new URL('../index.ts', import.meta.url), 'utf8');
  const chung = s.indexOf("app.use('/api/v1/ctlanguage', ");
  for (const d of ["app.use('/api/v1/ctlanguage/kham-pha'", "app.use('/api/v1/ctlanguage/bai-ai'"]) {
    const i = s.indexOf(d);
    assert.ok(i > 0 && i < chung, d);
  }
  const r = readFileSync(new URL('./ctlanguage.routes.ts', import.meta.url), 'utf8');
  assert.match(r, /ghiLuotTra\(muc\.nn, muc\.chu\)/);
  assert.match(r, /void demCuocGoi\(req\.userId!, tt\.nn\)/);
});
