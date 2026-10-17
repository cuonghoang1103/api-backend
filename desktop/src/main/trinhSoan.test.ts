import { describe, expect, it } from 'vitest';
import { MA_TRINH_SOAN } from '../shared/ipc';
import { DANH_SACH, deepLink, docPhienBanExt, moiTruongSach, ungVien } from './trinhSoan';

describe('trinhSoan — dò trình soạn để cài CuongMini Code', () => {
  it('danh sách trắng ở shared khớp đúng bảng thông tin ở main', () => {
    expect(DANH_SACH.map((t) => t.ma).sort()).toEqual([...MA_TRINH_SOAN].sort());
  });

  it('deep link đúng dạng <scheme>:extension/<id>', () => {
    expect(deepLink('vscode')).toBe('vscode:extension/cuongthai.cuongthai-ai-code');
    expect(deepLink('antigravity')).toBe('antigravity:extension/cuongthai.cuongthai-ai-code');
  });

  it('macOS: tìm CLI trong gói .app trước, rồi mới tới PATH', () => {
    const u = ungVien('vscode', 'darwin', { PATH: '/usr/local/bin' }, '/Users/a');
    expect(u.app[0]).toBe('/Applications/Visual Studio Code.app');
    expect(u.cli[0]).toBe('/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code');
    expect(u.cli).toContain('/usr/local/bin/code');
  });

  it('Windows: dùng .cmd trong %LOCALAPPDATA%\\Programs, Cursor sâu thêm một tầng', () => {
    const env = { LOCALAPPDATA: 'C:\\Users\\a\\AppData\\Local', Path: 'C:\\bin' };
    const vs = ungVien('vscode', 'win32', env, 'C:\\Users\\a');
    expect(vs.cli[0]).toBe('C:\\Users\\a\\AppData\\Local\\Programs\\Microsoft VS Code\\bin\\code.cmd');
    const cu = ungVien('cursor', 'win32', env, 'C:\\Users\\a');
    expect(cu.cli).toContain('C:\\Users\\a\\AppData\\Local\\Programs\\cursor\\resources\\app\\bin\\cursor.cmd');
    expect(cu.cli).toContain('C:\\bin\\cursor.cmd');
  });

  it('Linux: VSCodium là lệnh `codium`, có cả chỗ quen thuộc khi PATH cụt', () => {
    const u = ungVien('vscodium', 'linux', { PATH: '' }, '/home/a');
    expect(u.cli).toContain('/usr/bin/codium');
    expect(u.cli).toContain('/snap/bin/codium');
    expect(u.app).toEqual([]);
  });

  it('đọc phiên bản extension, không phân biệt hoa thường, bỏ qua extension khác', () => {
    const ra = 'ms-python.python@2026.1.0\r\nCuongThai.cuongthai-ai-code@0.3.0\nesbenp.prettier-vscode@11.0.0\n';
    expect(docPhienBanExt(ra)).toBe('0.3.0');
    expect(docPhienBanExt('ms-python.python@1.0.0')).toBeNull();
    expect(docPhienBanExt('')).toBeNull();
  });

  it('môi trường cho CLI bỏ biến làm Electron/VS Code chạy sai chế độ', () => {
    const env = moiTruongSach({
      PATH: '/bin', ELECTRON_RUN_AS_NODE: '1', NODE_OPTIONS: '--x', VSCODE_IPC_HOOK_CLI: '/tmp/s', HOME: '/h',
    });
    expect(env).toEqual({ PATH: '/bin', HOME: '/h' });
  });
});
