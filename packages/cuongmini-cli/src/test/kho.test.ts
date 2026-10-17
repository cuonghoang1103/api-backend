import assert from 'node:assert/strict';
import { test } from 'node:test';
import { datNgonNgu } from '../i18n';
import { KhoChat } from '../kho';
import { boMau, datCapMau } from '../mau';
import { cauTrangThai, giay, tachKetQuaLenh } from '../trangThai';
import { veMuc } from '../veBang';

// Các phép kiểm dưới so chữ giao diện tiếng Việt.
datNgonNgu('vi');

const DIFF = { soThem: 1, soBo: 1, quaLon: false, dong: [{ loai: 'bo' as const, soCu: 1, soMoi: null, text: 'a' }, { loai: 'them' as const, soCu: null, soMoi: 1, text: 'b' }] };

test('kho: một lượt đủ loại sự kiện ⇒ bảng ghi + bảng kế hoạch + file đã sửa', () => {
  const k = new KhoChat(true);
  k.batDauLuot('sửa lỗi', 0, 'sửa lỗi', 1000);
  k.xuLy({ loai: 'batDau', model: 'sonnet-5', buoc: 1, tranBuoc: 60 }, 1100);
  assert.equal(k.S.pha, 'nghi');
  k.xuLy({ loai: 'chu', delta: 'Mình ' }, 1200);
  k.xuLy({ loai: 'chu', delta: 'xem nhé.' }, 1200);
  assert.equal(k.S.chuDangViet, 'Mình xem nhé.');
  k.xuLy({ loai: 'keHoach', viec: [{ ten: 'Đọc', trangThai: 'dang' }, { ten: 'Sửa', trangThai: 'cho' }] });
  k.xuLy({ loai: 'toolBatDau', id: 't1', ten: 'run_command', vong: 'may' }, 1300);
  assert.equal(k.S.chuDangViet, '', 'chữ được chốt trước tool');
  assert.equal(k.S.pha, 'tool');
  k.xuLy({ loai: 'xinPhepLenh', id: 'p1', lenh: 'npm test', phanLoai: { muc: 'thuong', lyDo: [], choNho: true } });
  assert.equal(k.S.pha, 'duyet');
  assert.equal(k.S.toolChay[0]!.lenh, 'npm test');
  k.xuLy({ loai: 'xongXinPhep', id: 'p1', dongY: true });
  assert.equal(k.S.choDuyet.length, 0);
  assert.equal(k.S.pha, 'tool', 'duyệt xong lệnh vẫn đang chạy');
  k.xuLy({ loai: 'lenhRa', mau: 'ok 1\n' });
  k.xuLy({ loai: 'tool', id: 't1', ten: 'run_command', tomTat: 'xong 2s', vong: 'may', chiTiet: '$ npm test\n(mã thoát 0)\n\nok 1\nok 2' });
  assert.equal(k.S.toolChay.length, 0);
  k.xuLy({ loai: 'tool', id: 't2', ten: 'edit_file', tomTat: '+1 −1', vong: 'may', duongDan: 'src/a.ts', diff: DIFF });
  k.xuLy({ loai: 'tool', id: 't3', ten: 'edit_file', tomTat: '+1 −1', vong: 'may', duongDan: 'src/a.ts', diff: DIFF });
  assert.deepEqual(k.S.fileDaSua, { 'src/a.ts': { them: 2, bo: 2 } });
  k.xuLy({ loai: 'xong', hanMuc: null, tienUsd: 0.01, daLuoc: 0, soFileDaSua: 1, nguCanh: { kyTu: 1, tran: 2, phanTram: 23, soLuotDaBo: 0 } }, 5000);
  assert.equal(k.S.dangChay, false);
  assert.deepEqual(k.S.nguCanh, { phanTram: 23, soLuotDaBo: 0 });
  assert.deepEqual(k.S.bang.map((m) => m.loai), ['nguoi', 'may', 'duyet', 'tool', 'tool', 'tool', 'ketLuot']);
  const lenh = k.S.bang[3]!;
  assert.ok(lenh.loai === 'tool' && lenh.lenh === 'npm test' && lenh.ra === 'ok 1\nok 2');
  const ket = k.S.bang[6]!;
  assert.ok(ket.loai === 'ketLuot' && ket.thoiLuong === 4000 && ket.ghiChu === '1 file đã sửa · ~$0.010');
  assert.deepEqual(k.S.muc.map((m) => m.kieu), ['nguoi', 'may', 'tool', 'tool', 'tool']);
});

