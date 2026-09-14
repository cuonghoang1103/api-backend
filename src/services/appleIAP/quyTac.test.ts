import assert from 'node:assert/strict';
import test from 'node:test';
import { xetGiaoDich, taiKhoanTuThe, SAN_PHAM_PRO, BUNDLE_ID, type GiaoDichApple } from './quyTac.js';
import { ngayChoThang } from '../billing.service.js';

const THAT: GiaoDichApple = {
  transactionId: '2000000900000001',
  originalTransactionId: '2000000900000001',
  bundleId: BUNDLE_ID,
  productId: 'com.cuongthai.app.pro.3m',
  purchaseDate: Date.UTC(2026, 8, 14, 3, 0, 0),
  type: 'Non-Renewing Subscription',
  environment: 'Production',
  appAccountToken: '5f2b1c40-0000-4000-8000-000000000001',
};
const PROD = { chapNhanSandbox: false };
const DEV = { chapNhanSandbox: true };

test('giao dịch thật ⇒ nhận, đúng số ngày và đúng chủ', () => {
  const r = xetGiaoDich(THAT, PROD);
  assert.equal(r.nhan, true);
  if (!r.nhan) return;
  assert.equal(r.soNgay, 90);
  assert.equal(r.maSanPham, 'com.cuongthai.app.pro.3m');
  assert.equal(r.moiTruong, 'Production');
  assert.equal(r.theTaiKhoan, '5f2b1c40-0000-4000-8000-000000000001');
  assert.equal(r.hetHan, null);
});

test('⛔ giao dịch của APP KHÁC bị từ chối', () => {
  // Apple ký cho MỌI app trên App Store. Chữ ký hợp lệ chỉ chứng minh "Apple
  // đã ký", không chứng minh "mua ở app mình". Thiếu chốt này thì một lượt
  // mua 0,99$ ở game bất kỳ đổi được 12 tháng Pro.
  const r = xetGiaoDich({ ...THAT, bundleId: 'com.someone.else' }, PROD);
  assert.equal(r.nhan, false);
  if (r.nhan) return;
  assert.equal(r.vi, 'sai_ung_dung');
});

test('⛔ giao dịch Sandbox KHÔNG cấp Pro trên production…', () => {
  const r = xetGiaoDich({ ...THAT, environment: 'Sandbox' }, PROD);
  assert.equal(r.nhan, false);
  if (r.nhan) return;
  assert.equal(r.vi, 'sai_moi_truong');
});

test('…nhưng máy dev thì nhận, để thử được bằng tài khoản Sandbox', () => {
  const r = xetGiaoDich({ ...THAT, environment: 'Sandbox' }, DEV);
  assert.equal(r.nhan, true);
  if (!r.nhan) return;
  assert.equal(r.moiTruong, 'Sandbox');
});

test('⛔ thiếu hẳn trường environment cũng bị coi là Sandbox', () => {
  // Apple từng đổi cách khai trường này. Mặc định phải là "không tin", chứ
  // không phải "thiếu thì coi như Production".
  const { environment, ...thieu } = THAT;
  assert.equal(xetGiaoDich(thieu, PROD).nhan, false);
});

test('⛔ đã hoàn tiền ⇒ không cấp', () => {
  const r = xetGiaoDich({ ...THAT, revocationDate: Date.now(), revocationReason: 1 }, PROD);
  assert.equal(r.nhan, false);
  if (r.nhan) return;
  assert.equal(r.vi, 'da_hoan_tien');
});

test('⛔ sản phẩm lạ ⇒ không đoán bừa số ngày', () => {
  const r = xetGiaoDich({ ...THAT, productId: 'com.cuongthai.app.pro.99m' }, PROD);
  assert.equal(r.nhan, false);
  if (r.nhan) return;
  assert.equal(r.vi, 'san_pham_la');
});

test('⛔ thiếu mã giao dịch ⇒ từ chối', () => {
  const { transactionId, ...a } = THAT;
  assert.equal(xetGiaoDich(a, PROD).nhan, false);
  const { originalTransactionId, ...b } = THAT;
  assert.equal(xetGiaoDich(b, PROD).nhan, false);
});

test('số ngày mỗi gói KHỚP đúng ngayChoThang của web', () => {
  // Ràng hai bên vào nhau. Đổi quy tắc 30 ngày/tháng ở billing mà quên Apple
  // thì phép kiểm này đỏ, thay vì hai đường bán lệch nhau âm thầm.
  for (const [ma, thang] of Object.entries(SAN_PHAM_PRO)) {
    const r = xetGiaoDich({ ...THAT, productId: ma }, PROD);
    assert.equal(r.nhan, true, ma);
    if (!r.nhan) continue;
    assert.equal(r.soNgay, ngayChoThang(thang), `${ma} phải ra ${ngayChoThang(thang)} ngày`);
  }
  assert.equal(ngayChoThang(1), 30);
  assert.equal(ngayChoThang(12), 360);
});

test('thiếu purchaseDate ⇒ lấy giờ máy chủ, KHÔNG ra Invalid Date', () => {
  const { purchaseDate, ...thieu } = THAT;
  const r = xetGiaoDich(thieu, PROD);
  assert.equal(r.nhan, true);
  if (!r.nhan) return;
  assert.ok(!Number.isNaN(r.luc.getTime()), 'ngày phải hợp lệ');
});

test('gói tự gia hạn ⇒ giữ được mốc hết hạn của Apple', () => {
  const het = Date.UTC(2026, 11, 14);
  const r = xetGiaoDich({ ...THAT, type: 'Auto-Renewable Subscription', expiresDate: het }, PROD);
  assert.equal(r.nhan, true);
  if (!r.nhan) return;
  assert.equal(r.hetHan?.getTime(), het);
});

test('appAccountToken đọc ngược ra ĐÚNG userId — cả chữ hoa lẫn chữ thường', () => {
  // Ghim giao kèo với `KhoPro.theTaiKhoan` bên iOS. Giá trị dưới đây lấy từ
  // chính Swift chạy thật, không phải gõ tay theo trí nhớ.
  const mau: [string, number][] = [
    ['00000000-0000-4000-8000-000000000001', 1],
    ['00000000-0000-4000-8000-00000000002A', 42],        // Swift in HOA
    ['00000000-0000-4000-8000-00000000002a', 42],        // dạng thường
    ['00000000-0000-4000-8000-0000000F423F', 999_999],
    ['00000000-0000-4000-8000-00007FFFFFFF', 2_147_483_647],
  ];
  for (const [token, id] of mau) assert.equal(taiKhoanTuThe(token), id, token);
});

test('appAccountToken rác ⇒ null, không đoán bừa ra user nào', () => {
  for (const rac of [null, undefined, '', 'khong-phai-uuid', '00000000-0000-4000-8000',
                     '00000000-0000-4000-8000-00000000000g',
                     '00000000-0000-4000-8000-000000000000']) {
    assert.equal(taiKhoanTuThe(rac as string), null, String(rac));
  }
});
