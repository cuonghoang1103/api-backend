import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { datNgonNgu } from '../i18n';
import { cachDocAnh } from '../anhDan';
import { chuanHoaCaiDat, MAC_DINH, nenBatTrinhDuyet } from '../caiDat';
import { chenKeybinding, doTerminal } from '../caiTerminal';
import { phanTichCo } from '../coDong';
import { chenGhiNho, fileQuyUoc, tachGhiNho } from '../ghiNho';
import { KhoChat } from '../kho';
import { quetNoiDung } from '../kyHieu';
import { canAscii, doiKyTu } from '../kyTu';
import { boMau, chinhTheoTheme, datCapMau, datTheme, doTheme, mau, nen, rgbSang16 } from '../mau';
import { dungNguCanhShell, lenhShell, sachDauRa } from '../shell';
import { lenhThongBao } from '../thongBao';
import { dungBanGhi } from '../veBang';

// Các phép kiểm dưới so chữ giao diện tiếng Việt.
datNgonNgu('vi');

test('shell `!`: đúng shell theo hệ điều hành', () => {
  assert.deepEqual(lenhShell('ls -la', 'darwin', { SHELL: '/bin/zsh' }), { file: '/bin/zsh', args: ['-c', 'ls -la'] });
  assert.deepEqual(lenhShell('ls', 'linux', { SHELL: '/usr/bin/evil;rm' }), { file: '/bin/sh', args: ['-c', 'ls'] }, 'SHELL lạ ⇒ /bin/sh');
  const w = lenhShell('dir', 'win32', {}, true);
  assert.equal(w.file, 'pwsh');
  assert.ok(w.args.includes('-NoProfile') && w.args[w.args.length - 1]!.endsWith('dir'));
  assert.match(w.args[w.args.length - 1]!, /OutputEncoding=\[Text.Encoding\]::UTF8/);
  assert.equal(lenhShell('dir', 'win32', {}, false).file, 'powershell.exe');
});

test('shell `!`: ngữ cảnh gửi model giữ ĐUÔI, có trần, bỏ mã màu', () => {
  assert.equal(dungNguCanhShell([]), '');
  const dai = `${'x'.repeat(5000)}LỖI Ở CUỐI`;
  const r = dungNguCanhShell([{ lenh: 'npm test', ma: 1, ra: `\x1b[31m${dai}\x1b[0m` }], 1000);
  assert.match(r, /\$ npm test/);
  assert.match(r, /LỖI Ở CUỐI/);
  assert.match(r, /\[mã thoát 1\]/);
  assert.ok(r.length < 1300);
  assert.ok(!r.includes('\x1b'));
  assert.equal(sachDauRa('a\rb\x1b[2K'), 'a\nb');
});

test('dán ảnh: lệnh đúng từng hệ, đích đi qua biến môi trường', () => {
  const mac = cachDocAnh('darwin', '/t/a.png');
  assert.deepEqual(mac.map((c) => c.file), ['pngpaste', 'osascript']);
  assert.ok(mac[1]!.args.join(' ').includes('«class PNGf»'));
  assert.ok(!mac[1]!.args.join(' ').includes('/t/a.png'), 'không ghép đường vào AppleScript');
  const win = cachDocAnh('win32', 'C:\\t\\a.png');
  assert.match(win[0]!.args.join(' '), /Get-Clipboard -Format Image/);
  assert.ok(win[0]!.args.includes('-STA'));
  assert.deepEqual(cachDocAnh('linux', '/t/a.png').map((c) => c.file), ['wl-paste', 'xclip']);
});

test('thông báo hệ điều hành: nội dung qua env, không ghép chuỗi', () => {
  const m = lenhThongBao('darwin', 'Tiêu "đề"', 'nội dung; rm -rf');
  assert.equal(m?.file, 'osascript');
  assert.ok(!m!.args.join('').includes('rm -rf'));
  assert.equal(m!.env.CM_NOI_DUNG, 'nội dung; rm -rf');
  assert.equal(lenhThongBao('win32', 'a', 'b')?.file, 'powershell.exe');
  assert.deepEqual(lenhThongBao('linux', 'a', 'b')?.args, ['--app-name=CuongMini', 'a', 'b']);
  assert.equal(lenhThongBao('aix', 'a', 'b'), null);
});

