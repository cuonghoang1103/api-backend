/**
 * Tuyến Học từ vựng CT Language — `npx tsx --test src/routes/ctlanguage.hocTuVung.routes.test.ts`: công khai (khách 200 —
 * `ctlanguage/tu-vung` nằm trong smoke-test deploy.sh), nn sai 400, bài lạ 404; index.ts gắn TRƯỚC `/api/v1/ctlanguage`.
 */
import 'dotenv/config';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { after, test } from 'node:test';
import express from 'express';
import { errorHandler } from '../middleware/errorHandler.js';

after(() => { setTimeout(() => process.exit(process.exitCode ?? 0), 200).unref(); });

test('khách: tổng quan + lộ trình + bài; lỗi đúng mã', async () => {
  const app = express();
  app.use('/tv', (await import('./ctlanguage.hocTuVung.routes.js')).default);
  app.use(errorHandler);
  const sv = app.listen(0);
  try {
    const goc = `http://127.0.0.1:${(sv.address() as { port: number }).port}`;
    const lay = async (p: string) => { const r = await fetch(goc + p); return { ma: r.status, than: await r.json() as { success: boolean; data?: any } }; };
    const tq = await lay('/tv');
    assert.equal(tq.ma, 200);
    assert.equal(tq.than.data.ngonNgu.length, 3);
    const lt = await lay('/tv/zh/lo-trinh');
    assert.equal(lt.ma, 200);
    assert.equal(lt.than.data.nhom[0].ma, 'HSK1');
    const cd = await lay('/tv/ja/lo-trinh?theo=chu-de');
    assert.equal(cd.than.data.theo, 'chu-de');
    const id = lt.than.data.nhom[0].bai[0].id as string;
    const b = await lay(`/tv/zh/bai/${id}`);
    assert.equal(b.ma, 200);
    assert.equal(b.than.data.tu.length, lt.than.data.nhom[0].bai[0].soTu);
    assert.equal((await lay('/tv/vi/lo-trinh')).ma, 400);
    assert.equal((await lay('/tv/en/bai/khong-co')).ma, 404);
  } finally { sv.close(); }
});

test('index.ts gắn router TRƯỚC router chung /api/v1/ctlanguage; deploy.sh smoke-test có tuyến', () => {
  const idx = readFileSync('src/index.ts', 'utf8');
  const chung = idx.indexOf("app.use('/api/v1/ctlanguage', ctLanguageRoutes)");
  const d = idx.indexOf("app.use('/api/v1/ctlanguage/tu-vung',");
  assert.ok(d > 0 && d < chung);
  assert.match(readFileSync('deploy.sh', 'utf8'), /ctlanguage\/tu-vung \\/);
});
