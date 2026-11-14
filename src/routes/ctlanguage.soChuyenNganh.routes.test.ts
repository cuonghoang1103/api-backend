/**
 * Tuyến Sổ tay chuyên ngành + Đồng bộ sổ tay CT Language — `npx tsx --test src/routes/ctlanguage.soChuyenNganh.routes.test.ts`:
 * sổ chuyên ngành công khai (khách 200 — nằm trong smoke-test deploy.sh), mã lạ 404, nn sai 400; đồng bộ sổ tay
 * KHÔNG token ⇒ 401 (không bao giờ 404 — `so-tu/trang-thai` cũng trong smoke-test); index.ts gắn cả hai TRƯỚC `/api/v1/ctlanguage`.
 */
import 'dotenv/config';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { after, test } from 'node:test';
import express from 'express';
import { errorHandler } from '../middleware/errorHandler.js';

after(() => { setTimeout(() => process.exit(process.exitCode ?? 0), 200).unref(); });

test('khách: danh sách + lọc nn + chi tiết; lỗi đúng mã; đồng bộ cần đăng nhập', async () => {
  const app = express();
  app.use(express.json());
  app.use('/cn', (await import('./ctlanguage.soChuyenNganh.routes.js')).default);
  app.use('/st', (await import('./ctlanguage.soTu.routes.js')).default);
  app.use(errorHandler);
  const sv = app.listen(0);
  try {
    const goc = `http://127.0.0.1:${(sv.address() as { port: number }).port}`;
    const lay = async (p: string, init?: RequestInit) => { const r = await fetch(goc + p, init); return { ma: r.status, than: await r.json() as { success: boolean; data?: any } }; };
    const ds = await lay('/cn');
    assert.equal(ds.ma, 200);
    assert.ok(ds.than.data.tong >= 24);
    const ja = await lay('/cn?nn=ja');
    assert.ok(ja.than.data.bo.length >= 8 && ja.than.data.bo.every((b: { nn: string }) => b.nn === 'ja'));
    assert.equal(ja.than.data.bo[0].ma, 'cntt');
    assert.equal((await lay('/cn?nn=vi')).ma, 400);
    assert.equal((await lay('/cn/ja/khong-co')).ma, 404);
    const ct = await lay('/cn/ja/y-te-dieu-duong');
    if (ct.ma === 200) assert.ok(ct.than.data.tu.length >= 60 && ct.than.data.tu.every((t: { id: number; chu: string }) => Number.isInteger(t.id) && t.chu));
    for (const [p, init] of [['/st/trang-thai'], ['/st?tu=0'], ['/st', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{"muc":[]}' }]] as const) {
      assert.equal((await lay(p, init as RequestInit | undefined)).ma, 401, p);
    }
  } finally { sv.close(); }
});

test('index.ts gắn hai router TRƯỚC router chung /api/v1/ctlanguage; deploy.sh smoke-test có hai tuyến', () => {
  const idx = readFileSync('src/index.ts', 'utf8');
  const chung = idx.indexOf("app.use('/api/v1/ctlanguage', ctLanguageRoutes)");
  for (const d of ["app.use('/api/v1/ctlanguage/so-tu',", "app.use('/api/v1/ctlanguage/so-chuyen-nganh',"]) {
    assert.ok(idx.indexOf(d) > 0 && idx.indexOf(d) < chung, d);
  }
  const dep = readFileSync('deploy.sh', 'utf8');
  assert.match(dep, /ctlanguage\/so-tu\/trang-thai \\/);
  assert.match(dep, /ctlanguage\/so-chuyen-nganh \\/);
});
