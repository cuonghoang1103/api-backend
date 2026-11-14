/**
 * Ảnh Cộng đồng CT Language (15/11/2026) — phần THUẦN: chuẩn hoá ảnh bằng sharp + đọc danh sách id. Không CSDL, không R2.
 *   npx tsx --test src/services/ctlanguage/congDongAnh.test.ts
 */
import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import sharp from 'sharp';
import { ANH_TOI_DA_BAI, chuanHoaAnh, docDsAnh } from './congDongAnh.js';

const anh = (w: number, h: number, fmt: 'png' | 'jpeg' | 'webp' | 'gif' = 'png') =>
  sharp({ create: { width: w, height: h, channels: 4, background: { r: 200, g: 80, b: 40, alpha: 0.5 } } })[fmt]().toBuffer();

test('ảnh lớn ⇒ JPEG, cạnh dài ≤ 1600, giữ tỉ lệ, bỏ metadata', async () => {
  const goc = await sharp(await anh(3200, 2000)).withMetadata({ exif: { IFD0: { Artist: 'gps-test' } } }).jpeg().toBuffer();
  const r = await chuanHoaAnh(goc);
  const m = await sharp(r.jpg).metadata();
  assert.equal(m.format, 'jpeg');
  assert.equal(r.rong, 1600);
  assert.equal(r.cao, 1000);
  assert.equal(m.exif, undefined, 'không còn EXIF');
});

test('ảnh nhỏ không phóng to; PNG/WebP nhận; GIF/chữ thường từ chối', async () => {
  const r = await chuanHoaAnh(await anh(300, 200, 'webp'));
  assert.deepEqual([r.rong, r.cao], [300, 200]);
  await assert.rejects(chuanHoaAnh(await anh(300, 200, 'gif')), (e: { code?: string }) => e.code === 'CTL_CD_ANH_SAI');
  await assert.rejects(chuanHoaAnh(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>')), (e: { code?: string }) => e.code === 'CTL_CD_ANH_SAI');
  await assert.rejects(chuanHoaAnh(Buffer.alloc(0)), (e: { code?: string }) => e.code === 'CTL_CD_ANH_TRONG');
  await assert.rejects(chuanHoaAnh(await anh(10, 10)), (e: { code?: string }) => e.code === 'CTL_CD_ANH_NHO');
  await assert.rejects(chuanHoaAnh(await anh(2000, 100)), (e: { code?: string }) => e.code === 'CTL_CD_ANH_TI_LE');
});

test('docDsAnh: undefined = không đổi, null = xoá hết, bỏ trùng, chặn id sai + quá số', () => {
  assert.equal(docDsAnh(undefined, 4), undefined);
  assert.deepEqual(docDsAnh(null, 4), []);
  assert.deepEqual(docDsAnh([3, 1, 2], 4), [3, 1, 2]);
  assert.throws(() => docDsAnh([1, 1], 4), (e: { code?: string }) => e.code === 'CTL_CD_ANH_DS');
  assert.throws(() => docDsAnh(['x'], 4), (e: { code?: string }) => e.code === 'CTL_CD_ANH_DS');
  assert.throws(() => docDsAnh('1', 4), (e: { code?: string }) => e.code === 'CTL_CD_ANH_DS');
  assert.throws(() => docDsAnh([1, 2, 3, 4, 5], ANH_TOI_DA_BAI), (e: { code?: string }) => e.code === 'CTL_CD_ANH_QUA');
});