test('@ hàm/lớp: quét định nghĩa theo ngôn ngữ', () => {
  const ts = quetNoiDung('export async function layUser() {}\nclass A {}\nexport interface Props {}\nexport const tinh = (a: number) => a\nif (x) {}\ntype T = string;', 'src/a.ts');
  assert.deepEqual(ts.map((k) => [k.ten, k.kieu, k.dong]), [['layUser', 'fn', 1], ['A', 'class', 2], ['Props', 'interface', 3], ['tinh', 'fn', 4], ['T', 'type', 6]]);
  assert.deepEqual(quetNoiDung('def tinh_tong(a):\n  pass\nclass Nguoi:\n', 'x.py').map((k) => k.ten), ['tinh_tong', 'Nguoi']);
  assert.deepEqual(quetNoiDung('func (s *S) Chay() {}\ntype S struct {}', 'm.go').map((k) => k.ten), ['Chay', 'S']);
  assert.deepEqual(quetNoiDung('public class Main {\n  public static void main(String[] a) {}\n}', 'Main.java').map((k) => k.ten), ['Main', 'main']);
  assert.deepEqual(quetNoiDung('function x(){}', 'README.md'), []);
});

test('# ghi nhớ: tách, chọn file quy ước lõi đang đọc, chèn vào mục riêng', () => {
  assert.equal(tachGhiNho('# luôn dùng pnpm'), 'luôn dùng pnpm');
  assert.equal(tachGhiNho('#tag'), null);
  assert.equal(tachGhiNho('#'), null);
  const claude = path.join('/d', 'CLAUDE.md');
  assert.deepEqual(fileQuyUoc('/d', (p) => p === claude), { duong: claude, taoMoi: false });
  assert.deepEqual(fileQuyUoc('/d', () => false), { duong: path.join('/d', 'AGENTS.md'), taoMoi: true });
  assert.equal(chenGhiNho('', 'a'), '# Quy ước dự án\n\n## Ghi nhớ nhanh\n\n- a\n');
  const co = '# Dự án\n\nNội dung\n\n## Ghi nhớ nhanh\n\n- cũ\n\n## Khác\n\nx\n';
  assert.equal(chenGhiNho(co, 'mới'), '# Dự án\n\nNội dung\n\n## Ghi nhớ nhanh\n\n- cũ\n- mới\n\n## Khác\n\nx\n');
  assert.equal(chenGhiNho('# A\n', 'b'), '# A\n\n## Ghi nhớ nhanh\n\n- b\n');
});

test('cài đặt: trường sai ⇒ mặc định; "Bỏ qua hết" không đến từ file', () => {
  assert.deepEqual(chuanHoaCaiDat(null), MAC_DINH);
  const c = chuanHoaCaiDat({ theme: 'sang', thongBao: 'xyz', cheDoMacDinh: 'boQuaHet', modelMacDinh: 'opus-4-8', ascii: 'bat' });
  assert.deepEqual(c, { theme: 'sang', thongBao: 'heThong', cheDoMacDinh: null, modelMacDinh: 'opus-4-8', ascii: 'bat', trinhDuyet: 'tuDong', ngonNgu: 'tuDong', traLoiTheoNgonNgu: 'tat' });
  assert.equal(MAC_DINH.cheDoMacDinh, null, 'chưa tự chọn ⇒ để lõi dùng "Hỏi trước"');
  assert.equal(chuanHoaCaiDat({ cheDoMacDinh: 'keHoach' }).cheDoMacDinh, 'keHoach');
  assert.equal(chuanHoaCaiDat({ modelMacDinh: '$(rm)' }).modelMacDinh, null);
});

