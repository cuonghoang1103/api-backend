/**
 * MÃ GIA HẠN THEO $ (19/10/2026) — CLI, đơn vị (không PTY): kho nhận `giaHanTien` từ lỗi chạm trần ⇒ `loiCanXuLy`; chữ thẻ
 * song ngữ (lần 1 cộng ngay / lần 2+ chờ duyệt); câu sau kết quả; làm tiếp KHÔNG thêm câu hỏi (không lệch /rewind).
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { datNgonNgu } from '../i18n';
import { KhoChat, laGiaHanTien, type GiaHanTien } from '../kho';
import { NHIP_KIEM_MS, cauDangCho, cauKetQua, cauTheGiaHan } from '../giaHanTien';

const G: GiaHanTien = {
  tran: 'model:cm-solid', ky: 'ngay', ten: 'CuongMini Solid · hôm nay', tenEn: 'CuongMini Solid · today', mucUsd: 3, daDungUsd: 3.1, tranUsd: 3,
  canDuyet: false, dangCho: null, lanThu: 1, duongDan: 'https://cuongthai.com/cuongmini/gia-han',
};

test('kho: lỗi chạm trần có giaHanTien ⇒ loiCanXuLy mang thẻ; dữ liệu hỏng ⇒ bỏ qua (máy chủ cũ)', () => {
  const kho = new KhoChat(true);
  kho.batDauLuot('việc A', 0, 'việc A');
  kho.xuLy({ loai: 'loi', ma: 'CUONGMINI_HET_TRAN', thongDiep: 'Bạn đã dùng hết hạn mức CuongMini Solid hôm nay', giaHanTien: G });
  assert.deepEqual(kho.S.loiCanXuLy?.giaHanTien, G);
  assert.equal(kho.S.loiCanXuLy?.ma, 'CUONGMINI_HET_TRAN');
  const kho2 = new KhoChat(true);
  kho2.batDauLuot('việc A', 0, 'việc A');
  kho2.xuLy({ loai: 'loi', ma: 'NHOM_HET_TRAN', thongDiep: 'x', giaHanTien: { tran: 'nhom:1' } });
  assert.equal(kho2.S.loiCanXuLy, null, 'thẻ thiếu trường ⇒ không mở thẻ (không có gì để xử lý thêm)');
  assert.equal(laGiaHanTien({ ...G, ky: 'tuan' }), false);
  assert.equal(laGiaHanTien({ ...G, tran: 'x'.repeat(61) }), false);
});

test('chữ thẻ song ngữ: lần 1 cộng ngay · lần 2+ chờ duyệt · tự kiểm lại 30 s', () => {
  datNgonNgu('vi');
  const c = cauTheGiaHan(G);
  assert.match(c.tieuDe, /Đã chạm giới hạn CuongMini Solid · hôm nay · Nhập mã gia hạn để dùng tiếp/);
  assert.match(c.moTa, /Đã dùng 3\.1 \$ \/ 3 \$\./);
  assert.match(c.moTa, /cộng ngay \+3 \$/);
  assert.match(cauTheGiaHan({ ...G, canDuyet: true, lanThu: 2 }).moTa, /Lần 2 trong kỳ — mã đúng sẽ gửi yêu cầu, admin duyệt/);
  assert.match(cauKetQua({ ketQua: 'choDuyet', id: 42, soUsd: 3, lanThu: 2 }, true)!.chu, /Đã gửi yêu cầu gia hạn #42, chờ admin duyệt — CuongMini tự kiểm lại mỗi 30 giây/);
  assert.equal(cauKetQua({ ketQua: 'choDuyet', id: 42, soUsd: 3, lanThu: 2 }, false), null, 'kiểm lại mà vẫn chờ ⇒ im lặng');
  assert.match(cauKetQua({ ketQua: 'tuChoi', id: 42, soUsd: 3, lyDo: 'dùng nhiều quá' }, false)!.chu, /từ chối yêu cầu gia hạn #42: dùng nhiều quá/);
  assert.match(cauDangCho(9), /#9 đang chờ admin duyệt/);
  assert.ok(NHIP_KIEM_MS >= 30_000, 'kiểm lại nhẹ ≥ 30 s');
  datNgonNgu('en');
  assert.match(cauTheGiaHan(G).tieuDe, /Limit reached: CuongMini Solid · today · Enter an extension code to continue/);
  assert.match(cauKetQua({ ketQua: 'daCap', id: 1, soUsd: 3, lanThu: 1 }, true)!.chu, /Extended by \+3 \$ — CuongMini continues/);
  datNgonNgu('vi');
});

test('làm tiếp sau gia hạn: không thêm câu hỏi (không lệch /rewind), lượt chạy lại', () => {
  const kho = new KhoChat(true);
  kho.batDauLuot('việc A', 0, 'việc A');
  kho.xuLy({ loai: 'loi', ma: 'CUONGMINI_HET_TRAN', thongDiep: 'hết', giaHanTien: G });
  const soCau = kho.S.muc.filter((m) => m.kieu === 'nguoi').length;
  kho.batDauLamTiep('Đã gia hạn +3 $ — CuongMini làm tiếp chỗ dở.');
  assert.equal(kho.S.dangChay, true);
  assert.equal(kho.S.muc.filter((m) => m.kieu === 'nguoi').length, soCau, 'không thêm câu hỏi');
  assert.ok(kho.S.bang.some((m) => m.loai === 'thongBao' && /làm tiếp chỗ dở/.test(m.text)));
});
