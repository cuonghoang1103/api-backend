/**
 * ĐỢT 6 (18/10/2026) — CuongMini "mở là dùng" + CT Work dẫn đường ở CLI (đơn vị, không PTY):
 * thư mục đã tin (mở ở BẤT KỲ đâu, HOME cảnh báo), chọn dự án (mọi dự án · vai · lọc) ⇒ quyền ⇒ gắn ⇒ tự đọc AGENTS.md của
 * nhóm ⇒ "Hôm nay"; xong việc ⇒ gợi ý ĐÚNG LUẬT có xem trước; hướng dẫn thẻ (phụ thuộc); nhóm; Q&A; theo dõi; nhãn tool mới;
 * kho xử lý `traChen` / `huy` lyDo `tuChoi` / `ctwHuongDanNhom`.
 */
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { datNgonNgu } from '../i18n';
import { KhoChat } from '../kho';
import { dichTomTat, nhanTool } from '../trangThai';
import { daTin, ghiTin, laThuMucNhayCam } from '../tinThuMuc';
import { homNay, huongDanThe, lenhCtwork, moCtworkTuMcp, tenVai, xongViec, type GiaoDienCtw, type TheChonCtw } from '../../../../desktop/src/renderer/features/chat/ctworkLenh';

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
const DS_DU_AN = Array.from({ length: 12 }, (_, i) => ({ key: i === 0 ? 'LF' : `P${i}`, ten: i === 0 ? 'LabFlow AI' : `Dự án ${i}`, id: i + 2, workspaceId: 3, workspace: i < 6 ? 'LabFlow Studio' : 'SWR302', vaiTro: i === 0 ? 'ADMIN' : i === 1 ? 'VIEWER' : 'MEMBER', soMo: 5 }));

test('thư mục đã tin: tin thư mục cha ⇒ tin thư mục con; HOME/gốc ổ là nhạy cảm và KHÔNG lan; biến CI bỏ qua hỏi', () => {
  const tam = mkdtempSync(path.join(os.tmpdir(), 'cm-tin-'));
  const cu = process.env.CUONGMINI_HOME;
  process.env.CUONGMINI_HOME = path.join(tam, '.cuongmini');
  try {
    const duAn = path.join(tam, 'du-an');
    mkdirSync(path.join(duAn, 'src'), { recursive: true });
    assert.equal(daTin(duAn, {}), false);
    ghiTin(duAn);
    assert.equal(daTin(duAn, {}), true);
    assert.equal(daTin(path.join(duAn, 'src'), {}), true);
    assert.equal(daTin(path.join(tam, 'khac'), {}), false);
    assert.equal(daTin(path.join(tam, 'khac'), { CUONGMINI_TIN_THU_MUC: '1' }), true);
    assert.equal(laThuMucNhayCam(os.homedir()), true);
    assert.equal(laThuMucNhayCam('/'), true);
    assert.equal(laThuMucNhayCam(duAn), false);
    ghiTin(os.homedir());
    assert.equal(daTin(path.join(os.homedir(), 'mot-thu-muc-chua-tin-xyz'), {}), false, 'tin HOME không có nghĩa tin mọi thư mục con');
  } finally {
    if (cu === undefined) delete process.env.CUONGMINI_HOME; else process.env.CUONGMINI_HOME = cu;
    rmSync(tam, { recursive: true, force: true });
  }
});

