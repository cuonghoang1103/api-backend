/**
 * ĐỢT 4 (18/10/2026) — lõi: điều khiển máy tính (tầng gọi HĐH là GIẢ — không bấm/gõ thật), LUÔN hỏi,
 * cron + hẹn sống qua lúc tắt, LSP (server giả qua stdio), gộp agent phụ bằng git merge + file nhị phân,
 * chạy notebook (jupyter giả), hook truocNen/thongBao.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it, vi } from 'vitest';

const thuMucApp = mkdtempSync(path.join(os.tmpdir(), 'ct-dot4-app-'));
vi.mock('electron', () => ({ app: { getPath: () => thuMucApp, isPackaged: false } }));

const may = await import('./mayTinh');
const { hoiNguoiDung, traLoi } = await import('./xinPhep');
const { taoSoCuoc } = await import('./so');
const { docCron, lanKe } = await import('./cron');
const hen = await import('./choHen');
const lsp = await import('./lsp');
const { gopBangMerge, gopVaoGoc, taoKhuPhu, thayDoiCuaKhu, donKhu } = await import('./viecPhuGhi');
const nb = await import('./notebookChay');
const { chayHook, quenDemHook } = await import('./hook');

const git = (cwd: string, ...a: string[]): string => execFileSync('git', a, { cwd, encoding: 'utf8' });

/** Ảnh PNG giả: đủ phần đầu để đọc kích thước. */
function pngGia(rong: number, cao: number): Buffer {
  const b = Buffer.alloc(33);
  b.writeUInt32BE(0x89504e47, 0); b.writeUInt32BE(0x0d0a1a0a, 4); b.writeUInt32BE(13, 8); b.write('IHDR', 12);
  b.writeUInt32BE(rong, 16); b.writeUInt32BE(cao, 20);
  return b;
}

