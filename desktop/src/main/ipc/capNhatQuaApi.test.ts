/**
 * Đường cập nhật dự phòng qua api.github.com — xem `capNhatQuaApi.ts`.
 * Phần gọi mạng thật đã thử tay 08/11/2026 (mac/win/linux × CuongThai + CT Work, tải được 206).
 */
import { describe, it, expect } from 'vitest';
import { loiCapNhatDeDoc, timTaiSan, urlApiPhatHanh } from './capNhatQuaApi';

/** Đúng hình dạng lỗi người dùng chụp màn hình 08/11/2026: HTML + header + stack, hàng chục dòng. */
const LOI_THAT = `Cannot parse releases feed: Error: Unable to find latest version on GitHub (https://github.com/cuonghoang1103/cuongthai-desktop/releases/latest), please ensure a production release exists: HttpError: 504 
"<html><body><h1>504 Gateway Time-out</h1>\\nThe server didn't respond in time.\\n</body></html>\\n"
Headers: { "cache-control": "no-cache", "content-length": "92", "content-type": "text/html" }
    at createHttpError (/Applications/CuongThai.app/Contents/Resources/app.asar/node_modules/builder-util-runtime/out/httpExecutor.js:22:12)`;

describe('loiCapNhatDeDoc', () => {
  it('lỗi GitHub 504 → một câu tiếng Việt, chi tiết thô vẫn giữ', () => {
    const r = loiCapNhatDeDoc(LOI_THAT);
    expect(r.message).toMatch(/Chưa kết nối được máy chủ cập nhật/);
    expect(r.message).not.toMatch(/<html>|Headers/);
    expect(r.chiTiet).toContain('504');
  });

  it('lỗi mạng (offline) cũng là "chưa kết nối được"', () => {
    expect(loiCapNhatDeDoc('net::ERR_INTERNET_DISCONNECTED').message).toMatch(/Chưa kết nối/);
    expect(loiCapNhatDeDoc('getaddrinfo ENOTFOUND github.com').message).toMatch(/Chưa kết nối/);
  });

  it('lỗi lạ: chỉ dòng đầu, cắt ≤ 181 ký tự; lỗi ngắn một dòng thì không có chi tiết thừa', () => {
    const dai = `${'x'.repeat(400)}\ndòng hai`;
    const r = loiCapNhatDeDoc(dai);
    expect(r.message.length).toBeLessThanOrEqual(181);
    expect(r.chiTiet).toBe(dai);
    expect(loiCapNhatDeDoc('sha512 checksum mismatch')).toEqual({ message: 'sha512 checksum mismatch' });
  });

  it('chi tiết thô bị cắt — không đẩy cả trang HTML qua IPC', () => {
    expect(loiCapNhatDeDoc('x'.repeat(5000)).chiTiet!.length).toBeLessThanOrEqual(1501);
  });
});

describe('timTaiSan / urlApiPhatHanh', () => {
  const ds = [
    { name: 'latest-mac.yml', url: 'https://api.github.com/repos/a/b/releases/assets/1' },
    { name: 'CuongThai-Setup-0.5.212.exe', url: 'https://api.github.com/repos/a/b/releases/assets/2' },
  ];
  it('tìm theo tên gốc; dấu cách đổi thành "-" như GitHub làm khi tải lên', () => {
    expect(timTaiSan(ds, 'latest-mac.yml')?.url).toMatch(/assets\/1$/);
    expect(timTaiSan(ds, 'CuongThai Setup 0.5.212.exe')?.url).toMatch(/assets\/2$/);
    expect(timTaiSan(ds, 'khong-co.zip')).toBeUndefined();
  });
  it('địa chỉ API: latest và theo tag', () => {
    expect(urlApiPhatHanh('a/b')).toBe('https://api.github.com/repos/a/b/releases/latest');
    expect(urlApiPhatHanh('a/b', 'v1.0.0')).toBe('https://api.github.com/repos/a/b/releases/tags/v1.0.0');
  });
});
