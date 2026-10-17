import assert from 'node:assert/strict';
import { test } from 'node:test';
import { chiTietAgent, dongBangPhu, dongTomTat, veDongBang } from '../bangPhu';
import { datNgonNgu } from '../i18n';
import { KhoChat } from '../kho';
import { boMau, datCapMau } from '../mau';
import { tachTomTatPhu } from '../viecPhu';

datNgonNgu('vi');
datCapMau(0);

test('agent phụ với lõi HIỆN TẠI: toolBatDau + tóm tắt không id + kết quả có id', () => {
  const k = new KhoChat(true);
  k.batDauLuot('soát mã', 0, 'soát mã', 0);
  k.xuLy({ loai: 'toolBatDau', id: 'g1', ten: 'giao_viec_phu', vong: 'may' }, 1000);
  k.xuLy({ loai: 'tool', ten: 'giao_viec_phu', tomTat: '[code-reviewer] Soát src/app.ts tìm lỗi…', vong: 'may' }, 1100);
  const a = k.S.agentPhu[0]!;
  assert.deepEqual([a.id, a.kieu, a.nhiemVu, a.trangThai], ['g1', 'code-reviewer', 'Soát src/app.ts tìm lỗi', 'dang']);
  k.xuLy({ loai: 'tool', id: 'g1', ten: 'giao_viec_phu', tomTat: 'xong (1/3)', chiTiet: 'KẾT QUẢ VIỆC PHỤ — "Soát"\n\nKhông thấy lỗi.', vong: 'may' }, 61_000);
  assert.equal(k.S.agentPhu[0]!.trangThai, 'xong');
  assert.equal(k.S.agentPhu[0]!.ketQua, 'Không thấy lỗi.');
  // Bảng ghi vẫn có dòng tool như cũ.
  assert.ok(k.S.bang.some((m) => m.loai === 'tool' && m.ten === 'giao_viec_phu'));
  assert.deepEqual(tachTomTatPhu('không loại…'), { kieu: null, nhiemVu: 'không loại' });
});

test('agent phụ với sự kiện ĐỀ XUẤT (phuBatDau/phuSuKien/phuXong): bước, tool, chữ, chi phí — chạy song song', () => {
  const k = new KhoChat(true);
  k.batDauLuot('việc lớn', 0, 'việc lớn', 0);
  k.xuLy({ loai: 'phuBatDau', phuId: 'a', kieuAgent: 'general-purpose', nhiemVu: 'Tìm mọi chỗ gọi API' }, 0);
  k.xuLy({ loai: 'phuBatDau', phuId: 'b', kieuAgent: 'test-runner', nhiemVu: 'Chạy test' }, 0);
  k.xuLy({ loai: 'phuSuKien', phuId: 'a', e: { loai: 'toolBatDau', ten: 'grep' } }, 1000);
  k.xuLy({ loai: 'phuSuKien', phuId: 'b', e: { loai: 'toolBatDau', ten: 'read_file' } }, 1500);
  assert.equal(k.S.agentPhu.find((x) => x.id === 'a')!.dangLam, 'Đang tìm trong mã');
  k.xuLy({ loai: 'phuSuKien', phuId: 'a', e: { loai: 'tool', ten: 'grep', tomTat: '12 kết quả' } }, 2000);
  k.xuLy({ loai: 'phuSuKien', phuId: 'a', e: { loai: 'chu', delta: 'Có 12 chỗ.' } }, 2500);
  k.xuLy({ loai: 'phuXong', phuId: 'a', ok: true, tomTat: 'xong', tienUsd: 0.004, tokenVao: 20_000, tokenRa: 1_000 }, 5000);
  const a = k.S.agentPhu.find((x) => x.id === 'a')!;
  assert.deepEqual([a.trangThai, a.soTool, a.chu, a.token], ['xong', 1, 'Có 12 chỗ.', 21_000]);
  const ds = dongBangPhu(k.S, { viec: 'Đang suy nghĩ…', batDau: 1, dangChay: true, tienUsd: 0 }, { tatCa: false, bayGio: 6000 });
  assert.deepEqual(ds.map((x) => [x.kieu, x.nhan]), [['main', 'main'], ['phu', 'test-runner']], 'bảng sống chỉ có agent đang chạy');
  const tat = dongBangPhu(k.S, { viec: '', batDau: 0, dangChay: false, tienUsd: 0 }, { tatCa: true, bayGio: 6000 });
  assert.equal(tat.length, 3);
  assert.match(tat.find((x) => x.id === 'a')!.phai, /5s · ↓ 21\.0k tokens/);
  const dong = veDongBang(ds, -1, 80).map(boMau);
  assert.match(dong[0]!, /^● main\s+Đang suy nghĩ…\s+6s$/);
  assert.match(dong[1]!, /^○ test-runner\s+Đang đọc file\s+6s$/);
  const ct = chiTietAgent(a, 80, 6000).map(boMau).join('\n');
  for (const can of ['Nhiệm vụ', 'Tìm mọi chỗ gọi API', 'Dòng thời gian', 'Tìm', '12 kết quả', 'Agent phụ viết', 'Có 12 chỗ.']) assert.ok(ct.includes(can), can);
  // Dừng lượt ⇒ agent phụ còn chạy thành "đã dừng".
  k.xuLy({ loai: 'huy' }, 7000);
  assert.equal(k.S.agentPhu.find((x) => x.id === 'b')!.trangThai, 'dung');
});