test('theme sáng: hạ độ sáng chữ, nâng nền tối thành nền nhạt; COLORFGBG', () => {
  assert.equal(doTheme({ COLORFGBG: '0;15' }), 'sang');
  assert.equal(doTheme({ COLORFGBG: '15;0' }), 'toi');
  assert.equal(doTheme({}), 'toi');
  const neon = chinhTheoTheme([80, 250, 123], false, 'sang');
  assert.ok(Math.max(...neon) < 180, `chữ xanh neon phải tối lại: ${neon}`);
  const nenDiff = chinhTheoTheme([18, 54, 31], true, 'sang');
  assert.ok(Math.min(...nenDiff) > 200, `nền diff phải nhạt: ${nenDiff}`);
  assert.deepEqual(chinhTheoTheme([80, 250, 123], false, 'toi'), [80, 250, 123]);
  datCapMau(3); datTheme('sang');
  assert.doesNotMatch(mau('#50fa7b')('x'), /38;2;80;250;123/);
  datTheme('toi'); datCapMau(0);
});

test('16 màu (conhost cũ): chữ xám không thành đen tàng hình; nền tối vẫn tối', () => {
  datTheme('toi');
  assert.notEqual(rgbSang16(107, 114, 128), 30);
  assert.equal(rgbSang16(0, 0, 0, true), 30);
  datCapMau(1);
  assert.equal(nen('#12361f')('x'), '\x1b[40mx\x1b[49m');
  assert.match(mau('#ef4444')('x'), /^\x1b\[9[1]m|^\x1b\[31m/);
  datCapMau(0);
});

test('ASCII cho console cũ: dò Windows conhost, đổi ký hiệu cùng bề ngang', () => {
  assert.equal(canAscii({}, 'win32'), true);
  assert.equal(canAscii({ WT_SESSION: 'x' }, 'win32'), false);
  assert.equal(canAscii({ TERM_PROGRAM: 'vscode' }, 'win32'), false);
  assert.equal(canAscii({ TERM: 'xterm-256color' }, 'darwin'), false);
  assert.equal(canAscii({ TERM: 'linux' }, 'linux'), true);
  assert.equal(canAscii({ CUONGMINI_ASCII: '1' }, 'darwin'), true);
  const s = '╭─ ● Đọc(a) ⎿ ☑ việc ✓ Tiếng Việt có dấu ╯';
  const a = doiKyTu(s, true);
  assert.equal(a, '+- * Đọc(a) L x việc v Tiếng Việt có dấu +');
  assert.equal([...a].length, [...s].length);
  assert.equal(doiKyTu(s, false), s);
});

test('/terminal-setup: chèn keybinding vào keybindings.json có chú thích, không chèn lần 2', () => {
  const moi = chenKeybinding('');
  assert.ok(moi && moi.includes('"shift+enter"') && moi.includes('\\u001b\\r'));
  const coSan = '// chú thích của tôi\n[\n  { "key": "ctrl+k", "command": "x" } // cuối\n]\n';
  const r = chenKeybinding(coSan)!;
  assert.ok(r.startsWith('// chú thích của tôi'), 'giữ chú thích');
  assert.match(r, /"command": "x" \} \/\/ cuối,\n/);
  assert.equal(chenKeybinding(r), null);
  assert.ok(chenKeybinding('[]')!.includes('[\n  //'));
  assert.equal(doTerminal({ TERM_PROGRAM: 'iTerm.app' }), 'iterm');
  assert.equal(doTerminal({ WT_SESSION: '1' }), 'windowsTerminal');
});

test('rewind: cắt bảng ghi từ câu thứ n, đổi khoá để in lại', () => {
  const k = new KhoChat(true);
  k.them({ loai: 'chao' });
  k.batDauLuot('câu 1', 0, 'câu 1', 0); k.xuLy({ loai: 'xong', tienUsd: 0 });
  k.batDauLuot('câu 2', 0, 'câu 2', 0); k.xuLy({ loai: 'chu', delta: 'trả lời 2' }); k.xuLy({ loai: 'xong', tienUsd: 0 });
  const khoa = k.S.khoaBang;
  assert.equal(k.catBangTuCau(2), true);
  assert.deepEqual(k.S.bang.map((m) => m.loai), ['chao', 'nguoi', 'ketLuot']);
  assert.deepEqual(k.S.muc.map((m) => m.text), ['câu 1']);
  assert.equal(k.S.khoaBang, khoa + 1);
  assert.equal(k.catBangTuCau(5), false);
});

test('bảng ghi (ctrl+r/ctrl+o): vị trí khối đầu ra + mở rộng theo id', () => {
  datCapMau(0);
  const ra = Array.from({ length: 10 }, (_, i) => `d${i}`).join('\n');
  const bang = [
    { id: 1, loai: 'chao' as const },
    { id: 2, loai: 'nguoi' as const, text: 'hỏi', luc: 0, soAnh: 0 },
    { id: 3, loai: 'tool' as const, ten: 'run_command', tomTat: 'xong', lenh: 'ls', ra, hong: false, moRong: false },
    { id: 4, loai: 'shell' as const, lenh: 'git status', ra: 'sạch', ma: 0, giay: 0.2, moRong: false },
  ];
  const thu = dungBanGhi(bang, 60, new Set());
  assert.deepEqual(thu.khoi.map((k) => [k.id, k.nhan]), [[3, 'Lệnh ls'], [4, '! git status']]);
  assert.equal(boMau(thu.dong[thu.khoi[0]!.dau]!), '● Lệnh(ls)');
  const mo = dungBanGhi(bang, 60, new Set([3]));
  assert.ok(mo.dong.length > thu.dong.length);
  assert.ok(mo.dong.some((d) => boMau(d).includes('d0')));
});

test('cờ mới: --resume, --add-dir lặp, --output-format chỉ với -p, doctor', () => {
  assert.equal(phanTichCo(['-r']).chonViecCu, true);
  assert.deepEqual(phanTichCo(['--add-dir', '../a', '--add-dir=../b']).themThuMuc, ['../a', '../b']);
  assert.equal(phanTichCo(['-p', 'x', '--output-format', 'json']).dinhDang, 'json');
  assert.match(phanTichCo(['--output-format', 'json']).loi ?? '', /chỉ dùng cùng -p/);
  assert.match(phanTichCo(['-p', 'x', '--output-format', 'xml']).loi ?? '', /text, json, stream-json/);
  assert.equal(phanTichCo(['doctor']).lenh, 'doctor');
  assert.equal(phanTichCo(['--dangerously-skip-permissions']).cheDo, 'boQuaHet');
  assert.equal(phanTichCo(['--verbose']).chiTiet, true);
});

test('trình duyệt cho AI: mặc định bật khi có Chrome/Edge; báo một lần khi tool web đầu tiên chạy', () => {
  assert.equal(nenBatTrinhDuyet({ trinhDuyet: 'tuDong' }, true), true);
  assert.equal(nenBatTrinhDuyet({ trinhDuyet: 'tuDong' }, false), false);
  assert.equal(nenBatTrinhDuyet({ trinhDuyet: 'tat' }, true), false);
  assert.equal(nenBatTrinhDuyet({ trinhDuyet: 'bat' }, false), true);
  const k = new KhoChat(true);
  k.batDauLuot('mở web', 0, 'mở web', 0);
  k.xuLy({ loai: 'toolBatDau', id: 'a', ten: 'web_mo', vong: 'may' });
  k.xuLy({ loai: 'tool', id: 'a', ten: 'web_mo', tomTat: 'example.com', vong: 'may' });
  k.xuLy({ loai: 'toolBatDau', id: 'b', ten: 'web_doc', vong: 'may' });
  const bao = k.S.bang.filter((m) => m.loai === 'thongBao' && /trình duyệt riêng/.test(m.text));
  assert.equal(bao.length, 1);
});
