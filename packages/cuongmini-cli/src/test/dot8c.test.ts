/**
 * ĐỢT 8C — phần THUẦN: dò terminal + chuỗi OSC (tiêu đề xoay, 9;4, user var, thông báo gốc), thông báo hệ điều hành
 * (nội dung, thoát ký tự, logo), đọc clipboard (từ khoá, công cụ giả trên PATH), kéo-thả đường Windows/file://.
 */
import assert from 'node:assert/strict';
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { after, test } from 'node:test';
import { tachAnh } from '../anh';
import { danAnhTuClipboard, hieuTuKhoa, thuMotCach, PS_DOC_ANH } from '../anhDan';
import { phimDanAnh } from '../banPhim';
import { duongBieuTuong } from '../bieuTuong';
import { chuanHoaCaiDat } from '../caiDat';
import { BoHieuUng, doKhaNang, LUU_TIEU_DE, oscThongBao, phienBanToi, sachOsc, TRA_TIEU_DE, tieuDeTheoPha } from '../hieuUngTerminal';
import { datNgonNgu } from '../i18n';
import { lenhThongBao, maHoaPs, motDong, PS_TOAST, soanThongBao, thoiLuongChu } from '../thongBao';

datNgonNgu('vi');
const tam = mkdtempSync(path.join(os.tmpdir(), 'cm-dot8c-'));
after(() => rmSync(tam, { recursive: true, force: true }));
const tty = { tty: true };

test('dò terminal: iTerm2 ≥ 3.6.6 / Windows Terminal / ConEmu / ghostty ≥ 1.2 mới phát 9;4; còn lại chỉ tiêu đề', () => {
  const iterm = doKhaNang({ TERM_PROGRAM: 'iTerm.app', TERM_PROGRAM_VERSION: '3.7.2' }, tty);
  assert.deepEqual(iterm, { tieuDe: true, tienDo: true, bienIterm: true, thongBao: 'osc9' });
  // iTerm2 cũ: OSC 9 = "đăng thông báo" ⇒ 9;4;3 sẽ thành thông báo rác — KHÔNG phát tiến độ, nhưng vẫn thông báo OSC 9.
  assert.deepEqual(doKhaNang({ TERM_PROGRAM: 'iTerm.app', TERM_PROGRAM_VERSION: '3.5.10' }, tty), { tieuDe: true, tienDo: false, bienIterm: true, thongBao: 'osc9' });
  assert.equal(doKhaNang({ TERM_PROGRAM: 'iTerm.app' }, tty).tienDo, false, 'không đọc được phiên bản ⇒ không phát');
  assert.deepEqual(doKhaNang({ WT_SESSION: 'abc' }, tty), { tieuDe: true, tienDo: true, bienIterm: false, thongBao: null });
  assert.equal(doKhaNang({ ConEmuANSI: 'ON' }, tty).tienDo, true);
  assert.deepEqual(doKhaNang({ TERM_PROGRAM: 'ghostty', TERM_PROGRAM_VERSION: '1.2.0' }, tty), { tieuDe: true, tienDo: true, bienIterm: false, thongBao: 'osc777' });
  assert.equal(doKhaNang({ TERM_PROGRAM: 'ghostty', TERM_PROGRAM_VERSION: '1.1.3' }, tty).tienDo, false);
  assert.deepEqual(doKhaNang({ TERM_PROGRAM: 'WezTerm' }, tty), { tieuDe: true, tienDo: false, bienIterm: false, thongBao: 'osc777' });
  assert.deepEqual(doKhaNang({ TERM_PROGRAM: 'Apple_Terminal' }, tty), { tieuDe: true, tienDo: false, bienIterm: false, thongBao: null });
  assert.deepEqual(doKhaNang({ TERM_PROGRAM: 'vscode' }, tty), { tieuDe: true, tienDo: false, bienIterm: false, thongBao: null });
  // tmux trong Windows Terminal/iTerm: OSC lạ bị nuốt/đi sai ⇒ chỉ tiêu đề.
  assert.deepEqual(doKhaNang({ TERM_PROGRAM: 'tmux', WT_SESSION: 'x', TMUX: '/tmp/t' }, tty), { tieuDe: true, tienDo: false, bienIterm: false, thongBao: null });
  const khong = { tieuDe: false, tienDo: false, bienIterm: false, thongBao: null };
  for (const [env, o] of [
    [{ TERM_PROGRAM: 'iTerm.app', TERM_PROGRAM_VERSION: '3.7.2' }, { tty: false }],
    [{ WT_SESSION: 'x' }, { tty: true, cheDoIn: true }],
    [{ WT_SESSION: 'x' }, { tty: true, tat: true }],
    [{ WT_SESSION: 'x', CUONGMINI_HIEU_UNG: '0' }, tty],
    [{ WT_SESSION: 'x', CI: 'true' }, tty],
    [{ WT_SESSION: 'x', TERM: 'dumb' }, tty],
  ] as Array<[NodeJS.ProcessEnv, { tty: boolean; cheDoIn?: boolean; tat?: boolean }]>) assert.deepEqual(doKhaNang(env, o), khong, JSON.stringify([env, o]));
  assert.equal(doKhaNang({ WT_SESSION: 'x', CUONGMINI_KHONG_DAT_TIEU_DE: '1' }, tty).tieuDe, false);
  assert.ok(phienBanToi('3.6.10', [3, 6, 6]) && phienBanToi('4.0', [3, 6, 6]) && !phienBanToi('3.6.5', [3, 6, 6]) && !phienBanToi('', [1]));
});

