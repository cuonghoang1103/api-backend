/**
 * `cuongmini doctor` trên Windows (doctorWin.ts) — phần thuần, chạy được trên macOS/Linux.
 * Các trường hợp lấy từ lượt đo thật trên runner windows-latest 18/10/2026.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { datNgonNgu } from '../i18n';
import { doShell, kiemWindowsThuan, lenhNapPath, moRongBien, pathCo, thuMucLenhWin } from '../doctorWin';

datNgonNgu('vi');
const env = { LOCALAPPDATA: 'C:\\Users\\Cường\\AppData\\Local', USERPROFILE: 'C:\\Users\\Cường' };
const DIR = 'C:\\Users\\Cường\\AppData\\Local\\CuongMini\\bin';

test('thư mục lệnh mặc định + mở rộng %BIẾN% kiểu Windows', () => {
  assert.equal(thuMucLenhWin(env), DIR);
  assert.equal(moRongBien('%localappdata%\\CuongMini\\bin;%LA%', env), `${DIR};%LA%`);
  assert.ok(pathCo('%USERPROFILE%\\x;%LOCALAPPDATA%\\CuongMini\\bin\\', DIR, env));
  assert.ok(!pathCo('C:\\Windows', DIR, env));
});

test('đoán shell theo chuỗi tiến trình cha', () => {
  assert.equal(doShell({}, ['cmd.exe', 'powershell.exe', 'WindowsTerminal.exe']), 'powershell');
  assert.equal(doShell({}, ['cmd.exe', 'pwsh.exe']), 'pwsh');
  assert.equal(doShell({}, ['cmd.exe', 'explorer.exe']), 'cmd');
  assert.equal(doShell({}, ['bash.exe', 'mintty.exe']), 'gitbash');
  assert.equal(doShell({ MSYSTEM: 'MINGW64' }, []), 'gitbash');
  assert.equal(doShell({}, []), 'khac');
});

test('lệnh nạp PATH đúng cú pháp từng shell', () => {
  assert.equal(lenhNapPath('cmd', DIR), `set "PATH=%PATH%;${DIR}"`);
  assert.equal(lenhNapPath('gitbash', DIR), 'export PATH="$PATH:/c/Users/Cường/AppData/Local/CuongMini/bin"');
  assert.match(lenhNapPath('powershell', DIR), /^\$env:Path = \[Environment\]::GetEnvironmentVariable\('Path','Machine'\)/);
});

test('PATH người dùng có nhưng cửa sổ mở trước khi cài ⇒ cảnh báo + lệnh sửa cho PowerShell', () => {
  const ds = kiemWindowsThuan({
    env: { ...env, Path: 'C:\\Windows', WT_SESSION: 'x' },
    pathNguoiDung: '%USERPROFILE%\\AppData\\Local\\Microsoft\\WindowsApps;%LOCALAPPDATA%\\CuongMini\\bin',
    chuoiCha: ['cmd.exe', 'powershell.exe', 'WindowsTerminal.exe'],
    tty: { vao: true, ra: true },
  });
  const p = ds.find((m) => m.ten.startsWith('PATH'))!;
  assert.equal(p.muc, 'canh');
  assert.match(p.chiTiet, /Đóng HẲN Windows Terminal/);
  assert.match(p.chiTiet, /\$env:Path = /);
  assert.match(ds.find((m) => m.ten === 'Shell')!.chiTiet, /Windows PowerShell 5\.1 · Windows Terminal/);
});

test('chưa có trong PATH người dùng ⇒ bảo chạy lại lệnh cài; có đủ ⇒ ok', () => {
  const thieu = kiemWindowsThuan({ env: { ...env, Path: '' }, pathNguoiDung: 'C:\\x', chuoiCha: ['cmd.exe'], tty: { vao: true, ra: true } });
  assert.match(thieu[0]!.chiTiet, /CHƯA có trong PATH người dùng/);
  const du = kiemWindowsThuan({ env: { ...env, Path: `C:\\Windows;${DIR}` }, pathNguoiDung: DIR, chuoiCha: ['cmd.exe'], tty: { vao: true, ra: true } });
  assert.equal(du[0]!.muc, 'ok');
  // Cài vào thư mục tuỳ chỉnh: kiểm thư mục của lệnh `where` tìm thấy, không phải thư mục mặc định.
  const rieng = kiemWindowsThuan({ env: { ...env, Path: 'D:\\cm' }, lenhTimThay: 'D:\\cm\\cuongmini.cmd', pathNguoiDung: 'D:\\cm', chuoiCha: [], tty: { vao: true, ra: true } });
  assert.equal(rieng[0]!.muc, 'ok');
});

test('Git Bash (mintty) không TTY ⇒ chỉ cách winpty / Windows Terminal', () => {
  const ds = kiemWindowsThuan({ env: { ...env, Path: DIR, MSYSTEM: 'MINGW64' }, pathNguoiDung: DIR, chuoiCha: ['bash.exe', 'mintty.exe'], tty: { vao: false, ra: false } });
  const t = ds.find((m) => m.ten === 'TTY')!;
  assert.equal(t.muc, 'canh');
  assert.match(t.chiTiet, /winpty/);
});
