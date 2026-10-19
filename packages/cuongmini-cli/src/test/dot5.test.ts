/**
 * ĐỢT 5 (18/10/2026) — CT Work hệ sinh thái + bố cục kiểu Claude Code ở CLI (đơn vị, không PTY):
 * bộ lệnh CT Work CHUNG (`ctworkLenh.ts`) với lõi giả, vẽ tool CT Work một dòng, chip 📎, thẻ duyệt
 * đánh số "Yes / Yes, and don't ask again… / No, and tell CuongMini…", `/help` gọn, bảng phím tắt.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { datNgonNgu } from '../i18n';
import { KhoChat } from '../kho';
import { boMau } from '../mau';
import { bangPhimTat, troGiupGon, troGiup, LENH_CLI } from '../lenhMoTa';
import { luaChonDuyet } from '../ui/thanhPhan';
import { veMuc } from '../veBang';
import { hoiCtworkMotLan, lenhCtwork, veDongCtw, type GiaoDienCtw, type TheChonCtw } from '../../../../desktop/src/renderer/features/chat/ctworkLenh';
import { tomTatKetQua } from '../../../../desktop/src/main/agent/ctworkVe';
import { mauSprintCurrent } from '../../../../desktop/src/main/agent/ctworkMauThu';

type Goi = [string, Record<string, unknown>];
function giaoDien(tra: (kenh: string, d: Record<string, unknown>) => unknown, ngonNgu: 'vi' | 'en' = 'vi') {
  const goi: Goi[] = [];
  const the: TheChonCtw[] = [];
  const chu: string[] = [];
  const nhap: string[] = [];
  const g: GiaoDienCtw = {
    goi: async <T,>(k: string, d?: Record<string, unknown>) => { goi.push([k, d ?? {}]); return tra(k, d ?? {}) as T; },
    traLoi: (md) => { chu.push(md); },
    chon: (o) => { the.push(o); },
    thongBao: (t) => { chu.push(t); },
    datNhap: (t) => { nhap.push(t); },
    ngonNgu,
  };
  return { g, goi, the, chu, nhap };
}
const DONG = { key: 'LF', projectId: 2, ten: 'LabFlow AI', nhanh: 'LF-18-erd', daNoi: true, loi: null, sprint: { ten: 'Sprint 2', conNgay: 5, laFocus: false, tong: 5 }, the: 'LF-18', theTen: 'Thiết kế ERD', theTrangThai: 'In Progress' };
const traMacDinh = (k: string, d: Record<string, unknown>): unknown => {
  if (k === 'agent:ctwork') return { ok: true, soTool: 30, quyen: 'doc', server: { ok: true, soTool: 30 } };
  switch (d.viec) {
    case 'dong': return { ok: true, dong: DONG };
    case 'sprint': return { ok: true, md: '**Sprint 2** · LF · còn 5 ngày\n\n**To Do** · 2' };
    case 'viec': return { ok: true, md: '**Việc của tôi**', dsThe: [{ key: 'LF-19', title: 'API đăng nhập', status: 'To Do', dueDate: null }] };
    case 'the': return { ok: true, md: '### LF-18 · Thiết kế ERD\n**Tự kiểm** (1/3)', key: 'LF-18', tieuDe: 'Thiết kế ERD', chuyenDuoc: ['Review'] };
    case 'chuanBiBatDau': return { ok: true, key: 'LF-18', nhanh: 'LF-18-thiet-ke-erd', nhanhCo: false, nhanhNay: 'main', den: 'In Progress', trangThai: 'To Do' };
    case 'batDau': return { ok: true, md: '✓ Đã tạo nhánh' };
    case 'gio': return { ok: true, md: '✓ Đã ghi 90 phút vào LF-18.' };
    case 'soanBinhLuan': return { ok: true, key: 'LF-18', noiDung: '**Bằng chứng — LF-18**\n- `abc1234` feat: ERD' };
    case 'binhLuan': return { ok: true, md: '✓ Đã bình luận vào LF-18.' };
    case 'docGan': return { ok: true, gan: { key: 'LF', projectId: 2, workspaceId: 3 } };
    case 'dsDuAn': return { ok: true, ds: [{ key: 'LF', ten: 'LabFlow AI', id: 2, workspaceId: 3, workspace: 'LabFlow Studio', vaiTro: 'ADMIN', soMo: 42 }] };
    case 'gan': return { ok: true, gan: { key: 'LF', projectId: 2, workspaceId: 3 }, duong: '/x/.cuongmini/ctwork.json', goiYGitignore: 'thêm `.cuongmini/` vào .gitignore' };
    case 'tuGhi': return { ok: true, bat: d.bat === true };
    default: return { ok: true };
  }
};

test('/ctwork (đã nối) ⇒ menu đánh số 1–9 + 0 Thoát; chọn 1 ⇒ bảng sprint', async () => {
  const x = giaoDien(traMacDinh);
  await lenhCtwork('/ctwork', '', x.g);
  const m = x.the.at(-1)!;
  /* Đợt 6: 2 = Hôm nay (việc của tôi + nên làm gì trước), 6 = Xong việc (bằng chứng + chuyển trạng thái đúng luật…), 7 = báo
     cáo & mẫu FPT, 8 = nhóm; không số: theo dõi bật/tắt, hỏi cách dùng CT Work. 1 · 9 · 0 giữ nguyên chỗ. */
  assert.deepEqual(m.ds.map((d) => d.nhan), ['Sprint hiện tại', 'Hôm nay — việc của tôi', 'Mở thẻ / hướng dẫn…', 'Bắt đầu làm thẻ…', 'Ghi giờ…', 'Xong việc — bước tiếp', 'Báo cáo & mẫu FPT', 'Nhóm', 'Chọn dự án', 'Thoát', 'Theo dõi: TẮT', 'Hỏi cách dùng CT Work…']);
  assert.equal(m.ds[9]!.so, '0');
  assert.match(m.moTa ?? '', /⬡ LF · Sprint 2 · còn 5 ngày · ▶ LF-18 Thiết kế ERD \[In Progress\]/);
  await m.khiChon('sprint');
  assert.match(x.chu.at(-1)!, /\*\*Sprint 2\*\*/);
  // chưa nối ⇒ thẻ kết nối (không phải menu)
  const y = giaoDien((k, d) => (k === 'agent:ctwork' ? { ok: true, server: null } : traMacDinh(k, d)));
  await lenhCtwork('/ctwork', '', y.g);
  assert.deepEqual(y.the.at(-1)!.ds.map((d) => d.giaTri), ['doc', 'ghi', 'thoat']);
});

