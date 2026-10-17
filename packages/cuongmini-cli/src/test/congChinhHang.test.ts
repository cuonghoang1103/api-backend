/**
 * Đợt 5 (18/10/2026): bảng agent phụ theo ĐÚNG thứ tự sự kiện của lõi thật
 * (`loop.ts › chayViecPhu`) + cổng Claude chính hãng (Free tự bật, ổ khoá, `nghi`).
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { chiTietAgent } from '../bangPhu';
import { datNgonNgu } from '../i18n';
import { KhoChat } from '../kho';
import { nhomCong, tenModel, tenNhomCong } from '../congModel';
import { boMau, datCapMau } from '../mau';
import { cauTrangThai } from '../trangThai';

datNgonNgu('vi');
datCapMau(0);

test('agent phụ với lõi THẬT: toolBatDau → tóm tắt cắt → phuBatDau → phuSuKien → phuXong → tool có id', () => {
  const k = new KhoChat(true);
  k.batDauLuot('soát', 0, 'soát', 0);
  const nv = 'Soát toàn bộ src/routes và liệt kê mọi tuyến thiếu kiểm quyền, kèm file:dòng cho từng chỗ';
  k.xuLy({ loai: 'toolBatDau', id: 'call_9', ten: 'giao_viec_phu', vong: 'may' }, 1000);
  k.xuLy({ loai: 'tool', ten: 'giao_viec_phu', tomTat: `[code-reviewer] ${nv.slice(0, 60)}…`, vong: 'may' }, 1001);
  k.xuLy({ loai: 'phuBatDau', phuId: 'call_9', kieuAgent: 'code-reviewer', nhiemVu: nv, model: 'sonnet-5' }, 1002);
  k.xuLy({ loai: 'phuSuKien', phuId: 'call_9', e: { loai: 'batDau', model: 'claude-haiku-4-5', buoc: 1, tranBuoc: 30 } }, 1500);
  k.xuLy({ loai: 'phuSuKien', phuId: 'call_9', e: { loai: 'nghi' } }, 1600);
  assert.equal(k.S.agentPhu[0]!.dangLam, 'Đang suy nghĩ');
  k.xuLy({ loai: 'phuSuKien', phuId: 'call_9', e: { loai: 'chu', delta: 'Mình grep trước. ' } }, 1700);
  k.xuLy({ loai: 'phuSuKien', phuId: 'call_9', e: { loai: 'toolBatDau', id: 'p1', ten: 'grep', vong: 'may' } }, 1800);
  k.xuLy({ loai: 'phuSuKien', phuId: 'call_9', e: { loai: 'tool', id: 'p1', ten: 'grep', tomTat: '7 kết quả', vong: 'may', chiTiet: '…' } }, 2000);
  k.xuLy({ loai: 'phuSuKien', phuId: 'call_9', e: { loai: 'xong', hanMuc: null, tienUsd: 0.002, daLuoc: 0, soFileDaSua: 0 } }, 2100);
  k.xuLy({ loai: 'phuSuKien', phuId: 'call_9', e: { loai: 'chu', delta: 'Có 2 tuyến thiếu kiểm quyền.' } }, 2500);
  k.xuLy({ loai: 'phuSuKien', phuId: 'call_9', e: { loai: 'xong', hanMuc: null, tienUsd: 0.001, daLuoc: 0, soFileDaSua: 0 } }, 2600);
  // Sự kiện bên trong KHÔNG lọt ra bảng ghi chính / không kết lượt chính.
  assert.equal(k.S.chuDangViet, '');
  assert.equal(k.S.dangChay, true);
  k.xuLy({ loai: 'phuXong', phuId: 'call_9', ok: true, tomTat: 'Có 2 tuyến thiếu kiểm quyền.', tienUsd: 0.003, tokenVao: 9000, tokenRa: 400 }, 3000);
  k.xuLy({ loai: 'tool', id: 'call_9', ten: 'giao_viec_phu', tomTat: 'xong (1/3)', vong: 'may', chiTiet: `KẾT QUẢ VIỆC PHỤ — "${nv.slice(0, 80)}"\n\nCó 2 tuyến thiếu kiểm quyền.` }, 3001);

  assert.equal(k.S.agentPhu.length, 1);
  const a = k.S.agentPhu[0]!;
  assert.deepEqual([a.kieu, a.nhiemVu, a.model, a.trangThai, a.soTool, a.token], ['code-reviewer', nv, 'sonnet-5', 'xong', 1, 9400]);
  assert.equal(a.tienUsd, 0.003);
  assert.equal(a.ketQua, 'Có 2 tuyến thiếu kiểm quyền.');
  assert.equal(a.tomTat, 'xong (1/3)');
  assert.equal(a.buoc.filter((b) => b.kieu === 'nhiemVu').length, 1, 'không hai bước "Nhận nhiệm vụ"');
  assert.equal(a.buoc.find((b) => b.kieu === 'nhiemVu')!.chiTiet, nv, 'nhiệm vụ đầy đủ thay bản cắt 60 ký tự');
  const ct = chiTietAgent(a, 100, 4000).map(boMau).join('\n');
  assert.match(ct, /sonnet-5/);
  assert.match(ct, /Mình grep trước\./);
  assert.equal(ct.match(/Có 2 tuyến thiếu kiểm quyền\./g)?.length, 1, 'câu trả lời cuối chỉ in một lần');
  assert.doesNotMatch(ct, /Lõi hiện chưa báo/);
});

test('agent phụ hỏng / bị dừng theo phuXong ok:false', () => {
  const k = new KhoChat(true);
  k.batDauLuot('x', 0, 'x', 0);
  k.xuLy({ loai: 'phuBatDau', phuId: 'a', kieuAgent: 'general-purpose', nhiemVu: 'A' }, 0);
  k.xuLy({ loai: 'phuBatDau', phuId: 'b', kieuAgent: 'general-purpose', nhiemVu: 'B' }, 0);
  k.xuLy({ loai: 'phuXong', phuId: 'a', ok: false, tomTat: 'đã dừng', tienUsd: 0, tokenVao: 0, tokenRa: 0 }, 10);
  k.xuLy({ loai: 'phuXong', phuId: 'b', ok: false, tomTat: 'Hết hạn mức', tienUsd: 0, tokenVao: 0, tokenRa: 0 }, 10);
  assert.deepEqual(k.S.agentPhu.map((x) => x.trangThai), ['dung', 'loi']);
});

test('lệnh nền: lõi thật gửi `lenh` trong tool chay_lenh_nen (tự duyệt, không có thẻ xin phép)', () => {
  const k = new KhoChat(true);
  k.batDauLuot('chạy dev', 0, 'chạy dev', 0);
  k.xuLy({ loai: 'toolBatDau', id: 't1', ten: 'chay_lenh_nen', vong: 'may' }, 0);
  k.xuLy({ loai: 'tool', id: 't1', ten: 'chay_lenh_nen', tomTat: 'nền dev01', vong: 'may', lenh: 'npm run dev' }, 10);
  assert.deepEqual(k.S.lenhNen.map((x) => [x.id, x.lenh, x.dangChay]), [['dev01', 'npm run dev', true]]);
});

test('CONG_CHINH_HONG_FREE: báo + ghi lời mời, lượt VẪN chạy; RAMBO_SONG_LAI là thông báo', () => {
  const k = new KhoChat(true);
  k.batDauLuot('hỏi', 0, 'hỏi', 0);
  k.xuLy({ loai: 'batDau', model: 'claude-haiku-5-5', buoc: 1, tranBuoc: 30 }, 10);
  const cacCong = [
    { cong: 'anthropic', ten: 'Anthropic chính hãng', daBat: true, canMatKhau: true, models: [{ id: 'cl-sonnet-5-5', ten: 'Claude Sonnet 5.5 · chính hãng', mo: 'x', dungDuoc: true }] },
    { cong: 'modelapi', ten: 'modelapi', daBat: true, canMatKhau: false, models: [{ id: 'gpt-6-sol', ten: 'GPT 6 Sol', mo: 'y', dungDuoc: true }] },
  ];
  k.xuLy({ loai: 'loi', ma: 'CONG_CHINH_HONG_FREE', thongDiep: 'Cổng chính đang gặp sự cố — đang tự chuyển sang model CuongMini Free.', moiNangCap: true, cacCong }, 20);
  assert.equal(k.S.dangChay, true, 'không kết lượt');
  const luot = () => k.S.luotCuoi;
  assert.equal(luot(), null);
  assert.equal(k.S.moiCong?.cacCong.length, 2);
  const tb = k.S.bang.filter((m) => m.loai === 'thongBao').map((m) => (m as { text: string }).text);
  assert.ok(tb.some((t) => /Cổng chính đang gặp sự cố — đang tự chuyển sang model CuongMini Free/.test(t)));
  assert.ok(tb.some((t) => /\/gateway/.test(t)));
  assert.ok(!k.S.bang.some((m) => m.loai === 'loi'));
  k.xuLy({ loai: 'chu', delta: 'Trả lời ở Free.' }, 30);
  k.xuLy({ loai: 'xong', hanMuc: null, tienUsd: 0, daLuoc: 0, soFileDaSua: 0 }, 40);
  assert.equal(luot()?.loi, false);
  k.xuLy({ loai: 'loi', ma: 'RAMBO_SONG_LAI', thongDiep: 'Cổng chính CuongMini đã hoạt động lại. …' }, 50);
  assert.equal(luot()?.loi, false, 'không biến lượt đã xong thành lỗi');
  assert.match(k.S.hoiQuayVe ?? '', /hoạt động lại/);

  // English: dòng thông tin đổi theo ngôn ngữ giao diện.
  datNgonNgu('en');
  const k2 = new KhoChat(true);
  k2.batDauLuot('q', 0, 'q', 0);
  k2.xuLy({ loai: 'loi', ma: 'CONG_CHINH_HONG_FREE', thongDiep: 'Cổng chính…', moiNangCap: true, cacCong }, 1);
  assert.ok(k2.S.bang.some((m) => m.loai === 'thongBao' && /switching to the CuongMini Free model/.test(m.text)));
  datNgonNgu('vi');
});

test('Lỗi cổng chính hãng ⇒ loiCanXuLy (hỏi mật khẩu / mời modelapi); daBat đi kèm', () => {
  for (const ma of ['CONG_ANTHROPIC_KHOA', 'CONG_ANTHROPIC_HET_HAN_MUC', 'CONG_ANTHROPIC_HET_KEY']) {
    const k = new KhoChat(true);
    k.batDauLuot('q', 0, 'q', 0);
    k.xuLy({ loai: 'loi', ma, thongDiep: 'x', ...(ma === 'CONG_ANTHROPIC_KHOA' ? { daBat: false } : {}) }, 1);
    assert.equal(k.S.loiCanXuLy?.ma, ma);
    assert.equal(k.S.luotCuoi?.loi, true);
    if (ma === 'CONG_ANTHROPIC_KHOA') assert.equal(k.S.loiCanXuLy?.daBat, false);
  }
  // CONG_ANTHROPIC_HONG: lõi đã tự thử lại — chỉ báo lỗi, không hỏi gì.
  const k = new KhoChat(true);
  k.batDauLuot('q', 0, 'q', 0);
  k.xuLy({ loai: 'loi', ma: 'CONG_ANTHROPIC_HONG', thongDiep: 'x' }, 1);
  assert.equal(k.S.loiCanXuLy, null);
});

test('khung nghi ⇒ "Đang suy nghĩ" tới sự kiện kế tiếp', () => {
  const k = new KhoChat(true);
  k.batDauLuot('q', 0, 'q', 0);
  k.xuLy({ loai: 'batDau', model: 'cl-opus-5-5', buoc: 1, tranBuoc: 30 }, 0);
  k.xuLy({ loai: 'toolBatDau', id: 't', ten: 'read_file', vong: 'may' }, 1);
  k.xuLy({ loai: 'tool', id: 't', ten: 'read_file', tomTat: '10 dòng', vong: 'may' }, 2);
  assert.equal(cauTrangThai(k.S), 'Đang đọc mã dự án');
  k.xuLy({ loai: 'nghi' }, 3);
  assert.equal(cauTrangThai(k.S), 'Đang suy nghĩ');
  datNgonNgu('en');
  assert.equal(cauTrangThai(k.S), 'Thinking');
  datNgonNgu('vi');
  k.xuLy({ loai: 'chu', delta: 'a' }, 4);
  assert.equal(k.S.nghiThat, false);
  assert.equal(cauTrangThai(k.S), 'Đang viết câu trả lời');
});

test('model theo cổng: tên chính hãng giữ nguyên, nhóm Cổng chính · Claude chính hãng · modelapi', () => {
  assert.equal(tenModel({ ten: 'Claude Opus 5.5 · chính hãng', cong: 'anthropic' }), 'Claude Opus 5.5 · chính hãng');
  assert.equal(tenModel({ ten: 'Claude Opus 4.8', cong: 'rambo' }), 'CuongMini Max 4.8');
  assert.equal(tenModel({ ten: 'Claude Sonnet 5' }), 'Cuong Sonnet 5');
  assert.deepEqual([nhomCong({ cong: 'anthropic' }), nhomCong({ cong: 'modelapi' }), nhomCong({ cong: 'rambo' }), nhomCong({})], ['anthropic', 'modelapi', 'chinh', 'chinh']);
  assert.equal(tenNhomCong('anthropic'), 'Claude chính hãng');
  assert.equal(tenNhomCong('chinh'), 'Cổng chính');
});
