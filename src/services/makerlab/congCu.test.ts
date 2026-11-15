import test from 'node:test';
import assert from 'node:assert/strict';
import { dsCongCu, chayCacCongCu } from './congCu.js';

test('công cụ hệ thống chỉ có ở robot của admin; tên duy nhất; schema là object', () => {
  const thuong = dsCongCu(false).map((t) => t.name);
  const admin = dsCongCu(true).map((t) => t.name);
  assert.ok(!thuong.includes('he_thong'));
  assert.ok(admin.includes('he_thong'));
  for (const ds of [dsCongCu(false), dsCongCu(true)]) {
    assert.equal(new Set(ds.map((t) => t.name)).size, ds.length);
    for (const t of ds) assert.equal((t.parameters as { type: string }).type, 'object', t.name);
  }
});

test('công cụ lạ / thiếu tham số / không phải admin ⇒ trả chữ báo lỗi, không ném', async () => {
  const ng = { deviceId: 1, projectId: 1, ownerId: null, laAdmin: false, viTri: null };
  const r = await chayCacCongCu([
    { name: 'khong_co', input: {} },
    { name: 'tra_cuu_web', input: {} },
    { name: 'he_thong', input: { chu_de: ['vps'] } },
    { name: 'lich_hom_nay', input: {} },
  ], ng);
  assert.match(r, /Không có công cụ "khong_co"/);
  assert.match(r, /Thiếu câu tra cứu/);
  assert.match(r, /Chỉ chủ web/);
  assert.match(r, /chưa có chủ/);
});