test('/issue LF-18 ⇒ thẻ đẹp + hành động; "Bắt đầu" ⇒ XEM TRƯỚC (nhánh + trạng thái) rồi mới ghi', async () => {
  const x = giaoDien(traMacDinh);
  await lenhCtwork('/issue', 'LF-18', x.g);
  const t = x.the.at(-1)!;
  assert.match(t.than ?? '', /### LF-18 · Thiết kế ERD[\s\S]*Tự kiểm/);
  await t.khiChon('bd');
  const xem = x.the.at(-1)!;
  assert.match(xem.tieuDe, /Bắt đầu làm LF-18\?/);
  assert.match(xem.than ?? '', /tạo nhánh `LF-18-thiet-ke-erd` từ `main`[\s\S]*To Do → \*\*In Progress\*\* \(ghi lên CT Work\)/);
  assert.equal(x.goi.some(([, d]) => d.viec === 'batDau'), false, 'chưa đồng ý thì chưa ghi');
  await xem.khiChon('ca');
  assert.deepEqual(x.goi.find(([, d]) => d.viec === 'batDau')![1], { viec: 'batDau', ngonNgu: 'vi', key: 'LF-18', nhanh: true, chuyen: true });
});

test('/ctwork gio LF-18 1.5h … ⇒ thẻ xem trước; chỉ ghi sau khi chọn "Ghi"', async () => {
  const x = giaoDien(traMacDinh);
  await lenhCtwork('/ctwork', 'gio LF-18 1.5h đọc tài liệu JWT', x.g);
  const t = x.the.at(-1)!;
  assert.match(t.than ?? '', /\*\*1h 30m\*\* \(90 phút\) — đọc tài liệu JWT/);
  assert.equal(x.goi.some(([, d]) => d.viec === 'gio'), false);
  await t.khiChon('ok');
  assert.deepEqual(x.goi.find(([, d]) => d.viec === 'gio')![1], { viec: 'gio', ngonNgu: 'vi', key: 'LF-18', phut: 90, noiDung: 'đọc tài liệu JWT' });
  // thiếu thời gian ⇒ đưa vào ô nhập, không ghi
  const y = giaoDien(traMacDinh);
  await lenhCtwork('/ctwork', 'gio LF-18', y.g);
  assert.equal(y.nhap.at(-1), '/ctwork gio LF-18 ');
});

test('bình luận bằng chứng: soạn từ git ⇒ xem trước ⇒ Gửi / Sửa (đưa vào ô nhập) / Huỷ', async () => {
  const x = giaoDien(traMacDinh);
  await lenhCtwork('/ctwork', 'binh-luan', x.g);
  const t = x.the.at(-1)!;
  assert.match(t.tieuDe, /Gửi bình luận vào LF-18\?/);
  assert.match(t.than ?? '', /Bằng chứng — LF-18/);
  await t.khiChon('sua');
  assert.match(x.nhap.at(-1)!, /^\/ctwork gui LF-18 \*\*Bằng chứng/);
  await t.khiChon('gui');
  assert.equal(x.goi.find(([, d]) => d.viec === 'binhLuan')![1].key, 'LF-18');
});

test('hỏi MỘT lần lúc mở (đợt 8A): chưa nối ⇒ chỉ dòng gợi ý nhẹ; AGENTS.md ghi rõ LF ⇒ "Gắn LF?" ⇒ nối + gắn đúng id', async () => {
  let lan = 0;
  let daNoi = false;
  const x = giaoDien((k, d) => {
    if (d.viec === 'goiY') { lan += 1; return lan === 1 ? { ok: true, hoi: null, goiYNhe: true } : { ok: true, hoi: 'ganDuAn', doan: { key: 'LF', projectId: 2, workspaceId: 3, workspace: 'LabFlow Studio' } }; }
    if (k === 'agent:ctwork' && d.viec === 'trangThai') return { server: daNoi ? { ok: true } : null };
    if (k === 'agent:ctwork') { daNoi = true; return { ok: true, soTool: 30 }; }
    return traMacDinh(k, d);
  });
  assert.equal(await hoiCtworkMotLan(x.g), false, 'không thẻ chặn');
  assert.ok(!x.the.length, 'không có thẻ "Kết nối CT Work?"');
  assert.ok(x.chu.some((b) => /Làm dự án trên CT Work\? gõ \/ctwork/.test(b)), `dòng gợi ý nhẹ: ${JSON.stringify(x.chu)}`);
  assert.equal(await hoiCtworkMotLan(x.g), true);
  const b = x.the.at(-1)!;
  assert.match(b.tieuDe, /Gắn thư mục này với dự án CT Work LF \(id 2\)\?/);
  await b.khiChon('gan');
  assert.ok(x.goi.some(([k, d]) => k === 'agent:ctwork' && d.viec === 'noi' && d.quyen === 'doc'), 'chưa nối ⇒ nối chỉ đọc trước khi gắn');
  /* Đợt 6: kèm vai (myRole) — lõi ghi `vai` vào ctwork.json, máy chủ nói vai cho model. */
  assert.deepEqual(x.goi.find(([, d]) => d.viec === 'gan')![1].duAn, { key: 'LF', id: 2, workspaceId: 3, ten: 'LabFlow AI', workspace: 'LabFlow Studio', vaiTro: 'ADMIN' });
  assert.match(x.chu.at(-1)!, /Đã gắn thư mục với dự án \*\*LF\*\* \(id 2\)[\s\S]*\.gitignore/);
});

test('/ctwork tu-ghi on|off · /sprint · /viec · English', async () => {
  const x = giaoDien(traMacDinh, 'en');
  await lenhCtwork('/ctwork', 'tu-ghi on', x.g);
  assert.match(x.chu.at(-1)!, /auto-write to CT Work: ON/);
  await lenhCtwork('/ctwork', 'auto-write off', x.g);
  assert.match(x.chu.at(-1)!, /OFF/);
  await lenhCtwork('/sprint', '', x.g);
  await lenhCtwork('/viec', '', x.g);
  assert.ok(x.goi.some(([, d]) => d.viec === 'sprint') && x.goi.some(([, d]) => d.viec === 'viec'));
  await lenhCtwork('/ctwork', '', x.g);
  assert.equal(x.the.at(-1)!.ds[0]!.nhan, 'Current sprint');
});

test('dòng trạng thái CT Work: dự án · sprint · còn N ngày · ▶ thẻ; cắt theo bề ngang', () => {
  assert.equal(veDongCtw(DONG, 'vi'), '⬡ LF · Sprint 2 · còn 5 ngày · ▶ LF-18 Thiết kế ERD [In Progress]');
  assert.equal(veDongCtw({ ...DONG, sprint: { ...DONG.sprint, laFocus: true, conNgay: 0 }, the: null }, 'en'), '⬡ LF · Sprint 2 (not started) · ends today');
  assert.equal(veDongCtw({ ...DONG, daNoi: false, sprint: null, the: null }, 'vi'), '⬡ LF · chưa nối CT Work');
  assert.ok(veDongCtw(DONG, 'vi', 20).length <= 20);
  assert.equal(veDongCtw(null, 'vi'), '');
});

test('tool CT Work = MỘT dòng kiểu Claude Code; ctrl+o ⇒ bảng gọn (không JSON thô)', () => {
  datNgonNgu('vi');
  const k = new KhoChat(true);
  k.batDauLuot('sprint?', 0, 'sprint?');
  const dep = tomTatKetQua('sprint_current', mauSprintCurrent(5))!;
  k.xuLy({ loai: 'toolBatDau', id: 's1', ten: 'mcp__ctwork__sprint_current' });
  k.xuLy({ loai: 'tool', id: 's1', ten: 'mcp__ctwork__sprint_current', tomTat: dep.tomTat, chiTiet: mauSprintCurrent(5), xemGon: dep.xemGon });
  const m = k.S.bang.find((x) => x.loai === 'tool')!;
  const gon = boMau(veMuc(m, 110).join('\n'));
  assert.match(gon, /● CT Work · sprint_current — Sprint 2 · 5 thẻ · còn 5 ngày {2}\(ctrl\+o\)/);
  assert.equal(gon.trim().split('\n').length, 1, gon);
  const mo = boMau(veMuc({ ...m, moRong: true } as typeof m, 110).join('\n'));
  assert.match(mo, /⎿ {2}.*Sprint 2[\s\S]*To Do/);
  assert.doesNotMatch(mo, /"category"|"key"|<ctwork-content/);
});

test('chip 📎 LF-18 dưới tin; thẻ duyệt GHI CT Work mang xem trước', () => {
  const k = new KhoChat(true);
  k.batDauLuot('xem LF-18', 0, 'xem LF-18');
  k.xuLy({ loai: 'dinhKemCtwork', khoa: ['LF-18'] });
  const chip = k.S.bang.find((x) => x.loai === 'dinhKem')!;
  assert.match(boMau(veMuc(chip, 100).join('\n')), /📎 LF-18 · đã đính kèm tóm tắt thẻ CT Work/);
  k.xuLy({ loai: 'xinPhepMcp', id: 'm1', server: 'ctwork', tool: 'comment', args: '{}', ctwork: true, xemTruoc: { the: 'LF-18', viec: 'Bình luận', noiDung: 'Đã vẽ ERD' } });
  const d = k.S.choDuyet[0]!;
  assert.deepEqual(d.xemTruoc, { the: 'LF-18', viec: 'Bình luận', noiDung: 'Đã vẽ ERD' });
  assert.deepEqual(luaChonDuyet(d).map((x) => x.q), ['choPhep', 'tuChoi']);
});

test('thẻ duyệt đánh số kiểu Claude Code (EN + VI)', () => {
  datNgonNgu('en');
  const lenh = luaChonDuyet({ id: 'a', loai: 'xinPhepLenh', lenh: 'npm test -- a.ts', tienTo: 'npm test', phanLoai: { muc: 'thuong', lyDo: [], choNho: true } });
  assert.deepEqual(lenh.map((x) => x.nhan), ['Yes', "Yes, and don't ask again for this command in this project", "Yes, and don't ask again for `npm test …` commands in this project", 'No, and tell CuongMini what to do differently (esc)']);
  const sua = luaChonDuyet({ id: 'b', loai: 'xinPhep', duongDan: 'a.ts' });
  assert.deepEqual(sua.map((x) => x.nhan), ['Yes', "Yes, and don't ask again for edits to this file during this task", 'No, and tell CuongMini what to do differently (esc)']);
  datNgonNgu('vi');
  assert.equal(luaChonDuyet({ id: 'c', loai: 'xinPhep', duongDan: 'a.ts' }).at(-1)!.nhan, 'Không, và bảo CuongMini làm khác đi (esc)');
});

test('/help GỌN (mỗi lệnh một dòng, không bí danh) ngắn hơn hẳn bản đầy đủ; bảng phím tắt `?`', () => {
  datNgonNgu('vi');
  const ds = [{ ten: '/clear', mo: 'Xoá hội thoại, bắt đầu việc mới', khac: ['/new'], nhom: 'co-ban' as const }, { ten: '/ctwork', mo: 'CT Work: menu sprint · việc', thamSo: '[du-an]', nhom: 'cong-cu' as const }, { ten: '/issue', mo: 'Mở một thẻ CT Work', khac: ['/the'], thamSo: '<LF-18>', nhom: 'cong-cu' as const }, ...LENH_CLI];
  const gon = troGiupGon(ds, []);
  const day = troGiup(ds, []);
  assert.ok(gon.length < day.length);
  assert.match(gon, /^```text\n/);
  assert.match(gon, / {2}\/issue +Mở một thẻ CT Work/);
  assert.doesNotMatch(gon, /_\(\/new\)_|<LF-18>/);
  assert.match(gon, /`\/help all`/);
  const p = bangPhimTat();
  for (const k of ['shift+tab', 'esc', 'ctrl+o', 'LF-123', '!', '#', '@']) assert.ok(p.includes(k), k);
});

test('token hết hạn / bị thu hồi ⇒ "Cấp lại (một chạm)"; "Để sau" ⇒ không hỏi lại trong phiên', async () => {
  const x = giaoDien((k, d) => (d.viec === 'goiY' ? { ok: true, hoi: 'capLai' } : k === 'agent:ctwork' ? { ok: true, soTool: 30 } : traMacDinh(k, d)));
  assert.equal(await hoiCtworkMotLan(x.g), true);
  const t = x.the.at(-1)!;
  assert.match(t.tieuDe, /hết hạn hoặc bị thu hồi/);
  await t.khiChon('cap');
  assert.ok(x.goi.some(([k, d]) => k === 'agent:ctwork' && d.viec === 'capLai'), 'cấp lại bằng phiên đăng nhập');
  await hoiCtworkMotLan(x.g);
  await x.the.at(-1)!.khiChon('sau');
  assert.equal(await hoiCtworkMotLan(x.g), false, 'đã chọn Để sau ⇒ không làm phiền nữa');
});
