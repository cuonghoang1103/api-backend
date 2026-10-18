/**
 * QA đợt 7 (19/10/2026) — thuần, không CSDL:
 *   • hạn mức nhóm: dự án đã LƯU số riêng (kể cả 1/15 cũ) giữ nguyên; lưu một ô ⇒ ô kia lấy mặc định MỚI (5/20);
 *     trần THÁNG xét trước trần người/ngày (nới ngày không gỡ được tháng) — kể cả khi đã có tiền gia hạn ngày;
 *   • thẻ gia hạn nhóm KHÔNG sinh ra khi trần tháng đã chạm; trần gốc 0 (admin chặn model) không thành "một mức" 0 $.
 */
import assert from 'node:assert/strict';
import test from 'node:test';

process.env.JWT_SECRET ||= 'gia-lap-jwt-qa70';

const { MAC_DINH_NHOM, chamTranNhom, docCauHinhNhom } = await import('./hanMucNhom.js');
const { tranChamModel, tranChamNhom } = await import('./maGiaHanTien.js');

test('hạn mức nhóm: số đã lưu giữ nguyên; ô thiếu ⇒ mặc định mới 5/20', () => {
  const cu = docCauHinhNhom({ cuongMiniNhom: { bat: true, tranNgayNguoiUsd: 1, tranThangNhomUsd: 15, chuId: 9, dongY: [9] } });
  assert.equal(cu.tranNgayNguoiUsd, 1);
  assert.equal(cu.tranThangNhomUsd, 15);
  const mot = docCauHinhNhom({ cuongMiniNhom: { tranNgayNguoiUsd: 2 } });
  assert.equal(mot.tranNgayNguoiUsd, 2);
  assert.equal(mot.tranThangNhomUsd, MAC_DINH_NHOM.tranThangNhomUsd);
  assert.equal(MAC_DINH_NHOM.tranThangNhomUsd, 20);
  assert.equal(docCauHinhNhom({}).tranNgayNguoiUsd, 5);
});

test('trần THÁNG của nhóm xét trước, tiền gia hạn ngày không gỡ được; thẻ chỉ cho trần người/ngày', () => {
  const n = { key: 'LF', tranNgayNguoiUsd: 5, tranThangNhomUsd: 20, daDungNgay: 6, daDungThang: 20.5, giaHanNgay: 5 };
  const q = chamTranNhom(n);
  assert.equal(q && q.loai === 'tuChoi' ? q.tranCham : null, 'nhomThang');
  assert.equal(tranChamNhom({ projectId: 3, ...n }), null, 'tháng chạm ⇒ không có thẻ nhập mã');
  const ngay = chamTranNhom({ ...n, daDungThang: 12, daDungNgay: 10 });
  assert.equal(ngay && ngay.loai === 'tuChoi' ? ngay.tranCham : null, 'nguoiNgay', '5 gốc + 5 gia hạn = 10 ⇒ chạm');
  assert.equal(chamTranNhom({ ...n, daDungThang: 12, daDungNgay: 9.9 }), null, 'chưa tới 10 ⇒ còn');
});

test('trần model gốc 0 $ (admin chặn) ⇒ không có "một mức" để cấp', () => {
  assert.equal(tranChamModel({ goi: 'pro', daDungThang: 0.1, daDungNgay: 0.1, tranThang: 0, tranNgay: 0 }, { id: 'cm-x', ten: 'X' }), null);
  assert.equal(tranChamModel({ goi: 'khac', daDungThang: 9, daDungNgay: 9, tranThang: 0, tranNgay: 0 }, { id: 'cm-x', ten: 'X' }), null);
  const t = tranChamModel({ goi: 'pro', daDungThang: 101, daDungNgay: 2, tranThang: 100, tranNgay: 1, tranThangGoc: 100, tranNgayGoc: 1 }, { id: 'cm-x', ten: 'X' });
  assert.equal(t?.ky, 'thang', 'tháng chạm thì gia hạn THÁNG (nới ngày không gỡ được tháng)');
  assert.equal(t?.mucUsd, 100);
});