test('bộ phát: chỉ ghi khi đổi, xoay biểu tượng, 9;4 theo pha, dọn sạch khi thoát', async () => {
  const ghi: string[] = [];
  const b = new BoHieuUng({ tieuDe: true, tienDo: true, bienIterm: true, thongBao: 'osc9' }, (s) => ghi.push(s), 20);
  b.batDau();
  assert.equal(ghi[0], LUU_TIEU_DE, 'lưu tiêu đề cũ trước');
  assert.ok(ghi.includes('\x1b]0;CuongMini\x07'));
  ghi.length = 0;
  b.dat('chay', 'Sửa lỗi đăng nhập');
  assert.ok(ghi.includes('\x1b]0;◐ Sửa lỗi đăng nhập · đang làm\x07'), JSON.stringify(ghi));
  assert.ok(ghi.includes('\x1b]9;4;3;0\x07'));
  assert.ok(ghi.includes(`\x1b]1337;SetUserVar=cuongmini=${Buffer.from('working').toString('base64')}\x07`));
  const n = ghi.length;
  b.dat('chay', 'Sửa lỗi đăng nhập');
  assert.equal(ghi.length, n, 'không đổi ⇒ không ghi');
  await new Promise((ok) => setTimeout(ok, 75));
  const tieuDe = ghi.filter((s) => s.startsWith('\x1b]0;'));
  assert.ok(tieuDe.length >= 3 && new Set(tieuDe).size >= 3, `biểu tượng xoay: ${JSON.stringify(tieuDe)}`);
  assert.equal(ghi.filter((s) => s.startsWith('\x1b]9;4;3')).length, 1, 'xoay KHÔNG phát lại 9;4 (không nháy)');
  b.dat('duyet', 'Sửa lỗi đăng nhập');
  assert.ok(ghi.includes('\x1b]9;4;4;100\x07') && ghi.includes('\x1b]0;◉ Sửa lỗi đăng nhập · chờ duyệt\x07'));
  const truoc = ghi.length;
  await new Promise((ok) => setTimeout(ok, 60));
  assert.equal(ghi.length, truoc, 'chờ duyệt: đứng yên');
  b.dat('loi', 'Sửa lỗi đăng nhập');
  assert.ok(ghi.includes('\x1b]9;4;2;100\x07') && ghi.includes('\x1b]0;✗ Sửa lỗi đăng nhập · lỗi\x07'));
  b.dat('xong', 'Sửa lỗi đăng nhập');
  assert.equal(ghi.at(-3), '\x1b]0;✓ Sửa lỗi đăng nhập · xong\x07');
  assert.ok(ghi.includes('\x1b]9;4;0;0\x07'));
  b.daXem();
  assert.equal(b.phaHienTai, 'nghi');
  assert.ok(ghi.includes('\x1b]0;CuongMini · Sửa lỗi đăng nhập\x07'));
  assert.equal(b.thongBao('CuongMini', 'Xong · a'), true);
  assert.equal(ghi.at(-1), '\x1b]9;CuongMini · Xong · a\x07');
  b.dat('chay', 'x');
  ghi.length = 0;
  b.ketThuc();
  assert.deepEqual(ghi, [`\x1b]9;4;0;0\x07\x1b]1337;SetUserVar=cuongmini=\x07\x1b]0;\x07${TRA_TIEU_DE}`]);
  b.ketThuc();
  assert.equal(ghi.length, 1, 'idempotent');
  assert.equal(b.thongBao('a', 'b'), false, 'đã dọn ⇒ không phát');
});