describe('điều khiển máy tính — tầng HĐH GIẢ', () => {
  it('docToHop: tổ hợp hợp lệ, ký hiệu ⌘⇧, lỗi rõ', () => {
    expect(may.docToHop('cmd+shift+t')).toEqual({ phim: 't', bo: ['cmd', 'shift'] });
    expect(may.docToHop('⌘ + c')).toEqual({ phim: 'c', bo: ['cmd'] });
    expect(may.docToHop('Enter')).toEqual({ phim: 'enter', bo: [] });
    expect(may.docToHop('hyper+x')).toMatch(/bổ trợ/);
    expect(may.docToHop('ctrl+F99')).toMatch(/không có/);
  });

  it('macOS: chụp ⇒ toạ độ ẢNH quy về ĐIỂM màn hình (Retina), bấm đi qua JXA CGEvent — không gì chạy thật', async () => {
    const goi: Array<[string, string[]]> = [];
    may._datChay(async (lenh, args) => {
      goi.push([lenh, args]);
      if (lenh === 'screencapture') { writeFileSync(args[args.length - 1]!, pngGia(1280, 800)); return { ma: 0, ra: '', loi: '' }; }
      if (lenh === 'osascript') {
        const ma = args[3]!;
        if (ma.includes('CGPreflightScreenCaptureAccess')) return { ma: 0, ra: '{"chup":true,"dieuKhien":true}', loi: '' };
        if (ma.includes('NSScreen')) return { ma: 0, ra: '{"w":1440,"h":900}', loi: '' };
        return { ma: 0, ra: 'ok', loi: '' };
      }
      return { ma: 0, ra: '', loi: '' };
    }, 'darwin');
    expect((await may.bam(10, 10)).ok).toBe(false); // chưa chụp ⇒ từ chối bấm mù
    const c = await may.chupManHinh();
    expect(c.ok).toBe(true);
    if (c.ok) { expect(c.rong).toBe(1280); expect(c.anh?.media_type).toBe('image/png'); }
    const r = await may.bam(640, 400, 'phai', true);
    expect(r.ok).toBe(true);
    const lan = goi.filter(([l, a]) => l === 'osascript' && a[3] === may.JXA_CHUOT).at(-1)!;
    expect(lan[1].slice(4)).toEqual(['720', '450', '1', '2']); // 640×(1440/1280)=720, nút phải=1, nhấp đúp
    expect(goi.some(([l]) => l === 'sips')).toBe(false); // ảnh đã ≤1280 ⇒ không thu nhỏ
    const p = await may.phim('cmd+c');
    expect(p.ok).toBe(true);
    const lp = goi.filter(([, a]) => a[3] === may.JXA_PHIM).at(-1)!;
    expect(lp[1].slice(4)).toEqual(['8', String(1 << 20)]);
    expect((await may.go('xin chào')).ok).toBe(true);
    expect(goi.find(([, a]) => a[3] === may.JXA_GO)?.[1][4]).toBe('xin chào');
    may._datChay(null);
  });

  it('macOS thiếu quyền ⇒ câu hướng dẫn mở ĐÚNG mục System Settings (không im lặng)', async () => {
    may._datChay(async (lenh, args) => {
      if (lenh === 'osascript' && args[3]!.includes('CGPreflightScreenCaptureAccess')) return { ma: 0, ra: '{"chup":false,"dieuKhien":false}', loi: '' };
      return { ma: 0, ra: '', loi: '' };
    }, 'darwin');
    const c = await may.chupManHinh();
    expect(c.ok).toBe(false);
    if (!c.ok) expect(c.loi).toMatch(/Privacy_ScreenCapture/);
    may._datChay(null);
  });

  it('Windows dựng PowerShell SetCursorPos/mouse_event · Linux dùng xdotool', async () => {
    const goi: Array<[string, string[]]> = [];
    may._datChay(async (lenh, args) => {
      goi.push([lenh, args]);
      if (lenh === 'powershell.exe' && args.at(-1)!.includes('CopyFromScreen')) {
        const m = /Save\('([^']+)'/.exec(args.at(-1)!);
        if (m) writeFileSync(m[1]!, pngGia(1280, 720));
        return { ma: 0, ra: '2560 1440\n', loi: '' };
      }
      return { ma: 0, ra: '', loi: '' };
    }, 'win32');
    expect((await may.chupManHinh()).ok).toBe(true);
    expect((await may.bam(100, 50)).ok).toBe(true);
    expect(goi.at(-1)![1].at(-1)).toMatch(/SetCursorPos\(200,100\)/);
    may._datChay(async (lenh, args) => { goi.push([lenh, args]); return { ma: 0, ra: lenh === 'sh' ? '/usr/bin/xdotool\n' : '', loi: '' }; }, 'linux');
    const old = process.env.XDG_SESSION_TYPE; process.env.XDG_SESSION_TYPE = 'x11';
    expect((await may.phim('ctrl+shift+t')).ok).toBe(true);
    expect(goi.at(-1)).toEqual(['xdotool', ['key', 'ctrl+shift+t']]);
    process.env.XDG_SESSION_TYPE = old;
    may._datChay(null);
  });

  it('LUÔN hỏi: "Bỏ qua hết" và tuDuyet KHÔNG tự duyệt thao tác máy; cũng không nhớ được', async () => {
    const so = { ...taoSoCuoc(), boQuaHet: true };
    const dk = new AbortController();
    let id = '';
    const p = hoiNguoiDung({ ten: 'may_bam', duongDan: '🖱 Bấm', khoa: 'may:1', choNho: true, tuDuyet: true, luonHoi: true }, (y) => { id = y.id; }, dk.signal, so);
    expect(id).not.toBe('');
    traLoi(id, 'choPhepCaFile');
    expect(await p).toBe('choPhepCaFile');
    expect(so.quyenDaCap.has('may:1')).toBe(false);
    // Không luonHoi ⇒ "Bỏ qua hết" tự duyệt như cũ
    expect(await hoiNguoiDung({ ten: 'x', duongDan: 'x' }, () => {}, dk.signal, so)).toBe('choPhep');
  });
});