test('VIỆC 4: chọn dự án — MỌI dự án (không gian · vai · thẻ mở), lọc khi nhiều; chọn ⇒ thẻ QUYỀN ⇒ gắn đúng quyền; vai chỉ xem ⇒ không cho ghi', async () => {
  const x = giaoDien((k, d) => {
    if (k === 'agent:ctwork') return { ok: true, server: { ok: true, soTool: 120 }, coGhi: true };
    if (d.viec === 'dsDuAn') return { ok: true, ds: DS_DU_AN };
    if (d.viec === 'docGan') return { ok: true, gan: null };
    if (d.viec === 'gan') return { ok: true, gan: { key: 'LF', projectId: 2, workspaceId: 3 }, duong: '/x/.cuongmini/ctwork.json', laKho: true };
    if (d.viec === 'huongDanNhom') return { ok: true, md: '## Vai trò', nguon: 'LF-DOC-5 "AGENTS.md — …"', laAgents: true };
    if (d.viec === 'homNay') return { ok: true, md: '☀ **Hôm nay** · LF', truoc: 'LF-9' };
    return { ok: true };
  });
  await moCtworkTuMcp(x.g);
  const c = x.the.at(-1)!;
  assert.equal(c.loc, true, '12 dự án ⇒ gõ để lọc');
  assert.equal(c.ds.length, 13);
  assert.match(c.ds[0]!.mo ?? '', /LabFlow Studio · trưởng nhóm · 5 thẻ mở/);
  assert.match(c.ds[7]!.mo ?? '', /SWR302 · thành viên/);
  await c.khiChon('P1'); // vai VIEWER
  const q1 = x.the.at(-1)!;
  assert.match(q1.tieuDe, /Quyền của CuongMini với P1/);
  assert.equal(q1.ds.find((m) => m.giaTri === 'ghi')!.tat, true, 'vai chỉ xem ⇒ không chọn được đọc + ghi');
  await c.khiChon('LF');
  const q = x.the.at(-1)!;
  assert.deepEqual(q.ds.map((m) => m.giaTri), ['ghi', 'doc', 'phien', 'huy']);
  await q.khiChon('doc');
  const g = x.goi.find(([, d]) => d.viec === 'gan')![1];
  assert.equal(g.quyen, 'doc');
  assert.deepEqual(g.duAn, { key: 'LF', id: 2, workspaceId: 3, ten: 'LabFlow AI', workspace: 'LabFlow Studio', vaiTro: 'ADMIN' });
  assert.ok(x.chu.some((t) => /Đã gắn thư mục với dự án \*\*LF\*\*.*chỉ đọc · vai: trưởng nhóm/.test(t)));
  assert.ok(x.chu.some((t) => /📎 Đã đọc hướng dẫn của nhóm: LF-DOC-5/.test(t)), 'tự đọc AGENTS.md của nhóm ngay sau khi gắn');
  assert.ok(x.chu.some((t) => /☀ \*\*Hôm nay\*\*[\s\S]*\/ctwork huong-dan LF-9/.test(t)), '"Hôm nay" in ra (không chặn phím)');
  // Chọn "Chỉ phiên này" ⇒ theoPhien.
  const y = giaoDien((k, d) => (k === 'agent:ctwork' ? { ok: true, server: { ok: true }, coGhi: true } : d.viec === 'dsDuAn' ? { ok: true, ds: DS_DU_AN.slice(0, 1) } : d.viec === 'gan' ? { ok: true, gan: { key: 'LF' }, theoPhien: true, laKho: false } : { ok: true }));
  await moCtworkTuMcp(y.g);
  await y.the.at(-1)!.khiChon('LF');
  await y.the.at(-1)!.khiChon('phien');
  assert.equal(y.goi.find(([, d]) => d.viec === 'gan')![1].theoPhien, true);
  assert.ok(y.chu.some((t) => /theo phiên/.test(t)));
  // Chưa nối ⇒ nối bằng phiên đăng nhập TRƯỚC (một chạm).
  let noi = false;
  const z = giaoDien((k, d) => {
    if (k === 'agent:ctwork' && d.viec === 'noi') { noi = true; return { ok: true, soTool: 120 }; }
    if (k === 'agent:ctwork') return { ok: true, server: noi ? { ok: true } : null };
    return d.viec === 'dsDuAn' ? { ok: true, ds: DS_DU_AN.slice(0, 2) } : { ok: true };
  });
  await moCtworkTuMcp(z.g);
  assert.equal(noi, true);
  assert.equal(z.the.at(-1)!.ds.length, 3);
  assert.equal(tenVai('TEACHER', 'en'), 'lecturer');
});

