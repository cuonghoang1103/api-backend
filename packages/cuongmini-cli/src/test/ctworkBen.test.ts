/**
 * 20/10/2026 — CT Work "nối một lần, dùng mãi" (phần giao diện chung ba nơi — `ctworkLenh.ts`):
 *   • mở CuongMini ⇒ "Bạn muốn kết nối CT Work không?" (đọc + ghi khuyên dùng · chỉ đọc · không · không hỏi lại);
 *   • nối xong ⇒ chọn PHẠM VI: tất cả dự án · cả workspace · một dự án;
 *   • dòng trạng thái khi đã nối mà chưa có dự án cụ thể (trước đây trống ⇒ trông như mất kết nối).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hoiCtworkMotLan, lenhCtwork, veDongCtw, type GiaoDienCtw, type TheChonCtw } from '../../../../desktop/src/renderer/features/chat/ctworkLenh';

type Goi = [string, Record<string, unknown>];
function giaoDien(tra: (k: string, d: Record<string, unknown>) => unknown) {
  const goi: Goi[] = [];
  const the: TheChonCtw[] = [];
  const chu: string[] = [];
  const g: GiaoDienCtw = {
    goi: async <T,>(k: string, d?: Record<string, unknown>) => { goi.push([k, d ?? {}]); return tra(k, d ?? {}) as T; },
    traLoi: (md) => { chu.push(md); },
    chon: (o) => { the.push(o); },
    thongBao: (t) => { chu.push(t); },
    datNhap: () => undefined,
    ngonNgu: 'vi',
  };
  return { g, goi, the, chu };
}
const DS = [
  { key: 'NT', ten: 'Nhà trọ SV', id: 7, workspaceId: 4, workspace: 'PRJ301', vaiTro: 'MEMBER', soMo: 9 },
  { key: 'LF', ten: 'LabFlow AI', id: 2, workspaceId: 3, workspace: 'LabFlow Studio', vaiTro: 'ADMIN', soMo: 42 },
];

test('dòng trạng thái: đã nối mà chưa có dự án cụ thể ⇒ vẫn hiện "đã nối · phạm vi"', () => {
  const rong = { key: '', projectId: null, ten: null, nhanh: null, daNoi: true, loi: null, sprint: null, the: null, theTen: null, theTrangThai: null };
  assert.equal(veDongCtw({ ...rong, phamVi: 'tatCa' }, 'vi'), '⬡ CT Work · đã nối · tất cả dự án');
  assert.equal(veDongCtw({ ...rong, phamVi: 'workspace', workspace: 'PRJ301' }, 'vi'), '⬡ CT Work · đã nối · workspace PRJ301');
  assert.equal(veDongCtw({ ...rong, phamVi: 'chuaChon' }, 'en'), '⬡ CT Work · connected · no project picked');
  assert.equal(veDongCtw({ ...rong, daNoi: false, phamVi: 'tatCa' }, 'vi'), '⬡ CT Work · chưa nối · tất cả dự án');
});

test('mở CuongMini: "Bạn muốn kết nối CT Work không?" — đọc + ghi đứng đầu; "Không" ⇒ chỉ phiên này không hỏi lại', async () => {
  const x = giaoDien((_k, d) => (d.viec === 'goiY' ? { ok: true, hoi: 'ketNoi' } : { ok: true }));
  assert.equal(await hoiCtworkMotLan(x.g), true);
  const t = x.the.at(-1)!;
  assert.equal(t.tieuDe, 'Bạn muốn kết nối CT Work không?');
  assert.deepEqual(t.ds.map((m) => m.giaTri), ['ghi', 'doc', 'khong', 'khongHoiLai']);
  assert.match(t.ds[0]!.mo ?? '', /khuyên dùng/);
  await t.khiChon('khong');
  assert.equal(x.goi.some(([, d]) => d.viec === 'daHoi'), false, '"Không" không ghi nhớ hẳn');
  assert.equal(await hoiCtworkMotLan(x.g), false, 'cùng phiên ⇒ không hỏi lại');
});

test('/ctwork ghi ⇒ nối ĐỌC + GHI ⇒ chọn phạm vi: "Tất cả" ⇒ lưu mặc định của máy; "Cả workspace" ⇒ lưu workspace', async () => {
  let noi = false;
  const x = giaoDien((k, d) => {
    if (k === 'agent:ctwork' && d.viec === 'noi') { noi = true; return { ok: true, soTool: 120 }; }
    if (k === 'agent:ctwork') return { ok: true, server: noi ? { ok: true, soTool: 120 } : null };
    if (d.viec === 'goiY') return { ok: true, hoi: null };
    if (d.viec === 'docGan') return { ok: true, gan: null, macDinh: null };
    if (d.viec === 'dsDuAn') return { ok: true, ds: DS };
    if (d.viec === 'macDinh') return { ok: true, macDinh: d.macDinh };
    return { ok: true };
  });
  await lenhCtwork('/ctwork', 'ghi', x.g);
  assert.ok(x.goi.some(([k, d]) => k === 'agent:ctwork' && d.viec === 'noi' && d.quyen === 'ghi'));
  const c = x.the.at(-1)!;
  assert.match(c.tieuDe, /CuongMini làm việc với dự án nào/);
  assert.deepEqual(c.ds.map((m) => m.giaTri), ['__tatCa', '__ws:4', '__ws:3', 'NT', 'LF', '__thoat']);
  assert.match(c.ds[1]!.nhan, /Cả workspace PRJ301/);
  await c.khiChon('__tatCa');
  assert.deepEqual(x.goi.find(([, d]) => d.viec === 'macDinh')![1].macDinh, { tatCa: true });
  assert.match(x.chu.at(-1)!, /tất cả dự án CT Work của bạn[\s\S]*không mở trình duyệt/);
  await c.khiChon('__ws:4');
  assert.deepEqual(x.goi.filter(([, d]) => d.viec === 'macDinh').at(-1)![1].macDinh, { workspaceId: 4, workspace: 'PRJ301' });
});

test('đã có phạm vi mặc định ⇒ thẻ chọn hiện "Bỏ mặc định của máy"; chọn ⇒ xoá (macDinh: null)', async () => {
  const x = giaoDien((k, d) => {
    if (k === 'agent:ctwork') return { ok: true, server: { ok: true } };
    if (d.viec === 'docGan') return { ok: true, gan: null, macDinh: { tatCa: true } };
    if (d.viec === 'dsDuAn') return { ok: true, ds: DS };
    return { ok: true };
  });
  await lenhCtwork('/ctwork', 'du-an', x.g);
  const c = x.the.at(-1)!;
  assert.match(c.moTa ?? '', /Mặc định của máy: tất cả dự án/);
  assert.equal(c.ds.find((m) => m.giaTri === '__tatCa')!.tat, true, 'đang chọn ⇒ mờ');
  await c.khiChon('__boMacDinh');
  assert.equal(x.goi.find(([, d]) => d.viec === 'macDinh')![1].macDinh, null);
});

test('menu /ctwork khi chưa có dự án cụ thể: mục cần dự án mờ, "Chọn dự án" gợi ý phạm vi', async () => {
  const x = giaoDien((k, d) => {
    if (k === 'agent:ctwork') return { ok: true, server: { ok: true, soTool: 120 }, quyen: 'ghi' };
    if (d.viec === 'dong') return { ok: true, dong: { key: '', projectId: null, ten: null, nhanh: null, daNoi: true, loi: null, sprint: null, the: null, theTen: null, theTrangThai: null, phamVi: 'tatCa' } };
    return { ok: true };
  });
  await lenhCtwork('/ctwork', '', x.g);
  const m = x.the.at(-1)!;
  assert.equal(m.ds[0]!.tat, true);
  assert.match(m.moTa ?? '', /⬡ CT Work · đã nối · tất cả dự án[\s\S]*Chưa có dự án cụ thể/);
  assert.match(m.ds.find((d) => d.giaTri === 'duAn')!.mo ?? '', /dự án · workspace · tất cả/);
});