test('bộ phát: terminal không hỗ trợ ⇒ không một byte nào', () => {
  const ghi: string[] = [];
  const b = new BoHieuUng({ tieuDe: false, tienDo: false, bienIterm: false, thongBao: null }, (s) => ghi.push(s));
  b.batDau(); b.dat('chay', 'x'); b.dat('duyet', 'x'); b.dat('loi', 'x'); b.dat('xong', 'x');
  assert.equal(b.thongBao('CuongMini', 'x'), false);
  b.ketThuc();
  assert.deepEqual(ghi, []);
  // Chỉ tiêu đề (Apple Terminal, VS Code…): không 9;4, không 1337.
  const g2: string[] = [];
  const b2 = new BoHieuUng({ tieuDe: true, tienDo: false, bienIterm: false, thongBao: null }, (s) => g2.push(s));
  b2.batDau(); b2.dat('chay', 'x'); b2.ketThuc();
  assert.ok(!g2.join('').includes('\x1b]9;') && !g2.join('').includes('1337'));
  // Tắt giữa phiên (/config) ⇒ dọn ngay.
  const g3: string[] = [];
  const b3 = new BoHieuUng({ tieuDe: true, tienDo: true, bienIterm: false, thongBao: null }, (s) => g3.push(s));
  b3.batDau(); b3.dat('chay', 'x');
  g3.length = 0;
  b3.datKhaNang({ tieuDe: false, tienDo: false, bienIterm: false, thongBao: null });
  assert.deepEqual(g3, ['\x1b]9;4;0;0\x07', `\x1b]0;\x07${TRA_TIEU_DE}`]);
  b3.ketThuc();
});

test('chuỗi OSC: chữ của model không phá được chuỗi (BEL/ESC/xuống dòng bị gỡ), 777 không lẫn dấu ;', () => {
  assert.equal(sachOsc('a\x07b\x1b]0;hack\x07\nc'), 'a b ]0;hack c');
  assert.equal(tieuDeTheoPha('chay', 'x\x07y', 1), '◓ x y · đang làm');
  assert.equal(tieuDeTheoPha('chay', '', 2, true), '- CuongMini · đang làm');
  assert.equal(oscThongBao('osc777', 'Cuong;Mini', 'a;b\x07'), '\x1b]777;notify;Cuong,Mini;a,b\x07');
  assert.equal(oscThongBao('osc9', 'CuongMini', 'Xong · việc\nmới'), '\x1b]9;CuongMini · Xong · việc mới\x07');
});

