/**
 * KEY GIA HẠN hạn mức AI Code (02/10/2026) — chạy THẬT trên một kho giả trong
 * bộ nhớ (không cần Postgres), cộng vài phép đọc nguồn cho chỗ nối vào
 * `quota.ts` (chạm CSDL nên không chạy thật được trong CI).
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  KeyGiaHanLoi, datKeyGiaHan, nhapKeyGiaHan, tokenGiaHan, tongGiaHan, xoaDemSaiKeyGiaHan,
  docJsonCauHinh, coKeyGiaHan, type CauHinhKeyGiaHan, type KhoGiaHan, type LanCap,
} from './keyGiaHan.js';

const GIO = 3_600_000;

function khoGia(): KhoGiaHan & { cap: Array<LanCap & { userId: number }> } {
  let ch: CauHinhKeyGiaHan = { bam: null, phienBan: 0, soTokenMoiLan: 4_000_000 };
  const cap: Array<LanCap & { userId: number }> = [];
  return {
    cap,
    async docCauHinh() { return { ...ch }; },
    async ghiCauHinh(c) { ch = { ...c }; },
    async themLanCap(userId, soToken, phienBan, luc) { cap.push({ userId, soToken, phienBan, createdAt: luc }); },
    async dsLanCap(userId, tu) { return cap.filter((c) => c.userId === userId && c.createdAt >= tu); },
  };
}

test('nhập đúng key ⇒ cộng đúng soTokenMoiLan vào trần', async () => {
  xoaDemSaiKeyGiaHan();
  const kho = khoGia();
  await datKeyGiaHan({ key: 'key-dung-123' }, kho);
  const now = Date.now();
  const kq = await nhapKeyGiaHan(7, 'key-dung-123', kho, now);
  assert.equal(kq.soToken, 4_000_000);
  assert.equal(await tokenGiaHan(7, 5, kho, now + 1000), 4_000_000);
  // Người khác không hưởng.
  assert.equal(await tokenGiaHan(8, 5, kho, now + 1000), 0);
});

test('nhập lại nhiều lần ⇒ cộng dồn; đổi soTokenMoiLan chỉ áp cho lần sau', async () => {
  xoaDemSaiKeyGiaHan();
  const kho = khoGia();
  await datKeyGiaHan({ key: 'key-dung-123' }, kho);
  const now = Date.now();
  await nhapKeyGiaHan(1, 'key-dung-123', kho, now);
  await nhapKeyGiaHan(1, 'key-dung-123', kho, now + 1);
  await datKeyGiaHan({ soTokenMoiLan: 1_000_000 }, kho); // KHÔNG đổi phiên bản
  await nhapKeyGiaHan(1, 'key-dung-123', kho, now + 2);
  assert.equal(await tokenGiaHan(1, 5, kho, now + 10), 9_000_000);
});

test('key sai bị từ chối và không cấp gì', async () => {
  xoaDemSaiKeyGiaHan();
  const kho = khoGia();
  await datKeyGiaHan({ key: 'key-dung-123' }, kho);
  await assert.rejects(nhapKeyGiaHan(2, 'key-sai', kho), (e: unknown) => e instanceof KeyGiaHanLoi && e.code === 'KEY_GIA_HAN_SAI');
  await assert.rejects(nhapKeyGiaHan(2, '', kho), (e: unknown) => e instanceof KeyGiaHanLoi && e.code === 'KEY_GIA_HAN_SAI');
  assert.equal(kho.cap.length, 0);
});

test('chưa bật key ⇒ từ chối bằng mã riêng, coKeyGiaHan = false', async () => {
  xoaDemSaiKeyGiaHan();
  const kho = khoGia();
  assert.equal(await coKeyGiaHan(kho), false);
  await assert.rejects(nhapKeyGiaHan(3, 'bat-ky', kho), (e: unknown) => e instanceof KeyGiaHanLoi && e.code === 'KEY_GIA_HAN_CHUA_BAT');
  await datKeyGiaHan({ key: 'key-dung-123' }, kho);
  assert.equal(await coKeyGiaHan(kho), true);
});

test('admin ĐỔI key ⇒ key cũ không nhập được VÀ lần cấp bằng phiên bản cũ thôi tính ngay', async () => {
  xoaDemSaiKeyGiaHan();
  const kho = khoGia();
  await datKeyGiaHan({ key: 'key-cu-123' }, kho);
  const now = Date.now();
  await nhapKeyGiaHan(4, 'key-cu-123', kho, now);
  assert.equal(await tokenGiaHan(4, 5, kho, now + 1), 4_000_000);

  await datKeyGiaHan({ key: 'key-moi-456' }, kho);
  assert.equal(await tokenGiaHan(4, 5, kho, now + 2), 0, 'lần cấp phiên bản cũ vẫn được tính');
  await assert.rejects(nhapKeyGiaHan(4, 'key-cu-123', kho, now + 3), (e: unknown) => e instanceof KeyGiaHanLoi && e.code === 'KEY_GIA_HAN_SAI');

  await nhapKeyGiaHan(4, 'key-moi-456', kho, now + 4);
  assert.equal(await tokenGiaHan(4, 5, kho, now + 5), 4_000_000);
});

test('admin TẮT key ⇒ mọi lần cấp thôi tính; bật lại cùng key cũng không hồi sinh lần cấp cũ', async () => {
  xoaDemSaiKeyGiaHan();
  const kho = khoGia();
  await datKeyGiaHan({ key: 'key-dung-123' }, kho);
  const now = Date.now();
  await nhapKeyGiaHan(5, 'key-dung-123', kho, now);
  await datKeyGiaHan({ key: null }, kho);
  assert.equal(await tokenGiaHan(5, 5, kho, now + 1), 0);
  await datKeyGiaHan({ key: 'key-dung-123' }, kho);
  assert.equal(await tokenGiaHan(5, 5, kho, now + 2), 0);
});

test('lần cấp trôi ra khỏi cửa sổ trượt thì hết tính', () => {
  const now = Date.now();
  const ds: LanCap[] = [
    { soToken: 4_000_000, phienBan: 1, createdAt: new Date(now - 5 * GIO - 1) }, // vừa trôi ra
    { soToken: 4_000_000, phienBan: 1, createdAt: new Date(now - 4 * GIO) },
    { soToken: 1_000_000, phienBan: 0, createdAt: new Date(now - 1 * GIO) },     // phiên bản cũ
  ];
  assert.equal(tongGiaHan(ds, 1, now, 5), 4_000_000);
  // Một giờ sau, lần thứ hai cũng trôi ra.
  assert.equal(tongGiaHan(ds, 1, now + GIO + 1, 5), 0);
});

test('5 lần sai ⇒ khoá chống dò, kể cả lần nhập đúng sau đó', async () => {
  xoaDemSaiKeyGiaHan();
  const kho = khoGia();
  await datKeyGiaHan({ key: 'key-dung-123' }, kho);
  for (let i = 0; i < 5; i++) await nhapKeyGiaHan(6, `sai-${i}`, kho).catch(() => {});
  await assert.rejects(nhapKeyGiaHan(6, 'key-dung-123', kho), (e: unknown) => e instanceof KeyGiaHanLoi && e.code === 'KEY_GIA_HAN_THU_QUA_NHIEU');
  xoaDemSaiKeyGiaHan();
});

test('cấu hình hỏng trong app_settings ⇒ coi như TẮT, không ném', () => {
  assert.equal(docJsonCauHinh('{hong').bam, null);
  assert.equal(docJsonCauHinh(null).soTokenMoiLan, 4_000_000);
  assert.equal(docJsonCauHinh('{"bam":"x","phienBan":3,"soTokenMoiLan":-5}').soTokenMoiLan, 4_000_000);
});

const quota = readFileSync(new URL('./quota.ts', import.meta.url), 'utf8');

test('xemHanMuc cộng key gia hạn vào trần TOKEN', () => {
  assert.match(quota, /giaHan = await tokenGiaHan\(userId, soGio\)/);
  assert.match(quota, /const tran = tranGoc \+ giaHan/);
});

test('⛔ key gia hạn KHÔNG nới trần TIỀN', () => {
  const i = quota.indexOf('export async function xemViAgent');
  assert.ok(i > -1);
  assert.ok(!quota.slice(i).includes('giaHan'), 'ví tiền agent đang bị key gia hạn nới');
  const viTien = readFileSync(new URL('./viTien.ts', import.meta.url), 'utf8');
  assert.ok(!viTien.includes('keyGiaHan') && !viTien.includes('giaHan'), 'viTien.ts bị key gia hạn nới');
});

test('lỗi hết hạn mức báo cho app biết có key gia hạn không', () => {
  const turn = readFileSync(new URL('./turn.ts', import.meta.url), 'utf8');
  assert.match(turn, /code: 'AGENT_QUOTA_EXCEEDED',\s*coKeyGiaHan: await coKeyGiaHan\(\)/);
});
