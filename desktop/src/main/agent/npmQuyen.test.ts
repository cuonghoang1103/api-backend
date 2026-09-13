import { describe, expect, it } from 'vitest';

import {
  goiYKhiThieuQuyen, laCaiNpmToanCuc, lenhSuaPrefixNpm, nhanRaLoiQuyen,
  themVaoPath, thuMucNpmRieng,
} from './npmQuyen';

const MT_WIN = { LOCALAPPDATA: 'C:\\Users\\an\\AppData\\Local' } as NodeJS.ProcessEnv;
const MT_NIX = { HOME: '/Users/an' } as NodeJS.ProcessEnv;

describe('nhận ra lỗi thiếu quyền', () => {
  /* Đầu ra THẬT, chép từ ba hệ. Viết regex theo trí nhớ rồi tin nó là cách
     bỏ sót đúng cái câu mà người dùng đang gặp. */
  const THAT = [
    "npm ERR! code EACCES\nnpm ERR! syscall mkdir\nnpm ERR! path /usr/local/lib/node_modules",
    'npm ERR! code EPERM\nnpm ERR! errno -4048\nnpm ERR! Error: EPERM: operation not permitted',
    'Error: EACCES: permission denied, access /usr/lib/node_modules',
    'Access is denied.',
    'mkdir: cannot create directory: Permission denied',
    'This command requires elevation.',
  ];

  for (const ra of THAT) {
    it(`bắt được: ${ra.split('\n')[0]!.slice(0, 46)}`, () => {
      expect(nhanRaLoiQuyen(ra)).toBe(true);
    });
  }

  it('⛔ KHÔNG nhận nhầm lỗi thường', () => {
    // Báo nhầm thì mọi lệnh hỏng đều kèm một bài giảng về quyền, và model
    // thôi đọc phần đó — lúc cần thật thì nó cũng bỏ qua.
    expect(nhanRaLoiQuyen('npm ERR! 404 Not Found - GET https://registry.npmjs.org/khong-co')).toBe(false);
    expect(nhanRaLoiQuyen('Error: Cannot find module "abc"')).toBe(false);
    expect(nhanRaLoiQuyen('2 tests failed')).toBe(false);
    expect(nhanRaLoiQuyen('')).toBe(false);
  });
});

describe('nhận ra lệnh cài gói toàn cục', () => {
  it('bắt -g, --global, --location=global', () => {
    expect(laCaiNpmToanCuc('npm i -g opencode-ai')).toBe(true);
    expect(laCaiNpmToanCuc('npm install --global typescript')).toBe(true);
    expect(laCaiNpmToanCuc('npm install --location=global eslint')).toBe(true);
    expect(laCaiNpmToanCuc('pnpm add -g vite')).toBe(true);
  });

  it('⛔ KHÔNG nhận nhầm cài trong dự án', () => {
    expect(laCaiNpmToanCuc('npm install')).toBe(false);
    expect(laCaiNpmToanCuc('npm i react')).toBe(false);
    // `-g` phải là một THAM SỐ riêng, không phải mẩu chữ trong tên gói.
    expect(laCaiNpmToanCuc('npm i my-g-package')).toBe(false);
    expect(laCaiNpmToanCuc('npm run build-global')).toBe(false);
  });

  it('lệnh khác npm thì không phải ca này', () => {
    expect(laCaiNpmToanCuc('apt install -g abc')).toBe(false);
  });
});

describe('thư mục và lệnh sửa prefix', () => {
  it('Windows dùng LOCALAPPDATA', () => {
    expect(thuMucNpmRieng('win32', MT_WIN)).toBe('C:\\Users\\an\\AppData\\Local\\npm-global');
    expect(lenhSuaPrefixNpm('win32', MT_WIN)).toContain('npm config set prefix');
  });

  it('macOS/Linux dùng HOME', () => {
    expect(thuMucNpmRieng('darwin', MT_NIX)).toBe('/Users/an/.npm-global');
    expect(thuMucNpmRieng('linux', MT_NIX)).toBe('/Users/an/.npm-global');
  });

  it('⛔ lệnh sửa prefix KHÔNG được chứa sudo/runas', () => {
    // Cả điểm của cách này là không cần quyền. Lọt một chữ `sudo` vào đây là
    // quay lại đúng vấn đề ban đầu, và gói lại thuộc về root.
    for (const nen of ['win32', 'darwin', 'linux'] as const) {
      expect(lenhSuaPrefixNpm(nen)).not.toMatch(/\b(sudo|runas|pkexec)\b/);
      expect(themVaoPath(nen)).not.toMatch(/\b(sudo|runas|pkexec)\b/);
    }
  });

  it('câu thêm PATH nói đúng thư mục vừa đặt', () => {
    // Đổi prefix mà quên PATH thì cài xong gõ tên lệnh vẫn "command not
    // found", và người dùng kết luận là cách này không ăn thua.
    expect(themVaoPath('darwin', MT_NIX)).toContain('/Users/an/.npm-global');
    expect(themVaoPath('win32', MT_WIN)).toContain('npm-global');
  });
});

describe('gợi ý nhét vào đầu ra tool', () => {
  const LOI_EACCES = 'npm ERR! code EACCES\nnpm ERR! permission denied';

  it('npm -g + thiếu quyền ⇒ chỉ đường ĐỔI PREFIX, không chỉ đường nâng quyền', () => {
    const g = goiYKhiThieuQuyen('npm i -g opencode-ai', LOI_EACCES, 'win32', MT_WIN);
    expect(g).toContain('npm config set prefix');
    expect(g).not.toContain('quyen_cao');
    // Và phải nói RÕ là đừng bảo người dùng tự mở cửa sổ admin — đó chính là
    // lời khuyên mà họ đã làm mãi không xong.
    expect(g).toContain('ĐỪNG');
  });

  it('lệnh khác + thiếu quyền ⇒ chỉ đường quyen_cao', () => {
    const g = goiYKhiThieuQuyen('apt install ffmpeg', 'Permission denied', 'linux', MT_NIX);
    expect(g).toContain('quyen_cao');
    expect(g).toContain('polkit');
  });

  it('⛔ lệnh hỏng vì lý do KHÁC ⇒ không thêm chữ nào', () => {
    expect(goiYKhiThieuQuyen('npm i -g x', 'npm ERR! 404 Not Found', 'win32', MT_WIN)).toBe('');
    expect(goiYKhiThieuQuyen('npm test', '3 failed', 'darwin', MT_NIX)).toBe('');
  });
});
