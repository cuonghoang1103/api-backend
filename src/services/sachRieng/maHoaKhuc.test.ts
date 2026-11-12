/**
 * SR2 (mã hoá chia khúc): mã hoá ngẫu nhiên nhiều cỡ → đọc mọi kiểu khoảng = đúng lát bản rõ; sửa 1 byte ⇒ lỗi xác thực.
 *   npx tsx --test src/services/sachRieng/maHoaKhuc.test.ts
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes, randomInt } from 'node:crypto';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import {
  CO_DAU_SR2, TAG, docDauSR2, docKhoangSR2, giaiMaSR2, kichThuocSR2, maHoaSR2, phanTichRange, taoLuongMaHoaSR2, viTriKhuc,
} from './maHoaKhuc.js';

const KHOA = randomBytes(32);

async function quaLuong(du: Buffer, coKhuc: number, manh: number): Promise<Buffer> {
  const ra: Buffer[] = [];
  const nguon = Readable.from((function* () { for (let o = 0; o < du.length; o += manh) yield du.subarray(o, o + manh); })());
  await pipeline(nguon, taoLuongMaHoaSR2(KHOA, du.length, coKhuc), async function* (src) { for await (const c of src) ra.push(c as Buffer); });
  return Buffer.concat(ra);
}

const docTu = (goi: Buffer) => {
  let lan = 0;
  const f = async (tu: number, den: number) => { lan++; return goi.subarray(tu, den + 1); };
  return { f, lan: () => lan };
};

test('mã hoá luồng = đúng khuôn, giải mã lại = bản rõ, nhiều cỡ tệp / cỡ khúc / cỡ mảnh ghi', async () => {
  const coKhuc = [16, 64, 1000, 4096];
  const coTep = [0, 1, 15, 16, 17, 63, 64, 65, 999, 1000, 1001, 4095, 4096, 4097, 12_345, 50_000];
  for (const ck of coKhuc) {
    for (const n of coTep) {
      const du = randomBytes(n);
      const goi = await quaLuong(du, ck, 1 + randomInt(3 * ck));
      assert.equal(goi.length, kichThuocSR2(n, ck), `độ dài SR2 n=${n} ck=${ck}`);
      const dau = docDauSR2(goi);
      assert.equal(dau.kichThuoc, n);
      assert.equal(dau.coKhuc, ck);
      assert.deepEqual(giaiMaSR2(goi, KHOA), du);
      // bản Buffer và bản luồng cùng khuôn (khác iv) ⇒ cùng độ dài, cả hai giải được
      assert.deepEqual(giaiMaSR2(maHoaSR2(du, KHOA, ck), KHOA), du);
    }
  }
});

test('đọc khoảng: mọi kiểu [a,b] (đầu, cuối, ranh khúc, trong một khúc, cả tệp) = đúng lát; chỉ tải đúng các khúc cần', async () => {
  for (const [n, ck] of [[1, 16], [100, 16], [4096, 1024], [10_000, 1024], [33_333, 4096]] as const) {
    const du = randomBytes(n);
    const goi = maHoaSR2(du, KHOA, ck);
    const dau = docDauSR2(goi);
    const thu: Array<[number, number]> = [[0, 0], [0, n - 1], [n - 1, n - 1], [0, Math.min(n - 1, ck - 1)], [Math.min(n - 1, ck), n - 1]];
    for (let k = 0; k < 200; k++) { const a = randomInt(n); thu.push([a, a + randomInt(n - a)]); }
    for (let i = 1; i * ck < n; i++) thu.push([i * ck - 1, Math.min(n - 1, i * ck)]); // vắt qua ranh khúc
    for (const [a, b] of thu) {
      const d = docTu(goi);
      let soByteTai = 0;
      const kq = await docKhoangSR2(KHOA, dau, a, b, async (tu, den) => { soByteTai += den - tu + 1; return d.f(tu, den); });
      assert.equal(kq.a, a); assert.equal(kq.b, b);
      assert.deepEqual(kq.du, du.subarray(a, b + 1), `n=${n} ck=${ck} [${a},${b}]`);
      assert.equal(d.lan(), 1, 'một lần tải cho cả khoảng');
      const soKhuc = Math.floor(b / ck) - Math.floor(a / ck) + 1;
      assert.ok(soByteTai <= soKhuc * (ck + TAG), 'không tải thừa khúc');
    }
  }
});

test('trần số khúc mỗi lần đọc: b bị kẹp, trả khoảng thật', async () => {
  const ck = 1024;
  const du = randomBytes(20 * ck + 7);
  const goi = maHoaSR2(du, KHOA, ck);
  const dau = docDauSR2(goi);
  const kq = await docKhoangSR2(KHOA, dau, 100, du.length - 1, docTu(goi).f, 8);
  assert.equal(kq.b, 8 * ck - 1);
  assert.deepEqual(kq.du, du.subarray(100, 8 * ck));
  const kq2 = await docKhoangSR2(KHOA, dau, 19 * ck + 3, du.length + 999, docTu(goi).f, 8);
  assert.equal(kq2.b, du.length - 1);
  assert.deepEqual(kq2.du, du.subarray(19 * ck + 3));
  await assert.rejects(docKhoangSR2(KHOA, dau, du.length, du.length + 5, docTu(goi).f), RangeError);
});

test('sửa 1 byte bất kỳ (đầu, bản mã, tag) hoặc tráo khúc / sai khoá ⇒ lỗi xác thực', async () => {
  const ck = 256;
  const du = randomBytes(5 * ck + 31);
  const goi = maHoaSR2(du, KHOA, ck);
  const dau = docDauSR2(goi);
  for (let k = 0; k < 60; k++) {
    const hong = Buffer.from(goi);
    const vt = k < 5 ? 16 + k /* iv trong đầu */ : CO_DAU_SR2 + randomInt(goi.length - CO_DAU_SR2);
    hong[vt] ^= 1 << randomInt(8);
    const dauHong = docDauSR2(hong);
    await assert.rejects(docKhoangSR2(KHOA, dauHong, 0, du.length - 1, docTu(hong).f), `byte ${vt}`);
  }
  // đổi kích thước khai trong đầu (vẫn cùng số khúc) ⇒ AAD khác ⇒ hỏng
  const doiDau = Buffer.from(goi);
  doiDau.writeBigUInt64BE(BigInt(du.length - 1), 8);
  await assert.rejects(docKhoangSR2(KHOA, docDauSR2(doiDau), 0, 10, async (tu, den) => doiDau.subarray(tu, den + 1)));
  // tráo khúc 1 và 2
  const trao = Buffer.from(goi);
  const k1 = viTriKhuc(dau, 1), k2 = viTriKhuc(dau, 2), L = ck + TAG;
  goi.copy(trao, k1, k2, k2 + L); goi.copy(trao, k2, k1, k1 + L);
  await assert.rejects(docKhoangSR2(KHOA, dau, ck, ck + 5, docTu(trao).f));
  await assert.rejects(docKhoangSR2(randomBytes(32), dau, 0, 5, docTu(goi).f));
  assert.throws(() => giaiMaSR2(goi.subarray(0, goi.length - 1), KHOA));
});