describe('cron + hẹn sống qua lúc tắt', () => {
  it('docCron/lanKe: ngày làm việc, bước, OR ngày-tháng/thứ, lỗi rõ', () => {
    const t7 = new Date(2026, 9, 17, 10, 0).getTime(); // thứ bảy 17/10/2026 10:00 giờ máy
    const c = docCron('0 9 * * 1-5');
    expect(typeof c).toBe('object');
    const ke = new Date(lanKe(c as Exclude<typeof c, string>, t7)!);
    expect([ke.getDay(), ke.getHours(), ke.getMinutes(), ke.getDate()]).toEqual([1, 9, 0, 19]);
    const c30 = docCron('*/30 * * * *') as Exclude<ReturnType<typeof docCron>, string>;
    expect(new Date(lanKe(c30, new Date(2026, 9, 17, 10, 5).getTime())!).getMinutes()).toBe(30);
    const or = docCron('0 0 1 * 0') as Exclude<ReturnType<typeof docCron>, string>; // ngày 1 HOẶC chủ nhật
    expect(new Date(lanKe(or, t7)!).getDate()).toBe(18);
    expect(docCron('0 9 * *')).toMatch(/5 trường/);
    expect(docCron('61 * * * *')).toMatch(/ngoài khoảng/);
    expect(docCron('@daily')).not.toBeTypeOf('string');
  });

  it('ghi đĩa kèm phiên; tiến trình CHẾT ⇒ mở lại: quá hạn vào "đã lỡ", chưa tới hạn lên lịch lại + gắn về cuộc mở đúng phiên', () => {
    hen._datLai();
    const file = path.join(mkdtempSync(path.join(os.tmpdir(), 'ct-hen-')), 'agent-hen.json');
    hen.datNoiLuuHen(file);
    hen.datBoTimPhien((c) => (c === 'c1' ? { phienId: 'phienA', goc: '/tmp/a' } : null));
    const h = hen.datHen('c1', { ly_do: 'xem CI', cron: '*/15 * * * *' });
    expect(typeof h).toBe('object');
    const tren = JSON.parse(readFileSync(file, 'utf8')) as { hen: Array<{ phienId: string; pid: number; cron: string }> };
    expect(tren.hen[0]).toMatchObject({ phienId: 'phienA', pid: process.pid, cron: '*/15 * * * *' });
    // Giả lập: tiến trình cũ đã chết, một hẹn đã quá hạn, một hẹn còn trong tương lai.
    const now = Date.now();
    writeFileSync(file, JSON.stringify({ hen: [
      { id: 'h1', cuocId: 'cu', lyDo: 'đã lỡ', luc: now - 60_000, phut: 5, lap: false, conLai: 1, phienId: 'phienA', pid: 999_999 },
      { id: 'h2', cuocId: 'cu', lyDo: 'sắp tới', luc: now + 3_600_000, phut: 60, lap: false, conLai: 1, phienId: 'phienB', pid: 999_999 },
    ] }));
    hen._datLai();
    hen.datNoiLuuHen(file);
    const kq = hen.napHenDaLuu(now);
    expect(kq).toEqual({ lo: 1, lenLich: 1 });
    expect(hen.dsHenLo().map((x) => x.lyDo)).toEqual(['đã lỡ']);
    expect(hen.soHenDangCho()).toBe(1);
    expect(hen.ganHenChoCuoc('cuocMoi', 'phienB')).toBe(1);
    expect(hen.dsHen('cuocMoi').map((x) => x.lyDo)).toEqual(['sắp tới']);
    expect(hen.xuLyHenLo('bo')).toBe(1);
    expect(hen.dsHenLo()).toEqual([]);
    hen._datLai();
  });
});

