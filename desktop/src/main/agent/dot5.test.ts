/**
 * ĐỢT 5 — CT Work hệ sinh thái của CuongMini: phần thuần (`ctworkVe.ts`) + phần app tự làm (`ctworkHe.ts`)
 * với CT Work GIẢ (lời gọi MCP + git tiêm vào) — không mạng, không ghi CT Work thật.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const THU_MUC = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-dot5-'));
vi.mock('electron', () => ({ app: { getPath: () => THU_MUC, isPackaged: false, getVersion: () => '1' }, safeStorage: { isEncryptionAvailable: () => false } }));
vi.mock('../config', () => ({ API_ORIGIN: 'http://may-chu-gia.test', WEB_ORIGIN: 'http://web-gia.test', IS_DEV: true }));
let svGia: Array<{ ten: string; ok: boolean; soTool: number; loi?: string; tat?: boolean }> = [{ ten: 'ctwork', ok: true, soTool: 30 }];
vi.mock('./mcp', async (goc) => ({ ...(await goc<typeof import('./mcp')>()), trangThaiServer: () => svGia }));

const V = await import('./ctworkVe');
const H = await import('./ctworkHe');
const M = await import('./ctworkMauThu');

describe('ctworkVe — đọc kết quả CT Work (không đổ JSON thô)', () => {
  it('sprint_current ⇒ sprint đang chạy, nhóm theo CỘT trạng thái TODO → IN_PROGRESS → DONE, còn N ngày', () => {
    V.datNgonNgu('vi');
    const s = V.docSprint(M.mauSprintCurrent(5))!;
    expect(s.ten).toBe('Sprint 2');
    expect(s.tong).toBe(5);
    expect(V.soNgayToi(s.ketThuc)).toBe(5);
    expect(V.nhomTheoCot(s.the).map((c) => c.cot)).toEqual(['To Do', 'In Progress', 'Review', 'Done']);
    const md = V.veSprint(s, 'LF');
    expect(md).toMatch(/^\*\*Sprint 2\*\* · LF · còn 5 ngày/);
    expect(md).toMatch(/\*\*To Do\*\* · 2[\s\S]*`LF-19` API đăng nhập JWT · @cuong · 5pt/);
    expect(md).toMatch(/⚑ bị chặn/);
    expect(md).not.toMatch(/"category"|\{/);
    V.datNgonNgu('en');
    expect(V.veSprint(s, 'LF')).toMatch(/5 days left/);
    V.datNgonNgu('vi');
  });

  it('sprint_current không có ACTIVE ⇒ sprint `focus` (chưa chạy, đã tới ngày mà chưa Start)', () => {
    const s = V.docSprint(M.MAU_SPRINT_FOCUS)!;
    expect(s).toMatchObject({ ten: 'Sprint 1', laFocus: true, chuaBatDau: true, tong: 2 });
    expect(V.veSprint(s, 'LF')).toMatch(/chưa chạy — sprint trọng tâm[\s\S]*chưa ai bấm Start/);
  });

  it('my_work ⇒ hạn gần lên đầu (quá hạn trước), không hạn cuối', () => {
    const ds = V.sapViecToi(V.docViecToi(M.MAU_MY_WORK));
    expect(ds.map((v) => v.key)).toEqual(['LF-9', 'LF-18', 'LF-19', 'LF-30']);
    const md = V.veViecToi(V.docViecToi(M.MAU_MY_WORK), 'LF');
    expect(md).toMatch(/4 thẻ · 1 quá hạn/);
    expect(md.indexOf('LF-9')).toBeLessThan(md.indexOf('LF-19'));
  });

  it('get_issue ⇒ thẻ đẹp: tiêu đề, trạng thái, người làm, mô tả gọn, "Tự kiểm" (1/3), bình luận gần nhất, chuyển được', () => {
    const t = V.docThe(M.mauGetIssue('LF-18'))!;
    expect(t).toMatchObject({ key: 'LF-18', trangThai: 'In Progress', nguoiLam: '@cuong', soBinhLuan: 2 });
    expect(t.tuKiem).toHaveLength(3);
    expect(t.tuKiem.filter((x) => x.xong)).toHaveLength(1);
    expect(t.binhLuanCuoi).toMatchObject({ tacGia: '@gv', luc: '2026-10-17' });
    expect(t.chuyenDuoc).toEqual(['To Do', 'Review', 'Done']);
    const md = V.veThe(t);
    expect(md).toMatch(/^### LF-18 · Thiết kế ERD v1/);
    expect(md).toMatch(/\*\*Tự kiểm\*\* \(1\/3\)\n- \[x\] Có đủ 3 thực thể/);
    expect(md).toMatch(/Bình luận gần nhất\*\* \(2\) — @gv · 17\/10: Nhớ thêm bảng LabSlot/);
    expect(md).not.toMatch(/Tự kiểm tra \(Acceptance criteria\)/); // mục Tự kiểm không lặp lại trong mô tả
  });

  it('tóm tắt đính kèm: ≤ 1.500 ký tự, phần người viết BỌC rào untrusted', () => {
    const t = V.docThe(M.mauGetIssue('LF-18'))!;
    const k = V.tomTatDinhKem(t, 1500);
    expect(k.length).toBeLessThanOrEqual(1500);
    expect(k).toMatch(/^LF-18 · In Progress/);
    expect(k).toMatch(/<ctwork-content source="issue LF-18 \(summary\)" untrusted="true">[\s\S]*Tự kiểm[\s\S]*<\/ctwork-content>$/);
    const dai = { ...t, moTa: 'x'.repeat(5000), tuKiem: Array.from({ length: 20 }, (_, i) => ({ chu: `mục rất dài số ${i} `.repeat(10), xong: false })) };
    expect(V.tomTatDinhKem(dai, 1500).length).toBeLessThanOrEqual(1500);
  });

  it('nhắc thẻ trong câu: đúng key đã gắn, bỏ khối code, không trùng, tối đa 3', () => {
    expect(V.timKhoaThe('xem LF-18 với lf-19, LF-18 nữa, rồi LF-20 và LF-21', 'LF')).toEqual(['LF-18', 'LF-20', 'LF-21']);
    expect(V.timKhoaThe('`LF-5` trong code ```LF-6``` và XLF-7, LF-8x', 'LF')).toEqual([]);
    expect(V.timKhoaThe('FP-12 LF-3', 'FP')).toEqual(['FP-12']);
  });

  it('nhánh git ⇄ thẻ', () => {
    expect(V.tenNhanhChoThe('LF-18', 'Thiết kế ERD v1 (Lab, Booking, User)')).toBe('LF-18-thiet-ke-erd-v1-lab-booking-user');
    expect(V.theTuNhanh('LF-18-thiet-ke-erd', 'LF')).toBe('LF-18');
    expect(V.theTuNhanh('feature/LF-7_login', 'LF')).toBe('LF-7');
    expect(V.theTuNhanh('main', 'LF')).toBeNull();
    expect(V.theTuNhanh('XLF-7', 'LF')).toBeNull();
  });

  it('đoán dự án từ AGENTS.md của LabFlow ("Dự án **LF** (id 2) trong không gian **"LabFlow Studio"** (id 3)")', () => {
    const chu = '## 3. Kế hoạch\n- Dự án **LF** (id 2) trong không gian **"LabFlow Studio"** (id 3) trên cuongthai.com.';
    expect(V.doanDuAnTuTaiLieu(chu)).toEqual({ key: 'LF', projectId: 2, workspaceId: 3, workspace: 'LabFlow Studio' });
    /* Đợt 8A: chỉ khi tài liệu ghi RÕ mã dự án CT Work — đếm `LF-12` hay câu "project Foo" không còn đủ. */
    expect(V.doanDuAnTuTaiLieu('làm LF-1, LF-2 rồi LF-3; BR-01 BR-02 BR-03 BR-04')).toBeNull();
    expect(V.doanDuAnTuTaiLieu('This project README explains the API project. See ABC-1 ABC-2 ABC-3.')).toBeNull();
    expect(V.doanDuAnTuTaiLieu('- Dự án CT Work: **NT**')).toEqual({ key: 'NT', projectId: null, workspaceId: null, workspace: null });
    expect(V.doanDuAnTuTaiLieu('CT Work project key `LF`')?.key).toBe('LF');
    expect(V.doanDuAnTuTaiLieu('không có gì')).toBeNull();
  });

  it('thẻ duyệt GHI nói rõ thẻ nào, việc gì, nội dung gì', () => {
    expect(V.moTaGhi('comment', { project: 'LF', issue: 'LF-18', markdown: 'Đã vẽ ERD' })).toEqual({ the: 'LF-18', viec: 'Bình luận', noiDung: 'Đã vẽ ERD' });
    expect(V.moTaGhi('log_work', { project: 'LF', issue: 18, minutes: 90, note: 'vẽ ERD' })).toEqual({ the: 'LF-18', viec: 'Ghi giờ 1h 30m', noiDung: 'vẽ ERD' });
    expect(V.moTaGhi('transition', { project: 'labflow-studio/LF', issue: 18, to: 'In Progress' }).the).toBe('LF-18');
    expect(V.moTaGhi('update_issue', { project: 'LF', issue: 'LF-18', title: 'Mới' }).noiDung).toBe('title: Mới');
  });

  it('kết quả tool ⇒ tóm tắt một dòng + bảng gọn; lỗi ⇒ "lỗi: …"', () => {
    expect(V.tomTatKetQua('sprint_current', M.mauSprintCurrent(5))).toMatchObject({ tomTat: 'Sprint 2 · 5 thẻ · còn 5 ngày' });
    expect(V.tomTatKetQua('my_work', M.MAU_MY_WORK)!.tomTat).toBe('4 thẻ · 1 quá hạn');
    expect(V.tomTatKetQua('get_issue', M.mauGetIssue())!.tomTat).toMatch(/^LF-18 · Thiết kế ERD v1/);
    expect(V.tomTatKetQua('list_projects', M.MAU_LIST_PROJECTS)!.tomTat).toBe('1 dự án');
    expect(V.tomTatKetQua('comment', '{"commentId":5,"issue":"LF-18"}')!.tomTat).toBe('đã bình luận vào LF-18');
    expect(V.tomTatKetQua('get_issue', 'LỖI khi gọi get_issue: HTTP 401: token revoked', true)!.tomTat).toMatch(/^lỗi: /);
    for (const t of ['sprint_current', 'my_work', 'get_issue']) {
      const x = V.tomTatKetQua(t, t === 'sprint_current' ? M.mauSprintCurrent() : t === 'my_work' ? M.MAU_MY_WORK : M.mauGetIssue())!;
      expect(x.xemGon).toBeTruthy();
      expect(x.xemGon).not.toMatch(/"key":|<ctwork-content/);
    }
  });

  it('giờ người gõ ⇒ phút', () => {
    expect(V.docGio('1.5h')).toBe(90);
    expect(V.docGio('1h30')).toBe(90);
    expect(V.docGio('90m')).toBe(90);
    expect(V.docGio('2')).toBe(120);
    expect(V.docGio('45')).toBe(45);
    expect(V.docGio('abc')).toBeNull();
  });
});

