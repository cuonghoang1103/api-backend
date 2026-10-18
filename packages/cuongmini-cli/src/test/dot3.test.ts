/**
 * Đợt 3 (18/10/2026) — CLI: nhãn tool đủ (không lộ tên nội bộ), tóm tắt song ngữ, gom tool liên tiếp,
 * kế hoạch không thành dòng tool, tiền = tổng cả lượt, sự kiện mới (hỏi / chờ-hẹn / tin phiên / tự thức).
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { datNgonNgu } from '../i18n';
import { KhoChat } from '../kho';
import { dichTomTat, NHAN_TOOL, nhanTool } from '../trangThai';
import { veMuc } from '../veBang';
import { boMau } from '../mau';

const goc = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');

test('MỌI tool máy chủ khai đều có nhãn đẹp (không lộ snake_case như "web_lien_ket")', () => {
  const src = readFileSync(path.join(goc, 'src/services/agent/tools.ts'), 'utf8');
  const ten = [...src.matchAll(/^\s+name: '([a-z_]+)',$/gm)].map((m) => m[1]!);
  assert.ok(ten.length > 40, `quét được ${ten.length} tool`);
  const thieu = ten.filter((t) => !NHAN_TOOL[t]);
  assert.deepEqual(thieu, [], `thiếu nhãn: ${thieu.join(', ')}`);
  assert.equal(nhanTool('tool_moi_la'), 'Tool moi la'); // tên lạ cũng không lộ gạch dưới
});

test('tóm tắt kết quả song ngữ', () => {
  datNgonNgu('en');
  assert.equal(dichTomTat('6 liên kết'), '6 links');
  assert.equal(dichTomTat('24000/36356 ký tự'), '24000/36356 chars');
  assert.equal(dichTomTat('ảnh 386 KB'), 'image 386 KB');
  assert.equal(dichTomTat('bị từ chối'), 'denied');
  datNgonNgu('vi');
  assert.equal(dichTomTat('6 liên kết'), '6 liên kết');
});

test('gom tool đọc LIÊN TIẾP cùng loại; kế hoạch không in thành dòng tool; tool nối tool không cách dòng', () => {
  datNgonNgu('en');
  const k = new KhoChat(true);
  k.batDauLuot('đọc web', 0, 'đọc web');
  k.xuLy({ loai: 'toolBatDau', id: 'p', ten: 'cap_nhat_ke_hoach' });
  k.xuLy({ loai: 'tool', id: 'p', ten: 'cap_nhat_ke_hoach', tomTat: '0/5 việc' });
  for (const [i, ts] of ['tu=0', 'tu=8000', 'tu=16000'].entries()) {
    k.xuLy({ loai: 'toolBatDau', id: `d${i}`, ten: 'web_doc', thamSo: ts });
    k.xuLy({ loai: 'tool', id: `d${i}`, ten: 'web_doc', tomTat: '8000/37070 ký tự', thamSo: ts });
  }
  assert.equal(k.S.bang.filter((m) => m.loai === 'tool').length, 0, 'nhóm còn đang gom — chưa in');
  k.xuLy({ loai: 'toolBatDau', id: 'm', ten: 'web_mo', thamSo: 'cuongthai.com/work' });
  k.xuLy({ loai: 'tool', id: 'm', ten: 'web_mo', tomTat: 'https://cuongthai.com/work', thamSo: 'cuongthai.com/work' });
  k.xuLy({ loai: 'xong', tienUsd: 0.5, soFileDaSua: 0 });
  const tools = k.S.bang.filter((m) => m.loai === 'tool');
  assert.equal(tools.length, 2);
  const chu = boMau(tools.flatMap((m, i) => veMuc(m, 100, i ? tools[i - 1] : undefined)).join('\n'));
  assert.match(chu, /● Read 3 pages/);
  assert.match(chu, /● Navigate\(cuongthai\.com\/work\)\n {2}⎿ {2}opened/);
  assert.doesNotMatch(chu, /Plan|cap_nhat|web_doc/);
  assert.doesNotMatch(chu, /pages[\s\S]*\n\n● Navigate/, 'tool nối tool: không có dòng trống');
  datNgonNgu('vi');
});

test('tiền: `xong.tienUsd` là tổng lượt; lõi cũ (chỉ vòng cuối) ⇒ dùng tổng các `tienTrinh`', () => {
  const k = new KhoChat(true);
  k.batDauLuot('a', 0, 'a');
  for (let i = 0; i < 5; i++) k.xuLy({ loai: 'tienTrinh', tokenRa: 100, tokenVao: 1000, tienUsd: 0.05, nguCanh: { phanTram: 20 + i } });
  assert.equal(k.S.nguCanh?.phanTram, 24, 'ngữ cảnh % cập nhật GIỮA lượt');
  assert.equal(k.S.tokenRa, 500);
  k.xuLy({ loai: 'xong', tienUsd: 0.05, soFileDaSua: 0 }); // lõi cũ: chỉ vòng cuối
  assert.ok(Math.abs(k.S.tienPhien - 0.25) < 1e-9, String(k.S.tienPhien));
});

test('nhắc ngữ cảnh sắp đầy ở 80% (một lần)', () => {
  const k = new KhoChat(true);
  k.batDauLuot('a', 0, 'a');
  k.xuLy({ loai: 'tienTrinh', tokenRa: 1, tokenVao: 1, tienUsd: 0, nguCanh: { phanTram: 82 } });
  k.xuLy({ loai: 'tienTrinh', tokenRa: 1, tokenVao: 1, tienUsd: 0, nguCanh: { phanTram: 84 } });
  assert.equal(k.S.bang.filter((m) => m.loai === 'thongBao' && /compact/.test(m.text)).length, 1);
});

test('sự kiện đợt 3: hỏi lựa chọn, chờ/hẹn, tin phiên, lượt tự thức, thẻ của agent phụ', () => {
  const k = new KhoChat(true);
  k.batDauLuot('a', 0, 'a');
  k.xuLy({ loai: 'hoiLuaChon', id: 'h1', cauHoi: [{ cauHoi: 'DB?', luaChon: [{ nhan: 'PG' }, { nhan: 'My' }] }] });
  assert.equal(k.S.hoi?.id, 'h1');
  assert.equal(k.S.pha, 'duyet');
  k.xuLy({ loai: 'xongHoi', id: 'h1', tomTat: 'PG' });
  assert.equal(k.S.hoi, null);
  k.xuLy({ loai: 'henCho', cho: [{ id: 'c1', moTa: 'url', batDau: 0, hetLuc: Date.now() + 5000 }], hen: [] });
  assert.equal(k.S.henCho.cho.length, 1);
  k.xuLy({ loai: 'xinPhepLenh', id: 'x', lenh: 'npm test', phanLoai: { muc: 'thuong', lyDo: [], choNho: true }, tienTo: 'npm test', phuId: 'call_1' });
  assert.equal(k.S.choDuyet[0]?.tienTo, 'npm test');
  k.xuLy({ loai: 'xong', tienUsd: 0, soFileDaSua: 0 });
  k.xuLy({ loai: 'tinPhien', tu: { id: 'abc', ten: 'web', noi: 'desktop' }, noiDung: 'đã đổi API', luc: Date.now() });
  assert.match(JSON.stringify(k.S.bang[k.S.bang.length - 1]), /đã đổi API/);
  k.xuLy({ loai: 'tuDanhThuc', cauHoi: '[Đánh thức — hẹn #h1 lúc 10:00] xem CI\n(…)', henId: 'h1' });
  assert.equal(k.S.dangChay, true);
  assert.match(JSON.stringify(k.S.bang[k.S.bang.length - 1]), /⏰ \[Đánh thức/);
});