describe('LSP — server GIẢ qua stdio', () => {
  it('chan_doan / dinh_nghia / ky_hieu + chẩn đoán MỚI sau sửa', async () => {
    const goc = mkdtempSync(path.join(os.tmpdir(), 'ct-lsp-'));
    const svGia = path.join(goc, 'sv.cjs');
    writeFileSync(svGia, `
let buf = Buffer.alloc(0);
const gui = (m) => { const s = JSON.stringify(m); process.stdout.write('Content-Length: ' + Buffer.byteLength(s) + '\\r\\n\\r\\n' + s); };
const diag = (uri, text) => gui({ jsonrpc: '2.0', method: 'textDocument/publishDiagnostics', params: { uri, diagnostics: text.split('\\n').flatMap((d, i) => d.includes('LOI') ? [{ range: { start: { line: i, character: d.indexOf('LOI') }, end: { line: i, character: d.indexOf('LOI') + 3 } }, severity: 1, code: 2322, source: 'ts', message: 'loi o dong ' + (i + 1) }] : []) } });
process.stdin.on('data', (b) => {
  buf = Buffer.concat([buf, b]);
  for (;;) {
    const h = buf.indexOf('\\r\\n\\r\\n'); if (h < 0) return;
    const n = Number(/Content-Length: (\\d+)/.exec(buf.subarray(0, h).toString())[1]);
    if (buf.length < h + 4 + n) return;
    const m = JSON.parse(buf.subarray(h + 4, h + 4 + n).toString()); buf = buf.subarray(h + 4 + n);
    if (m.method === 'initialize') gui({ jsonrpc: '2.0', id: m.id, result: { capabilities: {} } });
    else if (m.method === 'textDocument/didOpen') diag(m.params.textDocument.uri, m.params.textDocument.text);
    else if (m.method === 'textDocument/didChange') diag(m.params.textDocument.uri, m.params.contentChanges[0].text);
    else if (m.method === 'textDocument/definition') gui({ jsonrpc: '2.0', id: m.id, result: [{ uri: m.params.textDocument.uri, range: { start: { line: 0, character: 6 }, end: { line: 0, character: 9 } } }] });
    else if (m.method === 'textDocument/documentSymbol') gui({ jsonrpc: '2.0', id: m.id, result: [{ name: 'abc', kind: 12, range: { start: { line: 0, character: 0 } }, selectionRange: { start: { line: 0, character: 9 } }, children: [] }] });
    else if (m.method === 'shutdown') gui({ jsonrpc: '2.0', id: m.id, result: null });
    else if (m.id !== undefined) gui({ jsonrpc: '2.0', id: m.id, result: null });
  }
});`);
    lsp._datTimServer(async () => [{ ten: 'typescript', lenh: process.execPath, args: [svGia], duoi: ['.ts'] }]);
    const f = path.join(goc, 'a.ts');
    writeFileSync(f, 'const abc = 1;\nLOI here\n');
    expect(await lsp.coLsp(goc)).toBe(true);
    const cd = await lsp.hoiLsp('cuocLsp', goc, { loai: 'chan_doan', file: 'a.ts' });
    expect(cd.noiDung).toMatch(/a\.ts:2:1 error ts 2322: loi o dong 2/);
    const dn = await lsp.hoiLsp('cuocLsp', goc, { loai: 'dinh_nghia', file: 'a.ts', dong: 1, cot: 7 });
    expect(dn.noiDung).toMatch(/a\.ts:1:7 {2}const abc = 1;/);
    expect((await lsp.hoiLsp('cuocLsp', goc, { loai: 'ky_hieu', file: 'a.ts' })).noiDung).toMatch(/function abc — dòng 1/);
    expect((await lsp.hoiLsp('cuocLsp', goc, { loai: 'hover', file: 'a.ts' })).noiDung).toMatch(/cần "dong" và "cot"/);
    const truoc = await lsp.chupTruocSua('cuocLsp', goc, f);
    writeFileSync(f, 'const abc = 1;\nLOI here\nLOI moi\n');
    const them = await lsp.chanDoanMoiSauSua('cuocLsp', goc, f, truoc);
    expect(them).toMatch(/MỚI sau lần sửa này: 1 lỗi/);
    expect(them).toMatch(/a\.ts:3:1/);
    expect(them).not.toMatch(/a\.ts:2:1/);
    lsp.dongLspCua('cuocLsp');
    lsp._datTimServer(async () => []);
    expect(await lsp.coLsp(goc)).toBe(false); // không có server ⇒ không khai capability (không phải lỗi)
    lsp._datTimServer(null);
  }, 20_000);
});