test('VIỆC 6: hôm nay (gọi tay = thẻ có nút) · hướng dẫn thẻ (phụ thuộc ⇒ nút nhắn người làm thẻ chặn)', async () => {
  const x = giaoDien((_k, d) => {
    if (d.viec === 'homNay') return { ok: true, md: '☀ **Hôm nay** · LF', truoc: 'LF-9' };
    if (d.viec === 'huongDan') return { ok: true, key: 'LF-18', md: '### Hướng dẫn · LF-18\n- ⛔ cần @longbui làm xong LF-5 trước', chan: ['LF-5'] };
    return { ok: true };
  });
  await homNay(x.g);
  const h = x.the.at(-1)!;
  assert.deepEqual(h.ds.map((m) => m.giaTri), ['hd:LF-9', 'bd:LF-9', 'the', 'sau']);
  await huongDanThe(x.g, 'LF-18');
  const t = x.the.at(-1)!;
  assert.match(t.than ?? '', /cần @longbui làm xong LF-5/);
  assert.deepEqual(t.ds.map((m) => m.giaTri), ['bd', 'cung', 'nhan', 'qna', 'thoat']);
  assert.match(t.ds[0]!.nhan, /đang bị chặn/);
  await t.khiChon('cung');
  assert.match(x.nhap.at(-1)!, /^LF-18 — hướng dẫn mình làm thẻ này từng bước/);
});

test('VIỆC 6/11: xong việc ⇒ gợi ý có nút; GHI đi qua thẻ XEM TRƯỚC rồi mới gọi lõi; tự động không có gì ⇒ im', async () => {
  const lam: string[] = [];
  const x = giaoDien((k, d) => {
    if (k === 'agent:ctwork') return { ok: true, coGhi: true };
    if (d.viec === 'goiYSau') return d.tuDong === true && d.key === 'LF-1' ? { ok: true, boQua: true } : {
      ok: true, key: 'LF-18', md: '**Xong việc · LF-18**',
      goiY: [{ id: 'push', loai: 'push', ghi: false, nhan: 'Push nhánh', mo: 'git push' }, { id: 'binhLuan', loai: 'binhLuan', ghi: true, nhan: 'Bình luận bằng chứng vào thẻ', mo: 'soạn từ commit' }, { id: 'chuyen:Review', loai: 'chuyen', ghi: true, nhan: 'Chuyển LF-18 → Review', mo: 'đúng luồng workflow', den: 'Review' }],
    };
    if (d.viec === 'xemTruocGoiY') return d.id === 'push' ? { ok: true, key: 'LF-18', viec: 'push', nhapGoiY: 'Push nhánh LF-18-erd lên origin (cho mình duyệt lệnh).' } : { ok: true, key: 'LF-18', viec: 'Chuyển trạng thái: In Progress → Review', noiDung: '' };
    if (d.viec === 'lamGoiY') { lam.push(String(d.id)); return { ok: true, md: '✓ LF-18 → Review.' }; }
    return { ok: true };
  });
  assert.equal(await xongViec(x.g, 'LF-1', { tuDong: true }), false);
  assert.equal(x.the.length, 0);
  assert.equal(await xongViec(x.g, undefined, { tuDong: true }), true);
  const c = x.the.at(-1)!;
  assert.match(c.tieuDe, /Xong việc ở LF-18\? Bước tiếp theo đúng luật dự án/);
  assert.match(c.ds[1]!.mo ?? '', /xem trước/);
  await c.khiChon('push');
  assert.match(x.nhap.at(-1)!, /Push nhánh LF-18-erd/);
  await c.khiChon('chuyen:Review');
  const xt = x.the.at(-1)!;
  assert.match(xt.tieuDe, /Ghi lên CT Work · LF-18\?/);
  assert.equal(xt.moTa, 'Chuyển trạng thái: In Progress → Review');
  assert.deepEqual(lam, [], 'xem trước CHƯA ghi');
  await xt.khiChon('ok');
  assert.deepEqual(lam, ['chuyen:Review']);
});