describe('ctworkHe — app tự làm với CT Work GIẢ', () => {
  const goiGhi: Array<[string, Record<string, unknown>]> = [];
  const gitGhi: string[][] = [];
  let nhanh = 'LF-18-thiet-ke-erd';
  let goc = '';
  /* QA 5c: thẻ ĐÃ In Progress thì "bắt đầu" không chuyển trạng thái nữa — test chuyển trạng thái dùng thẻ To Do. */
  let theToDo = false;
  beforeEach(async () => {
    goiGhi.length = 0; gitGhi.length = 0; nhanh = 'LF-18-thiet-ke-erd'; theToDo = false;
    svGia = [{ ten: 'ctwork', ok: true, soTool: 30 }];
    H._xoaDem();
    goc = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-dot5-duan-'));
    await fs.writeFile(path.join(goc, 'AGENTS.md'), '- Dự án **LF** (id 2) trong không gian **"LabFlow Studio"** (id 3).');
    H._datPhuThuoc({
      goi: async (tool, args) => {
        goiGhi.push([tool, args]);
        await new Promise((r) => setTimeout(r, 5));
        const noiDung = tool === 'sprint_current' ? M.mauSprintCurrent(5) : tool === 'my_work' ? M.MAU_MY_WORK
          : tool === 'get_issue' ? (theToDo ? M.mauGetIssue(String(args.issue)).replace('Status: In Progress [IN_PROGRESS]', 'Status: To Do [TODO]').replace('Allowed transitions from here: To Do [TODO]', 'Allowed transitions from here: In Progress [IN_PROGRESS]') : M.mauGetIssue(String(args.issue))) : tool === 'list_projects' ? M.MAU_LIST_PROJECTS
            : tool === 'meeting_list' ? M.MAU_MEETINGS : tool === 'transition' ? '{"issue":"LF-18","status":"In Progress"}'
              : tool === 'comment' ? '{"commentId":9,"issue":"LF-18"}' : tool === 'log_work' ? '{"ok":true}'
                : tool === 'weekly_report_generate' ? '{"report":{"id":4,"weekStart":"2026-10-12","weekNo":2},"refreshed":false,"download":"https://cuongthai.com/x"}' : '';
        return { noiDung, loi: false };
      },
      git: async (args) => {
        gitGhi.push(args);
        if (args[0] === 'rev-parse' && args[1] === '--abbrev-ref') return { ok: true, ra: `${nhanh}\n` };
        if (args[0] === 'rev-parse' && args[1] === '--verify') return { ok: args.at(-1) === 'main', ra: '' };
        if (args[0] === 'symbolic-ref') return { ok: false, ra: '' };
        if (args[0] === 'log') return { ok: true, ra: 'abc1234 feat: ERD bản nháp\ndef5678 docs: thêm erd.png' };
        if (args[0] === 'diff' && args[1] === '--shortstat') return { ok: true, ra: ' 2 files changed, 40 insertions(+), 3 deletions(-)\n' };
        if (args[0] === 'diff' && args[1] === '--numstat') return { ok: true, ra: '30\t3\tdocs/erd.md\n10\t0\tdocs/erd.png\n' };
        if (args[0] === 'status') return { ok: true, ra: ' M README.md\n' };
        if (args[0] === 'checkout') return { ok: true, ra: '' };
        return { ok: false, ra: '', loi: 'không giả' };
      },
    });
  });

  it('chưa gắn ⇒ đoán từ AGENTS.md; gắn ⇒ .cuongmini/ctwork.json {workspaceId, projectId, key} + gợi ý .gitignore', async () => {
    expect(await H.docGan(goc)).toBeNull();
    expect(await H.doanGan(goc)).toMatchObject({ key: 'LF', projectId: 2, workspaceId: 3 });
    const ds = await H.dsDuAn();
    expect(ds.ds[0]).toMatchObject({ key: 'LF', id: 2, workspaceId: 3, workspace: 'LabFlow Studio' });
    const r = await H.ghiGan(goc, H.ganTuDuAn(ds.ds[0]!));
    const j = JSON.parse(await fs.readFile(path.join(goc, '.cuongmini', 'ctwork.json'), 'utf8'));
    expect(j).toMatchObject({ workspaceId: 3, projectId: 2, key: 'LF' });
    /* Đợt 6: thêm `vai` (myRole của list_projects) — vẫn KHÔNG có bí mật. */
    expect(Object.keys(j).sort()).toEqual(["_ghi_chu", "key", "projectId", "ten", "vai", "workspace", "workspaceId"]);
    expect(JSON.stringify(j)).not.toMatch(/ctw_[A-Za-z0-9]|Bearer|"token"/);
    expect(r.goiYGitignore).toMatch(/\.cuongmini\//);
    await fs.writeFile(path.join(goc, '.gitignore'), 'node_modules\n.cuongmini/\n');
    expect((await H.ghiGan(goc, H.ganTuDuAn(ds.ds[0]!))).goiYGitignore).toBeNull();
  });

  it('dòng trạng thái: sprint + còn N ngày + thẻ từ nhánh; sprint_current TỐI ĐA 1 lần / 5 phút (kể cả gọi song song)', async () => {
    await H.ghiGan(goc, { key: 'LF', projectId: 2, workspaceId: 3 });
    const truoc = H._demLanGoiSprint();
    const [a, b, c] = await Promise.all([H.dongTrangThai(goc), H.dongTrangThai(goc), H.dongTrangThai(goc)]);
    for (let i = 0; i < 5; i++) await H.dongTrangThai(goc);
    expect(H._demLanGoiSprint() - truoc).toBe(1);
    expect(a).toMatchObject({ key: 'LF', projectId: 2, the: 'LF-18', theTen: 'Thiết kế ERD v1 (Lab, Booking, User)', theTrangThai: 'In Progress', daNoi: true });
    expect(a!.sprint).toMatchObject({ ten: 'Sprint 2', conNgay: 5, laFocus: false, tong: 5 });
    expect(b).toEqual(a);
    expect(c).toEqual(a);
    // Hết 5 phút ⇒ đọc lại đúng một lần.
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(Date.now() + 5 * 60_000 + 1000);
    await H.dongTrangThai(goc);
    await H.dongTrangThai(goc);
    vi.useRealTimers();
    expect(H._demLanGoiSprint() - truoc).toBe(2);
  });

  it('chưa gắn ⇒ dòng tối giản "chưa chọn dự án" (20/10: không còn null khi đã nối); chưa nối ⇒ không gọi CT Work', async () => {
    expect(await H.dongTrangThai(goc)).toMatchObject({ key: '', daNoi: true, phamVi: 'chuaChon', sprint: null });
    await H.ghiGan(goc, { key: 'LF', projectId: 2, workspaceId: 3 });
    svGia = [];
    const d = await H.dongTrangThai(goc);
    expect(d).toMatchObject({ key: 'LF', daNoi: false, sprint: null });
    expect(goiGhi.filter(([t]) => t === 'sprint_current')).toHaveLength(0);
    expect((await H.xemSprint(goc)).loi).toMatch(/Chưa kết nối CT Work/);
  });

  it('`LF-123` trong câu ⇒ đính kèm ≤ 3 thẻ, mỗi thẻ ≤ 1.500 ký tự, đọc đệm (không gọi lại)', async () => {
    await H.ghiGan(goc, { key: 'LF', projectId: 2, workspaceId: 3 });
    const r = await H.dinhKemThe(goc, 'giải thích LF-18, LF-19, LF-20 và LF-21 giúp mình');
    expect(r.khoa).toEqual(['LF-18', 'LF-19', 'LF-20']);
    expect(r.chu).toMatch(/đã đính kèm tóm tắt thẻ CT Work/);
    for (const k of r.khoa) expect(r.chu).toContain(`source="issue ${k} (summary)"`);
    const khoi = r.chu.split(/\n\n(?=LF-\d+ · )/).slice(1);
    for (const x of khoi) expect(x.length).toBeLessThanOrEqual(1500);
    const n = goiGhi.filter(([t]) => t === 'get_issue').length;
    await H.dinhKemThe(goc, 'còn LF-18 thì sao');
    expect(goiGhi.filter(([t]) => t === 'get_issue').length).toBe(n);
    expect((await H.dinhKemThe(goc, 'không nhắc thẻ nào')).khoa).toEqual([]);
  });

  it('menu: sprint · việc của tôi · mở thẻ · họp đọc đúng tool với project = key đã gắn', async () => {
    await H.ghiGan(goc, H.ganTuDuAn((await H.dsDuAn()).ds[0]!));
    expect((await H.xemSprint(goc)).md).toMatch(/\*\*Sprint 2\*\*/);
    const v = await H.xemViecToi(goc);
    expect(v.md).toMatch(/Việc của tôi/);
    expect(v.dsThe![0]!.key).toBe('LF-9');
    expect((await H.xemThe(goc, '18')).md).toMatch(/### LF-18/);
    expect((await H.xemHop(goc)).md).toMatch(/Sắp tới[\s\S]*M-3/);
    expect(goiGhi.every(([, a]) => !('project' in a) || a.project === 'LF')).toBe(true);
  });

  it('bắt đầu làm thẻ: xem trước (không ghi) rồi tạo nhánh + chuyển In Progress', async () => {
    nhanh = 'main';
    theToDo = true;
    await H.ghiGan(goc, { key: 'LF', projectId: 2, workspaceId: 3 });
    const cb = await H.chuanBiBatDau(goc, 'LF-18');
    expect(cb).toMatchObject({ ok: true, key: 'LF-18', nhanh: 'LF-18-thiet-ke-erd-v1-lab-booking-user', nhanhCo: false, nhanhNay: 'main' });
    expect(goiGhi.some(([t]) => t === 'transition')).toBe(false);
    const r = await H.batDauThe(goc, 'LF-18', { nhanh: true, chuyen: true });
    expect(r.ok).toBe(true);
    expect(gitGhi).toContainEqual(['checkout', '-b', 'LF-18-thiet-ke-erd-v1-lab-booking-user']);
    expect(goiGhi.find(([t]) => t === 'transition')![1]).toMatchObject({ project: 'LF', issue: 'LF-18' });
  });

  it('bình luận bằng chứng soạn từ git (commit, file đổi, chưa commit) — không gửi khi chưa đồng ý', async () => {
    await H.ghiGan(goc, { key: 'LF', projectId: 2, workspaceId: 3 });
    const s = await H.soanBinhLuan(goc, undefined);
    expect(s.key).toBe('LF-18');
    expect(s.noiDung).toMatch(/Bằng chứng — LF-18[\s\S]*`abc1234` feat: ERD bản nháp[\s\S]*`docs\/erd.md` \(\+30 −3\)[\s\S]*Chưa commit: 1 file/);
    expect(goiGhi.some(([t]) => t === 'comment')).toBe(false);
    await H.guiBinhLuan(goc, 'LF-18', s.noiDung!);
    expect(goiGhi.find(([t]) => t === 'comment')![1]).toMatchObject({ issue: 'LF-18', markdown: s.noiDung });
  });

  it('ghi giờ + báo cáo tuần đi đúng tool, kiểm biên', async () => {
    await H.ghiGan(goc, { key: 'LF', projectId: 2, workspaceId: 3 });
    expect((await H.ghiGio(goc, 'LF-18', 0, '')).ok).toBe(false);
    expect((await H.ghiGio(goc, 'LF-18', 90, 'vẽ ERD')).md).toMatch(/90 phút vào LF-18/);
    expect(goiGhi.find(([t]) => t === 'log_work')![1]).toMatchObject({ minutes: 90, note: 'vẽ ERD', issue: 'LF-18' });
    expect((await H.baoCaoTuan(goc)).md).toMatch(/Báo cáo tuần #2[\s\S]*https:\/\/cuongthai.com\/x/);
  });

  it('ngữ cảnh cho model: key + id + thẻ của nhánh (không bí mật)', async () => {
    await H.ghiGan(goc, { key: 'LF', projectId: 2, workspaceId: 3, ten: 'LabFlow AI', workspace: 'LabFlow Studio' });
    expect(await H.nguCanhChoModel(goc)).toEqual({ key: 'LF', projectId: 2, workspaceId: 3, ten: 'LabFlow AI', workspace: 'LabFlow Studio', the: 'LF-18' });
  });
});