test('nội dung thông báo: "Xong · <tên phiên> · 2 phút 14 giây", một dòng, không bắt đầu bằng "-"', () => {
  assert.equal(thoiLuongChu(134_000), '2 phút 14 giây');
  assert.equal(thoiLuongChu(45_000), '45 giây');
  assert.equal(thoiLuongChu(3_780_000), '1 giờ 3 phút');
  const nd = soanThongBao('xong', 'Sửa lỗi\nđăng nhập', 134_000);
  assert.deepEqual(nd, { tieuDe: 'CuongMini', phuDe: 'Sửa lỗi đăng nhập', noiDung: 'Xong · 2 phút 14 giây', dayDu: 'Xong · Sửa lỗi đăng nhập · 2 phút 14 giây' });
  assert.equal(soanThongBao('duyet', 'LabFlow').dayDu, 'Cần bạn duyệt · LabFlow');
  assert.equal(soanThongBao('loi', 'x', 5000).noiDung, 'Gặp lỗi · 5 giây');
  assert.equal(motDong('-rf /'), '–rf /');
  assert.equal(motDong('a'.repeat(200), 10), `${'a'.repeat(9)}…`);
  datNgonNgu('en');
  assert.equal(soanThongBao('xong', 'Fix', 134_000).dayDu, 'Done · Fix · 2m 14s');
  datNgonNgu('vi');
});

test('thông báo macOS: chữ qua ARGV đúng nguyên văn (dấu ", \\, tiếng Việt), terminal-notifier có logo + đưa terminal lên', () => {
  const nd = soanThongBao('xong', 'Sửa "auth" \\ C:\\tệp; $(rm -rf ~)', 134_000);
  const m = lenhThongBao('darwin', nd)!;
  assert.equal(m.file, 'osascript');
  assert.deepEqual(m.args.slice(-3), ['CuongMini', 'Sửa "auth" \\ C:\\tệp; $(rm -rf ~)', 'Xong · 2 phút 14 giây']);
  assert.ok(m.args.slice(0, -3).every((a) => !a.includes('rm -rf')), 'không ghép chữ vào AppleScript');
  assert.ok(m.args.join(' ').includes('on run argv') && !m.args.join(' ').includes('system attribute'), 'không dùng `system attribute` (MacRoman)');
  const t = lenhThongBao('darwin', nd, { terminalNotifier: '/opt/homebrew/bin/terminal-notifier', icon: { png: '/h/.cuongmini/bieu-tuong/cuongmini.png', ico: '' }, bundleId: 'com.googlecode.iterm2' })!;
  assert.equal(t.file, '/opt/homebrew/bin/terminal-notifier');
  const v = (k: string) => t.args[t.args.indexOf(k) + 1];
  assert.equal(v('-title'), 'CuongMini');
  assert.equal(v('-subtitle'), 'Sửa "auth" \\ C:\\tệp; $(rm -rf ~)');
  assert.equal(v('-message'), 'Xong · 2 phút 14 giây');
  assert.equal(v('-contentImage'), '/h/.cuongmini/bieu-tuong/cuongmini.png');
  assert.equal(v('-activate'), 'com.googlecode.iterm2');
  assert.ok(!lenhThongBao('darwin', nd, { terminalNotifier: '/x', bundleId: 'a; rm' })!.args.includes('-activate'), 'bundle id lạ ⇒ bỏ');
});

test('thông báo Windows: toast WinRT qua -EncodedCommand, chữ đi bằng biến môi trường; Linux notify-send có logo', () => {
  const nd = soanThongBao('duyet', 'Phiên <b>&"x"');
  const w = lenhThongBao('win32', nd, { icon: { png: 'C:\\U\\a b\\cuongmini.png', ico: 'C:\\U\\a b\\cuongmini.ico' } })!;
  assert.equal(w.file, 'powershell.exe');
  const script = Buffer.from(w.args.at(-1)!, 'base64').toString('utf16le');
  assert.equal(script, PS_TOAST);
  assert.ok(!script.includes('Phiên'), 'chữ người dùng không nằm trong script');
  assert.ok(script.includes("'CuongMini.CLI'") && script.includes('appLogoOverride') && script.includes('CreateTextNode') && script.includes('BurntToast') && script.includes('NotifyIcon'));
  assert.deepEqual(w.env, { CM_TB_TIEU_DE: 'CuongMini', CM_TB_PHU_DE: 'Phiên <b>&"x"', CM_TB_NOI_DUNG: 'Cần bạn duyệt', CM_TB_PNG: 'C:\\U\\a b\\cuongmini.png', CM_TB_ICO: 'C:\\U\\a b\\cuongmini.ico' });
  assert.equal(maHoaPs('a'), Buffer.from('a', 'utf16le').toString('base64'));
  assert.deepEqual(lenhThongBao('linux', nd, { icon: { png: '/h/c.png', ico: '' } })!.args, ['-a', 'CuongMini', '-i', '/h/c.png', '--', 'CuongMini', 'Cần bạn duyệt · Phiên <b>&"x"']);
});

