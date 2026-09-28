/** Kiểm thử chốt kiểm số của cố vấn AI. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bocSo, kiemSo, tienTrongCauHoi } from './kiemSoAI.js';

const bang = JSON.stringify({
  gocConLai: '152.340.000₫', laiConPhaiTra: '18.905.412₫', kyToi: { ngay: '15/10/2026', soTien: '4.707.347₫' },
  laiThuc: '5,03%/tháng', thangHetNo: '07/2027', tietKiem: '23.103.000₫',
});

test('bóc số kiểu Việt: 1.234.567₫, 4,7 triệu, 3,02%, 1,5tr, ngày', () => {
  const s = bocSo('Còn 1.234.567₫, khoảng 4,7 triệu; lãi 3,02%; thêm 1,5tr; hạn 15/10/2026, hết nợ 07/2027');
  const so = s.filter((x) => x.loai === 'so').map((x) => x.giaTri);
  assert.deepEqual(so, [1_234_567, 4_700_000, 3.02, 1_500_000]);
  assert.equal(s.filter((x) => x.loai === 'ngay').length, 1);
  assert.equal(s.filter((x) => x.loai === 'thang').length, 1);
});

test('câu trả lời trích đúng số ⇒ hợp lệ, kể cả khi viết gọn có làm tròn', () => {
  const kq = kiemSo('Bạn còn nợ gốc **152.340.000₫** (khoảng 152,3 triệu), lãi còn phải trả 18,9 triệu. Kỳ tới 15/10/2026 trả 4.707.347₫. Hết nợ 07/2027. Lãi thực 5,03%/tháng.', bang);
  assert.equal(kq.hopLe, true, kq.soKhongKhop.join(', '));
});

test('số tự cộng / bịa ⇒ bị bắt', () => {
  const kq = kiemSo('Tổng bạn phải trả là 171.245.412₫, tức khoảng 171 triệu, hết nợ 08/2027.', bang);
  assert.equal(kq.hopLe, false);
  assert.ok(kq.soKhongKhop.includes('171.245.412'));
  assert.ok(kq.soKhongKhop.includes('08/2027'));
});

test('làm tròn QUÁ tay không được coi là khớp', () => {
  // 18.905.412 ⇒ "19 triệu" khớp (±0,5 triệu) nhưng "20 triệu" thì không
  assert.equal(kiemSo('lãi còn 19 triệu', bang).hopLe, true);
  assert.equal(kiemSo('lãi còn 20 triệu', bang).hopLe, false);
});

test('số nguyên nhỏ (đếm) được bỏ qua; số người dùng hỏi được nhắc lại', () => {
  assert.equal(kiemSo('Có 3 khoản, bước 1 là trả Momo.', bang).hopLe, true);
  assert.equal(kiemSo('Nếu trả thêm 2.000.000₫ mỗi tháng…', bang, 'trả thêm 2 triệu mỗi tháng thì sao').hopLe, true);
});

test('tiền trong câu hỏi', () => {
  assert.deepEqual(tienTrongCauHoi('Nếu mỗi tháng trả thêm 2 triệu thì bao lâu hết nợ?'), { soTien: 2_000_000, moiThang: true });
  assert.deepEqual(tienTrongCauHoi('Tôi có 50tr, nên trả khoản nào?'), { soTien: 50_000_000, moiThang: false });
  assert.equal(tienTrongCauHoi('Nên trả khoản nào trước?'), null);
});

test('[[tinh: …]]: mã tính tổng từ số trong bảng; số lạ thì không tính', async () => {
  const { thayPhepTinh, tinhBieuThuc } = await import('./kiemSoAI.js');
  assert.equal(tinhBieuThuc('19.674.433₫ + 28.315.400₫')!.toString(), '47989833');
  assert.equal(tinhBieuThuc('(1.000 + 2.000) * 3')!.toString(), '9000');
  assert.equal(tinhBieuThuc('1,5 * 2')!.toString(), '3');
  assert.equal(tinhBieuThuc('2 + abc'), null);
  const bang2 = JSON.stringify({ a: '19.674.433₫', b: '28.315.400₫' });
  const r = thayPhepTinh('Tổng: [[tinh: 19.674.433₫ + 28.315.400₫]].', bang2);
  assert.equal(r.chu, 'Tổng: 47.989.833₫.');
  const r2 = thayPhepTinh('Tổng: [[tinh: 19.674.433₫ + 1.000.000₫]].', bang2);
  assert.ok(r2.chu.includes('không tính được'));
  assert.equal(r2.loi.length, 1);
});
