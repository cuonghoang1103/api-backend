/**
 * 🔒 Tài liệu riêng IELTS — đọc danh mục / media SR2 / trang PDF từ kho R2 GIẢ (sandbox trong RAM, tự bật khi test) + vé.
 *   NODE_OPTIONS=--import=./scripts/r2-tripwire.mjs npx tsx --test src/services/sachRieng/ielts.test.ts
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';

process.env.SACH_RIENG_KHOA = randomBytes(32).toString('hex');

const { putObject } = await import('../../config/r2.js');
const { config } = await import('../../config/env.js');
const { maHoa } = await import('./maHoa.js');
const { maHoaSR2 } = await import('./maHoaKhuc.js');
const ielts = await import('./ielts.js');
const { khoaTuEnv } = await import('./maHoa.js');

const KHOA = khoaTuEnv()!;
const VIDEO = randomBytes(3 * 1024 * 1024 + 12345);
const ANH = randomBytes(5000);

test('kho giả đang bật (không chạm bucket thật)', () => {
  assert.ok(config.r2.sandbox, 'test phải chạy trên storage sandbox');
});

test('danhMucIelts / mucCuaBai / docMedia / anhTrangIelts đọc đúng từ R2 (mã hoá)', async () => {
  const dm = {
    phienBan: 1,
    muc: [
      { id: 'reading-b1', loai: 'video', tieuDe: 'Skimming', nguon: 'Khoá Reading', kichThuoc: VIDEO.length, thoiLuongGiay: 61, mime: 'video/mp4', bamNguon: 'x',
        baiGan: [{ lessonId: 'd4-doc', trongTam: 'Đọc lướt', moc: [{ giay: 90, ghiChu: 'b' }, { giay: 5, ghiChu: 'a' }] }] },
      { id: 'sach-pdf', loai: 'pdf', tieuDe: 'Sách', nguon: 'Sách', kichThuoc: 1, soTrang: 2, baiGan: [{ lessonId: 't2d12-doc', trongTam: '' }] },
    ],
  };
  await putObject(ielts.khoaR2Ielts.danhMuc, maHoa(Buffer.from(JSON.stringify(dm)), KHOA), 'application/octet-stream');
  await putObject(ielts.khoaR2Ielts.media('reading-b1'), maHoaSR2(VIDEO, KHOA), 'application/octet-stream');
  await putObject(ielts.khoaR2Ielts.trang('sach-pdf', 2), maHoa(ANH, KHOA), 'application/octet-stream');
  ielts._xoaDemIelts();

  const d = await ielts.danhMucIelts();
  assert.equal(d.muc.length, 2);
  assert.deepEqual(d.muc[0].baiGan[0].moc!.map((m) => m.giay), [5, 90], 'mốc được sắp theo giây');
  assert.equal((await ielts.mucCuaBai('d4-doc'))[0].id, 'reading-b1');
  assert.equal((await ielts.mucCuaBai('khong-co')).length, 0);
  assert.equal('bamNguon' in ielts.choTrinhDuyet(d.muc[0]), false, 'không gửi băm nguồn cho trình duyệt');

  const dau = (await ielts.dauMedia('reading-b1'))!;
  assert.equal(dau.kichThuoc, VIDEO.length);
  const a = await ielts.docMedia('reading-b1', dau, 0, VIDEO.length - 1);
  assert.equal(a.b, VIDEO.length - 1, '3 MiB < trần 8 khúc');
  assert.deepEqual(a.du, VIDEO);
  const b = await ielts.docMedia('reading-b1', dau, 1_500_000, 2_200_000); // lấy từ đệm khúc
  assert.deepEqual(b.du, VIDEO.subarray(1_500_000, 2_200_001));
  assert.equal(await ielts.dauMedia('khong-co'), null);

  assert.deepEqual(await ielts.anhTrangIelts('sach-pdf', 2), ANH);
  assert.equal(await ielts.anhTrangIelts('sach-pdf', 3), null, 'ngoài soTrang');
  assert.equal(await ielts.anhTrangIelts('../dekiru', 1), null, 'id lạ không ghép vào khoá R2');
});

test('tải lên lại (đầu tệp đổi) ⇒ docMedia tự đọc lại đầu', async () => {
  const dauCu = (await ielts.dauMedia('reading-b1'))!;
  const moi = randomBytes(2 * 1024 * 1024);
  await putObject(ielts.khoaR2Ielts.media('reading-b1'), maHoaSR2(moi, KHOA), 'application/octet-stream');
  // (Khúc cũ còn trong đệm thì vẫn phát bản cũ NHẤT QUÁN với đầu cũ — tới khi đầu hết hạn 5 phút. Bỏ đệm để thử nhánh lệch.)
  ielts._xoaDemIelts();
  const kq = await ielts.docMedia('reading-b1', dauCu, 0, 1000);
  assert.deepEqual(kq.du, moi.subarray(0, 1001));
  assert.equal(kq.dau.kichThuoc, moi.length);
});

test('vé: đúng tệp + còn hạn mới qua', () => {
  const v = ielts.taoVe(42, 'reading-b1', 1_000_000_000_000)!;
  assert.equal(ielts.kiemVe(v.ve, 'reading-b1', 1_000_000_000_000 + 60_000), 42);
  assert.equal(ielts.kiemVe(v.ve, 'sach-pdf', 1_000_000_000_000), null, 'vé tệp khác');
  assert.equal(ielts.kiemVe(v.ve, 'reading-b1', 1_000_000_000_000 + 31 * 60_000), null, 'hết hạn');
  assert.equal(ielts.kiemVe(v.ve.replace(/^42\./, '43.'), 'reading-b1', 1_000_000_000_000), null, 'đổi userId');
  assert.equal(ielts.kiemVe(v.ve.slice(0, -1) + (v.ve.endsWith('A') ? 'B' : 'A'), 'reading-b1', 1_000_000_000_000), null, 'sửa chữ ký');
  assert.equal(ielts.kiemVe('rac', 'reading-b1'), null);
  assert.equal(ielts.kiemVe(undefined, 'reading-b1'), null);
});

test('kiemDanhMucIelts bắt lỗi soạn', () => {
  assert.throws(() => ielts.kiemDanhMucIelts({ muc: [{ id: 'A B', loai: 'x', baiGan: 1 }] }), /id phải khớp[\s\S]*loai[\s\S]*tieuDe[\s\S]*baiGan/);
  assert.throws(() => ielts.kiemDanhMucIelts({ muc: [{ id: 'a', loai: 'pdf', tieuDe: 't', nguon: 'n', baiGan: [{ lessonId: 'd1', trongTam: '', moc: [{ giay: 1 }] }] }] }), /pdf không có mốc/);
  assert.throws(() => ielts.kiemDanhMucIelts({ muc: [{ id: 'a', loai: 'video', tieuDe: 't', nguon: 'n', baiGan: [] }] }, true), /thiếu kichThuoc/);
  assert.throws(() => ielts.kiemDanhMucIelts({ muc: [1, 2].map(() => ({ id: 'a', loai: 'audio', tieuDe: 't', nguon: 'n', baiGan: [] })) }), /trùng/);
});