test('logo CuongMini: PNG + ICO ghi ra thư mục CuongMini (đúng chữ ký tệp)', () => {
  const d = duongBieuTuong(path.join(tam, 'goc'))!;
  assert.ok(d && existsSync(d.png) && existsSync(d.ico));
  assert.equal(readFileSync(d.png).readUInt32BE(0), 0x89504e47);
  const ico = readFileSync(d.ico);
  assert.deepEqual([ico.readUInt16LE(0), ico.readUInt16LE(2), ico.readUInt16LE(4)], [0, 1, 3], 'ICO 3 cỡ 16/32/48');
  assert.deepEqual([ico[6], ico[22], ico[38]], [16, 32, 48]);
});

test('dán ảnh: từ khoá của script (OK / EMPTY / FILE / ERR) và phím theo hệ', () => {
  const dich = path.join(tam, 'dich.png');
  assert.deepEqual(hieuTuKhoa('EMPTY', 3, dich), { loai: 'trong' });
  assert.equal(hieuTuKhoa('OK', 0, dich).loai, 'loi', 'OK mà không có file ⇒ lỗi, không giả vờ');
  writeFileSync(dich, Buffer.from('89504e470d0a1a0a', 'hex'));
  assert.deepEqual(hieuTuKhoa('OK', 0, dich), { loai: 'anh', duong: dich });
  const fAnh = path.join(tam, 'ảnh chụp (1).png');
  writeFileSync(fAnh, 'x');
  assert.deepEqual(hieuTuKhoa(`FILE:${Buffer.from(fAnh).toString('base64')}`, 0, dich), { loai: 'anh', duong: fAnh }, 'Windows: base64 UTF-8');
  assert.deepEqual(hieuTuKhoa(`FILE:${fAnh}`, 0, dich, true), { loai: 'anh', duong: fAnh }, 'macOS: chữ trần');
  assert.deepEqual(hieuTuKhoa(`FILE:${Buffer.from('C:\\a\\b.txt').toString('base64')}`, 0, dich), { loai: 'trong' }, 'file không phải ảnh');
  assert.deepEqual(hieuTuKhoa(`ERR:${Buffer.from('Lỗi OLE').toString('base64')}`, 4, dich), { loai: 'loi', chiTiet: 'Lỗi OLE' });
  assert.ok(PS_DOC_ANH.includes('ContainsFileDropList') && PS_DOC_ANH.includes('ContainsImage') && !/[^\x00-\x7f]/.test(PS_DOC_ANH), 'script ASCII');
  assert.equal(phimDanAnh('win32'), 'alt+v');
  assert.equal(phimDanAnh('darwin'), 'ctrl+v');
});

