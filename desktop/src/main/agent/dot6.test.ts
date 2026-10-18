/**
 * ĐỢT 6 — CuongMini DẪN ĐƯỜNG CT Work: phần thuần (`ctworkDanDuongVe.ts`) + phần app tự làm (`ctworkDanDuong.ts`) với CT Work
 * GIẢ (lời gọi MCP + git + gh tiêm vào) — không mạng, không ghi CT Work thật.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const THU_MUC = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-dot6-'));
vi.mock('electron', () => ({ app: { getPath: () => THU_MUC, isPackaged: false, getVersion: () => '1' }, safeStorage: { isEncryptionAvailable: () => false } }));
vi.mock('../config', () => ({ API_ORIGIN: 'http://may-chu-gia.test', WEB_ORIGIN: 'https://cuongthai.test', IS_DEV: true }));
let toolSv: Array<{ tenGoc: string; chiDoc?: boolean }> = [];
vi.mock('./mcp', async (goc) => ({
  ...(await goc<typeof import('./mcp')>()),
  trangThaiServer: () => [{ ten: 'ctwork', ok: true, soTool: 120 }],
  toolCuaServer: () => toolSv,
}));

const V = await import('./ctworkVe');
const D = await import('./ctworkDanDuongVe');
const H = await import('./ctworkHe');
const DD = await import('./ctworkDanDuong');
const M = await import('./ctworkMauThu');

const DU_TOOL = M.MAU_TOOLS_DAY_DU.map((t) => ({ tenGoc: t.name, ...(t.ghi ? {} : { chiDoc: true }) }));

describe('ctworkDanDuongVe — phụ thuộc, hướng dẫn thẻ, hôm nay, gợi ý sau việc, AGENTS.md của nhóm', () => {
  it('đọc dòng PHỤ THUỘC máy sinh ⇒ "cần @longbui làm xong LF-5 trước" + nhánh để pull', () => {
    const p = D.docPhuThuoc(M.mauGetIssuePhuThuoc('LF-18'));
    expect(p.chan).toEqual([{ key: 'LF-5', trangThai: 'In Progress', xong: false, nguoi: '@longbui' }]);
    expect(p.dangChan[0]).toMatchObject({ key: 'LF-19', nguoi: '@an' });
    expect(p.cha).toMatchObject({ key: 'LF-2', xong: false });
    expect(p.conChuaXong).toHaveLength(1);
    expect(p.soCon).toBe(2);
    expect(p.nguoiTao).toBe('@cuong');
    const cau = D.cauPhuThuoc('LF-18', p, { 'LF-5': 'origin/LF-5-erd-co-so' });
    expect(cau[0]).toMatch(/LF-18 đang CHỜ LF-5 \[In Progress\] — cần @longbui làm xong LF-5 trước/);
    expect(cau[0]).toMatch(/git fetch origin.*git merge origin\/LF-5-erd-co-so/);
    expect(cau.join('\n')).toMatch(/LF-19 \(@an\) đang CHỜ thẻ này/);
    expect(cau.join('\n')).toMatch(/1\/2 thẻ con chưa xong/);
    const xong = D.docPhuThuoc(M.mauGetIssuePhuThuoc('LF-18', { chanXong: true }));
    expect(xong.chan).toEqual([]);
    expect(xong.chanXongHet).toBe(true);
    // Máy chủ cũ (chưa có dòng phụ thuộc) ⇒ rỗng, không đoán bừa.
    expect(D.docPhuThuoc(M.mauGetIssue('LF-18')).chan).toEqual([]);
    expect(D.nhanhCuaThe(['  origin/main', '  origin/LF-50-x', '  origin/LF-5-erd'], 'LF-5')).toBe('origin/LF-5-erd');
  });

  it('hướng dẫn MỘT thẻ: đọc gì (link tuyệt đối) · các bước · xong khi (Tự kiểm + DoD) · hỏi ai · phụ thuộc', () => {
    const md = D.veHuongDanThe(M.mauIssueGuide('LF-18'), { webGoc: 'https://cuongthai.test', nhanh: { 'LF-5': null } })!;
    expect(md).toMatch(/### Hướng dẫn · LF-18 — Thiết kế ERD v1/);
    expect(md).toMatch(/\[mở trên web\]\(https:\/\/cuongthai\.test\/work\/labflow-studio\/LF\/issue\/18\)/);
    expect(md).toMatch(/\*\*Phụ thuộc\*\*[\s\S]*cần @longbui làm xong LF-5/);
    expect(md).toMatch(/\[Hướng dẫn ERD\]\(https:\/\/cuongthai\.test\/work\/labflow-studio\/LF\/docs\/3\)/);
    expect(md).toMatch(/\[dbdiagram\]\(https:\/\/dbdiagram\.io\/d\/labflow\)/);
    expect(md).toMatch(/1\. Liệt kê thực thể từ use case\n2\. Vẽ ERD bằng dbdiagram/);
    expect(md).toMatch(/\[x\] Có đủ 3 thực thể/);
    expect(md).toMatch(/DoD: Có test/);
    expect(md).toMatch(/@cuong \(người tạo thẻ\)/);
    expect(md).toMatch(/@longbui — tiến độ LF-5 \(đang chặn bạn\)/);
  });

  it('hôm nay: quá hạn trước, bị chặn xuống cuối; nói lý do', () => {
    const ds = V.docViecToi(M.MAU_MY_WORK).map((v) => (v.key === 'LF-19' ? { ...v, blocked: true } : v));
    const h = D.xepViecHomNay(ds);
    expect(h.truoc?.key).toBe('LF-9');
    expect(h.lyDo).toBe('đã quá hạn');
    expect(h.ds.at(-1)!.key).toBe('LF-19');
    expect(D.veHomNay(h, 'LF', { ten: 'Sprint 2', conNgay: 5 })).toMatch(/👉 Nên làm trước: `LF-9` Daily log tuần 1 — đã quá hạn\./);
    expect(D.xepViecHomNay(ds.filter((v) => v.key !== 'LF-9')).truoc?.key).toBe('LF-18'); // đang làm dở
  });

  it('gợi ý SAU KHI XONG đúng luật: chỉ trạng thái workflow cho phép; Done chưa đạt Tự kiểm ⇒ cảnh báo; token chỉ đọc ⇒ không gợi ý ghi', () => {
    const t = V.docThe(M.mauGetIssue('LF-18'))!;
    const p = D.docPhuThuoc(M.mauGetIssuePhuThuoc('LF-18'));
    const git = { nhanh: 'LF-18-erd', soCommit: 2, chuaPush: 1, soFileChuaCommit: 0, prUrl: 'https://github.com/x/y/pull/7' };
    const ds = D.goiYSauViec(t, p, git, () => true);
    const id = ds.map((x) => x.id);
    expect(id).toEqual(['push', 'binhLuan', 'chuyen:Review', 'gio', 'review', 'chat', 'raid', 'qna']);
    expect(ds.find((x) => x.id === 'binhLuan')!.mo).toMatch(/PR/);
    expect(id).not.toContain('chuyen:Done'); // có Review + Tự kiểm 1/3 + còn thẻ chặn ⇒ không đưa Done
    const tDu = { ...t, tuKiem: t.tuKiem.map((x) => ({ ...x, xong: true })), chuyenDuoc: ['Done'] };
    const ds2 = D.goiYSauViec(tDu, { ...p, chan: [], conChuaXong: [] }, git, () => true);
    expect(ds2.find((x) => x.id === 'chuyen:Done')!.mo).toMatch(/đạt Tự kiểm/);
    const ds3 = D.goiYSauViec(t, p, git, (ten) => !['comment', 'transition', 'log_work', 'request_review', 'chat_post', 'raid_create', 'qna_ask'].includes(ten));
    expect(ds3.every((x) => !x.ghi)).toBe(true);
    expect(D.soanTinXong(t, p, git)).toMatch(/Mình xong LF-18.*PR: https:\/\/github\.com\/x\/y\/pull\/7/);
  });

  it('AGENTS.md của nhóm: tìm trang (không phân biệt hoa thường), lấy khối ```markdown ĐẦU TIÊN, gộp — cục bộ THẮNG khi trùng mục', () => {
    const ds = D.docDsTrang(M.mauListPages());
    expect(D.timTrangAgents(ds)?.page).toBe(5);
    expect(D.timTrangAgents(D.docDsTrang(M.mauListPages({ coAgents: false })))).toBeNull();
    expect(D.timTrangTongQuan(ds)?.page).toBe(1);
    // 5 dự án thật: tiêu đề kiểu "AGENTS.md — …", "Agents.md (CuongMini)", "AGENTS.MD"
    for (const tieuDe of ['AGENTS.md — hướng dẫn cho CuongMini', 'Agents.md (CuongMini)', 'AGENTS.MD', '  agents.md - NT']) expect(D.timTrangAgents([{ page: 1, title: tieuDe }])?.page).toBe(1);
    expect(D.timTrangAgents([{ page: 1, title: 'Đọc AGENTS.md trước' }])).toBeNull();
    const nd = D.rutNoiDungAgents(M.mauGetPage(5, M.MAU_TRANG_AGENTS));
    expect(nd).toMatch(/^## Vai trò\nCuongMini là MENTOR/);
    expect(nd).not.toMatch(/Khối thứ hai/);
    expect(D.rutNoiDungAgents(M.mauGetPage(1, '# Không có khối\nToàn trang.'))).toBe('# Không có khối\nToàn trang.');
    const gop = D.gopGhiChu('# AGENTS\n\n## Vai trò\nViết code thoải mái.\n', nd, 'LF-DOC-5');
    expect(gop).toMatch(/Viết code thoải mái/);
    expect(gop).not.toMatch(/CuongMini là MENTOR/); // mục trùng "Vai trò" ⇒ cục bộ thắng
    expect(gop).toMatch(/## Hướng dẫn của NHÓM \(CT Work · LF-DOC-5\)[\s\S]*## Quy ước git/);
    expect(D.gopGhiChu(null, nd, 'x')).toMatch(/CuongMini là MENTOR/);
  });

  it('tin theo dõi: được giao / nhắc / bình luận / thẻ chặn đã Done', () => {
    const c = D.docCapNhat(M.mauMyUpdates({
      lastId: 9,
      events: [
        { id: 7, type: 'WORK_COMMENT', issue: 'NT-12', title: 'API', excerpt: 'x', by: '@longbui' },
        { id: 8, type: 'WORK_ASSIGN', issue: 'NT-20', title: 'Trang chủ', excerpt: null, by: '@lead' },
      ],
      unblocked: [{ issue: 'NT-15', blocker: 'NT-12', blockerTitle: 'API', by: '@longbui' }],
    }))!;
    const tin = D.tinTheoDoi(c);
    expect(tin).toEqual([
      '💬 @longbui vừa bình luận NT-12',
      '📌 Bạn vừa được giao NT-20 — Trang chủ',
      '✅ NT-12 (chặn thẻ NT-15 của bạn) đã Done — @longbui — pull về làm được rồi',
    ]);
  });

  it('trưởng nhóm: tổng quan (ai trễ, bị chặn, chưa giao, tải lệch) + tin nhắc; mẫu FPT theo loại dự án', () => {
    const ds = [
      { key: 'NT-1', title: 'a', status: 'To Do', assignee: 'an', blocked: false, quaHan: true },
      { key: 'NT-2', title: 'b', status: 'To Do', assignee: 'an', blocked: true },
      { key: 'NT-3', title: 'c', status: 'To Do', assignee: 'an', blocked: false },
      { key: 'NT-4', title: 'd', status: 'To Do', assignee: 'binh', blocked: false },
      { key: 'NT-5', title: 'e', status: 'To Do', assignee: null, blocked: false },
    ];
    const md = D.veTongQuanNhom(ds, 'NT');
    expect(md).toMatch(/@an: 3 mở · ⛔ 1 bị chặn · ⚠ quá hạn: NT-1/);
    expect(md).toMatch(/Chưa giao: 1 \(NT-5\)/);
    expect(md).toMatch(/Tải lệch/);
    expect(D.soanTinNhacTre(ds, 'NT')).toMatch(/@an \(NT-1\)/);
    const mau = D.goiYMauFpt({ kind: 'SCHOOL', tienDo: null, tool: () => true }).map((m) => m.tool);
    expect(mau).toEqual(expect.arrayContaining(['meeting_minutes_propose', 'weekly_report_generate', 'srs_get', 'rtm_get', 'fpt_unit_suggest', 'fpt_it_list']));
    expect(D.goiYMauFpt({ kind: 'SCHOOL', tienDo: null, tool: (t) => t !== 'srs_get' }).some((m) => m.tool === 'srs_get')).toBe(false);
  });
});

describe('ctworkDanDuong — app tự làm với CT Work GIẢ', () => {
  let goc = '';
  let goiGhi: Array<[string, Record<string, unknown>]> = [];
  let trang: { updatedAt: string; coAgents: boolean; docsTat: boolean } = { updatedAt: '2026-10-17T09:00:00.000Z', coAgents: true, docsTat: false };
  let head = 'aaa';
  let capNhat: { lastId: number; events: unknown[]; unblocked: unknown[] } = { lastId: 3, events: [], unblocked: [] };
  beforeEach(async () => {
    goc = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-dot6-goc-'));
    goiGhi = [];
    trang = { updatedAt: '2026-10-17T09:00:00.000Z', coAgents: true, docsTat: false };
    head = 'aaa';
    toolSv = DU_TOOL;
    H._xoaDem();
    DD._xoaDemDanDuong();
    DD._datDanDuong({ thuMuc: () => goc, gh: async () => ({ ok: true, ra: 'https://github.com/x/y/pull/7\n' }) });
    H._datPhuThuoc({
      goi: async (tool, args) => {
        goiGhi.push([tool, args]);
        if (tool === 'list_pages') return trang.docsTat ? { noiDung: 'LỖI: MODULE_DISABLED: The "docs" module is turned off', loi: true } : { noiDung: M.mauListPages({ coAgents: trang.coAgents, updatedAt: trang.updatedAt }), loi: false };
        if (tool === 'get_page') return { noiDung: M.mauGetPage(Number(args.page), args.page === 5 ? M.MAU_TRANG_AGENTS : '# Tổng quan\nHệ thống đặt phòng lab.'), loi: false };
        if (tool === 'sprint_current') return { noiDung: M.mauSprintCurrent(5), loi: false };
        if (tool === 'my_work') return { noiDung: M.MAU_MY_WORK, loi: false };
        if (tool === 'issue_guide') return { noiDung: M.mauIssueGuide(String(args.issue)), loi: false };
        if (tool === 'get_issue') return { noiDung: M.mauGetIssuePhuThuoc(String(args.issue)), loi: false };
        if (tool === 'list_projects') return { noiDung: M.MAU_LIST_PROJECTS, loi: false };
        if (tool === 'my_updates') return { noiDung: M.mauMyUpdates(capNhat), loi: false };
        if (tool === 'search_issues') return { noiDung: `2 match(es), showing 2\n${'<ctwork-content source="s" untrusted="true">'}\n[{"key":"LF-9","title":"a","status":"To Do","assignee":"an","blocked":false},{"key":"LF-30","title":"b","status":"To Do","assignee":null,"blocked":false}]\n</ctwork-content>`, loi: false };
        return { noiDung: '{"ok":true}', loi: false };
      },
      git: async (args) => {
        if (args[0] === 'rev-parse' && args[1] === '--abbrev-ref') return { ok: true, ra: 'LF-18-erd\n' };
        if (args[0] === 'rev-parse' && args[1] === '--verify') return { ok: args.at(-1) === 'main', ra: '' };
        if (args[0] === 'rev-parse' && args[1] === 'HEAD') return { ok: true, ra: `${head}\n` };
        if (args[0] === 'rev-parse' && args[1] === '--show-toplevel') return { ok: true, ra: goc };
        if (args[0] === 'symbolic-ref') return { ok: false, ra: '' };
        if (args[0] === 'rev-list' && String(args[2]).startsWith('main')) return { ok: true, ra: '2\n' };
        if (args[0] === 'rev-list') return { ok: true, ra: '1\n' };
        if (args[0] === 'status') return { ok: true, ra: '' };
        if (args[0] === 'log') return { ok: true, ra: 'abc1234 LF-18: ERD bản nháp' };
        if (args[0] === 'branch') return { ok: true, ra: '  origin/LF-5-co-so\n' };
        return { ok: false, ra: '', loi: 'không giả' };
      },
    });
    await H.ghiGan(goc, { key: 'LF', projectId: 2, workspaceId: 3, vai: 'MEMBER' });
  });

  it('VIỆC 5: AGENTS.md của nhóm từ trang Docs — đệm theo updatedAt (đổi phiên bản ⇒ đọc lại), gộp với cục bộ', async () => {
    const a = await DD.huongDanNhom(goc);
    expect(a).toMatchObject({ laAgents: true });
    expect(a!.noiDung).toMatch(/^## Vai trò/);
    expect(a!.nguon).toMatch(/LF-DOC-5 "agents\.md — Hướng dẫn cho CuongMini" · 2026-10-17/);
    await DD.huongDanNhom(goc);
    await DD.huongDanNhom(goc);
    expect(goiGhi.filter(([t]) => t === 'get_page')).toHaveLength(1); // đệm
    trang.updatedAt = '2026-10-18T10:00:00.000Z';
    DD._xoaDemDanDuong(); // hết 10 phút đệm danh sách trang (giả)
    await DD.huongDanNhom(goc);
    expect(goiGhi.filter(([t]) => t === 'get_page')).toHaveLength(2); // phiên bản mới ⇒ đọc lại
    const gop = await DD.ghiChuGop(goc, { ten: 'AGENTS.md', noiDung: '# Repo\n## Quy ước git\nNhánh feature/x.' });
    expect(gop!.ten).toBe('AGENTS.md + CT Work');
    expect(gop!.noiDung).toMatch(/Nhánh feature\/x/);
    expect(gop!.noiDung).not.toMatch(/Nhánh LF-số-tên/); // trùng mục ⇒ cục bộ thắng
    expect(gop!.noiDung).toMatch(/CuongMini là MENTOR/);
  });

  it('VIỆC 5: không có trang AGENTS.md ⇒ tự đọc trang tổng quan + sprint; Docs tắt ⇒ bỏ qua êm', async () => {
    trang.coAgents = false;
    const a = await DD.huongDanNhom(goc);
    expect(a).toMatchObject({ laAgents: false });
    expect(a!.noiDung).toMatch(/Bối cảnh dự án[\s\S]*Sprint hiện tại: Sprint 2[\s\S]*Hệ thống đặt phòng lab/);
    DD._xoaDemDanDuong();
    trang.docsTat = true;
    expect(await DD.huongDanNhom(goc)).toBeNull();
    expect(await DD.ghiChuGop(goc, null)).toBeNull();
  });

  it('VIỆC 6: hôm nay tự hiện MỘT lần mỗi ngày mỗi thư mục; hướng dẫn thẻ có phụ thuộc + nhánh remote', async () => {
    const a = await DD.homNay(goc, { tuDong: true });
    expect(a.truoc).toBe('LF-9');
    expect(a.md).toMatch(/☀ \*\*Hôm nay\*\* · LF · Sprint 2/);
    expect((await DD.homNay(goc, { tuDong: true })).boQua).toBe(true);
    expect((await DD.homNay(goc)).ok).toBe(true); // gọi tay thì luôn hiện
    const h = await DD.huongDan(goc, '18');
    expect(h.ok).toBe(true);
    expect(h.chan).toEqual(['LF-5']);
    expect(h.md).toMatch(/cần @longbui làm xong LF-5 trước\. Phần đó ở nhánh `origin\/LF-5-co-so`/);
    expect(goiGhi.some(([t]) => t === 'issue_guide')).toBe(true);
  });

  it('VIỆC 6/11: làm xong ⇒ gợi ý tự động MỘT lần mỗi HEAD; xem trước rồi mới ghi; chuyển trạng thái chỉ đích workflow cho phép; gắn chỉ đọc ⇒ không ghi', async () => {
    const a = await DD.goiYSau(goc, undefined, { tuDong: true });
    expect(a.key).toBe('LF-18');
    expect(a.goiY!.map((x) => x.id)).toContain('chuyen:Review');
    expect(a.md).toMatch(/PR https:\/\/github\.com\/x\/y\/pull\/7/);
    expect((await DD.goiYSau(goc, undefined, { tuDong: true })).boQua).toBe(true); // cùng HEAD ⇒ không nhắc lại
    head = 'bbb';
    expect((await DD.goiYSau(goc, undefined, { tuDong: true })).boQua).toBeUndefined(); // commit mới ⇒ gợi ý lại
    const ghiTruoc = goiGhi.filter(([t]) => ['comment', 'transition', 'chat_post'].includes(t)).length;
    const bl = await DD.xemTruocGoiY(goc, 'LF-18', 'binhLuan');
    expect(bl.noiDung).toMatch(/Bằng chứng — LF-18[\s\S]*PR: https:\/\/github\.com\/x\/y\/pull\/7/);
    const ch = await DD.xemTruocGoiY(goc, 'LF-18', 'chat');
    expect(ch.noiDung).toMatch(/@an pull về làm tiếp/);
    expect((await DD.xemTruocGoiY(goc, 'LF-18', 'chuyen:Archived')).ok).toBe(false); // không có trong workflow
    expect(goiGhi.filter(([t]) => ['comment', 'transition', 'chat_post'].includes(t)).length).toBe(ghiTruoc); // xem trước KHÔNG ghi
    expect((await DD.lamGoiY(goc, 'LF-18', 'chuyen:Review', '')).ok).toBe(true);
    expect(goiGhi.find(([t]) => t === 'transition')![1]).toMatchObject({ project: 'LF', issue: 'LF-18', to: 'Review' });
    await DD.lamGoiY(goc, 'LF-18', 'chat', 'Xong LF-18');
    expect(goiGhi.find(([t]) => t === 'chat_post')![1]).toMatchObject({ project: 'LF', channel: 'general', text: 'Xong LF-18' });
    // Gắn CHỈ ĐỌC ⇒ không gợi ý ghi, không ghi.
    await H.ghiGan(goc, { key: 'LF', projectId: 2, workspaceId: 3, quyen: 'doc' });
    head = 'ccc';
    const c = await DD.goiYSau(goc, 'LF-18');
    expect(c.goiY!.every((x) => !x.ghi)).toBe(true);
    expect((await DD.lamGoiY(goc, 'LF-18', 'chuyen:Review', '')).ok).toBe(false);
  });

  it('VIỆC 10: theo dõi — lần đầu chỉ lấy mốc, sau đó báo; ≥ 60 s mỗi lần; tắt ⇒ không gọi', async () => {
    expect((await DD.kiemTin(goc)).tin).toEqual([]); // mốc
    capNhat = { lastId: 5, events: [{ id: 4, type: 'WORK_MENTION', issue: 'LF-18', title: 'ERD', excerpt: null, by: '@gv' }], unblocked: [] };
    expect((await DD.kiemTin(goc)).tin).toEqual([]); // chưa đủ 60 s
    const r = await DD.kiemTin(goc, { epNgay: true });
    expect(r.tin).toEqual(['💬 @gv vừa nhắc bạn trong LF-18']);
    expect(goiGhi.filter(([t]) => t === 'my_updates').at(-1)![1]).toMatchObject({ afterId: 3, project: 'LF' });
    expect(await DD.theoDoiBat(false)).toBe(false);
    const n = goiGhi.length;
    expect((await DD.kiemTin(goc, { epNgay: true })).tin).toEqual([]);
    expect(goiGhi.length).toBe(n);
    await DD.theoDoiBat(true);
  });

  it('VIỆC 13: trưởng nhóm — tổng quan + tin nhắc (JQL quá hạn), không ghi gì', async () => {
    const r = await DD.tongQuan(goc);
    expect(r.ok).toBe(true);
    expect(r.md).toMatch(/Tổng quan nhóm/);
    expect(goiGhi.filter(([t]) => t === 'search_issues').map(([, a]) => a.jql)).toEqual(['statusCategory != Done ORDER BY due ASC', 'statusCategory != Done AND due < startOfDay()']);
    expect(goiGhi.some(([t]) => t === 'chat_post')).toBe(false);
  });

  it('VIỆC 4: gắn THEO PHIÊN (thư mục không phải repo) — không ghi file, dòng ngữ cảnh mang vai + chỉ đọc', async () => {
    const g2 = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-dot6-phien-'));
    H.ganTheoPhien(g2, { key: 'LF', projectId: 2, workspaceId: 3, vai: 'ADMIN', quyen: 'doc' });
    expect(await H.docGan(g2)).toMatchObject({ key: 'LF', theoPhien: true });
    await expect(fs.access(path.join(g2, '.cuongmini', 'ctwork.json'))).rejects.toThrow();
    expect(await H.nguCanhChoModel(g2)).toMatchObject({ key: 'LF', vai: 'ADMIN', chiDoc: true });
    H.ganTheoPhien(g2, null);
    expect(await H.docGan(g2)).toBeNull();
  });
});