describe('gộp agent phụ: git merge (tuỳ chọn) + file nhị phân', () => {
  it('git merge --no-ff khi cây sạch; cây bẩn ⇒ từ chối rõ, không đè', async () => {
    const goc = mkdtempSync(path.join(os.tmpdir(), 'ct-merge-'));
    git(goc, 'init', '-q', '-b', 'main');
    git(goc, 'config', 'user.email', 't@t'); git(goc, 'config', 'user.name', 'T');
    writeFileSync(path.join(goc, 'a.txt'), 'mot\n');
    git(goc, 'add', '.'); git(goc, 'commit', '-qm', 'dau');
    const k = await taoKhuPhu(goc, 'phuM1');
    expect(k.ok).toBe(true);
    if (!k.ok) return;
    writeFileSync(path.join(k.khu.thuMuc, 'a.txt'), 'mot\nhai\n');
    writeFileSync(path.join(k.khu.thuMuc, 'b.txt'), 'moi\n');
    writeFileSync(path.join(goc, 'a.txt'), 'ban\n'); // cây chính bẩn
    expect((await gopBangMerge(k.khu, 'thêm dòng')).ok).toBe(false);
    git(goc, 'checkout', '--', 'a.txt');
    const m = await gopBangMerge(k.khu, 'thêm dòng');
    expect(m.ok).toBe(true);
    expect(readFileSync(path.join(goc, 'a.txt'), 'utf8')).toBe('mot\nhai\n');
    const log = git(goc, 'log', '--format=%s|%p', '-3');
    expect(log).toMatch(/^Gộp agent phụ: thêm dòng\|\w+ \w+/); // merge commit: HAI cha
    expect(log).toMatch(/\nagent phụ: thêm dòng\|/);
    await donKhu('phuM1');
  });

  it('nhị phân: chép nguyên tệp khi dự án chưa đổi; đã đổi ⇒ xung đột', async () => {
    const goc = mkdtempSync(path.join(os.tmpdir(), 'ct-nhiphan-'));
    const nhi = Buffer.from([0, 1, 2, 3, 0, 255]);
    writeFileSync(path.join(goc, 'x.bin'), nhi);
    writeFileSync(path.join(goc, 'y.bin'), nhi);
    const k = await taoKhuPhu(goc, 'phuB1');
    expect(k.ok && k.khu.loai).toBe('tam');
    if (!k.ok) return;
    writeFileSync(path.join(k.khu.thuMuc, 'x.bin'), Buffer.from([0, 9, 9]));
    writeFileSync(path.join(k.khu.thuMuc, 'y.bin'), Buffer.from([0, 8, 8]));
    writeFileSync(path.join(k.khu.thuMuc, 'z.bin'), Buffer.from([0, 7]));
    writeFileSync(path.join(goc, 'y.bin'), Buffer.from([0, 5])); // người dùng đổi y.bin sau khi giao việc
    const ds = await thayDoiCuaKhu(k.khu);
    const so = taoSoCuoc();
    const r = await gopVaoGoc(k.khu, ds, so);
    expect(r.ghi.sort()).toEqual(['x.bin', 'z.bin']);
    expect(r.xungDot).toEqual(['y.bin']);
    expect(r.khongLui).toEqual(['x.bin']);
    expect(readFileSync(path.join(goc, 'x.bin'))).toEqual(Buffer.from([0, 9, 9]));
    expect(so.nhatKyHoanTac.get(path.join(goc, 'z.bin'))).toBeNull(); // file MỚI ⇒ /undo xoá được
    await donKhu('phuB1');
  });
});

