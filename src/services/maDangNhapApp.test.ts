/**
 * Mã đăng nhập một lần cho app di động (16/11/2026) — không CSDL, không Redis.
 *   npx tsx --test src/services/maDangNhapApp.test.ts
 * Luật đang chốt: hết hạn sau 120 s · dùng một lần · ràng app + trangThai + PKCE · chỉ lưu băm · chỉ scheme cố định.
 */
import { strict as assert } from 'node:assert';
import { randomBytes } from 'node:crypto';
import { test } from 'node:test';
import {
  APP_DANG_NHAP, SONG_MA_GIAY, chuyenHuongLoi, doiMa, khoTrongBoNho, taoMa, thuTuXacMinh,
} from './maDangNhapApp.js';

const trangThai = () => randomBytes(24).toString('base64url');
const xacMinh = () => randomBytes(32).toString('base64url');

async function dung(bayGio: () => number = Date.now) {
  const kho = khoTrongBoNho(bayGio);
  const tt = trangThai();
  const xm = xacMinh();
  const { ma, chuyenHuong } = await taoMa(kho, { userId: 42, app: 'ctlanguage', trangThai: tt, thu: thuTuXacMinh(xm) }, bayGio);
  return { kho, tt, xm, ma, chuyenHuong };
}

test('đường đúng: đổi được đúng một lần, ra đúng userId', async () => {
  const { kho, tt, xm, ma } = await dung();
  const kq = await doiMa(kho, { ma, app: 'ctlanguage', trangThai: tt, maXacMinh: xm });
  assert.deepEqual(kq, { ok: true, userId: 42 });
});

test('dùng lại mã lần hai ⇒ từ chối', async () => {
  const { kho, tt, xm, ma } = await dung();
  assert.equal((await doiMa(kho, { ma, app: 'ctlanguage', trangThai: tt, maXacMinh: xm })).ok, true);
  const lan2 = await doiMa(kho, { ma, app: 'ctlanguage', trangThai: tt, maXacMinh: xm });
  assert.equal(lan2.ok, false);
});

test('mã hết hạn (> 120 s) ⇒ từ chối, kể cả khi kho không tự xoá', async () => {
  let t = 1_000_000;
  const { tt, xm, ma } = await dung(() => t);
  // Kho "lười" bỏ qua TTL: doiMa vẫn phải tự kiểm mốc tạo.
  const khoLuoi = khoTrongBoNho(() => 0);
  const { ma: ma2 } = await taoMa(khoLuoi, { userId: 7, app: 'ctlanguage', trangThai: tt, thu: thuTuXacMinh(xm) }, () => t);
  t += (SONG_MA_GIAY + 1) * 1000;
  assert.equal((await doiMa(khoLuoi, { ma: ma2, app: 'ctlanguage', trangThai: tt, maXacMinh: xm }, () => t)).ok, false);
  void ma;
});

test('kho tự xoá khi quá TTL', async () => {
  let t = 5_000_000;
  const { kho, tt, xm, ma } = await dung(() => t);
  t += SONG_MA_GIAY * 1000 + 1;
  assert.equal((await doiMa(kho, { ma, app: 'ctlanguage', trangThai: tt, maXacMinh: xm }, () => t)).ok, false);
});

test('sai app ⇒ từ chối, và mã chết luôn (không thử tiếp app đúng được)', async () => {
  const { kho, tt, xm, ma } = await dung();
  assert.equal((await doiMa(kho, { ma, app: 'ctwork', trangThai: tt, maXacMinh: xm })).ok, false);
  assert.equal((await doiMa(kho, { ma, app: 'ctlanguage', trangThai: tt, maXacMinh: xm })).ok, false);
});

test('sai trangThai (nonce) ⇒ từ chối, mã chết luôn', async () => {
  const { kho, tt, xm, ma } = await dung();
  assert.equal((await doiMa(kho, { ma, app: 'ctlanguage', trangThai: trangThai(), maXacMinh: xm })).ok, false);
  assert.equal((await doiMa(kho, { ma, app: 'ctlanguage', trangThai: tt, maXacMinh: xm })).ok, false);
});

test('sai mã xác minh PKCE (kẻ chặn được URL) ⇒ từ chối', async () => {
  const { kho, tt, ma } = await dung();
  assert.equal((await doiMa(kho, { ma, app: 'ctlanguage', trangThai: tt, maXacMinh: xacMinh() })).ok, false);
});

test('mã bịa / sai định dạng ⇒ từ chối, không ném', async () => {
  const kho = khoTrongBoNho();
  for (const ma of [undefined, '', 'abc', '../../x', randomBytes(32).toString('base64url')]) {
    assert.equal((await doiMa(kho, { ma, app: 'ctlanguage', trangThai: trangThai(), maXacMinh: xacMinh() })).ok, false);
  }
});

test('kho CHỈ giữ băm của mã, không giữ mã thô', async () => {
  const { kho, ma } = await dung();
  const k = (kho as ReturnType<typeof khoTrongBoNho>).cacKhoa();
  assert.equal(k.length, 1);
  assert.ok(!k[0]!.includes(ma));
  assert.match(k[0]!, /^appdn:[0-9a-f]{64}$/);
});

test('chuyển hướng CHỈ tới scheme cố định; app lạ ⇒ ném', async () => {
  const { chuyenHuong, ma, tt } = await dung();
  assert.equal(chuyenHuong, `ctlanguage://dang-nhap?ma=${ma}&trangThai=${tt}`);
  const kho = khoTrongBoNho();
  for (const app of ['evil', 'https://ke-gian.com', '__proto__', 'constructor', 'toString']) {
    await assert.rejects(taoMa(kho, { userId: 1, app, trangThai: trangThai(), thu: thuTuXacMinh(xacMinh()) }));
  }
  for (const [k, v] of Object.entries(APP_DANG_NHAP)) assert.match(v.scheme, /^[a-z][a-z0-9.+-]*$/, k);
});

test('tham số tạo sai định dạng ⇒ ném (trangThai ngắn, thu không phải S256, userId hỏng)', async () => {
  const kho = khoTrongBoNho();
  const thu = thuTuXacMinh(xacMinh());
  await assert.rejects(taoMa(kho, { userId: 1, app: 'ctlanguage', trangThai: 'ngan', thu }));
  await assert.rejects(taoMa(kho, { userId: 1, app: 'ctlanguage', trangThai: trangThai(), thu: 'plain' }));
  await assert.rejects(taoMa(kho, { userId: 0, app: 'ctlanguage', trangThai: trangThai(), thu }));
});

test('chuyenHuongLoi: chỉ mã lỗi dạng HOA_GACH, còn lại ⇒ LOI', () => {
  const tt = trangThai();
  assert.equal(chuyenHuongLoi('ctwork', tt, 'ACCOUNT_LOCKED'), `ctwork://dang-nhap?loi=ACCOUNT_LOCKED&trangThai=${tt}`);
  assert.equal(chuyenHuongLoi('ctwork', tt, 'x&ma=1'), `ctwork://dang-nhap?loi=LOI&trangThai=${tt}`);
});

test('hai lời đổi chạy đua cùng một mã ⇒ chỉ một lời thành công', async () => {
  const { kho, tt, xm, ma } = await dung();
  const kq = await Promise.all([1, 2, 3].map(() => doiMa(kho, { ma, app: 'ctlanguage', trangThai: tt, maXacMinh: xm })));
  assert.equal(kq.filter((x) => x.ok).length, 1);
});