test('dán ảnh: công cụ giả trên PATH — có ảnh / không có ảnh / không có công cụ (Linux)', async () => {
  const bin = path.join(tam, 'bin');
  mkdirSync(bin, { recursive: true });
  const cheDo = path.join(tam, 'che-do');
  const png = Buffer.from('89504e470d0a1a0a0000000d49484452', 'hex').toString('hex');
  writeFileSync(path.join(bin, 'wl-paste'), `#!/bin/sh\nread m < '${cheDo}'\nif [ "$m" = anh ]; then printf '${png.replace(/(..)/g, '\\x$1')}'; exit 0; fi\necho "No suitable type of content copied" >&2; exit 1\n`);
  chmodSync(path.join(bin, 'wl-paste'), 0o755);
  const pathCu = process.env.PATH;
  const homeCu = process.env.CUONGMINI_HOME;
  process.env.CUONGMINI_HOME = path.join(tam, 'home có dấu');
  try {
    process.env.PATH = bin;
    writeFileSync(cheDo, 'anh');
    const r = await danAnhTuClipboard('linux');
    assert.ok('duong' in r && readFileSync(r.duong).readUInt32BE(0) === 0x89504e47, JSON.stringify(r));
    writeFileSync(cheDo, 'chu');
    const r2 = await danAnhTuClipboard('linux');
    assert.ok('loi' in r2 && /Clipboard không có ảnh/.test(r2.loi), JSON.stringify(r2));
    process.env.PATH = path.join(tam, 'khong-co');
    const r3 = await danAnhTuClipboard('linux');
    assert.ok('loi' in r3 && /wl-clipboard/.test(r3.loi), JSON.stringify(r3));
    const r4 = await thuMotCach({ file: process.execPath, args: ['-e', 'process.stdout.write("EMPTY")'], ra: 'tuKhoa' }, path.join(tam, 'x.png'));
    assert.deepEqual(r4, { loai: 'trong' });
    const r5 = await thuMotCach({ file: process.execPath, args: ['-e', 'setTimeout(() => {}, 5000)'], ra: 'tuKhoa' }, path.join(tam, 'x.png'), 300);
    assert.equal(r5.loai, 'loi');
  } finally {
    process.env.PATH = pathCu;
    if (homeCu === undefined) delete process.env.CUONGMINI_HOME; else process.env.CUONGMINI_HOME = homeCu;
  }
});

test('kéo-thả: đường Windows bọc ngoặc kép (dấu cách, tiếng Việt, ngoặc), PowerShell `& \'…\'`, UNC, file://', () => {
  const co = new Set(['C:\\Users\\An\\Ảnh chụp\\màn hình (1).png', 'C:\\a\\b.png', '\\\\may\\chung\\x.jpg', '/Users/an/a b/ảnh.png']);
  const laFile = (p: string) => co.has(p);
  const k1 = tachAnh('"C:\\Users\\An\\Ảnh chụp\\màn hình (1).png" xem giúp', '/cwd', laFile);
  assert.deepEqual(k1.anh, ['C:\\Users\\An\\Ảnh chụp\\màn hình (1).png']);
  assert.equal(k1.text, '[ảnh: màn hình (1).png] xem giúp');
  assert.deepEqual(tachAnh("& 'C:\\Users\\An\\Ảnh chụp\\màn hình (1).png'", '/cwd', laFile).anh.length, 1);
  assert.deepEqual(tachAnh('xem C:\\a\\b.png nhé', '/cwd', laFile).anh, ['C:\\a\\b.png']);
  assert.deepEqual(tachAnh('C:/a/b.png', '/cwd', laFile).anh, ['C:\\a\\b.png'], 'gạch chéo xuôi ⇒ chuẩn hoá');
  assert.deepEqual(tachAnh('\\\\may\\chung\\x.jpg', '/cwd', laFile).anh, ['\\\\may\\chung\\x.jpg']);
  assert.deepEqual(tachAnh('file:///Users/an/a%20b/%E1%BA%A3nh.png', '/cwd', laFile).anh, ['/Users/an/a b/ảnh.png']);
  assert.deepEqual(tachAnh('/Users/an/a\\ b/ảnh.png', '/cwd', laFile).anh, ['/Users/an/a b/ảnh.png'], 'macOS Terminal: thoát dấu cách');
});

test('cài đặt: hieuUngTerminal mặc định bật, giá trị lạ ⇒ mặc định', () => {
  assert.equal(chuanHoaCaiDat({}).hieuUngTerminal, 'bat');
  assert.equal(chuanHoaCaiDat({ hieuUngTerminal: 'tat' }).hieuUngTerminal, 'tat');
  assert.equal(chuanHoaCaiDat({ hieuUngTerminal: 'xyz' }).hieuUngTerminal, 'bat');
});