describe('chạy notebook (jupyter GIẢ)', () => {
  it('chạy tới ô N trên bản sao, rút đầu ra + lỗi, ghép đầu ra vào bản gốc', async () => {
    const goc = mkdtempSync(path.join(os.tmpdir(), 'ct-nb-'));
    const f = path.join(goc, 'a.ipynb');
    writeFileSync(f, JSON.stringify({ cells: [
      { cell_type: 'code', source: ['print(1)'], outputs: [] },
      { cell_type: 'code', source: ['1/0'], outputs: [] },
      { cell_type: 'code', source: ['print(3)'], outputs: [] },
    ], metadata: { kernelspec: { name: 'python3' } }, nbformat: 4, nbformat_minor: 5 }));
    let soO = -1;
    nb._datChayNotebook(async (_lenh, args, t) => {
      if (args[0] === 'nbconvert' && args[1] === '--version') return { ma: 0, ra: '7.0', loi: '' };
      const vao = JSON.parse(readFileSync(args.at(-1)!, 'utf8')) as { cells: unknown[] };
      soO = vao.cells.length;
      expect(t.cwd).toBe(goc);
      const dir = args[args.indexOf('--output-dir') + 1]!;
      writeFileSync(path.join(dir, 'ra.ipynb'), JSON.stringify({ cells: [
        { cell_type: 'code', outputs: [{ output_type: 'stream', text: ['1\n'] }], execution_count: 1 },
        { cell_type: 'code', outputs: [{ output_type: 'error', traceback: ['ZeroDivisionError: division by zero'] }], execution_count: 2 },
      ] }));
      return { ma: 0, ra: '', loi: '' };
    });
    expect(await nb.coJupyter()).toBe(true);
    const r = await nb.chayNotebook(f, { denO: 1, giay: 60 });
    expect(soO).toBe(2);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.noiDung).toMatch(/1 ô báo lỗi/);
    expect(r.noiDung).toMatch(/ô 1 · LỖI ──\nZeroDivisionError/);
    const moi = JSON.parse(r.ketQua) as { cells: Array<{ outputs: unknown[] }>; metadata: unknown };
    expect(moi.cells[0]!.outputs).toHaveLength(1);
    expect(moi.cells[2]!.outputs).toEqual([]); // ô sau den_o giữ nguyên
    expect(moi.metadata).toEqual({ kernelspec: { name: 'python3' } });
    nb._datChayNotebook(null);
  });
});

describe('hook truocNen (PreCompact) + thongBao (Notification) + agent phụ', () => {
  it('mốc mới hợp lệ, nhận biến môi trường CUONGMINI_*, chạy ở cwd riêng', async () => {
    const goc = mkdtempSync(path.join(os.tmpdir(), 'ct-hook4-'));
    const khu = path.join(goc, 'khu'); mkdirSync(khu);
    writeFileSync(path.join(thuMucApp, 'hooks.json'), JSON.stringify({ hooks: [
      { khi: 'thongBao', lenh: 'echo "[$CUONGMINI_THONG_BAO]" > tb.txt' },
      { khi: 'truocNen', lenh: 'echo giu-ten-file', chan: false },
      { khi: 'sauTool', khop: 'edit_file', lenh: 'echo "$CUONGMINI_AGENT_PHU" && pwd' },
    ] }));
    quenDemHook();
    const dk = new AbortController();
    await chayHook({ moc: 'thongBao', goc, signal: dk.signal, env: { CUONGMINI_THONG_BAO: 'Cần duyệt: npm test' } });
    expect(readFileSync(path.join(goc, 'tb.txt'), 'utf8').trim()).toBe('[Cần duyệt: npm test]');
    expect((await chayHook({ moc: 'truocNen', goc, signal: dk.signal })).ra).toMatch(/giu-ten-file/);
    const phu = await chayHook({ moc: 'sauTool', goc, tenTool: 'edit_file', signal: dk.signal, cwd: khu, env: { CUONGMINI_AGENT_PHU: '1' } });
    expect(phu.ra).toMatch(/^\[hook sauTool[^\n]*\]\n1\n.*khu$/s);
    expect(existsSync(path.join(khu, 'tb.txt'))).toBe(false);
  });
});