test('lệnh nền: bắt đầu (lệnh lấy từ thẻ xin phép), đọc đầu ra, dừng; dòng tóm tắt đếm shells', () => {
  const k = new KhoChat(true);
  k.batDauLuot('chạy dev', 0, 'chạy dev', 0);
  k.xuLy({ loai: 'toolBatDau', id: 'n1', ten: 'chay_lenh_nen', vong: 'may' }, 0);
  k.xuLy({ loai: 'xinPhepLenh', id: 'p', lenh: 'npm run dev', phanLoai: { muc: 'thuong', lyDo: [], choNho: true } }, 0);
  k.xuLy({ loai: 'xongXinPhep', id: 'p', dongY: true }, 0);
  k.xuLy({ loai: 'tool', id: 'n1', ten: 'chay_lenh_nen', tomTat: 'nền ab12', chiTiet: 'Đã khởi động ở nền, mã "ab12".', vong: 'may' }, 100);
  assert.deepEqual(k.S.lenhNen.map((x) => [x.id, x.lenh, x.dangChay]), [['ab12', 'npm run dev', true]]);
  k.xuLy({ loai: 'tool', id: 'n2', ten: 'doc_dau_ra_nen', tomTat: 'đang chạy (5s)', chiTiet: 'Lệnh: npm run dev\nTrạng thái: đang chạy (5s)\n\nready on :3000', vong: 'may' }, 5000);
  assert.equal(k.S.lenhNen[0]!.ra, 'ready on :3000');
  assert.match(boMau(dongTomTat({ cheDo: 'Tự động', mauCheDo: '#fff', soShell: 1, soPhu: 2, dangChay: true, dangChon: false })), /^▸▸ Tự động · 1 lệnh nền · ⧉ 2 · \/tasks xem agent phụ · esc để dừng · ↓ để quản lý$/);
  k.xuLy({ loai: 'tool', id: 'n3', ten: 'dung_lenh_nen', tomTat: 'đã dừng', chiTiet: 'Đã dừng lệnh nền "ab12" (giết cả nhóm tiến trình con).', vong: 'may' }, 9000);
  assert.equal(k.S.lenhNen[0]!.dangChay, false);
  datNgonNgu('en');
  assert.match(boMau(dongTomTat({ cheDo: 'Auto mode', mauCheDo: '#fff', soShell: 8, soPhu: 2, dangChay: true, dangChon: false })), /^▸▸ Auto mode · 8 shells · ⧉ 2 · \/tasks to see subagents · esc to interrupt · ↓ to manage$/);
  datNgonNgu('vi');
});
