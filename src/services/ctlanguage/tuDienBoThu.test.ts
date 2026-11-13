/** Tra theo bộ thủ — phần kiểm đầu vào (không chạm CSDL: lỗi phải ném TRƯỚC khi truy vấn). */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kiemSoBo, theoBoThu } from './tuDien.js';

test('kiemSoBo: nhận 1–214 (số hoặc chuỗi số)', () => {
  assert.equal(kiemSoBo(1), 1);
  assert.equal(kiemSoBo(214), 214);
  assert.equal(kiemSoBo('85'), 85);
});

test('kiemSoBo: ngoài 1–214, số lẻ, không phải số ⇒ BadRequest CTL_BO_THU_SAI', () => {
  for (const v of [0, 215, -3, 1.5, NaN, 'abc', '', null, undefined]) {
    assert.throws(() => kiemSoBo(v), (e: any) => e.statusCode === 400 && e.code === 'CTL_BO_THU_SAI', `giá trị ${String(v)}`);
  }
});

test('theoBoThu: ngôn ngữ lạ / tiếng Anh / số bộ sai ⇒ 400 trước khi truy vấn', async () => {
  await assert.rejects(theoBoThu('fr', 9), (e: any) => e.statusCode === 400 && e.code === 'CTL_NN_SAI');
  await assert.rejects(theoBoThu('en', 9), (e: any) => e.statusCode === 400 && e.code === 'CTL_NN_SAI');
  await assert.rejects(theoBoThu('zh', 0), (e: any) => e.statusCode === 400 && e.code === 'CTL_BO_THU_SAI');
  await assert.rejects(theoBoThu('ja', 215), (e: any) => e.statusCode === 400 && e.code === 'CTL_BO_THU_SAI');
});
