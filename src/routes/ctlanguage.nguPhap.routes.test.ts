/**
 * Tuyến Thư viện ngữ pháp CT Language — `npx tsx --test src/routes/ctlanguage.nguPhap.routes.test.ts` (không CSDL):
 * đủ tuyến; MỌI tuyến công khai (khách 200 — `tong-quan` nằm trong smoke-test deploy.sh nên không được 404);
 * tham số sai ⇒ 400, id lạ ⇒ 404; index.ts gắn TRƯỚC `/api/v1/ctlanguage`.
 */
import 'dotenv/config';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { after, test } from 'node:test';
import express from 'express';
import { errorHandler } from '../middleware/errorHandler.js';

after(() => { setTimeout(() => process.exit(process.exitCode ?? 0), 200).unref(); });

type R = { stack: { route?: { path: string; methods: Record<string, boolean> } }[] };

test('đủ tuyến, chỉ GET', async () => {
  const r = (await import('./ctlanguage.nguPhap.routes.js')).default as unknown as R;
  const ds = r.stack.filter((l) => l.route).map((l) => `${Object.keys(l.route!.methods)[0]!.toUpperCase()} ${l.route!.path}`);
  assert.deepEqual([...ds].sort(), ['GET /danh-muc', 'GET /diem/:id', 'GET /tim', 'GET /tong-quan']);
});

test('khách (không token) gọi được mọi tuyến; lỗi tham số đúng mã', async () => {
  const app = express();
  app.use('/np', (await import('./ctlanguage.nguPhap.routes.js')).default);
  app.use(errorHandler);
  const sv = app.listen(0);
  try {
    const goc = `http://127.0.0.1:${(sv.address() as { port: number }).port}/np`;
    const lay = async (p: string) => { const r = await fetch(goc + p); return { ma: r.status, than: await r.json() as { success: boolean; data?: any } }; };

    const tq = await lay('/tong-quan');
    assert.equal(tq.ma, 200);
    assert.ok(tq.than.data.tong >= 1000);
    const capJa = tq.than.data.ngonNgu.find((x: { nn: string }) => x.nn === 'ja').cap.map((c: { cap: string }) => c.cap);
    assert.deepEqual(capJa, ['N5', 'N4', 'N3', 'N2', 'N1']);
    assert.deepEqual(tq.than.data.ngonNgu.map((x: { nn: string }) => x.nn), ['en', 'ja', 'zh']);

    for (const nn of ['en', 'ja', 'zh']) {
      const dm = await lay(`/danh-muc?nn=${nn}`);
      assert.equal(dm.ma, 200);
      assert.ok(dm.than.data.cap.length >= 5);
      assert.ok(['N1', 'HSK6', 'C1'].includes(dm.than.data.cap.at(-1).cap), 'cấp cao nhất có trong danh mục (app dựng chip cấp từ đây)');
      const dau = dm.than.data.cap[0].nhom[0].diem[0];
      assert.deepEqual(Object.keys(dau).sort(), ['cap', 'id', 'mau', 'nghia', 'nhom', 'nn', 'tieuDe']);
      const ct = await lay(`/diem/${dau.id}`);
      assert.equal(ct.ma, 200);
      assert.equal(ct.than.data.id, dau.id);
      assert.equal(ct.than.data.quiz.length, 3);
      assert.ok(ct.than.data.viDu.length >= 3 && Array.isArray(ct.than.data.soSanh) && ct.than.data.tenCap);
    }

    const t = await lay(`/tim?nn=ja&q=${encodeURIComponent('てもいい')}`);
    assert.equal(t.ma, 200);
    assert.equal(t.than.data.items[0].id, 'ja-n5-te-mo-ii');
    assert.equal((await lay(`/tim?q=${encodeURIComponent('了')}`)).than.data.items[0].nn, 'zh');
    assert.deepEqual((await lay('/tim?nn=ja')).than.data.items, []);

    assert.equal((await lay('/danh-muc')).ma, 400);
    assert.equal((await lay('/danh-muc?nn=vi')).ma, 400);
    assert.equal((await lay('/tim?nn=xx&q=a')).ma, 400);
    assert.equal((await lay('/diem/khong-co-diem-nay')).ma, 404);
  } finally { sv.close(); }
});

test('index.ts gắn /ngu-phap TRƯỚC /ctlanguage; deploy.sh có tuyến trong smoke-test', () => {
  const s = readFileSync(new URL('../index.ts', import.meta.url), 'utf8');
  const a = s.indexOf("app.use('/api/v1/ctlanguage/ngu-phap'");
  const b = s.indexOf("app.use('/api/v1/ctlanguage', ctLanguageRoutes)");
  assert.ok(a > 0 && b > a);
  assert.ok(readFileSync(new URL('../../deploy.sh', import.meta.url), 'utf8').includes('ctlanguage/ngu-phap/tong-quan'));
});
