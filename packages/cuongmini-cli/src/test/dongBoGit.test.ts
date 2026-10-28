/**
 * ĐỒNG BỘ GIT (28/10/2026) — phần ĐIỀU PHỐI chung ba nơi (`gitDongBoLenh.ts`) với lõi GIẢ:
 * lúc mở im khi khớp · một dòng khi chỉ là thông tin · thẻ hỏi khi đang sau; chọn ⇒ gọi `keoGit` đúng nhánh đã thấy;
 * "Xem commit" ⇒ in rồi hỏi lại; xung đột ⇒ điền sẵn câu nhờ CuongMini; `/dong-bo off|on`; lõi cũ ⇒ báo cập nhật;
 * remote khớp dự án chưa gắn ⇒ hỏi gắn. Lần chạy LÕI THẬT + git thật: `gitDongBoPty.test.ts`.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { _datLaiDongBo, hoiDongBoGit, lenhDongBo, type DongBoGit } from '../../../../desktop/src/renderer/features/chat/gitDongBoLenh';
import type { GiaoDienCtw, TheChonCtw } from '../../../../desktop/src/renderer/features/chat/ctworkLenh';

type Goi = [string, Record<string, unknown>];
function giaoDien(tra: (d: Record<string, unknown>) => unknown) {
  const goi: Goi[] = [];
  const the: TheChonCtw[] = [];
  const chu: string[] = [];
  const nhap: string[] = [];
  const g: GiaoDienCtw = {
    goi: async <T,>(k: string, d?: Record<string, unknown>) => { goi.push([k, d ?? {}]); return tra(d ?? {}) as T; },
    traLoi: (md) => { chu.push(md); },
    chon: (o) => { the.push(o); },
    thongBao: (t) => { chu.push(t); },
    datNhap: (t) => { nhap.push(t); },
    ngonNgu: 'vi',
  };
  return { g, goi, the, chu, nhap };
}
const DB = (them: Partial<DongBoGit> = {}): DongBoGit => ({
  laKho: true, muc: 'im', dong: [], hoi: null, nhanh: 'main', upstream: 'origin/main', macDinh: 'origin/main',
  soVoiUpstream: { truoc: 0, sau: 0 }, soVoiMacDinh: null, banChuaCommit: 0, fetchOk: true, key: null, khop: null, ...them,
});
const HOI_KEO = {
  loai: 'keo' as const, cauHoi: 'Nhánh main đang sau origin/main 3 commit — pull không?', moTa: 'Kéo kiểu fast-forward…',
  luaChon: [{ giaTri: 'ff:upstream', nhan: 'Có — pull (fast-forward)' }, { giaTri: 'xem:upstream', nhan: 'Xem 3 commit mới trước' }, { giaTri: 'khong', nhan: 'Không' }],
};

test('lúc mở: khớp ⇒ IM LẶNG; không phải repo ⇒ im; chỉ thông tin ⇒ một dòng, không thẻ; chỉ hỏi MỘT lần mỗi tiến trình', async () => {
  _datLaiDongBo();
  const a = giaoDien(() => ({ ok: true, dongBo: DB({ dong: ['✓ Nhánh main đã khớp origin/main.'] }) }));
  assert.equal(await hoiDongBoGit(a.g, { tuDong: true }), false);
  assert.deepEqual(a.chu, []);
  assert.deepEqual(a.goi[0], ['agent:ctworkHe', { viec: 'dongBoGit', ngonNgu: 'vi', tuDong: true }]);
  // Đã kiểm được một repo thật ⇒ lần tự động sau không gọi lõi nữa.
  assert.equal(await hoiDongBoGit(a.g, { tuDong: true }), false);
  assert.equal(a.goi.length, 1);

  _datLaiDongBo();
  const b = giaoDien(() => ({ ok: true, dongBo: DB({ laKho: false, muc: 'im', dong: ['Thư mục này không phải repo git — không có gì để đồng bộ.'] }) }));
  await hoiDongBoGit(b.g, { tuDong: true });
  assert.deepEqual(b.chu, [], 'thư mục không phải repo: lúc mở không nói gì');
  await hoiDongBoGit(b.g, { tuDong: true });
  assert.equal(b.goi.length, 2, 'chưa gặp repo thật ⇒ lần sau (tab mới mở thư mục) vẫn kiểm');

  _datLaiDongBo();
  const c = giaoDien(() => ({ ok: true, dongBo: DB({ muc: 'info', dong: ['· Nhánh main có 2 commit chưa đẩy lên origin/main.'] }) }));
  assert.equal(await hoiDongBoGit(c.g, { tuDong: true }), false);
  assert.deepEqual(c.chu, ['· Nhánh main có 2 commit chưa đẩy lên origin/main.']);
  assert.equal(c.the.length, 0);

  _datLaiDongBo();
  const d = giaoDien(() => ({ ok: true, tat: true }));
  assert.equal(await hoiDongBoGit(d.g, { tuDong: true }), false);
  assert.deepEqual(d.chu, [], '/dong-bo off ⇒ lúc mở im');
});

test('ĐANG SAU ⇒ thẻ "pull không?"; Có ⇒ keoGit ff đúng nhánh đã thấy; Không ⇒ không gọi gì ghi', async () => {
  _datLaiDongBo();
  let n = 0;
  const x = giaoDien((d) => {
    if (d.viec === 'dongBoGit') return { ok: true, dongBo: DB({ muc: 'hoi', hoi: HOI_KEO, soVoiUpstream: { truoc: 0, sau: 3 } }) };
    if (d.viec === 'keoGit') { n += 1; return { ok: true, md: '✓ Đã kéo 3 commit từ origin/main vào main — HEAD giờ là abc1234.' }; }
    return { ok: false };
  });
  let moi = 0;
  x.g.lamMoiDong = () => { moi += 1; };
  assert.equal(await hoiDongBoGit(x.g, { tuDong: true }), true);
  const t = x.the[0]!;
  assert.equal(t.tieuDe, 'Nhánh main đang sau origin/main 3 commit — pull không?');
  assert.deepEqual(t.ds.map((m) => [m.nhan, m.so ?? '']), [['Có — pull (fast-forward)', ''], ['Xem 3 commit mới trước', ''], ['Không', '0']]);
  await t.khiChon('khong');
  assert.equal(n, 0);
  assert.match(x.chu.at(-1)!, /Để sau — gõ \/dong-bo/);
  await t.khiChon('ff:upstream');
  assert.equal(n, 1);
  assert.deepEqual(x.goi.at(-1), ['agent:ctworkHe', { viec: 'keoGit', ngonNgu: 'vi', cach: 'ff', mucTieu: 'upstream', tenNhanh: 'main' }]);
  assert.match(x.chu.at(-1)!, /Đã kéo 3 commit/);
  assert.equal(moi, 1, 'kéo xong ⇒ đọc lại dòng trạng thái');
});

test('"Xem commit" ⇒ in danh sách rồi hỏi lại (không còn mục Xem); xung đột ⇒ điền sẵn câu nhờ giải từng bước', async () => {
  _datLaiDongBo();
  const hoi = { loai: 'phanKy' as const, cauHoi: 'Nhánh main đã PHÂN KỲ…', moTa: '…', luaChon: [
    { giaTri: 'rebase:upstream', nhan: 'Rebase lên origin/main (khuyên)' }, { giaTri: 'merge:upstream', nhan: 'Merge origin/main' },
    { giaTri: 'xem:upstream', nhan: 'Xem commit hai bên' }, { giaTri: 'khong', nhan: 'Để sau' }] };
  const x = giaoDien((d) => {
    if (d.viec === 'dongBoGit') return { ok: true, dongBo: DB({ muc: 'hoi', hoi }) };
    if (d.viec === 'xemCommitGit') return { ok: true, md: '**Mới trên origin/main** (1)\n```\nabc sua a\n```' };
    if (d.viec === 'keoGit') return { ok: false, loi: 'Xung đột ở 1 file (đã huỷ, repo về đúng như trước): a.txt.', xungDot: ['a.txt'] };
    return { ok: false };
  });
  await lenhDongBo('', x.g);
  assert.deepEqual(x.goi[0]![1], { viec: 'dongBoGit', ngonNgu: 'vi', timDuAn: true });
  await x.the[0]!.khiChon('xem:upstream');
  assert.match(x.chu.join('\n'), /Mới trên origin\/main/);
  assert.equal(x.the.length, 2);
  assert.deepEqual(x.the[1]!.ds.map((m) => m.giaTri), ['rebase:upstream', 'merge:upstream', 'khong']);
  await x.the[1]!.khiChon('rebase:upstream');
  assert.match(x.chu.at(-1)!, /Xung đột ở 1 file/);
  assert.equal(x.nhap[0], 'Giúp mình rebase nhánh main lên origin/main và giải xung đột từng bước (file: a.txt)');
});

test('/dong-bo off | on ⇒ dongBoBat; lõi CŨ (app chưa cập nhật) ⇒ báo cập nhật, không lỗi khó hiểu', async () => {
  const x = giaoDien((d) => (d.viec === 'dongBoBat' ? { ok: true, bat: d.bat } : { ok: false }));
  await lenhDongBo('off', x.g);
  assert.deepEqual(x.goi[0]![1], { viec: 'dongBoBat', ngonNgu: 'vi', bat: false });
  assert.match(x.chu[0]!, /Đã TẮT tự kiểm git lúc mở/);
  await lenhDongBo('on', x.g);
  assert.match(x.chu[1]!, /Đã BẬT tự kiểm git/);
  const cu = giaoDien(() => ({ ok: false, loi: 'Việc không hợp lệ.' }));
  await lenhDongBo('', cu.g);
  assert.match(cu.chu.at(-1)!, /chưa hỗ trợ đồng bộ git — cập nhật app\/CLI/);
  const cu2 = giaoDien(() => { throw new Error("Invalid enum value. Expected 'goiY' | 'daHoi'"); });
  _datLaiDongBo();
  assert.equal(await hoiDongBoGit(cu2.g, { tuDong: true }), false);
  assert.deepEqual(cu2.chu, [], 'lúc mở với lõi cũ ⇒ im lặng');
});

test('/dong-bo: thư mục CHƯA gắn mà remote khớp repo của một dự án ⇒ in kết quả + hỏi gắn dự án đó', async () => {
  const x = giaoDien((d) => (d.viec === 'dongBoGit'
    ? { ok: true, dongBo: DB({ dong: ['✓ Nhánh main đã khớp origin/main.'] }), doan: { key: 'NT', projectId: 9, workspaceId: 3, workspace: 'PRJ301' } }
    : { ok: true }));
  await lenhDongBo('', x.g);
  assert.match(x.chu.join('\n'), /\*\*git · main\*\* ⇄ origin\/main/);
  assert.match(x.chu.join('\n'), /✓ Nhánh main đã khớp origin\/main/);
  assert.equal(x.the[0]!.tieuDe, 'Gắn thư mục này với dự án CT Work NT (id 9)?');
  assert.match(x.the[0]!.moTa!, /Remote git của thư mục này khớp repo của dự án NT/);
});