test('kho: lỗi thông báo không kết lượt; RAMBO_BAO_TRI/401 cần xử lý; huỷ; /plan hỏi duyệt', () => {
  const k = new KhoChat(true);
  k.batDauLuot('a', 0, 'a', 0);
  k.xuLy({ loai: 'loi', ma: 'DOI_CONG', thongDiep: 'Đổi cổng' });
  assert.equal(k.S.dangChay, true);
  k.xuLy({ loai: 'loi', ma: 'RAMBO_BAO_TRI', thongDiep: 'bảo trì' });
  assert.equal(k.S.dangChay, false);
  assert.deepEqual(k.S.loiCanXuLy, { ma: 'RAMBO_BAO_TRI', thongDiep: 'bảo trì' });
  k.batDauLuot('b', 0, 'b', 0);
  k.xuLy({ loai: 'huy' });
  const cuoi = k.S.bang[k.S.bang.length - 1]!;
  assert.ok(cuoi.loai === 'ketLuot' && cuoi.ghiChu === 'đã dừng');
  k.S.choDuyetKeHoach = true;
  k.batDauLuot('/plan x', 0, 'p', 0);
  k.xuLy({ loai: 'xong', tienUsd: 0, soFileDaSua: 0 });
  assert.equal(k.S.hoiDuyetKeHoach, true);
  k.xuLy({ loai: 'daXoa' });
  assert.equal(k.S.bang.length, 0);
  assert.equal(k.S.khoaBang, 1);
});

test('câu trạng thái theo pha (như khung VS Code)', () => {
  assert.equal(cauTrangThai({ pha: 'tool', toolDang: 'run_command', toolCuoi: '', batDauLuot: 0 }), 'Đang chạy lệnh');
  assert.equal(cauTrangThai({ pha: 'nghi', toolDang: '', toolCuoi: 'edit_file', batDauLuot: 0 }), 'Đang code');
  assert.equal(cauTrangThai({ pha: 'duyet', toolDang: '', toolCuoi: '', batDauLuot: 0 }), 'Đang chờ bạn duyệt');
  assert.equal(cauTrangThai({ pha: 'nghi', toolDang: '', toolCuoi: '', batDauLuot: 0 }, 100), 'Đang suy nghĩ');
  assert.equal(giay(65_000), '1m 05s');
  assert.deepEqual(tachKetQuaLenh('$ ls\n(mã 0)\n\na\nb'), { lenh: 'ls', ra: 'a\nb' });
});

test('dòng tool kiểu Claude Code: ● Nhãn(arg) rồi ⎿ thu gọn còn 4 dòng cuối', () => {
  datCapMau(0);
  const ra = Array.from({ length: 10 }, (_, i) => `dòng ${i + 1}`).join('\n');
  const dong = veMuc({ id: 1, loai: 'tool', ten: 'run_command', tomTat: 'xong 2s', lenh: 'npm test', ra, hong: false, moRong: false }, 80);
  assert.deepEqual(dong, ['', '● Lệnh(npm test)', '  ⎿  … 6 dòng phía trên (ctrl+o để xem hết)', '     dòng 7', '     dòng 8', '     dòng 9', '     dòng 10', '     xong 2s']);
  const mo = veMuc({ id: 2, loai: 'tool', ten: 'run_command', tomTat: 'xong', lenh: 'x', ra, hong: false, moRong: true }, 80);
  assert.equal(mo.length, 1 + 1 + 10 + 1);
  const doc = veMuc({ id: 3, loai: 'tool', ten: 'read_file', tomTat: '120/120 dòng', duongDan: 'src/app.ts', hong: false, moRong: false }, 80);
  assert.deepEqual(doc, ['', '● Đọc(src/app.ts)', '  ⎿  120/120 dòng']);
  const ket = veMuc({ id: 4, loai: 'ketLuot', luc: new Date(2026, 9, 17, 18, 27).getTime(), thoiLuong: 72_000, ghiChu: '2 file đã sửa' }, 80);
  assert.equal(boMau(ket[0]!), '✓ CuongMini · 6:27 PM · 1m 12s · 2 file đã sửa');
});
