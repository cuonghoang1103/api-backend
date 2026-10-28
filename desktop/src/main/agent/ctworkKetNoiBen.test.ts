/**
 * 20/10/2026 — CT Work "nối một lần, dùng mãi, làm ngầm":
 *   • phạm vi MẶC ĐỊNH của máy (tất cả · workspace · dự án) — dòng trạng thái / ngữ cảnh model / nhắc `KEY-123`;
 *   • kho token: hỏng giải mã ⇒ báo cấp lại (không nuốt im); cấp lại mặc định đọc + ghi; lõi ngoài app dùng chung kho;
 *   • trình duyệt nhắm giao diện CT Work ⇒ từ chối, chỉ đường tool ngầm;
 *   • `attach_file { path }` ⇒ CuongMini tự đọc file (nhà tù đường dẫn), ≤ 6 MB base64, lớn hơn ⇒ URL ký sẵn + attach_complete;
 *   • ảnh dán trong chat ⇒ file + ghi chú đường dẫn.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const THU_MUC = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-ben-'));
const appGia: { getPath: () => string; isPackaged: boolean; getVersion: () => string; laLoiDocLap?: boolean } = { getPath: () => THU_MUC, isPackaged: false, getVersion: () => '1' };
let giaiMaHong = false;
vi.mock('electron', () => ({
  app: appGia,
  safeStorage: {
    isEncryptionAvailable: () => true,
    encryptString: (s: string) => Buffer.from(`enc:${s}`),
    decryptString: (b: Buffer) => { if (giaiMaHong) throw new Error('Error while decrypting the ciphertext provided to safeStorage.decryptString.'); return b.toString().replace(/^enc:/, ''); },
  },
}));
vi.mock('../config', () => ({ API_ORIGIN: 'http://may-chu-gia.test', WEB_ORIGIN: 'http://web-gia.test', IS_DEV: true }));
let svGia: Array<{ ten: string; ok: boolean; soTool: number; loi?: string; tat?: boolean }> = [{ ten: 'ctwork', ok: true, soTool: 30 }];
vi.mock('./mcp', async (goc) => ({ ...(await goc<typeof import('./mcp')>()), trangThaiServer: () => svGia, napLaiMotServer: async () => ({ tool: [], server: [] }) }));

const H = await import('./ctworkHe');
const K = await import('./ctworkKetNoi');
const W = await import('./ctworkChanWeb');
const D = await import('./ctworkDinhKem');
const V = await import('./ctworkVe');
const M = await import('./ctworkMauThu');
const mcp = await import('./mcp');
const { setSetting } = await import('../store');

describe('phạm vi CT Work MẶC ĐỊNH của máy', () => {
  const goi: Array<[string, Record<string, unknown>]> = [];
  beforeEach(() => {
    goi.length = 0;
    svGia = [{ ten: 'ctwork', ok: true, soTool: 30 }];
    H._xoaDem(); H._xoaDemKey();
    setSetting('ctworkMacDinh', '');
    H._datPhuThuoc({
      goi: async (tool, args) => {
        goi.push([tool, args]);
        const noiDung = tool === 'list_projects' ? M.MAU_LIST_PROJECTS : tool === 'get_issue' ? M.mauGetIssue(String(args.issue)) : tool === 'sprint_current' ? M.mauSprintCurrent(5) : '';
        return { noiDung, loi: false };
      },
      git: async () => ({ ok: false, ra: '', loi: 'không phải repo' }),
    });
  });

  it('chưa chọn ⇒ dòng tối giản "chưa chọn dự án"; tất cả / workspace ⇒ dòng nói phạm vi; không nối + không token ⇒ null', async () => {
    expect(await H.dongTrangThai(null)).toMatchObject({ key: '', daNoi: true, phamVi: 'chuaChon' });
    H.ghiMacDinh({ tatCa: true });
    expect(H.docMacDinh()).toEqual({ tatCa: true });
    expect(await H.dongTrangThai(null)).toMatchObject({ key: '', phamVi: 'tatCa' });
    H.ghiMacDinh({ workspaceId: 3, workspace: 'LabFlow Studio' });
    expect(await H.dongTrangThai('/khong/co/thu/muc')).toMatchObject({ key: '', phamVi: 'workspace', workspace: 'LabFlow Studio' });
    svGia = [];
    expect(await H.dongTrangThai(null)).toBeNull();
  });

  it('một dự án mặc định ⇒ dùng được KHÔNG cần thư mục (CLI ở ~): dòng trạng thái + ngữ cảnh model + menu đọc đúng dự án', async () => {
    H.ghiMacDinh({ key: 'LF', projectId: 2, workspaceId: 3, ten: 'LabFlow AI', workspace: 'LabFlow Studio' });
    expect(await H.ganCo(null)).toMatchObject({ key: 'LF', projectId: 2, macDinh: true });
    const d = await H.dongTrangThai(null);
    expect(d).toMatchObject({ key: 'LF', projectId: 2, daNoi: true, nhanh: null });
    expect(d!.sprint).toMatchObject({ ten: 'Sprint 2' });
    expect(await H.nguCanhChoModel(null)).toMatchObject({ key: 'LF', projectId: 2, workspaceId: 3 });
    expect((await H.xemSprint(null)).ok).toBe(true);
    // git không bao giờ chạy ở thư mục của tiến trình khi không có thư mục dự án.
    expect((await H.batDauThe(null, 'LF-18', { nhanh: true, chuyen: false })).ok).toBe(false);
  });

  it('tất cả / workspace ⇒ model được báo phạm vi (không key) và `KEY-123` của MỌI dự án được đính kèm', async () => {
    H.ghiMacDinh({ tatCa: true });
    const n = await H.nguCanhChoModel(null);
    expect(n).toEqual({ phamVi: 'tatCa' });
    expect(H.ghiChuPhamVi(n)).toMatch(/MỌI dự án[\s\S]*list_projects[\s\S]*mcp__ctwork__[\s\S]*không mở trình duyệt/);
    const r = await H.dinhKemThe(null, 'giải thích LF-18 giúp mình');
    expect(r.khoa).toEqual(['LF-18']);
    expect(goi.some(([t, a]) => t === 'get_issue' && a.issue === 'LF-18' && a.project === 'LF')).toBe(true);
    H.ghiMacDinh({ workspaceId: 99, workspace: 'Khác' });
    H._xoaDem();
    expect((await H.dinhKemThe(null, 'LF-19 là gì')).khoa).toEqual([]); // LF thuộc workspace 3, không phải 99
    expect(H.ghiChuPhamVi(await H.nguCanhChoModel(null))).toMatch(/workspace "Khác" \(id 99\)/);
  });

  it('đã có phạm vi máy ⇒ không hỏi "Gắn thư mục với KEY?" nữa; xoá phạm vi ⇒ hỏi lại như cũ', async () => {
    const goc = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-ben-duan-'));
    H.ghiMacDinh({ tatCa: true });
    expect(await H.khopKeyChuaGan(goc, 'xem LF-18')).toBeNull();
    H.ghiMacDinh(null);
    H._xoaDemKey();
    expect(await H.khopKeyChuaGan(goc, 'xem LF-18')).toMatchObject({ key: 'LF', projectId: 2 });
  });

  it('thư mục nhà ⇒ laThuMucNha; cài đặt hỏng ⇒ như chưa chọn', () => {
    expect(H.laThuMucNha(os.homedir())).toBe(true);
    expect(H.laThuMucNha(path.join(os.homedir(), 'x'))).toBe(false);
    setSetting('ctworkMacDinh', '{hỏng');
    expect(H.docMacDinh()).toBeNull();
  });
});

describe('câu hỏi lúc mở CuongMini (goiY)', () => {
  const co = { canCapLai: false, coToken: true, sv: { ok: true }, khongHoi: false, coPhamVi: false, daHoiThuMuc: false, doan: async () => null };
  it('chưa có token ⇒ "kết nối?" (kể cả người từng trả lời "Có" ở bản cũ); "Không hỏi lại" ⇒ chỉ gợi ý nhẹ', async () => {
    expect(await H.chonCauHoiLucMo({ ...co, coToken: false, sv: null })).toEqual({ ok: true, hoi: 'ketNoi' });
    expect(await H.chonCauHoiLucMo({ ...co, coToken: false, sv: null, khongHoi: true })).toEqual({ ok: true, hoi: null, goiYNhe: true });
    // Có token mà server bị "Tắt hẳn" (cờ disabled cũ) ⇒ hỏi nối lại (nối lại gỡ cờ).
    expect((await H.chonCauHoiLucMo({ ...co, sv: { ok: false, tat: true } })).hoi).toBe('ketNoi');
  });
  it('token hỏng ⇒ cấp lại; đã nối mà chưa có phạm vi ⇒ AGENTS.md đoán được thì "gắn?", không thì chọn phạm vi; có phạm vi/đã hỏi ⇒ im', async () => {
    expect((await H.chonCauHoiLucMo({ ...co, canCapLai: true })).hoi).toBe('capLai');
    expect((await H.chonCauHoiLucMo(co)).hoi).toBe('chonDuAn');
    expect(await H.chonCauHoiLucMo({ ...co, doan: async () => ({ key: 'LF', projectId: 2, workspaceId: 3, workspace: null }) })).toMatchObject({ hoi: 'ganDuAn', doan: { key: 'LF' } });
    expect((await H.chonCauHoiLucMo({ ...co, coPhamVi: true })).hoi).toBeNull();
    expect((await H.chonCauHoiLucMo({ ...co, daHoiThuMuc: true })).hoi).toBeNull();
    expect((await H.chonCauHoiLucMo({ ...co, sv: { ok: false } })).hoi).toBeNull(); // đang nối / lỗi mạng ⇒ không chen thẻ
  });
});

describe('kho token CT Work', () => {
  beforeEach(async () => {
    giaiMaHong = false;
    delete appGia.laLoiDocLap;
    delete process.env.CTWORK_TOKEN;
    await fs.rm(path.join(THU_MUC, 'bi-mat'), { recursive: true, force: true });
  });

  it('không giải mã được ⇒ KHÔNG nuốt im: canCapLai + trạng thái báo kho hỏng', async () => {
    await fs.mkdir(path.join(THU_MUC, 'bi-mat'), { recursive: true });
    await fs.writeFile(path.join(THU_MUC, 'bi-mat', 'ctwork.bin'), Buffer.concat([Buffer.from('MAH1'), Buffer.from('enc:{"token":"ctw_x","id":5,"quyen":"ghi","luc":1}')]));
    expect((await K.docBiMat())?.token).toBe('ctw_x');
    expect(await K.canCapLai()).toBe(false);
    giaiMaHong = true;
    const canh = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    expect(await K.docBiMat()).toBeNull();
    expect(K.khoBiMatHong()).toBe(true);
    expect(await K.canCapLai()).toBe(true);
    expect((await K.trangThaiCtwork()).khoHong).toBe(true);
    expect(canh).toHaveBeenCalled();
    canh.mockRestore();
  });

  it('cấp lại khi không biết quyền cũ ⇒ ĐỌC + GHI (scopes read+write)', async () => {
    const than: unknown[] = [];
    const f = vi.spyOn(globalThis, 'fetch').mockImplementation(async (_u, init) => {
      than.push(JSON.parse(String((init as RequestInit).body ?? '{}')));
      return new Response(JSON.stringify({ data: { token: 'ctw_moi', id: 9 } }), { status: 201 });
    });
    await K.capLaiCtwork('phien');
    expect(than.at(-1)).toMatchObject({ scopes: ['read', 'write'] });
    expect((await K.docBiMat())?.quyen).toBe('ghi');
    f.mockRestore();
  });

  it('lõi ngoài app (CLI/VS Code) ⇒ kho CHUNG ~/.cuongmini/data/bi-mat; token cũ ở kho riêng được chép sang', async () => {
    const nha = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-ben-home-'));
    const cu = process.env.CUONGMINI_HOME;
    process.env.CUONGMINI_HOME = nha;
    try {
      appGia.laLoiDocLap = true;
      await fs.mkdir(path.join(THU_MUC, 'bi-mat'), { recursive: true });
      await fs.writeFile(path.join(THU_MUC, 'bi-mat', 'ctwork.bin'), JSON.stringify({ token: 'ctw_vsc', id: 1, quyen: 'ghi', luc: 1 }));
      expect((await K.docBiMat())?.token).toBe('ctw_vsc');
      expect(JSON.parse(await fs.readFile(path.join(nha, 'data', 'bi-mat', 'ctwork.bin'), 'utf8')).token).toBe('ctw_vsc');
    } finally {
      if (cu === undefined) delete process.env.CUONGMINI_HOME; else process.env.CUONGMINI_HOME = cu;
      delete appGia.laLoiDocLap;
    }
  });
});

describe('không mở giao diện CT Work bằng trình duyệt', () => {
  it('QA 20/10: không lách được bằng dấu chấm cuối, // hay %77; /work/share công khai không chặn', () => {
    for (const u of ['https://cuongthai.com./work/x', 'https://cuongthai.com//work/x', 'https://cuongthai.com/%77ork/x', 'https://CUONGTHAI.com/WORK']) expect(W.laTrangCtworkWeb(u)).toBe(true);
    expect(W.laTrangCtworkWeb('https://cuongthai.com/work/share/abc')).toBe(false);
  });

  it('nhận đúng trang /work (cuongthai.com · localhost · máy chủ đang nối · app://); /api và trang khác thì không', () => {
    for (const u of ['https://cuongthai.com/work', 'https://cuongthai.com/work/lf/issues/NT-13', 'cuongthai.com/work/x', 'https://www.cuongthai.com/work/', 'http://may-chu-gia.test/work/a', 'app://cuongthai/work/x']) {
      expect(W.laTrangCtworkWeb(u), u).toBe(true);
    }
    for (const u of ['https://cuongthai.com/api/v1/work/files/1/download', 'https://cuongthai.com/workshop', 'https://github.com/work', 'https://cuongthai.com/courses', '', null]) {
      expect(W.laTrangCtworkWeb(u), String(u)).toBe(false);
    }
  });

  it('web_mo/trinh_duyet_hien theo url; web_doc/web_bam… theo trang đang mở; câu từ chối chỉ đường đúng', () => {
    expect(W.chanWebCtwork('web_mo', { url: 'https://cuongthai.com/work/lf' }, '', true)).toMatch(/mcp__ctwork__[\s\S]*attach_file/);
    expect(W.chanWebCtwork('web_mo', { url: 'https://cuongthai.com/work/lf' }, '', false)).toMatch(/gõ \/ctwork/);
    expect(W.chanWebCtwork('web_doc', {}, 'https://cuongthai.com/work/lf/board', true)).toMatch(/TỪ CHỐI/);
    expect(W.chanWebCtwork('web_bam', { bo_chon: '#x' }, 'https://cuongthai.com/work/a', true)).toMatch(/TỪ CHỐI/);
    expect(W.chanWebCtwork('web_bam', { bo_chon: '#x' }, 'http://localhost:3000/work/a', true)).toBeNull(); // dev local không chặn
    expect(W.chanWebCtwork('trinh_duyet_hien', {}, 'https://cuongthai.com/work', true)).toMatch(/TỪ CHỐI/);
    expect(W.chanWebCtwork('trinh_duyet_hien', { an: true }, 'https://google.com', true)).toBeNull();
    expect(W.chanWebCtwork('web_doc', {}, 'https://google.com', true)).toBeNull();
    expect(W.chanWebCtwork('web_mo', { url: 'https://cuongthai.com/courses' }, 'https://cuongthai.com/work', true)).toBeNull();
    expect(W.chanWebCtwork('web_console', {}, 'https://cuongthai.com/work', true)).toBeNull();
    expect(W.chanWebCtwork('read_file', { path: 'a' }, 'https://cuongthai.com/work', true)).toBeNull();
  });
});

describe('attach_file { path } — CuongMini tự đọc file', () => {
  it('đường dẫn: tương đối trong dự án · tuyệt đối trong dự án / thư mục ảnh dán; ngoài ⇒ lỗi chỉ cách kéo vào; .env bị chặn', async () => {
    const goc = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-ben-tep-'));
    await fs.mkdir(path.join(goc, 'docs'));
    await fs.writeFile(path.join(goc, 'docs', 'erd.png'), Buffer.from([137, 80, 78, 71, 1, 2, 3]));
    await fs.writeFile(path.join(goc, '.env'), 'X=1');
    const t = await D.timTepDinhKem('docs/erd.png', { goc });
    expect(t).toMatchObject({ ten: 'erd.png', loai: 'image/png', kichThuoc: 7 });
    expect((await D.timTepDinhKem(path.join(goc, 'docs', 'erd.png'), { goc })).ten).toBe('erd.png');
    const [anh] = await D.luuAnhChat(['data:image/png;base64,iVBORw0KGgo='], path.join(THU_MUC, 'dinh-kem'));
    expect((await D.timTepDinhKem(anh!, { goc: null })).loai).toBe('image/png');
    await expect(D.timTepDinhKem('/etc/hosts', { goc })).rejects.toThrow(/xin_quyen_thu_muc/);
    await expect(D.timTepDinhKem('.env', { goc })).rejects.toThrow(/khoá hoặc mật khẩu/);
    await expect(D.timTepDinhKem('../x.png', { goc })).rejects.toThrow(/ngoài thư mục dự án/);
  });

  it('≤ 6 MB ⇒ MỘT lời gọi attach_file có base64, fileName/contentType tự điền, không còn `path`', async () => {
    const goc = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-ben-tep2-'));
    await fs.writeFile(path.join(goc, 'log.txt'), 'xin chào');
    const tep = await D.timTepDinhKem('log.txt', { goc });
    const goi: Array<[string, Record<string, unknown>]> = [];
    const r = await D.guiTepLenCtwork({ project: 'NT', issue: 'NT-13', path: 'log.txt' }, tep, async (tool, a) => { goi.push([tool, a]); return { noiDung: '{"attachmentId":7}', loi: false }; });
    expect(r.loi).toBe(false);
    expect(goi).toHaveLength(1);
    expect(goi[0]![1]).toEqual({ project: 'NT', issue: 'NT-13', fileName: 'log.txt', contentType: 'text/plain', base64: Buffer.from('xin chào').toString('base64') });
  });

  it('> 6 MB ⇒ attach_file{sizeBytes} ⇒ PUT đúng header lên URL ký sẵn ⇒ attach_complete (giữ for/testRun)', async () => {
    const goc = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-ben-tep3-'));
    await fs.writeFile(path.join(goc, 'video.mp4'), Buffer.alloc(D.TRAN_INLINE + 10, 1));
    const tep = await D.timTepDinhKem('video.mp4', { goc });
    const goi: Array<[string, Record<string, unknown>]> = [];
    const put: Array<{ url: string; headers: Record<string, string>; n: number }> = [];
    const r = await D.guiTepLenCtwork({ project: 'NT', issue: 13, path: 'video.mp4', for: 'comment' }, tep, async (tool, a) => {
      goi.push([tool, a]);
      if (tool === 'attach_file') return { noiDung: JSON.stringify({ presign: { url: 'https://r2.test/up?sig=1', key: 'work/k1', headers: { 'Content-Type': 'video/mp4' }, method: 'PUT' } }), loi: false };
      return { noiDung: '{"attachmentId":8,"for":"comment"}', loi: false };
    }, async (url, o) => { put.push({ url, headers: o.headers, n: o.than.length }); return { ok: true, status: 200 }; });
    expect(r).toEqual({ noiDung: '{"attachmentId":8,"for":"comment"}', loi: false });
    expect(goi[0]![1]).toMatchObject({ project: 'NT', issue: 13, fileName: 'video.mp4', contentType: 'video/mp4', sizeBytes: D.TRAN_INLINE + 10, for: 'comment' });
    expect(goi[0]![1].base64).toBeUndefined();
    expect(put).toEqual([{ url: 'https://r2.test/up?sig=1', headers: { 'Content-Type': 'video/mp4' }, n: D.TRAN_INLINE + 10 }]);
    expect(goi[1]).toEqual(['attach_complete', { project: 'NT', issue: 13, key: 'work/k1', fileName: 'video.mp4', for: 'comment' }]);
    // PUT hỏng ⇒ báo lỗi, không gọi attach_complete.
    goi.length = 0;
    const r2 = await D.guiTepLenCtwork({ project: 'NT', issue: 13 }, tep, async (tool) => ({ noiDung: tool === 'attach_file' ? '{"presign":{"url":"https://r2.test/u","key":"k"}}' : '{}', loi: false }), async () => ({ ok: false, status: 403, loi: 'SignatureDoesNotMatch' }));
    expect(r2.loi).toBe(true);
    expect(r2.noiDung).toMatch(/HTTP 403/);
  });

  it('thẻ duyệt: tên + cỡ, KHÔNG BAO GIỜ đổ base64', () => {
    V.datNgonNgu('vi');
    const hien = D.thamSoHien({ project: 'NT', issue: 'NT-13', fileName: 'a.png', contentType: 'image/png', base64: 'A'.repeat(40_000) });
    expect(JSON.stringify(hien)).not.toMatch(/AAAA/);
    const x = V.moTaGhi('attach_file', D.thamSoHien({ project: 'NT', issue: 'NT-13', fileName: 'erd.png', contentType: 'image/png', path: 'docs/erd.png' }, { duong: '/x/docs/erd.png', ten: 'erd.png', loai: 'image/png', kichThuoc: 2_500_000 }));
    expect(x).toMatchObject({ the: 'NT-13', viec: 'Đính kèm tệp' });
    expect(x.noiDung).toMatch(/^erd\.png · 2\.4 MB · image\/png\ndocs\/erd\.png$/);
    expect(V.moTaGhi('attach_from_url', { project: 'NT', issue: 'NT-13', url: 'https://docs.google.com/document/d/x', image: 2 })).toMatchObject({ the: 'NT-13', viec: 'Đính kèm từ link (ảnh số 2)', noiDung: 'https://docs.google.com/document/d/x' });
  });

  it('21/10/2026 — lệnh XOÁ (destructiveHint) ⇒ thẻ duyệt mở đầu bằng cảnh báo xoá', () => {
    V.datNgonNgu('vi');
    const x = V.moTaGhi('fpt_unit_delete_cases', { project: 'LF', function: 'AuthService.verifyEmail', notRun: true }, true);
    expect(x.viec).toBe('⚠ XOÁ · fpt_unit_delete_cases');
    expect(x.noiDung).toMatch(/notRun/);
    expect(V.moTaGhi('comment', { project: 'LF', issue: 3, markdown: 'hi' }).viec).toBe('Bình luận');
    V.datNgonNgu('en');
    expect(V.moTaGhi('issue_delete', { project: 'LF', issue: 3 }, true)).toMatchObject({ the: 'LF-3', viec: '⚠ DELETE · issue_delete' });
    V.datNgonNgu('vi');
  });

  it('schema gửi model: attach_file có `path`, fileName/contentType thành tuỳ chọn; tool khác giữ nguyên', () => {
    const t = { ten: 'mcp__ctwork__attach_file', server: 'ctwork', tenGoc: 'attach_file', moTa: 'Attaches a file', thamSo: { type: 'object', properties: { project: {}, issue: {}, fileName: {}, contentType: {}, base64: {} }, required: ['project', 'issue', 'fileName', 'contentType'] } };
    const c = mcp.chinhSchemaCtw(t);
    expect((c.thamSo as { properties: Record<string, { description?: string }> }).properties.path!.description).toMatch(/CuongMini reads it/);
    expect((c.thamSo as { required: string[] }).required).toEqual(['project', 'issue']);
    expect(c.moTa).toMatch(/pass `path`/);
    const k = { ...t, tenGoc: 'comment' };
    expect(mcp.chinhSchemaCtw(k)).toBe(k);
  });

  it('ảnh dán trong chat ⇒ lưu file 0600 + ghi chú đường dẫn cho model; data URL hỏng bị bỏ qua', async () => {
    const tm = path.join(THU_MUC, 'dinh-kem-2');
    const ds = await D.luuAnhChat(['data:image/jpeg;base64,/9j/4AAQ', 'không phải data url', 'data:image/png;base64,'], tm);
    expect(ds).toHaveLength(1);
    expect(ds[0]).toMatch(/\.jpg$/);
    expect((await fs.stat(ds[0]!)).mode & 0o777).toBe(0o600);
    expect(D.ghiChuAnhChat(ds)).toMatch(/ảnh người dùng dán đã lưu trên máy: .*\.jpg — cần đính kèm lên CT Work thì gọi attach_file với `path`/);
    expect(D.ghiChuAnhChat([])).toBe('');
  });
});