test('/ctwork hoi · nhan · theo-doi · nhom (trưởng nhóm: nhắc người trễ qua xem trước)', async () => {
  const goiLoi: string[] = [];
  const x = giaoDien((k, d) => {
    if (k === 'agent:ctwork') return { ok: true, coGhi: true };
    if (d.viec === 'theoDoi') return { ok: true, bat: d.bat !== false };
    if (d.viec === 'tongQuan') return { ok: true, vai: 'ADMIN', md: '**Tổng quan nhóm** · NT', tinNhac: '⏰ Nhắc nhẹ NT: @an (NT-1)' };
    if (d.viec === 'hoiQna' || d.viec === 'guiTinNhom') { goiLoi.push(String(d.viec)); return { ok: true, md: '✓' }; }
    return { ok: true };
  });
  await lenhCtwork('/ctwork', 'hoi ERD có cần bảng LabSlot không?', x.g);
  const q = x.the.at(-1)!;
  assert.match(q.tieuDe, /sổ Q&A/);
  assert.equal(q.than, 'ERD có cần bảng LabSlot không?');
  assert.deepEqual(goiLoi, []);
  await q.khiChon('gui');
  assert.deepEqual(goiLoi, ['hoiQna']);
  await lenhCtwork('/ctwork', 'theo-doi off', x.g);
  assert.match(x.chu.at(-1)!, /Theo dõi CT Work: \*\*TẮT\*\*/);
  await lenhCtwork('/ctwork', 'nhom', x.g);
  const n = x.the.at(-1)!;
  assert.match(n.tieuDe, /góc trưởng nhóm/);
  assert.deepEqual(n.ds.map((m) => m.giaTri), ['nhac', 'chia', 'qna', 'chat', 'hop', 'thoat']);
  await n.khiChon('nhac');
  assert.match(x.the.at(-1)!.than ?? '', /@an \(NT-1\)/);
  await x.the.at(-1)!.khiChon('gui');
  assert.deepEqual(goiLoi, ['hoiQna', 'guiTinNhom']);
});

test('nhãn tool mới + tóm tắt tiếng Anh; kho: traChen ⇒ trả về ô nhập, huy lyDo tuChoi ⇒ chờ chỉ dẫn, ctwHuongDanNhom', () => {
  datNgonNgu('en');
  try {
    assert.equal(nhanTool('ctwork_huong_dan'), 'CT Work guide');
    assert.equal(nhanTool('nap_tool_mcp'), 'Load tools');
    assert.equal(dichTomTat('nạp srs_get'), 'loaded srs_get');
    assert.equal(dichTomTat('chỉ đọc'), 'read only');
    const k = new KhoChat();
    k.batDauLuot('việc của tôi', 0, 'việc của tôi');
    k.xuLy({ loai: 'traChen', ds: ['à, làm LF-19 trước'] });
    assert.deepEqual(k.S.chenTraVe, ['à, làm LF-19 trước']);
    k.xuLy({ loai: 'huy', lyDo: 'tuChoi' });
    assert.equal(k.S.choChiDan, true);
    assert.equal(k.S.luotCuoi?.xong, undefined, 'dừng ⇒ không phải "xong" (không gợi ý bước tiếp)');
    k.xuLy({ loai: 'ctwHuongDanNhom', nguon: 'LF-DOC-5', laAgents: true });
    assert.ok(k.S.bang.some((m) => m.loai === 'thongBao' && /Read the team instructions: LF-DOC-5/.test(String((m as { text?: string }).text))));
    k.batDauLuot('làm khác', 0, 'làm khác');
    assert.equal(k.S.choChiDan, false);
    k.xuLy({ loai: 'xong', tienUsd: 0 });
    assert.equal(k.S.luotCuoi?.xong, true);
  } finally { datNgonNgu('vi'); }
});