test('luồng: khai sai kích thước ⇒ lỗi', async () => {
  const du = randomBytes(1000);
  const thuLuong = (khai: number) => pipeline(Readable.from([du]), taoLuongMaHoaSR2(KHOA, khai, 64), async function* (s) { for await (const _ of s) { /* bỏ */ } });
  await assert.rejects(thuLuong(999));
  await assert.rejects(thuLuong(1001));
});

test('phanTichRange', () => {
  assert.equal(phanTichRange(undefined, 100), null);
  assert.equal(phanTichRange('bytes=-', 100), null);
  assert.equal(phanTichRange('bytes=0-1,5-6', 100), null);
  assert.deepEqual(phanTichRange('bytes=0-', 100), { a: 0, b: 99 });
  assert.deepEqual(phanTichRange('bytes=10-20', 100), { a: 10, b: 20 });
  assert.deepEqual(phanTichRange('bytes=10-999', 100), { a: 10, b: 99 });
  assert.deepEqual(phanTichRange('bytes=-30', 100), { a: 70, b: 99 });
  assert.deepEqual(phanTichRange('bytes=-300', 100), { a: 0, b: 99 });
  assert.equal(phanTichRange('bytes=100-', 100), 'ngoai');
  assert.equal(phanTichRange('bytes=20-10', 100), 'ngoai');
  assert.equal(phanTichRange('bytes=-0', 100), 'ngoai');
});
